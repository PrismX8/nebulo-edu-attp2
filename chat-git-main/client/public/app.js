import { injectAppStyles } from './modules/styles.js';
import { createChatUi } from './modules/chat-ui.js';
import { activateGlobalEffect } from './modules/effects.js';

(() => {
  injectAppStyles();

  /* ═══════════════════════════════════════════════════════════════
     EXTRA GOLDEN SYSTEM MESSAGE STYLES (injected directly)
  ═══════════════════════════════════════════════════════════════ */
  const style = document.createElement('style');
  style.textContent = `
    /* Golden system messages */
    .message.system {
      border-left: 4px solid #f5c542 !important;
      background: linear-gradient(90deg, rgba(245,197,66,0.08) 0%, rgba(245,197,66,0) 100%) !important;
      color: #f5c542 !important;
      font-weight: 500 !important;
      letter-spacing: 0.02em !important;
    }
    .message.system .message-sender {
      color: #f5c542 !important;
      text-transform: uppercase !important;
      font-weight: 600 !important;
      font-size: 0.75rem !important;
    }
    .message.system .message-body {
      color: #f5e0a3 !important;
    }

    /* Avatar missing fallback */
    .avatar-missing::before {
      content: "👤";
      font-size: 1.4rem;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      background: var(--bg-raised, #1e1e24);
      border-radius: 50%;
      color: var(--text-3, #888);
      flex-shrink: 0;
    }
    .avatar-missing img {
      display: none !important;
    }

    /* Settings avatar preview */
    .avatar-preview-wrapper {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 12px;
    }
    .avatar-preview-img {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid var(--border-md);
      background: var(--bg-raised);
    }
    .avatar-preview-placeholder {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: var(--bg-raised);
      border: 2px solid var(--border-md);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      color: var(--text-3);
    }
    .avatar-file-name {
      font-size: 0.85rem;
      color: var(--text-2);
    }
  `;
  document.head.appendChild(style);

  /* ═══════════════════════════════════════════════════════════════
     STATE
  ═══════════════════════════════════════════════════════════════ */
  const app = document.getElementById('app');

  const state = {
    token: localStorage.getItem('token') || '',
    clientId: localStorage.getItem('tlkClientId') || '',
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
    slowmodeMs: 6000,
    slowmodeUntil: 0,
    slowmodeTimer: null,
    sendMessageInFlight: false,
    composerNoticeTimer: null,
    joinPromise: null,
    joinRoomKey: '',
    messagesPromise: null,
    messagesRoomKey: '',
    messagesFetchMode: '',
    presencePromise: null,
    alertsPromise: null,
    mentionTimeout: null,
    roomEffect: null,
    roomEffectTimer: null,
    lastFlashbangKey: '',
    flashbangCleanupTimer: null,
    routeNonce: 0,
    avatarVersion: Date.now(),
    mutualFriends: [],
    friendSearchResults: [],
    friendSearchQuery: ''
  };

  // Extra state for settings page file handling
  let selectedAvatarFile = null;   // the File object
  let selectedAvatarDataUrl = null; // preview

  const slashCommands = [
    { cmd: '/help',       usage: '/help',                         desc: 'Show available commands',           roles: ['user', 'admin', 'owner'] },
    { cmd: '/ai',         usage: '/ai <siteId> <prompt>',         desc: 'Ask site AI to generate a reply',   roles: ['user', 'admin', 'owner'] },
    { cmd: '/warn',       usage: '/warn <target> <reason>',       desc: 'Warn a user',                       roles: ['admin', 'owner'] },
    { cmd: '/ban',        usage: '/ban <target> <reason>',        desc: 'Ban a user from this server',       roles: ['admin', 'owner'] },
    { cmd: '/banfromall', usage: '/banfromall <target> <reason>', desc: 'Global ban across all servers',     roles: ['owner'] },
    { cmd: '/unban',      usage: '/unban <target>',               desc: 'Unban a user',                      roles: ['admin', 'owner'] },
    { cmd: '/clearwarns', usage: '/clearwarns <target>',          desc: 'Reset warning count',               roles: ['admin', 'owner'] },
    { cmd: '/slowmode',   usage: '/slowmode <seconds>',           desc: 'Set global chat slowmode',          roles: ['admin', 'owner'] },
    { cmd: '/global',     usage: '/global <effectId>',           desc: 'Activate a global chat effect',      roles: ['owner'] },
    { cmd: '/clearchat',  usage: '/clearchat [reason]',           desc: 'Clear room messages',               roles: ['owner'] }
  ];

  const fallbackEffects = [
    { id: 'none',       name: 'None',       price: 0,  description: 'No message effect.' },
    { id: 'flashbang',  name: 'Flashbang',  price: 6,  description: 'A blinding full-screen flash slams into the room.' },
    { id: 'scramble',   name: 'Scramble',   price: 8,  description: 'Glitchy jitter with broken neon shadows.' },
    { id: 'embers',     name: 'Embers',     price: 9,  description: 'A hot orange glow with pulsing heat.' },
    { id: 'frostbyte',  name: 'Frostbyte',  price: 10, description: 'Icy highlights and a pale blue shimmer.' },
    { id: 'matrix',     name: 'Matrix',     price: 12, description: 'Green terminal glow with digital flicker.' },
    { id: 'starlight',  name: 'Starlight',  price: 14, description: 'Soft cosmic shimmer with a brighter edge.' },
    { id: 'duck',       name: 'Duck Quack', price: 5,  description: 'A loud duck quack plays on everyone\'s screen globally.' }
  ];

  /* ═══════════════════════════════════════════════════════════════
     UTILITIES
  ═══════════════════════════════════════════════════════════════ */
  const esc = (v) => {
    if (v === null || v === undefined) return '';
    const div = document.createElement('div');
    div.textContent = String(v);
    return div.innerHTML;
  };

  const isDataUrl = (value) => /^data:/i.test(String(value || '').trim());

  const withAvatarVersion = (value, version = state.avatarVersion) => {
    const baseUrl = String(value || '').trim();
    if (!baseUrl) return '';
    if (isDataUrl(baseUrl)) return baseUrl;
    return baseUrl.includes('?') ? `${baseUrl}&v=${version}` : `${baseUrl}?v=${version}`;
  };

  const normalizeEffectId = (value) => {
    const clean = String(value || 'none').trim().toLowerCase();
    if (clean === 'flashbands') return 'flashbang';
    return fallbackEffects.some((effect) => effect.id === clean) ? clean : 'none';
  };

  const getEffectMeta = (effectId) =>
    fallbackEffects.find((effect) => effect.id === normalizeEffectId(effectId)) || fallbackEffects[0];

  const getRoomEffectMeta = () => {
    const effectId = normalizeEffectId(state.roomEffect?.effectId);
    return getEffectMeta(effectId);
  };

  const getActiveRoomEffectId = () => normalizeEffectId(state.roomEffect?.effectId);

  const getMessageEffect = (message) =>
    normalizeEffectId(message?.equippedEffect || message?.sender?.equippedEffect || 'none');

  const deactivateRoomEffect = () => {
    state.roomEffect = null;
    if (state.roomEffectTimer) {
      clearTimeout(state.roomEffectTimer);
      state.roomEffectTimer = null;
    }
    document.body.classList.remove('flashbang-active');
    document.body.style.removeProperty('--flashbang-duration');

    const roomSlug = state.currentChannel?.slug || state.currentChannel?.name || 'global';
    api(`/api/chat-effects/rooms/${encodeURIComponent(roomSlug)}/deactivate`, { method: 'POST' })
      .catch(() => {});

    renderRoomEffectStage();
    updateCoinDisplays();
  };

  const triggerFlashbang = (durationMs = 15000, triggeredByName = '') => {
    let overlay = document.querySelector('.flashbang-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'flashbang-overlay';
      document.body.appendChild(overlay);
    }
    let caption = overlay.querySelector('.flashbang-overlay-text');
    if (!caption) {
      caption = document.createElement('div');
      caption.className = 'flashbang-overlay-text';
      overlay.appendChild(caption);
    }
    const who = String(triggeredByName || '').trim();
    let kicker = caption.querySelector('.flashbang-overlay-kicker');
    let name = caption.querySelector('.flashbang-overlay-name');
    if (!kicker) {
      kicker = document.createElement('div');
      kicker.className = 'flashbang-overlay-kicker';
      caption.appendChild(kicker);
    }
    if (!name) {
      name = document.createElement('div');
      name.className = 'flashbang-overlay-name';
      caption.appendChild(name);
    }
    kicker.textContent = '';
    name.textContent = who ? `${who} flashed the chat` : 'Someone flashed the chat';

    if (state.flashbangCleanupTimer) {
      clearTimeout(state.flashbangCleanupTimer);
      state.flashbangCleanupTimer = null;
    }

    document.body.classList.remove('flashbang-active');
    overlay.classList.remove('active');
    document.body.classList.remove('flashbang-blur');
    overlay.classList.remove('blur');
    document.body.style.setProperty('--flashbang-duration', `${durationMs}ms`);
    overlay.style.setProperty('--flashbang-duration', `${durationMs}ms`);
    void document.body.offsetWidth;
    void overlay.offsetWidth;
    document.body.classList.add('flashbang-active');
    overlay.classList.add('active');
    document.body.classList.add('flashbang-blur');
    overlay.classList.add('blur');

    state.flashbangCleanupTimer = window.setTimeout(() => {
      overlay.classList.remove('active');
      setTimeout(() => {
        document.body.classList.remove('flashbang-active');
        document.body.classList.remove('flashbang-blur');
        overlay.classList.remove('blur');
        document.body.style.removeProperty('--flashbang-duration');
        overlay?.remove();
        state.flashbangCleanupTimer = null;
        if (getActiveRoomEffectId() === 'flashbang') {
          deactivateRoomEffect();
        }
      }, 1500);
    }, durationMs);
  };

  const renderRoomEffectStage = () => {
    const stage = document.getElementById('room-effect-stage');
    if (!stage) return;
    const effectId = getActiveRoomEffectId();
    if (effectId === 'none') {
      stage.className = 'room-effect-stage';
      stage.innerHTML = '';
      return;
    }
    stage.className = `room-effect-stage active room-effect-${effectId}`;
    stage.innerHTML = `
      <div class="room-effect-layer room-effect-layer-a"></div>
      <div class="room-effect-layer room-effect-layer-b"></div>
    `;
  };

  const setRoomEffectState = (roomEffect) => {
    if (state.roomEffectTimer) {
      clearTimeout(state.roomEffectTimer);
      state.roomEffectTimer = null;
    }

    const previousEffectId = getActiveRoomEffectId();
    const normalizedId = normalizeEffectId(roomEffect?.effectId);
    const nextFlashbangKey = normalizedId === 'flashbang'
      ? [
          normalizedId,
          String(roomEffect?.activatedAt || ''),
          String(roomEffect?.triggeredByName || ''),
          String(roomEffect?.expiresAt || '')
        ].join(':')
      : '';
    state.roomEffect = normalizedId === 'none'
      ? null
      : { ...roomEffect, effectId: normalizedId };

    if (normalizedId === 'flashbang' && nextFlashbangKey && nextFlashbangKey !== state.lastFlashbangKey) {
      const duration = Math.max(15000, Number(roomEffect?.durationMs) || 15000);
      triggerFlashbang(duration, roomEffect?.triggeredByName || '');
      state.lastFlashbangKey = nextFlashbangKey;
    } else if (normalizedId !== 'none' && normalizedId !== previousEffectId) {
      state.lastFlashbangKey = nextFlashbangKey;
    } else if (normalizedId === 'none' || previousEffectId !== normalizedId) {
      state.lastFlashbangKey = nextFlashbangKey;
    }

    updateCoinDisplays();
    renderRoomEffectStage();

    if (state.roomEffect && normalizedId !== 'flashbang') {
      const now = Date.now();
      const expiresAt = Number(state.roomEffect.expiresAt || 0);
      const activatedAt = Number(state.roomEffect.activatedAt || 0);
      const durationMs = Number(state.roomEffect.durationMs || 0);
      let remainingMs = 0;

      if (expiresAt > now) {
        remainingMs = expiresAt - now;
      } else if (durationMs > 0 && activatedAt > 0) {
        const endTime = activatedAt + durationMs;
        if (endTime > now) {
          remainingMs = endTime - now;
        }
      }

      if (remainingMs > 0) {
        state.roomEffectTimer = window.setTimeout(() => {
          state.roomEffectTimer = null;
          deactivateRoomEffect();
        }, remainingMs);
      } else {
        deactivateRoomEffect();
      }
    }

    return state.roomEffect;
  };

  const applyUserSnapshot = (user) => {
    state.user = user || null;
    state.avatarVersion = Date.now();
    updateCoinDisplays();
    refreshSidebarAvatar();
    return state.user;
  };

  const refreshSidebarAvatar = () => {
    const img = document.querySelector('#sidebar-avatar, .sidebar-avatar img, .sidebar img, [data-role="sidebar-avatar"]');
    if (!img || !state.user?.avatar) return;
    img.src = withAvatarVersion(state.user.avatar, state.avatarVersion);
  };

  const updateCoinDisplays = () => {
    const coins = Math.max(0, Number(state.user?.coins || 0));
    const label = `${coins} coin${coins === 1 ? '' : 's'}`;
    const sidebarCoins = document.getElementById('sidebar-coins');
    if (sidebarCoins) sidebarCoins.textContent = label;
    const settingsCoins = document.getElementById('settings-coins-balance');
    if (settingsCoins) settingsCoins.textContent = label;
    const settingsEffect = document.getElementById('settings-equipped-effect');
    if (settingsEffect) settingsEffect.textContent = getEffectMeta(state.user?.equippedEffect).name;
    const roomCoins = document.getElementById('room-effects-balance');
    if (roomCoins) roomCoins.textContent = label;
    const headerRoomEffect = document.getElementById('header-room-effect');
    if (headerRoomEffect) {
      headerRoomEffect.textContent = getActiveRoomEffectId() === 'none' ? 'No room effect' : `${getRoomEffectMeta().name} live`;
    }
    const composerRoomEffect = document.getElementById('composer-room-effect');
    if (composerRoomEffect) {
      composerRoomEffect.textContent = getActiveRoomEffectId() === 'none'
        ? 'No room effect active'
        : `${getRoomEffectMeta().name} active for this room`;
    }
  };

  const getHashPath  = () => (window.location.hash || '#/').replace(/^#/, '') || '/';
  const isPublicRoute = (path) => path.startsWith('/login') || path.startsWith('/register');

  const setToken = (token) => {
    state.token = token || '';
    if (state.token) localStorage.setItem('token', state.token);
    else localStorage.removeItem('token');
  };

  const getTlkClientId = () => {
    let id = localStorage.getItem('tlkClientId');
    if (!id) { id = `client_${Math.random().toString(36).slice(2)}_${Date.now()}`; localStorage.setItem('tlkClientId', id); }
    return id;
  };

  const getChatDeviceId = () => {
    let id = localStorage.getItem('chatDeviceId');
    if (!id) { id = `dev_${Math.random().toString(36).slice(2)}_${Date.now()}`; localStorage.setItem('chatDeviceId', id); }
    return id;
  };

  const isLoopbackHost = (hostname = '') => {
    const host = String(hostname || '').trim().toLowerCase();
    return host === 'localhost' || host === '127.0.0.1' || host === '[::1]';
  };

  const buildApiBaseCandidates = () => {
    const seen = new Set();
    const out = [];
    const add = (value) => {
      const normalized = String(value || '').replace(/\/+$/, '');
      if (!normalized || seen.has(normalized)) return;
      seen.add(normalized);
      out.push(normalized);
    };

    add(window.location.origin);

    try {
      const current = new URL(window.location.origin);
      if (isLoopbackHost(current.hostname)) {
        [400, 401, 402, 403, 404, 405].forEach((port) => {
          add(`${current.protocol}//${current.hostname}:${port}`);
        });
      }
    } catch {}

    return out;
  };

  const probeApiBase = async (base) => {
    try {
      const res = await fetch(`${base}/api/network/sites?__kchat_probe=1`, {
        method: 'GET',
        cache: 'no-store',
        mode: 'cors'
      });
      if (!res.ok) return false;
      const data = await res.json();
      return !!(Array.isArray(data?.sites) && data?.globalRoom);
    } catch {
      return false;
    }
  };

  const resolveApiBase = async () => {
    if (state.apiBaseResolved) return state.apiBase;
    if (state.apiBasePromise) return state.apiBasePromise;

    state.apiBasePromise = (async () => {
      for (const candidate of buildApiBaseCandidates()) {
        if (await probeApiBase(candidate)) {
          state.apiBase = candidate === window.location.origin ? '' : candidate;
          state.apiBaseResolved = true;
          return state.apiBase;
        }
      }

      state.apiBase = '';
      state.apiBaseResolved = true;
      return state.apiBase;
    })();

    try {
      return await state.apiBasePromise;
    } finally {
      state.apiBasePromise = null;
    }
  };

  const parseError = async (res, fallback) => {
    try {
      const data = await res.json();
      if (data?.msg) return data.msg;
      if (Array.isArray(data?.errors) && data.errors.length) return data.errors.map((e) => e?.msg).filter(Boolean).join(', ');
      return fallback;
    } catch { return fallback; }
  };

  const api = async (url, options = {}) => {
    const requestUrl = /^https?:\/\//i.test(String(url || ''))
      ? String(url)
      : `${await resolveApiBase()}${String(url || '')}`;
    const headers = Object.assign({}, options.headers || {});
    if (state.token) headers['x-auth-token'] = state.token;

    if (/\/api\/chat-effects\//.test(String(url || ''))) {
      let clientId = state.clientId || localStorage.getItem('tlkClientId');
      if (!clientId) {
        clientId = `${Math.random().toString(36).slice(2)}${Date.now()}`;
        state.clientId = clientId;
        localStorage.setItem('tlkClientId', clientId);
      }
      headers['x-tlk-client-id'] = clientId;
    }

    const isFormData = options.body instanceof FormData;
    if (!isFormData && !headers['Content-Type'] && options.body && typeof options.body === 'object') headers['Content-Type'] = 'application/json';

    let method = options.method || 'GET';
    if (/\/api\/chat-effects\/rooms\/[^/]+\/activate$/.test(String(url || ''))) method = 'POST';

    const res = await fetch(requestUrl, {
      method,
      headers,
      body: isFormData
        ? options.body
        : (headers['Content-Type'] === 'application/json' && options.body && typeof options.body === 'object')
          ? JSON.stringify(options.body)
          : options.body
    });

    if (!res.ok) {
      const err = new Error(await parseError(res, `Request failed (${res.status})`));
      err.status = res.status;
      throw err;
    }

    const text = await res.text();
    if (!text) return null;
    try { return JSON.parse(text); } catch { return text; }
  };

  const getMessagesSignature = (messages) => {
    const list = Array.isArray(messages) ? messages : [];
    return list.map((m) => [
      String(m?.id || m?._id || ''), String(m?.date || ''), String(m?.timestamp || ''),
      String(m?.body || m?.content || ''), m?.deleted ? '1' : '0', String(m?.roomEffect?.effectId || '')
    ].join('|')).join('||');
  };

  const navigate = (path) => { window.location.hash = `#${path}`; };

  const getAllowedSlashCommands = () => {
    const role = String(state.user?.role || 'user').toLowerCase();
    return slashCommands.filter((item) => item.roles.includes(role || 'user'));
  };

  const {
    cleanupChatTimers,
    showToast,
    loadUser,
    loadChannels,
    getCurrentChannel,
    renderLogin,
    renderRegister,
    layoutShell,
    renderSidebar,
    renderMessages,
    sendMessage,
    refreshFriends,
    renderDirectMessagesPage,
    renderChatPage
  } = createChatUi({
    app,
    state,
    fallbackEffects,
    esc,
    navigate,
    getAllowedSlashCommands,
    getRoomEffectMeta,
    getActiveRoomEffectId,
    getMessageEffect,
    setRoomEffectState,
    applyUserSnapshot,
    getEffectMeta,
    setToken,
    getTlkClientId,
    getChatDeviceId,
    api,
    getMessagesSignature,
    normalizeEffectId,
    renderRoomEffectStage,
    activateGlobalEffect
  });

  /* ═══════════════════════════════════════════════════════════════
     Click‑to‑mention & avatar error fallback
  ═══════════════════════════════════════════════════════════════ */

  function insertMention(username) {
    const input = document.getElementById('composer-input') ||
                  document.querySelector('[role="textbox"]') ||
                  document.querySelector('textarea, input[type="text"]');
    if (!input) return;
    const current = input.value;
    const suffix = current.length && !current.endsWith(' ') ? ' ' : '';
    input.value = current + suffix + '@' + username + ' ';
    input.focus();
  }

  function setupMentionClicks() {
    const container = document.getElementById('messages-container') ||
                      document.querySelector('.messages, .chat-messages');
    if (!container) return;

    container.addEventListener('click', (e) => {
      const sender = e.target.closest('[data-username]');
      if (!sender) return;
      const username = sender.getAttribute('data-username');
      if (username && username !== 'system') {
        insertMention(username);
      }
    });

    const avatarObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.tagName === 'IMG') {
            node.onerror = () => node.parentElement.classList.add('avatar-missing');
          }
          if (node.querySelectorAll) {
            node.querySelectorAll('img').forEach((img) => {
              img.onerror = () => img.parentElement.classList.add('avatar-missing');
            });
          }
        });
      });
    });
    avatarObserver.observe(container, { childList: true, subtree: true });
  }

  /* ═══════════════════════════════════════════════════════════════
     RENDER: SETTINGS (with avatar preview + file persistence)
  ═══════════════════════════════════════════════════════════════ */
  const renderSettingsPage = async () => {
    let effectsPayload = null;
    try {
      effectsPayload = await api('/api/chat-effects');
      if (effectsPayload?.user) applyUserSnapshot(effectsPayload.user);
    } catch (err) {
      console.warn('Failed to load effects:', err);
    }

    // Helper to get current avatar URL with cache-bust
    const currentAvatarUrl = state.user?.avatar
      ? withAvatarVersion(state.user.avatar, state.avatarVersion)
      : null;

    // Build avatar preview block
    const avatarPreviewHtml = currentAvatarUrl
      ? `<img id="current-avatar-preview" class="avatar-preview-img" src="${esc(currentAvatarUrl)}" alt="Your avatar" />`
      : `<div class="avatar-preview-placeholder">👤</div>`;

    layoutShell(`
      <div class="page-scroll">
        <div class="page-inner" style="max-width:760px">
          <div style="margin-bottom:4px">
            <h1 style="font-size:20px;font-weight:700;color:var(--text-1);letter-spacing:-0.02em">Settings</h1>
            <p style="font-size:13px;color:var(--text-3);margin-top:4px">Manage your account preferences</p>
          </div>

          <div class="card">
            <div class="card-title">Profile</div>
            <div id="settings-msg" class="banner banner-success hidden" style="margin-bottom:14px"></div>
            <div id="settings-err" class="banner banner-error hidden" style="margin-bottom:14px"></div>
            <form id="profile-form" class="form-stack">
              <div class="field">
                <label>Username</label>
                <input name="username" value="${esc(state.user?.username || '')}" class="inp" readonly />
              </div>
              <div class="field">
                <label>Avatar image</label>
                <div class="avatar-preview-wrapper">
                  ${avatarPreviewHtml}
                  <div id="avatar-file-info" style="display:flex;flex-direction:column;gap:4px">
                    <input id="avatar-file" type="file" accept="image/*" style="font-size:13px;color:var(--text-2)" />
                    <span id="avatar-file-name" class="avatar-file-name"></span>
                  </div>
                </div>
              </div>
              <div class="settings-balance">
                <div>
                  <div style="font-size:12px;color:var(--text-3);margin-bottom:4px">Current balance</div>
                  <strong>${Math.max(0, Number(state.user?.coins || 0))} coin${Number(state.user?.coins || 0) === 1 ? '' : 's'}</strong>
                </div>
                <div style="text-align:right;font-size:12px;color:var(--text-3)">Coins come from sending chat messages and can be gifted below.</div>
              </div>
              <div>
                <button class="btn btn-primary" type="submit">Save Profile</button>
              </div>
            </form>
          </div>

          <div class="card">
            <div class="card-title">Give Coins</div>
            <p style="font-size:12.5px;color:var(--text-3);margin-bottom:14px">Send coins directly to another account by username.</p>
            <form id="coin-transfer-form" class="form-stack">
              <div class="field">
                <label>Recipient username</label>
                <input name="username" placeholder="Who should receive coins?" class="inp" autocomplete="off" />
              </div>
              <div class="field">
                <label>Amount</label>
                <input name="amount" type="number" min="1" step="1" placeholder="How many coins?" class="inp" />
              </div>
              <div>
                <button class="btn btn-primary" type="submit">Send Coins</button>
              </div>
            </form>
          </div>

          <div class="card">
            <div class="card-title">Chat Effects</div>
            <div class="settings-balance" style="margin-bottom:14px">
              <div>
                <div style="font-size:12px;color:var(--text-3);margin-bottom:4px">Balance</div>
                <strong id="settings-coins-balance">${Math.max(0, Number(state.user?.coins || 0))} coin${Number(state.user?.coins || 0) === 1 ? '' : 's'}</strong>
              </div>
              <div style="text-align:right">
                <div style="font-size:12px;color:var(--text-3);margin-bottom:4px">Equipped</div>
                <div id="settings-equipped-effect" style="font-family:var(--font-head);font-size:16px;letter-spacing:0.06em;color:var(--text-1)">${esc(getEffectMeta(state.user?.equippedEffect).name)}</div>
              </div>
            </div>
            <p style="font-size:12.5px;color:var(--text-3);margin-bottom:14px">You earn 1 coin per sent chat message. Prices stay low so effects are easy to unlock.</p>
            <div id="effects-grid" class="effect-grid"></div>
          </div>

          <div class="card">
            <div class="card-title">Change Password</div>
            <form id="password-form" class="form-stack">
              <div class="field">
                <label>Current password</label>
                <input name="currentPassword" type="password" placeholder="Your current password" required class="inp" />
              </div>
              <div class="field">
                <label>New password</label>
                <input name="newPassword" type="password" placeholder="At least 6 characters" required minlength="6" class="inp" />
              </div>
              <div class="field">
                <label>Confirm new password</label>
                <input name="confirmPassword" type="password" placeholder="Repeat new password" required minlength="6" class="inp" />
              </div>
              <div>
                <button class="btn btn-primary" type="submit">Update Password</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `);

    const msgEl   = document.getElementById('settings-msg');
    const errEl   = document.getElementById('settings-err');
    const showErr = (m) => { errEl.textContent = m; errEl.classList.remove('hidden'); msgEl.classList.add('hidden'); };
    const showMsg = (m) => { msgEl.textContent = m; msgEl.classList.remove('hidden'); errEl.classList.add('hidden'); };
    const effectsGrid = document.getElementById('effects-grid');
    const effectState = {
      effects: Array.isArray(effectsPayload?.effects) && effectsPayload.effects.length ? effectsPayload.effects : fallbackEffects
    };

    // ---- Avatar file handling ----

    const fileInput = document.getElementById('avatar-file');
    const fileNameSpan = document.getElementById('avatar-file-name');
    const previewImg = document.getElementById('current-avatar-preview');

    if (selectedAvatarFile) {
      fileNameSpan.textContent = selectedAvatarFile.name;
      if (selectedAvatarDataUrl && previewImg) {
        previewImg.src = selectedAvatarDataUrl;
      }
    }

    fileInput?.addEventListener('change', () => {
      const file = fileInput.files?.[0];
      if (!file) {
        selectedAvatarFile = null;
        selectedAvatarDataUrl = null;
        fileNameSpan.textContent = '';
        if (previewImg && currentAvatarUrl) previewImg.src = currentAvatarUrl;
        return;
      }
      selectedAvatarFile = file;
      fileNameSpan.textContent = file.name;

      const reader = new FileReader();
      reader.onload = (e) => {
        selectedAvatarDataUrl = e.target.result;
        if (previewImg) {
          previewImg.src = selectedAvatarDataUrl;
        } else {
          // Create preview img if missing
          const wrapper = document.querySelector('.avatar-preview-wrapper');
          if (wrapper) {
            const newImg = document.createElement('img');
            newImg.id = 'current-avatar-preview';
            newImg.className = 'avatar-preview-img';
            newImg.src = selectedAvatarDataUrl;
            const placeholder = wrapper.querySelector('.avatar-preview-placeholder');
            if (placeholder) placeholder.replaceWith(newImg);
          }
        }
      };
      reader.readAsDataURL(file);
    });

    // ---- Effects grid (unchanged) ----
    const renderEffectsGrid = () => {
      if (!effectsGrid) return;
      const owned = new Set((state.user?.ownedEffects || ['none']).map((effectId) => normalizeEffectId(effectId)));
      const equipped = normalizeEffectId(state.user?.equippedEffect);
      const coins = Math.max(0, Number(state.user?.coins || 0));

      effectsGrid.innerHTML = effectState.effects.map((effect) => {
        const effectId = normalizeEffectId(effect.id);
        const price = Math.max(0, Number(effect.price || 0));
        const ownedEffect = owned.has(effectId);
        const active = equipped === effectId;
        const locked = !ownedEffect;
        const canAfford = coins >= price;
        const action = ownedEffect ? 'equip' : 'buy';
        const disabled = active || (locked && !canAfford);
        const buttonText = active ? 'Equipped' : ownedEffect ? 'Use' : `Buy ${price}c`;
        const metaText = active ? 'Active' : ownedEffect ? 'Owned' : canAfford ? 'Cheap unlock' : 'Need more coins';
        const previewClass = effectId === 'none' ? '' : `effect-${effectId}`;

        return `
          <div class="effect-card ${ownedEffect ? 'owned' : ''} ${active ? 'active' : ''}">
            <div class="effect-card-head">
              <div class="effect-card-title">${esc(effect.name || getEffectMeta(effectId).name)}</div>
              <div class="effect-price">${price === 0 ? 'FREE' : `${price} COINS`}</div>
            </div>
            <div class="effect-desc">${esc(effect.description || getEffectMeta(effectId).description)}</div>
            <div class="effect-preview ${previewClass}">Preview text for ${esc(effect.name || effectId)}</div>
            <div class="effect-meta">
              <span>${esc(metaText)}</span>
              ${locked ? '<span>Locked</span>' : '<span>Unlocked</span>'}
            </div>
            <div>
              <button class="btn btn-primary btn-sm" data-effect-action="${esc(action)}" data-effect-id="${esc(effectId)}" ${disabled ? 'disabled' : ''}>
                ${esc(buttonText)}
              </button>
            </div>
          </div>
        `;
      }).join('');

      effectsGrid.querySelectorAll('[data-effect-action]').forEach((button) => {
        button.addEventListener('click', async () => {
          const effectId = normalizeEffectId(button.getAttribute('data-effect-id'));
          const action = String(button.getAttribute('data-effect-action') || '');
          try {
            const data = action === 'buy'
              ? await api(`/api/chat-effects/${encodeURIComponent(effectId)}/purchase`, { method: 'POST' })
              : await api('/api/chat-effects/equip', { method: 'POST', body: { effectId } });
            if (data?.user) applyUserSnapshot(data.user);
            renderEffectsGrid();
            renderMessages();
            showMsg(data?.msg || (action === 'buy' ? 'Effect unlocked' : 'Effect equipped'));
          } catch (err) {
            showErr(err.message);
          }
        });
      });
      updateCoinDisplays();
    };
    renderEffectsGrid();

    // ---- Profile form submit (fixed avatar saving) ----
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
      profileForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        let avatar = null;

        // If a new file is selected, convert to base64
        if (selectedAvatarFile) {
          try {
            avatar = await new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve(String(reader.result));
              reader.onerror = () => reject(new Error('Failed to read avatar file'));
              reader.readAsDataURL(selectedAvatarFile);
            });
          } catch (err) {
            showErr('Avatar read error: ' + err.message);
            return;
          }
        }

        try {
          // Send profile update
          const data = await api('/api/users/profile', { method: 'PUT', body: { avatar } });
          
          // After successful update, refresh user data from server to get the latest avatar URL
          await loadUser();  // This will call applyUserSnapshot with fresh data
          
          // Clear the local file selection
          selectedAvatarFile = null;
          selectedAvatarDataUrl = null;
          if (fileInput) fileInput.value = '';
          if (fileNameSpan) fileNameSpan.textContent = '';
          
          // Update the preview with the new avatar from server (if any)
          const newAvatarUrl = state.user?.avatar
            ? withAvatarVersion(state.user.avatar, Date.now())
            : null;
          const previewImgElem = document.getElementById('current-avatar-preview');
          if (previewImgElem && newAvatarUrl) {
            previewImgElem.src = newAvatarUrl;
          } else if (previewImgElem && !newAvatarUrl) {
            // If no avatar, replace with placeholder
            const wrapper = document.querySelector('.avatar-preview-wrapper');
            if (wrapper) {
              const placeholder = document.createElement('div');
              placeholder.className = 'avatar-preview-placeholder';
              placeholder.textContent = '👤';
              previewImgElem.replaceWith(placeholder);
            }
          }
          
          // Refresh sidebar avatar (if sidebar uses images)
          refreshSidebarAvatar();
          renderMessages(); // refresh messages to show new avatar in chat
          showMsg(data?.msg || 'Profile updated successfully');
        } catch (err) {
          console.error('Profile save error:', err);
          showErr(err.message || 'Failed to update profile');
        }
      });
    }

    // ---- Coin transfer (unchanged) ----
    document.getElementById('coin-transfer-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(e.currentTarget);
      const username = String(fd.get('username') || '').trim();
      const amount = Math.max(0, Number(fd.get('amount') || 0));
      if (!username) { showErr('Recipient username is required'); return; }
      if (!Number.isFinite(amount) || amount <= 0) { showErr('Amount must be greater than 0'); return; }
      try {
        const data = await api('/api/users/transfer-coins', { method: 'POST', body: { username, amount } });
        if (data?.user) applyUserSnapshot(data.user);
        renderEffectsGrid();
        e.currentTarget.reset();
        showMsg(data?.msg || 'Coins sent successfully');
      } catch (err) {
        showErr(err.message);
      }
    });

    // ---- Change password (unchanged) ----
    document.getElementById('password-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(e.currentTarget);
      const currentPassword = String(fd.get('currentPassword') || '');
      const newPassword = String(fd.get('newPassword') || '');
      const confirmPassword = String(fd.get('confirmPassword') || '');
      if (newPassword !== confirmPassword) { showErr('New passwords do not match'); return; }
      try {
        const data = await api('/api/users/password', { method: 'PUT', body: { currentPassword, newPassword } });
        showMsg(data?.msg || 'Password updated successfully');
        e.currentTarget.reset();
      } catch (err) { showErr(err.message); }
    });
  };

  /* ═══════════════════════════════════════════════════════════════
     RENDER: ADMIN (with error resilience)
  ═══════════════════════════════════════════════════════════════ */
  const renderAdminPage = async () => {
    const role = String(state.user?.role || '').toLowerCase();
    if (!['owner', 'admin'].includes(role)) { navigate('/channels/global'); return; }

    layoutShell(`
      <div class="page-scroll">
        <div class="page-inner" style="max-width:760px">
          <div style="margin-bottom:4px">
            <h1 style="font-size:20px;font-weight:700;color:var(--text-1);letter-spacing:-0.02em">Admin Panel</h1>
            <p style="font-size:13px;color:var(--text-3);margin-top:4px">Server management and moderation tools</p>
          </div>

          <div id="admin-error" class="banner banner-error hidden"></div>

          <div class="card">
            <div class="card-title">System Status</div>
            <div id="ob-status" class="status-line" style="margin-bottom:14px">
              <span class="status-dot" style="background:var(--text-3)"></span>
              <span>Loading status…</span>
            </div>
            <div class="btn-bar" style="margin-bottom:14px">
              <button id="btn-auto-refresh" class="btn btn-ghost btn-sm">Refresh Status</button>
              <button id="btn-auto-start"   class="btn btn-primary btn-sm">Start Automation</button>
              <button id="btn-auto-stop"    class="btn btn-danger btn-sm">Stop Automation</button>
            </div>
            <pre id="auto-active" class="code-block" style="font-size:11.5px;max-height:160px;overflow-y:auto"></pre>
          </div>

          <div class="card">
            <div class="card-title">Moderation Lists</div>
            <p style="font-size:12.5px;color:var(--text-3);margin-bottom:16px">One item per line or comma-separated</p>
            <div class="form-stack">
              <div class="field">
                <label>Banned User Tokens</label>
                <textarea id="mod-users" rows="4" class="inp" style="font-family:var(--font-mono);font-size:12px"></textarea>
              </div>
              <div class="field">
                <label>Banned Accounts (User IDs)</label>
                <textarea id="mod-accounts" rows="4" class="inp" style="font-family:var(--font-mono);font-size:12px"></textarea>
              </div>
              <div class="field">
                <label>Banned Devices</label>
                <textarea id="mod-devices" rows="4" class="inp" style="font-family:var(--font-mono);font-size:12px"></textarea>
              </div>
              <div>
                <button id="btn-mod-save" class="btn btn-primary">Save Moderation Lists</button>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-title">User Management</div>
            <div class="overflow-x-auto">
              <table class="data-table" id="admin-users">
                <thead>
                  <tr>
                    <th>Username</th>
                    ${role === 'owner' ? '<th>User ID</th>' : ''}
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td colspan="${role === 'owner' ? '3' : '2'}" style="color:var(--text-3);padding:16px 0">Loading users…</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    `);

    const errEl   = document.getElementById('admin-error');
    const setError = (msg) => {
      if (!msg) { errEl.classList.add('hidden'); return; }
      errEl.textContent = msg;
      errEl.classList.remove('hidden');
    };
    const parseList = (v) => String(v || '').split(/[\n,]/).map((s) => s.trim()).filter(Boolean);

    const refreshAutomation = async () => {
      try {
        const [status, active] = await Promise.all([api('/api/openbullet/status'), api('/api/openbullet/automation/status')]);
        const online = status?.ok || status?.online;
        document.getElementById('ob-status').innerHTML = `
          <span class="status-dot ${online ? 'status-online' : ''}" style="${!online ? 'background:var(--danger)' : ''}"></span>
          <span>OpenBullet: ${online ? 'online' : (status?.msg || 'offline')}</span>
        `;
        document.getElementById('auto-active').textContent = JSON.stringify(active || {}, null, 2);
      } catch (err) {
        document.getElementById('ob-status').innerHTML =
          `<span class="status-dot" style="background:var(--danger)"></span><span>OpenBullet unavailable: ${esc(err.message)}</span>`;
      }
    };

    let users = [];
    let moderation = { bannedUsers: [], bannedAccounts: [], bannedDevices: [] };

    try {
      try {
        users = await api('/api/users');
      } catch (userErr) {
        if (userErr.status === 403) setError('You do not have permission to view user list.');
        else setError('Could not load users: ' + userErr.message);
      }

      try {
        moderation = await api('/api/network/moderation');
      } catch (modErr) {
        if (modErr.status === 403) setError('You do not have permission to view moderation lists.');
        else setError('Could not load moderation lists: ' + modErr.message);
      }

      document.getElementById('admin-users').querySelector('tbody').innerHTML =
        (!Array.isArray(users) || users.length === 0)
          ? `<tr><td colspan="${role === 'owner' ? '4' : '3'}" style="color:var(--text-3);padding:16px 0">No users found</td></tr>`
          : users.map((u) => {
              const r = String(u.role || 'user').toLowerCase();
              const roleClass = r === 'owner' ? 'role-owner' : r === 'admin' ? 'role-admin' : 'role-user';
              return `
                <tr>
                  <td style="font-family:var(--font-mono);font-size:12.5px">${esc(u.username || '')}</td>
                  ${role === 'owner' ? `<td style="font-family:var(--font-mono);font-size:12.5px;display:flex;align-items:center;gap:8px"><span>${esc(u._id || '')}</span><button type="button" data-copy-user-id="${esc(u._id || '')}" class="copy-id-btn">Copy</button></td>` : ''}
                  <td><span class="role-badge ${roleClass}">${esc(r)}</span></td>
                </tr>
              `;
            }).join('');

      document.getElementById('mod-users').value    = (moderation?.bannedUsers    || []).join('\n');
      document.getElementById('mod-accounts').value = (moderation?.bannedAccounts || []).join('\n');
      document.getElementById('mod-devices').value  = (moderation?.bannedDevices  || []).join('\n');
    } catch (err) {
      setError('Admin panel failed to initialise: ' + err.message);
    }

    await refreshAutomation();

    document.querySelectorAll('[data-copy-user-id]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const userId = String(btn.getAttribute('data-copy-user-id') || '').trim();
        if (!userId) return;
        try {
          await navigator.clipboard.writeText(userId);
          showToast('User ID copied');
        } catch {
          const textArea = document.createElement('textarea');
          textArea.value = userId;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          textArea.remove();
          showToast('User ID copied');
        }
      });
    });

    document.getElementById('btn-auto-refresh')?.addEventListener('click', async () => { await refreshAutomation(); showToast('Status refreshed'); });
    document.getElementById('btn-auto-start')?.addEventListener('click', async () => {
      try { await api('/api/openbullet/automation/start', { method: 'POST' }); await refreshAutomation(); showToast('Automation started'); }
      catch (err) { setError(err.message); }
    });
    document.getElementById('btn-auto-stop')?.addEventListener('click', async () => {
      try { await api('/api/openbullet/automation/stop', { method: 'POST' }); await refreshAutomation(); showToast('Automation stopped'); }
      catch (err) { setError(err.message); }
    });
    document.getElementById('btn-mod-save')?.addEventListener('click', async () => {
      try {
        await api('/api/network/moderation', {
          method: 'PUT',
          body: {
            bannedUsers:    parseList(document.getElementById('mod-users')?.value),
            bannedAccounts: parseList(document.getElementById('mod-accounts')?.value),
            bannedDevices:  parseList(document.getElementById('mod-devices')?.value)
          }
        });
        showToast('Moderation lists saved');
      } catch (err) { setError(err.message); }
    });
  };

  /* ═══════════════════════════════════════════════════════════════
     RENDER: SHOP
  ═══════════════════════════════════════════════════════════════ */
  const renderShopPage = async () => {
    layoutShell(`
      <div class="page-scroll">
        <div class="page-inner" style="max-width:720px">
          <div style="margin-bottom:4px">
            <h1 style="font-size:20px;font-weight:700;color:var(--text-1);letter-spacing:-0.02em">Shop</h1>
            <p style="font-size:13px;color:var(--text-3);margin-top:4px">Browse and purchase available products</p>
          </div>

          <div id="shop-error" class="banner banner-error hidden"></div>

          <div class="card">
            <div class="card-title">Products</div>
            <table class="data-table" id="shop-products">
              <tbody><tr><td colspan="4" style="color:var(--text-3);padding:16px 0">Loading…</td></tr></tbody>
            </table>
          </div>

          <div class="card">
            <div class="card-title">Purchase History</div>
            <table class="data-table" id="shop-history">
              <tbody><tr><td colspan="3" style="color:var(--text-3);padding:16px 0">Loading…</td></tr></tbody>
            </table>
          </div>

          <div class="card">
            <div class="card-title">Latest Credentials</div>
            <pre id="shop-creds" class="code-block">No credentials yet</pre>
          </div>
        </div>
      </div>
    `);

    const errorEl  = document.getElementById('shop-error');
    const setError = (msg) => { if (!msg) { errorEl.classList.add('hidden'); return; } errorEl.textContent = msg; errorEl.classList.remove('hidden'); };

    try {
      const [products, history] = await Promise.all([api('/api/shop/products'), api('/api/shop/purchases').catch(() => [])]);

      const table = document.getElementById('shop-products');
      if ((products || []).length === 0) {
        table.innerHTML = '<tbody><tr><td colspan="4" style="color:var(--text-3);padding:16px 0">No products available</td></tr></tbody>';
      } else {
        table.innerHTML = `
          <thead>
            <tr><th>Name</th><th>Price</th><th>Type</th><th></th></tr>
          </thead>
          <tbody>
            ${(products || []).map((p) => `
              <tr>
                <td style="color:var(--text-1);font-weight:500">${esc(p.name)}</td>
                <td style="font-family:var(--font-mono);color:var(--gold)">$${Number(p.price || 0).toFixed(2)}</td>
                <td style="font-family:var(--font-mono);font-size:11.5px;color:var(--text-3)">${esc(p.type || '')}</td>
                <td>
                  <button data-buy-id="${esc(p._id)}" ${p.stock === 0 ? 'disabled' : ''}
                          class="btn btn-primary btn-sm" style="${p.stock === 0 ? 'opacity:0.4;cursor:not-allowed' : ''}">
                    ${p.stock === 0 ? 'Out of Stock' : 'Buy'}
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>`;
      }

      table.querySelectorAll('[data-buy-id]').forEach((btn) => {
        btn.addEventListener('click', async () => {
          setError('');
          try {
            const data = await api(`/api/shop/purchase/${encodeURIComponent(btn.getAttribute('data-buy-id'))}`, { method: 'POST' });
            document.getElementById('shop-creds').textContent = String(data?.credentials || 'No credentials returned');
            showToast('Purchase complete!');
          } catch (err) { setError(err.message); }
        });
      });

      const hist = document.getElementById('shop-history');
      if (!Array.isArray(history) || history.length === 0) {
        hist.innerHTML = '<tbody><tr><td colspan="3" style="color:var(--text-3);padding:16px 0">No purchases yet</td></tr></tbody>';
      } else {
        hist.innerHTML = `
          <thead><tr><th>Product</th><th>Date</th><th>Price</th></tr></thead>
          <tbody>${history.map((h) => `
            <tr>
              <td style="color:var(--text-1);font-weight:500">${esc(h?.productId?.name || 'Product')}</td>
              <td style="font-family:var(--font-mono);font-size:12px">${esc(new Date(h?.date || Date.now()).toLocaleString())}</td>
              <td style="font-family:var(--font-mono);color:var(--gold)">$${Number(h?.price || 0).toFixed(2)}</td>
            </tr>`).join('')}
          </tbody>`;
      }
    } catch (err) { setError(err.message); }
  };

  /* ═══════════════════════════════════════════════════════════════
     RENDER: MARKETPLACE
  ═══════════════════════════════════════════════════════════════ */
  const renderMarketplacePage = async () => {
    layoutShell(`
      <div class="page-scroll">
        <div class="page-inner" style="max-width:720px">
          <div style="margin-bottom:4px">
            <h1 style="font-size:20px;font-weight:700;color:var(--text-1);letter-spacing:-0.02em">Marketplace</h1>
            <p style="font-size:13px;color:var(--text-3);margin-top:4px">Order products from verified sellers</p>
          </div>

          <div class="field">
            <input id="market-search" placeholder="Search products…" class="inp" />
          </div>

          <div id="market-error" class="banner banner-error hidden"></div>

          <div class="card" style="padding:0;overflow:hidden">
            <table class="data-table" id="market-table" style="margin:0">
              <tbody><tr><td style="color:var(--text-3);padding:24px">Loading…</td></tr></tbody>
            </table>
          </div>

          <div class="card">
            <div class="card-title">Delivery Content</div>
            <pre id="market-delivery" class="code-block">No order placed yet</pre>
          </div>
        </div>
      </div>
    `);

    const errorEl  = document.getElementById('market-error');
    const table    = document.getElementById('market-table');
    const search   = document.getElementById('market-search');
    let   products = [];

    const setError = (msg) => { if (!msg) { errorEl.classList.add('hidden'); return; } errorEl.textContent = msg; errorEl.classList.remove('hidden'); };

    const render = () => {
      const q        = String(search.value || '').trim().toLowerCase();
      const filtered = products.filter((p) => !q ||
        String(p.name || '').toLowerCase().includes(q) || String(p.description || '').toLowerCase().includes(q));

      if (filtered.length === 0) {
        table.innerHTML = '<tbody><tr><td style="color:var(--text-3);padding:24px">No products found</td></tr></tbody>';
        return;
      }

      table.innerHTML = `
        <thead>
          <tr style="border-bottom:1px solid var(--border-md)">
            <th style="padding:14px 16px">Name</th>
            <th style="padding:14px 16px">Category</th>
            <th style="padding:14px 16px">Price</th>
            <th style="padding:14px 16px"></th>
          </tr>
        </thead>
        <tbody>${filtered.map((p) => `
          <tr>
            <td style="padding:12px 16px;color:var(--text-1);font-weight:500;border-bottom:1px solid var(--border)">${esc(p.name)}</td>
            <td style="padding:12px 16px;border-bottom:1px solid var(--border)">
              ${p.category ? `<span style="background:var(--bg-raised);border:1px solid var(--border-md);border-radius:4px;padding:2px 8px;font-family:var(--font-mono);font-size:11px;color:var(--text-3)">${esc(p.category)}</span>` : '—'}
            </td>
            <td style="padding:12px 16px;font-family:var(--font-mono);color:var(--gold);border-bottom:1px solid var(--border)">$${Number(p.price || 0).toFixed(2)}</td>
            <td style="padding:12px 16px;border-bottom:1px solid var(--border)">
              <button data-order-id="${esc(p._id)}" class="btn btn-primary btn-sm">Order</button>
            </td>
          </tr>
        `).join('')}</tbody>`;

      table.querySelectorAll('[data-order-id]').forEach((btn) => {
        btn.addEventListener('click', async () => {
          setError('');
          const id = btn.getAttribute('data-order-id');
          try {
            const order = await api(`/api/marketplace/order/${encodeURIComponent(id)}`, { method: 'POST', body: { quantity: 1 } });
            await api(`/api/marketplace/orders/${encodeURIComponent(order._id)}/status`, { method: 'PUT', body: { status: 'completed' } });
            const done = await api(`/api/marketplace/orders/${encodeURIComponent(order._id)}`);
            document.getElementById('market-delivery').textContent = String(done?.deliveryData?.content || 'No delivery content');
            showToast('Order completed!');
          } catch (err) { setError(err.message); }
        });
      });
    };

    search.addEventListener('input', render);

    try {
      const data = await api('/api/marketplace/products');
      products = Array.isArray(data?.products) ? data.products : [];
      render();
    } catch (err) { setError(err.message); }
  };

  /* ═══════════════════════════════════════════════════════════════
     ROUTER
  ═══════════════════════════════════════════════════════════════ */
  const ensureAuthAndData = async () => {
    if (!state.user) await loadUser();
    if (!state.user) { navigate('/login'); return false; }
    if (!state.channels.length) await loadChannels().catch(() => { state.channels = []; });
    if (typeof refreshFriends === 'function') await refreshFriends();
    return true;
  };

  const router = async () => {
    const path = getHashPath();
    if (!state.user && state.token) await loadUser();
    if (!state.user && !isPublicRoute(path)) { navigate('/login'); return; }
    if ( state.user &&  isPublicRoute(path)) { navigate('/channels/global'); return; }

    if (path.startsWith('/login'))    { renderLogin();    return; }
    if (path.startsWith('/register')) { renderRegister(); return; }

    if (!(await ensureAuthAndData())) return;

    if (path.startsWith('/channels/')) {
      await renderChatPage(decodeURIComponent(path.split('/')[2] || 'global'));
      setupMentionClicks();
      return;
    }
    if (path.startsWith('/direct-messages')) { cleanupChatTimers(); await renderDirectMessagesPage(); return; }
    if (path === '/' || path === '/channels' || path === '/dashboard') { navigate('/channels/global'); return; }
    if (path.startsWith('/settings'))    { cleanupChatTimers(); await renderSettingsPage();    return; }
    if (path.startsWith('/admin'))       { cleanupChatTimers(); await renderAdminPage();       return; }
    if (path.startsWith('/shop'))        { cleanupChatTimers(); await renderShopPage();        return; }
    if (path.startsWith('/marketplace')) { cleanupChatTimers(); await renderMarketplacePage(); return; }

    navigate('/channels/global');
  };

  const onRouteError = (err) => {
    app.innerHTML = `
      <div style="min-height:100vh;background:var(--bg-void);display:flex;align-items:center;justify-content:center">
        <div style="background:var(--bg-card);border:1px solid var(--border-md);border-radius:var(--radius-xl);padding:32px;color:var(--danger);font-size:13.5px;max-width:420px;text-align:center">
          <div style="font-size:32px;margin-bottom:12px">⚠️</div>
          ${esc(err.message || 'Unexpected error')}
        </div>
      </div>`;
  };

  window.addEventListener('hashchange', () => router().catch(onRouteError));
  window.addEventListener('error', (event) => {
    console.error(event.error || event.message || event);
  });
  window.addEventListener('unhandledrejection', (event) => {
    console.error(event.reason || event);
  });
  router().catch(onRouteError);
})();
