const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();

// Store active voice calls in memory (in production, use Redis or database)
const activeCalls = new Map();

// Socket.io instance (will be set by server.js)
let io = null;

const setSocketIO = (socketIO) => {
  io = socketIO;
};

const normalizeRoomName = (roomName = '') => {
  const room = String(roomName || '').trim().toLowerCase();
  return /^(voice:)?[a-z0-9_-]{1,64}$/.test(room) ? room : '';
};

const normalizeRoomType = (roomType = '') => String(roomType || '').trim().toLowerCase();

const isAllowedVoiceRoom = (roomName = '', roomType = '') => {
  const safeRoomName = normalizeRoomName(roomName);
  const safeRoomType = normalizeRoomType(roomType);
  if (!safeRoomName) return false;
  if (safeRoomName === 'voice:general') return safeRoomType === 'public';
  return safeRoomName.startsWith('voice:') && ['group', 'dm'].includes(safeRoomType);
};

const getParticipantName = (req) => String(req.user?.username || req.user?.name || 'User').trim() || 'User';

/**
 * Start a voice call in a room/channel
 * POST /api/voice/start-call
 */
router.post('/start-call', auth, (req, res) => {
  try {
    const {
      roomName,
      roomType,
      channelName,
      isGroupChat,
      isDM,
      participantName
    } = req.body;

    const safeRoomName = normalizeRoomName(roomName);
    if (!safeRoomName) {
      return res.status(400).json({ error: 'roomName is required' });
    }
    if (!isAllowedVoiceRoom(safeRoomName, roomType)) {
      return res.status(403).json({ error: 'Voice is only available in public General, group chats, and DMs.' });
    }

    const safeParticipantName = getParticipantName(req);
    const existingCall = Array.from(activeCalls.values()).find(
      (call) => call.roomName === safeRoomName && call.status === 'active'
    );
    if (existingCall) {
      if (!existingCall.participants.includes(safeParticipantName)) {
        existingCall.participants.push(safeParticipantName);
      }
      if (io) {
        io.to(safeRoomName).emit('voice_participant_joined', {
          roomName: safeRoomName,
          participantName: safeParticipantName,
          call: existingCall
        });
      }
      return res.json({
        success: true,
        callId: existingCall.id,
        callInfo: existingCall,
        message: `Joined existing voice call in ${channelName || roomName}`
      });
    }

    // Generate a unique call ID
    const callId = `call_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Store call information
    const callInfo = {
      id: callId,
      roomName: safeRoomName,
      roomType,
      channelName,
      isGroupChat,
      isDM,
      participants: [safeParticipantName],
      startTime: new Date().toISOString(),
      status: 'active',
      audio: true,
      video: false
    };

    activeCalls.set(callId, callInfo);

    res.json({
      success: true,
      callId,
      callInfo,
      message: `Voice call started in ${channelName || roomName}`
    });
  } catch (error) {
    console.error('Error starting voice call:', error);
    res.status(500).json({ error: 'Failed to start voice call', details: error.message });
  }
});

/**
 * End a voice call
 * POST /api/voice/end-call
 */
router.post('/end-call', auth, (req, res) => {
  try {
    const { roomName, roomType } = req.body;

    const safeRoomName = normalizeRoomName(roomName);
    if (!safeRoomName) {
      return res.status(400).json({ error: 'roomName is required' });
    }

    const safeParticipantName = getParticipantName(req);
    let updatedCall = null;
    let removedCall = null;
    for (const [callId, call] of activeCalls.entries()) {
      if (call.roomName === safeRoomName) {
        call.participants = call.participants.filter((p) => p !== safeParticipantName);
        updatedCall = call;
        if (call.participants.length === 0) {
          removedCall = call;
          activeCalls.delete(callId);
        }
        break;
      }
    }

    res.json({
      success: true,
      message: removedCall ? 'Voice call ended' : 'Left voice call',
      removedCall,
      call: updatedCall
    });
  } catch (error) {
    console.error('Error ending voice call:', error);
    res.status(500).json({ error: 'Failed to end voice call', details: error.message });
  }
});

/**
 * Get the live socket participants in a voice room.
 * GET /api/voice/participants/:roomName
 */
router.get('/participants/:roomName', auth, async (req, res) => {
  try {
    const safeRoomName = normalizeRoomName(req.params.roomName);
    if (!safeRoomName) return res.status(400).json({ error: 'roomName is required' });
    if (!io) return res.json({ roomName: safeRoomName, participants: [] });
    const sockets = await io.in(safeRoomName).fetchSockets();
    const participants = sockets
      .filter((socket) => socket.data?.voice?.roomName === safeRoomName)
      .map((socket) => ({
        peerId: socket.id,
        userId: String(socket.data?.user?.id || socket.data?.user?._id || ''),
        username: String(socket.data.voice.participantName || socket.data?.user?.username || 'User'),
        avatar: socket.data?.user?.avatar || socket.data?.user?.avatar_url || null
      }));
    return res.json({ roomName: safeRoomName, participants });
  } catch (error) {
    console.error('Error fetching voice participants:', error);
    // Voice presence is a best-effort sidebar decoration. Socket adapter
    // reconnects should not surface as a page-wide 5xx or trigger client retry
    // storms; use the active-call roster until the adapter is healthy again.
    const fallbackCall = Array.from(activeCalls.values()).find(
      (call) => call.roomName === normalizeRoomName(req.params.roomName) && call.status === 'active'
    );
    const participants = (fallbackCall?.participants || []).map((username) => ({
      peerId: '', userId: '', username: String(username || 'User'), avatar: null
    }));
    return res.json({ roomName: normalizeRoomName(req.params.roomName), participants, stale: true });
  }
});

/**
 * Get active calls for a room
 * GET /api/voice/calls/:roomName
 */
router.get('/calls/:roomName', auth, (req, res) => {
  try {
    const { roomName } = req.params;

    const safeRoomName = normalizeRoomName(roomName);
    if (!safeRoomName) {
      return res.status(400).json({ error: 'roomName is required' });
    }

    const roomCalls = [];
    for (const call of activeCalls.values()) {
      if (call.roomName === safeRoomName) {
        roomCalls.push(call);
      }
    }

    res.json({
      success: true,
      roomName: safeRoomName,
      calls: roomCalls,
      isCallActive: roomCalls.length > 0
    });
  } catch (error) {
    console.error('Error fetching calls:', error);
    res.status(500).json({ error: 'Failed to fetch calls', details: error.message });
  }
});

/**
 * Get all active calls
 * GET /api/voice/calls
 */
router.get('/calls', auth, (req, res) => {
  try {
    const role = String(req.user?.role || '').toLowerCase();
    if (!['owner', 'admin'].includes(role)) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    const calls = Array.from(activeCalls.values());

    res.json({
      success: true,
      totalCalls: calls.length,
      calls
    });
  } catch (error) {
    console.error('Error fetching all calls:', error);
    res.status(500).json({ error: 'Failed to fetch calls', details: error.message });
  }
});

/**
 * Add participant to an active call
 * POST /api/voice/join-call
 */
router.post('/join-call', auth, (req, res) => {
  try {
    const { callId, participantName, roomName } = req.body;

    const safeRoomName = normalizeRoomName(roomName);
    if (!safeRoomName) {
      return res.status(400).json({ error: 'roomName is required' });
    }

    const safeParticipantName = getParticipantName(req);
    let joinedCall = null;
    for (const call of activeCalls.values()) {
      if (call.roomName === safeRoomName && call.status === 'active') {
        if (!call.participants.includes(safeParticipantName)) {
          call.participants.push(safeParticipantName);
        }
        joinedCall = call;
        break;
      }
    }

    if (!joinedCall) {
      return res.status(404).json({ error: 'No active call found in this room' });
    }

    res.json({
      success: true,
      message: `${safeParticipantName} joined the call`,
      call: joinedCall
    });

    // Emit socket event to notify other participants
    if (io) {
      io.to(safeRoomName).emit('voice_participant_joined', {
        roomName: safeRoomName,
        participantName: safeParticipantName,
        call: joinedCall
      });
    }
  } catch (error) {
    console.error('Error joining call:', error);
    res.status(500).json({ error: 'Failed to join call', details: error.message });
  }
});

/**
 * Remove participant from call
 * POST /api/voice/leave-call
 */
router.post('/leave-call', auth, (req, res) => {
  try {
    const { participantName, roomName } = req.body;

    const safeRoomName = normalizeRoomName(roomName);
    if (!safeRoomName) {
      return res.status(400).json({ error: 'roomName is required' });
    }

    const safeParticipantName = getParticipantName(req);
    let updatedCall = null;
    for (const call of activeCalls.values()) {
      if (call.roomName === safeRoomName) {
        call.participants = call.participants.filter(p => p !== safeParticipantName);
        updatedCall = call;

        // If no participants left, end the call
        if (call.participants.length === 0) {
          activeCalls.delete(Array.from(activeCalls.entries()).find(([, c]) => c === call)?.[0]);
        }
        break;
      }
    }

    res.json({
      success: true,
      message: `${safeParticipantName} left the call`,
      call: updatedCall
    });

    // Emit socket event to notify other participants
    if (io) {
      io.to(safeRoomName).emit('voice_participant_left', {
        roomName: safeRoomName,
        participantName: safeParticipantName,
        call: updatedCall
      });
    }
  } catch (error) {
    console.error('Error leaving call:', error);
    res.status(500).json({ error: 'Failed to leave call', details: error.message });
  }
});

module.exports = router;
module.exports.setSocketIO = setSocketIO;
