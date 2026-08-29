const Quiz = require('../models/Quiz');

// @desc    Fetch all quizzes with search, filter, sort & pagination
// @route   GET /api/quizzes
// @access  Public
const getQuizzes = async (req, res) => {
  try {
    const { search, category, difficulty, sort, page = 1, limit = 9, publishedOnly = 'true' } = req.query;

    let query = {};

    if (publishedOnly === 'true') {
      query.published = true;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    if (category && category !== 'All') {
      query.category = { $regex: `^${category}$`, $options: 'i' };
    }

    if (difficulty && difficulty !== 'All') {
      query.difficulty = difficulty;
    }

    let sortOptions = { createdAt: -1 };
    if (sort === 'popular') sortOptions = { attemptCount: -1 };
    if (sort === 'rating') sortOptions = { averageRating: -1 };
    if (sort === 'oldest') sortOptions = { createdAt: 1 };
    if (sort === 'title') sortOptions = { title: 1 };

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const total = await Quiz.countDocuments(query);
    const quizzes = await Quiz.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    res.json({
      quizzes,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      totalQuizzes: total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single quiz by ID
// @route   GET /api/quizzes/:id
// @access  Public
const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (quiz) {
      res.json(quiz);
    } else {
      res.status(404).json({ message: 'Quiz not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a quiz (Admin)
// @route   POST /api/quizzes
// @access  Private/Admin
const createQuiz = async (req, res) => {
  try {
    const { title, description, category, difficulty, duration, passingScore, questions, published } = req.body;

    const quiz = new Quiz({
      title,
      description,
      category,
      difficulty: difficulty || 'Medium',
      duration: Number(duration) || 15,
      passingScore: Number(passingScore) || 60,
      questions: questions || [],
      published: published !== undefined ? published : true
    });

    const createdQuiz = await quiz.save();
    res.status(201).json(createdQuiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a quiz (Admin)
// @route   PUT /api/quizzes/:id
// @access  Private/Admin
const updateQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (quiz) {
      quiz.title = req.body.title || quiz.title;
      quiz.description = req.body.description || quiz.description;
      quiz.category = req.body.category || quiz.category;
      quiz.difficulty = req.body.difficulty || quiz.difficulty;
      quiz.duration = req.body.duration !== undefined ? req.body.duration : quiz.duration;
      quiz.passingScore = req.body.passingScore !== undefined ? req.body.passingScore : quiz.passingScore;
      quiz.published = req.body.published !== undefined ? req.body.published : quiz.published;

      if (req.body.questions) {
        quiz.questions = req.body.questions;
      }

      const updatedQuiz = await quiz.save();
      res.json(updatedQuiz);
    } else {
      res.status(404).json({ message: 'Quiz not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a quiz (Admin)
// @route   DELETE /api/quizzes/:id
// @access  Private/Admin
const deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (quiz) {
      await Quiz.deleteOne({ _id: req.params.id });
      res.json({ message: 'Quiz removed successfully' });
    } else {
      res.status(404).json({ message: 'Quiz not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add question to a quiz (Admin)
// @route   POST /api/quizzes/:id/questions
// @access  Private/Admin
const addQuestion = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    const { questionText, options, correctAnswer, explanation } = req.body;
    quiz.questions.push({
      questionText,
      options,
      correctAnswer: Number(correctAnswer),
      explanation: explanation || ''
    });

    await quiz.save();
    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update question in a quiz (Admin)
// @route   PUT /api/quizzes/:id/questions/:questionId
// @access  Private/Admin
const updateQuestion = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    const question = quiz.questions.id(req.params.questionId);
    if (!question) return res.status(404).json({ message: 'Question not found' });

    question.questionText = req.body.questionText || question.questionText;
    question.options = req.body.options || question.options;
    question.correctAnswer = req.body.correctAnswer !== undefined ? Number(req.body.correctAnswer) : question.correctAnswer;
    question.explanation = req.body.explanation !== undefined ? req.body.explanation : question.explanation;

    await quiz.save();
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete question from quiz (Admin)
// @route   DELETE /api/quizzes/:id/questions/:questionId
// @access  Private/Admin
const deleteQuestion = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    quiz.questions = quiz.questions.filter(q => q._id.toString() !== req.params.questionId);
    await quiz.save();
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getQuizzes,
  getQuizById,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  addQuestion,
  updateQuestion,
  deleteQuestion
};
