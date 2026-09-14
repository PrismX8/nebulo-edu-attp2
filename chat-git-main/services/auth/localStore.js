const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const effects = require("../chat/effects");

const DATA_DIR = process.env.CHAT_LOCAL_DATA_DIR || path.resolve(__dirname, "..", "..", "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const RESERVED_USERNAMES = new Set(["moderation"]);
const cache = {
  mtimeMs: -1,
  store: { users: [], migrations: {} },
  byId: new Map(),
  byUsername: new Map(),
  byEmail: new Map()
};

function ensureStore() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(USERS_FILE)) {
    try { fs.writeFileSync(USERS_FILE, JSON.stringify({ users: [] }, null, 2), { encoding: 'utf8', flag: 'wx', mode: 0o600 }); }
    catch (error) { if (error.code !== 'EEXIST') throw error; }
  }
}

function normalizeStore(input = {}) {
  return {
    users: Array.isArray(input.users) ? input.users.map((user) => normalizeUser(user)) : [],
    migrations: input.migrations && typeof input.migrations === "object" && !Array.isArray(input.migrations)
      ? { ...input.migrations }
      : {}
  };
}

function normalizeSystemNotifications(value) {
  return (Array.isArray(value) ? value : []).map((notification) => ({
    id: String(notification?.id || crypto.randomUUID()),
    type: String(notification?.type || "info").slice(0, 30),
    message: String(notification?.message || "").slice(0, 1000),
    metadata: notification?.metadata && typeof notification.metadata === "object" && !Array.isArray(notification.metadata)
      ? { ...notification.metadata }
      : {},
    at: Number(notification?.at || Date.now())
  })).filter((notification) => notification.message).slice(-100);
}

function sanitizeCoins(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 0;
  return Math.max(0, Math.round(parsed * 100) / 100);
}

function normalizeCoinDelta(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 0;
  return Math.round(parsed * 100) / 100;
}

function normalizeOwnedEffects(value) {
  const rawList = Array.isArray(value) ? value : [];
  const owned = new Set(["none"]);
  rawList.forEach((entry) => {
    const effectId = String(entry || "").trim().toLowerCase();
    if (effects.isValidEffect(effectId)) owned.add(effectId);
  });
  return [...owned];
}

function normalizeFriends(value) {
  const rawList = Array.isArray(value) ? value : [];
  const friends = new Set();
  rawList.forEach((entry) => {
    const friendUsername = String(entry || "").trim().toLowerCase();
    if (friendUsername) friends.add(friendUsername);
  });
  return [...friends];
}

function normalizeFriendRequests(value) {
  const rawList = Array.isArray(value) ? value : [];
  const requests = new Set();
  rawList.forEach((entry) => {
    const username = String(entry || "").trim().toLowerCase();
    if (username) requests.add(username);
  });
  return [...requests];
}

function normalizeEquippedEffect(effectId, ownedEffects) {
  const cleanId = String(effectId || "").trim().toLowerCase();
  const effect = effects.getEffect(cleanId);
  if (ownedEffects.includes(cleanId) && effect?.scope === "message") {
    return cleanId;
  }
  return "none";
}

function normalizeEquippedAvatarEffect(effectId, ownedEffects) {
  const cleanId = String(effectId || "").trim().toLowerCase();
  const effect = effects.getEffect(cleanId);
  if (ownedEffects.includes(cleanId) && effect?.scope === "avatar") {
    return cleanId;
  }
  return "none";
}

function ownedEffectsByScope(ownedEffects, scope) {
  return normalizeOwnedEffects(ownedEffects).filter((effectId) => {
    if (effectId === "none") return true;
    return effects.getEffect(effectId)?.scope === scope;
  });
}

function isBcryptHash(value) {
  return typeof value === "string" && /^\$(2[aby])\$/.test(value);
}

function normalizePasswordHash(value) {
  const raw = String(value || "");
  if (!raw || isBcryptHash(raw)) return raw;
  return bcrypt.hashSync(raw, 10);
}

function normalizeUser(user = {}) {
  const ownedEffects = normalizeOwnedEffects(user.ownedEffects);
  // Keep avatar when this store is the active auth source. Remote/database
  // profile data still wins when it is available.
  const password = normalizePasswordHash(user.password);
  return {
    _id: String(user._id || ''),
    ...(user.source === 'database' ? { source: 'database' } : {}),
    username: String(user.username || '').trim(),
    ...(password ? { password } : {}),
    role: String(user.role || 'user'),
    avatar: typeof user.avatar === "string" ? user.avatar : null,
    coins: sanitizeCoins(user.coins),
    ...(user.community && typeof user.community === 'object' ? { community: user.community } : {}),
    systemNotifications: normalizeSystemNotifications(user.systemNotifications),
    ownedEffects,
    equippedEffect: normalizeEquippedEffect(user.equippedEffect, ownedEffects),
    equippedAvatarEffect: normalizeEquippedAvatarEffect(user.equippedAvatarEffect, ownedEffects),
    ...normalizeShopCosmetics(user),
    friends: normalizeFriends(user.friends),
    friendRequestsSent: normalizeFriendRequests(user.friendRequestsSent),
    friendRequestsReceived: normalizeFriendRequests(user.friendRequestsReceived),
  };
}

function normalizeShopCosmetics(user) {
  const result = {};
  for (const [owned, equipped] of [['ownedBanners','equippedBanner'], ['ownedProfileEffects','equippedProfileEffect'], ['ownedTags','equippedTag']]) {
    result[owned] = [...new Set(['none', ...(Array.isArray(user[owned]) ? user[owned] : []).filter(id => typeof id === 'string' && /^[a-z0-9_-]{1,100}$/.test(id))])];
    result[equipped] = result[owned].includes(user[equipped]) ? user[equipped] : 'none';
  }
  return result;
}

function rebuildIndexes(store) {
  cache.byId = new Map();
  cache.byUsername = new Map();
  cache.byEmail = new Map();

  for (const user of store.users) {
    const id = String(user?._id || "").trim();
    const username = String(user?.username || "").trim().toLowerCase();
    if (id) cache.byId.set(id, user);
    if (username) cache.byUsername.set(username, user);
  }
}

async function verifyPassword(user = {}, password = "") {
  if (!user || typeof user.password !== "string") return false;
  const stored = String(user.password);
  const candidate = String(password || "");

  if (isBcryptHash(stored)) {
    return bcrypt.compare(candidate, stored);
  }

  const matches = candidate === stored;
  if (matches && user._id) {
    try {
      const hashed = await bcrypt.hash(candidate, 10);
      module.exports.updatePassword(user._id, hashed);
    } catch (_err) {
      // preserve legacy password if hashing fails
    }
  }

  return matches;
}

function updateCache(store, mtimeMs = cache.mtimeMs) {
  cache.store = normalizeStore(store);
  cache.mtimeMs = Number.isFinite(mtimeMs) ? mtimeMs : cache.mtimeMs;
  rebuildIndexes(cache.store);
  return cache.store;
}

function readStore(force = false) {
  ensureStore();
  // Never replace an unreadable store with an empty one or persist a read-time
  // normalization. A failed read must prevent the following write.
  const stats = fs.statSync(USERS_FILE);
  if (force || cache.mtimeMs !== stats.mtimeMs) {
    const parsed = JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
    if (!Array.isArray(parsed.users)) throw new Error("Invalid users.json format");
    updateCache(parsed, stats.mtimeMs);
  }
  // Mutations cannot change the committed cache until the disk write succeeds.
  return JSON.parse(JSON.stringify(cache.store));
}

function writeStore(store) {
  ensureStore();
  const nextStore = normalizeStore(store);
  const previous = cache.store;
  const temp = `${USERS_FILE}.${crypto.randomUUID()}.tmp`;
  let fd;
  try {
    fd = fs.openSync(temp, 'wx', 0o600);
    fs.writeFileSync(fd, JSON.stringify(nextStore, null, 2), 'utf8');
    fs.fsyncSync(fd);
    fs.closeSync(fd); fd = undefined;
    // Windows can briefly reject an otherwise valid atomic replacement while
    // virus scanners or another reader still hold the destination handle. The
    // cross-process writer lock already protects against stale writes, so retry
    // only these transient filesystem errors and keep the durable temp file
    // intact until the replacement succeeds.
    for (let attempt = 0; ; attempt += 1) {
      try {
        fs.renameSync(temp, USERS_FILE);
        break;
      } catch (error) {
        const transient = ['EPERM', 'EBUSY', 'EACCES'].includes(error?.code);
        if (!transient || attempt >= 7) throw error;
        Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, Math.min(5 * (attempt + 1), 35));
      }
    }
  } catch (error) {
    if (fd !== undefined) { try { fs.closeSync(fd); } catch {} }
    try { fs.unlinkSync(temp); } catch {}
    throw error;
  }
  updateCache(nextStore, fs.statSync(USERS_FILE).mtimeMs);
  const oldCoins = new Map(previous.users.map(u => [u._id, u.coins]));
  for (const user of nextStore.users) {
    if (oldCoins.get(user._id) !== user.coins) require('../chat/walletEvents').changed(user._id);
  }
}

function listUsers() {
  return readStore().users.map((u) => ({
    ...u,
    role: applyConfiguredRole(u)
  }));
}

function findByUsername(username = "") {
  const target = String(username).trim().toLowerCase();
  if (!target) return null;
  readStore();
  const user = cache.byUsername.get(target);
  return user ? { ...user, role: applyConfiguredRole(user) } : null;
}

function findByIdentifier(identifier = "") {
  const target = String(identifier).trim().toLowerCase();
  if (!target) return null;
  readStore();
  const user = cache.byUsername.get(target) || cache.byEmail.get(target) || null;
  return user ? { ...user, role: applyConfiguredRole(user) } : null;
}

function findById(id = "") {
  const target = String(id).trim();
  if (!target) return null;
  readStore();
  const user = cache.byId.get(target);
  return user ? { ...user, role: applyConfiguredRole(user) } : null;
}

function addFriend(userId, targetUsername = "") {
  const normalizedTarget = String(targetUsername || "").trim().toLowerCase();
  if (!normalizedTarget) return null;
  const store = readStore();
  const idx = store.users.findIndex((u) => String(u._id) === String(userId));
  if (idx < 0) return null;
  const current = normalizeUser(store.users[idx]);
  if (current.username.toLowerCase() === normalizedTarget) {
    const error = new Error("Cannot add yourself");
    error.code = "CANNOT_ADD_SELF";
    throw error;
  }
  const targetUser = store.users.find((u) => String(u.username || "").toLowerCase() === normalizedTarget);
  if (!targetUser) {
    const error = new Error("User not found");
    error.code = "USER_NOT_FOUND";
    throw error;
  }
  const friends = new Set(normalizeFriends(current.friends));
  friends.add(normalizedTarget);
  store.users[idx] = normalizeUser({ ...current, friends: [...friends] });
  writeStore(store);
  return store.users[idx];
}

function updateUser(userId, updateFn) {
  const store = readStore();
  const idx = store.users.findIndex((u) => String(u._id) === String(userId));
  if (idx < 0) return null;
  const current = normalizeUser(store.users[idx]);
  const next = normalizeUser(updateFn(current));
  store.users[idx] = next;
  writeStore(store);
  return next;
}

function addFriendRequest(userId, targetUsername = "") {
  const normalizedTarget = String(targetUsername || "").trim().toLowerCase();
  if (!normalizedTarget) return null;
  const sender = findById(userId);
  if (!sender) {
    const error = new Error("User not found");
    error.code = "USER_NOT_FOUND";
    throw error;
  }
  const target = findByUsername(normalizedTarget);
  if (!target) {
    const error = new Error("User not found");
    error.code = "USER_NOT_FOUND";
    throw error;
  }
  const senderUsername = String(sender.username || "").trim().toLowerCase();
  if (senderUsername === normalizedTarget) {
    const error = new Error("Cannot add yourself");
    error.code = "CANNOT_ADD_SELF";
    throw error;
  }
  if (sender.friendRequestsSent.includes(normalizedTarget)) {
    return sender;
  }
  if (sender.friendRequestsReceived.includes(normalizedTarget)) {
    return acceptFriendRequest(userId, normalizedTarget);
  }
  if (sender.friends.includes(normalizedTarget) && target.friends.includes(senderUsername)) {
    const error = new Error("Already friends");
    error.code = "ALREADY_FRIENDS";
    throw error;
  }
  updateUser(userId, (current) => ({
    ...current,
    friendRequestsSent: [...new Set([...(current.friendRequestsSent || []), normalizedTarget])]
  }));
  updateUser(target._id, (current) => ({
    ...current,
    friendRequestsReceived: [...new Set([...(current.friendRequestsReceived || []), senderUsername])]
  }));
  return findById(userId);
}

function acceptFriendRequest(userId, requesterUsername = "") {
  const normalizedRequester = String(requesterUsername || "").trim().toLowerCase();
  if (!normalizedRequester) return null;
  const recipient = findById(userId);
  if (!recipient) {
    const error = new Error("User not found");
    error.code = "USER_NOT_FOUND";
    throw error;
  }
  const requester = findByUsername(normalizedRequester);
  if (!requester) {
    const error = new Error("User not found");
    error.code = "USER_NOT_FOUND";
    throw error;
  }
  const recipientUsername = String(recipient.username || "").trim().toLowerCase();
  if (!recipient.friendRequestsReceived.includes(normalizedRequester)) {
    const error = new Error("Friend request not found");
    error.code = "NO_REQUEST";
    throw error;
  }
  updateUser(userId, (current) => ({
    ...current,
    friends: [...new Set([...(current.friends || []), normalizedRequester])],
    friendRequestsReceived: (current.friendRequestsReceived || []).filter((u) => u !== normalizedRequester),
    friendRequestsSent: (current.friendRequestsSent || []).filter((u) => u !== normalizedRequester)
  }));
  updateUser(requester._id, (current) => ({
    ...current,
    friends: [...new Set([...(current.friends || []), recipientUsername])],
    friendRequestsSent: (current.friendRequestsSent || []).filter((u) => u !== recipientUsername),
    friendRequestsReceived: (current.friendRequestsReceived || []).filter((u) => u !== recipientUsername)
  }));
  return findById(userId);
}

function denyFriendRequest(userId, requesterUsername = "") {
  const normalizedRequester = String(requesterUsername || "").trim().toLowerCase();
  if (!normalizedRequester) return null;
  const recipient = findById(userId);
  if (!recipient) {
    const error = new Error("User not found");
    error.code = "USER_NOT_FOUND";
    throw error;
  }
  const requester = findByUsername(normalizedRequester);
  if (!requester) {
    const error = new Error("User not found");
    error.code = "USER_NOT_FOUND";
    throw error;
  }
  const recipientUsername = String(recipient.username || "").trim().toLowerCase();
  if (!recipient.friendRequestsReceived.includes(normalizedRequester)) {
    const error = new Error("Friend request not found");
    error.code = "NO_REQUEST";
    throw error;
  }
  updateUser(userId, (current) => ({
    ...current,
    friendRequestsReceived: (current.friendRequestsReceived || []).filter((u) => u !== normalizedRequester)
  }));
  updateUser(requester._id, (current) => ({
    ...current,
    friendRequestsSent: (current.friendRequestsSent || []).filter((u) => u !== recipientUsername)
  }));
  return findById(userId);
}

function removeFriendRelationship(userId, targetUsername = "") {
  const normalizedTarget = String(targetUsername || "").trim().toLowerCase();
  if (!normalizedTarget) return null;
  const user = findById(userId);
  if (!user) {
    const error = new Error("User not found");
    error.code = "USER_NOT_FOUND";
    throw error;
  }
  const target = findByUsername(normalizedTarget);
  if (!target) {
    const error = new Error("User not found");
    error.code = "USER_NOT_FOUND";
    throw error;
  }
  const userUsername = String(user.username || "").trim().toLowerCase();
  updateUser(userId, (current) => ({
    ...current,
    friends: (current.friends || []).filter((u) => u !== normalizedTarget),
    friendRequestsSent: (current.friendRequestsSent || []).filter((u) => u !== normalizedTarget),
    friendRequestsReceived: (current.friendRequestsReceived || []).filter((u) => u !== normalizedTarget)
  }));
  updateUser(target._id, (current) => ({
    ...current,
    friends: (current.friends || []).filter((u) => u !== userUsername),
    friendRequestsSent: (current.friendRequestsSent || []).filter((u) => u !== userUsername),
    friendRequestsReceived: (current.friendRequestsReceived || []).filter((u) => u !== userUsername)
  }));
  return findById(userId);
}

function getFriendRequests(userId) {
  const user = findById(userId);
  if (!user) return { incoming: [], outgoing: [] };
  return {
    incoming: Array.isArray(user.friendRequestsReceived) ? user.friendRequestsReceived : [],
    outgoing: Array.isArray(user.friendRequestsSent) ? user.friendRequestsSent : []
  };
}

function getMutualFriends(userId) {
  const caller = findById(userId);
  if (!caller) return [];
  const callerUsername = String(caller.username || "").trim().toLowerCase();
  if (!callerUsername) return [];
  const friends = Array.isArray(caller.friends) ? caller.friends : [];
  return listUsers().filter((user) => {
    const targetUsername = String(user.username || "").trim().toLowerCase();
    if (!targetUsername || targetUsername === callerUsername) return false;
    const targetFriends = Array.isArray(user.friends) ? user.friends : [];
    return friends.includes(targetUsername) && targetFriends.includes(callerUsername);
  });
}

function searchUsersByUsername(query = "", excludeUserId = "") {
  const normalizedQuery = String(query || "").trim().toLowerCase();
  const excludeId = String(excludeUserId || "").trim();
  return listUsers().filter((user) => {
    if (String(user._id || "") === excludeId) return false;
    if (!normalizedQuery) return true;
    return String(user.username || "").toLowerCase().includes(normalizedQuery);
  });
}

function parseEmailSet(input = "") {
  return new Set(
    String(input || "")
      .split(",")
      .map((v) => v.trim().toLowerCase())
      .filter(Boolean)
  );
}

function applyConfiguredRole(user = {}) {
  const ownerUsernames = parseEmailSet(process.env.OWNER_USERNAMES || "");
  const adminUsernames = parseEmailSet(process.env.ADMIN_USERNAMES || "");
  const lowerUsername = String(user.username || "").trim().toLowerCase();
  const currentRole = String(user.role || "user").toLowerCase();

  if (ownerUsernames.has(lowerUsername)) return "owner";
  if (adminUsernames.has(lowerUsername)) return "admin";
  return currentRole;
}

function resolveRole(username = "", existingUsers = []) {
  const lowerUsername = String(username).trim().toLowerCase();
  const ownerUsernames = parseEmailSet(process.env.OWNER_USERNAMES || "");
  const adminUsernames = parseEmailSet(process.env.ADMIN_USERNAMES || "");

  if (ownerUsernames.has(lowerUsername)) return "owner";
  if (adminUsernames.has(lowerUsername)) return "admin";
  if (existingUsers.length === 0) return "owner";
  return "user";
}

function createUser({ username, name, passwordHash }) {
  const store = readStore();
  const rawUsername = String(username || "").trim();
  const canonicalUsername = rawUsername.toLowerCase();
  if (RESERVED_USERNAMES.has(canonicalUsername)) {
    const error = new Error("Username is reserved");
    error.code = "USERNAME_RESERVED";
    throw error;
  }
  const role = resolveRole(canonicalUsername, store.users);
  const exists = store.users.some((u) => String(u.username || "").toLowerCase() === canonicalUsername);
  if (exists) {
    const error = new Error("Username already exists");
    error.code = "USERNAME_EXISTS";
    throw error;
  }
  const user = normalizeUser({
    _id: crypto.randomUUID(),
    username: rawUsername,
    password: passwordHash,
    role,
  });
  store.users.push(user);
  writeStore(store);
  return user;
}

function updatePassword(userId, passwordHash) {
  const store = readStore();
  const idx = store.users.findIndex((u) => String(u._id) === String(userId));
  if (idx < 0) return null;
  store.users[idx] = {
    ...store.users[idx],
    password: passwordHash
  };
  writeStore(store);
  return store.users[idx];
}

function deleteUser(userId) {
  const targetId = String(userId || "").trim();
  if (!targetId) return null;
  const store = readStore();
  const idx = store.users.findIndex((u) => String(u._id) === targetId);
  if (idx < 0) return null;

  const deleted = normalizeUser(store.users[idx]);
  const deletedUsername = String(deleted.username || "").trim().toLowerCase();
  store.users.splice(idx, 1);

  if (deletedUsername) {
    store.users = store.users.map((user) => normalizeUser({
      ...user,
      friends: (user.friends || []).filter((entry) => String(entry || "").trim().toLowerCase() !== deletedUsername),
      friendRequestsSent: (user.friendRequestsSent || []).filter((entry) => String(entry || "").trim().toLowerCase() !== deletedUsername),
      friendRequestsReceived: (user.friendRequestsReceived || []).filter((entry) => String(entry || "").trim().toLowerCase() !== deletedUsername)
    }));
  }

  writeStore(store);
  return deleted;
}

function updateProfile(userId, updates = {}) {
  const store = readStore();
  const idx = store.users.findIndex((u) => String(u._id) === String(userId));
  if (idx < 0) return null;

  const next = { ...store.users[idx] };
  if (Object.prototype.hasOwnProperty.call(updates, "avatar")
    && (updates.avatar === null || typeof updates.avatar === "string")) {
    next.avatar = updates.avatar || null;
  }
  if (updates.coins !== undefined) {
    next.coins = sanitizeCoins(updates.coins);
  }
  if (typeof updates.equippedEffect === "string") {
    next.equippedEffect = normalizeEquippedEffect(updates.equippedEffect, normalizeOwnedEffects(next.ownedEffects));
  }
  if (typeof updates.equippedAvatarEffect === "string") {
    next.equippedAvatarEffect = normalizeEquippedAvatarEffect(updates.equippedAvatarEffect, normalizeOwnedEffects(next.ownedEffects));
  }

  store.users[idx] = normalizeUser(next);
  writeStore(store);
  return store.users[idx];
}

function grantCoins(userId, amount = 0) {
  const delta = normalizeCoinDelta(amount);
  if (!Number.isFinite(delta) || delta <= 0) return findById(userId);
  const store = readStore();
  const idx = store.users.findIndex((u) => String(u._id) === String(userId));
  if (idx < 0) return null;
  const currentCoins = sanitizeCoins(store.users[idx]?.coins);
  if (currentCoins + delta > 1000000000) {
    const error = new Error("Wallet limit reached"); error.code = "WALLET_LIMIT"; throw error;
  }
  store.users[idx] = normalizeUser({
    ...store.users[idx],
    coins: currentCoins + delta
  });
  writeStore(store);
  return store.users[idx];
}

function transferCoins(fromUserId, toUserId, amount = 0) {
  const senderId = String(fromUserId || "").trim();
  const recipientId = String(toUserId || "").trim();
  const delta = normalizeCoinDelta(amount);

  if (!senderId || !recipientId) {
    const error = new Error("User not found");
    error.code = "USER_NOT_FOUND";
    throw error;
  }
  if (senderId === recipientId) {
    const error = new Error("Cannot transfer coins to yourself");
    error.code = "SAME_USER";
    throw error;
  }
  if (!Number.isFinite(delta) || delta <= 0) {
    const error = new Error("Invalid amount");
    error.code = "INVALID_AMOUNT";
    throw error;
  }

  const store = readStore();
  const fromIdx = store.users.findIndex((u) => String(u._id) === senderId);
  const toIdx = store.users.findIndex((u) => String(u._id) === recipientId);
  if (fromIdx < 0 || toIdx < 0) {
    const error = new Error("User not found");
    error.code = "USER_NOT_FOUND";
    throw error;
  }

  const sender = normalizeUser(store.users[fromIdx]);
  const recipient = normalizeUser(store.users[toIdx]);
  if (sender.coins < delta) {
    const error = new Error("Not enough coins");
    error.code = "INSUFFICIENT_COINS";
    throw error;
  }

  if (recipient.coins + delta > 1000000000) {
    const error = new Error("Recipient wallet limit reached"); error.code = "WALLET_LIMIT"; throw error;
  }
  store.users[fromIdx] = normalizeUser({
    ...sender,
    coins: sender.coins - delta
  });
  store.users[toIdx] = normalizeUser({
    ...recipient,
    coins: recipient.coins + delta
  });
  writeStore(store);

  return {
    fromUser: store.users[fromIdx],
    toUser: store.users[toIdx],
    amount: delta
  };
}

function spendCoins(userId, amount = 0) {
  const delta = normalizeCoinDelta(amount);
  if (!Number.isFinite(delta) || delta <= 0) return findById(userId);

  const store = readStore();
  const idx = store.users.findIndex((u) => String(u._id) === String(userId));
  if (idx < 0) {
    const error = new Error("User not found");
    error.code = "USER_NOT_FOUND";
    throw error;
  }

  const current = normalizeUser(store.users[idx]);
  if (current.coins < delta) {
    const error = new Error("Not enough coins");
    error.code = "INSUFFICIENT_COINS";
    throw error;
  }

  store.users[idx] = normalizeUser({
    ...current,
    coins: current.coins - delta
  });
  writeStore(store);
  return store.users[idx];
}

function purchaseEffect(userId, effectId = "") {
  const effect = effects.getEffect(effectId);
  if (!effect || effect.id === "none") {
    const error = new Error("Effect not found");
    error.code = "EFFECT_NOT_FOUND";
    throw error;
  }

  const store = readStore();
  const idx = store.users.findIndex((u) => String(u._id) === String(userId));
  if (idx < 0) {
    const error = new Error("User not found");
    error.code = "USER_NOT_FOUND";
    throw error;
  }

  const current = normalizeUser(store.users[idx]);
  if (current.ownedEffects.includes(effect.id)) {
    const error = new Error("Effect already owned");
    error.code = "EFFECT_ALREADY_OWNED";
    throw error;
  }
  if (current.coins < effect.price) {
    const error = new Error("Not enough coins");
    error.code = "INSUFFICIENT_COINS";
    throw error;
  }

  store.users[idx] = normalizeUser({
    ...current,
    coins: current.coins - effect.price,
    ownedEffects: [...current.ownedEffects, effect.id]
  });
  writeStore(store);
  return { user: store.users[idx], effect };
}

// Keep wallet and community receipts in the same atomic local write. The
// callback is synchronous so no other request can interleave a stale balance.
function communityTransaction(id, callback) {
  const current = readStore();
  const store = JSON.parse(JSON.stringify(current));
  const user = store.users.find(item => item._id === String(id));
  if (!user) { const error = new Error('Account not found'); error.status = 404; throw error; }
  const result = callback(user);
  if (result?.then) throw new Error('Local community transactions must be synchronous');
  if (!Number.isFinite(user.coins) || user.coins < 0 || user.coins > 1000000000) {
    const error = new Error('Local wallet limit reached'); error.status = 409; throw error;
  }
  writeStore(store);
  return result;
}

function resetAllCoinsOnce({ version, message } = {}) {
  const cleanVersion = String(version || "").trim();
  const cleanMessage = String(message || "").trim().slice(0, 1000);
  if (!cleanVersion || !cleanMessage) throw new Error("A reset version and notification message are required");
  const store = readStore();
  if (store.migrations?.[cleanVersion]) {
    return { applied: false, accounts: store.users.length, previousTotal: 0 };
  }

  let previousTotal = 0;
  const at = Date.now();
  store.users = store.users.map((entry) => {
    const user = normalizeUser(entry);
    previousTotal += Number(user.coins || 0);
    const systemNotifications = [...user.systemNotifications];
    if (user.source !== "database") {
      const id = `coin-reset:${cleanVersion}:${user._id}`;
      if (!systemNotifications.some((notification) => notification.id === id)) {
        systemNotifications.push({
          id,
          type: "system",
          message: cleanMessage,
          metadata: { kind: "coin_balance_reset", version: cleanVersion },
          at
        });
      }
    }
    return normalizeUser({ ...user, coins: 0, systemNotifications });
  });
  store.migrations = {
    ...(store.migrations || {}),
    [cleanVersion]: { appliedAt: at, accounts: store.users.length, previousTotal }
  };
  writeStore(store);
  return { applied: true, accounts: store.users.length, previousTotal };
}

function listSystemNotifications(userId) {
  const user = readStore().users.find((entry) => String(entry._id) === String(userId));
  return user ? normalizeSystemNotifications(user.systemNotifications) : [];
}

function clearSystemNotification(userId, notificationId) {
  const store = readStore();
  const user = store.users.find((entry) => String(entry._id) === String(userId));
  if (!user) return false;
  const before = normalizeSystemNotifications(user.systemNotifications);
  user.systemNotifications = before.filter((notification) => notification.id !== String(notificationId));
  if (user.systemNotifications.length === before.length) return false;
  writeStore(store);
  return true;
}

function clearSystemNotifications(userId) {
  const store = readStore();
  const user = store.users.find((entry) => String(entry._id) === String(userId));
  if (!user) return 0;
  const count = normalizeSystemNotifications(user.systemNotifications).length;
  if (!count) return 0;
  user.systemNotifications = [];
  writeStore(store);
  return count;
}

function unlockEffect(userId, effectId = "") {
  const effect = effects.getEffect(effectId);
  if (!effect || effect.id === "none") {
    const error = new Error("Effect not found");
    error.code = "EFFECT_NOT_FOUND";
    throw error;
  }

  const store = readStore();
  const idx = store.users.findIndex((u) => String(u._id) === String(userId));
  if (idx < 0) {
    const error = new Error("User not found");
    error.code = "USER_NOT_FOUND";
    throw error;
  }

  const current = normalizeUser(store.users[idx]);
  store.users[idx] = normalizeUser({
    ...current,
    ownedEffects: [...new Set([...current.ownedEffects, effect.id])]
  });
  writeStore(store);
  return { user: store.users[idx], effect };
}

function equipEffect(userId, effectId = "") {
  const effect = effects.getEffect(effectId);
  if (!effect || (effect.id !== "none" && effect.scope !== "message")) {
    const error = new Error("Effect not found");
    error.code = "EFFECT_NOT_FOUND";
    throw error;
  }

  const store = readStore();
  const idx = store.users.findIndex((u) => String(u._id) === String(userId));
  if (idx < 0) {
    const error = new Error("User not found");
    error.code = "USER_NOT_FOUND";
    throw error;
  }

  const current = normalizeUser(store.users[idx]);
  if (!current.ownedEffects.includes(effect.id)) {
    const error = new Error("Effect not owned");
    error.code = "EFFECT_NOT_OWNED";
    throw error;
  }

  store.users[idx] = normalizeUser({
    ...current,
    equippedEffect: effect.id
  });
  writeStore(store);
  return { user: store.users[idx], effect };
}

function equipAvatarEffect(userId, effectId = "") {
  const cleanId = String(effectId || "none").trim().toLowerCase();
  const effect = cleanId === "none" ? { id: "none", name: "No avatar effect", scope: "avatar" } : effects.getEffect(cleanId);
  if (!effect || (effect.id !== "none" && effect.scope !== "avatar")) {
    const error = new Error("Avatar effect not found");
    error.code = "EFFECT_NOT_FOUND";
    throw error;
  }

  const store = readStore();
  const idx = store.users.findIndex((u) => String(u._id) === String(userId));
  if (idx < 0) {
    const error = new Error("User not found");
    error.code = "USER_NOT_FOUND";
    throw error;
  }

  const current = normalizeUser(store.users[idx]);
  if (effect.id !== "none" && !current.ownedEffects.includes(effect.id)) {
    const error = new Error("Avatar effect not owned");
    error.code = "EFFECT_NOT_OWNED";
    throw error;
  }

  store.users[idx] = normalizeUser({
    ...current,
    equippedAvatarEffect: effect.id
  });
  writeStore(store);
  return { user: store.users[idx], effect };
}

function upsertRemoteUser(remoteUser = {}) {
  const id = String(remoteUser._id || remoteUser.id || '').trim();
  const username = String(remoteUser.username || remoteUser.name || '').trim();
  if (!id || !username) return null;

  const remoteAvatar = typeof remoteUser.avatar === 'string'
    ? remoteUser.avatar
    : (typeof remoteUser.avatar_url === 'string' ? remoteUser.avatar_url : undefined);
  const remoteRole = String(remoteUser.role || '').trim();

  readStore();
  const existing = cache.byId.get(id) || cache.byUsername.get(username.toLowerCase());
  if (existing) {
    const oldUsername = String(existing.username || '').trim().toLowerCase();
    const nextUsername = username.toLowerCase();
    const usernameChanged = oldUsername && oldUsername !== nextUsername;
    const avatarChanged = remoteAvatar !== undefined && existing.avatar !== remoteAvatar;
    const roleChanged = remoteRole && existing.role !== remoteRole;
    const sourceChanged = remoteUser.source === 'database' && existing.source !== 'database';
    const versionChanged = Number(remoteUser.authVersion || 0) > Number(existing.community?.authVersion || 0);
    if (String(existing._id) === id && (usernameChanged || avatarChanged || roleChanged || versionChanged || sourceChanged)) {
      const store = readStore();
      store.users = store.users.map((user) => {
        const replaceReference = (value) => String(value || '').trim().toLowerCase() === oldUsername ? nextUsername : value;
        if (String(user._id) === id) return normalizeUser({
          ...user,
          username,
          ...(remoteUser.source === 'database' ? { source: 'database' } : {}),
          ...(versionChanged ? { community: { ...(user.community || {}), authVersion: remoteUser.authVersion } } : {}),
          ...(remoteAvatar !== undefined ? { avatar: remoteAvatar } : {}),
          ...(remoteRole ? { role: remoteRole } : {})
        });
        if (!usernameChanged) return user;
        return normalizeUser({
          ...user,
          friends: (user.friends || []).map(replaceReference),
          friendRequestsSent: (user.friendRequestsSent || []).map(replaceReference),
          friendRequestsReceived: (user.friendRequestsReceived || []).map(replaceReference)
        });
      });
      writeStore(store);
      return findById(id);
    }
    return existing;
  }

  const store = readStore();
  // env-var configured roles take highest precedence; fall back to remote role
  const envRole = resolveRole(username.toLowerCase(), store.users);
  const role = (envRole === 'owner' || envRole === 'admin') ? envRole : (remoteUser.role || envRole);
  const user = normalizeUser({
    _id: id,
    ...(remoteUser.source === 'database' ? { source: 'database' } : {}),
    username,
    role,
    ...(remoteAvatar !== undefined ? { avatar: remoteAvatar } : {})
  });
  store.users.push(user);
  writeStore(store);
  return user;
}

function sanitizeUser(user) {
  if (!user) return null;
  const normalized = normalizeUser(user);
  const effectiveRole = applyConfiguredRole(normalized);
  return {
    _id: normalized._id,
    username: normalized.username,
    role: effectiveRole,
    avatar: normalized.avatar,
    coins: sanitizeCoins(normalized.coins),
    authVersion: Math.max(0, Number(normalized.community?.authVersion || 0)),
    ownedEffects: ownedEffectsByScope(normalized.ownedEffects, "message"),
    ownedAvatarEffects: ownedEffectsByScope(normalized.ownedEffects, "avatar"),
    equippedEffect: normalizeEquippedEffect(normalized.equippedEffect, normalizeOwnedEffects(normalized.ownedEffects)),
    equippedAvatarEffect: normalizeEquippedAvatarEffect(normalized.equippedAvatarEffect, normalizeOwnedEffects(normalized.ownedEffects)),
    ...normalizeShopCosmetics(normalized),
    friends: normalizeFriends(normalized.friends),
  };
}

module.exports = {
  communityTransaction,
  resetAllCoinsOnce,
  listSystemNotifications,
  clearSystemNotification,
  clearSystemNotifications,
  listUsers,
  findByUsername,
  findByIdentifier,
  findById,
  upsertRemoteUser,
  addFriend,
  addFriendRequest,
  acceptFriendRequest,
  denyFriendRequest,
  removeFriendRelationship,
  getFriendRequests,
  getMutualFriends,
  searchUsersByUsername,
  verifyPassword,
  createUser,
  updateProfile,
  updatePassword,
  deleteUser,
  grantCoins,
  spendCoins,
  transferCoins,
  purchaseEffect,
  unlockEffect,
  equipEffect,
  equipAvatarEffect,
  sanitizeUser
};

// Serialize every writer across local server processes. Contention fails safely
// and is retryable; it never writes a stale snapshot over another process.
for (const name of ['communityTransaction', 'resetAllCoinsOnce', 'clearSystemNotification',
  'clearSystemNotifications', 'upsertRemoteUser', 'addFriend',
  'addFriendRequest', 'acceptFriendRequest', 'denyFriendRequest',
  'removeFriendRelationship', 'createUser', 'updateProfile', 'updatePassword',
  'deleteUser', 'grantCoins', 'spendCoins', 'transferCoins', 'purchaseEffect',
  'unlockEffect', 'equipEffect', 'equipAvatarEffect']) {
  const operation = module.exports[name];
  module.exports[name] = (...args) => {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    const lock = `${USERS_FILE}.lock`;
    let descriptor;
    try {
      if (fs.existsSync(lock)) {
        const owner = Number(fs.readFileSync(lock, 'utf8'));
        let dead = false;
        if (Number.isSafeInteger(owner) && owner > 0) {
          try { process.kill(owner, 0); } catch (error) { dead = error.code === 'ESRCH'; }
        }
        if (dead) {
          // Recheck under an exclusive recovery gate so two processes cannot
          // delete a newly acquired writer's lock.
          const gate = `${lock}.recovery`;
          const gateFd = fs.openSync(gate, 'wx', 0o600);
          try { if (Number(fs.readFileSync(lock, 'utf8')) === owner) fs.unlinkSync(lock); }
          finally { fs.closeSync(gateFd); fs.unlinkSync(gate); }
        }
      }
      descriptor = fs.openSync(lock, 'wx', 0o600);
      fs.writeFileSync(descriptor, String(process.pid));
    }
    catch (cause) {
      const error = new Error('Account storage is busy; retry the action');
      error.code = 'STORE_BUSY'; error.status = 503; error.cause = cause; throw error;
    }
    try {
      cache.mtimeMs = -1;
      return operation(...args);
    } finally {
      fs.closeSync(descriptor);
      fs.unlinkSync(lock);
    }
  };
}
