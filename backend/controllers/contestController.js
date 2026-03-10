const supabase = require('../config/db');

exports.getContest = async (req, res) => {
    try {
        const { data: contest, error } = await supabase.from('contest').select('*').limit(1).maybeSingle();
        if (error) console.error(error);
        res.json(contest || { status: 'running', title: 'BugBounty Battle', rules: 'Solve the buggy code. Tab switches are logged.' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getContestProblems = async (req, res) => {
    try {
        const { data: contest } = await supabase.from('contest').select('status').limit(1).maybeSingle();
        if (contest && contest.status === 'upcoming') {
            return res.status(403).json({ message: 'Contest has not started yet.' });
        }
        const { data: problems, error } = await supabase
            .from('problems')
            .select('id, title, description, order_index')
            .order('order_index', { ascending: true });
        if (error) throw error;
        // Map id to _id for frontend compatibility
        const mapped = problems.map(p => ({ ...p, _id: p.id }));
        res.json(mapped);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getProblemDetails = async (req, res) => {
    try {
        const { data: contest } = await supabase.from('contest').select('status').limit(1).maybeSingle();
        if (contest && contest.status === 'upcoming') {
            return res.status(403).json({ message: 'Contest has not started yet.' });
        }
        const { data: problem, error } = await supabase.from('problems').select('*').eq('id', req.params.id).single();
        if (error || !problem) return res.status(404).json({ message: 'Problem not found' });
        problem._id = problem.id;
        res.json(problem);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getLeaderboard = async (req, res) => {
    try {
        const { data: teams, error } = await supabase
            .from('teams')
            .select('team_id, score, problems_solved, updated_at')
            .eq('is_disqualified', false)
            .order('score', { ascending: false })
            .order('problems_solved', { ascending: false })
            .order('updated_at', { ascending: true });

        if (error) throw error;

        // map fields for frontend
        const mapped = teams.map(t => ({
            _id: t.team_id,
            teamId: t.team_id,
            score: t.score,
            problemsSolved: t.problems_solved,
            updatedAt: t.updated_at
        }));

        res.json(mapped);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
