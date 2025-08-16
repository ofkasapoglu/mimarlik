const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const auth = require('../middleware/auth');
const { isAdmin } = require('../middleware/isAdmin');

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Admin routes working!' });
});

// İstatistikler
router.get('/stats', auth, isAdmin, adminController.getStats);

// Kullanıcı listesi
router.get('/users', auth, isAdmin, adminController.getAllUsers);

// Blog listesi
router.get('/blogs', auth, isAdmin, (req, res) => {
  adminController.getAllBlogs(req, res);
});

// Kullanıcı rolü güncelleme
router.put('/users/:id/role', auth, isAdmin, adminController.updateUserRole);

// Kullanıcı silme
router.delete('/users/:id', auth, isAdmin, adminController.deleteUser);

module.exports = router; 