'use strict';

const FALLBACK_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';
const CLIENT_HINTS = ['sec-ch-ua', 'sec-ch-ua-mobile', 'sec-ch-ua-platform',
  'sec-ch-ua-platform-version', 'sec-ch-ua-model', 'sec-ch-ua-full-version-list'];

function applyBrowserDeviceHeaders(outgoing, incoming) {
  const source = incoming instanceof Headers ? incoming : new Headers(incoming || {});
  // A desktop UA on a phone selects desktop HTML before CSS has a chance to
  // respond. Preserve the real browser identity on documents AND API/assets.
  outgoing.set('user-agent', source.get('user-agent') || FALLBACK_UA);
  for (const name of CLIENT_HINTS) {
    const value = source.get(name);
    if (value) outgoing.set(name, value);
    else outgoing.delete(name); // Safari does not send Chromium client hints.
  }
  if (source.has('accept-language')) outgoing.set('accept-language', source.get('accept-language'));
  else if (!outgoing.has('accept-language')) outgoing.set('accept-language', 'en-US,en;q=0.9');
  return outgoing;
}

module.exports = { applyBrowserDeviceHeaders };
