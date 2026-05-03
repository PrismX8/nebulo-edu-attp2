const EFFECTS = Object.freeze([
  {
    id: "none",
    name: "None",
    price: 0,
    description: "No message effect.",
    roomDurationMs: 0
  },
  {
    id: "flashbang",
    name: "Flashbang",
    price: 6,
    description: "A blinding full-screen flash washes over the room, then slowly fades away.",
    roomDurationMs: 6500
  },
  {
    id: "scramble",
    name: "Scramble",
    price: 8,
    description: "Glitchy jitter with broken neon shadows.",
    roomDurationMs: 8000
  },
  {
    id: "embers",
    name: "Embers",
    price: 9,
    description: "A hot orange glow with pulsing heat.",
    roomDurationMs: 8500
  },
  {
    id: "frostbyte",
    name: "Frostbyte",
    price: 10,
    description: "Icy highlights and a pale blue shimmer.",
    roomDurationMs: 8500
  },
  {
    id: "matrix",
    name: "Matrix",
    price: 12,
    description: "A room-wide storm of glowing green number rain.",
    roomDurationMs: 10000
  },
  {
    id: "starlight",
    name: "Starlight",
    price: 14,
    description: "Soft cosmic shimmer with a brighter edge.",
    roomDurationMs: 9000
  }
]);

const EFFECT_MAP = new Map(EFFECTS.map((effect) => [effect.id, effect]));
const EFFECT_ALIASES = Object.freeze({
  flashbands: "flashbang"
});

function normalizeEffectId(effectId = "") {
  const cleanId = String(effectId || "").trim().toLowerCase();
  return EFFECT_ALIASES[cleanId] || cleanId;
}

function listEffects() {
  return EFFECTS.map((effect) => ({ ...effect }));
}

function getEffect(effectId = "") {
  const cleanId = normalizeEffectId(effectId);
  return EFFECT_MAP.get(cleanId) || EFFECT_MAP.get("none") || null;
}

function isValidEffect(effectId = "") {
  return EFFECT_MAP.has(normalizeEffectId(effectId));
}

module.exports = {
  listEffects,
  getEffect,
  isValidEffect
};
