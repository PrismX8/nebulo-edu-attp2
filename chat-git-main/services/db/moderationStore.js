const profileStore = require('./profileStore');

let accessCheck = null;
const REPORT_STATUSES = new Set(['open', 'reviewing', 'resolved', 'dismissed']);

async function ensureAccess() {
  if (!accessCheck) {
    accessCheck = Promise.all([
      profileStore.query('select 1 from public.chat_reports limit 0'),
      profileStore.query('select 1 from public.chat_warnings limit 0')
    ]).catch((error) => {
      accessCheck = null;
      if (error?.code === '42501' || error?.code === '42P01') {
        error.message = 'The chat moderation database migration has not been applied';
      }
      throw error;
    });
  }
  return accessCheck;
}

function cleanUuid(value) {
  const id = String(value || '').trim();
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id) ? id : null;
}

function mapReport(row = {}) {
  return {
    id: String(row.id),
    room: String(row.room_id || ''),
    messageId: String(row.message_id || ''),
    reasonCategory: String(row.category || 'other'),
    reason: String(row.reason || ''),
    reporterId: String(row.reporter_id || ''),
    reporterUsername: String(row.reporter_username || 'Unknown'),
    targetUsername: String(row.resolved_target_username || row.target_username || 'Unknown'),
    targetUserId: row.target_user_id ? String(row.target_user_id) : '',
    targetToken: String(row.target_token || ''),
    quote: String(row.quote || ''),
    status: String(row.status || 'open'),
    createdAt: row.created_at,
    reviewedAt: row.reviewed_at || null,
    reviewedBy: row.reviewer_username || null,
    modNote: String(row.mod_note || '')
  };
}

const REPORT_SELECT = `
  select r.*,
         reporter.username as reporter_username,
         coalesce(target.username, r.target_username) as resolved_target_username,
         reviewer.username as reviewer_username
    from public.chat_reports r
    join public.profiles reporter on reporter.id = r.reporter_id
    left join public.profiles target on target.id = r.target_user_id
    left join public.profiles reviewer on reviewer.id = r.reviewer_id
`;

async function createReport(payload = {}) {
  await ensureAccess();
  const reporterId = cleanUuid(payload.reporterId);
  if (!reporterId || !payload.room || !payload.messageId || !String(payload.reason || '').trim()) {
    const error = new Error('Room, message, reporter, and reason are required');
    error.code = 'INVALID_REPORT';
    throw error;
  }
  const result = await profileStore.query(
    `insert into public.chat_reports
       (room_id, message_id, category, reason, reporter_id, target_user_id, target_username, target_token, quote)
     values ($1, $2, $3, $4, $5::uuid, $6::uuid, $7, $8, $9)
     returning id`,
    [
      String(payload.room).trim().toLowerCase(),
      String(payload.messageId).trim(),
      String(payload.reasonCategory || 'other').trim().toLowerCase().slice(0, 40),
      String(payload.reason).trim().slice(0, 700),
      reporterId,
      cleanUuid(payload.targetUserId),
      String(payload.targetUsername || 'Unknown').trim().slice(0, 80),
      String(payload.targetToken || '').trim().slice(0, 140),
      String(payload.quote || '').replace(/\s+/g, ' ').trim().slice(0, 500)
    ]
  );
  const saved = await profileStore.query(`${REPORT_SELECT} where r.id = $1::uuid limit 1`, [result.rows[0].id]);
  return mapReport(saved.rows[0]);
}

async function listReports({ room = '', status = 'all', limit = 100 } = {}) {
  await ensureAccess();
  const cleanStatus = String(status || 'all').toLowerCase();
  const result = await profileStore.query(
    `${REPORT_SELECT}
     where ($1 = '' or r.room_id = $1)
       and ($2 = 'all' or r.status = $2)
     order by case r.status when 'open' then 0 when 'reviewing' then 1 else 2 end,
              r.created_at desc
     limit $3`,
    [String(room || '').trim().toLowerCase(), REPORT_STATUSES.has(cleanStatus) ? cleanStatus : 'all', Math.max(1, Math.min(300, Number(limit) || 100))]
  );
  return result.rows.map(mapReport);
}

async function updateReportStatus(reportId, { status, modNote = '', reviewerId } = {}) {
  await ensureAccess();
  const cleanStatus = String(status || '').trim().toLowerCase();
  if (!REPORT_STATUSES.has(cleanStatus)) {
    const error = new Error('Invalid report status');
    error.code = 'INVALID_STATUS';
    throw error;
  }
  const result = await profileStore.query(
    `update public.chat_reports
        set status = $2,
            mod_note = $3,
            reviewer_id = $4::uuid,
            reviewed_at = now()
      where id = $1::uuid
      returning id`,
    [String(reportId || '').trim(), cleanStatus, String(modNote || '').trim().slice(0, 500), cleanUuid(reviewerId)]
  );
  if (!result.rows[0]) return null;
  const saved = await profileStore.query(`${REPORT_SELECT} where r.id = $1::uuid limit 1`, [result.rows[0].id]);
  return mapReport(saved.rows[0]);
}

function mapWarning(row = {}) {
  return {
    id: String(row.id),
    userId: String(row.user_id),
    username: String(row.username || 'Unknown'),
    avatar: row.avatar_url || null,
    moderatorId: String(row.moderator_id),
    moderatorUsername: String(row.moderator_username || 'Unknown'),
    reason: String(row.reason || ''),
    active: !!row.active,
    createdAt: row.created_at,
    clearedAt: row.cleared_at || null
  };
}

const WARNING_SELECT = `
  select w.*,
         target.username,
         target.avatar_url,
         moderator.username as moderator_username
    from public.chat_warnings w
    join public.profiles target on target.id = w.user_id
    join public.profiles moderator on moderator.id = w.moderator_id
`;

async function addWarning({ userId, moderatorId, reason }) {
  await ensureAccess();
  const targetId = cleanUuid(userId);
  const actorId = cleanUuid(moderatorId);
  if (!targetId || !actorId) throw new Error('Warnings require database-backed user accounts');
  const target = await profileStore.query(
    'select is_owner from public.profiles where id = $1::uuid limit 1',
    [targetId]
  );
  if (target.rows[0]?.is_owner) {
    const error = new Error('Owners are immune to warnings');
    error.code = 'OWNER_IMMUNE';
    throw error;
  }
  await profileStore.query(
    `insert into public.chat_warnings (user_id, moderator_id, reason)
     values ($1::uuid, $2::uuid, $3)`,
    [targetId, actorId, String(reason || 'Moderator warning').trim().slice(0, 500)]
  );
  const count = await profileStore.query(
    'select count(*)::integer as warnings from public.chat_warnings where user_id = $1::uuid and active',
    [targetId]
  );
  return { warnings: Number(count.rows[0]?.warnings || 0), userId: targetId };
}

async function getActiveWarningCount(userId) {
  await ensureAccess();
  const targetId = cleanUuid(userId);
  if (!targetId) return 0;
  const result = await profileStore.query(
    'select count(*)::integer as warnings from public.chat_warnings where user_id = $1::uuid and active',
    [targetId]
  );
  return Number(result.rows[0]?.warnings || 0);
}

async function clearWarnings({ userId, clearedBy }) {
  await ensureAccess();
  const result = await profileStore.query(
    `update public.chat_warnings
        set active = false, cleared_at = now(), cleared_by = $2::uuid
      where user_id = $1::uuid and active
      returning id`,
    [cleanUuid(userId), cleanUuid(clearedBy)]
  );
  return { cleared: result.rowCount };
}

async function listWarnings({ userId = '', active = 'true', limit = 100 } = {}) {
  await ensureAccess();
  const activeFilter = String(active).toLowerCase();
  const result = await profileStore.query(
    `${WARNING_SELECT}
     where ($1::uuid is null or w.user_id = $1::uuid)
       and ($2 = 'all' or w.active = ($2 = 'true'))
     order by w.created_at desc
     limit $3`,
    [cleanUuid(userId), ['true', 'false'].includes(activeFilter) ? activeFilter : 'all', Math.max(1, Math.min(300, Number(limit) || 100))]
  );
  return result.rows.map(mapWarning);
}

module.exports = {
  addWarning,
  clearWarnings,
  createReport,
  getActiveWarningCount,
  listReports,
  listWarnings,
  updateReportStatus
};
