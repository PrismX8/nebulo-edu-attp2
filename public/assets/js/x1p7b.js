// Allow the bare-mux worker running in the Service Worker to obtain a SharedWorker MessagePort.
// This must run inside the *window client* (including UV proxied pages), not inside the SW.
(function () {
  "use strict";

  if (!("serviceWorker" in navigator)) return;
  if (typeof SharedWorker !== "function") return;

  // Warm the SharedWorker early so bare-mux can obtain a port within its 1s timeout.
  try {
    const warm = new SharedWorker("/d5/worker.js?v=bw1", "bare-mux-worker");
    try { warm.port.start(); } catch {}
    window.__baremuxWarmWorker = warm;
  } catch {}

  try {
    navigator.serviceWorker.controller?.postMessage({ type: "baremux-helper-ready" });
  } catch {}

  // NOTE: We do NOT transfer the SharedWorker's port directly. Some environments treat it
  // as an "invalid MessagePort" once it crosses contexts. Instead we return a MessageChannel
  // port and proxy messages between it and the SharedWorker port.
  navigator.serviceWorker.addEventListener("message", (event) => {
    try {
      const data = event && event.data;
      const reply = data?.port || (event?.ports && event.ports[0]);
      if (!data || data.type !== "getPort" || !reply) return;

      const worker = window.__baremuxWarmWorker || new SharedWorker("/d5/worker.js?v=bw1", "bare-mux-worker");
      try { worker.port.start(); } catch {}

      const bridge = new MessageChannel();

      // SW -> bridge -> SharedWorker
      bridge.port1.onmessage = (ev) => {
        try {
          // Forward any transferred ports as-is (bare-mux uses them heavily).
          worker.port.postMessage(ev.data, ev.ports || []);
        } catch {}
      };

      // SharedWorker -> bridge -> SW
      worker.port.onmessage = (ev) => {
        try {
          bridge.port1.postMessage(ev.data, ev.ports || []);
        } catch {}
      };

      // Give SW the port it will treat as the "bare-mux worker port".
      reply.postMessage(bridge.port2, [bridge.port2]);
    } catch {
      // bare-mux will retry; keep this silent to avoid spamming the console.
    }
  });
})();
