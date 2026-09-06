const fs = require('fs');
const path = require('path');
const effectList = require('./effects');
const profileStore = require('../db/profileStore');

const DATA_DIR = path.resolve(__dirname, '..', '..', 'data');
const SNAPSHOT_FILE = String(
  process.env.MESSAGE_COSMETICS_FILE || path.join(DATA_DIR, 'message-cosmetics.jsonl')
).trim();
const snapshots = new Map();

let appendQueue = Promise.resolve();
let databaseReady = null;
let databaseRetryAt = 0;

const normalizeRoom = (room = '') => String(room || '').trim().toLowerCase().slice(0, 160);
const normalizeMessageId = (message = '') => String(
  typeof message === 'object' ? message?.id || message?._id || '' : message
).trim().slice(0, 240);
const normalizeUserId = (userId = '') => {
  const value = String(userId || '').trim();
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
    ? value
    : null;
};
const snapshotKey = (room, messageId) => `${normalizeRoom(room)}\u0000${normalizeMessageId(messageId)}`;

function normalizeCosmetic(effectId, scope) {
  const value = String(effectId || 'none').trim().toLowerCase();
  if (value === 'none') return 'none';
  const effect = effectList.getEffect(value);
  return effect?.scope === scope ? effect.id : 'none';
}

function normalizeSnapshot(room, message = {}) {
  const roomId = normalizeRoom(room);
  const messageId = normalizeMessageId(message);
  if (!roomId || !messageId) return null;
  return {
    roomId,
    messageId,
    userId: normalizeUserId(message.userId),
    equippedEffect: normalizeCosmetic(message.equippedEffect, 'message'),
    equippedAvatarEffect: normalizeCosmetic(message.equippedAvatarEffect, 'avatar'),
    equippedTag: normalizeCosmetic(message.equippedTag, 'tag'),
    savedAt: Number(message.savedAt || Date.now())
  };
}

function cacheSnapshot(snapshot) {
  if (!snapshot) return;
  snapshots.set(snapshotKey(snapshot.roomId, snapshot.messageId), snapshot);
}

function loadLocalSnapshots() {
  try {
    if (!fs.existsSync(SNAPSHOT_FILE)) return;
    const lines = fs.readFileSync(SNAPSHOT_FILE, 'utf8').split(/\r?\n/);
    for (const line of lines) {
      if (!line.trim()) continue;
      try {
        const parsed = JSON.parse(line);
        cacheSnapshot(normalizeSnapshot(parsed.roomId, {
          ...parsed,
          id: parsed.messageId
        }));
      } catch {}
    }
  } catch (error) {
    console.warn('Message cosmetics cache could not be loaded:', error?.message || error);
  }
}

function appendLocalSnapshot(snapshot) {
  appendQueue = appendQueue
    .catch(() => {})
    .then(async () => {
      await fs.promises.mkdir(path.dirname(SNAPSHOT_FILE), { recursive: true });
      await fs.promises.appendFile(SNAPSHOT_FILE, `${JSON.stringify(snapshot)}\n`, 'utf8');
    });
  return appendQueue;
}

async function ensureDatabase() {
  if (Date.now() < databaseRetryAt) return false;
  if (!databaseReady) {
    databaseReady = profileStore.query(`
      create table if not exists public.chat_message_cosmetics (
        room_id text not null,
        message_id text not null,
        user_id uuid null,
        message_effect text not null default 'none',
        avatar_effect text not null default 'none',
        tag_effect text not null default 'none',
        created_at timestamptz not null default now(),
        primary key (room_id, message_id)
      )
    `).then(() => true).catch((error) => {
      databaseReady = null;
      databaseRetryAt = Date.now() + 30_000;
      if (error?.code !== 'PROFILE_DB_NOT_CONFIGURED') {
        console.warn('Message cosmetics database is unavailable; using local persistence:', error?.message || error);
      }
      return false;
    });
  }
  return databaseReady;
}

async function save(room, message = {}) {
  const snapshot = normalizeSnapshot(room, message);
  if (!snapshot) return null;
  cacheSnapshot(snapshot);

  const localWrite = appendLocalSnapshot(snapshot);
  const databaseWrite = ensureDatabase().then((ready) => {
    if (!ready) return null;
    return profileStore.query(
      `insert into public.chat_message_cosmetics
         (room_id, message_id, user_id, message_effect, avatar_effect, tag_effect)
       values ($1, $2, $3::uuid, $4, $5, $6)
       on conflict (room_id, message_id) do update set
         user_id = excluded.user_id,
         message_effect = excluded.message_effect,
         avatar_effect = excluded.avatar_effect,
         tag_effect = excluded.tag_effect`,
      [
        snapshot.roomId,
        snapshot.messageId,
        snapshot.userId,
        snapshot.equippedEffect,
        snapshot.equippedAvatarEffect,
        snapshot.equippedTag
      ]
    );
  });
  const databaseResult = databaseWrite.then(
    () => null,
    (error) => error
  );

  try {
    await localWrite;
    databaseResult.then((error) => {
      if (error) console.warn('Message cosmetics database write failed:', error?.message || error);
    });
  } catch (localError) {
    const databaseError = await databaseResult;
    if (databaseError) {
      console.warn(
        'Message cosmetics could not be persisted:',
        databaseError?.message || localError?.message || databaseError || localError
      );
    }
  }
  return snapshot;
}

async function getMany(room, messages = []) {
  const roomId = normalizeRoom(room);
  const messageIds = [...new Set(
    (Array.isArray(messages) ? messages : [])
      .map(normalizeMessageId)
      .filter(Boolean)
  )];
  const found = new Map();
  if (!roomId || !messageIds.length) return found;

  for (const messageId of messageIds) {
    const snapshot = snapshots.get(snapshotKey(roomId, messageId));
    if (snapshot) found.set(messageId, snapshot);
  }

  const missing = messageIds.filter((messageId) => !found.has(messageId));
  if (!missing.length || !(await ensureDatabase())) return found;

  try {
    const result = await profileStore.query(
      `select room_id, message_id, user_id, message_effect, avatar_effect, tag_effect,
              extract(epoch from created_at) * 1000 as saved_at
         from public.chat_message_cosmetics
        where room_id = $1 and message_id = any($2::text[])`,
      [roomId, missing]
    );
    for (const row of result.rows || []) {
      const snapshot = normalizeSnapshot(row.room_id, {
        id: row.message_id,
        userId: row.user_id,
        equippedEffect: row.message_effect,
        equippedAvatarEffect: row.avatar_effect,
        equippedTag: row.tag_effect,
        savedAt: row.saved_at
      });
      if (!snapshot) continue;
      cacheSnapshot(snapshot);
      found.set(snapshot.messageId, snapshot);
    }
  } catch (error) {
    console.warn('Message cosmetics database read failed:', error?.message || error);
  }
  return found;
}

loadLocalSnapshots();

module.exports = {
  getMany,
  save
};
