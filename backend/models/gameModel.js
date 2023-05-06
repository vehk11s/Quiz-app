const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/* 
With timestamps set to true, Mongoose will add createdAt and updatedAt properties to the Schema.
createdAt represents a date when the document was created / inserted
updatedAt represents a date when the document was last updated (save, update, replace etc.)
*/

const gameSchema = new Schema(
  {
    player: { type: String, required: true },
    score: { type: Number, required: true },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'easy',
    },
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    questions: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
    questionsAnswered: { type: Number, default: 0 },
    state: { type: Number, default: 1 },
  },
  { timestamps: true }
);

gameSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const GameModel = mongoose.model('Game', gameSchema);
module.exports = GameModel;
