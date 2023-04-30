import { postQuestion } from '../api/questionApi.js';
import {
  createFieldset,
  createLegend,
  createLabel,
  createInput,
} from './formHelpers.js';

const addBtn = document.querySelector('#add-question');
const submitBtn = document.querySelector('#submit-form');

let AMT_OF_VISIBLE_QUESTIONS = 1; // Tracks the visible question sets on display, used for dynamical indexing
let AMT_OF_TOTAL_QUESTIONS = 1; // Doesn't decrease when removing a question, used for element ids
const AMT_OF_OPTIONS = 4; // Default amount of options for multichoice questions, used for loops

// Create first question form element on load
document.addEventListener('DOMContentLoaded', () => {
  addQuestion();
  updateIndexing();
});

addBtn.addEventListener('click', (e) => {
  AMT_OF_TOTAL_QUESTIONS += 1;
  AMT_OF_VISIBLE_QUESTIONS += 1;
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
  AMT_OF_VISIBLE_QUESTIONS -= 1;
}

function handleSubmit(e) {
  // Define new array for the questions
  const newQuestions = [];

  const category = document.querySelector('input[name="category"]:checked').id; // Get selected category id
  const questionSets = document.querySelectorAll('.form__question'); // Select each question set by class name

  questionSets.forEach((questionSet) => {
    const QUESTION_NUM = questionSet.id.slice(1, 2); // Get question number
    const questionOptions = [];

    const questionInput = document.querySelector(`#Q${QUESTION_NUM}`);

    // Select all corresponding options sets inside parent
    for (let j = 1; j <= AMT_OF_OPTIONS; j++) {
      const OPTION_NUM = j;
      const optionSets = questionSet.querySelectorAll(
        `[id^='${QUESTION_NUM}O${OPTION_NUM}']`
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
}

function updateIndexing() {
  const legends = document.querySelectorAll('.form__question > legend');

  legends.forEach((legend, i) => {
    const QUESTION_INDEX = i + 1;
    legend.textContent = '';
    legend.textContent = `${QUESTION_INDEX}. Question`;
  });
}

function addQuestion() {
  const form = document.querySelector('.form__content');

  const questionSet = createFieldset();
  questionSet.classList.add('form__question');
  questionSet.setAttribute('id', `Q${AMT_OF_TOTAL_QUESTIONS}-group`);
  questionSet.appendChild(createRemoveBtn());

  const questionLegend = createLegend(`${AMT_OF_VISIBLE_QUESTIONS}. Question`);
  questionSet.appendChild(questionLegend);

  const questionLabel = createLabel(`Q${AMT_OF_TOTAL_QUESTIONS}`, 'Question');
  const questionInput = createInput(`Q${AMT_OF_TOTAL_QUESTIONS}`);

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

  for (let i = 1; i <= AMT_OF_OPTIONS; i++) {
    const OPTION_NUM = i;
    // Create grouping elements for each option
    const group = document.createElement('div');
    group.classList.add('form__group');

    // Create grouping elements for labels and inputs
    const labelRow = createRow();
    const inputRow = createRow();

    const optionLabel = createLabel(
      `${AMT_OF_TOTAL_QUESTIONS}O${OPTION_NUM}-description`,
      `${OPTION_NUM}. Option`
    );
    const validLabel = createLabel(
      `${AMT_OF_TOTAL_QUESTIONS}O${OPTION_NUM}-valid`,
      'Valid'
    );

    // Hide "Valid" label visually from all but first
    if (OPTION_NUM > 1) {
      validLabel.classList.add('visually-hidden');
    }

    labelRow.appendChild(optionLabel);
    labelRow.appendChild(validLabel);

    const optionInput = createInput(
      `${AMT_OF_TOTAL_QUESTIONS}O${OPTION_NUM}-description`
    );
    const validInput = createInput(
      `${AMT_OF_TOTAL_QUESTIONS}O${OPTION_NUM}-valid`,
      'checkbox'
    );
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
