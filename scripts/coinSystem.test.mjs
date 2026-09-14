import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

function child(code, args, env) {
  return new Promise((resolve, reject) => {
    const worker = spawn(process.execPath, ['-e', code, ...args], { env: { ...process.env, ...env }, windowsHide: true });
    let errors = '';
    worker.stderr.on('data', data => { errors += data; });
    worker.on('error', reject);
    worker.on('exit', status => status === 0 ? resolve() : reject(new Error(errors || `Worker exited ${status}`)));
  });
}

function load(relative, overrides = {}, env = {}) {
  const filename = fileURLToPath(new URL(relative, import.meta.url));
  const native = createRequire(filename);
  const module = { exports: {} };
  vm.runInNewContext(fs.readFileSync(filename, 'utf8'), {
    require: name => Object.hasOwn(overrides, name) ? overrides[name] : native(name),
    module, exports: module.exports, __dirname: path.dirname(filename),
    process: { env, pid: process.pid, kill: process.kill.bind(process) },
    Buffer, console, setTimeout, clearTimeout, setInterval: () => ({ unref() {} }),
  }, { filename });
  return module.exports;
}
function fixture(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'nebulo-coins-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const file = path.join(dir, 'users.json');
  fs.writeFileSync(file, JSON.stringify({ users: [
    { _id: 'alice', username: 'alice', coins: 100 },
    { _id: 'bob', username: 'bob', coins: 20 },
  ] }));
  const events = [];
  let fail = false;
  const disk = { ...fs, renameSync: (...args) => {
    if (fail) throw new Error('disk failure');
    return fs.renameSync(...args);
  } };
  const store = load('../chat-git-main/services/auth/localStore.js', {
    fs: disk, '../chat/walletEvents': { changed: id => events.push(id) },
  }, { CHAT_LOCAL_DATA_DIR: dir });
  return { dir, file, store, events, fail: value => { fail = value; } };
}

test('local shop cosmetics charge once, persist ownership, and roll back failed saves', t => {
  const f = fixture(t);
  const shop = load('../chat-git-main/services/chat/localCosmetics.js', {'../auth/localStore':f.store});
  const items = [
    {id:'test-banner',scope:'banner',price:10,owned:'ownedBanners',equipped:'equippedBanner'},
    {id:'test-profile',scope:'profile',price:10,owned:'ownedProfileEffects',equipped:'equippedProfileEffect'},
    {id:'custom-tag',scope:'tag',price:10,owned:'ownedTags',equipped:'equippedTag'},
  ];
  let balance=100;
  for(const item of items){
    const saved=shop.change('alice',item.scope,item,true);
    assert.equal(saved.coins,balance-=10);assert.equal(saved[item.equipped],item.id);
    assert.equal(shop.change('alice',item.scope,item,true).coins,balance);
    shop.change('alice',item.scope,{id:'none'},false);
    assert.equal(shop.change('alice',item.scope,item,false)[item.equipped],item.id);
  }
  const reload=load('../chat-git-main/services/auth/localStore.js',{}, {CHAT_LOCAL_DATA_DIR:f.dir});
  for(const item of items) assert.ok(reload.sanitizeUser(reload.findById('alice'))[item.owned].includes(item.id));
  const before=fs.readFileSync(f.file,'utf8');
  f.fail(true);
  assert.throws(()=>shop.change('alice','banner',{id:'another',scope:'banner',price:10},true),/disk failure/);
  assert.equal(fs.readFileSync(f.file,'utf8'),before);
  assert.equal(f.store.findById('alice').coins,70);
});

test('coin reset runs once, preserves cosmetics, and leaves a dismissible account notice', t => {
  const f = fixture(t);
  f.store.updateProfile('alice', { equippedEffect: 'none' });
  const first = f.store.resetAllCoinsOnce({ version: 'test-reset-v1', message: 'Balances were reset. Cosmetics were kept.' });
  assert.equal(first.applied, true);
  assert.equal(first.previousTotal, 120);
  assert.equal(f.store.findById('alice').coins, 0);
  assert.ok(f.store.findById('alice').ownedEffects.includes('none'));
  const notice = f.store.listSystemNotifications('alice')[0];
  assert.equal(notice.metadata.kind, 'coin_balance_reset');
  f.store.grantCoins('alice', 25);
  const replay = f.store.resetAllCoinsOnce({ version: 'test-reset-v1', message: 'Balances were reset. Cosmetics were kept.' });
  assert.equal(replay.applied, false);
  assert.equal(f.store.findById('alice').coins, 25);
  assert.equal(f.store.clearSystemNotification('alice', notice.id), true);
  assert.equal(f.store.listSystemNotifications('alice').length, 0);
});

test('failed save preserves disk, cache, and both sides of a transfer', t => {
  const f = fixture(t);
  const before = fs.readFileSync(f.file, 'utf8');
  f.fail(true);
  assert.throws(() => f.store.transferCoins('alice', 'bob', 35), /disk failure/);
  assert.equal(fs.readFileSync(f.file, 'utf8'), before);
  assert.equal(f.store.findById('alice').coins, 100);
  assert.equal(f.store.findById('bob').coins, 20);
  assert.equal(f.events.length, 0);
  f.fail(false);
  f.store.transferCoins('alice', 'bob', 35);
  assert.equal(f.store.findById('alice').coins, 65);
  assert.equal(f.store.findById('bob').coins, 55);
  assert.equal(f.events.length, 2);
});

test('rewards and transfers persist across fresh store instances without truncating large balances', t => {
  const f = fixture(t);
  f.store.updateProfile('bob', { coins: 1000000 });
  f.store.transferCoins('alice', 'bob', 50);
  f.store.grantCoins('bob', 2);
  const next = load('../chat-git-main/services/auth/localStore.js', {}, { CHAT_LOCAL_DATA_DIR: f.dir });
  assert.equal(next.findById('bob').coins, 1000052);
  assert.equal(next.findById('alice').coins, 50);
  assert.throws(() => next.transferCoins('alice', 'bob', 51), /Not enough/);
});

test('corrupt storage and writer contention cannot reset or overwrite balances', t => {
  const f = fixture(t);
  fs.writeFileSync(`${f.file}.lock`, String(process.pid));
  assert.throws(() => f.store.spendCoins('alice', 5), /busy/);
  fs.unlinkSync(`${f.file}.lock`);
  fs.writeFileSync(f.file, '{broken');
  assert.throws(() => f.store.grantCoins('alice', 5));
  assert.equal(fs.readFileSync(f.file, 'utf8'), '{broken');
});

test('recipient limit rejects the whole transfer rather than losing overflow', t => {
  const f = fixture(t);
  f.store.updateProfile('bob', { coins: 1000000000 });
  assert.throws(() => f.store.transferCoins('alice', 'bob', 1), /limit/);
  assert.equal(f.store.findById('alice').coins, 100);
  assert.equal(f.store.findById('bob').coins, 1000000000);
});

test('two server processes cannot overwrite each other’s earned coins', async t => {
  const f = fixture(t);
  const storePath = fileURLToPath(new URL('../chat-git-main/services/auth/localStore.js', import.meta.url));
  const code = `const store = require(process.argv[1]);
    (async () => { for(let n=0;n<40;) { try { store.grantCoins('alice',1); n++; }
      catch(e) { if(e.code!=='STORE_BUSY') throw e; }
      await new Promise(r=>setTimeout(r,1));
    } })().catch(e=>{console.error(e);process.exitCode=1;});`;
  await Promise.all([child(code, [storePath], { CHAT_LOCAL_DATA_DIR: f.dir }), child(code, [storePath], { CHAT_LOCAL_DATA_DIR: f.dir })]);
  assert.equal(f.store.findById('alice').coins, 180);
  assert.equal(JSON.parse(fs.readFileSync(f.file, 'utf8')).users[0].coins, 180);
});

test('a saved reward is recovered by a new process after its original server exits', async t => {
  const f = fixture(t);
  const queuePath = fileURLToPath(new URL('../chat-git-main/services/chat/rewardQueue.js', import.meta.url));
  const code = `require(process.argv[1]).enqueue({id:'alice'},2);`;
  await child(code, [queuePath], { CHAT_LOCAL_DATA_DIR: f.dir });
  const drain = `require(process.argv[1]).drain().catch(e=>{console.error(e);process.exitCode=1;});`;
  await child(drain, [queuePath], { CHAT_LOCAL_DATA_DIR: f.dir });
  assert.equal(f.store.findById('alice').coins, 102);
});

test('queued rewards survive credit failure and uncertain commit without duplicate coins', async t => {
  const f = fixture(t);
  const model = createRequire(import.meta.url)('../chat-git-main/services/chat/communityModel.js');
  let unavailable = true;
  let ambiguous = false;
  const adapter = {
    id: u => u.id || u._id,
    mutate: async (user, callback) => {
      if (unavailable) throw new Error('database offline');
      const value = f.store.communityTransaction(user.id, local => {
        const ctx = { state: model.normalize(local.community), coins: local.coins };
        const result = callback(ctx);
        local.community = ctx.state; local.coins = ctx.coins;
        return result;
      });
      if (ambiguous) { ambiguous = false; throw new Error('commit response lost'); }
      return value;
    },
  };
  const queue = load('../chat-git-main/services/chat/rewardQueue.js', { './communityStore': adapter }, { CHAT_LOCAL_DATA_DIR: f.dir });
  queue.enqueue({ id: 'alice' }, 1);
  queue.enqueue({ id: 'alice' }, 2);
  await queue.drain();
  assert.equal(f.store.findById('alice').coins, 100);
  assert.equal(fs.readdirSync(path.join(f.dir, 'coin-rewards')).length, 2);
  unavailable = false; ambiguous = true;
  await queue.drain();
  assert.equal(f.store.findById('alice').coins, 101);
  await queue.drain();
  assert.equal(f.store.findById('alice').coins, 103);
  assert.equal(fs.readdirSync(path.join(f.dir, 'coin-rewards')).length, 0);
});

test('database transfers commit both balances and notify only after commit', async () => {
  const calls = [], notifications = [];
  let rejectRecipient = false;
  const client = {
    release() {},
    async query(sql, params) {
      calls.push(sql);
      if (/select id, coins, username/.test(sql)) return { rows: [{ id: 'a', coins: 100 }, { id: 'b', coins: 20 }] };
      if (/set coins=coins-/.test(sql)) return { rows: [{ coins: 75 }] };
      if (/set coins=coins\+/.test(sql)) {
        if (rejectRecipient) throw new Error('recipient write failed');
        return { rows: [{ coins: 45 }] };
      }
      return { rows: [] };
    },
  };
  class Pool { on() {} async connect() { return client; } }
  const profiles = load('../chat-git-main/services/db/profileStore.js', {
    pg: { Pool }, '../chat/walletEvents': { changed: id => { assert.equal(calls.at(-1), 'commit'); notifications.push(id); } },
  }, { PROFILE_DATABASE_URL: 'test' });
  const result = await profiles.transferCoins('a', 'b', 25);
  assert.equal(result.fromUser.coins + result.toUser.coins, 120);
  assert.match(calls[1], /order by id for update/);
  assert.deepEqual(notifications, ['a', 'b']);
  rejectRecipient = true; notifications.length = 0;
  await assert.rejects(profiles.transferCoins('a', 'b', 25), /recipient write/);
  assert.equal(calls.at(-1), 'rollback');
  assert.equal(notifications.length, 0);
});

test('database account creation commits and returns the new account', async () => {
  const calls = [];
  const row = { id:'10000000-0000-4000-8000-000000000001', email:'new@example.test', username:'new_user', password_hash:'hash', user_metadata:{display_name:'New User'}, coins:0 };
  const client = { release() {}, async query(sql) { calls.push(sql); return { rows:[] }; } };
  class Pool {
    on() {}
    async connect() { return client; }
    async query(sql) { calls.push(sql); return { rows:[row] }; }
  }
  const profiles = load('../chat-git-main/services/db/profileStore.js', { pg:{Pool}, '../chat/walletEvents':{changed:()=>assert.fail('A new zero-balance account should not emit a wallet change.')} }, { PROFILE_DATABASE_URL:'test' });
  const account = await profiles.createAccount({ id:row.id, email:row.email, username:row.username, displayName:'New User', passwordHash:'hash' });
  assert.equal(account.id,row.id);assert.equal(account.displayName,'New User');assert.equal(calls.includes('commit'),true);
});

test('database wallet writes never fall back to the local identity mirror', async () => {
  const wallet = load('../chat-git-main/services/chat/wallet.js', {
    '../db/profileStore': { spendCoins: async () => { throw new Error('database unavailable'); } },
    '../auth/localStore': { spendCoins: () => assert.fail('shadow wallet used') },
  });
  await assert.rejects(wallet.spend({ id: 'a', source: 'database' }, 5), /database unavailable/);
});

test('temporary authentication storage failure is 503, not an expired session', async () => {
  const auth = load('../chat-git-main/middleware/auth.js', {
    '../services/auth/remoteAuth': { verifyToken: async () => { const e = new Error('temporarily unavailable'); e.status = 503; throw e; } },
  });
  let status;
  const res = { status(n) { status = n; return this; }, json() {} };
  await auth({ header: () => 'token' }, res, () => assert.fail('unauthenticated request allowed'));
  assert.equal(status, 503);
});

test('live database balance reads verify the session without cosmetic or mirror writes', async () => {
  const account = { id: 'db-user', source: 'database', authVersion: 2, coins: 205 };
  const remote = load('../chat-git-main/services/auth/remoteAuth.js', {
    jsonwebtoken: { verify: () => ({ user: { id: account.id, source: 'database', authVersion: 2 } }) },
    '../../config/config': { jwtSecret: 'fixture' },
    '../db/profileStore': { findAccountById: async () => account },
    './localStore': { upsertRemoteUser: () => assert.fail('Wallet read rewrote identity mirror') },
    '../db/effectStore': { getUserEffects: () => assert.fail('Wallet read queried cosmetics') },
  });
  assert.equal((await remote.verifyToken('fixture', { walletOnly: true })).coins, 205);
  account.authVersion = 3;
  assert.equal(await remote.verifyToken('fixture', { walletOnly: true }), null);
});

const syncSource = fs.readFileSync(new URL('../chat-git-main/public/modules/wallet-sync.js', import.meta.url), 'utf8');
const { createWalletSync } = await import(`data:text/javascript;base64,${Buffer.from(syncSource).toString('base64')}`);
test('live wallet publishes an authoritative action balance without another network read', () => {
  const displayed = [];
  const sync = createWalletSync({ read: async () => assert.fail('Commit should not read the wallet'), changed: n => displayed.push(n) });
  sync.reset('alice');
  assert.equal(sync.commit('alice', 140), true);
  assert.equal(sync.balance, 140);
  assert.deepEqual(displayed, [140]);
  assert.equal(sync.commit('alice', -1), false);
  assert.equal(sync.balance, 140);
});
test('live wallet ignores stale reads, preserves confirmed coins on failure, and resets on account changes', async () => {
  const requests = [], displayed = [];
  const sync = createWalletSync({ read: () => new Promise((resolve, reject) => requests.push({ resolve, reject })), changed: n => displayed.push(n) });
  sync.reset('alice');
  const first = sync.refresh();
  void sync.refresh(); // Mutation arrived while an older GET was in flight.
  requests.shift().resolve({ userId: 'alice', coins: 99 });
  await new Promise(resolve => setImmediate(resolve));
  assert.deepEqual(displayed, []);
  requests.shift().resolve({ userId: 'alice', coins: 103 });
  await first;
  assert.equal(sync.balance, 103);
  const failed = sync.refresh(); requests.shift().reject(new Error('offline')); await failed;
  assert.equal(sync.balance, 103);
  const old = sync.refresh();
  sync.reset('bob');
  requests.shift().resolve({ userId: 'alice', coins: 500 }); await old;
  assert.equal(sync.balance, null);
  assert.deepEqual(displayed, [103]);
});
