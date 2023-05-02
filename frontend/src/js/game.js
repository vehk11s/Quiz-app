import { createNewGame } from '../api/game/createNewGame.js';
import { getNextQuestion } from '../api/game/getNextQuestion.js'
import updateGame from '../api/game/updateGame.js';


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


window.addEventListener("load", (event) => {
  console.log("page is fully loaded");
  gameStateMachine();
});



/*
  Gets radiobutton values from index.html and then starts new game
*/
async function startNewGame() {

  //get categories from index
  //const category = document.querySelector('input[name="category"]:checked').value;
  const categories = document.querySelectorAll('input[name="category"]');

  let checkedCategory = null;

  for (const category of categories) {
    if (category.checked) {
      checkedCategory = category.value;
    }
  }

  //get difficulty from index
  const difficulty = document.querySelector('input[name="difficulty"]:checked').value;

  return await createNewGame(checkedCategory, difficulty);
}

/*
  Keeps hold of current gameState.
  gameState is stored in localStorage.
*/
async function gameStateMachine() {

  //load current gameState from localStorage
  let state = parseInt(localStorage.getItem("gameState"));

  //If there is no state (first time on the game etc.) start new game.
  if (!state) {
    state = gameState.INDEX;
    localStorage.setItem("gameState", gameState.INDEX);
  }


  //Check gameState and act accordingly.
  //Todo: Question phase, ending phase, proper error handling?
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
      if (await startNewGame()) {
        localStorage.setItem("gameState", gameState.QUESTIONS);
      }
      else {
        console.log("go to error? state: " + state);
        localStorage.setItem("gameState", gameState.ERROR);
      }


    case gameState.QUESTIONS:
      //questions phase

      //draw question screen
      await drawQuestionPhase();


      //Handle option buttons button from index.html
      const optionButtons = document.getElementsByClassName("btn-option");

      for (let index = 0; index < optionButtons.length; index++) {
        optionButtons[index].addEventListener("mouseup", handleOptionButtonPress);
        optionButtons[index].addEventListener("keypress", handleOptionButtonPress);
      }

      break;

    case gameState.ENDING:
      //ending phase
      //Show points etc ask for new game?

      await drawEndingPhase();

      //start game for testing purposes
      //await resetGame();

      const btnMainMenu = document.getElementById("btnMainMenu");

      btnMainMenu.addEventListener("mouseup", handleMainMenuButtonPress);
      btnMainMenu.addEventListener("keypress", handleMainMenuButtonPress);

      break;

    default:
      //Error state
      console.log("Error phase.");
      await resetGame();
      break;
  }
}


async function checkAnswer(id, gameId){
  const question = await getNextQuestion(gameId);

  //temporary here. TODO move to backend
  //todo calc score etc...

  //increase score by 300 and increase answeredQuestions by 1
  let res = await updateGame(300,true);

  if ( res === 0 ){
    //if returns false then we have answered to all questions and time to move to ending phase
    localStorage.setItem("gameState", gameState.ENDING);
  }
  else{
    localStorage.setItem("gameState", gameState.QUESTIONS);
  }

  gameStateMachine();
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
    //button.value is the index of the answer
    checkAnswer(button.value, localStorage.getItem('gameId'));
  }
};

function handleMainMenuButtonPress(e) {
  if (e.key === 'Enter' || e.type === 'mouseup') {
    resetGame();
    gameStateMachine();
  }
};


//Todo possibly other values might need reseting
async function resetGame(){
  localStorage.clear();
};