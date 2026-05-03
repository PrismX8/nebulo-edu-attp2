// --- UI Helpers & Global Styles ---
export function injectGlobalStyles(css) {
  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);
}

// Toast Host
export function createToastHost() {
  const toastHost = document.createElement('div');
  toastHost.id = 'toast-host';
  document.body.appendChild(toastHost);
  return toastHost;
}
