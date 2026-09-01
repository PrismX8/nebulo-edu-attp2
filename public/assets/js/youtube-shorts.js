(() => {
  "use strict";

  const VIDEO_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;
  const MAX_CARDS = 7;
  const AHEAD_TARGET = 5;
  const PLAYER_WINDOW = 3;
  const STARTUP_TIMEOUT_MS = 5000;

  const feed = document.getElementById("shorts-feed");
  const template = document.getElementById("short-template");
  const announcer = document.getElementById("feed-announcer");
  const backButton = document.getElementById("back-button");
  const prefersReducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const params = new URLSearchParams(location.search);
  const initialId = String(params.get("v") || "").trim();
  const requestedReturn = String(params.get("return") || "");
  const returnTarget = requestedReturn.startsWith("/ag/") ? requestedReturn : "";

  const records = [];
  const queuedIds = [];
  const seenIds = new Set();
  let activeRecord = null;
  let muted = true;
  let feedRequestActive = false;
  let feedFailures = 0;
  let feedExhausted = false;
  let recycling = false;

  function fetchJson(url) {
    return fetch(url, { headers: { Accept: "application/json" } }).then(async (response) => {
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.error || `Request failed (${response.status})`);
      return body;
    });
  }

  function formatTime(value) {
    const seconds = Math.max(0, Number(value) || 0);
    const minutes = Math.floor(seconds / 60);
    const remainder = Math.floor(seconds % 60);
    return `${minutes}:${String(remainder).padStart(2, "0")}`;
  }

  function setLoading(record, active, copy = "Preparing video") {
    record.loading.hidden = !active;
    record.loadingCopy.textContent = copy;
  }

  function showError(record, message) {
    clearTimeout(record.startupTimer);
    record.startupTimer = 0;
    setLoading(record, false);
    record.errorCopy.textContent = message || "The stream could not be loaded.";
    record.error.hidden = false;
    record.element.classList.remove("is-playing");
    record.element.classList.add("is-paused");
  }

  function hideError(record) {
    record.error.hidden = true;
  }

  function setPlaybackState(record) {
    const playing = !record.video.paused && !record.video.ended;
    record.element.classList.toggle("is-playing", playing);
    record.element.classList.toggle("is-paused", !playing);
    record.mediaToggle.setAttribute("aria-label", playing ? "Pause video" : "Play video");
  }

  function updateMuteControls() {
    for (const record of records) {
      record.video.muted = muted;
      record.muteButton.classList.toggle("is-unmuted", !muted);
      record.muteButton.setAttribute("aria-label", muted ? "Unmute video" : "Mute video");
      record.muteButton.title = muted ? "Unmute (M)" : "Mute (M)";
    }
  }

  function setMetadata(record, info) {
    record.info = info;
    record.title.textContent = info.title || "YouTube Short";
    record.author.textContent = info.author || "YouTube";
    record.duration.textContent = formatTime(info.duration);
    if (info.thumbnail) record.poster.src = info.thumbnail;
    record.element.setAttribute("aria-label", `${info.title || "YouTube Short"} by ${info.author || "YouTube"}`);
    if (record === activeRecord) document.title = `${info.title || "Shorts"} | Nebulo`;
  }

  function loadMetadata(record) {
    if (record.info || record.infoPromise) return record.infoPromise;
    record.infoPromise = fetchJson(`/api/youtube/info/${encodeURIComponent(record.id)}?compact=1`)
      .then((info) => {
        setMetadata(record, info);
        return info;
      })
      .catch((error) => {
        record.title.textContent = "YouTube Short";
        record.author.textContent = "YouTube";
        if (record === activeRecord && !record.player) showError(record, error.message);
        return null;
      })
      .finally(() => {
        record.infoPromise = null;
      });
    return record.infoPromise;
  }

  function destroyPlayer(record) {
    clearTimeout(record.startupTimer);
    record.startupTimer = 0;
    record.initToken += 1;
    if (record.player) {
      try { record.player.reset(); } catch {}
      record.player = null;
    }
    record.ready = false;
    record.video.pause();
    record.video.removeAttribute("src");
    record.video.load();
    record.element.classList.remove("has-started", "is-playing");
    record.element.classList.add("is-paused");
    setLoading(record, false);
  }

  function tryPlay(record) {
    if (record !== activeRecord || !record.player) return;
    record.video.muted = muted;
    record.video.play().catch(() => {
      if (!muted) {
        muted = true;
        updateMuteControls();
        record.video.play().catch(() => setPlaybackState(record));
      } else {
        setPlaybackState(record);
      }
    });
  }

  function failPlayer(record, message) {
    destroyPlayer(record);
    showError(record, message);
  }

  function retryOrFailPlayer(record, message) {
    if (record.retryCount < 1) {
      record.retryCount += 1;
      destroyPlayer(record);
      initializePlayer(record, true, "Retrying video stream");
      return;
    }
    failPlayer(record, message);
  }

  function initializePlayer(record, refresh = false, loadingMessage = "") {
    if (record.player) return;
    if (!window.dashjs?.MediaPlayer) {
      showError(record, "The playback engine did not load.");
      return;
    }

    hideError(record);
    setLoading(record, true, loadingMessage || (record === activeRecord ? "Preparing video" : "Loading next video"));
    record.video.muted = muted;
    const token = ++record.initToken;
    const player = window.dashjs.MediaPlayer().create();
    record.player = player;
    player.updateSettings({
      streaming: {
        buffer: {
          initialBufferLevel: record === activeRecord ? 1.5 : 2.5,
          bufferTimeAtTopQuality: 8,
          bufferTimeAtTopQualityLongForm: 8,
          bufferToKeep: 5,
          fastSwitchEnabled: true,
        },
        abr: {
          autoSwitchBitrate: { audio: true, video: true },
          limitBitrateByPortal: true,
        },
        retryAttempts: { MPD: 2, MediaSegment: 3, InitializationSegment: 3 },
      },
    });

    const events = window.dashjs.MediaPlayer.events;
    player.on(events.STREAM_INITIALIZED, () => {
      if (record.player !== player || record.initToken !== token) return;
      clearTimeout(record.startupTimer);
      record.startupTimer = 0;
      record.ready = true;
      setLoading(record, false);
      if (record === activeRecord) tryPlay(record);
    });
    player.on(events.ERROR, (event) => {
      if (record.player !== player || record.initToken !== token) return;
      const code = Number(event?.error?.code);
      if (![10, 11, 25].includes(code)) return;
      retryOrFailPlayer(record, "Adaptive playback could not start. Try the stream again.");
    });

    const suffix = refresh ? `?refresh=${Date.now()}` : "";
    player.initialize(record.video, `/api/youtube/manifest/${encodeURIComponent(record.id)}.mpd${suffix}`, false);
    record.startupTimer = setTimeout(() => {
      if (record.player !== player || record.initToken !== token || record.ready) return;
      retryOrFailPlayer(record, "The video took too long to start. Try the stream again.");
    }, STARTUP_TIMEOUT_MS);
  }

  function updatePositions() {
    records.forEach((record, index) => {
      record.position.textContent = String(index + 1).padStart(2, "0");
    });
  }

  function updateHistory(record) {
    const nextParams = new URLSearchParams({ v: record.id });
    if (returnTarget) nextParams.set("return", returnTarget);
    history.replaceState(null, "", `/youtube-shorts?${nextParams}`);
  }

  function syncPlayerWindow() {
    if (!activeRecord) return;
    const activeIndex = records.indexOf(activeRecord);
    const keep = new Set(records.slice(activeIndex, activeIndex + PLAYER_WINDOW));
    for (const record of records) {
      if (keep.has(record)) {
        loadMetadata(record);
        initializePlayer(record);
      } else if (record.player) {
        destroyPlayer(record);
      }
      if (record !== activeRecord) record.video.pause();
    }
    updateMuteControls();
  }

  function setActive(record) {
    if (!record || record === activeRecord || recycling) return;
    if (activeRecord) activeRecord.video.pause();
    activeRecord = record;
    const index = records.indexOf(record);
    records.forEach((candidate) => candidate.element.classList.toggle("is-active", candidate === record));
    updateHistory(record);
    syncPlayerWindow();
    tryPlay(record);
    if (record.info) document.title = `${record.info.title || "Shorts"} | Nebulo`;
    announcer.textContent = `Playing short ${index + 1}: ${record.title.textContent}`;
    ensureAhead();
  }

  const observer = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting && entry.intersectionRatio >= 0.58)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visible) setActive(visible.target.__shortRecord);
  }, { root: feed, threshold: [0.25, 0.58, 0.8] });

  function createRecord(id) {
    const fragment = template.content.cloneNode(true);
    const element = fragment.querySelector(".short-panel");
    const record = {
      id,
      element,
      video: element.querySelector(".short-video"),
      poster: element.querySelector(".short-poster"),
      title: element.querySelector(".short-title"),
      author: element.querySelector(".short-author"),
      duration: element.querySelector(".duration"),
      currentTime: element.querySelector(".current-time"),
      progress: element.querySelector(".short-progress"),
      loading: element.querySelector(".short-loading"),
      loadingCopy: element.querySelector(".loading-copy"),
      error: element.querySelector(".short-error"),
      errorCopy: element.querySelector(".error-copy"),
      retryButton: element.querySelector(".retry-button"),
      muteButton: element.querySelector(".mute-button"),
      mediaToggle: element.querySelector(".media-toggle"),
      position: element.querySelector(".short-position"),
      player: null,
      ready: false,
      info: null,
      infoPromise: null,
      retryCount: 0,
      initToken: 0,
      startupTimer: 0,
      scrubbing: false,
    };

    element.dataset.videoId = id;
    element.__shortRecord = record;
    record.poster.src = `/api/youtube/thumbnail/${encodeURIComponent(id)}`;
    record.poster.addEventListener("error", () => record.poster.removeAttribute("src"), { once: true });
    record.video.addEventListener("playing", () => {
      element.classList.add("has-started");
      setLoading(record, false);
      setPlaybackState(record);
    });
    record.video.addEventListener("pause", () => setPlaybackState(record));
    record.video.addEventListener("waiting", () => {
      if (record === activeRecord && !record.video.paused) setLoading(record, true, "Buffering");
    });
    record.video.addEventListener("canplay", () => {
      if (record.ready) setLoading(record, false);
    });
    record.video.addEventListener("error", () => {
      if (record.player) showError(record, "This video stream is currently unavailable.");
    });
    record.video.addEventListener("timeupdate", () => {
      if (!record.scrubbing) {
        const duration = Number(record.video.duration) || Number(record.info?.duration) || 0;
        record.progress.value = duration ? String((record.video.currentTime / duration) * 100) : "0";
        record.currentTime.textContent = formatTime(record.video.currentTime);
        if (duration) record.duration.textContent = formatTime(duration);
      }
    });
    record.video.addEventListener("ended", () => {
      const index = records.indexOf(record);
      const next = records[index + 1];
      if (record === activeRecord && next) {
        next.element.scrollIntoView({ behavior: prefersReducedMotion.matches ? "auto" : "smooth", block: "start" });
      }
    });

    record.mediaToggle.addEventListener("click", () => togglePlayback(record));
    record.muteButton.addEventListener("click", () => toggleMute());
    record.retryButton.addEventListener("click", () => {
      record.retryCount = 0;
      destroyPlayer(record);
      hideError(record);
      initializePlayer(record, true);
      if (record === activeRecord) tryPlay(record);
    });
    element.addEventListener("click", (event) => {
      if (event.target.closest("button, input") || record !== activeRecord) return;
      togglePlayback(record);
    });
    record.progress.addEventListener("pointerdown", () => { record.scrubbing = true; });
    record.progress.addEventListener("input", () => {
      const duration = Number(record.video.duration) || 0;
      if (!duration) return;
      const nextTime = duration * (Number(record.progress.value) / 100);
      record.currentTime.textContent = formatTime(nextTime);
      record.video.currentTime = nextTime;
    });
    record.progress.addEventListener("change", () => { record.scrubbing = false; });
    record.progress.addEventListener("pointerup", () => { record.scrubbing = false; });

    feed.append(fragment);
    records.push(record);
    observer.observe(element);
    updatePositions();
    return record;
  }

  function fillCards() {
    while (queuedIds.length && records.length < MAX_CARDS) createRecord(queuedIds.shift());
    syncPlayerWindow();
  }

  function recycleBehind() {
    const activeIndex = records.indexOf(activeRecord);
    if (activeIndex < 3 || records.length < MAX_CARDS) return;
    const removeCount = activeIndex - 1;
    const previousScroll = feed.scrollTop;
    const panelHeight = feed.clientHeight;
    recycling = true;
    for (let index = 0; index < removeCount; index += 1) {
      const record = records.shift();
      observer.unobserve(record.element);
      destroyPlayer(record);
      record.element.remove();
    }
    updatePositions();
    requestAnimationFrame(() => {
      feed.scrollTop = Math.max(0, previousScroll - panelHeight * removeCount);
      recycling = false;
    });
  }

  async function requestMoreIds(anchorId) {
    if (feedRequestActive || feedExhausted || !VIDEO_ID_PATTERN.test(anchorId)) return;
    feedRequestActive = true;
    try {
      const result = await fetchJson(`/api/youtube/shorts/${encodeURIComponent(anchorId)}`);
      const incoming = Array.isArray(result.ids) ? result.ids : [];
      let added = 0;
      for (const value of incoming) {
        const id = String(value || "");
        if (!VIDEO_ID_PATTERN.test(id) || seenIds.has(id)) continue;
        seenIds.add(id);
        queuedIds.push(id);
        added += 1;
      }
      feedFailures = 0;
      feedExhausted = added === 0;
      fillCards();
    } catch {
      feedFailures += 1;
      feedExhausted = feedFailures >= 2;
    } finally {
      feedRequestActive = false;
    }
  }

  function ensureAhead() {
    if (!activeRecord) return;
    recycleBehind();
    fillCards();
    const activeIndex = records.indexOf(activeRecord);
    const ahead = records.length - activeIndex - 1;
    if (ahead < AHEAD_TARGET && !feedRequestActive && !feedExhausted) {
      const anchor = queuedIds.at(-1) || records.at(-1)?.id || activeRecord.id;
      requestMoreIds(anchor);
    }
  }

  function togglePlayback(record = activeRecord) {
    if (!record || record !== activeRecord) return;
    hideError(record);
    if (!record.player) initializePlayer(record);
    if (record.video.paused) tryPlay(record);
    else record.video.pause();
  }

  function toggleMute() {
    muted = !muted;
    updateMuteControls();
    if (activeRecord && !activeRecord.video.paused) activeRecord.video.play().catch(() => {});
  }

  function moveBy(direction) {
    feed.scrollBy({
      top: feed.clientHeight * direction,
      behavior: prefersReducedMotion.matches ? "auto" : "smooth",
    });
  }

  function showInvalidState() {
    const panel = document.createElement("section");
    panel.className = "short-panel empty-panel";
    panel.innerHTML = "<div><h1>No Short selected</h1><p>Open a YouTube Short from Nebulo to start the vertical feed.</p><button class=\"retry-button\" type=\"button\">Go back</button></div>";
    panel.querySelector("button").addEventListener("click", navigateBack);
    feed.append(panel);
  }

  function navigateBack() {
    if (returnTarget) {
      location.assign(returnTarget);
      return;
    }
    if (history.length > 1) history.back();
    else location.assign("/search.html");
  }

  backButton.addEventListener("click", navigateBack);
  document.addEventListener("keydown", (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLButtonElement) return;
    if (["ArrowDown", "PageDown"].includes(event.key)) {
      event.preventDefault();
      moveBy(1);
    } else if (["ArrowUp", "PageUp"].includes(event.key)) {
      event.preventDefault();
      moveBy(-1);
    } else if (event.key.toLowerCase() === "m") {
      event.preventDefault();
      toggleMute();
    } else if (event.key === " " || event.key.toLowerCase() === "k") {
      event.preventDefault();
      togglePlayback();
    }
  });

  addEventListener("pagehide", () => records.forEach(destroyPlayer));

  if (!VIDEO_ID_PATTERN.test(initialId)) {
    showInvalidState();
    return;
  }

  seenIds.add(initialId);
  activeRecord = createRecord(initialId);
  activeRecord.element.classList.add("is-active");
  updateHistory(activeRecord);
  syncPlayerWindow();
  tryPlay(activeRecord);
  requestMoreIds(initialId);
})();
