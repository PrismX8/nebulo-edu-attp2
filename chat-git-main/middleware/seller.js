module.exports = function(req, res, next) {
  const role = String(req.user?.role || '').toLowerCase();
  if (!['owner', 'admin', 'seller'].includes(role)) {
    return res.status(403).json({ msg: 'Access denied. Seller privileges required.' });
  }
  return next();
};
