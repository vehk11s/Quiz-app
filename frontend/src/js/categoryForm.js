import {
  getCategory,
  postCategory,
  updateCategory,
  deleteCategory,
} from '../api/categoryApi.js';
import {
  createForm,
  createFieldset,
  createLegend,
  createLabel,
  createInput,
  createBtn,
  createDiv,
} from './formHelpers.js';
import { getQuestions } from '../api/questionApi.js';

let visibleCategories = 1;
let totalCategories = 1;

// Duplicate function, needs to be moved elsewhere when everything works
export const handleModal = () => {
  const modal = document.querySelector('dialog');

  if (modal.open) {
    modal.close();
  } else {
    modal.showModal();
  }
};

export async function categoryForm(id) {
  // Find the dialog element and clear it from possible content
  const modal = document.querySelector('dialog');
  const modalContent = modal.querySelector('.modal__content');
  modalContent.innerHTML = '';

  let formTitle = 'Add category';
  let category;

  // Change form title and save category in a variable
  if (id) {
    formTitle = 'Edit category';
    category = await getCategory(id);
  }

  // Start creating the form
  const form = createForm('category_form', formTitle);

  const formContent = createDiv('form__content');
  const formFooter = createDiv('form__footer');
  form.appendChild(formContent);
  form.appendChild(formFooter);

  if (!id) {
    const addBtn = createBtn('Add category');
    addBtn.classList.add('btn-primary');

    addBtn.addEventListener('click', (e) => {
      totalCategories += 1;
      visibleCategories += 1;
      drawCategory();
      updateIndexing();
      e.preventDefault();
    });

    formFooter.appendChild(addBtn);
  }

  // Submit button is added to both forms
  const submitBtn = createBtn('Save');
  submitBtn.classList.add('btn-primary');
  submitBtn.addEventListener('click', () => {
    handleSubmit(id);
  });

  formFooter.appendChild(submitBtn);
  form.appendChild(formFooter);

  // Append the full form and then open dialog
  modalContent.appendChild(form);
  modal.showModal();

  drawCategory(category);
  updateIndexing();

  const closeBtn = document.querySelector('#close-modal');
  closeBtn.addEventListener('click', () => {
    modalContent.innerHTML = '';
    modal.close();
  });
}

function drawCategory(category) {
  const form = document.querySelector('.form__content');

  const categorySet = createFieldset();
  categorySet.classList.add('form__category');
  categorySet.id = `C${totalCategories}-group`;

  // Prevent removing all question sets from the form
  if (visibleCategories > 1) {
    const btn = createRemoveBtn();
    btn.addEventListener('click', (e) => {
      handleRemove(e);
    });
    categorySet.appendChild(btn);
  }

  const categoryLegend = createLegend(`${visibleCategories}. Category`);
  categorySet.appendChild(categoryLegend);

  const categoryLabel = createLabel(`C${totalCategories}`, 'Category');
  const categoryInput = createInput(`C${totalCategories}`);

  // Set default value for editing form
  if (category) {
    categoryInput.value = category.category;
  }

  categoryLabel.appendChild(categoryInput);

  categorySet.appendChild(categoryLabel);

  form.appendChild(categorySet);
}

// When user removes a category from the form, handleRemove finds the parent fieldset and removes all elements
function handleRemove(e) {
  const form = document.querySelector('.form__content');
  const parentSet = e.target.closest('fieldset');

  form.removeChild(parentSet);
  updateIndexing();
  visibleCategories -= 1;
}

// Handles both saving new category and updating an existing category
function handleSubmit(id) {
  if (!id) {
    // Define new array for the categories
    const newCategories = [];

    // Select each category set by class name
    const categorySets = document.querySelectorAll('.form__category');

    categorySets.forEach((categorySet) => {
      // Get category number
      const categoryNum = categorySet.id.slice(1, 2);

      const categoryInput = document.querySelector(`#C${categoryNum}`);

      const newCategory = {
        category: categoryInput.value,
      };
      console.log(newCategory);
      newCategories.push(newCategory);
    });
    console.log(newCategories);
    postCategory(newCategories);
  } else {
    const categoryField = document.querySelector('#C1');

    const updatedCategory = {
      id: id,
      category: categoryField.value,
    };

    updateCategory(updatedCategory, id);
  }
}

/* When deleting a category, check if there is questions in it. If yes, ask user "are you sure" 
and then delete all the questions in that category and finally the category itself. If there is not questions
in the category, then delete the category. */

export async function categoryDeleting(id) {
  // Find the dialog element and clear it from possible content
  const modal = document.querySelector('dialog');
  const modalContent = modal.querySelector('.modal__content');
  modalContent.innerHTML = '';

  let category = await getCategory(id);

  let formTitle = 'Delete ' + category.category + '?';

  const questions = await getQuestions({ category: id });
  const questionsAmount = Object.keys(questions).length;

  // Start creating the form
  const form = createForm('deleteCategory_form', formTitle);

  const formContent = createDiv('form__content');

  const text = document.createElement('p');
  text.textContent =
    'There is ' +
    questionsAmount +
    ' questions in this category. If you delete it, these questions will be deleted also.';

  formContent.appendChild(text);

  const formFooter = createDiv('form__footer');
  form.appendChild(formContent);
  form.appendChild(formFooter);

  const button = createBtn('Confirm');
  button.classList.add('btn-primary');
  button.addEventListener('click', () => {
    deleteCategory(id);
    handleModal();
    window.location.reload();
  });

  formFooter.appendChild(button);
  form.appendChild(formFooter);

  // Append the full form and then open dialog
  modalContent.appendChild(form);
  modal.showModal();

  const closeBtn = document.querySelector('#close-modal');
  closeBtn.addEventListener('click', () => {
    modalContent.innerHTML = '';
    modal.close();
  });
}

export function createRemoveBtn() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
</svg>`;

  const button = document.createElement('button');
  button.classList.add('btn', 'btn-icon');
  button.setAttribute('id', 'remove-category');
  button.innerHTML = svg;

  return button;
}

function updateIndexing() {
  const legends = document.querySelectorAll('.form__category > legend');

  legends.forEach((legend, categoryIndex) => {
    legend.textContent = '';
    legend.textContent = `${categoryIndex + 1}. Category`;
  });
}
