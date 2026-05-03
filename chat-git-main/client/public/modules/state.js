// modules/state.js
// Central app state and helpers

export const state = {
  user: null,
  token: null,
  clientId: null,
  apiBase: '',
  apiBaseResolved: false,
  apiBasePromise: null,
  joinPromise: null,
  joinRoomKey: '',
  roomEffect: null,
  currentChannel: null,
  mentionTimeout: null,
  // ...add more as needed
};

export function setUser(user) {
  state.user = user;
  if (user?.token) state.token = user.token;
}

export function setRoomEffectState(effect) {
  state.roomEffect = effect;
}

export function setCurrentChannel(channel) {
  state.currentChannel = channel;
}
