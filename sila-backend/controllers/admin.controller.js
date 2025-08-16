const mongoose = require('mongoose');
const User = require('../models/user.model');
const Blog = require('../models/blog.model');

// Debug route - Mevcut verileri kontrol et
exports.debugData = async (req, res) => {
  try {
    console.log('Debug: Fetching all data...');
    
    const users = await mongoose.connection.db.collection('users').find({}).toArray();
    const posts = await mongoose.connection.db.collection('blogs').find({}).toArray();
    
    console.log('Debug: Found data:', {
      users: users.length,
      posts: posts.length
    });

    res.json({
      users,
      posts
    });
  } catch (error) {
    console.error('Debug data error:', error);
    res.status(500).json({ 
      message: 'Veriler alınırken bir hata oluştu',
      error: error.message 
    });
  }
};

// Admin istatistiklerini getir
exports.getStats = async (req, res) => {
  try {
    console.log('Fetching admin stats...');
    
    // Kullanıcı istatistikleri
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: 'active' });
    const adminUsers = await User.countDocuments({ role: 'admin' });
    
    console.log('User stats:', { totalUsers, activeUsers, adminUsers });
    
    // Blog istatistikleri
    const totalBlogs = await Blog.countDocuments();
    console.log('Blog stats:', { totalBlogs });
    
    // Yorum istatistikleri
    const blogs = await Blog.find();
    const totalComments = blogs.reduce((acc, blog) => acc + (blog.comments ? blog.comments.length : 0), 0);
    console.log('Comment stats:', { totalComments });
    
    const stats = {
      totalUsers,
      totalBlogs,
      totalComments,
      activeUsers,
      adminUsers
    };
    
    console.log('Final stats:', stats);
    res.json(stats);
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Tüm kullanıcıları getir
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user role
exports.updateUserRole = async (req, res) => {
  try {
    console.log('Updating user role:', req.params.id, req.body.role);
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }

    // Update user role
    user.role = req.body.role;
    await user.save();

    console.log('User role updated successfully:', user);
    res.json({ message: 'Kullanıcı rolü güncellendi', user });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Kullanıcı sil
exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    await User.findByIdAndDelete(userId);
    res.json({ message: 'Kullanıcı silindi' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Tüm blog yazılarını getir
exports.getAllBlogs = async (req, res) => {
  try {
    console.log('Fetching all blogs...');
    
    const blogs = await Blog.find()
      .populate('author', 'username')
      .sort({ createdAt: -1 });
    
    console.log('Found blogs:', blogs.length);
    console.log('First blog sample:', blogs[0]);
    
    res.json(blogs);
  } catch (error) {
    console.error('Get all blogs error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Blog yazısı sil
exports.deleteBlog = async (req, res) => {
  try {
    const { blogId } = req.params;
    await Blog.findByIdAndDelete(blogId);
    res.json({ message: 'Blog yazısı silindi' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 