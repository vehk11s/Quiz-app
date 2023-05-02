const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/* 
multichoice = Multiple choice = player chooses one correct answer
multianswer = Multiple answers = player selects all correct answers
boolean = True/False = player selects if the 
*/

const optionsSchema = new Schema({
  option: { type: String, required: true },
  isCorrect: { type: Boolean, required: true, default: false },
});

const questionSchema = new Schema({
  question: { type: String, required: true },
  type: {
    type: String,
    enum: ['multichoice', 'multianswer', 'boolean'],
    default: 'multichoice',
  },
  options: [optionsSchema],
  explanation: { type: String, default: '' },
  hint: { type: String, default: '' },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
});

questionSchema.statics = {
  isValidQuestion(id) {
    return this.findById(id).then((result) => {
      if (!result) throw new Error('Question not found');
    });
  },
};

questionSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const QuestionModel = mongoose.model('Question', questionSchema);
module.exports = QuestionModel;
