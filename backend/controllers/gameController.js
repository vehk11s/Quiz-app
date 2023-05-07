const mongoose = require('mongoose');
const Game = require('../models/gameModel');
const Question = require('../models/questionModel');
const Category = require('../models/categoryModel');

const { check, validationResult} = require('express-validator');

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
  Get game by id
*/
exports.get_game = [
  check('id', 'Invalid game id or game does not exist')
    .exists()
    .isMongoId()
    .bail()
    .custom((val) => Game.isValidGame(val)),
    

  async (req, res) => {

    const validationErrors = validationResult(req);
    
    if (!validationErrors.isEmpty()) {
        res.status(422).send(validationErrors.mapped());
    }
    else{
      const id = new mongoose.Types.ObjectId(req.params.id);

      try {
        const result = await Game.find({ _id: id });

        //Check if found any games
        if (Object.keys(result).length !== 0) {
          console.log(`function get_game(): Sending game ${id} data to frontend...`);
          res.status(200).json(result);
        }
      }
      catch (error) {
        console.log(`Error while fetching game: ${id}, error message: ${error}`);
        res.status(400).send(`Error while fetching game: ${id}, error message: ${error}`);
      }
    }
  },
]


/* 
  Get top 10 games by category
*/
exports.get_games_by_category = [
  check('category', 'Invalid category id or category does not exist')
    .exists()
    .isMongoId()
    .bail()
    .custom((val) => Category.isValidCategory(val)),

  async (req, res) => {

    const validationErrors = validationResult(req);
    
    if (!validationErrors.isEmpty()) {
      res.status(422).send(validationErrors.mapped());
    }
    else {

      const categoryId = new mongoose.Types.ObjectId(req.query.category);

      console.log(`Finding games by category id: ${categoryId}`);

      try {
        const results = await Game.find({ category: categoryId })
          .sort({ score: -1 })
          .limit(10);

        //Check if found any games
        if (Object.keys(results).length !== 0) {
          console.log(`Found ${Object.keys(results).length} games`);
          res.status(200).json(results);
        }
        else {
          console.log(`Games with category id: ${categoryId} does not exist.`);
          res.status(404).send(`Games with category id: ${categoryId} does not exist.`);
        }
      }
      catch (error) {
        console.log(`Error while fetching games with category id: ${categoryId}, error message: ${error}`);
        res.status(400).send(`Error while fetching games with category id: ${categoryId}, error message: ${error}`);
      }
    }
  },
]



/* 
  POST new game
*/
exports.add_game = [
  check('category', 'Invalid category id')
    .exists()
    .isMongoId()
    .bail({ level: 'request' })
    .custom((val) => Category.isValidCategory(val)),
  check('player', 'Player needs a valid name')
    .exists()
    .trim()
    .notEmpty()
    .bail()
    .isString()
    .escape(),
  check('difficulty', 'Difficulty must be: easy, medium or hard')
    .optional()
    .trim()
    .notEmpty()
    .isString()
    .escape()
    .isIn(['easy', 'medium', 'hard']),
  check('score', "Score must be a number")
    .optional()
    .trim()
    .notEmpty()
    .isNumeric()
    .escape(),
  check('state', "State must be a number")
    .optional()
    .trim()
    .notEmpty()
    .isNumeric()
    .escape(),
  check('questionsAnswered', "questionsAnswered must be a number")
    .optional()
    .trim()
    .notEmpty()
    .isNumeric()
    .escape(),


  async (req, res) => {

    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      res.status(422).send(validationErrors.mapped());
    }
    else {
      const updateData = req.body;

      const categoryId = new mongoose.Types.ObjectId(updateData.category);

      //delete unfinished games if it is time for that
      if ((Date.now() - lastRun) >= RUN_DELETE_GAMES_DELAY_MS) {
        deleteUnfinishedGames();
      }

      try {
        const questions = await getRandomQuestions(categoryId, QUESTIONS_PER_GAME);

        const newGame = new Game(updateData);

        //Init some basic data so cannot push wrong data trough API
        newGame.questions = [];
        newGame.questionsAnswered = 0;

        //store selected 10 questions to newGame
        for (let index = 0; index < questions.length; index++) {
          newGame.questions.push(questions[index]);
        }

        const saved = await Game.collection.insertOne(newGame);

        //Check if saving was successfully
        if (Object.keys(saved).length !== 0) {
          console.log("Started new game");
          res.status(200).json(saved);
          console.log(`Saved new game to database ${saved.insertedId}`);
        }
        else {
          console.log("Failed to save new game.");
          res.status(400).send("Failed to save new game.");
        }
      }
      catch (error) {
        console.log(`Error while adding game, message:\n ${error}`);
        res.status(400).send(error);
      }
    }
  },
];


/* 
  Update game by id
*/
exports.update_game = [
  check('id', 'Invalid game id')
    .exists()
    .isMongoId()
    .bail({ level: 'request' })
    .custom((val) => Game.isValidGame(val)),
  check('answerId', 'Invalid answer id')
    .optional()
    .isMongoId(),
  check('nameUpdate', "nameUpdate must be true or false")
    .exists()
    .trim()
    .notEmpty()
    .bail({ level: 'request' })
    .escape()
    .isIn(["false", "true"]),
  check('player', 'Player needs a valid name')
    .optional()
    .trim()
    .notEmpty()
    .isString()
    .escape(),
  check('state', "State must be a number")
    .optional()
    .trim()
    .notEmpty()
    .isNumeric()
    .escape(),

  async (req, res) => {

    const validationErrors = validationResult(req);


    if (!validationErrors.isEmpty()) {
      res.status(422).send(validationErrors.mapped());
    }
    else {

      const id = new mongoose.Types.ObjectId(req.params.id);

      const param = req.body;

      let updateData = null;

      //checks if updateData only has player name to update or real gamedata
      if (param.nameUpdate === "true") {
        updateData = {
          "player": param.player,
        };
      }
      else {

        const answerId = new mongoose.Types.ObjectId(param.answerId);

        const gameData = await getGameCurrentState(id);

        let questionsAnswered = gameData[0].questionsAnswered;
        let score = gameData[0].score;


        const questionId = new mongoose.Types.ObjectId(gameData[0].questions[questionsAnswered]._id);


        let state = param.state;

        if (await isCorrectAnswer(answerId, questionId)) {
          //increase score
          //todo after timers are done for different difficulty settings then update score logic also

          score += 100;
        }

        const questionsInGame = gameData[0].questions.length;

        //If player has not answered to all questions in game then ask another question
        if (questionsAnswered < (questionsInGame - 1)) {
          questionsAnswered += 1;
          state = gameState.QUESTIONS;
        }
        else {
          //player has answered to all questions so to end
          state = gameState.ENDING;
        }

        updateData = {
          "questionsAnswered": questionsAnswered,
          "score": score,
          "state": state
        };
      }

      try {
        console.log(`update_game(): Updating game: ${id} data to DB...`);
        const options = { new: true };
        const result = await Game.findByIdAndUpdate(id, updateData, options);

        //Check if found any games
        if (Object.keys(result).length !== 0) {
          res.status(200).json(result);
        }
      }
      catch (error) {
        console.log(`update_game(): Error while fetching the game: ${req.params.id}, error message: ${error}`);
        res.status(400).send(`Error while fetching the game: ${req.params.id}, error message: ${error}`);
      }
    }
  },
];




/* 
  Delete game by id
*/
exports.delete_game = [
  check('id', 'Invalid game id')
    .exists()
    .isMongoId()
    .custom((val) => Game.isValidGame(val)),

  async (req, res) => {

    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      res.status(422).send(validationErrors.mapped());
    }
    else {
      const id = new mongoose.Types.ObjectId(req.params.id);

      try {
        const result = await Game.findByIdAndDelete(id);

        //Check if found any games
        if (Object.keys(result).length !== 0) {
          res.status(200).send(`Game data of the game:${id} has been deleted.`);
          console.log(`Game data of the game:${id} has been deleted.`);
        }
      }
      catch (error) {
        console.log(`Error while fetching the game: ${id}, error message:\n ${error}`);
        res.status(400).send(`Error while fetching the game: ${id}, error message:\n ${error}`);
      }
    }
  },
];


///////////////////////////////////////////////////////////////////////////////////////////
//Helper functions etc...
///////////////////////////////////////////////////////////////////////////////////////////


/*
  Fetch n ammount of random questions from db and check that each has at least one correct answer
*/
async function getRandomQuestions(category, n) {

  return await Question.aggregate([
    {
      $match: {
        $and: [
          {
            'category': category,
          },
          {
            options: {
              $elemMatch: {
                isCorrect: true,
              },
            },
          },
        ],
      },
    },
    {
      $sample: {
        'size': n,
      },
    },
    {
      $lookup: {
        from: 'categories',
        localField: 'category',
        foreignField: '_id',
        as: 'category',
      },
    },
  ]);
};


async function deleteUnfinishedGames() {

  lastRun = Date.now();

  console.log("deleteUnfinishedGames(): Finding unfinished games...");

  try {
    //If game is updated over hour ago and player has not answered to 10 questions (indexing starts from 0 so thats why -1)
    const result = await Game.deleteMany({
      "updatedAt": { $lt: (new Date(Date.now() - HOUR)) },
      "questionsAnswered": { $lt: (QUESTIONS_PER_GAME - 1) }
    });

    //Check if found any games
    if (result.deletedCount > 0) {
      console.log(`deleteUnfinishedGames(): Deleted ${result.deletedCount} unfinished games.`);
    }
    else {
      console.log("deleteUnfinishedGames(): Did not found any unfinished games");
    }
  }
  catch (error) {
    console.log(`deleteUnfinishedGames(): Error while trying to delete unfinished games: ${error}`);
  }
}



async function getGameCurrentState(gameId) {

  const id = new mongoose.Types.ObjectId(gameId);

  try {
    const result = await Game.find({ _id: id });

    //Check if found any games
    if (Object.keys(result).length !== 0) {
      return result;
    }
    else {
      console.log(`getGameCurrentState(): Game with id: ${id} does not exist.`);
      return 0;
    }
  }
  catch (error) {
    console.log(`getGameCurrentState(): Error while fetching game: ${id}, error message: ${error}`);
    return -1;
  }
}



async function isCorrectAnswer(ansId, quesId) {
  const answerId = new mongoose.Types.ObjectId(ansId);
  const questionId = new mongoose.Types.ObjectId(quesId);

  try {
    const question = await Question.findById(questionId);

    for (let i = 0; i < question.options.length; i++) {
      if (question.options[i]._id.equals(answerId)) {
        return question.options[i].isCorrect;
      }
    }
  }
  catch (error) {
    console.log(`Error while checking is the player's answer correct: ${error}`);
  }
}