(function () {
  "use strict";

  if (window.NebuloTikTokClient) return;

  const state = {
    items: [],
    ids: new Set(),
    loading: false,
    cursor: 0,
    observer: null,
    mountTimer: 0,
    activePost: null,
    visibility: new Map(),
    soundEnabled: false,
    consecutiveFailures: 0,
    retryTimer: 0,
    metadataPromise: null,
    liked: new Set(),
    saved: new Set(),
    startedAt: Date.now(),
  };

  const MAX_AUTO_RETRIES = 3;
  const PREFETCH_DISTANCE = 3;

  const proxify = (value) => {
    if (!value) return "";
    if (typeof window.__nebuloTikTokProxify === "function") {
      return window.__nebuloTikTokProxify(String(value));
    }
    const raw = String(value);
    if (/^(?:data|blob|javascript):/i.test(raw) || /^\/ag\/(?:https?)\//i.test(raw)) return raw;
    try {
      const target = new URL(raw, "https://www.tiktok.com/");
      if (!/^https?:$/.test(target.protocol)) return raw;
      return `${location.origin}/ag/${target.protocol.slice(0, -1)}/${target.host}${target.pathname}${target.search}${target.hash}`;
    } catch {
      return raw;
    }
  };

  function formatCount(value) {
    const count = Number(value || 0);
    if (count >= 1000000) return `${(count / 1000000).toFixed(count >= 10000000 ? 0 : 1).replace(".0", "")}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(count >= 100000 ? 0 : 1).replace(".0", "")}K`;
    return String(count);
  }

  function normalizeItems(payload) {
    const source = payload && (payload.itemList || payload.item_list);
    if (!Array.isArray(source)) return [];
    return source
      .map((entry) => entry && (entry.item || entry.aweme_info || entry))
      .filter((item) => item && item.video);
  }

  function getItemId(item) {
    return String(item?.id || item?.aweme_id || item?.itemId || "");
  }

  function getAuthor(item) {
    return item?.author || item?.authorInfo || {};
  }

  function getHandle(item) {
    const author = getAuthor(item);
    return author.uniqueId || author.unique_id || author.nickname || "creator";
  }

  function getStats(item) {
    return item?.stats || item?.statistics || {};
  }

  function getVideoUrl(item) {
    const video = item?.video || {};
    const struct = video.PlayAddrStruct || video.playAddrStruct || video.play_addr_struct;
    const urls = struct && (struct.UrlList || struct.urlList || struct.url_list);
    if (Array.isArray(urls) && urls.length) return urls[urls.length - 1];
    return video.playAddr || video.play_addr || "";
  }

  function getPoster(item) {
    const video = item?.video || {};
    return video.cover || video.originCover || video.origin_cover || "";
  }

  function getAvatar(item) {
    const author = getAuthor(item);
    const value = author.avatarThumb || author.avatarMedium || author.avatar_thumb || author.avatar_medium || "";
    if (typeof value === "string") return value;
    return value?.url_list?.[0] || value?.urlList?.[0] || "";
  }

  function nativeFeedIsWorking() {
    return Array.from(document.querySelectorAll("video")).some((video) => {
      if (video.closest("#nebulo-tiktok-feed")) return false;
      const rect = video.getBoundingClientRect();
      const style = getComputedStyle(video);
      const visible = style.display !== "none"
        && style.visibility !== "hidden"
        && Number(style.opacity || 1) > 0
        && rect.width >= 180
        && rect.height >= 260;
      return visible && (video.readyState >= 2 || video.currentTime > 0);
    });
  }

  function nativeVideoIsStarting() {
    if (Date.now() - state.startedAt > 8000) return false;
    return Array.from(document.querySelectorAll("video")).some((video) => {
      if (video.closest("#nebulo-tiktok-feed")) return false;
      const rect = video.getBoundingClientRect();
      return rect.width >= 180 && rect.height >= 260;
    });
  }

  function go(path) {
    const raw = String(path || "/");
    const target = /^https?:\/\//i.test(raw)
      ? raw
      : `https://www.tiktok.com${raw.startsWith("/") ? raw : `/${raw}`}`;
    location.href = proxify(target);
  }

  function postUrl(item) {
    return `https://www.tiktok.com/@${encodeURIComponent(getHandle(item))}/video/${encodeURIComponent(getItemId(item))}`;
  }

  function toast(message) {
    const element = document.querySelector(".nt-toast");
    if (!element) return;
    element.textContent = message;
    element.classList.add("show");
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => element.classList.remove("show"), 1800);
  }

  function icon(name) {
    const icons = {
      play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.2v13.6L19 12 8 5.2Z"/></svg>',
      heart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.4 4.2 13A5.2 5.2 0 0 1 12 6.2 5.2 5.2 0 0 1 19.8 13L12 20.4Z"/></svg>',
      comment: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4.8h16v11.4H9.5L5.2 20v-3.8H4V4.8Z"/></svg>',
      bookmark: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 3.5h11v17L12 17.1l-5.5 3.4v-17Z"/></svg>',
      share: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m13.2 4.2 6.6 6.3-6.6 6.2v-3.6c-4.7.1-7.4 1.6-9 5.1.4-6.4 3.8-9.6 9-9.8V4.2Z"/></svg>',
      volume: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4V9Zm12.2-.8a5.4 5.4 0 0 1 0 7.6l-1.4-1.4a3.4 3.4 0 0 0 0-4.8l1.4-1.4Zm2.7-2.7a9.2 9.2 0 0 1 0 13l-1.4-1.4a7.2 7.2 0 0 0 0-10.2l1.4-1.4Z"/></svg>',
      muted: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4V9Zm11.2.1 1.4-1.4 2.1 2.1 2.1-2.1 1.4 1.4-2.1 2.1 2.1 2.1-1.4 1.4-2.1-2.1-2.1 2.1-1.4-1.4 2.1-2.1-2.1-2.1Z"/></svg>',
      retry: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.6 7.1V3.8h2v7h-7v-2h3.6a6.5 6.5 0 1 0 .7 5.2l2 .6a8.5 8.5 0 1 1-1.3-7.5Z"/></svg>',
    };
    return icons[name] || "";
  }

  function copyText(value) {
    if (navigator.clipboard?.writeText) {
      return navigator.clipboard.writeText(value).catch(() => legacyCopy(value));
    }
    return legacyCopy(value);
  }

  function legacyCopy(value) {
    const area = document.createElement("textarea");
    area.value = value;
    area.style.cssText = "position:fixed;opacity:0;pointer-events:none";
    document.body.appendChild(area);
    area.select();
    try { document.execCommand("copy"); } catch {}
    area.remove();
    return Promise.resolve();
  }

  function closeDrawer() {
    document.querySelector(".nt-drawer")?.classList.remove("open");
  }

  function renderComments(drawer, item, comments) {
    const list = drawer.querySelector(".nt-comment-list");
    list.textContent = "";

    if (!comments.length) {
      const empty = document.createElement("div");
      empty.className = "nt-empty";
      empty.textContent = "No comments were returned for this post.";
      list.appendChild(empty);
    }

    comments.forEach((comment) => {
      const row = document.createElement("div");
      row.className = "nt-comment";
      const avatar = document.createElement("img");
      avatar.alt = "";
      avatar.src = proxify(comment?.user?.avatar_thumb?.url_list?.[0] || "");
      const content = document.createElement("div");
      const name = document.createElement("strong");
      name.textContent = `@${comment?.user?.unique_id || comment?.user?.nickname || "user"}`;
      const text = document.createElement("p");
      text.textContent = comment?.text || "";
      content.append(name, text);
      row.append(avatar, content);
      list.appendChild(row);
    });

    const openPost = document.createElement("button");
    openPost.type = "button";
    openPost.className = "nt-open-post";
    openPost.textContent = "Open full post";
    openPost.addEventListener("click", () => {
      go(`/@${encodeURIComponent(getHandle(item))}/video/${encodeURIComponent(getItemId(item))}`);
    });
    list.appendChild(openPost);
  }

  function openComments(item) {
    const drawer = document.querySelector(".nt-drawer");
    if (!drawer) return;
    drawer.classList.add("open");
    drawer.querySelector(".nt-comment-list").innerHTML = '<div class="nt-empty">Loading comments...</div>';
    const endpoint = `${location.origin}/ag/https/www.tiktok.com/api/comment/list/?aid=1988&aweme_id=${encodeURIComponent(getItemId(item))}&count=20&cursor=0`;
    fetch(endpoint, { credentials: "include" })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("comments unavailable")))
      .then((payload) => renderComments(drawer, item, Array.isArray(payload.comments) ? payload.comments : []))
      .catch(() => renderComments(drawer, item, []));
  }

  function createAction(iconName, label, count) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "nt-action";
    button.setAttribute("aria-label", label);
    button.innerHTML = `<span class="nt-action-glyph">${icon(iconName)}</span><span class="nt-action-count">${formatCount(count)}</span>`;
    return button;
  }

  function updateSoundControls() {
    document.querySelectorAll("#nebulo-tiktok-feed .nt-audio").forEach((button) => {
      const enabled = state.soundEnabled && button.closest(".nt-post") === state.activePost;
      button.classList.toggle("enabled", enabled);
      button.setAttribute("aria-pressed", String(enabled));
      button.setAttribute("aria-label", enabled ? "Mute video" : "Turn sound on");
      button.innerHTML = `${icon(enabled ? "volume" : "muted")}<span>${enabled ? "Sound on" : "Sound off"}</span>`;
    });
  }

  function updatePreloadWindow(activePost) {
    const posts = Array.from(document.querySelectorAll("#nebulo-tiktok-feed .nt-post"));
    const activeIndex = Math.max(0, posts.indexOf(activePost));
    posts.forEach((post, index) => {
      const video = post.querySelector("video");
      if (!video) return;
      const distance = index - activeIndex;
      const desired = distance === 0 ? "auto" : distance > 0 && distance <= 2 ? "metadata" : "none";
      if (video.preload !== desired) video.preload = desired;
    });
  }

  function maybePrefetch(activePost) {
    const posts = Array.from(document.querySelectorAll("#nebulo-tiktok-feed .nt-post"));
    const activeIndex = posts.indexOf(activePost);
    if (activeIndex >= 0 && posts.length - activeIndex <= PREFETCH_DISTANCE) loadMore("proximity");
  }

  function setActivePost(post, options = {}) {
    if (!post || post === state.activePost && !options.force) return;
    state.activePost = post;
    const posts = document.querySelectorAll("#nebulo-tiktok-feed .nt-post");
    posts.forEach((candidate) => {
      const video = candidate.querySelector("video");
      const isActive = candidate === post;
      candidate.classList.toggle("active", isActive);
      if (!video) return;
      if (isActive) {
        video.muted = !state.soundEnabled;
        video.play().catch(() => {
          video.muted = true;
          state.soundEnabled = false;
          updateSoundControls();
          video.play().catch(() => {});
        });
      } else {
        video.pause();
        video.muted = true;
      }
    });
    updateSoundControls();
    updatePreloadWindow(post);
    maybePrefetch(post);
  }

  function syncActiveFromVisibility() {
    let bestPost = null;
    let bestRatio = 0;
    state.visibility.forEach((ratio, post) => {
      if (post.isConnected && ratio > bestRatio) {
        bestRatio = ratio;
        bestPost = post;
      }
    });
    if (bestPost && bestRatio >= 0.52) setActivePost(bestPost);
  }

  function createPost(item, index) {
    const author = getAuthor(item);
    const stats = getStats(item);
    const post = document.createElement("article");
    post.className = "nt-post";
    post.dataset.itemId = getItemId(item);

    const stage = document.createElement("div");
    stage.className = "nt-stage";
    const shell = document.createElement("div");
    shell.className = "nt-video-shell";
    const video = document.createElement("video");
    video.className = "nt-video";
    video.src = proxify(getVideoUrl(item));
    video.poster = proxify(getPoster(item));
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    // Give the visible post the entire media connection. Preloading every
    // off-screen clip makes TikTok's range requests compete and delays the
    // first frame on slower proxy transports.
    video.preload = index === 0 ? "auto" : index < 3 ? "metadata" : "none";

    const playState = document.createElement("div");
    playState.className = "nt-play-state";
    playState.innerHTML = icon("play");
    video.addEventListener("click", () => {
      const shouldPlay = video.paused;
      setActivePost(post, { force: true });
      if (shouldPlay) video.play().catch(() => {});
      else video.pause();
    });
    video.addEventListener("play", () => playState.classList.remove("show"));
    video.addEventListener("pause", () => playState.classList.add("show"));

    const info = document.createElement("div");
    info.className = "nt-info";
    const user = document.createElement("button");
    user.type = "button";
    user.className = "nt-user";
    user.textContent = `@${getHandle(item)}`;
    user.addEventListener("click", () => go(`/@${encodeURIComponent(getHandle(item))}`));
    const description = document.createElement("div");
    description.className = "nt-desc";
    description.textContent = item.desc || item.description || "";
    info.append(user, description);

    const actions = document.createElement("div");
    actions.className = "nt-actions";
    const avatarButton = document.createElement("button");
    avatarButton.type = "button";
    avatarButton.className = "nt-avatar-button";
    avatarButton.setAttribute("aria-label", "Open creator profile");
    const avatar = document.createElement("img");
    avatar.className = "nt-avatar";
    avatar.alt = author.nickname || "Creator";
    avatar.src = proxify(getAvatar(item));
    avatarButton.appendChild(avatar);
    avatarButton.addEventListener("click", () => go(`/@${encodeURIComponent(getHandle(item))}`));

    const likeBase = Number(stats.diggCount || stats.digg_count || 0);
    const like = createAction("heart", "Like", likeBase);
    like.addEventListener("click", () => {
      const active = like.classList.toggle("liked");
      if (active) state.liked.add(getItemId(item));
      else state.liked.delete(getItemId(item));
      like.querySelector(".nt-action-count").textContent = formatCount(likeBase + (active ? 1 : 0));
    });
    const comments = createAction("comment", "Comments", stats.commentCount || stats.comment_count || 0);
    comments.addEventListener("click", () => openComments(item));
    const saveBase = Number(stats.collectCount || stats.collect_count || 0);
    const save = createAction("bookmark", "Save", saveBase);
    save.addEventListener("click", () => {
      const active = save.classList.toggle("saved");
      if (active) state.saved.add(getItemId(item));
      else state.saved.delete(getItemId(item));
      save.querySelector(".nt-action-count").textContent = formatCount(saveBase + (active ? 1 : 0));
    });
    const share = createAction("share", "Share", stats.shareCount || stats.share_count || 0);
    share.addEventListener("click", () => copyText(postUrl(item)).then(() => toast("Video link copied")));
    actions.append(avatarButton, like, comments, save, share);

    const sound = document.createElement("button");
    sound.type = "button";
    sound.className = "nt-audio";
    sound.setAttribute("aria-pressed", "false");
    sound.innerHTML = `${icon("muted")}<span>Sound off</span>`;
    sound.addEventListener("click", () => {
      state.soundEnabled = !state.soundEnabled;
      if (state.activePost !== post) setActivePost(post, { force: true });
      video.muted = !state.soundEnabled;
      if (state.soundEnabled) video.play().catch(() => {
        state.soundEnabled = false;
        video.muted = true;
      }).finally(updateSoundControls);
      else updateSoundControls();
    });

    shell.append(video, playState, info, sound);
    stage.append(shell, actions);
    post.appendChild(stage);
    return post;
  }

  function appendItems(items) {
    const feed = document.querySelector(".nt-feed");
    if (!feed) return 0;
    let added = 0;
    items.forEach((item) => {
      const id = getItemId(item);
      if (!id || !getVideoUrl(item) || state.ids.has(id)) return;
      state.ids.add(id);
      state.items.push(item);
      const post = createPost(item, state.items.length - 1);
      const pagination = feed.querySelector(".nt-pagination");
      feed.insertBefore(post, pagination || null);
      state.observer?.observe(post);
      added += 1;
    });
    window.__nebuloTikTokPayloadCount = state.items.length;
    return added;
  }

  function setPaginationState(mode, message = "") {
    const pagination = document.querySelector("#nebulo-tiktok-feed .nt-pagination");
    if (!pagination) return;
    pagination.dataset.state = mode;
    const status = pagination.querySelector(".nt-pagination-copy");
    if (status) status.textContent = message || (mode === "loading" ? "Loading more videos" : "");
  }

  function refreshFeedMetadata() {
    if (state.metadataPromise) return state.metadataPromise;
    state.metadataPromise = fetch("/argon-tiktok-feed-cache.json", {
      cache: "no-store",
      credentials: "same-origin",
    })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("cache unavailable")))
      .then((payload) => {
        capture(payload);
        return payload;
      })
      .finally(() => { state.metadataPromise = null; });
    return state.metadataPromise;
  }

  function schedulePaginationRetry(reason) {
    clearTimeout(state.retryTimer);
    if (state.consecutiveFailures >= MAX_AUTO_RETRIES) {
      setPaginationState("error", "More videos could not be loaded.");
      return;
    }
    const delay = 650 * (2 ** Math.max(0, state.consecutiveFailures - 1));
    setPaginationState("waiting", "Reconnecting…");
    state.retryTimer = setTimeout(() => loadMore(reason || "retry"), delay);
  }

  function loadMore(reason = "proximity") {
    const preloadUrl = window.__nebuloTikTokPreloadUrl;
    if (state.loading || (state.consecutiveFailures >= MAX_AUTO_RETRIES && reason !== "manual")) return;
    if (!preloadUrl) {
      state.consecutiveFailures += 1;
      refreshFeedMetadata()
        .then(() => {
          if (window.__nebuloTikTokPreloadUrl) {
            state.consecutiveFailures = Math.max(0, state.consecutiveFailures - 1);
            loadMore(reason);
          } else schedulePaginationRetry(reason);
        })
        .catch(() => schedulePaginationRetry(reason));
      return Promise.resolve();
    }
    if (reason === "manual") state.consecutiveFailures = 0;
    state.loading = true;
    setPaginationState("loading");
    const next = new URL(preloadUrl, location.href);
    state.cursor += 1;
    next.searchParams.set("pullType", "2");
    next.searchParams.set("cursor", String(Date.now() + state.cursor));

    return fetch(next.href, { credentials: "include", cache: "no-store" })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("feed unavailable")))
      .then(async (payload) => {
        if (typeof payload?._nebuloNextUrl === "string" && payload._nebuloNextUrl.startsWith("/ag/")) {
          window.__nebuloTikTokPreloadUrl = payload._nebuloNextUrl;
        }
        const added = appendItems(normalizeItems(payload));
        if (added > 0) {
          clearTimeout(state.retryTimer);
          state.consecutiveFailures = 0;
          setPaginationState("idle");
          return;
        }

        // Argon also accumulates unique items server-side. A short cache read
        // catches items captured by TikTok's parallel preload request without
        // issuing a burst of duplicate upstream requests.
        await new Promise((resolve) => setTimeout(resolve, 180));
        const before = state.items.length;
        await refreshFeedMetadata();
        if (state.items.length > before) {
          clearTimeout(state.retryTimer);
          state.consecutiveFailures = 0;
          setPaginationState("idle");
          return;
        }
        state.consecutiveFailures += 1;
        schedulePaginationRetry(reason);
      })
      .catch(() => {
        state.consecutiveFailures += 1;
        schedulePaginationRetry(reason);
      })
      .finally(() => {
        state.loading = false;
        if (state.consecutiveFailures === 0) setPaginationState("idle");
      });
  }

  function installStyles() {
    if (document.getElementById("nebulo-tiktok-client-style")) return;
    const style = document.createElement("style");
    style.id = "nebulo-tiktok-client-style";
    style.textContent = `
      #nebulo-tiktok-feed{--nt-pink:#fe2c55;--nt-canvas:#080808;--nt-surface:#252525;position:fixed;inset:0 0 0 240px;z-index:2147483000;background:var(--nt-canvas);color:#fff;font-family:ProximaNova,Arial,Tahoma,PingFangSC,sans-serif;color-scheme:dark}
      #nebulo-tiktok-feed *{box-sizing:border-box}#nebulo-tiktok-feed button{font:inherit}#nebulo-tiktok-feed button:focus-visible{outline:2px solid #fff;outline-offset:3px}
      .nt-feed{height:100dvh;overflow-y:auto;scroll-snap-type:y mandatory;scroll-behavior:smooth;overscroll-behavior-y:contain;scrollbar-width:thin;scrollbar-color:#333 transparent;background:#080808}
      .nt-post{height:100dvh;min-height:580px;scroll-snap-align:start;scroll-snap-stop:always;display:flex;align-items:center;justify-content:center;padding:20px 92px 20px 24px;contain:layout paint}
      .nt-stage{position:relative;height:min(92dvh,880px);display:flex;align-items:flex-end;justify-content:center}
      .nt-video-shell{position:relative;height:100%;aspect-ratio:9/16;max-width:calc(100vw - 380px);overflow:hidden;border-radius:8px;background:#000;box-shadow:0 16px 48px rgba(0,0,0,.4)}
      .nt-video{display:block;width:100%;height:100%;object-fit:contain;background:#000;cursor:pointer;-webkit-tap-highlight-color:transparent}
      .nt-play-state{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) scale(.92);width:62px;height:62px;border-radius:50%;display:grid;place-items:center;background:rgba(0,0,0,.56);opacity:0;pointer-events:none;transition:opacity .16s ease,transform .16s ease;backdrop-filter:blur(3px)}
      .nt-play-state svg{width:28px;height:28px;fill:#fff;margin-left:3px}.nt-play-state.show{opacity:1;transform:translate(-50%,-50%) scale(1)}
      .nt-info{position:absolute;z-index:2;left:0;right:0;bottom:0;padding:86px 22px 22px;background:linear-gradient(180deg,transparent,rgba(0,0,0,.78));text-shadow:0 1px 3px #000;pointer-events:none}
      .nt-user{display:block;border:0;background:transparent;color:#fff;padding:0;font-weight:800;font-size:17px;line-height:1.3;cursor:pointer;pointer-events:auto}.nt-user:hover{text-decoration:underline}.nt-desc{max-width:90%;margin-top:7px;color:#fff;line-height:1.42;font-size:15px;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
      .nt-actions{position:absolute;z-index:3;left:calc(100% + 14px);bottom:4px;display:flex;flex-direction:column;align-items:center;gap:15px;text-align:center}
      .nt-avatar-button{position:relative;width:50px;height:50px;padding:0;border:1px solid rgba(255,255,255,.9);border-radius:50%;background:#222;cursor:pointer}.nt-avatar-button::after{content:'+';position:absolute;left:50%;bottom:-7px;translate:-50% 0;width:20px;height:20px;border-radius:50%;display:grid;place-items:center;background:var(--nt-pink);color:#fff;font-size:16px;font-weight:800;line-height:20px}.nt-avatar{display:block;width:100%;height:100%;border-radius:50%;object-fit:cover}
      .nt-action{min-width:52px;padding:0;border:0;background:transparent;display:grid;justify-items:center;gap:5px;color:#fff;font-size:12px;font-weight:700;cursor:pointer;-webkit-tap-highlight-color:transparent}.nt-action-glyph{width:48px;height:48px;border-radius:50%;display:grid;place-items:center;background:var(--nt-surface);transition:transform .14s ease,background .14s ease,color .14s ease}.nt-action-glyph svg{width:24px;height:24px;fill:currentColor}.nt-action:hover .nt-action-glyph{transform:scale(1.06);background:#333}.nt-action:active .nt-action-glyph{transform:scale(.94)}.nt-action.liked .nt-action-glyph{color:var(--nt-pink)}.nt-action.saved .nt-action-glyph{color:#face15}
      .nt-audio{position:absolute;z-index:3;right:12px;top:12px;height:36px;padding:0 11px;border:0;border-radius:18px;display:flex;align-items:center;gap:7px;background:rgba(0,0,0,.62);color:#fff;font-size:12px;font-weight:700;cursor:pointer}.nt-audio svg{width:17px;height:17px;fill:currentColor}.nt-audio span{white-space:nowrap}.nt-audio.enabled{background:rgba(37,37,37,.86)}
      .nt-pagination{position:fixed;z-index:5;left:calc(50% - 120px);bottom:13px;min-height:34px;display:flex;align-items:center;justify-content:center;gap:9px;color:#a8a8a8;font-size:12px;pointer-events:none;opacity:0;transition:opacity .18s}.nt-pagination[data-state="loading"],.nt-pagination[data-state="waiting"],.nt-pagination[data-state="error"]{opacity:1}.nt-spinner{width:15px;height:15px;border:2px solid #333;border-top-color:#aaa;border-radius:50%;animation:nt-spin .75s linear infinite}.nt-pagination[data-state="error"]{padding:7px 8px 7px 12px;border:1px solid #333;border-radius:7px;background:#161616;pointer-events:auto}.nt-pagination[data-state="error"] .nt-spinner{display:none}.nt-retry{display:none;height:28px;padding:0 9px;border:0;border-radius:5px;background:#2b2b2b;color:#fff;font-size:12px;font-weight:700;cursor:pointer}.nt-retry svg{width:14px;height:14px;fill:currentColor;vertical-align:-2px;margin-right:4px}.nt-pagination[data-state="error"] .nt-retry{display:inline-flex;align-items:center}
      .nt-toast{position:fixed;left:calc(50% - 120px);bottom:28px;z-index:12;padding:10px 15px;border-radius:6px;background:#fff;color:#111;font-size:13px;font-weight:700;opacity:0;transform:translate(-50%,10px);transition:.18s;pointer-events:none}.nt-toast.show{opacity:1;transform:translate(-50%,0)}
      .nt-drawer{position:fixed;z-index:11;right:0;top:0;bottom:0;width:min(420px,100vw);padding:18px;background:#111;border-left:1px solid #303030;transform:translateX(102%);transition:transform .22s ease;box-shadow:-18px 0 50px rgba(0,0,0,.5)}.nt-drawer.open{transform:none}.nt-drawer-head{display:flex;align-items:center;justify-content:space-between;padding-bottom:14px;border-bottom:1px solid #2b2b2b}.nt-drawer-head button{width:36px;height:36px;border:0;border-radius:50%;background:#272727;color:#fff;cursor:pointer}.nt-comment-list{height:calc(100% - 60px);overflow:auto;padding:10px 0}.nt-comment{display:grid;grid-template-columns:38px 1fr;gap:10px;padding:12px 4px;border-bottom:1px solid #222}.nt-comment img{width:38px;height:38px;border-radius:50%;object-fit:cover;background:#222}.nt-comment strong{font-size:13px}.nt-comment p{margin:5px 0 0;color:#ddd;line-height:1.4;font-size:14px}.nt-empty{padding:28px 12px;text-align:center;color:#a8a8a8}.nt-open-post{display:block;margin:18px auto;padding:10px 16px;border:0;border-radius:5px;background:var(--nt-pink);color:#fff;font-weight:750;cursor:pointer}
      @keyframes nt-spin{to{transform:rotate(360deg)}}
      @media(max-width:1100px) and (min-width:761px){#nebulo-tiktok-feed{left:72px}.nt-post{padding-right:82px}.nt-video-shell{max-width:calc(100vw - 190px)}.nt-pagination,.nt-toast{left:50%}}
      @media(max-width:760px){#nebulo-tiktok-feed{left:0}.nt-feed{scrollbar-width:none}.nt-feed::-webkit-scrollbar{display:none}.nt-post{min-height:100dvh;padding:0}.nt-stage{width:100%;height:100dvh}.nt-video-shell{width:100%;height:100%;max-width:none;aspect-ratio:auto;border-radius:0}.nt-video{object-fit:cover}.nt-actions{left:auto;right:max(8px,env(safe-area-inset-right));bottom:max(92px,calc(env(safe-area-inset-bottom) + 74px));gap:13px}.nt-action-glyph{width:44px;height:44px}.nt-avatar-button{width:46px;height:46px}.nt-info{padding:100px 76px max(24px,calc(env(safe-area-inset-bottom) + 16px)) 14px}.nt-desc{max-width:100%;font-size:14px}.nt-audio{top:max(12px,env(safe-area-inset-top));right:max(10px,env(safe-area-inset-right))}.nt-pagination{left:50%;bottom:max(8px,env(safe-area-inset-bottom));transform:translateX(-50%)}.nt-toast{left:50%;bottom:max(24px,calc(env(safe-area-inset-bottom) + 20px))}.nt-drawer{padding-bottom:max(18px,env(safe-area-inset-bottom))}}
      @media(prefers-reduced-motion:reduce){.nt-feed{scroll-behavior:auto}.nt-play-state,.nt-pagination,.nt-toast,.nt-drawer{transition:none}.nt-spinner{animation-duration:1.4s}}
    `;
    document.head.appendChild(style);
  }

  function mount() {
    clearTimeout(state.mountTimer);
    if (!state.items.length || document.getElementById("nebulo-tiktok-feed")) return;
    if (!document.body) {
      state.mountTimer = setTimeout(mount, 50);
      return;
    }
    if (nativeFeedIsWorking()) return;
    if (nativeVideoIsStarting()) {
      state.mountTimer = setTimeout(mount, 500);
      return;
    }

    installStyles();
    const root = document.createElement("div");
    root.id = "nebulo-tiktok-feed";
    root.innerHTML = `
      <main class="nt-feed" aria-label="For You feed"><div class="nt-pagination" data-state="idle" role="status" aria-live="polite"><span class="nt-spinner" aria-hidden="true"></span><span class="nt-pagination-copy"></span><button class="nt-retry" type="button">${icon("retry")}Try again</button></div></main><div class="nt-toast" role="status" aria-live="polite"></div>
      <aside class="nt-drawer"><div class="nt-drawer-head"><strong>Comments</strong><button type="button" aria-label="Close">&#10005;</button></div><div class="nt-comment-list"></div></aside>
    `;

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.appendChild(root);

    const feed = root.querySelector(".nt-feed");
    root.querySelector(".nt-drawer-head button").addEventListener("click", closeDrawer);
    root.querySelector(".nt-retry").addEventListener("click", () => {
      state.consecutiveFailures = 0;
      loadMore("manual");
    });

    state.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        state.visibility.set(entry.target, entry.isIntersecting ? entry.intersectionRatio : 0);
      });
      syncActiveFromVisibility();
    }, { root: feed, threshold: [0, 0.25, 0.52, 0.7, 0.9] });

    document.addEventListener("keydown", (event) => {
      if (/INPUT|TEXTAREA/.test(event.target?.tagName || "")) return;
      if (event.key === " " || event.code === "Space") {
        if (event.target?.closest?.("button,a,[role='button']")) return;
        event.preventDefault();
        const video = state.activePost?.querySelector("video");
        if (video) video.paused ? video.play().catch(() => {}) : video.pause();
        return;
      }
      if (event.key !== "ArrowDown" && event.key !== "ArrowUp" || event.repeat) return;
      const posts = Array.from(feed.querySelectorAll(".nt-post"));
      if (!posts.length) return;
      event.preventDefault();
      const current = Math.max(0, posts.indexOf(state.activePost));
      const targetIndex = Math.max(0, Math.min(posts.length - 1, current + (event.key === "ArrowDown" ? 1 : -1)));
      posts[targetIndex].scrollIntoView({ behavior: "smooth", block: "start" });
      if (posts.length - targetIndex <= PREFETCH_DISTANCE) loadMore("keyboard");
    });

    const initial = state.items.slice();
    state.items.length = 0;
    state.ids.clear();
    appendItems(initial);
    requestAnimationFrame(() => {
      const first = feed.querySelector(".nt-post");
      if (first) setActivePost(first, { force: true });
    });
  }

  function capture(payload) {
    if (payload && typeof payload._nebuloNextUrl === "string" && payload._nebuloNextUrl.startsWith("/ag/")) {
      window.__nebuloTikTokPreloadUrl = payload._nebuloNextUrl;
    }
    const items = normalizeItems(payload);
    if (!items.length) return;
    if (document.getElementById("nebulo-tiktok-feed")) appendItems(items);
    else {
      items.forEach((item) => {
        const id = getItemId(item);
        if (!id || state.ids.has(id)) return;
        state.ids.add(id);
        state.items.push(item);
      });
      state.mountTimer = setTimeout(mount, 80);
    }
  }

  window.NebuloTikTokClient = { capture, loadMore };
  (window.__nebuloTikTokPayloadQueue || []).forEach(capture);

  let cacheAttempts = 0;
  function loadCachedFeed() {
    cacheAttempts += 1;
    fetch("/argon-tiktok-feed-cache.json", { cache: "no-store", credentials: "same-origin" })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("cache unavailable")))
      .then(capture)
      .catch(() => {})
      .finally(() => {
        if ((!state.items.length || !window.__nebuloTikTokPreloadUrl) && cacheAttempts < 40) {
          setTimeout(loadCachedFeed, 250);
        }
      });
  }
  setTimeout(loadCachedFeed, 100);
})();
