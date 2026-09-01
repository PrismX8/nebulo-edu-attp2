const profileStore = require('../db/profileStore');
const effectStore = require('../db/effectStore');

let accessCheck = null;

async function ensureAccess() {
  if (!accessCheck) {
    accessCheck = Promise.all([
      profileStore.query('select 1 from public.chat_dms limit 0'),
      profileStore.query('select 1 from public.dm_messages limit 0')
    ]).catch((error) => {
      accessCheck = null;
      if (error?.code === '42501') {
        error.message = 'The database role needs access to chat_dms, dm_messages, and dm_messages_id_seq';
      }
      throw error;
    });
  }
  return accessCheck;
}

function normalizeParticipants(participants = []) {
  return [...new Set(
    (Array.isArray(participants) ? participants : [])
      .map((username) => String(username || '').trim().toLowerCase())
      .filter(Boolean)
  )];
}

async function resolveParticipantAccounts(participants) {
  const usernames = normalizeParticipants(participants);
  if (usernames.length !== 2) throw new Error('A direct message must have exactly two participants');
  const result = await profileStore.query(
    `select id, username
       from public.profiles
      where lower(username) = any($1::text[])`,
    [usernames]
  );
  if (result.rows.length !== 2) throw new Error('One or more DM participants do not have a database profile');
  return result.rows.sort((a, b) => String(a.id).localeCompare(String(b.id)));
}

async function resolveConversation(participants, createIfMissing = false) {
  await ensureAccess();
  const accounts = await resolveParticipantAccounts(participants);
  const ids = accounts.map((account) => String(account.id));

  const findConversation = () => profileStore.query(
    `select id
       from public.chat_dms
      where (user1_id = $1::uuid and user2_id = $2::uuid)
         or (user1_id = $2::uuid and user2_id = $1::uuid)
      order by created_at asc
      limit 1`,
    ids
  );
  let result = await findConversation();

  if (createIfMissing && !result.rows[0]) {
    await profileStore.query(
      `insert into public.chat_dms (user1_id, user2_id)
       values ($1::uuid, $2::uuid)
       on conflict (user1_id, user2_id) do nothing`,
      ids
    );
    result = await findConversation();
  }
  return {
    accounts,
    id: result.rows[0]?.id ? String(result.rows[0].id) : null
  };
}

function mapMessage(row = {}) {
  const createdAt = new Date(row.created_at).toISOString();
  const role = row.is_owner ? 'owner' : row.is_admin ? 'admin' : 'user';
  return {
    id: String(row.id),
    roomId: String(row.room_id || ''),
    userId: String(row.user_id),
    user_token: `db:${row.user_id}`,
    username: String(row.username || ''),
    nickname: String(row.username || 'Unknown'),
    body: String(row.content || ''),
    avatar: row.avatar_url || null,
    role,
    is_owner: !!row.is_owner,
    is_premium: !!row.is_premium,
    is_booster: !!row.is_booster,
    equippedEffect: row.equipped_effect || 'none',
    equippedAvatarEffect: row.equipped_avatar_effect || 'none',
    equippedTag: row.equipped_tag || 'none',
    date: createdAt,
    createdAt,
    timestamp: Math.floor(new Date(row.created_at).getTime() / 1000)
  };
}

const MESSAGE_SELECT = `
  select
    m.id,
    m.dm_id,
    m.user_id,
    m.content,
    m.created_at,
    p.username,
    p.avatar_url,
    p.is_owner,
    p.is_admin,
    p.is_premium,
    p.is_booster
  from public.dm_messages m
  join public.profiles p on p.id = m.user_id
`;

async function listMessages(room, limit = 100, participants = [], cursors = {}) {
  const conversation = await resolveConversation(participants, false);
  if (!conversation.id) return [];
  const safeLimit = Math.max(25, Math.min(150, Number(limit) || 100));
  const afterId = /^\d+$/.test(String(cursors.afterId || '')) ? String(cursors.afterId) : null;
  const beforeId = /^\d+$/.test(String(cursors.beforeId || '')) ? String(cursors.beforeId) : null;
  let result;
  if (afterId) {
    result = await profileStore.query(
      `${MESSAGE_SELECT}
       where m.dm_id = $1::uuid and m.id > $2::bigint
       order by m.created_at asc, m.id asc
       limit $3`,
      [conversation.id, afterId, safeLimit]
    );
  } else {
    result = await profileStore.query(
      `select * from (
         ${MESSAGE_SELECT}
         where m.dm_id = $1::uuid
           and ($2::bigint is null or m.id < $2::bigint)
         order by m.created_at desc, m.id desc
         limit $3
       ) recent
       order by recent.created_at asc, recent.id asc`,
      [conversation.id, beforeId, safeLimit]
    );
  }
  const messages = result.rows.map((row) => mapMessage({ ...row, room_id: room }));
  const userIds = messages.map((message) => message.userId);
  const [messageEffects, avatarEffects, tags] = await Promise.all([
    effectStore.getEquippedMessageEffects(userIds).catch(() => new Map()),
    effectStore.getEquippedAvatarEffects(userIds).catch(() => new Map()),
    effectStore.getEquippedTags(userIds).catch(() => new Map())
  ]);
  return messages.map((message) => ({
    ...message,
    equippedEffect: messageEffects.get(message.userId) || message.equippedEffect || 'none',
    equippedAvatarEffect: avatarEffects.get(message.userId) || message.equippedAvatarEffect || 'none',
    equippedTag: tags.get(message.userId) || message.equippedTag || 'none'
  }));
}

async function addMessage(room, message, participants = []) {
  const conversation = await resolveConversation(participants, true);
  const senderId = String(message?.userId || '').trim();
  if (!conversation.accounts.some((account) => String(account.id) === senderId)) {
    throw new Error('Message sender is not a participant in this direct message');
  }
  const result = await profileStore.query(
    `insert into public.dm_messages (dm_id, user_id, content, created_at)
     values ($1::uuid, $2::uuid, $3, now())
     returning id`,
    [conversation.id, senderId, String(message?.body || '').trim()]
  );
  const saved = await profileStore.query(
    `${MESSAGE_SELECT} where m.id = $1::bigint limit 1`,
    [result.rows[0].id]
  );
  const clientNonce = String(message?.clientNonce || message?.client_nonce || '').trim().slice(0, 120);
  return {
    ...mapMessage({ ...saved.rows[0], room_id: room }),
    equippedEffect: message?.equippedEffect || 'none',
    equippedAvatarEffect: message?.equippedAvatarEffect || 'none',
    equippedTag: message?.equippedTag || 'none',
    reply: message?.reply && typeof message.reply === 'object' ? message.reply : null,
    attachments: Array.isArray(message?.attachments) ? message.attachments : [],
    ...(clientNonce ? { clientNonce } : {})
  };
}

async function deleteMessage(room, messageId, caller = {}, participants = []) {
  const conversation = await resolveConversation(participants, false);
  if (!conversation.id) return { found: false, deleted: false };
  const targetResult = await profileStore.query(
    `select id, user_id
       from public.dm_messages
      where dm_id = $1::uuid and id = $2::bigint
      limit 1`,
    [conversation.id, String(messageId || '').trim()]
  );
  const target = targetResult.rows[0];
  if (!target) return { found: false, deleted: false };

  const role = String(caller?.role || '').toLowerCase();
  const callerId = String(caller?._id || caller?.id || '');
  const ownsMessage = callerId && callerId === String(target.user_id);
  if (!ownsMessage && !['owner', 'admin'].includes(role)) {
    return { found: true, deleted: false, forbidden: true };
  }

  await profileStore.query(
    'delete from public.dm_messages where dm_id = $1::uuid and id = $2::bigint',
    [conversation.id, String(messageId || '').trim()]
  );
  return { found: true, deleted: true, ownsMessage };
}

module.exports = {
  addMessage,
  deleteMessage,
  listMessages
};
