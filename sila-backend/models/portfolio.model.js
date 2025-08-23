const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Web', 'Mobile', 'Desktop', 'AI', 'Other']
  },
  technologies: [{
    type: String,
    required: false,
    default: [] 
  }],
  image: {
    type: String,
    required: false,
    trim: true
  },
  images: {
    type: [String],
    default: [],
  },
  featured: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Güncelleme yapıldığında updatedAt alanını güncelle
portfolioSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Portfolio = mongoose.model('Portfolio', portfolioSchema);

module.exports = Portfolio; 