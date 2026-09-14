(() => {
  'use strict';

  const PROVIDERS = Object.freeze([
    Object.freeze({
      id: 'container-3d031e2f9182af165859630af77aff88',
      script: 'https://pl31215709.profitableratecpmnetwork.com/3d031e2f9182af165859630af77aff88/invoke.js'
    }),
    Object.freeze({
      id: 'container-75aa7928ad9b146d0b2ae226da2283c3',
      script: 'https://pl31314997.profitableratecpmnetwork.com/75aa7928ad9b146d0b2ae226da2283c3/invoke.js'
    })
  ]);

  let reconcileQueued = false;

  function providerAlreadyMounted(provider) {
    return document.getElementById(provider.id)
      || document.querySelector(`script[data-nebulo-ad-provider="${provider.id}"]`);
  }

  function mountProvider(slot, provider) {
    if (!(slot instanceof Element) || providerAlreadyMounted(provider)) return false;

    const container = document.createElement('div');
    container.id = provider.id;

    const script = document.createElement('script');
    script.async = true;
    script.dataset.cfasync = 'false';
    script.dataset.nebuloAdProvider = provider.id;
    script.src = provider.script;

    slot.replaceWith(container, script);
    return true;
  }

  function reconcile() {
    reconcileQueued = false;
    const slots = Array.from(document.querySelectorAll('.nebulo-ad-slot'));

    slots.slice(PROVIDERS.length).forEach((slot) => slot.remove());

    for (const slot of slots.slice(0, PROVIDERS.length)) {
      const provider = PROVIDERS.find((candidate) => !providerAlreadyMounted(candidate));
      if (!provider) {
        slot.remove();
        continue;
      }
      mountProvider(slot, provider);
    }
  }

  function mount() {
    if (reconcileQueued) return;
    reconcileQueued = true;
    queueMicrotask(reconcile);
  }

  function remove(target) {
    if (!(target instanceof Element)) return;
    if (target.matches('.nebulo-ad-slot')) {
      target.remove();
      return;
    }
    const provider = PROVIDERS.find((candidate) => candidate.id === target.id);
    if (!provider) return;
    document.querySelector(`script[data-nebulo-ad-provider="${provider.id}"]`)?.remove();
    target.remove();
  }

  function start() {
    mount();
    new MutationObserver((records) => {
      if (records.some((record) => Array.from(record.addedNodes).some((node) =>
        node.nodeType === Node.ELEMENT_NODE
          && (node.matches?.('.nebulo-ad-slot') || node.querySelector?.('.nebulo-ad-slot'))
      ))) mount();
    }).observe(document.body, { childList: true, subtree: true });
  }

  window.NebuloAds = Object.freeze({ mount, remove });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
