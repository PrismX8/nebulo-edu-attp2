'use strict';

const fs          = require('fs');
const path        = require('path');
const Fastify     = require('fastify');
const argonPlugin = require('./argon-module');

const fastify = Fastify({ logger: true });
const publicDir = path.join(__dirname, 'public');
const launcherPath = path.join(publicDir, 'index.html');

// ── Launcher page (public/index.html) ───────────────────────────────────────
// We intentionally avoid a catch-all static handler here because proxied apps
// often request root-relative paths such as "/images/...", "/_next/...", or
// "/service-worker.js". Those need to fall through to argon rather than being
// swallowed by a local static 404 page.
async function sendLauncher(reply) {
  const html = await fs.promises.readFile(launcherPath, 'utf8');
  reply.type('text/html; charset=utf-8').send(html);
}

fastify.get('/', async (_request, reply) => sendLauncher(reply));
fastify.get('/index.html', async (_request, reply) => sendLauncher(reply));

// Example: serve UV static files alongside argon (same pattern as UV itself)
//
//   const { uvPath } = require('@titaniumnetwork-dev/ultraviolet');
//   fastify.register(require('@fastify/static'), {
//     root: uvPath,
//     prefix: '/uv/',
//     decorateReply: false,
//   });

// ── Mount argon proxy ────────────────────────────────────────────────────────
//
// proxy_url    — the full public URL of this server.
//                argon injects this into its service worker and every proxied
//                page so the browser knows where to send requests.
//
// token_prefix — URL prefix for all proxy traffic.
//                Pick something unique so it never collides with your routes.
//                Must start AND end with "/".
//
// Equivalent to how UV is mounted:
//   fastify.register(fastifyStatic, { root: uvPath, prefix: '/uv/' })
//
// but argon is a server-side proxy so it registers request handlers instead
// of static files.

// Argon is NOT a second server — it is a function Fastify calls for /ag/* routes.
// argon-module.js prevents argon.cjs from calling serve() so only Fastify runs.
fastify.register(argonPlugin, {
  proxy_url:    process.env.PROXY_URL    || 'http://localhost:3010',
  token_prefix: process.env.TOKEN_PREFIX || '/ag/',
});

// ── Start ────────────────────────────────────────────────────────────────────

const PORT = parseInt(process.env.PORT || '3010', 10);

fastify.listen({ port: PORT, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  const prefix = process.env.TOKEN_PREFIX || '/ag/';
  console.log(`Argon proxy      →  ${address}${prefix}`);
  console.log(`Service worker   →  ${address}/argon_service_worker.js`);
});
