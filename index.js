const express = require('express');
const app = express();
const { Joke } = require('./db');
const { Op } = require("sequelize");

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/jokes', async (req, res, next) => {
  try {
    // TODO - filter the jokes by tags and content
    const where = {};
    if (req.query.tags) {
      where.tags = {
        [Op.like]: `%${req.query.tags}%`,
      };
    }
    if (req.query.content) {
      where.joke = {
        [Op.like]: `%${req.query.content}%`,
      };
    }

    const jokes = await Joke.findAll({where});
    
    res.send(jokes);
  } catch (error) {
    console.error(error);
    next(error)
  }
});

// we export the app, not listening in here, so that we can run tests
module.exports = app;
