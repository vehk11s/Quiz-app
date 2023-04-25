const express = require('express');
const routes = express.Router();
const gameController = require('../controllers/gameController');

//POST
routes.route('/games').post(gameController.add_game);

//GET
routes.route('/games/get_games').get(gameController.get_games);
routes.route('/games/get_game/:game_id').get(gameController.get_game);
routes.route('/games/get_games_by_category/:category_id').get(gameController.get_games_by_category);


//PUT
routes.route('/games/update_game/:game_id').put(gameController.update_game);

//DELETE
routes.route('/games/delete_game/:game_id').delete(gameController.delete_game);

module.exports = routes;
