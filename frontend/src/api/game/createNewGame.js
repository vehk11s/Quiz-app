const SERVER = "http://127.0.0.1:3000";

/*
  Creates new game with given arguments and stores new game id got from backend to localStorage.
*/
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
    let response = await fetch(`${SERVER}/games`, settings);

    if (!response) {
      console.log("Cannot create new game: ", response);
      return 0;
    }

    const responseInJson = await response.json();

    //save game id to localStorage for later use
    localStorage.setItem("gameId", responseInJson.id);

    return responseInJson;
  }
  catch (error) {
    console.log("ERROR: cannot create new game: ", error);
    return 0;
  }
};


export default createNewGame;