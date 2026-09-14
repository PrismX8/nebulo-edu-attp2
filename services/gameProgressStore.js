import { createHash, randomUUID } from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';

const MAX_GAMES = 100;
const MAX_RECENT = 20;
const MAX_SAVE_BYTES = 850_000;
const MAX_TOTAL_BYTES = 6_000_000;
const LOCK_TIMEOUT_MS = 5_000;
const LOCK_STALE_MS = 30_000;

const emptyProgress = () => ({ version: 1, saves: {}, recentlyPlayed: [] });
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export function normalizeGamePath(value) {
  const raw = String(value || '').trim();
  if (!raw || raw.length > 600 || raw.includes('\0') || raw.includes('\\')) throw Object.assign(new Error('Invalid game path.'), { statusCode: 400 });
  let rawDecoded;
  try { rawDecoded = decodeURIComponent(raw); } catch { rawDecoded = raw; }
  if (/^[a-z][a-z\d+.-]*:\/\//i.test(raw) || rawDecoded.split(/[?#]/)[0].split('/').includes('..')) throw Object.assign(new Error('Invalid game path.'), { statusCode: 400 });
  let pathname;
  try { pathname = new URL(raw, 'http://nebulo.local').pathname; }
  catch { throw Object.assign(new Error('Invalid game path.'), { statusCode: 400 }); }
  let decoded;
  try { decoded = decodeURIComponent(pathname); } catch { decoded = pathname; }
  if (!pathname.startsWith('/') || decoded.split('/').includes('..')) throw Object.assign(new Error('Invalid game path.'), { statusCode: 400 });
  pathname = pathname.replace(/\/{2,}/g, '/').replace(/\/index\.html$/i, '/');
  if (pathname.length > 500) throw Object.assign(new Error('Game path is too long.'), { statusCode: 400 });
  return pathname;
}

function plainJson(value, label = 'Save data') {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw Object.assign(new Error(`${label} must be an object.`), { statusCode: 400 });
  let json;
  try { json = JSON.stringify(value); } catch { throw Object.assign(new Error(`${label} is not valid JSON.`), { statusCode: 400 }); }
  if (Buffer.byteLength(json) > MAX_SAVE_BYTES) throw Object.assign(new Error(`${label} is too large.`), { statusCode: 413 });
  return JSON.parse(json);
}

function safeText(value, max) { return String(value || '').trim().slice(0, max); }

function normalizeRecent(value) {
  const gamePath = normalizeGamePath(value?.gamePath || value?.gameUrl);
  const gameName = safeText(value?.gameName, 120);
  if (!gameName) throw Object.assign(new Error('Game name is required.'), { statusCode: 400 });
  const gameImage = safeText(value?.gameImage, 700);
  const categories = Array.isArray(value?.gameCategories)
    ? value.gameCategories.map((item) => safeText(item, 50)).filter(Boolean).slice(0, 8)
    : [];
  return { gamePath, gameName, gameImage: gameImage || null, gameCategories: categories, playedAt: Date.now() };
}

function normalizeDocument(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return emptyProgress();
  const saves = {};
  for (const [rawPath, rawSave] of Object.entries(value.saves || {}).slice(-MAX_GAMES)) {
    try {
      const gamePath = normalizeGamePath(rawPath);
      if (rawSave && typeof rawSave === 'object' && !Array.isArray(rawSave)) saves[gamePath] = rawSave;
    } catch {}
  }
  const recentlyPlayed = [];
  for (const item of Array.isArray(value.recentlyPlayed) ? value.recentlyPlayed : []) {
    try {
      const normalized = normalizeRecent(item);
      normalized.playedAt = Number.isFinite(Number(item.playedAt)) ? Number(item.playedAt) : normalized.playedAt;
      if (!recentlyPlayed.some((entry) => entry.gamePath === normalized.gamePath)) recentlyPlayed.push(normalized);
    } catch {}
    if (recentlyPlayed.length >= MAX_RECENT) break;
  }
  return { version: 1, saves, recentlyPlayed };
}

export function createGameProgressStore(rootDirectory) {
  const root = path.resolve(rootDirectory);
  const queues = new Map();
  const identityKey = (userId) => createHash('sha256').update(String(userId)).digest('hex');
  const fileFor = (userId) => path.join(root, `${identityKey(userId)}.json`);
  const legacyFileFor = (userId) => /^[a-zA-Z0-9_-]{1,128}$/.test(String(userId)) ? path.join(root, `${userId}.json`) : null;
  const lockFor = (userId) => path.join(root, `${identityKey(userId)}.lock`);

  async function readFile(userId) {
    const filename = fileFor(userId);
    let raw;
    try { raw = await fs.readFile(filename, 'utf8'); }
    catch (error) {
      if (error?.code === 'ENOENT') {
        const legacy = legacyFileFor(userId);
        if (!legacy) return emptyProgress();
        try { raw = await fs.readFile(legacy, 'utf8'); }
        catch (legacyError) { if (legacyError?.code === 'ENOENT') return emptyProgress(); throw legacyError; }
      } else {
        throw error;
      }
    }
    try { return normalizeDocument(JSON.parse(raw)); }
    catch (error) {
      if (error?.statusCode) throw error;
      throw Object.assign(new Error('Saved game progress could not be read safely.'), { statusCode: 503, cause: error });
    }
  }

  async function acquireLock(userId) {
    await fs.mkdir(root, { recursive: true });
    const lockPath = lockFor(userId);
    const started = Date.now();
    while (true) {
      try {
        await fs.mkdir(lockPath);
        return async () => { try { await fs.rmdir(lockPath); } catch {} };
      } catch (error) {
        if (error?.code !== 'EEXIST') throw error;
        try {
          const stat = await fs.stat(lockPath);
          if (Date.now() - stat.mtimeMs > LOCK_STALE_MS) { await fs.rmdir(lockPath); continue; }
        } catch (statError) {
          if (statError?.code === 'ENOENT') continue;
        }
        if (Date.now() - started > LOCK_TIMEOUT_MS) throw Object.assign(new Error('Game progress is busy. Please retry.'), { statusCode: 503 });
        await wait(20 + Math.floor(Math.random() * 30));
      }
    }
  }

  async function writeFile(userId, progress) {
    const json = JSON.stringify(progress);
    if (Buffer.byteLength(json) > MAX_TOTAL_BYTES) throw Object.assign(new Error('Account game progress is full.'), { statusCode: 413 });
    await fs.mkdir(root, { recursive: true });
    const filename = fileFor(userId);
    const temporary = `${filename}.${process.pid}.${randomUUID()}.tmp`;
    const handle = await fs.open(temporary, 'wx');
    try {
      await handle.writeFile(json, 'utf8');
      await handle.sync();
    } finally { await handle.close(); }
    try {
      for (let attempt = 0; ; attempt++) {
        try { await fs.rename(temporary, filename); break; }
        catch (error) {
          if (!['EPERM', 'EBUSY', 'EACCES'].includes(error?.code) || attempt >= 7) throw error;
          await wait(Math.min(5 * (attempt + 1), 35));
        }
      }
    } catch (error) { try { await fs.unlink(temporary); } catch {} throw error; }
  }

  function mutate(userId, mutation) {
    const key = identityKey(userId);
    const previous = queues.get(key) || Promise.resolve();
    const operation = previous.catch(() => {}).then(async () => {
      const release = await acquireLock(userId);
      try {
        const progress = await readFile(userId);
        const result = await mutation(progress);
        await writeFile(userId, progress);
        return result;
      } finally { await release(); }
    });
    queues.set(key, operation);
    operation.finally(() => { if (queues.get(key) === operation) queues.delete(key); }).catch(() => {});
    return operation;
  }

  return {
    async read(userId) {
      const key = identityKey(userId);
      await (queues.get(key) || Promise.resolve()).catch(() => {});
      return readFile(userId);
    },
    async updateSave(userId, rawGamePath, rawData) {
      const gamePath = normalizeGamePath(rawGamePath);
      const data = plainJson(rawData);
      return mutate(userId, (progress) => {
        const existing = progress.saves[gamePath] && typeof progress.saves[gamePath] === 'object' ? progress.saves[gamePath] : {};
        const { lastUpdated: _ignored, ...cleanData } = data;
        progress.saves[gamePath] = { ...existing, ...cleanData, lastUpdated: Date.now() };
        const paths = Object.keys(progress.saves);
        if (paths.length > MAX_GAMES) {
          paths.sort((a, b) => Number(progress.saves[b]?.lastUpdated || 0) - Number(progress.saves[a]?.lastUpdated || 0));
          for (const oldPath of paths.slice(MAX_GAMES)) delete progress.saves[oldPath];
        }
        return { ok: true, gamePath, lastUpdated: progress.saves[gamePath].lastUpdated };
      });
    },
    async recordRecent(userId, rawRecent) {
      const recent = normalizeRecent(rawRecent);
      return mutate(userId, (progress) => {
        progress.recentlyPlayed = [recent, ...progress.recentlyPlayed.filter((entry) => entry.gamePath !== recent.gamePath)].slice(0, MAX_RECENT);
        return { ok: true, recentlyPlayed: progress.recentlyPlayed };
      });
    },
  };
}
