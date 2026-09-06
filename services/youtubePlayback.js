import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { createReadStream } from "node:fs";
import { Readable } from "node:stream";
import { Innertube, Platform, UniversalCache } from "youtubei.js";
import youtubedl from "youtube-dl-exec";
import { GetCommentsSectionParams } from "../node_modules/youtubei.js/dist/protos/generated/misc/params.js";
import NavigationEndpoint from "../node_modules/youtubei.js/dist/src/parser/classes/NavigationEndpoint.js";
import { u8ToBase64 } from "../node_modules/youtubei.js/dist/src/utils/Utils.js";

const VIDEO_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;
const INFO_TTL_MS = 8 * 60 * 1000;
const ENGAGEMENT_TTL_MS = 5 * 60 * 1000;
const COMMENTS_TTL_MS = 2 * 60 * 1000;
const SHORTS_FEED_TTL_MS = 2 * 60 * 1000;
const COMMENT_CURSOR_TTL_MS = 10 * 60 * 1000;
const MEDIA_TOKEN_TTL_MS = 6 * 60 * 60 * 1000;
const SEEKABLE_MEDIA_TTL_MS = 5 * 60 * 1000;
const YTDLP_TIMEOUT_MS = 30 * 1000;
const UPSTREAM_TIMEOUT_MS = 20 * 1000;
const ALLOWED_MEDIA_HEADERS = [
  "accept-ranges",
  "cache-control",
  "content-length",
  "content-range",
  "content-type",
  "etag",
  "last-modified",
];

let innertubePromise;
const infoCache = new Map();
const engagementCache = new Map();
const commentsCache = new Map();
const shortsFeedCache = new Map();
const commentCursors = new Map();
const mediaTokens = new Map();
const seekableMediaCache = new Map();

// YouTube.js extracts only the small player function required to decipher URLs.
Platform.shim.eval = async (data) => new Function(data.output)();

function assertVideoId(videoId) {
  const normalized = String(videoId || "").trim();
  if (!VIDEO_ID_PATTERN.test(normalized)) {
    const error = new Error("Invalid YouTube video ID");
    error.statusCode = 400;
    throw error;
  }
  return normalized;
}

function getInnertube() {
  if (!innertubePromise) {
    innertubePromise = Innertube.create({
      cache: new UniversalCache(true),
      generate_session_locally: true,
      retrieve_player: true,
    }).catch((error) => {
      innertubePromise = undefined;
      throw error;
    });
  }
  return innertubePromise;
}

function pruneCaches(now = Date.now()) {
  for (const [key, entry] of infoCache) {
    if (entry.expiresAt <= now) infoCache.delete(key);
  }
  for (const [key, entry] of engagementCache) {
    if (entry.expiresAt <= now) engagementCache.delete(key);
  }
  for (const [key, entry] of commentsCache) {
    if (entry.expiresAt <= now) commentsCache.delete(key);
  }
  for (const [key, entry] of shortsFeedCache) {
    if (entry.expiresAt <= now) shortsFeedCache.delete(key);
  }
  for (const [cursor, entry] of commentCursors) {
    if (entry.expiresAt <= now) commentCursors.delete(cursor);
  }
  for (const [token, entry] of mediaTokens) {
    if (entry.expiresAt <= now) mediaTokens.delete(token);
  }
  for (const [videoId, entry] of seekableMediaCache) {
    if (entry.expiresAt <= now) seekableMediaCache.delete(videoId);
  }
}

async function getEngagementInfo(videoId) {
  const id = assertVideoId(videoId);
  const now = Date.now();
  const cached = engagementCache.get(id);
  if (cached && cached.expiresAt > now) return cached.promise;

  pruneCaches(now);
  const promise = getInnertube()
    .then((youtube) => youtube.getInfo(id, { client: "WEB" }))
    .catch((error) => {
      engagementCache.delete(id);
      throw error;
    });
  engagementCache.set(id, { promise, expiresAt: now + ENGAGEMENT_TTL_MS });
  return promise;
}

function buildCommentsContinuation(videoId) {
  const token = GetCommentsSectionParams.encode({
    ctx: { videoId },
    unkParam: 6,
    params: {
      opts: { videoId, sortBy: 0, type: 2, commentId: "" },
      target: "comments-section",
    },
  });
  return encodeURIComponent(u8ToBase64(token.finish()));
}

async function getRawComments(videoId) {
  const id = assertVideoId(videoId);
  const now = Date.now();
  const cached = commentsCache.get(id);
  if (cached && cached.expiresAt > now) return cached.promise;

  pruneCaches(now);
  const promise = getInnertube()
    .then(() => fetchCommentsPage(buildCommentsContinuation(id)))
    .catch((error) => {
      commentsCache.delete(id);
      throw error;
    });
  commentsCache.set(id, { promise, expiresAt: now + COMMENTS_TTL_MS });
  return promise;
}

async function fetchCommentsPage(continuationToken) {
  const youtube = await getInnertube();
  const endpoint = new NavigationEndpoint({
    continuationCommand: {
      request: "CONTINUATION_REQUEST_TYPE_WATCH_NEXT",
      token: continuationToken,
    },
  });
  const response = await endpoint.call(youtube.actions);
  return response.data;
}

function commentsContinuationToken(raw) {
  for (const endpoint of raw?.onResponseReceivedEndpoints || []) {
    const command = endpoint.reloadContinuationItemsCommand || endpoint.appendContinuationItemsAction;
    const items = command?.continuationItems || command?.contents || [];
    if (!items.some((item) => item.commentThreadRenderer)) continue;
    const continuation = items.find((item) => item.continuationItemRenderer)?.continuationItemRenderer;
    const token = continuation?.continuationEndpoint?.continuationCommand?.token;
    if (token) return token;
  }
  return "";
}

function registerCommentsCursor(videoId, raw) {
  const continuationToken = commentsContinuationToken(raw);
  if (!continuationToken) return "";
  const cursor = randomUUID().replaceAll("-", "");
  commentCursors.set(cursor, {
    videoId,
    continuationToken,
    expiresAt: Date.now() + COMMENT_CURSOR_TTL_MS,
  });
  return cursor;
}

async function getCommentsContinuation(videoId, cursor) {
  const entry = commentCursors.get(cursor);
  if (!entry || entry.expiresAt <= Date.now() || entry.videoId !== videoId) {
    commentCursors.delete(cursor);
    const error = new Error("Comments cursor expired; reload the comments");
    error.statusCode = 410;
    throw error;
  }

  const raw = await fetchCommentsPage(entry.continuationToken);
  commentCursors.delete(cursor);
  return raw;
}

async function getVideoInfo(videoId, client = "IOS") {
  const id = assertVideoId(videoId);
  const key = `${client}:${id}`;
  const now = Date.now();
  const cached = infoCache.get(key);
  if (cached && cached.expiresAt > now) return cached.promise;

  pruneCaches(now);
  const promise = getInnertube()
    .then((youtube) => youtube.getBasicInfo(id, { client }))
    .catch((error) => {
      infoCache.delete(key);
      throw error;
    });
  infoCache.set(key, { promise, expiresAt: now + INFO_TTL_MS });
  return promise;
}

async function getShortsFeed(videoId) {
  const id = assertVideoId(videoId);
  const now = Date.now();
  const cached = shortsFeedCache.get(id);
  if (cached && cached.expiresAt > now) return cached.promise;

  pruneCaches(now);
  const promise = getInnertube()
    .then((youtube) => youtube.getShortsVideoInfo(id, "WEB"))
    .then((info) => {
      const ids = [id];
      for (const endpoint of info.watch_next_feed || []) {
        const candidate = String(endpoint?.payload?.videoId || "");
        if (VIDEO_ID_PATTERN.test(candidate) && !ids.includes(candidate)) ids.push(candidate);
      }
      return ids;
    })
    .catch((error) => {
      shortsFeedCache.delete(id);
      throw error;
    });
  shortsFeedCache.set(id, { promise, expiresAt: now + SHORTS_FEED_TTL_MS });
  return promise;
}

function isGoogleVideoUrl(value) {
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase();
    return url.protocol === "https:" && (host === "googlevideo.com" || host.endsWith(".googlevideo.com"));
  } catch {
    return false;
  }
}

function registerMediaUrl(url) {
  if (!isGoogleVideoUrl(url)) throw new Error("YouTube returned an invalid media URL");
  const upstreamExpiry = Number(new URL(url).searchParams.get("expire")) * 1000;
  const expiresAt = Number.isFinite(upstreamExpiry) && upstreamExpiry > Date.now()
    ? Math.min(Date.now() + MEDIA_TOKEN_TTL_MS, upstreamExpiry - 30_000)
    : Date.now() + MEDIA_TOKEN_TTL_MS;
  const payload = Buffer.from(JSON.stringify({ url, expiresAt })).toString("base64url");
  const signature = signMediaPayload(payload);
  return `v1.${payload}.${signature}`;
}

function signMediaPayload(payload) {
  return createHmac("sha256", process.env.JWT_SECRET || "secret")
    .update(payload)
    .digest("base64url");
}

function resolveMediaToken(token) {
  const legacy = mediaTokens.get(token);
  if (legacy) {
    if (legacy.expiresAt > Date.now() && isGoogleVideoUrl(legacy.url)) return legacy;
    mediaTokens.delete(token);
    return null;
  }

  if (token.length > 8192) return null;
  const [version, payload, suppliedSignature, extra] = token.split(".");
  if (version !== "v1" || !payload || !suppliedSignature || extra !== undefined) return null;

  const expectedSignature = signMediaPayload(payload);
  const suppliedBuffer = Buffer.from(suppliedSignature);
  const expectedBuffer = Buffer.from(expectedSignature);
  if (suppliedBuffer.length !== expectedBuffer.length || !timingSafeEqual(suppliedBuffer, expectedBuffer)) return null;

  try {
    const media = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (!media || media.expiresAt <= Date.now() || !isGoogleVideoUrl(media.url)) return null;
    return media;
  } catch {
    return null;
  }
}

function preferredDashAudioUrl(info, availableItags) {
  const candidates = (info.streaming_data?.adaptive_formats || [])
    .filter((format) => (
      format.has_audio
      && !format.has_video
      && format.url
      && (!availableItags || availableItags.has(String(format.itag)))
    ));
  const defaults = candidates.filter((format) => format.audio_track?.audio_is_default);
  const originals = defaults.filter((format) => {
    try {
      return !String(new URL(format.url).searchParams.get("xtags") || "").includes("drc=1");
    } catch {
      return true;
    }
  });
  const pool = originals.length ? originals : defaults.length ? defaults : candidates;
  return [...pool].sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0))[0]?.url || "";
}

async function getSeekableMedia(videoId) {
  const id = assertVideoId(videoId);
  const now = Date.now();
  const cached = seekableMediaCache.get(id);
  if (cached && cached.expiresAt > now) return cached.promise;

  pruneCaches(now);
  const promise = youtubedl(`https://www.youtube.com/watch?v=${id}`, {
    dumpSingleJson: true,
    noPlaylist: true,
    noWarnings: true,
    skipDownload: true,
  }, {
    killSignal: "SIGKILL",
    timeout: YTDLP_TIMEOUT_MS,
  }).then((data) => {
    if (data?.id !== id || !Array.isArray(data.formats)) {
      throw new Error("YouTube returned invalid seekable media data");
    }

    const formatUrls = new Map();
    const formats = new Map();
    for (const format of data.formats) {
      const itag = String(format?.format_id || "");
      if (!/^\d+$/.test(itag) || !isGoogleVideoUrl(format?.url)) continue;
      formatUrls.set(itag, format.url);
      formats.set(itag, format);
    }
    if (!formatUrls.size) throw new Error("No seekable YouTube media formats are available");
    return { formatUrls, formats };
  }).catch((error) => {
    seekableMediaCache.delete(id);
    throw error;
  });

  seekableMediaCache.set(id, { promise, expiresAt: now + SEEKABLE_MEDIA_TTL_MS });
  return promise;
}

function requestOrigin(request) {
  const forwardedProto = String(request.headers["x-forwarded-proto"] || request.protocol || "http")
    .split(",")[0]
    .trim();
  const forwardedHost = String(request.headers["x-forwarded-host"] || request.headers.host || "")
    .split(",")[0]
    .trim();
  return `${forwardedProto || "http"}://${forwardedHost}`;
}

function bestThumbnail(thumbnails = []) {
  return [...thumbnails]
    .filter((thumbnail) => thumbnail?.url)
    .sort((a, b) => (b.width || 0) * (b.height || 0) - (a.width || 0) * (a.height || 0))[0]?.url || "";
}

function isYouTubeAvatarUrl(value) {
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase();
    return url.protocol === "https:" && (host === "yt3.ggpht.com" || host === "yt3.googleusercontent.com");
  } catch {
    return false;
  }
}

function proxyAvatarUrl(value) {
  return isYouTubeAvatarUrl(value)
    ? `/api/youtube/avatar?url=${encodeURIComponent(value)}`
    : "";
}

function formatDuration(totalSeconds) {
  const seconds = Math.max(0, Number(totalSeconds) || 0);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainder = Math.floor(seconds % 60);
  return hours
    ? `${hours}:${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`
    : `${minutes}:${String(remainder).padStart(2, "0")}`;
}

function publicVideoInfo(videoId, info, engagement) {
  const basic = info.basic_info || {};
  const engagementBasic = engagement?.basic_info || {};
  const commentCountText = engagement?.comments_entry_point_header?.comment_count?.toString?.()
    || engagement?.comments_entry_point_header?.header?.toString?.()
    || "";
  const qualities = [...new Set((info.streaming_data?.adaptive_formats || [])
    .filter((format) => format.has_video && format.quality_label)
    .map((format) => format.quality_label))]
    .sort((a, b) => parseInt(b, 10) - parseInt(a, 10));

  return {
    id: videoId,
    title: basic.title || "YouTube video",
    author: basic.author || basic.channel?.name || "YouTube",
    channelId: basic.channel_id || basic.channel?.id || "",
    duration: Number(basic.duration) || 0,
    durationText: formatDuration(basic.duration),
    viewCount: Number(basic.view_count) || 0,
    likeCount: Number(engagementBasic.like_count) || 0,
    commentCountText,
    thumbnail: `/api/youtube/thumbnail/${videoId}`,
    qualities,
    isLive: Boolean(basic.is_live),
  };
}

function findPinnedCommentIds(value, ids = new Set()) {
  if (!value || typeof value !== "object") return ids;
  const view = value.commentViewModel;
  if (view?.commentId && view.pinnedText) ids.add(view.commentId);
  for (const nested of Object.values(value)) findPinnedCommentIds(nested, ids);
  return ids;
}

function publicComments(raw) {
  const pinnedIds = findPinnedCommentIds(raw);
  const mutations = raw?.frameworkUpdates?.entityBatchUpdate?.mutations || [];
  const comments = [];

  for (const mutation of mutations) {
    const item = mutation?.payload?.commentEntityPayload;
    if (!item || item.properties?.replyLevel !== 0) continue;
    const id = String(item.properties?.commentId || "");
    const content = String(item.properties?.content?.content || "").trim();
    if (!id || !content) continue;

    comments.push({
      id,
      author: String(item.author?.displayName || "YouTube user"),
      avatar: proxyAvatarUrl(item.author?.avatarThumbnailUrl),
      content,
      publishedTime: String(item.properties?.publishedTime || ""),
      likeCount: String(item.toolbar?.likeCountNotliked || "0"),
      replyCount: String(item.toolbar?.replyCount || "0"),
      isPinned: pinnedIds.has(id),
      isVerified: Boolean(item.author?.isVerified),
      isCreator: Boolean(item.author?.isCreator),
    });
  }

  return comments.slice(0, 20);
}

function commentsCountText(raw) {
  const header = raw?.onResponseReceivedEndpoints?.[0]
    ?.reloadContinuationItemsCommand?.continuationItems?.[0]?.commentsHeaderRenderer;
  const runs = header?.countText?.runs || header?.commentsCount?.runs || [];
  return runs.map((run) => String(run?.text || "")).join("").trim();
}

function routeError(reply, error) {
  const statusCode = Number(error?.statusCode) || 502;
  const message = statusCode < 500 ? error.message : "YouTube playback is temporarily unavailable";
  if (statusCode >= 500) console.error("[youtube-player]", error);
  return reply.code(statusCode).send({ error: message });
}

async function relayMedia(request, reply, upstreamUrl) {
  if (!isGoogleVideoUrl(upstreamUrl)) {
    const error = new Error("Invalid media source");
    error.statusCode = 400;
    throw error;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);
  const abort = () => controller.abort();
  request.raw.once("aborted", abort);
  reply.raw.once("close", abort);

  try {
    const headers = {
      Accept: String(request.headers.accept || "*/*"),
      "User-Agent": String(request.headers["user-agent"] || "Mozilla/5.0"),
    };
    if (request.headers.range) headers.Range = String(request.headers.range);

    const upstream = await fetch(upstreamUrl, { headers, redirect: "follow", signal: controller.signal });
    if (!upstream.ok && upstream.status !== 206) {
      upstream.body?.cancel().catch(() => {});
      const error = new Error(`YouTube media returned ${upstream.status}`);
      error.statusCode = upstream.status === 403 ? 410 : 502;
      throw error;
    }

    reply.code(upstream.status);
    for (const header of ALLOWED_MEDIA_HEADERS) {
      const value = upstream.headers.get(header);
      if (value) reply.header(header, value);
    }
    reply.header("Cross-Origin-Resource-Policy", "same-origin");
    reply.header("X-Content-Type-Options", "nosniff");
    if (!upstream.body) return reply.send();
    return reply.send(Readable.fromWeb(upstream.body));
  } finally {
    clearTimeout(timeout);
    request.raw.removeListener("aborted", abort);
    // Keep the close listener attached while Fastify is still consuming the stream.
  }
}

export function registerYouTubePlaybackRoutes(fastify, { dashJsPath }) {
  fastify.route({
    method: ["GET", "POST", "OPTIONS"],
    url: "/api/stats/atr",
    onRequest: async (_request, reply) => reply.code(204).send(),
    handler: async (_request, reply) => reply.code(204).send(),
  });

  fastify.get("/vendor/dash.all.min.js", (_request, reply) => {
    reply.header("Cache-Control", "public, max-age=86400, immutable");
    reply.type("application/javascript; charset=utf-8");
    return reply.send(createReadStream(dashJsPath));
  });

  fastify.get("/api/youtube/info/:videoId", async (request, reply) => {
    try {
      const videoId = assertVideoId(request.params.videoId);
      const compact = String(request.query?.compact || "") === "1";
      const [info, engagement] = compact
        ? [await getVideoInfo(videoId, "IOS"), null]
        : await Promise.all([
          getVideoInfo(videoId, "IOS"),
          getEngagementInfo(videoId),
        ]);
      return reply.header("Cache-Control", "private, max-age=120").send(publicVideoInfo(videoId, info, engagement));
    } catch (error) {
      return routeError(reply, error);
    }
  });

  fastify.get("/api/youtube/shorts/:videoId", async (request, reply) => {
    try {
      const videoId = assertVideoId(request.params.videoId);
      const ids = await getShortsFeed(videoId);
      return reply.header("Cache-Control", "private, max-age=90").send({ ids });
    } catch (error) {
      return routeError(reply, error);
    }
  });

  fastify.get("/api/youtube/comments/:videoId", async (request, reply) => {
    try {
      const videoId = assertVideoId(request.params.videoId);
      const cursor = String(request.query?.cursor || "");
      if (cursor && !/^[a-f0-9]{32}$/.test(cursor)) {
        const error = new Error("Invalid comments cursor");
        error.statusCode = 400;
        throw error;
      }
      const raw = cursor
        ? await getCommentsContinuation(videoId, cursor)
        : await getRawComments(videoId);
      return reply.header("Cache-Control", "no-store").send({
        commentCountText: commentsCountText(raw),
        comments: publicComments(raw),
        cursor: registerCommentsCursor(videoId, raw),
      });
    } catch (error) {
      return routeError(reply, error);
    }
  });

  fastify.get("/api/youtube/avatar", async (request, reply) => {
    try {
      const avatarUrl = String(request.query?.url || "");
      if (!isYouTubeAvatarUrl(avatarUrl)) {
        const error = new Error("Invalid YouTube avatar URL");
        error.statusCode = 400;
        throw error;
      }
      const upstream = await fetch(avatarUrl, { signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS) });
      if (!upstream.ok || !upstream.body) throw new Error(`YouTube avatar returned ${upstream.status}`);
      const contentType = upstream.headers.get("content-type") || "";
      if (!contentType.startsWith("image/")) throw new Error("YouTube avatar did not return an image");
      reply.header("Cache-Control", "public, max-age=86400");
      reply.header("Content-Type", contentType);
      return reply.send(Readable.fromWeb(upstream.body));
    } catch (error) {
      return routeError(reply, error);
    }
  });

  fastify.get("/api/youtube/manifest/:videoId.mpd", async (request, reply) => {
    try {
      const videoId = assertVideoId(request.params.videoId);
      const [info, seekableMedia] = await Promise.all([
        getVideoInfo(videoId, "IOS"),
        getSeekableMedia(videoId),
      ]);
      if (info.basic_info?.is_live) {
        const error = new Error("Live streams are not supported by this player yet");
        error.statusCode = 422;
        throw error;
      }

      const origin = requestOrigin(request);
      const audioUrl = preferredDashAudioUrl(info, seekableMedia.formatUrls);
      const manifest = await info.toDash({
        url_transformer: (url) => {
          const itag = new URL(url).searchParams.get("itag") || "";
          const seekableUrl = seekableMedia.formatUrls.get(itag);
          if (!seekableUrl) throw new Error(`Missing seekable media format ${itag}`);
          return `${origin}/api/youtube/media/${registerMediaUrl(seekableUrl)}`;
        },
        format_filter: (format) => (
          !(format.has_audio || format.has_video)
          || !format.url
          || !seekableMedia.formatUrls.has(String(format.itag))
          || (format.has_audio && !format.has_video && audioUrl && format.url !== audioUrl)
        ),
      });
      return reply
        .header("Cache-Control", "no-store")
        .type("application/dash+xml; charset=utf-8")
        .send(manifest);
    } catch (error) {
      return routeError(reply, error);
    }
  });

  fastify.get("/api/youtube/thumbnail/:videoId", async (request, reply) => {
    try {
      const videoId = assertVideoId(request.params.videoId);
      const info = await getVideoInfo(videoId, "IOS");
      const thumbnail = bestThumbnail(info.basic_info?.thumbnail);
      const thumbnailUrl = new URL(thumbnail);
      if (thumbnailUrl.protocol !== "https:" || thumbnailUrl.hostname.toLowerCase() !== "i.ytimg.com") {
        throw new Error("No compatible thumbnail is available");
      }
      const upstream = await fetch(thumbnailUrl, { signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS) });
      if (!upstream.ok || !upstream.body) throw new Error(`YouTube thumbnail returned ${upstream.status}`);
      reply.header("Cache-Control", "public, max-age=3600");
      reply.header("Content-Type", upstream.headers.get("content-type") || "image/jpeg");
      const length = upstream.headers.get("content-length");
      if (length) reply.header("Content-Length", length);
      return reply.send(Readable.fromWeb(upstream.body));
    } catch (error) {
      return routeError(reply, error);
    }
  });

  fastify.get("/api/youtube/media/:token", async (request, reply) => {
    try {
      const token = String(request.params.token || "");
      const media = resolveMediaToken(token);
      if (!media) {
        const error = new Error("Media link expired; reload the player");
        error.statusCode = 410;
        throw error;
      }
      return await relayMedia(request, reply, media.url);
    } catch (error) {
      return routeError(reply, error);
    }
  });

  fastify.get("/api/youtube/progressive/:videoId", async (request, reply) => {
    try {
      const videoId = assertVideoId(request.params.videoId);
      const seekableMedia = await getSeekableMedia(videoId);
      const progressive = [...seekableMedia.formats.values()]
        .filter((format) => format.vcodec !== "none" && format.acodec !== "none")
        .sort((a, b) => (b.height || 0) - (a.height || 0))[0];
      if (!progressive?.url) throw new Error("No compatible progressive stream is available");
      return await relayMedia(request, reply, progressive.url);
    } catch (error) {
      return routeError(reply, error);
    }
  });
}
