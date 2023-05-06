const { Collection } = require("mongoose");
const Category = require("../models/categoryModel");
const Question = require("../models/questionModel");
const {
  check,
  body,
  param,
  validationResult,
} = require("express-validator");

// GET all categories
exports.get_categories = async function (req, res) {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// POST new category
exports.add_category = [
  body("", "Wrong format").isArray().bail(),
  check("*.category", "Category can't be empty")
    .trim()
    .notEmpty()
    .isString()
    .escape()
    .bail(),

  async function (req, res) {
    try {
      validationResult(req).throw();

      const body = req.body;
      console.log(body);

      await Category.insertMany(body).then((saved) => res.json(saved));
    } catch (error) {
      res.status(400).send(error.mapped());
    }
  },
];

// Get one category by id
exports.get_category = [
  param("id", "Invalid category id")
    .exists()
    .isMongoId()
    .custom((val) => Category.isValidCategory(val)),

  async function (req, res) {
    try {
      validationResult(req).throw();

      await Category.findById(req.params.id).then((result) => res.json(result));
    } catch (error) {
      res.status(400).send(error.mapped());
    }
  },
];

// PUT Update category by id
exports.edit_category = [
  param("id", "Invalid category id")
    .exists()
    .isMongoId()
    .custom((val) => Category.isValidCategory(val))
    .optional(),
  body("category", "Category can't be empty")
    .trim()
    .notEmpty()
    .isString()
    .escape()
    .optional(),

  async function (req, res) {
    try {
      validationResult(req).throw();

      const id = req.params.id;
      const updatedData = req.body;
      const options = { new: true };

      await Category.findByIdAndUpdate(id, updatedData, options).then(
        (updated) => res.json(updated)
      );
    } catch (error) {
      res.status(400).send(error.mapped());
    }
  },
];

// DELETE category
exports.delete_category = [
  param("id", "Invalid category id")
    .exists()
    .isMongoId()
    .custom((val) => Category.isValidCategory(val)),

  async function (req, res) {
    try {
      validationResult(req).throw();

      const id = req.params.id;
      const deleteQuestions = await Question.deleteMany({ category: id });
      console.log(deleteQuestions);

      await Category.findByIdAndDelete(id).then((result) => {
        res.status(200).send(`Deleted category with id ${id}`);
      });
    } catch (error) {
      res.status(400).send(error.mapped());
    }
  },
];
