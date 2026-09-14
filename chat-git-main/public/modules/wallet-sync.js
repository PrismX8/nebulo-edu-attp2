// Only serial authoritative reads can update a wallet. Older profile/action
// responses and events may request a refresh but cannot replace its balance.
export function createWalletSync({ read, changed, failed = () => {} }) {
  let account = '', generation = 0, revision = 0, balance = null, flight = null;
  function reset(id) {
    const next = String(id || '');
    if (next === account) return;
    account = next; generation++; revision++; balance = null; flight = null;
  }
  function commit(id, coins) {
    const next = String(id || '');
    const nextBalance = Number(coins);
    if (!next || !Number.isFinite(nextBalance) || nextBalance < 0) return false;
    if (next !== account) reset(next);
    revision++;
    balance = nextBalance;
    changed(balance);
    return true;
  }
  async function refresh() {
    revision++;
    if (!account) return;
    if (flight) return flight;
    const session = generation;
    const task = (async () => {
      do {
        const version = revision;
        try {
          const snapshot = await read();
          if (session !== generation) return;
          if (version !== revision) continue;
          if (String(snapshot.userId) !== account || typeof snapshot.coins !== 'number' || !Number.isFinite(snapshot.coins) || snapshot.coins < 0) throw new Error('Invalid wallet response');
          balance = snapshot.coins;
          changed(balance);
        } catch (error) {
          if (session !== generation) return;
          failed(error); // Keep the last confirmed balance on failures.
        }
        if (version === revision) break;
      } while (session === generation);
    })();
    flight = task;
    try { await task; } finally { if (flight === task) flight = null; }
  }
  return { reset, commit, refresh, get balance() { return balance; } };
}
