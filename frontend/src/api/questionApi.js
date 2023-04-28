const url = 'http://localhost:3000/questions';

export const fetchQuestions = async () => {
  const questions = await fetch(url + '?c=6447f81e6f1b5ca81f7a5506', {
    method: 'GET',
  });
  return questions;
};

export async function postQuestion(data) {
  const settings = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data[0]),
  };

  await fetch(url, settings).then((result) => {
    if (!result) {
      result.status(400).send('Something went wrong');
    } else {
      result.status(200).json(result);
    }
  });
}
