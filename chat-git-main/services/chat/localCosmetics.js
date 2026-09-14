const users = require('../auth/localStore');

// The route supplies a trusted catalog entry; ownership and wallet commit together.
function change(userId, scope, item, buying) {
  const fields = { banner: ['ownedBanners', 'equippedBanner'], profile: ['ownedProfileEffects', 'equippedProfileEffect'], tag: ['ownedTags', 'equippedTag'] }[scope];
  if (!fields || !item || (item.id !== 'none' && item.scope !== scope)) throw new Error('Cosmetic not found');
  const [ownedKey, equippedKey] = fields;
  return users.communityTransaction(userId, user => {
    const owned = new Set(['none', ...(user[ownedKey] || [])]);
    if (!owned.has(item.id)) {
      if (!buying) { const error = new Error('Cosmetic not owned'); error.status = 403; throw error; }
      if (!Number.isSafeInteger(item.price) || item.price < 0) throw new Error('Invalid catalog price');
      if (user.coins < item.price) { const error = new Error('Not enough coins'); error.code = 'INSUFFICIENT_COINS'; throw error; }
      user.coins -= item.price;
      owned.add(item.id);
    }
    user[ownedKey] = [...owned];
    user[equippedKey] = item.id;
    return users.sanitizeUser(user);
  });
}
module.exports = { change };
