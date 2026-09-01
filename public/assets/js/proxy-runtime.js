// Global proxy runtime bootstrap + self-healing.
// Goals:
// 1) Ensure the service worker can always obtain a valid bare-mux SharedWorker MessagePort
//    even before any page constructs a BareMuxConnection.
// 2) Auto-repair broken caches/IndexedDB state that causes "invalid MessagePort",
//    "no bare clients", or missing object stores.
// 3) Set sane defaults (epoxy transport + Argon proxy) when no user preference exists.

(function () {
  "use strict";

  const SESSION_GUARD_KEY = "proxy_runtime_hard_repair_done";
  const argonWorkerPromises = new Map();
  let legacyArgonCleanupPromise = null;

  // Older builds routed TikTok through a separate 127.0.0.2 origin. Clear the
  // old launcher hook so every entry now uses the standard /ag/ URL.
  try { delete window.getTikTokProxyAlias; } catch { window.getTikTokProxyAlias = undefined; }

  function safeLower(x) {
    try {
      return String(x || "").toLowerCase();
    } catch {
      return "";
    }
  }

  function ensureDefaults() {
    // One-time migration: if an older build saved "libcurl" (currently flaky on some setups),
    // switch to epoxy once. Users can still manually select libcurl later.
    const MIGRATION_KEY = "proxy_speed_defaults_migrated_v3";
    const migrated = localStorage.getItem(MIGRATION_KEY) === "1";
    try {
      const t = localStorage.getItem("transport");
      if (!t) localStorage.setItem("transport", "epoxy");
      else if (!migrated && t === "libcurl") localStorage.setItem("transport", "epoxy");

      // Set Argon only when no preference exists. Never overwrite a user's
      // explicit proxy selection during a runtime migration.
      if (!localStorage.getItem("proxy")) localStorage.setItem("proxy", "ag");

      if (!migrated) localStorage.setItem(MIGRATION_KEY, "1");
    } catch {}

    // Provide global fallbacks early so inline scripts don't explode if host rules are deferred.
    if (typeof window.shouldForceScramjetForUrl !== "function") {
      window.shouldForceScramjetForUrl = function () {
        return false;
      };
    }
    if (typeof window.shouldAvoidScramjetForUrl !== "function") {
      window.shouldAvoidScramjetForUrl = function () {
        return false;
      };
    }
  }

  function parseArgonWorkerTarget(inputUrl) {
    const raw = (typeof inputUrl === "string" ? inputUrl : String(inputUrl || "")).trim();
    if (!raw) return null;
    try {
      const parsed = new URL(raw, location.origin);
      const proxied = parsed.pathname.match(/^\/ag\/(https?)\/([^/]+)(?:\/|$)/i);
      if (proxied) {
        return { protocol: proxied[1].toLowerCase(), host: decodeURIComponent(proxied[2]).toLowerCase() };
      }
      if ((parsed.protocol === "http:" || parsed.protocol === "https:") && parsed.origin !== location.origin) {
        return { protocol: parsed.protocol.slice(0, -1), host: parsed.host.toLowerCase() };
      }
    } catch {}
    return null;
  }

  function removeLegacyArgonWorkers() {
    if (legacyArgonCleanupPromise) return legacyArgonCleanupPromise;
    legacyArgonCleanupPromise = (async () => {
      if (!("serviceWorker" in navigator)) return false;
      const registrations = await navigator.serviceWorker.getRegistrations();
      const removals = registrations.map((registration) => {
        const isArgon = registration.active?.scriptURL.includes("/argon_service_worker.js")
          || registration.installing?.scriptURL.includes("/argon_service_worker.js")
          || registration.waiting?.scriptURL.includes("/argon_service_worker.js");
        return isArgon ? registration.unregister() : Promise.resolve(false);
      });
      await Promise.allSettled(removals);
      return true;
    })().catch((error) => {
      console.warn("Could not remove a legacy Argon worker", error);
      return false;
    });
    return legacyArgonCleanupPromise;
  }

  async function ensureArgonWorkerForTarget(inputUrl) {
    if (!("serviceWorker" in navigator)) return false;
    const target = parseArgonWorkerTarget(inputUrl);
    if (!target) return false;

    const scope = `/ag/${target.protocol}/${target.host}/`;
    if (argonWorkerPromises.has(scope)) return argonWorkerPromises.get(scope);

    const pending = (async () => {
      await removeLegacyArgonWorkers();
      // Argon is mounted as a Fastify route in this app. Registering Argon's
      // browser worker makes refreshes pass an already-proxied URL through the
      // proxy a second time. The injected runtime still rewrites dynamic URLs.
      return true;
    })().catch((error) => {
      console.warn("Could not prepare the Argon worker for", target.host, error);
      return false;
    }).finally(() => {
      argonWorkerPromises.delete(scope);
    });

    argonWorkerPromises.set(scope, pending);
    return pending;
  }

  window.ensureArgonWorkerForTarget = ensureArgonWorkerForTarget;

  // Clean up workers left by older builds before the next proxied navigation.
  void removeLegacyArgonWorkers();

  function installBareMuxPortBridge() {
    // bare-mux SW asks a client for a MessagePort by posting {type:"getPort", port:<MessagePort>}.
    // We reply by creating the SharedWorker and transferring its port back over event.data.port.
    if (!("serviceWorker" in navigator)) return;
    if (typeof SharedWorker !== "function") return;

    // Warm the SharedWorker early so the SW <-> client handshake completes within bare-mux's 1s timeout
    // on a fresh profile/session.
    try {
      const warm = new SharedWorker("/baremux/worker.js?v=bw1", "bare-mux-worker");
      try { warm.port.start(); } catch {}
      // Keep a reference so the worker isn't immediately GC'd.
      window.__baremuxWarmWorker = warm;
      try { localStorage.setItem("bare-mux-path", "/baremux/worker.js?v=bw1"); } catch {}
    } catch {}

    if (!(window.__baremuxActiveBridges instanceof Set)) {
      window.__baremuxActiveBridges = new Set();
    }

    // NOTE: We do NOT transfer the SharedWorker's port directly. Some environments treat it
    // as an "invalid MessagePort" once it crosses contexts. Instead we return a MessageChannel
    // port and proxy messages between it and the SharedWorker port.
    navigator.serviceWorker.addEventListener("message", (event) => {
      try {
        const data = event && event.data;
        const reply = data?.port || (event?.ports && event.ports[0]);
        if (!data || data.type !== "getPort" || !reply) return;

        const worker = window.__baremuxWarmWorker || new SharedWorker("/baremux/worker.js?v=bw1", "bare-mux-worker");
        try { worker.port.start(); } catch {}

        const bridge = new MessageChannel();
        try { bridge.port1.start(); } catch {}
        try { bridge.port2.start(); } catch {}
        try { reply.start && reply.start(); } catch {}
        const bridgeState = { bridge, worker, reply };
        window.__baremuxActiveBridges.add(bridgeState);

        bridge.port1.onmessage = (ev) => {
          try {
            worker.port.postMessage(ev.data, ev.ports || []);
          } catch {}
        };

        worker.port.onmessage = (ev) => {
          try {
            bridge.port1.postMessage(ev.data, ev.ports || []);
          } catch {}
        };

        reply.postMessage(bridge.port2, [bridge.port2]);
      } catch (err) {
        // If we fail here, the SW will retry / fallback; don't spam the console.
        // eslint-disable-next-line no-console
        console.debug("proxy-runtime: failed to provide bare-mux port:", err);
      }
    });
  }

  function shouldHardRepair(reason) {
    const text = safeLower(reason);
    return (
      text.includes("all clients returned an invalid messageport") ||
      text.includes("invalid messageport") ||
      text.includes("there are no bare clients") ||
      text.includes("no baretransport was set") ||
      text.includes("failed to get a ping response from the worker") ||
      text.includes("object stores was not found") ||
      text.includes("failed to execute 'transaction' on 'idbdatabase'") ||
      text.includes("failed to get a bare-mux sharedworker messageport")
    );
  }

  async function clearProxyRuntimeData() {
    let keepProxy = null;
    let keepTransport = null;
    try {
      keepProxy = localStorage.getItem("proxy");
      keepTransport = localStorage.getItem("transport");
    } catch {}

    // Best-effort cleanup; ignore failures (permissions, blocked IDB, etc).
    try {
      if ("caches" in window) {
        const keys = await caches.keys();
        await Promise.all(keys.filter((k) => /uv|bare|mux|scram|epoxy|eclipse/i.test(k)).map((k) => caches.delete(k)));
      }
    } catch {}

    try {
      if ("serviceWorker" in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map((r) => r.unregister()));
      }
    } catch {}

    try {
      if ("indexedDB" in window && typeof indexedDB.databases === "function") {
        const dbs = await indexedDB.databases();
        const names = new Set(["bare-mux", "baremux", "bare-mux-db", "baremux-db"]);
        for (const db of dbs || []) {
          const n = db && db.name;
          if (n && /bare|mux|uv|scram|epoxy|eclipse|idbmap/i.test(n)) names.add(n);
        }
        await Promise.all(
          Array.from(names).map(
            (name) =>
              new Promise((resolve) => {
                try {
                  const req = indexedDB.deleteDatabase(name);
                  req.onsuccess = () => resolve();
                  req.onerror = () => resolve();
                  req.onblocked = () => resolve();
                } catch {
                  resolve();
                }
              })
          )
        );
      }
    } catch {}

    // Re-apply desired defaults after cleanup.
    try {
      localStorage.setItem("transport", keepTransport || "epoxy");
      localStorage.setItem("proxy", keepProxy || "ag");
    } catch {}
  }

  async function hardRepair(reason) {
    try {
      if (sessionStorage.getItem(SESSION_GUARD_KEY) === "1") return;
      sessionStorage.setItem(SESSION_GUARD_KEY, "1");
    } catch {
      // If sessionStorage is blocked, still try once per load.
    }

    // eslint-disable-next-line no-console
    console.warn("proxy-runtime: running automatic repair:", reason);
    await clearProxyRuntimeData();

    // Hard reload to ensure SW + workers are recreated cleanly.
    try {
      location.reload();
    } catch {}
  }

  function installAutoRepair() {
    // Catch unhandled promise rejections and runtime errors.
    window.addEventListener("unhandledrejection", (e) => {
      const r = e && (e.reason || e);
      const msg = (r && (r.message || r.toString && r.toString())) || "";
      if (shouldHardRepair(msg)) hardRepair("unhandledrejection: " + msg);
    });

    window.addEventListener("error", (e) => {
      const msg = (e && (e.message || (e.error && e.error.message))) || "";
      if (shouldHardRepair(msg)) hardRepair("error: " + msg);
    });

    // If bare-mux is stuck retrying, auto-repair (debounced by a burst counter).
    const BURST_WINDOW_MS = 2500;
    const BURST_THRESHOLD = 5;
    let burstStart = 0;
    let burstCount = 0;
    const origWarn = console.warn.bind(console);

    console.warn = function (...args) {
      try {
        const text = safeLower(args.join(" "));
        if (
          text.includes("failed to get a bare-mux sharedworker messageport") ||
          text.includes("failed to get a ping response from the worker")
        ) {
          const now = Date.now();
          if (!burstStart || now - burstStart > BURST_WINDOW_MS) {
            burstStart = now;
            burstCount = 0;
          }
          burstCount++;
          if (burstCount >= BURST_THRESHOLD) {
            hardRepair("console.warn burst: bare-mux MessagePort");
          }
        }
      } catch {}
      return origWarn(...args);
    };
  }

  function installInjectedAdCleanup() {
    const BLOCKED_HOST_SNIPPETS = [
      "spacefree.space",
      "traff.world",
      "pebblepilot.com",
    ];
    const TEXT_PATTERNS = [
      /click to update now/i,
      /antivirus update ready/i,
      /mcafee/i,
    ];
    const observedDocs = new WeakSet();

    function includesBlockedHost(value) {
      const text = safeLower(value);
      return BLOCKED_HOST_SNIPPETS.some((host) => text.includes(host));
    }

    function getClassText(el) {
      try {
        return safeLower(el.className && typeof el.className === "string" ? el.className : "");
      } catch {
        return "";
      }
    }

    function isAdLikeElement(el) {
      if (!(el instanceof Element)) return false;

      const classText = getClassText(el);
      const idText = safeLower(el.id || "");
      const attrs = [
        el.getAttribute("data-link"),
        el.getAttribute("href"),
        el.getAttribute("src"),
        el.getAttribute("srcset"),
        el.getAttribute("data-src"),
      ];

      if (attrs.some((value) => includesBlockedHost(value))) return true;
      if (classText.includes("el-notify-box")) return true;
      if (classText.includes("rp-inpage")) return true;
      if (classText.includes("notify-block-link")) return true;
      if (/^notify-\d+$/.test(idText) && classText.includes("el-notification")) return true;

      const text = safeLower((el.textContent || "").slice(0, 400));
      if ((classText.includes("notify") || classText.includes("rp-")) && TEXT_PATTERNS.some((re) => re.test(text))) {
        return true;
      }

      return false;
    }

    function getRemovalTarget(el) {
      try {
        return el.closest(
          ".el-notify-box, [class*='rp-inpage'], [class*='notify-block-link'], [id^='notify-']"
        ) || el;
      } catch {
        return el;
      }
    }

    function removeIfAd(el) {
      if (!isAdLikeElement(el)) return false;
      const target = getRemovalTarget(el);
      try {
        target.remove();
      } catch {
        try {
          target.style.setProperty("display", "none", "important");
          target.style.setProperty("visibility", "hidden", "important");
          target.style.setProperty("pointer-events", "none", "important");
        } catch {}
      }
      return true;
    }

    function scanRoot(root) {
      if (!root || typeof root.querySelectorAll !== "function") return;
      const selectors = [
        ".el-notify-box",
        "[class*='rp-inpage']",
        "[class*='notify-block-link']",
        "[data-link*='spacefree.space']",
        "[data-link*='traff.world']",
        "[src*='spacefree.space']",
        "[src*='pebblepilot.com']",
        "[href*='spacefree.space']",
        "[href*='traff.world']",
        "[id^='notify-']",
      ];
      for (const el of root.querySelectorAll(selectors.join(", "))) {
        removeIfAd(el);
      }
    }

    function observeDocument(doc) {
      if (!doc || observedDocs.has(doc)) return;
      observedDocs.add(doc);

      const start = () => {
        scanRoot(doc);

        const observer = new MutationObserver((mutations) => {
          for (const mutation of mutations) {
            for (const node of mutation.addedNodes || []) {
              if (!(node instanceof Element)) continue;
              if (!removeIfAd(node)) scanRoot(node);
              if (node.tagName === "IFRAME") {
                try {
                  node.addEventListener("load", () => observeDocument(node.contentDocument));
                  observeDocument(node.contentDocument);
                } catch {}
              }
            }
          }
        });

        try {
          observer.observe(doc.documentElement || doc, { childList: true, subtree: true });
        } catch {}

        try {
          for (const frame of doc.querySelectorAll("iframe")) {
            frame.addEventListener("load", () => observeDocument(frame.contentDocument));
            observeDocument(frame.contentDocument);
          }
        } catch {}
      };

      if (doc.readyState === "loading") {
        doc.addEventListener("DOMContentLoaded", start, { once: true });
      } else {
        start();
      }
    }

    observeDocument(document);
  }

  ensureDefaults();
  installBareMuxPortBridge();
  installAutoRepair();
  installInjectedAdCleanup();
})();
