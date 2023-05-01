import {
  getQuestion,
  postQuestion,
  updateQuestion,
} from '../api/questionApi.js';
import { getCategories } from '../api/categoryApi.js';
import {
  createForm,
  createFieldset,
  createLegend,
  createLabel,
  createInput,
  createBtn,
  createDiv,
} from './formHelpers.js';

let visibleQuestions = 1; // Tracks the visible question sets on display, used for dynamical indexing
let totalQuestions = 1; // Doesn't decrease when removing a question, used for element ids
const AMT_OF_OPTIONS = 4; // Default amount of options for multichoice questions, used for loops

/* 
drawForm handles the overall constructing and drawing the form inside the dialog element.
*/
export async function drawForm(id) {
  // Find dialog and clear the content
  const modal = document.querySelector('dialog');
  const modalContent = modal.querySelector('.modal__content');
  modalContent.innerHTML = '';

  let formTitle = 'Add question';
  let question;

  // Editing form
  if (id) {
    formTitle = 'Edit question';
    question = await getQuestion(id);
  }

  const form = createForm('question_form', formTitle);

  const categories = createFieldset();
  categories.classList.add('categories');

  const data = await getCategories();

  data.forEach((category) => {
    const { category: name, id } = category;

    const label = createLabel(name);
    label.classList.add('row');
    const input = createInput(name, 'radio', 'category');
    input.value = id;

    // Editing form
    if (question && question.category.id === id) {
      input.checked = true;
    }

    label.appendChild(input);
    label.insertAdjacentText('beforeend', name);

    categories.appendChild(label);
  });

  form.appendChild(categories);

  const formContent = createDiv('form__content');
  const formFooter = createDiv('form__footer');
  form.appendChild(formContent);
  form.appendChild(formFooter);

  // New question form
  if (!id) {
    const addBtn = createBtn('Add question');
    addBtn.classList.add('btn-primary');

    addBtn.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('New question added');
      totalQuestions += 1;
      visibleQuestions += 1;
      drawQuestion();
      updateIndexing();
      e.preventDefault();
    });

    formFooter.appendChild(addBtn);
  }

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

  drawQuestion(question);
  updateIndexing();

  const closeBtn = document.querySelector('#close-modal');
  closeBtn.addEventListener('click', () => {
    modalContent.innerHTML = '';
    modal.close();
  });
}

function drawQuestion(question) {
  const form = document.querySelector('.form__content');

  const questionSet = createFieldset();
  questionSet.classList.add('form__question');
  questionSet.id = `Q${totalQuestions}-group`;

  // Prevent removing all question sets from the form
  if (visibleQuestions > 1) {
    const btn = createRemoveBtn();
    btn.addEventListener('click', (e) => {
      handleRemove(e);
    });
    questionSet.appendChild(btn);
  }

  const questionLegend = createLegend(`${visibleQuestions}. Question`);
  questionSet.appendChild(questionLegend);

  const questionLabel = createLabel(`Q${totalQuestions}`, 'Question');
  const questionInput = createInput(`Q${totalQuestions}`);

  // Set default value for editing form
  if (question) {
    questionInput.value = question.question;
  }

  questionLabel.appendChild(questionInput);

  questionSet.appendChild(questionLabel);
  questionSet.appendChild(drawOptions(question));

  form.appendChild(questionSet);
}

function drawOptions(question) {
  // Create fieldset & legend for the options
  const optionSet = createFieldset();
  optionSet.classList.add('form__options');

  const optionLabel = createLabel('Options');
  optionSet.appendChild(optionLabel);

  for (let optionNum = 1; optionNum <= AMT_OF_OPTIONS; optionNum++) {
    // Create grouping elements for each option
    const group = document.createElement('div');
    group.classList.add('form__group');

    // Create grouping elements for labels and inputs
    const labelRow = createDiv('form__row');
    const inputRow = createDiv('form__row');

    if (question) {
      inputRow.id = question.options[optionNum - 1]._id;
    }

    const optionLabel = createLabel(
      `${totalQuestions}O${optionNum}-description`,
      `${optionNum}. Option`
    );
    const validLabel = createLabel(
      `${totalQuestions}O${optionNum}-valid`,
      'Valid'
    );

    // Hide "Valid" label visually from all but first
    if (optionNum > 1) {
      validLabel.classList.add('visually-hidden');
    }

    labelRow.appendChild(optionLabel);
    labelRow.appendChild(validLabel);

    const optionInput = createInput(
      `${totalQuestions}O${optionNum}-description`
    );

    const validInput = createInput(
      `${totalQuestions}O${optionNum}-valid`,
      'radio',
      'correctOptions'
    );

    // Set default values for editing form
    if (question) {
      optionInput.value = question.options[optionNum - 1].option;
      validInput.checked = question.options[optionNum - 1].isCorrect;
    }

    inputRow.appendChild(optionInput);
    inputRow.appendChild(validInput);

    group.appendChild(labelRow);
    group.appendChild(inputRow);

    optionSet.append(group);
  }

  return optionSet;
}

function updateIndexing() {
  const legends = document.querySelectorAll('.form__question > legend');

  legends.forEach((legend, questionIndex) => {
    legend.textContent = '';
    legend.textContent = `${questionIndex + 1}. Question`;
  });
}

function handleRemove(e) {
  const form = document.querySelector('.form__content');
  const parentSet = e.target.closest('fieldset');

  form.removeChild(parentSet);
  updateIndexing();
  visibleQuestions -= 1;
}

function handleSubmit(id) {
  // Define new array for the questions
  const newQuestions = [];

  // Get selected category id
  const category = document.querySelector(
    'input[name="category"]:checked'
  ).value;
  // Select each question set by class name
  const questionSets = document.querySelectorAll('.form__question');

  if (!id) {
    questionSets.forEach((questionSet) => {
      // Get question number
      const questionNum = questionSet.id.slice(1, 2);
      const questionOptions = [];

      const questionInput = document.querySelector(
        `[id^='${questionNum}O${optionNum}']`
      );

      // Select all corresponding options sets inside parent
      for (let optionNum = 1; optionNum <= AMT_OF_OPTIONS; optionNum++) {
        const optionSets = questionSet.querySelectorAll(
          `[id^='${questionNum}O${optionNum}']`
        );
        questionOptions.push({
          option: optionSets[0].value,
          isCorrect: optionSets[1].checked,
        });
      }

      const newQuestion = {
        question: questionInput.value,
        options: questionOptions,
        category: category,
      };

      newQuestions.push(newQuestion);
    });

    postQuestion(newQuestions);
  } else {
    const questionField = document.querySelector('#Q1');
    const options = [];

    for (let optionNum = 1; optionNum <= AMT_OF_OPTIONS; optionNum++) {
      const optionSets = document.querySelectorAll(`[id^='1O${optionNum}']`);

      const optionId = optionSets[0].parentElement.id;

      const option = {
        option: optionSets[0].value,
        isCorrect: optionSets[1].checked,
        _id: optionId,
      };

      options.push(option);
    }

    const updatedQuestion = {
      id: id,
      question: questionField.value,
      options: options,
      category: category,
    };

    updateQuestion(updatedQuestion, id);
  }
}

export function createRemoveBtn() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
</svg>`;

  const button = document.createElement('button');
  button.classList.add('btn', 'btn-icon');
  button.setAttribute('id', 'remove-question');
  button.innerHTML = svg;

  return button;
}
