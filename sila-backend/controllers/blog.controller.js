const Blog = require('../models/blog.model');

// Tüm blog yazılarını getir
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate('author', 'username')
      .sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Tek bir blog yazısını getir
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('author', 'username')
      .populate('comments.user', 'username');
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog yazısı bulunamadı' });
    }
    
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Yeni blog yazısı oluştur
exports.createBlog = async (req, res) => {
  try {
    const blog = new Blog({
      title: req.body.title,
      content: req.body.content,
      author: req.user._id, // Auth middleware'den gelen user
      image: req.body.image,
      tags: req.body.tags
    });

    const savedBlog = await blog.save();
    res.status(201).json(savedBlog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Blog yazısını güncelle
exports.updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog yazısı bulunamadı' });
    }

    // Sadece yazar güncelleyebilir
    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Bu işlem için yetkiniz yok' });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        content: req.body.content,
        image: req.body.image,
        tags: req.body.tags
      },
      { new: true }
    );

    res.json(updatedBlog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Blog yazısını sil
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog yazısı bulunamadı' });
    }

    // Sadece yazar silebilir
    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Bu işlem için yetkiniz yok' });
    }

    await blog.deleteOne();
    res.json({ message: 'Blog yazısı silindi' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Yorum ekle (eski hali)
exports.addComment = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog yazısı bulunamadı' });
    }

    blog.comments.push({
      user: req.user._id,
      text: req.body.text,
      createdAt: new Date()
    });
    await blog.save();
    await blog.populate('author', 'username');
    await blog.populate('comments.user', 'username');
    res.json(blog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Beğeni ekle/kaldır
exports.toggleLike = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog yazısı bulunamadı' });
    }

    const likeIndex = blog.likes.indexOf(req.user._id);
    
    if (likeIndex === -1) {
      blog.likes.push(req.user._id);
    } else {
      blog.likes.splice(likeIndex, 1);
    }

    await blog.save();
    res.json(blog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}; 