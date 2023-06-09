const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  category: { type: String, required: true },
});

categorySchema.statics = {
  isValidCategory(id) {
    return this.findById(id).then((result) => {
      if (!result) throw new Error('Category not found');
    });
  },
};

/* 
transform returned object's id to a more readable format by
removing the _-prefix and converting the value to string
*/
categorySchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const CategoryModel = mongoose.model('Category', categorySchema);
module.exports = CategoryModel;
