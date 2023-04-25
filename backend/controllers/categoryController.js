const { Collection } = require('mongoose');
const Category = require('../models/categoryModel');

// GET all categories 
exports.get_categories = async function (req, res) {
  const categories = await Category.find()
  .then((data) => {
    res.json(data)
  });
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

// Get one category
exports.get_category = async function (req, res) {
  try{
    const data = await Category.findById(req.params.id);
    res.json(data);
  }
  catch(error)
  {
    res.status(500).json({message: error.message});
  }
};

// PUT Update category by id
exports.edit_category = async function (req,res) {
  try {
    const id = req.params.id;
    const updatedData = req.body;
    const options = { new: true};

    const result = await Category.findByIdAndUpdate(
      id, updatedData, options
    );

    res.send(result);
  }
  catch (error) {
    res.status(400).json({message: error.message});
  }
};


// DELETE category
//exports.delete_category  