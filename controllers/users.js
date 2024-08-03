const router = require('express').Router()

const { User } = require('../models')

router.get('/', async (req, res) => {
  const users = await User.findAll()
  res.json(users)
})

router.post('/', async (req, res) => {
  const user = await User.create(req.body)
  res.json(user)
})

router.get('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id)
  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
})
router.put('/:username', async (req, res) => {
    const { username } = req.params
    const { newUsername } = req.body
    const user = await User.findOne({
      where: { username: username }
    })
  
    if (user) {
      user.username = newUsername
      await user.save()
      res.json(user)
    } else {
      res.status(404).json({ error: 'User not found' })
    }
})

module.exports = router