// Helper functions for creating form elements

export function createForm(id, title) {
  const form = document.createElement('form');
  form.id = id;

  const formTitle = document.createElement('p');
  formTitle.classList.add('xl');
  formTitle.textContent = title;

  form.appendChild(formTitle);

  return form;
}

export function createLegend(str) {
  const legend = document.createElement('legend');
  legend.textContent = str;

  return legend;
}

export function createFieldset() {
  const fieldset = document.createElement('fieldset');
  return fieldset;
}

export function createLabel(labelFor, str) {
  const label = document.createElement('label');
  label.htmlFor = labelFor;
  label.textContent = str;

  return label;
}

export function createInput(id, type = 'text', name, required = true, value) {
  const input = document.createElement('input');
  input.type = type;
  input.id = id;
  if (name) {
    input.name = name;
  }
  input.required = required;

  if (value) {
    input.value = value;
  }

  return input;
}

export function createBtn(text, id) {
  const button = document.createElement('button');
  button.classList.add('btn');

  button.id = id;
  button.textContent = text;

  return button;
}

export function createDiv(className) {
  const div = document.createElement('div');
  div.classList.add(className);

  return div;
}
