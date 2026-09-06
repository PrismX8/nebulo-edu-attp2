let socketPromise = null;
let socketInstance = null;
let activeOrigin = '';

const normalizeOrigin = (origin) => String(origin || window.location.origin || '').replace(/\/+$/, '') || window.location.origin;

const loadScript = (src) => new Promise((resolve, reject) => {
  const existing = document.querySelector(`script[data-socket-io-src="${src}"]`);
  if (existing) {
    if (typeof window.io === 'function') {
      resolve(window.io.bind(window));
      return;
    }
    existing.addEventListener('load', () => resolve(window.io.bind(window)), { once: true });
    existing.addEventListener('error', () => reject(new Error(`Failed to load ${src}`)), { once: true });
    return;
  }

  const script = document.createElement('script');
  script.src = src;
  script.async = true;
  script.dataset.socketIoSrc = src;
  script.onload = () => {
    if (typeof window.io === 'function') resolve(window.io.bind(window));
    else reject(new Error('Socket.IO client loaded without io factory'));
  };
  script.onerror = () => reject(new Error(`Failed to load ${src}`));
  document.head.appendChild(script);
});

const loadIoFactory = async (origin) => {
  const esmUrl = new URL('/socket.io/socket.io.esm.min.js', `${origin}/`).href;
  try {
    const mod = await import(esmUrl);
    if (typeof mod?.io === 'function') return mod.io;
  } catch {}

  const scriptUrl = new URL('/socket.io/socket.io.js', `${origin}/`).href;
  return loadScript(scriptUrl);
};

export const getSocket = async (origin = window.location.origin) => {
  const normalizedOrigin = normalizeOrigin(origin);
  if (socketInstance && activeOrigin === normalizedOrigin) return socketInstance;
  if (socketPromise && activeOrigin === normalizedOrigin) return socketPromise;

  if (socketInstance && activeOrigin !== normalizedOrigin) {
    socketInstance.disconnect();
    socketInstance = null;
  }

  activeOrigin = normalizedOrigin;
  socketPromise = loadIoFactory(normalizedOrigin)
    .then((io) => {
      const getToken = () => String(localStorage.getItem('token') || '').trim();
      socketInstance = io(normalizedOrigin, {
        path: '/socket.io/',
        transports: ['websocket', 'polling'],
        auth: (cb) => cb({ token: getToken() })
      });
      return socketInstance;
    })
    .catch((err) => {
      socketPromise = null;
      if (activeOrigin === normalizedOrigin) activeOrigin = '';
      throw err;
    });

  return socketPromise;
};

export default getSocket;
