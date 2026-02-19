(function () {
  "use strict";

  const DEFAULT_TITLE = "Home";
  const DEFAULT_ICON = "/assets/img/nebulologo.png";
  const CLICKOFF_TITLE = "Google Docs";
  const CLICKOFF_ICON = "/assets/img/docs.webp";
  const CLOAK_REDIRECT = "https://docs.google.com/";

  function getBool(key, defaultValue) {
    const raw = localStorage.getItem(key);
    if (raw === null) return defaultValue;
    return raw === "true";
  }

  function getValue(key, fallback = "") {
    const raw = localStorage.getItem(key);
    return raw == null || raw === "" ? fallback : raw;
  }

  function setFavicon(href) {
    const iconHref = href || DEFAULT_ICON;
    let link = document.querySelector("link[rel='icon']#favicon");
    if (!link) {
      link = document.createElement("link");
      link.id = "favicon";
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = iconHref;
  }

  function applyCustomIdentity() {
    const title = getValue("CustomName", DEFAULT_TITLE);
    const icon = getValue("CustomIcon", DEFAULT_ICON);
    document.title = title;
    setFavicon(icon);
  }

  function applyClickoffIdentity() {
    document.title = CLICKOFF_TITLE;
    setFavicon(CLICKOFF_ICON);
  }

  function refreshCloakState() {
    if (getBool("clickoff", true) && document.visibilityState === "hidden") {
      applyClickoffIdentity();
      return;
    }
    applyCustomIdentity();
  }

  function tryAboutBlankCloak() {
    if (!getBool("ab", false)) return;
    if (window.top !== window) return;

    let pop = null;
    try {
      pop = window.open("about:blank", "_blank");
    } catch {
      return false;
    }
    if (!pop || pop.closed) return false;

    const title = getValue("CustomName", DEFAULT_TITLE);
    const icon = getValue("CustomIcon", DEFAULT_ICON);
    const iframeSrc = location.href;

    try {
      const doc = pop.document;
      doc.open();
      doc.write(`<!doctype html><html><head><meta charset="utf-8"><title>${title.replace(/</g, "&lt;")}</title><link rel="icon" href="${icon}"><style>html,body,iframe{margin:0;width:100%;height:100%;border:0;overflow:hidden;background:#fff}</style></head><body><iframe src="${iframeSrc}"></iframe></body></html>`);
      doc.close();
      const target = getValue("pLink", CLOAK_REDIRECT);
      location.replace(target);
      return true;
    } catch {
      // If popup writing fails, keep current page intact.
      return false;
    }
  }

  function activateAboutBlankCloak() {
    return tryAboutBlankCloak();
  }

  function showAboutBlankBanner() {
    // Intentionally disabled: user requested no About:Blank warning popups/banners.
  }

  function handleSettingChange(key) {
    if (["CustomName", "CustomIcon", "clickoff", "ab"].includes(key)) {
      refreshCloakState();
    }
    if (key === "ab" && getBool("ab", false)) {
      // Don't hijack the user's next click. If popups are blocked, show a banner with a button.
      const ok = tryAboutBlankCloak();
      void ok;
    }
  }

  function initCloaking() {
    if (localStorage.getItem("CustomName") === null) localStorage.setItem("CustomName", DEFAULT_TITLE);
    if (localStorage.getItem("CustomIcon") === null) localStorage.setItem("CustomIcon", DEFAULT_ICON);
    if (localStorage.getItem("clickoff") === null) localStorage.setItem("clickoff", "true");
    if (localStorage.getItem("ab") === null) localStorage.setItem("ab", "true");

    refreshCloakState();
    document.addEventListener("visibilitychange", refreshCloakState);
    if (getBool("ab", false)) {
      // Auto-attempt cloak on every fresh visit when enabled.
      setTimeout(() => {
        const ok = tryAboutBlankCloak();
        void ok;
      }, 0);
    }

    window.addEventListener("storage", (event) => {
      if (!event.key) return;
      handleSettingChange(event.key);
    });

    window.addEventListener("message", (event) => {
      const data = event?.data;
      if (data?.type === "setting-changed") {
        handleSettingChange(data.key);
      }
    });

    // Expose manual trigger for settings UI button.
    window.activateAboutBlankCloak = activateAboutBlankCloak;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCloaking, { once: true });
  } else {
    initCloaking();
  }
})();
