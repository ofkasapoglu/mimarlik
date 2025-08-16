const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

// JWT_SECRET kontrolü
if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET is not defined in environment variables');
  process.exit(1);
}

// Kullanıcı kaydı
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Email ve kullanıcı adı kontrolü
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: 'Bu email veya kullanıcı adı zaten kullanımda' 
      });
    }

    const user = new User({
      username,
      email,
      password
    });

    await user.save();

    // Token oluştur
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(400).json({ message: error.message });
  }
};

// Kullanıcı girişi
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', { email }); // Email'i logla

    if (!email || !password) {
      console.log('Missing email or password');
      return res.status(400).json({ message: 'Email ve şifre gereklidir' });
    }

    // Kullanıcıyı bul
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email); // Kullanıcı bulunamadı logu
      return res.status(401).json({ message: 'Geçersiz email veya şifre' });
    }

    console.log('User found:', { 
      id: user._id,
      email: user.email,
      role: user.role 
    }); // Bulunan kullanıcı bilgilerini logla

    // Şifreyi kontrol et
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('Password mismatch for user:', email); // Şifre uyuşmazlığı logu
      return res.status(401).json({ message: 'Geçersiz email veya şifre' });
    }

    // Token oluştur
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('Login successful:', { 
      id: user._id,
      email: user.email,
      role: user.role 
    }); // Başarılı giriş logu

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      }
    });
  } catch (error) {
    console.error('Login error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(500).json({ 
      message: 'Giriş yapılırken bir hata oluştu',
      error: error.message 
    });
  }
};

// Kullanıcı profili
exports.getProfile = async (req, res) => {
  try {
    console.log('Getting profile for user:', req.user);
    
    if (!req.user || !req.user._id) {
      console.log('No user ID in request');
      return res.status(401).json({ message: 'Kullanıcı bilgisi bulunamadı' });
    }

    const user = await User.findById(req.user._id).select('-password');
    console.log('Found user:', user);

    if (!user) {
      console.log('User not found in database');
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Profil güncelleme
exports.updateProfile = async (req, res) => {
  try {
    console.log('Update profile request:', {
      userId: req.user._id,
      updates: req.body
    });

    const updates = Object.keys(req.body);
    const allowedUpdates = ['username', 'email', 'bio', 'avatar'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      console.log('Invalid update fields:', updates);
      return res.status(400).json({ message: 'Geçersiz güncelleme alanları' });
    }

    // Kullanıcıyı bul
    const user = await User.findById(req.user._id);
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }

    // Güncellemeleri uygula
    updates.forEach(update => {
      user[update] = req.body[update];
    });

    // Kullanıcıyı kaydet
    await user.save();
    console.log('Profile updated successfully');

    // Şifre hariç kullanıcı bilgilerini döndür
    const userResponse = {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      bio: user.bio,
      avatar: user.avatar,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    res.json(userResponse);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(400).json({ message: error.message });
  }
};

// Get current user
exports.getMe = async (req, res) => {
  try {
    console.log('GetMe - User from request:', req.user);
    
    if (!req.user) {
      console.log('No user in request');
      return res.status(401).json({ message: 'Kullanıcı bilgisi bulunamadı' });
    }

    // Şifreyi çıkararak kullanıcı bilgilerini döndür
    const userWithoutPassword = {
      _id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      role: req.user.role,
      avatar: req.user.avatar,
      bio: req.user.bio,
      createdAt: req.user.createdAt,
      updatedAt: req.user.updatedAt
    };

    console.log('Returning user data:', userWithoutPassword);
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('GetMe error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Check admin status
exports.checkAdmin = async (req, res) => {
  try {
    console.log('Checking admin status for user ID:', req.user._id);
    const user = await User.findById(req.user._id);
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }
    console.log('User found:', {
      id: user._id,
      email: user.email,
      role: user.role
    });
    const isAdmin = user.role === 'admin';
    console.log('Is admin?', isAdmin);
    res.json({ isAdmin });
  } catch (error) {
    console.error('Check admin status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 