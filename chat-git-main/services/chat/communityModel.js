const crypto = require('crypto');
const casino = require('./casinoModel');

const DAY = 86_400_000;
const CATALOG = [
  { id: 'daily', name: 'Daily check-in', description: '100 coins, plus 25 per consecutive day up to day seven.', price: 0 },
  { id: 'spin', name: 'Daily spin', description: 'One free spin each UTC day: 20–200 coins.', price: 0 },
  { id: 'premium', name: 'Nebulo Plus', description: '30 days of extra reading themes, cursors and profile color.', price: 2000 }
];
const WEEK = 7 * DAY;
const STORE_ITEMS = [
  { id: 'lottery_ticket', cat: 'spend', name: 'Lottery Ticket', desc: 'Enter the weekly draw. Top prize 50% of the pot.', price: 100, icon: '🎟️', available: false, unavailableReason: 'Weekly lottery draws are not available yet.' },
  { id: 'channel_boost', cat: 'perk', name: 'Channel Boost', desc: 'Double message rewards for 1 hour.', price: 500, icon: '⚡' },
  { id: 'proxy_priority', cat: 'perk', name: 'Proxy Priority', desc: 'Skip the proxy queue for 30 minutes.', price: 150, icon: '🚀', available: false, unavailableReason: 'Proxy priority is not available on this server.' },
  { id: 'upload_boost', cat: 'perk', name: 'Upload Boost', desc: 'Double the image upload limit for 24 hours.', price: 300, icon: '📎' },
  { id: 'custom_status', cat: 'cosmetic', name: 'Custom Status', desc: 'A personal status line shown in the member list for 30 days.', price: 250, icon: '💬' },
  { id: 'name_glow', cat: 'cosmetic', name: 'Name Glow', desc: 'Subtle glow around your username for 30 days.', price: 400, icon: '✨' },
  { id: 'name_rainbow', cat: 'cosmetic', name: 'Rainbow Name', desc: 'Your username cycles through colors for 30 days.', price: 800, icon: '🌈' },
  { id: 'badge_star', cat: 'cosmetic', name: 'Star Badge', desc: 'A ★ badge on your profile.', price: 600, icon: '⭐' },
  { id: 'badge_verified', cat: 'cosmetic', name: 'Verified Badge', desc: 'A ✓ badge on your profile.', price: 1000, icon: '✅' },
  { id: 'premium', cat: 'cosmetic', name: 'Nebulo Plus', desc: '30 days of extra themes, cursors and profile color.', price: 2000, icon: '💎' }
];
const NAME_EFFECTS = ['none', 'glow', 'rainbow'];
const BADGES = ['none', 'badge_star', 'badge_verified'];
function fail(message, status = 400) { const e = new Error(message); e.status = status; throw e; }
function integer(value, max = 1e9) { return Number.isSafeInteger(value) && value >= 0 ? Math.min(value, max) : 0; }
function cleanText(value, max) { return typeof value === 'string' ? value.replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, max) : ''; }
function dayKey(now) { return Math.floor(now / DAY); }
function normalize(input = {}) {
  const value = input && typeof input === 'object' && !Array.isArray(input) ? input : {};
  return {
    rewardSequences: Object.fromEntries(Object.entries(value.rewardSequences || {}).filter(([key, seq]) => /^[0-9]+-[a-f0-9-]{36}$/.test(key) && Number.isSafeInteger(seq) && seq >= 0)),
    authVersion: integer(value.authVersion),
    dailyDay: Number.isSafeInteger(value.dailyDay) ? value.dailyDay : -1,
    spinDay: Number.isSafeInteger(value.spinDay) ? value.spinDay : -1,
    streak: integer(value.streak, 100000), bestStreak: integer(value.bestStreak, 100000),
    casinoRound: value.casinoRound && typeof value.casinoRound === 'object' ? JSON.parse(JSON.stringify(value.casinoRound)) : null,
    casinoHistory: Array.isArray(value.casinoHistory) ? JSON.parse(JSON.stringify(value.casinoHistory.slice(-12))) : [],
    casinoDay: Number.isSafeInteger(value.casinoDay) ? value.casinoDay : -1,
    playsToday: integer(value.playsToday, 10000), lastPlayAt: integer(value.lastPlayAt, Number.MAX_SAFE_INTEGER),
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
    tickets: (Array.isArray(value.tickets) ? value.tickets : []).filter(x => x && typeof x.id === 'string').slice(-20),
    customStatus: cleanText(value.customStatus, 80),
    customStatusUntil: integer(value.customStatusUntil, Number.MAX_SAFE_INTEGER),
    nameEffect: NAME_EFFECTS.includes(value.nameEffect) ? value.nameEffect : 'none',
    nameEffectUntil: integer(value.nameEffectUntil, Number.MAX_SAFE_INTEGER),
    equippedBadge: BADGES.includes(value.equippedBadge) ? value.equippedBadge : 'none',
    ownedBadges: Array.isArray(value.ownedBadges) ? value.ownedBadges.filter(b => BADGES.includes(b)).slice(0, 20) : [],
    proxyPriorityUntil: integer(value.proxyPriorityUntil, Number.MAX_SAFE_INTEGER),
    uploadBoostUntil: integer(value.uploadBoostUntil, Number.MAX_SAFE_INTEGER),
    boostUntil: integer(value.boostUntil, Number.MAX_SAFE_INTEGER),
    lotteryTickets: integer(value.lotteryTickets, 50),
    lotteryWeek: integer(value.lotteryWeek, 100000),
    lotteryPot: integer(value.lotteryPot, 1e9)
  };
}
function snapshot(raw, coins, now = Date.now(), premium = false) {
  const state = normalize(raw); const today = dayKey(now);
  const currentWeek = Math.floor(now / WEEK);
  const nextStreak = state.dailyDay === today - 1 ? state.streak + 1 : state.dailyDay === today ? state.streak : 1;
  const lotteryActive = state.lotteryWeek === currentWeek;
  const customStatusActive = state.customStatusUntil > now;
  const nameEffectActive = state.nameEffectUntil > now;
  const boostActive = state.boostUntil > now;
  const proxyActive = state.proxyPriorityUntil > now;
  const uploadActive = state.uploadBoostUntil > now;
  return {
    coins, serverTime: now,
    daily: { streak: state.dailyDay >= today - 1 ? state.streak : 0, bestStreak: state.bestStreak, claimedToday: state.dailyDay === today, nextClaimAt: (today + 1) * DAY, reward: 100 + 25 * (Math.min(nextStreak, 7) - 1) },
    spin: { claimedToday: state.spinDay === today, nextClaimAt: (today + 1) * DAY },
    casino: { playsToday: state.casinoDay === today ? state.playsToday : 0, round: casino.snapshotRound(state.casinoRound, coins), history: [...state.casinoHistory].reverse(), paytable: casino.PAYTABLE, rules: casino.RULES },
    stats: { wins: state.wins, games: state.games, net: state.net },
    premium: { active: premium || state.premiumUntil > now, expiresAt: state.premiumUntil || null, price: 2000, days: 30 },
    profile: state.profile, privacy: state.privacy, blocked: state.blocked,
    recovery: { remaining: state.recoveryHashes.length }, tickets: state.tickets,
    recent: state.receipts.slice(-10).reverse().map(x => ({ at: x.at, ...x.result })), catalog: CATALOG,
    store: {
      items: STORE_ITEMS,
      customStatus: customStatusActive ? state.customStatus : '',
      customStatusUntil: customStatusActive ? state.customStatusUntil : null,
      nameEffect: nameEffectActive ? state.nameEffect : 'none',
      nameEffectUntil: nameEffectActive ? state.nameEffectUntil : null,
      equippedBadge: state.ownedBadges.includes(state.equippedBadge) ? state.equippedBadge : 'none',
      ownedBadges: state.ownedBadges,
      boostActive, boostUntil: boostActive ? state.boostUntil : null,
      proxyActive, proxyUntil: proxyActive ? state.proxyPriorityUntil : null,
      uploadActive, uploadUntil: uploadActive ? state.uploadBoostUntil : null,
      lottery: { tickets: lotteryActive ? state.lotteryTickets : 0, pot: state.lotteryPot, week: currentWeek }
    }
  };
}
function action(raw, balance, request, { now = Date.now(), randomInt = crypto.randomInt, premium = false } = {}) {
  const state = normalize(raw); const today = dayKey(now);
  const id = String(request?.requestId || '');
  if (!/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(id)) fail('A valid request ID is required.');
  const kind = request?.action;
  const fingerprint = JSON.stringify([kind, request?.game ?? null, request?.bet ?? null, request?.choice ?? null, request?.move ?? null, request?.roundId ?? null, request?.version ?? null, request?.hold ?? null, request?.index ?? null, request?.multiplier ?? null, request?.correct ?? null, request?.guess ?? null, request?.streak ?? null, request?.itemId ?? null, request?.text ?? null]);
  const receipt = state.receipts.find(x => x.id === id);
  if (receipt) {
    if (receipt.fingerprint !== fingerprint) fail('Request ID was already used for a different action.', 409);
    return { state, coins: balance, result: receipt.result, replay: true };
  }
  state.receipts = state.receipts.filter(x => x.at > now - 7 * DAY);
  const receiptLimit = (kind === 'casino' && (request.move === 'deal' || request.move === 'start')) || (state.casinoRound?.status === 'playing' && kind !== 'casino') ? 480 : 500;
  if (state.receipts.length >= receiptLimit) fail('Activity limit reached. Please try again later.', 429);
  let coins = balance; let result;
  if (kind === 'daily') {
    if (state.dailyDay >= today) fail('Today\'s reward has already been claimed.', 409);
    state.streak = state.dailyDay === today - 1 ? state.streak + 1 : 1;
    state.bestStreak = Math.max(state.bestStreak, state.streak);
    state.dailyDay = today;
    const amount = 100 + 25 * (Math.min(state.streak, 7) - 1);
    coins += amount;
    result = { kind, coinsEarned: amount, msg: `Day ${state.streak}: ${amount} coins claimed.` };
  } else if (kind === 'spin') {
    if (state.spinDay >= today) fail('Today\'s free spin has already been used.', 409);
    const rewards = [20, 40, 60, 100, 200]; const amount = rewards[randomInt(rewards.length)];
    state.spinDay = today; coins += amount;
    result = { kind, coinsEarned: amount, msg: `Your free spin earned ${amount} coins.` };
  } else if (kind === 'casino') {
    // Casino: deduct bet from coins before, add payout after
    const isDeal = request.move === 'deal' || request.move === 'start';
    const isDouble = request.move === 'double';
    const isCashout = request.move === 'cashout';
    const isGuess = request.move === 'guess';
    const isReveal = request.move === 'reveal';
    const isAnswer = request.move === 'answer';
    
    // Get the current round to check for additional costs
    const currentRound = state.casinoRound;
    const isActiveRound = currentRound?.status === 'playing';
    
    // Deduct bet for new games
    if (isDeal || (isDouble && isActiveRound)) {
      const bet = isDouble ? (currentRound?.bet || 0) : (request.bet || 0);
      if (!Number.isSafeInteger(bet) || bet < 1) fail('Invalid bet amount.');
      if (coins < bet) fail('Not enough coins for this bet.', 402);
      coins -= bet;
    }
    
    result = casino.apply(state, request, { now, randomInt });
    
    // Add payout to coins
    if (result.payout > 0) {
      coins += result.payout;
    }
  } else if (kind === 'premium') {
    if (premium || state.premiumUntil > now) fail('Your membership is already active.', 409);
    if (coins < 2000) fail('You need 2,000 coins for Nebulo Plus.', 402);
    coins -= 2000; state.premiumUntil = now + 30 * DAY;
    result = { kind, msg: 'Nebulo Plus unlocked for 30 days.' };
  } else if (kind === 'equip_badge') {
    const badge = String(request?.itemId || 'none');
    if (!BADGES.includes(badge) || (badge !== 'none' && !state.ownedBadges.includes(badge))) fail('You do not own this badge.', 403);
    state.equippedBadge = badge;
    result = { kind, msg: badge === 'none' ? 'Badge removed.' : 'Badge equipped.' };
  } else if (kind === 'buy_store') {
    const itemId = String(request?.itemId || '');
    const item = STORE_ITEMS.find(x => x.id === itemId);
    if (!item) fail('Unknown store item.');
    if (item.available === false) fail(item.unavailableReason, 409);
    const ownedBadge = BADGES.includes(itemId) && state.ownedBadges.includes(itemId);
    if (item.price < 1) fail('This item cannot be purchased this way.');
    if (!ownedBadge && coins < item.price) fail(`Not enough coins. You need ${item.price}.`, 402);
    if (!ownedBadge) coins -= item.price;
    const currentWeek = Math.floor(now / WEEK);
    if (itemId === 'lottery_ticket') {
      if (state.lotteryWeek !== currentWeek) { state.lotteryWeek = currentWeek; state.lotteryTickets = 0; }
      state.lotteryTickets += 1;
      state.lotteryPot += item.price;
      result = { kind, msg: `Lottery ticket purchased. You have ${state.lotteryTickets} ticket${state.lotteryTickets > 1 ? 's' : ''} this week.` };
    } else if (itemId === 'channel_boost') {
      state.boostUntil = Math.max(state.boostUntil, now) + 60 * 60 * 1000;
      result = { kind, msg: 'Channel boost activated for 1 hour. Message rewards are doubled.' };
    } else if (itemId === 'custom_status') {
      const text = cleanText(request?.text, 80);
      if (!text) fail('Enter a status message.');
      state.customStatus = text;
      state.customStatusUntil = Math.max(state.customStatusUntil, now) + 30 * DAY;
      result = { kind, msg: `Status set to "${text}" for 30 days.` };
    } else if (itemId === 'proxy_priority') {
      state.proxyPriorityUntil = Math.max(state.proxyPriorityUntil, now) + 30 * 60 * 1000;
      result = { kind, msg: 'Proxy priority activated for 30 minutes.' };
    } else if (itemId === 'upload_boost') {
      state.uploadBoostUntil = Math.max(state.uploadBoostUntil, now) + DAY;
      result = { kind, msg: 'Image upload limit doubled for 24 hours.' };
    } else if (itemId === 'name_glow') {
      state.nameEffect = 'glow';
      state.nameEffectUntil = Math.max(state.nameEffectUntil, now) + 30 * DAY;
      result = { kind, msg: 'Name glow activated for 30 days.' };
    } else if (itemId === 'name_rainbow') {
      state.nameEffect = 'rainbow';
      state.nameEffectUntil = Math.max(state.nameEffectUntil, now) + 30 * DAY;
      result = { kind, msg: 'Rainbow name activated for 30 days.' };
    } else if (itemId === 'badge_star' || itemId === 'badge_verified') {
      if (!state.ownedBadges.includes(itemId)) state.ownedBadges.push(itemId);
      state.equippedBadge = itemId;
      result = { kind, msg: `${item.name} acquired and equipped.` };
    } else fail('This item is not yet available.');
  } else fail('Unknown community action.');
  if (!Number.isFinite(coins) || coins < 0 || coins > 1e9) fail('Wallet limit reached.', 409);
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
    const date = typeof b === 'string' && /^\d{2}-\d{2}$/.test(b) ? new Date(`2000-${b}T00:00:00Z`) : null;
    if (typeof b !== 'string' || (b && (!date || !Number.isFinite(date.getTime()) || date.toISOString() !== `2000-${b}T00:00:00.000Z`))) fail('Birthday must be a valid MM-DD date.');
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
module.exports = { DAY, WEEK, CATALOG, STORE_ITEMS, NAME_EFFECTS, BADGES, normalize, snapshot, action, updateProfile, updatePrivacy, hashCode, fail, cleanText };
