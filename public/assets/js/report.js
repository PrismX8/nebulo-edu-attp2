// === BareMux init (only once per session) ===
async function initBareMux() {
	try {
		if (baremuxConnection) return baremuxConnection;
		baremuxConnection = new BareMux.BareMuxConnection("/d5/worker.js?v=bw1");

		const wispUrl =
			(location.protocol === "https:" ? "wss" : "ws") +
			"://" +
			location.host +
			"/wisp/";

		const transport = localStorage.getItem("transport") || "epoxy";
		localStorage.setItem("transport", transport);

		const expectedTransport =
			transport === "libcurl" ? "/f1/index.mjs" : "/e9/index.mjs";

		if ((await baremuxConnection.getTransport()) !== expectedTransport) {
			await baremuxConnection.setTransport(expectedTransport, [{ wisp: wispUrl }]);
			console.log(`Using ${transport} transport. Wisp URL: ${wispUrl}`);
		}
		const activeTransport = await baremuxConnection.getTransport();
		if (activeTransport !== expectedTransport) {
			throw new Error(`BareMux transport verification failed. Expected ${expectedTransport}, got ${activeTransport || "none"}.`);
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
			await navigator.serviceWorker.register("/sw.js");
			console.log("Registering service worker...");
		}
	} catch (err) {
		console.error("Service worker registration failed:", err);
	}
}

// === Run UV encoding ===
function run() {
	const encodedUrl =
		__uv$config.prefix +
		__uv$config.encodeUrl(
			"hhttps://app.formbricks.com/s/cmh88mhp20wshad015c108lol"
		);

	localStorage.setItem("rurl", encodedUrl);
	console.log("Encoded URL stored:", encodedUrl);
}

// === Lazy init background tasks ===
window.addEventListener("load", async () => {
	await initBareMux();
	await initServiceWorker();
	run();
});
