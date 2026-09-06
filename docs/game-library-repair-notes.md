# Game library repair pass

## Shipped changes

- Mobile/touch entry automatically replaces the fake error page with `/setup-v2`; desktop retains the N-key entry.
- Game mirror now reads the local cache, atomically fills missing assets, shares concurrent downloads, preserves binary bytes, and supports HEAD, ranges, conditional requests, and correct compression/MIME headers.
- Rewritten scripts revalidate so compatibility fixes do not remain hidden behind a one-hour browser cache.
- Removed the over-broad ad cleanup that deleted entire startup scripts. Refreshed cached entry pages with recoverable backups under `game-cache/platinum/before-entry-repair/`.
- Removed generic JavaScript string rewriting that damaged engine keys and regexes. Root asset requests with a same-host mirrored-game referrer route into the game mount instead.
- Added targeted compatibility repairs for old Unity bootstraps, custom Brotli loaders, duplicate Crossy Road/Traffic Tour scripts, MotoX3M containers, PlayCanvas loading screens, Basketball Stars decoding, Bouncemasters locale handling, and Undertale's absent optional worker template.
- Local portal adapters preserve browser-local progress; they do not supply external accounts, purchases, online leaderboards, or ad rewards.
- Shared player reveals controls sooner, focuses keyboard input, avoids touching WebGL canvas contexts, cancels obsolete timers, releases the game on close, and handles fullscreen failures.

## Verification

- `node --test scripts/gameAssets.test.mjs`: 10 passing regression tests.
- Browser smoke sweep covered all 529 catalog entry pages. All returned successful entry responses, but this does **not** establish complete playability.
- Selected post-repair startup checks passed for Cannon Basketball, Idle Ants, Tennis Random, Friday Night Funkin, Traffic Tour, Going Balls, Fork N Sausage, Race Master 3D, Stealth Master, Turbo Stars, Basketball Stars, MotoX3M Pool/Spooky/Winter, PolyBranch, Stack Bump 3D, Bolly Beat, Color Burst 3D, Bouncemasters, Undertale, and the `crossy-road` edition of Crossy Road.
- Shared player: actually played 2048 with keyboard input and confirmed an increasing score; mobile touch controls and close/unload also passed.
- Mobile entry: iPhone 13, Pixel 7, and iPad Pro 11 emulations reached setup without a keypress or a second tab. Desktop remained on the original entry page.
- See `game-library-startup-audit.json` for baseline and final selected-retest evidence. Baseline errors predate repairs and should not be interpreted as the final state of each repaired game.

## Still unresolved

The library is not fully certified. Some original exports still lack required files or depend on outside multiplayer/portal services. Examples include Drive Mad 200 (`webapp/index.data`), Match Triple 3D (`mtu.data`), Doomed.io fonts/images, and the older `crossyroad` edition's `audio.zip`. Dan The Man has a manifest/binary size mismatch. Other scripts, including Vex 6 and Pixel Shooter, still contain source errors. Tank Trouble 2 still reports audio/orientation issues.

The static reference audit currently also reports absent `pizza tower/js/help.js`, `snowbattle/js/lib.js`, and a malformed Elastic Man external script URL in the raw cache. The server repairs the malformed URL; that external resource still depends on its original host.

## Applying to the VPS

Deploy the changed source and new service/client files, then restart the app process. The running development app was not restarted during this pass; testing used a separate isolated game server without database/background jobs. No VPS deployment was performed.

`game-cache/` is ignored by Git. On an existing deployment that has startup-stripped cached entries, run the following from the project directory after updating the source:

```sh
node scripts/mirrorPlatinumGames.mjs --refresh-entries --entries-only
node --test scripts/gameAssets.test.mjs
pm2 restart nebulo --update-env
```

The refresh needs the upstream host to be reachable. Existing entry copies are backed up before replacement. Large engine assets stay cached; missing assets download on demand. Test actual gameplay on the deployed host before considering the library complete.
