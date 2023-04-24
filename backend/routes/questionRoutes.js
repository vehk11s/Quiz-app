const express = require('express');
const routes = express.Router();
const questionController = require('../controllers/questionController');

routes.route('/questions').post(questionController.add_question);

module.exports = routes;
