import { createNewGame } from '../api/game/createNewGame.js';
import { updatePlayerName, updateGame } from '../api/game/updateGame.js';

import { drawIndexPage, drawQuestionPhase, drawEndingPhase } from './drawFunctions.js';



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


//question limit of each game
const QUESTION_LIMIT = 10;


//after the page is loaded reset localStorage and start new game
window.addEventListener("load", async (event) => {
    
  /*
    TODO: load game from database, if current game is still running 

    if(localStorage.getItem('gameId') && localStorage.getItem('gameState') != 0){
      //create function that gets gameData from backend
      console.log("restore game from db...");
    }
*/
    //Reset localStorage at reload
    await resetGame();

    console.log("Quiz app is fully loaded");
    gameStateMachine();
});



/*
  Gets radiobutton values from index.html and then starts new game
*/
async function startNewGame() {

  //get categories from index
  const categories = document.querySelectorAll('input[name="category"]');

  let checkedCategory = null;
  let foundCheckedCategory = null;

  for (const category of categories) {
    if (category.checked) {
      checkedCategory = category.value;
      foundCheckedCategory = true;
    }
  }

  //get difficulty from index
  const difficulty = document.querySelector('input[name="difficulty"]:checked').value;

  //start new game if category is set properly
  if ( foundCheckedCategory !== null ){
    return await createNewGame(checkedCategory, difficulty);
  }

  await resetGame()
  return 0;
}



/*
  Keeps hold of current gameState.
  gameState is stored in localStorage.
*/
async function gameStateMachine(gameData = null) {

  //load current gameState from localStorage
  let state = parseInt(localStorage.getItem("gameState"));

  //If there is no state (first time on the game etc.) start new game.
  if (!state) {
    state = gameState.INDEX;
    localStorage.setItem("gameState", gameState.INDEX);
  }


  //Check gameState and act accordingly.
  //Todo: Proper error handling?
  switch (state) {
    case gameState.INDEX:
      
      await drawIndexPage();

      const btnStartGame = document.getElementById("btnStartGame");

      btnStartGame.addEventListener("mouseup", (e) => { 
        localStorage.setItem("gameState", gameState.STARTGAME);
        handleStartButtonPress(e);
        
      });
      btnStartGame.addEventListener("keypress", (e) => {
        localStorage.setItem("gameState", gameState.STARTGAME);
        handleStartButtonPress(e)
      });

      break;

    case gameState.STARTGAME:
      //start new game phase
      console.log("Starting new game");

      gameData = await startNewGame();

      //check if category was set
      if (gameData === 0){
        console.log("Error while running startNewGame: no category selected!");
        break;
      }

      if ( gameData ) {
        localStorage.setItem("gameState", gameState.QUESTIONS);
      }
      else {
        console.log("Error while running startNewGame!");
        localStorage.setItem("gameState", gameState.ERROR);
      }

    case gameState.QUESTIONS:
      //questions phase

      //draw question screen
      await drawQuestionPhase(gameData);


      //Handle option buttons from index.html
      const optionButtons = document.getElementsByClassName("btn-option");

      for (let index = 0; index < optionButtons.length; index++) {
        optionButtons[index].addEventListener("mouseup", handleOptionButtonPress);
        optionButtons[index].addEventListener("keypress", handleOptionButtonPress);
      }

      break;

    case gameState.ENDING:
      //ending phase
      //Show points etc ask for new game?

      await drawEndingPhase(gameData);

      const btnMainMenu = document.getElementById("btnMainMenu");
      const btnSkip = document.getElementById("btnSkip"); 

      btnMainMenu.addEventListener("mouseup", handleMainMenuButtonPress);
      btnMainMenu.addEventListener("keypress", handleMainMenuButtonPress);

      btnSkip.addEventListener("mouseup", handleSkipButtonPress);
      btnSkip.addEventListener("keypress", handleSkipButtonPress);

      break;

    default:
      //Error state
      console.log("Error phase.");
      await resetGame();
      break;
  }
}


async function updateGameData(answerId, gameId){
  
  const gameData = await updateGame(gameId, answerId);

  if ( gameData === 0 ){
    //if returns false then we have error occured
    localStorage.setItem("gameState", gameState.ERROR);
  }
  else{
    localStorage.setItem("gameState", gameData.state);
  }
  gameStateMachine([gameData]);
}



function handleStartButtonPress(e) {
  if (e.key === 'Enter' || e.type === 'mouseup') {
    gameStateMachine();
  }
};

function handleOptionButtonPress(e){
  //Get the button that was pressed
  const button = e.target;
  if (e.key === 'Enter' || e.type === 'mouseup') {
    //button.value is the id of the answer
    updateGameData(button.value, localStorage.getItem('gameId'));
  }
};

function handleMainMenuButtonPress(e) {
  if (e.key === 'Enter' || e.type === 'mouseup') {
    
    //Update player name to database
    const input = document.getElementById('nameInput');
    if ( input.value.length > 0){
      updatePlayerName(localStorage.getItem('gameId'), input.value);
    }

    resetGame();

    //save player name to local storage if player wants to
    const storePlayerName = document.getElementById('storeInput');
    if ( storeInput.checked ){
      localStorage.setItem('playerName', input.value);
    }

    gameStateMachine();
  }
};

//basicly same as menuButton, but does not save users name
function handleSkipButtonPress(e) {
  if (e.key === 'Enter' || e.type === 'mouseup') {
    
    resetGame();
    gameStateMachine();
  }
};


//Todo possibly other values might need reseting
async function resetGame(){
  localStorage.clear();
};