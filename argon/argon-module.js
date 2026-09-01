'use strict';

const { Readable } = require('stream');
const { brotliDecompressSync, gunzipSync, inflateSync } = require('zlib');
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
const ARGON_RUNTIME_VERSION = '20260831-tiktok-runtime-cleanup-34';
const TIKTOK_FAST_FEED_SOURCE = fs
  .readFileSync(path.join(__dirname, '..', 'public', 'assets', 'js', 'tiktok-client.js'), 'utf8')
  .replace(/<\/script/gi, '<\\/script');
const ARGON_DEBUG = process.env.DEBUG_ARGON === 'true';
const ARGON_COOKIE_BUDGET_BYTES = 7000;
const ARGON_NOISY_AD_SUFFIXES = [
  'id5-sync.com',
  'rlcdn.com',
  'smartadserver.com',
  'rubiconproject.com',
  'casalemedia.com',
  'media.net',
  'sharethrough.com',
  'nexx360.io',
  'adsrvr.org',
  'pubmatic.com',
  'analytics.yahoo.com',
  'ssp.wp.pl',
];
const OPTIONAL_ID5_FALLBACK_SOURCE = "(function(){if(window.ID5)return;var a={init:function(){return a},onAvailable:function(b){if(typeof b==='function'){try{b(a)}catch(c){}}return a},getUserId:function(){return null},getUserIdAsEids:function(){return []},setUserId:function(){return a},refreshId:function(){return a},isFromCache:function(){return false}};try{Object.defineProperty(window,'ID5',{configurable:true,enumerable:true,writable:true,value:a})}catch(b){window.ID5=a}})();";
const TIKTOK_FEED_CACHE_TTL_MS = 15 * 60 * 1000;
let lastTikTokFeedPayload = null;
let lastTikTokFeedPayloadAt = 0;
let lastTikTokFeedRequestPath = null;
let lastTikTokFeedRequestAt = 0;
let tikTokFeedRotation = 0;
let lastTikTokAtomSourceUrl = null;
let lastTikTokAtomSourceUrlAt = 0;
const tikTokAtomSourceCache = new Map();

function randomizeTikTokFeedPayload(payload) {
  if (!payload || !Array.isArray(payload.itemList) || payload.itemList.length < 2) return payload;
  const itemList = payload.itemList.slice();
  // Rotate the leading item first. This makes consecutive FYP loads start on
  // a different video deterministically instead of relying on random chance.
  tikTokFeedRotation = (tikTokFeedRotation + 1) % itemList.length;
  if (tikTokFeedRotation) {
    itemList.push(...itemList.splice(0, tikTokFeedRotation));
  }
  // Keep the rest varied as well, while holding the newly selected opener in
  // place for this response.
  for (let index = itemList.length - 1; index > 0; index -= 1) {
    const swapIndex = 1 + Math.floor(Math.random() * index);
    [itemList[index], itemList[swapIndex]] = [itemList[swapIndex], itemList[index]];
  }
  return { ...payload, itemList };
}

function cacheTikTokFeedPayload(payload) {
  if (!payload || !Array.isArray(payload.itemList) || !payload.itemList.length) return false;
  const previousItems = lastTikTokFeedPayload
    && Date.now() - lastTikTokFeedPayloadAt <= TIKTOK_FEED_CACHE_TTL_MS
    && Array.isArray(lastTikTokFeedPayload.itemList)
    ? lastTikTokFeedPayload.itemList
    : [];
  const itemList = [];
  const seen = new Set();
  for (const item of [...previousItems, ...payload.itemList]) {
    const id = String(item?.id || item?.itemId || '');
    if (!id || seen.has(id)) continue;
    seen.add(id);
    itemList.push(item);
  }
  // Keep a useful rolling FYP without allowing a long-running server to retain
  // an unbounded amount of TikTok response data.
  lastTikTokFeedPayload = { ...payload, itemList: itemList.slice(-120) };
  lastTikTokFeedPayloadAt = Date.now();
  return true;
}

function isNoisyAdHost(host) {
  const normalized = String(host || '').toLowerCase();
  return ARGON_NOISY_AD_SUFFIXES.some((suffix) => (
    normalized === suffix || normalized.endsWith(`.${suffix}`)
  ));
}

function optionalAdSdkKind(proxyTarget) {
  const host = proxyTarget?.host?.toLowerCase() || '';
  const resourcePath = proxyTarget?.resourcePath || '';
  if ((host === 'id5-sync.com' || host.endsWith('.id5-sync.com')) && /^\/api\/config\/prebid\/?$/i.test(resourcePath)) {
    return 'id5';
  }
  if ((host === 'bh.contextweb.com' || host.endsWith('.bh.contextweb.com')) && /^\/bh\/rtset\/?$/i.test(resourcePath)) {
    return 'contextweb';
  }
  return '';
}

function sendOptionalAdSdkResponse(reply, fetchDestination, sdkKind) {
  reply
    .header('Access-Control-Allow-Origin', '*')
    .header('Cache-Control', 'public, max-age=600');
  if (sdkKind === 'id5' && ['script', 'worker', 'sharedworker', 'serviceworker'].includes(fetchDestination)) {
    return reply.status(200).header('Content-Type', 'application/javascript; charset=utf-8').send(OPTIONAL_ID5_FALLBACK_SOURCE);
  }
  if (fetchDestination === 'style') {
    return reply.status(200).header('Content-Type', 'text/css; charset=utf-8').send('/* optional ad provider omitted */');
  }
  if (['image', 'font', 'audio', 'video', 'track'].includes(fetchDestination)) {
    return reply.status(204).send();
  }
  return reply.status(200).header('Content-Type', 'application/json; charset=utf-8').send('{}');
}

function isGooglePublisherDictionaryTarget(proxyTarget) {
  return proxyTarget?.host?.toLowerCase() === 'securepubads.g.doubleclick.net'
    && /^\/pagead\/managed\/dict\/[^/]+\/gpt$/i.test(proxyTarget.resourcePath || '');
}

function sendOptionalPublisherDictionary(reply) {
  return reply
    .status(200)
    .header('Content-Type', 'application/javascript; charset=utf-8')
    .header('Cache-Control', 'public, max-age=600')
    .send('/* optional Google Publisher Tag dictionary unavailable */\n');
}

function isOptionalRichAdsLoader(proxyTarget) {
  const host = proxyTarget?.host?.toLowerCase() || '';
  const resourcePath = proxyTarget?.resourcePath || '';
  return (host === 'richinfo.co' || host.endsWith('.richinfo.co'))
    && /^\/richpartners\/in-page\/js\/richads-ob\.js$/i.test(resourcePath);
}

function createOptionalRichAdsFallback() {
  return new Response('/* RichAds provider temporarily unavailable */\n', {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-store',
      'Content-Type': 'application/javascript; charset=utf-8',
      'X-Nebulo-Upstream-Fallback': 'richads',
    },
  });
}

function sendSafeBlockedProxyResponse(reply, request, fetchDestination, acceptsHtml) {
  reply
    .header('Access-Control-Allow-Origin', '*')
    .header('Cache-Control', 'no-store');
  if (fetchDestination === 'script' || fetchDestination === 'worker' || fetchDestination === 'sharedworker' || fetchDestination === 'serviceworker') {
    return reply.status(200).header('Content-Type', 'application/javascript; charset=utf-8').send('/* ad request blocked */');
  }
  if (fetchDestination === 'style') {
    return reply.status(200).header('Content-Type', 'text/css; charset=utf-8').send('/* ad request blocked */');
  }
  if (fetchDestination === 'document' || fetchDestination === 'iframe' || acceptsHtml) {
    return reply.status(200).header('Content-Type', 'text/html; charset=utf-8').send('<!doctype html><meta charset="utf-8">');
  }
  if (['image', 'font', 'audio', 'video', 'track'].includes(fetchDestination)) {
    return reply.status(204).send();
  }
  // XHR/fetch calls have no destination. Return valid JSON so third-party
  // startup code that eagerly calls response.json() cannot crash the page.
  return reply.status(200).header('Content-Type', 'application/json; charset=utf-8').send('{}');
}

function shouldPassThroughThirdPartyRequest(fetchDestination) {
  return !fetchDestination || ['script', 'worker', 'sharedworker', 'serviceworker', 'style'].includes(fetchDestination);
}

function patchTikTokAtomSource(source) {
  // Keep TikTok's own feed/cache logic intact. Only route absolute lazy chunk
  // imports that bypass the normal DOM/fetch URL hooks.
  return source.replace(
    /(["'])https?:\/\/lf16-tiktok-web\.tiktokcdn-us\.com([^"']*)\1/gi,
    (_match, quote, resource) => `location.origin+${quote}/ag/https/lf16-tiktok-web.tiktokcdn-us.com${resource}${quote}`,
  );
}

async function getPatchedTikTokAtomSource(sourceUrl) {
  const cached = tikTokAtomSourceCache.get(sourceUrl);
  if (cached) return cached;

  const pending = fetch(sourceUrl, {
    headers: { 'user-agent': 'Mozilla/5.0' },
  }).then(async (response) => {
    if (!response.ok) throw new Error(`TikTok atom request failed: ${response.status}`);
    const patched = patchTikTokAtomSource(await response.text());
    return patched
      .replace(/\/\/# sourceMappingURL=.*?(?:\r?\n|$)/g, '')
      .replace(/<\/script/gi, '<\\/script');
  }).catch((error) => {
    tikTokAtomSourceCache.delete(sourceUrl);
    throw error;
  });
  tikTokAtomSourceCache.set(sourceUrl, pending);
  return pending;
}
const legacyWorkerRepairScript = `
;(() => {
  if (!('serviceWorker' in navigator)) return;
  const nativeRegister = navigator.serviceWorker.register.bind(navigator.serviceWorker);
  navigator.serviceWorker.register = function (scriptURL, options) {
    if (String(scriptURL || '').includes('/argon_service_worker.js')) {
      return Promise.resolve({
        active: null,
        waiting: null,
        installing: null,
        scope: location.origin + '/ag/',
        unregister: () => Promise.resolve(true)
      });
    }
    return nativeRegister(scriptURL, options);
  };
  navigator.serviceWorker.getRegistrations().then(async (registrations) => {
    let removedLegacyWorker = false;
    for (const registration of registrations) {
      const worker = registration.active || registration.waiting || registration.installing;
      if (worker?.scriptURL.includes('/argon_service_worker.js')) {
        removedLegacyWorker = (await registration.unregister()) || removedLegacyWorker;
      }
    }
    const repairKey = 'argon-root-worker-repaired-${ARGON_RUNTIME_VERSION}';
    if (removedLegacyWorker && !sessionStorage.getItem(repairKey)) {
      sessionStorage.setItem(repairKey, '1');
      location.reload();
    }
  }).catch(() => {});
})();
`;
const argonNetworkRoutingSource = String.raw`
;(() => {
  if (window.__nebuloArgonNetworkRoutingInstalled) return;

  const NativeURL = window.__nebuloNativeURL;
  const NativeRequest = window.__nebuloNativeRequest;
  const NativeHeaders = window.__nebuloNativeHeaders;
  const nativeFetch = window.__nebuloNativeFetch;
  const nativeWindowPostMessage = window.__nebuloNativeWindowPostMessage;
  const nativeDocumentUrl = window.__nebuloProxyDocumentUrl;
  if (!NativeURL || !NativeHeaders || !nativeFetch || !nativeDocumentUrl) return;

  let proxyDocument;
  try {
    proxyDocument = new NativeURL(nativeDocumentUrl);
  } catch (_) {
    return;
  }

  const proxyMatch = proxyDocument.pathname.match(/^\/ag\/(https?)\/([^/]+)(\/.*)?$/i);
  if (!proxyMatch) return;

  const proxyOrigin = proxyDocument.origin;
  const upstreamProtocol = proxyMatch[1].toLowerCase();
  const upstreamHost = proxyMatch[2];
  const upstreamPath = proxyMatch[3] || '/';
  const upstreamPageUrl = upstreamProtocol + '://' + upstreamHost + upstreamPath + proxyDocument.search;
  const isCrazyGamesGameHost = /(?:^|\.)game-files\.crazygames\.com$/i.test(upstreamHost);
  const isAudiomackDocument = /^(?:www\.)?audiomack\.com$/i.test(upstreamHost);
  const isTikTokDocument = /^(?:www\.)?tiktok\.com$/i.test(upstreamHost);
  const internalHeaders = [
    'argon-newreferer',
    'argon-real-referer',
    'argon-target-host',
    'argon-target-protocol',
    'argon-window-location-pathname'
  ];

  // Audiomack coordinates separate browser tabs through the STOP_PLAYBACK
  // storage key. All virtual sites share the local proxy origin, so this
  // signal can return from an unrelated proxied/setup document and stop the
  // track that just started. Keep that cross-document control message out of
  // the virtual Audiomack page; its normal in-page player state is unaffected.
  if (isAudiomackDocument) {
    window.addEventListener('storage', function nebuloAudiomackStorageIsolation(event) {
      if (event && event.key === 'STOP_PLAYBACK') event.stopImmediatePropagation();
    }, true);
  }

  function isLocalRuntimePath(pathname) {
    return /^\/(?:ag\/|argon-runtime\/|argon-response-injected\.js(?:[/?#]|$)|argon_service_worker\.js(?:[/?#]|$)|argon-tiktok-feed-cache\.json(?:[/?#]|$)|baremux\/|epoxy\/|uv\/|ec\/|scram(?:jet)?\/|wisp(?:\/|$)|blockwisp(?:\/|$)|socket\.io\/|service-worker\.js(?:[/?#]|$)|unified\/)/i.test(pathname || '');
  }

  function collapseNestedProxyUrl(value) {
    let parsed;
    try {
      parsed = new NativeURL(value, proxyOrigin);
    } catch (_) {
      return value;
    }
    if (parsed.origin !== proxyOrigin) return parsed.href;

    let pathname = parsed.pathname;
    for (let depth = 0; depth < 8; depth += 1) {
      const nested = pathname.match(/^\/ag\/(?:https?)\/[^/]+(\/ag\/(?:https?)\/[^/]+(?:\/.*)?$)/i);
      if (!nested) break;
      pathname = nested[1];
    }
    parsed.pathname = pathname;
    return parsed.href;
  }

  function routeUrl(value) {
    const raw = String(value == null ? '' : value);
    if (!raw || /^(?:data|blob|javascript|mailto|tel|about):/i.test(raw)) return raw;
    if (/^\/ag\/(?:https?)\//i.test(raw)) return collapseNestedProxyUrl(proxyOrigin + raw);
    if (raw.indexOf(proxyOrigin + '/ag/') === 0) return collapseNestedProxyUrl(raw);

    let resolved;
    try {
      resolved = new NativeURL(raw, upstreamPageUrl);
    } catch (_) {
      return raw;
    }
    if (!/^https?:$/.test(resolved.protocol)) return raw;
    if (isTikTokDocument
      && /^(?:localhost|127(?:\.\d+){3})$/i.test(resolved.hostname)
      && /^\/ttwid\/check\/?$/i.test(resolved.pathname)) {
      // TikTok constructs this URL from location.origin. Under Argon that is
      // the local proxy origin, not TikTok's virtual origin. Send the request
      // back to the active TikTok host instead of proxying localhost itself.
      resolved = new NativeURL(
        upstreamProtocol + '://' + upstreamHost + resolved.pathname + resolved.search + resolved.hash
      );
    }
    if (/^games\.crazygames\.com$/i.test(resolved.hostname)) {
      resolved.searchParams.set('isNewUser', 'true');
      resolved.searchParams.set('isFirstSession', 'true');
      resolved.searchParams.set('czyExpClientAdsDummyAA', 'disabled');
      resolved.searchParams.set('czyExpNewSaveProgressNotice_CZY_19240', 'disabled');
    }
    if (resolved.origin === proxyOrigin) {
      if (isLocalRuntimePath(resolved.pathname)) return resolved.href;
      return proxyOrigin
        + '/ag/'
        + upstreamProtocol
        + '/'
        + upstreamHost
        + resolved.pathname
        + resolved.search
        + resolved.hash;
    }

    return proxyOrigin
      + '/ag/'
      + resolved.protocol.slice(0, -1)
      + '/'
      + resolved.host
      + resolved.pathname
      + resolved.search
      + resolved.hash;
  }

  function cleanHeaders(headers) {
    const cleaned = new NativeHeaders(headers || undefined);
    for (const name of internalHeaders) cleaned.delete(name);
    return cleaned;
  }

  // Argon's origin virtualization makes CrazyGames' parent reply to itself
  // instead of the game iframe. Forward the portal handshake to the frame
  // using the browser's unmodified postMessage implementation.
  if (/^(?:www\.)?crazygames\.com$/i.test(upstreamHost) && nativeWindowPostMessage) {
    const gameFrameReplyTypes = new Set([
      'gfInit',
      'userPortalInfoSync',
      'analyticsInfoGF'
    ]);
    window.addEventListener('message', function nebuloCrazyGamesFrameBridge(event) {
      const data = event && event.data;
      if (!data || !gameFrameReplyTypes.has(data.type)) return;

      const gameFrame = Array.prototype.find.call(document.querySelectorAll('iframe'), function (frame) {
        const source = String(frame.getAttribute('src') || frame.src || '');
        return /(?:\/ag\/https\/)?games\.crazygames\.com\//i.test(source);
      });
      if (!gameFrame || !gameFrame.contentWindow) return;

      nativeWindowPostMessage.call(gameFrame.contentWindow, data, '*');
    }, true);

    const watchedGameFrames = new WeakSet();
    const watchGameFrame = function (frame) {
      if (!frame || watchedGameFrames.has(frame)) return;
      const source = String(frame.getAttribute('src') || frame.src || '');
      if (!/(?:\/ag\/https\/)?games\.crazygames\.com\//i.test(source)) return;
      watchedGameFrames.add(frame);

      setTimeout(function () {
        if (!frame.isConnected) return;
        const currentSource = String(frame.getAttribute('src') || frame.src || '');
        if (/([?&])nebuloGameFrameRetry=1(?:[&#]|$)/i.test(currentSource)) return;

        let hasGameChild = false;
        try {
          hasGameChild = Boolean(frame.contentDocument && frame.contentDocument.querySelector(
            'iframe[src*=".game-files.crazygames.com/"]'
          ));
        } catch (_) {}
        if (hasGameChild) return;

        try {
          const retryUrl = new NativeURL(currentSource, location.href);
          retryUrl.searchParams.set('nebuloGameFrameRetry', '1');
          frame.setAttribute('src', retryUrl.href);
        } catch (_) {}
      }, 12_000);
    };

    const discoverGameFrames = function () {
      Array.prototype.forEach.call(document.querySelectorAll('iframe'), watchGameFrame);
    };
    discoverGameFrames();
    new MutationObserver(discoverGameFrames).observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['src']
    });
  }

  // The GameFrame has the same origin-virtualization problem when it replies
  // to the actual game iframe. Bridge frame-control/configuration messages to
  // every CrazyGames game host, regardless of the game's engine or template.
  if (/^games\.crazygames\.com$/i.test(upstreamHost) && nativeWindowPostMessage) {
    const gameToFrameTypes = new Set([
      'unity2020ready',
      'gameIframe-heartbeat',
      'escapeFullscreen',
      'syncUnityData',
      'unityError',
      'unityMemoryUsage',
      'unityCrashError',
      'unityCrashModalOpen',
      'window.Crazygames.init',
      'window.Crazygames.requestAd'
    ]);
    window.addEventListener('message', function nebuloCrazyGamesChildBridge(event) {
      const data = event && event.data;
      const type = data && typeof data.type === 'string' ? data.type : '';
      if (!type || gameToFrameTypes.has(type)) return;

      const childFrame = Array.prototype.find.call(document.querySelectorAll('iframe'), function (frame) {
        const source = String(frame.getAttribute('src') || frame.src || '');
        return /(?:\/ag\/https\/)?[^/]+\.game-files\.crazygames\.com\//i.test(source);
      });
      if (!childFrame || !childFrame.contentWindow) return;

      nativeWindowPostMessage.call(childFrame.contentWindow, data, '*');
    }, true);
  }

  window.__nebuloArgonNetworkRoutingInstalled = true;
  function tikTokJsonResponse(payload) {
    return new Response(JSON.stringify(payload), {
      status: 200,
      headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }
    });
  }

  function syntheticTikTokFetch(requestUrl, method) {
    if (!isTikTokDocument) return null;
    const normalizedUrl = String(requestUrl || '');
    const requestMethod = String(method || 'GET').toUpperCase();
    if ((requestMethod === 'GET' || requestMethod === 'POST')
      && /\/tiktok\/ppf\/api\/eligibility\/v2(?:[?#]|$)/i.test(normalizedUrl)) {
      return tikTokJsonResponse({
        eligibility_list: [{
          decision_code: '0',
          id_value: 'account_control',
          is_eligible: true,
          source: 'ppf'
        }],
        log_pb: { impr_id: String(Date.now()) + '-nebulo' },
        status_code: 0,
        status_msg: ''
      });
    }
    if (requestMethod === 'POST'
      && /\/monitor_browser\/collect\/batch\/(?:[?#]|$)/i.test(normalizedUrl)) {
      return new Response(null, { status: 204, headers: { 'Cache-Control': 'no-store' } });
    }
    if ((requestMethod === 'GET' || requestMethod === 'POST')
      && /\/api\/global-footer\/graphql(?:[?#]|$)/i.test(normalizedUrl)) {
      return tikTokJsonResponse({ data: {} });
    }
    return null;
  }

  function publishTikTokFeed(payload, requestUrl) {
    if (!isTikTokDocument || !payload || !Array.isArray(payload.itemList) || !payload.itemList.length) return;
    window.__nebuloTikTokPayloadQueue = window.__nebuloTikTokPayloadQueue || [];
    window.__nebuloTikTokPayloadQueue.push(payload);
    if (/\/api\/preload\/item_list\//i.test(String(requestUrl || ''))) {
      window.__nebuloTikTokPreloadUrl = String(requestUrl);
    }
    if (window.NebuloTikTokClient && typeof window.NebuloTikTokClient.capture === 'function') {
      window.NebuloTikTokClient.capture(payload);
    }
  }

  function observeTikTokFeed(promise, requestUrl) {
    if (!isTikTokDocument || !/\/api\/(?:recommend|preload)\/item_list\//i.test(String(requestUrl || ''))) {
      return promise;
    }
    Promise.resolve(promise).then(function (response) {
      if (!response || typeof response.clone !== 'function') return;
      return response.clone().json().then(function (payload) {
        publishTikTokFeed(payload, requestUrl);
      }).catch(function () {});
    }).catch(function () {});
    return promise;
  }

  function bufferEncodedUpload(body, send) {
    if (!body || typeof body.getReader !== 'function') return null;
    // YouTube uses CompressionStream for larger Innertube payloads. Streaming
    // that body through a rewritten localhost URL can leave Chromium's HTTP/1
    // upload open forever. Buffer only encoded uploads, then send the exact
    // same bytes with a concrete length; ordinary media/download streams keep
    // their native behavior.
    return new Response(body).arrayBuffer().then(send);
  }

  window.fetch = function nebuloArgonFetch(input, init) {
    const requestInput = NativeRequest && input instanceof NativeRequest;
    const rawUrl = requestInput ? input.url : input;
    const requestMethod = init && init.method
      ? init.method
      : (requestInput ? input.method : 'GET');
    const syntheticResponse = syntheticTikTokFetch(rawUrl, requestMethod);
    if (syntheticResponse) return Promise.resolve(syntheticResponse);
    const routedUrl = routeUrl(rawUrl);

    if (requestInput) {
      const routedRequest = routedUrl === input.url ? input : new NativeRequest(routedUrl, input);
      const options = Object.assign({}, init || {});
      options.headers = cleanHeaders(
        init && Object.prototype.hasOwnProperty.call(init, 'headers')
          ? init.headers
          : routedRequest.headers
      );
      if (options.headers.has('content-encoding')) {
        const buffered = bufferEncodedUpload(routedRequest.body, function (body) {
          return nativeFetch(routedUrl, {
            method: routedRequest.method,
            headers: options.headers,
            body: body,
            cache: options.cache || routedRequest.cache,
            credentials: options.credentials || routedRequest.credentials,
            redirect: options.redirect || routedRequest.redirect,
            referrerPolicy: options.referrerPolicy || routedRequest.referrerPolicy,
            signal: options.signal || routedRequest.signal
          });
        });
        if (buffered) return buffered;
      }
      return observeTikTokFeed(nativeFetch(routedRequest, options), rawUrl);
    }

    const options = Object.assign({}, init || {});
    if (init && Object.prototype.hasOwnProperty.call(init, 'headers')) {
      options.headers = cleanHeaders(init.headers);
    }
    const optionHeaders = new NativeHeaders(options.headers || undefined);
    if (optionHeaders.has('content-encoding')) {
      const buffered = bufferEncodedUpload(options.body, function (body) {
        return nativeFetch(routedUrl, Object.assign({}, options, { headers: optionHeaders, body: body }));
      });
      if (buffered) return buffered;
    }
    return observeTikTokFeed(nativeFetch(routedUrl, options), rawUrl);
  };

  if (window.XMLHttpRequest && window.__nebuloNativeXhrOpen) {
    const xhrPrototype = window.XMLHttpRequest.prototype;
    xhrPrototype.open = function nebuloArgonXhrOpen() {
      const args = Array.prototype.slice.call(arguments);
      args[1] = routeUrl(args[1]);
      return window.__nebuloNativeXhrOpen.apply(this, args);
    };
    if (window.__nebuloNativeXhrSetRequestHeader) {
      xhrPrototype.setRequestHeader = function nebuloArgonXhrSetRequestHeader(name, value) {
        if (internalHeaders.indexOf(String(name || '').toLowerCase()) !== -1) return;
        return window.__nebuloNativeXhrSetRequestHeader.call(this, name, value);
      };
    }
    if (window.__nebuloNativeXhrSend) {
      xhrPrototype.send = function nebuloArgonXhrSend(body) {
        return window.__nebuloNativeXhrSend.call(this, body);
      };
    }
  }

  if (window.__nebuloNativeSendBeacon) {
    navigator.sendBeacon = function nebuloArgonSendBeacon(url, data) {
      return window.__nebuloNativeSendBeacon(routeUrl(url), data);
    };
  }

  if (window.__nebuloNativeEventSource) {
    const NativeEventSource = window.__nebuloNativeEventSource;
    function NebuloEventSource(url, options) {
      return new NativeEventSource(routeUrl(url), options);
    }
    NebuloEventSource.prototype = NativeEventSource.prototype;
    Object.setPrototypeOf(NebuloEventSource, NativeEventSource);
    window.EventSource = NebuloEventSource;
  }

  // GeForce NOW's post-login control channel uses secure WebSockets. A native
  // socket opened from localhost exposes the proxy origin to NVIDIA and can be
  // rejected before the streaming session is negotiated. Route only NVIDIA's
  // real-time hosts through the already-configured BareMux/Wisp transport;
  // every other site continues to use the browser's WebSocket implementation.
  if (window.WebSocket) {
    const NativeWebSocket = window.WebSocket;
    const isNvidiaRealtimeTarget = function (value) {
      try {
        const target = new NativeURL(String(value), upstreamPageUrl);
        const host = String(target.hostname || '').toLowerCase();
        return (target.protocol === 'wss:' || target.protocol === 'ws:')
          && (host === 'geforcenow.com' || host.endsWith('.geforcenow.com')
            || host === 'nvgs.nvidia.com' || host.endsWith('.nvgs.nvidia.com'));
      } catch (_) {
        return false;
      }
    };
    const getBareMux = function () {
      try {
        if (window.BareMux && window.BareMux.BareClient) return window.BareMux;
        if (window.parent && window.parent !== window
          && window.parent.BareMux && window.parent.BareMux.BareClient) {
          return window.parent.BareMux;
        }
      } catch (_) {}
      return null;
    };
    function NebuloArgonWebSocket(url, protocols) {
      if (!isNvidiaRealtimeTarget(url)) return new NativeWebSocket(url, protocols);
      const BareMuxRuntime = getBareMux();
      if (!BareMuxRuntime) return new NativeWebSocket(url, protocols);
      try {
        const target = new NativeURL(String(url), upstreamPageUrl);
        const client = new BareMuxRuntime.BareClient();
        const upstreamOrigin = upstreamProtocol + '://' + upstreamHost;
        const headers = { Origin: upstreamOrigin, Referer: upstreamPageUrl };
        window.__nebuloArgonNvidiaWebSocketBridge = true;
        return client.createWebSocket(target.href, protocols || [], NativeWebSocket, headers);
      } catch (_) {
        return new NativeWebSocket(url, protocols);
      }
    }
    NebuloArgonWebSocket.prototype = NativeWebSocket.prototype;
    Object.setPrototypeOf(NebuloArgonWebSocket, NativeWebSocket);
    window.WebSocket = NebuloArgonWebSocket;
  }

  function routeSrcset(value) {
    const raw = String(value == null ? '' : value);
    if (!raw || /^\s*data:/i.test(raw)) return raw;
    return raw.split(',').map(function (candidate) {
      const match = candidate.trim().match(/^(\S+)(\s+.*)?$/);
      return match ? routeUrl(match[1]) + (match[2] || '') : candidate;
    }).join(', ');
  }

  const nativeSetAttribute = window.__nebuloNativeElementSetAttribute || Element.prototype.setAttribute;
  const nativeRemoveAttribute = Element.prototype.removeAttribute;

  function patchResourceProperty(proto, property, isSrcset) {
    if (!proto) return;
    const descriptor = Object.getOwnPropertyDescriptor(proto, property);
    if (!descriptor || typeof descriptor.set !== 'function' || descriptor.configurable === false) return;
    Object.defineProperty(proto, property, {
      configurable: true,
      enumerable: descriptor.enumerable,
      get: descriptor.get ? function () { return descriptor.get.call(this); } : undefined,
      set: function (value) {
        const routedValue = isSrcset ? routeSrcset(value) : routeUrl(value);
        return nativeSetAttribute.call(this, property.toLowerCase(), routedValue);
      }
    });
  }

  patchResourceProperty(window.HTMLLinkElement && HTMLLinkElement.prototype, 'href');
  patchResourceProperty(window.HTMLScriptElement && HTMLScriptElement.prototype, 'src');
  patchResourceProperty(window.HTMLImageElement && HTMLImageElement.prototype, 'src');
  patchResourceProperty(window.HTMLImageElement && HTMLImageElement.prototype, 'srcset', true);
  patchResourceProperty(window.HTMLVideoElement && HTMLVideoElement.prototype, 'src');
  patchResourceProperty(window.HTMLVideoElement && HTMLVideoElement.prototype, 'poster');
  patchResourceProperty(window.HTMLAudioElement && HTMLAudioElement.prototype, 'src');
  patchResourceProperty(window.HTMLSourceElement && HTMLSourceElement.prototype, 'src');
  patchResourceProperty(window.HTMLSourceElement && HTMLSourceElement.prototype, 'srcset', true);
  patchResourceProperty(window.HTMLIFrameElement && HTMLIFrameElement.prototype, 'src');
  patchResourceProperty(window.HTMLTrackElement && HTMLTrackElement.prototype, 'src');
  patchResourceProperty(window.HTMLInputElement && HTMLInputElement.prototype, 'src');

  function routeCssUrls(value) {
    const raw = String(value == null ? '' : value);
    if (!/url\(/i.test(raw)) return raw;
    return raw.replace(
      /url\(\s*(["']?)([^"')]+)\1\s*\)/gi,
      function (_match, quote, url) {
        const routed = routeUrl(String(url || '').trim());
        return 'url("' + routed.replace(/"/g, '%22') + '")';
      }
    );
  }

  if (window.CSSStyleDeclaration) {
    const stylePrototype = window.CSSStyleDeclaration.prototype;
    const nativeSetProperty = stylePrototype.setProperty;
    stylePrototype.setProperty = function nebuloArgonSetProperty(name, value, priority) {
      return nativeSetProperty.call(this, name, routeCssUrls(value), priority);
    };
    const routedStyleProperties = {
      backgroundImage: 'background-image',
      borderImageSource: 'border-image-source',
      listStyleImage: 'list-style-image',
      maskImage: 'mask-image',
      webkitMaskImage: '-webkit-mask-image'
    };
    for (const [property, cssName] of Object.entries(routedStyleProperties)) {
      const descriptor = Object.getOwnPropertyDescriptor(stylePrototype, property);
      if (descriptor && descriptor.configurable === false) continue;
      Object.defineProperty(stylePrototype, property, {
        configurable: true,
        enumerable: descriptor ? descriptor.enumerable : true,
        get: descriptor && descriptor.get
          ? function () { return descriptor.get.call(this); }
          : function () { return this.getPropertyValue(cssName); },
        set: function (value) {
          return nativeSetProperty.call(this, cssName, routeCssUrls(value), '');
        }
      });
    }
    const cssTextDescriptor = Object.getOwnPropertyDescriptor(stylePrototype, 'cssText');
    if (cssTextDescriptor && typeof cssTextDescriptor.set === 'function' && cssTextDescriptor.configurable !== false) {
      Object.defineProperty(stylePrototype, 'cssText', {
        configurable: true,
        enumerable: cssTextDescriptor.enumerable,
        get: cssTextDescriptor.get ? function () { return cssTextDescriptor.get.call(this); } : undefined,
        set: function (value) { return cssTextDescriptor.set.call(this, routeCssUrls(value)); }
      });
    }
  }

  function routedResourceAttribute(node, attribute, value) {
    const tag = String(node && node.tagName || '').toUpperCase();
    const attr = String(attribute || '').toLowerCase();
    if (attr === 'srcset' && (tag === 'IMG' || tag === 'SOURCE')) return routeSrcset(value);
    if (attr === 'href' && tag === 'LINK') return routeUrl(value);
    if (attr === 'poster' && tag === 'VIDEO') return routeUrl(value);
    if (attr === 'src' && /^(?:SCRIPT|IMG|VIDEO|AUDIO|SOURCE|IFRAME|TRACK|INPUT)$/.test(tag)) return routeUrl(value);
    if (attr === 'style') return routeCssUrls(value);
    return value;
  }

  Element.prototype.setAttribute = function nebuloArgonSetAttribute(name, value) {
    const attribute = String(name || '').toLowerCase();
    const tag = String(this && this.tagName || '').toUpperCase();
    if (isTikTokDocument && attribute === 'integrity' && (tag === 'SCRIPT' || tag === 'LINK')) {
      nativeRemoveAttribute.call(this, 'integrity');
      return;
    }
    return nativeSetAttribute.call(this, name, routedResourceAttribute(this, name, value));
  };

  if (isTikTokDocument && window.HTMLScriptElement) {
    try {
      const integrityDescriptor = Object.getOwnPropertyDescriptor(HTMLScriptElement.prototype, 'integrity');
      if (!integrityDescriptor || integrityDescriptor.configurable !== false) {
        Object.defineProperty(HTMLScriptElement.prototype, 'integrity', {
          configurable: true,
          enumerable: integrityDescriptor ? integrityDescriptor.enumerable : true,
          get: function () { return ''; },
          set: function () { nativeRemoveAttribute.call(this, 'integrity'); }
        });
      }
    } catch (_) {}
  }

  function routeResourceNode(node) {
    if (!node || node.nodeType !== 1) return;
    if (isTikTokDocument
      && (node.tagName === 'SCRIPT' || node.tagName === 'LINK')
      && node.hasAttribute('integrity')) {
      nativeRemoveAttribute.call(node, 'integrity');
    }
    for (const attribute of ['src', 'srcset', 'href', 'poster', 'style']) {
      if (!node.hasAttribute(attribute)) continue;
      const currentValue = node.getAttribute(attribute);
      const nextValue = routedResourceAttribute(node, attribute, currentValue);
      if (nextValue !== currentValue) node.setAttribute(attribute, nextValue);
    }
    if (node.querySelectorAll) {
      for (const child of node.querySelectorAll('link[href],script[src],img[src],img[srcset],video[src],video[poster],audio[src],source[src],source[srcset],iframe[src],track[src],input[src],[style*="url("]')) {
        routeResourceNode(child);
      }
    }
  }

  if (!isCrazyGamesGameHost) {
    new MutationObserver(function (mutations) {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) routeResourceNode(node);
      }
    }).observe(document.documentElement, { childList: true, subtree: true });
  }

  function routeHistoryUrl(value) {
    if (value === undefined || value === null || value === '') return value;
    return collapseNestedProxyUrl(routeUrl(value));
  }

  // The shell owns visible back/forward history. Relay the proxy-safe path
  // whenever a SPA changes routes so it never has to replay the iframe's
  // noisy internal history (redirects, runtime loads, and search handoffs).
  function notifyShellNavigation(value, action) {
    if (window.parent === window) return;
    var target = value;
    if (!target) {
      try { target = document.URL; } catch (_) {}
    }
    try {
      target = collapseNestedProxyUrl(String(target || ''));
      var parsed = new NativeURL(target, proxyOrigin);
      if (parsed.origin !== proxyOrigin || !/^\/ag\//i.test(parsed.pathname)) return;
      window.parent.postMessage({
        type: 'nebulo-iframe-navigation',
        url: parsed.href,
        action: action || 'push'
      }, proxyOrigin);
    } catch (_) {}
  }

  if (window.__nebuloNativeHistoryPushState && !isCrazyGamesGameHost) {
    Object.defineProperty(history, 'pushState', {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function nebuloArgonPushState(state, title, url) {
        var routedUrl = routeHistoryUrl(url);
        var result = window.__nebuloNativeHistoryPushState.call(history, state, title, routedUrl);
        notifyShellNavigation(routedUrl, 'push');
        return result;
      }
    });
  }
  if (window.__nebuloNativeHistoryReplaceState && !isCrazyGamesGameHost) {
    Object.defineProperty(history, 'replaceState', {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function nebuloArgonReplaceState(state, title, url) {
        var routedUrl = routeHistoryUrl(url);
        var result = window.__nebuloNativeHistoryReplaceState.call(history, state, title, routedUrl);
        notifyShellNavigation(routedUrl, 'replace');
        return result;
      }
    });

    const repairNestedLocation = function () {
      const normalizedCurrentUrl = collapseNestedProxyUrl(location.href);
      if (normalizedCurrentUrl !== location.href) {
        window.__nebuloNativeHistoryReplaceState.call(history, history.state, document.title, normalizedCurrentUrl);
      }
    };
    repairNestedLocation();
    window.addEventListener('popstate', repairNestedLocation);
    window.addEventListener('hashchange', repairNestedLocation);
    window.addEventListener('popstate', function () {
      setTimeout(function () { notifyShellNavigation(document.URL, 'traverse'); }, 0);
    });
    window.addEventListener('hashchange', function () {
      setTimeout(function () { notifyShellNavigation(document.URL, 'traverse'); }, 0);
    });
    const nestedLocationGuard = setInterval(repairNestedLocation, 500);
    window.addEventListener('pagehide', function () {
      clearInterval(nestedLocationGuard);
    }, { once: true });
  }

  notifyShellNavigation(proxyDocument.href, 'replace');
})();
`;
// MutationObserver-based iframe src rewriter — rewrites upstream iframe URLs
// to go through the argon proxy without corrupting inline <script>/JSON data.
// Runs before argon-response-injected.js so the proxy_url_prefix global
// (set by argon.cjs) is already available.
const crazyGamesIframeObserver = `<script data-argon-crazygames-iframe>
(function() {
  var prefix = typeof proxy_url_prefix !== 'undefined' ? proxy_url_prefix : null;
  if (!prefix) return;

  function rewriteUrl(url) {
    if (!url || typeof url !== 'string') return url;
    if (/games\.crazygames\.com/i.test(url)) {
      var portalParams = {
        isNewUser: 'true',
        isFirstSession: 'true',
        czyExpClientAdsDummyAA: 'disabled',
        czyExpNewSaveProgressNotice_CZY_19240: 'disabled'
      };
      for (var paramName in portalParams) {
        var paramPattern = new RegExp('([?&])' + paramName + '=[^&#]*', 'i');
        if (paramPattern.test(url)) {
          url = url.replace(paramPattern, '$1' + paramName + '=' + portalParams[paramName]);
        } else {
          url += (url.indexOf('?') === -1 ? '?' : '&') + paramName + '=' + portalParams[paramName];
        }
      }
    }
    // Already proxied
    if (url.indexOf(prefix) === 0) return url;
    // games.crazygames.com/xxx
    var m = url.match(/^https?:\\/\\/games\\.crazygames\\.com\\/(.*)/i);
    if (m) return prefix + 'https/games.crazygames.com/' + m[1];
    // *.game-files.crazygames.com/xxx (CDN assets)
    m = url.match(/^https?:\\/\\/([a-z0-9.-]+\\.game-files\\.crazygames\\.com)\\/(.*)/i);
    if (m) return prefix + 'https/' + m[1] + '/' + m[2];
    return url;
  }

  function rewriteIframeSrc(iframe) {
    var src = iframe.getAttribute('src');
    if (!src) return;
    var rewritten = rewriteUrl(src);
    if (rewritten !== src) {
      iframe.setAttribute('src', rewritten);
    }
  }

  // Rewrite existing iframes on page load
  try {
    var existing = document.querySelectorAll('iframe[src]');
    for (var i = 0; i < existing.length; i++) rewriteIframeSrc(existing[i]);
  } catch (_) {}

  // Observe for dynamically added iframes and src changes
  var observer = new MutationObserver(function(mutations) {
    for (var i = 0; i < mutations.length; i++) {
      var m = mutations[i];
      if (m.type === 'attributes' && m.attributeName === 'src' && m.target.nodeName === 'IFRAME') {
        rewriteIframeSrc(m.target);
      }
      if (m.addedNodes) {
        for (var j = 0; j < m.addedNodes.length; j++) {
          var node = m.addedNodes[j];
          if (node.nodeName === 'IFRAME') {
            rewriteIframeSrc(node);
          } else if (node.querySelectorAll) {
            var nested = node.querySelectorAll('iframe[src]');
            for (var k = 0; k < nested.length; k++) rewriteIframeSrc(nested[k]);
          }
        }
      }
    }
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['src']
  });
})();
</script>`;

const crazyGamesNavigationFallback = `<script data-argon-crazygames-navigation>
document.addEventListener('click', function (event) {
  if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
  const anchor = event.target && event.target.closest ? event.target.closest('a[href]') : null;
  if (!anchor) return;

  let destination;
  try {
    const clickedUrl = new URL(anchor.href, window.location.href);
    if (clickedUrl.origin === window.location.origin) {
      if (!/^\\/ag\\/https\\/(?:www\\.)?crazygames\\.com\\/game\\//i.test(clickedUrl.pathname)) return;
      destination = clickedUrl.href;
    } else if (/^(?:www\\.)?crazygames\\.com$/i.test(clickedUrl.hostname) && clickedUrl.pathname.startsWith('/game/')) {
      destination = '/ag/' + clickedUrl.protocol.slice(0, -1) + '/' + clickedUrl.host + clickedUrl.pathname + clickedUrl.search + clickedUrl.hash;
    } else {
      return;
    }
  } catch {
    return;
  }

  event.preventDefault();
  event.stopImmediatePropagation();
  window.location.assign(destination);
}, true);
</script>`;

const youtubeNavigationHandoff = `<script data-argon-youtube-navigation>
(function () {
  var isProxiedYouTube = /^\\/ag\\/(?:https?|https%3A)\\/(?:www\\.|m\\.)?(?:youtube\\.com|youtu\\.be)\\//i;
  if (!isProxiedYouTube.test(location.pathname)) return;
  var proxyBaseMatch = location.pathname.match(/^(\\/ag\\/(?:https?|https%3A)\\/(?:www\\.|m\\.)?(?:youtube\\.com|youtu\\.be))(?=\\/|$)/i);
  var youtubeHomePath = proxyBaseMatch ? proxyBaseMatch[1] + '/' : '';

  // A YouTube document nested inside another proxied site is an embed, not a
  // browser navigation. Leave it under the owning site's control.
  if (window.parent !== window) {
    try {
      var parentPath = window.parent.location.pathname;
      if (/^\\/ag\\//i.test(parentPath) && !isProxiedYouTube.test(parentPath)) return;
    } catch (_) {
      return;
    }
  }

  function videoIdFromHref(value) {
    var href = String(value || '');
    try { href = decodeURIComponent(href); } catch (_) {}

    var pathMatch = href.match(/\\/(?:shorts|embed|live)\\/([A-Za-z0-9_-]{11})(?:[/?#]|$)/i)
      || href.match(/youtu\\.be\\/([A-Za-z0-9_-]{11})(?:[/?#]|$)/i);
    if (pathMatch) return pathMatch[1];
    if (!/(?:^|\\/)watch(?:[/?#]|$)/i.test(href)) return '';

    try {
      var parsed = new URL(href, location.href);
      var id = parsed.searchParams.get('v') || '';
      return /^[A-Za-z0-9_-]{11}$/.test(id) ? id : '';
    } catch (_) {
      var queryMatch = href.match(/[?&]v=([A-Za-z0-9_-]{11})(?:[&#]|$)/);
      return queryMatch ? queryMatch[1] : '';
    }
  }

  var handoffStarted = false;
  var lastBrowsePath = '';
  var shortsDiscoveryTimer = 0;
  var shortsDiscoveryDeadline = 0;

  function currentPath() {
    return location.pathname + location.search + location.hash;
  }

  function isGenericShortsPath(value) {
    var path = String(value || '');
    return /^\\/shorts\\/?(?:[?#].*)?$/i.test(path)
      || /^\\/ag\\/(?:https?|https%3A)\\/(?:www\\.|m\\.)?youtube\\.com\\/shorts\\/?(?:[?#].*)?$/i.test(path);
  }

  function isShortsHref(value) {
    var href = String(value || '');
    try { href = decodeURIComponent(href); } catch (_) {}
    return /\\/shorts\\/[A-Za-z0-9_-]{11}(?:[/?#]|$)/i.test(href);
  }

  function nonVideoReturnPath(value) {
    var path = String(value || '');
    return /^\\/ag\\//i.test(path) && !videoIdFromHref(path) && !isGenericShortsPath(path) ? path : '';
  }

  function referrerReturnPath() {
    try {
      var referrer = new URL(document.referrer);
      if (referrer.origin !== location.origin) return '';
      return nonVideoReturnPath(referrer.pathname + referrer.search + referrer.hash);
    } catch (_) {
      return '';
    }
  }

  function openCustomPlayer(videoId, returnPath, isShort) {
    if (handoffStarted || !/^[A-Za-z0-9_-]{11}$/.test(videoId)) return false;
    handoffStarted = true;
    clearTimeout(shortsDiscoveryTimer);
    var safeReturn = nonVideoReturnPath(returnPath)
      || nonVideoReturnPath(lastBrowsePath)
      || referrerReturnPath()
      || youtubeHomePath;
    var target = '/assets/youtube-player-handoff.html?v=' + encodeURIComponent(videoId)
      + (safeReturn ? '&return=' + encodeURIComponent(safeReturn) : '')
      + (isShort ? '&shorts=1' : '');
    window.location.assign(target);
    return true;
  }

  function videoIdFromRendererData(value, depth, seen) {
    if (!value || typeof value !== 'object' || depth > 28 || seen.has(value)) return '';
    seen.add(value);

    var keys;
    try { keys = Object.keys(value); } catch (_) { return ''; }
    for (var index = 0; index < keys.length; index += 1) {
      var key = keys[index];
      if (!/^(?:videoId|video_id)$/i.test(key)) continue;
      var candidate = String(value[key] || '');
      if (/^[A-Za-z0-9_-]{11}$/.test(candidate)) return candidate;
    }

    for (var nestedIndex = 0; nestedIndex < keys.length; nestedIndex += 1) {
      var nestedKey = keys[nestedIndex];
      if (/^(?:trackingParams|clickTrackingParams|continuation)$/i.test(nestedKey)) continue;
      var found = videoIdFromRendererData(value[nestedKey], depth + 1, seen);
      if (found) return found;
    }
    return '';
  }

  function activeShortVideoId() {
    var renderers = document.querySelectorAll('ytd-reel-video-renderer');
    var visible = [];
    var remaining = [];
    for (var index = 0; index < renderers.length; index += 1) {
      var renderer = renderers[index];
      var rect = renderer.getBoundingClientRect();
      var isVisible = rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.top < window.innerHeight;
      (isVisible ? visible : remaining).push(renderer);
    }

    var ordered = visible.concat(remaining);
    for (var rendererIndex = 0; rendererIndex < ordered.length; rendererIndex += 1) {
      var current = ordered[rendererIndex];
      var controller = current.polymerController || null;
      var sources = [
        current.data,
        controller && controller.data,
        controller && controller.__data,
      ];
      for (var sourceIndex = 0; sourceIndex < sources.length; sourceIndex += 1) {
        var videoId = videoIdFromRendererData(sources[sourceIndex], 0, new WeakSet());
        if (videoId) return videoId;
      }
    }
    return '';
  }

  function scheduleShortsDiscovery(returnPath) {
    if (handoffStarted || !isGenericShortsPath(currentPath())) return;
    clearTimeout(shortsDiscoveryTimer);
    shortsDiscoveryDeadline = Math.max(shortsDiscoveryDeadline, Date.now() + 15000);

    var discover = function () {
      if (handoffStarted || !isGenericShortsPath(currentPath())) return;
      var videoId = activeShortVideoId();
      if (videoId) {
        openCustomPlayer(videoId, returnPath, true);
        return;
      }
      if (Date.now() < shortsDiscoveryDeadline) {
        shortsDiscoveryTimer = setTimeout(discover, 200);
      }
    };
    shortsDiscoveryTimer = setTimeout(discover, 0);
  }

  function handoffCurrentLocation(returnPath) {
    var path = currentPath();
    var videoId = videoIdFromHref(path);
    if (videoId) return openCustomPlayer(videoId, returnPath, isShortsHref(path));
    if (isGenericShortsPath(path)) {
      scheduleShortsDiscovery(returnPath);
      return false;
    }
    if (/^\\/ag\\//i.test(path)) lastBrowsePath = path;
    return false;
  }

  function clickedAnchor(event) {
    var target = event.target;
    var anchor = target && target.closest ? target.closest('a[href]') : null;
    if (anchor) return anchor;
    var path = typeof event.composedPath === 'function' ? event.composedPath() : [];
    for (var index = 0; index < path.length; index += 1) {
      var item = path[index];
      if (item && item.matches && item.matches('a[href]')) return item;
    }
    return null;
  }

  document.addEventListener('click', function (event) {
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    var anchor = clickedAnchor(event);
    if (!anchor) return;
    var rawHref = anchor.getAttribute('href') || '';
    var videoId = videoIdFromHref(rawHref) || videoIdFromHref(anchor.href);
    if (!videoId) return;

    event.preventDefault();
    event.stopImmediatePropagation();
    openCustomPlayer(videoId, currentPath(), isShortsHref(rawHref) || isShortsHref(anchor.href));
  }, true);

  ['pushState', 'replaceState'].forEach(function (method) {
    var original = history[method];
    if (typeof original !== 'function') return;
    history[method] = function () {
      var previousPath = currentPath();
      var result = original.apply(this, arguments);
      setTimeout(function () { handoffCurrentLocation(previousPath); }, 0);
      return result;
    };
  });

  window.addEventListener('popstate', function () { handoffCurrentLocation(lastBrowsePath); }, true);
  window.addEventListener('hashchange', function () { handoffCurrentLocation(lastBrowsePath); }, true);
  document.addEventListener('yt-navigate-finish', function () { handoffCurrentLocation(lastBrowsePath); }, true);
  document.addEventListener('yt-page-data-updated', function () { handoffCurrentLocation(lastBrowsePath); }, true);

  setTimeout(function () { handoffCurrentLocation(referrerReturnPath()); }, 0);
})();
</script>`;

// Keep navigation owned by the embedded Nebulo browser. Proxied sites often
// use _top, _parent, or window.open() to escape an iframe during redirects.
const navigationContainmentClient = `<script data-nebulo-navigation-containment>
(function () {
  if (window.parent === window) return;

  function targetName(value) {
    return String(value || '').trim().toLowerCase();
  }

  function proxify(value) {
    var raw = String(value || '').trim();
    if (!raw || /^(?:#|javascript:|mailto:|tel:|data:|blob:)/i.test(raw)) return '';
    try {
      var currentMatch = location.pathname.match(/^\\/ag\\/(https?)\\/([^/]+)(\\/.*)?$/i);
      var base = currentMatch
        ? currentMatch[1] + '://' + currentMatch[2] + (currentMatch[3] || '/') + location.search + location.hash
        : location.href;
      var destination = new URL(raw, base);
      if (destination.origin === location.origin && /^\\/ag\\//i.test(destination.pathname)) {
        return destination.pathname + destination.search + destination.hash;
      }
      if (destination.protocol !== 'http:' && destination.protocol !== 'https:') return '';
      return '/ag/' + destination.protocol.slice(0, -1) + '/' + destination.host
        + (destination.pathname || '/') + destination.search + destination.hash;
    } catch (_) {
      return '';
    }
  }

  function navigateHere(value) {
    if (!value) return;
    try {
      location.assign(new URL(String(value), location.href).href);
    } catch (_) {}
  }

  function openNebuloTab(value, title) {
    if (!value) return;
    try {
      var destination = new URL(String(value), location.href).href;
      window.top.postMessage({
        type: 'nebulo-proxy-open-tab',
        url: destination,
        title: String(title || '').trim() || 'New Tab'
      }, location.origin);
    } catch (_) {}
  }

  document.addEventListener('click', function (event) {
    if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    var anchor = event.target && event.target.closest ? event.target.closest('a[href]') : null;
    if (!anchor) return;
    var destination = proxify(anchor.getAttribute('href') || anchor.href);
    if (!destination) return;
    var target = targetName(anchor.getAttribute('target'));

    event.preventDefault();
    event.stopImmediatePropagation();
    if (target === '_blank') {
      openNebuloTab(destination, anchor.getAttribute('title') || anchor.textContent);
    } else {
      navigateHere(destination);
    }
  }, true);

  document.addEventListener('submit', function (event) {
    var form = event.target;
    if (!form || !form.getAttribute) return;
    var action = proxify(form.getAttribute('action') || location.href);
    if (action) form.setAttribute('action', action);
    var target = targetName(form.getAttribute('target'));
    if (target === '_top' || target === '_parent' || target === '_blank') {
      form.setAttribute('target', '_self');
    }
  }, true);

  var nativeOpen = window.open;
  window.open = function (url, target) {
    var normalizedTarget = targetName(target);
    if (normalizedTarget === '_top' || normalizedTarget === '_parent') {
      navigateHere(url);
      return window;
    }
    if (!normalizedTarget || normalizedTarget === '_blank') {
      openNebuloTab(url, 'New Tab');
      return null;
    }
    return nativeOpen.apply(window, arguments);
  };
})();
</script>`;

const adBlockClient = String.raw`<script data-nebulo-adblock-client>
(function () {
  if (localStorage.getItem('nebuloAdBlock') === 'false') return;
  var blocked = /(?:doubleclick|googlesyndication|googleadservices|adnxs|adsrvr|adform|criteo|pubmatic|rubiconproject|taboola|outbrain|exoclick|exosrv|propellerads|popads|popcash|adsterra|onclkds|onclickalgo|trafficjunky|clickadu|richinfo|subduepaler|addtoany|sflixhd)\./i;
  var exactBlocked = /^(?:src_domain)$/i;
  var selectors = '.adsbygoogle,[data-ad-client],[data-ad-slot],[id^="google_ads_"],[id^="div-gpt-ad"],[aria-label="Advertisement"],iframe[src*="doubleclick"],iframe[src*="googlesyndication"],iframe[src*="adservice"],[class*="banner-ads"],[id*="banner-ad"],[class*="interstitial"],[class*="ssp-modal"],[id*="ad-overlay"],[class*="ad-overlay"],[class*="ad-container"],[id*="ad-wrapper"],iframe[src*="addtoany"]';
  // Define no-op ad globals so publisher scripts that reference them don't crash
  ['Banner','AdBanner','Ad','AdSlot','AdManager','ads','googletag'].forEach(function(name){
    try { if (typeof window[name] === 'undefined') { var n=function(){return{init:function(){},show:function(){},hide:function(){},destroy:function(){}};};Object.defineProperty(window,name,{get:function(){return n;set:function(){}},configurable:true}); } } catch(_){ }
  });
  ['runBanner','loadBanner','openBanner','initBanner','bannerRun'].forEach(function(name){
    try { if (typeof window[name] === 'undefined') window[name]=function(){return null;}; } catch(_){ }
  });
  var _adHide=document.createElement('style');
  _adHide.textContent='[class*="ad-overlay" i],[id*="ad-overlay" i],[class*="interstitial" i],[id*="interstitial" i],[class*="banner-ads" i],[id*="banner-ads" i],[class*="ssp-modal" i],[id*="ssp-modal" i],[class*="ad-container" i],[id*="ad-container" i],[class*="popup-ad" i],[id*="popup-ad" i]{display:none!important;visibility:hidden!important;pointer-events:none!important;height:0!important;min-height:0!important;}';
  (document.head||document.documentElement).appendChild(_adHide);
  function removeInstallerAds(root) {
    if (!root) return;
    var candidates = [];
    if (root.matches && root.matches('#wrapper[data-area], [class*="modal"], [class*="overlay"], [class*="popup"]')) candidates.push(root);
    if (root.querySelectorAll) {
      root.querySelectorAll('#wrapper[data-area], [class*="modal"], [class*="overlay"], [class*="popup"]').forEach(function (node) { candidates.push(node); });
    }
    candidates.forEach(function (node) {
      var text = String(node.textContent || '').replace(/\s+/g, ' ').trim();
      var installerAction = /\b(?:add|install)\s+(?:the\s+)?(?:extension|to\s+chrome)\b/i.test(text);
      var deceptiveContext = /\b(?:ad[- ]?block|privacy policy|browser extension|step\s*1)\b/i.test(text);
      if (installerAction && deceptiveContext) node.remove();
    });
  }
  function clean(root) {
    if (!root || !root.querySelectorAll) return;
    root.querySelectorAll(selectors).forEach(function (node) { node.remove(); });
    removeInstallerAds(root);
  }
  function isBlocked(value) {
    try { var h=new URL(String(value||''),location.href).hostname; return blocked.test(h)||exactBlocked.test(h); } catch (_) { return false; }
  }
  function isBlockedTracking(value) {
    try {
      var url = new URL(value && value.url ? value.url : String(value || ''), location.href);
      var host = proxyHost(url) || url.hostname.toLowerCase();
      return host === 'i.pornhub.com' && /(?:^|\/)\_i(?:[/?#]|$)/i.test(url.pathname);
    } catch (_) { return false; }
  }
  function proxyHost(url) {
    var match = url.pathname.match(/^\/ag\/(?:https?|https%3A)\/([^/]+)/i);
    return match ? match[1].toLowerCase() : '';
  }
  function isSameSite(value) {
    try {
      var target = new URL(String(value || ''), location.href);
      var current = new URL(location.href);
      var currentProxyHost = proxyHost(current);
      var targetProxyHost = proxyHost(target);
      if (currentProxyHost && targetProxyHost) return currentProxyHost === targetProxyHost;
      return target.origin === current.origin && !targetProxyHost;
    } catch (_) { return false; }
  }
  var lastGesture = 0;
  document.addEventListener('pointerdown', function (event) {
    if (event.isTrusted) lastGesture = Date.now();
  }, true);
  var nativeOpen = window.open;
  window.open = function (url) {
    if (isBlocked(url)) return null;
    var activated = navigator.userActivation && navigator.userActivation.isActive;
    if (!isSameSite(url) && !activated && Date.now() - lastGesture > 2500) return null;
    return nativeOpen.apply(window, arguments);
  };
  var nativeFetch = window.fetch;
  window.fetch = function (input) {
    if (isBlockedTracking(input)) {
      return Promise.resolve(new Response(null, { status: 204, statusText: 'No Content' }));
    }
    // Block Cloudflare challenge-platform requests inside proxied pages
    try {
      var reqUrl = typeof input === 'string' ? new URL(input, location.href) : (input && input.url ? new URL(input.url, location.href) : null);
      if (reqUrl && reqUrl.pathname && reqUrl.pathname.indexOf('/cdn-cgi/challenge-platform/') !== -1) {
        return Promise.resolve(new Response(null, { status: 204, statusText: 'No Content' }));
      }
    } catch(_) {}
    return nativeFetch.apply(this, arguments);
  };
  document.addEventListener('click', function (event) {
    var anchor = event.target && event.target.closest ? event.target.closest('a[href]') : null;
    if (anchor && isBlocked(anchor.href)) { event.preventDefault(); event.stopImmediatePropagation(); }
  }, true);
  function startCleaner() {
    clean(document);
    new MutationObserver(function (records) {
      records.forEach(function (record) { record.addedNodes.forEach(clean); });
    }).observe(document.documentElement, { childList: true, subtree: true });
  }
  if (document.readyState === 'complete') {
    setTimeout(startCleaner, 1200);
  } else {
    addEventListener('load', function () { setTimeout(startCleaner, 1200); }, { once: true });
  }
})();
</script>`;

// ID5 is an optional advertising identity provider. Some publishers call its
// global even if the provider CDN timed out; a small no-op contract keeps that
// third-party failure from aborting the site's own startup code.
const optionalAdSdkFallbackClient = `<script data-nebulo-optional-ad-sdk-fallback>${OPTIONAL_ID5_FALLBACK_SOURCE}</script>`;

// Game portals often wait 20–30 seconds while a third-party interstitial SDK
// retries after it has been blocked or frequency-capped. Complete that ad
// lifecycle immediately when Nebulo's ad blocking is enabled, while leaving
// the game runtime and its normal loading path intact.
const gameAdBypassClient = String.raw`<script data-nebulo-game-ad-bypass>
(function () {
  if (localStorage.getItem('nebuloAdBlock') === 'false') return;
  if (window.__nebuloGameAdBypassInstalled) return;
  window.__nebuloGameAdBypassInstalled = true;

  function finish(options, rewarded) {
    var callbacks = options && (options.callbacks || options);
    if (!callbacks || typeof callbacks !== 'object') return;
    try { if (typeof callbacks.onOpen === 'function') callbacks.onOpen(); } catch (_) {}
    try { if (rewarded && typeof callbacks.onRewarded === 'function') callbacks.onRewarded(); } catch (_) {}
    try { if (typeof callbacks.onClose === 'function') callbacks.onClose({ wasShown: false }); } catch (_) {}
    try { if (typeof callbacks.afterAd === 'function') callbacks.afterAd(); } catch (_) {}
    try { if (typeof callbacks.adBreakDone === 'function') callbacks.adBreakDone({ breakStatus: 'notReady' }); } catch (_) {}
  }

  function bypassMethod(owner, name, rewarded) {
    if (!owner || typeof owner[name] !== 'function') return;
    var original = owner[name];
    if (original.__nebuloGameAdBypass) return;
    var bypass = function () {
      var args = Array.prototype.slice.call(arguments);
      var options = args.find(function (value) { return value && typeof value === 'object'; });
      finish(options, rewarded);
      return Promise.resolve({ wasShown: false, rewarded: !!rewarded });
    };
    bypass.__nebuloGameAdBypass = true;
    try { owner[name] = bypass; } catch (_) {}
  }

  function patchManager(manager) {
    if (!manager) return;
    ['showFullscreenAdv', 'showInterstitial', 'showInterstitialAd', 'showRewarded', 'showRewardedVideo', 'showAsync', 'adBreak'].forEach(function (name) {
      bypassMethod(manager, name, /reward/i.test(name));
    });
    try { if (manager.adv) patchManager(manager.adv); } catch (_) {}
  }

  function patchKnownAdApis() {
    [window.ysdk, window.YaGames, window.PkSDK, window.PKSDK, window.FBAdManager, window.AdsManager].forEach(patchManager);
    ['YaGamesGMS_showFullscreenAdv', 'YaGamesGMS_showRewardedVideo', 'showFullscreenAdv', 'showInterstitialAd'].forEach(function (name) {
      if (!/^(?:YaGamesGMS_|show(?:FullscreenAdv|InterstitialAd))/.test(name)) return;
      bypassMethod(window, name, /reward/i.test(name));
    });
  }

  if (typeof window.adBreak !== 'function') {
    window.adBreak = function (options) {
      finish(options, /reward/i.test(String(options && (options.type || options.name) || '')));
    };
  }

  var style = document.createElement('style');
  style.textContent = '[class*="ad-loading" i],[id*="ad-loading" i],[class*="ads-loading" i],[id*="ads-loading" i],[class*="advert-overlay" i],[id*="advert-overlay" i],[class*="ad-overlay" i],[id*="ad-overlay" i]{display:none!important;visibility:hidden!important;pointer-events:none!important;}';
  (document.head || document.documentElement).appendChild(style);
  patchKnownAdApis();
  var attempts = 0;
  var timer = setInterval(function () {
    patchKnownAdApis();
    attempts += 1;
    if (attempts >= 80) clearInterval(timer);
  }, 100);
})();
</script>`;

// Argon rewrites proxied JavaScript, so integrity hashes from the original
// response no longer match. TikTok also adds integrity attributes at runtime;
// sanitize those nodes before the browser starts their requests.
const tiktokCompatClient = `<script data-nebulo-tiktok-compat>
(function () {
  var tiktokHostPattern = /^(?:www\\.)?tiktok\\.com$/i;
  var currentHost = String(location.hostname || '');
  var isTikTokAlias = currentHost === '127.0.0.2';
  if (!isTikTokAlias
    && !tiktokHostPattern.test(currentHost)
    && !tiktokHostPattern.test(String(window.proxy_real_host || ''))) return;
  if (window.__nebuloTikTokCompat) return;
  window.__nebuloTikTokCompat = true;

  var tiktokDesktopUserAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';
  var navigatorOverrides = {
    userAgent: tiktokDesktopUserAgent,
    appVersion: tiktokDesktopUserAgent.replace(/^Mozilla\\//, ''),
    platform: 'Win32',
    vendor: 'Google Inc.',
    maxTouchPoints: 0
  };
  Object.keys(navigatorOverrides).forEach(function (key) {
    try {
      Object.defineProperty(navigator, key, {
        configurable: true,
        get: function () { return navigatorOverrides[key]; }
      });
    } catch (_) {}
  });
  function dismissTikTokAppPrompt() {
    var button = Array.prototype.find.call(document.querySelectorAll('button, [role="button"]'), function (candidate) {
      return /^not now$/i.test(String(candidate.textContent || '').trim());
    });
    if (!button) return false;
    button.click();
    return true;
  }
  var promptCheckScheduled = false;
  var promptObserver = new MutationObserver(function () {
    if (promptCheckScheduled) return;
    promptCheckScheduled = true;
    setTimeout(function () {
      promptCheckScheduled = false;
      dismissTikTokAppPrompt();
    }, 50);
  });
  if (false && document.documentElement) {
    promptObserver.observe(document.documentElement, { childList: true, subtree: true });
  }

  function proxify(raw) {
    if (typeof raw !== 'string' || !raw) return raw;
    if (raw.indexOf('/nebulo/') === 0) return location.origin + raw;
    try {
      var url = new URL(raw, 'https://www.tiktok.com/');
      if (url.protocol !== 'http:' && url.protocol !== 'https:') return raw;
      if (url.hostname === '127.0.0.2') {
        return location.origin + url.pathname + url.search + url.hash;
      }
      if (url.origin === location.origin) return raw;
      return location.origin + '/ag/' + url.protocol.slice(0, -1) + '/' + url.host + url.pathname + url.search + url.hash;
    } catch (_) {
      return raw;
    }
  }
  window.__nebuloTikTokProxify = proxify;

  function formatCount(value) {
    var count = Number(value || 0);
    if (count >= 1000000) return (count / 1000000).toFixed(count >= 10000000 ? 0 : 1).replace('.0', '') + 'M';
    if (count >= 1000) return (count / 1000).toFixed(count >= 100000 ? 0 : 1).replace('.0', '') + 'K';
    return String(count);
  }

  function renderFallbackFeed(payload) {
    var items = payload && Array.isArray(payload.itemList) ? payload.itemList : [];
    window.__nebuloTikTokPayloadCount = items.length;
    if (!items.length || document.getElementById('nebulo-tiktok-feed')) return;

    var style = document.createElement('style');
    style.textContent = '#nebulo-tiktok-feed{position:fixed;inset:0;z-index:2147483000;display:grid;grid-template-columns:232px minmax(0,1fr);background:#080808;color:#fff;font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}#nebulo-tiktok-feed *{box-sizing:border-box}.nt-side{padding:24px 18px;border-right:1px solid #262626;background:#0d0d0d}.nt-brand{font-size:25px;font-weight:800;letter-spacing:-.5px;margin:0 12px 28px}.nt-brand b{color:#fe2c55}.nt-nav{display:grid;gap:7px}.nt-nav div{padding:13px 14px;border-radius:7px;font-size:16px;font-weight:650}.nt-nav .active{background:#202020;color:#fe2c55}.nt-login{margin-top:24px;width:100%;height:42px;border:1px solid #fe2c55;border-radius:5px;background:transparent;color:#fe2c55;font-weight:750}.nt-feed{height:100vh;overflow-y:auto;scroll-snap-type:y mandatory;overscroll-behavior:contain}.nt-post{height:100vh;min-height:620px;scroll-snap-align:start;display:flex;align-items:center;justify-content:center;padding:24px 76px 24px 28px}.nt-stage{position:relative;height:min(88vh,820px);max-width:min(76vw,700px);width:100%;display:flex;align-items:center;justify-content:center}.nt-video{height:100%;max-width:100%;aspect-ratio:9/16;object-fit:contain;background:#111;border-radius:7px;box-shadow:0 18px 60px rgba(0,0,0,.55)}.nt-info{position:absolute;left:max(14px,calc(50% - 280px));right:70px;bottom:20px;padding:34px 18px 18px;background:linear-gradient(transparent,rgba(0,0,0,.78));text-shadow:0 1px 3px #000;pointer-events:none}.nt-user{font-weight:800;font-size:17px}.nt-desc{margin-top:7px;line-height:1.4;font-size:15px}.nt-actions{position:absolute;right:5px;bottom:28px;display:grid;gap:14px;text-align:center}.nt-avatar{width:48px;height:48px;border:2px solid white;border-radius:50%;object-fit:cover;background:#222}.nt-action{display:grid;justify-items:center;gap:4px;font-size:12px;font-weight:650;color:#fff}.nt-action span:first-child{width:45px;height:45px;border-radius:50%;display:grid;place-items:center;background:#252525;font-size:19px}.nt-audio{position:absolute;right:8px;top:10px;border:0;border-radius:999px;padding:8px 11px;background:rgba(0,0,0,.58);color:#fff;font-weight:700;cursor:pointer}@media(max-width:760px){#nebulo-tiktok-feed{grid-template-columns:1fr}.nt-side{display:none}.nt-post{padding:0}.nt-stage{height:100vh;max-width:100vw}.nt-video{border-radius:0}.nt-info{left:0}}';
    document.head.appendChild(style);

    var root = document.createElement('div');
    root.id = 'nebulo-tiktok-feed';
    var side = document.createElement('aside');
    side.className = 'nt-side';
    side.innerHTML = '<div class="nt-brand"><b>&#9834;</b> TikTok</div><div class="nt-nav"><div class="active">For You</div><div>Explore</div><div>Following</div><div>LIVE</div><div>Profile</div></div><button class="nt-login" type="button">Log in</button>';
    var feed = document.createElement('main');
    feed.className = 'nt-feed';

    items.slice(0, 12).forEach(function (item, index) {
      var urls = item && item.video && item.video.PlayAddrStruct && item.video.PlayAddrStruct.UrlList;
      var mediaUrl = Array.isArray(urls) && urls.length ? urls[urls.length - 1] : (item.video && item.video.playAddr);
      if (!mediaUrl) return;
      var post = document.createElement('article');
      post.className = 'nt-post';
      var stage = document.createElement('div');
      stage.className = 'nt-stage';
      var video = document.createElement('video');
      video.className = 'nt-video';
      video.src = proxify(mediaUrl);
      video.poster = proxify((item.video && (item.video.cover || item.video.originCover)) || '');
      video.loop = true;
      video.muted = true;
      video.playsInline = true;
      video.preload = index < 2 ? 'auto' : 'metadata';
      video.addEventListener('click', function () { video.paused ? video.play().catch(function(){}) : video.pause(); });

      var author = item.author || {};
      var stats = item.stats || {};
      var info = document.createElement('div');
      info.className = 'nt-info';
      var user = document.createElement('div');
      user.className = 'nt-user';
      user.textContent = '@' + (author.uniqueId || author.nickname || 'creator');
      var desc = document.createElement('div');
      desc.className = 'nt-desc';
      desc.textContent = item.desc || '';
      info.append(user, desc);

      var actions = document.createElement('div');
      actions.className = 'nt-actions';
      var avatar = document.createElement('img');
      avatar.className = 'nt-avatar';
      avatar.alt = author.nickname || 'Creator';
      avatar.src = proxify(author.avatarThumb || author.avatarMedium || '');
      actions.appendChild(avatar);
      [['&#9829;', stats.diggCount], ['&#9679;', stats.commentCount], ['&#8599;', stats.shareCount]].forEach(function (action) {
        var box = document.createElement('div');
        box.className = 'nt-action';
        box.innerHTML = '<span>' + action[0] + '</span><span>' + formatCount(action[1]) + '</span>';
        actions.appendChild(box);
      });
      var audio = document.createElement('button');
      audio.type = 'button';
      audio.className = 'nt-audio';
      audio.textContent = 'Sound off';
      audio.addEventListener('click', function () {
        video.muted = !video.muted;
        audio.textContent = video.muted ? 'Sound off' : 'Sound on';
      });
      stage.append(video, info, actions, audio);
      post.appendChild(stage);
      feed.appendChild(post);
    });

    root.append(side, feed);
    Array.prototype.forEach.call(document.body.children, function (child) {
      if (child !== root && child.tagName !== 'SCRIPT') child.style.display = 'none';
    });
    document.documentElement.style.overflow = 'hidden';
    document.body.style.margin = '0';
    document.body.style.overflow = 'hidden';
    document.body.style.width = '100vw';
    document.body.appendChild(root);
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var video = entry.target.querySelector('video');
        if (!video) return;
        if (entry.isIntersecting && entry.intersectionRatio > .65) video.play().catch(function(){});
        else video.pause();
      });
    }, { root: feed, threshold: [.2, .65] });
    feed.querySelectorAll('.nt-post').forEach(function (post) { observer.observe(post); });
  }

  var latestTikTokPreloadPayload = null;
  var tiktokPreloadWaiters = [];
  window.__nebuloTikTokNativeBridge = {
    preloadItems: 0,
    recommendationFallbacks: 0,
    recommendationTimeouts: 0,
    refreshTriggered: false
  };

  function publishTikTokPreload(payload) {
    latestTikTokPreloadPayload = payload;
    window.__nebuloTikTokNativeBridge.preloadItems = payload.itemList.length;
    var waiters = tiktokPreloadWaiters.splice(0);
    waiters.forEach(function (resolve) { resolve(payload); });
  }

  function waitForTikTokPreload(timeoutMs) {
    if (latestTikTokPreloadPayload) return Promise.resolve(latestTikTokPreloadPayload);
    return new Promise(function (resolve) {
      var settled = false;
      var finish = function (payload) {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        resolve(payload || null);
      };
      var timer = setTimeout(function () {
        var index = tiktokPreloadWaiters.indexOf(finish);
        if (index >= 0) tiktokPreloadWaiters.splice(index, 1);
        finish(null);
      }, timeoutMs);
      tiktokPreloadWaiters.push(finish);
    });
  }

  function requestTikTokPreload(recommendationUrl) {
    try {
      var source = new URL(String(recommendationUrl || ''), location.href);
      source.pathname = source.pathname.replace('/api/recommend/item_list/', '/api/preload/item_list/');
      source.searchParams.set('count', '3');
      source.searchParams.delete('enable_cache');
      source.searchParams.delete('showAboutThisAd');
      source.searchParams.delete('showAds');
      return nativeFetch(proxify(source.href), {
        credentials: 'include',
        cache: 'no-store'
      }).then(function (response) {
        if (!response.ok) return null;
        return response.json().then(function (payload) {
          if (!payload || !Array.isArray(payload.itemList) || !payload.itemList.length) return null;
          captureTikTokPayload(payload);
          publishTikTokPreload(payload);
          return payload;
        });
      }).catch(function () { return null; });
    } catch (_) {
      return Promise.resolve(null);
    }
  }

  var pendingTikTokItems = [];
  var seenTikTokItemIds = Object.create(null);
  var seededTikTokNativeItems = false;
  var appendTikTokTimer = 0;
  var attachedTikTokSwiper = null;

  function firstTikTokAsset(value) {
    if (typeof value === 'string') return value;
    if (!value || typeof value !== 'object') return '';
    var candidates = value.UrlList || value.urlList || value.url_list;
    return Array.isArray(candidates) && candidates.length ? candidates[candidates.length - 1] : '';
  }

  function tikTokItemId(item) {
    return String((item && (item.id || item.aweme_id)) || '');
  }

  function tikTokAuthorPath(item) {
    var uniqueId = String((item && item.author && (item.author.uniqueId || item.author.unique_id)) || '');
    return uniqueId ? '/@' + encodeURIComponent(uniqueId) : '/foryou';
  }

  function updateTikTokCloneLink(link, path, title) {
    if (!link) return;
    link.href = proxify('https://www.tiktok.com' + path);
    if (title) link.title = title;
  }

  function populateTikTokSlide(slide, item) {
    var id = tikTokItemId(item);
    var author = item.author || {};
    var stats = item.stats || {};
    var music = item.music || {};
    var videoData = item.video || {};
    var authorName = String(author.uniqueId || author.unique_id || author.nickname || 'creator');
    var authorPath = tikTokAuthorPath(item);
    var detailPath = authorPath + '/video/' + encodeURIComponent(id);
    var mediaCandidates = videoData.PlayAddrStruct?.UrlList
      || videoData.playAddr?.UrlList
      || videoData.playAddr?.url_list
      || (typeof videoData.playAddr === 'string' ? [videoData.playAddr] : [])
      || [];
    if (!Array.isArray(mediaCandidates)) mediaCandidates = [];
    var posterUrl = firstTikTokAsset(videoData.cover)
      || firstTikTokAsset(videoData.originCover)
      || firstTikTokAsset(videoData.CoverTsp)
      || firstTikTokAsset(videoData.dynamicCover);
    var avatarUrl = firstTikTokAsset(author.avatarThumb)
      || firstTikTokAsset(author.avatarMedium)
      || firstTikTokAsset(author.avatarLarger);

    slide.className = 'swiper-slide';
    slide.setAttribute('data-nebulo-tiktok-item', id);
    slide.querySelectorAll('[id]').forEach(function (node) { node.removeAttribute('id'); });
    var container = slide.firstElementChild;
    if (container) container.setAttribute('data-e2e', 'video-slide');

    var poster = slide.querySelector('img');
    if (poster && posterUrl) poster.src = proxify(posterUrl);
    var video = slide.querySelector('video');
    if (video && mediaCandidates.length) {
      var mediaIndex = mediaCandidates.length - 1;
      video.pause();
      video.removeAttribute('src');
      video.src = proxify(mediaCandidates[mediaIndex]);
      video.poster = posterUrl ? proxify(posterUrl) : '';
      video.loop = true;
      video.muted = true;
      video.playsInline = true;
      video.preload = 'metadata';
      video.addEventListener('playing', function () {
        if (poster) poster.style.visibility = 'hidden';
      });
      video.addEventListener('error', function () {
        if (mediaIndex <= 0) return;
        mediaIndex -= 1;
        video.src = proxify(mediaCandidates[mediaIndex]);
        video.load();
        if (slide.classList.contains('swiper-slide-active')) video.play().catch(function () {});
      });
      video.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopImmediatePropagation();
        if (video.paused) video.play().catch(function () {});
        else video.pause();
      }, true);
      video.load();
    }

    var avatar = slide.querySelector('[data-e2e="video-author-avatar"]');
    if (avatar) {
      avatar.textContent = authorName.charAt(0).toUpperCase();
      avatar.style.display = 'grid';
      avatar.style.placeItems = 'center';
      avatar.style.fontWeight = '800';
      avatar.style.color = '#fff';
      avatar.style.backgroundColor = '#333';
      avatar.style.backgroundImage = 'none';
      if (avatarUrl) {
        var resolvedAvatarUrl = proxify(avatarUrl);
        var avatarProbe = new Image();
        avatarProbe.onload = function () {
          avatar.textContent = '';
          avatar.style.backgroundImage = 'url("' + resolvedAvatarUrl.replace(/"/g, '%22') + '")';
          avatar.style.backgroundColor = '';
        };
        avatarProbe.src = resolvedAvatarUrl;
      }
    }
    var authorLinks = slide.querySelectorAll('a[href*="/@"]');
    authorLinks.forEach(function (link) {
      updateTikTokCloneLink(link, authorPath, authorName + ' (@' + authorName + ') | TikTok');
    });
    var username = slide.querySelector('[data-e2e="video-username"]');
    if (username) username.textContent = authorName;
    var description = slide.querySelector('.css-3v2bhj-f59ed85f--H1Container');
    if (description) description.textContent = String(item.desc || '');
    var likeCount = slide.querySelector('[data-e2e="like-count"]');
    var commentCount = slide.querySelector('[data-e2e="comment-count"]');
    var shareCount = slide.querySelector('[data-e2e="share-count"]');
    if (likeCount) likeCount.textContent = formatCount(stats.diggCount);
    if (commentCount) commentCount.textContent = formatCount(stats.commentCount);
    if (shareCount) shareCount.textContent = formatCount(stats.shareCount);
    slide.querySelectorAll('[data-e2e="music-name"] > div > div').forEach(function (name) {
      name.textContent = String(music.title || 'original sound');
    });
    var musicLink = slide.querySelector('a[href*="/music/"]');
    if (musicLink && music.id) {
      var musicSlug = encodeURIComponent(String(music.title || 'original-sound').replace(/\s+/g, '-'));
      updateTikTokCloneLink(musicLink, '/music/' + musicSlug + '-' + encodeURIComponent(String(music.id)));
    }

    var detailUrl = proxify('https://www.tiktok.com' + detailPath);
    var commentButton = slide.querySelector('[data-e2e="comment-icon"]');
    if (commentButton) commentButton.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopImmediatePropagation();
      location.href = detailUrl;
    }, true);
    var shareButton = slide.querySelector('[data-e2e="share-icon"]');
    if (shareButton) shareButton.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopImmediatePropagation();
      navigator.clipboard?.writeText('https://www.tiktok.com' + detailPath).catch(function () {});
      if (shareCount) {
        var oldText = shareCount.textContent;
        shareCount.textContent = 'Copied';
        setTimeout(function () { shareCount.textContent = oldText; }, 1100);
      }
    }, true);
    var followButton = slide.querySelector('[data-e2e="follow-button"]');
    if (followButton) followButton.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopImmediatePropagation();
      location.href = proxify('https://www.tiktok.com' + authorPath);
    }, true);
    var likeButton = slide.querySelector('[data-e2e="like-icon"]');
    if (likeButton) likeButton.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopImmediatePropagation();
      var selected = likeButton.getAttribute('aria-pressed') === 'true';
      likeButton.setAttribute('aria-pressed', selected ? 'false' : 'true');
      likeButton.style.color = selected ? '' : 'rgb(254, 44, 85)';
      if (likeCount) likeCount.textContent = formatCount(Number(stats.diggCount || 0) + (selected ? 0 : 1));
    }, true);
  }

  function syncTikTokCustomPlayback() {
    var swiperElement = document.querySelector('.swiper.swiper-initialized');
    var swiper = swiperElement && swiperElement.swiper;
    if (!swiper) return;
    Array.prototype.forEach.call(swiper.slides || [], function (slide) {
      if (!slide.hasAttribute('data-nebulo-tiktok-item')) return;
      var video = slide.querySelector('video');
      if (!video) return;
      if (slide.classList.contains('swiper-slide-active')) video.play().catch(function () {});
      else video.pause();
    });
  }

  function appendPendingTikTokSlides() {
    appendTikTokTimer = 0;
    if (!pendingTikTokItems.length) return;
    var swiperElement = document.querySelector('.swiper.swiper-initialized');
    var swiper = swiperElement && swiperElement.swiper;
    var template = swiper && swiper.slides && swiper.slides[0];
    var wrapper = swiper && (swiper.wrapperEl || template?.parentElement);
    if (!swiper || !template || !wrapper) {
      appendTikTokTimer = setTimeout(appendPendingTikTokSlides, 150);
      return;
    }
    if (attachedTikTokSwiper !== swiper) {
      attachedTikTokSwiper = swiper;
      swiper.on('slideChange', syncTikTokCustomPlayback);
      swiper.on('slideChangeTransitionEnd', syncTikTokCustomPlayback);
    }
    var items = pendingTikTokItems.splice(0);
    items.forEach(function (item) {
      var slide = template.cloneNode(true);
      populateTikTokSlide(slide, item);
      wrapper.appendChild(slide);
    });
    swiper.update();
    syncTikTokCustomPlayback();
  }

  function queueTikTokItems(payload) {
    var items = payload.itemList || [];
    var nativeSeedCount = seededTikTokNativeItems ? 0 : Math.min(2, items.length);
    seededTikTokNativeItems = true;
    items.forEach(function (item, index) {
      var id = tikTokItemId(item);
      if (!id || seenTikTokItemIds[id]) return;
      seenTikTokItemIds[id] = true;
      if (index >= nativeSeedCount) pendingTikTokItems.push(item);
    });
    if (pendingTikTokItems.length && !appendTikTokTimer) {
      appendTikTokTimer = setTimeout(appendPendingTikTokSlides, 0);
    }
  }

  function captureTikTokPayload(payload) {
    if (!payload || !Array.isArray(payload.itemList) || !payload.itemList.length) return;
    window.__nebuloTikTokPayloadCount = payload.itemList.length;
    window.__nebuloTikTokPayloadQueue = window.__nebuloTikTokPayloadQueue || [];
    window.__nebuloTikTokPayloadQueue.push(payload);
    if (window.NebuloTikTokClient && typeof window.NebuloTikTokClient.capture === 'function') {
      window.NebuloTikTokClient.capture(payload);
    }
  }

  function inspectTikTokResponse(promise, requestUrl) {
    if (!/\\/api\\/recommend\\/item_list\\//i.test(String(requestUrl || ''))) return promise;
    return Promise.resolve(promise).then(function (response) {
      if (!response || typeof response.clone !== 'function') {
        window.__nebuloTikTokRecommendationDiagnostics = {
          responseType: typeof response,
          receivedAt: Date.now()
        };
        return response;
      }
      return response.clone().json().then(function (payload) {
        window.__nebuloTikTokRecommendationDiagnostics = {
          status: response.status,
          itemCount: Array.isArray(payload && payload.itemList) ? payload.itemList.length : 0,
          hasMore: payload && payload.hasMore,
          keys: payload && typeof payload === 'object' ? Object.keys(payload) : [],
          receivedAt: Date.now()
        };
        return response;
      }, function (error) {
        window.__nebuloTikTokRecommendationDiagnostics = {
          status: response.status,
          parseError: String(error && error.message || error),
          receivedAt: Date.now()
        };
        return response;
      });
    });
  }

  function proxifySrcset(raw) {
    if (typeof raw !== 'string' || !raw) return raw;
    return raw.split(',').map(function (candidate) {
      var parts = candidate.trim().split(/\\s+/);
      if (parts[0]) parts[0] = proxify(parts[0]);
      return parts.join(' ');
    }).join(', ');
  }

  var nativeFetch = typeof __nebuloNativeFetch === 'function'
    ? __nebuloNativeFetch
    : window.fetch.bind(window);
  function refreshTikTokFeedSnapshot() {
    nativeFetch('/argon-tiktok-feed-cache.json', {
      cache: 'no-store',
      credentials: 'same-origin'
    }).then(function (response) {
      return response.ok ? response.json() : null;
    }).then(function (payload) {
      if (payload && Array.isArray(payload.itemList) && payload.itemList.length) {
        window.__nebuloTikTokCachedFeed = payload;
      }
    }).catch(function () {});
  }
  refreshTikTokFeedSnapshot();
  setInterval(refreshTikTokFeedSnapshot, 1200);

  function tiktokJsonResponse(payload) {
    return new Response(JSON.stringify(payload), {
      status: 200,
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    });
  }

  function fetchTikTokResponse(factory, requestUrl) {
    var normalizedRequestUrl = String(requestUrl || '');
    if (/\\/tiktok\\/ppf\\/api\\/eligibility\\/v2(?:\\?|$)/i.test(normalizedRequestUrl)) {
      return Promise.resolve(tiktokJsonResponse({
        eligibility_list: [{
          decision_code: '0',
          id_value: 'account_control',
          is_eligible: true,
          source: 'ppf'
        }],
        log_pb: { impr_id: String(Date.now()) + '-nebulo' },
        status_code: 0,
        status_msg: ''
      }));
    }
    if (/\\/tiktok\\/v1\\/csp\\/pa_prompt(?:\\?|$)/i.test(normalizedRequestUrl)) {
      return Promise.resolve(tiktokJsonResponse({ data: {}, status_code: 0, status_msg: '' }));
    }
    if (/\\/webcast\\/wallet_api_tiktok\\/recharge\\/check_external_entry(?:\\?|$)/i.test(normalizedRequestUrl)) {
      return Promise.resolve(tiktokJsonResponse({
        data: {
          frequency_control_type: 0,
          is_live_consumption_user: false,
          show_external_entry: false
        },
        extra: { now: Date.now() },
        status_code: 0
      }));
    }
    if (/\\/(?:monitor_browser\\/collect\\/batch|tiktok\\/v1\\/app_open_times\\/upload)\\/(?:\\?|$)/i.test(normalizedRequestUrl)) {
      return Promise.resolve(new Response(null, { status: 204 }));
    }
    if (!/\\/api\\/recommend\\/item_list\\//i.test(normalizedRequestUrl)) {
      return inspectTikTokResponse(factory(), requestUrl);
    }

    return (async function () {
      var lastResponse = null;
      var lastError = null;
      for (var attempt = 0; attempt < 3; attempt += 1) {
        try {
          var response = await factory();
          lastResponse = response;
          lastError = null;
          if (response.ok || response.status < 500) {
            return inspectTikTokResponse(Promise.resolve(response), requestUrl);
          }
        } catch (error) {
          lastError = error;
        }
        if (attempt < 2) {
          await new Promise(function (resolve) {
            setTimeout(resolve, 180 * (attempt + 1));
          });
        }
      }
      try {
        var cachedResponse = await nativeFetch('/argon-tiktok-feed-cache.json', {
          cache: 'no-store',
          credentials: 'same-origin'
        });
        if (cachedResponse.ok) {
          return inspectTikTokResponse(Promise.resolve(cachedResponse), requestUrl);
        }
      } catch (_) {}
      if (lastResponse) return inspectTikTokResponse(Promise.resolve(lastResponse), requestUrl);
      throw lastError || new TypeError('TikTok recommendation request failed');
    })();
  }

  window.fetch = function (input, init) {
    var requestUrl = typeof input === 'string' ? input : (input && (input.href || input.url)) || '';
    if (typeof input === 'string') {
      var routedString = proxify(input);
      return fetchTikTokResponse(function () { return nativeFetch(routedString, init); }, requestUrl);
    }
    if (input instanceof URL) {
      var routedUrl = proxify(input.href);
      return fetchTikTokResponse(function () { return nativeFetch(routedUrl, init); }, requestUrl);
    }
    if (input && typeof input.url === 'string') {
      var nextUrl = proxify(input.url);
      if (nextUrl !== input.url) {
        try {
          input = new Request(nextUrl, input);
        } catch (_) {
          return fetchTikTokResponse(function () { return nativeFetch(nextUrl, init); }, requestUrl);
        }
      }
    }
    var routedRequest = input;
    return fetchTikTokResponse(function () {
      var attemptInput = routedRequest;
      if (routedRequest instanceof Request) {
        try { attemptInput = routedRequest.clone(); } catch (_) {}
      }
      return nativeFetch(attemptInput, init);
    }, requestUrl);
  };

  window.__nebuloTikTokRecommend = function (query) {
    var pairs = [];
    Object.keys(query || {}).forEach(function (key) {
      var value = query[key];
      if (value === undefined || value === null) return;
      if (typeof value === 'object') value = JSON.stringify(value);
      pairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(String(value)));
    });
    var url = '/api/recommend/item_list/' + (pairs.length ? '?' + pairs.join('&') : '');
    return window.fetch(url, {
      cache: 'no-store',
      credentials: 'include',
      headers: { Accept: 'application/json' }
    }).then(function (response) {
      if (!response.ok) throw new Error('TikTok feed request failed: ' + response.status);
      return response.json();
    });
  };

  var nativeFeedRetryCount = 0;
  var nativeFeedRetryTimer = 0;
  var nativeFeedRetryObserver = null;
  function inspectNativeFeedError() {
    nativeFeedRetryTimer = 0;
    if (nativeFeedRetryCount >= 3) {
      if (nativeFeedRetryObserver) nativeFeedRetryObserver.disconnect();
      return;
    }
    var hasFeedError = Array.prototype.some.call(
      document.querySelectorAll('h1, h2, h3, [role="heading"]'),
      function (node) { return /^something went wrong$/i.test(String(node.textContent || '').trim()); }
    );
    if (!hasFeedError) return;
    var retryButton = Array.prototype.find.call(
      document.querySelectorAll('button, [role="button"]'),
      function (node) { return /^(?:try again|retry)$/i.test(String(node.textContent || '').trim()); }
    );
    if (!retryButton) return;
    nativeFeedRetryCount += 1;
    retryButton.click();
  }
  function scheduleNativeFeedErrorCheck() {
    if (nativeFeedRetryTimer || nativeFeedRetryCount >= 3) return;
    nativeFeedRetryTimer = setTimeout(inspectNativeFeedError, 450);
  }
  nativeFeedRetryObserver = new MutationObserver(scheduleNativeFeedErrorCheck);
  if (document.documentElement) {
    nativeFeedRetryObserver.observe(document.documentElement, { childList: true, subtree: true });
    setTimeout(scheduleNativeFeedErrorCheck, 1800);
  }

  var nativeXhrOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (method, url) {
    arguments[1] = proxify(String(url || ''));
    return nativeXhrOpen.apply(this, arguments);
  };

  // The desktop client only needs dynamic request routing. Resource and DOM
  // mutation hooks from the old mobile fallback are intentionally skipped.
  return;

  if (navigator.sendBeacon) {
    var nativeSendBeacon = navigator.sendBeacon.bind(navigator);
    navigator.sendBeacon = function (url, data) {
      return nativeSendBeacon(proxify(String(url || '')), data);
    };
  }

  function patchWorker(name) {
    var NativeWorker = window[name];
    if (typeof NativeWorker !== 'function') return;
    var WrappedWorker = function (url, options) {
      return new NativeWorker(proxify(String(url || '')), options);
    };
    WrappedWorker.prototype = NativeWorker.prototype;
    Object.setPrototypeOf(WrappedWorker, NativeWorker);
    window[name] = WrappedWorker;
  }
  patchWorker('Worker');
  patchWorker('SharedWorker');

  function patchResourceProperty(proto, name, srcset) {
    if (!proto) return;
    var descriptor = Object.getOwnPropertyDescriptor(proto, name);
    if (!descriptor || typeof descriptor.set !== 'function' || descriptor.configurable === false) return;
    Object.defineProperty(proto, name, {
      configurable: true,
      enumerable: descriptor.enumerable,
      get: descriptor.get ? function () { return descriptor.get.call(this); } : undefined,
      set: function (value) {
        return descriptor.set.call(this, srcset ? proxifySrcset(String(value || '')) : proxify(String(value || '')));
      }
    });
  }
  patchResourceProperty(window.HTMLScriptElement && HTMLScriptElement.prototype, 'src');
  patchResourceProperty(window.HTMLLinkElement && HTMLLinkElement.prototype, 'href');
  patchResourceProperty(window.HTMLImageElement && HTMLImageElement.prototype, 'src');
  patchResourceProperty(window.HTMLImageElement && HTMLImageElement.prototype, 'srcset', true);
  patchResourceProperty(window.HTMLVideoElement && HTMLVideoElement.prototype, 'src');
  patchResourceProperty(window.HTMLVideoElement && HTMLVideoElement.prototype, 'poster');
  patchResourceProperty(window.HTMLAudioElement && HTMLAudioElement.prototype, 'src');
  patchResourceProperty(window.HTMLSourceElement && HTMLSourceElement.prototype, 'src');
  patchResourceProperty(window.HTMLSourceElement && HTMLSourceElement.prototype, 'srcset', true);
  patchResourceProperty(window.HTMLIFrameElement && HTMLIFrameElement.prototype, 'src');

  function sanitize(node) {
    if (!node || node.nodeType !== 1) return node;
    if ((node.tagName === 'SCRIPT' || node.tagName === 'LINK') && node.hasAttribute('integrity')) {
      node.removeAttribute('integrity');
    }
    ['src', 'href', 'poster', 'srcset'].forEach(function (attribute) {
      if (!node.hasAttribute(attribute)) return;
      if (attribute === 'href' && node.tagName !== 'LINK') return;
      var currentValue = node.getAttribute(attribute);
      var nextValue = attribute === 'srcset' ? proxifySrcset(currentValue) : proxify(currentValue);
      if (nextValue !== currentValue) node.setAttribute(attribute, nextValue);
    });
    if (node.querySelectorAll) {
      node.querySelectorAll('script[integrity],link[integrity]').forEach(function (child) {
        child.removeAttribute('integrity');
      });
    }
    return node;
  }

  var originalSetAttribute = Element.prototype.setAttribute;
  Element.prototype.setAttribute = function (name, value) {
    var attribute = String(name).toLowerCase();
    if ((this.tagName === 'SCRIPT' || this.tagName === 'LINK') && attribute === 'integrity') {
      this.removeAttribute('integrity');
      return;
    }
    if (attribute === 'src' || attribute === 'poster' || attribute === 'srcset' || (attribute === 'href' && this.tagName === 'LINK')) {
      value = attribute === 'srcset' ? proxifySrcset(String(value || '')) : proxify(String(value || ''));
    }
    return originalSetAttribute.call(this, name, value);
  };

  [
    [Node.prototype, 'appendChild'],
    [Node.prototype, 'insertBefore'],
    [Node.prototype, 'replaceChild']
  ].forEach(function (entry) {
    var proto = entry[0];
    var name = entry[1];
    var original = proto[name];
    proto[name] = function (node) {
      sanitize(node);
      return original.apply(this, arguments);
    };
  });

  try {
    var scriptIntegrity = Object.getOwnPropertyDescriptor(HTMLScriptElement.prototype, 'integrity');
    if (!scriptIntegrity || scriptIntegrity.configurable !== false) {
      Object.defineProperty(HTMLScriptElement.prototype, 'integrity', {
        configurable: true,
        enumerable: scriptIntegrity ? scriptIntegrity.enumerable : true,
        get: function () { return ''; },
        set: function () { this.removeAttribute('integrity'); }
      });
    }
  } catch (_) {}

  sanitize(document.documentElement);
  new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      mutation.addedNodes.forEach(sanitize);
    });
  }).observe(document.documentElement, { childList: true, subtree: true });
})();
</script>`;

// ─── helpers ────────────────────────────────────────────────────────────────

/**
 * Pipe a WHATWG Fetch API Response into a Fastify reply.
 * Uses a Node.js Readable stream so large payloads (video, files, …) are
 * streamed rather than buffered into memory.
 */
// Security headers that break iframed / proxied content.
// Stripping them lets proxied pages render without browser enforcement
// blocking cross-origin framing, resource loads, or opener access.
const STRIP_RESPONSE_HEADERS = new Set([
  'content-security-policy',
  'content-security-policy-report-only',
  'x-frame-options',
  'x-content-type-options',
  'clear-site-data',
  'cross-origin-embedder-policy',
  'cross-origin-opener-policy',
  'cross-origin-resource-policy',
  'permissions-policy',
  'nel',
  'report-to',
]);

function explicitProxyAssetPrefix(proxyTarget, tokenPrefix = '/ag/') {
  if (!proxyTarget?.protocol || !proxyTarget?.host) return '';
  const prefix = tokenPrefix.endsWith('/') ? tokenPrefix : `${tokenPrefix}/`;
  return `${prefix}${proxyTarget.protocol}/${proxyTarget.host}/`;
}

function rewriteExplicitProxyAssets(source, proxyTarget, tokenPrefix) {
  const prefix = explicitProxyAssetPrefix(proxyTarget, tokenPrefix);
  if (!prefix || typeof source !== 'string') return source;
  const nextPrefix = `${prefix}_next/`;
  return source
    .replaceAll('"/_next/', `"${nextPrefix}`)
    .replaceAll("'/_next/", `'${nextPrefix}`)
    .replaceAll('url(/_next/', `url(${nextPrefix}`)
    .replace(/(["'])\/(logo\.png|favicon\.ico|manifest\.json|seo\.png)(?=[?"'])/gi, `$1${prefix}$2`);
}

function rewriteRootRelativeCssUrls(source, proxyTarget, tokenPrefix) {
  const prefix = explicitProxyAssetPrefix(proxyTarget, tokenPrefix);
  if (!prefix || typeof source !== 'string') return source;
  return source
    .replace(
      /url\(\s*(["']?)\/(?!\/)([^"')]+)\1\s*\)/gi,
      (_match, _quote, resourcePath) => `url("${prefix}${resourcePath}")`,
    )
    .replace(
      /(@import\s+)(["'])\/(?!\/)([^"']+)\2/gi,
      (_match, declaration, quote, resourcePath) => `${declaration}${quote}${prefix}${resourcePath}${quote}`,
    );
}

function rewriteRootRelativeHtmlAttributes(source, proxyTarget, tokenPrefix) {
  const prefix = explicitProxyAssetPrefix(proxyTarget, tokenPrefix);
  if (!prefix || typeof source !== 'string') return source;
  const localRuntimePath = /^\/(?:ag\/|argon-runtime\/|argon-response-injected\.js(?:[?#]|$)|argon_service_worker\.js(?:[?#]|$))/i;
  return source.replace(
    /\b(src|href|action|poster|data-src)\s*=\s*(["'])(\/(?!\/)[^"']*)\2/gi,
    (match, attribute, quote, value) => {
      if (localRuntimePath.test(value)) return match;
      return `${attribute}=${quote}${prefix}${value.slice(1)}${quote}`;
    }
  );
}

function rewriteAbsoluteHtmlAttributes(source, proxyTarget, tokenPrefix) {
  const prefix = tokenPrefix.endsWith('/') ? tokenPrefix : `${tokenPrefix}/`;
  if (!prefix || typeof source !== 'string') return source;
  const defaultProtocol = String(proxyTarget?.protocol || 'https').replace(/:$/, '') || 'https';
  return source.replace(
    /\b(src|href|action|poster|data-src)\s*=\s*(["'])((?:https?:)?\/\/[^"'\s<>]+)\2/gi,
    (match, attribute, quote, value) => {
      try {
        const absolute = String(value).startsWith('//') ? `${defaultProtocol}:${value}` : String(value);
        const url = new URL(absolute);
        if (url.protocol !== 'http:' && url.protocol !== 'https:') return match;
        return `${attribute}=${quote}${prefix}${url.protocol.slice(0, -1)}/${url.host}${url.pathname}${url.search}${url.hash}${quote}`;
      } catch {
        return match;
      }
    },
  );
}

function buildVirtualLocationBootstrap(proxyTarget, tokenPrefix = '/ag/') {
  if (!proxyTarget?.protocol || !proxyTarget?.host) return '';
  try {
    const upstreamUrl = new URL(`${proxyTarget.protocol}://${proxyTarget.host}${proxyTarget.resourcePath || '/'}${proxyTarget.search || ''}`);
    const snapshot = JSON.stringify({
      href: upstreamUrl.href,
      origin: upstreamUrl.origin,
      protocol: upstreamUrl.protocol,
      host: upstreamUrl.host,
      hostname: upstreamUrl.hostname,
      port: upstreamUrl.port,
      pathname: upstreamUrl.pathname,
      search: upstreamUrl.search,
      hash: upstreamUrl.hash,
    }).replace(/<\/script/gi, '<\\/script');
    const prefix = tokenPrefix.endsWith('/') ? tokenPrefix : `${tokenPrefix}/`;
    const escapedPrefix = JSON.stringify(prefix);
    return `<script data-nebulo-virtual-location>(function(){window.__nebuloVirtualLocation=Object.freeze(${snapshot});window.__nebuloProxyNavigate=function(value,replace){try{var target=new URL(String(value||''),window.__nebuloVirtualLocation.href);if(target.protocol!=='http:'&&target.protocol!=='https:')return;var destination=location.origin+${escapedPrefix}+target.protocol.slice(0,-1)+'/'+target.host+(target.pathname||'/')+target.search+target.hash;return location[replace?'replace':'assign'](destination);}catch(_){}};})();</script>`;
  } catch {
    return '';
  }
}

function buildNvidiaLoginBaseGuard(proxyTarget, tokenPrefix) {
  const host = String(proxyTarget?.host || '').toLowerCase().split(':')[0];
  if (host !== 'login.nvgs.nvidia.com' && host !== 'login.nvidia.com') return '';

  const prefix = tokenPrefix.endsWith('/') ? tokenPrefix : `${tokenPrefix}/`;
  const expectedPath = `${prefix}${proxyTarget.protocol}/${proxyTarget.host}/`;
  const expectedHref = `window.location.origin + ${JSON.stringify(expectedPath)}`;
  return `<script data-nebulo-nvidia-base-guard>(function(){
    const expected=${expectedHref};
    const isBaseHref=function(node,name){return node instanceof HTMLBaseElement&&String(name).toLowerCase()==='href';};
    const normalize=function(node){if(node&&node.getAttribute('href')!==expected)node.setAttribute('href',expected);};
    const nativeSetAttribute=Element.prototype.setAttribute;
    Element.prototype.setAttribute=function(name,value){
      return nativeSetAttribute.call(this,name,isBaseHref(this,name)?expected:value);
    };
    const hrefDescriptor=Object.getOwnPropertyDescriptor(HTMLBaseElement.prototype,'href');
    if(hrefDescriptor&&hrefDescriptor.set){
      Object.defineProperty(HTMLBaseElement.prototype,'href',{
        configurable:true,enumerable:hrefDescriptor.enumerable,get:hrefDescriptor.get,
        set:function(_value){return hrefDescriptor.set.call(this,expected);}
      });
    }
    new MutationObserver(function(){document.querySelectorAll('base').forEach(normalize);})
      .observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['href']});
    document.querySelectorAll('base').forEach(normalize);
  })();</script>`;
}

function buildGeForceNowCompatibilityGuard(proxyTarget, tokenPrefix) {
  const host = String(proxyTarget?.host || '').toLowerCase().split(':')[0];
  if (host !== 'play.geforcenow.com') return '';

  const prefix = tokenPrefix.endsWith('/') ? tokenPrefix : `${tokenPrefix}/`;
  const scopePath = `${prefix}https/play.geforcenow.com/`;
  return `<script data-nebulo-geforce-now-compat>(function(){
    const scopePath=${JSON.stringify(scopePath)};
    const cleanupKey='nebulo-gfn-worker-cleanup-v1';
    const removeIntegrity=function(node){
      try{if(node&&node.nodeType===1&&node.hasAttribute('integrity'))node.removeAttribute('integrity');}catch(_){}
    };
    document.querySelectorAll('script[integrity],link[integrity]').forEach(removeIntegrity);
    new MutationObserver(function(records){
      records.forEach(function(record){record.addedNodes.forEach(function(node){
        removeIntegrity(node);
        try{node&&node.querySelectorAll&&node.querySelectorAll('script[integrity],link[integrity]').forEach(removeIntegrity);}catch(_){}
      });});
    }).observe(document.documentElement,{childList:true,subtree:true});

    const blockGfnWorker=function(container){
      try{
        if(!container||typeof container.register!=='function'||container.__nebuloGfnRegisterPatched)return;
        const nativeRegister=container.register.bind(container);
        const blockedRegistration={active:null,waiting:null,installing:null,scope:location.origin+scopePath,update:function(){return Promise.resolve();},unregister:function(){return Promise.resolve(true);}};
        const patched=function(scriptUrl,options){
          if(/(?:^|\\/)gfn-service-worker\\.js(?:[?#]|$)/i.test(String(scriptUrl||'')))return Promise.resolve(blockedRegistration);
          return nativeRegister(scriptUrl,options);
        };
        patched.__nebuloGfnRegisterPatched=true;
        container.register=patched;
        try{container.__nebuloGfnRegisterPatched=true;}catch(_){}
      }catch(_){}
    };
    blockGfnWorker(navigator.___serviceWorker);
    setTimeout(function(){blockGfnWorker(navigator.___serviceWorker);},0);

    try{navigator.serviceWorker&&navigator.serviceWorker.getRegistrations&&navigator.serviceWorker.getRegistrations().then(function(registrations){
      return Promise.all(registrations.filter(function(registration){return String(registration.scope||'').includes(scopePath);}).map(function(registration){return registration.unregister().catch(function(){return false;});}));
    }).then(function(results){
      if(results&&results.some(Boolean)&&sessionStorage.getItem(cleanupKey)!=='1'){
        sessionStorage.setItem(cleanupKey,'1');
        location.reload();
      }
    }).catch(function(){});}catch(_){}
  })();</script>`;
}

function buildNvidiaFrameContainmentGuard(proxyTarget, tokenPrefix) {
  const host = String(proxyTarget?.host || '').toLowerCase().split(':')[0];
  const isNvidiaHost = host === 'nvidia.com'
    || host.endsWith('.nvidia.com')
    || host === 'nvgs.nvidia.com'
    || host.endsWith('.nvgs.nvidia.com')
    || host === 'geforcenow.com'
    || host.endsWith('.geforcenow.com');
  if (!isNvidiaHost) return '';

  const prefix = tokenPrefix.endsWith('/') ? tokenPrefix : `${tokenPrefix}/`;
  return `<script data-nebulo-nvidia-frame-containment>(function(){
    if(window.parent===window)return;
    const prefix=${JSON.stringify(prefix)};
    const isNvidia=function(host){host=String(host||'').toLowerCase();return host==='nvidia.com'||host.endsWith('.nvidia.com')||host==='nvgs.nvidia.com'||host.endsWith('.nvgs.nvidia.com')||host==='geforcenow.com'||host.endsWith('.geforcenow.com');};
    const proxify=function(value){
      try{
        const base=(window.__nebuloVirtualLocation&&window.__nebuloVirtualLocation.href)||document.baseURI||location.href;
        const target=new URL(String(value||''),base);
        if(target.origin===location.origin&&target.pathname.indexOf(prefix)===0)return target.href;
        if(!isNvidia(target.hostname)||(target.protocol!=='https:'&&target.protocol!=='http:'))return String(value||'');
        return location.origin+prefix+target.protocol.slice(0,-1)+'/'+target.host+(target.pathname||'/')+target.search+target.hash;
      }catch(_){return String(value||'');}
    };
    const rewriteFrame=function(frame){
      try{const raw=frame.getAttribute('src');const next=proxify(raw);if(raw&&next!==raw)frame.setAttribute('src',next);}catch(_){}
    };
    try{
      const nativeSetAttribute=Element.prototype.setAttribute;
      Element.prototype.setAttribute=function(name,value){
        if(this instanceof HTMLIFrameElement&&String(name).toLowerCase()==='src')value=proxify(value);
        return nativeSetAttribute.call(this,name,value);
      };
      const descriptor=Object.getOwnPropertyDescriptor(HTMLIFrameElement.prototype,'src');
      if(descriptor&&descriptor.set&&descriptor.get){
        Object.defineProperty(HTMLIFrameElement.prototype,'src',{configurable:true,enumerable:descriptor.enumerable,get:descriptor.get,set:function(value){return descriptor.set.call(this,proxify(value));}});
      }
    }catch(_){}
    document.querySelectorAll('iframe[src]').forEach(rewriteFrame);
    new MutationObserver(function(records){records.forEach(function(record){record.addedNodes.forEach(function(node){if(node&&node.nodeType===1){if(node.tagName==='IFRAME')rewriteFrame(node);try{node.querySelectorAll&&node.querySelectorAll('iframe[src]').forEach(rewriteFrame);}catch(_){}}});});}).observe(document.documentElement,{childList:true,subtree:true});
  })();</script>`;
}

function rewriteBrowserLocationReads(source, rewriteHrefReads = false) {
  if (typeof source !== 'string' || !source.includes('location')) return source;
  const virtual = 'window.__nebuloVirtualLocation';
  let rewritten = source
    .replace(/\b(?:window|globalThis|document)\.location\.(pathname|hostname|host|origin|protocol|port|search|hash)\b/g, `${virtual}.$1`)
    // Leave location.href alone: assignments to it must still perform a real
    // navigation and are handled by Argon's navigation runtime.
    .replace(/(?<![\w$.])location\.(pathname|hostname|host|origin|protocol|port|search|hash)\b/g, `${virtual}.$1`);
  if (!rewriteHrefReads) return rewritten;

  // TikTok's route loader uses href/URL string reads instead of pathname.
  // Seeing localhost/ag here makes the official app classify the page as an
  // unknown route: the sidebar mounts, but the FYP never does. Rewrite only
  // read expressions. Direct assignments still target the browser's real
  // Location object and continue through Argon's navigation hooks.
  const isAssignment = '(?!\\s*(?:[+\\-*/%&|^]|<<|>>|>>>)?=)';
  rewritten = rewritten
    .replace(new RegExp('\\b(?:window|globalThis|document)\\.location\\.href\\b' + isAssignment, 'g'), `${virtual}.href`)
    .replace(new RegExp('(?<![\\w$.])location\\.href\\b' + isAssignment, 'g'), `${virtual}.href`)
    .replace(/\b(?:window|globalThis|document)\.location\.toString\s*\(\s*\)/g, `${virtual}.href`)
    .replace(/(?<![\w$.])location\.toString\s*\(\s*\)/g, `${virtual}.href`)
    .replace(/\bdocument\.(?:URL|documentURI)\b/g, `${virtual}.href`);
  return rewritten;
}

function rewriteNvidiaLocationNavigations(source) {
  if (typeof source !== 'string' || !source.includes('location')) return source;
  // Identity bundles can navigate an embedded document directly. Keep those
  // navigations on the proxy origin so the browser never opens a direct
  // login.nvidia.com frame.
  return source
    .replace(/\b(?:window\.)?(?:top\.)?location\.assign\s*\(/g, 'window.__nebuloProxyNavigate(')
    .replace(/\b(?:window\.)?(?:top\.)?location\.replace\s*\(/g, 'window.__nebuloProxyNavigate(');
}

function rewriteCrazyGamesBootstrap(source, proxyTarget) {
  const host = String(proxyTarget?.host || '').toLowerCase();
  if (!host.endsWith('.game-files.crazygames.com')
    || typeof source !== 'string') {
    return source;
  }

  // CrazyGames game templates reject localhost before starting Unity. Under
  // Argon, localhost is only the transport origin; use the preserved upstream
  // host for the template's platform check.
  return source
    .replace(/window\.location\.hostname/g, JSON.stringify(host))
    .replace(/(?<![\w.])location\.hostname/g, JSON.stringify(host));
}

function proxyCookieScope(proxyTarget, tokenPrefix = '/ag/') {
  if (!proxyTarget?.protocol || !proxyTarget?.host) return '';
  const prefix = tokenPrefix.endsWith('/') ? tokenPrefix : `${tokenPrefix}/`;
  return `${prefix}${proxyTarget.protocol}/${proxyTarget.host}/`;
}

function proxyCookieMarker(proxyTarget) {
  if (!proxyTarget?.host) return '';
  const host = String(proxyTarget.host).toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 100);
  return `nebulo_argon_scope_${host}`;
}

function scopeProxyCookie(cookie, scopePath) {
  if (!scopePath) return cookie;
  let scoped = String(cookie || '').replace(/;\s*Domain=[^;]*/ig, '');
  if (/;\s*Path=[^;]*/i.test(scoped)) {
    scoped = scoped.replace(/;\s*Path=[^;]*/ig, `; Path=${scopePath}`);
  } else {
    scoped += `; Path=${scopePath}`;
  }
  return scoped;
}

function tiktokSharedCookieScopes(proxyTarget, tokenPrefix = '/ag/') {
  if (!/^(?:www\.)?tiktok\.com$/i.test(proxyTarget?.host || '')) return [];
  const prefix = tokenPrefix.endsWith('/') ? tokenPrefix : `${tokenPrefix}/`;
  return [
    'v16-webapp-prime.us.tiktok.com',
    'v19-webapp-prime.us.tiktok.com',
    'v16-webapp.tiktok.com',
    'v19-webapp.tiktok.com',
  ].map((host) => `${prefix}https/${host}/`);
}

function nvidiaSharedCookieScopes(proxyTarget, cookie, tokenPrefix = '/ag/') {
  const sourceHost = String(proxyTarget?.host || '').toLowerCase().split(':')[0];
  if (sourceHost !== 'login.nvgs.nvidia.com' && sourceHost !== 'accounts.nvgs.nvidia.com') return [];

  const domainMatch = /;\s*Domain=([^;\s]+)/i.exec(String(cookie || ''));
  const cookieDomain = String(domainMatch?.[1] || '').trim().replace(/^\./, '').toLowerCase();
  // Host-only cookies must remain host-only. NVIDIA's explicit shared-domain
  // cookies are the session handoff used between its login and account apps.
  if (cookieDomain !== 'nvgs.nvidia.com') return [];

  const prefix = tokenPrefix.endsWith('/') ? tokenPrefix : `${tokenPrefix}/`;
  return ['login.nvgs.nvidia.com', 'accounts.nvgs.nvidia.com']
    .filter((host) => host !== sourceHost)
    .map((host) => `${prefix}https/${host}/`);
}

function proxyCookieMarkerForScope(scopePath) {
  const match = /\/https\/([^/]+)\/$/i.exec(String(scopePath || ''));
  return match ? proxyCookieMarker({ host: match[1] }) : '';
}

function sanitizeProxyRequestCookies(headers, proxyTarget) {
  const rawCookie = headers.get('cookie');
  if (!rawCookie || Buffer.byteLength(rawCookie, 'utf8') <= ARGON_COOKIE_BUDGET_BYTES) return;

  const marker = proxyCookieMarker(proxyTarget);
  const pairs = rawCookie.split(';').map((part) => part.trim()).filter(Boolean);
  const hasScopedCookies = marker && pairs.some((pair) => pair.startsWith(`${marker}=`));
  const essential = pairs.filter((pair) => /^proxy_real_(?:protocol|host)=/i.test(pair));

  // Scoped cookies are ordered ahead of legacy Path=/ cookies by browsers.
  // Preserve that leading section within Argon's budget; on the first request
  // discard the polluted cross-site jar and let the site establish fresh state.
  const candidates = hasScopedCookies ? pairs : essential;
  const kept = [];
  let size = 0;
  for (const pair of candidates) {
    const pairSize = Buffer.byteLength(pair, 'utf8') + (kept.length ? 2 : 0);
    if (size + pairSize > ARGON_COOKIE_BUDGET_BYTES) break;
    kept.push(pair);
    size += pairSize;
  }
  for (const pair of essential) {
    if (!kept.includes(pair)) kept.push(pair);
  }

  if (kept.length) headers.set('cookie', kept.join('; '));
  else headers.delete('cookie');
}

async function sendArgonResponse(response, reply, headerOverrides = null, rewriteInjectedRuntime = false, proxyTarget = null, tokenPrefix = '/ag/', runtimeAtomSourceUrl = null, fetchDestination = '', rewriteVirtualLocationReads = false) {
  reply.status(response.status);

  const cookieScope = proxyCookieScope(proxyTarget, tokenPrefix);
  const cookieMarker = proxyCookieMarker(proxyTarget);
  // Node's Fetch implementation transparently decodes gzip/br/deflate bodies,
  // but preserves the upstream Content-Encoding header. Passing that header on
  // makes Chromium attempt to decode an already-decoded document or bundle,
  // which leaves many SPA sites blank immediately after first paint.
  const decodedUpstreamBody = /^(?!identity$).+/i.test(String(response.headers.get('content-encoding') || '').trim());
  const isHtmlResponse = /text\/html/i.test(String(response.headers.get('content-type') || ''));
  let forwardedSetCookies = false;

  for (const [key, value] of response.headers.entries()) {
    const lowerKey = key.toLowerCase();
    // Strip security headers that prevent proxied embedding
    if (STRIP_RESPONSE_HEADERS.has(lowerKey)) continue;
    // Header preloads can start direct CDN requests before the document's
    // rewritten markup arrives. The document below contains proxy-safe URLs,
    // so dropping these hints avoids a first-paint race without affecting use.
    if (isHtmlResponse && lowerKey === 'link') continue;
    // A raw upstream redirect in an embedded tab is followed by Chromium
    // outside Argon's path. That is especially visible during identity flows
    // as “<provider> refused to connect.” Preserve the redirect status while
    // sending its destination back through the same proxy context.
    if (lowerKey === 'location') {
      reply.header(key, rewriteRedirectLocation(value, proxyTarget, tokenPrefix) || value);
      continue;
    }
    if (lowerKey === 'set-cookie') {
      // Undici may expose one iterator entry per cookie while getSetCookie()
      // returns the complete list. Forward that complete list exactly once.
      if (forwardedSetCookies) continue;
      forwardedSetCookies = true;
      const cookieValues = typeof response.headers.getSetCookie === 'function'
        ? response.headers.getSetCookie()
        : [value];
      const upstreamCookies = cookieValues
        .filter((cookie) => !/\bproxy_real_(?:protocol|host)=/i.test(cookie));
      const forwardedCookies = upstreamCookies.map((cookie) => scopeProxyCookie(cookie, cookieScope));
      for (const sharedScope of tiktokSharedCookieScopes(proxyTarget, tokenPrefix)) {
        forwardedCookies.push(...upstreamCookies.map((cookie) => scopeProxyCookie(cookie, sharedScope)));
      }
      const nvidiaSharedScopes = new Set();
      for (const cookie of upstreamCookies) {
        for (const sharedScope of nvidiaSharedCookieScopes(proxyTarget, cookie, tokenPrefix)) {
          nvidiaSharedScopes.add(sharedScope);
          forwardedCookies.push(scopeProxyCookie(cookie, sharedScope));
        }
      }
      if (forwardedCookies.length) {
        if (cookieScope && cookieMarker) {
          forwardedCookies.push(`${cookieMarker}=1; Path=${cookieScope}; Max-Age=1800; HttpOnly; SameSite=Lax`);
        }
        for (const sharedScope of nvidiaSharedScopes) {
          const sharedMarker = proxyCookieMarkerForScope(sharedScope);
          if (sharedMarker) {
            forwardedCookies.push(`${sharedMarker}=1; Path=${sharedScope}; Max-Age=1800; HttpOnly; SameSite=Lax`);
          }
        }
        reply.header('set-cookie', forwardedCookies);
      }
      continue;
    }
    if (decodedUpstreamBody && (lowerKey === 'content-encoding' || lowerKey === 'content-length')) {
      continue;
    }
    // Node.js / Fastify manages transfer-encoding itself.
    if (lowerKey !== 'transfer-encoding') {
      reply.header(key, value);
    }
  }

  if (headerOverrides) {
    for (const [key, value] of Object.entries(headerOverrides)) {
      reply.header(key, value);
    }
  }

  if (response.body) {
    if (rewriteInjectedRuntime) {
      const source = await response.text();
      const scopedSource = source
        .replaceAll(
          '/argon_service_worker.js?proxy_real_protocol=',
          '/ag/argon_service_worker.js?proxy_real_protocol=',
        )
        .replaceAll(
          'new MutationObserver(_0x9e3111)',
          "new MutationObserver((mutations,observer)=>{if(observer.__argonPending)return;observer.__argonPending=true;setTimeout(()=>{observer.__argonPending=false;_0x9e3111(mutations,observer)},32)})",
        )
        .replace(
          'function _0x2f0351(){const',
          'function _0x2f0351(){return;const',
        );
      // TikTok now runs its native interface. The old compatibility client
      // replaced the complete page with a synthetic feed and broke normal
      // navigation, login, profiles, and search.
      const tiktokCompatSource = '';
      reply.removeHeader('content-length');
      reply.removeHeader('content-encoding');
      reply.removeHeader('etag');
      reply.removeHeader('last-modified');
      return reply.send(
        `var __nebuloNativeFetch=window.fetch.bind(window);\nvar __nebuloNativeURL=window.URL;\nvar __nebuloNativeRequest=window.Request;\nvar __nebuloNativeHeaders=window.Headers;\nvar __nebuloNativeXhrOpen=window.XMLHttpRequest&&window.XMLHttpRequest.prototype.open;\nvar __nebuloNativeXhrSend=window.XMLHttpRequest&&window.XMLHttpRequest.prototype.send;\nvar __nebuloNativeXhrSetRequestHeader=window.XMLHttpRequest&&window.XMLHttpRequest.prototype.setRequestHeader;\nvar __nebuloNativeSendBeacon=navigator.sendBeacon?navigator.sendBeacon.bind(navigator):null;\nvar __nebuloNativeEventSource=window.EventSource;\nvar __nebuloNativeWindowPostMessage=window.postMessage;\nvar __nebuloNativeElementSetAttribute=window.Element&&window.Element.prototype.setAttribute;\nvar __nebuloNativeHistoryPushState=window.history&&window.history.pushState;\nvar __nebuloNativeHistoryReplaceState=window.history&&window.history.replaceState;\nvar __nebuloProxyDocumentUrl=document.URL;\nvar __nebuloTikTokRecommend=function(query){var pairs=[];Object.keys(query||{}).forEach(function(key){var value=query[key];if(value===undefined||value===null)return;if(typeof value==='object')value=JSON.stringify(value);pairs.push(encodeURIComponent(key)+'='+encodeURIComponent(String(value)));});var url='/api/recommend/item_list/'+(pairs.length?'?'+pairs.join('&'):'');return __nebuloNativeFetch(url,{cache:'no-store',credentials:'include',headers:{Accept:'application/json'}}).then(function(response){if(!response.ok)throw new Error('TikTok feed request failed: '+response.status);return response.json();});};\nsetTimeout(function(){\n${tiktokCompatSource}\n},0);\n${legacyWorkerRepairScript}\n${scopedSource}\n${argonNetworkRoutingSource}`,
      );
    }
    const contentType = response.headers.get('content-type') || '';
    // NVIDIA's account application is an SPA hosted at accounts.nvgs.nvidia.com.
    // Its bundle is intentionally fetched from login.nvgs.nvidia.com below, but
    // it still reads location.pathname to choose its first route. In a proxy
    // that value includes /ag/https/... and the app concludes that every
    // authorization request is an unknown route. The document removes SRI
    // attributes, so this small, page-script-only rewrite is safe and keeps
    // the original upstream route visible to the account application.
    if (rewriteVirtualLocationReads
      && /javascript|ecmascript/i.test(contentType)
      && !['worker', 'sharedworker', 'serviceworker'].includes(fetchDestination)) {
      const source = await response.text();
      const rewrittenSource = rewriteNvidiaLocationNavigations(rewriteBrowserLocationReads(source));
      if (rewrittenSource !== source) {
        reply.removeHeader('content-length');
        reply.removeHeader('content-encoding');
        reply.removeHeader('etag');
        reply.removeHeader('last-modified');
        return reply.send(rewrittenSource);
      }
      return reply.send(source);
    }
    if (contentType.includes('text/css')) {
      const css = rewriteRootRelativeCssUrls(await response.text(), proxyTarget, tokenPrefix);
      reply.removeHeader('content-length');
      reply.removeHeader('content-encoding');
      reply.removeHeader('etag');
      reply.removeHeader('last-modified');
      return reply
        .header('content-type', contentType)
        .send(css);
    }
    if (contentType.includes('text/html')) {
      reply.header('cache-control', 'no-store');
      reply.removeHeader('etag');
      reply.removeHeader('last-modified');
      reply.removeHeader('content-encoding');
      const html = await response.text();
      const isDeceptiveInstallerPage = /<[^>]+id=["']wrapper["'][^>]+data-area=/i.test(html)
        && /\b(?:Add Extension|Add to Chrome)\b/i.test(html)
        && /\b(?:ad-block|Privacy Policy|browser extension)\b/i.test(html);
      if (isDeceptiveInstallerPage) {
        reply.status(204);
        reply.removeHeader('content-length');
        reply.removeHeader('content-encoding');
        reply.removeHeader('content-type');
        return reply.send();
      }
      let versionedHtml = rewriteCrazyGamesBootstrap(
        rewriteAbsoluteHtmlAttributes(
          rewriteExplicitProxyAssets(html, proxyTarget, tokenPrefix),
          proxyTarget,
          tokenPrefix,
        ),
        proxyTarget,
      )
        .replaceAll('/argon-response-injected.js"', `/argon-runtime/${ARGON_RUNTIME_VERSION}"`)
        .replaceAll("/argon-response-injected.js'", `/argon-runtime/${ARGON_RUNTIME_VERSION}'`);
      versionedHtml = rewriteRootRelativeHtmlAttributes(versionedHtml, proxyTarget, tokenPrefix);
      // Rewritten script bodies cannot satisfy hashes calculated for the
      // original bytes. Leaving SRI in place makes browsers reject valid
      // proxied resources before Argon can execute them.
      versionedHtml = versionedHtml.replace(
        /\s+integrity\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi,
        ''
      );
      // Reverse argon.cjs's overzealous \bdomain\b → ___domain replacement inside
      // <script> tags. This replacement corrupts JSON property keys like "domain"
      // in __NEXT_DATA__ and other inline data, causing "Invalid URL" errors when
      // apps do `new URL(a.domain)`. The other renames (.___URL, ___pushState,
      // etc.) have more specific patterns that don't corrupt JSON data.
      versionedHtml = versionedHtml.replace(
        /(<script\b[^>]*>)([\s\S]*?)(<\/script>)/gi,
        (match, open, body, close) => open + body
          .replace(/\b___domain\b/g, 'domain')
          .replace(/\b___pushState\b/g, 'pushState')
          .replace(/\b___replaceState\b/g, 'replaceState')
          + close
      );
      // Inject the CrazyGames navigation fallback and iframe observer.
      // Blind string-replacement of upstream URLs (e.g. games.crazygames.com)
      // corrupts inline <script>/JSON data and causes "Invalid URL" errors when
      // the app does `new URL(...)`. Instead, the MutationObserver rewrites
      // iframe src attributes dynamically at runtime, and navigation clicks
      // are intercepted by the fallback handler.
      if (/<html/i.test(versionedHtml) && !versionedHtml.includes('data-nebulo-navigation-containment')) {
        const responseHost = String(proxyTarget?.host || '').toLowerCase();
        const isCrazyGamesGameDocument = responseHost.endsWith('.game-files.crazygames.com');
        const isCrazyGamesPortalDocument = responseHost === 'crazygames.com'
          || responseHost === 'www.crazygames.com'
          || responseHost === 'games.crazygames.com';
        const isCrazyGamesTopDocument = responseHost === 'crazygames.com'
          || responseHost === 'www.crazygames.com';
        const isYouTubeDocument = /(?:^|\.)(?:youtube\.com|youtu\.be)$/i.test(responseHost);
        const isTikTokDocument = /^(?:www\.)?tiktok\.com$/i.test(responseHost);
        const tiktokFastFeedClient = isTikTokDocument
          ? `<script data-nebulo-tiktok-fast-feed>${TIKTOK_FAST_FEED_SOURCE}</script>`
          : '';
        if (tiktokFastFeedClient && !versionedHtml.includes('data-nebulo-tiktok-fast-feed')) {
          // Start the cached feed before TikTok's large blocking bundle graph.
          // The client waits for <body>, so it is safe to install first in head.
          versionedHtml = versionedHtml.replace(/<head(\s[^>]*)?>/i, (head) => `${head}${tiktokFastFeedClient}`);
        }
        const injectedClientScripts = (isCrazyGamesGameDocument ? '' : optionalAdSdkFallbackClient + gameAdBypassClient + adBlockClient)
          + (isCrazyGamesPortalDocument ? crazyGamesIframeObserver : '')
          + (isCrazyGamesTopDocument ? crazyGamesNavigationFallback : '')
          + (isYouTubeDocument ? youtubeNavigationHandoff : '')
          + (isCrazyGamesGameDocument ? '' : navigationContainmentClient);
        versionedHtml = versionedHtml.includes('</head>')
          ? versionedHtml.replace('</head>', injectedClientScripts + '</head>')
          : injectedClientScripts + versionedHtml;
      }
      const virtualLocationBootstrap = buildVirtualLocationBootstrap(proxyTarget, tokenPrefix);
      if (virtualLocationBootstrap && !versionedHtml.includes('data-nebulo-virtual-location')) {
        versionedHtml = versionedHtml.replace(/<head(\s[^>]*)?>/i, (head) => `${head}${virtualLocationBootstrap}`);
      }
      const nvidiaLoginBaseGuard = buildNvidiaLoginBaseGuard(proxyTarget, tokenPrefix);
      if (nvidiaLoginBaseGuard && !versionedHtml.includes('data-nebulo-nvidia-base-guard')) {
        versionedHtml = versionedHtml.replace(/<head(\s[^>]*)?>/i, (head) => `${head}${nvidiaLoginBaseGuard}`);
      }
      const geForceNowCompatibilityGuard = buildGeForceNowCompatibilityGuard(proxyTarget, tokenPrefix);
      if (geForceNowCompatibilityGuard && !versionedHtml.includes('data-nebulo-geforce-now-compat')) {
        // Remove GFN's stale page-controlled cache before it can pair an old
        // HTML shell with a new NVIDIA-signed bundle.
        versionedHtml = versionedHtml.includes('</head>')
          ? versionedHtml.replace('</head>', `${geForceNowCompatibilityGuard}</head>`)
          : `${geForceNowCompatibilityGuard}${versionedHtml}`;
      }
      const nvidiaFrameContainmentGuard = buildNvidiaFrameContainmentGuard(proxyTarget, tokenPrefix);
      if (nvidiaFrameContainmentGuard && !versionedHtml.includes('data-nebulo-nvidia-frame-containment')) {
        versionedHtml = versionedHtml.includes('</head>')
          ? versionedHtml.replace('</head>', `${nvidiaFrameContainmentGuard}</head>`)
          : `${nvidiaFrameContainmentGuard}${versionedHtml}`;
      }
      reply.removeHeader('content-length');
      return reply.send(versionedHtml);
    }
    const crazyGamesScriptLength = Number(response.headers.get('content-length') || 0);
    if (/javascript/i.test(contentType)
      && String(proxyTarget?.host || '').toLowerCase().endsWith('.game-files.crazygames.com')
      && (!crazyGamesScriptLength || crazyGamesScriptLength <= 512_000)) {
      const source = rewriteCrazyGamesBootstrap(await response.text(), proxyTarget);
      reply.removeHeader('content-length');
      reply.removeHeader('content-encoding');
      reply.removeHeader('etag');
      reply.removeHeader('last-modified');
      return reply.send(source);
    }
    const genericScriptLength = Number(response.headers.get('content-length') || 0);
    const isNvidiaSignedRuntime = /(?:^|\.)(?:geforcenow\.com|nvgs\.nvidia\.com)$/i.test(
      String(proxyTarget?.host || ''),
    );
    // GeForce NOW and NVIDIA Sign In protect their runtime chunks with SRI.
    // Any source rewrite changes the digest and makes Chromium block the
    // bundle before the client can reach its login/session flow.
    if (/javascript|ecmascript/i.test(contentType) && isNvidiaSignedRuntime) {
      return reply.send(Readable.fromWeb(response.body));
    }
    if (/javascript|ecmascript/i.test(contentType)
      && (!genericScriptLength || genericScriptLength <= 6 * 1024 * 1024)) {
      const source = await response.text();
      // A service worker has no window object. Rewriting `location` reads in
      // its source turns valid worker code into `window.__nebulo…` accesses,
      // which is exactly what made GeForce NOW's gfn-service-worker crash on
      // every request. Page scripts still receive the virtual-location layer.
      const isWorkerScript = ['worker', 'sharedworker', 'serviceworker'].includes(fetchDestination);
      const preparedSource = proxyTarget?.resourcePath?.includes('/_next/')
        ? rewriteExplicitProxyAssets(source, proxyTarget, tokenPrefix)
        : source;
      const isTikTokPageBundle = /(?:^|\.)(?:tiktok\.com|tiktokcdn-us\.com|tiktokv\.com|tiktokv\.us|tiktokw\.us)$/i.test(
        String(proxyTarget?.host || '').split(':')[0],
      );
      const rewrittenSource = isWorkerScript
        ? preparedSource
        : rewriteBrowserLocationReads(preparedSource, isTikTokPageBundle);
      if (rewrittenSource !== source) {
        reply.removeHeader('content-length');
        reply.removeHeader('content-encoding');
        reply.removeHeader('etag');
        reply.removeHeader('last-modified');
        return reply.send(rewrittenSource);
      }
      return reply.send(source);
    }
    if (/javascript|text\/css/i.test(contentType) && proxyTarget?.resourcePath?.includes('/_next/')) {
      const source = await response.text();
      const rewrittenSource = rewriteExplicitProxyAssets(source, proxyTarget, tokenPrefix);
      reply.removeHeader('content-length');
      reply.removeHeader('content-encoding');
      return reply.send(rewrittenSource);
    }
    if (/application\/json/i.test(contentType)
      && /(?:^|\.)(?:tiktok\.com|tiktokv\.com|tiktokv\.us|tiktokw\.us)$/i.test(proxyTarget?.host || '')) {
      const body = Buffer.from(await response.arrayBuffer());
      reply.removeHeader('content-length');
      reply.removeHeader('content-encoding');
      reply.removeHeader('transfer-encoding');
      return reply.send(body);
    }
    if (/javascript/i.test(contentType)
      && /(?:^|\.)tiktokcdn-us\.com$/i.test(proxyTarget?.host || '')
      && /\/atom\.init\.[^/]+\.js$/i.test(proxyTarget?.resourcePath || '')) {
      const source = await response.text();
      // TikTok's desktop prefetch cache can exist while resolving to undefined
      // through a proxy. Bypass both stale cache branches so its native feed
      // service performs the signed recommendation request instead.
      const patchedSource = patchTikTokAtomSource(source);
      reply.header('cache-control', 'no-store');
      reply.removeHeader('etag');
      reply.removeHeader('last-modified');
      reply.removeHeader('content-length');
      reply.removeHeader('content-encoding');
      return reply.send(patchedSource);
    }
    if (/javascript/i.test(contentType)
      && proxyTarget?.host?.toLowerCase() === 'ei.phncdn.com'
      && /\/ph-footer\.js$/i.test(proxyTarget.resourcePath || '')) {
      const source = await response.text();
      const patchedSource = source.replace(
        /top===self\|\|top\.location\.href\.match\([^;]+top\.location\.href=self\.location\.href\);/,
        'top===self;'
      );
      reply.removeHeader('content-length');
      reply.removeHeader('content-encoding');
      return reply.send(patchedSource);
    }
    if (/javascript/i.test(contentType)) {
      const source = await response.text();
      // Argon's generic transformer renames History methods in external
      // bundles, but modern apps often capture them before its compatibility
      // runtime initializes. Restore the native names in the response body.
      const patchedSource = source
        .replace(/\b___pushState\b/g, 'pushState')
        .replace(/\b___replaceState\b/g, 'replaceState');
      reply.removeHeader('content-length');
      reply.removeHeader('content-encoding');
      return reply.send(patchedSource);
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
function toFetchRequest(request, urlOverride, proxyTarget = null) {
  const host = request.headers.host || 'localhost';
  const requestUrl = typeof urlOverride === 'string' ? urlOverride : request.url;
  const url = `${request.protocol || 'http'}://${host}${requestUrl}`;

  const init = {
    method: request.method,
    headers: new Headers(request.headers),
  };
  sanitizeProxyRequestCookies(init.headers, proxyTarget);

  // ── Browser-mimicking headers (siteproxy-style) ────────────────────────
  // Cloudflare, Akamai, and other CDNs fingerprint proxy traffic by missing
  // or unusual browser headers. Supplying a realistic set dramatically
  // reduces blocks.
  init.headers.set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36');
  const incomingDestination = String(init.headers.get('sec-fetch-dest') || '').toLowerCase();
  if (incomingDestination === 'document' || incomingDestination === 'iframe') {
    init.headers.set('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7');
  } else if (!init.headers.has('Accept')) {
    init.headers.set('Accept', '*/*');
  }
  init.headers.set('Accept-Language', 'en-US,en;q=0.9');
  init.headers.set('Accept-Encoding', 'gzip, deflate, br');
  init.headers.set('sec-ch-ua', '"Chromium";v="131", "Not_A Brand";v="24", "Google Chrome";v="131"');
  init.headers.set('sec-ch-ua-mobile', '?0');
  init.headers.set('sec-ch-ua-platform', '"Windows"');
  // Preserve original sec-fetch-* headers when the browser sends them;
  // only supply defaults when they're completely absent.
  if (!init.headers.has('sec-fetch-site') && !init.headers.has('Sec-Fetch-Site')) {
    init.headers.set('sec-fetch-site', 'cross-site');
  }
  if (!init.headers.has('sec-fetch-mode') && !init.headers.has('Sec-Fetch-Mode')) {
    init.headers.set('sec-fetch-mode', 'navigate');
  }
  if (!init.headers.has('sec-fetch-dest') && !init.headers.has('Sec-Fetch-Dest')) {
    init.headers.set('sec-fetch-dest', 'document');
  }
  
  // Remove headers that may trigger blocks or leak origin
  init.headers.delete('x-forwarded-for');
  init.headers.delete('x-forwarded-proto');
  init.headers.delete('x-forwarded-host');
  init.headers.delete('cf-ray');
  init.headers.delete('cf-connecting-ip');
  init.headers.delete('x-real-ip');
  init.headers.delete('cdn-loop');
  init.headers.delete('cf-worker');
  
  // Add proper origin/referer for YouTube requests
  let targetHost = '';
  try {
    const target = extractProxyTargetFromRequestUrl(requestUrl, globalThis.token_prefix || '/ag/');
    targetHost = (target?.host || new URL(url).hostname).split(':')[0].toLowerCase();
  } catch {}
  const isYouTubeRequest = targetHost === 'youtube.com'
    || targetHost.endsWith('.youtube.com')
    || targetHost === 'googlevideo.com'
    || targetHost.endsWith('.googlevideo.com')
    || targetHost === 'ytimg.com'
    || targetHost.endsWith('.ytimg.com')
    || targetHost === 'ggpht.com'
    || targetHost.endsWith('.ggpht.com')
    || targetHost === 'googleapis.com'
    || targetHost.endsWith('.googleapis.com');
  if (isYouTubeRequest) {
    // The browser's original headers refer to localhost/Argon. YouTube's
    // JSON APIs reject that cross-origin identity instead of treating it as a
    // normal anonymous web session.
    init.headers.set('origin', 'https://www.youtube.com');
    init.headers.set('referer', 'https://www.youtube.com/');
    init.headers.set('x-origin', 'https://www.youtube.com');
    init.headers.delete('argon-newreferer');
    init.headers.delete('argon-real-referer');
    if (incomingDestination !== 'document' && incomingDestination !== 'iframe') {
      init.headers.set('sec-fetch-site', 'same-origin');
    }
  }

  const isTikTokRequest = targetHost === 'tiktok.com'
    || targetHost.endsWith('.tiktok.com')
    || targetHost === 'tiktokv.com'
    || targetHost.endsWith('.tiktokv.com')
    || targetHost === 'tiktokv.us'
    || targetHost.endsWith('.tiktokv.us')
    || targetHost === 'tiktokcdn-us.com'
    || targetHost.endsWith('.tiktokcdn-us.com')
    || targetHost.endsWith('.byteoversea.com')
    || targetHost.endsWith('.ibyteimg.com');
  if (isTikTokRequest && incomingDestination !== 'document' && incomingDestination !== 'iframe') {
    init.headers.set('Origin', 'https://www.tiktok.com');
    init.headers.set('Referer', 'https://www.tiktok.com/');
    init.headers.set('Sec-Fetch-Site', targetHost.endsWith('.tiktok.com') ? 'same-site' : 'cross-site');
  }
  if (isTikTokRequest) {
    init.headers.set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36');
    init.headers.set('Sec-CH-UA', '"Chromium";v="131", "Not_A Brand";v="24", "Google Chrome";v="131"');
    init.headers.set('Sec-CH-UA-Mobile', '?0');
    init.headers.set('Sec-CH-UA-Platform', '"Windows"');
  }

  const isCinebyStreamCdn = targetHost === 'ironwallnet.net'
    || targetHost.endsWith('.ironwallnet.net')
    || targetHost === 'emberforge.site'
    || targetHost.endsWith('.emberforge.site');
  if (isCinebyStreamCdn) {
    // Ironwall rejects Videasy's hotlink referrer even though Cineby selected
    // the source. Remove Argon's internal override so it cannot restore that
    // referrer after these streaming headers are normalized.
    for (const header of [
      'argon-newreferer',
      'argon-real-referer',
      'argon-target-host',
      'argon-target-protocol',
      'argon-window-location-pathname',
    ]) {
      init.headers.delete(header);
    }
    init.headers.set('Origin', 'https://www.cineby.at');
    init.headers.set('Referer', 'https://www.cineby.at/');
    init.headers.set('Sec-Fetch-Dest', 'empty');
    init.headers.set('Sec-Fetch-Mode', 'cors');
    init.headers.set('Sec-Fetch-Site', 'cross-site');
    if (/\.m3u8(?:$|\?)/i.test(requestUrl)) {
      init.headers.set('Accept', 'application/vnd.apple.mpegurl, application/x-mpegURL, */*');
    }
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

function extractProxyContextFromHeaders(request) {
  const protocol = String(request.headers['argon-target-protocol'] || '').toLowerCase();
  const host = String(request.headers['argon-target-host'] || '').toLowerCase();
  if (!['http', 'https'].includes(protocol)) return null;
  if (!/^[a-z0-9.-]+(?::\d{1,5})?$/i.test(host)) return null;
  return { protocol, host };
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

  if (pathname.startsWith('/argon-runtime/')) {
    return requestUrl.replace(/^\/argon-runtime\/[^/?]+/, '/argon-response-injected.js');
  }

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

  const context = extractProxyContextFromReferer(request, normalizedPrefix)
    || extractProxyContextFromHeaders(request)
    || extractProxyContextFromCookies(request);
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
  const normalizedPrefix = tokenPrefix.endsWith('/') ? tokenPrefix : `${tokenPrefix}/`;
  const safePath = resourcePath && resourcePath.startsWith('/') ? resourcePath : `/${resourcePath || ''}`;
  return `${normalizedPrefix}${context.protocol}/${context.host}${safePath}${search || ''}${hash || ''}`;
}

function normalizeNestedProxyUrl(requestUrl, tokenPrefix) {
  const normalizedPrefix = tokenPrefix.endsWith('/') ? tokenPrefix : `${tokenPrefix}/`;
  let normalized = String(requestUrl || '/');

  // A proxied page can hand Argon a URL that Argon already encoded. Always
  // keep the innermost proxy target instead of treating `/ag/...` as part of
  // the remote site's pathname.
  for (let depth = 0; depth < 8; depth += 1) {
    const target = extractProxyTargetFromRequestUrl(normalized, normalizedPrefix);
    if (!target || !target.resourcePath.startsWith(normalizedPrefix)) break;
    normalized = `${target.resourcePath}${target.search || ''}`;
  }

  return normalized;
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
    }, locationUrl.pathname, locationUrl.search, tokenPrefix, locationUrl.hash);
  } catch {
    if (location.startsWith('http/') || location.startsWith('https/')) {
      return `/${location}`;
    }
    return null;
  }
}

function rewriteNvidiaAuthorizeRedirectUri(proxyUrl, target, tokenPrefix) {
  const host = String(target?.host || '').toLowerCase().split(':')[0];
  if (host !== 'login.nvidia.com' || target?.resourcePath !== '/authorize') return proxyUrl;

  const params = new URLSearchParams(target.search || '');
  const suppliedRedirectUri = params.get('redirect_uri');
  if (!suppliedRedirectUri) return proxyUrl;

  try {
    const callback = new URL(suppliedRedirectUri);
    const isLocalCallback = /^(?:localhost|127\.0\.0\.1|0\.0\.0\.0)$/i.test(callback.hostname);
    const isGeforceNowCallback = /\/redirect\/starfleet-oauth-redirect\.html$/i.test(callback.pathname);
    if (!isLocalCallback || !isGeforceNowCallback) return proxyUrl;

    // NVIDIA only accepts its registered GFN callback. The response itself
    // still returns through Argon because the resulting redirect is rewritten
    // by rewriteRedirectLocation before it reaches the browser.
    params.set(
      'redirect_uri',
      `https://play.geforcenow.com${callback.pathname}${callback.search}${callback.hash}`,
    );
    const prefix = tokenPrefix.endsWith('/') ? tokenPrefix : `${tokenPrefix}/`;
    return `${prefix}${target.protocol}/${target.host}${target.resourcePath}?${params.toString()}`;
  } catch {
    return proxyUrl;
  }
}

function normalizeSpecialProxyUrl(requestUrl, tokenPrefix) {
  const currentTarget = extractProxyTargetFromRequestUrl(requestUrl, tokenPrefix);
  if (!currentTarget) return requestUrl;

  const targetHost = currentTarget.host.toLowerCase().split(':')[0];
  if ((targetHost === 'localhost' || targetHost === '127.0.0.1')
    && currentTarget.resourcePath.startsWith('/obj/static-tx/slardar/')) {
    return buildProxyUrlForContext({
      protocol: 'https',
      host: 'lf16-tiktok-web.tiktokcdn-us.com',
    }, currentTarget.resourcePath, currentTarget.search, tokenPrefix);
  }

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

const CRAZY_GAMES_FAST_ASSET_PATTERN = /\.(?:wasm|data|unityweb|bundle|bin|mem|pak|br|gz|zip|ktx2|basis|mp3|ogg|wav|m4a|mp4|webm|png|jpe?g|webp|gif|svg|ico|ttf|otf|woff2?)(?:$|\?)/i;
const AUDIOMACK_STATIC_ASSET_PATTERN = /\.(?:js|mjs|css|json|png|jpe?g|webp|gif|svg|ico|woff2?|ttf|otf)(?:$|\?)/i;
const AUDIOMACK_MEDIA_ASSET_PATTERN = /\.(?:mp3|m4a|aac|ogg|opus|wav|flac|mp4|webm|m3u8|m4s|ts)(?:$|\?)/i;
const NVIDIA_SIGNED_RUNTIME_PATTERN = /\.(?:js|mjs)(?:$|\?)/i;
const NVIDIA_LOGIN_STATIC_PATTERN = /\.(?:js|mjs|css|json|png|jpe?g|webp|gif|svg|ico|woff2?|ttf|otf)(?:$|\?)/i;

function isCrazyGamesFastAsset(request, proxyTarget) {
  if (request.method !== 'GET' && request.method !== 'HEAD') return false;
  const host = String(proxyTarget?.host || '').toLowerCase();
  const isGameCdn = host.endsWith('.game-files.crazygames.com')
    || host === 'files.crazygames.com';
  return isGameCdn && CRAZY_GAMES_FAST_ASSET_PATTERN.test(proxyTarget?.resourcePath || '');
}

function isNvidiaSignedRuntimeAsset(request, proxyTarget) {
  if (request.method !== 'GET' && request.method !== 'HEAD') return false;
  const host = String(proxyTarget?.host || '').toLowerCase().split(':')[0];
  const isNvidiaRuntimeHost = host === 'geforcenow.com'
    || host.endsWith('.geforcenow.com')
    || host === 'login.nvidia.com'
    || host === 'nvgs.nvidia.com'
    || host.endsWith('.nvgs.nvidia.com');
  return isNvidiaRuntimeHost && NVIDIA_SIGNED_RUNTIME_PATTERN.test(proxyTarget?.resourcePath || '');
}

function nvidiaLoginStaticAssetTarget(request, proxyTarget) {
  if (request.method !== 'GET' && request.method !== 'HEAD') return null;
  const host = String(proxyTarget?.host || '').toLowerCase().split(':')[0];
  const resourcePath = String(proxyTarget?.resourcePath || '');
  if (!NVIDIA_LOGIN_STATIC_PATTERN.test(resourcePath)) {
    return null;
  }

  if (host === 'accounts.nvgs.nvidia.com') {
    // The account authorization URL renders NVIDIA's shared identity shell,
    // but that shell's Angular bundles are published on the login host rather
    // than on accounts. Preserve the browser's account URL/cookies while
    // fetching the exact bundle bytes from their canonical host.
    return {
      ...proxyTarget,
      host: 'login.nvgs.nvidia.com',
    };
  }

  if (host !== 'login.nvgs.nvidia.com' && host !== 'login.nvidia.com') {
    return null;
  }

  if (host === 'login.nvidia.com' || !resourcePath.startsWith('/v1/')) {
    // Identity runtime chunks at the root still need the small navigation
    // rewrite above, even when their upstream and browser-visible host match.
    return { ...proxyTarget };
  }

  // NVIDIA's sign-in HTML is served from /v1/login, but its Angular bundles
  // and images are published at the host root. A transformed base URL can
  // leave /v1/ in those resource requests; NVIDIA responds with the login
  // HTML (status 200) instead of a useful 404. Preserve the browser-visible
  // URL but fetch the canonical upstream asset path.
  return {
    ...proxyTarget,
    resourcePath: resourcePath.slice(3),
  };
}

function isAudiomackStaticAsset(request, proxyTarget) {
  if (request.method !== 'GET' && request.method !== 'HEAD') return false;
  const host = String(proxyTarget?.host || '').toLowerCase().split(':')[0];
  const resourcePath = String(proxyTarget?.resourcePath || '');
  return (host === 'audiomack.com' || host.endsWith('.audiomack.com'))
    && (resourcePath.startsWith('/_next/static/') || resourcePath.startsWith('/images/') || resourcePath === '/manifest.json')
    && AUDIOMACK_STATIC_ASSET_PATTERN.test(resourcePath);
}

function isAudiomackHost(host) {
  const cleanHost = String(host || '').toLowerCase().split(':')[0];
  return cleanHost === 'audiomack.com' || cleanHost.endsWith('.audiomack.com');
}

function isAudiomackApiRequest(request, proxyTarget) {
  const method = String(request.method || '').toUpperCase();
  const host = String(proxyTarget?.host || '').toLowerCase().split(':')[0];
  return host === 'api.audiomack.com'
    && (method === 'GET' || method === 'HEAD' || method === 'POST')
    && String(proxyTarget?.resourcePath || '').startsWith('/v1/');
}

function isAudiomackMediaRequest(request, proxyTarget) {
  const method = String(request.method || '').toUpperCase();
  if (method !== 'GET' && method !== 'HEAD') return false;
  const resourcePath = String(proxyTarget?.resourcePath || '');
  return isAudiomackHost(proxyTarget?.host)
    && (AUDIOMACK_MEDIA_ASSET_PATTERN.test(resourcePath)
      || resourcePath.startsWith('/stream/')
      || resourcePath.startsWith('/streams/')
      || resourcePath.startsWith('/audio/')
      || resourcePath.startsWith('/media/'));
}

function isAudiomackDirectRequest(request, proxyTarget) {
  return isAudiomackApiRequest(request, proxyTarget) || isAudiomackMediaRequest(request, proxyTarget);
}

function toArgonProxyUrl(value, tokenPrefix) {
  try {
    const url = new URL(String(value || ''));
    if (!isAudiomackHost(url.host)) return value;
    if (!isAudiomackMediaRequest({ method: 'GET' }, {
      host: url.host,
      resourcePath: url.pathname,
    }) && url.host.toLowerCase().split(':')[0] !== 'music.audiomack.com') {
      return value;
    }
    const normalizedPrefix = tokenPrefix.endsWith('/') ? tokenPrefix : `${tokenPrefix}/`;
    return `${normalizedPrefix}${url.protocol.slice(0, -1)}/${url.host}${url.pathname}${url.search}${url.hash}`;
  } catch (_) {
    return value;
  }
}

function rewriteAudiomackMediaUrls(value, tokenPrefix, state = { changed: false }) {
  if (typeof value === 'string') {
    const rewritten = toArgonProxyUrl(value, tokenPrefix);
    if (rewritten !== value) state.changed = true;
    return rewritten;
  }
  if (Array.isArray(value)) {
    return value.map((item) => rewriteAudiomackMediaUrls(item, tokenPrefix, state));
  }
  if (value && typeof value === 'object') {
    for (const key of Object.keys(value)) {
      value[key] = rewriteAudiomackMediaUrls(value[key], tokenPrefix, state);
    }
  }
  return value;
}

async function rewriteAudiomackApiResponse(response, proxyTarget, tokenPrefix) {
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) return response;
  const resourcePath = String(proxyTarget?.resourcePath || '');
  if (!resourcePath.startsWith('/v1/music/play/')) return response;

  let parsed;
  try {
    parsed = JSON.parse(await response.text());
  } catch (_) {
    return response;
  }

  const state = { changed: false };
  const rewritten = rewriteAudiomackMediaUrls(parsed, tokenPrefix, state);
  if (!state.changed) return new Response(JSON.stringify(parsed), {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  });

  const headers = new Headers(response.headers);
  headers.delete('content-length');
  headers.delete('content-encoding');
  headers.delete('etag');
  headers.set('content-type', contentType);
  headers.set('cache-control', 'no-store');
  return new Response(JSON.stringify(rewritten), {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function encodeUpstreamPathPreservingEscapes(resourcePath) {
  return String(resourcePath || '/')
    .split('/')
    .map((segment) => segment.replace(/%[0-9a-f]{2}|[^%]+/gi, (part) => (
      part.startsWith('%') ? part : encodeURIComponent(part)
    )))
    .join('/');
}

async function fetchDirectStaticAsset(request, proxyTarget, refererHost = proxyTarget?.host, options = {}) {
  const resourcePath = options.encodePath
    ? encodeUpstreamPathPreservingEscapes(proxyTarget.resourcePath || '/')
    : (proxyTarget.resourcePath || '/');
  const upstreamUrl = `${proxyTarget.protocol}://${proxyTarget.host}`
    + `${resourcePath}${proxyTarget.search || ''}`;
  const headers = new Headers();
  const forwardedHeaders = [
    'accept',
    'accept-language',
    'cache-control',
    'if-match',
    'if-modified-since',
    'if-none-match',
    'if-range',
    'range',
    // YouTube compresses larger Innertube POST bodies in the browser. Keep
    // this paired with the raw Buffer below; forwarding a gzip body without
    // its encoding makes the upstream close the request and Chromium reports
    // the local proxy fetch as ERR_ALPN_NEGOTIATION_FAILED.
    'content-encoding',
    'content-type',
    'x-youtube-client-name',
    'x-youtube-client-version',
    'x-youtube-page-cl',
    'x-youtube-page-label',
  ];
  if (options.forwardCredentials) {
    forwardedHeaders.push(
      'authorization',
      'sec-ch-ua',
      'sec-ch-ua-mobile',
      'sec-ch-ua-platform',
      'x-api-key',
      'x-correlation-id',
      'x-csrf-token',
      'x-gorgon',
      'x-goog-authuser',
      'x-goog-logged-in',
      'x-goog-pageid',
      'x-goog-visitor-id',
      'x-khronos',
      'x-origin',
      'x-request-id',
      'x-secsdk-csrf-token',
      'x-tt-logid',
      'x-tt-token',
      'x-xsrf-token',
      'x-youtube-identity-token',
      'x-youtube-device',
    );
  }
  for (const name of forwardedHeaders) {
    const value = request.headers[name];
    if (value !== undefined) headers.set(name, Array.isArray(value) ? value.join(', ') : String(value));
  }
  if (!headers.has('accept')) headers.set('accept', '*/*');
  if (options.forwardCredentials) {
    const browserHeaders = new Headers(request.headers);
    sanitizeProxyRequestCookies(browserHeaders, proxyTarget);
    const cookie = browserHeaders.get('cookie');
    if (cookie) headers.set('cookie', cookie);
    headers.set('sec-fetch-dest', String(request.headers['sec-fetch-dest'] || 'empty'));
    headers.set('sec-fetch-mode', String(request.headers['sec-fetch-mode'] || 'cors'));
    headers.set('sec-fetch-site', options.fetchSite || 'same-site');
  }
  headers.set('accept-encoding', 'identity');
  headers.set('user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36');
  if (refererHost) headers.set('referer', `https://${refererHost}/`);
  if (options.origin) headers.set('origin', options.origin);
  if (options.referer) headers.set('referer', options.referer);

  let outboundBody = options.body === undefined ? request.body : options.body;
  const requestEncoding = String(headers.get('content-encoding') || '').trim().toLowerCase();
  if (outboundBody?.length && requestEncoding) {
    try {
      if (requestEncoding === 'gzip' || requestEncoding === 'x-gzip') {
        outboundBody = gunzipSync(outboundBody);
      } else if (requestEncoding === 'deflate') {
        outboundBody = inflateSync(outboundBody);
      } else if (requestEncoding === 'br') {
        outboundBody = brotliDecompressSync(outboundBody);
      }
      // Native fetch calculates the new Content-Length. Sending plain JSON
      // with the browser's old compression metadata causes YouTube's edge to
      // leave the request open until Chromium gives up on the local stream.
      headers.delete('content-encoding');
    } catch (_) {
      // Some Chromium paths expose an already-decoded Buffer while retaining
      // Content-Encoding on the local request. JSON/form bodies are plainly
      // identifiable; remove the stale header instead of making the upstream
      // wait for a gzip stream that will never arrive.
      const contentType = String(headers.get('content-type') || '').toLowerCase();
      const leadingByte = Buffer.from(outboundBody).find((byte) => ![9, 10, 13, 32].includes(byte));
      const isPlainStructuredBody = /json|text|form-urlencoded/.test(contentType)
        && (leadingByte === 0x7b || leadingByte === 0x5b || leadingByte === 0x2d || leadingByte === 0x25);
      if (isPlainStructuredBody) headers.delete('content-encoding');
    }
  } else if (requestEncoding && !outboundBody?.length) {
    headers.delete('content-encoding');
  }

  const init = {
    method: request.method,
    headers,
    redirect: options.redirect || 'follow',
  };
  if (outboundBody && outboundBody.length > 0 && request.method !== 'GET' && request.method !== 'HEAD') {
    init.body = outboundBody;
    init.duplex = 'half';
  }
  return fetch(upstreamUrl, init);
}

async function fetchCrazyGamesFastAsset(request, proxyTarget) {
  return fetchDirectStaticAsset(request, proxyTarget, proxyTarget.host);
}

async function fetchAudiomackDirectResource(request, proxyTarget) {
  return fetchDirectStaticAsset(request, proxyTarget, 'audiomack.com', {
    encodePath: true,
    origin: 'https://audiomack.com',
    referer: 'https://audiomack.com/',
  });
}

function isTikTokRecommendationRequest(request, proxyTarget) {
  const method = String(request.method || '').toUpperCase();
  const host = String(proxyTarget?.host || '').toLowerCase().split(':')[0];
  return (method === 'GET' || method === 'POST')
    && (host === 'tiktok.com' || host === 'www.tiktok.com')
    && (proxyTarget?.resourcePath === '/api/recommend/item_list/'
      || proxyTarget?.resourcePath === '/api/preload/item_list/');
}

async function fetchTikTokRecommendationDirect(request, proxyTarget) {
  // TikTok's signed FYP call is JSON, not a document. Sending it through the
  // generic rewriter can occasionally lose its HTTP/2 session and surface in
  // Chromium as ERR_ALPN_NEGOTIATION_FAILED. Preserve its method, body, and
  // scoped cookies through Node's native HTTPS transport instead.
  return fetchDirectStaticAsset(request, proxyTarget, 'www.tiktok.com', {
    forwardCredentials: true,
    fetchSite: 'same-origin',
    origin: 'https://www.tiktok.com',
    referer: 'https://www.tiktok.com/foryou?lang=en',
  });
}

function isYouTubeInnertubeRequest(request, proxyTarget) {
  const method = String(request.method || '').toUpperCase();
  const host = String(proxyTarget?.host || '').toLowerCase().split(':')[0];
  const resourcePath = String(proxyTarget?.resourcePath || '');
  return ['GET', 'POST'].includes(method)
    && (host === 'youtube.com' || host === 'www.youtube.com' || host === 'm.youtube.com')
    && resourcePath.startsWith('/youtubei/v1/');
}

async function fetchYouTubeInnertubeDirect(request, proxyTarget) {
  // youtubei is a signed JSON API. Treating it as a document-rewrite request
  // leaves local proxy Origin/Referer headers in place and can make YouTube
  // mark a healthy session as offline. The visitor data, request context, and
  // identity headers are a matched set, so forward all of them unchanged.
  if (ARGON_DEBUG) {
    const body = Buffer.isBuffer(request.body) ? request.body : Buffer.from(request.body || '');
    console.log(`[argon] youtubei direct ${proxyTarget.resourcePath} body=${body.length} encoding=${request.headers['content-encoding'] || 'identity'} magic=${body.subarray(0, 2).toString('hex')}`);
  }
  const response = await fetchDirectStaticAsset(request, proxyTarget, 'www.youtube.com', {
    forwardCredentials: true,
    fetchSite: 'same-origin',
    origin: 'https://www.youtube.com',
    referer: 'https://www.youtube.com/',
    body: request.body,
  });
  if (ARGON_DEBUG) console.log(`[argon] youtubei direct ${proxyTarget.resourcePath} -> ${response.status}`);
  return response;
}

async function addYouTubePlaybackFallback(response, request, proxyOrigin) {
  const resourceType = String(response.headers.get('content-type') || '').toLowerCase();
  if (!resourceType.includes('application/json')) return response;

  let source = '';
  let payload;
  try {
    source = await response.text();
    payload = JSON.parse(source);
  } catch {
    const headers = new Headers(response.headers);
    headers.delete('content-length');
    headers.delete('content-encoding');
    return new Response(source, { status: response.status, statusText: response.statusText, headers });
  }

  const originalJsonResponse = () => {
    const headers = new Headers(response.headers);
    headers.delete('content-length');
    headers.delete('content-encoding');
    return new Response(JSON.stringify(payload), {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  };

  const existingStatus = String(payload?.playabilityStatus?.status || '').toUpperCase();
  if (existingStatus === 'OK' && payload?.streamingData) return originalJsonResponse();

  let requestPayload = null;
  try {
    const rawBody = request.body;
    requestPayload = JSON.parse(Buffer.isBuffer(rawBody) ? rawBody.toString('utf8') : String(rawBody || ''));
  } catch {}
  const videoId = String(requestPayload?.videoId || payload?.videoDetails?.videoId || '').trim();
  if (!/^[A-Za-z0-9_-]{11}$/.test(videoId) || !payload?.videoDetails) return originalJsonResponse();

  const headers = new Headers(response.headers);
  headers.delete('content-length');
  headers.delete('content-encoding');
  headers.set('content-type', 'application/json; charset=UTF-8');
  headers.set('cache-control', 'no-store');
  headers.set('x-nebulo-youtube-playback', 'dash-fallback');

  payload.playabilityStatus = {
    status: 'OK',
    playableInEmbed: true,
    miniplayer: { miniplayerRenderer: { playbackMode: 'PLAYBACK_MODE_ALLOW' } },
    contextParams: payload?.playabilityStatus?.contextParams || '',
  };
  payload.streamingData = {
    expiresInSeconds: '300',
    dashManifestUrl: `${String(proxyOrigin || '').replace(/\/$/, '')}/api/youtube/manifest/${videoId}.mpd`,
  };

  return new Response(JSON.stringify(payload), {
    status: 200,
    statusText: 'OK',
    headers,
  });
}

function isNvidiaAccountApiRequest(request, proxyTarget) {
  const method = String(request.method || '').toUpperCase();
  const host = String(proxyTarget?.host || '').toLowerCase().split(':')[0];
  return host === 'accounts.nvgs.nvidia.com'
    && String(proxyTarget?.resourcePath || '').startsWith('/api/')
    && ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'].includes(method);
}

function nvidiaAccountApiReferer(request) {
  const candidate = String(
    request.headers['argon-newreferer']
      || request.headers['argon-real-referer']
      || '',
  ).trim();
  try {
    const parsed = new URL(candidate);
    if (parsed.protocol === 'https:' && parsed.hostname === 'login.nvgs.nvidia.com') {
      return parsed.href;
    }
  } catch {}
  return 'https://login.nvgs.nvidia.com/';
}

async function fetchNvidiaAccountApi(request, proxyTarget, options = {}) {
  return fetchDirectStaticAsset(request, proxyTarget, 'login.nvgs.nvidia.com', {
    forwardCredentials: true,
    origin: 'https://login.nvgs.nvidia.com',
    referer: nvidiaAccountApiReferer(request),
    redirect: options.redirect || 'follow',
  });
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
    const rawHost = forwardedHost.split(',')[0].trim();
    // 127.0.0.2 was used by an older TikTok compatibility page. Argon's
    // runtime origin is process-wide, so one request to that alias could leak
    // into an unrelated localhost response and bounce a normal tab back to
    // the obsolete origin. Keep old alias requests recoverable, but always
    // generate new proxy URLs on the canonical host.
    const host = rawHost.replace(/^127\.0\.0\.2(?=:\d+$|$)/i, 'localhost');
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
    const rawIncomingUrl = String(request.raw?.url || request.url || '/');
    const incomingUrl = rawIncomingUrl;
    const effectiveProxyUrl = resolveProxyUrl(request);
    const argonEnv = { proxy_url: effectiveProxyUrl, token_prefix };
    globalThis.proxy_url = effectiveProxyUrl;
    globalThis.token_prefix = token_prefix;
    const scopedWorkerPath = `${barePrefix}/argon_service_worker.js`;
    const workerGeneratorUrl = incomingUrl.split('?')[0] === scopedWorkerPath
      ? incomingUrl.replace(scopedWorkerPath, '/argon_service_worker.js')
      : null;
    const routedUrl = workerGeneratorUrl || normalizeSpecialProxyUrl(rewriteRootRelativeProxyUrl(request, token_prefix), token_prefix);
    let rewrittenUrl = normalizeNestedProxyUrl(routedUrl, token_prefix);

    if ((request.method === 'GET' || request.method === 'HEAD')
      && routedUrl.startsWith(token_prefix)
      && rewrittenUrl !== routedUrl) {
      return reply.redirect(rewrittenUrl, 307);
    }
    
    // Fix YouTube's malformed URLs
    rewrittenUrl = normalizeYouTubeUrls(rewrittenUrl);
    
    const fetchDestination = String(
      request.headers['sec-fetch-dest'] || request.headers['x-nebulo-fetch-destination'] || '',
    ).toLowerCase();
    const acceptsHtml = String(request.headers.accept || '').toLowerCase().includes('text/html');
    const isTopLevelNavigation = request.method === 'GET'
      && (fetchDestination === 'document' || fetchDestination === 'iframe' || acceptsHtml);
    let proxyTarget = extractProxyTargetFromRequestUrl(rewrittenUrl, token_prefix);
    rewrittenUrl = rewriteNvidiaAuthorizeRedirectUri(rewrittenUrl, proxyTarget, token_prefix);
    proxyTarget = extractProxyTargetFromRequestUrl(rewrittenUrl, token_prefix);
    const optionalRichAdsLoader = isOptionalRichAdsLoader(proxyTarget);

    const fetchReq = toFetchRequest(request, rewrittenUrl, proxyTarget);

    const isPornhubTracking = proxyTarget?.host?.toLowerCase() === 'i.pornhub.com'
      && proxyTarget.resourcePath === '/_i';
    if (isPornhubTracking && (request.method === 'POST' || request.method === 'OPTIONS')) {
      const requestOrigin = String(request.headers.origin || effectiveProxyUrl);
      return reply
        .status(204)
        .header('Access-Control-Allow-Origin', requestOrigin)
        .header('Access-Control-Allow-Credentials', 'true')
        .header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        .header('Access-Control-Allow-Headers', String(request.headers['access-control-request-headers'] || 'content-type'))
        .header('Cache-Control', 'no-store')
        .send();
    }

    const proxyTargetHost = proxyTarget?.host?.toLowerCase() || '';
    // GPT's versioned managed dictionary is optional, but its CDN frequently
    // returns a 404. Serving an empty cached script prevents a retry storm on
    // every proxied page without disabling the publisher SDK itself.
    if (isGooglePublisherDictionaryTarget(proxyTarget)) {
      return sendOptionalPublisherDictionary(reply);
    }

    const optionalSdk = optionalAdSdkKind(proxyTarget);
    if (optionalSdk) {
      return sendOptionalAdSdkResponse(reply, fetchDestination, optionalSdk);
    }

    if (isNoisyAdHost(proxyTargetHost) && !shouldPassThroughThirdPartyRequest(fetchDestination)) {
      return sendSafeBlockedProxyResponse(reply, request, fetchDestination, acceptsHtml);
    }

    if ((proxyTargetHost === 'subduepaler.cyou' || proxyTargetHost.endsWith('.subduepaler.cyou'))
      && !shouldPassThroughThirdPartyRequest(fetchDestination)) {
      return sendSafeBlockedProxyResponse(reply, request, fetchDestination, acceptsHtml);
    }

    if (proxyTargetHost === 'api.audiomack.com' && request.method === 'OPTIONS') {
      return reply
        .status(204)
        .header('Access-Control-Allow-Origin', String(request.headers.origin || '*'))
        .header('Access-Control-Allow-Credentials', 'true')
        .header('Access-Control-Allow-Methods', 'GET, HEAD, POST, OPTIONS')
        .header('Access-Control-Allow-Headers', String(request.headers['access-control-request-headers'] || 'accept, content-type, range'))
        .header('Access-Control-Max-Age', '600')
        .header('Cache-Control', 'no-store')
        .send();
    }

    // Audiomack's Next.js route-group chunks include encoded path bytes such
    // as `%26`. Argon's generic URL decoder turns those into literal path
    // characters before CloudFront sees the request, which makes valid chunks
    // resolve to Audiomack's HTML 404 page. Static assets do not need Argon's
    // document rewriting, so fetch them directly and preserve the encoded path.
    if (isAudiomackStaticAsset(request, proxyTarget)) {
      try {
        const staticResponse = await fetchDirectStaticAsset(request, proxyTarget, 'audiomack.com', { encodePath: true });
        if (staticResponse.status < 500) {
          return sendArgonResponse(
            staticResponse,
            reply,
            { 'X-Nebulo-Proxy-Path': 'audiomack-static' },
            false,
            proxyTarget,
            token_prefix,
          );
        }
      } catch (_) {
        // Fall through to Argon when the upstream rejects the direct transport.
      }
    }

    // Audiomack playback depends on signed API calls and browser byte-range
    // audio requests. Argon's generic transform path is useful for documents,
    // but for these control/media endpoints the safest behavior is transport:
    // preserve the original path/query/body, forward Range, and stream the
    // upstream response back without rewriting.
    if (isAudiomackDirectRequest(request, proxyTarget)) {
      try {
        let audiomackResponse = await fetchAudiomackDirectResource(request, proxyTarget);
        if (audiomackResponse.status < 500) {
          if (isAudiomackApiRequest(request, proxyTarget)) {
            audiomackResponse = await rewriteAudiomackApiResponse(audiomackResponse, proxyTarget, token_prefix);
          }
          return sendArgonResponse(
            audiomackResponse,
            reply,
            {
              'Access-Control-Allow-Origin': String(request.headers.origin || '*'),
              'Access-Control-Allow-Credentials': 'true',
              'Access-Control-Expose-Headers': 'Content-Length, Content-Range, Accept-Ranges',
              'X-Nebulo-Proxy-Path': isAudiomackApiRequest(request, proxyTarget) ? 'audiomack-api' : 'audiomack-media',
            },
            false,
            proxyTarget,
            token_prefix,
          );
        }
      } catch (_) {
        // Fall through to Argon when a signed API/media request rejects the
        // direct transport. The generic path is still a useful fallback.
      }
    }

    // YouTube's player, guide, and feedback endpoints are JSON-only calls.
    // Bypassing the HTML/JS transformer avoids false 502s that make the
    // website show its offline UI despite the video service being reachable.
    if (isYouTubeInnertubeRequest(request, proxyTarget)) {
      try {
        let innertubeResponse = await fetchYouTubeInnertubeDirect(request, proxyTarget);
        if (innertubeResponse.status < 500) {
          if (String(proxyTarget?.resourcePath || '') === '/youtubei/v1/player') {
            innertubeResponse = await addYouTubePlaybackFallback(innertubeResponse, request, effectiveProxyUrl);
          }
          return sendArgonResponse(
            innertubeResponse,
            reply,
            {
              'Access-Control-Allow-Origin': String(request.headers.origin || '*'),
              'Access-Control-Allow-Credentials': 'true',
              'X-Nebulo-Proxy-Path': 'youtube-innertube',
            },
            false,
            proxyTarget,
            token_prefix,
            null,
            fetchDestination,
          );
        }
      } catch (_) {
        // Use Argon's normal transport only when YouTube's direct edge is
        // temporarily unavailable.
      }
    }

    // NVIDIA's account API validates the original login origin, authorization
    // header, POST body, and shared-domain session cookies together. Argon's
    // document transformer is not needed for JSON API traffic and can change
    // that request shape into an upstream 404, so preserve the native request.
    if (isNvidiaAccountApiRequest(request, proxyTarget)) {
      try {
        // The initial OAuth authorize endpoint redirects to the real login
        // route. Following that redirect server-side returns the login HTML
        // at the old /api/1/oauth/authorize browser address, which makes
        // NVIDIA's Angular router send the user to /not-found. Preserve that
        // top-level redirect so the browser's URL changes with the document.
        const accountResponse = await fetchNvidiaAccountApi(request, proxyTarget, {
          redirect: isTopLevelNavigation ? 'manual' : 'follow',
        });
        if (isTopLevelNavigation
          && accountResponse.status >= 300
          && accountResponse.status < 400) {
          const location = rewriteRedirectLocation(
            accountResponse.headers.get('location'),
            proxyTarget,
            token_prefix,
          );
          if (location) {
            return reply
              .status(accountResponse.status)
              .header('location', location)
              .header('cache-control', 'no-store')
              .send();
          }
        }
        if (accountResponse.status < 500) {
          return sendArgonResponse(
            accountResponse,
            reply,
            { 'X-Nebulo-Proxy-Path': 'nvidia-account-api' },
            false,
            proxyTarget,
            token_prefix,
            null,
            fetchDestination,
          );
        }
      } catch (_) {
        // Retain Argon's regular transport as a fallback for a temporary
        // upstream account-service outage.
      }
    }

    const nvidiaLoginAssetTarget = nvidiaLoginStaticAssetTarget(request, proxyTarget);
    if (nvidiaLoginAssetTarget) {
      try {
        const loginAssetResponse = await fetchDirectStaticAsset(request, nvidiaLoginAssetTarget, nvidiaLoginAssetTarget.host);
        if (loginAssetResponse.status < 500) {
          const nvidiaBundleHost = String(proxyTarget?.host || '').toLowerCase().split(':')[0];
          const isNvidiaIdentityBundle = nvidiaBundleHost === 'accounts.nvgs.nvidia.com'
            || nvidiaBundleHost === 'login.nvgs.nvidia.com'
            || nvidiaBundleHost === 'login.nvidia.com';
          return sendArgonResponse(
            loginAssetResponse,
            reply,
            { 'X-Nebulo-Proxy-Path': 'nvidia-login-static-alias' },
            false,
            proxyTarget,
            token_prefix,
            null,
            fetchDestination,
            isNvidiaIdentityBundle,
          );
        }
      } catch (_) {
        // The normal NVIDIA transport remains available if its asset CDN has
        // a transient error.
      }
    }

    // NVIDIA signs the GeForce NOW shell and sign-in chunks with Subresource
    // Integrity. Fetch them directly so Argon's generic JavaScript transformer
    // cannot alter even one byte and invalidate the browser's integrity check.
    if (isNvidiaSignedRuntimeAsset(request, proxyTarget)) {
      try {
        const runtimeResponse = await fetchDirectStaticAsset(request, proxyTarget, proxyTarget.host);
        if (runtimeResponse.status < 500) {
          return sendArgonResponse(
            runtimeResponse,
            reply,
            { 'X-Nebulo-Proxy-Path': 'nvidia-signed-runtime' },
            false,
            proxyTarget,
            token_prefix,
            null,
            fetchDestination,
          );
        }
      } catch (_) {
        // Fall through to Argon's normal transport on a transient CDN error.
      }
    }

    // Game builds contain many immutable binary bundles. They do not need
    // Argon's HTML/JavaScript rewriting, so stream them directly from the CDN
    // to remove per-file proxy parsing and preserve byte-range responses.
    if (isCrazyGamesFastAsset(request, proxyTarget)) {
      try {
        const fastResponse = await fetchCrazyGamesFastAsset(request, proxyTarget);
        if (fastResponse.status < 500) {
          return sendArgonResponse(
            fastResponse,
            reply,
            { 'X-Nebulo-Proxy-Path': 'crazygames-fast' },
            false,
            proxyTarget,
            token_prefix,
          );
        }
      } catch (_) {
        // Fall through to Argon when a CDN rejects the direct transport.
      }
    }

    // Cineby's source resolver rejects Argon's internal fetch metadata at the
    // Cloudflare edge. Forward this one playback API with a clean Cineby
    // request while keeping the response untouched for Cineby's decoder.
    if (request.method === 'GET' && proxyTarget?.host?.toLowerCase() === 'api.speedracelight.com') {
      const upstreamUrl = `https://api.speedracelight.com${proxyTarget.resourcePath}${proxyTarget.search}`;
      const upstreamResponse = await fetch(upstreamUrl, {
        method: 'GET',
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Accept-Language': 'en-US,en;q=0.9',
          Origin: 'https://www.cineby.at',
          Referer: 'https://www.cineby.at/',
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'cross-site',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        },
        redirect: 'manual',
      });
      const upstreamBody = Buffer.from(await upstreamResponse.arrayBuffer());
      return reply
        .status(upstreamResponse.status)
        .header('Access-Control-Allow-Origin', '*')
        .header('Cache-Control', 'no-store')
        .header('Content-Type', upstreamResponse.headers.get('content-type') || 'application/octet-stream')
        .send(upstreamBody);
    }

    if (request.method === 'POST'
      && proxyTarget?.host?.toLowerCase() === 'users.videasy.to'
      && proxyTarget.resourcePath === '/api/track') {
      return reply
        .status(204)
        .header('Access-Control-Allow-Origin', '*')
        .header('Cache-Control', 'no-store')
        .send();
    }

    const isTikTokAbTestCollector = request.method === 'POST'
      && /(?:^|\.)tiktokv\.us$/i.test(proxyTarget?.host || '')
      && proxyTarget.resourcePath === '/service/2/abtest_config/';
    if (isTikTokAbTestCollector) {
      return reply
        .status(200)
        .header('Access-Control-Allow-Origin', String(request.headers.origin || effectiveProxyUrl))
        .header('Access-Control-Allow-Credentials', 'true')
        .header('Cache-Control', 'no-store')
        .header('Content-Type', 'application/json; charset=utf-8')
        .send('{}');
    }

    const tikTokTargetHost = String(proxyTarget?.host || '').toLowerCase();
    const rewrittenPath = String(rewrittenUrl || '').split('?')[0];
    const isTikTokEligibility = (request.method === 'GET' || request.method === 'POST')
      && (/^(?:www\.)?tiktok\.com$/i.test(tikTokTargetHost)
        || /\/https\/(?:www\.)?tiktok\.com\//i.test(rewrittenPath))
      && (proxyTarget?.resourcePath === '/tiktok/ppf/api/eligibility/v2'
        || rewrittenPath.endsWith('/tiktok/ppf/api/eligibility/v2'));
    if (isTikTokEligibility) {
      return reply
        .status(200)
        .header('Cache-Control', 'no-store')
        .header('Content-Type', 'application/json; charset=utf-8')
        .send({
          eligibility_list: [{
            decision_code: '0',
            id_value: 'account_control',
            is_eligible: true,
            source: 'ppf',
          }],
          log_pb: { impr_id: `${Date.now()}-nebulo` },
          status_code: 0,
          status_msg: '',
        });
    }

    const isTikTokWalletCheck = request.method === 'POST'
      && (/(?:^|\.)tiktok\.com$/i.test(tikTokTargetHost)
        || /\/https\/(?:[^/]+\.)?tiktok\.com\//i.test(rewrittenPath))
      && (proxyTarget?.resourcePath === '/webcast/wallet_api_tiktok/recharge/check_external_entry'
        || rewrittenPath.endsWith('/webcast/wallet_api_tiktok/recharge/check_external_entry'));
    if (isTikTokWalletCheck) {
      return reply
        .status(200)
        .header('Cache-Control', 'no-store')
        .header('Content-Type', 'application/json; charset=utf-8')
        .send({
          data: {
            frequency_control_type: 0,
            is_live_consumption_user: false,
            show_external_entry: false,
          },
          extra: { now: Date.now() },
          status_code: 0,
        });
    }

    const isTikTokTelemetry = request.method === 'POST'
      && (/(?:^|\.)tiktokv\.us$/i.test(tikTokTargetHost)
        || /\/https\/[^/]*tiktokv\.us\//i.test(rewrittenPath))
      && (proxyTarget?.resourcePath === '/monitor_browser/collect/batch/'
        || rewrittenPath.endsWith('/monitor_browser/collect/batch/'));
    if (isTikTokTelemetry) {
      return reply.status(204).header('Cache-Control', 'no-store').send();
    }

    const isTikTokGlobalFooter = (request.method === 'GET' || request.method === 'POST')
      && /^(?:www\.)?tiktokw\.us$/i.test(tikTokTargetHost)
      && proxyTarget?.resourcePath === '/api/global-footer/graphql';
    if (isTikTokGlobalFooter) {
      return reply
        .status(200)
        .header('Cache-Control', 'no-store')
        .header('Content-Type', 'application/json; charset=utf-8')
        .send({ data: {} });
    }

    // Telemetry must never hold up a proxied page when its collector is unavailable.
    if (!isTopLevelNavigation && proxyTarget?.host?.toLowerCase().endsWith('.ingest.sentry.io')) {
      return reply.status(204).send();
    }
    const requestPath = String(request.url || '').split('?')[0] || '/';
    const isInjectedRuntime = requestPath === '/argon-response-injected.js'
      || rewrittenUrl.includes('/argon-response-injected.js');
    const noStoreHeaders = (requestPath === '/argon_service_worker.js' || workerGeneratorUrl || requestPath === '/service-worker.js' || requestPath.startsWith('/unified/') || isInjectedRuntime)
      ? {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          ...(isInjectedRuntime ? { 'Content-Type': 'application/javascript; charset=utf-8' } : {}),
          ...((requestPath === '/argon_service_worker.js' || workerGeneratorUrl) ? { 'Service-Worker-Allowed': '/ag/' } : {}),
        }
      : null;
    const isTikTokRecommendation = isTikTokRecommendationRequest(request, proxyTarget);
    if (isTikTokRecommendation && rewrittenUrl.startsWith(token_prefix)) {
      lastTikTokFeedRequestPath = rewrittenUrl;
      lastTikTokFeedRequestAt = Date.now();
    }
    const isTikTokControlRequest = (request.method === 'GET' || request.method === 'POST')
      && /(?:^|\.)(?:tiktok\.com|tiktokv\.com|tiktokv\.us)$/i.test(proxyTarget?.host || '')
      && /^(?:\/api\/|\/tiktok\/v1\/|\/tiktok\/ppf\/api\/|\/webcast\/|\/monitor_browser\/)/.test(proxyTarget?.resourcePath || '');

    const responseFromTikTokFeedPayload = (payload, sourceResponse = null) => {
      // Preserve TikTok's native ordering, cursor, ad offsets, and pagination.
      // Rebuilding this payload made the official UI behave like a custom FYP.
      const adaptedPayload = payload;
      const headers = new Headers(sourceResponse?.headers || {});
      headers.set('content-type', 'application/json; charset=utf-8');
      headers.delete('content-length');
      headers.delete('content-encoding');
      return new Response(JSON.stringify(adaptedPayload), {
        status: 200,
        statusText: 'OK',
        headers,
      });
    };

    const cachedTikTokFeedResponse = () => {
      if (!lastTikTokFeedPayload || Date.now() - lastTikTokFeedPayloadAt > TIKTOK_FEED_CACHE_TTL_MS) {
        return null;
      }
      return responseFromTikTokFeedPayload(lastTikTokFeedPayload);
    };

    // The FYP API is a signed JSON POST/GET and does not need document
    // rewriting. Use a direct request first so a transport failure inside the
    // proxy runtime cannot turn the feed into a browser-level ALPN failure.
    if (isTikTokRecommendation) {
      try {
        const directRecommendationResponse = await fetchTikTokRecommendationDirect(request, proxyTarget);
        if (directRecommendationResponse.ok) {
          const directPayload = await directRecommendationResponse.json();
          if (Array.isArray(directPayload?.itemList) && directPayload.itemList.length) {
            cacheTikTokFeedPayload(directPayload);
            return sendArgonResponse(
              responseFromTikTokFeedPayload(directPayload, directRecommendationResponse),
              reply,
              {
                'Cache-Control': 'no-store',
                'X-Nebulo-Proxy-Path': 'tiktok-recommend-direct',
              },
              false,
              proxyTarget,
              token_prefix,
              null,
              fetchDestination,
            );
          }
        }
      } catch (_) {
        // Fall through to the existing signed-endpoint variants and cached
        // feed snapshot if TikTok temporarily rejects the native transport.
      }
    }

    const buildTikTokVariantRequest = (requestPath, target, method) => {
      const baseRequest = toFetchRequest(request, requestPath, target);
      if (method === request.method) return baseRequest;

      const headers = new Headers(baseRequest.headers);
      headers.delete('content-length');
      if (method === 'GET') {
        headers.delete('content-type');
        return new Request(baseRequest.url, { method: 'GET', headers });
      }

      const body = request.body?.length ? request.body : Buffer.from('{}');
      if (!headers.has('content-type')) headers.set('content-type', 'application/json');
      return new Request(baseRequest.url, {
        method: 'POST',
        headers,
        body,
        duplex: 'half',
      });
    };

    const fetchTikTokFeedFallback = async (baseResponse = null, seedPayload = null) => {
      const fallbackUrl = new URL(rewrittenUrl, 'http://nebulo.local');
      fallbackUrl.pathname = fallbackUrl.pathname.replace('/api/recommend/item_list/', '/api/preload/item_list/');
      fallbackUrl.searchParams.set('count', '3');
      fallbackUrl.searchParams.delete('pullType');
      if (!fallbackUrl.searchParams.has('user_is_login')) {
        fallbackUrl.searchParams.set('user_is_login', 'false');
      }
      fallbackUrl.searchParams.delete('enable_cache');
      fallbackUrl.searchParams.delete('showAboutThisAd');
      fallbackUrl.searchParams.delete('showAds');

      const fallbackPath = `${fallbackUrl.pathname}${fallbackUrl.search}`;
      const fallbackTarget = extractProxyTargetFromRequestUrl(fallbackPath, token_prefix);
      const alternateMethod = request.method === 'POST' ? 'GET' : 'POST';
      const candidates = [
        { path: rewrittenUrl, target: proxyTarget, method: request.method },
        { path: rewrittenUrl, target: proxyTarget, method: request.method },
        { path: rewrittenUrl, target: proxyTarget, method: alternateMethod },
        { path: fallbackPath, target: fallbackTarget, method: request.method },
        { path: fallbackPath, target: fallbackTarget, method: alternateMethod },
      ];
      const mergedItems = [];
      const seenItemIds = new Set();
      let payloadTemplate = null;
      let responseTemplate = baseResponse;
      const mergePayload = (payload, sourceResponse = null) => {
        if (!Array.isArray(payload?.itemList) || !payload.itemList.length) return;
        if (!payloadTemplate) payloadTemplate = payload;
        if (!responseTemplate && sourceResponse) responseTemplate = sourceResponse;
        for (const item of payload.itemList) {
          const itemId = String(item?.id || item?.itemId || '');
          if (!itemId || seenItemIds.has(itemId)) continue;
          seenItemIds.add(itemId);
          mergedItems.push(item);
        }
      };
      mergePayload(seedPayload, baseResponse);

      for (let attempt = 0; attempt < candidates.length; attempt += 1) {
        const candidate = candidates[attempt];
        try {
          const candidateResponse = await argon.default.fetch(
            buildTikTokVariantRequest(candidate.path, candidate.target, candidate.method),
            argonEnv,
          );
          if (candidateResponse.ok) {
            const candidatePayload = await candidateResponse.json();
            mergePayload(candidatePayload, candidateResponse);
            if (mergedItems.length >= 3) {
              const adaptedPayload = {
                ...payloadTemplate,
                itemList: mergedItems,
                cursor: String(Date.now()),
                hasMore: true,
              };
              cacheTikTokFeedPayload(adaptedPayload);
              return responseFromTikTokFeedPayload(adaptedPayload, responseTemplate || candidateResponse);
            }
          }
        } catch {
          // Try the next signed endpoint/method combination.
        }
        if (attempt < candidates.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 120 * Math.min(attempt + 1, 3)));
        }
      }
      if (mergedItems.length && payloadTemplate) {
        const adaptedPayload = {
          ...payloadTemplate,
          itemList: mergedItems,
          cursor: String(Date.now()),
          hasMore: true,
        };
        cacheTikTokFeedPayload(adaptedPayload);
        return responseFromTikTokFeedPayload(adaptedPayload, responseTemplate);
      }
      return cachedTikTokFeedResponse();
    };

    if (ARGON_DEBUG) console.log(`[argon] ${request.method} ${rewrittenUrl}`);
    try {
      // ── Connection-error retry with exponential backoff ─────────────────
      // Upstream CDNs (Cloudflare, Akamai) can drop connections mid-flight or
      // refuse to complete TLS handshakes on the first attempt. A brief retry
      // often succeeds where the initial fetch fails.
      // A failed document, stylesheet, module, or worker can make a site look
      // like it loaded and then turn into a blank screen. Retry those critical
      // idempotent requests once; background media/telemetry still never gets
      // retried, so this does not multiply ordinary upstream traffic.
      const isCriticalRenderRequest = (request.method === 'GET' || request.method === 'HEAD')
        && (isTopLevelNavigation
          || ['script', 'style', 'worker', 'sharedworker', 'serviceworker'].includes(fetchDestination)
          || /(?:text\/css|javascript|ecmascript)/i.test(String(request.headers.accept || '')));
      const MAX_RETRIES = isTopLevelNavigation ? 2 : (isTikTokControlRequest ? 2 : (isCriticalRenderRequest ? 1 : 0));
      const RETRY_BASE_DELAY_MS = 120;
      let fetchReqForAttempt = fetchReq;
      let response;
      let lastError;
      for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
        try {
          response = await argon.default.fetch(fetchReqForAttempt, argonEnv);
          const transportFailed = [502, 503, 504].includes(response.status);
          if (transportFailed && attempt < MAX_RETRIES) {
            const delay = RETRY_BASE_DELAY_MS * Math.pow(2, attempt);
            if (ARGON_DEBUG) console.log(`[argon] transport failure (attempt ${attempt + 1}/${MAX_RETRIES + 1}), retrying in ${delay}ms: ${rewrittenUrl}`);
            await new Promise(resolve => setTimeout(resolve, delay));
            fetchReqForAttempt = toFetchRequest(request, rewrittenUrl, proxyTarget);
            argonEnv.proxy_url = resolveProxyUrl(request);
            continue;
          }
          lastError = null;
          break;
        } catch (err) {
          lastError = err;
          if (attempt < MAX_RETRIES) {
            const delay = RETRY_BASE_DELAY_MS * Math.pow(2, attempt);
            if (ARGON_DEBUG) console.log(`[argon] fetch error (attempt ${attempt + 1}/${MAX_RETRIES + 1}), retrying in ${delay}ms: ${rewrittenUrl} — ${err.message}`);
            await new Promise(resolve => setTimeout(resolve, delay));
            // Rebuild the fetch request in case body/buffer state was consumed
            fetchReqForAttempt = toFetchRequest(request, rewrittenUrl, proxyTarget);
            argonEnv.proxy_url = resolveProxyUrl(request);
          }
        }
      }
      if (lastError) {
        if (optionalRichAdsLoader) {
          response = createOptionalRichAdsFallback();
        } else if (isTikTokRecommendation) {
          response = await fetchTikTokFeedFallback();
        }
        if (!response) throw lastError;
      }

      // RichAds is optional and is loaded asynchronously by the shell. Route
      // it through Argon so a provider timeout/5xx cannot leave a noisy 502 in
      // the console or interfere with the rest of the page.
      if (optionalRichAdsLoader && !response.ok) {
        response = createOptionalRichAdsFallback();
      }

      // Only retry top-level loads. Retrying every rate-limited game asset
      // serializes large builds behind repeated one-second delays.
      if (response.status === 429 && request.method === 'GET' && (fetchDestination === 'document' || fetchDestination === 'iframe')) {
        if (ARGON_DEBUG) console.log(`[argon] rate limited (429), retrying in 1s: ${rewrittenUrl}`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        response = await argon.default.fetch(toFetchRequest(request, rewrittenUrl, proxyTarget), argonEnv);
      }

      if (isTikTokRecommendation) {
        try {
          // Fully consume recommendation JSON before replying. Passing Argon's
          // upstream stream through can abort the local response if its HTTP/2
          // connection loses ALPN after headers have already arrived.
          const recommendationPayload = response.ok ? await response.json() : null;
          if (!Array.isArray(recommendationPayload?.itemList) || recommendationPayload.itemList.length < 3) {
            // TikTok can return an empty recommendation response through a
            // relay while its signed desktop preload endpoint remains valid.
            // Preserve that native desktop payload without rebuilding items.
            response = await fetchTikTokFeedFallback(response, recommendationPayload) || response;
          } else {
            cacheTikTokFeedPayload(recommendationPayload);
            response = responseFromTikTokFeedPayload(recommendationPayload, response);
          }
        } catch (error) {
          const recoveredResponse = await fetchTikTokFeedFallback(response);
          if (recoveredResponse) {
            response = recoveredResponse;
          } else {
            throw error;
          }
        }
      }

      if (request.method === 'GET' && response.status === 404) {
        const currentTarget = extractProxyTargetFromRequestUrl(rewrittenUrl, token_prefix);
        const refererContext = extractProxyContextFromReferer(request, token_prefix);
        if (currentTarget && refererContext && isAssetRetryCandidate(currentTarget.resourcePath)) {
          const sameTarget = currentTarget.protocol === refererContext.protocol && currentTarget.host === refererContext.host;
          if (!sameTarget) {
            const retryUrl = buildProxyUrlForContext(refererContext, currentTarget.resourcePath, currentTarget.search, token_prefix);
            if (ARGON_DEBUG) console.log(`[argon] retry 404 ${rewrittenUrl} -> ${retryUrl}`);
            const retryTarget = extractProxyTargetFromRequestUrl(retryUrl, token_prefix);
            const retryResponse = await argon.default.fetch(toFetchRequest(request, retryUrl, retryTarget), argonEnv);
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

      if (ARGON_DEBUG) console.log(`[argon] → ${response.status} ${rewrittenUrl}`);
      let runtimeAtomSourceUrl = null;
      if (isInjectedRuntime) {
        try {
          const atomParam = new URL(rawIncomingUrl, 'http://localhost').searchParams.get('atom');
          const parsedAtomUrl = atomParam ? new URL(atomParam) : null;
          if (parsedAtomUrl
            && parsedAtomUrl.protocol === 'https:'
            && /(?:^|\.)tiktokcdn-us\.com$/i.test(parsedAtomUrl.hostname)
            && /\/atom\.init\.[^/]+\.js$/i.test(parsedAtomUrl.pathname)) {
            runtimeAtomSourceUrl = parsedAtomUrl.href;
          }
        } catch (_) {}
      }
      return sendArgonResponse(
        response,
        reply,
        responseHeaderOverrides,
        isInjectedRuntime,
        proxyTarget,
        token_prefix,
        runtimeAtomSourceUrl,
        fetchDestination,
      );
    } catch (err) {
      console.error(`[argon] error on ${rewrittenUrl}:`, err);
      reply.status(502).send(`Argon proxy error: ${err.message}`);
    }
  }

  // ── Routes ─────────────────────────────────────────────────────────────────

  // argon's service worker is always registered at the site root regardless
  // of token_prefix.
  fastify.get('/argon_service_worker.js', handleArgon);
  // Every proxied HTML document loads this runtime from the site root. If it
  // falls through to the app's 404 handler, URL/fetch/XHR rewriting never
  // starts and cross-origin resources escape the proxy.
  fastify.get('/argon-response-injected.js', handleArgon);
  fastify.get('/argon-runtime/:version', handleArgon);
  fastify.get('/post3.html', (request, reply) => {
    const queryIndex = String(request.raw.url || '').indexOf('?');
    const search = queryIndex === -1 ? '' : String(request.raw.url).slice(queryIndex);
    return reply.redirect(`${token_prefix}https/duckduckgo.com/post3.html${search}`, 307);
  });
  fastify.get('/service-worker.js', async (_request, reply) => {
    reply
      .header('Cache-Control', 'no-store, no-cache, must-revalidate')
      .type('application/javascript; charset=utf-8')
      .send(noopServiceWorker);
  });
  fastify.all('/_next/*', handleArgon);
  fastify.all('/static/*', handleArgon);
  fastify.all('/textures/*', handleArgon);
  fastify.all('/index/*', handleArgon);
  fastify.all('/Build/*', handleArgon);
  fastify.all('/build/*', handleArgon);
  fastify.all('/TemplateData/*', handleArgon);
  fastify.all('/StreamingAssets/*', handleArgon);
  fastify.all('/cdn-cgi/*', handleArgon);
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
module.exports.getTikTokFeedPayload = function getTikTokFeedPayload() {
  if (!lastTikTokFeedPayload || Date.now() - lastTikTokFeedPayloadAt > TIKTOK_FEED_CACHE_TTL_MS) {
    return null;
  }
  return {
    ...randomizeTikTokFeedPayload(lastTikTokFeedPayload),
    adsOffset: Number.isFinite(Number(lastTikTokFeedPayload.adsOffset))
      ? Number(lastTikTokFeedPayload.adsOffset)
      : 0,
    cursor: String(Date.now()),
    hasMore: true,
    _nebuloNextUrl: lastTikTokFeedRequestPath
      && Date.now() - lastTikTokFeedRequestAt <= TIKTOK_FEED_CACHE_TTL_MS
      ? lastTikTokFeedRequestPath
      : null,
  };
};
