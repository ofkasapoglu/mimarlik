const mongoose = require('mongoose');
const User = require('../models/user.model');
const Post = require('../models/post.model');
const Comment = require('../models/comment.model');
require('dotenv').config();

const createSampleData = async () => {
  try {
    // MongoDB bağlantısı
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sila-blog');
    console.log('MongoDB bağlantısı başarılı');

    // Örnek kullanıcılar
    const user1 = new User({
      username: 'user1',
      email: 'user1@example.com',
      password: 'password123',
      role: 'user'
    });

    const user2 = new User({
      username: 'user2',
      email: 'user2@example.com',
      password: 'password123',
      role: 'user'
    });

    await Promise.all([user1.save(), user2.save()]);
    console.log('Örnek kullanıcılar oluşturuldu');

    // Örnek blog yazısı
    const post = new Post({
      title: 'İlk Blog Yazısı',
      content: 'Bu bir örnek blog yazısıdır.',
      author: user1._id,
      tags: ['blog', 'örnek'],
      status: 'published'
    });

    await post.save();
    console.log('Örnek blog yazısı oluşturuldu');

    // Örnek yorum
    const comment = new Comment({
      content: 'Harika bir yazı olmuş!',
      author: user2._id,
      post: post._id,
      status: 'approved'
    });

    await comment.save();
    console.log('Örnek yorum oluşturuldu');

    console.log('Tüm örnek veriler başarıyla oluşturuldu');

  } catch (error) {
    console.error('Hata:', error);
  } finally {
    await mongoose.connection.close();
  }
};

createSampleData(); 