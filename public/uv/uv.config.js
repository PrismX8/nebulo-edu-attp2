/*global Ultraviolet*/
self.__uv$config = {
    prefix: '/a3/s/',
    encodeUrl: Ultraviolet.codec.xor.encode,
    decodeUrl: Ultraviolet.codec.xor.decode,
    handler: '/a3/uv.handler.js',
    client: '/a3/uv.client.js',
    bundle: '/a3/uv.bundle.js',
    config: '/a3/uv.config.js',
    sw: '/a3/uv.sw.js',
    // Inject the bare-mux port bridge into all proxied documents so the SW can
    // obtain a SharedWorker MessagePort even when the user navigates directly
    // to a /a3/s/* page (no local UI scripts loaded yet).
    inject: [
        {
            host: ".*",
            injectTo: "head",
            html: '<script src="/assets/js/x1p7b.js"></script>',
        },
    ],
};
