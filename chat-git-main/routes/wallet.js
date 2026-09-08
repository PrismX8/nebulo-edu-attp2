const router = require('express').Router();
const { verifyToken } = require('../services/auth/remoteAuth');
const store = require('../services/chat/communityStore');
router.get('/', async (req, res) => {
  res.set('Cache-Control', 'no-store');
  const token = String(req.get('x-auth-token') || '').trim();
  if (!token) return res.status(401).json({ msg: 'Sign in to view your wallet' });
  try {
    const user = await verifyToken(token, { walletOnly: true });
    if (!user) return res.status(401).json({ msg: 'Session expired. Sign in again.' });
    const wallet = user.source === 'database' ? user : await store.read(user);
    res.json({ userId: store.id(user), coins: wallet.coins });
  } catch (error) {
    res.status(503).json({ msg: 'Wallet temporarily unavailable. Your saved balance has not changed.' });
  }
});
module.exports = router;
