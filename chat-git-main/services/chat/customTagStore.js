const fs = require('fs');
const path = require('path');

const STORE_FILE = path.resolve(
  process.env.CUSTOM_CHAT_TAGS_FILE || path.join(__dirname, '..', '..', 'data', 'custom-tags.json')
);
const TAG_EFFECTS = Object.freeze(['none', 'neon', 'shimmer', 'pulse', 'prism', 'glitch']);

let state = { customTags: [], overrides: {}, hiddenTagIds: [] };

function validationError(message, code) {
  const error = new Error(message);
  error.code = code;
  return error;
}

function cleanName(value) {
  const name = String(value || '').replace(/\s+/g, ' ').trim();
  if (name.length < 2 || name.length > 24 || /[<>\r\n]/.test(name)) {
    throw validationError('Tag name must be 2-24 characters', 'INVALID_TAG_NAME');
  }
  return name;
}

function cleanPrice(value) {
  const price = Math.trunc(Number(value));
  if (!Number.isFinite(price) || price < 0 || price > 100_000) {
    throw validationError('Tag price must be between 0 and 100,000 coins', 'INVALID_TAG_PRICE');
  }
  return price;
}

function cleanColor(value) {
  const color = String(value || '').trim().toLowerCase();
  if (!/^#[0-9a-f]{6}$/.test(color)) {
    throw validationError('Choose a valid six-digit color', 'INVALID_TAG_COLOR');
  }
  return color;
}

function cleanDescription(value) {
  const description = String(value || '').replace(/\s+/g, ' ').trim();
  if (description.length > 140) {
    throw validationError('Tag description must be 140 characters or less', 'INVALID_TAG_DESCRIPTION');
  }
  return description;
}

function cleanEffect(value) {
  const effect = String(value || 'none').trim().toLowerCase();
  if (!TAG_EFFECTS.includes(effect)) {
    throw validationError('Choose a valid tag effect', 'INVALID_TAG_EFFECT');
  }
  return effect;
}

function cleanTagId(value, customOnly = false) {
  const id = String(value || '').trim().toLowerCase();
  const pattern = customOnly ? /^tag_custom_[a-z0-9_]{1,64}$/ : /^tag_[a-z0-9_]{1,72}$/;
  return pattern.test(id) ? id : '';
}

function slugFor(name) {
  return String(name || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 42) || 'tag';
}

function tagFields(input, fallback = {}) {
  return {
    name: input.name === undefined ? cleanName(fallback.name) : cleanName(input.name),
    price: input.price === undefined ? cleanPrice(fallback.price) : cleanPrice(input.price),
    description: input.description === undefined ? cleanDescription(fallback.description) : cleanDescription(input.description),
    color: input.color === undefined ? cleanColor(fallback.color || '#818cf8') : cleanColor(input.color),
    effect: input.effect === undefined ? cleanEffect(fallback.effect) : cleanEffect(input.effect)
  };
}

function publicTag(tag, extra = {}) {
  return {
    id: tag.id,
    name: tag.name,
    price: tag.price,
    description: tag.description,
    color: tag.color,
    effect: cleanEffect(tag.effect),
    scope: 'tag',
    custom: extra.custom === true,
    source: extra.custom === true ? 'custom' : 'built-in',
    hidden: extra.hidden === true,
    createdAt: tag.createdAt || null,
    updatedAt: tag.updatedAt || null
  };
}

function normalizeCustomTag(value) {
  const id = cleanTagId(value?.id, true);
  if (!id) return null;
  try {
    const createdAt = String(value.createdAt || new Date().toISOString());
    return {
      id,
      ...tagFields(value),
      createdAt,
      updatedAt: String(value.updatedAt || createdAt)
    };
  } catch {
    return null;
  }
}

function normalizeOverride(id, value) {
  const tagId = cleanTagId(id);
  if (!tagId || tagId.startsWith('tag_custom_')) return null;
  try {
    return { id: tagId, ...tagFields(value), updatedAt: String(value.updatedAt || new Date().toISOString()) };
  } catch {
    return null;
  }
}

function load() {
  try {
    const parsed = JSON.parse(fs.readFileSync(STORE_FILE, 'utf8'));
    const legacyTags = Array.isArray(parsed) ? parsed : parsed?.customTags;
    const customTags = (Array.isArray(legacyTags) ? legacyTags : []).map(normalizeCustomTag).filter(Boolean);
    const overrides = {};
    for (const [id, value] of Object.entries(Array.isArray(parsed) ? {} : parsed?.overrides || {})) {
      const normalized = normalizeOverride(id, value);
      if (normalized) overrides[normalized.id] = normalized;
    }
    const hiddenTagIds = [...new Set((Array.isArray(parsed) ? [] : parsed?.hiddenTagIds || []).map(id => cleanTagId(id)).filter(id => id && !id.startsWith('tag_custom_')))];
    state = { customTags, overrides, hiddenTagIds };
  } catch (error) {
    if (error?.code !== 'ENOENT') console.error('Could not load custom chat tags:', error.message);
    state = { customTags: [], overrides: {}, hiddenTagIds: [] };
  }
}

function save() {
  fs.mkdirSync(path.dirname(STORE_FILE), { recursive: true });
  const tempFile = `${STORE_FILE}.${process.pid}.${Date.now()}.tmp`;
  fs.writeFileSync(tempFile, `${JSON.stringify(state, null, 2)}\n`, 'utf8');
  fs.renameSync(tempFile, STORE_FILE);
}

function listTags() {
  return state.customTags.map(tag => publicTag(tag, { custom: true }));
}

function getTag(tagId) {
  const id = cleanTagId(tagId, true);
  const tag = state.customTags.find(item => item.id === id);
  return tag ? publicTag(tag, { custom: true }) : null;
}

function createTag(input = {}) {
  const fields = tagFields(input, { name: input.name, price: input.price, description: '', color: '#818cf8', effect: 'none' });
  const baseId = `tag_custom_${slugFor(fields.name)}`;
  let id = baseId;
  let suffix = 2;
  while (state.customTags.some(tag => tag.id === id)) id = `${baseId}_${suffix++}`;
  const now = new Date().toISOString();
  const tag = { id, ...fields, createdAt: now, updatedAt: now };
  state.customTags.push(tag);
  save();
  return publicTag(tag, { custom: true });
}

function catalogTag(tagId, staticTag = null) {
  const custom = getTag(tagId);
  if (custom) return custom;
  const id = cleanTagId(tagId);
  if (!id || !staticTag || staticTag.scope !== 'tag' || state.hiddenTagIds.includes(id)) return null;
  const override = state.overrides[id];
  const merged = override ? { ...staticTag, ...override, id } : { ...staticTag, effect: staticTag.effect || 'none' };
  return publicTag(merged, { custom: false });
}

function listCatalogTags(staticTags = []) {
  const builtIns = staticTags.map(tag => catalogTag(tag.id, tag)).filter(Boolean);
  return [...builtIns, ...listTags()];
}

function listManagedTags(staticTags = []) {
  const active = listCatalogTags(staticTags);
  const hidden = staticTags
    .filter(tag => state.hiddenTagIds.includes(String(tag.id || '').toLowerCase()))
    .map(tag => {
      const override = state.overrides[tag.id];
      return publicTag(override ? { ...tag, ...override, id:tag.id } : tag, { hidden:true });
    });
  return { active, hidden };
}

function updateTag(tagId, input = {}, staticTag = null) {
  const customId = cleanTagId(tagId, true);
  const customIndex = state.customTags.findIndex(tag => tag.id === customId);
  if (customIndex >= 0) {
    const current = state.customTags[customIndex];
    const updated = { ...current, ...tagFields(input, current), updatedAt: new Date().toISOString() };
    state.customTags[customIndex] = updated;
    save();
    return publicTag(updated, { custom:true });
  }

  const id = cleanTagId(tagId);
  if (!id || !staticTag || staticTag.scope !== 'tag') return null;
  const current = { ...staticTag, ...(state.overrides[id] || {}), id, effect:state.overrides[id]?.effect || staticTag.effect || 'none' };
  const override = { id, ...tagFields(input, current), updatedAt: new Date().toISOString() };
  state.overrides[id] = override;
  state.hiddenTagIds = state.hiddenTagIds.filter(hiddenId => hiddenId !== id);
  save();
  return publicTag({ ...staticTag, ...override, id });
}

function removeTag(tagId, staticTag = null) {
  const customId = cleanTagId(tagId, true);
  const customIndex = state.customTags.findIndex(tag => tag.id === customId);
  if (customIndex >= 0) {
    const [removed] = state.customTags.splice(customIndex, 1);
    save();
    return publicTag(removed, { custom:true, hidden:true });
  }
  const id = cleanTagId(tagId);
  if (!id || !staticTag || staticTag.scope !== 'tag') return null;
  if (!state.hiddenTagIds.includes(id)) state.hiddenTagIds.push(id);
  save();
  return publicTag({ ...staticTag, ...(state.overrides[id] || {}), id }, { hidden:true });
}

function restoreTag(tagId, staticTag = null) {
  const id = cleanTagId(tagId);
  if (!id || !staticTag || staticTag.scope !== 'tag' || !state.hiddenTagIds.includes(id)) return null;
  state.hiddenTagIds = state.hiddenTagIds.filter(hiddenId => hiddenId !== id);
  save();
  return catalogTag(id, staticTag);
}

load();

module.exports = {
  STORE_FILE,
  TAG_EFFECTS: [...TAG_EFFECTS],
  catalogTag,
  createTag,
  getTag,
  listCatalogTags,
  listManagedTags,
  listTags,
  removeTag,
  restoreTag,
  updateTag
};
