const Portfolio = require('../models/portfolio.model');

// Tüm portföy projelerini getir
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Portfolio.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Öne çıkan projeleri getir
exports.getFeaturedProjects = async (req, res) => {
  try {
    const projects = await Portfolio.find({ featured: true })
      .populate('author', 'username')
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Tek bir projeyi getir
exports.getProject = async (req, res) => {
  try {
    const project = await Portfolio.findById(req.params.id)
      .populate('author', 'username');
    
    if (!project) {
      return res.status(404).json({ message: 'Proje bulunamadı' });
    }
    
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Yeni proje ekle
exports.createProject = async (req, res) => {
  try {
    const project = new Portfolio(req.body);
    const savedProject = await project.save();
    res.status(201).json(savedProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Proje güncelle
exports.updateProject = async (req, res) => {
  try {
    const project = await Portfolio.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!project) {
      return res.status(404).json({ message: 'Proje bulunamadı' });
    }
    res.json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Proje sil
exports.deleteProject = async (req, res) => {
  try {
    const project = await Portfolio.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Proje bulunamadı' });
    }
    res.json({ message: 'Proje başarıyla silindi' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 