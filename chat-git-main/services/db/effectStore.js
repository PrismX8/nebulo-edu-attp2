const profileStore = require('./profileStore');
const effectList = require('../chat/effects');
const customTagStore = require('../chat/customTagStore');

let accessCheck = null;
let tagAccessCheck = null;
let avatarAccessCheck = null;

async function ensureAccess() {
  if (!accessCheck) {
    accessCheck = profileStore.query('select 1 from public.chat_user_effects limit 0').catch((error) => {
      accessCheck = null;
      if (error?.code === '42501' || error?.code === '42P01') {
        error.message = 'The message effects database migration has not been applied';
      }
      throw error;
    });
  }
  return accessCheck;
}

async function ensureTagAccess() {
  if (!tagAccessCheck) {
    tagAccessCheck = profileStore.query('select 1 from public.chat_user_tags limit 0').catch((error) => {
      tagAccessCheck = null;
      if (error?.code === '42501' || error?.code === '42P01') {
        error.message = 'The chat tags database migration has not been applied';
      }
      throw error;
    });
  }
  return tagAccessCheck;
}

async function ensureAvatarAccess() {
  if (!avatarAccessCheck) {
    avatarAccessCheck = profileStore.query('select 1 from public.chat_user_avatar_effects limit 0').catch((error) => {
      avatarAccessCheck = null;
      if (error?.code === '42501' || error?.code === '42P01') {
        error.message = 'The avatar effects database migration has not been applied';
      }
      throw error;
    });
  }
  return avatarAccessCheck;
}

function catalogIds(scope) {
  const items = effectList.listEffects().filter((item) => item.scope === scope);
  if (scope === 'tag') return new Set(customTagStore.listCatalogTags(items).map((item) => item.id));
  return new Set(items.map((item) => item.id));
}

async function getUserTags(userId, queryable = profileStore) {
  await ensureTagAccess();
  const validTags = catalogIds('tag');
  const result = await queryable.query(
    `select tag_id, equipped
       from public.chat_user_tags
      where user_id = $1::uuid
      order by purchased_at asc`,
    [String(userId || '').trim()]
  );
  const rows = result.rows.filter((row) => validTags.has(String(row.tag_id)));
  const equipped = rows.find((row) => row.equipped);
  return {
    ownedTags: ['none', ...new Set(rows.map((row) => String(row.tag_id)))],
    equippedTag: equipped ? String(equipped.tag_id) : 'none'
  };
}

async function getUserEffects(userId, queryable = profileStore) {
  await ensureAccess();
  const validEffects = catalogIds('message');
  const result = await queryable.query(
    `select effect_id, equipped
       from public.chat_user_effects
      where user_id = $1::uuid
      order by purchased_at asc`,
    [String(userId || '').trim()]
  );
  const rows = result.rows.filter((row) => validEffects.has(String(row.effect_id)));
  const ownedEffects = ['none', ...rows.map((row) => String(row.effect_id))];
  const equipped = rows.find((row) => row.equipped);
  const avatarEffects = await getUserAvatarEffects(userId, queryable).catch((error) => {
    if (error?.code === '42501' || error?.code === '42P01') return { ownedAvatarEffects: ['none'], equippedAvatarEffect: 'none' };
    throw error;
  });
  const tags = await getUserTags(userId, queryable).catch((error) => {
    if (error?.code === '42501' || error?.code === '42P01') return { ownedTags: ['none'], equippedTag: 'none' };
    throw error;
  });
  return {
    ownedEffects: [...new Set(ownedEffects)],
    equippedEffect: equipped ? String(equipped.effect_id) : 'none',
    ...avatarEffects,
    ...tags
  };
}

async function getUserAvatarEffects(userId, queryable = profileStore) {
  await ensureAvatarAccess();
  const validAvatarEffects = catalogIds('avatar');
  const result = await queryable.query(
    `select effect_id, equipped
       from public.chat_user_avatar_effects
      where user_id = $1::uuid
      order by purchased_at asc`,
    [String(userId || '').trim()]
  );
  const rows = result.rows.filter((row) => validAvatarEffects.has(String(row.effect_id)));
  const equipped = rows.find((row) => row.equipped);
  return {
    ownedAvatarEffects: ['none', ...new Set(rows.map((row) => String(row.effect_id)))],
    equippedAvatarEffect: equipped ? String(equipped.effect_id) : 'none'
  };
}

async function purchaseAndEquip(userId, effect) {
  await ensureAccess();
  const id = String(userId || '').trim();
  return profileStore.transaction(async (client) => {
    const owned = await client.query(
      'select 1 from public.chat_user_effects where user_id = $1::uuid and effect_id = $2 limit 1',
      [id, effect.id]
    );
    if (owned.rows[0]) {
      const error = new Error('Effect already owned');
      error.code = 'EFFECT_ALREADY_OWNED';
      throw error;
    }
    const charged = await client.query(
      `update public.profiles
          set coins = coins - $2, updated_at = now()
        where id = $1::uuid and coins >= $2
        returning coins`,
      [id, Number(effect.price || 0)]
    );
    if (!charged.rows[0]) {
      const exists = await client.query('select 1 from public.profiles where id = $1::uuid', [id]);
      const error = new Error(exists.rows[0] ? 'Not enough coins' : 'Profile not found');
      error.code = exists.rows[0] ? 'INSUFFICIENT_COINS' : 'USER_NOT_FOUND';
      throw error;
    }
    await client.query(
      'update public.chat_user_effects set equipped = false where user_id = $1::uuid and equipped',
      [id]
    );
    await client.query(
      `insert into public.chat_user_effects (user_id, effect_id, equipped)
       values ($1::uuid, $2, true)`,
      [id, effect.id]
    );
    const state = await getUserEffects(id, client);
    return { ...state, coins: Math.max(0, Number(charged.rows[0].coins || 0)) };
  });
}

async function equip(userId, effectId) {
  await ensureAccess();
  const id = String(userId || '').trim();
  const selected = String(effectId || 'none').trim().toLowerCase();
  return profileStore.transaction(async (client) => {
    if (selected !== 'none') {
      const owned = await client.query(
        'select 1 from public.chat_user_effects where user_id = $1::uuid and effect_id = $2 limit 1',
        [id, selected]
      );
      if (!owned.rows[0]) {
        const error = new Error('Effect not owned');
        error.code = 'EFFECT_NOT_OWNED';
        throw error;
      }
    }
    await client.query(
      'update public.chat_user_effects set equipped = false where user_id = $1::uuid and equipped',
      [id]
    );
    if (selected !== 'none') {
      await client.query(
        'update public.chat_user_effects set equipped = true where user_id = $1::uuid and effect_id = $2',
        [id, selected]
      );
    }
    return getUserEffects(id, client);
  });
}

async function purchaseAndEquipAvatar(userId, effect) {
  await ensureAvatarAccess();
  const id = String(userId || '').trim();
  return profileStore.transaction(async (client) => {
    const owned = await client.query(
      'select 1 from public.chat_user_avatar_effects where user_id = $1::uuid and effect_id = $2 limit 1',
      [id, effect.id]
    );
    if (owned.rows[0]) {
      const error = new Error('Avatar effect already owned');
      error.code = 'AVATAR_EFFECT_ALREADY_OWNED';
      throw error;
    }
    const charged = await client.query(
      `update public.profiles
          set coins = coins - $2, updated_at = now()
        where id = $1::uuid and coins >= $2
        returning coins`,
      [id, Number(effect.price || 0)]
    );
    if (!charged.rows[0]) {
      const exists = await client.query('select 1 from public.profiles where id = $1::uuid', [id]);
      const error = new Error(exists.rows[0] ? 'Not enough coins' : 'Profile not found');
      error.code = exists.rows[0] ? 'INSUFFICIENT_COINS' : 'USER_NOT_FOUND';
      throw error;
    }
    await client.query(
      'update public.chat_user_avatar_effects set equipped = false where user_id = $1::uuid and equipped',
      [id]
    );
    await client.query(
      `insert into public.chat_user_avatar_effects (user_id, effect_id, equipped)
       values ($1::uuid, $2, true)`,
      [id, effect.id]
    );
    const state = await getUserEffects(id, client);
    return { ...state, coins: Math.max(0, Number(charged.rows[0].coins || 0)) };
  });
}

async function equipAvatar(userId, effectId) {
  await ensureAvatarAccess();
  const id = String(userId || '').trim();
  const selected = String(effectId || 'none').trim().toLowerCase();
  return profileStore.transaction(async (client) => {
    if (selected !== 'none') {
      const owned = await client.query(
        'select 1 from public.chat_user_avatar_effects where user_id = $1::uuid and effect_id = $2 limit 1',
        [id, selected]
      );
      if (!owned.rows[0]) {
        const error = new Error('Avatar effect not owned');
        error.code = 'AVATAR_EFFECT_NOT_OWNED';
        throw error;
      }
    }
    await client.query(
      'update public.chat_user_avatar_effects set equipped = false where user_id = $1::uuid and equipped',
      [id]
    );
    if (selected !== 'none') {
      await client.query(
        'update public.chat_user_avatar_effects set equipped = true where user_id = $1::uuid and effect_id = $2',
        [id, selected]
      );
    }
    return getUserEffects(id, client);
  });
}

async function saveOwnedAvatarEffect(userId, effectId, equipped = false) {
  await ensureAvatarAccess();
  const id = String(userId || '').trim();
  const selected = String(effectId || 'none').trim().toLowerCase();
  return profileStore.transaction(async (client) => {
    if (selected !== 'none') {
      const effect = effectList.getEffect(selected);
      if (!effect || effect.scope !== 'avatar') {
        const error = new Error('Avatar effect not found');
        error.code = 'EFFECT_NOT_FOUND';
        throw error;
      }
      await client.query(
        `insert into public.chat_user_avatar_effects (user_id, effect_id, equipped)
         values ($1::uuid, $2, false)
         on conflict (user_id, effect_id) do nothing`,
        [id, selected]
      );
    }
    if (equipped) {
      await client.query(
        'update public.chat_user_avatar_effects set equipped = false where user_id = $1::uuid and equipped',
        [id]
      );
      if (selected !== 'none') {
        await client.query(
          'update public.chat_user_avatar_effects set equipped = true where user_id = $1::uuid and effect_id = $2',
          [id, selected]
        );
      }
    }
    return getUserEffects(id, client);
  });
}

async function purchaseAndEquipTag(userId, tag) {
  await ensureTagAccess();
  const id = String(userId || '').trim();
  return profileStore.transaction(async (client) => {
    const owned = await client.query(
      'select 1 from public.chat_user_tags where user_id = $1::uuid and tag_id = $2 limit 1',
      [id, tag.id]
    );
    if (owned.rows[0]) {
      const error = new Error('Tag already owned');
      error.code = 'TAG_ALREADY_OWNED';
      throw error;
    }
    const charged = await client.query(
      `update public.profiles
          set coins = coins - $2, updated_at = now()
        where id = $1::uuid and coins >= $2
        returning coins`,
      [id, Number(tag.price || 0)]
    );
    if (!charged.rows[0]) {
      const exists = await client.query('select 1 from public.profiles where id = $1::uuid', [id]);
      const error = new Error(exists.rows[0] ? 'Not enough coins' : 'Profile not found');
      error.code = exists.rows[0] ? 'INSUFFICIENT_COINS' : 'USER_NOT_FOUND';
      throw error;
    }
    await client.query('update public.chat_user_tags set equipped = false where user_id = $1::uuid and equipped', [id]);
    await client.query(
      `insert into public.chat_user_tags (user_id, tag_id, equipped)
       values ($1::uuid, $2, true)`,
      [id, tag.id]
    );
    const state = await getUserTags(id, client);
    return { ...state, coins: Math.max(0, Number(charged.rows[0].coins || 0)) };
  });
}

async function equipTag(userId, tagId) {
  await ensureTagAccess();
  const id = String(userId || '').trim();
  const selected = String(tagId || 'none').trim().toLowerCase();
  return profileStore.transaction(async (client) => {
    if (selected !== 'none') {
      const owned = await client.query(
        'select 1 from public.chat_user_tags where user_id = $1::uuid and tag_id = $2 limit 1',
        [id, selected]
      );
      if (!owned.rows[0]) {
        const error = new Error('Tag not owned');
        error.code = 'TAG_NOT_OWNED';
        throw error;
      }
    }
    await client.query('update public.chat_user_tags set equipped = false where user_id = $1::uuid and equipped', [id]);
    if (selected !== 'none') {
      await client.query(
        'update public.chat_user_tags set equipped = true where user_id = $1::uuid and tag_id = $2',
        [id, selected]
      );
    }
    return getUserTags(id, client);
  });
}

async function getEquippedTags(userIds = []) {
  const ids = [...new Set(userIds.map((id) => String(id || '').trim()).filter(Boolean))];
  if (!ids.length) return new Map();
  await ensureTagAccess();
  const validTags = catalogIds('tag');
  const result = await profileStore.query(
    `select user_id, tag_id
       from public.chat_user_tags
      where user_id = any($1::uuid[]) and equipped`,
    [ids]
  );
  return new Map(result.rows
    .filter((row) => validTags.has(String(row.tag_id)))
    .map((row) => [String(row.user_id), String(row.tag_id)]));
}

async function getEquippedMessageEffects(userIds = []) {
  const ids = [...new Set(userIds.map((id) => String(id || '').trim()).filter(Boolean))];
  if (!ids.length) return new Map();
  await ensureAccess();
  const validEffects = catalogIds('message');
  const result = await profileStore.query(
    `select user_id, effect_id
       from public.chat_user_effects
      where user_id = any($1::uuid[]) and equipped`,
    [ids]
  );
  return new Map(result.rows
    .filter((row) => validEffects.has(String(row.effect_id)))
    .map((row) => [String(row.user_id), String(row.effect_id)]));
}

async function getEquippedAvatarEffects(userIds = []) {
  const ids = [...new Set(userIds.map((id) => String(id || '').trim()).filter(Boolean))];
  if (!ids.length) return new Map();
  await ensureAvatarAccess();
  const validAvatarEffects = catalogIds('avatar');
  const result = await profileStore.query(
    `select user_id, effect_id
       from public.chat_user_avatar_effects
      where user_id = any($1::uuid[]) and equipped`,
    [ids]
  );
  return new Map(result.rows
    .filter((row) => validAvatarEffects.has(String(row.effect_id)))
    .map((row) => [String(row.user_id), String(row.effect_id)]));
}

module.exports = {
  equip,
  equipAvatar,
  equipTag,
  getEquippedAvatarEffects,
  getEquippedMessageEffects,
  getEquippedTags,
  getUserAvatarEffects,
  getUserEffects,
  getUserTags,
  purchaseAndEquip,
  purchaseAndEquipAvatar,
  purchaseAndEquipTag,
  saveOwnedAvatarEffect
};
