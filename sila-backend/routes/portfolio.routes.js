const express = require('express');
const router = express.Router();
const Portfolio = require('../models/portfolio.model');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Tüm projeleri getir
router.get('/', async (req, res) => {
  try {
    const projects = await Portfolio.find().sort({ createdAt: -1 });
    console.log('Fetched projects:', projects.length);
    projects.forEach(project => {
      console.log('Project:', {
        id: project._id,
        title: project.title,
        image: project.image,
        category: project.category
      });
    });
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
    if (!project) {
      return res.status(404).json({ message: 'Proje bulunamadı' });
    }
    res.json(project);
  } catch (error) {
    console.error('Get project error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Geçersiz proje ID\'si' });
    }
    res.status(500).json({ message: 'Proje yüklenirken bir hata oluştu' });
  }
});

// Yeni proje ekle
router.post('/', [auth, admin], async (req, res) => {
  try {
    const project = new Portfolio({
      title: req.body.title,
      description: req.body.description,
      image: req.body.image,
      images: req.body.images || [],
      technologies: req.body.technologies,
      category: req.body.category,
      featured: req.body.featured
    });

    const newProject = await project.save();
    res.status(201).json(newProject);
  } catch (error) {
    console.error('Create project error:', error);
    res.status(400).json({ message: error.message });
  }
});

// Proje güncelle
router.put('/:id', [auth, admin], async (req, res) => {
  try {
    const project = await Portfolio.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Proje bulunamadı' });
    }

    project.title = req.body.title || project.title;
    project.description = req.body.description || project.description;
    project.image = req.body.image || project.image;
    project.technologies = req.body.technologies || project.technologies;
    project.images = req.body.images || project.images;
    project.category = req.body.category || project.category;
    project.featured = req.body.featured !== undefined ? req.body.featured : project.featured;

    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (error) {
    console.error('Update project error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Geçersiz proje ID\'si' });
    }
    res.status(400).json({ message: error.message });
  }
});

// Proje sil
router.delete('/:id', [auth, admin], async (req, res) => {
  try {
    const project = await Portfolio.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Proje bulunamadı' });
    }

    await project.deleteOne();
    res.json({ message: 'Proje başarıyla silindi' });
  } catch (error) {
    console.error('Delete project error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Geçersiz proje ID\'si' });
    }
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 