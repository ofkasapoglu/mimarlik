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

// Dosya yükleme endpoint'i - sadece auth middleware kullan
router.post('/', authMiddleware, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Dosya yüklenmedi' });
    }
    // Cloudinary'den dönen bilgiler
    res.json({
      message: 'Dosya başarıyla Cloudinary\'ye yüklendi',
      imageUrl: req.file.url, // Cloudinary'nin gerçek URL'si
      public_id: req.file.filename,
      format: req.file.format,
      folder: 'sila-projects',
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