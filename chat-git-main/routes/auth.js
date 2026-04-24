const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const config = require('../config/config');
const userStore = require('../services/auth/localStore');

// @route   POST api/auth
// @desc    Authenticate user & get token
// @access  Public
router.post(
  '/',
  [
    check('username', 'Username is required').not().isEmpty(),
    check('password', 'Password is required').exists()
  ],
  async (req, res) => {
    console.log('Auth POST req.body:', req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { username, password } = req.body;
      console.log('Login attempt:', { username, password: JSON.stringify(password), passwordLength: password?.length });
      const user = userStore.findByIdentifier(username);
      console.log('User found:', !!user);
      if (!user) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }

      const isMatch = password === user.password;
      console.log('Password match:', isMatch, 'stored:', JSON.stringify(user.password), 'input:', JSON.stringify(password));
      if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }

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
    } catch (_err) {
      return res.status(500).send('Server Error');
    }
  }
);

// @route   GET api/auth
// @desc    Get logged in user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const user = userStore.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    return res.json(userStore.sanitizeUser(user));
  } catch (_err) {
    return res.status(500).send('Server Error');
  }
});

module.exports = router;
