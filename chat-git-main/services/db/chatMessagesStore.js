const { getPool } = require('./profileStore');

let tableEnsured = false;
let initPromise = null;

async function ensureTable() {
  if (tableEnsured) return;
  if (initPromise) return initPromise;
  initPromise = (async () => {
    try {
      await getPool().query(`
        CREATE TABLE IF NOT EXISTS public.chat_messages (
          id BIGSERIAL PRIMARY KEY,
          room TEXT NOT NULL,
          site_id TEXT,
          message_id TEXT,
          user_id TEXT,
          username TEXT,
          nickname TEXT,
          body TEXT NOT NULL,
          avatar TEXT,
          role TEXT,
          client_nonce TEXT,
          raw JSONB,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `);
      await getPool().query(`CREATE INDEX IF NOT EXISTS chat_messages_room_created_idx ON public.chat_messages (room, created_at DESC)`);
      await getPool().query(`CREATE INDEX IF NOT EXISTS chat_messages_site_idx ON public.chat_messages (site_id)`);
      await getPool().query(`CREATE INDEX IF NOT EXISTS chat_messages_nonce_idx ON public.chat_messages (room, client_nonce)`);
      tableEnsured = true;
    } catch (error) {
      initPromise = null;
      throw error;
    }
  })();
  return initPromise;
}

function normalizeMessageBody(message) {
  if (!message || typeof message !== 'object') return null;
  const body = String(message.body || message.content || '').trim();
  if (!body) return null;
  return body;
}

async function persistChatMessage({ room, siteId, message }) {
  const body = normalizeMessageBody(message);
  if (!body) return null;
  try {
    await ensureTable();
    const result = await getPool().query(
      `INSERT INTO public.chat_messages
        (room, site_id, message_id, user_id, username, nickname, body, avatar, role, client_nonce, raw)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       ON CONFLICT DO NOTHING
       RETURNING id`,
      [
        String(room || '').trim().toLowerCase(),
        siteId ? String(siteId).trim().toLowerCase() : null,
        String(message?.id || message?._id || '').trim() || null,
        String(message?.userId || message?.user_id || message?.senderId || '').trim() || null,
        String(message?.username || message?.sender?.username || '').trim() || null,
        String(message?.nickname || message?.sender?.name || message?.username || '').trim() || null,
        body,
        String(message?.avatar || message?.avatar_url || message?.sender?.avatar || '').trim() || null,
        String(message?.role || 'user').trim().toLowerCase(),
        String(message?.clientNonce || message?.client_nonce || '').trim() || null,
        JSON.stringify(message || {})
      ]
    );
    return result?.rows?.[0]?.id || null;
  } catch (error) {
    console.warn('Failed to persist chat message:', error?.message || error);
    return null;
  }
}

async function getRecentChatMessages({ room, limit = 50, beforeId = null } = {}) {
  if (!room) return [];
  try {
    await ensureTable();
    const params = [String(room).trim().toLowerCase(), Math.max(1, Math.min(500, Number(limit) || 50))];
    let where = 'room = $1';
    if (beforeId) {
      params.push(Number(beforeId));
      where += ` AND id < $${params.length}`;
    }
    params.push(params[1]);
    const result = await getPool().query(
      `SELECT id, room, site_id, message_id, user_id, username, nickname, body, avatar, role, client_nonce, raw, created_at
       FROM public.chat_messages
       WHERE ${where}
       ORDER BY id DESC
       LIMIT $${params.length}`,
      params
    );
    return result.rows || [];
  } catch (error) {
    console.warn('Failed to load chat messages:', error?.message || error);
    return [];
  }
}

async function findDbIdByMessageId({ room, messageId } = {}) {
  if (!room || !messageId) return null;
  try {
    await ensureTable();
    const result = await getPool().query(
      `SELECT id FROM public.chat_messages WHERE room = $1 AND message_id = $2 ORDER BY id DESC LIMIT 1`,
      [String(room).trim().toLowerCase(), String(messageId).trim()]
    );
    const row = result?.rows?.[0];
    return row?.id ? Number(row.id) : null;
  } catch (error) {
    console.warn('Failed to resolve db id by message_id:', error?.message || error);
    return null;
  }
}

module.exports = {
  persistChatMessage,
  getRecentChatMessages,
  findDbIdByMessageId,
  ensureTable
};
