const profileStore = require('./profileStore');
const effectList = require('../chat/effects');

let accessCheck = null;
let storageMode = null;

async function ensureAccess() {
  if (storageMode) return storageMode;
  if (!accessCheck) {
    accessCheck = profileStore.query('select 1 from public.chat_user_profile_effects limit 0')
      .then(() => { storageMode = 'dedicated'; return storageMode; })
      .catch(async (error) => {
        accessCheck = null;
        if (!['42501', '42P01'].includes(error?.code)) throw error;
        await profileStore.query('select 1 from public.chat_user_banners limit 0');
        storageMode = 'banner-compat';
        return storageMode;
      });
  }
  return accessCheck;
}

const ownedKey = (effectId) => `profilefx-owned:${effectId}`;
const equippedKey = (effectId) => `profilefx-equipped:${effectId}`;

function validProfileEffectIds() {
  return new Set(effectList.listEffects().filter((item) => item.scope === 'profile').map((item) => item.id));
}

async function getUserProfileEffects(userId, queryable = profileStore) {
  const mode = await ensureAccess();
  const valid = validProfileEffectIds();
  if (mode === 'banner-compat') {
    const result = await queryable.query(
      `select banner_id from public.chat_user_banners
        where user_id = $1::uuid and banner_id like 'profilefx-%' order by purchased_at asc`,
      [String(userId || '').trim()]
    );
    const owned = result.rows.map((row) => String(row.banner_id || '')).filter((id) => id.startsWith('profilefx-owned:')).map((id) => id.slice(16)).filter((id) => valid.has(id));
    const selected = result.rows.map((row) => String(row.banner_id || '')).find((id) => id.startsWith('profilefx-equipped:'));
    const equipped = selected ? selected.slice(19) : 'none';
    return { ownedProfileEffects:['none', ...new Set(owned)], equippedProfileEffect:valid.has(equipped) ? equipped : 'none' };
  }
  const result = await queryable.query(
    `select effect_id, equipped from public.chat_user_profile_effects
      where user_id = $1::uuid order by purchased_at asc`,
    [String(userId || '').trim()]
  );
  const rows = result.rows.filter((row) => valid.has(String(row.effect_id)));
  const equipped = rows.find((row) => row.equipped);
  return {
    ownedProfileEffects: ['none', ...new Set(rows.map((row) => String(row.effect_id)))],
    equippedProfileEffect: equipped ? String(equipped.effect_id) : 'none'
  };
}

async function purchaseAndEquip(userId, effect) {
  const mode = await ensureAccess();
  const id = String(userId || '').trim();
  return profileStore.transaction(async (client) => {
    if (mode === 'banner-compat') {
      const owned = await client.query('select 1 from public.chat_user_banners where user_id = $1::uuid and banner_id = $2 limit 1', [id, ownedKey(effect.id)]);
      if (owned.rows[0]) { const error = new Error('Profile effect already owned'); error.code = 'PROFILE_EFFECT_ALREADY_OWNED'; throw error; }
      const charged = await client.query(
        `update public.profiles set coins = coins - $2, updated_at = now()
          where id = $1::uuid and coins >= $2 returning coins`,
        [id, Number(effect.price || 0)]
      );
      if (!charged.rows[0]) { const error = new Error('Not enough coins'); error.code = 'INSUFFICIENT_COINS'; throw error; }
      await client.query("delete from public.chat_user_banners where user_id = $1::uuid and banner_id like 'profilefx-equipped:%'", [id]);
      await client.query('insert into public.chat_user_banners (user_id, banner_id, equipped) values ($1::uuid, $2, false), ($1::uuid, $3, false)', [id, ownedKey(effect.id), equippedKey(effect.id)]);
      const state = await getUserProfileEffects(id, client);
      return { ...state, coins:Math.max(0, Number(charged.rows[0].coins || 0)) };
    }
    const owned = await client.query('select 1 from public.chat_user_profile_effects where user_id = $1::uuid and effect_id = $2 limit 1', [id, effect.id]);
    if (owned.rows[0]) { const error = new Error('Profile effect already owned'); error.code = 'PROFILE_EFFECT_ALREADY_OWNED'; throw error; }
    const charged = await client.query(
      `update public.profiles set coins = coins - $2, updated_at = now()
        where id = $1::uuid and coins >= $2 returning coins`,
      [id, Number(effect.price || 0)]
    );
    if (!charged.rows[0]) {
      const exists = await client.query('select 1 from public.profiles where id = $1::uuid', [id]);
      const error = new Error(exists.rows[0] ? 'Not enough coins' : 'Profile not found');
      error.code = exists.rows[0] ? 'INSUFFICIENT_COINS' : 'USER_NOT_FOUND';
      throw error;
    }
    await client.query('update public.chat_user_profile_effects set equipped = false where user_id = $1::uuid and equipped', [id]);
    await client.query('insert into public.chat_user_profile_effects (user_id, effect_id, equipped) values ($1::uuid, $2, true)', [id, effect.id]);
    const state = await getUserProfileEffects(id, client);
    return { ...state, coins:Math.max(0, Number(charged.rows[0].coins || 0)) };
  });
}

async function equip(userId, effectId) {
  const mode = await ensureAccess();
  const id = String(userId || '').trim();
  const selected = String(effectId || 'none').trim().toLowerCase();
  return profileStore.transaction(async (client) => {
    if (mode === 'banner-compat') {
      if (selected !== 'none') {
        const owned = await client.query('select 1 from public.chat_user_banners where user_id = $1::uuid and banner_id = $2 limit 1', [id, ownedKey(selected)]);
        if (!owned.rows[0]) { const error = new Error('Profile effect not owned'); error.code = 'PROFILE_EFFECT_NOT_OWNED'; throw error; }
      }
      await client.query("delete from public.chat_user_banners where user_id = $1::uuid and banner_id like 'profilefx-equipped:%'", [id]);
      if (selected !== 'none') await client.query('insert into public.chat_user_banners (user_id, banner_id, equipped) values ($1::uuid, $2, false)', [id, equippedKey(selected)]);
      return getUserProfileEffects(id, client);
    }
    if (selected !== 'none') {
      const owned = await client.query('select 1 from public.chat_user_profile_effects where user_id = $1::uuid and effect_id = $2 limit 1', [id, selected]);
      if (!owned.rows[0]) { const error = new Error('Profile effect not owned'); error.code = 'PROFILE_EFFECT_NOT_OWNED'; throw error; }
    }
    await client.query('update public.chat_user_profile_effects set equipped = false where user_id = $1::uuid and equipped', [id]);
    if (selected !== 'none') await client.query('update public.chat_user_profile_effects set equipped = true where user_id = $1::uuid and effect_id = $2', [id, selected]);
    return getUserProfileEffects(id, client);
  });
}

module.exports = { equip, getUserProfileEffects, purchaseAndEquip };
