'use strict';

const { Readable } = require('stream');
const fs = require('fs');
const path = require('path');

// MUST happen before require('./argon.cjs').
// argon.cjs checks:  typeof globalThis.addEventListener === "undefined"
// When that returns true (plain Node.js) it calls serve() and starts its own
// HTTP server.  Defining addEventListener first makes argon believe it is
// running in a Cloudflare-Worker / browser context, so it skips serve() and
// only sets up its Hono middleware — leaving the server lifecycle to us.
if (typeof globalThis.addEventListener === 'undefined') {
  globalThis.addEventListener = function () {};
}

const argon = require('./argon.cjs');

/**
 * Client-side script to prevent window.location escape from Argon proxy.
 * Runs immediately before page content loads to intercept location changes.
 */
const locationTrapScript = `<script>
(function() {
  const argonPrefix = '/ag/';
  const pageUrl = new URL(window.location.href);
  const isArgonPage = pageUrl.pathname.startsWith(argonPrefix);
  
  if (!isArgonPage) return;
  
  const originalDescriptor = Object.getOwnPropertyDescriptor(window, 'location');
  let allowEscape = false;
  
  try {
    Object.defineProperty(window, 'location', {
      get() { return originalDescriptor.value; },
      set(val) {
        if (!val || typeof val !== 'string') return;
        const targetUrl = String(val);
        if (targetUrl.startsWith(argonPrefix) || targetUrl.startsWith('/')) {
          if (targetUrl.startsWith('/')) originalDescriptor.value.href = argonPrefix + 'https' + targetUrl;
          else originalDescriptor.value.href = targetUrl;
        } else if (targetUrl.startsWith('http://') || targetUrl.startsWith('https://')) {
          try {
            const url = new URL(targetUrl);
            originalDescriptor.value.href = argonPrefix + url.protocol.slice(0,-1) + '/' + url.host + url.pathname + url.search + url.hash;
          } catch { }
        }
      },
      configurable: true
    });
  } catch (e) {
    // location property might already be defined and non-configurable by another proxy
    // Silently fail - the proxy should still work without this trap
    console.debug('Could not redefine location property:', e.message);
  }
})();
</script>`;


// ─── helpers ────────────────────────────────────────────────────────────────

/**
 * Pipe a WHATWG Fetch API Response into a Fastify reply.
 * Uses a Node.js Readable stream so large payloads (video, files, …) are
 * streamed rather than buffered into memory.
 */
async function sendArgonResponse(response, reply, headerOverrides = null) {
  reply.status(response.status);

  for (const [key, value] of response.headers.entries()) {
    // Node.js / Fastify manages transfer-encoding itself.
    if (key.toLowerCase() !== 'transfer-encoding') {
      reply.header(key, value);
    }
  }

  if (headerOverrides) {
    for (const [key, value] of Object.entries(headerOverrides)) {
      reply.header(key, value);
    }
  }

  if (response.body) {
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('text/html')) {
      const text = await response.text();
      const withTrap = text.replace('<head>', '<head>' + locationTrapScript).replace('<!DOCTYPE html>', '<!DOCTYPE html>' + locationTrapScript);
      const injected = withTrap.includes(locationTrapScript) ? withTrap : locationTrapScript + text;
      reply.header('content-type', contentType);
      return reply.send(injected);
    }
    return reply.send(Readable.fromWeb(response.body));
  }
  return reply.send(Buffer.alloc(0));
}

/**
 * Build a WHATWG Fetch API Request from a Fastify request object.
 * The body is already a raw Buffer because we register a catch-all content-
 * type parser inside the plugin (see below).
 */
function toFetchRequest(request, urlOverride) {
  const host = request.headers.host || 'localhost';
  const requestUrl = typeof urlOverride === 'string' ? urlOverride : request.url;
  const url = `${request.protocol || 'http'}://${host}${requestUrl}`;

  const init = {
    method: request.method,
    headers: new Headers(request.headers),
  };

  // Spoof User-Agent to avoid YouTube rate limiting and auth blocking
  init.headers.set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  
  // Remove headers that may trigger blocks
  init.headers.delete('x-forwarded-for');
  init.headers.delete('x-forwarded-proto');
  init.headers.delete('x-forwarded-host');
  init.headers.delete('cf-ray');
  init.headers.delete('cf-connecting-ip');
  init.headers.delete('x-real-ip');
  
  // Add proper origin/referer for YouTube requests
  if (url.includes('youtube') || url.includes('googlevideo') || url.includes('ggpht') || url.includes('googleapis')) {
    if (!init.headers.has('origin')) {
      init.headers.set('origin', 'https://www.youtube.com');
    }
    if (!init.headers.has('referer')) {
      init.headers.set('referer', 'https://www.youtube.com/');
    }
    // YouTube requires this for embedded player
    init.headers.set('sec-fetch-site', 'same-origin');
    init.headers.set('sec-fetch-mode', 'cors');
    init.headers.set('sec-fetch-dest', 'empty');
  }

  if (request.body && request.body.length > 0) {
    init.body = request.body;
    // Required by the Fetch spec when sending a body with a streaming-capable
    // transport (Node.js fetch / undici).
    init.duplex = 'half';
  }

  return new Request(url, init);
}

const publicRoot = path.join(__dirname, 'public');
const noopServiceWorker = [
  "self.addEventListener('install', function(){ self.skipWaiting(); });",
  "self.addEventListener('activate', function(event){ event.waitUntil(self.clients.claim()); });",
].join('');

function safeDecodeURIComponent(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function isLocalPublicFile(requestUrl) {
  const pathname = safeDecodeURIComponent(String(requestUrl || '').split('?')[0] || '/');
  if (!pathname || pathname === '/') return true;

  const resolved = path.resolve(publicRoot, '.' + pathname);
  if (!resolved.startsWith(publicRoot)) return false;

  try {
    return fs.statSync(resolved).isFile();
  } catch {
    return false;
  }
}

function parseCookieHeader(header) {
  const out = Object.create(null);
  for (const chunk of String(header || '').split(';')) {
    const trimmed = chunk.trim();
    if (!trimmed) continue;
    const idx = trimmed.indexOf('=');
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim();
    if (key) out[key] = value;
  }
  return out;
}

function extractProxyContextFromProxyPath(pathname, tokenPrefix) {
  const cleanPath = String(pathname || '');
  const normalizedPrefix = tokenPrefix.endsWith('/') ? tokenPrefix : `${tokenPrefix}/`;
  if (!cleanPath.startsWith(normalizedPrefix)) return null;

  const rest = cleanPath.slice(normalizedPrefix.length);
  const match = /^(https?)\/([^/]+)/i.exec(rest);
  if (!match) return null;

  return {
    protocol: match[1].toLowerCase(),
    host: match[2],
  };
}

function extractProxyContextFromReferer(request, tokenPrefix) {
  const referer = request.headers.referer;
  if (!referer) return null;

  try {
    const refererUrl = new URL(referer);
    const currentHost = request.headers.host || 'localhost';
    if (refererUrl.host !== currentHost) return null;
    return extractProxyContextFromProxyPath(refererUrl.pathname, tokenPrefix);
  } catch {
    return null;
  }
}

function extractProxyContextFromCookies(request) {
  const cookies = parseCookieHeader(request.headers.cookie || '');
  const protocol = cookies.proxy_real_protocol;
  const host = cookies.proxy_real_host;
  if (!protocol || !host) return null;
  if (protocol !== 'http' && protocol !== 'https') return null;
  return { protocol, host };
}

function rewriteRootRelativeProxyUrl(request, tokenPrefix) {
  const requestUrl = String(request.url || '/');
  const pathname = requestUrl.split('?')[0] || '/';
  const normalizedPrefix = tokenPrefix.endsWith('/') ? tokenPrefix : `${tokenPrefix}/`;

  if (pathname.startsWith('/unified/')) {
    return `${normalizedPrefix}https/cdn.privacy-mgmt.com${requestUrl.startsWith('/') ? requestUrl : `/${requestUrl}`}`;
  }

  if (pathname === '/argon_service_worker.js' || pathname === '/argon-response-injected.js') {
    return requestUrl;
  }
  if (pathname.startsWith(normalizedPrefix)) {
    return requestUrl;
  }
  if (isLocalPublicFile(requestUrl)) {
    return requestUrl;
  }

  const context = extractProxyContextFromReferer(request, normalizedPrefix) || extractProxyContextFromCookies(request);
  if (!context) {
    return requestUrl;
  }

  return `${normalizedPrefix}${context.protocol}/${context.host}${requestUrl.startsWith('/') ? requestUrl : `/${requestUrl}`}`;
}

/**
 * Fix malformed localhost URLs that YouTube player generates.
 * URLs like `:400/s/player/...` should be rewritten to go through the proxy.
 */
function normalizeYouTubeUrls(url) {
  // Handle YouTube's localhost:400 and `:port` URLs
  if (url.match(/^:\d+\//)) {
    // Convert `:400/s/player/...` to `https://www.youtube.com/s/player/...`
    return url.replace(/^:\d+/, 'https://www.youtube.com');
  }
  if (url.includes('localhost:400')) {
    return url.replace('localhost:400', 'www.youtube.com');
  }
  return url;
}

function extractProxyTargetFromRequestUrl(requestUrl, tokenPrefix) {
  const normalizedPrefix = tokenPrefix.endsWith('/') ? tokenPrefix : `${tokenPrefix}/`;
  const fullPath = String(requestUrl || '/');
  const pathname = fullPath.split('?')[0] || '/';
  const context = extractProxyContextFromProxyPath(pathname, normalizedPrefix);
  if (!context) return null;

  const rest = pathname.slice(normalizedPrefix.length);
  const match = /^(https?)\/[^/]+(\/.*)?$/i.exec(rest);
  if (!match) return null;

  const queryIndex = fullPath.indexOf('?');
  return {
    protocol: context.protocol,
    host: context.host,
    resourcePath: match[2] || '/',
    search: queryIndex === -1 ? '' : fullPath.slice(queryIndex),
  };
}

function buildProxyUrlForContext(context, resourcePath, search, tokenPrefix, hash = '') {
  const normalizedPrefix = token_prefix.endsWith('/') ? token_prefix : `${token_prefix}/`;
  const safePath = resourcePath && resourcePath.startsWith('/') ? resourcePath : `/${resourcePath || ''}`;
  return `${normalizedPrefix}${context.protocol}/${context.host}${safePath}${search || ''}${hash || ''}`;
}

function normalizeRedirectLocation(location) {
  if (typeof location !== 'string') return location;
  if (/^https?:\/[^/]/i.test(location)) {
    return location.replace(/^((?:https?):)\/(?!\/)/i, '$1//');
  }
  if (/^https?\//i.test(location)) {
    return location.replace(/^(https?)\//i, '$1://');
  }
  return location;
}

function rewriteRedirectLocation(location, currentTarget, tokenPrefix) {
  if (!location || !currentTarget) return null;
  location = normalizeRedirectLocation(location);
  const normalizedPrefix = tokenPrefix.endsWith('/') ? tokenPrefix : `${tokenPrefix}/`;
  if (location.startsWith(normalizedPrefix)) return location;

  try {
    const baseUrl = `${currentTarget.protocol}://${currentTarget.host}${currentTarget.resourcePath || '/'}${currentTarget.search || ''}`;
    const locationUrl = new URL(location, baseUrl);
    if (locationUrl.pathname.startsWith(normalizedPrefix)) {
      return `${locationUrl.pathname}${locationUrl.search}${locationUrl.hash}`;
    }
    return buildProxyUrlForContext({
      protocol: locationUrl.protocol.slice(0, -1),
      host: locationUrl.host,
    }, locationUrl.pathname + locationUrl.search, tokenPrefix, locationUrl.hash);
  } catch {
    if (location.startsWith('http/') || location.startsWith('https/')) {
      return `/${location}`;
    }
    return null;
  }
}

function normalizeSpecialProxyUrl(requestUrl, tokenPrefix) {
  const currentTarget = extractProxyTargetFromRequestUrl(requestUrl, tokenPrefix);
  if (!currentTarget) return requestUrl;

  if (currentTarget.resourcePath.startsWith('/unified/')) {
    return buildProxyUrlForContext({
      protocol: 'https',
      host: 'cdn.privacy-mgmt.com',
    }, currentTarget.resourcePath, currentTarget.search, tokenPrefix);
  }

  return requestUrl;
}

function isAssetRetryCandidate(resourcePath) {
  const path = String(resourcePath || '');
  if (!path) return false;
  if (path.startsWith('/Build/') || path.startsWith('/cdn-cgi/') || path.startsWith('/_next/') || path.startsWith('/images/')) {
    return true;
  }
  return /\.(?:wasm|data|js|mjs|css|json|png|jpg|jpeg|webp|svg|woff2?|mp4|webm|br)(?:$|\?)/i.test(path);
}

// ─── Fastify plugin ──────────────────────────────────────────────────────────

/**
 * Fastify plugin — mounts argon as a server-side proxy handler.
 *
 * Options
 * -------
 * proxy_url    {string}
 *   Full public URL of this server, e.g. "http://localhost:3010".
 *   argon injects this value into the service worker and every proxied page
 *   so the browser knows where to send requests.
 *
 * token_prefix {string}
 *   URL prefix for all proxied traffic, e.g. "/service/".
 *   Must start and end with "/".  Keep it unique so it never clashes with
 *   your own routes.
 *
 * Usage (server.js)
 * -----------------
 *   const argonPlugin = require('./argon-module');
 *   fastify.register(argonPlugin, {
 *     proxy_url:    'http://localhost:3010',
 *     token_prefix: '/ag/',
 *   });
 *
 * How this avoids a second server
 * --------------------------------
 * argon.cjs checks `typeof globalThis.addEventListener === "undefined"` to
 * detect Node.js.  When true it calls serve() and opens its own HTTP port.
 * We define globalThis.addEventListener at the top of this file BEFORE
 * require('./argon.cjs'), so argon skips serve() entirely.  Fastify is the
 * only process listening on any port; argon.default.fetch is just a function.
 */
async function argonPlugin(fastify, options) {
  const {
    proxy_url    = 'http://localhost:3010',
    token_prefix = '/ag/',
    use_not_found_fallback = true,
  } = options;
  const barePrefix = token_prefix.endsWith('/') ? token_prefix.slice(0, -1) : token_prefix;

  // Sync globals at startup too (argon reads them outside request context).
  globalThis.proxy_url    = proxy_url;
  globalThis.token_prefix = token_prefix;

  function resolveProxyUrl(request) {
    const forwardedProto = Array.isArray(request.headers['x-forwarded-proto'])
      ? request.headers['x-forwarded-proto'][0]
      : String(request.headers['x-forwarded-proto'] || request.protocol || 'http');
    const forwardedHost = Array.isArray(request.headers['x-forwarded-host'])
      ? request.headers['x-forwarded-host'][0]
      : String(request.headers['x-forwarded-host'] || request.headers.host || '');
    const protocol = forwardedProto.split(',')[0].trim() || 'http';
    const host = forwardedHost.split(',')[0].trim();
    if (!host) return proxy_url;
    return `${protocol}://${host}`;
  }

  // ── Body parsing ───────────────────────────────────────────────────────────
  // Remove Fastify's built-in JSON / text parsers for this plugin scope and
  // replace with a single catch-all that hands raw Buffers to argon.
  // This ensures POST bodies (forms, JSON, file uploads, …) are forwarded
  // verbatim without re-serialisation.
  fastify.removeAllContentTypeParsers();
  fastify.addContentTypeParser(
    '*',
    { parseAs: 'buffer' },
    (_req, body, done) => done(null, body),
  );

  // ── Shared handler ─────────────────────────────────────────────────────────
  async function handleArgon(request, reply) {
    const effectiveProxyUrl = resolveProxyUrl(request);
    const argonEnv = { proxy_url: effectiveProxyUrl, token_prefix };
    globalThis.proxy_url = effectiveProxyUrl;
    globalThis.token_prefix = token_prefix;
    let rewrittenUrl = normalizeSpecialProxyUrl(rewriteRootRelativeProxyUrl(request, token_prefix), token_prefix);
    
    // Fix YouTube's malformed URLs
    rewrittenUrl = normalizeYouTubeUrls(rewrittenUrl);
    
    const fetchReq = toFetchRequest(request, rewrittenUrl);
    const requestPath = String(request.url || '').split('?')[0] || '/';
    const noStoreHeaders = (requestPath === '/argon_service_worker.js' || requestPath === '/service-worker.js' || requestPath.startsWith('/unified/'))
      ? { 'Cache-Control': 'no-store, no-cache, must-revalidate' }
      : null;
    console.log(`[argon] ${request.method} ${rewrittenUrl}`);
    try {
      let response = await argon.default.fetch(fetchReq, argonEnv);

      // Retry on 429 (rate limit) with backoff
      if (response.status === 429 && request.method === 'GET') {
        console.log(`[argon] rate limited (429), retrying in 1s: ${rewrittenUrl}`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        response = await argon.default.fetch(toFetchRequest(request, rewrittenUrl), argonEnv);
      }

      if (request.method === 'GET' && response.status === 404) {
        const currentTarget = extractProxyTargetFromRequestUrl(rewrittenUrl, token_prefix);
        const refererContext = extractProxyContextFromReferer(request, token_prefix);
        if (currentTarget && refererContext && isAssetRetryCandidate(currentTarget.resourcePath)) {
          const sameTarget = currentTarget.protocol === refererContext.protocol && currentTarget.host === refererContext.host;
          if (!sameTarget) {
            const retryUrl = buildProxyUrlForContext(refererContext, currentTarget.resourcePath, currentTarget.search, token_prefix);
            console.log(`[argon] retry 404 ${rewrittenUrl} -> ${retryUrl}`);
            const retryResponse = await argon.default.fetch(toFetchRequest(request, retryUrl), argonEnv);
            if (retryResponse.status !== 404) {
              response = retryResponse;
            }
          }
        }
      }

      let responseHeaderOverrides = response.status === 404
        ? { 'Cache-Control': 'no-store, no-cache, must-revalidate', ...(noStoreHeaders || {}) }
        : (noStoreHeaders ? { ...noStoreHeaders } : {});

      if (response.status >= 300 && response.status < 400) {
        const currentTarget = extractProxyTargetFromRequestUrl(rewrittenUrl, token_prefix);
        const rewrittenLocation = currentTarget && rewriteRedirectLocation(response.headers.get('location'), currentTarget, token_prefix);
        if (rewrittenLocation) {
          responseHeaderOverrides.Location = rewrittenLocation;
        }
      }

      console.log(`[argon] → ${response.status} ${rewrittenUrl}`);
      return sendArgonResponse(response, reply, responseHeaderOverrides);
    } catch (err) {
      console.error(`[argon] error on ${rewrittenUrl}:`, err);
      reply.status(502).send(`Argon proxy error: ${err.message}`);
    }
  }

  // ── Routes ─────────────────────────────────────────────────────────────────

  // argon's service worker is always registered at the site root regardless
  // of token_prefix.
  fastify.get('/argon_service_worker.js', handleArgon);
  fastify.get('/service-worker.js', async (_request, reply) => {
    reply
      .header('Cache-Control', 'no-store, no-cache, must-revalidate')
      .type('application/javascript; charset=utf-8')
      .send(noopServiceWorker);
  });
  fastify.all('/_next/*', handleArgon);
  fastify.all('/images/*', handleArgon);
  fastify.all('/unified/*', handleArgon);

  // All proxied requests live under token_prefix (GET pages, POST forms, …).
  // argon also serves argon-response-injected.js under this prefix.
  fastify.all(barePrefix, handleArgon);
  fastify.all(`${token_prefix}*`, handleArgon);

  // Many proxied apps emit root-relative chunk, image, and API URLs such as
  // "/_next/..." or "/unified/...". If those paths miss every local route,
  // forward them to argon instead of returning a local 404 HTML page.
  if (use_not_found_fallback) {
    fastify.setNotFoundHandler(handleArgon);
  }
}

module.exports = argonPlugin;
module.exports.argonPlugin = argonPlugin;
