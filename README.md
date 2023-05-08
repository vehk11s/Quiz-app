# Quiz-app

This project was purely desinged and implemented by contributors mentioned at the end of the file. There were no guidance or requirements other than usage of Node.js and MongoDB for this project.

**Basic rules**:
- Each question has four answer options
- Only one of the options is correct answer
- In the future there is going to be time limit to answer in moderate and in hard difficulty settings
- Game is single player
- 10 random questions per game
- 3 different categories of questions


## Techniques

The app is two part program: backend and frontend.

Quiz-app is created using following techniques:
- Node.Js
- JavaScript
- MongoDB

Backend is made with node.js and mongodb using following dependencies: 
- Express
- Nodemon
- Mongoose
- Dotenv
- express-validator
- CORS

Frontend is made with HTML5, CSS3 and vanilla JavaScript. Accessibility of the frontend is one of the highest goals of this project.

The app has custom API calls between frontend and backend and the needed data is packed in JSON.

## Installation

1. Pull repo from GitHub
2. run npm install command at backend folder to install all necessary dependencies
3. Create database to mongo based on models at models-folder
4. Create .env file to backend folder
5. Add following variables to .env: PORT="SERVER_PORT" and MONGODB_URI="mongodb+srv://admin:token_and_mongodb"
6. Update CORS from index.js to match frontend server ip and port

    

## Contributors
- vehk11s
- iinajenina
- mintteal
