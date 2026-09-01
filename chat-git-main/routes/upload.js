const express = require('express');
const router = express.Router();
const multer = require('multer');
const axios = require('axios');
const auth = require('../middleware/auth');
const security = require('../middleware/security');

const IMAGE_MODERATION_ENABLED = String(process.env.IMAGE_MODERATION_ENABLED || 'true').toLowerCase() !== 'false';
const IMAGE_MODERATION_BLOCK = new Set(
  String(process.env.IMAGE_MODERATION_BLOCK_RATINGS || 'reject,nsfw,r,x,adult_content,explicit_nudity')
    .split(',')
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean)
);
const CONTENTMOD_ANALYZER_PAGE = 'https://contentmod.io/tools/free-image-analyzer';
const CONTENTMOD_ANALYZER_ACTION = '7f2e0bf3e11b93660b302398daba2300f50476b501';
const QUIZIZZ_UPLOAD_URL = String(
  process.env.QUIZIZZ_UPLOAD_URL ||
  process.env.QUIZIZZ_STATIC_IMAGE_URL ||
  'https://quizizz-static.s3.amazonaws.com/_media/uploadedFiles/e7acb071-ad91-4526-b1c7-05c04a52d667-v2'
).trim();
const QUIZIZZ_SIGN_URL_ENDPOINT = String(
  process.env.QUIZIZZ_SIGN_URL_ENDPOINT ||
  'https://media.quizizz.com/_mdserver/main/getUploadURL'
).trim();
const QUIZIZZ_UPLOAD_DESTINATION = String(process.env.QUIZIZZ_UPLOAD_DESTINATION || 'uploadedFiles').trim();
const QUIZIZZ_UPLOAD_FOLDER = String(process.env.QUIZIZZ_UPLOAD_FOLDER || '_quizizzAIGenDocs').trim();
const QUIZIZZ_ALLOWED_IMAGE_HOSTS = new Set([
  'media.quizizz.com',
  'quizizz-static.s3.amazonaws.com',
  'quizizz-static.s3-accelerate.amazonaws.com'
]);

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif']);
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_BYTES },
  fileFilter(_req, file, cb) {
    cb(null, ALLOWED_MIME.has(file.mimetype));
  }
});

// @route   POST api/upload/image
function parseModerationResult(raw) {
  if (!raw) return null;
  if (typeof raw === 'object') return raw;
  try { return JSON.parse(String(raw)); } catch { return null; }
}

function normalizeCategoryValue(value) {
  if (!value) return '';
  if (typeof value === 'string') return value.trim().toLowerCase();
  if (typeof value !== 'object') return String(value).trim().toLowerCase();
  return String(
    value.category ||
    value.name ||
    value.label ||
    value.type ||
    value.key ||
    value.id ||
    ''
  ).trim().toLowerCase();
}

function uniqueLabels(values = []) {
  return [...new Set(values.map(normalizeCategoryValue).filter(Boolean))];
}

async function moderateHostedImage(url) {
  if (!IMAGE_MODERATION_ENABLED) return { allowed: true, skipped: 'disabled' };

  const actionResponse = await axios.post(CONTENTMOD_ANALYZER_PAGE, '[]', {
    headers: {
      'Next-Action': CONTENTMOD_ANALYZER_ACTION,
      Accept: 'text/x-component',
      'Content-Type': 'text/plain;charset=UTF-8',
      Origin: 'https://contentmod.io',
      Referer: CONTENTMOD_ANALYZER_PAGE,
      'User-Agent': 'Mozilla/5.0'
    },
    responseType: 'text',
    timeout: 12000,
    validateStatus: null
  });
  if (actionResponse.status < 200 || actionResponse.status >= 300) {
    return { allowed: false, reason: `ContentMod analyzer token request failed (${actionResponse.status})` };
  }
  const signedUrl = String((String(actionResponse.data || '').match(/"data":"([^"]+)"/) || [])[1] || '')
    .replace(/\\u0026/g, '&')
    .trim();
  if (!signedUrl || !signedUrl.startsWith('https://api.contentmod.io/public/')) {
    return { allowed: false, reason: 'ContentMod analyzer did not return a valid moderation URL' };
  }

  const moderationResponse = await axios.post(
    signedUrl,
    { image: url },
    {
      headers: {
        'X-Tool-Id': 'image-analyzer',
        Origin: 'https://contentmod.io',
        Referer: CONTENTMOD_ANALYZER_PAGE,
        'User-Agent': 'Mozilla/5.0'
      },
      timeout: 30000,
      validateStatus: null
    }
  );
  if (moderationResponse.status < 200 || moderationResponse.status >= 300) {
    return { allowed: false, reason: `ContentMod analyzer failed (${moderationResponse.status})` };
  }

  const result = moderationResponse.data || {};
  const contentRating = String(result.summary?.contentRating || '').trim().toLowerCase();
  const categories = Array.isArray(result.nsfwCategories) ? uniqueLabels(result.nsfwCategories) : [];
  const reject = !!result.suggestedActions?.reject;
  const unsafe = result.isSafe === false;
  const labels = uniqueLabels([
    unsafe ? 'unsafe' : 'safe',
    reject ? 'reject' : '',
    categories.length ? 'nsfw' : '',
    contentRating,
    ...categories
  ]);

  console.log('[image moderation]', {
    provider: 'contentmod',
    url,
    isSafe: result.isSafe,
    confidence: result.confidence ?? null,
    contentRating: result.summary?.contentRating || null,
    nsfwCategories: categories,
    rawNsfwCategories: result.nsfwCategories || [],
    suggestedActions: result.suggestedActions || null,
    riskScores: result.riskScores || null,
    description: result.description || null
  });

  const pg13Allowed = contentRating === 'pg-13' && !IMAGE_MODERATION_BLOCK.has('pg-13');
  const blocked = pg13Allowed ? false : labels.some((label) => IMAGE_MODERATION_BLOCK.has(label));
  const category = labels.join(',') || 'unknown';
  return {
    allowed: !blocked,
    category,
    reason: blocked ? `Image blocked by moderation (${category})` : null,
    result
  };
}

function extractImageUrlsFromText(text = '') {
  const urls = [];
  const re = /\[img:(?:<a[^>]*href="([^"]+)"[^>]*>[\s\S]*?<\/a>|([^\]]+))\]/gi;
  let match;
  while ((match = re.exec(String(text || '')))) {
    const url = String(match[1] || match[2] || '').trim();
    if (url) urls.push(url);
  }
  return urls;
}

async function validateImageUrlsInText(text = '') {
  const urls = extractImageUrlsFromText(text);
  for (const url of urls) {
    let parsed;
    try { parsed = new URL(url); } catch {
      return { allowed: false, reason: 'Image URL is invalid', url };
    }
    if (parsed.protocol !== 'https:' || !QUIZIZZ_ALLOWED_IMAGE_HOSTS.has(parsed.hostname)) {
      return { allowed: false, reason: 'Images must be uploaded through the chat image uploader', url };
    }
    const moderation = await moderateHostedImage(parsed.href);
    if (!moderation.allowed) {
      return {
        allowed: false,
        reason: moderation.reason || 'Image blocked by moderation',
        url,
        moderation
      };
    }
  }
  return { allowed: true };
}

function assertQuizizzUrl(url) {
  let parsed;
  try { parsed = new URL(url); } catch {
    const err = new Error('Quizizz image host URL is invalid');
    err.status = 503;
    throw err;
  }
  if (parsed.protocol !== 'https:' || !QUIZIZZ_ALLOWED_IMAGE_HOSTS.has(parsed.hostname)) {
    const err = new Error('Image host must be Quizizz media/static');
    err.status = 503;
    throw err;
  }
  return parsed.href;
}

function extractHostedUrl(uploadUrl, response) {
  const data = response?.data;
  const candidates = [
    data?.url,
    data?.image,
    data?.imageUrl,
    data?.location,
    data?.Location,
    data?.file?.url,
    data?.data?.url,
    typeof data === 'string' && /^https?:\/\//i.test(data.trim()) ? data.trim() : ''
  ].filter(Boolean);
  const candidate = candidates.find((value) => {
    try { return QUIZIZZ_ALLOWED_IMAGE_HOSTS.has(new URL(String(value)).hostname); } catch { return false; }
  });
  return assertQuizizzUrl(candidate || uploadUrl);
}

async function getQuizizzUploadUrls(contentType) {
  const metadata = encodeURIComponent(JSON.stringify({ 'Content-Type': contentType }));
  const endpoint = `${QUIZIZZ_SIGN_URL_ENDPOINT}?destination=${encodeURIComponent(QUIZIZZ_UPLOAD_DESTINATION)}&folder=${encodeURIComponent(QUIZIZZ_UPLOAD_FOLDER)}&metadata=${metadata}&enableAcceleration=true`;
  const response = await axios.post(endpoint, null, {
    headers: { accept: 'application/json, text/plain, */*' },
    timeout: 15000,
    validateStatus: null
  });
  if (response.status < 200 || response.status >= 300 || !response.data?.data?.signedUrl || !response.data?.data?.finalUrl) {
    const err = new Error(`Quizizz upload URL request failed (${response.status})`);
    err.status = 502;
    err.detail = typeof response.data === 'string'
      ? response.data.slice(0, 300)
      : JSON.stringify(response.data || {}).slice(0, 300);
    throw err;
  }
  return {
    signedUrl: assertQuizizzUrl(response.data.data.signedUrl),
    finalUrl: assertQuizizzUrl(response.data.data.finalUrl)
  };
}

async function uploadToQuizizz(file) {
  const { signedUrl, finalUrl } = await getQuizizzUploadUrls(file.mimetype);
  const response = await axios({
    method: 'PUT',
    url: signedUrl,
    data: file.buffer,
    headers: {
      'Content-Type': file.mimetype,
      'Content-Length': file.size
    },
    timeout: 20000,
    validateStatus: null
  });

  if (response.status < 200 || response.status >= 300) {
    const err = new Error(
      response.status === 403
        ? 'Quizizz image host rejected upload (403). The signed upload URL was denied.'
        : `Quizizz image host rejected upload (${response.status})`
    );
    err.status = 502;
    err.detail = typeof response.data === 'string'
      ? response.data.slice(0, 300)
      : JSON.stringify(response.data || {}).slice(0, 300);
    throw err;
  }

  return extractHostedUrl(finalUrl, response);
}

// @route   POST api/upload/image
// @desc    Proxy image upload to configured CDN and moderate returned URL
// @access  Private
router.post('/image', auth, security.chatWriteRateLimit, upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ msg: 'No image file provided or unsupported type' });

  try {
    const hostedUrl = await uploadToQuizizz(req.file);
    const moderation = await moderateHostedImage(hostedUrl);
    if (!moderation.allowed) {
      return res.status(422).json({
        msg: moderation.reason || 'Image blocked by moderation',
        moderation: {
          blocked: true,
          provider: 'contentmod',
          category: moderation.category || null,
          rating: moderation.result?.summary?.contentRating || null,
          confidence: moderation.result?.confidence ?? null,
          nsfwCategories: Array.isArray(moderation.result?.nsfwCategories) ? uniqueLabels(moderation.result.nsfwCategories) : [],
          rawNsfwCategories: moderation.result?.nsfwCategories || [],
          suggestedActions: moderation.result?.suggestedActions || null,
          riskScores: moderation.result?.riskScores || null
        }
      });
    }

    return res.json({
      url: hostedUrl,
      moderation: {
        blocked: false,
        provider: 'contentmod',
        category: moderation.category || null,
        skipped: moderation.skipped || null,
        rating: moderation.result?.summary?.contentRating || null,
        confidence: moderation.result?.confidence ?? null,
        nsfwCategories: Array.isArray(moderation.result?.nsfwCategories) ? uniqueLabels(moderation.result.nsfwCategories) : [],
        rawNsfwCategories: moderation.result?.nsfwCategories || [],
        suggestedActions: moderation.result?.suggestedActions || null,
        riskScores: moderation.result?.riskScores || null
      }
    });
  } catch (err) {
    return res.status(err.status || 502).json({ msg: err.message || 'Failed to upload image', detail: err.detail || err.message });
  }
});

// Domains allowed for the image proxy
const PROXY_ALLOWED = new Set(QUIZIZZ_ALLOWED_IMAGE_HOSTS);

// @route   GET api/upload/proxy
// @desc    Proxy an image from an allowed CDN domain (no auth — used by <img> tags)
// @access  Public
router.get('/proxy', async (req, res) => {
  const raw = String(req.query.url || '').trim();
  if (!raw) return res.status(400).end();

  let parsed;
  try { parsed = new URL(raw); } catch { return res.status(400).end(); }

  if (!PROXY_ALLOWED.has(parsed.hostname)) return res.status(403).end();
  if (parsed.protocol !== 'https:') return res.status(400).end();

  try {
    const upstream = await axios.get(raw, {
      responseType: 'stream',
      timeout: 15000,
      validateStatus: null
    });

    const ct = String(upstream.headers['content-type'] || '');
    if (!ct.startsWith('image/')) {
      upstream.data.destroy();
      return res.status(400).end();
    }

    res.setHeader('content-type', ct);
    res.setHeader('cache-control', 'public, max-age=604800, immutable');
    res.setHeader('x-content-type-options', 'nosniff');
    upstream.data.pipe(res);
  } catch {
    return res.status(502).end();
  }
});

router.moderateHostedImage = moderateHostedImage;
router.validateImageUrlsInText = validateImageUrlsInText;

module.exports = router;
