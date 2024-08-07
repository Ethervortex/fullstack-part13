const router = require('express').Router()
const { Blog, User } = require('../models')
const { Op } = require('sequelize')
const { tokenExtractor, checkSession } = require('../util/middleware')

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  if (!req.blog) {
    return res.status(404).json({ error: 'Blog not found' })
  }
  next()
}

router.get('/', async (req, res) => {
  const where = {}

  if (req.query.search) {
    where[Op.or] = [
      {
        title: {
          [Op.iLike]: `%${req.query.search}%`
        }
      },
      {
        author: {
          [Op.iLike]: `%${req.query.search}%`
        }
      }
    ];
  }

  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name']
    },
    where,
    order: [['likes', 'DESC']]
  })
  console.log(JSON.stringify(blogs, null, 2))
  res.json(blogs)
})
  
router.post('/', tokenExtractor, checkSession, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id)
  if (user.disabled) {
    return res.status(401).json({ error: 'User is disabled' })
  }
  const blog = await Blog.create({...req.body, userId: user.id, date: new Date()})
  res.json(blog)
})

router.get('/:id', blogFinder, async (req, res) => {
  res.json(req.blog)
})

router.put('/:id', blogFinder, async (req, res) => {
  const { likes } = req.body
  req.blog.likes = likes
  await req.blog.save()
  res.json(req.blog)
})

router.delete('/:id', tokenExtractor, checkSession, blogFinder, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id)
  if (user.disabled) {
    return res.status(401).json({ error: 'User is disabled' })
  }
  if (req.blog.userId !== req.decodedToken.id) {
    return res.status(403).json({ error: 'Delete denied' })
  }
  await req.blog.destroy()
  res.status(204).end()
})

module.exports = router