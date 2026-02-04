import cluster from "node:cluster";
import { cpus, hostname as osHostname } from "node:os";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { performance } from "node:perf_hooks";
import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import { server as wisp, logging } from "@mercuryworkshop/wisp-js/server";
import { scramjetPath } from "@mercuryworkshop/scramjet/path";
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";
import "dotenv/config";
import Ably from "ably";

const WORKERS = Math.max(1, parseInt(process.env.WEB_CONCURRENCY || `${cpus().length}`, 10) || 1);

if (cluster.isPrimary && WORKERS > 1) {
  for (let i = 0; i < WORKERS; i++) cluster.fork();
  cluster.on("exit", () => cluster.fork());
} else {
  const publicPath = fileURLToPath(new URL("public/", import.meta.url));
  const pagesPath = fileURLToPath(new URL("pages/", import.meta.url));

  logging.set_level(logging.NONE);
  Object.assign(wisp.options, {
    allow_udp_streams: false,
    hostname_blacklist: [
      /pornhub\.com/i,
      /xvideos\.com/i,
      /redtube\.com/i,
      /youporn\.com/i,
      /xhamster\.com/i,
      /xnxx\.com/i,
      /spankbang\.com/i,
      /tube8\.com/i,
      /tnaflix\.com/i,
      /porndig\.com/i,
      /efukt\.com/i,
      /empflix\.com/i,
      /javhub\.com/i,
      /faproulette\.com/i,
      /sex\.com/i,
      /cam4\.com/i,
      /chaturbate\.com/i,
      /livejasmin\.com/i,
      /onlyfans\.com/i,
      /fansly\.com/i,
      /manyvids\.com/i,
      /clips4sale\.com/i,
    ],
  });

  const fastify = Fastify({
    logger: false,
    ignoreTrailingSlash: true,
    trustProxy: true,
    bodyLimit: 1024 * 1024,
    maxParamLength: 4096,
    pluginTimeout: 20000,
    requestTimeout: 30000,
    keepAliveTimeout: 65000,
    connectionTimeout: 30000,
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

  const ONE_HOUR = 60 * 60;

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
      if (pathName.endsWith(".html")) {
        res.setHeader("Cache-Control", "no-store");
      } else if (/\.(js|mjs|css|png|jpg|jpeg|gif|svg|ico|woff2?|ttf|map|wasm)$/.test(pathName)) {
        res.setHeader("Cache-Control", "public, max-age=3600, immutable");
      } else {
        res.setHeader("Cache-Control", "public, max-age=300");
      }
    },
  });

  fastify.register(fastifyStatic, {
    root: scramjetPath,
    prefix: "/scram/",
    decorateReply: false,
    etag: true,
    maxAge: ONE_HOUR,
    setHeaders: (res) => res.setHeader("Cache-Control", "public, max-age=3600, immutable"),
  });

  fastify.register(fastifyStatic, {
    root: epoxyPath,
    prefix: "/epoxy/",
    decorateReply: false,
    etag: true,
    maxAge: ONE_HOUR,
    setHeaders: (res) => res.setHeader("Cache-Control", "public, max-age=3600, immutable"),
  });

  fastify.register(fastifyStatic, {
    root: baremuxPath,
    prefix: "/baremux/",
    decorateReply: false,
    etag: true,
    maxAge: ONE_HOUR,
    setHeaders: (res) => res.setHeader("Cache-Control", "public, max-age=3600, immutable"),
  });

  const pages = [
    { path: "/", file: "rindex.html" },
    { path: "/@", file: "rindex.html" },
    { path: "/lessons", file: "games.html" },
    { path: "/tools", file: "apps.html" },
    { path: "/quiz", file: "tabs.html" },
    { path: "/settings", file: "settings.html" },
    { path: "/test", file: "browser.html" },
    { path: "/search", file: "search.html" },
    { path: "/helper", file: "ai.html" },
    { path: "/help", file: "help.html" },
    { path: "/tool", file: "tools.html" },
    { path: "/blocked", file: "blocked.html" },
    { path: "/links", file: "links.html" },
    { path: "/bug", file: "report.html" },
    { path: "/whatsnew", file: "whatsnew.html" },
    { path: "/achievements", file: "achievements.html" },
    { path: "/watch", file: "watch.html" },
  ];

  for (const page of pages) {
    fastify.get(page.path, (req, reply) => {
      reply.header("Cache-Control", "no-store");
      return reply.sendFile(page.file);
    });
  }

  fastify.setNotFoundHandler((req, reply) => {
    reply.header("Cache-Control", "no-store");
    return reply.sendFile("404.html");
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

  let port = parseInt(process.env.PORT || "8081", 10);
  if (isNaN(port)) port = 8081;

  fastify.listen({ port, host: "0.0.0.0" });
}
