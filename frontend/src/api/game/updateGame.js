const SERVER = "http://127.0.0.1:3000";

/*
  Updates players name to game data at the end of the game based on gameId.
  Parameters: gameId Current game id
              name, players name

  Returns:    0 if error
              updated gameData on success
*/
export async function updatePlayerName(gameId, name) {
  //Create updated data to be stored in database
  let data = {
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

/*
  Updates game data based on gameId.
  Parameters: gameId Current game id
              answerId, id of the option player answered

  Returns:    0 if error
              updated gameData on success
*/
export async function updateGame(gameId, answerId) {

  const state = parseInt(localStorage.getItem("gameState"));

  //Create updated data to be stored in database
  let data = {
    "answerId": answerId,
    "state": state,
    "nameUpdate": false
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