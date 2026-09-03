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
import { registerYouTubePlaybackRoutes } from "./services/youtubePlayback.js";
import { registerPlatinumGameMirrorRoutes } from "./services/platinumGameMirror.js";

// Keep the Fastify chat endpoints and the embedded Express chat modules on the
// same signing key. Production deployments should provide JWT_SECRET in .env.
process.env.JWT_SECRET ||= "secret";

const require = createRequire(import.meta.url);
require("dotenv").config({ path: fileURLToPath(new URL(".env.local", import.meta.url)), override: false });
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
const chatPresence = require("./chat-git-main/services/network/presence");
const chatGroups = require("./chat-git-main/services/groupChats");
const chatEffects = require("./chat-git-main/services/chat/effects");
const profileStore = require("./chat-git-main/services/db/profileStore");
const effectStore = require("./chat-git-main/services/db/effectStore");
const notificationStore = require("./chat-git-main/services/db/notificationStore");
const banEvasion = require("./chat-git-main/services/moderation/banEvasion");
const { verifyToken: verifyChatToken } = require("./chat-git-main/services/auth/remoteAuth");
const { moderatePublicMessage } = require("./chat-git-main/services/moderation/publicMessage");
const tlkRoutes = require("./chat-git-main/routes/tlk");

const libcurlPath = fileURLToPath(
  new URL("node_modules/@mercuryworkshop/libcurl-transport/dist/", import.meta.url)
);
const threeModulePath = fileURLToPath(new URL("node_modules/three/build/three.module.min.js", import.meta.url));
const gsapBrowserPath = fileURLToPath(new URL("node_modules/gsap/dist/gsap.min.js", import.meta.url));
const gsapModuleRoot = fileURLToPath(new URL("node_modules/gsap/", import.meta.url));
const dashJsBrowserPath = fileURLToPath(new URL("node_modules/dashjs/dist/modern/umd/dash.all.min.js", import.meta.url));

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
  const activitiesCatalogPath = fileURLToPath(new URL("public/assets/data/activities.json", import.meta.url));
  const JWT_SECRET = process.env.JWT_SECRET;

  const sanitizeUser = (user) => {
    const safe = chatUserStore.sanitizeUser(user);
    return safe ? { ...safe, id: safe._id || safe.id || "" } : null;
  };

  const findUserByUsername = (username) => chatUserStore.findByUsername(username);
  const findUserById = (userId) => chatUserStore.findById(userId);
  const isOwnerAccount = (user) => String(user?.role || "").toLowerCase() === "owner" || user?.is_owner === true;
  const isStaffAccount = (user) => isOwnerAccount(user) || String(user?.role || "").toLowerCase() === "admin" || user?.is_admin === true;

  const signAuthToken = (user, source = "local") =>
    jwt.sign({ user: { id: user?._id || user?.id, source } }, JWT_SECRET, { expiresIn: "30d" });

  const databaseAccountCache = new Map();

  const getRequestToken = (req) => {
    const headerToken = req.headers["x-auth-token"];
    const bearerToken = String(req.headers.authorization || "").replace(/^Bearer\s+/i, "").trim();
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
    if (typeof storedPassword !== "string" || !storedPassword.length) return false;
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

  const enforceLoginAbuseControls = async (req, reply, user) => {
    const userId = String(user?._id || user?.id || "").trim();
    const role = String(user?.role || "").toLowerCase();
    const isStaff = ["owner", "admin"].includes(role) || user?.is_owner === true || user?.is_admin === true;
    const signals = banEvasion.getRequestSignals(req, reply, user?.email || "");
    const alreadyBanned = chatNetState.isBannedAccount(userId);

    try {
      const observed = await banEvasion.observeAccount(userId, signals);
      if (!isStaff && (alreadyBanned || observed.blocked)) {
        chatNetState.banIdentity({ userId });
        await banEvasion.banUserIdentifiers(userId, {
          reason: alreadyBanned ? "Existing global moderation ban" : "Linked to an active moderation identifier"
        });
        return {
          blocked: true,
          msg: "This account is blocked by moderation. Open a ticket to appeal: dsc.gg/nebulo"
        };
      }
    } catch (error) {
      console.warn("Could not apply login abuse controls:", error?.message || error);
      if (alreadyBanned && !isStaff) {
        return {
          blocked: true,
          msg: "This account is blocked by moderation. Open a ticket to appeal: dsc.gg/nebulo"
        };
      }
    }
    return { blocked: false };
  };

  const mergeDatabaseAccountMetadata = (account) => {
    if (!account) return null;
    const local = chatUserStore.upsertRemoteUser(account) || findUserById(account.id);
    const safe = local ? chatUserStore.sanitizeUser(local) : null;
    const merged = {
      ...account,
      coins: account.coins ?? safe?.coins ?? 0,
      ownedEffects: safe?.ownedEffects || ["none"],
      ownedAvatarEffects: safe?.ownedAvatarEffects || ["none"],
      equippedEffect: safe?.equippedEffect || "none",
      equippedAvatarEffect: safe?.equippedAvatarEffect || "none",
      friends: safe?.friends || []
    };
    databaseAccountCache.set(account.id, merged);
    return merged;
  };

  const normalizeDisplayName = (value) => String(value || '')
    .normalize('NFKC')
    .replace(/\s+/g, ' ')
    .trim();

  const isValidDisplayName = (value) => {
    const length = Array.from(value).length;
    return length >= 2 && length <= 32 && !/[\u0000-\u001F\u007F]/.test(value);
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

  logging.set_level(logging.NONE);
  Object.assign(wisp.options, {
    allow_udp_streams: false,
    hostname_blacklist: [],
  });

  const fastify = Fastify({
    logger: false,
    trustProxy: true,
    bodyLimit: 3 * 1024 * 1024,
    pluginTimeout: 20000,
    requestTimeout: 30000,
    keepAliveTimeout: 65000,
    connectionTimeout: 30000,
    routerOptions: {
      ignoreTrailingSlash: true,
      maxParamLength: 4096,
    },
    rewriteUrl: (request) => {
      const requestUrl = String(request.url || "/");
      const requestHost = String(request.headers.host || "").toLowerCase().split(":")[0];
      if (requestHost !== "127.0.0.2") return requestUrl;
      if (requestUrl.startsWith("/nebulo/tiktok-client.js")) {
        return "/assets/js/tiktok-client.js" + requestUrl.slice("/nebulo/tiktok-client.js".length);
      }
      const proxiedArgonRuntime = /^\/ag\/https\/(?:www\.)?tiktok\.com\/argon-runtime\/([^/?]+)([?].*)?$/i.exec(requestUrl);
      if (proxiedArgonRuntime) {
        return `/argon-runtime/${proxiedArgonRuntime[1]}${proxiedArgonRuntime[2] || ''}`;
      }
      if (requestUrl.startsWith("/ag/")
        || requestUrl === "/argon-response-injected.js"
        || requestUrl.startsWith("/argon-runtime/")
        || requestUrl === "/argon_service_worker.js"
        || requestUrl === "/argon-tiktok-feed-cache.json") {
        return requestUrl;
      }
      if (requestUrl.startsWith("/obj/static-tx/slardar/")) {
        return "/ag/https/lf16-cdn-tos.tiktokcdn-us.com" + requestUrl;
      }
      return "/ag/https/www.tiktok.com" + (requestUrl.startsWith("/") ? requestUrl : "/" + requestUrl);
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
            const fullModeSelected = String(req.headers.cookie || "")
              .split(";")
              .some((pair) => pair.trim() === "nebulo_mode=full");
            if (!fullModeSelected) {
              socket.write(
                "HTTP/1.1 404 Not Found\r\n" +
                  "Connection: close\r\n" +
                  "Content-Length: 0\r\n\r\n"
              );
              socket.destroy();
              return;
            }
            wisp.routeRequest(req, socket, head);
            return;
          }

          // Let Socket.IO handle its own websocket upgrades.
          if (path === "/socket.io/" || path.startsWith("/socket.io/")) {
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

  const SETUP_MODE_COOKIE = "nebulo_mode";
  const FULL_ONLY_PREFIXES = [
    "/ag/", "/uv/", "/ec/", "/eclipse/", "/scram/", "/scramjet/",
    "/service/scramjet/", "/baremux/", "/epoxy/", "/libcurl/", "/pages/"
  ];
  const FULL_ONLY_PATHS = new Set([
    "/@", "/search", "/tools", "/quiz", "/settings", "/test", "/helper", "/help",
    "/tool", "/blocked", "/links", "/bug", "/whatsnew", "/achievements", "/watch",
    "/youtube-player", "/youtube-shorts", "/geometry", "/chemistry", "/secret",
    "/argon_service_worker.js", "/argon-response-injected.js", "/argon-tiktok-feed-cache.json",
    "/service-worker.js", "/ri.html", "/s.html", "/st.html", "/ap.html",
    "/ch.html", "/gs.html", "/tl.html", "/wt.html", "/youtube-player.html", "/youtube-shorts.html",
    "/assets/js/proxy-runtime.js", "/assets/js/proxy-encoder.js", "/assets/js/proxy-host-rules.js",
    "/assets/js/search.js", "/assets/js/activities.js", "/assets/js/tools.js", "/assets/js/test.js"
  ]);

  const parseCookies = (cookieHeader) => {
    const cookies = Object.create(null);
    for (const pair of String(cookieHeader || "").split(";")) {
      const separator = pair.indexOf("=");
      if (separator < 1) continue;
      const key = pair.slice(0, separator).trim();
      const rawValue = pair.slice(separator + 1).trim();
      try {
        cookies[key] = decodeURIComponent(rawValue);
      } catch {
        cookies[key] = rawValue;
      }
    }
    return cookies;
  };

  const getSetupMode = (req) => {
    const mode = parseCookies(req.headers.cookie)[SETUP_MODE_COOKIE];
    return mode === "games" || mode === "full" ? mode : "";
  };

  const isSameOriginProxySubrequest = (req, pathname) => {
    const referer = req.headers.referer;
    if (!referer || !pathname.startsWith("/ag/")) return false;
    try {
      const refererUrl = new URL(referer);
      const currentHost = String(req.headers.host || "");
      return refererUrl.host === currentHost && refererUrl.pathname.startsWith("/ag/");
    } catch {
      return false;
    }
  };

  const setSetupModeCookie = (reply, mode) => {
    reply.header(
      "Set-Cookie",
      `${SETUP_MODE_COOKIE}=${encodeURIComponent(mode)}; Path=/; HttpOnly; SameSite=Strict`
    );
  };

  const plainNotFound = (reply) => reply
    .code(404)
    .header("Cache-Control", "no-store")
    .type("text/plain; charset=utf-8")
    .send("Not Found");

  // This hook runs before static files and proxy plugins. Restricted sessions
  // cannot download proxy runtimes even when their exact paths are requested.
  fastify.addHook("onRequest", async (req, reply) => {
    // Fastify's rewriteUrl hook mutates raw.url. originalUrl retains the URL
    // received from the browser, which is required to repair legacy aliases.
    const rawUrl = String(req.originalUrl || req.raw?.url || "/");
    let pathname = rawUrl.split("?", 1)[0] || "/";
    try { pathname = decodeURIComponent(pathname); } catch {}
    const legacyAliasMatch = /^127\.0\.0\.2(?::(\d+))?$/i.exec(String(req.headers.host || ""));
    if (legacyAliasMatch) {
      // Older TikTok sessions used a second loopback origin. Keeping a page on
      // that origin splits cookies, service workers and CORS state from Argon's
      // canonical origin. Move stale sessions back to localhost before any
      // proxy middleware or static route can handle the request.
      const canonicalAuthority = `localhost${legacyAliasMatch[1] ? `:${legacyAliasMatch[1]}` : ""}`;
      const localRuntimePath =
        pathname.startsWith("/ag/") ||
        pathname.startsWith("/argon-runtime/") ||
        pathname.startsWith("/uv/") ||
        pathname.startsWith("/ec/") ||
        pathname.startsWith("/eclipse/") ||
        pathname.startsWith("/scram/") ||
        pathname.startsWith("/scramjet/") ||
        pathname.startsWith("/service/scramjet/") ||
        pathname.startsWith("/baremux/") ||
        pathname.startsWith("/epoxy/") ||
        pathname.startsWith("/libcurl/") ||
        pathname === "/argon-response-injected.js" ||
        pathname === "/argon_service_worker.js" ||
        pathname === "/argon-tiktok-feed-cache.json";

      let canonicalPath = rawUrl;
      if (pathname.startsWith("/nebulo/tiktok-client.js")) {
        canonicalPath = "/assets/js/tiktok-client.js" + rawUrl.slice("/nebulo/tiktok-client.js".length);
      } else if (pathname.startsWith("/obj/static-tx/slardar/")) {
        canonicalPath = "/ag/https/lf16-cdn-tos.tiktokcdn-us.com" + rawUrl;
      } else if (!localRuntimePath) {
        canonicalPath = "/ag/https/www.tiktok.com" + (rawUrl.startsWith("/") ? rawUrl : "/" + rawUrl);
      }

      return reply.redirect(`http://${canonicalAuthority}${canonicalPath}`, 307);
    }

    const mode = getSetupMode(req);

    if (pathname === "/") {
      // The home page is also reached by normal tab creation and background
      // preloads. Clearing the selected setup mode here silently revoked
      // proxy access, causing every /ag/ request to be blocked as a 404.
      return;
    }

    if (pathname === "/setup" || pathname === "/setup.html") {
      return reply.redirect("/setup-v2", 302);
    }

    if (pathname === "/@") {
      if (!mode) return reply.redirect("/setup-v2", 302);
      if (mode === "games") return reply.redirect("/games", 302);
      return;
    }

    if (pathname === "/games" || pathname === "/games-only.html" || pathname === "/api/local-games") {
      if (!mode) return reply.redirect("/setup-v2", 302);
      return;
    }

    if ((pathname.startsWith("/games/") || pathname.startsWith("/chemistry-games/")) && !mode) {
      return plainNotFound(reply);
    }

    const fullOnly =
      pathname.startsWith("/argon-runtime/") ||
      FULL_ONLY_PREFIXES.some((prefix) => pathname === prefix.slice(0, -1) || pathname.startsWith(prefix)) ||
      FULL_ONLY_PATHS.has(pathname);

    if (fullOnly && mode !== "full" && !isSameOriginProxySubrequest(req, pathname)) {
      return plainNotFound(reply);
    }
  });

  fastify.addHook("onSend", async (req, reply, payload) => {
    const pathname = String(req.raw?.url || "/").split("?", 1)[0];
    if (
      pathname === "/" || pathname === "/error.html" ||
      pathname === "/setup" || pathname === "/setup.html" || pathname === "/setup-v2" ||
      pathname === "/@" || pathname === "/ri.html" ||
      pathname === "/search" || pathname === "/s.html"
    ) {
      reply.header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
      reply.header("Pragma", "no-cache");
      reply.header("Expires", "0");
    }
    return payload;
  });

  if (!fastify.hasContentTypeParser("application/x-www-form-urlencoded")) {
    fastify.addContentTypeParser(
      "application/x-www-form-urlencoded",
      { parseAs: "string" },
      (_req, body, done) => done(null, Object.fromEntries(new URLSearchParams(body)))
    );
  }

  const io = new Server(fastify.server, {
    path: "/socket.io/",
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    },
    connectionStateRecovery: {
      maxDisconnectionDuration: 2 * 60 * 1000,
      skipMiddlewares: true
    },
    perMessageDeflate: {
      threshold: 1024
    },
    maxHttpBufferSize: 1024 * 1024
  });
  globalThis.__nebuloChatIo = io;

  // libcurl-transport and some proxy stacks benefit from cross-origin isolation (SharedArrayBuffer).
  // Apply globally so both app pages and proxied content can opt into it consistently.
  fastify.addHook("onSend", async (req, reply, payload) => {
    reply.header("Cross-Origin-Opener-Policy", "same-origin");
    // Use credentialless so existing CDN assets/ads aren't blocked by COEP require-corp.
    reply.header("Cross-Origin-Embedder-Policy", "credentialless");
    return payload;
  });

  // @fastify/static expects milliseconds, not seconds.
  const ONE_HOUR = 60 * 60 * 1000;

  // Mount the original K-Chat Express routers for the chat APIs that already
  // handle TLK rooms, presence, moderation, and persisted room metadata.
  await fastify.register(fastifyExpress);
  fastify.use(cors());
  const expressJson = express.json({ limit: "1mb" });
  const expressUrlencoded = express.urlencoded({ extended: true, limit: "1mb" });
  const mountExpressRouter = (prefix, router) => {
    fastify.use(prefix, (req, res, next) => {
      const originalUrl = String(req.url || "");
      const originalBaseUrl = req.baseUrl;
      const strippedUrl = originalUrl.startsWith(prefix)
        ? originalUrl.slice(prefix.length) || "/"
        : originalUrl || "/";

      req.url = strippedUrl.startsWith("/") ? strippedUrl : `/${strippedUrl}`;
      req.baseUrl = prefix;

      expressJson(req, res, (jsonErr) => {
        if (jsonErr) {
          req.url = originalUrl;
          req.baseUrl = originalBaseUrl;
          return next(jsonErr);
        }
        expressUrlencoded(req, res, (urlErr) => {
          if (urlErr) {
            req.url = originalUrl;
            req.baseUrl = originalBaseUrl;
            return next(urlErr);
          }
          router(req, res, (routerErr) => {
            req.url = originalUrl;
            req.baseUrl = originalBaseUrl;
            next(routerErr);
          });
        });
      });
    });
  };

  require("./chat-git-main/integration").integrateChat({ io, mountExpressRouter });

  registerPlatinumGameMirrorRoutes(fastify);

  // Mount proxy routes before the catch-all public static handler. Fastify's
  // root static wildcard otherwise claims /ag/* first and turns valid proxy
  // requests into a local 404 before Argon can see them.
  await fastify.register(argonPlugin, {
    token_prefix: "/ag/",
    use_not_found_fallback: false,
  });

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
        if (p.endsWith("/sw.js")) {
          res.setHeader("Cache-Control", "no-cache");
          return;
        }
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
          res.setHeader("Cache-Control", "public, max-age=3600, immutable");
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
   const chatGitClientPath = fileURLToPath(new URL("chat-git-main/public", import.meta.url));

  // Debug route
  fastify.get("/debug", async (req, reply) => {
    return { msg: "debug works" };
  });


  fastify.post("/api/auth", async (req, reply) => {
    const { username, email, password } = req.body || {};
    const identifier = String(email || username || "").trim();
    if (!identifier || !password) {
      return reply.status(400).send({ msg: "Email/username and password required" });
    }

    const user = findUserByUsername(identifier);
    if (user && await verifyPassword(password, user.password)) {
      const access = await enforceLoginAbuseControls(req, reply, user);
      if (access.blocked) return reply.status(403).send({ msg: access.msg, code: "ACCOUNT_BLOCKED" });
      return { token: signAuthToken(user, "local"), user: sanitizeUser(user) };
    }

    try {
      const databaseResult = await profileStore.findAccountByIdentifier(identifier);
      if (databaseResult && await verifyPassword(password, databaseResult.passwordHash)) {
        const databaseUser = mergeDatabaseAccountMetadata(databaseResult.account);
        const access = await enforceLoginAbuseControls(req, reply, databaseUser);
        if (access.blocked) return reply.status(403).send({ msg: access.msg, code: "ACCOUNT_BLOCKED" });
        return { token: signAuthToken(databaseUser, "database"), user: databaseUser };
      }
    } catch (error) {
      if (error?.code === "PROFILE_DB_NOT_CONFIGURED") {
        return reply.status(503).send({ msg: "Account database is not configured" });
      }
      console.error("Database authentication failed:", error.message);
      return reply.status(503).send({ msg: "Account database is unavailable" });
    }

    if (user) {
      return reply.status(400).send({ msg: "Incorrect password" });
    }
    return reply.status(400).send({ msg: "Account not found" });
  });

  fastify.get("/api/auth", async (req, reply) => {
    const auth = decodeRequestToken(req);
    const userId = String(auth?.decoded?.user?.id || "").trim();
    const source = String(auth?.decoded?.user?.source || "").trim();
    if (userId && source === "database") {
      try {
        const databaseUser = mergeDatabaseAccountMetadata(await profileStore.findAccountById(userId));
        if (!databaseUser) return reply.status(401).send({ msg: "Account no longer exists" });
        return databaseUser;
      } catch (error) {
        console.error("Database session lookup failed:", error.message);
        return reply.status(503).send({ msg: "Account database is unavailable" });
      }
    }

    const user = getAuthenticatedUser(req);
    if (!user) {
      return reply.status(401).send({ msg: "No token" });
    }
    return sanitizeUser(user);
  });

  fastify.get("/api/account/profile", async (req, reply) => {
    const account = await getAuthenticatedProfileAccount(req);
    if (!account) {
      return reply.status(401).send({ msg: "Sign in with a database-backed Nebulo account" });
    }
    return { profile: account };
  });

  fastify.put("/api/account/profile/avatar", async (req, reply) => {
    const account = await getAuthenticatedProfileAccount(req);
    if (!account) {
      return reply.status(401).send({ msg: "Sign in with a database-backed Nebulo account" });
    }

    const rawAvatar = req.body?.avatar;
    const avatar = rawAvatar == null || rawAvatar === "" ? null : String(rawAvatar).trim();
    if (avatar) {
      if (avatar.length > 400_000) {
        return reply.status(413).send({ msg: "Processed avatar is too large" });
      }
      if (!/^data:image\/(?:png|jpeg|webp|gif|avif);base64,[a-z0-9+/=\r\n]+$/i.test(avatar)) {
        return reply.status(400).send({ msg: "Avatar must be a supported image upload" });
      }
    }

    try {
      const updated = await profileStore.updateAvatar(account.id, avatar);
      if (!updated) return reply.status(404).send({ msg: "Profile not found" });
      const merged = mergeDatabaseAccountMetadata({ ...account, ...updated, email: account.email });
      const token = signAuthToken(merged, "database");
      return { profile: merged, user: { ...merged, token }, token, msg: avatar ? "Profile picture updated" : "Profile picture removed" };
    } catch (error) {
      console.error("Avatar update failed:", error.message);
      return reply.status(503).send({ msg: "Could not update the profile picture" });
    }
  });

  fastify.put("/api/account/profile/username", async (req, reply) => {
    const account = await getAuthenticatedProfileAccount(req);
    if (!account) {
      return reply.status(401).send({ msg: "Sign in with a database-backed Nebulo account" });
    }
    const username = String(req.body?.username || "").trim();
    if (!/^[a-zA-Z0-9_]{3,24}$/.test(username)) {
      return reply.status(400).send({ msg: "Username must be 3–24 characters using letters, numbers, or underscores" });
    }
    if (username === account.username) {
      const merged = mergeDatabaseAccountMetadata(account);
      const token = signAuthToken(merged, "database");
      return { profile: merged, user: { ...merged, token }, token, msg: "Username is already up to date" };
    }
    try {
      const updated = await profileStore.updateUsername(account.id, username);
      const merged = mergeDatabaseAccountMetadata(updated);
      chatIdentityStore.updateByUserId(account.id, { username, name: username });
      const token = signAuthToken(merged, "database");
      return { profile: merged, user: { ...merged, token }, token, msg: "Username updated" };
    } catch (error) {
      if (error?.code === "USERNAME_EXISTS") return reply.status(409).send({ msg: error.message });
      if (error?.code === "USER_NOT_FOUND") return reply.status(404).send({ msg: error.message });
      console.error("Username update failed:", error.message);
      return reply.status(503).send({ msg: "Could not update username" });
    }
  });

  fastify.put("/api/account/profile/display-name", async (req, reply) => {
    const account = await getAuthenticatedProfileAccount(req);
    if (!account) {
      return reply.status(401).send({ msg: "Sign in with a database-backed Nebulo account" });
    }
    const displayName = normalizeDisplayName(req.body?.displayName);
    if (!isValidDisplayName(displayName)) {
      return reply.status(400).send({ msg: "Display name must be 2–32 visible characters" });
    }
    try {
      const updated = await profileStore.updateDisplayName(account.id, displayName);
      const merged = mergeDatabaseAccountMetadata(updated);
      chatIdentityStore.updateByUserId(account.id, { username: merged.username, name: merged.name });
      const token = signAuthToken(merged, "database");
      return { profile: merged, user: { ...merged, token }, token, msg: "Display name updated" };
    } catch (error) {
      if (error?.code === "USER_NOT_FOUND") return reply.status(404).send({ msg: error.message });
      console.error("Display name update failed:", error.message);
      return reply.status(503).send({ msg: "Could not update display name" });
    }
  });

  fastify.put("/api/account/profile/password", async (req, reply) => {
    const account = await getAuthenticatedProfileAccount(req);
    if (!account) {
      return reply.status(401).send({ msg: "Sign in with a database-backed Nebulo account" });
    }
    const currentPassword = String(req.body?.currentPassword || "");
    const newPassword = String(req.body?.newPassword || "");
    if (!currentPassword || !newPassword) {
      return reply.status(400).send({ msg: "Current and new passwords are required" });
    }
    if (newPassword.length < 8 || newPassword.length > 128) {
      return reply.status(400).send({ msg: "Password must be 8–128 characters" });
    }
    try {
      const credentials = await profileStore.findCredentialsById(account.id);
      if (!credentials) return reply.status(404).send({ msg: "Account not found" });
      if (!await verifyPassword(currentPassword, credentials.password_hash)) {
        return reply.status(400).send({ msg: "Current password is incorrect" });
      }
      if (await verifyPassword(newPassword, credentials.password_hash)) {
        return reply.status(400).send({ msg: "New password must be different" });
      }
      await profileStore.updatePassword(account.id, await bcrypt.hash(newPassword, 12));
      const refreshed = mergeDatabaseAccountMetadata(await profileStore.findAccountById(account.id));
      const token = signAuthToken(refreshed, "database");
      return { profile: refreshed, user: { ...refreshed, token }, token, msg: "Password updated" };
    } catch (error) {
      console.error("Password update failed:", error.message);
      return reply.status(503).send({ msg: "Could not update password" });
    }
  });

  fastify.post("/api/account/coins/checkout", async (req, reply) => {
    const authUser = getAuthenticatedUser(req);
    if (!authUser) return reply.status(401).send({ msg: "Invalid token" });

    const packs = {
      starter: { type: "coins", coins: 500, priceUsd: "1.99", cosmetics: [] },
      boost: { type: "coins", coins: 1500, priceUsd: "4.99", cosmetics: [] },
      vault: { type: "coins", coins: 5000, priceUsd: "9.99", cosmetics: [] },
      neon_collection: { type: "collection", coins: 0, priceUsd: "2.99", cosmetics: ["neon", "tag_cool", "banner_ocean"] },
      golden_collection: { type: "collection", coins: 0, priceUsd: "3.99", cosmetics: ["gold", "tag_honor", "banner_sunset"] },
      void_collection: { type: "collection", coins: 500, priceUsd: "5.99", cosmetics: ["void", "tag_mvp", "banner_midnight"] }
    };
    const packId = String(req.body?.packId || "").trim().toLowerCase();
    const pack = packs[packId];
    if (!pack) return reply.status(400).send({ msg: "Invalid coin pack" });

    const configuredUrl = String(process.env.COIN_STORE_CHECKOUT_URL || "").trim();
    if (!configuredUrl) {
      return reply.status(503).send({ msg: "Coin checkout has not been configured yet" });
    }

    try {
      const checkoutUrl = new URL(configuredUrl);
      checkoutUrl.searchParams.set("pack", packId);
      checkoutUrl.searchParams.set("coins", String(pack.coins));
      checkoutUrl.searchParams.set("price", pack.priceUsd);
      checkoutUrl.searchParams.set("type", pack.type);
      if (pack.cosmetics.length) checkoutUrl.searchParams.set("cosmetics", pack.cosmetics.join(","));
      checkoutUrl.searchParams.set("account", String(authUser._id || authUser.id || ""));
      return { checkoutUrl: checkoutUrl.toString() };
    } catch {
      return reply.status(500).send({ msg: "Coin checkout URL is invalid" });
    }
  });

  // Registration
  fastify.post("/api/users", async (req, reply) => {
    const username = String(req.body?.username || "").trim();
    const displayName = normalizeDisplayName(req.body?.displayName || username);
    const email = String(req.body?.email || "").trim().toLowerCase();
    const password = String(req.body?.password || "");
    if (!username || !email || !password) {
      return reply.status(400).send({ msg: "Username, email, and password are required" });
    }
    if (!/^[a-zA-Z0-9_]{3,24}$/.test(username)) {
      return reply.status(400).send({ msg: "Username must be 3–24 characters using letters, numbers, or underscores" });
    }
    if (!isValidDisplayName(displayName)) {
      return reply.status(400).send({ msg: "Display name must be 2–32 visible characters" });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
      return reply.status(400).send({ msg: "Enter a valid email address" });
    }
    if (password.length < 8 || password.length > 128) {
      return reply.status(400).send({ msg: "Password must be 8–128 characters" });
    }

    let registration = null;
    try {
      const signals = banEvasion.getRequestSignals(req, reply, email);
      registration = await banEvasion.beginRegistration(signals);
      if (!registration.allowed) {
        const blocked = registration.status === 403;
        return reply.status(registration.status).send({
          msg: blocked
            ? `Account creation is blocked by moderation. Appeal code: ${registration.appealId}`
            : "Too many account creation attempts. Try again later.",
          code: blocked ? "REGISTRATION_BLOCKED" : "REGISTRATION_RATE_LIMITED",
          appealId: registration.appealId
        });
      }

      const account = await profileStore.createAccount({
        id: randomUUID(),
        username,
        displayName,
        email,
        passwordHash: await bcrypt.hash(password, 12)
      });
      await banEvasion.completeRegistration(registration.attemptId, {
        outcome: "created",
        userId: account.id
      });
      await banEvasion.observeAccount(account.id, signals);
      const user = mergeDatabaseAccountMetadata(account);
      return reply.status(201).send({ token: signAuthToken(user, "database"), user });
    } catch (error) {
      if (registration?.attemptId) {
        await banEvasion.completeRegistration(registration.attemptId, {
          outcome: "rejected",
          reason: error?.code === "ACCOUNT_EXISTS" ? "Account already exists" : "Account creation failed"
        }).catch(() => {});
      }
      if (error?.code === "ACCOUNT_EXISTS") {
        return reply.status(409).send({ msg: error.message });
      }
      if (["42P01", "42501"].includes(error?.code) || /ban-evasion database migration/i.test(String(error?.message || ""))) {
        return reply.status(503).send({ msg: "Account protection is being initialized. Try again shortly." });
      }
      console.error("Account registration failed:", error.message);
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
      equippedEffect: updatedUser.equippedEffect || "none",
      equippedAvatarEffect: updatedUser.equippedAvatarEffect || "none"
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

  fastify.post("/api/users/coins/dev-grant", async (req, reply) => {
    const authUser = getAuthenticatedUser(req);
    if (!authUser) {
      return reply.status(401).send({ msg: "Invalid token" });
    }
    if (!isOwnerAccount(authUser)) {
      return reply.status(403).send({ msg: "Owner access required" });
    }

    const updatedUser = chatUserStore.updateProfile(authUser._id, {
      coins: 1000000
    });
    if (!updatedUser) {
      return reply.status(404).send({ msg: "User not found" });
    }

    return {
      msg: "Test balance set to 1,000,000 coins",
      user: sanitizeUser(updatedUser)
    };
  });

  fastify.get("/api/admin/overview", async (req, reply) => {
    const authUser = getAuthenticatedUser(req);
    if (!authUser) return reply.status(401).send({ msg: "Invalid token" });
    if (!isOwnerAccount(authUser)) return reply.status(403).send({ msg: "Owner access required" });
    try {
      const stats = await profileStore.getAdminStats();
      const presence = chatPresence.getCounts();
      const activeClients = Object.values(presence.rooms || {}).reduce((sum, count) => sum + Number(count || 0), 0);
      return {
        stats: { ...stats, groups: chatGroups.getGroups().length, activeClients },
        moderation: chatNetState.getModeration()
      };
    } catch (error) {
      console.error("Admin overview failed:", error.message);
      return reply.status(503).send({ msg: "Could not load admin overview" });
    }
  });

  fastify.get("/api/admin/users", async (req, reply) => {
    const authUser = getAuthenticatedUser(req);
    if (!authUser) return reply.status(401).send({ msg: "Invalid token" });
    if (!isOwnerAccount(authUser)) return reply.status(403).send({ msg: "Owner access required" });
    try {
      const result = await profileStore.listAccounts({
        search: String(req.query.search || "").trim(),
        limit: Math.max(1, Math.min(50, Number(req.query.limit) || 20)),
        offset: Math.max(0, Number(req.query.offset) || 0)
      });
      return { users: result.accounts, pagination: { total: result.total, limit: result.limit, offset: result.offset } };
    } catch (error) {
      console.error("Admin user list failed:", error.message);
      return reply.status(503).send({ msg: "Could not load users" });
    }
  });

  fastify.post("/api/admin/coins/grant", async (req, reply) => {
    const authUser = getAuthenticatedUser(req);
    if (!authUser) return reply.status(401).send({ msg: "Invalid token" });
    if (!isOwnerAccount(authUser)) return reply.status(403).send({ msg: "Owner access required" });
    const targetId = String(req.body?.userId || "").trim();
    const targetName = String(req.body?.username || "").trim();
    const amount = Math.trunc(Number(req.body?.amount));
    if (!targetId && !targetName) return reply.status(400).send({ msg: "Choose a user" });
    if (!Number.isFinite(amount) || amount < 1 || amount > 1_000_000) {
      return reply.status(400).send({ msg: "Coin amount must be between 1 and 1,000,000" });
    }
    try {
      const target = targetId
        ? await profileStore.findAccountById(targetId)
        : (await profileStore.findAccountByIdentifier(targetName))?.account;
      if (!target) return reply.status(404).send({ msg: "Profile not found" });
      const updated = await profileStore.adminGrantCoins(target.id, amount);
      if (String(updated.id) === String(authUser.id || authUser._id)) mergeDatabaseAccountMetadata(updated);
      return { msg: `Added ${amount.toLocaleString()} coins to ${updated.username}`, user: updated };
    } catch (error) {
      const status = error?.code === "USER_NOT_FOUND" ? 404 : error?.code === "INVALID_AMOUNT" ? 400 : 503;
      return reply.status(status).send({ msg: error.message || "Could not grant coins" });
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

  fastify.get("/api/users/friends", async (req, reply) => {
    const authUser = getAuthenticatedUser(req);
    if (!authUser) {
      return reply.status(401).send({ msg: "Invalid token" });
    }

    const caller = chatUserStore.upsertRemoteUser(authUser) || findUserById(authUser._id);
    if (!caller) {
      return reply.status(401).send({ msg: "User not found" });
    }

    const search = String(req.query.search || "").trim();
    const sidebarOnly = String(req.query.sidebar || "") === "1";
    const limit = Math.max(1, Math.min(24, Number(req.query.limit) || 8));
    const offset = Math.max(0, Number(req.query.offset) || 0);
    const mutualFriends = chatUserStore.getMutualFriends(caller._id);
    const friendRequests = chatUserStore.getFriendRequests(caller._id);
    const incomingRequests = Array.isArray(friendRequests.incoming)
      ? friendRequests.incoming.map((username) => sanitizeUser(findUserByUsername(username))).filter(Boolean)
      : [];
    const outgoingRequests = Array.isArray(friendRequests.outgoing)
      ? friendRequests.outgoing.map((username) => sanitizeUser(findUserByUsername(username))).filter(Boolean)
      : [];

    if (sidebarOnly && !search) {
      const localProfiles = [
        ...mutualFriends.map((user) => sanitizeUser(user)).filter(Boolean),
        ...incomingRequests,
        ...outgoingRequests
      ];
      const accountIds = localProfiles.map((user) => user?._id || user?.id).filter(Boolean);
      const accounts = await profileStore.findAccountsByIds(accountIds).catch(() => []);
      const accountsById = new Map(accounts.map((account) => [String(account.id || account._id), account]));
      const enrichLocalProfile = (user) => {
        const account = accountsById.get(String(user?._id || user?.id || ''));
        const identity = chatIdentityStore.getByUsername(user?.username);
        return account
          ? { ...user, ...account, avatar: account.avatar || identity?.avatar || user?.avatar || null }
          : { ...user, avatar: identity?.avatar || user?.avatar || null };
      };
      const enrichedMutualFriends = mutualFriends.map((user) => enrichLocalProfile(sanitizeUser(user))).filter(Boolean);
      return reply.send({
        mutualFriends: enrichedMutualFriends,
        results: enrichedMutualFriends,
        pagination: { total: enrichedMutualFriends.length, limit, offset: 0, hasMore: false },
        requests: {
          incoming: incomingRequests.map(enrichLocalProfile),
          outgoing: outgoingRequests.map(enrichLocalProfile)
        }
      });
    }

    let directory;
    try {
      directory = await profileStore.listAccounts({ search, limit, offset, excludeId: caller._id });
    } catch (error) {
      console.error("Profile directory failed:", error.message);
      return reply.status(503).send({ msg: "Could not load the user directory" });
    }
    directory.accounts.forEach((account) => chatUserStore.upsertRemoteUser(account));
    const results = directory.accounts;
    const callerUsername = String(caller.username || "").trim().toLowerCase();

    const normalizedResults = results.map((user) => {
      const targetUsername = String(user.username || "").trim().toLowerCase();
      const isFriend = Array.isArray(caller.friends) && caller.friends.includes(targetUsername);
      const mutual = isFriend && Array.isArray(user.friends) && user.friends.includes(callerUsername);
      const pending = Array.isArray(caller.friendRequestsSent) && caller.friendRequestsSent.includes(targetUsername) && !mutual;
      const incoming = Array.isArray(caller.friendRequestsReceived) && caller.friendRequestsReceived.includes(targetUsername) && !mutual;
      return {
        _id: user._id,
        username: user.username,
        avatar: user.avatar || null,
        coins: Math.max(0, Number(user.coins || 0)),
        added: mutual || pending,
        mutual,
        pending,
        incoming
      };
    });

    const enrichProfile = async (user) => {
      if (!user) return null;
      try {
        let account = null;
        if (user._id) account = await profileStore.findAccountById(user._id).catch(() => null);
        if (!account && user.username) account = (await profileStore.findAccountByIdentifier(user.username))?.account || null;
        return account
          ? { ...user, ...account, avatar: account.avatar || null, coins: account.coins ?? user.coins ?? 0 }
          : { ...user, avatar: user.avatar || null, coins: user.coins ?? 0 };
      } catch {
        return { ...user, avatar: user.avatar || null, coins: user.coins ?? 0 };
      }
    };
    const [enrichedMutualFriends, enrichedIncoming, enrichedOutgoing] = await Promise.all([
      Promise.all(mutualFriends.map((user) => enrichProfile(sanitizeUser(user)))),
      Promise.all(incomingRequests.map(enrichProfile)),
      Promise.all(outgoingRequests.map(enrichProfile))
    ]);

    return reply.send({
      mutualFriends: enrichedMutualFriends.filter(Boolean),
      results: normalizedResults,
      pagination: {
        total: directory.total,
        limit: directory.limit,
        offset: directory.offset,
        hasMore: directory.offset + normalizedResults.length < directory.total
      },
      requests: {
        incoming: enrichedIncoming.filter(Boolean),
        outgoing: enrichedOutgoing.filter(Boolean)
      }
    });
  });

  fastify.post("/api/users/friends", async (req, reply) => {
    const authUser = getAuthenticatedUser(req);
    if (!authUser) {
      return reply.status(401).send({ msg: "Invalid token" });
    }

    const caller = chatUserStore.upsertRemoteUser(authUser) || findUserById(authUser._id);
    if (!caller) {
      return reply.status(401).send({ msg: "User not found" });
    }

    let username = String(req.body?.username || "").trim();
    let targetAccount = null;
    const userId = String(req.body?.userId || "").trim();
    if (userId || username) {
      try {
        const target = userId
          ? await profileStore.findAccountById(userId)
          : (await profileStore.findAccountByIdentifier(username))?.account;
        if (target) {
          targetAccount = target;
          chatUserStore.upsertRemoteUser(target);
          username = target.username;
        }
      } catch {}
    }
    if (!username) {
      return reply.status(400).send({ msg: "Friend username is required" });
    }

    try {
      const normalizedTarget = username.toLowerCase();
      const alreadyPending = Array.isArray(caller.friendRequestsSent) && caller.friendRequestsSent.includes(normalizedTarget);
      const isIncomingRequest = Array.isArray(caller.friendRequestsReceived) && caller.friendRequestsReceived.includes(normalizedTarget);
      const updated = chatUserStore.addFriendRequest(caller._id, username);
      if (!alreadyPending && !isIncomingRequest) {
        const senderName = String(caller.username || authUser.username || "Someone").trim();
        const recipient = targetAccount || await profileStore.findAccountByIdentifier(username).then((result) => result?.account).catch(() => null);
        const recipientId = String(recipient?.id || findUserByUsername(username)?._id || "").trim();
        const alert = {
          type: "friend_request",
          message: `${senderName} sent you a friend request.`,
          metadata: { senderId: String(caller._id || ""), senderUsername: senderName, section: "dms" },
          at: Date.now()
        };
        try {
          const saved = await notificationStore.createForUsername(username, {
            ...alert,
            dedupeKey: `friend-request:${caller._id}:${recipientId}:${Date.now()}`
          });
          if (saved?.id) alert.id = saved.id;
        } catch (error) {
          if (!notificationStore.isUnavailableError(error)) {
            console.warn("Could not persist friend-request notification:", error?.message || error);
          }
        }
        if (recipientId) {
          Object.assign(alert, chatNetState.pushAlertForIdentity({ userId: recipientId }, alert));
        }
        if (globalThis.__nebuloChatIo) {
          globalThis.__nebuloChatIo.to(`user:${normalizedTarget}`).emit("alert_created", alert);
        }
      }
      return { ok: true, user: sanitizeUser(updated) };
    } catch (error) {
      if (error?.code === "USER_NOT_FOUND") {
        return reply.status(404).send({ msg: "User not found" });
      }
      if (error?.code === "CANNOT_ADD_SELF") {
        return reply.status(400).send({ msg: "Cannot add yourself" });
      }
      if (error?.code === "ALREADY_FRIENDS") {
        return reply.status(400).send({ msg: "Already friends" });
      }
      return reply.status(400).send({ msg: error?.message || "Failed to send friend request" });
    }
  });

  fastify.post("/api/users/friends/accept", async (req, reply) => {
    let authUser = getAuthenticatedUser(req);
    if (!authUser) {
      try { authUser = await getAuthenticatedProfileAccount(req); } catch {}
    }
    if (!authUser) {
      return reply.status(401).send({ msg: "Invalid token" });
    }
    const authUserId = authUser._id || authUser.id;
    const caller = chatUserStore.upsertRemoteUser(authUser) || findUserById(authUserId);
    if (!caller) {
      return reply.status(401).send({ msg: "User not found" });
    }
    const username = String(req.body?.username || "").trim();
    if (!username) {
      return reply.status(400).send({ msg: "Requester username is required" });
    }
    try {
      const updated = chatUserStore.acceptFriendRequest(caller._id, username);
      return { ok: true, user: sanitizeUser(updated) };
    } catch (error) {
      if (error?.code === "USER_NOT_FOUND" || error?.code === "REQUEST_NOT_FOUND") {
        return reply.status(404).send({ msg: error.message || "Friend request not found" });
      }
      return reply.status(400).send({ msg: error?.message || "Failed to accept friend request" });
    }
  });

  fastify.post("/api/users/friends/deny", async (req, reply) => {
    let authUser = getAuthenticatedUser(req);
    if (!authUser) {
      try { authUser = await getAuthenticatedProfileAccount(req); } catch {}
    }
    if (!authUser) {
      return reply.status(401).send({ msg: "Invalid token" });
    }
    const authUserId = authUser._id || authUser.id;
    const caller = chatUserStore.upsertRemoteUser(authUser) || findUserById(authUserId);
    if (!caller) {
      return reply.status(401).send({ msg: "User not found" });
    }
    const username = String(req.body?.username || "").trim();
    if (!username) {
      return reply.status(400).send({ msg: "Requester username is required" });
    }
    try {
      const updated = chatUserStore.denyFriendRequest(caller._id, username);
      return { ok: true, user: sanitizeUser(updated) };
    } catch (error) {
      if (error?.code === "USER_NOT_FOUND" || error?.code === "REQUEST_NOT_FOUND") {
        return reply.status(404).send({ msg: error.message || "Friend request not found" });
      }
      return reply.status(400).send({ msg: error?.message || "Failed to deny friend request" });
    }
  });

  fastify.delete("/api/users/friends/:username", async (req, reply) => {
    const authUser = getAuthenticatedUser(req);
    if (!authUser) {
      return reply.status(401).send({ msg: "Invalid token" });
    }
    const authUserId = authUser._id || authUser.id;
    const caller = chatUserStore.upsertRemoteUser(authUser) || findUserById(authUserId);
    if (!caller) {
      return reply.status(401).send({ msg: "User not found" });
    }
    const username = String(req.params.username || "").trim();
    if (!username) {
      return reply.status(400).send({ msg: "Username is required" });
    }
    try {
      const updated = chatUserStore.removeFriendRelationship(caller._id, username);
      return { ok: true, user: sanitizeUser(updated) };
    } catch (error) {
      if (error?.code === "USER_NOT_FOUND") {
        return reply.status(404).send({ msg: "User not found" });
      }
      return reply.status(400).send({ msg: error?.message || "Failed to remove friend" });
    }
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
        equippedEffect: result.user.equippedEffect || "none",
        equippedAvatarEffect: result.user.equippedAvatarEffect || "none"
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

  const purchaseAvatarEffect = async (req, reply) => {
    const account = await getAuthenticatedProfileAccount(req).catch(() => null);
    const authUser = account || getAuthenticatedUser(req);
    if (!authUser) return reply.status(401).send({ msg: "Invalid token" });
    const effect = chatEffects.getEffect(req.params.effectId);
    if (!effect || effect.scope !== "avatar") {
      return reply.status(404).send({ msg: "Avatar effect not found" });
    }

    try {
      if (account) {
        let state;
        try {
          const local = chatUserStore.findById(account.id) || chatUserStore.findByUsername(account.username);
          const localOwned = new Set(chatUserStore.sanitizeUser(local)?.ownedAvatarEffects || []);
          state = localOwned.has(effect.id)
            ? await effectStore.saveOwnedAvatarEffect(account.id, effect.id, true)
            : await effectStore.purchaseAndEquipAvatar(account.id, effect);
        } catch (error) {
          if (error?.code === "AVATAR_EFFECT_ALREADY_OWNED") {
            state = await effectStore.equipAvatar(account.id, effect.id);
          } else {
          if (!["42501", "42P01"].includes(error?.code)) throw error;
          const local = chatUserStore.upsertRemoteUser(account) || findUserById(account.id);
          if (!local) {
            const localError = new Error("User not found");
            localError.code = "USER_NOT_FOUND";
            throw localError;
          }
          const localUserId = local._id || account.id;
          const owned = new Set(chatUserStore.sanitizeUser(local)?.ownedAvatarEffects || ["none"]);
          if (!owned.has(effect.id)) await profileStore.spendCoins(account.id, Number(effect.price || 0));
          chatUserStore.unlockEffect(localUserId, effect.id);
          const equipped = chatUserStore.equipAvatarEffect(localUserId, effect.id);
          state = {
            ...chatUserStore.sanitizeUser(equipped.user),
            coins: (await profileStore.findAccountById(account.id))?.coins ?? account.coins ?? 0
          };
          }
        }
        const updatedAccount = await profileStore.findAccountById(account.id);
        const user = mergeDatabaseAccountMetadata({ ...updatedAccount, ...state, source: "database" });
        chatIdentityStore.updateByUserId(account.id, {
          name: user.name || user.username,
          avatar: user.avatar || null,
          equippedEffect: user.equippedEffect || "none",
          equippedAvatarEffect: user.equippedAvatarEffect || "none",
          equippedTag: user.equippedTag || "none"
        });
        return { msg: `${effect.name} unlocked and equipped`, effect, user };
      }

      const purchase = chatUserStore.purchaseEffect(authUser._id || authUser.id, effect.id);
      const result = chatUserStore.equipAvatarEffect(authUser._id || authUser.id, effect.id);
      chatIdentityStore.updateByUserId(authUser._id || authUser.id, {
        name: result.user.name,
        avatar: result.user.avatar || null,
        equippedEffect: result.user.equippedEffect || "none",
        equippedAvatarEffect: result.user.equippedAvatarEffect || "none"
      });
      return {
        msg: `${purchase.effect.name} unlocked and equipped`,
        effect: purchase.effect,
        user: sanitizeUser(result.user)
      };
    } catch (error) {
      if (error?.code === "INSUFFICIENT_COINS") return reply.status(402).send({ msg: "Not enough coins" });
      if (["EFFECT_ALREADY_OWNED", "AVATAR_EFFECT_ALREADY_OWNED"].includes(error?.code)) return reply.status(409).send({ msg: "Avatar effect already owned" });
      if (error?.code === "USER_NOT_FOUND") return reply.status(404).send({ msg: "User not found" });
      if (["42501", "42P01"].includes(error?.code)) return reply.status(503).send({ msg: error.message || "Avatar effects database migration is required" });
      return reply.status(500).send({ msg: error.message || "Failed to purchase avatar effect" });
    }
  };

  const equipAvatarEffect = async (req, reply) => {
    const account = await getAuthenticatedProfileAccount(req).catch(() => null);
    const authUser = account || getAuthenticatedUser(req);
    if (!authUser) return reply.status(401).send({ msg: "Invalid token" });
    const effectId = String(req.body?.effectId || req.body?.avatarEffectId || "none").trim().toLowerCase();
    const effect = effectId === "none" ? { id: "none", name: "No avatar ring" } : chatEffects.getEffect(effectId);
    if (!effect || (effect.id !== "none" && effect.scope !== "avatar")) {
      return reply.status(404).send({ msg: "Avatar effect not found" });
    }

    try {
      if (account) {
        let state;
        try {
          state = await effectStore.equipAvatar(account.id, effect.id);
        } catch (error) {
          if (effect.id !== "none" && error?.code === "AVATAR_EFFECT_NOT_OWNED") {
            const local = chatUserStore.findById(account.id) || chatUserStore.findByUsername(account.username);
            const localOwned = new Set(chatUserStore.sanitizeUser(local)?.ownedAvatarEffects || []);
            if (localOwned.has(effect.id)) {
              state = await effectStore.saveOwnedAvatarEffect(account.id, effect.id, true);
            } else {
              throw error;
            }
          } else {
          if (!["42501", "42P01"].includes(error?.code)) throw error;
          const local = chatUserStore.upsertRemoteUser(account) || findUserById(account.id);
          if (!local) {
            const localError = new Error("User not found");
            localError.code = "USER_NOT_FOUND";
            throw localError;
          }
          const localUserId = local._id || account.id;
          const equipped = chatUserStore.equipAvatarEffect(localUserId, effect.id);
          state = chatUserStore.sanitizeUser(equipped.user);
          }
        }
        const updatedAccount = await profileStore.findAccountById(account.id);
        const user = mergeDatabaseAccountMetadata({ ...updatedAccount, ...state, source: "database" });
        chatIdentityStore.updateByUserId(account.id, {
          name: user.name || user.username,
          avatar: user.avatar || null,
          equippedEffect: user.equippedEffect || "none",
          equippedAvatarEffect: user.equippedAvatarEffect || "none",
          equippedTag: user.equippedTag || "none"
        });
        return { msg: effect.id === "none" ? "Avatar ring cleared" : `${effect.name} equipped`, effect, user };
      }

      const result = chatUserStore.equipAvatarEffect(authUser._id || authUser.id, effect.id);
      chatIdentityStore.updateByUserId(authUser._id || authUser.id, {
        name: result.user.name,
        avatar: result.user.avatar || null,
        equippedEffect: result.user.equippedEffect || "none",
        equippedAvatarEffect: result.user.equippedAvatarEffect || "none"
      });
      return {
        msg: effect.id === "none" ? "Avatar ring cleared" : `${effect.name} equipped`,
        effect,
        user: sanitizeUser(result.user)
      };
    } catch (error) {
      if (error?.code === "EFFECT_NOT_OWNED" || error?.code === "AVATAR_EFFECT_NOT_OWNED") return reply.status(400).send({ msg: "Avatar effect not owned" });
      if (error?.code === "USER_NOT_FOUND") return reply.status(404).send({ msg: "User not found" });
      if (["42501", "42P01"].includes(error?.code)) return reply.status(503).send({ msg: error.message || "Avatar effects database migration is required" });
      return reply.status(500).send({ msg: error.message || "Failed to equip avatar effect" });
    }
  };

  fastify.post("/api/chat-avatar-effects/:effectId/purchase", purchaseAvatarEffect);
  fastify.post("/api/tlk/chat-avatar-effects/:effectId/purchase", purchaseAvatarEffect);
  fastify.post("/api/chat-avatar-effects/equip", equipAvatarEffect);
  fastify.post("/api/tlk/chat-avatar-effects/equip", equipAvatarEffect);

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
    if (!effect || effect.scope !== "room") {
      return reply.status(400).send({ msg: "Choose a valid room effect" });
    }

    const currentUser = findUserById(authUser._id);
    if (!currentUser) {
      return reply.status(404).send({ msg: "User not found" });
    }
    if (Math.max(0, Number(currentUser.coins || 0)) < effect.price) {
      return reply.status(400).send({ msg: "Not enough coins" });
    }

    let updatedUser;
    try {
      updatedUser = chatUserStore.spendCoins(authUser._id, effect.price);
    } catch (error) {
      if (error?.code === "INSUFFICIENT_COINS") {
        return reply.status(400).send({ msg: "Not enough coins" });
      }
      throw error;
    }
    const roomEffect = chatNetState.setRoomEffect(room, {
      effectId: effect.id,
      triggeredByUserId: currentUser._id,
      triggeredByName: currentUser.name || currentUser.username || "Unknown",
      triggeredByUsername: currentUser.username || null,
      price: effect.price,
      activatedAt: Date.now(),
      durationMs: Math.max(0, Number(effect.roomDurationMs || 0))
    });

    const systemMessage = await tlkRoutes.postRoomNote(
      room,
      `${roomEffect.triggeredByName} activated the ${effect.name} room effect for ${effect.price} coin${effect.price === 1 ? "" : "s"}.`,
      tlkRoutes.SYSTEM_BOT_NAME || "System"
    );

    if (globalThis.__nebuloChatIo) {
      globalThis.__nebuloChatIo.to(room).emit("room_effect", {
        effectId: effect.id,
        effectName: effect.name,
        room,
        roomId: room,
        triggeredByName: roomEffect.triggeredByName,
        activatedAt: roomEffect.activatedAt,
        durationMs: roomEffect.durationMs,
        expiresAt: roomEffect.expiresAt,
        roomEffect
      });
    }

    return {
      msg: `${effect.name} is now live in #${room}`,
      effect,
      roomEffect,
      systemMessage: systemMessage || null,
      user: sanitizeUser(updatedUser)
    };
  });

  fastify.post("/api/chat-effects/global/activate", async (req, reply) => {
    const authUser = getAuthenticatedUser(req);
    if (!authUser) {
      return reply.status(401).send({ msg: "Invalid token" });
    }
    if (chatNetState.getModeration().lockdownActive && !isStaffAccount(authUser)) {
      return reply.status(423).send({ msg: "Global lockdown is active. Only staff can send public messages." });
    }

    const requestedEffectId = String(req.body?.effectId || "").trim().toLowerCase();
    const effect = chatEffects.getEffect(requestedEffectId);
    const publicMessage = String(req.body?.message || "").trim();
    if (!effect || effect.scope !== "global") {
      return reply.status(400).send({ msg: "Choose a valid global effect" });
    }
    if (!publicMessage) {
      return reply.status(400).send({ msg: "Message required" });
    }
    if (publicMessage.length > 280) {
      return reply.status(400).send({ msg: "Public messages are limited to 280 characters" });
    }

    const moderation = await moderatePublicMessage(publicMessage, {
      userId: authUser._id,
      username: authUser.username
    });
    if (!moderation.allowed) {
      return reply.status(moderation.unavailable ? 503 : 422).send({
        msg: moderation.reason || "Message was blocked by automated moderation",
        moderation: { blocked: true, category: moderation.category || "unsafe-content" }
      });
    }

    const currentUser = findUserById(authUser._id);
    if (!currentUser) {
      return reply.status(404).send({ msg: "User not found" });
    }
    if (Math.max(0, Number(currentUser.coins || 0)) < effect.price) {
      return reply.status(400).send({ msg: "Not enough coins" });
    }

    let updatedUser;
    try {
      updatedUser = chatUserStore.spendCoins(authUser._id, effect.price);
    } catch (error) {
      if (error?.code === "INSUFFICIENT_COINS") {
        return reply.status(400).send({ msg: "Not enough coins" });
      }
      throw error;
    }

    // Broadcast global effect to all connected clients
    if (globalThis.__nebuloChatIo) {
      globalThis.__nebuloChatIo.emit('global_effect', {
        effectId: effect.id,
        triggeredByUserId: currentUser._id,
        triggeredByName: currentUser.name || currentUser.username || "Unknown",
        message: publicMessage,
        price: effect.price,
        activatedAt: Date.now(),
        durationMs: effect.roomDurationMs || 8000
      });
    }

    const systemMessage = await tlkRoutes.postRoomNote(
      "nebulo5_4", // global room
      `${currentUser.name || currentUser.username || "Unknown"} broadcast: ${publicMessage}`,
      tlkRoutes.SYSTEM_BOT_NAME || "System"
    );

    return {
      msg: `${effect.name} is now live globally`,
      effect,
      systemMessage: systemMessage || null,
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
  fastify.get("/vendor/three.module.js", (req, reply) => {
    reply.header("Cache-Control", "public, max-age=3600");
    reply.type("application/javascript; charset=utf-8");
    return reply.send(fs.createReadStream(threeModulePath));
  });

  fastify.get("/vendor/gsap.min.js", (req, reply) => {
    reply.header("Cache-Control", "public, max-age=3600");
    reply.type("application/javascript; charset=utf-8");
    return reply.send(fs.createReadStream(gsapBrowserPath));
  });

  fastify.get("/vendor/gsap/*", (req, reply) => {
    reply.header("Cache-Control", "public, max-age=3600");
    reply.type("application/javascript; charset=utf-8");
    return reply.sendFile(req.params['*'], gsapModuleRoot);
  });

  registerYouTubePlaybackRoutes(fastify, { dashJsPath: dashJsBrowserPath });

  fastify.get("/kchat", (req, reply) => {
    reply.header("Cache-Control", "no-store");
    reply.type("text/html; charset=utf-8");
    return reply.send(fs.createReadStream(path.join(chatGitClientPath, "index.html")));
  });

  fastify.get("/kchat/checkout", (req, reply) => {
    reply.header("Cache-Control", "no-store");
    return reply.sendFile("checkout.html", chatGitClientPath);
  });

  fastify.get("/kchat/app.js", (req, reply) => {
    reply.header("Cache-Control", "no-store");
    reply.type("application/javascript; charset=utf-8");
    return reply.send(fs.createReadStream(path.join(chatGitClientPath, "app.js")));
  });

  fastify.get("/kchat/app.css", (req, reply) => {
    reply.header("Cache-Control", "no-store");
    reply.type("text/css; charset=utf-8");
    return reply.send(fs.createReadStream(path.join(chatGitClientPath, "app.css")));
  });

  fastify.get("/kchat/assets/banners/*", (req, reply) => {
    reply.header("Cache-Control", "public, max-age=86400");
    reply.type("image/webp");
    return reply.sendFile(req.params["*"], path.join(chatGitClientPath, "assets", "banners"));
  });

  fastify.get("/kchat/assets/profile-effects/*", (req, reply) => {
    reply.header("Cache-Control", "public, max-age=86400");
    reply.type("image/png");
    return reply.sendFile(req.params["*"], path.join(chatGitClientPath, "assets", "profile-effects"));
  });

  fastify.get("/kchat/assets/message-materials/*", (req, reply) => {
    reply.header("Cache-Control", "public, max-age=86400");
    const relativePath = req.params["*"];
    if (relativePath.endsWith(".webp")) reply.type("image/webp");
    else if (relativePath.endsWith(".png")) reply.type("image/png");
    else if (relativePath.endsWith(".jpg") || relativePath.endsWith(".jpeg")) reply.type("image/jpeg");
    return reply.sendFile(relativePath, path.join(chatGitClientPath, "assets", "message-materials"));
  });

  fastify.get("/kchat/notification-sw.js", (req, reply) => {
    reply.header("Cache-Control", "no-store");
    return reply.sendFile("notification-sw.js", chatGitClientPath);
  });

  fastify.get("/notification-sw.js", (req, reply) => {
    reply.header("Cache-Control", "no-store");
    reply.header("Service-Worker-Allowed", "/");
    return reply.sendFile("notification-sw.js", chatGitClientPath);
  });

  fastify.get("/kchat/modules/*", (req, reply) => {
    reply.header("Cache-Control", "no-store");
    const relativePath = req.params['*'];
    const filePath = path.join(chatGitClientPath, 'modules', relativePath);
    try {
      const content = fs.readFileSync(filePath);
      const ext = String(path.extname(relativePath || '') || '').toLowerCase();
      const contentType =
        ext === '.js' || ext === '.mjs' ? 'application/javascript' :
        ext === '.css' ? 'text/css' :
        ext === '.json' ? 'application/json' :
        ext === '.mp3' ? 'audio/mpeg' :
        ext === '.wav' ? 'audio/wav' :
        ext === '.ogg' ? 'audio/ogg' :
        ext === '.png' ? 'image/png' :
        ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' :
        ext === '.svg' ? 'image/svg+xml' :
        'application/octet-stream';
      reply.type(contentType).send(content);
    } catch (err) {
      console.error('Failed to read file:', filePath, err.message);
      reply.status(404).send('File not found');
    }
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

  fastify.get("/argon-tiktok-feed-cache.json", (_req, reply) => {
    const payload = argonPlugin.getTikTokFeedPayload();
    if (!payload) {
      return reply
        .header("Cache-Control", "no-store")
        .type("application/json; charset=utf-8")
        .send({ itemList: [], hasMore: true, adsOffset: 0 });
    }
    return reply
      .header("Cache-Control", "no-store")
      .type("application/json; charset=utf-8")
      .send(payload);
  });

  fastify.get("/api/runtime-cache-reset", (_req, reply) => {
    return reply
      .header("Clear-Site-Data", '"cache"')
      .header("Cache-Control", "no-store")
      .code(204)
      .send();
  });

  let localGamesCatalogCache = { modifiedAt: -1, payload: null };

  const readLocalGamesCatalog = () => {
    const stat = fs.statSync(activitiesCatalogPath);
    if (localGamesCatalogCache.payload && localGamesCatalogCache.modifiedAt === stat.mtimeMs) {
      return localGamesCatalogCache.payload;
    }

    const parsed = JSON.parse(fs.readFileSync(activitiesCatalogPath, "utf8"));
    const games = [];
    const categories = new Set();

    for (const entry of Array.isArray(parsed) ? parsed : []) {
      const rawUrl = String(entry?.url || "").trim();
      if (!/^\/(?:games|chemistry-games)\//.test(rawUrl) || rawUrl.startsWith("//") || rawUrl.includes("\\")) {
        continue;
      }

      let launchUrl = "";
      try {
        const parsedUrl = new URL(rawUrl, "http://nebulo.local");
        if (parsedUrl.origin !== "http://nebulo.local") continue;
        launchUrl = parsedUrl.pathname + parsedUrl.search;
      } catch {
        continue;
      }

      const name = String(entry?.name || "Untitled game").trim().slice(0, 120) || "Untitled game";
      const entryCategories = (Array.isArray(entry?._cat) ? entry._cat : [])
        .map((category) => String(category || "").trim().toLowerCase().replace(/[^a-z0-9 -]/g, ""))
        .filter(Boolean)
        .slice(0, 5);
      entryCategories.forEach((category) => categories.add(category));

      const rawImage = String(entry?.image || "").trim();
      const image = /^\/(?:assets\/img\/game|games\/platinum\/cover)\//.test(rawImage) && !rawImage.startsWith("//")
        ? rawImage
        : "";

      games.push({
        id: String(entry?.id || `game-${games.length}`).replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 80),
        name,
        description: String(entry?.description || "").trim().slice(0, 240),
        url: launchUrl,
        image,
        categories: entryCategories
      });
    }

    games.sort((left, right) => left.name.localeCompare(right.name, undefined, { sensitivity: "base" }));
    const payload = { games, categories: Array.from(categories).sort(), total: games.length };
    localGamesCatalogCache = { modifiedAt: stat.mtimeMs, payload };
    return payload;
  };

  fastify.get("/setup", (_req, reply) => reply.redirect("/setup-v2", 302));
  fastify.get("/setup.html", (_req, reply) => reply.redirect("/setup-v2", 302));

  fastify.get("/setup-v2", (_req, reply) => {
    reply.header("Cache-Control", "no-store");
    return reply.sendFile("setup.html");
  });

  fastify.get("/api/setup-mode", (req, reply) => {
    reply.header("Cache-Control", "no-store");
    return { mode: getSetupMode(req) || null };
  });

  fastify.post("/setup/mode", (req, reply) => {
    const mode = String(req.body?.mode || "").trim().toLowerCase();
    if (mode !== "games" && mode !== "full") {
      return reply.code(400).type("text/plain; charset=utf-8").send("Invalid setup mode");
    }
    setSetupModeCookie(reply, mode);
    reply.header("Cache-Control", "no-store");
    return reply.redirect(mode === "games" ? "/games" : "/@?tour=1", 303);
  });

  fastify.get("/games", (_req, reply) => {
    reply.header("Cache-Control", "no-store");
    return reply.sendFile("games-only.html");
  });

  fastify.get("/api/local-games", (_req, reply) => {
    try {
      return reply.header("Cache-Control", "no-store").send(readLocalGamesCatalog());
    } catch (error) {
      console.error("Could not read local game catalog:", error?.message || error);
      return reply.code(500).send({ error: "Local game catalog unavailable" });
    }
  });

  // Serve the interstitial at the root
  fastify.get("/", (req, reply) => {
    reply.header("Cache-Control", "no-store");
    return reply.sendFile("error.html");
  });

  const pages = [
    //{ path: "/", file: "ri.html" },
    { path: "/@", file: "ri.html" },
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
    { path: "/youtube-player", file: "youtube-player.html" },
    { path: "/youtube-shorts", file: "youtube-shorts.html" },
    { path: "/geometry", file: "gm.html" },
    { path: "/chemistry", file: "ch.html" },
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
    ["/lessons", "/chemistry"],
    ["/gs.html", "/chemistry"],
    ["/search.html", "/search"],
    ["/settings.html", "/settings"],
    ["/secret.html", "/secret"],
    ["/games.html", "/games"],
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

    // Older service workers can let upstream root-relative assets hit Fastify
    // directly. Recover the Argon origin from the requesting document instead
    // of returning the local HTML 404 page as JavaScript or CSS.
    try {
      const referer = String(req.headers.referer || "");
      const refUrl = referer ? new URL(referer) : null;
      const context = refUrl?.pathname.match(/^\/ag\/(https?)\/([^/]+)(?:\/|$)/i);
      if (context && !normalizedPath.startsWith("/ag/")) {
        const rawTarget = String(req.raw.url || normalizedPath || "/");
        return reply.code(307).redirect(`/ag/${context[1].toLowerCase()}/${context[2]}${rawTarget}`);
      }
    } catch {}

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

  // ─── Link Embed Fetcher ──────────────────────────────────────────────────────
  // Cache link-embed metadata to avoid hammering upstream sites.
  const embedCache = new Map();
  const EMBED_CACHE_TTL = 5 * 60 * 1000;

  function getCachedEmbed(key) {
    const hit = embedCache.get(key);
    if (!hit) return null;
    if (Date.now() > hit.exp) { embedCache.delete(key); return null; }
    return hit.val;
  }

  function setCachedEmbed(key, val) {
    embedCache.set(key, { val, exp: Date.now() + EMBED_CACHE_TTL });
  }

  fastify.get("/api/embed", async (req, reply) => {
    const url = String(req.query.url || "").trim();
    if (!url) return reply.status(400).send({ error: "Missing url parameter" });

    // Only allow http/https
    if (!/^https?:\/\//i.test(url)) return reply.status(400).send({ error: "Only http/https URLs are supported" });

    // Block private/internal IP ranges (SSRF protection)
    try {
      const parsed = new URL(url);
      const hostname = parsed.hostname.toLowerCase();
      if (
        hostname === "localhost" ||
        hostname === "127.0.0.1" ||
        hostname === "0.0.0.0" ||
        hostname === "[::1]" ||
        hostname === "[::]" ||
        hostname.endsWith(".local") ||
        hostname.endsWith(".localhost") ||
        /^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname) ||
        /^172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}$/.test(hostname) ||
        /^192\.168\.\d{1,3}\.\d{1,3}$/.test(hostname)
      ) {
        return reply.status(400).send({ error: "URL points to a private network address", url, source: null });
      }
    } catch {
      return reply.status(400).send({ error: "Invalid URL", url, source: null });
    }

    const cacheKey = url.toLowerCase();
    const cached = getCachedEmbed(cacheKey);
    if (cached) return cached;

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);

      const res = await fetch(url, {
        signal: controller.signal,
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (compatible; NebuloEmbed/1.0)",
          "Accept": "text/html,application/xhtml+xml",
        },
        redirect: "follow",
      });
      clearTimeout(timeout);

      if (!res.ok) {
        const result = { error: `Upstream ${res.status}`, url, source: null };
        setCachedEmbed(cacheKey, result);
        return result;
      }

      // Only parse HTML responses
      const contentType = (res.headers.get("content-type") || "").toLowerCase();
      if (!contentType.includes("text/html") && !contentType.includes("application/xhtml")) {
        const result = { error: "Not an HTML page", url, source: null };
        setCachedEmbed(cacheKey, result);
        return result;
      }

      const html = await res.text();
      const finalUrl = res.url || url;

      // Extract metadata via regex (lightweight, no parser needed)
      let title = "";
      let description = "";
      let image = "";
      let icon = "";

      // og:title
      const ogTitle = html.match(/<meta\s[^>]*property=["']og:title["'][^>]*content=["']([^"']*)["'][^>]*>/i);
      if (ogTitle) title = ogTitle[1];
      // Also try content before property
      const ogTitle2 = html.match(/<meta\s[^>]*content=["']([^"']*)["'][^>]*property=["']og:title["'][^>]*>/i);
      if (!title && ogTitle2) title = ogTitle2[1];
      // Fallback: <title>
      if (!title) {
        const titleTag = html.match(/<title>([\s\S]*?)<\/title>/i);
        if (titleTag) title = titleTag[1].replace(/\s+/g, " ").trim();
      }

      // og:description
      const ogDesc = html.match(/<meta\s[^>]*property=["']og:description["'][^>]*content=["']([^"']*)["'][^>]*>/i);
      if (ogDesc) description = ogDesc[1];
      const ogDesc2 = html.match(/<meta\s[^>]*content=["']([^"']*)["'][^>]*property=["']og:description["'][^>]*>/i);
      if (!description && ogDesc2) description = ogDesc2[1];
      // Fallback: <meta name="description">
      if (!description) {
        const metaDesc = html.match(/<meta\s[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i);
        if (metaDesc) description = metaDesc[1];
      }

      // og:image
      const ogImg = html.match(/<meta\s[^>]*property=["']og:image["'][^>]*content=["']([^"']*)["'][^>]*>/i);
      if (ogImg) image = ogImg[1];
      const ogImg2 = html.match(/<meta\s[^>]*content=["']([^"']*)["'][^>]*property=["']og:image["'][^>]*>/i);
      if (!image && ogImg2) image = ogImg2[1];

      // Resolve relative image URL
      if (image && !/^https?:\/\//i.test(image)) {
        try { image = new URL(image, finalUrl).href; } catch { image = ""; }
      }

      // Favicon
      const iconLink = html.match(/<link\s[^>]*rel=["'](?:shortcut )?icon["'][^>]*href=["']([^"']*)["'][^>]*>/i);
      if (iconLink) icon = iconLink[1];
      const iconLink2 = html.match(/<link\s[^>]*href=["']([^"']*)["'][^>]*rel=["'](?:shortcut )?icon["'][^>]*>/i);
      if (!icon && iconLink2) icon = iconLink2[1];

      // Resolve relative favicon URL
      if (icon && !/^https?:\/\//i.test(icon)) {
        try { icon = new URL(icon, finalUrl).href; } catch { icon = ""; }
      }

      // Fallback: guess /favicon.ico
      if (!icon) {
        try { icon = new URL("/favicon.ico", finalUrl).href; } catch {}
      }

      // Truncate title/description
      if (title.length > 200) title = title.slice(0, 200) + "…";
      if (description.length > 400) description = description.slice(0, 400) + "…";

      // Decode HTML entities
      title = title.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, "\"").replace(/&#39;/g, "'");
      description = description.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, "\"").replace(/&#39;/g, "'");

      const result = {
        url: finalUrl,
        title: title || null,
        description: description || null,
        image: image || null,
        icon: icon || null,
        domain: null,
      };

      try { result.domain = new URL(finalUrl).hostname.replace(/^www\./, ""); } catch {}

      setCachedEmbed(cacheKey, result);
      return result;
    } catch (err) {
      const errorResult = { error: err?.message || "Failed to fetch embed", url, source: null };
      // Still cache failures briefly to avoid hammering
      setCachedEmbed(cacheKey, errorResult);
      return errorResult;
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
