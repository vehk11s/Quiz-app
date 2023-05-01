
import { getQuestion } from '../questionApi.js';

import { updateGame, getGameDataById } from './updateGame.js';


export async function getNextQuestion( gameId ){
  
  const gameData = await getGameDataById(gameId);

  const questionIndex = gameData[0].questionsAnswered;
  const questionId = gameData[0].questions[questionIndex];

  return await getQuestion(questionId);
}

export default getNextQuestion;