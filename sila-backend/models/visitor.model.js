const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  count: {
    type: Number,
    default: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, { collection: 'visitor' });

const Visitor = mongoose.model('Visitor', visitorSchema);

module.exports = Visitor; 