const fs = require("fs");
const path = require("path");

const DATA_DIR = path.resolve(__dirname, "..", "..", "data");
const FILE = path.join(DATA_DIR, "identities.json");

function ensureFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(FILE)) {
    fs.writeFileSync(FILE, JSON.stringify({ byToken: {} }, null, 2), "utf8");
  }
}

function readState() {
  ensureFile();
  try {
    const raw = fs.readFileSync(FILE, "utf8");
    const parsed = JSON.parse(raw || "{}");
    return {
      byToken: parsed?.byToken && typeof parsed.byToken === "object" ? parsed.byToken : {}
    };
  } catch (_err) {
    return { byToken: {} };
  }
}

function writeState(state) {
  ensureFile();
  fs.writeFileSync(FILE, JSON.stringify(state, null, 2), "utf8");
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
  const state = readState();
  return state.byToken[cleanToken] || null;
}

function listAll() {
  const state = readState();
  return state.byToken || {};
}

function getTokensByUserId(userId) {
  const target = String(userId || "").trim();
  if (!target) return [];
  const state = readState();
  return Object.keys(state.byToken).filter((token) => String(state.byToken[token]?.userId || "") === target);
}

function getByUsername(username) {
  const target = String(username || "").trim().toLowerCase();
  if (!target) return null;
  const state = readState();
  const token = Object.keys(state.byToken).find((t) => String(state.byToken[t]?.username || "").toLowerCase() === target);
  if (!token) return null;
  return { token, profile: state.byToken[token] };
}

module.exports = {
  bindToken,
  updateByUserId,
  getByToken,
  listAll,
  getTokensByUserId,
  getByUsername
};
