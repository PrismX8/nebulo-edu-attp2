const network = require("../../config/networkSites");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

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
  roomBans: new Map(),
  deletedMessages: new Map(),
  clearedRooms: new Map(),
  roomEffects: new Map(),
  warningsByUser: new Map(),
  cooldownByUser: new Map(),
  pendingAlerts: new Map()
};

function savePersistentState() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const payload = {
      clearedRooms: Object.fromEntries(state.clearedRooms.entries()),
      roomEffects: Object.fromEntries(state.roomEffects.entries())
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
  } catch (_err) {
  }
}

loadPersistentState();
const warningLimit = Number(process.env.MOD_WARNING_LIMIT || 3);
const cooldownMs = Number(process.env.MOD_COOLDOWN_MS || 5000);
const useBlockedWords = String(process.env.MOD_USE_BLOCKED_WORDS || "false").toLowerCase() === "true";
const strictMode = String(process.env.MOD_STRICT_MODE || "true").toLowerCase() === "true";
const strictMinSeverity = String(process.env.MOD_STRICT_MIN_SEVERITY || "medium").toLowerCase();
const blockLinksByDefault = String(process.env.MOD_BLOCK_LINKS || "false").toLowerCase() === "true";
const profanityMaxCount = Number(process.env.MOD_PROFANITY_MAX_COUNT || 3);
const profanityMaxRatio = Number(process.env.MOD_PROFANITY_MAX_RATIO || 0.3);
const geminiApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "";
const geminiModel = process.env.GEMINI_MODEL || "gemini-1.5-flash";
const moderationSystemPrompt = process.env.MODERATION_SYSTEM_PROMPT || [
  "You are a very strict realtime chat safety moderator.",
  "Allow clearly safe conversation, jokes, harmless slang, and limited mild profanity without threats.",
  "Block content that is harmful, abusive, threatening, hateful, explicit sexual content involving minors, doxxing, self-harm encouragement, or dangerous instructions intended to cause harm.",
  "Also block clear spam/flooding, malicious scam/phishing attempts, and coercive manipulation.",
  "Excessive profanity (repeated profanity-heavy messages) should be blocked.",
  "When uncertain, choose safety and mark as blocked with medium or high severity.",
  "Decide based on overall intent and risk, not keywords alone."
].join(" ");
const moderationExamples = [
  'Example allow 1: message="that game was wild lol" => {"allowed":true,"severity":"low","reasons":[],"suggestions":[],"rewritten":"that game was wild lol"}',
  'Example allow 2: message="this is fucking crazy" (not directed at a person) => {"allowed":true,"severity":"low","reasons":[],"suggestions":[],"rewritten":"this is fucking crazy"}',
  'Example block 1: message="you are a dumb bitch" => {"allowed":false,"severity":"high","reasons":["Directed harassment/profanity"],"suggestions":["Remove insults targeted at a person."],"rewritten":"Please rewrite respectfully."}',
  'Example block 2: message="537 cherryhill road" => {"allowed":false,"severity":"high","reasons":["Potential personal address/doxxing content detected"],"suggestions":["Do not share street addresses or personal location info."],"rewritten":"Please remove address-like personal information."}',
  'Example block 3: message="kill yourself" => {"allowed":false,"severity":"high","reasons":["Self-harm encouragement detected"],"suggestions":["Do not encourage self-harm."],"rewritten":"Please remove harmful language."}',
  'Example block 4: message containing n-word variants => {"allowed":false,"severity":"high","reasons":["Severe hate speech/slur detected"],"suggestions":["Remove slurs and rewrite respectfully."],"rewritten":"Message blocked by moderation."}'
].join("\n");
const severeHatePatterns = [
  /\bn[\W_]*i[\W_]*g[\W_]*g[\W_]*e[\W_]*r\b/i,
  /\bn[\W_]*i[\W_]*g[\W_]*g[\W_]*a\b/i,
  /\bn[\W_]*i[\W_]*g[\W_]*a\b/i
];
const profanityWords = [
  "fuck",
  "fucking",
  "shit",
  "bitch",
  "asshole",
  "damn",
  "motherfucker",
  "wtf"
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
  return severeHatePatterns.some((rx) => rx.test(String(text)));
}

const severityRank = { low: 1, medium: 2, high: 3 };
function normalizeSeverity(sev) {
  return ["low", "medium", "high"].includes(sev) ? sev : "medium";
}

function shouldBlockBySeverity(severity) {
  const min = normalizeSeverity(strictMinSeverity);
  return severityRank[normalizeSeverity(severity)] >= severityRank[min];
}

function mergeUniqueStrings(listA = [], listB = []) {
  return Array.from(
    new Set([...(Array.isArray(listA) ? listA : []), ...(Array.isArray(listB) ? listB : [])].map((v) => String(v).trim()).filter(Boolean))
  );
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
    bannedDevices: asArray(state.bannedDevices)
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

  return getModeration();
}

function isBlockedWord(body = "") {
  const lower = String(body).toLowerCase();
  return asArray(state.blockedWords).some((w) => lower.includes(w));
}

function getMatchedBlockedWord(body = "") {
  const lower = String(body).toLowerCase();
  return asArray(state.blockedWords).find((w) => lower.includes(w)) || null;
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
  return (
    isBannedUser(identity.userToken) ||
    isBannedAccount(identity.userId) ||
    isBannedDevice(identity.deviceId)
  );
}

function banIdentity(identity = {}) {
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

function pushAlertForIdentity(identity = {}, alert = {}) {
  const keys = [
    String(identity.userToken || "").trim(),
    String(identity.userId || "").trim(),
    String(identity.deviceId || "").trim(),
    resolveWarningKey(identity)
  ].filter(Boolean);

  const uniqueKeys = Array.from(new Set(keys));
  uniqueKeys.forEach((key) => {
    const queue = state.pendingAlerts.get(key) || [];
    queue.push({
      type: String(alert.type || "info"),
      message: String(alert.message || ""),
      at: Date.now()
    });
    state.pendingAlerts.set(key, queue);
  });
}

function consumeAlerts(identity = {}) {
  const keys = [
    String(identity.userToken || "").trim(),
    String(identity.userId || "").trim(),
    String(identity.deviceId || "").trim(),
    resolveWarningKey(identity)
  ].filter(Boolean);
  const uniqueKeys = Array.from(new Set(keys));
  const out = [];
  uniqueKeys.forEach((key) => {
    const queue = state.pendingAlerts.get(key) || [];
    if (queue.length) {
      out.push(...queue);
      state.pendingAlerts.delete(key);
    }
  });
  return out.sort((a, b) => Number(a.at || 0) - Number(b.at || 0));
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
  const roomEffect = {
    room: key,
    effectId,
    triggeredByUserId: String(meta.triggeredByUserId || "").trim() || null,
    triggeredByName: String(meta.triggeredByName || "").trim() || "Unknown",
    triggeredByUsername: String(meta.triggeredByUsername || "").trim() || null,
    price: Math.max(0, Number(meta.price || 0)),
    activatedAt: Number(meta.activatedAt || Date.now())
  };

  state.roomEffects.set(key, roomEffect);
  savePersistentState();
  return roomEffect;
}

function getRoomEffect(room = "") {
  const key = String(room || "").trim().toLowerCase();
  if (!key) return null;
  return state.roomEffects.get(key) || null;
}

function moderateDisplayName(name = "") {
  const raw = String(name || "").trim();
  const fallback = `guest_${Math.random().toString(36).slice(2, 7)}`;
  if (!raw) {
    return { allowed: false, sanitized: fallback, reason: "Empty nickname" };
  }

  const lower = raw.toLowerCase();
  const normalized = lower.replace(/[^a-z0-9]/g, "");
  if (hasSevereHateSpeech(raw)) {
    return { allowed: false, sanitized: fallback, reason: "Hate speech in nickname" };
  }
  if (useBlockedWords && getMatchedBlockedWord(raw)) {
    return { allowed: false, sanitized: fallback, reason: "Blocked term in nickname" };
  }
  if (/(kill|murder|doxx|swat|kys|suicide|rape|pedo)/i.test(lower)) {
    return { allowed: false, sanitized: fallback, reason: "Unsafe nickname content" };
  }
  if (profanityWords.some((w) => normalized.includes(w))) {
    return { allowed: false, sanitized: fallback, reason: "Profanity in nickname" };
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

  const shouldBan = current >= warningLimit;
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
    ? `You were warned (${result.warnings}/${result.limit}) and are now banned.`
    : `You were warned by moderation (${result.warnings}/${result.limit}). Reason: ${reason}`;
  pushAlertForIdentity(identity, {
    type: result.banned ? "ban" : "warn",
    message: text
  });
  return result;
}

function checkCooldown(userToken) {
  const key = String(userToken || "").trim();
  if (!key) return { blocked: false, retryAfterMs: 0, cooldownMs };

  const now = Date.now();
  const lastAt = Number(state.cooldownByUser.get(key) || 0);
  const delta = now - lastAt;
  if (lastAt && delta < cooldownMs) {
    return {
      blocked: true,
      retryAfterMs: cooldownMs - delta,
      cooldownMs
    };
  }

  state.cooldownByUser.set(key, now);
  return { blocked: false, retryAfterMs: 0, cooldownMs };
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
  const reasons = [];
  const suggestions = [];

  if (hasSevereHateSpeech(text)) {
    reasons.push("Severe hate speech/slur detected");
    suggestions.push("Remove slurs and rewrite respectfully.");
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

  if (/(.)\1{8,}/.test(text) || text.length > 1200) {
    reasons.push("Looks like spam/flood");
    suggestions.push("Shorten the message and avoid repetitive characters.");
  }

  if (/\b(kill|murder|shoot|stab|die|doxx|swat|bomb)\b/i.test(lower)) {
    reasons.push("Potentially violent/abusive language");
    suggestions.push("Rephrase without threats or harassment.");
  }

  if (/\b(kys|kill yourself|hang yourself|slit your wrists)\b/i.test(lower)) {
    reasons.push("Self-harm encouragement detected");
    suggestions.push("Do not post self-harm encouragement.");
  }

  if (/\b(credit card|cvv|ssn|social security|seed phrase|wallet phrase|private key)\b/i.test(lower)) {
    reasons.push("Sensitive credential/scam-like content detected");
    suggestions.push("Do not request or share sensitive credentials.");
  }

  if (/\b(rape|raped|pedophile|pedo|child porn|cp)\b/i.test(lower)) {
    reasons.push("Sexual abuse or exploitative content detected");
    suggestions.push("Remove exploitative or abusive sexual content.");
  }

  if (looksLikeAddress(text)) {
    reasons.push("Potential personal address/doxxing content detected");
    suggestions.push("Do not share street addresses or location-identifying personal info.");
  }

  const tokens = lower.split(/\s+/).filter(Boolean);
  const normalizedText = lower.replace(/[^a-z0-9\s]/g, " ");
  const profanityCount = tokens.reduce((count, token) => {
    const normalized = token.replace(/[^a-z]/gi, "");
    if (!normalized) return count;
    return profanityWords.includes(normalized) ? count + 1 : count;
  }, 0);
  const profanityRatio = tokens.length ? profanityCount / tokens.length : 0;
  if (profanityCount > profanityMaxCount || profanityRatio > profanityMaxRatio) {
    reasons.push("Excessive profanity detected");
    suggestions.push("Reduce profanity and keep the message readable/respectful.");
  }

  const targetsPerson =
    /\b(you|u|ur|your|yours|he|she|they|them|him|her|bro|dude|kid|noob)\b/i.test(normalizedText) ||
    /@[\w.-]+/i.test(text);
  const hasProfanity = profanityCount > 0;
  if (targetsPerson && hasProfanity) {
    reasons.push("Directed profanity/harassment detected");
    suggestions.push("Do not direct profanity at other users.");
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

  if (!geminiApiKey) {
    return ruleModerateText(text);
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
    const rulesVerdict = ruleModerateText(text);
    if (hasSevereHateSpeech(text)) {
      return {
        allowed: false,
        severity: "high",
        reasons: ["Severe hate speech/slur detected"],
        suggestions: ["Remove slurs and rewrite respectfully."],
        rewritten: "Message blocked by moderation."
      };
    }
    if (!strictMode) {
      return aiVerdict;
    }

    const mergedSeverity =
      severityRank[aiVerdict.severity] >= severityRank[rulesVerdict.severity]
        ? aiVerdict.severity
        : rulesVerdict.severity;
    const mergedReasons = mergeUniqueStrings(aiVerdict.reasons, rulesVerdict.reasons);
    const mergedSuggestions = mergeUniqueStrings(aiVerdict.suggestions, rulesVerdict.suggestions);
    const blockedByModel = !aiVerdict.allowed;
    const blockedByRules = !rulesVerdict.allowed;
    const blockedBySeverity = mergedReasons.length > 0 && shouldBlockBySeverity(mergedSeverity);
    const shouldBlock = blockedByModel || blockedByRules || blockedBySeverity;

    return {
      allowed: !shouldBlock,
      severity: mergedSeverity,
      reasons: mergedReasons,
      suggestions: mergedSuggestions,
      rewritten: shouldBlock
        ? "Message blocked by moderation. Rewrite it in a safer, non-harmful way."
        : aiVerdict.rewritten
    };
  } catch (_error) {
    const fallback = ruleModerateText(text);
    if (!strictMode) return fallback;
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
  consumeAlerts,
  isDeletedMessage,
  getDeletedMessage,
  deleteMessageById,
  clearRoomMessages,
  getRoomClearMeta,
  setRoomEffect,
  getRoomEffect,
  moderateDisplayName,
  addWarning,
  clearWarnings,
  applyManualWarning,
  checkCooldown,
  buildAiResponse,
  moderateText: aiModerateText
};
