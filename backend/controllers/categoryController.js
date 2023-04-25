const { Collection } = require('mongoose');
const Category = require('../models/categoryModel');

// GET all categories 
exports.get_categories = function (req, res) {
  Category.find().then((data) => res.json(data));
};

// POST new category
exports.add_category = function (req, res) {
  const body = req.body;
  console.log(req.body);

  if (body.category === undefined) {
    return res.status(400).json({ error: 'Category name missing' });
  }

  const category = new Category({
    category: body.category,
  });

  category.save().then((saved) => {
    res.json(saved);
  });
};



// PUT Update category
//exports.edit_category

// DELETE category
//exports.delete_category  