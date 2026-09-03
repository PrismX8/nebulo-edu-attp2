import { PassThrough, Readable } from "node:stream";
import path from "node:path";
import { lookup as lookupMimeType } from "mime-types";

export const PLATINUM_ORIGIN = "https://platinumunblocker.com";
export const PLATINUM_MOUNT = "/games/platinum";

const UPSTREAM_TIMEOUT_MS = 45_000;
const TEXT_REWRITE_LIMIT = 16 * 1024 * 1024;
const textTypes = /(?:text\/|javascript|json|xml|svg)/i;
const assetPath = /\.(?:html?|js|mjs|css|json|xml|txt|map|wasm|pck|data|mem|unityweb|unity3d|bundle|bin|br|gz|zip|swf|png|jpe?g|webp|gif|svg|ico|avif|mp3|ogg|wav|m4a|mp4|webm|ogv|ttf|otf|woff2?|eot|atlas|fnt)(?:[?#].*)?$/i;

const PASSTHROUGH_RESPONSE_HEADERS = new Set([
  "content-type",
  "content-length",
  "content-range",
  "accept-ranges",
  "etag",
  "last-modified",
  "content-encoding",
  "cache-control",
]);

function safeSegment(segment) {
  let decoded = segment;
  try {
    decoded = decodeURIComponent(segment);
  } catch {}
  return encodeURIComponent(decoded).replace(/%2F/gi, "%252F");
}

export function getPlatinumCachePath(cacheRoot, remoteUrl) {
  const url = remoteUrl instanceof URL ? remoteUrl : new URL(remoteUrl);
  const segments = url.pathname.split("/").filter(Boolean).map(safeSegment);
  if (!segments.length || url.pathname.endsWith("/")) segments.push("index.html");
  return path.join(cacheRoot, ...segments);
}

export function toPlatinumLocalUrl(remoteUrl) {
  const url = remoteUrl instanceof URL ? remoteUrl : new URL(remoteUrl);
  if (url.origin !== PLATINUM_ORIGIN) return url.toString();
  return `${PLATINUM_MOUNT}${url.pathname}${url.search}`;
}

export function toPlatinumRemoteUrl(localPath) {
  const raw = String(localPath || "").split("?")[0].replace(/^\/+/, "");
  const url = new URL(`/${raw}`, PLATINUM_ORIGIN);
  if (url.origin !== PLATINUM_ORIGIN || url.pathname.includes("..")) {
    throw new Error("Invalid mirrored game path");
  }
  return url;
}

export function rewritePlatinumText(text, contentType = "") {
  let output = String(text || "");
  output = output.replaceAll(`${PLATINUM_MOUNT}/`, "/");
  output = output
    .replaceAll(`${PLATINUM_ORIGIN}/`, `${PLATINUM_MOUNT}/`)
    .replaceAll("//platinumunblocker.com/", `${PLATINUM_MOUNT}/`);

  if (/html/i.test(contentType)) {
    output = output.replace(
      /<script\b[^>]*>(?:(?!<\/script>)[\s\S])*?function xsh\(b\)(?:(?!<\/script>)[\s\S])*?<\/script>\s*/gi,
      ""
    );
    output = output.replace(
      /<script\b[^>]*>\s*if\s*\(\s*window\.top\s*===\s*window\.self\s*\)\s*\{\s*window\.location\.href\s*=\s*["']\.\.\/\.\.\/\.\.\/["']\s*;?\s*\}\s*<\/script>\s*/gi,
      ""
    );
    output = output.replace(
      /<script\b[^>]*\bsrc\s*=\s*["'](?:\/games\/platinum)?\/js\/main\.js(?:\?[^"']*)?["'][^>]*>\s*<\/script>\s*/gi,
      ""
    );
    output = output.replace(
      /<script\b[^>]*\bsrc\s*=\s*["'][^"']*(?:analytics_ubg_v1_4\.js|ubg235_client_v1_1\.js|detectmobilebrowser\.js|production-assetsbucket-[^"']*(?:%2F|\/)scr\.js|hextris\.io\/scripts\/a\.html|\/cloak\.js|patch\/js\/null\.js\?https:\/\/www\.googletagmanager\.com\/gtag\/js[^"']*)["'][^>]*>\s*<\/script>\s*/gi,
      ""
    );
    output = output.replace(
      /(<base\b[^>]*\bhref\s*=\s*["'])https?:\/\/[^"']+\/(\s*["'][^>]*>)/gi,
      "$1./$2"
    );
    output = output.replace(
      /(\b(?:src|href|poster|action|data-src)\s*=\s*["'])\/(?!\/)([^"']*)(["'])/gi,
      `$1${PLATINUM_MOUNT}/$2$3`
    );
  }

  output = output.replace(
    /(["'`])\/(?!\/|games\/platinum\/)([^"'`\r\n]*)\1/g,
    (match, quote, value, offset, source) => {
      const before = source.slice(Math.max(0, offset - 12), offset).trimEnd();
      if (before.endsWith("+")) return match;
      if (/\s|[<>{}|\\^*]/.test(value) || !assetPath.test(value)) return match;
      return `${quote}${PLATINUM_MOUNT}/${value}${quote}`;
    }
  );

  if (/css/i.test(contentType)) {
    output = output.replace(
      /(url\(\s*)\/(?!\/|games\/platinum\/)([^)'"\s]+)(\s*\))/gi,
      `$1${PLATINUM_MOUNT}/$2$3`
    );
  }

  return output;
}

function getContentTypeForPath(filePath) {
  return lookupMimeType(filePath) || "application/octet-stream";
}

function buildUpstreamHeaders(request) {
  const headers = {
    accept: String(request.headers.accept || "*/*"),
    "accept-encoding": "identity",
    referer: `${PLATINUM_ORIGIN}/`,
    "user-agent": String(request.headers["user-agent"] || "NebuloGameMirror/1.0"),
  };
  if (request.headers.range) headers.range = String(request.headers.range);
  if (request.headers["if-range"]) headers["if-range"] = String(request.headers["if-range"]);
  if (request.headers["if-none-match"]) headers["if-none-match"] = String(request.headers["if-none-match"]);
  if (request.headers["if-modified-since"]) headers["if-modified-since"] = String(request.headers["if-modified-since"]);
  return headers;
}

function copyResponseHeadersToReply(reply, upstreamHeaders) {
  for (const name of PASSTHROUGH_RESPONSE_HEADERS) {
    const value = upstreamHeaders.get(name);
    if (value) reply.header(name, value);
  }
}

function trackUpstreamAbort(upstreamResponse, clientRequest, log) {
  const onClose = () => {
    if (!upstreamResponse.body) return;
    try {
      upstreamResponse.body.cancel().catch(() => {});
    } catch {}
  };
  clientRequest.once("close", onClose);
  const cleanup = () => clientRequest.off("close", onClose);
  upstreamResponse.body?.once?.("end", cleanup);
  upstreamResponse.body?.once?.("error", cleanup);
}

function readUpstreamIntoMemory(response) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let total = 0;
    const reader = response.body.getReader();
    const pump = async () => {
      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          if (value) {
            total += value.byteLength;
            if (total > TEXT_REWRITE_LIMIT) {
              try { await reader.cancel(); } catch {}
              const error = new Error("Upstream text response exceeded in-memory rewrite limit");
              error.code = "ETEXT_TOO_LARGE";
              reject(error);
              return;
            }
            chunks.push(Buffer.from(value));
          }
        }
        resolve(Buffer.concat(chunks, total));
      } catch (error) {
        reject(error);
      }
    };
    pump();
  });
}

function respondWith502(reply, request, message) {
  request.log?.warn?.({ msg: message }, "game mirror upstream failure");
  return reply.code(502).send({ error: message });
}

export function registerPlatinumGameMirrorRoutes(fastify) {
  fastify.route({
    method: ["GET", "HEAD"],
    url: `${PLATINUM_MOUNT}/*`,
    handler: async (request, reply) => {
      if (String(request.params["*"] || "").endsWith("/undefined/pages/home.html")) {
        return reply.code(204).send();
      }

      let remoteUrl;
      try {
        remoteUrl = toPlatinumRemoteUrl(request.params["*"]);
        const query = request.raw.url?.split("?")[1];
        if (query) remoteUrl.search = query;
      } catch {
        return reply.code(400).send({ error: "Invalid game asset path" });
      }

      const upstreamHeaders = buildUpstreamHeaders(request);
      const abortController = new AbortController();
      const timeoutId = setTimeout(() => abortController.abort(new Error("upstream timeout")), UPSTREAM_TIMEOUT_MS);
      const onClientClose = () => {
        if (!reply.sent && !request.raw.destroyed) return;
        try { abortController.abort(new Error("client disconnected")); } catch {}
      };
      request.raw.once("close", onClientClose);

      let upstreamResponse;
      try {
        upstreamResponse = await fetch(remoteUrl, {
          method: request.method,
          headers: upstreamHeaders,
          redirect: "follow",
          signal: abortController.signal,
        });
      } catch (error) {
        clearTimeout(timeoutId);
        request.raw.off("close", onClientClose);
        return respondWith502(reply, request, `Game asset is temporarily unavailable: ${error?.message || "fetch failed"}`);
      }

      clearTimeout(timeoutId);
      trackUpstreamAbort(upstreamResponse, request.raw, request.log);

      const contentType = upstreamResponse.headers.get("content-type") || getContentTypeForPath(remoteUrl.pathname);
      reply.code(upstreamResponse.status);
      reply.type(contentType);
      copyResponseHeadersToReply(reply, upstreamResponse.headers);
      if (!upstreamResponse.headers.get("accept-ranges")) {
        reply.header("Accept-Ranges", "bytes");
      }
      reply.header(
        "Cache-Control",
        /html/i.test(contentType) ? "no-cache" : "public, max-age=31536000, immutable"
      );

      if (request.method === "HEAD" || !upstreamResponse.body) {
        request.raw.off("close", onClientClose);
        return reply.send();
      }

      const contentLength = Number(upstreamResponse.headers.get("content-length") || 0);
      const shouldRewriteText = !request.headers.range
        && upstreamResponse.ok
        && textTypes.test(contentType)
        && contentLength > 0
        && contentLength <= TEXT_REWRITE_LIMIT;

      if (shouldRewriteText) {
        try {
          const body = await readUpstreamIntoMemory(upstreamResponse);
          const rewritten = rewritePlatinumText(body.toString("utf8"), contentType);
          const buffer = Buffer.from(rewritten, "utf8");
          reply.header("Content-Length", buffer.length);
          request.raw.off("close", onClientClose);
          return reply.send(buffer);
        } catch (error) {
          request.log?.warn?.({ error: error?.message }, "game mirror text rewrite failed; streaming raw body");
        }
      }

      const clientStream = new PassThrough();
      let sourceStream;
      try {
        sourceStream = Readable.fromWeb(upstreamResponse.body);
      } catch (error) {
        request.raw.off("close", onClientClose);
        return respondWith502(reply, request, `Failed to stream game asset: ${error?.message || "stream error"}`);
      }

      sourceStream.pipe(clientStream);
      const onError = (error) => {
        clientStream.destroy(error);
        try { sourceStream.destroy(error); } catch {}
      };
      sourceStream.on("error", onError);
      sourceStream.once("end", () => request.raw.off("close", onClientClose));
      sourceStream.once("close", () => request.raw.off("close", onClientClose));
      request.raw.once("close", () => {
        try { sourceStream.destroy(new Error("client disconnected")); } catch {}
        try { clientStream.destroy(); } catch {}
      });

      return reply.send(clientStream);
    },
  });
}
