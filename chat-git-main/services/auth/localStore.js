const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const effects = require("../chat/effects");

const DATA_DIR = path.resolve(__dirname, "..", "..", "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const RESERVED_USERNAMES = new Set(["moderation"]);
const cache = {
  mtimeMs: -1,
  store: { users: [] },
  byId: new Map(),
  byUsername: new Map(),
  byEmail: new Map()
};

function ensureStore() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify({ users: [] }, null, 2), "utf8");
  }
}

function normalizeStore(input = {}) {
  return {
    users: Array.isArray(input.users) ? input.users.map((user) => normalizeUser(user)) : []
  };
}

function sanitizeCoins(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 0;
  return Math.max(0, Math.min(1000000, Math.floor(parsed)));
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

function normalizeEquippedEffect(effectId, ownedEffects) {
  const cleanId = String(effectId || "").trim().toLowerCase();
  if (ownedEffects.includes(cleanId) && effects.isValidEffect(cleanId)) {
    return cleanId;
  }
  return "none";
}

function normalizeUser(user = {}) {
  const ownedEffects = normalizeOwnedEffects(user.ownedEffects);
  return {
    ...user,
    coins: sanitizeCoins(user.coins),
    ownedEffects,
    friends: normalizeFriends(user.friends),
    equippedEffect: normalizeEquippedEffect(user.equippedEffect, ownedEffects)
  };
}

function rebuildIndexes(store) {
  cache.byId = new Map();
  cache.byUsername = new Map();
  cache.byEmail = new Map();

  for (const user of store.users) {
    const id = String(user?._id || "").trim();
    const username = String(user?.username || "").trim().toLowerCase();
    const email = String(user?.email || "").trim().toLowerCase();
    if (id) cache.byId.set(id, user);
    if (username) cache.byUsername.set(username, user);
    if (email) cache.byEmail.set(email, user);
  }
}

function updateCache(store, mtimeMs = cache.mtimeMs) {
  cache.store = normalizeStore(store);
  cache.mtimeMs = Number.isFinite(mtimeMs) ? mtimeMs : cache.mtimeMs;
  rebuildIndexes(cache.store);
  return cache.store;
}

function readStore(force = false) {
  ensureStore();
  try {
    const stats = fs.statSync(USERS_FILE);
    if (!force && cache.mtimeMs === stats.mtimeMs) {
      return cache.store;
    }
    const raw = fs.readFileSync(USERS_FILE, "utf8");
    const parsed = JSON.parse(raw || "{}");
    const normalized = normalizeStore(parsed);
    if (JSON.stringify(parsed || {}) !== JSON.stringify(normalized)) {
      fs.writeFileSync(USERS_FILE, JSON.stringify(normalized, null, 2), "utf8");
      const nextStats = fs.statSync(USERS_FILE);
      return updateCache(normalized, nextStats.mtimeMs);
    }
    return updateCache(normalized, stats.mtimeMs);
  } catch (_err) {
    return updateCache({ users: [] }, -1);
  }
}

function writeStore(store) {
  ensureStore();
  const nextStore = normalizeStore(store);
  fs.writeFileSync(USERS_FILE, JSON.stringify(nextStore, null, 2), "utf8");
  try {
    const stats = fs.statSync(USERS_FILE);
    updateCache(nextStore, stats.mtimeMs);
  } catch (_err) {
    updateCache(nextStore, Date.now());
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
  const user = {
    _id: crypto.randomUUID(),
    username: rawUsername,
    name: String(name || rawUsername).trim(),
    avatar: null,
    password: passwordHash,
    role,
    coins: 0,
    ownedEffects: ["none"],
    friends: [],
    equippedEffect: "none",
    date: new Date().toISOString()
  };
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

function updateProfile(userId, updates = {}) {
  const store = readStore();
  const idx = store.users.findIndex((u) => String(u._id) === String(userId));
  if (idx < 0) return null;

  const next = { ...store.users[idx] };
  if (typeof updates.avatar === "string") {
    next.avatar = updates.avatar || null;
  }
  if (updates.coins !== undefined) {
    next.coins = sanitizeCoins(updates.coins);
  }
  if (typeof updates.equippedEffect === "string") {
    next.equippedEffect = normalizeEquippedEffect(updates.equippedEffect, normalizeOwnedEffects(next.ownedEffects));
  }

  store.users[idx] = normalizeUser(next);
  writeStore(store);
  return store.users[idx];
}

function grantCoins(userId, amount = 0) {
  const delta = Math.floor(Number(amount) || 0);
  if (!delta) return findById(userId);
  const store = readStore();
  const idx = store.users.findIndex((u) => String(u._id) === String(userId));
  if (idx < 0) return null;
  const currentCoins = sanitizeCoins(store.users[idx]?.coins);
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
  const delta = Math.floor(Number(amount) || 0);

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

function equipEffect(userId, effectId = "") {
  const effect = effects.getEffect(effectId);
  if (!effect) {
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

function sanitizeUser(user) {
  if (!user) return null;
  const normalized = normalizeUser(user);
  const effectiveRole = applyConfiguredRole(normalized);
  return {
    _id: normalized._id,
    username: normalized.username,
    name: normalized.username,
    avatar: normalized.avatar || null,
    role: effectiveRole,
    coins: sanitizeCoins(normalized.coins),
    ownedEffects: normalizeOwnedEffects(normalized.ownedEffects),
    friends: normalizeFriends(normalized.friends),
    equippedEffect: normalizeEquippedEffect(normalized.equippedEffect, normalizeOwnedEffects(normalized.ownedEffects)),
    date: normalized.date
  };
}

module.exports = {
  listUsers,
  findByUsername,
  findByIdentifier,
  findById,
  addFriend,
  getMutualFriends,
  searchUsersByUsername,
  createUser,
  updateProfile,
  updatePassword,
  grantCoins,
  transferCoins,
  purchaseEffect,
  equipEffect,
  sanitizeUser
};
