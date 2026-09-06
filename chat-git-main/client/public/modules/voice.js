/**
 * Voice Chat Module
 * Handles voice call backend and voice session management for chat rooms.
 */

export function createVoiceModule(deps) {
  const { api, getTlkClientId, getChatDeviceId } = deps;

  const getHeaders = () => ({
    'Content-Type': 'application/json',
    'x-tlk-client-id': getTlkClientId(),
    'x-chat-device-id': getChatDeviceId()
  });

  const startVoiceCall = async (roomName, roomType, channelName, participantName) => {
    return api('/api/voice/start-call', {
      method: 'POST',
      headers: getHeaders(),
      body: { roomName, roomType, channelName, participantName }
    });
  };

  const endVoiceCall = async (roomName, roomType) => {
    return api('/api/voice/end-call', {
      method: 'POST',
      headers: getHeaders(),
      body: { roomName, roomType }
    });
  };

  const joinVoiceCall = async (roomName, participantName) => {
    return api('/api/voice/join-call', {
      method: 'POST',
      headers: getHeaders(),
      body: { roomName, participantName }
    });
  };

  const leaveVoiceCall = async (roomName, participantName) => {
    return api('/api/voice/leave-call', {
      method: 'POST',
      headers: getHeaders(),
      body: { roomName, participantName }
    });
  };

  const getActiveCall = async (roomName) => {
    return api(`/api/voice/calls/${encodeURIComponent(roomName)}`, {
      headers: getHeaders()
    });
  };

  const getActiveCalls = async () => {
    return api('/api/voice/calls', {
      headers: getHeaders()
    });
  };

  return {
    startVoiceCall,
    endVoiceCall,
    joinVoiceCall,
    leaveVoiceCall,
    getActiveCall,
    getActiveCalls
  };
}
