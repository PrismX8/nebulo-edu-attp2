// Local hosting adapter for games exported with an optional portal SDK.
// Saves stay on this browser. No portal account, purchase, or ad reward is fabricated.
(() => {
  if (window.NebuloGamePlatform) return;
  window.NebuloGamePlatform = true;
  const key = 'nebulo-game-save:' + location.pathname.replace(/\/[^/]*$/, '/');
  let memory = {};
  const read = () => { try { return JSON.parse(localStorage.getItem(key) || '{}'); } catch (_) { return memory; } };
  const write = data => { memory = data; try { localStorage.setItem(key, JSON.stringify(data)); } catch (_) {} };
  const select = (data, keys) => Array.isArray(keys) ? Object.fromEntries(keys.filter(k => k in data).map(k => [k, data[k]])) : data;
  const update = (field, data) => { const save = read(); save[field] = { ...save[field], ...data }; write(save); };
  const player = {
    getName: () => 'Local player', getUniqueID: () => 'local', getPhoto: () => '', getMode: () => 'lite',
    isAuthorized: () => false,
    getData: async keys => select(read().data || {}, keys), setData: async data => update('data', data),
    getStats: async keys => select(read().stats || {}, keys), setStats: async stats => update('stats', stats),
    incrementStats: async increments => {
      const stats = read().stats || {};
      for (const [name, value] of Object.entries(increments || {})) stats[name] = (Number(stats[name]) || 0) + (Number(value) || 0);
      update('stats', stats);
    },
  };
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
