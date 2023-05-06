import {
  getCategories,
} from '../api/categoryApi.js';

// This function creates buttons for selecting category

export async function drawCategoryButtons() {
    getCategories().then((data) => {
      let buttons = document.getElementById('chooseCategory');
      data.forEach(function (object) {
        const categoryName = object.category;
        const categoryId = object.id;
  
        const label = document.createElement('label');
        label.htmlFor = categoryName;
        label.innerText = categoryName;
  
        const input = document.createElement('input');
        input.type = 'radio';
        input.id = categoryName;
        input.name = 'category';
        input.value = categoryId;
  
        label.insertAdjacentElement('beforeend', input);
        buttons.appendChild(label);
      });
    });
  }