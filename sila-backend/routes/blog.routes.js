const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blog.controller');
const auth = require('../middleware/auth');

// Public routes
router.get('/', blogController.getAllBlogs);
router.get('/:id', blogController.getBlogById);

// Protected routes
router.post('/', auth, blogController.createBlog);
router.put('/:id', auth, blogController.updateBlog);
router.delete('/:id', auth, blogController.deleteBlog);
router.post('/:id/comments', auth, blogController.addComment);
router.post('/:id/like', auth, blogController.toggleLike);

module.exports = router; 