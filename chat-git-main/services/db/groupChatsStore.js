const { getPool } = require('./db/profileStore');

let tableEnsured = false;
let initPromise = null;

async function ensureTable() {
  if (tableEnsured) return;
  if (initPromise) return initPromise;
  initPromise = (async () => {
    try {
      await getPool().query(`
        CREATE TABLE IF NOT EXISTS public.chat_groups (
          room TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          creator TEXT,
          members JSONB NOT NULL DEFAULT '[]'::jsonb,
          single_member_since BIGINT,
          created_at BIGINT NOT NULL,
          updated_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::bigint
        )
      `);
      await getPool().query(`CREATE INDEX IF NOT EXISTS chat_groups_members_idx ON public.chat_groups USING GIN (members)`);
      tableEnsured = true;
    } catch (error) {
      initPromise = null;
      throw error;
    }
  })();
  return initPromise;
}

async function listGroups() {
  try {
    await ensureTable();
    const result = await getPool().query(
      `SELECT room, name, creator, members, single_member_since, created_at FROM public.chat_groups ORDER BY created_at DESC`
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
    await ensureTable();
    const now = Date.now();
    const result = await getPool().query(
      `INSERT INTO public.chat_groups (room, name, creator, members, single_member_since, created_at, updated_at)
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
    await ensureTable();
    await getPool().query(`DELETE FROM public.chat_groups WHERE room = $1`, [String(room).trim().toLowerCase()]);
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