import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { randomUUID } from 'node:crypto';
const require = createRequire(new URL('../chat-git-main/package.json', import.meta.url));
const model = require('./services/chat/communityModel');
const DAY = model.DAY, now = Date.UTC(2026, 8, 6, 12);
const request = (action, more={}) => ({ action, requestId:randomUUID(), ...more });

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
  assert.throws(()=>model.action({},900,request('casino',{game:'dice',move:'deal',bet:10}),options), /Choose Blackjack/);
});
test('free spin and membership are authoritative and no private metadata leaks', () => {
  const spin=model.action({},0,request('spin'),{now,randomInt:()=>4});
  assert.equal(spin.coins,200);
  assert.throws(()=>model.action(spin.state,200,request('spin'),{now}),/already/);
  const plus=model.action({},2500,request('premium'),{now});
  assert.equal(plus.coins,500); assert.equal(plus.state.premiumUntil,now+30*DAY);
  assert.throws(()=>model.action({},1999,request('premium'),{now}),/2,000/);
  const view=model.snapshot({...plus.state,recoveryHashes:[model.hashCode('secret')],authVersion:2},500,now);
  assert.equal(view.recovery.remaining,1); assert.ok(!('recoveryHashes' in view)); assert.ok(!('authVersion' in view));
  assert.equal(view.premium.active,true); assert.equal(model.snapshot(plus.state,500,now+31*DAY).premium.active,false);
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
  const localRequire=createRequire(filename);
  const module={exports:{}};
  vm.runInNewContext(readFileSync(filename,'utf8'),{require:name=>Object.hasOwn(overrides,name)?overrides[name]:localRequire(name),module,exports:module.exports,console,process:{env:{}},Buffer,Date,setTimeout,clearTimeout},{filename:filename.pathname});
  return module.exports;
}
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
