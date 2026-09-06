module.exports = function(req, res, next) {
  const role = String(req.user?.role || '').toLowerCase();
  if (!['owner', 'admin'].includes(role)) {
    return res.status(403).json({ msg: 'Access denied. Admin privileges required.' });
  }
  return next();
};
