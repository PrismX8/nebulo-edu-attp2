(() => {
  "use strict";

  const video = document.getElementById("video");
  const shell = document.getElementById("player-shell");
  const poster = document.getElementById("poster");
  const loading = document.getElementById("loading");
  const loadingText = document.getElementById("loading-text");
  const errorPanel = document.getElementById("player-error");
  const errorMessage = document.getElementById("error-message");
  const centerPlay = document.getElementById("center-play");
  const playButton = document.getElementById("play-button");
  const muteButton = document.getElementById("mute-button");
  const volume = document.getElementById("volume");
  const timeline = document.getElementById("timeline");
  const time = document.getElementById("time");
  const quality = document.getElementById("quality");
  const title = document.getElementById("video-title");
  const author = document.getElementById("video-author");
  const views = document.getElementById("video-views");
  const likes = document.getElementById("video-likes");
  const engineState = document.getElementById("engine-state");
  const addressForm = document.getElementById("video-address");
  const addressInput = document.getElementById("video-url");
  const commentsCount = document.getElementById("comments-count");
  const commentsLoading = document.getElementById("comments-loading");
  const commentsMessage = document.getElementById("comments-message");
  const commentsList = document.getElementById("comments-list");
  const commentsMore = document.getElementById("comments-more");

  const initialParams = new URLSearchParams(location.search);
  const requestedReturn = initialParams.get("return") || "";
  const returnTarget = requestedReturn.startsWith("/ag/") ? requestedReturn : "";

  let dashPlayer = null;
  let videoId = "";
  let controlsTimer = 0;
  let fallbackAttempted = false;
  let dashRefreshAttempted = false;
  let playbackRequested = false;
  let streamChanging = false;
  let playbackRecoveryTimer = 0;
  let lastPlaybackTime = 0;
  let fixedQualityHeight = 0;
  let isScrubbing = false;
  let commentsGeneration = 0;
  let commentsCursor = "";
  let commentsQueue = [];
  let commentsRequestActive = false;
  let renderedCommentIds = new Set();

  function parseVideoId(value) {
    const input = String(value || "").trim();
    if (/^[A-Za-z0-9_-]{11}$/.test(input)) return input;
    try {
      const url = new URL(input, location.href);
      if (url.hostname === "youtu.be") return url.pathname.split("/").filter(Boolean)[0] || "";
      if (url.hostname.endsWith("youtube.com")) {
        if (url.pathname === "/watch") return url.searchParams.get("v") || "";
        const parts = url.pathname.split("/").filter(Boolean);
        if (["shorts", "embed", "live"].includes(parts[0])) return parts[1] || "";
      }
    } catch {}
    return "";
  }

  function formatTime(value) {
    const seconds = Math.max(0, Number(value) || 0);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainder = Math.floor(seconds % 60);
    return hours
      ? `${hours}:${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`
      : `${minutes}:${String(remainder).padStart(2, "0")}`;
  }

  function formatViews(value) {
    const count = Number(value) || 0;
    return count ? `${new Intl.NumberFormat().format(count)} views` : "";
  }

  function formatCount(value) {
    const count = Number(value) || 0;
    return count ? new Intl.NumberFormat(undefined, { notation: "compact", maximumFractionDigits: 1 }).format(count) : "0";
  }

  function setLoading(active, message = "Preparing video") {
    loading.hidden = !active;
    loadingText.textContent = message;
    shell.classList.toggle("is-loading", active);
  }

  function showError(message) {
    setLoading(false);
    errorMessage.textContent = message || "Reload the stream and try again.";
    errorPanel.hidden = false;
  }

  function hideError() {
    errorPanel.hidden = true;
  }

  function resetComments() {
    commentsGeneration += 1;
    commentsCursor = "";
    commentsQueue = [];
    commentsRequestActive = false;
    renderedCommentIds = new Set();
    commentsList.replaceChildren();
    commentsCount.textContent = "";
    commentsMessage.hidden = true;
    commentsMessage.textContent = "";
    commentsLoading.hidden = false;
    commentsMore.hidden = true;
    commentsMore.classList.remove("is-loading");
  }

  function createCommentItem(comment) {
    const item = document.createElement("li");
    item.className = "comment-item";

    const avatar = document.createElement(comment.avatar ? "img" : "span");
    avatar.className = "comment-avatar";
    if (comment.avatar) {
      avatar.src = comment.avatar;
      avatar.alt = "";
      avatar.loading = "lazy";
    } else {
      avatar.textContent = String(comment.author || "?").replace(/^@/, "").slice(0, 1).toUpperCase();
      avatar.setAttribute("aria-hidden", "true");
    }

    const body = document.createElement("div");
    body.className = "comment-body";
    const header = document.createElement("div");
    header.className = "comment-header";
    const authorName = document.createElement("strong");
    authorName.textContent = comment.author;
    if (comment.isCreator) authorName.classList.add("is-creator");
    header.append(authorName);
    if (comment.isVerified) {
      const verified = document.createElement("span");
      verified.className = "verified";
      verified.textContent = "✓";
      verified.title = "Verified";
      header.append(verified);
    }
    const published = document.createElement("span");
    published.textContent = comment.publishedTime;
    header.append(published);

    if (comment.isPinned) {
      const pinned = document.createElement("div");
      pinned.className = "pinned-label";
      pinned.textContent = "Pinned";
      body.append(pinned);
    }
    const content = document.createElement("p");
    content.textContent = comment.content;
    const meta = document.createElement("div");
    meta.className = "comment-meta";
    const commentLikes = document.createElement("span");
    commentLikes.textContent = `👍 ${comment.likeCount || "0"}`;
    meta.append(commentLikes);
    if (comment.replyCount && comment.replyCount !== "0") {
      const replies = document.createElement("span");
      replies.textContent = `${comment.replyCount} replies`;
      meta.append(replies);
    }

    body.append(header, content, meta);
    item.append(avatar, body);
    return item;
  }

  function setCommentsMore(available, loading = false) {
    commentsMore.hidden = !available;
    commentsMore.classList.toggle("is-loading", available && loading);
  }

  function appendCommentBatch(limit = 10) {
    const fragment = document.createDocumentFragment();
    let appended = 0;
    while (commentsQueue.length && appended < limit) {
      const comment = commentsQueue.shift();
      if (!comment?.id || renderedCommentIds.has(comment.id)) continue;
      renderedCommentIds.add(comment.id);
      fragment.append(createCommentItem(comment));
      appended += 1;
    }
    commentsList.append(fragment);
    setCommentsMore(Boolean(commentsQueue.length || commentsCursor));
  }

  async function requestCommentsPage(id, cursor = "") {
    const params = new URLSearchParams({ v: "3" });
    if (cursor) params.set("cursor", cursor);
    return fetchJson(`/api/youtube/comments/${encodeURIComponent(id)}?${params}`);
  }

  async function loadComments(id) {
    resetComments();
    const generation = commentsGeneration;
    try {
      const result = await requestCommentsPage(id);
      if (id !== videoId || generation !== commentsGeneration) return;
      const comments = Array.isArray(result.comments) ? result.comments : [];
      if (result.commentCountText) commentsCount.textContent = result.commentCountText;
      commentsLoading.hidden = true;
      if (!comments.length) {
        commentsMessage.textContent = "Comments are unavailable for this video.";
        commentsMessage.hidden = false;
        return;
      }
      commentsQueue.push(...comments);
      commentsCursor = String(result.cursor || "");
      appendCommentBatch();
    } catch (error) {
      if (id !== videoId || generation !== commentsGeneration) return;
      commentsLoading.hidden = true;
      commentsMessage.textContent = error.message || "Comments could not be loaded.";
      commentsMessage.hidden = false;
    }
  }

  async function loadMoreComments() {
    if (commentsRequestActive || (!commentsQueue.length && !commentsCursor)) return;
    if (commentsQueue.length) {
      appendCommentBatch();
      return;
    }

    const id = videoId;
    const generation = commentsGeneration;
    const cursor = commentsCursor;
    commentsRequestActive = true;
    setCommentsMore(true, true);
    try {
      const result = await requestCommentsPage(id, cursor);
      if (id !== videoId || generation !== commentsGeneration) return;
      commentsCursor = String(result.cursor || "");
      commentsQueue.push(...(Array.isArray(result.comments) ? result.comments : []));
      appendCommentBatch();
    } catch (error) {
      if (id !== videoId || generation !== commentsGeneration) return;
      commentsMessage.textContent = error.message || "More comments could not be loaded.";
      commentsMessage.hidden = false;
      commentsCursor = "";
      setCommentsMore(false);
    } finally {
      if (id === videoId && generation === commentsGeneration) {
        commentsRequestActive = false;
        setCommentsMore(Boolean(commentsQueue.length || commentsCursor));
      }
    }
  }

  async function fetchJson(url) {
    const response = await fetch(url, { headers: { Accept: "application/json" } });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(body.error || `Request failed (${response.status})`);
    return body;
  }

  function resetQualityMenu() {
    quality.replaceChildren(new Option("Auto", "auto"));
  }

  function populateQualityMenu() {
    if (!dashPlayer) return;
    const representations = dashPlayer.getRepresentationsByType("video") || [];
    const bestByHeight = new Map();
    representations.forEach((representation) => {
      const key = representation.height || representation.id;
      const current = bestByHeight.get(key);
      if (!current || (representation.bandwidth || 0) > (current.bandwidth || 0)) {
        bestByHeight.set(key, representation);
      }
    });
    resetQualityMenu();
    [...bestByHeight.values()]
      .sort((a, b) => (b.height || 0) - (a.height || 0))
      .forEach((representation) => {
        const label = representation.height ? `${representation.height}p` : `${Math.round((representation.bandwidth || 0) / 1000)} kbps`;
        const option = new Option(label, representation.id);
        option.dataset.height = String(representation.height || 0);
        quality.append(option);
      });
  }

  function restoreFixedQuality() {
    if (!dashPlayer || !fixedQualityHeight) return false;
    const option = [...quality.options].find((candidate) => Number(candidate.dataset.height) === fixedQualityHeight);
    if (!option) return false;
    quality.value = option.value;
    dashPlayer.updateSettings({ streaming: { abr: { autoSwitchBitrate: { video: false } } } });
    dashPlayer.setRepresentationForTypeById("video", option.value, true);
    engineState.textContent = `Fixed quality · ${option.textContent}`;
    return true;
  }

  function destroyDashPlayer() {
    if (dashPlayer) {
      try { dashPlayer.reset(); } catch {}
      dashPlayer = null;
    }
    video.removeAttribute("src");
    video.load();
  }

  function useProgressiveFallback(reason) {
    if (fallbackAttempted || !videoId) {
      showError(reason || "No compatible stream is available for this video.");
      return;
    }
    fallbackAttempted = true;
    streamChanging = true;
    destroyDashPlayer();
    resetQualityMenu();
    quality.disabled = true;
    engineState.textContent = "Compatibility playback · 360p";
    setLoading(true, "Switching playback mode");
    video.src = `/api/youtube/progressive/${encodeURIComponent(videoId)}`;
    video.load();
  }

  function initializeDash({ refresh = false, resumeAt = 0, resumePlayback = false } = {}) {
    if (!window.dashjs?.MediaPlayer) {
      useProgressiveFallback("The adaptive playback engine did not load.");
      return;
    }

    streamChanging = true;
    const player = window.dashjs.MediaPlayer().create();
    dashPlayer = player;
    player.updateSettings({
      streaming: {
        buffer: {
          initialBufferLevel: 1,
          bufferTimeAtTopQuality: 12,
          bufferTimeAtTopQualityLongForm: 20,
          bufferToKeep: 8,
          enableSeekDecorrelationFix: true,
          fastSwitchEnabled: true,
        },
        abr: {
          autoSwitchBitrate: { audio: true, video: true },
          limitBitrateByPortal: false,
        },
        retryAttempts: { MPD: 2, MediaSegment: 3, InitializationSegment: 3 },
      },
    });

    const events = window.dashjs.MediaPlayer.events;
    player.on(events.STREAM_INITIALIZED, () => {
      if (dashPlayer !== player) return;
      populateQualityMenu();
      quality.disabled = false;
      if (!restoreFixedQuality()) engineState.textContent = "Adaptive playback · Auto";
      streamChanging = false;
      setLoading(false);
      if (resumePlayback) video.play().catch(() => {});
    });
    player.on(events.REPRESENTATION_SWITCH, (event) => {
      if (dashPlayer !== player) return;
      const height = event?.currentRepresentation?.height;
      if (height && quality.value === "auto") engineState.textContent = `Adaptive playback · ${height}p`;
    });
    player.on(events.ERROR, (event) => {
      if (dashPlayer !== player) return;
      const errorCode = Number(event?.error?.code);
      const manifestFailed = [10, 11, 25].includes(errorCode);
      if (!manifestFailed) return;
      if (!dashRefreshAttempted) {
        dashRefreshAttempted = true;
        const previousTime = Math.max(video.currentTime || 0, lastPlaybackTime);
        const wasPlaying = !video.paused;
        setLoading(true, "Refreshing stream");
        destroyDashPlayer();
        initializeDash({ refresh: true, resumeAt: previousTime, resumePlayback: wasPlaying });
        return;
      }
      useProgressiveFallback("Adaptive playback failed.");
    });
    const manifestUrl = `/api/youtube/manifest/${encodeURIComponent(videoId)}.mpd${refresh ? `?refresh=${Date.now()}` : ""}`;
    player.initialize(video, manifestUrl, false, resumeAt > 0 && Number.isFinite(resumeAt) ? resumeAt : undefined);
  }

  async function loadVideo(id) {
    if (!/^[A-Za-z0-9_-]{11}$/.test(id)) {
      showError("Paste a valid YouTube video URL above.");
      title.textContent = "No video selected";
      return;
    }

    videoId = id;
    fallbackAttempted = false;
    dashRefreshAttempted = false;
    playbackRequested = false;
    streamChanging = true;
    lastPlaybackTime = 0;
    clearTimeout(playbackRecoveryTimer);
    hideError();
    setLoading(true, "Loading video details");
    shell.classList.remove("has-started", "is-playing");
    quality.disabled = true;
    resetQualityMenu();
    destroyDashPlayer();
    const playerParams = new URLSearchParams({ v: id });
    if (returnTarget) playerParams.set("return", returnTarget);
    history.replaceState(null, "", `/youtube-player?${playerParams}`);
    addressInput.value = `https://www.youtube.com/watch?v=${id}`;
    likes.textContent = "--";
    loadComments(id);

    try {
      const info = await fetchJson(`/api/youtube/info/${encodeURIComponent(id)}`);
      document.title = `${info.title} | Nebulo`;
      title.textContent = info.title;
      author.textContent = info.author;
      views.textContent = formatViews(info.viewCount);
      likes.textContent = formatCount(info.likeCount);
      likes.title = `${new Intl.NumberFormat().format(Number(info.likeCount) || 0)} likes`;
      commentsCount.textContent = info.commentCountText || "";
      poster.style.backgroundImage = `url("${info.thumbnail}")`;
      video.poster = info.thumbnail;
      initializeDash();
    } catch (error) {
      streamChanging = false;
      showError(error.message);
      title.textContent = "Video unavailable";
      author.textContent = "YouTube";
      views.textContent = "";
      likes.textContent = "--";
    }
  }

  async function togglePlayback() {
    hideError();
    try {
      if (video.paused) {
        playbackRequested = true;
        await video.play();
      } else {
        playbackRequested = false;
        video.pause();
      }
    } catch (error) {
      showError(error.message || "Playback was blocked by the browser.");
    }
  }

  function recoverUnexpectedPause() {
    clearTimeout(playbackRecoveryTimer);
    if (!playbackRequested || streamChanging || video.ended || document.hidden) return;
    const resumeAt = Math.max(video.currentTime || 0, lastPlaybackTime);
    playbackRecoveryTimer = setTimeout(() => {
      if (!playbackRequested || streamChanging || video.ended || document.hidden || !video.paused) return;
      if (video.currentTime + 1 < resumeAt) video.currentTime = resumeAt;
      video.play().catch(() => {});
    }, 180);
  }

  function updatePlaybackState() {
    const playing = !video.paused && !video.ended;
    shell.classList.toggle("is-playing", playing);
    if (playing) shell.classList.add("has-started");
    const icon = playing ? "❚❚" : "▶";
    playButton.textContent = icon;
    playButton.setAttribute("aria-label", playing ? "Pause" : "Play");
    centerPlay.textContent = icon;
  }

  function updateTimeline() {
    const currentTime = video.currentTime || 0;
    if (playbackRequested && !streamChanging && !isScrubbing) {
      if (currentTime + 2 < lastPlaybackTime) {
        video.currentTime = lastPlaybackTime;
        return;
      }
      lastPlaybackTime = Math.max(lastPlaybackTime, currentTime);
    }
    if (!isScrubbing) {
      timeline.max = String(Number.isFinite(video.duration) ? video.duration : 0);
      timeline.value = String(currentTime);
    }
    time.textContent = `${formatTime(currentTime)} / ${formatTime(video.duration)}`;
  }

  function showControls() {
    shell.classList.remove("controls-hidden");
    clearTimeout(controlsTimer);
    if (!video.paused) {
      controlsTimer = setTimeout(() => shell.classList.add("controls-hidden"), 2200);
    }
  }

  centerPlay.addEventListener("click", togglePlayback);
  playButton.addEventListener("click", togglePlayback);
  shell.addEventListener("click", (event) => {
    if (event.target.closest("button, input, select, .controls")) return;
    togglePlayback();
  });
  video.addEventListener("play", () => {
    playbackRequested = true;
    updatePlaybackState();
  });
  video.addEventListener("pause", () => {
    updatePlaybackState();
    recoverUnexpectedPause();
  });
  video.addEventListener("ended", () => {
    playbackRequested = false;
    updatePlaybackState();
  });
  video.addEventListener("timeupdate", updateTimeline);
  video.addEventListener("durationchange", updateTimeline);
  video.addEventListener("waiting", () => setLoading(true, "Buffering"));
  video.addEventListener("playing", () => setLoading(false));
  video.addEventListener("canplay", () => {
    if (video.src.includes("/api/youtube/progressive/")) {
      streamChanging = false;
      if (playbackRequested && video.paused) video.play().catch(() => {});
    }
    setLoading(false);
  });
  video.addEventListener("error", () => {
    if (video.src.includes("/api/youtube/progressive/")) {
      showError("The compatibility stream could not be loaded.");
    }
  });

  timeline.addEventListener("input", () => {
    isScrubbing = true;
    time.textContent = `${formatTime(timeline.value)} / ${formatTime(video.duration)}`;
  });
  timeline.addEventListener("change", () => {
    const targetTime = Number(timeline.value) || 0;
    lastPlaybackTime = targetTime;
    isScrubbing = false;
    setLoading(true, "Seeking");
    if (dashPlayer) {
      dashPlayer.seek(targetTime);
    } else if (typeof video.fastSeek === "function") {
      video.fastSeek(targetTime);
    } else {
      video.currentTime = targetTime;
    }
    if (playbackRequested && video.paused) video.play().catch(() => {});
  });

  volume.addEventListener("input", () => {
    video.volume = Number(volume.value);
    video.muted = video.volume === 0;
  });
  muteButton.addEventListener("click", () => {
    video.muted = !video.muted;
  });
  video.addEventListener("volumechange", () => {
    volume.value = video.muted ? "0" : String(video.volume);
    muteButton.textContent = video.muted || video.volume === 0 ? "🔇" : video.volume < 0.5 ? "🔉" : "🔊";
  });

  quality.addEventListener("change", () => {
    if (!dashPlayer) return;
    if (quality.value === "auto") {
      fixedQualityHeight = 0;
      dashPlayer.updateSettings({ streaming: { abr: { autoSwitchBitrate: { video: true } } } });
      engineState.textContent = "Adaptive playback · Auto";
      return;
    }
    dashPlayer.updateSettings({ streaming: { abr: { autoSwitchBitrate: { video: false } } } });
    dashPlayer.setRepresentationForTypeById("video", quality.value, true);
    const selected = quality.selectedOptions[0];
    fixedQualityHeight = Number(selected?.dataset.height) || 0;
    engineState.textContent = `Fixed quality · ${selected?.textContent || "Selected"}`;
  });

  document.getElementById("fullscreen-button").addEventListener("click", () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else shell.requestFullscreen?.();
  });
  document.getElementById("retry-button").addEventListener("click", () => loadVideo(videoId));
  document.getElementById("back-button").addEventListener("click", () => {
    if (returnTarget) location.assign(returnTarget);
    else if (history.length > 1) history.back();
    else location.href = "/tools";
  });
  addressForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const id = parseVideoId(addressInput.value);
    if (id) loadVideo(id);
    else showError("That does not look like a YouTube video link.");
  });

  shell.addEventListener("mousemove", showControls);
  shell.addEventListener("touchstart", showControls, { passive: true });
  shell.addEventListener("mouseleave", () => {
    if (!video.paused) shell.classList.add("controls-hidden");
  });

  document.addEventListener("keydown", (event) => {
    if (/INPUT|SELECT|TEXTAREA/.test(document.activeElement?.tagName || "")) return;
    if (["k", " "].includes(event.key.toLowerCase())) {
      event.preventDefault();
      togglePlayback();
    } else if (event.key.toLowerCase() === "m") {
      video.muted = !video.muted;
    } else if (event.key.toLowerCase() === "f") {
      if (document.fullscreenElement) document.exitFullscreen();
      else shell.requestFullscreen?.();
    } else if (event.key === "ArrowRight") {
      const targetTime = Math.min(video.duration || Infinity, video.currentTime + 5);
      lastPlaybackTime = targetTime;
      video.currentTime = targetTime;
    } else if (event.key === "ArrowLeft") {
      const targetTime = Math.max(0, video.currentTime - 5);
      lastPlaybackTime = targetTime;
      video.currentTime = targetTime;
    }
  });

  const commentsObserver = new IntersectionObserver((entries) => {
    if (entries.some((entry) => entry.isIntersecting)) loadMoreComments();
  }, { rootMargin: "360px 0px" });
  commentsObserver.observe(commentsMore);

  const initialId = parseVideoId(initialParams.get("v"));
  loadVideo(initialId);
})();
