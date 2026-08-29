const User = require('../models/User');
const Attempt = require('../models/Attempt');

// @desc    Get global leaderboard rankings
// @route   GET /api/leaderboard
// @access  Public
const getLeaderboard = async (req, res) => {
  try {
    const { timeFrame = 'all' } = req.query; // 'weekly', 'monthly', 'all'

    let dateFilter = {};
    const now = new Date();

    if (timeFrame === 'weekly') {
      const lastWeek = new Date(now.setDate(now.getDate() - 7));
      dateFilter = { createdAt: { $gte: lastWeek } };
    } else if (timeFrame === 'monthly') {
      const lastMonth = new Date(now.setMonth(now.getMonth() - 1));
      dateFilter = { createdAt: { $gte: lastMonth } };
    }

    const attempts = await Attempt.find(dateFilter).populate('user', 'name email avatar bio');

    // Group stats by user
    const userStatsMap = {};

    attempts.forEach(att => {
      if (!att.user) return;
      const userId = att.user._id.toString();

      if (!userStatsMap[userId]) {
        userStatsMap[userId] = {
          user: att.user,
          totalQuizzes: 0,
          totalScoreSum: 0,
          highestScore: 0,
          totalCorrect: 0
        };
      }

      userStatsMap[userId].totalQuizzes += 1;
      userStatsMap[userId].totalScoreSum += att.percentage;
      userStatsMap[userId].totalCorrect += att.correctAnswers;
      if (att.percentage > userStatsMap[userId].highestScore) {
        userStatsMap[userId].highestScore = att.percentage;
      }
    });

    // Also include all users even if 0 attempts if all time
    if (timeFrame === 'all') {
      const allUsers = await User.find({ role: 'student' }).select('name email avatar bio');
      allUsers.forEach(u => {
        const uId = u._id.toString();
        if (!userStatsMap[uId]) {
          userStatsMap[uId] = {
            user: u,
            totalQuizzes: 0,
            totalScoreSum: 0,
            highestScore: 0,
            totalCorrect: 0
          };
        }
      });
    }

    const leaderboard = Object.values(userStatsMap).map(item => {
      const avgScore = item.totalQuizzes > 0 ? Math.round(item.totalScoreSum / item.totalQuizzes) : 0;
      // Gamification points formula: (totalQuizzes * 50) + (totalCorrect * 10) + (highestScore * 5)
      const points = (item.totalQuizzes * 50) + (item.totalCorrect * 10) + (item.highestScore * 5);
      return {
        user: item.user,
        totalQuizzes: item.totalQuizzes,
        averageScore: avgScore,
        highestScore: item.highestScore,
        points
      };
    });

    // Sort descending by points, then by averageScore
    leaderboard.sort((a, b) => b.points - a.points || b.averageScore - a.averageScore);

    // Add rank
    const rankedLeaderboard = leaderboard.map((entry, index) => ({
      rank: index + 1,
      ...entry
    }));

    res.json(rankedLeaderboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getLeaderboard };
