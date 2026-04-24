const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const DATA_DIR = path.resolve(__dirname, "..", "..", "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const RESERVED_USERNAMES = new Set(["moderation"]);

function ensureStore() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify({ users: [] }, null, 2), "utf8");
  }
}

function readStore() {
  ensureStore();
  try {
    const raw = fs.readFileSync(USERS_FILE, "utf8");
    const parsed = JSON.parse(raw || "{}");
    return {
      users: Array.isArray(parsed.users) ? parsed.users : []
    };
  } catch (_err) {
    return { users: [] };
  }
}

function writeStore(store) {
  ensureStore();
  fs.writeFileSync(USERS_FILE, JSON.stringify(store, null, 2), "utf8");
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
  return listUsers().find((u) => String(u.username || "").toLowerCase() === target) || null;
}

function findByIdentifier(identifier = "") {
  const target = String(identifier).trim().toLowerCase();
  if (!target) return null;
  return (
    listUsers().find((u) => {
      const username = String(u.username || "").toLowerCase();
      const email = String(u.email || "").toLowerCase();
      return username === target || email === target;
    }) || null
  );
}

function findById(id = "") {
  const target = String(id).trim();
  if (!target) return null;
  return listUsers().find((u) => String(u._id) === target) || null;
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
  if (typeof updates.name === "string") {
    const n = updates.name.trim();
    if (n) next.name = n.slice(0, 40);
  }
  if (typeof updates.avatar === "string") {
    next.avatar = updates.avatar || null;
  }

  store.users[idx] = next;
  writeStore(store);
  return next;
}

function sanitizeUser(user) {
  if (!user) return null;
  const effectiveRole = applyConfiguredRole(user);
  return {
    _id: user._id,
    username: user.username,
    name: user.name,
    avatar: user.avatar || null,
    role: effectiveRole,
    date: user.date
  };
}

module.exports = {
  listUsers,
  findByUsername,
  findByIdentifier,
  findById,
  createUser,
  updateProfile,
  updatePassword,
  sanitizeUser
};
