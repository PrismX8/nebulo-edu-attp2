import { execFileSync } from "node:child_process";
import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { dedupeGameCatalog } from "./gameCatalog.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const catalogPath = path.join(root, "public", "assets", "data", "activities.json");
const outputRoot = path.join(root, "public", "games", "gn-math");
const htmlOutput = path.join(outputRoot, "html");
const zonesUrl = "https://raw.githubusercontent.com/gn-math/assets/main/zones.json";
const coversApi = "https://api.github.com/repos/gn-math/covers";
const sourceArg = process.argv.find((argument) => argument.startsWith("--source="));
const sourceDir = sourceArg ? path.resolve(sourceArg.slice("--source=".length)) : "";

if (!sourceDir || !fs.statSync(sourceDir, { throwIfNoEntry: false })?.isDirectory()) {
  throw new Error("Pass the cloned gn-math/html directory with --source=<directory>.");
}

const headers = { "User-Agent": "Nebulo-GnMath-Importer", Accept: "application/vnd.github+json" };
const titleOverrides = new Map([
  ["296.html", "Play! PS2 Emulator"],
]);
const localCoverFallbacks = new Map([
  ["126.html", "/assets/img/game/gnmath-granny3.png"],
]);

async function fetchJson(url) {
  const response = await fetch(url, { headers, signal: AbortSignal.timeout(30_000) });
  if (!response.ok) throw new Error(`${url} returned ${response.status}`);
  return response.json();
}

function decodeEntities(value) {
  return String(value || "")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([a-f0-9]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&amp;/gi, "&").replace(/&quot;/gi, '"').replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<").replace(/&gt;/gi, ">");
}

function cleanTitle(value) {
  return decodeEntities(String(value || "").replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .replace(/^Unity WebGL Player\s*[|–—-]\s*/i, "")
    .replace(/^WebGL Player\s*[|–—-]\s*/i, "")
    .trim()
    .slice(0, 120);
}

function meaningfulTitle(value) {
  const title = cleanTitle(value);
  if (!title || /^(?:Ruffle Player|CoolGames|YT Game Wrapper WebGL Template|Play!\.js|Game|HTML5 Game)$/i.test(title)) return "";
  return title;
}

function extractTitle(html, fileName, zone) {
  if (titleOverrides.has(fileName)) return titleOverrides.get(fileName);
  if (zone?.name) return cleanTitle(zone.name);
  const productName = html.match(/\bproductName\s*[:=]\s*["']([^"']+)["']/i)?.[1];
  const documentTitle = html.match(/\bdocument\.title\s*=\s*["']([^"']+)["']/i)?.[1];
  const titleTag = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1];
  const heading = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1];
  const extracted = [documentTitle, titleTag, productName, heading].map(meaningfulTitle).find(Boolean);
  if (extracted) return extracted;
  return "";
}

function inferCategories(name, special = []) {
  const value = name.toLowerCase();
  const rules = [
    ["sports", /basket|football|soccer|golf|tennis|hockey|billiard|boxing|bowling|volley|baseball|wrestl/],
    ["racing", /\bcar\b|racing|\brace\b|drive|drift|moto|bike|traffic|highway|kart/],
    ["puzzle", /2048|puzzle|wordle|sort|maze|chess|checkers|sudoku|merge|match|logic|brain|escape/],
    ["horror", /fnaf|granny|horror|backrooms|scary|zombie|evil|freddy|poppy playtime/],
    ["platformer", /mario|\bovo\b|\bvex\b|runner|platform|parkour|sonic|jump/],
    ["shooter", /shooter|\bgun\b|combat|warfare|sniper|doom|quake|strike|bullet/],
    ["strategy", /tower|defen[cs]e|tycoon|idle|simulator|manager|age of war|kingdom/],
    ["rhythm", /friday night|\bfnf\b|music|rhythm|piano|osu/],
  ];
  const primary = rules.find(([, pattern]) => pattern.test(value))?.[0] || "arcade";
  const tags = (Array.isArray(special) ? special : [])
    .map((tag) => String(tag || "").trim().toLowerCase().replace(/[^a-z0-9 -]/g, ""))
    .filter(Boolean);
  return [...new Set([primary, ...tags])].slice(0, 5);
}

const [zones, coversTree, coversCommit] = await Promise.all([
  fetchJson(zonesUrl),
  fetchJson(`${coversApi}/git/trees/main?recursive=1`),
  fetchJson(`${coversApi}/commits/main`),
]);

const zonesByFile = new Map();
const zonesById = new Map();
for (const zone of Array.isArray(zones) ? zones : []) {
  const match = String(zone?.url || "").match(/\/([^/]+\.html)$/i);
  if (match) zonesByFile.set(decodeURIComponent(match[1]), zone);
  if (Number.isInteger(zone?.id) && zone.id >= 0) zonesById.set(String(zone.id), zone);
}

const coverFiles = new Set((coversTree?.tree || []).filter((entry) => entry.type === "blob").map((entry) => entry.path));
const coverBase = `https://raw.githubusercontent.com/gn-math/covers/${coversCommit.sha}`;
const files = (await fsp.readdir(sourceDir, { withFileTypes: true }))
  .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".html"))
  .map((entry) => entry.name)
  .sort((left, right) => left.localeCompare(right, undefined, { numeric: true }));

await fsp.mkdir(htmlOutput, { recursive: true });
const previousHtmlFiles = (await fsp.readdir(htmlOutput, { withFileTypes: true }))
  .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".html"));
await Promise.all(previousHtmlFiles.map((entry) => fsp.unlink(path.join(htmlOutput, entry.name))));
const imported = [];
const skipped = [];
for (const fileName of files) {
  const sourcePath = path.join(sourceDir, fileName);
  const html = await fsp.readFile(sourcePath, "utf8");
  if (/has been removed due to (?:a )?DMCA/i.test(html)) {
    skipped.push({ file: fileName, reason: "The source file is a removal notice, not a playable game." });
    continue;
  }
  const numericId = fileName.match(/^\d+/)?.[0] || "";
  const exactZone = zonesByFile.get(fileName);
  const fallbackZone = numericId ? zonesById.get(numericId) : null;
  const zone = exactZone || fallbackZone;
  if (/^\[!\]\s*COMMENTS$/i.test(String(zone?.name || ""))) {
    skipped.push({ file: fileName, reason: "The source file is the collection comments utility, not a game." });
    continue;
  }
  const fallbackId = numericId || path.parse(fileName).name;
  const name = exactZone
    ? extractTitle(html, fileName, exactZone)
    : extractTitle(html, fileName, null) || cleanTitle(fallbackZone?.name) || `Game ${fallbackId}`;
  const mappedCover = String(zone?.cover || "").match(/\{COVER_URL\}\/([^?#]+)/i)?.[1] || "";
  const coverName = mappedCover && coverFiles.has(mappedCover)
    ? mappedCover
    : numericId && coverFiles.has(`${numericId}.png`) ? `${numericId}.png` : "";
  const image = coverName ? `${coverBase}/${coverName}` : localCoverFallbacks.get(fileName) || "";
  await fsp.copyFile(sourcePath, path.join(htmlOutput, fileName));
  imported.push({
    id: `gnmath-${path.parse(fileName).name.replace(/[^a-z0-9_-]/gi, "-")}`,
    name,
    description: `From the gn-math HTML game collection. Source file: ${fileName}.`,
    url: `/games/gn-math/html/${encodeURIComponent(fileName)}?v=${coversCommit.sha.slice(0, 12)}`,
    image,
    _cat: inferCategories(name, zone?.special),
  });
}

const existing = JSON.parse(await fsp.readFile(catalogPath, "utf8"));
const retained = (Array.isArray(existing) ? existing : []).filter((entry) => !String(entry?.id || "").startsWith("gnmath-"));
const deduped = dedupeGameCatalog([...retained, ...imported]);
await fsp.writeFile(catalogPath, `${JSON.stringify(deduped.games, null, 2)}\n`);

let htmlCommit = "unknown";
try {
  htmlCommit = execFileSync("git", ["-C", sourceDir, "rev-parse", "HEAD"], { encoding: "utf8" }).trim();
} catch {}
const manifest = {
  generatedAt: new Date().toISOString(),
  source: "https://github.com/gn-math/html",
  htmlCommit,
  metadata: zonesUrl,
  coversCommit: coversCommit.sha,
  sourceHtmlFiles: files.length,
  importedGames: imported.length,
  catalogGames: deduped.games.filter((entry) => String(entry?.id || "").startsWith("gnmath-")).length,
  duplicateCatalogEntriesRemoved: deduped.removed.length,
  skipped,
};
await fsp.writeFile(path.join(outputRoot, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
process.stdout.write(`${JSON.stringify(manifest, null, 2)}\n`);
