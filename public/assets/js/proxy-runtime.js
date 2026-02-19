// Global proxy runtime bootstrap + self-healing.
// Goals:
// 1) Ensure the service worker can always obtain a valid bare-mux SharedWorker MessagePort
//    even before any page constructs a BareMuxConnection.
// 2) Auto-repair broken caches/IndexedDB state that causes "invalid MessagePort",
//    "no bare clients", or missing object stores.
// 3) Set sane defaults (epoxy transport + Scramjet proxy) when no user preference exists.

(function () {
  "use strict";

  const SESSION_GUARD_KEY = "proxy_runtime_hard_repair_done";

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
    const MIGRATION_KEY = "proxy_defaults_migrated_v2";
    const migrated = localStorage.getItem(MIGRATION_KEY) === "1";
    try {
      const t = localStorage.getItem("transport");
      if (!t) localStorage.setItem("transport", "epoxy");
      else if (!migrated && t === "libcurl") localStorage.setItem("transport", "epoxy");

      const p = localStorage.getItem("proxy");
      if (!p) localStorage.setItem("proxy", "sj");

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
    } catch {}

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
      localStorage.setItem("proxy", keepProxy || "sj");
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
        if (text.includes("failed to get a bare-mux sharedworker messageport")) {
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

  ensureDefaults();
  installBareMuxPortBridge();
  installAutoRepair();
})();
