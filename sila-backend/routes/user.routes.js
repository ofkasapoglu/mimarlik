const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const auth = require('../middleware/auth');
const { isAdmin } = require('../middleware/isAdmin');

// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// Protected routes
router.get('/profile', auth, userController.getProfile);
router.put('/profile', auth, userController.updateProfile);
router.put('/:id/role', auth, isAdmin, userController.updateRole);

module.exports = router; 