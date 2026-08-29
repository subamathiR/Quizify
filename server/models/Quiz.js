const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: [true, 'Question text is required']
  },
  options: {
    type: [String],
    validate: [arrayLimit, 'Options must have exactly 4 choices']
  },
  correctAnswer: {
    type: Number,
    required: [true, 'Correct answer index is required'],
    min: 0,
    max: 3
  },
  explanation: {
    type: String,
    default: 'No explanation provided.'
  }
});

function arrayLimit(val) {
  return val.length === 4;
}

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Quiz title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Quiz description is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  duration: {
    type: Number,
    required: [true, 'Duration in minutes is required'],
    min: 1
  },
  passingScore: {
    type: Number,
    default: 60,
    min: 0,
    max: 100
  },
  published: {
    type: Boolean,
    default: true
  },
  attemptCount: {
    type: Number,
    default: 0
  },
  averageRating: {
    type: Number,
    default: 4.5
  },
  questions: [questionSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Quiz', quizSchema);
