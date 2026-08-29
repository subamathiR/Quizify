const User = require('../models/User');
const Attempt = require('../models/Attempt');

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
      user.avatar = req.body.avatar || user.avatar;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        avatar: updatedUser.avatar,
        bio: updatedUser.bio,
        badges: updatedUser.badges
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user dashboard stats & analytics
// @route   GET /api/users/dashboard
// @access  Private
const getStudentDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const attempts = await Attempt.find({ user: userId }).sort({ createdAt: -1 });

    const totalAttempts = attempts.length;
    let totalScoreSum = 0;
    let totalQuestionsAnswered = 0;
    let bestPercentage = 0;
    let passedCount = 0;
    let categoryMap = {};

    attempts.forEach(att => {
      totalScoreSum += att.percentage;
      totalQuestionsAnswered += att.totalQuestions;
      if (att.percentage > bestPercentage) bestPercentage = att.percentage;
      if (att.status === 'Pass') passedCount++;

      const cat = att.category || 'General';
      if (!categoryMap[cat]) {
        categoryMap[cat] = { count: 0, scoreSum: 0, correct: 0, total: 0 };
      }
      categoryMap[cat].count += 1;
      categoryMap[cat].scoreSum += att.percentage;
      categoryMap[cat].correct += att.correctAnswers;
      categoryMap[cat].total += att.totalQuestions;
    });

    const averageScore = totalAttempts > 0 ? Math.round(totalScoreSum / totalAttempts) : 0;
    const passRate = totalAttempts > 0 ? Math.round((passedCount / totalAttempts) * 100) : 0;

    const categoryPerformance = Object.keys(categoryMap).map(cat => ({
      category: cat,
      averageScore: Math.round(categoryMap[cat].scoreSum / categoryMap[cat].count),
      attempts: categoryMap[cat].count,
      accuracy: Math.round((categoryMap[cat].correct / categoryMap[cat].total) * 100) || 0
    }));

    // Weekly performance trend (recent 7 attempts)
    const recentTrend = attempts.slice(0, 7).reverse().map((att, idx) => ({
      name: `Quiz ${idx + 1}`,
      quizTitle: att.quizTitle,
      score: att.percentage,
      date: new Date(att.createdAt).toLocaleDateString()
    }));

    res.json({
      totalAttempts,
      averageScore,
      bestScore: bestPercentage,
      totalQuestionsAnswered,
      passRate,
      categoryPerformance,
      recentTrend,
      recentAttempts: attempts.slice(0, 5)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { updateProfile, getStudentDashboardStats, getUsers };
