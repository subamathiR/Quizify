const mongoose = require('mongoose');

const attemptSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  quizTitle: String,
  category: String,
  answers: [{
    questionId: String,
    selectedOption: Number, // null or 0-3
    correctOption: Number,
    isCorrect: Boolean
  }],
  score: {
    type: Number,
    required: true
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  percentage: {
    type: Number,
    required: true
  },
  correctAnswers: {
    type: Number,
    required: true
  },
  wrongAnswers: {
    type: Number,
    required: true
  },
  unanswered: {
    type: Number,
    required: true
  },
  timeTaken: {
    type: Number, // seconds
    required: true
  },
  status: {
    type: String,
    enum: ['Pass', 'Fail'],
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Attempt', attemptSchema);
