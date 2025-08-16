const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const auth = require('../middleware/auth');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes
router.get('/profile', auth, authController.getProfile);
router.put('/profile', auth, authController.updateProfile);
router.get('/me', auth, authController.getMe);
router.get('/check-admin', auth, authController.checkAdmin);

module.exports = router; 