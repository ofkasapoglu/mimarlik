const mongoose = require('mongoose');
const User = require('../models/user.model');
require('dotenv').config();

const createAdmin = async () => {
  try {
    // MongoDB bağlantısı
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB bağlantısı başarılı');

    // Admin kullanıcısı oluştur
    const adminUser = new User({
      username: 'adminuser',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin'
    });

    await adminUser.save();
    console.log('Admin kullanıcısı başarıyla oluşturuldu');
    console.log('Email:', adminUser.email);
    console.log('Şifre: admin123');
    console.log('Role:', adminUser.role);
    process.exit(0);
  } catch (error) {
    console.error('Hata:', error);
    process.exit(1);
  }
};

createAdmin(); 