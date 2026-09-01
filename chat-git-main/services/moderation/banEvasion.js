const crypto = require('crypto');
const fs = require('fs');
const net = require('net');
const path = require('path');
const profileStore = require('../db/profileStore');

const DEVICE_COOKIE = 'nebulo_device';
const DEVICE_MAX_AGE_SECONDS = 365 * 24 * 60 * 60;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const HASH_SECRET = String(
  process.env.ABUSE_HASH_SECRET ||
  process.env.JWT_SECRET ||
  'nebulo-local-abuse-hash-secret'
);

let accessCheck = null;
let nextDatabaseCheckAt = 0;
const FALLBACK_FILE = process.env.BAN_EVASION_FALLBACK_FILE
  ? path.resolve(process.env.BAN_EVASION_FALLBACK_FILE)
  : path.resolve(__dirname, '..', '..', 'data', 'ban-evasion.json');

function normalizeFallback(input = {}) {
  return {
    identifiers: Array.isArray(input.identifiers) ? input.identifiers : [],
    bans: Array.isArray(input.bans) ? input.bans : [],
    attempts: Array.isArray(input.attempts) ? input.attempts : []
  };
}

function readFallback() {
  try {
    return normalizeFallback(JSON.parse(fs.readFileSync(FALLBACK_FILE, 'utf8')));
  } catch {
    return normalizeFallback();
  }
}

function writeFallback(store) {
  fs.mkdirSync(path.dirname(FALLBACK_FILE), { recursive: true });
  const tempFile = `${FALLBACK_FILE}.${process.pid}.tmp`;
  fs.writeFileSync(tempFile, JSON.stringify(normalizeFallback(store), null, 2), 'utf8');
  fs.renameSync(tempFile, FALLBACK_FILE);
}

function cleanUuid(value) {
  const id = String(value || '').trim();
  return UUID_RE.test(id) ? id : null;
}

function digest(value) {
  const input = String(value || '').trim();
  if (!input) return null;
  return crypto.createHmac('sha256', HASH_SECRET).update(input).digest('hex');
}

function parseCookies(header = '') {
  return String(header || '').split(';').reduce((cookies, item) => {
    const separator = item.indexOf('=');
    if (separator < 1) return cookies;
    const name = item.slice(0, separator).trim();
    const value = item.slice(separator + 1).trim();
    if (name) {
      try {
        cookies[name] = decodeURIComponent(value);
      } catch {
        cookies[name] = value;
      }
    }
    return cookies;
  }, {});
}

function appendDeviceCookie(reply, token, secure) {
  if (!reply || typeof reply.header !== 'function') return;
  const cookie = [
    `${DEVICE_COOKIE}=${encodeURIComponent(token)}`,
    'Path=/',
    `Max-Age=${DEVICE_MAX_AGE_SECONDS}`,
    'HttpOnly',
    'SameSite=Lax',
    secure ? 'Secure' : ''
  ].filter(Boolean).join('; ');
  reply.header('Set-Cookie', cookie);
}

function getOrCreateDeviceToken(req, reply) {
  const cookies = parseCookies(req?.headers?.cookie);
  const existing = String(cookies[DEVICE_COOKIE] || '').trim();
  if (/^[A-Za-z0-9_-]{32,128}$/.test(existing)) return existing;
  const token = crypto.randomBytes(32).toString('base64url');
  const forwardedProto = String(req?.headers?.['x-forwarded-proto'] || '').split(',')[0].trim();
  const secure = forwardedProto === 'https' || req?.protocol === 'https';
  appendDeviceCookie(reply, token, secure);
  return token;
}

function normalizeIp(value) {
  let ip = String(value || '').trim();
  if (!ip) return '';
  if (ip.startsWith('::ffff:')) ip = ip.slice(7);
  if (net.isIP(ip)) return ip.toLowerCase();
  const bracketed = ip.match(/^\[([^\]]+)\](?::\d+)?$/);
  if (bracketed && net.isIP(bracketed[1])) return bracketed[1].toLowerCase();
  const ipv4WithPort = ip.match(/^(\d{1,3}(?:\.\d{1,3}){3}):\d+$/);
  if (ipv4WithPort && net.isIP(ipv4WithPort[1])) return ipv4WithPort[1];
  return '';
}

function getRequestIp(req) {
  const cloudflare = normalizeIp(req?.headers?.['cf-connecting-ip']);
  if (cloudflare) return cloudflare;
  const fastifyIp = normalizeIp(req?.ip);
  if (fastifyIp) return fastifyIp;
  const forwarded = String(req?.headers?.['x-forwarded-for'] || '').split(',')[0];
  return normalizeIp(forwarded) || normalizeIp(req?.socket?.remoteAddress) || 'unknown';
}

function getRequestSignals(req, reply, email = '') {
  const deviceToken = getOrCreateDeviceToken(req, reply);
  return {
    networkHash: digest(`network:${getRequestIp(req)}`),
    deviceHash: digest(`device:${deviceToken}`),
    emailHash: email ? digest(`email:${String(email).trim().toLowerCase()}`) : null
  };
}

async function ensureAccess() {
  if (!accessCheck && Date.now() < nextDatabaseCheckAt) return false;
  if (!accessCheck) {
    accessCheck = Promise.all([
      profileStore.query('select 1 from public.chat_account_identifiers limit 0'),
      profileStore.query('select 1 from public.chat_ban_identifiers limit 0'),
      profileStore.query('select 1 from public.chat_registration_attempts limit 0')
    ]).catch((error) => {
      accessCheck = null;
      const code = String(error?.code || '');
      if (
        ['42P01', '42501', '28P01', 'PROFILE_DB_NOT_CONFIGURED', 'ECONNREFUSED', 'ENOTFOUND', 'ETIMEDOUT'].includes(code) ||
        code.startsWith('08')
      ) {
        nextDatabaseCheckAt = Date.now() + 60_000;
        return false;
      }
      throw error;
    });
  }
  const result = await accessCheck;
  return result !== false;
}

function beginRegistrationFallback(signals) {
  const store = readFallback();
  const now = Date.now();
  store.attempts = store.attempts.filter((attempt) => now - Number(attempt.createdAt || 0) < 7 * 24 * 60 * 60 * 1000);
  const override = [...store.attempts].reverse().find((attempt) =>
    attempt.overrideApprovedAt &&
    !attempt.overrideUsedAt &&
    (attempt.networkHash === signals.networkHash || attempt.deviceHash === signals.deviceHash)
  );
  if (override) override.overrideUsedAt = now;
  const blocked = !override && store.bans.some((ban) =>
    ban.active !== false &&
    ((ban.type === 'network' && ban.hash === signals.networkHash) ||
      (ban.type === 'device' && ban.hash === signals.deviceHash))
  );
  const networkHour = store.attempts.filter((attempt) => attempt.networkHash === signals.networkHash && now - attempt.createdAt < 60 * 60 * 1000).length;
  const deviceHour = store.attempts.filter((attempt) => attempt.deviceHash === signals.deviceHash && now - attempt.createdAt < 60 * 60 * 1000).length;
  const networkDay = store.attempts.filter((attempt) => attempt.networkHash === signals.networkHash && now - attempt.createdAt < 24 * 60 * 60 * 1000).length;
  const rateLimited = !override && (deviceHour >= 4 || networkHour >= 8 || networkDay >= 20);
  const attempt = {
    id: crypto.randomUUID(),
    appealId: crypto.randomUUID(),
    networkHash: signals.networkHash,
    deviceHash: signals.deviceHash,
    emailHash: signals.emailHash,
    outcome: blocked ? 'blocked' : rateLimited ? 'rate_limited' : 'pending',
    reason: blocked ? 'Registration blocked by an active moderation identifier' : rateLimited ? 'Registration limit reached' : null,
    createdAt: now,
    overrideApprovedBy: override?.overrideApprovedBy || null,
    overrideApprovedAt: override ? now : null,
    overrideUsedAt: override ? now : null
  };
  store.attempts.push(attempt);
  writeFallback(store);
  return {
    allowed: !blocked && !rateLimited,
    attemptId: attempt.id,
    appealId: attempt.appealId,
    status: blocked ? 403 : rateLimited ? 429 : 200,
    reason: attempt.reason
  };
}

async function findApprovedOverride(client, signals) {
  const result = await client.query(
    `select id, override_approved_by
       from public.chat_registration_attempts
      where override_approved_at is not null
        and override_used_at is null
        and created_at > now() - interval '7 days'
        and (
          ($1::text is not null and network_hash = $1) or
          ($2::text is not null and device_hash = $2)
        )
      order by override_approved_at desc
      limit 1
      for update`,
    [signals.networkHash, signals.deviceHash]
  );
  return result.rows[0] || null;
}

async function beginRegistration(signals) {
  if (!await ensureAccess()) return beginRegistrationFallback(signals);
  const attemptId = crypto.randomUUID();
  const appealId = crypto.randomUUID();

  return profileStore.transaction(async (client) => {
    const override = await findApprovedOverride(client, signals);
    if (override?.id) {
      await client.query(
        'update public.chat_registration_attempts set override_used_at = now() where id = $1::uuid',
        [override.id]
      );
    }

    const blocked = override ? { rows: [] } : await client.query(
      `select identifier_type
         from public.chat_ban_identifiers
        where active
          and (
            (identifier_type = 'network' and identifier_hash = $1) or
            (identifier_type = 'device' and identifier_hash = $2)
          )
        limit 1`,
      [signals.networkHash, signals.deviceHash]
    );

    const volume = await client.query(
      `select
         count(*) filter (
           where network_hash = $1 and created_at > now() - interval '1 hour'
         )::integer as network_hour,
         count(*) filter (
           where device_hash = $2 and created_at > now() - interval '1 hour'
         )::integer as device_hour,
         count(*) filter (
           where network_hash = $1 and created_at > now() - interval '1 day'
         )::integer as network_day
       from public.chat_registration_attempts`,
      [signals.networkHash, signals.deviceHash]
    );
    const counts = volume.rows[0] || {};
    const rateLimited = !override && (
      Number(counts.device_hour || 0) >= 4 ||
      Number(counts.network_hour || 0) >= 8 ||
      Number(counts.network_day || 0) >= 20
    );
    const isBlocked = blocked.rows.length > 0;
    const outcome = isBlocked ? 'blocked' : rateLimited ? 'rate_limited' : 'pending';
    const reason = isBlocked
      ? 'Registration blocked by an active moderation identifier'
      : rateLimited
        ? 'Registration limit reached'
        : null;

    await client.query(
      `insert into public.chat_registration_attempts
         (id, appeal_id, network_hash, device_hash, email_hash, outcome, reason,
          override_approved_by, override_approved_at, override_used_at)
       values ($1::uuid, $2::uuid, $3, $4, $5, $6, $7, $8::uuid, $9, $10)`,
      [
        attemptId,
        appealId,
        signals.networkHash,
        signals.deviceHash,
        signals.emailHash,
        outcome,
        reason,
        override?.override_approved_by || null,
        override ? new Date() : null,
        override ? new Date() : null
      ]
    );

    return {
      allowed: !isBlocked && !rateLimited,
      attemptId,
      appealId,
      status: isBlocked ? 403 : rateLimited ? 429 : 200,
      reason
    };
  });
}

async function completeRegistration(attemptId, { outcome, userId = null, reason = null } = {}) {
  if (!await ensureAccess()) {
    const store = readFallback();
    const attempt = store.attempts.find((item) => item.id === String(attemptId || ''));
    if (attempt) {
      attempt.outcome = outcome === 'created' ? 'created' : 'rejected';
      attempt.userId = cleanUuid(userId);
      attempt.reason = reason || attempt.reason || null;
      attempt.completedAt = Date.now();
      writeFallback(store);
    }
    return;
  }
  const allowedOutcomes = new Set(['created', 'rejected']);
  const cleanOutcome = allowedOutcomes.has(outcome) ? outcome : 'rejected';
  await profileStore.query(
    `update public.chat_registration_attempts
        set outcome = $2,
            created_user_id = $3::uuid,
            reason = coalesce($4, reason),
            completed_at = now()
      where id = $1::uuid`,
    [cleanUuid(attemptId), cleanOutcome, cleanUuid(userId), reason ? String(reason).slice(0, 240) : null]
  );
}

async function observeAccount(userId, signals) {
  const id = cleanUuid(userId);
  if (!id) return { blocked: false, matchedTypes: [] };
  if (!await ensureAccess()) {
    const store = readFallback();
    const now = Date.now();
    for (const [type, hash] of [['network', signals.networkHash], ['device', signals.deviceHash]]) {
      if (!hash) continue;
      const existing = store.identifiers.find((item) => item.userId === id && item.type === type && item.hash === hash);
      if (existing) existing.lastSeenAt = now;
      else store.identifiers.push({ userId: id, type, hash, firstSeenAt: now, lastSeenAt: now });
    }
    const exempt = store.attempts.some((attempt) =>
      attempt.userId === id &&
      attempt.outcome === 'created' &&
      attempt.overrideUsedAt &&
      (attempt.networkHash === signals.networkHash || attempt.deviceHash === signals.deviceHash)
    );
    const matches = exempt ? [] : store.bans.filter((ban) =>
      ban.active !== false &&
      ((ban.type === 'network' && ban.hash === signals.networkHash) ||
        (ban.type === 'device' && ban.hash === signals.deviceHash))
    );
    writeFallback(store);
    return { blocked: matches.length > 0, matchedTypes: [...new Set(matches.map((ban) => ban.type))] };
  }
  const entries = [
    ['network', signals.networkHash],
    ['device', signals.deviceHash]
  ].filter(([, hash]) => hash);

  await profileStore.transaction(async (client) => {
    for (const [type, hash] of entries) {
      await client.query(
        `insert into public.chat_account_identifiers
           (user_id, identifier_type, identifier_hash)
         values ($1::uuid, $2, $3)
         on conflict (user_id, identifier_type, identifier_hash)
         do update set last_seen_at = now()`,
        [id, type, hash]
      );
    }
  });

  const result = await profileStore.query(
    `select distinct identifier_type
       from public.chat_ban_identifiers
      where active
        and (
          (identifier_type = 'network' and identifier_hash = $1) or
          (identifier_type = 'device' and identifier_hash = $2)
        )
        and not exists (
          select 1
            from public.chat_registration_attempts a
           where a.created_user_id = $3::uuid
             and a.outcome = 'created'
             and a.override_used_at is not null
             and (
               (a.network_hash is not null and a.network_hash = $1) or
               (a.device_hash is not null and a.device_hash = $2)
             )
        )`,
    [signals.networkHash, signals.deviceHash, id]
  );
  return {
    blocked: result.rows.length > 0,
    matchedTypes: result.rows.map((row) => String(row.identifier_type))
  };
}

async function banUserIdentifiers(userId, { reason = 'Global moderation ban', actorId = null } = {}) {
  const id = cleanUuid(userId);
  if (!id) return { added: 0 };
  if (!await ensureAccess()) {
    const store = readFallback();
    let added = 0;
    for (const identifier of store.identifiers.filter((item) => item.userId === id)) {
      if (store.bans.some((ban) => ban.active !== false && ban.type === identifier.type && ban.hash === identifier.hash)) continue;
      store.bans.push({
        id: crypto.randomUUID(),
        type: identifier.type,
        hash: identifier.hash,
        sourceUserId: id,
        reason: String(reason || 'Global moderation ban').slice(0, 500),
        actorId: cleanUuid(actorId),
        active: true,
        createdAt: Date.now()
      });
      added += 1;
    }
    writeFallback(store);
    return { added };
  }
  const result = await profileStore.query(
    `insert into public.chat_ban_identifiers
       (id, identifier_type, identifier_hash, source_user_id, reason, created_by)
     select gen_random_uuid(), identifier_type, identifier_hash, $1::uuid, $2, $3::uuid
       from public.chat_account_identifiers
      where user_id = $1::uuid
     on conflict (identifier_type, identifier_hash) where active
     do nothing
     returning id`,
    [id, String(reason || 'Global moderation ban').slice(0, 500), cleanUuid(actorId)]
  );
  return { added: result.rowCount };
}

async function clearUserIdentifierBans(userId, actorId = null) {
  const id = cleanUuid(userId);
  if (!id) return { cleared: 0 };
  if (!await ensureAccess()) {
    const store = readFallback();
    let cleared = 0;
    for (const ban of store.bans) {
      if (ban.sourceUserId !== id || ban.active === false) continue;
      ban.active = false;
      ban.clearedBy = cleanUuid(actorId);
      ban.clearedAt = Date.now();
      cleared += 1;
    }
    writeFallback(store);
    return { cleared };
  }
  const result = await profileStore.query(
    `update public.chat_ban_identifiers
        set active = false,
            cleared_by = $2::uuid,
            cleared_at = now()
      where source_user_id = $1::uuid and active
      returning id`,
    [id, cleanUuid(actorId)]
  );
  return { cleared: result.rowCount };
}

async function approveRegistrationAppeal(appealId, actorId) {
  if (!await ensureAccess()) {
    const store = readFallback();
    const attempt = store.attempts.find((item) =>
      item.appealId === String(appealId || '') &&
      ['blocked', 'rate_limited'].includes(item.outcome) &&
      Date.now() - Number(item.createdAt || 0) < 7 * 24 * 60 * 60 * 1000
    );
    if (!attempt || attempt.overrideUsedAt) return { approved: false };
    attempt.overrideApprovedBy = cleanUuid(actorId);
    attempt.overrideApprovedAt = Date.now();
    writeFallback(store);
    return { approved: true };
  }
  const result = await profileStore.query(
    `update public.chat_registration_attempts
        set override_approved_by = $2::uuid,
            override_approved_at = now()
      where appeal_id = $1::uuid
        and outcome in ('blocked', 'rate_limited')
        and created_at > now() - interval '7 days'
      returning appeal_id`,
    [cleanUuid(appealId), cleanUuid(actorId)]
  );
  return { approved: result.rowCount === 1 };
}

module.exports = {
  approveRegistrationAppeal,
  banUserIdentifiers,
  beginRegistration,
  clearUserIdentifierBans,
  completeRegistration,
  digest,
  getRequestSignals,
  observeAccount
};
