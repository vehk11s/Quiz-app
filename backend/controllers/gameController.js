const Game = require('../models/gameModel');
const Question = require('../models/questionModel');


/*
  enum for different gameStates
  
  - INDEX: The first stage that draws the index page
  - ERROR: when error happens during running the game
  - STARTGAME: default state when player enters to site.
  - QUESTIONS: state where questions is provided to player and player answers to them
  - ENDING: state after the game is finnished. Shows scores to player etc. And maybe play again button (by pressing this the game state goes back to STARTGAME).
*/
const gameState = {
  ERROR: 0,
	STARTGAME: 1,
	QUESTIONS: 2,
  ENDING: 3,
  INDEX: 4
};

//15min = 900 000 ms
const RUN_DELETE_GAMES_DELAY_MS = 900000;


//1h in ms
const HOUR = 1000 * 60 * 60;


//questions per game
const QUESTIONS_PER_GAME = 10;

//Save timestamp from last time the unfinished games deleted
let lastRun = Date.now();





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

  //delete unfinished games if it is time for that
  if ( ( Date.now() - lastRun ) >= RUN_DELETE_GAMES_DELAY_MS ){
    deleteUnfinishedGames();
  }

  try{
    const allQuestions = await Question.find({ category: updateData.category }, options);
    const newGame = new Game(updateData);

    //get 10 random questions from selected category
    let questions = getRandomQuestions(allQuestions, 10);

    //store selected 10 questions to newGame
    for ( let index = 0; index < questions.length; index++ ){
      newGame.questions.push(questions[index]);
    }

    const saved = await Game.collection.insertOne(newGame);
    
    //Check if saving was successfully
    if ( Object.keys(saved).length !== 0 ){
      console.log("Started new game");
      res.status(200).json(saved);
      console.log(`Saved new game to database ${saved.insertedId}`);
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
  Update game by id
*/

exports.update_game = async function (req, res) {
  const id = req.params.id;

  //Check the format of id
  if ( !checkValidityOfId(id) ){
    console.log(`Error: id: ${id} is not in valid format!`);
    res.status(400).send(`Error: id: ${id} is not in valid format!`);
  }

  const param = req.body;

  const answerId = param.answerId;

  const gameData = await getGameCurrentState(id);

  let questionsAnswered = gameData[0].questionsAnswered;
  let score = gameData[0].score;
  let questionId = gameData[0].questions[questionsAnswered]._id;

  let state = param.state;

  if ( await isCorrectAnswer(answerId, questionId) ){
    //increase score
    //todo after timers are done for different difficulty settings then update score logic also
    console.log("correct answer!!!");
    score += 100;
  }

  //If player has not answered to 10 questions then ask another question
  if ( questionsAnswered < ( QUESTIONS_PER_GAME - 1 ) ){
    questionsAnswered += 1;
    state = gameState.QUESTIONS;
  }
  else{
    //player has answered to all questions so to end
    state = gameState.ENDING;
  }



  let updateData = {
    "questionsAnswered": questionsAnswered,
    "player": param.player,
    "score": score,
    "state": state
  };


  try{
    console.log(`update_game(): Updating game: ${id} data to DB...`);
    const options = { new: true };
    const result = await Game.findByIdAndUpdate( id, updateData, options );
    
    //Check if found any games
    if ( Object.keys(result).length !== 0 ){
      res.status(200).json(result);
    }
  }
  catch( error ){
    console.log(`update_game(): Error while fetching the game: ${req.params.id}, error message: ${error}`);
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





async function deleteUnfinishedGames(){
  
  lastRun = Date.now();

  console.log("deleteUnfinishedGames(): Finding unfinished games...");

  try{
    //If game is updated over hour ago and player has not answered to 10 questions (indexing starts from 0 so thats why -1)
    const result = await Game.deleteMany( { "updatedAt": { $lt : ( new Date(Date.now() - HOUR) )},
                                            "questionsAnswered": { $lt : (QUESTIONS_PER_GAME - 1)} });
    
    //Check if found any games
    if ( result.deletedCount > 0 ){
      console.log(`deleteUnfinishedGames(): Deleted ${result.deletedCount} unfinished games.`);
    }
    else{
      console.log("deleteUnfinishedGames(): Did not found any unfinished games");
    }
  }
  catch( error ){
    console.log(`deleteUnfinishedGames(): Error while trying to delete unfinished games: ${error}`);
  }
}





async function getGameCurrentState(id){
  
  try{
    const result = await Game.find( { _id: id } );

    //Check if found any games
    if ( Object.keys(result).length !== 0 ){
      return result;
    }
    else{
      console.log(`getGameCurrentState(): Game with id: ${id} does not exist.`);
      return 0;
    }
  }
  catch( error ){
    console.log(`getGameCurrentState(): Error while fetching game: ${id}, error message: ${error}`);
    return -1;
  }
}




async function isCorrectAnswer(answerId, questionId){
  let ans = 0;
  
  try{
    const question = await Question.findById( questionId );
    
    for(let i = 0; i < question.options.length; i++){
      if( question.options[i]._id == answerId ){
        return question.options[i].isCorrect;
      }
    }
  }
  catch( error ){
    console.log(`Error while checking is the player's answer correct: ${error}`);
  }
}