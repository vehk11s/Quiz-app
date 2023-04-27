const SERVER = "http://127.0.0.1:3000";


const createNewGame = async ( category, difficulty) => {
    
  let data = { 
              "player": "Anonymous", 
              "category": category, 
              "difficulty": difficulty, 
              "score": 0 
            };

  const settings = {
                      method: "POST",
                      headers: {'Content-Type': 'application/json'}, 
                      body: JSON.stringify(data)
                    };


  try{
    let response = await fetch(SERVER + "/games", settings);

    if ( response ){
      console.log("Created new game succesfully: ", response);
    }
    else{
      console.log("Cannot create new game: ", response);
    }

    return response;
  }
  catch( error )
  {
    console.log("ERROR: cannot create new game: ", error);
    return error;
  }
}