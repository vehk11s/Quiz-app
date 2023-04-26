const express = require('express');
const routes = express.Router();
const questionController = require('../controllers/questionController');

routes
  .route('/questions')
  .get(questionController.get_questions)
  .post(questionController.add_question);

routes
  .route('/questions/:id')
  .get(questionController.get_question)
  .patch(questionController.edit_question)
  .delete(questionController.delete_question);

module.exports = routes;
