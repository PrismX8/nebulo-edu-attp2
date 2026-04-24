const express = require("express");
const network = require("../config/networkSites");
const netState = require("../services/network/state");
const presence = require("../services/network/presence");
const auth = require("../middleware/auth");
const userStore = require("../services/auth/localStore");
const identityStore = require("../services/network/identity");

const router = express.Router();

router.get("/sites", (_req, res) => {
  res.json({
    globalRoom: network.globalRoom,
    localSiteId: network.localSiteId,
    sites: network.sites
  });
});

router.get("/moderation", (_req, res) => {
  res.json(netState.getModeration());
});

router.put("/moderation", auth, (req, res) => {
  const caller = userStore.findById(req.user.id);
  const role = String(caller?.role || "").toLowerCase();
  if (!caller) return res.status(401).json({ msg: "User not found" });
  if (!["owner", "admin"].includes(role)) {
    return res.status(403).json({ msg: "Not authorized" });
  }
  const updated = netState.setModeration(req.body || {});
  res.json(updated);
});

router.get("/presence", (_req, res) => {
  try {
    return res.json(presence.getCounts());
  } catch (_error) {
    return res.json({ ttlMs: 30000, rooms: {} });
  }
});

router.post("/ai/summon", (req, res) => {
  const siteId = String(req.body?.siteId || "").trim().toLowerCase();
  const prompt = String(req.body?.prompt || "").trim();
  if (!siteId) {
    return res.status(400).json({ msg: "siteId is required" });
  }

  const response = netState.buildAiResponse(siteId, prompt);
  return res.json({
    siteId,
    response
  });
});

router.post("/moderate", async (req, res) => {
  const text = String(req.body?.text || "").trim();
  if (!text) {
    return res.status(400).json({ msg: "text is required" });
  }

  try {
    const decision = await netState.moderateText(text);
    return res.json(decision);
  } catch (error) {
    return res.status(500).json({ msg: error?.message || "moderation failed" });
  }
});

function resolveTargetIdentity(target = "") {
  const raw = String(target || "").trim();
  if (!raw) return null;

  const lower = raw.toLowerCase();
  if (lower.startsWith("token:")) {
    const userToken = raw.slice("token:".length).trim();
    const profile = identityStore.getByToken(userToken);
    return {
      identity: {
        userToken,
        userId: profile?.userId || null,
        deviceId: null
      },
      targetDisplay: profile?.name || profile?.username || userToken
    };
  }
  if (lower.startsWith("user:")) {
    const ident = raw.slice("user:".length).trim();
    const user = userStore.findById(ident) || userStore.findByUsername(ident);
    if (!user) return null;
    const safe = userStore.sanitizeUser(user);
    return {
      identity: {
        userToken: null,
        userId: user._id,
        deviceId: null
      },
      targetDisplay: safe?.name || safe?.username || ident
    };
  }
  if (lower.startsWith("device:")) {
    const deviceId = raw.slice("device:".length).trim();
    return {
      identity: {
        userToken: null,
        userId: null,
        deviceId
      },
      targetDisplay: `device:${deviceId}`
    };
  }

  const byUsername = userStore.findByUsername(raw);
  if (byUsername) {
    const safe = userStore.sanitizeUser(byUsername);
    return {
      identity: {
        userToken: null,
        userId: byUsername._id,
        deviceId: null
      },
      targetDisplay: safe?.name || safe?.username || raw
    };
  }

  const byToken = identityStore.getByToken(raw);
  if (byToken) {
    return {
      identity: {
        userToken: raw,
        userId: byToken?.userId || null,
        deviceId: null
      },
      targetDisplay: byToken?.name || byToken?.username || raw
    };
  }

  return null;
}

router.post("/mod/actions", auth, (req, res) => {
  const caller = userStore.findById(req.user.id);
  const role = String(caller?.role || "").toLowerCase();
  if (!caller) return res.status(401).json({ msg: "User not found" });
  if (!["owner", "admin"].includes(role)) {
    return res.status(403).json({ msg: "Not authorized" });
  }

  const action = String(req.body?.action || "").trim().toLowerCase();
  const target = String(req.body?.target || "").trim();
  const reason = String(req.body?.reason || "Moderator action").trim();
  const room = String(req.body?.room || "").trim().toLowerCase();
  if (!["warn", "ban", "banfromall", "unban", "clearwarns", "clearchat"].includes(action)) {
    return res.status(400).json({ msg: "Invalid action" });
  }
  if (action !== "clearchat" && !target) {
    return res.status(400).json({ msg: "target is required" });
  }

  if (action === "clearchat") {
    if (role !== "owner") {
      return res.status(403).json({ msg: "Only owner can use /clearchat" });
    }
    if (!room) {
      return res.status(400).json({ msg: "room is required for /clearchat" });
    }
    const cleared = netState.clearRoomMessages(room, {
      clearedByRole: "owner",
      clearedByName: String(caller.name || caller.username || "owner"),
      clearedByUserId: String(caller._id || ""),
      reason
    });
    return res.json({ ok: true, action, room, cleared });
  }

  const resolved = resolveTargetIdentity(target);
  if (!resolved) {
    return res.status(404).json({ msg: "Target not found. Use username or token:<id>." });
  }
  const identity = resolved.identity;
  const targetDisplay = resolved.targetDisplay;
  const targetUser = identity?.userId ? userStore.findById(identity.userId) : null;
  const targetRole = String(targetUser?.role || "").toLowerCase();
  const callerPrivileged = ["owner", "admin"].includes(role);
  const targetPrivileged = ["owner", "admin"].includes(targetRole);
  if (callerPrivileged && targetPrivileged && ["warn", "ban", "banfromall"].includes(action)) {
    return res.status(403).json({ msg: "Owners/Admins cannot warn or ban each other." });
  }

  if (action === "warn") {
    const warning = netState.applyManualWarning(identity, reason);
    return res.json({
      ok: true,
      action,
      warning,
      identity,
      targetDisplay
    });
  }

  if (action === "ban") {
    if (!room) {
      return res.status(400).json({ msg: "room is required for /ban" });
    }
    netState.banIdentityInRoom(identity, room);
    netState.pushAlertForIdentity(identity, {
      type: "ban",
      message: `You have been banned from "${room}" by moderation. Reason: ${reason}`
    });
    return res.json({ ok: true, action, identity, targetDisplay, room });
  }

  if (action === "banfromall") {
    if (role !== "owner") {
      return res.status(403).json({ msg: "Only owner can use /banfromall" });
    }
    netState.banIdentity(identity);
    netState.pushAlertForIdentity(identity, {
      type: "ban",
      message: `You have been globally banned by owner. Reason: ${reason}`
    });
    return res.json({ ok: true, action, identity, targetDisplay });
  }

  if (action === "unban") {
    if (role !== "owner") {
      return res.status(403).json({ msg: "Only owner can unban" });
    }
    if (room) {
      netState.unbanIdentityInRoom(identity, room);
    } else {
      netState.unbanIdentity(identity);
    }
    netState.pushAlertForIdentity(identity, {
      type: "info",
      message: room
        ? `Your ban for "${room}" has been removed by owner.`
        : "Your chat ban has been removed by owner."
    });
    return res.json({ ok: true, action, identity, targetDisplay, room: room || null });
  }

  if (action === "clearwarns") {
    const cleared = netState.clearWarnings(identity);
    netState.pushAlertForIdentity(identity, {
      type: "info",
      message: "Your warning count has been reset by moderation."
    });
    return res.json({ ok: true, action, identity, targetDisplay, cleared });
  }

  return res.status(400).json({ msg: "Invalid action" });
});

router.get("/alerts", (req, res) => {
  const token = String(req.header("x-auth-token") || "").trim();
  let caller = null;
  if (token) {
    try {
      const decoded = require("jsonwebtoken").verify(token, require("../config/config").jwtSecret || process.env.JWT_SECRET || "secret");
      caller = userStore.findById(decoded?.user?.id) || null;
    } catch (_err) {
      caller = null;
    }
  }
  const userToken = String(req.header("x-tlk-participant-token") || "").trim();
  const deviceId = String(req.header("x-chat-device-id") || "").trim();
  const alerts = netState.consumeAlerts({
    userToken,
    userId: caller?._id || null,
    deviceId
  });
  return res.json({ alerts });
});

router.delete("/messages/:id", auth, (req, res) => {
  const caller = userStore.findById(req.user.id);
  const role = String(caller?.role || "").toLowerCase();
  if (!caller) return res.status(401).json({ msg: "User not found" });

  const messageId = String(req.params.id || "").trim();
  if (!messageId) {
    return res.status(400).json({ msg: "message id is required" });
  }
  const senderToken = String(req.body?.senderToken || "").trim();
  const callerToken = String(req.body?.callerToken || "").trim();
  const isOwnMessage = !!(senderToken && callerToken && senderToken === callerToken);
  const isOwner = role === "owner";
  if (!isOwner && !isOwnMessage) {
    return res.status(403).json({ msg: "Not authorized to delete this message" });
  }

  const deleted = netState.deleteMessageById(messageId, {
    deletedByRole: isOwner ? "admin" : role || "user",
    deletedByName: String(caller.name || caller.username || role || "user"),
    deletedByUserId: String(caller._id || ""),
    deletedBySelf: isOwnMessage
  });
  return res.json({ ok: true, id: messageId, deleted });
});

module.exports = router;
