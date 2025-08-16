const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'Bu email adresi zaten kullanılıyor' });
    }

    // Create new user
    user = new User({
      username,
      email,
      password
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    // Create token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Geçersiz email veya şifre' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Geçersiz email veya şifre' });
    }

    // Create token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update profile
exports.updateProfile = async (req, res) => {
  try {
    const { username, email } = req.body;
    const user = await User.findById(req.user.id);

    if (username) user.username = username;
    if (email) user.email = email;

    await user.save();
    res.json({ message: 'Profil güncellendi', user });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update user role
exports.updateRole = async (req, res) => {
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
    console.error('Update role error:', error);
    res.status(500).json({ message: error.message });
  }
}; 