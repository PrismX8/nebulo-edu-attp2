// Patched bare-mux SharedWorker.
// This is based on @mercuryworkshop/bare-mux/dist/worker.js, with one key change:
// when libcurl transport receives a request for an unsupported protocol (ex: data:, blob:),
// we fall back to native fetch (when possible) or return a synthetic 204/400 response
// instead of throwing (which spams the console and breaks page loads).
//
// Served at /baremux/worker.js via an explicit Fastify route (see app.js).

/* eslint-disable no-console */

(function () {
  "use strict";

  const postMessage = MessagePort.prototype.postMessage;

  let transport = null;
  let transportName = "";
  let canTransferStreams = null;

  function detectTransferableStreams() {
    if (canTransferStreams !== null) return canTransferStreams;
    const ch = new MessageChannel();
    const rs = new ReadableStream();
    try {
      postMessage.call(ch.port1, rs, [rs]);
      canTransferStreams = true;
    } catch {
      canTransferStreams = false;
    }
    return canTransferStreams;
  }

  function errorReply(replyPort, err, kind) {
    console.error(`error while processing '${kind}':`, err);
    replyPort.postMessage({ type: "error", error: err });
  }

  function noTransportError() {
    return new Error("there are no bare clients", {
      cause:
        "No BareTransport was set. Try creating a BareMuxConnection and calling `setTransport()` or `setManualTransport()` on it before using BareClient.",
    });
  }

  function forwardToRemotePort(message, replyPort) {
    const p = transport; // MessagePort
    const transfer = [replyPort];
    if (message.fetch && message.fetch.body) transfer.push(message.fetch.body);
    if (message.websocket && message.websocket.channel) transfer.push(message.websocket.channel);
    postMessage.call(p, { message, port: replyPort }, transfer);
  }

  async function nativeFetchAsBareResponse(urlObj, message) {
    // Only a couple of schemes make sense to fetch here.
    const proto = urlObj.protocol;
    if (proto !== "blob:" && proto !== "data:" && proto !== "http:" && proto !== "https:") {
      const body = new TextEncoder().encode(`Unsupported protocol: ${proto}`).buffer;
      return {
        status: 400,
        statusText: "Bad Request",
        headers: { "content-type": "text/plain; charset=utf-8" },
        body,
      };
    }

    // Most blob:/data: use GET; preserve method when reasonable.
    const method = String(message.fetch?.method || "GET").toUpperCase();
    const safeMethod = method === "GET" || method === "HEAD" ? method : "GET";

    let res;
    try {
      res = await fetch(urlObj.toString(), {
        method: safeMethod,
        headers: message.fetch?.headers || {},
        // blob:/data: bodies are rarely meaningful; omit.
      });
    } catch (e) {
      const body = new TextEncoder().encode(String(e?.message || e)).buffer;
      return {
        status: 502,
        statusText: "Bad Gateway",
        headers: { "content-type": "text/plain; charset=utf-8" },
        body,
      };
    }

    const headers = {};
    try {
      for (const [k, v] of res.headers.entries()) headers[k] = v;
    } catch {}

    const status = res.status || 0;
    const statusText = res.statusText || "";
    let body = null;
    try {
      if (safeMethod !== "HEAD") body = await res.arrayBuffer();
    } catch {
      body = new ArrayBuffer(0);
    }

    return { status, statusText, headers, body };
  }

  async function handleFetch(message, replyPort) {
    const urlObj = new URL(message.fetch.remote);
    const proto = urlObj.protocol;

    // If the transport is unset, fail fast with the same error bare-mux expects.
    if (!transport) throw noTransportError();

    // Remote transport (MessagePort) can decide how to handle schemes; just forward.
    if (transport instanceof MessagePort) {
      forwardToRemotePort(message, replyPort);
      return;
    }

    // If the URL is not http(s), libcurl will throw "Unsupported protocol".
    // Handle the common in-browser schemes ourselves to avoid spamming errors.
    if (proto !== "http:" && proto !== "https:") {
      const bare = await nativeFetchAsBareResponse(urlObj, message);
      postMessage.call(replyPort, { type: "fetch", fetch: bare }, bare.body instanceof ArrayBuffer ? [bare.body] : []);
      return;
    }

    transport.ready || (await transport.init());

    // libcurl-transport expects headers/requestHeaders to be iterable pairs (e.g. Headers or Array<[k,v]>),
    // but bare-mux clients commonly send a plain object.
    let headersForTransport = message.fetch.headers;
    if (typeof transportName === "string" && transportName.includes("libcurl")) {
      if (headersForTransport && typeof headersForTransport[Symbol.iterator] !== "function") {
        headersForTransport = Object.entries(headersForTransport);
      }
      if (!headersForTransport) headersForTransport = [];
    }

    const bare = await transport.request(urlObj, message.fetch.method, message.fetch.body, headersForTransport, null);

    // If the browser can't transfer streams, convert to ArrayBuffer so postMessage works.
    if (!detectTransferableStreams() && bare.body instanceof ReadableStream) {
      const r = new Response(bare.body);
      bare.body = await r.arrayBuffer();
    }

    if (bare.body instanceof ReadableStream || bare.body instanceof ArrayBuffer) {
      postMessage.call(replyPort, { type: "fetch", fetch: bare }, [bare.body]);
    } else {
      postMessage.call(replyPort, { type: "fetch", fetch: bare });
    }
  }

  async function handleWebSocket(message, replyPort) {
    if (!transport) throw noTransportError();
    if (transport instanceof MessagePort) {
      forwardToRemotePort(message, replyPort);
      return;
    }

    transport.ready || (await transport.init());

    let wsHeadersForTransport = message.websocket.requestHeaders;
    if (typeof transportName === "string" && transportName.includes("libcurl")) {
      if (wsHeadersForTransport && typeof wsHeadersForTransport[Symbol.iterator] !== "function") {
        wsHeadersForTransport = Object.entries(wsHeadersForTransport);
      }
      if (!wsHeadersForTransport) wsHeadersForTransport = [];
    }

    const [send, close] = transport.connect(
      new URL(message.websocket.url),
      message.websocket.protocols,
      wsHeadersForTransport,
      (arg) => postMessage.call(message.websocket.channel, { type: "open", args: [arg] }),
      (arg) => {
        if (arg instanceof ArrayBuffer) postMessage.call(message.websocket.channel, { type: "message", args: [arg] }, [arg]);
        else postMessage.call(message.websocket.channel, { type: "message", args: [arg] });
      },
      (code, reason) => postMessage.call(message.websocket.channel, { type: "close", args: [code, reason] }),
      (arg) => postMessage.call(message.websocket.channel, { type: "error", args: [arg] })
    );

    message.websocket.channel.onmessage = (e) => {
      if (e.data.type === "data") send(e.data.data);
      else if (e.data.type === "close") close(e.data.closeCode, e.data.closeReason);
    };

    postMessage.call(replyPort, { type: "websocket" });
  }

  function bindPort(port) {
    port.onmessage = async (ev) => {
      const replyPort = ev.data.port;
      const msg = ev.data.message;

      if (msg.type === "ping") {
        postMessage.call(replyPort, { type: "pong" });
        return;
      }

      if (msg.type === "set") {
        try {
          const AsyncFunction = async function () {}.constructor;
          if (msg.client.function === "bare-mux-remote") {
            transport = msg.client.args[0];
            transportName = `bare-mux-remote (${msg.client.args[1]})`;
          } else {
            const fn = new AsyncFunction(msg.client.function);
            const [TransportClass, name] = await fn();
            transport = new TransportClass(...msg.client.args);
            transportName = name;
          }
          console.log("set transport to", transport, transportName);
          postMessage.call(replyPort, { type: "set" });
        } catch (e) {
          errorReply(replyPort, e, "set");
        }
        return;
      }

       if (msg.type === "get") {
        postMessage.call(replyPort, { type: "get", name: transportName });
        return;
      }

      if (msg.type === "fetch") {
        try {
          await handleFetch(msg, replyPort);
        } catch (e) {
          errorReply(replyPort, e, "fetch");
        }
        return;
      }

      if (msg.type === "websocket") {
        try {
          await handleWebSocket(msg, replyPort);
        } catch (e) {
          errorReply(replyPort, e, "websocket");
        }
      }
    };
  }

  // Force all clients to refresh their port once this worker loads.
  try {
    new BroadcastChannel("bare-mux").postMessage({ type: "refreshPort" });
  } catch {}

  self.onconnect = (e) => {
    bindPort(e.ports[0]);
  };

  console.debug("bare-mux: patched worker loaded");
})();
