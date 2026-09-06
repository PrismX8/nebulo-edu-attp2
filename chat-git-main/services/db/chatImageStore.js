const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { getPool } = require('./profileStore');

const LOCAL_IMAGE_DIR = path.resolve(__dirname, '..', '..', 'data', 'chat-images');

let tableEnsured = false;
let initPromise = null;

const isMissingRelationError = (error) => {
  if (!error) return false;
  if (error.code === '42P01') return true;
  const message = String(error.message || '').toLowerCase();
  return message.includes('does not exist') || message.includes('relation');
};

async function ensureTable() {
  if (tableEnsured) return;
  if (initPromise) return initPromise;
  initPromise = (async () => {
    try {
      await getPool().query(`
        CREATE TABLE IF NOT EXISTS public.chat_images (
          id TEXT PRIMARY KEY,
          user_id TEXT,
          username TEXT,
          room TEXT,
          filename TEXT NOT NULL,
          mime_type TEXT NOT NULL,
          byte_size INTEGER NOT NULL,
          width INTEGER,
          height INTEGER,
          data BYTEA NOT NULL,
          moderation JSONB,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `);
      await getPool().query(`CREATE INDEX IF NOT EXISTS chat_images_created_at_idx ON public.chat_images (created_at DESC)`);
      await getPool().query(`CREATE INDEX IF NOT EXISTS chat_images_user_idx ON public.chat_images (user_id)`);
      tableEnsured = true;
    } catch (error) {
      initPromise = null;
      throw error;
    }
  })();
  return initPromise;
}

function generateId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID().replace(/-/g, '');
  return crypto.randomBytes(16).toString('hex');
}

function localImagePaths(id) {
  const safeId = String(id || '').trim();
  if (!/^[\w-]{8,64}$/.test(safeId)) return null;
  return {
    data: path.join(LOCAL_IMAGE_DIR, `${safeId}.bin`),
    metadata: path.join(LOCAL_IMAGE_DIR, `${safeId}.json`)
  };
}

function saveLocalChatImage({ id, filename, mimeType, data, width, height, moderation }) {
  const paths = localImagePaths(id);
  if (!paths) throw new Error('Invalid local chat image id');
  fs.mkdirSync(LOCAL_IMAGE_DIR, { recursive: true });
  const buffer = Buffer.isBuffer(data) ? data : Buffer.from(data || []);
  fs.writeFileSync(paths.data, buffer);
  fs.writeFileSync(paths.metadata, JSON.stringify({
    id,
    filename: String(filename || 'image'),
    mime_type: String(mimeType || 'application/octet-stream'),
    byte_size: buffer.length,
    width: width ? Number(width) : null,
    height: height ? Number(height) : null,
    moderation: moderation || null,
    created_at: new Date().toISOString()
  }), 'utf8');
  return { id, byteSize: buffer.length, storage: 'local' };
}

function getLocalChatImage(id) {
  const paths = localImagePaths(id);
  if (!paths || !fs.existsSync(paths.data) || !fs.existsSync(paths.metadata)) return null;
  try {
    const metadata = JSON.parse(fs.readFileSync(paths.metadata, 'utf8') || '{}');
    if (metadata?.moderation?.blocked) return null;
    return { ...metadata, data: fs.readFileSync(paths.data) };
  } catch {
    return null;
  }
}

function deleteLocalChatImage(id) {
  const paths = localImagePaths(id);
  if (!paths) return false;
  let removed = false;
  for (const file of [paths.data, paths.metadata]) {
    try {
      if (fs.existsSync(file)) {
        fs.unlinkSync(file);
        removed = true;
      }
    } catch {}
  }
  return removed;
}

async function saveChatImage({
  userId = null,
  username = null,
  room = null,
  filename,
  mimeType,
  data,
  width = null,
  height = null,
  moderation = null
}) {
  const id = generateId();
  const byteSize = Buffer.isBuffer(data) ? data.length : Buffer.byteLength(data);
  const insertSql = `INSERT INTO public.chat_images
      (id, user_id, username, room, filename, mime_type, byte_size, width, height, data, moderation)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`;
  const insertParams = [
    id,
    userId ? String(userId) : null,
    username ? String(username) : null,
    room ? String(room) : null,
    String(filename || 'image'),
    String(mimeType || 'application/octet-stream'),
    byteSize,
    width ? Number(width) : null,
    height ? Number(height) : null,
    data,
    moderation ? JSON.stringify(moderation) : null
  ];
  const attemptInsert = async () => getPool().query(insertSql, insertParams);
  try {
    await ensureTable();
    await attemptInsert();
    return { id, byteSize };
  } catch (error) {
    if (isMissingRelationError(error)) {
      tableEnsured = false;
      initPromise = null;
      try {
        await ensureTable();
        await attemptInsert();
        return { id, byteSize };
      } catch (retryError) {
        return saveLocalChatImage({ id, filename, mimeType, data, width, height, moderation });
      }
    }
    return saveLocalChatImage({ id, filename, mimeType, data, width, height, moderation });
  }
}

async function getChatImage(id) {
  const sql = `SELECT id, filename, mime_type, byte_size, width, height, data, created_at
     FROM public.chat_images WHERE id = $1 LIMIT 1`;
  const params = [String(id || '').trim()];
  try {
    await ensureTable();
    const result = await getPool().query(sql, params);
    return result.rows[0] || getLocalChatImage(id);
  } catch (error) {
    if (isMissingRelationError(error)) {
      tableEnsured = false;
      initPromise = null;
      try {
        await ensureTable();
        const result = await getPool().query(sql, params);
        return result.rows[0] || getLocalChatImage(id);
      } catch (retryError) {
        return getLocalChatImage(id);
      }
    }
    return getLocalChatImage(id);
  }
}

async function deleteChatImage(id) {
  deleteLocalChatImage(id);
  try {
    await ensureTable();
    await getPool().query('DELETE FROM public.chat_images WHERE id = $1', [String(id || '').trim()]);
  } catch {}
}

module.exports = {
  saveChatImage,
  getChatImage,
  deleteChatImage,
  ensureTable
};
