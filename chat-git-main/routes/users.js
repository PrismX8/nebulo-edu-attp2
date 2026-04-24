const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const config = require('../config/config');
const userStore = require('../services/auth/localStore');
const identityStore = require('../services/network/identity');

// @route   POST api/users
// @desc    Register a user
// @access  Public
router.post(
  '/',
  [
    check('username', 'Username is required').not().isEmpty(),
    check('username', 'Username must be at least 3 characters').isLength({ min: 3 }),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { username, name, password } = req.body;
      const cleanUsername = String(username || "").trim();
      if (cleanUsername.toLowerCase() === 'moderation') {
        return res.status(400).json({ msg: 'Username "moderation" is reserved' });
      }
      const existing = userStore.findByUsername(cleanUsername);
      if (existing) {
        return res.status(400).json({ msg: 'Username already exists' });
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);
      const user = userStore.createUser({ username: cleanUsername, name, passwordHash });

      const payload = {
        user: {
          id: user._id
        }
      };

      jwt.sign(
        payload,
        config.jwtSecret || 'secret',
        { expiresIn: config.jwtExpiration || '24h' },
        (err, token) => {
          if (err) throw err;
          res.json({ token, user: userStore.sanitizeUser(user) });
        }
      );
    } catch (err) {
      if (err?.code === 'USERNAME_RESERVED') {
        return res.status(400).json({ msg: 'Username "moderation" is reserved' });
      }
      if (err?.code === 'USERNAME_EXISTS') {
        return res.status(400).json({ msg: 'Username already exists' });
      }
      return res.status(500).send('Server Error');
    }
  }
);

// @route   GET api/users
// @desc    Get all users
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const caller = userStore.findById(req.user.id);
    if (!caller) {
      return res.status(401).json({ msg: 'User not found' });
    }
    if (!['owner', 'admin'].includes(String(caller.role || '').toLowerCase())) {
      return res.status(403).json({ msg: 'Not authorized' });
    }
    return res.json(userStore.listUsers().map(userStore.sanitizeUser));
  } catch (_err) {
    return res.status(500).send('Server Error');
  }
});

// @route   PUT api/users/profile
// @desc    Update current user's profile fields
// @access  Private
router.put('/profile', auth, async (req, res) => {
  try {
    const caller = userStore.findById(req.user.id);
    if (!caller) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const name = typeof req.body?.name === 'string' ? req.body.name : undefined;
    const avatar = typeof req.body?.avatar === 'string' ? req.body.avatar : undefined;
    if (avatar && avatar.length > 2_000_000) {
      return res.status(400).json({ msg: 'Avatar too large' });
    }

    const updated = userStore.updateProfile(caller._id, { name, avatar });
    if (!updated) {
      return res.status(404).json({ msg: 'User not found' });
    }

    identityStore.updateByUserId(caller._id, {
      name: updated.name,
      avatar: updated.avatar || null
    });

    return res.json(userStore.sanitizeUser(updated));
  } catch (_err) {
    return res.status(500).send('Server Error');
  }
});

// @route   PUT api/users/password
// @desc    Change current user's password
// @access  Private
router.put(
  '/password',
  auth,
  [
    check('currentPassword', 'Current password is required').exists(),
    check('newPassword', 'New password must be at least 6 characters').isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { currentPassword, newPassword } = req.body;
      const user = userStore.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }

      const isMatch = await bcrypt.compare(String(currentPassword || ''), user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: 'Current password is incorrect' });
      }

      if (String(currentPassword) === String(newPassword)) {
        return res.status(400).json({ msg: 'New password must be different' });
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(newPassword, salt);
      userStore.updatePassword(user._id, passwordHash);

      return res.json({ msg: 'Password updated successfully' });
    } catch (_err) {
      return res.status(500).send('Server Error');
    }
  }
);

// @route   GET api/users/:id
// @desc    Get user by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const caller = userStore.findById(req.user.id);
    if (!caller) {
      return res.status(401).json({ msg: 'User not found' });
    }

    const target = userStore.findById(req.params.id);
    if (!target) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const callerRole = String(caller.role || '').toLowerCase();
    if (caller._id !== target._id && !['owner', 'admin'].includes(callerRole)) {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    return res.json(userStore.sanitizeUser(target));
  } catch (_err) {
    return res.status(500).send('Server Error');
  }
});

module.exports = router;
