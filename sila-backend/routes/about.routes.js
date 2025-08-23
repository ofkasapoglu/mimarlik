const express = require('express');
const router = express.Router();
const aboutController = require('../controllers/about.controller');
const authMiddleware = require('../middleware/auth');

// GET: hakkımızda verisi
router.get('/', aboutController.getAbout);

// PUT: hakkımızda güncelleme (admin)
router.put('/', authMiddleware, aboutController.updateAbout);

module.exports = router;
