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

router.put('/:id', tokenExtractor, async (req, res) => {
  const { id } = req.params
  const { read } = req.body
  const userId = req.decodedToken.id
  const entry = await ReadingList.findByPk(id)

  if (!entry) {
    return res.status(404).json({ error: 'Entry not found' })
  }
  if (entry.userId !== userId) {
    return res.status(403).json({ error: 'Not allowed' })
  }
  entry.read = read
  await entry.save()
  res.status(200).json(entry)
})

module.exports = router;