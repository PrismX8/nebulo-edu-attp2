import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import { PassThrough, Readable } from "node:stream";
import { lookup as lookupMimeType } from "mime-types";

export const PLATINUM_ORIGIN = "https://platinumunblocker.com";
export const PLATINUM_MOUNT = "/games/platinum";

const TEXT_LIMIT = 16 * 1024 * 1024;
const textTypes = /(?:text\/|javascript|json|xml|svg)/i;
const assetPath = /\.(?:html?|js|mjs|css|json|xml|txt|map|wasm|pck|data|mem|unityweb|unity3d|bundle|bin|br|gz|zip|swf|png|jpe?g|webp|gif|svg|ico|avif|mp3|ogg|wav|m4a|mp4|webm|ogv|ttf|otf|woff2?|eot|atlas|fnt)(?:[?#].*)?$/i;

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
  // Normalize older mirror output first so this transform stays idempotent.
  output = output.replaceAll(`${PLATINUM_MOUNT}/`, "/");
  output = output
    .replaceAll(`${PLATINUM_ORIGIN}/`, `${PLATINUM_MOUNT}/`)
    .replaceAll("//platinumunblocker.com/", `${PLATINUM_MOUNT}/`);

  if (/html/i.test(contentType)) {
    // Remove the obfuscated script injected into many upstream entry pages. It
    // runs after the legitimate loader and can lock the browser's main thread.
    output = output.replace(
      /<script\b[^>]*>(?:(?!<\/script>)[\s\S])*?function xsh\(b\)(?:(?!<\/script>)[\s\S])*?<\/script>\s*/gi,
      ""
    );
    // Keep mirrored games launchable as normal pages as well as inside Nebulo
    // tabs. The upstream wrapper otherwise redirects top-level launches away.
    output = output.replace(
      /<script\b[^>]*>\s*if\s*\(\s*window\.top\s*===\s*window\.self\s*\)\s*\{\s*window\.location\.href\s*=\s*["']\.\.\/\.\.\/\.\.\/["']\s*;?\s*\}\s*<\/script>\s*/gi,
      ""
    );
    // This is an upstream site-shell script, not a game dependency. The source
    // currently returns 502 and blocks parser-driven launch sequences.
    output = output.replace(
      /<script\b[^>]*\bsrc\s*=\s*["'](?:\/games\/platinum)?\/js\/main\.js(?:\?[^"']*)?["'][^>]*>\s*<\/script>\s*/gi,
      ""
    );
    // Remove dead host integrations that are unrelated to game startup. These
    // files were analytics, site chrome, or ad SDK hooks on the source host.
    output = output.replace(
      /<script\b[^>]*\bsrc\s*=\s*["'][^"']*(?:analytics_ubg_v1_4\.js|ubg235_client_v1_1\.js|detectmobilebrowser\.js|production-assetsbucket-[^"']*(?:%2F|\/)scr\.js|hextris\.io\/scripts\/a\.html|\/cloak\.js|patch\/js\/null\.js\?https:\/\/www\.googletagmanager\.com\/gtag\/js[^"']*)["'][^>]*>\s*<\/script>\s*/gi,
      ""
    );
    // Some upstream entries point a <base> tag at jsDelivr even though their
    // complete game bundle is mirrored beside the entry page. Keep relative
    // scripts, workers, and media on Nebulo instead of escaping to that CDN.
    output = output.replace(
      /(<base\b[^>]*\bhref\s*=\s*["'])https?:\/\/[^"']+\/(\s*["'][^>]*>)/gi,
      "$1./$2"
    );
    output = output.replace(
      /(\b(?:src|href|poster|action|data-src)\s*=\s*["'])\/(?!\/)([^"']*)(["'])/gi,
      `$1${PLATINUM_MOUNT}/$2$3`
    );
  }

  // Limit JS-string rewriting to URL-shaped asset filenames. This avoids changing
  // path separators such as split("/") inside minified game engines.
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

function getContentType(filePath, metadata = {}) {
  return metadata.contentType || lookupMimeType(filePath) || "application/octet-stream";
}

async function readMetadata(filePath) {
  try {
    return JSON.parse(await fsp.readFile(`${filePath}.meta.json`, "utf8"));
  } catch {
    return {};
  }
}

async function writeMetadata(filePath, metadata) {
  await fsp.writeFile(`${filePath}.meta.json`, `${JSON.stringify(metadata)}\n`, "utf8");
}

function parseRange(rangeHeader, size) {
  const match = /^bytes=(\d*)-(\d*)$/i.exec(String(rangeHeader || "").trim());
  if (!match) return null;
  let start = match[1] ? Number(match[1]) : NaN;
  let end = match[2] ? Number(match[2]) : NaN;
  if (Number.isNaN(start) && Number.isNaN(end)) return null;
  if (Number.isNaN(start)) {
    start = Math.max(0, size - end);
    end = size - 1;
  } else if (Number.isNaN(end)) {
    end = size - 1;
  }
  if (start < 0 || end < start || start >= size) return null;
  return { start, end: Math.min(end, size - 1) };
}

async function sendCachedFile(request, reply, filePath) {
  const stat = await fsp.stat(filePath);
  const metadata = await readMetadata(filePath);
  const range = parseRange(request.headers.range, stat.size);
  reply.header("Accept-Ranges", "bytes");
  reply.header(
    "Cache-Control",
    /\.html?$/i.test(filePath) ? "no-cache" : "public, max-age=31536000, immutable"
  );
  reply.type(getContentType(filePath, metadata));

  if (request.headers.range && !range) {
    return reply.code(416).header("Content-Range", `bytes */${stat.size}`).send();
  }

  if (range) {
    const length = range.end - range.start + 1;
    reply.code(206);
    reply.header("Content-Range", `bytes ${range.start}-${range.end}/${stat.size}`);
    reply.header("Content-Length", length);
    if (request.method === "HEAD") return reply.send();
    return reply.send(fs.createReadStream(filePath, range));
  }

  reply.header("Content-Length", stat.size);
  if (request.method === "HEAD") return reply.send();
  return reply.send(fs.createReadStream(filePath));
}

async function cacheTextResponse(response, filePath, contentType) {
  const original = await response.text();
  const rewritten = rewritePlatinumText(original, contentType);
  const body = Buffer.from(rewritten);
  await fsp.mkdir(path.dirname(filePath), { recursive: true });
  await fsp.writeFile(filePath, body);
  await writeMetadata(filePath, { contentType, source: response.url });
  return body;
}

function streamAndCacheResponse(response, filePath) {
  const clientStream = new PassThrough();
  const sourceStream = Readable.fromWeb(response.body);
  const temporaryPath = `${filePath}.${process.pid}.${Date.now()}.part`;

  fsp.mkdir(path.dirname(filePath), { recursive: true }).then(() => {
    const cacheStream = fs.createWriteStream(temporaryPath);
    sourceStream.pipe(clientStream);
    sourceStream.pipe(cacheStream);
    sourceStream.on("error", (error) => {
      clientStream.destroy(error);
      cacheStream.destroy(error);
      fsp.rm(temporaryPath, { force: true }).catch(() => {});
    });
    cacheStream.on("finish", async () => {
      try {
        await fsp.rename(temporaryPath, filePath);
        await writeMetadata(filePath, {
          contentType: response.headers.get("content-type") || "application/octet-stream",
          source: response.url,
        });
      } catch {
        await fsp.rm(temporaryPath, { force: true }).catch(() => {});
      }
    });
  }).catch((error) => clientStream.destroy(error));

  return clientStream;
}

export function registerPlatinumGameMirrorRoutes(fastify, { cacheRoot }) {
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

      const filePath = getPlatinumCachePath(cacheRoot, remoteUrl);
      if (fs.existsSync(filePath)) return sendCachedFile(request, reply, filePath);

      const upstreamHeaders = {
        accept: String(request.headers.accept || "*/*"),
        "accept-encoding": "identity",
        referer: `${PLATINUM_ORIGIN}/`,
        "user-agent": String(request.headers["user-agent"] || "NebuloGameMirror/1.0"),
      };
      if (request.headers.range) upstreamHeaders.range = String(request.headers.range);

      let response;
      try {
        response = await fetch(remoteUrl, {
          method: request.method,
          headers: upstreamHeaders,
          redirect: "follow",
          signal: AbortSignal.timeout(45_000),
        });
      } catch (error) {
        request.log.warn({ error, remoteUrl: remoteUrl.toString() }, "game mirror fetch failed");
        return reply.code(502).send({ error: "Game asset is temporarily unavailable" });
      }

      const contentType = response.headers.get("content-type") || getContentType(filePath);
      const contentLength = Number(response.headers.get("content-length") || 0);
      reply.code(response.status);
      reply.type(contentType);
      reply.header("Accept-Ranges", response.headers.get("accept-ranges") || "bytes");
      reply.header(
        "Cache-Control",
        /html/i.test(contentType) ? "no-cache" : "public, max-age=31536000, immutable"
      );
      if (response.headers.get("content-range")) reply.header("Content-Range", response.headers.get("content-range"));
      if (contentLength) reply.header("Content-Length", contentLength);

      if (request.method === "HEAD" || !response.body) return reply.send();
      if (!response.ok) return reply.send(Readable.fromWeb(response.body));

      const shouldTransform = !request.headers.range && textTypes.test(contentType) && contentLength <= TEXT_LIMIT;
      if (shouldTransform) {
        const body = await cacheTextResponse(response, filePath, contentType);
        reply.header("Content-Length", body.length);
        return reply.send(body);
      }

      if (request.headers.range) return reply.send(Readable.fromWeb(response.body));
      return reply.send(streamAndCacheResponse(response, filePath));
    },
  });
}
