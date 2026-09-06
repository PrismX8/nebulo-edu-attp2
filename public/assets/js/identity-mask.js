// Identity mask: rewrites the page title and console output so the proxy stack
// (Ultraviolet, Eclipse, Scramjet, BareMux, Epoxy, libcurl) is not exposed in
// the devtools console or window title. Loaded very early on every entry page.
(function () {
  "use strict";

  const STUDENT_TITLE = "Student Console";
  const PROXY_PATTERNS = [
    /scramjet/gi,
    /ultraviolet/gi,
    /\buv[._-]?bundle/gi,
    /\buv[._-]?config/gi,
    /\buv[._-]?handler/gi,
    /\buv[._-]?client/gi,
    /\buv[._-]?sw/gi,
    /\beclipse[._-]?codec/gi,
    /\beclipse[._-]?config/gi,
    /\beclipse[._-]?worker/gi,
    /\beclipse[._-]?rewrite/gi,
    /bare[_-]?mux/gi,
    /\bbaremux\b/gi,
    /\bbare-mux\b/gi,
    /\bepoxy\b/gi,
    /\blibcurl\b/gi,
    /MercuryWorkshop/gi,
    /\$scramjet/gi,
    /\$uv\$/g
  ];
  const REDACTED = "[student]";

  function maskString(value) {
    if (typeof value !== "string") return value;
    let out = value;
    for (const pattern of PROXY_PATTERNS) {
      out = out.replace(pattern, REDACTED);
    }
    // Console messages should not disclose browsing destinations or encoded
    // upstream paths. This covers application logs; browser-owned Network and
    // Sources panels remain outside page JavaScript's control.
    out = out
      .replace(/\/ag\/(?:https?|wss?)\/[^\s"'<>]+/gi, "[resource]")
      .replace(/(?:https?|wss?):\/\/[^\s"'<>]+/gi, "[resource]");
    return out;
  }

  function maskArg(arg) {
    if (typeof arg === "string") return maskString(arg);
    if (arg instanceof Error) return maskString(arg.message || String(arg));
    if (arg && typeof arg === "object") {
      try {
        const json = JSON.stringify(arg);
        const masked = maskString(json);
        return JSON.parse(masked);
      } catch {
        return arg;
      }
    }
    return arg;
  }

  // Scrub console output
  if (typeof console !== "undefined") {
    const methods = ["log", "warn", "error", "info", "debug"];
    for (const name of methods) {
      const original = console[name];
      if (typeof original !== "function") continue;
      console[name] = function () {
        const masked = Array.prototype.map.call(arguments, maskArg);
        return original.apply(console, masked);
      };
    }
  }

  // Set default page title. Pages that want a different title can override it
  // after this script runs.
  try {
    if (document && document.title === "" || /Nebulo|Education|Arcade|UV|Scramjet|Eclipse|BareMux/i.test(document.title)) {
      document.title = STUDENT_TITLE;
    }
  } catch {}

  // Keep re-applying the mask in case pages set the title back later.
  try {
    const observer = new MutationObserver(() => {
      try {
        if (typeof document !== "undefined" && /Nebulo|Education|Arcade|UV|Scramjet|Eclipse|BareMux/i.test(document.title)) {
          document.title = STUDENT_TITLE;
        }
      } catch {}
    });
    if (document.documentElement) {
      observer.observe(document.documentElement, { childList: true, subtree: true, characterData: true });
    }
  } catch {}
})();
