const router = require('express').Router();
const { Blog } = require('../models');
const { fn, col, literal } = require('sequelize');

router.get('/', async (req, res) => {
  const authors = await Blog.findAll({
    attributes: [
      'author',
      [fn('COUNT', col('id')), 'articles'],
      [fn('SUM', col('likes')), 'likes']
    ],
    group: ['author'],
    order: [[literal('likes'), 'DESC']]
  });
  res.json(authors);
})

module.exports = router;