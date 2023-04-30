const mongoose = require('mongoose');
const Question = require('../models/questionModel');

// GET 10 questions of given category
// TODO: Set question limit to 10 after database is ready
exports.get_questions = async function (req, res) {
  let categoryId = new mongoose.Types.ObjectId(req.query.category);

  Question.find({ category: categoryId })
    .populate('category')
    .limit(10)
    .then((result) => {
      if (result.length < 5) {
        res.status(418).send('Too few questions');
      } else {
        res.status(200).json(result);
      }
    })
    .catch((err) => {
      res.send(err);
    });
};

// GET single by id
exports.get_question = function (req, res) {
  let questionId = new mongoose.Types.ObjectId(req.params.id);

  Question.findById(questionId)
    .populate('category')
    .then((result) => {
      if (result === null) {
        res.status(418).send('Question not found');
      } else {
        res.status(200).json(result);
      }
    })
    .catch((err) => {
      res.send(err);
    });
};

// POST new question
// TODO: Validation
exports.add_question = async function (req, res) {
  category = new mongoose.Types.ObjectId(req.body.category);

  // Prevents additional documents from being inserted if one fails
  const insertOptions = { ordered: true };

  await Question.insertMany(req.body, insertOptions)
    .then((saved) => res.json(saved))
    .catch((error) => res.send(error));
};

// EDIT
// TODO: Update options by id
exports.edit_question = function (req, res) {
  let questionId = new mongoose.Types.ObjectId(req.params.id);
  let { question, type, explanation, hint, category } = req.body;

  Question.findByIdAndUpdate(
    questionId,
    {
      $set: { question, type, explanation, hint, category },
    },
    { new: true }
  ).then((updatedQuestion) => {
    res.json(updatedQuestion);
  });
};

// DELETE
exports.delete_question = function (req, res) {
  let questionId = new mongoose.Types.ObjectId(req.params.id);

  Question.findByIdAndDelete(questionId).then((result) => {
    if (result === null) {
      res.status(418).send('Question not found');
    } else {
      res.status(200).send(result);
    }
  });
};
