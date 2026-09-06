import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { lookup } from 'mime-types';

const DEFAULT_CACHE = fileURLToPath(new URL('../game-cache/platinum/', import.meta.url));
const TEXT_LIMIT = 16 * 1024 * 1024;
const REWRITE_VERSION = 'games-20260905-2';

export function parseByteRange(value, size) {
  if (!value) return null;
  const match = /^bytes=(\d*)-(\d*)$/.exec(value);
  // Ignore unsupported multi-range/malformed headers; RFC permits a full response.
  if (!match || (!match[1] && !match[2])) return null;
  const start = match[1] ? Number(match[1]) : Math.max(0, size - Number(match[2]));
  const end = match[1] && match[2] ? Math.min(Number(match[2]), size - 1) : size - 1;
  if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start > end || start >= size) return false;
  return { start, end };
}

function contentType(url, meta) {
  const uncompressed = url.pathname.replace(/\.(?:br|gz)$/i, '');
  const inferred = lookup(uncompressed);
  // Some hosts label WASM and JS as octet-stream, breaking streaming compilation/modules.
  return inferred || meta.contentType || 'application/octet-stream';
}

export function createGameAssetHandler({ cacheRoot = DEFAULT_CACHE, fetchImpl = fetch, toRemote, cachePath, rewrite, origin }) {
  const inFlight = new Map();
  const textCache = new Map();
  let textBytes = 0;

  async function ensureAsset(url) {
    const file = cachePath(cacheRoot, url);
    const stat = await fsp.stat(file).catch(() => null);
    if (stat?.isFile() && stat.size > 0) return { file, stat };
    // A complete file is published atomically, and simultaneous clients share a download.
    if (inFlight.has(file)) return inFlight.get(file);
    const task = (async () => {
      const response = await fetchImpl(url, {
        headers: { accept: '*/*', 'accept-encoding': 'identity', referer: `${origin}/` },
        signal: AbortSignal.timeout(120_000), redirect: 'follow',
      });
      if (!response.ok || !response.body) {
        await response.body?.cancel().catch(() => {});
        const error = new Error(`Upstream returned ${response.status}`);
        error.statusCode = response.status === 404 ? 404 : 502;
        throw error;
      }
      const type = response.headers.get('content-type') || '';
      if (/text\/html/i.test(type) && /\.(?:js|mjs|wasm|data|json|br|gz|unityweb)$/i.test(url.pathname)) {
        await response.body.cancel();
        throw new Error('The game host returned an HTML error page for a runtime asset');
      }
      await fsp.mkdir(path.dirname(file), { recursive: true });
      const temp = `${file}.${randomUUID()}.part`;
      const metaTemp = `${temp}.meta.json`;
      const destination = fs.createWriteStream(temp, { flags: 'wx' });
      const destinationClosed = new Promise(resolve => destination.once('close', resolve));
      try {
        await pipeline(Readable.fromWeb(response.body), destination);
        await destinationClosed;
        const stat = await fsp.stat(temp);
        const expected = Number(response.headers.get('content-length') || 0);
        const decoded = !!response.headers.get('content-encoding');
        if (!stat.size || (!decoded && expected && stat.size !== expected)) throw new Error('Incomplete game asset download');
        await fsp.writeFile(metaTemp, JSON.stringify({ contentType: type, source: url.href, decoded }));
        await fsp.rename(metaTemp, `${file}.meta.json`);
        await fsp.rename(temp, file);
        return { file, stat };
      } finally {
        // Windows cannot unlink an asynchronously opening/closing file handle.
        destination.destroy();
        await destinationClosed;
        await fsp.rm(temp, { force: true }).catch(() => {});
        await fsp.rm(metaTemp, { force: true }).catch(() => {});
      }
    })();
    inFlight.set(file, task);
    try { return await task; } finally { inFlight.delete(file); }
  }

  return async (request, reply) => {
    let url;
    try {
      url = toRemote(request.params['*']);
      // Catalog version parameters are local cache keys, not upstream game parameters.
      const query = new URLSearchParams(request.raw.url.split('?').slice(1).join('?'));
      query.delete('v');
      url.search = query.toString();
    } catch {
      return reply.code(400).send({ error: 'Invalid game asset path' });
    }
    if (url.pathname.endsWith('/undefined/pages/home.html')) return reply.code(204).send();
    let asset;
    try { asset = await ensureAsset(url); }
    catch (error) {
      request.log?.warn?.({ path: url.pathname, error: error.message }, 'game asset unavailable');
      return reply.header('Cache-Control', 'no-store').code(error.statusCode || 502)
        .send({ error: 'Game asset could not be loaded. Please retry.', path: url.pathname });
    }

    const { file, stat } = asset;
    const meta = await fsp.readFile(`${file}.meta.json`, 'utf8').then(JSON.parse).catch(() => ({}));
    const mediaType = contentType(url, meta);
    const type = /(?:text\/|javascript|json|xml|svg)/i.test(mediaType) && !/charset=/i.test(mediaType)
      ? `${mediaType}; charset=utf-8` : mediaType;
    let encoding = '';
    if (/\.gz$/i.test(url.pathname)) {
      const handle = await fsp.open(file, 'r');
      const signature = Buffer.alloc(2);
      try { await handle.read(signature, 0, 2, 0); } finally { await handle.close(); }
      if (signature[0] === 0x1f && signature[1] === 0x8b) encoding = 'gzip';
    } else if (/\.br$/i.test(url.pathname) && !meta.decoded) encoding = 'br';
    // Unity's .unityweb files use the loader's own decompressor, not HTTP encoding.
    const isText = !encoding && /(?:\.(?:html?|js|mjs|css|json|xml|txt|svg|atlas|fnt)$|\/$)/i.test(url.pathname)
      && stat.size <= TEXT_LIMIT;
    let buffer;
    if (isText) {
      const key = `${file}:${stat.mtimeMs}:${stat.size}`;
      buffer = textCache.get(key);
      if (!buffer) {
        buffer = Buffer.from(rewrite(await fsp.readFile(file, 'utf8'), type, url));
        while (textBytes + buffer.length > 32 * 1024 * 1024 && textCache.size) {
          const oldest = textCache.keys().next().value;
          textBytes -= textCache.get(oldest).length;
          textCache.delete(oldest);
        }
        textCache.set(key, buffer);
        textBytes += buffer.length;
      }
    }
    const size = buffer?.length ?? stat.size;
    const etag = `W/"${REWRITE_VERSION}-${stat.size}-${Math.trunc(stat.mtimeMs)}"`;
    reply.type(type).header('ETag', etag).header('Last-Modified', stat.mtime.toUTCString())
      .header('Cache-Control', isText || /html/i.test(type) ? 'no-cache' : 'public, max-age=3600, must-revalidate')
      .header('Accept-Ranges', 'bytes');
    if (encoding) reply.header('Content-Encoding', encoding);
    if (String(request.headers['if-none-match'] || '').split(/\s*,\s*/).some(tag => tag === etag || tag === '*')) {
      return reply.code(304).send();
    }
    const ifRange = request.headers['if-range'];
    // Weak ETags cannot satisfy If-Range. A current Last-Modified date can.
    const rangeAllowed = !ifRange || (!String(ifRange).includes('"') && Date.parse(ifRange) >= Math.floor(stat.mtimeMs / 1000) * 1000);
    const range = request.method === 'HEAD' || !rangeAllowed ? null : parseByteRange(request.headers.range, size);
    if (range === false) return reply.code(416).header('Content-Range', `bytes */${size}`).send();
    const start = range?.start ?? 0;
    const end = range?.end ?? size - 1;
    if (range) reply.code(206).header('Content-Range', `bytes ${start}-${end}/${size}`);
    reply.header('Content-Length', end - start + 1);
    if (request.method === 'HEAD') return reply.send();
    return reply.send(buffer ? buffer.subarray(start, end + 1) : fs.createReadStream(file, { start, end }));
  };
}
