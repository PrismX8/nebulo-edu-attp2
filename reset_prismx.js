// Standalone script to reset PrismX password to 'Test1234'
const bcrypt = require('bcryptjs');
const path = require('path');
const userStore = require('./chatroom clone/services/auth/localStore');

async function resetPrismX() {
  const user = userStore.findByUsername('PrismX');
  if (!user) {
    console.error('PrismX user not found');
    process.exit(1);
  }
  const hash = await bcrypt.hash('Test1234', 10);
  userStore.updatePassword(user._id, hash);
  console.log('PrismX password reset to Test1234');
}

resetPrismX();
