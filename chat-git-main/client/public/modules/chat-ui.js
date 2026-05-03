import { getSocket } from './socket.js';

export function createChatUi(deps) {
  const {
    app,
    state,
    fallbackEffects,
    esc,
    navigate,
    getAllowedSlashCommands,
    getRoomEffectMeta,
    getActiveRoomEffectId,
    getMessageEffect,
    setRoomEffectState,
    applyUserSnapshot,
    getEffectMeta,
    setToken,
    getTlkClientId,
    getChatDeviceId,
    api,
    getMessagesSignature,
    normalizeEffectId,
    renderRoomEffectStage,
    activateGlobalEffect
  } = deps;

  const toastHost = document.getElementById('toast-host') || (() => {
    const host = document.createElement('div');
    host.id = 'toast-host';
    document.body.appendChild(host);
    return host;
  })();

  let animatedMessageIds = new Set();
  let activeSocket = null;
  let activeSocketOrigin = '';
  let joinedTypingRoomId = '';
  let localTypingRoomId = '';
  let localTypingActive = false;
  let localTypingStopTimer = null;
  let lastTypingEmitAt = 0;
  const remoteTypingUsers = new Map();
  const remoteTypingTimers = new Map();

  const getSocketOrigin = () => String(state.apiBase || window.location.origin || '').trim().replace(/\/+$/, '') || window.location.origin;
  const getLocalDisplayName = () => String(localStorage.getItem('tlkNickname') || state.user?.name || state.user?.username || '').trim();
  const getMessageId = (message) => String(message?.id || message?._id || '').trim();
  const defaultComposerHint = 'Enter to send · Shift+Enter for new line · / for commands';
  const buildLocalSystemMessage = (body, roomId, idSeed = Date.now()) => ({
    id: `sys_room_effect_${String(idSeed)}`,
    _id: `sys_room_effect_${String(idSeed)}`,
    nickname: 'System',
    body: String(body || '').trim(),
    system: true,
    roomId: String(roomId || '').trim(),
    date: new Date().toISOString(),
    timestamp: Math.floor(Date.now() / 1000)
  });
  const isIncrementalCursorMessage = (message) => {
    const messageId = getMessageId(message);
    if (!messageId) return false;
    if (String(message?.system || '').toLowerCase() === 'true' || !!message?.system) return false;
    if (messageId.startsWith('temp-')) return false;
    if (messageId.startsWith('sys_')) return false;
    if (messageId.startsWith('system-room-effect-')) return false;
    return true;
  };

  const upsertRealtimeMessage = (message, { replaceOptimistic = false } = {}) => {
    const roomId = String(message?.roomId || '').trim();
    const currentRoomId = String(state.currentChannel?.room || '').trim();
    if (!message || !currentRoomId || (roomId && roomId !== currentRoomId)) return false;

    const messageId = getMessageId(message);
    let optimisticIndex = state.messages.findIndex((entry) => String(entry?._id || '').startsWith('temp-'));
    if (messageId) {
      const existingIndex = state.messages.findIndex((entry) => getMessageId(entry) === messageId);
      if (existingIndex >= 0) {
        if (replaceOptimistic && optimisticIndex >= 0 && existingIndex !== optimisticIndex) {
          state.messages.splice(existingIndex, 1);
          if (existingIndex < optimisticIndex) optimisticIndex -= 1;
        }
        const targetIndex = replaceOptimistic && optimisticIndex >= 0 ? optimisticIndex : existingIndex;
        state.messages.splice(targetIndex, 1, { ...state.messages[targetIndex], ...message });
        state.lastMessagesSignature = getMessagesSignature(state.messages);
        renderMessages();
        return true;
      }
    }

    if (replaceOptimistic && optimisticIndex >= 0) {
      state.messages.splice(optimisticIndex, 1, message);
      if (messageId) {
        state.messages = state.messages.filter((entry, index) => index === optimisticIndex || getMessageId(entry) !== messageId);
      }
      state.lastMessagesSignature = getMessagesSignature(state.messages);
      renderMessages();
      return true;
    }

    if (messageId) {
      state.messages = state.messages.filter((entry) => getMessageId(entry) !== messageId);
    }
    state.messages.push(message);
    state.lastMessagesSignature = getMessagesSignature(state.messages);
    renderMessages();
    return true;
  };

  const renderTypingIndicator = () => {
    const el = document.getElementById('typing-indicator');
    if (!el) return;

    const names = [...remoteTypingUsers.values()]
      .map((entry) => String(entry?.username || '').trim())
      .filter(Boolean);
    const visibleNames = localTypingActive ? ['You', ...names] : names;

    if (!visibleNames.length) {
      el.textContent = '';
      el.classList.add('hidden');
      return;
    }

    let label = '';
    if (visibleNames.length === 1) label = `${visibleNames[0]} ${visibleNames[0] === 'You' ? 'are' : 'is'} typing...`;
    else if (visibleNames.length === 2) label = `${visibleNames[0]} and ${visibleNames[1]} are typing...`;
    else label = `${visibleNames[0]}, ${visibleNames[1]}, and ${visibleNames.length - 2} others are typing...`;

    el.textContent = label;
    el.classList.remove('hidden');
  };

  const removeRemoteTypingUser = (key) => {
    const normalizedKey = String(key || '').trim().toLowerCase();
    if (!normalizedKey) return;
    if (remoteTypingTimers.has(normalizedKey)) {
      clearTimeout(remoteTypingTimers.get(normalizedKey));
      remoteTypingTimers.delete(normalizedKey);
    }
    if (remoteTypingUsers.delete(normalizedKey)) renderTypingIndicator();
  };

  const clearRemoteTypingUsers = () => {
    remoteTypingTimers.forEach((timer) => clearTimeout(timer));
    remoteTypingTimers.clear();
    remoteTypingUsers.clear();
    renderTypingIndicator();
  };

  const getTypingKey = (data) =>
    String(data?.userId || data?.clientId || data?.username || data?.nickname || '')
      .trim()
      .toLowerCase();

  const handleRemoteTyping = (data = {}) => {
    const roomId = String(data?.roomId || '').trim();
    const currentRoomId = String(state.currentChannel?.room || '').trim();
    if (!roomId || !currentRoomId || roomId !== currentRoomId) return;

    const username = String(data?.username || data?.nickname || '').trim();
    const typingKey = getTypingKey(data);
    if (!username || !typingKey) return;

    const localNames = new Set([
      String(state.user?.name || '').trim().toLowerCase(),
      String(state.user?.username || '').trim().toLowerCase(),
      String(localStorage.getItem('tlkNickname') || '').trim().toLowerCase()
    ].filter(Boolean));
    const localUserId = String(state.user?._id || '').trim();
    if (localNames.has(username.toLowerCase()) || (localUserId && String(data?.userId || '').trim() === localUserId)) {
      return;
    }

    if (data?.isTyping === false) {
      removeRemoteTypingUser(typingKey);
      return;
    }

    remoteTypingUsers.set(typingKey, { username, roomId });
    if (remoteTypingTimers.has(typingKey)) clearTimeout(remoteTypingTimers.get(typingKey));
    remoteTypingTimers.set(typingKey, setTimeout(() => removeRemoteTypingUser(typingKey), 2200));
    renderTypingIndicator();
  };

  const handleRealtimeMessage = (payload = {}) => {
    const message = payload?.message && typeof payload.message === 'object'
      ? { ...payload.message, roomId: String(payload.roomId || payload.message.roomId || '') }
      : { ...payload };
    const currentRoomId = String(state.currentChannel?.room || '').trim();
    const roomId = String(message?.roomId || '').trim();
    if (!currentRoomId || !roomId || roomId !== currentRoomId) return;
    if (upsertRealtimeMessage(message)) {
      state.autoFollow = true;
      setJumpToLatestVisible(false);
    }
  };

  const showTopNotification = (message, durationMs = 3600) => {
    const div = document.createElement('div');
    div.className = 'toast-top-anim';
    div.textContent = String(message || '');
    document.body.appendChild(div);
    setTimeout(() => div.remove(), Number(durationMs));
  };

  const handleGlobalEffect = (data = {}) => {
    const effectId = String(data?.effectId || '').trim().toLowerCase();
    const triggerName = String(data?.triggeredByName || 'Someone');
    const effectName = getEffectMeta(effectId).name || 'Global effect';
    showTopNotification(`${triggerName} activated ${effectName} globally`, 4200);
    if (effectId === 'duck') {
      // Play the duck quack sound
      const audio = new Audio(new URL('./sounds/freesound_community-075176_duck-quack-40345.mp3', import.meta.url).href);
      audio.volume = 0.7; // Set volume to 70%
      audio.play().catch(err => console.warn('Failed to play duck sound:', err));
    }
  };

  const ensureChatSocket = async () => {
    const origin = getSocketOrigin();
    const socket = await getSocket(origin);
    if (activeSocket && (activeSocket !== socket || activeSocketOrigin !== origin)) {
      activeSocket.off('user_typing', handleRemoteTyping);
      activeSocket.off('receive_message', handleRealtimeMessage);
      activeSocket.off('global_effect', handleGlobalEffect);
    }
    activeSocket = socket;
    activeSocketOrigin = origin;
    activeSocket.off('user_typing', handleRemoteTyping);
    activeSocket.off('receive_message', handleRealtimeMessage);
    activeSocket.off('global_effect', handleGlobalEffect);
    activeSocket.on('user_typing', handleRemoteTyping);
    activeSocket.on('receive_message', handleRealtimeMessage);
    activeSocket.on('global_effect', handleGlobalEffect);
    return activeSocket;
  };

  const emitTypingState = async (roomId, isTyping) => {
    const normalizedRoomId = String(roomId || '').trim();
    const username = getLocalDisplayName();
    if (!normalizedRoomId || !username) return;
    try {
      const socket = await ensureChatSocket();
      socket.emit('typing', {
        roomId: normalizedRoomId,
        username,
        userId: String(state.user?._id || '').trim(),
        clientId: getTlkClientId(),
        isTyping: !!isTyping
      });
    } catch (err) {
      console.warn('Typing socket unavailable:', err);
    }
  };

  const stopLocalTyping = (roomId = localTypingRoomId) => {
    if (localTypingStopTimer) {
      clearTimeout(localTypingStopTimer);
      localTypingStopTimer = null;
    }
    const normalizedRoomId = String(roomId || '').trim();
    if (localTypingActive && normalizedRoomId) void emitTypingState(normalizedRoomId, false);
    localTypingActive = false;
    localTypingRoomId = '';
    lastTypingEmitAt = 0;
    renderTypingIndicator();
  };

  const syncLocalTyping = (rawValue) => {
    const roomId = String(state.currentChannel?.room || '').trim();
    if (!roomId) return;

    if (!String(rawValue || '').trim()) {
      stopLocalTyping(roomId);
      return;
    }

    localTypingRoomId = roomId;
    const now = Date.now();
    if (!localTypingActive || now - lastTypingEmitAt >= 1200) {
      localTypingActive = true;
      lastTypingEmitAt = now;
      void emitTypingState(roomId, true);
    }
    renderTypingIndicator();

    if (localTypingStopTimer) clearTimeout(localTypingStopTimer);
    localTypingStopTimer = setTimeout(() => {
      if (localTypingRoomId === roomId) stopLocalTyping(roomId);
    }, 1600);
  };

  const joinTypingRoom = async (roomId) => {
    const normalizedRoomId = String(roomId || '').trim();
    clearRemoteTypingUsers();
    if (!normalizedRoomId) return;
    try {
      const socket = await ensureChatSocket();
      if (joinedTypingRoomId && joinedTypingRoomId !== normalizedRoomId) {
        socket.emit('leave_room', joinedTypingRoomId);
      }
      if (joinedTypingRoomId !== normalizedRoomId) {
        socket.emit('join_room', normalizedRoomId);
      }
      joinedTypingRoomId = normalizedRoomId;
    } catch (err) {
      console.warn('Typing room join failed:', err);
    }
  };

  const leaveTypingRoom = (roomId = joinedTypingRoomId) => {
    const normalizedRoomId = String(roomId || '').trim();
    stopLocalTyping(normalizedRoomId);
    clearRemoteTypingUsers();
    if (activeSocket && normalizedRoomId) activeSocket.emit('leave_room', normalizedRoomId);
    if (!normalizedRoomId || joinedTypingRoomId === normalizedRoomId) joinedTypingRoomId = '';
  };

  const renderCommandPanel = (rawValue) => {
    const panel = document.getElementById('command-panel');
    const input = document.getElementById('chat-input');
    if (!panel || !input) return;

    const value = String(rawValue || '').trimStart();
    if (!value.startsWith('/')) { panel.classList.add('hidden'); panel.innerHTML = ''; return; }

    const token = String(value.split(/\s+/)[0] || '/').toLowerCase();
    const items = getAllowedSlashCommands()
      .filter((item) => token === '/' || item.cmd.startsWith(token));

    if (!items.length) { panel.classList.add('hidden'); panel.innerHTML = ''; return; }

    panel.innerHTML = items.map((item) => `
      <button class="cmd-item" type="button" data-cmd="${esc(item.cmd)}" data-usage="${esc(item.usage)}">
        <span class="cmd-usage">${esc(item.usage)}</span>
        <span class="cmd-desc">${esc(item.desc)}</span>
      </button>
    `).join('');
    panel.classList.remove('hidden');

    panel.querySelectorAll('[data-cmd]').forEach((el) => {
      el.addEventListener('click', () => {
        const usage = String(el.getAttribute('data-usage') || '').trim();
        if (!usage) return;
        const bareCmd = usage.split(/\s+/)[0] || usage;
        input.value = usage.includes('<') || usage.includes('[') ? `${bareCmd} ` : `${usage} `;
        input.focus();
        renderCommandPanel(input.value);
      });
    });
  };

  const getChatRoot = () => document.getElementById('chat-messages');
  const isNearBottom = (el, threshold = 24) => !el || (el.scrollHeight - el.scrollTop - el.clientHeight) <= threshold;
  const isSlowmodeBypassed = () => String(state.user?.role || '').toLowerCase() === 'owner';
  const getSlowmodeRemainingMs = () =>
    isSlowmodeBypassed() ? 0 : Math.max(0, Number(state.slowmodeUntil || 0) - Date.now());

  const syncSlowmodeUi = () => {
    const input = document.getElementById('chat-input');
    const box = document.querySelector('.composer-box');
    const sendBtn = document.querySelector('.composer-send');
    const hint = document.getElementById('composer-hint');
    const remainingMs = getSlowmodeRemainingMs();
    const slowmodeActive = remainingMs > 0;
    const seconds = Math.ceil(remainingMs / 1000);

    box?.classList.toggle('slowmode-active', slowmodeActive);
    input?.classList.toggle('slowmode-active', slowmodeActive);
    hint?.classList.toggle('slowmode-active', slowmodeActive);

    if (input) {
      const channelName = String(state.currentChannel?.name?.replace(/^#/, '') || 'general');
      input.placeholder = slowmodeActive
        ? `Slowmode active... ${seconds}s remaining`
        : `Message #${channelName}`;
    }
    if (hint) {
      hint.textContent = slowmodeActive
        ? `Slowmode active · ${seconds}s remaining`
        : defaultComposerHint;
    }
    if (sendBtn) {
      sendBtn.disabled = slowmodeActive || !!state.sendMessageInFlight;
    }
  };

  const scheduleSlowmodeUi = () => {
    if (state.slowmodeTimer) {
      clearTimeout(state.slowmodeTimer);
      state.slowmodeTimer = null;
    }
    syncSlowmodeUi();
    const remainingMs = getSlowmodeRemainingMs();
    if (remainingMs > 0) {
      state.slowmodeTimer = setTimeout(() => {
        state.slowmodeTimer = null;
        scheduleSlowmodeUi();
      }, Math.min(1000, remainingMs));
    }
  };

  const applySlowmodeCooldown = (durationMs = state.slowmodeMs) => {
    if (isSlowmodeBypassed()) return;
    const ms = Math.max(0, Number(durationMs || 0));
    if (!ms) {
      state.slowmodeUntil = 0;
      scheduleSlowmodeUi();
      return;
    }
    state.slowmodeUntil = Math.max(Number(state.slowmodeUntil || 0), Date.now() + ms);
    scheduleSlowmodeUi();
  };

  const parseSlowmodeRetryMs = (message) => {
    const match = String(message || '').match(/wait\s+(\d+)s/i);
    if (!match) return Math.max(0, Number(state.slowmodeMs || 0));
    return Math.max(0, Number(match[1] || 0) * 1000);
  };

  const refreshSlowmodeConfig = async () => {
    try {
      const data = await api('/api/network/moderation');
      const slowmodeMs = Math.max(0, Number(data?.slowmodeMs || 0));
      state.slowmodeMs = slowmodeMs;
      if (!slowmodeMs) state.slowmodeUntil = 0;
      scheduleSlowmodeUi();
      return slowmodeMs;
    } catch {
      scheduleSlowmodeUi();
      return state.slowmodeMs;
    }
  };

  const setJumpToLatestVisible = (visible) => {
    state.showJumpToLatest = !!visible;
    const btn = document.getElementById('jump-to-latest');
    if (!btn) return;
    btn.classList.toggle('hidden', !state.showJumpToLatest);
  };

  const showComposerNotice = (message, kind = 'success', durationMs = 3200) => {
    const box = document.getElementById('composer-notice');
    if (!box) return;
    box.textContent = String(message || '');
    box.classList.remove('hidden', 'notice-error', 'notice-success');
    box.classList.add(kind === 'error' ? 'notice-error' : 'notice-success');
    if (state.composerNoticeTimer) { clearTimeout(state.composerNoticeTimer); state.composerNoticeTimer = null; }
    if (durationMs > 0) state.composerNoticeTimer = setTimeout(() => { box.classList.add('hidden'); }, Number(durationMs));
  };

  const scrollChatToBottom = (behavior = 'auto') => {
    const root = getChatRoot();
    if (!root) return;
    root.scrollTo({ top: root.scrollHeight, behavior });
  };

  const syncAutoFollowFromScroll = () => {
    const root = getChatRoot();
    if (!root) return;
    state.autoFollow = isNearBottom(root);
    setJumpToLatestVisible(!state.autoFollow);
  };

  const clearChatRuntime = () => {
    if (state.pollTimer) { clearInterval(state.pollTimer); state.pollTimer = null; }
    if (state.metaTimer) { clearInterval(state.metaTimer); state.metaTimer = null; }
    if (state.composerNoticeTimer) { clearTimeout(state.composerNoticeTimer); state.composerNoticeTimer = null; }
    if (state.mentionTimeout) { clearTimeout(state.mentionTimeout); state.mentionTimeout = null; }
    if (state.slowmodeTimer) { clearTimeout(state.slowmodeTimer); state.slowmodeTimer = null; }
    if (state.roomEffectTimer) { clearTimeout(state.roomEffectTimer); state.roomEffectTimer = null; }
    if (state.flashbangCleanupTimer) {
      clearTimeout(state.flashbangCleanupTimer);
      state.flashbangCleanupTimer = null;
    }
    state.sendMessageInFlight = false;
    document.body.classList.remove('flashbang-active');
    document.body.style.removeProperty('--flashbang-duration');
    document.querySelector('.flashbang-overlay')?.remove();
  };

  const cleanupChatTimers = () => {
    leaveTypingRoom();
    clearChatRuntime();
  };

  const showToast = (message, opts = {}) => {
    const { isWarning = false } = opts;

    if (isWarning) {
      showModalWarning(message);
      return;
    }

    const div = document.createElement('div');
    div.className = 'toast-anim';
    div.textContent = message;
    toastHost.appendChild(div);
    setTimeout(() => div.remove(), 2800);
  };

  const showModalWarning = (message) => {
    if (document.getElementById('modal-warning-backdrop')) return;

    const backdrop = document.createElement('div');
    backdrop.id = 'modal-warning-backdrop';
    Object.assign(backdrop.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100vw',
      height: '100vh',
      background: 'rgba(0, 0, 0, 0.6)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      boxSizing: 'border-box',
      zIndex: '100000',
    });

    const modal = document.createElement('div');
    modal.id = 'modal-warning-modal';
    Object.assign(modal.style, {
      background: 'linear-gradient(135deg, rgba(22, 19, 57, 0.98), rgba(45, 27, 63, 0.98))',
      color: '#fff',
      fontFamily: 'Inter, system-ui, sans-serif',
      borderRadius: '1rem',
      padding: '1.5rem 1.75rem',
      maxWidth: 'min(90vw, 420px)',
      width: '100%',
      boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5)',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    });

    const text = document.createElement('div');
    text.style.fontSize = '1rem';
    text.style.lineHeight = '1.5';
    text.style.margin = '0';
    text.textContent = message;
    modal.appendChild(text);

    const actions = document.createElement('div');
    actions.style.display = 'flex';
    actions.style.justifyContent = 'flex-end';

    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.textContent = 'Dismiss';
    closeBtn.style.cssText = 'border:none;border-radius:0.5rem;padding:0.5rem 1rem;background:rgba(255,255,255,0.15);color:#fff;cursor:pointer;';
    closeBtn.addEventListener('click', () => backdrop.remove());
    actions.appendChild(closeBtn);

    modal.appendChild(actions);
    backdrop.appendChild(modal);
    document.body.appendChild(backdrop);
  };

  /* ========== DATA ========== */
  const resetLocalChatIdentity = ({ clearNickname = false } = {}) => {
    state.clientId = '';
    state.joinPromise = null;
    state.joinRoomKey = '';
    state.messagesPromise = null;
    state.messagesRoomKey = '';
    state.messagesFetchMode = '';
    localStorage.removeItem('tlkClientId');
    localStorage.removeItem('tlkParticipantToken');
    if (clearNickname) localStorage.removeItem('tlkNickname');
  };

  const resetChatViewState = () => {
    cleanupChatTimers();
    state.channels = [];
    state.currentChannel = null;
    state.messages = [];
    state.lastMessagesSignature = '';
    state.bannedMessage = '';
    state.autoFollow = true;
    state.showJumpToLatest = false;
    state.roomEffect = null;
    state.lastFlashbangKey = '';
    document.body.classList.remove('flashbang-active', 'flashbang-blur');
    document.body.style.removeProperty('--flashbang-duration');
    document.querySelector('.flashbang-overlay')?.remove();
  };

  const loadUser = async () => {
    if (!state.token) { applyUserSnapshot(null); return null; }
    try { return applyUserSnapshot(await api('/api/auth')); }
    catch { setToken(''); applyUserSnapshot(null); return null; }
  };

  const mapChannels = (networkData) => {
    const sites = networkData?.sites || [];
    const globalRoom = networkData?.globalRoom || 'nebulo5_4';
    return [
      { _id: 'global', room: globalRoom, name: '#global', type: 'public', isGlobal: true, onlineCount: 0 },
      ...sites.map((site) => ({
        _id: site.id, room: site.room, name: `#${site.name}`, site,
        type: 'group', isGlobal: false, onlineCount: 0
      }))
    ];
  };

  const refreshPresence = async () => {
    if (state.presencePromise) return state.presencePromise;
    state.presencePromise = (async () => {
      try {
        const data = await api('/api/network/presence');
        const counts = data?.rooms || {};
        state.channels = state.channels.map((c) => ({ ...c, onlineCount: Number(counts[c.room] || 0) }));
        const current = state.currentChannel;
        if (current) state.currentChannel = state.channels.find((c) => c._id === current._id) || current;

        const headerCount = document.getElementById('header-online-count');
        if (headerCount && state.currentChannel) {
          const count = Number(state.currentChannel.onlineCount || 0);
          headerCount.textContent = `${count} online`;
          headerCount.className = count > 0 ? 'header-online has-users' : 'header-online';
        }

        renderSidebar();
      } catch {}
    })();
    try {
      await state.presencePromise;
    } finally {
      state.presencePromise = null;
    }
  };

  const loadChannels = async () => {
    const networkData = await api('/api/network/sites');
    state.channels = mapChannels(networkData);
    await refreshPresence();
    return state.channels;
  };

  const getCurrentChannel = (channelId) =>
    state.channels.find((c) => c._id === channelId) || state.channels[0] || null;

  const joinRoom = async (channel) => {
    if (!channel) return;
    const roomKey = String(channel.room || '').trim();
    if (state.joinPromise && state.joinRoomKey === roomKey) return state.joinPromise;
    let nickname = String(state.user?.name || state.user?.username || localStorage.getItem('tlkNickname') || '').trim();
    if (!nickname) nickname = 'guest';
    state.joinRoomKey = roomKey;
    state.joinPromise = api(`/api/tlk/rooms/${encodeURIComponent(channel.room)}/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-tlk-client-id': getTlkClientId(), 'x-chat-device-id': getChatDeviceId() },
      body: { nickname }
    });
    const data = await state.joinPromise.finally(() => {
      if (state.joinRoomKey === roomKey) {
        state.joinPromise = null;
        state.joinRoomKey = '';
      }
    });
    if (data?.nickname) localStorage.setItem('tlkNickname', String(data.nickname));
    if (data?.token) localStorage.setItem('tlkParticipantToken', String(data.token));
    return data;
  };

  const fetchRoomEffect = async (channel) => {
    if (!channel?.room) {
      setRoomEffectState(null);
      return null;
    }
    try {
      const data = await api(`/api/chat-effects/rooms/${encodeURIComponent(channel.room)}`);
      if (data?.user) applyUserSnapshot(data.user);
      return setRoomEffectState(data?.roomEffect || null);
    } catch {
      return state.roomEffect;
    }
  };

  const notifyMentions = (msg, channel) => {
    const mentions = detectMentions(String(msg?.body || msg?.content || ''));
    const currentUsername = String(state.user?.name || state.user?.username || '').trim().toLowerCase();
    const isMentioned = mentions.some(m => m.toLowerCase() === currentUsername);

    if (currentUsername && isMentioned) {
      const notification = document.getElementById('mention-notification');
      if (notification && channel) {
        if (state.mentionTimeout) clearTimeout(state.mentionTimeout);

        notification.innerHTML = `
          <span>New mention in <strong>${channel.name}</strong> by <strong>${getUsername(msg)}</strong>: ${highlightMention(renderBody(msg.body || msg.content), currentUsername)}</span>
          <span id="mention-notification-close" title="Dismiss">✖</span>
        `;
        notification.classList.remove('hidden');

        notification.onclick = () => {
          navigate(`/channels/${channel._id}`);
          notification.classList.add('hidden');
        };

        document.getElementById('mention-notification-close').onclick = (e) => {
          e.stopPropagation();
          notification.classList.add('hidden');
        };

        state.mentionTimeout = setTimeout(() => {
          notification.classList.add('hidden');
        }, 3000);
      }
    }
  };

  const getMessages = async (channel, fetchNewOnly = false) => {
    if (!channel) return [];
    const roomKey = String(channel.room || '').trim();
    const requestMode = fetchNewOnly ? 'incremental' : 'full';
    if (state.messagesPromise && state.messagesRoomKey === roomKey && state.messagesFetchMode === requestMode) {
      return state.messagesPromise;
    }
    state.messagesRoomKey = roomKey;
    state.messagesFetchMode = requestMode;
    state.messagesPromise = (async () => {
      const headers = { 'x-tlk-client-id': getTlkClientId(), 'x-chat-device-id': getChatDeviceId() };
      let lastMessageId = '';
      if (fetchNewOnly) {
        for (let index = state.messages.length - 1; index >= 0; index -= 1) {
          const message = state.messages[index];
          const messageId = getMessageId(message);
          if (isIncrementalCursorMessage(message)) {
            lastMessageId = messageId;
            break;
          }
        }
      }

      const query = new URLSearchParams({ limit: '250' });
      const useIncrementalFetch = fetchNewOnly && !!lastMessageId;
      if (useIncrementalFetch) query.set('afterId', lastMessageId);

      const messages = await api(`/api/tlk/rooms/${encodeURIComponent(channel.room)}/messages?${query.toString()}`, { headers });
      if (state.currentChannel?._id !== channel._id) return [];
      const nextMessages = Array.isArray(messages) ? messages : [];
      const inferredRoomEffect = nextMessages.find((msg) => msg?.roomEffect)?.roomEffect || null;
      if (inferredRoomEffect || !useIncrementalFetch) setRoomEffectState(inferredRoomEffect);

      const hadBannedMessage = !!state.bannedMessage;
      state.bannedMessage = '';

      if (useIncrementalFetch) {
        const existingIds = new Set(state.messages.map((message) => getMessageId(message)).filter(Boolean));
        const uniqueNewMessages = nextMessages.filter((message) => {
          const messageId = getMessageId(message);
          return !messageId || !existingIds.has(messageId);
        });

        if (uniqueNewMessages.length > 0) {
          uniqueNewMessages.forEach((message) => notifyMentions(message, channel));
          state.messages = [...state.messages, ...uniqueNewMessages];
          state.lastMessagesSignature = getMessagesSignature(state.messages);
          renderMessages();
        } else if (hadBannedMessage) {
          renderMessages();
        }

        return state.messages;
      }

      const nextSignature = getMessagesSignature(nextMessages);
      const changed = nextSignature !== state.lastMessagesSignature;

      if (changed && nextMessages.length > 0) {
        const oldIds = new Set(state.messages.map(m => String(m.id || m._id || '')));
        const isInitialLoad = state.messages.length === 0;

        if (!isInitialLoad) {
          const newMessages = nextMessages.filter(m => {
            const id = String(m.id || m._id || '');
            return id && !oldIds.has(id);
          });

          for (const msg of newMessages) {
            notifyMentions(msg, channel);
          }
        }
      }

      state.messages = nextMessages;
      state.lastMessagesSignature = nextSignature;
      if (changed || hadBannedMessage) renderMessages();
      return state.messages;
    })();
    try {
      return await state.messagesPromise;
    } finally {
      if (state.messagesRoomKey === roomKey && state.messagesFetchMode === requestMode) {
        state.messagesPromise = null;
        state.messagesRoomKey = '';
        state.messagesFetchMode = '';
      }
    }
  };

  const fetchAlerts = async () => {
    if (state.alertsPromise) return state.alertsPromise;
    state.alertsPromise = (async () => {
      try {
        const alerts = await api('/api/network/alerts', {
          headers: { 'x-chat-device-id': getChatDeviceId(), 'x-tlk-participant-token': String(localStorage.getItem('tlkParticipantToken') || '') }
        });
        const list = alerts?.alerts;
        if (Array.isArray(list) && list.length > 0) {
          const lastAlert = list[list.length - 1];
          const isWarning = lastAlert?.type === 'warning' || /warned/i.test(lastAlert?.message || '');
          showToast(lastAlert?.message || 'Moderation notice', { isWarning });
        }
      } catch {}
    })();
    try {
      await state.alertsPromise;
    } finally {
      state.alertsPromise = null;
    }
  };

  const isMine = (msg) => {
    const senderUserId = String(msg?.userId || msg?.senderUserId || msg?.sender?.userId || '').trim();
    const currentUserId = String(state.user?._id || '').trim();
    const senderToken = String(msg?.user_token || msg?.senderId || msg?.sender?._id || '').trim();
    const localToken = String(localStorage.getItem('tlkParticipantToken') || '').trim();
    return !!((senderUserId && currentUserId && senderUserId === currentUserId) ||
              (senderToken && localToken && senderToken === localToken));
  };

  const canDelete = (msg) => {
    const role = String(state.user?.role || '').toLowerCase();
    return !msg?.deleted && (isMine(msg) || role === 'owner');
  };

  const getRank = (msg) => {
    const mine = isMine(msg);
    const msgRole = String(msg?.role || '').toLowerCase();
    const myRole = String(state.user?.role || '').toLowerCase();
    const role = mine ? (myRole || msgRole) : msgRole;
    if (role === 'owner') return { key: 'owner', label: 'Owner' };
    if (role === 'admin') return { key: 'admin', label: 'Admin' };
    return null;
  };

  const fmtTime = (msg) => {
    if (msg?.date) return new Date(msg.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (msg?.timestamp) return new Date(Number(msg.timestamp) * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return '';
  };

  const renderBody = (text) => {
    if (!text) return '';
    return esc(text).replace(/\n/g, '<br>');
  };

  const avatarColor = (name) => {
    const colors = [
      'linear-gradient(135deg,#7c69fa,#b29fff)',
      'linear-gradient(135deg,#4be8a0,#3ab8d0)',
      'linear-gradient(135deg,#e8b84b,#e87a4b)',
      'linear-gradient(135deg,#e84b9a,#9a4be8)',
      'linear-gradient(135deg,#4b9ee8,#4be8e8)',
      'linear-gradient(135deg,#e8724b,#e84b6a)',
    ];
    let h = 0;
    for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xffffffff;
    return colors[Math.abs(h) % colors.length];
  };

  const isDataUrl = (value) => /^data:/i.test(String(value || '').trim());

  const withAvatarVersion = (value) => {
    const baseUrl = String(value || '').trim();
    if (!baseUrl) return '';
    if (isDataUrl(baseUrl)) return baseUrl;
    const version = Number(state.avatarVersion || Date.now());
    return baseUrl.includes('?') ? `${baseUrl}&v=${version}` : `${baseUrl}?v=${version}`;
  };

  const getUserId = (msg) => {
    return String(msg?.userId || msg?.senderUserId || msg?.sender?.userId || '').trim();
  };

  const getUsername = (msg) => {
    return String(msg?.nickname || msg?.sender?.name || msg?.sender?.username || '').trim();
  };

  const formatMention = (username) => `@${username}`;

  const escapeRegex = (value) => String(value || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const highlightMention = (text, username) => {
    return text.replace(new RegExp(`@${escapeRegex(username)}\\b`, 'gi'), `<span class="mention">@${username}</span>`);
  };

  const detectMentions = (text) => {
    const mentionRegex = /@([a-zA-Z0-9_]+)/g;
    const matches = text.match(mentionRegex);
    return matches ? matches.map(m => m.slice(1)) : [];
  };

  const isMentioned = (msg, username) => {
    const mentions = detectMentions(String(msg?.body || msg?.content || ''));
    const target = String(username || '').toLowerCase();
    return mentions.some(m => m.toLowerCase() === target);
  };

  const addMentionListener = (msgEl, msg) => {
    const username = getUsername(msg);
    if (!username) return;

    const avatarEl = msgEl.querySelector('.msg-avatar');
    const nameEl = msgEl.querySelector('.msg-name');

    if (avatarEl) {
      avatarEl.addEventListener('mouseenter', () => {
        avatarEl.style.position = 'relative';
        const mentionTip = document.createElement('div');
        mentionTip.className = 'mention-tip';
        mentionTip.textContent = formatMention(username);
        mentionTip.style.cssText = `
          position: absolute;
          top: -20px;
          left: 50%;
          transform: translateX(-50%);
          background: var(--bg-card);
          color: var(--text-1);
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 11px;
          white-space: nowrap;
          border: 1px solid var(--border-md);
          z-index: 100;
        `;
        avatarEl.appendChild(mentionTip);
      });

      avatarEl.addEventListener('mouseleave', () => {
        const tip = avatarEl.querySelector('.mention-tip');
        if (tip) tip.remove();
      });
    }

    [avatarEl, nameEl].forEach(el => {
      if (!el) return;
      el.addEventListener('click', () => {
        const input = document.getElementById('chat-input');
        if (!input) return;
        const pos = input.selectionStart ?? input.value.length;
        const mentionText = formatMention(username);
        input.value = input.value.slice(0, pos) + (pos > 0 && input.value[pos - 1] !== ' ' ? ' ' : '') + mentionText + ' ' + input.value.slice(pos);
        const newPos = pos + (pos > 0 && input.value[pos - 1] !== ' ' ? 1 : 0) + mentionText.length + 1;
        input.selectionStart = input.selectionEnd = newPos;
        input.focus();
        renderCommandPanel(input.value);
      });
    });
  };

  /* ========== AUTH PAGES ========== */
  const renderLogin = () => {
    cleanupChatTimers();
    app.innerHTML = `
      <div class="auth-screen">
        <div class="auth-card">
          <div class="auth-logo">U</div>
          <h2>Welcome back</h2>
          <p class="auth-subtitle">Sign in to continue to UBG-chat by PrismX</p>
          <div id="auth-error" class="banner banner-error hidden" style="margin-bottom:16px"></div>
          <form id="login-form" class="form-stack">
            <div class="field">
              <label>Username</label>
              <input name="username" placeholder="Enter your username" required class="inp" autocomplete="username" />
            </div>
            <div class="field">
              <label>Password</label>
              <input name="password" type="password" placeholder="Enter your password" required class="inp" autocomplete="current-password" />
            </div>
            <button class="btn btn-primary btn-full" style="margin-top:4px" type="submit">Sign In</button>
          </form>
          <p style="text-align:center;font-size:13px;color:var(--text-3);margin-top:20px">
            No account? <a href="#/register" class="auth-link">Create one</a>
          </p>
        </div>
      </div>
    `;

    const form = document.getElementById('login-form');
    const errEl = document.getElementById('auth-error');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      errEl.classList.add('hidden');
      const fd = new FormData(form);
      const payload = { username: String(fd.get('username') || '').trim(), password: String(fd.get('password') || '') };
      try {
        const data = await api('/api/auth', { method: 'POST', body: payload });
        resetChatViewState();
        resetLocalChatIdentity({ clearNickname: true });
        setToken(data?.token || '');
        if (data?.user?.name) localStorage.setItem('tlkNickname', String(data.user.name));
        await loadUser();
        navigate('/channels/global');
      } catch (err) { errEl.textContent = err.message; errEl.classList.remove('hidden'); }
    });
  };

  const renderRegister = () => {
    cleanupChatTimers();
    app.innerHTML = `
      <div class="auth-screen">
        <div class="auth-card">
          <div class="auth-logo">U</div>
          <h2>Create account</h2>
          <p class="auth-subtitle">Join UBG-chat by PrismX today</p>
          <div id="auth-error" class="banner banner-error hidden" style="margin-bottom:16px"></div>
          <form id="register-form" class="form-stack">
            <div class="field">
              <label>Username</label>
              <input name="username" placeholder="Choose a username" required minlength="3" class="inp" autocomplete="username" />
            </div>
            <div class="field">
              <label>Display name <span style="color:var(--text-3);font-weight:400">(optional)</span></label>
              <input name="name" placeholder="How should we call you?" class="inp" />
            </div>
            <div class="field">
              <label>Password</label>
              <input name="password" type="password" placeholder="At least 6 characters" required minlength="6" class="inp" autocomplete="new-password" />
            </div>
            <div class="field">
              <label>Confirm password</label>
              <input name="password2" type="password" placeholder="Repeat your password" required minlength="6" class="inp" autocomplete="new-password" />
            </div>
            <button class="btn btn-primary btn-full" style="margin-top:4px" type="submit">Create Account</button>
          </form>
          <p style="text-align:center;font-size:13px;color:var(--text-3);margin-top:20px">
            Already have an account? <a href="#/login" class="auth-link">Sign in</a>
          </p>
        </div>
      </div>
    `;

    const form = document.getElementById('register-form');
    const errEl = document.getElementById('auth-error');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      errEl.classList.add('hidden');
      const fd = new FormData(form);
      const password = String(fd.get('password') || '');
      const password2 = String(fd.get('password2') || '');
      if (password !== password2) { errEl.textContent = 'Passwords do not match'; errEl.classList.remove('hidden'); return; }
      const payload = { username: String(fd.get('username') || '').trim(), name: String(fd.get('name') || '').trim(), password };
      try {
        const data = await api('/api/users', { method: 'POST', body: payload });
        resetChatViewState();
        resetLocalChatIdentity({ clearNickname: true });
        setToken(data?.token || '');
        if (data?.user?.name) localStorage.setItem('tlkNickname', String(data.user.name));
        await loadUser();
        navigate('/channels/global');
      } catch (err) { errEl.textContent = err.message; errEl.classList.remove('hidden'); }
    });
  };

  /* ========== LAYOUT, SIDEBAR, MESSAGES ========== */
  const layoutShell = (contentHtml, footerHtml = '') => {
    const isStaff = ['owner', 'admin'].includes(String(state.user?.role || '').toLowerCase());
    const displayName = esc(state.user?.name || state.user?.username || 'Guest');
    const sidebarAvatarSrc = withAvatarVersion(state.user?.avatar || '');
    const channelName = esc(state.currentChannel?.name?.replace(/^#/, '') || 'general');
    const roomEffectMeta = getRoomEffectMeta();
    const roomEffectLabel = getActiveRoomEffectId() === 'none'
      ? 'No room effect'
      : `${roomEffectMeta.name} live`;
    const coins = Math.max(0, Number(state.user?.coins || 0));
    const coinLabel = `${coins} coin${coins === 1 ? '' : 's'}`;

    app.innerHTML = `
      <div id="mention-notification" class="hidden"></div>
      <div class="shell">
        <aside class="sidebar">
          <div class="sidebar-header">
            <div class="sidebar-logo">U</div>
            <span class="sidebar-title">UBG-chat by PrismX</span>
          </div>
          <div class="sidebar-section-label">Direct Messages</div>
          <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin:10px 0 8px">
            <button id="btn-add-friend" class="btn btn-primary btn-sm" type="button">+ Add Friend</button>
          </div>
          <div id="sidebar-direct-messages" style="max-height:220px;overflow-y:auto;padding-bottom:8px"></div>
          <div class="sidebar-section-label">Channels</div>
          <div id="sidebar-channels" style="flex:1;overflow-y:auto;padding-bottom:8px"></div>
          <div class="sidebar-footer">
            <div class="footer-user" id="footer-user-profile">
              ${sidebarAvatarSrc
                ? `<div class="avatar sm sidebar-avatar-shell">
                    <img id="sidebar-avatar" data-role="sidebar-avatar" src="${esc(sidebarAvatarSrc)}" alt="${displayName}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;display:block" />
                  </div>`
                : `<div class="avatar sm sidebar-avatar-shell" style="background:var(--bg-raised);border:1px solid var(--border-md);color:var(--text-3);font-size:14px">👤</div>`
              }
              <div style="flex:1;min-width:0">
                <div style="font-size:13px;font-weight:600;color:var(--text-1);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${displayName}</div>
                <div style="font-size:11px;color:var(--text-3);display:flex;align-items:center;gap:5px">
                  <span class="status-dot status-online"></span>Online
                </div>
              </div>
            </div>
            <div class="footer-actions">
              <button id="btn-settings" class="icon-btn" title="Settings">
                <svg width="15" height="15" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"/></svg>
              </button>
              ${isStaff ? `<button id="btn-admin" class="icon-btn" title="Admin Panel">
                <svg width="15" height="15" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" clip-rule="evenodd"/></svg>
              </button>` : ''}
              <button id="btn-logout" class="icon-btn danger" title="Sign out">
                <svg width="15" height="15" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clip-rule="evenodd"/></svg>
              </button>
            </div>
          </div>
        </aside>

        <section class="main">
          <header class="main-header">
            <span class="main-header-hash">#</span>
            <div class="main-header-meta">
              <h2>${channelName}</h2>
              <div class="main-header-sub">
                <span class="room-effect-chip">
                  <span>Room FX</span>
                  <strong id="header-room-effect">${esc(roomEffectLabel)}</strong>
                </span>
              </div>
            </div>
            <div style="display:flex; align-items:center; gap:12px; margin-left:auto;">
              <span id="header-online-count" class="header-online">0 online</span>
              <span id="header-coins" class="coin-chip">${coinLabel}</span>
            </div>
          </header>
          <div id="main-content" style="flex:1;display:flex;flex-direction:column;overflow:hidden;position:relative">
            <div id="room-effect-stage" class="room-effect-stage"></div>
            ${contentHtml}
          </div>
          ${footerHtml}
        </section>
      </div>
    `;

    document.getElementById('btn-logout')?.addEventListener('click', () => {
      resetChatViewState();
      resetLocalChatIdentity({ clearNickname: true });
      setToken('');
      applyUserSnapshot(null);
      navigate('/login');
    });
    document.getElementById('btn-settings')?.addEventListener('click', () => navigate('/settings'));
    document.getElementById('btn-admin')?.addEventListener('click', () => navigate('/admin'));

    const footerUser = document.getElementById('footer-user-profile');
    if (footerUser) footerUser.addEventListener('click', () => navigate('/settings'));

    renderSidebar();
  };

  const renderSidebar = () => {
    const root = document.getElementById('sidebar-channels');
    if (!root) return;
    root.innerHTML = state.channels.map((c) => {
      const active = state.currentChannel?._id === c._id;
      const name = c.name?.replace(/^#/, '') || c._id;
      const count = Number(c.onlineCount || 0);
      const hasUsers = count > 0;
      return `
        <div class="channel-item ${active ? 'active' : ''}" data-channel-id="${esc(c._id)}">
          <span class="channel-hash">#</span>
          <span style="flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(name)}</span>
          <span class="online-pill ${hasUsers ? 'has-users' : ''}">
            <span class="online-pill-dot"></span>${count} online
          </span>
        </div>
      `;
    }).join('');
    root.querySelectorAll('[data-channel-id]').forEach((el) => {
      el.addEventListener('click', () => navigate(`/channels/${el.getAttribute('data-channel-id')}`));
    });

    const headerCount = document.getElementById('header-online-count');
    if (headerCount && state.currentChannel) {
      const count = Number(state.currentChannel.onlineCount || 0);
      headerCount.textContent = `${count} online`;
      headerCount.className = count > 0 ? 'header-online has-users' : 'header-online';
    }
  };

  const renderMessages = () => {
    const root = document.getElementById('chat-messages');
    if (!root) return;

    const wasNearBottom = isNearBottom(root);
    const prevScrollTop = root.scrollTop;
    const prevScrollHeight = root.scrollHeight;

    if (state.bannedMessage) {
      root.innerHTML = `<div class="msg-state" style="color:var(--danger)">${esc(state.bannedMessage)}</div>`;
      setJumpToLatestVisible(false);
      return;
    }

    if (!state.messages.length) {
      root.innerHTML = `<div class="msg-state">No messages yet — say something!</div>`;
      return;
    }

    let enteringIndex = 0;
    root.innerHTML = state.messages.map((m) => {
      const rank = getRank(m);
      const name = m?.nickname || m?.sender?.name || 'Unknown';
      const body = String(m?.body || m?.content || '');
      const avatarSrc = String(m?.avatar || m?.sender?.avatar || '').trim();
      const avatarL = String(name || 'U').trim().charAt(0).toUpperCase() || 'U';
      const id = String(m?.id || m?._id || '').trim();
      const token = String(m?.user_token || m?.senderId || '').trim();
      const isDeleted = !!m?.deleted;
      const mine = isMine(m);
      const isSystem = !!m?.system || String(name).trim().toLowerCase() === 'system';
      const shouldAnimate = !!id && !animatedMessageIds.has(id);
      const enterClass = shouldAnimate ? ' msg-enter' : '';
      const enterStyle = shouldAnimate ? ` style="--msg-enter-delay:${Math.min(enteringIndex++ * 42, 210)}ms"` : '';
      const bgStyle = `background:${avatarColor(name)}`;
      const effectId = isDeleted ? 'none' : getMessageEffect(m);
      const effectCls = effectId === 'none' ? '' : `effect-${effectId}`;

      const deleteBtn = canDelete(m)
        ? `<button data-delete-id="${esc(id)}" data-delete-token="${esc(token)}" class="delete-btn">Delete</button>`
        : '';
      const canCopyId = String(state.user?.role || '').toLowerCase() === 'owner';
      const userId = esc(getUserId(m));
      const copyIdBtn = canCopyId && userId
        ? `<button data-copy-id="${userId}" class="copy-id-btn" title="Copy user ID">Copy ID</button>`
        : '';
      const actionsHtml = (deleteBtn || copyIdBtn)
        ? `<div class="msg-actions">${deleteBtn}${copyIdBtn}</div>`
        : '';

      const rankHtml = rank
        ? `<span class="rank-chip rank-${rank.key}">${esc(rank.label)}</span>`
        : '';

      let formattedBody = renderBody(body);
      if (!isDeleted) {
        const myUsername = String(state.user?.name || state.user?.username || '').trim();
        if (myUsername && isMentioned(m, myUsername)) {
          formattedBody = highlightMention(renderBody(body), myUsername);
        }
      }

      return `
        <div class="msg ${mine ? 'mine' : ''} ${isDeleted ? 'deleted' : ''} ${isSystem ? 'system-note' : ''}${enterClass}"${enterStyle}>
          <div class="msg-avatar" style="${bgStyle}" data-username="${esc(isSystem ? '' : name)}" data-user-id="${esc(getUserId(m))}">
            ${avatarSrc ? `<img src="${esc(avatarSrc)}" alt="${esc(name)}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;display:block" />` : esc(avatarL)}
          </div>
          <div class="msg-body">
            <div class="msg-head">
              <strong class="msg-name ${effectCls}" data-username="${esc(isSystem ? '' : name)}" data-user-id="${esc(getUserId(m))}">${esc(isSystem ? 'System' : name)}</strong>
              ${rankHtml}
              <span>${esc(fmtTime(m))}</span>
            </div>
            <div class="msg-bubble ${effectCls}">${isDeleted ? '<em>Message deleted</em>' : formattedBody}</div>
            ${actionsHtml}
          </div>
        </div>
      `;
    }).join('');

    state.messages.forEach((m) => {
      const id = String(m?.id || m?._id || '').trim();
      if (id) animatedMessageIds.add(id);
    });

    root.querySelectorAll('.msg').forEach((msgEl, index) => {
      if (index < state.messages.length) addMentionListener(msgEl, state.messages[index]);
    });

    root.querySelectorAll('[data-delete-id]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const id = String(btn.getAttribute('data-delete-id') || '').trim();
        const senderToken = String(btn.getAttribute('data-delete-token') || '').trim();
        if (!id || !state.currentChannel) return;
        try {
          await api(`/api/tlk/rooms/${encodeURIComponent(state.currentChannel.room)}/messages/${encodeURIComponent(id)}/delete`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-tlk-client-id': getTlkClientId(), 'x-chat-device-id': getChatDeviceId() },
            body: { senderToken }
          });
        } catch {
          await api(`/api/network/messages/${encodeURIComponent(id)}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: { senderToken, callerToken: String(localStorage.getItem('tlkParticipantToken') || '') }
          }).catch(() => {});
        }
        if (state.currentChannel) await getMessages(state.currentChannel).catch(() => {});
      });
    });

    root.querySelectorAll('[data-copy-id]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const userId = String(btn.getAttribute('data-copy-id') || '').trim();
        if (!userId) return;
        try {
          await navigator.clipboard.writeText(userId);
          showToast('User ID copied');
        } catch {
          const textArea = document.createElement('textarea');
          textArea.value = userId;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          textArea.remove();
          showToast('User ID copied');
        }
      });
    });

    if (state.autoFollow || wasNearBottom) {
      state.autoFollow = true;
      setJumpToLatestVisible(false);
      scrollChatToBottom('auto');
      return;
    }
    root.scrollTop = prevScrollTop + Math.max(0, root.scrollHeight - prevScrollHeight);
    setJumpToLatestVisible(true);
  };

  /* ========== MESSAGING ========== */
  const sendMessage = async (text) => {
    if (!state.currentChannel) return;
    const trimmed = String(text || '').trim();
    if (!trimmed) return;
    if (state.sendMessageInFlight) {
      throw new Error('Message is still sending.');
    }
    const slowmodeRemainingMs = getSlowmodeRemainingMs();
    if (slowmodeRemainingMs > 0) {
      scheduleSlowmodeUi();
      throw new Error(`Slowmode active. Wait ${Math.ceil(slowmodeRemainingMs / 1000)}s before sending another message.`);
    }

    const channel = state.currentChannel;
    stopLocalTyping(channel.room);
    const body = trimmed;
    state.sendMessageInFlight = true;
    scheduleSlowmodeUi();

    const optimisticMsg = {
      _id: 'temp-' + Date.now(),
      nickname: String(localStorage.getItem('tlkNickname') || state.user?.name || state.user?.username || 'You').trim(),
      avatar: state.user?.avatar || null,
      body: body,
      date: new Date().toISOString(),
      userId: state.user?._id || '',
      role: state.user?.role || 'user',
      equippedEffect: normalizeEffectId(state.user?.equippedEffect)
    };
    state.messages.push(optimisticMsg);
    renderMessages();

    const postMsg = () => api(`/api/tlk/rooms/${encodeURIComponent(channel.room)}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-tlk-client-id': getTlkClientId(), 'x-chat-device-id': getChatDeviceId() },
      body: { body }
    });

    try {
      let sent;
      try {
        sent = await postMsg();
      } catch (err) {
        state.messages = state.messages.filter(m => m._id !== optimisticMsg._id);
        renderMessages();
        if (err.status === 401) {
          resetLocalChatIdentity();
          await joinRoom(channel);
          sent = await postMsg();
        } else if (err.status === 429) {
          applySlowmodeCooldown(parseSlowmodeRetryMs(err.message));
          throw err;
        } else {
          throw err;
        }
      }
      if (sent?.reward?.balance !== undefined && state.user) {
        state.user = { ...state.user, coins: Math.max(0, Number(sent.reward.balance || 0)) };
        updateCoinDisplays();
      }
      const realtimeMessage = { ...sent, roomId: channel.room };
      upsertRealtimeMessage(realtimeMessage, { replaceOptimistic: true });
      applySlowmodeCooldown(state.slowmodeMs);
    } catch (err) {
      state.messages = state.messages.filter(m => m._id !== optimisticMsg._id);
      renderMessages();
      throw err;
    } finally {
      state.sendMessageInFlight = false;
      scheduleSlowmodeUi();
    }
  };

  const postModerationNote = async (room, text) => {
    if (!room || !text) return;
    try { await api(`/api/tlk/rooms/${encodeURIComponent(room)}/moderation-note`, { method: 'POST', body: { text } }); } catch {}
  };

  const runSlashCommand = async (rawText) => {
    const text = String(rawText || '').trim();
    if (!text.startsWith('/')) return false;

    const [command, ...parts] = text.split(/\s+/);
    const cmd = String(command || '').toLowerCase();
    const room = String(state.currentChannel?.room || '').trim();
    const role = String(state.user?.role || '').toLowerCase();
    const hasModRole = role === 'owner' || role === 'admin';

    if (cmd === '/help') { showComposerNotice('Commands: /ai /global /warn /ban /banfromall /unban /clearwarns /slowmode /clearchat', 'success', 4000); return true; }

    if (cmd === '/global') {
      if (role !== 'owner') { showComposerNotice('Only owner can use /global', 'error', 3500); return true; }
      const effectId = String(parts[0] || '').trim().toLowerCase();
      if (!effectId) { showComposerNotice('Usage: /global <effectId>', 'error', 3500); return true; }
      const effectMeta = getEffectMeta(effectId);
      if (effectMeta.id === 'none') { showComposerNotice(`Unknown global effect: ${effectId}`, 'error', 3500); return true; }
      try {
        const data = await api('/api/chat-effects/global/activate', { method: 'POST', body: { effectId: effectMeta.id } });
        if (data?.user) applyUserSnapshot(data.user);
        showComposerNotice(data?.msg || `${effectMeta.name} activated globally`, 'success', 3600);
      } catch (err) {
        showComposerNotice(err.message || 'Failed to activate global effect', 'error', 4200);
      }
      return true;
    }

    if (cmd === '/ai') {
      const siteId = String(parts[0] || '').toLowerCase();
      const prompt = String(parts.slice(1).join(' ') || '').trim();
      if (!siteId || !prompt) { showComposerNotice('Usage: /ai <siteId> <prompt>', 'error', 3500); return true; }
      const ai = await api('/api/network/ai/summon', { method: 'POST', body: { siteId, prompt } });
      const aiText = String(ai?.response || '').trim();
      if (!aiText) { showComposerNotice('AI returned empty response', 'error', 3200); return true; }
      await sendMessage(`[${siteId} AI] ${aiText}`);
      return true;
    }

    const modActions = new Set(['/warn', '/ban', '/banfromall', '/unban', '/clearwarns', '/slowmode', '/clearchat']);
    if (!modActions.has(cmd)) { showComposerNotice(`Unknown command: ${cmd}`, 'error', 3200); return true; }
    if (!hasModRole) { showComposerNotice('Only owner/admin can use moderation commands', 'error', 3500); return true; }
    if (cmd === '/clearchat' && role !== 'owner') { showComposerNotice('Only owner can use /clearchat', 'error', 3500); return true; }
    if (cmd !== '/slowmode' && !room) { showComposerNotice('No active room selected', 'error', 3200); return true; }

    if (cmd === '/slowmode') {
      const seconds = Number(parts[0]);
      if (!Number.isFinite(seconds) || seconds < 0) {
        showComposerNotice('Usage: /slowmode <seconds>', 'error', 3800);
        return true;
      }
      const actionResult = await api('/api/network/mod/actions', {
        method: 'POST',
        body: { action: 'slowmode', target: '__slowmode__', seconds }
      });
      const slowmodeSeconds = Math.max(0, Number(actionResult?.slowmodeSeconds || 0));
      state.slowmodeMs = slowmodeSeconds * 1000;
      if (!state.slowmodeMs) state.slowmodeUntil = 0;
      scheduleSlowmodeUi();
      if (room) {
        const actor = state.user?.name || state.user?.username || 'Moderation';
        await postModerationNote(room, `Moderation: ${actor} set global slowmode to ${slowmodeSeconds}s.`);
        if (state.currentChannel?.room === room) await getMessages(state.currentChannel).catch(() => {});
      }
      showComposerNotice(
        slowmodeSeconds > 0 ? `Global slowmode set to ${slowmodeSeconds}s` : 'Global slowmode disabled',
        'success',
        3200
      );
      return true;
    }

    if (cmd === '/clearchat') {
      const reason = String(parts.join(' ') || 'Owner cleared room').trim();
      await api('/api/network/mod/actions', { method: 'POST', body: { action: 'clearchat', target: '__room__', reason, room } });
      await postModerationNote(room, `Moderation: ${state.user?.name || state.user?.username || 'Owner'} cleared this room.`);
      if (state.currentChannel?.room === room) await getMessages(state.currentChannel);
      showComposerNotice('Chat cleared', 'success', 3000);
      return true;
    }

    const target = String(parts[0] || '').trim();
    const reason = String(parts.slice(1).join(' ') || 'Moderator action').trim();
    if (!target) { showComposerNotice(`Usage: ${cmd} <target> ${cmd === '/unban' || cmd === '/clearwarns' ? '' : '<reason>'}`.trim(), 'error', 3800); return true; }

    const action = cmd.slice(1);
    const actionResult = await api('/api/network/mod/actions', { method: 'POST', body: { action, target, reason, room } });
    const targetDisplay = String(actionResult?.targetDisplay || target);

    const noteMap = {
      warn: `Moderation: ${targetDisplay} was warned.`,
      ban: `Moderation: ${targetDisplay} was banned from this server.`,
      banfromall: `Moderation: ${targetDisplay} was globally banned.`,
      unban: `Moderation: ${targetDisplay} was unbanned.`,
      clearwarns: `Moderation: warnings were cleared for ${targetDisplay}.`
    };
    if (noteMap[action]) await postModerationNote(room, noteMap[action]);

    showComposerNotice(`${cmd} applied`, 'success', 3000);
    if (state.currentChannel?.room === room) await getMessages(state.currentChannel).catch(() => {});
    return true;
  };

  /* ========== RENDER CHAT PAGE ========== */
  const renderChatPage = async (channelId) => {
    const previousRoomId = String(state.currentChannel?.room || '').trim();
    if (!state.channels.length) await loadChannels();
    state.currentChannel = getCurrentChannel(channelId);
    const currentRoomId = String(state.currentChannel?.room || '').trim();
    if (previousRoomId && previousRoomId !== currentRoomId) leaveTypingRoom(previousRoomId);
    else {
      stopLocalTyping(previousRoomId);
      clearRemoteTypingUsers();
    }
    animatedMessageIds = new Set();
    state.lastMessagesSignature = '';
    state.routeNonce += 1;
    const routeNonce = state.routeNonce;
    await fetchRoomEffect(state.currentChannel);

    const channelName = esc(state.currentChannel?.name?.replace(/^#/, '') || 'general');

    layoutShell(
      `<div id="chat-messages"></div>
       <button id="jump-to-latest" class="hidden" type="button">
         <svg width="13" height="13" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
         Jump to latest
       </button>`,
      `<div class="composer">
        <div class="composer-toolbar">
          <div class="composer-toolbar-copy">
            <div class="composer-toolbar-title">Room Chat</div>
            <div id="composer-room-effect" class="composer-room-effect">${esc(getActiveRoomEffectId() === 'none' ? 'No room effect active' : `${getRoomEffectMeta().name} active for this room`)}</div>
          </div>
          <div id="room-effects-balance" class="coin-chip">${Math.max(0, Number(state.user?.coins || 0))} coin${Number(state.user?.coins || 0) === 1 ? '' : 's'}</div>
        </div>
        <div id="command-panel" class="hidden"></div>
        <div id="composer-notice" class="hidden"></div>
        <div class="composer-box">
          <div id="typing-indicator" class="typing-indicator hidden" aria-live="polite"></div>
          <form id="chat-form" class="composer-form">
            <textarea id="chat-input" rows="1" placeholder="Message #${channelName}" class="composer-textarea" spellcheck="true" autocomplete="off"></textarea>
            <div style="display:flex;gap:2px;align-items:flex-end;flex-shrink:0">
              <div style="position:relative">
                <button type="button" id="effects-btn" class="composer-effect-btn" title="Room effects" aria-label="Open room effects">✦</button>
              </div>
              <div style="position:relative">
                <button type="button" id="emoji-btn" class="composer-emoji-btn" title="Emoji & special characters" aria-label="Open emoji picker">😊</button>
              </div>
              <button type="submit" class="composer-send" aria-label="Send">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              </button>
            </div>
          </form>
          <div id="composer-hint" class="composer-hint">Enter to send · Shift+Enter for new line · / for commands</div>
        </div>
      </div>`
    );

    state.autoFollow = true;
    setJumpToLatestVisible(false);
    renderRoomEffectStage();
    renderTypingIndicator();
    void joinTypingRoom(state.currentChannel?.room);

    // Focus textarea when clicking anywhere inside composer box
    const composerBox = document.querySelector('.composer-box');
    const textarea = document.getElementById('chat-input');
    if (composerBox && textarea) {
      composerBox.addEventListener('click', (e) => {
        if (e.target === textarea) return;
        if (e.target.closest('button')) return;
        textarea.focus();
      });
    }
    scheduleSlowmodeUi();
    void refreshSlowmodeConfig();

    document.getElementById('chat-messages')?.addEventListener('scroll', syncAutoFollowFromScroll, { passive: true });
    document.getElementById('jump-to-latest')?.addEventListener('click', () => {
      state.autoFollow = true;
      setJumpToLatestVisible(false);
      scrollChatToBottom('smooth');
    });

    if (!state.currentChannel) {
      document.getElementById('chat-messages').innerHTML =
        '<div class="msg-state" style="color:var(--danger)">No channels available.</div>';
      return;
    }
    document.getElementById('chat-messages').innerHTML = '<div class="msg-state">Loading messages…</div>';

    document.getElementById('chat-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const input = document.getElementById('chat-input');
      const text = input.value;
      input.value = '';
      input.style.height = '';
      renderCommandPanel('');
      stopLocalTyping(state.currentChannel?.room);
      try {
        const handled = await runSlashCommand(text);
        if (handled) return;
        await sendMessage(text);
      } catch (err) { showComposerNotice(err.message || 'Failed to send', 'error', 4200); }
    });

    document.getElementById('chat-input')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); document.getElementById('chat-form')?.requestSubmit(); }
    });
    document.getElementById('chat-input')?.addEventListener('input', (e) => {
      const value = e.target?.value || '';
      renderCommandPanel(value);
      syncLocalTyping(value);
    });
    document.getElementById('chat-input')?.addEventListener('blur', () => {
      stopLocalTyping(state.currentChannel?.room);
    });

    // Emoji picker (full data included)
    const EMOJI_DATA = [
      { label: 'Smileys', emojis: ['😀','😁','😂','🤣','😃','😄','😅','😆','😇','😉','😊','😋','😌','😍','🥰','😘','😗','😙','😚','😜','😝','😛','🤑','🤗','🤭','🤫','🤔','🤐','🤨','😐','😑','😶','😏','😒','🙄','😬','🤥','😔','😪','🤤','😴','😷','🤒','🤕','🤢','🤧','🥵','🥶','🥴','😵','🤯','🤠','🥳','😎','🤓','🧐','😕','😟','🙁','☹️','😮','😯','😲','😳','🥺','😦','😧','😨','😰','😥','😢','😭','😱','😖','😣','😞','😓','😩','😫','🥱','😤','😡','😠','🤬','😈','👿'] },
      { label: 'Gestures', emojis: ['👋','🤚','🖐','✋','🖖','👌','🤌','🤏','✌️','🤞','🤟','🤘','🤙','👈','👉','👆','🖕','👇','☝️','👍','👎','✊','👊','🤛','🤜','👏','🙌','👐','🤲','🤝','🙏','✍️','💅','🤳','💪','🦾','🦵','🦶','👂','🦻','👃','🫀','🫁','🧠','🦷','🦴','👀','👁','👅','👄'] },
      { label: 'People', emojis: ['👶','🧒','👦','👧','🧑','👱','👨','🧔','👩','🧓','👴','👵','🙍','🙎','🙅','🙆','💁','🙋','🧏','🙇','🤦','🤷','👮','🕵️','💂','🥷','👷','🤴','👸','👳','👲','🧕','🤵','👰','🤰','👩‍🍼','👨‍🍼','🎅','🤶','🧙','🧝','🧛','🧟','🧞','🧜','🧚','👼','🤺','🏇','⛷️','🏂','🏋️','🤼','🤸','🤺','🏊','🏄','🚴','🧘'] },
      { label: 'Animals', emojis: ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐮','🐷','🐸','🐵','🐔','🐧','🐦','🐤','🦆','🦅','🦉','🦇','🐺','🐗','🐴','🦄','🐝','🪱','🐛','🦋','🐌','🐞','🐜','🪲','🦟','🦗','🕷','🦂','🐢','🦎','🐍','🐲','🦕','🦖','🦦','🦈','🐬','🐳','🐋','🦭','🐟','🐠','🐡','🦐','🦞','🦀','🦑','🐙','🦪','🐚','🐌','🦔','🌸','🌺','🌼','🌻','🌹','🌷'] },
      { label: 'Food', emojis: ['🍎','🍊','🍋','🍇','🍓','🫐','🍈','🍒','🍑','🥭','🍍','🥥','🥝','🍅','🫒','🥑','🍆','🥦','🥬','🌶️','🫑','🧄','🧅','🥔','🍠','🥐','🥯','🍞','🥖','🧀','🥚','🍳','🧈','🥞','🧇','🥓','🌮','🌯','🥙','🧆','🥚','🍜','🍱','🍣','🍛','🍲','🥘','🫕','🍝','🍢','🦪','🍦','🎂','🍰','🧁','🍩','🍪','🍫','🍬','🍭','🧃','🥤','☕','🫖','🍵','🧋','🍺','🍸','🍹','🥂'] },
      { label: 'Travel', emojis: ['🚗','🚕','🚙','🚌','🚎','🏎️','🚓','🚑','🚒','🚐','🛻','🚚','🚛','🚜','🛵','🏍️','🛺','🚲','🛴','🛹','🚏','🚦','🛣️','⛽','✈️','🛫','🛬','🛩️','💺','🚁','🚟','🚠','🚡','🛰️','🚀','🛸','🏠','🏡','🏢','🏣','🏤','🏥','🏦','🏨','🏩','🏪','🏫','🏬','🏭','🏯','🏰','🗺️','🗼','🗽','🗾','🌋','⛰️','🏕️','🏖️','🏜️','🏝️','🏞️','🌅','🌄','🌠','🎇','🎆'] },
      { label: 'Objects', emojis: ['⌚','📱','💻','⌨️','🖥️','🖨️','🖱️','🖲️','🕹️','💾','💿','📀','📷','📸','📹','📽️','🎥','📞','📟','📺','📻','🧭','⏱️','⏰','🕰️','⌛','⏳','📡','🔋','🪫','🔌','💡','🔦','🕯️','🔍','🔬','🔭','📡','💊','🩺','🩸','🩹','🩼','🦽','🦯','🪄','🎩','🪣','🔑','🗝️','🔓','🔒','🔨','🪓','⛏️','⚒️','🛠️','🗡️','⚔️','🛡️','🪚','🔧','🪛','🔩','⚙️','🗜️','🪤','🧲','🪝'] },
      { label: 'Symbols', emojis: ['❤️','🧡','💛','💚','💙','💜','🖤','🤍','🤎','💔','❣️','💕','💞','💓','💗','💖','💘','💝','💟','☮️','✝️','☪️','🕉️','✡️','🔯','🕎','☯️','☦️','🛐','⛎','♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓','🆔','⚛️','🉑','☢️','☣️','📴','📳','🈶','🈚','🈸','🈺','🈷️','✴️','🆚','💮','🉐','㊙️','㊗️','🈴','🈵','🈹','🈲','🅰️','🅱️','🆎','🆑','🅾️','🆘','❌','⭕','🛑','⛔','📛','🚫','💯','💢','♨️','🚷','🚯','🚳','🚱','🔞','📵','🚭','❗','❕','❓','❔','‼️','⁉️','🔅','🔆','〽️','⚠️','🚸','🔱','⚜️','🔰','♻️','✅','🈯','💹','❎','🌐','💠','Ⓜ️','🌀','💤','🏧','🚾','♿','🅿️','🛗','🈳','🈂️','🛂','🛃','🛄','🛅','🚹','🚺','🚼','⚧️','🚻','🚮','🎦','📶','🈁','🔣','ℹ️','🔤','🔡','🔠','🆙','🆒','🆕','🆓','0️⃣','1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣','🔟','🔢','#️⃣','*️⃣','▶️','⏸️','⏹️','⏺️','⏭️','⏮️','⏩','⏪','⏫','⏬','◀️','🔼','🔽','➡️','⬅️','⬆️','⬇️','↗️','↘️','↙️','↖️','↕️','↔️','↩️','↪️','⤴️','⤵️','🔀','🔁','🔂','🔄','🔃','🎵','🎶','➕','➖','➗','✖️','♾️','💲','💱','™️','©️','®️','〰️','➰','➿','🔚','🔙','🔛','🔝','🔜','✔️','☑️','🔘','🔴','🟠','🟡','🟢','🔵','🟣','⚫','⚪','🟤','🔺','🔻','🔷','🔶','🔹','🔸','🔳','🔲','▪️','▫️','◾','◽','◼️','◻️','🟥','🟧','🟨','🟩','🟦','🟪','⬛','⬜','🟫','🔈','🔇','🔉','🔊','🔔','🔕','📣','📢','👁️‍🗨️','💬','💭','🗯️','♠️','♣️','♥️','♦️','🃏','🀄','🎴'] },
      { label: 'Flags', emojis: ['🏁','🚩','🎌','🏴','🏳️','🏳️‍🌈','🏳️‍⚧️','🏴‍☠️','🇺🇸','🇬🇧','🇨🇦','🇦🇺','🇩🇪','🇫🇷','🇯🇵','🇨🇳','🇰🇷','🇷🇺','🇧🇷','🇮🇳','🇮🇹','🇪🇸','🇲🇽','🇳🇱','🇸🇦','🇸🇪','🇳🇴','🇩🇰','🇵🇱','🇺🇦'] },
    ];

    const setupEmojiPicker = () => {
      const btn = document.getElementById('emoji-btn');
      const input = document.getElementById('chat-input');
      if (!btn || !input) return;

      let pickerEl = null;
      let open = false;
      let documentMouseDownListener = null;

      const closePicker = () => {
        if (pickerEl) { pickerEl.remove(); pickerEl = null; }
        if (documentMouseDownListener) {
          document.removeEventListener('mousedown', documentMouseDownListener, { capture: true });
          documentMouseDownListener = null;
        }
        open = false;
      };

      const buildPicker = () => {
        const el = document.createElement('div');
        el.className = 'emoji-picker-popover';

        const search = document.createElement('input');
        search.className = 'emoji-picker-search';
        search.placeholder = 'Search emoji…';
        search.setAttribute('spellcheck', 'false');
        el.appendChild(search);

        const gridContainer = document.createElement('div');
        el.appendChild(gridContainer);

        const renderEmojis = (query) => {
          gridContainer.innerHTML = '';
          const q = query.toLowerCase().trim();
          for (const section of EMOJI_DATA) {
            const filtered = section.emojis.filter(e => !q || e.includes(q) || section.label.toLowerCase().includes(q));
            if (!filtered.length) continue;
            const label = document.createElement('div');
            label.className = 'emoji-section-label';
            label.textContent = section.label;
            gridContainer.appendChild(label);
            const grid = document.createElement('div');
            grid.className = 'emoji-grid';
            for (const emoji of filtered) {
              const b = document.createElement('button');
              b.type = 'button';
              b.className = 'emoji-btn';
              b.textContent = emoji;
              b.title = emoji;
              b.addEventListener('click', () => {
                const pos = input.selectionStart ?? input.value.length;
                input.value = input.value.slice(0, pos) + emoji + input.value.slice(pos);
                input.selectionStart = input.selectionEnd = pos + [...emoji].length;
                input.focus();
                renderCommandPanel(input.value);
              });
              grid.appendChild(b);
            }
            gridContainer.appendChild(grid);
          }
        };

        renderEmojis('');
        search.addEventListener('input', () => renderEmojis(search.value));
        el.addEventListener('mousedown', (e) => e.stopPropagation());
        return el;
      };

      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (open) { closePicker(); return; }
        open = true;
        pickerEl = buildPicker();
        btn.parentElement.appendChild(pickerEl);
        pickerEl.style.bottom = 'calc(100% + 8px)';
        pickerEl.style.right = '0';
        pickerEl.style.zIndex = '5000';

        if (!documentMouseDownListener) {
          documentMouseDownListener = (event) => {
            if (!open) return;
            const wrapper = btn.parentElement;
            if (wrapper && wrapper.contains(event.target)) return;
            closePicker();
          };
          document.addEventListener('mousedown', documentMouseDownListener, { capture: true });
        }
      });
    };

    setupEmojiPicker();

    const setupEffectsPicker = () => {
      const btn = document.getElementById('effects-btn');
      if (!btn) return;
      let popoverEl = null;
      let open = false;

      const closePicker = () => {
        if (popoverEl && popoverEl.parentNode) popoverEl.parentNode.removeChild(popoverEl);
        popoverEl = null;
        open = false;
      };

      const activateRoomEffect = async (effectId) => {
        if (!state.currentChannel?.room) return;
        const data = await api(`/api/chat-effects/rooms/${encodeURIComponent(state.currentChannel.room)}/activate`, {
          method: 'POST',
          body: { effectId }
        });
        if (data?.user) applyUserSnapshot(data.user);
        setRoomEffectState(data?.roomEffect || null);
        if (data?.systemMessage) {
          upsertRealtimeMessage({ ...data.systemMessage, roomId: state.currentChannel.room });
        } else {
          const triggerName = String(data?.roomEffect?.triggeredByName || state.user?.name || state.user?.username || 'Someone').trim();
          const effectName = String(data?.effect?.name || getEffectMeta(effectId).name || 'effect').trim();
          const effectPrice = Math.max(0, Number(data?.effect?.price || getEffectMeta(effectId).price || 0));
          const fallbackSystemMessage = buildLocalSystemMessage(
            `${triggerName} activated the ${effectName} room effect for ${effectPrice} coin${effectPrice === 1 ? '' : 's'}.`,
            state.currentChannel.room,
            data?.roomEffect?.activatedAt || Date.now()
          );
          upsertRealtimeMessage(fallbackSystemMessage);
        }
        renderMessages();
        showComposerNotice(data?.msg || 'Room effect activated', 'success', 3600);
        closePicker();
        await getMessages(state.currentChannel).catch(() => {});
      };

      const activateGlobalEffectLocal = async (effectId) => {
        const data = await api('/api/chat-effects/global/activate', {
          method: 'POST',
          body: { effectId }
        });
        if (data?.user) applyUserSnapshot(data.user);
        handleGlobalEffect({ effectId });
        showComposerNotice(data?.msg || 'Global effect activated', 'success', 3600);
        closePicker();
      };

      const buildPicker = () => {
        const el = document.createElement('div');
        el.className = 'effects-picker-popover';
        const activeRoomEffectId = getActiveRoomEffectId();
        const activeMeta = getRoomEffectMeta();
        const activeTrigger = state.roomEffect?.triggeredByName
          ? `Triggered by ${state.roomEffect.triggeredByName}`
          : 'No room effect is active right now';
        el.innerHTML = `
          <div class="effects-picker-head">
            <div>
              <strong>Room Effects</strong>
              <span>Everyone in #${channelName} sees the active effect.</span>
            </div>
            <div class="coin-chip" id="effects-picker-balance">${esc(`${Math.max(0, Number(state.user?.coins || 0))} coin${Number(state.user?.coins || 0) === 1 ? '' : 's'}`)}</div>
          </div>
          <div class="effects-picker-card ${activeRoomEffectId !== 'none' ? 'active' : ''}" style="margin-bottom:10px">
            <div class="effects-picker-line">
              <div class="effects-picker-name">Live Now</div>
              <div class="effects-picker-price">${esc(activeRoomEffectId === 'none' ? 'NONE' : activeMeta.name.toUpperCase())}</div>
            </div>
            <div class="effects-picker-trigger">${esc(activeTrigger)}</div>
          </div>
          <div style="margin-bottom: 15px;">
            <strong style="color: var(--text-1); font-size: 14px; margin-bottom: 8px; display: block;">Room Effects</strong>
            <div class="effects-picker-grid">
              ${fallbackEffects
                .filter((effect) => effect.id !== 'none' && effect.id !== 'duck')
                .map((effect) => {
                  const effectId = normalizeEffectId(effect.id);
                  const active = effectId === activeRoomEffectId;
                  const canAfford = Math.max(0, Number(state.user?.coins || 0)) >= Math.max(0, Number(effect.price || 0));
                  return `
                    <div class="effects-picker-card ${active ? 'active' : ''}">
                      <div class="effects-picker-line">
                        <div class="effects-picker-name">${esc(effect.name)}</div>
                        <div class="effects-picker-price">${esc(`${Math.max(0, Number(effect.price || 0))} COINS`)}</div>
                      </div>
                      <div class="effects-picker-desc">${esc(effect.description)}</div>
                      <div class="effect-preview effect-${effectId}">Room-wide preview for ${esc(effect.name)}</div>
                      <button type="button" class="btn btn-primary btn-sm" data-room-effect-id="${esc(effectId)}" ${active || !canAfford ? 'disabled' : ''}>
                        ${esc(active ? 'Active now' : canAfford ? `Activate for ${effect.price}c` : 'Need more coins')}
                      </button>
                    </div>
                  `;
                }).join('')}
            </div>
          </div>
          <div>
            <strong style="color: var(--text-1); font-size: 14px; margin-bottom: 8px; display: block;">Global Effects</strong>
            <div class="effects-picker-grid">
              ${fallbackEffects
                .filter((effect) => effect.id === 'duck')
                .map((effect) => {
                  const effectId = normalizeEffectId(effect.id);
                  const canAfford = Math.max(0, Number(state.user?.coins || 0)) >= Math.max(0, Number(effect.price || 0));
                  return `
                    <div class="effects-picker-card">
                      <div class="effects-picker-line">
                        <div class="effects-picker-name">${esc(effect.name)}</div>
                        <div class="effects-picker-price">${esc(`${Math.max(0, Number(effect.price || 0))} COINS`)}</div>
                      </div>
                      <div class="effects-picker-desc">${esc(effect.description)}</div>
                      <button type="button" class="btn btn-primary btn-sm" data-global-effect-id="${esc(effectId)}" ${!canAfford ? 'disabled' : ''}>
                        ${esc(canAfford ? `Activate globally for ${effect.price}c` : 'Need more coins')}
                      </button>
                    </div>
                  `;
                }).join('')}
            </div>
          </div>
        `;

        el.querySelectorAll('[data-room-effect-id]').forEach((actionBtn) => {
          actionBtn.addEventListener('click', async () => {
            const effectId = normalizeEffectId(actionBtn.getAttribute('data-room-effect-id'));
            try {
              actionBtn.disabled = true;
              await activateRoomEffect(effectId);
            } catch (err) {
              actionBtn.disabled = false;
              showComposerNotice(err.message || 'Failed to activate room effect', 'error', 4200);
            }
          });
        });

        el.querySelectorAll('[data-global-effect-id]').forEach((actionBtn) => {
          actionBtn.addEventListener('click', async () => {
            const effectId = normalizeEffectId(actionBtn.getAttribute('data-global-effect-id'));
            try {
              actionBtn.disabled = true;
              await activateGlobalEffectLocal(effectId);
            } catch (err) {
              actionBtn.disabled = false;
              showComposerNotice(err.message || 'Failed to activate global effect', 'error', 4200);
            }
          });
        });

        el.addEventListener('mousedown', (e) => e.stopPropagation());
        return el;
      };

      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (open) { closePicker(); return; }
        open = true;
        popoverEl = buildPicker();
        btn.parentElement.appendChild(popoverEl);
      });

      document.addEventListener('mousedown', (event) => {
        if (!open) return;
        const wrapper = btn.parentElement;
        if (wrapper && wrapper.contains(event.target)) return;
        closePicker();
      }, { capture: true });
    };

    setupEffectsPicker();
    updateCoinDisplays();

    (async () => {
      try {
        await joinRoom(state.currentChannel);
        if (routeNonce !== state.routeNonce) return;
        await getMessages(state.currentChannel);
      } catch (err) {
        if (routeNonce !== state.routeNonce) return;
        if (err.status === 403) { state.bannedMessage = err.message; renderMessages(); }
        else {
          document.getElementById('chat-messages').innerHTML =
            `<div class="msg-state" style="color:var(--danger)">${esc(err.message)}</div>`;
        }
      }
    })();

    clearChatRuntime();
    state.pollTimer = setInterval(async () => {
      if (!state.currentChannel) return;
      try { await getMessages(state.currentChannel); }
      catch (err) { if (err.status === 403) { state.bannedMessage = err.message; renderMessages(); } }
    }, 1000);

    state.metaTimer = setInterval(async () => {
      await refreshPresence();
      await fetchAlerts();
      await refreshSlowmodeConfig();
    }, 10000);
  };

  // Update coin displays (header, settings, room effects balance)
  const updateCoinDisplays = () => {
    const coins = Math.max(0, Number(state.user?.coins || 0));
    const label = `${coins} coin${coins === 1 ? '' : 's'}`;
    const headerCoins = document.getElementById('header-coins');
    if (headerCoins) headerCoins.textContent = label;
    const settingsCoins = document.getElementById('settings-coins-balance');
    if (settingsCoins) settingsCoins.textContent = label;
    const settingsEffect = document.getElementById('settings-equipped-effect');
    if (settingsEffect) settingsEffect.textContent = getEffectMeta(state.user?.equippedEffect).name;
    const roomCoins = document.getElementById('room-effects-balance');
    if (roomCoins) roomCoins.textContent = label;
    const headerRoomEffect = document.getElementById('header-room-effect');
    if (headerRoomEffect) {
      headerRoomEffect.textContent = getActiveRoomEffectId() === 'none' ? 'No room effect' : `${getRoomEffectMeta().name} live`;
    }
    const composerRoomEffect = document.getElementById('composer-room-effect');
    if (composerRoomEffect) {
      composerRoomEffect.textContent = getActiveRoomEffectId() === 'none'
        ? 'No room effect active'
        : `${getRoomEffectMeta().name} active for this room`;
    }
  };

  // Export required functions
  return {
    cleanupChatTimers,
    showToast,
    loadUser,
    loadChannels,
    getCurrentChannel,
    renderLogin,
    renderRegister,
    layoutShell,
    renderSidebar,
    renderMessages,
    sendMessage,
    renderChatPage
  };
}
