const Game = require('../models/gameModel');
const Question = require('../models/questionModel');

/*
  Checks that paramId is valid id number: 24 chars, contains only: 0-9, a-f and A-F characters
*/
const checkValidityOfId = (paramId) => {

  if ( !paramId )
    return false;

  //Check if parameter paramId is in valid format
  if (!paramId.match(/^[0-9a-fA-F]{24}$/))
    return false;

  return true;
};

/*
  Creates array which hold n ammount of random entries got from param object.
*/
const getRandomQuestions = (param, n) => {
  let questionIdArray = [];

  //store all the question ids to array
  for (let question of param) {
    questionIdArray.push(question.id);
  }

  // Shuffle array
  let shuffled = questionIdArray.sort(() => 0.5 - Math.random());

  // Get sub-array of first n elements after shuffled
  return shuffled.slice(0, n);
};


/* 
  Get all games

exports.get_games = async function (req, res) {
  try{
    const results = await Game.find();

    //Check if found any games
    if ( Object.keys(results).length !== 0 ){
      console.log("Found games: " + results );
      console.log("Sending games to frontend...");
      res.status(200).json(results);
      console.log("Game data has been sent to frontend.");
    }
    else{
      console.log("Games does not exist.");
      res.status(404).send("Games does not exist.");
    }
  }
  catch( error ){
    console.log("Error while fetching games, error message: " + error);
    res.status(400).send("Error while fetching games, error message: " + error);
  }
};
*/

/* 
  Get game by id
*/
exports.get_game = async function (req, res) {

  const id = req.params.id;

  //Check the format of id
  if ( !checkValidityOfId(id) ){
    console.log(`Error: id: ${id} is not in valid format!`);
    res.status(400).send(`Error: id: ${id} is not in valid format!`);
  }

  try{
    const result = await Game.find( { _id: id } );

    //Check if found any games
    if ( Object.keys(result).length !== 0 ){
      console.log(`function get_game(): Sending game ${id} data to frontend...`);
      res.status(200).json(result);
    }
    else{
      console.log(`Game with id: ${id} does not exist.`);
      res.status(404).send(`Game with id: ${id} does not exist.`);
    }
  }
  catch( error ){
    console.log(`Error while fetching game: ${id}, error message: ${error}`);
    res.status(400).send(`Error while fetching game: ${id}, error message: ${error}`);
  }
};


/* 
  Get top 10 games by category
*/
exports.get_games_by_category = async function (req, res) {

  const categoryId = req.query.category;

  //Check the format of id
  if ( !checkValidityOfId(categoryId) ){
    console.log(`Error: categoryId: ${categoryId} is not in valid format!`);
    res.status(400).send(`Error: categoryId: ${categoryId} is not in valid format!`);
  }

  console.log(`Finding games by category id: ${categoryId}`);

  try{
    const results = await Game.find( { category: categoryId } )
                              .sort( { score: -1})
                              .limit(10);                      

    //Check if found any games
    if ( Object.keys(results).length !== 0 ){
      console.log(`Found games: ${results}` );
      res.status(200).json(results);
    }
    else{
      console.log(`Games with category id: ${categoryId} does not exist.`);
      res.status(404).send(`Games with category id: ${categoryId} does not exist.`);
    }
  }
  catch( error ){
    console.log(`Error while fetching games with category id: ${categoryId}, error message: ${error}`);
    res.status(400).send(`Error while fetching games with category id: ${categoryId}, error message: ${error}`);
  }
};

/* 
  POST new game
*/
exports.add_game = async function (req, res) {
  
  const updateData = req.body;
  const options = { new: true };

  try{
    const allQuestions = await Question.find({ category: updateData.category }, options);
    const newGame = new Game(updateData);

    //get 10 random questions from selected category
    let questions = getRandomQuestions(allQuestions, 10);

    //store selected 10 questions to newGame
    for ( let index = 0; index < questions.length; index++ ){
      newGame.questions.push(questions[index]);
    }

    const saved = await newGame.save();
    
    //Check if saving was successfully
    if ( Object.keys(saved).length !== 0 ){
      console.log("Started new game");
      res.status(200).json(saved);
      console.log(`Saved new game to database ${saved._id}`);
    }
    else{
      console.log("Failed to save new game.");
      res.status(400).send("Failed to save new game.");
    }
  }
  catch( error ){
    console.log(`Error while adding game, message: ${error}`);
    res.status(400).send(`Error while adding game, message: ${error}`);
  }
};


/* 
  Edit game by id
*/
exports.update_game = async function (req, res) {
  const id = req.params.id;

  //Check the format of id
  if ( !checkValidityOfId(id) ){
    console.log(`Error: id: ${id} is not in valid format!`);
    res.status(400).send(`Error: id: ${id} is not in valid format!`);
  }

  const updateData = req.body;
  const options = { new: true };

  try{
    console.log(`function update_game(): Updating game: ${id} data to DB...`);
    const result = await Game.findByIdAndUpdate( id, updateData, options );
    
    //Check if found any games
    if ( Object.keys(result).length !== 0 ){
      res.status(200).json(result._id);
    }
  }
  catch( error ){
    console.log(`Error while fetching the game: ${req.params.id}, error message: ${error}`);
    res.status(400).send(`Error while fetching the game: ${req.params.id}, error message: ${error}`);
  }
};


/* 
  Delete game by id
*/
exports.delete_game = async function (req, res) {

  const id = req.params.id;

  //Check the format of id
  if ( !checkValidityOfId(id) ){
    console.log(`Error: id: ${id} is not in valid format!`);
    res.status(400).send(`Error: id: ${id} is not in valid format!`);
  }

  console.log(`Finding game: ${id}`);

  try{
    const result = await Game.findByIdAndDelete( id );
    
    //Check if found any games
    if ( Object.keys(result).length !== 0 ){
      console.log(`Deleting game: ${id} data...`);
      res.status(200).send(`Game data of the game:${id} has been deleted.`);
      console.log(`Game data of the game:${id} has been deleted.`);
    }
  }
  catch( error ){
    console.log(`Error while fetching the game: ${id}, error message: ${error}`);
    res.status(400).send(`Error while fetching the game: ${id}, error message: ${error}`);
  }
};