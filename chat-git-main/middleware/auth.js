const { verifyToken } = require('../services/auth/remoteAuth');

module.exports = async function(req, res, next) {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const user = await verifyToken(token);
    if (!user) {
      return res.status(401).json({ msg: 'Token is not valid' });
    }
    req.user = user;
    req.authToken = token;
    return next();
  } catch (_err) {
    return res.status(401).json({ msg: 'Token is not valid' });
  }
};
