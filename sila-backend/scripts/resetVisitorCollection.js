const mongoose = require('mongoose');

const resetVisitorCollection = async () => {
  try {
    // MongoDB bağlantısı
    await mongoose.connect('mongodb://localhost:27017/sila-blog', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    // Eski koleksiyonu sil
    await mongoose.connection.db.collection('visitors').drop().catch(() => {
      console.log('visitors koleksiyonu zaten yok');
    });

    // Yeni koleksiyonu oluştur
    await mongoose.connection.db.createCollection('visitor');
    
    // İlk kaydı ekle
    await mongoose.connection.db.collection('visitor').insertOne({
      count: 0,
      lastUpdated: new Date()
    });

    console.log('Ziyaretçi koleksiyonu sıfırlandı ve ilk kayıt eklendi');

    // Bağlantıyı kapat
    await mongoose.connection.close();
  } catch (error) {
    console.error('Hata:', error);
  }
};

resetVisitorCollection(); 