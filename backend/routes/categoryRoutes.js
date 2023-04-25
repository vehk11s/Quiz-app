const express = require("express");
const routes = express.Router();
const categoryController = require("../controllers/categoryController");

routes
  .route("/categories")
  .get(categoryController.get_categories)
  .post(categoryController.add_category);

routes
  .route("/categories/:id")
  .get(categoryController.get_category)
  .put(categoryController.edit_category)
  .delete(categoryController.delete_category);

module.exports = routes;
