const crypto = require('crypto');
const { getPool } = require('./profileStore');

let tableEnsured = false;
let initPromise = null;

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
  await ensureTable();
  const id = generateId();
  const byteSize = Buffer.isBuffer(data) ? data.length : Buffer.byteLength(data);
  await getPool().query(
    `INSERT INTO public.chat_images
      (id, user_id, username, room, filename, mime_type, byte_size, width, height, data, moderation)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
    [
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
    ]
  );
  return { id, byteSize };
}

async function getChatImage(id) {
  await ensureTable();
  const result = await getPool().query(
    `SELECT id, filename, mime_type, byte_size, width, height, data, created_at
     FROM public.chat_images WHERE id = $1 LIMIT 1`,
    [String(id || '').trim()]
  );
  return result.rows[0] || null;
}

module.exports = {
  saveChatImage,
  getChatImage,
  ensureTable
};
