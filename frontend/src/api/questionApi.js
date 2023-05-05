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

  return formatResponse(response, 'PATCH', 'Question(s) saved successfully!');
};

export const updateQuestion = async (data, id) => {
  const response = await fetch(url + id, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  return formatResponse(response, 'PATCH', 'Question updated successfully!');
};

export const deleteQuestion = async (id) => {
  const response = await fetch(url + id, {
    method: 'DELETE',
  });

  return formatResponse(response, 'DEL', 'Question deleted successfully!');
};


// Handles keeping responses in same format for easier message handling
const formatResponse = async (response, method, success) => {
  const res = { method: method, status: response.status, message: '' };

  if (response.ok) {
    res.message = success;
  } else {
    const errors = await response.json();
    const errorMessage = Object.values(errors)[0].msg;
    res.message = errorMessage;
  }

  return res;
};
