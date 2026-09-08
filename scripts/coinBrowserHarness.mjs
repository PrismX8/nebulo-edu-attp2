// Isolated browser fixture: real chat frontend, mock accounts and socket events.
// Does not import app.js, load .env, or touch account storage.
import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
const require = createRequire(import.meta.url);
const model = require('../chat-git-main/services/chat/communityModel');
const effects = require('../chat-git-main/services/chat/effects');
const root = fileURLToPath(new URL('../chat-git-main/public/', import.meta.url));
const app = express(), server = createServer(app), io = new Server(server);
let coins = 2480, offline = false;
let community = model.normalize({ casinoCredits: 1000, streak: 4, bestStreak: 7, dailyDay: Math.floor(Date.now()/86400000)-1, profile: {bio:'Usually here after class. Always up for a good game.'} });
const cosmetics = { ownedEffects:['none'], equippedEffect:'none', ownedBanners:['none'], equippedBanner:'none', ownedAvatarEffects:['none'], equippedAvatarEffect:'none', ownedProfileEffects:['none'], equippedProfileEffect:'none', ownedTags:['none'], equippedTag:'none' };
const transactions = [];
let failNext = false;
const user = () => ({ id: 'coin-fixture', _id: 'coin-fixture', username: 'alexmorgan', name: 'Alex Morgan', displayName: 'Alex Morgan', role: 'user', coins, ...cosmetics, ...model.snapshot(community,coins).store });
app.use(express.json());
app.get('/kchat', (req, res) => res.type('html').send(readFileSync(`${root}/index.html`, 'utf8').replace('<head>', `<head><script>localStorage.setItem('token','fixture');localStorage.setItem('user',${JSON.stringify(JSON.stringify(user()))});</script>`)));
app.use('/kchat', express.static(root));
app.get('/api/network/sites', (req, res) => res.json({ sites: [], globalRoom: 'global' }));
app.get('/api/auth', (req, res) => res.json(user()));
app.get('/api/wallet', (req, res) => offline ? res.status(503).json({ msg: 'test offline' }) : res.json({ userId: user().id, coins }));
app.get('/api/community/me', (req, res) => res.json(model.snapshot(community, coins)));
app.get('/api/tlk/chat-effects', (req,res) => res.json({effects:effects.listEffects(),user:user()}));
const scopes = {
  'chat-effects':['message','ownedEffects','equippedEffect','effectId'],
  'chat-banners':['banner','ownedBanners','equippedBanner','bannerId'],
  'chat-avatar-effects':['avatar','ownedAvatarEffects','equippedAvatarEffect','effectId'],
  'chat-profile-effects':['profile','ownedProfileEffects','equippedProfileEffect','effectId'],
  'chat-tags':['tag','ownedTags','equippedTag','tagId'],
};
app.post(/^\/api\/(?:tlk\/)?(chat-effects|chat-banners|chat-avatar-effects|chat-profile-effects|chat-tags)\/([^/]+)(\/purchase)?$/, (req,res) => {
  const [scope,owned,equipped,key] = scopes[req.params[0]];
  const buying = !!req.params[2], id = buying ? req.params[1] : req.body[key];
  const effect = id === 'none' ? {id,scope,price:0} : effects.getEffect(id);
  if (!effect || effect.scope !== scope) return res.status(404).json({msg:'Cosmetic not found'});
  if (failNext) { failNext=false; return res.status(503).json({msg:'Simulated save failure'}); }
  if (buying && !cosmetics[owned].includes(id)) {
    if(coins < effect.price) return res.status(402).json({msg:'Not enough coins'});
    coins -= effect.price; cosmetics[owned].push(id);
    transactions.push({id,amount:-effect.price,kind:'purchase'});
  }
  if (!cosmetics[owned].includes(id)) return res.status(403).json({msg:'Cosmetic not owned'});
  cosmetics[equipped] = id;
  io.emit('wallet_changed');
  res.json({user:user(),effect,msg:buying?'Purchased and equipped':'Equipped'});
});
app.post('/api/community/action', (req, res) => {
  try {
    const next = model.action(community, coins, req.body);
    community = next.state; coins = next.coins;
    io.emit('wallet_changed');
    res.json({state:model.snapshot(community,coins), result:next.result});
  } catch (error) {res.status(error.status||500).json({msg:error.message});}
});
app.put('/api/community/profile', (req,res) => {
  try {community=model.updateProfile(community,req.body,false);res.json(model.snapshot(community,coins));}
  catch(error){res.status(error.status||500).json({msg:error.message});}
});
app.put('/api/community/privacy', (req,res) => {
  try {community=model.updatePrivacy(community,req.body);res.json(model.snapshot(community,coins));}
  catch(error){res.status(error.status||500).json({msg:error.message});}
});
app.get('/api/community/leaderboard', (req,res) => res.json({metric:req.query.metric||'coins',users:[
  {username:'maya',displayName:'Maya',coins:6420,streak:12,wins:38},
  {username:'oliver',displayName:'Oliver',coins:3810,streak:9,wins:24},
  {username:'alexmorgan',displayName:'Alex Morgan',coins,streak:community.streak,wins:community.wins}
]}));
app.post('/__test/credit', (req, res) => {
  coins += 5; io.emit('wallet_changed'); io.emit('chat_reward', { balance: coins, coinsEarned: 5 }); res.json({ coins });
});
app.post('/__test/offline', (req, res) => { offline = !!req.body.offline; io.emit('wallet_changed'); res.json({ offline }); });
app.post('/__test/fail-next', (req,res) => {failNext=true;res.json({ok:true});});
app.get('/__test/state', (req,res) => res.json({user:user(),transactions,community:model.snapshot(community,coins)}));
app.use('/api', (req, res) => res.json({ messages: [], users: [], sites: [], friends: [], groups: [], channels: [], alerts: [], rooms: [], requests: [], participants: [] }));
io.on('connection', socket => {
  socket.on('send_message', (data, ack) => { ack?.({ ok: true }); });
});
const port = Number(process.env.COIN_FIXTURE_PORT || 4319);
server.listen(port, '127.0.0.1', () => console.log(`Coin browser fixture: http://127.0.0.1:${port}/kchat`));
