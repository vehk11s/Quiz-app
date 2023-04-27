import { postQuestion } from '../api/questionApi.js';

let questions = 1;

let addBtn = document.querySelector('#add-question');
let submitBtn = document.querySelector('#submit-form');

// Create first question form element
document.addEventListener('DOMContentLoaded', () => {
  addQuestion();
});

addBtn.addEventListener('click', (e) => {
  questions += 1;
  addQuestion();
  e.preventDefault();
});

submitBtn.addEventListener('click', (e) => {
  e.preventDefault();

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

    formData.push({ question: formValues[0].value, options });
  });

  console.log(formData);

  postQuestion(formData);
});

const addQuestion = () => {
  const form = document.querySelector('.form__content');

  const questionSet = createFieldset('question', `${questions}. Question`);

  const questionLabel = createLabel(`Q${questions}`, 'Question');
  const questionInput = createInput(`Q${questions}`);

  questionLabel.appendChild(questionInput);

  questionSet.appendChild(questionLabel);
  questionSet.appendChild(createOptionInputs());

  form.appendChild(questionSet);
};

function createOptionInputs() {
  // Create fieldset & legend for the options
  const optionSet = createFieldset('options', 'Options');

  for (let i = 1; i <= 4; i++) {
    // Create grouping elements for each option
    const group = document.createElement('div');
    group.classList.add('form__group');

    // Create grouping elements for labels and inputs
    const labelRow = createRow();
    const inputRow = createRow();

    const optionLabel = createLabel(`O${i}-description`, `${i}. Option`);
    const validLabel = createLabel(`O${i}-valid`, 'Valid');
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

function createFieldset(group, legendText) {
  const fieldset = document.createElement('fieldset');
  fieldset.classList.add(`form__${group}`);

  const legend = document.createElement('legend');
  legend.textContent = legendText;

  fieldset.appendChild(legend);

  return fieldset;
}

function createLabel(htmlFor, labelText) {
  const label = document.createElement('label');
  label.textContent = labelText;
  label.setAttribute('for', htmlFor);

  return label;
}

function createInput(id, type = 'text') {
  const input = document.createElement('input');
  input.setAttribute('type', type);
  input.setAttribute('id', id);

  return input;
}

function createRow() {
  const row = document.createElement('div');
  row.classList.add('form__row');

  return row;
}
