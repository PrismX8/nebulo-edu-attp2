const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const userStore = require('../services/auth/localStore');
const identityStore = require('../services/network/identity');
const auth = require('../middleware/auth');
const netState = require('../services/network/state');
const presence = require('../services/network/presence');

const router = express.Router();

const TLK_BASE = 'https://tlk.io';
const bridgeSessions = new Map();
const RETRY_COUNT = 2;
const MOD_BOT_NAME = process.env.MOD_BOT_NAME || 'Moderation';
const SYSTEM_BOT_NAME = process.env.SYSTEM_BOT_NAME || 'System';
const SESSION_DIR = path.resolve(__dirname, '..', 'data');
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
// --- BEGIN chat-effects API PATCH ---
// Add chat-effects endpoints for compatibility with client
router.post('/chat-effects/rooms/:room', auth, async (req, res) => {
  // This endpoint triggers a room effect (generic)
  const room = String(req.params.room || '').trim();
  const effectId = req.body?.effectId || req.body?.effect || req.query?.effectId || req.query?.effect;
  const triggeredByName = req.user?.name || req.user?.username || 'Someone';
  if (!room || !effectId) return res.status(400).json({ msg: 'Room and effectId required' });
  // Simulate effect activation (store in netState)
  try {
    const cleanEffectId = String(effectId || '').trim().toLowerCase();
    const effectDef = effectDefinitions.get(cleanEffectId);
    const durationMs = effectDef?.roomDurationMs || 0;
    const roomEffect = netState.setRoomEffect(room, {
      effectId: cleanEffectId,
      triggeredByName,
      triggeredByUsername: req.user?.username || null,
      triggeredByUserId: req.user?._id || null,
      activatedAt: Date.now(),
      price: 0,
      durationMs
    });
    return res.json({ ok: true, effectId: cleanEffectId, roomEffect });
  } catch (e) {
    return res.status(500).json({ msg: 'Failed to activate effect', error: e?.message });
  }
});

router.post('/chat-effects/rooms/:room/activate', auth, async (req, res) => {
  // This endpoint triggers a room effect (explicit activate)
  const room = String(req.params.room || '').trim();
  const effectId = req.body?.effectId || req.body?.effect || req.query?.effectId || req.query?.effect;
  const triggeredByName = req.user?.name || req.user?.username || 'Someone';
  if (!room || !effectId) return res.status(400).json({ msg: 'Room and effectId required' });
  try {
    const cleanEffectId = String(effectId || '').trim().toLowerCase();
    const effectDef = effectDefinitions.get(cleanEffectId);
    const durationMs = effectDef?.roomDurationMs || 0;
    const effectName = String(effectDef?.name || cleanEffectId || 'effect').trim();
    const roomEffect = netState.setRoomEffect(room, {
      effectId: cleanEffectId,
      triggeredByName,
      triggeredByUsername: req.user?.username || null,
      triggeredByUserId: req.user?._id || null,
      activatedAt: Date.now(),
      price: 0,
      durationMs
    });
    const systemMessage = await postRoomNote(
      room,
      `${triggeredByName} activated the ${effectName} room effect.`,
      SYSTEM_BOT_NAME
    );
    return res.json({ ok: true, effectId: cleanEffectId, roomEffect, systemMessage: systemMessage || null });
  } catch (e) {
    return res.status(500).json({ msg: 'Failed to activate effect', error: e?.message });
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
  const triggeredByName = req.user?.name || req.user?.username || 'Someone';
  if (!effectId) return res.status(400).json({ msg: 'EffectId required' });
  try {
    const cleanEffectId = String(effectId || '').trim().toLowerCase();
    const effectDef = effectDefinitions.get(cleanEffectId);
    if (!effectDef) return res.status(400).json({ msg: 'Invalid global effect' });

    // Broadcast the global effect to all connected clients via socket.io
    if (globalThis.__nebuloChatIo) {
      globalThis.__nebuloChatIo.emit('global_effect', {
        effectId: cleanEffectId,
        triggeredByName,
        activatedAt: Date.now()
      });
    }

    return res.json({ ok: true, effectId: cleanEffectId, effect: effectDef });
  } catch (e) {
    return res.status(500).json({ msg: 'Failed to activate global effect', error: e?.message });
  }
});
// --- END chat-effects API PATCH ---
const SESSION_FILE = path.join(SESSION_DIR, 'tlk-sessions.json');
const ROOM_META_FILE = path.join(SESSION_DIR, 'tlk-room-meta.json');
const roomChatIdCache = new Map();
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
    fs.writeFileSync(ROOM_META_FILE, JSON.stringify({ rooms: out }, null, 2), 'utf8');
  } catch (_err) {
  }
}

function loadRoomMeta() {
  try {
    if (!fs.existsSync(ROOM_META_FILE)) return;
    const raw = fs.readFileSync(ROOM_META_FILE, 'utf8');
    const parsed = JSON.parse(raw || '{}');
    const rooms = parsed?.rooms && typeof parsed.rooms === 'object' ? parsed.rooms : {};
    Object.entries(rooms).forEach(([room, chatId]) => {
      const key = String(room || '').trim().toLowerCase();
      const id = String(chatId || '').trim();
      if (key && id) roomChatIdCache.set(key, id);
    });
  } catch (_err) {
  }
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
  roomChatIdCache.set(String(room || '').trim().toLowerCase(), String(chatId));
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

async function postRoomNote(room, text, botName = MOD_BOT_NAME) {
  try {
    const cleanBotName = String(botName || MOD_BOT_NAME).trim() || MOD_BOT_NAME;
    const modSession = getSession(`room-note:${cleanBotName}:${room}`);
    const { chatId } = await retryRequest(() => ensureRoom(modSession, room));
    await ensureParticipant(modSession, cleanBotName);

    const sendResponse = await retryRequest(() =>
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

    applySetCookies(modSession, sendResponse.headers['set-cookie']);
    if (sendResponse.status === 200 && sendResponse.data) {
      const realtimeMessage = {
        ...enrichMessageIdentity(sendResponse.data),
        roomId: String(room || '').trim()
      };
      try {
        globalThis.__nebuloChatIo?.to?.(String(room || '').trim())?.emit?.('receive_message', {
          roomId: String(room || '').trim(),
          message: realtimeMessage
        });
      } catch {}
      return realtimeMessage;
    }
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
  try {
    const token = String(req.header('x-auth-token') || '').trim();
    if (!token) return null;
    const decoded = jwt.verify(token, config.jwtSecret || 'secret');
    const userId = decoded?.user?.id;
    if (!userId) return null;
    return userStore.findById(userId) || null;
  } catch (_err) {
    return null;
  }
}

function enrichMessageIdentity(msg) {
  const decodedBody = decodeHtmlEntities(msg?.body || '');
  const decodedNickname = decodeHtmlEntities(msg?.nickname || '');
  const normalizedNickname = String(decodedNickname || '').trim().toLowerCase();
  const isSystem = normalizedNickname === SYSTEM_BOT_NAME.toLowerCase();
  const baseMessage = {
    ...msg,
    body: decodedBody,
    nickname: decodedNickname || msg?.nickname || 'Unknown',
    system: isSystem
  };
  const profile = identityStore.getByToken(msg?.user_token);
  if (!profile) {
    const byName = userStore.findByUsername(String(decodedNickname || '').trim());
    if (!byName) return baseMessage;
    const safe = userStore.sanitizeUser(byName);
    return {
      ...baseMessage,
      userId: safe?._id || null,
      nickname: safe?.name || decodedNickname || safe?.username || 'Unknown',
      avatar: safe?.avatar || null,
      role: safe?.role || null,
      equippedEffect: safe?.equippedEffect || "none",
      system: isSystem
    };
  }
  return {
    ...baseMessage,
    userId: profile.userId || null,
    nickname: profile.name || decodedNickname || profile.username || "Unknown",
    avatar: profile.avatar || null,
    role: profile.role || null,
    equippedEffect: profile.equippedEffect || "none",
    system: isSystem
  };
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

router.get('/rooms/:room/meta', async (req, res) => {
  const clientId = getClientId(req);
  if (!clientId) return res.status(400).json({ msg: 'Missing x-tlk-client-id' });

  try {
    presence.touch(clientId, req.params.room);
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

router.post('/rooms/:room/join', async (req, res) => {
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
      return res.status(403).json({ msg: 'This account/device is banned from chat.' });
    }

    presence.touch(clientId, req.params.room);
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
    session.authUserId = authUser?._id || null;
    if (authUser && session.participant?.token) {
      identityStore.bindToken(session.participant.token, userStore.sanitizeUser(authUser));
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

router.get('/rooms/:room/messages', async (req, res) => {
  const clientId = getClientId(req);
  if (!clientId) return res.status(400).json({ msg: 'Missing x-tlk-client-id' });

  try {
    const startedAt = Date.now();
    const room = String(req.params.room || '').trim().toLowerCase();
    const requester = getAuthenticatedUser(req);
    const deviceId = getDeviceId(req);
    const requesterRole = String(requester?.role || "user").toLowerCase();
    presence.touch(clientId, room);
    const session = getSession(clientId);
    const identity = { userId: requester?._id, deviceId, userToken: session?.participant?.token || null };
    if (netState.isIdentityBanned(identity) || netState.isIdentityBannedInRoom(identity, room)) {
      return res.status(403).json({ msg: 'You are banned from this chat room.' });
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
    if (req.query.afterId) params.after_id = req.query.afterId;
    if (req.query.beforeId) params.before_id = req.query.beforeId;

    const fetchMessages = (id, mode = 'normal') =>
      retryRequest(() =>
        axios.get(`${TLK_BASE}/api/chats/${id}/messages`, {
          params,
          headers: session?.csrfToken
            ? createApiHeaders(session)
            : { Accept: 'application/json, text/javascript, */*; q=0.01' },
          timeout: 12000,
          validateStatus: () => true
        })
      ).then((resp) => {
        debugMsg('fetchMessages-response', {
          room,
          clientId,
          mode,
          chatId: id,
          status: resp?.status,
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

    applySetCookies(session, response.headers['set-cookie']);

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
      : [];
    const latest = filtered.slice(-250);
    debugMsg('success', {
      room,
      clientId,
      chatId,
      tlkCount: Array.isArray(response.data) ? response.data.length : 0,
      filteredCount: filtered.length,
      returnedCount: latest.length,
      ms: Date.now() - startedAt
    });
    return res.json(latest);
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

router.post('/rooms/:room/messages', async (req, res) => {
  const clientId = getClientId(req);
  if (!clientId) return res.status(400).json({ msg: 'Missing x-tlk-client-id' });

  const room = req.params.room;
  const body = String(req.body?.body || req.body?.content || '').trim();
  if (!body) return res.status(400).json({ msg: 'Message body is required' });

  try {
    const authUser = getAuthenticatedUser(req);
    const deviceId = getDeviceId(req);
    presence.touch(clientId, room);
    const session = getSession(clientId);
    const authUserId = String(authUser?._id || '').trim();
    const sessionAuthUserId = String(session.authUserId || '').trim();
    if (session.participant && authUserId !== sessionAuthUserId) {
      resetSessionIdentity(session);
      return res.status(401).json({ msg: 'Chat identity changed. Rejoin the room first.' });
    }
    const { chatId } = await retryRequest(() => ensureRoom(session, room));

    if (!session.participant) {
      return res.status(401).json({ msg: 'Join the room first' });
    }

    const userToken = session.participant?.token;
    const userName = session.participant?.nickname || 'Unknown';
    const identity = { userToken, userId: authUser?._id, deviceId };

    if (netState.isIdentityBanned(identity) || netState.isIdentityBannedInRoom(identity, room)) {
      return res.status(403).json({ msg: 'User/account/device banned by moderation policy' });
    }

    const moderation = await netState.moderateText(body);
    if (!moderation?.allowed) {
      const primaryReason = (moderation?.reasons || [])[0] || 'harmful content';
      await postRoomNote(room, `${userName} message blocked by moderation (${primaryReason}).`);

      return res.status(400).json({
        msg: `Message blocked by AI moderation: ${primaryReason}`,
        moderation
      });
    }

    const callerRole = String(authUser?.role || "").toLowerCase();
    const isOwner = callerRole === "owner";
    if (!isOwner) {
      const cooldown = netState.checkCooldown(userToken);
      if (cooldown.blocked) {
        const seconds = Math.ceil(cooldown.retryAfterMs / 1000);
        return res.status(429).json({
          msg: `Slowmode active. Wait ${seconds}s before sending another message.`
        });
      }
    }

    const response = await retryRequest(() => axios.post(
      `${TLK_BASE}/api/chats/${chatId}/messages`,
      `body=${encodeURIComponent(body)}`,
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
      return res.status(response.status).json(response.data || { msg: 'Failed to send message' });
    }

    const enrichedMessage = {
      ...enrichMessageIdentity(response.data),
      roomId: room
    };

    try {
      globalThis.__nebuloChatIo?.to?.(room)?.emit?.("receive_message", {
        roomId: room,
        message: enrichedMessage
      });
    } catch {}

    let rewardedUser = null;
    if (authUser?._id) {
      rewardedUser = userStore.grantCoins(authUser._id, 1);
      if (rewardedUser) {
        identityStore.updateByUserId(authUser._id, {
          name: rewardedUser.name,
          avatar: rewardedUser.avatar || null,
          equippedEffect: rewardedUser.equippedEffect || "none"
        });
      }
    }

    return res.json({
      ...enrichedMessage,
      reward: rewardedUser
        ? {
            coinsEarned: 1,
            balance: rewardedUser.coins
          }
        : null
    });
  } catch (error) {
    console.error('TLK send error:', error?.message || error);
    return res.status(502).json({ msg: error?.message || 'TLK send failed' });
  }
});

router.post('/rooms/:room/messages/:messageId/delete', auth, async (req, res) => {
  const clientId = getClientId(req);
  if (!clientId) return res.status(400).json({ msg: 'Missing x-tlk-client-id' });

  const room = req.params.room;
  const messageId = String(req.params.messageId || '').trim();
  if (!messageId) return res.status(400).json({ msg: 'Message id is required' });

  try {
    const caller = userStore.findById(req.user.id);
    if (!caller) return res.status(401).json({ msg: 'User not found' });

    presence.touch(clientId, room);
    const session = getSession(clientId);
    const { chatId } = await retryRequest(() => ensureRoom(session, room));

    if (!session.participant) {
      return res.status(401).json({ msg: 'Join the room first' });
    }
    const role = String(caller.role || '').toLowerCase();
    const senderToken = String(req.body?.senderToken || '').trim();
    const callerToken = String(session.participant?.token || '').trim();
    const isOwnMessage = !!(senderToken && callerToken && senderToken === callerToken);
    const isOwner = role === 'owner';
    if (!isOwner && !isOwnMessage) {
      return res.status(403).json({ msg: 'Only owner can delete others messages' });
    }

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

    const deleted = netState.deleteMessageById(messageId, {
      deletedByRole: isOwner ? "admin" : role || "user",
      deletedByName: String(caller.name || caller.username || role || "user"),
      deletedByUserId: String(caller._id || ""),
      deletedBySelf: isOwnMessage
    });
    return res.json({
      ...(response.data || { ok: true, id: messageId }),
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

  const caller = userStore.findById(req.user.id);
  const role = String(caller?.role || '').toLowerCase();
  if (!caller) return res.status(401).json({ msg: 'User not found' });
  if (!['owner', 'admin'].includes(role)) {
    return res.status(403).json({ msg: 'Not authorized' });
  }

  const text = String(req.body?.text || '').trim();
  if (!text) return res.status(400).json({ msg: 'text is required' });

  try {
    await postRoomNote(room, text);
    return res.json({ ok: true });
  } catch (error) {
    return res.status(502).json({ msg: error?.message || 'Failed to post moderation note' });
  }
});

router.postRoomNote = postRoomNote;
router.SYSTEM_BOT_NAME = SYSTEM_BOT_NAME;

module.exports = router;
