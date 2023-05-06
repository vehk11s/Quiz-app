const url = 'http://127.0.0.1:3000/categories/';

// Get all categories
export async function getCategories() {
  const settings = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  };

  try {
    let response = await fetch(url, settings);
    const categories = await response.json();

    return categories;
  } catch (error) {
    console.log('Error while fetching the categories.', error);
    return 0;
  }
}

// Get category by id
export async function getCategory(id) {
  const settings = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  };

  try {
    let response = await fetch(url + id, settings);
    const category = await response.json();

    return category;
  } catch (error) {
    console.log('Error while fetching the category.', error);
    return 0;
  }
}

// Update category by id (PUT)
export async function updateCategory(data, id) {
  const settings = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  };

  try {
    let response = await fetch(url + id, settings);
    const category = await response.json();

    return category;
  } catch (error) {
    console.log('Error while updating the category.', error);
    return 0;
  }
}

// Post new category
export async function postCategory(data) {
  const settings = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  };

  let response = await fetch(url, settings);

  const newCategory = await response.json();

  return newCategory;
}

// Delete a category
export async function deleteCategory(id) {
  const settings = {
    method: 'DELETE',
  };

  try {
    let response = await fetch(url + id, settings);
    const deletedCategory = await response;

    console.log(id + 'deleted');
    return deletedCategory;
  } catch (error) {
    console.log('Error while deleting the category.', error);
    return 0;
  }
}