const mongoose = require('mongoose');

const logSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  objectName: {
    type: String,
    required: true,
  },
  confidence: {
    type: Number,
    required: true,
  },
}, {
  timestamps: true,
});

const Log = mongoose.model('Log', logSchema);
module.exports = Log;
