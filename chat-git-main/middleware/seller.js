const userStore = require('../services/auth/localStore');

module.exports = function(req, res, next) {
  try {
    const user = userStore.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const role = String(user.role || '').toLowerCase();
    if (!['owner', 'admin', 'seller'].includes(role)) {
      return res.status(403).json({ msg: 'Access denied. Seller privileges required.' });
    }

    next();
  } catch (_err) {
    return res.status(500).send('Server Error');
  }
};

