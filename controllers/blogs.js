const router = require('express').Router()

const { Blog } = require('../models')

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  next()
}

router.get('/', async (req, res) => {
    const blogs = await Blog.findAll()
    console.log(JSON.stringify(blogs, null, 2))
    res.json(blogs)
  })
  
router.post('/', async (req, res) => {
  console.log(req.body)
  try {
    const blog = await Blog.create(req.body)
    res.json(blog)
  } catch(error) {
    return res.status(400).json({ error })
  }
})

router.get('/:id', blogFinder, async (req, res) => {
  try {
    if (req.blog) {
      res.json(req.blog)
    } else {
      res.status(404).json({ error: 'Blog not found' })
    }
  } catch (error) {
    console.error('Error fetching blog:', error)
    res.status(500).json({ error: 'Error fetching blog' })
  }
})

router.put('/:id', blogFinder, async (req, res) => {
  try {
    if (req.blog) {
      const { likes } = req.body
      req.blog.likes = likes
      await req.blog.save()
      res.json(req.blog)
    } else {
      res.status(404).json({ error: 'Blog not found' })
    }
  } catch (error) {
    console.error('Error increasing likes:', error)
    res.status(500).json({ error: 'Error increasing likes' })
  }
})

router.delete('/:id', blogFinder, async (req, res) => {
  try {
    if (req.blog) {
      console.log(JSON.stringify(req.blog))
      await req.blog.destroy()
      res.status(204).end()
    } else {
      res.status(404).end()
    }
  } catch (error) {
    console.error('Error deleting blog:', error)
    res.status(500).json({ error: 'Error deleting blog' })
  }
})

module.exports = router