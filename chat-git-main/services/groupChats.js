const fs = require('fs');
const path = require('path');
const groupChatsStore = require('./db/groupChatsStore');

const DATA_DIR = path.resolve(__dirname, '../data');
const GROUPS_FILE = path.join(DATA_DIR, 'group-chats.json');
const ROOM_CODE_CHARS = 'abcdefghijklmnopqrstuvwxyz';
const ROOM_CODE_LENGTH = 5;
const MAX_GROUPS_PER_USER = 15;
const SINGLE_MEMBER_MAX_MS = 2 * 24 * 60 * 60 * 1000;

const state = {
  groups: [],
  loaded: false
};

const normalizeString = (value) => String(value || '').trim().toLowerCase();
const normalizeMember = (value) => String(value || '').trim();

const isExpiredSingleMemberGroup = (group, now = Date.now()) =>
  !!group &&
  Array.isArray(group.members) &&
  group.members.length === 1 &&
  Number(group.singleMemberSince || 0) > 0 &&
  Number(now) - Number(group.singleMemberSince) >= SINGLE_MEMBER_MAX_MS;

const normalizeGroup = (group) => {
  if (!group || typeof group !== 'object') return null;
  const room = normalizeString(group.room);
  if (!room) return null;
  const seenMembers = new Set();
  const members = Array.isArray(group.members)
    ? group.members
        .map(normalizeMember)
        .filter(Boolean)
        .filter((member) => {
          const key = member.toLowerCase();
          if (seenMembers.has(key)) return false;
          seenMembers.add(key);
          return true;
        })
    : [];
  const createdAt = Number(group.createdAt) || Date.now();
  const creator = normalizeMember(group.creator || members[0] || '');
  return {
    room,
    name: String(group.name || `Group ${room}`).trim(),
    createdAt,
    creator,
    singleMemberSince: members.length === 1
      ? Number(group.singleMemberSince) || createdAt
      : null,
    members
  };
};

const ensureDataDir = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
};

const saveGroups = () => {
  try {
    ensureDataDir();
    fs.writeFileSync(GROUPS_FILE, JSON.stringify({ groups: state.groups }, null, 2), 'utf8');
  } catch (_err) {
    // ignore write errors
  }
};

const loadGroups = async () => {
  if (state.loaded) return state.groups;
  state.loaded = true;
  try {
    await groupChatsStore.ensureTable();
    const rows = await groupChatsStore.listGroups();
    if (rows.length) {
      state.groups = rows.map(normalizeGroup).filter(Boolean);
      return state.groups;
    }
  } catch (error) {
    console.warn('Group chat DB load failed, falling back to file:', error?.message || error);
  }
  try {
    ensureDataDir();
    if (!fs.existsSync(GROUPS_FILE)) {
      fs.writeFileSync(GROUPS_FILE, JSON.stringify({ groups: [] }, null, 2), 'utf8');
    }
    const raw = fs.readFileSync(GROUPS_FILE, 'utf8');
    const parsed = JSON.parse(raw || '{}');
    const savedGroups = Array.isArray(parsed.groups) ? parsed.groups : [];
    state.groups = savedGroups.map(normalizeGroup).filter(Boolean);
    for (const group of state.groups) {
      try { await groupChatsStore.upsertGroup(group); } catch {}
    }
  } catch (_err) {
    state.groups = [];
  }
  return state.groups;
};

const ensureLoaded = async () => {
  if (!state.loaded) await loadGroups();
};

const persistGroup = async (group) => {
  try {
    await groupChatsStore.upsertGroup(group);
  } catch (error) {
    console.warn('Failed to persist group chat to DB:', error?.message || error);
  }
};

const getExpiredSingleMemberGroups = (now = Date.now()) => {
  const timestamp = Number(now) || Date.now();
  return state.groups.filter((group) => isExpiredSingleMemberGroup(group, timestamp))
    .map((group) => ({ ...group, members: [...group.members] }));
};

const deleteExpiredSingleMemberGroup = (room, expectedSince, now = Date.now()) => {
  const normalized = normalizeString(room);
  const index = state.groups.findIndex((group) => group.room === normalized);
  if (index < 0) return null;
  const group = state.groups[index];
  const stillExpired = Number(group.singleMemberSince || 0) === Number(expectedSince || 0) &&
    isExpiredSingleMemberGroup(group, now);
  if (!stillExpired) return null;
  const [deleted] = state.groups.splice(index, 1);
  saveGroups();
  return deleted || null;
};

const generateRoomCode = () => {
  const existing = new Set(state.groups.map((group) => normalizeString(group.room)).filter(Boolean));
  let room = '';
  while (!room || existing.has(room)) {
    room = Array.from({ length: ROOM_CODE_LENGTH }, () => ROOM_CODE_CHARS.charAt(Math.floor(Math.random() * ROOM_CODE_CHARS.length))).join('');
  }
  return room;
};

const getGroups = async () => {
  await ensureLoaded();
  return state.groups.slice();
};

const getGroupsSync = () => state.groups.slice();

const getGroup = async (room) => {
  await ensureLoaded();
  const normalized = normalizeString(room);
  if (!normalized) return null;
  return state.groups.find((group) => group.room === normalized) || null;
};

const getGroupSync = (room) => {
  const normalized = normalizeString(room);
  if (!normalized) return null;
  return state.groups.find((group) => group.room === normalized) || null;
};

const getGroupsForUser = async (username) => {
  await ensureLoaded();
  const normalizedUsername = normalizeString(username);
  if (!normalizedUsername) return [];
  return state.groups.filter((group) =>
    Array.isArray(group.members) &&
    group.members.some((member) => normalizeString(member) === normalizedUsername)
  );
};

const assertGroupCapacity = (username) => {
  if (getGroupsForUser(username).length < MAX_GROUPS_PER_USER) return;
  const error = new Error(`You can only be in ${MAX_GROUPS_PER_USER} group chats. Leave one before joining or creating another.`);
  error.code = 'GROUP_LIMIT_REACHED';
  throw error;
};

const createGroup = async (name, username = '') => {
  await ensureLoaded();
  const creator = normalizeMember(username);
  if (creator) assertGroupCapacity(creator);
  const room = generateRoomCode();
  const now = Date.now();
  const group = normalizeGroup({ room, name, createdAt: now, creator, singleMemberSince: creator ? now : null, members: creator ? [creator] : [] });
  if (!group) return null;
  state.groups.unshift(group);
  saveGroups();
  await persistGroup(group);
  return group;
};

const joinGroup = async (room, username) => {
  await ensureLoaded();
  const normalized = normalizeString(room);
  if (!normalized) return null;
  const group = state.groups.find((item) => item.room === normalized);
  if (!group) return null;
  const normalizedUsername = normalizeMember(username);
  const memberExists = group.members.some((member) => normalizeString(member) === normalizeString(normalizedUsername));
  let changed = false;
  if (normalizedUsername && !memberExists) {
    assertGroupCapacity(normalizedUsername);
    group.members.push(normalizedUsername);
    group.singleMemberSince = group.members.length === 1 ? Date.now() : null;
    changed = true;
  }
  if (changed) {
    saveGroups();
    await persistGroup(group);
  }
  return group;
};

const leaveGroup = async (room, username) => {
  await ensureLoaded();
  const normalized = normalizeString(room);
  const normalizedUsername = normalizeString(username);
  if (!normalized || !normalizedUsername) return null;
  const groupIndex = state.groups.findIndex((item) => item.room === normalized);
  if (groupIndex < 0) return null;
  const group = state.groups[groupIndex];
  const before = group.members.length;
  group.members = group.members.filter((member) => normalizeString(member) !== normalizedUsername);
  if (group.members.length !== before) {
    group.singleMemberSince = group.members.length === 1 ? Date.now() : null;
    saveGroups();
    await persistGroup(group);
  }
  return group;
};

const updateGroup = async (room, updates = {}) => {
  await ensureLoaded();
  const normalized = normalizeString(room);
  if (!normalized) return null;
  const group = state.groups.find((item) => item.room === normalized);
  if (!group) return null;
  if (typeof updates.name === 'string') {
    const name = String(updates.name || '').trim();
    if (name) group.name = name;
  }
  if (typeof updates.icon === 'string') {
    group.icon = String(updates.icon || '').trim().slice(0, 4);
  }
  saveGroups();
  await persistGroup(group);
  return group;
};

const regenerateRoomCode = async (room) => {
  await ensureLoaded();
  const normalized = normalizeString(room);
  if (!normalized) return null;
  const group = state.groups.find((item) => item.room === normalized);
  if (!group) return null;
  group.room = generateRoomCode();
  saveGroups();
  await persistGroup(group);
  return group;
};

const deleteGroup = async (room) => {
  await ensureLoaded();
  const normalized = normalizeString(room);
  if (!normalized) return null;
  const index = state.groups.findIndex((item) => item.room === normalized);
  if (index < 0) return null;
  const [deleted] = state.groups.splice(index, 1);
  saveGroups();
  try { await groupChatsStore.deleteGroupRow(normalized); } catch {}
  return deleted || null;
};

state.loaded = false;

void loadGroups();

module.exports = {
  getGroups,
  getGroupsSync,
  getGroupsForUser,
  getGroup,
  getGroupSync,
  createGroup,
  joinGroup,
  leaveGroup,
  updateGroup,
  regenerateRoomCode,
  deleteGroup,
  getExpiredSingleMemberGroups,
  deleteExpiredSingleMemberGroup,
  isExpiredSingleMemberGroup,
  MAX_GROUPS_PER_USER,
  SINGLE_MEMBER_MAX_MS
};
