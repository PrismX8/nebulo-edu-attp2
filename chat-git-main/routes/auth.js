const express = require('express');
const router = express.Router();
const axios = require('axios');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const config = require('../config/config');
const { REMOTE_AUTH_BASE, mapLocalUser, mapRemoteUser, parseTokenFromSetCookie } = require('../services/auth/remoteAuth');
const userStore = require('../services/auth/localStore');

const ROLE_RANK = { owner: 4, admin: 3, mod: 2, seller: 1, user: 0 };
function highestRole(a, b) {
  return (ROLE_RANK[a] ?? 0) >= (ROLE_RANK[b] ?? 0) ? a : b;
}

function mergeWithLocal(remoteUser) {
  const id = String(remoteUser._id || remoteUser.id || '').trim();
  const username = String(remoteUser.username || remoteUser.name || '').trim();
  const local = (id && userStore.findById(id)) || (username && userStore.findByUsername(username));
  if (!local) return remoteUser;
  const safe = userStore.sanitizeUser(local);
  return {
    ...remoteUser,
    coins: safe.coins,
    ownedEffects: safe.ownedEffects,
    equippedEffect: safe.equippedEffect,
    friends: safe.friends,
    role: highestRole(safe.role, remoteUser.role),
    avatar: safe.avatar || remoteUser.avatar,
  };
}

// @route   POST api/auth
// @desc    Authenticate user & get token (proxied to remote auth server)
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const loginEmail = email || username;
    if (!loginEmail || !password) {
      return res.status(400).json({ msg: 'Email and password are required' });
    }

    const localUser = userStore.findByIdentifier(loginEmail);
    if (localUser && await userStore.verifyPassword(localUser, password)) {
      const user = mapLocalUser(localUser);
      const token = jwt.sign({ user: { id: user.id } }, config.jwtSecret, { expiresIn: '30d' });
      return res.json({ token, user });
    }

    const loginRes = await axios.post(`${REMOTE_AUTH_BASE}/auth/login`, { email: loginEmail, password }, {
      validateStatus: null,
      maxRedirects: 0,
      headers: {
        'Content-Type': 'application/json',
        'Origin': REMOTE_AUTH_BASE,
        'Referer': `${REMOTE_AUTH_BASE}/`
      }
    });

    console.error('[auth proxy] login status:', loginRes.status, 'data:', JSON.stringify(loginRes.data));

    if (loginRes.status >= 400) {
      return res.status(loginRes.status).json(loginRes.data || { msg: 'Invalid credentials' });
    }

    const token = parseTokenFromSetCookie(loginRes.headers['set-cookie']);
    if (!token) {
      return res.status(500).json({ msg: 'Authentication failed: no token received' });
    }

    const meRes = await axios.get(`${REMOTE_AUTH_BASE}/auth/me`, {
      headers: { Cookie: `access-token=${token}` },
      validateStatus: null
    });

    if (meRes.status >= 400 || !meRes.data?.user) {
      return res.status(500).json({ msg: 'Failed to retrieve user profile' });
    }

    const remoteUser = mapRemoteUser(meRes.data.user);
    userStore.upsertRemoteUser(remoteUser);
    const user = mergeWithLocal(remoteUser);
    return res.json({ token, user });
  } catch (_err) {
    return res.status(500).send('Server Error');
  }
});

// @route   GET api/auth
// @desc    Get logged in user with local metadata merged
// @access  Private
router.get('/', auth, (req, res) => {
  if (!req.user?.email) {
    return res.json({ user: req.user });
  }
  userStore.upsertRemoteUser(req.user);
  const user = mergeWithLocal(req.user);
  return res.json({ user });
});

module.exports = router;
