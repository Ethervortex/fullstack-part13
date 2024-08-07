const router = require('express').Router()
const { User, Blog } = require('../models')

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: ['title', 'url', 'author', 'likes']
    }
  })
  res.json(users)
})

router.post('/', async (req, res) => {
  const user = await User.create(req.body)
  res.json(user)
})

router.get('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id, {
    attributes: {
      exclude: [
        'id', 
        'createdAt', 
        'updatedAt'
      ]
    },
    include: {
      model: Blog,
      as: 'readings',
      attributes: {
        exclude: [
          'userId', 
          'blogId', 
          'createdAt', 
          'updatedAt'
        ]
      },
      through: {
        attributes: ['read', 'id'],
        as: 'readinglists'
      }
    }
  })
  if (user) {
    /*
    const userWithoutSensitiveData = {
      name: user.name,
      username: user.username,
      readings: user.readings.map(reading => ({
        id: reading.id,
        url: reading.url,
        title: reading.title,
        author: reading.author,
        likes: reading.likes,
        year: reading.year
      }))
    }
    res.json(userWithoutSensitiveData)
    */
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