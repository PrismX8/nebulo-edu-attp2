// modules/effects.js
// Handles chat/effect logic and effect picker
import { api } from './api.js';
import { state, setRoomEffectState } from './state.js';
import { showComposerNotice } from './ui.js';

export async function activateRoomEffect(effectId) {
  if (!state.currentChannel?.room) return;
  const data = await api(`/api/chat-effects/rooms/${encodeURIComponent(state.currentChannel.room)}/activate`, {
    method: 'POST',
    body: { effectId }
  });
  if (data?.user) {
    // Optionally update user state
  }
  setRoomEffectState(data?.roomEffect || null);
  showComposerNotice(data?.msg || 'Room effect activated', 'success', 3600);
  // Optionally: re-render messages, fetch messages, etc.
}

export async function activateGlobalEffect(effectId) {
  const data = await api('/api/chat-effects/global/activate', {
    method: 'POST',
    body: { effectId }
  });
  showComposerNotice(data?.msg || 'Global effect activated', 'success', 3600);
}

// Add more effect-related helpers as needed
