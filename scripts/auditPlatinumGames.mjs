import fsp from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  PLATINUM_MOUNT,
  PLATINUM_ORIGIN,
  getPlatinumCachePath,
} from "../services/platinumGameMirror.js";

const root = fileURLToPath(new URL("../", import.meta.url));
const cacheRoot = path.join(root, "game-cache", "platinum");
const catalogPath = path.join(root, "public", "assets", "data", "activities.json");
const catalog = JSON.parse(await fsp.readFile(catalogPath, "utf8"));
const missingEntries = [];
const missingRuntimeAssets = [];

function toRemote(value, baseUrl) {
  let candidate = String(value || "");
  if (candidate.startsWith(`${PLATINUM_MOUNT}/`)) candidate = candidate.slice(PLATINUM_MOUNT.length);
  try {
    return new URL(candidate, baseUrl);
  } catch {
    return null;
  }
}

for (const entry of catalog) {
  const remoteEntry = toRemote(entry.url, PLATINUM_ORIGIN);
  if (!remoteEntry) continue;
  remoteEntry.search = "";
  const entryPath = getPlatinumCachePath(cacheRoot, remoteEntry);
  const html = await fsp.readFile(entryPath, "utf8").catch(() => "");
  if (!html) {
    missingEntries.push({ game: entry.name, url: entry.url });
    continue;
  }

  const markup = html.replace(/<!--[\s\S]*?-->/g, "");
  for (const match of markup.matchAll(/<(script|link)\b([^>]*)>/gi)) {
    const tag = match[1].toLowerCase();
    const attributes = match[2];
    const source = /\b(?:src|href)\s*=\s*["']([^"']+)["']/i.exec(attributes)?.[1];
    if (!source) continue;
    if (tag === "link" && !/\brel\s*=\s*["'][^"']*stylesheet/i.test(attributes)) continue;
    if (tag === "script" && /\bnomodule\b/i.test(attributes)) continue;
    const remoteAsset = toRemote(source.replaceAll("\\", "/"), remoteEntry);
    if (!remoteAsset || remoteAsset.origin !== PLATINUM_ORIGIN) continue;
    remoteAsset.search = "";
    const assetPath = getPlatinumCachePath(cacheRoot, remoteAsset);
    const exists = await fsp.stat(assetPath).then((stat) => stat.isFile()).catch(() => false);
    if (!exists) {
      missingRuntimeAssets.push({ game: entry.name, type: tag, source, path: remoteAsset.pathname });
    }
  }
}

console.log(JSON.stringify({
  catalogEntries: catalog.length,
  missingEntries,
  missingRuntimeAssets,
}, null, 2));
if (missingEntries.length || missingRuntimeAssets.length) process.exitCode = 1;
