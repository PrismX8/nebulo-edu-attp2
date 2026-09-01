const fs = require('fs');
const path = require('path');

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

function normalizeAttachment(item = {}) {
  const url = String(item?.url || '').trim();
  if (!/^https:\/\/[^\s"'<>]{1,2000}$/i.test(url)) return null;
  return {
    url,
    name: String(item?.name || 'Image').trim().slice(0, 160),
    type: String(item?.type || 'image').trim().toLowerCase().slice(0, 80)
  };
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
    imageUrl: /^https:\/\/[^\s"'<>]{1,2000}$/i.test(imageUrl) ? imageUrl : ''
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
  state.rooms = input?.rooms && typeof input.rooms === 'object' ? input.rooms : {};
  state.bookmarks = input?.bookmarks && typeof input.bookmarks === 'object' ? input.bookmarks : {};
  state.reads = input?.reads && typeof input.reads === 'object' ? input.reads : {};
  Object.keys(state.rooms).forEach(ensureRoom);
}

function load() {
  try {
    if (!fs.existsSync(STORE_FILE)) return;
    normalizeLoadedState(JSON.parse(fs.readFileSync(STORE_FILE, 'utf8') || '{}'));
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
    nickname: normalizeUsername(message.nickname || message.username || message.name || 'Unknown'),
    avatar: String(message.avatar || '').trim().slice(0, 2500),
    timestamp: message.timestamp || null,
    date: message.date || message.createdAt || message.created_at || null,
    equippedEffect: String(message.equippedEffect || 'none').slice(0, 80)
  };
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
  const roomId = normalizeRoom(room);
  const messageId = normalizeMessageId(message);
  const roomState = state.rooms[roomId];
  const feature = roomState?.messages?.[messageId];
  if (!feature) return message;
  const viewerKey = userKey(viewer);
  return {
    ...message,
    ...(feature.editedBody != null ? { body: feature.editedBody, content: feature.editedBody } : {}),
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
  hasMessage,
  markRead,
  observeMessages,
  recordMessage,
  roomState,
  toggleBookmark,
  togglePin,
  toggleReaction
};
