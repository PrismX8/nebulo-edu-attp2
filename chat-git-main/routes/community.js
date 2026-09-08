const express = require('express');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const security = require('../middleware/security');
const localStore = require('../services/auth/localStore');
const profiles = require('../services/db/profileStore');
const store = require('../services/chat/communityStore');
const model = require('../services/chat/communityModel');

const router = express.Router();
const wrap = fn => async (req, res) => {
  try { await fn(req, res); } catch (error) {
    if (!error.status) console.warn('Community operation failed:', error.code || error.name);
    res.status(error.status || 503).json({ msg: error.status ? error.message : 'Community storage is temporarily unavailable. Please retry.' });
  }
};
const stateOf = context => model.snapshot(context.state, context.coins, Date.now(), context.premium);
const verifyPassword = async (password, hash) => typeof hash === 'string' && /^\$2[aby]\$/.test(hash) && await bcrypt.compare(password, hash);
const privateHeaders = (_req, res, next) => { res.setHeader('Cache-Control', 'no-store'); next(); };
router.use(privateHeaders);
const recoveryIpLimit = security.rateLimit({ prefix: 'community-recover-ip', windowMs: 900000, max: 5 });
const recoveryAccountLimit = security.rateLimit({ prefix: 'community-recover-account', windowMs: 900000, max: 8, keyGenerator: req => String(req.body?.identifier || '').trim().toLowerCase() });

router.post('/recovery/reset', recoveryIpLimit, recoveryAccountLimit, wrap(async (req, res) => {
  const identifier = String(req.body?.identifier || '').trim();
  const code = String(req.body?.code || ''); const password = String(req.body?.newPassword || '');
  if (identifier.length > 254 || !identifier || code.length > 80 || password.length < 8 || password.length > 128) model.fail('Enter your account, recovery code, and an 8–128 character password.');
  let user;
  if (store.databaseConfigured()) user = (await profiles.findAccountByIdentifier(identifier))?.account;
  else { const local = localStore.findByIdentifier(identifier); if (local) user = { id: local._id, username: local.username }; }
  if (!user) model.fail('Account or recovery code is invalid.');
  const hash = model.hashCode(code);
  const current = await store.read(user);
  if (!current.state.recoveryHashes.includes(hash)) model.fail('Account or recovery code is invalid.');
  const newHash = await bcrypt.hash(password, 12);
  await store.mutate(user, ctx => {
    if (!ctx.state.recoveryHashes.includes(hash)) model.fail('Account or recovery code is invalid.');
    ctx.state.recoveryHashes = []; ctx.state.authVersion = (ctx.state.authVersion || 0) + 1;
    ctx.newPasswordHash = newHash;
  });
  // Invalidate mirrored credentials and active sockets for this process too.
  if (user.source === 'database') {
    const latest = await store.read(user);
    if (localStore.findById(store.id(user))) localStore.communityTransaction(store.id(user), local => {
      local.community = { ...(local.community || {}), authVersion: latest.state.authVersion };
      delete local.password;
    });
  }
  const sockets = globalThis.__nebuloChatIo?.sockets?.sockets;
  if (sockets) for (const socket of sockets.values()) if (store.id(socket.data?.user) === store.id(user)) socket.disconnect(true);
  res.json({ ok: true, msg: 'Password reset. Sign in again and generate a fresh set of recovery codes.' });
}));

router.use(auth);
router.use((req, res, next) => {
  // Do not let a database outage turn an authenticated DB account into a local
  // mirrored wallet through legacy auth fallback.
  if (jwt.decode(req.authToken)?.user?.source === 'database' && req.user?.source !== 'database') return res.status(503).json({ msg: 'Account database is temporarily unavailable.' });
  next();
});
router.use(security.rateLimit({ prefix: 'community-user', windowMs: 60000, max: 90, keyGenerator: req => store.id(req.user) }));
router.get('/me', wrap(async (req, res) => res.json(stateOf(await store.read(req.user)))));
router.get('/profile/:username', wrap(async (req, res) => {
  const target = await store.resolveUsername(req.params.username);
  if (!target) model.fail('Profile not found.', 404);
  const value = stateOf(await store.read(target));
  res.json({ profile: { ...value.profile, nameColor: value.premium.active ? value.profile.nameColor : '#0099ff' }, premium: { active: value.premium.active }, equippedBadge: value.store?.equippedBadge || 'none' });
}));
router.post('/action', security.rateLimit({ prefix: 'community-action', windowMs: 60000, max: 35, keyGenerator: req => store.id(req.user) }), wrap(async (req, res) => {
  const response = await store.mutate(req.user, ctx => {
    const next = model.action(ctx.state, ctx.coins, req.body, { premium: ctx.premium });
    ctx.state = next.state; ctx.coins = next.coins;
    return { result: next.result, state: stateOf(ctx), replay: !!next.replay };
  });
  res.json(response);
}));
router.get('/leaderboard', wrap(async (req, res) => {
  const metric = String(req.query.metric || 'coins');
  res.json({ metric, entries: await store.leaderboard(req.user, metric) });
}));
router.put('/profile', wrap(async (req, res) => res.json(await store.mutate(req.user, ctx => {
  ctx.state = model.updateProfile(ctx.state, req.body || {}, ctx.premium || ctx.state.premiumUntil > Date.now());
  return stateOf(ctx);
}))));
router.put('/privacy', wrap(async (req, res) => res.json(await store.mutate(req.user, ctx => {
  ctx.state = model.updatePrivacy(ctx.state, req.body || {}); return stateOf(ctx);
}))));
router.post('/blocked', wrap(async (req, res) => {
  const target = await store.resolveUsername(req.body?.username);
  if (!target || store.id(target) === store.id(req.user)) model.fail('Choose another existing user.');
  res.json(await store.mutate(req.user, ctx => {
    if (!ctx.state.blocked.some(x => x.id === store.id(target))) {
      if (ctx.state.blocked.length >= 200) model.fail('Blocked-user limit reached.');
      ctx.state.blocked.push({ id: store.id(target), username: target.username });
    }
    return stateOf(ctx);
  }));
}));
router.delete('/blocked/:id', wrap(async (req, res) => res.json(await store.mutate(req.user, ctx => {
  ctx.state.blocked = ctx.state.blocked.filter(x => x.id !== req.params.id); return stateOf(ctx);
}))));
router.post('/recovery/codes', security.rateLimit({ prefix: 'community-codes', windowMs: 900000, max: 5, keyGenerator: req => store.id(req.user) }), wrap(async (req, res) => {
  const password = String(req.body?.currentPassword || '');
  if (!password || password.length > 128) model.fail('Enter your current password.');
  const credentials = req.user.source === 'database' ? (await profiles.findCredentialsById(store.id(req.user)))?.password_hash : localStore.findById(store.id(req.user))?.password;
  if (!await verifyPassword(password, credentials)) model.fail('Current password is incorrect.');
  const codes = Array.from({ length: 8 }, () => crypto.randomBytes(12).toString('hex').toUpperCase().match(/.{1,6}/g).join('-'));
  const state = await store.mutate(req.user, ctx => {
    if (ctx.passwordHash !== credentials) model.fail('Password changed. Please sign in again.', 409);
    ctx.state.recoveryHashes = codes.map(model.hashCode); return stateOf(ctx);
  });
  res.json({ codes, state });
}));
router.post('/support', wrap(async (req, res) => {
  const subject = String(req.body?.subject || '').trim(); const body = String(req.body?.body || '').trim();
  if (!subject || subject.length > 100 || !body || body.length > 2000) model.fail('Enter a subject (up to 100 characters) and message (up to 2,000 characters).');
  res.json(await store.mutate(req.user, ctx => {
    if (ctx.state.tickets.length >= 20) model.fail('Ticket limit reached. Contact support using your existing tickets.', 409);
    if (ctx.state.tickets.some(x => Date.now() - x.createdAt < 60000)) model.fail('Wait a minute before opening another ticket.', 429);
    ctx.state.tickets.push({ id: crypto.randomUUID(), subject: model.cleanText(subject, 100), body: model.cleanText(body, 2000), createdAt: Date.now(), status: 'open', reply: '' });
    return stateOf(ctx);
  }));
}));
const staff = (req, res, next) => ['owner', 'admin'].includes(req.user?.role) ? next() : res.status(403).json({ msg: 'Staff access required.' });
router.get('/support/admin', staff, wrap(async (req, res) => res.json({ tickets: await store.supportInbox(req.user) })));
router.put('/support/admin/:id', staff, wrap(async (req, res) => {
  if (!['open', 'closed'].includes(req.body?.status) || typeof req.body?.reply !== 'string' || req.body.reply.length > 2000 || !/^[a-z0-9-]{1,80}$/i.test(req.body?.userId || '')) model.fail('Invalid support reply.');
  const target = { id: req.body.userId, source: req.user.source };
  const ticket = await store.mutate(target, ctx => {
    const item = ctx.state.tickets.find(x => x.id === req.params.id);
    if (!item) model.fail('Ticket not found.', 404);
    item.reply = model.cleanText(req.body.reply, 2000); item.status = req.body.status; item.updatedAt = Date.now();
    item.repliedBy = req.user.username; return item;
  });
  res.json({ ok: true, ticket });
}));
module.exports = router;
