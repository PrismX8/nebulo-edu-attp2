// === FETCH FIRST ===
fetch('/assets/data/classtools.json')
  .then(response => {
    if (!response.ok) throw new Error(`Failed to load: ${response.status}`);
    return response.json();
  })
  .then(apps => {
    // Create the pinned entry
    const requestApp = {
      url: "https://forms.gle/mBVmhjfWjppPiWYK8",
      image: "/assets/img/embed.png",
      name: "Request App"
    };

    // Sort all other apps alphabetically
    apps.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));

    // Put the Request App entry at the top
    apps.unshift(requestApp);

    const appsContainer = document.querySelector('.apps');
    const searchInput = document.getElementById('input');

    // Setup search input
    searchInput.type = 'text';
    searchInput.placeholder = 'Search apps...';
    // Only move the search input if it's not already in the right container.
    if (searchInput.parentNode !== appsContainer.parentNode) {
      appsContainer.parentNode.insertBefore(searchInput, appsContainer);
    }

    // One click handler for all cards (fewer listeners = smoother scrolling)
    appsContainer.addEventListener('click', (e) => {
      const card = e.target.closest('.card');
      if (!card) return;
      const url = card.dataset.url;
      if (url) run(url);
    });

    // Display function
    function displayApps(appsToDisplay) {
      const frag = document.createDocumentFragment();
      appsToDisplay.forEach(app => {
        const appElement = document.createElement('div');
        appElement.className = 'card';
        appElement.dataset.url = app.url;
        appElement.innerHTML = `
          <img src="${app.image}" alt="${app.name}" loading="lazy" decoding="async">
          <h3>${app.name}</h3>
        `;
        frag.appendChild(appElement);
      });
      appsContainer.replaceChildren(frag);
    }

    // Initial display
    displayApps(apps);

    // Search functionality (keeps Request App at top)
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.toLowerCase();
      const filteredApps = apps.filter(app =>
        app.name.toLowerCase().includes(query) || app.name === "Request App"
      );

      // Ensure Request App always first in search results
      const requestAppFiltered = filteredApps.find(g => g.name === "Request App");
      const others = filteredApps.filter(g => g.name !== "Request App");
      if (requestAppFiltered) filteredApps.splice(0, filteredApps.length, requestAppFiltered, ...others);

      displayApps(filteredApps);
    });
  })
  .catch(error => console.error('Error loading apps:', error));

// === RUN FUNCTION ===
let scramjetControllerPromise = null;
let argonServiceWorkerPromise = null;

function normalizeProxyChoice(value) {
  return value === "argon" || value === "sj" ? "ag" : value;
}

function encodeArgonRoute(inputUrl) {
  const raw = (typeof inputUrl === "string" ? inputUrl : String(inputUrl || "")).trim();
  if (!raw) return raw;

  try {
    const u = new URL(raw);
    if (u.protocol !== "http:" && u.protocol !== "https:") return raw;
    return "/ag/" + u.protocol.replace(":", "") + "/" + u.host + (u.pathname || "/") + (u.search || "") + (u.hash || "");
  } catch {
    return raw;
  }
}

async function ensureArgonServiceWorker() {
  if (argonServiceWorkerPromise) return argonServiceWorkerPromise;
  argonServiceWorkerPromise = (async () => {
    if (!("serviceWorker" in navigator)) return false;
    const scriptUrl =
      "/argon_service_worker.js?proxy_real_protocol=" +
      encodeURIComponent(location.protocol.replace(":", "")) +
      "&proxy_real_host=" +
      encodeURIComponent(location.host);

    try {
      const registration = await navigator.serviceWorker.register(scriptUrl, {
        scope: "/ag/",
        updateViaCache: "none",
      });
      if (!registration.active && (registration.installing || registration.waiting)) {
        const worker = registration.installing || registration.waiting;
        await new Promise((resolve) => {
          const done = () => resolve();
          const timer = setTimeout(done, 4000);
          worker.addEventListener("statechange", () => {
            if (worker.state === "activated" || worker.state === "redundant") {
              clearTimeout(timer);
              done();
            }
          });
        });
      }
      return true;
    } catch {
      return false;
    } finally {
      setTimeout(() => {
        argonServiceWorkerPromise = null;
      }, 0);
    }
  })();
  return argonServiceWorkerPromise;
}

async function ensureScramjetController() {
  if (scramjetControllerPromise) return scramjetControllerPromise;
  scramjetControllerPromise = (async () => {
    if (typeof $scramjetLoadController !== "function") return null;
    const { ScramjetController } = $scramjetLoadController();
    const controller = new ScramjetController({
      files: {
        wasm: "/scram/scramjet.wasm.wasm",
        all: "/scram/scramjet.all.js",
        sync: "/scram/scramjet.sync.js",
      },
    });
    await controller.init();
    return controller;
  })().catch(() => null);
  return scramjetControllerPromise;
}

function encodeViaUv(url) {
  if (typeof __uv$config !== "undefined" && __uv$config?.encodeUrl) {
    return __uv$config.prefix + __uv$config.encodeUrl(url);
  }
  return url;
}

function encodeViaEc(url) {
  if (typeof __eclipse$config !== "undefined" && __eclipse$config?.codec?.encode) {
    return __eclipse$config.prefix + __eclipse$config.codec.encode(url);
  }
  return null;
}

function shouldForceScramjetForUrl(inputUrl) {
  const rules = window.NebuloProxyHostRules;
  if (rules && typeof rules.shouldForceScramjetForUrl === "function") {
    return rules.shouldForceScramjetForUrl(inputUrl);
  }

  const raw = (typeof inputUrl === "string" ? inputUrl : String(inputUrl || "")).trim();
  if (!raw) return false;

  let parsed = null;
  try {
    parsed = new URL(raw);
  } catch {
    if (raw.includes(".") && !raw.includes(" ") && !raw.startsWith("/")) {
      try {
        parsed = new URL("https://" + raw);
      } catch {
        parsed = null;
      }
    }
  }
  if (!parsed) return false;

  const host = (parsed.hostname || "").toLowerCase();
  return (
    host === "crazygames.com" ||
    host.endsWith(".crazygames.com") ||
    host === "play.geforcenow.com" ||
    host.endsWith(".geforcenow.com") ||
    host === "tlk.io" ||
    host.endsWith(".tlk.io")
  );
}

function shouldAvoidScramjetForUrl(inputUrl) {
  const rules = window.NebuloProxyHostRules;
  if (rules && typeof rules.shouldAvoidScramjetForUrl === "function") {
    return rules.shouldAvoidScramjetForUrl(inputUrl);
  }

  const raw = (typeof inputUrl === "string" ? inputUrl : String(inputUrl || "")).trim();
  if (!raw) return false;

  let parsed = null;
  try {
    parsed = new URL(raw);
  } catch {
    if (raw.includes(".") && !raw.includes(" ") && !raw.startsWith("/")) {
      try {
        parsed = new URL("https://" + raw);
      } catch {
        parsed = null;
      }
    }
  }
  if (!parsed) return false;

  const host = (parsed.hostname || "").toLowerCase();
  return host === "polybuzz.ai" || host.endsWith(".polybuzz.ai");
}

function normalizeExistingProxyTarget(inputUrl) {
  const raw = (typeof inputUrl === "string" ? inputUrl : String(inputUrl || "")).trim();
  if (!raw) return raw;

  const uvPrefix = (typeof __uv$config !== "undefined" && __uv$config?.prefix) ? __uv$config.prefix : "/uv/service/";
  const eclipsePrefix = (typeof __eclipse$config !== "undefined" && __eclipse$config?.prefix) ? __eclipse$config.prefix : "/eclipse/";
  const normalizeLegacyUvPayload = (payload) => {
    let out = String(payload || "");
    for (let i = 0; i < 3; i++) {
      if (!/%[0-9a-f]{2}/i.test(out)) break;
      try {
        const decoded = decodeURIComponent(out);
        if (decoded === out) break;
        out = decoded;
      } catch {
        break;
      }
    }
    return out
      .replace(/%2f/ig, "/")
      .replace(/%3a/ig, ":")
      .replace(/%2c/ig, ",");
  };
  const isAlreadyProxiedPath = (p) =>
    p.startsWith(uvPrefix) ||
    p.startsWith(eclipsePrefix) ||
    p.startsWith("/ag/") ||
    p.startsWith("/scram/service/") ||
    p.startsWith("/service/scramjet/") ||
    p.startsWith("/scramjet/");

  if (raw.startsWith("/") && isAlreadyProxiedPath(raw)) {
    if (raw.startsWith(uvPrefix)) {
      const payload = raw.slice(uvPrefix.length);
      if (/^hvt(?:rs|tr)/i.test(payload)) {
        return uvPrefix + normalizeLegacyUvPayload(payload);
      }
    }
    return raw;
  }

  if (!raw.startsWith("/") && raw.startsWith("hvtrs")) {
    const payload = normalizeLegacyUvPayload(raw);
    return uvPrefix + payload;
  }

  try {
    const u = new URL(raw, location.origin);
    if (u.origin === location.origin && isAlreadyProxiedPath(u.pathname)) {
      if (u.pathname.startsWith(uvPrefix)) {
        const payload = u.pathname.slice(uvPrefix.length);
        if (/^hvt(?:rs|tr)/i.test(payload)) {
          return uvPrefix + normalizeLegacyUvPayload(payload) + u.search + u.hash;
        }
      }
      return u.pathname + u.search + u.hash;
    }
  } catch {}

  return raw;
}

function encodeScramjetRoute(inputUrl) {
  const raw = (typeof inputUrl === "string" ? inputUrl : String(inputUrl || "")).trim();
  if (!raw) return raw;

  try {
    const u = new URL(raw);
    if (u.protocol !== "http:" && u.protocol !== "https:") return raw;
    const hash = u.hash ? u.hash.slice(1) : "";
    u.hash = "";
    return "/scramjet/" + encodeURIComponent(u.href) + (hash ? "#" + encodeURIComponent(hash) : "");
  } catch {
    return "/scramjet/" + encodeURIComponent(raw);
  }
}

async function encodeWithSelectedProxy(absoluteUrl, overrideProxy) {
  const raw = normalizeExistingProxyTarget(absoluteUrl);
  if (!raw) return raw;

  // Don't proxy local routes/assets and don't double-encode already-proxied URLs.
  const uvPrefix = (typeof __uv$config !== "undefined" && __uv$config?.prefix) ? __uv$config.prefix : "/uv/service/";
  const eclipsePrefix = (typeof __eclipse$config !== "undefined" && __eclipse$config?.prefix) ? __eclipse$config.prefix : "/eclipse/";
  const isAlreadyProxied =
    raw.startsWith(uvPrefix) ||
    raw.startsWith(eclipsePrefix) ||
    raw.startsWith("/ag/") ||
    raw.startsWith("/scram/service/") ||
    raw.startsWith("/service/scramjet/") ||
    raw.startsWith("/scramjet/");
  if (raw.startsWith("/") && !isAlreadyProxied) return raw;
  if (isAlreadyProxied) return raw;

  const savedProxy = normalizeProxyChoice(localStorage.getItem("proxy"));
  const forced = (!overrideProxy && (!savedProxy || savedProxy === "sj") && shouldForceScramjetForUrl(raw)) ? "sj" : null;
  const isForcedSj = forced === "sj";
  let proxy = normalizeProxyChoice(overrideProxy) || savedProxy || "uv";
  if (forced) proxy = forced;
  if (proxy === "sj" && shouldAvoidScramjetForUrl(raw)) proxy = "uv";

  if (proxy === "ag") {
    await ensureArgonServiceWorker();
    return encodeArgonRoute(raw);
  }

  if (proxy === "sj") {
    const scram = await ensureScramjetController();
    if (scram && typeof scram.encodeUrl === "function") return scram.encodeUrl(raw);
    // If scramjet is forced for this domain, do NOT fall back to UV.
    if (isForcedSj) return encodeScramjetRoute(raw);
    return encodeViaUv(raw);
  }

  if (proxy === "ec") {
    const encoded = encodeViaEc(raw);
    if (encoded) return encoded;
    return encodeViaUv(raw);
  }

  // default uv
  return encodeViaUv(raw);
}

async function run(url) {
  const raw = (typeof url === "string" ? url : String(url || "")).trim();
  if (!raw) return;

  const encodedUrl = await encodeWithSelectedProxy(raw);
  localStorage.setItem("url", encodedUrl);
  sessionStorage.setItem("Url", encodedUrl);
  window.location.href = encodedUrl;
}
