const SW_VERSION = "2026-08-31-tiktok-fast-feed-cache-29";
let adBlockEnabled = true;

if (navigator.userAgent.includes('Firefox')) {
    Object.defineProperty(globalThis, 'crossOriginIsolated', {
        value: true,
        writable: false,
    });
}

importScripts('uv/uv.bundle.js');
importScripts('uv/uv.config.js');
importScripts('uv/uv.sw.js');
importScripts("ec/eclipse.codecs.js");
importScripts("ec/eclipse.config.js");
importScripts("ec/eclipse.rewrite.js");
importScripts("ec/eclipse.worker.js");
importScripts('/scram/scramjet.all.js');

const { ScramjetServiceWorker } = $scramjetLoadWorker();
let scramjet = null;
let uv = null;
let eclipse = null;
let scramjetConfigLoaded = false;
let scramjetRuntimeBroken = false;
let scramjetBootstrapPromise = null;
const clientUpstreamMap = new Map();
const NEBULO_LOCAL_NAVIGATION_PATHS = new Set([
    '/', '/@', '/search', '/s.html', '/rindex', '/ri.html', '/settings', '/st.html',
    '/apps', '/ap.html', '/games', '/gs.html', '/tools', '/wt.html', '/watch',
    '/help', '/links', '/report', '/secret', '/chatonly', '/chat-only', '/ch.html',
    '/tl.html', '/chemistry', '/geometry', '/blocked', '/achievements', '/whatsnew',
    '/kchat', '/youtube-player', '/youtube-shorts',
    // Setup must always load directly. In particular, its mode form is a
    // navigation POST and must never inherit a proxy context from a prior tab.
    '/setup', '/setup.html', '/setup-v2', '/setup/mode'
]);
const NEBULO_LOCAL_ASSET_PREFIXES = [
    '/assets/js/', '/assets/css/', '/assets/img/', '/assets/fonts/', '/assets/data/'
];
const NEBULO_LOCAL_GAME_PREFIXES = [
    '/games/', '/chemistry-games/'
];

function getScramjet() {
    if (scramjetRuntimeBroken) return null;
    if (!scramjet) {
        try {
            scramjet = new ScramjetServiceWorker();
        } catch {
            scramjetRuntimeBroken = true;
            return null;
        }
    }
    return scramjet;
}

function getUv() {
    if (!uv) uv = new UVServiceWorker();
    return uv;
}

function getEclipse() {
    if (!eclipse) eclipse = new EclipseServiceWorker();
    return eclipse;
}

function isProxyPortError(err) {
    const name = String(err?.name || '');
    const msg = String(err?.message || '');
    const lowerMsg = msg.toLowerCase();
    return (
        name.includes('NotFoundError') ||
        msg.includes('MessagePort') ||
        msg.includes('invalid MessagePort') ||
        lowerMsg.includes('invalid messageport') ||
        lowerMsg.includes('object store') ||
        lowerMsg.includes('one of the specified object stores was not found') ||
        lowerMsg.includes('failed to execute \'transaction\' on \'idbdatabase\'') ||
        lowerMsg.includes('there are no bare clients') ||
        lowerMsg.includes('no baretransport was set')
    );
}

// Block popunder/ad-redirect navigations commonly triggered by Flixer clones.
const FLIXER_REF_HOST_RE = /(^|\\.)the?flixer(\\.|$)|flixer/i;
const BLOCKED_AD_REDIRECT_SUFFIXES = [
    "traff.world",
    "spacefree.space",
    "onclickalgo.com",
    "onclickmega.com",
    "onclickgenius.com",
    "onclkds.com",
    "propellerads.com",
    "popads.net",
    "adsterra.com",
    "adskeeper.co.uk",
    "hilltopads.net",
    "smartadserver.com",
    "doubleclick.net",
    "adnxs.com", "adsrvr.org", "adform.net", "amazon-adsystem.com",
    "casalemedia.com", "criteo.com", "criteo.net", "pubmatic.com",
    "rubiconproject.com", "openx.net", "taboola.com", "outbrain.com",
    "serving-sys.com", "moatads.com", "media.net", "exoclick.com",
    "exosrv.com", "revcontent.com", "mgid.com", "yieldmo.com",
    "trafficjunky.net", "clickadu.com", "popcash.net", "popads.net",
];
const FLIXER_BLOCKED_RESOURCE_SUFFIXES = [
    "bvtpk.com",
];
const BLOCKED_THIRD_PARTY_RESOURCE_SUFFIXES = [
    "subduepaler.cyou",
    "traff.world",
    "spacefree.space",
    "pebblepilot.com",
    "fundingchoicesmessages.google.com",
    "googlesyndication.com",
    "googletagservices.com",
    "googleadservices.com",
    "doubleclick.net",
    "id5-sync.com",
    "rlcdn.com",
    "nexx360.io",
    "sharethrough.com",
    "analytics.yahoo.com",
    "disqus.com",
    "disquscdn.com",
    "ssp.wp.pl",
    "addtoany.com",
    "static.addtoany.com",
    "src_domain",
    ...BLOCKED_AD_REDIRECT_SUFFIXES,
];

// Minimal noise block – only known annoying domains
const NOISE_BLOCK_SUFFIXES = [
    "smupsjaref.aoo",
    ".aoo",
];

const SILENT_AD_SUFFIXES = [
    "subduepaler.cyou",
];

function hostMatchesSuffix(host, suffix) {
    const h = String(host || "").toLowerCase();
    const s = String(suffix || "").toLowerCase();
    return h === s || h.endsWith("." + s);
}

function isBlockedAdRedirectHost(host) {
    const h = String(host || "").toLowerCase();
    if (!h) return false;
    return BLOCKED_AD_REDIRECT_SUFFIXES.some((s) => hostMatchesSuffix(h, s));
}

function isDocumentNavigationRequest(req) {
    try {
        return req?.mode === "navigate" || req?.destination === "document";
    } catch {
        return false;
    }
}

function extractArgonContextFromProxyUrl(url, argonPrefix = "/ag/") {
    try {
        const u = (url instanceof URL) ? url : new URL(String(url));
        if (u.origin !== self.location.origin) return null;
        if (!u.pathname.startsWith(argonPrefix)) return null;
        const rest = u.pathname.slice(argonPrefix.length);
        const match = /^(https?)\/([^/]+)(\/.*)?$/i.exec(rest);
        if (!match) return null;
        const protocol = match[1].toLowerCase();
        const host = match[2];
        const resourcePath = match[3] || "/";
        return {
            protocol,
            host,
            resourcePath,
            origin: `${protocol}://${host}`,
        };
    } catch {}
    return null;
}

function rememberClientUpstream(event, origin) {
    if (!origin) return;
    for (const id of [event.clientId, event.resultingClientId]) {
        if (id) clientUpstreamMap.set(id, origin);
    }
}

async function getArgonClientContext(event, argonPrefix = "/ag/") {
    try {
        const ref = event.request.headers.get("referer") || event.request.referrer;
        const fromReferrer = ref ? extractArgonContextFromProxyUrl(ref, argonPrefix) : null;
        if (fromReferrer) return fromReferrer;
    } catch {}

    for (const id of [event.clientId, event.resultingClientId]) {
        if (!id) continue;
        try {
            const client = await self.clients.get(id);
            const fromClient = client?.url ? extractArgonContextFromProxyUrl(client.url, argonPrefix) : null;
            if (fromClient) return fromClient;
        } catch {}
        const origin = clientUpstreamMap.get(id);
        if (origin) {
            try {
                const parsed = new URL(origin);
                return {
                    protocol: parsed.protocol.slice(0, -1),
                    host: parsed.host,
                    resourcePath: "/",
                    origin: parsed.origin,
                };
            } catch {}
        }
    }

    // Some third-party bootstraps intentionally omit Referer and can fire
    // before Chromium exposes the new iframe client ID. If every controlled
    // Argon page points at the same upstream, that is still an unambiguous
    // context for a root-relative asset such as /cdn-cgi/... or /_next/....
    try {
        const clients = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
        const contexts = clients
            .map((client) => extractArgonContextFromProxyUrl(client.url, argonPrefix))
            .filter(Boolean);
        const unique = new Map(contexts.map((context) => [context.origin, context]));
        if (unique.size === 1) return unique.values().next().value;
    } catch {}
    return null;
}

function tryDecodeUpstreamUrlFromProxiedUrl(url, uvPrefix, argonPrefix = "/ag/") {
    try {
        const u = (url instanceof URL) ? url : new URL(String(url));
        if (u.origin !== self.location.origin) return null;
        if (u.pathname.startsWith(uvPrefix)) {
            const encoded = u.pathname.slice(uvPrefix.length);
            const normalized = normalizeUvPayloadSegment(encoded);
            return decodeUvPayload(normalized);
        }
        const argonContext = extractArgonContextFromProxyUrl(u, argonPrefix);
        if (argonContext) {
            return argonContext.origin + argonContext.resourcePath + u.search;
        }
        for (const prefix of ["/scram/service/", "/service/scramjet/", "/scramjet/"]) {
            if (u.pathname.startsWith(prefix)) {
                const encoded = u.pathname.slice(prefix.length);
                if (!encoded) return null;
                return new URL(decodeURIComponent(encoded)).href;
            }
        }
    } catch {}
    return null;
}

function blockedNavigationResponse(upstreamUrl) {
    const safe = String(upstreamUrl || "").slice(0, 2048);
    const body =
        "<!doctype html><meta charset=\"utf-8\" />" +
        "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />" +
        "<title>Redirect blocked</title>" +
        "<style>body{font:14px/1.4 system-ui,Segoe UI,Arial;margin:24px}code{background:#f3f3f3;padding:2px 4px;border-radius:4px}</style>" +
        "<h1>Blocked an ad redirect</h1>" +
        "<p>This navigation looks like an ad popunder/redirect from Flixer.</p>" +
        "<p><code>" + safe.replace(/</g, "&lt;") + "</code></p>" +
        "<p><button onclick=\"history.back()\">Go back</button></p>";
    return new Response(body, { status: 200, headers: { "content-type": "text/html; charset=utf-8" } });
}

function emptyJsResponse() {
    return new Response("/* blocked */\n", {
        status: 200,
        headers: { "content-type": "application/javascript; charset=utf-8" },
    });
}

// AD stub: neutralises common ad-network globals so the page's own scripts
// (which may reference Banner, googletag, etc.) don't crash with ReferenceErrors
// when the underlying ad resources are blocked.
function adStubResponse() {
    return new Response(`
window.Banner = window.Banner || function(){}; window.Banner.prototype = window.Banner.prototype || { init:function(){}, show:function(){}, hide:function(){}, destroy:function(){} };
window.runBanner = window.runBanner || function(){};
window.loadBanner = window.loadBanner || function(){};
window.openBanner = window.openBanner || function(){};
window.BANNER = window.BANNER || {};
window.AdBanner = window.AdBanner || function(){};
window.AdBanner.prototype = window.AdBanner.prototype || { init:function(){}, show:function(){}, hide:function(){}, destroy:function(){} };
try { if(typeof window.googletag==='undefined') window.googletag={cmd:[]}; } catch(_){}
try { if(typeof window.adsbygoogle==='undefined') Object.defineProperty(window,'adsbygoogle',{get:function(){return function(){};},set:function(){}}); } catch(_){}
console.debug('[nebulo-sw] ad stub loaded');
`, {
        status: 200,
        headers: { "content-type": "application/javascript; charset=utf-8" },
    });
}

// Google Publisher Tag sometimes requests an optional, versioned dictionary
// which is not exposed by its CDN. A 404 makes GPT retry it repeatedly on any
// site that includes the SDK. A small cacheable script is the response GPT
// expects and leaves the site's own scripts untouched.
function isGooglePublisherDictionaryRequest(url) {
    try {
        const target = url instanceof URL ? url : new URL(String(url));
        return target.hostname.toLowerCase() === "securepubads.g.doubleclick.net"
            && /^\/pagead\/managed\/dict\/[^/]+\/gpt$/i.test(target.pathname);
    } catch {
        return false;
    }
}

function optionalPublisherDictionaryResponse() {
    return new Response("/* optional Google Publisher Tag dictionary unavailable */\n", {
        status: 200,
        headers: {
            "content-type": "application/javascript; charset=utf-8",
            "cache-control": "public, max-age=600",
        },
    });
}

function optionalAdSdkKind(url) {
    try {
        const target = url instanceof URL ? url : new URL(String(url));
        const host = target.hostname.toLowerCase();
        if ((host === "id5-sync.com" || host.endsWith(".id5-sync.com"))
            && /^\/api\/config\/prebid\/?$/i.test(target.pathname)) {
            return "id5";
        }
        if ((host === "bh.contextweb.com" || host.endsWith(".bh.contextweb.com"))
            && /^\/bh\/rtset\/?$/i.test(target.pathname)) {
            return "contextweb";
        }
    } catch {}
    return "";
}

function optionalAdSdkResponse(request, sdkKind) {
    const destination = String(request?.destination || "");
    if (sdkKind === "id5" && ["script", "worker", "sharedworker", "serviceworker"].includes(destination)) {
        return new Response("(function(){if(window.ID5)return;var a={init:function(){return a},onAvailable:function(b){if(typeof b==='function'){try{b(a)}catch(c){}}return a},getUserId:function(){return null},getUserIdAsEids:function(){return []},setUserId:function(){return a},refreshId:function(){return a},isFromCache:function(){return false}};window.ID5=a})();\n", {
            status: 200,
            headers: { "content-type": "application/javascript; charset=utf-8", "cache-control": "public, max-age=600" },
        });
    }
    return safeBlockedFetchResponse(request);
}

function emptyCssResponse() {
    return new Response("/* blocked */\n", {
        status: 200,
        headers: { "content-type": "text/css; charset=utf-8" },
    });
}

function safeBlockedFetchResponse(req) {
    const dest = String(req?.destination || "");
    if (dest === "style") return emptyCssResponse();
    if (
        dest === "image" ||
        dest === "font" ||
        dest === "audio" ||
        dest === "video" ||
        dest === "track"
    ) {
        return new Response(null, { status: 204, statusText: "No Content" });
    }

    // Fetch/XHR requests do not have a destination. Third-party SDKs often
    // unconditionally call response.json(), so an empty 204 becomes a fatal
    // SyntaxError that can take down an otherwise healthy SPA.
    return new Response("{}", {
        status: 200,
        headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
    });
}

function blockedThirdPartyResourceResponse(req, upstreamUrl) {
    if (isDocumentNavigationRequest(req)) {
        return blockedNavigationResponse(upstreamUrl);
    }
    const dest = String(req?.destination || "");
    if (
        dest === "script" ||
        dest === "worker" ||
        dest === "sharedworker" ||
        dest === "serviceworker" ||
        dest === "style" ||
        !dest
    ) {
        // Ad SDKs regularly publish globals and configuration used by a
        // site's main bundle. Blocking those code/API requests can make an
        // unrelated page render briefly then crash, so keep them intact.
        return null;
    }
    return safeBlockedFetchResponse(req);
}

function isBlockedFlixerResource(targetHost) {
    const h = String(targetHost || "").toLowerCase();
    if (!h) return false;
    return FLIXER_BLOCKED_RESOURCE_SUFFIXES.some((s) => hostMatchesSuffix(h, s));
}

function isBlockedThirdPartyResourceHost(host) {
    const h = String(host || "").toLowerCase();
    if (!h) return false;
    return BLOCKED_THIRD_PARTY_RESOURCE_SUFFIXES.some((s) => hostMatchesSuffix(h, s));
}

function isSilentAdHost(host) {
    const h = String(host || "").toLowerCase();
    if (!h) return false;
    return SILENT_AD_SUFFIXES.some((s) => hostMatchesSuffix(h, s));
}

function isVideoStreamingSite(hostname) {
    const h = String(hostname || "").toLowerCase();
    return h === "sflix2.me" || h.endsWith(".sflix2.me")
        || h === "sflix6.me" || h.endsWith(".sflix6.me")
        || h === "flixr.me" || h.endsWith(".flixr.me")
        || h === "vidfast.vc" || h.endsWith(".vidfast.vc")
        || h === "sflixhd.to" || h.endsWith(".sflixhd.to")
        || h === "sflixhd.io" || h.endsWith(".sflixhd.io")
        || h === "123moviesfree.com" || h.endsWith(".123moviesfree.com");
}

function blockAdRequestIfNeeded(request, upstreamUrl, requestingPageUrl) {
    if (!adBlockEnabled || !upstreamUrl) return null;
    try {
        const upstream = new URL(upstreamUrl);
        if (isSilentAdHost(upstream.hostname)) {
            const dest = String(request?.destination || "");
            if (!dest || ["script", "worker", "sharedworker", "serviceworker", "style"].includes(dest)) return null;
            return safeBlockedFetchResponse(request);
        }
        const dest = String(request?.destination || "");
        const isStreamingSite = isVideoStreamingSite(
            requestingPageUrl ? (new URL(requestingPageUrl).hostname) : null
        );
        const isAdNetworkHost = isBlockedThirdPartyResourceHost(upstream.hostname) || isBlockedAdRedirectHost(upstream.hostname);
        if (isAdNetworkHost) {
            if (hostMatchesSuffix(upstream.hostname, "src_domain") && (dest === "script" || !dest) && isStreamingSite) {
                return adStubResponse();
            }
            const response = blockedThirdPartyResourceResponse(request, upstream.href);
            if (response) return response;
        }
    } catch {}
    return null;
}

function isNoiseBlockedHost(host) {
    const h = String(host || "").toLowerCase();
    if (!h) return false;
    return NOISE_BLOCK_SUFFIXES.some((s) => {
        if (!s) return false;
        if (s.startsWith(".")) return h.endsWith(s);
        return hostMatchesSuffix(h, s);
    });
}

async function resetProxyDatabases() {
    if (!('indexedDB' in self)) return;
    const names = new Set(['bare-mux', 'baremux', 'bare-mux-db', 'baremux-db']);
    if (typeof indexedDB.databases === 'function') {
        try {
            const dbs = await indexedDB.databases();
            dbs.forEach((db) => {
                const n = db?.name || '';
                const lower = n.toLowerCase();
                if (
                    lower.includes('bare') ||
                    lower.includes('mux') ||
                    lower.includes('eclipse') ||
                    lower.includes('scram') ||
                    lower.includes('uv') ||
                    lower.includes('ultra') ||
                    lower.includes('idbmap')
                ) {
                    names.add(n);
                }
            });
        } catch {}
    }
    await Promise.allSettled(
        Array.from(names).map((name) => new Promise((resolve) => {
            if (!name) return resolve();
            try {
                const req = indexedDB.deleteDatabase(name);
                req.onsuccess = () => resolve();
                req.onerror = () => resolve();
                req.onblocked = () => resolve();
            } catch {
                resolve();
            }
        }))
    );
}

async function recoverProxyRuntimeState() {
    await resetProxyDatabases();
    uv = null;
    eclipse = null;
    scramjet = null;
    scramjetConfigLoaded = false;
    // Do NOT set scramjetRuntimeBroken = true – allow retry on next request
    scramjetBootstrapPromise = null;
}

async function bootstrapScramjetAtStartup() {
    if (scramjetBootstrapPromise) return scramjetBootstrapPromise;
    scramjetBootstrapPromise = (async () => {
        try {
            const clients = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
            if (!clients || clients.length === 0) return;
        } catch {
            return;
        }

        const s = getScramjet();
        if (!s) return;

        // Retry loadConfig up to 3 times
        for (let i = 0; i < 3; i++) {
            try {
                await s.loadConfig();
                scramjetConfigLoaded = true;
                return;
            } catch (err) {
                if (i === 2 || !isProxyPortError(err)) {
                    console.warn("Scramjet loadConfig failed permanently", err);
                    scramjetRuntimeBroken = true;
                    return;
                }
                console.warn(`Scramjet loadConfig retry ${i+1}/3`);
                await new Promise(r => setTimeout(r, 500 * (i+1)));
                await recoverProxyRuntimeState();
            }
        }
    })().catch(() => {
        scramjetRuntimeBroken = true;
    });
    return scramjetBootstrapPromise;
}

// Retry helper for proxy port errors
async function fetchWithRetry(fetchFn, maxRetries = 3, delay = 500) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fetchFn();
        } catch (err) {
            if (i === maxRetries - 1 || !isProxyPortError(err)) throw err;
            console.warn(`Retry ${i+1}/${maxRetries} after proxy port error`);
            await new Promise(r => setTimeout(r, delay * (i+1)));
            await recoverProxyRuntimeState();
        }
    }
}

// Local chat GET endpoints are safe to retry. This absorbs brief server/tunnel
// reconnects instead of turning every polling request into an immediate 502.
async function fetchLocalApiWithRetry(request, maxAttempts = 4) {
    const canRetry = String(request.method || 'GET').toUpperCase() === 'GET';
    const attempts = canRetry ? maxAttempts : 1;
    let lastError = null;
    let lastResponse = null;
    for (let attempt = 0; attempt < attempts; attempt += 1) {
        try {
            const response = await fetch(request.clone());
            if (![502, 503, 504].includes(response.status) || attempt === attempts - 1) return response;
            lastResponse = response;
        } catch (error) {
            lastError = error;
            if (attempt === attempts - 1) throw error;
        }
        await new Promise((resolve) => setTimeout(resolve, 350 * (2 ** attempt)));
    }
    if (lastResponse) return lastResponse;
    throw lastError || new Error('Local API request failed');
}

let playgroundData;

function addIsolationHeadersIfPossible(resp) {
    try {
        if (!resp || resp.type === "opaque") return resp;

        // Do not reconstruct ranged media responses.  A Response created from
        // another response's body is valid Fetch API usage, but Chromium's
        // media pipeline can treat that synthetic 206 stream as interrupted
        // after its first buffered frame.  This is particularly visible on
        // Audiomack: playback starts, then its player calls pause() when the
        // stream is aborted.  The isolation headers belong on documents and
        // app assets, not on audio/video byte streams.
        const contentType = String(resp.headers.get("content-type") || "").toLowerCase();
        if (
            resp.status === 206
            || resp.headers.has("content-range")
            || resp.headers.has("accept-ranges")
            || /^(?:audio|video)\//.test(contentType)
        ) {
            return resp;
        }
        const headers = new Headers(resp.headers);
        headers.set("Cross-Origin-Opener-Policy", "same-origin");
        headers.set("Cross-Origin-Embedder-Policy", "credentialless");
        const out = new Response(resp.body, {
            status: resp.status,
            statusText: resp.statusText,
            headers,
        });
        try {
            if ("rawHeaders" in resp) out.rawHeaders = resp.rawHeaders;
            if ("rawResponse" in resp) out.rawResponse = resp.rawResponse;
            if ("finalURL" in resp) out.finalURL = resp.finalURL;
        } catch {}
        return out;
    } catch {
        return resp;
    }
}

self.addEventListener("message", ({ data }) => {
    if (data.type === "playgroundData") {
        playgroundData = data;
        return;
    }
});

// ========== HELPER FUNCTIONS ==========

function cloneRequestForProxy(request) {
    return new Request(request.url, {
        method: request.method,
        headers: request.headers,
        body: request.body,
        mode: request.mode,
        credentials: request.credentials,
        cache: request.cache,
        redirect: request.redirect,
        referrer: request.referrer,
        referrerPolicy: request.referrerPolicy,
        integrity: request.integrity,
        keepalive: false,
        signal: request.signal,
    });
}

async function cloneRequestToUrl(request, nextUrl) {
    const method = String(request.method || "GET").toUpperCase();
    const init = {
        method,
        headers: new Headers(request.headers),
        credentials: request.credentials,
        redirect: request.redirect,
        referrerPolicy: request.referrerPolicy,
        keepalive: false,
    };

    if (request.destination) {
        init.headers.set('x-nebulo-fetch-destination', request.destination);
    }

    if (request.mode && request.mode !== "navigate") {
        init.mode = request.mode;
    }
    if (request.cache !== "only-if-cached" || init.mode === "same-origin") {
        init.cache = request.cache;
    }
    if (method !== "GET" && method !== "HEAD") {
        init.body = await request.clone().arrayBuffer();
    }

    return new Request(nextUrl, init);
}

function createModifiedFetchEvent(originalEvent, newRequest) {
    return {
        request: newRequest,
        clientId: originalEvent.clientId,
    };
}

function gracefulNetworkFailure(event, err) {
    try {
        console.warn("SW network error:", err?.message);
        return new Response(
            "Upstream network failure.",
            {
                status: 502,
                headers: { "content-type": "text/plain" }
            }
        );
    } catch {
        return fetch(event.request);
    }
}

// ========== ORIGINAL REQUEST HANDLER (with retry integration) ==========

async function handleRequest(event) {
    const request = event.request;
    const requestUrl = new URL(request.url);
    const sameOrigin = requestUrl.origin === self.location.origin;
    const path = requestUrl.pathname;
    const normalizedPath = normalizePathForLegacyRouting(path);
    const extractedLegacyPayload = extractLegacyHvtrsPayload(normalizedPath);

    // Nebulo routes must never inherit the upstream context of a proxied tab.
    if (sameOrigin && isNebuloLocalNavigationPath(path)) {
        // The shell and setup routes are local pages, not upstream proxy
        // targets. A short retry covers a service-worker activation, local
        // restart, or tunnel handoff without showing the generic 502 proxy
        // response for routes such as /@?tour=1.
        return fetchLocalApiWithRetry(request, 3);
    }

    // Argon runtime paths are passed through below, so ad filtering has to run
    // before that branch. Also catch direct external requests before converting
    // them into an /ag/ request.
    if (adBlockEnabled) {
        let upstreamForAdCheck = null;
        let requestingPageForAdCheck = null;
        if (sameOrigin && path.startsWith('/ag/')) {
            const context = extractArgonContextFromProxyUrl(requestUrl);
            if (context) {
                upstreamForAdCheck = context.origin + context.resourcePath + requestUrl.search;
                requestingPageForAdCheck = context.origin + context.resourcePath;
            }
        } else if (!sameOrigin && /^https?:$/.test(requestUrl.protocol)) {
            upstreamForAdCheck = requestUrl.href;
            const referer = request.headers.get("referer") || request.referrer;
            if (referer) {
                try {
                    const refUrl = new URL(referer, self.location.href);
                    if (isVideoStreamingSite(refUrl.hostname)) {
                        requestingPageForAdCheck = refUrl.href;
                    }
                } catch {}
            }
        }
        const blockedAdResponse = blockAdRequestIfNeeded(request, upstreamForAdCheck, requestingPageForAdCheck);
        if (blockedAdResponse) return blockedAdResponse;
    }

    // Keep a missing optional GPT dictionary from becoming a cross-site retry
    // loop. This is intentionally narrower than ad-script blocking: GPT itself
    // remains available to pages which require it during startup.
    if (sameOrigin && path.startsWith('/ag/')) {
        const context = extractArgonContextFromProxyUrl(requestUrl);
        if (context && isGooglePublisherDictionaryRequest(context.origin + context.resourcePath + requestUrl.search)) {
            return optionalPublisherDictionaryResponse();
        }
    } else if (!sameOrigin && isGooglePublisherDictionaryRequest(requestUrl)) {
        return optionalPublisherDictionaryResponse();
    }

    if (sameOrigin && path.startsWith('/ag/')) {
        const context = extractArgonContextFromProxyUrl(requestUrl);
        const optionalSdk = context ? optionalAdSdkKind(context.origin + context.resourcePath + requestUrl.search) : "";
        if (optionalSdk) return optionalAdSdkResponse(request, optionalSdk);
    } else if (!sameOrigin) {
        const optionalSdk = optionalAdSdkKind(requestUrl);
        if (optionalSdk) return optionalAdSdkResponse(request, optionalSdk);
    }

    const isYouTubeTelemetry = path.startsWith('/api/stats/') && (
        sameOrigin || /(^|\.)youtube\.com$/i.test(requestUrl.hostname)
    );
    if (isYouTubeTelemetry) {
        return new Response(null, { status: 204, statusText: 'No Content' });
    }

    // Block Cloudflare challenge-platform endpoints. These fail (404) when
    // proxied because the challenge is site-relative and Nebulo's origin
    // cannot satisfy it. Returning 204 prevents the challenge JS from
    // entering a retry loop or breaking the proxied page.
    const isCloudflareChallenge = path.startsWith('/cdn-cgi/challenge-platform/')
        || (sameOrigin && path.startsWith('/ag/') && (() => {
            const ctx = extractArgonContextFromProxyUrl(requestUrl);
            return ctx && (ctx.resourcePath || '').startsWith('/cdn-cgi/challenge-platform/');
        })());
    if (isCloudflareChallenge) {
        return new Response(null, { status: 204, statusText: 'No Content' });
    }

    // Block known ad script paths on streaming sites (e.g. sflix2.me banner.js
    // and the src_domain/sb/ ad network). These run inside the proxied page and
    // create overlay/redirect elements that cover the video player.
    if (sameOrigin && path.startsWith('/ag/')) {
        const ctx = extractArgonContextFromProxyUrl(requestUrl);
        if (ctx) {
            const upstreamPath = ctx.resourcePath || '/';
            const upstreamHost = ctx.host || '';
            const isAdScriptPath = upstreamPath.includes('/script/banner.js')
                || upstreamPath.includes('/sb/ssp/')
                || upstreamPath.includes('/addon/addon/extension/')
                || upstreamPath.includes('interstitial');
            const isAdNetworkHost = hostMatchesSuffix(upstreamHost, 'src_domain');
            if (isAdScriptPath || isAdNetworkHost) {
                const dest = String(request?.destination || '');
                if (dest === 'style') return emptyCssResponse();
                if (dest === 'script' || !dest) return adStubResponse();
                return safeBlockedFetchResponse(request);
            }
        }
    }

    if (sameOrigin && path.startsWith('/ag/')) {
        const context = extractArgonContextFromProxyUrl(requestUrl);
        if (context?.origin) rememberClientUpstream(event, context.origin);
    } else if (!sameOrigin) {
        if (requestUrl.hostname === 'improving.duckduckgo.com') {
            return new Response(null, { status: 204, statusText: 'No Content' });
        }
        const ownerContext = await getArgonClientContext(event);
        if (ownerContext && (requestUrl.protocol === 'http:' || requestUrl.protocol === 'https:')) {
            const rewritten = `${self.location.origin}/ag/${requestUrl.protocol.slice(0, -1)}/${requestUrl.host}`
                + `${requestUrl.pathname || '/'}${requestUrl.search}`;
            return fetch(await cloneRequestToUrl(request, rewritten));
        }
    }

    if (sameOrigin && NEBULO_LOCAL_GAME_PREFIXES.some((prefix) => path.startsWith(prefix))) {
        return fetch(request);
    }

    if (sameOrigin && (path === '/kchat' || path.startsWith('/kchat/') || path === '/youtube-player' || path === '/youtube-shorts')) {
        return fetch(request);
    }

    if (sameOrigin && path.startsWith('/api/')) {
        return fetchLocalApiWithRetry(request);
    }

    if (request.mode === 'navigate' && sameOrigin && isNebuloLocalNavigationPath(path)) {
        return fetch(request);
    }

    // Intercept top-level navigations (type=navigate)
    if (request.mode === 'navigate' && sameOrigin) {
        try {
            const clientId = event.clientId;
            if (clientId) {
                const clients = await self.clients.matchAll({ includeUncontrolled: true });
                const requestingClient = clients.find(c => c.id === clientId);
                const clientUrl = requestingClient?.url || '';
                
                // If the client was viewing an /ag/ proxied page
                if (clientUrl.includes('/ag/')) {
                    const argonPrefix = '/ag/';
                    
                    // If this is NOT an /ag/ path, rewrite it back under /ag/
                    if (!path.startsWith(argonPrefix) && path !== '/' && path !== '' && 
                        !path.startsWith('/assets') && !path.startsWith('/public')) {
                        const newUrl = argonPrefix + 'https' + path + requestUrl.search + requestUrl.hash;
                        return Response.redirect(newUrl, 307);
                    }
                }
            }
        } catch (e) {
            console.warn('Navigation interception error:', e);
        }
    }

    const isScramjetWasm = sameOrigin && (
        path === "/scram/scramjet.wasm.wasm" || 
        path === "/scramjet.wasm.wasm" ||
        path === "/scram/mathjet.wasm.wasm" ||
        path === "/mathjet.wasm.wasm"
    );
    if (
        sameOrigin && (
            requestUrl.pathname.startsWith('/baremux/') ||
            (path.startsWith('/uv/') && !path.startsWith('/uv/service/')) ||
            (path.startsWith('/ec/') && !path.startsWith('/ec/service/')) ||
            requestUrl.pathname.startsWith('/ag/') ||
            requestUrl.pathname.startsWith('/eclipse/eclipse.') ||
            ((path.startsWith('/scram/') && !path.startsWith('/scram/service/')) && !isScramjetWasm) ||
            requestUrl.pathname.startsWith('/epoxy/') ||
            requestUrl.pathname.startsWith('/images/') ||
            requestUrl.pathname.startsWith('/unified/') ||
            NEBULO_LOCAL_ASSET_PREFIXES.some((prefix) => requestUrl.pathname.startsWith(prefix)) ||
            requestUrl.pathname.startsWith('/vendor/') ||
            requestUrl.pathname === '/sw.js' ||
            requestUrl.pathname === '/argon_service_worker.js' ||
            requestUrl.pathname === '/argon-response-injected.js' ||
            requestUrl.pathname === '/argon-tiktok-feed-cache.json' ||
            requestUrl.pathname.startsWith('/argon-runtime/') ||
            requestUrl.pathname === '/service-worker.js'
        )
    ) {
        return fetch(request);
    }

    const uvPrefix = (typeof __uv$config !== "undefined" && __uv$config?.prefix) ? __uv$config.prefix : "/uv/service/";
    const argonPrefix = "/ag/";
    const eclipsePrefix = (typeof __eclipse$config !== "undefined" && __eclipse$config?.prefix) ? __eclipse$config.prefix : "/ec/service/";
    const scramPrefixCandidates = ['/scram/service/', '/service/scramjet/', '/scramjet/'];
    // Track the active proxied upstream per tab/client so relative URLs without
    // referer can still be resolved under the correct proxied origin.
    try {
        if (sameOrigin && requestUrl.pathname.startsWith(uvPrefix)) {
            const encoded = normalizeUvPayloadSegment(requestUrl.pathname.slice(uvPrefix.length));
            if (encoded) {
                const upstream = decodeUvPayload(encoded);
                const upstreamOrigin = new URL(upstream).origin;
                if (upstreamOrigin) rememberClientUpstream(event, upstreamOrigin);
            }
        } else if (sameOrigin && requestUrl.pathname.startsWith(argonPrefix)) {
            const context = extractArgonContextFromProxyUrl(requestUrl, argonPrefix);
            if (context?.origin) rememberClientUpstream(event, context.origin);
        }
    } catch {}

    // Block known ad / consent endpoints before they hit the proxy transport.
    try {
        if (sameOrigin) {
            const upstream = tryDecodeUpstreamUrlFromProxiedUrl(requestUrl, uvPrefix, argonPrefix);
            if (upstream) {
                const u = new URL(upstream);
                const ref = request.headers.get("referer") || request.referrer;
                const refUpstream = ref ? tryDecodeUpstreamUrlFromProxiedUrl(ref, uvPrefix, argonPrefix) : null;
                const refHost = refUpstream ? (new URL(refUpstream).hostname) : null;
                const blockedAdResponse = blockAdRequestIfNeeded(request, upstream, refHost ? refUpstream : null);
                if (blockedAdResponse) return blockedAdResponse;
            }
        }
    } catch {}

    // Noise-block
    try {
        if (sameOrigin) {
            const upstream = tryDecodeUpstreamUrlFromProxiedUrl(requestUrl, uvPrefix, argonPrefix);
            if (upstream) {
                const u = new URL(upstream);
                if (isNoiseBlockedHost(u.hostname)) {
                    const dest = String(event.request.destination || "");
                    if (dest === "script" || dest === "module") return emptyJsResponse();
                    return safeBlockedFetchResponse(event.request);
                }
            }
        }
    } catch {}

    // Flixer ad redirect blocking (unchanged)
    try {
        if (sameOrigin && isDocumentNavigationRequest(request)) {
            const upstream = tryDecodeUpstreamUrlFromProxiedUrl(requestUrl, uvPrefix, argonPrefix);
            if (upstream) {
                let ref = request.headers.get("referer") || request.referrer;
                const upstreamRef = ref ? tryDecodeUpstreamUrlFromProxiedUrl(ref, uvPrefix, argonPrefix) : null;
                const refHost = upstreamRef ? (new URL(upstreamRef)).hostname : "";
                const targetHost = (new URL(upstream)).hostname;
                if (FLIXER_REF_HOST_RE.test(refHost) && isBlockedAdRedirectHost(targetHost)) {
                    return blockedNavigationResponse(upstream);
                }
            }
        }
    } catch {}

    // Flixer resource blocking
    try {
        if (sameOrigin) {
            const upstream = tryDecodeUpstreamUrlFromProxiedUrl(requestUrl, uvPrefix, argonPrefix);
            if (upstream) {
                let ref = request.headers.get("referer") || request.referrer;
                const upstreamRef = ref ? tryDecodeUpstreamUrlFromProxiedUrl(ref, uvPrefix, argonPrefix) : null;
                const refHost = upstreamRef ? (new URL(upstreamRef)).hostname : "";
                if (FLIXER_REF_HOST_RE.test(refHost)) {
                    const u = new URL(upstream);
                    const dest = String(request.destination || "");
                    if (dest === "script" && isBlockedFlixerResource(u.hostname)) {
                        return emptyJsResponse();
                    }
                }
            }
        }
    } catch {}

    // Root-relative asset rewriting
    if (sameOrigin && shouldRewriteRootRelativeAsset(path)) {
        const rewrittenViaArgon = await rewriteRootRelativeAssetViaArgon(event, requestUrl, path, argonPrefix);
        if (rewrittenViaArgon) return rewrittenViaArgon;
        const rewritten = await rewriteRootRelativeAssetViaUv(event, requestUrl, path, uvPrefix);
        if (rewritten) return rewritten;
    }

    // Ultraviolet (with retry)
    try {
        if (requestUrl.pathname.startsWith(uvPrefix)) {
            const encoded = requestUrl.pathname.slice(uvPrefix.length);
            if (
                encoded.startsWith("assets/") ||
                encoded === "themes.css" ||
                encoded === "themes.js"
            ) {
                return fetch("/" + encoded + requestUrl.search);
            }
            const normalized = normalizeUvPayloadSegment(encoded);
            if (normalized && normalized !== encoded) {
                const rewritten = uvPrefix + normalized + requestUrl.search;
                let uvResponse = await fetchWithRetry(() => getUv().fetch({
                    request: cloneRequestForProxy(new Request(rewritten, request))
                }));
                return uvResponse;
            }
            const uvWorker = getUv();
            if (uvWorker.route(event)) {
                let uvResponse = await fetchWithRetry(() => uvWorker.fetch(event));
                return uvResponse;
            }
        } else if (sameOrigin && (extractedLegacyPayload || /^\/+hvt(?:rs|tr)/i.test(normalizedPath))) {
            const encoded = extractedLegacyPayload || normalizedPath.replace(/^\/+/, "");
            const rewritten = uvPrefix + encoded + requestUrl.search;
            const modifiedEvent = createModifiedFetchEvent(event, new Request(rewritten, request));
            let uvResponse = await fetchWithRetry(() => getUv().fetch(modifiedEvent));
            return uvResponse;
        }
    } catch (err) {
        if (isProxyPortError(err)) {
            await recoverProxyRuntimeState();
        }
    }

    // Eclipse
    try {
        if (requestUrl.pathname.startsWith(eclipsePrefix)) {
            const eclipseWorker = getEclipse();
            if (eclipseWorker.route(event)) {
                return await eclipseWorker.fetch(event);
            }
        }
    } catch (err) {
        if (isProxyPortError(err)) {
            await recoverProxyRuntimeState();
        }
    }

    // Scramjet (with retry and fallback)
    try {
        const maybeScramRequest =
            isScramjetWasm || scramPrefixCandidates.some((prefix) => requestUrl.pathname.startsWith(prefix));
        if (maybeScramRequest) {
            await bootstrapScramjetAtStartup();
            const scram = getScramjet();
            if (!scram) {
                return fetch(request);
            }
            // Even if route() returns false, attempt fetch() – some implementations ignore the route check
            if (scram.route(event) || true) { // always try fetch
                return await fetchWithRetry(() => scram.fetch(event));
            }
        }
    } catch (err) {
        if (isProxyPortError(err)) {
            scramjetRuntimeBroken = true;
            await recoverProxyRuntimeState();
            // fallback to direct fetch (will 404, but better than crashing)
            return fetch(request);
        }
    }

    return fetch(request);
}

// ========== FETCH PIPELINE ==========

async function handleFetchEvent(event) {
    try {
        const response = await handleRequest(event);
        if (!response) {
            return fetch(event.request);
        }
        return addIsolationHeadersIfPossible(response);
    } catch (err) {
        return gracefulNetworkFailure(event, err);
    }
}

self.addEventListener("fetch", (event) => {
    event.respondWith(handleFetchEvent(event));
});

self.addEventListener("message", (event) => {
    if (event.data?.type !== "nebulo-adblock-setting") return;
    adBlockEnabled = event.data.enabled !== false;
});

self.addEventListener("install", (event) => {
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    event.waitUntil(self.clients.claim());
});

// ========== UTILITY FUNCTIONS (unchanged) ==========

function shouldRewriteRootRelativeAsset(path) {
    if (!path || path === "/" || path === "/sw.js") return false;
    if (path.startsWith("/api/") || path.startsWith("/filters/")) return false;
    if (path === "/themes.css" || path === "/themes.js") return false;
    if (path.startsWith("/uv/") || path.startsWith("/ec/") || path.startsWith("/eclipse/")) return false;
    if (path.startsWith("/ag/") || path.startsWith("/argon-runtime/") || path === "/argon_service_worker.js" || path === "/argon-response-injected.js" || path === "/argon-tiktok-feed-cache.json" || path === "/service-worker.js") return false;
    if (path.startsWith("/scram/") || path.startsWith("/scramjet/")) return false;
    if (path.startsWith("/images/") || path.startsWith("/unified/")) return false;
    if (path.startsWith("/baremux/") || path.startsWith("/epoxy/") || path.startsWith("/vendor/")) return false;
    if (NEBULO_LOCAL_GAME_PREFIXES.some((prefix) => path.startsWith(prefix))) return false;
    if (NEBULO_LOCAL_ASSET_PREFIXES.some((prefix) => path.startsWith(prefix))) return false;
    if (path === "/assets/youtube-player-handoff.html") return false;
    if (path === "/search" || path === "/rindex" || path === "/settings" || path === "/apps" || path === "/games") return false;
    if (path === "/help" || path === "/tools" || path === "/links" || path === "/report" || path === "/watch" || path === "/secret") return false;
    if (path === "/chatonly" || path === "/chat-only" || path === "/chemistry" || path === "/geometry") return false;
    if (path === "/blocked" || path === "/achievements" || path === "/whatsnew") return false;
    if (path.startsWith("/cdn-cgi/challenge-platform/")) return false;
    return true;
}

function isNebuloLocalNavigationPath(path) {
    return NEBULO_LOCAL_NAVIGATION_PATHS.has(path);
}

function normalizeUvPayloadSegment(segment) {
    let out = String(segment || "");
    if (!/^hvt(?:rs|tr)/i.test(out)) return out;
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

function normalizePathForLegacyRouting(pathname) {
    let out = String(pathname || "");
    try {
        const decoded = decodeURIComponent(out);
        if (decoded) out = decoded;
    } catch {}
    return out;
}

function extractLegacyHvtrsPayload(pathname) {
    const src = String(pathname || "");
    const m = src.match(/hvt(?:rs|tr)\d*(?:\/-|%2F-).*/i);
    if (!m || !m[0]) return "";
    return normalizeUvPayloadSegment(m[0]);
}

function decodeUvPayload(encoded) {
    if (typeof __uv$config === "undefined" || typeof __uv$config.decodeUrl !== "function") {
        throw new Error("Ultraviolet config decodeUrl is not available");
    }
    const raw = String(encoded || "");
    try {
        return __uv$config.decodeUrl(decodeURIComponent(raw));
    } catch {
        return __uv$config.decodeUrl(raw);
    }
}

async function rewriteRootRelativeAssetViaUv(event, requestUrl, path, uvPrefix) {
    try {
        let ref = event.request.headers.get("referer") || event.request.referrer;
        if (!ref) {
            try {
                const id = event.clientId;
                if (id) {
                    const client = await self.clients.get(id);
                    if (client?.url) ref = client.url;
                }
            } catch {}
        }
        let upstreamOrigin = "";

        if (ref) {
            const refUrl = new URL(ref);
            if (refUrl.origin === self.location.origin && refUrl.pathname.startsWith(uvPrefix)) {
                const refEncodedRaw = refUrl.pathname.slice(uvPrefix.length);
                const refEncoded = normalizeUvPayloadSegment(refEncodedRaw);
                const refUpstream = decodeUvPayload(refEncoded);
                upstreamOrigin = new URL(refUpstream).origin;
                if (event.clientId && upstreamOrigin) {
                    clientUpstreamMap.set(event.clientId, upstreamOrigin);
                }
            }
        }

        // Fallback for requests with no/stripped referer (common on strict sites).
        if (!upstreamOrigin && event.clientId && clientUpstreamMap.has(event.clientId)) {
            try {
                const client = await self.clients.get(event.clientId);
                const clientUrl = client?.url ? new URL(client.url) : null;
                if (clientUrl && clientUrl.origin === self.location.origin && clientUrl.pathname.startsWith(uvPrefix)) {
                    upstreamOrigin = clientUpstreamMap.get(event.clientId) || "";
                }
            } catch {}
        }
        if (!upstreamOrigin) return null;

        const upstreamAsset = upstreamOrigin + path + requestUrl.search;
        const rewritten = uvPrefix + __uv$config.encodeUrl(upstreamAsset);

        const modifiedEvent = createModifiedFetchEvent(event, new Request(rewritten, event.request));
        return await fetchWithRetry(() => getUv().fetch(modifiedEvent));
    } catch {
        return null;
    }
}

async function rewriteRootRelativeAssetViaArgon(event, requestUrl, path, argonPrefix) {
    try {
        let ref = event.request.headers.get("referer") || event.request.referrer;
        let context = ref ? extractArgonContextFromProxyUrl(ref, argonPrefix) : null;

        if (!context) {
            try {
                const id = event.clientId;
                if (id) {
                    const client = await self.clients.get(id);
                    if (client?.url) {
                        context = extractArgonContextFromProxyUrl(client.url, argonPrefix);
                    }
                }
            } catch {}
        }

        if (!context && event.clientId && clientUpstreamMap.has(event.clientId)) {
            try {
                const client = await self.clients.get(event.clientId);
                const clientUrl = client?.url ? new URL(client.url) : null;
                if (clientUrl && clientUrl.origin === self.location.origin && clientUrl.pathname.startsWith(argonPrefix)) {
                    const upstreamOrigin = clientUpstreamMap.get(event.clientId) || "";
                    if (upstreamOrigin) {
                        const u = new URL(upstreamOrigin);
                        context = {
                            protocol: u.protocol.replace(":", ""),
                            host: u.host,
                            resourcePath: "/",
                            origin: u.origin,
                        };
                    }
                }
            } catch {}
        }

        if (!context) {
            context = await getArgonClientContext(event, argonPrefix);
        }

        if (!context) return null;

        const rewritten = `${argonPrefix}${context.protocol}/${context.host}${path}${requestUrl.search}`;
        return await fetch(await cloneRequestToUrl(event.request, rewritten));
    } catch {
        return null;
    }
}
