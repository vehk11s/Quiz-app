const SERVER = "http://127.0.0.1:3000";

//Todo get new game id and store it to localStorage
export async function createNewGame(category, difficulty) {

  let data = {
    "player": "Anonymous",
    "category": category,
    "difficulty": difficulty,
    "score": 0
  };

  const settings = {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  };


  try {
    let response = await fetch(SERVER + "/games", settings);

    if (!response) {
      console.log("Cannot create new game: ", response);
      return 0;
    }

    let responseInJson = await response.json();

    //save game id to localStorage for later use
    localStorage.setItem("gameId", responseInJson);

    return 1;
  }
  catch (error) {
    console.log("ERROR: cannot create new game: ", error);
    return 0;
  }
};


export default createNewGame;