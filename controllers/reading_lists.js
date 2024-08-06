const router = require('express').Router()
const { ReadingList, Blog, User } = require('../models')
const { tokenExtractor } = require('../util/middleware')

router.post('/', tokenExtractor, async (req, res) => {
  const { blogId, userId } = req.body

  const user = await User.findByPk(userId)
  const blog = await Blog.findByPk(blogId)

  if (!user || !blog) {
    return res.status(400).json({ error: 'Invalid user or blog_id' })
  }

  const readingListAdd = await ReadingList.create({ userId, blogId })
  res.status(201).json(readingListAdd)
})

module.exports = router;