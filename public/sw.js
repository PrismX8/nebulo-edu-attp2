const SW_VERSION = "2026-02-16-6"; // bump version

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
];
const FLIXER_BLOCKED_RESOURCE_SUFFIXES = [
    "bvtpk.com",
];

// Minimal noise block – only known annoying domains
const NOISE_BLOCK_SUFFIXES = [
    "smupsjaref.aoo",
    ".aoo",
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

function tryDecodeUpstreamUrlFromProxiedUrl(url, uvPrefix) {
    try {
        const u = (url instanceof URL) ? url : new URL(String(url));
        if (u.origin !== self.location.origin) return null;
        if (u.pathname.startsWith(uvPrefix)) {
            const encoded = u.pathname.slice(uvPrefix.length);
            const normalized = normalizeUvPayloadSegment(encoded);
            return decodeUvPayload(normalized);
        }
        if (u.pathname.startsWith("/scramjet/")) {
            const encoded = u.pathname.slice("/scramjet/".length);
            if (!encoded) return null;
            return new URL(decodeURIComponent(encoded)).href;
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

function isBlockedFlixerResource(targetHost) {
    const h = String(targetHost || "").toLowerCase();
    if (!h) return false;
    return FLIXER_BLOCKED_RESOURCE_SUFFIXES.some((s) => hostMatchesSuffix(h, s));
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

let playgroundData;

function addIsolationHeadersIfPossible(resp) {
    try {
        if (!resp || resp.type === "opaque") return resp;
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
        keepalive: request.keepalive,
        signal: request.signal,
    });
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

    const isScramjetWasm = sameOrigin && (path === "/scram/scramjet.wasm.wasm" || path === "/scramjet.wasm.wasm");
    if (
        sameOrigin && (
            requestUrl.pathname.startsWith('/baremux/') ||
            (path.startsWith('/uv/') && !path.startsWith('/uv/service/')) ||
            (path.startsWith('/ec/') && !path.startsWith('/ec/service/')) ||
            requestUrl.pathname.startsWith('/eclipse/eclipse.') ||
            ((path.startsWith('/scram/') && !path.startsWith('/scram/service/')) && !isScramjetWasm) ||
            requestUrl.pathname.startsWith('/epoxy/') ||
            requestUrl.pathname.startsWith('/assets/') ||
            requestUrl.pathname === '/sw.js'
        )
    ) {
        return fetch(request);
    }

    const uvPrefix = (typeof __uv$config !== "undefined" && __uv$config?.prefix) ? __uv$config.prefix : "/uv/service/";
    const eclipsePrefix = (typeof __eclipse$config !== "undefined" && __eclipse$config?.prefix) ? __eclipse$config.prefix : "/ec/service/";
    const scramPrefixCandidates = ['/scram/service/', '/service/scramjet/', '/scramjet/'];

    // Noise-block
    try {
        if (sameOrigin) {
            const upstream = tryDecodeUpstreamUrlFromProxiedUrl(requestUrl, uvPrefix);
            if (upstream) {
                const u = new URL(upstream);
                if (isNoiseBlockedHost(u.hostname)) {
                    const dest = String(event.request.destination || "");
                    if (dest === "script" || dest === "module") return emptyJsResponse();
                    return new Response(null, { status: 204, statusText: "No Content" });
                }
            }
        }
    } catch {}

    // Flixer ad redirect blocking (unchanged)
    try {
        if (sameOrigin && isDocumentNavigationRequest(request)) {
            const upstream = tryDecodeUpstreamUrlFromProxiedUrl(requestUrl, uvPrefix);
            if (upstream) {
                let ref = request.headers.get("referer") || request.referrer;
                const upstreamRef = ref ? tryDecodeUpstreamUrlFromProxiedUrl(ref, uvPrefix) : null;
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
            const upstream = tryDecodeUpstreamUrlFromProxiedUrl(requestUrl, uvPrefix);
            if (upstream) {
                let ref = request.headers.get("referer") || request.referrer;
                const upstreamRef = ref ? tryDecodeUpstreamUrlFromProxiedUrl(ref, uvPrefix) : null;
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
    if (event.request.method !== "GET" && event.request.method !== "HEAD") {
        return;
    }
    event.respondWith(handleFetchEvent(event));
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
    if (path.startsWith("/scram/") || path.startsWith("/scramjet/")) return false;
    if (path.startsWith("/baremux/") || path.startsWith("/epoxy/") || path.startsWith("/assets/")) return false;
    if (path === "/search" || path === "/rindex" || path === "/settings" || path === "/apps" || path === "/games") return false;
    if (path === "/help" || path === "/tools" || path === "/links" || path === "/report" || path === "/watch" || path === "/secret") return false;
    if (path === "/chatonly" || path === "/chat-only" || path === "/chemistry" || path === "/geometry") return false;
    if (path === "/blocked" || path === "/achievements" || path === "/whatsnew") return false;
    return true;
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
        if (!ref) return null;

        const refUrl = new URL(ref);
        if (refUrl.origin !== self.location.origin || !refUrl.pathname.startsWith(uvPrefix)) return null;

        const refEncodedRaw = refUrl.pathname.slice(uvPrefix.length);
        const refEncoded = normalizeUvPayloadSegment(refEncodedRaw);
        const refUpstream = decodeUvPayload(refEncoded);
        const upstreamOrigin = new URL(refUpstream).origin;
        const upstreamAsset = upstreamOrigin + path + requestUrl.search;
        const rewritten = uvPrefix + __uv$config.encodeUrl(upstreamAsset);

        const modifiedEvent = createModifiedFetchEvent(event, new Request(rewritten, event.request));
        return await fetchWithRetry(() => getUv().fetch(modifiedEvent));
    } catch {
        return null;
    }
}