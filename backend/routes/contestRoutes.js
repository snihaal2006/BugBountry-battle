const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getContest, getContestProblems, getProblemDetails, getLeaderboard } = require('../controllers/contestController');

router.get('/', protect, getContest);
router.get('/problems', protect, getContestProblems);
router.get('/problems/:id', protect, getProblemDetails);
router.get('/leaderboard', protect, getLeaderboard);

module.exports = router;
