const express = require("express");
const routes = express.Router();
const categoryController = require("../controllers/categoryController");

routes
  .route("/categories")
  .get(categoryController.get_categories)
  .post(categoryController.add_category);

module.exports = routes;
