const SHOP_ROUTE_PREFIX = '/shop';
const SHOP_STYLE_ID = 'ubg-professional-shop-styles';
const SHOP_NAV_ATTR = 'data-professional-shop-nav';

const esc = (value) => {
  const div = document.createElement('div');
  div.textContent = String(value ?? '');
  return div.innerHTML;
};

const money = (value) => {
  const amount = Number(value || 0);
  return Number.isFinite(amount) ? `$${amount.toFixed(2)}` : '$0.00';
};

const getHashPath = () => (window.location.hash || '#/').replace(/^#/, '') || '/';
const isShopRoute = () => getHashPath().startsWith(SHOP_ROUTE_PREFIX);

const typeMeta = (type = '') => {
  const normalized = String(type || '').trim().toLowerCase();
  if (normalized === 'combo') return { label: 'Combo', icon: '×', tone: 'violet' };
  if (normalized === 'subscription') return { label: 'Subscription', icon: '★', tone: 'gold' };
  return { label: 'Account', icon: '@', tone: 'blue' };
};

const fallbackDescription = (type = '') => {
  const normalized = String(type || '').trim().toLowerCase();
  if (normalized === 'combo') return 'A bundled package delivered immediately after purchase.';
  if (normalized === 'subscription') return 'A subscription package with instant delivery after checkout.';
  return 'An account package with instant delivery after purchase.';
};

const injectShopStyles = () => {
  if (document.getElementById(SHOP_STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = SHOP_STYLE_ID;
  style.textContent = `
    .shop-sidebar-item {
      min-height: 44px;
      gap: 10px;
      cursor: pointer;
      border: 1px solid transparent;
    }
    .shop-sidebar-item.active {
      background: linear-gradient(90deg, color-mix(in srgb, var(--accent-lo) 85%, transparent), transparent) !important;
      border-color: color-mix(in srgb, var(--accent) 34%, transparent) !important;
      color: var(--text-1) !important;
    }
    .shop-sidebar-icon {
      width: 29px;
      height: 29px;
      flex: 0 0 29px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      background: color-mix(in srgb, var(--accent-lo) 72%, var(--bg-card));
      border: 1px solid color-mix(in srgb, var(--accent) 24%, var(--border));
      color: var(--accent-hi);
    }
    .shop-sidebar-copy {
      min-width: 0;
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 1px;
    }
    .shop-sidebar-title {
      color: var(--text-1);
      font-size: 13px;
      font-weight: 750;
      line-height: 1.15;
    }
    .shop-sidebar-subtitle {
      color: var(--text-3);
      font-size: 10.5px;
      line-height: 1.15;
    }

    .professional-shop-page {
      width: min(1180px, 100%);
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 18px;
    }
    .professional-shop-page * { box-sizing: border-box; }

    .shop-hero {
      position: relative;
      overflow: hidden;
      border: 1px solid var(--border);
      border-radius: 18px;
      background:
        radial-gradient(circle at 82% 12%, rgba(124,58,237,0.2), transparent 34%),
        radial-gradient(circle at 8% 88%, rgba(59,130,246,0.09), transparent 34%),
        linear-gradient(145deg, color-mix(in srgb, var(--bg-card) 94%, white 6%), var(--bg-card));
      box-shadow: 0 20px 55px rgba(0,0,0,0.18);
      padding: clamp(22px, 4vw, 38px);
    }
    .shop-hero::after {
      content: '';
      position: absolute;
      width: 230px;
      height: 230px;
      right: -94px;
      bottom: -116px;
      border-radius: 50%;
      border: 1px solid rgba(255,255,255,0.06);
      box-shadow: 0 0 0 34px rgba(255,255,255,0.018), 0 0 0 68px rgba(255,255,255,0.012);
      pointer-events: none;
    }
    .shop-hero-content {
      position: relative;
      z-index: 1;
      max-width: 780px;
    }
    .shop-eyebrow {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      margin-bottom: 10px;
      color: var(--accent-hi);
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }
    .shop-eyebrow::before {
      content: '';
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: var(--accent-hi);
      box-shadow: 0 0 14px color-mix(in srgb, var(--accent-hi) 65%, transparent);
    }
    .shop-hero h1 {
      margin: 0;
      color: var(--text-1);
      font-size: clamp(27px, 4vw, 42px);
      line-height: 1.05;
      letter-spacing: -0.035em;
      font-weight: 820;
    }
    .shop-hero p {
      max-width: 650px;
      margin: 11px 0 0;
      color: var(--text-2);
      font-size: 14px;
      line-height: 1.65;
    }
    .shop-quick-nav {
      position: relative;
      z-index: 1;
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 22px;
    }
    .shop-quick-link {
      min-height: 36px;
      display: inline-flex;
      align-items: center;
      gap: 7px;
      padding: 0 12px;
      border: 1px solid rgba(255,255,255,0.09);
      border-radius: 9px;
      background: rgba(255,255,255,0.045);
      color: var(--text-2);
      font: inherit;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      transition: 140ms ease;
    }
    .shop-quick-link:hover {
      color: var(--text-1);
      background: rgba(255,255,255,0.08);
      transform: translateY(-1px);
    }

    .shop-stats {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 10px;
    }
    .shop-stat {
      min-width: 0;
      padding: 15px 16px;
      border: 1px solid var(--border);
      border-radius: 12px;
      background: color-mix(in srgb, var(--bg-card) 95%, white 5%);
    }
    .shop-stat-value {
      color: var(--text-1);
      font-size: 22px;
      font-weight: 800;
      line-height: 1;
    }
    .shop-stat-label {
      margin-top: 6px;
      color: var(--text-3);
      font-size: 11px;
      font-weight: 650;
    }

    .shop-panel {
      border: 1px solid var(--border);
      border-radius: 16px;
      background: var(--bg-card);
      overflow: hidden;
      box-shadow: 0 12px 34px rgba(0,0,0,0.1);
    }
    .shop-panel-head {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 14px;
      padding: 19px 20px 15px;
      border-bottom: 1px solid var(--border);
    }
    .shop-panel-title {
      color: var(--text-1);
      font-size: 16px;
      font-weight: 780;
      letter-spacing: -0.01em;
    }
    .shop-panel-subtitle {
      margin-top: 4px;
      color: var(--text-3);
      font-size: 12px;
      line-height: 1.45;
    }
    .shop-count-badge {
      min-height: 27px;
      display: inline-flex;
      align-items: center;
      padding: 0 9px;
      border: 1px solid var(--border);
      border-radius: 999px;
      background: var(--bg-raised);
      color: var(--text-2);
      font-size: 11px;
      font-weight: 700;
      white-space: nowrap;
    }

    .shop-controls {
      display: grid;
      grid-template-columns: minmax(220px, 1fr) auto;
      gap: 10px;
      padding: 14px 20px;
      border-bottom: 1px solid var(--border);
      background: color-mix(in srgb, var(--bg-card) 95%, black 5%);
    }
    .shop-search-wrap {
      position: relative;
      min-width: 0;
    }
    .shop-search-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-3);
      pointer-events: none;
    }
    .shop-search {
      width: 100%;
      min-height: 40px;
      padding: 0 38px 0 37px;
      border: 1px solid var(--border);
      border-radius: 10px;
      outline: none;
      background: var(--bg-input);
      color: var(--text-1);
      font: inherit;
      font-size: 13px;
      transition: 140ms ease;
    }
    .shop-search:focus {
      border-color: var(--accent);
      box-shadow: 0 0 0 3px var(--accent-lo);
    }
    .shop-search-clear {
      position: absolute;
      right: 8px;
      top: 50%;
      transform: translateY(-50%);
      width: 26px;
      height: 26px;
      display: none;
      align-items: center;
      justify-content: center;
      border: 0;
      border-radius: 7px;
      background: transparent;
      color: var(--text-3);
      cursor: pointer;
    }
    .shop-search-clear.visible { display: inline-flex; }
    .shop-search-clear:hover { background: var(--bg-hover); color: var(--text-1); }
    .shop-sort {
      min-height: 40px;
      min-width: 158px;
      padding: 0 34px 0 11px;
      border: 1px solid var(--border);
      border-radius: 10px;
      outline: none;
      background: var(--bg-input);
      color: var(--text-1);
      font: inherit;
      font-size: 12px;
      cursor: pointer;
    }
    .shop-filter-row {
      display: flex;
      align-items: center;
      gap: 7px;
      padding: 0 20px 14px;
      overflow-x: auto;
      background: color-mix(in srgb, var(--bg-card) 95%, black 5%);
    }
    .shop-filter-chip {
      min-height: 32px;
      flex: 0 0 auto;
      padding: 0 11px;
      border: 1px solid var(--border);
      border-radius: 999px;
      background: transparent;
      color: var(--text-2);
      font: inherit;
      font-size: 11px;
      font-weight: 700;
      cursor: pointer;
      transition: 120ms ease;
    }
    .shop-filter-chip:hover { background: var(--bg-hover); color: var(--text-1); }
    .shop-filter-chip.active {
      border-color: color-mix(in srgb, var(--accent) 55%, var(--border));
      background: var(--accent-lo);
      color: var(--accent-hi);
    }

    .shop-product-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 12px;
      padding: 18px 20px 22px;
    }
    .shop-product-card {
      min-width: 0;
      display: flex;
      flex-direction: column;
      border: 1px solid var(--border);
      border-radius: 13px;
      background: linear-gradient(180deg, color-mix(in srgb, var(--bg-raised) 92%, white 8%), var(--bg-card));
      overflow: hidden;
      transition: transform 150ms ease, border-color 150ms ease, box-shadow 150ms ease;
    }
    .shop-product-card:hover {
      transform: translateY(-2px);
      border-color: color-mix(in srgb, var(--accent) 30%, var(--border));
      box-shadow: 0 14px 32px rgba(0,0,0,0.18);
    }
    .shop-product-accent {
      height: 3px;
      background: linear-gradient(90deg, #3b82f6, #60a5fa);
    }
    .shop-product-card[data-tone='violet'] .shop-product-accent { background: linear-gradient(90deg, #7c3aed, #c084fc); }
    .shop-product-card[data-tone='gold'] .shop-product-accent { background: linear-gradient(90deg, #f59e0b, #fde047); }
    .shop-product-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 15px;
    }
    .shop-product-top {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 10px;
    }
    .shop-product-icon {
      width: 37px;
      height: 37px;
      flex: 0 0 37px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 10px;
      border: 1px solid rgba(96,165,250,0.24);
      background: rgba(59,130,246,0.1);
      color: #93c5fd;
      font-size: 15px;
      font-weight: 850;
    }
    .shop-product-card[data-tone='violet'] .shop-product-icon {
      border-color: rgba(192,132,252,0.26);
      background: rgba(124,58,237,0.11);
      color: #d8b4fe;
    }
    .shop-product-card[data-tone='gold'] .shop-product-icon {
      border-color: rgba(245,158,11,0.28);
      background: rgba(245,158,11,0.11);
      color: #fcd34d;
    }
    .shop-type-badge {
      min-height: 24px;
      display: inline-flex;
      align-items: center;
      padding: 0 8px;
      border: 1px solid var(--border);
      border-radius: 999px;
      background: var(--bg-card);
      color: var(--text-3);
      font-size: 10px;
      font-weight: 750;
      text-transform: uppercase;
      letter-spacing: 0.045em;
    }
    .shop-product-name {
      margin: 13px 0 0;
      color: var(--text-1);
      font-size: 15px;
      font-weight: 780;
      line-height: 1.3;
    }
    .shop-product-description {
      flex: 1;
      margin: 7px 0 14px;
      color: var(--text-3);
      font-size: 12px;
      line-height: 1.55;
    }
    .shop-product-meta {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      min-height: 28px;
      margin-bottom: 12px;
    }
    .shop-product-price {
      color: var(--text-1);
      font-size: 18px;
      font-weight: 820;
      letter-spacing: -0.02em;
    }
    .shop-stock {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      color: var(--text-3);
      font-size: 10.5px;
      font-weight: 650;
      white-space: nowrap;
    }
    .shop-stock::before {
      content: '';
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--success, #22c55e);
    }
    .shop-stock.low::before { background: var(--gold, #f59e0b); }
    .shop-stock.out::before { background: var(--danger, #ef4444); }
    .shop-buy-button {
      width: 100%;
      min-height: 38px;
      border: 1px solid color-mix(in srgb, var(--accent) 50%, transparent);
      border-radius: 9px;
      background: linear-gradient(135deg, var(--accent), var(--accent-hi));
      color: #fff;
      font: inherit;
      font-size: 12px;
      font-weight: 780;
      cursor: pointer;
      transition: 120ms ease;
      box-shadow: 0 7px 18px color-mix(in srgb, var(--accent) 18%, transparent);
    }
    .shop-buy-button:hover:not(:disabled) { filter: brightness(1.08); transform: translateY(-1px); }
    .shop-buy-button:active:not(:disabled) { transform: translateY(0); }
    .shop-buy-button:disabled {
      cursor: not-allowed;
      opacity: 0.48;
      box-shadow: none;
    }

    .shop-empty-state {
      grid-column: 1 / -1;
      padding: 42px 18px;
      text-align: center;
      color: var(--text-3);
    }
    .shop-empty-icon {
      width: 46px;
      height: 46px;
      margin: 0 auto 11px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--border);
      border-radius: 13px;
      background: var(--bg-raised);
      color: var(--text-2);
      font-size: 19px;
    }
    .shop-empty-title { color: var(--text-1); font-size: 14px; font-weight: 760; }
    .shop-empty-copy { margin-top: 5px; font-size: 12px; }

    .shop-bottom-grid {
      display: grid;
      grid-template-columns: minmax(0, 1.35fr) minmax(280px, 0.65fr);
      gap: 14px;
      align-items: start;
    }
    .shop-history-list {
      display: flex;
      flex-direction: column;
    }
    .shop-history-row {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto auto;
      align-items: center;
      gap: 14px;
      min-height: 62px;
      padding: 11px 18px;
      border-bottom: 1px solid var(--border);
    }
    .shop-history-row:last-child { border-bottom: 0; }
    .shop-history-main { min-width: 0; }
    .shop-history-name {
      color: var(--text-1);
      font-size: 12.5px;
      font-weight: 720;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .shop-history-date {
      margin-top: 4px;
      color: var(--text-3);
      font-size: 10.5px;
    }
    .shop-history-type {
      color: var(--text-3);
      font-size: 10px;
      text-transform: uppercase;
      font-weight: 700;
      letter-spacing: 0.04em;
    }
    .shop-history-price {
      color: var(--gold, #f59e0b);
      font-size: 12px;
      font-weight: 760;
      font-family: var(--font-mono, monospace);
    }
    .shop-history-empty {
      padding: 30px 18px;
      color: var(--text-3);
      font-size: 12px;
      text-align: center;
    }

    .shop-delivery-body { padding: 16px; }
    .shop-delivery-note {
      display: flex;
      align-items: flex-start;
      gap: 9px;
      margin-bottom: 12px;
      color: var(--text-3);
      font-size: 11px;
      line-height: 1.5;
    }
    .shop-delivery-note svg { flex: 0 0 auto; margin-top: 1px; }
    #shop-creds.shop-delivery-code {
      min-height: 120px;
      max-height: 270px;
      margin: 0;
      padding: 13px 14px;
      border: 1px solid var(--border);
      border-radius: 10px;
      background: #0c0c11;
      color: var(--text-2);
      font-size: 11.5px;
      line-height: 1.6;
      white-space: pre-wrap;
      overflow: auto;
    }
    #shop-creds.shop-delivery-code.has-delivery {
      border-color: rgba(34,197,94,0.24);
      color: #dcfce7;
    }
    .shop-delivery-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 10px;
    }
    .shop-copy-button {
      min-height: 34px;
      padding: 0 11px;
      border: 1px solid var(--border);
      border-radius: 8px;
      background: var(--bg-raised);
      color: var(--text-1);
      font: inherit;
      font-size: 11px;
      font-weight: 720;
      cursor: pointer;
    }
    .shop-copy-button:hover:not(:disabled) { background: var(--bg-hover); }
    .shop-copy-button:disabled { opacity: 0.42; cursor: not-allowed; }

    #shop-error.shop-error-banner {
      margin: 0;
      padding: 11px 14px;
      border: 1px solid rgba(239,68,68,0.28);
      border-radius: 10px;
      background: rgba(239,68,68,0.09);
      color: #fecaca;
      font-size: 12px;
      line-height: 1.45;
    }
    .shop-native-hooks {
      display: none !important;
    }

    @media (max-width: 980px) {
      .shop-product-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .shop-bottom-grid { grid-template-columns: 1fr; }
    }
    @media (max-width: 700px) {
      .page-scroll:has(.professional-shop-page) { padding: 16px !important; }
      .shop-stats { grid-template-columns: 1fr 1fr 1fr; }
      .shop-controls { grid-template-columns: 1fr; }
      .shop-sort { width: 100%; }
      .shop-product-grid { grid-template-columns: 1fr; padding: 14px; }
      .shop-filter-row { padding-left: 14px; padding-right: 14px; }
      .shop-panel-head, .shop-controls { padding-left: 14px; padding-right: 14px; }
      .shop-history-row { grid-template-columns: minmax(0, 1fr) auto; }
      .shop-history-type { display: none; }
    }
    @media (max-width: 480px) {
      .shop-hero { padding: 21px 18px; }
      .shop-hero p { font-size: 12.5px; }
      .shop-stats { gap: 7px; }
      .shop-stat { padding: 12px 10px; }
      .shop-stat-value { font-size: 18px; }
      .shop-stat-label { font-size: 9.5px; }
      .shop-quick-link { flex: 1 1 auto; justify-content: center; }
    }
  `;
  document.head.appendChild(style);
};

const ensureShopNavigation = () => {
  const sidebar = document.getElementById('sidebar');
  if (!sidebar || sidebar.querySelector(`[${SHOP_NAV_ATTR}]`)) {
    const existing = sidebar?.querySelector('.shop-sidebar-item');
    existing?.classList.toggle('active', isShopRoute());
    return;
  }

  const section = document.createElement('div');
  section.className = 'sidebar-section';
  section.setAttribute(SHOP_NAV_ATTR, '1');
  section.innerHTML = `
    <div class="sidebar-section-header">
      <span class="sidebar-section-label">Store</span>
    </div>
    <div class="sidebar-section-list">
      <div class="channel-item shop-sidebar-item ${isShopRoute() ? 'active' : ''}" role="link" tabindex="0" aria-label="Open shop">
        <span class="shop-sidebar-icon" aria-hidden="true">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 2l1 4h10l1-4"></path><path d="M5 6h14l1 16H4L5 6z"></path><path d="M9 10a3 3 0 0 0 6 0"></path>
          </svg>
        </span>
        <span class="shop-sidebar-copy">
          <span class="shop-sidebar-title">Shop</span>
          <span class="shop-sidebar-subtitle">Products & purchases</span>
        </span>
      </div>
    </div>
  `;

  const cosmetics = sidebar.querySelector('.sidebar-cosmetics-section');
  const footer = sidebar.querySelector('.sidebar-footer');
  if (cosmetics) sidebar.insertBefore(section, cosmetics);
  else if (footer) sidebar.insertBefore(section, footer);
  else sidebar.appendChild(section);

  const item = section.querySelector('.shop-sidebar-item');
  const openShop = () => { window.location.hash = '#/shop'; };
  item?.addEventListener('click', openShop);
  item?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openShop();
    }
  });
};

const inferApiOrigin = () => {
  try {
    const entries = performance.getEntriesByType('resource');
    for (let i = entries.length - 1; i >= 0; i -= 1) {
      const name = String(entries[i]?.name || '');
      if (/\/api\/shop\/(products|purchases)/.test(name) || /\/api\/network\/sites/.test(name)) {
        return new URL(name).origin;
      }
    }
  } catch {}
  return window.location.origin;
};

const shopGet = async (path) => {
  const token = localStorage.getItem('token') || '';
  const headers = { Accept: 'application/json' };
  if (token) headers['x-auth-token'] = token;
  const res = await fetch(`${inferApiOrigin()}${path}`, { headers, cache: 'no-store' });
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return res.json();
};

const parseNativeProducts = (table) => Array.from(table?.querySelectorAll('tbody tr') || []).map((row) => {
  const cells = row.querySelectorAll('td');
  const button = row.querySelector('[data-buy-id]');
  if (!button || cells.length < 3) return null;
  const rawPrice = String(cells[1]?.textContent || '').replace(/[^0-9.-]/g, '');
  return {
    _id: button.getAttribute('data-buy-id') || '',
    name: String(cells[0]?.textContent || '').trim(),
    description: '',
    price: Number(rawPrice || 0),
    type: String(cells[2]?.textContent || 'account').trim().toLowerCase(),
    stock: button.disabled ? 0 : -1,
    active: true
  };
}).filter(Boolean);

const parseNativeHistory = (table) => Array.from(table?.querySelectorAll('tbody tr') || []).map((row) => {
  const cells = row.querySelectorAll('td');
  if (cells.length < 3) return null;
  const rawPrice = String(cells[2]?.textContent || '').replace(/[^0-9.-]/g, '');
  return {
    productId: { name: String(cells[0]?.textContent || 'Product').trim(), type: '' },
    date: String(cells[1]?.textContent || '').trim(),
    price: Number(rawPrice || 0)
  };
}).filter(Boolean);

const waitForNativeShop = () => new Promise((resolve) => {
  let tries = 0;
  const check = () => {
    if (!isShopRoute()) { resolve(null); return; }
    const table = document.getElementById('shop-products');
    const error = document.getElementById('shop-error');
    if (!table) {
      if (tries++ < 80) setTimeout(check, 80);
      else resolve(null);
      return;
    }
    const loading = /loading/i.test(String(table.textContent || ''));
    const errorVisible = error && !error.classList.contains('hidden');
    if (!loading || errorVisible || tries++ > 45) resolve(table);
    else setTimeout(check, 80);
  };
  check();
});

let enhancementRun = 0;

const enhanceShopPage = async () => {
  const run = ++enhancementRun;
  if (!isShopRoute()) return;
  injectShopStyles();
  ensureShopNavigation();

  const nativeProductsTable = await waitForNativeShop();
  if (!nativeProductsTable || run !== enhancementRun || !isShopRoute()) return;

  const inner = nativeProductsTable.closest('.page-inner');
  if (!inner || inner.dataset.professionalShop === '1') return;
  inner.dataset.professionalShop = '1';
  inner.style.maxWidth = '1180px';

  const nativeHistoryTable = document.getElementById('shop-history');
  const errorEl = document.getElementById('shop-error');
  const credentialsEl = document.getElementById('shop-creds');
  const nativeProducts = parseNativeProducts(nativeProductsTable);
  const nativeHistory = parseNativeHistory(nativeHistoryTable);

  const hooks = document.createElement('div');
  hooks.className = 'shop-native-hooks';
  hooks.setAttribute('aria-hidden', 'true');
  hooks.appendChild(nativeProductsTable);
  if (nativeHistoryTable) hooks.appendChild(nativeHistoryTable);

  inner.innerHTML = '';
  inner.classList.add('professional-shop-page');

  const root = document.createElement('div');
  root.className = 'professional-shop-page';
  root.innerHTML = `
    <section class="shop-hero">
      <div class="shop-hero-content">
        <div class="shop-eyebrow">UBG Store</div>
        <h1>Everything you need, easy to find.</h1>
        <p>Browse every available product, compare options, check stock, and find your purchases or delivery details without digging through menus.</p>
        <div class="shop-quick-nav" aria-label="Shop sections">
          <button class="shop-quick-link" type="button" data-shop-scroll="shop-catalog">▦ Catalog</button>
          <button class="shop-quick-link" type="button" data-shop-scroll="shop-purchases">↻ Purchases</button>
          <button class="shop-quick-link" type="button" data-shop-scroll="shop-delivery">⌁ Latest delivery</button>
        </div>
      </div>
    </section>

    <div id="shop-pro-error-slot"></div>

    <section class="shop-stats" aria-label="Shop summary">
      <div class="shop-stat"><div id="shop-stat-products" class="shop-stat-value">—</div><div class="shop-stat-label">Products</div></div>
      <div class="shop-stat"><div id="shop-stat-stock" class="shop-stat-value">—</div><div class="shop-stat-label">Available now</div></div>
      <div class="shop-stat"><div id="shop-stat-purchases" class="shop-stat-value">—</div><div class="shop-stat-label">Your purchases</div></div>
    </section>

    <section id="shop-catalog" class="shop-panel">
      <div class="shop-panel-head">
        <div>
          <div class="shop-panel-title">Product catalog</div>
          <div class="shop-panel-subtitle">Search, filter, and sort the full catalog.</div>
        </div>
        <span id="shop-visible-count" class="shop-count-badge">Loading</span>
      </div>
      <div class="shop-controls">
        <div class="shop-search-wrap">
          <span class="shop-search-icon" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.35-4.35"></path></svg>
          </span>
          <input id="shop-pro-search" class="shop-search" type="search" placeholder="Search products or descriptions…" autocomplete="off" />
          <button id="shop-pro-clear" class="shop-search-clear" type="button" aria-label="Clear search">×</button>
        </div>
        <select id="shop-pro-sort" class="shop-sort" aria-label="Sort products">
          <option value="featured">Sort: Featured</option>
          <option value="price-low">Price: Low to high</option>
          <option value="price-high">Price: High to low</option>
          <option value="name">Name: A to Z</option>
        </select>
      </div>
      <div id="shop-pro-filters" class="shop-filter-row" aria-label="Product type filters">
        <button class="shop-filter-chip active" type="button" data-shop-filter="all">All</button>
        <button class="shop-filter-chip" type="button" data-shop-filter="account">Accounts</button>
        <button class="shop-filter-chip" type="button" data-shop-filter="combo">Combos</button>
        <button class="shop-filter-chip" type="button" data-shop-filter="subscription">Subscriptions</button>
      </div>
      <div id="shop-pro-products" class="shop-product-grid" aria-live="polite"></div>
    </section>

    <div class="shop-bottom-grid">
      <section id="shop-purchases" class="shop-panel">
        <div class="shop-panel-head">
          <div>
            <div class="shop-panel-title">Purchase history</div>
            <div class="shop-panel-subtitle">Your newest purchases appear first.</div>
          </div>
          <span id="shop-history-count" class="shop-count-badge">0 purchases</span>
        </div>
        <div id="shop-pro-history" class="shop-history-list"></div>
      </section>

      <section id="shop-delivery" class="shop-panel">
        <div class="shop-panel-head">
          <div>
            <div class="shop-panel-title">Latest delivery</div>
            <div class="shop-panel-subtitle">Copy your most recently delivered credentials.</div>
          </div>
        </div>
        <div class="shop-delivery-body">
          <div class="shop-delivery-note">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4M12 8h.01"></path></svg>
            <span>Delivery information is shown only after a successful purchase.</span>
          </div>
          <div id="shop-creds-slot"></div>
          <div class="shop-delivery-actions">
            <button id="shop-copy-delivery" class="shop-copy-button" type="button">Copy delivery</button>
          </div>
        </div>
      </section>
    </div>
  `;

  inner.appendChild(root);
  inner.appendChild(hooks);

  const errorSlot = root.querySelector('#shop-pro-error-slot');
  if (errorEl) {
    errorEl.classList.add('shop-error-banner');
    errorSlot.appendChild(errorEl);
  }

  const credsSlot = root.querySelector('#shop-creds-slot');
  if (credentialsEl) {
    credentialsEl.classList.add('shop-delivery-code');
    credsSlot.appendChild(credentialsEl);
  } else {
    const fallback = document.createElement('pre');
    fallback.id = 'shop-creds';
    fallback.className = 'shop-delivery-code';
    fallback.textContent = 'No credentials yet';
    credsSlot.appendChild(fallback);
  }

  const creds = document.getElementById('shop-creds');
  const search = root.querySelector('#shop-pro-search');
  const clear = root.querySelector('#shop-pro-clear');
  const sort = root.querySelector('#shop-pro-sort');
  const productsRoot = root.querySelector('#shop-pro-products');
  const historyRoot = root.querySelector('#shop-pro-history');
  const visibleCount = root.querySelector('#shop-visible-count');
  const historyCount = root.querySelector('#shop-history-count');

  let products = nativeProducts;
  let history = nativeHistory;
  let activeFilter = 'all';
  let query = '';
  let sortMode = 'featured';

  const updateDeliveryState = () => {
    const value = String(creds?.textContent || '').trim();
    const hasDelivery = !!value && !/^no credentials/i.test(value) && !/^no delivery/i.test(value);
    creds?.classList.toggle('has-delivery', hasDelivery);
    const copy = root.querySelector('#shop-copy-delivery');
    if (copy) copy.disabled = !hasDelivery;
  };

  const updateStats = () => {
    const productCount = products.length;
    const availableCount = products.filter((p) => p?.active !== false && Number(p?.stock ?? -1) !== 0).length;
    const purchaseCount = history.length;
    const p = root.querySelector('#shop-stat-products');
    const a = root.querySelector('#shop-stat-stock');
    const h = root.querySelector('#shop-stat-purchases');
    if (p) p.textContent = String(productCount);
    if (a) a.textContent = String(availableCount);
    if (h) h.textContent = String(purchaseCount);
  };

  const renderHistory = () => {
    if (historyCount) historyCount.textContent = `${history.length} purchase${history.length === 1 ? '' : 's'}`;
    if (!historyRoot) return;
    if (!history.length) {
      historyRoot.innerHTML = '<div class="shop-history-empty">No purchases yet. Anything you buy will appear here.</div>';
      return;
    }
    historyRoot.innerHTML = history.map((item) => {
      const product = item?.productId || {};
      const name = product?.name || item?.productName || 'Product';
      const type = typeMeta(product?.type || item?.type || '');
      const rawDate = item?.date;
      let dateText = 'Recently';
      if (rawDate) {
        const date = new Date(rawDate);
        dateText = Number.isNaN(date.getTime()) ? String(rawDate) : date.toLocaleString();
      }
      return `
        <div class="shop-history-row">
          <div class="shop-history-main">
            <div class="shop-history-name">${esc(name)}</div>
            <div class="shop-history-date">${esc(dateText)}</div>
          </div>
          <div class="shop-history-type">${esc(type.label)}</div>
          <div class="shop-history-price">${esc(money(item?.price || product?.price || 0))}</div>
        </div>
      `;
    }).join('');
  };

  const getFilteredProducts = () => {
    const normalizedQuery = query.trim().toLowerCase();
    let list = products.filter((product) => {
      const type = String(product?.type || 'account').toLowerCase();
      if (activeFilter !== 'all' && type !== activeFilter) return false;
      if (!normalizedQuery) return true;
      const haystack = `${product?.name || ''} ${product?.description || ''} ${type}`.toLowerCase();
      return haystack.includes(normalizedQuery);
    });
    list = [...list];
    if (sortMode === 'price-low') list.sort((a, b) => Number(a?.price || 0) - Number(b?.price || 0));
    else if (sortMode === 'price-high') list.sort((a, b) => Number(b?.price || 0) - Number(a?.price || 0));
    else if (sortMode === 'name') list.sort((a, b) => String(a?.name || '').localeCompare(String(b?.name || '')));
    return list;
  };

  const renderProducts = () => {
    const list = getFilteredProducts();
    if (visibleCount) visibleCount.textContent = `${list.length} of ${products.length}`;
    if (!productsRoot) return;
    if (!list.length) {
      productsRoot.innerHTML = `
        <div class="shop-empty-state">
          <div class="shop-empty-icon">⌕</div>
          <div class="shop-empty-title">No products found</div>
          <div class="shop-empty-copy">Try a different search or category.</div>
        </div>`;
      return;
    }

    productsRoot.innerHTML = list.map((product) => {
      const meta = typeMeta(product?.type);
      const stock = Number(product?.stock ?? -1);
      const soldOut = product?.active === false || stock === 0;
      const lowStock = stock > 0 && stock <= 5;
      const stockText = soldOut ? 'Out of stock' : stock < 0 ? 'Available' : `${stock} left`;
      const stockClass = soldOut ? 'out' : lowStock ? 'low' : '';
      const comboCount = meta.label === 'Combo' ? Math.max(0, Number(product?.options?.count || 0)) : 0;
      const description = String(product?.description || '').trim() || fallbackDescription(product?.type);
      return `
        <article class="shop-product-card" data-tone="${esc(meta.tone)}">
          <div class="shop-product-accent"></div>
          <div class="shop-product-body">
            <div class="shop-product-top">
              <span class="shop-product-icon" aria-hidden="true">${esc(comboCount > 1 ? `×${comboCount}` : meta.icon)}</span>
              <span class="shop-type-badge">${esc(meta.label)}</span>
            </div>
            <h3 class="shop-product-name">${esc(product?.name || 'Product')}</h3>
            <p class="shop-product-description">${esc(description)}</p>
            <div class="shop-product-meta">
              <span class="shop-product-price">${esc(money(product?.price))}</span>
              <span class="shop-stock ${stockClass}">${esc(stockText)}</span>
            </div>
            <button class="shop-buy-button" type="button" data-pro-buy-id="${esc(product?._id || '')}" ${soldOut ? 'disabled' : ''}>
              ${soldOut ? 'Out of stock' : `Buy for ${esc(money(product?.price))}`}
            </button>
          </div>
        </article>
      `;
    }).join('');

    productsRoot.querySelectorAll('[data-pro-buy-id]').forEach((button) => {
      button.addEventListener('click', async () => {
        const id = String(button.getAttribute('data-pro-buy-id') || '');
        const nativeButton = nativeProductsTable.querySelector(`[data-buy-id="${CSS.escape(id)}"]`);
        if (!nativeButton || nativeButton.disabled) return;

        const previousDelivery = String(creds?.textContent || '');
        button.disabled = true;
        button.textContent = 'Purchasing…';
        nativeButton.click();

        const startedAt = Date.now();
        const waitForResult = () => new Promise((resolve) => {
          const poll = () => {
            const nextDelivery = String(creds?.textContent || '');
            const errorVisible = errorEl && !errorEl.classList.contains('hidden') && String(errorEl.textContent || '').trim();
            if (nextDelivery !== previousDelivery && !/^no credentials/i.test(nextDelivery)) { resolve('success'); return; }
            if (errorVisible) { resolve('error'); return; }
            if (Date.now() - startedAt > 12000) { resolve('timeout'); return; }
            setTimeout(poll, 100);
          };
          poll();
        });

        const result = await waitForResult();
        if (result === 'success') {
          const target = products.find((product) => String(product?._id || '') === id);
          if (target && Number(target.stock) > 0) target.stock = Math.max(0, Number(target.stock) - 1);
          updateDeliveryState();
          button.textContent = 'Purchased ✓';
          try {
            const freshHistory = await shopGet('/api/shop/purchases');
            if (Array.isArray(freshHistory)) history = freshHistory;
          } catch {}
          updateStats();
          renderHistory();
          setTimeout(renderProducts, 900);
        } else {
          button.disabled = false;
          button.textContent = result === 'timeout' ? 'Try again' : `Buy for ${money(products.find((p) => String(p?._id || '') === id)?.price)}`;
        }
      });
    });
  };

  root.querySelectorAll('[data-shop-scroll]').forEach((button) => {
    button.addEventListener('click', () => {
      const target = document.getElementById(button.getAttribute('data-shop-scroll'));
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  root.querySelectorAll('[data-shop-filter]').forEach((button) => {
    button.addEventListener('click', () => {
      activeFilter = button.getAttribute('data-shop-filter') || 'all';
      root.querySelectorAll('[data-shop-filter]').forEach((chip) => chip.classList.toggle('active', chip === button));
      renderProducts();
    });
  });

  search?.addEventListener('input', () => {
    query = String(search.value || '');
    clear?.classList.toggle('visible', !!query);
    renderProducts();
  });
  clear?.addEventListener('click', () => {
    if (!search) return;
    search.value = '';
    query = '';
    clear.classList.remove('visible');
    search.focus();
    renderProducts();
  });
  sort?.addEventListener('change', () => {
    sortMode = String(sort.value || 'featured');
    renderProducts();
  });

  root.querySelector('#shop-copy-delivery')?.addEventListener('click', async (event) => {
    const value = String(creds?.textContent || '').trim();
    if (!value || /^no credentials/i.test(value)) return;
    const button = event.currentTarget;
    try {
      await navigator.clipboard.writeText(value);
      const previous = button.textContent;
      button.textContent = 'Copied ✓';
      setTimeout(() => { button.textContent = previous; }, 1200);
    } catch {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(creds);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  });

  if (creds) {
    const observer = new MutationObserver(updateDeliveryState);
    observer.observe(creds, { childList: true, subtree: true, characterData: true });
  }

  updateDeliveryState();
  updateStats();
  renderHistory();
  renderProducts();

  try {
    const [detailedProducts, detailedHistory] = await Promise.all([
      shopGet('/api/shop/products').catch(() => null),
      shopGet('/api/shop/purchases').catch(() => null)
    ]);
    if (run !== enhancementRun || !isShopRoute()) return;
    if (Array.isArray(detailedProducts)) products = detailedProducts;
    if (Array.isArray(detailedHistory)) history = detailedHistory;
    updateStats();
    renderHistory();
    renderProducts();
  } catch {}
};

let scheduled = null;
const scheduleEnhancement = () => {
  clearTimeout(scheduled);
  scheduled = setTimeout(() => {
    injectShopStyles();
    ensureShopNavigation();
    if (isShopRoute()) enhanceShopPage().catch(() => {});
  }, 40);
};

injectShopStyles();

const domObserver = new MutationObserver(() => {
  ensureShopNavigation();
  if (isShopRoute()) scheduleEnhancement();
});
domObserver.observe(document.documentElement, { childList: true, subtree: true });

window.addEventListener('hashchange', () => {
  enhancementRun += 1;
  scheduleEnhancement();
});
window.addEventListener('DOMContentLoaded', scheduleEnhancement, { once: true });
scheduleEnhancement();
