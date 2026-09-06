const { getPool } = require('./profileStore');

let tableEnsured = false;
let initPromise = null;
let databaseDisabled = false;
let databaseWarningLogged = false;

const REQUIRED_COLUMNS = new Set([
  'room', 'name', 'creator', 'members', 'single_member_since', 'created_at', 'updated_at'
]);

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
  console.warn('Group chat database unavailable; using file storage:', error?.message || error);
};

async function getTableColumns(pool) {
  const result = await pool.query(
    `SELECT column_name
       FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'nebulo_chat_groups'`
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
        await pool.query(`CREATE TABLE IF NOT EXISTS public.nebulo_chat_groups (
          room TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          creator TEXT,
          members JSONB NOT NULL DEFAULT '[]'::jsonb,
          single_member_since BIGINT,
          created_at BIGINT NOT NULL,
          updated_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::bigint
        )`);
      } else {
        const additions = [
          ['members', `ALTER TABLE public.nebulo_chat_groups ADD COLUMN members JSONB NOT NULL DEFAULT '[]'::jsonb`],
          ['single_member_since', 'ALTER TABLE public.nebulo_chat_groups ADD COLUMN single_member_since BIGINT'],
          ['updated_at', 'ALTER TABLE public.nebulo_chat_groups ADD COLUMN updated_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::bigint']
        ];
        for (const [column, sql] of additions) {
          if (!columns.has(column)) await pool.query(sql);
        }
      }

      columns = await getTableColumns(pool);
      const missing = [...REQUIRED_COLUMNS].filter((column) => !columns.has(column));
      if (missing.length) throw new Error(`nebulo_chat_groups schema is missing: ${missing.join(', ')}`);

      // Indexes improve large installations but are not required for correctness.
      // A normal runtime role may have table access without owning the table.
      await pool.query(`CREATE INDEX IF NOT EXISTS nebulo_chat_groups_members_idx ON public.nebulo_chat_groups USING GIN (members)`)
        .catch((error) => {
          if (!isPermanentDatabaseError(error)) console.warn('Could not ensure nebulo_chat_groups index:', error?.message || error);
        });
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

async function listGroups() {
  try {
    if (!(await ensureTable())) return [];
    const result = await getPool().query(
      `SELECT room, name, creator, members, single_member_since, created_at FROM public.nebulo_chat_groups ORDER BY created_at DESC`
    );
    return (result.rows || []).map((row) => ({
      room: String(row.room || '').trim().toLowerCase(),
      name: String(row.name || `Group ${row.room}`).trim(),
      creator: String(row.creator || '').trim(),
      members: Array.isArray(row.members) ? row.members.map((m) => String(m || '').trim()).filter(Boolean) : [],
      singleMemberSince: row.single_member_since ? Number(row.single_member_since) : null,
      createdAt: Number(row.created_at) || Date.now()
    }));
  } catch (error) {
    console.warn('Failed to load group chats:', error?.message || error);
    return [];
  }
}

async function upsertGroup(group) {
  if (!group?.room) return null;
  try {
    if (!(await ensureTable())) return null;
    const now = Date.now();
    const result = await getPool().query(
      `INSERT INTO public.nebulo_chat_groups (room, name, creator, members, single_member_since, created_at, updated_at)
       VALUES ($1, $2, $3, $4::jsonb, $5, $6, $7)
       ON CONFLICT (room) DO UPDATE SET
         name = EXCLUDED.name,
         creator = EXCLUDED.creator,
         members = EXCLUDED.members,
         single_member_since = EXCLUDED.single_member_since,
         updated_at = EXCLUDED.updated_at
       RETURNING room`,
      [
        String(group.room).trim().toLowerCase(),
        String(group.name || `Group ${group.room}`).trim(),
        String(group.creator || '').trim(),
        JSON.stringify(Array.isArray(group.members) ? group.members : []),
        group.singleMemberSince || null,
        Number(group.createdAt) || now,
        now
      ]
    );
    return result?.rows?.[0]?.room || null;
  } catch (error) {
    console.warn('Failed to upsert group chat:', error?.message || error);
    return null;
  }
}

async function deleteGroupRow(room) {
  if (!room) return false;
  try {
    if (!(await ensureTable())) return false;
    await getPool().query(`DELETE FROM public.nebulo_chat_groups WHERE room = $1`, [String(room).trim().toLowerCase()]);
    return true;
  } catch (error) {
    console.warn('Failed to delete group chat:', error?.message || error);
    return false;
  }
}

module.exports = {
  ensureTable,
  listGroups,
  upsertGroup,
  deleteGroupRow
};
