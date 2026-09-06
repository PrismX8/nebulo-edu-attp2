const express = require('express');
const path = require('path');
const security = require('./middleware/security');
const auth = require('./middleware/auth');
const { verifyToken } = require('./services/auth/remoteAuth');
const tlkRoutes = require('./routes/tlk');
const presence = require('./services/network/presence');
const groupChats = require('./services/groupChats');
const notificationStore = require('./services/db/notificationStore');

function compose(...handlers) {
  const router = express.Router();
  router.use(...handlers);
  return router;
}

function mountRoutes(mountExpressRouter, io) {
  const voiceRoutes = require('./routes/voice');
  if (typeof voiceRoutes.setSocketIO === 'function') voiceRoutes.setSocketIO(io);

  // Authentication and user/profile routes are implemented by the host app so
  // local Nebulo accounts continue to work without a remote auth dependency.
  mountExpressRouter('/api/messages', require('./routes/messages'));
  mountExpressRouter('/api/channels', require('./routes/channels'));
  mountExpressRouter('/api/tlk', compose(security.chatRoomRateLimit, tlkRoutes));
  mountExpressRouter('/api/network', require('./routes/network'));
  mountExpressRouter('/api/group-chats', require('./routes/group-chats'));
  mountExpressRouter('/api/voice', compose(security.voiceRateLimit, voiceRoutes));
  mountExpressRouter('/api/ai', require('./routes/ai'));
  mountExpressRouter('/api/upload', require('./routes/upload'));

  const uploadPath = path.resolve(process.env.UPLOAD_PATH || path.join(__dirname, 'uploads'));
  mountExpressRouter('/api/uploads', compose(auth, express.static(uploadPath)));

  for (const [prefix, modulePath] of [
    ['/api/shop', './routes/shop'],
    ['/api/marketplace', './routes/marketplace'],
    ['/api/openbullet', './routes/openbullet']
  ]) {
    try {
      mountExpressRouter(prefix, require(modulePath));
    } catch (error) {
      console.warn(`Optional chat route disabled (${prefix}): ${error.message}`);
    }
  }
}

function normalizeRoom(roomId = '') {
  const room = String(roomId || '').trim().toLowerCase();
  return /^(voice:)?[a-z0-9_-]{1,64}$/.test(room) ? room : '';
}

function username(socket) {
  return String(socket.data?.user?.username || socket.data?.user?.name || '').trim();
}

function installSocketHandlers(io) {
  io.use(async (socket, next) => {
    const token = String(
      socket.handshake.auth?.token ||
      socket.handshake.headers?.['x-auth-token'] ||
      socket.handshake.query?.token ||
      ''
    ).trim();
    if (!token) return next(new Error('Authentication required'));
    try {
      const user = await verifyToken(token);
      if (!user) return next(new Error('User not found'));
      socket.data.user = user;
      socket.data.clientId = String(socket.handshake.auth?.clientId || '').trim().slice(0, 120) || `socket:${socket.id}`;
      return next();
    } catch (_error) {
      return next(new Error('Invalid token'));
    }
  });

  const getVoiceParticipants = async (roomName) => {
    const sockets = await io.in(roomName).fetchSockets();
    return sockets
      .filter((peer) => peer.data?.voice?.roomName === roomName)
      .map((peer) => ({
        peerId: peer.id,
        userId: String(peer.data?.user?.id || peer.data?.user?._id || ''),
        username: peer.data.voice.participantName,
        avatar: peer.data?.user?.avatar || peer.data?.user?.avatar_url || null
      }));
  };

  const emitVoicePresence = async (roomName, target = io) => {
    const participants = await getVoiceParticipants(roomName);
    target.emit('voice_presence', { roomName, participants });
  };

  io.on('connection', (socket) => {
    const touchPresence = (roomId = '', updates = {}) => {
      const room = normalizeRoom(roomId) || socket.data.presenceRoom || '_online';
      socket.data.presenceRoom = room;
      if (updates && typeof updates === 'object') {
        socket.data.user = { ...(socket.data.user || {}), ...updates };
      }
      presence.touch(socket.data.clientId, room, socket.data.user || {});
    };
    touchPresence();
    void emitVoicePresence('voice:general', socket);
    socket.on('voice_presence_request', () => void emitVoicePresence('voice:general', socket));
    socket.on('identify_user', () => {
      if (!security.socketRateLimit(socket, 'identify_user', { windowMs: 10_000, max: 10 })) return;
      const name = username(socket).toLowerCase();
      if (name) socket.join(`user:${name}`);
    });

    socket.on('join_room', (roomId) => {
      if (!security.socketRateLimit(socket, 'join_room', { windowMs: 10_000, max: 30 })) return;
      const room = normalizeRoom(roomId);
      if (room) {
        socket.join(room);
        touchPresence(room);
      }
    });

    socket.on('leave_room', (roomId) => {
      const room = normalizeRoom(roomId);
      if (room) {
        socket.leave(room);
        if (socket.data.presenceRoom === room) touchPresence('_online');
      }
    });

    socket.on('presence_ping', (data = {}) => touchPresence(data.roomId, {
      avatar: data.avatar,
      equippedEffect: data.equippedEffect,
      equippedAvatarEffect: data.equippedAvatarEffect,
      equippedTag: data.equippedTag,
      equippedBanner: data.equippedBanner,
      equippedProfileEffect: data.equippedProfileEffect,
      status: data.status,
      customStatus: data.customStatus
    }));

    socket.on('send_message', async (data = {}, ack) => {
      const reply = typeof ack === 'function' ? ack : () => {};
      if (!security.socketRateLimit(socket, 'send_message', { windowMs: 10_000, max: 12 })) {
        return reply({ ok: false, status: 429, msg: 'Too many messages. Try again shortly.' });
      }
      const room = normalizeRoom(data.roomId || data.room);
      if (!room) return reply({ ok: false, status: 400, msg: 'Room is required.' });
      try {
        const result = await tlkRoutes.sendRoomMessage({
          room,
          body: String(data.body || data.content || '').trim(),
          clientId: String(data.clientId || '').trim(),
          deviceId: String(data.deviceId || '').trim(),
          clientNonce: String(data.clientNonce || '').trim(),
          equippedEffect: data.equippedEffect,
          equippedAvatarEffect: data.equippedAvatarEffect,
          reply: data.reply,
          attachments: data.attachments,
          authUser: socket.data.user
        });
        if (result.status >= 200 && result.status < 300) {
          socket.join(room);
          return reply({ ok: true, status: result.status, message: result.data });
        }
        return reply({
          ok: false,
          status: result.status,
          msg: result.data?.msg || result.data?.message || 'Failed to send message',
          data: result.data
        });
      } catch (error) {
        console.error('Socket send_message failed:', error);
        return reply({ ok: false, status: 500, msg: 'Failed to send message' });
      }
    });

    socket.on('typing', (data = {}) => {
      if (!security.socketRateLimit(socket, 'typing', { windowMs: 5_000, max: 12 })) return;
      const roomId = normalizeRoom(data.roomId);
      const name = username(socket);
      if (!roomId || !name) return;
      socket.to(roomId).emit('user_typing', {
        roomId,
        username: name,
        userId: String(socket.data?.user?.id || ''),
        clientId: String(data.clientId || '').slice(0, 80),
        isTyping: !!data.isTyping
      });
    });

    socket.on('voice_join', async (data = {}) => {
      if (!security.socketRateLimit(socket, 'voice_join', { windowMs: 10_000, max: 8 })) return;
      const roomName = normalizeRoom(data.roomName);
      const participantName = username(socket);
      if (!roomName || !participantName) return;
      socket.data.voice = { roomName, participantName };
      socket.join(roomName);
      const sockets = await io.in(roomName).fetchSockets();
      socket.emit('voice_peers', {
        roomName,
        peers: sockets
          .filter((peer) => peer.id !== socket.id && peer.data?.voice?.roomName === roomName)
          .map((peer) => ({ peerId: peer.id, participantName: peer.data.voice.participantName, avatar: peer.data?.user?.avatar || peer.data?.user?.avatar_url || null }))
      });
      socket.to(roomName).emit('voice_peer_joined', { roomName, peerId: socket.id, participantName, avatar: socket.data?.user?.avatar || socket.data?.user?.avatar_url || null });
      await emitVoicePresence(roomName);
    });

    for (const [incoming, outgoing, payload] of [
      ['voice_offer', 'voice_offer', (data, roomName, participantName) => ({ roomName, fromPeerId: socket.id, participantName, avatar: socket.data?.user?.avatar || socket.data?.user?.avatar_url || null, sdp: data.sdp })],
      ['voice_answer', 'voice_answer', (data, roomName, participantName) => ({ roomName, fromPeerId: socket.id, participantName, avatar: socket.data?.user?.avatar || socket.data?.user?.avatar_url || null, sdp: data.sdp })],
      ['voice_ice_candidate', 'voice_ice_candidate', (data, roomName) => ({ roomName, fromPeerId: socket.id, candidate: data.candidate })]
    ]) {
      socket.on(incoming, (data = {}) => {
        if (!security.socketRateLimit(socket, incoming, { windowMs: 10_000, max: incoming === 'voice_ice_candidate' ? 80 : 30 })) return;
        const targetPeerId = String(data.targetPeerId || '').trim();
        const roomName = normalizeRoom(data.roomName || socket.data?.voice?.roomName);
        if (!targetPeerId || !roomName || (incoming === 'voice_ice_candidate' && !data.candidate)) return;
        io.to(targetPeerId).emit(outgoing, payload(data, roomName, username(socket)));
      });
    }

    socket.on('voice_speaking', (data = {}) => {
      if (!security.socketRateLimit(socket, 'voice_speaking', { windowMs: 5_000, max: 25 })) return;
      const roomName = normalizeRoom(data.roomName || socket.data?.voice?.roomName);
      const participantName = username(socket);
      if (roomName && participantName) {
        socket.to(roomName).emit('voice_speaking', {
          roomName,
          peerId: socket.id,
          participantName,
          isSpeaking: !!data.isSpeaking
        });
      }
    });

    socket.on('voice_relay_audio', (data = {}) => {
      if (!security.socketRateLimit(socket, 'voice_relay_audio', { windowMs: 10_000, max: 20 })) return;
      const roomName = normalizeRoom(data.roomName || socket.data?.voice?.roomName);
      const participantName = username(socket);
      if (roomName && participantName && data.audio) {
        socket.to(roomName).emit('voice_relay_audio', {
          roomName,
          peerId: socket.id,
          participantName,
          mimeType: String(data.mimeType || 'audio/webm'),
          audio: data.audio
        });
      }
    });

    async function leaveVoice(data = {}) {
      const roomName = normalizeRoom(data.roomName || socket.data?.voice?.roomName);
      if (!roomName) return;
      socket.to(roomName).emit('voice_peer_left', {
        roomName,
        peerId: socket.id,
        participantName: socket.data?.voice?.participantName || username(socket)
      });
      socket.leave(roomName);
      socket.data.voice = null;
      await emitVoicePresence(roomName);
    }

    socket.on('voice_leave', (data) => void leaveVoice(data));
    socket.on('disconnect', () => {
      presence.remove(socket.data.clientId);
      void leaveVoice();
    });
  });

  const cleanExpiredGroups = async () => {
    const now = Date.now();
    const expired = groupChats.getExpiredSingleMemberGroups(now);
    for (const group of expired) {
      try {
        const message = `Your group "${group.name}" was automatically deleted because it had only one member for 2 days.`;
        await notificationStore.createForUsername(group.creator, {
          type: 'info',
          message,
          metadata: { reason: 'single-member-expired', room: group.room, groupName: group.name },
          dedupeKey: `group-single-member:${group.room}:${group.singleMemberSince}`
        });
        const deleted = groupChats.deleteExpiredSingleMemberGroup(group.room, group.singleMemberSince, Date.now());
        if (!deleted) continue;
        const payload = { room: deleted.room, groupName: deleted.name, reason: 'single-member-expired', message };
        io.to(deleted.room).emit('group_deleted', payload);
        io.to(`user:${String(deleted.creator || '').trim().toLowerCase()}`).emit('alert_created', payload);
      } catch (error) {
        console.error(`Could not expire group ${group.room}:`, error?.message || error);
      }
    }
  };
  void cleanExpiredGroups();
  const groupCleanupTimer = setInterval(() => void cleanExpiredGroups(), 5 * 60 * 1000);
  groupCleanupTimer.unref?.();
}

function integrateChat({ io, mountExpressRouter }) {
  mountRoutes(mountExpressRouter, io);
  installSocketHandlers(io);
}

module.exports = { integrateChat };
