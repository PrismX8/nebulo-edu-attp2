// UBG Chat — comprehensive self-contained frontend

// ─── Effects catalog ──────────────────────────────────────────────────────────
const EFFECTS = [
  { id:'none',          name:'None',           price:0,   scope:'message', color:'#52525b' },
  { id:'glass',         name:'Frosted Glass',   price:125, scope:'message', color:'#c4b5fd' },
  { id:'neon',          name:'Neon Trim',       price:150, scope:'message', color:'#f0abfc' },
  { id:'gradient',      name:'Color Drift',     price:125, scope:'message', color:'#60a5fa' },
  { id:'dark_smoke',    name:'Soft Smoke',      price:150, scope:'message', color:'#a1a1aa' },
  { id:'electric',      name:'Blue Current',    price:175, scope:'message', color:'#60a5fa' },
  { id:'fire',          name:'Ember Edge',      price:175, scope:'message', color:'#fb923c' },
  { id:'ice',           name:'Winter Glass',    price:175, scope:'message', color:'#67e8f9' },
  { id:'matrix_msg',    name:'Green Code',      price:150, scope:'message', color:'#4ade80' },
  { id:'galaxy',        name:'Night Sky',       price:175, scope:'message', color:'#a78bfa' },
  { id:'rainbow_border',name:'Spectrum',        price:200, scope:'message', color:'#f472b6' },
  { id:'aurora',        name:'Northern Lights', price:200, scope:'message', color:'#2dd4bf' },
  { id:'gold',          name:'Gilded',          price:150, scope:'message', color:'#fde68a' },
  { id:'cyberpunk',     name:'City Lights',     price:200, scope:'message', color:'#22d3ee' },
  { id:'topographic',   name:'Contour',         price:150, scope:'message', color:'#d4d4d8' },
  { id:'toxic_slime',   name:'Lime Drip',       price:200, scope:'message', color:'#84cc16' },
  { id:'bubble',        name:'Daydream',        price:150, scope:'message', color:'#bfdbfe' },
  { id:'ink_splash',    name:'Ink Wash',        price:175, scope:'message', color:'#a1a1aa' },
  { id:'holographic',   name:'Prism',           price:250, scope:'message', color:'#67e8f9' },
  { id:'wood',          name:'Walnut',          price:125, scope:'message', color:'#d08a3a' },
  { id:'carbon_fiber',  name:'Carbon Weave',    price:150, scope:'message', color:'#a1a1aa' },
  { id:'hearts',        name:'Rose Hearts',     price:150, scope:'message', color:'#fb7185' },
  { id:'flashbang',     name:'Flashbang',       price:150, scope:'room',    color:'#fff' },
  { id:'scramble',      name:'Scramble',        price:150, scope:'room',    color:'#4ade80' },
  { id:'matrix',        name:'Matrix',          price:150, scope:'room',    color:'#4ade80' },
  { id:'spiral',        name:'3D Vault Spiral', price:200, scope:'room',    color:'#a78bfa' },
  { id:'tag_cool',      name:'Cool',             price:100, scope:'tag',     color:'#38bdf8' },
  { id:'tag_respected', name:'Respected',        price:175, scope:'tag',     color:'#a78bfa' },
  { id:'tag_honor',     name:'Tag of Honor',     price:250, scope:'tag',     color:'#fbbf24' },
  { id:'tag_talkative', name:'Talkative',        price:150, scope:'tag',     color:'#f472b6' },
  { id:'tag_helpful',   name:'Helpful',          price:125, scope:'tag',     color:'#4ade80' },
  { id:'tag_veteran',   name:'Veteran',          price:300, scope:'tag',     color:'#fb923c' },
  { id:'tag_mvp',       name:'MVP',              price:225, scope:'tag',     color:'#f87171' },
  { id:'tag_member', name:'Member', price:400, scope:'tag', color:'#a1a1aa' },
  { id:'tag_regular', name:'Regular', price:600, scope:'tag', color:'#d4d4d8' },
  { id:'tag_active', name:'Active', price:1000, scope:'tag', color:'#4ade80' },
  { id:'tag_lowkey', name:'Lowkey', price:700, scope:'tag', color:'#94a3b8' },
  { id:'tag_night_shift', name:'Night Shift', price:1200, scope:'tag', color:'#818cf8' },
  { id:'tag_builder', name:'Builder', price:1800, scope:'tag', color:'#38bdf8' },
  { id:'tag_creator', name:'Creator', price:2200, scope:'tag', color:'#f9a8d4' },
  { id:'tag_tester', name:'Tester', price:1500, scope:'tag', color:'#67e8f9' },
  { id:'tag_supporter', name:'Supporter', price:2000, scope:'tag', color:'#fbbf24' },
  { id:'tag_contributor', name:'Contributor', price:2800, scope:'tag', color:'#60a5fa' },
  { id:'tag_collector', name:'Collector', price:2400, scope:'tag', color:'#f59e0b' },
  { id:'tag_arcade', name:'Arcade', price:800, scope:'tag', color:'#fb923c' },
  { id:'tag_focused', name:'Focused', price:900, scope:'tag', color:'#2dd4bf' },
  { id:'tag_original', name:'Original', price:3200, scope:'tag', color:'#e4e4e7' },
  { id:'tag_insider', name:'Insider', price:3500, scope:'tag', color:'#a78bfa' },
  { id:'tag_no_context', name:'No Context', price:1100, scope:'tag', color:'#f87171' },
  { id:'tag_casual', name:'Casual', price:600, scope:'tag', color:'#a3a3a3' },
  { id:'tag_classic', name:'Classic', price:3000, scope:'tag', color:'#d4d4d8' },
  { id:'banner_midnight', name:'Cyber Energy', price:200, scope:'banner', color:'#8b5cf6' },
  { id:'banner_reactor_meltdown', name:'Reactor Meltdown', price:275, scope:'banner', color:'#f97316' },
  { id:'banner_sunset', name:'Crystal Cavern', price:225, scope:'banner', color:'#a78bfa' },
  { id:'banner_frozen_kingdom', name:'Frozen Kingdom', price:275, scope:'banner', color:'#38bdf8' },
  { id:'banner_ocean', name:'Infinite Void', price:225, scope:'banner', color:'#7c3aed' },
  { id:'banner_jungle_ruins', name:'Jungle Ruins', price:275, scope:'banner', color:'#65a30d' },
  { id:'banner_sakura', name:'Black Hole', price:250, scope:'banner', color:'#c084fc' },
  { id:'banner_ocean_abyss', name:'Ocean Abyss', price:300, scope:'banner', color:'#06b6d4' },
  { id:'banner_emerald', name:'Data Stream', price:275, scope:'banner', color:'#8b5cf6' },
  { id:'banner_storm_front', name:'Storm Front', price:300, scope:'banner', color:'#94a3b8' },
  { id:'banner_mechanical_core', name:'Mechanical Core', price:300, scope:'banner', color:'#7c3aed' },
  { id:'banner_lava_forge', name:'Lava Forge', price:325, scope:'banner', color:'#ea580c' },
  { id:'banner_fractured_glass', name:'Fractured Glass', price:325, scope:'banner', color:'#a78bfa' },
  { id:'banner_digital_core', name:'Digital Core', price:325, scope:'banner', color:'#22d3ee' },
  { id:'banner_portal', name:'Portal', price:350, scope:'banner', color:'#c084fc' },
  { id:'banner_samurai_garden', name:'Samurai Garden', price:350, scope:'banner', color:'#fb7185' },
  { id:'banner_pirate_cove', name:'Pirate Cove', price:350, scope:'banner', color:'#f59e0b' },
  { id:'banner_astral_library', name:'Astral Library', price:375, scope:'banner', color:'#60a5fa' },
  { id:'profile_crystal_bloom', name:'Crystal Bloom', price:300, scope:'profile', color:'#a5f3fc', durationMs:1800, description:'Prismatic crystal clusters grow from every profile edge, pulse, and shatter into mist.' },
  { id:'profile_infinity_aquarium', name:'Infinity Aquarium', price:350, scope:'profile', color:'#22d3ee', durationMs:2000, description:'Clear water, luminous koi, a passing whale, bubbles, and coral transform the full profile frame.' },
  { id:'profile_living_city', name:'Living City', price:350, scope:'profile', color:'#38bdf8', durationMs:1900, description:'Drones assemble a neon skyline with hover traffic before the city folds back into cubes.' },
  { id:'profile_ancient_library', name:'Ancient Library', price:325, scope:'profile', color:'#f59e0b', durationMs:2000, description:'Flying books, self-writing pages, glowing symbols, and an ancient locking tome surround the profile.' },
  { id:'profile_clockwork_factory', name:'Clockwork Factory', price:350, scope:'profile', color:'#d97706', durationMs:1900, description:'Brass gears, mechanical arms, pistons, and steam assemble and reverse around the profile.' },
  { id:'profile_greenhouse', name:'The Greenhouse', price:325, scope:'profile', color:'#4ade80', durationMs:2000, description:'Seeds become vines, flowers, butterflies, and a dense canopy before autumn carries it away.' },
  { id:'profile_ice_cathedral', name:'Ice Cathedral', price:350, scope:'profile', color:'#a5f3fc', durationMs:1900, description:'Frozen pillars and translucent cathedral arches rise, refract sunlight, and shatter into glitter.' },
  { id:'profile_observatory', name:'Observatory', price:350, scope:'profile', color:'#fbbf24', durationMs:2000, description:'Brass orbital rings, planets, constellations, and a focusing telescope align around the profile.' },
  { id:'profile_ink_dimension', name:'Ink Dimension', price:325, scope:'profile', color:'#a78bfa', durationMs:1900, description:'Upward-flowing ink forms birds, impossible sculptures, and a castle before collapsing into one droplet.' },
  { id:'profile_dragon_forge', name:'Dragon Forge', price:375, scope:'profile', color:'#f97316', durationMs:2000, description:'Molten steel, dragon molds, mechanical hammers, and showers of sparks forge a creature around the frame.' },
  { id:'profile_museum_heist', name:'Museum Heist', price:375, scope:'profile', color:'#ef4444', durationMs:2000, description:'Security lasers, tiny thieves, drones, shattered displays, and alarms stage a complete miniature heist.' },
  { id:'avatar_purple_rift', name:'Aurora Halo', price:250, scope:'avatar', color:'#60a5fa' },
  { id:'avatar_stone_orbit', name:'Stone Orbit', price:260, scope:'avatar', color:'#fb923c' },
  { id:'avatar_magma', name:'Flame Orbit', price:275, scope:'avatar', color:'#fb923c' },
  { id:'avatar_lunar_arc', name:'Moonlit Crescent', price:260, scope:'avatar', color:'#fef3c7' },
  { id:'avatar_rainbow_orbit', name:'Rainbow Orbit', price:300, scope:'avatar', color:'#38bdf8' },
  { id:'avatar_vine_guardian', name:'Vine Guardian', price:250, scope:'avatar', color:'#84cc16' },
  { id:'avatar_nebula_comet', name:'Azure Plasma', price:300, scope:'avatar', color:'#38bdf8' },
  { id:'avatar_ice_spikes', name:'Ice Spikes', price:275, scope:'avatar', color:'#67e8f9' },
  { id:'avatar_crimson_flare', name:'Crimson Flare', price:275, scope:'avatar', color:'#fb4934' },
  { id:'avatar_sakura_bloom', name:'Sakura Bloom', price:240, scope:'avatar', color:'#f9a8d4' },
  { id:'avatar_candy_hearts', name:'Candy Hearts', price:255, scope:'avatar', color:'#f9a8d4' },
  { id:'avatar_gold_crown', name:'Golden Crown', price:325, scope:'avatar', color:'#fbbf24' },
  { id:'avatar_shadow_pulse', name:'Shadow Pulse', price:260, scope:'avatar', color:'#d946ef' },
  { id:'avatar_aqua_spikes', name:'Air Force', price:285, scope:'avatar', color:'#38bdf8' },
  { id:'avatar_obsidian_laser', name:'Obsidian Laser', price:310, scope:'avatar', color:'#818cf8' },
  { id:'avatar_jade_stream', name:'Jade Stream', price:270, scope:'avatar', color:'#4ade80' },
  { id:'avatar_bronze_rope', name:'Bronze Rope', price:250, scope:'avatar', color:'#d97706' },
  { id:'avatar_cyber_flux', name:'Cyber Flux', price:275, scope:'avatar', color:'#22c55e' },
  { id:'public_message',name:'Public Message',  price:150, scope:'global',  color:'#0099ff' },
];
const EFFECT_MAP = new Map(EFFECTS.map(e => [e.id, e]));
const EFFECT_ALIASES = Object.freeze({
  neon_glow: 'neon',
  bubblegum: 'bubble',
  plasma: 'gradient',
  hologram: 'holographic',
  void: 'galaxy'
});
function normalizeEffectId(id = '') {
  const clean = String(id || '').trim().toLowerCase();
  return EFFECT_ALIASES[clean] || clean;
}

function getEffectMeta(id = '') {
  return EFFECT_MAP.get(String(id || '').trim().toLowerCase()) || EFFECT_MAP.get(normalizeEffectId(id));
}

function tagEffectClass(effect = 'none') {
  const value = String(effect || 'none').trim().toLowerCase();
  return ['neon','shimmer','pulse','prism','glitch'].includes(value) ? ` tag-fx-${value}` : '';
}

function tagClassName(tagOrId) {
  const tag = typeof tagOrId === 'string' ? EFFECT_MAP.get(tagOrId) : tagOrId;
  const id = String(tag?.id || tagOrId || '').trim().toLowerCase();
  return `user-tag user-tag-${id.replace(/^tag_/, '')}${tagEffectClass(tag?.effect)}`;
}

function tagBadgeHtml(tag) {
  return tag?.scope === 'tag' ? `<span class="${esc(tagClassName(tag))}">${esc(tag.name)}</span>` : '';
}

function syncDynamicTagStyles() {
  let style = document.getElementById('dynamic-chat-tag-styles');
  if (!style) {
    style = document.createElement('style');
    style.id = 'dynamic-chat-tag-styles';
    document.head.appendChild(style);
  }
  style.textContent = EFFECTS.filter(effect => effect.scope === 'tag')
    .map(effect => {
      const slug = String(effect.id || '').replace(/^tag_/, '');
      const color = /^#[0-9a-f]{6}$/i.test(String(effect.color || '')) ? effect.color : '#a1a1aa';
      return `.user-tag-${slug}{color:${color}!important;background:color-mix(in srgb,${color} 11%,transparent)!important;border-color:color-mix(in srgb,${color} 22%,transparent)!important}`;
    })
    .join('\n');
}

async function configureReturnNavigation() {
  const links = [document.getElementById('chat-return-nav'), document.getElementById('chat-return-header')].filter(Boolean);
  const setupReturn = document.getElementById('chat-setup-return');
  const source = new URLSearchParams(window.location.search).get('from');
  let mode = source === 'games' ? 'games' : source === 'setup' ? 'setup' : null;
  if (!mode) {
    try {
      const response = await fetch('/api/setup-mode', { cache: 'no-store' });
      if (response.ok) {
        const payload = await response.json();
        if (payload?.mode === 'games' || payload?.mode === 'full') mode = payload.mode;
      }
    } catch {}
  }
  if (!links.length && !setupReturn) return;
  const gamesMode = mode === 'games';
  const setupMode = mode === 'setup' || !mode;
  const href = gamesMode ? '/games' : setupMode ? '/setup-v2' : '/@';
  const label = gamesMode ? 'Back to GΛMΞS' : setupMode ? 'Back to setup' : 'Back to workspace';
  const railLink = document.getElementById('chat-return-nav');
  if (railLink) railLink.style.display = gamesMode || setupMode ? 'flex' : 'none';
  const headerContextLink = document.getElementById('chat-return-header');
  if (headerContextLink) headerContextLink.style.display = setupMode ? 'none' : 'inline-flex';
  for (const link of links) {
    link.href = href;
    link.title = label;
    link.setAttribute('aria-label', label);
  }
  if (setupReturn) {
    setupReturn.href = '/setup-v2';
    setupReturn.title = 'Back to setup';
    setupReturn.setAttribute('aria-label', 'Back to setup');
    setupReturn.style.display = setupMode ? 'inline-flex' : 'none';
  }
  const headerLabel = document.querySelector('#chat-return-header .chat-games-return-label');
  if (headerLabel) headerLabel.textContent = gamesMode ? 'GΛMΞS' : setupMode ? 'Setup' : 'Workspace';
}

// ─── State ────────────────────────────────────────────────────────────────────
const S = {
  token: null, user: null, clientId: null, deviceId: null,
  sessionExpiredHandling: false, loginHandlersBound: false,
  apiBase: '', apiResolved: false,
  section: 'channels', room: null, roomMeta: null,
  membersOpen: true, socket: null,
  channels: [], friends: [], groups: [], currentMembers: [],
  dmsLoaded: false, groupsLoaded: false, dmsLoadPromise: null, groupsLoadPromise: null, groupLimit: 15,
  friendRequests: { incoming: [], outgoing: [] },
  lastMsgs: [], typingUsers: new Map(),
  sendQueue: [], sendQueueProcessing: false, localMessageSequence: 0,
  pollTimer: null, pollIntervalMs: 0, metaTimer: null, pollFailures: 0, pollInFlight: false,
  roomLoadSeq: 0,
  slowmodeMs: 0, slowmodeUntil: 0, slowmodeTimer: null, lockdownActive: false,
  replyTarget: null, pendingFiles: [],
  roomState: { read: null, pinned: [], bookmarkIds: [] },
  allowedReactions: ['👍', '❤️', '😂', '😮', '😢', '🔥', '🎉', '💯'],
  hasOlderMessages: true, loadingOlderMessages: false,
  drafts: {}, draftTimer: null, readTimer: null,
  presenceStatus: 'online', customStatus: '', presenceIdleTimer: null, presenceLastActivity: Date.now(),
  unreadCounts: {}, mentionCounts: {}, alerts: [],
  focusRewardTimer: null, focusRewardBound: false, focusRewardLastSentAt: 0,
  focusRewardInFlight: false, focusRewardLastState: null, focusRewardQueuedState: null,
  focusRewardBackoffUntil: 0,
  catalogRefreshInFlight: null, catalogRefreshAt: 0,
  equippedEffect: 'none', equippedTag: 'none', equippedBanner: 'none', equippedAvatarEffect: 'none', equippedProfileEffect: 'none',
  cosmeticsCategory: 'banners', cosmeticsSearch: '', tagManagerOpen: false,
  uiActionToken: `ui-${Math.random().toString(36).slice(2)}-${Date.now().toString(36)}`,
  globalRoom: null,
  voice: { roomName: null, roomType: null, localStream: null, peers: new Map(), muted: false, deafened: false, localSpeaking: false, screenOpen: false, audioContext: null, analyser: null, speakingFrame: null, roster: [], rotation: 0, rotationTimer: null, presenceTimer: null, presenceInFlight: false },
};

try { S.unreadCounts = JSON.parse(localStorage.getItem('tlkUnreadCounts') || '{}') || {}; } catch {}
try { S.mentionCounts = JSON.parse(localStorage.getItem('tlkMentionCounts') || '{}') || {}; } catch {}
try { S.equippedEffect = localStorage.getItem('equippedEffect') || 'none'; } catch {}
try { S.equippedAvatarEffect = localStorage.getItem('equippedAvatarEffect') || 'none'; } catch {}
try { S.drafts = JSON.parse(localStorage.getItem('tlkMessageDrafts') || '{}') || {}; } catch {}
try { S.presenceStatus = localStorage.getItem('chatPresenceStatus') || 'online'; } catch {}
try { S.customStatus = localStorage.getItem('chatCustomStatus') || ''; } catch {}

// ─── Utilities ────────────────────────────────────────────────────────────────
function esc(s) {
  return String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

function cssEsc(s) {
  if (window.CSS && typeof window.CSS.escape === 'function') return window.CSS.escape(String(s ?? ''));
  return String(s ?? '').replace(/["\\]/g, '\\$&');
}

function getClientId() {
  if (S.clientId) return S.clientId;
  let id = localStorage.getItem('tlkClientId');
  if (!id) { id = Math.random().toString(36).slice(2) + Date.now(); localStorage.setItem('tlkClientId', id); }
  return (S.clientId = id);
}

function getDeviceId() {
  if (S.deviceId) return S.deviceId;
  let id = localStorage.getItem('chatDeviceId');
  if (!id) { id = Math.random().toString(36).slice(2) + Date.now().toString(36); localStorage.setItem('chatDeviceId', id); }
  return (S.deviceId = id);
}

function fnv1a(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

function computeDmRoom(a, b) {
  const pair = [String(a).trim().toLowerCase(), String(b).trim().toLowerCase()].sort().join('|');
  let h = 2166136261;
  for (let i = 0; i < pair.length; i++) { h ^= pair.charCodeAt(i); h = Math.imul(h, 16777619); }
  let id = '';
  for (let i = 0; id.length < 8; i++) id += String.fromCharCode(97 + ((h >> (i * 5)) & 31) % 26);
  return id;
}

const AVATAR_COLORS = ['#0099ff','#8b5cf6','#ec4899','#f59e0b','#10b981','#ef4444','#06b6d4','#6366f1'];
function avatarColor(name) { return AVATAR_COLORS[fnv1a(String(name || '')) % AVATAR_COLORS.length]; }
function avatarInitials(name) { return String(name || '?').trim().slice(0, 2).toUpperCase(); }

function getChatBool(key, defaultValue = false) {
  const value = localStorage.getItem(key);
  return value === null ? defaultValue : value === 'true';
}

function saveDrafts() {
  try { localStorage.setItem('tlkMessageDrafts', JSON.stringify(S.drafts)); } catch {}
}

function draftSnapshot() {
  const input = document.getElementById('message-input');
  return {
    text: input?.value || '',
    reply: S.replyTarget ? buildReplySnapshot(S.replyTarget) : null,
    updatedAt: Date.now()
  };
}

function saveCurrentDraft() {
  if (!S.room) return;
  const draft = draftSnapshot();
  if (!draft.text.trim() && !draft.reply) delete S.drafts[S.room];
  else S.drafts[S.room] = draft;
  saveDrafts();
}

function scheduleDraftSave() {
  clearTimeout(S.draftTimer);
  S.draftTimer = setTimeout(saveCurrentDraft, 250);
}

function restoreRoomDraft(roomId) {
  const input = document.getElementById('message-input');
  const draft = S.drafts[roomId];
  if (input) {
    input.value = String(draft?.text || '');
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 120) + 'px';
  }
  clearReply({ saveDraft: false });
  if (draft?.reply) setReply(draft.reply, { saveDraft: false });
}

function clearRoomDraft(roomId = S.room) {
  if (!roomId) return;
  delete S.drafts[roomId];
  saveDrafts();
}

function applyChatPreferences() {
  document.body.classList.toggle('chat-compact', getChatBool('chatCompactMode', false));
  document.body.classList.toggle('chat-reduce-motion', !getChatBool('chatAnimations', true));
  S.membersOpen = getChatBool('chatShowMembers', true);
  const membersPanel = document.getElementById('members-panel');
  if (membersPanel) membersPanel.style.display = S.membersOpen ? '' : 'none';
  const membersResizer = document.getElementById('members-resizer');
  if (membersResizer) membersResizer.style.display = S.membersOpen ? '' : 'none';
  const messageInput = document.getElementById('message-input');
  if (messageInput) messageInput.spellcheck = getChatBool('chatSpellcheck', true);
  renderTypingBar();
}

function formatTime(d) {
  if (!d) return '';
  return new Date(d).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: !getChatBool('chat24HourTime', false),
  });
}

function messageTimeValue(msg = {}) {
  const direct = msg.date || msg.createdAt || msg.created_at || msg.time || msg.sentAt || msg.sent_at;
  if (direct) return direct;
  const rawTs = Number(msg.timestamp || msg.ts || 0);
  if (Number.isFinite(rawTs) && rawTs > 0) {
    return new Date(rawTs < 10_000_000_000 ? rawTs * 1000 : rawTs).toISOString();
  }
  if (!msg.__localReceivedAt) msg.__localReceivedAt = new Date().toISOString();
  return msg.__localReceivedAt;
}

function formatDateLabel(d) {
  if (!d) return '';
  const dt = new Date(d);
  const today = new Date(); const yest = new Date(today); yest.setDate(today.getDate() - 1);
  if (dt.toDateString() === today.toDateString()) return 'Today';
  if (dt.toDateString() === yest.toDateString()) return 'Yesterday';
  return dt.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
}

function sameDay(a, b) {
  if (!a || !b) return false;
  const da = new Date(a), db = new Date(b);
  return da.getFullYear() === db.getFullYear() && da.getMonth() === db.getMonth() && da.getDate() === db.getDate();
}

function getUsername(msg) { return msg?.nickname || msg?.username || msg?.name || 'Unknown'; }
function getMessageId(msg) { return msg?.id || msg?._id || ''; }
function myUsername() { return String(S.user?.username || S.user?.name || '').trim(); }

function messageAuthorKey(msg = {}) {
  if (msg.system) return 'system';
  const userId = String(msg.userId || msg.user_id || '').trim().toLowerCase();
  if (userId) return `id:${userId}`;
  const username = String(msg.username || msg.userName || '').trim().toLowerCase();
  if (username) return `username:${username}`;
  const userToken = String(msg.user_token || msg.userToken || '').trim();
  if (userToken) return `token:${userToken}`;
  return `name:${String(getUsername(msg) || 'unknown').trim().toLowerCase()}`;
}

function messageOrderValue(msg = {}) {
  const value = new Date(messageTimeValue(msg)).getTime();
  return Number.isFinite(value) ? value : 0;
}

function sortMessagesStable(messages = []) {
  return [...messages]
    .map((message, index) => ({ message, index }))
    .sort((a, b) => {
      const timeDiff = messageOrderValue(a.message) - messageOrderValue(b.message);
      if (timeDiff) return timeDiff;
      const sequenceDiff = Number(a.message.__localSequence || 0) - Number(b.message.__localSequence || 0);
      if (sequenceDiff) return sequenceDiff;
      const aId = String(getMessageId(a.message) || a.message.clientNonce || '');
      const bId = String(getMessageId(b.message) || b.message.clientNonce || '');
      const idDiff = aId.localeCompare(bId, undefined, { numeric: true });
      return idDiff || a.index - b.index;
    })
    .map(({ message }) => message);
}

function messageDedupKeys(msg = {}) {
  const keys = [];
  const nonce = String(msg.clientNonce || msg.client_nonce || '').trim();
  const id = String(getMessageId(msg) || '').trim();
  if (nonce) keys.push(`nonce:${nonce}`);
  if (id) keys.push(`id:${id}`);
  return keys;
}

function mergeMessageRecord(previous = {}, incoming = {}) {
  const hasIncoming = (key) => Object.prototype.hasOwnProperty.call(incoming, key);
  return {
    ...previous,
    ...incoming,
    userId: incoming.userId || incoming.user_id || previous.userId || previous.user_id || null,
    username: incoming.username || previous.username,
    nickname: incoming.nickname || incoming.name || previous.nickname || previous.name,
    user_token: incoming.user_token || incoming.userToken || previous.user_token || previous.userToken,
    avatar: hasIncoming('avatar') ? incoming.avatar : (previous.avatar || null),
    __pending: incoming.__pending !== undefined ? incoming.__pending : !!previous.__pending,
    __ownMessage: !!(previous.__ownMessage || incoming.__ownMessage),
    __localSequence: previous.__localSequence || incoming.__localSequence || 0,
    __localReceivedAt: previous.__localReceivedAt || incoming.__localReceivedAt || messageTimeValue(incoming)
  };
}

function mergeMessageBatch(current = [], incoming = []) {
  const merged = [];
  const indexes = new Map();
  [...current, ...incoming].forEach((message) => {
    if (!message || typeof message !== 'object') return;
    const keys = messageDedupKeys(message);
    const index = keys.map((key) => indexes.get(key)).find((value) => value !== undefined);
    if (index !== undefined) {
      merged[index] = mergeMessageRecord(merged[index], message);
      messageDedupKeys(merged[index]).forEach((key) => indexes.set(key, index));
      return;
    }
    keys.forEach((key) => indexes.set(key, merged.length));
    merged.push(message);
  });
  return sortMessagesStable(merged);
}

function canonicalizeMessageAuthors(messages = []) {
  const ordered = sortMessagesStable(messages);
  const profiles = new Map();

  ordered.forEach((message) => {
    if (!message || message.system) return;
    const key = messageAuthorKey(message);
    const previous = profiles.get(key) || {};
    const hasAvatar = Object.prototype.hasOwnProperty.call(message, 'avatar');
    profiles.set(key, {
      userId: message.userId || message.user_id || previous.userId || null,
      username: message.username || previous.username || null,
      nickname: message.nickname || message.name || previous.nickname || null,
      avatar: hasAvatar ? message.avatar : previous.avatar,
      role: message.role || previous.role || null,
      is_owner: message.is_owner !== undefined ? !!message.is_owner : !!previous.is_owner,
      is_premium: message.is_premium !== undefined ? !!message.is_premium : !!previous.is_premium,
      is_booster: message.is_booster !== undefined ? !!message.is_booster : !!previous.is_booster
    });
  });

  return ordered.map((message) => {
    if (!message || message.system) return message;
    const profile = profiles.get(messageAuthorKey(message));
    if (!profile) return message;
    return {
      ...message,
      userId: profile.userId || message.userId || message.user_id || null,
      username: profile.username || message.username || null,
      nickname: profile.nickname || message.nickname || message.name || 'Unknown',
      avatar: profile.avatar !== undefined ? profile.avatar : (message.avatar || null),
      role: profile.role || message.role || null,
      is_owner: profile.is_owner,
      is_premium: profile.is_premium,
      is_booster: profile.is_booster
    };
  });
}

function isMine(msg) {
  const myId = String(S.user?._id || S.user?.id || '').trim().toLowerCase();
  const messageId = String(msg?.userId || msg?.user_id || '').trim().toLowerCase();
  if (myId && messageId) return myId === messageId;
  const mine = myUsername().toLowerCase();
  const username = String(msg?.username || '').trim().toLowerCase();
  return !!mine && !!username && username === mine;
}
function isStaff() { return ['owner','admin'].includes(String(S.user?.role || '').toLowerCase()); }
function isMod() { return ['owner','admin','mod'].includes(String(S.user?.role || '').toLowerCase()); }
function isOwner() { return String(S.user?.role || '').toLowerCase() === 'owner' || S.user?.is_owner === true; }

function detectMentions(text) {
  const matches = String(text || '').match(/@(\w+)/g) || [];
  return matches.map(m => m.slice(1));
}

function saveUnread() {
  try { localStorage.setItem('tlkUnreadCounts', JSON.stringify(S.unreadCounts)); } catch {}
}
function saveMentions() {
  try { localStorage.setItem('tlkMentionCounts', JSON.stringify(S.mentionCounts)); } catch {}
}

// ─── API ──────────────────────────────────────────────────────────────────────
['pointerdown','keydown','touchstart','submit'].forEach(ev =>
  window.addEventListener(ev, () => {}, { capture: true, passive: true })
);

async function probeBase(base) {
  try {
    const r = await fetch(`${base}/api/network/sites?probe=1`, { cache: 'no-store' });
    if (!r.ok) return false;
    const d = await r.json();
    return !!(d?.globalRoom && Array.isArray(d?.sites));
  } catch { return false; }
}

async function resolveApiBase() {
  if (S.apiResolved) return S.apiBase;
  const candidates = [window.location.origin];
  if (['localhost','127.0.0.1'].includes(window.location.hostname)) {
    [5000,3000,4000,8080].forEach(p => candidates.push(`${window.location.protocol}//${window.location.hostname}:${p}`));
  }
  for (const c of candidates) {
    if (await probeBase(c)) { S.apiBase = c === window.location.origin ? '' : c; break; }
  }
  S.apiResolved = true;
  return S.apiBase;
}

async function api(url, opts = {}) {
  if (!S.apiResolved) await resolveApiBase();
  const fullUrl = /^https?:\/\//i.test(url) ? url : `${S.apiBase}${url}`;
  const headers = { ...(opts.headers || {}) };
  const token = S.token || localStorage.getItem('token');
  if (token) headers['x-auth-token'] = token;
  const method = (opts.method || 'GET').toUpperCase();
  if (['POST','PUT','PATCH','DELETE'].includes(method)) {
    headers['x-ubg-ui-action'] = S.uiActionToken;
    headers['x-ubg-ui-action-at'] = String(Date.now());
  }
  let body = opts.body;
  if (body && typeof body === 'object' && !(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(body);
  }
  const res = await fetch(fullUrl, { method, headers, body, cache: opts.cache, keepalive: opts.keepalive === true });
  if (!res.ok) {
    const err = new Error(`${method} ${url} → ${res.status}`);
    err.status = res.status;
    try { err.data = await res.json(); } catch { err.data = null; }
    if (res.status === 401 && token) handleSessionExpired();
    throw err;
  }
  const ct = res.headers.get('content-type') || '';
  return ct.includes('application/json') ? res.json() : res.text();
}

async function chatApi(url, opts = {}) {
  return api(url, { ...opts, headers: { 'x-tlk-client-id': getClientId(), 'x-chat-device-id': getDeviceId(), ...(opts.headers || {}) } });
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
function setToken(t) {
  S.token = t ? String(t).trim() : null;
  if (S.token) S.sessionExpiredHandling = false;
  if (S.token) localStorage.setItem('token', S.token); else localStorage.removeItem('token');
}

function handleSessionExpired() {
  if (S.sessionExpiredHandling) return;
  S.sessionExpiredHandling = true;
  setToken(null);
  setUser(null);
  S.socket?.disconnect?.();
  stopPolling();
  stopMeta();
  clearInterval(S.focusRewardTimer);
  clearInterval(S.voice?.presenceTimer);
  if (S.voice) S.voice.presenceTimer = null;
  showLogin();
  setupLoginHandlers();
}

function setUser(user) {
  S.user = user || null;
  if (user) {
    try { localStorage.setItem('user', JSON.stringify(user)); } catch {}
    if (user.token) setToken(user.token);
    if (user.equippedEffect) {
      S.equippedEffect = user.equippedEffect;
      localStorage.setItem('equippedEffect', S.equippedEffect);
      updateEffectBtn(user.equippedEffect, getEffectMeta(user.equippedEffect)?.color);
    }
    S.equippedTag = user.equippedTag || 'none';
    S.equippedBanner = user.equippedBanner || 'none';
    S.equippedAvatarEffect = user.equippedAvatarEffect || 'none';
    S.equippedProfileEffect = user.equippedProfileEffect || 'none';
    localStorage.setItem('equippedAvatarEffect', S.equippedAvatarEffect);
    const uname = (user.username || user.name || '').toLowerCase();
    if (uname) knownValidUsers.add(uname);
  } else { localStorage.removeItem('user'); }
}

function getCachedUser() {
  try {
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    const user = JSON.parse(raw);
    const hasIdentity = user && typeof user === 'object' &&
      (String(user._id || user.id || '').trim() || String(user.username || user.name || '').trim());
    return hasIdentity ? user : null;
  } catch {
    return null;
  }
}

function applyAccountUpdate(data, patch = {}) {
  if (data?.token) setToken(data.token);
  if (data?.user) setUser({ ...(S.user || {}), ...data.user, ...patch });
}

async function login(emailOrUser, password) {
  const data = await api('/api/auth', { method: 'POST', body: { username: emailOrUser, email: emailOrUser, password } });
  if (data.token) setToken(data.token);
  if (data.user) setUser(data.user);
  return data;
}

async function registerAccount(username, displayName, email, password) {
  const data = await api('/api/users', { method: 'POST', body: { username, displayName, email, password } });
  if (data.token) setToken(data.token);
  if (data.user) setUser(data.user);
  return data;
}

async function hydrateUserProfile(sessionToken) {
  try {
    const accountData = await api('/api/account/profile');
    // Ignore a profile response from an older session after an account change/logout.
    if (sessionToken !== (S.token || localStorage.getItem('token') || '')) return;
    if (accountData?.profile && S.user) {
      const profile = accountData.profile;
      setUser({ ...S.user, ...profile, avatar: profile.avatar || profile.avatar_url || S.user.avatar || null });
    }
  } catch {
    // Profile decoration is nonessential; authentication stays authoritative.
  }
}

async function loadUser() {
  try {
    if (!(S.token || localStorage.getItem('token'))) return null;
    const data = await api('/api/auth');
    let user = data?.user || (
      data && typeof data === 'object' && (data._id || data.id) && (data.username || data.name)
        ? data
        : null
    );
    if (user) {
      setUser(user);
      void hydrateUserProfile(S.token || localStorage.getItem('token') || '');
    }
    return user;
  } catch (err) {
    if (err.status === 401) { setToken(null); setUser(null); }
    // Retain a known local session for a transient network failure. The server
    // still validates every protected request, and a 401 clears it above.
    return S.user || null;
  }
}

function logout() {
  if (S.focusRewardTimer) clearInterval(S.focusRewardTimer);
  S.focusRewardTimer = null;
  setToken(null); setUser(null);
  S.room = null; S.roomMeta = null; S.lastMsgs = [];
  stopPolling(); stopMeta();
  if (S.socket) { S.socket.disconnect(); S.socket = null; }
  showLogin();
}

// ─── Toast ────────────────────────────────────────────────────────────────────
const TOAST_ICON = { info:'info', success:'check_circle', error:'error', warn:'warning' };
function toast(msg, type = 'info') {
  const host = document.getElementById('toast-host');
  if (!host) return;
  const el = document.createElement('div');
  el.className = `toast toast-${type}`;
  el.innerHTML = `<span class="material-icons-round" style="font-size:16px">${TOAST_ICON[type]||'info'}</span>${esc(msg)}`;
  host.appendChild(el);
  setTimeout(() => el.remove(), 3500);
}

function showCoinReward(amount) {
  if (!getChatBool('chatCoinPopups', true)) return;
  const earned = Math.max(0, Math.trunc(Number(amount || 0)));
  const host = document.getElementById('toast-host');
  if (!host || !earned) return;
  const el = document.createElement('div');
  el.className = 'coin-reward-pop';
  el.textContent = `+${earned} coin${earned === 1 ? '' : 's'}`;
  host.appendChild(el);
  setTimeout(() => el.remove(), 1300);
}

// ─── Modal ────────────────────────────────────────────────────────────────────
function openModal(html) {
  document.getElementById('modal-content').innerHTML = html;
  document.getElementById('modal-overlay').style.display = 'flex';
}
function closeModal() { document.getElementById('modal-overlay').style.display = 'none'; }
window.closeModal = closeModal;

function confirmAction(message, confirmLabel = 'Confirm') {
  return new Promise((resolve) => {
    openModal(`<h3 style="font-size:17px;font-weight:700;color:#fff;margin:0 0 8px">Confirm purchase</h3>
      <p style="font-size:12px;line-height:1.55;color:#a1a1aa;margin:0 0 16px">${esc(message)}</p>
      <div style="display:flex;gap:8px"><button id="confirm-action-cancel" class="modal-btn modal-btn-ghost">Cancel</button><button id="confirm-action-ok" class="modal-btn modal-btn-primary">${esc(confirmLabel)}</button></div>`);
    document.getElementById('confirm-action-cancel')?.addEventListener('click', () => { closeModal(); resolve(false); }, { once: true });
    document.getElementById('confirm-action-ok')?.addEventListener('click', () => { closeModal(); resolve(true); }, { once: true });
  });
}

function showModalError(id, msg) {
  const el = document.getElementById(id);
  if (el) { el.textContent = msg; el.style.display = 'block'; }
}

// ─── Alert Banner ────────────────────────────────────────────────────────────
function showAlertBanner(msg, type = 'error') {
  const b = document.getElementById('alert-banner');
  if (!b) return;
  const icon = type === 'ban' ? 'block' : type === 'warn' ? 'warning' : 'info';
  b.style.display = 'flex';
  b.innerHTML = `<span class="material-icons-round" style="font-size:16px">${icon}</span><span>${esc(msg)}</span><button onclick="this.parentElement.style.display='none'" style="margin-left:auto;background:none;border:none;cursor:pointer;color:#f87171"><span class="material-icons-round" style="font-size:15px">close</span></button>`;
}

// ─── Alerts ───────────────────────────────────────────────────────────────────
async function fetchAlerts() {
  try {
    const data = await chatApi('/api/network/alerts');
    const items = Array.isArray(data?.alerts) ? data.alerts : [];
    const alertsById = new Map();
    items.forEach(alert => alertsById.set(String(alert.id || `${alert.type}:${alert.message}:${alert.at}`), alert));
    S.alerts = [...alertsById.values()].sort((a, b) => Number(b.at || 0) - Number(a.at || 0));
    const badge = document.getElementById('alerts-badge');
    if (badge) {
      const count = S.alerts.length;
      badge.style.display = count ? 'flex' : 'none';
      badge.textContent = count > 9 ? '9+' : String(count);
    }
    items.forEach(alert => {
      if (alert.type === 'ban' || alert.type === 'warn') showAlertBanner(alert.message || String(alert.type), alert.type);
    });
  } catch {}
}

// ─── Desktop Notifications ────────────────────────────────────────────────────
function canNotify() { return typeof Notification !== 'undefined' && Notification.permission === 'granted'; }
async function requestNotifyPermission() {
  if (typeof Notification === 'undefined') return false;
  const perm = await Notification.requestPermission();
  localStorage.setItem('chatNotifications', String(perm === 'granted'));
  try { if (perm === 'granted') navigator.serviceWorker?.register('/notification-sw.js'); } catch {}
  return perm === 'granted';
}

function showDesktopNotification(title, body, channelId) {
  if (!getChatBool('chatNotifications', false) || !canNotify() || (!document.hidden && document.hasFocus())) return;
  try {
    const notificationBody = getChatBool('chatNotificationPreviews', true)
      ? String(body).slice(0, 160)
      : 'Open UBG Chat to view this message.';
    const n = new Notification(title, { body: notificationBody });
    n.onclick = () => { window.focus(); if (channelId) joinRoom(channelId, S.roomMeta?.type || 'channel', channelId); n.close(); };
  } catch {}
}

function maybeNotify(msg) {
  if (!canNotify() || isMine(msg)) return;
  const me = myUsername().toLowerCase();
  const body = String(msg.body || '');
  const isDm = S.roomMeta?.type === 'dm';
  const mentioned = me && detectMentions(body).some(n => n.toLowerCase() === me);
  if (!isDm && !mentioned) return;
  const sender = getUsername(msg);
  const title = isDm ? `DM from ${sender}` : `Mentioned by ${sender}`;
  showDesktopNotification(title, body, S.room);
}

function isChatRewardFocused() {
  return document.visibilityState === 'visible' && document.hasFocus();
}

async function sendFocusRewardHeartbeat(focused = isChatRewardFocused()) {
  if (!S.user || !S.token) return;
  const now = Date.now();
  const nextState = focused === true;
  const stateChanged = S.focusRewardLastState !== nextState;
  if (now < S.focusRewardBackoffUntil) return;
  if (!stateChanged && now - S.focusRewardLastSentAt < 20_000) return;
  if (S.focusRewardInFlight) {
    S.focusRewardQueuedState = nextState;
    return;
  }
  S.focusRewardInFlight = true;
  S.focusRewardLastState = nextState;
  S.focusRewardLastSentAt = now;
  try {
    const data = await api('/api/tlk/rewards/focus-heartbeat', {
      method: 'POST',
      body: { focused: nextState },
      keepalive: !nextState
    });
    if (data?.reward) {
      setUser({ ...(S.user || {}), coins: Number(data.reward.balance || 0) });
      toast(`+${data.reward.coinsEarned} coins for 5 focused minutes`, 'success');
    }
  } catch (error) {
    if (Number(error?.status || 0) === 429) S.focusRewardBackoffUntil = Date.now() + 60_000;
    if (![0, 401, 429].includes(Number(error?.status || 0))) {
      console.warn('[UBG Chat] Focus reward heartbeat failed:', error?.message || error);
    }
  } finally {
    S.focusRewardInFlight = false;
    const queuedState = S.focusRewardQueuedState;
    S.focusRewardQueuedState = null;
    if (queuedState !== null && queuedState !== S.focusRewardLastState) {
      setTimeout(() => void sendFocusRewardHeartbeat(queuedState), 250);
    }
  }
}

function startFocusRewards() {
  if (!S.focusRewardBound) {
    window.addEventListener('focus', () => void sendFocusRewardHeartbeat(true));
    window.addEventListener('blur', () => void sendFocusRewardHeartbeat(false));
    document.addEventListener('visibilitychange', () => {
      void sendFocusRewardHeartbeat(isChatRewardFocused());
    });
    window.addEventListener('pagehide', () => void sendFocusRewardHeartbeat(false));
    S.focusRewardBound = true;
  }
  if (S.focusRewardTimer) clearInterval(S.focusRewardTimer);
  void sendFocusRewardHeartbeat(isChatRewardFocused());
  S.focusRewardTimer = setInterval(() => {
    if (isChatRewardFocused()) void sendFocusRewardHeartbeat(true);
  }, 30_000);
}

function isMentionForMe(msg) {
  if (!msg || isMine(msg)) return false;
  const me = myUsername().toLowerCase();
  if (!me) return false;
  return detectMentions(String(msg.body || msg.content || '')).some((name) => name.toLowerCase() === me);
}

function channelRoomId(channel = {}) {
  return String(channel?.room || channel?.id || '').trim().toLowerCase();
}

function roomLabel(roomId = '') {
  const room = String(roomId || '').trim();
  if (!room) return 'chat';
  if (room === S.globalRoom) return 'Global Chat';
  const channel = (S.channels || []).find((item) => channelRoomId(item) === room);
  if (channel) return channel.name || channel.id || room;
  const group = (S.groups || []).find((item) => String(item.room) === room);
  if (group) return group.name || room;
  const myName = myUsername();
  const friend = (S.friends || []).find((item) => computeDmRoom(myName, item.username || item.name || '') === room);
  if (friend) return friend.name || friend.username || 'DM';
  const activeBtn = document.querySelector(`.sb-item[data-room="${cssEsc(room)}"]`);
  return activeBtn?.dataset?.roomName || room;
}

function showMentionPopup(roomId, msg) {
  const sender = getUsername(msg);
  const body = String(msg?.body || msg?.content || '').replace(/\s+/g, ' ').trim();
  const previous = document.getElementById('mention-popup');
  if (previous) previous.remove();

  const popup = document.createElement('button');
  popup.type = 'button';
  popup.id = 'mention-popup';
  popup.className = 'mention-popup';
  popup.innerHTML = `
    <span class="material-icons-round" style="font-size:17px;color:#60a5fa">alternate_email</span>
    <span style="min-width:0;display:flex;flex-direction:column;gap:2px">
      <span style="font-size:11px;color:#93c5fd;font-weight:800;text-transform:uppercase;letter-spacing:.06em">Mention in ${esc(roomLabel(roomId))}</span>
      <span style="font-size:13px;color:#f4f4f5;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(sender)}: ${esc(body.slice(0, 120))}</span>
    </span>
  `;
  popup.addEventListener('click', () => {
    popup.remove();
    const btn = document.querySelector(`.sb-item[data-room="${cssEsc(String(roomId || ''))}"]`);
    const type = btn?.dataset?.roomType || 'channel';
    const name = btn?.dataset?.roomName || roomLabel(roomId);
    joinRoom(roomId, type, name);
  });
  document.body.appendChild(popup);
  setTimeout(() => {
    if (!popup.isConnected) return;
    popup.style.opacity = '0';
    popup.style.transform = 'translateX(-50%) translateY(-8px)';
    setTimeout(() => popup.remove(), 220);
  }, 6500);
}

// ─── Socket ───────────────────────────────────────────────────────────────────
function handleRealtimeMessage(data = {}) {
  const msg = data?.message || data;
  const roomId = String(data?.roomId || msg?.roomId || msg?.room || '').trim().toLowerCase();
  const activeRoom = String(S.room || '').trim().toLowerCase();
  if (!msg || !roomId) return;
  const incomingTagId = String(msg.equippedTag || '').trim().toLowerCase();
  if (/^tag_custom_[a-z0-9_]+$/.test(incomingTagId) && !EFFECT_MAP.has(incomingTagId) && Date.now() - S.catalogRefreshAt > 30_000) {
    S.catalogRefreshAt = Date.now();
    if (!S.catalogRefreshInFlight) {
      S.catalogRefreshInFlight = refreshMessageEffectState()
        .then(() => { if (String(S.room || '').trim().toLowerCase() === roomId) renderMessages(S.lastMsgs); })
        .finally(() => { S.catalogRefreshInFlight = null; });
    }
  }
  const displayMsg = withLocalMessageIdentity({ ...msg, roomId: msg.roomId || roomId });
  const activeAtBottom = roomId === activeRoom && isNearMessageBottom();
  const mentioned = isMentionForMe(msg);
  if (mentioned && !activeAtBottom) {
    incrementMention(roomId, msg);
  }
  if (roomId !== activeRoom) {
    incrementUnread(roomId);
    return;
  }

  const clientNonce = String(displayMsg.clientNonce || displayMsg.client_nonce || '').trim();
  let pendingIndex = -1;
  if (clientNonce) {
    pendingIndex = S.lastMsgs.findIndex((item) =>
      item?.__pending && String(item.clientNonce || item.client_nonce || '').trim() === clientNonce
    );
  } else if (isOwnMessage(displayMsg)) {
    // Older DM responses did not echo clientNonce. Match their canonical row
    // to the oldest recent optimistic copy instead of displaying both.
    const incomingBody = String(displayMsg.body || displayMsg.content || '').trim();
    const incomingTime = messageOrderValue(displayMsg);
    pendingIndex = S.lastMsgs.findIndex((item) => {
      if (!item?.__pending) return false;
      const pendingRoom = String(item.roomId || S.room || '').trim().toLowerCase();
      if (pendingRoom !== roomId) return false;
      if (String(item.body || item.content || '').trim() !== incomingBody) return false;
      const pendingTime = messageOrderValue(item);
      return !incomingTime || !pendingTime || Math.abs(incomingTime - pendingTime) <= 30_000;
    });
  }
  if (pendingIndex >= 0) {
    const pending = S.lastMsgs[pendingIndex];
    S.lastMsgs[pendingIndex] = withLocalMessageIdentity({
      ...pending,
      ...displayMsg,
      clientNonce: clientNonce || pending.clientNonce || pending.client_nonce,
      __pending: false,
      __ownMessage: true,
      __localReceivedAt: pending.__localReceivedAt || messageTimeValue(displayMsg)
    });
    S.lastMsgs = sortMessagesStable(S.lastMsgs);
    renderMessages(S.lastMsgs);
    scheduleMarkRead();
    return;
  }

  const messageId = getMessageId(displayMsg);
  if (messageId && S.lastMsgs.some((item) => getMessageId(item) === messageId)) {
    mergeMessageUpdate(displayMsg);
    return;
  }
  if (!isOwnMessage(displayMsg) && !activeAtBottom) incrementUnread(roomId, { force: true });
  appendMessage(displayMsg);
  if (activeAtBottom) scheduleMarkRead();
  updateJumpToLatest();
  maybeNotify(displayMsg);
}

function isOwnMessage(msg = {}) {
  return !!(msg.__ownMessage || isMine(msg));
}

function withLocalMessageIdentity(msg = {}) {
  if (!isOwnMessage(msg)) return msg;
  let storedAvatarEffect = 'none';
  try { storedAvatarEffect = localStorage.getItem('equippedAvatarEffect') || 'none'; } catch {}
  return {
    ...msg,
    username: msg.username || S.user?.username || undefined,
    nickname: msg.nickname || S.user?.displayName || S.user?.name || S.user?.username || undefined,
    avatar: msg.avatar || S.user?.avatar || S.user?.avatar_url || null,
    equippedAvatarEffect: validAvatarEffectId(msg.equippedAvatarEffect || S.equippedAvatarEffect || storedAvatarEffect),
    equippedEffect: msg.equippedEffect || S.equippedEffect || 'none',
    equippedTag: msg.equippedTag || S.equippedTag || 'none'
  };
}

function ownOutgoingMessage(msg = {}) {
  let storedAvatarEffect = 'none';
  try { storedAvatarEffect = localStorage.getItem('equippedAvatarEffect') || 'none'; } catch {}
  const effectId = validAvatarEffectId(S.equippedAvatarEffect || storedAvatarEffect || msg.equippedAvatarEffect);
  return withLocalMessageIdentity({
    ...msg,
    __ownMessage: true,
    __localReceivedAt: msg.__localReceivedAt || msg.date || msg.createdAt || msg.created_at || new Date().toISOString(),
    __forceAvatarGroup: effectId !== 'none',
    roomId: msg.roomId || S.room,
    userId: msg.userId || S.user?._id || S.user?.id || null,
    nickname: msg.nickname || S.user?.name || S.user?.username || myUsername() || 'Unknown',
    username: msg.username || S.user?.username || myUsername() || undefined,
    avatar: msg.avatar || S.user?.avatar || S.user?.avatar_url || null,
    equippedAvatarEffect: effectId,
    equippedEffect: msg.equippedEffect || S.equippedEffect || 'none',
    equippedTag: msg.equippedTag || S.equippedTag || 'none'
  });
}

function mergeMessageUpdate(incoming = {}) {
  const incomingId = String(getMessageId(incoming) || '');
  if (!incomingId) return false;
  let changed = false;
  S.lastMsgs = S.lastMsgs.map((message) => {
    if (String(getMessageId(message) || '') !== incomingId) return message;
    const hasIncoming = (key) => Object.prototype.hasOwnProperty.call(incoming, key);
    const merged = {
      ...message,
      userId: incoming.userId || incoming.user_id || message.userId || message.user_id || null,
      username: incoming.username || message.username,
      nickname: incoming.nickname || incoming.name || message.nickname || message.name,
      user_token: incoming.user_token || incoming.userToken || message.user_token || message.userToken,
      receipts: incoming.receipts || message.receipts,
      avatar: hasIncoming('avatar') ? incoming.avatar : (message.avatar || null),
      equippedAvatarEffect: incoming.equippedAvatarEffect || message.equippedAvatarEffect || 'none',
      equippedEffect: incoming.equippedEffect || message.equippedEffect || 'none',
      equippedTag: incoming.equippedTag || message.equippedTag || 'none',
      body: incoming.body || incoming.content || message.body || message.content || '',
      content: incoming.content || incoming.body || message.content || message.body || '',
      reply: incoming.reply || message.reply || null,
      attachments: incoming.attachments || message.attachments || [],
      reactions: incoming.reactions || message.reactions || [],
      pinned: incoming.pinned !== undefined ? incoming.pinned : !!message.pinned,
      bookmarked: incoming.bookmarked !== undefined ? incoming.bookmarked : !!message.bookmarked,
      editedAt: incoming.editedAt || message.editedAt || null,
      role: message.role || incoming.role || null,
      is_owner: message.is_owner || incoming.is_owner,
      is_premium: message.is_premium || incoming.is_premium,
      is_booster: message.is_booster || incoming.is_booster
    };
    changed = JSON.stringify(message) !== JSON.stringify(merged);
    return merged;
  });
  if (changed) S.lastMsgs = sortMessagesStable(S.lastMsgs);
  if (changed) renderMessages(S.lastMsgs);
  return changed;
}

function mergeReceiptUpdates(receipts = []) {
  if (!Array.isArray(receipts) || !receipts.length) return false;
  const byId = new Map(receipts
    .filter((item) => item && item.id && item.receipts)
    .map((item) => [String(item.id), item.receipts]));
  if (!byId.size) return false;

  let changed = false;
  S.lastMsgs = S.lastMsgs.map((message) => {
    const id = String(getMessageId(message) || '');
    const nextReceipts = byId.get(id);
    if (!id || !nextReceipts) return message;
    const prev = JSON.stringify(message.receipts || {});
    const next = JSON.stringify(nextReceipts || {});
    if (prev === next) return message;
    changed = true;
    return { ...message, receipts: nextReceipts };
  });
  if (changed) renderMessages(S.lastMsgs);
  return changed;
}

function handleReceiptUpdate(data = {}) {
  const roomId = String(data?.roomId || data?.room || '').trim().toLowerCase();
  const activeRoom = String(S.room || '').trim().toLowerCase();
  if (!roomId || roomId !== activeRoom) return;
  mergeReceiptUpdates(data.receipts || []);
}

function initSocket() {
  if (S.socket) return;
  const token = S.token || localStorage.getItem('token');
  if (!token || typeof io === 'undefined') return;
  S.socket = io(S.apiBase || window.location.origin, {
    auth: { token, clientId: getClientId() }, transports: ['websocket','polling'], reconnectionAttempts: 8,
  });
  S.socket.on('connect', () => {
    S.socket.emit('identify_user');
    if (S.room) S.socket.emit('join_room', S.room);
    startPolling(30_000);
    void pollMessages();
    startMeta();
  });
  S.socket.on('alert_created', (data = {}) => {
    if (data.message) toast(data.message, 'info');
    void fetchAlerts();
  });
  S.socket.on('receive_message', handleRealtimeMessage);
  S.socket.on('message_receipts_updated', handleReceiptUpdate);
  S.socket.on('message_edited', (data = {}) => {
    if (String(data.roomId || '') !== String(S.room || '')) return;
    applyEditedMessage(data.message || { id: data.messageId, body: data.body, editedAt: data.editedAt });
  });
  S.socket.on('message_reactions_updated', (data = {}) => {
    if (String(data.roomId || '') !== String(S.room || '')) return;
    applyReactionUpdate(data);
  });
  S.socket.on('message_pin_updated', (data = {}) => {
    if (String(data.roomId || '') !== String(S.room || '')) return;
    applyPinUpdate(data);
  });
  S.socket.on('message_deleted', (data = {}) => {
    const roomId = String(data.roomId || '').trim().toLowerCase();
    if (roomId !== String(S.room || '').trim().toLowerCase()) return;
    const messageId = String(data.messageId || '').trim();
    if (!messageId) return;
    S.lastMsgs = S.lastMsgs.filter((message) => String(getMessageId(message)) !== messageId);
    renderMessages(S.lastMsgs);
  });
  S.socket.on('tag_catalog_updated', async () => {
    if (!S.catalogRefreshInFlight) {
      S.catalogRefreshInFlight = refreshMessageEffectState()
        .finally(() => { S.catalogRefreshInFlight = null; });
    }
    await S.catalogRefreshInFlight;
    renderMessages(S.lastMsgs);
    renderCurrentMemberList();
    if (S.section === 'cosmetics') await renderCosmetics();
  });
  S.socket.on('user_typing', (data) => {
    if (data?.roomId !== S.room || data.username === myUsername()) return;
    handleTyping(data.username, !!data.isTyping);
  });
  S.socket.on('chat_cleared', (data) => {
    if (data?.room !== S.room) return;
    S.lastMsgs = [];
    const list = document.getElementById('messages-list');
    if (list) list.innerHTML = emptyPlaceholder();
  });
  S.socket.on('moderation_updated', (data = {}) => {
    const appliesToRoom = data.scope === 'global' || String(data.room || '').trim().toLowerCase() === String(S.room || '').trim().toLowerCase();
    if (!appliesToRoom) return;
    S.slowmodeMs = Math.max(0, Number(data.slowmodeMs || 0));
    if (data.lockdownActive !== undefined) S.lockdownActive = !!data.lockdownActive;
    renderSlowmodeConfig();
  });
  S.socket.on('room_effect', (data) => {
    if (data?.room !== S.room) return;
    showEffectActivationNotice(data, 'room');
    triggerRoomEffect(data.effectId, data.durationMs, data);
  });
  S.socket.on('global_effect', (data) => {
    showEffectActivationNotice(data, 'global');
    if (data?.effectId === 'public_message' && data?.message) {
      showPublicMessageEffect(data.message, data.triggeredByName, data.durationMs);
      return;
    }
    if (data?.effectId) triggerRoomEffect(data.effectId, data.durationMs || 5000, data);
  });
  S.socket.on('room_settings_updated', (data) => {
    if (data?.room === S.room && data.settings?.backgroundImage !== undefined) {
      applyRoomBg(data.settings.backgroundImage);
    }
  });
  S.socket.on('voice_peers', (data) => handleVoicePeers(data));
  S.socket.on('voice_peer_joined', (data) => handleVoicePeerJoined(data));
  S.socket.on('voice_offer', (data) => handleVoiceOffer(data));
  S.socket.on('voice_answer', (data) => handleVoiceAnswer(data));
  S.socket.on('voice_ice_candidate', (data) => handleVoiceIceCandidate(data));
  S.socket.on('voice_peer_left', (data) => handleVoicePeerLeft(data));
  S.socket.on('voice_speaking', (data) => {
    const peer = S.voice.peers.get(data?.peerId);
    if (peer) { peer.speaking = !!data.isSpeaking; renderVoiceBar(); renderCurrentMemberList(); }
  });
  S.socket.on('disconnect', () => { startPolling(2_500); });
  S.socket.on('connect_error', () => { startPolling(2_500); });
}

// ─── Voice ────────────────────────────────────────────────────────────────────
async function joinVoice(roomName, roomType = 'public') {
  if (S.voice.roomName) await leaveVoice();
  let stream;
  try {
    const inputDevice = localStorage.getItem('voiceInputDevice') || '';
    stream = await navigator.mediaDevices.getUserMedia({ audio: {
      ...(inputDevice ? { deviceId: { exact: inputDevice } } : {}),
      echoCancellation: getChatBool('voiceEchoCancellation', true),
      noiseSuppression: getChatBool('voiceNoiseSuppression', true),
      autoGainControl: getChatBool('voiceAutoGain', true),
    }, video: false });
  } catch {
    toast('Microphone access denied', 'error'); return;
  }
  S.voice.localStream = stream;
  S.voice.muted = getChatBool('voiceMuteOnJoin', false);
  stream.getAudioTracks().forEach(track => { track.enabled = !S.voice.muted; });
  S.voice.roomName = roomName;
  S.voice.roomType = roomType;
  try {
    await api('/api/voice/start-call', { method: 'POST', body: {
      roomName, roomType, channelName: roomName,
      isGroupChat: roomType === 'group', isDM: roomType === 'dm'
    }});
  } catch (err) {
    toast(err.data?.error || 'Failed to join voice', 'error');
    stream.getTracks().forEach(t => t.stop());
    S.voice.localStream = null; S.voice.roomName = null; return;
  }
  if (S.socket) S.socket.emit('voice_join', { roomName });
  startLocalSpeakingDetection(stream);
  setVoiceStageVisible(true);
  renderVoiceBar();
  renderChannels();
  toast('Joined voice channel', 'success');
}
window.joinVoice = joinVoice;

function setVoiceStageVisible(open) {
  const stage = document.getElementById('voice-stage');
  const messages = document.getElementById('messages-container');
  const composer = document.getElementById('compose-area');
  S.voice.screenOpen = !!open && !!S.voice.roomName;
  if (stage) stage.style.display = S.voice.screenOpen ? 'block' : 'none';
  if (messages) messages.style.display = S.voice.screenOpen ? 'none' : 'flex';
  if (composer) composer.style.display = S.voice.screenOpen ? 'none' : '';
  if (S.voice.screenOpen) renderVoiceStage();
}

function voiceTile(name, avatar, speaking, isSelf = false, muted = false) {
  const cleanName = String(name || 'User');
  const color = avatarColor(cleanName);
  const fallback = esc(avatarInitials(cleanName));
  const avatarContent = avatar
    ? `<img src="${esc(avatar)}" alt="" style="width:100%;height:100%;object-fit:cover" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><span style="display:none;position:absolute;inset:0;align-items:center;justify-content:center">${fallback}</span>`
    : fallback;
  return `<div class="voice-tile${speaking ? ' speaking' : ''}">
    <div class="voice-tile-avatar" style="background:${color}">${avatarContent}</div>
    <div class="voice-tile-name">${esc(cleanName)}${isSelf ? ' (you)' : ''}</div>
    <div class="voice-tile-state"><span class="material-icons-round" style="font-size:13px;color:${muted ? '#f87171' : speaking ? '#4ade80' : '#71717a'}">${muted ? 'mic_off' : 'mic'}</span>${muted ? 'Muted' : speaking ? 'Speaking' : 'Connected'}</div>
  </div>`;
}

function renderVoiceStage() {
  const stage = document.getElementById('voice-stage');
  if (!stage || !S.voice.screenOpen || !S.voice.roomName) return;
  const roomLabel = S.voice.roomName.replace(/^voice:/, '').replace(/[-_]+/g, ' ');
  const peers = [...S.voice.peers.values()];
  const tiles = [
    voiceTile(myUsername(), S.user?.avatar || null, S.voice.localSpeaking, true, S.voice.muted),
    ...peers.map(peer => voiceTile(peer.name, peer.avatar || null, !!peer.speaking, false, false))
  ].join('');
  stage.innerHTML = `<div class="voice-stage-shell">
    <div class="voice-stage-heading"><h2>${esc(roomLabel || 'Voice channel')}</h2><p>${peers.length + 1} participant${peers.length ? 's' : ''} connected</p></div>
    <div class="voice-stage-grid">${tiles}</div>
    <div class="voice-stage-controls">
      <button id="stage-mute-btn" class="voice-stage-control${S.voice.muted ? ' active' : ''}" title="${S.voice.muted ? 'Unmute' : 'Mute'}"><span class="material-icons-round">${S.voice.muted ? 'mic_off' : 'mic'}</span></button>
      <button id="stage-deafen-btn" class="voice-stage-control${S.voice.deafened ? ' active' : ''}" title="${S.voice.deafened ? 'Undeafen' : 'Deafen'}"><span class="material-icons-round">${S.voice.deafened ? 'headset_off' : 'headphones'}</span></button>
      <button id="stage-chat-btn" class="voice-stage-control" title="Return to text chat"><span class="material-icons-round">chat</span></button>
      <button id="stage-leave-btn" class="voice-stage-control danger" title="Disconnect"><span class="material-icons-round">call_end</span></button>
    </div>
  </div>`;
  document.getElementById('stage-mute-btn')?.addEventListener('click', toggleVoiceMute);
  document.getElementById('stage-deafen-btn')?.addEventListener('click', toggleVoiceDeafen);
  document.getElementById('stage-chat-btn')?.addEventListener('click', () => setVoiceStageVisible(false));
  document.getElementById('stage-leave-btn')?.addEventListener('click', leaveVoice);
}

function stopLocalSpeakingDetection() {
  if (S.voice.speakingFrame) cancelAnimationFrame(S.voice.speakingFrame);
  S.voice.speakingFrame = null;
  S.voice.localSpeaking = false;
  S.voice.analyser = null;
  S.voice.audioContext?.close?.().catch(() => {});
  S.voice.audioContext = null;
}

function startLocalSpeakingDetection(stream) {
  stopLocalSpeakingDetection();
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass || !stream) return;
  try {
    const context = new AudioContextClass();
    const analyser = context.createAnalyser();
    analyser.fftSize = 512;
    analyser.smoothingTimeConstant = .72;
    context.createMediaStreamSource(stream).connect(analyser);
    const samples = new Uint8Array(analyser.fftSize);
    S.voice.audioContext = context;
    S.voice.analyser = analyser;
    let lastSpeaking = false;
    let lastVoiceAt = 0;
    const releaseDelayMs = 850;
    const detect = () => {
      if (!S.voice.localStream || S.voice.analyser !== analyser) return;
      analyser.getByteTimeDomainData(samples);
      let energy = 0;
      for (const sample of samples) { const value = (sample - 128) / 128; energy += value * value; }
      const now = performance.now();
      const voiceDetected = Math.sqrt(energy / samples.length) > .03;
      if (voiceDetected) lastVoiceAt = now;
      const speaking = !S.voice.muted && (voiceDetected || (lastSpeaking && now - lastVoiceAt < releaseDelayMs));
      if (speaking !== lastSpeaking) {
        lastSpeaking = speaking;
        S.voice.localSpeaking = speaking;
        S.socket?.emit('voice_speaking', { roomName:S.voice.roomName, isSpeaking:speaking });
        renderVoiceBar();
        renderCurrentMemberList();
      }
      S.voice.speakingFrame = requestAnimationFrame(detect);
    };
    detect();
  } catch {}
}

async function leaveVoice() {
  const roomName = S.voice.roomName;
  if (!roomName) return;
  for (const [, peer] of S.voice.peers) { peer.pc?.close(); peer.audioEl?.remove(); }
  S.voice.peers.clear();
  S.voice.localStream?.getTracks().forEach(t => t.stop());
  S.voice.localStream = null;
  stopLocalSpeakingDetection();
  try { await api('/api/voice/end-call', { method: 'POST', body: { roomName } }); } catch {}
  if (S.socket) S.socket.emit('voice_leave', { roomName });
  S.voice.roomName = null; S.voice.roomType = null; S.voice.muted = false; S.voice.deafened = false;
  setVoiceStageVisible(false);
  renderVoiceBar();
  renderChannels();
  toast('Left voice channel', 'info');
}
window.leaveVoice = leaveVoice;

function createVoicePc(peerId) {
  const pc = new RTCPeerConnection({
    iceCandidatePoolSize: 10,
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:global.stun.twilio.com:3478' }
    ]
  });
  S.socket.on('group_deleted', (data = {}) => {
    if (String(data.room || '') === String(S.room || '')) {
      S.room = null;
      S.roomMeta = null;
      const list = document.getElementById('messages-list');
      if (list) list.innerHTML = emptyPlaceholder();
      const name = document.getElementById('channel-header-name');
      if (name) name.textContent = 'Select a channel';
    }
    if (S.section === 'groups') void renderGroups();
  });
  if (S.voice.localStream) S.voice.localStream.getTracks().forEach(t => pc.addTrack(t, S.voice.localStream));
  const audioEl = document.createElement('audio');
  audioEl.autoplay = true;
  audioEl.volume = Math.max(0, Math.min(1, Number(localStorage.getItem('voiceOutputVolume') || 100) / 100));
  audioEl.muted = S.voice.deafened;
  const outputDevice = localStorage.getItem('voiceOutputDevice') || '';
  if (outputDevice && typeof audioEl.setSinkId === 'function') audioEl.setSinkId(outputDevice).catch(() => {});
  document.body.appendChild(audioEl);
  pc.ontrack = e => {
    audioEl.srcObject = e.streams[0];
    audioEl.play().catch(() => {});
  };
  pc.onicecandidate = e => {
    if (e.candidate && S.socket)
      S.socket.emit('voice_ice_candidate', { targetPeerId: peerId, roomName: S.voice.roomName, candidate: e.candidate });
  };
  pc.onconnectionstatechange = () => {
    if (['failed','disconnected','closed'].includes(pc.connectionState)) handleVoicePeerLeft({ peerId });
  };
  return { pc, audioEl, pendingCandidates: [] };
}

async function flushVoiceCandidates(peer) {
  if (!peer?.pc?.remoteDescription || !peer.pendingCandidates?.length) return;
  const candidates = peer.pendingCandidates.splice(0);
  for (const candidate of candidates) {
    try { await peer.pc.addIceCandidate(new RTCIceCandidate(candidate)); } catch {}
  }
}

async function handleVoicePeers({ roomName, peers }) {
  if (roomName !== S.voice.roomName) return;
  for (const { peerId, participantName, avatar } of (peers || [])) {
    const connection = createVoicePc(peerId);
    S.voice.peers.set(peerId, { name: participantName, avatar:avatar || null, ...connection, speaking: false });
    const offer = await connection.pc.createOffer();
    await connection.pc.setLocalDescription(offer);
    if (S.socket) S.socket.emit('voice_offer', { targetPeerId: peerId, roomName, sdp: offer });
  }
  renderVoiceBar();
}

async function handleVoicePeerJoined({ roomName, peerId, participantName, avatar }) {
  if (roomName !== S.voice.roomName) return;
  if (!S.voice.peers.has(peerId)) {
    const connection = createVoicePc(peerId);
    S.voice.peers.set(peerId, { name: participantName, avatar:avatar || null, ...connection, speaking: false });
  }
  renderVoiceBar();
}

async function handleVoiceOffer({ roomName, fromPeerId, participantName, avatar, sdp }) {
  if (roomName !== S.voice.roomName) return;
  let peer = S.voice.peers.get(fromPeerId);
  if (!peer) {
    const connection = createVoicePc(fromPeerId);
    peer = { name: participantName, avatar:avatar || null, ...connection, speaking: false };
    S.voice.peers.set(fromPeerId, peer);
  }
  await peer.pc.setRemoteDescription(new RTCSessionDescription(sdp));
  await flushVoiceCandidates(peer);
  const answer = await peer.pc.createAnswer();
  await peer.pc.setLocalDescription(answer);
  if (S.socket) S.socket.emit('voice_answer', { targetPeerId: fromPeerId, roomName, sdp: answer });
  renderVoiceBar();
}

async function handleVoiceAnswer({ fromPeerId, sdp }) {
  const peer = S.voice.peers.get(fromPeerId);
  if (peer) {
    await peer.pc.setRemoteDescription(new RTCSessionDescription(sdp));
    await flushVoiceCandidates(peer);
  }
}

async function handleVoiceIceCandidate({ fromPeerId, candidate }) {
  const peer = S.voice.peers.get(fromPeerId);
  if (!peer || !candidate) return;
  if (!peer.pc.remoteDescription) peer.pendingCandidates.push(candidate);
  else try { await peer.pc.addIceCandidate(new RTCIceCandidate(candidate)); } catch {}
}

function handleVoicePeerLeft({ peerId }) {
  const peer = S.voice.peers.get(peerId);
  if (!peer) return;
  peer.pc?.close(); peer.audioEl?.remove();
  S.voice.peers.delete(peerId);
  renderVoiceBar();
}

function renderVoiceBar() {
  const bar = document.getElementById('voice-bar');
  if (!bar) return;
  if (!S.voice.roomName) { bar.style.display = 'none'; return; }
  bar.style.display = 'block';
  const nameEl = document.getElementById('voice-room-name');
  if (nameEl) nameEl.textContent = S.voice.roomName.replace('voice:', '');
  const peersEl = document.getElementById('voice-participants');
  if (peersEl) {
    const me = `<div class="voice-peer"><span class="vp-dot"></span><span>${esc(myUsername())} (you)</span></div>`;
    const others = [...S.voice.peers.values()].map(p =>
      `<div class="voice-peer${p.speaking ? ' speaking' : ''}"><span class="vp-dot"></span><span>${esc(p.name)}</span></div>`
    ).join('');
    peersEl.innerHTML = me + others;
  }
  const muteBtn = document.getElementById('voice-mute-btn');
  if (muteBtn) {
    muteBtn.style.color = S.voice.muted ? '#f87171' : '#a1a1aa';
    muteBtn.innerHTML = `<span class="material-icons-round" style="font-size:14px">${S.voice.muted ? 'mic_off' : 'mic'}</span><span>${S.voice.muted ? 'Unmute' : 'Mute'}</span>`;
  }
  const deafenBtn = document.getElementById('voice-deafen-btn');
  if (deafenBtn) {
    deafenBtn.style.color = S.voice.deafened ? '#f87171' : '#a1a1aa';
    deafenBtn.innerHTML = `<span class="material-icons-round" style="font-size:14px">${S.voice.deafened ? 'headset_off' : 'headphones'}</span><span>${S.voice.deafened ? 'Undeafen' : 'Deafen'}</span>`;
  }
  renderVoiceStage();
}

function renderVoiceChannelPresence() {
  const container = document.getElementById('voice-general-presence');
  if (!container) return;
  const roster = S.voice.roster || [];
  if (!roster.length) { container.innerHTML = ''; return; }
  const visibleCount = Math.min(4, roster.length);
  const visible = Array.from({ length: visibleCount }, (_, index) => roster[(S.voice.rotation + index) % roster.length]);
  const avatars = visible.map((person, index) => {
    const name = person.username || 'User';
    const color = avatarColor(name);
    const fallback = esc(avatarInitials(name));
    const content = person.avatar
      ? `<img src="${esc(person.avatar)}" alt="" style="width:100%;height:100%;object-fit:cover" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><span style="display:none;position:absolute;inset:0;align-items:center;justify-content:center">${fallback}</span>`
      : fallback;
    return `<span title="${esc(name)}" style="position:relative;width:23px;height:23px;margin-left:${index ? '-5px' : '0'};border:2px solid #13131a;border-radius:8px;background:${color};display:flex;align-items:center;justify-content:center;overflow:hidden;color:#fff;font-size:8px;font-weight:700">${content}</span>`;
  }).join('');
  const more = Math.max(0, roster.length - visibleCount);
  container.innerHTML = `<div style="display:flex;align-items:center;padding-left:1px">${avatars}</div>${more ? `<div style="font-size:9px;color:#71717a;margin-top:3px">+${more} more in voice</div>` : ''}`;
}

async function fetchVoiceChannelPresence() {
  if (!S.token || document.hidden || S.voice.presenceInFlight) return;
  S.voice.presenceInFlight = true;
  try {
    const data = await api('/api/voice/participants/voice%3Ageneral');
    S.voice.roster = Array.isArray(data?.participants) ? data.participants : [];
    if (S.voice.rotation >= Math.max(1, S.voice.roster.length)) S.voice.rotation = 0;
    renderVoiceChannelPresence();
  } catch {}
}

function toggleVoiceMute() {
  if (!S.voice.localStream) return;
  S.voice.muted = !S.voice.muted;
  S.voice.localStream.getAudioTracks().forEach(track => { track.enabled = !S.voice.muted; });
  if (S.voice.muted && S.voice.localSpeaking) {
    S.voice.localSpeaking = false;
    S.socket?.emit('voice_speaking', { roomName:S.voice.roomName, isSpeaking:false });
  }
  renderVoiceBar();
}

function toggleVoiceDeafen() {
  if (!S.voice.roomName) return;
  S.voice.deafened = !S.voice.deafened;
  for (const peer of S.voice.peers.values()) peer.audioEl.muted = S.voice.deafened;
  renderVoiceBar();
}

// ─── Polling Fallback ─────────────────────────────────────────────────────────
function startPolling(intervalMs = S.socket?.connected ? 30_000 : 2_500) {
  const nextInterval = Math.max(900, Number(intervalMs) || 2_500);
  if (S.pollTimer && S.pollIntervalMs === nextInterval) return;
  stopPolling();
  S.pollIntervalMs = nextInterval;
  S.pollTimer = setInterval(pollMessages, nextInterval);
}
function stopPolling() {
  clearInterval(S.pollTimer); S.pollTimer = null; S.pollIntervalMs = 0; S.pollFailures = 0; S.pollInFlight = false;
}

async function pollMessages() {
  if (!S.room || S.pollInFlight) return;
  const roomAtStart = String(S.room);
  const lastCanonical = [...S.lastMsgs].reverse().find(message => !message.__pending && getMessageId(message));
  const lastId = getMessageId(lastCanonical);
  S.pollInFlight = true;
  try {
    const query = new URLSearchParams({ limit: '50', noCache: '1' });
    if (lastId) query.set('afterId', String(lastId));
    const data = await chatApi(`/api/tlk/rooms/${encodeURIComponent(roomAtStart)}/messages?${query}`, { cache: 'no-store' });
    if (String(S.room) !== roomAtStart) return;
    const msgs = Array.isArray(data) ? data : (data?.messages || []);
    if (!msgs.length) return;
    const beforeKeys = new Set(S.lastMsgs.flatMap(messageDedupKeys));
    const normalized = msgs.map(withLocalMessageIdentity);
    const hasFresh = normalized.some(message => !messageDedupKeys(message).some(key => beforeKeys.has(key)));
    S.lastMsgs = mergeMessageBatch(S.lastMsgs, normalized);
    renderMessages(S.lastMsgs, { forceScroll: false });
    if (hasFresh) updateJumpToLatest();
    S.pollFailures = 0;
  } catch {
    S.pollFailures++;
    if (S.pollFailures > 8) startPolling(5_000);
  } finally {
    S.pollInFlight = false;
  }
}

function startMeta() {
  stopMeta();
  S.socket?.emit('presence_ping', presencePayload());
  fetchModeration(); fetchAlerts(); fetchPresence();
  const metaIntervalMs = 45_000 + Math.floor(Math.random() * 15_000);
  S.metaTimer = setInterval(() => {
    S.socket?.emit('presence_ping', presencePayload());
    fetchModeration(); fetchAlerts(); fetchPresence();
  }, metaIntervalMs);
}
function stopMeta() { clearInterval(S.metaTimer); S.metaTimer = null; }

function presencePayload() {
  const effectiveStatus = S.presenceStatus === 'online' && Date.now() - S.presenceLastActivity > 5 * 60_000
    ? 'idle'
    : S.presenceStatus;
  return {
    roomId: S.room,
    status: effectiveStatus,
    customStatus: S.customStatus,
    avatar: S.user?.avatar || S.user?.avatar_url || null,
    equippedEffect: S.equippedEffect || 'none',
    equippedAvatarEffect: S.equippedAvatarEffect || 'none',
    equippedTag: S.equippedTag || 'none',
    equippedBanner: S.equippedBanner || 'none',
    equippedProfileEffect: S.equippedProfileEffect || 'none'
  };
}

// ─── Slowmode ─────────────────────────────────────────────────────────────────
async function fetchModeration() {
  if (!S.room) return;
  try {
    const type = S.roomMeta?.type;
    const data = await api(`/api/network/moderation?room=${encodeURIComponent(S.room)}&type=${encodeURIComponent(type || 'channel')}`);
    const ms = Number(data?.slowmodeMs || 0);
    S.slowmodeMs = ms;
    S.lockdownActive = !!data?.lockdownActive;
    renderSlowmodeConfig();
  } catch {}
}

function renderSlowmodeConfig() {
  const bar = document.getElementById('slowmode-bar');
  const txt = document.getElementById('slowmode-text');
  if (!bar || !txt) return;
  const remaining = S.slowmodeUntil > Date.now() ? Math.ceil((S.slowmodeUntil - Date.now()) / 1000) : 0;
  const lockdownBlocked = S.lockdownActive && S.roomMeta?.type === 'channel' && !isStaff();
  if (lockdownBlocked) {
    bar.style.display = 'flex';
    bar.style.background = 'rgba(248,113,113,.09)';
    bar.style.color = '#f87171';
    txt.textContent = 'Global lockdown: only staff can send in public channels';
  } else if (remaining > 0) {
    bar.style.display = 'flex';
    bar.style.background = '';
    bar.style.color = '';
    txt.textContent = `Slowmode: wait ${remaining}s`;
  } else if (S.slowmodeMs > 0 && !isStaff()) {
    bar.style.display = 'flex';
    bar.style.background = '';
    bar.style.color = '';
    txt.textContent = `Slowmode: ${Math.round(S.slowmodeMs / 1000)}s between messages`;
  } else {
    bar.style.display = 'none';
  }
  syncComposerAccess();
}

function syncComposerAccess() {
  const input = document.getElementById('message-input');
  const sendBtn = document.getElementById('send-btn');
  const lockdownBlocked = S.lockdownActive && S.roomMeta?.type === 'channel' && !isStaff();
  const cooldownBlocked = S.slowmodeUntil > Date.now() && !isStaff();
  const blocked = lockdownBlocked || cooldownBlocked;
  if (input) {
    input.disabled = blocked;
    input.placeholder = lockdownBlocked
      ? 'Public chat is locked by staff'
      : (input.dataset.roomPlaceholder || 'Message');
  }
  if (sendBtn) sendBtn.disabled = blocked;
}

function startSlowmodeCooldown() {
  if (!S.slowmodeMs || isStaff()) return;
  S.slowmodeUntil = Date.now() + S.slowmodeMs;
  syncComposerAccess();
  clearInterval(S.slowmodeTimer);
  S.slowmodeTimer = setInterval(() => {
    const remaining = Math.ceil((S.slowmodeUntil - Date.now()) / 1000);
    renderSlowmodeConfig();
    if (remaining <= 0) {
      clearInterval(S.slowmodeTimer);
      syncComposerAccess();
    }
  }, 250);
}

// ─── Room Background ──────────────────────────────────────────────────────────
function applyRoomBg(url) {
  const el = document.getElementById('room-bg');
  if (!el) return;
  if (url) { el.style.backgroundImage = `url(${JSON.stringify(url)})`; el.style.display = 'block'; }
  else { el.style.backgroundImage = ''; el.style.display = 'none'; }
}

// ─── Typing ───────────────────────────────────────────────────────────────────
function handleTyping(username, isTyping) {
  if (isTyping) {
    if (S.typingUsers.has(username)) clearTimeout(S.typingUsers.get(username));
    S.typingUsers.set(username, setTimeout(() => { S.typingUsers.delete(username); renderTypingBar(); }, 4000));
  } else {
    clearTimeout(S.typingUsers.get(username)); S.typingUsers.delete(username);
  }
  renderTypingBar();
}

function renderTypingBar() {
  const bar = document.getElementById('typing-bar');
  if (!bar) return;
  if (!getChatBool('chatTypingIndicators', true)) { bar.innerHTML = ''; return; }
  const names = [...S.typingUsers.keys()];
  if (!names.length) { bar.innerHTML = ''; return; }
  const me = myUsername().toLowerCase();
  const displayNames = names.map(name => String(name).toLowerCase() === me ? 'You' : name);
  const label = displayNames.length === 1 ? `${esc(displayNames[0])} ${displayNames[0] === 'You' ? 'are' : 'is'} typing`
    : displayNames.length === 2 ? `${esc(displayNames[0])} and ${esc(displayNames[1])} are typing`
    : `${names.length} people are typing`;
  bar.innerHTML = `<span class="dot"></span><span class="dot"></span><span class="dot"></span><span>${label}…</span>`;
}

let typingEmitted = false;
let typingStopTimer = null;
function stopTypingNow(roomId = S.room) {
  clearTimeout(typingStopTimer);
  typingStopTimer = null;
  const name = myUsername();
  if (name) handleTyping(name, false);
  if (typingEmitted && S.socket && roomId) {
    S.socket.emit('typing', { roomId, isTyping: false, clientId: getClientId() });
  }
  typingEmitted = false;
}

function onTypingInput() {
  if (!S.room) return;
  const input = document.getElementById('message-input');
  const hasText = !!input?.value.trim();
  clearTimeout(typingStopTimer);
  const name = myUsername();
  if (name) handleTyping(name, hasText);
  if (hasText && !typingEmitted && S.socket) {
    typingEmitted = true;
    S.socket?.emit('typing', { roomId: S.room, isTyping: true, clientId: getClientId() });
  }
  if (!hasText) stopTypingNow();
  else typingStopTimer = setTimeout(() => stopTypingNow(), 1800);
}

// ─── Message Rendering ────────────────────────────────────────────────────────
const BUBBLE_EFFECT = Object.freeze({
  glass:'effect-glass',
  neon:'effect-neon-glow',
  neon_glow:'effect-neon-glow',
  gradient:'effect-gradient',
  dark_smoke:'effect-dark-smoke',
  electric:'effect-electric',
  fire:'effect-fire',
  ice:'effect-ice',
  matrix_msg:'effect-matrix',
  galaxy:'effect-galaxy',
  rainbow_border:'effect-rainbow-border',
  aurora:'effect-aurora',
  gold:'effect-gold',
  cyberpunk:'effect-cyberpunk',
  topographic:'effect-topographic',
  toxic_slime:'effect-toxic-slime',
  bubble:'effect-bubble',
  ink_splash:'effect-ink-splash',
  holographic:'effect-holographic',
  wood:'effect-wood',
  carbon_fiber:'effect-carbon-fiber',
  hearts:'effect-hearts',
  bubblegum:'effect-bubble',
  plasma:'effect-gradient',
  hologram:'effect-holographic',
  void:'effect-galaxy'
});

function bubbleCls(effect) { return BUBBLE_EFFECT[String(effect || '').toLowerCase()] || ''; }

const MESSAGE_MATERIAL = Object.freeze({
  glass:'frosted-glass',
  neon:'neon-trim',
  neon_glow:'neon-trim',
  gradient:'color-drift',
  dark_smoke:'soft-smoke',
  electric:'blue-current',
  fire:'ember-edge',
  ice:'winter-glass',
  matrix_msg:'green-code',
  galaxy:'night-sky',
  rainbow_border:'spectrum',
  aurora:'northern-lights',
  gold:'gilded',
  cyberpunk:'city-lights',
  topographic:'contour',
  toxic_slime:'lime-drip',
  bubble:'daydream',
  ink_splash:'ink-wash',
  holographic:'prism',
  wood:'walnut',
  carbon_fiber:'carbon-weave',
  hearts:'rose-hearts',
  bubblegum:'daydream',
  plasma:'color-drift',
  hologram:'prism',
  void:'night-sky'
});

function messageMaterialSlug(effect) {
  return MESSAGE_MATERIAL[String(effect || '').trim().toLowerCase()] || '';
}

const MESSAGE_MATERIAL_ACCENT = new Set([
  'ember-edge', 'night-sky', 'city-lights', 'lime-drip', 'rose-hearts'
]);

function messageMaterialLayer(effect, options = {}) {
  const slug = messageMaterialSlug(effect);
  if (!slug) return '';
  const loading = options.eager ? 'eager' : 'lazy';
  const base = `/kchat/assets/message-materials/${esc(slug)}`;
  const accent = MESSAGE_MATERIAL_ACCENT.has(slug)
    ? `<img class="message-material-accent" src="${base}/accent.webp" alt="" loading="${loading}" decoding="async">`
    : '';
  return `<span class="message-material" aria-hidden="true"><img class="message-material-image" src="${base}/material.webp" alt="" loading="${loading}" decoding="async"><img class="message-material-detail" src="${base}/detail.webp" alt="" loading="${loading}" decoding="async">${accent}</span>`;
}

function messageMaterialContent(effect, content, options = {}) {
  const layer = messageMaterialLayer(effect, options);
  return layer ? `${layer}<span class="message-content">${content}</span>` : content;
}

function userTagBadge(msg) {
  const id = String(msg?.equippedTag || '').trim().toLowerCase();
  const tag = EFFECT_MAP.get(id);
  return tagBadgeHtml(tag);
}

function roleBadge(msg) {
  const role = String(msg?.role || '').toLowerCase();
  const badges = [];
  if (msg?.is_owner || role === 'owner')  badges.push(`<span class="role-badge role-owner">Owner</span>`);
  else if (role === 'admin')              badges.push(`<span class="role-badge role-admin">Admin</span>`);
  else if (role === 'mod')               badges.push(`<span class="role-badge role-mod">Mod</span>`);
  else if (role === 'seller')            badges.push(`<span class="role-badge role-seller">Seller</span>`);
  if (msg?.is_premium)                   badges.push(`<span class="role-badge role-premium">Premium</span>`);
  if (msg?.is_booster)                   badges.push(`<span class="role-badge role-booster">Booster</span>`);
  return badges.join('');
}

function avatarEffectClass(effectId = '') {
  const id = String(effectId || '').trim().toLowerCase();
  return /^avatar_[a-z0-9_]+$/.test(id) && EFFECT_MAP.get(id)?.scope === 'avatar'
    ? ` avatar-fx avatar-fx-${id.slice(7).replace(/_/g, '-')}`
    : '';
}

function validAvatarEffectId(effectId = '') {
  const id = String(effectId || '').trim().toLowerCase();
  return avatarEffectClass(id) ? id : 'none';
}

function shouldShowAvatarEffect(msg = {}) {
  return validAvatarEffectId(msg?.equippedAvatarEffect) !== 'none';
}

function avatarEl(name, size = 36, avatarUrl = null, effectId = 'none') {
  const color = avatarColor(name);
  const base = `width:${size}px;height:${size}px;border-radius:${Math.round(size * 0.28)}px;flex-shrink:0;overflow:hidden;display:flex;align-items:center;justify-content:center`;
  const fxClass = avatarEffectClass(effectId);
  const avatarInner = avatarUrl
    ? `<img src="${esc(avatarUrl)}" style="width:100%;height:100%;object-fit:cover"
        onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
      <span style="display:none;width:100%;height:100%;align-items:center;justify-content:center;font-size:${size<30?9:11}px;font-weight:700;color:#fff">${esc(avatarInitials(name))}</span>`
    : esc(avatarInitials(name));
  if (avatarUrl) {
    return `<span class="avatar-fx-wrap${fxClass}" style="--avatar-size:${size}px"><span class="msg-avatar" style="${base};background:${color}">${avatarInner}</span></span>`;
  }
  return `<span class="avatar-fx-wrap${fxClass}" style="--avatar-size:${size}px"><span class="msg-avatar" style="${base};background:${color};font-size:${size<30?9:11}px;font-weight:700;color:#fff">${avatarInner}</span></span>`;
}

function renderBody(raw) {
  const imgUrls = [];
  const quoteTexts = [];
  const linkTags = [];
  let text = raw;

  // 1. Extract [img:...] — TLK may have converted the URL to <a href="URL">...</a>
  text = text.replace(/\[img:(?:<a[^>]*href="([^"]+)"[^>]*>[\s\S]*?<\/a>|((?:https?:\/\/|\/api\/upload\/local\/)[^\]]+))\]/g, (_, hrefUrl, rawUrl) => {
    imgUrls.push(hrefUrl || rawUrl);
    return `\x01IMG${imgUrls.length - 1}\x01`;
  });

  // 2. Extract <blockquote> — TLK converts "> " prefix lines to blockquote
  //    The blockquote may contain "reply\nnew message" — split at first \n
  text = text.replace(/<blockquote>([\s\S]*?)<\/blockquote>/g, (_, content) => {
    const nl = content.indexOf('\n');
    if (nl === -1) {
      quoteTexts.push(content);
      return `\x01BQ${quoteTexts.length - 1}\x01`;
    }
    const quotePart = content.slice(0, nl);
    const after = content.slice(nl + 1);
    quoteTexts.push(quotePart);
    return `\x01BQ${quoteTexts.length - 1}\x01\n${after}`;
  });

  // 2a. Extract server-sent <a> tags so esc() doesn't mangle them
  text = text.replace(/<a\s[^>]*href="([^"]*)"[^>]*>[\s\S]*?<\/a>/g, (match) => {
    linkTags.push(match);
    return `\x01LNK${linkTags.length - 1}\x01`;
  });

  // 3. Escape remaining HTML
  text = esc(text);

  // 4. Restore blockquotes as styled divs (strip any HTML TLK left inside the quote)
  quoteTexts.forEach((qt, i) => {
    const clean = esc(qt.replace(/<[^>]*>/g, '').trim());
    text = text.replace(`\x01BQ${i}\x01`, `<div class="msg-quote">${clean}</div>`);
  });

  // 5. Restore images — proxy through our server
  imgUrls.forEach((url, i) => {
    const proxied = proxiedImageSrc(url);
    text = text.replace(
      `\x01IMG${i}\x01`,
      `<img src="${proxied}" alt="img" loading="lazy" style="max-width:320px;max-height:240px;border-radius:8px;display:block;margin-top:4px" onerror="this.style.display='none'">`
    );
  });

  // 6. Linkify plain text URLs into clickable blue links
  //    (server <a> tags are still placeholders, so no double-linkifying)
  text = text.replace(/(^|[\s(>])(https?:\/\/[^\s<>"']+)/g, (_, before, url) => {
    const clean = url.replace(/[,;.!?:)]+$/, '');
    if (clean !== url) {
      return `${before}<a href="${clean}" target="_blank" rel="noopener noreferrer" style="color:#38bdf8;text-decoration:underline">${clean}</a>${url.slice(clean.length)}`;
    }
    return `${before}<a href="${url}" target="_blank" rel="noopener noreferrer" style="color:#38bdf8;text-decoration:underline">${url}</a>`;
  });

  // 6. @mentions
  text = text.replace(/@(\w+)/g, (_, n) => knownValidUsers.has(n.toLowerCase()) ? `<span class="msg-mention">@${esc(n)}</span>` : `@${esc(n)}`);

  // 8. Restore server-sent <a> tags as clickable blue links
  linkTags.forEach((tag, i) => {
    const styled = tag.includes('style=')
      ? tag
      : tag.replace(/^<a\s/, '<a style="color:#38bdf8;text-decoration:underline" ');
    text = text.replace(`\x01LNK${i}\x01`, styled);
  });

  // 7. Newlines
  text = text.replace(/\n/g, '<br>');
  return text;
}

function extractImageUrlFromText(value = '') {
  const text = String(value || '');
  const match = text.match(/\[img:(?:<a[^>]*href="([^"]+)"[^>]*>[\s\S]*?<\/a>|((?:https?:\/\/|\/api\/upload\/local\/)[^\]]+))\]/i);
  return match ? (match[1] || match[2] || '').trim() : '';
}

function proxiedImageSrc(url = '') {
  return `/api/upload/proxy?url=${encodeURIComponent(url)}`;
}

function stripLeadingReplyQuote(value = '') {
  let text = String(value || '').trim();
  const original = text;
  let removed = false;

  while (/^<blockquote>[\s\S]*?<\/blockquote>/i.test(text)) {
    const next = text.replace(/^<blockquote>([\s\S]*?)<\/blockquote>\s*/i, (_match, content) => {
      removed = true;
      const inner = String(content || '').replace(/<[^>]*>/g, '').trim();
      const lines = inner.split(/\r?\n/);
      if (/^Replying to\b/i.test(String(lines[0] || '').trim())) {
        return lines.slice(1).join('\n').trim() + '\n';
      }
      return '';
    }).trim();
    if (next === text) break;
    text = next;
    if (text) break;
  }

  const lines = text.split(/\r?\n/);
  while (lines.length && /^>\s*Replying to\b/i.test(lines[0].trim())) {
    removed = true;
    lines.shift();
    while (lines.length && !String(lines[0] || '').trim()) lines.shift();
  }
  const stripped = lines.join('\n').trim();
  return stripped || (removed ? '' : original);
}

function replyPreviewText(msg = {}) {
  const body = stripLeadingReplyQuote(msg.body || msg.content || '');
  return extractImageUrlFromText(body) ? '[Image]' : body.replace(/\s+/g, ' ').slice(0, 80);
}

function replyQuotePayload(msg = {}) {
  const body = stripLeadingReplyQuote(msg.body || msg.content || '');
  const imageUrl = extractImageUrlFromText(body);
  return imageUrl ? `[img:${imageUrl}]` : body.replace(/\s+/g, ' ').slice(0, 80);
}

function buildReplySnapshot(msg = {}) {
  if (msg.messageId && msg.author && msg.preview !== undefined) {
    return {
      messageId: String(msg.messageId),
      author: String(msg.author).slice(0, 64),
      preview: String(msg.preview || 'Message').replace(/\s+/g, ' ').slice(0, 140),
      imageUrl: String(msg.imageUrl || '')
    };
  }
  const body = stripLeadingReplyQuote(msg.body || msg.content || '');
  const imageUrl = extractImageUrlFromText(body);
  return {
    messageId: String(getMessageId(msg) || ''),
    author: getUsername(msg),
    preview: imageUrl ? 'Image' : (body.replace(/\s+/g, ' ').slice(0, 140) || 'Message'),
    imageUrl: imageUrl || ''
  };
}

function renderReplyQuoteHtml(value = '') {
  const reply = value && typeof value === 'object' ? buildReplySnapshot(value) : null;
  const cleanText = reply ? reply.preview : stripLeadingReplyQuote(value);
  const imageUrl = reply?.imageUrl || extractImageUrlFromText(cleanText);
  const messageId = esc(reply?.messageId || '');
  const jumpAttrs = messageId ? `data-jump-message-id="${messageId}" title="Jump to replied message"` : '';
  return `<button type="button" class="msg-quote${imageUrl ? ' msg-quote-image' : ''}" ${jumpAttrs}>
    ${imageUrl ? `<img src="${proxiedImageSrc(imageUrl)}" alt="Reply image" loading="lazy" onerror="this.style.display='none'">` : ''}
    <span>${reply?.author ? `<b>${esc(reply.author)}</b>` : ''}${esc((cleanText || 'Message').slice(0, 100))}</span>
  </button>`;
}

function receiptDisplayNames(msg, kind = 'seen') {
  const receipts = msg?.receipts || {};
  const source = kind === 'delivered' ? receipts.deliveredBy : receipts.seenBy;
  if (!source || typeof source !== 'object') return [];
  const sender = String(getUsername(msg) || '').trim().toLowerCase();
  const me = myUsername().toLowerCase();
  return Object.keys(source)
    .map((name) => String(name || '').trim())
    .filter(Boolean)
    .filter((name) => name.toLowerCase() !== sender)
    .map((name) => name.toLowerCase() === me ? 'You' : name);
}

function compactNameList(names = []) {
  const clean = [...new Set(names.filter(Boolean))];
  if (clean.length <= 3) return clean.join(', ');
  return `${clean.slice(0, 3).join(', ')} +${clean.length - 3} more`;
}

function messageReceiptHtml(msg) {
  if (!msg || msg.system) return '';
  const roomType = S.roomMeta?.type;
  if (roomType !== 'dm' && roomType !== 'group') return '';

  const seenNames = receiptDisplayNames(msg, 'seen');
  if (roomType === 'dm') {
    if (!isMine(msg)) return '';
    return `<div class="msg-receipt">${seenNames.length ? 'Read' : 'Delivered'}</div>`;
  }

  if (!seenNames.length) return '';
  return `<div class="msg-receipt">Seen by ${esc(compactNameList(seenNames))}</div>`;
}

function msgActionsHtml(msg) {
  const id = getMessageId(msg);
  const mine = isMine(msg);
  const canDel = mine || isStaff();
  const messageId = esc(id);
  let btns = `<button type="button" data-message-action="reply" data-message-id="${messageId}" title="Reply"><span class="material-icons-round">reply</span></button>`;
  btns += `<button type="button" data-message-action="react" data-message-id="${messageId}" title="Add reaction"><span class="material-icons-round">add_reaction</span></button>`;
  btns += `<button type="button" data-message-action="bookmark" data-message-id="${messageId}" title="${msg.bookmarked ? 'Remove bookmark' : 'Bookmark'}"><span class="material-icons-round">${msg.bookmarked ? 'bookmark' : 'bookmark_border'}</span></button>`;
  if (mine) btns += `<button type="button" data-message-action="edit" data-message-id="${messageId}" title="Edit"><span class="material-icons-round">edit</span></button>`;
  if (isStaff()) btns += `<button type="button" data-message-action="pin" data-message-id="${messageId}" title="${msg.pinned ? 'Unpin' : 'Pin'}"><span class="material-icons-round">${msg.pinned ? 'push_pin' : 'push_pin'}</span></button>`;
  if (canDel) btns += `<button type="button" data-message-action="delete" data-message-id="${messageId}" title="Delete"><span class="material-icons-round">delete</span></button>`;
  if (!mine && isStaff()) btns += `<button type="button" data-message-action="moderate" data-message-id="${messageId}" title="Moderate"><span class="material-icons-round">shield</span></button>`;
  if (!mine && !isStaff()) btns += `<button type="button" data-message-action="report" data-message-id="${messageId}" title="Report"><span class="material-icons-round">flag</span></button>`;
  return `<div class="msg-actions">${btns}</div>`;
}

function messageReactionsHtml(msg = {}) {
  const reactions = Array.isArray(msg.reactions) ? msg.reactions : [];
  if (!reactions.length) return '';
  return `<div class="msg-reactions">${reactions.map((reaction) => {
    const reacted = reaction.reacted || (reaction.users || []).some(name => String(name).toLowerCase() === myUsername().toLowerCase());
    const names = (reaction.users || []).join(', ');
    return `<button type="button" class="msg-reaction${reacted ? ' reacted' : ''}" data-reaction-emoji="${esc(reaction.emoji)}" data-message-id="${esc(getMessageId(msg))}" title="${esc(names)}"><span>${esc(reaction.emoji)}</span><b>${Number(reaction.count || 0)}</b></button>`;
  }).join('')}</div>`;
}

function messageAttachmentsHtml(msg = {}, rawBody = '') {
  const attachments = (Array.isArray(msg.attachments) ? msg.attachments : []).filter(item =>
    item?.url && !String(rawBody || '').includes(String(item.url))
  );
  if (!attachments.length) return '';
  return `<div class="msg-attachment-grid">${attachments.map(item =>
    `<a href="${esc(item.url)}" target="_blank" rel="noopener noreferrer"><img src="${proxiedImageSrc(item.url)}" alt="${esc(item.name || 'Image attachment')}" loading="lazy"></a>`
  ).join('')}</div>`;
}

function buildMsgHtml(msg, isFirst) {
  const name = getUsername(msg);
  const mentionName = String(msg?.username || msg?.name || name).trim();
  const time = formatTime(messageTimeValue(msg));
  const rawBody = msg.body || msg.content || '';
  const body = renderBody(rawBody) + messageAttachmentsHtml(msg, rawBody);
  const effect = (msg.equippedEffect || '').toLowerCase();
  const bc = bubbleCls(effect);
  const displayMsg = withLocalMessageIdentity(msg);
  const avatarEffect = shouldShowAvatarEffect(displayMsg) ? validAvatarEffectId(displayMsg.equippedAvatarEffect) : 'none';
  const avatarUrl = displayMsg.avatar || null;
  const pending = !!msg.__pending;
  const actions = getMessageId(msg) && !pending ? msgActionsHtml(msg) : '';
  const delivery = pending ? '<span class="msg-send-state">Sending</span>' : (msg.editedAt ? '<span class="msg-edited">(edited)</span>' : '');
  const receiptHtml = messageReceiptHtml(msg);
  const reactionsHtml = messageReactionsHtml(msg);
  const pinHtml = msg.pinned ? '<span class="msg-pin" title="Pinned message"><span class="material-icons-round">push_pin</span>Pinned</span>' : '';
  const replyId = esc(getMessageId(msg));
  const replyAttr = replyId ? `data-reply-id="${replyId}"` : '';
  const bubbleBody = messageMaterialContent(effect, body);

  if (msg.system) return `<div class="msg-system">${body}</div>`;

  let quoteHtml = '';
  if (msg.reply || msg.replyTo) {
    quoteHtml = renderReplyQuoteHtml(msg.reply || msg.replyTo);
  }

  if (isFirst) {
    return `<div class="msg-row">
      <button type="button" class="msg-profile-target msg-reply-avatar" data-profile-message-id="${replyId}" data-profile-username="${esc(mentionName)}" title="View ${esc(name)}'s profile">${avatarEl(name, 36, avatarUrl, avatarEffect)}</button>
      <div style="flex:1;min-width:0">
        <div style="display:flex;align-items:baseline;gap:7px;margin-bottom:3px">
          <button type="button" class="msg-reply-target msg-mention-target" data-mention-name="${esc(mentionName)}" title="Mention @${esc(mentionName)}" style="background:none;border:0;padding:0;font:inherit;font-size:13px;font-weight:600;color:#fff;cursor:pointer;text-align:left">${esc(name)}</button>
          ${roleBadge(msg)}
          ${userTagBadge(msg)}
        </div>
        ${quoteHtml}<div class="msg-bubble msg-reply-target${bc?' '+bc:''}${pending?' msg-bubble-pending':''}" ${replyAttr} title="Reply to ${esc(name)}">${bubbleBody}</div>
        <div class="msg-time-row"><span class="msg-time">${time}</span>${delivery}${pinHtml}</div>
        ${reactionsHtml}
        ${receiptHtml}
      </div>
      ${actions}
    </div>`;
  }
  return `<div class="msg-follow">${quoteHtml}<div class="msg-bubble msg-reply-target${bc?' '+bc:''}${pending?' msg-bubble-pending':''}" ${replyAttr} title="Reply to ${esc(name)}">${bubbleBody}</div><div class="msg-time-row msg-time-row-follow"><span class="msg-time">${time}</span>${delivery}${pinHtml}</div>${reactionsHtml}${receiptHtml}${actions}</div>`;
}

function emptyPlaceholder() {
  return `<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:56px 0;color:#52525b">
    <span class="material-icons-round" style="font-size:44px;opacity:.25;margin-bottom:10px">chat_bubble_outline</span>
    <span style="font-size:13px">No messages yet — say hello!</span>
  </div>`;
}

function renderMessages(msgs, options = {}) {
  const list = document.getElementById('messages-list');
  if (!list) return;
  const orderedMessages = canonicalizeMessageAuthors(msgs);
  if (msgs === S.lastMsgs) S.lastMsgs = orderedMessages;
  if (!orderedMessages.length) { list.innerHTML = emptyPlaceholder(); return; }
  const shouldStick = options.forceScroll || isNearMessageBottom();

  let html = '';
  let prevDate = null, prevAuthor = null, prevTs = 0;
  S.__unreadDividerInserted = false;

  for (const msg of orderedMessages) {
    const dateStr = messageTimeValue(msg);
    const author = messageAuthorKey(msg);
    const ts = dateStr ? new Date(dateStr).getTime() : 0;
    const newDay = !sameDay(prevDate, dateStr);
    const newGroup = newDay || author !== prevAuthor || ts - prevTs > 5*60_000 || msg.system;

    if (newDay && dateStr) html += `<div class="date-div">${formatDateLabel(dateStr)}</div>`;
    if (shouldInsertUnreadDivider(msg)) html += `<div class="unread-divider"><span>New messages</span></div>`;
    html += `<div class="msg-virtual-item ${newGroup&&!msg.system?'msg-group':'mt-0.5'}" data-message-id="${esc(getMessageId(msg))}">${buildMsgHtml(msg, newGroup&&!msg.system)}</div>`;
    prevDate = dateStr; prevAuthor = author; prevTs = ts;
  }

  list.innerHTML = html;
  scrollBottomSoon({ force: shouldStick });
  void renderLinkEmbeds(list, { preserveScroll: !shouldStick }).finally(() => scrollBottomSoon({ force: shouldStick }));
}

function appendMessage(msg, options = {}) {
  const shouldStick = options.forceScroll || msg.__ownMessage || isNearMessageBottom();
  S.lastMsgs = mergeMessageBatch(S.lastMsgs, [msg]);
  if (S.lastMsgs.length > 600) {
    S.lastMsgs.splice(0, S.lastMsgs.length - 600);
  }
  renderMessages(S.lastMsgs, { forceScroll: shouldStick });
}

function isNearMessageBottom(threshold = 96) {
  const c = document.getElementById('messages-container');
  if (!c) return true;
  return c.scrollHeight - c.scrollTop - c.clientHeight <= threshold;
}

function scrollBottom() {
  const c = document.getElementById('messages-container');
  if (c) c.scrollTop = c.scrollHeight;
}

function scrollBottomSoon(options = {}) {
  if (!options.force && !isNearMessageBottom()) return;
  scrollBottom();
  requestAnimationFrame(scrollBottom);
  setTimeout(scrollBottom, 60);
  setTimeout(scrollBottom, 220);
}

function shouldInsertUnreadDivider(msg) {
  const readId = String(S.roomState?.read?.messageId || '');
  if (!readId || S.__unreadDividerInserted) return false;
  const index = S.lastMsgs.findIndex(item => String(getMessageId(item)) === readId);
  const current = S.lastMsgs.findIndex(item => String(getMessageId(item)) === String(getMessageId(msg)));
  if (index >= 0 && current === index + 1) {
    S.__unreadDividerInserted = true;
    return true;
  }
  return false;
}

function jumpToMessage(messageId) {
  const selector = `.msg-virtual-item[data-message-id="${cssEsc(messageId)}"]`;
  const element = document.querySelector(selector);
  if (!element) {
    toast('That message is outside the loaded history', 'info');
    return;
  }
  element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  element.classList.remove('msg-highlight');
  requestAnimationFrame(() => element.classList.add('msg-highlight'));
  setTimeout(() => element.classList.remove('msg-highlight'), 1800);
}
window.jumpToMessage = jumpToMessage;


// --- Link Embeds ---------------------------------------------------------
// In-memory cache for embed lookups
const embedDataCache = new Map();

async function renderLinkEmbeds(container, options = {}) {
  if (!container) container = document.getElementById('messages-list');
  if (!container) return;

  const links = container.querySelectorAll('.msg-bubble a[href]');
  if (!links.length) return;

  const entries = [];
  links.forEach(a => {
    const href = a.getAttribute('href') || '';
    if (!href || !/^https?:\/\//i.test(href)) return;

    // Find the parent message bubble to append embed below it
    const bubble = a.closest('.msg-bubble');
    if (!bubble) return;

    // Check if embed already exists for this URL in this message
    const encodedHref = encodeURIComponent(href);
    const existingEmbed = bubble.parentElement?.querySelector('[data-embed-url="' + encodedHref + '"]');
    if (existingEmbed) return;

    entries.push({ href, bubble });
  });

  if (!entries.length) return;

  // Fetch embeds in parallel with a concurrency limit
  const concurrency = 4;
  for (let i = 0; i < entries.length; i += concurrency) {
    const batch = entries.slice(i, i + concurrency);
    const results = await Promise.allSettled(
      batch.map(entry => fetchEmbedData(entry.href))
    );
    results.forEach((result, idx) => {
      const entry = batch[idx];
      if (result.status === 'fulfilled' && result.value && result.value.title) {
        renderEmbedCard(entry.bubble, entry.href, result.value, options);
      }
    });
  }
}

async function fetchEmbedData(url) {
  // Check in-memory cache
  if (embedDataCache.has(url)) return embedDataCache.get(url);

  try {
    const res = await fetch('/api/embed?url=' + encodeURIComponent(url));
    if (!res.ok) return null;
    const data = await res.json();
    if (data && data.title) {
      embedDataCache.set(url, data);
      return data;
    }
    return null;
  } catch {
    return null;
  }
}

function renderEmbedCard(bubble, url, data, options = {}) {
  if (!bubble || !data || !data.title) return;
  const shouldStick = !options.preserveScroll && isNearMessageBottom();

  // Find or create embed container after the bubble
  const existing = bubble.parentElement?.querySelector('.link-embed-container');
  const container = existing || document.createElement('div');
  if (!existing) {
    container.className = 'link-embed-container';
    bubble.after(container);
  }

  // Build the embed card
  const domain = data.domain || '';
  const title = esc(data.title || '');
  const description = esc(data.description || '');
  const image = data.image ? esc(data.image) : '';
  const icon = data.icon ? esc(data.icon) : '';

  const card = document.createElement('a');
  card.className = 'link-embed';
  card.href = url;
  card.target = '_blank';
  card.rel = 'noopener noreferrer';
  card.setAttribute('data-embed-url', encodeURIComponent(url));

  let html = '';
  // Image thumbnail on the left
  if (image) {
    html += "<div class=\"link-embed-img-wrap\"><img class=\"link-embed-img\" src=\"" + image + "\" alt=\"\" loading=\"lazy\" onerror=\"this.parentElement.remove()\"></div>";
  }
  // Content
  html += '<div class="link-embed-body">';
  html += '<div class="link-embed-title">' + title + '</div>';
  if (description) html += '<div class="link-embed-desc">' + description + '</div>';
  html += '<div class="link-embed-site">';
  if (icon) html += "<img class=\"link-embed-favicon\" src=\"" + icon + "\" alt=\"\" loading=\"lazy\" onerror=\"this.style.display='none'\">";
  html += '<span>' + esc(domain || url) + '</span>';
  html += '</div></div>';

  card.innerHTML = html;
  card.querySelectorAll('img').forEach((img) => {
    img.addEventListener('load', () => scrollBottomSoon({ force: shouldStick }), { once: true });
    img.addEventListener('error', () => scrollBottomSoon({ force: shouldStick }), { once: true });
  });
  container.appendChild(card);
  scrollBottomSoon({ force: shouldStick });
}

// ─── Unread Counts ────────────────────────────────────────────────────────────
function incrementUnread(roomId, options = {}) {
  if (!roomId || (roomId === S.room && !options.force)) return;
  S.unreadCounts[roomId] = (S.unreadCounts[roomId] || 0) + 1;
  saveUnread();
  updateUnreadBadges();
  updateJumpToLatest();
}

function incrementMention(roomId, msg) {
  if (!roomId) return;
  S.mentionCounts[roomId] = (S.mentionCounts[roomId] || 0) + 1;
  saveMentions();
  updateUnreadBadges();
  showMentionPopup(roomId, msg);
}

function clearUnread(roomId) {
  if (!roomId) return;
  delete S.unreadCounts[roomId];
  delete S.mentionCounts[roomId];
  saveUnread();
  saveMentions();
  updateUnreadBadges();
  updateJumpToLatest();
}

function updateJumpToLatest() {
  const button = document.getElementById('jump-latest-btn');
  if (!button) return;
  const count = Number(S.unreadCounts[S.room] || 0);
  const show = !!S.room && (!isNearMessageBottom(120) || count > 0);
  button.style.display = show ? 'flex' : 'none';
  const label = button.querySelector('[data-jump-count]');
  if (label) label.textContent = count ? `${count} new` : 'Jump to latest';
}

async function markCurrentRoomRead() {
  if (!S.room || document.hidden || !isNearMessageBottom(100)) return;
  const lastMessage = [...S.lastMsgs].reverse().find(message => getMessageId(message) && !message.__pending);
  const messageId = getMessageId(lastMessage);
  if (!messageId || String(S.roomState?.read?.messageId || '') === String(messageId)) {
    clearUnread(S.room);
    return;
  }
  S.roomState.read = { messageId, readAt: Date.now() };
  clearUnread(S.room);
  try {
    await chatApi(`/api/tlk/rooms/${encodeURIComponent(S.room)}/read`, {
      method: 'POST',
      body: { messageId }
    });
  } catch {
  } finally {
    S.voice.presenceInFlight = false;
  }
}

function scheduleMarkRead() {
  clearTimeout(S.readTimer);
  S.readTimer = setTimeout(markCurrentRoomRead, 350);
}

async function loadOlderMessages() {
  if (!S.room || S.loadingOlderMessages || !S.hasOlderMessages || !S.lastMsgs.length) return;
  const firstId = getMessageId(S.lastMsgs[0]);
  if (!firstId) return;
  const container = document.getElementById('messages-container');
  const previousHeight = container?.scrollHeight || 0;
  const roomAtStart = String(S.room);
  S.loadingOlderMessages = true;
  document.getElementById('history-loading')?.classList.add('visible');
  try {
    const query = new URLSearchParams({ beforeId: String(firstId), limit: '60' });
    const data = await chatApi(`/api/tlk/rooms/${encodeURIComponent(roomAtStart)}/messages?${query}`);
    if (roomAtStart !== String(S.room)) return;
    const older = Array.isArray(data) ? data : (data?.messages || []);
    const existing = new Set(S.lastMsgs.map(message => String(getMessageId(message))));
    const fresh = older.filter(message => {
      const id = String(getMessageId(message) || '');
      return id && !existing.has(id);
    });
    S.hasOlderMessages = older.length > 0 && fresh.length > 0;
    if (fresh.length) {
      S.lastMsgs = mergeMessageBatch(fresh.map(withLocalMessageIdentity), S.lastMsgs);
      renderMessages(S.lastMsgs);
      requestAnimationFrame(() => {
        if (container) container.scrollTop += container.scrollHeight - previousHeight;
      });
    }
  } catch {
    toast('Could not load older messages', 'error');
  } finally {
    S.loadingOlderMessages = false;
    document.getElementById('history-loading')?.classList.remove('visible');
  }
}

function updateUnreadBadges() {
  document.querySelectorAll('.sb-item[data-room]').forEach(btn => {
    const count = S.unreadCounts[btn.dataset.room] || 0;
    const mentionCount = S.mentionCounts[btn.dataset.room] || 0;
    const visibleCount = mentionCount || count;
    let badge = btn.querySelector('.sb-badge');
    if (visibleCount > 0) {
      if (!badge) { badge = document.createElement('span'); badge.className = 'sb-badge'; btn.appendChild(badge); }
      badge.classList.toggle('mention', mentionCount > 0);
      badge.textContent = visibleCount > 9 ? '9+' : String(visibleCount);
    } else if (badge) badge.remove();
  });
  // DMs nav badge total
  const dmsBadge = document.getElementById('dms-badge');
  if (dmsBadge) {
    const myName = myUsername();
    const total = S.friends.reduce((sum, f) => {
      const name = f.username || f.name || '';
      const room = computeDmRoom(myName, name);
      return sum + (S.mentionCounts[room] || S.unreadCounts[room] || 0);
    }, 0);
    dmsBadge.style.display = total ? 'flex' : 'none';
    dmsBadge.textContent = total > 9 ? '9+' : String(total || '');
  }
}

// ─── Message Actions ──────────────────────────────────────────────────────────
async function deleteMessage(msgId, senderToken = '') {
  if (!msgId || !S.room) return;
  try {
    await chatApi(`/api/tlk/rooms/${encodeURIComponent(S.room)}/messages/${encodeURIComponent(msgId)}/delete`, {
      method: 'POST',
      body: { senderToken }
    });
    S.lastMsgs = S.lastMsgs.filter(m => getMessageId(m) !== msgId);
    renderMessages(S.lastMsgs);
    toast('Message deleted', 'success');
  } catch (err) {
    toast(err.data?.msg || 'Failed to delete message', 'error');
  }
}
window.deleteMessage = deleteMessage;

function setReply(msgJson, options = {}) {
  try {
    const msg = typeof msgJson === 'string' ? JSON.parse(decodeURIComponent(msgJson)) : msgJson;
    const snapshot = buildReplySnapshot(msg);
    S.replyTarget = snapshot;
    const bar = document.getElementById('reply-bar');
    const nameEl = document.getElementById('reply-name');
    const quoteEl = document.getElementById('reply-quote');
    if (bar) bar.style.display = 'flex';
    if (nameEl) nameEl.textContent = snapshot.author;
    if (quoteEl) quoteEl.textContent = snapshot.imageUrl ? 'Image' : snapshot.preview;
    if (options.saveDraft !== false) scheduleDraftSave();
    document.getElementById('message-input')?.focus();
  } catch {}
}
window.setReply = setReply;

function setReplyById(messageId) {
  const message = S.lastMsgs.find(msg => String(getMessageId(msg)) === String(messageId));
  if (message) setReply(message);
}
window.setReplyById = setReplyById;

function clearReply(options = {}) {
  S.replyTarget = null;
  const bar = document.getElementById('reply-bar');
  if (bar) bar.style.display = 'none';
  if (options.saveDraft !== false) scheduleDraftSave();
}
window.clearReply = clearReply;

async function editMessage(message) {
  const messageId = getMessageId(message);
  if (!messageId || !S.room) return;
  const currentBody = stripLeadingReplyQuote(message.body || message.content || '').replace(/\[img:[\s\S]*?\]/g, '').trim();
  openModal(`
    <h3 class="feature-modal-title">Edit message</h3>
    <textarea id="edit-message-body" class="modal-input feature-edit-input" rows="5" maxlength="5000">${esc(currentBody)}</textarea>
    <div id="edit-message-error" class="feature-modal-error"></div>
    <div class="feature-modal-actions">
      <button class="modal-btn modal-btn-ghost" onclick="closeModal()">Cancel</button>
      <button class="modal-btn" id="edit-message-save">Save</button>
    </div>`);
  const textarea = document.getElementById('edit-message-body');
  textarea?.focus();
  textarea?.setSelectionRange(textarea.value.length, textarea.value.length);
  document.getElementById('edit-message-save')?.addEventListener('click', async () => {
    const body = textarea?.value.trim();
    if (!body) return showModalError('edit-message-error', 'Message cannot be empty.');
    try {
      const result = await chatApi(`/api/tlk/rooms/${encodeURIComponent(S.room)}/messages/${encodeURIComponent(messageId)}`, {
        method: 'PATCH',
        body: { body }
      });
      applyEditedMessage(result.message || { ...message, body, editedAt: Date.now() });
      closeModal();
    } catch (error) {
      showModalError('edit-message-error', error.data?.msg || 'Could not edit message.');
    }
  });
}

function applyEditedMessage(incoming = {}) {
  const messageId = String(getMessageId(incoming) || '');
  if (!messageId) return;
  S.lastMsgs = S.lastMsgs.map(message =>
    String(getMessageId(message)) === messageId ? { ...message, ...incoming, __pending: false } : message
  );
  renderMessages(S.lastMsgs);
}

function openReactionPicker(message) {
  const messageId = getMessageId(message);
  openModal(`
    <h3 class="feature-modal-title">Add reaction</h3>
    <div class="reaction-picker">
      ${S.allowedReactions.map(emoji => `<button type="button" data-pick-reaction="${esc(emoji)}">${esc(emoji)}</button>`).join('')}
    </div>
    <button class="modal-btn modal-btn-ghost" onclick="closeModal()" style="width:100%;margin-top:12px">Cancel</button>`);
  document.querySelectorAll('[data-pick-reaction]').forEach(button => {
    button.addEventListener('click', async () => {
      await toggleMessageReaction(messageId, button.dataset.pickReaction);
      closeModal();
    });
  });
}

async function toggleMessageReaction(messageId, emoji) {
  if (!messageId || !emoji || !S.room) return;
  try {
    const result = await chatApi(`/api/tlk/rooms/${encodeURIComponent(S.room)}/messages/${encodeURIComponent(messageId)}/reactions`, {
      method: 'POST',
      body: { emoji }
    });
    applyReactionUpdate({ messageId, reactions: result.reactions });
  } catch (error) {
    toast(error.data?.msg || 'Could not update reaction', 'error');
  }
}

function applyReactionUpdate(data = {}) {
  const messageId = String(data.messageId || '');
  const me = myUsername().toLowerCase();
  S.lastMsgs = S.lastMsgs.map(message => {
    if (String(getMessageId(message)) !== messageId) return message;
    const previous = new Map((message.reactions || []).map(reaction => [reaction.emoji, reaction]));
    const reactions = (data.reactions || []).map(reaction => ({
      ...reaction,
      reacted: reaction.reacted !== undefined
        ? reaction.reacted
        : (reaction.users || []).some(name => String(name).toLowerCase() === me) || !!previous.get(reaction.emoji)?.reacted
    }));
    return { ...message, reactions };
  });
  renderMessages(S.lastMsgs);
}

async function toggleMessageBookmark(message) {
  const messageId = getMessageId(message);
  try {
    const result = await chatApi(`/api/tlk/rooms/${encodeURIComponent(S.room)}/messages/${encodeURIComponent(messageId)}/bookmark`, {
      method: 'POST'
    });
    S.lastMsgs = S.lastMsgs.map(item => String(getMessageId(item)) === String(messageId)
      ? { ...item, bookmarked: !!result.bookmarked }
      : item);
    const ids = new Set(S.roomState.bookmarkIds || []);
    if (result.bookmarked) ids.add(String(messageId)); else ids.delete(String(messageId));
    S.roomState.bookmarkIds = [...ids];
    renderMessages(S.lastMsgs);
    toast(result.bookmarked ? 'Message bookmarked' : 'Bookmark removed', 'success');
  } catch (error) {
    toast(error.data?.msg || 'Could not update bookmark', 'error');
  }
}

async function toggleMessagePin(message) {
  const messageId = getMessageId(message);
  try {
    const result = await chatApi(`/api/tlk/rooms/${encodeURIComponent(S.room)}/messages/${encodeURIComponent(messageId)}/pin`, {
      method: 'POST'
    });
    applyPinUpdate(result);
    toast(result.pinned ? 'Message pinned' : 'Message unpinned', 'success');
  } catch (error) {
    toast(error.data?.msg || 'Could not update pin', 'error');
  }
}

function applyPinUpdate(data = {}) {
  const messageId = String(data.messageId || '');
  S.lastMsgs = S.lastMsgs.map(message =>
    String(getMessageId(message)) === messageId ? { ...message, pinned: !!data.pinned } : message
  );
  if (data.pinned) {
    const message = S.lastMsgs.find(item => String(getMessageId(item)) === messageId);
    if (message && !(S.roomState.pinned || []).some(item => String(getMessageId(item)) === messageId)) {
      S.roomState.pinned = [message, ...(S.roomState.pinned || [])];
    }
  } else {
    S.roomState.pinned = (S.roomState.pinned || []).filter(item => String(getMessageId(item)) !== messageId);
  }
  renderMessages(S.lastMsgs);
}

function savedMessageRow(message, roomId = S.room) {
  const body = stripLeadingReplyQuote(message.body || message.content || '').replace(/\[img:[\s\S]*?\]/g, '').trim();
  const preview = body || (extractImageUrlFromText(message.body || message.content || '') ? 'Image' : 'Message');
  return `<button type="button" class="saved-message-row" data-saved-room="${esc(roomId)}" data-saved-message="${esc(getMessageId(message))}">
    <span class="saved-message-author">${esc(getUsername(message))}</span>
    <span class="saved-message-preview">${esc(preview.slice(0, 180))}</span>
    <span class="saved-message-time">${esc(formatTime(messageTimeValue(message)))}</span>
  </button>`;
}

function bindSavedMessageRows() {
  document.querySelectorAll('[data-saved-message]').forEach(button => {
    button.addEventListener('click', async () => {
      const roomId = button.dataset.savedRoom;
      const messageId = button.dataset.savedMessage;
      closeModal();
      if (String(roomId) !== String(S.room)) {
        await joinRoom(roomId, 'channel', roomId);
      }
      jumpToMessage(messageId);
    });
  });
}

function showPinnedMessages() {
  const pinned = S.roomState.pinned || [];
  openModal(`
    <h3 class="feature-modal-title">Pinned messages</h3>
    <div class="saved-message-list">${pinned.length ? pinned.map(message => savedMessageRow(message)).join('') : '<div class="feature-empty">No pinned messages in this chat.</div>'}</div>
    <button class="modal-btn modal-btn-ghost" onclick="closeModal()" style="width:100%;margin-top:12px">Close</button>`);
  bindSavedMessageRows();
}
window.showPinnedMessages = showPinnedMessages;

async function showBookmarks() {
  openModal('<h3 class="feature-modal-title">Bookmarks</h3><div class="feature-loading">Loading bookmarks...</div>');
  try {
    const data = await chatApi('/api/tlk/bookmarks');
    const bookmarks = Array.isArray(data?.bookmarks) ? data.bookmarks : [];
    const content = document.getElementById('modal-content');
    if (!content) return;
    content.innerHTML = `
      <h3 class="feature-modal-title">Bookmarks</h3>
      <div class="saved-message-list">${bookmarks.length ? bookmarks.map(message => savedMessageRow(message, message.roomId)).join('') : '<div class="feature-empty">You have no bookmarked messages.</div>'}</div>
      <button class="modal-btn modal-btn-ghost" onclick="closeModal()" style="width:100%;margin-top:12px">Close</button>`;
    bindSavedMessageRows();
  } catch (error) {
    toast(error.data?.msg || 'Could not load bookmarks', 'error');
    closeModal();
  }
}
window.showBookmarks = showBookmarks;

function reportMessage(message) {
  const msg = typeof message === 'object' && message ? message : S.lastMsgs.find(item => String(getMessageId(item)) === String(message));
  const msgId = getMessageId(msg) || String(message || '');
  if (!msgId) return;
  openModal(`
    <h3 style="font-size:17px;font-weight:700;color:#fff;margin:0 0 14px">Report Message</h3>
    <div style="display:flex;flex-direction:column;gap:10px">
      <select id="report-category" class="modal-input">
        <option value="offensive">Offensive / Hate speech</option>
        <option value="spam">Spam</option>
        <option value="harassment">Harassment</option>
        <option value="other">Other</option>
      </select>
      <textarea id="report-reason" class="modal-input" rows="3" placeholder="Describe what happened" style="resize:none" required></textarea>
      <div id="report-error" style="display:none;color:#f87171;font-size:12px"></div>
      <div style="display:flex;gap:8px;margin-top:4px">
        <button class="modal-btn modal-btn-ghost" onclick="closeModal()">Cancel</button>
        <button class="modal-btn modal-btn-danger" id="report-submit-btn">Report</button>
      </div>
    </div>`);
  document.getElementById('report-submit-btn')?.addEventListener('click', async () => {
    const category = document.getElementById('report-category')?.value;
    const reason = document.getElementById('report-reason')?.value?.trim();
    if (!reason) return showModalError('report-error', 'Add a short reason for the report.');
    try {
      await api('/api/network/reports', { method:'POST', body:{
        messageId: msgId,
        room: S.room,
        reasonCategory: category,
        reason,
        targetUsername: getUsername(msg),
        targetUserId: msg?.userId || '',
        targetToken: msg?.user_token || msg?.userToken || '',
        quote: String(msg?.body || msg?.content || '').slice(0, 500)
      } });
      toast('Report submitted', 'success');
      closeModal();
    } catch (err) {
      showModalError('report-error', err.data?.msg || 'Failed to submit report');
    }
  });
}
window.reportMessage = reportMessage;

function openModPanel(msg) {
  if (!msg || typeof msg !== 'object' || !isStaff()) return;
  const targetUser = getUsername(msg);
  const targetId = String(msg?.userId || '').trim();
  const targetRef = targetId ? `user:${targetId}` : targetUser;
  const isOwner = S.user?.is_owner || String(S.user?.role || '').toLowerCase() === 'owner';
  openModal(`
    <h3 style="font-size:17px;font-weight:700;color:#fff;margin:0 0 6px">Moderate User</h3>
    <div style="font-size:13px;color:#a1a1aa;margin-bottom:5px">Target: <span style="color:#e4e4e7;font-weight:600">${esc(targetUser)}</span></div>
    <div id="mod-warning-count" style="font-size:11px;color:#fbbf24;margin-bottom:14px">Loading active warnings…</div>
    <div style="display:flex;flex-direction:column;gap:10px">
      <input id="mod-reason" class="modal-input" placeholder="Reason (optional)" />
      <div id="mod-error" style="display:none;color:#f87171;font-size:12px"></div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:4px">
        <button class="modal-btn modal-btn-ghost" onclick="closeModal()">Cancel</button>
        <button class="modal-btn" id="mod-warn-btn" style="background:#d97706">Warn</button>
        <button class="modal-btn modal-btn-ghost" id="mod-clearwarns-btn">Clear Warnings</button>
        <button class="modal-btn modal-btn-danger" id="mod-ban-btn">Ban from Room</button>
        ${isOwner ? `<button class="modal-btn modal-btn-danger" id="mod-banall-btn" style="background:#7f1d1d">Global Ban</button>` : ''}
      </div>
      <div style="margin-top:2px;padding-top:10px;border-top:1px solid rgba(255,255,255,.08)">
        <div style="font-size:10px;font-weight:750;letter-spacing:.06em;text-transform:uppercase;color:#71717a;margin-bottom:7px">Ban appeals</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button class="modal-btn modal-btn-ghost" id="mod-appeal-room-btn" style="color:#86efac;border-color:rgba(74,222,128,.24)">Approve Room Appeal</button>
          <button class="modal-btn modal-btn-ghost" id="mod-appeal-global-btn" style="color:#93c5fd;border-color:rgba(96,165,250,.24)">Approve Global Appeal</button>
        </div>
      </div>
    </div>`);

  async function doAction(action) {
    const reason = document.getElementById('mod-reason')?.value?.trim() || '';
    try {
      const result = await api('/api/network/mod/actions', { method: 'POST', body: { action, target: targetRef, room: S.room, reason } });
      const actionLabel = action === 'clearwarns'
        ? 'Warnings cleared'
        : action === 'warn'
          ? `Warning ${result.warning?.warnings || ''}/${result.warning?.limit || ''}`
          : action === 'unban_room'
            ? 'Room-ban appeal approved'
            : action === 'unban_global'
              ? 'Global-ban appeal approved'
              : `${action} applied`;
      toast(`${actionLabel} for ${targetUser}`, 'success');
      closeModal();
    } catch (err) {
      showModalError('mod-error', err.data?.msg || `Failed to apply ${action}`);
    }
  }

  document.getElementById('mod-warn-btn')?.addEventListener('click', () => doAction('warn'));
  document.getElementById('mod-clearwarns-btn')?.addEventListener('click', () => doAction('clearwarns'));
  document.getElementById('mod-ban-btn')?.addEventListener('click', () => doAction('ban'));
  document.getElementById('mod-banall-btn')?.addEventListener('click', () => doAction('banfromall'));
  document.getElementById('mod-appeal-room-btn')?.addEventListener('click', () => doAction('unban_room'));
  document.getElementById('mod-appeal-global-btn')?.addEventListener('click', () => doAction('unban_global'));
  if (targetId) {
    api(`/api/network/warnings?userId=${encodeURIComponent(targetId)}&active=true&limit=100`).then(data => {
      const count = Array.isArray(data?.warnings) ? data.warnings.length : 0;
      const countEl = document.getElementById('mod-warning-count');
      if (countEl) countEl.textContent = `${count}/${Number(data?.warningLimit || 3)} active warnings`;
    }).catch(() => {
      const countEl = document.getElementById('mod-warning-count');
      if (countEl) countEl.textContent = 'Warning history unavailable';
    });
  } else {
    const countEl = document.getElementById('mod-warning-count');
    if (countEl) countEl.textContent = 'No database account linked to this message';
  }
}
window.openModPanel = openModPanel;

// ─── Mention Autocomplete ─────────────────────────────────────────────────────
let mentionQuery = '';
let mentionSelectedIdx = -1;
let mentionSearchTimer = null;
const knownValidUsers = new Set();

function mentionAvatarHtml(username, avatar) {
  const color = avatarColor(username);
  const initials = esc(avatarInitials(username));
  const base = `width:22px;height:22px;border-radius:6px;flex-shrink:0;`;
  if (avatar) {
    return `<div style="${base}background:${color};overflow:hidden;position:relative">
      <img src="${esc(avatar)}" style="width:100%;height:100%;object-fit:cover" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
      <span style="display:none;position:absolute;inset:0;align-items:center;justify-content:center;font-size:9px;font-weight:700;color:#fff">${initials}</span>
    </div>`;
  }
  return `<div style="${base}background:${color};display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;color:#fff">${initials}</div>`;
}

function renderMentionItems(panel, users) {
  if (!users.length) { hideMentionPanel(); return; }
  panel.style.display = 'block';
  panel.innerHTML = users.map((u, i) => {
    const name = u.username || '';
    return `<div class="mention-item" data-idx="${i}" data-name="${esc(name)}" onclick="insertMention('${esc(name)}')">
      ${mentionAvatarHtml(name, u.avatar || null)}
      <span>${esc(name)}</span>
    </div>`;
  }).join('');
}

function showMentionPanel(query) {
  mentionQuery = query;
  mentionSelectedIdx = -1;
  clearTimeout(mentionSearchTimer);

  const panel = document.getElementById('mention-panel');
  if (!panel) return;

  const localPool = [
    ...(S.user ? [{ username: myUsername(), avatar: S.user.avatar || null }] : []),
    ...S.friends.map(f => ({ username: f.username || f.name || '', avatar: f.avatar || null })),
  ];
  const seen = new Set();
  const localFiltered = localPool.filter(u => {
    if (!u.username || seen.has(u.username.toLowerCase())) return false;
    seen.add(u.username.toLowerCase());
    return u.username.toLowerCase().includes(query.toLowerCase());
  }).slice(0, 8);

  renderMentionItems(panel, localFiltered);

  if (query.length >= 1) {
    mentionSearchTimer = setTimeout(async () => {
      try {
        const data = await api(`/api/users/friends?search=${encodeURIComponent(query)}`);
        const apiUsers = (data?.results || []).map(u => ({ username: u.username || '', avatar: u.avatar || null })).filter(u => u.username);
        apiUsers.forEach(u => knownValidUsers.add(u.username.toLowerCase()));
        if (mentionQuery !== query) return;
        const seenApi = new Set(localFiltered.map(u => u.username.toLowerCase()));
        const merged = [...localFiltered, ...apiUsers.filter(u => !seenApi.has(u.username.toLowerCase()))].slice(0, 8);
        renderMentionItems(panel, merged);
      } catch {}
    }, 250);
  }
}

function hideMentionPanel() {
  clearTimeout(mentionSearchTimer);
  mentionSearchTimer = null;
  const panel = document.getElementById('mention-panel');
  if (panel) panel.style.display = 'none';
  mentionQuery = '';
}

function insertMention(name) {
  const mentionName = String(name || '').trim().replace(/^@+/, '');
  const input = document.getElementById('message-input');
  if (!mentionName || !input) return;
  const val = String(input.value || '');
  const atIdx = val.lastIndexOf('@');
  const completingMention = atIdx >= 0 && !/\s/.test(val.slice(atIdx + 1));
  input.value = completingMention
    ? `${val.slice(0, atIdx)}@${mentionName} `
    : (val.trim() ? `${val.trimEnd()} @${mentionName} ` : `@${mentionName} `);
  input.focus();
  input.setSelectionRange?.(input.value.length, input.value.length);
  input.dispatchEvent(new Event('input', { bubbles: true }));
  hideMentionPanel();
}
window.insertMention = insertMention;

function handleMentionKey(e) {
  const panel = document.getElementById('mention-panel');
  if (!panel || panel.style.display === 'none') return false;
  const items = panel.querySelectorAll('.mention-item');
  if (e.key === 'ArrowDown') { e.preventDefault(); mentionSelectedIdx = Math.min(mentionSelectedIdx+1, items.length-1); updateMentionSel(items); return true; }
  if (e.key === 'ArrowUp') { e.preventDefault(); mentionSelectedIdx = Math.max(mentionSelectedIdx-1, 0); updateMentionSel(items); return true; }
  if ((e.key === 'Enter' || e.key === 'Tab') && mentionSelectedIdx >= 0) {
    e.preventDefault();
    const name = items[mentionSelectedIdx]?.dataset?.name;
    if (name) insertMention(name);
    return true;
  }
  if (e.key === 'Escape') { hideMentionPanel(); return true; }
  return false;
}

function updateMentionSel(items) {
  items.forEach((el, i) => el.classList.toggle('selected', i === mentionSelectedIdx));
  items[mentionSelectedIdx]?.scrollIntoView({ block: 'nearest' });
}

// ─── Effects Picker ───────────────────────────────────────────────────────────
// ─── Room Effect Visuals ──────────────────────────────────────────────────────
let activeTextScramble = null;
let activeSpiralMelt = null;
let activeFlashbangEffect = null;

function startCinematicFlashbang(durationMs = 12000) {
  activeFlashbangEffect?.stop?.();
  const duration = Math.max(9000, Number(durationMs) || 12000);
  const overlay = document.createElement('div');
  overlay.className = 'flashbang-3d-overlay';
  overlay.innerHTML = `
    <div class="flashbang-3d-dim"></div>
    <div class="flashbang-3d-field"></div>
    <div class="flashbang-3d-rings">
      <span></span><span></span><span></span><span></span><span></span>
    </div>
    <div class="flashbang-3d-core"></div>
    <div class="flashbang-3d-lightning"></div>
    <div class="flashbang-3d-whiteout"></div>
    <div class="flashbang-3d-static"></div>
    <div class="flashbang-3d-afterimage"></div>
    <div class="flashbang-3d-particles"></div>`;
  document.body.appendChild(overlay);
  document.body.classList.add('flashbang-3d-running');
  const particles = overlay.querySelector('.flashbang-3d-particles');
  for (let i = 0; i < 90; i++) {
    const dot = document.createElement('i');
    dot.style.setProperty('--x', `${(Math.random() - .5) * 100}vw`);
    dot.style.setProperty('--y', `${(Math.random() - .5) * 100}vh`);
    dot.style.setProperty('--s', `${2 + Math.random() * 5}px`);
    dot.style.setProperty('--d', `${4.8 + Math.random() * 4.4}s`);
    dot.style.setProperty('--delay', `${5.7 + Math.random() * 2.2}s`);
    particles.appendChild(dot);
  }

  let stopped = false;
  const cleanupTimer = setTimeout(stop, duration + 180);
  function stop() {
    if (stopped) return;
    stopped = true;
    clearTimeout(cleanupTimer);
    document.body.classList.remove('flashbang-3d-running');
    overlay.remove();
    if (activeFlashbangEffect?.stop === stop) activeFlashbangEffect = null;
  }
  activeFlashbangEffect = { stop };
}

function startSpiralContentMelt(durationMs = 9000) {
  activeSpiralMelt?.stop?.();
  const container = document.getElementById('messages-container');
  const messageList = document.getElementById('messages-list');
  if (!container || !messageList) return;

  const bounds = container.getBoundingClientRect();
  const centerX = bounds.left + bounds.width / 2;
  const centerY = bounds.top + bounds.height / 2;
  const visibleElements = [...messageList.children, document.getElementById('typing-bar')].filter((element) => {
    if (!element) return false;
    const rect = element.getBoundingClientRect();
    return rect.bottom >= bounds.top && rect.top <= bounds.bottom;
  });
  if (!visibleElements.length) return;

  const filterId = `spiral-content-melt-${Date.now()}`;
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '0');
  svg.setAttribute('height', '0');
  svg.style.position = 'fixed';
  svg.style.pointerEvents = 'none';
  svg.innerHTML = `<filter id="${filterId}" x="-80%" y="-80%" width="260%" height="260%">
    <feTurbulence type="fractalNoise" baseFrequency="0.009 0.032" numOctaves="1" seed="11" result="noise"/>
    <feDisplacementMap in="SourceGraphic" in2="noise" scale="0" xChannelSelector="R" yChannelSelector="B"/>
  </filter>`;
  document.body.appendChild(svg);
  const displacement = svg.querySelector('feDisplacementMap');
  const originalOverflowX = container.style.overflowX;
  const originalOverflowY = container.style.overflowY;
  const originalScrollTop = container.scrollTop;
  const originalScrollLeft = container.scrollLeft;
  const originalContainerFilter = container.style.filter;
  const originalContainerWillChange = container.style.willChange;
  container.style.overflowX = 'clip';
  container.style.overflowY = 'hidden';
  container.style.filter = `url(#${filterId})`;
  container.style.willChange = 'filter';
  const animations = [];
  const originals = new Map();
  const duration = Math.max(2500, Number(durationMs) || 9000);

  const spiralTransform = (rect, turns, radius, rotation, scaleX, scaleY, skew) => {
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const vx = x - centerX;
    const vy = y - centerY;
    const angle = turns * Math.PI * 2;
    const targetX = centerX + (vx * Math.cos(angle) - vy * Math.sin(angle)) * radius;
    const targetY = centerY + (vx * Math.sin(angle) + vy * Math.cos(angle)) * radius;
    return `translate3d(${(targetX - x).toFixed(2)}px,${(targetY - y).toFixed(2)}px,0) rotate(${rotation}deg) skewX(${skew}deg) scale(${scaleX},${scaleY})`;
  };

  const circleRadius = Math.max(72, Math.min(bounds.width, bounds.height) * .22);
  const circleScaleX = Math.min(.24, Math.max(.08, 1.7 / visibleElements.length));
  const circleTransform = (rect, index, phase = 0) => {
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const angle = -Math.PI / 2 + (index / visibleElements.length) * Math.PI * 2 + phase;
    const targetX = centerX + Math.cos(angle) * circleRadius;
    const targetY = centerY + Math.sin(angle) * circleRadius;
    const tangentDegrees = angle * 180 / Math.PI + 90;
    return `translate3d(${(targetX - x).toFixed(2)}px,${(targetY - y).toFixed(2)}px,0) rotate(${tangentDegrees.toFixed(2)}deg) scale(${circleScaleX},.52)`;
  };

  visibleElements.forEach((element, index) => {
    const rect = element.getBoundingClientRect();
    originals.set(element, {
      willChange: element.style.willChange,
      transformOrigin: element.style.transformOrigin,
      zIndex: element.style.zIndex
    });
    element.style.willChange = 'transform,opacity';
    element.style.transformOrigin = '50% 50%';
    element.style.zIndex = String(20 + index);
    const animation = element.animate([
      { offset:0, transform:spiralTransform(rect, 0, 1, 0, 1, 1, 0), opacity:1 },
      { offset:.1, transform:spiralTransform(rect, .08, .98, 8, 1, 1, 0), opacity:1 },
      { offset:.22, transform:spiralTransform(rect, .3, .88, 28, .97, 1.03, 2), opacity:.99 },
      { offset:.38, transform:spiralTransform(rect, .66, .67, 62, .86, 1.12, 5), opacity:.95 },
      { offset:.54, transform:spiralTransform(rect, 1.02, .43, 105, .66, 1.24, 10), opacity:.86 },
      { offset:.66, transform:spiralTransform(rect, 1.36, .2, 146, .4, 1.42, 17), opacity:.72 },
      { offset:.72, transform:circleTransform(rect, index, -.16), opacity:.88, clipPath:'inset(0 round 999px)' },
      { offset:.78, transform:circleTransform(rect, index, 0), opacity:1, clipPath:'inset(0 round 999px)' },
      { offset:.84, transform:circleTransform(rect, index, .16), opacity:1, clipPath:'inset(0 round 999px)' },
      { offset:.88, transform:spiralTransform(rect, 2, 1, 360, 1.1, .94, -2), opacity:1, clipPath:'inset(0 round 0)' },
      { offset:.94, transform:spiralTransform(rect, 2, 1, 360, .96, 1.04, 1), opacity:1, clipPath:'inset(0 round 0)' },
      { offset:.98, transform:spiralTransform(rect, 2, 1, 360, 1.015, .99, 0), opacity:1, clipPath:'inset(0 round 0)' },
      { offset:1, transform:spiralTransform(rect, 2, 1, 360, 1, 1, 0), opacity:1, clipPath:'inset(0 round 0)' }
    ], { duration, easing:'cubic-bezier(.4,0,.18,1)', fill:'both' });
    animations.push(animation);
  });

  let stopped = false;
  let frameId = null;
  const startedAt = performance.now();
  const distort = (now) => {
    if (stopped) return;
    const progress = Math.min(1, (now - startedAt) / duration);
    const intensity = progress < .58
      ? Math.sin((progress / .58) * Math.PI / 2)
      : progress < .72
        ? 1 - ((progress - .58) / .14) * .78
        : progress < .84
          ? .22
          : Math.max(0, .22 * (1 - (progress - .84) / .16));
    displacement?.setAttribute('scale', String(Math.max(0, intensity) * 38));
    if (container.scrollTop !== originalScrollTop) container.scrollTop = originalScrollTop;
    if (container.scrollLeft !== originalScrollLeft) container.scrollLeft = originalScrollLeft;
    if (progress < 1) frameId = requestAnimationFrame(distort);
  };

  const stop = () => {
    if (stopped) return;
    stopped = true;
    if (frameId) cancelAnimationFrame(frameId);
    clearTimeout(stopTimer);
    animations.forEach((animation) => animation.cancel());
    originals.forEach((styles, element) => {
      if (!element.isConnected) return;
      element.style.willChange = styles.willChange;
      element.style.transformOrigin = styles.transformOrigin;
      element.style.zIndex = styles.zIndex;
    });
    container.style.filter = originalContainerFilter;
    container.style.willChange = originalContainerWillChange;
    container.style.overflowX = originalOverflowX;
    container.style.overflowY = originalOverflowY;
    container.scrollTop = originalScrollTop;
    container.scrollLeft = originalScrollLeft;
    svg.remove();
    if (activeSpiralMelt?.stop === stop) activeSpiralMelt = null;
  };
  frameId = requestAnimationFrame(distort);
  const stopTimer = setTimeout(stop, duration + 80);
  activeSpiralMelt = { stop };
}

function startScreenTextScramble(durationMs = 10000) {
  if (activeTextScramble) activeTextScramble.stop(true);

  const originals = new Map();
  const lastScrambled = new WeakMap();
  const excludedTags = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'OPTION']);
  const glyphs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#$%&@!?<>/\\';
  let stopped = false;

  const isEligible = (node) => {
    const parent = node?.parentElement;
    return !!parent &&
      !excludedTags.has(parent.tagName) &&
      !parent.closest('#room-effect-styles') &&
      /\S/.test(String(node.nodeValue || ''));
  };

  const registerTextNode = (node) => {
    if (!isEligible(node) || originals.has(node)) return;
    originals.set(node, String(node.nodeValue || ''));
  };

  const registerTree = (root) => {
    if (!root) return;
    if (root.nodeType === Node.TEXT_NODE) {
      registerTextNode(root);
      return;
    }
    if (root.nodeType !== Node.ELEMENT_NODE && root.nodeType !== Node.DOCUMENT_FRAGMENT_NODE) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) registerTextNode(node);
  };

  const scrambleText = (value) => Array.from(String(value || ''), (char) => {
    if (/\s/.test(char)) return char;
    return glyphs[Math.floor(Math.random() * glyphs.length)];
  }).join('');

  const tick = () => {
    for (const [node, original] of originals) {
      if (!node.isConnected) {
        originals.delete(node);
        continue;
      }
      const scrambled = scrambleText(original);
      lastScrambled.set(node, scrambled);
      node.nodeValue = scrambled;
    }
  };

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(registerTree);
      } else if (mutation.type === 'characterData') {
        const node = mutation.target;
        if (!originals.has(node)) {
          registerTextNode(node);
        } else if (node.nodeValue !== lastScrambled.get(node)) {
          originals.set(node, String(node.nodeValue || ''));
        }
      }
    }
  });
  S.socket.on('voice_presence', (data = {}) => {
    if (data.roomName !== 'voice:general') return;
    S.voice.roster = Array.isArray(data.participants) ? data.participants : [];
    if (S.voice.rotation >= Math.max(1, S.voice.roster.length)) S.voice.rotation = 0;
    renderVoiceChannelPresence();
  });
  S.socket.emit('voice_presence_request');

  const stop = (restore = true) => {
    if (stopped) return;
    stopped = true;
    clearInterval(intervalId);
    clearTimeout(timeoutId);
    observer.disconnect();
    if (restore) {
      for (const [node, original] of originals) {
        if (node.isConnected) node.nodeValue = original;
      }
    }
    document.documentElement.classList.remove('screen-text-scramble');
    if (activeTextScramble?.stop === stop) activeTextScramble = null;
  };

  registerTree(document.body);
  observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  document.documentElement.classList.add('screen-text-scramble');
  tick();
  const intervalId = setInterval(tick, 85);
  const timeoutId = setTimeout(() => stop(true), Math.max(1000, Number(durationMs) || 10000));
  activeTextScramble = { stop };
}

function showEffectActivationNotice(data = {}, scope = 'room') {
  const effectId = String(data?.effectId || '').trim();
  if (!effectId || effectId === 'none') return;
  let host = document.getElementById('effect-activation-notices');
  if (!host) {
    host = document.createElement('div');
    host.id = 'effect-activation-notices';
    host.setAttribute('aria-live', 'polite');
    document.body.appendChild(host);
  }

  const effect = EFFECT_MAP.get(effectId);
  const effectName = String(data?.effectName || effect?.name || effectId.replace(/[_-]+/g, ' ')).trim();
  const actor = String(data?.triggeredByName || data?.roomEffect?.triggeredByName || 'Someone').trim();
  const durationSeconds = Math.max(0, Math.round(Number(data?.durationMs || data?.roomEffect?.durationMs || 0) / 1000));
  const notice = document.createElement('div');
  notice.className = 'effect-activation-notice';
  notice.style.setProperty('--effect-accent', effect?.color || '#a855f7');

  const icon = document.createElement('span');
  icon.className = 'material-icons-round effect-activation-icon';
  icon.textContent = effectId === 'matrix' ? 'data_object' : effectId === 'spiral' ? 'all_out' : effectId === 'blackhole' ? 'blur_circular' : effectId === 'earthquake' ? 'crisis_alert' : effectId === 'nebula' ? 'auto_awesome_motion' : effectId === 'public_message' ? 'campaign' : 'auto_awesome';
  const copy = document.createElement('div');
  copy.className = 'effect-activation-copy';
  const title = document.createElement('div');
  title.className = 'effect-activation-title';
  const actorNode = document.createElement('strong');
  actorNode.textContent = actor;
  title.append(actorNode, document.createTextNode(` activated ${effectName}`));
  const detail = document.createElement('div');
  detail.className = 'effect-activation-detail';
  detail.textContent = `${scope === 'global' ? 'Global' : 'Room'} effect${durationSeconds ? ` • ${durationSeconds} seconds` : ''}`;
  copy.append(title, detail);
  const timer = document.createElement('span');
  timer.className = 'effect-activation-timer';
  notice.append(icon, copy, timer);
  host.appendChild(notice);
  requestAnimationFrame(() => notice.classList.add('visible'));
  setTimeout(() => {
    notice.classList.remove('visible');
    notice.classList.add('leaving');
    setTimeout(() => {
      notice.remove();
      if (!host.childElementCount) host.remove();
    }, 420);
  }, 4200);
}

const roomEffectRuntimeLoads = new Map();

function loadRoomEffectRuntime(globalName, source) {
  if (window[globalName]) return Promise.resolve(window[globalName]);
  if (roomEffectRuntimeLoads.has(globalName)) return roomEffectRuntimeLoads.get(globalName);
  const load = new Promise((resolve, reject) => {
    // The effect bundles are self-contained. Three.js uses this global only as
    // a duplicate-import warning marker, not as its runtime API.
    if (window.__THREE__) {
      try { delete window.__THREE__; } catch { window.__THREE__ = undefined; }
    }
    const script = document.createElement('script');
    script.src = source;
    script.async = true;
    script.onload = () => window[globalName] ? resolve(window[globalName]) : reject(new Error(`${globalName} did not initialize`));
    script.onerror = () => reject(new Error(`Could not load ${globalName}`));
    document.head.appendChild(script);
  }).catch((error) => {
    roomEffectRuntimeLoads.delete(globalName);
    throw error;
  });
  roomEffectRuntimeLoads.set(globalName, load);
  return load;
}

function triggerRoomEffect(effectId, durationMs = 5000, effectData = {}) {
  if (!effectId || effectId === 'none') return;
  const dur = effectId === 'scramble'
    ? 10000
    : Math.max(1000, Number(durationMs) || 5000);

  // Inject shared keyframes once
  if (!document.getElementById('room-effect-styles')) {
    const s = document.createElement('style');
    s.id = 'room-effect-styles';
    s.textContent = [
      '@keyframes re-fadeout{to{opacity:0}}',
      '@keyframes re-ember{0%{transform:translateY(0) scale(1);opacity:.9}100%{transform:translateY(-100vh) scale(0);opacity:0}}',
      '@keyframes re-snow{0%{transform:translateY(-20px) rotate(0deg);opacity:1}100%{transform:translateY(105vh) rotate(480deg);opacity:0}}',
      '@keyframes re-matrix-fast{0%{transform:translateY(-120%);opacity:0}8%{opacity:.9}92%{opacity:.9}100%{transform:translateY(115vh);opacity:0}}',
      '@keyframes re-matrix-mid{0%{transform:translateY(-120%);opacity:0}6%{opacity:.58}94%{opacity:.58}100%{transform:translateY(115vh);opacity:0}}',
      '@keyframes re-matrix-slow{0%{transform:translateY(-120%);opacity:0}5%{opacity:.32}95%{opacity:.32}100%{transform:translateY(115vh);opacity:0}}',
      '@keyframes re-matrix-flicker{0%,92%,94%,96%,100%{opacity:1}93%,95%{opacity:.35}}',
      '@keyframes re-matrix-scan{0%{background-position:0 0}100%{background-position:0 60px}}',
      '@keyframes re-matrix-glow-pulse{0%,100%{opacity:.28}50%{opacity:.48}}',
      '@keyframes re-matrix-char-change{0%,20%{content:"7"}25%{content:"A"}30%{content:"3"}35%{content:"F"}40%{content:"9"}45%{content:"B"}50%{content:"0"}55%{content:"D"}60%{content:"5"}65%{content:"E"}70%{content:"2"}75%{content:"C"}80%{content:"8"}85%{content:"4"}90%{content:"1"}100%{content:"6"}}',
      '@keyframes re-star{0%,100%{opacity:.1;transform:scale(.5)}50%{opacity:1;transform:scale(1.8)}}',
      '@keyframes re-duck{0%{opacity:0;transform:translateX(0)}5%{opacity:1}95%{opacity:1}100%{opacity:0;transform:translateX(110vw)}}',
      '@keyframes re-glitch{0%{transform:translate(0,0)skewX(0)}20%{transform:translate(-4px,2px)skewX(2deg)}40%{transform:translate(4px,-2px)skewX(-1deg)}60%{transform:translate(-2px,3px)skewX(1deg)}80%{transform:translate(3px,-1px)skewX(-2deg)}100%{transform:translate(0,0)skewX(0)}}',
      '@keyframes re-text-glitch{0%{transform:translate(0);filter:hue-rotate(0deg)}20%{transform:translate(-2px,1px);filter:hue-rotate(80deg)}40%{transform:translate(2px,-1px);filter:hue-rotate(160deg)}60%{transform:translate(-1px,-2px);filter:hue-rotate(240deg)}80%{transform:translate(1px,2px);filter:hue-rotate(320deg)}100%{transform:translate(0);filter:hue-rotate(360deg)}}',
      '.screen-text-scramble body{animation:re-text-glitch .11s steps(2,end) infinite!important}',
      '.screen-text-scramble body *{text-shadow:-2px 0 rgba(255,0,80,.85),2px 0 rgba(0,220,255,.85)!important}',
    ].join('');
    document.head.appendChild(s);
  }

  const wrap = document.createElement('div');
  wrap.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9998;overflow:hidden';
  document.body.appendChild(wrap);

  // Determine target container — room effects go inside the chat area
  const targetContainer = effectId === 'spiral'
    ? (document.getElementById('messages-container') || document.getElementById('main-area') || document.body)
    : effectId === 'matrix'
      ? (document.querySelector('.main') || document.body)
      : document.body;
  if (targetContainer !== document.body) {
    document.body.removeChild(wrap);
    targetContainer.appendChild(wrap);
    wrap.style.cssText = wrap.style.cssText.replace('position:fixed', 'position:absolute');
  }

  switch (effectId) {
    case 'flashbang': {
      wrap.remove();
      startCinematicFlashbang(Math.max(dur, 12000));
      return;
      break;
    }
    case 'scramble': {
      wrap.style.cssText += ';background:repeating-linear-gradient(0deg,rgba(0,255,80,.04),rgba(0,255,80,.04) 1px,transparent 1px,transparent 3px);animation:re-glitch .12s infinite';
      const rgb = document.createElement('div');
      rgb.style.cssText = 'position:absolute;inset:0;mix-blend-mode:screen;background:repeating-linear-gradient(90deg,rgba(255,0,0,.06),rgba(0,0,255,.06) 2px,transparent 2px,transparent 6px)';
      wrap.appendChild(rgb);
      startScreenTextScramble(10000);
      break;
    }
    case 'embers': {
      for (let i = 0; i < 50; i++) {
        const e = document.createElement('div');
        const size = 3 + Math.random() * 5;
        e.style.cssText = `position:absolute;bottom:-8px;left:${Math.random()*100}%;width:${size}px;height:${size}px;border-radius:50%;background:${Math.random()>.5?'#fb923c':'#fbbf24'};animation:re-ember ${2+Math.random()*3}s ${Math.random()*2}s ease-out forwards`;
        wrap.appendChild(e);
      }
      break;
    }
    case 'frostbyte': {
      wrap.style.cssText += ';background:linear-gradient(180deg,rgba(147,197,253,.18),rgba(96,165,250,.08))';
      const chars = ['❄','❅','❆'];
      for (let i = 0; i < 35; i++) {
        const f = document.createElement('div');
        f.style.cssText = `position:absolute;top:-30px;left:${Math.random()*100}%;font-size:${10+Math.random()*18}px;color:rgba(186,230,253,.85);animation:re-snow ${3+Math.random()*4}s ${Math.random()*3}s linear forwards`;
        f.textContent = chars[Math.floor(Math.random()*3)];
        wrap.appendChild(f);
      }
      break;
    }
    case 'spiral': {
      wrap.remove();
      void loadRoomEffectRuntime('VaultEffectRuntime', '/assets/js/vault-effect.bundle.js?v=20260624-vault-unskippable-6')
        .then(runtime => runtime.startVaultEffect?.({ durationMs:dur }))
        .catch(() => toast('Could not load the vault effect', 'error'));
      return;
    }
    case 'matrix': {
      wrap.remove();
      const triggeredByName = String(effectData?.triggeredByName || effectData?.roomEffect?.triggeredByName || myUsername() || 'User');
      const isCurrentUser = triggeredByName.toLowerCase() === myUsername().toLowerCase();
      const avatarUrl = effectData?.triggeredByAvatar || effectData?.roomEffect?.triggeredByAvatar || (isCurrentUser ? S.user?.avatar : null);
      void loadRoomEffectRuntime('MatrixEffectRuntime', '/assets/js/matrix-effect.bundle.js?v=20260624-matrix-unskippable-2')
        .then(runtime => runtime.startMatrixEffect?.({ avatarUrl, username:triggeredByName, durationMs:dur }))
        .catch(() => toast('Could not load the matrix effect', 'error'));
      return;
    }
    case 'blackhole': {
      wrap.remove();
      window.BlackHoleEffectRuntime?.startBlackHoleEffect?.({ durationMs:dur });
      return;
    }
    case 'earthquake': {
      wrap.remove();
      window.DigitalEarthquakeEffectRuntime?.startDigitalEarthquakeEffect?.({ durationMs:dur });
      return;
    }
    case 'nebula': {
      wrap.remove();
      window.NebulaWarpEffectRuntime?.startNebulaWarpEffect?.({ durationMs:dur });
      return;
    }
    case 'prism': {
      wrap.remove();
      window.CinematicRoomEffectsRuntime?.startPrismCoreEffect?.({ durationMs:dur });
      return;
    }
    case 'meteor': {
      wrap.remove();
      window.CinematicRoomEffectsRuntime?.startMeteorShowerEffect?.({ durationMs:dur });
      return;
    }
    case 'rift': {
      wrap.remove();
      window.CinematicRoomEffectsRuntime?.startTimeRiftEffect?.({ durationMs:dur });
      return;
    }
    case 'starlight': {
      wrap.style.cssText += ';background:rgba(10,5,30,.4)';
      for (let i = 0; i < 90; i++) {
        const star = document.createElement('div');
        const sz = 1 + Math.random() * 2.5;
        star.style.cssText = `position:absolute;left:${Math.random()*100}%;top:${Math.random()*100}%;width:${sz}px;height:${sz}px;border-radius:50%;background:#fff;animation:re-star ${.6+Math.random()*1.8}s ${Math.random()*2}s ease-in-out infinite`;
        wrap.appendChild(star);
      }
      break;
    }
    case 'duck': {
      for (let i = 0; i < 9; i++) {
        const d = document.createElement('div');
        const sz = 24 + Math.random() * 28;
        d.style.cssText = `position:absolute;top:${5+Math.random()*80}%;left:-${sz+10}px;font-size:${sz}px;animation:re-duck ${3+Math.random()*3}s ${Math.random()*4}s linear forwards`;
        d.textContent = '🦆';
        wrap.appendChild(d);
      }
      break;
    }
  }

  const fadeAt = Math.max(dur - 800, dur * 0.8);
  setTimeout(() => {
    wrap.style.transition = 'opacity .8s';
    wrap.style.opacity = '0';
    setTimeout(() => wrap.remove(), 900);
  }, fadeAt);
}

function showPublicMessageEffect(message, sender = 'Someone', durationMs = 8000) {
  document.getElementById('public-message-effect')?.remove();
  const overlay = document.createElement('div');
  overlay.id = 'public-message-effect';
  overlay.style.cssText = 'position:fixed;inset:0;z-index:10020;display:flex;align-items:center;justify-content:center;padding:28px;pointer-events:auto;background:radial-gradient(circle at center,rgba(0,153,255,.20),rgba(4,6,16,.82));backdrop-filter:blur(8px);animation:public-message-in .35s ease-out';
  const card = document.createElement('div');
  card.style.cssText = 'position:relative;width:min(760px,92vw);padding:34px 38px;border:1px solid rgba(80,190,255,.55);border-radius:22px;background:linear-gradient(145deg,rgba(8,18,38,.96),rgba(5,8,20,.96));box-shadow:0 0 80px rgba(0,153,255,.35),inset 0 0 35px rgba(0,153,255,.08);text-align:center';
  const label = document.createElement('div');
  label.textContent = 'PUBLIC MESSAGE';
  label.style.cssText = 'font-size:12px;font-weight:800;letter-spacing:.24em;color:#38bdf8;margin-bottom:18px';
  const text = document.createElement('div');
  text.textContent = String(message || '');
  text.style.cssText = 'font-size:clamp(24px,4vw,48px);font-weight:800;line-height:1.18;color:#f8fafc;overflow-wrap:anywhere;text-shadow:0 0 24px rgba(56,189,248,.35)';
  const by = document.createElement('div');
  by.textContent = `— ${String(sender || 'Someone')}`;
  by.style.cssText = 'margin-top:20px;font-size:14px;font-weight:600;color:#94a3b8';
  const close = document.createElement('button');
  close.type = 'button';
  close.setAttribute('aria-label', 'Close public message');
  close.innerHTML = '<span class="material-icons-round" style="font-size:18px">close</span>';
  close.style.cssText = 'position:absolute;top:12px;right:12px;width:32px;height:32px;border:1px solid rgba(255,255,255,.12);border-radius:10px;background:rgba(255,255,255,.06);color:#cbd5e1;display:flex;align-items:center;justify-content:center;cursor:pointer';
  let timer = null;
  const dismiss = () => {
    clearTimeout(timer);
    if (!overlay.isConnected) return;
    overlay.style.transition = 'opacity .45s ease';
    overlay.style.opacity = '0';
    setTimeout(() => overlay.remove(), 500);
  };
  close.addEventListener('click', dismiss);
  card.append(close, label, text, by);
  overlay.appendChild(card);
  document.body.appendChild(overlay);
  const duration = Math.max(3000, Number(durationMs) || 8000);
  timer = setTimeout(dismiss, duration);
}

function toggleEffectsPopover() {
  const pop = document.getElementById('effects-popover');
  if (!pop) return;
  if (pop.style.display === 'block') { pop.style.display = 'none'; return; }
  const coins = S.user?.coins ?? 0;
  const roomEffects = EFFECTS.filter(e => e.scope === 'room');
  const globalEffects = EFFECTS.filter(e => e.scope === 'global');

  function effectRow(e, clickFn) {
    return `<div class="effect-item effect-item-preview" onclick="${clickFn}('${esc(e.id)}')">
      ${effectPreviewHtml(e)}
      <span style="flex:1;min-width:0"><span style="display:block;color:#e4e4e7;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(e.name)}</span><span style="display:block;margin-top:2px;font-size:9px;color:#71717a">${effectPreviewCopy(e)}</span></span>
      <span style="font-size:9px;color:#fbbf24;white-space:nowrap">${e.price}c/use</span>
    </div>`;
  }

  pop.style.display = 'block';
  pop.innerHTML = `
    <div style="font-size:11px;font-weight:600;color:#71717a;text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px;display:flex;justify-content:space-between;align-items:center">
      <span style="color:#fbbf24;display:flex;align-items:center;gap:3px"><span class="material-icons-round" style="font-size:13px">toll</span>${esc(String(coins))}</span>
    </div>
    <div style="font-size:11px;font-weight:600;color:#fbbf24;margin:6px 0 4px;display:flex;align-items:center;gap:5px"><span class="material-icons-round" style="font-size:14px">theater_comedy</span>Room Effects — everyone in the room sees this</div>
    ${roomEffects.map(e => effectRow(e, 'activateRoomEffect')).join('')}
    <div class="effect-coming-soon" aria-disabled="true">
      <span class="material-icons-round">schedule</span>
      <span><strong>More effects coming soon</strong><small>New room effects are on the way.</small></span>
    </div>
    <div style="border-top:1px solid rgba(255,255,255,.07);margin:8px 0 4px;font-size:11px;font-weight:600;color:#0099ff;text-transform:uppercase;letter-spacing:.06em;display:flex;align-items:center;gap:5px"><span class="material-icons-round" style="font-size:14px">campaign</span>Global — broadcast a message to everyone</div>
    ${globalEffects.map(e => effectRow(e, 'activateGlobalEffect')).join('')}
  `;
}

async function setEquippedEffect(id) {
  const effect = getEffectMeta(id);
  if (!effect) return;
  document.getElementById('effects-popover').style.display = 'none';

  const owned = new Set(Array.isArray(S.user?.ownedEffects) ? S.user.ownedEffects : ['none']);

  if (!owned.has(id) && id !== 'none') {
    if (!confirm(`Buy ${effect.name} for ${effect.price} coins? (You have ${S.user?.coins ?? 0})`)) return;
    try {
      const data = await api(`/api/tlk/chat-effects/${encodeURIComponent(id)}/purchase`, { method: 'POST' });
      if (data.user) setUser({ ...(S.user || {}), ...data.user });
      S.equippedEffect = id;
      localStorage.setItem('equippedEffect', id);
      toast(`Purchased & equipped: ${effect.name}`, 'success');
      updateEffectBtn(id, effect.color);
      syncCosmeticsLive();
      return;
    } catch (err) {
      toast(err.data?.msg || 'Not enough coins', 'error');
      return;
    }
  }

  try {
    await api('/api/tlk/chat-effects/equip', { method: 'POST', body: { effectId: id } });
  } catch {}
  S.equippedEffect = id;
  localStorage.setItem('equippedEffect', id);
  if (S.user) S.user.equippedEffect = id;
  const effectName = effect.name || id;
  toast(id === 'none' ? 'Effect removed' : `Effect: ${effectName}`, 'success');
  updateEffectBtn(id, effect.color);
  syncCosmeticsLive();
}
window.setEquippedEffect = setEquippedEffect;

async function setEquippedTag(id) {
  const tag = id === 'none' ? { id:'none', name:'No tag', price:0 } : EFFECT_MAP.get(id);
  if (!tag || (id !== 'none' && tag.scope !== 'tag')) return;
  document.getElementById('effects-popover').style.display = 'none';
  const owned = new Set(Array.isArray(S.user?.ownedTags) ? S.user.ownedTags : ['none']);

  try {
    let data;
    if (!owned.has(id) && id !== 'none') {
      if (!confirm(`Buy the ${tag.name} tag for ${tag.price} coins? (You have ${S.user?.coins ?? 0})`)) return;
      data = await api(`/api/tlk/chat-tags/${encodeURIComponent(id)}/purchase`, { method:'POST' });
      toast(`Purchased & equipped tag: ${tag.name}`, 'success');
    } else {
      data = await api('/api/tlk/chat-tags/equip', { method:'POST', body:{ tagId:id } });
      toast(id === 'none' ? 'Tag removed' : `Tag: ${tag.name}`, 'success');
    }
    if (data?.user) setUser({ ...(S.user || {}), ...data.user });
    S.equippedTag = data?.user?.equippedTag || id;
    syncCosmeticsLive();
  } catch (err) {
    toast(err.data?.msg || 'Could not update tag', 'error');
  }
}
window.setEquippedTag = setEquippedTag;

async function setEquippedBanner(id) {
  const banner = id === 'none' ? { id:'none', name:'No banner', price:0 } : EFFECT_MAP.get(id);
  if (!banner || (id !== 'none' && banner.scope !== 'banner')) return;
  document.getElementById('effects-popover').style.display = 'none';
  const owned = new Set(Array.isArray(S.user?.ownedBanners) ? S.user.ownedBanners : ['none']);
  try {
    let data;
    if (!owned.has(id) && id !== 'none') {
      if (!confirm(`Buy the ${banner.name} member banner for ${banner.price} coins? (You have ${S.user?.coins ?? 0})`)) return;
      data = await api(`/api/tlk/chat-banners/${encodeURIComponent(id)}/purchase`, { method:'POST' });
      toast(`Purchased & equipped banner: ${banner.name}`, 'success');
    } else {
      data = await api('/api/tlk/chat-banners/equip', { method:'POST', body:{ bannerId:id } });
      toast(id === 'none' ? 'Member banner removed' : `Member banner: ${banner.name}`, 'success');
    }
    if (data?.user) setUser({ ...(S.user || {}), ...data.user });
    S.equippedBanner = data?.user?.equippedBanner || id;
    syncCosmeticsLive();
    void fetchPresence();
  } catch (error) {
    toast(error.data?.msg || 'Could not update member banner', 'error');
  }
}
window.setEquippedBanner = setEquippedBanner;

async function setEquippedAvatarEffect(id, options = {}) {
  const effect = id === 'none' ? { id:'none', name:'No avatar ring', price:0 } : EFFECT_MAP.get(id);
  if (!effect || (id !== 'none' && effect.scope !== 'avatar')) return;
  document.getElementById('effects-popover').style.display = 'none';
  const owned = new Set(Array.isArray(S.user?.ownedAvatarEffects) ? S.user.ownedAvatarEffects : ['none']);
  try {
    let data;
    if (!owned.has(id) && id !== 'none') {
      if (!options.confirmed && !confirm(`Buy the ${effect.name} avatar ring for ${effect.price} coins? (You have ${S.user?.coins ?? 0})`)) return;
      data = await api(`/api/chat-avatar-effects/${encodeURIComponent(id)}/purchase`, { method:'POST' });
      toast(`Purchased & equipped avatar ring: ${effect.name}`, 'success');
    } else {
      data = await api('/api/chat-avatar-effects/equip', { method:'POST', body:{ effectId:id } });
      toast(id === 'none' ? 'Avatar ring removed' : `Avatar ring: ${effect.name}`, 'success');
    }
    if (data?.user) setUser({ ...(S.user || {}), ...data.user });
    S.equippedAvatarEffect = data?.user?.equippedAvatarEffect || id;
    localStorage.setItem('equippedAvatarEffect', S.equippedAvatarEffect);
    syncCosmeticsLive();
    void renderCosmetics();
  } catch (error) {
    toast(error.data?.msg || 'Could not update avatar ring', 'error');
  }
}
window.setEquippedAvatarEffect = setEquippedAvatarEffect;
window.setEquippedAvatarEffectFromCosmetics = setEquippedAvatarEffect;

function updateEffectBtn(id, color) {
  const btn = document.getElementById('effect-btn');
  if (btn) btn.style.color = (!id || id === 'none') ? '' : (color || '#0099ff');
}

async function activateRoomEffect(id) {
  if (!S.room) return;
  document.getElementById('effects-popover').style.display = 'none';
  const effect = getEffectMeta(id);
  if (!effect || effect.scope !== 'room') return;
  if (!await confirmAction(`Activate ${effect.name} for ${effect.price} coins? You have ${S.user?.coins ?? 0}.`, 'Activate')) return;

  try {
    const data = await chatApi(`/api/tlk/chat-effects/rooms/${encodeURIComponent(S.room)}/activate`, {
      method: 'POST', body: { effectId: id }
    });
    if (data.user) setUser({ ...(S.user || {}), ...data.user });
    toast(`${effect.name} activated!`, 'success');
  } catch (err) {
    toast(err.data?.msg || 'Failed to activate effect', 'error');
  }
}

async function refreshMessageEffectState() {
  try {
    const data = await api('/api/tlk/chat-effects');
    if (Array.isArray(data?.effects)) {
      const serverIds = new Set(data.effects.map(effect => String(effect?.id || '').trim().toLowerCase()).filter(Boolean));
      for (let index = EFFECTS.length - 1; index >= 0; index -= 1) {
        const effect = EFFECTS[index];
        if (effect.scope === 'tag' && !serverIds.has(effect.id)) {
          EFFECT_MAP.delete(effect.id);
          EFFECTS.splice(index, 1);
        }
      }
      for (const serverEffect of data.effects) {
        const id = String(serverEffect?.id || '').trim().toLowerCase();
        let localEffect = EFFECT_MAP.get(id);
        if (!localEffect && serverEffect?.scope === 'tag' && /^tag_[a-z0-9_]+$/.test(id)) {
          localEffect = { id, name:String(serverEffect.name || 'Tag'), price:0, scope:'tag', color:'#a1a1aa', custom:serverEffect.custom === true };
          EFFECTS.push(localEffect);
          EFFECT_MAP.set(id, localEffect);
        }
        if (!localEffect) continue;
        const price = Number(serverEffect.price);
        if (Number.isFinite(price) && price >= 0) localEffect.price = price;
        if (serverEffect.name) localEffect.name = String(serverEffect.name);
        if (/^#[0-9a-f]{6}$/i.test(String(serverEffect.color || ''))) localEffect.color = String(serverEffect.color).toLowerCase();
        if (serverEffect.description) localEffect.description = String(serverEffect.description);
        localEffect.effect = String(serverEffect.effect || 'none').toLowerCase();
        localEffect.source = String(serverEffect.source || (serverEffect.custom ? 'custom' : 'built-in'));
        if (serverEffect.custom === true) localEffect.custom = true;
      }
      syncDynamicTagStyles();
    }
    if (!data?.user) return;
    setUser({ ...(S.user || {}), ...data.user });
    S.equippedEffect = data.user.equippedEffect || 'none';
    S.equippedTag = data.user.equippedTag || 'none';
    S.equippedBanner = data.user.equippedBanner || 'none';
    S.equippedAvatarEffect = data.user.equippedAvatarEffect || 'none';
    S.equippedProfileEffect = data.user.equippedProfileEffect || 'none';
    localStorage.setItem('equippedEffect', S.equippedEffect);
    localStorage.setItem('equippedAvatarEffect', S.equippedAvatarEffect);
  } catch {}
}
window.activateRoomEffect = activateRoomEffect;

async function activateGlobalEffect(id, messageOverride = null) {
  document.getElementById('effects-popover').style.display = 'none';
  const effect = EFFECT_MAP.get(id);
  if (!effect || effect.scope !== 'global') return;
  const message = messageOverride === null
    ? prompt('Enter the public message to show everyone (280 characters max):')
    : messageOverride;
  if (message === null) return;
  const cleanMessage = String(message).trim();
  if (!cleanMessage) { toast('Enter a message', 'error'); return; }
  if (cleanMessage.length > 280) { toast('Public messages are limited to 280 characters', 'error'); return; }
  if (!confirm(`Broadcast this message for ${effect.price} coins? (You have ${S.user?.coins ?? 0})`)) return;
  try {
    const data = await chatApi('/api/tlk/chat-effects/global/activate', {
      method: 'POST',
      body: { effectId: id, message: cleanMessage }
    });
    if (data.user) setUser({ ...(S.user || {}), ...data.user });
    toast('Public message broadcast!', 'success');
  } catch (err) {
    const blocked = err.data?.moderation?.blocked;
    const reason = err.data?.msg || 'Failed to broadcast public message';
    const category = err.data?.moderation?.category || '';
    if (blocked) {
      showCenteredModerationNotice(reason, category);
    } else {
      toast(reason, 'error');
    }
  }
}
window.activateGlobalEffect = activateGlobalEffect;

function showCenteredModerationNotice(reason, category) {
  const overlay = document.createElement("div");
  overlay.id = "moderation-notice";
  overlay.style.cssText = "position:fixed;inset:0;z-index:10030;display:flex;align-items:center;justify-content:center;padding:24px;background:rgba(0,0,0,.65);backdrop-filter:blur(6px);animation:public-message-in .25s ease-out";
  overlay.onclick = function(e) { if (e.target === overlay) overlay.remove(); };
  const card = document.createElement("div");
  card.style.cssText = "width:min(440px,90vw);padding:28px 32px;border:1px solid rgba(248,113,113,.35);border-radius:18px;background:linear-gradient(145deg,rgba(28,10,10,.96),rgba(14,4,4,.96));box-shadow:0 0 60px rgba(248,113,113,.25);text-align:center";
  const safeReason = String(reason || "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  const safeCat = String(category || "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  card.innerHTML = '<div style="font-size:12px;font-weight:800;letter-spacing:.2em;color:#f87171;margin-bottom:14px;text-transform:uppercase">Message Blocked</div>' +
    '<div style="font-size:17px;font-weight:700;color:#f8fafc;line-height:1.4;margin-bottom:10px">' + safeReason + '</div>' +
    (safeCat ? '<div style="font-size:11px;color:#71717a;margin-bottom:8px;text-transform:uppercase;letter-spacing:.05em">' + safeCat + '</div>' : '') +
    '<div style="font-size:13px;font-weight:600;color:#4ade80;margin-bottom:18px"><span class="material-icons-round" style="font-size:15px;vertical-align:-3px;margin-right:5px">check_circle</span>You were not charged \u2014 no coins spent</div>' +
    '<button onclick="document.getElementById(\'moderation-notice\')?.remove()" style="background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);color:#a1a1aa;border-radius:10px;padding:10px 28px;font-size:13px;font-weight:600;cursor:pointer;transition:background .2s,color .2s;font-family:inherit" onmouseenter="this.style.background=\'rgba(255,255,255,.12)\';this.style.color=\'#e4e4e7\'" onmouseleave="this.style.background=\'rgba(255,255,255,.06)\';this.style.color=\'#a1a1aa\'">Dismiss</button>';
  overlay.appendChild(card);
  document.body.appendChild(overlay);
}

// ─── File Upload ──────────────────────────────────────────────────────────────
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif']);

function uploadImageWithProgress(form, token, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/upload/image');
    if (token) xhr.setRequestHeader('x-auth-token', token);
    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable) return;
      const percent = Math.max(1, Math.min(95, Math.round((event.loaded / event.total) * 100)));
      onProgress?.(percent);
    };
    xhr.onload = () => {
      let data = {};
      try { data = JSON.parse(xhr.responseText || '{}'); } catch { data = {}; }
      if (xhr.status >= 200 && xhr.status < 300) return resolve(data);
      const error = new Error(data?.msg || `Upload failed (${xhr.status})`);
      error.data = data;
      error.status = xhr.status;
      reject(error);
    };
    xhr.onerror = () => reject(new Error('Upload failed. Check your connection and try again.'));
    xhr.onabort = () => reject(new Error('Upload cancelled'));
    xhr.send(form);
  });
}

async function handleFileSelect(file) {
  if (!file) return;
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) { toast('Only images are supported (JPEG, PNG, GIF, WebP, AVIF)', 'error'); return; }
  const maxSizeBytes = 5 * 1024 * 1024;
  if (file.size > maxSizeBytes) { toast('Image too large (max 5MB)', 'error'); return; }
  if (S.pendingFiles.length >= 4) { toast('You can attach up to 4 images', 'warn'); return; }

  const uploadId = `${Date.now()}:${Math.random().toString(36).slice(2)}`;
  S.pendingFiles.push({ name: file.name, type: file.type, file, uploading: true, uploadId, progress: 1, status: 'Preparing upload...', url: null });
  renderAttachmentPreview();

  try {
    const form = new FormData();
    form.append('image', file);
    const token = S.token || localStorage.getItem('token');
    const data = await uploadImageWithProgress(form, token, (progress) => {
      const item = S.pendingFiles.find(entry => entry.uploadId === uploadId);
      if (!item) return;
      item.progress = Math.max(Number(item.progress || 0), progress);
      item.status = item.progress >= 95 ? 'Checking image...' : `Uploading... ${item.progress}%`;
      renderAttachmentPreview();
    });
    if (data?.moderation) console.log('[image moderation]', { url: data.url, ...data.moderation });
    const item = S.pendingFiles.find(entry => entry.uploadId === uploadId);
    if (!item) return;
    Object.assign(item, { url: data.url, uploading: false, error: false, progress: 100, status: 'Ready' });
    renderAttachmentPreview();
  } catch (err) {
    if (err?.data?.moderation) console.log('[image moderation]', err.data.moderation);
    const rating = err?.data?.moderation?.rating ? ` (${err.data.moderation.rating})` : '';
    const detail = err?.data?.detail ? ` - ${String(err.data.detail).slice(0, 120)}` : '';
    const errorMessage = `${err.message || 'Upload failed'}${rating}${detail}`;
    toast(errorMessage, 'error');
    const item = S.pendingFiles.find(entry => entry.uploadId === uploadId);
    if (item) Object.assign(item, { uploading: false, error: true, progress: 100, status: errorMessage });
    renderAttachmentPreview();
    const fi = document.getElementById('file-input');
    if (fi) fi.value = '';
  }
}

async function handleFilesSelected(files) {
  const available = Math.max(0, 4 - S.pendingFiles.length);
  const selected = Array.from(files || []).slice(0, available);
  if (Array.from(files || []).length > available) toast('Only the first available images were added', 'warn');
  await Promise.all(selected.map(handleFileSelect));
}

function imageFilesFromClipboard(event) {
  const items = Array.from(event?.clipboardData?.items || []);
  const files = [];
  for (const item of items) {
    if (item?.kind !== 'file' || !String(item.type || '').startsWith('image/')) continue;
    const file = item.getAsFile();
    if (!file) continue;
    const ext = String(file.type || '').split('/')[1] || 'png';
    const name = file.name && file.name !== 'image.png'
      ? file.name
      : `pasted-image-${Date.now()}.${ext.replace('jpeg', 'jpg')}`;
    files.push(new File([file], name, { type: file.type || 'image/png', lastModified: Date.now() }));
  }
  return files;
}

async function handleMessagePaste(event) {
  const files = imageFilesFromClipboard(event);
  if (!files.length) return;
  event.preventDefault();
  await handleFilesSelected(files);
}

function renderAttachmentPreview() {
  const preview = document.getElementById('attachment-preview');
  if (!preview) return;
  if (!S.pendingFiles.length) { preview.style.display = 'none'; preview.innerHTML = ''; return; }
  preview.style.display = 'grid';
  preview.innerHTML = S.pendingFiles.map(item => {
    const progress = Math.max(0, Math.min(100, Number(item.progress || 0)));
    const previewUrl = item.url || (item.file ? URL.createObjectURL(item.file) : '');
    return `<div class="attachment-card${item.error ? ' has-error' : ''}">
      <div class="attachment-thumb">${previewUrl ? `<img src="${esc(previewUrl)}" alt="" onload="${item.url ? '' : 'URL.revokeObjectURL(this.src)'}">` : '<span class="material-icons-round">image</span>'}</div>
      <div class="attachment-meta">
        <span class="attachment-name">${esc(item.name)}</span>
        <span class="attachment-status">${esc(item.status || 'Ready')}</span>
        ${item.uploading ? `<span class="attachment-progress"><i style="width:${progress}%"></i></span>` : ''}
      </div>
      ${item.error ? `<button type="button" class="icon-btn" onclick="retryAttachment('${esc(item.uploadId)}')" title="Retry"><span class="material-icons-round">refresh</span></button>` : ''}
      <button type="button" class="icon-btn" onclick="clearAttachment('${esc(item.uploadId)}')" title="Remove"><span class="material-icons-round">close</span></button>
    </div>`;
  }).join('');
}

async function retryAttachment(uploadId) {
  const item = S.pendingFiles.find(entry => entry.uploadId === uploadId);
  if (!item?.file) return;
  S.pendingFiles = S.pendingFiles.filter(entry => entry.uploadId !== uploadId);
  await handleFileSelect(item.file);
}
window.retryAttachment = retryAttachment;

function clearAttachment(uploadId = '') {
  S.pendingFiles = uploadId ? S.pendingFiles.filter(item => item.uploadId !== uploadId) : [];
  renderAttachmentPreview();
  const fi = document.getElementById('file-input');
  if (fi) fi.value = '';
}
window.clearAttachment = clearAttachment;

// ─── Slash Commands ───────────────────────────────────────────────────────────
const SLASH_COMMANDS = [
  { usage: '/help', insert: '/help', desc: 'Show every command', roles: ['user','mod','admin','owner'] },
  { usage: '/public <message>', insert: '/public ', desc: 'Broadcast a public message (150 coins)', roles: ['user','mod','admin','owner'] },
  { usage: '/slowmode <seconds>', insert: '/slowmode ', desc: 'Set slowmode for this room; use 0 or off to disable', roles: ['admin','owner'] },
  { usage: '/slowmode global <seconds>', insert: '/slowmode global ', desc: 'Set slowmode across public rooms', roles: ['admin','owner'] },
  { usage: '/warn <user> [reason]', insert: '/warn ', desc: 'Warn a user', roles: ['admin','owner'] },
  { usage: '/ban <user> [reason]', insert: '/ban ', desc: 'Ban a user from this room', roles: ['admin','owner'] },
  { usage: '/unban <user>', insert: '/unban ', desc: 'Remove a room ban', roles: ['admin','owner'] },
  { usage: '/clearwarns <user>', insert: '/clearwarns ', desc: 'Clear a user’s warnings', roles: ['admin','owner'] },
  { usage: '/delete <messageId>', insert: '/delete ', desc: 'Delete a message by ID', roles: ['admin','owner'] },
  { usage: '/clearchat [reason]', insert: '/clearchat ', desc: 'Clear the current room', roles: ['owner'] },
  { usage: '/banfromall <user> [reason]', insert: '/banfromall ', desc: 'Ban a user globally', roles: ['owner'] },
  { usage: '/ai <siteId> <prompt>', insert: '/ai ', desc: 'Summon an AI response', roles: ['owner'] }
];

function getVisibleSlashCommands() {
  const role = String(S.user?.role || 'user').toLowerCase();
  return SLASH_COMMANDS.filter((command) => command.roles.includes(role));
}

function renderSlashCommandPanel(value = '') {
  const panel = document.getElementById('command-panel');
  if (!panel) return;
  const raw = String(value || '').trimStart();
  if (!raw.startsWith('/') || raw.includes('\n')) {
    panel.style.display = 'none';
    panel.innerHTML = '';
    return;
  }
  const query = raw.toLowerCase();
  const commands = getVisibleSlashCommands().filter((command) =>
    command.usage.toLowerCase().startsWith(query) || command.insert.trim().toLowerCase().startsWith(query)
  );
  if (!commands.length) {
    panel.style.display = 'none';
    panel.innerHTML = '';
    return;
  }
  panel.innerHTML = commands.map((command, index) => `
    <button type="button" class="command-item" data-command-index="${index}">
      <span class="command-usage">${esc(command.usage)}</span>
      <span class="command-desc">${esc(command.desc)}</span>
    </button>
  `).join('');
  panel.style.display = 'block';
  panel.querySelectorAll('[data-command-index]').forEach((button) => {
    button.addEventListener('click', () => {
      const command = commands[Number(button.dataset.commandIndex)];
      const input = document.getElementById('message-input');
      if (!command || !input) return;
      input.value = command.insert;
      panel.style.display = 'none';
      input.focus();
    });
  });
}

async function handleSlashCommand(text) {
  const parts = text.slice(1).trim().split(/\s+/);
  const cmd = parts[0].toLowerCase();
  const args = parts.slice(1);

  if (cmd === 'help' || cmd === 'commands' || cmd === 'modhelp') {
    const cmds = [
      '/help — Show commands',
      '/ai <siteId> <prompt> — AI response (owner)',
      '/public <message> — Broadcast a public message (150 coins)',
      '/warn <user> [reason] — Warn user (mod)',
      '/ban <user> [reason] — Ban from room (mod)',
      '/banfromall <user> [reason] — Global ban (owner)',
      '/unban <user> — Unban user (owner)',
      '/clearwarns <user> — Clear warnings (mod)',
      '/slowmode <seconds|off> — Room slowmode (admin/owner)',
      '/slowmode global <seconds|off> — Global slowmode (admin/owner)',
      '/delete <messageId> — Delete message by ID (admin/owner)',
      '/clearchat — Clear room (owner)',
    ];
    openModal(`<h3 style="font-size:16px;font-weight:700;color:#fff;margin:0 0 14px">Available Commands</h3>
      <div style="display:flex;flex-direction:column;gap:5px;font-size:12px;color:#a1a1aa;font-family:monospace">
        ${cmds.map(c=>`<div>${esc(c)}</div>`).join('')}
      </div>
      <button class="modal-btn modal-btn-ghost" onclick="closeModal()" style="width:100%;margin-top:14px">Close</button>`);
    return true;
  }

  if (cmd === 'ai') {
    const siteId = args[0]; const prompt = args.slice(1).join(' ');
    if (!siteId || !prompt) { toast('Usage: /ai <siteId> <prompt>', 'warn'); return true; }
    try {
      await api('/api/network/ai/summon', { method: 'POST', body: { siteId, prompt, room: S.room } });
      toast('AI summoned!', 'success');
    } catch (err) { toast(err.data?.msg || 'AI summon failed', 'error'); }
    return true;
  }

  if (cmd === 'public' || cmd === 'announce' || cmd === 'global') {
    const messageArgs = cmd === 'global' && args[0]?.toLowerCase() === 'public_message' ? args.slice(1) : args;
    const message = messageArgs.join(' ').trim();
    if (!message) { toast('Usage: /public <message>', 'warn'); return true; }
    await activateGlobalEffect('public_message', message);
    return true;
  }

  const modActions = { warn:'warn', ban:'ban', banfromall:'banfromall', unban:'unban', clearwarns:'clearwarns' };
  if (modActions[cmd]) {
    const target = args[0]; const reason = args.slice(1).join(' ') || 'Moderator action';
    if (!target) { toast(`Usage: /${cmd} <user>`, 'warn'); return true; }
    try {
      await api('/api/network/mod/actions', { method: 'POST', body: { action: modActions[cmd], target, reason, room: S.room } });
      toast(`Action /${cmd} applied to ${target}`, 'success');
    } catch (err) { toast(err.data?.msg || 'Action failed', 'error'); }
    return true;
  }

  if (cmd === 'slowmode-room' || cmd === 'roomslowmode' || (cmd === 'slowmode' && args[0]?.toLowerCase() !== 'global')) {
    const rawSeconds = cmd === 'slowmode' && args[0]?.toLowerCase() === 'room' ? args[1] : args[0];
    const seconds = String(rawSeconds || '').toLowerCase() === 'off' ? 0 : Number(rawSeconds);
    if (!Number.isFinite(seconds)) { toast('Usage: /slowmode-room <seconds>', 'warn'); return true; }
    try {
      await api('/api/network/mod/actions', { method: 'POST', body: { action: 'slowmode_room', seconds, room: S.room } });
      toast(`Room slowmode set to ${seconds}s`, 'success');
    } catch (err) { toast(err.data?.msg || 'Failed', 'error'); }
    return true;
  }

  if (cmd === 'slowmode-global' || cmd === 'globalslowmode' || cmd === 'global-slowmode' || (cmd === 'slowmode' && args[0]?.toLowerCase() === 'global')) {
    const rawSeconds = cmd === 'slowmode' ? args[1] : args[0];
    const seconds = String(rawSeconds || '').toLowerCase() === 'off' ? 0 : Number(rawSeconds);
    if (!Number.isFinite(seconds)) { toast('Usage: /slowmode-global <seconds>', 'warn'); return true; }
    try {
      await api('/api/network/mod/actions', { method: 'POST', body: { action: 'slowmode_global', seconds } });
      toast(`Global slowmode set to ${seconds}s`, 'success');
    } catch (err) { toast(err.data?.msg || 'Failed', 'error'); }
    return true;
  }

  if (cmd === 'delete') {
    const messageId = String(args[0] || '').trim();
    if (!messageId) { toast('Usage: /delete <messageId>', 'warn'); return true; }
    await deleteMessage(messageId);
    return true;
  }

  if (cmd === 'clearchat' || cmd === 'clear-chat' || cmd === 'clear') {
    const reason = args.join(' ') || 'Owner action';
    try {
      await api('/api/network/mod/actions', { method: 'POST', body: { action: 'clearchat', room: S.room, reason } });
      toast('Chat cleared', 'success');
    } catch (err) { toast(err.data?.msg || 'Failed', 'error'); }
    return true;
  }

  toast(`Unknown command: /${cmd}. Type /help for a list.`, 'warn');
  return true;
}

// ─── Send Message ─────────────────────────────────────────────────────────────
function queueOutgoingMessage(job) {
  S.sendQueue.push(job);
  void processOutgoingQueue();
}

async function processOutgoingQueue() {
  if (S.sendQueueProcessing) return;
  S.sendQueueProcessing = true;
  try {
    while (S.sendQueue.length) {
      const job = S.sendQueue[0];
      try {
        const sendData = await chatApi(`/api/tlk/rooms/${encodeURIComponent(job.roomId)}/messages`, {
          method: 'POST',
          body: {
            body: job.finalBody,
            clientId: getClientId(),
            deviceId: getDeviceId(),
            clientNonce: job.clientNonce,
            reply: job.reply,
            attachments: job.attachments,
            equippedEffect: job.equippedEffect,
            equippedAvatarEffect: job.equippedAvatarEffect,
          },
        });
        if (String(S.room) === String(job.roomId)) {
          handleRealtimeMessage({ roomId: job.roomId, message: ownOutgoingMessage(sendData) });
        }
        if (sendData?.reward?.balance != null && S.user) {
          setUser({ ...S.user, coins: sendData.reward.balance });
          showCoinReward(sendData.reward.coinsEarned);
        }
        startSlowmodeCooldown();
      } catch (err) {
        if (String(S.room) === String(job.roomId)) {
          S.lastMsgs = S.lastMsgs.filter((message) =>
            String(message.clientNonce || message.client_nonce || '') !== job.clientNonce
          );
          renderMessages(S.lastMsgs);
          const input = document.getElementById('message-input');
          if (input && !input.value.trim() && S.sendQueue.length === 1) {
            input.value = job.rawText;
            input.style.height = Math.min(input.scrollHeight, 120) + 'px';
            S.pendingFiles = job.filesBeforeSend;
            renderAttachmentPreview();
            if (job.reply) setReply(job.reply, { saveDraft: false });
            saveCurrentDraft();
          }
        }
        toast(err.data?.msg || 'Failed to send message', 'error');
      } finally {
        S.sendQueue.shift();
      }
    }
  } finally {
    S.sendQueueProcessing = false;
  }
}

async function sendMessage() {
  const input = document.getElementById('message-input');
  if (!input || !S.room) return;
  if (S.lockdownActive && S.roomMeta?.type === 'channel' && !isStaff()) {
    toast('Global lockdown is active. Only staff can send in public channels.', 'error');
    return;
  }
  const rawText = input.value;
  const body = rawText.trim();
  const readyFiles = S.pendingFiles.filter(file => file.url);
  const failedFiles = S.pendingFiles.filter(file => file.error);
  if (!body && !readyFiles.length) return;
  if (S.pendingFiles.some(file => file.uploading)) { toast('Images are still uploading, please wait', 'error'); return; }
  if (failedFiles.length) { toast('Remove or retry failed images before sending', 'error'); return; }

  if (body.startsWith('/')) {
    const handled = await handleSlashCommand(body);
    if (handled) {
      input.value = '';
      input.style.height = 'auto';
      stopTypingNow();
      clearRoomDraft();
      renderSlashCommandPanel('');
      return;
    }
  }

  let finalBody = body;
  const attachments = readyFiles.map(file => ({ url: file.url, name: file.name, type: file.type }));
  if (attachments.length) finalBody = [finalBody, ...attachments.map(file => `[img:${file.url}]`)].filter(Boolean).join('\n');
  const reply = S.replyTarget ? buildReplySnapshot(S.replyTarget) : null;
  const filesBeforeSend = [...S.pendingFiles];

  input.value = '';
  input.style.height = 'auto';
  stopTypingNow();
  clearReply({ saveDraft: false });
  clearAttachment();
  clearRoomDraft();

  const clientNonce = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  const optimisticMessage = ownOutgoingMessage({
    id: `pending:${clientNonce}`,
    clientNonce,
    body: finalBody,
    reply,
    attachments,
    date: new Date().toISOString(),
    __localSequence: ++S.localMessageSequence,
    __pending: true
  });
  handleRealtimeMessage({ roomId: S.room, message: optimisticMessage });
  queueOutgoingMessage({
    roomId: S.room,
    rawText,
    finalBody,
    clientNonce,
    reply,
    attachments,
    filesBeforeSend,
    equippedEffect: S.equippedEffect !== 'none' ? S.equippedEffect : undefined,
    equippedAvatarEffect: S.equippedAvatarEffect !== 'none' ? S.equippedAvatarEffect : undefined,
  });
}

// ─── Presence ─────────────────────────────────────────────────────────────────
const ROLE_RANK = { owner: 0, admin: 1, mod: 2, seller: 3, user: 4, '': 5 };

function renderMemberList(users = []) {
  if (!users.length) return '<div style="font-size:12px;color:#71717a;padding:6px 10px">No one online</div>';
  const sorted = [...users].sort((a, b) => {
    const ra = ROLE_RANK[String(a.role || '').toLowerCase()] ?? 5;
    const rb = ROLE_RANK[String(b.role || '').toLowerCase()] ?? 5;
    if (ra !== rb) return ra - rb;
    return String(a.username || '').localeCompare(String(b.username || ''));
  });
  const speakingNames = new Set([...S.voice.peers.values()].filter(peer => peer.speaking).map(peer => String(peer.name || '').toLowerCase()));
  if (S.voice.localSpeaking) speakingNames.add(myUsername().toLowerCase());
  const bannerIds = new Set(EFFECTS.filter(effect => effect.scope === 'banner').map(effect => effect.id));
  return sorted.map(u => {
    const rawName = String(u.username || 'Unknown');
    const name = esc(rawName);
    const speaking = speakingNames.has(rawName.toLowerCase());
    const bannerId = bannerIds.has(String(u.equippedBanner || '')) ? String(u.equippedBanner) : '';
    const bannerClass = bannerId ? ` member-banner-${bannerId.slice(7)}` : '';
    const badges = roleBadge(u);
    const isSelf = rawName.toLowerCase() === myUsername().toLowerCase();
    const status = ['online', 'idle', 'dnd'].includes(String(u.status || '').toLowerCase()) ? String(u.status).toLowerCase() : 'online';
    const customStatus = String(u.customStatus || '').trim().slice(0, 80);
    const memberAvatarEffect = validAvatarEffectId(u.equippedAvatarEffect || (isSelf ? S.equippedAvatarEffect : 'none'));
    const memberAvatar = u.avatar || (isSelf ? S.user?.avatar || S.user?.avatar_url || null : null);
    return `<button type="button" class="member-item${bannerClass}${speaking ? ' speaking' : ''}" data-member-name="${name}" onclick="openUserCardFromElement(this)">
      <span class="member-avatar-status">${avatarEl(u.username || '?', 28, memberAvatar, memberAvatarEffect)}<i class="presence-dot status-${status}" title="${status === 'dnd' ? 'Do not disturb' : status}"></i></span>
      <div style="flex:1;min-width:0">
        <div style="display:flex;align-items:center;gap:4px;font-size:13px;font-weight:500;color:#e4e4e7;white-space:nowrap;overflow:hidden"><span style="overflow:hidden;text-overflow:ellipsis">${name}</span>${speaking ? '<span class="material-icons-round" title="Speaking" style="font-size:13px;color:#4ade80">graphic_eq</span>' : ''}</div>
        ${badges ? `<div style="display:flex;flex-wrap:wrap;gap:2px;margin-top:1px">${badges}</div>` : ''}
        ${customStatus ? `<div class="member-custom-status">${esc(customStatus)}</div>` : ''}
        <div style="display:flex;align-items:center;gap:3px;margin-top:2px;color:#fbbf24;font-size:10px"><span class="material-icons-round" style="font-size:11px">toll</span>${esc(String(u.coins ?? 0))}</div>
      </div>
    </button>`;
  }).join('');
}

function renderCurrentMemberList() {
  const ml = document.getElementById('members-list');
  if (!ml || !S.room) return;
  const users = Array.isArray(S.currentMembers) ? S.currentMembers : [];
  const header = `<div style="font-size:11px;font-weight:600;color:#71717a;letter-spacing:.05em;padding:8px 10px 4px;text-transform:uppercase">${users.length} Online</div>`;
  ml.innerHTML = header + renderMemberList(users);
}

function syncSelfMemberAvatarEffect() {
  const selfName = myUsername().toLowerCase();
  if (!selfName || !Array.isArray(S.currentMembers)) return;
  let found = false;
  S.currentMembers = S.currentMembers.map((member) => {
    if (String(member?.username || '').toLowerCase() !== selfName) return member;
    found = true;
    return {
      ...member,
      status: S.presenceStatus,
      customStatus: S.customStatus,
      avatar: member.avatar || S.user?.avatar || S.user?.avatar_url || null,
      equippedAvatarEffect: S.equippedAvatarEffect || 'none',
      equippedEffect: S.equippedEffect || member.equippedEffect || 'none',
      equippedTag: S.equippedTag || member.equippedTag || 'none',
      equippedBanner: S.equippedBanner || member.equippedBanner || 'none',
      equippedProfileEffect: S.equippedProfileEffect || member.equippedProfileEffect || 'none'
    };
  });
  if (!found && S.user) {
    S.currentMembers.push({
      username: S.user.username || S.user.name || selfName,
      userId: S.user._id || S.user.id || '',
      avatar: S.user.avatar || S.user.avatar_url || null,
      role: S.user.role || 'user',
      is_owner: !!S.user.is_owner,
      is_premium: !!S.user.is_premium,
      is_booster: !!S.user.is_booster,
      coins: S.user.coins ?? 0,
      status: S.presenceStatus,
      customStatus: S.customStatus,
      equippedAvatarEffect: S.equippedAvatarEffect || 'none',
      equippedEffect: S.equippedEffect || 'none',
      equippedTag: S.equippedTag || 'none',
      equippedBanner: S.equippedBanner || 'none',
      equippedProfileEffect: S.equippedProfileEffect || 'none'
    });
  }
  renderCurrentMemberList();
}

function syncCosmeticsLive() {
  syncSelfMemberAvatarEffect();
  S.socket?.emit('presence_ping', presencePayload());
  renderMessages(S.lastMsgs);
}

function effectPreviewCopy(e = {}) {
  const copy = {
    none: 'No extra style',
    glass: 'Frosted shine',
    neon: 'Purple glow',
    gradient: 'Blue violet',
    dark_smoke: 'Soft smoke',
    electric: 'Lightning edge',
    fire: 'Burning border',
    ice: 'Frozen shards',
    matrix_msg: 'Code rain',
    galaxy: 'Star field',
    rainbow_border: 'Color ring',
    aurora: 'Northern lights',
    gold: 'Gold shine',
    cyberpunk: 'Circuit frame',
    topographic: 'Contour lines',
    toxic_slime: 'Green drips',
    bubble: 'Glass bubbles',
    ink_splash: 'Ink texture',
    holographic: 'Iridescent',
    wood: 'Wood grain',
    carbon_fiber: 'Woven carbon',
    hearts: 'Soft hearts',
    flashbang: 'Bright blast',
    scramble: 'Glitch text',
    matrix: 'Code dissolve',
    blackhole: 'Green gravity',
    earthquake: 'Brown shatter',
    nebula: 'Purple warp',
    spiral: 'Vault pull',
    prism: 'Crystal burst',
    meteor: 'Impact blast',
    rift: 'Time portal',
    public_message: 'Broadcast'
  };
  return copy[e.id] || 'Preview';
}

function effectPreviewHtml(e = {}) {
  const id = esc(e.id || 'none');
  const label = e.scope === 'message' && e.id !== 'none' ? 'Aa' : '';
  return `<span class="effect-preview effect-preview-${id}" aria-hidden="true"><i></i><b>${label}</b><em></em></span>`;
}

function validProfileEffectId(id = '') {
  const clean = String(id || '').trim().toLowerCase();
  return EFFECT_MAP.get(clean)?.scope === 'profile' ? clean : 'none';
}

const PROFILE_EFFECT_ASSET_DIRS = Object.freeze({
  profile_crystal_bloom: 'crystal-bloom-realistic',
  profile_infinity_aquarium: 'infinity-aquarium',
  profile_living_city: 'living-city',
  profile_ancient_library: 'ancient-library',
  profile_clockwork_factory: 'clockwork-factory',
  profile_greenhouse: 'greenhouse',
  profile_ice_cathedral: 'ice-cathedral',
  profile_observatory: 'observatory',
  profile_ink_dimension: 'ink-dimension',
  profile_dragon_forge: 'dragon-forge',
  profile_museum_heist: 'museum-heist',
});

function profileEffectStaticPreview(id = '') {
  const clean = validProfileEffectId(id);
  const assetDir = PROFILE_EFFECT_ASSET_DIRS[clean];
  if (!assetDir) return '';
  return `<span class="profile-art-shop-preview" aria-hidden="true"><img src="/kchat/assets/profile-effects/${assetDir}/composite-preview.png" alt="" draggable="false" decoding="async" loading="lazy"></span>`;
}

function profileEffectLayer(id = '') {
  const clean = validProfileEffectId(id);
  if (clean === 'none') return '';
  const durationMs = Math.max(500, Math.min(2000, Number(EFFECT_MAP.get(clean)?.durationMs || 1200)));
  const assetDir = PROFILE_EFFECT_ASSET_DIRS[clean];
  if (assetDir) {
    const slug = clean.slice(8);
    const assetRoot = `/kchat/assets/profile-effects/${assetDir}`;
    const layer = (name, className) => `<img class="profile-art-layer ${className}" src="${assetRoot}/${name}.png" alt="" draggable="false" decoding="async">`;
    const mobileLayer = (position, name, className) => `<span class="profile-art-mobile-piece profile-art-mobile-${position}">${layer(name, `${className} profile-art-mobile-layer`)}</span>`;
    return `<span class="quick-profile-fx quick-profile-fx-${esc(slug)} profile-art-fx profile-art-fx-${esc(slug)}" style="--profile-fx-duration:${durationMs}ms" aria-hidden="true">
      <img class="profile-art-static" src="${assetRoot}/composite-preview.png" alt="" draggable="false" decoding="async">
      <span class="profile-art-depth profile-art-depth-back">
        ${layer('background', 'profile-art-background')}
        ${layer('frame-back', 'profile-art-frame-back')}
      </span>
      <span class="profile-art-depth profile-art-depth-front">
        ${layer('shadow-overlay', 'profile-art-shadow')}
        ${layer('accent-left', 'profile-art-accent-left')}
        ${layer('accent-right', 'profile-art-accent-right')}
        ${layer('top-detail', 'profile-art-top')}
        ${layer('bottom-detail', 'profile-art-bottom')}
        ${layer('frame-front', 'profile-art-frame-front')}
        ${layer('particles', 'profile-art-particles')}
        ${layer('light-overlay', 'profile-art-light')}
      </span>
      <span class="profile-art-mobile-frame">
        ${mobileLayer('back', 'frame-back', 'profile-art-frame-back')}
        ${mobileLayer('shadow', 'shadow-overlay', 'profile-art-shadow')}
        ${mobileLayer('left', 'accent-left', 'profile-art-accent-left')}
        ${mobileLayer('right', 'accent-right', 'profile-art-accent-right')}
        ${mobileLayer('top', 'top-detail', 'profile-art-top')}
        ${mobileLayer('bottom', 'bottom-detail', 'profile-art-bottom')}
        ${mobileLayer('front', 'frame-front', 'profile-art-frame-front')}
        ${mobileLayer('particles', 'particles', 'profile-art-particles')}
        ${mobileLayer('light', 'light-overlay', 'profile-art-light')}
      </span>
    </span>`;
  }
  const particles = Array.from({ length: 20 }, (_, index) => {
    const side = Math.floor(index / 5);
    const offset = 8 + (index % 5) * 21;
    const [x, y] = side === 0 ? [offset, 1] : side === 1 ? [99, offset] : side === 2 ? [92 - (index % 5) * 21, 99] : [1, 92 - (index % 5) * 21];
    return `<i style="--i:${index};--x:${x}%;--y:${y}%;--dx:${(index - 10) * 2}px;--dy:${(10 - index) * 2}px;--r:${index * 19}deg"></i>`;
  }).join('');
  return `<span class="quick-profile-fx quick-profile-fx-${esc(clean.slice(8))}" style="--profile-fx-duration:${durationMs}ms;--profile-fx-still:-${Math.round(durationMs * 0.5)}ms" aria-hidden="true"><b></b><em></em>${particles}</span>`;
}

const PROFILE_SHOP_LOADS = new WeakMap();

function restoreProfileShopPreview(card) {
  const demo = card?.querySelector('.profile-fx-demo-card[data-profile-effect]');
  if (!demo) return;
  const pending = PROFILE_SHOP_LOADS.get(demo);
  if (pending) {
    pending.cancelled = true;
    if (pending.handoffTimer) clearTimeout(pending.handoffTimer);
    if (pending.releaseTimer) clearTimeout(pending.releaseTimer);
    PROFILE_SHOP_LOADS.delete(demo);
  }
  const activeEffect = demo.querySelector('.profile-art-fx');
  if (activeEffect) {
    activeEffect.querySelectorAll('img').forEach(image => image.removeAttribute('src'));
    activeEffect.remove();
  }
  if (!demo.querySelector('.profile-art-shop-preview')) {
    demo.insertAdjacentHTML('beforeend', profileEffectStaticPreview(demo.dataset.profileEffect));
  }
  demo.querySelector('.profile-art-shop-preview')?.classList.remove('is-leaving');
}

window.setProfileCardEffectMotion = function(card, animate) {
  const demo = card?.querySelector('.profile-fx-demo-card[data-profile-effect]');
  if (!demo) return;
  if (!animate) {
    restoreProfileShopPreview(card);
    return;
  }

  document.querySelectorAll('.cosmetic-shop-card-profile .profile-fx-demo-card[data-profile-effect]').forEach(otherDemo => {
    if (otherDemo !== demo) restoreProfileShopPreview(otherDemo.closest('.cosmetic-shop-card-profile'));
  });
  if (demo.querySelector('.profile-art-fx')) return;

  const template = document.createElement('template');
  template.innerHTML = profileEffectLayer(demo.dataset.profileEffect).trim();
  const effect = template.content.firstElementChild;
  if (!effect) return;
  const loadState = { cancelled:false, handoffTimer:null, releaseTimer:null };
  PROFILE_SHOP_LOADS.set(demo, loadState);
  effect.classList.add('profile-art-loading');
  demo.appendChild(effect);

  const images = [...effect.querySelectorAll('img')];
  Promise.all(images.map(image => image.decode().catch(() => undefined))).then(() => {
    const isCurrent = PROFILE_SHOP_LOADS.get(demo) === loadState;
    const decoded = images.every(image => image.complete && image.naturalWidth > 0);
    if (!isCurrent || loadState.cancelled || !effect.isConnected) return;
    if (!decoded) {
      restoreProfileShopPreview(card);
      return;
    }

    effect.classList.add('is-looping');
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (PROFILE_SHOP_LOADS.get(demo) !== loadState || loadState.cancelled || !effect.isConnected) return;
      effect.classList.remove('profile-art-loading');
      loadState.handoffTimer = setTimeout(() => {
        if (PROFILE_SHOP_LOADS.get(demo) !== loadState || loadState.cancelled || !effect.isConnected) return;
        demo.querySelector('.profile-art-shop-preview')?.classList.add('is-leaving');
        loadState.handoffTimer = null;
        loadState.releaseTimer = setTimeout(() => {
          if (PROFILE_SHOP_LOADS.get(demo) !== loadState || loadState.cancelled || !effect.isConnected) return;
          demo.querySelector('.profile-art-shop-preview')?.remove();
          loadState.releaseTimer = null;
        }, 180);
      }, 220);
    }));
  });
};

function openUserCard(username, fallbackUser = null) {
  const member = (Array.isArray(S.currentMembers) ? S.currentMembers : []).find(
    item => String(item?.username || '').toLowerCase() === String(username || '').toLowerCase()
  );
  const user = member || (fallbackUser && typeof fallbackUser === 'object' ? {
    ...fallbackUser,
    username: fallbackUser.username || username,
    avatar: fallbackUser.avatar || fallbackUser.avatar_url || null,
    equippedEffect: fallbackUser.equippedEffect || 'none',
    equippedAvatarEffect: fallbackUser.equippedAvatarEffect || 'none',
    equippedTag: fallbackUser.equippedTag || 'none',
    equippedBanner: fallbackUser.equippedBanner || 'none',
    equippedProfileEffect: fallbackUser.equippedProfileEffect || 'none'
  } : null);
  if (!user) return toast('That member is no longer online', 'info');
  const tag = user.equippedTag && user.equippedTag !== 'none' ? EFFECT_MAP.get(user.equippedTag) : null;
  const equippedBanner = String(user.equippedBanner || '');
  const bannerId = EFFECT_MAP.get(equippedBanner)?.scope === 'banner' ? equippedBanner : '';
  const bannerClass = bannerId ? ` member-banner-${bannerId.slice(7)}` : '';
  const displayName = String(user.username || 'Unknown');
  const safeName = esc(displayName);
  const role = String(user.role || 'user').toLowerCase();
  const isSelf = displayName.toLowerCase() === myUsername().toLowerCase();
  const friend = (S.friends || []).some((f) => String(f.username || f.name || '').toLowerCase() === displayName.toLowerCase());
  const dmRoom = computeDmRoom(myUsername(), displayName);
  const statusText = isSelf ? 'This is you' : friend ? 'Friend' : 'Not friends yet';
  const bannerLabel = bannerId ? (EFFECT_MAP.get(bannerId)?.name || bannerId.replace('banner_', '')) : 'No banner';
  const profileEffectId = validProfileEffectId(user.equippedProfileEffect || (isSelf ? S.equippedProfileEffect : 'none'));

  openModal(`<div class="profile-card-modal profile-fx-host">
    ${profileEffectLayer(profileEffectId)}
    <div class="profile-card-banner ${bannerClass}">
      <button class="profile-card-close" type="button" onclick="closeModal()" aria-label="Close"><span class="material-icons-round">close</span></button>
    </div>
    <div class="profile-card-main">
      <div class="profile-card-avatar">${avatarEl(displayName, 76, user.avatar || (isSelf ? S.user?.avatar || S.user?.avatar_url || null : null), validAvatarEffectId(user.equippedAvatarEffect || (isSelf ? S.equippedAvatarEffect : 'none')))}</div>
      <div class="profile-card-head">
        <h3>${safeName}</h3>
        <p>${esc(statusText)}</p>
        <div class="profile-card-badges">${roleBadge(user)}${tagBadgeHtml(tag)}</div>
      </div>
      <div class="profile-card-stats">
        <div><span>Coins</span><strong><span class="material-icons-round">toll</span>${esc(String(user.coins ?? 0))}</strong></div>
        <div><span>Role</span><strong>${esc(role || 'user')}</strong></div>
        <div><span>Banner</span><strong>${esc(bannerLabel)}</strong></div>
      </div>
      <div class="profile-card-actions">
        ${isSelf ? `<button class="modal-btn modal-btn-ghost" disabled>This is you</button>` : ''}
        ${!isSelf && !friend ? `<button class="modal-btn modal-btn-primary" id="profile-add-friend" data-username="${safeName}"><span class="material-icons-round">person_add</span>Add Friend</button>` : ''}
        ${!isSelf ? `<button class="modal-btn modal-btn-ghost" id="profile-open-dm" data-room="${esc(dmRoom)}" data-username="${safeName}"><span class="material-icons-round">chat</span>${friend ? 'Message' : 'Open DM'}</button>` : ''}
        ${!isSelf ? `<button class="modal-btn modal-btn-ghost" id="profile-mention" data-username="${safeName}"><span class="material-icons-round">alternate_email</span>Mention</button>` : ''}
        <button class="modal-btn modal-btn-ghost" id="profile-copy-name" data-username="${safeName}"><span class="material-icons-round">content_copy</span>Copy Username</button>
        ${!isSelf && friend ? `<button class="modal-btn modal-btn-ghost" id="profile-remove-friend" data-username="${safeName}"><span class="material-icons-round">person_remove</span>Remove Friend</button>` : ''}
      </div>
    </div>
  </div>`);

  document.getElementById('profile-add-friend')?.addEventListener('click', async (event) => {
    const btn = event.currentTarget;
    btn.disabled = true;
    try {
      await api('/api/users/friends', { method: 'POST', body: { username: displayName } });
      toast(`Friend request sent to ${displayName}`, 'success');
      btn.textContent = 'Request sent';
    } catch (error) {
      btn.disabled = false;
      toast(error?.data?.msg || 'Could not send friend request', 'error');
    }
  });
  document.getElementById('profile-open-dm')?.addEventListener('click', () => {
    closeModal();
    joinRoom(dmRoom, 'dm', displayName);
  });
  document.getElementById('profile-mention')?.addEventListener('click', () => {
    closeModal();
    insertMention(displayName);
  });
  document.getElementById('profile-copy-name')?.addEventListener('click', async () => {
    try {
      await navigator.clipboard?.writeText(displayName);
      toast('Username copied', 'success');
    } catch {
      toast(displayName, 'info');
    }
  });
  document.getElementById('profile-remove-friend')?.addEventListener('click', async (event) => {
    await removeFriend(displayName, event);
    closeModal();
  });
}

function messageEffectClass(id) {
  return bubbleCls(id);
}

function messageEffectPreviewHtml(e = {}, opts = {}) {
  const cls = messageEffectClass(e.id);
  const active = opts.active ? ' active' : '';
  const locked = opts.locked ? ' locked' : '';
  const status = opts.status || '';
  const clickId = opts.effectId || e.id;
  const onclick = opts.onclick ? ` onclick="${opts.onclick}('${esc(clickId)}')"` : '';
  const name = e.name || e.id || 'Effect';
  return `<button type="button" class="message-effect-card${active}${locked}" aria-label="${esc(name)}"${onclick}>
    <span class="message-effect-swatch">
      <span class="message-effect-sample msg-bubble ${esc(cls)}">${messageMaterialContent(e.id, '<span class="message-effect-glyph"><strong>Nebulo</strong><em>Looks good</em></span>')}</span>
    </span>
    <span class="message-effect-meta"><span class="message-effect-name">${esc(name)}</span>${status}</span>
  </button>`;
}
window.openUserCard = openUserCard;
function openUserCardFromElement(el) {
  openUserCard(el?.dataset?.memberName || '');
}
window.openUserCardFromElement = openUserCardFromElement;

async function fetchPresence() {
  try {
    const data = await api('/api/network/presence');
    const fallbackUsers = new Set();
    Object.values(data?.users || {}).flat().forEach(user => {
      const key = String(user?.userId || user?.username || '').trim().toLowerCase();
      if (key) fallbackUsers.add(key);
    });
    renderTotalOnline(Number.isFinite(Number(data?.totalOnline)) ? Number(data.totalOnline) : fallbackUsers.size);
    if (!S.room) return;
    const users = data?.users?.[S.room] || [];
    S.currentMembers = users;
    const count = users.length || Number(data?.rooms?.[S.room] || 0);
    const ml = document.getElementById('members-list');
    if (!ml) return;
    const header = `<div style="font-size:11px;font-weight:600;color:#71717a;letter-spacing:.05em;padding:8px 10px 4px;text-transform:uppercase">${count} Online</div>`;
    ml.innerHTML = header + renderMemberList(users);
  } catch { clearMembersList(); }
}

function clearMembersList() {
  S.currentMembers = [];
  const ml = document.getElementById('members-list');
  if (ml) ml.innerHTML = '';
}

function renderTotalOnline(total) {
  var countEl = document.getElementById('total-online-count');
  var wrapEl = document.getElementById('total-online-indicator');
  if (countEl) countEl.textContent = String(total);
  if (wrapEl) wrapEl.title = total + ' ' + (total === 1 ? 'user' : 'users') + ' online across all rooms';
}

// ─── Room Joining ─────────────────────────────────────────────────────────────
async function joinRoom(roomId, type, name) {
  const loadSeq = ++S.roomLoadSeq;
  setVoiceStageVisible(false);
  if (S.room) {
    saveCurrentDraft();
    stopTypingNow(S.room);
    S.socket?.emit('leave_room', S.room);
  }
  S.room = roomId; S.roomMeta = { id: roomId, type, name };
  S.lastMsgs = []; S.typingUsers.clear();
  S.roomState = { read: null, pinned: [], bookmarkIds: [] };
  S.hasOlderMessages = true;
  S.loadingOlderMessages = false;
  clearReply({ saveDraft: false }); clearAttachment();
  hideMentionPanel();
  renderTypingBar();

  S.socket?.emit('join_room', roomId);

  // Register participant on the TLK session so message sending works immediately
  chatApi(`/api/tlk/rooms/${encodeURIComponent(roomId)}/join`, {
    method: 'POST',
    body: { nickname: S.user?.name || S.user?.username || 'guest' },
  }).catch(() => {});

  const iconEl = document.getElementById('header-icon');
  const nameEl = document.getElementById('channel-header-name');
  const inputEl = document.getElementById('message-input');
  const headerActions = document.getElementById('header-actions');
  if (iconEl) iconEl.textContent = type === 'dm' ? 'chat' : type === 'group' ? 'group' : 'tag';
  if (nameEl) nameEl.textContent = name || roomId;
  if (inputEl) {
    inputEl.dataset.roomPlaceholder = `Message ${type === 'channel' ? '#' : ''}${name || roomId}`;
    inputEl.placeholder = inputEl.dataset.roomPlaceholder;
  }

  // Group-specific header actions
  if (headerActions) {
    const groupActions = type === 'group'
      ? `<button class="icon-btn" title="Leave group" onclick="leaveGroup('${esc(roomId)}')"><span class="material-icons-round">logout</span></button>
         <button class="icon-btn" title="Invite code" onclick="showGroupCode('${esc(roomId)}')"><span class="material-icons-round">content_copy</span></button>`
      : '';
    headerActions.innerHTML = `${groupActions}
      <button class="icon-btn" title="Pinned messages" onclick="showPinnedMessages()"><span class="material-icons-round">push_pin</span></button>
      <button class="icon-btn" title="Bookmarks" onclick="showBookmarks()"><span class="material-icons-round">bookmarks</span></button>
      <button id="toggle-members-btn" class="icon-btn" title="Toggle members"><span class="material-icons-round">people</span></button>`;
    document.getElementById('toggle-members-btn')?.addEventListener('click', toggleMembersPanel);
  }

  // Sidebar active state
  document.querySelectorAll('.sb-item[data-room]').forEach(btn =>
    btn.classList.toggle('active', btn.dataset.room === roomId)
  );

  // Loading state
  const list = document.getElementById('messages-list');
  if (list) list.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;padding:40px;color:#52525b;gap:7px;font-size:13px"><span class="material-icons-round spin" style="font-size:17px">refresh</span>Loading…</div>`;

  // Fetch slowmode
  fetchModeration();
  renderSlowmodeConfig();

  try {
    const [data, stateData] = await Promise.all([
      chatApi(`/api/tlk/rooms/${encodeURIComponent(roomId)}/messages?limit=60`),
      chatApi(`/api/tlk/rooms/${encodeURIComponent(roomId)}/state`).catch(() => null)
    ]);
    if (loadSeq !== S.roomLoadSeq || String(S.room) !== String(roomId)) return;
    const msgs = Array.isArray(data) ? data : (data?.messages || []);
    if (stateData) {
      S.roomState = {
        read: stateData.read || null,
        pinned: Array.isArray(stateData.pinned) ? stateData.pinned : [],
        bookmarkIds: Array.isArray(stateData.bookmarkIds) ? stateData.bookmarkIds.map(String) : []
      };
      if (Array.isArray(stateData.allowedReactions)) S.allowedReactions = stateData.allowedReactions;
    }
    S.lastMsgs = mergeMessageBatch([], msgs.map(withLocalMessageIdentity));
    S.hasOlderMessages = msgs.length > 0;
    renderMessages(S.lastMsgs, { forceScroll: true });
    restoreRoomDraft(roomId);
    scheduleMarkRead();
  } catch {
    if (list) list.innerHTML = `<div style="text-align:center;color:#52525b;font-size:13px;padding:40px">Failed to load messages.</div>`;
    restoreRoomDraft(roomId);
  }

  fetchPresence();

  // Keep a lightweight live poll running as a safety net for dropped websocket
  // room subscriptions. Socket.IO remains the immediate delivery path.
  startPolling(S.socket?.connected ? 30_000 : 2_500);
}

// ─── Group Actions ────────────────────────────────────────────────────────────
async function leaveGroup(room) {
  if (!confirm(`Leave this group?`)) return;
  try {
    await api(`/api/group-chats/${encodeURIComponent(room)}/leave`, { method: 'POST' });
    toast('Left group', 'success');
    S.room = null; S.roomMeta = null;
    await renderGroups();
    const list = document.getElementById('messages-list');
    if (list) list.innerHTML = emptyPlaceholder();
    const nameEl = document.getElementById('channel-header-name');
    if (nameEl) nameEl.textContent = 'Select a channel';
  } catch (err) { toast(err.data?.msg || 'Failed to leave group', 'error'); }
}
window.leaveGroup = leaveGroup;

async function showGroupCode(room) {
  try {
    const data = await api(`/api/group-chats/${encodeURIComponent(room)}`);
    const code = data?.group?.inviteCode || data?.group?.room || room;
    openModal(`<h3 style="font-size:16px;font-weight:700;color:#fff;margin:0 0 12px">Invite Code</h3>
      <div style="background:#0f0f13;border-radius:10px;padding:16px;text-align:center;font-size:22px;font-weight:700;color:#0099ff;letter-spacing:.15em;font-family:monospace">${esc(code)}</div>
      <p style="font-size:12px;color:#71717a;text-align:center;margin:10px 0 16px">Share this 5-letter code with others to invite them.</p>
      <button class="modal-btn modal-btn-primary" onclick="navigator.clipboard?.writeText('${esc(code)}').then(()=>toast('Copied!','success'));closeModal()" style="width:100%">Copy Code</button>`);
  } catch (err) { toast(err.data?.msg || 'Failed to load group', 'error'); }
}
window.showGroupCode = showGroupCode;

// ─── Section Rendering ────────────────────────────────────────────────────────
async function renderSection(section) {
  if (section === 'admin' && !isOwner()) {
    toast('Owner access required', 'error');
    section = 'channels';
  }
  S.section = section;
  document.body.classList.toggle('cosmetics-open', section === 'cosmetics');
  if (section !== 'cosmetics') document.getElementById('cosmetics-page')?.remove();
  const titleEl = document.getElementById('section-title');
  const titles = { channels:'Channels', dms:'Direct Messages', groups:'Groups', cosmetics:'Cosmetics Shop', settings:'Settings', alerts:'Alerts', admin:'Owner Admin' };
  if (titleEl) titleEl.textContent = titles[section] || section;
  document.getElementById('section-list')?.classList.toggle('settings-list', section === 'settings');
  const sectionPanel = document.getElementById('section-panel');
  if (sectionPanel) {
    sectionPanel.classList.toggle('cosmetics-section', section === 'cosmetics');
    const savedWidth = Math.max(170, Math.min(460, Number(localStorage.getItem('chatSectionPanelWidth') || 220)));
    const preferredWidth = section === 'settings' ? Math.max(310, savedWidth) : section === 'admin' ? Math.max(300, savedWidth) : savedWidth;
    sectionPanel.style.width = `${preferredWidth}px`;
  }

  document.querySelectorAll('.nav-btn[data-section]').forEach(btn =>
    btn.classList.toggle('active', btn.dataset.section === section)
  );

  switch (section) {
    case 'channels': return renderChannels();
    case 'dms':      return renderDms();
    case 'groups':   return renderGroups();
    case 'settings': return renderSettings();
    case 'alerts':   return renderAlerts();
    case 'cosmetics': return renderCosmetics();
    case 'admin':    return renderAdmin();
  }
}

// channels

async function renderChannels() {
  try {
    const data = await api('/api/network/sites');
    S.channels = data?.sites || [];
    S.globalRoom = data?.globalRoom || null;
  } catch { S.channels = []; S.globalRoom = null; }

  const list = document.getElementById('section-list');
  const action = document.getElementById('section-action');
  if (!list) return;

  let html = '';

  // Global chat pinned at top
  if (S.globalRoom) {
    const gId = S.globalRoom;
    const isActive = S.room === gId;
    const unread = S.unreadCounts[gId] || 0;
    html += `<div style="font-size:10px;font-weight:700;color:#52525b;text-transform:uppercase;letter-spacing:.07em;padding:4px 10px 3px">Global</div>`;
    html += `<button class="sb-item${isActive?' active':''}" data-room="${esc(gId)}" data-room-type="channel" data-room-name="Global Chat">
      <span class="material-icons-round mi" style="color:#4ade80">language</span>
      <span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">Global Chat</span>
      ${unread ? `<span class="sb-badge">${unread>9?'9+':unread}</span>` : ''}
    </button>`;
  }

  // Text channels
  if (S.channels.length) {
    html += `<div style="font-size:10px;font-weight:700;color:#52525b;text-transform:uppercase;letter-spacing:.07em;padding:4px 10px 3px;margin-top:6px">Text Channels</div>`;
    html += S.channels.map(site => {
      const channelRoom = channelRoomId(site);
      const isActive = S.room === channelRoom;
      const unread = S.unreadCounts[channelRoom] || 0;
      return `<button class="sb-item${isActive?' active':''}" data-room="${esc(channelRoom)}" data-room-type="channel" data-room-name="${esc(site.name||site.id)}">
        <span class="material-icons-round mi">tag</span>
        <span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(site.name||site.id)}</span>
        ${unread ? `<span class="sb-badge">${unread>9?'9+':unread}</span>` : ''}
      </button>`;
    }).join('');
  } else if (!S.globalRoom) {
    html = `<div style="font-size:12px;color:#52525b;text-align:center;padding:18px 8px">No channels found.</div>`;
  }

  // Voice channels
  const vcRoom = 'voice:general';
  const inVoice = S.voice.roomName === vcRoom;
  html += `<div style="font-size:10px;font-weight:700;color:#52525b;text-transform:uppercase;letter-spacing:.07em;padding:4px 10px 3px;margin-top:6px">Voice Channels</div>`;
  html += `<button class="sb-item${inVoice?' active':''}" id="vc-general-btn" style="display:block;padding:7px 10px">
    <span style="display:flex;align-items:center;gap:9px"><span class="material-icons-round mi" style="color:${inVoice?'#4ade80':'#71717a'}">volume_up</span>
    <span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">General</span>
    ${inVoice ? `<span style="font-size:10px;color:#4ade80;font-weight:600">Live</span>` : ''}</span>
    <span id="voice-general-presence" style="display:block;margin:6px 0 0 25px"></span>
  </button>`;

  list.innerHTML = html;
  renderVoiceChannelPresence();
  void fetchVoiceChannelPresence();
  if (action) action.innerHTML = '';

  document.getElementById('vc-general-btn')?.addEventListener('click', () => {
    if (S.voice.roomName === vcRoom) setVoiceStageVisible(true); else joinVoice(vcRoom, 'public');
  });

  bindRoomButtons();
}

// DMs

function sectionListLoadingHtml(label) {
  return `<div style="display:flex;align-items:center;gap:7px;padding:18px 10px;color:#71717a;font-size:11px"><span class="material-icons-round spin" style="font-size:15px">refresh</span>${esc(label)}</div>`;
}

async function refreshDmsData() {
  if (S.dmsLoadPromise) return S.dmsLoadPromise;
  S.dmsLoadPromise = api('/api/users/friends?sidebar=1')
    .then(data => {
      S.friends = data?.mutualFriends || data?.results || [];
      S.friendRequests = data?.requests || { incoming: [], outgoing: [] };
      S.friends.forEach(f => { const n = (f.username || f.name || '').toLowerCase(); if (n) knownValidUsers.add(n); });
      S.dmsLoaded = true;
      return data;
    })
    .finally(() => { S.dmsLoadPromise = null; });
  return S.dmsLoadPromise;
}

async function renderDms(options = {}) {
  const list = document.getElementById('section-list');
  const action = document.getElementById('section-action');
  if (!list) return;

  if (!options.cachedOnly) {
    if (S.dmsLoaded) {
      void renderDms({ cachedOnly: true });
      try { await refreshDmsData(); } catch {}
      if (S.section === 'dms') return renderDms({ cachedOnly: true });
      return;
    }
    list.innerHTML = sectionListLoadingHtml('Loading conversations');
    if (action) action.innerHTML = '';
    try { await refreshDmsData(); } catch {}
    if (S.section !== 'dms') return;
  }

  const myName = myUsername();
  const incoming = S.friendRequests.incoming || [];

  let html = '';

  if (incoming.length) {
    html += `<div style="font-size:11px;font-weight:600;color:#52525b;text-transform:uppercase;letter-spacing:.06em;padding:4px 8px;margin:4px 0 2px">Friend Requests (${incoming.length})</div>`;
    html += incoming.map(f => {
      const name = f.username || f.name || 'Unknown';
      const requester = esc(name);
      const col = avatarColor(name);
      const initials = esc(avatarInitials(name));
      const avatarHtml = f.avatar
        ? `<div style="width:22px;height:22px;border-radius:7px;background:${col};flex-shrink:0;overflow:hidden;position:relative">
            <img src="${esc(f.avatar)}" style="width:100%;height:100%;object-fit:cover" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
            <span style="display:none;position:absolute;inset:0;align-items:center;justify-content:center;font-size:9px;font-weight:700;color:#fff">${initials}</span>
           </div>`
        : `<div style="width:22px;height:22px;border-radius:7px;background:${col};display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;color:#fff;flex-shrink:0">${initials}</div>`;
      return `<div style="display:flex;align-items:center;gap:7px;padding:5px 8px;border-radius:9px">
        ${avatarHtml}
        <span style="flex:1;font-size:12px;color:#a1a1aa;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(name)}</span>
        <button onclick="acceptFriend('${requester}')" style="background:rgba(0,153,255,.15);border:none;color:#0099ff;border-radius:6px;padding:3px 7px;font-size:11px;cursor:pointer;font-weight:600">✓</button>
      </div>`;
    }).join('');
    html += `<div style="height:1px;background:rgba(255,255,255,.06);margin:6px 0 4px"></div>`;
  }

  if (!S.friends.length) {
    html += `<div style="font-size:12px;color:#71717a;text-align:center;padding:22px 8px 8px"><span class="material-icons-round" style="display:block;font-size:32px;color:#3f3f46;margin-bottom:7px">group_add</span>No friends yet.<br>Add someone to start a DM.</div>
      <div class="empty-friends-arrow"><span>Add your first friend</span><span class="material-icons-round">south</span></div>`;
  } else {
    html += `<div style="font-size:11px;font-weight:600;color:#52525b;text-transform:uppercase;letter-spacing:.06em;padding:4px 8px;margin-bottom:2px">Direct Messages</div>`;
    html += S.friends.map(f => {
      const name = f.username || f.name || 'Unknown';
      const roomId = computeDmRoom(myName, name);
      const unread = S.unreadCounts[roomId] || 0;
      const col = avatarColor(name);
      const initials = esc(avatarInitials(name));
      const avatarHtml = f.avatar
        ? `<div style="width:22px;height:22px;border-radius:7px;background:${col};flex-shrink:0;overflow:hidden;position:relative">
            <img src="${esc(f.avatar)}" style="width:100%;height:100%;object-fit:cover" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
            <span style="display:none;position:absolute;inset:0;align-items:center;justify-content:center;font-size:9px;font-weight:700;color:#fff">${initials}</span>
           </div>`
        : `<div style="width:22px;height:22px;border-radius:7px;background:${col};display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;color:#fff;flex-shrink:0">${initials}</div>`;
      return `<div class="sb-item dm-friend-row${S.room===roomId?' active':''}" data-room="${esc(roomId)}" data-room-type="dm" data-room-name="${esc(name)}">
        <button class="dm-friend-open" data-room="${esc(roomId)}" data-room-type="dm" data-room-name="${esc(name)}">
          ${avatarHtml}<span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(name)}</span>
          ${unread ? `<span class="sb-badge">${unread>9?'9+':unread}</span>` : ''}
        </button>
        <button class="dm-remove-friend" type="button" title="Remove ${esc(name)}" onclick="removeFriend('${esc(name)}',event)"><span class="material-icons-round">person_remove</span></button>
      </div>`;
    }).join('');
  }

  list.innerHTML = html;

  if (action) {
    action.innerHTML = `<button id="add-friend-btn" class="sb-item add-friend-primary">
      <span class="material-icons-round mi" style="color:#fff">person_add</span>
      <span style="color:#fff;font-weight:750">Add Friend</span>
    </button>`;
    document.getElementById('add-friend-btn')?.addEventListener('click', modalAddFriend);
  }

  bindRoomButtons();
  updateUnreadBadges();
}

async function acceptFriend(username) {
  try {
    await api('/api/users/friends/accept', { method: 'POST', body: { username } });
    toast('Friend request accepted!', 'success');
    await renderDms();
  } catch (err) { toast(err.data?.msg || 'Failed', 'error'); }
}
window.acceptFriend = acceptFriend;

async function removeFriend(username, event) {
  event?.stopPropagation?.();
  if (!await confirmAction(`Remove ${username} from your friends? Your existing DM history will stay saved.`, 'Remove friend')) return;
  try {
    await api(`/api/users/friends/${encodeURIComponent(username)}`, { method:'DELETE' });
    toast(`${username} removed from friends`, 'success');
    const removedRoom = computeDmRoom(myUsername(), username);
    if (S.room === removedRoom) {
      S.room = null;
      S.roomMeta = null;
      const messages = document.getElementById('messages-list');
      const header = document.getElementById('channel-header-name');
      if (messages) messages.innerHTML = emptyPlaceholder();
      if (header) header.textContent = 'Select a channel';
    }
    await renderDms();
  } catch (error) {
    toast(error?.data?.msg || 'Could not remove friend', 'error');
  }
}
window.removeFriend = removeFriend;

// groups

async function refreshGroupsData() {
  if (S.groupsLoadPromise) return S.groupsLoadPromise;
  S.groupsLoadPromise = api('/api/group-chats')
    .then(data => {
      S.groups = data?.groups || [];
      S.groupLimit = Math.max(1, Number(data?.maxGroups || 15));
      S.groupsLoaded = true;
      return data;
    })
    .finally(() => { S.groupsLoadPromise = null; });
  return S.groupsLoadPromise;
}

async function renderGroups(options = {}) {
  const list = document.getElementById('section-list');
  const action = document.getElementById('section-action');
  if (!list) return;

  if (!options.cachedOnly) {
    if (S.groupsLoaded) {
      void renderGroups({ cachedOnly: true });
      try { await refreshGroupsData(); } catch {}
      if (S.section === 'groups') return renderGroups({ cachedOnly: true });
      return;
    }
    list.innerHTML = sectionListLoadingHtml('Loading groups');
    if (action) action.innerHTML = '';
    try { await refreshGroupsData(); } catch {}
    if (S.section !== 'groups') return;
  }

  list.innerHTML = S.groups.length
    ? S.groups.map(g => {
      const unread = S.unreadCounts[g.room] || 0;
      const color = avatarColor(g.name || g.room);
      const memberCount = Array.isArray(g.members) ? g.members.length : Number(g.memberCount || g.member_count || 0);
      return `<button class="sb-item${S.room===g.room?' active':''}" data-room="${esc(g.room)}" data-room-type="group" data-room-name="${esc(g.name||g.room)}">
          <div style="width:22px;height:22px;border-radius:7px;background:${color};display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;color:#fff;flex-shrink:0">${esc(avatarInitials(g.name||g.room))}</div>
          <span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(g.name||g.room)}</span>
          <span title="${memberCount} member${memberCount === 1 ? '' : 's'}" style="display:flex;align-items:center;gap:3px;padding:2px 5px;border-radius:6px;background:rgba(255,255,255,.055);font-size:10px;font-weight:600;color:#a1a1aa;flex-shrink:0"><span class="material-icons-round" style="font-size:12px">people</span>${memberCount}</span>
          ${unread ? `<span class="sb-badge">${unread>9?'9+':unread}</span>` : ''}
        </button>`;
      }).join('')
    : `<div style="font-size:12px;color:#52525b;text-align:center;padding:18px 8px">No groups yet.<br>Create or join one below.</div>`;

  if (action) {
    const atGroupLimit = S.groups.length >= S.groupLimit;
    const disabled = atGroupLimit ? ' disabled' : '';
    action.innerHTML = `<div style="display:flex;gap:6px">
      <button id="create-group-btn"${disabled} title="${atGroupLimit ? `Group limit reached (${S.groupLimit})` : 'Create a group'}" style="flex:1;display:flex;align-items:center;justify-content:center;gap:4px;padding:7px;border-radius:9px;border:none;background:rgba(0,153,255,.12);color:#0099ff;font-size:12px;font-weight:600;cursor:${atGroupLimit ? 'not-allowed' : 'pointer'};opacity:${atGroupLimit ? '.45' : '1'};font-family:'Inter',sans-serif">
        <span class="material-icons-round" style="font-size:14px">add</span>Create
      </button>
      <button id="join-group-btn"${disabled} title="${atGroupLimit ? `Group limit reached (${S.groupLimit})` : 'Join a group'}" style="flex:1;display:flex;align-items:center;justify-content:center;gap:4px;padding:7px;border-radius:9px;border:none;background:rgba(255,255,255,.06);color:#a1a1aa;font-size:12px;font-weight:600;cursor:${atGroupLimit ? 'not-allowed' : 'pointer'};opacity:${atGroupLimit ? '.45' : '1'};font-family:'Inter',sans-serif">
        <span class="material-icons-round" style="font-size:14px">login</span>Join
      </button></div>
      <div style="margin-top:6px;text-align:center;color:${atGroupLimit ? '#fbbf24' : '#52525b'};font-size:9px">${S.groups.length}/${S.groupLimit} groups</div>
    `;
    document.getElementById('create-group-btn')?.addEventListener('click', modalCreateGroup);
    document.getElementById('join-group-btn')?.addEventListener('click', modalJoinGroup);
  }

  bindRoomButtons();
  updateUnreadBadges();
}

// owner admin

async function renderAdmin() {
  if (!isOwner()) return renderSection('channels');
  const list = document.getElementById('section-list');
  const action = document.getElementById('section-action');
  if (!list) return;
  list.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;gap:7px;padding:30px;color:#71717a;font-size:12px"><span class="material-icons-round spin" style="font-size:16px">refresh</span>Loading admin panel…</div>`;
  try {
    const [overview, directory, reportData] = await Promise.all([
      api('/api/admin/overview'),
      api('/api/admin/users?limit=20&offset=0'),
      api('/api/network/reports?status=all&limit=100').catch(error => ({ reports: [], error: error.data?.msg || 'Reports unavailable' }))
    ]);
    const stats = overview?.stats || {};
    const moderation = overview?.moderation || {};
    const users = directory?.users || [];
    const reports = reportData?.reports || [];
    const formatNumber = value => Number(value || 0).toLocaleString();
    const userOptions = users.map(user => `<option value="${esc(user.id || user._id)}">${esc(user.username)} · ${formatNumber(user.coins)} coins</option>`).join('');

    list.innerHTML = `<div style="padding:5px 4px 10px">
      <div class="admin-card" style="border-color:rgba(251,191,36,.2);background:linear-gradient(135deg,rgba(251,191,36,.08),rgba(255,255,255,.025))">
        <div class="admin-card-title"><span class="material-icons-round">shield</span>Owner control center</div>
        <div class="admin-stats">
          <div class="admin-stat"><strong>${formatNumber(stats.users)}</strong><span>Users</span></div>
          <div class="admin-stat"><strong>${formatNumber(stats.totalCoins)}</strong><span>Total coins</span></div>
          <div class="admin-stat"><strong>${formatNumber(stats.activeClients)}</strong><span>Online clients</span></div>
          <div class="admin-stat"><strong>${formatNumber(stats.groups)}</strong><span>Groups</span></div>
          <div class="admin-stat"><strong>${formatNumber(stats.premiumUsers)}</strong><span>Premium</span></div>
          <div class="admin-stat"><strong>${formatNumber(stats.staff)}</strong><span>Staff</span></div>
        </div>
      </div>

      <div class="admin-card" style="border-color:rgba(248,113,113,.18)">
        <div class="admin-card-title" style="justify-content:space-between"><span style="display:flex;align-items:center;gap:6px"><span class="material-icons-round">report</span>Report queue</span><span id="admin-report-count" class="admin-count-badge">${reports.filter(report => ['open','reviewing'].includes(report.status)).length}</span></div>
        ${reportData?.error ? `<div class="admin-inline-error">${esc(reportData.error)}</div>` : `
          <select id="admin-report-filter" class="setting-select" style="margin:0 0 7px">
            <option value="active">Open & reviewing</option><option value="open">Open</option><option value="reviewing">Reviewing</option><option value="resolved">Resolved</option><option value="dismissed">Dismissed</option><option value="all">All reports</option>
          </select>
          <div id="admin-report-list" class="admin-review-list"></div>`}
      </div>

      <div class="admin-card">
        <div class="admin-card-title"><span class="material-icons-round">toll</span>Coin bank</div>
        <label class="modal-label" for="admin-coin-user">Recipient</label>
        <select id="admin-coin-user" class="setting-select" style="margin:0 0 8px"><option value="">Select a user</option>${userOptions}</select>
        <label class="modal-label" for="admin-coin-amount">Coins to add</label>
        <input id="admin-coin-amount" class="modal-input" type="number" min="1" max="1000000" step="1" value="100" style="margin-bottom:8px">
        <div style="display:flex;gap:6px"><button id="admin-grant-self" class="modal-btn modal-btn-ghost" style="padding:7px">Give myself</button><button id="admin-grant-coins" class="modal-btn modal-btn-primary" style="padding:7px">Give coins</button></div>
        <div id="admin-coin-status" role="status" style="min-height:14px;margin-top:7px;font-size:10px;color:#71717a"></div>
      </div>

      <div class="admin-card">
        <div class="admin-card-title"><span class="material-icons-round">gavel</span>Chat moderation</div>
        <div class="setting-row" style="padding:4px 0 9px"><div class="setting-copy"><div class="setting-title">Global lockdown</div><div class="setting-desc">Only staff can send public messages</div></div><label class="mini-switch"><input id="admin-lockdown" type="checkbox" ${moderation.lockdownActive ? 'checked' : ''}><span></span></label></div>
        <label class="modal-label" for="admin-slowmode">Global slowmode (seconds)</label>
        <input id="admin-slowmode" class="modal-input" type="number" min="0" max="3600" value="${Math.round(Number(moderation.slowmodeMs || 0) / 1000)}" style="margin-bottom:8px">
        <label class="modal-label" for="admin-blocked-words">Blocked words, one per line</label>
        <textarea id="admin-blocked-words" class="modal-input" rows="4" style="resize:vertical;margin-bottom:8px">${esc((moderation.blockedWords || []).join('\n'))}</textarea>
        <button id="admin-save-moderation" class="modal-btn modal-btn-primary" style="width:100%;padding:7px">Save moderation</button>
      </div>

      <div class="admin-card">
        <div class="admin-card-title"><span class="material-icons-round">manage_accounts</span>User directory</div>
        <input id="admin-user-search" class="modal-input" placeholder="Search users…" style="margin-bottom:7px">
        <div id="admin-user-results" style="max-height:260px;overflow-y:auto"></div>
      </div>
    </div>`;

    const renderReportQueue = filter => {
      const host = document.getElementById('admin-report-list');
      if (!host) return;
      const filtered = reports.filter(report => filter === 'all' || (filter === 'active' ? ['open','reviewing'].includes(report.status) : report.status === filter));
      host.innerHTML = filtered.length ? filtered.map(report => `
        <article class="admin-review-item" data-report-id="${esc(report.id)}">
          <div class="admin-review-head"><span class="admin-status admin-status-${esc(report.status)}">${esc(report.status)}</span><time>${esc(new Date(report.createdAt).toLocaleString())}</time></div>
          <strong>${esc(report.targetUsername || 'Unknown user')}</strong><span class="admin-review-meta">${esc(report.reasonCategory)} · ${esc(report.room)}</span>
          <p>${esc(report.reason)}</p>
          ${report.quote ? `<blockquote>${esc(report.quote)}</blockquote>` : ''}
          <div class="admin-review-meta">Reported by ${esc(report.reporterUsername || 'Unknown')}</div>
          <div class="admin-review-actions">
            ${report.status === 'open' ? `<button data-report-status="reviewing">Review</button>` : ''}
            ${['open','reviewing'].includes(report.status) ? `<button data-report-moderate="1">Moderate</button><button data-report-status="resolved" class="success">Resolve</button><button data-report-status="dismissed">Dismiss</button>` : ''}
          </div>
        </article>`).join('') : `<div class="admin-empty-state">No ${filter === 'active' ? 'active' : esc(filter)} reports</div>`;
      host.querySelectorAll('[data-report-status]').forEach(button => button.addEventListener('click', async () => {
        const item = button.closest('[data-report-id]');
        const report = reports.find(entry => entry.id === item?.dataset.reportId);
        if (!report) return;
        try {
          const data = await api(`/api/network/reports/${encodeURIComponent(report.id)}`, { method: 'PATCH', body: { status: button.dataset.reportStatus } });
          Object.assign(report, data.report || {});
          renderReportQueue(document.getElementById('admin-report-filter')?.value || 'active');
          toast(`Report marked ${button.dataset.reportStatus}`, 'success');
        } catch (error) { toast(error.data?.msg || 'Could not update report', 'error'); }
      }));
      host.querySelectorAll('[data-report-moderate]').forEach(button => button.addEventListener('click', () => {
        const report = reports.find(entry => entry.id === button.closest('[data-report-id]')?.dataset.reportId);
        if (report) openModPanel({ userId: report.targetUserId, nickname: report.targetUsername, body: report.quote || report.reason });
      }));
    };
    renderReportQueue('active');
    document.getElementById('admin-report-filter')?.addEventListener('change', event => renderReportQueue(event.target.value));

    const renderAdminUsers = (items) => {
      const host = document.getElementById('admin-user-results');
      const select = document.getElementById('admin-coin-user');
      if (!host) return;
      if (select) select.innerHTML = `<option value="">Select a user</option>` + items.map(user => `<option value="${esc(user.id || user._id)}">${esc(user.username)} · ${formatNumber(user.coins)} coins</option>`).join('');
      host.innerHTML = items.length ? items.map(user => {
        const name = user.username || 'Unknown';
        return `<button class="admin-user-row" data-admin-user-id="${esc(user.id || user._id)}"><span style="width:27px;height:27px;border-radius:8px;overflow:hidden;display:flex;align-items:center;justify-content:center;flex-shrink:0;background:${avatarColor(name)};color:#fff;font-size:9px;font-weight:700">${user.avatar ? `<img src="${esc(user.avatar)}" style="width:100%;height:100%;object-fit:cover" onerror="this.replaceWith(document.createTextNode('${esc(avatarInitials(name))}'))">` : esc(avatarInitials(name))}</span><span style="flex:1;min-width:0"><strong style="display:block;overflow:hidden;text-overflow:ellipsis">${esc(name)}</strong><span style="font-size:9px;color:#fbbf24">${formatNumber(user.coins)} coins</span></span><span class="material-icons-round" style="font-size:14px;color:#52525b">chevron_right</span></button>`;
      }).join('') : `<div style="padding:15px;text-align:center;color:#52525b;font-size:11px">No users found</div>`;
      host.querySelectorAll('[data-admin-user-id]').forEach(row => row.addEventListener('click', () => {
        if (select) select.value = row.dataset.adminUserId;
        document.getElementById('admin-coin-amount')?.focus();
      }));
    };
    renderAdminUsers(users);

    let adminSearchTimer = null;
    document.getElementById('admin-user-search')?.addEventListener('input', event => {
      clearTimeout(adminSearchTimer);
      adminSearchTimer = setTimeout(async () => {
        try {
          const data = await api(`/api/admin/users?search=${encodeURIComponent(event.target.value.trim())}&limit=20&offset=0`);
          renderAdminUsers(data?.users || []);
        } catch { toast('Could not search users', 'error'); }
      }, 250);
    });

    const grantCoins = async (self = false) => {
      const select = document.getElementById('admin-coin-user');
      const amountInput = document.getElementById('admin-coin-amount');
      const status = document.getElementById('admin-coin-status');
      const userId = self ? (S.user?.id || S.user?._id) : select?.value;
      const amount = Math.trunc(Number(amountInput?.value));
      if (!userId) { if (status) status.textContent = 'Choose a recipient.'; return; }
      try {
        if (status) { status.style.color = '#71717a'; status.textContent = 'Updating balance…'; }
        const data = await api('/api/admin/coins/grant', { method: 'POST', body: { userId, amount } });
        if (String(userId) === String(S.user?.id || S.user?._id)) setUser({ ...S.user, coins: data.user.coins });
        if (status) { status.style.color = '#4ade80'; status.textContent = data.msg; }
        toast(data.msg, 'success');
      } catch (error) {
        if (status) { status.style.color = '#f87171'; status.textContent = error.data?.msg || 'Could not grant coins'; }
      }
    };
    document.getElementById('admin-grant-self')?.addEventListener('click', () => grantCoins(true));
    document.getElementById('admin-grant-coins')?.addEventListener('click', () => grantCoins(false));

    document.getElementById('admin-save-moderation')?.addEventListener('click', async () => {
      const blockedWords = (document.getElementById('admin-blocked-words')?.value || '').split('\n').map(word => word.trim()).filter(Boolean);
      const lockdownActive = !!document.getElementById('admin-lockdown')?.checked;
      const slowmodeMs = Math.max(0, Number(document.getElementById('admin-slowmode')?.value || 0)) * 1000;
      try {
        await api('/api/network/moderation', { method: 'PUT', body: { blockedWords, lockdownActive, slowmodeMs } });
        toast('Moderation settings saved', 'success');
      } catch (error) { toast(error.data?.msg || 'Could not save moderation', 'error'); }
    });
  } catch (error) {
    list.innerHTML = `<div style="padding:24px 12px;text-align:center;color:#f87171;font-size:12px">${esc(error.data?.msg || 'Could not load the admin panel')}</div>`;
  }

  if (action) action.innerHTML = `<button id="admin-refresh" class="sb-item" style="width:100%;justify-content:center"><span class="material-icons-round mi">refresh</span><span>Refresh panel</span></button>`;
  document.getElementById('admin-refresh')?.addEventListener('click', renderAdmin);
}

// settings

function settingToggleHtml(id, key, title, description, defaultValue) {
  return `<div class="setting-row">
    <div class="setting-copy"><div class="setting-title">${esc(title)}</div><div class="setting-desc">${esc(description)}</div></div>
    <label class="mini-switch"><input id="${esc(id)}" data-chat-setting="${esc(key)}" type="checkbox" ${getChatBool(key, defaultValue) ? 'checked' : ''}><span></span></label>
  </div>`;
}

function settingsGroupHtml(icon, title, content) {
  return `<div class="settings-group"><div class="settings-heading"><span class="material-icons-round">${esc(icon)}</span>${esc(title)}</div>${content}</div>`;
}

async function populateVoiceDeviceSettings() {
  if (!navigator.mediaDevices?.enumerateDevices) return;
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const fill = (id, kind, savedKey, fallback) => {
      const select = document.getElementById(id);
      if (!select) return;
      const matches = devices.filter(device => device.kind === kind);
      select.innerHTML = `<option value="">${esc(fallback)}</option>` + matches.map((device, index) =>
        `<option value="${esc(device.deviceId)}">${esc(device.label || `${kind === 'audioinput' ? 'Microphone' : 'Speaker'} ${index + 1}`)}</option>`
      ).join('');
      select.value = localStorage.getItem(savedKey) || '';
    };
    fill('voice-input-device', 'audioinput', 'voiceInputDevice', 'Default microphone');
    fill('voice-output-device', 'audiooutput', 'voiceOutputDevice', 'Default speakers');
  } catch {}
}

function applyVoiceOutputPreferences() {
  const volume = Math.max(0, Math.min(1, Number(localStorage.getItem('voiceOutputVolume') || 100) / 100));
  const outputDevice = localStorage.getItem('voiceOutputDevice') || '';
  for (const peer of S.voice.peers.values()) {
    peer.audioEl.volume = volume;
    if (typeof peer.audioEl.setSinkId === 'function') peer.audioEl.setSinkId(outputDevice).catch(() => {});
  }
}

function renderSettings() {
  const list = document.getElementById('section-list');
  const action = document.getElementById('section-action');
  if (!list) return;
  list.classList.add('settings-list');
  const u = S.user;
  const name = u?.displayName || u?.name || u?.username || '?';
  const color = avatarColor(name);
  const notifyGranted = typeof Notification !== 'undefined' && Notification.permission === 'granted';

  const avatarHtml = u?.avatar
    ? `<img src="${esc(u.avatar)}" style="width:100%;height:100%;object-fit:cover"
         onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">`
      + `<span style="display:none;width:100%;height:100%;align-items:center;justify-content:center;font-size:22px;font-weight:700;color:#fff">${esc(avatarInitials(name))}</span>`
    : `<span style="font-size:22px;font-weight:700;color:#fff">${esc(avatarInitials(name))}</span>`;

  const roleBadge = (() => {
    const r = String(u?.role || 'user').toLowerCase();
    const map = { owner: ['#fbbf24','Owner'], admin: ['#f87171','Admin'], mod: ['#60a5fa','Mod'], seller: ['#4ade80','Seller'] };
    const [col, label] = map[r] || [];
    return col ? `<span style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;padding:2px 6px;border-radius:4px;background:${col}20;color:${col}">${label}</span>` : '';
  })();

  const badges = [
    u?.is_premium ? `<span style="font-size:9px;font-weight:700;padding:2px 6px;border-radius:4px;background:rgba(139,92,246,.2);color:#c4b5fd;letter-spacing:.04em">PREMIUM</span>` : '',
    u?.is_booster ? `<span style="font-size:9px;font-weight:700;padding:2px 6px;border-radius:4px;background:rgba(236,72,153,.2);color:#f9a8d4;letter-spacing:.04em">BOOSTER</span>` : '',
  ].filter(Boolean).join('');

  list.innerHTML = `
    ${settingsGroupHtml('notifications', 'Notifications', `
      <div style="padding:2px 7px 6px"><button id="notify-btn" class="sb-item" style="width:100%;background:${notifyGranted && getChatBool('chatNotifications', false) ? 'rgba(74,222,128,.1)' : 'rgba(255,255,255,.04)'}">
        <span class="material-icons-round mi" style="color:${notifyGranted && getChatBool('chatNotifications', false) ? '#4ade80' : '#71717a'}">${notifyGranted && getChatBool('chatNotifications', false) ? 'notifications_active' : 'notifications_none'}</span>
        <span style="color:${notifyGranted && getChatBool('chatNotifications', false) ? '#4ade80' : '#a1a1aa'}">${notifyGranted && getChatBool('chatNotifications', false) ? 'Desktop alerts on' : 'Enable desktop alerts'}</span>
      </button></div>` +
      settingToggleHtml('setting-preview', 'chatNotificationPreviews', 'Message previews', 'Include message text in notifications', true)
    )}
    <div class="settings-profile-card">
      <div style="width:58px;height:58px;border-radius:17px;background:${u?.avatar ? 'transparent' : color};display:flex;align-items:center;justify-content:center;overflow:hidden;flex-shrink:0;box-shadow:0 4px 16px rgba(0,0,0,.4)">
        ${avatarHtml}
      </div>
      <div class="settings-profile-meta">
        <div class="settings-profile-name">${esc(name)}</div>
        <div class="settings-profile-coins"><span class="material-icons-round" style="font-size:15px">toll</span>${esc(String(u?.coins ?? 0))} coins</div>
        ${roleBadge || badges ? `<div style="display:flex;align-items:center;flex-wrap:wrap;gap:4px">${roleBadge}${badges}</div>` : ''}
      </div>
      <button id="profile-edit-btn" type="button" title="Edit profile" style="display:flex;align-items:center;justify-content:center;gap:5px;flex-shrink:0;padding:9px 11px;border-radius:10px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.055);color:#d4d4d8;font:800 11px 'Inter',sans-serif;cursor:pointer"><span class="material-icons-round" style="font-size:15px">edit</span>Edit</button>
    </div>
    ${settingsGroupHtml('radio_button_checked', 'Presence', `
      <div class="setting-row" style="display:block"><div class="setting-title">Status</div>
        <select id="presence-status" class="setting-select">
          <option value="online" ${S.presenceStatus === 'online' ? 'selected' : ''}>Online</option>
          <option value="idle" ${S.presenceStatus === 'idle' ? 'selected' : ''}>Idle</option>
          <option value="dnd" ${S.presenceStatus === 'dnd' ? 'selected' : ''}>Do not disturb</option>
          <option value="invisible" ${S.presenceStatus === 'invisible' ? 'selected' : ''}>Invisible</option>
        </select>
      </div>
      <div class="setting-row" style="display:block"><div class="setting-title">Custom status</div>
        <input id="presence-custom-status" class="setting-select" maxlength="80" value="${esc(S.customStatus)}" placeholder="What are you up to?">
      </div>`) }
    ${settingsGroupHtml('chat', 'Messages',
      settingToggleHtml('setting-enter-send', 'chatEnterToSend', 'Enter to send', 'Shift+Enter makes a new line', true) +
      settingToggleHtml('setting-spellcheck', 'chatSpellcheck', 'Spell check', 'Underline possible spelling mistakes', true) +
      settingToggleHtml('setting-typing', 'chatTypingIndicators', 'Typing indicators', 'Show when you or other people are typing', true) +
      settingToggleHtml('setting-coins', 'chatCoinPopups', 'Coin popups', 'Show the small coin reward popup', true)
    )}
    ${settingsGroupHtml('visibility', 'Display',
      settingToggleHtml('setting-compact', 'chatCompactMode', 'Compact messages', 'Fit more messages on screen', false) +
      settingToggleHtml('setting-members', 'chatShowMembers', 'Member list', 'Keep the member panel visible', true) +
      settingToggleHtml('setting-clock', 'chat24HourTime', '24-hour time', 'Use 18:30 instead of 6:30 PM', false) +
      settingToggleHtml('setting-animations', 'chatAnimations', 'Animations', 'Enable motion and message effects', true)
    )}
    ${settingsGroupHtml('graphic_eq', 'Voice & Audio', `
      <div style="padding:2px 7px 5px"><button id="voice-detect-devices" class="sb-item" style="width:100%;background:rgba(0,153,255,.09);color:#7dd3fc"><span class="material-icons-round mi">refresh</span><span>Detect audio devices</span></button></div>
      <div class="setting-row" style="display:block"><div class="setting-title">Input device</div><select id="voice-input-device" class="setting-select"><option value="">Default microphone</option></select></div>
      <div class="setting-row" style="display:block"><div class="setting-title">Output device</div><select id="voice-output-device" class="setting-select"><option value="">Default speakers</option></select></div>
      <div class="setting-row" style="display:block"><div class="setting-copy"><div class="setting-title">Output volume <span id="voice-volume-value" style="color:#60a5fa">${esc(localStorage.getItem('voiceOutputVolume') || '100')}%</span></div><div class="setting-desc">Volume of other people in voice chat</div></div><input id="voice-output-volume" class="setting-range" type="range" min="0" max="100" value="${esc(localStorage.getItem('voiceOutputVolume') || '100')}"></div>` +
      settingToggleHtml('setting-voice-mute', 'voiceMuteOnJoin', 'Mute on join', 'Join voice with your microphone muted', false) +
      settingToggleHtml('setting-voice-noise', 'voiceNoiseSuppression', 'Noise suppression', 'Reduce background noise from your mic', true) +
      settingToggleHtml('setting-voice-echo', 'voiceEchoCancellation', 'Echo cancellation', 'Reduce speaker echo in your mic', true) +
      settingToggleHtml('setting-voice-gain', 'voiceAutoGain', 'Automatic gain', 'Automatically balance microphone volume', true)
    )}`;

  if (action) {
    action.innerHTML = `<button id="logout-btn" style="width:100%;display:flex;align-items:center;justify-content:center;gap:7px;padding:8px;border-radius:9px;border:none;background:rgba(248,113,113,.1);color:#f87171;font-size:13px;font-weight:600;cursor:pointer;font-family:'Inter',sans-serif">
      <span class="material-icons-round" style="font-size:16px">logout</span>Sign Out
    </button>`;
    document.getElementById('logout-btn')?.addEventListener('click', logout);
  }

  document.getElementById('notify-btn')?.addEventListener('click', async () => {
    if (getChatBool('chatNotifications', false)) {
      localStorage.setItem('chatNotifications', 'false');
      toast('Notifications disabled', 'info');
    } else {
      const granted = await requestNotifyPermission();
      toast(granted ? 'Notifications enabled!' : 'Notifications blocked', granted ? 'success' : 'error');
    }
    renderSettings();
  });
  document.getElementById('profile-edit-btn')?.addEventListener('click', openProfileEditor);
  const presenceStatus = document.getElementById('presence-status');
  const presenceCustomStatus = document.getElementById('presence-custom-status');
  const savePresence = () => {
    S.presenceStatus = presenceStatus?.value || S.presenceStatus;
    S.customStatus = String(presenceCustomStatus?.value || '').trim().slice(0, 80);
    localStorage.setItem('chatPresenceStatus', S.presenceStatus);
    localStorage.setItem('chatCustomStatus', S.customStatus);
    S.socket?.emit('presence_ping', presencePayload());
    syncSelfMemberAvatarEffect();
  };
  presenceStatus?.addEventListener('change', savePresence);
  presenceCustomStatus?.addEventListener('change', savePresence);

  document.querySelectorAll('[data-chat-setting]').forEach(input => {
    input.addEventListener('change', () => {
      localStorage.setItem(input.dataset.chatSetting, String(input.checked));
      applyChatPreferences();
    });
  });

  const voiceInput = document.getElementById('voice-input-device');
  const voiceOutput = document.getElementById('voice-output-device');
  const voiceVolume = document.getElementById('voice-output-volume');
  voiceInput?.addEventListener('change', () => localStorage.setItem('voiceInputDevice', voiceInput.value));
  voiceOutput?.addEventListener('change', () => {
    localStorage.setItem('voiceOutputDevice', voiceOutput.value);
    applyVoiceOutputPreferences();
  });
  voiceVolume?.addEventListener('input', () => {
    localStorage.setItem('voiceOutputVolume', voiceVolume.value);
    const value = document.getElementById('voice-volume-value');
    if (value) value.textContent = `${voiceVolume.value}%`;
    applyVoiceOutputPreferences();
  });
  document.getElementById('voice-detect-devices')?.addEventListener('click', async () => {
    try {
      const permissionStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      permissionStream.getTracks().forEach(track => track.stop());
      await populateVoiceDeviceSettings();
      toast('Audio devices detected', 'success');
    } catch {
      toast('Microphone permission is needed to detect device names', 'error');
    }
  });
  void populateVoiceDeviceSettings();

  const setAccountStatus = (id, message, type = 'info') => {
    const element = document.getElementById(id);
    if (!element) return;
    element.textContent = message;
    element.style.color = type === 'error' ? '#fca5a5' : type === 'success' ? '#86efac' : '#a1a1aa';
  };

  document.getElementById('profile-username-save')?.addEventListener('click', async () => {
    const input = document.getElementById('profile-username-input');
    const button = document.getElementById('profile-username-save');
    const username = String(input?.value || '').trim();
    if (!/^[A-Za-z0-9_]{3,24}$/.test(username)) {
      setAccountStatus('profile-username-status', 'Use 3–24 letters, numbers, or underscores.', 'error');
      return;
    }
    button.disabled = true;
    setAccountStatus('profile-username-status', 'Saving username…');
    try {
      const data = await api('/api/account/profile/username', { method:'PUT', body:{ username } });
      if (data?.user) setUser({ ...(S.user || {}), ...data.user });
      updateNavAvatar();
      toast(data?.msg || 'Username updated', 'success');
      renderSettings();
    } catch (error) {
      setAccountStatus('profile-username-status', error?.data?.msg || 'Could not update username', 'error');
      button.disabled = false;
    }
  });

  document.getElementById('profile-password-save')?.addEventListener('click', async () => {
    const currentInput = document.getElementById('profile-current-password');
    const newInput = document.getElementById('profile-new-password');
    const confirmInput = document.getElementById('profile-confirm-password');
    const button = document.getElementById('profile-password-save');
    const currentPassword = currentInput?.value || '';
    const newPassword = newInput?.value || '';
    const confirmation = confirmInput?.value || '';
    if (!currentPassword) {
      setAccountStatus('profile-password-status', 'Enter your current password.', 'error');
      return;
    }
    if (newPassword.length < 8 || newPassword.length > 128) {
      setAccountStatus('profile-password-status', 'New password must be 8–128 characters.', 'error');
      return;
    }
    if (newPassword !== confirmation) {
      setAccountStatus('profile-password-status', 'New passwords do not match.', 'error');
      return;
    }
    button.disabled = true;
    setAccountStatus('profile-password-status', 'Updating password…');
    try {
      const data = await api('/api/account/profile/password', { method:'PUT', body:{ currentPassword, newPassword } });
      applyAccountUpdate(data);
      currentInput.value = '';
      newInput.value = '';
      confirmInput.value = '';
      setAccountStatus('profile-password-status', data?.msg || 'Password updated', 'success');
      toast(data?.msg || 'Password updated', 'success');
    } catch (error) {
      setAccountStatus('profile-password-status', error?.data?.msg || 'Could not update password', 'error');
    } finally {
      button.disabled = false;
    }
  });

  const avatarInput = document.getElementById('profile-avatar-input');
  const avatarStatus = document.getElementById('profile-avatar-status');
  const setAvatarStatus = (message, type = 'info') => {
    if (!avatarStatus) return;
    avatarStatus.textContent = message;
    avatarStatus.style.color = type === 'error' ? '#fca5a5' : type === 'success' ? '#86efac' : '#a1a1aa';
  };

  document.getElementById('profile-avatar-choose')?.addEventListener('click', () => avatarInput?.click());
  avatarInput?.addEventListener('change', async () => {
    const file = avatarInput.files?.[0];
    if (!file) return;
    try {
      setAvatarStatus('Processing image…');
      const avatar = await window.NebuloProfileAvatar.prepareAvatarFile(file);
      setAvatarStatus('Saving profile picture…');
      const data = await api('/api/account/profile/avatar', { method: 'PUT', body: { avatar } });
      applyAccountUpdate(data, { avatar: data.user?.avatar || data.user?.avatar_url || null });
      updateNavAvatar();
      toast(data?.msg || 'Profile picture updated', 'success');
      renderSettings();
    } catch (error) {
      setAvatarStatus(error?.data?.msg || error.message || 'Could not update profile picture', 'error');
    } finally {
      avatarInput.value = '';
    }
  });

  document.getElementById('profile-avatar-remove')?.addEventListener('click', async () => {
    try {
      setAvatarStatus('Removing profile picture…');
      const data = await api('/api/account/profile/avatar', { method: 'PUT', body: { avatar: null } });
      applyAccountUpdate(data, { avatar: null, avatar_url: null });
      updateNavAvatar();
      toast(data?.msg || 'Profile picture removed', 'success');
      renderSettings();
    } catch (error) {
      setAvatarStatus(error?.data?.msg || error.message || 'Could not remove profile picture', 'error');
    }
  });
}

function openProfileEditor() {
  const user = S.user || {};
  const username = user.username || '';
  const name = user.displayName || user.name || username;
  const preview = user.avatar
    ? `<img src="${esc(user.avatar)}" style="width:100%;height:100%;object-fit:cover">`
    : `<span style="font-size:21px;font-weight:800;color:#fff">${esc(avatarInitials(name || '?'))}</span>`;

  openModal(`<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
      <div><h3 style="font-size:17px;font-weight:800;color:#fff;margin:0">Edit profile</h3><p style="font-size:10px;color:#71717a;margin:4px 0 0">Choose how people see you, manage your handle, or change your password.</p></div>
      <button type="button" onclick="closeModal()" style="width:31px;height:31px;border-radius:9px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.04);color:#a1a1aa;cursor:pointer"><span class="material-icons-round" style="font-size:17px">close</span></button>
    </div>
    <div style="display:flex;align-items:center;gap:12px;padding:11px;border-radius:13px;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.07);margin-bottom:14px">
      <div id="profile-editor-avatar" style="width:58px;height:58px;flex:0 0 58px;border-radius:17px;overflow:hidden;display:flex;align-items:center;justify-content:center;background:${avatarColor(name)}">${preview}</div>
      <div style="flex:1;min-width:0"><div style="font-size:12px;font-weight:750;color:#e4e4e7">Profile picture</div><div style="font-size:9px;color:#71717a;margin-top:2px">PNG, JPEG, WebP, GIF, or AVIF</div>
        <div style="display:flex;gap:6px;margin-top:8px"><button id="editor-avatar-choose" class="modal-btn modal-btn-primary" type="button" style="padding:7px 9px;flex:0 1 auto">Choose image</button><button id="editor-avatar-remove" class="modal-btn modal-btn-ghost" type="button" style="padding:7px 9px;flex:0 1 auto" ${user.avatar ? '' : 'disabled'}>Remove</button></div>
      </div><input id="editor-avatar-input" type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" style="display:none">
    </div>
    <div id="profile-editor-status" role="status" style="display:none;padding:8px 10px;border-radius:9px;margin-bottom:12px;font-size:10px"></div>
    <div style="padding:12px;border-radius:13px;background:rgba(255,255,255,.025);border:1px solid rgba(255,255,255,.07);margin-bottom:12px">
      <div style="font-size:11px;font-weight:750;color:#d4d4d8;margin-bottom:9px">Display name</div>
      <div style="display:flex;gap:7px"><input id="editor-display-name" class="modal-input" value="${esc(name)}" minlength="2" maxlength="32" autocomplete="nickname" style="min-width:0;flex:1"><button id="editor-display-name-save" class="modal-btn modal-btn-primary" type="button" style="flex:0 0 auto;padding:8px 12px">Save</button></div>
      <div style="font-size:9px;line-height:1.4;color:#71717a;margin-top:7px">Shown in chat. Spaces, symbols, punctuation, and emoji are supported.</div>
    </div>
    <div style="padding:12px;border-radius:13px;background:rgba(255,255,255,.025);border:1px solid rgba(255,255,255,.07);margin-bottom:12px">
      <div style="font-size:11px;font-weight:750;color:#d4d4d8;margin-bottom:9px">Username</div>
      <div style="display:flex;gap:7px"><input id="editor-username" class="modal-input" value="${esc(username)}" maxlength="24" autocomplete="username" style="min-width:0;flex:1"><button id="editor-username-save" class="modal-btn modal-btn-primary" type="button" style="flex:0 0 auto;padding:8px 12px">Save</button></div>
      <div style="font-size:9px;line-height:1.4;color:#71717a;margin-top:7px">Your stable sign-in and friend handle. Use letters, numbers, or underscores.</div>
    </div>
    <div style="padding:12px;border-radius:13px;background:rgba(255,255,255,.025);border:1px solid rgba(255,255,255,.07)">
      <div style="font-size:11px;font-weight:750;color:#d4d4d8;margin-bottom:9px">Change password</div>
      <input id="editor-current-password" class="modal-input" type="password" autocomplete="current-password" placeholder="Current password" style="margin-bottom:7px">
      <input id="editor-new-password" class="modal-input" type="password" minlength="8" maxlength="128" autocomplete="new-password" placeholder="New password" style="margin-bottom:7px">
      <input id="editor-confirm-password" class="modal-input" type="password" minlength="8" maxlength="128" autocomplete="new-password" placeholder="Confirm new password" style="margin-bottom:8px">
      <label style="display:flex;align-items:center;gap:7px;margin:0 0 9px;color:#a1a1aa;font-size:11px;cursor:pointer;user-select:none">
        <input id="editor-show-passwords" type="checkbox" style="accent-color:#0099ff">
        <span>Show passwords</span>
      </label>
      <button id="editor-password-save" class="modal-btn modal-btn-primary" type="button" style="width:100%">Update password</button>
      <div style="font-size:9px;line-height:1.4;color:#71717a;margin-top:7px">Uses your current password to protect the change, then keeps you signed in.</div>
    </div>`);

  const status = (message, type = 'info') => {
    const el = document.getElementById('profile-editor-status');
    if (!el) return;
    el.style.display = message ? 'block' : 'none';
    el.textContent = message;
    el.style.color = type === 'error' ? '#fca5a5' : type === 'success' ? '#86efac' : '#a1a1aa';
    el.style.background = type === 'error' ? 'rgba(248,113,113,.08)' : type === 'success' ? 'rgba(74,222,128,.08)' : 'rgba(255,255,255,.04)';
  };

  const fileInput = document.getElementById('editor-avatar-input');
  document.getElementById('editor-show-passwords')?.addEventListener('change', (event) => {
    const type = event.target.checked ? 'text' : 'password';
    ['editor-current-password', 'editor-new-password', 'editor-confirm-password'].forEach(id => {
      const input = document.getElementById(id);
      if (input) input.type = type;
    });
  });
  document.getElementById('editor-avatar-choose')?.addEventListener('click', () => fileInput?.click());
  fileInput?.addEventListener('change', async () => {
    const file = fileInput.files?.[0];
    if (!file) return;
    try {
      status('Processing and saving your profile picture…');
      const avatar = await window.NebuloProfileAvatar.prepareAvatarFile(file);
      const data = await api('/api/account/profile/avatar', { method:'PUT', body:{ avatar } });
      applyAccountUpdate(data, { avatar:data.user?.avatar || data.user?.avatar_url || avatar });
      updateNavAvatar();
      closeModal();
      renderSettings();
      toast(data?.msg || 'Profile picture updated', 'success');
    } catch (error) { status(error?.data?.msg || error.message || 'Could not update profile picture', 'error'); }
    finally { fileInput.value = ''; }
  });

  document.getElementById('editor-avatar-remove')?.addEventListener('click', async () => {
    try {
      status('Removing profile picture…');
      const data = await api('/api/account/profile/avatar', { method:'PUT', body:{ avatar:null } });
      applyAccountUpdate(data, { avatar:null, avatar_url:null });
      updateNavAvatar();
      closeModal();
      renderSettings();
      toast(data?.msg || 'Profile picture removed', 'success');
    } catch (error) { status(error?.data?.msg || 'Could not remove profile picture', 'error'); }
  });

  document.getElementById('editor-display-name-save')?.addEventListener('click', async () => {
    const input = document.getElementById('editor-display-name');
    const button = document.getElementById('editor-display-name-save');
    const displayName = String(input?.value || '').normalize('NFKC').replace(/\s+/g, ' ').trim();
    if ([...displayName].length < 2 || [...displayName].length > 32 || /[\u0000-\u001F\u007F]/.test(displayName)) {
      return status('Display name must be 2–32 visible characters.', 'error');
    }
    button.disabled = true;
    try {
      status('Saving display name…');
      const data = await api('/api/account/profile/display-name', { method:'PUT', body:{ displayName } });
      applyAccountUpdate(data);
      updateNavAvatar();
      closeModal();
      renderSettings();
      toast(data?.msg || 'Display name updated', 'success');
    } catch (error) { status(error?.data?.msg || 'Could not update display name', 'error'); button.disabled = false; }
  });

  document.getElementById('editor-username-save')?.addEventListener('click', async () => {
    const input = document.getElementById('editor-username');
    const button = document.getElementById('editor-username-save');
    const username = String(input?.value || '').trim();
    if (!/^[A-Za-z0-9_]{3,24}$/.test(username)) return status('Use 3–24 letters, numbers, or underscores.', 'error');
    button.disabled = true;
    try {
      status('Saving username…');
      const data = await api('/api/account/profile/username', { method:'PUT', body:{ username } });
      applyAccountUpdate(data);
      updateNavAvatar();
      closeModal();
      renderSettings();
      toast(data?.msg || 'Username updated', 'success');
    } catch (error) { status(error?.data?.msg || 'Could not update username', 'error'); button.disabled = false; }
  });

  document.getElementById('editor-password-save')?.addEventListener('click', async () => {
    const currentInput = document.getElementById('editor-current-password');
    const newInput = document.getElementById('editor-new-password');
    const confirmInput = document.getElementById('editor-confirm-password');
    const button = document.getElementById('editor-password-save');
    const currentPassword = currentInput?.value || '';
    const newPassword = newInput?.value || '';
    if (!currentPassword) return status('Enter your current password.', 'error');
    if (newPassword.length < 8 || newPassword.length > 128) return status('New password must be 8–128 characters.', 'error');
    if (newPassword !== (confirmInput?.value || '')) return status('New passwords do not match.', 'error');
    button.disabled = true;
    try {
      status('Updating password…');
      const data = await api('/api/account/profile/password', { method:'PUT', body:{ currentPassword, newPassword } });
      applyAccountUpdate(data);
      currentInput.value = ''; newInput.value = ''; confirmInput.value = '';
      status(data?.msg || 'Password updated', 'success');
      toast(data?.msg || 'Password updated', 'success');
    } catch (error) { status(error?.data?.msg || 'Could not update password', 'error'); }
    finally { button.disabled = false; }
  });
}

// ─── Cosmetics Shop ────────────────────────────────────────────────────────────

async function renderCosmeticsSidebarLegacy() {
  const list = document.getElementById('section-list');
  const action = document.getElementById('section-action');
  if (!list) return;

  const coins = S.user?.coins ?? 0;
  const ownedEffects = new Set(Array.isArray(S.user?.ownedEffects) ? S.user.ownedEffects : ['none']);
  const ownedEffectAliases = new Map([
    ['gradient', 'plasma'],
    ['bubble', 'bubblegum'],
    ['holographic', 'hologram'],
    ['galaxy', 'void']
  ]);
  const ownedAvatarEffects = new Set(Array.isArray(S.user?.ownedAvatarEffects) ? S.user.ownedAvatarEffects : ['none']);
  const ownedTags = new Set(Array.isArray(S.user?.ownedTags) ? S.user.ownedTags : ['none']);
  const ownedBanners = new Set(Array.isArray(S.user?.ownedBanners) ? S.user.ownedBanners : ['none']);

  if (action) action.innerHTML = `<div style="display:flex;align-items:center;gap:6px;padding:4px;background:rgba(251,191,36,.08);border-radius:10px;font-size:12px;color:#fbbf24">
    <span class="material-icons-round" style="font-size:16px">toll</span>
    <strong>${coins.toLocaleString()}</strong> coins
  </div>`;

  function effectStoreItem(e) {
    const alias = ownedEffectAliases.get(e.id);
    const isOwned = ownedEffects.has(e.id) || (alias ? ownedEffects.has(alias) : false);
    const isActive = S.equippedEffect === e.id || (alias && S.equippedEffect === alias);
    const badge = isActive
      ? '<span class="store-status-on">ON</span>'
      : isOwned && e.id !== 'none'
        ? '<span class="store-status-owned">owned</span>'
        : e.price > 0
          ? '<span class="store-price">' + e.price + 'c</span>'
          : '';
    return messageEffectPreviewHtml(e, {
      active: isActive,
      locked: !isOwned && e.id !== 'none',
      status: badge,
      effectId: alias && ownedEffects.has(alias) && !ownedEffects.has(e.id) ? alias : e.id,
      onclick: 'setEquippedEffectFromCosmetics'
    });
  }

  function tagStoreItem(tag) {
    const isOwned = ownedTags.has(tag.id);
    const isActive = S.equippedTag === tag.id;
    const badge = isActive ? '<span class="store-status-on">ON</span>' : isOwned ? '<span class="store-status-owned">owned</span>' : '<span class="store-price">' + tag.price + 'c</span>';
    return '<div class="effect-item' + (isActive?' active':'') + '" onclick="setEquippedTagFromCosmetics(\x27' + esc(tag.id) + '\x27)" style="' + (!isOwned?'opacity:.78':'') + '">'
      + '<span class="' + esc(tagClassName(tag)) + '">' + esc(tag.name) + '</span>'
      + '<span style="flex:1"></span>' + badge
      + '</div>';
  }

  function bannerStoreItem(banner) {
    const isOwned = ownedBanners.has(banner.id);
    const isActive = S.equippedBanner === banner.id;
    const badge = isActive ? '<span class="store-status-on">ON</span>' : isOwned ? '<span class="store-status-owned">owned</span>' : '<span class="store-price">' + banner.price + 'c</span>';
    return '<div class="effect-item' + (isActive?' active':'') + '" onclick="setEquippedBannerFromCosmetics(\x27' + esc(banner.id) + '\x27)" style="' + (!isOwned?'opacity:.78':'') + '">'
      + '<span class="banner-store-preview member-banner-' + esc(banner.id.slice(7)) + '"></span><span style="flex:1">' + esc(banner.name) + '</span>' + badge
      + '</div>';
  }

  function avatarStoreItem(effect) {
    const isOwned = ownedAvatarEffects.has(effect.id);
    const isActive = S.equippedAvatarEffect === effect.id;
    const badge = isActive ? '<span class="store-status-on">ON</span>' : isOwned ? '<span class="store-status-owned">owned</span>' : '<span class="store-price">' + effect.price + 'c</span>';
    return '<div class="effect-item effect-item-preview' + (isActive?' active':'') + '" onclick="setEquippedAvatarEffectFromCosmetics(\x27' + esc(effect.id) + '\x27)" style="' + (!isOwned?'opacity:.78':'') + '">'
      + '<span class="avatar-store-preview avatar-fx-wrap' + avatarEffectClass(effect.id) + '" style="--avatar-size:34px"><span class="msg-avatar" style="width:34px;height:34px;border-radius:10px;background:linear-gradient(135deg,#222a3c,#111827);font-size:10px;font-weight:800;color:#fff">UB</span></span>'
      + '<span style="flex:1;min-width:0"><span style="display:block;color:#e4e4e7;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + esc(effect.name) + '</span><span style="display:block;margin-top:2px;font-size:9px;color:#71717a">Animated avatar ring for every chat</span></span>'
      + badge
      + '</div>';
  }

  const msgEffects = EFFECTS.filter(e => e.scope === 'message' || e.id === 'none');
  const avatarEffects = EFFECTS.filter(e => e.scope === 'avatar');
  const tags = EFFECTS.filter(e => e.scope === 'tag');
  const banners = EFFECTS.filter(e => e.scope === 'banner');

  let html = '<div style="padding:2px 0">';

  html += '<div class="coin-store-card">'
    + '<div class="coin-store-top"><span class="coin-store-icon"><span class="material-icons-round" style="font-size:19px">paid</span></span>'
    + '<div class="coin-store-copy"><div class="coin-store-title">Purchase coins</div><div class="coin-store-balance"><strong>' + coins.toLocaleString() + '</strong> coins available</div></div></div>'
    + '<button class="coin-store-buy" onclick="openCoinStore()"><span class="material-icons-round" style="font-size:14px">storefront</span>Open coin shop</button></div>';

  // Message Effects
  html += '<div class="store-section-divider"><span class="material-icons-round" style="font-size:13px">auto_awesome</span><span>Message Effects</span></div>';
  html += '<div class="message-effect-grid">' + msgEffects.map(effectStoreItem).join('') + '</div>';

  // Avatar Effects
  html += '<div class="store-section-divider"><span class="material-icons-round" style="font-size:13px">blur_circular</span><span>Avatar Rings</span></div>';
  html += '<div class="effect-item' + (S.equippedAvatarEffect==='none'?' active':'') + '" onclick="setEquippedAvatarEffectFromCosmetics(\x27none\x27)">'
    + '<span class="avatar-store-preview avatar-fx-wrap" style="--avatar-size:34px"><span class="msg-avatar" style="width:34px;height:34px;border-radius:10px;background:#20202a;font-size:10px;font-weight:800;color:#71717a">UB</span></span><span style="flex:1">No avatar ring</span>'
    + (S.equippedAvatarEffect==='none' ? '<span class="store-status-on">ON</span>' : '<span class="store-status-owned">owned</span>')
    + '</div>';
  html += avatarEffects.map(avatarStoreItem).join('');

  // Tags
  html += '<div class="store-section-divider"><span class="material-icons-round" style="font-size:13px">local_offer</span><span>User Tags</span></div>';
  html += '<div class="effect-item' + (S.equippedTag==='none'?' active':'') + '" onclick="setEquippedTagFromCosmetics(\x27none\x27)">'
    + '<span class="user-tag user-tag-none">No tag</span><span style="flex:1"></span>'
    + (S.equippedTag==='none' ? '<span class="store-status-on">ON</span>' : '<span class="store-status-owned">owned</span>')
    + '</div>';
  html += tags.map(tagStoreItem).join('');

  // Banners
  html += '<div class="store-section-divider"><span class="material-icons-round" style="font-size:13px">flag</span><span>Member Banners</span></div>';
  html += '<div class="effect-item' + (S.equippedBanner==='none'?' active':'') + '" onclick="setEquippedBannerFromCosmetics(\x27none\x27)">'
    + '<span class="banner-store-preview" style="background:#20202a"></span><span style="flex:1">No banner</span>'
    + (S.equippedBanner==='none' ? '<span class="store-status-on">ON</span>' : '<span class="store-status-owned">owned</span>')
    + '</div>';
  html += banners.map(bannerStoreItem).join('');

  html += '</div>';
  list.innerHTML = html;
}

function cosmeticOwnedState(scope, id) {
  const map = {
    message: ['ownedEffects', 'equippedEffect'],
    avatar: ['ownedAvatarEffects', 'equippedAvatarEffect'],
    tag: ['ownedTags', 'equippedTag'],
    banner: ['ownedBanners', 'equippedBanner'],
    profile: ['ownedProfileEffects', 'equippedProfileEffect']
  };
  const [ownedKey, equippedKey] = map[scope] || [];
  const owned = id === 'none' || new Set(Array.isArray(S.user?.[ownedKey]) ? S.user[ownedKey] : ['none']).has(id);
  const active = String(S[equippedKey] || S.user?.[equippedKey] || 'none') === id;
  return { owned, active };
}

function cosmeticCard(effect, scope) {
  const id = effect.id;
  const state = cosmeticOwnedState(scope, id);
  const status = state.active ? '<span class="cosmetic-card-status active">Equipped</span>' : state.owned ? '<span class="cosmetic-card-status">Owned</span>' : '<span class="cosmetic-card-status preview">Preview</span>';
  let visual = '';
  if (id === 'none') {
    visual = '<span class="cosmetic-none-visual"><span class="material-icons-round">block</span></span>';
  } else if (scope === 'banner') {
    visual = `<span class="cosmetic-banner-visual member-banner-${esc(id.slice(7))}"></span>`;
  } else if (scope === 'profile') {
    visual = `<span class="cosmetic-profile-visual"><span class="profile-fx-demo profile-fx-demo-card profile-fx-raster-card profile-fx-host" data-profile-effect="${esc(id)}"><span class="profile-fx-demo-shell"><span></span><b>${esc((myUsername() || 'You').slice(0,8))}</b></span>${profileEffectStaticPreview(id)}</span></span>`;
  } else if (scope === 'message') {
    visual = `<span class="cosmetic-message-visual"><span class="msg-bubble ${esc(messageEffectClass(id))}">${messageMaterialContent(id, `<strong>${esc(myUsername() || 'Nebulo')}</strong><span>Preview message</span>`)}</span></span>`;
  } else if (scope === 'avatar') {
    visual = `<span class="cosmetic-avatar-visual">${avatarEl(myUsername() || 'You', 56, S.user?.avatar || S.user?.avatar_url || null, id)}</span>`;
  } else {
    visual = `<span class="cosmetic-tag-visual">${tagBadgeHtml(effect)}</span>`;
  }
  const motionEvents = scope === 'profile' && id !== 'none' ? ' onmouseenter="setProfileCardEffectMotion(this,true)" onmouseleave="setProfileCardEffectMotion(this,false)"' : '';
  return `<button type="button" class="cosmetic-shop-card cosmetic-shop-card-${scope}${state.active ? ' active' : ''}" data-name="${esc(effect.name.toLowerCase())}" onclick="openCosmeticPreview('${esc(scope)}','${esc(id)}')"${motionEvents}>
    ${visual}<span class="cosmetic-card-copy"><strong>${esc(effect.name)}</strong>${status}</span>
  </button>`;
}

const TAG_EFFECT_NAMES = Object.freeze({ none:'None', neon:'Neon', shimmer:'Shimmer', pulse:'Soft Pulse', prism:'Prism', glitch:'Glitch' });

function tagEditorPreviewHtml(tag = {}) {
  const color = /^#[0-9a-f]{6}$/i.test(String(tag.color || '')) ? tag.color : '#818cf8';
  const effect = TAG_EFFECT_NAMES[tag.effect] ? tag.effect : 'none';
  return `<span class="user-tag user-tag-custom_preview${tagEffectClass(effect)}" style="color:${color};background:color-mix(in srgb,${color} 11%,transparent);border-color:color-mix(in srgb,${color} 22%,transparent)">${esc(tag.name || 'Tag preview')}</span>`;
}

function tagManagerMarkup(data = {}) {
  const active = Array.isArray(data.active) ? data.active : [];
  const hidden = Array.isArray(data.hidden) ? data.hidden : [];
  const effects = Array.isArray(data.effects) ? data.effects : Object.keys(TAG_EFFECT_NAMES);
  return `<section class="owner-tag-manager-page">
    <div class="owner-tag-editor">
      <div class="owner-tag-editor-preview" id="owner-tag-editor-preview">${tagEditorPreviewHtml({ name:'Tag preview', color:'#818cf8', effect:'none' })}</div>
      <div class="owner-tag-editor-fields">
        <input id="owner-tag-edit-id" type="hidden">
        <label><span>Name</span><input id="owner-tag-name" class="modal-input" maxlength="24" placeholder="Tag name"></label>
        <label><span>Price</span><input id="owner-tag-price" class="modal-input" type="number" min="0" max="100000" step="1" value="1000"></label>
        <label><span>Color</span><input id="owner-tag-color" class="owner-tag-color" type="color" value="#818cf8"></label>
        <label><span>Effect</span><select id="owner-tag-effect" class="setting-select">${effects.map(effect => `<option value="${esc(effect)}">${esc(TAG_EFFECT_NAMES[effect] || effect)}</option>`).join('')}</select></label>
        <label class="owner-tag-description"><span>Description</span><input id="owner-tag-description" class="modal-input" maxlength="140" placeholder="Short shop description"></label>
        <div class="owner-tag-editor-actions"><button id="owner-tag-cancel" class="cosmetics-icon-button" style="display:none">Cancel</button><button id="owner-tag-save" class="modal-btn modal-btn-primary">Create tag</button></div>
        <div id="owner-tag-status" class="owner-tag-status" role="status"></div>
      </div>
    </div>
    <div class="owner-tag-list-head"><div><h3>Available tags</h3><p>Edit built-in and custom tags. Changes update the public shop.</p></div><span>${active.length}</span></div>
    <div class="owner-tag-list">${active.map(tag => `<article class="owner-tag-row" data-managed-tag-id="${esc(tag.id)}"><div class="owner-tag-row-preview">${tagBadgeHtml(tag)}</div><div class="owner-tag-row-copy"><strong>${esc(tag.name)}</strong><span>${esc(tag.source === 'custom' ? 'Custom' : 'Built-in')} · ${Number(tag.price || 0).toLocaleString()} coins · ${esc(TAG_EFFECT_NAMES[tag.effect] || 'None')}</span></div><button data-owner-tag-edit class="cosmetics-icon-button" title="Edit ${esc(tag.name)}"><span class="material-icons-round">edit</span></button><button data-owner-tag-remove class="cosmetics-icon-button owner-tag-delete" title="Remove ${esc(tag.name)}"><span class="material-icons-round">delete</span></button></article>`).join('')}</div>
    ${hidden.length ? `<div class="owner-tag-list-head owner-tag-hidden-head"><div><h3>Hidden tags</h3><p>Restore a built-in tag to return it to the shop.</p></div><span>${hidden.length}</span></div><div class="owner-tag-list">${hidden.map(tag => `<article class="owner-tag-row muted" data-managed-tag-id="${esc(tag.id)}"><div class="owner-tag-row-preview">${tagEditorPreviewHtml(tag)}</div><div class="owner-tag-row-copy"><strong>${esc(tag.name)}</strong><span>Hidden built-in tag</span></div><button data-owner-tag-restore class="cosmetics-icon-button"><span class="material-icons-round">restore</span><span>Restore</span></button></article>`).join('')}</div>` : ''}
  </section>`;
}

function bindTagManager(data = {}) {
  const active = Array.isArray(data.active) ? data.active : [];
  const byId = new Map(active.map(tag => [tag.id, tag]));
  const fields = {
    id: document.getElementById('owner-tag-edit-id'),
    name: document.getElementById('owner-tag-name'),
    price: document.getElementById('owner-tag-price'),
    color: document.getElementById('owner-tag-color'),
    effect: document.getElementById('owner-tag-effect'),
    description: document.getElementById('owner-tag-description')
  };
  const updatePreview = () => {
    const host = document.getElementById('owner-tag-editor-preview');
    if (host) host.innerHTML = tagEditorPreviewHtml({ name:fields.name?.value || 'Tag preview', color:fields.color?.value, effect:fields.effect?.value });
  };
  const reset = () => {
    if (fields.id) fields.id.value = '';
    if (fields.name) fields.name.value = '';
    if (fields.price) fields.price.value = '1000';
    if (fields.color) fields.color.value = '#818cf8';
    if (fields.effect) fields.effect.value = 'none';
    if (fields.description) fields.description.value = '';
    const save = document.getElementById('owner-tag-save');
    const cancel = document.getElementById('owner-tag-cancel');
    if (save) save.textContent = 'Create tag';
    if (cancel) cancel.style.display = 'none';
    updatePreview();
  };
  [fields.name, fields.color, fields.effect].forEach(field => field?.addEventListener('input', updatePreview));
  document.getElementById('owner-tag-cancel')?.addEventListener('click', reset);
  document.querySelectorAll('[data-owner-tag-edit]').forEach(button => button.addEventListener('click', () => {
    const tag = byId.get(button.closest('[data-managed-tag-id]')?.dataset.managedTagId);
    if (!tag) return;
    fields.id.value = tag.id;
    fields.name.value = tag.name;
    fields.price.value = String(tag.price);
    fields.color.value = tag.color;
    fields.effect.value = tag.effect || 'none';
    fields.description.value = tag.description || '';
    document.getElementById('owner-tag-save').textContent = 'Save changes';
    document.getElementById('owner-tag-cancel').style.display = '';
    updatePreview();
    document.querySelector('.owner-tag-editor')?.scrollIntoView({ behavior:'smooth', block:'start' });
    fields.name.focus();
  }));
  document.getElementById('owner-tag-save')?.addEventListener('click', async () => {
    const editingId = fields.id?.value || '';
    const body = { name:fields.name?.value || '', price:Number(fields.price?.value), color:fields.color?.value || '#818cf8', effect:fields.effect?.value || 'none', description:fields.description?.value || '' };
    const button = document.getElementById('owner-tag-save');
    const status = document.getElementById('owner-tag-status');
    try {
      button.disabled = true;
      status.textContent = editingId ? 'Saving changes…' : 'Creating tag…';
      const result = await api(editingId ? `/api/tlk/tag-manager/${encodeURIComponent(editingId)}` : '/api/tlk/tag-manager', { method:editingId ? 'PATCH' : 'POST', body });
      await refreshMessageEffectState();
      toast(result.msg, 'success');
      await renderCosmetics();
    } catch (error) {
      status.textContent = error.data?.msg || 'Could not save tag';
      status.classList.add('error');
      button.disabled = false;
    }
  });
  document.querySelectorAll('[data-owner-tag-remove]').forEach(button => button.addEventListener('click', async () => {
    const tag = byId.get(button.closest('[data-managed-tag-id]')?.dataset.managedTagId);
    if (!tag || !await confirmAction(`Remove ${tag.name} from the shop and every user inventory?`, 'Remove tag')) return;
    try {
      const result = await api(`/api/tlk/tag-manager/${encodeURIComponent(tag.id)}`, { method:'DELETE' });
      if (S.user) S.user.ownedTags = (S.user.ownedTags || []).filter(id => id !== tag.id);
      if (S.equippedTag === tag.id) S.equippedTag = 'none';
      await refreshMessageEffectState();
      toast(result.msg, 'success');
      await renderCosmetics();
    } catch (error) { toast(error.data?.msg || 'Could not remove tag', 'error'); }
  }));
  document.querySelectorAll('[data-owner-tag-restore]').forEach(button => button.addEventListener('click', async () => {
    const id = button.closest('[data-managed-tag-id]')?.dataset.managedTagId;
    try {
      const result = await api(`/api/tlk/tag-manager/${encodeURIComponent(id)}/restore`, { method:'POST' });
      await refreshMessageEffectState();
      toast(result.msg, 'success');
      await renderCosmetics();
    } catch (error) { toast(error.data?.msg || 'Could not restore tag', 'error'); }
  }));
}

async function renderCosmetics() {
  const main = document.getElementById('main-area');
  if (!main) return;
  document.body.classList.add('cosmetics-open');
  const category = ['banners','profile','message','avatar','tags'].includes(S.cosmeticsCategory) ? S.cosmeticsCategory : 'banners';
  const categoryInfo = {
    banners: { label:'Banners', icon:'panorama', title:'Profile banners', copy:'Cinematic artwork shown across your member card and profile.', scope:'banner' },
    profile: { label:'Profile Effects', icon:'flare', title:'Quick profile effects', copy:'Short effects that play once when somebody opens your profile.', scope:'profile' },
    message: { label:'Message Effects', icon:'chat_bubble', title:'Message effects', copy:'Animated materials applied behind your chat messages.', scope:'message' },
    avatar: { label:'Avatar Rings', icon:'blur_circular', title:'Avatar rings', copy:'Persistent animated frames around your avatar in every chat.', scope:'avatar' },
    tags: { label:'Tags', icon:'local_offer', title:'Profile tags', copy:'Small labels displayed beside your name.', scope:'tag' }
  };
  const info = categoryInfo[category];
  const noneNames = { banner:'No banner', profile:'No profile effect', message:'No message effect', avatar:'No avatar ring', tag:'No tag' };
  const effects = [{ id:'none', name:noneNames[info.scope], price:0, scope:info.scope }, ...EFFECTS.filter(effect => effect.scope === info.scope && effect.id !== 'none')];
  let tagManagerData = null;
  if (category === 'tags' && isOwner() && S.tagManagerOpen) {
    try { tagManagerData = await api('/api/tlk/tag-manager'); }
    catch (error) { toast(error.data?.msg || 'Could not load tag manager', 'error'); S.tagManagerOpen = false; }
  }
  let page = document.getElementById('cosmetics-page');
  if (!page) {
    page = document.createElement('section');
    page.id = 'cosmetics-page';
    main.appendChild(page);
  }
  page.innerHTML = `<header class="cosmetics-page-header">
    <div><span class="cosmetics-kicker">Cosmetics</span><h1>Customize your profile</h1></div>
    <div class="cosmetics-header-actions"><button class="cosmetics-icon-button" onclick="openCoinStore()"><span class="material-icons-round">paid</span><span>Coin shop</span></button><button class="cosmetics-icon-button" onclick="renderSection('channels')"><span class="material-icons-round">close</span></button></div>
  </header>
  <div class="cosmetics-page-body">
    <nav class="cosmetics-category-nav">${Object.entries(categoryInfo).map(([key,item]) => `<button class="${key === category ? 'active' : ''}" onclick="setCosmeticsCategory('${key}')"><span class="material-icons-round">${item.icon}</span><span>${item.label}</span></button>`).join('')}</nav>
    <main class="cosmetics-catalog">
      <div class="cosmetics-catalog-head"><div><h2>${tagManagerData ? 'Manage tags' : info.title}</h2><p>${tagManagerData ? 'Create, edit, animate, remove, and restore tags.' : info.copy}</p></div><div class="cosmetics-catalog-actions">${category === 'tags' && isOwner() ? `<button class="cosmetics-icon-button" onclick="setTagManagerOpen(${tagManagerData ? 'false' : 'true'})"><span class="material-icons-round">${tagManagerData ? 'arrow_back' : 'tune'}</span><span>${tagManagerData ? 'Back to tags' : 'Manage tags'}</span></button>` : ''}${tagManagerData ? '' : `<label class="cosmetics-search"><span class="material-icons-round">search</span><input id="cosmetics-search-input" value="${esc(S.cosmeticsSearch)}" placeholder="Search ${esc(info.label.toLowerCase())}"></label>`}</div></div>
      ${tagManagerData ? tagManagerMarkup(tagManagerData) : `<div class="cosmetics-grid cosmetics-grid-${info.scope}">${effects.map(effect => cosmeticCard(effect, info.scope)).join('')}</div><div id="cosmetics-empty" class="cosmetics-empty" style="display:none">No cosmetics match that search.</div>`}
    </main>
  </div>`;
  const input = document.getElementById('cosmetics-search-input');
  input?.addEventListener('input', () => {
    S.cosmeticsSearch = input.value;
    const query = input.value.trim().toLowerCase();
    let visible = 0;
    page.querySelectorAll('.cosmetic-shop-card').forEach(card => {
      const show = !query || card.dataset.name.includes(query);
      card.style.display = show ? '' : 'none';
      if (show) visible += 1;
    });
    const empty = document.getElementById('cosmetics-empty');
    if (empty) empty.style.display = visible ? 'none' : 'block';
  });
  input?.dispatchEvent(new Event('input'));
  if (tagManagerData) bindTagManager(tagManagerData);
}

window.setCosmeticsCategory = function(category) {
  S.cosmeticsCategory = category;
  S.cosmeticsSearch = '';
  S.tagManagerOpen = false;
  void renderCosmetics();
};

window.setTagManagerOpen = function(open) {
  S.tagManagerOpen = open === true;
  S.cosmeticsSearch = '';
  void renderCosmetics();
};

function cosmeticPreviewVisual(effect, scope) {
  if (effect.id === 'none') return '<div class="cosmetic-preview-none"><span class="material-icons-round">block</span></div>';
  if (scope === 'banner') return `<div class="cosmetic-preview-banner member-banner-${esc(effect.id.slice(7))}"></div>`;
  if (scope === 'profile') return `<div class="cosmetic-preview-profile"><div class="profile-fx-demo profile-fx-demo-large profile-fx-host"><div class="profile-fx-demo-shell"><span></span><b>${esc(myUsername() || 'You')}</b><small>Profile effect preview</small></div>${profileEffectLayer(effect.id)}</div></div>`;
  if (scope === 'message') return `<div class="cosmetic-preview-message"><div class="msg-bubble ${esc(messageEffectClass(effect.id))}">${messageMaterialContent(effect.id, `<strong>${esc(myUsername() || 'Nebulo')} <small>Today at 12:00 PM</small></strong><span>This is how your message will look.</span>`, { eager:true })}</div></div>`;
  if (scope === 'avatar') return `<div class="cosmetic-preview-avatar">${avatarEl(myUsername() || 'You', 92, S.user?.avatar || S.user?.avatar_url || null, effect.id)}</div>`;
  return `<div class="cosmetic-preview-tag">${tagBadgeHtml(effect)}</div>`;
}

window.openCosmeticPreview = function(scope, id) {
  const effect = id === 'none' ? { id:'none', name:{ banner:'No banner', profile:'No profile effect', message:'No message effect', avatar:'No avatar ring', tag:'No tag' }[scope], price:0, scope } : EFFECT_MAP.get(id);
  if (!effect || (id !== 'none' && effect.scope !== scope)) return;
  const state = cosmeticOwnedState(scope, id);
  const duration = scope === 'profile' && id !== 'none' ? `${(Number(effect.durationMs || 1000) / 1000).toFixed(1).replace('.0','')} second animation` : '';
  const actionLabel = state.active ? 'Currently equipped' : state.owned ? (id === 'none' ? 'Remove cosmetic' : 'Equip') : 'Buy and equip';
  openModal(`<article class="cosmetic-preview-modal cosmetic-preview-modal-${esc(scope)}">
    <button class="cosmetic-preview-close" onclick="closeModal()" aria-label="Close"><span class="material-icons-round">close</span></button>
    ${cosmeticPreviewVisual(effect, scope)}
    <div class="cosmetic-preview-details"><span class="cosmetic-preview-type">${esc(scope === 'profile' ? 'Quick profile effect' : scope)}</span><h2>${esc(effect.name)}</h2><p>${esc(effect.description || (scope === 'banner' ? 'Cinematic profile banner.' : 'Preview this cosmetic before equipping it.'))}</p>${duration ? `<span class="cosmetic-preview-duration"><span class="material-icons-round">timer</span>${duration}</span>` : ''}
      <div class="cosmetic-preview-purchase"><div><span>${state.owned ? 'Status' : 'Price'}</span><strong>${state.owned ? (state.active ? 'Equipped' : 'Owned') : effect.price > 0 ? `${Number(effect.price).toLocaleString()} coins` : 'Included'}</strong><small>${Number(S.user?.coins || 0).toLocaleString()} coins available</small></div>
      <button class="modal-btn modal-btn-primary" ${state.active ? 'disabled' : ''} onclick="applyCosmeticPreview('${esc(scope)}','${esc(id)}')">${esc(actionLabel)}</button></div>
      ${scope === 'profile' && id !== 'none' ? '<button class="cosmetic-replay" onclick="replayProfileEffect()"><span class="material-icons-round">replay</span>Replay effect</button>' : ''}
    </div>
  </article>`);
};

window.replayProfileEffect = function() {
  const layer = document.querySelector('.cosmetic-preview-profile .quick-profile-fx');
  if (!layer) return;
  layer.replaceWith(layer.cloneNode(true));
};

window.applyCosmeticPreview = async function(scope, id) {
  closeModal();
  if (scope === 'banner') return setEquippedBannerFromCosmetics(id, { confirmed:true });
  if (scope === 'profile') return setEquippedProfileEffectFromCosmetics(id, { confirmed:true });
  if (scope === 'message') return setEquippedEffectFromCosmetics(id, { confirmed:true });
  if (scope === 'avatar') return setEquippedAvatarEffectFromCosmetics(id, { confirmed:true });
  if (scope === 'tag') return setEquippedTagFromCosmetics(id, { confirmed:true });
};

const COIN_PACKS = {
  starter: { coins:500, price:'$1.99' },
  boost: { coins:1500, price:'$4.99' },
  vault: { coins:5000, price:'$9.99' }
};

const COSMETIC_PACKS = {
  neon_collection: { name:'City Lights Set', price:'$2.99', color:'#22d3ee', icon:'electric_bolt', items:['Neon Trim effect','Cool tag','Data Stream banner'] },
  golden_collection: { name:'Gilded Set', price:'$3.99', color:'#fbbf24', icon:'workspace_premium', items:['Gilded effect','Tag of Honor','Crystal Cavern banner'] },
  void_collection: { name:'Night Set', price:'$5.99', color:'#a78bfa', icon:'auto_awesome', items:['Night Sky effect','MVP tag','Black Hole banner','500 bonus coins'] }
};

window.openCoinStore = function() {
  document.getElementById('coin-shop-overlay')?.remove();
  document.body.classList.add('coin-shop-open');
  const overlay = document.createElement('div');
  overlay.id = 'coin-shop-overlay';
  overlay.className = 'coin-shop-overlay';
  overlay.onclick = event => { if (event.target === overlay) closeCoinStore(); };
  overlay.tabIndex = -1;
  overlay.onkeydown = event => { if (event.key === 'Escape') closeCoinStore(); };
  const packCopy = {
    starter: { name:'Starter Stash', desc:'A quick boost for your first tags and message effects.' },
    boost: { name:'Power Pack', desc:'The best balance for banners, tags, and premium effects.', featured:true },
    vault: { name:'Coin Vault', desc:'A large balance for collectors who want every cosmetic.' }
  };
  overlay.innerHTML = `<section class="coin-shop-page coin-shop-disabled" role="dialog" aria-modal="true" aria-label="Coin shop">
    <header class="coin-shop-header">
      <div class="coin-shop-brand"><span class="coin-shop-brand-icon"><span class="material-icons-round">paid</span></span>UBG Coin Shop</div>
      <button class="coin-shop-close" onclick="closeCoinStore()" aria-label="Close coin shop"><span class="material-icons-round">close</span></button>
    </header>
    <div class="coin-shop-coming-soon" role="status" aria-live="polite">
      <div class="coin-shop-coming-soon-card">
        <button class="coin-shop-coming-soon-close" onclick="closeCoinStore()" aria-label="Close coin shop"><span class="material-icons-round">close</span></button>
        <span class="coin-shop-coming-soon-icon"><span class="material-icons-round">schedule</span></span>
        <strong>Coin shop coming soon</strong>
        <p>Coin purchases are being prepared. Check back soon.</p>
      </div>
    </div>
    <div class="coin-shop-content">
      <div class="coin-shop-hero">
        <div><div class="coin-shop-kicker">UBG Chat Store</div><h2>Make chat yours.</h2><p>Purchase coins or pick up a curated cosmetic collection. Every purchase is connected to your signed-in UBG Chat account.</p></div>
        <div class="coin-shop-wallet"><div class="coin-shop-wallet-label">Your wallet</div><div class="coin-shop-wallet-value"><span class="material-icons-round">toll</span>${Number(S.user?.coins || 0).toLocaleString()}</div></div>
      </div>
      <section class="coin-shop-section">
        <div class="coin-shop-section-head"><div><div class="coin-shop-section-title">Coin Packs</div><div class="coin-shop-section-subtitle">Flexible currency for any cosmetic in the shop.</div></div><span class="coin-shop-section-label">Best everyday value</span></div>
        <div class="coin-shop-pack-grid">
          ${Object.entries(COIN_PACKS).map(([id, pack]) => { const copy = packCopy[id]; return `<article class="coin-shop-pack${copy.featured ? ' featured' : ''}">
            ${copy.featured ? '<span class="coin-shop-popular">Most popular</span>' : ''}
            <div class="coin-shop-pack-name">${copy.name}</div>
            <div class="coin-shop-pack-coins"><span class="material-icons-round">toll</span>${pack.coins.toLocaleString()}</div>
            <div class="coin-shop-pack-desc">${copy.desc}</div>
            <div class="coin-shop-pack-price">${pack.price} <span>USD</span></div>
            <button onclick="purchaseShopPack('${id}')">Purchase coins</button>
          </article>`; }).join('')}
        </div>
      </section>
      <section class="coin-shop-section">
        <div class="coin-shop-section-head"><div><div class="coin-shop-section-title">Cosmetic Collections</div><div class="coin-shop-section-subtitle">Complete coordinated looks at a bundled price.</div></div><span class="coin-shop-section-label">Special bundles</span></div>
        <div class="cosmetic-bundle-grid">
          ${Object.entries(COSMETIC_PACKS).map(([id, pack]) => `<article class="cosmetic-bundle" style="--bundle-color:${pack.color}">
            <span class="cosmetic-bundle-icon"><span class="material-icons-round">${pack.icon}</span></span>
            <div class="cosmetic-bundle-name">${pack.name}</div>
            <div class="cosmetic-bundle-items">${pack.items.map(item => `<span class="cosmetic-bundle-item">${item}</span>`).join('')}</div>
            <div class="cosmetic-bundle-bottom"><div class="cosmetic-bundle-price">${pack.price} <span>USD</span></div><button onclick="purchaseShopPack('${id}')">Get collection</button></div>
          </article>`).join('')}
        </div>
      </section>
      <div class="coin-shop-footer">
        <div class="coin-shop-note"><span class="material-icons-round">lock</span><span>Checkout opens through the configured secure payment provider.</span></div>
        <div class="coin-shop-note"><span class="material-icons-round">account_circle</span><span>Purchases are connected to your signed-in UBG Chat account.</span></div>
        <div class="coin-shop-note"><span class="material-icons-round">palette</span><span>Spend coins on cosmetics from the full cosmetics shop.</span></div>
      </div>
    </div>
  </section>`;
  document.body.appendChild(overlay);
  overlay.focus();
};

window.closeCoinStore = function() {
  document.getElementById('coin-shop-overlay')?.remove();
  document.body.classList.remove('coin-shop-open');
};

window.purchaseShopPack = function(packId) {
  if (!COIN_PACKS[packId] && !COSMETIC_PACKS[packId]) return;
  toast('Coin purchases are coming soon.', 'info');
};
window.purchaseCoinPack = window.purchaseShopPack;

// Cosmetics helpers
window.setEquippedEffectFromCosmetics = async function(id, options = {}) {
  const effect = getEffectMeta(id);
  if (!effect) return;
  const owned = new Set(Array.isArray(S.user?.ownedEffects) ? S.user.ownedEffects : ['none']);
  if (!owned.has(id) && id !== 'none') {
    if (!options.confirmed && !confirm('Buy ' + effect.name + ' for ' + effect.price + ' coins? (You have ' + (S.user?.coins ?? 0) + ')')) return;
    try {
      const data = await api('/api/tlk/chat-effects/' + encodeURIComponent(id) + '/purchase', { method: 'POST' });
      if (data.user) setUser({ ...(S.user || {}), ...data.user });
      S.equippedEffect = id;
      localStorage.setItem('equippedEffect', id);
      toast('Purchased & equipped: ' + effect.name, 'success');
      updateEffectBtn(id, effect.color);
      syncCosmeticsLive();
      void renderCosmetics();
      return;
    } catch (err) {
      toast(err.data?.msg || 'Not enough coins', 'error');
      return;
    }
  }
  try {
    await api('/api/tlk/chat-effects/equip', { method: 'POST', body: { effectId: id } });
  } catch {}
  S.equippedEffect = id;
  localStorage.setItem('equippedEffect', id);
  if (S.user) S.user.equippedEffect = id;
  toast(id === 'none' ? 'Effect removed' : 'Effect: ' + effect.name, 'success');
  updateEffectBtn(id, effect.color);
  syncCosmeticsLive();
  void renderCosmetics();
};

window.setEquippedTagFromCosmetics = async function(id, options = {}) {
  const tag = id === 'none' ? { id:'none', name:'No tag', price:0 } : EFFECT_MAP.get(id);
  if (!tag || (id !== 'none' && tag.scope !== 'tag')) return;
  const owned = new Set(Array.isArray(S.user?.ownedTags) ? S.user.ownedTags : ['none']);
  try {
    let data;
    if (!owned.has(id) && id !== 'none') {
      if (!options.confirmed && !confirm('Buy the ' + tag.name + ' tag for ' + tag.price + ' coins? (You have ' + (S.user?.coins ?? 0) + ')')) return;
      data = await api('/api/tlk/chat-tags/' + encodeURIComponent(id) + '/purchase', { method:'POST' });
      toast('Purchased & equipped tag: ' + tag.name, 'success');
    } else {
      data = await api('/api/tlk/chat-tags/equip', { method:'POST', body:{ tagId:id } });
      toast(id === 'none' ? 'Tag removed' : 'Tag: ' + tag.name, 'success');
    }
    if (data?.user) setUser({ ...(S.user || {}), ...data.user });
    S.equippedTag = data?.user?.equippedTag || id;
    syncCosmeticsLive();
    void renderCosmetics();
  } catch (err) {
    toast(err.data?.msg || 'Could not update tag', 'error');
  }
};

window.setEquippedBannerFromCosmetics = async function(id, options = {}) {
  const banner = id === 'none' ? { id:'none', name:'No banner', price:0 } : EFFECT_MAP.get(id);
  if (!banner || (id !== 'none' && banner.scope !== 'banner')) return;
  const owned = new Set(Array.isArray(S.user?.ownedBanners) ? S.user.ownedBanners : ['none']);
  try {
    let data;
    if (!owned.has(id) && id !== 'none') {
      if (!options.confirmed && !confirm('Buy the ' + banner.name + ' member banner for ' + banner.price + ' coins? (You have ' + (S.user?.coins ?? 0) + ')')) return;
      data = await api('/api/tlk/chat-banners/' + encodeURIComponent(id) + '/purchase', { method:'POST' });
      toast('Purchased & equipped banner: ' + banner.name, 'success');
    } else {
      data = await api('/api/tlk/chat-banners/equip', { method:'POST', body:{ bannerId:id } });
      toast(id === 'none' ? 'Member banner removed' : 'Member banner: ' + banner.name, 'success');
    }
    if (data?.user) setUser({ ...(S.user || {}), ...data.user });
    S.equippedBanner = data?.user?.equippedBanner || id;
    syncCosmeticsLive();
    void renderCosmetics();
  } catch (error) {
    toast(error.data?.msg || 'Could not update member banner', 'error');
  }
};

window.setEquippedProfileEffectFromCosmetics = async function(id, options = {}) {
  const effect = id === 'none' ? { id:'none', name:'No profile effect', price:0 } : EFFECT_MAP.get(id);
  if (!effect || (id !== 'none' && effect.scope !== 'profile')) return;
  const owned = new Set(Array.isArray(S.user?.ownedProfileEffects) ? S.user.ownedProfileEffects : ['none']);
  try {
    let data;
    if (!owned.has(id) && id !== 'none') {
      if (!options.confirmed && !confirm('Buy ' + effect.name + ' for ' + effect.price + ' coins? (You have ' + (S.user?.coins ?? 0) + ')')) return;
      data = await api('/api/tlk/chat-profile-effects/' + encodeURIComponent(id) + '/purchase', { method:'POST' });
      toast('Purchased and equipped profile effect: ' + effect.name, 'success');
    } else {
      data = await api('/api/tlk/chat-profile-effects/equip', { method:'POST', body:{ effectId:id } });
      toast(id === 'none' ? 'Profile effect removed' : 'Profile effect: ' + effect.name, 'success');
    }
    if (data?.user) setUser({ ...(S.user || {}), ...data.user });
    S.equippedProfileEffect = data?.user?.equippedProfileEffect || id;
    syncCosmeticsLive();
    void renderCosmetics();
  } catch (error) {
    toast(error?.data?.msg || 'Could not update profile effect', 'error');
  }
};

// alerts

function friendRequestAlertUsername(alert = {}) {
  const metadataName = String(
    alert?.metadata?.senderUsername ||
    alert?.metadata?.requesterUsername ||
    alert?.metadata?.username ||
    ''
  ).trim();
  if (metadataName) return metadataName;
  const match = String(alert?.message || '').match(/^(.+?)\s+sent you a friend request\.?$/i);
  return String(match?.[1] || '').trim();
}

async function handleFriendRequestAlert(alertId, decision, card) {
  const alert = S.alerts.find(item => String(item?.id || '') === String(alertId || ''));
  const username = friendRequestAlertUsername(alert);
  if (!alert || !username || !['accept', 'decline'].includes(decision)) {
    toast('That friend request is no longer available', 'error');
    return;
  }
  card?.querySelectorAll('button').forEach(button => { button.disabled = true; });
  try {
    const endpoint = decision === 'accept' ? 'accept' : 'deny';
    const status = decision === 'accept' ? 'accepted' : 'declined';
    await api(`/api/users/friends/${endpoint}`, { method: 'POST', body: { username } });
    alert.metadata = {
      ...(alert.metadata || {}),
      friendRequestStatus: status,
      friendRequestHandledAt: Date.now()
    };
    try {
      await chatApi(`/api/network/alerts/${encodeURIComponent(alertId)}`, {
        method: 'PATCH',
        body: { friendRequestStatus: status }
      });
    } catch (error) {
      console.warn('[UBG Chat] Could not persist friend-request alert state:', error?.message || error);
    }
    S.dmsLoaded = false;
    void refreshDmsData().catch(() => {});
    toast(decision === 'accept' ? `${username} is now your friend` : `Friend request from ${username} declined`, 'success');
    if (S.section === 'alerts') await renderAlerts({ refresh: false });
  } catch (error) {
    card?.querySelectorAll('button').forEach(button => { button.disabled = false; });
    toast(error?.data?.msg || `Could not ${decision} friend request`, 'error');
  }
}

async function clearAlertById(alertId, card) {
  if (!alertId) return;
  card?.querySelectorAll('button').forEach(button => { button.disabled = true; });
  try {
    await chatApi(`/api/network/alerts/${encodeURIComponent(alertId)}`, { method: 'DELETE' });
    S.alerts = S.alerts.filter(alert => String(alert?.id || '') !== String(alertId));
    await renderAlerts({ refresh: false });
  } catch (error) {
    card?.querySelectorAll('button').forEach(button => { button.disabled = false; });
    toast(error?.data?.msg || 'Could not clear alert', 'error');
  }
}

async function clearAllAlerts() {
  if (!S.alerts.length || !confirm('Clear all alerts? This cannot be undone.')) return;
  try {
    await chatApi('/api/network/alerts', { method: 'DELETE' });
    S.alerts = [];
    await renderAlerts({ refresh: false });
  } catch (error) {
    toast(error?.data?.msg || 'Could not clear alerts', 'error');
  }
}

async function renderAlerts(options = {}) {
  if (options.refresh !== false) await fetchAlerts();
  const list = document.getElementById('section-list');
  const action = document.getElementById('section-action');
  if (!list) return;

  if (!S.alerts.length) {
    list.innerHTML = `<div style="font-size:12px;color:#52525b;text-align:center;padding:18px 8px">No alerts.</div>`;
  } else {
    list.innerHTML = S.alerts.map(a => {
      const icon = a.type === 'ban' ? 'block' : a.type === 'warn' ? 'warning' : a.type === 'friend_request' ? 'person_add' : 'info';
      const color = a.type === 'ban' ? '#f87171' : a.type === 'warn' ? '#fbbf24' : a.type === 'friend_request' ? '#4ade80' : '#60a5fa';
      const label = a.type === 'friend_request' ? 'Friend request' : (a.type || 'alert');
      const alertId = String(a.id || '');
      const requester = friendRequestAlertUsername(a);
      const requestStatus = String(a?.metadata?.friendRequestStatus || '').toLowerCase();
      const friendActions = a.type === 'friend_request' && requester && !['accepted', 'declined'].includes(requestStatus)
        ? `<button type="button" data-alert-action="accept" data-alert-id="${esc(alertId)}" style="border:1px solid rgba(74,222,128,.28);background:rgba(74,222,128,.13);color:#86efac;border-radius:7px;padding:5px 9px;font-size:11px;font-weight:700;cursor:pointer">Accept</button>
           <button type="button" data-alert-action="decline" data-alert-id="${esc(alertId)}" style="border:1px solid rgba(248,113,113,.22);background:rgba(248,113,113,.09);color:#fca5a5;border-radius:7px;padding:5px 9px;font-size:11px;font-weight:700;cursor:pointer">Decline</button>`
        : a.type === 'friend_request' && ['accepted', 'declined'].includes(requestStatus)
          ? `<span style="display:inline-flex;align-items:center;gap:4px;color:${requestStatus === 'accepted' ? '#86efac' : '#a1a1aa'};font-size:11px;font-weight:700"><span class="material-icons-round" style="font-size:14px">${requestStatus === 'accepted' ? 'check_circle' : 'cancel'}</span>${requestStatus === 'accepted' ? 'Accepted' : 'Declined'}</span>`
          : '';
      return `<div data-alert-card="${esc(alertId)}" style="padding:9px;border:1px solid rgba(255,255,255,.055);border-radius:10px;background:rgba(255,255,255,.04);margin-bottom:5px">
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px">
          <span class="material-icons-round" style="font-size:14px;color:${color}">${icon}</span>
          <span style="font-size:11px;font-weight:700;color:${color};text-transform:capitalize">${esc(label)}</span>
          <button type="button" data-alert-action="clear" data-alert-id="${esc(alertId)}" title="Clear this alert" aria-label="Clear this alert" style="margin-left:auto;width:24px;height:24px;display:grid;place-items:center;border:0;border-radius:6px;background:transparent;color:#71717a;cursor:pointer"><span class="material-icons-round" style="font-size:15px">close</span></button>
        </div>
        <div style="font-size:12px;color:#a1a1aa;line-height:1.5">${esc(a.message||'')}</div>
        ${friendActions ? `<div style="display:flex;align-items:center;gap:6px;margin-top:8px">${friendActions}</div>` : ''}
      </div>`;
    }).join('');
  }

  list.querySelectorAll('[data-alert-action]').forEach(button => {
    button.addEventListener('click', () => {
      const alertId = button.dataset.alertId || '';
      const card = button.closest('[data-alert-card]');
      if (button.dataset.alertAction === 'clear') void clearAlertById(alertId, card);
      else void handleFriendRequestAlert(alertId, button.dataset.alertAction, card);
    });
  });

  if (action) {
    action.innerHTML = S.alerts.length
      ? `<button id="clear-all-alerts" type="button" class="sb-item" style="color:#a1a1aa"><span class="material-icons-round mi">delete_sweep</span><span>Clear all alerts</span></button>`
      : '';
    document.getElementById('clear-all-alerts')?.addEventListener('click', () => void clearAllAlerts());
  }

  const badge = document.getElementById('alerts-badge');
  if (badge) {
    const count = S.alerts.length;
    badge.style.display = count ? 'flex' : 'none';
    badge.textContent = count > 9 ? '9+' : String(count);
  }
}

// ─── Modals ───────────────────────────────────────────────────────────────────
function modalAddFriend() {
  openModal(`<h3 style="font-size:17px;font-weight:700;color:#fff;margin:0 0 5px">Add Friend</h3>
    <p style="font-size:11px;color:#71717a;line-height:1.45;margin:0 0 12px">Search the database or choose a user from the alphabetical list.</p>
    <div style="display:flex;flex-direction:column;gap:9px">
      <div style="position:relative">
        <span class="material-icons-round" style="position:absolute;left:10px;top:50%;transform:translateY(-50%);font-size:16px;color:#52525b">search</span>
        <input id="friend-input" type="text" placeholder="Search by username…" class="modal-input" autocomplete="off" style="padding-left:33px" />
      </div>
      <div id="friend-directory-status" style="font-size:10px;color:#52525b;min-height:14px">Loading users…</div>
      <div id="friend-directory" style="border:1px solid rgba(255,255,255,.08);background:#111118;border-radius:11px;max-height:245px;overflow-y:auto;padding:4px"></div>
      <button id="friend-show-more" type="button" class="modal-btn modal-btn-ghost" style="display:none;padding:7px">Show more</button>
      <div id="friend-error" style="display:none;color:#f87171;font-size:12px"></div>
      <div style="display:flex;gap:8px;margin-top:2px">
        <button class="modal-btn modal-btn-ghost" onclick="closeModal()">Cancel</button>
        <button class="modal-btn modal-btn-primary" id="friend-send-btn" disabled>Send Request</button>
      </div>
    </div>`);

  const modalBox = document.querySelector('#modal-overlay .modal-box');
  if (modalBox) modalBox.style.maxWidth = '440px';
  const input = document.getElementById('friend-input');
  const directoryEl = document.getElementById('friend-directory');
  const statusEl = document.getElementById('friend-directory-status');
  const moreBtn = document.getElementById('friend-show-more');
  const sendBtn = document.getElementById('friend-send-btn');
  const pageSize = 8;
  let query = '';
  let offset = 0;
  let selected = null;
  let loadedUsers = [];
  let searchTimer = null;
  let requestVersion = 0;

  const userAvatarHtml = (user) => {
    const name = user.username || '';
    const color = avatarColor(name);
    const initials = esc(avatarInitials(name));
    return user.avatar
      ? `<div style="width:34px;height:34px;border-radius:9px;background:${color};flex-shrink:0;overflow:hidden;position:relative"><img src="${esc(user.avatar)}" style="width:100%;height:100%;object-fit:cover" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><span style="display:none;position:absolute;inset:0;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:#fff">${initials}</span></div>`
      : `<div style="width:34px;height:34px;border-radius:9px;background:${color};display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:#fff;flex-shrink:0">${initials}</div>`;
  };

  const renderDirectory = () => {
    if (!loadedUsers.length) {
      directoryEl.innerHTML = `<div style="padding:20px 10px;text-align:center;font-size:11px;color:#52525b">No users found.</div>`;
      return;
    }
    directoryEl.innerHTML = loadedUsers.map(user => {
      const name = user.username || '';
      const id = user._id || user.id || '';
      const unavailable = user.mutual || user.pending || user.incoming;
      const state = user.mutual ? 'Friends' : user.pending ? 'Pending' : user.incoming ? 'Requested you' : '';
      const active = selected?.id === id;
      return `<button type="button" class="friend-directory-user" data-id="${esc(id)}" data-name="${esc(name)}" ${unavailable ? 'disabled' : ''} style="width:100%;display:flex;align-items:center;gap:10px;padding:7px 8px;border:1px solid ${active ? 'rgba(0,153,255,.5)' : 'transparent'};background:${active ? 'rgba(0,153,255,.12)' : 'transparent'};border-radius:9px;text-align:left;cursor:${unavailable ? 'default' : 'pointer'};opacity:${unavailable ? '.58' : '1'};font-family:Inter,sans-serif">
        ${userAvatarHtml(user)}
        <span style="flex:1;min-width:0"><span style="display:block;font-size:12px;font-weight:600;color:#e4e4e7;overflow:hidden;text-overflow:ellipsis">${esc(name)}</span><span style="display:flex;align-items:center;gap:3px;margin-top:2px;font-size:10px;color:#fbbf24"><span class="material-icons-round" style="font-size:12px">toll</span>${esc(String(user.coins ?? 0))} coins</span></span>
        <span style="font-size:10px;color:${active ? '#60a5fa' : '#71717a'}">${state || (active ? 'Selected' : 'Select')}</span>
      </button>`;
    }).join('');
    directoryEl.querySelectorAll('.friend-directory-user:not([disabled])').forEach(row => {
      row.addEventListener('click', () => {
        selected = { id: row.dataset.id, username: row.dataset.name };
        input.value = row.dataset.name;
        sendBtn.disabled = false;
        renderDirectory();
      });
    });
  };

  const loadDirectory = async ({ append = false } = {}) => {
    const version = ++requestVersion;
    if (!append) { offset = 0; loadedUsers = []; selected = null; sendBtn.disabled = true; }
    statusEl.textContent = query ? `Searching for “${query}”…` : 'Loading users…';
    moreBtn.style.display = 'none';
    try {
      const data = await api(`/api/users/friends?search=${encodeURIComponent(query)}&limit=${pageSize}&offset=${offset}`);
      if (version !== requestVersion) return;
      const nextUsers = data?.results || [];
      loadedUsers = append ? [...loadedUsers, ...nextUsers] : nextUsers;
      offset = loadedUsers.length;
      const total = Number(data?.pagination?.total || loadedUsers.length);
      statusEl.textContent = query ? `${total} matching user${total === 1 ? '' : 's'}` : `${total} user${total === 1 ? '' : 's'} · alphabetical`;
      moreBtn.style.display = data?.pagination?.hasMore ? 'block' : 'none';
      renderDirectory();
    } catch (error) {
      if (version !== requestVersion) return;
      statusEl.textContent = 'Could not load users.';
      directoryEl.innerHTML = `<div style="padding:20px 10px;text-align:center;font-size:11px;color:#f87171">${esc(error.data?.msg || 'User directory unavailable')}</div>`;
    }
  };

  input?.addEventListener('input', () => {
    clearTimeout(searchTimer);
    query = input.value.trim();
    searchTimer = setTimeout(() => loadDirectory(), 250);
  });
  moreBtn?.addEventListener('click', () => loadDirectory({ append: true }));
  sendBtn?.addEventListener('click', async () => {
    if (!selected) return;
    sendBtn.disabled = true;
    try {
      await api('/api/users/friends', { method: 'POST', body: { userId: selected.id, username: selected.username } });
      toast(`Friend request sent to ${selected.username}!`, 'success');
      closeModal();
      await renderDms();
    } catch (err) {
      sendBtn.disabled = false;
      showModalError('friend-error', err.data?.msg || 'Failed to send request');
    }
  });
  void loadDirectory();
}

function modalCreateGroup() {
  openModal(`<h3 style="font-size:17px;font-weight:700;color:#fff;margin:0 0 14px">Create Group</h3>
    <div style="display:flex;flex-direction:column;gap:10px">
      <input id="group-name-input" type="text" placeholder="Group name" class="modal-input" />
      <div id="group-error" style="display:none;color:#f87171;font-size:12px"></div>
      <div style="display:flex;gap:8px;margin-top:4px">
        <button class="modal-btn modal-btn-ghost" onclick="closeModal()">Cancel</button>
        <button class="modal-btn modal-btn-primary" id="group-create-btn">Create</button>
      </div>
    </div>`);
  document.getElementById('group-create-btn')?.addEventListener('click', async () => {
    const name = document.getElementById('group-name-input')?.value?.trim();
    if (!name) return;
    try {
      await api('/api/group-chats', { method: 'POST', body: { name } });
      toast('Group created!', 'success'); closeModal(); await renderGroups();
    } catch (err) { showModalError('group-error', err.data?.msg || 'Failed to create group'); }
  });
}

function modalJoinGroup() {
  openModal(`<h3 style="font-size:17px;font-weight:700;color:#fff;margin:0 0 6px">Join Group</h3>
    <p style="font-size:12px;color:#71717a;margin:0 0 12px">Enter the 5-letter room code shared by the group owner.</p>
    <div style="display:flex;flex-direction:column;gap:10px">
      <input id="join-code-input" type="text" placeholder="abcde" maxlength="5" class="modal-input" style="letter-spacing:.15em;text-transform:lowercase" />
      <div id="join-error" style="display:none;color:#f87171;font-size:12px"></div>
      <div style="display:flex;gap:8px;margin-top:4px">
        <button class="modal-btn modal-btn-ghost" onclick="closeModal()">Cancel</button>
        <button class="modal-btn modal-btn-primary" id="join-confirm-btn">Join</button>
      </div>
    </div>`);
  document.getElementById('join-confirm-btn')?.addEventListener('click', async () => {
    const code = (document.getElementById('join-code-input')?.value || '').trim().toLowerCase();
    if (!/^[a-z]{5}$/.test(code)) { showModalError('join-error', 'Enter a valid 5-letter room code'); return; }
    try {
      await api(`/api/group-chats/${encodeURIComponent(code)}/join`, { method: 'POST' });
      toast('Joined group!', 'success'); closeModal(); await renderGroups();
    } catch (err) { showModalError('join-error', err.data?.msg || 'Invalid code or group not found'); }
  });
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function bindRoomButtons() {
  document.querySelectorAll('.sb-item[data-room], .dm-friend-open[data-room]').forEach(btn => {
    if (btn.dataset.roomBound === 'true') return;
    btn.dataset.roomBound = 'true';
    btn.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      joinRoom(btn.dataset.room, btn.dataset.roomType, btn.dataset.roomName);
    });
  });
}

function toggleMembersPanel() {
  const panel = document.getElementById('members-panel');
  if (!panel) return;
  S.membersOpen = !S.membersOpen;
  localStorage.setItem('chatShowMembers', String(S.membersOpen));
  panel.style.display = S.membersOpen ? '' : 'none';
  const resizer = document.getElementById('members-resizer');
  if (resizer) resizer.style.display = S.membersOpen ? '' : 'none';
}

function setupPanelResizers() {
  const bind = (handleId, panelId, storageKey, min, max, reverse = false) => {
    const handle = document.getElementById(handleId);
    const panel = document.getElementById(panelId);
    if (!handle || !panel || handle.dataset.bound === 'true') return;
    handle.dataset.bound = 'true';
    const saved = Number(localStorage.getItem(storageKey));
    if (Number.isFinite(saved) && saved > 0) panel.style.width = `${Math.max(min, Math.min(max, saved))}px`;
    handle.addEventListener('pointerdown', event => {
      if (event.button !== 0) return;
      event.preventDefault();
      const startX = event.clientX;
      const startWidth = panel.getBoundingClientRect().width;
      handle.setPointerCapture?.(event.pointerId);
      handle.classList.add('dragging');
      document.body.classList.add('panel-resizing');
      panel.style.transition = 'none';
      const move = moveEvent => {
        const delta = (moveEvent.clientX - startX) * (reverse ? -1 : 1);
        panel.style.width = `${Math.max(min, Math.min(max, startWidth + delta))}px`;
      };
      const stop = () => {
        handle.removeEventListener('pointermove', move);
        handle.removeEventListener('pointerup', stop);
        handle.removeEventListener('pointercancel', stop);
        handle.classList.remove('dragging');
        document.body.classList.remove('panel-resizing');
        panel.style.transition = '';
        localStorage.setItem(storageKey, String(Math.round(panel.getBoundingClientRect().width)));
      };
      handle.addEventListener('pointermove', move);
      handle.addEventListener('pointerup', stop);
      handle.addEventListener('pointercancel', stop);
    });
  };
  bind('section-resizer', 'section-panel', 'chatSectionPanelWidth', 170, 420, false);
  bind('members-resizer', 'members-panel', 'chatMembersPanelWidth', 150, 380, true);
}

function showLogin() {
  document.getElementById('login-screen').style.display = 'flex';
  document.getElementById('app').style.display = 'none';
}
function showApp() {
  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('app').style.display = 'flex';
}

function updateNavAvatar() {
  const el = document.getElementById('nav-avatar');
  if (!el || !S.user) return;
  const name = S.user.displayName || S.user.name || S.user.username || '?';
  const color = avatarColor(name);
  if (S.user.avatar) {
    el.style.background = 'transparent';
    el.style.overflow = 'hidden';
    el.style.borderRadius = '10px';
    el.innerHTML = `<img src="${esc(S.user.avatar)}" style="width:100%;height:100%;object-fit:cover;border-radius:10px" onerror="this.parentElement.innerHTML='<span style=\\'font-size:11px;font-weight:700;color:${color}\\'>${esc(avatarInitials(name))}</span>';this.parentElement.style.background='${color}25'">`;
  } else {
    el.style.background = color + '25';
    el.style.overflow = '';
    el.innerHTML = `<span style="font-size:11px;font-weight:700;color:${color}">${esc(avatarInitials(name))}</span>`;
  }
}

// ─── Event Wiring ─────────────────────────────────────────────────────────────
function setupLoginHandlers() {
  if (S.loginHandlersBound) return;
  S.loginHandlersBound = true;
  const btn = document.getElementById('login-btn');
  const emailEl = document.getElementById('login-email');
  const passEl = document.getElementById('login-password');
  const errEl = document.getElementById('login-error');
  const loginTab = document.getElementById('auth-tab-login');
  const registerTab = document.getElementById('auth-tab-register');
  const loginPanel = document.getElementById('auth-login-panel');
  const registerPanel = document.getElementById('auth-register-panel');
  const authTitle = document.getElementById('auth-title');
  const authSubtitle = document.getElementById('auth-subtitle');
  const registerBtn = document.getElementById('register-btn');
  const registerUsername = document.getElementById('register-username');
  const registerDisplayName = document.getElementById('register-display-name');
  const registerEmail = document.getElementById('register-email');
  const registerPassword = document.getElementById('register-password');
  const registerPasswordConfirm = document.getElementById('register-password-confirm');

  const showAuthError = (message) => {
    if (!errEl) return;
    errEl.textContent = message;
    errEl.style.display = 'block';
  };

  const clearAuthError = () => {
    if (errEl) errEl.style.display = 'none';
  };

  const setAuthMode = (mode) => {
    const registering = mode === 'register';
    loginTab?.classList.toggle('active', !registering);
    registerTab?.classList.toggle('active', registering);
    loginTab?.setAttribute('aria-selected', String(!registering));
    registerTab?.setAttribute('aria-selected', String(registering));
    if (loginPanel) loginPanel.hidden = registering;
    if (registerPanel) registerPanel.hidden = !registering;
    if (authTitle) authTitle.textContent = registering ? 'Create your account' : 'Welcome back';
    if (authSubtitle) authSubtitle.textContent = registering ? 'Join UBG Chat with a Nebulo profile' : 'Sign in to UBG Chat';
    clearAuthError();
    (registering ? registerUsername : emailEl)?.focus();
  };

  loginTab?.addEventListener('click', () => setAuthMode('login'));
  registerTab?.addEventListener('click', () => setAuthMode('register'));

  async function doLogin() {
    const email = emailEl?.value?.trim();
    const pass = passEl?.value;
    if (!email || !pass) return;
    if (btn) { btn.disabled = true; btn.textContent = 'Signing in…'; }
    clearAuthError();
    try {
      await login(email, pass);
      await launchApp();
    } catch (err) {
      showAuthError(err.data?.msg || 'Invalid credentials');
      if (btn) { btn.disabled = false; btn.textContent = 'Sign In'; }
    }
  }

  async function doRegister() {
    const username = registerUsername?.value?.trim() || '';
    const displayName = String(registerDisplayName?.value || username).normalize('NFKC').replace(/\s+/g, ' ').trim();
    const email = registerEmail?.value?.trim() || '';
    const password = registerPassword?.value || '';
    const confirmation = registerPasswordConfirm?.value || '';
    clearAuthError();
    if (!/^[A-Za-z0-9_]{3,24}$/.test(username)) {
      showAuthError('Username must be 3–24 characters using letters, numbers, or underscores');
      return;
    }
    if ([...displayName].length < 2 || [...displayName].length > 32 || /[\u0000-\u001F\u007F]/.test(displayName)) {
      showAuthError('Display name must be 2–32 visible characters');
      return;
    }
    if (!email || !registerEmail?.checkValidity()) {
      showAuthError('Enter a valid email address');
      return;
    }
    if (password.length < 8) {
      showAuthError('Password must be at least 8 characters');
      return;
    }
    if (password !== confirmation) {
      showAuthError('Passwords do not match');
      return;
    }

    if (registerBtn) { registerBtn.disabled = true; registerBtn.textContent = 'Creating account…'; }
    try {
      await registerAccount(username, displayName, email, password);
      if (registerUsername) registerUsername.value = '';
      if (registerDisplayName) registerDisplayName.value = '';
      if (registerEmail) registerEmail.value = '';
      if (registerPassword) registerPassword.value = '';
      if (registerPasswordConfirm) registerPasswordConfirm.value = '';
      if (registerBtn) { registerBtn.disabled = false; registerBtn.textContent = 'Create Account'; }
      await launchApp();
    } catch (err) {
      showAuthError(err.data?.msg || 'Could not create account');
    } finally {
      if (registerBtn) { registerBtn.disabled = false; registerBtn.textContent = 'Create Account'; }
    }
  }

  loginPanel?.addEventListener('submit', e => { e.preventDefault(); void doLogin(); });
  emailEl?.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); passEl?.focus(); } });
  registerPanel?.addEventListener('submit', e => { e.preventDefault(); void doRegister(); });
  registerEmail?.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); registerPassword?.focus(); } });
}

function setupAppHandlers() {
  setupPanelResizers();
  // Nav rail
  document.querySelectorAll('.nav-btn[data-section]').forEach(btn =>
    btn.addEventListener('click', () => renderSection(btn.dataset.section))
  );

  // Avatar → settings
  document.getElementById('nav-avatar')?.addEventListener('click', () => renderSection('settings'));

  // Send
  document.getElementById('send-btn')?.addEventListener('click', sendMessage);
  document.getElementById('messages-list')?.addEventListener('click', event => {
    const actionButton = event.target.closest('[data-message-action]');
    if (actionButton) {
      event.preventDefault();
      event.stopPropagation();
      const message = S.lastMsgs.find(item => String(getMessageId(item)) === String(actionButton.dataset.messageId));
      if (!message) return toast('Message is no longer available', 'error');
      const action = actionButton.dataset.messageAction;
      if (action === 'reply') setReply(message);
      if (action === 'react') openReactionPicker(message);
      if (action === 'edit') editMessage(message);
      if (action === 'bookmark') toggleMessageBookmark(message);
      if (action === 'pin') toggleMessagePin(message);
      if (action === 'delete') deleteMessage(getMessageId(message), message?.user_token || message?.userToken || '');
      if (action === 'moderate') openModPanel(message);
      if (action === 'report') reportMessage(message);
      return;
    }
    const reaction = event.target.closest('[data-reaction-emoji]');
    if (reaction) {
      event.preventDefault();
      event.stopPropagation();
      toggleMessageReaction(reaction.dataset.messageId, reaction.dataset.reactionEmoji);
      return;
    }
    const jumpTarget = event.target.closest('[data-jump-message-id]');
    if (jumpTarget?.dataset.jumpMessageId) {
      event.preventDefault();
      event.stopPropagation();
      jumpToMessage(jumpTarget.dataset.jumpMessageId);
      return;
    }
    const profileTarget = event.target.closest('[data-profile-username]');
    if (profileTarget) {
      event.preventDefault();
      event.stopPropagation();
      const messageId = String(profileTarget.dataset.profileMessageId || '');
      const message = S.lastMsgs.find(item => String(getMessageId(item)) === messageId) || null;
      const username = String(profileTarget.dataset.profileUsername || message?.username || getUsername(message) || '').trim();
      openUserCard(username, message ? withLocalMessageIdentity(message) : { username });
      return;
    }
    const mentionTarget = event.target.closest('[data-mention-name]');
    if (mentionTarget) {
      event.preventDefault();
      event.stopPropagation();
      insertMention(mentionTarget.dataset.mentionName || '');
      return;
    }
    const target = event.target.closest('[data-reply-id]');
    if (target?.dataset.replyId) {
      if (event.target.closest('a, input, textarea, select')) return;
      event.preventDefault();
      event.stopPropagation();
      setReplyById(target.dataset.replyId);
    }
  });

  // Message input — typing, Enter, auto-resize, mention autocomplete
  const input = document.getElementById('message-input');
  input?.addEventListener('keydown', e => {
    if (e.key === 'Escape') renderSlashCommandPanel('');
    if (handleMentionKey(e)) return;
    const enterToSend = getChatBool('chatEnterToSend', true);
    const shouldSend = enterToSend ? !e.shiftKey : (e.ctrlKey || e.metaKey);
    if (e.key === 'Enter' && shouldSend) { e.preventDefault(); sendMessage(); }
  });
  input?.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 120) + 'px';
    // Mention autocomplete
    const val = input.value;
    onTypingInput();
    scheduleDraftSave();
    renderSlashCommandPanel(val);
    if (val.trimStart().startsWith('/')) {
      hideMentionPanel();
      return;
    }
    const atIdx = val.lastIndexOf('@');
    if (atIdx >= 0 && atIdx === val.length - 1 || (atIdx >= 0 && !/\s/.test(val.slice(atIdx + 1)))) {
      const query = val.slice(atIdx + 1);
      if (!query.includes(' ')) { showMentionPanel(query); return; }
    }
    hideMentionPanel();
  });
  input?.addEventListener('paste', handleMessagePaste);

  // Attach file
  const fileInput = document.getElementById('file-input');
  document.getElementById('attach-btn')?.addEventListener('click', () => fileInput?.click());
  fileInput?.addEventListener('change', e => handleFilesSelected(e.target.files));

  const composeArea = document.getElementById('compose-area');
  let dragDepth = 0;
  composeArea?.addEventListener('dragenter', event => {
    if (!Array.from(event.dataTransfer?.types || []).includes('Files')) return;
    event.preventDefault();
    dragDepth++;
    composeArea.classList.add('drag-active');
  });
  composeArea?.addEventListener('dragover', event => event.preventDefault());
  composeArea?.addEventListener('dragleave', () => {
    dragDepth = Math.max(0, dragDepth - 1);
    if (!dragDepth) composeArea.classList.remove('drag-active');
  });
  composeArea?.addEventListener('drop', event => {
    event.preventDefault();
    dragDepth = 0;
    composeArea.classList.remove('drag-active');
    handleFilesSelected(event.dataTransfer?.files);
  });

  const messagesContainer = document.getElementById('messages-container');
  messagesContainer?.addEventListener('scroll', () => {
    if (messagesContainer.scrollTop < 120) void loadOlderMessages();
    updateJumpToLatest();
    if (isNearMessageBottom(100)) scheduleMarkRead();
  }, { passive: true });
  document.getElementById('jump-latest-btn')?.addEventListener('click', () => {
    scrollBottomSoon({ force: true });
    scheduleMarkRead();
  });

  // Effects popover
  document.getElementById('effect-btn')?.addEventListener('click', e => {
    e.stopPropagation();
    toggleEffectsPopover();
  });

  // Close popover/panel on outside click
  document.addEventListener('click', () => {
    const pop = document.getElementById('effects-popover');
    if (pop) pop.style.display = 'none';
    hideMentionPanel();
  });
  input?.addEventListener('blur', () => {
    stopTypingNow();
  });
  document.getElementById('command-panel')?.addEventListener('click', e => e.stopPropagation());
  document.getElementById('effects-popover')?.addEventListener('click', e => e.stopPropagation());

  const noteActivity = () => {
    const wasIdle = Date.now() - S.presenceLastActivity > 5 * 60_000;
    S.presenceLastActivity = Date.now();
    if (wasIdle && S.presenceStatus === 'online') S.socket?.emit('presence_ping', presencePayload());
  };
  ['pointerdown', 'keydown', 'focus'].forEach(type => window.addEventListener(type, noteActivity, { passive: true }));
  clearInterval(S.presenceIdleTimer);
  S.presenceIdleTimer = setInterval(() => {
    if (S.presenceStatus === 'online' && Date.now() - S.presenceLastActivity > 5 * 60_000) {
      S.socket?.emit('presence_ping', presencePayload());
    }
  }, 60_000);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      noteActivity();
      scheduleMarkRead();
    }
  });

  // Toggle members (default in header)
  document.getElementById('toggle-members-btn')?.addEventListener('click', toggleMembersPanel);

  // Modal backdrop
  document.getElementById('modal-overlay')?.addEventListener('click', e => {
    if (e.target.id === 'modal-overlay') closeModal();
  });

  // Sidebar search
  document.getElementById('sidebar-search')?.addEventListener('input', e => {
    const q = e.target.value.toLowerCase();
    document.querySelectorAll('.sb-item[data-room-name]').forEach(btn => {
      btn.style.display = (btn.dataset.roomName||'').toLowerCase().includes(q) ? '' : 'none';
    });
  });

  // Update nav avatar
  updateNavAvatar();
  // Sync effect button color
  const effectColor = getEffectMeta(S.equippedEffect)?.color;
  const effectBtn = document.getElementById('effect-btn');
  if (effectBtn && effectColor && S.equippedEffect !== 'none') effectBtn.style.color = effectColor;
}

// ─── Launch ───────────────────────────────────────────────────────────────────
async function launchApp() {
  showApp();
  await refreshMessageEffectState();
  applyChatPreferences();
  const adminNav = document.getElementById('admin-nav-btn');
  if (adminNav) adminNav.style.display = isOwner() ? 'flex' : 'none';
  initSocket();
  setupAppHandlers();
  startFocusRewards();
  document.getElementById('voice-leave-btn')?.addEventListener('click', leaveVoice);
  document.getElementById('voice-mute-btn')?.addEventListener('click', toggleVoiceMute);
  document.getElementById('voice-deafen-btn')?.addEventListener('click', toggleVoiceDeafen);
  renderVoiceBar();
  if (!S.voice.rotationTimer) {
    S.voice.rotationTimer = setInterval(() => {
      if (S.voice.roster.length > 4) {
        S.voice.rotation = (S.voice.rotation + 1) % S.voice.roster.length;
        renderVoiceChannelPresence();
      }
    }, 2000);
  }
  if (!S.voice.presenceTimer) {
    S.voice.presenceTimer = setInterval(() => {
      if (S.section === 'channels') void fetchVoiceChannelPresence();
    }, 20_000);
  }
  await renderSection('channels');
  if ((S.globalRoom || S.channels.length) && !S.room) {
    const first = S.globalRoom ? { id: S.globalRoom, name: 'Global Chat' } : S.channels[0];
    const firstRoom = S.globalRoom ? first.id : channelRoomId(first);
    await joinRoom(firstRoom, 'channel', first.name || first.id);
  }
  void refreshDmsData().catch(() => {});
  void refreshGroupsData().catch(() => {});
  fetchAlerts();
}

window.addEventListener('storage', (event) => {
  if (event.key?.startsWith('chat')) applyChatPreferences();
});
window.addEventListener('message', (event) => {
  const data = event.data;
  if (data?.type === 'setting-changed' && String(data.key || '').startsWith('chat')) applyChatPreferences();
});

// ─── Boot ─────────────────────────────────────────────────────────────────────
async function boot() {
  const saved = localStorage.getItem('token');
  if (saved) S.token = saved;
  const cachedUser = saved ? getCachedUser() : null;
  const returnNavigation = configureReturnNavigation();
  const apiBase = resolveApiBase();

  if (cachedUser) {
    // Make returning to chat feel instant, then confirm the server session in
    // parallel. A rejected session is still sent straight to the login screen.
    setUser(cachedUser);
    showApp();
    await apiBase;
    const verification = loadUser();
    await launchApp();
    const verifiedUser = await verification;
    if (!verifiedUser && !S.user) {
      showLogin();
      setupLoginHandlers();
      return;
    }
    await returnNavigation;
    return;
  }

  await Promise.all([returnNavigation, apiBase]);
  const user = await loadUser();
  if (!user) { showLogin(); setupLoginHandlers(); return; }
  await launchApp();
}

boot().catch(err => console.error('[UBG Chat] Boot error:', err));
