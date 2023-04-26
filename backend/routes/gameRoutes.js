const express = require('express');
const routes = express.Router();
const gameController = require('../controllers/gameController');

//POST
routes.route('/games').post(gameController.add_game);

//GET
routes.route('/games/').get(gameController.get_games);
routes.route('/games/:game_id').get(gameController.get_game);
routes.route('/games_by_category/:category_id').get(gameController.get_games_by_category);


//PUT
routes.route('/games/:game_id').patch(gameController.update_game);

//DELETE
routes.route('/games/:game_id').delete(gameController.delete_game);

module.exports = routes;
