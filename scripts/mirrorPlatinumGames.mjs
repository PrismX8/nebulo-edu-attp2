import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { fileURLToPath } from "node:url";
import {
  PLATINUM_MOUNT,
  PLATINUM_ORIGIN,
  getPlatinumCachePath,
  rewritePlatinumText,
  toPlatinumLocalUrl,
} from "../services/platinumGameMirror.js";

const root = fileURLToPath(new URL("../", import.meta.url));
const catalogPath = path.join(root, "public", "assets", "data", "activities.json");
const cacheRoot = path.join(root, "game-cache", "platinum");
const concurrency = Math.max(1, Number(process.env.MIRROR_CONCURRENCY || 10));
const maxAssets = Math.max(0, Number(process.env.MIRROR_MAX_ASSETS || 0));
const textLimit = 16 * 1024 * 1024;
const assetExtension = /\.(?:html?|js|mjs|css|json|xml|txt|map|wasm|pck|data|mem|unityweb|unity3d|bundle|bin|br|gz|zip|swf|png|jpe?g|webp|gif|svg|ico|avif|mp3|ogg|wav|m4a|mp4|webm|ogv|ttf|otf|woff2?|eot|atlas|fnt)(?:[?#].*)?$/i;
const textFile = /(?:\.(?:html?|js|mjs|css|json|xml|txt|map|svg|atlas|fnt)$|\/$)/i;
const entryVersion = "20260819-game-assets-1";

const args = new Set(process.argv.slice(2));
const rewriteCatalog = args.has("--rewrite-catalog");
const entriesOnly = args.has("--entries-only");
const repairCache = args.has("--repair-cache");
const repairEntries = args.has("--repair-entries");
const directAssets = args.has("--direct-assets");
const refreshEntries = args.has("--refresh-entries");

const catalog = JSON.parse(await fsp.readFile(catalogPath, "utf8"));
const queue = [];
const queued = new Set();
const requiredUrls = new Set();
const requiredFailures = [];
const optionalFailures = [];
let completed = 0;
let downloaded = 0;
let downloadedBytes = 0;
let repairedAssets = 0;

const oldUnityBootstrapRepairs = new Map([
  ["/cdn/blocky%20snakes/index.html", ["gameContainer", "build.json"]],
  ["/cdn/fighter%20aircraft%20piolet/index.html", ["gameContainer", "Build/Fighter%20Aircraft%20Pilot.json"]],
  ["/cdn/freefall%20tournament/index.html", ["gameContainer", "Build/freefall-tournament.json"]],
  ["/cdn/gunspin/index.html", ["unityContainer", "Build/GunSpin%20WebGL%20FinalVersion.json"]],
  ["/cdn/Pre%20Civilization%20Bronze%20Age/index.html", ["unityContainer", "Build/WebGL.json"]],
  ["/cdn/ultimate%20offroad%20simulator/index.html", ["gameContainer", "Build/trailer_chip.json"]],
]);

function repairKnownGameEntry(text, remoteEntry) {
  let output = rewritePlatinumText(text, "text/html", remoteEntry);
  const bootstrap = oldUnityBootstrapRepairs.get(remoteEntry.pathname);
  if (bootstrap && !/UnityLoader\.instantiate\s*\(/.test(output)) {
    const [containerId, buildConfig] = bootstrap;
    const startup = `\n<script>\n  var gameInstance = UnityLoader.instantiate(${JSON.stringify(containerId)}, ${JSON.stringify(buildConfig)}, {\n    onProgress: typeof UnityProgress === "function" ? UnityProgress : undefined\n  });\n</script>\n`;
    output = /<\/body>/i.test(output)
      ? output.replace(/<\/body>/i, `${startup}</body>`)
      : `${output}${startup}`;
  }
  return output;
}

function enqueue(value, baseUrl, required = false) {
  if (!value || /^(?:data:|blob:|javascript:|mailto:|#)/i.test(value)) return;
  if (String(value).startsWith(`${PLATINUM_MOUNT}/`)) {
    value = String(value).slice(PLATINUM_MOUNT.length);
  }
  let url;
  try {
    url = new URL(value, baseUrl);
  } catch {
    return;
  }
  if (url.origin !== PLATINUM_ORIGIN) return;
  url.hash = "";
  const key = url.toString();
  if (required) requiredUrls.add(key);
  if (queued.has(key)) return;
  queued.add(key);
  queue.push(url);
}

function discoverMarkupReferences(text, baseUrl) {
  const markup = String(text || "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<script\b(?![^>]*\bsrc\s*=)[^>]*>[\s\S]*?<\/script>/gi, "");
  for (const match of markup.matchAll(/(?:src|href|poster|data-src)\s*=\s*["']([^"']+)["']/gi)) {
    enqueue(match[1].replaceAll("\\", "/"), baseUrl);
  }
  for (const match of markup.matchAll(/url\(\s*["']?([^)\'"\s]+)["']?\s*\)/gi)) {
    enqueue(match[1].replaceAll("\\", "/"), baseUrl);
  }
}

function discoverReferences(text, baseUrl) {
  const variables = new Map();
  for (const match of text.matchAll(/\b(?:var|let|const)\s+([A-Za-z_$][\w$]*)\s*=\s*["'`]([^"'`\r\n]+)["'`]/g)) {
    variables.set(match[1], match[2]);
  }

  for (const match of text.matchAll(/(?:src|href|poster|data-src)\s*=\s*["']([^"']+)["']/gi)) {
    enqueue(match[1], baseUrl);
  }
  for (const match of text.matchAll(/url\(\s*["']?([^)'"\s]+)["']?\s*\)/gi)) {
    enqueue(match[1], baseUrl);
  }
  for (const match of text.matchAll(/["'`]([^"'`\r\n]{1,600})["'`]/g)) {
    const candidate = match[1].replace(/\\\//g, "/");
    const urlShaped = !/\s/.test(candidate) && !/[<>{}|\\^*]/.test(candidate);
    if (urlShaped && assetExtension.test(candidate)) enqueue(candidate, baseUrl);
  }
  for (const match of text.matchAll(/\b([A-Za-z_$][\w$]*)\s*\+\s*["'`]([^"'`\r\n]+)["'`]/g)) {
    const prefix = variables.get(match[1]);
    if (prefix) enqueue(`${prefix}${match[2]}`, baseUrl);
  }
}

async function writeAtomic(filePath, body) {
  await fsp.mkdir(path.dirname(filePath), { recursive: true });
  const temporaryPath = `${filePath}.${process.pid}.part`;
  await fsp.writeFile(temporaryPath, body);
  await fsp.rename(temporaryPath, filePath);
}

async function streamAtomic(filePath, body) {
  await fsp.mkdir(path.dirname(filePath), { recursive: true });
  const temporaryPath = `${filePath}.${process.pid}.part`;
  try {
    await pipeline(Readable.fromWeb(body), fs.createWriteStream(temporaryPath));
    await fsp.rename(temporaryPath, filePath);
  } catch (error) {
    await fsp.rm(temporaryPath, { force: true }).catch(() => {});
    throw error;
  }
}

async function cacheUrl(url) {
    const filePath = getPlatinumCachePath(cacheRoot, url);
    try {
      const existing = await fsp.stat(filePath).catch(() => null);
      const refreshEntry = refreshEntries && requiredUrls.has(url.toString()) && /\.html?$/i.test(url.pathname);
      if (existing?.isFile() && !refreshEntry) {
        if (textFile.test(url.pathname) && existing.size <= textLimit) {
          const cachedText = await fsp.readFile(filePath, "utf8");
          const repairedText = rewritePlatinumText(cachedText, (await readMeta(filePath)).contentType, url);
          if (repairedText !== cachedText) await writeAtomic(filePath, Buffer.from(repairedText));
          if (!entriesOnly) {
            discoverReferences(repairedText.replaceAll(`${PLATINUM_MOUNT}/`, "/"), url);
          }
        }
        return;
      }

    const response = await fetch(url, {
      headers: {
        accept: "*/*",
        "accept-encoding": "identity",
        referer: `${PLATINUM_ORIGIN}/`,
        "user-agent": "NebuloGameMirror/1.0",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(90_000),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const contentType = response.headers.get("content-type") || "application/octet-stream";
    const contentLength = Number(response.headers.get("content-length") || 0);
    const isTextAsset = textFile.test(url.pathname);
    if (isTextAsset && (!contentLength || contentLength <= textLimit)) {
      const raw = Buffer.from(await response.arrayBuffer());
      const original = raw.toString("utf8");
      if (!entriesOnly) discoverReferences(original, url);
      const body = Buffer.from(/html/i.test(contentType) ? repairKnownGameEntry(original, url) : rewritePlatinumText(original, contentType, url));
      if (refreshEntry && existing?.isFile()) {
        const backup = path.join(cacheRoot, 'before-entry-repair', path.relative(cacheRoot, filePath));
        await fsp.mkdir(path.dirname(backup), { recursive: true });
        await fsp.copyFile(filePath, backup, fs.constants.COPYFILE_EXCL).catch(error => { if (error.code !== 'EEXIST') throw error; });
      }
      await writeAtomic(filePath, body);
      downloadedBytes += body.length;
    } else {
      await streamAtomic(filePath, response.body);
      downloadedBytes += (await fsp.stat(filePath)).size;
    }
    await writeAtomic(`${filePath}.meta.json`, Buffer.from(`${JSON.stringify({ contentType, source: url.toString(), decoded: !!response.headers.get('content-encoding') })}\n`));
    downloaded += 1;
  } catch (error) {
    const failure = { url: url.toString(), error: error.message };
    if (requiredUrls.has(url.toString())) requiredFailures.push(failure);
    else optionalFailures.push(failure);
  }
}

async function readMeta(filePath) {
  try {
    return JSON.parse(await fsp.readFile(`${filePath}.meta.json`, "utf8"));
  } catch {
    return {};
  }
}

async function repairCachedTextFiles(directory) {
  const entries = await fsp.readdir(directory, { withFileTypes: true }).catch(() => []);
  await Promise.all(entries.map(async (entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return repairCachedTextFiles(entryPath);
    if (!entry.isFile() || !entry.name.endsWith(".meta.json")) return;
    const assetFile = entryPath.slice(0, -".meta.json".length);
    const metadata = await readMeta(assetFile);
    const stat = await fsp.stat(assetFile).catch(() => null);
    const isTextAsset = textFile.test(assetFile);
    if (!stat?.isFile() || !isTextAsset || stat.size > textLimit) return;
    const existing = await fsp.readFile(assetFile, "utf8");
    const repaired = rewritePlatinumText(existing, metadata.contentType || "", metadata.source ? new URL(metadata.source) : undefined);
    if (repaired === existing) return;
    await writeAtomic(assetFile, Buffer.from(repaired));
    repairedAssets += 1;
  }));
}

if (repairCache) await repairCachedTextFiles(cacheRoot);

if (repairEntries) {
  for (const entry of catalog) {
    const remoteEntry = new URL(
      String(entry.url).startsWith(`${PLATINUM_MOUNT}/`)
        ? String(entry.url).slice(PLATINUM_MOUNT.length)
        : entry.url,
      PLATINUM_ORIGIN
    );
    const entryPath = getPlatinumCachePath(cacheRoot, remoteEntry);
    const existing = await fsp.readFile(entryPath, "utf8").catch(() => "");
    if (!existing) continue;
    const repaired = repairKnownGameEntry(existing, remoteEntry);
    if (repaired === existing) continue;
    await writeAtomic(entryPath, Buffer.from(repaired));
    repairedAssets += 1;
  }
}

for (const entry of catalog) {
  enqueue(entry.url, PLATINUM_ORIGIN, true);
  if (!String(entry.image).startsWith("/") || String(entry.image).startsWith(`${PLATINUM_MOUNT}/`)) {
    enqueue(entry.image, PLATINUM_ORIGIN, true);
  }
}

if (directAssets) {
  for (const entry of catalog) {
    const remoteEntry = new URL(
      String(entry.url).startsWith(`${PLATINUM_MOUNT}/`)
        ? String(entry.url).slice(PLATINUM_MOUNT.length)
        : entry.url,
      PLATINUM_ORIGIN
    );
    const entryPath = getPlatinumCachePath(cacheRoot, remoteEntry);
    const html = await fsp.readFile(entryPath, "utf8").catch(() => "");
    if (html) discoverMarkupReferences(html, remoteEntry);
  }
}

async function worker() {
  while (queue.length) {
    if (maxAssets && completed >= maxAssets) return;
    const url = queue.shift();
    await cacheUrl(url);
    completed += 1;
    if (completed % 25 === 0) {
      const mib = (downloadedBytes / 1024 / 1024).toFixed(1);
      process.stdout.write(`Mirrored ${completed}/${completed + queue.length} assets (${mib} MiB)\n`);
    }
  }
}

await Promise.all(Array.from({ length: concurrency }, () => worker()));

if (rewriteCatalog) {
  const localCatalog = catalog.map((entry) => ({
    ...entry,
    url: (() => {
      const localUrl = String(entry.url).startsWith(`${PLATINUM_MOUNT}/`)
        ? entry.url
        : toPlatinumLocalUrl(entry.url);
      const parsed = new URL(localUrl, "http://nebulo.local");
      parsed.searchParams.set("v", entryVersion);
      return `${parsed.pathname}${parsed.search}`;
    })(),
    image: String(entry.image).startsWith("/") ? entry.image : toPlatinumLocalUrl(entry.image),
  }));
  await writeAtomic(catalogPath, Buffer.from(`${JSON.stringify(localCatalog, null, 2)}\n`));
}

const summary = {
  catalogEntries: catalog.length,
  processedAssets: completed,
  downloadedAssets: downloaded,
  downloadedMiB: Number((downloadedBytes / 1024 / 1024).toFixed(1)),
  repairedAssets,
  requiredFailures: requiredFailures.length,
  optionalMissingReferences: optionalFailures.length,
};
console.log(JSON.stringify(summary, null, 2));
if (requiredFailures.length || optionalFailures.length) {
  await fsp.mkdir(cacheRoot, { recursive: true });
  await fsp.writeFile(
    path.join(cacheRoot, "mirror-failures.json"),
    `${JSON.stringify({ required: requiredFailures, optional: optionalFailures }, null, 2)}\n`,
    "utf8"
  );
} else {
  await fsp.rm(path.join(cacheRoot, "mirror-failures.json"), { force: true });
}
if (requiredFailures.length) {
  process.exitCode = 1;
}
