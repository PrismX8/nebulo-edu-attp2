# Coin persistence and live updates

Database accounts use `public.profiles.coins` for rewards, transfers, and
purchases. Their local identity mirrors must never be used as wallets.
Transfers lock both profiles in ID order and commit both balances together.
Cosmetic purchases lock the profile before checking ownership and commit
ownership with the debit. Missing cosmetic database tables now fail before
charging instead of splitting a purchase between Postgres and local files.

Local accounts use `users.json`. Writers acquire an exclusive file lock, read
the latest committed state, write and flush a temporary file, then rename it
over the previous store. Failed writes do not change the committed cache.
Unreadable storage is an error, never a new empty account database. Existing
balances above the old one-million normalization cap are preserved.

Accepted-message reward entitlements are saved under `data/coin-rewards/` and
credited immediately, independently of optional message cosmetics and database
replication. Failed credits retry every five seconds and after process restarts.
Per-process sequence checkpoints in `nebulo_community.rewardSequences` are
committed in the same transaction as each reward; retrying a lost commit
response cannot credit the same entitlement twice. Keep this directory on
persistent storage. `CHAT_LOCAL_DATA_DIR` can relocate both the local user store
and reward queue; its default is `chat-git-main/data`.

Socket `wallet_changed` events invalidate the browser balance. The browser
serializes no-cache reads from `/api/wallet`, rejecting older in-flight reads
after another update or account switch. Profile and action responses cannot
overwrite a confirmed wallet snapshot. Reconnects, foregrounding, completed
mutations, and periodic reconciliation also refresh it. Temporary failures
preserve the last confirmed total. Wallet invalidations are relayed between
Node cluster workers.

## Verification

Run `npm run test:coins` for persistence failure, concurrent local processes,
server restart recovery, uncertain reward commits, transfer rollback, session
outages, and browser synchronization regression tests. Database adapter tests
use a controlled transaction fixture; they do not write to production Postgres.

For a browser smoke test, run `node scripts/coinBrowserHarness.mjs` and open
`http://127.0.0.1:4319/kchat`. This serves the real frontend with mock accounts
and sockets, without reading `.env` or modifying real account data. Its
localhost-only `POST /__test/credit` adds five fixture coins and emits the
normal events. `POST /__test/offline` accepts `{ "offline": true }` or
`{ "offline": false }` to exercise outage recovery.

Restart the application after deploying these changes. No new database table
is required; reward checkpoints use the existing community metadata column.
