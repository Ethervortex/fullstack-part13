const jwt = require('jsonwebtoken')
const { SECRET } = require('./config.js')
const Session = require('../models/session')

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      const token = authorization.substring(7)
      req.decodedToken = jwt.verify(token, SECRET)
      console.log('Decoded token:', req.decodedToken)
      req.token = token
    } catch {
      return res.status(401).json({ error: 'token invalid' })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

const checkSession = async (req, res, next) => {
  if (!req.token) {
    return res.status(401).json({ error: 'token missing' })
  }

  try {
    const session = await Session.findOne({ where: { token: req.token } })
    
    if (!session) {
      return res.status(401).json({ error: 'Session not found' })
    }
    
    if (session.expired) {
      return res.status(401).json({ error: 'Session expired' })
    }

    req.session = session
    next()
  } catch (error) {
    return res.status(401).json({ error: 'Session invalid' })
  }
}

module.exports = { tokenExtractor, checkSession }