import { getQuestions, deleteQuestion } from '../api/questionApi.js';
import { getCategories } from '../api/categoryApi.js';
import { drawForm } from './questionForm.js';
import { categoryForm, categoryDeleting } from './categoryForm.js';
import { drawMessage } from './message.js';
import { decodeString } from './formHelpers.js';

/* 
Runs when the page is refreshed. 
The function fetches categories and checks the window hash location and finds the selected category.
After that it draws the sidebar and site content
*/
window.addEventListener('load', async () => {
  // Fetch categories on load
  const categories = await getCategories();
  const location = window.location.hash.substring(1);

  // Use hash to reload back to the right category
  const selectedCategory = categories.find(
    (category) => category.id === location
  );

  // If user hasnt selected a category or it's deleted, relocate to admin index
  if (!selectedCategory) {
    window.location.hash = '';
    history.replaceState('', '', window.location.pathname);
  }

  drawContent(selectedCategory);
});

/* 
Runs when the page is refreshed.
Draws sidebar, category nav and control buttons for adding new categories and questions */
async function drawSidebar(categories) {
  const sidebar = document.querySelector('aside');
  const categoryList = sidebar.querySelector('.nav-categories');

  // Remove previous content
  categoryList.innerHTML = '';

  const title = document.createElement('p');
  title.classList.add('lg');
  title.textContent = 'Categories';

  categoryList.appendChild(title);

  categories.forEach((category) => {
    const listItem = document.createElement('li');
    const btn = document.createElement('button');

    btn.id = category.id;
    btn.classList.add('btn', 'btn-list', 'btn-sm');
    btn.innerHTML = category.category;

    btn.addEventListener('click', async () => {
      window.location.hash = btn.id;
      const questions = await getQuestions({ category: btn.id });
      listQuestions(questions, category);
    });

    listItem.appendChild(btn);
    categoryList.appendChild(listItem);
  });

  // Set up listeners for adding new elements
  const categoryBtn = document.querySelector('#category-btn');
  categoryBtn.addEventListener('click', () => {
    categoryForm();
  });

  const questionBtn = document.querySelector('#question-btn');
  questionBtn.addEventListener('click', () => {
    drawForm();
  });
}

/* 
Runs when the page is refreshed.
If user had selected a category when refreshing the page, this function
fetches the correct data and renders the list.
*/
export async function drawContent(selectedCategory) {
  const categories = await getCategories();
  drawSidebar(categories);

  // Find parent element and clear content
  const section = document.querySelector('section');

  // Set page title
  const sectionHeader = section.querySelector('.section__header');
  const sectionTitle = sectionHeader.querySelector('h1');

  if (selectedCategory) {
    sectionTitle.innerHTML = selectedCategory.category;
    const questions = await getQuestions({ category: selectedCategory.id });

    listQuestions(questions, selectedCategory);
  } else {
    sectionTitle.textContent = 'Admin';
  }
}

/* 
Runs when the page is refreshed and when a category button is clicked.
Updates the section title, calls drawHeaderButtons and handles the rendering of
question listing
*/
function listQuestions(questions, selectedCategory) {
  // Update site header
  const sectionTitle = document.querySelector('h1');
  sectionTitle.innerHTML = selectedCategory.category;

  drawHeaderButtons(selectedCategory);

  // Find section content, remove previous
  const sectionContent = document.querySelector('.section__content');
  sectionContent.innerHTML = ''; // Remove content

  // Draw list
  const list = document.createElement('ol');
  list.id = 'question-list';

  if (questions.length === 0) {
    const text = document.createElement('p');
    text.textContent = "This category doesn't have any questions yet";
    sectionContent.appendChild(text);
  } else {
    // Loop all questions
    questions.forEach((element) => {
      // Draw list item
      const questionItem = document.createElement('li');
      questionItem.id = element.id;
      questionItem.textContent = decodeString(element.question);
      questionItem.classList.add('list__question');

      // Draw nested list
      const optionsList = document.createElement('ol');

      // Draw list items for options
      element.options.forEach((option) => {
        const optionItem = document.createElement('li');
        optionItem.textContent = decodeString(option.option);
        optionsList.appendChild(optionItem);
      });

      questionItem.appendChild(optionsList);

      const listFooter = document.createElement('div');
      listFooter.classList.add('row', 'list__footer');

      const delBtn = createBtn('delete', '', element.id);
      delBtn.addEventListener('click', async (e) => {
        if (confirm('Delete question?')) {
          const response = await deleteQuestion(e.target.value);
          removeVisually(e.target.value);
          drawMessage(response);
        }
      });

      const editBtn = createBtn('edit', '', element.id);
      editBtn.addEventListener('click', (e) => {
        drawForm(e.target.value);
      });

      listFooter.appendChild(editBtn);
      listFooter.appendChild(delBtn);

      questionItem.appendChild(listFooter);
      list.appendChild(questionItem);
      sectionContent.appendChild(list);
    });
  }
}

// Handles removing the questions from listing without forcing a full page refresh
function removeVisually(id) {
  const parent = document.getElementById('question-list');
  const removable = document.getElementById(id);
  parent.removeChild(removable);
}

/* 
Runs when the page is refreshed and when a category button is clicked.
Renders control buttons below the section title
*/
function drawHeaderButtons(category) {
  const sectionHeader = document.querySelector('.section__header');

  // Remove element if it already exists
  if (document.querySelector('.buttons')) {
    sectionHeader.removeChild(document.querySelector('.buttons'));
  }
  const buttonDiv = document.createElement('div');
  buttonDiv.classList.add('buttons');

  // Add question, doenst yet recognize the selected category
  const addQuestionBtn = createBtn('add', 'question', '');
  addQuestionBtn.addEventListener('click', () => {
    drawForm();
  });

  // Edit selected category
  const editCategoryBtn = createBtn('edit', 'category', category.id);
  editCategoryBtn.addEventListener('click', (e) => {
    categoryForm(e.target.value);
  });

  // Delete selected category
  const delCategoryBtn = createBtn('delete', 'category', category.id);
  delCategoryBtn.addEventListener('click', (e) => {
    categoryDeleting(e.target.value);
  });

  buttonDiv.appendChild(addQuestionBtn);
  buttonDiv.appendChild(editCategoryBtn);
  buttonDiv.appendChild(delCategoryBtn);

  sectionHeader.appendChild(buttonDiv);
}

// Helper function
function createBtn(type, elem, id) {
  const button = document.createElement('button');
  button.classList.add('btn', 'btn-secondary', 'btn-sm');

  switch (type) {
    case 'add':
      button.textContent = `Add ${elem}`;
      button.value = '';
      break;
    case 'delete':
      button.textContent = `Delete ${elem}`;
      button.value = id;
      break;
    case 'edit':
      button.textContent = `Edit ${elem}`;
      button.value = id;
      break;
    default:
      button.textContent = 'Button';
      break;
  }

  return button;
}
