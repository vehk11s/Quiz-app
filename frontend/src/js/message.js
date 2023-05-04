export const drawMessage = (response) => {
  const { method, status, message } = response;
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message');

  console.log(response);

  const messageText = document.createElement('p');

  if (status === 200) {
    messageDiv.classList.add('msg-success');
  } else {
    messageDiv.classList.add('msg-error');
  }
  messageText.textContent = message;

  messageDiv.appendChild(messageText);

  if (status === 200) {
    if (method === 'DEL' || method === 'PATCH') {
      const text = document.createElement('p');
      text.textContent = 'Update page to see changes';
      messageDiv.appendChild(text);
    }
  }

  displayMessage(messageDiv);
};

const displayMessage = (messageDiv) => {
  const body = document.querySelector('body');
  body.appendChild(messageDiv);

  /*   setTimeout(function () {
    removeMessage(messageDiv);
  }, 4000); */
};

const removeMessage = (messageDiv) => {
  const body = document.querySelector('body');
  body.removeChild(messageDiv);
};
