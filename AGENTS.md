# Agent Notes (nebulo education plus)

## What This Repo Is
- Node/Fastify app (`app.js`) serving static pages from `public/` and `pages/`.
- Proxy stack includes Ultraviolet (`/uv/`), Eclipse (`/ec/`), BareMux (`/baremux/`), Epoxy (`/epoxy/`), Scramjet assets (`/scram/`).
- Start command: `npm run start` (runs `node app.js`).

## Key Files
- `app.js`: Fastify server + static mounting + API endpoints.
- `public/sw.js`: service worker that routes UV/Eclipse/Scramjet requests.
- `public/search.html`, `public/settings.html`: key UI pages.

## Debugging The “Scramjet wasm” Error
If you see errors like:
- `scramjet.wasm.wasm:1 Uncaught SyntaxError: Invalid or unexpected token`
- `rewriter wasm not found (was it fetched correctly?)`

This usually means the browser tried to `importScripts()` a raw `.wasm` file.
Scramjet expects its own SW handler to intercept the wasm URL and serve a JS wrapper that sets `self.WASM`.

Check `public/sw.js`:
- Do not bypass the Scramjet wasm URL under the “Never proxy local runtime assets” block.
- Ensure requests for the Scramjet wasm URL are allowed to hit the Scramjet handler (`scram.route(...)` / `scram.fetch(...)`).

## Conventions
- Keep `/scram/` runtime asset paths stable; many pages hardcode them.
- Prefer small, targeted changes to `public/sw.js` because it affects all proxy modes.

