// Helper functions for creating form elements

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
  label.setAttribute('for', labelFor);
  label.textContent = str;

  return label;
}

export function createInput(id, type = 'text') {
  const input = document.createElement('input');
  input.setAttribute('type', type);
  input.setAttribute('id', id);

  return input;
}
