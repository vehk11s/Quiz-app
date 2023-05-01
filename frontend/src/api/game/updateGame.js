const SERVER = "http://127.0.0.1:3000";

const  QUESTION_LIMIT = 10;

/*
  Updates game data based on gameId that is stored in localStorage.
  Parameters: score (How much is increased)
              incQuestionsAnswered (true/false, do we increase questionsAnswered variable by 1)
              name (do we update name)
*/
export async function updateGame(score, incQuestionsAnswered = false, name = "Anonymous") {

  //todo add validation
  const id = localStorage.getItem("gameId");
  
  //get current gameData from database
  let gameData = await getGameDataById(id);

  if ( gameData[0].questionsAnswered >= QUESTION_LIMIT - 1 ){
    console.log("Answered to all questions!: " + parseInt(gameData[0].questionsAnswered + 1))
    return 0;
  }

  let data;

  //Create updated data to be stored in database
  if ( incQuestionsAnswered ){
    data = {
      "player": name,
      "score": parseInt(gameData[0].score + score),
      "questionsAnswered": parseInt(gameData[0].questionsAnswered + 1)
    };
  }
  else{
    data = {
      "player": name,
      "score": parseInt(score),
    };
  }

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
export async function getGameDataById(id){
  
  const settings = {
    method: "GET",
    headers: { 'Content-Type': 'application/json' }
  };
  
  try {
    let response = await fetch(SERVER + "/games/"+ id, settings);

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