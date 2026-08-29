const express = require('express');
const router = express.Router();
const { updateProfile, getStudentDashboardStats, getUsers } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

router.put('/profile', protect, updateProfile);
router.get('/dashboard', protect, getStudentDashboardStats);
router.get('/', protect, admin, getUsers);

module.exports = router;
