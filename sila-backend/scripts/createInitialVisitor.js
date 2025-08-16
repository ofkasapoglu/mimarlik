const mongoose = require('mongoose');
const Visitor = require('../models/visitor.model');

const createInitialVisitor = async () => {
  try {
    // MongoDB bağlantısı
    await mongoose.connect('mongodb://localhost:27017/sila-blog', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    // Mevcut ziyaretçi kaydını kontrol et
    let visitor = await Visitor.findOne();
    
    if (!visitor) {
      // Yeni ziyaretçi kaydı oluştur
      visitor = new Visitor({
        count: 0,
        lastUpdated: new Date()
      });
      await visitor.save();
      console.log('İlk ziyaretçi kaydı oluşturuldu');
    } else {
      console.log('Ziyaretçi kaydı zaten mevcut');
    }

    // Bağlantıyı kapat
    await mongoose.connection.close();
  } catch (error) {
    console.error('Hata:', error);
  }
};

createInitialVisitor(); 