const Game = require('../models/gameModel');
const Question = require('../models/questionModel');


const checkValidityOfId = (paramId) => {

  if ( !paramId )
    return false;

  //Check if parameter game_id is in valid format
  if (!paramId.match(/^[0-9a-fA-F]{24}$/))
    return false;

  return true;
}


/* 
  Get all games
*/
exports.get_games = async function (req, res) {
  const games = await Game.find()
  .then( (result) =>{
    res.json(result);
    console.log(result);
  });

};


/* 
  Get game by id
*/

exports.get_game = async function (req, res) {

  const game_id = req.params.game_id;

  //Check the format of id
  if ( !checkValidityOfId(game_id) ){
    console.log("Error: game_id: " + game_id + " is not in valid format!");
    res.sendStatus(404);
  }

  console.log("Finding game: " + game_id);
  
  try{

    const result = await Game.find( { _id: game_id } );

    //Check if found any games
    if ( Object.keys(result).length !== 0 ){
      console.log("Found game: " + game_id );
      console.log("Sending game data to frontend...");
      res.json(result);
      console.log("Game data has been sent to frontend.");
    }
    else{
      console.log("Game with id: " + req.params.game_id + " does not exist.");
      res.sendStatus(404);
    }
  }
  catch( error ){
    console.log("Error while fetching game: " + req.params.game_id + ", error message: " + error);
    res.json(error);
  }
};


/* 
  Get games by category
*/

exports.get_games_by_category = async function (req, res) {

  const category_id = req.params.category_id;

  //Check the format of id
  if ( !checkValidityOfId(category_id) ){
    console.log("Error: category_id: " + category_id + " is not in valid format!");
    res.sendStatus(404);
  }

  console.log("Finding games by category id: " + category_id);

  try{

    const results = await Game.find( { category: category_id } );

    //Check if found any games
    if ( Object.keys(results).length !== 0 ){
      console.log("Found games: " + results );
      console.log("Sending the data to frontend...");
      res.json(results);
      console.log("Game data has been sent to frontend.");
    }
    else{
      console.log("Games with category id: " + category_id + " does not exist.");
      res.sendStatus(404);
    }
  }
  catch( error ){
    console.log("Error while fetching games with category id: " + category_id + ", error message: " + error);
    res.json(error);
  }
};


// POST new game
exports.add_game = async function (req, res) {
  let { player, score, difficulty, category } = req.body;

  const gameQuestions = await Question.find({ category: category });

  const newGame = new Game({
    player,
    score,
    difficulty,
    category,
  });

  for (question of gameQuestions) {
    newGame.questions.push(question.id);
  }

  newGame.save().then((saved) => {
    res.json(saved);
  });
};


/* 
  Edit game by id
*/
exports.update_game = async function (req, res) {

  const game_id = req.params.game_id;

  //Check the format of id
  if ( !checkValidityOfId(game_id) ){
    console.log("Error: game_id: " + game_id + " is not in valid format!");
    res.sendStatus(404);
  }

  const updateData = req.body;
  const options = { new: true };

  console.log("Finding game: " + game_id);

  try{
    const result = await Game.findByIdAndUpdate( game_id, updateData, options );
    
    //Check if found any games
    if ( Object.keys(result).length !== 0 ){
      console.log("Found game: " + game_id );
      console.log("Updating game data...");
      res.json(result);

      console.log("Game data has been updated.");
    }
  }
  catch( error ){
    console.log("Error while fetching the game: " + req.params.game_id + ", error message: " + error);
    res.json(error);
  }
};


/* 
  Delete game by id
*/
exports.delete_game = async function (req, res) {

  const game_id = req.params.game_id;

  //Check the format of id
  if ( !checkValidityOfId(game_id) ){
    console.log("Error: game_id: " + game_id + " is not in valid format!");
    res.sendStatus(404);
  }

  console.log("Finding game: " + game_id);

  try{
    const result = await Game.findByIdAndDelete( game_id );
    
    //Check if found any games
    if ( Object.keys(result).length !== 0 ){
      console.log("Found game: " + game_id );
      console.log("Deleting game data...");
      res.send("Game data of the game:" + game_id + " has been deleted.");

      console.log("Game data of the game:" + game_id + " has been deleted.");
    }
  }
  catch( error ){
    console.log("Error while fetching the game: " + req.params.game_id + ", error message: " + error);
    res.json(error);
  }
};