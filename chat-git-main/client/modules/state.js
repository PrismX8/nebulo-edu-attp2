// --- App State ---
export const USER_SNAPSHOT_STORAGE_KEY = 'kchatUserSnapshot';
export const app = document.getElementById('app');

export const state = {
  token: localStorage.getItem('token') || '',
  apiBase: '',
  apiBaseResolved: false,
  apiBasePromise: null,
  user: null,
  channels: [],
  currentChannel: null,
  messages: [],
  pollTimer: null,
  metaTimer: null,
  bannedMessage: '',
  autoFollow: true,
  showJumpToLatest: false,
  lastMessagesSignature: '',
  composerNoticeTimer: null,
  joinPromise: null,
  joinRoomKey: '',
  messagesPromise: null,
  messagesRoomKey: '',
  presencePromise: null,
  alertsPromise: null,
  roomEffect: null,
  roomEffectClearTimer: null,
  animatedSpinKeys: new Set(),
  lastRoomEffectVisualKey: '',
  routeNonce: 0
};

export const slashCommands = [
  { cmd: '/help',       usage: '/help',                         desc: 'Show available commands',           roles: ['user', 'admin', 'owner'] },
  { cmd: '/ai',         usage: '/ai <siteId> <prompt>',         desc: 'Ask site AI to generate a reply',   roles: ['user', 'admin', 'owner'] },
  { cmd: '/warn',       usage: '/warn <target> <reason>',       desc: 'Warn a user',                       roles: ['admin', 'owner'] },
  { cmd: '/ban',        usage: '/ban <target> <reason>',        desc: 'Ban a user from this server',       roles: ['admin', 'owner'] },
  { cmd: '/banfromall', usage: '/banfromall <target> <reason>', desc: 'Global ban across all servers',     roles: ['owner'] },
  { cmd: '/unban',      usage: '/unban <target>',               desc: 'Unban a user',                      roles: ['admin', 'owner'] },
  { cmd: '/clearwarns', usage: '/clearwarns <target>',          desc: 'Reset warning count',               roles: ['admin', 'owner'] },
  { cmd: '/clearchat',  usage: '/clearchat [reason]',           desc: 'Clear room messages',               roles: ['owner'] }
];

export const fallbackEffects = [
  { id: 'none',       name: 'None',       price: 0,  description: 'No message effect.', roomDurationMs: 0 },
  { id: 'flashbands', name: 'Flashbands', price: 6,  description: 'A blinding full-screen flash washes over the room, then slowly fades away.', roomDurationMs: 6500 },
  { id: 'scramble',   name: 'Scramble',   price: 8,  description: 'Glitchy jitter with broken neon shadows.', roomDurationMs: 8000 },
  { id: 'embers',     name: 'Embers',     price: 9,  description: 'A hot orange glow with pulsing heat.', roomDurationMs: 8500 },
  { id: 'frostbyte',  name: 'Frostbyte',  price: 10, description: 'Icy highlights and a pale blue shimmer.', roomDurationMs: 8500 },
  { id: 'matrix',     name: 'Matrix',     price: 12, description: 'A room-wide storm of glowing green number rain.', roomDurationMs: 10000 },
  { id: 'starlight',  name: 'Starlight',  price: 14, description: 'Soft cosmic shimmer with a brighter edge.', roomDurationMs: 9000 }
];
