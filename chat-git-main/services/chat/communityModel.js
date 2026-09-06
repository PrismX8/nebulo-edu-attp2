const crypto = require('crypto');

const DAY = 86_400_000;
const CATALOG = [
  { id: 'daily', name: 'Daily check-in', description: '100 coins, plus 25 per consecutive day up to day seven.', price: 0 },
  { id: 'spin', name: 'Daily spin', description: 'One free spin each UTC day: 20–200 coins.', price: 0 },
  { id: 'premium', name: 'Nebulo Plus', description: '30 days of extra reading themes, cursors and profile color.', price: 2000 }
];
function fail(message, status = 400) { const e = new Error(message); e.status = status; throw e; }
function integer(value, max = 1e9) { return Number.isSafeInteger(value) && value >= 0 ? Math.min(value, max) : 0; }
function cleanText(value, max) { return typeof value === 'string' ? value.replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, max) : ''; }
function dayKey(now) { return Math.floor(now / DAY); }
function normalize(input = {}) {
  const value = input && typeof input === 'object' && !Array.isArray(input) ? input : {};
  return {
    dailyDay: Number.isSafeInteger(value.dailyDay) ? value.dailyDay : -1,
    spinDay: Number.isSafeInteger(value.spinDay) ? value.spinDay : -1,
    streak: integer(value.streak, 100000), bestStreak: integer(value.bestStreak, 100000),
    casinoCredits: integer(value.casinoCredits), casinoDay: Number.isSafeInteger(value.casinoDay) ? value.casinoDay : -1,
    playsToday: integer(value.playsToday, 80), lastPlayAt: integer(value.lastPlayAt, Number.MAX_SAFE_INTEGER),
    games: integer(value.games), wins: integer(value.wins), net: Number.isSafeInteger(value.net) ? value.net : 0,
    premiumUntil: integer(value.premiumUntil, Number.MAX_SAFE_INTEGER),
    profile: {
      bio: cleanText(value.profile?.bio, 280), pronouns: cleanText(value.profile?.pronouns, 40),
      favoriteGame: cleanText(value.profile?.favoriteGame, 60), birthday: cleanText(value.profile?.birthday, 5),
      nameColor: /^#[a-f0-9]{6}$/i.test(value.profile?.nameColor || '') ? value.profile.nameColor : '#0099ff'
    },
    privacy: {
      dms: ['everyone', 'friends', 'none'].includes(value.privacy?.dms) ? value.privacy.dms : 'everyone',
      friendRequests: ['everyone', 'mutual', 'none'].includes(value.privacy?.friendRequests) ? value.privacy.friendRequests : 'everyone'
    },
    blocked: (Array.isArray(value.blocked) ? value.blocked : []).filter(x => x && typeof x.id === 'string').slice(0, 200).map(x => ({ id: cleanText(x.id, 80), username: cleanText(x.username, 80) })),
    recoveryHashes: (Array.isArray(value.recoveryHashes) ? value.recoveryHashes : []).filter(x => /^[a-f0-9]{64}$/.test(x)).slice(0, 10),
    receipts: (Array.isArray(value.receipts) ? value.receipts : []).filter(x => x && typeof x.id === 'string' && Number.isFinite(x.at)).slice(-500),
    tickets: (Array.isArray(value.tickets) ? value.tickets : []).filter(x => x && typeof x.id === 'string').slice(-20)
  };
}
function snapshot(raw, coins, now = Date.now(), premium = false) {
  const state = normalize(raw); const today = dayKey(now);
  const nextStreak = state.dailyDay === today - 1 ? state.streak + 1 : state.dailyDay === today ? state.streak : 1;
  return {
    coins, serverTime: now,
    daily: { streak: state.dailyDay >= today - 1 ? state.streak : 0, bestStreak: state.bestStreak, claimedToday: state.dailyDay === today, nextClaimAt: (today + 1) * DAY, reward: 100 + 25 * (Math.min(nextStreak, 7) - 1) },
    spin: { claimedToday: state.spinDay === today, nextClaimAt: (today + 1) * DAY },
    casino: { credits: state.casinoCredits, playsToday: state.casinoDay === today ? state.playsToday : 0, maxPlays: 80 },
    stats: { wins: state.wins, games: state.games, net: state.net },
    premium: { active: premium || state.premiumUntil > now, expiresAt: state.premiumUntil || null, price: 2000, days: 30 },
    profile: state.profile, privacy: state.privacy, blocked: state.blocked,
    recovery: { remaining: state.recoveryHashes.length }, tickets: state.tickets,
    recent: state.receipts.slice(-10).reverse().map(x => ({ at: x.at, ...x.result })), catalog: CATALOG
  };
}
function action(raw, balance, request, { now = Date.now(), randomInt = crypto.randomInt, premium = false } = {}) {
  const state = normalize(raw); const today = dayKey(now);
  const id = String(request?.requestId || '');
  if (!/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(id)) fail('A valid request ID is required.');
  const kind = request?.action;
  const fingerprint = JSON.stringify([kind, request?.game ?? null, request?.bet ?? null, request?.choice ?? null]);
  const receipt = state.receipts.find(x => x.id === id);
  if (receipt) {
    if (receipt.fingerprint !== fingerprint) fail('Request ID was already used for a different action.', 409);
    return { state, coins: balance, result: receipt.result, replay: true };
  }
  // Preserve every accepted request for the last seven days; do not silently
  // evict a live key and allow an ambiguous retry to become another bet.
  state.receipts = state.receipts.filter(x => x.at > now - 7 * DAY);
  if (state.receipts.length >= 500) fail('Activity limit reached. Please try again later.', 429);
  let coins = balance; let result;
  if (kind === 'daily') {
    if (state.dailyDay >= today) fail('Today’s reward has already been claimed.', 409);
    state.streak = state.dailyDay === today - 1 ? state.streak + 1 : 1;
    state.bestStreak = Math.max(state.bestStreak, state.streak);
    state.dailyDay = today;
    const amount = 100 + 25 * (Math.min(state.streak, 7) - 1);
    coins += amount; state.casinoCredits += amount;
    result = { kind, coinsEarned: amount, playCoinsEarned: amount, msg: `Day ${state.streak}: ${amount} coins claimed.` };
  } else if (kind === 'spin') {
    if (state.spinDay >= today) fail('Today’s free spin has already been used.', 409);
    const rewards = [20, 40, 60, 100, 200]; const amount = rewards[randomInt(rewards.length)];
    state.spinDay = today; coins += amount; state.casinoCredits += amount;
    result = { kind, coinsEarned: amount, playCoinsEarned: amount, msg: `Your free spin earned ${amount} coins.` };
  } else if (kind === 'casino') {
    const bet = request.bet; const game = request.game; const choice = request.choice;
    if (!Number.isInteger(bet) || bet < 1 || bet > 100) fail('Bet must be a whole number from 1 to 100 play coins.');
    if (!['coinflip', 'dice'].includes(game)) fail('Unknown game.');
    if (game === 'coinflip' && !['heads', 'tails'].includes(choice)) fail('Choose heads or tails.');
    if (game === 'dice' && (!Number.isInteger(choice) || choice < 1 || choice > 6)) fail('Choose a number from 1 to 6.');
    if (state.casinoDay !== today) { state.casinoDay = today; state.playsToday = 0; }
    if (state.playsToday >= 80) fail('Daily play limit reached. Come back tomorrow.', 429);
    if (state.lastPlayAt && now - state.lastPlayAt < 2000) fail('Wait two seconds between games.', 429);
    if (state.casinoCredits < bet) fail('Not enough free play coins. Claim a daily reward or free spin.', 402);
    const outcome = game === 'coinflip' ? ['heads', 'tails'][randomInt(2)] : randomInt(6) + 1;
    const win = outcome === choice; const payout = win ? bet * (game === 'coinflip' ? 2 : 5) : 0;
    state.casinoCredits += payout - bet; state.games++; state.wins += win ? 1 : 0;
    state.net += payout - bet; state.playsToday++; state.lastPlayAt = now;
    result = { kind, game, bet, outcome, win, payout, coinsEarned: 0, msg: `${outcome}: ${win ? `won ${payout} play coins (including stake)` : `lost ${bet} play coins`}.` };
  } else if (kind === 'premium') {
    if (premium || state.premiumUntil > now) fail('Your membership is already active.', 409);
    if (coins < 2000) fail('You need 2,000 coins for Nebulo Plus.', 402);
    coins -= 2000; state.premiumUntil = now + 30 * DAY;
    result = { kind, msg: 'Nebulo Plus unlocked for 30 days.' };
  } else fail('Unknown community action.');
  if (!Number.isFinite(coins) || coins < 0 || coins > 1e9 || state.casinoCredits > 1e9) fail('Wallet limit reached.', 409);
  state.receipts.push({ id, fingerprint, at: now, result });
  return { state, coins, result };
}
function updateProfile(raw, patch, premium) {
  const state = normalize(raw);
  for (const [key, max] of Object.entries({ bio: 280, pronouns: 40, favoriteGame: 60 })) {
    if (patch[key] !== undefined) {
      if (typeof patch[key] !== 'string' || patch[key].length > max) fail(`${key} must be no longer than ${max} characters.`);
      state.profile[key] = cleanText(patch[key], max);
    }
  }
  if (patch.birthday !== undefined) {
    const b = patch.birthday;
    if (typeof b !== 'string' || (b && (!/^\d{2}-\d{2}$/.test(b) || new Date(`2000-${b}T00:00:00Z`).toISOString?.() !== `2000-${b}T00:00:00.000Z`))) fail('Birthday must be a valid MM-DD date.');
    state.profile.birthday = b;
  }
  if (patch.nameColor !== undefined && patch.nameColor !== state.profile.nameColor) {
    if (!premium) fail('Name color requires an active membership.', 403);
    if (!/^#[a-f0-9]{6}$/i.test(patch.nameColor)) fail('Choose a valid color.');
    state.profile.nameColor = patch.nameColor;
  }
  return state;
}
function updatePrivacy(raw, patch) {
  const state = normalize(raw);
  for (const [key, allowed] of Object.entries({ dms: ['everyone', 'friends', 'none'], friendRequests: ['everyone', 'mutual', 'none'] })) {
    if (patch[key] !== undefined) { if (!allowed.includes(patch[key])) fail('Invalid privacy setting.'); state.privacy[key] = patch[key]; }
  }
  return state;
}
function hashCode(code) { return crypto.createHash('sha256').update(String(code || '').replace(/-/g, '').trim().toUpperCase()).digest('hex'); }
module.exports = { DAY, CATALOG, normalize, snapshot, action, updateProfile, updatePrivacy, hashCode, fail, cleanText };
