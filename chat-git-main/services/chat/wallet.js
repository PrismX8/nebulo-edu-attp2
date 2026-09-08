const profiles = require('../db/profileStore');
const local = require('../auth/localStore');
const effects = require('../db/effectStore');
const catalog = require('./effects');
const id = user => user.id || user._id;
async function transfer(user, username, amount) {
  if (user.source === 'database') {
    const target = await profiles.query('select id from public.profiles where lower(username)=lower($1) limit 1', [username]);
    if (!target.rows[0]) { const e = new Error('Recipient not found'); e.code = 'USER_NOT_FOUND'; throw e; }
    const result = await profiles.transferCoins(id(user), target.rows[0].id, amount);
    return { ...result, fromUser: { ...user, coins: result.fromUser.coins } };
  }
  const target = local.findByUsername(username);
  if (!target) { const e = new Error('Recipient not found'); e.code = 'USER_NOT_FOUND'; throw e; }
  if (target.source === 'database') { const e = new Error('Both accounts must use the same wallet storage'); e.code = 'INVALID_AMOUNT'; throw e; }
  return local.transferCoins(id(user), target._id, amount);
}
async function spend(user, amount) {
  const result = user.source === 'database' ? await profiles.spendCoins(id(user), amount) : local.spendCoins(id(user), amount);
  return { ...user, ...result };
}
async function purchase(user, effectId) {
  if (user.source !== 'database') return local.purchaseEffect(id(user), effectId);
  const effect = catalog.getEffect(effectId);
  if (!effect || effect.id === 'none' || effect.scope !== 'message') { const e = new Error('Effect not found'); e.code = 'EFFECT_NOT_FOUND'; throw e; }
  const state = await effects.purchaseAndEquip(id(user), effect);
  return { effect, user: { ...user, ...state } };
}
module.exports = { transfer, spend, purchase };
