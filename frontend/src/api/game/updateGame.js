const SERVER = "http://127.0.0.1:3000";

/*
  Updates game data based on gameId.
  Parameters: gameId Current game id
              gameData game data got from backend
              score (How much is increased)
              incQuestionsAnswered (true/false, do we increase questionsAnswered variable by 1)
              name (do we update name)
  Returns:    0 if error
              updated gameData on success

export async function updateGame(gameId, gameData, score = 0, incQuestionsAnswered = false, name = "Anonymous") {

  let data;

  //Create updated data to be stored in database
  if ( incQuestionsAnswered ){
    data = {
      "player": name,
      "score": parseInt(gameData[0].score + score),
      "questionsAnswered": parseInt(gameData[0].questionsAnswered + 1)
    };

    //save updated values to gameData
    gameData[0].score = data.score;
    gameData[0].player = data.player;
    gameData[0].questionsAnswered = data.questionsAnswered;
  }
  else{
    data = {
      "player": name,
      "score": parseInt(gameData[0].score + score)
    };

    //save updated values to gameData
    gameData[0].score = data.score;
    gameData[0].player = data.player;
  }



  const settings = {
    method: "PATCH",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  };

  try {
    let response = await fetch(`${SERVER}/games/${gameId}`, settings);
    let responseInJson = await response.json();

    if (!responseInJson) {
      console.log("Cannot update the game: ", responseInJson);
      return 0;
    }

    return gameData;
  }
  catch (error) {
    console.log("ERROR: Cannot update the game: ", error);
    return 0;
  }
};
*/

export async function updatePlayerName(gameId, name) {
  //Create updated data to be stored in database
  data = {
    "player": name,
    "nameUpdate": true
  };

  const settings = {
    method: "PATCH",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  };

  try {
    let response = await fetch(`${SERVER}/games/${gameId}`, settings);
    let responseInJson = await response.json();

    if (!responseInJson) {
      console.log("Cannot update the game: ", responseInJson);
      return 0;
    }

    return responseInJson;
  }
  catch (error) {
    console.log("ERROR: Cannot update the game: ", error);
    return 0;
  }
}

export async function updateGame(gameId, answerId) {

  let data;
  const state = parseInt(localStorage.getItem("gameState"));

  //Create updated data to be stored in database
  data = {
    "answerId": answerId,
    "state": state
  };

  const settings = {
    method: "PATCH",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  };

  try {
    let response = await fetch(`${SERVER}/games/${gameId}`, settings);
    let responseInJson = await response.json();

    if (!responseInJson) {
      console.log("Cannot update the game: ", responseInJson);
      return 0;
    }

    return responseInJson;
  }
  catch (error) {
    console.log("ERROR: Cannot update the game: ", error);
    return 0;
  }
};

/*
  Gets game data by gameId from backend and returns it in json format.
*/
export async function getGameDataById(gameId){
  
  const settings = {
    method: "GET",
    headers: { 'Content-Type': 'application/json' }
  };
  
  try {
    let response = await fetch(SERVER + "/games/"+ gameId, settings);

    if ( !response ) {
      console.log("Cannot get game data: ", response);
      return 0;
    }

    return await response.json();
  }
  catch ( error ) {
    console.log("ERROR: Cannot get game data: ", error);
    return 0;
  }
};

export default updateGame;