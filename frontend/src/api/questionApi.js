const url = 'http://localhost:3000/questions?';

export const getQuestions = async (query) => {
  const questions = await fetch(url + new URLSearchParams(query), {
    method: 'GET',
  });
  return questions.json();
};

export async function postQuestion(data) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  return response.json();
}
