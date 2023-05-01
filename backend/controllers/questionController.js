const mongoose = require('mongoose');
const Question = require('../models/questionModel');
const Category = require('../models/categoryModel');
const { body, validationResult } = require('express-validator');

/* 
Validation test category ids:
Acc = 6447f81e6f1b5ca81f7a5506
N/A = 6447f81e6f1b5ca81f7a5507
INV = 6447f81e6f1b5ca81f7abc5506
*/

// GET questions of given category
exports.get_questions = async function (req, res) {
  let categoryId = new mongoose.Types.ObjectId(req.query.category);

  Question.find({ category: categoryId })
    .populate('category')
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
exports.add_question = [
  body('question', "Question can't be empty").trim().notEmpty().isString(),
  body('type', 'Question type must be defined')
    .trim()
    .default('multichoice')
    .isString(),
  body('options', "Options can't be empty")
    .if(body('type').equals('multichoice'))
    .isArray({ min: 4, max: 4 })
    .withMessage('Wrong amount of options'),
  body('explanation').trim().default(''),
  body('hint').trim().default(''),

  async (req, res) => {
    try {
      // Casting category id to ObjectId throws error if argument is in invalid format
      const categoryId = new mongoose.Types.ObjectId(req.body.category);
      const category = await Category.findById(categoryId);

      // Manually handle the empty document MongoDB returns if category is not found
      if (category === null) {
        throw new Error('Category not found');
      }

      try {
        validationResult(req).throw();
        res.status(200).send(req.body);

        const insertOptions = { ordered: true }; // Prevents additional documents from being inserted if one fails

        await Question.insertMany(req.body, insertOptions)
          .then((saved) => res.json(saved))
          .catch((error) => res.send(error));
      } catch (e) {
        console.log(e);
        res.status(400).send({ errors: e.mapped() });
      }
    } catch (error) {
      res.status(400).send(error.message);
    }
  },
];

// EDIT question by id
exports.edit_question = function (req, res) {
  let questionId = new mongoose.Types.ObjectId(req.params.id);
  let { question, type, options, explanation, hint, category } = req.body;

  Question.findByIdAndUpdate(
    questionId,
    {
      $set: { question, type, options, explanation, hint, category },
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
