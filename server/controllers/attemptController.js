const Attempt = require('../models/Attempt');
const Quiz = require('../models/Quiz');
const User = require('../models/User');

// Helper to evaluate unlocked badges
const checkAndAwardBadges = (user, attempt, userAttemptsCount, allAttempts) => {
  const existingBadges = new Set(user.badges.map(b => b.id));
  const newBadges = [];

  // Badge 1: First Quiz
  if (userAttemptsCount >= 1 && !existingBadges.has('first_step')) {
    newBadges.push({
      id: 'first_step',
      name: 'First Steps 🚀',
      description: 'Completed your very first quiz!',
      icon: 'Rocket'
    });
  }

  // Badge 2: Perfect Score
  if (attempt.percentage === 100 && !existingBadges.has('perfect_score')) {
    newBadges.push({
      id: 'perfect_score',
      name: 'Perfect Score 🎯',
      description: 'Scored 100% on a quiz!',
      icon: 'Target'
    });
  }

  // Badge 3: 5 Quizzes Completed
  if (userAttemptsCount >= 5 && !existingBadges.has('quiz_enthusiast')) {
    newBadges.push({
      id: 'quiz_enthusiast',
      name: 'Quiz Enthusiast 📚',
      description: 'Completed 5 quizzes!',
      icon: 'BookOpen'
    });
  }

  // Badge 4: 10 Quizzes Completed
  if (userAttemptsCount >= 10 && !existingBadges.has('quiz_master')) {
    newBadges.push({
      id: 'quiz_master',
      name: 'Quiz Master 🏆',
      description: 'Completed 10 quizzes!',
      icon: 'Trophy'
    });
  }

  // Badge 5: Speed Solver
  if (attempt.timeTaken < (attempt.totalQuestions * 15) && attempt.percentage >= 80 && !existingBadges.has('speed_demon')) {
    newBadges.push({
      id: 'speed_demon',
      name: 'Speed Solver ⚡',
      description: 'Completed a quiz rapidly with high accuracy!',
      icon: 'Zap'
    });
  }

  return newBadges;
};

// @desc    Submit quiz attempt & process score
// @route   POST /api/attempts
// @access  Private
const submitQuizAttempt = async (req, res) => {
  try {
    const { quizId, userAnswers, timeTaken } = req.body; // userAnswers: { [questionId or index]: selectedOptionIndex }

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    let correctAnswersCount = 0;
    let wrongAnswersCount = 0;
    let unansweredCount = 0;
    const processedAnswers = [];

    quiz.questions.forEach((q, index) => {
      const userSelected = userAnswers[q._id.toString()] !== undefined ? userAnswers[q._id.toString()] : userAnswers[index];
      
      let isCorrect = false;
      if (userSelected === undefined || userSelected === null) {
        unansweredCount++;
      } else if (Number(userSelected) === q.correctAnswer) {
        correctAnswersCount++;
        isCorrect = true;
      } else {
        wrongAnswersCount++;
      }

      processedAnswers.push({
        questionId: q._id.toString(),
        selectedOption: userSelected !== undefined && userSelected !== null ? Number(userSelected) : null,
        correctOption: q.correctAnswer,
        isCorrect
      });
    });

    const totalQuestions = quiz.questions.length;
    const percentage = Math.round((correctAnswersCount / totalQuestions) * 100);
    const status = percentage >= quiz.passingScore ? 'Pass' : 'Fail';

    const attempt = new Attempt({
      user: req.user._id,
      quiz: quiz._id,
      quizTitle: quiz.title,
      category: quiz.category,
      answers: processedAnswers,
      score: correctAnswersCount,
      totalQuestions,
      percentage,
      correctAnswers: correctAnswersCount,
      wrongAnswers: wrongAnswersCount,
      unanswered: unansweredCount,
      timeTaken: timeTaken || 0,
      status
    });

    const savedAttempt = await attempt.save();

    // Increment quiz attempt count
    quiz.attemptCount += 1;
    await quiz.save();

    // Update User statistics & award badges
    const user = await User.findById(req.user._id);
    const userAttempts = await Attempt.find({ user: user._id });
    
    user.totalQuizzesAttempted = userAttempts.length;
    user.totalScore += correctAnswersCount;
    if (percentage > user.bestScorePercentage) {
      user.bestScorePercentage = percentage;
    }

    const newBadges = checkAndAwardBadges(user, savedAttempt, userAttempts.length, userAttempts);
    if (newBadges.length > 0) {
      user.badges.push(...newBadges);
    }
    await user.save();

    res.status(201).json({
      attempt: savedAttempt,
      newBadgesUnlocked: newBadges,
      quizDetails: quiz
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get attempt details by ID
// @route   GET /api/attempts/:id
// @access  Private
const getAttemptById = async (req, res) => {
  try {
    const attempt = await Attempt.findById(req.params.id)
      .populate('user', 'name email avatar')
      .populate('quiz');

    if (!attempt) {
      return res.status(404).json({ message: 'Attempt record not found' });
    }

    // Ensure users can only view their own attempt unless admin
    if (attempt.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this attempt' });
    }

    res.json(attempt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user's attempts
// @route   GET /api/attempts/my
// @access  Private
const getMyAttempts = async (req, res) => {
  try {
    const attempts = await Attempt.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('quiz', 'title category difficulty');

    res.json(attempts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all attempts across platform (Admin)
// @route   GET /api/attempts/all
// @access  Private/Admin
const getAllAttempts = async (req, res) => {
  try {
    const attempts = await Attempt.find({})
      .sort({ createdAt: -1 })
      .populate('user', 'name email avatar')
      .populate('quiz', 'title category');

    res.json(attempts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  submitQuizAttempt,
  getAttemptById,
  getMyAttempts,
  getAllAttempts
};
