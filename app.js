import cluster from "node:cluster";
import { hostname as osHostname } from "node:os";
import { createServer } from "node:http";
import { createRequire } from "node:module";
import { randomUUID } from "node:crypto";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { performance } from "node:perf_hooks";
import Fastify from "fastify";
import { Server } from "socket.io";
import fastifyStatic from "@fastify/static";
import { server as wisp, logging } from "@mercuryworkshop/wisp-js/server";
import { scramjetPath } from "@mercuryworkshop/scramjet/path";
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";
import "dotenv/config";
import Ably from "ably";

const require = createRequire(import.meta.url);
const argonPlugin = require("./argon/argon-module.js");
const fastifyExpress = require("@fastify/express");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const express = require("express");
const jwt = require("jsonwebtoken");
const path = require("path");
const chatUserStore = require("./chat-git-main/services/auth/localStore");
const chatIdentityStore = require("./chat-git-main/services/network/identity");
const chatNetState = require("./chat-git-main/services/network/state");
const chatEffects = require("./chat-git-main/services/chat/effects");
const tlkRoutes = require("./chat-git-main/routes/tlk");

const libcurlPath = fileURLToPath(
  new URL("node_modules/@mercuryworkshop/libcurl-transport/dist/", import.meta.url)
);

// Default to a single worker in local/dev runs to avoid noisy crash-refork loops.
// Set WEB_CONCURRENCY>1 explicitly when you want clustering.
const parsedWorkers = parseInt(process.env.WEB_CONCURRENCY || "1", 10);
const WORKERS = Number.isFinite(parsedWorkers) && parsedWorkers > 0 ? parsedWorkers : 1;

if (cluster.isPrimary && WORKERS > 1) {
  for (let i = 0; i < WORKERS; i++) cluster.fork();
  cluster.on("exit", (worker, code, signal) => {
    // Avoid infinite crash loops during local startup failures.
    if (signal || code === 0) return;
    if (process.env.CLUSTER_REFORK === "0") return;
    cluster.fork();
  });
} else {
  const publicPath = fileURLToPath(new URL("public/", import.meta.url));
  const pagesPath = fileURLToPath(new URL("pages/", import.meta.url));
  const patchedBareMuxWorkerPath = fileURLToPath(
    new URL("public/assets/js/baremux-worker.js", import.meta.url)
  );
  const patchedBareMuxIndexJsPath = fileURLToPath(
    new URL("public/assets/js/baremux-index.js", import.meta.url)
  );
  const patchedBareMuxIndexMjsPath = fileURLToPath(
    new URL("public/assets/js/baremux-index.mjs", import.meta.url)
  );
  const patchedScramjetAllPath = fileURLToPath(
    new URL("public/assets/js/scramjet.all.js", import.meta.url)
  );
  const serviceWorkerPath = fileURLToPath(new URL("public/sw.js", import.meta.url));
  const JWT_SECRET = process.env.JWT_SECRET || "secret";

  const sanitizeUser = (user) => {
    const safe = chatUserStore.sanitizeUser(user);
    return safe ? { ...safe, id: safe._id || safe.id || "" } : null;
  };

  const findUserByUsername = (username) => chatUserStore.findByUsername(username);
  const findUserById = (userId) => chatUserStore.findById(userId);

  const signAuthToken = (user) =>
    jwt.sign({ user: { id: user?._id || user?.id } }, JWT_SECRET, { expiresIn: "24h" });

  const verifyPassword = async (inputPassword, storedPassword) => {
    if (typeof storedPassword !== "string" || !storedPassword.length) return false;
    const password = String(inputPassword || "");
    if (/^\$2[aby]\$\d+\$/.test(storedPassword)) {
      return bcrypt.compare(password, storedPassword);
    }
    return password === storedPassword;
  };

  const getAuthenticatedUser = (req) => {
    const headerToken = req.headers["x-auth-token"];
    const bearerToken = String(req.headers.authorization || "").replace(/^Bearer\s+/i, "").trim();
    const token = String(headerToken || bearerToken || "").trim();
    if (!token) return null;

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      return findUserById(decoded?.user?.id) || null;
    } catch {
      return null;
    }
  };

  logging.set_level(logging.NONE);
  Object.assign(wisp.options, {
    allow_udp_streams: false,
    hostname_blacklist: [],
  });

  const fastify = Fastify({
    logger: false,
    trustProxy: true,
    bodyLimit: 1024 * 1024,
    pluginTimeout: 20000,
    requestTimeout: 30000,
    keepAliveTimeout: 65000,
    connectionTimeout: 30000,
    routerOptions: {
      ignoreTrailingSlash: true,
      maxParamLength: 4096,
    },
    serverFactory: (handler) => {
      const server = createServer((req, res) => handler(req, res));
      server.keepAliveTimeout = 65000;
      server.headersTimeout = 70000;

      server.on("upgrade", (req, socket, head) => {
        try {
          const host = req.headers.host || "localhost";
          const url = new URL(req.url || "/", `http://${host}`);
          const path = url.pathname;

          if (path === "/wisp" || path.startsWith("/wisp/") || path === "/blockwisp" || path.startsWith("/blockwisp/")) {
            wisp.routeRequest(req, socket, head);
            return;
          }

          socket.write(
            "HTTP/1.1 404 Not Found\r\n" +
              "Connection: close\r\n" +
              "Content-Length: 0\r\n\r\n"
          );
          socket.destroy();
        } catch {
          try {
            socket.destroy();
          } catch {}
        }
      });

      return server;
    },
  });

  const io = new Server(fastify.server, {
    path: "/socket.io/",
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    socket.on("join_room", (roomId) => {
      socket.join(roomId);
    });

    socket.on("leave_room", (roomId) => {
      socket.leave(roomId);
    });

    socket.on("send_message", (data) => {
      io.to(data.roomId).emit("receive_message", data);
    });

    socket.on("typing", (data) => {
      socket.to(data.roomId).emit("user_typing", data);
    });
  });

  // libcurl-transport and some proxy stacks benefit from cross-origin isolation (SharedArrayBuffer).
  // Apply globally so both app pages and proxied content can opt into it consistently.
  fastify.addHook("onSend", async (req, reply, payload) => {
    reply.header("Cross-Origin-Opener-Policy", "same-origin");
    // Use credentialless so existing CDN assets/ads aren't blocked by COEP require-corp.
    reply.header("Cross-Origin-Embedder-Policy", "credentialless");
    return payload;
  });

  const ONE_HOUR = 60 * 60;

  // Mount the original K-Chat Express routers for the chat APIs that already
  // handle TLK rooms, presence, moderation, and persisted room metadata.
  await fastify.register(fastifyExpress);
  fastify.use(cors());
  fastify.use(express.json({ limit: "1mb" }));
  fastify.use(express.urlencoded({ extended: true, limit: "1mb" }));
  fastify.use("/api/network", require("./chat-git-main/routes/network"));
  fastify.use("/api/tlk", tlkRoutes);

  // Now register static after API routes
  fastify.register(fastifyStatic, {
    root: pagesPath,
    prefix: "/pages/",
    decorateReply: false,
    etag: true,
    maxAge: ONE_HOUR,
    setHeaders: (res, pathName) => {
      res.setHeader("Cache-Control", "public, max-age=3600, immutable");
      if (pathName.endsWith(".html")) res.setHeader("Cache-Control", "no-store");
    },
  });

  fastify.register(fastifyStatic, {
    root: publicPath,
    decorateReply: true,
    etag: true,
    maxAge: ONE_HOUR,
    setHeaders: (res, pathName) => {
      // Some runtime scripts are extremely sensitive to caching during development and updates.
      // If the browser holds onto an old copy, the proxy stack can appear "broken" even after fixes.
      try {
        const p = String(pathName || "").replace(/\\/g, "/");
        if (
          p.endsWith("/assets/js/proxy-runtime.js") ||
          p.endsWith("/assets/js/proxy-encoder.js") ||
          p.endsWith("/assets/js/search.js") ||
          p.endsWith("/assets/js/baremux-port-bridge.js") ||
          p.endsWith("/uv/uv.config.js") ||
          p.endsWith("/uv/uv.bundle.js") ||
          p.endsWith("/uv/uv.client.js") ||
          p.endsWith("/uv/uv.sw.js") ||
          p.endsWith("/uv/uv.handler.js") ||
          // Some builds mount Eclipse under /ec/ and others under /eclipse/.
          p.endsWith("/ec/eclipse.codecs.js") ||
          p.endsWith("/ec/eclipse.config.js") ||
          p.endsWith("/ec/eclipse.rewrite.js") ||
          p.endsWith("/ec/eclipse.worker.js") ||
          p.endsWith("/ec/eclipse.client.js") ||
          p.endsWith("/eclipse/eclipse.codecs.js") ||
          p.endsWith("/eclipse/eclipse.config.js") ||
          p.endsWith("/eclipse/eclipse.rewrite.js") ||
          p.endsWith("/eclipse/eclipse.worker.js") ||
          p.endsWith("/eclipse/eclipse.client.js") ||
          // Scramjet/MathJet runtime is sensitive to caching during iteration.
          p.endsWith("/scram/mathjet.shared.js")
        ) {
          res.setHeader("Cache-Control", "no-store");
          return;
        }
      } catch {}

      if (pathName.endsWith(".html")) {
        res.setHeader("Cache-Control", "no-store");
      } else if (/\.(js|mjs|css|png|jpg|jpeg|gif|svg|ico|woff2?|ttf|map|wasm)$/.test(pathName)) {
        res.setHeader("Cache-Control", "public, max-age=3600, immutable");
      } else {
        res.setHeader("Cache-Control", "public, max-age=300");
      }
    },
  });

   // Chat paths (chat-git-main)
   const chatGitClientPath = fileURLToPath(new URL("chat-git-main/client/public", import.meta.url));

  // Debug route
  fastify.get("/debug", async (req, reply) => {
    return { msg: "debug works" };
  });

  fastify.post("/api/auth", async (req, reply) => {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return reply.status(400).send({ msg: "Username and password required" });
    }
    const user = findUserByUsername(username);
    if (!user) {
      return reply.status(400).send({ msg: "Username not found" });
    }
    const isMatch = await verifyPassword(password, user.password);
    if (!isMatch) {
      return reply.status(400).send({ msg: "Incorrect password" });
    }
    return { token: signAuthToken(user), user: sanitizeUser(user) };
  });

  fastify.get("/api/auth", async (req, reply) => {
    const user = getAuthenticatedUser(req);
    if (!user) {
      return reply.status(401).send({ msg: "No token" });
    }
    return sanitizeUser(user);
  });

  // Registration
  fastify.post("/api/users", async (req, reply) => {
    const { username, password, name } = req.body || {};
    if (!username || !password) {
      return reply.status(400).send({ msg: "Username and password required" });
    }
    const existing = findUserByUsername(username);
    if (existing) {
      return reply.status(400).send({ msg: "Username already exists" });
    }
    try {
      const user = chatUserStore.createUser({
        username: String(username).trim(),
        name: String(name || username).trim(),
        passwordHash: await bcrypt.hash(String(password), 10)
      });
      return { token: signAuthToken(user), user: sanitizeUser(user) };
    } catch (error) {
      if (error?.code === "USERNAME_RESERVED") {
        return reply.status(400).send({ msg: 'Username "moderation" is reserved' });
      }
      if (error?.code === "USERNAME_EXISTS") {
        return reply.status(400).send({ msg: "Username already exists" });
      }
      return reply.status(500).send({ msg: "Failed to create user" });
    }
  });

  fastify.get("/api/channels", async (req, reply) => {
    return [
      { _id: "global", room: "nebulo5_4", name: "#global", type: "public", isGlobal: true, onlineCount: 0 }
    ];
  });

  fastify.get("/api/messages/:channel", async (req, reply) => {
    return { messages: [] };
  });

  // Users list
  fastify.get("/api/users", async (req, reply) => {
    const user = getAuthenticatedUser(req);
    if (!user) {
      return reply.status(401).send({ msg: "Invalid token" });
    }
    return chatUserStore.listUsers().map(sanitizeUser);
  });

  fastify.put("/api/users/profile", async (req, reply) => {
    const authUser = getAuthenticatedUser(req);
    if (!authUser) {
      return reply.status(401).send({ msg: "Invalid token" });
    }

    const { name, avatar } = req.body || {};
    if (avatar && String(avatar).length > 2_000_000) {
      return reply.status(400).send({ msg: "Avatar too large" });
    }

    const updatedUser = chatUserStore.updateProfile(authUser._id, {
      name,
      avatar
    });
    if (!updatedUser) {
      return reply.status(404).send({ msg: "User not found" });
    }

    chatIdentityStore.updateByUserId(authUser._id, {
      name: updatedUser.name,
      avatar: updatedUser.avatar || null,
      equippedEffect: updatedUser.equippedEffect || "none"
    });

    return { user: sanitizeUser(updatedUser), msg: "Profile updated successfully" };
  });

  fastify.post("/api/users/transfer-coins", async (req, reply) => {
    const authUser = getAuthenticatedUser(req);
    if (!authUser) {
      return reply.status(401).send({ msg: "Invalid token" });
    }

    const rawRecipient = String(req.body?.username || req.body?.recipient || "").trim();
    const amount = Math.floor(Number(req.body?.amount || 0));
    if (!rawRecipient) {
      return reply.status(400).send({ msg: "Recipient username required" });
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      return reply.status(400).send({ msg: "Amount must be greater than 0" });
    }

    const recipient = chatUserStore.findByUsername(rawRecipient);
    if (!recipient) {
      return reply.status(404).send({ msg: "Recipient not found" });
    }

    try {
      const result = chatUserStore.transferCoins(authUser._id, recipient._id, amount);
      return {
        msg: `Sent ${result.amount} coin${result.amount === 1 ? "" : "s"} to ${result.toUser.name || result.toUser.username}`,
        amount: result.amount,
        recipient: sanitizeUser(result.toUser),
        user: sanitizeUser(result.fromUser)
      };
    } catch (error) {
      if (error?.code === "SAME_USER") {
        return reply.status(400).send({ msg: "You can't send coins to yourself" });
      }
      if (error?.code === "INSUFFICIENT_COINS") {
        return reply.status(400).send({ msg: "Not enough coins" });
      }
      if (error?.code === "INVALID_AMOUNT") {
        return reply.status(400).send({ msg: "Amount must be greater than 0" });
      }
      if (error?.code === "USER_NOT_FOUND") {
        return reply.status(404).send({ msg: "Recipient not found" });
      }
      return reply.status(500).send({ msg: "Failed to send coins" });
    }
  });

  fastify.put("/api/users/password", async (req, reply) => {
    const authUser = getAuthenticatedUser(req);
    if (!authUser) {
      return reply.status(401).send({ msg: "Invalid token" });
    }

    const { currentPassword, newPassword } = req.body || {};
    if (!currentPassword || !newPassword) {
      return reply.status(400).send({ msg: "Current and new password required" });
    }
    if (String(newPassword).length < 6) {
      return reply.status(400).send({ msg: "New password must be at least 6 characters" });
    }

    const user = findUserById(authUser._id);
    if (!user) {
      return reply.status(404).send({ msg: "User not found" });
    }

    const isMatch = await verifyPassword(currentPassword, user.password);
    if (!isMatch) {
      return reply.status(400).send({ msg: "Incorrect current password" });
    }

    chatUserStore.updatePassword(user._id, await bcrypt.hash(String(newPassword), 10));
    return { msg: "Password updated successfully" };
  });

  fastify.get("/api/chat-effects", async (req, reply) => {
    const authUser = getAuthenticatedUser(req);
    if (!authUser) {
      return reply.status(401).send({ msg: "Invalid token" });
    }
    const currentUser = findUserById(authUser._id);
    if (!currentUser) {
      return reply.status(404).send({ msg: "User not found" });
    }
    return {
      effects: chatEffects.listEffects(),
      user: sanitizeUser(currentUser)
    };
  });

  fastify.get("/api/chat-effects/rooms/:room", async (req, reply) => {
    const authUser = getAuthenticatedUser(req);
    if (!authUser) {
      return reply.status(401).send({ msg: "Invalid token" });
    }

    const room = String(req.params.room || "").trim().toLowerCase();
    if (!room) {
      return reply.status(400).send({ msg: "Room is required" });
    }

    const roomEffect = chatNetState.getRoomEffect(room);
    return {
      room,
      roomEffect,
      user: sanitizeUser(findUserById(authUser._id))
    };
  });

  fastify.post("/api/chat-effects/:effectId/purchase", async (req, reply) => {
    const authUser = getAuthenticatedUser(req);
    if (!authUser) {
      return reply.status(401).send({ msg: "Invalid token" });
    }

    try {
      const result = chatUserStore.purchaseEffect(authUser._id, req.params.effectId);
      return {
        msg: `${result.effect.name} unlocked`,
        effect: result.effect,
        user: sanitizeUser(result.user)
      };
    } catch (error) {
      if (error?.code === "EFFECT_ALREADY_OWNED") {
        return reply.status(400).send({ msg: "Effect already owned" });
      }
      if (error?.code === "INSUFFICIENT_COINS") {
        return reply.status(400).send({ msg: "Not enough coins" });
      }
      if (error?.code === "EFFECT_NOT_FOUND") {
        return reply.status(404).send({ msg: "Effect not found" });
      }
      if (error?.code === "USER_NOT_FOUND") {
        return reply.status(404).send({ msg: "User not found" });
      }
      return reply.status(500).send({ msg: "Failed to purchase effect" });
    }
  });

  fastify.post("/api/chat-effects/equip", async (req, reply) => {
    const authUser = getAuthenticatedUser(req);
    if (!authUser) {
      return reply.status(401).send({ msg: "Invalid token" });
    }

    try {
      const result = chatUserStore.equipEffect(authUser._id, req.body?.effectId);
      chatIdentityStore.updateByUserId(authUser._id, {
        name: result.user.name,
        avatar: result.user.avatar || null,
        equippedEffect: result.user.equippedEffect || "none"
      });
      return {
        msg: result.effect.id === "none" ? "Effect cleared" : `${result.effect.name} equipped`,
        effect: result.effect,
        user: sanitizeUser(result.user)
      };
    } catch (error) {
      if (error?.code === "EFFECT_NOT_OWNED") {
        return reply.status(400).send({ msg: "Effect not owned" });
      }
      if (error?.code === "EFFECT_NOT_FOUND") {
        return reply.status(404).send({ msg: "Effect not found" });
      }
      if (error?.code === "USER_NOT_FOUND") {
        return reply.status(404).send({ msg: "User not found" });
      }
      return reply.status(500).send({ msg: "Failed to equip effect" });
    }
  });

  fastify.post("/api/chat-effects/rooms/:room/activate", async (req, reply) => {
    const authUser = getAuthenticatedUser(req);
    if (!authUser) {
      return reply.status(401).send({ msg: "Invalid token" });
    }

    const room = String(req.params.room || "").trim().toLowerCase();
    const effect = chatEffects.getEffect(req.body?.effectId);
    if (!room) {
      return reply.status(400).send({ msg: "Room is required" });
    }
    if (!effect || effect.id === "none") {
      return reply.status(400).send({ msg: "Choose a valid room effect" });
    }

    const currentUser = findUserById(authUser._id);
    if (!currentUser) {
      return reply.status(404).send({ msg: "User not found" });
    }
    if (Math.max(0, Number(currentUser.coins || 0)) < effect.price) {
      return reply.status(400).send({ msg: "Not enough coins" });
    }

    const updatedUser = chatUserStore.grantCoins(authUser._id, -effect.price);
    const roomEffect = chatNetState.setRoomEffect(room, {
      effectId: effect.id,
      triggeredByUserId: currentUser._id,
      triggeredByName: currentUser.name || currentUser.username || "Unknown",
      triggeredByUsername: currentUser.username || null,
      price: effect.price,
      activatedAt: Date.now()
    });

    Promise.resolve().then(() =>
      tlkRoutes.postRoomNote(
        room,
        `${roomEffect.triggeredByName} activated the ${effect.name} room effect for ${effect.price} coin${effect.price === 1 ? "" : "s"}.`,
        tlkRoutes.SYSTEM_BOT_NAME || "System"
      )
    ).catch(() => {});

    return {
      msg: `${effect.name} is now live in #${room}`,
      effect,
      roomEffect,
      user: sanitizeUser(updatedUser)
    };
  });

  // OpenBullet
  fastify.get("/api/openbullet/status", async (req, reply) => {
    return { status: "ok" };
  });

  fastify.get("/api/openbullet/automation/status", async (req, reply) => {
    return { status: "ok" };
  });

  // Chat static files
  fastify.get("/chat", (req, reply) => {
    reply.header("Cache-Control", "no-store");
    return reply.sendFile("app.js", publicPath);
  });

  fastify.get("/chat/*", (req, reply) => {
    reply.header("Cache-Control", "no-store");
    return reply.sendFile("app.js", publicPath);
  });

  fastify.get("/app.js", (req, reply) => {
    return reply.sendFile("app.js", publicPath);
  });

  fastify.get("/chatonly", (req, reply) => reply.redirect("/chat", 302));
  fastify.get("/chatonly.html", (req, reply) => reply.redirect("/chat", 302));

  // K-Chat (chat-git-main) routes
  fastify.get("/kchat", (req, reply) => {
    reply.header("Cache-Control", "no-store");
    return reply.sendFile("index.html", chatGitClientPath);
  });

  fastify.get("/kchat/*", (req, reply) => {
    reply.header("Cache-Control", "no-store");
    return reply.sendFile("index.html", chatGitClientPath);
  });

  fastify.get("/kchat/app.js", (req, reply) => {
    return reply.sendFile("app.js", chatGitClientPath);
  });

  fastify.get("/kchat/app.css", (req, reply) => {
    return reply.sendFile("app.css", chatGitClientPath);
  });

  // Override scramjet.all.js with our patched copy (no-store) so bare-mux changes
  // take effect immediately and survive `npm install`.
  fastify.get("/scram/scramjet.all.js", (req, reply) => {
    reply.header("Cache-Control", "no-store");
    reply.type("application/javascript; charset=utf-8");
    return reply.send(fs.createReadStream(patchedScramjetAllPath));
  });

  fastify.register(fastifyStatic, {
    root: scramjetPath,
    prefix: "/scram/",
    decorateReply: false,
    etag: true,
    maxAge: ONE_HOUR,
    setHeaders: (res, pathName) => {
      // Scramjet runtime scripts are sensitive to caching during iteration.
      // If the browser holds onto an old copy, service worker + bare-mux behavior can look "stuck".
      try {
        const p = String(pathName || "").replace(/\\/g, "/");
        if (p.endsWith("/scramjet.all.js")) {
          res.setHeader("Cache-Control", "no-store");
          return;
        }
      } catch {}
      res.setHeader("Cache-Control", "public, max-age=3600, immutable");
    },
  });

  fastify.register(fastifyStatic, {
    root: epoxyPath,
    prefix: "/epoxy/",
    decorateReply: false,
    etag: true,
    maxAge: ONE_HOUR,
    setHeaders: (res) => res.setHeader("Cache-Control", "public, max-age=3600, immutable"),
  });

  // Override only /baremux/worker.js with our patched worker to prevent libcurl
  // "Unsupported protocol" crashes on blob:/data: requests.
  fastify.get("/baremux/worker.js", (req, reply) => {
    reply.header("Cache-Control", "no-store");
    reply.type("application/javascript; charset=utf-8");
    return reply.send(fs.createReadStream(patchedBareMuxWorkerPath));
  });

  // Override bare-mux index entrypoints to increase the SW-side port acquisition
  // timeout. The upstream 1s timeout is too aggressive and can cause infinite
  // retries after refresh / site-data clears.
  fastify.get("/baremux/index.js", (req, reply) => {
    reply.header("Cache-Control", "no-store");
    reply.type("application/javascript; charset=utf-8");
    return reply.send(fs.createReadStream(patchedBareMuxIndexJsPath));
  });

  fastify.get("/baremux/index.mjs", (req, reply) => {
    reply.header("Cache-Control", "no-store");
    reply.type("application/javascript; charset=utf-8");
    return reply.send(fs.createReadStream(patchedBareMuxIndexMjsPath));
  });

  // Service workers should never be cached as immutable; it can prevent updates.
  fastify.get("/sw.js", (req, reply) => {
    reply.header("Cache-Control", "no-store");
    reply.type("application/javascript; charset=utf-8");
    return reply.send(fs.createReadStream(serviceWorkerPath));
  });

  fastify.register(fastifyStatic, {
    root: baremuxPath,
    prefix: "/baremux/",
    decorateReply: false,
    etag: true,
    maxAge: ONE_HOUR,
    setHeaders: (res) => res.setHeader("Cache-Control", "public, max-age=3600, immutable"),
  });

  fastify.register(fastifyStatic, {
    root: libcurlPath,
    prefix: "/libcurl/",
    decorateReply: false,
    etag: true,
    maxAge: ONE_HOUR,
    setHeaders: (res) => res.setHeader("Cache-Control", "public, max-age=3600, immutable"),
  });

  fastify.register(argonPlugin, {
    token_prefix: "/ag/",
    use_not_found_fallback: false,
  });

  // Serve the interstitial at the root
  fastify.get("/", (req, reply) => {
    reply.header("Cache-Control", "no-store");
    return reply.sendFile("error.html");
  });

  const pages = [
    //{ path: "/", file: "ri.html" },
    { path: "/@", file: "ri.html" },
    { path: "/lessons", file: "gs.html" },
    { path: "/tools", file: "ap.html" },
    { path: "/quiz", file: "ri.html" },
    { path: "/settings", file: "st.html" },
    { path: "/test", file: "s.html" },
    { path: "/search", file: "s.html" },
    { path: "/helper", file: "ai.html" },
    { path: "/help", file: "hp.html" },
    { path: "/tool", file: "tl.html" },
    { path: "/blocked", file: "bd.html" },
    { path: "/links", file: "ln.html" },
    { path: "/bug", file: "rp.html" },
    { path: "/whatsnew", file: "wn.html" },
    { path: "/achievements", file: "ac.html" },
    { path: "/watch", file: "wt.html" },
    { path: "/geometry", file: "gm.html" },
    { path: "/chemistry", file: "ch.html" },
    { path: "/fan-made-activities", file: "fan-made-activities.html" },
    { path: "/fan-game-player", file: "fan-game-player.html" },
    { path: "/secret", file: "sc.html" },
  ];

  for (const page of pages) {
    fastify.get(page.path, (req, reply) => {
      reply.header("Cache-Control", "no-store");
      return reply.sendFile(page.file);
    });
  }

  const legacyPageRedirects = [
    ["/rindex.html", "/"],
    ["/search.html", "/search"],
    ["/settings.html", "/settings"],
    ["/secret.html", "/secret"],
    ["/games.html", "/lessons"],
    ["/apps.html", "/tools"],
    ["/help.html", "/help"],
    ["/tools.html", "/tool"],
    ["/blocked.html", "/blocked"],
    ["/links.html", "/links"],
    ["/report.html", "/bug"],
    ["/whatsnew.html", "/whatsnew"],
    ["/achievements.html", "/achievements"],
    ["/watch.html", "/watch"],
    ["/geometry.html", "/geometry"],
    ["/chemistry.html", "/chemistry"],
    ["/fan-made-activities.html", "/fan-made-activities"],
    ["/fan-game-player.html", "/fan-game-player"],
    ["/404.html", "/search"],
    ["/themes.css", "/assets/css/themes.css"],
    ["/themes.js", "/assets/js/themes.js"],
  ];

  for (const [from, to] of legacyPageRedirects) {
    fastify.get(from, (req, reply) => reply.redirect(to, 302));
  }

  // Global fallback for stale SW/cache states:
  // 1) legacy hvtrs/hvttr paths -> UV service
  // 2) accidental /uv/service/assets/* and /uv/service/themes.* -> local assets
  fastify.addHook("onRequest", async (req, reply) => {
    const rawUrl = String(req?.raw?.url || "");
    const qIndex = rawUrl.indexOf("?");
    const pathname = qIndex === -1 ? rawUrl : rawUrl.slice(0, qIndex);
    const search = qIndex === -1 ? "" : rawUrl.slice(qIndex);

    let normalizedPath = pathname || "/";
    // Be careful decoding Ultraviolet XOR payloads: they can legitimately contain "%25xx"
    // sequences. Only decode when it looks like a truly double-encoded UV payload.
    try {
      if (normalizedPath.startsWith("/uv/service/")) {
        const payload = normalizedPath.slice("/uv/service/".length);
        const head = payload.slice(0, 48);
        const looksDoubleEncoded = head.includes("%252F") || head.includes("%253A");
        if (looksDoubleEncoded) {
          const decodedPayload = decodeURIComponent(payload);
          if (decodedPayload) normalizedPath = "/uv/service/" + decodedPayload;
        }
      } else {
        const decoded = decodeURIComponent(normalizedPath);
        if (decoded) normalizedPath = decoded;
      }
    } catch {}

    if (/^\/uv\/service\/hvt(?:rs|tr)/i.test(normalizedPath)) {
      const payload = normalizedPath.slice("/uv/service/".length);
      const extracted = extractLegacyHvtrsPayload(payload);
      if (extracted && extracted !== payload) {
        return reply.redirect(`/uv/service/${extracted}${search}`, 307);
      }
      const normalizedPayload = normalizeLegacyHvtrsPayload(payload);
      if (normalizedPayload && normalizedPayload !== payload) {
        return reply.redirect(`/uv/service/${normalizedPayload}${search}`, 307);
      }
      // Important: don't run generic hvtrs redirects for already-routed UV paths.
      return;
    }

    const extractedPayload = extractLegacyHvtrsPayload(normalizedPath);
    if (extractedPayload) {
      return redirectLegacyHvtrs(req, reply, extractedPayload);
    }

    if (/^\/?hvt(?:rs|tr)/i.test(normalizedPath)) {
      return redirectLegacyHvtrs(req, reply);
    }

    if (normalizedPath.startsWith("/uv/service/assets/")) {
      const localAssetPath = normalizedPath.slice("/uv/service/".length);
      return reply.redirect(`/${localAssetPath}${search}`, 307);
    }

    if (normalizedPath === "/uv/service/themes.css") {
      return reply.redirect(`/assets/css/themes.css${search}`, 307);
    }
    if (normalizedPath === "/uv/service/themes.js") {
      return reply.redirect(`/assets/js/themes.js${search}`, 307);
    }
  });

  function redirectLegacyHvtrs(req, reply, extractedOverride = "") {
    const rawUrl = String(req?.raw?.url || "");
    const qIndex = rawUrl.indexOf("?");
    const pathname = qIndex === -1 ? rawUrl : rawUrl.slice(0, qIndex);
    const search = qIndex === -1 ? "" : rawUrl.slice(qIndex);
    let encoded = extractedOverride || (pathname.startsWith("/") ? pathname.slice(1) : pathname);
    try {
      const decodedOnce = decodeURIComponent(encoded);
      if (decodedOnce && decodedOnce !== encoded) encoded = decodedOnce;
    } catch {}
    encoded = encoded.replace(/^\/+/, "");
    encoded = normalizeLegacyHvtrsPayload(encoded);
    if (!encoded) return reply.redirect("/search", 302);
    return reply.redirect(`/uv/service/${encoded}${search}`, 307);
  }

  function extractLegacyHvtrsPayload(pathname) {
    const src = String(pathname || "");
    // Find hvtrs/hvttr payload even if it appears in the middle of the path.
    // Supports both slash and encoded slash forms: hvtrs8/-... and hvtrs8%2F-...
    const m = src.match(/hvt(?:rs|tr)\d*(?:\/-|%2F-).*/i);
    if (!m || !m[0]) return "";
    return normalizeLegacyHvtrsPayload(m[0]);
  }

  function normalizeLegacyHvtrsPayload(payload) {
    let out = String(payload || "");
    if (!/^hvt(?:rs|tr)/i.test(out)) return out;
    // Canonicalize encoded legacy separators in the hvtrs prefix segment.
    // Example: hvtrs8%2F-... -> hvtrs8/-...
    out = out
      .replace(/^(hvt(?:rs|tr)\d*)%2F-/i, "$1/-")
      .replace(/^(hvt(?:rs|tr)\d*)%3A%2F%2F/i, "$1://");
    // Keep normal UV XOR payloads intact after canonicalizing the leading separator.
    //
    // IMPORTANT: XOR payloads can legitimately contain "%25xx" sequences inside query params.
    // Decoding on "any %25xx" can corrupt valid payloads and lead to UV decodeUrl() errors.
    //
    // Only attempt a decode when the *leading* portion looks like a double-encoded payload
    // (e.g. hvtrs8%252F-... or hvtrs8%253A%252F%252F...).
    const head = out.slice(0, 48);
    const looksDoubleEncoded = head.includes("%252F") || head.includes("%253A");
    if (looksDoubleEncoded) {
      try {
        const decoded = decodeURIComponent(out);
        if (/^hvt(?:rs|tr)/i.test(decoded) && decoded.includes("%2F-")) {
          out = decoded;
        }
      } catch {}
    }
    return out;
  }

  fastify.setNotFoundHandler((req, reply) => {
    reply.header("Cache-Control", "no-store");
    const path = req?.raw?.url ? String(req.raw.url).split("?")[0] : "";
    let normalizedPath = path;
    try {
      const decodedPath = decodeURIComponent(path);
      if (decodedPath) normalizedPath = decodedPath;
    } catch {}
    if (!normalizedPath.startsWith("/uv/service/")) {
      const extractedPayload = extractLegacyHvtrsPayload(normalizedPath);
      if (extractedPayload) {
        return redirectLegacyHvtrs(req, reply, extractedPayload);
      }
      if (/^\/+hvt(?:rs|tr)/i.test(normalizedPath) || /^hvt(?:rs|tr)/i.test(normalizedPath)) {
        return redirectLegacyHvtrs(req, reply);
      }
    }
    const accept = String(req.headers.accept || "");
    const userNav = String(req.headers["sec-fetch-user"] || "") === "?1";
    const proxyOrRuntimePath =
      path.startsWith("/uv/") ||
      path.startsWith("/ec/") ||
      path.startsWith("/ag/") ||
      path.startsWith("/scram/") ||
      path.startsWith("/scramjet/") ||
      path.startsWith("/scram/service/") ||
      path.startsWith("/service/scramjet/") ||
      path.startsWith("/baremux/") ||
      path.startsWith("/epoxy/") ||
      path.startsWith("/_next/") ||
      path.startsWith("/images/") ||
      path.startsWith("/unified/") ||
      path === "/argon_service_worker.js" ||
      path === "/service-worker.js";

    if (accept.includes("text/html") && userNav && !proxyOrRuntimePath) {
      return reply.redirect("/search");
    }
    return reply.code(404).sendFile("nf.html");
  });

  const bans = new Map();
  const BAN_DURATION_MS = 45 * 60 * 1000;
  const BAN_CLEANUP_MS = 60 * 1000;

  function isBanned(fingerprint) {
    const entry = bans.get(fingerprint);
    if (!entry) return false;
    if (Date.now() >= entry.until) {
      bans.delete(fingerprint);
      return false;
    }
    return true;
  }

  setInterval(() => {
    const now = Date.now();
    for (const [k, v] of bans.entries()) {
      if (now >= v.until) bans.delete(k);
    }
  }, BAN_CLEANUP_MS).unref();

  const FILTER_CACHE_TTL_MS = 60 * 1000;
  const filterCache = new Map();

  function cacheGet(key) {
    const hit = filterCache.get(key);
    if (!hit) return null;
    if (Date.now() > hit.exp) {
      filterCache.delete(key);
      return null;
    }
    return hit.val;
  }

  function cacheSet(key, val, ttl = FILTER_CACHE_TTL_MS) {
    filterCache.set(key, { val, exp: Date.now() + ttl });
  }

  async function fetchJsonWithTimeout(url, timeoutMs = 8000) {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, { signal: controller.signal, headers: { "accept": "application/json" } });
      if (!res.ok) throw new Error(`Upstream ${res.status}`);
      return await res.json();
    } finally {
      clearTimeout(t);
    }
  }

  fastify.get("/filters/:provider/check/:url", async (request, reply) => {
    const { provider, url } = request.params;
    if (!url) return reply.code(400).send({ error: "Missing URL parameter" });

    const key = `${provider}:${url}`;
    const cached = cacheGet(key);
    if (cached) {
      reply.header("Cache-Control", "private, max-age=30");
      return cached;
    }

    try {
      const data = await fetchJsonWithTimeout(
        `https://check.nebulo.network/filters/${provider}/check/${encodeURIComponent(url)}`,
        8000
      );
      cacheSet(key, data);
      reply.header("Cache-Control", "private, max-age=30");
      return data;
    } catch (err) {
      return reply.code(502).send({ error: "Failed to fetch data", details: err?.message || String(err) });
    }
  });

  fastify.post("/api/check-ban", async (req, reply) => {
    const { fingerprint } = req.body || {};
    if (!fingerprint) return reply.code(400).send({ error: "No fingerprint" });
    return reply.send({ banned: isBanned(fingerprint) });
  });

  // Compatibility: some clients accidentally call GET /api/check-ban.
  fastify.get("/api/check-ban", async (req, reply) => {
    const fingerprint = String(req?.query?.fingerprint || "").trim();
    if (!fingerprint) return reply.send({ banned: false });
    return reply.send({ banned: isBanned(fingerprint) });
  });

  fastify.post("/api/ban-time", async (req, reply) => {
    const { fingerprint } = req.body || {};
    if (!fingerprint) return reply.code(400).send({ error: "No fingerprint" });
    const entry = bans.get(fingerprint);
    if (!entry || Date.now() >= entry.until) {
      if (entry) bans.delete(fingerprint);
      return reply.send({ remainingMinutes: 0 });
    }
    const remaining = Math.ceil((entry.until - Date.now()) / 60000);
    return reply.send({ remainingMinutes: remaining > 0 ? remaining : 0 });
  });

  fastify.post("/api/ban", async (req, reply) => {
    const { fingerprint } = req.body || {};
    if (!fingerprint) return reply.code(400).send({ error: "No fingerprint" });
    const until = Date.now() + BAN_DURATION_MS;
    bans.set(fingerprint, { until });
    return reply.send({ success: true, bannedUntil: new Date(until).toISOString() });
  });

  fastify.post("/api/unban", async (req, reply) => {
    const { fingerprint, password } = req.body || {};
    if (!fingerprint || !password) return reply.code(400).send({ success: false, error: "Missing parameters" });
    if (password !== "Car0613!") return reply.code(401).send({ success: false, error: "Incorrect password" });
    bans.delete(fingerprint);
    return reply.send({ success: true });
  });

  const DDG_CACHE_TTL_MS = 30 * 1000;
  const ddgCache = new Map();

  function ddgGet(q) {
    const hit = ddgCache.get(q);
    if (!hit) return null;
    if (Date.now() > hit.exp) {
      ddgCache.delete(q);
      return null;
    }
    return hit.val;
  }

  function ddgSet(q, val) {
    ddgCache.set(q, { val, exp: Date.now() + DDG_CACHE_TTL_MS });
  }

  fastify.get("/results/:query", async (req, reply) => {
    const q = req.params.query || "";
    const cached = ddgGet(q);
    if (cached) {
      reply.header("Cache-Control", "private, max-age=15");
      return reply.send(cached);
    }

    try {
      const data = await fetchJsonWithTimeout(
        `https://api.duckduckgo.com/ac?q=${encodeURIComponent(q)}&format=json`,
        5000
      );
      ddgSet(q, data);
      reply.header("Cache-Control", "private, max-age=15");
      return reply.send(data);
    } catch (err) {
      return reply.code(502).send({ error: "Failed to fetch results", details: err?.message || String(err) });
    }
  });

  fastify.get("/ably/token", async (req, reply) => {
    const apiKey = process.env.ABLY_API_KEY;
    if (!apiKey) return reply.code(500).send({ error: "Missing ABLY_API_KEY in .env" });

    const ably = new Ably.Rest(apiKey);
    const tokenRequest = await ably.auth.createTokenRequest({ clientId: "nebulo-web" });

    reply.header("Cache-Control", "no-store");
    return tokenRequest;
  });

  fastify.server.on("listening", () => {
    const address = fastify.server.address();
    const host = osHostname();
    const port = address.port;

    const t0 = performance.now();
    setImmediate(() => {
      const t1 = performance.now();
      if (process.env.DEBUG_STARTUP) {
        console.log(`Startup tick: ${(t1 - t0).toFixed(2)}ms`);
      }
    });

    if (process.env.SILENT !== "1") {
      console.log("Listening on:");
      console.log(`\thttp://localhost:${port}`);
      console.log(`\thttp://${host}:${port}`);
      console.log(`\thttp://${address.family === "IPv6" ? `[${address.address}]` : address.address}:${port}`);
    }
  });

  function shutdown() {
    fastify.close(() => process.exit(0));
    setTimeout(() => process.exit(0), 5000).unref();
  }

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);

  const requestedPort = parseInt(process.env.PORT || "400", 10);
  const initialPort = Number.isFinite(requestedPort) ? requestedPort : 400;

  async function startServer() {
    let port = initialPort;
    const maxAttempts = 15;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        await fastify.listen({ port, host: "0.0.0.0" });
        if (attempt > 0 && process.env.SILENT !== "1") {
          console.warn(`Port ${initialPort} was busy, using port ${port} instead.`);
        }
        return;
      } catch (err) {
        if (err?.code === "EADDRINUSE") {
          port += 1;
          continue;
        }
        throw err;
      }
    }

    throw new Error(`Unable to find an open port starting at ${initialPort}`);
  }

  startServer().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
