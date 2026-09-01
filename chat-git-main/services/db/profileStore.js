const { Pool } = require('pg');

let pool = null;

function readConfig() {
  const connectionString = String(process.env.PROFILE_DATABASE_URL || '').trim();
  if (connectionString) {
    return {
      connectionString,
      ssl: process.env.PROFILE_DB_SSL === 'true' ? { rejectUnauthorized: false } : false
    };
  }

  const host = String(process.env.PROFILE_DB_HOST || '').trim();
  const password = String(process.env.PROFILE_DB_PASSWORD || '');
  if (!host || !password) return null;

  return {
    host,
    port: Number(process.env.PROFILE_DB_PORT || 5432),
    user: String(process.env.PROFILE_DB_USER || 'postgres'),
    password,
    database: String(process.env.PROFILE_DB_NAME || 'app'),
    ssl: process.env.PROFILE_DB_SSL === 'true' ? { rejectUnauthorized: false } : false
  };
}

function getPool() {
  if (pool) return pool;
  const config = readConfig();
  if (!config) {
    const error = new Error('Profile database is not configured');
    error.code = 'PROFILE_DB_NOT_CONFIGURED';
    throw error;
  }

  pool = new Pool({
    ...config,
    max: 5,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 8_000,
    query_timeout: 10_000,
    application_name: 'nebulo-profile-settings'
  });
  pool.on('error', (error) => console.error('Profile database pool error:', error.message));
  return pool;
}

async function query(text, params = []) {
  return getPool().query(text, params);
}

async function transaction(callback) {
  const client = await getPool().connect();
  try {
    await client.query('begin');
    const result = await callback(client);
    await client.query('commit');
    return result;
  } catch (error) {
    await client.query('rollback').catch(() => {});
    throw error;
  } finally {
    client.release();
  }
}

const PROFILE_SELECT = `
  select
    u.id,
    u.email,
    u.password_hash,
    u.email_confirmed,
    u.user_metadata,
    p.username,
    p.bio,
    p.avatar_url,
    p.coins,
    p.is_premium,
    p.is_admin,
    p.is_booster,
    p.is_owner,
    p.updated_at
  from public.users u
  join public.profiles p on p.id = u.id
`;

function mapAccount(row = {}) {
  if (!row.id) return null;
  const username = String(row.username || row.email || '').trim();
  const metadata = row.user_metadata && typeof row.user_metadata === 'object' ? row.user_metadata : {};
  const displayName = String(metadata.display_name || username).trim() || username;
  return {
    _id: String(row.id),
    id: String(row.id),
    username,
    name: displayName,
    displayName,
    email: String(row.email || ''),
    avatar: row.avatar_url || null,
    avatar_url: row.avatar_url || null,
    coins: Math.max(0, Number(row.coins || 0)),
    bio: row.bio || null,
    role: row.is_owner ? 'owner' : row.is_admin ? 'admin' : 'user',
    is_owner: !!row.is_owner,
    is_admin: !!row.is_admin,
    is_premium: !!row.is_premium,
    is_booster: !!row.is_booster,
    email_confirmed: !!row.email_confirmed,
    updated_at: row.updated_at || null,
    source: 'database'
  };
}

async function findAccountByIdentifier(identifier) {
  const value = String(identifier || '').trim();
  if (!value) return null;
  const result = await getPool().query(
    `${PROFILE_SELECT}
     where lower(u.email) = lower($1) or lower(p.username) = lower($1)
     order by case when lower(u.email) = lower($1) then 0 else 1 end
     limit 1`,
    [value]
  );
  if (!result.rows[0]) return null;
  return {
    account: mapAccount(result.rows[0]),
    passwordHash: result.rows[0].password_hash
  };
}

async function findAccountById(userId) {
  const id = String(userId || '').trim();
  if (!id) return null;
  const result = await getPool().query(`${PROFILE_SELECT} where u.id = $1::uuid limit 1`, [id]);
  return mapAccount(result.rows[0]);
}

async function findAccountsByIds(userIds = []) {
  const ids = [...new Set((Array.isArray(userIds) ? userIds : [])
    .map((value) => String(value || '').trim())
    .filter((value) => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)))]
    .slice(0, 100);
  if (!ids.length) return [];
  const result = await getPool().query(`${PROFILE_SELECT} where u.id = any($1::uuid[])`, [ids]);
  return result.rows.map(mapAccount).filter(Boolean);
}

async function findCredentialsById(userId) {
  const id = String(userId || '').trim();
  if (!id) return null;
  const result = await getPool().query(
    'select id, password_hash from public.users where id = $1::uuid limit 1',
    [id]
  );
  return result.rows[0] || null;
}

async function listAccounts({ search = '', limit = 12, offset = 0, excludeId = '' } = {}) {
  const cleanSearch = String(search || '').trim();
  const cleanExcludeId = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(excludeId || '').trim())
    ? String(excludeId).trim()
    : null;
  const safeLimit = Math.max(1, Math.min(50, Number(limit) || 12));
  const safeOffset = Math.max(0, Number(offset) || 0);
  const params = [cleanSearch, cleanExcludeId, safeLimit, safeOffset];
  const where = `
    where ($1 = '' or p.username ilike '%' || $1 || '%')
      and ($2::uuid is null or p.id <> $2::uuid)`;
  const [rows, count] = await Promise.all([
    getPool().query(
      `${PROFILE_SELECT} ${where}
       order by lower(p.username), p.id
       limit $3 offset $4`,
      params
    ),
    getPool().query(
      `select count(*)::integer as total
       from public.profiles p
       ${where}`,
      [cleanSearch, cleanExcludeId]
    )
  ]);
  return {
    accounts: rows.rows.map(mapAccount).filter(Boolean),
    total: Number(count.rows[0]?.total || 0),
    limit: safeLimit,
    offset: safeOffset
  };
}

async function createAccount({ id, email, username, displayName, passwordHash }) {
  const client = await getPool().connect();
  try {
    await client.query('begin');
    await client.query(
      `insert into public.users (id, email, password_hash, email_confirmed, user_metadata)
       values ($1::uuid, $2, $3, true, jsonb_build_object('username', $4::text, 'display_name', $5::text))`,
      [id, email, passwordHash, username, displayName || username]
    );
    await client.query(
      `insert into public.profiles (id, username)
       values ($1::uuid, $2)`,
      [id, username]
    );
    await client.query('commit');
    return findAccountById(id);
  } catch (error) {
    await client.query('rollback').catch(() => {});
    if (error?.code === '23505') {
      const duplicate = new Error(
        String(error.constraint || '').includes('email') ? 'Email is already registered' : 'Username is already taken'
      );
      duplicate.code = 'ACCOUNT_EXISTS';
      throw duplicate;
    }
    throw error;
  } finally {
    client.release();
  }
}

async function updateAvatar(userId, avatarUrl) {
  const id = String(userId || '').trim();
  const result = await getPool().query(
    `update public.profiles
       set avatar_url = $1,
           updated_at = now()
     where id = $2::uuid
     returning id, username, bio, avatar_url, coins, is_premium, is_admin, is_booster, is_owner, updated_at`,
    [avatarUrl || null, id]
  );
  return mapAccount(result.rows[0]);
}

async function updateUsername(userId, username) {
  const id = String(userId || '').trim();
  const cleanUsername = String(username || '').trim();
  try {
    await transaction(async (client) => {
      const duplicate = await client.query(
        'select 1 from public.profiles where lower(username) = lower($1) and id <> $2::uuid limit 1',
        [cleanUsername, id]
      );
      if (duplicate.rows[0]) {
        const error = new Error('Username is already taken');
        error.code = 'USERNAME_EXISTS';
        throw error;
      }
      const result = await client.query(
        `update public.profiles
            set username = $2, updated_at = now()
          where id = $1::uuid
          returning id`,
        [id, cleanUsername]
      );
      if (!result.rows[0]) {
        const error = new Error('Profile not found');
        error.code = 'USER_NOT_FOUND';
        throw error;
      }
      await client.query(
        `update public.users
            set user_metadata = coalesce(user_metadata, '{}'::jsonb) || jsonb_build_object('username', $2::text)
          where id = $1::uuid`,
        [id, cleanUsername]
      );
    });
    return findAccountById(id);
  } catch (error) {
    if (error?.code === '23505') {
      const duplicate = new Error('Username is already taken');
      duplicate.code = 'USERNAME_EXISTS';
      throw duplicate;
    }
    throw error;
  }
}

async function updateDisplayName(userId, displayName) {
  const id = String(userId || '').trim();
  const cleanDisplayName = String(displayName || '').trim();
  const result = await getPool().query(
    `update public.users
        set user_metadata = coalesce(user_metadata, '{}'::jsonb) || jsonb_build_object('display_name', $2::text)
      where id = $1::uuid
      returning id`,
    [id, cleanDisplayName]
  );
  if (!result.rows[0]) {
    const error = new Error('Account not found');
    error.code = 'USER_NOT_FOUND';
    throw error;
  }
  return findAccountById(id);
}

async function updatePassword(userId, passwordHash) {
  const id = String(userId || '').trim();
  const hash = String(passwordHash || '');
  const result = await getPool().query(
    `update public.users
        set password_hash = $2
      where id = $1::uuid
      returning id`,
    [id, hash]
  );
  if (!result.rows[0]) {
    const error = new Error('Account not found');
    error.code = 'USER_NOT_FOUND';
    throw error;
  }
  return { id: String(result.rows[0].id) };
}

async function grantCoins(userId, amount = 1) {
  const id = String(userId || '').trim();
  const delta = Math.trunc(Number(amount));
  if (!id || !Number.isFinite(delta) || delta <= 0 || delta > 100) {
    const error = new Error('Invalid coin reward');
    error.code = 'INVALID_AMOUNT';
    throw error;
  }
  const result = await getPool().query(
    `update public.profiles
        set coins = coins + $2,
            updated_at = now()
      where id = $1::uuid
      returning id, coins`,
    [id, delta]
  );
  if (!result.rows[0]) {
    const error = new Error('Profile not found');
    error.code = 'USER_NOT_FOUND';
    throw error;
  }
  return { id: String(result.rows[0].id), coins: Math.max(0, Number(result.rows[0].coins || 0)) };
}

async function spendCoins(userId, amount = 0) {
  const id = String(userId || '').trim();
  const cost = Math.trunc(Number(amount));
  if (!id || !Number.isFinite(cost) || cost < 0 || cost > 1_000_000) {
    const error = new Error('Invalid coin cost');
    error.code = 'INVALID_AMOUNT';
    throw error;
  }
  const result = await getPool().query(
    `update public.profiles
        set coins = coins - $2,
            updated_at = now()
      where id = $1::uuid
        and coins >= $2
      returning id, coins`,
    [id, cost]
  );
  if (result.rows[0]) {
    return { id: String(result.rows[0].id), coins: Math.max(0, Number(result.rows[0].coins || 0)) };
  }
  const exists = await getPool().query('select coins from public.profiles where id = $1::uuid limit 1', [id]);
  const error = new Error(exists.rows[0] ? 'Not enough coins' : 'Profile not found');
  error.code = exists.rows[0] ? 'INSUFFICIENT_COINS' : 'USER_NOT_FOUND';
  throw error;
}

async function adminGrantCoins(userId, amount) {
  const id = String(userId || '').trim();
  const delta = Math.trunc(Number(amount));
  if (!id || !Number.isFinite(delta) || delta < 1 || delta > 1_000_000) {
    const error = new Error('Coin amount must be between 1 and 1,000,000');
    error.code = 'INVALID_AMOUNT';
    throw error;
  }
  const result = await getPool().query(
    `update public.profiles
        set coins = least(1000000000, coins + $2),
            updated_at = now()
      where id = $1::uuid
      returning id, coins`,
    [id, delta]
  );
  if (!result.rows[0]) {
    const error = new Error('Profile not found');
    error.code = 'USER_NOT_FOUND';
    throw error;
  }
  return findAccountById(id);
}

async function getAdminStats() {
  const result = await getPool().query(
    `select
       count(*)::integer as users,
       coalesce(sum(coins), 0)::bigint as total_coins,
       count(*) filter (where is_premium)::integer as premium_users,
       count(*) filter (where is_booster)::integer as boosters,
       count(*) filter (where is_admin or is_owner)::integer as staff
     from public.profiles`
  );
  const row = result.rows[0] || {};
  return {
    users: Number(row.users || 0),
    totalCoins: Number(row.total_coins || 0),
    premiumUsers: Number(row.premium_users || 0),
    boosters: Number(row.boosters || 0),
    staff: Number(row.staff || 0)
  };
}

module.exports = {
  query,
  transaction,
  findAccountByIdentifier,
  findAccountById,
  findAccountsByIds,
  findCredentialsById,
  listAccounts,
  createAccount,
  updateAvatar,
  updateUsername,
  updateDisplayName,
  updatePassword,
  grantCoins,
  spendCoins,
  adminGrantCoins,
  getAdminStats,
  mapAccount
};
