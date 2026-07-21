const express = require('express')
const router = express.Router()
const {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  getMyBlogs,
} = require('../controllers/blogController')
const protect = require('../middleware/authMiddleware')

router.get('/', getAllBlogs)
router.get('/my/posts', protect, getMyBlogs)
router.get('/:id', getBlogById)
router.post('/', protect, createBlog)
router.put('/:id', protect, updateBlog)
router.delete('/:id', protect, deleteBlog)

module.exports = router