const express = require('express');
const router = express.Router();
const { adminProtect } = require('../middleware/authMiddleware');
const {
    createTeam, getTeams,
    createProblem, getProblems,
    addTestCase,
    updateContest, getContestStatus,
    resetTeam, getDisqualifiedTeams, getActiveTeams
} = require('../controllers/adminController');

router.use(adminProtect);

router.post('/teams', createTeam);
router.get('/teams', getTeams);
router.post('/teams/:teamId/reset', resetTeam);
router.get('/teams/disqualified', getDisqualifiedTeams);
router.get('/teams/active', getActiveTeams);

router.post('/problems', createProblem);
router.get('/problems', getProblems);

router.post('/testcases', addTestCase);

router.put('/contest', updateContest);
router.get('/contest', getContestStatus);

module.exports = router;
