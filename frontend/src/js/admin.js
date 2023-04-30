import { getQuestions } from '../api/questionApi.js';
import { getCategories } from '../api/categoryApi.js';

let categoryBtn = document.querySelector('#category-btn');
let questionBtn = document.querySelector('#question-btn');

window.addEventListener('load', () => {
  const location = window.location.hash.substring(1);
  init(location);
});

categoryBtn.addEventListener('click', () => {
  window.location.hash = '#categories';
  init('categories');
});

questionBtn.addEventListener('click', () => {
  window.location.hash = '#questions';
  init('questions');
});

function init(location) {
  const section = document.querySelector('section');
  section.innerHTML = '';
  const title = document.createElement('h1');

  const text = document.createElement('p');

  switch (location) {
    case 'questions':
      title.textContent = 'Questions';
      text.textContent = 'Select a category to view questions';
      break;
    case 'categories':
      title.textContent = 'Categories';
      text.textContent = 'Lorem ipsum dolor sit amet';
      break;
    default:
      title.textContent = 'Admin';
      text.textContent = 'Admin site';
      break;
  }

  section.appendChild(title);
  section.appendChild(text);

  handleCategoryNav(location);
}

async function handleCategoryNav(location) {
  const body = document.querySelector('body');
  const categoryNav = body.querySelector('#category-buttons');

  if (location != 'questions') {
    body.removeChild(categoryNav);
  }

  if (!categoryNav) {
    const main = document.querySelector('#main-nav');

    const categoryRow = document.createElement('div');
    categoryRow.classList.add('row');
    categoryRow.id = 'category-buttons';

    const categories = await getCategories();
    categories.forEach((category) => {
      const btn = document.createElement('button');
      btn.classList.add('btn', 'btn-secondary');

      btn.id = category.id;
      btn.textContent = category.category;

      categoryRow.appendChild(btn);

      main.after(categoryRow);
    });

    setListeners();
  }
}

function setListeners() {
  const parent = document.querySelector('#category-buttons');
  const buttons = parent.querySelectorAll('button');

  buttons.forEach((button) => {
    button.addEventListener('click', async () => {
      const questions = await getQuestions({ category: button.id });
      createContent(questions);
    });
  });
}

function createContent(elements) {
  const section = document.querySelector('section');
  section.innerHTML = '';

  const list = document.createElement('ol');

  elements.forEach((element) => {
    const listItem = document.createElement('li');
    listItem.textContent = element.question;

    const optionsList = document.createElement('ul');

    element.options.forEach((option) => {
      const optionEl = document.createElement('li');

      const correctSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-square" viewBox="0 0 16 16">
      <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
      <path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.235.235 0 0 1 .02-.022z"/>
    </svg>`;
      const incorrectSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-square" viewBox="0 0 16 16">
    <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
  </svg>`;

      if (option.isCorrect) {
        optionEl.innerHTML = correctSvg + `${option.option}`;
      } else {
        optionEl.innerHTML = incorrectSvg + `${option.option}`;
      }

      optionsList.appendChild(optionEl);
    });

    listItem.appendChild(optionsList);
    list.appendChild(listItem);

    section.appendChild(list);
  });
}
