const mongoose = require('mongoose');
const User = require('../models/user.model');
require('dotenv').config();

const makeAdmin = async () => {
  try {
    // MongoDB bağlantısı
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB bağlantısı başarılı');

    // Kullanıcı email'ini al
    const email = process.argv[2];
    if (!email) {
      console.error('Lütfen bir email adresi girin');
      process.exit(1);
    }

    // Kullanıcıyı bul ve güncelle
    const user = await User.findOne({ email });
    if (!user) {
      console.error('Kullanıcı bulunamadı');
      process.exit(1);
    }

    user.role = 'admin';
    await user.save();

    console.log(`${email} adresli kullanıcı admin yapıldı`);
    process.exit(0);
  } catch (error) {
    console.error('Hata:', error);
    process.exit(1);
  }
};

makeAdmin(); 