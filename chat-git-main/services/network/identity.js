const fs = require("fs");
const path = require("path");

const DATA_DIR = path.resolve(__dirname, "..", "..", "data");
const FILE = path.join(DATA_DIR, "identities.json");
const cache = {
  mtimeMs: -1,
  state: { byToken: {} },
  byToken: new Map(),
  tokensByUserId: new Map(),
  byUsername: new Map()
};

function ensureFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(FILE)) {
    fs.writeFileSync(FILE, JSON.stringify({ byToken: {} }, null, 2), "utf8");
  }
}

function normalizeState(input = {}) {
  return {
    byToken: input?.byToken && typeof input.byToken === "object" ? input.byToken : {}
  };
}

function rebuildIndexes(state) {
  cache.byToken = new Map();
  cache.tokensByUserId = new Map();
  cache.byUsername = new Map();

  for (const [token, profile] of Object.entries(state.byToken || {})) {
    const cleanToken = String(token || "").trim();
    const userId = String(profile?.userId || "").trim();
    const username = String(profile?.username || "").trim().toLowerCase();
    if (!cleanToken) continue;
    cache.byToken.set(cleanToken, profile);
    if (userId) {
      const list = cache.tokensByUserId.get(userId) || [];
      list.push(cleanToken);
      cache.tokensByUserId.set(userId, list);
    }
    if (username) cache.byUsername.set(username, { token: cleanToken, profile });
  }
}

function updateCache(state, mtimeMs = cache.mtimeMs) {
  cache.state = normalizeState(state);
  cache.mtimeMs = Number.isFinite(mtimeMs) ? mtimeMs : cache.mtimeMs;
  rebuildIndexes(cache.state);
  return cache.state;
}

function readState(force = false) {
  ensureFile();
  try {
    const stats = fs.statSync(FILE);
    if (!force && cache.mtimeMs === stats.mtimeMs) {
      return cache.state;
    }
    const raw = fs.readFileSync(FILE, "utf8");
    const parsed = JSON.parse(raw || "{}");
    return updateCache(parsed, stats.mtimeMs);
  } catch (_err) {
    return updateCache({ byToken: {} }, -1);
  }
}

function writeState(state) {
  ensureFile();
  const nextState = normalizeState(state);
  fs.writeFileSync(FILE, JSON.stringify(nextState, null, 2), "utf8");
  try {
    const stats = fs.statSync(FILE);
    updateCache(nextState, stats.mtimeMs);
  } catch (_err) {
    updateCache(nextState, Date.now());
  }
}

function bindToken(token, profile) {
  const cleanToken = String(token || "").trim();
  if (!cleanToken || !profile) return;
  const state = readState();
  state.byToken[cleanToken] = {
    userId: profile._id || null,
    username: profile.username || null,
    name: profile.name || null,
    avatar: profile.avatar || null,
    role: profile.role || null,
    equippedEffect: profile.equippedEffect || "none",
    updatedAt: Date.now()
  };
  writeState(state);
}

function updateByUserId(userId, patch = {}) {
  const target = String(userId || "").trim();
  if (!target) return;
  const state = readState();
  let changed = false;
  Object.keys(state.byToken).forEach((token) => {
    const item = state.byToken[token];
    if (String(item?.userId || "") === target) {
      state.byToken[token] = {
        ...item,
        ...patch,
        updatedAt: Date.now()
      };
      changed = true;
    }
  });
  if (changed) writeState(state);
}

function getByToken(token) {
  const cleanToken = String(token || "").trim();
  if (!cleanToken) return null;
  readState();
  return cache.byToken.get(cleanToken) || null;
}

function listAll() {
  const state = readState();
  return state.byToken || {};
}

function getTokensByUserId(userId) {
  const target = String(userId || "").trim();
  if (!target) return [];
  readState();
  return [...(cache.tokensByUserId.get(target) || [])];
}

function getByUsername(username) {
  const target = String(username || "").trim().toLowerCase();
  if (!target) return null;
  readState();
  return cache.byUsername.get(target) || null;
}

module.exports = {
  bindToken,
  updateByUserId,
  getByToken,
  listAll,
  getTokensByUserId,
  getByUsername
};
