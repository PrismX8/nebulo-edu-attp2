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
const MIB = 1024 * 1024;
const DEFAULT_CACHE_LIMIT_MB = 512;
const TOUCH_INTERVAL_MS = 5 * 60 * 1000;
const STALE_PART_MS = 30 * 60 * 1000;

export function getGameCacheLimitBytes(value = process.env.GAME_CACHE_MAX_MB) {
  const megabytes = Number(value ?? DEFAULT_CACHE_LIMIT_MB);
  return Number.isFinite(megabytes) && megabytes > 0
    ? Math.floor(megabytes * MIB)
    : DEFAULT_CACHE_LIMIT_MB * MIB;
}

async function cacheFiles(cacheRoot) {
  const files = [];
  const directories = [path.resolve(cacheRoot)];
  while (directories.length) {
    const directory = directories.pop();
    const entries = await fsp.readdir(directory, { withFileTypes: true }).catch(error => {
      if (error.code === 'ENOENT') return [];
      throw error;
    });
    for (const entry of entries) {
      const entryPath = path.join(directory, entry.name);
      if (entry.isDirectory()) directories.push(entryPath);
      else if (entry.isFile()) {
        const stat = await fsp.stat(entryPath).catch(() => null);
        if (stat) files.push({ path: entryPath, size: stat.size, mtimeMs: stat.mtimeMs, atimeMs: stat.atimeMs });
      }
    }
  }
  return files;
}

export async function pruneGameCache(cacheRoot, maxBytes = getGameCacheLimitBytes(), protectedFiles = new Set()) {
  const absoluteRoot = path.resolve(cacheRoot);
  const protectedPaths = new Set([...protectedFiles].map(file => path.resolve(file)));
  const files = await cacheFiles(absoluteRoot);
  let totalBytes = files.reduce((sum, file) => sum + file.size, 0);
  const beforeBytes = totalBytes;
  let removedFiles = 0;
  const byPath = new Map(files.map(file => [file.path, file]));
  const now = Date.now();

  // Interrupted downloads are never valid cache entries. Keep recent parts in
  // case another request or mirror worker is still writing them.
  for (const file of files) {
    if (!file.path.endsWith('.part') || protectedPaths.has(file.path) || now - file.mtimeMs < STALE_PART_MS) continue;
    await fsp.rm(file.path, { force: true }).catch(() => {});
    totalBytes -= file.size;
    removedFiles += 1;
    byPath.delete(file.path);
  }

  // Remove metadata left behind by an interrupted or manually cleaned asset.
  for (const file of [...byPath.values()]) {
    if (!file.path.endsWith('.meta.json')) continue;
    const assetPath = file.path.slice(0, -'.meta.json'.length);
    if (byPath.has(assetPath) || protectedPaths.has(assetPath)) continue;
    await fsp.rm(file.path, { force: true }).catch(() => {});
    totalBytes -= file.size;
    removedFiles += 1;
    byPath.delete(file.path);
  }

  // Entry-repair backups are temporary safety copies, not playable assets.
  // Keeping them forever can consume most of the useful cache budget.
  const backupRoot = path.join(absoluteRoot, 'before-entry-repair');
  for (const file of [...byPath.values()]) {
    if (file.path !== backupRoot && !file.path.startsWith(`${backupRoot}${path.sep}`)) continue;
    if (protectedPaths.has(file.path)) continue;
    const removed = await fsp.rm(file.path, { force: true }).then(() => true).catch(() => false);
    if (!removed) continue;
    totalBytes -= file.size;
    removedFiles += 1;
    byPath.delete(file.path);
  }

  const candidates = [...byPath.values()]
    .filter(file => !file.path.endsWith('.meta.json') && !file.path.endsWith('.part'))
    .sort((left, right) => {
      const leftMeta = byPath.get(`${left.path}.meta.json`);
      const rightMeta = byPath.get(`${right.path}.meta.json`);
      const leftUsed = Math.max(left.atimeMs, left.mtimeMs, leftMeta?.mtimeMs || 0);
      const rightUsed = Math.max(right.atimeMs, right.mtimeMs, rightMeta?.mtimeMs || 0);
      return leftUsed - rightUsed || left.path.localeCompare(right.path);
    });

  for (const file of candidates) {
    if (totalBytes <= maxBytes) break;
    if (protectedPaths.has(file.path)) continue;
    const metaPath = `${file.path}.meta.json`;
    const meta = byPath.get(metaPath);
    const removedAsset = await fsp.rm(file.path, { force: true }).then(() => true).catch(() => false);
    if (!removedAsset) continue;
    totalBytes -= file.size;
    removedFiles += 1;
    if (meta) {
      const removedMeta = await fsp.rm(metaPath, { force: true }).then(() => true).catch(() => false);
      if (removedMeta) {
        totalBytes -= meta.size;
        removedFiles += 1;
      }
    }
  }

  return { beforeBytes, afterBytes: Math.max(0, totalBytes), removedFiles, maxBytes };
}

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

export function createGameAssetHandler({
  cacheRoot = DEFAULT_CACHE,
  fetchImpl = fetch,
  toRemote,
  cachePath,
  rewrite,
  origin,
  maxCacheBytes = getGameCacheLimitBytes(),
} = {}) {
  const inFlight = new Map();
  const textCache = new Map();
  const activeReads = new Map();
  const touchedAt = new Map();
  let textBytes = 0;
  let lastPruneAt = 0;
  let pruneTask = Promise.resolve();
  let pruneActive = false;
  let knownCacheBytes = null;

  function protectedCacheFiles(extraFile) {
    return new Set([
      ...inFlight.keys(),
      ...activeReads.keys(),
      ...(extraFile ? [extraFile] : []),
    ]);
  }

  function runPrune(extraFile, force = false) {
    if (pruneActive) return pruneTask;
    if (!force && Date.now() - lastPruneAt < 30_000) return pruneTask;
    lastPruneAt = Date.now();
    pruneActive = true;
    pruneTask = pruneTask
      .catch(() => {})
      .then(() => pruneGameCache(cacheRoot, maxCacheBytes, protectedCacheFiles(extraFile)))
      .then(result => { knownCacheBytes = result.afterBytes; return result; })
      .finally(() => { pruneActive = false; });
    return pruneTask;
  }

  function touch(file) {
    const now = Date.now();
    if (now - (touchedAt.get(file) || 0) < TOUCH_INTERVAL_MS) return;
    touchedAt.set(file, now);
    // The metadata timestamp drives LRU cleanup. The asset mtime is part of its
    // ETag, so it must remain stable when somebody plays a game.
    const metaFile = `${file}.meta.json`;
    void fsp.stat(metaFile)
      .then(() => fsp.utimes(metaFile, new Date(now), new Date(now)))
      .catch(() => {});
  }

  function retain(file) {
    activeReads.set(file, (activeReads.get(file) || 0) + 1);
    let released = false;
    return () => {
      if (released) return;
      released = true;
      const remaining = (activeReads.get(file) || 1) - 1;
      if (remaining > 0) activeReads.set(file, remaining);
      else activeReads.delete(file);
      void runPrune();
    };
  }

  async function ensureAsset(url) {
    // Do not race a cache scan that may be removing this path.
    await pruneTask.catch(() => {});
    const file = cachePath(cacheRoot, url);
    const stat = await fsp.stat(file).catch(() => null);
    if (stat?.isFile() && stat.size > 0) {
      touch(file);
      void runPrune(file);
      return { file, stat };
    }
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
        if (knownCacheBytes !== null) knownCacheBytes += stat.size;
        await runPrune(file, knownCacheBytes !== null && knownCacheBytes > maxCacheBytes);
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
    const release = retain(file);
    let releaseWithResponse = false;
    try {
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
      release();
      return reply.code(304).send();
    }
    const ifRange = request.headers['if-range'];
    // Weak ETags cannot satisfy If-Range. A current Last-Modified date can.
    const rangeAllowed = !ifRange || (!String(ifRange).includes('"') && Date.parse(ifRange) >= Math.floor(stat.mtimeMs / 1000) * 1000);
    const range = request.method === 'HEAD' || !rangeAllowed ? null : parseByteRange(request.headers.range, size);
    if (range === false) {
      release();
      return reply.code(416).header('Content-Range', `bytes */${size}`).send();
    }
    const start = range?.start ?? 0;
    const end = range?.end ?? size - 1;
    if (range) reply.code(206).header('Content-Range', `bytes ${start}-${end}/${size}`);
    reply.header('Content-Length', end - start + 1);
    if (request.method === 'HEAD') {
      release();
      return reply.send();
    }
    if (buffer) {
      release();
      return reply.send(buffer.subarray(start, end + 1));
    }
    const stream = fs.createReadStream(file, { start, end });
    const finish = () => release();
    reply.raw.once('finish', finish);
    reply.raw.once('close', finish);
    stream.once('error', finish);
    releaseWithResponse = true;
    return reply.send(stream);
    } finally {
      if (!releaseWithResponse) release();
    }
  };
}
