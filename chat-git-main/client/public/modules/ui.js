// modules/ui.js
// Handles UI rendering, DOM manipulation, and style injection

export function injectGlobalStyles(css) {
  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);
}

export function showComposerNotice(msg, type = 'info', duration = 3000) {
  let el = document.getElementById('composer-notice');
  if (!el) {
    el = document.createElement('div');
    el.id = 'composer-notice';
    el.style.position = 'fixed';
    el.style.bottom = '24px';
    el.style.left = '50%';
    el.style.transform = 'translateX(-50%)';
    el.style.zIndex = '9999';
    el.style.background = '#222';
    el.style.color = '#fff';
    el.style.padding = '12px 24px';
    el.style.borderRadius = '12px';
    el.style.fontSize = '15px';
    el.style.boxShadow = '0 2px 16px rgba(0,0,0,0.18)';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.style.background = type === 'success' ? '#4a9970' : type === 'error' ? '#a05060' : '#222';
  el.style.display = 'block';
  setTimeout(() => { el.style.display = 'none'; }, duration);
}
