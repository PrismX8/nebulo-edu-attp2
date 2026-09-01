const profileStore = require('./profileStore');

let accessCheck = null;
let unavailableUntil = 0;
let unavailableError = null;

function isUnavailableError(error) {
  return !!error?.notificationStoreUnavailable
    || error?.code === '42501'
    || error?.code === '42P01';
}

async function ensureAccess() {
  if (unavailableError && Date.now() < unavailableUntil) throw unavailableError;
  if (!accessCheck) {
    accessCheck = profileStore.query('select 1 from public.chat_notifications limit 0').catch((error) => {
      accessCheck = null;
      if (error?.code === '42501' || error?.code === '42P01') {
        error.message = 'The chat notifications database migration has not been applied';
        error.notificationStoreUnavailable = true;
        unavailableError = error;
        unavailableUntil = Date.now() + 5 * 60_000;
      }
      throw error;
    });
  }
  return accessCheck;
}

async function createForUsername(username, notification = {}) {
  await ensureAccess();
  const accountResult = await profileStore.query(
    'select id, username from public.profiles where lower(username) = lower($1) limit 1',
    [String(username || '').trim()]
  );
  const account = accountResult.rows[0];
  if (!account) throw new Error('Group creator does not have a database profile');
  const result = await profileStore.query(
    `insert into public.chat_notifications (user_id, type, message, metadata, dedupe_key)
     values ($1::uuid, $2, $3, $4::jsonb, $5)
     on conflict (dedupe_key) do nothing
     returning id`,
    [
      String(account.id),
      String(notification.type || 'info').trim().slice(0, 30),
      String(notification.message || '').trim().slice(0, 1000),
      JSON.stringify(notification.metadata || {}),
      String(notification.dedupeKey || '').trim().slice(0, 200) || null
    ]
  );
  return {
    created: !!result.rows[0],
    id: result.rows[0]?.id ? String(result.rows[0].id) : null,
    userId: String(account.id),
    username: String(account.username)
  };
}

async function listActive(userId, limit = 50) {
  await ensureAccess();
  const id = String(userId || '').trim();
  if (!id) return [];
  const result = await profileStore.query(
    `select id, type, message, metadata, created_at
       from public.chat_notifications
      where user_id = $1::uuid and read_at is null
      order by created_at asc
      limit $2`,
    [id, Math.max(1, Math.min(100, Number(limit) || 50))]
  );
  return result.rows.map((row) => ({
    id: String(row.id),
    type: String(row.type || 'info'),
    message: String(row.message || ''),
    metadata: row.metadata || {},
    at: new Date(row.created_at).getTime()
  }));
}

async function updateMetadata(userId, notificationId, patch = {}) {
  await ensureAccess();
  const id = String(userId || '').trim();
  const alertId = String(notificationId || '').trim();
  if (!id || !alertId || !patch || typeof patch !== 'object' || Array.isArray(patch)) return false;
  const result = await profileStore.query(
    `update public.chat_notifications
        set metadata = coalesce(metadata, '{}'::jsonb) || $3::jsonb
      where user_id = $1::uuid and id = $2::uuid and read_at is null
      returning id`,
    [id, alertId, JSON.stringify(patch)]
  );
  return !!result.rows[0];
}

async function clear(userId, notificationId) {
  await ensureAccess();
  const id = String(userId || '').trim();
  const alertId = String(notificationId || '').trim();
  if (!id || !alertId) return false;
  const result = await profileStore.query(
    `update public.chat_notifications
        set read_at = now()
      where user_id = $1::uuid and id = $2::uuid and read_at is null
      returning id`,
    [id, alertId]
  );
  return !!result.rows[0];
}

async function clearAll(userId) {
  await ensureAccess();
  const id = String(userId || '').trim();
  if (!id) return 0;
  const result = await profileStore.query(
    `update public.chat_notifications
        set read_at = now()
      where user_id = $1::uuid and read_at is null
      returning id`,
    [id]
  );
  return result.rows.length;
}

module.exports = {
  createForUsername,
  listActive,
  updateMetadata,
  clear,
  clearAll,
  isUnavailableError
};
