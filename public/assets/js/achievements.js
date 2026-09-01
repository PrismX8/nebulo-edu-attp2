/* Nebulo Achievements: lightweight, local-only rewards shared by the shell. */
(() => {
  'use strict';

  const STORAGE_KEY = 'nebuloAchievements';
  const VERSION = 3;
  const definitions = [
    // Arrival — actual page visits, retained locally.
    { id: 'first_visit', title: 'First Signal', description: 'Open Nebulo for the first time.', icon: 'fa-satellite-dish', points: 10, goal: 1, progress: s => s.progress.visits || 0, reward: 'cursor-nebula' },
    { id: 'settling_in', title: 'Settling In', description: 'Return to Nebulo 5 times.', icon: 'fa-house-signal', points: 10, goal: 5, progress: s => s.progress.visits || 0 },
    { id: 'steady_signal', title: 'Steady Signal', description: 'Visit Nebulo 20 times.', icon: 'fa-tower-broadcast', points: 20, goal: 20, progress: s => s.progress.visits || 0 },
    { id: 'daily_orbit', title: 'Daily Orbit', description: 'Visit Nebulo 60 times.', icon: 'fa-orbit', points: 35, goal: 60, progress: s => s.progress.visits || 0 },
    { id: 'home_frequency', title: 'Home Frequency', description: 'Visit Nebulo 150 times.', icon: 'fa-satellite', points: 60, goal: 150, progress: s => s.progress.visits || 0 },
    // Quick Access — launcher use, not background timers.
    { id: 'quick_launch', title: 'Fast Lane', description: 'Launch something from Quick Access.', icon: 'fa-bolt', points: 15, goal: 1, progress: s => s.progress.quickLaunches || 0, reward: 'accent-aurora' },
    { id: 'shortcut_habit', title: 'Shortcut Habit', description: 'Use Quick Access 5 times.', icon: 'fa-forward-fast', points: 15, goal: 5, progress: s => s.progress.quickLaunches || 0 },
    { id: 'launch_sequence', title: 'Launch Sequence', description: 'Use Quick Access 15 times.', icon: 'fa-rocket', points: 25, goal: 15, progress: s => s.progress.quickLaunches || 0 },
    { id: 'fast_track', title: 'Fast Track', description: 'Use Quick Access 40 times.', icon: 'fa-gauge-high', points: 40, goal: 40, progress: s => s.progress.quickLaunches || 0 },
    { id: 'launcher_legend', title: 'Launcher Legend', description: 'Use Quick Access 100 times.', icon: 'fa-fire', points: 65, goal: 100, progress: s => s.progress.quickLaunches || 0 },
    // Search — only submitted launcher and shell searches count.
    { id: 'searcher', title: 'Signal Finder', description: 'Run a search from the Nebulo launcher.', icon: 'fa-magnifying-glass', points: 15, goal: 1, progress: s => s.progress.searches || 0, reward: 'cursor-precision' },
    { id: 'query_scout', title: 'Query Scout', description: 'Run 5 Nebulo searches.', icon: 'fa-binoculars', points: 15, goal: 5, progress: s => s.progress.searches || 0 },
    { id: 'research_rhythm', title: 'Research Rhythm', description: 'Run 20 Nebulo searches.', icon: 'fa-book-open', points: 30, goal: 20, progress: s => s.progress.searches || 0 },
    { id: 'deep_signal', title: 'Deep Signal', description: 'Run 50 Nebulo searches.', icon: 'fa-wave-square', points: 45, goal: 50, progress: s => s.progress.searches || 0 },
    { id: 'search_cartographer', title: 'Search Cartographer', description: 'Run 100 Nebulo searches.', icon: 'fa-map', points: 70, goal: 100, progress: s => s.progress.searches || 0 },
    // Settings and chat visits are deliberately small, honest milestones.
    { id: 'settings_visit', title: 'Control Room', description: 'Open Settings from the shell.', icon: 'fa-sliders', points: 10, goal: 1, progress: s => s.progress.settingsVisits || 0, reward: 'effect-stars' },
    { id: 'settings_return', title: 'Fine Tuning', description: 'Open Settings 3 times.', icon: 'fa-sliders', points: 15, goal: 3, progress: s => s.progress.settingsVisits || 0 },
    { id: 'settings_hand', title: 'Configuration Hand', description: 'Open Settings 10 times.', icon: 'fa-screwdriver-wrench', points: 30, goal: 10, progress: s => s.progress.settingsVisits || 0 },
    { id: 'system_steward', title: 'System Steward', description: 'Open Settings 25 times.', icon: 'fa-gears', points: 50, goal: 25, progress: s => s.progress.settingsVisits || 0 },
    { id: 'chat_visit', title: 'Open Channel', description: 'Visit Nebulo Chat.', icon: 'fa-comments', points: 10, goal: 1, progress: s => s.progress.chatVisits || 0 },
    { id: 'channel_checkin', title: 'Channel Check-in', description: 'Visit Nebulo Chat 3 times.', icon: 'fa-comment-dots', points: 15, goal: 3, progress: s => s.progress.chatVisits || 0 },
    { id: 'signal_social', title: 'Signal Social', description: 'Visit Nebulo Chat 10 times.', icon: 'fa-message', points: 30, goal: 10, progress: s => s.progress.chatVisits || 0 },
    { id: 'open_frequency', title: 'Open Frequency', description: 'Visit Nebulo Chat 30 times.', icon: 'fa-walkie-talkie', points: 50, goal: 30, progress: s => s.progress.chatVisits || 0 },
    // Exploration derives from distinct named areas/tabs, not raw time.
    { id: 'explorer', title: 'Constellation', description: 'Explore 3 different Nebulo areas.', icon: 'fa-compass', points: 25, goal: 3, progress: s => Object.keys(s.progress.areas || {}).length, reward: 'cursor-pixel' },
    { id: 'wayfinder', title: 'Wayfinder', description: 'Explore 8 different Nebulo areas.', icon: 'fa-route', points: 35, goal: 8, progress: s => Object.keys(s.progress.areas || {}).length },
    { id: 'mapmaker', title: 'Mapmaker', description: 'Explore 15 different Nebulo areas.', icon: 'fa-map-location-dot', points: 50, goal: 15, progress: s => Object.keys(s.progress.areas || {}).length },
    { id: 'star_chart', title: 'Star Chart', description: 'Explore 25 different Nebulo areas.', icon: 'fa-star', points: 70, goal: 25, progress: s => Object.keys(s.progress.areas || {}).length },
    { id: 'wide_horizon', title: 'Wide Horizon', description: 'Explore 40 different Nebulo areas.', icon: 'fa-earth-americas', points: 100, goal: 40, progress: s => Object.keys(s.progress.areas || {}).length },
    // The deck itself earns repeat-use milestones.
    { id: 'achievement_visit', title: 'Self Aware', description: 'Visit the Achievements deck.', icon: 'fa-trophy', points: 10, goal: 1, progress: s => s.progress.achievementVisits || 0 },
    { id: 'progress_check', title: 'Progress Check', description: 'Visit the Achievements deck 5 times.', icon: 'fa-clipboard-check', points: 15, goal: 5, progress: s => s.progress.achievementVisits || 0 },
    { id: 'collection_log', title: 'Collection Log', description: 'Visit the Achievements deck 15 times.', icon: 'fa-medal', points: 30, goal: 15, progress: s => s.progress.achievementVisits || 0 },
    { id: 'deckkeeper', title: 'Deckkeeper', description: 'Visit the Achievements deck 30 times.', icon: 'fa-award', points: 50, goal: 30, progress: s => s.progress.achievementVisits || 0 },
    // Cosmetic equips are recorded only after the user actively chooses one.
    { id: 'first_fit', title: 'First Fit', description: 'Equip a Nebulo site cosmetic.', icon: 'fa-wand-magic-sparkles', points: 10, goal: 1, progress: s => s.progress.equips || 0 },
    { id: 'style_switcher', title: 'Style Switcher', description: 'Equip Nebulo site cosmetics 5 times.', icon: 'fa-palette', points: 20, goal: 5, progress: s => s.progress.equips || 0 },
    { id: 'personal_touch', title: 'Personal Touch', description: 'Equip Nebulo site cosmetics 15 times.', icon: 'fa-swatchbook', points: 40, goal: 15, progress: s => s.progress.equips || 0 },
    { id: 'collection_curator', title: 'Collection Curator', description: 'Equip Nebulo site cosmetics 30 times.', icon: 'fa-gem', points: 65, goal: 30, progress: s => s.progress.equips || 0 }
  ];

  // These labels are part of the returned definition data so the deck can keep
  // large milestone families easy to scan without changing the storage format.
  const achievementGroups = {
    Arrival: ['first_visit', 'settling_in', 'steady_signal', 'daily_orbit', 'home_frequency'],
    'Quick Access': ['quick_launch', 'shortcut_habit', 'launch_sequence', 'fast_track', 'launcher_legend'],
    Search: ['searcher', 'query_scout', 'research_rhythm', 'deep_signal', 'search_cartographer'],
    Settings: ['settings_visit', 'settings_return', 'settings_hand', 'system_steward'],
    Chat: ['chat_visit', 'channel_checkin', 'signal_social', 'open_frequency'],
    Exploration: ['explorer', 'wayfinder', 'mapmaker', 'star_chart', 'wide_horizon'],
    'Achievement Deck': ['achievement_visit', 'progress_check', 'collection_log', 'deckkeeper'],
    Cosmetics: ['first_fit', 'style_switcher', 'personal_touch', 'collection_curator']
  };
  definitions.forEach(definition => {
    definition.group = Object.keys(achievementGroups).find(group => achievementGroups[group].includes(definition.id)) || 'Nebulo';
  });

  const rewards = [
    { id: 'cursor-default', type: 'cursor', name: 'Nebulo Default', description: 'The standard Nebulo pointer.', always: true },
    { id: 'cursor-nebula', type: 'cursor', name: 'Nebula Glow', description: 'A cool-blue orbit cursor.' },
    { id: 'cursor-precision', type: 'cursor', name: 'Precision Crosshair', description: 'For detail work and clean clicks.' },
    { id: 'cursor-pixel', type: 'cursor', name: 'Pixel Vector', description: 'A crisp retro targeting cursor.' },
    { id: 'accent-default', type: 'accent', name: 'Shell Blue', description: 'Return to the standard shell accent.', always: true },
    { id: 'accent-aurora', type: 'accent', name: 'Aurora Accent', description: 'A subtle violet-blue shell highlight.' },
    { id: 'effect-none', type: 'effect', name: 'No Page Effect', description: 'Keep the surface completely quiet.', always: true },
    { id: 'effect-stars', type: 'effect', name: 'Quiet Stars', description: 'A restrained constellation shimmer.' }
  ];
  const legacyAchievementIds = {
    first_launch: 'first_visit',
    settings_explorer: 'settings_visit',
    chat_enthusiast: 'chat_visit'
  };
  const achievementIds = new Set(definitions.map(item => item.id));

  const blank = () => ({ version: VERSION, unlocked: [], progress: { visits: 0, quickLaunches: 0, searches: 0, settingsVisits: 0, chatVisits: 0, achievementVisits: 0, equips: 0, areas: {} }, ownedRewards: ['cursor-default', 'accent-default', 'effect-none'], equipped: { cursor: 'cursor-default', accent: 'accent-default', effect: 'effect-none' } });
  const unique = values => [...new Set(Array.isArray(values) ? values.filter(Boolean) : [])];

  function read() {
    const base = blank();
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return base;
      const saved = JSON.parse(raw);
      const oldProgress = saved && typeof saved.progress === 'object' ? saved.progress : {};
      const state = {
        ...base,
        version: VERSION,
        unlocked: unique((Array.isArray(saved.unlocked) ? saved.unlocked : [])
          .map(id => legacyAchievementIds[id] || id)
          .filter(id => achievementIds.has(id))),
        progress: {
          ...base.progress,
          visits: Number(oldProgress.visits || (saved.unlocked || []).includes('first_launch') || 0),
          quickLaunches: Number(oldProgress.quickLaunches || 0),
          searches: Number(oldProgress.searches || oldProgress.search_pro || 0),
          settingsVisits: Number(oldProgress.settingsVisits || ((saved.unlocked || []).includes('settings_explorer') ? 1 : 0)),
          chatVisits: Number(oldProgress.chatVisits || ((saved.unlocked || []).includes('chat_enthusiast') ? 1 : 0)),
          achievementVisits: Number(oldProgress.achievementVisits || 0),
          equips: Number(oldProgress.equips || 0),
          areas: oldProgress.areas && typeof oldProgress.areas === 'object' && !Array.isArray(oldProgress.areas) ? oldProgress.areas : {}
        },
        ownedRewards: unique([...(saved.ownedRewards || []), ...base.ownedRewards]),
        equipped: { ...base.equipped, ...(saved.equipped && typeof saved.equipped === 'object' ? saved.equipped : {}) }
      };
      return normalize(state);
    } catch (_) { return base; }
  }

  function normalize(state) {
    state.unlocked = unique(state.unlocked);
    state.ownedRewards = unique([...(state.ownedRewards || []), 'cursor-default', 'accent-default', 'effect-none']);
    definitions.forEach(item => {
      if (item.progress(state) >= item.goal && !state.unlocked.includes(item.id)) state.unlocked.push(item.id);
      if (state.unlocked.includes(item.id) && item.reward) state.ownedRewards.push(item.reward);
    });
    state.ownedRewards = unique(state.ownedRewards);
    ['cursor', 'accent', 'effect'].forEach(type => {
      const equipped = state.equipped[type];
      const valid = rewards.some(r => r.id === equipped && r.type === type && state.ownedRewards.includes(equipped));
      if (!valid) state.equipped[type] = `${type === 'cursor' ? 'cursor-default' : type === 'accent' ? 'accent-default' : 'effect-none'}`;
    });
    return state;
  }

  let state = read();
  function save() {
    state = normalize(state);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    apply();
    window.dispatchEvent(new CustomEvent('nebulo-achievements-update', { detail: snapshot() }));
  }
  function snapshot() { return JSON.parse(JSON.stringify(state)); }
  function dataCursor(svg, hotspot) { return `url("data:image/svg+xml,${encodeURIComponent(svg)}") ${hotspot}, auto`; }
  const cursorCss = {
    'cursor-default': '',
    'cursor-nebula': dataCursor('<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><circle cx="12" cy="12" r="7" fill="#102748" stroke="#91d7ff" stroke-width="2"/><circle cx="12" cy="12" r="2.2" fill="#fff"/><path d="M2 12h4M18 12h4M12 2v4M12 18v4" stroke="#91d7ff" stroke-width="1.4"/></svg>', '12 12'),
    'cursor-precision': dataCursor('<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"><path d="M14 1v7M14 20v7M1 14h7M20 14h7" stroke="#e6f5ff" stroke-width="2"/><circle cx="14" cy="14" r="5" fill="none" stroke="#62c8ff" stroke-width="2"/><circle cx="14" cy="14" r="1.5" fill="#fff"/></svg>', '14 14'),
    'cursor-pixel': dataCursor('<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" shape-rendering="crispEdges"><path fill="#0a1325" d="M2 2h4v4h4v4h4v4h4v4h-8v-4H6v-4H2z"/><path fill="#aeeaff" d="M3 3h2v4h4v4h4v4h4v2h-8v-4H5V9H3z"/></svg>', '4 4')
  };
  function apply() {
    const root = document.documentElement;
    const body = document.body;
    if (!body) return;
    root.dataset.nebuloCursor = state.equipped.cursor;
    root.dataset.nebuloAccent = state.equipped.accent;
    root.dataset.nebuloEffect = state.equipped.effect;
    const styleId = 'nebulo-achievement-cosmetics';
    let style = document.getElementById(styleId);
    if (!style) { style = document.createElement('style'); style.id = styleId; document.head.appendChild(style); }
    const cursor = cursorCss[state.equipped.cursor] || '';
    const cursorRule = cursor
      ? `html[data-nebulo-cursor] body, html[data-nebulo-cursor] body * { cursor: ${cursor} !important; } html[data-nebulo-cursor] input, html[data-nebulo-cursor] textarea { cursor: text !important; }`
      : '';
    style.textContent = `${cursorRule} html[data-nebulo-accent="accent-aurora"] { --nebulo-reward-accent: #a9a5ff; --accent: #817cf3; --accent-light: #c2c0ff; } html[data-nebulo-effect="effect-stars"] body::after { content: ''; pointer-events: none; position: fixed; inset: 0; z-index: 2147483000; opacity: .3; background-image: radial-gradient(circle at 18% 23%, #dceeff 0 1px, transparent 1.5px), radial-gradient(circle at 74% 18%, #9bb9ff 0 1px, transparent 1.5px), radial-gradient(circle at 84% 72%, #e5dcff 0 1px, transparent 1.5px), radial-gradient(circle at 31% 82%, #9dd7ff 0 1px, transparent 1.5px); background-size: 180px 180px, 230px 230px, 270px 270px, 320px 320px; animation: nebuloRewardStars 9s linear infinite; } @keyframes nebuloRewardStars { to { background-position: 180px -180px, -230px 230px, 270px -270px, -320px 320px; } }`;
  }
  function track(event, payload = {}) {
    state = read();
    const area = String(payload.area || payload.page || payload.id || '').trim().slice(0, 80);
    switch (event) {
      case 'visit': state.progress.visits += 1; if (area) state.progress.areas[area] = true; break;
      case 'quick_access': state.progress.quickLaunches += 1; if (area) state.progress.areas[`quick:${area}`] = true; break;
      case 'search': state.progress.searches += 1; break;
      case 'settings': state.progress.settingsVisits += 1; state.progress.areas.settings = true; break;
      case 'chat': state.progress.chatVisits += 1; state.progress.areas.chat = true; break;
      case 'achievements': state.progress.achievementVisits += 1; state.progress.areas.achievements = true; break;
      case 'tab': if (area) state.progress.areas[area] = true; break;
      default: return snapshot();
    }
    save();
    return snapshot();
  }
  function equip(id) {
    state = read();
    const reward = rewards.find(item => item.id === id);
    if (!reward || !state.ownedRewards.includes(id)) return false;
    if (state.equipped[reward.type] === id) return true;
    state.equipped[reward.type] = id;
    state.progress.equips = Number(state.progress.equips || 0) + 1;
    save();
    return true;
  }
  window.NebuloAchievements = { track, equip, getState: () => snapshot(), getDefinitions: () => definitions.map(item => ({ ...item })), getRewards: () => rewards.map(item => ({ ...item })), apply };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', apply, { once: true }); else apply();
})();
