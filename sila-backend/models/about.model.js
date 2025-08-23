const mongoose = require('mongoose');

const aboutSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  description: { type: String },
  mission: { type: String },
  vision: { type: String },
  values: [String],
  services: [
    {
      title: String,
      description: String
    }
  ],
  contactInfo: {
    address: String,
    phone: String,
    email: String,
    workingHours: String
  }
}, { timestamps: true });

module.exports = mongoose.model('About', aboutSchema);
