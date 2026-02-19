// === FETCH FIRST ===
fetch('/assets/data/activities.json')
  .then(response => {
    if (!response.ok) throw new Error(`Failed to load: ${response.status}`);
    return response.json();
  })
  .then(games => {
    // Create the pinned entry
    const requestGame = {
      url: "https://docs.google.com/forms/d/e/1FAIpQLSduzLmokWfYSNJ5TXz75BFk5689T21DHke9mNgvomM19VsNDQ/viewform?usp=header",
      image: "/assets/img/embed.png",
      name: "Request Game"
    };

    // Sort all other games alphabetically
    games.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));

    // Put the Request Game entry at the top
    games.unshift(requestGame);

    const appsContainer = document.querySelector('.games');
    const searchInput = document.getElementById('input');

    // Setup search input
    searchInput.type = 'text';
    searchInput.placeholder = 'Search games...';
    if (searchInput.parentNode !== appsContainer.parentNode) {
      appsContainer.parentNode.insertBefore(searchInput, appsContainer);
    }

    appsContainer.addEventListener('click', (e) => {
      const card = e.target.closest('.card');
      if (!card) return;
      const url = card.dataset.url;
      if (url) run(url);
    });

    // Display function
    function displayGames(gamesToDisplay) {
      const frag = document.createDocumentFragment();
      gamesToDisplay.forEach(game => {
        const gameElement = document.createElement('div');
        gameElement.className = 'card';
        gameElement.dataset.url = game.url;
        gameElement.innerHTML = `
          <img src="${game.image}" alt="${game.name}" loading="lazy" decoding="async">
          <h3>${game.name}</h3>
        `;
        frag.appendChild(gameElement);
      });
      appsContainer.replaceChildren(frag);
    }

    // Initial display
    displayGames(games);

    // Search functionality (keeps Request Game at top)
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.toLowerCase();
      const filteredGames = games.filter(game =>
        game.name.toLowerCase().includes(query) || game.name === "Request Game"
      );

      // Ensure Request Game always first in search results
      const requestGameFiltered = filteredGames.find(g => g.name === "Request Game");
      const others = filteredGames.filter(g => g.name !== "Request Game");
      if (requestGameFiltered) filteredGames.splice(0, filteredGames.length, requestGameFiltered, ...others);

      displayGames(filteredGames);
    });
  })
  .catch(error => console.error('Error loading games:', error));

// === RUN FUNCTION ===
let scramjetControllerPromise = null;
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
    host.endsWith(".geforcenow.com")
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
  const isAlreadyProxiedPath = (p) =>
    p.startsWith(uvPrefix) ||
    p.startsWith(eclipsePrefix) ||
    p.startsWith("/scram/service/") ||
    p.startsWith("/service/scramjet/") ||
    p.startsWith("/scramjet/");

  if (raw.startsWith("/") && isAlreadyProxiedPath(raw)) return raw;

  if (!raw.startsWith("/") && raw.startsWith("hvtrs")) {
    let payload = raw;
    if (payload.includes("%")) {
      try {
        payload = decodeURIComponent(payload);
      } catch {}
    }
    return uvPrefix + payload;
  }

  try {
    const u = new URL(raw, location.origin);
    if (u.origin === location.origin && isAlreadyProxiedPath(u.pathname)) {
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

  const uvPrefix = (typeof __uv$config !== "undefined" && __uv$config?.prefix) ? __uv$config.prefix : "/uv/service/";
  const eclipsePrefix = (typeof __eclipse$config !== "undefined" && __eclipse$config?.prefix) ? __eclipse$config.prefix : "/eclipse/";
  const isAlreadyProxied =
    raw.startsWith(uvPrefix) ||
    raw.startsWith(eclipsePrefix) ||
    raw.startsWith("/scram/service/") ||
    raw.startsWith("/service/scramjet/") ||
    raw.startsWith("/scramjet/");
  if (raw.startsWith("/") && !isAlreadyProxied) return raw;
  if (isAlreadyProxied) return raw;

  const savedProxy = localStorage.getItem("proxy");
  const forced = (!overrideProxy && (!savedProxy || savedProxy === "sj") && shouldForceScramjetForUrl(raw)) ? "sj" : null;
  const isForcedSj = forced === "sj";
  let proxy = overrideProxy || savedProxy || "uv";
  if (forced) proxy = forced;
  if (proxy === "sj" && shouldAvoidScramjetForUrl(raw)) proxy = "uv";

  if (proxy === "sj") {
    const scram = await ensureScramjetController();
    if (scram && typeof scram.encodeUrl === "function") return scram.encodeUrl(raw);
    if (isForcedSj) return encodeScramjetRoute(raw);
    return encodeViaUv(raw);
  }

  if (proxy === "ec") {
    const encoded = encodeViaEc(raw);
    if (encoded) return encoded;
    return encodeViaUv(raw);
  }

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
