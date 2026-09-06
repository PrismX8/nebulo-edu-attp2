const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const userStore = require('../services/auth/localStore');
const identityStore = require('../services/network/identity');
const security = require('../middleware/security');
const { searchUsers, sendFriendRequest, getFriendRequests, acceptFriendRequest, getRemoteFriends } = require('../services/auth/remoteUsers');

// @route   POST api/users
// @desc    Register a user (managed by remote auth server)
// @access  Public
router.post('/', (_req, res) => {
  return res.status(501).json({ msg: 'Registration is managed by the remote auth server.' });
});

// Friends: stored locally keyed by remote user ID

const summarizeUser = (u) => {
  if (!u) return null;
  return {
    _id: u._id || u.id,
    username: u.username || '',
    avatar: u.avatar || u.avatar_url || null,
    role: u.role || 'user'
  };
};


// @route   POST api/users/friends
// @desc    Send a friend request — resolves username to remote user ID then proxies to remote
// @access  Private
router.post('/friends', auth, async (req, res) => {
  try {
    const username = String(req.body?.username || '').trim();
    const directUserId = String(req.body?.userId || '').trim();
    if (!username && !directUserId) return res.status(400).json({ msg: 'Username or userId is required' });

    let targetUserId = directUserId;
    if (!targetUserId) {
      const results = await searchUsers(username, req.authToken);
      const match = results.find(u => (u.username || '').toLowerCase() === username.toLowerCase());
      if (!match) return res.status(404).json({ msg: 'User not found' });
      if (match._id === req.user.id || match.id === req.user.id) return res.status(400).json({ msg: 'Cannot add yourself' });
      targetUserId = match._id || match.id;
    }

    try {
      const data = await sendFriendRequest(targetUserId, req.authToken);
      return res.json({ ok: true, data });
    } catch (err) {
      const status = err.status || 400;
      return res.status(status).json(err.data || { msg: err.message || 'Failed to send friend request' });
    }
  } catch (_err) {
    return res.status(500).send('Server Error');
  }
});

// @route   POST api/users/friends/accept
// @desc    Accept a friend request by request_id
// @access  Private
router.post('/friends/accept', auth, async (req, res) => {
  try {
    const requestId = String(req.body?.request_id || req.body?.requestId || '').trim();
    if (!requestId) return res.status(400).json({ msg: 'request_id is required' });
    try {
      const data = await acceptFriendRequest(requestId, req.authToken);
      return res.json({ ok: true, data });
    } catch (err) {
      const status = err.status || 400;
      return res.status(status).json(err.data || { msg: err.message || 'Failed to accept friend request' });
    }
  } catch (_err) {
    return res.status(500).send('Server Error');
  }
});

// @route   GET api/users/friends
// @desc    List friends and incoming requests (no query) or search users (with ?search=)
// @access  Private
router.get('/friends', auth, async (req, res) => {
  try {
    const query = String(req.query.search || '').trim();

    if (!query) {
      const [friends, requests] = await Promise.all([
        getRemoteFriends(req.authToken),
        getFriendRequests(req.authToken)
      ]);

      friends.forEach(f => { if (f._id && f.username) userStore.upsertRemoteUser(f); });

      const mutualFriends = friends.map(f => {
        const identity = identityStore.getByUsername(f.username);
        return {
          _id: f._id,
          username: f.username,
          avatar: f.avatar || identity?.avatar || null,
          role: f.role || 'user',
          mutual: true,
          relationship: 'friend',
          canMessage: true
        };
      });

      return res.json({
        mutualFriends,
        results: mutualFriends,
        requests: { incoming: requests, outgoing: [] }
      });
    }

    // Search mode — fetch friends in parallel to mark relationship status
    const [remoteResults, friends, requests] = await Promise.all([
      searchUsers(query, req.authToken),
      getRemoteFriends(req.authToken),
      getFriendRequests(req.authToken)
    ]);

    const friendIds = new Set(friends.map(f => String(f._id || '')).filter(Boolean));
    const incomingIds = new Set(requests.map(r => String(r._id || '')).filter(Boolean));

    const results = remoteResults.map(u => {
      const uid = String(u._id || u.id || '');
      const isFriend = friendIds.has(uid);
      const isIncoming = incomingIds.has(uid);
      return {
        _id: u._id,
        username: u.username,
        avatar: u.avatar || null,
        mutual: isFriend,
        incoming: isIncoming,
        pending: false,
        relationship: isFriend ? 'friend' : isIncoming ? 'incoming' : 'none',
        canMessage: isFriend
      };
    });

    return res.json({
      mutualFriends: results.filter(u => u.mutual),
      results,
      requests: { incoming: requests, outgoing: [] }
    });
  } catch (_err) {
    return res.status(500).send('Server Error');
  }
});

// @route   POST api/users/transfer-coins
// @desc    Send coins to another user by username
// @access  Private
router.post(
  '/transfer-coins',
  auth,
  security.chatWriteRateLimit,
  [
    check('username', 'Recipient username is required').not().isEmpty(),
    check('amount', 'Amount must be greater than 0').isFloat({ gt: 0 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
      const recipientUsername = String(req.body?.username || '').trim();
      const amount = Math.round(Number(req.body?.amount || 0) * 100) / 100;
      const recipient = userStore.findByUsername(recipientUsername);
      if (!recipient) return res.status(404).json({ msg: 'Recipient not found' });
      const result = userStore.transferCoins(req.user.id, recipient._id, amount);
      return res.json({
        ok: true,
        msg: `Sent ${result.amount} coin${result.amount === 1 ? '' : 's'} to ${recipient.username}`,
        amount: result.amount,
        user: req.user,
        recipient: summarizeUser(result.toUser)
      });
    } catch (err) {
      if (err?.code === 'SAME_USER') return res.status(400).json({ msg: err.message });
      if (err?.code === 'INVALID_AMOUNT') return res.status(400).json({ msg: err.message });
      if (err?.code === 'INSUFFICIENT_COINS') return res.status(402).json({ msg: err.message });
      if (err?.code === 'USER_NOT_FOUND') return res.status(404).json({ msg: err.message });
      return res.status(500).json({ msg: err.message || 'Failed to send coins' });
    }
  }
);

// @route   GET api/users
// @desc    Get all users (admin only — searches remote)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const role = String(req.user?.role || '').toLowerCase();
    if (!['owner', 'admin'].includes(role)) {
      return res.status(403).json({ msg: 'Not authorized' });
    }
    const results = await searchUsers('', req.authToken);
    return res.json(results);
  } catch (_err) {
    return res.status(500).send('Server Error');
  }
});

// @route   PUT api/users/profile
// @desc    Update profile (managed by remote auth server)
// @access  Private
router.put('/profile', auth, (_req, res) => {
  return res.status(501).json({ msg: 'Profile updates are managed by the remote auth server.' });
});

// @route   PUT api/users/password
// @desc    Change password (managed by remote auth server)
// @access  Private
router.put('/password', auth, (_req, res) => {
  return res.status(501).json({ msg: 'Password changes are managed by the remote auth server.' });
});

// @route   DELETE api/users/me
// @desc    Delete account (managed by remote auth server)
// @access  Private
router.delete('/me', auth, (_req, res) => {
  return res.status(501).json({ msg: 'Account deletion is managed by the remote auth server.' });
});

// @route   GET api/users/:id
// @desc    Get user by ID (returns own data; other user lookup requires admin)
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const targetId = String(req.params.id || '').trim();
    if (targetId === req.user.id || targetId === 'me') {
      return res.json(req.user);
    }
    const role = String(req.user?.role || '').toLowerCase();
    if (!['owner', 'admin'].includes(role)) {
      return res.status(403).json({ msg: 'Not authorized' });
    }
    const results = await searchUsers(targetId, req.authToken);
    const target = results.find((u) => u.id === targetId);
    if (!target) return res.status(404).json({ msg: 'User not found' });
    return res.json(target);
  } catch (_err) {
    return res.status(500).send('Server Error');
  }
});

module.exports = router;
