const express = require('express');
const router = express.Router();
const Visitor = require('../models/visitor.model');

// Ziyaretçi sayısını artır ve getir
router.get('/increment', async (req, res) => {
  try {
    // Tek bir ziyaretçi kaydı bul veya oluştur
    let visitor = await Visitor.findOne();
    
    if (!visitor) {
      visitor = new Visitor({ count: 0 });
    }
    
    // Sayacı artır
    visitor.count += 1;
    visitor.lastUpdated = new Date();
    
    // Kaydet
    await visitor.save();
    
    console.log('Ziyaretçi sayısı artırıldı:', visitor.count);
    res.json({ count: visitor.count });
  } catch (error) {
    console.error('Visitor increment error:', error);
    res.status(500).json({ message: 'Ziyaretçi sayısı güncellenirken bir hata oluştu' });
  }
});

// Ziyaretçi sayısını getir
router.get('/count', async (req, res) => {
  try {
    const visitor = await Visitor.findOne();
    const count = visitor ? visitor.count : 0;
    console.log('Mevcut ziyaretçi sayısı:', count);
    res.json({ count });
  } catch (error) {
    console.error('Visitor count error:', error);
    res.status(500).json({ message: 'Ziyaretçi sayısı alınırken bir hata oluştu' });
  }
});

module.exports = router; 