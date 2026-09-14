import fsp from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { dedupeGameCatalog } from "./gameCatalog.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const catalogPath = path.join(root, "public", "assets", "data", "activities.json");
const manifestPath = path.join(root, "public", "games", "gn-math", "manifest.json");
const original = JSON.parse(await fsp.readFile(catalogPath, "utf8"));
const result = dedupeGameCatalog(original);

await fsp.writeFile(catalogPath, `${JSON.stringify(result.games, null, 2)}\n`);

try {
  const manifest = JSON.parse(await fsp.readFile(manifestPath, "utf8"));
  manifest.catalogGames = result.games.filter((entry) => String(entry?.id || "").startsWith("gnmath-")).length;
  if (result.removed.length > 0) manifest.duplicateCatalogEntriesRemoved = result.removed.length;
  await fsp.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
} catch (error) {
  if (error?.code !== "ENOENT") throw error;
}

process.stdout.write(`${JSON.stringify({ before: original.length, after: result.games.length, removed: result.removed.length }, null, 2)}\n`);
