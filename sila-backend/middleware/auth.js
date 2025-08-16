const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const auth = async (req, res, next) => {
  try {
    console.log('Auth middleware - Headers:', req.headers);
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      console.log('No token found');
      return res.status(401).json({ message: 'Yetkilendirme token\'ı bulunamadı' });
    }

    console.log('Verifying token...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decoded:', decoded);

    const user = await User.findById(decoded.userId);
    if (!user) {
      console.log('User not found for token');
      return res.status(401).json({ message: 'Geçersiz token' });
    }

    console.log('User found:', {
      id: user._id,
      username: user.username,
      role: user.role
    });

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Lütfen giriş yapın' });
  }
};

module.exports = auth; 