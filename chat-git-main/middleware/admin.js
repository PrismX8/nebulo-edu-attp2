const userStore = require('../services/auth/localStore');

module.exports = async function(req, res, next) {
  try {
    // Check if user is owner/admin in local JSON auth store
    const user = userStore.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    const role = String(user.role || '').toLowerCase();
    if (!['owner', 'admin'].includes(role)) {
      return res.status(403).json({ msg: 'Access denied. Admin privileges required.' });
    }
    
    next();
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
