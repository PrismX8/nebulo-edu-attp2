import assert from 'node:assert/strict';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { createGameProgressStore, normalizeGamePath } from '../services/gameProgressStore.js';

async function fixture(t) {
  const root = await mkdtemp(path.join(os.tmpdir(), 'nebulo-game-progress-'));
  t.after(async () => rm(root, { recursive: true, force: true }));
  return { root, store: createGameProgressStore(root) };
}

test('normalizes entry pages to one stable game key', () => {
  assert.equal(normalizeGamePath('/games/platinum/cdn/example/index.html?v=3'), '/games/platinum/cdn/example/');
  assert.equal(normalizeGamePath('/games/gn-math/html/42.html'), '/games/gn-math/html/42.html');
  assert.throws(() => normalizeGamePath('/games/%2e%2e/private'), /Invalid game path/);
  assert.throws(() => normalizeGamePath('https://outside.example/game.html'), /Invalid game path/);
});

test('concurrent save and recent updates cannot overwrite each other', async (t) => {
  const { store } = await fixture(t);
  const user = 'account-1';
  await Promise.all([
    store.updateSave(user, '/games/one/index.html', { score: 125 }),
    store.recordRecent(user, { gamePath: '/games/one/', gameName: 'One', gameImage: '/cover/one.webp' }),
    store.updateSave(user, '/games/one/', { level: 7 }),
  ]);
  const progress = await store.read(user);
  assert.equal(progress.saves['/games/one/'].score, 125);
  assert.equal(progress.saves['/games/one/'].level, 7);
  assert.equal(progress.recentlyPlayed[0].gameName, 'One');
});

test('recent games are de-duplicated and newest first', async (t) => {
  const { store } = await fixture(t);
  await store.recordRecent('account-2', { gamePath: '/games/a/', gameName: 'A' });
  await store.recordRecent('account-2', { gamePath: '/games/b/', gameName: 'B' });
  await store.recordRecent('account-2', { gamePath: '/games/a/index.html', gameName: 'A again' });
  const progress = await store.read('account-2');
  assert.deepEqual(progress.recentlyPlayed.map((item) => item.gameName), ['A again', 'B']);
});

test('reads existing unhashed account progress without discarding it', async (t) => {
  const { root, store } = await fixture(t);
  await writeFile(path.join(root, 'legacy-user.json'), JSON.stringify({
    saves: { '/games/legacy/': { score: 9001 } },
    recentlyPlayed: [{ gamePath: '/games/legacy/', gameName: 'Legacy', playedAt: 10 }],
  }));
  const progress = await store.read('legacy-user');
  assert.equal(progress.saves['/games/legacy/'].score, 9001);
  assert.equal(progress.recentlyPlayed[0].gameName, 'Legacy');
});

test('rejects oversized save payloads before touching stored progress', async (t) => {
  const { store } = await fixture(t);
  await assert.rejects(() => store.updateSave('account-3', '/games/large/', { value: 'x'.repeat(900_000) }), (error) => error.statusCode === 413);
  assert.deepEqual((await store.read('account-3')).saves, {});
});
