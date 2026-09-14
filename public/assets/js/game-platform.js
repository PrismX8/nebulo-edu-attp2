// Local hosting adapter for games exported with an optional portal SDK.
// Saves stay on this browser. No portal account, purchase, or ad reward is fabricated.
// When logged in, saves are also synced to the server for cross-device persistence.
(() => {
  if (window.NebuloGamePlatform) return;
  window.NebuloGamePlatform = true;
  const key = 'nebulo-game-save:' + location.pathname.replace(/\/[^/]*$/, '/');
  let memory = {};
  const read = () => { try { return JSON.parse(localStorage.getItem(key) || '{}'); } catch (_) { return memory; } };
  const write = data => { memory = data; try { localStorage.setItem(key, JSON.stringify(data)); } catch (_) {} };
  const select = (data, keys) => Array.isArray(keys) ? Object.fromEntries(keys.filter(k => k in data).map(k => [k, data[k]])) : data;
  const update = (field, data) => { const save = read(); save[field] = { ...save[field], ...data }; write(save); scheduleServerSync(); };

  // ── Server sync ──
  let syncTimer = null;
  let serverSavesLoaded = false;
  const getToken = () => { try { return localStorage.getItem('token') || ''; } catch (_) { return ''; } };
  const gamePath = location.pathname.replace(/\/[^/]*$/, '/');

  const scheduleServerSync = () => {
    if (!getToken()) return;
    clearTimeout(syncTimer);
    syncTimer = setTimeout(() => syncToServer(), 1500);
  };

  const syncToServer = async () => {
    const token = getToken();
    if (!token) return;
    try {
      const save = read();
      await fetch('/api/game-progress', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
        body: JSON.stringify({ gamePath, data: save })
      });
    } catch (_) {}
  };

  const loadFromServer = async () => {
    const token = getToken();
    if (!token || serverSavesLoaded) return;
    try {
      const res = await fetch('/api/game-progress', { headers: { 'x-auth-token': token } });
      if (!res.ok) return;
      const progress = await res.json();
      if (progress.saves && progress.saves[gamePath]) {
        const serverData = progress.saves[gamePath];
        const localData = read();
        // Merge: prefer newer data per field
        const merged = { ...localData };
        for (const [field, value] of Object.entries(serverData)) {
          if (field === 'lastUpdated') continue;
          if (!merged[field] || (value && typeof value === 'object' && !Array.isArray(value))) {
            merged[field] = { ...(merged[field] || {}), ...(value || {}) };
          }
        }
        write(merged);
      }
      serverSavesLoaded = true;
    } catch (_) {}
  };

  // Load from server when game platform initializes
  loadFromServer();

  const player = {
    getName: () => 'Local player', getUniqueID: () => 'local', getPhoto: () => '', getMode: () => 'lite',
    isAuthorized: () => !!getToken(),
    getData: async keys => { await loadFromServer(); return select(read().data || {}, keys); },
    setData: async data => update('data', data),
    getStats: async keys => { await loadFromServer(); return select(read().stats || {}, keys); },
    setStats: async stats => update('stats', stats),
    incrementStats: async increments => {
      const stats = read().stats || {};
      for (const [name, value] of Object.entries(increments || {})) stats[name] = (Number(stats[name]) || 0) + (Number(value) || 0);
      update('stats', stats);
    },
  };

  // ── Recently played tracking ──
  const trackRecentlyPlayed = () => {
    // The games library records the catalog title, cover, and categories as
    // soon as its player opens. Do not replace that richer entry with the
    // embedded document title a few seconds later.
    if (window.self !== window.top) return;
    const token = getToken();
    if (!token) return;
    const gameName = document.title || location.pathname.split('/').filter(Boolean).pop() || 'Game';
    fetch('/api/game-progress/recent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
      body: JSON.stringify({ gamePath, gameName })
    }).catch(() => {});
  };
  // Track on game ready
  window.addEventListener('nebulo-game-ready', trackRecentlyPlayed, { once: true });
  // Fallback: track after a short delay if ready event never fires
  setTimeout(trackRecentlyPlayed, 3000);

  const unavailable = async () => { throw new Error('This feature requires the original game portal.'); };
  window.YaGames = {
    init: async (options = {}) => ({
      environment: { app: { id: 'local' }, browser: { lang: (navigator.language || 'en').split('-')[0] }, i18n: { lang: (navigator.language || 'en').split('-')[0], tld: 'com' }, payload: '' },
      deviceInfo: { type: matchMedia('(pointer: coarse)').matches ? 'mobile' : 'desktop', isMobile: () => matchMedia('(pointer: coarse)').matches, isDesktop: () => !matchMedia('(pointer: coarse)').matches, isTablet: () => false },
      features: { LoadingAPI: { ready() { window.dispatchEvent(new Event('nebulo-game-ready')); } }, GameplayAPI: { start() {}, stop() {} } },
      adv: {
        showFullscreenAdv({ callbacks = {} } = {}) { queueMicrotask(() => { callbacks.onClose?.(false); options.adv?.onAdvClose?.(false); }); },
        showRewardedVideo({ callbacks = {} } = {}) { queueMicrotask(() => { callbacks.onError?.(new Error('Ads are unavailable on this host.')); callbacks.onClose?.(); }); },
        getBannerAdvStatus: async () => ({ stickyAdvIsShowing: false }),
        showBannerAdv: async () => ({ stickyAdvIsShowing: false }), hideBannerAdv: async () => ({}),
      },
      getPlayer: async () => player,
      getPayments: async () => ({ getCatalog: async () => [], getPurchases: async () => [], purchase: unavailable, consumePurchase: unavailable }),
      auth: { openAuthDialog: unavailable },
      feedback: { canReview: async () => ({ value: false, reason: 'NO_AUTH' }), requestReview: async () => ({ feedbackSent: false }) },
      shortcut: { canShowPrompt: async () => ({ canShow: false }), showPrompt: async () => ({ outcome: 'dismissed' }) },
      screen: { fullscreen: { request: () => document.documentElement.requestFullscreen?.(), exit: () => document.exitFullscreen?.(), get STATUS() { return document.fullscreenElement ? 'on' : 'off'; } } },
      isAvailableMethod: async () => false,
      on() {}, off() {},
    }),
  };
  window.cmgAdBreak = () => queueMicrotask(() => document.dispatchEvent(new Event('adBreakComplete')));
  // Some GameSnacks exports omit their portal bridge altogether. Keep local
  // progress usable without pretending to submit scores or display paid ads.
  if (!window.GameSnacks) {
    const audioSubscribers = new Set();
    let audioEnabled = read().audioEnabled !== false;
    window.GameSnacks = {
      storage: {
        getItem: name => read().storage?.[name] ?? null,
        setItem: (name, value) => update('storage', { [name]: String(value) }),
        removeItem(name) { const save = read(); if (save.storage) delete save.storage[name]; write(save); },
      },
      audio: {
        isEnabled: () => audioEnabled,
        subscribe(callback) { audioSubscribers.add(callback); callback(audioEnabled); return () => audioSubscribers.delete(callback); },
        setEnabled(value) { audioEnabled = !!value; write({...read(), audioEnabled}); for (const cb of audioSubscribers) cb(audioEnabled); },
      },
      game: {
        ready() { window.dispatchEvent(new Event('nebulo-game-ready')); },
        gameOver() { window.dispatchEvent(new Event('nebulo-game-over')); },
        levelComplete(level) { update('stats', {lastCompletedLevel:level}); },
      },
      score: { update(score) { update('stats', {score}); } },
      ad: { break(options = {}) { queueMicrotask(() => options.adBreakDone?.({breakStatus:'notReady'})); } },
    };
  }
})();
