const jwt = require("jsonwebtoken");
const netState = require("../services/network/state");

const warningCooldownByUser = new Map();
const WARNING_COOLDOWN_MS = 60_000;

const MUTATING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

function isMutatingApiRequest(req) {
  return MUTATING_METHODS.has(String(req.method || "").toUpperCase()) && String(req.path || "").startsWith("/api/");
}

function shouldSkipRequest(req) {
  const method = String(req.method || "").toUpperCase();
  const path = String(req.path || "");
  if (!isMutatingApiRequest(req)) return true;
  if (path === "/api/auth") return true;
  if (path === "/api/users" && method === "POST") return true;
  if (/^\/api\/tlk\/rooms\/[^/]+\/join$/.test(path)) return true;
  if (/^\/api\/tlk\/rooms\/[^/]+\/meta$/.test(path)) return true;
  return false;
}

function getAuthenticatedUserFromHeader(req) {
  const token = String(req.header("x-auth-token") || "").trim();
  if (!token) return null;
  try {
    const decoded = jwt.decode(token);
    const userId = decoded?.sub || decoded?.user?.id;
    if (!userId) return null;
    return { _id: userId, username: decoded?.email || userId };
  } catch (_err) {
    return null;
  }
}

function hasUiActionHeader(req) {
  const value = String(req.header("x-ubg-ui-action") || "").trim();
  return /^ui-[a-z0-9_-]{12,}$/i.test(value);
}

module.exports = function consoleActionGuard(req, res, next) {
  if (shouldSkipRequest(req) || hasUiActionHeader(req)) return next();

  const user = getAuthenticatedUserFromHeader(req);
  if (!user?._id) return next();

  const now = Date.now();
  const key = String(user._id);
  const lastWarnedAt = Number(warningCooldownByUser.get(key) || 0);
  if (now - lastWarnedAt >= WARNING_COOLDOWN_MS) {
    warningCooldownByUser.set(key, now);
    const warning = netState.applyManualWarning(
      { userId: user._id },
      "Console/API action detected. Do not run commands from DevTools."
    );
    res.setHeader(
      "x-ubg-security-warning",
      `Console/API action detected. Warning ${warning.warnings}/${warning.limit}.`
    );
    console.warn(`Console/API action warning for ${user.username || user._id}: ${req.method} ${req.path}`);
  }

  return next();
};
