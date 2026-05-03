// --- Utility Functions ---
export function esc(v) {
  if (v === null || v === undefined) return '';
  const div = document.createElement('div');
  div.textContent = String(v);
  return div.innerHTML;
}

export function formatCoins(value) {
  if (typeof value !== 'number') return value;
  return value.toLocaleString('en-US', { maximumFractionDigits: 0 });
}
