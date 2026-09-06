import path from "node:path";
import { readFileSync } from 'node:fs';
import { createGameAssetHandler } from "./gameAssetCache.js";
import { repairGameExport } from './gameCompatibility.js';

export const PLATINUM_ORIGIN = "https://platinumunblocker.com";
export const PLATINUM_MOUNT = "/games/platinum";

const assetPath = /\.(?:html?|js|mjs|css|json|xml|txt|map|wasm|pck|data|mem|unityweb|unity3d|bundle|bin|br|gz|zip|swf|png|jpe?g|webp|gif|svg|ico|avif|mp3|ogg|wav|m4a|mp4|webm|ogv|ttf|otf|woff2?|eot|atlas|fnt)(?:[?#].*)?$/i;


function safeSegment(segment) {
  let decoded = segment;
  try {
    decoded = decodeURIComponent(segment);
  } catch {}
  return encodeURIComponent(decoded).replace(/%2F/gi, "%252F");
}

export function getPlatinumCachePath(cacheRoot, remoteUrl) {
  const url = remoteUrl instanceof URL ? remoteUrl : new URL(remoteUrl);
  const segments = url.pathname.split("/").filter(Boolean).map(safeSegment);
  if (!segments.length || url.pathname.endsWith("/")) segments.push("index.html");
  return path.join(cacheRoot, ...segments);
}

export function toPlatinumLocalUrl(remoteUrl) {
  const url = remoteUrl instanceof URL ? remoteUrl : new URL(remoteUrl);
  if (url.origin !== PLATINUM_ORIGIN) return url.toString();
  return `${PLATINUM_MOUNT}${url.pathname}${url.search}`;
}

export function toPlatinumRemoteUrl(localPath) {
  // Older cached bundles prefixed asset suffixes which an engine then joined
  // to its own base path (build/resources/games/platinum/assets/...).
  const raw = String(localPath || "").split("?")[0].replace(/^\/+/, "").replaceAll('/games/platinum/', '/');
  const url = new URL(`/${raw}`, PLATINUM_ORIGIN);
  if (url.origin !== PLATINUM_ORIGIN || url.pathname.includes("..")) {
    throw new Error("Invalid mirrored game path");
  }
  return url;
}

export function rewritePlatinumText(text, contentType = "", remoteUrl) {
  let output = String(text || "");
  output = output.replaceAll(`${PLATINUM_MOUNT}/`, "/");
  output = output
    .replaceAll(`${PLATINUM_ORIGIN}/`, `${PLATINUM_MOUNT}/`)
    .replaceAll("//platinumunblocker.com/", `${PLATINUM_MOUNT}/`);
  // Recover malformed absolute script URLs in older archived HTML exports.
  if (/html/i.test(contentType)) output = output.replace(/(\b(?:src|href)\s*=\s*["'])\/(https?:\/\/)/gi, '$1$2');

  if (/html/i.test(contentType)) {
    // Rewritten scripts/styles no longer have the upstream byte digest.
    output = output.replace(/(<(?:script|link)\b[^>]*?)\s+integrity\s*=\s*["'][^"']*["']/gi, '$1');
    // Preserve game startup code around the injected ad IIFE.
    output = output.replace(
      /\(function\s*\(\)\s*\{\s*var\s+KeY\s*=\s*['"]{2},\s*iFD\s*=\s*\d+\s*-\s*\d+;[\s\S]*?\breturn\s+\d+\s*\r?\n\s*\}\)\(\)\s*;?/g,
      ""
    );
    output = output.replace(
      /<script\b[^>]*>\s*if\s*\(\s*window\.top\s*===\s*window\.self\s*\)\s*\{\s*window\.location\.href\s*=\s*["']\.\.\/\.\.\/\.\.\/["']\s*;?\s*\}\s*<\/script>\s*/gi,
      ""
    );
    output = output.replace(
      /<script\b[^>]*\bsrc\s*=\s*["'](?:\/games\/platinum)?\/js\/main\.js(?:\?[^"']*)?["'][^>]*>\s*<\/script>\s*/gi,
      ""
    );
    output = output.replace(
      /<script\b[^>]*\bsrc\s*=\s*["'][^"']*(?:analytics_ubg_v1_4\.js|ubg235_client_v1_1\.js|detectmobilebrowser\.js|production-assetsbucket-[^"']*(?:%2F|\/)scr\.js|hextris\.io\/scripts\/a\.html|\/cloak\.js|patch\/js\/null\.js\?https:\/\/www\.googletagmanager\.com\/gtag\/js[^"']*)["'][^>]*>\s*<\/script>\s*/gi,
      ""
    );
    output = output.replace(
      /(<base\b[^>]*\bhref\s*=\s*["'])https?:\/\/[^"']+\/(\s*["'][^>]*>)/gi,
      "$1./$2"
    );
    output = output.replace(/<script\b[^>]*>(?:(?!<\/script>)[\s\S])*?window\.__CF\$cv\$params(?:(?!<\/script>)[\s\S])*?<\/script>/gi, '');
    output = output.replace(/<script\b[^>]*>(?:(?!<\/script>)[\s\S])*?script\.src\s*=\s*["']https:\/\/cdn\.jsdelivr\.net\/npm\/eruda["'];(?:(?!<\/script>)[\s\S])*?<\/script>/gi, '');
    if (remoteUrl?.pathname === '/cdn/traffic%20tour/index.html') {
      output = output.replace(/<script\b[^>]*src=["']web3\/index.js["'][^>]*>\s*<\/script>/i, '');
      output = output.replace(/<link\b[^>]*href=["']https:\/\/imadejptr\.glitch\.me\/[^"']+["'][^>]*>/gi, '');
      output = output.replace('</head>', '<style>html,body{margin:0;height:100%;background:#000}#unity-container,#unity-canvas{width:100%;height:100%;display:block}#unity-loading-bar{position:absolute;inset:45% 20% auto;height:8px;background:#333}#unity-progress-bar-full{height:8px;background:#3f8cff}</style></head>');
    }
    output = output.replace(
      /(\b(?:src|href|poster|action|data-src)\s*=\s*["'])\/(?!\/)([^"']*)(["'])/gi,
      `$1${PLATINUM_MOUNT}/$2$3`
    );
  }

  // These archived Unity pages include their loader but omit the startup call.
  const unityEntries = {
    '/cdn/blocky%20snakes/index.html': ['gameContainer', 'build.json'],
    '/cdn/fighter%20aircraft%20piolet/index.html': ['gameContainer', 'Build/Fighter%20Aircraft%20Pilot.json'],
    '/cdn/freefall%20tournament/index.html': ['gameContainer', 'Build/freefall-tournament.json'],
    '/cdn/gunspin/index.html': ['unityContainer', 'Build/GunSpin%20WebGL%20FinalVersion.json'],
    '/cdn/Pre%20Civilization%20Bronze%20Age/index.html': ['unityContainer', 'Build/WebGL.json'],
    '/cdn/ultimate%20offroad%20simulator/index.html': ['gameContainer', 'Build/trailer_chip.json'],
  };
  const bootstrap = unityEntries[remoteUrl?.pathname];
  if (/html/i.test(contentType) && bootstrap && !/UnityLoader\.instantiate\s*\(/.test(output)) {
    const startup = `<script>var gameInstance=UnityLoader.instantiate(${JSON.stringify(bootstrap[0])},${JSON.stringify(bootstrap[1])},{onProgress:typeof UnityProgress==='function'?UnityProgress:undefined});</script>`;
    output = /<\/body>/i.test(output) ? output.replace(/<\/body>/i, `${startup}</body>`) : output + startup;
  }

  // JavaScript strings may be suffix tests, regex fragments, or engine asset
  // keys. Resolve root asset requests on the server instead of changing them.

  if (/css/i.test(contentType)) {
    output = output.replace(
      /(url\(\s*["']?)\/(?!\/|games\/platinum\/)([^)'"\s]+)(["']?\s*\))/gi,
      `$1${PLATINUM_MOUNT}/$2$3`
    );
  }

  output = output.replace(/https?:\/\/yandex\.ru\/games\/sdk\/v2/g, `${PLATINUM_MOUNT}/__nebulo/platform.js`)
    .replace(/https?:\/\/www\.coolmathgames\.com\/sites\/default\/files\/cmg-ads\.js/g, `${PLATINUM_MOUNT}/__nebulo/platform.js`);
  output = output.replaceAll('/__nebulo/platform.js', `${PLATINUM_MOUNT}/__nebulo/platform.js`).replaceAll(`${PLATINUM_MOUNT}${PLATINUM_MOUNT}/`, `${PLATINUM_MOUNT}/`);
  if (output.includes('YaGames')) output = output.replace(/(["'])\/(?:games\/platinum\/)?sdk\.js\1/g, `$1${PLATINUM_MOUNT}/__nebulo/platform.js$1`);
  return repairGameExport(output, remoteUrl);
}


export function registerPlatinumGameMirrorRoutes(fastify, options = {}) {
  fastify.addHook('onRequest', async (request, reply) => {
    const target = String(request.raw.url || '/');
    if (target.startsWith(`${PLATINUM_MOUNT}/`) || !assetPath.test(target) || !request.headers.referer) return;
    try {
      const source = new URL(request.headers.referer);
      const requestOrigin = new URL(`${source.protocol}//${request.headers.host}`).origin;
      if (source.origin === requestOrigin && source.pathname.startsWith(`${PLATINUM_MOUNT}/`)) {
        return reply.redirect(`${PLATINUM_MOUNT}${target}`, 307);
      }
    } catch (_) {}
  });
  fastify.get(`${PLATINUM_MOUNT}/__nebulo/platform.js`, async (_req, reply) => reply.type('application/javascript')
    .header('Cache-Control', 'no-cache').send(readFileSync(new URL('../public/assets/js/game-platform.js', import.meta.url))));
  const handler = createGameAssetHandler({
    ...options,
    toRemote: toPlatinumRemoteUrl,
    cachePath: getPlatinumCachePath,
    rewrite: rewritePlatinumText,
    origin: PLATINUM_ORIGIN,
  });
  fastify.route({
    method: ["GET", "HEAD"],
    url: `${PLATINUM_MOUNT}/*`,
    handler,
  });
}
