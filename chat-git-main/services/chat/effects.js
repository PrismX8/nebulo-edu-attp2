const EFFECTS = Object.freeze([
  {
    id: "none",
    name: "None",
    price: 0,
    description: "No message effect."
  },
  {
    id: "flashbands",
    name: "Flashbands",
    price: 6,
    description: "Cold scan-lines sweep across your messages."
  },
  {
    id: "scramble",
    name: "Scramble",
    price: 8,
    description: "Glitchy jitter with broken neon shadows."
  },
  {
    id: "embers",
    name: "Embers",
    price: 9,
    description: "A hot orange glow with pulsing heat."
  },
  {
    id: "frostbyte",
    name: "Frostbyte",
    price: 10,
    description: "Icy highlights and a pale blue shimmer."
  },
  {
    id: "matrix",
    name: "Matrix",
    price: 12,
    description: "Green terminal glow with digital flicker."
  },
  {
    id: "starlight",
    name: "Starlight",
    price: 14,
    description: "Soft cosmic shimmer with a brighter edge."
  }
]);

const EFFECT_MAP = new Map(EFFECTS.map((effect) => [effect.id, effect]));

function listEffects() {
  return EFFECTS.map((effect) => ({ ...effect }));
}

function getEffect(effectId = "") {
  const cleanId = String(effectId || "").trim().toLowerCase();
  return EFFECT_MAP.get(cleanId) || EFFECT_MAP.get("none") || null;
}

function isValidEffect(effectId = "") {
  return EFFECT_MAP.has(String(effectId || "").trim().toLowerCase());
}

module.exports = {
  listEffects,
  getEffect,
  isValidEffect
};
