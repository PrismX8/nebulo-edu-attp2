const express = require('express');
const auth = require('../middleware/auth');
const groupChats = require('../services/groupChats');

const router = express.Router();

const getRequestUsername = (req) => String(req.user?.username || req.user?.name || '').trim();

router.get('/', auth, async (req, res) => {
  const username = getRequestUsername(req);
  const groups = username ? await groupChats.getGroupsForUser(username) : [];
  res.json({ groups, maxGroups: groupChats.MAX_GROUPS_PER_USER });
});

router.post('/', auth, async (req, res) => {
  const name = String(req.body?.name || '').trim();
  if (!name) {
    return res.status(400).json({ msg: 'Group name is required' });
  }
  const username = getRequestUsername(req);
  if (!username) {
    return res.status(400).json({ msg: 'Username required to create group' });
  }
  try {
    const group = await groupChats.createGroup(name, username);
    if (!group) return res.status(500).json({ msg: 'Failed to create group chat' });
    return res.json({ group });
  } catch (error) {
    if (error?.code === 'GROUP_LIMIT_REACHED') return res.status(409).json({ msg: error.message });
    return res.status(500).json({ msg: 'Failed to create group chat' });
  }
});

router.get('/:room', auth, async (req, res) => {
  const room = String(req.params.room || '').trim();
  // Validate room format - should be 5 lowercase letters
  if (!/^[a-z]{5}$/.test(room)) {
    return res.status(400).json({ msg: 'Invalid room format' });
  }
  const group = await groupChats.getGroup(room);
  if (!group) {
    return res.status(404).json({ msg: 'Group chat not found' });
  }
  return res.json({ group });
});

router.post('/:room/join', auth, async (req, res) => {
  const room = String(req.params.room || '').trim();
  // Validate room format - should be 5 lowercase letters
  if (!/^[a-z]{5}$/.test(room)) {
    return res.status(400).json({ msg: 'Invalid room format' });
  }
  const username = getRequestUsername(req);
  if (!username) {
    return res.status(400).json({ msg: 'Username required to join group' });
  }
  let group;
  try {
    group = await groupChats.joinGroup(room, username);
    if (!group) return res.status(404).json({ msg: 'Group chat not found' });
  } catch (error) {
    if (error?.code === 'GROUP_LIMIT_REACHED') return res.status(409).json({ msg: error.message });
    return res.status(500).json({ msg: 'Failed to join group chat' });
  }
  // Notify all group members about the membership change
  if (globalThis.__nebuloChatIo) {
    globalThis.__nebuloChatIo.to(room).emit('group_member_joined', {
      room,
      username,
      group: {
        room: group.room,
        name: group.name,
        members: group.members,
        createdAt: group.createdAt
      }
    });
  }
  return res.json({ group });
});

router.post('/:room/leave', auth, async (req, res) => {
  const room = String(req.params.room || '').trim();
  // Validate room format - should be 5 lowercase letters
  if (!/^[a-z]{5}$/.test(room)) {
    return res.status(400).json({ msg: 'Invalid room format' });
  }
  const username = getRequestUsername(req);
  if (!username) {
    return res.status(400).json({ msg: 'Username required to leave group' });
  }
  const group = await groupChats.leaveGroup(room, username);
  if (!group) {
    return res.status(404).json({ msg: 'Group chat not found' });
  }
  // Notify all group members about the membership change
  if (globalThis.__nebuloChatIo) {
    globalThis.__nebuloChatIo.to(room).emit('group_member_left', {
      room,
      username,
      group: {
        room: group.room,
        name: group.name,
        members: group.members,
        createdAt: group.createdAt
      }
    });
  }
  return res.json({ ok: true, group });
});

router.put('/:room', auth, async (req, res) => {
  const room = String(req.params.room || '').trim();
  if (!/^[a-z]{5}$/.test(room)) {
    return res.status(400).json({ msg: 'Invalid room format' });
  }
  const group = await groupChats.getGroup(room);
  if (!group) return res.status(404).json({ msg: 'Group chat not found' });
  const username = getRequestUsername(req).toLowerCase();
  const creator = String(group.creator || group.members?.[0] || '').trim().toLowerCase();
  const role = String(req.user?.role || '').toLowerCase();
  if (username !== creator && !['owner', 'admin'].includes(role)) {
    return res.status(403).json({ msg: 'Only the group creator or staff can edit this group' });
  }
  const updated = await groupChats.updateGroup(room, {
    name: req.body?.name,
    icon: req.body?.icon
  });
  if (globalThis.__nebuloChatIo && updated) {
    globalThis.__nebuloChatIo.to(updated.room).emit('group_updated', { group: updated });
  }
  return res.json({ group: updated });
});

router.post('/:room/regenerate-code', auth, async (req, res) => {
  const room = String(req.params.room || '').trim();
  if (!/^[a-z]{5}$/.test(room)) {
    return res.status(400).json({ msg: 'Invalid room format' });
  }
  const group = await groupChats.getGroup(room);
  if (!group) return res.status(404).json({ msg: 'Group chat not found' });
  const username = getRequestUsername(req).toLowerCase();
  const creator = String(group.creator || group.members?.[0] || '').trim().toLowerCase();
  const role = String(req.user?.role || '').toLowerCase();
  if (username !== creator && !['owner', 'admin'].includes(role)) {
    return res.status(403).json({ msg: 'Only the group creator or staff can regenerate the code' });
  }
  const updated = await groupChats.regenerateRoomCode(room);
  if (globalThis.__nebuloChatIo && updated) {
    globalThis.__nebuloChatIo.to(room).emit('group_updated', { group: updated, previousRoom: room });
  }
  return res.json({ group: updated, previousRoom: room });
});

module.exports = router;
