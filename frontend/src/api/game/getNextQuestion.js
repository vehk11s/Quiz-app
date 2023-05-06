
import { getQuizQuestion } from '../questionApi.js';

export async function getNextQuestion( gameData ){
  const questionIndex = gameData[0].questionsAnswered;
  const questionId = gameData[0].questions[questionIndex];

  return await getQuizQuestion(questionId);
}

export default getNextQuestion;