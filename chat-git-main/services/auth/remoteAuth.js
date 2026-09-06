const axios = require('axios');
const jwt = require('jsonwebtoken');
const config = require('../../config/config');
const userStore = require('./localStore');
const profileStore = require('../db/profileStore');
const effectStore = require('../db/effectStore');
const bannerStore = require('../db/bannerStore');
const profileEffectStore = require('../db/profileEffectStore');

const REMOTE_AUTH_BASE = (process.env.REMOTE_AUTH_URL || 'https://laughing-eureka-vxpj6g5qqq53q49-8070.app.github.dev').replace(/\/+$/, '');

const tokenCache = new Map();
const CACHE_TTL_MS = 60_000;

function mapRemoteUser(remoteUser = {}) {
  const profile = remoteUser.profile || {};
  return {
    _id: remoteUser.id,
    id: remoteUser.id,
    username: profile.username || remoteUser.display_name || remoteUser.email || '',
    name: remoteUser.display_name || profile.username || remoteUser.email || '',
    avatar: profile.avatar_url || null,
    role: (profile.is_owner || remoteUser.is_owner) ? 'owner' : profile.is_admin ? 'admin' : 'user',
    email: remoteUser.email || '',
    is_owner: !!(profile.is_owner || remoteUser.is_owner),
    is_premium: !!(profile.is_premium || remoteUser.is_premium),
    is_booster: !!(profile.is_booster || remoteUser.is_booster),
    bio: profile.bio || null,
    coins: 0,
    ownedEffects: ['none'],
    ownedAvatarEffects: ['none'],
    ownedTags: ['none'],
    friends: [],
    equippedEffect: 'none',
    equippedAvatarEffect: 'none',
    equippedTag: 'none',
    ownedBanners: ['none'],
    equippedBanner: 'none',
    ownedProfileEffects: ['none'],
    equippedProfileEffect: 'none',
    date: null
  };
}

function mapLocalUser(localUser = {}) {
  const safe = userStore.sanitizeUser(localUser);
  if (!safe) return null;
  const role = String(safe.role || 'user').toLowerCase();
  return {
    _id: safe._id,
    id: safe._id,
    username: safe.username,
    name: safe.username,
    avatar: safe.avatar || null,
    role,
    email: '',
    is_owner: role === 'owner',
    is_premium: false,
    is_booster: false,
    bio: null,
    coins: safe.coins,
    ownedEffects: safe.ownedEffects,
    ownedAvatarEffects: safe.ownedAvatarEffects || ['none'],
    ownedTags: safe.ownedTags || ['none'],
    friends: safe.friends,
    equippedEffect: safe.equippedEffect,
    equippedAvatarEffect: safe.equippedAvatarEffect || 'none',
    equippedTag: safe.equippedTag || 'none',
    ownedBanners: safe.ownedBanners || ['none'],
    equippedBanner: safe.equippedBanner || 'none',
    ownedProfileEffects: safe.ownedProfileEffects || ['none'],
    equippedProfileEffect: safe.equippedProfileEffect || 'none',
    date: null
  };
}

function verifyLocalToken(token) {
  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    const userId = String(decoded?.user?.id || '').trim();
    if (!userId) return null;
    const user = userStore.findById(userId);
    return user ? mapLocalUser(user) : null;
  } catch (_err) {
    return null;
  }
}

function parseTokenFromSetCookie(setCookieHeader) {
  const cookies = Array.isArray(setCookieHeader) ? setCookieHeader : [String(setCookieHeader || '')];
  for (const cookie of cookies) {
    const match = cookie.match(/(?:^|;\s*)access-token=([^;]+)/i);
    if (match) return match[1].trim();
  }
  return null;
}

async function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    const userId = String(decoded?.user?.id || '').trim();
    const source = String(decoded?.user?.source || '').trim();
    if (userId && source === 'database') {
      const account = await profileStore.findAccountById(userId);
      if (account) {
        const local = userStore.upsertRemoteUser(account) || userStore.findById(userId);
        const safe = local ? userStore.sanitizeUser(local) : null;
        const effects = await effectStore.getUserEffects(userId).catch(() => ({
          ownedEffects: safe?.ownedEffects || ['none'],
          equippedEffect: safe?.equippedEffect || 'none',
          ownedAvatarEffects: safe?.ownedAvatarEffects || ['none'],
          equippedAvatarEffect: safe?.equippedAvatarEffect || 'none',
          ownedTags: ['none'],
          equippedTag: 'none'
        }));
        const banners = await bannerStore.getUserBanners(userId).catch(() => ({ ownedBanners:['none'], equippedBanner:'none' }));
        const profileEffects = await profileEffectStore.getUserProfileEffects(userId).catch(() => ({ ownedProfileEffects:['none'], equippedProfileEffect:'none' }));
        return {
          ...account,
          coins: account.coins ?? safe?.coins ?? 0,
          ownedEffects: effects.ownedEffects,
          equippedEffect: effects.equippedEffect,
          ownedAvatarEffects: effects.ownedAvatarEffects || ['none'],
          equippedAvatarEffect: effects.equippedAvatarEffect || 'none',
          ownedTags: effects.ownedTags || ['none'],
          equippedTag: effects.equippedTag || 'none',
          ownedBanners: banners.ownedBanners,
          equippedBanner: banners.equippedBanner,
          ownedProfileEffects: profileEffects.ownedProfileEffects,
          equippedProfileEffect: profileEffects.equippedProfileEffect,
          friends: safe?.friends || []
        };
      }
      return null;
    }
  } catch (_err) {}

  const localUser = verifyLocalToken(token);
  if (localUser) return localUser;

  const cached = tokenCache.get(token);
  if (cached && Date.now() - cached.ts < CACHE_TTL_MS) return cached.user;

  const meRes = await axios.get(`${REMOTE_AUTH_BASE}/auth/me`, {
    headers: { Cookie: `access-token=${token}` },
    validateStatus: null
  });

  if (meRes.status >= 400 || !meRes.data?.user) return null;

  const user = mapRemoteUser(meRes.data.user);
  tokenCache.set(token, { user, ts: Date.now() });
  return user;
}

module.exports = { REMOTE_AUTH_BASE, mapRemoteUser, mapLocalUser, parseTokenFromSetCookie, verifyToken };
