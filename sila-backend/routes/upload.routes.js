const express = require('express');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'sila-projects',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

const upload = multer({ storage });

// Test endpoint'i
router.get('/test', (req, res) => {
  res.json({ message: 'Upload route is working!' });
});

// Auth test endpoint'i
router.get('/auth-test', authMiddleware, (req, res) => {
  res.json({ message: 'Auth is working!', user: req.user.username });
});

// Dosya yükleme endpoint'i - sadece auth middleware kullan
router.post('/', authMiddleware, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Dosya yüklenmedi' });
    }
    // Cloudinary URL
    const imageUrl = req.file.path;
    res.json({
      message: 'Dosya başarıyla yüklendi',
      imageUrl: imageUrl,
      public_id: req.file.filename
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Dosya yüklenirken bir hata oluştu' });
  }
});

// Hata yakalama middleware'i
router.use((error, req, res, next) => {
  console.error('Upload route error:', error);
  res.status(500).json({ message: 'Dosya yüklenirken bir hata oluştu' });
});

module.exports = router;