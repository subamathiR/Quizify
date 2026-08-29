const express = require('express');
const router = express.Router();
const {
  submitQuizAttempt,
  getAttemptById,
  getMyAttempts,
  getAllAttempts
} = require('../controllers/attemptController');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

router.post('/', protect, submitQuizAttempt);
router.get('/my', protect, getMyAttempts);
router.get('/all', protect, admin, getAllAttempts);
router.get('/:id', protect, getAttemptById);

module.exports = router;
