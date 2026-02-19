(function () {
  "use strict";

  const THEME_KEY = "theme";
  const BG_KEYS = ["backgroundImage", "custombg"];

  const THEMES = {
    default: {
      "--accent": "#4a6cf7",
      "--accent-light": "#6b8aff",
      "--accent-glow": "#7d9dff",
      "--muted": "#8a94b3",
      "--text": "#e6e9f0",
      "--bg-dark": "#0a0f1a",
      "--bg-medium": "#141a2a",
      "--bg-light": "#1e2535",
      "--surface": "rgba(25, 30, 45, 0.85)",
      "--border": "#2a3248",
      "--bg-primary": "#0f1117",
      "--bg-secondary": "#151821",
      "--bg-surface": "rgba(30, 35, 48, 0.85)",
      "--bg-surface-light": "rgba(40, 45, 58, 0.7)",
      "--border-color": "rgba(100, 120, 160, 0.2)",
      "--text-primary": "#ffffff",
      "--text-secondary": "#b0b7c7",
      "--accent-blue": "#3498db",
      "--accent-blue-light": "#5dade2",
      "--accent-blue-dark": "#1c6ea4",
      "--bg-gradient-1": "#05060b",
      "--bg-gradient-2": "#0a0b18",
      "--bg-gradient-3": "#0f1124",
      "--panel-bg": "rgba(16, 18, 34, 0.75)",
      "--panel-border": "rgba(125, 211, 192, 0.15)",
      "--accent-primary": "#7dd3c0",
      "--accent-secondary": "#60a5fa",
      "--card-bg": "rgba(20, 22, 40, 0.6)",
      "--card-hover": "rgba(125, 211, 192, 0.1)",
    },
    ocean: {
      "--accent": "#22d3ee",
      "--accent-light": "#38bdf8",
      "--accent-glow": "#7dd3fc",
      "--muted": "#90adc6",
      "--text": "#eff9ff",
      "--bg-dark": "#061326",
      "--bg-medium": "#0a1d39",
      "--bg-light": "#102a4d",
      "--surface": "rgba(9, 24, 46, 0.86)",
      "--border": "#284665",
      "--bg-primary": "#04132b",
      "--bg-secondary": "#082040",
      "--bg-surface": "rgba(13, 31, 56, 0.86)",
      "--bg-surface-light": "rgba(22, 47, 78, 0.7)",
      "--border-color": "rgba(83, 149, 195, 0.3)",
      "--text-primary": "#f0f9ff",
      "--text-secondary": "#9ac3dd",
      "--accent-blue": "#22d3ee",
      "--accent-blue-light": "#67e8f9",
      "--accent-blue-dark": "#0e7490",
      "--bg-gradient-1": "#031526",
      "--bg-gradient-2": "#07213b",
      "--bg-gradient-3": "#0b2b4a",
      "--panel-bg": "rgba(6, 19, 40, 0.78)",
      "--panel-border": "rgba(34, 211, 238, 0.18)",
      "--accent-primary": "#67e8f9",
      "--accent-secondary": "#38bdf8",
      "--card-bg": "rgba(10, 28, 52, 0.6)",
      "--card-hover": "rgba(34, 211, 238, 0.14)",
    },
    teal: {
      "--accent": "#34d399",
      "--accent-light": "#5eead4",
      "--accent-glow": "#99f6e4",
      "--muted": "#8fb6b0",
      "--text": "#e8fff9",
      "--bg-dark": "#041a1a",
      "--bg-medium": "#072827",
      "--bg-light": "#0d3735",
      "--surface": "rgba(8, 36, 34, 0.85)",
      "--border": "#2a5a59",
      "--bg-primary": "#02101f",
      "--bg-secondary": "#052032",
      "--bg-surface": "rgba(7, 34, 35, 0.85)",
      "--bg-surface-light": "rgba(14, 44, 49, 0.72)",
      "--border-color": "rgba(52, 211, 153, 0.28)",
      "--text-primary": "#ecfdf5",
      "--text-secondary": "#95d5c0",
      "--accent-blue": "#34d399",
      "--accent-blue-light": "#5eead4",
      "--accent-blue-dark": "#0f766e",
      "--bg-gradient-1": "#041816",
      "--bg-gradient-2": "#072620",
      "--bg-gradient-3": "#0a342d",
      "--panel-bg": "rgba(8, 33, 30, 0.78)",
      "--panel-border": "rgba(52, 211, 153, 0.2)",
      "--accent-primary": "#6ee7b7",
      "--accent-secondary": "#2dd4bf",
      "--card-bg": "rgba(12, 38, 33, 0.6)",
      "--card-hover": "rgba(52, 211, 153, 0.12)",
    },
    slate: {
      "--accent": "#60a5fa",
      "--accent-light": "#93c5fd",
      "--accent-glow": "#cbd5f5",
      "--muted": "#95a2bb",
      "--text": "#e2e8f0",
      "--bg-dark": "#0a1120",
      "--bg-medium": "#111c31",
      "--bg-light": "#172842",
      "--surface": "rgba(18, 27, 46, 0.86)",
      "--border": "#31445f",
      "--bg-primary": "#020617",
      "--bg-secondary": "#081327",
      "--bg-surface": "rgba(16, 25, 42, 0.85)",
      "--bg-surface-light": "rgba(24, 36, 60, 0.72)",
      "--border-color": "rgba(148, 163, 184, 0.28)",
      "--text-primary": "#e2e8f0",
      "--text-secondary": "#a5b4cf",
      "--accent-blue": "#60a5fa",
      "--accent-blue-light": "#93c5fd",
      "--accent-blue-dark": "#1e3a8a",
      "--bg-gradient-1": "#040812",
      "--bg-gradient-2": "#0a1324",
      "--bg-gradient-3": "#121f34",
      "--panel-bg": "rgba(13, 20, 36, 0.78)",
      "--panel-border": "rgba(148, 163, 184, 0.16)",
      "--accent-primary": "#93c5fd",
      "--accent-secondary": "#60a5fa",
      "--card-bg": "rgba(18, 28, 46, 0.6)",
      "--card-hover": "rgba(96, 165, 250, 0.12)",
    },
    ember: {
      "--accent": "#fb923c",
      "--accent-light": "#fdba74",
      "--accent-glow": "#fed7aa",
      "--muted": "#c8a996",
      "--text": "#fff1ea",
      "--bg-dark": "#1a0d0f",
      "--bg-medium": "#2b1217",
      "--bg-light": "#3b1a1e",
      "--surface": "rgba(45, 19, 22, 0.86)",
      "--border": "#6f3c35",
      "--bg-primary": "#140c15",
      "--bg-secondary": "#2a0c11",
      "--bg-surface": "rgba(41, 16, 21, 0.86)",
      "--bg-surface-light": "rgba(57, 24, 26, 0.72)",
      "--border-color": "rgba(251, 146, 60, 0.28)",
      "--text-primary": "#ffe5d9",
      "--text-secondary": "#d8b9aa",
      "--accent-blue": "#fb923c",
      "--accent-blue-light": "#fdba74",
      "--accent-blue-dark": "#9a3412",
      "--bg-gradient-1": "#1b0f12",
      "--bg-gradient-2": "#2b1116",
      "--bg-gradient-3": "#3a171d",
      "--panel-bg": "rgba(41, 16, 21, 0.78)",
      "--panel-border": "rgba(251, 146, 60, 0.18)",
      "--accent-primary": "#fdba74",
      "--accent-secondary": "#fb923c",
      "--card-bg": "rgba(52, 20, 23, 0.6)",
      "--card-hover": "rgba(251, 146, 60, 0.14)",
    },
  };

  function getTheme() {
    const raw = (localStorage.getItem(THEME_KEY) || "default").trim().toLowerCase();
    return THEMES[raw] ? raw : "default";
  }

  function getCustomBg() {
    for (const key of BG_KEYS) {
      const value = (localStorage.getItem(key) || "").trim();
      if (value) return value;
    }
    return "";
  }

  function applyTheme(themeName) {
    const theme = THEMES[themeName] || THEMES.default;
    const root = document.documentElement;
    Object.entries(theme).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
    root.dataset.theme = themeName;
    root.classList.remove("theme-default", "theme-ocean", "theme-teal", "theme-slate", "theme-ember");
    root.classList.add(`theme-${themeName}`);
  }

  function applyBackground(imageUrl) {
    const body = document.body;
    if (!body) return;
    if (imageUrl) {
      body.style.backgroundImage = `linear-gradient(rgba(6, 10, 18, 0.74), rgba(6, 10, 18, 0.74)), url("${imageUrl}")`;
      // Keep the entire custom image visible without cropping.
      body.style.backgroundSize = "cover, contain";
      body.style.backgroundRepeat = "no-repeat, no-repeat";
      body.style.backgroundPosition = "center center, center center";
      body.style.backgroundAttachment = "fixed, fixed";
    } else {
      body.style.backgroundImage = "";
      body.style.backgroundSize = "";
      body.style.backgroundRepeat = "";
      body.style.backgroundPosition = "";
      body.style.backgroundAttachment = "";
    }
  }

  function applyAll() {
    applyTheme(getTheme());
    applyBackground(getCustomBg());
  }

  let lastTheme = "";
  let lastBg = "";

  function syncAppearance() {
    const nextTheme = getTheme();
    const nextBg = getCustomBg();
    if (nextTheme !== lastTheme) {
      lastTheme = nextTheme;
      applyTheme(nextTheme);
    }
    if (nextBg !== lastBg) {
      lastBg = nextBg;
      applyBackground(nextBg);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyAll, { once: true });
  } else {
    applyAll();
  }

  window.addEventListener("storage", (event) => {
    if (!event.key || event.key === THEME_KEY || BG_KEYS.includes(event.key)) {
      syncAppearance();
    }
  });

  window.addEventListener("message", (event) => {
    const data = event?.data;
    if (data?.type !== "setting-changed") return;
    if (data.key === THEME_KEY || BG_KEYS.includes(data.key)) {
      syncAppearance();
    }
  });

  setInterval(syncAppearance, 500);
})();
