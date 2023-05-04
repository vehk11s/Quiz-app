export const drawMessage = (status) => {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message');

  const messageText = document.createElement('p');

  switch (status) {
    case 0:
      messageDiv.classList.add('msg-success');
      messageText.textContent = 'Insert successful';
      break;
    case 1:
      messageDiv.classList.add('msg-success');
      messageText.textContent = 'Update successful';
      break;
    case 2:
      messageDiv.classList.add('msg-success');
      messageText.textContent =
        'Deletion successful, refresh page to see changes';
      break;
    case 3:
      messageDiv.classList.add('msg-error');
      messageText.textContent = 'Error';
      break;
  }
  messageDiv.appendChild(messageText);

  displayMessage(messageDiv);
};

const displayMessage = (messageDiv) => {
  const body = document.querySelector('body');
  body.appendChild(messageDiv);

  setTimeout(function () {
    removeMessage(messageDiv);
  }, 4000);
};

const removeMessage = (messageDiv) => {
  const body = document.querySelector('body');
  body.removeChild(messageDiv);
};
