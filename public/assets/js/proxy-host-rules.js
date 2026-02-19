(function () {
  "use strict";

  const FORCE_SCRAMJET_HOSTS = [
    "crazygames.com",
    ".crazygames.com",
    "play.geforcenow.com",
    ".geforcenow.com",
    "tlk.io",
    ".tlk.io",
    "poki.com",
    ".poki.com",
    "poki-gdn.com",
    ".poki-gdn.com",
    "sentinel.home.kg",
  ];

  const AVOID_SCRAMJET_HOSTS = [
    "polybuzz.ai",
    ".polybuzz.ai",
  ];

  function hostMatches(host, rule) {
    if (!host || !rule) return false;
    const h = String(host).toLowerCase();
    const r = String(rule).toLowerCase();
    if (r.startsWith(".")) return h.endsWith(r);
    return h === r;
  }

  function extractHostname(inputUrl) {
    const raw = (typeof inputUrl === "string" ? inputUrl : String(inputUrl || "")).trim();
    if (!raw) return "";
    try {
      return new URL(raw).hostname.toLowerCase();
    } catch {
      if (raw.includes(".") && !raw.includes(" ") && !raw.startsWith("/")) {
        try {
          return new URL("https://" + raw).hostname.toLowerCase();
        } catch {
          return "";
        }
      }
      return "";
    }
  }

  function shouldForceScramjetForUrl(inputUrl) {
    const host = extractHostname(inputUrl);
    if (!host) return false;
    return FORCE_SCRAMJET_HOSTS.some((rule) => hostMatches(host, rule));
  }

  function shouldAvoidScramjetForUrl(inputUrl) {
    const host = extractHostname(inputUrl);
    if (!host) return false;
    return AVOID_SCRAMJET_HOSTS.some((rule) => hostMatches(host, rule));
  }

  window.NebuloProxyHostRules = {
    FORCE_SCRAMJET_HOSTS,
    AVOID_SCRAMJET_HOSTS,
    extractHostname,
    shouldForceScramjetForUrl,
    shouldAvoidScramjetForUrl,
  };

  // Backward-compatible globals for pages/scripts that call these directly.
  if (typeof window.shouldForceScramjetForUrl !== "function") {
    window.shouldForceScramjetForUrl = shouldForceScramjetForUrl;
  }
  if (typeof window.shouldAvoidScramjetForUrl !== "function") {
    window.shouldAvoidScramjetForUrl = shouldAvoidScramjetForUrl;
  }
})();
