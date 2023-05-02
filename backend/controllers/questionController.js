const mongoose = require('mongoose');
const Question = require('../models/questionModel');
const Category = require('../models/categoryModel');
const {
  check,
  body,
  query,
  param,
  validationResult,
} = require('express-validator');

// GET all questions of given category
exports.get_questions = [
  query('category', 'Invalid category id')
    .exists()
    .isMongoId()
    .custom((val) => Category.isValidCategory(val)),

  async function (req, res) {
    try {
      validationResult(req).throw();

      let categoryId = new mongoose.Types.ObjectId(req.query.category);

      await Question.find({ category: categoryId })
        .populate('category')
        .then((result) => {
          if (result.length < 5) {
            res.status(400).send('Too few questions');
          } else {
            res.status(200).json(result);
          }
        })
        .catch((error) => {
          res.status(400).send(error);
        });
    } catch (error) {
      res.status(400).send({ errors: error.mapped() });
    }
  },
];

// GET single question by id
exports.get_question = [
  param('id', 'Invalid question id')
    .exists()
    .isMongoId()
    .custom((val) => Question.isValidQuestion(val)),

  async function (req, res) {
    try {
      validationResult(req).throw();

      let questionId = new mongoose.Types.ObjectId(req.params.id);

      Question.findById(questionId)
        .populate('category')
        .then((result) => {
          res.status(200).json(result);
        })
        .catch((error) => {
          res.send(error);
        });
    } catch (error) {
      res.status(400).send({ errors: error.mapped() });
    }
  },
];

// POST new question
exports.add_question = [
  body('category', 'Invalid category id')
    .exists()
    .isMongoId()
    .custom((val) => Category.isValidCategory(val))
    .bail(),
  body('question', "Question can't be empty")
    .trim()
    .notEmpty()
    .isString()
    .escape()
    .bail(),
  body('type', 'Question type must be defined')
    .trim()
    .default('multichoice')
    .isString()
    .bail(),
  body('options', "Options can't be empty")
    .if(body('type').equals('multichoice'))
    .isArray({ min: 4, max: 4 })
    .withMessage('Wrong amount of options')
    .bail(),
  check('options.*.option', "Option can't be empty")
    .trim()
    .notEmpty()
    .isString()
    .escape()
    .bail(),
  check('options.*.isCorrect', 'Option answer must be true or false')
    .trim()
    .notEmpty()
    .isString()
    .isIn(['true', 'false'])
    .bail(),
  body('explanation').trim().escape().default(''),
  body('hint').trim().escape().default(''),

  async (req, res) => {
    try {
      validationResult(req).throw();

      await Question.insertMany(req.body, { ordered: true })
        .then((saved) => res.json(saved))
        .catch((error) => res.send(error));
    } catch (error) {
      res.status(400).send({ errors: error.mapped() });
    }
  },
];

// EDIT question by id
exports.edit_question = [
  body('category', 'Invalid category id')
    .exists()
    .isMongoId()
    .custom((val) => Category.isValidCategory(val))
    .optional(),
  body('question', "Question can't be empty")
    .trim()
    .notEmpty()
    .isString()
    .escape()
    .optional(),
  body('type', 'Question type must be defined')
    .trim()
    .default('multichoice')
    .isString()
    .optional(),
  body('options', "Options can't be empty")
    .if(body('type').equals('multichoice'))
    .isArray({ min: 4, max: 4 })
    .withMessage('Wrong amount of options')
    .optional(),
  check('options.*._id', 'Invalid option id').exists().isMongoId().optional(),
  check('options.*._option', "Option can't be empty").escape().optional(),
  check('options.*.isCorrect', 'Option answer must be true or false')
    .trim()
    .notEmpty()
    .isString()
    .isIn(['true', 'false'])
    .optional(),
  body('explanation').trim().default('').optional(),
  body('hint').trim().default('').optional(),

  async function (req, res) {
    try {
      validationResult(req).throw();

      let questionId = new mongoose.Types.ObjectId(req.params.id);
      let { question, type, options, explanation, hint, category } = req.body;

      Question.findByIdAndUpdate(
        questionId,
        {
          $set: { question, type, options, explanation, hint, category },
        },
        { new: true }
      )
        .then((updatedQuestion) => {
          res.json(updatedQuestion);
        })
        .catch((error) => res.send(error));
    } catch (error) {
      res.status(400).send({ errors: error.mapped() });
    }
  },
];

// DELETE
exports.delete_question = [
  param('id', 'Invalid question id')
    .exists()
    .isMongoId()
    .custom((val) => Question.isValidQuestion(val)),

  async function (req, res) {
    try {
      validationResult(req).throw();
      let questionId = new mongoose.Types.ObjectId(req.params.id);

      await Question.findByIdAndDelete(questionId)
        .then((result) => {
          res.status(200).send(`Deleted question with id ${req.params.id}`);
        })
        .catch((error) => res.status(400).send(error));
    } catch (error) {
      res.status(400).send({ errors: error.mapped() });
    }
  },
];
