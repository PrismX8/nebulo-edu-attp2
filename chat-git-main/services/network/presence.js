const ACTIVE_TTL_MS = Number(process.env.PRESENCE_TTL_MS || 30000);
const byClient = new Map();

function touch(clientId, room) {
  if (!clientId || !room) return;
  byClient.set(String(clientId), {
    room: String(room),
    seenAt: Date.now()
  });
}

function cleanup() {
  const now = Date.now();
  for (const [clientId, info] of byClient.entries()) {
    if (!info?.seenAt || now - info.seenAt > ACTIVE_TTL_MS) {
      byClient.delete(clientId);
    }
  }
}

function getCounts() {
  cleanup();
  const rooms = {};
  for (const info of byClient.values()) {
    if (!rooms[info.room]) rooms[info.room] = 0;
    rooms[info.room] += 1;
  }
  return {
    ttlMs: ACTIVE_TTL_MS,
    rooms
  };
}

module.exports = {
  touch,
  getCounts
};
