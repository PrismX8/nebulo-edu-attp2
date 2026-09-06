// ─── Standalone Chat-Only Server ──────────────────────────────────────────────
// Runs only the chat routes (auth, users, TLK, network, chat-effects, etc.)
// and serves the static chat frontend — no proxy/game routes.
// Start: node chat-server.js
// Port: CHAT_PORT env var or 5050

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const fs = require("fs");
const { randomUUID } = require("crypto");

// Load environment
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET || "secret";

// Chat services (from chat-git-main)
const chatUserStore = require("./chat-git-main/services/auth/localStore");
const chatIdentityStore = require("./chat-git-main/services/network/identity");
const chatNetState = require("./chat-git-main/services/network/state");
const chatPresence = require("./chat-git-main/services/network/presence");
const chatEffects = require("./chat-git-main/services/chat/effects");
const chatGroups = require("./chat-git-main/services/groupChats");
const profileStore = require("./chat-git-main/services/db/profileStore");
const notificationStore = require("./chat-git-main/services/db/notificationStore");
const {
  verifyToken: verifyChatToken,
} = require("./chat-git-main/services/auth/remoteAuth");
const {
  moderatePublicMessage,
} = require("./chat-git-main/services/moderation/publicMessage");

// ─── Express Setup ────────────────────────────────────────────────────────────
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
  path: "/socket.io/",
});
globalThis.__nebuloChatIo = io;

app.use(cors());
app.use(express.json({ limit: "3mb" }));
app.use(express.urlencoded({ extended: true, limit: "3mb" }));

// ─── Helpers (mirrored from app.js) ───────────────────────────────────────────
const sanitizeUser = (user) => {
  const safe = chatUserStore.sanitizeUser(user);
  return safe ? { ...safe, id: safe._id || safe.id || "" } : null;
};

const findUserByUsername = (username) => chatUserStore.findByUsername(username);
const findUserById = (userId) => chatUserStore.findById(userId);
const isOwnerAccount = (user) =>
  String(user?.role || "").toLowerCase() === "owner" || user?.is_owner === true;
const isStaffAccount = (user) =>
  isOwnerAccount(user) ||
  String(user?.role || "").toLowerCase() === "admin" ||
  user?.is_admin === true;

const signAuthToken = (user, source = "local") =>
  jwt.sign({ user: { id: user?._id || user?.id, source } }, JWT_SECRET, {
    expiresIn: "24h",
  });

const databaseAccountCache = new Map();

const getRequestToken = (req) => {
  const headerToken = req.headers["x-auth-token"];
  const bearerToken = String(req.headers.authorization || "")
    .replace(/^Bearer\s+/i, "")
    .trim();
  return String(headerToken || bearerToken || "").trim();
};

const decodeRequestToken = (req) => {
  const token = getRequestToken(req);
  if (!token) return null;
  try {
    return { token, decoded: jwt.verify(token, JWT_SECRET) };
  } catch {
    return { token, decoded: null };
  }
};

const verifyPassword = async (inputPassword, storedPassword) => {
  if (typeof storedPassword !== "string" || !storedPassword.length)
    return false;
  const password = String(inputPassword || "");
  if (/^\$2[aby]\$\d+\$/.test(storedPassword)) {
    return bcrypt.compare(password, storedPassword);
  }
  return password === storedPassword;
};

const getAuthenticatedUser = (req) => {
  const auth = decodeRequestToken(req);
  const userId = String(auth?.decoded?.user?.id || "").trim();
  if (!userId) return null;
  return findUserById(userId) || databaseAccountCache.get(userId) || null;
};

const mergeDatabaseAccountMetadata = (account) => {
  if (!account) return null;
  const local =
    chatUserStore.upsertRemoteUser(account) || findUserById(account.id);
  const safe = local ? chatUserStore.sanitizeUser(local) : null;
  const merged = {
    ...account,
    coins: account.coins ?? safe?.coins ?? 0,
    ownedEffects: safe?.ownedEffects || ["none"],
    equippedEffect: safe?.equippedEffect || "none",
    friends: safe?.friends || [],
  };
  databaseAccountCache.set(account.id, merged);
  return merged;
};

const getAuthenticatedProfileAccount = async (req) => {
  const auth = decodeRequestToken(req);
  const userId = String(auth?.decoded?.user?.id || "").trim();
  const source = String(auth?.decoded?.user?.source || "").trim();
  if (userId && source === "database") {
    return profileStore.findAccountById(userId);
  }
  if (!auth?.token) return null;
  try {
    const verified = await verifyChatToken(auth.token);
    if (!verified?.id && !verified?._id) return null;
    if (!verified?.email) return null;
    return profileStore.findAccountById(verified.id || verified._id);
  } catch {
    return null;
  }
};

// ─── mountExpressRouter for integration.js ──────────────────────────────────
const mountExpressRouter = (prefix, router) => {
  // In a plain Express app, just use the prefix directly
  app.use(prefix, router);
};

// ─── Mount chat routes from integration.js ──────────────────────────────────
require("./chat-git-main/integration").integrateChat({ io, mountExpressRouter });

// ─── Auth Routes ──────────────────────────────────────────────────────────────

// POST /api/auth — login
app.post("/api/auth", async (req, res) => {
  const { username, email, password } = req.body || {};
  const identifier = String(email || username || "").trim();
  if (!identifier || !password) {
    return res.status(400).json({ msg: "Email/username and password required" });
  }

  const user = findUserByUsername(identifier);
  if (user && (await verifyPassword(password, user.password))) {
    return res.json({
      token: signAuthToken(user, "local"),
      user: sanitizeUser(user),
    });
  }

  try {
    const databaseResult = await profileStore.findAccountByIdentifier(
      identifier
    );
    if (
      databaseResult &&
      (await verifyPassword(password, databaseResult.passwordHash))
    ) {
      const databaseUser = mergeDatabaseAccountMetadata(
        databaseResult.account
      );
      return res.json({
        token: signAuthToken(databaseUser, "database"),
        user: databaseUser,
      });
    }
  } catch (error) {
    if (error?.code === "PROFILE_DB_NOT_CONFIGURED") {
      return res
        .status(503)
        .json({ msg: "Account database is not configured" });
    }
    console.error("Database authentication failed:", error.message);
    return res
      .status(503)
      .json({ msg: "Account database is unavailable" });
  }

  if (user) {
    return res.status(400).json({ msg: "Incorrect password" });
  }
  return res.status(400).json({ msg: "Account not found" });
});

// GET /api/auth — verify token
app.get("/api/auth", async (req, res) => {
  const auth = decodeRequestToken(req);
  const userId = String(auth?.decoded?.user?.id || "").trim();
  const source = String(auth?.decoded?.user?.source || "").trim();
  if (userId && source === "database") {
    try {
      const databaseUser = mergeDatabaseAccountMetadata(
        await profileStore.findAccountById(userId)
      );
      if (!databaseUser)
        return res.status(401).json({ msg: "Account no longer exists" });
      return res.json(databaseUser);
    } catch (error) {
      console.error("Database session lookup failed:", error.message);
      return res
        .status(503)
        .json({ msg: "Account database is unavailable" });
    }
  }

  const user = getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ msg: "No token" });
  }
  return res.json(sanitizeUser(user));
});

// POST /api/users — register
app.post("/api/users", async (req, res) => {
  const username = String(req.body?.username || "").trim();
  const email = String(req.body?.email || "").trim().toLowerCase();
  const password = String(req.body?.password || "");
  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ msg: "Username, email, and password are required" });
  }
  if (!/^[a-zA-Z0-9_]{3,24}$/.test(username)) {
    return res
      .status(400)
      .json({
        msg: "Username must be 3–24 characters using letters, numbers, or underscores",
      });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    return res.status(400).json({ msg: "Enter a valid email address" });
  }
  if (password.length < 8 || password.length > 128) {
    return res
      .status(400)
      .json({ msg: "Password must be 8–128 characters" });
  }

  try {
    const account = await profileStore.createAccount({
      id: randomUUID(),
      username,
      email,
      passwordHash: await bcrypt.hash(password, 12),
    });
    const user = mergeDatabaseAccountMetadata(account);
    return res
      .status(201)
      .json({ token: signAuthToken(user, "database"), user });
  } catch (error) {
    if (error?.code === "ACCOUNT_EXISTS") {
      return res.status(409).json({ msg: error.message });
    }
    console.error("Account registration failed:", error.message);
    return res.status(500).json({ msg: "Failed to create user" });
  }
});

// ─── User Routes ──────────────────────────────────────────────────────────────

// GET /api/users — list users
app.get("/api/users", async (req, res) => {
  const user = getAuthenticatedUser(req);
  if (!user) return res.status(401).json({ msg: "Invalid token" });
  return res.json(chatUserStore.listUsers().map(sanitizeUser));
});

// PUT /api/users/profile — update profile
app.put("/api/users/profile", async (req, res) => {
  const authUser = getAuthenticatedUser(req);
  if (!authUser) return res.status(401).json({ msg: "Invalid token" });
  const { name, avatar } = req.body || {};
  if (avatar && String(avatar).length > 2_000_000) {
    return res.status(400).json({ msg: "Avatar too large" });
  }
  const updatedUser = chatUserStore.updateProfile(authUser._id, { name, avatar });
  if (!updatedUser) return res.status(404).json({ msg: "User not found" });
  chatIdentityStore.updateByUserId(authUser._id, {
    name: updatedUser.name,
    avatar: updatedUser.avatar || null,
    equippedEffect: updatedUser.equippedEffect || "none",
  });
  return res.json({ user: sanitizeUser(updatedUser), msg: "Profile updated" });
});

// PUT /api/users/password — change password
app.put("/api/users/password", async (req, res) => {
  const authUser = getAuthenticatedUser(req);
  if (!authUser) return res.status(401).json({ msg: "Invalid token" });
  const { currentPassword, newPassword } = req.body || {};
  if (!currentPassword || !newPassword) {
    return res
      .status(400)
      .json({ msg: "Current and new password required" });
  }
  if (String(newPassword).length < 6) {
    return res
      .status(400)
      .json({ msg: "New password must be at least 6 characters" });
  }
  const user = findUserById(authUser._id);
  if (!user) return res.status(404).json({ msg: "User not found" });
  const isMatch = await verifyPassword(currentPassword, user.password);
  if (!isMatch)
    return res.status(400).json({ msg: "Incorrect current password" });
  chatUserStore.updatePassword(
    user._id,
    await bcrypt.hash(String(newPassword), 10)
  );
  return res.json({ msg: "Password updated successfully" });
});

// POST /api/users/coins/dev-grant — owner only
app.post("/api/users/coins/dev-grant", async (req, res) => {
  const authUser = getAuthenticatedUser(req);
  if (!authUser) return res.status(401).json({ msg: "Invalid token" });
  if (!isOwnerAccount(authUser))
    return res.status(403).json({ msg: "Owner access required" });
  const updatedUser = chatUserStore.updateProfile(authUser._id, {
    coins: 1000000,
  });
  if (!updatedUser) return res.status(404).json({ msg: "User not found" });
  return res.json({
    msg: "Test balance set to 1,000,000 coins",
    user: sanitizeUser(updatedUser),
  });
});

// POST /api/users/transfer-coins
app.post("/api/users/transfer-coins", async (req, res) => {
  const authUser = getAuthenticatedUser(req);
  if (!authUser) return res.status(401).json({ msg: "Invalid token" });
  const rawRecipient = String(
    req.body?.username || req.body?.recipient || ""
  ).trim();
  const amount = Math.floor(Number(req.body?.amount || 0));
  if (!rawRecipient)
    return res.status(400).json({ msg: "Recipient username required" });
  if (!Number.isFinite(amount) || amount <= 0)
    return res.status(400).json({ msg: "Amount must be greater than 0" });
  const recipient = chatUserStore.findByUsername(rawRecipient);
  if (!recipient)
    return res.status(404).json({ msg: "Recipient not found" });
  try {
    const result = chatUserStore.transferCoins(
      authUser._id,
      recipient._id,
      amount
    );
    return res.json({
      msg: `Sent ${result.amount} coin${result.amount === 1 ? "" : "s"} to ${result.toUser.name || result.toUser.username}`,
      amount: result.amount,
      recipient: sanitizeUser(result.toUser),
      user: sanitizeUser(result.fromUser),
    });
  } catch (error) {
    if (error?.code === "SAME_USER")
      return res.status(400).json({ msg: "Can't send coins to yourself" });
    if (error?.code === "INSUFFICIENT_COINS")
      return res.status(400).json({ msg: "Not enough coins" });
    return res.status(500).json({ msg: "Failed to send coins" });
  }
});

// ─── Friends Routes (mirrored from app.js) ────────────────────────────────────

app.get("/api/users/friends", async (req, res) => {
  const authUser = getAuthenticatedUser(req);
  if (!authUser) return res.status(401).json({ msg: "Invalid token" });
  const caller =
    chatUserStore.upsertRemoteUser(authUser) || findUserById(authUser._id);
  if (!caller) return res.status(401).json({ msg: "User not found" });

  const search = String(req.query.search || "").trim();
  const limit = Math.max(1, Math.min(24, Number(req.query.limit) || 8));
  const offset = Math.max(0, Number(req.query.offset) || 0);
  let directory;
  try {
    directory = await profileStore.listAccounts({
      search,
      limit,
      offset,
      excludeId: caller._id,
    });
  } catch (error) {
    return res.status(503).json({ msg: "Could not load user directory" });
  }
  directory.accounts.forEach((account) =>
    chatUserStore.upsertRemoteUser(account)
  );
  const results = directory.accounts;
  const mutualFriends = chatUserStore.getMutualFriends(caller._id);
  const callerUsername = String(caller.username || "").trim().toLowerCase();
  const friendRequests = chatUserStore.getFriendRequests(caller._id);

  const normalizedResults = results.map((user) => {
    const targetUsername = String(user.username || "").trim().toLowerCase();
    const isFriend =
      Array.isArray(caller.friends) && caller.friends.includes(targetUsername);
    const mutual =
      isFriend &&
      Array.isArray(user.friends) &&
      user.friends.includes(callerUsername);
    const pending =
      Array.isArray(caller.friendRequestsSent) &&
      caller.friendRequestsSent.includes(targetUsername) &&
      !mutual;
    const incoming =
      Array.isArray(caller.friendRequestsReceived) &&
      caller.friendRequestsReceived.includes(targetUsername) &&
      !mutual;
    return {
      _id: user._id,
      username: user.username,
      avatar: user.avatar || null,
      coins: Math.max(0, Number(user.coins || 0)),
      added: mutual || pending,
      mutual,
      pending,
      incoming,
    };
  });

  const incomingRequests = Array.isArray(friendRequests.incoming)
    ? friendRequests.incoming
        .map((username) => sanitizeUser(findUserByUsername(username)))
        .filter(Boolean)
    : [];
  const outgoingRequests = Array.isArray(friendRequests.outgoing)
    ? friendRequests.outgoing
        .map((username) => sanitizeUser(findUserByUsername(username)))
        .filter(Boolean)
    : [];

  const enrichProfile = async (user) => {
    if (!user) return null;
    try {
      let account = null;
      if (user._id)
        account = await profileStore
          .findAccountById(user._id)
          .catch(() => null);
      if (!account && user.username)
        account =
          (
            await profileStore
              .findAccountByIdentifier(user.username)
              .catch(() => null)
          )?.account || null;
      return account
        ? {
            ...user,
            ...account,
            avatar: account.avatar || null,
            coins: account.coins ?? user.coins ?? 0,
          }
        : { ...user, avatar: user.avatar || null, coins: user.coins ?? 0 };
    } catch {
      return { ...user, avatar: user.avatar || null, coins: user.coins ?? 0 };
    }
  };
  const [enrichedMutualFriends, enrichedIncoming, enrichedOutgoing] =
    await Promise.all([
      Promise.all(
        mutualFriends.map((user) => enrichProfile(sanitizeUser(user)))
      ),
      Promise.all(incomingRequests.map(enrichProfile)),
      Promise.all(outgoingRequests.map(enrichProfile)),
    ]);

  return res.json({
    mutualFriends: enrichedMutualFriends.filter(Boolean),
    results: normalizedResults,
    pagination: {
      total: directory.total,
      limit: directory.limit,
      offset: directory.offset,
      hasMore: directory.offset + normalizedResults.length < directory.total,
    },
    requests: {
      incoming: enrichedIncoming.filter(Boolean),
      outgoing: enrichedOutgoing.filter(Boolean),
    },
  });
});

app.post("/api/users/friends", async (req, res) => {
  const authUser = getAuthenticatedUser(req);
  if (!authUser) return res.status(401).json({ msg: "Invalid token" });
  const caller =
    chatUserStore.upsertRemoteUser(authUser) || findUserById(authUser._id);
  if (!caller) return res.status(401).json({ msg: "User not found" });
  let username = String(req.body?.username || "").trim();
  const userId = String(req.body?.userId || "").trim();
  if (userId || username) {
    try {
      const target = userId
        ? await profileStore.findAccountById(userId)
        : (
            await profileStore.findAccountByIdentifier(username)
          )?.account;
      if (target) {
        chatUserStore.upsertRemoteUser(target);
        username = target.username;
      }
    } catch {}
  }
  if (!username)
    return res.status(400).json({ msg: "Friend username is required" });
  try {
    const normalizedTarget = username.toLowerCase();
    const updated = chatUserStore.addFriendRequest(caller._id, username);
    if (globalThis.__nebuloChatIo) {
      globalThis.__nebuloChatIo
        .to(`user:${normalizedTarget}`)
        .emit("alert_created", {
          type: "friend_request",
          message: `${caller.username || authUser.username || "Someone"} sent you a friend request.`,
          metadata: {
            senderId: String(caller._id || ""),
            senderUsername: caller.username || authUser.username || "Someone",
            section: "dms",
          },
        });
    }
    return res.json({ ok: true, user: sanitizeUser(updated) });
  } catch (error) {
    if (error?.code === "USER_NOT_FOUND")
      return res.status(404).json({ msg: "User not found" });
    if (error?.code === "ALREADY_FRIENDS")
      return res.status(400).json({ msg: "Already friends" });
    return res
      .status(400)
      .json({ msg: error?.message || "Failed to send friend request" });
  }
});

app.post("/api/users/friends/accept", async (req, res) => {
  let authUser = getAuthenticatedUser(req);
  if (!authUser) {
    try {
      authUser = await getAuthenticatedProfileAccount(req);
    } catch {}
  }
  if (!authUser) return res.status(401).json({ msg: "Invalid token" });
  const authUserId = authUser._id || authUser.id;
  const caller =
    chatUserStore.upsertRemoteUser(authUser) || findUserById(authUserId);
  if (!caller) return res.status(401).json({ msg: "User not found" });
  const username = String(req.body?.username || "").trim();
  if (!username)
    return res.status(400).json({ msg: "Requester username is required" });
  try {
    const updated = chatUserStore.acceptFriendRequest(caller._id, username);
    return res.json({ ok: true, user: sanitizeUser(updated) });
  } catch (error) {
    return res
      .status(400)
      .json({ msg: error?.message || "Failed to accept friend request" });
  }
});

app.post("/api/users/friends/deny", async (req, res) => {
  let authUser = getAuthenticatedUser(req);
  if (!authUser) {
    try {
      authUser = await getAuthenticatedProfileAccount(req);
    } catch {}
  }
  if (!authUser) return res.status(401).json({ msg: "Invalid token" });
  const authUserId = authUser._id || authUser.id;
  const caller =
    chatUserStore.upsertRemoteUser(authUser) || findUserById(authUserId);
  if (!caller) return res.status(401).json({ msg: "User not found" });
  const username = String(req.body?.username || "").trim();
  if (!username)
    return res.status(400).json({ msg: "Requester username is required" });
  try {
    const updated = chatUserStore.denyFriendRequest(caller._id, username);
    return res.json({ ok: true, user: sanitizeUser(updated) });
  } catch (error) {
    return res
      .status(400)
      .json({ msg: error?.message || "Failed to deny friend request" });
  }
});

app.delete("/api/users/friends/:username", async (req, res) => {
  const authUser = getAuthenticatedUser(req);
  if (!authUser) return res.status(401).json({ msg: "Invalid token" });
  const caller = findUserById(authUser._id);
  if (!caller) return res.status(401).json({ msg: "User not found" });
  const username = String(req.params.username || "").trim();
  if (!username)
    return res.status(400).json({ msg: "Username is required" });
  try {
    const updated = chatUserStore.removeFriendRelationship(
      caller._id,
      username
    );
    return res.json({ ok: true, user: sanitizeUser(updated) });
  } catch (error) {
    return res
      .status(400)
      .json({ msg: error?.message || "Failed to remove friend" });
  }
});

// ─── Chat Effects Routes (mirrored from app.js) ───────────────────────────────

app.get("/api/chat-effects", async (req, res) => {
  const authUser = getAuthenticatedUser(req);
  if (!authUser) return res.status(401).json({ msg: "Invalid token" });
  const currentUser = findUserById(authUser._id);
  if (!currentUser) return res.status(404).json({ msg: "User not found" });
  return res.json({
    effects: chatEffects.listEffects(),
    user: sanitizeUser(currentUser),
  });
});

app.get("/api/chat-effects/rooms/:room", async (req, res) => {
  const authUser = getAuthenticatedUser(req);
  if (!authUser) return res.status(401).json({ msg: "Invalid token" });
  const room = String(req.params.room || "").trim().toLowerCase();
  if (!room) return res.status(400).json({ msg: "Room is required" });
  const roomEffect = chatNetState.getRoomEffect(room);
  return res.json({ room, roomEffect, user: sanitizeUser(findUserById(authUser._id)) });
});

app.post("/api/chat-effects/:effectId/purchase", async (req, res) => {
  const authUser = getAuthenticatedUser(req);
  if (!authUser) return res.status(401).json({ msg: "Invalid token" });
  try {
    const result = chatUserStore.purchaseEffect(
      authUser._id,
      req.params.effectId
    );
    return res.json({
      msg: `${result.effect.name} unlocked`,
      effect: result.effect,
      user: sanitizeUser(result.user),
    });
  } catch (error) {
    if (error?.code === "EFFECT_ALREADY_OWNED")
      return res.status(400).json({ msg: "Effect already owned" });
    if (error?.code === "INSUFFICIENT_COINS")
      return res.status(400).json({ msg: "Not enough coins" });
    return res.status(500).json({ msg: "Failed to purchase effect" });
  }
});

app.post("/api/chat-effects/equip", async (req, res) => {
  const authUser = getAuthenticatedUser(req);
  if (!authUser) return res.status(401).json({ msg: "Invalid token" });
  try {
    const result = chatUserStore.equipEffect(
      authUser._id,
      req.body?.effectId
    );
    chatIdentityStore.updateByUserId(authUser._id, {
      name: result.user.name,
      avatar: result.user.avatar || null,
      equippedEffect: result.user.equippedEffect || "none",
    });
    return res.json({
      msg:
        result.effect.id === "none"
          ? "Effect cleared"
          : `${result.effect.name} equipped`,
      effect: result.effect,
      user: sanitizeUser(result.user),
    });
  } catch (error) {
    return res.status(400).json({ msg: error?.message || "Failed to equip" });
  }
});

app.post("/api/chat-effects/rooms/:room/activate", async (req, res) => {
  const authUser = getAuthenticatedUser(req);
  if (!authUser) return res.status(401).json({ msg: "Invalid token" });
  const room = String(req.params.room || "").trim().toLowerCase();
  const effect = chatEffects.getEffect(req.body?.effectId);
  if (!room)
    return res.status(400).json({ msg: "Room is required" });
  if (!effect || effect.scope !== "room")
    return res.status(400).json({ msg: "Choose a valid room effect" });
  const currentUser = findUserById(authUser._id);
  if (!currentUser) return res.status(404).json({ msg: "User not found" });
  if (Math.max(0, Number(currentUser.coins || 0)) < effect.price)
    return res.status(400).json({ msg: "Not enough coins" });

  let updatedUser;
  try {
    updatedUser = chatUserStore.spendCoins(authUser._id, effect.price);
  } catch (error) {
    if (error?.code === "INSUFFICIENT_COINS")
      return res.status(400).json({ msg: "Not enough coins" });
    throw error;
  }
  const roomEffect = chatNetState.setRoomEffect(room, {
    effectId: effect.id,
    triggeredByUserId: currentUser._id,
    triggeredByName:
      currentUser.name || currentUser.username || "Unknown",
    triggeredByUsername: currentUser.username || null,
    price: effect.price,
    activatedAt: Date.now(),
    durationMs: Math.max(0, Number(effect.roomDurationMs || 0)),
  });

  if (globalThis.__nebuloChatIo) {
    globalThis.__nebuloChatIo.to(room).emit("room_effect", {
      effectId: effect.id,
      effectName: effect.name,
      room,
      triggeredByName: roomEffect.triggeredByName,
      activatedAt: roomEffect.activatedAt,
      durationMs: roomEffect.durationMs,
      expiresAt: roomEffect.expiresAt,
      roomEffect,
    });
  }

  return res.json({
    msg: `${effect.name} is now live in #${room}`,
    effect,
    roomEffect,
    user: sanitizeUser(updatedUser),
  });
});

app.post("/api/chat-effects/global/activate", async (req, res) => {
  const authUser = getAuthenticatedUser(req);
  if (!authUser) return res.status(401).json({ msg: "Invalid token" });
  const effect = chatEffects.getEffect(req.body?.effectId);
  const publicMessage = String(req.body?.message || "").trim();
  if (!effect || effect.scope !== "global")
    return res.status(400).json({ msg: "Choose a valid global effect" });
  if (!publicMessage)
    return res.status(400).json({ msg: "Message required" });
  if (publicMessage.length > 280)
    return res
      .status(400)
      .json({ msg: "Public messages are limited to 280 characters" });

  const currentUser = findUserById(authUser._id);
  if (!currentUser) return res.status(404).json({ msg: "User not found" });
  if (Math.max(0, Number(currentUser.coins || 0)) < effect.price)
    return res.status(400).json({ msg: "Not enough coins" });

  let updatedUser;
  try {
    updatedUser = chatUserStore.spendCoins(authUser._id, effect.price);
  } catch (error) {
    if (error?.code === "INSUFFICIENT_COINS")
      return res.status(400).json({ msg: "Not enough coins" });
    throw error;
  }

  if (globalThis.__nebuloChatIo) {
    globalThis.__nebuloChatIo.emit("global_effect", {
      effectId: effect.id,
      triggeredByName:
        currentUser.name || currentUser.username || "Unknown",
      message: publicMessage,
      price: effect.price,
      activatedAt: Date.now(),
      durationMs: effect.roomDurationMs || 8000,
    });
  }

  return res.json({
    msg: `${effect.name} is now live globally`,
    effect,
    user: sanitizeUser(updatedUser),
  });
});

// ─── Admin Routes ─────────────────────────────────────────────────────────────

app.get("/api/admin/overview", async (req, res) => {
  const authUser = getAuthenticatedUser(req);
  if (!authUser) return res.status(401).json({ msg: "Invalid token" });
  if (!isOwnerAccount(authUser))
    return res.status(403).json({ msg: "Owner access required" });
  try {
    const stats = await profileStore.getAdminStats();
    const presence = chatPresence.getCounts();
    const activeClients = Object.values(presence.rooms || {}).reduce(
      (sum, count) => sum + Number(count || 0),
      0
    );
    return res.json({
      stats: {
        ...stats,
        groups: chatGroups.getGroups().length,
        activeClients,
      },
      moderation: chatNetState.getModeration(),
    });
  } catch (error) {
    return res.status(503).json({ msg: "Could not load admin overview" });
  }
});

app.get("/api/admin/users", async (req, res) => {
  const authUser = getAuthenticatedUser(req);
  if (!authUser) return res.status(401).json({ msg: "Invalid token" });
  if (!isOwnerAccount(authUser))
    return res.status(403).json({ msg: "Owner access required" });
  try {
    const result = await profileStore.listAccounts({
      search: String(req.query.search || "").trim(),
      limit: Math.max(1, Math.min(50, Number(req.query.limit) || 20)),
      offset: Math.max(0, Number(req.query.offset) || 0),
    });
    return res.json({
      users: result.accounts,
      pagination: {
        total: result.total,
        limit: result.limit,
        offset: result.offset,
      },
    });
  } catch (error) {
    return res.status(503).json({ msg: "Could not load users" });
  }
});

app.post("/api/admin/coins/grant", async (req, res) => {
  const authUser = getAuthenticatedUser(req);
  if (!authUser) return res.status(401).json({ msg: "Invalid token" });
  if (!isOwnerAccount(authUser))
    return res.status(403).json({ msg: "Owner access required" });
  const targetId = String(req.body?.userId || "").trim();
  const targetName = String(req.body?.username || "").trim();
  const amount = Math.trunc(Number(req.body?.amount));
  if (!targetId && !targetName)
    return res.status(400).json({ msg: "Choose a user" });
  if (!Number.isFinite(amount) || amount < 1 || amount > 1_000_000) {
    return res
      .status(400)
      .json({ msg: "Coin amount must be between 1 and 1,000,000" });
  }
  try {
    const target = targetId
      ? await profileStore.findAccountById(targetId)
      : (
          await profileStore.findAccountByIdentifier(targetName)
        )?.account;
    if (!target)
      return res.status(404).json({ msg: "Profile not found" });
    const updated = await profileStore.adminGrantCoins(target.id, amount);
    return res.json({
      msg: `Added ${amount.toLocaleString()} coins to ${updated.username}`,
      user: updated,
    });
  } catch (error) {
    const status =
      error?.code === "USER_NOT_FOUND"
        ? 404
        : error?.code === "INVALID_AMOUNT"
          ? 400
          : 503;
    return res.status(status).json({ msg: error.message || "Could not grant coins" });
  }
});

// ─── Account Profile Routes ──────────────────────────────────────────────────

app.get("/api/account/profile", async (req, res) => {
  const account = await getAuthenticatedProfileAccount(req);
  if (!account)
    return res
      .status(401)
      .json({ msg: "Sign in with a database-backed Nebulo account" });
  return res.json({ profile: account });
});

app.put("/api/account/profile/avatar", async (req, res) => {
  const account = await getAuthenticatedProfileAccount(req);
  if (!account)
    return res.status(401).json({ msg: "Unauthorized" });
  const rawAvatar = req.body?.avatar;
  const avatar =
    rawAvatar == null || rawAvatar === "" ? null : String(rawAvatar).trim();
  if (avatar) {
    if (avatar.length > 400_000)
      return res.status(413).json({ msg: "Avatar too large" });
    if (
      !/^data:image\/(?:png|jpeg|webp|gif|avif);base64,[a-z0-9+/=\r\n]+$/i.test(
        avatar
      )
    )
      return res.status(400).json({ msg: "Invalid image format" });
  }
  try {
    const updated = await profileStore.updateAvatar(account.id, avatar);
    if (!updated)
      return res.status(404).json({ msg: "Profile not found" });
    const merged = mergeDatabaseAccountMetadata({
      ...account,
      ...updated,
      email: account.email,
    });
    return res.json({
      profile: merged,
      msg: avatar ? "Profile picture updated" : "Profile picture removed",
    });
  } catch (error) {
    return res.status(503).json({ msg: "Could not update avatar" });
  }
});

app.put("/api/account/profile/username", async (req, res) => {
  const account = await getAuthenticatedProfileAccount(req);
  if (!account)
    return res.status(401).json({ msg: "Unauthorized" });
  const username = String(req.body?.username || "").trim();
  if (!/^[a-zA-Z0-9_]{3,24}$/.test(username))
    return res
      .status(400)
      .json({
        msg: "Username must be 3–24 characters using letters, numbers, or underscores",
      });
  try {
    const updated = await profileStore.updateUsername(account.id, username);
    const merged = mergeDatabaseAccountMetadata(updated);
    chatIdentityStore.updateByUserId(account.id, {
      username,
      name: username,
    });
    return res.json({ profile: merged, msg: "Username updated" });
  } catch (error) {
    if (error?.code === "USERNAME_EXISTS")
      return res.status(409).json({ msg: error.message });
    return res.status(503).json({ msg: "Could not update username" });
  }
});

app.put("/api/account/profile/password", async (req, res) => {
  const account = await getAuthenticatedProfileAccount(req);
  if (!account)
    return res.status(401).json({ msg: "Unauthorized" });
  const currentPassword = String(req.body?.currentPassword || "");
  const newPassword = String(req.body?.newPassword || "");
  if (!currentPassword || !newPassword)
    return res
      .status(400)
      .json({ msg: "Current and new passwords are required" });
  if (newPassword.length < 8 || newPassword.length > 128)
    return res
      .status(400)
      .json({ msg: "Password must be 8–128 characters" });
  try {
    const credentials = await profileStore.findCredentialsById(account.id);
    if (!credentials)
      return res.status(404).json({ msg: "Account not found" });
    if (!(await verifyPassword(currentPassword, credentials.password_hash)))
      return res.status(400).json({ msg: "Current password is incorrect" });
    await profileStore.updatePassword(
      account.id,
      await bcrypt.hash(newPassword, 12)
    );
    return res.json({ msg: "Password updated" });
  } catch (error) {
    return res.status(503).json({ msg: "Could not update password" });
  }
});

// ─── Chat channels endpoint ──────────────────────────────────────────────────

app.get("/api/channels", async (req, res) => {
  return res.json([
    {
      _id: "global",
      room: "nebulo5_4",
      name: "#global",
      type: "public",
      isGlobal: true,
      onlineCount: 0,
    },
  ]);
});

app.get("/api/messages/:channel", async (req, res) => {
  return res.json({ messages: [] });
});

// ─── Static Files ─────────────────────────────────────────────────────────────

const chatPublicPath = path.resolve(__dirname, "chat-git-main", "public");

// Serve static files
app.use(
  "/modules",
  express.static(path.join(chatPublicPath, "modules"), {
    etag: true,
    maxAge: 3600,
  })
);
app.use("/assets", express.static(path.join(chatPublicPath, "assets"), {
  etag: true,
  maxAge: 3600,
}));

// notification-sw.js needs Service-Worker-Allowed header
app.get("/notification-sw.js", (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Service-Worker-Allowed", "/");
  res.sendFile(path.join(chatPublicPath, "notification-sw.js"));
});

// All other static files
app.use(express.static(chatPublicPath, { etag: true, maxAge: 3600 }));

// Fallback — serve index.html for all non-API routes (SPA-style)
app.get("*", (req, res) => {
  if (req.path.startsWith("/api/")) return res.status(404).json({ msg: "Not found" });
  res.setHeader("Cache-Control", "no-store");
  res.sendFile(path.join(chatPublicPath, "index.html"));
});

// ─── Start Server ─────────────────────────────────────────────────────────────

const PORT = Number(process.env.CHAT_PORT || 5050);

server.listen(PORT, "0.0.0.0", () => {
  console.log(`\n  ✓ Chat-only server running`);
  console.log(`    Local:   http://localhost:${PORT}`);
  console.log(`    Tunnel:  npx cloudflared tunnel --url http://localhost:${PORT}\n`);
});
