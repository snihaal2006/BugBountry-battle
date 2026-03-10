const express = require('express');
const router = express.Router();
const { loginTeam, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/login', loginTeam);
router.get('/me', protect, getMe);

module.exports = router;
