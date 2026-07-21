const Blog = require('../models/Blog')
const User = require('../models/User')

// GET /api/blogs  (public — only published)
exports.getAllBlogs = async (req, res) => {
  try {
    const { category, search } = req.query
    const { Op } = require('sequelize')

    const where = { status: 'published' }
    if (category && category !== 'All') where.category = category
    if (search) {
      where.title = { [Op.like]: `%${search}%` }
    }

    const blogs = await Blog.findAll({
      where,
      include: [{ model: User, attributes: ['id', 'name'] }],
      order: [['createdAt', 'DESC']],
    })

    res.json(blogs)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// GET /api/blogs/:id  (public)
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id, {
      include: [{ model: User, attributes: ['id', 'name'] }],
    })
    if (!blog) return res.status(404).json({ message: 'Blog not found' })
    res.json(blog)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// POST /api/blogs  (protected)
exports.createBlog = async (req, res) => {
  try {
    const { title, content, category, image, excerpt, readTime, status } = req.body

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' })
    }

    const blog = await Blog.create({
      title,
      content,
      category: category || 'Essay',
      image,
      excerpt: excerpt || content.slice(0, 150),
      readTime: readTime || `${Math.max(1, Math.round(content.split(' ').length / 200))} min read`,
      status: status || 'published',
      userId: req.user.id,
    })

    res.status(201).json(blog)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// PUT /api/blogs/:id  (protected — only owner)
exports.updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id)
    if (!blog) return res.status(404).json({ message: 'Blog not found' })

    if (blog.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to edit this blog' })
    }

    await blog.update(req.body)
    res.json(blog)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// DELETE /api/blogs/:id  (protected — only owner)
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id)
    if (!blog) return res.status(404).json({ message: 'Blog not found' })

    if (blog.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this blog' })
    }

    await blog.destroy()
    res.json({ message: 'Blog deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// GET /api/blogs/my/posts  (protected — logged-in user's own posts, incl. drafts)
exports.getMyBlogs = async (req, res) => {
  try {
    const blogs = await Blog.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
    })
    res.json(blogs)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}