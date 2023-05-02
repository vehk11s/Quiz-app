import { getQuestions, deleteQuestion } from '../api/questionApi.js';
import { getCategories } from '../api/categoryApi.js';
import { drawForm } from './questionForm.js';
import { categoryForm } from './categoryForm.js';

let categoryBtn = document.querySelector('#category-btn');
let questionBtn = document.querySelector('#question-btn');

// Prevents throwing user back to main page on load
// Doesn't yet retain category-based question listing
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

  if (location === 'questions') {
    const button = document.createElement('button');
    button.classList.add('btn', 'btn-primary');
    button.textContent = 'Add new questions';
    button.addEventListener('click', () => {
      drawForm();
    });
    section.appendChild(button);
  }

  // Category
  if (location === 'categories') {
    const button = document.createElement('button');
    button.classList.add('btn', 'btn-primary');
    button.textContent = 'Add new category';
    button.addEventListener('click', () => {
      categoryForm();
    });
    section.appendChild(button);

    listCategories();
  }

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
      btn.classList.add('btn', 'btn-secondary', 'btn-sm');

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
  section.innerHTML = ''; // Remove content

  const list = document.createElement('ol'); // Main listing

  elements.forEach((element) => {
    const questionItem = document.createElement('li');
    questionItem.textContent = element.question;
    questionItem.classList.add('list__question');

    const optionsList = document.createElement('ol');

    element.options.forEach((option) => {
      const optionItem = document.createElement('li');

      if (option.isCorrect) {
        optionItem.textContent = `${option.option}`;
      } else {
        optionItem.textContent = `${option.option}`;
      }

      optionsList.appendChild(optionItem);
    });

    questionItem.appendChild(optionsList);

    const listFooter = document.createElement('div');
    listFooter.classList.add('row', 'list__footer');

    const delBtn = createBtn('delete', element.id);
    delBtn.addEventListener('click', (e) => {
      deleteQuestion(e.target.value);
    });

    const editBtn = createBtn('edit', element.id);
    editBtn.addEventListener('click', (e) => {
      drawForm(e.target.value);
    });

    listFooter.appendChild(editBtn);
    listFooter.appendChild(delBtn);

    questionItem.appendChild(listFooter);
    list.appendChild(questionItem);
    section.appendChild(list);
  });
}

function createBtn(type, id) {
  const button = document.createElement('button');
  button.classList.add('btn', 'btn-secondary', 'btn-sm');

  switch (type) {
    case 'delete':
      button.textContent = 'Delete';
      button.value = id;
      break;
    case 'edit':
      button.textContent = 'Edit';
      button.value = id;
      break;
    default:
      button.textContent = 'Button';
      break;
  }

  return button;
}

async function listCategories() {
  const section = document.querySelector('section');
  const list = document.createElement('ol'); // Main listing

  const categories = await getCategories();

  categories.forEach(function(object){
    const categoryItem = document.createElement('li');

    categoryItem.textContent = object.category;
    categoryItem.classList.add('list__categories');

    const listFooter = document.createElement('div');
    listFooter.classList.add('row', 'list__footer');

    const delBtn = createBtn('delete', object.id);
    delBtn.addEventListener('click', (e) => {
      //
    });

    const editBtn = createBtn('edit', object.id);
    editBtn.addEventListener('click', (e) => {
      //
    });

    listFooter.appendChild(editBtn);
    listFooter.appendChild(delBtn);

    categoryItem.appendChild(listFooter);
    list.appendChild(categoryItem);
    section.appendChild(list);

  });
}
