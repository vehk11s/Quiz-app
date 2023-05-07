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
    .bail()
    .custom((val) => Category.isValidCategory(val)),

  async function (req, res) {
    try {
      validationResult(req).throw();

      let categoryId = new mongoose.Types.ObjectId(req.query.category);

      await Question.find({ category: categoryId })
        .populate('category')
        .then((result) => {
          res.status(200).json(result);
        });
    } catch (error) {
      res.status(400).send(error.mapped());
    }
  },
];

// GET quiz version of question by id
exports.getQuizQuestion = [
  param('id', 'Invalid question id')
    .exists()
    .isMongoId()
    .bail()
    .custom((val) => Question.isValidQuestion(val)),

  async function (req, res) {
    try {
      validationResult(req).throw();

      let questionId = new mongoose.Types.ObjectId(req.params.id);

      await Question.aggregate([
        {
          $match: {
            _id: questionId,
            options: {
              $elemMatch: {
                isCorrect: true,
              },
            },
          },
        },
        {
          $lookup: {
            from: 'categories',
            localField: 'category',
            foreignField: '_id',
            as: 'category',
          },
        },
      ]).then((result) => {
        let values = result[0].options;

        // Remove isCorrect
        result[0].options.forEach((opt) => {
          delete opt.isCorrect;
        });

        // Shuffle array
        values = values.sort(() => 0.5 - Math.random());

        // Replace values
        result[0]['options'] = values;

        res.status(200).json(result[0]);
      });
    } catch (error) {
      res
        .status(400)
        .send(`getQuizQuestion(): error while fetching question: ${error}`);
    }
  },
];

// GET single question by id
exports.get_question = [
  param('id', 'Invalid question id')
    .exists()
    .isMongoId()
    .bail()
    .custom((val) => Question.isValidQuestion(val)),

  async function (req, res) {
    try {
      validationResult(req).throw();

      let questionId = new mongoose.Types.ObjectId(req.params.id);

      Question.findById(questionId)
        .populate('category')
        .then((result) => {
          res.status(200).json(result);
        });
    } catch (error) {
      res.status(400).send(error.mapped());
    }
  },
];

// POST new question
exports.add_question = [
  check('*.category', 'Invalid category ID')
    .exists()
    .isMongoId()
    .bail()
    .custom((val) => Category.isValidCategory(val))
    // If category id is invalid, don't run the following validations
    .bail({ level: 'request' }),
  check('*.question', "Question description can't be empty")
    .trim()
    .notEmpty()
    .bail() // If value is empty, don't run the following validations
    .isString()
    .isLength({ min: 10 })
    .escape(),
  check('*.type', 'Question type must be defined')
    .trim()
    .default('multichoice')
    .isString(),
  check('*.options', 'All options must be defined')
    .if(check('*.type').equals('multichoice'))
    .isArray({ min: 4, max: 4 })
    .withMessage(
      'Wrong amount of options, set four options for multichoice question'
    )
    // If options are defined or the amount is wrong, don't run the following validations
    .bail({ level: 'request' }),
  check('*.options.*.option', "Option description can't be empty")
    .trim()
    .notEmpty()
    .bail() // If value is empty, run the following validations
    .isString()
    .isLength({ min: 1 })
    .escape(),
  check('*.options.*.isCorrect', 'Option answer must be either true or false')
    .trim()
    .notEmpty()
    .bail() // If value is empty, run the following validations
    .isString()
    .isIn(['true', 'false']),
  check('*.explanation').trim().escape().default(''),
  check('*.hint').trim().escape().default(''),

  async (req, res) => {
    try {
      validationResult(req).throw();

      await Question.insertMany(req.body, { ordered: true }).then((saved) =>
        res.json(saved)
      );
    } catch (error) {
      res.status(400).send(error.mapped());
    }
  },
];

// EDIT question by id
exports.edit_question = [
  body('category', 'Invalid category ID')
    .exists()
    .isMongoId()
    .bail()
    .custom((val) => Category.isValidCategory(val))
    .bail({ level: 'request' })
    .optional(),
  body('question', "Question description can't be empty")
    .trim()
    .notEmpty()
    .bail()
    .isString()
    .isLength({ min: 10 })
    .escape()
    .optional(),
  body('type', 'Question type must be defined')
    .trim()
    .default('multichoice')
    .isString()
    .optional(),
  body('options', 'Wrong amount of options').isArray({ min: 4, max: 4 }),
  check('options.*._id', 'Invalid option id')
    .exists()
    .isMongoId()
    .bail({ level: 'request' })
    .optional(),
  check('options.*.option', "Option description can't be empty")
    .trim()
    .notEmpty()
    .bail()
    .isString()
    .isLength({ min: 1 })
    .escape()
    .optional(),
  check('options.*.isCorrect', 'Option answer must be either true or false')
    .trim()
    .notEmpty()
    .bail()
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
      ).then((updatedQuestion) => {
        res.json(updatedQuestion);
      });
    } catch (error) {
      res.status(400).send(error.mapped());
    }
  },
];

// DELETE
exports.delete_question = [
  param('id', 'Invalid question id')
    .exists()
    .isMongoId()
    .bail()
    .custom((val) => Question.isValidQuestion(val)),

  async function (req, res) {
    try {
      validationResult(req).throw();
      let questionId = new mongoose.Types.ObjectId(req.params.id);

      await Question.findByIdAndDelete(questionId).then((result) => {
        res.status(200).send(`Deleted question with id ${req.params.id}`);
      });
    } catch (error) {
      res.status(400).send(error.mapped());
    }
  },
];
