import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getGameCacheLimitBytes, pruneGameCache } from '../services/gameAssetCache.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const cacheRoot = path.resolve(root, 'game-cache', 'platinum');
const expectedRoot = path.resolve(root, 'game-cache');
if (cacheRoot !== expectedRoot && !cacheRoot.startsWith(`${expectedRoot}${path.sep}`)) {
  throw new Error(`Refusing to prune unexpected path: ${cacheRoot}`);
}

const result = await pruneGameCache(cacheRoot, getGameCacheLimitBytes());
const toMiB = bytes => Number((bytes / 1024 / 1024).toFixed(1));
process.stdout.write(`${JSON.stringify({
  cacheRoot,
  limitMiB: toMiB(result.maxBytes),
  beforeMiB: toMiB(result.beforeBytes),
  afterMiB: toMiB(result.afterBytes),
  removedFiles: result.removedFiles,
}, null, 2)}\n`);
