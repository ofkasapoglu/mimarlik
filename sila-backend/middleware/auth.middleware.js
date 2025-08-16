const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Yetkilendirme token\'ı bulunamadı' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'Kullanıcı bulunamadı' });
    }

    req.user = { userId: user._id };
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Lütfen giriş yapın' });
  }
};

module.exports = auth; 