const url = 'http://localhost:3000/questions';

/* export const fetchQuestions = async () => {
  const questions = await fetch(url + '?c=6447f81e6f1b5ca81f7a5506', {
    method: 'GET',
  });
  return questions;
}; */

export async function postQuestion(data) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  return response.json();
}
