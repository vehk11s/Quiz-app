const Question = require('../models/questionModel');

// GET x amount of questions from category y

// GET single by id

// POST new question
exports.add_question = function (req, res) {
  let { question, type, options, explanation, hint, category } = req.body;

  const newQuestion = new Question({
    question,
    type,
    options,
    explanation,
    hint,
    category,
  });

  newQuestion.save().then((saved) => {
    res.json(saved);
  });
};

// EDIT

// DELETE
