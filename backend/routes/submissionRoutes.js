const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { runCode, submitCode, reportSuspiciousActivity } = require('../controllers/submissionController');

router.post('/run', protect, runCode);
router.post('/submit', protect, submitCode);
router.post('/suspicious', protect, reportSuspiciousActivity);

module.exports = router;
