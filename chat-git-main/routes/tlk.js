const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const userStore = require('../services/auth/localStore');
const profileStore = require('../services/db/profileStore');
const moderationStore = require('../services/db/moderationStore');
const effectStore = require('../services/db/effectStore');
const bannerStore = require('../services/db/bannerStore');
const profileEffectStore = require('../services/db/profileEffectStore');
const identityStore = require('../services/network/identity');
const auth = require('../middleware/auth');
const security = require('../middleware/security');
const netState = require('../services/network/state');
const presence = require('../services/network/presence');
const groupChats = require('../services/groupChats');
const effectList = require('../services/chat/effects');
const customTagStore = require('../services/chat/customTagStore');
const dmStore = require('../services/chat/dmStore');
const receiptStore = require('../services/chat/receiptStore');
const messageCosmeticStore = require('../services/chat/messageCosmeticStore');
const messageFeatureStore = require('../services/chat/messageFeatureStore');
const chatMessagesStore = require('../services/db/chatMessagesStore');
const { sites: networkSites } = require('../config/networkSites');
const { moderatePublicMessage } = require('../services/moderation/publicMessage');
const uploadRoute = require('./upload');

const router = express.Router();

const TLK_BASE = 'https://tlk.io';
const bridgeSessions = new Map();
const RETRY_COUNT = 2;
const MOD_BOT_NAME = process.env.MOD_BOT_NAME || 'Moderation';
const SYSTEM_BOT_NAME = process.env.SYSTEM_BOT_NAME || 'System';
const BAN_APPEAL_TEXT = 'Open a ticket to appeal: dsc.gg/nebulo';
const SESSION_DIR = path.resolve(__dirname, '..', 'data');
const MESSAGE_CACHE_TTL_MS = Math.max(250, Number(process.env.TLK_MESSAGE_CACHE_TTL_MS || 350));
const DEFAULT_MESSAGE_LIMIT = Math.max(25, Math.min(150, Number(process.env.TLK_MESSAGE_LIMIT || 100)));
const MAX_MESSAGE_BODY_LENGTH = Math.max(200, Math.min(5000, Number(process.env.CHAT_MAX_MESSAGE_LENGTH || 1500)));
const DISABLE_MESSAGE_COIN_REWARD = String(process.env.DISABLE_MESSAGE_COIN_REWARD || '').toLowerCase() === 'true';
const messageFetchCache = new Map();
const messageNonceResults = new Map();
const messageNonceInflight = new Map();
const MESSAGE_NONCE_TTL_MS = 10 * 60_000;
const FOCUS_REWARD_INTERVAL_MS = 5 * 60_000;
const FOCUS_REWARD_COINS = 5;
const FOCUS_HEARTBEAT_MAX_GAP_MS = 45_000;
const focusRewardSessions = new Map();
const focusRewardRateLimit = security.rateLimit({ prefix: 'focus-reward', windowMs: 60_000, max: 8 });
const customTagAdminRateLimit = security.rateLimit({ prefix: 'custom-tag-admin', windowMs: 60_000, max: 30 });

const isDmRoomId = (room) => typeof room === 'string' && room.length === 8 && /^[a-z]+$/.test(room);

const findSiteForRoom = (room) => {
  const target = String(room || '').trim().toLowerCase();
  if (!target) return null;
  return (Array.isArray(networkSites) ? networkSites : []).find((site) => String(site?.room || '').trim().toLowerCase() === target) || null;
};
const computeDmRoomId = (usernameA, usernameB) => {
  const a = String(usernameA || '').trim().toLowerCase();
  const b = String(usernameB || '').trim().toLowerCase();
  if (!a || !b || a === b) return null;
  const pair = [a, b].sort().join('|');
  let hash = 2166136261;
  for (let i = 0; i < pair.length; i += 1) {
    hash ^= pair.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  let roomId = '';
  for (let i = 0; roomId.length < 8; i += 1) {
    roomId += String.fromCharCode(97 + ((hash >> (i * 5)) & 31) % 26);
  }
  return roomId;
};

const buildDmParticipantsMap = () => {
  const users = userStore.listUsers()
    .filter((user) => user && user.username)
    .map((user) => ({ username: String(user.username).trim(), normalized: String(user.username).trim().toLowerCase() }));

  const roomMap = new Map();
  for (let i = 0; i < users.length; i += 1) {
    for (let j = i + 1; j < users.length; j += 1) {
      const roomId = computeDmRoomId(users[i].normalized, users[j].normalized);
      if (!roomId) continue;
      roomMap.set(roomId, [users[i].username, users[j].username]);
    }
  }
  return roomMap;
};

function getAuthorizedDmParticipants(room, user) {
  const participants = buildDmParticipantsMap().get(String(room || '').trim().toLowerCase());
  if (!Array.isArray(participants)) return null;
  const role = String(user?.role || '').toLowerCase();
  if (['owner', 'admin'].includes(role)) return participants;
  const username = String(user?.username || user?.name || '').trim().toLowerCase();
  return participants.some((participant) => String(participant || '').trim().toLowerCase() === username)
    ? participants
    : false;
}

function getMessageTargetUsernames(room, senderUsername = '') {
  const normalizedRoom = String(room || '').trim().toLowerCase();
  const normalizedSender = String(senderUsername || '').trim().toLowerCase();
  const targets = new Set();

  const dmParticipants = buildDmParticipantsMap().get(normalizedRoom);
  if (Array.isArray(dmParticipants)) {
    dmParticipants.forEach((username) => {
      const normalized = String(username || '').trim().toLowerCase();
      if (normalized && normalized !== normalizedSender) targets.add(normalized);
    });
  }

  const group = groupChats.getGroupSync(normalizedRoom);
  if (group && Array.isArray(group.members)) {
    group.members.forEach((username) => {
      const normalized = String(username || '').trim().toLowerCase();
      if (normalized && normalized !== normalizedSender) targets.add(normalized);
    });
  }

  return [...targets];
}

function getMentionedUsernames(text = '', senderUsername = '') {
  const normalizedSender = String(senderUsername || '').trim().toLowerCase();
  const mentions = String(text || '').match(/@([a-z0-9_]{1,32})/gi) || [];
  const names = new Set();
  mentions.forEach((mention) => {
    const name = String(mention || '').replace(/^@/, '').trim().toLowerCase();
    if (name && name !== normalizedSender) names.add(name);
  });
  return [...names];
}

function isGroupMember(room, username = '', role = '') {
  const group = groupChats.getGroupSync(room);
  if (!group) return true;
  if (['owner', 'admin'].includes(String(role || '').toLowerCase())) return true;
  const normalizedUsername = String(username || '').trim().toLowerCase();
  if (!normalizedUsername) return false;
  return Array.isArray(group.members) &&
    group.members.some((member) => String(member || '').trim().toLowerCase() === normalizedUsername);
}

function excludesGlobalSlowmode(room = '') {
  const normalizedRoom = String(room || '').trim().toLowerCase();
  if (!normalizedRoom) return false;
  if (groupChats.getGroupSync(normalizedRoom)) return true;
  return buildDmParticipantsMap().has(normalizedRoom);
}

function canUseRoomSettings(room = '', user = null, write = false) {
  const normalizedRoom = String(room || '').trim().toLowerCase();
  if (!normalizedRoom || !user) return false;
  const role = String(user.role || '').toLowerCase();
  if (['owner', 'admin'].includes(role)) return true;

  const username = String(user.username || user.name || '').trim().toLowerCase();
  if (!username) return false;

  const group = groupChats.getGroupSync(normalizedRoom);
  if (group) {
    return Array.isArray(group.members) &&
      group.members.some((member) => String(member || '').trim().toLowerCase() === username);
  }

  const dmParticipants = buildDmParticipantsMap().get(normalizedRoom);
  if (Array.isArray(dmParticipants)) {
    return dmParticipants.some((participant) => String(participant || '').trim().toLowerCase() === username);
  }

  return !write;
}

function normalizeBackgroundImage(value = '') {
  const backgroundImage = String(value || '').trim();
  if (!backgroundImage) return '';
  if (backgroundImage.length > 1_250_000) {
    const err = new Error('Background image is too large');
    err.status = 413;
    throw err;
  }
  if (/^data:image\/(?:png|jpe?g|gif|webp);base64,[a-z0-9+/=]+$/i.test(backgroundImage)) {
    return backgroundImage;
  }
  if (/^https?:\/\/[^\s"']{1,2000}$/i.test(backgroundImage)) {
    return backgroundImage;
  }
  const err = new Error('Background must be a PNG, JPG, GIF, WebP, or image URL');
  err.status = 400;
  throw err;
}

function emitRealtimeMessage(room, message, senderUsername = '') {
  const io = globalThis.__nebuloChatIo;
  const normalizedRoom = String(room || '').trim();
  if (!io || !normalizedRoom) return;

  const payload = { roomId: normalizedRoom, message };
  const targetUsers = new Set([
    ...getMessageTargetUsernames(normalizedRoom, senderUsername),
    ...getMentionedUsernames(message?.body || message?.content || '', senderUsername)
  ]);
  let target = io.to(normalizedRoom);
  targetUsers.forEach((username) => {
    target = target.to(`user:${username}`);
  });
  target.emit('receive_message', payload);
}

function emitTagCatalogUpdated() {
  globalThis.__nebuloChatIo?.emit('tag_catalog_updated', { updatedAt: Date.now() });
}

function getReceiptUsername(user = null) {
  return String(user?.username || user?.name || '').trim();
}

function messageIdsForReceipts(messages = []) {
  return (Array.isArray(messages) ? messages : [])
    .map((message) => String(message?.id || message?._id || '').trim())
    .filter(Boolean);
}

function attachRoomReceipts(room, messages = []) {
  return receiptStore.attachReceipts(room, messages);
}

function emitReceiptUpdate(room, messages = [], senderUsername = '') {
  const io = globalThis.__nebuloChatIo;
  const normalizedRoom = String(room || '').trim();
  const receiptMessages = attachRoomReceipts(normalizedRoom, messages)
    .filter((message) => message?.id || message?._id)
    .map((message) => ({
      id: String(message.id || message._id),
      receipts: message.receipts || { deliveredBy: {}, seenBy: {} }
    }));
  if (!io || !normalizedRoom || !receiptMessages.length) return;

  const payload = { roomId: normalizedRoom, receipts: receiptMessages };
  let target = io.to(normalizedRoom);
  getMessageTargetUsernames(normalizedRoom, senderUsername).forEach((username) => {
    target = target.to(`user:${username}`);
  });
  target.emit('message_receipts_updated', payload);
}

function markMessagesSeen(room, messages = [], user = null) {
  const username = getReceiptUsername(user);
  const ids = messageIdsForReceipts(messages);
  if (!username || !ids.length) return false;
  const deliveredChanged = receiptStore.markDelivered(room, ids, username);
  const seenChanged = receiptStore.markSeen(room, ids, username);
  if (deliveredChanged || seenChanged) emitReceiptUpdate(room, messages, username);
  return deliveredChanged || seenChanged;
}

function getMessageCacheKey(room = '', chatId = '', params = {}) {
  return [
    String(room || '').trim().toLowerCase(),
    String(chatId || '').trim(),
    String(params.after_id || '').trim(),
    String(params.before_id || '').trim()
  ].join('|');
}

function invalidateRoomMessageCache(room = '') {
  const prefix = `${String(room || '').trim().toLowerCase()}|`;
  for (const key of messageFetchCache.keys()) {
    if (key.startsWith(prefix)) messageFetchCache.delete(key);
  }
}

async function fetchMessagesWithCache({ room, chatId, session, params = {}, mode = 'normal', noCache = false, fetcher }) {
  if (noCache) {
    const resp = await fetcher();
    return {
      status: resp?.status,
      data: resp?.data,
      headers: resp?.headers || {},
      fromCache: false,
      mode
    };
  }
  const cacheKey = getMessageCacheKey(room, chatId, params);
  const now = Date.now();
  const cached = messageFetchCache.get(cacheKey);
  if (cached?.response && cached.expiresAt > now) {
    return { ...cached.response, fromCache: true };
  }
  if (cached?.promise) {
    return cached.promise;
  }

  const promise = fetcher().then((resp) => {
    const response = {
      status: resp?.status,
      data: resp?.data,
      headers: resp?.headers || {},
      fromCache: false,
      mode
    };
    if (response.status === 200) {
      messageFetchCache.set(cacheKey, {
        response,
        expiresAt: Date.now() + MESSAGE_CACHE_TTL_MS,
        promise: null
      });
    } else {
      messageFetchCache.delete(cacheKey);
    }
    return response;
  }).catch((error) => {
    messageFetchCache.delete(cacheKey);
    throw error;
  });

  messageFetchCache.set(cacheKey, {
    response: null,
    expiresAt: now + MESSAGE_CACHE_TTL_MS,
    promise
  });
  return promise;
}
// Load effect definitions to get duration
const effectDefinitions = (() => {
  try {
    const effectList = require('../services/chat/effects.js');
    if (effectList && typeof effectList.listEffects === 'function') {
      const effects = effectList.listEffects();
      const map = new Map();
      for (const effect of effects || []) {
        if (effect && effect.id) {
          map.set(String(effect.id).trim().toLowerCase(), effect);
        }
      }
      return map;
    }
  } catch (e) {
    console.error('Failed to load effect definitions:', e.message);
  }
  return new Map();
})();

function listEffectDefinitions() {
  const definitions = effectList.listEffects();
  const staticTags = definitions.filter(effect => effect.scope === 'tag');
  return [
    ...definitions.filter(effect => effect.scope !== 'tag'),
    ...customTagStore.listCatalogTags(staticTags)
  ];
}

function resolveTagDefinition(tagId) {
  const id = String(tagId || '').trim().toLowerCase();
  const staticTag = effectDefinitions.get(id);
  return customTagStore.catalogTag(id, staticTag?.scope === 'tag' ? staticTag : null);
}

function staticTagDefinitions() {
  return effectList.listEffects().filter(effect => effect.scope === 'tag');
}

function isOwnerUser(user = {}) {
  return !!user.is_owner || String(user.role || '').trim().toLowerCase() === 'owner';
}

async function chargeEffectCoins(user, amount) {
  const userId = user?.id || user?._id;
  if (user?.source === 'database') {
    const result = await profileStore.spendCoins(userId, amount);
    return { ...user, id: result.id, _id: result.id, coins: result.coins };
  }
  return userStore.spendCoins(userId, amount);
}

async function grantRewardCoins(user, amount) {
  const userId = user?.id || user?._id;
  if (user?.source === 'database') {
    const result = await profileStore.grantCoins(userId, amount);
    return { ...user, id: result.id, _id: result.id, coins: result.coins };
  }
  return userStore.grantCoins(userId, amount);
}

function messageTimestampMs(message = {}) {
  const rawTimestamp = Number(message?.timestamp || message?.createdAt || 0);
  if (Number.isFinite(rawTimestamp) && rawTimestamp > 0) {
    return rawTimestamp < 10_000_000_000 ? rawTimestamp * 1000 : rawTimestamp;
  }
  const parsedDate = Date.parse(String(message?.date || message?.created_at || ''));
  return Number.isFinite(parsedDate) ? parsedDate : 0;
}

function compareMessagesChronologically(left = {}, right = {}) {
  const leftTimestamp = messageTimestampMs(left);
  const rightTimestamp = messageTimestampMs(right);
  if (leftTimestamp && rightTimestamp && leftTimestamp !== rightTimestamp) {
    return leftTimestamp - rightTimestamp;
  }

  const leftId = Number(left?.id || left?._id);
  const rightId = Number(right?.id || right?._id);
  if (Number.isFinite(leftId) && Number.isFinite(rightId) && leftId !== rightId) {
    return leftId - rightId;
  }
  return 0;
}

function sortMessagesChronologically(messages = []) {
  return (Array.isArray(messages) ? messages : [])
    .map((message, index) => ({ message, index }))
    .sort((left, right) => compareMessagesChronologically(left.message, right.message) || left.index - right.index)
    .map(({ message }) => message);
}

function messagesAfterCursor(messages = [], cursor = '') {
  const list = Array.isArray(messages) ? messages : [];
  const cursorId = String(cursor || '').trim();
  if (!cursorId) return list;

  const cursorIndex = list.findIndex((message) => String(message?.id || message?._id || '') === cursorId);
  if (cursorIndex >= 0) return list.slice(cursorIndex + 1);

  const numericCursor = Number(cursorId);
  if (Number.isFinite(numericCursor)) {
    return list.filter((message) => {
      const messageId = Number(message?.id || message?._id);
      return Number.isFinite(messageId) && messageId > numericCursor;
    });
  }
  return list;
}

function safeEffectUser(user) {
  if (!user) return null;
  return user.source === 'database' ? user : userStore.sanitizeUser(user);
}

async function resolveEffectAvatar(user) {
  const direct = user?.avatar || user?.avatar_url || user?.pfp;
  if (direct) return direct;
  const userId = user?.id || user?._id;
  if (!userId) return null;
  const account = await profileStore.findAccountById(userId).catch(() => null);
  return account?.avatar || account?.avatar_url || null;
}
// --- BEGIN chat-effects API PATCH ---
// Add chat-effects endpoints for compatibility with client
router.get('/chat-effects', auth, async (req, res) => {
  try {
    const user = req.user || getAuthenticatedUser(req);
    res.json({
      ok: true,
      effects: listEffectDefinitions(),
      user: safeEffectUser(user)
    });
  } catch (e) {
    res.status(500).json({ msg: 'Failed to load chat effects', details: e.message });
  }
});

router.post('/chat-effects/:effectId/purchase', auth, async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    const effectId = req.params.effectId;
    const effect = effectList.getEffect(String(effectId || '').trim().toLowerCase());
    if (!effect || effect.scope !== 'message') {
      return res.status(400).json({ msg: 'Only message effects can be purchased' });
    }
    if (req.user?.source === 'database') {
      const state = await effectStore.purchaseAndEquip(userId, effect);
      const account = await profileStore.findAccountById(userId);
      const user = { ...account, ...state, source: 'database' };
      identityStore.updateByUserId(userId, {
        name: user.name,
        avatar: user.avatar || null,
        equippedEffect: state.equippedEffect,
        equippedAvatarEffect: state.equippedAvatarEffect
      });
      return res.json({ ok: true, msg: `${effect.name} unlocked and equipped`, effect, user });
    }
    const purchase = userStore.purchaseEffect(userId, effect.id);
    const result = userStore.equipEffect(userId, effect.id);
    identityStore.updateByUserId(userId, {
      name: result.user.name,
      avatar: result.user.avatar || null,
      equippedEffect: result.user.equippedEffect || "none",
      equippedAvatarEffect: result.user.equippedAvatarEffect || "none"
    });
    res.json({
      ok: true,
      msg: `${purchase.effect.name} unlocked and equipped`,
      effect: purchase.effect,
      user: userStore.sanitizeUser(result.user)
    });
  } catch (e) {
    const status = e.code === 'INSUFFICIENT_COINS' ? 402
      : e.code === 'EFFECT_ALREADY_OWNED' ? 409
      : e.code === 'USER_NOT_FOUND' ? 404
      : ['42501', '42P01'].includes(e.code) ? 503
      : 400;
    res.status(status).json({ msg: e.message || 'Could not purchase effect' });
  }
});

router.post('/chat-effects/equip', auth, async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    const effectId = req.body?.effectId || req.body?.effect || 'none';
    if (req.user?.source === 'database') {
      const effect = effectList.getEffect(String(effectId || '').trim().toLowerCase());
      if (!effect || (effect.id !== 'none' && effect.scope !== 'message')) return res.status(400).json({ msg: 'Message effect not found' });
      const state = await effectStore.equip(userId, effect.id);
      const account = await profileStore.findAccountById(userId);
      const user = { ...account, ...state, source: 'database' };
      identityStore.updateByUserId(userId, {
        name: user.name,
        avatar: user.avatar || null,
        equippedEffect: state.equippedEffect,
        equippedAvatarEffect: state.equippedAvatarEffect
      });
      return res.json({ ok: true, msg: `${effect.name} equipped`, effect, user });
    }
    const effect = effectList.getEffect(String(effectId || '').trim().toLowerCase());
    if (!effect || (effect.id !== 'none' && effect.scope !== 'message')) return res.status(400).json({ msg: 'Message effect not found' });
    const result = userStore.equipEffect(userId, effect.id);
    identityStore.updateByUserId(userId, {
      name: result.user.name,
      avatar: result.user.avatar || null,
      equippedEffect: result.user.equippedEffect || "none",
      equippedAvatarEffect: result.user.equippedAvatarEffect || "none"
    });
    res.json({
      ok: true,
      msg: `${result.effect.name} equipped`,
      effect: result.effect,
      user: userStore.sanitizeUser(result.user)
    });
  } catch (e) {
    res.status(400).json({ msg: e.message || 'Could not equip effect' });
  }
});

router.get('/tag-manager', auth, (req, res) => {
  if (!isOwnerUser(req.user)) return res.status(403).json({ msg: 'Owner access required' });
  return res.json({
    ...customTagStore.listManagedTags(staticTagDefinitions()),
    effects: customTagStore.TAG_EFFECTS
  });
});

router.post('/tag-manager', auth, customTagAdminRateLimit, (req, res) => {
  if (!isOwnerUser(req.user)) return res.status(403).json({ msg: 'Owner access required' });
  try {
    const tag = customTagStore.createTag(req.body || {});
    emitTagCatalogUpdated();
    return res.status(201).json({ ok: true, msg: `${tag.name} created`, tag });
  } catch (error) {
    return res.status(400).json({ msg: error?.message || 'Could not create tag' });
  }
});

router.patch('/tag-manager/:tagId', auth, customTagAdminRateLimit, (req, res) => {
  if (!isOwnerUser(req.user)) return res.status(403).json({ msg: 'Owner access required' });
  try {
    const id = String(req.params.tagId || '').trim().toLowerCase();
    const staticTag = effectDefinitions.get(id);
    const tag = customTagStore.updateTag(id, req.body || {}, staticTag?.scope === 'tag' ? staticTag : null);
    if (!tag) return res.status(404).json({ msg: 'Tag not found' });
    emitTagCatalogUpdated();
    return res.json({ ok: true, msg: `${tag.name} updated`, tag });
  } catch (error) {
    return res.status(400).json({ msg: error?.message || 'Could not update tag' });
  }
});

router.delete('/tag-manager/:tagId', auth, customTagAdminRateLimit, async (req, res) => {
  if (!isOwnerUser(req.user)) return res.status(403).json({ msg: 'Owner access required' });
  const id = String(req.params.tagId || '').trim().toLowerCase();
  const staticTag = effectDefinitions.get(id);
  const tag = resolveTagDefinition(id);
  if (!tag) return res.status(404).json({ msg: 'Tag not found' });
  try {
    await profileStore.query('delete from public.chat_user_tags where tag_id = $1', [tag.id]);
  } catch (error) {
    console.error('Could not clean up removed custom tag ownership:', error.message);
    return res.status(503).json({ msg: 'Could not remove tag inventories; try again' });
  }
  customTagStore.removeTag(tag.id, staticTag?.scope === 'tag' ? staticTag : null);
  emitTagCatalogUpdated();
  return res.json({ ok: true, msg: `${tag.name} removed`, tag });
});

router.post('/tag-manager/:tagId/restore', auth, customTagAdminRateLimit, (req, res) => {
  if (!isOwnerUser(req.user)) return res.status(403).json({ msg: 'Owner access required' });
  const id = String(req.params.tagId || '').trim().toLowerCase();
  const staticTag = effectDefinitions.get(id);
  const tag = customTagStore.restoreTag(id, staticTag?.scope === 'tag' ? staticTag : null);
  if (!tag) return res.status(404).json({ msg: 'Hidden tag not found' });
  emitTagCatalogUpdated();
  return res.json({ ok:true, msg:`${tag.name} restored`, tag });
});

router.post('/rewards/focus-heartbeat', auth, focusRewardRateLimit, async (req, res) => {
  const user = req.user || getAuthenticatedUser(req);
  const userId = String(user?._id || user?.id || '').trim();
  if (!userId) return res.status(401).json({ msg: 'Authentication required' });

  const now = Date.now();
  const focused = req.body?.focused === true;
  const rewardState = focusRewardSessions.get(userId) || {
    activeMs: 0,
    lastFocusedHeartbeatAt: 0,
    lastTouchedAt: now,
    grantInFlight: false
  };

  if (focused) {
    const gapMs = rewardState.lastFocusedHeartbeatAt ? now - rewardState.lastFocusedHeartbeatAt : 0;
    if (gapMs > 0 && gapMs <= FOCUS_HEARTBEAT_MAX_GAP_MS) rewardState.activeMs += gapMs;
    rewardState.lastFocusedHeartbeatAt = now;
  } else {
    rewardState.lastFocusedHeartbeatAt = 0;
  }
  rewardState.lastTouchedAt = now;
  focusRewardSessions.set(userId, rewardState);

  let rewardedUser = null;
  let coinsEarned = 0;
  if (!rewardState.grantInFlight && rewardState.activeMs >= FOCUS_REWARD_INTERVAL_MS) {
    rewardState.activeMs -= FOCUS_REWARD_INTERVAL_MS;
    rewardState.grantInFlight = true;
    try {
      rewardedUser = await grantRewardCoins(user, FOCUS_REWARD_COINS);
      coinsEarned = FOCUS_REWARD_COINS;
    } catch (error) {
      rewardState.activeMs += FOCUS_REWARD_INTERVAL_MS;
      return res.status(500).json({ msg: error?.message || 'Could not grant focus reward' });
    } finally {
      rewardState.grantInFlight = false;
    }
  }

  if (focusRewardSessions.size > 5000) {
    const staleBefore = now - 24 * 60 * 60_000;
    for (const [key, value] of focusRewardSessions) {
      if (Number(value?.lastTouchedAt || 0) < staleBefore) focusRewardSessions.delete(key);
    }
  }

  return res.json({
    focused,
    activeMs: Math.floor(rewardState.activeMs),
    nextRewardInMs: Math.max(0, FOCUS_REWARD_INTERVAL_MS - rewardState.activeMs),
    reward: coinsEarned ? { coinsEarned, balance: rewardedUser?.coins ?? user?.coins ?? 0 } : null
  });
});

router.post('/chat-avatar-effects/:effectId/purchase', auth, async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    const effectId = String(req.params.effectId || '').trim().toLowerCase();
    const effect = effectDefinitions.get(effectId);
    if (!effect || effect.scope !== 'avatar') {
      return res.status(400).json({ msg: 'Avatar effect not found' });
    }
    if (req.user?.source === 'database') {
      const local = userStore.findById(userId) || userStore.findByUsername(req.user?.username);
      const localOwned = new Set(userStore.sanitizeUser(local)?.ownedAvatarEffects || []);
      let state;
      try {
        state = localOwned.has(effect.id)
          ? await effectStore.saveOwnedAvatarEffect(userId, effect.id, true)
          : await effectStore.purchaseAndEquipAvatar(userId, effect);
      } catch (error) {
        if (error?.code !== 'AVATAR_EFFECT_ALREADY_OWNED') throw error;
        state = await effectStore.equipAvatar(userId, effect.id);
      }
      const account = await profileStore.findAccountById(userId);
      const user = { ...account, ...state, source: 'database' };
      identityStore.updateByUserId(userId, {
        name: user.name,
        avatar: user.avatar || null,
        equippedEffect: state.equippedEffect,
        equippedAvatarEffect: state.equippedAvatarEffect,
        equippedTag: state.equippedTag
      });
      return res.json({ ok: true, msg: `${effect.name} unlocked and equipped`, effect, user });
    }
    const purchase = userStore.purchaseEffect(userId, effectId);
    const result = userStore.equipAvatarEffect(userId, effectId);
    identityStore.updateByUserId(userId, {
      name: result.user.name,
      avatar: result.user.avatar || null,
      equippedEffect: result.user.equippedEffect || 'none',
      equippedAvatarEffect: result.user.equippedAvatarEffect || 'none'
    });
    return res.json({
      ok: true,
      msg: `${purchase.effect.name} unlocked and equipped`,
      effect: purchase.effect,
      user: userStore.sanitizeUser(result.user)
    });
  } catch (e) {
    const status = e.code === 'INSUFFICIENT_COINS' ? 402
      : ['EFFECT_ALREADY_OWNED', 'AVATAR_EFFECT_ALREADY_OWNED'].includes(e.code) ? 409
      : e.code === 'USER_NOT_FOUND' ? 404
      : ['42501', '42P01'].includes(e.code) ? 503
      : 400;
    return res.status(status).json({ msg: e.message || 'Could not purchase avatar effect' });
  }
});

router.post('/chat-avatar-effects/equip', auth, async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    const effectId = String(req.body?.effectId || req.body?.avatarEffectId || 'none').trim().toLowerCase();
    const effect = effectId === 'none' ? { id: 'none', name: 'No avatar effect' } : effectDefinitions.get(effectId);
    if (!effect || (effect.id !== 'none' && effect.scope !== 'avatar')) {
      return res.status(400).json({ msg: 'Avatar effect not found' });
    }
    if (req.user?.source === 'database') {
      let state;
      try {
        state = await effectStore.equipAvatar(userId, effect.id);
      } catch (error) {
        if (effect.id === 'none' || error?.code !== 'AVATAR_EFFECT_NOT_OWNED') throw error;
        const local = userStore.findById(userId) || userStore.findByUsername(req.user?.username);
        const localOwned = new Set(userStore.sanitizeUser(local)?.ownedAvatarEffects || []);
        if (!localOwned.has(effect.id)) throw error;
        state = await effectStore.saveOwnedAvatarEffect(userId, effect.id, true);
      }
      const account = await profileStore.findAccountById(userId);
      const user = { ...account, ...state, source: 'database' };
      identityStore.updateByUserId(userId, {
        name: user.name,
        avatar: user.avatar || null,
        equippedEffect: state.equippedEffect,
        equippedAvatarEffect: state.equippedAvatarEffect,
        equippedTag: state.equippedTag
      });
      return res.json({ ok: true, msg: `${effect.name} equipped`, effect, user });
    }
    const result = userStore.equipAvatarEffect(userId, effect.id);
    identityStore.updateByUserId(userId, {
      name: result.user.name,
      avatar: result.user.avatar || null,
      equippedEffect: result.user.equippedEffect || 'none',
      equippedAvatarEffect: result.user.equippedAvatarEffect || 'none'
    });
    return res.json({
      ok: true,
      msg: `${effect.name} equipped`,
      effect,
      user: userStore.sanitizeUser(result.user)
    });
  } catch (e) {
    const status = ['42501', '42P01'].includes(e.code) ? 503 : 400;
    return res.status(status).json({ msg: e.message || 'Could not equip avatar effect' });
  }
});

router.post('/chat-tags/:tagId/purchase', auth, async (req, res) => {
  try {
    if (req.user?.source !== 'database') return res.status(400).json({ msg: 'Tags require a database-backed account' });
    const userId = req.user?.id || req.user?._id;
    const tag = resolveTagDefinition(req.params.tagId);
    if (!tag || tag.scope !== 'tag') return res.status(400).json({ msg: 'Tag not found' });
    const state = await effectStore.purchaseAndEquipTag(userId, tag);
    const account = await profileStore.findAccountById(userId);
    const user = { ...account, ...state, source:'database' };
    identityStore.updateByUserId(userId, {
      name:user.name,
      avatar:user.avatar || null,
      equippedTag:state.equippedTag
    });
    return res.json({ ok:true, msg:`${tag.name} unlocked and equipped`, tag, user });
  } catch (e) {
    const status = e.code === 'INSUFFICIENT_COINS' ? 402
      : e.code === 'TAG_ALREADY_OWNED' ? 409
      : e.code === 'USER_NOT_FOUND' ? 404
      : ['42501', '42P01'].includes(e.code) ? 503
      : 400;
    return res.status(status).json({ msg:e.message || 'Could not purchase tag' });
  }
});

router.post('/chat-tags/equip', auth, async (req, res) => {
  try {
    if (req.user?.source !== 'database') return res.status(400).json({ msg: 'Tags require a database-backed account' });
    const userId = req.user?.id || req.user?._id;
    const tagId = String(req.body?.tagId || 'none').trim().toLowerCase();
    const tag = tagId === 'none' ? { id:'none', name:'No tag' } : resolveTagDefinition(tagId);
    if (!tag || (tag.id !== 'none' && tag.scope !== 'tag')) return res.status(400).json({ msg: 'Tag not found' });
    const state = await effectStore.equipTag(userId, tag.id);
    const account = await profileStore.findAccountById(userId);
    const user = { ...account, ...state, source:'database' };
    identityStore.updateByUserId(userId, {
      name:user.name,
      avatar:user.avatar || null,
      equippedTag:state.equippedTag
    });
    return res.json({ ok:true, msg:`${tag.name} equipped`, tag, user });
  } catch (e) {
    const status = ['42501', '42P01'].includes(e.code) ? 503 : 400;
    return res.status(status).json({ msg:e.message || 'Could not equip tag' });
  }
});

router.post('/chat-banners/:bannerId/purchase', auth, async (req, res) => {
  try {
    if (req.user?.source !== 'database') return res.status(400).json({ msg:'Banners require a database-backed account' });
    const userId = req.user?.id || req.user?._id;
    const banner = effectDefinitions.get(String(req.params.bannerId || '').trim().toLowerCase());
    if (!banner || banner.scope !== 'banner') return res.status(400).json({ msg:'Banner not found' });
    const state = await bannerStore.purchaseAndEquip(userId, banner);
    const account = await profileStore.findAccountById(userId);
    const user = { ...account, ...state, source:'database' };
    return res.json({ ok:true, msg:`${banner.name} unlocked and equipped`, banner, user });
  } catch (e) {
    const status = e.code === 'INSUFFICIENT_COINS' ? 402 : e.code === 'BANNER_ALREADY_OWNED' ? 409 : ['42501','42P01'].includes(e.code) ? 503 : 400;
    return res.status(status).json({ msg:e.message || 'Could not purchase banner' });
  }
});

router.post('/chat-banners/equip', auth, async (req, res) => {
  try {
    if (req.user?.source !== 'database') return res.status(400).json({ msg:'Banners require a database-backed account' });
    const userId = req.user?.id || req.user?._id;
    const bannerId = String(req.body?.bannerId || 'none').trim().toLowerCase();
    const banner = bannerId === 'none' ? { id:'none', name:'No banner' } : effectDefinitions.get(bannerId);
    if (!banner || (banner.id !== 'none' && banner.scope !== 'banner')) return res.status(400).json({ msg:'Banner not found' });
    const state = await bannerStore.equip(userId, banner.id);
    const account = await profileStore.findAccountById(userId);
    const user = { ...account, ...state, source:'database' };
    return res.json({ ok:true, msg:`${banner.name} equipped`, banner, user });
  } catch (e) {
    const status = ['42501','42P01'].includes(e.code) ? 503 : 400;
    return res.status(status).json({ msg:e.message || 'Could not equip banner' });
  }
});

router.post('/chat-profile-effects/:effectId/purchase', auth, async (req, res) => {
  try {
    if (req.user?.source !== 'database') return res.status(400).json({ msg:'Profile effects require a database-backed account' });
    const userId = req.user?.id || req.user?._id;
    const effect = effectDefinitions.get(String(req.params.effectId || '').trim().toLowerCase());
    if (!effect || effect.scope !== 'profile') return res.status(400).json({ msg:'Profile effect not found' });
    const state = await profileEffectStore.purchaseAndEquip(userId, effect);
    const account = await profileStore.findAccountById(userId);
    const user = { ...account, ...state, source:'database' };
    identityStore.updateByUserId(userId, { equippedProfileEffect:state.equippedProfileEffect });
    return res.json({ ok:true, msg:`${effect.name} unlocked and equipped`, effect, user });
  } catch (error) {
    const status = error.code === 'INSUFFICIENT_COINS' ? 402 : error.code === 'PROFILE_EFFECT_ALREADY_OWNED' ? 409 : ['42501','42P01'].includes(error.code) ? 503 : 400;
    return res.status(status).json({ msg:error.message || 'Could not purchase profile effect' });
  }
});

router.post('/chat-profile-effects/equip', auth, async (req, res) => {
  try {
    if (req.user?.source !== 'database') return res.status(400).json({ msg:'Profile effects require a database-backed account' });
    const userId = req.user?.id || req.user?._id;
    const effectId = String(req.body?.effectId || 'none').trim().toLowerCase();
    const effect = effectId === 'none' ? { id:'none', name:'No profile effect' } : effectDefinitions.get(effectId);
    if (!effect || (effect.id !== 'none' && effect.scope !== 'profile')) return res.status(400).json({ msg:'Profile effect not found' });
    const state = await profileEffectStore.equip(userId, effect.id);
    const account = await profileStore.findAccountById(userId);
    const user = { ...account, ...state, source:'database' };
    identityStore.updateByUserId(userId, { equippedProfileEffect:state.equippedProfileEffect });
    return res.json({ ok:true, msg:`${effect.name} equipped`, effect, user });
  } catch (error) {
    const status = ['42501','42P01'].includes(error.code) ? 503 : 400;
    return res.status(status).json({ msg:error.message || 'Could not equip profile effect' });
  }
});

router.post('/chat-effects/rooms/:room', auth, async (req, res) => {
  // This endpoint triggers a room effect (generic)
  const room = String(req.params.room || '').trim();
  const effectId = req.body?.effectId || req.body?.effect || req.query?.effectId || req.query?.effect;
  const triggeredByName = req.user?.name || req.user?.username || 'Someone';
  let triggeredByAvatar = req.user?.avatar || req.user?.avatar_url || req.user?.pfp || null;
  if (!room || !effectId) return res.status(400).json({ msg: 'Room and effectId required' });
  // Simulate effect activation (store in netState)
  try {
    const cleanEffectId = String(effectId || '').trim().toLowerCase();
    const effectDef = effectDefinitions.get(cleanEffectId);
    if (!effectDef || effectDef.scope !== 'room') return res.status(400).json({ msg: 'Invalid room effect' });
    const chargedUser = await chargeEffectCoins(req.user, effectDef.price || 0);
    triggeredByAvatar ||= await resolveEffectAvatar(chargedUser);
    const durationMs = effectDef?.roomDurationMs || 0;
    const roomEffect = netState.setRoomEffect(room, {
      effectId: cleanEffectId,
      triggeredByName,
      triggeredByAvatar,
      triggeredByUsername: req.user?.username || null,
      triggeredByUserId: req.user?.id || req.user?._id || null,
      activatedAt: Date.now(),
      price: effectDef.price || 0,
      durationMs
    });
    invalidateRoomMessageCache(room);
    return res.json({
      ok: true,
      effectId: cleanEffectId,
      roomEffect,
      user: safeEffectUser(chargedUser)
    });
  } catch (e) {
    if (e?.code === 'INSUFFICIENT_COINS') return res.status(402).json({ msg: e.message || 'Not enough coins' });
    if (e?.code === 'USER_NOT_FOUND') return res.status(401).json({ msg: e.message || 'User not found' });
    return res.status(500).json({ msg: 'Failed to activate effect', error: e?.message });
  }
});

router.post('/chat-effects/rooms/:room/activate', auth, async (req, res) => {
  // This endpoint triggers a room effect (explicit activate)
  const room = String(req.params.room || '').trim();
  const effectId = req.body?.effectId || req.body?.effect || req.query?.effectId || req.query?.effect;
  const triggeredByName = req.user?.name || req.user?.username || 'Someone';
  let triggeredByAvatar = req.user?.avatar || req.user?.avatar_url || req.user?.pfp || null;
  if (!room || !effectId) return res.status(400).json({ msg: 'Room and effectId required' });
  try {
    const cleanEffectId = String(effectId || '').trim().toLowerCase();
    const effectDef = effectDefinitions.get(cleanEffectId);
    if (!effectDef || effectDef.scope !== 'room') return res.status(400).json({ msg: 'Invalid room effect' });
    const chargedUser = await chargeEffectCoins(req.user, effectDef.price || 0);
    triggeredByAvatar ||= await resolveEffectAvatar(chargedUser);
    const durationMs = effectDef?.roomDurationMs || 0;
    const effectName = String(effectDef?.name || cleanEffectId || 'effect').trim();
    const roomEffect = netState.setRoomEffect(room, {
      effectId: cleanEffectId,
      triggeredByName,
      triggeredByAvatar,
      triggeredByUsername: req.user?.username || null,
      triggeredByUserId: req.user?.id || req.user?._id || null,
      activatedAt: Date.now(),
      price: effectDef.price || 0,
      durationMs
    });
    invalidateRoomMessageCache(room);
    const systemMessage = await postRoomNote(
      room,
      `${triggeredByName} activated the ${effectName} room effect.`,
      SYSTEM_BOT_NAME
    );
    if (globalThis.__nebuloChatIo) {
      globalThis.__nebuloChatIo.to(room).emit('room_effect', {
        effectId: cleanEffectId,
        room,
        roomId: room,
        triggeredByName,
        triggeredByAvatar,
        effectName,
        activatedAt: roomEffect.activatedAt,
        durationMs: roomEffect.durationMs,
        expiresAt: roomEffect.expiresAt,
        roomEffect
      });
    }
    return res.json({
      ok: true,
      effectId: cleanEffectId,
      roomEffect,
      systemMessage: systemMessage || null,
      user: safeEffectUser(chargedUser)
    });
  } catch (e) {
    if (e?.code === 'INSUFFICIENT_COINS') return res.status(402).json({ msg: e.message || 'Not enough coins' });
    if (e?.code === 'USER_NOT_FOUND') return res.status(401).json({ msg: e.message || 'User not found' });
    return res.status(500).json({ msg: 'Failed to activate effect', error: e?.message });
  }
});

router.post('/chat-effects/rooms/:room/deactivate', auth, async (req, res) => {
  const room = String(req.params.room || '').trim();
  if (!room) return res.status(400).json({ msg: 'Room is required' });
  try {
    netState.clearRoomEffect(room);
    invalidateRoomMessageCache(room);
    return res.json({ ok: true });
  } catch (e) {
    return res.status(500).json({ msg: 'Failed to deactivate effect', error: e?.message });
  }
});

// GET current room effect
router.get('/chat-effects/rooms/:room', auth, async (req, res) => {
  const room = String(req.params.room || '').trim();
  try {
    const roomEffect = netState.getRoomEffect(room);
    return res.json({ roomEffect: roomEffect || null });
  } catch (e) {
    return res.status(500).json({ msg: 'Failed to get room effect', error: e?.message });
  }
});

// Global effect activation
router.post('/chat-effects/global/activate', auth, async (req, res) => {
  const effectId = req.body?.effectId || req.body?.effect || req.query?.effectId || req.query?.effect;
  const publicMessage = String(req.body?.message || '').trim();
  const triggeredByName = req.user?.name || req.user?.username || 'Someone';
  if (!effectId) return res.status(400).json({ msg: 'EffectId required' });
  const callerRole = String(req.user?.role || '').toLowerCase();
  if (netState.getModeration().lockdownActive && !['owner', 'admin'].includes(callerRole)) {
    return res.status(423).json({ msg: 'Global lockdown is active. Only staff can send public messages.' });
  }
  try {
    const cleanEffectId = String(effectId || '').trim().toLowerCase();
    const effectDef = effectDefinitions.get(cleanEffectId);
    if (!effectDef || effectDef.scope !== 'global') return res.status(400).json({ msg: 'Invalid global effect' });
    if (cleanEffectId === 'public_message' && !publicMessage) return res.status(400).json({ msg: 'Message required' });
    if (publicMessage.length > 280) return res.status(400).json({ msg: 'Public messages are limited to 280 characters' });
    const moderation = await moderatePublicMessage(publicMessage, {
      userId: req.user?.id || req.user?._id,
      username: req.user?.username || req.user?.name
    });
    if (!moderation.allowed) {
      return res.status(moderation.unavailable ? 503 : 422).json({
        msg: moderation.reason || 'Message was blocked by automated moderation',
        moderation: { blocked: true, category: moderation.category || 'unsafe-content' }
      });
    }
    const chargedUser = await chargeEffectCoins(req.user, effectDef.price || 0);

    // Broadcast the global effect to all connected clients via socket.io
    if (globalThis.__nebuloChatIo) {
      globalThis.__nebuloChatIo.emit('global_effect', {
        effectId: cleanEffectId,
        triggeredByName,
        message: publicMessage,
        activatedAt: Date.now(),
        durationMs: effectDef.roomDurationMs || 8000
      });
    }

    return res.json({
      ok: true,
      effectId: cleanEffectId,
      effect: effectDef,
      message: publicMessage,
      user: safeEffectUser(chargedUser)
    });
  } catch (e) {
    if (e?.code === 'INSUFFICIENT_COINS') return res.status(402).json({ msg: e.message || 'Not enough coins' });
    if (e?.code === 'USER_NOT_FOUND') return res.status(401).json({ msg: e.message || 'User not found' });
    return res.status(500).json({ msg: 'Failed to activate global effect', error: e?.message });
  }
});
// --- END chat-effects API PATCH ---
const SESSION_FILE = path.join(SESSION_DIR, 'tlk-sessions.json');
const ROOM_META_FILE = path.join(SESSION_DIR, 'tlk-room-meta.json');
const roomChatIdCache = new Map();
const adminHiddenRooms = new Set();
const DEBUG_TLK_MESSAGES = String(process.env.DEBUG_TLK_MESSAGES || 'false').toLowerCase() === 'true';

function debugMsg(event, meta = {}) {
  if (!DEBUG_TLK_MESSAGES) return;
  try {
    const payload = Object.entries(meta).map(([k, v]) => `${k}=${typeof v === 'object' ? JSON.stringify(v) : String(v)}`).join(' ');
    console.log(`[TLK:MSG] ${event}${payload ? ` ${payload}` : ''}`);
  } catch (_err) {
    console.log(`[TLK:MSG] ${event}`);
  }
}

function decodeHtmlEntities(input = '') {
  const text = String(input || '');
  if (!text.includes('&')) return text;

  const named = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&apos;': "'",
    '&nbsp;': ' '
  };

  let out = text.replace(/&(amp|lt|gt|quot|apos|nbsp|#39);/g, (m) => named[m] || m);
  out = out.replace(/&#(\d+);/g, (_m, dec) => {
    const code = Number(dec);
    return Number.isFinite(code) ? String.fromCodePoint(code) : _m;
  });
  out = out.replace(/&#x([0-9a-fA-F]+);/g, (_m, hex) => {
    const code = Number.parseInt(hex, 16);
    return Number.isFinite(code) ? String.fromCodePoint(code) : _m;
  });
  return out;
}

function saveSessions() {
  try {
    if (!fs.existsSync(SESSION_DIR)) {
      fs.mkdirSync(SESSION_DIR, { recursive: true });
    }
    const serializable = {};
    for (const [clientId, session] of bridgeSessions.entries()) {
      serializable[clientId] = {
        cookies: session.cookies || {},
        csrfToken: session.csrfToken || null,
        room: session.room || null,
        chatId: session.chatId || null,
        participant: session.participant || null,
        authUserId: session.authUserId || null
      };
    }
    fs.writeFileSync(SESSION_FILE, JSON.stringify(serializable, null, 2), 'utf8');
  } catch (_err) {
  }
}

function loadSessions() {
  try {
    if (!fs.existsSync(SESSION_FILE)) return;
    const raw = fs.readFileSync(SESSION_FILE, 'utf8');
    const parsed = JSON.parse(raw || '{}');
    Object.entries(parsed).forEach(([clientId, session]) => {
      bridgeSessions.set(clientId, {
        cookies: session?.cookies || {},
        csrfToken: session?.csrfToken || null,
        room: session?.room || null,
        chatId: session?.chatId || null,
        participant: session?.participant || null,
        authUserId: session?.authUserId || null
      });
    });
  } catch (_err) {
  }
}

loadSessions();

function saveRoomMeta() {
  try {
    if (!fs.existsSync(SESSION_DIR)) {
      fs.mkdirSync(SESSION_DIR, { recursive: true });
    }
    const out = {};
    for (const [room, chatId] of roomChatIdCache.entries()) {
      out[room] = chatId;
    }
    fs.writeFileSync(ROOM_META_FILE, JSON.stringify({ rooms: out, hiddenRooms: [...adminHiddenRooms] }, null, 2), 'utf8');
  } catch (_err) {
  }
}

function loadRoomMeta() {
  try {
    if (!fs.existsSync(ROOM_META_FILE)) return;
    const raw = fs.readFileSync(ROOM_META_FILE, 'utf8');
    const parsed = JSON.parse(raw || '{}');
    const rooms = parsed?.rooms && typeof parsed.rooms === 'object' ? parsed.rooms : {};
    const hiddenRooms = Array.isArray(parsed?.hiddenRooms) ? parsed.hiddenRooms : [];
    adminHiddenRooms.clear();
    hiddenRooms.forEach((room) => {
      const key = String(room || '').trim().toLowerCase();
      if (key) adminHiddenRooms.add(key);
    });
    Object.entries(rooms).forEach(([room, chatId]) => {
      const key = String(room || '').trim().toLowerCase();
      const id = String(chatId || '').trim();
      if (key && id) roomChatIdCache.set(key, id);
    });
  } catch (_err) {
  }
}

function readRoomMeta() {
  return {
    rooms: Array.from(roomChatIdCache.entries()).reduce((acc, [room, chatId]) => {
      if (room && chatId) acc[room] = chatId;
      return acc;
    }, {})
  };
}

function deleteRoomMeta(room = "") {
  const key = String(room || "").trim().toLowerCase();
  if (!key) return false;
  const deleted = roomChatIdCache.delete(key);
  adminHiddenRooms.add(key);
  saveRoomMeta();
  invalidateRoomMessageCache(key);
  try {
    netState.clearRoomEffect(key);
  } catch {}
  return deleted;
}

loadRoomMeta();

function getClientId(req) {
  const clientId = String(req.header('x-tlk-client-id') || req.query.clientId || req.body?.clientId || '').trim();
  return clientId || null;
}

function getDeviceId(req) {
  const deviceId = String(req.header('x-chat-device-id') || req.query.deviceId || req.body?.deviceId || '').trim();
  return deviceId || null;
}

function getSession(clientId) {
  if (!bridgeSessions.has(clientId)) {
    bridgeSessions.set(clientId, {
      cookies: {},
      csrfToken: null,
      room: null,
      chatId: null,
      participant: null,
      authUserId: null
    });
    saveSessions();
  }
  return bridgeSessions.get(clientId);
}

function resetSessionIdentity(session) {
  if (!session) return;
  session.cookies = {};
  session.csrfToken = null;
  session.room = null;
  session.chatId = null;
  session.participant = null;
  session.authUserId = null;
  saveSessions();
}

function applySetCookies(session, setCookie) {
  if (!setCookie) return;
  const cookieHeaders = Array.isArray(setCookie) ? setCookie : [setCookie];
  cookieHeaders.forEach((header) => {
    const pair = String(header).split(';')[0];
    const eqIdx = pair.indexOf('=');
    if (eqIdx > 0) {
      const name = pair.slice(0, eqIdx).trim();
      const value = pair.slice(eqIdx + 1).trim();
      session.cookies[name] = value;
    }
  });
  saveSessions();
}

function cookieHeader(session) {
  return Object.entries(session.cookies)
    .map(([k, v]) => `${k}=${v}`)
    .join('; ');
}

function extractMeta(html, room) {
  const csrfToken = (html.match(/meta name="csrf-token" content="([^"]+)"/i) || [])[1] || null;
  const chatId = (html.match(/Talkio\.Variables\.chat_id\s*=\s*'(\d+)'/) || [])[1] || null;

  if (!csrfToken || !chatId) {
    throw new Error(`Failed to parse tlk room metadata for "${room}"`);
  }

  return { csrfToken, chatId };
}

async function requestRoomPage(session, room) {
  const response = await axios.get(`${TLK_BASE}/${room}`, {
    headers: {
      Cookie: cookieHeader(session)
    },
    timeout: 12000,
    validateStatus: () => true
  });

  if (response.status !== 200) {
    throw new Error(`tlk room page fetch failed (${response.status})`);
  }

  applySetCookies(session, response.headers['set-cookie']);
  const { csrfToken, chatId } = extractMeta(response.data, room);
  session.csrfToken = csrfToken;
  session.room = room;
  session.chatId = chatId;
  const roomKey = String(room || '').trim().toLowerCase();
  roomChatIdCache.set(roomKey, String(chatId));
  adminHiddenRooms.delete(roomKey);
  saveRoomMeta();
  saveSessions();
  return { chatId };
}

async function retryRequest(fn, retries = RETRY_COUNT) {
  let lastError = null;
  for (let i = 0; i <= retries; i += 1) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (i < retries) {
        await new Promise((resolve) => setTimeout(resolve, 250 * (i + 1)));
      }
    }
  }
  throw lastError;
}

async function ensureRoom(session, room) {
  if (session.room === room && session.chatId && session.csrfToken) {
    return { chatId: session.chatId };
  }
  return requestRoomPage(session, room);
}

async function ensureParticipant(session, nickname) {
  if (session.participant?.token) {
    return session.participant;
  }

  const joinResponse = await retryRequest(() =>
    axios.post(
      `${TLK_BASE}/api/participant`,
      `nickname=${encodeURIComponent(nickname)}`,
      {
        headers: {
          ...createApiHeaders(session),
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        timeout: 12000,
        validateStatus: () => true
      }
    )
  );

  applySetCookies(session, joinResponse.headers['set-cookie']);
  if (joinResponse.status !== 200) {
    throw new Error(`participant join failed (${joinResponse.status})`);
  }

  session.participant = joinResponse.data;
  saveSessions();
  return session.participant;
}

async function postRoomNote(room, text, botName = SYSTEM_BOT_NAME) {
  try {
    const cleanBotName = String(botName || SYSTEM_BOT_NAME).trim() || SYSTEM_BOT_NAME;
    const modSession = getSession(`room-note:${cleanBotName}:${room}`);
    const existingNickname = String(modSession.participant?.nickname || '').trim().toLowerCase();
    if (modSession.participant?.token && existingNickname !== cleanBotName.toLowerCase()) {
      // Never let a persisted room-note session inherit a real user's identity.
      modSession.cookies = {};
      modSession.csrfToken = null;
      modSession.room = null;
      modSession.chatId = null;
      modSession.participant = null;
      saveSessions();
    }
    const { chatId } = await retryRequest(() => ensureRoom(modSession, room));
    await ensureParticipant(modSession, cleanBotName);

    const postNote = async () => retryRequest(() =>
      axios.post(
        `${TLK_BASE}/api/chats/${chatId}/messages`,
        `body=${encodeURIComponent(text)}`,
        {
          headers: {
            ...createApiHeaders(modSession),
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
          },
          timeout: 12000,
          validateStatus: () => true
        }
      )
    );

    let sendResponse = await postNote();
    if (sendResponse.status !== 200 || !sendResponse.data) {
      // Retry once with a fresh session participant in case token or room metadata expired.
      modSession.participant = null;
      saveSessions();
      await retryRequest(() => ensureRoom(modSession, room));
      await ensureParticipant(modSession, cleanBotName);
      sendResponse = await postNote();
    }

    applySetCookies(modSession, sendResponse.headers['set-cookie']);
    if (sendResponse.status === 200 && sendResponse.data) {
      const realtimeMessage = {
        ...enrichMessageIdentity(sendResponse.data),
        roomId: String(room || '').trim()
      };
      try {
        emitRealtimeMessage(String(room || '').trim(), realtimeMessage, cleanBotName);
      } catch {}
      return realtimeMessage;
    }
    console.error('Room note post failed after retry:', sendResponse.status, sendResponse.data);
    return null;
  } catch (error) {
    console.error('Room note post error:', error?.message || error);
    return null;
  }
}

function createApiHeaders(session, withJson = false) {
  const headers = {
    Cookie: cookieHeader(session),
    'X-CSRF-Token': session.csrfToken,
    'X-Requested-With': 'XMLHttpRequest',
    Accept: 'application/json, text/javascript, */*; q=0.01'
  };
  if (session?.participant?.token) {
    headers['X-Participant-Token'] = String(session.participant.token);
  }
  if (withJson) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
}

function getAuthenticatedUser(req) {
  if (req.user) return req.user;
  try {
    const token = String(req.header('x-auth-token') || '').trim();
    if (!token) return null;
    const decoded = jwt.verify(token, config.jwtSecret);
    const userId = decoded?.user?.id;
    if (!userId) return null;
    return userStore.findById(userId) || null;
  } catch (_err) {
    return null;
  }
}

async function sendRoomMessageOnce({
  room,
  body,
  clientId,
  deviceId,
  clientNonce: rawClientNonce,
  authUser,
  equippedEffect: rawEquippedEffect,
  equippedAvatarEffect: rawEquippedAvatarEffect,
  reply,
  attachments
}) {
  if (!clientId) return { status: 400, data: { msg: 'Missing x-tlk-client-id' } };

  const normalizedRoom = String(room || '').trim().toLowerCase();
  const cleanBody = String(body || '').trim();
  const clientNonce = String(rawClientNonce || '').trim().slice(0, 120);
  if (!cleanBody) return { status: 400, data: { msg: 'Message body is required' } };
  if (cleanBody.length > MAX_MESSAGE_BODY_LENGTH) {
    return { status: 400, data: { msg: `Message is too long. Limit is ${MAX_MESSAGE_BODY_LENGTH} characters.` } };
  }

  try {
    presence.touch(clientId, normalizedRoom, authUser || {});
    const session = getSession(clientId);
    if (!isGroupMember(normalizedRoom, authUser?.username || authUser?.name || '', authUser?.role || '')) {
      return { status: 403, data: { msg: 'Join this group before sending messages.' } };
    }
    const dmParticipants = getAuthorizedDmParticipants(normalizedRoom, authUser);
    if (dmParticipants === false) {
      return { status: 403, data: { msg: 'You are not a participant in this direct message.' } };
    }
    const persistentDm = Array.isArray(dmParticipants);
    const isPublicRoom = !persistentDm && !groupChats.getGroupSync(normalizedRoom);
    const callerRole = String(authUser?.role || '').toLowerCase();
    const isStaff = ['owner', 'admin'].includes(callerRole);
    if (isPublicRoom && netState.getModeration().lockdownActive && !isStaff) {
      return { status: 423, data: { msg: 'Global lockdown is active. Only staff can send messages in public channels.' } };
    }
    const authUserId = String(authUser?._id || authUser?.id || '').trim();
    const sessionAuthUserId = String(session.authUserId || '').trim();
    if (!persistentDm && session.participant && authUserId !== sessionAuthUserId) {
      resetSessionIdentity(session);
      return { status: 401, data: { msg: 'Chat identity changed. Rejoin the room first.' } };
    }
    let chatId = null;
    if (!persistentDm) {
      const ensured = await retryRequest(() => ensureRoom(session, normalizedRoom));
      chatId = ensured.chatId;
    }

    if (!persistentDm && !session.participant) {
      const nickname = authUser?.name || authUser?.username || 'guest';
      await ensureParticipant(session, nickname);
      session.authUserId = authUser?._id || authUser?.id || null;
      if (authUser && session.participant?.token) {
        try {
          identityStore.bindToken(session.participant.token, authUser);
        } catch (error) {
          console.warn('Could not persist chat identity:', error?.message || error);
        }
      }
      saveSessions();
    }

    const userToken = persistentDm
      ? `dm:${authUserId || String(authUser?.username || authUser?.name || '').trim().toLowerCase()}`
      : session.participant?.token;
    const userName = persistentDm
      ? String(authUser?.name || authUser?.username || 'Unknown')
      : (session.participant?.nickname || 'Unknown');
    const identity = { userToken, userId: authUser?._id || authUser?.id, deviceId };

    if (authUser?.source === 'database') {
      try {
        const warningCount = await moderationStore.getActiveWarningCount(authUser._id || authUser.id);
        const warningLimit = Number(netState.getModeration().warningLimit || 3);
        if (warningCount >= warningLimit && String(authUser?.role || '').toLowerCase() !== 'owner') {
          return { status: 403, data: { msg: `Your account is blocked after ${warningCount}/${warningLimit} active warnings. ${BAN_APPEAL_TEXT}` } };
        }
      } catch (error) {
        console.warn('Could not check persistent warnings:', error?.message || error);
      }
    }

    if (netState.isIdentityBanned(identity) || netState.isIdentityBannedInRoom(identity, normalizedRoom)) {
      return { status: 403, data: { msg: `User/account/device banned by moderation policy. ${BAN_APPEAL_TEXT}` } };
    }

    const moderation = await netState.moderateText(cleanBody);
    if (!moderation?.allowed) {
      const primaryReason = (moderation?.reasons || [])[0] || 'harmful content';
      if (!persistentDm) {
        await postRoomNote(normalizedRoom, `${userName} message blocked by moderation (${primaryReason}).`, SYSTEM_BOT_NAME);
      }

      return {
        status: 400,
        data: {
          msg: `Message blocked by AI moderation: ${primaryReason}`,
          moderation
        }
      };
    }

    const imageModeration = await uploadRoute.validateImageUrlsInText(cleanBody);
    if (!imageModeration.allowed) {
      const rawCategories = imageModeration.moderation?.result?.nsfwCategories || [];
      const nsfwCategories = Array.isArray(rawCategories)
        ? [...new Set(rawCategories.map((value) => {
          if (!value) return '';
          if (typeof value === 'string') return value.trim().toLowerCase();
          if (typeof value !== 'object') return String(value).trim().toLowerCase();
          return String(value.category || value.name || value.label || value.type || value.key || value.id || '').trim().toLowerCase();
        }).filter(Boolean))]
        : [];
      return {
        status: 400,
        data: {
          msg: imageModeration.reason || 'Image blocked by moderation',
          moderation: {
            blocked: true,
            category: imageModeration.moderation?.category || null,
            rating: imageModeration.moderation?.result?.summary?.contentRating || null,
            confidence: imageModeration.moderation?.result?.confidence ?? null,
            nsfwCategories,
            rawNsfwCategories: rawCategories,
            suggestedActions: imageModeration.moderation?.result?.suggestedActions || null,
            riskScores: imageModeration.moderation?.result?.riskScores || null
          }
        }
      };
    }

    const isOwner = callerRole === 'owner';
    if (!isOwner) {
      const cooldown = netState.checkCooldown(userToken, {
        room: normalizedRoom,
        excludeGlobal: excludesGlobalSlowmode(normalizedRoom)
      });
      if (cooldown.blocked) {
        const seconds = Math.ceil(cooldown.retryAfterMs / 1000);
        return {
          status: 429,
          data: { msg: `Slowmode active. Wait ${seconds}s before sending another message.` }
        };
      }
    }

    let upstreamMessage = null;
    if (!persistentDm) {
      // A message post is intentionally single-attempt. Retrying an ambiguous
      // upstream write can create a duplicate on TLK; the nonce cache protects
      // browser transport fallback without re-posting upstream.
      const response = await axios.post(
        `${TLK_BASE}/api/chats/${chatId}/messages`,
        `body=${encodeURIComponent(cleanBody)}`,
        {
          headers: {
            ...createApiHeaders(session),
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
          },
          timeout: 12000,
          validateStatus: () => true
        }
      );

      applySetCookies(session, response.headers['set-cookie']);

      if (response.status !== 200) {
        return { status: response.status, data: response.data || { msg: 'Failed to send message' } };
      }
      upstreamMessage = response.data;
      invalidateRoomMessageCache(normalizedRoom);
    }

    const senderSafe = authUser || null;
    const requestedEffect = rawEquippedEffect ? effectList.getEffect(rawEquippedEffect) : null;
    const validatedEffect = requestedEffect?.scope === 'message' ? requestedEffect.id : null;
    const effectToApply = validatedEffect || senderSafe?.equippedEffect || 'none';
    const requestedAvatarEffect = rawEquippedAvatarEffect ? effectList.getEffect(rawEquippedAvatarEffect) : null;
    const avatarEffectToApply = requestedAvatarEffect?.scope === 'avatar'
      ? requestedAvatarEffect.id
      : senderSafe?.equippedAvatarEffect || 'none';
    if (senderSafe?._id || senderSafe?.id) {
      identityStore.updateByUserId(senderSafe._id || senderSafe.id, {
        name: senderSafe.name,
        avatar: senderSafe.avatar || null,
        role: senderSafe.role || 'user',
        equippedEffect: effectToApply,
        equippedAvatarEffect: avatarEffectToApply,
        equippedTag: senderSafe.equippedTag || 'none'
      });
    }

    let enrichedMessage = {
      ...(persistentDm
        ? { body: cleanBody, nickname: userName, username: authUser?.username || userName, user_token: userToken }
        : enrichMessageIdentity(upstreamMessage)),
      ...(senderSafe ? {
        userId: senderSafe._id || senderSafe.id || null,
        username: senderSafe.username || null,
        nickname: senderSafe.name || senderSafe.username || userName,
        avatar: senderSafe.avatar || null,
        role: senderSafe.role || 'user',
        is_owner: !!(authUser?.is_owner),
        is_premium: !!(authUser?.is_premium),
        is_booster: !!(authUser?.is_booster),
        equippedEffect: effectToApply,
        equippedAvatarEffect: avatarEffectToApply,
        equippedTag: senderSafe.equippedTag || 'none'
      } : {}),
      roomId: normalizedRoom,
      reply: reply && typeof reply === 'object' ? reply : null,
      attachments: Array.isArray(attachments) ? attachments : [],
      ...(clientNonce ? { clientNonce } : {})
    };
    const replyMessageId = String(reply?.messageId || reply?.id || '').trim();
    const earnsReplyReward = !!(
      replyMessageId && messageFeatureStore.hasMessage(normalizedRoom, replyMessageId)
    );
    if (persistentDm) {
      enrichedMessage = await dmStore.addMessage(normalizedRoom, enrichedMessage, dmParticipants);
    }
    if (persistentDm || groupChats.getGroupSync(normalizedRoom)) {
      const receiptName = getReceiptUsername(authUser) || userName;
      const ids = messageIdsForReceipts([enrichedMessage]);
      receiptStore.markDelivered(normalizedRoom, ids, receiptName);
      receiptStore.markSeen(normalizedRoom, ids, receiptName);
      enrichedMessage = attachRoomReceipts(normalizedRoom, [enrichedMessage])[0] || enrichedMessage;
    }
    // The canonical message reaches connected clients before optional visual
    // snapshots and rewards. Those follow-up jobs must never change delivery.
    try {
      emitRealtimeMessage(normalizedRoom, enrichedMessage, userName);
    } catch {}
    void (async () => {
      try {
        await messageCosmeticStore.save(normalizedRoom, enrichedMessage);
        messageFeatureStore.recordMessage(normalizedRoom, enrichedMessage, { reply, attachments });
        const siteConfig = findSiteForRoom(normalizedRoom);
        const isGroupRoom = !!groupChats.getGroupSync(normalizedRoom);
        if (siteConfig?.persistMessagesToDb || isGroupRoom) {
          try {
            await chatMessagesStore.persistChatMessage({
              room: normalizedRoom,
              siteId: (siteConfig?.id || siteConfig?.channelName) || 'group',
              message: enrichedMessage
            });
          } catch (error) {
            console.warn('DB message persistence failed:', error?.message || error);
          }
        }
        if ((authUser?._id || authUser?.id) && !DISABLE_MESSAGE_COIN_REWARD) {
          const coinsEarned = earnsReplyReward ? 2 : 1;
          const rewardedUser = await grantRewardCoins(authUser, coinsEarned);
          const username = String(authUser?.username || authUser?.name || '').trim().toLowerCase();
          if (username) {
            globalThis.__nebuloChatIo?.to(`user:${username}`).emit('chat_reward', {
              balance: rewardedUser?.coins,
              coinsEarned,
              replyBonus: earnsReplyReward
            });
          }
        }
      } catch (error) {
        console.warn('Post-send chat work failed:', error?.message || error);
      }
    })();

    return {
      status: 200,
      data: {
        ...enrichedMessage,
        reward: null
      }
    };
  } catch (error) {
    console.error('TLK send error:', error?.message || error);
    return { status: 502, data: { msg: error?.message || 'TLK send failed' } };
  }
}

function messageNonceKey({ room, clientId, clientNonce, authUser }) {
  const nonce = String(clientNonce || '').trim();
  if (!nonce) return '';
  const sender = String(authUser?._id || authUser?.id || authUser?.username || authUser?.name || clientId || '').trim().toLowerCase();
  const normalizedRoom = String(room || '').trim().toLowerCase();
  return sender && normalizedRoom ? `${sender}:${normalizedRoom}:${nonce}` : '';
}

async function sendRoomMessage(input) {
  const key = messageNonceKey(input || {});
  if (!key) return sendRoomMessageOnce(input);
  const now = Date.now();
  for (const [nonceKey, cached] of messageNonceResults) {
    if (!cached || cached.expiresAt <= now) messageNonceResults.delete(nonceKey);
  }
  const cached = messageNonceResults.get(key);
  if (cached) return cached.result;
  if (messageNonceInflight.has(key)) return messageNonceInflight.get(key);

  const task = sendRoomMessageOnce(input)
    .then((result) => {
      // Cache accepted sends and uncertain upstream failures. This prevents a
      // socket fallback or reconnect from posting the same nonce to TLK twice.
      if (result?.status >= 200 && result.status < 300 || result?.status >= 500) {
        messageNonceResults.set(key, { result, expiresAt: Date.now() + MESSAGE_NONCE_TTL_MS });
      }
      return result;
    })
    .finally(() => messageNonceInflight.delete(key));
  messageNonceInflight.set(key, task);
  return task;
}

function normalizeIdentityName(value) {
  return String(value || '').trim().replace(/\s+/g, ' ').toLowerCase();
}

function identityMatchesMessageName(profile, nickname) {
  const messageName = normalizeIdentityName(nickname);
  if (!messageName) return true;
  const profileNames = [profile?.username, profile?.name]
    .map(normalizeIdentityName)
    .filter(Boolean);
  // A TLK participant token is only an implementation detail. Never let an
  // old/reused token overwrite the author name or avatar displayed on a saved
  // message. It must agree with the nickname embedded in that message.
  return profileNames.includes(messageName);
}

function findUniqueIdentityByMessageName(nickname) {
  const target = normalizeIdentityName(nickname);
  if (!target) return null;
  const matches = Object.values(identityStore.listAll() || {}).filter((profile) =>
    [profile?.username, profile?.name].map(normalizeIdentityName).includes(target)
  );
  const unique = new Map();
  matches.forEach((profile) => {
    const key = String(profile?.userId || profile?.username || '').trim().toLowerCase();
    if (key) unique.set(key, profile);
  });
  return unique.size === 1 ? [...unique.values()][0] : null;
}

function enrichMessageIdentity(msg) {
  const decodedBody = decodeHtmlEntities(msg?.body || '');
  const decodedNickname = decodeHtmlEntities(msg?.nickname || '');
  const normalizedNickname = String(decodedNickname || '').trim().toLowerCase();
  const generatedEffectNote = /\bactivated the .+ room effect for \d+ coins?\.?$/i.test(String(decodedBody || '').trim());
  const isSystem = normalizedNickname === SYSTEM_BOT_NAME.toLowerCase() || generatedEffectNote;
  const baseMessage = {
    ...msg,
    body: decodedBody,
    nickname: decodedNickname || msg?.nickname || 'Unknown',
    system: isSystem
  };
  const tokenProfile = identityStore.getByToken(msg?.user_token);
  const profile = identityMatchesMessageName(tokenProfile, decodedNickname)
    ? tokenProfile
    : null;
  if (!profile) {
    const byName = userStore.findByUsername(String(decodedNickname || '').trim());
    const idByUsername = identityStore.getByUsername(String(decodedNickname || '').trim());
    const identityProfile = idByUsername?.profile || findUniqueIdentityByMessageName(decodedNickname);
    if (!byName && !identityProfile) return baseMessage;
    const safe = byName ? userStore.sanitizeUser(byName) : null;
    return {
      ...baseMessage,
      userId: identityProfile?.userId || safe?._id || safe?.id || null,
      username: identityProfile?.username || safe?.username || baseMessage.username || null,
      nickname: decodedNickname || safe?.username || 'Unknown',
      avatar: identityProfile?.avatar || safe?.avatar || null,
      role: identityProfile?.role || safe?.role || null,
      is_owner: !!(identityProfile?.is_owner || safe?.is_owner),
      is_premium: !!(identityProfile?.is_premium || safe?.is_premium),
      is_booster: !!(identityProfile?.is_booster || safe?.is_booster),
      equippedEffect: identityProfile?.equippedEffect || safe?.equippedEffect || "none",
      equippedAvatarEffect: identityProfile?.equippedAvatarEffect || safe?.equippedAvatarEffect || "none",
      equippedTag: identityProfile?.equippedTag || safe?.equippedTag || "none",
      system: isSystem
    };
  }
  return {
    ...baseMessage,
    userId: profile.userId || null,
    username: profile.username || baseMessage.username || null,
    // The upstream nickname is the authored value. A matching local profile
    // can supply cosmetics, but must never replace the saved author label.
    nickname: decodedNickname || profile.name || profile.username || "Unknown",
    avatar: profile.avatar || null,
    role: profile.role || null,
    is_owner: !!(profile.is_owner),
    is_premium: !!(profile.is_premium),
    is_booster: !!(profile.is_booster),
    equippedEffect: profile.equippedEffect || "none",
    equippedAvatarEffect: profile.equippedAvatarEffect || "none",
    equippedTag: profile.equippedTag || "none",
    system: isSystem
  };
}

function profileForMessageUserId(userId) {
  const cleanUserId = String(userId || '').trim();
  if (!cleanUserId) return null;
  const storedUser = userStore.findById(cleanUserId);
  const safeStoredUser = storedUser ? userStore.sanitizeUser(storedUser) : null;
  const identityProfile = identityStore.getTokensByUserId(cleanUserId)
    .map((token) => identityStore.getByToken(token))
    .filter(Boolean)
    .sort((left, right) => Number(right.updatedAt || 0) - Number(left.updatedAt || 0))[0] || null;

  if (!safeStoredUser) return identityProfile;
  if (!identityProfile) return safeStoredUser;
  return {
    ...identityProfile,
    ...safeStoredUser,
    userId: cleanUserId,
    username: safeStoredUser.username || identityProfile.username || null,
    name: identityProfile.name || safeStoredUser.username || null,
    // The newest authenticated binding contains the account's current avatar.
    // Use its explicit null too, so removing an avatar clears old history.
    avatar: Object.prototype.hasOwnProperty.call(identityProfile, 'avatar')
      ? identityProfile.avatar
      : safeStoredUser.avatar
  };
}

function attachStableMessageAuthor(message = {}) {
  const profile = profileForMessageUserId(message.userId);
  if (!profile) return message;
  return {
    ...message,
    userId: profile._id || profile.id || profile.userId || message.userId || null,
    username: profile.username || message.username || null,
    nickname: message.nickname || profile.name || profile.username || 'Unknown',
    avatar: profile.avatar !== undefined ? profile.avatar : (message.avatar || null),
    role: profile.role || message.role || null,
    is_owner: profile.is_owner !== undefined ? !!profile.is_owner : !!message.is_owner,
    is_premium: profile.is_premium !== undefined ? !!profile.is_premium : !!message.is_premium,
    is_booster: profile.is_booster !== undefined ? !!profile.is_booster : !!message.is_booster
  };
}

async function attachMessageCosmetics(room, messages = []) {
  const list = Array.isArray(messages) ? messages : [];
  if (!list.length) return list;

  const snapshots = await messageCosmeticStore.getMany(room, list);
  const withoutSnapshots = list.filter((message) => {
    const id = String(message?.id || message?._id || '').trim();
    return !id || !snapshots.has(id);
  });
  const userIds = [...new Set(
    withoutSnapshots
      .map((message) => String(message?.userId || '').trim())
      .filter(Boolean)
  )];

  const [messageEffects, avatarEffects, tags] = await Promise.all([
    effectStore.getEquippedMessageEffects(userIds).catch(() => new Map()),
    effectStore.getEquippedAvatarEffects(userIds).catch(() => new Map()),
    effectStore.getEquippedTags(userIds).catch(() => new Map())
  ]);

  return list.map((message) => {
    const id = String(message?.id || message?._id || '').trim();
    const snapshot = snapshots.get(id);
    if (snapshot) {
      return attachStableMessageAuthor({
        ...message,
        userId: snapshot.userId || message.userId || null,
        equippedEffect: snapshot.equippedEffect,
        equippedAvatarEffect: snapshot.equippedAvatarEffect,
        equippedTag: snapshot.equippedTag
      });
    }

    const userId = String(message?.userId || '').trim();
    return attachStableMessageAuthor({
      ...message,
      equippedEffect: messageEffects.get(userId) || message.equippedEffect || 'none',
      equippedAvatarEffect: avatarEffects.get(userId) || message.equippedAvatarEffect || 'none',
      equippedTag: tags.get(userId) || message.equippedTag || 'none'
    });
  });
}

function attachMessageFeatures(room, messages = [], viewer = null) {
  messageFeatureStore.observeMessages(room, messages);
  return messageFeatureStore.decorateMessages(room, messages, viewer);
}

function withDeletedOverlay(msg, viewerRole = "user") {
  const deletedMeta = netState.getDeletedMessage(msg?.id);
  const isTlkDeleted = !!msg?.deleted;
  if (!deletedMeta && !isTlkDeleted) return msg;

  const isPrivilegedViewer = ["owner", "admin"].includes(String(viewerRole || "").toLowerCase());
  const adminDeletedOther = !!(
    deletedMeta &&
    deletedMeta.deletedByRole === "admin" &&
    !deletedMeta.deletedBySelf
  );
  if (adminDeletedOther && isPrivilegedViewer) {
    return {
      ...msg,
      deleted: true,
      deletedByRole: "admin",
      deletedBySelf: false,
      deletedVisibleToPrivileged: true,
      deletedOriginalBody: String(msg?.body || "")
    };
  }

  const byAdmin = deletedMeta?.deletedByRole === "admin";
  const bySelf = !!deletedMeta?.deletedBySelf;
  const body = byAdmin
    ? "This message was deleted by admin."
    : bySelf
      ? "This message was deleted by user."
      : "This message was deleted.";

  return {
    ...msg,
    deleted: true,
    body,
    deletedByRole: deletedMeta?.deletedByRole || "user",
    deletedBySelf: bySelf,
    deletedVisibleToPrivileged: false,
    deletedOriginalBody: null
  };
}

router.get('/rooms/:room/meta', auth, async (req, res) => {
  const clientId = getClientId(req);
  if (!clientId) return res.status(400).json({ msg: 'Missing x-tlk-client-id' });

  try {
    const authUser = getAuthenticatedUser(req);
    presence.touch(clientId, req.params.room, authUser || {});
    const session = getSession(clientId);
    const { chatId } = await ensureRoom(session, req.params.room);
    return res.json({
      room: req.params.room,
      chatId,
      participant: session.participant || null
    });
  } catch (error) {
    return res.status(502).json({ msg: error.message });
  }
});

router.get('/rooms/:room/settings', auth, async (req, res) => {
  const room = String(req.params.room || '').trim().toLowerCase();
  const authUser = getAuthenticatedUser(req) || req.user || null;
  if (!canUseRoomSettings(room, authUser, false)) {
    return res.status(403).json({ msg: 'Not allowed to view this room settings' });
  }
  return res.json({
    room,
    settings: netState.getRoomSettings(room)
  });
});

router.put('/rooms/:room/settings', auth, security.chatWriteRateLimit, async (req, res) => {
  const room = String(req.params.room || '').trim().toLowerCase();
  const authUser = getAuthenticatedUser(req) || req.user || null;
  if (!canUseRoomSettings(room, authUser, true)) {
    return res.status(403).json({ msg: 'Not allowed to change this room background' });
  }

  try {
    const settings = netState.setRoomSettings(room, {
      backgroundImage: normalizeBackgroundImage(req.body?.backgroundImage || '')
    });
    const updatedBy = String(authUser?.username || authUser?.name || '').trim();
    if (globalThis.__nebuloChatIo) {
      const payload = { room, settings, updatedBy };
      let target = globalThis.__nebuloChatIo.to(room);
      getMessageTargetUsernames(room, updatedBy).forEach((username) => {
        target = target.to(`user:${username}`);
      });
      target.emit('room_settings_updated', payload);
    }
    return res.json({ ok: true, room, settings });
  } catch (err) {
    return res.status(err.status || 500).json({ msg: err.message || 'Failed to update room settings' });
  }
});

router.post('/rooms/:room/join', auth, security.chatWriteRateLimit, async (req, res) => {
  const clientId = getClientId(req);
  if (!clientId) return res.status(400).json({ msg: 'Missing x-tlk-client-id' });

  const authUser = getAuthenticatedUser(req);
  const requestedNickname = String(
    req.body?.nickname ||
    req.query?.nickname ||
    req.header('x-chat-nickname') ||
    authUser?.name ||
    authUser?.username ||
    'guest'
  ).trim();
  const nameDecision = netState.moderateDisplayName(requestedNickname);
  const nickname = nameDecision.sanitized;

  try {
    const deviceId = getDeviceId(req);
    const identity = { userId: authUser?._id, deviceId, userToken: null };
    if (netState.isIdentityBanned(identity) || netState.isIdentityBannedInRoom(identity, req.params.room)) {
      return res.status(403).json({ msg: `This account/device is banned from chat. ${BAN_APPEAL_TEXT}` });
    }

    presence.touch(clientId, req.params.room, authUser || { username: nickname });
    const session = getSession(clientId);
    const authUserId = String(authUser?._id || '').trim();
    const sessionAuthUserId = String(session.authUserId || '').trim();
    const sessionNickname = String(session.participant?.nickname || '').trim();
    if (session.participant && (
      authUserId !== sessionAuthUserId ||
      (sessionNickname && sessionNickname !== nickname)
    )) {
      resetSessionIdentity(session);
    }

    await retryRequest(() => ensureRoom(session, req.params.room));

    const response = await retryRequest(() => axios.post(
      `${TLK_BASE}/api/participant`,
      `nickname=${encodeURIComponent(nickname)}`,
      {
        headers: {
          ...createApiHeaders(session),
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        timeout: 12000,
        validateStatus: () => true
      }
    ));

    applySetCookies(session, response.headers['set-cookie']);

    if (response.status !== 200) {
      return res.status(response.status).json(response.data || { msg: 'Join failed' });
    }

    session.participant = response.data;
    session.authUserId = authUser?._id || authUser?.id || null;
    if (authUser && session.participant?.token) {
      identityStore.bindToken(session.participant.token, authUser);
    }
    saveSessions();
    return res.json({
      ...response.data,
      requestedNickname,
      nickname,
      nameFiltered: !nameDecision.allowed,
      nameFilterReason: nameDecision.reason || null
    });
  } catch (error) {
    console.error('TLK join error:', error?.message || error);
    return res.status(502).json({ msg: error?.message || 'TLK join failed' });
  }
});

router.get('/rooms/:room/messages', auth, async (req, res) => {
  const clientId = getClientId(req);
  if (!clientId) return res.status(400).json({ msg: 'Missing x-tlk-client-id' });

  try {
    const startedAt = Date.now();
    const room = String(req.params.room || '').trim().toLowerCase();
    const requester = getAuthenticatedUser(req);
    const deviceId = getDeviceId(req);
    const requesterRole = String(requester?.role || "user").toLowerCase();
    presence.touch(clientId, room, requester || {});
    const session = getSession(clientId);
    const identity = { userId: requester?._id, deviceId, userToken: session?.participant?.token || null };
    if (netState.isIdentityBanned(identity) || netState.isIdentityBannedInRoom(identity, room)) {
      return res.status(403).json({ msg: `You are banned from this chat room. ${BAN_APPEAL_TEXT}` });
    }
    if (!isGroupMember(room, requester?.username || requester?.name || '', requesterRole)) {
      const isStaffMonitor = ['owner', 'admin'].includes(requesterRole) && req.query.monitor === '1';
      const isDm = buildDmParticipantsMap().has(room);
      if (isStaffMonitor && !isDm) {
        const limit = Math.max(25, Math.min(150, Number(req.query.limit) || DEFAULT_MESSAGE_LIMIT));
        const dbRows = await chatMessagesStore.getRecentChatMessages({ room, limit });
        const decoratedMessages = attachMessageFeatures(
          room,
          await attachMessageCosmetics(room, dbRows),
          requester
        );
        return res.json({
          monitored: true,
          room,
          messages: decoratedMessages.map((row) => ({
            id: row.message_id ? String(row.message_id) : `db-${row.id}`,
            _id: row.message_id ? String(row.message_id) : `db-${row.id}`,
            roomId: row.room,
            dbId: Number(row.id) || null,
            userId: row.user_id || null,
            username: row.username || null,
            nickname: row.nickname || row.username || 'Unknown',
            avatar: row.avatar || null,
            role: row.role || 'user',
            body: row.body || '',
            attachments: [],
            clientNonce: row.client_nonce || null,
            date: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
            persistedToDb: true
          }))
        });
      }
      return res.status(403).json({ msg: 'Join this group before viewing messages.' });
    }
    const dmParticipants = getAuthorizedDmParticipants(room, requester);
    if (dmParticipants === false) {
      return res.status(403).json({ msg: 'You are not a participant in this direct message.' });
    }
    if (Array.isArray(dmParticipants)) {
      const requestedLimit = Number(req.query.limit || DEFAULT_MESSAGE_LIMIT);
      const limit = Math.max(25, Math.min(150, Number.isFinite(requestedLimit) ? Math.floor(requestedLimit) : DEFAULT_MESSAGE_LIMIT));
      const messages = await dmStore.listMessages(room, limit, dmParticipants, {
        afterId: req.query.afterId,
        beforeId: req.query.beforeId
      });
      const decoratedMessages = attachMessageFeatures(
        room,
        await attachMessageCosmetics(room, messages),
        requester
      );
      markMessagesSeen(room, decoratedMessages, requester);
      return res.json(attachRoomReceipts(room, decoratedMessages));
    }

    let chatId = null;
    let usedCachedChatId = false;
    if (session.room === room && session.chatId) {
      chatId = String(session.chatId);
      usedCachedChatId = true;
      debugMsg('chatId-from-session', { room, clientId, chatId });
    } else if (roomChatIdCache.has(room)) {
      chatId = String(roomChatIdCache.get(room));
      session.room = room;
      session.chatId = chatId;
      saveSessions();
      usedCachedChatId = true;
      debugMsg('chatId-from-cache', { room, clientId, chatId });
    } else {
      const ensureStart = Date.now();
      const ensured = await retryRequest(() => ensureRoom(session, room));
      chatId = String(ensured?.chatId || '');
      debugMsg('chatId-from-ensure', { room, clientId, chatId, ms: Date.now() - ensureStart });
      if (!chatId) {
        return res.status(502).json({ msg: 'Unable to resolve room metadata' });
      }
    }

    const params = {};
    const afterId = String(req.query.afterId || '').trim();
    // tlk.io returns 204 for after_id even while newer messages exist. Share a
    // recent snapshot between viewers and apply each browser's cursor locally.
    if (req.query.beforeId) params.before_id = req.query.beforeId;
    const noCache = req.query.noCache === '1' || req.query.live === '1';
    const bypassSharedCache = noCache && !afterId;
    if (bypassSharedCache) params._nebulo_live = Date.now();

    const fetchMessages = (id, mode = 'normal') =>
      fetchMessagesWithCache({
        room,
        chatId: id,
        session,
        params,
        mode,
        noCache: bypassSharedCache,
        fetcher: () => retryRequest(() =>
          axios.get(`${TLK_BASE}/api/chats/${id}/messages`, {
            params,
            headers: {
              ...(session?.csrfToken
                ? createApiHeaders(session)
                : { Accept: 'application/json, text/javascript, */*; q=0.01' }),
              ...(noCache ? {
                'Cache-Control': 'no-cache, no-store, max-age=0',
                Pragma: 'no-cache'
              } : {})
            },
            timeout: 12000,
            validateStatus: () => true
          })
        )
      }).then((resp) => {
        debugMsg('fetchMessages-response', {
          room,
          clientId,
          mode,
          chatId: id,
          status: resp?.status,
          cached: !!resp?.fromCache,
          count: Array.isArray(resp?.data) ? resp.data.length : -1
        });
        return resp;
      });

    let response = await fetchMessages(chatId, 'initial');
    // If chatId went stale, refresh room metadata and retry once.
    if (response.status !== 200) {
      debugMsg('initial-non-200', { room, clientId, status: response.status, usedCachedChatId });
      const ensureStart = Date.now();
      const ensured = await retryRequest(() => ensureRoom(session, room));
      const freshChatId = String(ensured?.chatId || '');
      debugMsg('refresh-ensure', { room, clientId, freshChatId, ms: Date.now() - ensureStart });
      if (freshChatId) {
        chatId = freshChatId;
        response = await fetchMessages(chatId, 'after-ensure');
      }
    }

    if (!response.fromCache) applySetCookies(session, response.headers['set-cookie']);

    if (response.status !== 200) {
      debugMsg('final-non-200', { room, clientId, status: response.status, body: response.data });
      return res.status(response.status).json(response.data || { msg: 'Failed to fetch messages' });
    }

    const roomClearMeta = netState.getRoomClearMeta(room);
    const roomEffect = netState.getRoomEffect(room);
    const roomClearedAt = Number(roomClearMeta?.clearedAt || 0);
    const filtered = Array.isArray(response.data)
      ? response.data
          .filter((m) => {
            if (!roomClearedAt) return true;
            const tsMs = Number(m?.timestamp || 0) * 1000;
            return tsMs > roomClearedAt;
          })
          .filter((m) => !netState.isMutedUser(m.user_token))
          .map((m) => ({
            ...withDeletedOverlay(enrichMessageIdentity(m), requesterRole),
            roomEffect: roomEffect || null
          }))
          .filter((m) => m.system || netState.moderateTextRules(m.body).allowed)
      : [];
    const requestedLimit = Number(req.query.limit || DEFAULT_MESSAGE_LIMIT);
    const limit = Math.max(25, Math.min(150, Number.isFinite(requestedLimit) ? Math.floor(requestedLimit) : DEFAULT_MESSAGE_LIMIT));
    const orderedMessages = sortMessagesChronologically(filtered);
    const messagesForRequest = afterId ? messagesAfterCursor(orderedMessages, afterId) : orderedMessages;
    const latest = attachMessageFeatures(
      room,
      await attachMessageCosmetics(room, messagesForRequest.slice(-limit)),
      requester
    );
    const isGroupRoom = !!groupChats.getGroupSync(room);
    if (isGroupRoom) markMessagesSeen(room, latest, requester);
    debugMsg('success', {
      room,
      clientId,
      chatId,
      tlkCount: Array.isArray(response.data) ? response.data.length : 0,
      filteredCount: filtered.length,
      returnedCount: latest.length,
      ms: Date.now() - startedAt
    });
    if (noCache) {
      res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.set('Pragma', 'no-cache');
      res.set('Expires', '0');
    }
    return res.json(isGroupRoom ? attachRoomReceipts(room, latest) : latest);
  } catch (error) {
    debugMsg('exception', {
      room: String(req.params.room || '').trim().toLowerCase(),
      clientId: getClientId(req),
      err: error?.message || String(error),
      stack: error?.stack || ''
    });
    console.error('TLK messages error:', error?.message || error);
    return res.status(502).json({ msg: error?.message || 'TLK messages failed' });
  }
});

// @route   GET /api/tlk/rooms/:room/db-messages
// @desc    Return the latest messages stored in the external profile database
//          for rooms that opt into local persistence (configured via
//          networkSites.js). This is the read path for persisted rooms.
// @access  Private
router.get('/rooms/:room/db-messages', auth, async (req, res) => {
  const room = String(req.params.room || '').trim().toLowerCase();
  if (!room) return res.status(400).json({ msg: 'Room is required' });
  const callerRole = String(req.user?.role || '').toLowerCase();
  const isStaff = ['owner', 'admin'].includes(callerRole);
  const siteConfig = findSiteForRoom(room);
  const isGroupRoom = !!groupChats.getGroupSync(room);
  if (!siteConfig?.persistMessagesToDb && !isGroupRoom && !isStaff) {
    return res.status(404).json({ msg: 'Room does not persist messages to the database' });
  }
  const limit = Math.max(1, Math.min(200, Number(req.query.limit) || 80));
  let beforeId = null;
  if (req.query.beforeId !== undefined && req.query.beforeId !== null && String(req.query.beforeId).trim() !== '') {
    const raw = String(req.query.beforeId).trim();
    if (/^-?\d+$/.test(raw)) {
      beforeId = Number(raw);
    } else {
      beforeId = await chatMessagesStore.findDbIdByMessageId({ room, messageId: raw });
    }
  }
  try {
    const rows = await chatMessagesStore.getRecentChatMessages({ room, limit, beforeId });
    return res.json({
      room,
      siteId: siteConfig.id || siteConfig.channelName,
      messages: rows.map((row) => ({
        id: row.message_id ? String(row.message_id) : `db-${row.id}`,
        _id: row.message_id ? String(row.message_id) : `db-${row.id}`,
        roomId: row.room,
        dbId: Number(row.id) || null,
        userId: row.user_id || null,
        username: row.username || null,
        nickname: row.nickname || row.username || 'Unknown',
        avatar: row.avatar || null,
        role: row.role || 'user',
        body: row.body || '',
        clientNonce: row.client_nonce || null,
        date: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
        persistedToDb: true
      })),
      hasMore: rows.length === limit
    });
  } catch (error) {
    return res.status(502).json({ msg: error?.message || 'Failed to load persisted messages' });
  }
});

router.post('/rooms/:room/messages', auth, security.chatWriteRateLimit, async (req, res) => {
  const clientId = getClientId(req);
  const result = await sendRoomMessage({
    room: req.params.room,
    body: req.body?.body || req.body?.content,
    equippedEffect: req.body?.equippedEffect,
    equippedAvatarEffect: req.body?.equippedAvatarEffect,
    reply: req.body?.reply,
    attachments: req.body?.attachments,
    clientId,
    deviceId: getDeviceId(req),
    clientNonce: req.body?.clientNonce,
    authUser: getAuthenticatedUser(req)
  });
  return res.status(result.status).json(result.data);
});

router.get('/rooms/:room/state', auth, (req, res) => {
  try {
    return res.json({
      ...messageFeatureStore.roomState(req.params.room, getAuthenticatedUser(req) || req.user),
      allowedReactions: messageFeatureStore.ALLOWED_REACTIONS
    });
  } catch (error) {
    return res.status(500).json({ msg: error?.message || 'Failed to load room state' });
  }
});

router.get('/bookmarks', auth, (req, res) => {
  try {
    return res.json({ bookmarks: messageFeatureStore.bookmarks(getAuthenticatedUser(req) || req.user) });
  } catch (error) {
    return res.status(500).json({ msg: error?.message || 'Failed to load bookmarks' });
  }
});

router.patch('/rooms/:room/messages/:messageId', auth, security.chatWriteRateLimit, async (req, res) => {
  const room = String(req.params.room || '').trim().toLowerCase();
  const messageId = String(req.params.messageId || '').trim();
  const body = String(req.body?.body || req.body?.content || '').trim();
  if (!body) return res.status(400).json({ msg: 'Message body is required' });
  if (body.length > MAX_MESSAGE_BODY_LENGTH) {
    return res.status(400).json({ msg: `Message is too long. Limit is ${MAX_MESSAGE_BODY_LENGTH} characters.` });
  }
  try {
    const moderation = await netState.moderateText(body);
    if (!moderation?.allowed) {
      return res.status(400).json({ msg: `Message blocked by moderation: ${(moderation.reasons || [])[0] || 'content policy'}` });
    }
    await uploadRoute.validateImageUrlsInText(body);
    const message = messageFeatureStore.editMessage(room, messageId, getAuthenticatedUser(req) || req.user, body);
    const payload = { roomId: room, messageId, message };
    globalThis.__nebuloChatIo?.to(room)?.emit('message_edited', payload);
    return res.json(payload);
  } catch (error) {
    const status = error?.code === 'FORBIDDEN' ? 403
      : error?.code === 'MESSAGE_NOT_FOUND' ? 404
      : error?.code === 'INVALID_BODY' ? 400
      : Number(error?.status || 0) || 400;
    return res.status(status).json({ msg: error?.message || 'Failed to edit message' });
  }
});

router.post('/rooms/:room/messages/:messageId/reactions', auth, security.chatWriteRateLimit, (req, res) => {
  const room = String(req.params.room || '').trim().toLowerCase();
  const messageId = String(req.params.messageId || '').trim();
  try {
    const result = messageFeatureStore.toggleReaction(
      room,
      messageId,
      getAuthenticatedUser(req) || req.user,
      req.body?.emoji
    );
    globalThis.__nebuloChatIo?.to(room)?.emit('message_reactions_updated', {
      roomId: room,
      messageId,
      reactions: result.reactions.map(({ reacted, ...reaction }) => reaction)
    });
    return res.json(result);
  } catch (error) {
    const status = error?.code === 'MESSAGE_NOT_FOUND' ? 404
      : error?.code === 'UNAUTHORIZED' ? 401
      : 400;
    return res.status(status).json({ msg: error?.message || 'Failed to update reaction' });
  }
});

router.post('/rooms/:room/messages/:messageId/pin', auth, (req, res) => {
  const room = String(req.params.room || '').trim().toLowerCase();
  const messageId = String(req.params.messageId || '').trim();
  try {
    const result = messageFeatureStore.togglePin(room, messageId, getAuthenticatedUser(req) || req.user);
    globalThis.__nebuloChatIo?.to(room)?.emit('message_pin_updated', result);
    return res.json(result);
  } catch (error) {
    const status = error?.code === 'FORBIDDEN' ? 403
      : error?.code === 'MESSAGE_NOT_FOUND' ? 404
      : 400;
    return res.status(status).json({ msg: error?.message || 'Failed to update pin' });
  }
});

router.post('/rooms/:room/messages/:messageId/bookmark', auth, (req, res) => {
  try {
    return res.json(messageFeatureStore.toggleBookmark(
      req.params.room,
      req.params.messageId,
      getAuthenticatedUser(req) || req.user
    ));
  } catch (error) {
    const status = error?.code === 'MESSAGE_NOT_FOUND' ? 404 : 400;
    return res.status(status).json({ msg: error?.message || 'Failed to update bookmark' });
  }
});

router.post('/rooms/:room/read', auth, (req, res) => {
  const read = messageFeatureStore.markRead(
    req.params.room,
    req.body?.messageId,
    getAuthenticatedUser(req) || req.user
  );
  if (!read) return res.status(400).json({ msg: 'Message id is required' });
  return res.json({ ok: true, read });
});

router.post('/rooms/:room/messages/:messageId/delete', auth, async (req, res) => {
  const clientId = getClientId(req);
  if (!clientId) return res.status(400).json({ msg: 'Missing x-tlk-client-id' });

  const room = req.params.room;
  const messageId = String(req.params.messageId || '').trim();
  if (!messageId) return res.status(400).json({ msg: 'Message id is required' });

  try {
    const caller = getAuthenticatedUser(req) || req.user;
    presence.touch(clientId, room, caller || {});
    const dmParticipants = getAuthorizedDmParticipants(room, caller);
    if (dmParticipants === false) {
      return res.status(403).json({ msg: 'You are not a participant in this direct message.' });
    }
    if (Array.isArray(dmParticipants)) {
      const result = await dmStore.deleteMessage(room, messageId, caller, dmParticipants);
      if (!result.found) return res.status(404).json({ msg: 'Message not found' });
      if (result.forbidden) return res.status(403).json({ msg: 'You can only delete your own messages' });
      if (globalThis.__nebuloChatIo) {
        globalThis.__nebuloChatIo.to(String(room || '').trim().toLowerCase()).emit('message_deleted', {
          roomId: String(room || '').trim().toLowerCase(),
          messageId
        });
      }
      return res.json({ ok: true, id: messageId, deleted: true });
    }
    const session = getSession(clientId);
    const { chatId } = await retryRequest(() => ensureRoom(session, room));

    if (!session.participant) {
      return res.status(401).json({ msg: 'Join the room first' });
    }
    const role = String(caller.role || '').toLowerCase();
    const senderToken = String(req.body?.senderToken || '').trim();
    const callerToken = String(session.participant?.token || '').trim();
    const isOwnMessage = !!(senderToken && callerToken && senderToken === callerToken);
    const canModerateDelete = role === 'owner' || role === 'admin';
    if (!canModerateDelete && !isOwnMessage) {
      return res.status(403).json({ msg: 'Only owner/admin can delete others messages' });
    }

    let upstreamData = null;
    if (isOwnMessage) {
      const response = await retryRequest(() => axios.post(
        `${TLK_BASE}/api/chats/${chatId}/messages/${messageId}`,
        `_method=delete`,
        {
          headers: {
            ...createApiHeaders(session),
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
          },
          timeout: 12000,
          validateStatus: () => true
        }
      ));
      applySetCookies(session, response.headers['set-cookie']);
      if (response.status !== 200) {
        return res.status(response.status).json(response.data || { msg: 'Failed to delete message on tlk' });
      }
      upstreamData = response.data;
    }
    invalidateRoomMessageCache(room);

    const deleted = netState.deleteMessageById(messageId, {
      deletedByRole: canModerateDelete ? role : "user",
      deletedByName: String(caller.name || caller.username || role || "user"),
      deletedByUserId: String(caller._id || ""),
      deletedBySelf: isOwnMessage
    });
    if (globalThis.__nebuloChatIo) {
      globalThis.__nebuloChatIo.to(String(room || '').trim().toLowerCase()).emit('message_deleted', {
        roomId: String(room || '').trim().toLowerCase(),
        messageId,
        deleted
      });
    }
    return res.json({
      ...(upstreamData || { ok: true, id: messageId }),
      deleted
    });
  } catch (error) {
    console.error('TLK delete error:', error?.message || error);
    return res.status(502).json({ msg: error?.message || 'TLK delete failed' });
  }
});

router.post('/rooms/:room/moderation-note', auth, async (req, res) => {
  const room = String(req.params.room || '').trim();
  if (!room) return res.status(400).json({ msg: 'Room is required' });

  const caller = req.user;
  const role = String(caller?.role || '').toLowerCase();
  if (!['owner', 'admin'].includes(role)) {
    return res.status(403).json({ msg: 'Not authorized' });
  }

  const text = String(req.body?.text || '').trim();
  if (!text) return res.status(400).json({ msg: 'text is required' });

  try {
    await postRoomNote(room, text, SYSTEM_BOT_NAME);
    return res.json({ ok: true });
  } catch (error) {
    return res.status(502).json({ msg: error?.message || 'Failed to post moderation note' });
  }
});

// @route   GET api/tlk/admin/rooms
// @desc    Get all rooms for admin monitoring
// @access  Private (owner/admin)
router.get('/admin/rooms', auth, async (req, res) => {
  try {
    const user = req.user;
    if (!user || !['owner', 'admin'].includes(String(user.role || '').toLowerCase())) {
      return res.status(403).json({ msg: 'Not authorized' });
    }
    const meta = readRoomMeta();
    const participantsMap = buildDmParticipantsMap();
    const presenceCounts = presence.getCounts();
    const metaRooms = meta.rooms || {};

    const roomsById = new Map();
    const addRoom = (roomId, details = {}) => {
      const room = String(roomId || '').trim().toLowerCase();
      if (!room) return;
      const previous = roomsById.get(room) || {};
      roomsById.set(room, {
        ...previous,
        ...details,
        room,
        count: Number(presenceCounts.rooms?.[room] || 0),
        hasRoomMeta: Boolean(Object.prototype.hasOwnProperty.call(metaRooms, room))
      });
    };

    participantsMap.forEach((participants, room) => {
      if (adminHiddenRooms.has(room)) return;
      const count = Number(presenceCounts.rooms?.[room] || 0);
      const hasMeta = Object.prototype.hasOwnProperty.call(metaRooms, room);
      if (!hasMeta && count <= 0) return;
      addRoom(room, {
        type: 'dm',
        isDm: true,
        isGroup: false,
        participants,
        label: Array.isArray(participants) ? participants.join(' / ') : `DM room ${room}`
      });
    });

    groupChats.getGroupsSync().forEach((group) => {
      if (adminHiddenRooms.has(group.room)) return;
      addRoom(group.room, {
        type: 'group',
        isDm: false,
        isGroup: true,
        name: group.name || `Group ${group.room}`,
        members: Array.isArray(group.members) ? group.members : [],
        memberCount: Array.isArray(group.members) ? group.members.length : 0,
        createdAt: group.createdAt || null,
        label: group.name || `Group ${group.room}`
      });
    });

    Object.keys(metaRooms).forEach((room) => {
      if (adminHiddenRooms.has(room)) return;
      if (roomsById.has(room)) return;
      const participants = participantsMap.get(room) || null;
      const isDm = Array.isArray(participants) && participants.length > 0;
      addRoom(room, {
        type: isDm ? 'dm' : 'public',
        isDm,
        isGroup: false,
        participants,
        label: participants ? participants.join(' / ') : (isDm ? `DM room ${room}` : `#${room}`)
      });
    });

    const rooms = [...roomsById.values()].sort((a, b) => {
      const typeOrder = { dm: 0, group: 1, public: 2 };
      const typeDiff = (typeOrder[a.type] ?? 9) - (typeOrder[b.type] ?? 9);
      if (typeDiff) return typeDiff;
      return String(a.label || a.room).localeCompare(String(b.label || b.room));
    });
    return res.json({
      rooms,
      dmRooms: rooms.filter((room) => room.type === 'dm'),
      groupRooms: rooms.filter((room) => room.type === 'group')
    });
  } catch (error) {
    return res.status(500).json({ msg: error.message || 'Failed to get rooms' });
  }
});

// @route   DELETE api/tlk/admin/rooms/:room
// @desc    Remove a monitored DM/group room from local chat tracking
// @access  Private (owner/admin)
router.delete('/admin/rooms/:room', auth, async (req, res) => {
  try {
    const user = req.user;
    if (!user || !['owner', 'admin'].includes(String(user.role || '').toLowerCase())) {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    const room = String(req.params.room || '').trim().toLowerCase();
    if (!room) return res.status(400).json({ msg: 'Room is required' });

    const participantsMap = buildDmParticipantsMap();
    const group = groupChats.getGroup(room);
    const type = String(req.query.type || req.body?.type || '').trim().toLowerCase();
    const isDm = participantsMap.has(room);
    const isGroup = Boolean(group) || type === 'group';
    if (!isDm && !isGroup) {
      return res.status(400).json({ msg: 'Only direct message and group chat rooms can be deleted here' });
    }

    const deletedGroup = isGroup ? await groupChats.deleteGroup(room) : null;
    const removedRoomMeta = deleteRoomMeta(room);
    if (globalThis.__nebuloChatIo) {
      globalThis.__nebuloChatIo.to(room).emit('room_deleted', {
        room,
        type: isGroup ? 'group' : 'dm'
      });
    }

    return res.json({
      ok: true,
      room,
      type: isGroup ? 'group' : 'dm',
      deletedGroup: deletedGroup || null,
      removedRoomMeta
    });
  } catch (error) {
    return res.status(500).json({ msg: error.message || 'Failed to delete room' });
  }
});

router.postRoomNote = postRoomNote;
router.SYSTEM_BOT_NAME = SYSTEM_BOT_NAME;

router.sendRoomMessage = sendRoomMessage;

module.exports = router;
