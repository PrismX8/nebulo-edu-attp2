const axios = require('axios');
const { REMOTE_AUTH_BASE } = require('./remoteAuth');

function mapSearchUser(u = {}) {
  return {
    _id: u.id,
    id: u.id,
    username: u.username || '',
    name: u.username || '',
    avatar: u.avatar_url || null,
    role: u.is_admin ? 'admin' : 'user',
    is_premium: u.is_premium || false,
    is_booster: u.is_booster || false
  };
}

function mapRemoteFriend(u = {}) {
  const profile = u.user || u;
  return {
    _id: profile.id || profile.user_id || u.id || null,
    id: profile.id || profile.user_id || u.id || null,
    username: profile.username || profile.display_name || '',
    name: profile.username || profile.display_name || '',
    avatar: profile.avatar_url || profile.avatar || null,
    role: profile.is_admin ? 'admin' : 'user',
    is_premium: profile.is_premium || false,
    is_booster: profile.is_booster || false
  };
}

function mapFriendRequest(r = {}) {
  const from = r.user || r.from_user || r.requester || r.sender || {};
  return {
    request_id: r.id || r.request_id || null,
    _id: from.id || from.user_id || null,
    username: from.username || from.display_name || '',
    avatar: from.avatar_url || from.avatar || null,
    role: from.is_admin ? 'admin' : 'user'
  };
}

async function searchUsers(query, token) {
  if (!query || !token) return [];
  try {
    const res = await axios.get(`${REMOTE_AUTH_BASE}/api/chat/users/search`, {
      params: { q: query },
      headers: { Cookie: `access-token=${token}` },
      validateStatus: null
    });
    if (res.status >= 400 || !Array.isArray(res.data?.users)) return [];
    return res.data.users.map(mapSearchUser);
  } catch (_err) {
    return [];
  }
}

async function sendFriendRequest(targetUserId, token) {
  const res = await axios.post(
    `${REMOTE_AUTH_BASE}/api/friends/request`,
    { target_user_id: targetUserId },
    { headers: { Cookie: `access-token=${token}` }, validateStatus: null }
  );
  if (res.status >= 400) {
    const err = new Error(res.data?.error || res.data?.message || res.data?.msg || 'Failed to send friend request');
    err.status = res.status;
    err.data = res.data;
    throw err;
  }
  return res.data;
}

async function getFriendRequests(token) {
  if (!token) return [];
  try {
    const res = await axios.get(`${REMOTE_AUTH_BASE}/api/friends/requests`, {
      headers: { Cookie: `access-token=${token}` },
      validateStatus: null
    });
    if (res.status >= 400) return [];
    const raw = res.data?.requests || res.data?.data || res.data || [];
    return (Array.isArray(raw) ? raw : []).map(mapFriendRequest);
  } catch (_err) {
    return [];
  }
}

async function acceptFriendRequest(requestId, token) {
  const res = await axios.post(
    `${REMOTE_AUTH_BASE}/api/friends/accept`,
    { request_id: requestId },
    { headers: { Cookie: `access-token=${token}` }, validateStatus: null }
  );
  if (res.status >= 400) {
    const err = new Error(res.data?.error || res.data?.message || res.data?.msg || 'Failed to accept friend request');
    err.status = res.status;
    err.data = res.data;
    throw err;
  }
  return res.data;
}

async function getRemoteFriends(token) {
  if (!token) return [];
  try {
    const res = await axios.get(`${REMOTE_AUTH_BASE}/api/friends`, {
      headers: { Cookie: `access-token=${token}` },
      validateStatus: null
    });
    if (res.status >= 400) return [];
    const raw = res.data?.friends || res.data?.data || res.data || [];
    return (Array.isArray(raw) ? raw : []).map(mapRemoteFriend);
  } catch (_err) {
    return [];
  }
}

module.exports = { searchUsers, mapSearchUser, sendFriendRequest, getFriendRequests, acceptFriendRequest, getRemoteFriends };
