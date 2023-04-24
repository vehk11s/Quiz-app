const express = require('express');
const routes = express.Router();
const gameController = require('../controllers/gameController');

routes.route('/games').post(gameController.add_game);

module.exports = routes;
