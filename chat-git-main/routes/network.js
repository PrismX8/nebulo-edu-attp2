const express = require("express");
const network = require("../config/networkSites");
const netState = require("../services/network/state");
const presence = require("../services/network/presence");
const auth = require("../middleware/auth");
const userStore = require("../services/auth/localStore");
const identityStore = require("../services/network/identity");
const security = require("../middleware/security");
const profileStore = require("../services/db/profileStore");
const effectStore = require("../services/db/effectStore");
const bannerStore = require("../services/db/bannerStore");
const profileEffectStore = require("../services/db/profileEffectStore");
const moderationStore = require("../services/db/moderationStore");
const notificationStore = require("../services/db/notificationStore");
const banEvasion = require("../services/moderation/banEvasion");

const router = express.Router();
const BAN_APPEAL_TEXT = "Open a ticket to appeal: dsc.gg/nebulo";

function publicProfile(user = {}) {
  return {
    userId: String(user._id || user.id || user.userId || ''),
    id: String(user._id || user.id || user.userId || ''),
    username: String(user.username || user.name || ''),
    name: String(user.name || user.displayName || user.username || ''),
    avatar: user.avatar ?? user.avatar_url ?? null,
    role: String(user.role || 'user'),
    is_owner: !!user.is_owner,
    is_premium: !!user.is_premium,
    is_booster: !!user.is_booster,
    coins: Math.max(0, Number(user.coins || 0)),
    equippedEffect: String(user.equippedEffect || 'none'),
    equippedAvatarEffect: String(user.equippedAvatarEffect || 'none'),
    equippedTag: String(user.equippedTag || 'none'),
    equippedBanner: String(user.equippedBanner || 'none'),
    equippedProfileEffect: String(user.equippedProfileEffect || 'none'),
    nameEffect: String(user.nameEffect || 'none'),
    equippedBadge: String(user.equippedBadge || 'none'),
    customStatus: String(user.customStatus || '').slice(0, 80)
  };
}

async function enrichPresenceFromDatabase(snapshot) {
  const roomUsers = Object.values(snapshot?.users || {}).filter(Array.isArray);
  const userIds = [...new Set(roomUsers.flat()
    .map((user) => String(user?.userId || '').trim())
    .filter((id) => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)))];
  if (!userIds.length) return snapshot;

  const [accounts, messageEffects, avatarEffects, tags, banners, profileEffects] = await Promise.all([
    profileStore.findAccountsByIds(userIds).catch(() => []),
    effectStore.getEquippedMessageEffects(userIds).catch(() => null),
    effectStore.getEquippedAvatarEffects(userIds).catch(() => null),
    effectStore.getEquippedTags(userIds).catch(() => null),
    bannerStore.getEquippedBanners(userIds).catch(() => null),
    profileEffectStore.getEquippedProfileEffects(userIds).catch(() => null)
  ]);
  const accountsById = new Map(accounts.map((account) => [String(account.id || account._id), account]));

  roomUsers.forEach((users) => users.forEach((user) => {
    const userId = String(user?.userId || '').trim();
    const account = accountsById.get(userId);
    if (account) {
      user.username = account.username || user.username;
      user.avatar = account.avatar ?? account.avatar_url ?? null;
      user.role = account.role || user.role || 'user';
      user.is_owner = !!account.is_owner;
      user.is_premium = !!account.is_premium;
      user.is_booster = !!account.is_booster;
      user.coins = Math.max(0, Number(account.coins || 0));
      user.nameEffect = account.nameEffect || user.nameEffect || 'none';
      user.equippedBadge = account.equippedBadge || user.equippedBadge || 'none';
      if (account.customStatus) user.customStatus = account.customStatus;
    }
    if (messageEffects) user.equippedEffect = messageEffects.get(userId) || 'none';
    if (avatarEffects) user.equippedAvatarEffect = avatarEffects.get(userId) || 'none';
    if (tags) user.equippedTag = tags.get(userId) || 'none';
    if (banners) user.equippedBanner = banners.get(userId) || 'none';
    if (profileEffects) user.equippedProfileEffect = profileEffects.get(userId) || 'none';
  }));
  return snapshot;
}

async function resolvePublicProfile(identifier) {
  const value = String(identifier || '').trim();
  if (!value) return null;
  const localUser = userStore.findById(value) || userStore.findByUsername(value);
  const local = localUser ? userStore.sanitizeUser(localUser) : null;
  let account = null;
  try {
    account = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
      ? await profileStore.findAccountById(value)
      : (await profileStore.findAccountByIdentifier(value))?.account;
  } catch {}
  if (!account && !local) return null;
  if (!account) return publicProfile(local);

  const userId = String(account.id || account._id);
  const [effects, avatarEffects, tags, banners, profileEffects] = await Promise.all([
    effectStore.getUserEffects(userId).catch(() => null),
    effectStore.getUserAvatarEffects(userId).catch(() => null),
    effectStore.getUserTags(userId).catch(() => null),
    bannerStore.getUserBanners(userId).catch(() => null),
    profileEffectStore.getUserProfileEffects(userId).catch(() => null)
  ]);
  return publicProfile({
    ...(local || {}),
    ...account,
    ...(effects || {}),
    ...(avatarEffects || {}),
    ...(tags || {}),
    ...(banners || {}),
    ...(profileEffects || {}),
    avatar: account.avatar ?? account.avatar_url ?? local?.avatar ?? null
  });
}

router.get("/sites", (_req, res) => {
  res.json({
    globalRoom: network.globalRoom,
    localSiteId: network.localSiteId,
    sites: network.sites
  });
});

router.get("/moderation", auth, (req, res) => {
  const caller = req.user;
  const role = String(caller?.role || "").toLowerCase();
  const moderation = netState.getModeration();
  if (!caller) return res.status(401).json({ msg: "User not found" });
  if (!["owner", "admin"].includes(role)) {
    return res.json({
      lockdownActive: !!moderation.lockdownActive,
      warningLimit: Number(moderation.warningLimit || 3)
    });
  }
  return res.json(moderation);
});

router.put("/moderation", auth, (req, res) => {
  const caller = req.user;
  const role = String(caller?.role || "").toLowerCase();
  if (!caller) return res.status(401).json({ msg: "User not found" });
  if (!["owner", "admin"].includes(role)) {
    return res.status(403).json({ msg: "Not authorized" });
  }
  const updated = netState.setModeration(req.body || {});
  if (globalThis.__nebuloChatIo) {
    globalThis.__nebuloChatIo.emit("moderation_updated", {
      scope: "global",
      lockdownActive: !!updated.lockdownActive
    });
  }
  res.json(updated);
});

router.get("/presence", async (_req, res) => {
  try {
    const snapshot = presence.enrichUsers((user) => {
      const userId = String(user?.userId || '').trim();
      const byId = userId ? userStore.findById(userId) : null;
      const byName = userStore.findByUsername(user?.username || '');
      const identityById = userId
        ? identityStore.getTokensByUserId(userId)
            .map((token) => identityStore.getByToken(token))
            .filter(Boolean)
            .sort((left, right) => Number(right.updatedAt || 0) - Number(left.updatedAt || 0))[0]
        : null;
      const identityByName = identityStore.getByUsername(user?.username || '')?.profile || null;
      const local = byId || byName;
      const identity = identityById || identityByName;
      if (!local && !identity) return null;
      return {
        ...(local ? userStore.sanitizeUser(local) : {}),
        ...(identity || {}),
        avatar: identity?.avatar || local?.avatar || null
      };
    });
    return res.json(await enrichPresenceFromDatabase(snapshot));
  } catch (_error) {
    return res.json({ ttlMs: 30000, totalOnline: 0, rooms: {}, users: {} });
  }
});

router.get("/profiles/:identifier", auth, async (req, res) => {
  const profile = await resolvePublicProfile(req.params.identifier);
  if (!profile) return res.status(404).json({ msg: "Profile not found" });
  return res.json({ profile });
});

router.post("/ai/summon", auth, security.writeRateLimit, (req, res) => {
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

router.post("/moderate", auth, security.writeRateLimit, async (req, res) => {
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

router.post("/reports", auth, async (req, res) => {
  const caller = req.user;
  if (!caller) return res.status(401).json({ msg: "User not found" });
  const room = String(req.body?.room || "").trim().toLowerCase();
  const messageId = String(req.body?.messageId || "").trim();
  const reason = String(req.body?.reason || "").trim();
  if (!room || !messageId) return res.status(400).json({ msg: "room and messageId are required" });
  if (!reason) return res.status(400).json({ msg: "Report reason is required" });

  try {
    const report = await moderationStore.createReport({
      room,
      messageId,
      reasonCategory: req.body?.reasonCategory || req.body?.category || "other",
      reason,
      reporterId: caller._id || caller.id,
      reporterUsername: caller.username || caller.name || "Unknown",
      targetUsername: req.body?.targetUsername || "Unknown",
      targetUserId: req.body?.targetUserId || "",
      targetToken: req.body?.targetToken || "",
      quote: req.body?.quote || ""
    });
    return res.json({ ok: true, report });
  } catch (error) {
    return res.status(error?.code === "INVALID_REPORT" ? 400 : 500).json({ msg: error?.message || "Failed to save report" });
  }
});

router.get("/reports", auth, async (req, res) => {
  const caller = req.user;
  const role = String(caller?.role || "").toLowerCase();
  if (!caller) return res.status(401).json({ msg: "User not found" });
  if (!["owner", "admin"].includes(role)) return res.status(403).json({ msg: "Not authorized" });
  try {
    const reports = await moderationStore.listReports({
      room: req.query?.room,
      status: req.query?.status || "all",
      limit: req.query?.limit
    });
    return res.json({ reports });
  } catch (error) {
    return res.status(500).json({ msg: error?.message || "Failed to load reports" });
  }
});

router.patch("/reports/:reportId", auth, async (req, res) => {
  const caller = req.user;
  const role = String(caller?.role || "").toLowerCase();
  if (!caller) return res.status(401).json({ msg: "User not found" });
  if (!["owner", "admin"].includes(role)) return res.status(403).json({ msg: "Not authorized" });
  try {
    const report = await moderationStore.updateReportStatus(req.params.reportId, {
      status: req.body?.status,
      modNote: req.body?.modNote,
      reviewerId: caller._id || caller.id
    });
    if (!report) return res.status(404).json({ msg: "Report not found" });
    return res.json({ ok: true, report });
  } catch (error) {
    return res.status(error?.code === "INVALID_STATUS" ? 400 : 500).json({ msg: error?.message || "Failed to update report" });
  }
});

router.get("/warnings", auth, async (req, res) => {
  const caller = req.user;
  const role = String(caller?.role || "").toLowerCase();
  if (!caller) return res.status(401).json({ msg: "User not found" });
  if (!["owner", "admin"].includes(role)) return res.status(403).json({ msg: "Not authorized" });
  try {
    const warnings = await moderationStore.listWarnings({
      userId: req.query?.userId,
      active: req.query?.active || "true",
      limit: req.query?.limit
    });
    return res.json({ warnings, warningLimit: Number(netState.getModeration().warningLimit || 3) });
  } catch (error) {
    return res.status(500).json({ msg: error?.message || "Failed to load warnings" });
  }
});

async function resolveTargetIdentity(target = "") {
  const raw = String(target || "").trim();
  if (!raw) return null;

  const lower = raw.toLowerCase();
  if (lower.startsWith("token:")) {
    const userToken = raw.slice("token:".length).trim();
    const profile = identityStore.getByToken(userToken);
    const account = profile?.userId ? await profileStore.findAccountById(profile.userId).catch(() => null) : null;
    return {
      identity: {
        userToken,
        userId: profile?.userId || null,
        deviceId: null
      },
      targetDisplay: account?.username || profile?.name || profile?.username || userToken,
      targetRole: account?.role || profile?.role || "user"
    };
  }
  if (lower.startsWith("user:")) {
    const ident = raw.slice("user:".length).trim();
    let user = userStore.findById(ident) || userStore.findByUsername(ident);
    const account = await profileStore.findAccountById(ident).catch(() => null);
    if (account) user = userStore.upsertRemoteUser(account) || userStore.findById(account.id);
    if (!user && !account) return null;
    const safe = user ? userStore.sanitizeUser(user) : account;
    return {
      identity: {
        userToken: null,
        userId: user?._id || account?.id,
        deviceId: null
      },
      targetDisplay: safe?.name || safe?.username || ident,
      targetRole: account?.role || safe?.role || "user"
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
  const databaseMatch = await profileStore.findAccountByIdentifier(raw).catch(() => null);
  if (databaseMatch?.account) {
    const account = databaseMatch.account;
    userStore.upsertRemoteUser(account);
    return {
      identity: { userToken: null, userId: account.id, deviceId: null },
      targetDisplay: account.username,
      targetRole: account.role || "user"
    };
  }
  if (byUsername) {
    const safe = userStore.sanitizeUser(byUsername);
    return {
      identity: {
        userToken: null,
        userId: byUsername._id,
        deviceId: null
      },
      targetDisplay: safe?.name || safe?.username || raw,
      targetRole: safe?.role || "user"
    };
  }

  const byToken = identityStore.getByToken(raw);
  if (byToken) {
    const account = byToken?.userId ? await profileStore.findAccountById(byToken.userId).catch(() => null) : null;
    return {
      identity: {
        userToken: raw,
        userId: byToken?.userId || null,
        deviceId: null
      },
      targetDisplay: account?.username || byToken?.name || byToken?.username || raw,
      targetRole: account?.role || byToken?.role || "user"
    };
  }

  return null;
}

router.post("/mod/actions", auth, async (req, res) => {
  const caller = req.user;
  const role = String(caller?.role || "").toLowerCase();
  if (!caller) return res.status(401).json({ msg: "User not found" });
  if (!["owner", "admin"].includes(role)) {
    return res.status(403).json({ msg: "Not authorized" });
  }

  const action = String(req.body?.action || "").trim().toLowerCase();
  const target = String(req.body?.target || "").trim();
  const reason = String(req.body?.reason || "Moderator action").trim();
  const room = String(req.body?.room || "").trim().toLowerCase();
  if (!["warn", "ban", "banfromall", "unban", "unban_room", "unban_global", "clearwarns", "clearchat"].includes(action)) {
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
    if (globalThis.__nebuloChatIo) {
      globalThis.__nebuloChatIo.to(room).emit("chat_cleared", { room, roomId: room, cleared });
    }
    return res.json({ ok: true, action, room, cleared });
  }

  const resolved = await resolveTargetIdentity(target);
  if (!resolved) {
    return res.status(404).json({ msg: "Target not found. Use username or token:<id>." });
  }
  const identity = resolved.identity;
  const targetDisplay = resolved.targetDisplay;
  const targetUser = identity?.userId ? userStore.findById(identity.userId) : null;
  const targetRole = String(resolved.targetRole || targetUser?.role || "").toLowerCase();
  const punitiveAction = ["warn", "ban", "banfromall"].includes(action);
  if (punitiveAction && targetRole === "owner") {
    return res.status(403).json({ msg: "Owners are immune to warnings and bans." });
  }
  if (punitiveAction && role === "admin" && targetRole === "admin") {
    return res.status(403).json({ msg: "Admins cannot warn or ban other admins." });
  }

  if (action === "warn") {
    try {
      const saved = await moderationStore.addWarning({
        userId: identity.userId,
        moderatorId: caller._id || caller.id,
        reason
      });
      const limit = Number(netState.getModeration().warningLimit || 3);
      const banned = saved.warnings >= limit && targetRole !== "owner";
      if (banned) {
        netState.banIdentity(identity);
        await banEvasion.banUserIdentifiers(identity.userId, {
          reason: `Automatic ban after ${saved.warnings} warnings: ${reason}`,
          actorId: caller._id || caller.id
        }).catch((error) => console.warn("Could not persist ban identifiers:", error?.message || error));
      }
      netState.pushAlertForIdentity(identity, {
        type: banned ? "ban" : "warn",
        message: banned
          ? `You were warned (${saved.warnings}/${limit}) and are now banned. ${BAN_APPEAL_TEXT}`
          : `You were warned by moderation (${saved.warnings}/${limit}). Reason: ${reason}`
      });
      const warning = { ...saved, limit, banned };
      return res.json({ ok: true, action, warning, identity, targetDisplay });
    } catch (error) {
      return res.status(500).json({ msg: error?.message || "Failed to warn user" });
    }
  }

  if (action === "ban") {
    if (!room) {
      return res.status(400).json({ msg: "room is required for /ban" });
    }
    netState.banIdentityInRoom(identity, room);
    netState.pushAlertForIdentity(identity, {
      type: "ban",
      message: `You have been banned from "${room}" by moderation. Reason: ${reason}. ${BAN_APPEAL_TEXT}`
    });
    return res.json({ ok: true, action, identity, targetDisplay, room });
  }

  if (action === "banfromall") {
    if (role !== "owner") {
      return res.status(403).json({ msg: "Only owner can use /banfromall" });
    }
    netState.banIdentity(identity);
    await banEvasion.banUserIdentifiers(identity.userId, {
      reason,
      actorId: caller._id || caller.id
    }).catch((error) => console.warn("Could not persist ban identifiers:", error?.message || error));
    netState.pushAlertForIdentity(identity, {
      type: "ban",
      message: `You have been globally banned by owner. Reason: ${reason}. ${BAN_APPEAL_TEXT}`
    });
    return res.json({ ok: true, action, identity, targetDisplay });
  }

  if (["unban", "unban_room", "unban_global"].includes(action)) {
    // The legacy /unban command remains owner-only. The scoped appeal actions
    // are deliberately available to both owners and admins from the moderation panel.
    if (action === "unban" && role !== "owner") {
      return res.status(403).json({ msg: "Only owner can use the legacy unban action" });
    }
    const roomAppeal = action === "unban_room" || (action === "unban" && !!room);
    if (roomAppeal && !room) {
      return res.status(400).json({ msg: "room is required to approve a room-ban appeal" });
    }
    if (roomAppeal) {
      netState.unbanIdentityInRoom(identity, room);
    } else {
      netState.unbanIdentity(identity);
      await banEvasion.clearUserIdentifierBans(identity.userId, caller._id || caller.id)
        .catch((error) => console.warn("Could not clear ban identifiers:", error?.message || error));
    }
    netState.pushAlertForIdentity(identity, {
      type: "info",
      message: roomAppeal
        ? `Your ban appeal for "${room}" was approved by ${role}.`
        : `Your global chat-ban appeal was approved by ${role}.`
    });
    return res.json({
      ok: true,
      action,
      appealScope: roomAppeal ? "room" : "global",
      identity,
      targetDisplay,
      room: roomAppeal ? room : null
    });
  }

  if (action === "clearwarns") {
    try {
      const cleared = await moderationStore.clearWarnings({
        userId: identity.userId,
        clearedBy: caller._id || caller.id
      });
      netState.pushAlertForIdentity(identity, {
        type: "info",
        message: "Your warning count has been reset by moderation."
      });
      return res.json({ ok: true, action, identity, targetDisplay, cleared });
    } catch (error) {
      return res.status(500).json({ msg: error?.message || "Failed to clear warnings" });
    }
  }

  return res.status(400).json({ msg: "Invalid action" });
});

router.post("/mod/registration-overrides", auth, security.adminActionRateLimit, async (req, res) => {
  const caller = req.user;
  const role = String(caller?.role || "").toLowerCase();
  if (!caller) return res.status(401).json({ msg: "User not found" });
  if (!["owner", "admin"].includes(role)) {
    return res.status(403).json({ msg: "Not authorized" });
  }
  const appealId = String(req.body?.appealId || "").trim();
  if (!appealId) return res.status(400).json({ msg: "Appeal code is required" });
  try {
    const result = await banEvasion.approveRegistrationAppeal(appealId, caller._id || caller.id);
    if (!result.approved) {
      return res.status(404).json({ msg: "Appeal code not found, expired, or already used" });
    }
    return res.json({ ok: true, appealId });
  } catch (error) {
    return res.status(500).json({ msg: error?.message || "Could not approve registration" });
  }
});

router.get("/alerts", auth, async (req, res) => {
  const caller = req.user;
  const userToken = String(req.header("x-tlk-participant-token") || "").trim();
  const deviceId = String(req.header("x-chat-device-id") || "").trim();
  const identity = {
    userToken,
    userId: caller?._id || null,
    deviceId
  };
  const transientAlerts = netState.listAlerts(identity);
  const localAlerts = userStore.listSystemNotifications(caller?._id || caller?.id);
  let databaseSystemAlerts = [];
  try {
    databaseSystemAlerts = await profileStore.listSystemNotifications(caller?._id || caller?.id);
  } catch (error) {
    if (error?.code !== 'PROFILE_DB_NOT_CONFIGURED') {
      console.warn('Could not load account update notifications:', error?.message || error);
    }
  }
  let persistentAlerts = [];
  try {
    persistentAlerts = await notificationStore.listActive(caller?._id || caller?.id, 50);
  } catch (error) {
    if (!notificationStore.isUnavailableError(error)) {
      console.warn('Could not load persistent chat notifications:', error?.message || error);
    }
  }
  const alertsById = new Map();
  [...transientAlerts, ...localAlerts, ...databaseSystemAlerts, ...persistentAlerts].forEach((alert) => alertsById.set(
    String(alert?.id || `${alert?.type}:${alert?.message}:${alert?.at}`),
    alert
  ));
  res.set('Cache-Control', 'no-store');
  return res.json({ alerts: [...alertsById.values()].sort((a, b) => Number(a.at || 0) - Number(b.at || 0)) });
});

router.patch("/alerts/:id", auth, async (req, res) => {
  const caller = req.user;
  const alertId = String(req.params.id || "").trim();
  const friendRequestStatus = String(req.body?.friendRequestStatus || "").trim().toLowerCase();
  if (!alertId) return res.status(400).json({ msg: "Alert id is required" });
  if (!["accepted", "declined"].includes(friendRequestStatus)) {
    return res.status(400).json({ msg: "A valid friend-request status is required" });
  }
  const identity = {
    userToken: String(req.header("x-tlk-participant-token") || "").trim(),
    userId: caller?._id || caller?.id || null,
    deviceId: String(req.header("x-chat-device-id") || "").trim()
  };
  const metadataPatch = { friendRequestStatus, friendRequestHandledAt: Date.now() };
  const transientUpdated = netState.updateAlert(identity, alertId, metadataPatch);
  let persistentUpdated = false;
  try {
    persistentUpdated = await notificationStore.updateMetadata(caller?._id || caller?.id, alertId, metadataPatch);
  } catch (error) {
    if (!notificationStore.isUnavailableError(error)) {
      console.warn('Could not update persistent chat notification:', error?.message || error);
    }
  }
  return res.json({ ok: true, updated: transientUpdated || persistentUpdated, friendRequestStatus });
});

router.delete("/alerts/:id", auth, async (req, res) => {
  const caller = req.user;
  const alertId = String(req.params.id || "").trim();
  if (!alertId) return res.status(400).json({ msg: "Alert id is required" });
  const identity = {
    userToken: String(req.header("x-tlk-participant-token") || "").trim(),
    userId: caller?._id || caller?.id || null,
    deviceId: String(req.header("x-chat-device-id") || "").trim()
  };
  const transientCleared = netState.clearAlert(identity, alertId);
  const localCleared = userStore.clearSystemNotification(caller?._id || caller?.id, alertId);
  let databaseSystemCleared = false;
  try {
    databaseSystemCleared = await profileStore.clearSystemNotification(caller?._id || caller?.id, alertId);
  } catch (error) {
    if (error?.code !== 'PROFILE_DB_NOT_CONFIGURED') {
      console.warn('Could not clear account update notification:', error?.message || error);
    }
  }
  let persistentCleared = false;
  if (!databaseSystemCleared) {
    try {
      persistentCleared = await notificationStore.clear(caller?._id || caller?.id, alertId);
    } catch (error) {
      if (!notificationStore.isUnavailableError(error)) {
        console.warn('Could not clear persistent chat notification:', error?.message || error);
      }
    }
  }
  return res.json({ ok: true, cleared: transientCleared || localCleared || databaseSystemCleared || persistentCleared, id: alertId });
});

router.delete("/alerts", auth, async (req, res) => {
  const caller = req.user;
  const identity = {
    userToken: String(req.header("x-tlk-participant-token") || "").trim(),
    userId: caller?._id || caller?.id || null,
    deviceId: String(req.header("x-chat-device-id") || "").trim()
  };
  const transientCleared = netState.clearAlerts(identity);
  const localCleared = userStore.clearSystemNotifications(caller?._id || caller?.id);
  let databaseSystemCleared = 0;
  try {
    databaseSystemCleared = await profileStore.clearSystemNotifications(caller?._id || caller?.id);
  } catch (error) {
    if (error?.code !== 'PROFILE_DB_NOT_CONFIGURED') {
      console.warn('Could not clear account update notifications:', error?.message || error);
    }
  }
  let persistentCleared = 0;
  try {
    persistentCleared = await notificationStore.clearAll(caller?._id || caller?.id);
  } catch (error) {
    if (!notificationStore.isUnavailableError(error)) {
      console.warn('Could not clear persistent chat notifications:', error?.message || error);
    }
  }
  return res.json({ ok: true, cleared: Number(transientCleared || 0) + Number(localCleared || 0) + Number(databaseSystemCleared || 0) + Number(persistentCleared || 0) });
});

router.delete("/messages/:id", auth, (req, res) => {
  const caller = req.user;
  const role = String(caller?.role || "").toLowerCase();
  if (!caller) return res.status(401).json({ msg: "User not found" });

  const messageId = String(req.params.id || "").trim();
  if (!messageId) {
    return res.status(400).json({ msg: "message id is required" });
  }
  const senderToken = String(req.body?.senderToken || "").trim();
  const callerToken = String(req.body?.callerToken || "").trim();
  const callerTokens = identityStore.getTokensByUserId(caller._id);
  const isOwnToken = !!callerToken && callerTokens.includes(callerToken);
  const isOwnMessage = !!(senderToken && callerToken && senderToken === callerToken && isOwnToken);
  const canModerateDelete = role === "owner" || role === "admin";
  if (!canModerateDelete && !isOwnMessage) {
    return res.status(403).json({ msg: "Not authorized to delete this message" });
  }

  const deleted = netState.deleteMessageById(messageId, {
    deletedByRole: canModerateDelete ? role : "user",
    deletedByName: String(caller.name || caller.username || role || "user"),
    deletedByUserId: String(caller._id || ""),
    deletedBySelf: isOwnMessage
  });
  return res.json({ ok: true, id: messageId, deleted });
});

module.exports = router;
