const PLATFORM_TAGS = new Map([
  ["gba", "GBA"],
  ["gb", "Game Boy"],
  ["gbc", "Game Boy Color"],
  ["nes", "NES"],
  ["snes", "SNES"],
  ["n64", "Nintendo 64"],
  ["nds", "Nintendo DS"],
  ["ps1", "PlayStation"],
  ["ps2", "PlayStation 2"],
]);

export function canonicalGameName(value) {
  return String(value || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .trim();
}

export function canonicalGameUrl(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  try {
    const parsed = new URL(raw, "https://nebulo.local");
    return decodeURIComponent(parsed.pathname).replace(/\/+$/, "").toLowerCase();
  } catch {
    return raw.split(/[?#]/, 1)[0].replace(/\/+$/, "").toLowerCase();
  }
}

function platformLabel(game) {
  const tags = Array.isArray(game?._cat) ? game._cat : [];
  for (const tag of tags) {
    const label = PLATFORM_TAGS.get(String(tag || "").toLowerCase());
    if (label) return label;
  }
  return "";
}

function titleQuality(value) {
  const title = String(value || "").trim();
  const letters = title.replace(/[^a-z]/gi, "");
  const isLower = letters && letters === letters.toLowerCase();
  const isUpper = letters && letters === letters.toUpperCase();
  return (isLower ? 0 : isUpper ? 8 : 18)
    + (/^[A-Z0-9]/.test(title) ? 4 : 0)
    + (/[:'.!]/.test(title) ? 2 : 0)
    + Math.min(title.length, 80) / 100;
}

function gameQuality(game) {
  const url = String(game?.url || "");
  const image = String(game?.image || "");
  const categories = Array.isArray(game?._cat) ? game._cat : [];
  const description = String(game?.description || "");
  return (url.startsWith("/games/platinum/") ? 100 : 0)
    + (url.startsWith("/") ? 20 : 0)
    + (image.startsWith("/") ? 20 : 0)
    + (image ? 4 : 0)
    + Math.min(categories.length, 8)
    + (description && !description.startsWith("From the gn-math") ? 2 : 0)
    - (/\btemp\b/i.test(url) ? 10 : 0);
}

function mergeGroup(group) {
  const ranked = [...group].sort((left, right) => gameQuality(right.game) - gameQuality(left.game) || left.index - right.index);
  const winner = { ...ranked[0].game };
  const bestTitle = [...group].sort((left, right) => titleQuality(right.game.name) - titleQuality(left.game.name) || left.index - right.index)[0].game.name;
  const mergedCategories = [];
  for (const { game } of ranked) {
    for (const category of Array.isArray(game._cat) ? game._cat : []) {
      const clean = String(category || "").trim().toLowerCase();
      if (clean && !mergedCategories.includes(clean)) mergedCategories.push(clean);
    }
  }
  winner.name = String(bestTitle || winner.name || "").trim();
  if (mergedCategories.length) winner._cat = mergedCategories;
  return winner;
}

export function dedupeGameCatalog(entries) {
  const source = (Array.isArray(entries) ? entries : []).filter((entry) => entry && typeof entry === "object");
  const prepared = source.map((game) => ({ ...game }));
  const initialNames = new Map();

  for (let index = 0; index < prepared.length; index += 1) {
    const key = canonicalGameName(prepared[index].name);
    if (!key) continue;
    const group = initialNames.get(key) || [];
    group.push(index);
    initialNames.set(key, group);
  }

  // Identically named emulator releases can be distinct games. Make their
  // platform visible instead of deleting one as a duplicate.
  for (const indexes of initialNames.values()) {
    if (indexes.length < 2) continue;
    const labels = indexes.map((index) => platformLabel(prepared[index]));
    if (labels.every(Boolean) && new Set(labels).size === labels.length) {
      indexes.forEach((index, position) => {
        prepared[index].name = `${String(prepared[index].name).trim()} (${labels[position]})`;
      });
    }
  }

  const groups = new Map();
  for (let index = 0; index < prepared.length; index += 1) {
    const game = prepared[index];
    const nameKey = canonicalGameName(game.name);
    const urlKey = canonicalGameUrl(game.url);
    const key = nameKey ? `name:${nameKey}` : `url:${urlKey}`;
    const group = groups.get(key) || [];
    group.push({ game, index });
    groups.set(key, group);
  }

  const nameDeduped = [...groups.values()]
    .map((group) => ({ game: mergeGroup(group), index: Math.min(...group.map((item) => item.index)), removed: group.slice(1).map((item) => item.game) }))
    .sort((left, right) => left.index - right.index);

  // Guard against records with different labels that still point to the exact
  // same local game page.
  const urlGroups = new Map();
  for (const item of nameDeduped) {
    const urlKey = canonicalGameUrl(item.game.url);
    const key = urlKey ? `url:${urlKey}` : `id:${String(item.game.id || item.index)}`;
    const group = urlGroups.get(key) || [];
    group.push(item);
    urlGroups.set(key, group);
  }

  const finalItems = [];
  const removed = [];
  for (const group of urlGroups.values()) {
    const merged = mergeGroup(group.map((item) => ({ game: item.game, index: item.index })));
    finalItems.push({ game: merged, index: Math.min(...group.map((item) => item.index)) });
    for (const item of group) removed.push(...item.removed);
    for (const item of group.slice(1)) removed.push(item.game);
  }
  finalItems.sort((left, right) => left.index - right.index);

  return {
    games: finalItems.map((item) => item.game),
    removed,
  };
}
