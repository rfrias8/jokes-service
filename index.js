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

app.post(
  "/jokes",
  [
    check("content").not().isEmpty().trim(),
    check("tags").not().isEmpty().trim(),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.send({ error: errors.array() });
      } else {
        const { content, tags } = req.body;
        // console.log(req.body);

        await Joke.create({ joke: content, tags: tags });

        const allJokes = await Joke.findAll();

        res.send(allJokes);
      }
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);

app.delete("/jokes/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const joke = await Joke.findByPk(id);
    await joke.destroy();

    const jokesLeft = await Joke.findAll();

    res.send(jokesLeft);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

app.get("/jokes/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const joke = await Joke.findByPk(id);

    if (joke == null) {
      throw new Error("Invalid request, joke requested is not available.");
    }

    res.send(joke);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

app.put("/jokes/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { content, tags } = req.body;
    const joke = await Joke.findByPk(id);

    const update = {};
    if (tags) update.tags = tags;
    if (content) update.joke = content;

    await joke.update({ ...update });

    res.send(joke);
  } catch (error) {
    console.error(error);
    next(error);
  }
});


// we export the app, not listening in here, so that we can run tests
module.exports = app;
