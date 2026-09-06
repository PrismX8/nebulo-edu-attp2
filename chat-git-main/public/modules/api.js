// modules/api.js
// Handles API base resolution and fetch helpers

export const state = {
  token: null,
  clientId: null,
  apiBase: '',
  apiBaseResolved: false,
  apiBasePromise: null
};

let trustedUiActionUntil = 0;
const uiActionToken = `ui-${Math.random().toString(36).slice(2)}-${Date.now().toString(36)}`;

function markTrustedUiAction(event) {
  if (event?.isTrusted === false) return;
  trustedUiActionUntil = Date.now() + 120_000;
}

if (typeof window !== 'undefined' && !window.__ubgModuleApiUiActionInstalled) {
  window.__ubgModuleApiUiActionInstalled = true;
  ['pointerdown', 'keydown', 'touchstart', 'submit'].forEach((eventName) => {
    window.addEventListener(eventName, markTrustedUiAction, { capture: true, passive: true });
  });
}

function addUiActionHeader(headers, method) {
  const verb = String(method || 'GET').toUpperCase();
  if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(verb)) return;
  headers['x-ubg-ui-action'] = uiActionToken;
  headers['x-ubg-ui-action-at'] = String(Date.now());
}

function isLoopbackHost(host) {
  return host === 'localhost' || host === '127.0.0.1';
}

function buildApiBaseCandidates() {
  const out = [];
  const seen = new Set();
  const add = (value) => {
    const normalized = String(value || '').replace(/\/+$/, '');
    if (!normalized || seen.has(normalized)) return;
    seen.add(normalized);
    out.push(normalized);
  };
  add(window.location.origin);
  try {
    const current = new URL(window.location.origin);
    if (isLoopbackHost(current.hostname)) {
      [400, 401, 402, 403, 404, 405, 5000].forEach((port) => {
        add(`${current.protocol}//${current.hostname}:${port}`);
      });
    }
  } catch {}
  return out;
}

async function probeApiBase(base) {
  try {
    const res = await fetch(`${base}/api/network/sites?__kchat_probe=1`, {
      method: 'GET',
      cache: 'no-store',
      mode: 'cors'
    });
    if (!res.ok) return false;
    const data = await res.json();
    return !!(Array.isArray(data?.sites) && data?.globalRoom);
  } catch {
    return false;
  }
}

export async function resolveApiBase() {
  if (state.apiBaseResolved) return state.apiBase;
  if (state.apiBasePromise) return state.apiBasePromise;
  state.apiBasePromise = (async () => {
    for (const candidate of buildApiBaseCandidates()) {
      if (await probeApiBase(candidate)) {
        state.apiBase = candidate === window.location.origin ? '' : candidate;
        state.apiBaseResolved = true;
        return state.apiBase;
      }
    }
    state.apiBase = '';
    state.apiBaseResolved = true;
    return state.apiBase;
  })();
  try {
    return await state.apiBasePromise;
  } finally {
    state.apiBasePromise = null;
  }
}

export async function api(url, options = {}) {
  const normalizedUrl = String(url || '').replace(/^\/api\/chat-effects(?=\/|$)/, '/api/tlk/chat-effects');
  const requestUrl = /^https?:\/\//i.test(normalizedUrl)
    ? normalizedUrl
    : `${await resolveApiBase()}${normalizedUrl}`;
  const headers = Object.assign({}, options.headers || {});
  // Always check localStorage for latest token (user might have logged in)
  const token = state.token || localStorage.getItem('token');
  if (token) headers['x-auth-token'] = token;
  // Always send x-tlk-client-id for chat-effects endpoints
  if (/\/api\/chat-effects\//.test(url)) {
    let clientId = state.clientId || localStorage.getItem('tlkClientId');
    if (!clientId) {
      clientId = Math.random().toString(36).slice(2) + Date.now();
      state.clientId = clientId;
      localStorage.setItem('tlkClientId', clientId);
    }
    headers['x-tlk-client-id'] = clientId;
  }
  const isFormData = options.body instanceof FormData;
  if (!isFormData && !headers['Content-Type'] && options.body && typeof options.body === 'object') headers['Content-Type'] = 'application/json';
  let method = options.method || 'GET';
  if (/\/api\/chat-effects\/rooms\/[^/]+\/activate$/.test(url)) method = 'POST';
  addUiActionHeader(headers, method);
  const res = await fetch(requestUrl, {
    method,
    headers,
    cache: options.cache,
    body: isFormData
      ? options.body
      : (headers['Content-Type'] === 'application/json' && options.body && typeof options.body === 'object')
        ? JSON.stringify(options.body)
        : options.body
  });
  if (!res.ok) {
    const err = new Error(`Request failed (${res.status})`);
    err.status = res.status;
    err.body = await res.text();
    throw err;
  }
  return res.json();
}
