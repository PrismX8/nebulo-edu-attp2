const network = require("../../config/networkSites");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { randomUUID } = require("crypto");
const userStore = require("../auth/localStore");
const identityStore = require("./identity");
const BAN_APPEAL_TEXT = "Open a ticket to appeal: dsc.gg/nebulo";

const DATA_DIR = path.resolve(__dirname, "../../data");
const PERSIST_FILE = path.join(DATA_DIR, "network-state.json");

const state = {
  blockedWords: new Set(
    String(process.env.MOD_BLOCKED_WORDS || "")
      .split(",")
      .map((w) => w.trim().toLowerCase())
      .filter(Boolean)
  ),
  mutedUsers: new Set(),
  bannedUsers: new Set(),
  bannedAccounts: new Set(),
  bannedDevices: new Set(),
  lockdownActive: false,
  roomBans: new Map(),
  deletedMessages: new Map(),
  clearedRooms: new Map(),
  roomEffects: new Map(),
  roomSettings: new Map(),
  roomSlowmodes: new Map(),
  warningsByUser: new Map(),
  cooldownByUser: new Map(),
  pendingAlerts: new Map(),
  slowmodeMs: null
};

function savePersistentState() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const payload = {
      clearedRooms: Object.fromEntries(state.clearedRooms.entries()),
      roomEffects: Object.fromEntries(state.roomEffects.entries()),
      roomSettings: Object.fromEntries(state.roomSettings.entries()),
      roomSlowmodes: Object.fromEntries(state.roomSlowmodes.entries()),
      pendingAlerts: Object.fromEntries(state.pendingAlerts.entries()),
      slowmodeMs: Math.max(0, Number(state.slowmodeMs || 0)),
      lockdownActive: !!state.lockdownActive
    };
    fs.writeFileSync(PERSIST_FILE, JSON.stringify(payload, null, 2), "utf8");
  } catch (_err) {
  }
}

function loadPersistentState() {
  try {
    if (!fs.existsSync(PERSIST_FILE)) return;
    const raw = fs.readFileSync(PERSIST_FILE, "utf8");
    const parsed = JSON.parse(raw || "{}");
    const clearedRooms = parsed?.clearedRooms && typeof parsed.clearedRooms === "object"
      ? parsed.clearedRooms
      : {};
    const roomEffects = parsed?.roomEffects && typeof parsed.roomEffects === "object"
      ? parsed.roomEffects
      : {};
    state.clearedRooms = new Map(Object.entries(clearedRooms));
    state.roomEffects = new Map(Object.entries(roomEffects));
    const roomSettings = parsed?.roomSettings && typeof parsed.roomSettings === "object"
      ? parsed.roomSettings
      : {};
    state.roomSettings = new Map(Object.entries(roomSettings));
    const roomSlowmodes = parsed?.roomSlowmodes && typeof parsed.roomSlowmodes === "object"
      ? parsed.roomSlowmodes
      : {};
    state.roomSlowmodes = new Map(Object.entries(roomSlowmodes).map(([room, value]) => [
      String(room || "").trim().toLowerCase(),
      Math.max(0, Number(value || 0))
    ]));
    const pendingAlerts = parsed?.pendingAlerts && typeof parsed.pendingAlerts === "object"
      ? parsed.pendingAlerts
      : {};
    state.pendingAlerts = new Map(Object.entries(pendingAlerts).map(([key, alerts]) => [
      String(key || "").trim(),
      (Array.isArray(alerts) ? alerts : []).filter((alert) => alert && typeof alert === "object").slice(-100)
    ]).filter(([key]) => key));
    if (Object.prototype.hasOwnProperty.call(parsed || {}, "slowmodeMs")) {
      state.slowmodeMs = Math.max(0, Number(parsed?.slowmodeMs || 0));
    }
    if (Object.prototype.hasOwnProperty.call(parsed || {}, "lockdownActive")) {
      state.lockdownActive = !!parsed?.lockdownActive;
    }
  } catch (_err) {
  }
}

loadPersistentState();
const warningLimit = Number(process.env.MOD_WARNING_LIMIT || 3);
const defaultCooldownMs = Number(process.env.MOD_COOLDOWN_MS || 6000);
const defaultPrivateSlowmodeMs = Math.max(0, Number(process.env.PRIVATE_ROOM_SLOWMODE_MS || 1000));
if (!Number.isFinite(state.slowmodeMs) || state.slowmodeMs < 0) {
  state.slowmodeMs = Math.max(0, defaultCooldownMs);
}
const useBlockedWords = String(process.env.MOD_USE_BLOCKED_WORDS || "false").toLowerCase() === "true";
const strictMode = String(process.env.MOD_STRICT_MODE || "false").toLowerCase() === "true";
const strictMinSeverity = String(process.env.MOD_STRICT_MIN_SEVERITY || "medium").toLowerCase();
const blockLinksByDefault = String(process.env.MOD_BLOCK_LINKS || "false").toLowerCase() === "true";
const geminiApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "";
const geminiModel = process.env.GEMINI_MODEL || "gemini-1.5-flash";
const moderationSystemPrompt = process.env.MODERATION_SYSTEM_PROMPT || [
  "You are a lenient realtime chat safety moderator.",
  "Allow clearly safe conversation, jokes, harmless slang, profanity, and non-racist insults when they do not include threats or other safety issues.",
  "For offensive language moderation, block racist content and clear protected-class hate; do not block profanity or non-racist insults by themselves.",
  "Block pornography, explicit sexual content, sexual exploitation involving minors, credible threats, doxxing, self-harm encouragement, dangerous instructions intended to cause harm, scams/phishing, flooding, and racist hate.",
  "When uncertain, allow the message unless it clearly matches one of the blocked safety categories.",
  "Decide based on overall intent and risk, not keywords alone."
].join(" ");
const moderationExamples = [
  'Example allow 1: message="that game was wild lol" => {"allowed":true,"severity":"low","reasons":[],"suggestions":[],"rewritten":"that game was wild lol"}',
  'Example allow 2: message="this is fucking crazy" (not directed at a person) => {"allowed":true,"severity":"low","reasons":[],"suggestions":[],"rewritten":"this is fucking crazy"}',
  'Example allow 3: message="you are a dumb bitch" => {"allowed":true,"severity":"low","reasons":[],"suggestions":[],"rewritten":"you are a dumb bitch"}',
  'Example block 2: message="537 cherryhill road" => {"allowed":false,"severity":"high","reasons":["Potential personal address/doxxing content detected"],"suggestions":["Do not share street addresses or personal location info."],"rewritten":"Please remove address-like personal information."}',
  'Example block 3: message="kill yourself" => {"allowed":false,"severity":"high","reasons":["Self-harm encouragement detected"],"suggestions":["Do not encourage self-harm."],"rewritten":"Please remove harmful language."}',
  'Example block 4: message containing racial hate or n-word variants => {"allowed":false,"severity":"high","reasons":["Racist hate speech detected"],"suggestions":["Remove racist content."],"rewritten":"Message blocked by moderation."}',
  'Example block 5: message containing pornography, requests for nude images, or links described as NSFW => {"allowed":false,"severity":"high","reasons":["Pornographic or explicit sexual content detected"],"suggestions":["Remove pornographic or explicit sexual content."],"rewritten":"Message blocked by moderation."}'
].join("\n");
const moderationConfusables = new Map(Object.entries({
  "а": "a", "ɑ": "a", "α": "a", "à": "a", "á": "a", "â": "a", "ã": "a", "ä": "a",
  "е": "e", "ε": "e", "ё": "e", "è": "e", "é": "e", "ê": "e", "ë": "e",
  "і": "i", "ї": "i", "ì": "i", "í": "i", "î": "i", "ï": "i", "!": "i", "|": "i",
  "ο": "o", "о": "o", "օ": "o", "ò": "o", "ó": "o", "ô": "o", "õ": "o", "ö": "o",
  "р": "p", "ρ": "p", "с": "c", "ϲ": "c", "х": "x", "у": "y", "ү": "y",
  "к": "k", "м": "m", "н": "h", "т": "t", "в": "b", "ѕ": "s"
}));
const moderationLeet = new Map(Object.entries({
  "0": "o", "1": "i", "2": "z", "3": "e", "4": "a", "5": "s",
  "6": "g", "7": "t", "8": "b", "9": "g", "$": "s", "@": "a", "+": "t"
}));

function decodeModerationEntities(value = "") {
  return String(value || "")
    .replace(/&#(\d+);?/g, (_, code) => String.fromCodePoint(Math.min(0x10ffff, Number(code) || 0)))
    .replace(/&#x([a-f0-9]+);?/gi, (_, code) => String.fromCodePoint(Math.min(0x10ffff, parseInt(code, 16) || 0)));
}

function normalizeModerationText(value = "") {
  const decoded = decodeModerationEntities(value).normalize("NFKC").toLowerCase();
  const mapped = Array.from(decoded, (char) => moderationConfusables.get(char) || moderationLeet.get(char) || char).join("");
  const visible = mapped
    .replace(/[\u0000-\u001f\u007f-\u009f\u200b-\u200f\u202a-\u202e\u2060-\u206f\ufeff]/g, "")
    .replace(/\p{M}+/gu, "")
    .replace(/(.)\1{3,}/g, "$1$1");
  return {
    raw: String(value || ""),
    spaced: visible.replace(/[^\p{L}\p{N}]+/gu, " ").replace(/\s+/g, " ").trim(),
    compact: visible.replace(/[^\p{L}\p{N}]+/gu, "")
  };
}

const severeHatePatterns = [
  /\bn[\W_]*i[\W_]*g[\W_]*g[\W_]*e[\W_]*r\b/i,
  /\bn[\W_]*i[\W_]*g[\W_]*g[\W_]*a\b/i,
  /\bn[\W_]*i[\W_]*g[\W_]*a\b/i,
  /\b(?:black|white|asian|latino|hispanic|mexican|arab|jewish|indian)\s+people\s+(?:are|r|should|deserve)\b.*\b(?:inferior|subhuman|animals|die|dead|enslaved|deported)\b/i,
  /\b(?:go\s+back\s+to\s+your\s+country|race\s+war|white\s+power)\b/i
];
function looksLikeAddress(text = "") {
  const value = String(text || "").trim();
  if (!value) return false;

  // Common US-style street address patterns (number + street + suffix).
  const streetLinePattern =
    /\b\d{1,6}\s+[a-z0-9.'-]+(?:\s+[a-z0-9.'-]+){0,5}\s+(street|st|avenue|ave|road|rd|drive|dr|lane|ln|court|ct|boulevard|blvd|way|terrace|ter|place|pl|parkway|pkwy)\b/i;
  // Stricter plain street-line match (no city/state required).
  const plainStreetPattern =
    /^\s*\d{1,6}\s+[a-z0-9.'-]+(?:\s+[a-z0-9.'-]+){0,6}\s+(street|st|avenue|ave|road|rd|drive|dr|lane|ln|court|ct|boulevard|blvd|way|terrace|ter|place|pl|parkway|pkwy)\s*$/i;
  // Unit designators frequently present in full addresses.
  const unitPattern = /\b(apt|apartment|unit|suite|ste|#)\s*[a-z0-9-]+\b/i;
  // PO Box formats.
  const poBoxPattern = /\b(p\.?\s*o\.?\s*box|post office box)\s+\d+\b/i;
  // Optional city/state/zip tail.
  const cityStateZipPattern = /\b[a-z .'-]+,\s*[a-z]{2}\s+\d{5}(?:-\d{4})?\b/i;

  if (poBoxPattern.test(value)) return true;
  if (plainStreetPattern.test(value)) return true;
  if (streetLinePattern.test(value)) return true;
  if (unitPattern.test(value) && cityStateZipPattern.test(value)) return true;
  return false;
}

function hasSevereHateSpeech(text = "") {
  const normalized = normalizeModerationText(text);
  return severeHatePatterns.some((rx) =>
    rx.test(String(text)) ||
    rx.test(normalized.spaced) ||
    rx.test(normalized.compact)
  );
}

const severityRank = { low: 1, medium: 2, high: 3 };
function normalizeSeverity(sev) {
  return ["low", "medium", "high"].includes(sev) ? sev : "medium";
}

function shouldBlockBySeverity(severity) {
  const min = normalizeSeverity(strictMinSeverity);
  return severityRank[normalizeSeverity(severity)] >= severityRank[min];
}

function isCriticalModerationReason(reason = "") {
  return /(racis|racial|n-word|protected-class hate|credible threat|threat|dox|address|self-harm|suicide|credential|scam|phish|sexual|porn|nudity|nude|nsfw|explicit|minor|child|exploit|bomb|swat|spam|flood)/i.test(String(reason || ""));
}

function mergeUniqueStrings(listA = [], listB = []) {
  return Array.from(
    new Set([...(Array.isArray(listA) ? listA : []), ...(Array.isArray(listB) ? listB : [])].map((v) => String(v).trim()).filter(Boolean))
  );
}

function normalizeReport(report = {}) {
  if (!report || typeof report !== "object") return null;
  const id = String(report.id || "").trim();
  const room = String(report.room || "").trim().toLowerCase();
  const messageId = String(report.messageId || report.id || "").trim();
  if (!id || !room || !messageId) return null;
  const status = ["open", "reviewing", "resolved", "dismissed"].includes(String(report.status || "").toLowerCase())
    ? String(report.status).toLowerCase()
    : "open";
  return {
    id,
    room,
    messageId,
    reasonCategory: String(report.reasonCategory || "other").trim().toLowerCase().slice(0, 40),
    reason: String(report.reason || "").trim().slice(0, 700),
    reporterId: String(report.reporterId || "").trim(),
    reporterUsername: String(report.reporterUsername || "Unknown").trim().slice(0, 80),
    targetUsername: String(report.targetUsername || "Unknown").trim().slice(0, 80),
    targetUserId: String(report.targetUserId || "").trim(),
    targetToken: String(report.targetToken || "").trim().slice(0, 140),
    quote: String(report.quote || "").replace(/\s+/g, " ").trim().slice(0, 240),
    status,
    createdAt: report.createdAt || new Date().toISOString(),
    reviewedAt: report.reviewedAt || null,
    reviewedBy: report.reviewedBy || null,
    modNote: String(report.modNote || "").trim().slice(0, 500)
  };
}

function createReport(payload = {}) {
  const createdAt = new Date().toISOString();
  const randomPart = Math.random().toString(36).slice(2, 8);
  const report = normalizeReport({
    ...payload,
    id: `report_${Date.now()}_${randomPart}`,
    status: "open",
    createdAt
  });
  if (!report) {
    const error = new Error("Invalid report");
    error.code = "INVALID_REPORT";
    throw error;
  }
  state.reports.unshift(report);
  state.reports = state.reports.slice(0, 300);
  savePersistentState();
  return report;
}

function listReports(filters = {}) {
  const room = String(filters.room || "").trim().toLowerCase();
  const status = String(filters.status || "").trim().toLowerCase();
  return (Array.isArray(state.reports) ? state.reports : [])
    .filter((report) => !room || report.room === room)
    .filter((report) => !status || status === "all" || report.status === status)
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

function updateReportStatus(reportId, updates = {}) {
  const id = String(reportId || "").trim();
  const index = state.reports.findIndex((report) => String(report.id) === id);
  if (index < 0) return null;
  const nextStatus = String(updates.status || state.reports[index].status || "open").trim().toLowerCase();
  if (!["open", "reviewing", "resolved", "dismissed"].includes(nextStatus)) {
    const error = new Error("Invalid report status");
    error.code = "INVALID_STATUS";
    throw error;
  }
  const updated = normalizeReport({
    ...state.reports[index],
    status: nextStatus,
    reviewedAt: new Date().toISOString(),
    reviewedBy: updates.reviewedBy || state.reports[index].reviewedBy || null,
    modNote: updates.modNote ?? state.reports[index].modNote
  });
  state.reports[index] = updated;
  savePersistentState();
  return updated;
}

function asArray(setObj) {
  return Array.from(setObj.values());
}

function getModeration() {
  return {
    blockedWords: asArray(state.blockedWords),
    mutedUsers: asArray(state.mutedUsers),
    bannedUsers: asArray(state.bannedUsers),
    bannedAccounts: asArray(state.bannedAccounts),
    bannedDevices: asArray(state.bannedDevices),
    warnings: Object.fromEntries(Array.from(state.warningsByUser.entries()).map(([key, value]) => [key, Number(value)])),
    warningLimit,
    lockdownActive: !!state.lockdownActive,
    slowmodeMs: Math.max(0, Number(state.slowmodeMs || 0)),
    roomSlowmodes: Object.fromEntries(state.roomSlowmodes.entries())
  };
}

function setModeration(payload = {}) {
  if (Array.isArray(payload.blockedWords)) {
    state.blockedWords = new Set(
      payload.blockedWords
        .map((w) => String(w).trim().toLowerCase())
        .filter(Boolean)
    );
  }

  if (Array.isArray(payload.mutedUsers)) {
    state.mutedUsers = new Set(
      payload.mutedUsers
        .map((u) => String(u).trim())
        .filter(Boolean)
    );
  }

  if (Array.isArray(payload.bannedUsers)) {
    state.bannedUsers = new Set(
      payload.bannedUsers
        .map((u) => String(u).trim())
        .filter(Boolean)
    );
  }

  if (Array.isArray(payload.bannedAccounts)) {
    state.bannedAccounts = new Set(
      payload.bannedAccounts
        .map((u) => String(u).trim())
        .filter(Boolean)
    );
  }

  if (Array.isArray(payload.bannedDevices)) {
    state.bannedDevices = new Set(
      payload.bannedDevices
        .map((u) => String(u).trim())
        .filter(Boolean)
    );
  }

  if (payload.slowmodeMs !== undefined) {
    state.slowmodeMs = Math.max(0, Number(payload.slowmodeMs || 0));
    savePersistentState();
  }

  if (payload.lockdownActive !== undefined) {
    state.lockdownActive = payload.lockdownActive === true || String(payload.lockdownActive).toLowerCase() === 'true';
    savePersistentState();
  }

  return getModeration();
}

function getSlowmodeMs() {
  return Math.max(0, Number(state.slowmodeMs || 0));
}

function setSlowmodeMs(value) {
  state.slowmodeMs = Math.max(0, Number(value || 0));
  savePersistentState();
  return getSlowmodeMs();
}

function getRoomSlowmodeMs(room = "") {
  const key = String(room || "").trim().toLowerCase();
  if (!key) return 0;
  return Math.max(0, Number(state.roomSlowmodes.get(key) || 0));
}

function setRoomSlowmodeMs(room = "", value = 0) {
  const key = String(room || "").trim().toLowerCase();
  if (!key) return 0;
  const next = Math.max(0, Number(value || 0));
  if (next > 0) state.roomSlowmodes.set(key, next);
  else state.roomSlowmodes.delete(key);
  savePersistentState();
  return getRoomSlowmodeMs(key);
}

function getEffectiveSlowmodeMs(room = "", options = {}) {
  const key = String(room || "").trim().toLowerCase();
  const roomMs = getRoomSlowmodeMs(key);
  if (roomMs > 0) {
    return { slowmodeMs: roomMs, scope: "room", room: key };
  }
  if (options.excludeGlobal) {
    return {
      slowmodeMs: defaultPrivateSlowmodeMs,
      scope: defaultPrivateSlowmodeMs > 0 ? "private-default" : "none",
      room: key
    };
  }
  return { slowmodeMs: getSlowmodeMs(), scope: "global", room: key };
}

function isBlockedWord(body = "") {
  const normalized = normalizeModerationText(body);
  return asArray(state.blockedWords).some((w) => {
    const word = normalizeModerationText(w);
    return normalized.spaced.includes(word.spaced) || normalized.compact.includes(word.compact);
  });
}

function getMatchedBlockedWord(body = "") {
  const normalized = normalizeModerationText(body);
  return asArray(state.blockedWords).find((w) => {
    const word = normalizeModerationText(w);
    return normalized.spaced.includes(word.spaced) || normalized.compact.includes(word.compact);
  }) || null;
}

function isMutedUser(userToken) {
  return !!userToken && state.mutedUsers.has(String(userToken));
}

function isBannedUser(userToken) {
  return !!userToken && state.bannedUsers.has(String(userToken));
}

function isBannedAccount(userId) {
  return !!userId && state.bannedAccounts.has(String(userId));
}

function isBannedDevice(deviceId) {
  return !!deviceId && state.bannedDevices.has(String(deviceId));
}

function isOwnerIdentity(identity = {}) {
  const userId = String(identity.userId || "").trim();
  const userToken = String(identity.userToken || "").trim();
  const profile = userToken ? identityStore.getByToken(userToken) : null;
  const resolvedUserId = userId || String(profile?.userId || "").trim();
  const directRole = String(profile?.role || "").trim().toLowerCase();
  if (directRole === "owner") return true;
  if (!resolvedUserId) return false;
  const user = userStore.findById(resolvedUserId);
  return String(user?.role || "").trim().toLowerCase() === "owner";
}

function getRoomBanBucket(room) {
  const key = String(room || "").trim().toLowerCase();
  if (!key) return null;
  if (!state.roomBans.has(key)) {
    state.roomBans.set(key, {
      bannedUsers: new Set(),
      bannedAccounts: new Set(),
      bannedDevices: new Set()
    });
  }
  return state.roomBans.get(key);
}

function isIdentityBannedInRoom(identity = {}, room = "") {
  if (isOwnerIdentity(identity)) return false;
  const bucket = getRoomBanBucket(room);
  if (!bucket) return false;
  const userToken = String(identity.userToken || "").trim();
  const userId = String(identity.userId || "").trim();
  const deviceId = String(identity.deviceId || "").trim();
  return (
    (!!userToken && bucket.bannedUsers.has(userToken)) ||
    (!!userId && bucket.bannedAccounts.has(userId)) ||
    (!!deviceId && bucket.bannedDevices.has(deviceId))
  );
}

function isIdentityBanned(identity = {}) {
  if (isOwnerIdentity(identity)) return false;
  return (
    isBannedUser(identity.userToken) ||
    isBannedAccount(identity.userId) ||
    isBannedDevice(identity.deviceId)
  );
}

function banIdentity(identity = {}) {
  if (isOwnerIdentity(identity)) {
    return {
      userToken: null,
      userId: String(identity.userId || "").trim() || null,
      deviceId: null,
      skipped: "owner"
    };
  }
  const userToken = String(identity.userToken || "").trim();
  const userId = String(identity.userId || "").trim();
  const deviceId = String(identity.deviceId || "").trim();

  if (userToken) state.bannedUsers.add(userToken);
  if (userId) state.bannedAccounts.add(userId);
  if (deviceId) state.bannedDevices.add(deviceId);

  return {
    userToken: userToken || null,
    userId: userId || null,
    deviceId: deviceId || null
  };
}

function banIdentityInRoom(identity = {}, room = "") {
  if (isOwnerIdentity(identity)) {
    return {
      room: String(room || "").trim().toLowerCase(),
      userToken: null,
      userId: String(identity.userId || "").trim() || null,
      deviceId: null,
      skipped: "owner"
    };
  }
  const bucket = getRoomBanBucket(room);
  if (!bucket) return null;
  const userToken = String(identity.userToken || "").trim();
  const userId = String(identity.userId || "").trim();
  const deviceId = String(identity.deviceId || "").trim();

  if (userToken) bucket.bannedUsers.add(userToken);
  if (userId) bucket.bannedAccounts.add(userId);
  if (deviceId) bucket.bannedDevices.add(deviceId);

  return {
    room: String(room || "").trim().toLowerCase(),
    userToken: userToken || null,
    userId: userId || null,
    deviceId: deviceId || null
  };
}

function unbanIdentity(identity = {}) {
  const userToken = String(identity.userToken || "").trim();
  const userId = String(identity.userId || "").trim();
  const deviceId = String(identity.deviceId || "").trim();

  if (userToken) state.bannedUsers.delete(userToken);
  if (userId) state.bannedAccounts.delete(userId);
  if (deviceId) state.bannedDevices.delete(deviceId);
}

function unbanIdentityInRoom(identity = {}, room = "") {
  const bucket = getRoomBanBucket(room);
  if (!bucket) return;
  const userToken = String(identity.userToken || "").trim();
  const userId = String(identity.userId || "").trim();
  const deviceId = String(identity.deviceId || "").trim();

  if (userToken) bucket.bannedUsers.delete(userToken);
  if (userId) bucket.bannedAccounts.delete(userId);
  if (deviceId) bucket.bannedDevices.delete(deviceId);
}

function resolveWarningKey(identity = {}) {
  const userId = String(identity.userId || "").trim();
  const deviceId = String(identity.deviceId || "").trim();
  const userToken = String(identity.userToken || "").trim();
  return userId || deviceId || userToken;
}

function resolveAlertKeys(identity = {}) {
  return Array.from(new Set([
    String(identity.userToken || "").trim(),
    String(identity.userId || "").trim(),
    String(identity.deviceId || "").trim(),
    resolveWarningKey(identity)
  ].filter(Boolean)));
}

function pushAlertForIdentity(identity = {}, alert = {}) {
  const normalized = {
    id: String(alert.id || randomUUID()),
    type: String(alert.type || "info"),
    message: String(alert.message || ""),
    metadata: alert.metadata && typeof alert.metadata === "object" && !Array.isArray(alert.metadata)
      ? { ...alert.metadata }
      : {},
    at: Number(alert.at || Date.now())
  };
  resolveAlertKeys(identity).forEach((key) => {
    const queue = state.pendingAlerts.get(key) || [];
    if (!queue.some((item) => String(item?.id || "") === normalized.id)) queue.push(normalized);
    state.pendingAlerts.set(key, queue.slice(-100));
  });
  savePersistentState();
  return normalized;
}

function listAlerts(identity = {}) {
  const alertsById = new Map();
  resolveAlertKeys(identity).forEach((key) => {
    const queue = state.pendingAlerts.get(key) || [];
    queue.forEach((alert) => alertsById.set(
      String(alert?.id || `${alert?.type}:${alert?.message}:${alert?.at}`),
      alert
    ));
  });
  return [...alertsById.values()].sort((a, b) => Number(a.at || 0) - Number(b.at || 0));
}

function updateAlert(identity = {}, alertId = "", metadataPatch = {}) {
  const id = String(alertId || "").trim();
  if (!id || !metadataPatch || typeof metadataPatch !== "object" || Array.isArray(metadataPatch)) return false;
  let updated = false;
  resolveAlertKeys(identity).forEach((key) => {
    const queue = state.pendingAlerts.get(key) || [];
    queue.forEach((alert) => {
      if (String(alert?.id || "") !== id) return;
      alert.metadata = { ...(alert.metadata || {}), ...metadataPatch };
      updated = true;
    });
  });
  if (updated) savePersistentState();
  return updated;
}

function clearAlert(identity = {}, alertId = "") {
  const id = String(alertId || "").trim();
  if (!id) return false;
  let cleared = false;
  resolveAlertKeys(identity).forEach((key) => {
    const queue = state.pendingAlerts.get(key) || [];
    const next = queue.filter((alert) => String(alert?.id || "") !== id);
    if (next.length === queue.length) return;
    cleared = true;
    if (next.length) state.pendingAlerts.set(key, next);
    else state.pendingAlerts.delete(key);
  });
  if (cleared) savePersistentState();
  return cleared;
}

function clearAlerts(identity = {}) {
  let cleared = 0;
  resolveAlertKeys(identity).forEach((key) => {
    cleared += (state.pendingAlerts.get(key) || []).length;
    state.pendingAlerts.delete(key);
  });
  if (cleared) savePersistentState();
  return cleared;
}

// Kept for compatibility with older route code. Fetching alerts is deliberately
// non-destructive; only the explicit clear endpoints remove them.
function consumeAlerts(identity = {}) {
  return listAlerts(identity);
}

function isDeletedMessage(messageId) {
  const key = String(messageId || "").trim();
  if (!key) return false;
  return state.deletedMessages.has(key);
}

function getDeletedMessage(messageId) {
  const key = String(messageId || "").trim();
  if (!key) return null;
  return state.deletedMessages.get(key) || null;
}

function deleteMessageById(messageId, meta = {}) {
  const key = String(messageId || "").trim();
  if (!key) return null;
  const deleted = {
    deleted: true,
    deletedAt: Date.now(),
    deletedByRole: String(meta.deletedByRole || "").toLowerCase() || "user",
    deletedByName: String(meta.deletedByName || "").trim() || "user",
    deletedByUserId: String(meta.deletedByUserId || "").trim() || null,
    deletedBySelf: !!meta.deletedBySelf
  };
  state.deletedMessages.set(key, deleted);
  return deleted;
}

function clearRoomMessages(room = "", meta = {}) {
  const key = String(room || "").trim().toLowerCase();
  if (!key) return null;
  const cleared = {
    room: key,
    clearedAt: Date.now(),
    clearedByRole: String(meta.clearedByRole || "").toLowerCase() || "owner",
    clearedByName: String(meta.clearedByName || "").trim() || "owner",
    clearedByUserId: String(meta.clearedByUserId || "").trim() || null,
    reason: String(meta.reason || "").trim() || null
  };
  state.clearedRooms.set(key, cleared);
  savePersistentState();
  return cleared;
}

function getRoomClearMeta(room = "") {
  const key = String(room || "").trim().toLowerCase();
  if (!key) return null;
  return state.clearedRooms.get(key) || null;
}

function setRoomEffect(room = "", meta = {}) {
  const key = String(room || "").trim().toLowerCase();
  if (!key) return null;

  const effectId = String(meta.effectId || "none").trim().toLowerCase() || "none";
  const activatedAt = Number(meta.activatedAt || Date.now());
  const durationMs = Math.max(0, Number(meta.durationMs || 0));
  const roomEffect = {
    room: key,
    effectId,
    triggeredByUserId: String(meta.triggeredByUserId || "").trim() || null,
    triggeredByName: String(meta.triggeredByName || "").trim() || "Unknown",
    triggeredByUsername: String(meta.triggeredByUsername || "").trim() || null,
    price: Math.max(0, Number(meta.price || 0)),
    activatedAt,
    durationMs,
    expiresAt: durationMs > 0 ? activatedAt + durationMs : null
  };

  state.roomEffects.set(key, roomEffect);
  savePersistentState();
  return roomEffect;
}

function clearRoomEffect(room = "") {
  const key = String(room || "").trim().toLowerCase();
  if (!key) return false;
  const deleted = state.roomEffects.delete(key);
  if (deleted) savePersistentState();
  return deleted;
}

function getRoomEffect(room = "") {
  const key = String(room || "").trim().toLowerCase();
  if (!key) return null;
  const roomEffect = state.roomEffects.get(key) || null;
  if (!roomEffect) return null;
  const expiresAt = Number(roomEffect.expiresAt || 0);
  if (expiresAt > 0 && expiresAt <= Date.now()) {
    state.roomEffects.delete(key);
    savePersistentState();
    return null;
  }
  return roomEffect;
}

function normalizeRoomSettings(settings = {}) {
  return {
    backgroundImage: String(settings?.backgroundImage || "").trim()
  };
}

function getRoomSettings(room = "") {
  const key = String(room || "").trim().toLowerCase();
  if (!key) return normalizeRoomSettings();
  return normalizeRoomSettings(state.roomSettings.get(key) || {});
}

function setRoomSettings(room = "", settings = {}) {
  const key = String(room || "").trim().toLowerCase();
  if (!key) return null;
  const next = normalizeRoomSettings({
    ...getRoomSettings(key),
    ...settings
  });
  if (!next.backgroundImage) {
    state.roomSettings.delete(key);
    savePersistentState();
    return normalizeRoomSettings();
  }
  state.roomSettings.set(key, next);
  savePersistentState();
  return next;
}

function moderateDisplayName(name = "") {
  const raw = String(name || "").trim();
  const fallback = `guest_${Math.random().toString(36).slice(2, 7)}`;
  if (!raw) {
    return { allowed: false, sanitized: fallback, reason: "Empty nickname" };
  }

  const lower = raw.toLowerCase();
  if (hasSevereHateSpeech(raw)) {
    return { allowed: false, sanitized: fallback, reason: "Racist content in nickname" };
  }
  if (useBlockedWords && getMatchedBlockedWord(raw)) {
    return { allowed: false, sanitized: fallback, reason: "Blocked term in nickname" };
  }
  if (/(kill|murder|doxx|swat|kys|suicide|rape|pedo)/i.test(lower)) {
    return { allowed: false, sanitized: fallback, reason: "Unsafe nickname content" };
  }
  const clamped = raw.slice(0, 24);
  return { allowed: true, sanitized: clamped, reason: null };
}

function addWarning(identity = {}) {
  const userToken = String(identity.userToken || "").trim();
  const userId = String(identity.userId || "").trim();
  const deviceId = String(identity.deviceId || "").trim();
  const key = userId || deviceId || userToken;
  if (!key) return { warnings: 0, limit: warningLimit, banned: false };

  const current = Number(state.warningsByUser.get(key) || 0) + 1;
  state.warningsByUser.set(key, current);

  const shouldBan = current >= warningLimit && !isOwnerIdentity(identity);
  if (shouldBan) {
    banIdentity({ userToken, userId, deviceId });
  }

  return {
    warnings: current,
    limit: warningLimit,
    banned: shouldBan,
    key
  };
}

function clearWarnings(identity = {}) {
  const keys = [
    String(identity.userToken || "").trim(),
    String(identity.userId || "").trim(),
    String(identity.deviceId || "").trim(),
    resolveWarningKey(identity)
  ].filter(Boolean);
  const uniqueKeys = Array.from(new Set(keys));
  uniqueKeys.forEach((key) => state.warningsByUser.delete(key));
  return { clearedKeys: uniqueKeys.length };
}

function applyManualWarning(identity = {}, reason = "Moderator warning") {
  const result = addWarning(identity);
  const text = result.banned
    ? `You were warned (${result.warnings}/${result.limit}) and are now banned. ${BAN_APPEAL_TEXT}`
    : `You were warned by moderation (${result.warnings}/${result.limit}). Reason: ${reason}`;
  pushAlertForIdentity(identity, {
    type: result.banned ? "ban" : "warn",
    message: text
  });
  return result;
}

function checkCooldown(userToken, options = {}) {
  const key = String(userToken || "").trim();
  const room = String(options.room || "").trim().toLowerCase();
  const effective = getEffectiveSlowmodeMs(room, { excludeGlobal: !!options.excludeGlobal });
  const cooldownMs = effective.slowmodeMs;
  const cooldownKey = `${key}:${effective.scope}:${effective.room || "global"}`;
  if (!key) return { blocked: false, retryAfterMs: 0, cooldownMs };
  if (!cooldownMs) return { blocked: false, retryAfterMs: 0, cooldownMs, scope: effective.scope };

  const now = Date.now();
  const lastAt = Number(state.cooldownByUser.get(cooldownKey) || 0);
  const delta = now - lastAt;
  if (lastAt && delta < cooldownMs) {
    return {
      blocked: true,
      retryAfterMs: cooldownMs - delta,
      cooldownMs,
      scope: effective.scope
    };
  }

  state.cooldownByUser.set(cooldownKey, now);
  return { blocked: false, retryAfterMs: 0, cooldownMs, scope: effective.scope };
}

function buildAiResponse(siteId, prompt) {
  const site = (network.sites || []).find((s) => s.id === siteId) || null;
  const aiName = site?.aiName || `${site?.name || "Network"} AI`;
  const text = String(prompt || "").trim();
  if (!text) {
    return `${aiName}: Please provide a prompt.`;
  }
  return `${aiName}: ${text.slice(0, 280)} | suggestion: keep chat respectful and on-topic.`;
}

function ruleModerateText(body = "") {
  const text = String(body || "").trim();
  const lower = text.toLowerCase();
  const normalized = normalizeModerationText(text);
  const reasons = [];
  const suggestions = [];

  if (hasSevereHateSpeech(text)) {
    reasons.push("Racist hate speech detected");
    suggestions.push("Remove racist content.");
  }

  if (useBlockedWords) {
    const blocked = getMatchedBlockedWord(text);
    if (blocked) {
      reasons.push(`Contains blocked term: "${blocked}"`);
      suggestions.push("Remove blocked terms and retry.");
    }
  }

  if (blockLinksByDefault && /https?:\/\/\S+/i.test(text)) {
    reasons.push("Contains external link");
    suggestions.push("Avoid posting links unless trusted.");
  }

  if (/(.)\1{15,}/.test(text) || text.length > 2000) {
    reasons.push("Looks like spam/flood");
    suggestions.push("Shorten the message and avoid repetitive characters.");
  }

  if (/\b(i\s*will|i'?m\s+going\s+to|im\s+going\s+to|imma|gonna)\s+(kill|murder|shoot|stab|doxx|swat|bomb)\s+(you|u|him|her|them)\b/i.test(lower) ||
      /\b(?:iwill|imgoingto|imgonnato|imma|gonna)(?:kill|murder|shoot|stab|doxx|swat|bomb)(?:you|u|him|her|them)\b/i.test(normalized.compact)) {
    reasons.push("Credible threat detected");
    suggestions.push("Do not threaten other people.");
  }

  if (/\b(kys|kill yourself|hang yourself|slit your wrists)\b/i.test(lower) ||
      /\b(?:kys|killyourself|hangyourself|slityourwrists|commitsuicide)\b/i.test(normalized.compact)) {
    reasons.push("Self-harm encouragement detected");
    suggestions.push("Do not post self-harm encouragement.");
  }

  if (/\b(credit card|cvv|ssn|social security|seed phrase|wallet phrase|private key)\b/i.test(lower) ||
      /\b(?:creditcard|cvv|ssn|socialsecurity|seedphrase|walletphrase|privatekey)\b/i.test(normalized.compact)) {
    reasons.push("Sensitive credential/scam-like content detected");
    suggestions.push("Do not request or share sensitive credentials.");
  }

  if (/\b(pedophile|pedo|child porn|cp|sexual minor|minor sexual)\b/i.test(lower) ||
      /\b(?:pedophile|pedo|childporn|sexualminor|minorsexual)\b/i.test(normalized.compact)) {
    reasons.push("Minor sexual exploitation content detected");
    suggestions.push("Remove exploitative sexual content involving minors.");
  }

  if (/\b(?:porn(?:ography|ographic)?|hentai|nsfw|xxx|nudes?|explicit\s+sex(?:ual)?(?:\s+content)?|sex\s+tape|onlyfans\s+leaks?)\b/i.test(lower) ||
      /(?:pornography|pornographic|porn|hentai|nsfw|xxx|nudes?|explicitsexualcontent|sextape|onlyfansleaks?)/i.test(normalized.compact)) {
    reasons.push("Pornographic or explicit sexual content detected");
    suggestions.push("Remove pornographic or explicit sexual content.");
  }

  if (looksLikeAddress(text)) {
    reasons.push("Potential personal address/doxxing content detected");
    suggestions.push("Do not share street addresses or location-identifying personal info.");
  }

  const severity = reasons.length === 0 ? "low" : reasons.length >= 2 ? "high" : "medium";
  const allowed = reasons.length === 0;

  return {
    allowed,
    severity,
    reasons,
    suggestions,
    rewritten: allowed ? text : "Please rewrite your message to follow moderation rules."
  };
}

async function aiModerateText(body = "") {
  const text = String(body || "").trim();
  if (!text) {
    return {
      allowed: false,
      severity: "low",
      reasons: ["Empty message"],
      suggestions: ["Write a non-empty message."],
      rewritten: ""
    };
  }

  // Deterministic safety rules are authoritative and should reject known
  // blocked content before waiting on the remote classifier. This also keeps
  // optimistic chat messages from lingering while an obvious block is checked.
  const rulesVerdict = ruleModerateText(text);
  if (!rulesVerdict.allowed) {
    return {
      ...rulesVerdict,
      rewritten: "Message blocked by moderation. Rewrite it in a safer way."
    };
  }

  if (!geminiApiKey) {
    return rulesVerdict;
  }

  const prompt = [
    moderationSystemPrompt,
    moderationExamples,
    "Return ONLY valid JSON with keys:",
    "allowed (boolean), severity (low|medium|high), reasons (string[]), suggestions (string[]), rewritten (string).",
    "Base your decision on intent, context, and potential harm.",
    "No markdown, no prose, JSON only.",
    `Message: ${text}`
  ].join("\n");

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiApiKey}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 300
        }
      },
      {
        timeout: 8000
      }
    );

    const raw =
      response?.data?.candidates?.[0]?.content?.parts
        ?.map((p) => p?.text || "")
        .join(" ") || "";

    const jsonText = raw
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```$/i, "")
      .trim();

    const parsed = JSON.parse(jsonText);
    const aiVerdict = {
      allowed: !!parsed.allowed,
      severity: normalizeSeverity(parsed.severity),
      reasons: Array.isArray(parsed.reasons) ? parsed.reasons.map(String) : [],
      suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions.map(String) : [],
      rewritten: typeof parsed.rewritten === "string" ? parsed.rewritten : text
    };
    if (hasSevereHateSpeech(text)) {
      return {
        allowed: false,
        severity: "high",
        reasons: ["Racist hate speech detected"],
        suggestions: ["Remove racist content."],
        rewritten: "Message blocked by moderation."
      };
    }
    const languageOnlyBlock = !aiVerdict.allowed && aiVerdict.reasons.length > 0 && aiVerdict.reasons.every((reason) => {
      const value = String(reason || "").toLowerCase();
      const isProfanityOrInsult = /(profan|insult|swear|curse|harass|abusive|offensive)/i.test(value);
      const isSafetyOrRacism = /(racis|racial|hate|protected|threat|viol|dox|address|self-harm|suicide|credential|scam|phish|sexual|minor|spam|flood)/i.test(value);
      return isProfanityOrInsult && !isSafetyOrRacism;
    });
    if (languageOnlyBlock) {
      aiVerdict.allowed = true;
      aiVerdict.severity = "low";
      aiVerdict.reasons = [];
      aiVerdict.suggestions = [];
      aiVerdict.rewritten = text;
    }
    const criticalAiReasons = aiVerdict.reasons.filter(isCriticalModerationReason);
    if (!aiVerdict.allowed && criticalAiReasons.length === 0) {
      aiVerdict.allowed = true;
      aiVerdict.severity = "low";
      aiVerdict.reasons = [];
      aiVerdict.suggestions = [];
      aiVerdict.rewritten = text;
    }
    if (!strictMode) {
      const shouldBlock = !rulesVerdict.allowed || criticalAiReasons.length > 0;
      return {
        allowed: !shouldBlock,
        severity: shouldBlock
          ? (severityRank[aiVerdict.severity] >= severityRank[rulesVerdict.severity] ? aiVerdict.severity : rulesVerdict.severity)
          : "low",
        reasons: shouldBlock ? mergeUniqueStrings(criticalAiReasons, rulesVerdict.reasons) : [],
        suggestions: shouldBlock ? mergeUniqueStrings(aiVerdict.suggestions, rulesVerdict.suggestions) : [],
        rewritten: shouldBlock ? "Message blocked by moderation. Rewrite it in a safer way." : text
      };
    }

    const mergedSeverity =
      severityRank[aiVerdict.severity] >= severityRank[rulesVerdict.severity]
        ? aiVerdict.severity
        : rulesVerdict.severity;
    const mergedReasons = mergeUniqueStrings(aiVerdict.reasons, rulesVerdict.reasons);
    const mergedSuggestions = mergeUniqueStrings(aiVerdict.suggestions, rulesVerdict.suggestions);
    const blockedByRules = !rulesVerdict.allowed;
    const criticalMergedReasons = mergedReasons.filter(isCriticalModerationReason);
    const blockedBySeverity = criticalMergedReasons.length > 0 && shouldBlockBySeverity(mergedSeverity);
    const shouldBlock = blockedByRules || criticalMergedReasons.length > 0 || blockedBySeverity;

    return {
      allowed: !shouldBlock,
      severity: mergedSeverity,
      reasons: shouldBlock ? mergeUniqueStrings(criticalMergedReasons, rulesVerdict.reasons) : [],
      suggestions: mergedSuggestions,
      rewritten: shouldBlock
        ? "Message blocked by moderation. Rewrite it in a safer, non-harmful way."
        : aiVerdict.rewritten
    };
  } catch (_error) {
    const fallback = ruleModerateText(text);
    if (!strictMode) return fallback.allowed ? fallback : {
      ...fallback,
      allowed: false,
      rewritten: "Message blocked by moderation. Rewrite it in a safer way."
    };
    if (shouldBlockBySeverity(fallback.severity)) {
      return {
        ...fallback,
        allowed: false,
        rewritten: "Message blocked by moderation. Rewrite it in a safer, non-harmful way."
      };
    }
    return fallback;
  }
}

module.exports = {
  getModeration,
  setModeration,
  isBlockedWord,
  getMatchedBlockedWord,
  isMutedUser,
  isBannedUser,
  isBannedAccount,
  isBannedDevice,
  isIdentityBannedInRoom,
  isIdentityBanned,
  banIdentity,
  banIdentityInRoom,
  unbanIdentity,
  unbanIdentityInRoom,
  resolveWarningKey,
  pushAlertForIdentity,
  listAlerts,
  updateAlert,
  clearAlert,
  clearAlerts,
  consumeAlerts,
  isDeletedMessage,
  getDeletedMessage,
  deleteMessageById,
  clearRoomMessages,
  getRoomClearMeta,
  setRoomEffect,
  clearRoomEffect,
  getRoomEffect,
  getRoomSettings,
  setRoomSettings,
  moderateDisplayName,
  addWarning,
  clearWarnings,
  applyManualWarning,
  getSlowmodeMs,
  setSlowmodeMs,
  getRoomSlowmodeMs,
  setRoomSlowmodeMs,
  getEffectiveSlowmodeMs,
  checkCooldown,
  buildAiResponse,
  moderateText: aiModerateText,
  moderateTextRules: ruleModerateText
};
