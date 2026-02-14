const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact.js');
const { protect } = require('../middleware/auth.middleware.js');

// @desc    Get all contacts
// @route   GET /api/contacts
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const contacts = await Contact.find({ user: req.user._id });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Create a contact
// @route   POST /api/contacts
// @access  Private
router.post('/', protect, async (req, res) => {
  const { name, phone } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ message: 'Please provide name and phone' });
  }

  try {
    const contact = new Contact({
      user: req.user._id,
      name,
      phone,
    });

    const createdContact = await contact.save();
    res.status(201).json(createdContact);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Delete a contact
// @route   DELETE /api/contacts/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (contact) {
      if (contact.user.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized' });
      }
      await Contact.deleteOne({ _id: req.params.id });
      res.json({ message: 'Contact removed' });
    } else {
      res.status(404).json({ message: 'Contact not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
