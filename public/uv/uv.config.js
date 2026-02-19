/*global Ultraviolet*/
self.__uv$config = {
    prefix: '/uv/service/',
    encodeUrl: Ultraviolet.codec.xor.encode,
    decodeUrl: Ultraviolet.codec.xor.decode,
    handler: '/uv/uv.handler.js',
    client: '/uv/uv.client.js',
    bundle: '/uv/uv.bundle.js',
    config: '/uv/uv.config.js',
    sw: '/uv/uv.sw.js',
    // Inject the bare-mux port bridge into all proxied documents so the SW can
    // obtain a SharedWorker MessagePort even when the user navigates directly
    // to a /uv/service/* page (no local UI scripts loaded yet).
    inject: [
        {
            host: ".*",
            injectTo: "head",
            html: '<script src="/assets/js/baremux-port-bridge.js"></script>',
        },
    ],
};
