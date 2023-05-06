export const drawMessage = (response) => {
  // Deconstruct param
  const { method, status, message } = response;
  //console.log(response);

  // Draw HTML elements
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message');
  const messageText = document.createElement('p');

  // Add class depending on response status
  if (status === 200) {
    messageDiv.classList.add('msg-success');
  } else {
    messageDiv.classList.add('msg-error');
  }

  // Add message
  messageText.textContent = message;
  messageDiv.appendChild(messageText);

  displayMessage(messageDiv);
};

const displayMessage = (messageDiv) => {
  // Append element to body
  const body = document.querySelector('body');
  body.appendChild(messageDiv);

  // Remove element after 4 seconds
  setTimeout(function () {
    removeMessage(messageDiv);
  }, 4000);
};

const removeMessage = (messageDiv) => {
  const body = document.querySelector('body');
  body.removeChild(messageDiv);
};
