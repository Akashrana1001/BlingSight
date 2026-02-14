const mongoose = require('mongoose');

const contactSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

const Contact = mongoose.model('Contact', contactSchema);
module.exports = Contact;
