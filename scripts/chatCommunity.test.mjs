import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import vm from 'node:vm';
import { randomUUID } from 'node:crypto';
const require = createRequire(new URL('../chat-git-main/package.json', import.meta.url));
const model = require('./services/chat/communityModel');
const networkState = require('./services/network/state');
const DAY = model.DAY, now = Date.UTC(2026, 8, 6, 12);
const request = (action, more={}) => ({ action, requestId:randomUUID(), ...more });

test('chat moderation allows ordinary language and normal links while blocking explicit adult content', () => {
  for (const message of [
    'this game is fucking impossible',
    'you played like an asshole lol',
    'nigger',
    'the notes are at https://example.com/class-notes',
    'we covered consent in sex education today'
  ]) assert.equal(networkState.moderateChatText(message).allowed, true, message);

  for (const message of [
    'go to https://pornhub.com/video/123',
    'pornhub.com/video/123',
    'here is the NSFW link https://example.com/watch',
    'send me nude pictures',
    'share underage nudes',
    'I am going to shoot you'
  ]) assert.equal(networkState.moderateChatText(message).allowed, false, message);
});

test('spam moderation allows normal pace and gives only the flooding account a one-minute timeout', () => {
  const first = { userId:`spam-${randomUUID()}` };
  const second = { userId:`normal-${randomUUID()}` };
  const base = now + 500_000;
  assert.equal(networkState.checkSpam(first, 'hello', { now:base }).blocked, false);
  assert.equal(networkState.checkSpam(first, 'hello', { now:base + 1000 }).blocked, false);
  const detected = networkState.checkSpam(first, 'hello', { now:base + 2000 });
  assert.equal(detected.blocked, true);
  assert.equal(detected.reason, 'spam_detected');
  assert.equal(detected.retryAfterMs, 60_000);
  assert.equal(networkState.checkSpam(second, 'hello', { now:base + 2100 }).blocked, false);
  const timedOut = networkState.checkSpam(first, 'different message', { now:base + 12_000 });
  assert.equal(timedOut.reason, 'spam_timeout');
  assert.equal(timedOut.retryAfterMs, 50_000);
  assert.equal(networkState.checkSpam(first, 'back now', { now:base + 62_001 }).blocked, false);
});

test('reply metadata is anchored to the referenced account identity', () => {
  const memoryFs = { existsSync:()=>false, mkdirSync:()=>{}, writeFileSync:()=>{}, renameSync:()=>{} };
  const store = loadModule('../chat-git-main/services/chat/messageFeatureStore.js', { fs:memoryFs });
  store.recordMessage('general', {
    id:'message-1', userId:'account-1', username:'account_name', nickname:'Current Name', body:'hello'
  });
  const reply = store.resolveReply('general', {
    messageId:'message-1', author:'Wrong Browser Name', authorId:'wrong-id', authorUsername:'wrong_username', preview:'hello'
  });
  assert.equal(reply.authorId, 'account-1');
  assert.equal(reply.authorUsername, 'account_name');
  assert.equal(reply.author, 'Current Name');
});

test('presence enrichment restores avatars, banners, and profile effects for other users', () => {
  const presence = require('./services/network/presence');
  const clientId = `presence-${randomUUID()}`;
  const room = `room-${randomUUID()}`;
  presence.touch(clientId, room, { username:'visible_user', userId:'account-1' });
  try {
    const snapshot = presence.enrichUsers(() => ({
      avatar:'data:image/png;base64,AAAA',
      equippedAvatarEffect:'avatar_orbit',
      equippedBanner:'banner_aurora',
      equippedProfileEffect:'profile_stardust'
    }));
    const visible = snapshot.users[room][0];
    assert.equal(visible.avatar, 'data:image/png;base64,AAAA');
    assert.equal(visible.equippedAvatarEffect, 'avatar_orbit');
    assert.equal(visible.equippedBanner, 'banner_aurora');
    assert.equal(visible.equippedProfileEffect, 'profile_stardust');
  } finally {
    presence.remove(clientId);
  }
});

test('shop retries cannot double charge or buy a different item with the same request', () => {
  const command=request('buy_store',{itemId:'badge_star'});
  const purchased=model.action({},2000,command,{now});
  assert.equal(purchased.coins,1400);
  const restored=JSON.parse(JSON.stringify(purchased.state));
  assert.equal(model.action(restored,1400,command,{now}).coins,1400);
  assert.throws(()=>model.action(restored,1400,{...command,itemId:'badge_verified'},{now}),/different/);
  const removed=model.action(restored,1400,request('equip_badge',{itemId:'none'}),{now});
  const equipped=model.action(removed.state,0,request('equip_badge',{itemId:'badge_star'}),{now});
  assert.equal(equipped.coins,0);assert.equal(equipped.state.equippedBadge,'badge_star');
  assert.equal(model.action(equipped.state,0,request('buy_store',{itemId:'badge_star'}),{now}).coins,0);
  assert.throws(()=>model.action({},2000,request('equip_badge',{itemId:'badge_verified'}),{now}),/do not own/);
});

test('weekly lottery accepts any affordable whole contribution and issues one ticket', () => {
  const catalog=model.snapshot({},2000,now).store.items;
  assert.equal(catalog.some(x=>x.id==='proxy_priority'),false);
  assert.equal(catalog.some(x=>x.id==='lottery_ticket'),false);
  const command=request('lottery_enter',{amount:137});
  const entered=model.action({},2000,command,{now});
  assert.equal(entered.coins,1863);assert.equal(entered.result.kind,'lottery_entry');
  assert.deepEqual(entered.state.lotteryEntry,{week:model.lotteryWeek(now),amount:137,enteredAt:now,requestId:command.requestId});
  assert.equal(model.action(entered.state,entered.coins,command,{now}).coins,1863);
  assert.throws(()=>model.action(entered.state,entered.coins,request('lottery_enter',{amount:1}),{now}),/already have a ticket/);
  assert.throws(()=>model.action(entered.state,entered.coins,{...command,amount:99},{now}),/different action/);
  for(const amount of [0,-1,1.5,'10',NaN,Infinity]) assert.throws(()=>model.action({},2000,request('lottery_enter',{amount}),{now}),/positive whole/);
  assert.throws(()=>model.action({},10,request('lottery_enter',{amount:11}),{now}),/Not enough/);
  assert.throws(()=>model.action({},2000,request('buy_store',{itemId:'proxy_priority'}),{now}),/Unknown/);
  const view=model.snapshot(entered.state,entered.coins,now).store.lottery;
  assert.equal(view.entered,true);assert.equal(view.entryAmount,137);assert.equal(view.ticketCount,1);assert.equal(view.oneTicketPerUser,true);
  const bounds=model.lotteryBounds(model.lotteryWeek(now));
  assert.equal(new Date(bounds.startAt).getUTCDay(),1);assert.equal(bounds.endAt-bounds.startAt,7*DAY);
});

test('custom status retries preserve the text', () => {
  const command=request('buy_store',{itemId:'custom_status',text:'Hello'});
  const purchase=model.action({},2000,command,{now});
  assert.equal(purchase.coins,1750);assert.equal(purchase.state.customStatus,'Hello');
  assert.throws(()=>model.action(purchase.state,1750,{...command,text:'Changed'},{now}),/different/);
});

test('daily claims persist, only pay once per UTC day, and streaks advance/reset', () => {
  const command=request('daily'); const one=model.action({},0,command,{now});
  assert.equal(one.coins,100);
  assert.equal(model.action(JSON.parse(JSON.stringify(one.state)),one.coins,command,{now}).coins,100);
  assert.throws(()=>model.action(one.state,one.coins,request('daily'),{now}), /already/);
  const next=model.action(one.state,100,request('daily'),{now:now+DAY});
  assert.equal(next.coins,225); assert.equal(next.state.streak,2);
  const gap=model.action(next.state,225,request('daily'),{now:now+3*DAY});
  assert.equal(gap.state.streak,1); assert.equal(gap.state.bestStreak,2);
});
test('casino deducts coins on bet and returns payout on win', () => {
  const command=request('casino',{game:'videopoker',move:'deal',bet:10});
  let draws=0; const options={now,randomInt:()=>{draws++;return 0;}};
  const dealt=model.action({},900,command,options);
  assert.equal(dealt.coins,890); // 900 - 10 bet
  assert.equal(dealt.state.casinoRound.player.length,5);
  const replay=model.action(dealt.state,890,command,options);
  assert.equal(replay.coins,890); assert.equal(draws,51);
  assert.throws(()=>model.action(dealt.state,890,{...command,bet:20},options), /different/);
  for(const bet of [-1,0,0.5,NaN,'10',Infinity]) assert.throws(()=>model.action({},900,request('casino',{game:'videopoker',move:'deal',bet}),options), /Invalid bet amount/);
  assert.throws(()=>model.action({},5,request('casino',{game:'videopoker',move:'deal',bet:10}),options), /Not enough/);
  const replay2=model.action(dealt.state,890,request('casino',{game:'blackjack',move:'deal',bet:10}),options);
  assert.ok(replay2.state.casinoRound);
  assert.throws(()=>model.action({},900,request('casino',{game:'dice',move:'deal',bet:10}),options), /current casino game/);
});
test('free spin and membership are authoritative and no private metadata leaks', () => {
  const spin=model.action({},0,request('spin'),{now,randomInt:()=>4});
  assert.equal(spin.coins,200);
  assert.throws(()=>model.action(spin.state,200,request('spin'),{now}),/already/);
  assert.throws(()=>model.action({},2500,request('premium'),{now}),/coming soon/);
  const existing={premiumUntil:now+30*DAY};
  const view=model.snapshot({...existing,recoveryHashes:[model.hashCode('secret')],authVersion:2},2500,now);
  assert.equal(view.recovery.remaining,1); assert.ok(!('recoveryHashes' in view)); assert.ok(!('authVersion' in view));
  assert.equal(view.premium.active,true); assert.equal(view.premium.available,false); assert.equal(model.snapshot(existing,2500,now+31*DAY).premium.active,false);
});
test('profile and privacy validation is strict and handles malformed dates safely',()=>{
  assert.equal(model.updateProfile({}, {birthday:'02-29',pronouns:'they/them'},false).profile.birthday,'02-29');
  for(const birthday of ['02-30','13-02','00-00','2026-01-01',null]) assert.throws(()=>model.updateProfile({}, {birthday},false),/MM-DD/);
  assert.throws(()=>model.updateProfile({}, {nameColor:'#ffffff'},false),/membership/);
  assert.throws(()=>model.updateProfile({}, {nameColor:'url(x)'},true),/color/);
  assert.throws(()=>model.updatePrivacy({}, {dms:'allow-all-admin'}),/Invalid/);
  assert.equal(model.updatePrivacy({}, {dms:'none'}).privacy.dms,'none');
});

function loadModule(path, overrides) {
  const filename=new URL(path,import.meta.url);
  const filenamePath=fileURLToPath(filename);
  const localRequire=createRequire(filename);
  const module={exports:{}};
  vm.runInNewContext(readFileSync(filename,'utf8'),{require:name=>Object.hasOwn(overrides,name)?overrides[name]:localRequire(name),module,exports:module.exports,__filename:filenamePath,__dirname:dirname(filenamePath),console,process:{env:{}},Buffer,Date,setTimeout,clearTimeout},{filename:filenamePath});
  return module.exports;
}
test('weekly lottery settlement pays the full shared pot exactly once',async()=>{
  const week=model.lotteryWeek(now);
  const users=[
    {_id:'a',username:'alice',coins:900,community:model.normalize({lotteryEntry:{week,amount:100,enteredAt:now,requestId:randomUUID()}})},
    {_id:'b',username:'bob',coins:800,community:model.normalize({lotteryEntry:{week,amount:200,enteredAt:now+1,requestId:randomUUID()}})},
    {_id:'c',username:'carol',coins:700,community:model.normalize({lotteryEntry:{week,amount:300,enteredAt:now+2,requestId:randomUUID()}})}
  ];
  const local={
    listUsers:()=>users,findById:id=>users.find(user=>user._id===id),
    communityTransaction:(id,callback)=>{const user=users.find(entry=>entry._id===id);return callback(user);}
  };
  const store=loadModule('../chat-git-main/services/chat/communityStore.js',{'../auth/localStore':local,'../db/profileStore':{}});
  const before=users.reduce((sum,user)=>sum+user.coins,0);
  const close=model.lotteryBounds(week).endAt+1;
  const draws=await store.settleLottery('local',close);
  assert.equal(draws.length,1);assert.equal(draws[0].pot,600);assert.equal(draws[0].ticketCount,3);assert.equal(draws[0].paid,true);
  assert.equal(users.reduce((sum,user)=>sum+user.coins,0),before+600);
  const winner=users.find(user=>user.community.lotteryLast?.week===week);
  assert.ok(winner);assert.equal(winner.community.lotteryLast.payout,600);assert.equal(winner.community.lotteryWins,1);
  assert.equal((await store.settleLottery('local',close+1000)).length,0);
  assert.equal(users.reduce((sum,user)=>sum+user.coins,0),before+600);
});
test('contact privacy checks both block lists, friends, and friends-of-friends',async()=>{
  const alice={_id:'a',username:'alice',coins:100,friends:['bob','carol'],community:{}};
  const bob={_id:'b',username:'bob',coins:100,friends:['alice','carol'],community:{privacy:{dms:'friends',friendRequests:'mutual'}}};
  const users=[alice,bob];
  const local={findById:id=>users.find(u=>u._id===id),findByUsername:n=>users.find(u=>u.username===n),listUsers:()=>users};
  const store=loadModule('../chat-git-main/services/chat/communityStore.js',{'../auth/localStore':local,'../db/profileStore':{}});
  await store.assertContact(alice,bob,'dm'); await store.assertContact(alice,bob,'friend');
  alice.community={blocked:[{id:'b',username:'bob'}]}; await assert.rejects(store.assertContact(alice,bob,'dm'),/blocked/);
  alice.community={};bob.community={blocked:[{id:'a',username:'alice'}]};await assert.rejects(store.assertContact(alice,bob,'friend'),/blocked/);
  bob.community={privacy:{dms:'none'}};await assert.rejects(store.assertContact(alice,bob,'dm'),/privacy/);
  bob.community={privacy:{dms:'friends'}};alice.friends=[];await assert.rejects(store.assertContact(alice,bob,'dm'),/privacy/);
  await store.assertContact(alice,bob,'blocked');
});

test('database adapter locks wallet and metadata together and never falls back on failure',async()=>{
  const queries=[];let context;
  const profiles={transaction:async fn=>fn({query:async(sql,args)=>{queries.push({sql,args});return /select p.coins/.test(sql)?{rows:[{coins:0,community:{},is_premium:false,password_hash:'hash'}]}:{rows:[]};}})};
  const local={communityTransaction:()=>assert.fail('DB must not fall back to local wallet')};
  const store=loadModule('../chat-git-main/services/chat/communityStore.js',{'../auth/localStore':local,'../db/profileStore':profiles});
  await store.mutate({id:'db-user',source:'database'},ctx=>{context=ctx;const next=model.action(ctx.state,ctx.coins,request('daily'),{now});ctx.state=next.state;ctx.coins=next.coins;});
  assert.match(queries[0].sql,/for update of p,u/);assert.equal(context.coins,100);
  assert.equal(queries.filter(q=>/update public.users/.test(q.sql)).length,1);
  assert.equal(queries.filter(q=>/update public.profiles/.test(q.sql)).length,1);
  profiles.transaction=async()=>{throw new Error('database unavailable');};
  await assert.rejects(store.mutate({id:'db-user',source:'database'},()=>{}),/database unavailable/);
});

test('real community routes: authorization, retry-safe rewards, support isolation, recovery once',async()=>{
  const express=require('express'), bcrypt=require('bcryptjs');
  const credentials=await bcrypt.hash('before-password',4);
  const accounts=new Map(['alice','bob','owner'].map(name=>[name,{state:model.normalize(),coins:0,premium:false,passwordHash:credentials}]));
  const users=new Map([...accounts.keys()].map(name=>[name,{id:name,_id:name,username:name,role:name==='owner'?'owner':'user'}]));
  const fakeStore={
    id:u=>u?.id||u?._id||'',databaseConfigured:()=>false,
    settleLottery:async()=>[],invalidateLottery:()=>{},
    lotteryView:async(u,s)=>model.snapshot(s,accounts.get(u.id)?.coins||0,Date.now()).store.lottery,
    read:async u=>structuredClone(accounts.get(u.id)),
    mutate:async(u,fn)=>{const ctx=structuredClone(accounts.get(u.id));const result=fn(ctx);if(ctx.newPasswordHash)ctx.passwordHash=ctx.newPasswordHash;accounts.set(u.id,ctx);return result;},
    resolveUsername:async name=>users.get(name),
    leaderboard:async()=>[],supportInbox:async()=>[...accounts.entries()].flatMap(([name,ctx])=>ctx.state.tickets.map(t=>({...t,userId:name,username:name})))
  };
  const local={findByIdentifier:n=>users.get(n),findById:n=>({...users.get(n),password:accounts.get(n)?.passwordHash})};
  const router=loadModule('../chat-git-main/routes/community.js',{
    '../middleware/auth':(req,res,next)=>{const user=users.get(req.get('x-auth-token'));if(!user)return res.status(401).json({msg:'Sign in'});req.user=user;req.authToken='opaque';next();},
    '../services/auth/localStore':local,'../services/chat/communityStore':fakeStore,'../services/db/profileStore':{},
    '../middleware/security':{rateLimit:()=> (_req,_res,next)=>next()}
  });
  const app=express();app.use(express.json());app.use('/api/community',router);
  const server=app.listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));
  const base=`http://127.0.0.1:${server.address().port}/api/community`;
  const call=async(path,{user='alice',method='GET',body}={})=>{const res=await fetch(base+path,{method,headers:{'content-type':'application/json',...(user?{'x-auth-token':user}:{})},body:body?JSON.stringify(body):undefined});return {status:res.status,body:await res.json(),headers:res.headers};};
  try {
    assert.equal((await call('/me',{user:''})).status,401);
    const command=request('daily');
    const pair=await Promise.all([call('/action',{method:'POST',body:command}),call('/action',{method:'POST',body:command})]);
    assert.equal(pair[0].status,200);assert.equal(pair[1].status,200);assert.equal(accounts.get('alice').coins,100);
    assert.equal((await call('/action',{method:'POST',body:request('daily')})).status,409);
    const lottery=await call('/action',{method:'POST',body:request('lottery_enter',{amount:75})});
    assert.equal(lottery.status,200);assert.equal(lottery.body.state.coins,25);assert.equal(lottery.body.state.store.lottery.entered,true);
    assert.equal((await call('/action',{method:'POST',body:request('lottery_enter',{amount:1})})).status,409);
    assert.equal((await call('/support/admin')).status,403);
    await call('/support',{method:'POST',body:{subject:'Help',body:'A test ticket'}});
    const ticket=(await call('/me')).body.tickets[0];assert.ok(ticket.id);
    assert.equal((await call('/me',{user:'bob'})).body.tickets.length,0);
    const reply=await call(`/support/admin/${ticket.id}`,{user:'owner',method:'PUT',body:{userId:'alice',reply:'Fixed',status:'closed'}});
    assert.equal(reply.status,200);assert.equal((await call('/me')).body.tickets[0].reply,'Fixed');
    assert.equal((await call('/recovery/codes',{method:'POST',body:{currentPassword:'wrong'}})).status,400);
    const codes=await call('/recovery/codes',{method:'POST',body:{currentPassword:'before-password'}});
    assert.equal(codes.status,200);assert.equal(codes.headers.get('cache-control'),'no-store');assert.equal(codes.body.codes.length,8);
    assert.ok(!JSON.stringify((await call('/me')).body).includes(codes.body.codes[0]));
    const reset={identifier:'alice',code:codes.body.codes[0],newPassword:'after-password'};
    assert.equal((await call('/recovery/reset',{user:'',method:'POST',body:reset})).status,200);
    assert.equal((await call('/recovery/reset',{user:'',method:'POST',body:reset})).status,400);
    assert.equal(await bcrypt.compare('after-password',accounts.get('alice').passwordHash),true);
    assert.equal(accounts.get('alice').state.authVersion,1);
  } finally {server.closeAllConnections();await new Promise(r=>server.close(r));}
});
