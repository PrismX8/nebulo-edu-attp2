(() => {
  const DEFAULT_TEXTS = [
    "What should I put here..",
    "Logan is a Chud",
    "Jake is a c@ck",
    "Loading math",
    "Took me too long to think of these",
    "did you try the blooket bot??",
    "Education site",
    "Nebulo is better",
    "jake is a chud also",
    "Global chat is so weird today 😭"
  ];

  if (!Array.isArray(window.NEBULO_LOADING_TEXTS)) {
    window.NEBULO_LOADING_TEXTS = DEFAULT_TEXTS.slice();
  }

  function pickRandomIndex(length, previousIndex) {
    if (length <= 1) return 0;
    let index = Math.floor(Math.random() * length);
    if (index === previousIndex) {
      index = (index + 1 + Math.floor(Math.random() * (length - 1))) % length;
    }
    return index;
  }

  window.attachLoadingTextRotator = function attachLoadingTextRotator(
    element,
    { intervalMs = 3000, fadeMs = 250 } = {}
  ) {
    if (!element) return () => {};

    let previousIndex = -1;
    let active = true;

    const updateOnce = () => {
      const texts = window.NEBULO_LOADING_TEXTS;
      if (!active || !Array.isArray(texts) || texts.length === 0) return;

      element.classList.add("fade-out");
      setTimeout(() => {
        if (!active) return;
        const index = pickRandomIndex(texts.length, previousIndex);
        previousIndex = index;
        element.textContent = texts[index];
        element.classList.remove("fade-out");
      }, fadeMs);
    };

    updateOnce();
    const timer = setInterval(updateOnce, intervalMs);

    return () => {
      active = false;
      clearInterval(timer);
    };
  };
})();
