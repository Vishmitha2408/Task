const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');
const roles = require('../middleware/roles');

// ----------- AGENTS CRUD (Admin only) ------------

// Get all agents
router.get('/agents', auth, roles('admin'), async (req, res) => {
  const agents = await User.find({ role: 'agent' });
  res.json(agents);
});

// Create agent
router.post('/agents', auth, roles('admin'), async (req, res) => {
  try {
    const { name, email, password, mobile } = req.body;
    if (!name || !email || !password || !mobile)
      return res.status(400).json({ message: 'All fields are required.' });
    const agent = new User({ name, email, password, mobile, role: 'agent' });
    await agent.save();
    res.status(201).json(agent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update agent
router.put('/agents/:id', auth, roles('admin'), async (req, res) => {
  const { name, email, mobile, password } = req.body;
  const update = { name, email, mobile };
  if (password) update.password = password;
  try {
    const agent = await User.findOne({ _id: req.params.id, role: 'agent' });
    if (!agent) return res.status(404).json({ message: 'Agent not found' });
    Object.assign(agent, update);
    await agent.save();
    res.json(agent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete agent
router.delete('/agents/:id', auth, roles('admin'), async (req, res) => {
  await User.deleteOne({ _id: req.params.id, role: 'agent' });
  res.json({ message: 'Agent deleted' });
});

// ----------- SUBAGENTS CRUD (Admin or Agent) ------------

// Get subagents
router.get('/subagents', auth, roles(['admin', 'agent']), async (req, res) => {
  let filter = {};
  if (req.user.role === 'agent') filter = { manager: req.user._id, role: 'subagent' };
  else if (req.user.role === 'admin' && req.query.agentId) filter = { manager: req.query.agentId, role: 'subagent' };
  else filter = { role: 'subagent' };
  const subagents = await User.find(filter);
  res.json(subagents);
});

// Create subagent
router.post('/subagents', auth, roles(['admin', 'agent']), async (req, res) => {
  try {
    const { name, email, password, mobile, manager } = req.body;
    // Admin can specify manager, Agent always assigns self
    const managerId = req.user.role === 'admin' ? manager : req.user._id;
    if (!name || !email || !password || !mobile)
      return res.status(400).json({ message: 'All fields are required.' });
    const user = new User({ name, email, password, mobile, role: 'subagent', manager: managerId });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update subagent
router.put('/subagents/:id', auth, roles(['admin', 'agent']), async (req, res) => {
  const { name, email, mobile, password, manager } = req.body;
  const update = { name, email, mobile };
  if (manager) update.manager = manager;
  if (password) update.password = password;
  try {
    let subagent;
    if (req.user.role === 'admin') {
      subagent = await User.findOne({ _id: req.params.id, role: 'subagent' });
    } else {
      // Agents can only update their own subagents
      subagent = await User.findOne({ _id: req.params.id, role: 'subagent', manager: req.user._id });
    }
    if (!subagent) return res.status(404).json({ message: 'Subagent not found' });
    Object.assign(subagent, update);
    await subagent.save();
    res.json(subagent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete subagent
router.delete('/subagents/:id', auth, roles(['admin', 'agent']), async (req, res) => {
  let filter = { _id: req.params.id, role: 'subagent' };
  if (req.user.role === 'agent') filter.manager = req.user._id;
  const deleted = await User.deleteOne(filter);
  if (deleted.deletedCount === 0) return res.status(404).json({ message: 'Subagent not found' });
  res.json({ message: 'Subagent deleted' });
});

module.exports = router;