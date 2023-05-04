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

  if (response.ok) {
    return {
      method: 'POST',
      status: response.status,
      message: 'Insert successful!',
    };
  } else {
    const errors = await response.json();
    const errorMessage = Object.values(errors)[0].msg;
    return { method: 'POST', status: response.status, message: errorMessage };
  }
};

export const updateQuestion = async (data, id) => {
  const response = await fetch(url + id, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (response.ok) {
    return {
      method: 'PATCH',
      status: response.status,
      message: 'Update successful!',
    };
  } else {
    const errors = await response.json();
    const errorMessage = Object.values(errors)[0].msg;
    return { method: 'PATCH', status: response.status, message: errorMessage };
  }
};

export const deleteQuestion = async (id) => {
  const response = await fetch(url + id, {
    method: 'DELETE',
  });

  if (response.ok) {
    console.log('deleted');
    console.log(response.status);
    return {
      method: 'DEL',
      status: response.status,
      message: 'Deletion successful!',
    };
  } else {
    const errors = await response.json();
    const errorMessage = Object.values(errors)[0].msg;
    return { method: 'DEL', status: response.status, message: errorMessage };
  }
};
