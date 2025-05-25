const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, mobile, role, manager } = req.body;
    const user = new User({ name, email, password, mobile, role, manager });
    await user.save();
    res.status(201).json({ message: 'User created. Please login.' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '7d' });
  res.json({ token, user: { _id: user._id, name: user.name, role: user.role, email: user.email } });
});

module.exports = router;