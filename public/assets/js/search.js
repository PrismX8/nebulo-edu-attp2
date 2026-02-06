const PROXY_WARNING_ID = "proxy-warning-overlay";
const PROXY_WARNING_RETRY_MS = 15000;

function shouldWarnAboutProxyError(url) {
    if (!url) return false;
    const patterns = [
        "/uv/service/",
        "/uv/uv.bundle.js",
        "/uv/uv.config.js",
        "/uv/uv.handler.js",
        "/scram/",
        "cineby.gd",
        "math.school.dovereducation.org"
    ];
    return patterns.some(pattern => url.includes(pattern));
}

function showProxyWarning(message, { autoRetry = false, retryDelay = PROXY_WARNING_RETRY_MS } = {}) {
    if (document.getElementById(PROXY_WARNING_ID)) return;

    const mountBanner = () => {
        if (!document.body) {
            document.addEventListener("DOMContentLoaded", mountBanner, { once: true });
            return;
        }

        if (document.getElementById(PROXY_WARNING_ID)) return;

        const banner = document.createElement("div");
        banner.id = PROXY_WARNING_ID;
        Object.assign(banner.style, {
            position: "fixed",
            left: "1rem",
            right: "1rem",
            bottom: "1rem",
            padding: "1rem 1.25rem",
            borderRadius: "0.75rem",
            background: "linear-gradient(135deg, rgba(8, 6, 31, 0.95), rgba(229, 57, 53, 0.95))",
            color: "#fff",
            fontFamily: "Inter, system-ui, sans-serif",
            boxShadow: "0 15px 40px rgba(0, 0, 0, 0.45)",
            display: "flex",
            flexDirection: "column",
            gap: "0.6rem",
            zIndex: "99999",
        });

        const text = document.createElement("div");
        text.style.fontSize = "0.95rem";
        text.style.lineHeight = "1.4";
        text.textContent = message;
        banner.appendChild(text);

        const actions = document.createElement("div");
        actions.style.display = "flex";
        actions.style.gap = "0.65rem";
        actions.style.flexWrap = "wrap";
        actions.style.alignItems = "center";

        const retryBtn = document.createElement("button");
        retryBtn.type = "button";
        retryBtn.textContent = "Retry now";
        retryBtn.style.cssText = "border:none;border-radius:0.5rem;padding:0.45rem 0.9rem;font-weight:600;background:#fff;color:#b71c1c;cursor:pointer;";
        retryBtn.addEventListener("click", () => location.reload());
        actions.appendChild(retryBtn);

        const closeBtn = document.createElement("button");
        closeBtn.type = "button";
        closeBtn.textContent = "Dismiss";
        closeBtn.style.cssText = "border:none;border-radius:0.5rem;padding:0.45rem 0.9rem;background:rgba(255,255,255,0.15);color:#fff;cursor:pointer;";
        closeBtn.addEventListener("click", () => banner.remove());
        actions.appendChild(closeBtn);

        banner.appendChild(actions);
        document.body.appendChild(banner);
    };

    mountBanner();
}

window.addEventListener("error", (event) => {
    const target = event?.target;
    const url = target?.src || target?.href || event?.filename;
    if (shouldWarnAboutProxyError(url)) {
        showProxyWarning(
            "The proxy backend is being rate limited or returned an error. Please wait a few seconds and try again."
        );
    }
}, true);

window.addEventListener("unhandledrejection", (event) => {
    const reason = event?.reason?.message || event?.reason?.toString?.();
    if (reason && reason.includes("Failed to fetch dynamically imported module")) {
        showProxyWarning(
            "The proxy failed to fetch a module because the upstream server responded with an error. Please reload when the proxy recovers."
        );
    }
});

document.addEventListener("DOMContentLoaded", () => {
	const form = document.getElementById("form");
	const input = document.getElementById("indexInput");
	const input2 = document.getElementById("input2");
	const { ScramjetController } = $scramjetLoadController();
	const scramjet = new ScramjetController({
		files: {
			wasm: '/scram/scramjet.wasm.wasm',
			all: '/scram/scramjet.all.js',
			sync: '/scram/scramjet.sync.js',
		},
	});

	scramjet.init();

	let baremuxConnection = null;

	// === Helper: async-safe localStorage write ===
	function safeStore(key, value) {
		if ("requestIdleCallback" in window) {
			requestIdleCallback(() => localStorage.setItem(key, value));
		} else {
			setTimeout(() => localStorage.setItem(key, value), 10);
		}
	}

	// === BareMux init (only once per session) ===
	async function initBareMux() {
		try {
			if (baremuxConnection) return baremuxConnection;
			baremuxConnection = new BareMux.BareMuxConnection("/baremux/worker.js");
			const wispUrl =
				(location.protocol === "https:" ? "wss" : "ws") + "://" + location.host + "/wisp/";

			const transport = localStorage.getItem("transport") || "epoxy";
			localStorage.setItem("transport", transport);

			const expectedTransport =
				transport === "libcurl" ? "/libcurl/index.mjs" : "/epoxy/index.mjs";

			if ((await baremuxConnection.getTransport()) !== expectedTransport) {
				await baremuxConnection.setTransport(expectedTransport, [{ wisp: wispUrl }]);
				console.log(`Using ${transport} transport. Wisp URL: ${wispUrl}`);
			}
		} catch (err) {
			console.error("An error occurred while setting up BareMux:", err);
		}
	}

	// === Service Worker (register once if missing) ===
	async function initServiceWorker() {
		try {
			const reg = await navigator.serviceWorker.getRegistration();
			if (!reg) {
				navigator.serviceWorker.register("/sw.js");
				console.log("Registering service worker...");
			}
		} catch (err) {
			console.error("Service worker registration failed:", err);
		}
	}

	// === Load blocklist with caching ===
	async function getBlockedTerms() {
		if (blockedTermsCache) return blockedTermsCache;
		try {
			const res = await fetch("/assets/data/block.json");
			blockedTermsCache = await res.json();
		} catch {
			blockedTermsCache = [
				"porn",
				"sex",
				"xxx",
				"hentai",
				"pornhub.com",
				"xxx.com",
				"4chan.org",
				"xvideos"
			];
		}
		return blockedTermsCache;
	}

	// === Fingerprint + Chance/Ban System ===
	const CHANCES_KEY_PREFIX = "platinum_chances_";

	async function getFingerprint() {
		function hash(str){let h=2166136261;for(let i=0;i<str.length;i++){h^=str.charCodeAt(i);h+=(h<<1)+(h<<4)+(h<<7)+(h<<8)+(h<<24);}return(h>>>0).toString(16);}
		function canvasFP(){const c=document.createElement('canvas');const ctx=c.getContext('2d');ctx.font='16px Arial';ctx.fillText('fp-demo',2,2);ctx.fillRect(50,10,100,20);return c.toDataURL();}
		function webglFP(){const c=document.createElement('canvas');const gl=c.getContext('webgl')||c.getContext('experimental-webgl');if(!gl)return'';const dbg=gl.getExtension('WEBGL_debug_renderer_info');return[gl.getParameter(gl.VERSION),gl.getParameter(gl.VENDOR),gl.getParameter(gl.RENDERER),dbg?gl.getParameter(dbg.UNMASKED_VENDOR_WEBGL):'',dbg?gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL):''].join('|');}
		async function audioFP(){return new Promise(resolve=>{const AC=window.OfflineAudioContext||window.webkitOfflineAudioContext;if(!AC)return resolve('');const ctx=new AC(1,44100,44100);const osc=ctx.createOscillator();const anl=ctx.createAnalyser();osc.connect(anl);anl.connect(ctx.destination);osc.start(0);ctx.startRendering().then(buf=>resolve(buf.getChannelData(0).slice(0,1000).reduce((a,b)=>a+b,0).toString())).catch(()=>resolve(''));});}
		function browserInfo(){return[navigator.userAgent,screen.width,screen.height,screen.colorDepth,Intl.DateTimeFormat().resolvedOptions().timeZone].join('|');}
		const combined=[hash(canvasFP()),hash(webglFP()),hash(await audioFP()),hash(browserInfo())].join('|');
		return hash(combined);
	}

	function getRemainingChances(fingerprint) {
		const key = CHANCES_KEY_PREFIX + fingerprint;
		const val = localStorage.getItem(key);
		if (val === null) return 2; // default 2 chances
		return parseInt(val, 10);
	}

	function useChance(fingerprint) {
		const key = CHANCES_KEY_PREFIX + fingerprint;
		let remaining = getRemainingChances(fingerprint);
		remaining = Math.max(0, remaining - 1);
		localStorage.setItem(key, remaining);
		return remaining;
	}

	async function handleBlockedUrl(fingerprint) {
		const remaining = useChance(fingerprint);
		if (remaining > 0) {
			alert(`You violated the TOS! You have ${remaining} chance(s) left.`);
			location.reload();
			window.location.replace("/");
		} else {
			try {
				await fetch('/api/ban', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ fingerprint, uuid: fingerprint, ip: null })
				});
				window.location.href = "/blocked";
				return true; // banned
			} catch (err) {
				console.error('Failed to ban user:', err);
				alert('You triggered a blocked word.');
				return true;
			}
		}
	}

	// === Check URL ===
	function isUrl(val = "") {
		return /^http(s?):\/\//.test(val) || (val.includes(".") && val.substr(0, 1) !== " ");
	}

	// === Decoders (declared once globally) ===
	function uvDecodeUrl(url) {
		return __uv$config.decodeUrl(url);
	}
	function sjDecodeUrl(url) {
		return decodeURIComponent(url);
	}
	window.uvDecodeUrl = uvDecodeUrl;
	window.sjDecodeUrl = sjDecodeUrl;

	// === Encode functions (DO NOT TOUCH) ===
	function logHistory(url) {
		if (localStorage.getItem("proxy") === "uv") {
			const decodedUrl = __uv$config.decodeUrl(url);
			safeStore("history", decodedUrl);
			return decodedUrl;
		} else if (localStorage.getItem("proxy") === "sj") {
			const decodedUrl = decodeURIComponent(url);
			safeStore("history", decodedUrl);
			return decodedUrl;
		} else if (localStorage.getItem("proxy") === "ec") {
			const decodedUrl = __eclipse$config.codec.encode(url);
			safeStore("history", decodedUrl);
			return decodedUrl;
		}
		safeStore("history", url);
		return url;
	}

	async function rhEncode(url) {
		const encodedUrl = await RammerheadEncode(url);
		logHistory(url);
		safeStore("url", encodedUrl);
		window.location.href = "/" + encodedUrl;
	}

	async function uvEncode(url) {
		const encodedUrl = __uv$config.prefix + __uv$config.encodeUrl(url);
		logHistory(encodedUrl);
		safeStore("url", encodedUrl);
		sessionStorage.setItem("Url", encodedUrl);
		createTab(encodedUrl);
	}

	async function ecEncode(url) {
		const encodedUrl = __eclipse$config.prefix + __eclipse$config.codec.encode(url);
		logHistory(url);
		safeStore("url", encodedUrl);
		sessionStorage.setItem("Url", encodedUrl);
		createTab(encodedUrl);
	}

	async function sjEncode(url) {
		const encodedUrl = scramjet.encodeUrl(url);
		logHistory(url);
		safeStore("url", encodedUrl);
        createTab(encodedUrl);
	}

	async function encodeUrlWithProxy(url, overrideProxy) {
		const proxy = overrideProxy || localStorage.getItem("proxy") || "uv";
		switch (proxy) {
			case "uv":
				return __uv$config.prefix + __uv$config.encodeUrl(url);
			case "sj":
				return scramjet.encodeUrl(url);
			case "ec":
				return __eclipse$config.prefix + __eclipse$config.codec.encode(url);
			case "rh":
				return await RammerheadEncode(url);
			default:
				return __uv$config.prefix + __uv$config.encodeUrl(url);
		}
	}

	window.proxyEncoder = {
		encode: encodeUrlWithProxy
	};

	// === Decode button listeners ===
	const uvDecodeButton = document.getElementById("uvDecodeButton");
	const sjDecodeButton = document.getElementById("sjDecodeButton");
	const uvDecode = document.getElementById("uvDecode");
	const sjDecode = document.getElementById("sjDecode");

	if (uvDecodeButton && uvDecode) {
		uvDecodeButton.addEventListener("click", () => {
			if (!uvDecode.value.trim()) return alert("Please enter a URL to decode.");
			uvDecode.value = uvDecodeUrl(uvDecode.value);
		});
	}

	if (sjDecodeButton && sjDecode) {
		sjDecodeButton.addEventListener("click", () => {
			if (!sjDecode.value.trim()) return alert("Please enter a URL to decode.");
			sjDecode.value = sjDecodeUrl(sjDecode.value);
		});
	}

	// === Main form handler ===
if (form && input) {
	form.addEventListener("submit", async (event) => {
		event.preventDefault();

		let url = input.value.trim();

		// --- Search engine fallback ---
		if (!isUrl(url)) {
			const engine = localStorage.getItem("searchEngine") || "duckduckgo";
			switch (engine) {
				case "brave":
					url = "https://search.brave.com/search?q=" + url;
					break;
				case "google":
					url = "https://www.google.com/search?q=" + url;
					break;
				case "duckduckgo":
					url = "https://duckduckgo.com/?t=h_&q=" + url;
					break;
				case "bing":
					url = "https://www.bing.com/search?q=" + url;
					break;
				case "yahoo":
					url = "https://search.yahoo.com/search?p=" + url;
					break;
				case "ecosia":
					url = "https://www.ecosia.org/search?q=" + url;
					break;
				case "irs":
					url = "https://www.irs.gov/site-index-search?search=" + url;
					break;
				default:
					url = "https://duckduckgo.com/?t=h_&q=" + url;
					break;
			}
		} else if (!url.startsWith("https://") && !url.startsWith("http://")) {
			url = `https://${url}`;
		}

		// --- Existing encoding logic ---
		const proxy = localStorage.getItem("proxy") || "uv";
		switch (proxy) {
			case "uv":
				await uvEncode(url);
				break;
			case "sj":
				await sjEncode(url);
				break;
			case "ec":
				await ecEncode(url);
				break;
			case "rh":
				await rhEncode(url);
				break;
		}
	});
}


	// === Load last history placeholder ===
	const lastDecodedUrl = localStorage.getItem("history");
	if (lastDecodedUrl && input) {
		input.placeholder = lastDecodedUrl;
	}

	// === Lazy init background tasks ===
	window.addEventListener("load", () => {
		initBareMux();
		initServiceWorker();
	});
});

// Fallback storage listener so other frames pick up settings instantly
window.addEventListener("storage", ({ key, newValue }) => {
	if (!key) return;
	if (key === "transport" && newValue) {
		baremuxConnection = null;
		initBareMux();
		console.info("Storage transport change detected – reinitializing BareMux.");
	}
	if (key === "proxy") {
		console.info(`Storage proxy change detected – now using ${newValue}.`);
	}
});
