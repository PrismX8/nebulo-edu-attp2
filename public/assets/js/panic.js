(function () {
  "use strict";

  const DEFAULT_TARGET = "https://docs.google.com/";

  function parsePanicKeyConfig() {
    const raw = String(localStorage.getItem("panicKey") || "").trim();
    if (!raw) return null;

    const parts = raw.split("+").map((p) => p.trim()).filter(Boolean);
    if (!parts.length) return null;

    const config = { ctrl: false, shift: false, alt: false, meta: false, key: "" };
    for (const part of parts) {
      const lower = part.toLowerCase();
      if (lower === "ctrl" || lower === "control") config.ctrl = true;
      else if (lower === "shift") config.shift = true;
      else if (lower === "alt" || lower === "option") config.alt = true;
      else if (lower === "meta" || lower === "cmd" || lower === "command") config.meta = true;
      else if (!config.key) config.key = part;
    }

    if (!config.key && !(config.ctrl || config.shift || config.alt || config.meta)) return null;
    return config;
  }

  function matchesPanicKey(event, config) {
    if (!config) return false;
    if (!!event.ctrlKey !== !!config.ctrl) return false;
    if (!!event.shiftKey !== !!config.shift) return false;
    if (!!event.altKey !== !!config.alt) return false;
    if (!!event.metaKey !== !!config.meta) return false;

    if (!config.key) return true;
    const expected = config.key.toLowerCase();
    const currentKey = String(event.key || "").toLowerCase();
    const currentCode = String(event.code || "").toLowerCase();
    if (currentKey === expected) return true;
    if (expected.length === 1 && currentKey === expected) return true;
    return currentCode === `key${expected}` || currentCode === `digit${expected}`;
  }

  function getPanicTarget() {
    const raw = String(localStorage.getItem("panicLink") || "").trim();
    return raw || DEFAULT_TARGET;
  }

  function triggerPanicAction() {
    const target = getPanicTarget();
    try {
      if (window.top && window.top !== window) {
        window.top.location.replace(target);
        return;
      }
    } catch {}

    try {
      window.location.replace(target);
      return;
    } catch {}

    try {
      window.open(target, "_top");
    } catch {}
  }

  function onKeyDown(event) {
    const config = parsePanicKeyConfig();
    if (!config) return;
    if (!matchesPanicKey(event, config)) return;
    event.preventDefault();
    event.stopPropagation();
    if (typeof event.stopImmediatePropagation === "function") {
      event.stopImmediatePropagation();
    }
    triggerPanicAction();
  }

  window.addEventListener("keydown", onKeyDown, { capture: true });
})();

