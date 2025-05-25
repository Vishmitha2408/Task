const express = require('express');
const router = express.Router();
const multer = require('multer');
const csv = require('csvtojson');
const xlsx = require('xlsx');
const User = require('../models/User');
const mongoose = require('mongoose');
const fs = require('fs');

// Model for storing distributed items
const DistributedItemSchema = new mongoose.Schema({
  agent: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [{ FirstName: String, Phone: String, Notes: String }]
});
const DistributedItem = mongoose.model('DistributedItem', DistributedItemSchema);

// Multer config
const upload = multer({ dest: 'uploads/' });

// Accept only csv, xlsx, xls
function allowedFile(file) {
  return (
    file.mimetype === 'text/csv' ||
    file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    file.mimetype === 'application/vnd.ms-excel'
  );
}

// Upload and distribute route
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file || !allowedFile(file))
      return res.status(400).json({ message: 'Only CSV/XLSX/XLS files are allowed.' });

    let items = [];
    if (file.mimetype === 'text/csv') {
      items = await csv().fromFile(file.path);
    } else {
      const workbook = xlsx.readFile(file.path);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      items = xlsx.utils.sheet_to_json(sheet);
    }
    // Remove file after processing
    fs.unlinkSync(file.path);

    // Validate columns
    if (
      !items.length ||
      !('FirstName' in items[0]) ||
      !('Phone' in items[0]) ||
      !('Notes' in items[0])
    ) {
      return res
        .status(400)
        .json({ message: 'Invalid format. Columns must be FirstName, Phone, Notes.' });
    }

    // Get 5 agents
    const agents = await User.find({ role: 'agent' }).limit(5);
    if (!agents.length)
      return res.status(400).json({ message: 'No agents found to distribute items.' });

    // Distribute items
    const distributed = Array(agents.length).fill().map(() => []);
    items.forEach((item, idx) => {
      distributed[idx % agents.length].push(item);
    });

    // Clear old distributed lists
    await DistributedItem.deleteMany({});
    // Save new lists
    for (let i = 0; i < agents.length; i++) {
      await DistributedItem.create({ agent: agents[i]._id, items: distributed[i] });
    }

    res.json({ message: 'Upload and distribution successful!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get distributed lists per agent
router.get('/distributed', async (req, res) => {
  const lists = await DistributedItem.find().populate('agent', 'name email');
  res.json(lists);
});

module.exports = router;