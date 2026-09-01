const fs = require("fs");
const path = require("path");

const DATA_DIR = path.resolve(__dirname, "..", "..", "data");
const FILE = path.join(DATA_DIR, "identities.json");
const cache = {
  mtimeMs: -1,
  state: { byToken: {} },
  byToken: new Map(),
  tokensByUserId: new Map(),
  byUsername: new Map(),
  dirty: false,
  retryTimer: null
};

function ensureFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(FILE)) {
    fs.writeFileSync(FILE, JSON.stringify({ byToken: {} }, null, 2), "utf8");
  }
}

function pruneDuplicateIdentities(byToken = {}) {
  const result = {};
  for (const [token, profile] of Object.entries(byToken || {})) {
    const cleanToken = String(token || "").trim();
    if (!cleanToken || !profile || typeof profile !== "object") continue;
    // A person can receive a new TLK participant token after reconnecting.
    // Historical messages still reference the older tokens, so keep every
    // token binding instead of collapsing an account to its newest token.
    result[cleanToken] = profile;
  }

  return result;
}

function normalizeState(input = {}) {
  return {
    byToken: pruneDuplicateIdentities(input?.byToken && typeof input?.byToken === "object" ? input.byToken : {})
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
    if (username) {
      const existing = cache.byUsername.get(username);
      if (!existing || Number(profile?.updatedAt || 0) >= Number(existing.profile?.updatedAt || 0)) {
        cache.byUsername.set(username, { token: cleanToken, profile });
      }
    }
  }
}

function updateCache(state, mtimeMs = cache.mtimeMs) {
  cache.state = normalizeState(state);
  cache.mtimeMs = Number.isFinite(mtimeMs) ? mtimeMs : cache.mtimeMs;
  rebuildIndexes(cache.state);
  return cache.state;
}

function readState(force = false) {
  // A pending in-memory write is newer than the disk copy. Do not let a
  // transient OneDrive/antivirus lock replace it with stale or empty data.
  if (cache.dirty) return cache.state;
  try {
    ensureFile();
    const stats = fs.statSync(FILE);
    if (!force && cache.mtimeMs === stats.mtimeMs) {
      return cache.state;
    }
    const raw = fs.readFileSync(FILE, "utf8");
    const parsed = JSON.parse(raw || "{}");
    const normalized = normalizeState(parsed);
    if (JSON.stringify(parsed || {}) !== JSON.stringify(normalized)) {
      writeState(normalized);
      return cache.state;
    }
    return updateCache(normalized, stats.mtimeMs);
  } catch (_err) {
    // Identity decoration is important to message ownership, but a temporary
    // file lock must never make joining a room fail or erase the live cache.
    return cache.state;
  }
}

function persistState(nextState) {
  ensureFile();
  const payload = JSON.stringify(nextState, null, 2);
  const temporaryFile = `${FILE}.${process.pid}.tmp`;
  try {
    fs.writeFileSync(temporaryFile, payload, "utf8");
    try {
      fs.renameSync(temporaryFile, FILE);
    } catch (_renameError) {
      // Windows can briefly hold the destination open. A direct write often
      // still succeeds and is preferable to dropping the updated identity.
      fs.writeFileSync(FILE, payload, "utf8");
      try { fs.unlinkSync(temporaryFile); } catch {}
    }
    const stats = fs.statSync(FILE);
    updateCache(nextState, stats.mtimeMs);
    cache.dirty = false;
  } catch (error) {
    try { fs.unlinkSync(temporaryFile); } catch {}
    throw error;
  }
}

function schedulePersistRetry() {
  if (cache.retryTimer) return;
  cache.retryTimer = setTimeout(() => {
    cache.retryTimer = null;
    if (!cache.dirty) return;
    try {
      persistState(cache.state);
    } catch {
      schedulePersistRetry();
    }
  }, 750);
  cache.retryTimer.unref?.();
}

function writeState(state) {
  const nextState = normalizeState(state);
  updateCache(nextState, Date.now());
  cache.dirty = true;
  try {
    persistState(nextState);
  } catch {
    // Keep serving the coherent in-memory indexes and retry persistence in the
    // background. Callers should not turn a local file lock into an API 502.
    schedulePersistRetry();
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
    is_owner: !!(profile.is_owner),
    is_premium: !!(profile.is_premium),
    is_booster: !!(profile.is_booster),
    equippedEffect: profile.equippedEffect || "none",
    equippedAvatarEffect: profile.equippedAvatarEffect || "none",
    equippedTag: profile.equippedTag || "none",
    equippedProfileEffect: profile.equippedProfileEffect || "none",
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
