import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { canonicalGameName, canonicalGameUrl } from "./gameCatalog.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const catalog = JSON.parse(fs.readFileSync(path.join(root, "public", "assets", "data", "activities.json"), "utf8"));
const manifest = JSON.parse(fs.readFileSync(path.join(root, "public", "games", "gn-math", "manifest.json"), "utf8"));
const games = catalog.filter((entry) => String(entry?.id || "").startsWith("gnmath-"));

test("the gn-math catalog includes every playable source file with a title, cover and local entry page", () => {
  assert.equal(manifest.sourceHtmlFiles, 843);
  assert.equal(manifest.importedGames, 841);
  assert.equal(games.length, manifest.catalogGames);
  assert.ok(manifest.duplicateCatalogEntriesRemoved > 0);
  assert.deepEqual(manifest.skipped.map((entry) => entry.file).sort(), ["254.html", "596-fixx.html"]);
  assert.equal(new Set(games.map((entry) => entry.id)).size, games.length);

  for (const game of games) {
    assert.match(game.name, /\S/);
    assert.doesNotMatch(game.name, /^Game \d+$/);
    assert.ok(Array.isArray(game._cat) && game._cat.length > 0);
    assert.match(game.image, /^(?:\/assets\/img\/game\/|https:\/\/raw\.githubusercontent\.com\/gn-math\/covers\/[a-f0-9]{40}\/)/i);
    const pathname = decodeURIComponent(new URL(game.url, "http://nebulo.local").pathname);
    const localPath = path.join(root, "public", ...pathname.split("/").filter(Boolean));
    assert.ok(fs.statSync(localPath).isFile(), `${game.id} is missing ${localPath}`);
  }
});

test("the visible catalog has no duplicate titles or game URLs", () => {
  const titleKeys = catalog.map((game) => canonicalGameName(game.name));
  const urlKeys = catalog.map((game) => canonicalGameUrl(game.url)).filter(Boolean);
  assert.equal(new Set(titleKeys).size, titleKeys.length);
  assert.equal(new Set(urlKeys).size, urlKeys.length);
  assert.ok(catalog.some((game) => game.name === "Tetris (GBA)"));
  assert.ok(catalog.some((game) => game.name === "Tetris (NES)"));
});
