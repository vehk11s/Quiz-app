import createNewGame from '../api/game/createNewGame.js';
import updateGame from '../api/game/updateGame.js';

/*
  enum for different gameStates
  
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
};

//Handle startGame button from index.html
const btnStartGame = document.getElementById("btnStartGame");

btnStartGame.addEventListener("mouseup", handleStartButtonPress);
btnStartGame.addEventListener("keypress", handleStartButtonPress);


/*
  Gets radiobutton values from index.html and then starts new game
*/
const startNewGame = () => {

  //get categories from index
  const category = document.querySelector('input[name="category"]:checked').value;
  //get difficulty from index
  const difficulty = document.querySelector('input[name="difficulty"]:checked').value;

  return createNewGame(category, difficulty);
}


/*
  Keeps hold of current gameState.
  gameState is stored in localStorage.
*/
const gameStateMachine = () => {

  //load current gameState from localStorage
  let state = parseInt(localStorage.getItem("gameState"));

  //If there is no state (first time on the game etc.) start new game.
  if( !state ){
    state = gameState.STARTGAME;
  }

  //Check gameState and act accordingly.
  //Todo: Question phase, ending phase, proper error handling?

  switch( state ){
    case gameState.STARTGAME:
      //start new game phase
      console.log("Starting new game");

      //todo: load index page here

      if( startNewGame() ){
        localStorage.setItem("gameState", gameState.QUESTIONS);
      }
      else {
        localStorage.setItem("gameState", gameState.ERROR);
      }
      break;
    
    case gameState.QUESTIONS:
      //questions phase
      console.log("Question phase");

      //todo load questions, get next questions etc...
      if( updateGame(100) ){
        console.log("Question phase: gameUpdate succesfull");
        //ending phase for testing purposes
        localStorage.setItem("gameState", gameState.ENDING);
      }
      else {
        console.log("Question phase: FAILED");
      }

      break;

    case gameState.ENDING:
      //ending phase

      //Show points etc ask for new game?

      console.log("Ending phase.");

      //start game for testing purposes
      localStorage.setItem("gameState", gameState.STARTGAME);
      break;

    default:

      //Error state
      console.log("Error phase.")
      resetGame(gameState.STARTGAME);
      break;
  }
};


function handleStartButtonPress(e) {
  if (e.key === 'Enter' || e.type === 'mouseup') {
    gameStateMachine();
  }
};


//Todo possibly other values might need reseting
function resetGame(gameState){
  localStorage.setItem("gameState", gameState);
};