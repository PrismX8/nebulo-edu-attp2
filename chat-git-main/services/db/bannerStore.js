const profileStore = require('./profileStore');
const effectList = require('../chat/effects');

let accessCheck = null;

async function ensureAccess() {
  if (!accessCheck) {
    accessCheck = profileStore.query('select 1 from public.chat_user_banners limit 0').catch((error) => {
      accessCheck = null;
      if (error?.code === '42501' || error?.code === '42P01') error.message = 'The member banners database migration has not been applied';
      throw error;
    });
  }
  return accessCheck;
}

function validBannerIds() {
  return new Set(effectList.listEffects().filter((item) => item.scope === 'banner').map((item) => item.id));
}

async function getUserBanners(userId, queryable = profileStore) {
  await ensureAccess();
  const valid = validBannerIds();
  const result = await queryable.query(
    `select banner_id, equipped from public.chat_user_banners
      where user_id = $1::uuid order by purchased_at asc`,
    [String(userId || '').trim()]
  );
  const rows = result.rows.filter((row) => valid.has(String(row.banner_id)));
  const equipped = rows.find((row) => row.equipped);
  return {
    ownedBanners: ['none', ...new Set(rows.map((row) => String(row.banner_id)))],
    equippedBanner: equipped ? String(equipped.banner_id) : 'none'
  };
}

async function purchaseAndEquip(userId, banner) {
  await ensureAccess();
  const id = String(userId || '').trim();
  return profileStore.transaction(async (client) => {
    const owned = await client.query('select 1 from public.chat_user_banners where user_id = $1::uuid and banner_id = $2 limit 1', [id, banner.id]);
    if (owned.rows[0]) { const error = new Error('Banner already owned'); error.code = 'BANNER_ALREADY_OWNED'; throw error; }
    const charged = await client.query(
      `update public.profiles set coins = coins - $2, updated_at = now()
        where id = $1::uuid and coins >= $2 returning coins`,
      [id, Number(banner.price || 0)]
    );
    if (!charged.rows[0]) {
      const exists = await client.query('select 1 from public.profiles where id = $1::uuid', [id]);
      const error = new Error(exists.rows[0] ? 'Not enough coins' : 'Profile not found');
      error.code = exists.rows[0] ? 'INSUFFICIENT_COINS' : 'USER_NOT_FOUND';
      throw error;
    }
    await client.query('update public.chat_user_banners set equipped = false where user_id = $1::uuid and equipped', [id]);
    await client.query('insert into public.chat_user_banners (user_id, banner_id, equipped) values ($1::uuid, $2, true)', [id, banner.id]);
    const state = await getUserBanners(id, client);
    return { ...state, coins:Math.max(0, Number(charged.rows[0].coins || 0)) };
  });
}

async function equip(userId, bannerId) {
  await ensureAccess();
  const id = String(userId || '').trim();
  const selected = String(bannerId || 'none').trim().toLowerCase();
  return profileStore.transaction(async (client) => {
    if (selected !== 'none') {
      const owned = await client.query('select 1 from public.chat_user_banners where user_id = $1::uuid and banner_id = $2 limit 1', [id, selected]);
      if (!owned.rows[0]) { const error = new Error('Banner not owned'); error.code = 'BANNER_NOT_OWNED'; throw error; }
    }
    await client.query('update public.chat_user_banners set equipped = false where user_id = $1::uuid and equipped', [id]);
    if (selected !== 'none') await client.query('update public.chat_user_banners set equipped = true where user_id = $1::uuid and banner_id = $2', [id, selected]);
    return getUserBanners(id, client);
  });
}

module.exports = { equip, getUserBanners, purchaseAndEquip };

