const crypto = require("crypto");

const buckets = new Map();
const CLEANUP_EVERY_MS = 60_000;
let lastCleanupAt = Date.now();

function getClientIp(req) {
  const forwarded = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim();
  return forwarded || req.socket?.remoteAddress || req.ip || "unknown";
}

function cleanupBuckets(now = Date.now()) {
  if (now - lastCleanupAt < CLEANUP_EVERY_MS) return;
  lastCleanupAt = now;
  for (const [key, bucket] of buckets.entries()) {
    if (!bucket || Number(bucket.resetAt || 0) <= now) buckets.delete(key);
  }
}

function rateLimit(options = {}) {
  const windowMs = Math.max(1000, Number(options.windowMs || 60_000));
  const max = Math.max(1, Number(options.max || 60));
  const prefix = String(options.prefix || "rl");
  const keyGenerator = typeof options.keyGenerator === "function"
    ? options.keyGenerator
    : (req) => getClientIp(req);
  const skip = typeof options.skip === "function" ? options.skip : () => false;

  return (req, res, next) => {
    if (skip(req)) return next();
    const now = Date.now();
    cleanupBuckets(now);
    const rawKey = `${prefix}:${keyGenerator(req) || "unknown"}`;
    const key = crypto.createHash("sha256").update(rawKey).digest("hex");
    let bucket = buckets.get(key);
    if (!bucket || bucket.resetAt <= now) {
      bucket = { count: 0, resetAt: now + windowMs };
      buckets.set(key, bucket);
    }
    bucket.count += 1;

    const remaining = Math.max(0, max - bucket.count);
    res.setHeader("RateLimit-Limit", String(max));
    res.setHeader("RateLimit-Remaining", String(remaining));
    res.setHeader("RateLimit-Reset", String(Math.ceil(bucket.resetAt / 1000)));

    if (bucket.count > max) {
      const retryAfter = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));
      res.setHeader("Retry-After", String(retryAfter));
      return res.status(429).json({ msg: "Too many requests. Try again shortly." });
    }
    return next();
  };
}

function securityHeaders(req, res, next) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("X-DNS-Prefetch-Control", "off");
  res.setHeader("Cross-Origin-Resource-Policy", "same-origin");
  res.setHeader("Permissions-Policy", "camera=(), geolocation=(), payment=(), usb=(), microphone=(self)");
  res.setHeader(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https:",
      "media-src 'self' data: blob:",
      "connect-src 'self' http://localhost:* http://127.0.0.1:* ws://localhost:* ws://127.0.0.1:*",
      "object-src 'none'",
      "base-uri 'self'",
      "frame-ancestors 'none'"
    ].join("; ")
  );
  return next();
}

function socketRateLimit(socket, eventName, options = {}) {
  const windowMs = Math.max(1000, Number(options.windowMs || 10_000));
  const max = Math.max(1, Number(options.max || 30));
  const userId = socket?.data?.user?.id || socket?.data?.user?._id || socket?.id || "anonymous";
  const rawKey = `socket:${eventName}:${userId}`;
  const key = crypto.createHash("sha256").update(rawKey).digest("hex");
  const now = Date.now();
  cleanupBuckets(now);
  let bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    bucket = { count: 0, resetAt: now + windowMs };
    buckets.set(key, bucket);
  }
  bucket.count += 1;
  return bucket.count <= max;
}

module.exports = {
  getClientIp,
  securityHeaders,
  socketRateLimit,
  globalRateLimit: rateLimit({ prefix: "global", windowMs: 5 * 60_000, max: 900 }),
  authRateLimit: rateLimit({ prefix: "auth", windowMs: 10 * 60_000, max: 30 }),
  accountCreateRateLimit: rateLimit({ prefix: "account-create", windowMs: 60 * 60_000, max: 8 }),
  writeRateLimit: rateLimit({ prefix: "write", windowMs: 60_000, max: 120 }),
  chatRoomRateLimit: rateLimit({ prefix: "chat-room", windowMs: 30_000, max: 240 }),
  chatWriteRateLimit: rateLimit({ prefix: "chat-write", windowMs: 30_000, max: 35 }),
  voiceRateLimit: rateLimit({ prefix: "voice", windowMs: 60_000, max: 120 }),
  adminActionRateLimit: rateLimit({ prefix: "admin-action", windowMs: 60_000, max: 60 }),
  rateLimit
};
