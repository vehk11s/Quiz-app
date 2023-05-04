const url = 'http://localhost:3000/questions/';

export const getQuestions = async (query) => {
  const questions = await fetch(url + '?' + new URLSearchParams(query), {
    method: 'GET',
  });
  return questions.json();
};

export const getQuestion = async (id) => {
  const question = await fetch(url + id, {
    method: 'GET',
  });
  return question.json();
};

export const postQuestion = async (data) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  return response.json();
};

export const updateQuestion = async (data, id) => {
  const response = await fetch(url + id, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  return response.json();
};

export const deleteQuestion = async (id) => {
  const response = await fetch(url + id, {
    method: 'DELETE',
  });

  console.log(id + ' deleted');
  return response;
};
