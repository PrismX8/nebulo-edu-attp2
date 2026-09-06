var _0x49c45c = Object.create;
var _0x5d12f3 = Object.defineProperty;
var _0x4b885b = Object.getOwnPropertyDescriptor;
var _0x47ebc7 = Object.getOwnPropertyNames;
var _0x59a43a = Object.getPrototypeOf;
var _0x3da47b = Object.prototype.hasOwnProperty;
var _0x31ffc7 = (_0x341587, _0x38ffcb) => function _0xcb46e6() {
    if (_0x341587) {
        _0x38ffcb = (0, _0x341587[_0x47ebc7(_0x341587)[0]])(_0x341587 = 0);
    }
    return _0x38ffcb;
};
var _0x543a18 = (_0x232162, _0x1d4fb7) => {
    for (var _0x336929 in _0x1d4fb7) {
        _0x5d12f3(_0x232162, _0x336929, {
            get: _0x1d4fb7[_0x336929],
            enumerable: true
        });
    }
};
var _0x2838fa = (_0x17ac3c, _0xab8bd3, _0x1ead71, _0x562679) => {
    if (_0xab8bd3 && typeof _0xab8bd3 === "object" || typeof _0xab8bd3 === "function") {
        for (let _0x4b8336 of _0x47ebc7(_0xab8bd3)) {
            if (!_0x3da47b.call(_0x17ac3c, _0x4b8336) && _0x4b8336 !== _0x1ead71) {
                _0x5d12f3(_0x17ac3c, _0x4b8336, {
                    get: () => _0xab8bd3[_0x4b8336],
                    enumerable: !(_0x562679 = _0x4b885b(_0xab8bd3, _0x4b8336)) || _0x562679.enumerable
                });
            }
        }
    }
    return _0x17ac3c;
};
var _0x4809ce = (_0x3a5c9b, _0x470454, _0x35e41b) => {
    _0x35e41b = _0x3a5c9b != null ? _0x49c45c(_0x59a43a(_0x3a5c9b)) : {};
    return _0x2838fa(_0x470454 || !_0x3a5c9b || !_0x3a5c9b.__esModule ? _0x5d12f3(_0x35e41b, "default", {
        value: _0x3a5c9b,
        enumerable: true
    }) : _0x35e41b, _0x3a5c9b);
};
var _0x2d402e = _0x362224 => _0x2838fa(_0x5d12f3({}, "__esModule", {
    value: true
}), _0x362224);
var _0x5eaafa = {};
_0x543a18(_0x5eaafa, {
    RequestError: () => _0x591479,
    createAdaptorServer: () => _0x537a4c,
    getRequestListener: () => _0x5a22ff,
    serve: () => _0x282be5
});
function _0x29d486(_0x559ad5, _0x21311a) {
    if (_0x559ad5.locked) {
        throw new TypeError("ReadableStream is locked.");
    } else if (_0x21311a.destroyed) {
        _0x559ad5.cancel();
        return;
    }
    const _0xa53fff = _0x559ad5.getReader();
    _0x21311a.on("close", _0x3ae747);
    _0x21311a.on("error", _0x3ae747);
    _0xa53fff.read().then(_0x15a1ac, _0x3ae747);
    return _0xa53fff.closed.finally(() => {
        _0x21311a.off("close", _0x3ae747);
        _0x21311a.off("error", _0x3ae747);
    });
    function _0x3ae747(_0x1798cc) {
        _0xa53fff.cancel(_0x1798cc).catch(() => {});
        if (_0x1798cc) {
            _0x21311a.destroy(_0x1798cc);
        }
    }
    function _0x1eb622() {
        _0xa53fff.read().then(_0x15a1ac, _0x3ae747);
    }
    function _0x15a1ac({
                           done: _0xf5b06,
                           value: _0xadfb05
                       }) {
        try {
            if (_0xf5b06) {
                _0x21311a.end();
            } else if (!_0x21311a.write(_0xadfb05)) {
                _0x21311a.once("drain", _0x1eb622);
            } else {
                return _0xa53fff.read().then(_0x15a1ac, _0x3ae747);
            }
        } catch (_0x4eecdd) {
            _0x3ae747(_0x4eecdd);
        }
    }
}
var _0x1dc80b;
var _0x46d6fe;
var _0x5362ee;
var _0x338c2c;
var _0x591479;
var _0x380ec9;
var _0x5cefec;
var _0x461756;
var _0x258752;
var _0x2167bc;
var _0x871984;
var _0x3e241b;
var _0x501827;
var _0x52c407;
var _0x4a0fa1;
var _0x1cdfea;
var _0x4eecbb;
var _0x37aff8;
var _0x436b27;
var _0x10a5e4;
var _0x356bc7;
var _0x3948b8;
var _0x449079;
var _0x188086;
var _0x4c4352;
var _0xc8278e;
var _0x1563a6;
var _0xa5f67c;
var _0x3156d9;
var _0x2b85d9;
var _0xa82741;
var _0x5663ec;
var _0x5a9258;
var _0x5a22ff;
var _0x537a4c;
var _0x282be5;
var _0x21660c = _0x31ffc7({
    "node_modules/@hono/node-server/dist/index.mjs"() {
        _0x1dc80b = require("http");
        _0x46d6fe = require("http2");
        _0x5362ee = require("stream");
        _0x338c2c = _0x4809ce(require("crypto"), 1);
        _0x591479 = class extends Error {
            constructor(_0x27927f, _0x4db6df) {
                super(_0x27927f, _0x4db6df);
                this.name = "RequestError";
            }
        };
        _0x380ec9 = _0x3a743a => {
            if (_0x3a743a instanceof _0x591479) {
                return _0x3a743a;
            }
            return new _0x591479(_0x3a743a.message, {
                cause: _0x3a743a
            });
        };
        _0x5cefec = global.Request;
        _0x461756 = class extends _0x5cefec {
            constructor(_0x426080, _0xe09182) {
                if (typeof _0x426080 === "object" && _0x2167bc in _0x426080) {
                    _0x426080 = _0x426080[_0x2167bc]();
                }
                if (typeof _0xe09182?.body?.getReader !== "undefined") {
                    ;
                    _0xe09182.duplex ??= "half";
                }
                super(_0x426080, _0xe09182);
            }
        };
        _0x258752 = (_0x20286a, _0x5f0339, _0x41dad9, _0x2f499b) => {
            const _0x234953 = [];
            const _0x22a45a = _0x41dad9.rawHeaders;
            for (let _0x15e7ff = 0; _0x15e7ff < _0x22a45a.length; _0x15e7ff += 2) {
                const {
                    [_0x15e7ff]: _0x4dbae8,
                    [_0x15e7ff + 1]: _0x17cd30
                } = _0x22a45a;
                if (_0x4dbae8.charCodeAt(0) !== 58) {
                    _0x234953.push([_0x4dbae8, _0x17cd30]);
                }
            }
            const _0x109796 = {
                method: _0x20286a,
                headers: _0x234953,
                signal: _0x2f499b.signal
            };
            if (_0x20286a === "TRACE") {
                _0x109796.method = "GET";
                const _0x4495de = new _0x461756(_0x5f0339, _0x109796);
                Object.defineProperty(_0x4495de, "method", {
                    get() {
                        return "TRACE";
                    }
                });
                return _0x4495de;
            }
            if (_0x20286a !== "GET" && _0x20286a !== "HEAD") {
                if ("rawBody" in _0x41dad9 && _0x41dad9.rawBody instanceof Buffer) {
                    _0x109796.body = new ReadableStream({
                        start(_0x142bca) {
                            _0x142bca.enqueue(_0x41dad9.rawBody);
                            _0x142bca.close();
                        }
                    });
                } else {
                    _0x109796.body = _0x5362ee.Readable.toWeb(_0x41dad9);
                }
            }
            return new _0x461756(_0x5f0339, _0x109796);
        };
        _0x2167bc = Symbol("getRequestCache");
        _0x871984 = Symbol("requestCache");
        _0x3e241b = Symbol("incomingKey");
        _0x501827 = Symbol("urlKey");
        _0x52c407 = Symbol("abortControllerKey");
        _0x4a0fa1 = Symbol("getAbortController");
        _0x1cdfea = {
            get method() {
                return this[_0x3e241b].method || "GET";
            },
            get url() {
                return this[_0x501827];
            },
            [_0x4a0fa1]() {
                this[_0x2167bc]();
                return this[_0x52c407];
            },
            [_0x2167bc]() {
                this[_0x52c407] ||= new AbortController();
                return this[_0x871984] ||= _0x258752(this.method, this[_0x501827], this[_0x3e241b], this[_0x52c407]);
            }
        };
        ["body", "bodyUsed", "cache", "credentials", "destination", "headers", "integrity", "mode", "redirect", "referrer", "referrerPolicy", "signal", "keepalive"].forEach(_0x578e73 => {
            Object.defineProperty(_0x1cdfea, _0x578e73, {
                get() {
                    return this[_0x2167bc]()[_0x578e73];
                }
            });
        });
        ["arrayBuffer", "blob", "clone", "formData", "json", "text"].forEach(_0x40c191 => {
            Object.defineProperty(_0x1cdfea, _0x40c191, {
                value: function () {
                    return this[_0x2167bc]()[_0x40c191]();
                }
            });
        });
        Object.setPrototypeOf(_0x1cdfea, _0x461756.prototype);
        _0x4eecbb = (_0x23d0e7, _0x170f77) => {
            const _0xe5e909 = Object.create(_0x1cdfea);
            _0xe5e909[_0x3e241b] = _0x23d0e7;
            const _0x700a81 = _0x23d0e7.url || "";
            if (_0x700a81[0] !== "/" && (_0x700a81.startsWith("http://") || _0x700a81.startsWith("https://"))) {
                if (_0x23d0e7 instanceof _0x46d6fe.Http2ServerRequest) {
                    throw new _0x591479("Absolute URL for :path is not allowed in HTTP/2");
                }
                try {
                    const _0x29d076 = new URL(_0x700a81);
                    _0xe5e909[_0x501827] = _0x29d076.href;
                } catch (_0x1eb2f2) {
                    throw new _0x591479("Invalid absolute URL", {
                        cause: _0x1eb2f2
                    });
                }
                return _0xe5e909;
            }
            const _0x292e28 = (_0x23d0e7 instanceof _0x46d6fe.Http2ServerRequest ? _0x23d0e7.authority : _0x23d0e7.headers.host) || _0x170f77;
            if (!_0x292e28) {
                throw new _0x591479("Missing host header");
            }
            let _0x23a7eb;
            if (_0x23d0e7 instanceof _0x46d6fe.Http2ServerRequest) {
                _0x23a7eb = _0x23d0e7.scheme;
                if (_0x23a7eb !== "http" && _0x23a7eb !== "https") {
                    throw new _0x591479("Unsupported scheme");
                }
            } else {
                _0x23a7eb = _0x23d0e7.socket && _0x23d0e7.socket.encrypted ? "https" : "http";
            }
            const _0x2d89d3 = new URL(_0x23a7eb + "://" + _0x292e28 + _0x700a81);
            if (_0x2d89d3.hostname.length !== _0x292e28.length && _0x2d89d3.hostname !== _0x292e28.replace(/:\d+$/, "")) {
                throw new _0x591479("Invalid host header");
            }
            _0xe5e909[_0x501827] = _0x2d89d3.href;
            return _0xe5e909;
        };
        _0x37aff8 = Symbol("responseCache");
        _0x436b27 = Symbol("getResponseCache");
        _0x10a5e4 = Symbol("cache");
        _0x356bc7 = global.Response;
        _0x3948b8 = class _0x332950 {
            #body;
            #init;
            [_0x436b27]() {
                delete this[_0x10a5e4];
                return this[_0x37aff8] ||= new _0x356bc7(this.#body, this.#init);
            }
            constructor(_0x4bc68a, _0x1aee77) {
                let _0x49d978;
                this.#body = _0x4bc68a;
                if (_0x1aee77 instanceof _0x332950) {
                    const _0x331035 = _0x1aee77[_0x37aff8];
                    if (_0x331035) {
                        this.#init = _0x331035;
                        this[_0x436b27]();
                        return;
                    } else {
                        this.#init = _0x1aee77.#init;
                        _0x49d978 = new Headers(_0x1aee77.#init.headers);
                    }
                } else {
                    this.#init = _0x1aee77;
                }
                if (typeof _0x4bc68a === "string" || typeof _0x4bc68a?.getReader !== "undefined" || _0x4bc68a instanceof Blob || _0x4bc68a instanceof Uint8Array) {
                    _0x49d978 ||= _0x1aee77?.headers || {
                        "content-type": "text/plain; charset=UTF-8"
                    };
                    this[_0x10a5e4] = [_0x1aee77?.status || 200, _0x4bc68a, _0x49d978];
                }
            }
            get headers() {
                const _0x277609 = this[_0x10a5e4];
                if (_0x277609) {
                    if (!(_0x277609[2] instanceof Headers)) {
                        _0x277609[2] = new Headers(_0x277609[2]);
                    }
                    return _0x277609[2];
                }
                return this[_0x436b27]().headers;
            }
            get status() {
                return this[_0x10a5e4]?.[0] ?? this[_0x436b27]().status;
            }
            get ok() {
                const _0x3f9d3f = this.status;
                return _0x3f9d3f >= 200 && _0x3f9d3f < 300;
            }
        };
        ["body", "bodyUsed", "redirected", "statusText", "trailers", "type", "url"].forEach(_0x46bf7e => {
            Object.defineProperty(_0x3948b8.prototype, _0x46bf7e, {
                get() {
                    return this[_0x436b27]()[_0x46bf7e];
                }
            });
        });
        ["arrayBuffer", "blob", "clone", "formData", "json", "text"].forEach(_0x5aa8f5 => {
            Object.defineProperty(_0x3948b8.prototype, _0x5aa8f5, {
                value: function () {
                    return this[_0x436b27]()[_0x5aa8f5]();
                }
            });
        });
        Object.setPrototypeOf(_0x3948b8, _0x356bc7);
        Object.setPrototypeOf(_0x3948b8.prototype, _0x356bc7.prototype);
        _0x449079 = _0x27594f => {
            const _0x5de3a0 = {};
            if (!(_0x27594f instanceof Headers)) {
                _0x27594f = new Headers(_0x27594f ?? undefined);
            }
            const _0x120ba9 = [];
            for (const [_0x5488c6, _0x4d205c] of _0x27594f) {
                if (_0x5488c6 === "set-cookie") {
                    _0x120ba9.push(_0x4d205c);
                } else {
                    _0x5de3a0[_0x5488c6] = _0x4d205c;
                }
            }
            if (_0x120ba9.length > 0) {
                _0x5de3a0["set-cookie"] = _0x120ba9;
            }
            _0x5de3a0["content-type"] ??= "text/plain; charset=UTF-8";
            return _0x5de3a0;
        };
        _0x188086 = "x-hono-already-sent";
        _0x4c4352 = global.fetch;
        if (typeof global.crypto === "undefined") {
            global.crypto = _0x338c2c.default;
        }
        global.fetch = (_0x10acaa, _0x132a89) => {
            _0x132a89 = {
                compress: false,
                ..._0x132a89
            };
            return _0x4c4352(_0x10acaa, _0x132a89);
        };
        _0xc8278e = /^no$/i;
        _0x1563a6 = /^(application\/json\b|text\/(?!event-stream\b))/i;
        _0xa5f67c = () => new Response(null, {
            status: 400
        });
        _0x3156d9 = _0xde4684 => new Response(null, {
            status: _0xde4684 instanceof Error && (_0xde4684.name === "TimeoutError" || _0xde4684.constructor.name === "TimeoutError") ? 504 : 500
        });
        _0x2b85d9 = (_0x41032e, _0x1b5303) => {
            const _0x2c9596 = _0x41032e instanceof Error ? _0x41032e : new Error("unknown error", {
                cause: _0x41032e
            });
            if (_0x2c9596.code === "ERR_STREAM_PREMATURE_CLOSE") {
                console.info("The user aborted a request.");
            } else {
                console.error(_0x41032e);
                if (!_0x1b5303.headersSent) {
                    _0x1b5303.writeHead(500, {
                        "Content-Type": "text/plain"
                    });
                }
                _0x1b5303.end("Error: " + _0x2c9596.message);
                _0x1b5303.destroy(_0x2c9596);
            }
        };
        _0xa82741 = _0x3d1277 => {
            if ("flushHeaders" in _0x3d1277 && _0x3d1277.writable) {
                _0x3d1277.flushHeaders();
            }
        };
        _0x5663ec = async (_0x1a8961, _0x583aab) => {
            let [_0x25ec74, _0x39890c, _0x636532] = _0x1a8961[_0x10a5e4];
            if (_0x636532 instanceof Headers) {
                _0x636532 = _0x449079(_0x636532);
            }
            if (typeof _0x39890c === "string") {
                _0x636532["Content-Length"] = Buffer.byteLength(_0x39890c);
            } else if (_0x39890c instanceof Uint8Array) {
                _0x636532["Content-Length"] = _0x39890c.byteLength;
            } else if (_0x39890c instanceof Blob) {
                _0x636532["Content-Length"] = _0x39890c.size;
            }
            _0x583aab.writeHead(_0x25ec74, _0x636532);
            if (typeof _0x39890c === "string" || _0x39890c instanceof Uint8Array) {
                _0x583aab.end(_0x39890c);
            } else if (_0x39890c instanceof Blob) {
                _0x583aab.end(new Uint8Array(await _0x39890c.arrayBuffer()));
            } else {
                _0xa82741(_0x583aab);
                return _0x29d486(_0x39890c, _0x583aab)?.catch(_0x3dde3a => _0x2b85d9(_0x3dde3a, _0x583aab));
            }
        };
        _0x5a9258 = async (_0x30cb0f, _0x3ca915, _0x4513b0 = {}) => {
            if (_0x30cb0f instanceof Promise) {
                if (_0x4513b0.errorHandler) {
                    try {
                        _0x30cb0f = await _0x30cb0f;
                    } catch (_0x59c143) {
                        const _0x19c714 = await _0x4513b0.errorHandler(_0x59c143);
                        if (!_0x19c714) {
                            return;
                        }
                        _0x30cb0f = _0x19c714;
                    }
                } else {
                    _0x30cb0f = await _0x30cb0f.catch(_0x3156d9);
                }
            }
            if (_0x10a5e4 in _0x30cb0f) {
                return _0x5663ec(_0x30cb0f, _0x3ca915);
            }
            const _0x44dc83 = _0x449079(_0x30cb0f.headers);
            if (_0x30cb0f.body) {
                const {
                    "transfer-encoding": _0x27f52b,
                    "content-encoding": _0x56306c,
                    "content-length": _0x5103f4,
                    "x-accel-buffering": _0x2bfd85,
                    "content-type": _0x297dd7
                } = _0x44dc83;
                if (_0x27f52b || _0x56306c || _0x5103f4 || _0x2bfd85 && _0xc8278e.test(_0x2bfd85) || !_0x1563a6.test(_0x297dd7)) {
                    _0x3ca915.writeHead(_0x30cb0f.status, _0x44dc83);
                    _0xa82741(_0x3ca915);
                    await _0x29d486(_0x30cb0f.body, _0x3ca915);
                } else {
                    const _0x552a4f = await _0x30cb0f.arrayBuffer();
                    _0x44dc83["content-length"] = _0x552a4f.byteLength;
                    _0x3ca915.writeHead(_0x30cb0f.status, _0x44dc83);
                    _0x3ca915.end(new Uint8Array(_0x552a4f));
                }
            } else if (_0x44dc83[_0x188086]) {} else {
                _0x3ca915.writeHead(_0x30cb0f.status, _0x44dc83);
                _0x3ca915.end();
            }
        };
        _0x5a22ff = (_0x57653a, _0x66aa42 = {}) => {
            if (_0x66aa42.overrideGlobalObjects !== false && global.Request !== _0x461756) {
                Object.defineProperty(global, "Request", {
                    value: _0x461756
                });
                Object.defineProperty(global, "Response", {
                    value: _0x3948b8
                });
            }
            return async (_0xcc1ebc, _0x48a50b) => {
                let _0x17f13a;
                let _0x5c52ef;
                try {
                    _0x5c52ef = _0x4eecbb(_0xcc1ebc, _0x66aa42.hostname);
                    _0x48a50b.on("close", () => {
                        const _0x405b61 = _0x5c52ef[_0x52c407];
                        if (!_0x405b61) {
                            return;
                        }
                        if (_0xcc1ebc.errored) {
                            _0x5c52ef[_0x52c407].abort(_0xcc1ebc.errored.toString());
                        } else if (!_0x48a50b.writableFinished) {
                            _0x5c52ef[_0x52c407].abort("Client connection prematurely closed.");
                        }
                    });
                    _0x17f13a = _0x57653a(_0x5c52ef, {
                        incoming: _0xcc1ebc,
                        outgoing: _0x48a50b
                    });
                    if (_0x10a5e4 in _0x17f13a) {
                        return _0x5663ec(_0x17f13a, _0x48a50b);
                    }
                } catch (_0x260b76) {
                    if (!_0x17f13a) {
                        if (_0x66aa42.errorHandler) {
                            _0x17f13a = await _0x66aa42.errorHandler(_0x5c52ef ? _0x260b76 : _0x380ec9(_0x260b76));
                            if (!_0x17f13a) {
                                return;
                            }
                        } else if (!_0x5c52ef) {
                            _0x17f13a = _0xa5f67c();
                        } else {
                            _0x17f13a = _0x3156d9(_0x260b76);
                        }
                    } else {
                        return _0x2b85d9(_0x260b76, _0x48a50b);
                    }
                }
                try {
                    return await _0x5a9258(_0x17f13a, _0x48a50b, _0x66aa42);
                } catch (_0xbcd15c) {
                    return _0x2b85d9(_0xbcd15c, _0x48a50b);
                }
            };
        };
        _0x537a4c = _0x323517 => {
            const _0x439c9d = _0x323517.fetch;
            const _0x202904 = _0x5a22ff(_0x439c9d, {
                hostname: _0x323517.hostname,
                overrideGlobalObjects: _0x323517.overrideGlobalObjects
            });
            const _0xb29431 = _0x323517.createServer || _0x1dc80b.createServer;
            const _0x3447de = _0xb29431(_0x323517.serverOptions || {}, _0x202904);
            return _0x3447de;
        };
        _0x282be5 = (_0x177598, _0x3e299e) => {
            const _0x135f0d = _0x537a4c(_0x177598);
            _0x135f0d.listen(_0x177598?.port ?? 3000, _0x177598.hostname, () => {
                const _0x3fe0d5 = _0x135f0d.address();
                if (_0x3e299e) {
                    _0x3e299e(_0x3fe0d5);
                }
            });
            return _0x135f0d;
        };
    }
});
var _0x59cd70 = {};
_0x543a18(_0x59cd70, {
    default: () => _0x338013
});
module.exports = _0x2d402e(_0x59cd70);
var _0x3d28e0 = (_0x2fe3dc, _0x89a6f1, _0x15b482) => {
    return (_0x44663f, _0x565708) => {
        let _0x512c98 = -1;
        return _0x40ba47(0);
        async function _0x40ba47(_0x1eb9d3) {
            if (_0x1eb9d3 <= _0x512c98) {
                throw new Error("next() called multiple times");
            }
            _0x512c98 = _0x1eb9d3;
            let _0x38ef10;
            let _0x1df169 = false;
            let _0x185c84;
            if (_0x2fe3dc[_0x1eb9d3]) {
                _0x185c84 = _0x2fe3dc[_0x1eb9d3][0][0];
                _0x44663f.req.routeIndex = _0x1eb9d3;
            } else {
                _0x185c84 = _0x1eb9d3 === _0x2fe3dc.length && _0x565708 || undefined;
            }
            if (_0x185c84) {
                try {
                    _0x38ef10 = await _0x185c84(_0x44663f, () => _0x40ba47(_0x1eb9d3 + 1));
                } catch (_0x3a156b) {
                    if (_0x3a156b instanceof Error && _0x89a6f1) {
                        _0x44663f.error = _0x3a156b;
                        _0x38ef10 = await _0x89a6f1(_0x3a156b, _0x44663f);
                        _0x1df169 = true;
                    } else {
                        throw _0x3a156b;
                    }
                }
            } else if (_0x44663f.finalized === false && _0x15b482) {
                _0x38ef10 = await _0x15b482(_0x44663f);
            }
            if (_0x38ef10 && (_0x44663f.finalized === false || _0x1df169)) {
                _0x44663f.res = _0x38ef10;
            }
            return _0x44663f;
        }
    };
};
var _0x111db6 = Symbol();
var _0x76d674 = async (_0xad69b2, _0x4df13e = Object.create(null)) => {
    const {
        all = false,
        dot = false
    } = _0x4df13e;
    const _0x4ff0d3 = _0xad69b2 instanceof _0xe80619 ? _0xad69b2.raw.headers : _0xad69b2.headers;
    const _0x3ee3b0 = _0x4ff0d3.get("Content-Type");
    if (_0x3ee3b0?.startsWith("multipart/form-data") || _0x3ee3b0?.startsWith("application/x-www-form-urlencoded")) {
        return _0x2235ff(_0xad69b2, {
            all: all,
            dot: dot
        });
    }
    return {};
};
async function _0x2235ff(_0x46ee8e, _0x57c3e7) {
    const _0x3379d7 = await _0x46ee8e.formData();
    if (_0x3379d7) {
        return _0xc3d45a(_0x3379d7, _0x57c3e7);
    }
    return {};
}
function _0xc3d45a(_0x4ee6a5, _0xa8dbd4) {
    const _0x230796 = Object.create(null);
    _0x4ee6a5.forEach((_0x1273f6, _0x505437) => {
        const _0x2cebaa = _0xa8dbd4.all || _0x505437.endsWith("[]");
        if (!_0x2cebaa) {
            _0x230796[_0x505437] = _0x1273f6;
        } else {
            _0x168319(_0x230796, _0x505437, _0x1273f6);
        }
    });
    if (_0xa8dbd4.dot) {
        Object.entries(_0x230796).forEach(([_0x158f93, _0x1778b2]) => {
            const _0x37c65a = _0x158f93.includes(".");
            if (_0x37c65a) {
                _0x3ee481(_0x230796, _0x158f93, _0x1778b2);
                delete _0x230796[_0x158f93];
            }
        });
    }
    return _0x230796;
}
var _0x168319 = (_0xca9d8f, _0x5708c0, _0x3aa6a3) => {
    if (_0xca9d8f[_0x5708c0] !== undefined) {
        if (Array.isArray(_0xca9d8f[_0x5708c0])) {
            ;
            _0xca9d8f[_0x5708c0].push(_0x3aa6a3);
        } else {
            _0xca9d8f[_0x5708c0] = [_0xca9d8f[_0x5708c0], _0x3aa6a3];
        }
    } else if (!_0x5708c0.endsWith("[]")) {
        _0xca9d8f[_0x5708c0] = _0x3aa6a3;
    } else {
        _0xca9d8f[_0x5708c0] = [_0x3aa6a3];
    }
};
var _0x3ee481 = (_0x31ca9d, _0x184fb2, _0x417f6e) => {
    let _0x47d265 = _0x31ca9d;
    const _0x57b8b0 = _0x184fb2.split(".");
    _0x57b8b0.forEach((_0x1f3a4e, _0x2302a8) => {
        if (_0x2302a8 === _0x57b8b0.length - 1) {
            _0x47d265[_0x1f3a4e] = _0x417f6e;
        } else {
            if (!_0x47d265[_0x1f3a4e] || typeof _0x47d265[_0x1f3a4e] !== "object" || Array.isArray(_0x47d265[_0x1f3a4e]) || _0x47d265[_0x1f3a4e] instanceof File) {
                _0x47d265[_0x1f3a4e] = Object.create(null);
            }
            _0x47d265 = _0x47d265[_0x1f3a4e];
        }
    });
};
var _0x367ab4 = _0x4c05a6 => {
    const _0x24b066 = _0x4c05a6.split("/");
    if (_0x24b066[0] === "") {
        _0x24b066.shift();
    }
    return _0x24b066;
};
var _0x1d1dce = _0x200791 => {
    const {
        groups: _0x644fec,
        path: _0xb8d725
    } = _0x1038de(_0x200791);
    const _0x37ce94 = _0x367ab4(_0xb8d725);
    return _0x422131(_0x37ce94, _0x644fec);
};
var _0x1038de = _0x597942 => {
    const _0x255814 = [];
    _0x597942 = _0x597942.replace(/\{[^}]+\}/g, (_0x34ee88, _0x2b110a) => {
        const _0x335d30 = "@" + _0x2b110a;
        _0x255814.push([_0x335d30, _0x34ee88]);
        return _0x335d30;
    });
    return {
        groups: _0x255814,
        path: _0x597942
    };
};
var _0x422131 = (_0x5b3a7e, _0x1ac9db) => {
    for (let _0xac3246 = _0x1ac9db.length - 1; _0xac3246 >= 0; _0xac3246--) {
        const [_0x3d5b52] = _0x1ac9db[_0xac3246];
        for (let _0x19327e = _0x5b3a7e.length - 1; _0x19327e >= 0; _0x19327e--) {
            if (_0x5b3a7e[_0x19327e].includes(_0x3d5b52)) {
                _0x5b3a7e[_0x19327e] = _0x5b3a7e[_0x19327e].replace(_0x3d5b52, _0x1ac9db[_0xac3246][1]);
                break;
            }
        }
    }
    return _0x5b3a7e;
};
var _0x2e373a = {};
var _0x475cfa = (_0x231032, _0x10c276) => {
    if (_0x231032 === "*") {
        return "*";
    }
    const _0x4aa16a = _0x231032.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
    if (_0x4aa16a) {
        const _0x415be5 = _0x231032 + "#" + _0x10c276;
        if (!_0x2e373a[_0x415be5]) {
            if (_0x4aa16a[2]) {
                _0x2e373a[_0x415be5] = _0x10c276 && _0x10c276[0] !== ":" && _0x10c276[0] !== "*" ? [_0x415be5, _0x4aa16a[1], new RegExp("^" + _0x4aa16a[2] + "(?=/" + _0x10c276 + ")")] : [_0x231032, _0x4aa16a[1], new RegExp("^" + _0x4aa16a[2] + "$")];
            } else {
                _0x2e373a[_0x415be5] = [_0x231032, _0x4aa16a[1], true];
            }
        }
        return _0x2e373a[_0x415be5];
    }
    return null;
};
var _0x32262a = (_0x57c1f2, _0x34703e) => {
    try {
        return _0x34703e(_0x57c1f2);
    } catch {
        return _0x57c1f2.replace(/(?:%[0-9A-Fa-f]{2})+/g, _0x59bc26 => {
            try {
                return _0x34703e(_0x59bc26);
            } catch {
                return _0x59bc26;
            }
        });
    }
};
var _0x1b3768 = _0x1bb939 => _0x32262a(_0x1bb939, decodeURI);
var _0x180297 = _0x484ccf => {
    const _0x3a7e43 = _0x484ccf.url;
    const _0x2afbe6 = _0x3a7e43.indexOf("/", _0x3a7e43.charCodeAt(9) === 58 ? 13 : 8);
    let _0x2e9513 = _0x2afbe6;
    for (; _0x2e9513 < _0x3a7e43.length; _0x2e9513++) {
        const _0x13016f = _0x3a7e43.charCodeAt(_0x2e9513);
        if (_0x13016f === 37) {
            const _0xff3fba = _0x3a7e43.indexOf("?", _0x2e9513);
            const _0x3258a9 = _0x3a7e43.slice(_0x2afbe6, _0xff3fba === -1 ? undefined : _0xff3fba);
            return _0x1b3768(_0x3258a9.includes("%25") ? _0x3258a9.replace(/%25/g, "%2525") : _0x3258a9);
        } else if (_0x13016f === 63) {
            break;
        }
    }
    return _0x3a7e43.slice(_0x2afbe6, _0x2e9513);
};
var _0x153c85 = _0x360d45 => {
    const _0x2880ac = _0x180297(_0x360d45);
    if (_0x2880ac.length > 1 && _0x2880ac.at(-1) === "/") {
        return _0x2880ac.slice(0, -1);
    } else {
        return _0x2880ac;
    }
};
var _0x1dfae5 = (_0x5a1b57, _0x5cb462, ..._0x2dca11) => {
    const _0x21577b = {
        xzbKi: "undefined",
        OHdpb: function (_0x5cadd4, _0x5cbfc9) {
            return _0x5cadd4 === _0x5cbfc9;
        },
        uHnZN: "iPatT",
        ZvsPV: function (_0x19d9b8, _0x20f451, ..._0x241cde) {
            return _0x19d9b8(_0x20f451, ..._0x241cde);
        }
    };
    if (_0x2dca11.length) {
        if (_0x21577b.OHdpb("CMdRb", _0x21577b.uHnZN)) {
            return typeof _0x5ce57d.addEventListener === _0x21577b.xzbKi;
        } else {
            _0x5cb462 = _0x21577b.ZvsPV(_0x1dfae5, _0x5cb462, ..._0x2dca11);
        }
    }
    return "" + (_0x21577b.OHdpb(_0x5a1b57?.[0], "/") ? "" : "/") + _0x5a1b57 + (_0x5cb462 === "/" ? "" : "" + (_0x21577b.OHdpb(_0x5a1b57?.at(-1), "/") ? "" : "/") + (_0x5cb462?.[0] === "/" ? _0x5cb462.slice(1) : _0x5cb462));
};
var _0x31e464 = _0x5b59dd => {
    if (_0x5b59dd.charCodeAt(_0x5b59dd.length - 1) !== 63 || !_0x5b59dd.includes(":")) {
        return null;
    }
    const _0x1a6454 = _0x5b59dd.split("/");
    const _0xfef057 = [];
    let _0x20e81c = "";
    _0x1a6454.forEach(_0x4eeaa6 => {
        if (_0x4eeaa6 !== "" && !/\:/.test(_0x4eeaa6)) {
            _0x20e81c += "/" + _0x4eeaa6;
        } else if (/\:/.test(_0x4eeaa6)) {
            if (/\?/.test(_0x4eeaa6)) {
                if (_0xfef057.length === 0 && _0x20e81c === "") {
                    _0xfef057.push("/");
                } else {
                    _0xfef057.push(_0x20e81c);
                }
                const _0x312d92 = _0x4eeaa6.replace("?", "");
                _0x20e81c += "/" + _0x312d92;
                _0xfef057.push(_0x20e81c);
            } else {
                _0x20e81c += "/" + _0x4eeaa6;
            }
        }
    });
    return _0xfef057.filter((_0x53e529, _0x58f82f, _0x2c09ab) => _0x2c09ab.indexOf(_0x53e529) === _0x58f82f);
};
var _0x670992 = _0x10886b => {
    if (!/[%+]/.test(_0x10886b)) {
        return _0x10886b;
    }
    if (_0x10886b.indexOf("+") !== -1) {
        _0x10886b = _0x10886b.replace(/\+/g, " ");
    }
    if (_0x10886b.indexOf("%") !== -1) {
        return _0x32262a(_0x10886b, _0x412c89);
    } else {
        return _0x10886b;
    }
};
var _0x324637 = (_0xa18f43, _0x58f524, _0x732898) => {
    let _0x198269;
    if (!_0x732898 && _0x58f524 && !/[%+]/.test(_0x58f524)) {
        let _0x4e7577 = _0xa18f43.indexOf("?" + _0x58f524, 8);
        if (_0x4e7577 === -1) {
            _0x4e7577 = _0xa18f43.indexOf("&" + _0x58f524, 8);
        }
        while (_0x4e7577 !== -1) {
            const _0x5f1a5e = _0xa18f43.charCodeAt(_0x4e7577 + _0x58f524.length + 1);
            if (_0x5f1a5e === 61) {
                const _0x3afbad = _0x4e7577 + _0x58f524.length + 2;
                const _0x1fcbc4 = _0xa18f43.indexOf("&", _0x3afbad);
                return _0x670992(_0xa18f43.slice(_0x3afbad, _0x1fcbc4 === -1 ? undefined : _0x1fcbc4));
            } else if (_0x5f1a5e == 38 || isNaN(_0x5f1a5e)) {
                return "";
            }
            _0x4e7577 = _0xa18f43.indexOf("&" + _0x58f524, _0x4e7577 + 1);
        }
        _0x198269 = /[%+]/.test(_0xa18f43);
        if (!_0x198269) {
            return undefined;
        }
    }
    const _0x2df974 = {};
    _0x198269 ??= /[%+]/.test(_0xa18f43);
    let _0x4dc1bf = _0xa18f43.indexOf("?", 8);
    while (_0x4dc1bf !== -1) {
        const _0x22b993 = _0xa18f43.indexOf("&", _0x4dc1bf + 1);
        let _0xf077a5 = _0xa18f43.indexOf("=", _0x4dc1bf);
        if (_0xf077a5 > _0x22b993 && _0x22b993 !== -1) {
            _0xf077a5 = -1;
        }
        let _0x318e22 = _0xa18f43.slice(_0x4dc1bf + 1, _0xf077a5 === -1 ? _0x22b993 === -1 ? undefined : _0x22b993 : _0xf077a5);
        if (_0x198269) {
            _0x318e22 = _0x670992(_0x318e22);
        }
        _0x4dc1bf = _0x22b993;
        if (_0x318e22 === "") {
            continue;
        }
        let _0x174b9b;
        if (_0xf077a5 === -1) {
            _0x174b9b = "";
        } else {
            _0x174b9b = _0xa18f43.slice(_0xf077a5 + 1, _0x22b993 === -1 ? undefined : _0x22b993);
            if (_0x198269) {
                _0x174b9b = _0x670992(_0x174b9b);
            }
        }
        if (_0x732898) {
            if (!_0x2df974[_0x318e22] || !Array.isArray(_0x2df974[_0x318e22])) {
                _0x2df974[_0x318e22] = [];
            }
            ;
            _0x2df974[_0x318e22].push(_0x174b9b);
        } else {
            _0x2df974[_0x318e22] ??= _0x174b9b;
        }
    }
    if (_0x58f524) {
        return _0x2df974[_0x58f524];
    } else {
        return _0x2df974;
    }
};
var _0x2d234f = _0x324637;
var _0x555421 = (_0x2178d2, _0x1e601f) => {
    return _0x324637(_0x2178d2, _0x1e601f, true);
};
var _0x412c89 = decodeURIComponent;
var _0x37c161 = _0x361843 => _0x32262a(_0x361843, _0x412c89);
var _0xe80619 = class {
    raw;
    #validatedData;
    #matchResult;
    routeIndex = 0;
    path;
    bodyCache = {};
    constructor(_0x409db7, _0x2463ad = "/", _0x92571d = [[]]) {
        this.raw = _0x409db7;
        this.path = _0x2463ad;
        this.#matchResult = _0x92571d;
        this.#validatedData = {};
    }
    param(_0x4c464c) {
        if (_0x4c464c) {
            return this.#getDecodedParam(_0x4c464c);
        } else {
            return this.#getAllDecodedParams();
        }
    }
    #getDecodedParam(_0x44b3dd) {
        const _0xa51855 = this.#matchResult[0][this.routeIndex][1][_0x44b3dd];
        const _0x37c612 = this.#getParamValue(_0xa51855);
        if (_0x37c612) {
            if (/\%/.test(_0x37c612)) {
                return _0x37c161(_0x37c612);
            } else {
                return _0x37c612;
            }
        } else {
            return undefined;
        }
    }
    #getAllDecodedParams() {
        const _0x3ed539 = {};
        const _0x5f26c0 = Object.keys(this.#matchResult[0][this.routeIndex][1]);
        for (const _0x29517c of _0x5f26c0) {
            const _0x52d0ca = this.#getParamValue(this.#matchResult[0][this.routeIndex][1][_0x29517c]);
            if (_0x52d0ca && typeof _0x52d0ca === "string") {
                _0x3ed539[_0x29517c] = /\%/.test(_0x52d0ca) ? _0x37c161(_0x52d0ca) : _0x52d0ca;
            }
        }
        return _0x3ed539;
    }
    #getParamValue(_0x52a8b4) {
        if (this.#matchResult[1]) {
            return this.#matchResult[1][_0x52a8b4];
        } else {
            return _0x52a8b4;
        }
    }
    query(_0xe5b614) {
        return _0x2d234f(this.url, _0xe5b614);
    }
    queries(_0x5bbe3a) {
        return _0x555421(this.url, _0x5bbe3a);
    }
    header(_0x1cc8f7) {
        if (_0x1cc8f7) {
            return this.raw.headers.get(_0x1cc8f7) ?? undefined;
        }
        const _0x2d4065 = {};
        this.raw.headers.forEach((_0x3150df, _0x2c30e9) => {
            _0x2d4065[_0x2c30e9] = _0x3150df;
        });
        return _0x2d4065;
    }
    async parseBody(_0xd91412) {
        return this.bodyCache.parsedBody ??= await _0x76d674(this, _0xd91412);
    }
    #cachedBody = _0x43b496 => {
        const {
            bodyCache: _0x4609d4,
            raw: _0x576990
        } = this;
        const _0x2721df = _0x4609d4[_0x43b496];
        if (_0x2721df) {
            return _0x2721df;
        }
        const _0x8fa069 = Object.keys(_0x4609d4)[0];
        if (_0x8fa069) {
            return _0x4609d4[_0x8fa069].then(_0x2f0760 => {
                if (_0x8fa069 === "json") {
                    _0x2f0760 = JSON.stringify(_0x2f0760);
                }
                return new Response(_0x2f0760)[_0x43b496]();
            });
        }
        return _0x4609d4[_0x43b496] = _0x576990[_0x43b496]();
    };
    json() {
        return this.#cachedBody("text").then(_0x21be72 => JSON.parse(_0x21be72));
    }
    text() {
        return this.#cachedBody("text");
    }
    arrayBuffer() {
        return this.#cachedBody("arrayBuffer");
    }
    blob() {
        return this.#cachedBody("blob");
    }
    formData() {
        return this.#cachedBody("formData");
    }
    addValidatedData(_0x30166a, _0x40f88d) {
        this.#validatedData[_0x30166a] = _0x40f88d;
    }
    valid(_0x4e058e) {
        return this.#validatedData[_0x4e058e];
    }
    get url() {
        return this.raw.url;
    }
    get method() {
        return this.raw.method;
    }
    get [_0x111db6]() {
        return this.#matchResult;
    }
    get matchedRoutes() {
        return this.#matchResult[0].map(([[, _0x41cc42]]) => _0x41cc42);
    }
    get routePath() {
        return this.#matchResult[0].map(([[, _0x5c195e]]) => _0x5c195e)[this.routeIndex].path;
    }
};
var _0x9fa4c2 = (_0x41f8a1, _0x50f474) => {
    const _0x20c750 = new String(_0x41f8a1);
    _0x20c750.isEscaped = true;
    _0x20c750.callbacks = _0x50f474;
    return _0x20c750;
};
var _0x3be37e = async (_0x4a4675, _0x5eb67c, _0x37bfab, _0x4eaf8a, _0x2946ed) => {
    if (typeof _0x4a4675 === "object" && !(_0x4a4675 instanceof String)) {
        if (!(_0x4a4675 instanceof Promise)) {
            _0x4a4675 = _0x4a4675.toString();
        }
        if (_0x4a4675 instanceof Promise) {
            _0x4a4675 = await _0x4a4675;
        }
    }
    const _0x1184b2 = _0x4a4675.callbacks;
    if (!_0x1184b2?.length) {
        return Promise.resolve(_0x4a4675);
    }
    if (_0x2946ed) {
        _0x2946ed[0] += _0x4a4675;
    } else {
        _0x2946ed = [_0x4a4675];
    }
    const _0x436806 = Promise.all(_0x1184b2.map(_0x48a667 => _0x48a667({
        phase: _0x5eb67c,
        buffer: _0x2946ed,
        context: _0x4eaf8a
    }))).then(_0x17af44 => Promise.all(_0x17af44.filter(Boolean).map(_0x520075 => _0x3be37e(_0x520075, _0x5eb67c, false, _0x4eaf8a, _0x2946ed))).then(() => _0x2946ed[0]));
    if (_0x37bfab) {
        return _0x9fa4c2(await _0x436806, _0x1184b2);
    } else {
        return _0x436806;
    }
};
var _0x4fbb93 = "text/plain; charset=UTF-8";
var _0x4dc944 = (_0x4dd8d8, _0x4aa075) => {
    return {
        "Content-Type": _0x4dd8d8,
        ..._0x4aa075
    };
};
var _0x3e8716 = class {
    #rawRequest;
    #req;
    env = {};
    #var;
    finalized = false;
    error;
    #status;
    #executionCtx;
    #res;
    #layout;
    #renderer;
    #notFoundHandler;
    #preparedHeaders;
    #matchResult;
    #path;
    constructor(_0x2a25ce, _0x17a2bb) {
        this.#rawRequest = _0x2a25ce;
        if (_0x17a2bb) {
            this.#executionCtx = _0x17a2bb.executionCtx;
            this.env = _0x17a2bb.env;
            this.#notFoundHandler = _0x17a2bb.notFoundHandler;
            this.#path = _0x17a2bb.path;
            this.#matchResult = _0x17a2bb.matchResult;
        }
    }
    get req() {
        this.#req ??= new _0xe80619(this.#rawRequest, this.#path, this.#matchResult);
        return this.#req;
    }
    get event() {
        if (this.#executionCtx && "respondWith" in this.#executionCtx) {
            return this.#executionCtx;
        } else {
            throw Error("This context has no FetchEvent");
        }
    }
    get executionCtx() {
        if (this.#executionCtx) {
            return this.#executionCtx;
        } else {
            throw Error("This context has no ExecutionContext");
        }
    }
    get res() {
        return this.#res ||= new Response(null, {
            headers: this.#preparedHeaders ??= new Headers()
        });
    }
    set res(_0x27b273) {
        if (this.#res && _0x27b273) {
            _0x27b273 = new Response(_0x27b273.body, _0x27b273);
            for (const [_0x701cae, _0x5ac213] of this.#res.headers.entries()) {
                if (_0x701cae === "content-type") {
                    continue;
                }
                if (_0x701cae === "set-cookie") {
                    const _0x3287a9 = this.#res.headers.getSetCookie();
                    _0x27b273.headers.delete("set-cookie");
                    for (const _0x42a982 of _0x3287a9) {
                        _0x27b273.headers.append("set-cookie", _0x42a982);
                    }
                } else {
                    _0x27b273.headers.set(_0x701cae, _0x5ac213);
                }
            }
        }
        this.#res = _0x27b273;
        this.finalized = true;
    }
    render = (..._0x2540a7) => {
        this.#renderer ??= _0x276c65 => this.html(_0x276c65);
        return this.#renderer(..._0x2540a7);
    };
    setLayout = _0x171883 => this.#layout = _0x171883;
    getLayout = () => this.#layout;
    setRenderer = _0x594366 => {
        this.#renderer = _0x594366;
    };
    header = (_0x25e43b, _0x27df7c, _0x3ab051) => {
        if (this.finalized) {
            this.#res = new Response(this.#res.body, this.#res);
        }
        const _0x5dcbd1 = this.#res ? this.#res.headers : this.#preparedHeaders ??= new Headers();
        if (_0x27df7c === undefined) {
            _0x5dcbd1.delete(_0x25e43b);
        } else if (_0x3ab051?.append) {
            _0x5dcbd1.append(_0x25e43b, _0x27df7c);
        } else {
            _0x5dcbd1.set(_0x25e43b, _0x27df7c);
        }
    };
    status = _0x4d0432 => {
        this.#status = _0x4d0432;
    };
    set = (_0x85e50c, _0x4f1a20) => {
        this.#var ??= new Map();
        this.#var.set(_0x85e50c, _0x4f1a20);
    };
    get = _0x5cd43b => {
        if (this.#var) {
            return this.#var.get(_0x5cd43b);
        } else {
            return undefined;
        }
    };
    get var() {
        if (!this.#var) {
            return {};
        }
        return Object.fromEntries(this.#var);
    }
    #newResponse(_0x11fc86, _0x28f0e2, _0x6db9fa) {
        const _0x4e60d2 = this.#res ? new Headers(this.#res.headers) : this.#preparedHeaders ?? new Headers();
        if (typeof _0x28f0e2 === "object" && "headers" in _0x28f0e2) {
            const _0x31a88f = _0x28f0e2.headers instanceof Headers ? _0x28f0e2.headers : new Headers(_0x28f0e2.headers);
            for (const [_0x36fd50, _0x2aa68d] of _0x31a88f) {
                if (_0x36fd50.toLowerCase() === "set-cookie") {
                    _0x4e60d2.append(_0x36fd50, _0x2aa68d);
                } else {
                    _0x4e60d2.set(_0x36fd50, _0x2aa68d);
                }
            }
        }
        if (_0x6db9fa) {
            for (const [_0x11691f, _0x339bfe] of Object.entries(_0x6db9fa)) {
                if (typeof _0x339bfe === "string") {
                    _0x4e60d2.set(_0x11691f, _0x339bfe);
                } else {
                    _0x4e60d2.delete(_0x11691f);
                    for (const _0x129315 of _0x339bfe) {
                        _0x4e60d2.append(_0x11691f, _0x129315);
                    }
                }
            }
        }
        const _0x16c8af = typeof _0x28f0e2 === "number" ? _0x28f0e2 : _0x28f0e2?.status ?? this.#status;
        return new Response(_0x11fc86, {
            status: _0x16c8af,
            headers: _0x4e60d2
        });
    }
    newResponse = (..._0x255776) => this.#newResponse(..._0x255776);
    body = (_0x257c3d, _0x424c5f, _0x2c76b4) => this.#newResponse(_0x257c3d, _0x424c5f, _0x2c76b4);
    text = (_0x74b9eb, _0x22e15c, _0x2136ec) => {
        if (!this.#preparedHeaders && !this.#status && !_0x22e15c && !_0x2136ec && !this.finalized) {
            return new Response(_0x74b9eb);
        } else {
            return this.#newResponse(_0x74b9eb, _0x22e15c, _0x4dc944(_0x4fbb93, _0x2136ec));
        }
    };
    json = (_0x43a75e, _0x2a4cbe, _0x4f1b50) => {
        return this.#newResponse(JSON.stringify(_0x43a75e), _0x2a4cbe, _0x4dc944("application/json", _0x4f1b50));
    };
    html = (_0x299d42, _0x322e88, _0x22d719) => {
        const _0x5f2a44 = _0xa46f9b => this.#newResponse(_0xa46f9b, _0x322e88, _0x4dc944("text/html; charset=UTF-8", _0x22d719));
        if (typeof _0x299d42 === "object") {
            return _0x3be37e(_0x299d42, 1, false, {}).then(_0x5f2a44);
        } else {
            return _0x5f2a44(_0x299d42);
        }
    };
    redirect = (_0x15a3a8, _0x3d5890) => {
        this.header("Location", String(_0x15a3a8));
        return this.newResponse(null, _0x3d5890 ?? 302);
    };
    notFound = () => {
        this.#notFoundHandler ??= () => new Response();
        return this.#notFoundHandler(this);
    };
};
var _0x534fc7 = "ALL";
var _0x55cdc2 = "all";
var _0x319cee = ["get", "post", "put", "delete", "options", "patch"];
var _0x3c47d5 = "Can not add a route since the matcher is already built.";
var _0x821032 = class extends Error {};
var _0x51cebb = "__COMPOSED_HANDLER";
var _0x2d3ba2 = _0x5885d0 => {
    return _0x5885d0.text("404 Not Found", 404);
};
var _0x51e6e7 = (_0x546f67, _0x1427fc) => {
    if ("getResponse" in _0x546f67) {
        const _0x2be4fc = _0x546f67.getResponse();
        return _0x1427fc.newResponse(_0x2be4fc.body, _0x2be4fc);
    }
    console.error(_0x546f67);
    return _0x1427fc.text("Internal Server Error", 500);
};
var _0x1dea9b = class {
    get;
    post;
    put;
    delete;
    options;
    patch;
    all;
    on;
    use;
    router;
    getPath;
    _basePath = "/";
    #path = "/";
    routes = [];
    constructor(_0x222bc8 = {}) {
        const _0x286c54 = [..._0x319cee, _0x55cdc2];
        _0x286c54.forEach(_0x2e092c => {
            this[_0x2e092c] = (_0x258b74, ..._0x2d2512) => {
                if (typeof _0x258b74 === "string") {
                    this.#path = _0x258b74;
                } else {
                    this.#addRoute(_0x2e092c, this.#path, _0x258b74);
                }
                _0x2d2512.forEach(_0xc5efe0 => {
                    this.#addRoute(_0x2e092c, this.#path, _0xc5efe0);
                });
                return this;
            };
        });
        this.on = (_0x123f71, _0x10c7c8, ..._0x37d6d4) => {
            for (const _0x409430 of [_0x10c7c8].flat()) {
                this.#path = _0x409430;
                for (const _0xd656af of [_0x123f71].flat()) {
                    _0x37d6d4.map(_0x5acbe7 => {
                        this.#addRoute(_0xd656af.toUpperCase(), this.#path, _0x5acbe7);
                    });
                }
            }
            return this;
        };
        this.use = (_0x18b703, ..._0x52abb4) => {
            if (typeof _0x18b703 === "string") {
                this.#path = _0x18b703;
            } else {
                this.#path = "*";
                _0x52abb4.unshift(_0x18b703);
            }
            _0x52abb4.forEach(_0x21492e => {
                this.#addRoute(_0x534fc7, this.#path, _0x21492e);
            });
            return this;
        };
        const {
            strict: _0x44d893,
            ..._0x52df61
        } = _0x222bc8;
        Object.assign(this, _0x52df61);
        this.getPath = _0x44d893 ?? true ? _0x222bc8.getPath ?? _0x180297 : _0x153c85;
    }
    #clone() {
        const _0x385b48 = new _0x1dea9b({
            router: this.router,
            getPath: this.getPath
        });
        _0x385b48.errorHandler = this.errorHandler;
        _0x385b48.#notFoundHandler = this.#notFoundHandler;
        _0x385b48.routes = this.routes;
        return _0x385b48;
    }
    #notFoundHandler = _0x2d3ba2;
    errorHandler = _0x51e6e7;
    route(_0x32922c, _0x551651) {
        const _0x14c62e = this.basePath(_0x32922c);
        _0x551651.routes.map(_0x72d4f9 => {
            let _0x1c835b;
            if (_0x551651.errorHandler === _0x51e6e7) {
                _0x1c835b = _0x72d4f9.handler;
            } else {
                _0x1c835b = async (_0x4c3a5c, _0x2f996f) => (await _0x3d28e0([], _0x551651.errorHandler)(_0x4c3a5c, () => _0x72d4f9.handler(_0x4c3a5c, _0x2f996f))).res;
                _0x1c835b[_0x51cebb] = _0x72d4f9.handler;
            }
            _0x14c62e.#addRoute(_0x72d4f9.method, _0x72d4f9.path, _0x1c835b);
        });
        return this;
    }
    basePath(_0x1cc500) {
        const _0x41b8bf = this.#clone();
        _0x41b8bf._basePath = _0x1dfae5(this._basePath, _0x1cc500);
        return _0x41b8bf;
    }
    onError = _0x17e1ee => {
        this.errorHandler = _0x17e1ee;
        return this;
    };
    notFound = _0x1b06cb => {
        this.#notFoundHandler = _0x1b06cb;
        return this;
    };
    mount(_0x40b05e, _0xc7b969, _0x16bbec) {
        const _0x19408a = {
            VjSwy: function (_0x25f817, _0x182349) {
                return _0x25f817 === _0x182349;
            },
            rYVXk: function (_0x55d2ac, _0x4fa889) {
                return _0x55d2ac(_0x4fa889);
            },
            pdkVb: function (_0x57fadd, _0x24c221) {
                return _0x57fadd !== _0x24c221;
            },
            fqiRp: "beQFs",
            AnrEb: "iPLEz",
            BrNSA: function (_0x2ed4fd, _0x152e70, _0x5698dd) {
                return _0x2ed4fd(_0x152e70, _0x5698dd);
            },
            ZNTSZ: function (_0x28d642, _0xddecf0) {
                return _0x28d642 === _0xddecf0;
            },
            IDbZc: function (_0x341500, _0x5b1d64, ..._0x3eafba) {
                return _0x341500(_0x5b1d64, ..._0x3eafba);
            },
            eqnVh: function (_0x9ca82f, _0x39f8ad) {
                return _0x9ca82f(_0x39f8ad);
            },
            mcDmp: function (_0x66d44e, _0x2e8ea1) {
                return _0x66d44e(_0x2e8ea1);
            },
            QNglF: function (_0x56a525, _0x3bee01) {
                return _0x56a525 === _0x3bee01;
            },
            xEnRG: "function",
            bKmZK: "rdNlA"
        };
        let _0x5cf6c5;
        let _0x24936d;
        if (_0x16bbec) {
            if (_0x19408a.QNglF(typeof _0x16bbec, _0x19408a.xEnRG)) {
                if (_0x19408a.VjSwy(_0x19408a.bKmZK, _0x19408a.bKmZK)) {
                    _0x24936d = _0x16bbec;
                } else {
                    _0x637d88[_0x2a9ef2] = [_0x1fdc25[_0x2ede4e], _0x5e2f26];
                }
            } else {
                _0x24936d = _0x16bbec.optionHandler;
                if (_0x19408a.QNglF(_0x16bbec.replaceRequest, false)) {
                    _0x5cf6c5 = _0x512bca => _0x512bca;
                } else {
                    _0x5cf6c5 = _0x16bbec.replaceRequest;
                }
            }
        }
        const _0x1587b2 = _0x24936d ? _0xeffc83 => {
            if (_0x19408a.VjSwy("IMMJD", "IMMJD")) {
                const _0x5f47c3 = _0x19408a.rYVXk(_0x24936d, _0xeffc83);
                if (Array.isArray(_0x5f47c3)) {
                    return _0x5f47c3;
                } else {
                    return [_0x5f47c3];
                }
            } else {
                _0x2b6d1f.push(_0x16b76a.value);
            }
        } : _0x28adb6 => {
            let _0x5f23c6 = undefined;
            try {
                if (_0x19408a.pdkVb(_0x19408a.fqiRp, _0x19408a.AnrEb)) {
                    _0x5f23c6 = _0x28adb6.executionCtx;
                } else if (_0x416865.isArray(_0x438e47[_0x579f59])) {
                    ;
                    _0x444fe8[_0x80bc29].push(_0x360970);
                } else {
                    _0x3352a6[_0x1faae1] = [_0x444663[_0xcf355a], _0xc3a54a];
                }
            } catch {}
            return [_0x28adb6.env, _0x5f23c6];
        };
        _0x5cf6c5 ||= (() => {
            const _0x195e9a = _0x19408a.BrNSA(_0x1dfae5, this._basePath, _0x40b05e);
            const _0x3646c4 = _0x19408a.ZNTSZ(_0x195e9a, "/") ? 0 : _0x195e9a.length;
            return _0x1d5495 => {
                const _0x3a1767 = new URL(_0x1d5495.url);
                _0x3a1767.pathname = _0x3a1767.pathname.slice(_0x3646c4) || "/";
                return new Request(_0x3a1767, _0x1d5495);
            };
        })();
        const _0x4091fa = async (_0x25eb72, _0x412142) => {
            if (_0x19408a.pdkVb("EUOqf", "EUOqf")) {
                _0x2f61a2 = -1;
            } else {
                const _0x4a9b3d = await _0x19408a.IDbZc(_0xc7b969, _0x19408a.eqnVh(_0x5cf6c5, _0x25eb72.req.raw), ..._0x19408a.mcDmp(_0x1587b2, _0x25eb72));
                if (_0x4a9b3d) {
                    return _0x4a9b3d;
                }
                await _0x412142();
            }
        };
        this.#addRoute(_0x534fc7, _0x19408a.IDbZc(_0x1dfae5, _0x40b05e, "*"), _0x4091fa);
        return this;
    }
    #addRoute(_0x2d4a78, _0xd18cd7, _0x1ea28c) {
        _0x2d4a78 = _0x2d4a78.toUpperCase();
        _0xd18cd7 = _0x1dfae5(this._basePath, _0xd18cd7);
        const _0x193548 = {
            basePath: this._basePath,
            path: _0xd18cd7,
            method: _0x2d4a78,
            handler: _0x1ea28c
        };
        this.router.add(_0x2d4a78, _0xd18cd7, [_0x1ea28c, _0x193548]);
        this.routes.push(_0x193548);
    }
    #handleError(_0x337ff1, _0x29742e) {
        if (_0x337ff1 instanceof Error) {
            return this.errorHandler(_0x337ff1, _0x29742e);
        }
        throw _0x337ff1;
    }
    #dispatch(_0x3d694e, _0x112e74, _0x5d266e, _0x15752c) {
        if (_0x15752c === "HEAD") {
            return (async () => new Response(null, await this.#dispatch(_0x3d694e, _0x112e74, _0x5d266e, "GET")))();
        }
        const _0x1f10c3 = this.getPath(_0x3d694e, {
            env: _0x5d266e
        });
        const _0x35773f = this.router.match(_0x15752c, _0x1f10c3);
        const _0x98bdfb = new _0x3e8716(_0x3d694e, {
            path: _0x1f10c3,
            matchResult: _0x35773f,
            env: _0x5d266e,
            executionCtx: _0x112e74,
            notFoundHandler: this.#notFoundHandler
        });
        if (_0x35773f[0].length === 1) {
            let _0x522055;
            try {
                _0x522055 = _0x35773f[0][0][0][0](_0x98bdfb, async () => {
                    _0x98bdfb.res = await this.#notFoundHandler(_0x98bdfb);
                });
            } catch (_0x31a190) {
                return this.#handleError(_0x31a190, _0x98bdfb);
            }
            if (_0x522055 instanceof Promise) {
                return _0x522055.then(_0x937237 => _0x937237 || (_0x98bdfb.finalized ? _0x98bdfb.res : this.#notFoundHandler(_0x98bdfb))).catch(_0x1f368f => this.#handleError(_0x1f368f, _0x98bdfb));
            } else {
                return _0x522055 ?? this.#notFoundHandler(_0x98bdfb);
            }
        }
        const _0x2c572f = _0x3d28e0(_0x35773f[0], this.errorHandler, this.#notFoundHandler);
        return (async () => {
            try {
                const _0x289adb = await _0x2c572f(_0x98bdfb);
                if (!_0x289adb.finalized) {
                    throw new Error("Context is not finalized. Did you forget to return a Response object or `await next()`?");
                }
                return _0x289adb.res;
            } catch (_0x318074) {
                return this.#handleError(_0x318074, _0x98bdfb);
            }
        })();
    }
    fetch = (_0x3b4641, ..._0x4434b4) => {
        return this.#dispatch(_0x3b4641, _0x4434b4[1], _0x4434b4[0], _0x3b4641.method);
    };
    request = (_0x14d2d6, _0x46a97e, _0x273179, _0x2530a9) => {
        if (_0x14d2d6 instanceof Request) {
            return this.fetch(_0x46a97e ? new Request(_0x14d2d6, _0x46a97e) : _0x14d2d6, _0x273179, _0x2530a9);
        }
        _0x14d2d6 = _0x14d2d6.toString();
        return this.fetch(new Request(/^https?:\/\//.test(_0x14d2d6) ? _0x14d2d6 : "http://localhost" + _0x1dfae5("/", _0x14d2d6), _0x46a97e), _0x273179, _0x2530a9);
    };
    fire = () => {
        addEventListener("fetch", _0x4391e3 => {
            _0x4391e3.respondWith(this.#dispatch(_0x4391e3.request, _0x4391e3, undefined, _0x4391e3.request.method));
        });
    };
};
var _0x436b05 = "[^/]+";
var _0x53b3ac = ".*";
var _0x4d8d0e = "(?:|/.*)";
var _0x56e32e = Symbol();
var _0x1fb4b4 = new Set(".\\+*[^]$()");
function _0x3fbc32(_0x22d16c, _0x5efad4) {
    if (_0x22d16c.length === 1) {
        if (_0x5efad4.length === 1) {
            if (_0x22d16c < _0x5efad4) {
                return -1;
            } else {
                return 1;
            }
        } else {
            return -1;
        }
    }
    if (_0x5efad4.length === 1) {
        return 1;
    }
    if (_0x22d16c === _0x53b3ac || _0x22d16c === _0x4d8d0e) {
        return 1;
    } else if (_0x5efad4 === _0x53b3ac || _0x5efad4 === _0x4d8d0e) {
        return -1;
    }
    if (_0x22d16c === _0x436b05) {
        return 1;
    } else if (_0x5efad4 === _0x436b05) {
        return -1;
    }
    if (_0x22d16c.length === _0x5efad4.length) {
        if (_0x22d16c < _0x5efad4) {
            return -1;
        } else {
            return 1;
        }
    } else {
        return _0x5efad4.length - _0x22d16c.length;
    }
}
var _0x56d004 = class {
    #index;
    #varIndex;
    #children = Object.create(null);
    insert(_0x674dfb, _0x11b4a8, _0x44844f, _0x3dc609, _0x39598b) {
        if (_0x674dfb.length === 0) {
            if (this.#index !== undefined) {
                throw _0x56e32e;
            }
            if (_0x39598b) {
                return;
            }
            this.#index = _0x11b4a8;
            return;
        }
        const [_0x1e1472, ..._0x5606b3] = _0x674dfb;
        const _0x1759d0 = _0x1e1472 === "*" ? _0x5606b3.length === 0 ? ["", "", _0x53b3ac] : ["", "", _0x436b05] : _0x1e1472 === "/*" ? ["", "", _0x4d8d0e] : _0x1e1472.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
        let _0x2667fc;
        if (_0x1759d0) {
            const _0x1d2cf3 = _0x1759d0[1];
            let _0x21b0d8 = _0x1759d0[2] || _0x436b05;
            if (_0x1d2cf3 && _0x1759d0[2]) {
                _0x21b0d8 = _0x21b0d8.replace(/^\((?!\?:)(?=[^)]+\)$)/, "(?:");
                if (/\((?!\?:)/.test(_0x21b0d8)) {
                    throw _0x56e32e;
                }
            }
            _0x2667fc = this.#children[_0x21b0d8];
            if (!_0x2667fc) {
                if (Object.keys(this.#children).some(_0x5569e3 => _0x5569e3 !== _0x53b3ac && _0x5569e3 !== _0x4d8d0e)) {
                    throw _0x56e32e;
                }
                if (_0x39598b) {
                    return;
                }
                _0x2667fc = this.#children[_0x21b0d8] = new _0x56d004();
                if (_0x1d2cf3 !== "") {
                    _0x2667fc.#varIndex = _0x3dc609.varIndex++;
                }
            }
            if (!_0x39598b && _0x1d2cf3 !== "") {
                _0x44844f.push([_0x1d2cf3, _0x2667fc.#varIndex]);
            }
        } else {
            _0x2667fc = this.#children[_0x1e1472];
            if (!_0x2667fc) {
                if (Object.keys(this.#children).some(_0x59b195 => _0x59b195.length > 1 && _0x59b195 !== _0x53b3ac && _0x59b195 !== _0x4d8d0e)) {
                    throw _0x56e32e;
                }
                if (_0x39598b) {
                    return;
                }
                _0x2667fc = this.#children[_0x1e1472] = new _0x56d004();
            }
        }
        _0x2667fc.insert(_0x5606b3, _0x11b4a8, _0x44844f, _0x3dc609, _0x39598b);
    }
    buildRegExpStr() {
        const _0x1d7caf = Object.keys(this.#children).sort(_0x3fbc32);
        const _0x1c375e = _0x1d7caf.map(_0x57e5af => {
            const _0x4e15cd = this.#children[_0x57e5af];
            return (typeof _0x4e15cd.#varIndex === "number" ? "(" + _0x57e5af + ")@" + _0x4e15cd.#varIndex : _0x1fb4b4.has(_0x57e5af) ? "\\" + _0x57e5af : _0x57e5af) + _0x4e15cd.buildRegExpStr();
        });
        if (typeof this.#index === "number") {
            _0x1c375e.unshift("#" + this.#index);
        }
        if (_0x1c375e.length === 0) {
            return "";
        }
        if (_0x1c375e.length === 1) {
            return _0x1c375e[0];
        }
        return "(?:" + _0x1c375e.join("|") + ")";
    }
};
var _0x1daf4e = class {
    #context = {
        varIndex: 0
    };
    #root = new _0x56d004();
    insert(_0x478185, _0x9b2428, _0x30d905) {
        const _0x3a3d75 = [];
        const _0x327497 = [];
        for (let _0xb340b3 = 0;;) {
            let _0x33b889 = false;
            _0x478185 = _0x478185.replace(/\{[^}]+\}/g, _0x27d40d => {
                const _0x5ea738 = "@\\" + _0xb340b3;
                _0x327497[_0xb340b3] = [_0x5ea738, _0x27d40d];
                _0xb340b3++;
                _0x33b889 = true;
                return _0x5ea738;
            });
            if (!_0x33b889) {
                break;
            }
        }
        const _0x136756 = _0x478185.match(/(?::[^\/]+)|(?:\/\*$)|./g) || [];
        for (let _0x35520d = _0x327497.length - 1; _0x35520d >= 0; _0x35520d--) {
            const [_0x4bb835] = _0x327497[_0x35520d];
            for (let _0x5ce683 = _0x136756.length - 1; _0x5ce683 >= 0; _0x5ce683--) {
                if (_0x136756[_0x5ce683].indexOf(_0x4bb835) !== -1) {
                    _0x136756[_0x5ce683] = _0x136756[_0x5ce683].replace(_0x4bb835, _0x327497[_0x35520d][1]);
                    break;
                }
            }
        }
        this.#root.insert(_0x136756, _0x9b2428, _0x3a3d75, this.#context, _0x30d905);
        return _0x3a3d75;
    }
    buildRegExp() {
        let _0x2c4f1a = this.#root.buildRegExpStr();
        if (_0x2c4f1a === "") {
            return [/^$/, [], []];
        }
        let _0xa42e5c = 0;
        const _0x464ba5 = [];
        const _0x564d5 = [];
        _0x2c4f1a = _0x2c4f1a.replace(/#(\d+)|@(\d+)|\.\*\$/g, (_0x2819b8, _0x4efadd, _0x16f66c) => {
            if (_0x4efadd !== undefined) {
                _0x464ba5[++_0xa42e5c] = Number(_0x4efadd);
                return "$()";
            }
            if (_0x16f66c !== undefined) {
                _0x564d5[Number(_0x16f66c)] = ++_0xa42e5c;
                return "";
            }
            return "";
        });
        return [new RegExp("^" + _0x2c4f1a), _0x464ba5, _0x564d5];
    }
};
var _0x1990e5 = [];
var _0x15c669 = [/^$/, [], Object.create(null)];
var _0x38c37f = Object.create(null);
function _0x58e6f8(_0xfdf87c) {
    return _0x38c37f[_0xfdf87c] ??= new RegExp(_0xfdf87c === "*" ? "" : "^" + _0xfdf87c.replace(/\/\*$|([.\\+*[^\]$()])/g, (_0x5357f6, _0x33f951) => _0x33f951 ? "\\" + _0x33f951 : "(?:|/.*)") + "$");
}
function _0x43d067() {
    _0x38c37f = Object.create(null);
}
function _0x2345db(_0x318138) {
    const _0x27dd1b = new _0x1daf4e();
    const _0x161405 = [];
    if (_0x318138.length === 0) {
        return _0x15c669;
    }
    const _0x35c922 = _0x318138.map(_0x1b1a95 => [!/\*|\/:/.test(_0x1b1a95[0]), ..._0x1b1a95]).sort(([_0x40b471, _0x1ac1e2], [_0x2d78f0, _0x5218c5]) => _0x40b471 ? 1 : _0x2d78f0 ? -1 : _0x1ac1e2.length - _0x5218c5.length);
    const _0x4377fe = Object.create(null);
    for (let _0x527a5d = 0, _0xbabd74 = -1, _0x221cd1 = _0x35c922.length; _0x527a5d < _0x221cd1; _0x527a5d++) {
        const [_0x10e46c, _0x3768fd, _0x1d7b57] = _0x35c922[_0x527a5d];
        if (_0x10e46c) {
            _0x4377fe[_0x3768fd] = [_0x1d7b57.map(([_0x4caf9b]) => [_0x4caf9b, Object.create(null)]), _0x1990e5];
        } else {
            _0xbabd74++;
        }
        let _0x6ddd00;
        try {
            _0x6ddd00 = _0x27dd1b.insert(_0x3768fd, _0xbabd74, _0x10e46c);
        } catch (_0xde79b1) {
            throw _0xde79b1 === _0x56e32e ? new _0x821032(_0x3768fd) : _0xde79b1;
        }
        if (_0x10e46c) {
            continue;
        }
        _0x161405[_0xbabd74] = _0x1d7b57.map(([_0x15d85d, _0x58b14a]) => {
            const _0x2c7c97 = Object.create(null);
            _0x58b14a -= 1;
            for (; _0x58b14a >= 0; _0x58b14a--) {
                const [_0x172cc3, _0x2c19a0] = _0x6ddd00[_0x58b14a];
                _0x2c7c97[_0x172cc3] = _0x2c19a0;
            }
            return [_0x15d85d, _0x2c7c97];
        });
    }
    const [_0x41c4cc, _0x2f8bc9, _0x33a9ed] = _0x27dd1b.buildRegExp();
    for (let _0x4f34f3 = 0, _0x3451db = _0x161405.length; _0x4f34f3 < _0x3451db; _0x4f34f3++) {
        for (let _0x529966 = 0, _0x4f40e2 = _0x161405[_0x4f34f3].length; _0x529966 < _0x4f40e2; _0x529966++) {
            const _0x1cd2aa = _0x161405[_0x4f34f3][_0x529966]?.[1];
            if (!_0x1cd2aa) {
                continue;
            }
            const _0x11c1d9 = Object.keys(_0x1cd2aa);
            for (let _0x24a589 = 0, _0x37db82 = _0x11c1d9.length; _0x24a589 < _0x37db82; _0x24a589++) {
                _0x1cd2aa[_0x11c1d9[_0x24a589]] = _0x33a9ed[_0x1cd2aa[_0x11c1d9[_0x24a589]]];
            }
        }
    }
    const _0x382815 = [];
    for (const _0x4c541f in _0x2f8bc9) {
        _0x382815[_0x4c541f] = _0x161405[_0x2f8bc9[_0x4c541f]];
    }
    return [_0x41c4cc, _0x382815, _0x4377fe];
}
function _0x42cee8(_0x34e7b6, _0x15479e) {
    if (!_0x34e7b6) {
        return undefined;
    }
    for (const _0x3812c5 of Object.keys(_0x34e7b6).sort((_0x334243, _0x50fbc7) => _0x50fbc7.length - _0x334243.length)) {
        if (_0x58e6f8(_0x3812c5).test(_0x15479e)) {
            return [..._0x34e7b6[_0x3812c5]];
        }
    }
    return undefined;
}
var _0x49299b = class {
    name = "RegExpRouter";
    #middleware;
    #routes;
    constructor() {
        this.#middleware = {
            [_0x534fc7]: Object.create(null)
        };
        this.#routes = {
            [_0x534fc7]: Object.create(null)
        };
    }
    add(_0x2d2cda, _0x14bda5, _0x50f082) {
        const _0x29d7ce = this.#middleware;
        const _0x2947f2 = this.#routes;
        if (!_0x29d7ce || !_0x2947f2) {
            throw new Error(_0x3c47d5);
        }
        if (!_0x29d7ce[_0x2d2cda]) {
            ;
            [_0x29d7ce, _0x2947f2].forEach(_0xe245c1 => {
                _0xe245c1[_0x2d2cda] = Object.create(null);
                Object.keys(_0xe245c1[_0x534fc7]).forEach(_0x345767 => {
                    _0xe245c1[_0x2d2cda][_0x345767] = [..._0xe245c1[_0x534fc7][_0x345767]];
                });
            });
        }
        if (_0x14bda5 === "/*") {
            _0x14bda5 = "*";
        }
        const _0x5349cf = (_0x14bda5.match(/\/:/g) || []).length;
        if (/\*$/.test(_0x14bda5)) {
            const _0x339a2f = _0x58e6f8(_0x14bda5);
            if (_0x2d2cda === _0x534fc7) {
                Object.keys(_0x29d7ce).forEach(_0x5558e5 => {
                    _0x29d7ce[_0x5558e5][_0x14bda5] ||= _0x42cee8(_0x29d7ce[_0x5558e5], _0x14bda5) || _0x42cee8(_0x29d7ce[_0x534fc7], _0x14bda5) || [];
                });
            } else {
                _0x29d7ce[_0x2d2cda][_0x14bda5] ||= _0x42cee8(_0x29d7ce[_0x2d2cda], _0x14bda5) || _0x42cee8(_0x29d7ce[_0x534fc7], _0x14bda5) || [];
            }
            Object.keys(_0x29d7ce).forEach(_0x2eb19b => {
                if (_0x2d2cda === _0x534fc7 || _0x2d2cda === _0x2eb19b) {
                    Object.keys(_0x29d7ce[_0x2eb19b]).forEach(_0x1d8a38 => {
                        if (_0x339a2f.test(_0x1d8a38)) {
                            _0x29d7ce[_0x2eb19b][_0x1d8a38].push([_0x50f082, _0x5349cf]);
                        }
                    });
                }
            });
            Object.keys(_0x2947f2).forEach(_0x14c750 => {
                if (_0x2d2cda === _0x534fc7 || _0x2d2cda === _0x14c750) {
                    Object.keys(_0x2947f2[_0x14c750]).forEach(_0x3920b6 => _0x339a2f.test(_0x3920b6) && _0x2947f2[_0x14c750][_0x3920b6].push([_0x50f082, _0x5349cf]));
                }
            });
            return;
        }
        const _0x4f2561 = _0x31e464(_0x14bda5) || [_0x14bda5];
        for (let _0x5512b9 = 0, _0x168fb7 = _0x4f2561.length; _0x5512b9 < _0x168fb7; _0x5512b9++) {
            const _0x2f203a = _0x4f2561[_0x5512b9];
            Object.keys(_0x2947f2).forEach(_0x487025 => {
                if (_0x2d2cda === _0x534fc7 || _0x2d2cda === _0x487025) {
                    _0x2947f2[_0x487025][_0x2f203a] ||= [...(_0x42cee8(_0x29d7ce[_0x487025], _0x2f203a) || _0x42cee8(_0x29d7ce[_0x534fc7], _0x2f203a) || [])];
                    _0x2947f2[_0x487025][_0x2f203a].push([_0x50f082, _0x5349cf - _0x168fb7 + _0x5512b9 + 1]);
                }
            });
        }
    }
    match(_0x4f382a, _0x3b1dc9) {
        _0x43d067();
        const _0x24f2c3 = this.#buildAllMatchers();
        this.match = (_0xba6879, _0x2fa45a) => {
            const _0x2b75cf = _0x24f2c3[_0xba6879] || _0x24f2c3[_0x534fc7];
            const _0x3e6b18 = _0x2b75cf[2][_0x2fa45a];
            if (_0x3e6b18) {
                return _0x3e6b18;
            }
            const _0x4b3d04 = _0x2fa45a.match(_0x2b75cf[0]);
            if (!_0x4b3d04) {
                return [[], _0x1990e5];
            }
            const _0x370e4a = _0x4b3d04.indexOf("", 1);
            return [_0x2b75cf[1][_0x370e4a], _0x4b3d04];
        };
        return this.match(_0x4f382a, _0x3b1dc9);
    }
    #buildAllMatchers() {
        const _0x142ae9 = Object.create(null);
        Object.keys(this.#routes).concat(Object.keys(this.#middleware)).forEach(_0x2a5dc0 => {
            _0x142ae9[_0x2a5dc0] ||= this.#buildMatcher(_0x2a5dc0);
        });
        this.#middleware = this.#routes = undefined;
        return _0x142ae9;
    }
    #buildMatcher(_0x20b420) {
        const _0x30b20c = [];
        let _0x5c3b0a = _0x20b420 === _0x534fc7;
        [this.#middleware, this.#routes].forEach(_0x3c37d8 => {
            const _0x25720d = _0x3c37d8[_0x20b420] ? Object.keys(_0x3c37d8[_0x20b420]).map(_0x3b46a5 => [_0x3b46a5, _0x3c37d8[_0x20b420][_0x3b46a5]]) : [];
            if (_0x25720d.length !== 0) {
                _0x5c3b0a ||= true;
                _0x30b20c.push(..._0x25720d);
            } else if (_0x20b420 !== _0x534fc7) {
                _0x30b20c.push(...Object.keys(_0x3c37d8[_0x534fc7]).map(_0x3f1f45 => [_0x3f1f45, _0x3c37d8[_0x534fc7][_0x3f1f45]]));
            }
        });
        if (!_0x5c3b0a) {
            return null;
        } else {
            return _0x2345db(_0x30b20c);
        }
    }
};
var _0x518d85 = class {
    name = "SmartRouter";
    #routers = [];
    #routes = [];
    constructor(_0x1577ec) {
        this.#routers = _0x1577ec.routers;
    }
    add(_0x363583, _0x9d012c, _0x5e7a15) {
        if (!this.#routes) {
            throw new Error(_0x3c47d5);
        }
        this.#routes.push([_0x363583, _0x9d012c, _0x5e7a15]);
    }
    match(_0x3438f9, _0x4251ec) {
        if (!this.#routes) {
            throw new Error("Fatal error");
        }
        const _0x3fa98f = this.#routers;
        const _0x358995 = this.#routes;
        const _0x382ae4 = _0x3fa98f.length;
        let _0x4c6e8f = 0;
        let _0x33e780;
        for (; _0x4c6e8f < _0x382ae4; _0x4c6e8f++) {
            const _0x2d822c = _0x3fa98f[_0x4c6e8f];
            try {
                for (let _0x13371b = 0, _0x56ba44 = _0x358995.length; _0x13371b < _0x56ba44; _0x13371b++) {
                    _0x2d822c.add(..._0x358995[_0x13371b]);
                }
                _0x33e780 = _0x2d822c.match(_0x3438f9, _0x4251ec);
            } catch (_0x1be3ab) {
                if (_0x1be3ab instanceof _0x821032) {
                    continue;
                }
                throw _0x1be3ab;
            }
            this.match = _0x2d822c.match.bind(_0x2d822c);
            this.#routers = [_0x2d822c];
            this.#routes = undefined;
            break;
        }
        if (_0x4c6e8f === _0x382ae4) {
            throw new Error("Fatal error");
        }
        this.name = "SmartRouter + " + this.activeRouter.name;
        return _0x33e780;
    }
    get activeRouter() {
        if (this.#routes || this.#routers.length !== 1) {
            throw new Error("No active router has been determined yet.");
        }
        return this.#routers[0];
    }
};
var _0x3107d8 = Object.create(null);
var _0x4df9fb = class {
    #methods;
    #children;
    #patterns;
    #order = 0;
    #params = _0x3107d8;
    constructor(_0x4be19f, _0x2ce40c, _0x1975af) {
        this.#children = _0x1975af || Object.create(null);
        this.#methods = [];
        if (_0x4be19f && _0x2ce40c) {
            const _0x1c033d = Object.create(null);
            _0x1c033d[_0x4be19f] = {
                handler: _0x2ce40c,
                possibleKeys: [],
                score: 0
            };
            this.#methods = [_0x1c033d];
        }
        this.#patterns = [];
    }
    insert(_0x6ac41d, _0x397f9c, _0x5944ad) {
        this.#order = ++this.#order;
        let _0x256bfd = this;
        const _0xa94f5d = _0x1d1dce(_0x397f9c);
        const _0x409677 = [];
        for (let _0x50824e = 0, _0x320597 = _0xa94f5d.length; _0x50824e < _0x320597; _0x50824e++) {
            const _0x102edd = _0xa94f5d[_0x50824e];
            const _0x2df516 = _0xa94f5d[_0x50824e + 1];
            const _0x57a41e = _0x475cfa(_0x102edd, _0x2df516);
            const _0x42bd36 = Array.isArray(_0x57a41e) ? _0x57a41e[0] : _0x102edd;
            if (_0x42bd36 in _0x256bfd.#children) {
                _0x256bfd = _0x256bfd.#children[_0x42bd36];
                if (_0x57a41e) {
                    _0x409677.push(_0x57a41e[1]);
                }
                continue;
            }
            _0x256bfd.#children[_0x42bd36] = new _0x4df9fb();
            if (_0x57a41e) {
                _0x256bfd.#patterns.push(_0x57a41e);
                _0x409677.push(_0x57a41e[1]);
            }
            _0x256bfd = _0x256bfd.#children[_0x42bd36];
        }
        _0x256bfd.#methods.push({
            [_0x6ac41d]: {
                handler: _0x5944ad,
                possibleKeys: _0x409677.filter((_0x3f1477, _0x2853d5, _0x1b19f4) => _0x1b19f4.indexOf(_0x3f1477) === _0x2853d5),
                score: this.#order
            }
        });
        return _0x256bfd;
    }
    #getHandlerSets(_0x57afff, _0x31c56e, _0x2a2436, _0x35cd74) {
        const _0x82599f = [];
        for (let _0x22d228 = 0, _0x80757c = _0x57afff.#methods.length; _0x22d228 < _0x80757c; _0x22d228++) {
            const _0x4ad336 = _0x57afff.#methods[_0x22d228];
            const _0x39f601 = _0x4ad336[_0x31c56e] || _0x4ad336[_0x534fc7];
            const _0x588551 = {};
            if (_0x39f601 !== undefined) {
                _0x39f601.params = Object.create(null);
                _0x82599f.push(_0x39f601);
                if (_0x2a2436 !== _0x3107d8 || _0x35cd74 && _0x35cd74 !== _0x3107d8) {
                    for (let _0x3e221c = 0, _0x2f3c78 = _0x39f601.possibleKeys.length; _0x3e221c < _0x2f3c78; _0x3e221c++) {
                        const _0x440be6 = _0x39f601.possibleKeys[_0x3e221c];
                        const _0x497cec = _0x588551[_0x39f601.score];
                        _0x39f601.params[_0x440be6] = _0x35cd74?.[_0x440be6] && !_0x497cec ? _0x35cd74[_0x440be6] : _0x2a2436[_0x440be6] ?? _0x35cd74?.[_0x440be6];
                        _0x588551[_0x39f601.score] = true;
                    }
                }
            }
        }
        return _0x82599f;
    }
    search(_0x512197, _0x379502) {
        const _0x425d89 = [];
        this.#params = _0x3107d8;
        const _0x3f73b9 = this;
        let _0x16d555 = [_0x3f73b9];
        const _0x46e114 = _0x367ab4(_0x379502);
        const _0x4673fb = [];
        for (let _0xcbde32 = 0, _0x162cb7 = _0x46e114.length; _0xcbde32 < _0x162cb7; _0xcbde32++) {
            const _0x343c1c = _0x46e114[_0xcbde32];
            const _0x4496f4 = _0xcbde32 === _0x162cb7 - 1;
            const _0x139664 = [];
            for (let _0x248026 = 0, _0x25527f = _0x16d555.length; _0x248026 < _0x25527f; _0x248026++) {
                const _0x476aac = _0x16d555[_0x248026];
                const _0x5b0541 = _0x476aac.#children[_0x343c1c];
                if (_0x5b0541) {
                    _0x5b0541.#params = _0x476aac.#params;
                    if (_0x4496f4) {
                        if (_0x5b0541.#children["*"]) {
                            _0x425d89.push(...this.#getHandlerSets(_0x5b0541.#children["*"], _0x512197, _0x476aac.#params));
                        }
                        _0x425d89.push(...this.#getHandlerSets(_0x5b0541, _0x512197, _0x476aac.#params));
                    } else {
                        _0x139664.push(_0x5b0541);
                    }
                }
                for (let _0x1ce1cd = 0, _0x408f04 = _0x476aac.#patterns.length; _0x1ce1cd < _0x408f04; _0x1ce1cd++) {
                    const _0x12d996 = _0x476aac.#patterns[_0x1ce1cd];
                    const _0x217518 = _0x476aac.#params === _0x3107d8 ? {} : {
                        ..._0x476aac.#params
                    };
                    if (_0x12d996 === "*") {
                        const _0x257b7b = _0x476aac.#children["*"];
                        if (_0x257b7b) {
                            _0x425d89.push(...this.#getHandlerSets(_0x257b7b, _0x512197, _0x476aac.#params));
                            _0x257b7b.#params = _0x217518;
                            _0x139664.push(_0x257b7b);
                        }
                        continue;
                    }
                    if (!_0x343c1c) {
                        continue;
                    }
                    const [_0x20a675, _0xe3b2a7, _0x594dc8] = _0x12d996;
                    const _0xff8b9 = _0x476aac.#children[_0x20a675];
                    const _0x9e8112 = _0x46e114.slice(_0xcbde32).join("/");
                    if (_0x594dc8 instanceof RegExp) {
                        const _0x331850 = _0x594dc8.exec(_0x9e8112);
                        if (_0x331850) {
                            _0x217518[_0xe3b2a7] = _0x331850[0];
                            _0x425d89.push(...this.#getHandlerSets(_0xff8b9, _0x512197, _0x476aac.#params, _0x217518));
                            if (Object.keys(_0xff8b9.#children).length) {
                                _0xff8b9.#params = _0x217518;
                                const _0x2983dd = _0x331850[0].match(/\//)?.length ?? 0;
                                const _0x1ed7f1 = _0x4673fb[_0x2983dd] ||= [];
                                _0x1ed7f1.push(_0xff8b9);
                            }
                            continue;
                        }
                    }
                    if (_0x594dc8 === true || _0x594dc8.test(_0x343c1c)) {
                        _0x217518[_0xe3b2a7] = _0x343c1c;
                        if (_0x4496f4) {
                            _0x425d89.push(...this.#getHandlerSets(_0xff8b9, _0x512197, _0x217518, _0x476aac.#params));
                            if (_0xff8b9.#children["*"]) {
                                _0x425d89.push(...this.#getHandlerSets(_0xff8b9.#children["*"], _0x512197, _0x217518, _0x476aac.#params));
                            }
                        } else {
                            _0xff8b9.#params = _0x217518;
                            _0x139664.push(_0xff8b9);
                        }
                    }
                }
            }
            _0x16d555 = _0x139664.concat(_0x4673fb.shift() ?? []);
        }
        if (_0x425d89.length > 1) {
            _0x425d89.sort((_0x18a0a6, _0x14091b) => {
                return _0x18a0a6.score - _0x14091b.score;
            });
        }
        return [_0x425d89.map(({
                                   handler: _0x5e3710,
                                   params: _0x7112e6
                               }) => [_0x5e3710, _0x7112e6])];
    }
};
var _0xb0d397 = class {
    name = "TrieRouter";
    #node;
    constructor() {
        this.#node = new _0x4df9fb();
    }
    add(_0x485f3f, _0x55813b, _0x1ecd02) {
        const _0x27d456 = _0x31e464(_0x55813b);
        if (_0x27d456) {
            for (let _0x1fe244 = 0, _0xa5cd53 = _0x27d456.length; _0x1fe244 < _0xa5cd53; _0x1fe244++) {
                this.#node.insert(_0x485f3f, _0x27d456[_0x1fe244], _0x1ecd02);
            }
            return;
        }
        this.#node.insert(_0x485f3f, _0x55813b, _0x1ecd02);
    }
    match(_0x30235a, _0x3b19ce) {
        return this.#node.search(_0x30235a, _0x3b19ce);
    }
};
var _0x55f320 = class extends _0x1dea9b {
    constructor(_0x7a6ed6 = {}) {
        super(_0x7a6ed6);
        this.router = _0x7a6ed6.router ?? new _0x518d85({
            routers: [new _0x49299b(), new _0xb0d397()]
        });
    }
};
var _0x1de3bd;
function _0xd9eba3() {
    return typeof globalThis.addEventListener === "undefined";
}
function _0x1720f9(_0x34dded) {
    if (_0x34dded.token_prefix === "/" || _0x34dded.token_prefix === "//" || _0x34dded.token_prefix === "") {
        _0x34dded.token_prefix = "/default/";
        _0x34dded.default_password = true;
    }
    return _0x34dded;
}
function _0x2ad78b(_0x244fef) {
    if (!_0xd9eba3()) {
        console.log("cloudflare environment!");
        _0x1de3bd = {
            proxy_url: "http://localhost:5006",
            token_prefix: "/user22334455/",
            local_listen_port: 5006
        };
        console.log("Configuration loaded:", _0x1de3bd);
        _0x1de3bd = _0x1720f9(_0x1de3bd);
        _0x244fef(_0x1de3bd);
    } else {
        console.log("node environment!");
        import("fs/promises").then(_0x4b7df3 => {
            _0x4b7df3.readFile("./config.json", "utf8").then(_0x76d3f5 => {
                _0x1de3bd = JSON.parse(_0x76d3f5);
                console.log("Configuration loaded:", _0x1de3bd);
                _0x1de3bd = _0x1720f9(_0x1de3bd);
                _0x244fef(_0x1de3bd);
            }).catch(_0x1c25fb => {
                console.error("Error loading the configuration file:", _0x1c25fb);
            });
        });
    }
}
function _0x4d5b45() {
    if (_0xd9eba3()) {
        return _0x1de3bd;
    } else {
        _0x1de3bd = {
            proxy_url: globalThis.proxy_url,
            token_prefix: globalThis.token_prefix,
            local_listen_port: 443
        };
        _0x1de3bd = _0x1720f9(_0x1de3bd);
        return _0x1de3bd;
    }
}
var _0x2c5557 = ["telegram.org", "nga.178.com"];
function _0x3b2148(_0x26c10c) {
    let _0xe7be85 = false;
    _0x2c5557.forEach(_0x36e7ae => {
        if (_0x26c10c.includes(_0x36e7ae)) {
            _0xe7be85 = true;
        }
    });
    return _0xe7be85;
}
var _0x9b27d3 = ["telegram.org/service_worker.js", "elcomercio.pe", "exchangebank.com"];
function _0x2eb23f(_0x530b61) {
    let _0xc6bc7 = false;
    _0x9b27d3.map(_0x4a6e69 => {
        if (_0x530b61.includes(_0x4a6e69)) {
            _0xc6bc7 = true;
        }
    });
    return _0xc6bc7;
}
var _0x40a177 = [{
    domain: "google.com",
    replacements: [{
        regex: /;\w+?\.integrity='sha.+?';/,
        replacement: ";"
    }]
}];
var _0x208a69 = [{
    regex: /\.URL\b/,
    replacement: ".___URL"
}, {
    regex: /\bdomain\b/,
    replacement: "___domain"
}, {
    regex: /\bpushState\b/,
    replacement: "___pushState"
}, {
    regex: /\breplaceState\b/,
    replacement: "___replaceState"
}, {
    regex: /\bnavigator.serviceWorker\b/,
    replacement: "navigator.___serviceWorker"
}, {
    regex: /\bdocument.requestStorageAccessFor\b/,
    replacement: "document.___requestStorageAccessFor"
}];
function _0x33357b({
                       body: _0x202de0,
                       proxy_real_host: _0x51906c,
                       proxy_url_prefix: _0x28fb13
                   }) {
    let _0x46a189 = String(_0x202de0);
    if (typeof _0x202de0 === "string" && _0x202de0.indexOf("document.URL") !== -1) {}
    const _0x51b1ce = _0x40a177.forEach(_0x537993 => {
        if (_0x51906c.includes(_0x537993.domain)) {
            _0x537993.replacements.forEach(_0x5d60bc => {
                _0x46a189 = _0x46a189.replace(new RegExp(_0x5d60bc.regex, "g"), _0x5d60bc.replacement);
            });
        }
    });
    if (!_0x3b2148(_0x51906c)) {
        _0x208a69.forEach(({
                               regex: _0x48d8eb,
                               replacement: _0x1be558
                           }) => {
            _0x46a189 = _0x46a189.replace(new RegExp(_0x48d8eb, "g"), _0x1be558);
        });
    }
    return _0x46a189;
}
var _0x2329e2;
function _0x479363(_0x3b7915) {
    _0x3b7915 = _0x3b7915.replace(/\bwindow\.location\s*=(.*?)/g, "window.hookLocation=$1");
    _0x3b7915 = _0x3b7915.replace(/\bwindow\.location\.href\s*=(.*?)/g, "window.hookLocation=$1");
    _0x3b7915 = _0x3b7915.replace(/\bwindow\.location\.assign\s*\((.*?)/g, "window.hookLocation.assign($1");
    return _0x3b7915;
}
var _0x22353d = ({
                     location_value: _0x2ac8e6,
                     proxy_url_prefix: _0x244627,
                     proxy_real_protocol: _0x36bfd6,
                     proxy_real_host: _0xf33728
                 }) => {
    const _0x470af8 = {
        "^(http[s]?)://([-a-zA-Z0-9.]+)": _0x244627 + "$1/$2"
    };
    for (let _0x4d69ba in _0x470af8) {
        let _0xc8f920 = new RegExp(_0x4d69ba, "g");
        _0x2ac8e6 = _0x2ac8e6.replace(_0xc8f920, _0x470af8[_0x4d69ba]);
    }
    return _0x2ac8e6;
};
function _0x3a09bd({
                       location_value: _0x18d368,
                       proxy_url_prefix: _0x220f51,
                       proxy_real_protocol: _0x4ad8aa,
                       proxy_real_host: _0x3d924c
                   }) {
    if (String(_0x18d368 || "").startsWith("//")) {
        _0x18d368 = _0x4ad8aa + ":" + _0x18d368;
    }
    let _0x497398 = _0x22353d({
        location_value: _0x18d368,
        proxy_url_prefix: _0x220f51,
        proxy_real_protocol: _0x4ad8aa,
        proxy_real_host: _0x3d924c
    });
    if (_0x497398.startsWith("/")) {
        _0x497398 = _0x220f51 + _0x4ad8aa + "/" + _0x3d924c + _0x497398;
    }
    return _0x497398;
}
function _0x4ce367() {
    return typeof process !== "undefined" && !!(process.versions && process.versions.node);
}
async function _0x40f9fa(_0x4eaad6, _0x5b6b4a) {
    if (_0x4ce367()) {
        return await _0x5864af(_0x4eaad6, _0x5b6b4a);
    } else {
        return await _0x3a9063(_0x4eaad6, _0x5b6b4a);
    }
}
async function _0x2f0679(_0x3d5761, _0x32f2cf) {
    if (_0x4ce367()) {
        return await _0x57f96e(_0x3d5761, _0x32f2cf);
    } else {
        return await _0x2568c4(_0x3d5761, _0x32f2cf);
    }
}
async function _0x5864af(_0x2fcaef, _0x19bab2) {
    if (!_0x2329e2) {
        _0x2329e2 = await import("zlib");
    }
    if (!_0x2fcaef || _0x2fcaef.byteLength === 0 || _0x2fcaef.length === 0) {
        return Buffer.alloc(0);
    }
    try {
        if (_0x19bab2 === "br") {
            return _0x2329e2.brotliDecompressSync(_0x2fcaef);
        } else if (_0x19bab2 === "gzip") {
            return _0x2329e2.gunzipSync(_0x2fcaef);
        } else {
            return _0x2fcaef;
        }
    } catch (_0x4356b1) {
        console.error("Decompression error:", _0x4356b1);
        return _0x2fcaef;
    }
}
async function _0x57f96e(_0x3fa6ce, _0x34c1e9) {
    if (!_0x2329e2) {
        _0x2329e2 = await import("zlib");
    }
    if (!_0x3fa6ce || _0x3fa6ce.byteLength === 0 || _0x3fa6ce.length === 0) {
        return Buffer.alloc(0);
    }
    try {
        if (_0x34c1e9 === "br") {
            return _0x2329e2.brotliCompressSync(_0x3fa6ce);
        } else if (_0x34c1e9 === "gzip") {
            return _0x2329e2.gzipSync(_0x3fa6ce);
        } else {
            return _0x3fa6ce;
        }
    } catch (_0x16ed54) {
        console.error("Compression error:", _0x16ed54);
        return _0x3fa6ce;
    }
}
async function _0x2568c4(_0x2cb65a, _0x156f23) {
    if (!_0x2cb65a || _0x2cb65a.byteLength === 0) {
        return new Uint8Array();
    }
    if (typeof CompressionStream !== "undefined") {
        try {
            let _0xe36354;
            if (_0x156f23 === "gzip" || _0x156f23 === "br") {
                _0xe36354 = _0x2cb65a.pipeThrough(new CompressionStream(_0x156f23));
            } else {
                return _0x2cb65a;
            }
            const _0x1e5d03 = _0xe36354.getReader();
            let _0x338905 = [];
            let _0x59fe2a;
            while (!(_0x59fe2a = await _0x1e5d03.read()).done) {
                _0x338905.push(_0x59fe2a.value);
            }
            const _0x24019b = new Uint8Array(_0x338905.reduce((_0x2ceead, _0x1d131e) => _0x2ceead.concat(Array.from(_0x1d131e)), []));
            return _0x24019b;
        } catch (_0x1f96d8) {
            console.error("Compression error:", _0x1f96d8);
            return _0x2cb65a;
        }
    } else {
        console.error("Compression not supported in this environment or for the specified format.");
        return _0x2cb65a;
    }
}
async function _0x3a9063(_0x574694, _0x349808) {
    if (!_0x574694 || _0x574694.byteLength === 0) {
        return new Uint8Array();
    }
    if (typeof DecompressionStream !== "undefined") {
        try {
            let _0x283be4;
            if (_0x349808 === "gzip" || _0x349808 === "br") {
                _0x283be4 = _0x574694.pipeThrough(new DecompressionStream(_0x349808));
            } else {
                return _0x574694;
            }
            const _0x49dd44 = _0x283be4.getReader();
            let _0x385143 = [];
            let _0x4ccd1f;
            while (!(_0x4ccd1f = await _0x49dd44.read()).done) {
                _0x385143.push(_0x4ccd1f.value);
            }
            const _0x37507d = new Uint8Array(_0x385143.reduce((_0x2ab3b1, _0x449b69) => _0x2ab3b1.concat(Array.from(_0x449b69)), []));
            return _0x37507d;
        } catch (_0x5acf8c) {
            console.error("Decompression error:", _0x5acf8c);
            return _0x574694;
        }
    } else {
        console.error("Decompression not supported in this environment or for the specified format.");
        return _0x574694;
    }
}
function _0x249337(_0x3549b1, _0x1709e9) {
    const _0x3f882a = new RegExp(_0x1709e9, "i");
    const _0x5dbee0 = _0x3f882a.exec(_0x3549b1);
    if (_0x5dbee0) {
        return _0x5dbee0.index + _0x5dbee0[0].length;
    } else {
        return -1;
    }
}
async function _0x10586b({
                             proxyResponse: _0x169948,
                             newResHeaders: _0x4b627b,
                             req: _0x4b0530
                         }, _0x192322, _0x10690b = _0x3b2148, _0x3543f5 = _0x40f9fa, _0x3afb5b = _0x2f0679) {
    const _0x28d461 = _0x192322 || _0x4d5b45();
    const _0x53eabd = _0x28d461.proxy_url + _0x28d461.token_prefix;
    const _0x34d075 = _0x4b0530.proxy_real_protocol;
    const _0x1d0019 = _0x4b0530.proxy_real_host;
    const _0x4fb679 = "<script>\n  if (!window.argon_injected_flag) { // only load once\n    var proxy_url_prefix = '" + _0x53eabd + "';\n    var proxy_real_protocol = '" + _0x34d075 + "';\n    var proxy_real_host = '" + _0x1d0019 + "';\n    var config_proxy_url = '" + _0x28d461.proxy_url + "';\n    var config_token_prefix = '" + _0x28d461.token_prefix + "';\n  } </script>";
    const _0x5be525 = _0x4fb679 + "<script src=\"/argon-response-injected.js\"></script>";
    _0x4c5d34(_0x169948, _0x4b627b, _0x53eabd, _0x34d075, _0x1d0019, _0x4b0530);
    let _0x539ee8 = await _0xd33265(_0x169948, _0x4b627b, _0x5be525, _0x4b0530, _0x28d461, _0x10690b, _0x3543f5, _0x3afb5b);
    if (_0x169948.status === 204 || [301, 302, 303, 304, 307, 308].includes(_0x169948.status)) {
        _0x539ee8 = undefined;
        _0x4b627b.delete("content-length");
        _0x4b627b.delete("content-encoding");
        _0x4b627b.delete("transfer-encoding");
    }
    let _0x2b99a4 = new Response(_0x539ee8, {
        status: _0x169948.status,
        headers: _0x4b627b
    });
    return _0x2b99a4;
}
function _0x4c5d34(_0x52f50d, _0x1bb380, _0x2048ad, _0x204de7, _0x15a000, _0x25ab22) {
    if ([301, 302, 303, 307, 308].includes(_0x52f50d.status)) {
        let _0x3d622d = _0x52f50d.headers.get("location");
        if (_0x3d622d) {
            _0x1bb380.set("Location", _0x3a09bd({
                location_value: _0x3d622d,
                proxy_url_prefix: _0x2048ad,
                proxy_real_protocol: _0x204de7,
                proxy_real_host: _0x15a000
            }));
        }
    }
}
async function _0xd33265(_0x309d27, _0x197856, _0x537389, _0x310c09, _0x5c2e7f, _0x522d2f, _0x1e462e, _0x1ee64d) {
    const _0x4452cb = _0x5c2e7f || _0x4d5b45();
    const _0x3b1ca8 = _0x4452cb.proxy_url + _0x4452cb.token_prefix;
    const _0x3d3db1 = _0x310c09.proxy_real_protocol;
    const _0x9f0b6b = _0x310c09.proxy_real_host;
    const _0x536445 = _0x4ce367();
    let _0x506d83;
    const _0x4fcfe8 = _0x309d27.headers.get("content-encoding");
    const _0x5dd675 = _0x309d27.headers.get("content-type") || "";
    const _0x305e64 = _0x5dd675.includes("text/html");
    let _0x21f0ce = _0x5dd675.includes("javascript");
    let _0x1abc5e = _0x309d27.body;
    let _0x491a66 = "utf-8";
    let _0x2ca343;
    const _0x1219ff = !_0x522d2f(_0x9f0b6b);
    let _0x5498ef = false;
    if (_0x536445 && _0x4fcfe8) {
        _0x197856.delete("content-encoding");
        _0x197856.delete("content-length");
        _0x197856.delete("transfer-encoding");
    }
    if (_0x4fcfe8 && (_0x305e64 || _0x21f0ce) && _0x309d27.status < 500 && _0x1219ff) {
        _0x506d83 = await _0x309d27.arrayBuffer();
        _0x2ca343 = _0x506d83.byteLength;
    }
    if ((_0x305e64 || _0x21f0ce) && _0x309d27.status < 500) {
        if (!_0x4fcfe8) {
            _0x506d83 = await _0x309d27.arrayBuffer();
            _0x2ca343 = _0x506d83.byteLength;
        } else if (_0x1219ff && !_0x536445) {
            _0x506d83 = await _0x1e462e(_0x506d83, _0x4fcfe8);
            _0x2ca343 = _0x506d83.byteLength || _0x506d83.length;
        }
        if (!_0x2ca343 || _0x2ca343 < 10) {
            if (!_0x2ca343 || _0x309d27.status === 204) {
                _0x506d83 = undefined;
                return _0x506d83;
            }
        }
        if (!_0x1219ff) {
            if (_0x310c09.proxy_real_protocol) {
                const _0x226729 = "proxy_real_protocol=" + _0x310c09.proxy_real_protocol + "; Path=/; HttpOnly";
                const _0x4c313c = "proxy_real_host=" + _0x310c09.proxy_real_host + "; Path=/; HttpOnly";
                _0x197856.append("set-cookie", _0x226729);
                _0x197856.append("set-cookie", _0x4c313c);
                _0x197856.delete("x-frame-options");
            }
            return _0x1abc5e;
        }
        const _0x23e76f = new TextDecoder("iso-8859-1");
        const _0x4e629c = _0x23e76f.decode(_0x506d83);
        let _0x51aabf = _0x4e629c.match(/<meta\s+[^>]*charset\s*=\s*["']?([0-9a-zA-Z\-]+)["']?[^>]*>/i);
        if (_0x305e64 && _0x51aabf && _0x51aabf[1]) {
            _0x491a66 = _0x51aabf[1].toLowerCase();
        } else {
            const _0x444f47 = _0x5dd675.match(/charset=([^;]+)/i);
            if (_0x444f47) {
                _0x491a66 = _0x444f47[1].toLowerCase();
            }
        }
        const _0x17b581 = _0x5dd675.toLowerCase().indexOf("gbk") !== -1;
        let _0xfb83bd;
        try {
            _0xfb83bd = new TextDecoder(_0x491a66);
        } catch (_0x5a4b20) {
            console.error("Unsupported charset, falling back to utf-8", _0x5a4b20);
            _0xfb83bd = new TextDecoder("utf-8");
        }
        let _0x5de259;
        try {
            _0x5de259 = _0xfb83bd.decode(_0x506d83);
        } catch (_0x3a3dd4) {
            console.error("Decoding error occurred: ", _0x3a3dd4);
            return _0x506d83;
        }
        let _0x328a02 = -1;
        if (_0x305e64 && _0x491a66 === "gbk") {
            const _0x512ff3 = "<head.*?>";
            _0x328a02 = _0x249337(_0x5de259, _0x512ff3);
            if (_0x328a02 !== -1) {
                _0x328a02 += 1;
            }
        }
        if (_0x305e64 && _0x491a66 === "gbk" && _0x328a02 !== -1) {
            const _0x28bc55 = new TextEncoder();
            let _0x4693fb = _0x28bc55.encode(_0x537389);
            let _0x2da976 = _0x506d83.byteLength + _0x4693fb.byteLength;
            let _0x213756 = new ArrayBuffer(_0x2da976);
            let _0x209405 = new Uint8Array(_0x213756);
            let _0x25422d = new Uint8Array(_0x506d83);
            let _0x6bdb48 = new Uint8Array(_0x4693fb);
            _0x209405.set(_0x25422d.subarray(0, _0x328a02), 0);
            _0x209405.set(_0x6bdb48, _0x328a02);
            _0x209405.set(_0x25422d.subarray(_0x328a02), _0x328a02 + _0x6bdb48.length);
            _0x506d83 = _0x213756;
            _0x5498ef = true;
        } else if (_0x1219ff) {
            if (_0x305e64 || _0x21f0ce) {
                _0x506d83 = _0x5de259;
                if (_0x21f0ce) {
                    _0x506d83 = _0x479363(_0x506d83);
                }
                _0x506d83 = _0x33357b({
                    body: _0x506d83,
                    proxy_real_host: _0x9f0b6b,
                    proxy_url_prefix: _0x3b1ca8
                });
                if (_0x305e64) {
                    if (_0x506d83.indexOf("<head") !== -1) {
                        _0x506d83 = _0x506d83.replace(/<head(.*?)>/, "<head$1>" + _0x537389);
                    } else if (_0x506d83.indexOf("<body") !== -1) {
                        _0x506d83 = _0x506d83.replace(/<body(.*?)>/, "<body$1>" + _0x537389);
                    } else if (_0x506d83.indexOf("<html") !== -1) {
                        _0x506d83 = _0x506d83.replace(/<html(.*?)>/, "<html$1>" + _0x537389);
                    } else {
                        _0x506d83 = _0x506d83.replace(/(<\/[a-zA-Z0-9]+>)/, "$1" + _0x537389);
                    }
                }
                const _0x17d03f = new TextEncoder("utf-8");
                _0x506d83 = _0x17d03f.encode(_0x506d83);
                _0x5498ef = true;
            }
        }
        if (_0x310c09.proxy_real_protocol) {
            const _0x226729 = "proxy_real_protocol=" + _0x310c09.proxy_real_protocol + "; Path=/; HttpOnly";
            const _0x4c313c = "proxy_real_host=" + _0x310c09.proxy_real_host + "; Path=/; HttpOnly";
            _0x197856.append("set-cookie", _0x226729);
            _0x197856.append("set-cookie", _0x4c313c);
            _0x197856.delete("x-frame-options");
        }
        if (_0x5498ef) {
            _0x1abc5e = _0x506d83;
        }
    }
    if (_0x4fcfe8 && _0x5498ef && !_0x536445) {
        _0x506d83 = await _0x1ee64d(_0x506d83, _0x4fcfe8);
        _0x1abc5e = _0x506d83;
        _0x197856.set("content-length", String(_0x506d83.length || _0x506d83.byteLength || 0));
        _0x197856.set("content-encoding", _0x4fcfe8);
        _0x197856.delete("transfer-encoding");
    }
    if (_0x1abc5e !== undefined && _0x1abc5e !== null) {
        if (_0x1abc5e.length !== undefined) {
            _0x197856.set("content-length", String(_0x1abc5e.length));
        }
    }
    if (_0x1abc5e instanceof ArrayBuffer) {
        _0x1abc5e = new Uint8Array(_0x1abc5e);
    }
    return _0x1abc5e;
}
var _0x22133a = _0x3507a9;
(function (_0x4e90ff, _0x364c4c) {
    const _0x1a18b2 = _0x3507a9;
    const _0x231e23 = _0x4e90ff();
    while (true) {
        try {
            const _0x59823f = -parseInt(_0x1a18b2(412)) / 1 + -parseInt(_0x1a18b2(426)) / 2 + parseInt(_0x1a18b2(384)) / 3 * (-parseInt(_0x1a18b2(374)) / 4) + parseInt(_0x1a18b2(355)) / 5 + parseInt(_0x1a18b2(505)) / 6 + parseInt(_0x1a18b2(515)) / 7 + parseInt(_0x1a18b2(428)) / 8;
            if (_0x59823f === _0x364c4c) {
                break;
            } else {
                _0x231e23.push(_0x231e23.shift());
            }
        } catch (_0x3e6225) {
            _0x231e23.push(_0x231e23.shift());
        }
    }
})(_0xbc8953, 180699);
function _0x55a410(_0x380f18) {
    const _0x3adc60 = _0x3507a9;
    const _0x3d8948 = /^([^:/?#]+)\/([-a-z0-9A-Z.]+)/;
    const _0x40eba5 = _0x380f18[_0x3adc60(466)](_0x3d8948);
    let _0x1bd1f1;
    let _0x303c91;
    if (_0x40eba5) {
        if (_0x3adc60(449) === _0x3adc60(379)) {
            if (_0x14a706) {
                const _0x56ca81 = _0x21be65[_0x3adc60(401)](_0xb7205d, arguments);
                _0x4381ed = null;
                return _0x56ca81;
            }
        } else {
            _0x1bd1f1 = _0x40eba5[1];
            _0x303c91 = _0x40eba5[2];
        }
    }
    return {
        protocol: _0x1bd1f1,
        host: _0x303c91
    };
}
function _0x2b8a85() {
    const _0x22efbf = _0x3507a9;
    const _0x2b2ace = {
        FuJqZ: function (_0x51881c, _0x4f14a9) {
            return _0x51881c + _0x4f14a9;
        },
        JVdLe: _0x22efbf(398),
        vyRgQ: function (_0x217109, _0x520e74) {
            return _0x217109 !== _0x520e74;
        },
        dJfhc: _0x22efbf(445),
        nznTr: _0x22efbf(416),
        xVqOd: _0x22efbf(418),
        nEmet: "while (true) {}",
        kCfnM: _0x22efbf(494),
        FUiOq: _0x22efbf(409),
        jVPzZ: _0x22efbf(495),
        Tqwdi: _0x22efbf(402),
        Cmdzg: _0x22efbf(491),
        uSWhA: _0x22efbf(497),
        SDOzt: _0x22efbf(467),
        RJDcr: _0x22efbf(362),
        hIRVP: _0x22efbf(373)
    };
    const _0x259a47 = function () {
        const _0x23416e = _0x22efbf;
        if (_0x2b2ace.FUiOq === _0x2b2ace[_0x23416e(479)]) {
            let _0x3f3c48 = true;
            return function (_0x303b65, _0x435653) {
                const _0x8b501f = _0x23416e;
                const _0x32cee3 = {
                    NymtI: function (_0x2e4077, _0x56c00f) {
                        const _0x8b119a = _0x3507a9;
                        return _0x2b2ace[_0x8b119a(417)](_0x2e4077, _0x56c00f);
                    },
                    osvrj: _0x2b2ace[_0x8b501f(460)],
                    ETOcs: "action",
                    dFJam: function (_0x54c7bb, _0x3f7b93) {
                        return _0x2b2ace.vyRgQ(_0x54c7bb, _0x3f7b93);
                    },
                    DOhKk: _0x2b2ace[_0x8b501f(471)],
                    hWnsD: _0x2b2ace[_0x8b501f(446)],
                    SbLOf: _0x2b2ace[_0x8b501f(363)]
                };
                const _0x3a3ab4 = _0x3f3c48 ? function () {
                    const _0x462130 = _0x8b501f;
                    const _0x1381b2 = {
                        LWnKX: function (_0x20b501, _0x2d5cbb) {
                            return _0x32cee3.NymtI(_0x20b501, _0x2d5cbb);
                        },
                        gACEs: _0x462130(482),
                        WgHpx: _0x32cee3.osvrj,
                        kBLPP: _0x32cee3[_0x462130(484)]
                    };
                    if (_0x32cee3[_0x462130(394)](_0x32cee3[_0x462130(520)], "IcQKc")) {
                        if (_0x435653) {
                            if (_0x32cee3[_0x462130(394)](_0x32cee3[_0x462130(480)], _0x32cee3.SbLOf)) {
                                const _0x23eb61 = _0x435653.apply(_0x303b65, arguments);
                                _0x435653 = null;
                                return _0x23eb61;
                            } else {
                                (function () {
                                    return false;
                                }).constructor(BopxIH[_0x462130(434)](BopxIH[_0x462130(361)], "gger"))[_0x462130(401)](BopxIH[_0x462130(430)]);
                            }
                        }
                    } else {
                        (function () {
                            return true;
                        }).constructor(BopxIH[_0x462130(434)](BopxIH.gACEs, _0x462130(506)))[_0x462130(371)](BopxIH.kBLPP);
                    }
                } : function () {};
                _0x3f3c48 = false;
                return _0x3a3ab4;
            };
        } else {
            return function (_0x3a75fd) {}[_0x23416e(372)](eRUexa[_0x23416e(522)])[_0x23416e(401)](eRUexa[_0x23416e(472)]);
        }
    }();
    (function () {
        _0x259a47(this, function () {
            const _0x99bd1f = _0x3507a9;
            const _0x20c797 = {
                lDIRA: _0x2b2ace[_0x99bd1f(397)],
                TYJII: _0x2b2ace[_0x99bd1f(377)]
            };
            if (_0x2b2ace[_0x99bd1f(391)] === _0x2b2ace[_0x99bd1f(391)]) {
                const _0x487991 = new RegExp(_0x2b2ace[_0x99bd1f(518)]);
                const _0x25362e = new RegExp(_0x2b2ace[_0x99bd1f(369)], "i");
                const _0x562353 = _0x458c36("init");
                if (!_0x487991[_0x99bd1f(438)](_0x2b2ace.FuJqZ(_0x562353, _0x2b2ace[_0x99bd1f(440)])) || !_0x25362e[_0x99bd1f(438)](_0x2b2ace[_0x99bd1f(417)](_0x562353, _0x2b2ace[_0x99bd1f(493)]))) {
                    _0x562353("0");
                } else {
                    _0x458c36();
                }
            } else {
                const _0x46d37b = _0x31a336.from(_0x18dba4, _0x20c797[_0x99bd1f(492)]);
                const _0x3908d1 = _0x57e6e3[_0x99bd1f(523)]({
                    key: _0x54fc75,
                    padding: _0x30721b[_0x99bd1f(452)][_0x99bd1f(510)],
                    oaepHash: _0x99bd1f(488)
                }, _0x46d37b);
                return _0x3908d1.toString(_0x20c797[_0x99bd1f(503)]);
            }
        })();
    })();
    return typeof globalThis.addEventListener === _0x22efbf(451);
}
var _0x4bcb8e;
var _0x27f4ac = _0x2b8a85();
if (_0x27f4ac) {
    import(_0x22133a(441))[_0x22133a(504)](_0x183913 => _0x4bcb8e = _0x183913);
}
function _0xbc8953() {
    const _0x30d970 = ["-----END PUBLIC KEY-----", "jVPzZ", "stateObject", "SJoMv", "HpeME", "apply", "base64", "bXPRb", "uYbts", "Kqxmr", "SjeHx", "QRICK", "CHpIi", "hdoVl", "rOFJm", "concat", "169925VoRuqh", "action", "QxizL", "PcYgJ", "fIGTF", "FuJqZ", "MqwGu", "createDecipheriv", "ldMIJ", "importKey", "RSA-OAEP", "cLMFP", "bugVG", "generateKey", "561964kBoUeP", "otUud", "444904qTnnwl", "subtle", "WgHpx", "encode", "decrypt", "LtDlD", "LWnKX", "replace", "qxKmI", "buffer", "test", "jwkZi", "RJDcr", "crypto", "from", "\n-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDAQk/iBU0Ev8Yf\nAw/qjgJJaxB5PbYotgOAmqVVetQrDvyI8j+39ruSibbfkLr+wcSELjSgsuN1zMgg\n0sazSAuJzAOdc2E4S7dF+kkWDhI6iaMgSlc9ggLil1OL/Z1EcWpbBT27cVRTFfbr\nVV8NptQP1pvmSDKGow1PAg3zpN2xlQbovP0r8G/of7nnCQT7mlOP/DQiKBkJLVSb\nBRYsXzWZdDh/DenzqrMatFsH6uLiAQdRMiiX408kHbZI35Dg8P3Ut85b8/lfSaDt\nK4clMGgQuEYrCpWdaWnPhXXnwEtqR2Z52jrfNL4uybEvY6CMV5ylyUiBvWPJfmJz\nzgRSMe+LAgMBAAECggEAM6W8uu2MnqF78hnK/Uov4BQ0ZTWISVB4CWTB1IA+HeEV\nQx68sklEY12+dDl3mndoONAG0EKuKxebjYHB4iiQ/PAC6pmzvMFOVyyg1J1sFTCj\nU0nVPM8/wio/xeQYCupi1VfHmSKdMgK9BcQ12D+ASU7wK4EqnZOQwDA/mjuoWItG                                                                                                                       \nS86g4wezKnBPpj9IxkBAurSEeFKVjupAoASk4e1v/S+ITPRFlic3I0uy8b2qU7il\ngfbtB7j3UPYFFlhH/sipizQ1d1N+EyIaXplWX4QnoO1/ksVsqJZ0Q6afzYR+mtlb\nR7zqoBrwLrMOdREuyrQfPgqS1OgEEhimaGUvcbbF3QKBgQDtU3uC+adNrqmXi9EF\nIjieZGa5T2QlqkzL6wf/NXfiSBjw+nqJSuRXeRhS+tLIpfLWAkhwLp4YtBioom6U\ny/3KP5GtDbRJ9lZSF06moueTidk4Z4bfN7+WFT7UbEf/Nx3fnMFHEFqmsvH2KHjn\n1ADmAAHW0ERRwEf5ocWJwAUvBwKBgQDPYwhWBC61w2TQy6ZogcAfQudociejOngq\nfMz7iDEV35aR8/cc81uo5spN7amRmkJVPpd92HUd+xdlXsOLBJ5HHsoeuWEo6Xe5\nhsHaZYeJJx/1BLkmv050QfzjIeh6n71gfSOewCooNgkb9lLbvHoT50CQgXfkme2A            \nUz4HLQDWXQKBgB2odyDxDgVZNHxpzp8znZu9tFCoKT3DwIEjSAaOqgKvO96xjqql\nn0+HJJEKI1lL08MG2gKa8MrphsNcOTGDJJ4nv46+za8Ih9UOcJfGd+YqLeksluBC\nWUDqOsXVGlI8kxEkx8qXspxudGpsuF9QUSRtD83GjSMiQlxh6QvD4WH1AoGBAIgC\nlgP7qDqy09qPxSpC9iJKeYOpYk+N2CNdR/4q2q5SvegozUciX1nNSp6DILOKLLjF\nXQs+u8iW1Ug5NxtkQv23tq0hvRPc0hVNyLMX5STREQdbOqarzqM2Z8j6gwJw4v11   \n9Ld3pe5LSfwZt0u/N3z4LALZtiypuvZvIX4JSMRNAoGBAOc0nw0OdDOEOmfh2hqR  \nwRTW+oTY2iIDKFHtzKVSxJlyKQkagJgg/qboXL9bQoHTsBzL8lGZhh8JJPpeyP1/\nyIzsiCZ9hrt+z9KJPG3lu0tlnEOg7r57SiR8aOtsb1D9wb24cQLFQOfT3D66mNi8\n1/PLJ86KgP+cXZDrVrjUUKY0\n-----END PRIVATE KEY-----\n", "ktTtM", "ngtbi", "nznTr", "SLeuG", "spki", "Qylze", "djwuy", "undefined", "constants", "subarray", "mrJsz", "TLFOw", "-----END PRIVATE KEY-----", "sYGRA", "iTMjs", "WhRku", "JVdLe", "lnpsv", "-----BEGIN PUBLIC KEY-----", "ypRAm", "length", "slice", "match", "\\+\\+ *(?:[a-zA-Z_$][0-9a-zA-Z_$]*)", "rsa", "iglUa", "rIrGg", "dJfhc", "kCfnM", "ULwvV", "aes-256-cbc", "XUhYl", "hdmES", "nHJNx", "charCodeAt", "FUiOq", "hWnsD", "XcARE", "debu", "init", "ETOcs", "fczja", "oomSN", "aoAuG", "sha256", "paSgn", "pLCtS", "ROEfT", "lDIRA", "hIRVP", "counter", "utf8", "PpZNA", "function *\\( *\\)", "OVXgO", "cgGQV", "ZKVLF", "RFeVF", "VJGNl", "TYJII", "then", "1737948lDsnUO", "gger", "FwrnJ", "CENgn", "HRkPd", "RSA_PKCS1_OAEP_PADDING", "privateDecrypt", "ivXqg", "Jhggx", "pem", "1584786hbmUBs", "VjVUn", "ULgnj", "uSWhA", "BMEmo", "DOhKk", "MeoIp", "nEmet", "publicEncrypt", "generateKeyPair", "Ycfbq", "1082715DdsTrz", "decode", "OzgWF", "KANkL", "dPoTT", "Fyuxd", "gACEs", "chain", "xVqOd", "FnhTa", "LAVNQ", "while (true) {}", "baAcl", "toString", "SDOzt", "xffUC", "call", "constructor", "input", "7284PnZVbl", "BWCmC", "RCRhm", "Tqwdi", "sMfiA", "BeyFs", "final", "raw", "vQtrS", "VGjPJ", "258zpkDUF", "encrypt", "TvCVk", "pkcs8", "CQUwz", "BuUTz", "qfxoK", "Cmdzg", "SHA-256", "ykMJe", "dFJam", "OvbQK"];
    _0xbc8953 = function () {
        return _0x30d970;
    };
    return _0xbc8953();
}
var _0x405f3f = _0x22133a(443);
async function _0x4b54c5(_0x35237d) {
    const _0x541687 = _0x22133a;
    const _0x1dbb96 = {
        uYbts: "-----BEGIN PUBLIC KEY-----",
        oyeWP: _0x541687(396),
        RCRhm: function (_0x5d2368, _0x491c5f) {
            return _0x5d2368 < _0x491c5f;
        },
        Kqxmr: "RSA-OAEP",
        SjeHx: "SHA-256",
        Ycfbq: "encrypt",
        ULgnj: "sha256",
        cLMFP: "utf8",
        BdVPN: "-----BEGIN PRIVATE KEY-----",
        wxpjX: _0x541687(456),
        xffUC: function (_0xc3592f, _0x231c78) {
            return _0xc3592f !== _0x231c78;
        },
        SNKoF: _0x541687(519),
        VJGNl: _0x541687(432)
    };
    if (_0x27f4ac) {
        const _0x35de96 = Buffer[_0x541687(442)](_0x35237d, _0x541687(402));
        const _0x5c8362 = _0x4bcb8e[_0x541687(511)]({
            key: _0x405f3f,
            padding: _0x4bcb8e[_0x541687(452)][_0x541687(510)],
            oaepHash: _0x1dbb96[_0x541687(517)]
        }, _0x35de96);
        return _0x5c8362[_0x541687(368)](_0x1dbb96[_0x541687(423)]);
    } else {
        const _0x3356d6 = _0x1dbb96.BdVPN;
        const _0x573a90 = _0x1dbb96.wxpjX;
        const _0x4cdf7a = _0x405f3f[_0x541687(435)](_0x3356d6, "")[_0x541687(435)](_0x573a90, "")[_0x541687(435)](/\s/g, "");
        const _0x1118fb = atob(_0x4cdf7a);
        const _0x1fd896 = new Uint8Array(_0x1118fb[_0x541687(464)]);
        for (let _0x3f877f = 0; _0x1dbb96.RCRhm(_0x3f877f, _0x1118fb.length); _0x3f877f++) {
            if (_0x1dbb96[_0x541687(370)](_0x1dbb96.SNKoF, _0x1dbb96.SNKoF)) {
                const _0xcda998 = _0x1dbb96[_0x541687(404)];
                const _0x187e68 = _0x1dbb96.oyeWP;
                let _0xab5ee = _0xcef7ce[_0x541687(435)](_0xcda998, "").replace(_0x187e68, "");
                _0xab5ee = _0xab5ee[_0x541687(435)](/\s+/g, "");
                const _0x1f5433 = _0xd04761(_0xab5ee);
                const _0x480c4c = new _0x3288f8(_0x1f5433[_0x541687(464)]);
                for (let _0xf7c9f3 = 0; _0x1dbb96[_0x541687(376)](_0xf7c9f3, _0x1f5433[_0x541687(464)]); _0xf7c9f3++) {
                    _0x480c4c[_0xf7c9f3] = _0x1f5433.charCodeAt(_0xf7c9f3);
                }
                return _0x2b8669.crypto[_0x541687(429)].importKey(_0x541687(448), _0x480c4c.buffer, {
                    name: _0x1dbb96.Kqxmr,
                    hash: _0x1dbb96[_0x541687(406)]
                }, true, [_0x1dbb96[_0x541687(354)]]);
            } else {
                _0x1fd896[_0x3f877f] = _0x1118fb[_0x541687(478)](_0x3f877f);
            }
        }
        const _0x4dfe89 = await crypto[_0x541687(429)].importKey(_0x541687(387), _0x1fd896.buffer, {
            name: "RSA-OAEP",
            hash: {
                name: _0x1dbb96.SjeHx
            }
        }, false, [_0x1dbb96[_0x541687(502)]]);
        const _0x16c49d = Uint8Array[_0x541687(442)](atob(_0x35237d), _0x2987b7 => _0x2987b7[_0x541687(478)](0));
        const _0x1124b2 = await crypto[_0x541687(429)].decrypt({
            name: _0x1dbb96[_0x541687(405)]
        }, _0x4dfe89, _0x16c49d);
        return new TextDecoder()[_0x541687(356)](_0x1124b2);
    }
}
function _0x3507a9(_0x1062ac, _0x3852f5) {
    const _0x4ad23f = _0xbc8953();
    _0x3507a9 = function (_0x4ba7c3, _0x435a8b) {
        _0x4ba7c3 = _0x4ba7c3 - 354;
        let _0x3bb898 = _0x4ad23f[_0x4ba7c3];
        return _0x3bb898;
    };
    return _0x3507a9(_0x1062ac, _0x3852f5);
}
async function _0x2741d9(_0xdcfa1f, _0xe613e8) {
    const _0x3806a0 = _0x22133a;
    const _0x39d66a = {
        BuUTz: _0x3806a0(402),
        ykMJe: function (_0x50a2b7, _0x180227) {
            return _0x50a2b7(_0x180227);
        },
        XUhYl: "AES-CBC",
        FwrnJ: _0x3806a0(432)
    };
    let _0x14c910;
    let _0x1284bc;
    let _0x1c63f6;
    let _0x1caeaa;
    if (_0x27f4ac) {
        _0x14c910 = Buffer.from(_0xdcfa1f, _0x39d66a[_0x3806a0(389)]);
        _0x1284bc = _0x14c910[_0x3806a0(453)](0, 16);
        _0x1c63f6 = _0x14c910[_0x3806a0(453)](16);
        _0x1caeaa = Buffer.from(_0xe613e8, _0x39d66a[_0x3806a0(389)]);
    } else {
        const _0x376832 = Uint8Array[_0x3806a0(442)](atob(_0xdcfa1f), _0x35ae69 => _0x35ae69[_0x3806a0(478)](0));
        _0x1284bc = _0x376832[_0x3806a0(465)](0, 16);
        _0x1c63f6 = _0x376832[_0x3806a0(465)](16);
        const _0x2f69c4 = Uint8Array[_0x3806a0(442)](_0x39d66a[_0x3806a0(393)](atob, _0xe613e8), _0x50980c => _0x50980c[_0x3806a0(478)](0));
        _0x1caeaa = _0x2f69c4;
    }
    if (_0x27f4ac) {
        const _0x494312 = _0x4bcb8e[_0x3806a0(419)](_0x3806a0(474), _0x1caeaa, _0x1284bc);
        let _0x296e7d = _0x494312.update(_0x1c63f6);
        _0x296e7d = Buffer[_0x3806a0(411)]([_0x296e7d, _0x494312[_0x3806a0(380)]()]);
        return _0x296e7d[_0x3806a0(368)]("utf8");
    } else {
        const _0x161fb0 = await crypto[_0x3806a0(429)][_0x3806a0(421)](_0x3806a0(381), _0x1caeaa, {
            name: _0x39d66a[_0x3806a0(475)]
        }, false, [_0x39d66a[_0x3806a0(507)]]);
        const _0x8725cd = await crypto[_0x3806a0(429)].decrypt({
            name: _0x39d66a[_0x3806a0(475)],
            iv: _0x1284bc
        }, _0x161fb0, _0x1c63f6);
        return new TextDecoder()[_0x3806a0(356)](_0x8725cd);
    }
}
function _0x458c36(_0x11be5f) {
    const _0x9d2222 = _0x22133a;
    const _0x46e505 = {
        HRkPd: function (_0x889af8, _0x1f6f0b) {
            return _0x889af8(_0x1f6f0b);
        },
        bugVG: "lqFLN",
        sYGRA: "pkcs8",
        XcARE: function (_0x42084f, _0x59733f) {
            return _0x42084f(_0x59733f);
        },
        rIrGg: function (_0x495f5d, _0x255236) {
            return _0x495f5d(_0x255236);
        },
        hdmES: _0x9d2222(468),
        CbpBU: _0x9d2222(448),
        VGjPJ: _0x9d2222(514),
        pLCtS: function (_0x10ad2c, _0x22d5c0) {
            return _0x10ad2c === _0x22d5c0;
        },
        qxKmI: "BrLml",
        WhRku: "string",
        iglUa: function (_0x1197e9, _0x1f8ba4) {
            return _0x1197e9 !== _0x1f8ba4;
        },
        TvCVk: _0x9d2222(366),
        KRBBC: function (_0x4c4ab5, _0x32ed79) {
            return _0x4c4ab5 !== _0x32ed79;
        },
        qfxoK: function (_0x25a746, _0x1856c3) {
            return _0x25a746 + _0x1856c3;
        },
        RXGme: function (_0x5cec63, _0x47fdd7) {
            return _0x5cec63 / _0x47fdd7;
        },
        ckKHU: "length",
        djwuy: function (_0x3aa256, _0x491b45) {
            return _0x3aa256 === _0x491b45;
        },
        CQUwz: function (_0x2d2904, _0x45f4db) {
            return _0x2d2904 % _0x45f4db;
        },
        xlfhy: "XAvQi",
        YidmT: _0x9d2222(357),
        MeoIp: "debu",
        nHJNx: _0x9d2222(506),
        OVXgO: _0x9d2222(358),
        aoAuG: _0x9d2222(461),
        LtDlD: _0x9d2222(398)
    };
    function _0x3dc535(_0x15aa55) {
        const _0x25956a = _0x9d2222;
        const _0x50a8c9 = {
            CENgn: function (_0x508664, _0xbefb94) {
                const _0x45044c = _0x3507a9;
                return _0x46e505[_0x45044c(509)](_0x508664, _0xbefb94);
            }
        };
        if (_0x46e505[_0x25956a(490)](_0x46e505[_0x25956a(436)], _0x46e505.qxKmI)) {
            if (_0x46e505[_0x25956a(490)](typeof _0x15aa55, _0x46e505[_0x25956a(459)])) {
                if (_0x46e505[_0x25956a(469)](_0x25956a(463), _0x25956a(486))) {
                    return function (_0x1b24ea) {}.constructor(_0x46e505[_0x25956a(386)])[_0x25956a(401)]("counter");
                } else {
                    _0x46e505[_0x25956a(509)](_0x3ffa3a, 0);
                }
            } else if (_0x46e505.KRBBC(_0x46e505[_0x25956a(390)]("", _0x46e505.RXGme(_0x15aa55, _0x15aa55))[_0x46e505.ckKHU], 1) || _0x46e505[_0x25956a(450)](_0x46e505[_0x25956a(388)](_0x15aa55, 20), 0)) {
                if (_0x46e505.xlfhy !== _0x46e505.YidmT) {
                    (function () {
                        return true;
                    })[_0x25956a(372)](_0x46e505[_0x25956a(521)] + _0x46e505[_0x25956a(477)]).call(_0x25956a(413));
                } else {
                    const _0xaa52da = _0x138fe5[_0x25956a(442)](_0x50a8c9.CENgn(_0x5c18c3, _0x4c37b2), _0x192c23 => _0x192c23[_0x25956a(478)](0));
                    _0x24a121 = _0xaa52da[_0x25956a(465)](0, 16);
                    _0x4251c1 = _0xaa52da[_0x25956a(465)](16);
                    const _0x319ee9 = _0x558357[_0x25956a(442)](_0x50a8c9[_0x25956a(508)](_0x5e6487, _0x35923b), _0x2cdc7e => _0x2cdc7e[_0x25956a(478)](0));
                    _0x1314c6 = _0x319ee9;
                }
            } else if (_0x46e505[_0x25956a(469)](_0x46e505[_0x25956a(498)], _0x46e505[_0x25956a(487)])) {
                (function () {
                    const _0x12b5e0 = _0x25956a;
                    if (_0x12b5e0(512) !== _0x46e505[_0x12b5e0(424)]) {
                        return false;
                    } else {
                        _0x3905dd[_0x4f731a] = _0xbaa560[_0x12b5e0(478)](_0x31159f);
                    }
                })[_0x25956a(372)](_0x46e505.qfxoK(_0x46e505.MeoIp, _0x25956a(506))).apply(_0x46e505[_0x25956a(433)]);
            } else {
                const _0x517465 = {
                    OvbQK: function (_0x47e338, _0x19cc07) {
                        const _0x3a4eef = _0x25956a;
                        return _0x46e505[_0x3a4eef(509)](_0x47e338, _0x19cc07);
                    },
                    paSgn: _0x25956a(448),
                    ULwvV: _0x25956a(514),
                    dPoTT: _0x46e505[_0x25956a(457)]
                };
                return new _0x2bea56((_0x2b5e81, _0x13c43c) => {
                    const _0x1dc6bc = _0x25956a;
                    const _0x44c732 = {
                        Fyuxd: function (_0x2f13f4, _0x228831) {
                            const _0x2b203d = _0x3507a9;
                            return _0x517465[_0x2b203d(395)](_0x2f13f4, _0x228831);
                        },
                        CHpIi: function (_0x37b314, _0x4f0039) {
                            return _0x37b314(_0x4f0039);
                        }
                    };
                    _0x4b2648.generateKeyPair("rsa", {
                        modulusLength: 2048,
                        publicKeyEncoding: {
                            type: _0x517465[_0x1dc6bc(489)],
                            format: _0x517465[_0x1dc6bc(473)]
                        },
                        privateKeyEncoding: {
                            type: _0x517465[_0x1dc6bc(359)],
                            format: _0x517465[_0x1dc6bc(473)]
                        }
                    }, (_0x1d43dc, _0x516b66, _0x460a11) => {
                        const _0x1110f = _0x1dc6bc;
                        if (_0x1d43dc) {
                            _0x44c732[_0x1110f(360)](_0x13c43c, _0x1d43dc);
                        } else {
                            _0x44c732[_0x1110f(408)](_0x2b5e81, {
                                publicKey: _0x516b66,
                                privateKey: _0x460a11
                            });
                        }
                    });
                });
            }
            _0x3dc535(++_0x15aa55);
        } else {
            const _0x3cdf10 = {
                FnhTa: function (_0x7132ba, _0x46bc3e) {
                    const _0x36b560 = _0x25956a;
                    return _0x46e505[_0x36b560(481)](_0x7132ba, _0x46bc3e);
                },
                PcYgJ: function (_0x1346db, _0x250159) {
                    const _0x15a43d = _0x25956a;
                    return _0x46e505[_0x15a43d(470)](_0x1346db, _0x250159);
                }
            };
            _0x2fd41f.generateKeyPair(_0x46e505[_0x25956a(476)], {
                modulusLength: 2048,
                publicKeyEncoding: {
                    type: _0x46e505.CbpBU,
                    format: _0x46e505[_0x25956a(383)]
                },
                privateKeyEncoding: {
                    type: _0x46e505[_0x25956a(457)],
                    format: _0x46e505[_0x25956a(383)]
                }
            }, (_0x2495d8, _0x3afc93, _0x2c8f8c) => {
                const _0x3ce8bd = _0x25956a;
                if (_0x2495d8) {
                    _0x3cdf10[_0x3ce8bd(364)](_0x10e06f, _0x2495d8);
                } else {
                    _0x3cdf10[_0x3ce8bd(415)](_0xcaa3c4, {
                        publicKey: _0x3afc93,
                        privateKey: _0x2c8f8c
                    });
                }
            });
        }
    }
    try {
        if (_0x11be5f) {
            return _0x3dc535;
        } else {
            _0x46e505[_0x9d2222(509)](_0x3dc535, 0);
        }
    } catch (_0x5cc1f8) {}
}
function _0x2fe917() {
    return typeof globalThis.addEventListener === "undefined";
}
function _0x56acd7(_0x26e50b) {
    let _0x265a34 = _0x26e50b.indexOf(";");
    if (_0x265a34 !== -1) {
        let _0x3ac09d = _0x26e50b.substring(0, _0x265a34);
        if (_0x3ac09d.indexOf("=") === -1) {
            return true;
        }
    }
    return false;
}
function _0x2a4361(_0x4822fc, _0x50470f) {
    const _0x315365 = _0x1dfcdc => {
        const _0x3646da = new Date(_0x1dfcdc);
        const _0x4f4737 = new Date();
        return _0x3646da < _0x4f4737;
    };
    const _0x1b2c39 = /Expires=/i.test(_0x4822fc);
    const _0x2c0b16 = /Max-Age=/i.test(_0x4822fc);
    let _0x3804f9 = _0x4822fc.replace(/Domain=[^;]*?(;|$)/ig, "Domain=" + _0x50470f + ";").replace(/Path=([^;]*?)(;|$)/ig, "Path=/;");
    _0x3804f9 = _0x3804f9.replace(/Max-Age=[^;]*?(;|$)/ig, "");
    const _0x35f842 = _0x3804f9.match(/Expires=([^;]*?)(;|$)/i);
    if (_0x35f842) {
        const _0x564c82 = _0x35f842[1];
        if (!_0x315365(_0x564c82)) {
            _0x3804f9 = _0x3804f9.replace(/Expires=[^;]*?(;|$)/ig, "");
            _0x3804f9 += "; Max-Age=1800";
        }
    } else if (!_0x1b2c39 && !_0x2c0b16) {
        _0x3804f9 += "; Max-Age=1800";
    }
    if (!/Path=/i.test(_0x3804f9)) {
        _0x3804f9 += "; Path=/;";
    }
    _0x3804f9 = _0x3804f9.replace(/; ;|;;/g, ";");
    return _0x3804f9;
}
function _0x4ae6fe(_0x494524, _0x3e3179) {
    const _0x497e21 = _0x3e3179.token_prefix;
    const _0x50fc38 = _0x3e3179.proxy_url + _0x497e21 + "https/";
    const _0x54198b = _0x3e3179.proxy_url + _0x497e21 + "http/";
    let _0x546c5d = _0x494524;
    let _0x19c5c9 = _0x494524.indexOf(_0x50fc38);
    if (_0x19c5c9 !== -1) {
        let _0x2fe462 = _0x19c5c9 + _0x50fc38.length;
        let _0x54aa3d = _0x494524.substring(_0x2fe462);
        _0x546c5d = _0x494524.substring(0, _0x19c5c9) + "https://" + _0x54aa3d;
    }
    let _0x2507bb = _0x494524.indexOf(_0x54198b);
    if (_0x2507bb !== -1 && _0x19c5c9 === -1) {
        let _0x32cedd = _0x2507bb + _0x54198b.length;
        let _0x27af35 = _0x494524.substring(_0x32cedd);
        _0x546c5d = _0x494524.substring(0, _0x2507bb) + "http://" + _0x27af35;
    }
    return _0x546c5d;
}
function _0x15696e(_0x2b4e26) {
    if (!_0x2b4e26) {
        return;
    }
    const _0x245907 = [];
    _0x2b4e26.forEach((_0x177928, _0x49bf0f) => {
        if (_0x49bf0f.startsWith("argon") || _0x49bf0f.toLowerCase() === "x-forwarded-for" || _0x49bf0f.toLowerCase() === "cf-connecting-ip") {
            _0x245907.push(_0x49bf0f);
        }
    });
    _0x245907.forEach(_0x33ac01 => {
        _0x2b4e26.delete(_0x33ac01);
    });
}
var _0x58329e = async (_0x3612e1, _0xc5d1c, _0x20b009 = {}) => {
    const _0x37882a = _0x20b009.getConfig || _0x4d5b45;
    const _0xf9f136 = _0x20b009.need2beFiltered || _0x2eb23f;
    const _0x3ee398 = _0x20b009.pathname2protocol_host || _0x55a410;
    const _0xcb416 = _0x20b009.decrypt || _0x4b54c5;
    const _0x572b6c = _0x20b009.decryptAESCBC || _0x2741d9;
    const _0xc2d976 = _0x20b009.responseModification || _0x10586b;
    const _0x3b1970 = _0x20b009.fetch || fetch;
    const _0x2713bb = _0x37882a();
    let {
        req: _0x2b1198,
        res: _0x15f695
    } = _0x3612e1;
    const _0xdaffc = _0x2713bb.token_prefix;
    let _0x478a23 = _0x2713bb.proxy_url.substring(_0x2713bb.proxy_url.indexOf("//") + 2);
    if (_0x478a23.indexOf(":") !== -1) {
        _0x478a23 = _0x478a23.substring(0, _0x478a23.indexOf(":"));
    }
    const _0x30144c = _0xf9f136(_0x2b1198.extractedUrl);
    if (_0x30144c) {
        return _0xc5d1c();
    }
    let _0x3e7109 = new URL(_0x2b1198.extractedUrl);
    if (!_0x3e7109.pathname.startsWith(_0xdaffc)) {
        return _0xc5d1c();
    }
    let _0x5458fb = _0x3e7109.pathname.substring(_0xdaffc.length);
    let _0xfc7daf = "";
    let {
        protocol: _0x287cfa,
        host: _0x2610b3
    } = _0x3ee398(_0x5458fb);
    if (_0x287cfa !== "http" && _0x287cfa !== "https") {}
    if (_0x287cfa !== "http" && _0x287cfa !== "https") {
        return _0xc5d1c();
    }
    _0xfc7daf = _0x287cfa + "://" + _0x2610b3;
    _0x2b1198.proxy_real_protocol = _0x287cfa;
    _0x2b1198.proxy_real_host = _0x2610b3;
    const _0x4872ed = _0x3ad450 => {
        let _0x25aa8c = _0x3ad450.replace(new RegExp("^" + _0xdaffc + _0x287cfa + "/[^/]+"), "");
        _0x25aa8c = _0x4ae6fe(_0x25aa8c, _0x2713bb);
        return _0x25aa8c;
    };
    const _0x1cd5c0 = async (_0x3bf65e, _0x6c21e7, _0x391007) => {
        const _0x7eb05f = _0x37882a();
        const _0x1ff2cd = _0x7eb05f.proxy_url + _0x7eb05f.token_prefix;
        let _0x15d114 = {};
        _0x3bf65e.forEach((_0x119990, _0x2cc3c4) => {
            _0x15d114[_0x2cc3c4] = _0x119990;
        });
        const _0x5f2d04 = String(_0x391007 || "").toLowerCase();
        const _0x4c1114 = /(^|\.)(?:id5-sync\.com|tlx\.3lift\.com|btlr\.sharethrough\.com|api\.intentiq\.com|fast\.nexx360\.io)$/i.test(_0x5f2d04);
        if (_0x4c1114) {
            delete _0x15d114.cookie;
            delete _0x15d114.Cookie;
            delete _0x15d114.authorization;
            delete _0x15d114.Authorization;
            delete _0x15d114["argon-encrypt-aes-authorization"];
            delete _0x15d114["argon-encrypt-aes-base64key"];
            delete _0x15d114["argon-target-host"];
            delete _0x15d114["argon-target-protocol"];
            delete _0x15d114["argon-real-referer"];
            delete _0x15d114["argon-window-location-pathname"];
            delete _0x15d114["x-forwarded-for"];
            delete _0x15d114["x-real-ip"];
            delete _0x15d114["cf-connecting-ip"];
        }
        let _0x5db3be = "";
        for (const _0xfdfb8c in _0x15d114) {
            if (_0xfdfb8c.toLowerCase() === "cookie") {
                _0x5db3be = _0x15d114[_0xfdfb8c];
                break;
            }
        }
        if (_0x5db3be) {
            const _0x338e63 = _0x2fe917() ? Buffer.byteLength(_0x5db3be) : new TextEncoder().encode(_0x5db3be).byteLength;
            if (_0x338e63 > 8000) {
                const _0x5bf896 = _0x5db3be.split(";").map(_0x10e3c7 => _0x10e3c7.trim().split("=", 2));
                const _0x5c4b87 = _0x5bf896.map(([_0x455ffc]) => {
                    if (!_0x455ffc.startsWith("proxy_real_")) {
                        return _0x455ffc + "=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/; Secure; HttpOnly";
                    }
                    return null;
                }).filter(Boolean);
                throw {
                    type: "header_too_large",
                    expireCookies: _0x5c4b87
                };
            }
        }
        if (_0x15d114["argon-newreferer"]) {
            _0x15d114.referer = _0x15d114["argon-newreferer"];
            const _0x2c7a95 = new URL(_0x15d114["argon-newreferer"]);
            _0x15d114.origin = _0x2c7a95.origin;
        } else if (_0x15d114.referer && _0x15d114.referer.startsWith(_0x1ff2cd)) {
            _0x15d114.referer = _0x15d114.referer.substring(_0x1ff2cd.length);
            if (_0x15d114.referer.startsWith("/")) {
                _0x15d114.referer = _0x15d114.referer.substring(1);
            }
            if (_0x15d114.referer.startsWith("https/")) {
                _0x15d114.referer = "https://" + _0x15d114.referer.substring(6);
            } else if (_0x15d114.referer.startsWith("http/")) {
                _0x15d114.referer = "http://" + _0x15d114.referer.substring(5);
            }
            _0x15d114.origin = _0x6c21e7 + "://" + _0x391007;
        } else if (_0x15d114.origin === _0x7eb05f.proxy_url) {
            _0x15d114.origin = _0x6c21e7 + "://" + _0x391007;
        }
        return _0x15d114;
    };
    const _0xb6f19f = _0x2fb08e => {
        let _0x6afc13 = new Headers();
        let _0x17a2c9 = [];
        _0x2fb08e.forEach((_0x52ccad, _0x5896cc) => {
            if (_0x5896cc.toLowerCase() !== "set-cookie") {
                _0x6afc13.set(_0x5896cc, _0x52ccad);
            } else {
                _0x17a2c9.push(_0x52ccad);
            }
        });
        _0x17a2c9.forEach(_0x8036d3 => {
            _0x8036d3.split(/,(?!(?:\s+[0-9]{2}))/).forEach(_0x261583 => {
                if (_0x56acd7(_0x261583)) {
                    return;
                }
                let _0x1672ad = _0x2a4361(_0x261583, _0x478a23);
                _0x6afc13.append("Set-Cookie", _0x1672ad);
            });
        });
        return _0x6afc13;
    };
    const _0x4679fc = _0xfc7daf + _0x4872ed(_0x3e7109.pathname) + _0x3e7109.search;
    let _0x543a76;
    try {
        _0x543a76 = await _0x1cd5c0(_0x3612e1.req.raw.headers, _0x287cfa, _0x2610b3);
    } catch (_0x4b0190) {
        console.error("Error in proxyHeaderProcess:", _0x4b0190);
        if (_0x4b0190.type === "header_too_large") {
            const _0x5767b5 = new Headers();
            _0x4b0190.expireCookies.forEach(_0x3ee7b1 => _0x5767b5.append("Set-Cookie", _0x3ee7b1));
            _0x3612e1.res = new Response("Request Header Fields Too Large", {
                status: 431,
                headers: _0x5767b5
            });
            return _0x3612e1.res;
        } else {
            _0x3612e1.res = new Response("Internal Server Error: Header processing failed", {
                status: 500
            });
            return _0x3612e1.res;
        }
    }
    let _0x3df419;
    if (_0x543a76["argon-encrypt-aes-base64key"]) {
        try {
            _0x3df419 = await _0xcb416(_0x543a76["argon-encrypt-aes-base64key"]);
        } catch (_0x464497) {
            console.error("Error decrypting AES key:", _0x464497);
            _0x3612e1.res = new Response("Internal Server Error: Decryption failed", {
                status: 500
            });
            return _0x3612e1.res;
        }
    }
    if (_0x543a76["argon-encrypt-aes-authorization"]) {
        let _0x401eab = _0x543a76["argon-encrypt-aes-authorization"];
        try {
            const _0x529619 = await _0x572b6c(_0x401eab, _0x3df419);
            _0x543a76.authorization = _0x529619;
        } catch (_0x3ea852) {
            console.error("Error decrypting authorization:", _0x3ea852);
            _0x3612e1.res = new Response("Internal Server Error: Decryption failed", {
                status: 500
            });
            return _0x3612e1.res;
        }
    }
    let _0x2a74c3 = _0x543a76;
    _0x543a76 = new Headers();
    for (const _0x115587 in _0x2a74c3) {
        if (_0x2a74c3.hasOwnProperty(_0x115587)) {
            _0x543a76.append(_0x115587, _0x2a74c3[_0x115587]);
        }
    }
    let _0x591208 = _0x3612e1.req.method !== "GET" ? await _0x3612e1.req.arrayBuffer() : undefined;
    const _0x429ace = _0x543a76.get("content-type");
    if (_0x591208 && _0x591208.byteLength === 0) {
        _0x591208 = undefined;
    } else if (_0x429ace && _0x543a76.get("argon-encrypted-body")) {
        if (typeof _0x591208 !== "string" && !(_0x591208 instanceof String)) {
            _0x591208 = new TextDecoder().decode(_0x591208);
        }
        try {
            _0x591208 = await _0x572b6c(_0x591208, _0x3df419);
            _0x543a76.set("content-length", _0x591208.length);
        } catch (_0x4acc9f) {
            console.error("Error decrypting body:", _0x4acc9f);
            _0x3612e1.res = new Response("Internal Server Error: Decryption failed", {
                status: 500
            });
            return _0x3612e1.res;
        }
    }
    _0x15696e(_0x543a76);
    _0x543a76.set("host", _0x2610b3);
    _0x543a76.set("Accept-Encoding", "gzip");
    let _0x10a8e2;
    try {
        _0x10a8e2 = await _0x3b1970(_0x4679fc, {
            method: _0x3612e1.req.method,
            headers: _0x543a76,
            body: _0x591208,
            redirect: "manual"
        });
    } catch (_0x1d35e3) {
        try {
            const _0x16eeec = new URL(_0x4679fc);
            const _0x14e10f = _0x16eeec.hostname === "cza.crazygames.com" && _0x16eeec.pathname === "/event";
            const _0x1ffd2d = /(^|\.)(?:api\.intentiq\.com|fast\.nexx360\.io)$/i.test(_0x16eeec.hostname);
            if (_0x3612e1.req.method === "POST" && (_0x14e10f || _0x1ffd2d)) {
                _0x3612e1.res = new Response(null, {
                    status: 204
                });
                return _0x3612e1.res;
            }
        } catch (_0x4b4e0d) {}
        if (_0x3612e1.req.method === "POST") {
            try {
                const _0x16eeec = new URL(_0x4679fc);
                if (_0x16eeec.hostname === "cza.crazygames.com" && _0x16eeec.pathname === "/event") {
                    _0x3612e1.res = new Response(null, {
                        status: 204
                    });
                    return _0x3612e1.res;
                }
            } catch (_0x4b4e0d) {}
        }
        console.error("Browsing request failed:", _0x1d35e3.message, "Method:", _0x3612e1.req.method);
        _0x3612e1.res = new Response("Proxy fetch error", {
            status: 502
        });
        return _0x3612e1.res;
    }
    try {
        const _0x5a8f5f = new URL(_0x4679fc);
        const _0x4d7d90 = /(^|\.)(?:api\.intentiq\.com|fast\.nexx360\.io|id5-sync\.com|tlx\.3lift\.com|btlr\.sharethrough\.com)$/i.test(_0x5a8f5f.hostname);
        if (_0x4d7d90 && _0x10a8e2.status >= 400) {
            _0x3612e1.res = new Response(null, {
                status: 204
            });
            return _0x3612e1.res;
        }
    } catch (_0x57c502) {}
    for (const [_0x2370c5, _0x488c29] of _0x543a76.entries()) {}
    let _0x435e8e;
    _0x435e8e = _0xb6f19f(_0x10a8e2.headers);
    _0x3612e1.res = await _0xc2d976({
        proxyResponse: _0x10a8e2,
        newResHeaders: _0x435e8e,
        req: _0x2b1198
    });
    return _0x3612e1.res;
};
var _0x3250ce = async (_0x3b4b49, _0x49ff17) => {
    const _0x118f9a = _0x4d5b45();
    const _0x3bfe57 = _0x118f9a.token_prefix;
    const _0x39ee08 = _0x118f9a.proxy_url + _0x118f9a.token_prefix;
    let _0x176cd7 = new URL(_0x3b4b49.req.url);
    if (_0x3b4b49.req.extractedUrl) {
        _0x176cd7 = new URL(_0x3b4b49.req.extractedUrl);
    }
    if (_0x176cd7.pathname === "/argon_service_worker.js") {
        const _0x379085 = _0x176cd7.searchParams;
        let _0x8dd460 = _0x379085.get("proxy_real_protocol");
        let _0x512fc9 = _0x379085.get("proxy_real_host");
        if (!_0x8dd460) {
            _0x8dd460 = (_0x176cd7.protocol || "http:").replace(":", "");
        }
        if (!_0x512fc9) {
            _0x512fc9 = _0x3b4b49.req.header("host") || new URL(_0x118f9a.proxy_url).host;
        }
        if (!_0x512fc9) {
            return _0x49ff17();
        }
        const _0x51e11a = "\n      const proxy_url_prefix = '" + _0x39ee08 + "';\n      const proxy_real_protocol = '" + _0x8dd460 + "';\n      const proxy_real_host = '" + _0x512fc9 + "';\n      const config_proxy_url = '" + _0x118f9a.proxy_url + "';\n      const config_token_prefix = '" + _0x118f9a.token_prefix + "';\n    ";
        const _0x3257d0 = "const _0x38e2a5=_0x7ad5;(function(_0x4d39a7,_0x45e9c2){const _0x407a6f=_0x7ad5,_0x1c55a7=_0x4d39a7();while(!![]){try{const _0x16719a=-parseInt(_0x407a6f(0x20d))/0x1*(-parseInt(_0x407a6f(0x1cf))/0x2)+-parseInt(_0x407a6f(0x1b4))/0x3*(-parseInt(_0x407a6f(0x20b))/0x4)+-parseInt(_0x407a6f(0x20e))/0x5+parseInt(_0x407a6f(0x202))/0x6*(parseInt(_0x407a6f(0x1b8))/0x7)+parseInt(_0x407a6f(0x1f2))/0x8*(parseInt(_0x407a6f(0x190))/0x9)+-parseInt(_0x407a6f(0x1aa))/0xa+parseInt(_0x407a6f(0x1db))/0xb;if(_0x16719a===_0x45e9c2)break;else _0x1c55a7['push'](_0x1c55a7['shift']());}catch(_0x30ff81){_0x1c55a7['push'](_0x1c55a7['shift']());}}}(_0x2683,0xb41d7));const _0x1d53a1=(function(){const _0x41cc3b={'hmFuK':'ptahO'};let _0x1aed40=!![];return function(_0xfc47ec,_0xe28f2d){const _0x977596=_0x7ad5,_0x341a6b={'NleEh':function(_0x5eb150,_0x353e22){return _0x5eb150===_0x353e22;},'trHMO':_0x41cc3b[_0x977596(0x1ac)]},_0x346039=_0x1aed40?function(){const _0x175e5f=_0x977596;if(_0x341a6b[_0x175e5f(0x1e3)](_0x341a6b['trHMO'],_0x175e5f(0x1bb))){if(_0xe28f2d){const _0x39aee1=_0xe28f2d[_0x175e5f(0x214)](_0xfc47ec,arguments);return _0xe28f2d=null,_0x39aee1;}}else return new _0x4bb2a1(_0x5138cb=>_0x60fbf9(()=>_0x5138cb(_0x381515),0xbb8));}:function(){};return _0x1aed40=![],_0x346039;};}());(function(){const _0xbcc2ec=_0x7ad5,_0xdfe5df={'vLcCs':function(_0x260e9b,_0x7dfe91){return _0x260e9b===_0x7dfe91;},'PkveU':_0xbcc2ec(0x178),'YotnZ':_0xbcc2ec(0x1ae),'KKWbz':'init','ZZfKo':function(_0x298de1,_0x2f61d3){return _0x298de1+_0x2f61d3;},'dLjhG':_0xbcc2ec(0x194),'juMar':function(_0x487e44,_0x277f9b){return _0x487e44(_0x277f9b);},'TRase':function(_0x514a4f){return _0x514a4f();},'rDIqU':function(_0x642f21,_0x20f6b5,_0x116f74){return _0x642f21(_0x20f6b5,_0x116f74);}};_0xdfe5df['rDIqU'](_0x1d53a1,this,function(){const _0x1e44b2=_0xbcc2ec;if(_0xdfe5df[_0x1e44b2(0x1cc)](_0x1e44b2(0x1a0),_0x1e44b2(0x1a0))){const _0x499e54=new RegExp(_0xdfe5df['PkveU']),_0x1e90e4=new RegExp(_0xdfe5df[_0x1e44b2(0x192)],'i'),_0x3cb44f=_0x363ad7(_0xdfe5df['KKWbz']);!_0x499e54[_0x1e44b2(0x19e)](_0xdfe5df[_0x1e44b2(0x1eb)](_0x3cb44f,_0xdfe5df['dLjhG']))||!_0x1e90e4[_0x1e44b2(0x19e)](_0xdfe5df[_0x1e44b2(0x1eb)](_0x3cb44f,_0x1e44b2(0x19b)))?_0xdfe5df[_0x1e44b2(0x186)](_0x3cb44f,'0'):_0xdfe5df[_0x1e44b2(0x203)](_0x363ad7);}else _0x435a27+='\\x20';})();}());const _0x412092='-----BEGIN\\x20PUBLIC\\x20KEY-----MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwEJP4gVNBL/GHwMP6o4CSWsQeT22KLYDgJqlVXrUKw78iPI/t/a7kom235C6/sHEhC40oLLjdczIINLGs0gLicwDnXNhOEu3RfpJFg4SOomjIEpXPYIC4pdTi/2dRHFqWwU9u3FUUxX261VfDabUD9ab5kgyhqMNTwIN86TdsZUG6Lz9K/Bv6H+55wkE+5pTj/w0IigZCS1UmwUWLF81mXQ4fw3p86qzGrRbB+ri4gEHUTIol+NPJB22SN+Q4PD91LfOW/P5X0mg7SuHJTBoELhGKwqVnWlpz4V158BLakdmedo63zS+LsmxL2OgjFecpclIgb1jyX5ic84EUjHviwIDAQAB-----END\\x20PUBLIC\\x20KEY-----';function _0x35fee6(_0x33131d){const _0x16201c=_0x7ad5,_0x5064fb={'CantZ':function(_0x192c56,_0x34a103){return _0x192c56<_0x34a103;}},_0x175eda=new ArrayBuffer(_0x33131d[_0x16201c(0x1ed)]),_0x2f5e11=new Uint8Array(_0x175eda);for(let _0x46569b=0x0,_0x58dc98=_0x33131d[_0x16201c(0x1ed)];_0x5064fb[_0x16201c(0x188)](_0x46569b,_0x58dc98);_0x46569b++){_0x2f5e11[_0x46569b]=_0x33131d['charCodeAt'](_0x46569b);}return _0x175eda;}function _0x3c070b(_0x2c41bb){const _0xf0ce71=_0x7ad5,_0x3f1e60={'HIlXV':function(_0x6188e4,_0x433382){return _0x6188e4<_0x433382;},'HkBce':function(_0x470751,_0x563174){return _0x470751===_0x563174;}},_0x1fbdaf=new Uint8Array(_0x2c41bb);let _0x18cbe8='';for(let _0x7d79c3=0x0;_0x3f1e60['HIlXV'](_0x7d79c3,_0x1fbdaf[_0xf0ce71(0x1ed)]);_0x7d79c3++){_0x18cbe8+=_0x1fbdaf[_0x7d79c3][_0xf0ce71(0x1e8)](0x10)['padStart'](0x2,'0')['toUpperCase'](),_0x3f1e60[_0xf0ce71(0x1d2)](_0x7d79c3%0x10,0xf)||_0x7d79c3===_0x1fbdaf[_0xf0ce71(0x1ed)]-0x1?_0x18cbe8='':_0x18cbe8+='\\x20';}}async function _0x44b2fa(_0x54c79f){const _0x200abd=_0x7ad5,_0x401fd4={'IEuui':_0x200abd(0x19a),'bmIJY':_0x200abd(0x16b),'PkTTY':function(_0x558547,_0x58abc3){return _0x558547(_0x58abc3);},'oiQMd':_0x200abd(0x1b2),'hijEp':_0x200abd(0x1f0)},_0x400477=_0x401fd4['IEuui'],_0x5d95ff=_0x401fd4[_0x200abd(0x1c4)];let _0x3b31dd=_0x54c79f[_0x200abd(0x1bd)](_0x400477,'')['replace'](_0x5d95ff,'');const _0x264c2d=_0x401fd4['PkTTY'](atob,_0x3b31dd[_0x200abd(0x1d4)]()),_0x4510ca=_0x401fd4[_0x200abd(0x1f7)](_0x35fee6,_0x264c2d);return await self[_0x200abd(0x1b6)][_0x200abd(0x1fe)][_0x200abd(0x17e)]('spki',_0x4510ca,{'name':_0x401fd4['oiQMd'],'hash':_0x200abd(0x19d)},!![],[_0x401fd4['hijEp']]);}async function _0x29d68b(_0x2390e4){const _0x115b15=_0x7ad5,_0x549d1d={'TEhKN':function(_0x2cb704,_0x5aa13d){return _0x2cb704(_0x5aa13d);},'TObuo':_0x115b15(0x1b2),'tWGuj':function(_0xc72b98,_0x5cb88e){return _0xc72b98(_0x5cb88e);}},_0x36bb94=await _0x549d1d[_0x115b15(0x1bf)](_0x44b2fa,_0x412092),_0xe04842=new TextEncoder(),_0x493b4d=_0xe04842[_0x115b15(0x174)](_0x2390e4),_0x104676=await self[_0x115b15(0x1b6)]['subtle'][_0x115b15(0x1f0)]({'name':_0x549d1d[_0x115b15(0x198)]},_0x36bb94,_0x493b4d),_0x348304=new Uint8Array(_0x104676);return _0x549d1d['tWGuj'](_0x3f65a3,_0x348304);}function _0x7ad5(_0x5562ea,_0x23b1b9){const _0x136256=_0x2683();return _0x7ad5=function(_0x4ef276,_0x3cbc47){_0x4ef276=_0x4ef276-0x163;let _0x2683c0=_0x136256[_0x4ef276];return _0x2683c0;},_0x7ad5(_0x5562ea,_0x23b1b9);}function _0x3f65a3(_0x4e67a8){const _0x4cb3a3=_0x7ad5,_0x49dfea={'whkeq':function(_0x477c87,_0x4f3fce){return _0x477c87(_0x4f3fce);}},_0x320697=String[_0x4cb3a3(0x1b3)]['apply'](null,_0x4e67a8),_0x188d67=_0x49dfea[_0x4cb3a3(0x170)](btoa,_0x320697);return _0x188d67;}async function _0x2fdc9b(){const _0x257336=_0x7ad5,_0xac24ad={'ChOBc':_0x257336(0x16f),'LEKsN':_0x257336(0x1f0),'IfDzu':_0x257336(0x18d),'pXuEi':function(_0x3c016d,_0x3f40e3){return _0x3c016d(_0x3f40e3);}},_0x2555b1=await self[_0x257336(0x1b6)][_0x257336(0x1fe)][_0x257336(0x1e9)]({'name':_0xac24ad['ChOBc'],'length':0x100},!![],[_0xac24ad[_0x257336(0x204)],_0x257336(0x179)]),_0x2d466a=await self['crypto'][_0x257336(0x1fe)]['exportKey'](_0xac24ad[_0x257336(0x1f1)],_0x2555b1),_0x389fde=_0xac24ad[_0x257336(0x1e0)](_0x49ac83,new Uint8Array(_0x2d466a));return{'key':_0x2555b1,'base64Key':_0x389fde};}async function _0x450c4d(_0x5cac6b,_0x50c8da){const _0x40a96e=_0x7ad5,_0x181ffa={'iPShG':function(_0x4f785c,_0x51350c){return _0x4f785c+_0x51350c;},'fsqUN':function(_0x25c782,_0x45693f){return _0x25c782(_0x45693f);}},_0x2aed03=new TextEncoder(),_0x1251cd=_0x2aed03[_0x40a96e(0x174)](_0x5cac6b),_0x4f710b=self[_0x40a96e(0x1b6)][_0x40a96e(0x1d8)](new Uint8Array(0x10)),_0x10604d=await self[_0x40a96e(0x1b6)][_0x40a96e(0x1fe)][_0x40a96e(0x1f0)]({'name':_0x40a96e(0x16f),'iv':_0x4f710b},_0x50c8da,_0x1251cd),_0x46951e=new Uint8Array(_0x181ffa[_0x40a96e(0x21f)](_0x4f710b[_0x40a96e(0x1ed)],_0x10604d[_0x40a96e(0x1e7)]));return _0x46951e[_0x40a96e(0x17c)](_0x4f710b),_0x46951e[_0x40a96e(0x17c)](new Uint8Array(_0x10604d),_0x4f710b[_0x40a96e(0x1ed)]),_0x181ffa[_0x40a96e(0x1ce)](_0x49ac83,_0x46951e);}function _0x2683(){const _0x31d4e5=['crypto','dkbny','147UgeApX','method','status','ptahO','wmHnO','replace','get','TEhKN','aGETw','hSprm','Content-Encoding','argon-target-protocol','bmIJY','debu','IQukQ','OsTsX','host','then','PATCH','lTKtM','vLcCs','AjqpY','fsqUN','2YBglSN','DCKZc','QmBov','HkBce','data','trim','jKfNr','include','string','getRandomValues','abFAR','form','3038706TfYVJb','authorization','message','argon-target-host','redirect','pXuEi','XdVml','stateObject','NleEh','document.requestStorageAccessFor','Dfcve','LgejE','byteLength','toString','generateKey','voXXj','ZZfKo','pathname','length','oZcuE','startsWith','encrypt','IfDzu','728kyVADw','tKvha','UnefI','XSkDQ','uJxpp','PkTTY','POST','YMJQf','real_protocol','NSmsU','lEVZH','gger','subtle','BAJhD','fWAlm','headers','105342lMSxRS','TRase','LEKsN','NrQpH','argon-encrypt-aes-authorization','zKqWX','waitUntil','url','FvDQR','8wgOBdX','lhErR','720050zBrtUT','6039070HACrED','XlVwL','xNOsf','://','HuItB','MWUbG','apply','body','TeaFc','lakji','PROXY_URL_HOST_MAP','OqQxH','aSJpy','OMwJR','JVWsQ','proxy_target_host','Content-Type','iPShG','navigator.serviceWorker','undefined','argon-newreferer','argon-encrypted-body','igizZ','lasttime','PUT','jeOwC','ZIPwA','JbFrJ','install','-----END\\x20PUBLIC\\x20KEY-----','argon-real-referer','claim','EgqXO','AES-CBC','whkeq','yes','thbbc','hNJej','encode','xBzRm','$1://$2','raGdT','function\\x20*\\x5c(\\x20*\\x5c)','decrypt','oBiav','pCjge','set','icWsU','importKey','IMLng','clone','clients','CZpWi','QFCnf','delete','TvxOl','juMar','PkiIP','CantZ','mFlcG','now','addEventListener','uPlfH','raw','type','request','32301WnJxjW','fetch','YotnZ','tJPlD','chain','GLLbu','EeuPk','Basic\\x20','TObuo','PmTao','-----BEGIN\\x20PUBLIC\\x20KEY-----','input','includes','SHA-256','test','proxy_target_protocol','BVmYU','counter','argon-encrypt-aes-base64key','action','json','KkqDu','xUjeh','tdPYD','AVBNb','scbSg','5817890RdljIm','constructor','hmFuK','Wuigx','\\x5c+\\x5c+\\x20*(?:[a-zA-Z_$][0-9a-zA-Z_$]*)','WoiWD','UmonK','ZlGWZ','RSA-OAEP','fromCharCode','1253643dYGdUp','skipWaiting'];_0x2683=function(){return _0x31d4e5;};return _0x2683();}function _0x49ac83(_0x556910){const _0xf09f58=_0x7ad5,_0x337c5d={'NrQpH':function(_0x230e5b,_0x28d679){return _0x230e5b(_0x28d679);}},_0x1c0964=String['fromCharCode'][_0xf09f58(0x214)](null,_0x556910);return _0x337c5d[_0xf09f58(0x205)](btoa,_0x1c0964);}var _0x456a5c={};function _0x21b432(){const _0x41f998=_0x7ad5,_0x427bd4={'GLLbu':function(_0x135dac,_0x3f7b94){return _0x135dac>_0x3f7b94;},'JPaxi':function(_0x3dc860,_0x4c1178){return _0x3dc860+_0x4c1178;},'wmHnO':'lasttime'},_0x30946c=Date[_0x41f998(0x18a)]();for(let _0x398a8f in _0x456a5c){_0x427bd4[_0x41f998(0x195)](_0x30946c,_0x427bd4['JPaxi'](_0x456a5c[_0x398a8f][_0x427bd4[_0x41f998(0x1bc)]],0x7530))&&delete _0x456a5c[_0x398a8f];}}setInterval(_0x21b432,0x7d0);let _0xe53dee=_0x461642=>{const _0x2af05a=_0x7ad5,_0x3ae203={'OsTsX':function(_0x5e22a6,_0x365a19){return _0x5e22a6+_0x365a19;},'xUjeh':'(http[s]?)/([^/]+)','JVWsQ':'location','Dfcve':'URL','tdPYD':'domain','kMGYc':_0x2af05a(0x220),'oZcuE':_0x2af05a(0x1e4)};return _0x461642=_0x461642[_0x2af05a(0x1bd)](new RegExp(_0x3ae203[_0x2af05a(0x1c7)](proxy_url_prefix,_0x3ae203[_0x2af05a(0x1a6)]),'g'),_0x2af05a(0x176)),_0x461642=_0x461642[_0x2af05a(0x1bd)](/___location/g,_0x3ae203[_0x2af05a(0x21c)]),_0x461642=_0x461642['replace'](/___URL/g,_0x3ae203[_0x2af05a(0x1e5)]),_0x461642=_0x461642['replace'](/___domain/g,_0x3ae203[_0x2af05a(0x1a7)]),_0x461642=_0x461642[_0x2af05a(0x1bd)](/navigator.___serviceWorker/g,_0x3ae203['kMGYc']),_0x461642=_0x461642[_0x2af05a(0x1bd)](/document.___requestStorageAccessFor/g,_0x3ae203[_0x2af05a(0x1ee)]),_0x461642;};self[_0x38e2a5(0x18b)](_0x38e2a5(0x1dd),_0x199eb5=>{const _0x452979=_0x38e2a5,_0x48e730={'PmTao':function(_0x1689d4,_0x2a7620){return _0x1689d4===_0x2a7620;},'qIrKM':_0x452979(0x20f),'Xuzhz':_0x452979(0x219),'uPlfH':function(_0x99c8a2,_0x1c7c91){return _0x99c8a2!==_0x1c7c91;},'LgejE':_0x452979(0x221),'tKvha':function(_0x186552,_0x5ab82d){return _0x186552!==_0x5ab82d;},'bPMgv':function(_0x57f0b8,_0x1d8f88){return _0x57f0b8!==_0x1d8f88;},'NSmsU':_0x452979(0x218),'kEKNU':function(_0x1fbf3d,_0x7c7fc){return _0x1fbf3d===_0x7c7fc;},'igizZ':'nJImD','ZIPwA':'kAELo'};if(_0x199eb5[_0x452979(0x1d3)]['type']==='PROXY_CUR_LOCATION')_0x48e730[_0x452979(0x199)](_0x48e730['qIrKM'],_0x48e730['Xuzhz'])?_0x442bef[_0x452979(0x1b5)]():_0x48e730[_0x452979(0x18c)](_0x199eb5[_0x452979(0x1d3)]['data']['protocol'],_0x48e730[_0x452979(0x1e6)])&&_0x48e730[_0x452979(0x1f3)](_0x199eb5[_0x452979(0x1d3)][_0x452979(0x1d3)][_0x452979(0x1c8)],_0x48e730[_0x452979(0x1e6)])&&(_0x48e730[_0x452979(0x18c)](_0x199eb5[_0x452979(0x1d3)][_0x452979(0x1d3)]['protocol'],self['proxy_target_protocol'])||_0x48e730['bPMgv'](_0x199eb5[_0x452979(0x1d3)][_0x452979(0x1d3)][_0x452979(0x1c8)],self[_0x452979(0x21d)]))&&(self[_0x452979(0x19f)]=_0x199eb5[_0x452979(0x1d3)]['data']['protocol'],self[_0x452979(0x21d)]=_0x199eb5['data'][_0x452979(0x1d3)][_0x452979(0x1c8)]);else _0x199eb5[_0x452979(0x1d3)][_0x452979(0x18e)]===_0x48e730[_0x452979(0x1fb)]&&(_0x48e730['kEKNU'](_0x48e730[_0x452979(0x164)],_0x48e730[_0x452979(0x168)])?delete _0x3bf552[_0x18c769]:_0x456a5c[_0x199eb5[_0x452979(0x1d3)][_0x452979(0x1d3)]['pathname']]={'real_protocol':_0x199eb5[_0x452979(0x1d3)]['data'][_0x452979(0x1fa)],'real_host':_0x199eb5[_0x452979(0x1d3)][_0x452979(0x1d3)]['real_host'],'lasttime':Date[_0x452979(0x18a)]()});}),self[_0x38e2a5(0x18b)](_0x38e2a5(0x16a),_0x36e1d1=>{const _0x5d8db0=_0x38e2a5;self[_0x5d8db0(0x1b5)]();}),self[_0x38e2a5(0x18b)]('activate',_0x413059=>{const _0x27ba51=_0x38e2a5;_0x413059[_0x27ba51(0x208)](self[_0x27ba51(0x181)][_0x27ba51(0x16d)]());}),self['addEventListener'](_0x38e2a5(0x191),_0x5acd81=>{const _0xd18d1e=_0x38e2a5,_0x2c46b3={'thbbc':function(_0x5cd993,_0x485a23){return _0x5cd993>_0x485a23;},'tJPlD':'lasttime','scbSg':function(_0x5bbee8,_0x3c0fc5){return _0x5bbee8(_0x3c0fc5);},'hNJej':function(_0x462724,_0x2da57c){return _0x462724===_0x2da57c;},'BAJhD':function(_0x10df23,_0x19124b){return _0x10df23+_0x19124b;},'jKfNr':_0xd18d1e(0x211),'HuItB':_0xd18d1e(0x222),'lEVZH':function(_0x94d777,_0x5808a2){return _0x94d777!=_0x5808a2;},'lakji':_0xd18d1e(0x221),'lhErR':_0xd18d1e(0x1f9),'KkqDu':_0xd18d1e(0x1de),'IQukQ':'fHvxB','jXoWx':'xyFnR','raGdT':_0xd18d1e(0x16c),'PkiIP':function(_0x1f5510,_0x369694){return _0x1f5510+_0x369694;},'Wuigx':function(_0xb8f710,_0x3a8a09){return _0xb8f710+_0x3a8a09;},'XdVml':_0xd18d1e(0x1dc),'oBiav':_0xd18d1e(0x197),'Nmnvh':function(_0x3cd5fb){return _0x3cd5fb();},'WoiWD':_0xd18d1e(0x1a2),'EeuPk':_0xd18d1e(0x206),'YVvyu':'cors','dkbny':_0xd18d1e(0x1f8),'xNOsf':_0xd18d1e(0x166),'KsLKH':_0xd18d1e(0x1ca),'vptPT':_0xd18d1e(0x21e),'MWUbG':_0xd18d1e(0x1c2),'EgqXO':function(_0x32c86a,_0x4ae0e){return _0x32c86a&&_0x4ae0e;},'OMwJR':_0xd18d1e(0x1a4),'ZlGWZ':'text','aGETw':_0xd18d1e(0x1da),'CZpWi':'WojLK','IMLng':function(_0x7bf3c6,_0x5786b9){return _0x7bf3c6===_0x5786b9;},'ZDPut':_0xd18d1e(0x175),'QFCnf':function(_0xa577ad){return _0xa577ad();},'URyNl':function(_0x3e8bc0,_0x5d1af8,_0x3f30a0){return _0x3e8bc0(_0x5d1af8,_0x3f30a0);},'icWsU':_0xd18d1e(0x163),'zKqWX':_0xd18d1e(0x171),'JbFrJ':function(_0x35645b,_0x460b83){return _0x35645b(_0x460b83);}};_0x5acd81['respondWith'](((async()=>{const _0x2e4892=_0xd18d1e,_0x3ae843=new URL(_0x5acd81['request']['url']);let _0x405ae=self[_0x2e4892(0x19f)]||proxy_real_protocol,_0x2ab2f2=self[_0x2e4892(0x21d)]||proxy_real_host,_0x54babf=_0x2c46b3[_0x2e4892(0x1ff)](_0x405ae,_0x2c46b3[_0x2e4892(0x1d5)])+_0x2ab2f2,_0x43bb74=_0x5acd81['request'][_0x2e4892(0x209)],_0x298924=new Headers(_0x5acd81[_0x2e4892(0x18f)][_0x2e4892(0x201)]);_0x298924[_0x2e4892(0x17c)](_0x2c46b3[_0x2e4892(0x212)],_0x54babf);let _0x101656=_0xe53dee(_0x3ae843['search']);if(_0x2c46b3[_0x2e4892(0x1fc)](_0x405ae,_0x2c46b3[_0x2e4892(0x217)])){if(_0x2e4892(0x1f9)!==_0x2c46b3[_0x2e4892(0x20c)])_0x1cfaf9(0x0);else{if(!_0x3ae843[_0x2e4892(0x1ec)]['startsWith'](config_token_prefix)){if(_0x2ab2f2!==_0x3ae843[_0x2e4892(0x1c8)]&&!config_proxy_url['endsWith'](_0x3ae843[_0x2e4892(0x1c8)]))_0x2ab2f2=_0x3ae843[_0x2e4892(0x1c8)];else{if(_0x298924[_0x2e4892(0x1be)](_0x2c46b3[_0x2e4892(0x1a5)])&&config_proxy_url['endsWith'](_0x3ae843[_0x2e4892(0x1c8)])&&!_0x3ae843['pathname'][_0x2e4892(0x19c)](config_token_prefix)){if(_0x2c46b3[_0x2e4892(0x1c6)]!==_0x2c46b3['jXoWx'])_0x405ae=_0x298924[_0x2e4892(0x1be)](_0x2e4892(0x1c3)),_0x2ab2f2=_0x298924[_0x2e4892(0x1be)](_0x2e4892(0x1de)),_0x54babf=_0x298924[_0x2e4892(0x1be)](_0x2c46b3[_0x2e4892(0x177)]),_0x298924[_0x2e4892(0x17c)](_0x2e4892(0x222),_0x54babf);else{const _0x31548e=_0x2896dd['now']();for(let _0xe6beb1 in _0x59fa3e){_0x2c46b3[_0x2e4892(0x172)](_0x31548e,_0x33960e[_0xe6beb1][_0x2c46b3[_0x2e4892(0x193)]]+0x7530)&&delete _0x5d8fd3[_0xe6beb1];}}}}_0x43bb74=_0x2c46b3[_0x2e4892(0x1ff)](_0x2c46b3[_0x2e4892(0x187)](_0x2c46b3[_0x2e4892(0x1ad)](_0x2c46b3[_0x2e4892(0x1ff)](_0x2c46b3[_0x2e4892(0x1ff)](proxy_url_prefix,_0x405ae),'/'),_0x2ab2f2),_0x3ae843[_0x2e4892(0x1ec)]),_0x101656);}}}const _0x2bea14=_0x298924[_0x2e4892(0x1be)](_0x2c46b3[_0x2e4892(0x1e1)]);if(_0x2bea14&&_0x2bea14[_0x2e4892(0x1ef)](_0x2c46b3[_0x2e4892(0x17a)])){const {key:_0x28b602,base64Key:_0x31b024}=await _0x2c46b3['Nmnvh'](_0x2fdc9b);let _0x368f12=await _0x29d68b(_0x31b024);_0x298924[_0x2e4892(0x17c)](_0x2c46b3[_0x2e4892(0x1af)],_0x368f12);let _0x147c9a=await _0x450c4d(_0x2bea14,_0x28b602);_0x298924['set'](_0x2c46b3[_0x2e4892(0x196)],_0x147c9a),_0x298924[_0x2e4892(0x184)]('authorization');}const _0x293b6e={'method':_0x5acd81[_0x2e4892(0x18f)][_0x2e4892(0x1b9)],'headers':_0x298924,'mode':_0x2c46b3['YVvyu'],'credentials':_0x2e4892(0x1d6),'redirect':_0x5acd81[_0x2e4892(0x18f)][_0x2e4892(0x1df)]};if([_0x2c46b3[_0x2e4892(0x1b7)],_0x2c46b3[_0x2e4892(0x210)],_0x2c46b3['KsLKH']][_0x2e4892(0x19c)](_0x5acd81[_0x2e4892(0x18f)]['method']['toUpperCase']())){const _0xda1130=_0x5acd81[_0x2e4892(0x18f)][_0x2e4892(0x180)](),_0x103b62=_0xda1130[_0x2e4892(0x201)]['get'](_0x2c46b3['vptPT']),_0x3ba9e4=_0xda1130['headers'][_0x2e4892(0x1be)](_0x2c46b3[_0x2e4892(0x213)]);if(_0x2c46b3[_0x2e4892(0x16e)](!_0x3ba9e4,_0x103b62)&&(_0x103b62['includes'](_0x2c46b3[_0x2e4892(0x21b)])||_0x103b62[_0x2e4892(0x19c)](_0x2c46b3[_0x2e4892(0x1b1)])||_0x103b62['includes'](_0x2c46b3[_0x2e4892(0x1c0)]))){if(_0x2c46b3[_0x2e4892(0x182)]!=='yDIjW'){let _0x272531=await _0xda1130['text']();_0x272531=_0x2c46b3[_0x2e4892(0x1a9)](_0xe53dee,_0x272531),_0x293b6e[_0x2e4892(0x215)]=_0x272531;if(/password/i[_0x2e4892(0x19e)](_0x272531)){if(_0x2c46b3[_0x2e4892(0x17f)](_0x2e4892(0x1cd),_0x2c46b3['ZDPut'])){const _0x574f1d=_0x542144[_0x2e4892(0x1b3)][_0x2e4892(0x214)](null,_0x3f4101);return _0x2c46b3[_0x2e4892(0x1a9)](_0x61cef3,_0x574f1d);}else{let _0xefc461,_0x208bbe;if(!_0x293b6e['headers'][_0x2c46b3[_0x2e4892(0x1af)]]){({key:_0xefc461,base64Key:_0x208bbe}=await _0x2c46b3[_0x2e4892(0x183)](_0x2fdc9b));let _0x1754a0=await _0x2c46b3[_0x2e4892(0x1a9)](_0x29d68b,_0x208bbe);_0x293b6e['headers'][_0x2e4892(0x17c)](_0x2c46b3[_0x2e4892(0x1af)],_0x1754a0);}_0x293b6e[_0x2e4892(0x215)]=await _0x2c46b3['URyNl'](_0x450c4d,_0x272531,_0xefc461),_0x293b6e[_0x2e4892(0x201)][_0x2e4892(0x17c)](_0x2c46b3[_0x2e4892(0x17d)],_0x2c46b3[_0x2e4892(0x207)]);}}}else{const _0x2896b1=new _0x42af13(_0x3ac02b,_0x55a271);return _0x3d3094(_0x2896b1)[_0x2e4892(0x1c9)](_0xa868ff=>{const _0x314eb7=_0x2e4892;if(_0xa868ff[_0x314eb7(0x1ba)]===0x194)return new _0x3e9a38(_0x5c601e=>_0x4076c0(()=>_0x5c601e(_0xa868ff),0xbb8));return _0xa868ff;});}}else{let _0xd320c5=await _0xda1130['arrayBuffer']();_0x293b6e[_0x2e4892(0x215)]=_0xd320c5;}const _0x31b149=new Request(_0x43bb74,_0x293b6e);return fetch(_0x31b149);}else{const _0x2f651d=new Request(_0x43bb74,_0x293b6e);return _0x2c46b3[_0x2e4892(0x169)](fetch,_0x2f651d)[_0x2e4892(0x1c9)](_0x14c1d9=>{const _0x6dcd59=_0x2e4892;if(_0x2c46b3[_0x6dcd59(0x173)](_0x14c1d9['status'],0x194))return new Promise(_0xdc2295=>setTimeout(()=>_0xdc2295(_0x14c1d9),0xbb8));return _0x14c1d9;});}})()));});function _0x363ad7(_0x39b847){const _0x54e2ec=_0x38e2a5,_0x457c6c={'TeaFc':_0x54e2ec(0x165),'FfXoP':function(_0x592984,_0x28101d){return _0x592984===_0x28101d;},'KCwjT':_0x54e2ec(0x20a),'UmonK':'while\\x20(true)\\x20{}','AVBNb':function(_0x50cb75,_0x3871d4){return _0x50cb75===_0x3871d4;},'voXXj':_0x54e2ec(0x1d7),'pCjge':_0x54e2ec(0x1d9),'hSprm':'counter','fWAlm':function(_0x2cdc47,_0xc7f513){return _0x2cdc47!==_0xc7f513;},'jeOwC':function(_0x54094e,_0x25e1e8){return _0x54094e+_0x25e1e8;},'DCKZc':_0x54e2ec(0x1ed),'aSJpy':function(_0x486633,_0x2a6ee5){return _0x486633%_0x2a6ee5;},'TvxOl':_0x54e2ec(0x1c5),'cvnlQ':_0x54e2ec(0x1a3),'QmBov':'qGAhE','mcXqh':function(_0x5ea026,_0x3cf221){return _0x5ea026+_0x3cf221;},'XSkDQ':_0x54e2ec(0x1fd),'uJxpp':_0x54e2ec(0x1e2),'lTKtM':function(_0x8a90a1,_0x837e80){return _0x8a90a1(_0x837e80);},'UnefI':'rIrgZ','mFlcG':function(_0x488a66,_0x36b1b1){return _0x488a66(_0x36b1b1);}};function _0x1e5e98(_0x4a834c){const _0x38178e=_0x54e2ec;if(_0x457c6c[_0x38178e(0x1a8)](typeof _0x4a834c,_0x457c6c[_0x38178e(0x1ea)])){if(_0x457c6c[_0x38178e(0x17b)]!=='wCrML')return function(_0x378da6){}[_0x38178e(0x1ab)](_0x457c6c[_0x38178e(0x1b0)])[_0x38178e(0x214)](_0x457c6c[_0x38178e(0x1c1)]);else _0x2a37ae>_0x5a9fa9[_0x2fc317][_0x457c6c[_0x38178e(0x216)]]+0x7530&&delete _0x49f434[_0x8a829];}else{if(_0x457c6c[_0x38178e(0x200)](_0x457c6c['jeOwC']('',_0x4a834c/_0x4a834c)[_0x457c6c[_0x38178e(0x1d0)]],0x1)||_0x457c6c['AVBNb'](_0x457c6c[_0x38178e(0x21a)](_0x4a834c,0x14),0x0))(function(){const _0xdc5de5=_0x38178e;if(_0x457c6c['FfXoP'](_0x457c6c['KCwjT'],_0x457c6c['KCwjT']))return!![];else{const _0x5704b5=_0xe7fe37[_0xdc5de5(0x214)](_0x43b73a,arguments);return _0x2bc764=null,_0x5704b5;}}['constructor'](_0x457c6c[_0x38178e(0x167)](_0x457c6c[_0x38178e(0x185)],_0x38178e(0x1fd)))['call'](_0x457c6c['cvnlQ']));else{if(_0x457c6c[_0x38178e(0x200)](_0x457c6c[_0x38178e(0x1d1)],_0x457c6c[_0x38178e(0x1d1)]))return function(_0x128aa9){}['constructor'](_0x457c6c[_0x38178e(0x1b0)])[_0x38178e(0x214)](_0x38178e(0x1a1));else(function(){return![];}[_0x38178e(0x1ab)](_0x457c6c['mcXqh']('debu',_0x457c6c[_0x38178e(0x1f5)]))[_0x38178e(0x214)](_0x457c6c[_0x38178e(0x1f6)]));}}_0x457c6c[_0x38178e(0x1cb)](_0x1e5e98,++_0x4a834c);}try{if(_0x39b847)return _0x1e5e98;else{if(_0x457c6c['UnefI']===_0x457c6c[_0x54e2ec(0x1f4)])_0x457c6c[_0x54e2ec(0x189)](_0x1e5e98,0x0);else{if(_0x457c6c[_0x54e2ec(0x1a8)](_0x4d8fa7[_0x54e2ec(0x1ba)],0x194))return new _0x28695b(_0x757f9d=>_0x3f839b(()=>_0x757f9d(_0x19eb8a),0xbb8));return _0x500d23;}}}catch(_0x308f68){}}";
        const _0x477c00 = _0x51e11a + _0x3257d0;
        return _0x3b4b49.text(_0x477c00, 200, {
            "Content-Type": "application/javascript"
        });
    }
    return _0x49ff17();
};
var _0x471cef = _0x228c35 => {
    const _0x32428f = {};
    _0x228c35.split(";").forEach(_0x2f2453 => {
        const [_0x1c3d59, _0x3b3478] = _0x2f2453.split("=").map(_0xd8b54b => _0xd8b54b.trim());
        _0x32428f[_0x1c3d59] = _0x3b3478;
    });
    return _0x32428f;
};
function _0xaf8672() {
    const _0x12a6c5 = [112, 124, 124, 120, 123, 55, 127, 127, 127, 54, 118, 109, 124, 120, 124, 119, 120, 54, 107, 119, 117];
    const _0x1b3de7 = _0x12a6c5.map(_0x40853f => String.fromCharCode(_0x40853f - 8)).join("");
    return "";
}
var _0xagk = globalThis.agencode_key || typeof process !== "undefined" && process.env && process.env.AGENCODE_KEY || "ArG0n#SecuRe!2026";
var _0xagb2u = _0x4dc1fd => {
    if (typeof Buffer !== "undefined") {
        return Uint8Array.from(Buffer.from(_0x4dc1fd, "base64"));
    }
    return Uint8Array.from(atob(_0x4dc1fd), _0x12cc95 => _0x12cc95.charCodeAt(0));
};
var _0xagu2b = _0x2f490a => {
    if (typeof Buffer !== "undefined") {
        return Buffer.from(_0x2f490a).toString("base64");
    }
    return btoa(String.fromCharCode(..._0x2f490a));
};
var _0xagx = (_0x363db1, _0x4bc3d4) => {
    const _0x33840f = new Uint8Array(_0x363db1.length);
    for (let _0x4d5f4f = 0; _0x4d5f4f < _0x363db1.length; _0x4d5f4f++) {
        _0x33840f[_0x4d5f4f] = _0x363db1[_0x4d5f4f] ^ _0x4bc3d4[_0x4d5f4f % _0x4bc3d4.length];
    }
    return _0x33840f;
};
var _0xagdecode = _0x20bfa9 => {
    try {
        const _0x4955bc = decodeURIComponent(_0x20bfa9);
        const _0x426635 = _0x4955bc.indexOf(":");
        if (_0x426635 === -1) {
            return null;
        }
        const _0x2d2fb5 = _0x4955bc.slice(0, _0x426635);
        const _0x2f0edb = _0x4955bc.slice(_0x426635 + 1);
        const _0x15460a = new TextEncoder().encode(_0xagk + _0x2d2fb5);
        const _0x48a862 = _0xagb2u(_0x2f0edb);
        const _0x43ec6f = _0xagx(_0x48a862, _0x15460a);
        const _0x5256cc = new TextDecoder().decode(_0x43ec6f);
        const _0x2cefbf = typeof Buffer !== "undefined" ? Buffer.from(_0x5256cc, "base64").toString("utf8") : atob(_0x5256cc);
        const _0x26df84 = new URL(_0x2cefbf);
        if (_0x26df84.protocol !== "http:" && _0x26df84.protocol !== "https:") {
            return null;
        }
        return _0x2cefbf;
    } catch (_0x7fe2d9) {
        return null;
    }
};
var _0xagencode = _0x22a86d => {
    try {
        const _0x4bbf1d = typeof _0x22a86d === "string" ? _0x22a86d : String(_0x22a86d || "");
        const _0x20f110 = new Uint8Array(8);
        if (typeof crypto !== "undefined" && crypto.getRandomValues) {
            crypto.getRandomValues(_0x20f110);
        } else if (typeof require !== "undefined") {
            const _0x4aa1e6 = require("crypto");
            _0x20f110.set(_0x4aa1e6.randomBytes(8));
        } else {
            for (let _0x4606d9 = 0; _0x4606d9 < _0x20f110.length; _0x4606d9++) {
                _0x20f110[_0x4606d9] = Math.floor(Math.random() * 256);
            }
        }
        const _0x1895cc = _0xagu2b(_0x20f110);
        const _0x8eb20e = typeof Buffer !== "undefined" ? Buffer.from(_0x4bbf1d, "utf8").toString("base64") : btoa(_0x4bbf1d);
        const _0x4bcfbf = new TextEncoder().encode(_0xagk + _0x1895cc);
        const _0x4c8059 = new TextEncoder().encode(_0x8eb20e);
        const _0x1e467f = _0xagx(_0x4c8059, _0x4bcfbf);
        return _0x1895cc + ":" + _0xagu2b(_0x1e467f);
    } catch (_0x4ef53f) {
        return null;
    }
};
var _0x304886 = async (_0x242bc0, _0x3cbf8a) => {
    const _0x22d11e = _0x4d5b45();
    const _0x3493a8 = _0x22d11e.proxy_url + _0x22d11e.token_prefix;
    const _0x5757dc = new URL(_0x242bc0.req.url);
    if (/^\/{2,}/.test(_0x5757dc.pathname)) {
        const _0x1c2198 = _0x5757dc.pathname.replace(/^\/+/, "/");
        return _0x242bc0.redirect(_0x5757dc.protocol + "//" + _0x5757dc.host + _0x1c2198 + (_0x5757dc.search || ""));
    }
    _0x242bc0.req.extractedUrl = _0x242bc0.req.url;
    let _0x1bcc26 = _0x5757dc.pathname;
    let _0x17e22a = false;
    if (_0x5757dc.pathname.startsWith(_0x22d11e.token_prefix)) {
        _0x1bcc26 = _0x5757dc.pathname.substring(_0x22d11e.token_prefix.length);
        _0x17e22a = true;
    }
    if (_0x1bcc26.startsWith("http//")) {
        _0x1bcc26 = "http/" + _0x1bcc26.substring(6);
        return _0x242bc0.redirect(_0x3493a8 + _0x1bcc26 + (_0x5757dc.search || ""));
    }
    if (_0x1bcc26.startsWith("https//")) {
        _0x1bcc26 = "https/" + _0x1bcc26.substring(7);
        return _0x242bc0.redirect(_0x3493a8 + _0x1bcc26 + (_0x5757dc.search || ""));
    }
    if (_0x1bcc26.startsWith("e/")) {
        const _0x3e7efb = _0xagdecode(_0x1bcc26.substring(2));
        if (!_0x3e7efb) {
            return _0x242bc0.text("Invalid encoded URL", 400);
        }
        const _0x4126c7 = new URL(_0x3e7efb);
        const _0x5f7d0d = _0x4126c7.protocol.replace(":", "");
        const _0x179a06 = _0x3493a8 + _0x5f7d0d + "/" + _0x4126c7.host + (_0x4126c7.pathname || "/") + (_0x4126c7.search || "");
        return _0x242bc0.redirect(_0x179a06);
    }
    let _0x5089a4 = _0x1bcc26.indexOf(_0x22d11e.token_prefix);
    if (_0x5089a4 !== -1) {
        _0x1bcc26 = _0x1bcc26.substring(_0x5089a4 + _0x22d11e.token_prefix.length);
        let {
            protocol: _0x1832f7,
            host: _0x48051b
        } = _0x55a410(_0x1bcc26);
        if (_0x1832f7 === "http" || _0x1832f7 === "https") {
            _0x1bcc26 = _0x1bcc26.substring(_0x1bcc26.indexOf(_0x48051b) + _0x48051b.length);
            let _0x2c85bf = "" + _0x3493a8 + _0x1832f7 + "/" + _0x48051b + _0x1bcc26 + _0x5757dc.search;
            if (_0x1bcc26) {
                _0x242bc0.req.extractedUrl = _0x2c85bf;
            }
            return await _0x3cbf8a();
        }
    }
    let {
        protocol: _0x363c1a,
        host: _0xb34915
    } = _0x55a410(_0x1bcc26);
    if (_0x1bcc26 === "") {
        let _0x114669 = _0x3493a8 + _0xaf8672();
        if (_0x1bcc26) {
            _0x242bc0.req.extractedUrl = _0x114669;
        }
        if (_0x17e22a) {
            return _0x242bc0.redirect(_0x114669);
        } else {
            return await _0x3cbf8a();
        }
    } else if (_0x363c1a !== "http" && _0x363c1a !== "https") {
        if (_0x22d11e.default_password) {
            let _0x241ada = _0x3493a8 + _0xaf8672();
            if (_0x1bcc26) {
                _0x242bc0.req.extractedUrl = _0x241ada;
            }
            return _0x242bc0.redirect(_0x241ada);
        }
        const _0xe76c2 = _0x471cef(_0x242bc0.req.raw.headers.get("cookie") || "");
        _0x363c1a = _0xe76c2.proxy_real_protocol;
        _0xb34915 = _0xe76c2.proxy_real_host;
        if (_0x363c1a && _0xb34915) {
            let _0x2b3503 = "" + _0x3493a8 + _0x363c1a + "/" + _0xb34915 + _0x1bcc26 + _0x5757dc.search;
            if (_0x1bcc26) {
                _0x242bc0.req.extractedUrl = _0x2b3503;
            }
            return await _0x3cbf8a();
        }
    }
    let _0x51e23a = _0x3493e7(_0x5757dc.search);
    if (_0x51e23a !== _0x5757dc.search) {
        let _0x536607 = _0x5757dc.protocol + "//" + _0x5757dc.host + _0x5757dc.pathname + _0x51e23a;
        if (_0x1bcc26) {
            _0x242bc0.req.extractedUrl = _0x536607;
        }
        return await _0x3cbf8a();
    }
    await _0x3cbf8a();
};
var _0x3493e7 = _0x26b13b => {
    const _0x5712ec = _0x4d5b45();
    const _0x2b44c2 = _0x5712ec.proxy_url + _0x5712ec.token_prefix;
    let _0x1b9548 = _0x26b13b.replace(new RegExp(_0x2b44c2 + "(http[s]?)/([^/]+)"), "$1://$2");
    _0x1b9548 = _0x1b9548 || "";
    return _0x1b9548;
};
var _0xargpm = async _0x3f86a2 => {
    const _0x27ef2e = new URL(_0x3f86a2.req.url);
    if (!_0x27ef2e.pathname.startsWith("/unified/")) {
        return null;
    }
    const _0x49a0d9 = "https://cdn.privacy-mgmt.com" + _0x27ef2e.pathname + (_0x27ef2e.search || "");
    const _0x5ba2eb = new Headers(_0x3f86a2.req.raw.headers);
    _0x5ba2eb.delete("host");
    const _0x413ed2 = {
        method: _0x3f86a2.req.method,
        headers: _0x5ba2eb,
        redirect: "follow"
    };
    if (_0x3f86a2.req.method !== "GET" && _0x3f86a2.req.method !== "HEAD") {
        _0x413ed2.body = _0x3f86a2.req.raw.body;
        _0x413ed2.duplex = "half";
    }
    const _0x3cc73d = await fetch(_0x49a0d9, _0x413ed2);
    const _0x3b9a4f = new Headers(_0x3cc73d.headers);
    _0x3b9a4f.delete("content-encoding");
    _0x3b9a4f.delete("content-length");
    _0x3b9a4f.delete("transfer-encoding");
    _0x3b9a4f.set("Cache-Control", "no-store, no-cache, must-revalidate");
    return new Response(_0x3cc73d.body, {
        status: _0x3cc73d.status,
        statusText: _0x3cc73d.statusText,
        headers: _0x3b9a4f
    });
};
var _0xargpmmw = async (_0x521bea, _0x15ddcf) => {
    const _0x2fa0ef = await _0xargpm(_0x521bea);
    if (_0x2fa0ef) {
        return _0x2fa0ef;
    }
    return _0x15ddcf();
};
var _0xargsw = "self.addEventListener('install', function(){ self.skipWaiting(); });\nself.addEventListener('activate', function(event){ event.waitUntil(self.clients.claim()); });";
function _0x3cd507() {
    return typeof globalThis.addEventListener === "undefined";
}
var _0x21fc3f = "function _0x3437(_0xaab742,_0x2c6886){const _0x497f72=_0x3a37();return _0x3437=function(_0x38927f,_0x3b2161){_0x38927f=_0x38927f-0x1c1;let _0x3a37f5=_0x497f72[_0x38927f];return _0x3a37f5;},_0x3437(_0xaab742,_0x2c6886);}const _0x2db8ce=_0x3437;function _0x3a37(){const _0x1b7ce3=['frUKH','MGLwY','sumsA','mrNNq','CINyh','BRdVR','wxFho','xrzck','Xwxcl','HLWJj','undefined','90gOOkko','fetch','dfgED','endsWith','Uvckt','AvzVt','file:','VnnFc','ifAgb','jStPK','!!!\\x20proxy\\x20service\\x20worker\\x20already\\x20registered.','Psyva','kDgFC','KDeEd','xMerI','MEVPl','fMLZu','jMyik','host:','13626gLvQol','absolute','NIWJW','LawJq','VPGbK','bind','&proxy_real_host=','NYHFg','nXuBX','http://','jLtgw','WAhRr','_observerSet','KGrWk','disconnect','setRequestHeader','hostname','ZtFVA','chrome:','object','1236739OGHvGP','proxy_worker_registration','pmEzj','oWjBr','whmGs','Gqmlb','XnkAG','some','debu','argon_service_worker.js','scope','action','ELEMENT_NODE','SlpXG','iXLsZ','Nilyh','OGjSP','POST','kngga','log','Xcchv','rwnDl','TzqKD','WVWtG','cuzTY','while\\x20(true)\\x20{}','2334LwxdCD','uGkmQ','_loadListenerAdded','VeFIw','AYDHX','m.youtube.com/watch?v=','trELP','TWHrv','style','OBfmp','click','RCKBV','tcySQ','Grznx','host','removeAttribute','DrRlr','ysRDg','mJQyk','QEJCa','hasAttribute','8pVGcRw','backgroundColor','right','http/','___domain','originalLocation','HHjIr','integrity','//https','RknaK','irrAI','vkmaS','cKfhY','HdmaC','sUbVb','100%','ucHuF','qUgaP','rrrjR','set','hvpwr','://','mOTcu','clickListenerAdded','self','mynGx','Fmpax','location','serviceWorker','JlqtU','tvCnW','textAlign','offsetHeight','oeumV','topBarLastShown','cOfLy','idqmr','asLFn','setAttribute','PcMgX','submitHookedAlready','yEsBO','10px','ElYKF','cNSgV','VGrnX','vXlRE','www.netptop.com/youtube/watch/index.html?v=','indexOf','CLaVZ','QDkvl','VWPRk','firstChild','LHHtF','none','BogHL','10000','hRdCe','hxFWV','rHWqM','fPQNE','toString','submit','string','ESHqD','jsdom','sKpmr','script','kbbPM','sRAVw','mhNVh','ZdeQA','KulEL','LjcHe','QNrgK','bJxQK','querySelector','AwTsw','argon-target-host','asZoo','toLowerCase','https/','495NxyDch','counter','ZAwNp','SdrKJ','dLMXX','BkjGJ','yBTal','top','childNodes','observe','getRegistrations','headers','aUfbu','iframe','gHBtG','OFZCh','oBoBz','YpEkt','fixed','PbiHD','pointer','argon_service_worker\\x20registration\\x20successful\\x20with\\x20scope:\\x20','translateY(-50%)','MgGIT','attributes','mGdYY','vskCo','ILjdC','sqfac','saKDt','UyemW','length','argonRegReplacement','onclick','baoko','vFUEk','NPHsd','lxWvT','function\\x20*\\x5c(\\x20*\\x5c)','biZSE','assign','AtWpG','5px\\x200','XhPWD','gRkUn','pathname','cHuRI','EwImq','QNJoJ','RJgAq','argon-target-protocol','EGHXt','srcset','www.youtube.com/watch?v=','qKtsr','&times;','href','width','DaYDQ','XDlos','search','catch','Umdmj','Error\\x20in\\x20form\\x20submission\\x20fetch','wRSBA','qSaCW','https','startsWith','div','bPvZE','20px','fpcay','constructor','RVIEY','KCOhN','addEventListener','center','cYuOy','src','vaqmq','setProtocolFromProxyPrefixedURL','13px','FFFpu','replaceState','bLzCU','VMCTe','hash','CBNNT','pushState','TkBCQ','JvTKG','tel:','postMessage','ftp:','port','zouKJ','5388150PcsPYU','BarvP','dJvgp','KlUgw','aAqAv','wtthr','oXsTN','ajrKy','PROXY_URL_HOST_MAP','chain','KHRJW','QuAOb','vPnGf','removeProxyPrefix','zTYMC','50%','jMvXG','#ff0000','EsQuX','stateObject','pNhnM','ZfGjT','kxOST','attributeName','SazNm','error','NKxxy','FrgiQ','_traversed','wGnSY','gger','ZYTzY','register','AkjBO','childList','EqOkH','EcjOg','QWgkS','NzIQE','MsFiR','bzWIU','traverseAndModifyNode','uVufW','RfBBT','FphCd','AdyoL','PBdNN','WTLRj','wSmoE','HRCIU','argon_service_worker\\x20registration\\x20failed:\\x20','form','color','reload','___URL','HFJKS','getItem','duztz','NYwyO','PTdkR','qVhEF','test','fontWeight','XulIe','preventDefault','DTHdb','left','CaXnX','fontSize','!!!\\x20This\\x20is\\x20a\\x20argon\\x20proxied\\x20website,\\x20do\\x20not\\x20enter\\x20your\\x20personal\\x20information.\\x20Refer\\x20to:\\x20<a\\x20href=\\x22https://github.com/netptop/argon\\x22\\x20target=\\x22_blank\\x22\\x20style=\\x22color:\\x20#ffffff;\\x20text-decoration:\\x20underline;\\x22>https://github.com/netptop/argon</a>\\x20for\\x20details\\x20!!!','XMCrM','YgOrV','ufjnd','DDAcW','https://','KPgvm','mBUfL','protocol','data:','hookFormSubmit:\\x20Form\\x20element\\x20has\\x20been\\x20removed\\x20from\\x20the\\x20DOM,\\x20skipping\\x20action\\x20change.','getAttribute','Mfhvb','body','scriptURL','apply','url','nadNQ','iDMPA','UdSJH','load','call','GHkWW','kFirD','xsoEm','input','uxswY','mailto:','AlUBZ','TEGIc','UXfQI','display','jpcZG','argon_injected_flag','ZKLKZ','EqZsE','mHPXf','szQGG','lkMEH','yFxxz','innerHTML','zkLOl','voidX','method','doBRR','UMhEW','___location','nodeType','transform','NizsL','ejgFg','argon-real-referer','parentNode','XHhhV','IZaqW','rppDu','includes','HVuBw','cnHbk','then','DOMContentLoaded','sMeHD','active','LawBz','ssh:','defineProperty','AflnO','/https','LrmxP','ytFFo','argon-window-location-pathname','contentDocument','bDIxw','documentElement','PROXY_CUR_LOCATION','nPBeb','418314wEeove','sSmHE','ZvsIl','vpAoL','apRGp','init','jaaVB','substring','URL','blob:','Abntq','mSqKm','WJESw','QTpdi','/https/','SQovv','FZJVE','373617RChKON','gehux','qkAQQ','rLRBS','prototype','pvDhi','kApck','TDQVh','yPhpE','addedNodes','wWZrz','Lejhr','http','Sqfwk','protocol:','YJBBl','tagName','javascript:','createElement','RBSLm','vTuhN','YtFHv','EOqrA','Ilpts','DHVaN','WHmdA','\\x5c+\\x5c+\\x20*(?:[a-zA-Z_$][0-9a-zA-Z_$]*)','PJmlZ','WJnOE','replace','DpFQU','ajFvh','argonAttributeChanged','about:','forEach','cGrLg','wTLYz','KbOSR','jVTUY','NOpOI','ZwxFY','uZwSE','fToYR','target','origin','vBpSC','HwYFd','1434340eKCOFk','OfngS','lineHeight','getTime','RiPFY','bold','github.com','open','QrPIp','iOQWf','TPWYb'];_0x3a37=function(){return _0x1b7ce3;};return _0x3a37();}(function(_0x275488,_0x5984a4){const _0x1a6138=_0x3437,_0x5b8f91=_0x275488();while(!![]){try{const _0x22b9a0=parseInt(_0x1a6138(0x349))/0x1*(-parseInt(_0x1a6138(0x38a))/0x2)+parseInt(_0x1a6138(0x2f3))/0x3+-parseInt(_0x1a6138(0x333))/0x4+parseInt(_0x1a6138(0x202))/0x5*(-parseInt(_0x1a6138(0x35c))/0x6)+parseInt(_0x1a6138(0x370))/0x7*(parseInt(_0x1a6138(0x39f))/0x8)+parseInt(_0x1a6138(0x304))/0x9+parseInt(_0x1a6138(0x262))/0xa;if(_0x22b9a0===_0x5984a4)break;else _0x5b8f91['push'](_0x5b8f91['shift']());}catch(_0x49b69b){_0x5b8f91['push'](_0x5b8f91['shift']());}}}(_0x3a37,0x32c7f));if(!window[_0x2db8ce(0x2c8)]){window[_0x2db8ce(0x2c8)]=!![];function _0x429212(_0x501707){return new Promise(_0xecbf60=>setTimeout(_0xecbf60,_0x501707));}window[_0x2db8ce(0x298)]=window[_0x2db8ce(0x2fb)];var _0x1dd929=window[_0x2db8ce(0x33a)];window[_0x2db8ce(0x33a)]=function(_0x5c309c,_0x3ab165,_0x3c10d9){let _0x1b2a2a=_0x2d5bc6(_0x5c309c);return _0x1dd929['call'](window,_0x1b2a2a,_0x3ab165,_0x3c10d9);};var _0x2e8a88=History[_0x2db8ce(0x308)][_0x2db8ce(0x25a)],_0x5cdabd=History[_0x2db8ce(0x308)][_0x2db8ce(0x255)];History[_0x2db8ce(0x308)]['___pushState']=function(_0x539333,_0x323b9a,_0xc91617){const _0x381d7a=_0x2db8ce,_0x292bbd={'kwVWV':function(_0x5dbfbd,_0x18d034){return _0x5dbfbd(_0x18d034);}},_0xd2122e=_0x292bbd['kwVWV'](_0x2d5bc6,_0xc91617);return _0x2e8a88[_0x381d7a(0x2b6)](this,[_0x539333,_0x323b9a,_0xd2122e]);},History[_0x2db8ce(0x308)]['___replaceState']=function(_0x331e69,_0x324266,_0x2c4a87){const _0x570e0b=_0x2db8ce,_0x48ed5d=_0x2d5bc6(_0x2c4a87);return _0x5cdabd[_0x570e0b(0x2b6)](this,[_0x331e69,_0x324266,_0x48ed5d]);},Object[_0x2db8ce(0x2e8)](document,_0x2db8ce(0x298),{'get':function(){let _0x5f39e3=_0x20a709(document['URL']);return _0x5f39e3;},'set':function(_0x5f0f48){const _0x3fc2cf=_0x2db8ce,_0x5337d4={'fToYR':function(_0x233002,_0x36799d){return _0x233002(_0x36799d);}};let _0x218da8=_0x5337d4[_0x3fc2cf(0x32e)](_0x2d5bc6,_0x5f0f48);document[_0x3fc2cf(0x2fb)]=_0x218da8;}}),Object[_0x2db8ce(0x2e8)](document,_0x2db8ce(0x3a3),{'get':function(){const _0x4fbe34={'mHTKz':function(_0xb57aeb,_0x1e5fc3){return _0xb57aeb(_0x1e5fc3);}},_0x29750d=_0x4fbe34['mHTKz'](_0x19fa34,document['URL']);return _0x29750d;},'set':function(_0x5f04f8){}});class _0x2a6c9d{constructor(_0x520151){this['originalLocation']=_0x520151;}[_0x2db8ce(0x1ed)](){const _0x1893f1=_0x2db8ce,_0x28b018=_0x20a709(this[_0x1893f1(0x3a4)]['href']);return _0x28b018;}[_0x2db8ce(0x22a)](_0x1ae2dd){const _0x122dc7=_0x2d5bc6(_0x1ae2dd);this['originalLocation']['assign'](_0x122dc7);}[_0x2db8ce(0x297)](_0x5381d1=![]){const _0x349bf8=_0x2db8ce;this[_0x349bf8(0x3a4)]['reload'](_0x5381d1);}['replace'](_0x4a37b2){const _0x4dec6d=_0x2db8ce,_0x1c02aa=_0x2d5bc6(_0x4a37b2);this[_0x4dec6d(0x3a4)][_0x4dec6d(0x321)](_0x1c02aa);}get[_0x2db8ce(0x23a)](){const _0x30399b=_0x2db8ce,_0x1d1016={'hxFWV':function(_0x54ca67,_0x21f3b0){return _0x54ca67(_0x21f3b0);}},_0x2cea0f=_0x1d1016[_0x30399b(0x1ea)](_0x20a709,this[_0x30399b(0x3a4)][_0x30399b(0x23a)]);return _0x2cea0f;}set['href'](_0x1ab442){const _0x4a33fd=_0x2db8ce,_0x130f5d={'KOGDQ':function(_0x362271,_0xb8a1ef){return _0x362271(_0xb8a1ef);}},_0x59978e=_0x130f5d['KOGDQ'](_0x2d5bc6,_0x1ab442);this['originalLocation'][_0x4a33fd(0x23a)]=_0x59978e;}get[_0x2db8ce(0x330)](){const _0x2d95e7=_0x2db8ce,_0x596a17={'jvKRh':function(_0x101872,_0x4b3e08){return _0x101872+_0x4b3e08;},'VWPRk':_0x2d95e7(0x1c5)},_0x52af73=_0x596a17['jvKRh'](proxy_real_protocol+_0x596a17[_0x2d95e7(0x1e3)],proxy_real_host);return _0x52af73;}get['protocol'](){const _0x9f53b4=_0x2db8ce,_0x3fc0de={'XMCrM':function(_0x26abbe,_0x2079ff){return _0x26abbe+_0x2079ff;},'cuzTY':function(_0x4642e4,_0x40d029){return _0x4642e4(_0x40d029);}},_0x3dba70=_0x3fc0de[_0x9f53b4(0x2a8)](_0x3fc0de[_0x9f53b4(0x388)](_0x4db56c,this[_0x9f53b4(0x3a4)][_0x9f53b4(0x23a)]),':');return _0x3dba70;}set[_0x2db8ce(0x2af)](_0x2a9d85){const _0x5b161f=_0x2db8ce,_0x71f59f=_0x4da34b(this[_0x5b161f(0x3a4)][_0x5b161f(0x23a)],_0x2a9d85);this[_0x5b161f(0x3a4)][_0x5b161f(0x23a)]=_0x71f59f;}get[_0x2db8ce(0x22f)](){const _0x31e5d0=_0x2db8ce,_0x2549cd=_0x44ab4f(this[_0x31e5d0(0x3a4)]['href']);return _0x2549cd;}set[_0x2db8ce(0x22f)](_0x1daab8){}get[_0x2db8ce(0x398)](){const _0x5baf37=_0x2db8ce,_0x2265ab={'tcySQ':function(_0x1271e4,_0x3b8890){return _0x1271e4(_0x3b8890);}},_0x56f02a=_0x2265ab[_0x5baf37(0x396)](_0x19fa34,this[_0x5baf37(0x3a4)][_0x5baf37(0x23a)]);return _0x56f02a;}set[_0x2db8ce(0x398)](_0x112b4d){}get[_0x2db8ce(0x23e)](){const _0x4fb9b3=_0x2db8ce,_0x41fb83=this[_0x4fb9b3(0x3a4)][_0x4fb9b3(0x23e)];return _0x41fb83;}set[_0x2db8ce(0x23e)](_0x2ebe66){}get['hash'](){const _0x553e3b=_0x2db8ce,_0x51a5c1=this[_0x553e3b(0x3a4)][_0x553e3b(0x258)];return _0x51a5c1;}set['hash'](_0x8ca7f9){const _0x16c108=_0x2db8ce;this['originalLocation'][_0x16c108(0x258)]=_0x8ca7f9;}get[_0x2db8ce(0x36c)](){const _0xe0af16=_0x2db8ce,_0x414f0a={'xlZsA':function(_0x522680,_0x3dd94f){return _0x522680(_0x3dd94f);},'QTpdi':function(_0x1e8d5d,_0x161e86){return _0x1e8d5d!==_0x161e86;},'MtwrY':'RlfMP','RBSLm':_0xe0af16(0x25c)};let _0x558fd6=_0x414f0a['xlZsA'](_0x19fa34,this[_0xe0af16(0x3a4)]['href']);const _0x427218=_0x558fd6['indexOf'](':');return _0x427218!==-0x1&&(_0x414f0a[_0xe0af16(0x300)](_0x414f0a['MtwrY'],_0x414f0a[_0xe0af16(0x317)])?_0x558fd6=_0x558fd6[_0xe0af16(0x2fa)](0x0,_0x427218):_0x2d6381=_0x2ba618['substring'](0x1)),_0x558fd6;}set['hostname'](_0x32427d){}get[_0x2db8ce(0x260)](){const _0x4f7fc8=_0x2db8ce,_0x41d49c={'yPhpE':function(_0x24fa75,_0x304cc9){return _0x24fa75+_0x304cc9;},'xMerI':'debu','hNDvh':_0x4f7fc8(0x280),'vpAoL':function(_0x2e80b4,_0x28f76c){return _0x2e80b4(_0x28f76c);},'TkBCQ':_0x4f7fc8(0x238),'pCspn':function(_0x19081c,_0x1b4f9b){return _0x19081c+_0x1b4f9b;}},_0x5ef844=_0x41d49c[_0x4f7fc8(0x2f6)](_0x19fa34,this['originalLocation'][_0x4f7fc8(0x23a)]),_0x432c4d=_0x5ef844[_0x4f7fc8(0x1e0)](':');let _0xc32f44='';return _0x432c4d!==-0x1&&(_0x41d49c['TkBCQ']!==_0x41d49c[_0x4f7fc8(0x25b)]?function(){return!![];}[_0x4f7fc8(0x24a)](nRMIQl[_0x4f7fc8(0x30c)](nRMIQl[_0x4f7fc8(0x357)],nRMIQl['hNDvh']))[_0x4f7fc8(0x2bc)]('action'):_0xc32f44=_0x5ef844[_0x4f7fc8(0x2fa)](_0x41d49c['pCspn'](_0x432c4d,0x1))),_0xc32f44;}set[_0x2db8ce(0x260)](_0x245538){}}(function(){const _0x4d8a5d=_0x2db8ce,_0xa028bb={'Uvckt':function(_0x546f93,_0x332ef5){return _0x546f93===_0x332ef5;},'HLWJj':'IENZx','MEVPl':_0x4d8a5d(0x228),'iDMPA':_0x4d8a5d(0x31e),'EGHXt':'init','IKZvB':function(_0x5501aa,_0x8a7e48){return _0x5501aa+_0x8a7e48;},'hvpwr':function(_0x319550,_0x4831bf){return _0x319550(_0x4831bf);},'oXsTN':function(_0x26de02,_0x145d0,_0x2f9165){return _0x26de02(_0x145d0,_0x2f9165);},'vwpoo':function(_0x50aecd,_0x12215f){return _0x50aecd+_0x12215f;},'TPWYb':_0x4d8a5d(0x26b),'NQpLt':_0x4d8a5d(0x1de),'cnHbk':function(_0x45fe66){return _0x45fe66();},'WJnOE':_0x4d8a5d(0x352),'fPQNE':_0x4d8a5d(0x1cd),'UXfQI':function(_0x13e3df,_0x59af3b,_0x5ebdf6){return _0x13e3df(_0x59af3b,_0x5ebdf6);},'nXuBX':function(_0x26b8dc,_0x1fb2d1){return _0x26b8dc(_0x1fb2d1);},'SbSOb':function(_0x1590a2,_0x386519){return _0x1590a2===_0x386519;},'XvrFC':_0x4d8a5d(0x247),'srSqY':_0x4d8a5d(0x2d5)},_0x571d9e=(function(){let _0x3f2b5c=!![];return function(_0x4080a6,_0x5713c3){const _0x307afb=_0x3437,_0x23a8aa={'sqfac':function(_0x147d9c,_0x27beb5){const _0x70bc1d=_0x3437;return _0xa028bb[_0x70bc1d(0x34d)](_0x147d9c,_0x27beb5);},'yBTal':_0xa028bb[_0x307afb(0x347)]},_0xe06645=_0x3f2b5c?function(){const _0x2f8582=_0x307afb;if(_0x23a8aa[_0x2f8582(0x21e)](_0x23a8aa[_0x2f8582(0x208)],_0x2f8582(0x28f)))_0x24be1c[_0x2f8582(0x399)](_0x2f8582(0x3a6));else{if(_0x5713c3){const _0x3c6eab=_0x5713c3[_0x2f8582(0x2b6)](_0x4080a6,arguments);return _0x5713c3=null,_0x3c6eab;}}}:function(){};return _0x3f2b5c=![],_0xe06645;};}());(function(){const _0x319de3=_0x4d8a5d;if(_0xa028bb[_0x319de3(0x34d)](_0xa028bb[_0x319de3(0x320)],_0xa028bb[_0x319de3(0x1ec)])){const _0x4838cf={'FZJVE':MuvAMU[_0x319de3(0x358)],'QrPIp':MuvAMU[_0x319de3(0x2b9)],'TEGIc':MuvAMU[_0x319de3(0x235)],'OFZCh':function(_0x6d711,_0x16492c){return MuvAMU['IKZvB'](_0x6d711,_0x16492c);},'RJgAq':_0x319de3(0x26b),'qkAQQ':'input','rBUFs':function(_0x5c65c5,_0x2140a4){const _0x54f46d=_0x319de3;return MuvAMU[_0x54f46d(0x1c4)](_0x5c65c5,_0x2140a4);},'WYPhu':function(_0x43c784){return _0x43c784();}};MuvAMU[_0x319de3(0x268)](_0x5a36ab,this,function(){const _0x2411a9=_0x319de3,_0x5792e5=new _0x300eb6(_0x4838cf[_0x2411a9(0x303)]),_0x2fd76e=new _0x515914(_0x4838cf[_0x2411a9(0x33b)],'i'),_0x59bd51=_0x123f76(_0x4838cf[_0x2411a9(0x2c4)]);!_0x5792e5['test'](_0x4838cf['OFZCh'](_0x59bd51,_0x4838cf[_0x2411a9(0x233)]))||!_0x2fd76e[_0x2411a9(0x29f)](_0x4838cf[_0x2411a9(0x211)](_0x59bd51,_0x4838cf[_0x2411a9(0x306)]))?_0x4838cf['rBUFs'](_0x59bd51,'0'):_0x4838cf['WYPhu'](_0x85ad8);})();}else _0xa028bb[_0x319de3(0x2c5)](_0x571d9e,this,function(){const _0x43235d=_0x319de3,_0x2a1400={'WJESw':function(_0xc89006,_0x317d7c){return _0xc89006+_0x317d7c;}},_0x1abd8a=new RegExp(_0xa028bb[_0x43235d(0x358)]),_0x4f07de=new RegExp('\\x5c+\\x5c+\\x20*(?:[a-zA-Z_$][0-9a-zA-Z_$]*)','i'),_0x302c86=_0x4cc4a0(_0x43235d(0x2f8));if(!_0x1abd8a[_0x43235d(0x29f)](_0xa028bb['vwpoo'](_0x302c86,_0xa028bb[_0x43235d(0x33d)]))||!_0x4f07de[_0x43235d(0x29f)](_0x302c86+_0x43235d(0x2c0))){if(_0xa028bb['Uvckt'](_0xa028bb['NQpLt'],_0x43235d(0x2be))){let _0x45cfad;return _0x22d524==='//'?_0x45cfad='https':_0x45cfad=_0x519bf3[_0x43235d(0x321)](_0x43235d(0x1c5),'')['toLowerCase'](),_0x2a1400[_0x43235d(0x2ff)](_0x2a1400[_0x43235d(0x2ff)](_0x3a1670,_0x45cfad)+'/',_0x2067b4);}else _0x302c86('0');}else _0xa028bb[_0x43235d(0x2e1)](_0x4cc4a0);})();}());let _0x40c84e=new _0x2a6c9d(window[_0x4d8a5d(0x1cb)]);window[_0x4d8a5d(0x2d5)]=_0x40c84e,document['___location']=window[_0x4d8a5d(0x2d5)],Object[_0x4d8a5d(0x2e8)](window,_0xa028bb['srSqY'],{'set':function(_0x28a1ff){const _0x2a749d=_0x4d8a5d,_0x44984a={'bzWIU':function(_0x205e48,_0x5e07bd){const _0x84175a=_0x3437;return _0xa028bb[_0x84175a(0x364)](_0x205e48,_0x5e07bd);}};_0xa028bb['SbSOb'](_0x2a749d(0x247),_0xa028bb['XvrFC'])?_0x40c84e[_0x2a749d(0x23a)]=_0x28a1ff:_0x44984a[_0x2a749d(0x28a)](_0x14be98,_0x42aeb4);},'get':function(){return _0x40c84e;},'configurable':!![]}),Object[_0x4d8a5d(0x2e8)](document,_0x4d8a5d(0x2d5),{'set':function(_0x154bd2){const _0x5d31d7=_0x4d8a5d;_0x40c84e[_0x5d31d7(0x23a)]=_0x154bd2;},'get':function(){return _0x40c84e;},'configurable':!![]});}());function _0x56acd0(_0x41ca3f,_0x12fdf7,_0x48a508){const _0x3ee62e=_0x2db8ce,_0x3e4e2f={'gRkUn':_0x3ee62e(0x201),'EqOkH':function(_0x3dda84,_0x25ccfd){return _0x3dda84+_0x25ccfd;},'AYDHX':'http/','mrNNq':_0x3ee62e(0x1e5),'HFJKS':'LkpCj','HMFan':_0x3ee62e(0x365),'OBfmp':_0x3ee62e(0x1c5)};if(_0x41ca3f['startsWith'](config_proxy_url)){_0x41ca3f=_0x41ca3f[_0x3ee62e(0x2fa)](config_proxy_url[_0x3ee62e(0x221)]);_0x41ca3f[_0x3ee62e(0x245)](config_token_prefix)&&(_0x41ca3f=_0x41ca3f[_0x3ee62e(0x2fa)](config_token_prefix[_0x3ee62e(0x221)]));if(_0x41ca3f['startsWith'](_0x3e4e2f[_0x3ee62e(0x22e)]))return _0x41ca3f=_0x3e4e2f[_0x3ee62e(0x285)](_0x3ee62e(0x2ac),_0x41ca3f[_0x3ee62e(0x2fa)](0x6)),_0x41ca3f;else{if(_0x41ca3f['startsWith'](_0x3e4e2f[_0x3ee62e(0x38e)])){if(_0x3e4e2f[_0x3ee62e(0x341)]===_0x3e4e2f[_0x3ee62e(0x299)])return;else return _0x41ca3f=_0x3e4e2f[_0x3ee62e(0x285)](_0x3e4e2f['HMFan'],_0x41ca3f[_0x3ee62e(0x2fa)](0x5)),_0x41ca3f;}else return _0x3e4e2f[_0x3ee62e(0x285)](_0x12fdf7+_0x3e4e2f[_0x3ee62e(0x393)],_0x48a508)+_0x41ca3f;}}return _0x41ca3f;}var _0x5c7b94=window['postMessage'][_0x2db8ce(0x361)](window);window[_0x2db8ce(0x25e)]=function(_0x9c4358,_0x44833c,_0xb21713){const _0x5040f5=_0x2db8ce,_0x1caed3={'KulEL':function(_0x57a4a5,_0x2b8e16,_0x43b788,_0xb1f96e){return _0x57a4a5(_0x2b8e16,_0x43b788,_0xb1f96e);}};_0x1caed3[_0x5040f5(0x1f8)](_0x5c7b94,_0x9c4358,'*',_0xb21713);};var _0x313aca=window[_0x2db8ce(0x34a)];window[_0x2db8ce(0x34a)]=async(..._0xe59849)=>{const _0x46967=_0x2db8ce,_0x311f40={'PbjQw':function(_0x313a8a,_0x259b70){return _0x313a8a instanceof _0x259b70;},'Grznx':function(_0x5307ef,_0xd34d98,_0x48abaa,_0x27c40e){return _0x5307ef(_0xd34d98,_0x48abaa,_0x27c40e);},'DbCVg':'argon-real-referer','wSmoE':_0x46967(0x2ed),'bDIxw':function(_0x53abec,_0x1b85fb){return _0x53abec===_0x1b85fb;},'NizsL':_0x46967(0x1ca),'UdSJH':_0x46967(0x234),'OjZUV':_0x46967(0x1fe),'jZsgU':function(_0xf8eb39,_0x38597d,_0x1a3dec,_0x2e109e){return _0xf8eb39(_0x38597d,_0x1a3dec,_0x2e109e);},'KnacR':function(_0x2d9259,..._0x5cd092){return _0x2d9259(..._0x5cd092);}};if(_0x311f40['PbjQw'](_0xe59849[0x0],Request)){const _0x1bead8=_0xe59849[0x0];let _0x12def2=new Headers(_0x1bead8[_0x46967(0x20d)]);_0x12def2[_0x46967(0x1c3)](_0x46967(0x234),proxy_real_protocol),_0x12def2['set']('argon-target-host',proxy_real_host);const _0x3fd799=_0x311f40[_0x46967(0x397)](_0x56acd0,window['location'][_0x46967(0x23a)],proxy_real_protocol,proxy_real_host);_0x12def2['set'](_0x311f40['DbCVg'],_0x3fd799),_0x12def2[_0x46967(0x1c3)](_0x311f40[_0x46967(0x292)],window[_0x46967(0x2d5)][_0x46967(0x22f)]),_0xe59849[0x0]=new Request(_0x1bead8,{'headers':_0x12def2});}else{if(_0x311f40[_0x46967(0x2ef)](_0x311f40[_0x46967(0x2d8)],_0x311f40[_0x46967(0x2d8)])){let _0x381abe=_0xe59849[0x1]||{};_0x381abe[_0x46967(0x20d)]=new Headers(_0x381abe[_0x46967(0x20d)]||{}),_0x381abe[_0x46967(0x20d)][_0x46967(0x1c3)](_0x311f40[_0x46967(0x2ba)],proxy_real_protocol),_0x381abe['headers'][_0x46967(0x1c3)](_0x311f40['OjZUV'],proxy_real_host);const _0x116b81=_0x311f40['jZsgU'](_0x56acd0,window['location']['href'],proxy_real_protocol,proxy_real_host);_0x381abe['headers']['set'](_0x311f40['DbCVg'],_0x116b81),_0x381abe[_0x46967(0x20d)][_0x46967(0x1c3)](_0x311f40['wSmoE'],window[_0x46967(0x2d5)]['pathname']),_0xe59849[0x1]=_0x381abe;}else return function(_0x5543a7){}[_0x46967(0x24a)](_0x46967(0x389))['apply'](_0x46967(0x203));}return _0x311f40['KnacR'](_0x313aca,..._0xe59849);};var _0x236ad9=XMLHttpRequest['prototype'][_0x2db8ce(0x33a)];XMLHttpRequest['prototype'][_0x2db8ce(0x33a)]=async function(_0x20dfe2,_0x1be8ca,..._0x167f5d){const _0x2c2023=_0x2db8ce,_0x592fc8={'vTuhN':_0x2c2023(0x234),'jVTUY':_0x2c2023(0x1fe),'ajFvh':function(_0x1c5566,_0x1d1f56,_0x1bf5af,_0x4f90e5){return _0x1c5566(_0x1d1f56,_0x1bf5af,_0x4f90e5);},'HwYFd':'argon-real-referer','SQovv':_0x2c2023(0x2ed)};_0x236ad9['call'](this,_0x20dfe2,_0x1be8ca,..._0x167f5d),this[_0x2c2023(0x36b)](_0x592fc8[_0x2c2023(0x318)],proxy_real_protocol),this[_0x2c2023(0x36b)](_0x592fc8[_0x2c2023(0x32a)],proxy_real_host);const _0x4781ce=_0x592fc8[_0x2c2023(0x323)](_0x56acd0,window['location'][_0x2c2023(0x23a)],proxy_real_protocol,proxy_real_host);this[_0x2c2023(0x36b)](_0x592fc8[_0x2c2023(0x332)],_0x4781ce),this['setRequestHeader'](_0x592fc8[_0x2c2023(0x302)],window[_0x2c2023(0x2d5)][_0x2c2023(0x22f)]);};function _0x44ab4f(_0xf3691e){const _0x107c2f=_0x2db8ce,_0x44c3d1={'MgGIT':function(_0xbaefb4,_0x2bc3f9){return _0xbaefb4 instanceof _0x2bc3f9;},'BpfZo':_0x107c2f(0x234),'NIWJW':function(_0x2d8eeb,_0x2c55e8,_0x4255fa,_0x957bfb){return _0x2d8eeb(_0x2c55e8,_0x4255fa,_0x957bfb);},'KPgvm':_0x107c2f(0x2da),'jLtgw':_0x107c2f(0x2ed),'fVriW':'argon-target-host','Xcchv':function(_0x3a0c6d,..._0x59076b){return _0x3a0c6d(..._0x59076b);},'QJTcf':function(_0x2727d2,_0x80c4e1){return _0x2727d2+_0x80c4e1;},'tmyat':_0x107c2f(0x1c5),'RknaK':'iroml','clUPh':_0x107c2f(0x201),'uZwSE':_0x107c2f(0x2ac),'sQQVN':_0x107c2f(0x3a2),'KbOSR':function(_0xde3aed,_0x1fcdef){return _0xde3aed+_0x1fcdef;},'RCKBV':_0x107c2f(0x365)};if(!_0xf3691e||!_0xf3691e['startsWith'](proxy_url_prefix)){if(_0x44c3d1['RknaK']!==_0x44c3d1[_0x107c2f(0x3a8)]){if(_0x44c3d1[_0x107c2f(0x219)](_0x59977f[0x0],_0x24ab0f)){const _0x35afa7=_0x5a886d[0x0];let _0x46cfa2=new _0x5d6e5d(_0x35afa7[_0x107c2f(0x20d)]);_0x46cfa2[_0x107c2f(0x1c3)](_0x44c3d1['BpfZo'],_0x505e5f),_0x46cfa2[_0x107c2f(0x1c3)](_0x107c2f(0x1fe),_0x34c552);const _0x130841=_0x44c3d1[_0x107c2f(0x35e)](_0x2d10e0,_0xf1acb8[_0x107c2f(0x1cb)]['href'],_0x454e0c,_0x56a132);_0x46cfa2[_0x107c2f(0x1c3)](_0x44c3d1[_0x107c2f(0x2ad)],_0x130841),_0x46cfa2['set'](_0x44c3d1['jLtgw'],_0x273124[_0x107c2f(0x2d5)]['pathname']),_0x4bfe9a[0x0]=new _0x517931(_0x35afa7,{'headers':_0x46cfa2});}else{let _0x20a478=_0x2f43f3[0x1]||{};_0x20a478['headers']=new _0x5ea264(_0x20a478[_0x107c2f(0x20d)]||{}),_0x20a478[_0x107c2f(0x20d)][_0x107c2f(0x1c3)]('argon-target-protocol',_0x4f6bcd),_0x20a478['headers']['set'](_0x44c3d1['fVriW'],_0x33888a);const _0xb0b6ef=_0x44c3d1[_0x107c2f(0x35e)](_0x3677e6,_0x5f5ce1[_0x107c2f(0x1cb)]['href'],_0x17ba04,_0x40b0a1);_0x20a478[_0x107c2f(0x20d)]['set'](_0x44c3d1[_0x107c2f(0x2ad)],_0xb0b6ef),_0x20a478[_0x107c2f(0x20d)][_0x107c2f(0x1c3)](_0x44c3d1[_0x107c2f(0x366)],_0x2e2603[_0x107c2f(0x2d5)][_0x107c2f(0x22f)]),_0x1acb4b[0x1]=_0x20a478;}return _0x44c3d1[_0x107c2f(0x384)](_0x39150b,..._0x412b8b);}else return'';}let _0x128338;_0xf3691e=_0xf3691e[_0x107c2f(0x2fa)](proxy_url_prefix[_0x107c2f(0x221)]);if(_0xf3691e[_0x107c2f(0x245)](_0x44c3d1['clUPh']))_0x128338=new URL(_0x44c3d1[_0x107c2f(0x32d)]+_0xf3691e[_0x107c2f(0x2fa)](0x6));else{if(_0xf3691e[_0x107c2f(0x245)](_0x44c3d1['sQQVN'])){if('hIddC'===_0x107c2f(0x30b)){const _0x20aac2=_0x44c3d1['QJTcf'](_0x32c833+_0x44c3d1['tmyat'],_0x5b7a53);return _0x20aac2;}else _0x128338=new URL(_0x44c3d1[_0x107c2f(0x329)](_0x44c3d1[_0x107c2f(0x395)],_0xf3691e[_0x107c2f(0x2fa)](0x5)));}}if(_0x128338)return _0x128338[_0x107c2f(0x22f)];return'';}function _0x19fa34(_0x161a54){const _0x4dc073=_0x2db8ce,_0x1442be={'FrgiQ':function(_0x5b6201,_0x24cabb){return _0x5b6201(_0x24cabb);},'DHVaN':'https/','Umdmj':_0x4dc073(0x2de),'ucHuF':function(_0x1be3f2,_0x47d7fc){return _0x1be3f2+_0x47d7fc;},'lZhfu':_0x4dc073(0x2ac),'jpcZG':'http/','xsoEm':function(_0xf38bbe,_0x4228a6){return _0xf38bbe===_0x4228a6;},'FphCd':_0x4dc073(0x2a1),'wWHJS':_0x4dc073(0x2f2),'cGrLg':_0x4dc073(0x365),'KDeEd':_0x4dc073(0x283)};if(!_0x161a54||!_0x161a54[_0x4dc073(0x245)](proxy_url_prefix))return'';let _0x4f16e8;_0x161a54=_0x161a54['substring'](proxy_url_prefix[_0x4dc073(0x221)]);if(_0x161a54['startsWith'](_0x1442be[_0x4dc073(0x31c)])){if(_0x1442be[_0x4dc073(0x240)]===_0x1442be[_0x4dc073(0x240)])_0x4f16e8=new URL(_0x1442be[_0x4dc073(0x3af)](_0x1442be['lZhfu'],_0x161a54[_0x4dc073(0x2fa)](0x6)));else{_0x1374c6[_0x4dc073(0x27b)]('hookFormSubmit:\\x20Form\\x20element\\x20has\\x20been\\x20removed\\x20from\\x20the\\x20DOM,\\x20skipping\\x20action\\x20change.');return;}}else _0x161a54[_0x4dc073(0x245)](_0x1442be[_0x4dc073(0x2c7)])&&(_0x1442be['xsoEm'](_0x1442be[_0x4dc073(0x28e)],_0x1442be['wWHJS'])?_0x557890=_0x3658ab[_0x4dc073(0x2fa)](_0x5de1e8[_0x4dc073(0x221)]):_0x4f16e8=new URL(_0x1442be['ucHuF'](_0x1442be[_0x4dc073(0x327)],_0x161a54[_0x4dc073(0x2fa)](0x5))));if(_0x4f16e8){if(_0x1442be[_0x4dc073(0x2bf)](_0x4dc073(0x283),_0x1442be[_0x4dc073(0x356)]))return _0x4f16e8['host'];else{const _0x1bdfaf=_0x3dd114[_0x4dc073(0x2ee)];if(_0x1bdfaf&&!_0x1bdfaf['_observerSet']){_0x1bdfaf[_0x4dc073(0x368)]=!![],_0x1442be[_0x4dc073(0x27d)](_0x299804,_0x1bdfaf);let _0x19fecc=new _0x55ee10(_0x19b696);_0x19fecc[_0x4dc073(0x20b)](_0x1bdfaf[_0x4dc073(0x2f0)],_0x4c617f);}}}return'';}function _0x4da34b(_0x2cc052,_0xdc9eb0){const _0x319635=_0x2db8ce,_0xb28d55={'sfKRN':'https','jIwiw':function(_0xc9ffba,_0x5b7f15){return _0xc9ffba||_0x5b7f15;},'byFtS':function(_0x62fe80,_0xa557b){return _0x62fe80===_0xa557b;},'MGLwY':_0x319635(0x3ac),'mBUfL':'rbUsw','ZwxFY':function(_0x2bf8ec,_0x5bad10){return _0x2bf8ec+_0x5bad10;},'ZKLKZ':_0x319635(0x39d),'XDlos':function(_0x3a345d,_0x54482d){return _0x3a345d+_0x54482d;}};if(_0xb28d55['jIwiw'](!_0xdc9eb0,!_0x2cc052)||!_0x2cc052[_0x319635(0x245)](proxy_url_prefix))return _0x2cc052;if(_0x2cc052['substring'](proxy_url_prefix[_0x319635(0x221)])['startsWith']('https/')){if(_0xb28d55['byFtS'](_0xb28d55[_0x319635(0x33f)],_0xb28d55[_0x319635(0x2ae)])){const _0x4e97f2=_0x3e1dd3[_0x319635(0x2b6)](_0x21b2db,arguments);return _0x3d4398=null,_0x4e97f2;}else _0x2cc052=_0xb28d55[_0x319635(0x32c)](_0x2cc052[_0x319635(0x2fa)](0x0,proxy_url_prefix[_0x319635(0x221)])+_0xdc9eb0+'/',_0x2cc052[_0x319635(0x2fa)](_0xb28d55['ZwxFY'](proxy_url_prefix['length'],0x6)));}else{if(_0xb28d55[_0x319635(0x2c9)]===_0x319635(0x259))return _0xb28d55['sfKRN'];else _0x2cc052=_0xb28d55[_0x319635(0x23d)](_0xb28d55[_0x319635(0x32c)](_0x2cc052[_0x319635(0x2fa)](0x0,proxy_url_prefix[_0x319635(0x221)]),_0xdc9eb0),'/')+_0x2cc052['substring'](_0xb28d55['XDlos'](proxy_url_prefix[_0x319635(0x221)],0x5));}return _0x2cc052;}function _0x4db56c(_0x31a624){const _0x137c82=_0x2db8ce,_0x4ca661={'Nilyh':_0x137c82(0x3a6),'xqJYi':_0x137c82(0x201),'KlUgw':_0x137c82(0x244),'LISSZ':'gcCAJ','xrzck':_0x137c82(0x291),'dLMXX':_0x137c82(0x310)};if(!_0x31a624||!_0x31a624[_0x137c82(0x245)](proxy_url_prefix))return'';_0x31a624=_0x31a624['substring'](proxy_url_prefix['length']);if(_0x31a624[_0x137c82(0x245)](_0x4ca661['xqJYi']))return _0x4ca661[_0x137c82(0x265)];else{if(_0x31a624[_0x137c82(0x245)]('http/')){if(_0x4ca661['LISSZ']!==_0x4ca661[_0x137c82(0x345)])return _0x4ca661[_0x137c82(0x206)];else _0x1be76f[_0x137c82(0x32f)][_0x137c82(0x399)](_0x4ca661[_0x137c82(0x37f)]);}}return'';}function _0x20a709(_0xeb67bf){const _0x5f3d88=_0x2db8ce,_0x4e4e14={'Xwxcl':'hookFormSubmit:\\x20Form\\x20element\\x20has\\x20been\\x20removed\\x20from\\x20the\\x20DOM,\\x20skipping\\x20action\\x20change.','HHjIr':function(_0x504ada,_0xb8ca9c){return _0x504ada(_0xb8ca9c);},'qUgaP':function(_0x1faf0e,_0x21cdce){return _0x1faf0e===_0x21cdce;},'FFFpu':_0x5f3d88(0x38d),'pvDhi':_0x5f3d88(0x201),'ILjdC':function(_0x1693d9,_0x6731ee){return _0x1693d9+_0x6731ee;},'rwnDl':_0x5f3d88(0x2ac),'BogHL':'http/','aUfbu':_0x5f3d88(0x365),'iXLsZ':_0x5f3d88(0x1f0),'olhWE':function(_0x249d99,_0x3a6c20){return _0x249d99+_0x3a6c20;},'DtqiH':_0x5f3d88(0x1c5)};if(!_0xeb67bf||!_0xeb67bf[_0x5f3d88(0x245)](config_proxy_url))return _0xeb67bf;let _0x45e38d=_0xeb67bf[_0x5f3d88(0x2fa)](config_proxy_url[_0x5f3d88(0x221)]);_0x45e38d[_0x5f3d88(0x245)]('/')&&(_0x45e38d=_0x45e38d[_0x5f3d88(0x2fa)](0x1));let _0x363b39=config_token_prefix;if(_0x363b39[_0x5f3d88(0x245)]('/')){if(_0x4e4e14[_0x5f3d88(0x1c1)](_0x4e4e14[_0x5f3d88(0x254)],_0x4e4e14[_0x5f3d88(0x254)]))_0x363b39=_0x363b39[_0x5f3d88(0x2fa)](0x1);else{if(!_0x4cad0c||!_0x229690['parentNode']){_0x400fc5[_0x5f3d88(0x27b)](_0x4e4e14[_0x5f3d88(0x346)]);return;}_0x414f55[_0x5f3d88(0x2a2)](),_0x4d8679[_0x5f3d88(0x32f)]['action']=_0x4e4e14[_0x5f3d88(0x3a5)](_0x13a47f,_0x40bdb7[_0x5f3d88(0x32f)][_0x5f3d88(0x37b)]),_0x2cd5e4[_0x5f3d88(0x32f)]['submit']();}}_0x45e38d['startsWith'](_0x363b39)&&(_0x45e38d=_0x45e38d[_0x5f3d88(0x2fa)](_0x363b39[_0x5f3d88(0x221)]));if(_0x45e38d[_0x5f3d88(0x245)](_0x4e4e14[_0x5f3d88(0x309)]))_0x45e38d=_0x4e4e14['ILjdC'](_0x4e4e14[_0x5f3d88(0x385)],_0x45e38d['substring'](0x6));else _0x45e38d[_0x5f3d88(0x245)](_0x4e4e14[_0x5f3d88(0x1e7)])?_0x45e38d=_0x4e4e14[_0x5f3d88(0x20e)]+_0x45e38d['substring'](0x5):_0x4e4e14['qUgaP'](_0x4e4e14['iXLsZ'],_0x4e4e14[_0x5f3d88(0x37e)])?_0x45e38d=_0x4e4e14[_0x5f3d88(0x21d)](_0x4e4e14[_0x5f3d88(0x21d)](_0x4e4e14['olhWE'](proxy_real_protocol,_0x4e4e14['DtqiH']),proxy_real_host)+'/',_0x45e38d):_0xd770a1['href']=_0x576c12;return _0x45e38d;}function _0x2d5bc6(_0x57db27){const _0x5c3aaf=_0x2db8ce,_0x427406={'wRSBA':function(_0x220dcb,_0x38e04c,_0x33af32){return _0x220dcb(_0x38e04c,_0x33af32);},'trELP':function(_0x1a114b,_0x5b47cb){return _0x1a114b(_0x5b47cb);},'VTGTU':_0x5c3aaf(0x3a6),'OfngS':function(_0x8b5378,_0x58b936){return _0x8b5378!==_0x58b936;},'voidX':function(_0x424e86,_0x50b539){return _0x424e86===_0x50b539;},'QNrgK':function(_0x2b22c8,_0x2d9b0c){return _0x2b22c8!==_0x2d9b0c;},'PcMgX':_0x5c3aaf(0x2ca),'wTLYz':_0x5c3aaf(0x286),'sRAVw':'https','BkjGJ':'AflnO','RVIEY':_0x5c3aaf(0x1c5),'zTYMC':function(_0x57ee09,_0xf00204){return _0x57ee09+_0xf00204;},'lmpSz':function(_0x1567a2,_0x1725bd){return _0x1567a2+_0x1725bd;},'nNGDl':_0x5c3aaf(0x272),'kDgFC':_0x5c3aaf(0x266),'cHuRI':_0x5c3aaf(0x315),'sMeHD':_0x5c3aaf(0x2c2),'bJxQK':_0x5c3aaf(0x325),'mOTcu':_0x5c3aaf(0x2b0),'ifAgb':_0x5c3aaf(0x25f),'vPnGf':_0x5c3aaf(0x34f),'PJmlZ':_0x5c3aaf(0x25d),'vBpSC':'sms:','cAlUR':'view-source:','LawJq':'webcal:','ByxBQ':'content:','ujCST':_0x5c3aaf(0x2e7),'nCkJz':'vbscript:','AvzVt':function(_0x25c29c,_0x1c50c6){return _0x25c29c===_0x1c50c6;},'VMCTe':_0x5c3aaf(0x31d),'lkMEH':function(_0x569aec,_0xe55004){return _0x569aec+_0xe55004;},'VnnFc':function(_0x4fe352,_0x47dd97){return _0x4fe352+_0x47dd97;},'doBRR':_0x5c3aaf(0x37d),'qVhEF':function(_0xe9088d,_0x3796e8){return _0xe9088d+_0x3796e8;},'YtFHv':_0x5c3aaf(0x3a7),'LdOEw':_0x5c3aaf(0x2ea)};if(!_0x57db27||_0x57db27['startsWith'](proxy_url_prefix))return _0x427406[_0x5c3aaf(0x1fa)](_0x427406['nNGDl'],_0x427406[_0x5c3aaf(0x355)])?_0x57db27:'';if(_0x57db27[_0x5c3aaf(0x245)](_0x5c3aaf(0x2fc))||_0x57db27['startsWith'](_0x427406[_0x5c3aaf(0x230)])||_0x57db27['startsWith'](_0x427406[_0x5c3aaf(0x2e4)])||_0x57db27[_0x5c3aaf(0x245)]('#')||_0x57db27[_0x5c3aaf(0x245)](_0x427406[_0x5c3aaf(0x1fb)])||_0x57db27[_0x5c3aaf(0x245)](_0x5c3aaf(0x36e))||_0x57db27['startsWith'](_0x427406[_0x5c3aaf(0x1c6)])||_0x57db27[_0x5c3aaf(0x245)](_0x427406[_0x5c3aaf(0x351)])||_0x57db27['startsWith'](_0x427406[_0x5c3aaf(0x26e)])||_0x57db27['startsWith'](_0x427406[_0x5c3aaf(0x31f)])||_0x57db27[_0x5c3aaf(0x245)](_0x427406[_0x5c3aaf(0x331)])||_0x57db27['startsWith'](_0x427406['cAlUR'])||_0x57db27[_0x5c3aaf(0x245)](_0x427406[_0x5c3aaf(0x35f)])||_0x57db27['startsWith'](_0x427406['ByxBQ'])||_0x57db27[_0x5c3aaf(0x245)](_0x427406['ujCST'])||_0x57db27[_0x5c3aaf(0x245)](_0x427406['nCkJz']))return _0x57db27;_0x57db27[_0x5c3aaf(0x245)](config_proxy_url)&&(_0x57db27=_0x57db27[_0x5c3aaf(0x2fa)](config_proxy_url[_0x5c3aaf(0x221)]));const _0x466202={'()(https?://|//)([^\\x5cs]+)':''};for(let _0x3491d3 in _0x466202){if(_0x427406[_0x5c3aaf(0x34e)](_0x427406[_0x5c3aaf(0x257)],_0x427406[_0x5c3aaf(0x257)])){let _0x5055e6=new RegExp(_0x3491d3,'gi');_0x57db27=_0x57db27[_0x5c3aaf(0x321)](_0x5055e6,(_0x584794,_0x4f1ecb,_0x3798b5,_0x29ae85)=>{const _0x3e191e=_0x5c3aaf,_0x5bdfdd={'RfBBT':function(_0x52e880,_0x413f4c){const _0x33c27f=_0x3437;return _0x427406[_0x33c27f(0x390)](_0x52e880,_0x413f4c);},'YDxSM':function(_0x29913f,_0x53db2d){return _0x29913f===_0x53db2d;},'cYuOy':_0x3e191e(0x1f3),'bLzCU':_0x427406['VTGTU'],'XHhhV':function(_0x4d10ee,_0x1a1deb){const _0x25cf21=_0x3e191e;return _0x427406[_0x25cf21(0x334)](_0x4d10ee,_0x1a1deb);}};let _0x5ca228;if(_0x427406[_0x3e191e(0x2d1)](_0x3798b5,'//')){if(_0x427406['QNrgK'](_0x427406[_0x3e191e(0x1d7)],_0x427406[_0x3e191e(0x328)]))_0x5ca228=_0x427406[_0x3e191e(0x1f5)];else{let _0x453913=_0x764e34['getAttribute'](_0x1801d0),_0x3435b6=_0x5bdfdd[_0x3e191e(0x28d)](_0x34acb1,_0x453913);_0x5bdfdd['YDxSM'](_0x25febb['tagName'][_0x3e191e(0x200)](),_0x5bdfdd[_0x3e191e(0x24f)])&&_0x5e429b[_0x3e191e(0x39e)](_0x5bdfdd[_0x3e191e(0x256)])&&_0x3caac0[_0x3e191e(0x399)]('integrity'),_0x5bdfdd[_0x3e191e(0x2dc)](_0x3435b6,_0x453913)&&_0x454675[_0x3e191e(0x1d6)](_0x3a0b84,_0x3435b6);}}else{if(_0x3e191e(0x2e9)===_0x427406[_0x3e191e(0x207)])_0x5ca228=_0x3798b5[_0x3e191e(0x321)](_0x427406[_0x3e191e(0x24b)],'')['toLowerCase']();else{const _0x4a356c=_0x427406[_0x3e191e(0x242)](_0x41d0b1,this[_0x3e191e(0x3a4)][_0x3e191e(0x23a)],_0x86c277);this['originalLocation']['href']=_0x4a356c;}}return _0x427406[_0x3e191e(0x270)](_0x427406['lmpSz'](_0x427406[_0x3e191e(0x270)](proxy_url_prefix,_0x5ca228),'/'),_0x29ae85);});}else this[_0x5c3aaf(0x3a4)]['reload'](_0x55adc6);}let _0x4ab5f5=config_proxy_url[_0x5c3aaf(0x2fa)](config_proxy_url[_0x5c3aaf(0x1e0)]('//'));_0x57db27['startsWith'](_0x4ab5f5)&&(_0x57db27=_0x57db27[_0x5c3aaf(0x2fa)](_0x4ab5f5[_0x5c3aaf(0x221)]));let _0xf90b65=_0x427406[_0x5c3aaf(0x2cd)](_0x427406['lkMEH'](_0x427406[_0x5c3aaf(0x350)](proxy_url_prefix,proxy_real_protocol),'/'),proxy_real_host),_0x5dbed2=proxy_url_prefix;if(_0x57db27['startsWith']('//')){if(_0x427406['QNrgK'](_0x427406[_0x5c3aaf(0x2d3)],'SlpXG'))return'';else _0x57db27=_0x427406[_0x5c3aaf(0x29e)](_0x5dbed2+_0x5c3aaf(0x301),_0x57db27['slice'](0x2)),_0x57db27=_0x57db27[_0x5c3aaf(0x321)](_0x427406[_0x5c3aaf(0x319)],_0x427406['LdOEw']);}else _0x57db27[_0x5c3aaf(0x245)]('/')&&(_0x57db27=_0x427406[_0x5c3aaf(0x29e)](_0xf90b65,_0x57db27));return _0x57db27;}var _0x43f1bf=[_0x2db8ce(0x250),_0x2db8ce(0x23a),_0x2db8ce(0x37b),'data-url',_0x2db8ce(0x236)],_0xd23b0={'attributes':!![],'childList':!![],'subtree':!![],'attributeOldValue':!![],'characterDataOldValue':!![],'attributeFilter':_0x43f1bf};async function _0x9e3111(_0x43ccbd,_0x25ab9b){const _0x2cc5cb=_0x2db8ce,_0x54fd30={'cKfhY':function(_0x30263f,_0x3b18d1){return _0x30263f(_0x3b18d1);},'vaqmq':function(_0x1ebbbf,_0x548eb0){return _0x1ebbbf(_0x548eb0);},'saKDt':function(_0xe52d57,_0x4584a1){return _0xe52d57===_0x4584a1;},'qSaCW':_0x2cc5cb(0x1f3),'XhPWD':_0x2cc5cb(0x293),'ZYTzY':function(_0x39bfef,_0x31cb09){return _0x39bfef!==_0x31cb09;},'frUKH':_0x2cc5cb(0x23c),'kngga':_0x2cc5cb(0x2d4),'oeumV':_0x2cc5cb(0x284)};_0x25ab9b[_0x2cc5cb(0x36a)](),_0x43ccbd[_0x2cc5cb(0x326)](_0x29afc2=>{const _0x5d45b7=_0x2cc5cb,_0x4824d6={'sKpmr':function(_0x24145f,_0x4332b9){const _0x52664a=_0x3437;return _0x54fd30[_0x52664a(0x3ab)](_0x24145f,_0x4332b9);}};switch(_0x29afc2['type']){case _0x5d45b7(0x21a):let _0x1e2b22=_0x29afc2[_0x5d45b7(0x32f)]['getAttribute'](_0x29afc2[_0x5d45b7(0x279)]);if(_0x43f1bf[_0x5d45b7(0x2df)](_0x29afc2[_0x5d45b7(0x279)])){let _0xc529e5=_0x54fd30[_0x5d45b7(0x251)](_0x2d5bc6,_0x1e2b22);_0x54fd30[_0x5d45b7(0x21f)](_0x29afc2[_0x5d45b7(0x32f)]['tagName'][_0x5d45b7(0x200)](),_0x54fd30[_0x5d45b7(0x243)])&&_0x29afc2[_0x5d45b7(0x32f)][_0x5d45b7(0x39e)]('integrity')&&(_0x54fd30[_0x5d45b7(0x22d)]===_0x5d45b7(0x293)?_0x29afc2[_0x5d45b7(0x32f)][_0x5d45b7(0x399)](_0x5d45b7(0x3a6)):_0x264163[_0x5d45b7(0x23a)]=_0x4d3ec6);if(_0x54fd30[_0x5d45b7(0x281)](_0xc529e5,_0x1e2b22)){if(_0x54fd30[_0x5d45b7(0x33e)]!==_0x54fd30[_0x5d45b7(0x382)])_0x29afc2[_0x5d45b7(0x32f)][_0x5d45b7(0x1d6)](_0x29afc2[_0x5d45b7(0x279)],_0xc529e5);else return _0x248965;}}break;case _0x54fd30[_0x5d45b7(0x1d1)]:_0x29afc2[_0x5d45b7(0x30d)][_0x5d45b7(0x326)](_0x791ca6=>{const _0x4d3320=_0x5d45b7;_0x4824d6[_0x4d3320(0x1f2)](_0x1d1af3,_0x791ca6);});break;}}),_0x25ab9b[_0x2cc5cb(0x20b)](document['documentElement'],_0xd23b0);}function _0x1d1af3(_0x11011c){const _0xbddd9b=_0x2db8ce,_0x53cbe6={'DTHdb':function(_0x1cf1e4,_0x42f03f){return _0x1cf1e4(_0x42f03f);},'ejgFg':_0xbddd9b(0x1f3),'vskCo':_0xbddd9b(0x3a6),'idqmr':function(_0x1d5b1c,_0x4ab1ca){return _0x1d5b1c!==_0x4ab1ca;},'cOfLy':_0xbddd9b(0x2cc),'PTdkR':'yJpFi','jaaVB':function(_0x304a33,_0x9713bf){return _0x304a33!==_0x9713bf;},'YJBBl':_0xbddd9b(0x237),'wGnSY':_0xbddd9b(0x1df),'jMyik':_0xbddd9b(0x38f),'ytFFo':function(_0x5e5645,_0x59da7f){return _0x5e5645===_0x59da7f;},'UEEJK':_0xbddd9b(0x288),'wWZrz':_0xbddd9b(0x34b),'Lejhr':function(_0x2535e9,_0xb4c9d2){return _0x2535e9(_0xb4c9d2);},'QuAOb':_0xbddd9b(0x250),'pmEzj':function(_0x4831d7,_0x1d846d){return _0x4831d7===_0x1d846d;},'uGkmQ':'iframe','JTTDU':function(_0x3dfc7f,_0x29e2e9){return _0x3dfc7f(_0x29e2e9);}};if(_0x11011c[_0xbddd9b(0x27e)])return;_0x11011c['_traversed']=!![],_0x11011c[_0xbddd9b(0x20a)]['forEach'](_0x492479=>{_0x1d1af3(_0x492479);});if(_0x53cbe6[_0xbddd9b(0x2ec)](_0x11011c[_0xbddd9b(0x2d6)],Node[_0xbddd9b(0x37c)])){if(_0x11011c[_0xbddd9b(0x2b2)](_0x53cbe6[_0xbddd9b(0x26d)])){}const _0x2dcb36=_0x43f1bf;_0x2dcb36[_0xbddd9b(0x326)](_0x4580f9=>{const _0x55e45d=_0xbddd9b;if(_0x11011c[_0x55e45d(0x39e)](_0x4580f9)){let _0x4a27a2=_0x11011c[_0x55e45d(0x2b2)](_0x4580f9),_0x187599=_0x53cbe6[_0x55e45d(0x2a3)](_0x2d5bc6,_0x4a27a2);_0x11011c['tagName']['toLowerCase']()===_0x53cbe6[_0x55e45d(0x2d9)]&&_0x11011c[_0x55e45d(0x39e)](_0x53cbe6[_0x55e45d(0x21c)])&&(_0x53cbe6[_0x55e45d(0x1d4)](_0x53cbe6[_0x55e45d(0x1d3)],_0x53cbe6[_0x55e45d(0x29d)])?_0x11011c[_0x55e45d(0x399)](_0x55e45d(0x3a6)):_0x2d9fa7=_0x2d7e94['substring'](0x1)),_0x53cbe6[_0x55e45d(0x2f9)](_0x187599,_0x4a27a2)&&_0x11011c[_0x55e45d(0x1d6)](_0x4580f9,_0x187599);}});_0x53cbe6['pmEzj'](_0x11011c['tagName']['toLowerCase'](),_0xbddd9b(0x20f))&&!_0x11011c[_0xbddd9b(0x38c)]&&(_0x11011c[_0xbddd9b(0x38c)]=!![],_0x11011c[_0xbddd9b(0x24d)]('load',function(){const _0x6c8b04=_0xbddd9b;if(_0x53cbe6['ytFFo'](_0x6c8b04(0x1dd),_0x53cbe6['UEEJK'])){const _0x5737c4=_0x5d6733[_0x6c8b04(0x2d5)][_0x6c8b04(0x23a)];if(_0x5737c4&&(_0x5737c4['includes'](_0x53cbe6[_0x6c8b04(0x313)])||_0x5737c4[_0x6c8b04(0x2df)](_0x6c8b04(0x38f)))){let _0x36105c=_0x5737c4[_0x6c8b04(0x321)](_0x53cbe6[_0x6c8b04(0x313)],_0x53cbe6['wGnSY']);_0x36105c=_0x36105c[_0x6c8b04(0x321)](_0x53cbe6[_0x6c8b04(0x35a)],_0x53cbe6[_0x6c8b04(0x27f)]),_0x45a919[_0x6c8b04(0x2d5)][_0x6c8b04(0x321)](_0x36105c);}}else{if(_0x11011c[_0x6c8b04(0x2ee)]&&!_0x11011c[_0x6c8b04(0x2ee)][_0x6c8b04(0x368)]){if(_0x53cbe6['idqmr'](_0x53cbe6[_0x6c8b04(0x30e)],_0x53cbe6['wWZrz']))return;else{_0x11011c[_0x6c8b04(0x2ee)][_0x6c8b04(0x368)]=!![],_0x53cbe6[_0x6c8b04(0x30f)](_0x1d1af3,_0x11011c['contentDocument']);let _0x20194c=new MutationObserver(_0x9e3111);_0x20194c['observe'](_0x11011c[_0x6c8b04(0x2ee)][_0x6c8b04(0x2f0)],_0xd23b0);}}}}));if(_0x53cbe6[_0xbddd9b(0x372)](_0x11011c[_0xbddd9b(0x314)][_0xbddd9b(0x200)](),_0x53cbe6[_0xbddd9b(0x38b)])){const _0xf2dc81=_0x11011c[_0xbddd9b(0x2ee)];if(_0xf2dc81&&!_0xf2dc81[_0xbddd9b(0x368)]){_0xf2dc81['_observerSet']=!![],_0x53cbe6['JTTDU'](_0x1d1af3,_0xf2dc81);let _0x4ed5d3=new MutationObserver(_0x9e3111);_0x4ed5d3[_0xbddd9b(0x20b)](_0xf2dc81['documentElement'],_0xd23b0);}}}}function _0x29c60f(){return;return;const _0x348d70=_0x2db8ce,_0x1b0e01={'NKxxy':function(_0x4cc5cd,_0x22330d){return _0x4cc5cd(_0x22330d);},'rPZoi':function(_0x484467,_0x3408d0){return _0x484467!==_0x3408d0;},'sumsA':function(_0x10a109,_0x24f5e7){return _0x10a109!==_0x24f5e7;},'DDAcW':_0x348d70(0x348),'PBdNN':_0x348d70(0x1d2),'QiYIA':function(_0x57fbae,_0x180e02){return _0x57fbae<_0x180e02;},'CaXnX':function(_0x5cbf75,_0x13dad8){return _0x5cbf75(_0x13dad8);},'mHPXf':function(_0x27ac08,_0x5d3d06){return _0x27ac08*_0x5d3d06;},'uVufW':function(_0x3a9b2b,_0x761b13){return _0x3a9b2b*_0x761b13;},'QNJoJ':_0x348d70(0x1c2),'whvhS':'AUjtO','DrRlr':_0x348d70(0x246),'YYuKN':_0x348d70(0x273),'FNRuW':'#ffffff','asZoo':_0x348d70(0x24e),'CkcRM':_0x348d70(0x253),'yEsBO':_0x348d70(0x248),'gHBtG':_0x348d70(0x338),'AwTsw':_0x348d70(0x22c),'fjasA':'span','rLRBS':_0x348d70(0x35d),'vvLRt':_0x348d70(0x1da),'NPHsd':_0x348d70(0x271),'isrgI':_0x348d70(0x218),'RlYWl':_0x348d70(0x216),'sUbVb':_0x348d70(0x2a7),'hNxii':function(_0x4d44fd,_0x5d4f77){return _0x4d44fd+_0x5d4f77;}};var _0x8f3c55;_0x1b0e01[_0x348d70(0x340)](typeof localStorage,_0x1b0e01[_0x348d70(0x2ab)])?_0x8f3c55=localStorage[_0x348d70(0x29a)](_0x1b0e01[_0x348d70(0x290)]):_0x8f3c55=null;var _0x267720=new Date()[_0x348d70(0x336)]();if(_0x8f3c55&&_0x1b0e01['QiYIA'](_0x267720-_0x1b0e01[_0x348d70(0x2a5)](parseInt,_0x8f3c55),_0x1b0e01[_0x348d70(0x2cb)](_0x1b0e01[_0x348d70(0x2cb)](_0x1b0e01[_0x348d70(0x28c)](0x18,0x3c),0x3c),0x3e8))){if(_0x1b0e01['sumsA'](_0x1b0e01[_0x348d70(0x232)],_0x1b0e01['whvhS']))return;else{const _0xc68aa2=_0x1b0e01[_0x348d70(0x27c)](_0x480f9a,this[_0x348d70(0x3a4)][_0x348d70(0x23a)]);return _0xc68aa2;}}var _0x3ac84c=document[_0x348d70(0x316)](_0x1b0e01[_0x348d70(0x39a)]);_0x3ac84c[_0x348d70(0x392)]['position']=_0x348d70(0x214),_0x3ac84c[_0x348d70(0x392)][_0x348d70(0x209)]='0',_0x3ac84c[_0x348d70(0x392)][_0x348d70(0x2a4)]='0',_0x3ac84c[_0x348d70(0x392)][_0x348d70(0x23b)]=_0x348d70(0x3ae),_0x3ac84c['style'][_0x348d70(0x3a0)]=_0x1b0e01['YYuKN'],_0x3ac84c['style'][_0x348d70(0x296)]=_0x1b0e01['FNRuW'],_0x3ac84c['style'][_0x348d70(0x1cf)]=_0x1b0e01[_0x348d70(0x1ff)],_0x3ac84c[_0x348d70(0x392)][_0x348d70(0x2a6)]=_0x1b0e01['CkcRM'],_0x3ac84c[_0x348d70(0x392)][_0x348d70(0x335)]=_0x1b0e01[_0x348d70(0x1d9)],_0x3ac84c['style'][_0x348d70(0x2a0)]=_0x1b0e01[_0x348d70(0x210)],_0x3ac84c[_0x348d70(0x392)]['zIndex']=_0x348d70(0x1e8),_0x3ac84c[_0x348d70(0x392)]['padding']=_0x1b0e01[_0x348d70(0x1fd)];var _0x1e0d1b=document[_0x348d70(0x316)](_0x1b0e01['fjasA']);_0x1e0d1b[_0x348d70(0x2cf)]=_0x348d70(0x239),_0x1e0d1b['style']['position']=_0x1b0e01[_0x348d70(0x307)],_0x1e0d1b[_0x348d70(0x392)][_0x348d70(0x3a1)]=_0x1b0e01['vvLRt'],_0x1e0d1b[_0x348d70(0x392)][_0x348d70(0x209)]=_0x1b0e01[_0x348d70(0x226)],_0x1e0d1b[_0x348d70(0x392)][_0x348d70(0x2d7)]=_0x1b0e01['isrgI'],_0x1e0d1b[_0x348d70(0x392)]['cursor']=_0x1b0e01['RlYWl'],_0x1e0d1b[_0x348d70(0x392)][_0x348d70(0x2a6)]=_0x1b0e01[_0x348d70(0x1d9)],_0x1e0d1b['style'][_0x348d70(0x335)]=_0x348d70(0x248),_0x1e0d1b[_0x348d70(0x223)]=function(){const _0xbfb0a0=_0x348d70;_0x3ac84c[_0xbfb0a0(0x392)][_0xbfb0a0(0x2c6)]=_0xbfb0a0(0x1e6),document['body'][_0xbfb0a0(0x392)]['marginTop']='0',_0x1b0e01['rPZoi'](typeof localStorage,_0xbfb0a0(0x348))&&localStorage['setItem'](_0xbfb0a0(0x1d2),new Date()[_0xbfb0a0(0x336)]()[_0xbfb0a0(0x1ed)]());},_0x3ac84c[_0x348d70(0x2cf)]=_0x1b0e01[_0x348d70(0x3ad)],_0x3ac84c['appendChild'](_0x1e0d1b),document[_0x348d70(0x2b4)]['insertBefore'](_0x3ac84c,document[_0x348d70(0x2b4)][_0x348d70(0x1e4)]),document['body'][_0x348d70(0x392)]['marginTop']=_0x1b0e01['hNxii'](_0x3ac84c[_0x348d70(0x1d0)],'px');}var _0x4d65d6=new MutationObserver(_0x9e3111);_0x4d65d6[_0x2db8ce(0x20b)](document['documentElement'],_0xd23b0),document[_0x2db8ce(0x24d)](_0x2db8ce(0x2e3),()=>{const _0x1b7ad4=_0x2db8ce,_0x12eb89={'NOpOI':function(_0x144256){return _0x144256();},'OZWbB':function(_0x19527d,_0x56c008){return _0x19527d(_0x56c008);},'PbiHD':function(_0x5c1070,_0x4f6d3d){return _0x5c1070===_0x4f6d3d;},'irrAI':_0x1b7ad4(0x36f),'NYHFg':_0x1b7ad4(0x1f1),'VPGbK':function(_0xec530f,_0x466411,_0x13850f){return _0xec530f(_0x466411,_0x13850f);}};_0x12eb89['OZWbB'](_0x1d1af3,document[_0x1b7ad4(0x2f0)]),_0x12eb89['NOpOI'](_0x29c60f),_0x12eb89[_0x1b7ad4(0x215)](typeof navigator,_0x12eb89[_0x1b7ad4(0x3a9)])&&!navigator['userAgent'][_0x1b7ad4(0x2df)](_0x12eb89[_0x1b7ad4(0x363)])&&(_0x12eb89[_0x1b7ad4(0x360)](setInterval,_0x2f0351,0x7d0),_0x12eb89[_0x1b7ad4(0x360)](setTimeout,()=>{const _0xbe8ee4=_0x1b7ad4;_0x12eb89[_0xbe8ee4(0x32b)](_0x86c387);},0x7d0));});function _0x332c83(_0x499a00,_0x2b1659){const _0x2c17a6=_0x2db8ce,_0x11cdcb={'LrmxP':function(_0x2aea6b,_0x1097e5){return _0x2aea6b instanceof _0x1097e5;},'whmGs':_0x2c17a6(0x37b),'mGdYY':_0x2c17a6(0x1ee),'ZdeQA':function(_0x5f3756,_0x90224e){return _0x5f3756(_0x90224e);},'EOqrA':'uARuY','fpcay':function(_0x22fc8f,_0x1393b1){return _0x22fc8f!==_0x1393b1;},'gEJBy':function(_0x215249,_0x366cd4){return _0x215249===_0x366cd4;},'uXKys':_0x2c17a6(0x29b),'lxWvT':_0x2c17a6(0x394)};if(!(_0x499a00 instanceof HTMLElement)||!_0x499a00[_0x2c17a6(0x39e)](_0x2b1659)||_0x499a00[_0x2c17a6(0x1c7)])return;_0x499a00[_0x2c17a6(0x1c7)]=!![],_0x499a00[_0x2c17a6(0x24d)](_0x11cdcb[_0x2c17a6(0x227)],function(_0x5e9687){const _0x56ce58=_0x2c17a6,_0x5055dd={'WAhRr':function(_0x2d1d24,_0x5594eb){const _0x5923d1=_0x3437;return _0x11cdcb[_0x5923d1(0x1f7)](_0x2d1d24,_0x5594eb);}};if(_0x56ce58(0x2dd)!==_0x11cdcb[_0x56ce58(0x31a)]){const _0x148563=_0x499a00[_0x56ce58(0x2b2)](_0x2b1659),_0x485772=_0x2d5bc6(_0x499a00['getAttribute'](_0x2b1659));if(_0x11cdcb[_0x56ce58(0x249)](_0x485772,_0x148563)){if(_0x11cdcb['gEJBy'](_0x11cdcb['uXKys'],_0x56ce58(0x29b)))_0x499a00[_0x56ce58(0x1d6)](_0x2b1659,_0x485772);else return _0x416ad3[_0x56ce58(0x22f)];}}else{if(!_0x11cdcb[_0x56ce58(0x2eb)](_0x9b7df6,_0x40eae7)||!_0x569cff[_0x56ce58(0x39e)](_0x11cdcb[_0x56ce58(0x374)])||_0xa1c307[_0x56ce58(0x1d8)])return;_0x2a19f2[_0x56ce58(0x1d8)]=!![],_0x55a15e['addEventListener'](_0x11cdcb[_0x56ce58(0x21b)],function(_0x15ad68){const _0x2478f8=_0x56ce58;if(!_0x8b7a02||!_0x18e2de['parentNode']){_0x1a4e2f[_0x2478f8(0x27b)](_0x2478f8(0x2b1));return;}_0x15ad68[_0x2478f8(0x2a2)](),_0x15ad68['target'][_0x2478f8(0x37b)]=_0x5055dd[_0x2478f8(0x367)](_0x31a37a,_0x15ad68['target']['action']),_0x15ad68[_0x2478f8(0x32f)][_0x2478f8(0x1ee)]();});}});}function _0x4dc5a5(_0x25a80f){const _0x3ab645=_0x2db8ce,_0x1771bd={'uxswY':function(_0x521f64,_0x29320a){return _0x521f64 instanceof _0x29320a;},'Ilpts':_0x3ab645(0x1ee)};if(!_0x1771bd[_0x3ab645(0x2c1)](_0x25a80f,HTMLFormElement)||!_0x25a80f[_0x3ab645(0x39e)](_0x3ab645(0x37b))||_0x25a80f['submitHookedAlready'])return;_0x25a80f['submitHookedAlready']=!![],_0x25a80f[_0x3ab645(0x24d)](_0x1771bd[_0x3ab645(0x31b)],function(_0xd9a121){const _0x353dd1=_0x3ab645;if(!_0x25a80f||!_0x25a80f[_0x353dd1(0x2db)]){console[_0x353dd1(0x27b)](_0x353dd1(0x2b1));return;}_0xd9a121[_0x353dd1(0x2a2)](),_0xd9a121[_0x353dd1(0x32f)][_0x353dd1(0x37b)]=_0x2d5bc6(_0xd9a121[_0x353dd1(0x32f)]['action']),_0xd9a121[_0x353dd1(0x32f)][_0x353dd1(0x1ee)]();});}function _0x505d93(_0x1cf5e4,_0x53e510,_0x5f1d7c){const _0x56e627=_0x2db8ce,_0x5c85d6={'wxFho':function(_0xfdc209,_0x39d22b){return _0xfdc209===_0x39d22b;},'mJQyk':'CLaVZ'};window[_0x56e627(0x371)]&&window[_0x56e627(0x371)]['active']&&(_0x5c85d6[_0x56e627(0x344)](_0x5c85d6[_0x56e627(0x39c)],_0x56e627(0x1e1))?window['proxy_worker_registration'][_0x56e627(0x2e5)][_0x56e627(0x25e)]({'type':_0x56e627(0x26a),'data':{'pathname':_0x1cf5e4,'real_protocol':_0x53e510,'real_host':_0x5f1d7c}}):_0x197e58=_0x56090a[_0x56e627(0x2fa)](_0x579214[_0x56e627(0x221)]));}function _0x538b04(){const _0x21abc8=_0x2db8ce,_0x2c1d0b={'BLCSb':function(_0xe3f29c,_0x3507ed){return _0xe3f29c!==_0x3507ed;},'YpEkt':function(_0x5ca741,_0x5b149c){return _0x5ca741===_0x5b149c;},'gehux':_0x21abc8(0x2b8),'EsQuX':_0x21abc8(0x2f1)};if(!proxy_real_protocol||_0x2c1d0b['BLCSb'](window['self'],window[_0x21abc8(0x209)])){if(_0x2c1d0b[_0x21abc8(0x213)]('ERNtR',_0x2c1d0b[_0x21abc8(0x305)]))return _0x151f0e;else return;}window[_0x21abc8(0x371)]&&window[_0x21abc8(0x371)][_0x21abc8(0x2e5)]&&window[_0x21abc8(0x371)][_0x21abc8(0x2e5)][_0x21abc8(0x25e)]({'type':_0x2c1d0b[_0x21abc8(0x274)],'data':{'protocol':proxy_real_protocol,'host':proxy_real_host}});}_0x2db8ce(0x1cc)in navigator&&navigator[_0x2db8ce(0x1cc)][_0x2db8ce(0x20c)]()['then'](function(_0x9d06e3){const _0x321989=_0x2db8ce,_0x234a8c={'ufjnd':_0x321989(0x379),'zouKJ':_0x321989(0x353),'ElYKF':function(_0x4b8e35,_0x4a575b){return _0x4b8e35(_0x4a575b);},'ZtFVA':_0x321989(0x1f3),'Psyva':function(_0x145769,_0x2a7b2d){return _0x145769!==_0x2a7b2d;},'UyemW':'EzSbR','KGrWk':_0x321989(0x217),'Jneba':_0x321989(0x312),'phYFK':_0x321989(0x35b),'QDkvl':function(_0x12a957){return _0x12a957();},'YgOrV':_0x321989(0x294),'FbbUR':function(_0x396847,_0x14a580){return _0x396847===_0x14a580;},'asLFn':_0x321989(0x1e9),'NYwyO':function(_0x34faf3,_0x283cca){return _0x34faf3+_0x283cca;},'ysRDg':function(_0x2d7f1b,_0x44ad3a){return _0x2d7f1b+_0x44ad3a;},'LjcHe':'/argon_service_worker.js?proxy_real_protocol=','baoko':_0x321989(0x362),'vkmaS':function(_0x421ab8,_0x43f531){return _0x421ab8===_0x43f531;},'sSmHE':'pBHCm','iOQWf':_0x321989(0x2bb)};var _0x5e1f29=_0x9d06e3[_0x321989(0x377)](function(_0x4c2bb5){const _0x17b53e=_0x321989;let _0xee8705=_0x4c2bb5[_0x17b53e(0x2e5)]&&_0x4c2bb5['active'][_0x17b53e(0x2b5)][_0x17b53e(0x2df)](_0x234a8c[_0x17b53e(0x2aa)]);_0xee8705&&(console[_0x17b53e(0x383)](_0x234a8c[_0x17b53e(0x261)]),window[_0x17b53e(0x371)]=_0x4c2bb5,_0x538b04());});!_0x5e1f29&&(_0x234a8c[_0x321989(0x3aa)](_0x234a8c[_0x321989(0x2f4)],_0x234a8c[_0x321989(0x2f4)])?window[_0x321989(0x24d)](_0x234a8c[_0x321989(0x33c)],function(){const _0x3bb0af=_0x321989,_0x1eab70={'IMfJf':function(_0x4a89e5,_0x43e0cd){const _0x250dae=_0x3437;return _0x234a8c[_0x250dae(0x1db)](_0x4a89e5,_0x43e0cd);},'vFUEk':_0x234a8c[_0x3bb0af(0x36d)],'EwImq':_0x3bb0af(0x3a6),'KHRJW':function(_0x4e7732,_0x35b062){const _0x1e90fb=_0x3bb0af;return _0x234a8c[_0x1e90fb(0x354)](_0x4e7732,_0x35b062);},'biZSE':_0x234a8c[_0x3bb0af(0x220)],'EUwYB':_0x234a8c[_0x3bb0af(0x369)],'apRGp':_0x234a8c['Jneba'],'HVuBw':_0x234a8c['phYFK'],'Abntq':function(_0x170363){const _0x12dee9=_0x3bb0af;return _0x234a8c[_0x12dee9(0x1e2)](_0x170363);},'cNSgV':_0x234a8c[_0x3bb0af(0x2a9)]};if(window[_0x3bb0af(0x371)]&&window['proxy_worker_registration'][_0x3bb0af(0x2e5)]){if(_0x234a8c['FbbUR'](_0x234a8c[_0x3bb0af(0x1d5)],_0x234a8c[_0x3bb0af(0x1d5)]))return;else _0x2a31fb(0x0);}navigator[_0x3bb0af(0x1cc)][_0x3bb0af(0x282)](_0x234a8c['NYwyO'](_0x234a8c[_0x3bb0af(0x29c)](_0x234a8c[_0x3bb0af(0x39b)](_0x234a8c[_0x3bb0af(0x1f9)],proxy_real_protocol),_0x234a8c[_0x3bb0af(0x224)]),proxy_real_host))[_0x3bb0af(0x2e2)](function(_0x5dd012){const _0x205025=_0x3bb0af;if(_0x1eab70[_0x205025(0x26c)](_0x1eab70[_0x205025(0x229)],_0x1eab70[_0x205025(0x229)])){let _0x3e43e3=_0x1eab70['IMfJf'](_0x2cf4b2,_0x4ce060);_0x1eeb87[_0x205025(0x32f)][_0x205025(0x314)]['toLowerCase']()===_0x1eab70[_0x205025(0x225)]&&_0x4ec6f0['target'][_0x205025(0x39e)](_0x205025(0x3a6))&&_0x1de73a[_0x205025(0x32f)][_0x205025(0x399)](_0x1eab70[_0x205025(0x231)]),_0x1eab70[_0x205025(0x26c)](_0x3e43e3,_0x319701)&&_0x1cc6e2[_0x205025(0x32f)][_0x205025(0x1d6)](_0x5e91eb[_0x205025(0x279)],_0x3e43e3);}else console[_0x205025(0x383)](_0x1eab70['EUwYB'],_0x5dd012[_0x205025(0x37a)],_0x1eab70[_0x205025(0x2f7)],proxy_real_protocol,_0x1eab70[_0x205025(0x2e0)],proxy_real_host),window[_0x205025(0x371)]=_0x5dd012,_0x1eab70[_0x205025(0x2fd)](_0x538b04);},function(_0x29c02e){const _0x1489e4=_0x3bb0af;console['log'](_0x1eab70[_0x1489e4(0x1dc)],_0x29c02e);});}):_0x49bb9[_0x321989(0x1cb)]['href']=_0x594452[_0x321989(0x2b7)]);});window[_0x2db8ce(0x1cb)][_0x2db8ce(0x22f)][_0x2db8ce(0x2df)](_0x2db8ce(0x339))&&setTimeout(()=>{const _0x36f512=_0x2db8ce,_0x5216c1={'VKIJX':_0x36f512(0x241),'fMLZu':_0x36f512(0x234),'uatlI':'argon-window-location-pathname','GHkWW':function(_0x30de20,_0x52a2ad){return _0x30de20===_0x52a2ad;},'XnkAG':_0x36f512(0x289),'ZvsIl':_0x36f512(0x381),'zkLOl':function(_0x57090b,_0x4fad3a,_0x1b8604){return _0x57090b(_0x4fad3a,_0x1b8604);},'WVWtG':_0x36f512(0x1ee)};document[_0x36f512(0x1fc)](_0x36f512(0x295))['addEventListener'](_0x5216c1[_0x36f512(0x387)],function(_0x5e9c98){const _0x5e1617=_0x36f512,_0x4fd1e1={'ZAwNp':_0x5216c1[_0x5e1617(0x359)],'kbbPM':_0x5e1617(0x1fe),'oBoBz':_0x5216c1['uatlI'],'CINyh':function(_0x191623,_0x237cb1){const _0xf60745=_0x5e1617;return _0x5216c1[_0xf60745(0x2bd)](_0x191623,_0x237cb1);},'nulHe':_0x5216c1[_0x5e1617(0x376)]};_0x5e9c98[_0x5e1617(0x2a2)]();const _0x5264ea=_0x5e9c98['target']['action'],_0x526d0e=_0x5e9c98[_0x5e1617(0x32f)][_0x5e1617(0x2d2)]||_0x5216c1[_0x5e1617(0x2f5)],_0x30d828=new FormData(_0x5e9c98[_0x5e1617(0x32f)]);let _0x37edc0={};_0x5216c1[_0x5e1617(0x2d0)](fetch,_0x5264ea,{'method':_0x526d0e,'body':_0x30d828,'headers':_0x37edc0})['then'](_0x367798=>{const _0x42ad5f=_0x5e1617,_0x3b0c3e={'lStLH':_0x4fd1e1[_0x42ad5f(0x204)],'SazNm':_0x4fd1e1[_0x42ad5f(0x1f4)],'oWjBr':function(_0x3cd3d9,_0x448f81,_0xc8ff60,_0x591fda){return _0x3cd3d9(_0x448f81,_0xc8ff60,_0x591fda);},'JZoxh':_0x4fd1e1[_0x42ad5f(0x212)]};if(_0x4fd1e1[_0x42ad5f(0x342)](_0x42ad5f(0x289),_0x4fd1e1['nulHe']))window[_0x42ad5f(0x1cb)][_0x42ad5f(0x23a)]=_0x367798['url'];else{const _0x5e4575=_0x1fb6b4[0x0];let _0xa438f0=new _0x3b50e7(_0x5e4575[_0x42ad5f(0x20d)]);_0xa438f0[_0x42ad5f(0x1c3)](_0x3b0c3e['lStLH'],_0x3f1ada),_0xa438f0[_0x42ad5f(0x1c3)](_0x3b0c3e[_0x42ad5f(0x27a)],_0x3b2abf);const _0x29c207=_0x3b0c3e[_0x42ad5f(0x373)](_0x3b9fb6,_0x3ded28['location'][_0x42ad5f(0x23a)],_0x3b722a,_0x4a4b07);_0xa438f0[_0x42ad5f(0x1c3)](_0x42ad5f(0x2da),_0x29c207),_0xa438f0[_0x42ad5f(0x1c3)](_0x3b0c3e['JZoxh'],_0x49b18e[_0x42ad5f(0x2d5)][_0x42ad5f(0x22f)]),_0x405cfb[0x0]=new _0x9be43e(_0x5e4575,{'headers':_0xa438f0});}})[_0x5e1617(0x23f)](_0x832009=>{const _0x3879fd=_0x5e1617;console[_0x3879fd(0x27b)](_0x5216c1['VKIJX'],_0x832009);});});},0xfa0);window[_0x2db8ce(0x324)]=_0x9e3111,window[_0x2db8ce(0x26f)]=_0x20a709,window[_0x2db8ce(0x252)]=_0x4da34b,window[_0x2db8ce(0x28b)]=_0x1d1af3,window[_0x2db8ce(0x222)]=_0x2d5bc6;function _0x2f0351(){const _0xd1be9a=_0x2db8ce,_0x564d73={'RiPFY':function(_0x4eae83,_0x5c4e84,_0x3a3660){return _0x4eae83(_0x5c4e84,_0x3a3660);},'pNhnM':function(_0x3870db,_0x3d870b,_0xdbd5f2){return _0x3870db(_0x3d870b,_0xdbd5f2);},'dJvgp':_0xd1be9a(0x237),'SdrKJ':function(_0x1f890a,_0x108ad1){return _0x1f890a===_0x108ad1;},'ENkmJ':_0xd1be9a(0x2ce),'QWgkS':_0xd1be9a(0x1df)},_0x53b458=window[_0xd1be9a(0x2d5)][_0xd1be9a(0x23a)];if(_0x53b458&&(_0x53b458[_0xd1be9a(0x2df)](_0x564d73[_0xd1be9a(0x264)])||_0x53b458['includes'](_0xd1be9a(0x38f)))){if(_0x564d73[_0xd1be9a(0x205)](_0x564d73['ENkmJ'],'yFxxz')){let _0x4851c2=_0x53b458[_0xd1be9a(0x321)](_0x564d73['dJvgp'],_0x564d73[_0xd1be9a(0x287)]);_0x4851c2=_0x4851c2[_0xd1be9a(0x321)](_0xd1be9a(0x38f),'www.netptop.com/youtube/watch/index.html?v='),window['___location'][_0xd1be9a(0x321)](_0x4851c2);}else{const _0x4889d1={'KilEF':function(_0x1467aa){return _0x1467aa();}};_0x564d73[_0xd1be9a(0x337)](_0x46de04,_0x12a774,0x7d0),_0x564d73[_0xd1be9a(0x276)](_0x394082,()=>{_0x4889d1['KilEF'](_0x817bb);},0x7d0);}}}function _0x86c387(){const _0x2505e9=_0x2db8ce,_0x271c4e={'tvCnW':function(_0xd96b1b,_0x18d46e){return _0xd96b1b===_0x18d46e;},'BRdVR':function(_0x1309b2,_0x61856b){return _0x1309b2===_0x61856b;},'EMKvm':function(_0x23db72,_0x42f739){return _0x23db72+_0x42f739;}},_0x23b600=window[_0x2505e9(0x2d5)]['pathname'],_0x1ba8e0=window[_0x2505e9(0x2d5)][_0x2505e9(0x23e)],_0x295fd4=window[_0x2505e9(0x2d5)][_0x2505e9(0x258)],_0x486dc2=window[_0x2505e9(0x2d5)][_0x2505e9(0x23a)];if(window[_0x2505e9(0x1c8)]===window[_0x2505e9(0x209)]&&_0x271c4e['tvCnW'](_0x23b600,'/')&&_0x271c4e[_0x2505e9(0x1ce)](_0x1ba8e0,'')&&_0x271c4e[_0x2505e9(0x343)](_0x295fd4,'')&&!_0x486dc2[_0x2505e9(0x34c)]('/')){let _0x36eec8=_0x271c4e['EMKvm'](_0x486dc2,'/');window[_0x2505e9(0x2d5)][_0x2505e9(0x23a)]=_0x36eec8;}}}function _0x4cc4a0(_0x2a11b2){const _0x4a6521=_0x2db8ce,_0x1b3b98={'Gqmlb':function(_0x4cd1fc,_0x4340f5){return _0x4cd1fc(_0x4340f5);},'Sqfwk':function(_0x5a1f01,_0x189405){return _0x5a1f01===_0x189405;},'BarvP':_0x4a6521(0x267),'AtWpG':_0x4a6521(0x389),'rHWqM':_0x4a6521(0x203),'kxOST':function(_0x355825,_0x3ee798){return _0x355825!==_0x3ee798;},'kApck':function(_0x5bd0fd,_0x2fd2b6){return _0x5bd0fd+_0x2fd2b6;},'TzqKD':_0x4a6521(0x221),'ATIvt':function(_0x7859bd,_0x4f571b){return _0x7859bd%_0x4f571b;},'TWHrv':function(_0x224179,_0x47fe31){return _0x224179!==_0x47fe31;},'DpFQU':_0x4a6521(0x1c9),'AlUBZ':_0x4a6521(0x280),'ajrKy':_0x4a6521(0x37b),'AkUsG':'uMYhF','mhNVh':_0x4a6521(0x2b3),'KCOhN':function(_0x4e8c85,_0x3a2bad){return _0x4e8c85+_0x3a2bad;},'vyDnC':_0x4a6521(0x378),'LawBz':_0x4a6521(0x275),'OGjSP':function(_0x2bdcab,_0x170b9e){return _0x2bdcab(_0x170b9e);}};function _0x3f8007(_0x534ffb){const _0x52c49d=_0x4a6521,_0x1a5841={'ZvuZs':function(_0x14ae8f,_0x55ccef){const _0x17f9e3=_0x3437;return _0x1b3b98[_0x17f9e3(0x375)](_0x14ae8f,_0x55ccef);},'mSqKm':function(_0x48c7d4,_0x39fa5b){return _0x48c7d4===_0x39fa5b;},'ZfGjT':'vzpnU'};if(_0x1b3b98[_0x52c49d(0x311)](typeof _0x534ffb,_0x52c49d(0x1ef))){if(_0x1b3b98['BarvP']!==_0x1b3b98[_0x52c49d(0x263)]){_0x3fe1f4[_0x52c49d(0x2ee)]['_observerSet']=!![],_0x1a5841['ZvuZs'](_0x2b7965,_0x56f4b7[_0x52c49d(0x2ee)]);let _0x169797=new _0x4d4719(_0x5bd6c5);_0x169797['observe'](_0x4fd96b[_0x52c49d(0x2ee)][_0x52c49d(0x2f0)],_0x5707fe);}else return function(_0x433f0f){}[_0x52c49d(0x24a)](_0x1b3b98[_0x52c49d(0x22b)])[_0x52c49d(0x2b6)](_0x1b3b98[_0x52c49d(0x1eb)]);}else _0x1b3b98[_0x52c49d(0x278)](_0x1b3b98[_0x52c49d(0x30a)]('',_0x534ffb/_0x534ffb)[_0x1b3b98[_0x52c49d(0x386)]],0x1)||_0x1b3b98[_0x52c49d(0x311)](_0x1b3b98['ATIvt'](_0x534ffb,0x14),0x0)?_0x1b3b98[_0x52c49d(0x391)](_0x1b3b98[_0x52c49d(0x322)],_0x1b3b98[_0x52c49d(0x322)])?_0x5c0430=_0x3519ec[_0x52c49d(0x29a)](_0x52c49d(0x1d2)):function(){return!![];}[_0x52c49d(0x24a)](_0x52c49d(0x378)+_0x1b3b98[_0x52c49d(0x2c3)])[_0x52c49d(0x2bc)](_0x1b3b98[_0x52c49d(0x269)]):_0x1b3b98[_0x52c49d(0x278)](_0x1b3b98['AkUsG'],_0x1b3b98[_0x52c49d(0x1f6)])?function(){const _0x23cd69=_0x52c49d;return _0x1a5841[_0x23cd69(0x2fe)](_0x1a5841[_0x23cd69(0x277)],_0x1a5841['ZfGjT'])?![]:![];}['constructor'](_0x1b3b98[_0x52c49d(0x24c)](_0x1b3b98['vyDnC'],'gger'))[_0x52c49d(0x2b6)](_0x1b3b98[_0x52c49d(0x2e6)]):_0x41b84d=null;_0x1b3b98[_0x52c49d(0x375)](_0x3f8007,++_0x534ffb);}try{if(_0x2a11b2)return _0x3f8007;else _0x1b3b98[_0x4a6521(0x380)](_0x3f8007,0x0);}catch(_0x40d642){}}";
var _0x5db2a1 = `;(function(){
  if (window.__argonCompatLoaded) return;
  window.__argonCompatLoaded = true;

  function defineCompatGetter(target, key, getter) {
    try {
      if (!target) return false;
      var existing = Object.getOwnPropertyDescriptor(target, key);
      if (existing) return true;
      Object.defineProperty(target, key, {
        configurable: true,
        get: getter
      });
      return true;
    } catch (e) {}
    return false;
  }

  function defineCompatValue(target, key, valueFactory) {
    try {
      if (!target) return false;
      var existing = Object.getOwnPropertyDescriptor(target, key);
      if (existing) return true;
      Object.defineProperty(target, key, {
        configurable: true,
        get: valueFactory
      });
      return true;
    } catch (e) {}
    return false;
  }

  try {
    defineCompatGetter(navigator, '___serviceWorker', function(){ return navigator.serviceWorker; }) ||
      defineCompatGetter(typeof Navigator !== 'undefined' ? Navigator.prototype : null, '___serviceWorker', function(){ return this.serviceWorker; });
  } catch (e) {}

  try {
    defineCompatValue(document, '___requestStorageAccessFor', function(){
      return typeof document.requestStorageAccessFor === 'function'
        ? document.requestStorageAccessFor.bind(document)
        : function(){ return Promise.reject(new Error('requestStorageAccessFor is unavailable')); };
    }) || defineCompatValue(typeof Document !== 'undefined' ? Document.prototype : null, '___requestStorageAccessFor', function(){
      return typeof this.requestStorageAccessFor === 'function'
        ? this.requestStorageAccessFor.bind(this)
        : function(){ return Promise.reject(new Error('requestStorageAccessFor is unavailable')); };
    });
  } catch (e) {}

  var suppressed = [
    "!!! proxy service worker already registered.",
    "Handler scope is deprecated. Use arrow function or bind."
  ];

  function shouldSuppress(args) {
    try {
      var text = Array.prototype.map.call(args || [], function(part){
        if (typeof part === 'string') return part;
        if (part && typeof part.message === 'string') return part.message;
        return '';
      }).join(' ');
      if (!text) return false;
      if (suppressed.some(function(entry){ return text.indexOf(entry) !== -1; })) return true;
      if (text.indexOf("IMA SDK is either not loaded from a google") !== -1) return true;
      if (text.indexOf("Cannot read properties of undefined (reading 'gdprApplies')") !== -1) return true;
    } catch (e) {}
    return false;
  }

  ['log', 'warn', 'error'].forEach(function(level){
    var original = console[level];
    if (typeof original !== 'function') return;
    console[level] = function(){
      if (shouldSuppress(arguments)) return;
      return original.apply(this, arguments);
    };
  });

  window.addEventListener('error', function(event){
    var msg = String((event && (event.message || (event.error && event.error.message))) || '');
    if (msg.indexOf("IMA SDK is either not loaded from a google") !== -1) {
      event.preventDefault();
      return true;
    }
  }, true);

  window.addEventListener('unhandledrejection', function(event){
    var reason = event && event.reason;
    var msg = String((reason && (reason.message || reason.stack)) || reason || '');
    if (msg.indexOf("gdprApplies") !== -1 || msg.indexOf("IMA SDK is either not loaded from a google") !== -1) {
      event.preventDefault();
    }
  });

  try {
    if (navigator.serviceWorker && typeof navigator.serviceWorker.register === 'function' && typeof navigator.serviceWorker.getRegistration === 'function') {
      var cleanupWrongArgonRegistrations = function(){
        try {
          return navigator.serviceWorker.getRegistrations().then(function(registrations){
            return Promise.all((registrations || []).map(function(registration){
              try {
                var worker = registration.active || registration.waiting || registration.installing;
                var scriptURL = worker && worker.scriptURL ? worker.scriptURL : '';
                var scopePath = new URL(registration.scope, location.href).pathname;
                var isArgonWorker = scriptURL.indexOf('/argon_service_worker.js') !== -1;
                var isWrongScope = isArgonWorker && !scopePath.startsWith('/ag/');
                if (!isWrongScope) return null;
                return registration.unregister();
              } catch (e) {
                return null;
              }
            }));
          }).catch(function(){ return null; });
        } catch (e) {
          return Promise.resolve(null);
        }
      };

      cleanupWrongArgonRegistrations();

      var originalRegister = navigator.serviceWorker.register.bind(navigator.serviceWorker);
      navigator.serviceWorker.register = function(scriptURL, options){
        options = options || {};
        var scope = options.scope || '/ag/';
        options.scope = scope;
        try {
          var absScript = new URL(scriptURL, location.href).href;
          return navigator.serviceWorker.getRegistration(scope).then(function(existing){
            if (existing && existing.active && existing.active.scriptURL === absScript) return existing;
            return originalRegister(scriptURL, options);
          }, function(){
            return originalRegister(scriptURL, options);
          });
        } catch (e) {
          return originalRegister(scriptURL, options);
        }
      };
    }
  } catch (e) {}
})();`;
var _0x51be68 = new _0x55f320();
var _0x5d4e2a = `;(function(){
  if (window.__argonSidebarAdded) return;
  window.__argonSidebarAdded = true;

  var PANEL_W = 228;
  var HANDLE_W = 36;
  var root = document.createElement('div');
  root.id = 'argon-hover-sidebar';
  root.style.position = 'fixed';
  root.style.left = '0';
  root.style.top = '50%';
  root.style.transform = 'translate(' + (-PANEL_W) + 'px, -50%)';
  root.style.width = PANEL_W + 'px';
  root.style.zIndex = '2147483647';
  root.style.transition = 'transform .2s cubic-bezier(.2,.8,.2,1)';
  root.style.fontFamily = 'Manrope, Segoe UI, sans-serif';

  var panel = document.createElement('div');
  panel.style.width = PANEL_W + 'px';
  panel.style.padding = '10px';
  panel.style.borderRadius = '0 12px 12px 0';
  panel.style.border = '1px solid #8d8992';
  panel.style.background = '#1a2d16';
  panel.style.color = '#f2f2f2';
  panel.style.boxShadow = '0 10px 20px rgba(0,0,0,.28)';
  panel.style.display = 'flex';
  panel.style.flexDirection = 'column';
  panel.style.gap = '6px';

  var title = document.createElement('div');
  title.textContent = 'ARGON';
  title.style.fontWeight = '700';
  title.style.fontSize = '12px';
  title.style.letterSpacing = '.12em';
  title.style.padding = '3px 6px 8px';
  title.style.borderBottom = '1px solid #494949';
  panel.appendChild(title);

  function getBase() {
    var base = (typeof config_proxy_url === 'string' && config_proxy_url) ? config_proxy_url : (window.location.origin || '');
    return String(base).replace(/\\/$/, '');
  }

  function makeBtn(label, action) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = label;
    btn.style.height = '32px';
    btn.style.borderRadius = '8px';
    btn.style.border = '1px solid #494949';
    btn.style.background = '#286936';
    btn.style.color = '#f2f2f2';
    btn.style.fontSize = '12px';
    btn.style.fontWeight = '600';
    btn.style.cursor = 'pointer';
    btn.style.transition = 'background .12s ease';
    btn.onmouseenter = function(){ btn.style.background = '#655aae'; };
    btn.onmouseleave = function(){ btn.style.background = '#286936'; };
    btn.onclick = action;
    panel.appendChild(btn);
  }

  makeBtn('Home', function(){ window.top.location.href = getBase() + '/'; });
  makeBtn('Reload', function(){ window.location.reload(); });
  makeBtn('Copy URL', function(){
    var href = String(window.location.href || '');
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(href).catch(function(){});
    }
  });
  makeBtn('New Tab', function(){ window.open(String(window.location.href || ''), '_blank'); });

  var handle = document.createElement('button');
  handle.type = 'button';
  handle.setAttribute('aria-label', 'Open sidebar');
  handle.textContent = '›';
  handle.style.position = 'absolute';
  handle.style.right = (-HANDLE_W) + 'px';
  handle.style.top = '50%';
  handle.style.transform = 'translateY(-50%)';
  handle.style.width = HANDLE_W + 'px';
  handle.style.height = '74px';
  handle.style.borderRadius = '0 10px 10px 0';
  handle.style.border = '1px solid #8d8992';
  handle.style.borderLeft = 'none';
  handle.style.background = '#655aae';
  handle.style.color = '#f2f2f2';
  handle.style.fontSize = '20px';
  handle.style.cursor = 'pointer';
  handle.style.boxShadow = '0 8px 16px rgba(0,0,0,.24)';

  var expanded = false;
  function setExpanded(state) {
    expanded = !!state;
    root.style.transform = expanded ? 'translate(0, -50%)' : 'translate(' + (-PANEL_W) + 'px, -50%)';
    handle.textContent = expanded ? '‹' : '›';
  }

  root.addEventListener('mouseenter', function(){ setExpanded(true); });
  root.addEventListener('mouseleave', function(){ setExpanded(false); });
  handle.addEventListener('click', function(){
    setExpanded(!expanded);
  });

  panel.appendChild(handle);
  root.appendChild(panel);
  (document.body || document.documentElement).appendChild(root);
})();`;
var _0xagclient = `;(function(){
  if (window.__argonEncodeNavPatch) return;
  window.__argonEncodeNavPatch = true;
  var KEY = 'ArG0n#SecuRe!2026';
  function b2u(s){ return Uint8Array.from(atob(s), function(c){ return c.charCodeAt(0); }); }
  function u2b(bytes){
    var bin = '';
    for (var i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return btoa(bin);
  }
  function xorBytes(data, key){
    var out = new Uint8Array(data.length);
    for (var i = 0; i < data.length; i++) out[i] = data[i] ^ key[i % key.length];
    return out;
  }
  function salt(){
    var a = new Uint8Array(8);
    crypto.getRandomValues(a);
    return u2b(a);
  }
  function agencode(url){
    var s = salt();
    var base = btoa(url);
    var key = new TextEncoder().encode(KEY + s);
    var data = new TextEncoder().encode(base);
    var enc = xorBytes(data, key);
    return s + ':' + u2b(enc);
  }
  function tokenPrefix(){
    return (typeof config_token_prefix === 'string' && config_token_prefix) ? config_token_prefix : '/ag/';
  }
  function proxyBase(){
    var b = (typeof config_proxy_url === 'string' && config_proxy_url) ? config_proxy_url : (window.location.origin + '/');
    return b.replace(/\\/+$/, '');
  }
  function isEncodedPath(p){
    return p.indexOf(tokenPrefix() + 'e/') === 0;
  }
  function isCanonicalPath(p){
    return p.indexOf(tokenPrefix() + 'http/') === 0 || p.indexOf(tokenPrefix() + 'https/') === 0;
  }
  function canonicalToAbsolute(path, search, hash){
    if (!isCanonicalPath(path)) return null;
    var rest = path.substring(tokenPrefix().length);
    var m = rest.match(/^(https?)\\/+([^\\/]+)(.*)$/);
    if (!m) return null;
    var tail = m[3] || '/';
    return m[1] + '://' + m[2] + tail + (search || '') + (hash || '');
  }
  function toEncodedProxy(abs){
    var tp = tokenPrefix();
    if (!tp.startsWith('/')) tp = '/' + tp;
    return proxyBase() + tp + 'e/' + encodeURIComponent(agencode(abs));
  }
  function rememberMode(){
    if (isEncodedPath(location.pathname)) {
      try { sessionStorage.setItem('__argon_encoded_mode', '1'); } catch (e) {}
    }
  }
  function encodedMode(){
    if (isEncodedPath(location.pathname)) return true;
    try { return sessionStorage.getItem('__argon_encoded_mode') === '1'; } catch (e) { return false; }
  }
  function rewriteMaybe(raw){
    try {
      if (!encodedMode()) return raw;
      var u = new URL(raw, location.href);
      if (u.origin === location.origin) {
        var abs = canonicalToAbsolute(u.pathname, u.search, u.hash);
        if (abs) return toEncodedProxy(abs);
      } else if (u.protocol === 'http:' || u.protocol === 'https:') {
        return toEncodedProxy(u.toString());
      }
    } catch (e) {}
    return raw;
  }
  rememberMode();
  if (encodedMode()) {
    var absNow = canonicalToAbsolute(location.pathname, location.search, location.hash);
    if (absNow) {
      location.replace(toEncodedProxy(absNow));
      return;
    }
  }
  var _ps = history.pushState;
  var _rs = history.replaceState;
  history.pushState = function(state, title, url){
    if (typeof url === 'string') url = rewriteMaybe(url);
    return _ps.apply(this, [state, title, url]);
  };
  history.replaceState = function(state, title, url){
    if (typeof url === 'string') url = rewriteMaybe(url);
    return _rs.apply(this, [state, title, url]);
  };
  document.addEventListener('click', function(e){
    var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if (!a) return;
    var href = a.getAttribute('href');
    if (!href) return;
    var next = rewriteMaybe(href);
    if (next !== href) {
      e.preventDefault();
      location.href = next;
    }
  }, true);
  document.addEventListener('submit', function(e){
    var f = e.target;
    if (!f || !f.getAttribute) return;
    var action = f.getAttribute('action') || '';
    if (!action) return;
    var next = rewriteMaybe(action);
    if (next !== action) f.setAttribute('action', next);
  }, true);
  setInterval(function(){
    rememberMode();
    if (!encodedMode()) return;
    var abs = canonicalToAbsolute(location.pathname, location.search, location.hash);
    if (abs) location.replace(toEncodedProxy(abs));
  }, 500);
})();`;
var _0xampfix = `;(function(){
  if (window.__argonAmpBypassInstalled) return;
  window.__argonAmpBypassInstalled = true;
  function tokenPrefix(){
    var tp = String(window.config_token_prefix || '/ag/');
    if (!tp.startsWith('/')) tp = '/' + tp;
    return tp;
  }

  function proxyBase(){
    var base = (typeof config_proxy_url === 'string' && config_proxy_url)
      ? config_proxy_url
      : (window.location.origin + '/');
    return base.replace(/\\/+$/, '');
  }

  function shouldBypassAbsolute(raw){
    try {
      var u = new URL(raw, location.href);
      var host = String(u.hostname || '').toLowerCase();
      var path = String(u.pathname || '');
      if (host === 'cdn.ampproject.org') return true;
      if ((host === 'www.google.com' || host.endsWith('.google.com')) && path.indexOf('/pagead/drt/ui') === 0) return true;
      if (host === 'pagead2.googlesyndication.com') return true;
      if (host === 'securepubads.g.doubleclick.net') return true;
      if (host === 'googleads.g.doubleclick.net') return true;
      if (host === 'tpc.googlesyndication.com') return true;
    } catch (e) {}
    return false;
  }

  function deproxyUrl(raw){
    if (typeof raw !== 'string' || !raw) return raw;
    try {
      var u = new URL(raw, location.href);
      if (u.origin !== location.origin) return raw;
      var path = u.pathname || '';
      var prefix = tokenPrefix();
      if (!path.startsWith(prefix)) return raw;
      var rest = path.substring(prefix.length);
      var m = rest.match(/^(https?)\\/+([^\\/]+)(.*)$/);
      if (!m) return raw;
      return m[1] + '://' + m[2] + (m[3] || '/') + (u.search || '') + (u.hash || '');
    } catch (e) {
      return raw;
    }
  }

  function escapeRegExp(value){
    return String(value).replace(/[\\\\^$.*+?()[\]{}|]/g, '\\\\$&');
  }

  function normalizeUrl(raw){
    var decoded = deproxyUrl(raw);
    if (decoded !== raw && shouldBypassAbsolute(decoded)) return decoded;
    return raw;
  }

  function normalizeSrcset(raw){
    if (typeof raw !== 'string' || !raw) return raw;
    var tp = tokenPrefix();
    var base = proxyBase();
    var prefix = escapeRegExp(base + tp);
    return raw.replace(new RegExp(prefix + '(https?)\\\\/([^\\\\s]+)', 'g'), function(_, protocol, rest){
      return protocol + '://' + rest;
    });
  }

  function normalizeValue(name, value){
    if (typeof value !== 'string') return value;
    var attr = String(name || '').toLowerCase();
    if (attr === 'srcset') return normalizeSrcset(value);
    if (attr === 'src' || attr === 'href' || attr === 'action' || attr === 'poster' || attr === 'data') {
      return normalizeUrl(value);
    }
    return value;
  }

  var originalSetAttribute = Element.prototype.setAttribute;
  Element.prototype.setAttribute = function(name, value){
    return originalSetAttribute.call(this, name, normalizeValue(name, value));
  };

  function patchPropertySetter(proto, name){
    if (!proto) return;
    var desc = Object.getOwnPropertyDescriptor(proto, name);
    if (!desc || typeof desc.set !== 'function' || desc.configurable === false) return;
    Object.defineProperty(proto, name, {
      configurable: true,
      enumerable: desc.enumerable,
      get: desc.get ? function(){ return desc.get.call(this); } : undefined,
      set: function(value){
        return desc.set.call(this, normalizeValue(name, value));
      }
    });
  }

  if (typeof HTMLScriptElement !== 'undefined') patchPropertySetter(HTMLScriptElement.prototype, 'src');
  if (typeof HTMLImageElement !== 'undefined') patchPropertySetter(HTMLImageElement.prototype, 'src');
  if (typeof HTMLIFrameElement !== 'undefined') patchPropertySetter(HTMLIFrameElement.prototype, 'src');
  if (typeof HTMLSourceElement !== 'undefined') {
    patchPropertySetter(HTMLSourceElement.prototype, 'src');
    patchPropertySetter(HTMLSourceElement.prototype, 'srcset');
  }
  if (typeof HTMLAnchorElement !== 'undefined') patchPropertySetter(HTMLAnchorElement.prototype, 'href');
  if (typeof HTMLLinkElement !== 'undefined') patchPropertySetter(HTMLLinkElement.prototype, 'href');
  if (typeof HTMLFormElement !== 'undefined') patchPropertySetter(HTMLFormElement.prototype, 'action');

  function fixNode(node){
    if (!node || node.nodeType !== 1) return;
    ['src', 'href', 'action', 'poster', 'data', 'srcset'].forEach(function(attr){
      if (!node.hasAttribute || !node.hasAttribute(attr)) return;
      var current = node.getAttribute(attr);
      var next = normalizeValue(attr, current);
      if (typeof next === 'string' && next !== current) {
        originalSetAttribute.call(node, attr, next);
      }
    });
    if (!node.querySelectorAll) return;
    node.querySelectorAll('[src],[href],[action],[poster],[data],[srcset]').forEach(function(child){
      ['src', 'href', 'action', 'poster', 'data', 'srcset'].forEach(function(attr){
        if (!child.hasAttribute(attr)) return;
        var current = child.getAttribute(attr);
        var next = normalizeValue(attr, current);
        if (typeof next === 'string' && next !== current) {
          originalSetAttribute.call(child, attr, next);
        }
      });
    });
  }

  function boot(){
    if (window.__argonAmpBypassBooted) return;
    window.__argonAmpBypassBooted = true;
    if (!document.documentElement) return;
    fixNode(document.documentElement);
    new MutationObserver(function(mutations){
      mutations.forEach(function(mutation){
        if (mutation.type === 'attributes') {
          fixNode(mutation.target);
          return;
        }
        Array.prototype.forEach.call(mutation.addedNodes || [], fixNode);
      });
    }).observe(document.documentElement, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['src', 'href', 'action', 'poster', 'data', 'srcset']
    });
  }

  if (document.documentElement) boot();
  document.addEventListener('DOMContentLoaded', boot, { once: true });
})();`;
var _0xpokifix = `;(function(){
  if (window.__argonPokiGuestPatchInstalled) return;
  window.__argonPokiGuestPatchInstalled = true;

  function toURL(input){
    try { return new URL(typeof input === 'string' ? input : String(input && input.url || ''), location.href); }
    catch (e) { return null; }
  }

  function isPokiWhoAmI(url){
    return !!url && url.hostname === 'poki-auth.poki.com' && url.pathname === '/sessions/whoami';
  }

  function guestWhoAmIResponse(){
    return new Response(JSON.stringify({
      session: null,
      user: null,
      authenticated: false
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  var originalFetch = window.fetch;
  if (typeof originalFetch === 'function') {
    window.fetch = function(input, init){
      var url = input instanceof Request ? toURL(input.url) : toURL(input);
      if (isPokiWhoAmI(url)) {
        return Promise.resolve(guestWhoAmIResponse());
      }
      return originalFetch.call(this, input, init);
    };
  }

  var originalOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(method, url){
    var parsed = toURL(url);
    this.__argonIsPokiWhoAmI = isPokiWhoAmI(parsed);
    this.__argonReadyStatePatched = false;
    return originalOpen.apply(this, arguments);
  };

  var originalSend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.send = function(body){
    if (!this.__argonIsPokiWhoAmI) return originalSend.call(this, body);
    var xhr = this;
    var payload = JSON.stringify({
      session: null,
      user: null,
      authenticated: false
    });
    if (!xhr.__argonReadyStatePatched) {
      xhr.__argonReadyStatePatched = true;
      Object.defineProperty(xhr, 'readyState', { configurable: true, get: function(){ return 4; } });
      Object.defineProperty(xhr, 'status', { configurable: true, get: function(){ return 200; } });
      Object.defineProperty(xhr, 'responseText', { configurable: true, get: function(){ return payload; } });
      Object.defineProperty(xhr, 'response', { configurable: true, get: function(){ return payload; } });
    }
    setTimeout(function(){
      if (typeof xhr.onreadystatechange === 'function') xhr.onreadystatechange(new Event('readystatechange'));
      if (typeof xhr.onload === 'function') xhr.onload(new Event('load'));
      xhr.dispatchEvent(new Event('readystatechange'));
      xhr.dispatchEvent(new Event('load'));
      xhr.dispatchEvent(new Event('loadend'));
    }, 0);
  };

  function patchAuthLink(node){
    if (!node || node.nodeType !== 1) return;
    var elements = [];
    if (node.matches && node.matches('a[href], form[action]')) elements.push(node);
    if (node.querySelectorAll) {
      node.querySelectorAll('a[href], form[action]').forEach(function(el){ elements.push(el); });
    }
    elements.forEach(function(el){
      var attr = el.hasAttribute('href') ? 'href' : 'action';
      var current = el.getAttribute(attr);
      if (!current) return;
      var url = toURL(current);
      if (!url || url.hostname !== 'poki-auth.poki.com') return;
      if (url.pathname.indexOf('/self-service/registration/browser') === 0 || url.pathname.indexOf('/self-service/login/browser') === 0) {
        el.setAttribute(attr, 'javascript:void(0)');
        el.addEventListener(attr === 'href' ? 'click' : 'submit', function(event){
          event.preventDefault();
        }, true);
      }
    });
  }

  function boot(){
    if (!document.documentElement) return;
    patchAuthLink(document.documentElement);
    new MutationObserver(function(mutations){
      mutations.forEach(function(mutation){
        if (mutation.type === 'attributes') {
          patchAuthLink(mutation.target);
          return;
        }
        Array.prototype.forEach.call(mutation.addedNodes || [], patchAuthLink);
      });
    }).observe(document.documentElement, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['href', 'action']
    });
  }

  if (document.documentElement) boot();
  document.addEventListener('DOMContentLoaded', boot, { once: true });
})();`;
if (_0x3cd507()) {
    _0x2ad78b(_0x2f7d4c => {
        console.log("node environment!!!");
        globalThis.proxy_url = _0x2f7d4c.proxy_url;
        globalThis.token_prefix = _0x2f7d4c.token_prefix;
        const _0x4bb9a1 = require("node:path");
        const _0x2ea43f = require("node:fs/promises");
        const _0x1a0127 = _0x4bb9a1.join(process.cwd(), "public", "index.html");
        _0x51be68.get("/", async _0x4f13f5 => {
            try {
                const _0x210579 = await _0x2ea43f.readFile(_0x1a0127, "utf8");
                return _0x4f13f5.html(_0x210579);
            } catch (_0x3b5047) {
                return _0x4f13f5.text("index.html not found at " + _0x1a0127, 404);
            }
        });
        _0x51be68.get("/service-worker.js", async _0x37ed1f => _0x37ed1f.text(_0xargsw, 200, {
            "Content-Type": "application/javascript; charset=utf-8",
            "Cache-Control": "no-store, no-cache, must-revalidate"
        }));
        _0x51be68.use("*", async (_0x918251, _0x1caa59) => {
        if (_0x918251.req.path.endsWith("argon-response-injected.js")) {
            return _0x918251.text(_0x5db2a1 + _0x21fc3f + _0xampfix + _0xpokifix, {
                headers: {
                    "Content-Type": "application/javascript",
                    "Cache-Control": "no-store, no-cache, must-revalidate"
                }
            });
        }
            await _0x1caa59();
        });
        _0x51be68.use("*", async (_0x15ccc6, _0x46da2b) => {
            await _0x46da2b();
        });
        _0x51be68.use("*", async (_0x30afc7, _0x6a6876) => {
            await _0x6a6876();
            _0x30afc7.res.headers.delete("Content-Security-Policy");
            _0x30afc7.res.headers.delete("Content-Security-Policy-Report-Only");
            _0x30afc7.res.headers.delete("Permissions-Policy");
            _0x30afc7.res.headers.delete("X-Frame-Options");
            _0x30afc7.res.headers.delete("Frame-Options");
            _0x30afc7.res.headers.delete("Cross-Origin-Embedder-Policy");
            _0x30afc7.res.headers.delete("Cross-Origin-Opener-Policy");
            _0x30afc7.res.headers.delete("Cross-Origin-Resource-Policy");
            _0x30afc7.res.headers.delete("Origin-Agent-Cluster");
        });
        _0x51be68.use("*", _0xargpmmw);
        _0x51be68.use("*", _0x3250ce);
        _0x51be68.use("*", _0x304886);
        _0x51be68.use("*", _0x58329e);
        _0x51be68.use("*", async (_0x457011, _0x1f99a2) => {
            try {
                await _0x1f99a2();
            } catch (_0xc677b) {
                console.error("Error in middleware for " + _0x457011.req.url + ": " + _0xc677b.message);
                return _0x457011.text("Internal Server Error: " + _0xc677b.message, 500);
            }
        });
        const _0x163c2a = parseInt(_0x2f7d4c.local_listen_port);
        Promise.resolve().then(() => {
            _0x21660c();
            return _0x5eaafa;
        }).then(({
                     serve: _0x14c12c
                 }) => {
            _0x14c12c({
                fetch: _0x51be68.fetch,
                port: _0x2f7d4c.local_listen_port
            }, _0x118874 => {
                console.log("Listening on http://localhost:" + _0x118874.port);
            });
        }).catch(_0x6661a7 => console.error("Failed to import @hono/node-server:", _0x6661a7));
    });
} else {
    _0x51be68.get("/service-worker.js", async _0x1e20e8 => _0x1e20e8.text(_0xargsw, 200, {
        "Content-Type": "application/javascript; charset=utf-8",
        "Cache-Control": "no-store, no-cache, must-revalidate"
    }));
    _0x51be68.use("*", async (_0x415e58, _0x1fdeca) => {
        if (_0x415e58.req.path.endsWith("argon-response-injected.js")) {
            return _0x415e58.text(_0x5db2a1 + _0x21fc3f + _0xampfix + _0xpokifix, {
                headers: {
                    "Content-Type": "application/javascript",
                    "Cache-Control": "no-store, no-cache, must-revalidate"
                }
            });
        }
        await _0x1fdeca();
    });
    _0x51be68.use("*", async (_0x357c6c, _0x1b59f7) => {
        globalThis.proxy_url = _0x357c6c.env.proxy_url;
        globalThis.token_prefix = _0x357c6c.env.token_prefix;
        await _0x1b59f7();
    });
    _0x51be68.use("*", async (_0x31ce26, _0x284821) => {
        await _0x284821();
        _0x31ce26.res.headers.delete("Content-Security-Policy");
        _0x31ce26.res.headers.delete("Content-Security-Policy-Report-Only");
        _0x31ce26.res.headers.delete("Permissions-Policy");
        _0x31ce26.res.headers.delete("X-Frame-Options");
        _0x31ce26.res.headers.delete("Frame-Options");
        _0x31ce26.res.headers.delete("Cross-Origin-Embedder-Policy");
        _0x31ce26.res.headers.delete("Cross-Origin-Opener-Policy");
        _0x31ce26.res.headers.delete("Cross-Origin-Resource-Policy");
        _0x31ce26.res.headers.delete("Origin-Agent-Cluster");
    });
    _0x51be68.use("*", _0xargpmmw);
    _0x51be68.use("*", _0x3250ce);
    _0x51be68.use("*", _0x304886);
    _0x51be68.use("*", _0x58329e);
    _0x51be68.use("*", async (_0x1814ff, _0x3b81c5) => {
        try {
            await _0x3b81c5();
        } catch (_0x641dee) {
            console.error("Error in middleware for " + _0x1814ff.req.url + ": " + _0x641dee.message);
            return _0x1814ff.text("Internal Server Error: " + _0x641dee.message, 500);
        }
    });
}
var _0x338013 = {
    fetch: _0x51be68.fetch
};
