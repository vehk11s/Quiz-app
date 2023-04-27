const SERVER = "http://127.0.0.1:3000";

export async function updateGame(score, name = "Anonymous") {

  //todo add validation
  const id = localStorage.getItem("gameId");
  
  alert(id);

  let gameData = await getGameDataById(id);


  console.log("Updating scores: " + gameData.answeredQuestions);

  let data = {
    "player": name,
    "score": parseInt(score),
    "answeredQuestions": (gameData.answeredQuestions + 1)
  };

  const settings = {
    method: "PATCH",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  };


  try {
    let response = await fetch(SERVER + "/games", settings);

    if (!response) {
      console.log("Cannot update the game: ", response);
      return 0;
    }

    return 1;
  }
  catch (error) {
    console.log("ERROR: Cannot update the game: ", error);
    return 0;
  }
};


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

    return response;
  }
  catch ( error ) {
    console.log("ERROR: Cannot update the game: ", error);
    return 0;
  }
};

export default updateGame;