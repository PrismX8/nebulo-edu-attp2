import { getSocket } from './socket.js';
import { createVoiceModule } from './voice.js';

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
    renderRoomEffectStage
  } = deps;

  let friendSearchActionClickHandler = null;
  let joinedMessageRoomIds = new Set();
  const OUTBOX_LIMIT = 4;
  let messageOutbox = [];
  let drainingMessageOutbox = false;
  let scheduleMessagePoll = () => {};

  const getClientNonce = (message = {}) => String(message?.clientNonce || message?.client_nonce || '').trim();
  const createClientNonce = () => {
    if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
  };

  // Initialize unread counts from localStorage
  state.unreadCounts = JSON.parse(localStorage.getItem('tlkUnreadCounts') || '{}') || {};
  if (typeof state.unreadCounts !== 'object' || Array.isArray(state.unreadCounts)) {
    state.unreadCounts = {};
  }

  // Voice call state
  state.activeVoiceCall = null;
  state.voiceCallParticipants = [];
  state.isMicMuted = false;
  state.selectedMicDeviceId = null;
  state.isSpeaking = false;
  state.audioContext = null;
  state.analyser = null;
  state.microphoneStream = null;
  state.voicePeers = new Map();
  state.voicePeerNames = new Map();
  state.voiceRemoteAudio = new Map();
  state.voiceRemoteSpeaking = new Map();
  state.voiceRelayRecorder = null;
  state.voiceRelayTimer = null;
  state.voiceRelayPlaying = false;
  state.voiceRelayStopping = false;
  state.isVoiceSocketJoined = false;
  state.lastVoiceSpeakingEmit = false;
  state.voiceInputMode = ['toggle', 'ptt'].includes(localStorage.getItem('voiceInputMode')) ? localStorage.getItem('voiceInputMode') : 'toggle';
  state.remoteVoiceVolumes = JSON.parse(localStorage.getItem('remoteVoiceVolumes') || '{}') || {};
  state.remoteVoiceMuted = JSON.parse(localStorage.getItem('remoteVoiceMuted') || '{}') || {};
  state.voiceCallsByRoom = {};
  state.notificationServiceWorkerReady = false;
  state.presenceUsersByRoom = {};
  state.roomSearchQuery = '';
  state.replyTarget = null;
  state.pendingAttachment = null;
  state.newMessagesAfterId = '';
  state.roomMetaStore = JSON.parse(localStorage.getItem('ubgChatRoomMeta') || '{}') || {};
  state.themePrefs = JSON.parse(localStorage.getItem('ubgChatThemePrefs') || '{}') || {};

  const formatCoins = (value) => {
    const coins = Math.max(0, Math.round(Number(value || 0) * 100) / 100);
    return Number.isInteger(coins) ? String(coins) : coins.toFixed(2).replace(/0+$/, '').replace(/\.$/, '');
  };

  const formatCoinLabel = (value) => {
    const coins = Number(formatCoins(value));
    return `${formatCoins(value)} coin${coins === 1 ? '' : 's'}`;
  };

  const getCurrentUsername = () => String(state.user?.username || state.user?.name || 'Anonymous').trim();
  const voiceApi = createVoiceModule({ api, getTlkClientId, getChatDeviceId });
  const canUseVoiceForChannel = (channel = state.currentChannel) =>
    ['public', 'group', 'dm'].includes(String(channel?.type || '').toLowerCase());
  const getVoiceRoomForTextChannel = (channel = state.currentChannel) => {
    const type = String(channel?.type || '').toLowerCase();
    if (type === 'public') return 'voice:general';
    if (!['group', 'dm'].includes(type)) return '';
    const textRoom = String(channel?.room || '').trim().toLowerCase();
    return textRoom ? `voice:${textRoom}` : '';
  };
  const getPublicVoiceChannel = () => ({
    id: 'voice:general',
    room: 'voice:general',
    name: 'General',
    type: 'public'
  });
  const getCurrentVoiceChannel = () => {
    if (!canUseVoiceForChannel()) return null;
    const room = getVoiceRoomForTextChannel(state.currentChannel);
    if (!room) return null;
    const type = String(state.currentChannel?.type || '').toLowerCase();
    return {
      id: room,
      room,
      name: type === 'public' ? 'General' : 'Direct Call',
      type
    };
  };
  const getVoiceChannelLabel = (roomName = '') => {
    const currentVoice = getCurrentVoiceChannel();
    if (currentVoice && String(roomName || '').trim() === currentVoice.room) return currentVoice.name;
    return String(roomName || '').replace(/^voice:/, '').replace(/[-_]/g, ' ') || 'Voice';
  };
  const supportsDesktopNotifications = () => typeof window !== 'undefined' && 'Notification' in window;
  const getChannelByRoom = (roomId = '') => {
    const room = String(roomId || '').trim();
    if (!room) return null;
    return (Array.isArray(state.channels) ? state.channels : []).find((channel) => String(channel.room || '').trim() === room) || null;
  };
  const registerNotificationServiceWorker = async () => {
    if (!('serviceWorker' in navigator) || state.notificationServiceWorkerReady) return null;
    try {
      const registration = await navigator.serviceWorker.register('/notification-sw.js');
      state.notificationServiceWorkerReady = true;
      return registration;
    } catch (err) {
      state.notificationServiceWorkerReady = false;
      return null;
    }
  };
  const requestDesktopNotificationPermission = async () => {
    if (!supportsDesktopNotifications()) {
      showToast('Desktop notifications are not supported in this browser', 'error');
      return false;
    }
    const permission = await Notification.requestPermission();
    localStorage.setItem('desktopNotificationsEnabled', permission === 'granted' ? '1' : '0');
    await registerNotificationServiceWorker();
    renderNotificationButton();
    showToast(permission === 'granted' ? 'Desktop notifications enabled' : 'Desktop notifications blocked', permission === 'granted' ? 'success' : 'error');
    return permission === 'granted';
  };
  const renderNotificationButton = () => {
    const btn = document.getElementById('btn-enable-notifications');
    if (!btn || !supportsDesktopNotifications()) return;
    const granted = Notification.permission === 'granted';
    btn.classList.toggle('active', granted);
    btn.textContent = granted ? 'Alerts on' : 'Enable alerts';
    btn.title = granted ? 'Desktop notifications are enabled' : 'Enable desktop notifications for DMs and mentions';
  };
  const showDesktopMessageNotification = async ({ title, body, channelId, tag }) => {
    if (!supportsDesktopNotifications() || Notification.permission !== 'granted') return;
    if (!document.hidden && document.hasFocus()) return;
    const url = `${window.location.origin}${window.location.pathname}#/channels/${encodeURIComponent(channelId || '')}`;
    const options = {
      body: String(body || '').slice(0, 180),
      tag: tag || `chat-${channelId || Date.now()}`,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      data: { url }
    };
    try {
      const registration = await registerNotificationServiceWorker();
      if (registration?.showNotification) {
        await registration.showNotification(title, options);
      } else {
        const notification = new Notification(title, options);
        notification.onclick = () => {
          window.focus();
          if (channelId) navigate(`/channels/${encodeURIComponent(channelId)}`);
          notification.close();
        };
      }
    } catch {
      // Browser notification failures should not break chat delivery.
    }
  };
  const maybeNotifyMessage = (message, channel, reason = '') => {
    if (!message || !channel || isMine(message)) return;
    const currentUsername = String(state.user?.username || state.user?.name || '').trim().toLowerCase();
    const body = String(message?.body || message?.content || '');
    const mentioned = currentUsername && detectMentions(body).some((name) => name.toLowerCase() === currentUsername);
    const isDm = String(channel.type || '').toLowerCase() === 'dm';
    if (!mentioned && !isDm && reason !== 'dm') return;
    const sender = getUsername(message) || 'Someone';
    const title = isDm ? `DM from ${sender}` : `Mention from ${sender}`;
    void showDesktopMessageNotification({
      title,
      body: getMessageQuote(message) || body,
      channelId: channel._id || channel.room,
      tag: `${isDm ? 'dm' : 'mention'}-${channel.room}-${getMessageId(message) || Date.now()}`
    });
  };

  const saveUnreadCounts = () => {
    localStorage.setItem('tlkUnreadCounts', JSON.stringify(state.unreadCounts));
  };

  const saveRoomMetaStore = () => {
    try {
      localStorage.setItem('ubgChatRoomMeta', JSON.stringify(state.roomMetaStore || {}));
    } catch {
      // Shared room settings are server-backed; local cache failures should not break chat.
    }
  };

  const getRoomMeta = (room = state.currentChannel?.room) => {
    const roomKey = String(room || '').trim();
    if (!roomKey) return {};
    if (!state.roomMetaStore || typeof state.roomMetaStore !== 'object') state.roomMetaStore = {};
    if (!state.roomMetaStore[roomKey]) {
      state.roomMetaStore[roomKey] = {
        reactions: {},
        reports: [],
        modLog: [],
        roles: {},
        settings: {},
        soundCooldownUntil: 0
      };
    }
    return state.roomMetaStore[roomKey];
  };

  const escapeCssUrl = (value) => String(value || '').replace(/["\\\r\n]/g, '\\$&');

  const getRoomBackgroundImage = (room = state.currentChannel?.room) => {
    const meta = getRoomMeta(room);
    return String(meta?.settings?.backgroundImage || '').trim();
  };

  const setLocalRoomBackgroundImage = (room = state.currentChannel?.room, backgroundImage = '') => {
    const meta = getRoomMeta(room);
    meta.settings = meta.settings || {};
    const nextBackground = String(backgroundImage || '').trim();
    if (nextBackground) meta.settings.backgroundImage = nextBackground;
    else delete meta.settings.backgroundImage;
    saveRoomMetaStore();
    return meta;
  };

  const applySharedRoomSettings = (room = state.currentChannel?.room, settings = {}) => {
    const roomId = String(room || '').trim();
    if (!roomId) return;
    setLocalRoomBackgroundImage(roomId, settings?.backgroundImage || '');
    if (roomId === String(state.currentChannel?.room || '').trim()) {
      applyRoomBackground(roomId);
    }
  };

  const applyRoomBackground = (room = state.currentChannel?.room) => {
    const main = document.getElementById('main-content');
    if (!main) return;
    const value = getRoomBackgroundImage(room);
    main.classList.toggle('chat-bg-active', !!value);
    if (value) main.style.setProperty('--chat-bg-image', `url("${escapeCssUrl(value)}")`);
    else main.style.removeProperty('--chat-bg-image');
  };

  const fetchRoomSettings = async (channel = state.currentChannel) => {
    const room = String(channel?.room || '').trim();
    const type = String(channel?.type || '').toLowerCase();
    if (!room || !['dm', 'group'].includes(type)) return getRoomMeta(room);
    try {
      const data = await api(`/api/tlk/rooms/${encodeURIComponent(room)}/settings`);
      applySharedRoomSettings(room, data?.settings || {});
      return getRoomMeta(room);
    } catch {
      return getRoomMeta(room);
    }
  };

  const saveSharedRoomBackground = async (backgroundImage = '') => {
    const room = String(state.currentChannel?.room || '').trim();
    if (!room) throw new Error('No room selected');
    const data = await api(`/api/tlk/rooms/${encodeURIComponent(room)}/settings`, {
      method: 'PUT',
      body: { backgroundImage: String(backgroundImage || '').trim() }
    });
    applySharedRoomSettings(room, data?.settings || {});
    return data;
  };

  const isAdminOrOwner = (room = state.currentChannel?.room) => {
    const appRole = String(state.user?.role || '').toLowerCase();
    if (appRole === 'owner' || appRole === 'admin') return true;
    const roomRole = String(getRoomMeta(room).roles?.[getCurrentUsername().toLowerCase()] || '').toLowerCase();
    return roomRole === 'owner' || roomRole === 'admin';
  };

  const pushRoomLog = (text, room = state.currentChannel?.room) => {
    const meta = getRoomMeta(room);
    meta.modLog = Array.isArray(meta.modLog) ? meta.modLog : [];
    meta.modLog.unshift({
      text: String(text || '').trim(),
      actor: getCurrentUsername(),
      at: new Date().toISOString()
    });
    meta.modLog = meta.modLog.slice(0, 100);
    saveRoomMetaStore();
  };

  const applyThemePrefs = () => {
    const root = document.documentElement;
    const accent = String(state.themePrefs?.accent || '').trim();
    if (accent) root.style.setProperty('--accent', accent);
    document.body.classList.toggle('compact-chat', !!state.themePrefs?.compact);
  };

  // Voice call UI functions
  const joinVoiceSocketRoom = async (roomName) => {
    const normalizedRoomName = String(roomName || '').trim();
    if (!normalizedRoomName) return;
    try {
      const socket = await ensureChatSocket();
      socket.emit('join_room', normalizedRoomName);
    } catch (err) {
      console.warn('Voice socket room join failed:', err);
    }
  };

  const leaveVoiceSocketRoom = async (roomName) => {
    const normalizedRoomName = String(roomName || '').trim();
    if (!normalizedRoomName || !activeSocket) return;
    try {
      activeSocket.emit('leave_room', normalizedRoomName);
    } catch (err) {
      console.warn('Voice socket room leave failed:', err);
    }
  };

  const setVoiceButtonJoined = (joined) => {
    const voiceBtn = document.getElementById('btn-voice-chat');
    if (!voiceBtn) return;
    voiceBtn.classList.toggle('active', !!joined);
    updateVoiceButtonLabel();
  };

  const getVoiceParticipantAvatar = (participantName = '') => {
    const normalizedName = String(participantName || '').trim();
    if (!normalizedName) return '';
    const currentName = getCurrentUsername();
    if (normalizedName.toLowerCase() === currentName.toLowerCase()) {
      return withAvatarVersion(String(state.user?.avatar || state.user?.avatarUrl || '').trim());
    }
    const friend = Array.isArray(state.mutualFriends)
      ? state.mutualFriends.find((entry) => String(entry?.username || entry?.name || entry || '').trim().toLowerCase() === normalizedName.toLowerCase())
      : null;
    return withAvatarVersion(String(friend?.avatar || friend?.avatarUrl || '').trim());
  };

  const renderVoiceParticipantStrip = (callInfo = state.activeVoiceCall) => {
    const strip = document.getElementById('voice-participant-strip');
    if (!strip) return;
    const participants = Array.isArray(callInfo?.participants) ? callInfo.participants.filter(Boolean) : [];
    strip.classList.toggle('hidden', participants.length === 0);
    strip.innerHTML = '';
    if (!participants.length) return;

    participants.slice(0, 5).forEach((participant) => {
      const name = String(participant || '').trim();
      const avatarSrc = getVoiceParticipantAvatar(name);
      const avatar = document.createElement('span');
      avatar.className = 'voice-strip-avatar';
      avatar.title = name;
      avatar.style.background = avatarColor(name);
      if (avatarSrc) {
        const img = document.createElement('img');
        img.src = avatarSrc;
        img.alt = name;
        avatar.appendChild(img);
      } else {
        avatar.textContent = (name.charAt(0) || 'U').toUpperCase();
      }
      strip.appendChild(avatar);
    });

    if (participants.length > 5) {
      const extra = document.createElement('span');
      extra.className = 'voice-strip-avatar voice-strip-extra';
      extra.textContent = `+${participants.length - 5}`;
      extra.title = `${participants.length - 5} more in voice`;
      strip.appendChild(extra);
    }
  };

  const updateVoiceButtonLabel = (callInfo = state.activeVoiceCall) => {
    const voiceBtn = document.getElementById('btn-voice-chat');
    if (!voiceBtn) return;
    const label = voiceBtn.querySelector('.voice-btn-label');
    const currentVoice = getCurrentVoiceChannel();
    const isJoined = !!(state.activeVoiceCall?.roomName && currentVoice?.room && state.activeVoiceCall.roomName === currentVoice.room);
    const callMatchesCurrentVoice = !!(currentVoice?.room && String(callInfo?.roomName || '').trim() === currentVoice.room);
    const hasActiveCall = callMatchesCurrentVoice && Array.isArray(callInfo?.participants) && callInfo.participants.length > 0;
    const text = isJoined ? 'Leave Voice' : hasActiveCall ? 'Join Voice' : 'Voice';
    if (label) label.textContent = text;
    voiceBtn.title = isJoined
      ? `Leave ${getVoiceChannelLabel(state.activeVoiceCall?.roomName)}`
      : `Join ${currentVoice?.name || 'voice'}`;
    voiceBtn.setAttribute('aria-label', voiceBtn.title);
  };

  const updateVoicePanelHeader = (callInfo = state.activeVoiceCall) => {
    const title = document.getElementById('voice-call-title');
    const subtitle = document.getElementById('voice-call-subtitle');
    const count = Array.isArray(callInfo?.participants) ? callInfo.participants.length : 0;
    if (title) title.textContent = callInfo?.channelName || getVoiceChannelLabel(callInfo?.roomName) || 'Voice Call';
    if (subtitle) subtitle.textContent = count > 0 ? `${count} connected` : 'Ready to join';
  };

  const showVoiceCallPanel = (callInfo) => {
    state.activeVoiceCall = callInfo;
    setVoiceButtonJoined(true);
    updateVoiceStatusBar(callInfo);
    updateVoicePanelHeader(callInfo);
    const panel = document.getElementById('voice-call-panel');
    if (panel) {
      panel.classList.remove('hidden');
      updateVoiceCallParticipants(callInfo.participants || []);

      // Join the socket room for voice events
      void joinVoiceSocketRoom(callInfo.roomName || state.currentChannel?.room);

      // Initialize microphone selector
      enumerateMicrophones();

      // Start speaking detection
      startSpeakingDetection();

      if (state.microphoneStream) {
        startVoiceStreaming();
      }
    }
  };

  const hideVoiceCallPanel = () => {
    const roomName = state.activeVoiceCall?.roomName || state.currentChannel?.room;
    state.activeVoiceCall = null;
    state.voiceCallParticipants = [];
    updateVoiceStatusBar(null);
    setVoiceButtonJoined(false);
    updateVoicePanelHeader(null);
    const panel = document.getElementById('voice-call-panel');
    if (panel) {
      panel.classList.add('hidden');
    }

    // Leave the voice socket room
    void leaveVoiceSocketRoom(roomName);

    // Stop speaking detection
    stopSpeakingDetection();

    // Stop voice streaming
    stopVoiceStreaming();

    // Stop microphone stream
    if (state.microphoneStream) {
      state.microphoneStream.getTracks().forEach(track => track.stop());
      state.microphoneStream = null;
    }
  };

  const leaveActiveVoiceCall = async () => {
    const call = state.activeVoiceCall;
    const roomName = call?.roomName || state.currentChannel?.room || 'unknown';
    const participantName = getCurrentUsername();
    hideVoiceCallPanel();
    try {
      const response = await voiceApi.leaveVoiceCall(roomName, participantName);
      if (response?.call?.participants?.length) state.voiceCallsByRoom[roomName] = response.call;
      else delete state.voiceCallsByRoom[roomName];
      updateVoiceStatusBar(response?.call?.participants?.length ? response.call : null);
      return response;
    } catch (e) {
      console.error('Error leaving call:', e);
      return null;
    }
  };

  const refreshVoiceCalls = async () => {
    const currentVoice = getCurrentVoiceChannel();
    const publicVoice = getPublicVoiceChannel();
    const rooms = Array.from(new Set([publicVoice.room, currentVoice?.room].filter(Boolean)));
    try {
      if (!state.voiceCallsByRoom || typeof state.voiceCallsByRoom !== 'object') state.voiceCallsByRoom = {};
      const responses = await Promise.all(rooms.map(async (room) => {
        try {
          const data = await voiceApi.getActiveCall(room);
          return { room, calls: Array.isArray(data?.calls) ? data.calls : [] };
        } catch {
          return { room, calls: [] };
        }
      }));
      const calls = [];
      responses.forEach(({ room, calls: roomCalls }) => {
        delete state.voiceCallsByRoom[room];
        if (roomCalls[0]) {
          state.voiceCallsByRoom[room] = roomCalls[0];
          calls.push(roomCalls[0]);
        }
      });
      updateVoiceStatusBar(state.activeVoiceCall || null);
      return calls;
    } catch (err) {
      state.voiceCallsByRoom = state.voiceCallsByRoom || {};
      return [];
    }
  };

  const joinOrToggleVoiceRoom = async (voiceChannel = getCurrentVoiceChannel()) => {
    const channel = voiceChannel || getCurrentVoiceChannel();
    const roomName = String(channel.room || channel.id || '').trim();
    const voiceRoomType = String(channel.type || state.currentChannel?.type || '').toLowerCase();
    if (!roomName || (roomName !== 'voice:general' && !canUseVoiceForChannel())) return;

    if (state.activeVoiceCall?.roomName === roomName) {
      await leaveActiveVoiceCall();
      await refreshVoiceCalls();
      return;
    }

    if (state.activeVoiceCall?.roomName && state.activeVoiceCall.roomName !== roomName) {
      await leaveActiveVoiceCall();
    }

    const participantName = state.user?.username || state.user?.name || 'Anonymous';
    try {
      const activeResponse = await voiceApi.getActiveCall(roomName);
      let call = Array.isArray(activeResponse?.calls) && activeResponse.calls.length ? activeResponse.calls[0] : null;
      if (call) {
        const joinResponse = await voiceApi.joinVoiceCall(roomName, participantName);
        call = joinResponse?.call || call;
      } else {
        const startResponse = await voiceApi.startVoiceCall(roomName, voiceRoomType, channel.name || getVoiceChannelLabel(roomName), participantName);
        call = startResponse?.callInfo || null;
      }
      if (!call) return;
      call.channelName = call.channelName || channel.name || getVoiceChannelLabel(roomName);
      showVoiceCallPanel(call);
      await initializeVoiceMicrophone();
      state.voiceCallsByRoom[roomName] = call;
      updateVoiceStatusBar(call);
      showToast(`Joined ${call.channelName || getVoiceChannelLabel(roomName)}`, 'success');
    } catch (error) {
      setVoiceButtonJoined(false);
      showToast(error.message || 'Could not join voice channel', 'error');
    }
  };

  const updateVoiceCallParticipants = (participants) => {
    state.voiceCallParticipants = participants;
    const container = document.getElementById('voice-call-participants');
    if (!container) return;

    container.innerHTML = participants.map(participant => {
      const isCurrentUser = participant === (state.user?.username || state.user?.name || 'Anonymous');
      const remoteMuted = !isCurrentUser && !!state.remoteVoiceMuted[participant];
      const remoteVolume = Number(state.remoteVoiceVolumes[participant] ?? 1);
      const avatarSrc = isCurrentUser ? state.user?.avatar : '';
      const avatarLetter = participant.charAt(0).toUpperCase();
      const isSpeaking = isCurrentUser ? state.isSpeaking : !!state.voiceRemoteSpeaking.get(participant);
      const statusClass = state.isMicMuted && isCurrentUser ? 'muted' : (isSpeaking ? 'speaking' : 'idle');
      const statusText = remoteMuted ? 'Muted locally' : state.isMicMuted && isCurrentUser ? 'Muted' : (isSpeaking ? 'Speaking' : 'Connected');

      return `
        <div class="voice-participant ${isSpeaking ? 'speaking' : ''}" data-participant-name="${esc(participant)}">
          <div class="voice-participant-avatar">
            ${avatarSrc ? `<img src="${esc(avatarSrc)}" alt="${esc(participant)}" />` : esc(avatarLetter)}
          </div>
          <div class="voice-participant-info">
            <div class="voice-participant-name">${esc(participant)}${isCurrentUser ? ' (You)' : ''}</div>
            <div class="voice-participant-status ${statusClass}">
              <span class="status-dot"></span>
              ${statusText}
            </div>
            ${isCurrentUser ? '' : `
              <div class="voice-user-volume">
                <button type="button" class="voice-user-mute" data-voice-mute-user="${esc(participant)}">${remoteMuted ? 'Unmute' : 'Mute'}</button>
                <input type="range" min="0" max="1" step="0.05" value="${Math.max(0, Math.min(1, remoteVolume))}" data-voice-volume-user="${esc(participant)}" title="User volume" />
              </div>
            `}
          </div>
        </div>
      `;
    }).join('');

    updateVoicePanelHeader(state.activeVoiceCall);

    container.querySelectorAll('[data-voice-volume-user]').forEach((input) => {
      input.addEventListener('input', () => {
        const participantName = String(input.getAttribute('data-voice-volume-user') || '').trim();
        state.remoteVoiceVolumes[participantName] = Number(input.value || 1);
        localStorage.setItem('remoteVoiceVolumes', JSON.stringify(state.remoteVoiceVolumes));
        updateRemoteAudioSettings(participantName);
      });
    });

    container.querySelectorAll('[data-voice-mute-user]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const participantName = String(btn.getAttribute('data-voice-mute-user') || '').trim();
        state.remoteVoiceMuted[participantName] = !state.remoteVoiceMuted[participantName];
        localStorage.setItem('remoteVoiceMuted', JSON.stringify(state.remoteVoiceMuted));
        updateRemoteAudioSettings(participantName);
        updateVoiceCallParticipants(state.voiceCallParticipants);
      });
    });
  };

  const setLocalVoiceTracksEnabled = (enabled) => {
    if (!state.microphoneStream) return;
    state.microphoneStream.getAudioTracks().forEach((track) => {
      track.enabled = enabled;
    });
    const activeCount = state.microphoneStream.getAudioTracks().filter((track) => track.enabled && track.readyState === 'live').length;
    setVoiceDiagnostics(enabled ? `Mic sending (${activeCount} live track${activeCount === 1 ? '' : 's'})` : 'Mic muted locally');
  };

  const updateRemoteAudioSettings = (participantName = '') => {
    const targetName = String(participantName || '').trim();
    state.voiceRemoteAudio.forEach((audio, peerId) => {
      const peerName = state.voicePeerNames.get(peerId);
      if (targetName && peerName !== targetName) return;
      audio.volume = Math.max(0, Math.min(1, Number(state.remoteVoiceVolumes[peerName] ?? 1)));
      audio.muted = !!state.remoteVoiceMuted[peerName];
    });
  };

  const buildVoiceAudioConstraints = (deviceId = state.selectedMicDeviceId) => {
    const audio = {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
      channelCount: 1,
      sampleRate: 48000
    };
    const normalizedDeviceId = String(deviceId || '').trim();
    if (normalizedDeviceId) audio.deviceId = { exact: normalizedDeviceId };
    return { audio };
  };

  const toggleMicrophone = async () => {
    state.isMicMuted = !state.isMicMuted;
    const micBtn = document.getElementById('btn-mute-mic');
    const micIcon = document.getElementById('mic-icon');

    if (state.isMicMuted) {
      micBtn.classList.add('muted');
      micBtn.title = 'Unmute Microphone';
      micIcon.innerHTML = '<path fill-rule="evenodd" d="M13.477 14.89l-1.063.63c-.391.232-.94.178-1.265-.126C10.735 14.945 10 13.543 10 12V7c0-1.543.735-2.945 1.149-3.394.325-.304.874-.358 1.265-.126l1.063.63c.391.232.549.71.438 1.126C13.823 6.225 13.5 7.575 13.5 9s.323 2.775.915 3.764c.111.416-.047.894-.438 1.126zM8 2.5a.5.5 0 01.5-.5h4a.5.5 0 010 1H9v13h3a.5.5 0 010 1H8.5a.5.5 0 01-.5-.5V2.5z" clip-rule="evenodd"/><path d="M10 9c0 1.08-.442 2.08-1.149 2.394-.325.152-.683-.044-.683-.378V6.984c0-.334.358-.53.683-.378C9.558 6.92 10 7.92 10 9z"/>';
      setLocalVoiceTracksEnabled(false);
      setSpeakingState(false);
      stopVoiceRelayFallback();

    } else {
      micBtn.classList.remove('muted');
      micBtn.title = 'Mute Microphone';
      micIcon.innerHTML = '<path fill-rule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0 5 5 0 01-10 0 1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clip-rule="evenodd"/>';

      if (state.microphoneStream) {
        await startVoiceStreaming();
        syncVoiceInputMode();
      } else if (state.activeVoiceCall) {
        await restartMicrophoneStream(buildVoiceAudioConstraints());
      }
    }

    updateVoiceCallParticipants(state.voiceCallParticipants);
  };

  const enumerateMicrophones = async () => {
    try {
      // Request microphone permission first to get proper device labels
      try {
        const tempStream = await navigator.mediaDevices.getUserMedia(buildVoiceAudioConstraints());
        tempStream.getTracks().forEach(track => track.stop());
      } catch (e) {
        console.warn('Microphone permission not granted, device labels may be generic');
      }

      const devices = await navigator.mediaDevices.enumerateDevices();
      const inputDevices = devices.filter(device =>
        device.kind === 'audioinput' ||
        device.kind === 'videoinput'  // Include cameras as they can have microphones
      );

      const micSelector = document.getElementById('mic-selector');
      if (!micSelector) return;

      micSelector.innerHTML = '';

      if (inputDevices.length === 0) {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = 'No input devices found';
        micSelector.appendChild(option);
        return;
      }

      // Add default option
      const defaultOption = document.createElement('option');
      defaultOption.value = '';
      defaultOption.textContent = 'Default Microphone';
      micSelector.appendChild(defaultOption);

      // Group devices by type
      const audioDevices = inputDevices.filter(d => d.kind === 'audioinput');
      const videoDevices = inputDevices.filter(d => d.kind === 'videoinput');

      // Add audio input devices
      if (audioDevices.length > 0) {
        audioDevices.forEach(mic => {
          const option = document.createElement('option');
          option.value = mic.deviceId;
          const fullLabel = mic.label || `Microphone ${mic.deviceId.slice(0, 8)}`;
          // Store full name in title attribute for tooltip
          option.title = fullLabel;
          // Create shortened display name (max 15 chars + ...)
          const shortLabel = fullLabel.length > 15 ? fullLabel.substring(0, 15) + '...' : fullLabel;
          option.textContent = `🎤 ${shortLabel}`;
          // Store full name in data attribute for dropdown
          option.setAttribute('data-full-name', `🎤 ${fullLabel}`);
          micSelector.appendChild(option);
        });
      }

      // Add video input devices (cameras with mics)
      if (videoDevices.length > 0) {
        if (audioDevices.length > 0) {
          // Add separator
          const separator = document.createElement('option');
          separator.disabled = true;
          separator.textContent = '─────────────';
          micSelector.appendChild(separator);
        }

        videoDevices.forEach(camera => {
          const option = document.createElement('option');
          option.value = camera.deviceId;
          const fullLabel = camera.label || `Camera ${camera.deviceId.slice(0, 8)}`;
          // Store full name in title attribute for tooltip
          option.title = fullLabel;
          // Create shortened display name (max 15 chars + ...)
          const shortLabel = fullLabel.length > 15 ? fullLabel.substring(0, 15) + '...' : fullLabel;
          option.textContent = `📹 ${shortLabel}`;
          // Store full name in data attribute for dropdown
          option.setAttribute('data-full-name', `📹 ${fullLabel}`);
          micSelector.appendChild(option);
        });
      }

      // Set selected device if previously chosen
      if (state.selectedMicDeviceId) {
        micSelector.value = state.selectedMicDeviceId;
        // Update title to show full name of selected device
        const selectedOption = micSelector.querySelector(`option[value="${state.selectedMicDeviceId}"]`);
        if (selectedOption) {
          micSelector.title = selectedOption.title;
        }
      }

    } catch (error) {
      console.error('Error enumerating input devices:', error);
      const micSelector = document.getElementById('mic-selector');
      if (micSelector) {
        micSelector.innerHTML = '<option value="">Error loading devices</option>';
      }
    }
  };

  const startSpeakingDetection = async () => {
    try {
      if (state.audioContext) return; // Already started

      state.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      state.analyser = state.audioContext.createAnalyser();
      state.analyser.fftSize = 256;

      const bufferLength = state.analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const checkAudioLevel = () => {
        if (!state.analyser) {
          setSpeakingState(false);
          return;
        }

        if (state.isMicMuted) {
          setSpeakingState(false);
          requestAnimationFrame(checkAudioLevel);
          return;
        }

        state.analyser.getByteFrequencyData(dataArray);

        // Calculate average volume
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const average = sum / bufferLength;

        // Threshold for speaking detection (adjust as needed)
        const isSpeaking = average > 15;
        setSpeakingState(isSpeaking);

        requestAnimationFrame(checkAudioLevel);
      };

      checkAudioLevel();

    } catch (error) {
      console.error('Error starting speaking detection:', error);
    }
  };

  const stopSpeakingDetection = () => {
    if (state.audioContext) {
      state.audioContext.close();
      state.audioContext = null;
      state.analyser = null;
    }
    setSpeakingState(false);
  };

  const setSpeakingState = (isSpeaking) => {
    if (state.isSpeaking === isSpeaking) return;

    state.isSpeaking = isSpeaking;
    emitVoiceSpeaking(isSpeaking);

    // Update current user's participant box
    const participantsContainer = document.getElementById('voice-call-participants');
    if (!participantsContainer) return;

    const currentUserName = state.user?.username || state.user?.name || 'Anonymous';
    const participantElements = participantsContainer.querySelectorAll('.voice-participant');

    participantElements.forEach(element => {
      const nameElement = element.querySelector('.voice-participant-name');
      if (nameElement && nameElement.textContent.includes(currentUserName)) {
        if (isSpeaking) {
          element.classList.add('speaking');
        } else {
          element.classList.remove('speaking');
        }
      }
    });
  };

  const setRemoteSpeakingState = (participantName, isSpeaking) => {
    const normalizedName = String(participantName || '').trim();
    if (!normalizedName) return;
    state.voiceRemoteSpeaking.set(normalizedName, !!isSpeaking);
    updateVoiceCallParticipants(state.voiceCallParticipants);
  };

  const emitVoiceSpeaking = (isSpeaking) => {
    if (!activeSocket || !state.activeVoiceCall?.roomName) return;
    if (state.lastVoiceSpeakingEmit === isSpeaking) return;
    state.lastVoiceSpeakingEmit = isSpeaking;
    activeSocket.emit('voice_speaking', {
      roomName: state.activeVoiceCall.roomName,
      participantName: getCurrentUsername(),
      isSpeaking
    });
  };

  const handleMicDeviceChange = async (deviceId) => {
    if (!deviceId) {
      // Default microphone
      state.selectedMicDeviceId = null;
      const micSelector = document.getElementById('mic-selector');
      if (micSelector) {
        micSelector.title = 'Default Microphone';
      }
      if (!state.isMicMuted && state.activeVoiceCall) {
        restartMicrophoneStream(buildVoiceAudioConstraints());
      }
      return;
    }

    state.selectedMicDeviceId = deviceId;

    // Update selector title to show full name
    const micSelector = document.getElementById('mic-selector');
    if (micSelector) {
      const selectedOption = micSelector.querySelector(`option[value="${deviceId}"]`);
      if (selectedOption) {
        micSelector.title = selectedOption.title;
      }
    }

    // Check if this is a video input device
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const device = devices.find(d => d.deviceId === deviceId);

      if (device?.kind === 'videoinput') {
        // For video input devices, we can't directly use them for audio
        // but some cameras have built-in microphones
        console.warn('Selected video input device - audio may not work properly');
        if (!state.isMicMuted && state.activeVoiceCall) {
          restartMicrophoneStream(buildVoiceAudioConstraints(deviceId));
        }
      } else {
        // Audio input device
        if (!state.isMicMuted && state.activeVoiceCall) {
          restartMicrophoneStream(buildVoiceAudioConstraints(deviceId));
        }
      }
    } catch (error) {
      console.error('Error handling device change:', error);
      // Fallback to default
      if (!state.isMicMuted && state.activeVoiceCall) {
        restartMicrophoneStream(buildVoiceAudioConstraints());
      }
    }
  };

  const restartMicrophoneStream = async (constraints) => {
    stopVoiceStreaming();

    // Stop existing stream
    if (state.microphoneStream) {
      state.microphoneStream.getTracks().forEach(track => track.stop());
      state.microphoneStream = null;
    }

    try {
      state.microphoneStream = await navigator.mediaDevices.getUserMedia(constraints);
      setVoiceDiagnostics('Mic permission granted');

      if (state.audioContext && state.analyser) {
        const source = state.audioContext.createMediaStreamSource(state.microphoneStream);
        source.connect(state.analyser);
      }

      if (state.activeVoiceCall && !state.isMicMuted) {
        startVoiceStreaming();
        syncVoiceInputMode();
      }

    } catch (error) {
      console.error('Error restarting microphone stream:', error);
      setVoiceDiagnostics(`Mic error: ${error?.name || error?.message || 'blocked'}`);
      // Try with default constraints as fallback
      try {
        state.microphoneStream = await navigator.mediaDevices.getUserMedia(buildVoiceAudioConstraints());
        setVoiceDiagnostics('Mic fallback active');
        if (state.audioContext && state.analyser) {
          const source = state.audioContext.createMediaStreamSource(state.microphoneStream);
          source.connect(state.analyser);
        }
        if (state.activeVoiceCall && !state.isMicMuted) {
          startVoiceStreaming();
          syncVoiceInputMode();
        }
      } catch (fallbackError) {
        console.error('Fallback microphone access failed:', fallbackError);
      }
    }
  };

  const initializeVoiceMicrophone = async () => {
    if (state.isMicMuted || !state.activeVoiceCall) return;

    await restartMicrophoneStream(buildVoiceAudioConstraints());
  };

  const syncVoiceInputMode = () => {
    const modeSelect = document.getElementById('voice-input-mode');
    if (modeSelect) modeSelect.value = state.voiceInputMode;
    const hint = document.getElementById('voice-ptt-hint');
    if (hint) hint.textContent = state.voiceInputMode === 'ptt' ? 'Hold V to talk' : 'Mic stays on until muted';
    if (state.voiceInputMode === 'ptt' && state.microphoneStream) {
      setLocalVoiceTracksEnabled(false);
      setSpeakingState(false);
      setVoiceDiagnostics('Push-to-talk mode: hold V to send mic audio');
      stopVoiceRelayFallback();
    } else if (!state.isMicMuted) {
      setLocalVoiceTracksEnabled(true);
      startVoiceRelayFallback();
    }
  };

  const setVoiceInputMode = (mode) => {
    state.voiceInputMode = mode === 'ptt' ? 'ptt' : 'toggle';
    localStorage.setItem('voiceInputMode', state.voiceInputMode);
    syncVoiceInputMode();
  };

  const setVoiceDiagnostics = (message) => {
    const el = document.getElementById('voice-diagnostics');
    if (el) el.textContent = String(message || 'Diagnostics idle');
  };

  const hasConnectedVoicePeerFor = (participantName = '') => {
    const normalizedName = String(participantName || '').trim();
    if (!normalizedName) return false;
    for (const [peerId, peer] of state.voicePeers.entries()) {
      if (state.voicePeerNames.get(peerId) === normalizedName && ['connected', 'completed'].includes(peer.connectionState)) {
        return true;
      }
    }
    return false;
  };

  const hasPlayingRemoteAudioFor = (participantName = '') => {
    const normalizedName = String(participantName || '').trim();
    if (!normalizedName) return false;
    for (const [peerId, audio] of state.voiceRemoteAudio.entries()) {
      if (state.voicePeerNames.get(peerId) === normalizedName && !audio.paused && audio.srcObject) {
        return true;
      }
    }
    return false;
  };

  const updateVoiceStatusBar = (callInfo = state.activeVoiceCall) => {
    const el = document.getElementById('voice-status-bar');
    updateVoiceChannelCard(callInfo);
    if (!el) return;
    const count = Array.isArray(callInfo?.participants) ? callInfo.participants.length : 0;
    el.textContent = count > 0
      ? `${count} ${count === 1 ? 'person' : 'people'} in ${getVoiceChannelLabel(callInfo?.roomName)}`
      : 'No active voice';
    el.classList.toggle('active', count > 0);
    renderVoiceParticipantStrip(callInfo);
    updateVoiceButtonLabel(callInfo);
  };

  const updateVoiceChannelCard = (callInfo = state.activeVoiceCall) => {
    document.querySelectorAll('[data-voice-room]').forEach((card) => {
      const roomName = String(card.getAttribute('data-voice-room') || '').trim();
      const matchingCall = roomName
        ? (String(callInfo?.roomName || '').trim() === roomName ? callInfo : state.voiceCallsByRoom?.[roomName])
        : null;
      const count = Array.isArray(matchingCall?.participants) ? matchingCall.participants.length : 0;
      const joined = !!(state.activeVoiceCall?.roomName && state.activeVoiceCall.roomName === roomName);
      card.classList.toggle('active', joined);
      card.classList.toggle('has-call', count > 0);
      const countEl = card.querySelector('[data-voice-count]');
      if (countEl) countEl.textContent = count > 0 ? `${count} connected` : 'Empty';
      const actionEl = card.querySelector('[data-voice-action]');
      if (actionEl) actionEl.textContent = joined ? 'Leave' : count > 0 ? 'Join' : 'Start';
    });
  };

  const installVoiceKeyboardControls = () => {
    if (voiceKeyboardInstalled) return;
    voiceKeyboardInstalled = true;
    window.addEventListener('keydown', (event) => {
      if (event.code !== 'KeyV' || event.repeat || state.voiceInputMode !== 'ptt' || state.isMicMuted) return;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(String(document.activeElement?.tagName || ''))) return;
      setLocalVoiceTracksEnabled(true);
      setVoiceDiagnostics('Push-to-talk active');
      startVoiceRelayFallback();
    });
    window.addEventListener('keyup', (event) => {
      if (event.code !== 'KeyV' || state.voiceInputMode !== 'ptt') return;
      setLocalVoiceTracksEnabled(false);
      setSpeakingState(false);
      stopVoiceRelayFallback();
      setVoiceDiagnostics('Push-to-talk idle');
    });
  };

  const isFriendUsername = (username) => {
    const normalized = String(username || '').trim().toLowerCase();
    if (!normalized || !Array.isArray(state.mutualFriends)) return false;
    return state.mutualFriends.some((friend) => String(friend?.username || friend || '').trim().toLowerCase() === normalized);
  };

  const listHasUsername = (list, username) => {
    const normalized = String(username || '').trim().toLowerCase();
    if (!normalized || !Array.isArray(list)) return false;
    return list.some((entry) => String(entry?.username || entry || '').trim().toLowerCase() === normalized);
  };

  const getFriendRelationship = (username) => {
    const normalized = String(username || '').trim().toLowerCase();
    const self = String(state.user?.username || state.user?.name || '').trim().toLowerCase();
    if (!normalized) return 'none';
    if (normalized === self) return 'self';
    if (isFriendUsername(normalized)) return 'friend';
    if (listHasUsername(state.friendRequestsIncoming, normalized)) return 'incoming';
    if (listHasUsername(state.friendRequestsOutgoing, normalized)) return 'pending';
    return 'none';
  };

  const getFriendUsername = (friend) => String(friend?.username || friend || '').trim();
  const renderAppealMessage = (message) => esc(String(message || ''))
    .replace(/https?:\/\/dsc\.gg\/nebulo|dsc\.gg\/nebulo/gi, (match) => {
      const href = match.startsWith('http') ? match : `https://${match}`;
      return `<a href="${esc(href)}" target="_blank" rel="noopener noreferrer">${esc(match)}</a>`;
    });

  // Hoisted renderMessages so it's available everywhere
  function buildMessageRenderKey(m) {
    if (!m) return '';
    const id = String(m?.id || m?._id || '').trim();
    const name = m?.nickname || m?.username || m?.sender?.name || m?.sender?.username || 'Unknown';
    const avatarSrc = String(m?.avatar || m?.avatar_url || m?.sender?.avatar || m?.sender?.avatar_url || '').trim();
    const userId = getUserId(m);
    const body = String(m?.body || m?.content || '');
    const sendState = String(m?.sendState || (m?.failed ? 'failed' : (m?.pending ? 'sending' : 'sent')));
    const isDeleted = !!m?.deleted;
    const isSystem = !!m?.system || String(name).trim().toLowerCase() === 'system';
    const effectId = isDeleted ? 'none' : getMessageEffect(m);
    const rank = getRank(m);
    const meta = getMessageMeta(m);
    const friendTag = !isSystem && isFriendUsername(name) ? 1 : 0;
    const mine = isMine(m);
    const tokens = meta.reactions ? Object.entries(meta.reactions).map(([e, names]) => `${e}:${Array.isArray(names) ? names.length : 0}`).join('|') : '';
    const reports = Array.isArray(meta.reports) ? meta.reports.length : 0;
    const canCopy = String(state.user?.role || '').toLowerCase() === 'owner' ? 1 : 0;
    const isMention = (() => {
      const myUsername = String(state.user?.username || state.user?.name || '').trim();
      return myUsername && isMentioned(m, myUsername) ? 1 : 0;
    })();
    return [
      id,
      name,
      avatarSrc,
      userId,
      body,
      sendState,
      isDeleted ? 1 : 0,
      isSystem ? 1 : 0,
      effectId,
      rank?.key || '',
      rank?.label || '',
      friendTag,
      mine ? 1 : 0,
      tokens,
      reports,
      canCopy,
      isMention,
      String(m?.user_token || m?.senderId || '').trim(),
      fmtTime(m)
    ].join('');
  }

  function buildMessageHtml(m) {
    const rank = getRank(m);
    const name = m?.nickname || m?.username || m?.sender?.name || m?.sender?.username || 'Unknown';
    const body = String(m?.body || m?.content || '');
    const avatarSrc = String(m?.avatar || m?.avatar_url || m?.sender?.avatar || m?.sender?.avatar_url || '').trim();
    const avatarL = String(name || 'U').trim().charAt(0).toUpperCase() || 'U';
    const id = String(m?.id || m?._id || '').trim();
    const token = String(m?.user_token || m?.senderId || '').trim();
    const isDeleted = !!m?.deleted;
    const sendState = String(m?.sendState || (m?.failed ? 'failed' : (m?.pending || id.startsWith('temp-') ? 'sending' : 'sent')));
    const isPending = sendState === 'queued' || sendState === 'sending';
    const isFailed = sendState === 'failed';
    const mine = isMine(m);
    const isSystem = !!m?.system || String(name).trim().toLowerCase() === 'system';
    const systemKind = isSystem
      ? (/voice call/i.test(body) ? 'call' : /effect|sound|activated|broadcast/i.test(body) ? 'effect' : /moderation|blocked|warning|ban/i.test(body) ? 'moderation' : 'info')
      : '';
    const systemIcon = systemKind === 'call' ? '☎' : systemKind === 'effect' ? '✦' : systemKind === 'moderation' ? '!' : 'i';
    const shouldAnimate = !!id && !animatedMessageIds.has(id) && !mine;
    const enterClass = shouldAnimate ? ' msg-enter' : '';
    const enterStyle = shouldAnimate ? ` style="--msg-enter-delay:0ms"` : '';
    const bgStyle = `background:${avatarColor(name)}`;
    const effectId = isDeleted ? 'none' : getMessageEffect(m);
    const effectCls = effectId === 'none' ? '' : `effect-${effectId}`;
    const meta = getMessageMeta(m);
    const reactionHtml = Object.entries(meta.reactions)
      .filter(([, names]) => Array.isArray(names) && names.length)
      .map(([emoji, names]) => `<button type="button" class="reaction-chip" data-react-id="${esc(id)}" data-react-emoji="${esc(emoji)}">${esc(emoji)} ${names.length}</button>`)
      .join('');
    const replyBtn = id ? `<button type="button" data-reply-id="${esc(id)}">Reply</button>` : '';
    const alreadyReported = Array.isArray(meta.reports) && meta.reports.some((report) =>
      String(report.id || report.messageId || '').trim() === id &&
      String(report.reporter || '').trim().toLowerCase() === getCurrentUsername().toLowerCase()
    );
    const reportBtn = id && !isSystem
      ? `<button type="button" data-report-id="${esc(id)}" ${alreadyReported ? 'disabled' : ''}>${alreadyReported ? 'Reported' : 'Report'}</button>`
      : '';

    const deleteBtn = canDelete(m)
      ? `<button data-delete-id="${esc(id)}" data-delete-token="${esc(token)}" class="delete-btn">Delete</button>`
      : '';
    const canCopyId = String(state.user?.role || '').toLowerCase() === 'owner';
    const userId = esc(getUserId(m));
    const copyIdBtn = canCopyId && userId
      ? `<button data-copy-id="${userId}" class="copy-id-btn" title="Copy user ID">Copy ID</button>`
      : '';
    const actionsHtml = (deleteBtn || copyIdBtn || replyBtn || reportBtn)
      ? `<div class="msg-actions">${replyBtn}<button type="button" data-quick-react="${esc(id)}" data-react-emoji="👍">👍</button><button type="button" data-quick-react="${esc(id)}" data-react-emoji="❤️">❤️</button>${reportBtn}${deleteBtn}${copyIdBtn}</div>`
      : '';

    const rankHtml = rank
      ? `<span class="rank-chip rank-${rank.key}">${esc(rank.label)}</span>`
      : '';
    const friendTagHtml = !isSystem && isFriendUsername(name)
      ? `<span class="friend-tag" style="margin-left:8px;font-size:11px;font-weight:700;color:var(--success);background:rgba(56,161,105,0.12);border:1px solid rgba(56,161,105,0.2);padding:0 6px;border-radius:9px;line-height:1.5">Friend</span>`
      : '';

    let formattedBody = renderReplyPreview(body) + renderBody(body.replace(/^> Replying to [^\n]+\n/i, ''));
    if (!isDeleted) {
      const myUsername = String(state.user?.username || state.user?.name || '').trim();
      if (myUsername && isMentioned(m, myUsername)) {
        formattedBody = highlightMention(renderBody(body), myUsername);
      }
    }
    const previewHtml = !isDeleted ? `${getAttachmentPreviewHtml(body)}${getLinkPreviewHtml(body)}` : '';
    const callInviteHtml = isSystem && /started a voice call/i.test(body)
      ? '<button type="button" class="btn btn-primary btn-sm call-invite-join" data-join-current-call="1">Join call</button>'
      : '';
    const bubbleHtml = isSystem && !isDeleted
      ? `<span class="system-note-icon">${esc(systemIcon)}</span><span class="system-note-copy">${formattedBody}</span>`
      : (isDeleted ? '<em>Message deleted</em>' : formattedBody);

    return `<div class="msg ${mine ? 'mine' : ''} ${isDeleted ? 'deleted' : ''} ${isPending ? 'pending' : ''} ${isFailed ? 'failed' : ''} ${isSystem ? `system-note system-${systemKind}` : ''}${enterClass}" data-message-id="${esc(id)}" data-message-token="${esc(token)}"${enterStyle}>
          <div class="msg-avatar" style="${bgStyle}" data-username="${esc(isSystem ? '' : name)}" data-user-id="${esc(getUserId(m))}">
            ${avatarSrc ? `<img src="${esc(avatarSrc)}" alt="${esc(name)}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;display:block" />` : esc(avatarL)}
          </div>
          <div class="msg-body">
            <div class="msg-head">
              <strong class="msg-name ${effectCls}" data-username="${esc(isSystem ? '' : name)}" data-user-id="${esc(getUserId(m))}">${esc(isSystem ? 'System' : name)}</strong>
              ${friendTagHtml}
              ${rankHtml}
              <span>${esc(fmtTime(m))}</span>
              ${isPending ? `<span class="msg-send-state">${sendState === 'queued' ? 'Queued' : 'Sending...'}</span>` : ''}
              ${isFailed ? `<button type="button" class="msg-send-state" data-retry-nonce="${esc(getClientNonce(m))}" style="color:var(--danger);cursor:pointer;background:transparent;border:0;padding:0;text-decoration:underline">Failed · Retry</button>` : ''}
            </div>
            <div class="msg-bubble ${effectCls}">${bubbleHtml}</div>
            ${callInviteHtml}
            ${previewHtml}
            ${reactionHtml ? `<div class="reaction-row">${reactionHtml}</div>` : ''}
            ${actionsHtml}
          </div>
        </div>`;
  }

  function buildUnreadMarkerHtml() {
    return '<div class="unread-separator">New messages</div>';
  }

  function renderMessages() {
    const root = document.getElementById('chat-messages');
    if (!root) return;

    const wasNearBottom = isNearBottom(root);
    const prevScrollTop = root.scrollTop;
    const prevScrollHeight = root.scrollHeight;
    const smoothScroll = !!state.smoothNextMessageScroll;
    state.smoothNextMessageScroll = false;

    if (state.bannedMessage) {
      root.innerHTML = `<div class="msg-state" style="color:var(--danger)">${renderAppealMessage(state.bannedMessage)}</div>`;
      setJumpToLatestVisible(false);
      return;
    }

    if (!state.messages.length) {
      root.innerHTML = `<div class="msg-state">No messages yet — say something!</div>`;
      return;
    }

    const searchQuery = String(state.roomSearchQuery || '').trim().toLowerCase();
    const visibleMessages = searchQuery
      ? state.messages.filter((m) => String(m?.body || m?.content || '').toLowerCase().includes(searchQuery) || getUsername(m).toLowerCase().includes(searchQuery))
      : state.messages;

    if (!visibleMessages.length) {
      root.innerHTML = `<div class="msg-state">No messages match your search.</div>`;
      return;
    }

    const existingById = new Map();
    for (const child of Array.from(root.children)) {
      if (child.dataset && child.dataset.messageId) {
        existingById.set(child.dataset.messageId, child);
      }
    }

    const fragment = document.createDocumentFragment();
    let insertedUnreadMarker = false;
    for (const m of visibleMessages) {
      const id = String(m?.id || m?._id || '').trim();
      const key = buildMessageRenderKey(m);
      if (state.newMessagesAfterId && id === state.newMessagesAfterId && !insertedUnreadMarker) {
        const markerHost = document.createElement('div');
        markerHost.innerHTML = buildUnreadMarkerHtml();
        while (markerHost.firstChild) fragment.appendChild(markerHost.firstChild);
        insertedUnreadMarker = true;
      }
      const existing = existingById.get(id);
      if (existing && existing.__renderKey === key) {
        fragment.appendChild(existing);
      } else {
        const host = document.createElement('div');
        host.innerHTML = buildMessageHtml(m);
        const node = host.firstElementChild;
        if (!node) continue;
        node.__renderKey = key;
        fragment.appendChild(node);
      }
    }

    for (const child of Array.from(root.children)) {
      if (child.dataset && child.dataset.messageId && !fragment.contains(child)) {
        root.removeChild(child);
      }
    }

    while (root.firstChild) root.removeChild(root.firstChild);
    root.appendChild(fragment);

    state.messages.forEach((m) => {
      const id = String(m?.id || m?._id || '').trim();
      if (id) animatedMessageIds.add(id);
    });

    bindMessageActions(root);

    updateMemberListIfChanged();

    if (state.autoFollow || wasNearBottom) {
      state.autoFollow = true;
      setJumpToLatestVisible(false);
      scrollChatToBottom(smoothScroll ? 'smooth' : 'auto');
      return;
    }
    root.scrollTop = prevScrollTop + Math.max(0, root.scrollHeight - prevScrollHeight);
    setJumpToLatestVisible(true);
  }

  // Variables / other functions (order matters: animatedMessageIds must be before renderMessages)
  let animatedMessageIds = new Set();
  let incomingMessageRevealQueue = [];
  let incomingMessageRevealIds = new Set();
  let incomingMessageRevealTimer = null;
  let incomingMessageRevealRoomId = '';
  const toastHost = document.getElementById('toast-host') || (() => {
    const host = document.createElement('div');
    host.id = 'toast-host';
    document.body.appendChild(host);
    return host;
  })();

  let activeSocket = null;
  let activeSocketOrigin = '';
  let voiceKeyboardInstalled = false;
  let joinedTypingRoomId = '';
  let localTypingRoomId = '';
  let localTypingActive = false;
  let localTypingStopTimer = null;
  let lastTypingEmitAt = 0;
  const remoteTypingUsers = new Map();
  const remoteTypingTimers = new Map();

  const getSocketOrigin = () => String(state.apiBase || window.location.origin || '').trim().replace(/\/+$/, '') || window.location.origin;
  const getLocalDisplayName = () => String(localStorage.getItem('tlkNickname') || state.user?.username || '').trim();
  const getMessageId = (message) => String(message?.id || message?._id || '').trim();
  let localMessageOrder = 0;
  const getMessageTimestampMs = (message = {}) => {
    const clientTimestamp = Number(message?._nebuloClientCreatedAt || 0);
    if (Number.isFinite(clientTimestamp) && clientTimestamp > 0) return clientTimestamp;
    const rawTimestamp = Number(message?.timestamp || message?.createdAt || 0);
    if (Number.isFinite(rawTimestamp) && rawTimestamp > 0) {
      return rawTimestamp < 10_000_000_000 ? rawTimestamp * 1000 : rawTimestamp;
    }
    const parsedDate = Date.parse(String(message?.date || message?.created_at || ''));
    return Number.isFinite(parsedDate) ? parsedDate : 0;
  };
  const sortMessagesChronologically = (messages = []) => (Array.isArray(messages) ? messages : [])
    .map((message, index) => ({ message, index }))
    .sort((left, right) => {
      const leftTime = getMessageTimestampMs(left.message);
      const rightTime = getMessageTimestampMs(right.message);
      if (leftTime && rightTime && leftTime !== rightTime) return leftTime - rightTime;
      const leftId = Number(getMessageId(left.message));
      const rightId = Number(getMessageId(right.message));
      if (Number.isFinite(leftId) && Number.isFinite(rightId) && leftId !== rightId) return leftId - rightId;
      const leftOrder = Number(left.message?._nebuloLocalOrder || 0);
      const rightOrder = Number(right.message?._nebuloLocalOrder || 0);
      if (leftOrder && rightOrder && leftOrder !== rightOrder) return leftOrder - rightOrder;
      return left.index - right.index;
    })
    .map(({ message }) => message);
  const mergeMessageSnapshot = (serverMessages = []) => {
    const canonical = sortMessagesChronologically(serverMessages);
    const canonicalIds = new Set(canonical.map(getMessageId).filter(Boolean));
    const canonicalNonces = new Set(canonical.map(getClientNonce).filter(Boolean));
    const unresolved = (Array.isArray(state.messages) ? state.messages : []).filter((message) => {
      const sendState = String(message?.sendState || '');
      const pending = !!message?.pending || !!message?.failed || sendState === 'queued' || sendState === 'sending' || sendState === 'failed';
      if (!pending) return false;
      const messageId = getMessageId(message);
      const nonce = getClientNonce(message);
      return (!messageId || !canonicalIds.has(messageId)) && (!nonce || !canonicalNonces.has(nonce));
    });
    return sortMessagesChronologically([...canonical, ...unresolved]);
  };
  const normalizeMessageOrder = () => {
    state.messages = sortMessagesChronologically(state.messages);
  };
  const normalizeMessageIds = (message) => {
    if (!message || typeof message !== 'object') return message;
    const canonicalId = String(message?.id || message?._id || '').trim();
    if (canonicalId) {
      message.id = canonicalId;
      message._id = canonicalId;
    }
    return message;
  };
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

  const clearIncomingMessageRevealQueue = () => {
    if (incomingMessageRevealTimer) {
      clearTimeout(incomingMessageRevealTimer);
      incomingMessageRevealTimer = null;
    }
    incomingMessageRevealQueue = [];
    incomingMessageRevealIds.clear();
    incomingMessageRevealRoomId = '';
  };

  const markMessagesAsRendered = (messages = []) => {
    if (!Array.isArray(messages)) return;
    messages.forEach((message) => {
      const messageId = getMessageId(message);
      if (messageId) animatedMessageIds.add(messageId);
    });
  };

  const revealQueuedIncomingMessage = (channel) => {
    if (incomingMessageRevealTimer) {
      clearTimeout(incomingMessageRevealTimer);
      incomingMessageRevealTimer = null;
    }

    const currentRoomId = String(state.currentChannel?.room || '').trim();
    if (!currentRoomId || incomingMessageRevealRoomId !== currentRoomId) {
      clearIncomingMessageRevealQueue();
      return;
    }

    const nextMessage = incomingMessageRevealQueue.shift();
    if (!nextMessage) {
      incomingMessageRevealIds.clear();
      incomingMessageRevealRoomId = '';
      return;
    }

    const messageId = getMessageId(nextMessage);
    if (messageId) incomingMessageRevealIds.delete(messageId);
    if (!messageId || !state.messages.some((entry) => getMessageId(entry) === messageId)) {
      notifyMentions(nextMessage, channel);
      state.messages = [...state.messages, nextMessage];
      normalizeMessageOrder();
      state.lastMessagesSignature = getMessagesSignature(state.messages);
      renderMessages();
    }

    if (incomingMessageRevealQueue.length > 0) {
      incomingMessageRevealTimer = setTimeout(() => revealQueuedIncomingMessage(channel), 150);
    } else {
      incomingMessageRevealRoomId = '';
    }
  };

  const enqueueIncomingMessages = (messages = [], channel) => {
    const currentRoomId = String(state.currentChannel?.room || '').trim();
    if (!currentRoomId || !Array.isArray(messages) || messages.length === 0) return false;
    if (incomingMessageRevealRoomId && incomingMessageRevealRoomId !== currentRoomId) {
      clearIncomingMessageRevealQueue();
    }
    incomingMessageRevealRoomId = currentRoomId;

    let queued = false;
    const existingIds = new Set(state.messages.map((entry) => getMessageId(entry)).filter(Boolean));
    messages.forEach((message) => {
      const messageId = getMessageId(message);
      if (!messageId || existingIds.has(messageId) || incomingMessageRevealIds.has(messageId)) return;
      incomingMessageRevealIds.add(messageId);
      incomingMessageRevealQueue.push(message);
      queued = true;
    });

    if (queued && !incomingMessageRevealTimer) {
      incomingMessageRevealTimer = setTimeout(() => revealQueuedIncomingMessage(channel), 40);
    }
    return queued;
  };

  const IDENTITY_FIELDS = [
    'nickname', 'username', 'name',
    'avatar', 'avatar_url',
    'sender', 'senderId', 'senderUserId', 'userId', 'user_token', 'user_id',
    'role', 'equippedEffect',
    'system', 'date', 'timestamp', 'createdAt', 'updatedAt',
    'roomId', 'room',
    'clientNonce', 'client_nonce',
    '_nebuloClientCreatedAt', '_nebuloLocalOrder'
  ];
  const hasValue = (value) => {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim() !== '';
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'object') return Object.keys(value).length > 0;
    return true;
  };
  const mergePreservingIdentity = (prev, next) => {
    if (!prev) return next;
    if (!next) return prev;
    const merged = { ...prev, ...next };
    for (const field of IDENTITY_FIELDS) {
      if (!hasValue(next[field]) && hasValue(prev[field])) {
        merged[field] = prev[field];
      }
    }
    if ((!hasValue(merged.nickname) && !hasValue(merged.username)) && (hasValue(merged.sender?.name) || hasValue(merged.sender?.username))) {
      merged.sender = { ...(prev.sender || {}), ...(next.sender || {}) };
    }
    return merged;
  };

  const upsertRealtimeMessage = (message, { replaceOptimistic = false } = {}) => {
    normalizeMessageIds(message);
    const roomId = String(message?.roomId || '').trim();
    const currentRoomId = String(state.currentChannel?.room || '').trim();
    if (!message || !currentRoomId || (roomId && roomId !== currentRoomId)) return false;

    const messageId = getMessageId(message);
    const clientNonce = getClientNonce(message);
    let optimisticIndex = clientNonce
      ? state.messages.findIndex((entry) => getClientNonce(entry) === clientNonce)
      : (replaceOptimistic ? state.messages.findIndex((entry) => String(entry?._id || '').startsWith('temp-')) : -1);
    const shouldReplaceOptimistic = replaceOptimistic || optimisticIndex >= 0;
    const cleanMessage = shouldReplaceOptimistic ? { ...message, pending: false, failed: false, sendState: 'sent' } : message;
    if (messageId) {
      const existingIndex = state.messages.findIndex((entry) => getMessageId(entry) === messageId);
      if (existingIndex >= 0) {
        if (shouldReplaceOptimistic && optimisticIndex >= 0 && existingIndex !== optimisticIndex) {
          state.messages.splice(existingIndex, 1);
          if (existingIndex < optimisticIndex) optimisticIndex -= 1;
        }
        const targetIndex = shouldReplaceOptimistic && optimisticIndex >= 0 ? optimisticIndex : existingIndex;
        const merged = mergePreservingIdentity(state.messages[targetIndex], cleanMessage);
        merged.pending = false;
        state.messages.splice(targetIndex, 1, merged);
        if (messageId) animatedMessageIds.add(messageId);
        state.messages = state.messages.filter((entry, index) => index === targetIndex || getMessageId(entry) !== messageId);
        normalizeMessageOrder();
        state.lastMessagesSignature = getMessagesSignature(state.messages);
        renderMessages();
        return true;
      }
    }

    if (shouldReplaceOptimistic && optimisticIndex >= 0) {
      const merged = mergePreservingIdentity(state.messages[optimisticIndex], cleanMessage);
      merged.pending = false;
      merged.failed = false;
      merged.sendState = 'sent';
      state.messages.splice(optimisticIndex, 1, merged);
      if (messageId) {
        animatedMessageIds.add(messageId);
        state.messages = state.messages.filter((entry, index) => index === optimisticIndex || getMessageId(entry) !== messageId);
      }
      normalizeMessageOrder();
      state.lastMessagesSignature = getMessagesSignature(state.messages);
      renderMessages();
      return true;
    }

    if (messageId) {
      const existingIndex = state.messages.findIndex((entry) => getMessageId(entry) === messageId);
      if (existingIndex >= 0) {
        const merged = mergePreservingIdentity(state.messages[existingIndex], cleanMessage);
        state.messages.splice(existingIndex, 1, merged);
        if (messageId) animatedMessageIds.add(messageId);
        state.messages = state.messages.filter((entry, index) => index === existingIndex || getMessageId(entry) !== messageId);
        normalizeMessageOrder();
        state.lastMessagesSignature = getMessagesSignature(state.messages);
        renderMessages();
        return true;
      }
    }

    state.messages.push(cleanMessage);
    normalizeMessageOrder();
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

  const renderComposerReplyState = () => {
    const el = document.getElementById('reply-compose-preview');
    if (!el) return;
    if (!state.replyTarget) {
      el.classList.add('hidden');
      el.innerHTML = '';
      return;
    }
    el.classList.remove('hidden');
    el.innerHTML = `
      <span>Replying to <strong>${esc(state.replyTarget.name)}</strong>: ${esc(state.replyTarget.quote)}</span>
      <button type="button" id="clear-reply-target">Cancel</button>
    `;
    document.getElementById('clear-reply-target')?.addEventListener('click', () => {
      state.replyTarget = null;
      renderComposerReplyState();
    });
  };

  const renderMentionSuggestions = (rawValue = '') => {
    const panel = document.getElementById('mention-panel');
    if (!panel) return;
    const match = String(rawValue || '').match(/@([a-zA-Z0-9_]*)$/);
    if (!match) {
      panel.classList.add('hidden');
      panel.innerHTML = '';
      return;
    }
    const query = match[1].toLowerCase();
    const names = Array.from(new Set([
      ...(Array.isArray(state.currentChannel?.users) ? state.currentChannel.users : []),
      ...(Array.isArray(state.mutualFriends) ? state.mutualFriends.map(getFriendUsername) : []),
      ...(Array.isArray(state.currentChannel?.members) ? state.currentChannel.members : [])
    ].map((value) => String(value?.username || value || '').trim()).filter(Boolean)))
      .filter((name) => !query || name.toLowerCase().includes(query))
      .slice(0, 8);
    if (!names.length) {
      panel.classList.add('hidden');
      panel.innerHTML = '';
      return;
    }
    panel.innerHTML = names.map((name) => `<button type="button" data-mention-name="${esc(name)}">@${esc(name)}</button>`).join('');
    panel.classList.remove('hidden');
    panel.querySelectorAll('[data-mention-name]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const input = document.getElementById('chat-input');
        if (!input) return;
        input.value = input.value.replace(/@([a-zA-Z0-9_]*)$/, `@${btn.getAttribute('data-mention-name')} `);
        panel.classList.add('hidden');
        input.focus();
      });
    });
  };

  const renderAttachmentState = () => {
    const el = document.getElementById('attachment-preview');
    if (!el) return;
    if (!state.pendingAttachment) {
      el.classList.add('hidden');
      el.innerHTML = '';
      return;
    }
    el.classList.remove('hidden');
    const att = state.pendingAttachment;
    const hasImage = !!att.dataUrl;
    const status = att.error
      ? `<span class="attachment-error" style="color:var(--danger)">Upload failed: ${esc(att.error)}</span>`
      : (att.uploaded ? '' : `<span class="attachment-uploading" style="color:var(--muted)">Uploading…</span>`);
    el.innerHTML = `
      ${hasImage ? `<img class="attachment-thumb" src="${esc(att.dataUrl)}" alt="${esc(att.name)}" />` : ''}
      <span>${hasImage ? 'Image' : 'File'}: <strong>${esc(att.name)}</strong></span>
      ${status}
      <button type="button" id="clear-attachment">Remove</button>
    `;
    document.getElementById('clear-attachment')?.addEventListener('click', () => {
      state.pendingAttachment = null;
      renderAttachmentState();
    });
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
      String(state.user?.username || '').trim().toLowerCase(),
      String(state.user?.name || '').trim().toLowerCase(),
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
      ? { ...payload.message, roomId: String(payload.roomId || payload.message.roomId || payload.message.room || '') }
      : { ...payload };
    const currentRoomId = String(state.currentChannel?.room || '').trim();
    const roomId = String(message?.roomId || message?.room || '').trim();
    if (!currentRoomId || !roomId || roomId !== currentRoomId) {
      // Increment unread for other rooms
      if (roomId && roomId !== currentRoomId) {
        state.unreadCounts[roomId] = (state.unreadCounts[roomId] || 0) + 1;
        saveUnreadCounts();
        renderSidebar(); // Update sidebar to show new unread
        const channel = getChannelByRoom(roomId);
        if (channel) maybeNotifyMessage(message, channel, String(channel.type || '').toLowerCase() === 'dm' ? 'dm' : 'background');
      }
      return;
    }
    const root = getChatRoot();
    const wasReadingOlder = root && !isNearBottom(root);
    if (upsertRealtimeMessage(message)) {
      maybeNotifyMessage(message, state.currentChannel, 'current');
      if (wasReadingOlder) {
        state.newMessagesAfterId = getMessageId(message);
        state.autoFollow = false;
        setJumpToLatestVisible(true);
      } else {
        state.autoFollow = true;
        setJumpToLatestVisible(false);
      }
    }
  };

  const showTopNotification = (message, durationMs = 3600) => {
    const div = document.createElement('div');
    div.className = 'toast-top-anim';
    div.textContent = String(message || '');
    document.body.appendChild(div);
    setTimeout(() => div.remove(), Number(durationMs));
  };

  const showGlobalBroadcastMessage = (message, from) => {
    const el = document.createElement('div');
    el.className = 'global-public-message';
    el.innerHTML = `
      <div class="global-public-message-text">${esc(String(message || ''))}</div>
      <div class="global-public-message-source">— ${esc(String(from || 'Someone'))}</div>
    `;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 5200);
  };

  const handleGlobalEffect = (data = {}) => {
    const effectId = String(data?.effectId || '').trim().toLowerCase();
    const triggerName = String(data?.triggeredByName || 'Someone');
    if (effectId === 'public_message') {
      if (String(data?.message || '').trim()) {
        showGlobalBroadcastMessage(data.message, triggerName);
      } else {
        showTopNotification(`${triggerName} broadcast a public message`, 4200);
      }
      return;
    }

    const effectName = getEffectMeta(effectId).name || 'Global effect';
    showTopNotification(`${triggerName} activated ${effectName} globally`, 4200);
  };

  const handleRoomEffect = (data = {}) => {
    const room = String(data?.room || data?.roomId || data?.roomName || '').trim();
    const effectId = String(data?.effectId || '').trim().toLowerCase();
    const triggerName = String(data?.triggeredByName || 'Someone');

    // Check if this is the current room
    if (!room || room !== String(state.currentChannel?.room || '').trim()) return;

    const effectMeta = getEffectMeta(effectId);
    const activatedAt = Number(data?.activatedAt || Date.now());
    const durationMs = Number(data?.durationMs ?? effectMeta?.roomDurationMs ?? 0);
    const fallbackRoomEffect = {
      room,
      effectId,
      triggeredByName: triggerName,
      activatedAt,
      durationMs,
      expiresAt: data?.expiresAt ?? (durationMs > 0 ? activatedAt + durationMs : null)
    };
    setRoomEffectState(data?.roomEffect && typeof data.roomEffect === 'object'
      ? data.roomEffect
      : fallbackRoomEffect);

    const effectName = getEffectMeta(effectId).name || 'Room effect';
    showTopNotification(`${triggerName} activated ${effectName} in this room`, 3000);
  };

  const handleRoomSettingsUpdated = (data = {}) => {
    const room = String(data?.room || data?.roomId || '').trim();
    if (!room) return;
    applySharedRoomSettings(room, data?.settings || {});
  };

  const handleGroupMemberJoined = (data = {}) => {
    const room = String(data.room || '').trim();
    const groupData = data.group;
    if (!room || !groupData) return;

    // Update the group in state.channels
    const existingGroup = state.channels.find((c) => c.type === 'group' && c.room === room);
    if (existingGroup) {
      existingGroup.members = Array.isArray(groupData.members) ? groupData.members : existingGroup.members;
      existingGroup.name = groupData.name || existingGroup.name;
      existingGroup.createdAt = groupData.createdAt || existingGroup.createdAt;
      saveGroupChannels(state.channels.filter((c) => c.type === 'group'));
      renderSidebar();
    }
  };

  const handleGroupMemberLeft = (data = {}) => {
    const room = String(data.room || '').trim();
    const groupData = data.group;
    if (!room || !groupData) return;

    // Update the group in state.channels
    const existingGroup = state.channels.find((c) => c.type === 'group' && c.room === room);
    if (existingGroup) {
      existingGroup.members = Array.isArray(groupData.members) ? groupData.members : existingGroup.members;
      existingGroup.name = groupData.name || existingGroup.name;
      existingGroup.createdAt = groupData.createdAt || existingGroup.createdAt;
      saveGroupChannels(state.channels.filter((c) => c.type === 'group'));
      renderSidebar();
    }
  };

  const handleGroupUpdated = (data = {}) => {
    const groupData = data.group;
    if (!groupData?.room) return;
    const previousRoom = String(data.previousRoom || groupData.room || '').trim();
    const existingGroup = state.channels.find((c) => c.type === 'group' && (c.room === previousRoom || c.room === groupData.room));
    if (existingGroup) {
      existingGroup.room = groupData.room || existingGroup.room;
      existingGroup._id = groupData.room || existingGroup._id;
      existingGroup.name = groupData.name || existingGroup.name;
      existingGroup.members = Array.isArray(groupData.members) ? groupData.members : existingGroup.members;
      saveGroupChannels(state.channels.filter((c) => c.type === 'group'));
      renderSidebar();
      if (state.currentChannel?.room === previousRoom) {
        state.currentChannel = existingGroup;
        navigate(`/channels/${encodeURIComponent(existingGroup._id)}`);
      }
    }
  };

  const handleVoiceParticipantJoined = (data = {}) => {
    const roomName = String(data.roomName || '').trim();
    const participantName = String(data.participantName || '').trim();
    const call = data.call;

    if (!roomName || !participantName || !call) return;

    console.log('Voice participant joined:', participantName, 'in room:', roomName);

    state.voiceCallsByRoom[roomName] = call;

    if (state.activeVoiceCall?.roomName === roomName) {
      state.activeVoiceCall.participants = call.participants || [];
      state.activeVoiceCall = call;
      updateVoiceCallParticipants(state.activeVoiceCall.participants);
      updateVoiceStatusBar(state.activeVoiceCall);
      console.log('Updated participants list:', state.activeVoiceCall.participants);
    }
  };

  const handleVoiceParticipantLeft = (data = {}) => {
    const roomName = String(data.roomName || '').trim();
    const participantName = String(data.participantName || '').trim();
    const call = data.call;

    if (!roomName || !participantName) return;

    if (call) state.voiceCallsByRoom[roomName] = call;
    else delete state.voiceCallsByRoom[roomName];

    if (state.activeVoiceCall?.roomName === roomName) {
      if (call && call.participants) {
        state.activeVoiceCall = call;
      } else {
        // Remove the participant from our local list
        state.activeVoiceCall.participants = state.activeVoiceCall.participants.filter(p => p !== participantName);
      }
      if (!state.activeVoiceCall.participants.length) {
        hideVoiceCallPanel();
        return;
      }
      updateVoiceCallParticipants(state.activeVoiceCall.participants);
      updateVoiceStatusBar(state.activeVoiceCall);
    }
  };

  const getVoiceRoomName = () => String(state.activeVoiceCall?.roomName || '').trim();

  const getVoiceConfig = () => ({
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
  });

  const addRemoteAudio = (peerId, stream) => {
    const normalizedPeerId = String(peerId || '').trim();
    if (!normalizedPeerId) return;

    let audio = state.voiceRemoteAudio.get(normalizedPeerId);
    if (!audio) {
      audio = document.createElement('audio');
      audio.autoplay = true;
      audio.playsInline = true;
      audio.dataset.voicePeerId = normalizedPeerId;
      audio.style.display = 'none';
      document.body.appendChild(audio);
      state.voiceRemoteAudio.set(normalizedPeerId, audio);
    }

    if (audio.srcObject !== stream) {
      audio.srcObject = stream;
    }
    const participantName = state.voicePeerNames.get(normalizedPeerId);
    audio.volume = Math.max(0, Math.min(1, Number(state.remoteVoiceVolumes[participantName] ?? 1)));
    audio.muted = !!state.remoteVoiceMuted[participantName];
    audio.play().catch((err) => {
      console.warn('Remote voice playback needs a user gesture or was blocked:', err);
    });
  };

  const removeVoicePeer = (peerId) => {
    const normalizedPeerId = String(peerId || '').trim();
    if (!normalizedPeerId) return;

    const peer = state.voicePeers.get(normalizedPeerId);
    if (peer) {
      try {
        peer.close();
      } catch {}
      state.voicePeers.delete(normalizedPeerId);
    }

    const audio = state.voiceRemoteAudio.get(normalizedPeerId);
    if (audio) {
      audio.srcObject = null;
      audio.remove();
      state.voiceRemoteAudio.delete(normalizedPeerId);
    }

    const participantName = state.voicePeerNames.get(normalizedPeerId);
    if (participantName) {
      state.voiceRemoteSpeaking.delete(participantName);
      state.voicePeerNames.delete(normalizedPeerId);
      updateVoiceCallParticipants(state.voiceCallParticipants);
    }
  };

  const createVoicePeer = (peerId, participantName) => {
    const normalizedPeerId = String(peerId || '').trim();
    if (!normalizedPeerId) return null;
    if (state.voicePeers.has(normalizedPeerId)) return state.voicePeers.get(normalizedPeerId);

    const peer = new RTCPeerConnection(getVoiceConfig());
    state.voicePeers.set(normalizedPeerId, peer);
    if (participantName) {
      state.voicePeerNames.set(normalizedPeerId, String(participantName));
      updateRemoteAudioSettings(String(participantName));
    }

    if (state.microphoneStream) {
      state.microphoneStream.getTracks().forEach((track) => {
        peer.addTrack(track, state.microphoneStream);
      });
    }

    peer.ontrack = (event) => {
      const [stream] = event.streams;
      if (stream) addRemoteAudio(normalizedPeerId, stream);
    };

    peer.onicecandidate = (event) => {
      const roomName = getVoiceRoomName();
      if (!event.candidate || !activeSocket || !roomName) return;
      activeSocket.emit('voice_ice_candidate', {
        roomName,
        targetPeerId: normalizedPeerId,
        candidate: event.candidate
      });
    };

    peer.onconnectionstatechange = () => {
      setVoiceDiagnostics(`Voice connection: ${peer.connectionState}`);
      if (['closed', 'failed', 'disconnected'].includes(peer.connectionState)) {
        removeVoicePeer(normalizedPeerId);
      }
    };

    return peer;
  };

  const callVoicePeer = async (peerId, participantName) => {
    const roomName = getVoiceRoomName();
    if (!activeSocket || !state.microphoneStream || !roomName) return;

    const peer = createVoicePeer(peerId, participantName);
    if (!peer) return;

    try {
      const offer = await peer.createOffer({ offerToReceiveAudio: true });
      await peer.setLocalDescription(offer);
      activeSocket.emit('voice_offer', {
        roomName,
        targetPeerId: peerId,
        participantName: getCurrentUsername(),
        sdp: peer.localDescription
      });
    } catch (err) {
      console.error('Failed to create voice offer:', err);
      removeVoicePeer(peerId);
    }
  };

  const handleVoicePeers = async (data = {}) => {
    const roomName = String(data.roomName || '').trim();
    if (roomName !== getVoiceRoomName()) return;
    const peers = Array.isArray(data.peers) ? data.peers : [];
    for (const peer of peers) {
      await callVoicePeer(peer.peerId, peer.participantName);
    }
  };

  const handleVoicePeerJoined = (data = {}) => {
    const roomName = String(data.roomName || '').trim();
    const peerId = String(data.peerId || '').trim();
    const participantName = String(data.participantName || '').trim();
    if (roomName !== getVoiceRoomName() || !peerId) return;
    if (participantName) state.voicePeerNames.set(peerId, participantName);
  };

  const handleVoicePeerLeft = (data = {}) => {
    const roomName = String(data.roomName || '').trim();
    if (roomName !== getVoiceRoomName()) return;
    removeVoicePeer(data.peerId);
  };

  const handleVoiceOffer = async (data = {}) => {
    const roomName = String(data.roomName || '').trim();
    const fromPeerId = String(data.fromPeerId || '').trim();
    if (roomName !== getVoiceRoomName() || !fromPeerId || !data.sdp) return;

    try {
      const peer = createVoicePeer(fromPeerId, data.participantName);
      if (!peer) return;
      await peer.setRemoteDescription(new RTCSessionDescription(data.sdp));
      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);
      activeSocket.emit('voice_answer', {
        roomName,
        targetPeerId: fromPeerId,
        participantName: getCurrentUsername(),
        sdp: peer.localDescription
      });
    } catch (err) {
      console.error('Failed to answer voice offer:', err);
      removeVoicePeer(fromPeerId);
    }
  };

  const handleVoiceAnswer = async (data = {}) => {
    const roomName = String(data.roomName || '').trim();
    const fromPeerId = String(data.fromPeerId || '').trim();
    if (roomName !== getVoiceRoomName() || !fromPeerId || !data.sdp) return;

    const peer = state.voicePeers.get(fromPeerId);
    if (!peer) return;

    try {
      await peer.setRemoteDescription(new RTCSessionDescription(data.sdp));
    } catch (err) {
      console.error('Failed to apply voice answer:', err);
      removeVoicePeer(fromPeerId);
    }
  };

  const handleVoiceIceCandidate = async (data = {}) => {
    const roomName = String(data.roomName || '').trim();
    const fromPeerId = String(data.fromPeerId || '').trim();
    if (roomName !== getVoiceRoomName() || !fromPeerId || !data.candidate) return;

    const peer = state.voicePeers.get(fromPeerId);
    if (!peer) return;

    try {
      await peer.addIceCandidate(new RTCIceCandidate(data.candidate));
    } catch (err) {
      console.warn('Failed to add voice ICE candidate:', err);
    }
  };

  const handleVoiceSpeaking = (data = {}) => {
    const roomName = String(data.roomName || '').trim();
    const participantName = String(data.participantName || '').trim();
    if (roomName !== getVoiceRoomName() || !participantName || participantName === getCurrentUsername()) return;
    setRemoteSpeakingState(participantName, !!data.isSpeaking);
  };

  const playRelayAudio = async (participantName, audioBuffer, mimeType) => {
    if (!audioBuffer || state.voiceRelayPlaying) return;
    if (hasConnectedVoicePeerFor(participantName) && hasPlayingRemoteAudioFor(participantName)) return;
    try {
      state.voiceRelayPlaying = true;
      const audio = new Audio(URL.createObjectURL(new Blob([audioBuffer], { type: mimeType || 'audio/webm' })));
      audio.volume = Math.max(0, Math.min(1, Number(state.remoteVoiceVolumes[participantName] ?? 1)));
      audio.muted = !!state.remoteVoiceMuted[participantName];
      audio.onended = () => {
        URL.revokeObjectURL(audio.src);
        state.voiceRelayPlaying = false;
      };
      audio.onerror = () => {
        URL.revokeObjectURL(audio.src);
        state.voiceRelayPlaying = false;
      };
      await audio.play();
    } catch (err) {
      state.voiceRelayPlaying = false;
      console.warn('Relay voice playback failed:', err);
    }
  };

  const handleVoiceRelayAudio = (data = {}) => {
    const roomName = String(data.roomName || '').trim();
    const participantName = String(data.participantName || '').trim();
    if (roomName !== getVoiceRoomName() || !participantName || participantName === getCurrentUsername()) return;
    playRelayAudio(participantName, data.audio, data.mimeType);
  };

  const stopVoiceRelayFallback = () => {
    state.voiceRelayStopping = true;
    if (state.voiceRelayTimer) {
      clearTimeout(state.voiceRelayTimer);
      state.voiceRelayTimer = null;
    }
    if (state.voiceRelayRecorder) {
      try {
        if (state.voiceRelayRecorder.state !== 'inactive') state.voiceRelayRecorder.stop();
      } catch {}
      state.voiceRelayRecorder = null;
    }
  };

  const startVoiceRelayFallback = () => {
    if (!activeSocket || !state.microphoneStream || state.voiceRelayRecorder || state.voiceRelayTimer || state.isMicMuted) return;
    if (typeof MediaRecorder !== 'function') return;
    state.voiceRelayStopping = false;

    const mimeType = MediaRecorder.isTypeSupported?.('audio/webm;codecs=opus')
      ? 'audio/webm;codecs=opus'
      : 'audio/webm';

    const recordOnce = () => {
      if (!activeSocket || !state.microphoneStream || state.isMicMuted || !state.isVoiceSocketJoined) {
        stopVoiceRelayFallback();
        return;
      }

      let recorder;
      try {
        recorder = new MediaRecorder(state.microphoneStream, { mimeType });
      } catch (err) {
        console.warn('Relay recorder unavailable:', err);
        return;
      }

      state.voiceRelayRecorder = recorder;
      recorder.ondataavailable = async (event) => {
        if (!event.data || event.data.size <= 0 || state.isMicMuted || !activeSocket) return;
        try {
          activeSocket.emit('voice_relay_audio', {
            roomName: getVoiceRoomName(),
            participantName: getCurrentUsername(),
            mimeType: event.data.type || mimeType,
            audio: await event.data.arrayBuffer()
          });
        } catch (err) {
          console.warn('Relay voice send failed:', err);
        }
      };
      recorder.onstop = () => {
        state.voiceRelayRecorder = null;
        if (state.voiceRelayStopping) return;
        state.voiceRelayTimer = setTimeout(recordOnce, 80);
      };
      recorder.start();
      state.voiceRelayTimer = setTimeout(() => {
        try {
          if (recorder.state !== 'inactive') recorder.stop();
        } catch {}
      }, 900);
    };

    recordOnce();
  };

  const startVoiceStreaming = async () => {
    const roomName = getVoiceRoomName();
    if (!roomName || !state.microphoneStream || state.isVoiceSocketJoined) return;

    try {
      const socket = await ensureChatSocket();
      state.isVoiceSocketJoined = true;
      socket.emit('voice_join', {
        roomName,
        participantName: getCurrentUsername()
      });
      startVoiceRelayFallback();
    } catch (err) {
      state.isVoiceSocketJoined = false;
      console.error('Error starting voice streaming:', err);
    }
  };

  const stopVoiceStreaming = () => {
    const roomName = getVoiceRoomName();
    if (activeSocket && state.isVoiceSocketJoined && roomName) {
      activeSocket.emit('voice_leave', {
        roomName,
        participantName: getCurrentUsername()
      });
    }

    state.isVoiceSocketJoined = false;
    state.lastVoiceSpeakingEmit = false;
    stopVoiceRelayFallback();
    Array.from(state.voicePeers.keys()).forEach(removeVoicePeer);
    state.voicePeerNames.clear();
    state.voiceRemoteSpeaking.clear();
  };

  const identifyUserSocket = async () => {
    const username = String(state.user?.username || state.user?.name || '').trim();
    if (!username) return;
    try {
      const socket = await getSocket(getSocketOrigin());
      socket.emit('identify_user', { username, userId: String(state.user?._id || '').trim() });
    } catch (err) {
      console.warn('User socket identify failed:', err);
    }
  };

  const handleSocketConnect = async () => {
    await identifyUserSocket().catch(() => {});
    await subscribeToMessageRooms().catch(() => {});
    if (state.currentChannel) {
      await getMessages(state.currentChannel, false, { live: true }).catch(() => {});
    }
    if (state.activeVoiceCall && state.microphoneStream) {
      state.isVoiceSocketJoined = false;
      await startVoiceStreaming().catch(() => {});
    }
  };

  const handleSocketDisconnect = () => {
    if (state.currentChannel) scheduleMessagePoll(1200);
  };

  const handleChatReward = (payload = {}) => {
    if (payload?.balance === undefined || !state.user) return;
    state.user = { ...state.user, coins: Math.max(0, Number(payload.balance || 0)) };
    updateCoinDisplays();
  };

  const ensureChatSocket = async () => {
    const origin = getSocketOrigin();
    const socket = await getSocket(origin);
    if (activeSocket && (activeSocket !== socket || activeSocketOrigin !== origin)) {
      joinedMessageRoomIds.clear();
      activeSocket.off('connect', handleSocketConnect);
      activeSocket.off('disconnect', handleSocketDisconnect);
      activeSocket.off('chat_reward', handleChatReward);
      activeSocket.off('user_typing', handleRemoteTyping);
      activeSocket.off('receive_message', handleRealtimeMessage);
      activeSocket.off('global_effect', handleGlobalEffect);
      activeSocket.off('room_effect', handleRoomEffect);
      activeSocket.off('room_settings_updated', handleRoomSettingsUpdated);
      activeSocket.off('group_member_joined', handleGroupMemberJoined);
      activeSocket.off('group_member_left', handleGroupMemberLeft);
      activeSocket.off('group_updated', handleGroupUpdated);
      activeSocket.off('voice_participant_joined', handleVoiceParticipantJoined);
      activeSocket.off('voice_participant_left', handleVoiceParticipantLeft);
      activeSocket.off('voice_peers', handleVoicePeers);
      activeSocket.off('voice_peer_joined', handleVoicePeerJoined);
      activeSocket.off('voice_peer_left', handleVoicePeerLeft);
      activeSocket.off('voice_offer', handleVoiceOffer);
      activeSocket.off('voice_answer', handleVoiceAnswer);
      activeSocket.off('voice_ice_candidate', handleVoiceIceCandidate);
      activeSocket.off('voice_speaking', handleVoiceSpeaking);
      activeSocket.off('voice_relay_audio', handleVoiceRelayAudio);
    }
    activeSocket = socket;
    activeSocketOrigin = origin;
    activeSocket.off('connect', handleSocketConnect);
    activeSocket.off('disconnect', handleSocketDisconnect);
    activeSocket.off('chat_reward', handleChatReward);
    activeSocket.off('user_typing', handleRemoteTyping);
    activeSocket.off('receive_message', handleRealtimeMessage);
    activeSocket.off('global_effect', handleGlobalEffect);
    activeSocket.off('room_effect', handleRoomEffect);
    activeSocket.off('room_settings_updated', handleRoomSettingsUpdated);
    activeSocket.off('group_member_joined', handleGroupMemberJoined);
    activeSocket.off('group_member_left', handleGroupMemberLeft);
    activeSocket.off('group_updated', handleGroupUpdated);
    activeSocket.off('voice_participant_joined', handleVoiceParticipantJoined);
    activeSocket.off('voice_participant_left', handleVoiceParticipantLeft);
    activeSocket.off('voice_peers', handleVoicePeers);
    activeSocket.off('voice_peer_joined', handleVoicePeerJoined);
    activeSocket.off('voice_peer_left', handleVoicePeerLeft);
    activeSocket.off('voice_offer', handleVoiceOffer);
    activeSocket.off('voice_answer', handleVoiceAnswer);
    activeSocket.off('voice_ice_candidate', handleVoiceIceCandidate);
    activeSocket.off('voice_speaking', handleVoiceSpeaking);
    activeSocket.off('voice_relay_audio', handleVoiceRelayAudio);
    activeSocket.on('connect', handleSocketConnect);
    activeSocket.on('disconnect', handleSocketDisconnect);
    activeSocket.on('chat_reward', handleChatReward);
    activeSocket.on('user_typing', handleRemoteTyping);
    activeSocket.on('receive_message', handleRealtimeMessage);
    activeSocket.on('global_effect', handleGlobalEffect);
    activeSocket.on('room_effect', handleRoomEffect);
    activeSocket.on('room_settings_updated', handleRoomSettingsUpdated);
    activeSocket.on('group_member_joined', handleGroupMemberJoined);
    activeSocket.on('group_member_left', handleGroupMemberLeft);
    activeSocket.on('group_updated', handleGroupUpdated);
    activeSocket.on('voice_participant_joined', handleVoiceParticipantJoined);
    activeSocket.on('voice_participant_left', handleVoiceParticipantLeft);
    activeSocket.on('voice_peers', handleVoicePeers);
    activeSocket.on('voice_peer_joined', handleVoicePeerJoined);
    activeSocket.on('voice_peer_left', handleVoicePeerLeft);
    activeSocket.on('voice_offer', handleVoiceOffer);
    activeSocket.on('voice_answer', handleVoiceAnswer);
    activeSocket.on('voice_ice_candidate', handleVoiceIceCandidate);
    activeSocket.on('voice_speaking', handleVoiceSpeaking);
    activeSocket.on('voice_relay_audio', handleVoiceRelayAudio);
    if (activeSocket.connected) {
      const username = String(state.user?.username || state.user?.name || '').trim();
      if (username) activeSocket.emit('identify_user', { username, userId: String(state.user?._id || '').trim() });
    }
    return activeSocket;
  };

  const joinMessageRoom = async (roomId) => {
    const normalizedRoomId = String(roomId || '').trim();
    if (!normalizedRoomId || joinedMessageRoomIds.has(normalizedRoomId)) return;
    try {
      const socket = await ensureChatSocket();
      socket.emit('join_room', normalizedRoomId);
      joinedMessageRoomIds.add(normalizedRoomId);
    } catch (err) {
      console.warn('Message room join failed:', err);
    }
  };

  const leaveMessageRoom = async (roomId) => {
    const normalizedRoomId = String(roomId || '').trim();
    if (!normalizedRoomId) return;
    joinedMessageRoomIds.delete(normalizedRoomId);
    try {
      const socket = await ensureChatSocket();
      socket.emit('leave_room', normalizedRoomId);
    } catch (err) {
      console.warn('Message room leave failed:', err);
    }
  };

  const subscribeToMessageRooms = async () => {
    const channelRoomIds = Array.isArray(state.channels)
      ? state.channels.map((channel) => String(channel.room || '').trim()).filter(Boolean)
      : [];
    const friendRoomIds = Array.isArray(state.mutualFriends)
      ? state.mutualFriends
        .map((friend) => buildDmChannel(getFriendUsername(friend)))
        .filter(Boolean)
        .map((dm) => String(dm.room || '').trim())
        .filter(Boolean)
      : [];
    const roomIds = Array.from(new Set([...channelRoomIds, ...friendRoomIds]));
    await Promise.all(roomIds.map(joinMessageRoom));
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

  const sendMessageOverSocket = async (channel, body, clientNonce) => {
    const roomId = String(channel?.room || '').trim();
    if (!roomId) throw new Error('Room is required.');
    const socket = await ensureChatSocket();
    if (!socket.connected) throw new Error('Socket is not connected.');

    const response = await new Promise((resolve, reject) => {
      socket.timeout(15000).emit('send_message', {
        roomId,
        body,
        clientId: getTlkClientId(),
        deviceId: getChatDeviceId(),
        clientNonce
      }, (err, ack) => {
        if (err) {
          reject(new Error('Socket send timed out.'));
          return;
        }
        resolve(ack || {});
      });
    });

    if (!response.ok) {
      const error = new Error(response.msg || response.data?.msg || 'Failed to send message');
      error.status = Number(response.status || 500);
      error.body = response.data;
      throw error;
    }

    return response.message;
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
      sendBtn.disabled = slowmodeActive || messageOutbox.length >= OUTBOX_LIMIT;
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
      const room = String(state.currentChannel?.room || '').trim();
      const type = String(state.currentChannel?.type || '').trim().toLowerCase();
      const query = room
        ? `?room=${encodeURIComponent(room)}&type=${encodeURIComponent(type)}`
        : '';
      const data = await api(`/api/network/moderation${query}`);
      const slowmodeMs = Math.max(0, Number(data?.slowmodeMs || 0));
      state.slowmodeMs = slowmodeMs;
      state.slowmodeScope = String(data?.slowmodeScope || (slowmodeMs ? 'global' : 'none'));
      state.roomSlowmodeMs = Math.max(0, Number(data?.roomSlowmodeMs || 0));
      state.globalSlowmodeMs = Math.max(0, Number(data?.globalSlowmodeMs ?? data?.slowmodeMs ?? 0));
      state.lockdownActive = !!data?.lockdownActive;
      updateLockdownBanner();
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
    clearIncomingMessageRevealQueue();
    if (state.messageVisibilityHandler) {
      document.removeEventListener('visibilitychange', state.messageVisibilityHandler);
      window.removeEventListener('focus', state.messageVisibilityHandler);
      state.messageVisibilityHandler = null;
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

  const resetChatViewState = () => {
    state.messages = [];
    state.channels = [];
    state.currentChannel = null;
    state.roomEffect = null;
    state.user = null;
    state.mutualFriends = [];
    state.autoFollow = true;
    state.bannedMessage = '';
    state.pollTimer = null;
    state.metaTimer = null;
    state.composerNoticeTimer = null;
    state.mentionTimeout = null;
    state.slowmodeTimer = null;
    state.roomEffectTimer = null;
    state.flashbangCleanupTimer = null;
    state.sendMessageInFlight = false;
    state.presencePromise = null;
    state.joinPromise = null;
    state.joinRoomKey = '';
    state.lastMessagesRoomKey = '';
    const chatMessages = document.getElementById('chat-messages');
    if (chatMessages) chatMessages.innerHTML = '';
    const sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.innerHTML = '';
    document.body.classList.remove('flashbang-active');
    document.body.style.removeProperty('--flashbang-duration');
    document.querySelector('.flashbang-overlay')?.remove();
    clearRemoteTypingUsers();
  };

  const resetLocalChatIdentity = (opts = {}) => {
    const { clearNickname = false } = opts;
    if (clearNickname) {
      localStorage.removeItem('tlkNickname');
    }
    localStorage.removeItem('tlkParticipantToken');
    if (activeSocket) {
      activeSocket.disconnect();
      activeSocket = null;
      activeSocketOrigin = '';
    }
    joinedTypingRoomId = '';
    localTypingRoomId = '';
    localTypingActive = false;
    if (localTypingStopTimer) {
      clearTimeout(localTypingStopTimer);
      localTypingStopTimer = null;
    }
    lastTypingEmitAt = 0;
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

  const showConsoleAccountWarning = (message) => {
    const text = String(message || 'Console/API action detected. Your account has been warned.');
    console.warn(
      `%cACCOUNT WARNING\n${text}`,
      [
        'color:#fff',
        'background:#b00020',
        'font-size:26px',
        'font-weight:900',
        'line-height:1.35',
        'padding:12px 16px',
        'border:4px solid #ff4b5c',
        'border-radius:6px'
      ].join(';')
    );
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

    const showModalInput = ({ title, message, placeholder = '', submitText = 'Send', onSubmit, onCancel }) => {
      if (document.getElementById('modal-input-backdrop')) return;

      const backdrop = document.createElement('div');
      backdrop.id = 'modal-input-backdrop';
      Object.assign(backdrop.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100vw',
        height: '100vh',
        background: 'rgba(0, 0, 0, 0.7)',
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
      Object.assign(modal.style, {
        background: 'rgba(8, 12, 28, 0.98)',
        color: '#fff',
        fontFamily: 'Inter, system-ui, sans-serif',
        borderRadius: '1rem',
        padding: '1.5rem 1.75rem',
        maxWidth: 'min(90vw, 520px)',
        width: '100%',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      });

      const titleEl = document.createElement('div');
      titleEl.style.fontSize = '1.15rem';
      titleEl.style.fontWeight = '700';
      titleEl.textContent = title;
      modal.appendChild(titleEl);

      const textEl = document.createElement('div');
      textEl.style.fontSize = '0.95rem';
      textEl.style.lineHeight = '1.5';
      textEl.style.opacity = '0.85';
      textEl.textContent = message;
      modal.appendChild(textEl);

      const input = document.createElement('textarea');
      Object.assign(input.style, {
        width: '100%',
        minHeight: '100px',
        borderRadius: '0.75rem',
        border: '1px solid rgba(255,255,255,0.14)',
        background: 'rgba(255,255,255,0.05)',
        color: '#fff',
        padding: '12px',
        fontSize: '14px',
        fontFamily: 'Inter, system-ui, sans-serif',
        resize: 'vertical',
      });
      input.placeholder = placeholder;
      input.spellcheck = false;
      modal.appendChild(input);

      const actions = document.createElement('div');
      actions.style.display = 'flex';
      actions.style.justifyContent = 'flex-end';
      actions.style.gap = '0.75rem';

      const cancelBtn = document.createElement('button');
      cancelBtn.type = 'button';
      cancelBtn.textContent = 'Cancel';
      cancelBtn.style.cssText = 'border:none;border-radius:0.75rem;padding:0.65rem 1rem;background:rgba(255,255,255,0.12);color:#fff;cursor:pointer;';
      cancelBtn.addEventListener('click', () => {
        backdrop.remove();
        if (typeof onCancel === 'function') onCancel();
      });
      actions.appendChild(cancelBtn);

      const submitBtn = document.createElement('button');
      submitBtn.type = 'button';
      submitBtn.textContent = submitText;
      submitBtn.style.cssText = 'border:none;border-radius:0.75rem;padding:0.65rem 1rem;background:var(--accent);color:#111;cursor:pointer;font-weight:700;';
      submitBtn.addEventListener('click', async () => {
        const value = String(input.value || '').trim();
        if (!value) {
          input.focus();
          return;
        }
        submitBtn.disabled = true;
        try {
          await onSubmit(value);
          backdrop.remove();
        } catch (error) {
          submitBtn.disabled = false;
        }
      });
      actions.appendChild(submitBtn);

      input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
          event.preventDefault();
          submitBtn.click();
        }
      });

      modal.appendChild(actions);
      backdrop.appendChild(modal);
      document.body.appendChild(backdrop);
      input.focus();
    };

    function openReportDialog(target) {
      const messageId = getMessageId(target);
      if (!messageId || !state.currentChannel?.room) return Promise.resolve(false);
      if (document.getElementById('report-message-backdrop')) return Promise.resolve(false);

      return new Promise((resolve) => {
        const categories = [
          { id: 'racism_hate', label: 'Racism / hate' },
          { id: 'threats', label: 'Threats' },
          { id: 'doxxing', label: 'Personal info' },
          { id: 'spam', label: 'Spam' },
          { id: 'other', label: 'Other' }
        ];
        let selectedCategory = categories[0].id;
        const backdrop = document.createElement('div');
        backdrop.id = 'report-message-backdrop';
        backdrop.className = 'modal-overlay report-modal-overlay';
        backdrop.innerHTML = `
          <div class="report-modal" role="dialog" aria-modal="true" aria-labelledby="report-modal-title">
            <div class="report-modal-head">
              <div>
                <div id="report-modal-title" class="report-modal-title">Report message</div>
                <div class="report-modal-subtitle">Admins will see the message, sender, room, and your reason.</div>
              </div>
              <button type="button" class="report-modal-close" data-report-close aria-label="Close">×</button>
            </div>
            <div class="report-quote">
              <span>Message from ${esc(getUsername(target) || 'Unknown')}</span>
              <p>${esc(getMessageQuote(target) || 'No message preview')}</p>
            </div>
            <div class="report-category-grid">
              ${categories.map((category) => `
                <button type="button" class="report-category ${category.id === selectedCategory ? 'active' : ''}" data-report-category="${esc(category.id)}">${esc(category.label)}</button>
              `).join('')}
            </div>
            <label class="report-field">
              <span>What should admins know?</span>
              <textarea id="report-reason-input" maxlength="700" placeholder="Add context so admins can make the right call."></textarea>
            </label>
            <div class="report-modal-actions">
              <button type="button" class="btn btn-secondary btn-sm" data-report-close>Cancel</button>
              <button type="button" class="btn btn-danger btn-sm" id="report-submit-btn">Submit report</button>
            </div>
          </div>
        `;
        const close = (result = false) => {
          backdrop.remove();
          resolve(result);
        };
        backdrop.querySelectorAll('[data-report-close]').forEach((btn) => btn.addEventListener('click', () => close(false)));
        backdrop.addEventListener('click', (event) => {
          if (event.target === backdrop) close(false);
        });
        backdrop.querySelectorAll('[data-report-category]').forEach((btn) => {
          btn.addEventListener('click', () => {
            selectedCategory = String(btn.getAttribute('data-report-category') || 'other');
            backdrop.querySelectorAll('[data-report-category]').forEach((item) => item.classList.toggle('active', item === btn));
          });
        });
        const input = backdrop.querySelector('#report-reason-input');
        const submitBtn = backdrop.querySelector('#report-submit-btn');
        submitBtn?.addEventListener('click', async () => {
          const reason = String(input?.value || '').trim();
          if (!reason) {
            input?.focus();
            showToast('Add a reason before submitting', 'error');
            return;
          }
          submitBtn.disabled = true;
          submitBtn.textContent = 'Submitting...';
          try {
            const response = await api('/api/network/reports', {
              method: 'POST',
              body: {
                room: state.currentChannel.room,
                messageId,
                reasonCategory: selectedCategory,
                reason,
                targetUsername: getUsername(target),
                targetUserId: getUserId(target),
                targetToken: target?.user_token || target?.senderId || '',
                quote: getMessageQuote(target)
              }
            });
            const meta = getRoomMeta();
            meta.reports = Array.isArray(meta.reports) ? meta.reports : [];
            meta.reports.unshift({
              id: messageId,
              serverReportId: response?.report?.id || '',
              status: 'open',
              reasonCategory: selectedCategory,
              reason,
              reporter: getCurrentUsername(),
              target: getUsername(target),
              quote: getMessageQuote(target),
              at: new Date().toISOString()
            });
            pushRoomLog(`Report filed for ${getUsername(target) || 'a user'}`);
            saveRoomMetaStore();
            renderMessages();
            showToast('Report sent to admins', 'success');
            close(true);
          } catch (error) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit report';
            showToast(error.message || 'Could not submit report', 'error');
          }
        });
        document.body.appendChild(backdrop);
        input?.focus();
      });
    }

    async function openModerationReportsPanel() {
      if (!isAdminOrOwner()) {
        showToast('Only admins and owners can view moderation reports', 'error');
        return;
      }
      if (document.getElementById('report-center-backdrop')) return;
      const room = String(state.currentChannel?.room || '').trim();
      const meta = getRoomMeta();
      const localLogs = Array.isArray(meta.modLog) ? meta.modLog : [];
      let reports = [];
      try {
        const data = await api(`/api/network/reports?room=${encodeURIComponent(room)}&status=all`);
        reports = Array.isArray(data?.reports) ? data.reports : [];
      } catch (error) {
        reports = Array.isArray(meta.reports) ? meta.reports.map((report) => ({
          id: report.serverReportId || report.id,
          messageId: report.id,
          room,
          status: report.status || 'open',
          reasonCategory: report.reasonCategory || 'other',
          reason: report.reason || '',
          reporterUsername: report.reporter || 'Unknown',
          targetUsername: report.target || 'Unknown',
          quote: report.quote || '',
          createdAt: report.at || new Date().toISOString()
        })) : [];
        showToast(error.message || 'Showing local reports only', 'error');
      }

      const openCount = reports.filter((report) => String(report.status || 'open') === 'open').length;
      const backdrop = document.createElement('div');
      backdrop.id = 'report-center-backdrop';
      backdrop.className = 'modal-overlay report-modal-overlay';
      backdrop.innerHTML = `
        <div class="report-center" role="dialog" aria-modal="true" aria-labelledby="report-center-title">
          <div class="report-modal-head">
            <div>
              <div id="report-center-title" class="report-modal-title">Moderation reports</div>
              <div class="report-modal-subtitle">${openCount} open report${openCount === 1 ? '' : 's'} in this room</div>
            </div>
            <button type="button" class="report-modal-close" data-report-center-close aria-label="Close">×</button>
          </div>
          <div class="report-center-list">
            ${reports.length ? reports.map((report) => `
              <div class="report-card report-status-${esc(report.status || 'open')}">
                <div class="report-card-top">
                  <span class="report-status">${esc(report.status || 'open')}</span>
                  <span>${esc(new Date(report.createdAt || report.at || Date.now()).toLocaleString())}</span>
                </div>
                <div class="report-card-title">${esc(report.reporterUsername || report.reporter || 'Unknown')} reported ${esc(report.targetUsername || report.target || 'Unknown')}</div>
                <div class="report-card-reason"><strong>${esc(report.reasonCategory || 'other')}</strong>: ${esc(report.reason || 'No reason provided')}</div>
                <blockquote>${esc(report.quote || 'No message preview')}</blockquote>
                ${report.modNote ? `<div class="report-card-note">Note: ${esc(report.modNote)}</div>` : ''}
                <div class="report-card-actions">
                  <button type="button" class="btn btn-secondary btn-sm" data-report-status="reviewing" data-report-server-id="${esc(report.id || '')}">Reviewing</button>
                  <button type="button" class="btn btn-primary btn-sm" data-report-status="resolved" data-report-server-id="${esc(report.id || '')}">Resolve</button>
                  <button type="button" class="btn btn-secondary btn-sm" data-report-status="dismissed" data-report-server-id="${esc(report.id || '')}">Dismiss</button>
                  <button type="button" class="btn btn-secondary btn-sm" data-report-warn="${esc(report.targetUsername || report.target || '')}" data-report-reason="${esc(report.reason || 'Reported message')}">Warn</button>
                  <button type="button" class="btn btn-danger btn-sm" data-report-ban="${esc(report.targetUsername || report.target || '')}" data-report-reason="${esc(report.reason || 'Reported message')}">Ban room</button>
                </div>
              </div>
            `).join('') : '<div class="report-empty">No reports for this room.</div>'}
          </div>
          ${localLogs.length ? `
            <div class="report-log-section">
              <div class="report-log-title">Recent mod log</div>
              ${localLogs.slice(0, 12).map((log) => `<div class="report-log-line">${esc(new Date(log.at || Date.now()).toLocaleString())} · ${esc(log.actor || 'System')} · ${esc(log.text || '')}</div>`).join('')}
            </div>
          ` : ''}
        </div>
      `;
      const close = () => backdrop.remove();
      backdrop.querySelectorAll('[data-report-center-close]').forEach((btn) => btn.addEventListener('click', close));
      backdrop.addEventListener('click', (event) => {
        if (event.target === backdrop) close();
      });
      backdrop.querySelectorAll('[data-report-status]').forEach((btn) => {
        btn.addEventListener('click', async () => {
          const reportId = String(btn.getAttribute('data-report-server-id') || '').trim();
          const status = String(btn.getAttribute('data-report-status') || '').trim();
          if (!reportId || !status) return;
          btn.disabled = true;
          try {
            await api(`/api/network/reports/${encodeURIComponent(reportId)}`, {
              method: 'PATCH',
              body: { status }
            });
            pushRoomLog(`Report ${status}`);
            close();
            await openModerationReportsPanel();
          } catch (error) {
            btn.disabled = false;
            showToast(error.message || 'Could not update report', 'error');
          }
        });
      });
      backdrop.querySelectorAll('[data-report-warn], [data-report-ban]').forEach((btn) => {
        btn.addEventListener('click', async () => {
          const isBan = btn.hasAttribute('data-report-ban');
          const target = String(btn.getAttribute(isBan ? 'data-report-ban' : 'data-report-warn') || '').trim();
          const reason = String(btn.getAttribute('data-report-reason') || 'Reported message').trim();
          if (!target || target.toLowerCase() === 'unknown') {
            showToast('Report has no target user', 'error');
            return;
          }
          btn.disabled = true;
          try {
            await api('/api/network/mod/actions', {
              method: 'POST',
              body: {
                action: isBan ? 'ban' : 'warn',
                target,
                room,
                reason
              }
            });
            pushRoomLog(`${isBan ? 'Room ban' : 'Warning'} from report for ${target}`);
            showToast(isBan ? 'User banned from room' : 'User warned', 'success');
          } catch (error) {
            showToast(error.message || 'Moderation action failed', 'error');
          } finally {
            btn.disabled = false;
          }
        });
      });
      document.body.appendChild(backdrop);
    }

    const refreshPresence = async () => {
      const updateUI = () => {
        try {
          const count = Number(state.currentChannel.onlineCount || 0);
          const headerCount = document.getElementById('header-online-count');
          if (headerCount) {
            headerCount.textContent = `${count} online`;
            headerCount.className = count > 0 ? 'header-online has-users' : 'header-online';
          }
        } catch {}
        renderSidebar();
        updateMemberList();
      };

      if (!state.presencePromise) {
        state.presencePromise = (async () => {
          try {
            const presenceData = await api('/api/network/presence');
            if (presenceData && typeof presenceData === 'object') {
              const rooms = presenceData.rooms || {};
              state.presenceUsersByRoom = presenceData.users && typeof presenceData.users === 'object'
                ? presenceData.users
                : {};
              if (Array.isArray(state.channels)) {
                state.channels.forEach((channel) => {
                  const roomKey = String(channel.room || '').trim().toLowerCase();
                  channel.onlineCount = Number(rooms[roomKey] || 0);
                });
              }
            }
          } catch (err) {
            console.warn('Failed to fetch presence:', err);
          }
        })();
      }

      try {
        await state.presencePromise;
      } finally {
        state.presencePromise = null;
        updateUI();
      }
    };

  const mapChannels = (networkData) => {
    if (!networkData || !networkData.sites) return [];
    const channels = [];

    const globalRoom = String(networkData.globalRoom || '').trim().toLowerCase();
    if (globalRoom) {
      channels.push({
        _id: 'global',
        name: '#global',
        room: globalRoom,
        type: 'public',
        users: [],
        onlineCount: 0,
        description: `Global chat at tlk.io/${globalRoom}`,
        url: `https://tlk.io/${globalRoom}`
      });
    }

    networkData.sites.forEach((site) => {
      channels.push({
        _id: String(site.id || site.room || '').trim().toLowerCase(),
        name: `#${String(site.channelName || site.room || site.name || '').trim().toLowerCase()}`,
        room: String(site.room || site.id || '').trim().toLowerCase(),
        type: 'public',
        users: [],
        onlineCount: 0,
        description: site.name || '',
        url: site.url || ''
      });
    });

    return channels;
  };

  const buildGroupChannel = (roomId, name, createdAt, members) => {
    const normalized = String(roomId || '').trim().toLowerCase();
    if (!normalized) return null;
    return {
      _id: `group:${normalized}`,
      room: normalized,
      name: String(name || `Group ${normalized}`).trim(),
      type: 'group',
      onlineCount: 0,
      users: [],
      members: Array.isArray(members) ? members : [],
      createdAt: Number(createdAt) || Date.now()
    };
  };

  const loadHiddenGroupRooms = () => {
    try {
      const raw = localStorage.getItem('tlkHiddenGroupChats');
      const saved = Array.isArray(JSON.parse(raw || '[]')) ? JSON.parse(raw || '[]') : [];
      return saved
        .filter((entry) => typeof entry === 'string')
        .map((entry) => String(entry || '').trim().toLowerCase())
        .filter(Boolean);
    } catch (_err) {
      return [];
    }
  };

  const saveHiddenGroupRooms = (rooms = []) => {
    try {
      const roomIds = Array.isArray(rooms)
        ? rooms.map((room) => String(room || '').trim().toLowerCase()).filter(Boolean)
        : [];
      localStorage.setItem('tlkHiddenGroupChats', JSON.stringify([...new Set(roomIds)]));
    } catch (_err) {
    }
  };

  const addHiddenGroupRoom = (room) => {
    const normalized = String(room || '').trim().toLowerCase();
    if (!normalized) return;
    const hidden = loadHiddenGroupRooms();
    if (!hidden.includes(normalized)) {
      saveHiddenGroupRooms([...hidden, normalized]);
    }
  };

  const removeHiddenGroupRoom = (room) => {
    const normalized = String(room || '').trim().toLowerCase();
    if (!normalized) return;
    const hidden = loadHiddenGroupRooms().filter((roomId) => roomId !== normalized);
    saveHiddenGroupRooms(hidden);
  };

  const loadHiddenDmRooms = () => {
    try {
      const raw = localStorage.getItem('tlkHiddenDirectMessages');
      const saved = Array.isArray(JSON.parse(raw || '[]')) ? JSON.parse(raw || '[]') : [];
      return saved
        .filter((entry) => typeof entry === 'string')
        .map((entry) => String(entry || '').trim().toLowerCase())
        .filter(Boolean);
    } catch (_err) {
      return [];
    }
  };

  const saveHiddenDmRooms = (rooms = []) => {
    try {
      const roomIds = Array.isArray(rooms)
        ? rooms.map((room) => String(room || '').trim().toLowerCase()).filter(Boolean)
        : [];
      localStorage.setItem('tlkHiddenDirectMessages', JSON.stringify([...new Set(roomIds)]));
    } catch (_err) {
    }
  };

  const isHiddenDmRoom = (room) => {
    const normalized = String(room || '').trim().toLowerCase();
    return !!normalized && loadHiddenDmRooms().includes(normalized);
  };

  const addHiddenDmRoom = (room) => {
    const normalized = String(room || '').trim().toLowerCase();
    if (!normalized) return;
    const hidden = loadHiddenDmRooms();
    if (!hidden.includes(normalized)) saveHiddenDmRooms([...hidden, normalized]);
  };

  const removeHiddenDmRoom = (room) => {
    const normalized = String(room || '').trim().toLowerCase();
    if (!normalized) return;
    saveHiddenDmRooms(loadHiddenDmRooms().filter((roomId) => roomId !== normalized));
  };

  const loadSavedGroupChannels = () => {
    try {
      const raw = localStorage.getItem('tlkGroupChats');
      const saved = Array.isArray(JSON.parse(raw || '[]')) ? JSON.parse(raw || '[]') : [];
      const hiddenRooms = new Set(loadHiddenGroupRooms());
      const now = Date.now();
      const maxAge = 2 * 24 * 60 * 60 * 1000;
      return saved.map((item) => {
        if (typeof item === 'string') {
          return buildGroupChannel(item, `Group ${item}`, now, []);
        }
        const room = String(item.room || item._id || '').trim().toLowerCase();
        const name = String(item.name || `Group ${room}`).trim();
        const createdAt = Number(item.createdAt) || now;
        const members = Array.isArray(item.members) ? item.members : [];
        return buildGroupChannel(room, name, createdAt, members);
      }).filter((group) => {
        if (!group) return false;
        if (hiddenRooms.has(group.room)) return false;
        const age = now - Number(group.createdAt || now);
        if (age >= maxAge && (group.members.length < 3 || group.members.length === 0)) return false;
        return true;
      });
    } catch (_err) {
      return [];
    }
  };

  const saveGroupChannels = (channels = []) => {
    try {
      const groupData = Array.isArray(channels)
        ? channels.map((c) => ({
            room: String(c.room || '').trim(),
            name: String(c.name || `Group ${c.room || ''}`).trim(),
            createdAt: Number(c.createdAt) || Date.now(),
            members: Array.isArray(c.members) ? c.members : []
          }))
        : [];
      localStorage.setItem('tlkGroupChats', JSON.stringify(groupData));
    } catch (_err) {
    }
  };

  const loadServerGroupChannels = async () => {
    try {
      const data = await api('/api/group-chats');
      const hiddenRooms = new Set(loadHiddenGroupRooms());
      if (!Array.isArray(data?.groups)) return loadSavedGroupChannels();
      return data.groups
        .map((group) => buildGroupChannel(group.room, group.name, group.createdAt, group.members))
        .filter((group) => group && !hiddenRooms.has(group.room));
    } catch (_err) {
      return loadSavedGroupChannels();
    }
  };

  const promptGroupName = () => new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;width:100vw;height:100vh;display:flex;align-items:center;justify-content:center;z-index:1000000;background:rgba(0,0,0,0.75);backdrop-filter:blur(6px);margin:0;padding:0;border:none;pointer-events:auto;';
    overlay.innerHTML = `
      <div class="modal-dialog" style="position:relative;width:min(420px,calc(100% - 32px));max-width:420px;background:var(--bg-main);border:1px solid var(--border);border-radius:18px;padding:24px;box-shadow:0 25px 80px rgba(0,0,0,0.5);max-height:80vh;overflow-y:auto;">
        <h3>Create Group Chat</h3>
        <p>Enter a room name, then share the 5-letter code with your friends.</p>
        <p style="font-size:12px;color:var(--text-3);margin-top:8px;">Groups with fewer than 3 members are deleted after 2 days. Leave if you no longer need the room.</p>
        <input id="group-name-input" type="text" placeholder="Group name" maxlength="32" style="width:100%;border:1px solid var(--border);border-radius:10px;background:var(--bg-input);color:var(--text-normal);padding:10px 12px;margin:16px 0;" />
        <div class="modal-actions" style="display:flex;justify-content:flex-end;gap:8px;">
          <button id="cancel-group-create" class="btn btn-secondary btn-sm" type="button">Cancel</button>
          <button id="confirm-group-create" class="btn btn-primary btn-sm" type="button">Create</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);

    const cleanup = (value) => {
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
      resolve(value);
    };

    const input = overlay.querySelector('#group-name-input');
    const cancelBtn = overlay.querySelector('#cancel-group-create');
    const confirmBtn = overlay.querySelector('#confirm-group-create');

    const onConfirm = () => {
      const value = String(input?.value || '').trim();
      if (!value) {
        input?.focus();
        return;
      }
      cleanup(value);
    };

    cancelBtn?.addEventListener('click', () => cleanup(null));
    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) cleanup(null);
    });
    input?.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') onConfirm();
    });
    confirmBtn?.addEventListener('click', onConfirm);
    input?.focus();
  });

  const promptJoinGroupCode = () => new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;width:100vw;height:100vh;display:flex;align-items:center;justify-content:center;z-index:1000000;background:rgba(0,0,0,0.75);backdrop-filter:blur(6px);margin:0;padding:0;border:none;pointer-events:auto;';
    overlay.innerHTML = `
      <div class="modal-dialog" style="position:relative;width:min(420px,calc(100% - 32px));max-width:420px;background:var(--bg-main);border:1px solid var(--border);border-radius:18px;padding:24px;box-shadow:0 25px 80px rgba(0,0,0,0.5);max-height:80vh;overflow-y:auto;">
        <h3>Join Group Chat</h3>
        <p>Enter the 5-letter room code from your friend.</p>
        <input id="join-code-input" type="text" placeholder="Room code (e.g., abcde)" maxlength="5" style="text-transform:lowercase;width:100%;border:1px solid var(--border);border-radius:10px;background:var(--bg-input);color:var(--text-normal);padding:10px 12px;margin:16px 0;" />
        <div class="modal-actions" style="display:flex;justify-content:flex-end;gap:8px;">
          <button id="cancel-join-group" class="btn btn-secondary btn-sm" type="button">Cancel</button>
          <button id="confirm-join-group" class="btn btn-primary btn-sm" type="button">Join</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);

    const cleanup = (value) => {
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
      resolve(value);
    };

    const input = overlay.querySelector('#join-code-input');
    const cancelBtn = overlay.querySelector('#cancel-join-group');
    const confirmBtn = overlay.querySelector('#confirm-join-group');

    const onConfirm = () => {
      const value = String(input?.value || '').trim().toLowerCase();
      if (!value || value.length !== 5) {
        input?.focus();
        return;
      }
      cleanup(value);
    };

    cancelBtn?.addEventListener('click', () => cleanup(null));
    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) cleanup(null);
    });
    input?.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') onConfirm();
    });
    confirmBtn?.addEventListener('click', onConfirm);
    input?.focus();
  });

  const joinGroupChat = async (roomCode) => {
    const normalized = String(roomCode || '').trim().toLowerCase();
    if (!normalized || normalized.length !== 5) return null;
    let groupMeta = null;
    try {
      const data = await api(`/api/group-chats/${encodeURIComponent(normalized)}/join`, { method: 'POST' });
      groupMeta = data?.group;
    } catch (err) {
      showToast(err.message || 'Room code not active or invalid', 'error');
      return null;
    }
    if (!groupMeta) return null;

    removeHiddenGroupRoom(normalized);
    let existingGroup = state.channels.find((c) => c.type === 'group' && c.room === normalized);
    if (!existingGroup) {
      existingGroup = buildGroupChannel(normalized, groupMeta.name, groupMeta.createdAt, groupMeta.members);
      if (!existingGroup) return null;
      state.channels.push(existingGroup);
    } else {
      existingGroup.name = groupMeta.name;
      existingGroup.createdAt = groupMeta.createdAt;
      existingGroup.members = groupMeta.members;
    }

    saveGroupChannels(state.channels.filter((c) => c.type === 'group'));
    renderSidebar();
    await joinMessageRoom(normalized);
    return existingGroup;
  };

  const createGroupChat = async (name) => {
    let groupMeta = null;
    try {
      const data = await api('/api/group-chats', { method: 'POST', body: { name } });
      groupMeta = data?.group;
    } catch (err) {
      showToast(err.message || 'Failed to create group chat', 'error');
      return null;
    }
    if (!groupMeta) return null;

    const channel = buildGroupChannel(groupMeta.room, groupMeta.name, groupMeta.createdAt, groupMeta.members);
    if (!channel) return null;
    removeHiddenGroupRoom(channel.room);
    state.channels = [channel, ...state.channels.filter((c) => c._id !== channel._id)];
    saveGroupChannels(state.channels.filter((c) => c.type === 'group'));
    return channel;
  };

  const leaveGroupChat = async (channelId) => {
    const normalizedId = String(channelId || '').trim();
    const channel = state.channels.find((c) => c._id === normalizedId && c.type === 'group');
    if (!channel) return;
    if (channel.room) {
      try {
        await api(`/api/group-chats/${encodeURIComponent(channel.room)}/leave`, { method: 'POST' });
      } catch (err) {
        // If the group doesn't exist on server (404), just continue with local cleanup
        if (err.status !== 404) {
          showToast(err.message || 'Failed to leave group', 'error');
          return;
        }
      }
    }
    if (channel && channel.room) {
      void leaveMessageRoom(channel.room);
      addHiddenGroupRoom(channel.room);
      delete state.unreadCounts[channel.room];
      saveUnreadCounts();
    }
    state.channels = state.channels.filter((c) => c._id !== normalizedId);
    saveGroupChannels(state.channels.filter((c) => c.type === 'group'));
    renderSidebar();
    const fallback = state.channels.find((c) => c.type !== 'group' && c.type !== 'dm') || state.channels[0] || null;
    if (fallback) navigate(`/channels/${encodeURIComponent(fallback._id)}`);
  };

  const loadChannels = async () => {
    const networkData = await api('/api/network/sites');
    const groupChannels = await loadServerGroupChannels();
    state.channels = [...groupChannels, ...mapChannels(networkData)];
    await refreshPresence();
    return state.channels;
  };

  const loadUser = async () => {
    try {
      const data = await api('/api/auth');
      if (data?.user) applyUserSnapshot(data.user);
    } catch (err) {
      if (err?.status === 401 || /token is not valid|authorization denied|no token/i.test(String(err?.message || ''))) {
        setToken('');
        applyUserSnapshot(null);
        return;
      }
      console.warn('Failed to load user data:', err);
      const savedUser = sessionStorage.getItem('user') || localStorage.getItem('user');
      if (savedUser) {
        try {
          applyUserSnapshot(JSON.parse(savedUser));
        } catch {}
      }
    }
  };

  const getCurrentChannel = (channelId) => {
    const normalizedId = String(channelId || '').trim();
    const existing = state.channels.find((c) => c._id === normalizedId || c.room === normalizedId);
    if (existing) return existing;
    if (!normalizedId) return state.channels[0] || null;
    if (normalizedId.startsWith('dm:')) {
      const username = normalizedId.slice(3).trim();
      const dmChannel = buildDmChannel(username);
      if (dmChannel) return dmChannel;
    }
    const isDm = normalizedId.length === 8 && /^[a-z]+$/.test(normalizedId);
    return {
      _id: normalizedId,
      room: normalizedId,
      name: isDm ? `DM ${normalizedId}` : `#${normalizedId}`,
      type: isDm ? 'dm' : 'public',
      onlineCount: 0,
      users: []
    };
  };

  const getPreferredLaunchChannelId = async () => {
    let networkData = null;
    try {
      networkData = await api('/api/network/sites');
    } catch (_err) {
      networkData = null;
    }

    if (!state.channels.length) {
      try {
        await loadChannels();
      } catch (_err) {
        // ignore load failure and use whatever channels we have
      }
    }

    const localSiteId = String(networkData?.localSiteId || '').trim().toLowerCase();
    if (localSiteId) {
      const localChannel = state.channels.find((c) => {
        const id = String(c._id || '').trim().toLowerCase();
        const room = String(c.room || '').trim().toLowerCase();
        return id === localSiteId || room === localSiteId;
      });
      if (localChannel) return localChannel._id;
    }

    const fallbackChannel = state.channels.find((c) => c.type !== 'group' && c.type !== 'dm');
    return fallbackChannel?._id || state.channels[0]?._id || '';
  };

  const joinRoom = async (channel) => {
    if (!channel) return;
    const roomKey = String(channel.room || '').trim();
    if (state.joinPromise && state.joinRoomKey === roomKey) return state.joinPromise;
    let nickname = String(state.user?.username || state.user?.name || localStorage.getItem('tlkNickname') || '').trim();
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
    const currentUsername = String(state.user?.username || state.user?.name || '').trim().toLowerCase();
    const isMentioned = mentions.some(m => m.toLowerCase() === currentUsername);

    if (currentUsername && isMentioned) {
      maybeNotifyMessage(msg, channel, 'mention');
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

  const getMessages = async (channel, fetchNewOnly = false, options = {}) => {
    if (!channel) return [];
    const roomKey = String(channel.room || '').trim();
    // Mark messages as read when loading
    if (Number(state.unreadCounts?.[roomKey] || 0) > 0) {
      state.unreadCounts[roomKey] = 0;
      saveUnreadCounts();
      renderSidebar();
    }

    const liveFetch = !!options.live || !!options.noCache;
    const requestMode = `${fetchNewOnly ? 'incremental' : 'full'}:${liveFetch ? 'live' : 'cached'}`;
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

      const query = new URLSearchParams({ limit: '100' });
      const useIncrementalFetch = fetchNewOnly && !!lastMessageId;
      if (useIncrementalFetch) query.set('afterId', lastMessageId);
      if (liveFetch) query.set('noCache', '1');

      const messages = await api(`/api/tlk/rooms/${encodeURIComponent(channel.room)}/messages?${query.toString()}`, {
        headers,
        cache: liveFetch ? 'no-store' : undefined
      });
      if (state.currentChannel?._id !== channel._id) return [];
      const nextMessages = sortMessagesChronologically(Array.isArray(messages) ? messages : []);
      const inferredRoomEffect = nextMessages.find((msg) => msg?.roomEffect)?.roomEffect || null;
      if (inferredRoomEffect) setRoomEffectState(inferredRoomEffect);

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
          normalizeMessageOrder();
          state.lastMessagesSignature = getMessagesSignature(state.messages);
          renderMessages();
        } else if (hadBannedMessage) {
          renderMessages();
        }

        return state.messages;
      }

      const nextSignature = getMessagesSignature(nextMessages);
      const changed = nextSignature !== state.lastMessagesSignature;

      if (changed) {
        const oldIds = new Set(state.messages.map((message) => getMessageId(message)).filter(Boolean));
        const hasSyncedThisRoom = state.lastMessagesRoomKey === roomKey && !!state.lastMessagesSignature;
        const isInitialLoad = !hasSyncedThisRoom || state.messages.length === 0;
        const revealQueueActive = incomingMessageRevealRoomId === roomKey && (incomingMessageRevealQueue.length > 0 || incomingMessageRevealIds.size > 0);
        const newMessages = !isInitialLoad
          ? nextMessages.filter((message) => {
              const messageId = getMessageId(message);
              return messageId && !oldIds.has(messageId) && !incomingMessageRevealIds.has(messageId);
            })
          : [];

        if (nextMessages.length === 0) {
          clearIncomingMessageRevealQueue();
          state.messages = mergeMessageSnapshot([]);
        } else if (!isInitialLoad && liveFetch && (newMessages.length > 1 || revealQueueActive)) {
          if (newMessages.length > 0) enqueueIncomingMessages(newMessages, channel);
          const hiddenIds = new Set(incomingMessageRevealIds);
          state.messages = mergeMessageSnapshot(nextMessages.filter((message) => {
            const messageId = getMessageId(message);
            return !messageId || !hiddenIds.has(messageId);
          }));
        } else {
          if (isInitialLoad) markMessagesAsRendered(nextMessages);
          else newMessages.forEach((message) => notifyMentions(message, channel));
          state.messages = mergeMessageSnapshot(nextMessages);
        }
      }

      state.lastMessagesSignature = nextSignature;
      state.lastMessagesRoomKey = roomKey;
      state.lastFullMessageSyncAt = Date.now();
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
          if (isWarning || /console|devtools|api action/i.test(String(lastAlert?.message || ''))) {
            showConsoleAccountWarning(lastAlert?.message || 'Console/API action detected. Your account has been warned.');
          }
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
    const senderUserId = String(msg?.userId || msg?.senderUserId || msg?.sender?.userId || msg?.sender?.id || '').trim();
    const currentUserId = String(state.user?._id || state.user?.id || '').trim();
    const senderToken = String(msg?.user_token || msg?.senderId || msg?.sender?._id || '').trim();
    const localToken = String(localStorage.getItem('tlkParticipantToken') || '').trim();
    return !!((senderUserId && currentUserId && senderUserId === currentUserId) ||
              (senderToken && localToken && senderToken === localToken));
  };

  const canDelete = (msg) => {
    const role = String(state.user?.role || '').toLowerCase();
    return !msg?.deleted && (isMine(msg) || role === 'owner' || role === 'admin');
  };

  const deleteMessageFast = async (id, senderToken = '', options = {}) => {
    const messageId = String(id || '').trim();
    if (!messageId || !state.currentChannel) return false;
    const target = state.messages.find((message) => getMessageId(message) === messageId);
    if (!target || !canDelete(target)) return false;

    const previousMessages = state.messages;
    state.messages = state.messages.map((message) =>
      getMessageId(message) === messageId
        ? { ...message, deleted: true, body: '', content: '' }
        : message
    );
    state.lastMessagesSignature = getMessagesSignature(state.messages);
    renderMessages();

    try {
      await api(`/api/tlk/rooms/${encodeURIComponent(state.currentChannel.room)}/messages/${encodeURIComponent(messageId)}/delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-tlk-client-id': getTlkClientId(), 'x-chat-device-id': getChatDeviceId() },
        body: { senderToken: String(senderToken || '').trim() }
      });
      if (!options.silent) showToast('Message deleted');
      await getMessages(state.currentChannel, true).catch(() => {});
      return true;
    } catch {
      try {
        await api(`/api/network/messages/${encodeURIComponent(messageId)}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: {
            senderToken: String(senderToken || '').trim(),
            callerToken: String(localStorage.getItem('tlkParticipantToken') || '')
          }
        });
        if (!options.silent) showToast('Message deleted');
        await getMessages(state.currentChannel, true).catch(() => {});
        return true;
      } catch (error) {
        state.messages = previousMessages;
        state.lastMessagesSignature = getMessagesSignature(state.messages);
        renderMessages();
        if (!options.silent) showToast(error.message || 'Could not delete message', 'error');
        return false;
      }
    }
  };

  const insertMentionForMessage = (message) => {
    const username = getUsername(message);
    if (!username) return;
    const input = document.getElementById('chat-input');
    if (!input) return;
    const pos = input.selectionStart ?? input.value.length;
    const mentionText = formatMention(username);
    const prefix = pos > 0 && input.value[pos - 1] !== ' ' ? ' ' : '';
    input.value = `${input.value.slice(0, pos)}${prefix}${mentionText} ${input.value.slice(pos)}`;
    const newPos = pos + prefix.length + mentionText.length + 1;
    input.selectionStart = input.selectionEnd = newPos;
    input.focus();
    renderCommandPanel(input.value);
  };

  const toggleReaction = (id, emoji) => {
    const messageId = String(id || '').trim();
    const cleanEmoji = String(emoji || '').trim();
    if (!messageId || !cleanEmoji) return;
    const meta = getRoomMeta();
    meta.reactions = meta.reactions || {};
    meta.reactions[messageId] = meta.reactions[messageId] || {};
    meta.reactions[messageId][cleanEmoji] = Array.isArray(meta.reactions[messageId][cleanEmoji])
      ? meta.reactions[messageId][cleanEmoji]
      : [];
    const username = getCurrentUsername();
    const index = meta.reactions[messageId][cleanEmoji].indexOf(username);
    if (index >= 0) meta.reactions[messageId][cleanEmoji].splice(index, 1);
    else meta.reactions[messageId][cleanEmoji].push(username);
    saveRoomMetaStore();
    renderMessages();
  };

  const bindMessageActions = (root) => {
    if (!root || root._messageActionsBound) return;
    root._messageActionsBound = true;
    root.addEventListener('mouseover', (event) => {
      const target = event.target?.closest?.('.msg-avatar[data-username], .msg-name[data-username]');
      if (!target || target.querySelector?.('.mention-tip')) return;
      const username = String(target.getAttribute('data-username') || '').trim();
      if (!username) return;
      target.style.position = 'relative';
      const mentionTip = document.createElement('div');
      mentionTip.className = 'mention-tip';
      mentionTip.textContent = formatMention(username);
      mentionTip.style.cssText = `
        position:absolute;top:-20px;left:50%;transform:translateX(-50%);
        background:var(--bg-card);color:var(--text-1);padding:2px 6px;
        border-radius:4px;font-size:11px;white-space:nowrap;
        border:1px solid var(--border-md);z-index:100;
      `;
      target.appendChild(mentionTip);
    });
    root.addEventListener('mouseout', (event) => {
      const target = event.target?.closest?.('.msg-avatar[data-username], .msg-name[data-username]');
      if (!target) return;
      target.querySelector?.('.mention-tip')?.remove();
    });
    root.addEventListener('click', async (event) => {
      const messageEl = event.target?.closest?.('.msg[data-message-id]');
      const messageId = String(messageEl?.getAttribute('data-message-id') || '').trim();
      const message = messageId ? state.messages.find((entry) => getMessageId(entry) === messageId) : null;

      if (event.altKey && messageEl && message && !event.target.closest('button,a,input,textarea,select')) {
        event.preventDefault();
        if (canDelete(message)) {
          await deleteMessageFast(messageId, messageEl.getAttribute('data-message-token') || '', { silent: true });
        }
        return;
      }

      const mentionTarget = event.target?.closest?.('.msg-avatar[data-username], .msg-name[data-username]');
      if (mentionTarget && !event.target.closest('button')) {
        const targetMessage = state.messages.find((entry) =>
          String(getUsername(entry)).trim().toLowerCase() === String(mentionTarget.getAttribute('data-username') || '').trim().toLowerCase()
        );
        if (targetMessage) insertMentionForMessage(targetMessage);
        return;
      }

      const deleteBtn = event.target?.closest?.('[data-delete-id]');
      if (deleteBtn) {
        await deleteMessageFast(deleteBtn.getAttribute('data-delete-id'), deleteBtn.getAttribute('data-delete-token'));
        return;
      }

      const retryBtn = event.target?.closest?.('[data-retry-nonce]');
      if (retryBtn) {
        retryQueuedMessage(retryBtn.getAttribute('data-retry-nonce'));
        return;
      }

      const copyBtn = event.target?.closest?.('[data-copy-id]');
      if (copyBtn) {
        const userId = String(copyBtn.getAttribute('data-copy-id') || '').trim();
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
        return;
      }

      const replyBtn = event.target?.closest?.('[data-reply-id]');
      if (replyBtn) {
        const target = state.messages.find((entry) => getMessageId(entry) === String(replyBtn.getAttribute('data-reply-id') || ''));
        if (!target) return;
        state.replyTarget = {
          id: getMessageId(target),
          name: getUsername(target) || 'Unknown',
          quote: getMessageQuote(target)
        };
        renderComposerReplyState();
        document.getElementById('chat-input')?.focus();
        return;
      }

      const reactBtn = event.target?.closest?.('[data-quick-react], [data-react-id]');
      if (reactBtn) {
        toggleReaction(
          String(reactBtn.getAttribute('data-quick-react') || reactBtn.getAttribute('data-react-id') || '').trim(),
          reactBtn.getAttribute('data-react-emoji')
        );
        return;
      }

      const reportBtn = event.target?.closest?.('[data-report-id]');
      if (reportBtn) {
        const target = state.messages.find((entry) => getMessageId(entry) === String(reportBtn.getAttribute('data-report-id') || ''));
        if (target) await openReportDialog(target);
        return;
      }

      if (event.target?.closest?.('[data-join-current-call]')) {
        if (canUseVoiceForChannel()) document.getElementById('btn-voice-chat')?.click();
      }
    });
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
    return String(msg?.userId || msg?.senderUserId || msg?.sender?.userId || msg?.sender?.id || '').trim();
  };

  const getUsername = (msg) => {
    return String(msg?.nickname || msg?.username || msg?.sender?.name || msg?.sender?.username || '').trim();
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
        if (data?.user) applyUserSnapshot(data.user);
        if (data?.user?.username) localStorage.setItem('tlkNickname', String(data.user.username));
        const defaultChannelId = await getPreferredLaunchChannelId();
        navigate(`/channels/${encodeURIComponent(defaultChannelId)}`);
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
              <label>Password</label>
              <input name="password" type="password" placeholder="At least 8 characters" required minlength="8" class="inp" autocomplete="new-password" />
            </div>
            <div class="field">
              <label>Confirm password</label>
              <input name="password2" type="password" placeholder="Repeat your password" required minlength="8" class="inp" autocomplete="new-password" />
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
      const payload = { username: String(fd.get('username') || '').trim(), password };
      try {
        const data = await api('/api/users', { method: 'POST', body: payload });
        resetChatViewState();
        resetLocalChatIdentity({ clearNickname: true });
        setToken(data?.token || '');
        if (data?.user) applyUserSnapshot(data.user);
        if (data?.user?.username) localStorage.setItem('tlkNickname', String(data.user.username));
        const defaultChannelId = await getPreferredLaunchChannelId();
        navigate(`/channels/${encodeURIComponent(defaultChannelId)}`);
      } catch (err) { errEl.textContent = err.message; errEl.classList.remove('hidden'); }
    });
  };

  /* ========== LAYOUT, SIDEBAR, MESSAGES ========== */
  const layoutShell = (contentHtml, footerHtml = '') => {
    const isStaff = ['owner', 'admin'].includes(String(state.user?.role || '').toLowerCase());
    const displayName = esc(state.user?.username || state.user?.name || 'Guest');
    const sidebarAvatarSrc = withAvatarVersion(state.user?.avatar || '');
    const channelName = esc(state.currentChannel?.name?.replace(/^#/, '') || 'general');
    const channelType = String(state.currentChannel?.type || 'public').toLowerCase();
    const isGroupChat = channelType === 'group';
    const channelIcon = channelType === 'dm' ? '@' : channelType === 'group' ? 'G' : '#';
    const channelKindLabel = channelType === 'dm' ? 'Direct message' : channelType === 'group' ? 'Group chat' : 'Public room';
    const roomEffectMeta = getRoomEffectMeta();
    const roomEffectLabel = getActiveRoomEffectId() === 'none'
      ? 'No room effect'
      : `${roomEffectMeta.name} live`;
    const coinLabel = formatCoinLabel(state.user?.coins);

    // --- NEW: Injected styles to improve sidebar and header professional look ---
    const professionalStyles = `
      <style>
        /* Main header */
        .main-header {
          min-height: 76px !important;
          padding: 14px 22px !important;
          gap: 14px !important;
          align-items: center !important;
          background:
            linear-gradient(180deg, rgba(255,255,255,0.055), rgba(255,255,255,0.025)),
            rgba(13, 15, 20, 0.88) !important;
          border-bottom: 1px solid rgba(255,255,255,0.08) !important;
          box-shadow: 0 1px 0 rgba(0,0,0,0.35), 0 10px 28px rgba(0,0,0,0.18) !important;
          backdrop-filter: blur(14px) !important;
          flex-wrap: nowrap !important;
        }
        .shell {
          min-width: 0;
          height: 100vh;
          height: 100dvh;
        }
        .main,
        .chat-container {
          min-width: 0;
          min-height: 0;
        }
        #main-content {
          min-height: 0;
        }
        .mobile-nav-toggle,
        .mobile-members-toggle {
          display: none;
          width: 36px;
          height: 36px;
          flex: 0 0 36px;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          background: rgba(255,255,255,0.055);
          color: var(--text-1);
          cursor: pointer;
        }
        .mobile-nav-toggle:hover,
        .mobile-members-toggle:hover {
          background: rgba(255,255,255,0.1);
        }
        .mobile-backdrop {
          display: none;
          position: fixed;
          inset: 0;
          z-index: 89;
          width: 100%;
          height: 100%;
          border: 0;
          padding: 0;
          background: rgba(0,0,0,0.52);
          backdrop-filter: blur(2px);
          cursor: default;
        }
        .main-header-icon {
          width: 38px;
          height: 38px;
          flex: 0 0 38px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.09);
          color: var(--text-1);
          font-size: 17px;
          font-weight: 800;
        }
        .main-header-meta {
          min-width: 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        .main-header-title-row {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
        }
        .main-header h2 {
          font-size: 20px !important;
          font-weight: 700 !important;
          letter-spacing: 0 !important;
          line-height: 1.15 !important;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .main-header-sub {
          display: flex;
          align-items: center;
          gap: 8px;
          min-width: 0;
          margin-top: 0;
          font-size: 12px;
          color: var(--text-3);
        }
        .room-kind-pill,
        .room-effect-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          min-height: 24px;
          padding: 0 9px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.045);
          color: var(--text-2);
          white-space: nowrap;
        }
        .room-effect-chip strong {
          color: var(--text-1);
          font-weight: 700;
        }
        .main-header-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-left: auto;
          flex: 0 0 auto;
          min-width: 0;
        }
        .main-header-actions .header-online,
        .main-header-actions .coin-chip {
          min-height: 30px;
          padding: 0 10px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.045);
          margin-left: 0;
        }
        .main-header-actions .coin-chip {
          color: var(--gold);
          font-weight: 700;
        }
        .main-header-actions .icon-btn.voice-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          min-width: 112px;
          height: 36px;
          padding: 0 12px;
          border-radius: 999px;
          border: 1px solid rgba(34,197,94,0.24);
          background: rgba(34,197,94,0.11);
          color: #d9f99d;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-right: 0;
          font-size: 12px;
          font-weight: 800;
          white-space: nowrap;
        }
        .main-header-actions .icon-btn.voice-btn svg {
          width: 16px;
          height: 16px;
          flex: 0 0 auto;
        }
        .voice-btn-label {
          line-height: 1;
        }
        .main-header-actions .icon-btn.voice-btn:hover {
          background: rgba(34,197,94,0.2);
          border-color: rgba(34,197,94,0.42);
          color: #ecfccb;
          box-shadow: 0 0 12px rgba(34,197,94,0.2);
        }
        .main-header-actions .icon-btn.voice-btn:active {
          background: rgba(34,197,94,0.25);
          transform: scale(0.95);
        }
        .main-header-actions .icon-btn.voice-btn.active {
          background: rgba(34,197,94,0.3);
          border-color: rgba(34,197,94,0.5);
          color: #ecfccb;
          box-shadow: 0 0 16px rgba(34,197,94,0.3), inset 0 0 8px rgba(34,197,94,0.1);
        }
        .voice-channel-section {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 10px 16px 12px;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.025);
        }
        .voice-channel-heading {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0;
          text-transform: uppercase;
          color: var(--text-3);
        }
        .voice-channel-card {
          display: grid;
          grid-template-columns: 34px minmax(0, 1fr) auto;
          align-items: center;
          gap: 10px;
          width: 100%;
          min-height: 48px;
          padding: 8px 10px;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 8px;
          background: rgba(255,255,255,0.045);
          color: var(--text-1);
          cursor: pointer;
          text-align: left;
        }
        .voice-channel-card:hover,
        .voice-channel-card.active {
          border-color: rgba(34,197,94,0.36);
          background: rgba(34,197,94,0.1);
        }
        .voice-channel-card.has-call:not(.active) {
          border-color: rgba(96,165,250,0.28);
        }
        .voice-channel-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
          border-radius: 8px;
          background: rgba(34,197,94,0.13);
          color: #bbf7d0;
        }
        .voice-channel-main {
          display: flex;
          flex-direction: column;
          min-width: 0;
          gap: 2px;
        }
        .voice-channel-main strong {
          font-size: 14px;
          line-height: 1.2;
        }
        .voice-channel-main span {
          font-size: 12px;
          color: var(--text-3);
        }
        .voice-channel-action {
          min-width: 52px;
          padding: 6px 10px;
          border-radius: 999px;
          background: rgba(255,255,255,0.07);
          color: var(--text-2);
          font-size: 12px;
          font-weight: 800;
          text-align: center;
        }
        .voice-participant-strip {
          display: inline-flex;
          align-items: center;
          margin-left: 2px;
          margin-right: 2px;
          padding: 2px 4px;
          min-height: 32px;
        }
        .voice-participant-strip.hidden {
          display: none;
        }
        .voice-strip-avatar {
          width: 30px;
          height: 30px;
          margin-left: -8px;
          border-radius: 50%;
          border: 2px solid rgba(13, 15, 20, 0.96);
          box-shadow: 0 0 0 1px rgba(255,255,255,0.14);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          color: #fff;
          font-size: 12px;
          font-weight: 800;
          line-height: 1;
        }
        .voice-strip-avatar:first-child {
          margin-left: 0;
        }
        .voice-strip-avatar img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
        }
        .voice-strip-extra {
          background: rgba(255,255,255,0.11) !important;
          color: var(--text-1);
          font-size: 11px;
        }
        .main-header.group-chat-header {
          min-height: 64px !important;
          justify-content: center !important;
        }
        .main-header.group-chat-header .main-header-icon,
        .main-header.group-chat-header .main-header-title-row,
        .main-header.group-chat-header .main-header-sub {
          display: none !important;
        }
        .main-header.group-chat-header .main-header-meta {
          flex: 1 1 auto;
          align-items: stretch;
          width: 100%;
        }

        /* Voice Call Panel */
        .voice-call-panel {
          position: absolute;
          left: 0;
          right: 236px;
          top: 76px;
          bottom: 0;
          z-index: 40;
          width: auto;
          min-width: 0;
          background:
            radial-gradient(circle at 50% 18%, rgba(34,197,94,0.12), transparent 34%),
            rgba(13, 15, 20, 0.97);
          border-left: 0;
          border-top: 1px solid rgba(255,255,255,0.08);
          display: flex;
          flex-direction: column;
          backdrop-filter: blur(14px);
          box-shadow: 0 -10px 40px rgba(0,0,0,0.35);
        }
        .voice-call-panel.hidden {
          display: none;
        }
        .voice-call-header {
          padding: 18px 24px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          background: rgba(255,255,255,0.02);
        }
        .voice-call-header h3 {
          margin: 0;
          font-size: 22px;
          font-weight: 800;
          color: var(--text-1);
        }
        .voice-call-subtitle {
          margin-top: 3px;
          color: var(--text-3);
          font-size: 12px;
        }
        .voice-leave-btn {
          min-width: 64px;
        }
        .voice-call-participants {
          flex: 1;
          padding: 32px;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 220px));
          align-content: start;
          justify-content: center;
          gap: 18px;
          overflow-y: auto;
        }
        .voice-participant {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          min-height: 170px;
          padding: 18px 16px;
          border-radius: 8px;
          background: rgba(255,255,255,0.035);
          border: 1px solid rgba(255,255,255,0.07);
          transition: all 0.2s ease;
        }
        .voice-participant:hover {
          background: rgba(255,255,255,0.04);
          border-color: rgba(255,255,255,0.08);
        }
        .voice-participant-avatar {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-raised);
          border: 2px solid rgba(255,255,255,0.08);
          font-size: 24px;
          font-weight: 600;
          color: var(--text-2);
          flex-shrink: 0;
        }
        .voice-participant-avatar img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
        }
        .voice-participant-info {
          flex: 1;
          min-width: 0;
          text-align: center;
        }
        .voice-participant-name {
          font-size: 14px;
          font-weight: 500;
          color: var(--text-1);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .voice-participant-status {
          font-size: 12px;
          color: var(--text-3);
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .voice-participant-status.speaking {
          color: #22c55e;
        }
        .voice-participant.speaking {
          background: rgba(34,197,94,0.15);
          border-color: rgba(34,197,94,0.4);
          box-shadow: 0 0 12px rgba(34,197,94,0.3);
          animation: speaking-pulse 1.5s ease-in-out infinite;
        }
        @keyframes speaking-pulse {
          0%, 100% { box-shadow: 0 0 12px rgba(34,197,94,0.3); }
          50% { box-shadow: 0 0 20px rgba(34,197,94,0.5); }
        }
        .voice-call-controls {
          padding: 20px;
          border-top: 1px solid rgba(255,255,255,0.08);
          display: flex;
          flex-direction: column;
          align-items: stretch;
          gap: 10px;
        }
        .voice-control-row {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }
        .mic-selector {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 6px;
          color: var(--text-2);
          padding: 8px 12px;
          font-size: 12px;
          min-width: 0;
          flex: 1 1 120px;
          cursor: pointer;
          transition: all 0.2s ease;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }
        .mic-selector:focus {
          outline: none;
          border-color: rgba(255,255,255,0.2);
          background: rgba(255,255,255,0.08);
        }
        .mic-selector option {
          background: rgba(13, 15, 20, 0.95);
          color: var(--text-1);
        }
        .voice-control-btn {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.02);
          color: var(--text-2);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .voice-control-btn:hover {
          background: rgba(255,255,255,0.04);
          border-color: rgba(255,255,255,0.12);
          color: var(--text-1);
        }
        .voice-control-btn.muted {
          background: rgba(239,68,68,0.15);
          border-color: rgba(239,68,68,0.3);
          color: #ef4444;
        }
        .voice-control-btn.muted:hover {
          background: rgba(239,68,68,0.25);
          border-color: rgba(239,68,68,0.5);
        }
        .voice-status-chip {
          font-size: 12px;
          color: var(--text-3);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 999px;
          padding: 5px 9px;
          background: rgba(255,255,255,0.03);
          white-space: nowrap;
        }
        .voice-status-chip.active {
          color: #22c55e;
          border-color: rgba(34,197,94,0.25);
          background: rgba(34,197,94,0.1);
        }
        .voice-user-volume {
          margin-top: 6px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .voice-user-volume input {
          width: 110px;
        }
        .voice-user-mute {
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.04);
          color: var(--text-2);
          border-radius: 6px;
          font-size: 11px;
          padding: 4px 7px;
          cursor: pointer;
        }
        .voice-diagnostic-line {
          width: 100%;
          text-align: center;
          color: var(--text-3);
          font-size: 11px;
        }
        .room-tools {
          display: flex;
          gap: 8px;
          align-items: center;
          padding: 10px 14px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          background: rgba(255,255,255,0.02);
          overflow-x: auto;
          overscroll-behavior-x: contain;
        }
        .room-tool-input {
          flex: 1;
          min-width: 140px;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 7px;
          background: rgba(255,255,255,0.04);
          color: var(--text-1);
          padding: 8px 10px;
          font-size: 13px;
        }
        .mention-panel button {
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.04);
          color: var(--text-2);
          border-radius: 7px;
          padding: 6px 9px;
          cursor: pointer;
          white-space: nowrap;
        }
        .compose-preview {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          align-items: center;
          padding: 8px 10px;
          margin-bottom: 8px;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 8px;
          color: var(--text-2);
          background: rgba(255,255,255,0.04);
          font-size: 12px;
        }
        .compose-preview.hidden,
        .mention-panel.hidden {
          display: none;
        }
        .compose-preview button {
          border: 0;
          background: transparent;
          color: var(--danger);
          cursor: pointer;
          font-size: 12px;
        }
        .mention-panel {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
          margin-bottom: 8px;
        }
        .composer-file-btn {
          width: 34px;
          height: 34px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-2);
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          cursor: pointer;
          font-size: 18px;
          line-height: 1;
        }
        .reply-preview {
          display: flex;
          flex-direction: column;
          gap: 2px;
          margin-bottom: 8px;
          border-left: 3px solid var(--accent, #7c69fa);
          padding-left: 8px;
          color: var(--text-3);
          font-size: 12px;
        }
        .reaction-row {
          display: flex;
          gap: 6px;
          margin-top: 6px;
        }
        .reaction-chip {
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 999px;
          background: rgba(255,255,255,0.05);
          color: var(--text-2);
          font-size: 12px;
          padding: 3px 8px;
          cursor: pointer;
        }
        .link-preview,
        .attachment-preview {
          display: flex;
          flex-direction: column;
          gap: 4px;
          max-width: 420px;
          margin-top: 7px;
          padding: 9px 10px;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 8px;
          background: rgba(255,255,255,0.035);
          color: var(--text-2);
          text-decoration: none;
          font-size: 12px;
        }
        .attachment-preview img {
          max-width: 260px;
          max-height: 180px;
          border-radius: 7px;
          object-fit: cover;
        }
        .link-preview-host {
          color: var(--text-1);
          font-weight: 700;
        }
        .link-preview-url {
          color: var(--text-3);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .unread-separator {
          margin: 12px 0;
          text-align: center;
          color: var(--accent, #7c69fa);
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
        }
        body.compact-chat .msg {
          padding-top: 4px !important;
          padding-bottom: 4px !important;
        }
        body.compact-chat .msg-bubble {
          padding: 7px 9px !important;
        }

        .dm-safety-banner {
          margin: 0 0 10px;
          padding: 10px 14px;
          display: flex;
          align-items: center;
          gap: 10px;
          border: 1px solid rgba(239,68,68,0.22);
          border-radius: 10px;
          background: rgba(239,68,68,0.08);
          color: var(--text-2);
          font-size: 13px;
          line-height: 1.4;
        }
        .dm-safety-banner-mark {
          width: 8px;
          height: 8px;
          flex: 0 0 auto;
          border-radius: 50%;
          background: var(--danger, #ef4444);
          box-shadow: 0 0 0 4px rgba(239,68,68,0.12);
        }
        .dm-safety-banner strong {
          color: var(--text-1);
        }

        /* Sidebar professional touch */
        .sidebar {
          width: 300px !important; /* a bit wider for better readability */
          min-width: 260px;
          max-width: 82vw;
        }
        .sidebar-header {
          padding: 0 24px !important;
          height: 64px !important;
        }
        .sidebar-logo {
          width: 40px !important;
          height: 40px !important;
          font-size: 20px !important;
        }
        .sidebar-title {
          font-size: 20px !important;
        }

        /* Sidebar sections */
        .sidebar-section {
          padding: 16px 12px 0 !important;
        }
        .sidebar-section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 8px 10px !important;
          margin-bottom: 4px;
        }
        .sidebar-section-label {
          font-size: 12px !important;
          font-weight: 700 !important;
          letter-spacing: 0.08em !important;
          text-transform: uppercase !important;
          color: var(--text-3) !important;
        }
        .sidebar-section-list {
          padding: 0 4px;
        }

        /* Channel items */
        .channel-item {
          margin: 2px 4px !important;
          padding: 10px 12px !important;
          border-radius: 8px !important;
          font-size: 14px !important;
        }
        .channel-item:hover {
          background: var(--bg-hover) !important;
          transform: translateX(2px) !important;
        }
        .channel-item.active {
          background: var(--accent-lo) !important;
          color: var(--accent-hi) !important;
          border-left: 3px solid var(--accent) !important;
        }
        .voice-sidebar-item {
          width: calc(100% - 8px);
          border: 0;
          font: inherit;
          text-align: left;
        }
        .voice-sidebar-item .channel-hash {
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .voice-sidebar-item.active {
          background: rgba(34,197,94,0.16) !important;
          color: #bbf7d0 !important;
          border-left-color: #22c55e !important;
        }
        .voice-sidebar-item.has-call:not(.active) {
          background: rgba(96,165,250,0.1) !important;
        }
        .sidebar-voice-header {
          margin-top: 10px;
        }

        .dm-channel-item {
          display: flex !important;
          align-items: center !important;
          gap: 0 !important;
        }
        .dm-channel-name {
          flex: 1;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .dm-unread-dot {
          width: 8px;
          height: 8px;
          flex: 0 0 auto;
          margin-left: 8px;
          border-radius: 50%;
          background: var(--danger, #ef4444);
          box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.16);
        }
        .dm-row-actions {
          width: 24px;
          flex: 0 0 24px;
          display: flex;
          justify-content: flex-end;
          margin-left: 8px;
        }
        .remove-friend-btn {
          width: 22px;
          height: 22px;
          border: 0;
          border-radius: 6px;
          background: transparent;
          color: var(--danger, #ef4444);
          cursor: pointer;
          font-size: 18px;
          line-height: 1;
          opacity: 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .dm-channel-item:hover .remove-friend-btn,
        .dm-channel-item:focus-within .remove-friend-btn {
          opacity: 1;
        }
        .remove-friend-btn:hover {
          background: rgba(239, 68, 68, 0.12);
        }

        .sidebar-empty {
          color: var(--text-3);
          font-size: 13px;
          padding: 8px 12px;
          line-height: 1.4;
        }

        /* Footer */
        .sidebar-footer {
          padding: 14px 16px !important;
        }

        @media (max-width: 1120px) {
          .member-list-panel {
            position: fixed;
            top: 0;
            right: 0;
            bottom: 0;
            z-index: 91;
            width: min(320px, 86vw);
            flex-basis: auto;
            transform: translateX(100%);
            transition: transform 0.22s ease;
            box-shadow: -20px 0 50px rgba(0,0,0,0.35);
          }
          .shell.members-open .member-list-panel {
            transform: translateX(0);
          }
          .mobile-members-toggle {
            display: inline-flex;
          }
          .shell.members-open .mobile-backdrop {
            display: block;
          }
          .voice-call-panel {
            right: 0;
          }
        }

        /* Room code banner */
        .room-code-banner {
          width: 100%;
          max-width: 100%;
          margin-top: 2px;
        }
        .room-code-banner-row {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          width: 100%;
          min-height: 32px;
        }
        .room-code-copy-target {
          min-width: 0;
          padding: 0;
          border: 0;
          background: transparent;
          color: inherit;
          cursor: pointer;
          text-align: center;
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          justify-self: center;
        }
        .room-code-copy-target:hover .room-code-value,
        .room-code-copy-target:focus-visible .room-code-value {
          color: var(--text-1);
          text-decoration-color: var(--accent);
        }
        .room-code-value {
          font-family: var(--font-mono, ui-monospace, SFMono-Regular, Consolas, monospace);
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: var(--text-1);
          text-decoration: underline;
          text-decoration-thickness: 1px;
          text-underline-offset: 3px;
          text-decoration-color: rgba(255,255,255,0.32);
          text-transform: uppercase;
        }
        .room-code-hint {
          font-size: 11px;
          color: var(--text-3);
        }
        .room-code-leave-btn {
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          min-height: 26px;
          padding: 0 9px !important;
          border-radius: 7px !important;
          font-size: 11px !important;
          font-weight: 700 !important;
          white-space: nowrap;
        }
        @media (max-width: 520px) {
          .room-code-banner-row {
            justify-content: space-between;
          }
          .room-code-copy-target {
            align-items: flex-start;
          }
          .room-code-leave-btn {
            position: static;
            transform: none;
          }
        }

        @media (max-width: 900px) {
          .mobile-nav-toggle {
            display: inline-flex;
          }
          .mobile-backdrop {
            z-index: 89;
          }
          .shell.sidebar-open .mobile-backdrop {
            display: block;
          }
          .sidebar {
            position: fixed !important;
            top: 0;
            left: 0;
            bottom: 0;
            z-index: 92;
            width: min(320px, 88vw) !important;
            max-width: 88vw;
            transform: translateX(-105%);
            transition: transform 0.22s ease;
            box-shadow: 20px 0 50px rgba(0,0,0,0.35);
          }
          .shell.sidebar-open .sidebar {
            transform: translateX(0);
          }
          .sidebar-title,
          .sidebar-section-label,
          .channel-item span:not(.channel-hash),
          .online-pill,
          .footer-user span:first-child {
            display: initial;
          }
          .sidebar-header {
            justify-content: flex-start !important;
            padding: 0 18px !important;
          }
          .channel-item {
            justify-content: flex-start;
          }
          .main {
            width: 100%;
          }
        }

        @media (max-width: 720px) {
          .main-header {
            min-height: auto !important;
            padding: 12px 14px !important;
            align-items: center !important;
            flex-wrap: wrap !important;
            gap: 9px !important;
          }
          .main-header-icon {
            width: 34px;
            height: 34px;
            flex-basis: 34px;
          }
          .main-header-meta {
            flex: 1 1 calc(100% - 94px);
            order: 2;
          }
          .main-header-actions {
            order: 3;
            width: 100%;
            margin-left: 0;
            justify-content: flex-start;
            gap: 6px;
            overflow-x: auto;
            padding-bottom: 2px;
          }
          .main-header-actions {
            gap: 6px;
          }
          .main-header-actions .icon-btn.voice-btn {
            min-width: 88px;
            padding: 0 10px;
          }
          .voice-btn-label {
            max-width: 62px;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .voice-strip-avatar {
            width: 26px;
            height: 26px;
            font-size: 11px;
          }
          .voice-call-panel {
            top: 64px;
            right: 0;
          }
          .voice-call-participants {
            grid-template-columns: repeat(auto-fit, minmax(138px, 1fr));
            padding: 18px;
          }
          .voice-participant {
            min-height: 138px;
          }
          .main-header-sub {
            flex-wrap: wrap;
          }
          .main-header-actions .coin-chip {
            display: none;
          }
          .header-online,
          .voice-status-chip,
          .notification-toggle {
            min-height: 30px;
            white-space: nowrap;
            flex: 0 0 auto;
          }
          .room-tools {
            padding: 8px 10px;
            gap: 6px;
          }
          .room-tool-input {
            flex: 0 0 min(220px, 58vw);
          }
          .room-tools .btn {
            white-space: nowrap;
            flex: 0 0 auto;
          }
          .composer {
            padding: 9px 10px 10px !important;
          }
          .composer-toolbar {
            gap: 8px;
            padding-bottom: 8px;
          }
          .composer-form {
            padding: 8px !important;
            gap: 7px !important;
          }
          .composer-form > div {
            flex: 0 0 auto !important;
          }
          .composer-file-btn,
          .composer-emoji-btn,
          .composer-effect-btn,
          .composer-send {
            width: 34px !important;
            height: 34px !important;
            min-width: 34px;
          }
          .composer-hint {
            display: none !important;
          }
          .msg {
            padding-left: 10px !important;
            padding-right: 10px !important;
          }
          .msg-avatar {
            width: 32px !important;
            height: 32px !important;
            flex-basis: 32px !important;
          }
          .msg-bubble,
          .link-preview,
          .attachment-preview {
            max-width: min(100%, 76vw);
            overflow-wrap: anywhere;
          }
          .effects-picker-popover,
          .emoji-picker-popover {
            position: fixed !important;
            left: 10px !important;
            right: 10px !important;
            bottom: 74px !important;
            width: auto !important;
            max-width: none !important;
          }
        }

        @media (max-width: 420px) {
          .main-header {
            padding: 10px !important;
          }
          .main-header-icon {
            display: none;
          }
          .main-header-meta {
            flex-basis: calc(100% - 45px);
          }
          .main-header h2 {
            font-size: 17px !important;
          }
          .room-kind-pill,
          .room-effect-chip {
            max-width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .main-header-actions .icon-btn.voice-btn {
            min-width: 78px;
          }
          .voice-btn-label {
            display: none;
          }
          .voice-status-chip {
            display: none;
          }
          .room-code-banner-row {
            align-items: flex-start;
          }
        }

        #lockdown-banner {
          position: sticky;
          top: 0;
          z-index: 1200;
          margin: 0;
          min-height: 42px;
          padding: 9px 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          border: 0;
          border-bottom: 1px solid rgba(239,68,68,0.28);
          border-radius: 0;
          background: rgba(42, 18, 21, 0.96);
          color: var(--text-2);
          box-shadow: 0 10px 26px rgba(0,0,0,0.22);
          font-size: 13px;
          line-height: 1.35;
        }
        #lockdown-banner::before {
          content: '';
          width: 8px;
          height: 8px;
          flex: 0 0 auto;
          border-radius: 50%;
          background: var(--danger, #ef4444);
          box-shadow: 0 0 0 4px rgba(239,68,68,0.13);
        }
        #lockdown-banner.hidden {
          display: none;
        }
        #main-content.chat-bg-active {
          isolation: isolate;
        }
        #main-content.chat-bg-active::before {
          content: '';
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          background-image: var(--chat-bg-image);
          background-size: cover;
          background-position: center;
          opacity: 0.42;
          filter: brightness(0.68) saturate(0.92);
        }
        #main-content.chat-bg-active::after {
          content: '';
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          background: linear-gradient(180deg, rgba(8,10,15,0.58), rgba(8,10,15,0.74));
        }
        #main-content.chat-bg-active > * {
          position: relative;
          z-index: 1;
        }
        #main-content.chat-bg-active #room-effect-stage {
          z-index: 25;
        }
        #main-content.chat-bg-active #chat-messages {
          background: transparent;
        }
      </style>
    `;

    app.innerHTML = `
      ${professionalStyles}
      <div id="mention-notification" class="hidden"></div>
      <div id="lockdown-banner" class="hidden"></div>
      <div class="shell">
        <button id="mobile-backdrop" class="mobile-backdrop" type="button" aria-label="Close menus"></button>
        <aside id="sidebar" class="sidebar" aria-label="Chat navigation">
          <div class="sidebar-header">
            <div class="sidebar-logo">U</div>
            <span class="sidebar-title">UBG-chat by PrismX</span>
          </div>
          <div class="sidebar-section">
            <div class="sidebar-section-header">
              <span class="sidebar-section-label">Group Chats</span>
              <div style="display:flex;gap:4px;align-items:center">
                <button id="btn-create-group-chat" class="btn btn-secondary btn-sm" type="button">Create</button>
                <button id="btn-join-group-chat" class="btn btn-secondary btn-sm" type="button">Join</button>
              </div>
            </div>
            <div id="sidebar-group-chats" class="sidebar-section-list">
              <div class="sidebar-empty">No group chats yet.</div>
            </div>
          </div>
          <div class="sidebar-section">
            <div class="sidebar-section-header">
              <span class="sidebar-section-label">Direct Messages</span>
              <button id="btn-add-friend" class="btn btn-primary btn-sm" type="button">+ Add Friend</button>
            </div>
            <div id="sidebar-direct-messages" class="sidebar-section-list"></div>
          </div>
          <div class="sidebar-section">
            <div class="sidebar-section-header">
              <span class="sidebar-section-label">Channels</span>
            </div>
            <div id="sidebar-channels" class="sidebar-section-list sidebar-channels-list"></div>
            <div id="sidebar-voice-channels" class="sidebar-section-list sidebar-voice-list"></div>
          </div>
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

        <section class="main" style="display:flex;flex-direction:row;position:relative">
          <div class="chat-container" style="flex:1;display:flex;flex-direction:column">
            <header class="main-header${isGroupChat ? ' group-chat-header' : ''}">
              <button id="btn-mobile-menu" class="mobile-nav-toggle" type="button" aria-label="Open chat menu" title="Menu">
                <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm1 4a1 1 0 100 2h12a1 1 0 100-2H4z" clip-rule="evenodd"/></svg>
              </button>
              <span class="main-header-icon">${esc(channelIcon)}</span>
              <div class="main-header-meta">
                <div class="main-header-title-row">
                  <h2>${channelName}</h2>
                </div>
                <div class="main-header-sub">
                  <span class="room-kind-pill">${esc(channelKindLabel)}</span>
                  <span class="room-effect-chip">
                    <span>Room FX</span>
                    <strong id="header-room-effect">${esc(roomEffectLabel)}</strong>
                  </span>
                </div>
                <div id="room-code-banner" class="room-code-banner hidden">
                  <div class="room-code-banner-row">
                    <button id="copy-room-code-btn" class="room-code-copy-target" type="button" title="Copy room code">
                      <span id="room-code-value" class="room-code-value"></span>
                      <span class="room-code-hint">click to copy</span>
                    </button>
                    <button id="leave-group-btn" class="btn btn-danger btn-sm room-code-leave-btn" type="button">Leave</button>
                  </div>
                </div>
              </div>
              <div class="main-header-actions">
                <button id="btn-mobile-members" class="mobile-members-toggle" type="button" aria-label="Show members" title="Members">
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M13 7a3 3 0 11-6 0 3 3 0 016 0z"/><path fill-rule="evenodd" d="M5 14a5 5 0 0110 0v1a1 1 0 01-1 1H6a1 1 0 01-1-1v-1z" clip-rule="evenodd"/></svg>
                </button>
                <button id="btn-voice-chat" class="icon-btn voice-btn" title="Start voice call" style="display:none">
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.894.894c.159.635.738 1.59 1.994 2.847 1.256 1.256 2.212 1.835 2.847 1.994l.894-1.894a1 1 0 011.06-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2.5C6.1 18 3 14.9 3 11.5V5a1 1 0 011-1z"/></svg>
                  <span class="voice-btn-label">Start Voice</span>
                </button>
                <span id="voice-participant-strip" class="voice-participant-strip hidden" aria-label="People in voice call"></span>
                <span id="voice-status-bar" class="voice-status-chip">No active voice</span>
                ${typeof Notification !== 'undefined' ? '<button id="btn-enable-notifications" class="notification-toggle" type="button">Enable alerts</button>' : ''}
                <span id="header-online-count" class="header-online">0 online</span>
                <span id="header-coins" class="coin-chip">${coinLabel}</span>
              </div>
            </header>
            <div id="main-content" style="flex:1;display:flex;flex-direction:column;overflow:hidden;position:relative">
              <div id="room-effect-stage" class="room-effect-stage"></div>
              ${contentHtml}
            </div>
            ${footerHtml}
          </div>

          <!-- Voice Call Panel -->
          <div id="voice-call-panel" class="voice-call-panel hidden">
            <div class="voice-call-header">
              <div>
                <h3 id="voice-call-title">Voice Call</h3>
                <div id="voice-call-subtitle" class="voice-call-subtitle">Ready to join</div>
              </div>
              <button id="btn-end-call" class="btn btn-danger btn-sm voice-leave-btn" title="Leave Call">Leave</button>
            </div>
            <div id="voice-call-participants" class="voice-call-participants">
              <!-- Participant avatars will be added here -->
            </div>
            <div class="voice-call-controls">
              <div class="voice-control-row">
                <button id="btn-mute-mic" class="voice-control-btn" title="Mute/Unmute Microphone">
                  <svg id="mic-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0 5 5 0 01-10 0 1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clip-rule="evenodd"/>
                  </svg>
                </button>
                <select id="mic-selector" class="mic-selector" title="Select Microphone">
                  <option value="">Loading microphones...</option>
                </select>
                <select id="voice-input-mode" class="mic-selector" title="Voice input mode">
                  <option value="toggle">Toggle</option>
                  <option value="ptt">Push V</option>
                </select>
              </div>
              <div id="voice-ptt-hint" class="voice-diagnostic-line">Mic stays on until muted</div>
              <div id="voice-diagnostics" class="voice-diagnostic-line">Diagnostics idle</div>
            </div>
          </div>
          <aside id="member-list-panel" class="member-list-panel">
            ${renderMemberListHtml()}
          </aside>
        </section>
      </div>
    `;

    const shellEl = app.querySelector('.shell');
    const closeResponsivePanels = () => {
      shellEl?.classList.remove('sidebar-open', 'members-open');
      document.getElementById('btn-mobile-menu')?.setAttribute('aria-expanded', 'false');
      document.getElementById('btn-mobile-members')?.setAttribute('aria-expanded', 'false');
    };
    const toggleResponsivePanel = (panelClass, buttonId) => {
      if (!shellEl) return;
      const willOpen = !shellEl.classList.contains(panelClass);
      shellEl.classList.remove('sidebar-open', 'members-open');
      if (willOpen) shellEl.classList.add(panelClass);
      document.getElementById('btn-mobile-menu')?.setAttribute('aria-expanded', String(panelClass === 'sidebar-open' && willOpen));
      document.getElementById('btn-mobile-members')?.setAttribute('aria-expanded', String(panelClass === 'members-open' && willOpen));
      document.getElementById(buttonId)?.focus({ preventScroll: true });
    };

    document.getElementById('btn-mobile-menu')?.addEventListener('click', (event) => {
      event.stopPropagation();
      toggleResponsivePanel('sidebar-open', 'btn-mobile-menu');
    });
    document.getElementById('btn-mobile-members')?.addEventListener('click', (event) => {
      event.stopPropagation();
      toggleResponsivePanel('members-open', 'btn-mobile-members');
    });
    document.getElementById('mobile-backdrop')?.addEventListener('click', closeResponsivePanels);
    if (state.responsiveShellKeyHandler) {
      document.removeEventListener('keydown', state.responsiveShellKeyHandler);
    }
    state.responsiveShellKeyHandler = (event) => {
      if (event.key === 'Escape') closeResponsivePanels();
    };
    document.addEventListener('keydown', state.responsiveShellKeyHandler);
    document.getElementById('sidebar')?.addEventListener('click', (event) => {
      if (event.target.closest('.channel-item') || event.target.closest('.voice-sidebar-item') || event.target.closest('#btn-add-friend')) {
        if (window.matchMedia('(max-width: 900px)').matches) setTimeout(closeResponsivePanels, 0);
      }
    });

    document.getElementById('btn-end-call')?.addEventListener('click', async () => {
      await leaveActiveVoiceCall();
    });

    document.getElementById('btn-mute-mic')?.addEventListener('click', toggleMicrophone);

    document.getElementById('mic-selector')?.addEventListener('change', (e) => {
      handleMicDeviceChange(e.target.value);
    });

    document.getElementById('voice-input-mode')?.addEventListener('change', (e) => {
      setVoiceInputMode(e.target.value);
    });
    document.getElementById('btn-enable-notifications')?.addEventListener('click', () => {
      void requestDesktopNotificationPermission();
    });
    renderNotificationButton();
    if (supportsDesktopNotifications() && Notification.permission === 'granted') {
      void registerNotificationServiceWorker();
    }
    syncVoiceInputMode();
    installVoiceKeyboardControls();

    document.getElementById('btn-voice-chat')?.addEventListener('click', async () => {
      await joinOrToggleVoiceRoom(getCurrentVoiceChannel());
    });
    document.getElementById('voice-channel-general')?.addEventListener('click', async () => {
      await joinOrToggleVoiceRoom(getCurrentVoiceChannel());
    });

    const footerUser = document.getElementById('footer-user-profile');
    if (footerUser) footerUser.addEventListener('click', () => navigate('/settings'));
    document.getElementById('btn-settings')?.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      navigate('/settings');
    });
    document.getElementById('btn-admin')?.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      navigate('/admin');
    });

    renderSidebar();
    updateLockdownBanner();
  };

  function updateLockdownBanner() {
    const banner = document.getElementById('lockdown-banner');
    const effectsBtn = document.getElementById('effects-btn');
    const soundBtn = document.getElementById('sound-btn');
    if (!banner) return;

    const active = !!state.lockdownActive;
    if (active) {
      banner.textContent = 'Lockdown active. Effects and sound are disabled until moderation reopens them.';
      banner.classList.remove('hidden');
    } else {
      banner.classList.add('hidden');
    }

    [effectsBtn, soundBtn].forEach((btn) => {
      if (!btn) return;
      btn.disabled = active;
      btn.style.opacity = active ? '0.4' : '';
      btn.style.cursor = active ? 'not-allowed' : '';
    });
  }

  const getMemberListEntries = () => {
    const channel = state.currentChannel || {};
    const currentName = getCurrentUsername();
    const entries = new Map();
    const addEntry = (username, details = {}) => {
      const name = String(username || '').trim();
      if (!name) return;
      const key = name.toLowerCase();
      if (entries.has(key)) {
        entries.set(key, { ...entries.get(key), ...details });
        return;
      }
      entries.set(key, {
        username: name,
        role: details.role || (key === currentName.toLowerCase() ? 'You' : ''),
        appRole: details.appRole || '',
        relationship: details.relationship || getFriendRelationship(name),
        status: details.status || 'member',
        avatar: details.avatar || '',
        online: details.online ?? key === currentName.toLowerCase()
      });
    };

    const roomKey = String(channel.room || '').trim().toLowerCase();
    const presentUsers = Array.isArray(state.presenceUsersByRoom?.[roomKey])
      ? state.presenceUsersByRoom[roomKey]
      : [];
    presentUsers.forEach((user) => {
      const username = String(user?.username || '').trim();
      const isCurrent = username.toLowerCase() === currentName.toLowerCase();
      addEntry(username, {
        role: isCurrent ? 'You' : 'Online',
        appRole: String(user?.role || '').trim().toLowerCase(),
        relationship: getFriendRelationship(username),
        status: 'online now',
        avatar: withAvatarVersion(String(user?.avatar || '').trim()),
        online: true
      });
    });

    if (!entries.size && currentName && state.currentChannel?.room) {
      addEntry(currentName, {
        role: 'You',
        appRole: String(state.user?.role || '').trim().toLowerCase(),
        relationship: 'self',
        status: 'online',
        avatar: withAvatarVersion(String(state.user?.avatar || state.user?.avatarUrl || '').trim()),
        online: true
      });
    }

    return [...entries.values()].sort((a, b) => {
      if (a.username.toLowerCase() === currentName.toLowerCase()) return -1;
      if (b.username.toLowerCase() === currentName.toLowerCase()) return 1;
      if (a.online !== b.online) return a.online ? -1 : 1;
      return a.username.localeCompare(b.username);
    });
  };

  const renderMemberListHtml = () => {
    const members = getMemberListEntries();
    const onlineCount = members.length;
    return `
      <div class="member-list-head">
        <div>
          <div class="member-list-title">In This Room</div>
          <div class="member-list-subtitle">${onlineCount} online now</div>
        </div>
      </div>
      <div class="member-list-body">
        ${members.length ? members.map((member) => {
          const avatarLetter = esc((member.username.charAt(0) || 'U').toUpperCase());
          const relationship = getFriendRelationship(member.username);
          const roleTag = ['owner', 'admin'].includes(String(member.appRole || '').toLowerCase())
            ? `<span class="member-tag role-${esc(member.appRole)}">${esc(member.appRole)}</span>`
            : '';
          const relationshipLabel = relationship === 'self'
            ? 'You'
            : relationship === 'friend'
            ? 'Friend'
            : relationship === 'pending'
            ? 'Pending'
            : relationship === 'incoming'
            ? 'Incoming'
            : '';
          const relationshipTag = relationshipLabel ? `<span class="member-tag relation-${esc(relationship)}">${esc(relationshipLabel)}</span>` : '';
          const canAddFriend = relationship === 'none' || relationship === 'incoming';
          return `
            <div class="member-row">
              <span class="member-avatar" style="background:${avatarColor(member.username)}">
                ${member.avatar ? `<img src="${esc(member.avatar)}" alt="${esc(member.username)}" />` : avatarLetter}
              </span>
              <span class="member-meta">
                <span class="member-name">${esc(member.username)}</span>
                <span class="member-tags">
                  ${relationshipTag}
                  ${roleTag}
                  <span class="member-status ${member.online ? 'online' : ''}">${esc(member.status || 'online')}</span>
                </span>
              </span>
              ${canAddFriend ? `<button type="button" class="member-add-friend" data-member-add-friend="${esc(member.username)}" title="Add ${esc(member.username)} as friend">+</button>` : ''}
            </div>
          `;
        }).join('') : '<div class="member-list-empty">No active users detected yet.</div>'}
      </div>
    `;
  };

  const updateMemberList = () => {
    const panel = document.getElementById('member-list-panel');
    if (!panel) return;
    state.lastMemberListSignature = getMemberListSignature();
    panel.innerHTML = renderMemberListHtml();
    panel.querySelectorAll('[data-member-add-friend]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const username = String(btn.getAttribute('data-member-add-friend') || '').trim();
        if (!username) return;
        btn.disabled = true;
        try {
          const response = await api('/api/users/friends', { method: 'POST', body: { username } });
          if (response?.user) state.user = { ...state.user, ...response.user };
          await refreshFriends('');
          showToast(getFriendRelationship(username) === 'friend' ? `${username} is now your friend` : `Friend request sent to ${username}`, 'success');
          updateMemberList();
          renderSidebar();
        } catch (err) {
          btn.disabled = false;
          showToast(err.message || 'Could not add friend', 'error');
        }
      });
    });
  };

  const getMemberListSignature = () => getMemberListEntries()
    .map((member) => [
      member.username,
      member.appRole || '',
      getFriendRelationship(member.username),
      member.status || '',
      member.avatar || '',
      member.online ? '1' : '0'
    ].join(':'))
    .join('|');

  const updateMemberListIfChanged = () => {
    const nextSignature = getMemberListSignature();
    if (nextSignature === state.lastMemberListSignature) return;
    updateMemberList();
  };

  const renderSidebar = () => {
    const dmRoot = document.getElementById('sidebar-direct-messages');
    const channelRoot = document.getElementById('sidebar-channels');
    const voiceRoot = document.getElementById('sidebar-voice-channels');
    if (dmRoot) {
      const hiddenDmRooms = new Set(loadHiddenDmRooms());
      const directFriends = Array.isArray(state.mutualFriends)
        ? state.mutualFriends.filter((friend) => {
            const dmChannel = buildDmChannel(friend?.username || friend);
            return dmChannel && !hiddenDmRooms.has(String(dmChannel.room || '').trim().toLowerCase());
          })
        : [];
      dmRoot.innerHTML = directFriends.length > 0
        ? directFriends.map((friend) => {
            const dmChannel = buildDmChannel(friend.username);
            const active = !!dmChannel && state.currentChannel?._id === dmChannel._id;
            const unreadCount = active ? 0 : dmChannel ? Number(state.unreadCounts?.[dmChannel.room] || 0) : 0;
            const friendAvatar = withAvatarVersion(String(friend?.avatar || friend?.avatarUrl || '').trim());
            const avatarLetter = esc((String(friend.username || '').trim().charAt(0) || 'U').toUpperCase());
            return `
              <div class="channel-item dm-channel-item ${active ? 'active' : ''}" data-friend-username="${esc(friend.username)}">
                <span class="channel-avatar" style="width:28px;height:28px;flex-shrink:0;border-radius:50%;overflow:hidden;display:inline-flex;align-items:center;justify-content:center;background:var(--bg-raised);border:1px solid var(--border);font-size:12px;font-weight:700;color:var(--text-1);margin-right:10px;">
                  ${friendAvatar ? `<img src="${esc(friendAvatar)}" alt="${esc(friend.username)}" style="width:100%;height:100%;object-fit:cover;display:block" />` : avatarLetter}
                </span>
                <span class="dm-channel-name">${esc(friend.username)}</span>
                ${unreadCount > 0 ? `<span class="dm-unread-dot" title="${esc(`${unreadCount} unread message${unreadCount === 1 ? '' : 's'}`)}" aria-label="${esc(`${unreadCount} unread message${unreadCount === 1 ? '' : 's'}`)}"></span>` : ''}
                <span class="dm-row-actions">
                  <button class="remove-friend-btn" data-friend-username="${esc(friend.username)}" type="button" title="Close DM" aria-label="Close DM with ${esc(friend.username)}">×</button>
                </span>
              </div>
            `;
          }).join('')
        : `<div class="sidebar-empty">No open DMs. Friends stay on the Add Friends page.</div>`;
      dmRoot.querySelectorAll('[data-friend-username]').forEach((el) => {
        el.addEventListener('click', () => {
          const username = el.getAttribute('data-friend-username');
          const dmChannel = buildDmChannel(username);
          if (dmChannel?.room) {
            state.unreadCounts[dmChannel.room] = 0;
            saveUnreadCounts();
          }
          renderSidebar();
          navigate(`/channels/${encodeURIComponent(`dm:${username}`)}`);
        });
      });
      dmRoot.querySelectorAll('.channel-item').forEach((item) => {
        const btn = item.querySelector('.remove-friend-btn');
        if (!btn) return;
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const username = btn.getAttribute('data-friend-username');
          closeDmWithFriend(username).catch((err) => console.warn('Close DM failed:', err));
        });
      });
    }

    const groupChatRoot = document.getElementById('sidebar-group-chats');
    if (groupChatRoot) {
      const groupChats = Array.isArray(state.channels) ? state.channels.filter((c) => c.type === 'group') : [];
      groupChatRoot.innerHTML = groupChats.length > 0
        ? groupChats.map((group) => {
            const active = state.currentChannel?._id === group._id;
            const memberCount = Array.isArray(group.members) ? group.members.length : 0;
            const unreadCount = active ? 0 : Number(state.unreadCounts?.[group.room] || 0);
            return `
            <div class="channel-item ${active ? 'active' : ''}" data-group-chat-id="${esc(group._id)}">
              <span style="flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(group.name || group._id)}</span>
              ${unreadCount > 0 ? `<span class="msg-badge" style="background:red;color:white;border-radius:50%;width:18px;height:18px;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:bold;margin-left:auto;margin-right:4px;">${unreadCount}</span>` : ''}
              <span class="online-pill ${memberCount > 0 ? 'has-users' : ''}">
                <span class="online-pill-dot"></span>${memberCount} member${memberCount === 1 ? '' : 's'}
              </span>
            </div>
          `;
          }).join('')
        : `<div class="sidebar-empty">No group chats yet.</div>`;
      groupChatRoot.querySelectorAll('[data-group-chat-id]').forEach((el) => {
        el.addEventListener('click', () => {
          const groupId = String(el.getAttribute('data-group-chat-id') || '').trim();
          const group = state.channels.find((c) => String(c._id || '').trim() === groupId);
          if (group?.room) {
            state.unreadCounts[group.room] = 0;
            saveUnreadCounts();
          }
          renderSidebar();
          navigate(`/channels/${encodeURIComponent(groupId)}`);
        });
      });
    }

    void subscribeToMessageRooms();

    const createGroupChatButton = document.getElementById('btn-create-group-chat');
    if (createGroupChatButton) {
      if (createGroupChatButton._handler) {
        createGroupChatButton.removeEventListener('click', createGroupChatButton._handler);
      }
      createGroupChatButton._handler = async () => {
        const groupName = await promptGroupName();
        if (!groupName) return;
        const channel = await createGroupChat(groupName);
        if (channel) {
          navigate(`/channels/${encodeURIComponent(channel._id)}`);
        }
      };
      createGroupChatButton.addEventListener('click', createGroupChatButton._handler);
    }

    const joinGroupChatButton = document.getElementById('btn-join-group-chat');
    if (joinGroupChatButton) {
      if (joinGroupChatButton._handler) {
        joinGroupChatButton.removeEventListener('click', joinGroupChatButton._handler);
      }
      joinGroupChatButton._handler = async () => {
        const roomCode = await promptJoinGroupCode();
        if (!roomCode) return;
        const channel = await joinGroupChat(roomCode);
        if (channel) {
          navigate(`/channels/${encodeURIComponent(channel._id)}`);
        } else {
          showToast('Room code not active or invalid', 'error');
        }
      };
      joinGroupChatButton.addEventListener('click', joinGroupChatButton._handler);
    }

    if (!channelRoot) return;
    const normalChannels = state.channels.filter((c) => c.type !== 'dm' && c.type !== 'group');
    channelRoot.innerHTML = normalChannels.map((c) => {
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
    channelRoot.querySelectorAll('[data-channel-id]').forEach((el) => {
      el.addEventListener('click', () => navigate(`/channels/${el.getAttribute('data-channel-id')}`));
    });

    if (voiceRoot) {
      const publicVoice = getPublicVoiceChannel();
      voiceRoot.innerHTML = `
        <div class="sidebar-section-header sidebar-voice-header">
          <span class="sidebar-section-label">Voice Channels</span>
        </div>
        <button class="channel-item voice-sidebar-item" type="button" data-voice-room="${esc(publicVoice.room)}">
          <span class="channel-hash"><svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4z"/><path d="M5 8a1 1 0 10-2 0 7 7 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07A7 7 0 0017 8a1 1 0 10-2 0 5 5 0 01-10 0z"/></svg></span>
          <span style="flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(publicVoice.name)}</span>
          <span class="online-pill" data-voice-count>Empty</span>
        </button>
      `;
      voiceRoot.querySelector('[data-voice-room]')?.addEventListener('click', () => {
        void joinOrToggleVoiceRoom(publicVoice);
      });
      updateVoiceChannelCard(state.activeVoiceCall || state.voiceCallsByRoom?.[publicVoice.room] || null);
    }

    const addFriendButton = document.getElementById('btn-add-friend');
    if (addFriendButton) {
      addFriendButton.addEventListener('click', () => {
        state.friendSearchQuery = '';
        navigate('/direct-messages');
      });
    }

    const headerCount = document.getElementById('header-online-count');
    if (headerCount && state.currentChannel) {
      const count = Number(state.currentChannel.onlineCount || 0);
      headerCount.textContent = `${count} online`;
      headerCount.className = count > 0 ? 'header-online has-users' : 'header-online';
    }
    updateMemberList();
  };

  const getMessageQuote = (message) => String(message?.body || message?.content || '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 120);

  const getMessageMeta = (message) => {
    const roomMeta = getRoomMeta();
    const id = getMessageId(message);
    return {
      id,
      reactions: roomMeta.reactions?.[id] || {}
    };
  };

  const getLinkPreviewHtml = (body) => {
    const url = String(body || '').match(/https?:\/\/[^\s<>"']+/i)?.[0];
    if (!url) return '';
    let host = url;
    try { host = new URL(url).hostname; } catch {}
    return `<a class="link-preview" href="${esc(url)}" target="_blank" rel="noopener noreferrer">
      <span class="link-preview-host">${esc(host)}</span>
      <span class="link-preview-url">${esc(url)}</span>
    </a>`;
  };

  const getAttachmentPreviewHtml = (body) => {
    const imageMatch = String(body || '').match(/\[image:\s*([^\]]+)\]\(((?:data:image\/[^)]+)|(?:https?:\/\/[^)\s]+)|(?:\/api\/upload\/image\/[\w-]+))\)/i);
    if (imageMatch) {
      return `<div class="attachment-preview"><img src="${esc(imageMatch[2])}" alt="${esc(imageMatch[1])}" loading="lazy" decoding="async" /></div>`;
    }
    const fileMatch = String(body || '').match(/\[file:\s*([^\]]+)\]/i);
    if (!fileMatch) return '';
    return `<div class="attachment-preview file-preview">${esc(fileMatch[1])}</div>`;
  };

  const renderReplyPreview = (body) => {
    const match = String(body || '').match(/^> Replying to ([^:]+):\s*([^\n]+)\n/i);
    if (!match) return '';
    return `<div class="reply-preview"><strong>${esc(match[1])}</strong><span>${esc(match[2])}</span></div>`;
  };

  const buildDmChannel = (friendUsername) => {
    const me = String(state.user?.username || '').trim().toLowerCase();
    const friend = String(friendUsername || '').trim().toLowerCase();
    if (!me || !friend) return null;
    const pair = [me, friend].sort().join('|');
    let hash = 2166136261;
    for (let i = 0; i < pair.length; i += 1) {
      hash ^= pair.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    let roomId = '';
    for (let i = 0; roomId.length < 8; i += 1) {
      roomId += String.fromCharCode(97 + ((hash >> (i * 5)) & 31) % 26);
    }
    return {
      _id: `dm:${friend}`,
      room: roomId,
      name: `@${friend}`,
      type: 'dm',
      username: friend,
      onlineCount: 0
    };
  };

  const getExistingDmChannel = (friendUsername) => {
    const candidate = buildDmChannel(friendUsername);
    if (!candidate) return null;
    return (Array.isArray(state.channels) ? state.channels : []).find((channel) =>
      String(channel.type || '').toLowerCase() === 'dm' &&
      (
        String(channel.username || '').trim().toLowerCase() === candidate.username ||
        String(channel.room || '').trim().toLowerCase() === candidate.room ||
        String(channel._id || '').trim().toLowerCase() === candidate._id
      )
    ) || candidate;
  };

  const openDmWithFriend = async (friendUsername) => {
    const channel = getExistingDmChannel(friendUsername);
    if (!channel) return;
    removeHiddenDmRoom(channel.room);
    const channelKey = String(channel._id || '').trim().toLowerCase();
    const roomKey = String(channel.room || '').trim().toLowerCase();
    const usernameKey = String(channel.username || '').trim().toLowerCase();
    const exists = state.channels.some((item) =>
      String(item.type || '').toLowerCase() === 'dm' &&
      (
        String(item._id || '').trim().toLowerCase() === channelKey ||
        String(item.room || '').trim().toLowerCase() === roomKey ||
        String(item.username || '').trim().toLowerCase() === usernameKey
      )
    );
    if (!exists) {
      state.channels = [channel, ...state.channels];
      renderSidebar();
    }
    if (channel.room) await joinMessageRoom(channel.room).catch(() => {});
    navigate(`/channels/${encodeURIComponent(channel._id)}`);
  };

  const closeDmWithFriend = async (friendUsername) => {
    const channel = buildDmChannel(friendUsername);
    if (!channel) return;
    const roomKey = String(channel.room || '').trim().toLowerCase();
    const usernameKey = String(channel.username || '').trim().toLowerCase();
    const channelKey = String(channel._id || '').trim().toLowerCase();
    addHiddenDmRoom(roomKey);

    const wasCurrent = String(state.currentChannel?.room || '').trim().toLowerCase() === roomKey ||
      String(state.currentChannel?._id || '').trim().toLowerCase() === channelKey;
    state.channels = state.channels.filter((item) => {
      if (String(item.type || '').toLowerCase() !== 'dm') return true;
      return !(
        String(item.room || '').trim().toLowerCase() === roomKey ||
        String(item.username || '').trim().toLowerCase() === usernameKey ||
        String(item._id || '').trim().toLowerCase() === channelKey
      );
    });
    renderSidebar();

    if (wasCurrent) {
      const fallback = state.channels.find((item) => String(item.type || '').toLowerCase() !== 'dm') || state.channels[0] || null;
      if (fallback) navigate(`/channels/${encodeURIComponent(fallback._id)}`);
      else navigate('/direct-messages');
    }
  };

  const refreshFriends = async (search = '') => {
    if (!state.token && !localStorage.getItem('token')) {
      state.mutualFriends = [];
      state.friendSearchResults = [];
      state.friendRequestsIncoming = [];
      state.friendRequestsOutgoing = [];
      return [];
    }
    try {
      const query = search ? `?search=${encodeURIComponent(search)}` : '';
      const data = await api(`/api/users/friends${query}`);
      state.mutualFriends = Array.isArray(data?.mutualFriends) ? data.mutualFriends : [];
      state.friendSearchResults = Array.isArray(data?.results) ? data.results : [];
      state.friendRequestsIncoming = Array.isArray(data?.requests?.incoming) ? data.requests.incoming : [];
      state.friendRequestsOutgoing = Array.isArray(data?.requests?.outgoing) ? data.requests.outgoing : [];

      const dmChannels = state.mutualFriends
        .map((friend) => buildDmChannel(friend.username))
        .filter((channel) => channel && !isHiddenDmRoom(channel.room));
      const savedGroupChannels = loadSavedGroupChannels();
      const otherChannels = state.channels.filter((c) => c.type !== 'dm');
      const uniqueSavedGroups = savedGroupChannels.filter((c) => !otherChannels.some((existing) => existing._id === c._id));
      state.channels = [...dmChannels, ...uniqueSavedGroups, ...otherChannels];

      renderSidebar();
      void subscribeToMessageRooms();
      return state.friendSearchResults;
    } catch (err) {
      console.error('Failed to refresh friends:', err);
      state.mutualFriends = state.mutualFriends || [];
      state.friendSearchResults = state.friendSearchResults || [];
      state.friendRequestsIncoming = state.friendRequestsIncoming || [];
      state.friendRequestsOutgoing = state.friendRequestsOutgoing || [];
      return state.friendSearchResults;
    }
  };

  const renderFriendRequestsSection = () => {
    const incoming = Array.isArray(state.friendRequestsIncoming) ? state.friendRequestsIncoming : [];
    const outgoing = Array.isArray(state.friendRequestsOutgoing) ? state.friendRequestsOutgoing : [];

    const incomingHtml = incoming.length
      ? incoming.map((entry) => {
          const username = String(entry?.username || entry || '').trim();
          const avatarUrl = withAvatarVersion(String(entry?.avatar || entry?.avatarUrl || '').trim());
          const avatarLetter = esc((username || 'U').charAt(0).toUpperCase());
          return `
          <div class="friend-list-item" style="display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06)">
            <div style="display:flex;align-items:center;gap:12px;min-width:0">
              <div class="avatar sm" style="width:34px;height:34px;display:flex;align-items:center;justify-content:center;background:var(--bg-raised);border:1px solid var(--border);border-radius:50%;font-size:14px;font-weight:700;color:var(--text-1)">${avatarUrl ? `<img src="${esc(avatarUrl)}" alt="${esc(username)}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;display:block" />` : avatarLetter}</div>
              <div style="min-width:0;overflow:hidden">
                <div style="font-size:14px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(username)}</div>
                <div style="font-size:12px;color:var(--text-3)">Incoming friend request</div>
              </div>
            </div>
            <div style="display:flex;gap:8px">
              <button data-friend-action="accept" data-friend-username="${esc(username)}" class="btn btn-primary btn-sm">Accept</button>
              <button data-friend-action="deny" data-friend-username="${esc(username)}" class="btn btn-ghost btn-sm">Deny</button>
            </div>
          </div>
        `;
        }).join('')
      : '<div style="color:var(--text-3);font-size:13px;line-height:1.6">No incoming requests.</div>';

    const outgoingHtml = outgoing.length
      ? outgoing.map((entry) => {
          const username = String(entry?.username || entry || '').trim();
          const avatarUrl = withAvatarVersion(String(entry?.avatar || entry?.avatarUrl || '').trim());
          const avatarLetter = esc((username || 'U').charAt(0).toUpperCase());
          return `
          <div class="friend-list-item" style="display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06)">
            <div style="display:flex;align-items:center;gap:12px;min-width:0">
              <div class="avatar sm" style="width:34px;height:34px;display:flex;align-items:center;justify-content:center;background:var(--bg-raised);border:1px solid var(--border);border-radius:50%;font-size:14px;font-weight:700;color:var(--text-1)">${avatarUrl ? `<img src="${esc(avatarUrl)}" alt="${esc(username)}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;display:block" />` : avatarLetter}</div>
              <div style="min-width:0;overflow:hidden">
                <div style="font-size:14px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(username)}</div>
                <div style="font-size:12px;color:var(--text-3)">Request pending</div>
              </div>
            </div>
            <button data-friend-action="cancel" data-friend-username="${esc(username)}" class="btn btn-ghost btn-sm">Cancel</button>
          </div>
        `;
        }).join('')
      : '<div style="color:var(--text-3);font-size:13px;line-height:1.6">No outgoing requests.</div>';

    return `
      <div id="friend-requests-section" class="card" style="margin-bottom:16px">
        <div class="card-title" style="display:flex;align-items:center;justify-content:space-between;gap:12px">
          <span>Friend Requests</span>
          <button data-friend-action="refresh-requests" style="background:none;border:none;color:var(--text-1);font-size:18px;cursor:pointer;" title="Refresh requests">↻</button>
        </div>
        <div style="padding:0 16px 16px">
          <div style="margin-bottom:12px">
            <strong>Incoming</strong>
          </div>
          <div>${incomingHtml}</div>
          <div style="margin:16px 0 12px">
            <strong>Outgoing</strong>
          </div>
          <div>${outgoingHtml}</div>
        </div>
      </div>
    `;
  };

  const renderCurrentFriendsSection = () => {
    const friends = Array.isArray(state.mutualFriends) ? state.mutualFriends : [];
    const friendsHtml = friends.length
      ? friends.map((friend) => {
          const username = String(friend?.username || friend || '').trim().toLowerCase();
          if (!username) return '';
          const dmChannel = buildDmChannel(username);
          const roomKey = String(dmChannel?.room || '').trim().toLowerCase();
          const hidden = !roomKey || isHiddenDmRoom(roomKey);
          const active = !!dmChannel && String(state.currentChannel?.room || '').trim().toLowerCase() === roomKey;
          const openInSidebar = !!dmChannel && !hidden && state.channels.some((channel) =>
            String(channel.type || '').toLowerCase() === 'dm' &&
            String(channel.room || '').trim().toLowerCase() === roomKey
          );
          const avatarUrl = withAvatarVersion(String(friend?.avatar || friend?.avatarUrl || '').trim());
          const avatarLetter = esc((username || 'U').charAt(0).toUpperCase());
          const status = active ? 'DM is open now' : openInSidebar ? 'DM is open in sidebar' : 'DM is closed';
          const openLabel = active ? 'Open' : openInSidebar ? 'Go to DM' : 'Open DM';
          return `
            <div class="friend-list-item" style="display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06)">
              <div style="display:flex;align-items:center;gap:12px;min-width:0">
                <div class="avatar sm" style="width:34px;height:34px;display:flex;align-items:center;justify-content:center;background:var(--bg-raised);border:1px solid var(--border);border-radius:50%;font-size:14px;font-weight:700;color:var(--text-1)">${avatarUrl ? `<img src="${esc(avatarUrl)}" alt="${esc(username)}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;display:block" />` : avatarLetter}</div>
                <div style="min-width:0;overflow:hidden">
                  <div style="font-size:14px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(username)}</div>
                  <div style="font-size:12px;color:var(--text-3)">${esc(status)}</div>
                </div>
              </div>
              <div style="display:flex;gap:8px;flex-shrink:0">
                <button data-friend-action="open-dm" data-friend-username="${esc(username)}" class="btn btn-primary btn-sm" ${active ? 'disabled' : ''}>${esc(openLabel)}</button>
                <button data-friend-action="remove" data-friend-username="${esc(username)}" class="btn btn-ghost btn-sm">Unadd</button>
              </div>
            </div>
          `;
        }).join('')
      : '<div style="color:var(--text-3);font-size:13px;line-height:1.6">No current friends yet.</div>';

    return `
      <div id="current-friends-section" class="card" style="margin-bottom:16px">
        <div class="card-title">Current Friends</div>
        <div style="padding:0 16px 16px">${friendsHtml}</div>
      </div>
    `;
  };

  const renderFriendSearchResults = () => {
    const hasSearchQuery = String(state.friendSearchQuery || '').trim().length > 0;
    if (!Array.isArray(state.friendSearchResults) || state.friendSearchResults.length === 0) {
      const message = hasSearchQuery
        ? 'No users match your search.'
        : 'No users available.';
      return `<div style="color:var(--text-3);font-size:13px;line-height:1.6">${message}</div>`;
    }
    return state.friendSearchResults.map((user) => {
      const targetUsername = String(user.username || '').trim().toLowerCase();
      const userAvatar = withAvatarVersion(String(user?.avatar || user?.avatarUrl || '').trim());
      const avatarLetter = esc((user.username || 'U').charAt(0).toUpperCase());
      const isMutual = user.mutual;
      const isIncoming = user.incoming;
      const isPending = user.pending;
      const statusText = isMutual ? 'Mutual friend' : isIncoming ? 'Incoming request' : isPending ? 'Request pending' : 'Not friends yet';
      return `
        <div class="friend-list-item" style="display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06)">
          <div style="display:flex;align-items:center;gap:12px;min-width:0">
            <div class="avatar sm" style="width:34px;height:34px;display:flex;align-items:center;justify-content:center;background:var(--bg-raised);border:1px solid var(--border);border-radius:50%;font-size:14px;font-weight:700;color:var(--text-1)">${userAvatar ? `<img src="${esc(userAvatar)}" alt="${esc(user.username)}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;display:block" />` : avatarLetter}</div>
            <div style="min-width:0;overflow:hidden">
              <div style="font-size:14px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(user.username)}</div>
              <div style="font-size:12px;color:var(--text-3)">${statusText}</div>
            </div>
          </div>
          <div style="display:flex;gap:8px">
            ${isIncoming ? `
              <button data-friend-action="accept" data-friend-username="${esc(targetUsername)}" class="btn btn-primary btn-sm">Accept</button>
              <button data-friend-action="deny" data-friend-username="${esc(targetUsername)}" class="btn btn-ghost btn-sm">Deny</button>
            ` : isPending ? `
              <button data-friend-action="cancel" data-friend-username="${esc(targetUsername)}" class="btn btn-ghost btn-sm">Cancel</button>
            ` : isMutual ? `
              <button data-friend-action="open-dm" data-friend-username="${esc(targetUsername)}" class="btn btn-primary btn-sm">Open DM</button>
              <button data-friend-action="remove" data-friend-username="${esc(targetUsername)}" class="btn btn-ghost btn-sm">Remove</button>
            ` : `
              <button data-friend-action="add" data-friend-username="${esc(targetUsername)}" class="btn btn-primary btn-sm">Add Friend</button>
            `}
          </div>
        </div>
      `;
    }).join('');
  };

  const attachFriendSearchActions = () => {
    if (!friendSearchActionClickHandler) {
      friendSearchActionClickHandler = async (event) => {
        const button = event.target.closest('[data-friend-action]');
        if (!button) return;
        const username = button.getAttribute('data-friend-username');
        const action = button.getAttribute('data-friend-action');
        if (!action) return;
        if (button.disabled) return;
        if (action === 'remove' && username && !window.confirm(`Unadd ${username}? This removes the friendship for both of you.`)) {
          return;
        }
        if (action !== 'refresh-requests') {
          button.disabled = true;
          button.textContent = 'Working...';
        }
        try {
          if (action === 'open-dm') {
            if (!username) return;
            await openDmWithFriend(username);
            return;
          } else if (action === 'add') {
            if (!username) return;
            const response = await api('/api/users/friends', { method: 'POST', body: { username } });
            if (response?.user) state.user = { ...state.user, ...response.user };
            if (response?.requests) {
              state.friendRequestsIncoming = Array.isArray(response.requests.incoming)
                ? response.requests.incoming
                : state.friendRequestsIncoming;
              state.friendRequestsOutgoing = Array.isArray(response.requests.outgoing)
                ? response.requests.outgoing
                : state.friendRequestsOutgoing;
            }
          } else if (action === 'remove' || action === 'cancel') {
            if (!username) return;
            const response = await api(`/api/users/friends/${encodeURIComponent(username)}`, { method: 'DELETE' });
            if (response?.user) state.user = { ...state.user, ...response.user };
            if (response?.requests) {
              state.friendRequestsIncoming = Array.isArray(response.requests.incoming)
                ? response.requests.incoming
                : state.friendRequestsIncoming;
              state.friendRequestsOutgoing = Array.isArray(response.requests.outgoing)
                ? response.requests.outgoing
                : state.friendRequestsOutgoing;
            }
          } else if (action === 'accept') {
            if (!username) return;
            const response = await api('/api/users/friends/accept', { method: 'POST', body: { username } });
            if (response?.user) state.user = { ...state.user, ...response.user };
            if (response?.requests) {
              state.friendRequestsIncoming = Array.isArray(response.requests.incoming)
                ? response.requests.incoming
                : state.friendRequestsIncoming;
              state.friendRequestsOutgoing = Array.isArray(response.requests.outgoing)
                ? response.requests.outgoing
                : state.friendRequestsOutgoing;
            }
          } else if (action === 'deny') {
            if (!username) return;
            const response = await api('/api/users/friends/deny', { method: 'POST', body: { username } });
            if (response?.user) state.user = { ...state.user, ...response.user };
            if (response?.requests) {
              state.friendRequestsIncoming = Array.isArray(response.requests.incoming)
                ? response.requests.incoming
                : state.friendRequestsIncoming;
              state.friendRequestsOutgoing = Array.isArray(response.requests.outgoing)
                ? response.requests.outgoing
                : state.friendRequestsOutgoing;
            }
          } else if (action === 'refresh-requests') {
            await refreshFriends(state.friendSearchQuery || '');
            const resultsContainer = document.getElementById('friend-search-results');
            if (resultsContainer) {
              resultsContainer.innerHTML = renderFriendSearchResults();
            }
            const requestsContainer = document.getElementById('friend-requests-section');
            if (requestsContainer) {
              requestsContainer.outerHTML = renderFriendRequestsSection();
            }
            const currentFriendsContainer = document.getElementById('current-friends-section');
            if (currentFriendsContainer) {
              currentFriendsContainer.outerHTML = renderCurrentFriendsSection();
            }
            attachFriendSearchActions();
            return;
          }

          await refreshFriends(state.friendSearchQuery || '');
          const resultsContainer = document.getElementById('friend-search-results');
          if (resultsContainer) {
            resultsContainer.innerHTML = renderFriendSearchResults();
          }
          const requestsContainer = document.getElementById('friend-requests-section');
          if (requestsContainer) {
            requestsContainer.outerHTML = renderFriendRequestsSection();
          }
          const currentFriendsContainer = document.getElementById('current-friends-section');
          if (currentFriendsContainer) {
            currentFriendsContainer.outerHTML = renderCurrentFriendsSection();
          }
          attachFriendSearchActions();
        } catch (err) {
          console.warn('Friend action failed:', action, username, err);
          showToast(err.message || 'Friend action failed', 'error');
          if (button && action !== 'refresh-requests') {
            button.disabled = false;
            const fallbackLabel = action === 'add'
              ? 'Add Friend'
              : action === 'remove'
              ? 'Remove'
              : action === 'open-dm'
              ? 'Open DM'
              : action === 'cancel'
              ? 'Cancel'
              : action === 'accept'
              ? 'Accept'
              : action === 'deny'
              ? 'Deny'
              : 'Retry';
            button.textContent = fallbackLabel;
          }
        }
      };
    }

    const resultsContainer = document.getElementById('friend-search-results');
    const requestsContainer = document.getElementById('friend-requests-section');
    const currentFriendsContainer = document.getElementById('current-friends-section');
    [resultsContainer, requestsContainer, currentFriendsContainer].forEach((container) => {
      if (!container) return;
      container.removeEventListener('click', friendSearchActionClickHandler);
      container.addEventListener('click', friendSearchActionClickHandler);
    });
  };

  const renderDirectMessagesPage = async () => {
    try {
      state.friendSearchQuery = state.friendSearchQuery || '';
      await refreshFriends(state.friendSearchQuery);
      await refreshPresence();

      const onlineCount = state.channels.filter((c) => c.type === 'dm' && c.onlineCount > 0).length;

      layoutShell(`
        <div class="page-scroll">
          <div class="page-inner" style="max-width:760px">
            <div style="margin-bottom:4px">
              <h1 style="font-size:20px;font-weight:700;color:var(--text-1);letter-spacing:-0.02em">Friends & Direct Messages${onlineCount > 0 ? ` (${onlineCount} online)` : ''}</h1>
              <p style="font-size:13px;color:var(--text-3);margin-top:4px">Browse users or search by username to send a request. Direct messages appear only after both people are friends.</p>
              <p style="color:red;font-weight:600;margin-top:8px;font-size:14px">These rooms are moderated. Do not share any personal information or you WILL be banned permanently.</p>
            </div>
            <div class="card" style="margin-bottom:16px">
              <div class="field">
                <label for="friend-search-input">Search people</label>
                <input id="friend-search-input" name="friend-search" class="inp" placeholder="Search username" value="${esc(state.friendSearchQuery)}" autocomplete="username" />
              </div>
            </div>
            ${renderFriendRequestsSection()}
            ${renderCurrentFriendsSection()}
            <div class="card">
              <div class="card-title">People</div>
              <div id="friend-search-results" style="display:flex;flex-direction:column;gap:0">
                ${renderFriendSearchResults()}
              </div>
            </div>
          </div>
        </div>
      `);

      const searchInput = document.getElementById('friend-search-input');
      if (searchInput) {
        let timer = null;
        searchInput.addEventListener('input', () => {
          clearTimeout(timer);
          timer = setTimeout(async () => {
            state.friendSearchQuery = String(searchInput.value || '').trim();
            await refreshFriends(state.friendSearchQuery);
            const resultsContainer = document.getElementById('friend-search-results');
            if (resultsContainer) {
              resultsContainer.innerHTML = renderFriendSearchResults();
            }
            const requestsContainer = document.getElementById('friend-requests-section');
            if (requestsContainer) {
              requestsContainer.outerHTML = renderFriendRequestsSection();
            }
            const currentFriendsContainer = document.getElementById('current-friends-section');
            if (currentFriendsContainer) {
              currentFriendsContainer.outerHTML = renderCurrentFriendsSection();
            }
            attachFriendSearchActions();
          }, 240);
        });
      }
      attachFriendSearchActions();
    } catch (err) {
      console.error('Error rendering direct messages page:', err);
      throw err;
    }
  };

  /* ========== MESSAGING ========== */
  const deliverQueuedMessage = async (entry) => {
    const postMsg = () => api(`/api/tlk/rooms/${encodeURIComponent(entry.channel.room)}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-tlk-client-id': getTlkClientId(), 'x-chat-device-id': getChatDeviceId() },
      body: { body: entry.body, clientNonce: entry.clientNonce }
    });
    const sendLiveMessage = () => sendMessageOverSocket(entry.channel, entry.body, entry.clientNonce);

    try {
      let sent;
      try {
        sent = await sendLiveMessage();
      } catch (socketError) {
        if (socketError.status === 401) {
          resetLocalChatIdentity();
          await joinRoom(entry.channel);
          sent = await sendLiveMessage();
        } else {
          try {
            sent = await postMsg();
          } catch (fallbackError) {
            if (fallbackError.status !== 401) throw fallbackError;
            resetLocalChatIdentity();
            await joinRoom(entry.channel);
            sent = await postMsg();
          }
        }
      }
      if (sent?.reward?.balance !== undefined && state.user) {
        state.user = { ...state.user, coins: Math.max(0, Number(sent.reward.balance || 0)) };
        updateCoinDisplays();
      }
      upsertRealtimeMessage({ ...sent, roomId: entry.channel.room, clientNonce: sent?.clientNonce || entry.clientNonce }, { replaceOptimistic: true });
      messageOutbox = messageOutbox.filter((candidate) => candidate.clientNonce !== entry.clientNonce);
      applySlowmodeCooldown(state.slowmodeMs);
    } catch (error) {
      if (error?.status === 429) applySlowmodeCooldown(parseSlowmodeRetryMs(error.message));
      entry.state = 'failed';
      const index = state.messages.findIndex((message) => getClientNonce(message) === entry.clientNonce);
      if (index >= 0) state.messages[index] = { ...state.messages[index], pending: false, failed: true, sendState: 'failed' };
      renderMessages();
    }
  };

  const drainMessageOutbox = async () => {
    if (drainingMessageOutbox) return;
    drainingMessageOutbox = true;
    try {
      let entry;
      while ((entry = messageOutbox.find((candidate) => candidate.state === 'queued'))) {
        entry.state = 'sending';
        const index = state.messages.findIndex((message) => getClientNonce(message) === entry.clientNonce);
        if (index >= 0) state.messages[index] = { ...state.messages[index], pending: true, failed: false, sendState: 'sending' };
        // Skip the full re-render — the optimistic message is already in
        // place and the spinner is a CSS state on the existing node.
        await deliverQueuedMessage(entry);
      }
    } finally {
      drainingMessageOutbox = false;
      scheduleSlowmodeUi();
    }
  };

  const retryQueuedMessage = (clientNonce) => {
    const entry = messageOutbox.find((candidate) => candidate.clientNonce === String(clientNonce || '').trim());
    if (!entry || entry.state !== 'failed') return;
    entry.state = 'queued';
    const index = state.messages.findIndex((message) => getClientNonce(message) === entry.clientNonce);
    if (index >= 0) state.messages[index] = { ...state.messages[index], pending: true, failed: false, sendState: 'queued' };
    renderMessages();
    void drainMessageOutbox();
  };

  const sendMessage = async (text) => {
    if (!state.currentChannel) return;
    let trimmed = String(text || '').trim();
    if (state.replyTarget) {
      trimmed = `> Replying to ${state.replyTarget.name}: ${state.replyTarget.quote}\n${trimmed}`;
      state.replyTarget = null;
      renderComposerReplyState();
    }
    if (state.pendingAttachment) {
      const attachment = state.pendingAttachment;
      if (attachment.error) {
        throw new Error(attachment.error || 'Image upload failed');
      }
      if (!attachment.uploaded) {
        // Wait for the in-flight upload so the message body has a server URL.
        // A short timeout avoids hanging the send on a stuck request.
        const deadline = Date.now() + 15000;
        while (state.pendingAttachment && !state.pendingAttachment.uploaded && !state.pendingAttachment.error && Date.now() < deadline) {
          await new Promise((resolve) => setTimeout(resolve, 50));
        }
        if (state.pendingAttachment?.error) throw new Error(state.pendingAttachment.error);
        if (!state.pendingAttachment?.uploaded) throw new Error('Image upload timed out');
      }
      const finalAttachment = state.pendingAttachment;
      const imageUrl = finalAttachment.uploadUrl || finalAttachment.dataUrl || '';
      if (imageUrl) {
        trimmed = `${trimmed}${trimmed ? '\n' : ''}[image: ${finalAttachment.name}](${imageUrl})`;
      } else {
        trimmed = `${trimmed}${trimmed ? '\n' : ''}[file: ${finalAttachment.name}]`;
      }
      state.pendingAttachment = null;
      renderAttachmentState();
    }
    if (!trimmed) return;
    if (messageOutbox.length >= OUTBOX_LIMIT) throw new Error(`Outbox is full. Retry or wait for one of the ${OUTBOX_LIMIT} pending messages.`);
    const slowmodeRemainingMs = getSlowmodeRemainingMs();
    if (slowmodeRemainingMs > 0) {
      scheduleSlowmodeUi();
      throw new Error(`Slowmode active. Wait ${Math.ceil(slowmodeRemainingMs / 1000)}s before sending another message.`);
    }

    const channel = state.currentChannel;
    stopLocalTyping(channel.room);
    const body = trimmed;
    const clientNonce = createClientNonce();

    const optimisticMsg = {
      _id: `temp-${clientNonce}`,
      clientNonce,
      nickname: String(state.user?.username || state.user?.name || localStorage.getItem('tlkNickname') || 'You').trim(),
      avatar: state.user?.avatar || null,
      body: body,
      date: new Date().toISOString(),
      _nebuloClientCreatedAt: Date.now(),
      _nebuloLocalOrder: ++localMessageOrder,
      pending: true,
      sendState: 'queued',
      roomId: channel.room,
      userId: state.user?._id || state.user?.id || '',
      role: state.user?.role || 'user',
      equippedEffect: normalizeEffectId(state.user?.equippedEffect)
    };
    // Optimistic sends append at the end of the list and skip the full
    // chronological re-sort. The full sort only happens when a real server
    // response (or new history) arrives, which keeps the send feeling instant.
    state.messages.push(optimisticMsg);
    if (id) animatedMessageIds.add(id);
    state.lastMessagesSignature = getMessagesSignature(state.messages);
    state.smoothNextMessageScroll = true;
    renderMessages();

    messageOutbox.push({ clientNonce, channel, body, state: 'queued' });
    scheduleSlowmodeUi();
    void drainMessageOutbox();
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

    if (cmd === '/help') { showComposerNotice('Commands: /ai /global /warn /ban /banfromall /unban /clearwarns /slowmode-room /slowmode-global /clearchat', 'success', 4000); return true; }

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

    const modActions = new Set(['/warn', '/ban', '/banfromall', '/unban', '/clearwarns', '/slowmode', '/slowmode-room', '/slowmode-global', '/clearchat']);
    if (!modActions.has(cmd)) { showComposerNotice(`Unknown command: ${cmd}`, 'error', 3200); return true; }
    if (!hasModRole) { showComposerNotice('Only owner/admin can use moderation commands', 'error', 3500); return true; }
    if (cmd === '/clearchat' && role !== 'owner') { showComposerNotice('Only owner can use /clearchat', 'error', 3500); return true; }
    if (!['/slowmode-global'].includes(cmd) && !room) { showComposerNotice('No active room selected', 'error', 3200); return true; }

    if (cmd === '/slowmode' || cmd === '/slowmode-room' || cmd === '/slowmode-global') {
      const seconds = Number(parts[0]);
      if (!Number.isFinite(seconds) || seconds < 0) {
        showComposerNotice(`Usage: ${cmd} <seconds>`, 'error', 3800);
        return true;
      }
      const isGlobalSlowmode = cmd === '/slowmode-global';
      const action = isGlobalSlowmode ? 'slowmode_global' : 'slowmode_room';
      const actionResult = await api('/api/network/mod/actions', {
        method: 'POST',
        body: { action, target: '__slowmode__', seconds, room }
      });
      const slowmodeSeconds = Math.max(0, Number(actionResult?.slowmodeSeconds || 0));
      if (isGlobalSlowmode) state.globalSlowmodeMs = slowmodeSeconds * 1000;
      else state.roomSlowmodeMs = slowmodeSeconds * 1000;
      const type = String(state.currentChannel?.type || '').toLowerCase();
      const globalAppliesHere = !['dm', 'group'].includes(type);
      state.slowmodeMs = !isGlobalSlowmode || globalAppliesHere
        ? slowmodeSeconds * 1000
        : Math.max(0, Number(state.roomSlowmodeMs || 0));
      state.slowmodeScope = isGlobalSlowmode ? 'global' : 'room';
      if (!state.slowmodeMs) state.slowmodeUntil = 0;
      scheduleSlowmodeUi();
      if (room) {
        const actor = state.user?.username || state.user?.name || 'Moderation';
        const scopeLabel = isGlobalSlowmode ? 'public-room global' : 'room';
        await postModerationNote(room, `Moderation: ${actor} set ${scopeLabel} slowmode to ${slowmodeSeconds}s.`);
        if (state.currentChannel?.room === room) await getMessages(state.currentChannel).catch(() => {});
      }
      showComposerNotice(
        slowmodeSeconds > 0
          ? `${isGlobalSlowmode ? 'Public-room global' : 'Room'} slowmode set to ${slowmodeSeconds}s`
          : `${isGlobalSlowmode ? 'Public-room global' : 'Room'} slowmode disabled`,
        'success',
        3200
      );
      return true;
    }

    if (cmd === '/clearchat') {
      const reason = String(parts.join(' ') || 'Owner cleared room').trim();
      await api('/api/network/mod/actions', { method: 'POST', body: { action: 'clearchat', target: '__room__', reason, room } });
      await postModerationNote(room, `Moderation: ${state.user?.username || state.user?.name || 'Owner'} cleared this room.`);
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
      ban: `Moderation: ${targetDisplay} was banned from this server. Appeal: dsc.gg/nebulo`,
      banfromall: `Moderation: ${targetDisplay} was globally banned. Appeal: dsc.gg/nebulo`,
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
    if (!Array.isArray(state.mutualFriends) || state.mutualFriends.length === 0) await refreshFriends('');
    const nextChannel = getCurrentChannel(channelId);
    const nextRoomId = String(nextChannel?.room || '').trim();
    const previousVoiceRoomId = getVoiceRoomForTextChannel(state.currentChannel);
    const nextVoiceRoomId = getVoiceRoomForTextChannel(nextChannel);
    if (
      previousRoomId &&
      nextRoomId &&
      previousRoomId !== nextRoomId &&
      previousVoiceRoomId !== nextVoiceRoomId &&
      state.activeVoiceCall?.roomName === previousVoiceRoomId
    ) {
      await leaveActiveVoiceCall();
    }
    state.currentChannel = nextChannel;
    const currentRoomId = String(state.currentChannel?.room || '').trim();
    if (state.currentChannel?.type === 'group' && currentRoomId) {
      await joinMessageRoom(currentRoomId);
    }
    if (state.currentChannel?.type === 'dm' && currentRoomId) {
    }
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
    const roomType = String(state.currentChannel?.type || '').toLowerCase();
    if (['dm', 'group'].includes(roomType)) {
      await fetchRoomSettings(state.currentChannel);
    }

    const channelName = esc(state.currentChannel?.name?.replace(/^#/, '') || 'general');

    const dmWarning = state.currentChannel?.type === 'dm'
      ? '<div class="dm-safety-banner"><span class="dm-safety-banner-mark"></span><span><strong>Moderated DM.</strong> Do not share personal information.</span></div>'
      : '';
    const canManageRoomTools = isAdminOrOwner(state.currentChannel?.room);
    const canUseRoomBackground = ['dm', 'group'].includes(roomType);
    const hasRoomBackground = !!getRoomBackgroundImage(state.currentChannel?.room);
    const adminRoomToolsHtml = canManageRoomTools
      ? `
         <button type="button" id="btn-room-settings" class="btn btn-secondary btn-sm">Room settings</button>
         <button type="button" id="btn-theme-picker" class="btn btn-secondary btn-sm">Theme</button>
         <button type="button" id="btn-mod-log" class="btn btn-secondary btn-sm">Mod log</button>`
      : '';
    const roomBackgroundToolsHtml = canUseRoomBackground
      ? `<button type="button" id="btn-room-background" class="btn btn-secondary btn-sm">Background</button>
         ${hasRoomBackground ? '<button type="button" id="btn-clear-room-background" class="btn btn-secondary btn-sm">Clear BG</button>' : ''}
         <input id="room-background-input" type="file" accept="image/*" hidden />`
      : '';
    const currentVoiceChannel = getCurrentVoiceChannel();
    const voiceChannelName = currentVoiceChannel?.name || 'General';
    const voiceSectionTitle = roomType === 'public' ? 'Public Voice' : 'Voice Rooms';
    const voiceChannelHtml = currentVoiceChannel && roomType !== 'public'
      ? `<div class="voice-channel-section" aria-label="Voice channels">
           <div class="voice-channel-heading">${esc(voiceSectionTitle)}</div>
           <button id="voice-channel-general" class="voice-channel-card" type="button" data-voice-room="${esc(currentVoiceChannel.room)}">
             <span class="voice-channel-icon">
               <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4z"/><path d="M5 8a1 1 0 10-2 0 7 7 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07A7 7 0 0017 8a1 1 0 10-2 0 5 5 0 01-10 0z"/></svg>
             </span>
             <span class="voice-channel-main">
               <strong>${esc(voiceChannelName)}</strong>
               <span data-voice-count>Empty</span>
             </span>
             <span class="voice-channel-action" data-voice-action>Start</span>
           </button>
         </div>`
      : '';

    layoutShell(
      `${dmWarning}
       <div class="room-tools">
         <input id="room-search-input" class="room-tool-input" placeholder="Search this room" value="${esc(state.roomSearchQuery || '')}" />
         ${roomBackgroundToolsHtml}
         ${adminRoomToolsHtml}
       </div>
       ${voiceChannelHtml}
       <div id="chat-messages"></div>
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
          <div id="room-effects-balance" class="coin-chip">${formatCoinLabel(state.user?.coins)}</div>
        </div>
        <div id="command-panel" class="hidden"></div>
        <div id="mention-panel" class="mention-panel hidden"></div>
        <div id="composer-notice" class="hidden"></div>
        <div id="reply-compose-preview" class="compose-preview hidden"></div>
        <div id="attachment-preview" class="compose-preview hidden"></div>
        <div class="composer-box">
          <div id="typing-indicator" class="typing-indicator hidden" aria-live="polite"></div>
          <form id="chat-form" class="composer-form">
            <textarea id="chat-input" rows="1" placeholder="Message #${channelName}" class="composer-textarea" spellcheck="true" autocomplete="off"></textarea>
            <div style="display:flex;gap:2px;align-items:flex-end;flex-shrink:0">
              <label class="composer-file-btn" title="Attach image/file">
                +
                <input id="chat-file-input" type="file" accept="image/*,.txt,.json,.csv,.log" hidden />
              </label>
              <div style="position:relative">
                <button type="button" id="effects-btn" class="composer-effect-btn" title="Room effects" aria-label="Open room effects">✦</button>
              </div>
              <div style="position:relative">
                <button type="button" id="sound-btn" class="composer-emoji-btn" title="Sound effects" aria-label="Open sound effects selector">🔊</button>
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

    const roomCodeBanner = document.getElementById('room-code-banner');
    const roomCodeValue = document.getElementById('room-code-value');
    if (roomCodeBanner && roomCodeValue) {
      if (state.currentChannel?.type === 'group' && state.currentChannel.room) {
        roomCodeValue.textContent = state.currentChannel.room;
        roomCodeBanner.classList.remove('hidden');
      } else {
        roomCodeBanner.classList.add('hidden');
      }
    }

    const copyRoomCodeBtn = document.getElementById('copy-room-code-btn');
    if (copyRoomCodeBtn) {
      copyRoomCodeBtn.removeEventListener('click', copyRoomCodeBtn._handler);
      copyRoomCodeBtn._handler = () => {
        const roomCode = String(state.currentChannel?.room || '').trim();
        if (!roomCode) return;
        navigator.clipboard.writeText(roomCode)
          .then(() => showToast('Room code copied'))
          .catch(() => showToast('Unable to copy room code', 'error'));
      };
      copyRoomCodeBtn.addEventListener('click', copyRoomCodeBtn._handler);
    }

    document.getElementById('room-search-input')?.addEventListener('input', (event) => {
      state.roomSearchQuery = String(event.target.value || '');
      renderMessages();
    });

    applyRoomBackground(state.currentChannel?.room);

    const backgroundInput = document.getElementById('room-background-input');
    document.getElementById('btn-room-background')?.addEventListener('click', () => {
      backgroundInput?.click();
    });
    document.getElementById('btn-clear-room-background')?.addEventListener('click', async () => {
      try {
        await saveSharedRoomBackground('');
        showToast('Background cleared for this chat');
        if (state.currentChannel?._id) renderChatPage(state.currentChannel._id).catch(() => {});
      } catch (err) {
        showToast(err.message || 'Could not clear background', 'error');
      }
    });
    backgroundInput?.addEventListener('change', () => {
      const file = backgroundInput.files?.[0];
      backgroundInput.value = '';
      if (!file) return;
      if (!file.type.startsWith('image/')) {
        showToast('Choose an image file', 'error');
        return;
      }
      if (file.size > 900 * 1024) {
        showToast('Background image must be under 900 KB', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          await saveSharedRoomBackground(String(reader.result || ''));
          showToast('Background updated for this chat');
          if (state.currentChannel?._id) renderChatPage(state.currentChannel._id).catch(() => {});
        } catch (err) {
          showToast(err.message || 'Could not update background', 'error');
        }
      };
      reader.onerror = () => showToast('Could not read background image', 'error');
      reader.readAsDataURL(file);
    });

    document.getElementById('btn-theme-picker')?.addEventListener('click', () => {
      if (!isAdminOrOwner()) {
        showToast('Only admins and owners can change themes', 'error');
        return;
      }
      const accent = window.prompt('Accent color hex, compact mode: add " compact"', state.themePrefs.accent || '#7c69fa');
      if (accent === null) return;
      const compact = /\bcompact\b/i.test(accent);
      state.themePrefs = { accent: accent.replace(/\bcompact\b/ig, '').trim() || '#7c69fa', compact };
      localStorage.setItem('ubgChatThemePrefs', JSON.stringify(state.themePrefs));
      applyThemePrefs();
      showToast('Theme updated');
    });

    document.getElementById('btn-mod-log')?.addEventListener('click', () => {
      void openModerationReportsPanel();
    });

    document.getElementById('btn-room-settings')?.addEventListener('click', async () => {
      if (!isAdminOrOwner()) {
        showToast('Only admins and owners can change room settings', 'error');
        return;
      }
      const meta = getRoomMeta();
      const currentName = state.currentChannel?.name || '';
      const nextName = window.prompt('Room display name', meta.settings?.name || currentName);
      if (nextName === null) return;
      meta.settings = meta.settings || {};
      meta.settings.name = String(nextName || '').trim();
      if (state.currentChannel?.type === 'group' && state.currentChannel.room) {
        try {
          const updated = await api(`/api/group-chats/${encodeURIComponent(state.currentChannel.room)}`, {
            method: 'PUT',
            body: { name: meta.settings.name }
          });
          if (updated?.group) handleGroupUpdated({ group: updated.group });
          if (window.confirm('Regenerate this group invite code now? Existing code will stop being the sidebar code.')) {
            const regen = await api(`/api/group-chats/${encodeURIComponent(state.currentChannel.room)}/regenerate-code`, { method: 'POST' });
            if (regen?.group) handleGroupUpdated({ group: regen.group, previousRoom: regen.previousRoom || state.currentChannel.room });
          }
        } catch (err) {
          showToast(err.message || 'Could not update group settings', 'error');
        }
      }
      const cooldown = Number(window.prompt('Sound cooldown seconds', meta.settings.soundCooldownSeconds || 5) || 5);
      meta.settings.soundCooldownSeconds = Math.max(0, Number.isFinite(cooldown) ? cooldown : 5);
      const roles = window.prompt('Room roles as username:role pairs, comma separated', Object.entries(meta.roles || {}).map(([user, role]) => `${user}:${role}`).join(', '));
      if (roles !== null) {
        meta.roles = {};
        roles.split(',').forEach((pair) => {
          const [user, role] = pair.split(':').map((part) => String(part || '').trim());
          if (user && role) meta.roles[user.toLowerCase()] = role.toLowerCase();
        });
      }
      meta.settings.soundModsOnly = window.confirm('Limit sound effects to owner/admin/mod roles?');
      pushRoomLog('Updated room settings');
      saveRoomMetaStore();
      showToast('Room settings saved');
    });

    const fileInput = document.getElementById('chat-file-input');
    if (fileInput) {
      fileInput.addEventListener('change', () => {
        const file = fileInput.files?.[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
          showComposerNotice('File too large. Limit is 5 MB.', 'error', 3500);
          fileInput.value = '';
          return;
        }
        if (file.type.startsWith('image/')) {
          const tempId = `pending-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
          const localPreviewUrl = (() => {
            try { return URL.createObjectURL(file); } catch { return ''; }
          })();
          state.pendingAttachment = {
            id: tempId,
            name: file.name,
            dataUrl: localPreviewUrl,
            uploaded: false,
            uploadUrl: null,
            file,
            error: null
          };
          renderAttachmentState();
          // Upload to the database-backed image store. The returned URL is
          // the one we embed in the message body so the message stays small
          // and the moderation result is consistent across recipients.
          const room = String(state.currentChannel?.room || '').trim().toLowerCase();
          const formData = new FormData();
          formData.append('image', file);
          if (room) formData.append('room', room);
          api('/api/upload/image-db', { method: 'POST', body: formData })
            .then((result) => {
              if (!state.pendingAttachment || state.pendingAttachment.id !== tempId) return;
              const url = String(result?.url || '').trim();
              if (!url) throw new Error('Upload did not return a URL');
              state.pendingAttachment = {
                ...state.pendingAttachment,
                uploaded: true,
                uploadUrl: url,
                dataUrl: url,
                moderation: result?.moderation || null
              };
              renderAttachmentState();
            })
            .catch((err) => {
              if (state.pendingAttachment && state.pendingAttachment.id === tempId) {
                state.pendingAttachment = { ...state.pendingAttachment, error: err?.message || 'Upload failed' };
                renderAttachmentState();
              }
              showComposerNotice(err?.message || 'Image upload failed', 'error', 3500);
            })
            .finally(() => {
              if (localPreviewUrl) {
                // Revoke the object URL only after the server URL replaces it.
                setTimeout(() => URL.revokeObjectURL(localPreviewUrl), 30_000);
              }
            });
        } else {
          state.pendingAttachment = { id: `pending-${Date.now()}`, name: file.name, dataUrl: '', uploaded: true, uploadUrl: null, file: null, error: null };
          renderAttachmentState();
        }
        fileInput.value = '';
      });
    }

    const leaveGroupBtn = document.getElementById('leave-group-btn');
    if (leaveGroupBtn) {
      leaveGroupBtn.removeEventListener('click', leaveGroupBtn._handler);
      leaveGroupBtn._handler = async () => {
        if (!state.currentChannel || state.currentChannel.type !== 'group') return;
        const groupName = String(state.currentChannel.name || state.currentChannel.room || '').trim();
        const confirmed = window.confirm(`Leave ${groupName}? You can rejoin with the room code if needed.`);
        if (!confirmed) return;
        if (state.currentChannel._id) {
          await leaveGroupChat(state.currentChannel._id);
        }
      };
      leaveGroupBtn.addEventListener('click', leaveGroupBtn._handler);
    }

    state.autoFollow = true;
    setJumpToLatestVisible(false);
    renderRoomEffectStage();
    renderTypingIndicator();
    renderComposerReplyState();
    renderAttachmentState();
    applyThemePrefs();
    void joinTypingRoom(state.currentChannel?.room);

    // Show the voice button without auto-joining or opening active room calls.
    const voiceChatBtn = document.getElementById('btn-voice-chat');
    if (voiceChatBtn) {
      voiceChatBtn.style.display = ['group', 'dm'].includes(String(state.currentChannel?.type || '').toLowerCase()) ? '' : 'none';
      const currentVoice = getCurrentVoiceChannel();
      const activeForCurrentVoice = !!(state.activeVoiceCall?.roomName && currentVoice?.room && state.activeVoiceCall.roomName === currentVoice.room);
      voiceChatBtn.classList.toggle('active', activeForCurrentVoice);
      updateVoiceButtonLabel(activeForCurrentVoice ? state.activeVoiceCall : ((currentVoice?.room ? state.voiceCallsByRoom?.[currentVoice.room] : null) || null));
      void refreshVoiceCalls();
    }

    // Show/hide voice call panel
    const voiceCallPanel = document.getElementById('voice-call-panel');
    if (voiceCallPanel) {
      if (state.activeVoiceCall?.roomName) {
        voiceCallPanel.classList.remove('hidden');
        updateVoicePanelHeader(state.activeVoiceCall);
      } else {
        voiceCallPanel.classList.add('hidden');
      }
    }

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
      state.newMessagesAfterId = '';
      setJumpToLatestVisible(false);
      scrollChatToBottom('smooth');
    });

    if (!state.currentChannel) {
      document.getElementById('chat-messages').innerHTML =
        '<div class="msg-state" style="color:var(--danger)">No channels available.</div>';
      return;
    }
    document.getElementById('chat-messages').innerHTML = '<div class="msg-state">Loading messages…</div>';

    // Remove existing listeners to prevent duplicates
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    if (chatForm) {
      chatForm.removeEventListener('submit', chatForm._submitHandler);
      chatForm._submitHandler = async (e) => {
        e.preventDefault();
        const input = document.getElementById('chat-input');
        if (!input) return;
        const text = input.value;
        input.value = '';
        input.style.height = '';
        renderCommandPanel('');
        renderMentionSuggestions('');
        stopLocalTyping(state.currentChannel?.room);
        try {
          const handled = await runSlashCommand(text);
          if (handled) return;
          await sendMessage(text);
        } catch (err) {
          if (text && !input.value) {
            input.value = text;
            input.style.height = '';
            input.style.height = `${Math.min(input.scrollHeight, 180)}px`;
          }
          showComposerNotice(err.message || 'Failed to send', 'error', 4200);
        }
      };
      chatForm.addEventListener('submit', chatForm._submitHandler);
    }
    if (chatInput) {
      chatInput.removeEventListener('keydown', chatInput._keydownHandler);
      chatInput._keydownHandler = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); document.getElementById('chat-form')?.requestSubmit(); }
      };
      chatInput.addEventListener('keydown', chatInput._keydownHandler);

      chatInput.removeEventListener('input', chatInput._inputHandler);
      chatInput._inputHandler = (e) => {
        const value = e.target?.value || '';
        renderCommandPanel(value);
        renderMentionSuggestions(value);
        syncLocalTyping(value);
      };
      chatInput.addEventListener('input', chatInput._inputHandler);

      chatInput.removeEventListener('blur', chatInput._blurHandler);
      chatInput._blurHandler = () => {
        stopLocalTyping(state.currentChannel?.room);
      };
      chatInput.addEventListener('blur', chatInput._blurHandler);
    }

    // Sound effect selector
    const SOUND_EFFECTS = [
      {
        id: 'duck',
        name: 'Duck Quack',
        description: 'A loud duck quack plays for everyone in this room.',
        price: 150,
        icon: '🦆'
      }
    ];

    const setupSoundPicker = () => {
      const btn = document.getElementById('sound-btn');
      if (!btn) return;

      let popoverEl = null;
      let documentMouseDownListener = null;
      let open = false;

      const closePicker = () => {
        if (popoverEl && popoverEl.parentNode) popoverEl.parentNode.removeChild(popoverEl);
        popoverEl = null;
        if (documentMouseDownListener) {
          document.removeEventListener('mousedown', documentMouseDownListener, { capture: true });
          documentMouseDownListener = null;
        }
        open = false;
      };

      const buildPicker = () => {
        const el = document.createElement('div');
        el.className = 'effects-picker-popover';
        el.style.width = '280px';
        el.innerHTML = `
          <div class="effects-picker-head">
            <div>
              <strong>Sound Effects</strong>
              <span>Play a sound for everyone in this room.</span>
            </div>
          </div>
          <div class="effects-picker-grid">
            ${SOUND_EFFECTS.map((effect) => {
              const canAfford = Math.max(0, Number(state.user?.coins || 0)) >= Math.max(0, Number(effect.price));
              return `
                <div class="effects-picker-card">
                  <div class="effects-picker-line">
                    <div class="effects-picker-name">${esc(effect.name)}</div>
                    <div class="effects-picker-price">${esc(`${effect.price} COINS`)}</div>
                  </div>
                  <div class="effects-picker-desc">${esc(effect.description)}</div>
                  <button type="button" class="btn btn-primary btn-sm" data-sound-effect-id="${esc(effect.id)}" ${!canAfford ? 'disabled' : ''}>
                    ${esc(canAfford ? `Play ${effect.name}` : 'Need more coins')}
                  </button>
                </div>
              `;
            }).join('')}
          </div>
        `;

        el.addEventListener('mousedown', (e) => e.stopPropagation());
        return el;
      };

      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (state.lockdownActive) {
          showComposerNotice('Lockdown active — sound effects are disabled', 'error', 4200);
          return;
        }
        if (open) { closePicker(); return; }
        open = true;
        popoverEl = buildPicker();
        btn.parentElement.appendChild(popoverEl);

        popoverEl.querySelectorAll('[data-sound-effect-id]').forEach((actionBtn) => {
          actionBtn.addEventListener('click', async () => {
            const effectId = normalizeEffectId(actionBtn.getAttribute('data-sound-effect-id'));
            const roomId = String(state.currentChannel?.room || '').trim();
            if (!roomId) return;
            const roomMeta = getRoomMeta(roomId);
            const myRoomRole = String(roomMeta.roles?.[getCurrentUsername().toLowerCase()] || state.user?.role || 'member').toLowerCase();
            if (roomMeta.settings?.soundModsOnly && !['owner', 'admin', 'mod'].includes(myRoomRole)) {
              showComposerNotice('Only room mods can play sounds here', 'error', 3600);
              return;
            }
            const now = Date.now();
            if (Number(roomMeta.soundCooldownUntil || 0) > now) {
              showComposerNotice(`Sound cooldown active. Wait ${Math.ceil((roomMeta.soundCooldownUntil - now) / 1000)}s.`, 'error', 3600);
              return;
            }
            try {
              actionBtn.disabled = true;
              const cooldownSeconds = Math.max(0, Number(roomMeta.settings?.soundCooldownSeconds ?? 5));
              roomMeta.soundCooldownUntil = Date.now() + cooldownSeconds * 1000;
              saveRoomMetaStore();
              const data = await api(`/api/chat-effects/rooms/${encodeURIComponent(roomId)}/activate`, {
                method: 'POST',
                body: { effectId }
              });
              if (data?.user) applyUserSnapshot(data.user);
              setRoomEffectState(data?.roomEffect || null);
              if (data?.systemMessage) {
                upsertRealtimeMessage({ ...data.systemMessage, roomId });
              }
              renderMessages();
              showComposerNotice(data?.msg || 'Sound effect played', 'success', 3600);
              closePicker();
            } catch (err) {
              actionBtn.disabled = false;
              showComposerNotice(err.message || 'Failed to play sound effect', 'error', 4200);
            }
          });
        });

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

    setupSoundPicker();

    const setupEffectsPicker = () => {
      const btn = document.getElementById('effects-btn');
      if (!btn) return;
      let popoverEl = null;
      let open = false;
      let selectedTab = 'room';

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
        }
        renderMessages();
        showComposerNotice(data?.msg || 'Room effect activated', 'success', 3600);
        closePicker();
        await getMessages(state.currentChannel).catch(() => {});
      };

      const activateGlobalEffectLocal = async (effectId, message) => {
        const data = await api('/api/chat-effects/global/activate', {
          method: 'POST',
          body: { effectId, message }
        });
        if (data?.user) applyUserSnapshot(data.user);
        showComposerNotice(data?.msg || 'Global effect activated', 'success', 4200);
        closePicker();
      };

      const buildPicker = () => {
        const roomEffects = fallbackEffects.filter((effect) => effect.id !== 'none' && effect.scope !== 'global' && effect.scope !== 'message');
        const globalEffects = fallbackEffects.filter((effect) => effect.scope === 'global');
        const activeRoomEffectId = getActiveRoomEffectId();
        const activeMeta = getRoomEffectMeta();
        const activeTrigger = state.roomEffect?.triggeredByName
          ? `Triggered by ${state.roomEffect.triggeredByName}`
          : 'No room effect is active right now';

        const el = document.createElement('div');
        el.className = 'effects-picker-popover';
        el.innerHTML = `
          <div class="effects-picker-head">
            <div class="effects-picker-tabs">
              <button type="button" class="effects-picker-tab ${selectedTab === 'room' ? 'active' : ''}" data-tab="room">Room</button>
              <button type="button" class="effects-picker-tab ${selectedTab === 'global' ? 'active' : ''}" data-tab="global">Global</button>
            </div>
            <div class="coin-chip" id="effects-picker-balance">${esc(formatCoinLabel(state.user?.coins))}</div>
          </div>
          <div class="effects-picker-content"></div>
        `;

        const contentEl = el.querySelector('.effects-picker-content');

        const renderContent = () => {
          const roomHtml = `
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
                ${roomEffects.map((effect) => {
                  const effectId = normalizeEffectId(effect.id);
                  const active = effectId === activeRoomEffectId;
                  const canAfford = Math.max(0, Number(state.user?.coins || 0)) >= Math.max(0, Number(effect.price || 0));
                  return `
                    <div class="effects-picker-card ${active ? 'active' : ''}">
                      <div class="effects-picker-line">
                        <div class="effects-picker-name">${esc(effect.name)}</div>
                        <div class="effects-picker-price">${esc(`${Math.max(0, Number(effect.price || 0))} COINS`)}</div>
                      </div>
                      <div class="effect-preview effect-${esc(effectId)}">Preview message effect</div>
                      <div class="effects-picker-desc">${esc(effect.description)}</div>
                      <button type="button" class="btn btn-primary btn-sm" data-room-effect-id="${esc(effectId)}" ${active || !canAfford ? 'disabled' : ''}>
                        ${esc(active ? 'Active now' : canAfford ? `Activate for ${effect.price}c` : 'Need more coins')}
                      </button>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          `;

          const globalHtml = `
            <div style="margin-bottom: 15px;">
              <strong style="color: var(--text-1); font-size: 14px; margin-bottom: 8px; display: block;">Global Effects</strong>
              ${globalEffects.map((effect) => {
                const effectId = normalizeEffectId(effect.id);
                const canAfford = Math.max(0, Number(state.user?.coins || 0)) >= Math.max(0, Number(effect.price || 0));
                return `
                  <div class="effects-picker-card">
                    <div class="effects-picker-line">
                      <div class="effects-picker-name">${esc(effect.name)}</div>
                      <div class="effects-picker-price">${esc(`${Math.max(0, Number(effect.price || 0))} COINS`)}</div>
                    </div>
                    <div class="effect-preview effect-${esc(effectId)}">Preview broadcast effect</div>
                    <div class="effects-picker-desc">${esc(effect.description)}</div>
                    <button type="button" class="btn btn-primary btn-sm" data-global-effect-id="${esc(effectId)}" ${!canAfford ? 'disabled' : ''}>
                      ${esc(canAfford ? `Broadcast for ${effect.price}c` : 'Need more coins')}
                    </button>
                  </div>
                `;
              }).join('')}
            </div>
          `;

          contentEl.innerHTML = selectedTab === 'room' ? roomHtml : globalHtml;

          contentEl.querySelectorAll('[data-room-effect-id]').forEach((actionBtn) => {
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

          contentEl.querySelectorAll('[data-global-effect-id]').forEach((actionBtn) => {
            actionBtn.addEventListener('click', () => {
              const effectId = normalizeEffectId(actionBtn.getAttribute('data-global-effect-id'));
              showModalInput({
                title: `Send ${getEffectMeta(effectId).name}`,
                message: 'Enter the public message to broadcast for this effect.',
                placeholder: 'Type your message here...',
                submitText: 'Broadcast',
                onSubmit: async (message) => {
                  actionBtn.disabled = true;
                  try {
                    await activateGlobalEffectLocal(effectId, message);
                  } finally {
                    actionBtn.disabled = false;
                  }
                },
                onCancel: () => {},
              });
            });
          });
        };

        const tabButtons = el.querySelectorAll('.effects-picker-tab');
        tabButtons.forEach((tabButton) => {
          tabButton.addEventListener('click', () => {
            selectedTab = tabButton.getAttribute('data-tab');
            tabButtons.forEach((btnEl) => btnEl.classList.toggle('active', btnEl === tabButton));
            renderContent();
          });
        });

        renderContent();
        el.addEventListener('mousedown', (e) => e.stopPropagation());
        return el;
      };

      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (state.lockdownActive) {
          showComposerNotice('Lockdown active — effects are disabled', 'error', 4200);
          return;
        }
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
        await getMessages(state.currentChannel, false, { live: true });
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
    state.messageVisibilityHandler = () => {
      if (document.hidden || !state.currentChannel) return;
      void getMessages(state.currentChannel, false, { live: true }).catch((err) => {
        if (err.status === 403) {
          state.bannedMessage = err.message;
          renderMessages();
        }
      });
    };
    document.addEventListener('visibilitychange', state.messageVisibilityHandler);
    window.addEventListener('focus', state.messageVisibilityHandler);

    state.messagePollFailures = 0;
    scheduleMessagePoll = (requestedDelay = 45_000) => {
      if (state.pollTimer) clearTimeout(state.pollTimer);
      const healthySocket = !!activeSocket?.connected;
      const delay = document.hidden
        ? Math.max(60_000, Number(requestedDelay || 60_000))
        : (healthySocket ? Math.max(30_000, Number(requestedDelay || 45_000)) : Math.max(3_000, Number(requestedDelay || 4_000)));
      state.pollTimer = setTimeout(async () => {
        if (!state.currentChannel) return;
        const socketConnected = !!activeSocket?.connected;
        try {
          // A socket is the realtime path. REST only reconciles periodically,
          // while an unavailable socket gets bounded exponential fallback checks.
          await getMessages(state.currentChannel, !socketConnected, { live: !socketConnected });
          state.messagePollFailures = 0;
        } catch (err) {
          if (err.status === 403) {
            state.bannedMessage = err.message;
            renderMessages();
            return;
          }
          state.messagePollFailures = Math.min(5, Number(state.messagePollFailures || 0) + 1);
        }
        const nextDelay = activeSocket?.connected
          ? 45_000
          : Math.min(60_000, 4_000 * (2 ** Number(state.messagePollFailures || 0)));
        scheduleMessagePoll(nextDelay);
      }, delay);
    };
    scheduleMessagePoll(45_000);

    state.metaTimer = setInterval(async () => {
      await refreshPresence();
      await fetchAlerts();
      await refreshSlowmodeConfig();
    }, 20000);
  };

  // Update coin displays (header, settings, room effects balance)
  const updateCoinDisplays = () => {
    const label = formatCoinLabel(state.user?.coins);
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

  const updateFriendsUI = async () => {
    if (!document.getElementById('friend-search-results')) return;
    try {
      await refreshFriends('');
      const resultsContainer = document.getElementById('friend-search-results');
      if (resultsContainer) resultsContainer.innerHTML = renderFriendSearchResults();
      const requestsContainer = document.getElementById('friend-requests-section');
      if (requestsContainer) requestsContainer.outerHTML = renderFriendRequestsSection();
      const currentFriendsContainer = document.getElementById('current-friends-section');
      if (currentFriendsContainer) currentFriendsContainer.outerHTML = renderCurrentFriendsSection();
      attachFriendSearchActions();
    } catch (err) {
      console.warn('Auto-refresh friends failed:', err);
    }
  };

  setInterval(updateFriendsUI, 5000);

  // Final return with all public functions
  return {
    cleanupChatTimers,
    showToast,
    loadUser,
    loadChannels,
    getCurrentChannel,
    getPreferredLaunchChannelId,
    renderLogin,
    renderRegister,
    layoutShell,
    renderSidebar,
    renderMessages,
    sendMessage,
    refreshFriends,
    renderDirectMessagesPage,
    renderChatPage
  };
}
