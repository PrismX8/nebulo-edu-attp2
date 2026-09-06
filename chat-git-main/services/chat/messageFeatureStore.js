const fs = require('fs');
const path = require('path');
const { normalizeAttachment, attachmentUrl } = require('./attachments');

const DATA_DIR = path.resolve(__dirname, '..', '..', 'data');
const STORE_FILE = path.join(DATA_DIR, 'message-features.json');
const MAX_STORED_MESSAGES_PER_ROOM = 2000;
const ALLOWED_REACTIONS = new Set(['👍', '❤️', '😂', '😮', '😢', '🔥', '🎉', '💯']);

const state = {
  rooms: {},
  bookmarks: {},
  reads: {}
};

const normalizeRoom = (value = '') => String(value || '').trim().toLowerCase().slice(0, 160);
const normalizeMessageId = (value = '') => String(
  typeof value === 'object' ? value?.id || value?._id || '' : value
).trim().slice(0, 240);
const normalizeUsername = (value = '') => String(value || '').trim().slice(0, 64);
const normalizeBody = (value = '') => String(value || '').trim().slice(0, 5000);
const userId = (user = {}) => String(user?._id || user?.id || user?.userId || '').trim().slice(0, 120);
const username = (user = {}) => normalizeUsername(user?.username || user?.name || user?.nickname || '');
const userKey = (user = {}) => {
  const id = userId(user);
  const name = username(user).toLowerCase();
  return id ? `id:${id}` : name ? `name:${name}` : '';
};

function normalizeStoredAvatar(value = '') {
  const avatar = String(value || '').trim();
  if (!avatar) return null;
  // Profile pictures are often large data URLs. Duplicating one into every
  // message makes the history file enormous, and the previous 2,500 byte
  // truncation produced invalid images. Current identity data is attached by
  // the route when history is read, so only compact URL references belong in
  // the message snapshot.
  if (/^data:image\//i.test(avatar)) return null;
  return /^https?:\/\/[^\s"'<>]{1,2500}$/i.test(avatar) ? avatar : null;
}

function normalizeAttachments(items = []) {
  return (Array.isArray(items) ? items : [])
    .map(normalizeAttachment)
    .filter(Boolean)
    .slice(0, 4);
}

function normalizeReply(reply = null) {
  if (!reply || typeof reply !== 'object') return null;
  const messageId = normalizeMessageId(reply.messageId || reply.id);
  const author = normalizeUsername(reply.author || reply.username || reply.name);
  if (!messageId || !author) return null;
  const imageUrl = String(reply.imageUrl || '').trim();
  return {
    messageId,
    author,
    preview: String(reply.preview || reply.body || 'Message').replace(/\s+/g, ' ').trim().slice(0, 140) || 'Message',
    imageUrl: attachmentUrl(imageUrl)
  };
}

function ensureRoom(room) {
  const roomId = normalizeRoom(room);
  if (!roomId) return null;
  if (!state.rooms[roomId]) state.rooms[roomId] = { messages: {}, order: [], pinned: [] };
  const entry = state.rooms[roomId];
  if (!entry.messages || typeof entry.messages !== 'object') entry.messages = {};
  if (!Array.isArray(entry.order)) entry.order = [];
  if (!Array.isArray(entry.pinned)) entry.pinned = [];
  return entry;
}

function normalizeLoadedState(input = {}) {
  let changed = false;
  state.rooms = input?.rooms && typeof input.rooms === 'object' ? input.rooms : {};
  state.bookmarks = input?.bookmarks && typeof input.bookmarks === 'object' ? input.bookmarks : {};
  state.reads = input?.reads && typeof input.reads === 'object' ? input.reads : {};
  Object.keys(state.rooms).forEach((room) => {
    const roomState = ensureRoom(room);
    Object.values(roomState?.messages || {}).forEach((feature) => {
      if (!feature?.original || typeof feature.original !== 'object') return;
      const normalizedAvatar = normalizeStoredAvatar(feature.original.avatar);
      if (feature.original.avatar !== normalizedAvatar) {
        feature.original.avatar = normalizedAvatar;
        changed = true;
      }
    });
  });
  return changed;
}

function load() {
  try {
    if (!fs.existsSync(STORE_FILE)) return;
    const changed = normalizeLoadedState(JSON.parse(fs.readFileSync(STORE_FILE, 'utf8') || '{}'));
    if (changed) save();
  } catch (error) {
    console.warn('Message feature state could not be loaded:', error?.message || error);
    normalizeLoadedState({});
  }
}

function save() {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    const tempFile = `${STORE_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(state), 'utf8');
    fs.renameSync(tempFile, STORE_FILE);
    return true;
  } catch (error) {
    console.warn('Message feature state could not be saved:', error?.message || error);
    return false;
  }
}

function pruneRoom(roomState) {
  while (roomState.order.length > MAX_STORED_MESSAGES_PER_ROOM) {
    const oldestId = roomState.order.shift();
    if (!roomState.pinned.includes(oldestId)) delete roomState.messages[oldestId];
  }
}

function publicReactions(reactions = {}, viewer = null) {
  const viewerKey = userKey(viewer);
  return Object.entries(reactions || {}).map(([emoji, users]) => {
    const entries = Object.entries(users || {});
    return {
      emoji,
      count: entries.length,
      users: entries.map(([, name]) => String(name || '')).filter(Boolean).slice(0, 20),
      reacted: !!(viewerKey && users?.[viewerKey])
    };
  }).filter((item) => item.count > 0);
}

function messageSnapshot(message = {}) {
  return {
    id: normalizeMessageId(message),
    body: normalizeBody(message.body || message.content || ''),
    userId: userId(message) || null,
    username: normalizeUsername(message.username || message.sender?.username || '') || null,
    nickname: normalizeUsername(message.nickname || message.username || message.name || 'Unknown'),
    avatar: normalizeStoredAvatar(message.avatar),
    role: String(message.role || 'user').trim().toLowerCase().slice(0, 32),
    timestamp: message.timestamp || null,
    date: message.date || message.createdAt || message.created_at || null,
    equippedEffect: String(message.equippedEffect || 'none').slice(0, 80),
    equippedAvatarEffect: String(message.equippedAvatarEffect || 'none').slice(0, 80),
    equippedTag: String(message.equippedTag || 'none').slice(0, 80),
    is_owner: !!message.is_owner,
    is_premium: !!message.is_premium,
    is_booster: !!message.is_booster
  };
}

function getRoomMessageHistory(room, { limit = 50, beforeId = null } = {}) {
  const roomId = normalizeRoom(room);
  const roomState = state.rooms[roomId];
  if (!roomState || !Array.isArray(roomState.order)) return { messages: [], hasMore: false };

  const safeLimit = Math.max(1, Math.min(200, Number(limit) || 50));
  const targetId = normalizeMessageId(beforeId);
  let end = roomState.order.length;
  if (targetId) {
    const exactIndex = roomState.order.indexOf(targetId);
    if (exactIndex >= 0) {
      end = exactIndex;
    } else if (/^\d+$/.test(targetId)) {
      const numericTarget = BigInt(targetId);
      const firstNewerIndex = roomState.order.findIndex((id) => /^\d+$/.test(id) && BigInt(id) >= numericTarget);
      if (firstNewerIndex >= 0) end = firstNewerIndex;
    }
  }

  const start = Math.max(0, end - safeLimit);
  const messages = roomState.order.slice(start, end).map((messageId) => {
    const feature = roomState.messages?.[messageId];
    if (!feature) return null;
    const original = feature.original || {};
    return {
      ...original,
      id: messageId,
      _id: messageId,
      roomId,
      userId: original.userId || feature.authorUserId || null,
      username: original.username || feature.authorUsername || null,
      nickname: original.nickname || feature.authorUsername || 'Unknown',
      user_token: feature.userToken || null,
      body: feature.editedBody ?? feature.nativeBody ?? original.body ?? '',
      content: feature.editedBody ?? feature.nativeBody ?? original.body ?? '',
      avatar: original.avatar || null,
      reply: feature.reply || null,
      attachments: feature.attachments || [],
      persistedLocally: true
    };
  }).filter(Boolean);

  return { messages, hasMore: start > 0 };
}

function observeMessage(room, message = {}, extras = {}) {
  const roomState = ensureRoom(room);
  const messageId = normalizeMessageId(message);
  if (!roomState || !messageId || messageId.startsWith('pending:')) return null;
  const previous = roomState.messages[messageId] || {};
  const next = {
    ...previous,
    messageId,
    authorUserId: userId(message) || previous.authorUserId || null,
    authorUsername: normalizeUsername(message.nickname || message.username || message.name) || previous.authorUsername || 'Unknown',
    userToken: String(message.user_token || message.userToken || '').trim().slice(0, 300) || previous.userToken || null,
    original: previous.original || messageSnapshot(message),
    nativeBody: typeof extras.nativeBody === 'string' ? normalizeBody(extras.nativeBody) : previous.nativeBody,
    reply: normalizeReply(extras.reply || message.reply) || previous.reply || null,
    attachments: normalizeAttachments(extras.attachments || message.attachments).length
      ? normalizeAttachments(extras.attachments || message.attachments)
      : previous.attachments || [],
    reactions: previous.reactions || {},
    createdAt: previous.createdAt || Date.now()
  };
  roomState.messages[messageId] = next;
  if (!roomState.order.includes(messageId)) roomState.order.push(messageId);
  pruneRoom(roomState);
  return next;
}

function observeMessages(room, messages = []) {
  let changed = false;
  for (const message of Array.isArray(messages) ? messages : []) {
    const roomState = ensureRoom(room);
    const id = normalizeMessageId(message);
    if (!roomState || !id || roomState.messages[id]) continue;
    if (observeMessage(room, message)) changed = true;
  }
  if (changed) save();
}

function recordMessage(room, message = {}, extras = {}) {
  const entry = observeMessage(room, message, extras);
  if (entry) save();
  return entry;
}

function decorateMessage(room, message = {}, viewer = null) {
  if (message.deleted && !message.deletedVisibleToPrivileged) return { ...message, attachments: [], reply: null };
  const roomId = normalizeRoom(room);
  const messageId = normalizeMessageId(message);
  const roomState = state.rooms[roomId];
  const feature = roomState?.messages?.[messageId];
  if (!feature) return message;
  const viewerKey = userKey(viewer);
  return {
    ...message,
    ...((feature.editedBody ?? feature.nativeBody) != null ? { body: feature.editedBody ?? feature.nativeBody, content: feature.editedBody ?? feature.nativeBody } : {}),
    reply: feature.reply || message.reply || null,
    attachments: feature.attachments?.length ? feature.attachments : message.attachments || [],
    reactions: publicReactions(feature.reactions, viewer),
    pinned: !!roomState.pinned.includes(messageId),
    bookmarked: !!(viewerKey && state.bookmarks[viewerKey]?.[roomId]?.[messageId]),
    editedAt: feature.editedAt || null
  };
}

function decorateMessages(room, messages = [], viewer = null) {
  return (Array.isArray(messages) ? messages : []).map((message) => decorateMessage(room, message, viewer));
}

function requireFeature(room, messageId) {
  const roomId = normalizeRoom(room);
  const id = normalizeMessageId(messageId);
  const roomState = state.rooms[roomId];
  const feature = roomState?.messages?.[id];
  if (!roomState || !feature) {
    const error = new Error('Message metadata is not available yet');
    error.code = 'MESSAGE_NOT_FOUND';
    throw error;
  }
  return { roomId, messageId: id, roomState, feature };
}

function hasMessage(room, messageId) {
  const roomId = normalizeRoom(room);
  const id = normalizeMessageId(messageId);
  return !!(roomId && id && state.rooms[roomId]?.messages?.[id]);
}

function isMessageOwner(feature, user = {}) {
  const id = userId(user);
  const name = username(user).toLowerCase();
  return !!(
    (id && feature.authorUserId && id === String(feature.authorUserId)) ||
    (name && String(feature.authorUsername || '').toLowerCase() === name)
  );
}

function editMessage(room, messageId, user, body) {
  const { roomId, roomState, feature } = requireFeature(room, messageId);
  if (!isMessageOwner(feature, user)) {
    const error = new Error('You can only edit your own messages');
    error.code = 'FORBIDDEN';
    throw error;
  }
  const editedBody = normalizeBody(body);
  if (!editedBody) {
    const error = new Error('Message body is required');
    error.code = 'INVALID_BODY';
    throw error;
  }
  feature.editedBody = editedBody;
  feature.editedAt = Date.now();
  save();
  return decorateMessage(roomId, { ...(feature.original || {}), id: messageId }, user);
}

function toggleReaction(room, messageId, user, emoji) {
  const { roomId, feature } = requireFeature(room, messageId);
  const cleanEmoji = String(emoji || '').trim();
  if (!ALLOWED_REACTIONS.has(cleanEmoji)) {
    const error = new Error('Unsupported reaction');
    error.code = 'INVALID_REACTION';
    throw error;
  }
  const key = userKey(user);
  if (!key) {
    const error = new Error('User identity is required');
    error.code = 'UNAUTHORIZED';
    throw error;
  }
  if (!feature.reactions[cleanEmoji]) feature.reactions[cleanEmoji] = {};
  if (feature.reactions[cleanEmoji][key]) delete feature.reactions[cleanEmoji][key];
  else feature.reactions[cleanEmoji][key] = username(user) || 'User';
  if (!Object.keys(feature.reactions[cleanEmoji]).length) delete feature.reactions[cleanEmoji];
  save();
  return {
    roomId,
    messageId: normalizeMessageId(messageId),
    reactions: publicReactions(feature.reactions, user)
  };
}

function togglePin(room, messageId, user) {
  const resolved = requireFeature(room, messageId);
  const { roomId, roomState, feature } = resolved;
  const id = resolved.messageId;
  const role = String(user?.role || '').toLowerCase();
  if (!['owner', 'admin', 'mod'].includes(role)) {
    const error = new Error('Moderator access is required to pin messages');
    error.code = 'FORBIDDEN';
    throw error;
  }
  const index = roomState.pinned.indexOf(id);
  const pinned = index === -1;
  if (pinned) roomState.pinned.unshift(id);
  else roomState.pinned.splice(index, 1);
  roomState.pinned = roomState.pinned.slice(0, 50);
  feature.pinnedBy = pinned ? username(user) : null;
  feature.pinnedAt = pinned ? Date.now() : null;
  save();
  return { roomId, messageId: id, pinned };
}

function toggleBookmark(room, messageId, user) {
  const { roomId, feature } = requireFeature(room, messageId);
  const key = userKey(user);
  if (!key) {
    const error = new Error('User identity is required');
    error.code = 'UNAUTHORIZED';
    throw error;
  }
  if (!state.bookmarks[key]) state.bookmarks[key] = {};
  if (!state.bookmarks[key][roomId]) state.bookmarks[key][roomId] = {};
  const existing = state.bookmarks[key][roomId][messageId];
  const bookmarked = !existing;
  if (bookmarked) {
    state.bookmarks[key][roomId][messageId] = {
      savedAt: Date.now(),
      snapshot: feature.original || { id: messageId }
    };
  } else {
    delete state.bookmarks[key][roomId][messageId];
  }
  save();
  return { roomId, messageId: normalizeMessageId(messageId), bookmarked };
}

function markRead(room, messageId, user) {
  const roomId = normalizeRoom(room);
  const key = userKey(user);
  const id = normalizeMessageId(messageId);
  if (!roomId || !key || !id) return null;
  if (!state.reads[key]) state.reads[key] = {};
  state.reads[key][roomId] = { messageId: id, readAt: Date.now() };
  save();
  return state.reads[key][roomId];
}

function roomState(room, user) {
  const roomId = normalizeRoom(room);
  const key = userKey(user);
  const roomEntry = ensureRoom(roomId);
  const bookmarkIds = key ? Object.keys(state.bookmarks[key]?.[roomId] || {}) : [];
  return {
    roomId,
    read: key ? state.reads[key]?.[roomId] || null : null,
    bookmarkIds,
    pinned: roomEntry.pinned
      .map((messageId) => {
        const feature = roomEntry.messages[messageId];
        if (!feature) return null;
        return decorateMessage(roomId, { ...(feature.original || {}), id: messageId }, user);
      })
      .filter(Boolean)
  };
}

function bookmarks(user) {
  const key = userKey(user);
  if (!key) return [];
  const result = [];
  for (const [roomId, roomBookmarks] of Object.entries(state.bookmarks[key] || {})) {
    for (const [messageId, bookmark] of Object.entries(roomBookmarks || {})) {
      const feature = state.rooms[roomId]?.messages?.[messageId];
      const snapshot = feature?.original || bookmark?.snapshot || { id: messageId };
      result.push({
        ...decorateMessage(roomId, { ...snapshot, id: messageId }, user),
        roomId,
        bookmarked: true,
        bookmarkedAt: bookmark?.savedAt || null
      });
    }
  }
  return result.sort((a, b) => Number(b.bookmarkedAt || 0) - Number(a.bookmarkedAt || 0));
}

load();

module.exports = {
  ALLOWED_REACTIONS: [...ALLOWED_REACTIONS],
  bookmarks,
  decorateMessages,
  editMessage,
  getRoomMessageHistory,
  hasMessage,
  markRead,
  observeMessages,
  recordMessage,
  roomState,
  toggleBookmark,
  togglePin,
  toggleReaction
};
