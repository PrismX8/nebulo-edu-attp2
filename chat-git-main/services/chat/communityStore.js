const crypto = require('crypto');
const profileStore = require('../db/profileStore');
const localStore = require('../auth/localStore');
const model = require('./communityModel');

const LOTTERY_CACHE_MS = 5000;
const lotteryCache = new Map();

function databaseConfigured() {
  return !!(process.env.PROFILE_DATABASE_URL || (process.env.PROFILE_DB_HOST && process.env.PROFILE_DB_PASSWORD));
}
function id(user) { return String(user?.id || user?._id || ''); }
function lotterySource(userOrSource) { return userOrSource === 'database' || userOrSource?.source === 'database' ? 'database' : 'local'; }
function lotteryKey(account) { return `${account.source}:${account.id}`; }
function invalidateLottery(userOrSource) { lotteryCache.delete(lotterySource(userOrSource)); }
async function lotteryAccounts(userOrSource, { force = false } = {}) {
  const source = lotterySource(userOrSource);
  const cached = lotteryCache.get(source);
  if (!force && cached && Date.now() - cached.at < LOTTERY_CACHE_MS) return cached.accounts;
  let accounts;
  if (source === 'database') {
    const result = await profileStore.query(`select u.id, p.username, u.user_metadata->'nebulo_community' as community
      from public.users u join public.profiles p on p.id=u.id`);
    accounts = result.rows.map(row => ({ id: String(row.id), username: String(row.username || ''), source, state: model.normalize(row.community) }));
  } else {
    accounts = localStore.listUsers().filter(user => user.source !== 'database').map(user => ({
      id: String(user._id), username: String(user.username || ''), source, state: model.normalize(user.community)
    }));
  }
  lotteryCache.set(source, { at: Date.now(), accounts });
  return accounts;
}
function lotteryWinner(entries, week) {
  const ordered = [...entries].sort((a, b) => lotteryKey(a).localeCompare(lotteryKey(b)));
  const roster = ordered.map(entry => `${lotteryKey(entry)}:${entry.state.lotteryEntry.amount}:${entry.state.lotteryEntry.enteredAt}:${entry.state.lotteryEntry.requestId}`).join('|');
  const digest = crypto.createHmac('sha256', process.env.JWT_SECRET || 'nebulo-weekly-lottery').update(`${week}|${roster}`).digest('hex');
  return ordered[Number(BigInt(`0x${digest.slice(0, 16)}`) % BigInt(ordered.length))];
}
async function settleLottery(userOrSource = 'local', now = Date.now()) {
  const source = lotterySource(userOrSource);
  const currentWeek = model.lotteryWeek(now);
  const accounts = await lotteryAccounts(source, { force: true });
  const weeks = [...new Set(accounts.map(account => account.state.lotteryEntry?.week).filter(week => Number.isSafeInteger(week) && week < currentWeek))].sort((a, b) => a - b);
  const draws = [];
  for (const week of weeks) {
    const entries = accounts.filter(account => account.state.lotteryEntry?.week === week);
    if (!entries.length) continue;
    const pot = entries.reduce((total, entry) => total + entry.state.lotteryEntry.amount, 0);
    if (!Number.isSafeInteger(pot) || pot < 1) continue;
    const winner = lotteryWinner(entries, week);
    if (winner.state.lotteryPaidWeeks.includes(week) || winner.state.lotteryLast?.week === week) continue;
    let paid = false;
    await mutate({ id: winner.id, source: winner.source }, context => {
      if (context.state.lotteryPaidWeeks.includes(week) || context.state.lotteryLast?.week === week) return;
      if (!Number.isSafeInteger(context.coins + pot) || context.coins + pot > 1e9) model.fail('Lottery payout exceeds the wallet limit.', 409);
      context.coins += pot;
      context.state.lotteryWins += 1;
      context.state.lotteryPaidWeeks = [...context.state.lotteryPaidWeeks, week].slice(-104);
      context.state.lotteryLast = { week, at: now, payout: pot, contribution: winner.state.lotteryEntry.amount };
      paid = true;
    });
    draws.push({ week, pot, ticketCount: entries.length, winnerId: winner.id, winnerUsername: winner.username, paid });
  }
  if (draws.some(draw => draw.paid)) invalidateLottery(source);
  return draws;
}
async function settleAllLotteries(now = Date.now()) {
  const results = { local: await settleLottery('local', now) };
  if (databaseConfigured()) results.database = await settleLottery('database', now);
  return results;
}
async function lotteryView(user, rawState, now = Date.now()) {
  const source = lotterySource(user);
  const state = model.normalize(rawState);
  const week = model.lotteryWeek(now);
  let accounts;
  let settlementPending = false;
  try { accounts = await lotteryAccounts(source); }
  catch { accounts = [{ id: id(user), username: String(user?.username || ''), source, state }]; settlementPending = true; }
  const entries = accounts.filter(account => account.state.lotteryEntry?.week === week);
  const pot = entries.reduce((total, entry) => total + entry.state.lotteryEntry.amount, 0);
  const currentEntry = state.lotteryEntry?.week === week ? state.lotteryEntry : null;
  const lastWinner = accounts.filter(account => account.state.lotteryLast).sort((a, b) => (b.state.lotteryLast.week - a.state.lotteryLast.week) || (b.state.lotteryLast.at - a.state.lotteryLast.at))[0];
  const lastDraw = lastWinner ? {
    ...lastWinner.state.lotteryLast,
    winnerUsername: lastWinner.username,
    won: lotteryKey(lastWinner) === lotteryKey({ id: id(user), source })
  } : null;
  return {
    ...model.lotteryBounds(week), pot, ticketCount: entries.length,
    entered: !!currentEntry, entryAmount: currentEntry?.amount || 0, enteredAt: currentEntry?.enteredAt || null,
    wins: state.lotteryWins, oneTicketPerUser: true, lastDraw, settlementPending, serverTime: now
  };
}
async function read(user) {
  if (user?.source === 'database') {
    const result = await profileStore.query(`select p.coins, p.is_premium, u.user_metadata->'nebulo_community' as community
      from public.users u join public.profiles p on p.id=u.id where u.id=$1::uuid`, [id(user)]);
    const row = result.rows[0]; if (!row) model.fail('Account not found', 404);
    return { state: model.normalize(row.community), coins: Number(row.coins), premium: !!row.is_premium };
  }
  const local = localStore.findById(id(user)); if (!local) model.fail('Account not found', 404);
  return { state: model.normalize(local.community), coins: local.coins, premium: false };
}
async function mutate(user, callback) {
  if (user?.source === 'database') {
    return profileStore.transaction(async client => {
      const result = await client.query(`select p.coins, p.is_premium, u.user_metadata->'nebulo_community' as community, u.password_hash
        from public.users u join public.profiles p on p.id=u.id where u.id=$1::uuid for update of p,u`, [id(user)]);
      const row = result.rows[0]; if (!row) model.fail('Account not found', 404);
      const context = { state: model.normalize(row.community), coins: Number(row.coins), premium: !!row.is_premium, passwordHash: row.password_hash };
      const response = callback(context);
      if (response?.then) throw new Error('Community mutation callbacks must be synchronous');
      if (!Number.isFinite(context.coins) || context.coins < 0 || context.coins > 1e9) model.fail('Wallet limit reached', 409);
      await client.query(`update public.users set user_metadata=jsonb_set(coalesce(user_metadata,'{}'::jsonb),'{nebulo_community}',$2::jsonb,true)
        where id=$1::uuid`, [id(user), JSON.stringify(context.state)]);
      if (context.coins !== Number(row.coins)) await client.query('update public.profiles set coins=$2, updated_at=now() where id=$1::uuid', [id(user), context.coins]);
      if (context.newPasswordHash) await client.query('update public.users set password_hash=$2 where id=$1::uuid', [id(user), context.newPasswordHash]);
      return response;
    });
  }
  return localStore.communityTransaction(id(user), local => {
    const context = { state: model.normalize(local.community), coins: local.coins, premium: false, passwordHash: local.password };
    const response = callback(context);
    local.community = context.state; local.coins = context.coins;
    if (context.newPasswordHash) local.password = context.newPasswordHash;
    return response;
  });
}
async function resolveUsername(username) {
  const name = String(username || '').trim();
  if (!name || name.length > 80) return null;
  if (databaseConfigured()) {
    const result = await profileStore.query('select id, username from public.profiles where lower(username)=lower($1) limit 1', [name]);
    if (result.rows[0]) return { ...result.rows[0], source: 'database' };
  }
  // Local-only installations/accounts still work without a second wallet.
  const user = localStore.findByUsername(name);
  return user ? { id: user._id, username: user.username } : null;
}
async function leaderboard(user, metric) {
  if (!['coins', 'streak', 'wins'].includes(metric)) model.fail('Unknown leaderboard');
  if (user.source === 'database') {
    const field = { coins: 'p.coins', streak: "coalesce((u.user_metadata->'nebulo_community'->>'bestStreak')::bigint,0)", wins: "coalesce((u.user_metadata->'nebulo_community'->>'wins')::bigint,0)" }[metric];
    const result = await profileStore.query(`select p.username, coalesce(u.user_metadata->>'display_name',p.username) as display_name,
      p.coins, coalesce((u.user_metadata->'nebulo_community'->>'bestStreak')::bigint,0) as streak,
      coalesce((u.user_metadata->'nebulo_community'->>'wins')::bigint,0) as wins
      from public.profiles p join public.users u on u.id=p.id order by ${field} desc, lower(p.username) asc limit 50`);
    return result.rows.map(row => ({ username: row.username, displayName: row.display_name, coins: Number(row.coins), streak: Number(row.streak), wins: Number(row.wins) }));
  }
  return localStore.listUsers().map(u => ({ username: u.username, displayName: u.username, coins: u.coins, streak: model.normalize(u.community).bestStreak, wins: model.normalize(u.community).wins }))
    .sort((a, b) => b[metric] - a[metric] || a.username.localeCompare(b.username)).slice(0, 50);
}
async function supportInbox(user) {
  if (user.source === 'database') {
    const result = await profileStore.query(`select u.id, p.username, u.user_metadata->'nebulo_community'->'tickets' as tickets
      from public.users u join public.profiles p on p.id=u.id
      where jsonb_array_length(coalesce(u.user_metadata->'nebulo_community'->'tickets','[]'::jsonb))>0
      order by p.updated_at desc limit 500`);
    return result.rows.flatMap(row => (row.tickets || []).map(ticket => ({ ...ticket, userId: String(row.id), username: row.username }))).sort((a, b) => b.createdAt - a.createdAt).slice(0, 500);
  }
  return localStore.listUsers().flatMap(u => model.normalize(u.community).tickets.map(ticket => ({ ...ticket, userId: u._id, username: u.username }))).sort((a, b) => b.createdAt - a.createdAt).slice(0, 500);
}
function relationship(actor, target) {
  const a = localStore.findById(id(actor)); const b = localStore.findById(id(target));
  const an = String(actor.username || '').toLowerCase(); const bn = String(target.username || '').toLowerCase();
  const af = new Set(a?.friends || []); const bf = new Set(b?.friends || []);
  return { friends: af.has(bn) && bf.has(an), mutual: [...af].some(name => bf.has(name)) };
}
async function assertContact(actor, target, kind = 'dm') {
  if (!target || id(actor) === id(target)) model.fail('This interaction is unavailable.', 403);
  const [a, b] = await Promise.all([read(actor), read(target)]);
  if (a.state.blocked.some(u => u.id === id(target)) || b.state.blocked.some(u => u.id === id(actor))) model.fail('This interaction is blocked.', 403);
  const relation = relationship(actor, target);
  const setting = kind === 'blocked' ? 'everyone' : kind === 'friend' ? b.state.privacy.friendRequests : b.state.privacy.dms;
  if (setting === 'none' || (setting === 'friends' && !relation.friends) || (setting === 'mutual' && !relation.friends && !relation.mutual)) model.fail('This user’s privacy settings do not allow this interaction.', 403);
}
module.exports = { read, mutate, leaderboard, supportInbox, resolveUsername, assertContact, id, databaseConfigured, invalidateLottery, lotteryView, settleLottery, settleAllLotteries };
