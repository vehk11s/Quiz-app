const Game = require('../models/gameModel');
const Question = require('../models/questionModel');

// GET top games

// POST new game
exports.add_game = async function (req, res) {
  let { player, score, difficulty, category } = req.body;

  const gameQuestions = await Question.find({ category: category });

  const newGame = new Game({
    player,
    score,
    difficulty,
    category,
  });

  for (question of gameQuestions) {
    newGame.questions.push(question.id);
  }

  res.json(newGame);

  /*   newGame.save().then((saved) => {
    res.json(saved);
  }); */
};

// EDIT

// DELETE
