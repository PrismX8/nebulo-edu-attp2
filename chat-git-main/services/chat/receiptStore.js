const fs = require('fs');
const path = require('path');

const DATA_DIR = path.resolve(__dirname, '..', '..', 'data');
const RECEIPTS_FILE = path.join(DATA_DIR, 'message-receipts.json');

const state = { rooms: {} };

const normalizeRoom = (room = '') => String(room || '').trim().toLowerCase();
const normalizeMessageId = (id = '') => String(id || '').trim();
const normalizeUsername = (username = '') => String(username || '').trim();

function load() {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    if (!fs.existsSync(RECEIPTS_FILE)) {
      fs.writeFileSync(RECEIPTS_FILE, JSON.stringify({ rooms: {} }, null, 2), 'utf8');
      return;
    }
    const parsed = JSON.parse(fs.readFileSync(RECEIPTS_FILE, 'utf8'));
    state.rooms = parsed && typeof parsed.rooms === 'object' && parsed.rooms ? parsed.rooms : {};
  } catch {
    state.rooms = {};
  }
}

function save() {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(RECEIPTS_FILE, JSON.stringify({ rooms: state.rooms }, null, 2), 'utf8');
  } catch {}
}

function ensureEntry(room, messageId) {
  const safeRoom = normalizeRoom(room);
  const safeMessageId = normalizeMessageId(messageId);
  if (!safeRoom || !safeMessageId) return null;
  if (!state.rooms[safeRoom]) state.rooms[safeRoom] = {};
  if (!state.rooms[safeRoom][safeMessageId]) {
    state.rooms[safeRoom][safeMessageId] = { deliveredBy: {}, seenBy: {} };
  }
  if (!state.rooms[safeRoom][safeMessageId].deliveredBy) state.rooms[safeRoom][safeMessageId].deliveredBy = {};
  if (!state.rooms[safeRoom][safeMessageId].seenBy) state.rooms[safeRoom][safeMessageId].seenBy = {};
  return state.rooms[safeRoom][safeMessageId];
}

function markDelivered(room, messageIds = [], username = '') {
  const name = normalizeUsername(username);
  if (!name) return false;
  const now = Date.now();
  let changed = false;
  for (const id of messageIds) {
    const entry = ensureEntry(room, id);
    if (!entry) continue;
    if (!entry.deliveredBy[name]) {
      entry.deliveredBy[name] = now;
      changed = true;
    }
  }
  if (changed) save();
  return changed;
}

function markSeen(room, messageIds = [], username = '') {
  const name = normalizeUsername(username);
  if (!name) return false;
  const now = Date.now();
  let changed = false;
  for (const id of messageIds) {
    const entry = ensureEntry(room, id);
    if (!entry) continue;
    if (!entry.deliveredBy[name]) entry.deliveredBy[name] = now;
    if (!entry.seenBy[name]) {
      entry.seenBy[name] = now;
      changed = true;
    }
  }
  if (changed) save();
  return changed;
}

function attachReceipts(room, messages = []) {
  const safeRoom = normalizeRoom(room);
  const roomReceipts = state.rooms[safeRoom] || {};
  return (Array.isArray(messages) ? messages : []).map((message) => {
    const id = normalizeMessageId(message?.id || message?._id);
    const entry = id ? roomReceipts[id] : null;
    return {
      ...message,
      receipts: {
        deliveredBy: entry?.deliveredBy || {},
        seenBy: entry?.seenBy || {}
      }
    };
  });
}

load();

module.exports = {
  attachReceipts,
  markDelivered,
  markSeen
};
