const { getPool } = require('./profileStore');

let tableEnsured = false;
let initPromise = null;
let databaseDisabled = false;
let databaseWarningLogged = false;

const REQUIRED_COLUMNS = new Set([
  'id', 'room', 'site_id', 'message_id', 'user_id', 'username', 'nickname',
  'body', 'avatar', 'role', 'client_nonce', 'raw', 'created_at'
]);

const isMissingRelationError = (error) => {
  if (!error) return false;
  if (error.code === '42P01') return true;
  const message = String(error.message || '').toLowerCase();
  return message.includes('does not exist') || message.includes('relation');
};

const isPermanentDatabaseError = (error) => {
  const code = String(error?.code || '');
  const message = String(error?.message || '').toLowerCase();
  return code === '42501' || code === 'PROFILE_DB_NOT_CONFIGURED' ||
    message.includes('permission denied') || message.includes('must be owner');
};

const disableDatabase = (error) => {
  databaseDisabled = true;
  if (databaseWarningLogged) return;
  databaseWarningLogged = true;
  console.warn('Chat message database unavailable; using local history:', error?.message || error);
};

async function getTableColumns(pool) {
  const result = await pool.query(
    `SELECT column_name
       FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'nebulo_chat_messages'`
  );
  return new Set((result.rows || []).map((row) => String(row.column_name || '').toLowerCase()).filter(Boolean));
}

async function ensureTable() {
  if (tableEnsured) return true;
  if (databaseDisabled) return false;
  if (initPromise) return initPromise;
  initPromise = (async () => {
    try {
      const pool = getPool();
      let columns = await getTableColumns(pool);
      if (!columns.size) {
        await pool.query(`CREATE TABLE IF NOT EXISTS public.nebulo_chat_messages (
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
        )`);
      } else {
        const additions = [
          ['site_id', 'ALTER TABLE public.nebulo_chat_messages ADD COLUMN site_id TEXT'],
          ['message_id', 'ALTER TABLE public.nebulo_chat_messages ADD COLUMN message_id TEXT'],
          ['user_id', 'ALTER TABLE public.nebulo_chat_messages ADD COLUMN user_id TEXT'],
          ['username', 'ALTER TABLE public.nebulo_chat_messages ADD COLUMN username TEXT'],
          ['nickname', 'ALTER TABLE public.nebulo_chat_messages ADD COLUMN nickname TEXT'],
          ['avatar', 'ALTER TABLE public.nebulo_chat_messages ADD COLUMN avatar TEXT'],
          ['role', 'ALTER TABLE public.nebulo_chat_messages ADD COLUMN role TEXT'],
          ['client_nonce', 'ALTER TABLE public.nebulo_chat_messages ADD COLUMN client_nonce TEXT'],
          ['raw', 'ALTER TABLE public.nebulo_chat_messages ADD COLUMN raw JSONB'],
          ['created_at', 'ALTER TABLE public.nebulo_chat_messages ADD COLUMN created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()']
        ];
        for (const [column, sql] of additions) {
          if (!columns.has(column)) await pool.query(sql);
        }
      }

      columns = await getTableColumns(pool);
      const missing = [...REQUIRED_COLUMNS].filter((column) => !columns.has(column));
      if (missing.length) throw new Error(`nebulo_chat_messages schema is missing: ${missing.join(', ')}`);

      const indexStatements = [
        'CREATE INDEX IF NOT EXISTS nebulo_chat_messages_room_created_idx ON public.nebulo_chat_messages (room, created_at DESC)',
        'CREATE INDEX IF NOT EXISTS nebulo_chat_messages_site_idx ON public.nebulo_chat_messages (site_id)',
        'CREATE INDEX IF NOT EXISTS nebulo_chat_messages_nonce_idx ON public.nebulo_chat_messages (room, client_nonce)'
      ];
      for (const sql of indexStatements) {
        await pool.query(sql).catch((error) => {
          if (!isPermanentDatabaseError(error)) console.warn('Could not ensure nebulo_chat_messages index:', error?.message || error);
        });
      }
      tableEnsured = true;
      return true;
    } catch (error) {
      initPromise = null;
      if (isPermanentDatabaseError(error)) {
        disableDatabase(error);
        return false;
      }
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
  const insertSql = `INSERT INTO public.nebulo_chat_messages
        (room, site_id, message_id, user_id, username, nickname, body, avatar, role, client_nonce, raw)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       ON CONFLICT DO NOTHING
       RETURNING id`;
  const insertParams = [
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
  ];
  try {
    if (!(await ensureTable())) return null;
    const result = await getPool().query(insertSql, insertParams);
    return result?.rows?.[0]?.id || null;
  } catch (error) {
    if (isMissingRelationError(error)) {
      tableEnsured = false;
      initPromise = null;
      try {
        await ensureTable();
        const result = await getPool().query(insertSql, insertParams);
        return result?.rows?.[0]?.id || null;
      } catch (retryError) {
        console.warn('Failed to persist chat message after retry:', retryError?.message || retryError);
        return null;
      }
    }
    console.warn('Failed to persist chat message:', error?.message || error);
    return null;
  }
}

async function getRecentChatMessages({ room, limit = 50, beforeId = null } = {}) {
  if (!room) return [];
  const params = [String(room).trim().toLowerCase(), Math.max(1, Math.min(500, Number(limit) || 50))];
  let where = 'room = $1';
  if (beforeId) {
    params.push(Number(beforeId));
    where += ` AND id < $${params.length}`;
  }
  params.push(params[1]);
  const selectSql = `SELECT id, room, site_id, message_id, user_id, username, nickname, body, avatar, role, client_nonce, raw, created_at
       FROM public.nebulo_chat_messages
       WHERE ${where}
       ORDER BY id DESC
       LIMIT $${params.length}`;
  try {
    if (!(await ensureTable())) return [];
    const result = await getPool().query(selectSql, params);
    return result.rows || [];
  } catch (error) {
    if (isMissingRelationError(error)) {
      tableEnsured = false;
      initPromise = null;
      try {
        await ensureTable();
        const result = await getPool().query(selectSql, params);
        return result.rows || [];
      } catch (retryError) {
        console.warn('Failed to load chat messages after retry:', retryError?.message || retryError);
        return [];
      }
    }
    console.warn('Failed to load chat messages:', error?.message || error);
    return [];
  }
}

async function findDbIdByMessageId({ room, messageId } = {}) {
  if (!room || !messageId) return null;
  const sql = `SELECT id FROM public.nebulo_chat_messages WHERE room = $1 AND message_id = $2 ORDER BY id DESC LIMIT 1`;
  const params = [String(room).trim().toLowerCase(), String(messageId).trim()];
  try {
    if (!(await ensureTable())) return null;
    const result = await getPool().query(sql, params);
    const row = result?.rows?.[0];
    return row?.id ? Number(row.id) : null;
  } catch (error) {
    if (isMissingRelationError(error)) {
      tableEnsured = false;
      initPromise = null;
      try {
        await ensureTable();
        const result = await getPool().query(sql, params);
        const row = result?.rows?.[0];
        return row?.id ? Number(row.id) : null;
      } catch (retryError) {
        return null;
      }
    }
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
