const url = "http://127.0.0.1:3000/questions";


export const getQuestion = async (id) => {
  const question = await fetch(url + '/' + id, {
    method: 'GET',
  });
  return question.json();
};