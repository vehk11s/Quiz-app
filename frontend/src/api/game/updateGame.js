const SERVER = "http://127.0.0.1:3000";


/*
  Updates game data based on gameId that is stored in localStorage.
  At each step increases questionsAnswered variable by one.
*/
export async function updateGame(score, name = "Anonymous") {

  //todo add validation
  const id = localStorage.getItem("gameId");
  
  //get current gameData from database
  let gameData = await getGameDataById(id);

  //Create updated data to be stored in database
  let data = {
    "player": name,
    "score": parseInt(score),
    "answeredQuestions": parseInt(gameData[0].questionsAnswered + 1)
  };

  const settings = {
    method: "PATCH",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  };

  try {
    let response = await fetch(SERVER + "/games/" + id, settings);
    let responseInJson = await response.json();

    if (!responseInJson) {
      console.log("Cannot update the game: ", responseInJson);
      return 0;
    }

    return 1;
  }
  catch (error) {
    console.log("ERROR: Cannot update the game: ", error);
    return 0;
  }
};

/*
  Gets game data by id from backend and returns it in json format.
*/
async function getGameDataById(id){
  
  const settings = {
    method: "GET",
    headers: { 'Content-Type': 'application/json' }
  };
  
  try {
    let response = await fetch(SERVER + "/games/"+ id, settings);

    if ( !response ) {
      console.log("Cannot update the game: ", response);
      return 0;
    }

    return await response.json();
  }
  catch ( error ) {
    console.log("ERROR: Cannot update the game: ", error);
    return 0;
  }
};

export default updateGame;