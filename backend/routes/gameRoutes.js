const express = require('express');
const routes = express.Router();
const gameController = require('../controllers/gameController');


routes
      .route('/games')
      .post(gameController.add_game)
      .get(gameController.get_games_by_category);

routes
      .route('/games/:id')
      .get(gameController.get_game)
      .patch(gameController.update_game)
      .delete(gameController.delete_game)


module.exports = routes;
