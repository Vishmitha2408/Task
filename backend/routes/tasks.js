const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const User = require('../models/User');
const auth = require('../middleware/auth');
const roles = require('../middleware/roles');

// Admin: create task for any agent/subagent
router.post('/', auth, roles('admin'), async (req, res) => {
  try {
    const { title, description, assignedTo, dueDate } = req.body;
    const task = new Task({
      title, description, assignedTo, dueDate,
      createdBy: req.user._id,
    });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Agent: assign task to subagent
router.post('/assign', auth, roles('agent'), async (req, res) => {
  const { title, description, assignedTo, dueDate } = req.body;
  // Ensure assignedTo is a subagent managed by this agent
  const subagent = await User.findOne({ _id: assignedTo, manager: req.user._id, role: 'subagent' });
  if (!subagent) return res.status(403).json({ message: 'Not your subagent' });
  const task = new Task({
    title, description, assignedTo, dueDate,
    createdBy: req.user._id,
  });
  await task.save();
  res.status(201).json(task);
});

// Get all tasks (admin)
router.get('/', auth, roles('admin'), async (req, res) => {
  const tasks = await Task.find().populate('assignedTo', 'name email role').populate('createdBy', 'name');
  res.json(tasks);
});

// Get tasks assigned to logged in user (agent, subagent)
router.get('/my', auth, roles(['agent', 'subagent']), async (req, res) => {
  const tasks = await Task.find({ assignedTo: req.user._id }).populate('createdBy', 'name');
  res.json(tasks);
});

// Agent: get tasks for subagents managed by agent
router.get('/subagents', auth, roles('agent'), async (req, res) => {
  // Find subagents managed by this agent
  const subagents = await User.find({ manager: req.user._id, role: 'subagent' });
  const subagentIds = subagents.map(s => s._id);
  const tasks = await Task.find({ assignedTo: { $in: subagentIds } }).populate('assignedTo', 'name');
  res.json(tasks);
});

// Update task status (agent, subagent)
router.patch('/:id/status', auth, roles(['agent', 'subagent']), async (req, res) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, assignedTo: req.user._id },
    { status: req.body.status, updatedAt: Date.now() },
    { new: true }
  );
  if (!task) return res.status(404).json({ message: 'Task not found' });
  res.json(task);
});

module.exports = router;