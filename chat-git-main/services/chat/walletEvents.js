// Events invalidate cached balances; clients fetch the authoritative wallet.
// Never send a possibly out-of-order balance as a new source of truth.
const cluster = require('node:cluster');
function emit(userId) {
  try { globalThis.__nebuloChatIo?.to(`wallet:${userId}`).emit('wallet_changed'); } catch {}
}
function changed(userId) {
  emit(userId);
  if (cluster.isPrimary) {
    for (const worker of Object.values(cluster.workers || {})) {
      if (worker.isConnected()) worker.send({ type: 'nebulo:wallet', userId: String(userId) }, () => {});
    }
  }
  if (cluster.isWorker && process.connected) {
    try { process.send({ type: 'nebulo:wallet', userId: String(userId) }, () => {}); } catch {}
  }
}
if (cluster.isPrimary) {
  cluster.on('message', (sender, message) => {
    if (message?.type !== 'nebulo:wallet') return;
    for (const worker of Object.values(cluster.workers || {})) {
      if (worker !== sender && worker.isConnected()) worker.send(message, () => {});
    }
  });
} else {
  process.on('message', message => { if (message?.type === 'nebulo:wallet') emit(message.userId); });
}
module.exports = { changed };
