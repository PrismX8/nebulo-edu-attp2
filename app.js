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
  const chatUsersPath = fileURLToPath(new URL("chat-git-main/data/users.json", import.meta.url));
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

  const readChatUsers = () => {
    try {
      const raw = fs.readFileSync(chatUsersPath, "utf8");
      const data = JSON.parse(raw);
      return Array.isArray(data?.users) ? data.users : [];
    } catch {
      return [];
    }
  };

  const writeChatUsers = (users) => {
    fs.writeFileSync(chatUsersPath, JSON.stringify({ users }, null, 2));
  };

  const sanitizeUser = (user) => ({
    _id: user?._id || user?.id || "",
    id: user?._id || user?.id || "",
    username: String(user?.username || ""),
    name: String(user?.name || user?.username || ""),
    role: String(user?.role || "user"),
    avatar: user?.avatar ?? null,
  });

  const findUserByUsername = (username) => {
    const target = String(username || "").trim().toLowerCase();
    if (!target) return null;
    return readChatUsers().find((user) => String(user?.username || "").trim().toLowerCase() === target) || null;
  };

  const findUserById = (userId) => {
    const target = String(userId || "").trim();
    if (!target) return null;
    return readChatUsers().find((user) => String(user?._id || user?.id || "").trim() === target) || null;
  };

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
  fastify.use("/api/network", require("./chat-git-main/routes/network"));
  fastify.use("/api/tlk", require("./chat-git-main/routes/tlk"));

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
    const users = readChatUsers();
    const user = {
      _id: randomUUID(),
      username: String(username).trim(),
      name: String(name || username).trim(),
      password: await bcrypt.hash(String(password), 10),
      role: "user",
      avatar: null,
      date: new Date().toISOString(),
    };
    users.push(user);
    writeChatUsers(users);
    return { token: signAuthToken(user), user: sanitizeUser(user) };
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
    return readChatUsers().map(sanitizeUser);
  });

  fastify.put("/api/users/profile", async (req, reply) => {
    const authUser = getAuthenticatedUser(req);
    if (!authUser) {
      return reply.status(401).send({ msg: "Invalid token" });
    }

    const { name, avatar } = req.body || {};
    const users = readChatUsers();
    const index = users.findIndex((user) => String(user?._id || "") === String(authUser._id || ""));
    if (index === -1) {
      return reply.status(404).send({ msg: "User not found" });
    }

    if (typeof name === "string" && name.trim()) {
      users[index].name = name.trim();
    }
    if (avatar === null || avatar === "") {
      users[index].avatar = null;
    } else if (typeof avatar === "string") {
      users[index].avatar = avatar;
    }

    writeChatUsers(users);
    return { user: sanitizeUser(users[index]), msg: "Profile updated successfully" };
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

    const users = readChatUsers();
    const index = users.findIndex((user) => String(user?._id || "") === String(authUser._id || ""));
    if (index === -1) {
      return reply.status(404).send({ msg: "User not found" });
    }

    const isMatch = await verifyPassword(currentPassword, users[index].password);
    if (!isMatch) {
      return reply.status(400).send({ msg: "Incorrect current password" });
    }

    users[index].password = await bcrypt.hash(String(newPassword), 10);
    writeChatUsers(users);
    return { msg: "Password updated successfully" };
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
