import { categoryButtons } from '../api/categoryApi.js';
import { getNextQuestion } from '../api/game/getNextQuestion.js';

/*
  Draws the starting phase of the game where player can select category, difficulty etc.
*/
export async function drawIndexPage() {
  //parent id: screen

  //Parent area
  const screenDiv = document.getElementById('screen');

  //Reset parent
  screenDiv.innerHTML = '';

  //set title
  const title = document.createElement('h1');
  title.innerText = 'Instructions';

  // TODO: Add simple game instructions below the instructions title

  screenDiv.appendChild(title);

  const optionsDiv = document.createElement('div');
  optionsDiv.classList.add('options', 'options-2');

  screenDiv.appendChild(optionsDiv);

  const chooseCategoryFieldset = document.createElement('fieldset');
  chooseCategoryFieldset.id = 'chooseCategory';
  const categoryLegend = document.createElement('legend');
  categoryLegend.classList.add('xl');
  categoryLegend.textContent = 'Choose Category';

  chooseCategoryFieldset.appendChild(categoryLegend);

  optionsDiv.appendChild(chooseCategoryFieldset);

  //draw categories

  //getCategories from db
  await categoryButtons();

  //draw difficulty

  const difficultyFieldset = document.createElement('fieldset');
  optionsDiv.appendChild(difficultyFieldset);

  const legend = document.createElement('legend');
  legend.innerText = 'Choose Difficulty';
  legend.classList.add('xl');

  difficultyFieldset.appendChild(legend);

  const difficulties = ['easy', 'medium', 'hard'];

  difficulties.forEach((level) => {
    const label = document.createElement('label');
    label.htmlFor = level;
    label.innerText = level;

    const input = document.createElement('input');
    input.type = 'radio';
    input.id = level;
    input.name = 'difficulty';
    input.value = level;

    if (level === 'easy') {
      input.checked = true;
    }

    label.insertAdjacentElement('afterbegin', input);

    difficultyFieldset.appendChild(label);
  });

  const buttonsDiv = document.createElement('div');
  buttonsDiv.classList.add('buttons');

  screenDiv.appendChild(buttonsDiv);

  //draw startGame button

  const startButton = document.createElement('button');
  startButton.classList.add('btn');
  startButton.classList.add('btn-primary');
  startButton.id = 'btnStartGame';
  startButton.innerText = 'Start game';

  buttonsDiv.appendChild(startButton);

  //draw cancel button?
}

/*
  Draws the starting phase of the game where player can select category, difficulty etc.
*/

export async function drawQuestionPhase(gameData) {
  //Parent area
  const screenDiv = document.getElementById('screen');

  //Reset parent
  screenDiv.innerHTML = '';

  //set title
  const title = document.createElement('p');
  title.classList.add('title');
  title.innerText = 'Question';

  screenDiv.appendChild(title);

  //Get next question
  let question = await getNextQuestion(gameData);

  //draw title question as a title?
  const questionP = document.createElement('p');
  questionP.classList.add('lg');
  questionP.innerText = question.question;

  screenDiv.appendChild(questionP);

  //draw option buttons

  const optionsDiv = document.createElement('div');
  optionsDiv.classList.add('options');

  screenDiv.appendChild(optionsDiv);

  for (let index = 0; index < question.options.length; index++) {
    const optionButton = document.createElement('button');
    optionButton.classList.add('btn');
    optionButton.classList.add('btn-option');
    optionButton.innerText = `${index + 1}. ${question.options[index].option}`;
    optionButton.value = index;

    optionsDiv.appendChild(optionButton);
  }
}

export async function drawEndingPhase() {
  //parent id: screen
  const screenDiv = document.getElementById('screen');

  //Reset parent
  screenDiv.innerHTML = '';

  //set title
  const title = document.createElement('p');
  title.classList.add('title');
  title.innerText = 'The End';

  screenDiv.appendChild(title);

  //draw score

  //draw to index button
  const buttonsDiv = document.createElement('div');
  buttonsDiv.classList.add('buttons');

  screenDiv.appendChild(buttonsDiv);

  //draw startGame button

  const indexButton = document.createElement('button');
  indexButton.classList.add('btn');
  indexButton.classList.add('btn-primary');
  indexButton.id = 'btnMainMenu';
  indexButton.innerText = 'Main menu';

  buttonsDiv.appendChild(indexButton);
}
