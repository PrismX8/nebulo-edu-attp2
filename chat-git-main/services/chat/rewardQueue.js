const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const community = require('./communityStore');

const directory = path.join(process.env.CHAT_LOCAL_DATA_DIR || path.resolve(__dirname, '../../data'), 'coin-rewards');
const stream = `${process.pid}-${crypto.randomUUID()}`;
let sequence = 0;
let running = null;
let requested = false;

function alive(pid) {
  try { process.kill(pid, 0); return true; } catch (error) { return error.code !== 'ESRCH'; }
}
function save(file, data) {
  fs.mkdirSync(directory, { recursive: true });
  const temp = `${file}.${crypto.randomUUID()}.tmp`;
  let fd;
  try {
    fd = fs.openSync(temp, 'wx', 0o600);
    fs.writeFileSync(fd, JSON.stringify(data)); fs.fsyncSync(fd);
    fs.closeSync(fd); fd = undefined;
    fs.renameSync(temp, file);
  } catch (error) {
    if (fd !== undefined) fs.closeSync(fd);
    try { fs.unlinkSync(temp); } catch {}
    throw error;
  }
}

// Persist the entitlement before acknowledging a message. Sequence checkpoints
// are committed with the balance, making retries after uncertain commits safe.
function enqueue(user, amount) {
  const job = { stream, sequence: ++sequence, amount,
    user: { id: community.id(user), _id: community.id(user), username: user.username, source: user.source } };
  const file = path.join(directory, `${stream}.${String(job.sequence).padStart(16, '0')}.json`);
  save(file, job);
  return { file, job };
}
async function credit(job) {
  return community.mutate(job.user, ctx => {
    const last = Number(ctx.state.rewardSequences?.[job.stream] || 0);
    if (job.sequence <= last) return { balance: ctx.coins, coinsEarned: 0 };
    if (!Number.isSafeInteger(job.amount) || job.amount <= 0) throw new Error('Invalid queued reward');
    ctx.coins += job.amount;
    ctx.state.rewardSequences = { ...ctx.state.rewardSequences, [job.stream]: job.sequence };
    return { balance: ctx.coins, coinsEarned: job.amount };
  });
}
async function drain() {
  requested = true;
  if (running) return running;
  running = (async () => {
    do {
    requested = false;
    fs.mkdirSync(directory, { recursive: true });
    const files = fs.readdirSync(directory).filter(name => name.endsWith('.json')).sort();
    const blocked = new Set();
    for (const name of files) {
      const file = path.join(directory, name);
      let job;
      try {
        job = JSON.parse(fs.readFileSync(file, 'utf8'));
        if (blocked.has(`${job.stream}:${job.user.id}`)) continue;
        const owner = Number(job.stream.split('-')[0]);
        if (job.stream !== stream && alive(owner)) continue;
        const reward = await credit(job);
        fs.unlinkSync(file);
        if (reward.coinsEarned) {
          globalThis.__nebuloChatIo?.to(`wallet:${job.user.id}`).emit('chat_reward', reward);
        }
      } catch (error) {
        if (job) blocked.add(`${job.stream}:${job.user.id}`); // Never advance a checkpoint past a failed credit.
        console.warn('Coin reward remains queued:', error.message);
      }
    }
    } while (requested);
  })().finally(() => { running = null; });
  return running;
}
const timer = setInterval(() => void drain().catch(error => console.warn('Coin retry failed:', error.message)), 5000);
timer.unref();
module.exports = { enqueue, drain, credit };
