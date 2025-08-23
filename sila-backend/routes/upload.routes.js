const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

// Uploads klasörünü oluştur (eğer yoksa)
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

console.log('Uploads directory:', uploadsDir);

// Multer konfigürasyonu
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log('Saving file to:', uploadsDir);
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // Benzersiz dosya adı oluştur
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const filename = 'project-' + uniqueSuffix + ext;
    console.log('Generated filename:', filename);
    cb(null, filename);
  }
});

// Dosya filtreleme
const fileFilter = (req, file, cb) => {
  console.log('File filter - mimetype:', file.mimetype);
  // Sadece resim dosyalarını kabul et
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Sadece resim dosyaları yüklenebilir!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit
  }
});

// Test endpoint'i
router.get('/test', (req, res) => {
  res.json({ message: 'Upload route is working!' });
});

// Auth test endpoint'i
router.get('/auth-test', authMiddleware, (req, res) => {
  res.json({ message: 'Auth is working!', user: req.user.username });
});

// Tüm upload isteklerini logla (her POST isteğinde çalışır)
router.use((req, res, next) => {
  if (req.method === 'POST') {
    console.log('UPLOAD ROUTE: POST isteği alındı, path:', req.path);
  }
  next();
});

// Dosya yükleme endpoint'i - sadece auth middleware kullan
router.post('/', authMiddleware, upload.single('image'), (req, res) => {
  console.log('Upload request received');
  console.log('File:', req.file);
  console.log('Headers:', req.headers);
  
  try {
    if (!req.file) {
      console.log('No file uploaded');
      return res.status(400).json({ message: 'Dosya yüklenmedi' });
    }

    // Dosya URL'sini oluştur
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    console.log('Generated image URL:', imageUrl);
    
    res.json({
      message: 'Dosya başarıyla yüklendi',
      imageUrl: imageUrl,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Dosya yüklenirken bir hata oluştu' });
  }
});

// Hata yakalama middleware'i
router.use((error, req, res, next) => {
  console.error('Upload route error:', error);
  
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'Dosya boyutu 5MB\'dan küçük olmalıdır' });
    }
  }
  
  if (error.message === 'Sadece resim dosyaları yüklenebilir!') {
    return res.status(400).json({ message: error.message });
  }
  
  res.status(500).json({ message: 'Dosya yüklenirken bir hata oluştu' });
});

module.exports = router; 