const About = require('../models/about.model');

// Tek belgeyi getir (hakkımızda sayfası)
exports.getAbout = async (req, res) => {
  try {
    let about = await About.findOne();
    if (!about) {
      // Eğer yoksa varsayılan bir belge oluştur
      about = new About({
        companyName: 'Ceyhun Uzun Mimarlık',
        description: '',
        mission: '',
        vision: '',
        values: [],
        services: [],
        contactInfo: {}
      });
      await about.save();
    }
    res.json(about);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Hakkımızda güncelleme
exports.updateAbout = async (req, res) => {
  try {
    let about = await About.findOne();
    if (!about) {
      about = new About(req.body);
    } else {
      Object.assign(about, req.body);
    }
    const updated = await about.save();
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
