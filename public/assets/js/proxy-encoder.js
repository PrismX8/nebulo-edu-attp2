// Lightweight proxy encoder used by pages that only need URL encoding.
// Avoids pulling in the full search.js bundle (which does a lot more work).
(function () {
  "use strict";

  let scramjetControllerPromise = null;
  let baremuxInitPromise = null;
  let swInitPromise = null;
  let argonSwInitPromise = null;

  function normalizeProxyChoice(value) {
    return value === "argon" ? "ag" : value;
  }

  function buildSearchEngineUrl(query) {
    const encodedQuery = encodeURIComponent(String(query || "").trim());
    const proxy = normalizeProxyChoice(localStorage.getItem("proxy")) || "ag";
    if (proxy === "ag") {
      return `https://duckduckgo.com/?q=${encodedQuery}`;
    }
    const engine = (localStorage.getItem("searchEngine") || "duckduckgo").toLowerCase();
    switch (engine) {
      case "google":
        return `https://www.google.com/search?q=${encodedQuery}`;
      case "bing":
        return `https://www.bing.com/search?q=${encodedQuery}`;
      case "yahoo":
        return `https://search.yahoo.com/search?p=${encodedQuery}`;
      case "ecosia":
        return `https://www.ecosia.org/search?q=${encodedQuery}`;
      case "brave":
        return `https://search.brave.com/search?q=${encodedQuery}`;
      case "irs":
        return `https://www.irs.gov/site-index-search?search=${encodedQuery}`;
      case "duckduckgo":
      default:
        return `https://duckduckgo.com/?t=h_&q=${encodedQuery}`;
    }
  }

  function encodeArgonRoute(inputUrl) {
    const normalized = normalizeUrlLike(inputUrl);
    if (!normalized || normalized.startsWith("/")) return normalized;
    try {
      const u = new URL(normalized);
      if (u.protocol !== "http:" && u.protocol !== "https:") return normalized;
      return "/ag/" + u.protocol.replace(":", "") + "/" + u.host + (u.pathname || "/") + (u.search || "") + (u.hash || "");
    } catch {
      return normalized;
    }
  }

  async function ensureArgonServiceWorker() {
    if (typeof window.ensureArgonWorkerForTarget === "function") {
      return window.ensureArgonWorkerForTarget(location.href);
    }
    if (argonSwInitPromise) return argonSwInitPromise;
    argonSwInitPromise = (async () => {
      if (!("serviceWorker" in navigator)) return false;
      try {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map((registration) => {
          const worker = registration.active || registration.waiting || registration.installing;
          return worker?.scriptURL.includes("/argon_service_worker.js")
            ? registration.unregister()
            : Promise.resolve(false);
        }));
        return true;
      } catch {
        return false;
      } finally {
        setTimeout(() => {
          argonSwInitPromise = null;
        }, 0);
      }
    })();
    return argonSwInitPromise;
  }

  function normalizeExistingProxyTarget(rawInput) {
    const raw = (typeof rawInput === "string" ? rawInput : String(rawInput || "")).trim();
    if (!raw) return "";

    const uvPrefix = (typeof __uv$config !== "undefined" && __uv$config?.prefix) ? __uv$config.prefix : "/uv/service/";
    const eclipsePrefix = (typeof __eclipse$config !== "undefined" && __eclipse$config?.prefix) ? __eclipse$config.prefix : "/ec/service/";
    const isAlreadyProxiedPath = (p) =>
      p.startsWith(uvPrefix) ||
      p.startsWith(eclipsePrefix) ||
      p.startsWith("/ag/") ||
      p.startsWith("/scram/service/") ||
      p.startsWith("/service/scramjet/") ||
      p.startsWith("/scramjet/");

    if (raw.startsWith("/") && isAlreadyProxiedPath(raw)) return raw;

    // UV payload passed directly (without /uv/service/ prefix).
    if (!raw.startsWith("/") && raw.startsWith("hvtrs")) {
      let payload = raw;
      if (payload.includes("%")) {
        try {
          payload = decodeURIComponent(payload);
        } catch {}
      }
      return uvPrefix + payload;
    }

    // Full same-origin URL that already points to a proxied path.
    try {
      const u = new URL(raw, location.origin);
      if (u.origin === location.origin && isAlreadyProxiedPath(u.pathname)) {
        return u.pathname + u.search + u.hash;
      }
    } catch {}

    return "";
  }

  function normalizeUrlLike(inputUrl) {
    const raw = (typeof inputUrl === "string" ? inputUrl : String(inputUrl || "")).trim();
    if (!raw) return "";
    const existingProxyTarget = normalizeExistingProxyTarget(raw);
    if (existingProxyTarget) return existingProxyTarget;
    if (raw.startsWith("/")) return raw;
    try {
      const parsed = new URL(raw);
      if (parsed.protocol === "http:" || parsed.protocol === "https:") return parsed.toString();
      return raw;
    } catch {
      if (raw.includes(".") && !raw.includes(" ")) {
        try {
          return new URL("https://" + raw).toString();
        } catch {
          return buildSearchEngineUrl(raw);
        }
      }
      return buildSearchEngineUrl(raw);
    }
  }

  function shouldForceScramjetForUrl(inputUrl) {
    const rules = window.NebuloProxyHostRules;
    if (rules && typeof rules.shouldForceScramjetForUrl === "function") {
      return rules.shouldForceScramjetForUrl(inputUrl);
    }

    const normalized = normalizeUrlLike(inputUrl);
    if (!normalized || normalized.startsWith("/")) return false;

    let host = "";
    try {
      host = new URL(normalized).hostname.toLowerCase();
    } catch {
      return false;
    }

    return (
      host === "crazygames.com" ||
      host.endsWith(".crazygames.com") ||
      host === "play.geforcenow.com" ||
      host.endsWith(".geforcenow.com") ||
      host === "tlk.io" ||
      host.endsWith(".tlk.io")
    );
  }

  function shouldForceArgonForUrl(inputUrl) {
    const rules = window.NebuloProxyHostRules;
    return Boolean(rules?.shouldForceArgonForUrl?.(inputUrl));
  }

  // Sites that break under Scramjet (typically SPA routers treating /scramjet/* as a real route).
  // For these, fall back to UV even if the user selected Scramjet.
  function shouldAvoidScramjetForUrl(inputUrl) {
    const rules = window.NebuloProxyHostRules;
    if (rules && typeof rules.shouldAvoidScramjetForUrl === "function") {
      return rules.shouldAvoidScramjetForUrl(inputUrl);
    }

    const normalized = normalizeUrlLike(inputUrl);
    if (!normalized || normalized.startsWith("/")) return false;
    try {
      const host = new URL(normalized).hostname.toLowerCase();
      return host === "polybuzz.ai" || host.endsWith(".polybuzz.ai");
    } catch {
      return false;
    }
  }

  function encodeScramjetRoute(inputUrl) {
    const normalized = normalizeUrlLike(inputUrl);
    if (!normalized || normalized.startsWith("/")) return normalized;

    try {
      const u = new URL(normalized);
      if (u.protocol !== "http:" && u.protocol !== "https:") return normalized;
      const hash = u.hash ? u.hash.slice(1) : "";
      u.hash = "";
      return "/scramjet/" + encodeURIComponent(u.href) + (hash ? "#" + encodeURIComponent(hash) : "");
    } catch {
      return "/scramjet/" + encodeURIComponent(normalized);
    }
  }

  async function ensureScramjetController() {
    if (scramjetControllerPromise) return scramjetControllerPromise;
    scramjetControllerPromise = (async () => {
      if (typeof $scramjetLoadController !== "function") return null;
      const { ScramjetController } = $scramjetLoadController();
      const controller = new ScramjetController({
        files: {
          wasm: "/scram/scramjet.wasm.wasm",
          all: "/scram/scramjet.all.js",
          sync: "/scram/scramjet.sync.js",
        },
      });
      await controller.init();
      return controller;
    })().catch(() => null);
    return scramjetControllerPromise;
  }

  async function ensureBareMux() {
    if (baremuxInitPromise) return baremuxInitPromise;
    baremuxInitPromise = (async () => {
      if (typeof BareMux === "undefined" || typeof BareMux.BareMuxConnection !== "function") return null;
      const connection = new BareMux.BareMuxConnection("/baremux/worker.js?v=bw1");
      const wispUrl = (location.protocol === "https:" ? "wss" : "ws") + "://" + location.host + "/wisp/";

      const transport = localStorage.getItem("transport") || "epoxy";
      localStorage.setItem("transport", transport);
      const expectedTransport = transport === "libcurl" ? "/libcurl/index.mjs" : "/epoxy/index.mjs";

      try {
        if ((await connection.getTransport()) !== expectedTransport) {
          await connection.setTransport(expectedTransport, [{ wisp: wispUrl }]);
        }
        const activeTransport = await connection.getTransport();
        if (activeTransport !== expectedTransport) {
          throw new Error(`BareMux transport verification failed. Expected ${expectedTransport}, got ${activeTransport || "none"}.`);
        }
      } catch {
        // If baremux init fails, encoding can still proceed; browsing may be flaky.
      }
      return connection;
    })().finally(() => {
      // Allow reinit later if needed.
      setTimeout(() => {
        baremuxInitPromise = null;
      }, 0);
    });
    return baremuxInitPromise;
  }

  async function ensureServiceWorker() {
    if (swInitPromise) return swInitPromise;
    swInitPromise = (async () => {
      if (!("serviceWorker" in navigator)) return false;
      try {
        const reg = await navigator.serviceWorker.getRegistration();
        if (!reg) {
          await navigator.serviceWorker.register("/sw.js");
        }
        // Wait briefly for control (important on first load).
        if (!navigator.serviceWorker.controller) {
          await new Promise((resolve) => {
            const done = () => resolve();
            navigator.serviceWorker.addEventListener("controllerchange", done, { once: true });
            setTimeout(done, 1500);
          });
        }
        return true;
      } catch {
        return false;
      }
    })();
    return swInitPromise;
  }

  async function ensureProxyRuntimeReady() {
    await Promise.allSettled([ensureBareMux(), ensureServiceWorker()]);
  }

  function encodeViaUv(url) {
    if (typeof __uv$config !== "undefined" && __uv$config?.encodeUrl) {
      return __uv$config.prefix + __uv$config.encodeUrl(url);
    }
    return null;
  }

  function encodeViaEc(url) {
    if (typeof __eclipse$config !== "undefined" && __eclipse$config?.codec?.encode) {
      return __eclipse$config.prefix + __eclipse$config.codec.encode(url);
    }
    return null;
  }

  async function encodeUrlWithProxy(inputUrl, overrideProxy) {
    const normalized = normalizeUrlLike(inputUrl);
    if (!normalized) return normalized;

    // Local routes/assets should load directly.
    const uvPrefix = (typeof __uv$config !== "undefined" && __uv$config?.prefix) ? __uv$config.prefix : "/uv/service/";
    const eclipsePrefix = (typeof __eclipse$config !== "undefined" && __eclipse$config?.prefix) ? __eclipse$config.prefix : "/ec/service/";
    const isAlreadyProxied =
      normalized.startsWith(uvPrefix) ||
      normalized.startsWith(eclipsePrefix) ||
      normalized.startsWith("/ag/") ||
      normalized.startsWith("/scram/service/") ||
      normalized.startsWith("/service/scramjet/") ||
      normalized.startsWith("/scramjet/");
    if (normalized.startsWith("/") && !isAlreadyProxied) return normalized;
    if (isAlreadyProxied) return normalized;

    // Warm up runtime (non-blocking if parts fail).
    await ensureProxyRuntimeReady();

    const savedProxy = normalizeProxyChoice(localStorage.getItem("proxy"));
    const proxy = shouldForceArgonForUrl(normalized) ? "ag" : (savedProxy || "ag");

    if (proxy === "ag") {
      await ensureArgonServiceWorker();
      return encodeArgonRoute(normalized);
    }

    if (proxy === "sj") {
      const scram = await ensureScramjetController();
      if (scram && typeof scram.encodeUrl === "function") return scram.encodeUrl(normalized);
      return encodeScramjetRoute(normalized);
    }

    if (proxy === "ec") {
      const encoded = encodeViaEc(normalized);
      if (encoded) return encoded;
      const uvFallback = encodeViaUv(normalized);
      return uvFallback || normalized;
    }

    // Default UV.
    const uv = encodeViaUv(normalized);
    return uv || normalized;
  }

  window.proxyEncoder = {
    encode: encodeUrlWithProxy,
  };
})();
