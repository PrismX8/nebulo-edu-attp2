const EFFECT_PRICES = Object.freeze({
  flashbang: 400,
  scramble: 300,
  matrix: 550,
  spiral: 800,
  glass: 500,
  neon: 850,
  gradient: 500,
  dark_smoke: 650,
  electric: 1100,
  fire: 1200,
  ice: 1200,
  matrix_msg: 900,
  galaxy: 1250,
  rainbow_border: 1450,
  aurora: 1550,
  gold: 1000,
  cyberpunk: 1600,
  topographic: 700,
  toxic_slime: 1500,
  bubble: 950,
  ink_splash: 1300,
  holographic: 2000,
  wood: 500,
  carbon_fiber: 700,
  hearts: 1000,
  tag_cool: 500,
  tag_respected: 1400,
  tag_honor: 2400,
  tag_talkative: 900,
  tag_helpful: 1000,
  tag_veteran: 3200,
  tag_mvp: 2000,
  tag_member: 400,
  tag_regular: 600,
  tag_active: 1000,
  tag_lowkey: 700,
  tag_night_shift: 1200,
  tag_builder: 1800,
  tag_creator: 2200,
  tag_tester: 1500,
  tag_supporter: 2000,
  tag_contributor: 2800,
  tag_collector: 2400,
  tag_arcade: 800,
  tag_focused: 900,
  tag_original: 3200,
  tag_insider: 3500,
  tag_no_context: 1100,
  tag_casual: 600,
  tag_classic: 3000,
  banner_midnight: 1800,
  banner_reactor_meltdown: 2800,
  banner_sunset: 2100,
  banner_frozen_kingdom: 2700,
  banner_ocean: 2200,
  banner_jungle_ruins: 2600,
  banner_sakura: 3000,
  banner_ocean_abyss: 3100,
  banner_emerald: 2500,
  banner_storm_front: 3300,
  banner_mechanical_core: 3500,
  banner_lava_forge: 3600,
  banner_fractured_glass: 3800,
  banner_digital_core: 3700,
  banner_portal: 4200,
  banner_samurai_garden: 3900,
  banner_pirate_cove: 4000,
  banner_astral_library: 4800,
  profile_crystal_bloom: 4200,
  profile_infinity_aquarium: 6000,
  profile_living_city: 6200,
  profile_ancient_library: 5000,
  profile_clockwork_factory: 5800,
  profile_greenhouse: 4800,
  profile_ice_cathedral: 6500,
  profile_observatory: 6800,
  profile_ink_dimension: 7000,
  profile_dragon_forge: 7800,
  profile_museum_heist: 8500,
  avatar_purple_rift: 2200,
  avatar_magma: 2800,
  avatar_ice_spikes: 2900,
  avatar_rainbow_orbit: 3500,
  avatar_vine_guardian: 1900,
  avatar_stone_orbit: 1800,
  avatar_sakura_bloom: 2000,
  avatar_gold_crown: 4500,
  avatar_shadow_pulse: 2400,
  avatar_nebula_comet: 3400,
  avatar_cyber_flux: 2600,
  avatar_crimson_flare: 3000,
  avatar_lunar_arc: 2300,
  avatar_candy_hearts: 2100,
  avatar_aqua_spikes: 3100,
  avatar_obsidian_laser: 4000,
  avatar_jade_stream: 2500,
  avatar_bronze_rope: 1700,
  public_message: 2000
});

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
    price: 150,
    description: "Builds into a blinding green-white cinematic flashbang, glitches the screen, then slowly restores the room.",
    roomDurationMs: 12000,
    scope: "room"
  },
  {
    id: "scramble",
    name: "Scramble",
    price: 150,
    description: "Scrambles every visible word in the room with full-screen RGB glitching for 10 seconds.",
    roomDurationMs: 10000,
    scope: "room"
  },
  {
    id: "matrix",
    name: "Matrix",
    price: 150,
    description: "Dissolves your profile picture into a rotating 3D Matrix code sphere, then reconstructs it.",
    roomDurationMs: 14000,
    scope: "room"
  },
  {
    id: "spiral",
    name: "3D Vault Spiral",
    price: 200,
    description: "Pulls every visible message into an energized vault before it cracks and explodes.",
    roomDurationMs: 14000,
    scope: "room"
  },
  {
    id: "glass",
    name: "Frosted Glass",
    price: 125,
    description: "Architectural frosted glass with condensation, microscopic texture, and slowly changing reflections.",
    roomDurationMs: 0,
    scope: "message"
  },
  {
    id: "neon",
    name: "Neon Trim",
    price: 150,
    description: "Machined aluminum with a precision light channel and a restrained traveling reflection.",
    roomDurationMs: 0,
    scope: "message"
  },
  {
    id: "gradient",
    name: "Color Drift",
    price: 125,
    description: "Dark optical glass with subtle angle-dependent blue, indigo, and plum color movement.",
    roomDurationMs: 0,
    scope: "message"
  },
  {
    id: "dark_smoke",
    name: "Soft Smoke",
    price: 150,
    description: "Layered cinematic fog drifting almost imperceptibly behind dark glass.",
    roomDurationMs: 0,
    scope: "message"
  },
  {
    id: "electric",
    name: "Blue Current",
    price: 175,
    description: "Deep ocean currents with long blue caustic ribbons moving beneath the surface.",
    roomDurationMs: 0,
    scope: "message"
  },
  {
    id: "fire",
    name: "Ember Edge",
    price: 175,
    description: "Heat-stressed forged steel with tiny trapped-orange fissures and a slow thermal glow.",
    roomDurationMs: 0,
    scope: "message"
  },
  {
    id: "ice",
    name: "Winter Glass",
    price: 175,
    description: "Cold architectural glass with delicate frost growth and softly drifting icy reflections.",
    roomDurationMs: 0,
    scope: "message"
  },
  {
    id: "matrix_msg",
    name: "Green Code",
    price: 150,
    description: "Smoked terminal glass with fine scanning lines, grid intersections, and quiet data pulses.",
    roomDurationMs: 0,
    scope: "message"
  },
  {
    id: "galaxy",
    name: "Night Sky",
    price: 175,
    description: "A restrained astronomical sky with natural starlight and barely moving nebula haze.",
    roomDurationMs: 0,
    scope: "message"
  },
  {
    id: "rainbow_border",
    name: "Spectrum",
    price: 200,
    description: "Anodized titanium with realistic thin-film interference that shifts with the viewing angle.",
    roomDurationMs: 0,
    scope: "message"
  },
  {
    id: "aurora",
    name: "Northern Lights",
    price: 200,
    description: "Calm aurora ribbons moving through deep atmospheric haze with soft natural edges.",
    roomDurationMs: 0,
    scope: "message"
  },
  {
    id: "gold",
    name: "Gilded",
    price: 150,
    description: "Hand-laid brushed gold leaf protected by polished glass and soft traveling highlights.",
    roomDurationMs: 0,
    scope: "message"
  },
  {
    id: "cyberpunk",
    name: "City Lights",
    price: 200,
    description: "A distant contemporary city seen out of focus through rain-wet glass.",
    roomDurationMs: 0,
    scope: "message"
  },
  {
    id: "topographic",
    name: "Contour",
    price: 150,
    description: "A matte relief map with fine engraved contours shifting at a geological pace.",
    roomDurationMs: 0,
    scope: "message"
  },
  {
    id: "toxic_slime",
    name: "Lime Drip",
    price: 200,
    description: "Deep translucent lime resin with slow internal flow and sparse trapped bubbles.",
    roomDurationMs: 0,
    scope: "message"
  },
  {
    id: "bubble",
    name: "Daydream",
    price: 150,
    description: "Pastel cloud layers at blue hour with calm light and deep atmospheric perspective.",
    roomDurationMs: 0,
    scope: "message"
  },
  {
    id: "ink_splash",
    name: "Ink Wash",
    price: 175,
    description: "India ink curling naturally through charcoal-tinted water with a quiet central field.",
    roomDurationMs: 0,
    scope: "message"
  },
  {
    id: "holographic",
    name: "Prism",
    price: 250,
    description: "Cut optical crystal beneath smoked glass with subtle moving internal refractions.",
    roomDurationMs: 0,
    scope: "message"
  },
  {
    id: "wood",
    name: "Walnut",
    price: 125,
    description: "Satin-oiled black walnut with authentic grain, fine pores, and moving reflected light.",
    roomDurationMs: 0,
    scope: "message"
  },
  {
    id: "carbon_fiber",
    name: "Carbon Weave",
    price: 150,
    description: "Genuine forged carbon beneath satin clear coat with broad, controlled specular light.",
    roomDurationMs: 0,
    scope: "message"
  },
  {
    id: "hearts",
    name: "Rose Hearts",
    price: 150,
    description: "Dusty-rose velvet with sparse embroidered hearts and thread-level highlights.",
    roomDurationMs: 0,
    scope: "message"
  },
  {
    id: "tag_cool",
    name: "Cool",
    color: "#38bdf8",
    price: 100,
    description: "A crisp blue Cool tag.",
    roomDurationMs: 0,
    scope: "tag"
  },
  {
    id: "tag_respected",
    name: "Respected",
    color: "#a78bfa",
    price: 175,
    description: "A refined violet Respected tag.",
    roomDurationMs: 0,
    scope: "tag"
  },
  {
    id: "tag_honor",
    name: "Tag of Honor",
    color: "#fbbf24",
    price: 250,
    description: "A premium gold honor badge.",
    roomDurationMs: 0,
    scope: "tag"
  },
  {
    id: "tag_talkative",
    name: "Talkative",
    color: "#f472b6",
    price: 150,
    description: "For the people who keep chat moving.",
    roomDurationMs: 0,
    scope: "tag"
  },
  {
    id: "tag_helpful",
    name: "Helpful",
    color: "#4ade80",
    price: 125,
    description: "A green badge for helpful community members.",
    roomDurationMs: 0,
    scope: "tag"
  },
  {
    id: "tag_veteran",
    name: "Veteran",
    color: "#fb923c",
    price: 300,
    description: "A distinguished badge for long-time members.",
    roomDurationMs: 0,
    scope: "tag"
  },
  {
    id: "tag_mvp",
    name: "MVP",
    color: "#f87171",
    price: 225,
    description: "A standout red MVP badge.",
    roomDurationMs: 0,
    scope: "tag"
  },
  { id:"tag_member", name:"Member", color:"#a1a1aa", price:400, description:"A simple member label.", roomDurationMs:0, scope:"tag" },
  { id:"tag_regular", name:"Regular", color:"#d4d4d8", price:600, description:"For familiar names in chat.", roomDurationMs:0, scope:"tag" },
  { id:"tag_active", name:"Active", color:"#4ade80", price:1000, description:"A clean label for active chat members.", roomDurationMs:0, scope:"tag" },
  { id:"tag_lowkey", name:"Lowkey", color:"#94a3b8", price:700, description:"A quiet, understated tag.", roomDurationMs:0, scope:"tag" },
  { id:"tag_night_shift", name:"Night Shift", color:"#818cf8", price:1200, description:"For people who are around after hours.", roomDurationMs:0, scope:"tag" },
  { id:"tag_builder", name:"Builder", color:"#38bdf8", price:1800, description:"A practical tag for people who make things.", roomDurationMs:0, scope:"tag" },
  { id:"tag_creator", name:"Creator", color:"#f9a8d4", price:2200, description:"A restrained creator label.", roomDurationMs:0, scope:"tag" },
  { id:"tag_tester", name:"Tester", color:"#67e8f9", price:1500, description:"For people who find what needs fixing.", roomDurationMs:0, scope:"tag" },
  { id:"tag_supporter", name:"Supporter", color:"#fbbf24", price:2000, description:"A low-key community supporter tag.", roomDurationMs:0, scope:"tag" },
  { id:"tag_contributor", name:"Contributor", color:"#60a5fa", price:2800, description:"A premium contributor label.", roomDurationMs:0, scope:"tag" },
  { id:"tag_collector", name:"Collector", color:"#f59e0b", price:2400, description:"For cosmetic and item collectors.", roomDurationMs:0, scope:"tag" },
  { id:"tag_arcade", name:"Arcade", color:"#fb923c", price:800, description:"A simple arcade tag.", roomDurationMs:0, scope:"tag" },
  { id:"tag_focused", name:"Focused", color:"#2dd4bf", price:900, description:"A clean focused label.", roomDurationMs:0, scope:"tag" },
  { id:"tag_original", name:"Original", color:"#e4e4e7", price:3200, description:"A rare monochrome original tag.", roomDurationMs:0, scope:"tag" },
  { id:"tag_insider", name:"Insider", color:"#a78bfa", price:3500, description:"A rare understated insider tag.", roomDurationMs:0, scope:"tag" },
  { id:"tag_no_context", name:"No Context", color:"#f87171", price:1100, description:"For messages that make sense eventually.", roomDurationMs:0, scope:"tag" },
  { id:"tag_casual", name:"Casual", color:"#a3a3a3", price:600, description:"A neutral casual label.", roomDurationMs:0, scope:"tag" },
  { id:"tag_classic", name:"Classic", color:"#d4d4d8", price:3000, description:"A rare black-and-silver classic tag.", roomDurationMs:0, scope:"tag" },
  {
    id: "banner_midnight",
    name: "Cyber Energy",
    price: 200,
    description: "Black glass and flowing violet energy.",
    roomDurationMs: 0,
    scope: "banner"
  },
  {
    id: "banner_reactor_meltdown",
    name: "Reactor Meltdown",
    price: 275,
    description: "A damaged fusion reactor leaking orange plasma.",
    roomDurationMs: 0,
    scope: "banner"
  },
  {
    id: "banner_sunset",
    name: "Crystal Cavern",
    price: 225,
    description: "Luminous crystals in a dark reflective cavern.",
    roomDurationMs: 0,
    scope: "banner"
  },
  {
    id: "banner_frozen_kingdom",
    name: "Frozen Kingdom",
    price: 275,
    description: "A moonlit canyon of towering blue ice.",
    roomDurationMs: 0,
    scope: "banner"
  },
  {
    id: "banner_ocean",
    name: "Infinite Void",
    price: 225,
    description: "Floating black cubes connected by violet light.",
    roomDurationMs: 0,
    scope: "banner"
  },
  {
    id: "banner_jungle_ruins",
    name: "Jungle Ruins",
    price: 275,
    description: "Ancient ruins reclaimed by vines and waterfalls.",
    roomDurationMs: 0,
    scope: "banner"
  },
  {
    id: "banner_sakura",
    name: "Black Hole",
    price: 250,
    description: "Violet plasma circling a cinematic black hole.",
    roomDurationMs: 0,
    scope: "banner"
  },
  {
    id: "banner_ocean_abyss",
    name: "Ocean Abyss",
    price: 300,
    description: "Glowing jellyfish above coral-covered ruins.",
    roomDurationMs: 0,
    scope: "banner"
  },
  {
    id: "banner_emerald",
    name: "Data Stream",
    price: 275,
    description: "Light particles racing through glass tunnels.",
    roomDurationMs: 0,
    scope: "banner"
  },
  {
    id: "banner_storm_front",
    name: "Storm Front",
    price: 300,
    description: "Lightning breaks over stormbound floating islands.",
    roomDurationMs: 0,
    scope: "banner"
  },
  {
    id: "banner_mechanical_core",
    name: "Mechanical Core",
    price: 300,
    description: "A black titanium reactor powered by violet energy.",
    roomDurationMs: 0,
    scope: "banner"
  },
  {
    id: "banner_lava_forge",
    name: "Lava Forge",
    price: 325,
    description: "An obsidian forge filled with molten rivers and sparks.",
    roomDurationMs: 0,
    scope: "banner"
  },
  {
    id: "banner_fractured_glass",
    name: "Fractured Glass",
    price: 325,
    description: "Smoked glass split by a controlled violet glow.",
    roomDurationMs: 0,
    scope: "banner"
  },
  {
    id: "banner_digital_core",
    name: "Digital Core",
    price: 325,
    description: "A white glass corridor powered by cyan circuitry.",
    roomDurationMs: 0,
    scope: "banner"
  },
  {
    id: "banner_portal",
    name: "Portal",
    price: 350,
    description: "A dimensional gateway inside a dark industrial chamber.",
    roomDurationMs: 0,
    scope: "banner"
  },
  {
    id: "banner_samurai_garden",
    name: "Samurai Garden",
    price: 350,
    description: "A cherry-blossom temple garden at sunset.",
    roomDurationMs: 0,
    scope: "banner"
  },
  {
    id: "banner_pirate_cove",
    name: "Pirate Cove",
    price: 350,
    description: "A lantern-lit sea cave hiding a golden cache.",
    roomDurationMs: 0,
    scope: "banner"
  },
  {
    id: "banner_astral_library",
    name: "Astral Library",
    price: 375,
    description: "An infinite celestial library of blue and gold.",
    roomDurationMs: 0,
    scope: "banner"
  },
  { id:"profile_crystal_bloom", name:"Crystal Bloom", price:300, description:"Prismatic crystal clusters grow from every profile edge, pulse, and shatter into mist.", durationMs:1800, roomDurationMs:0, scope:"profile" },
  { id:"profile_infinity_aquarium", name:"Infinity Aquarium", price:350, description:"Clear water, luminous koi, a passing whale, bubbles, and coral transform the full profile frame.", durationMs:2000, roomDurationMs:0, scope:"profile" },
  { id:"profile_living_city", name:"Living City", price:350, description:"Drones assemble a neon skyline with hover traffic before the city folds back into cubes.", durationMs:1900, roomDurationMs:0, scope:"profile" },
  { id:"profile_ancient_library", name:"Ancient Library", price:325, description:"Flying books, self-writing pages, glowing symbols, and an ancient locking tome surround the profile.", durationMs:2000, roomDurationMs:0, scope:"profile" },
  { id:"profile_clockwork_factory", name:"Clockwork Factory", price:350, description:"Brass gears, mechanical arms, pistons, and steam assemble and reverse around the profile.", durationMs:1900, roomDurationMs:0, scope:"profile" },
  { id:"profile_greenhouse", name:"The Greenhouse", price:325, description:"Seeds become vines, flowers, butterflies, and a dense canopy before autumn carries it away.", durationMs:2000, roomDurationMs:0, scope:"profile" },
  { id:"profile_ice_cathedral", name:"Ice Cathedral", price:350, description:"Frozen pillars and translucent cathedral arches rise, refract sunlight, and shatter into glitter.", durationMs:1900, roomDurationMs:0, scope:"profile" },
  { id:"profile_observatory", name:"Observatory", price:350, description:"Brass orbital rings, planets, constellations, and a focusing telescope align around the profile.", durationMs:2000, roomDurationMs:0, scope:"profile" },
  { id:"profile_ink_dimension", name:"Ink Dimension", price:325, description:"Upward-flowing ink forms birds, impossible sculptures, and a castle before collapsing into one droplet.", durationMs:1900, roomDurationMs:0, scope:"profile" },
  { id:"profile_dragon_forge", name:"Dragon Forge", price:375, description:"Molten steel, dragon molds, mechanical hammers, and showers of sparks forge a creature around the frame.", durationMs:2000, roomDurationMs:0, scope:"profile" },
  { id:"profile_museum_heist", name:"Museum Heist", price:375, description:"Security lasers, tiny thieves, drones, shattered displays, and alarms stage a complete miniature heist.", durationMs:2000, roomDurationMs:0, scope:"profile" },
  {
    id: "avatar_purple_rift",
    name: "Aurora Halo",
    price: 250,
    description: "A translucent blue-violet aurora flowing around your profile picture.",
    roomDurationMs: 0,
    scope: "avatar"
  },
  {
    id: "avatar_magma",
    name: "Flame Orbit",
    price: 275,
    description: "A transparent, animated ring of bright flowing flame.",
    roomDurationMs: 0,
    scope: "avatar"
  },
  {
    id: "avatar_ice_spikes",
    name: "Ice Spikes",
    price: 275,
    description: "Frozen cyan crystal ring with cold shimmer.",
    roomDurationMs: 0,
    scope: "avatar"
  },
  {
    id: "avatar_rainbow_orbit",
    name: "Rainbow Orbit",
    price: 300,
    description: "Fast chromatic neon orbit inspired by premium Discord avatar effects.",
    roomDurationMs: 0,
    scope: "avatar"
  },
  {
    id: "avatar_vine_guardian",
    name: "Vine Guardian",
    price: 250,
    description: "Emerald vine ring with small living energy nodes.",
    roomDurationMs: 0,
    scope: "avatar"
  },
  {
    id: "avatar_stone_orbit",
    name: "Stone Orbit",
    price: 260,
    description: "Floating rocks and orange sparks orbit the avatar.",
    roomDurationMs: 0,
    scope: "avatar"
  },
  {
    id: "avatar_sakura_bloom",
    name: "Sakura Bloom",
    price: 240,
    description: "Soft pink petals drift around a glowing ring.",
    roomDurationMs: 0,
    scope: "avatar"
  },
  {
    id: "avatar_gold_crown",
    name: "Golden Crown",
    price: 325,
    description: "Premium gold ring with crown-like flares.",
    roomDurationMs: 0,
    scope: "avatar"
  },
  {
    id: "avatar_shadow_pulse",
    name: "Shadow Pulse",
    price: 260,
    description: "Dark purple ring with a pulsing void glow.",
    roomDurationMs: 0,
    scope: "avatar"
  },
  {
    id: "avatar_nebula_comet",
    name: "Azure Plasma",
    price: 300,
    description: "An animated electric-blue plasma ring with a clear center.",
    roomDurationMs: 0,
    scope: "avatar"
  },
  {
    id: "avatar_cyber_flux",
    name: "Cyber Flux",
    price: 275,
    description: "Digital green circuit ring with scanning highlights.",
    roomDurationMs: 0,
    scope: "avatar"
  },
  {
    id: "avatar_crimson_flare",
    name: "Crimson Flare",
    price: 275,
    description: "Red-orange flare ring with hot spark bursts.",
    roomDurationMs: 0,
    scope: "avatar"
  },
  {
    id: "avatar_lunar_arc",
    name: "Moonlit Crescent",
    price: 260,
    description: "A transparent crescent moon and starlight frame for your avatar.",
    roomDurationMs: 0,
    scope: "avatar"
  },
  {
    id: "avatar_candy_hearts",
    name: "Candy Hearts",
    price: 255,
    description: "Pink heart particles orbit a glossy candy ring.",
    roomDurationMs: 0,
    scope: "avatar"
  },
  {
    id: "avatar_aqua_spikes",
    name: "Air Force",
    price: 285,
    description: "A transparent tactical flight-helmet frame with a vivid blue aura.",
    roomDurationMs: 0,
    scope: "avatar"
  },
  {
    id: "avatar_obsidian_laser",
    name: "Obsidian Laser",
    price: 310,
    description: "Dark glass ring with violet and blue laser sweeps.",
    roomDurationMs: 0,
    scope: "avatar"
  },
  {
    id: "avatar_jade_stream",
    name: "Jade Stream",
    price: 270,
    description: "Green-white energy streams over a polished metallic ring.",
    roomDurationMs: 0,
    scope: "avatar"
  },
  {
    id: "avatar_bronze_rope",
    name: "Bronze Rope",
    price: 250,
    description: "Braided bronze-gold ring with molten amber highlights.",
    roomDurationMs: 0,
    scope: "avatar"
  },
  {
    id: "public_message",
    name: "Public Message",
    price: 150,
    description: "Broadcasts a prominent message to every connected chat user.",
    roomDurationMs: 8000,
    scope: "global"
  }
].map((effect) => Object.freeze({
  ...effect,
  price: Object.prototype.hasOwnProperty.call(EFFECT_PRICES, effect.id)
    ? EFFECT_PRICES[effect.id]
    : effect.price
})));

const UNPRICED_EFFECTS = EFFECTS.filter((effect) => effect.id !== "none" && !Object.prototype.hasOwnProperty.call(EFFECT_PRICES, effect.id));
if (UNPRICED_EFFECTS.length) {
  throw new Error(`Missing economy prices for: ${UNPRICED_EFFECTS.map((effect) => effect.id).join(", ")}`);
}

const EFFECT_MAP = new Map(EFFECTS.map((effect) => [effect.id, effect]));
const EFFECT_ALIASES = Object.freeze({
  flashbands: "flashbang",
  neon_glow: "neon",
  bubblegum: "bubble",
  plasma: "gradient",
  hologram: "holographic",
  void: "galaxy"
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
