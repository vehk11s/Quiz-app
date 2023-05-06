
import { getQuizQuestion } from '../questionApi.js';

export async function getNextQuestion( gameData ){

  //If category does not have any questions then quit game
  if ( gameData[0].questions.length !== 0 ){
    const questionIndex = gameData[0].questionsAnswered;
    const questionId = gameData[0].questions[questionIndex];

    return await getQuizQuestion(questionId);
  }

  return 0;
}

export default getNextQuestion;