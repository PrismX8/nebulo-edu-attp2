const ACTIVE_TTL_MS = Number(process.env.PRESENCE_TTL_MS || 30000);
const byClient = new Map();
const PRESENCE_STATUSES = new Set(['online', 'idle', 'dnd', 'invisible']);

function normalizeStatus(value = '') {
  const status = String(value || '').trim().toLowerCase();
  return PRESENCE_STATUSES.has(status) ? status : 'online';
}

function touch(clientId, room, user = {}) {
  if (!clientId || !room) return;
  const clientKey = String(clientId);
  const previous = byClient.get(clientKey) || {};
  const username = String(user?.username || user?.name || user?.nickname || "").trim();
  const normalizedRoom = String(room).trim().toLowerCase();
  const hasStatus = user?.status !== undefined || user?.presenceStatus !== undefined;
  const hasCustomStatus = user?.customStatus !== undefined;
  byClient.set(clientKey, {
    room: normalizedRoom,
    username,
    userId: String(user?.userId || user?._id || user?.id || "").trim(),
    avatar: String(user?.avatar || user?.avatarUrl || "").trim(),
    role: String(user?.role || "").trim().toLowerCase(),
    is_owner: !!(user?.is_owner),
    is_premium: !!(user?.is_premium),
    is_booster: !!(user?.is_booster),
    coins: Math.max(0, Number(user?.coins || 0)),
    equippedEffect: String(user?.equippedEffect || 'none'),
    equippedAvatarEffect: String(user?.equippedAvatarEffect || 'none'),
    equippedTag: String(user?.equippedTag || 'none'),
    equippedBanner: String(user?.equippedBanner || 'none'),
    equippedProfileEffect: String(user?.equippedProfileEffect || 'none'),
    status: hasStatus ? normalizeStatus(user?.status || user?.presenceStatus) : normalizeStatus(previous.status),
    customStatus: hasCustomStatus
      ? String(user?.customStatus || '').trim().slice(0, 80)
      : String(previous.customStatus || '').trim().slice(0, 80),
    seenAt: Date.now()
  });
}

function cleanup() {
  const now = Date.now();
  for (const [clientId, info] of byClient.entries()) {
    if (!info?.seenAt || now - info.seenAt > ACTIVE_TTL_MS) {
      byClient.delete(clientId);
    }
  }
}

function remove(clientId) {
  if (!clientId) return false;
  return byClient.delete(String(clientId));
}

function getCounts() {
  cleanup();
  const roomKeys = {};
  const users = {};
  const onlineKeys = new Set();
  for (const [clientId, info] of byClient.entries()) {
    if (info.status === 'invisible') continue;
    const username = String(info.username || "").trim();
    const userKey = String(info.userId || '').trim()
      ? `id:${String(info.userId).trim().toLowerCase()}`
      : username
        ? `name:${username.toLowerCase()}`
        : `client:${clientId}`;
    onlineKeys.add(userKey);
    if (!roomKeys[info.room]) roomKeys[info.room] = new Set();
    roomKeys[info.room].add(userKey);
    if (!username) continue;
    if (!users[info.room]) users[info.room] = [];
    const existing = users[info.room].find((entry) => {
      const existingId = String(entry.userId || '').trim().toLowerCase();
      return existingId && info.userId
        ? existingId === String(info.userId).trim().toLowerCase()
        : String(entry.username || "").trim().toLowerCase() === username.toLowerCase();
    });
    if (!existing) {
      users[info.room].push({
        username,
        userId: info.userId || "",
        avatar: info.avatar || "",
        role: info.role || "",
        is_owner: !!(info.is_owner),
        is_premium: !!(info.is_premium),
        is_booster: !!(info.is_booster),
        coins: Math.max(0, Number(info.coins || 0)),
        equippedEffect: info.equippedEffect || 'none',
        equippedAvatarEffect: info.equippedAvatarEffect || 'none',
        equippedTag: info.equippedTag || 'none',
        equippedBanner: info.equippedBanner || 'none',
        equippedProfileEffect: info.equippedProfileEffect || 'none',
        status: info.status || 'online',
        customStatus: info.customStatus || '',
        seenAt: info.seenAt
      });
    } else if (Number(info.seenAt || 0) > Number(existing.seenAt || 0)) {
      existing.seenAt = info.seenAt;
      existing.avatar = info.avatar || existing.avatar || "";
      existing.userId = info.userId || existing.userId || "";
      existing.role = info.role || existing.role || "";
      existing.is_owner = !!(info.is_owner) || existing.is_owner;
      existing.is_premium = !!(info.is_premium) || existing.is_premium;
      existing.is_booster = !!(info.is_booster) || existing.is_booster;
      existing.coins = Math.max(0, Number(info.coins ?? existing.coins ?? 0));
      existing.equippedEffect = info.equippedEffect || existing.equippedEffect || 'none';
      existing.equippedAvatarEffect = info.equippedAvatarEffect || existing.equippedAvatarEffect || 'none';
      existing.equippedTag = info.equippedTag || existing.equippedTag || 'none';
      existing.equippedBanner = info.equippedBanner || existing.equippedBanner || 'none';
      existing.equippedProfileEffect = info.equippedProfileEffect || existing.equippedProfileEffect || 'none';
      existing.status = info.status || existing.status || 'online';
      existing.customStatus = info.customStatus || existing.customStatus || '';
    }
  }
  const rooms = Object.fromEntries(Object.entries(roomKeys).map(([room, keys]) => [room, keys.size]));
  return {
    ttlMs: ACTIVE_TTL_MS,
    totalOnline: onlineKeys.size,
    rooms,
    users
  };
}

function enrichUsers(resolveProfile) {
  const snapshot = getCounts();
  if (typeof resolveProfile !== 'function') return snapshot;
  for (const roomUsers of Object.values(snapshot.users || {})) {
    if (!Array.isArray(roomUsers)) continue;
    roomUsers.forEach((user) => {
      const profile = resolveProfile(user) || null;
      if (!profile) return;
      if (!user.userId) user.userId = String(profile.userId || profile._id || profile.id || '');
      if (!user.avatar) user.avatar = profile.avatar || profile.avatar_url || '';
      if (!user.role) user.role = profile.role || '';
      user.is_owner = !!(user.is_owner || profile.is_owner);
      user.is_premium = !!(user.is_premium || profile.is_premium);
      user.is_booster = !!(user.is_booster || profile.is_booster);
      user.equippedEffect = user.equippedEffect !== 'none' ? user.equippedEffect : (profile.equippedEffect || 'none');
      user.equippedAvatarEffect = user.equippedAvatarEffect !== 'none' ? user.equippedAvatarEffect : (profile.equippedAvatarEffect || 'none');
      user.equippedTag = user.equippedTag !== 'none' ? user.equippedTag : (profile.equippedTag || 'none');
    });
  }
  return snapshot;
}

module.exports = {
  PRESENCE_STATUSES: [...PRESENCE_STATUSES],
  touch,
  remove,
  getCounts,
  enrichUsers
};
