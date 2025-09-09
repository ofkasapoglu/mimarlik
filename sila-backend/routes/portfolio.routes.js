const express = require('express');
const router = express.Router();
const Portfolio = require('../models/portfolio.model');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// Cloudinary storage ayarı
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'sila-projects', // Cloudinary klasörü
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});
const upload = multer({ storage });

// Tüm projeleri getir
router.get('/', async (req, res) => {
  try {
    const projects = await Portfolio.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    console.error('Get all projects error:', error);
    res.status(500).json({ message: 'Projeler yüklenirken bir hata oluştu' });
  }
});

// Tek bir projeyi getir
router.get('/:id', async (req, res) => {
  try {
    const project = await Portfolio.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Proje bulunamadı' });
    res.json(project);
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ message: 'Proje yüklenirken bir hata oluştu' });
  }
});

// Yardımcı: images/technologies alanlarını normalize et
function normalizeStringOrArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean).map(v => String(v).trim()).filter(Boolean);
  // String ise newline veya virgül ile ayrılmış olabilir
  return String(value)
    .split(/\r?\n|,/)
    .map(v => v.trim())
    .filter(Boolean);
}

// Yeni proje ekle (hem JSON URL'leri hem de dosya upload destekli)
router.post('/', [auth, admin, upload.single('image')], async (req, res) => {
  try {
    const imageFromUpload = req.file ? req.file.path : undefined;
    const imageFromBody = req.body.image ? String(req.body.image) : undefined;
    const image = imageFromUpload || imageFromBody || '';

    const images = normalizeStringOrArray(req.body.images);
    const technologies = normalizeStringOrArray(req.body.technologies);

    const project = new Portfolio({
      title: req.body.title,
      description: req.body.description,
      image,
      images,
      technologies,
      category: req.body.category,
      featured: req.body.featured === 'true' || req.body.featured === true,
    });

    const newProject = await project.save();
    res.status(201).json(newProject);
  } catch (error) {
    console.error('Create project error:', error);
    res.status(400).json({ message: error.message });
  }
});

// Proje güncelle (hem JSON URL'leri hem de dosya upload destekli)
router.put('/:id', [auth, admin, upload.single('image')], async (req, res) => {
  try {
    const project = await Portfolio.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Proje bulunamadı' });

    const imageFromUpload = req.file ? req.file.path : undefined;
    const imageFromBody = req.body.image ? String(req.body.image) : undefined;

    project.title = req.body.title || project.title;
    project.description = req.body.description || project.description;
    project.image = imageFromUpload || imageFromBody || project.image; // Yeni resim varsa değiştir
    const technologies = normalizeStringOrArray(req.body.technologies);
    if (technologies.length > 0) project.technologies = technologies;
    const images = normalizeStringOrArray(req.body.images);
    if (images.length > 0) project.images = images;
    project.category = req.body.category || project.category;
    if (req.body.featured !== undefined) {
      project.featured = req.body.featured === 'true' || req.body.featured === true;
    }

    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (error) {
    console.error('Update project error:', error);
    res.status(400).json({ message: error.message });
  }
});

// Proje sil
router.delete('/:id', [auth, admin], async (req, res) => {
  try {
    const project = await Portfolio.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Proje bulunamadı' });

    await project.deleteOne();
    res.json({ message: 'Proje başarıyla silindi' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
