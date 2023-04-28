import { postQuestion } from '../api/questionApi.js';
import {
  createFieldset,
  createLegend,
  createLabel,
  createInput,
} from './formHelpers.js';

let totalQuestions = 1; // Doesn't decrease when removing a question
let visibleQuestions = 1; // Tracks the visible question sets on display

let addBtn = document.querySelector('#add-question');
let submitBtn = document.querySelector('#submit-form');

// Create first question form element on load
document.addEventListener('DOMContentLoaded', () => {
  addQuestion();
  updateIndexing();
});

addBtn.addEventListener('click', (e) => {
  totalQuestions += 1;
  visibleQuestions += 1;
  addQuestion();
  updateIndexing();
  e.preventDefault();
});

submitBtn.addEventListener('click', (e) => {
  handleSubmit(e);
});

function handleRemove(e) {
  const form = document.querySelector('.form__content');
  const parentSet = e.target.closest('fieldset');

  form.removeChild(parentSet);
  updateIndexing();
  visibleQuestions -= 1;
}

function handleSubmit(e) {
  e.preventDefault();

  const category = document.querySelector('input[name="category"]:checked').id;
  const questions = document.querySelectorAll('.form__question');
  const options = [];
  let formValues;
  let formData = [];

  questions.forEach((question) => {
    formValues = question.querySelectorAll('input');

    for (let i = 1; i <= 4; i++) {
      const input = document.querySelectorAll(`[id^='O${i}']`);

      options.push({
        option: input[0].value,
        isCorrect: input[1].checked,
      });
    }

    formData.push({ question: formValues[0].value, options, category });
  });

  postQuestion(formData);
  e.preventDefault();
}

function updateIndexing() {
  const legends = document.querySelectorAll('.form__question > legend');

  legends.forEach((legend, i) => {
    legend.textContent = '';
    legend.textContent = `${i + 1}. Question`;
  });
}

function addQuestion() {
  const form = document.querySelector('.form__content');

  const questionSet = createFieldset();
  questionSet.classList.add('form__question');
  questionSet.setAttribute('id', `Q${totalQuestions}-group`);
  questionSet.appendChild(createRemoveBtn());

  const questionLegend = createLegend(`${visibleQuestions}. Question`);
  questionSet.appendChild(questionLegend);

  const questionLabel = createLabel(`Q${totalQuestions}`, 'Question');
  const questionInput = createInput(`Q${totalQuestions}`);

  questionLabel.appendChild(questionInput);

  questionSet.appendChild(questionLabel);
  questionSet.appendChild(createOptions());

  form.appendChild(questionSet);
}

function createOptions() {
  // Create fieldset & legend for the options
  const optionSet = createFieldset();
  optionSet.classList.add('form__options');

  const optionLabel = createLabel('Options');
  optionSet.appendChild(optionLabel);

  for (let i = 1; i <= 4; i++) {
    // Create grouping elements for each option
    const group = document.createElement('div');
    group.classList.add('form__group');

    // Create grouping elements for labels and inputs
    const labelRow = createRow();
    const inputRow = createRow();

    const optionLabel = createLabel(`O${i}-description`, `${i}. Option`);
    const validLabel = createLabel(`O${i}-valid`, 'Valid');

    // Hide "Valid" label visually from all but first
    if (i > 1) {
      validLabel.classList.add('visually-hidden');
    }

    labelRow.appendChild(optionLabel);
    labelRow.appendChild(validLabel);

    const optionInput = createInput(`O${i}-description`);
    const validInput = createInput(`O${i}-valid`, 'checkbox');
    inputRow.appendChild(optionInput);
    inputRow.appendChild(validInput);

    group.appendChild(labelRow);
    group.appendChild(inputRow);

    optionSet.append(group);
  }

  return optionSet;
}

function createRemoveBtn() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
</svg>`;

  const button = document.createElement('button');
  button.classList.add('btn', 'btn-icon');
  button.setAttribute('id', 'remove-question');
  button.innerHTML = svg;
  button.addEventListener('click', (e) => {
    handleRemove(e);
  });

  return button;
}

function createRow() {
  const row = document.createElement('div');
  row.classList.add('form__row');

  return row;
}
