const express = require('express');
const router = express.Router();
const Log = require('../models/Log.js');
const { protect } = require('../middleware/auth.middleware.js');

// @desc    Get logs
// @route   GET /api/logs
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const logs = await Log.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(20);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Create a log entry
// @route   POST /api/logs
// @access  Private
router.post('/', protect, async (req, res) => {
  const { objectName, confidence } = req.body;

  if (!objectName || !confidence) {
    return res.status(400).json({ message: 'Please provide object name and confidence' });
  }

  try {
    const log = new Log({
      user: req.user._id,
      objectName,
      confidence,
    });

    const createdLog = await log.save();
    res.status(201).json(createdLog);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
