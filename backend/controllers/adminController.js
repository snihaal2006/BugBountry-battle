const supabase = require('../config/db');
const bcrypt = require('bcryptjs');

exports.createTeam = async (req, res) => {
    const { teamId, plainPassword } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash(plainPassword, salt);

        const { data: team, error } = await supabase
            .from('teams')
            .insert([{ team_id: teamId, password }])
            .select()
            .single();

        if (error) throw error;
        res.status(201).json({ teamId, plainPassword, _id: team.id });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getTeams = async (req, res) => {
    const { data: teams, error } = await supabase
        .from('teams')
        .select('id, team_id, score, problems_solved, tab_switches, is_disqualified, created_at, updated_at');

    if (error) return res.status(500).json({ message: error.message });
    res.json(teams);
};

exports.createProblem = async (req, res) => {
    try {
        const { title, description, orderIndex, codeC, lockedC, codeCpp, lockedCpp, codeJava, lockedJava, codePython, lockedPython, sampleInput, sampleOutput } = req.body;
        const { data: problem, error } = await supabase
            .from('problems')
            .insert([{
                title, description, order_index: orderIndex,
                sample_input: sampleInput, sample_output: sampleOutput,
                code_c: codeC, locked_lines_c: lockedC,
                code_cpp: codeCpp, locked_lines_cpp: lockedCpp,
                code_java: codeJava, locked_lines_java: lockedJava,
                code_python: codePython, locked_lines_python: lockedPython
            }])
            .select()
            .single();

        if (error) throw error;
        res.status(201).json({ ...problem, _id: problem.id });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getProblems = async (req, res) => {
    const { data: problems } = await supabase.from('problems').select('*').order('order_index', { ascending: true });
    // Keep it as raw data, frontend will parse language dynamically
    const mapped = (problems || []).map(p => ({ ...p, _id: p.id }));
    res.json(mapped);
};

exports.addTestCase = async (req, res) => {
    try {
        const { problem, input, expectedOutput } = req.body;
        const { data: testcase, error } = await supabase
            .from('test_cases')
            .insert([{ problem_id: problem, input, expected_output: expectedOutput }])
            .select()
            .single();

        if (error) throw error;
        res.status(201).json({ ...testcase, _id: testcase.id });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.updateContest = async (req, res) => {
    try {
        const { status, rules, title } = req.body;

        // Get single contest row
        const { data: contest } = await supabase.from('contest').select('id').limit(1).single();

        let result;
        if (!contest) {
            result = await supabase.from('contest').insert([{ status, rules, title }]).select().single();
        } else {
            result = await supabase.from('contest').update(req.body).eq('id', contest.id).select().single();
        }

        if (result.error) throw result.error;
        res.json(result.data);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getContestStatus = async (req, res) => {
    let { data: contest } = await supabase.from('contest').select('*').limit(1).maybeSingle();
    if (!contest) {
        const res2 = await supabase.from('contest').insert([{}]).select().single();
        contest = res2.data;
    }
    res.json(contest || {});
};

// Reset individual team: clear violations, disqualification, score, progress
exports.resetTeam = async (req, res) => {
    try {
        const { teamId } = req.params;
        const { error } = await supabase
            .from('teams')
            .update({
                tab_switches: 0,
                is_disqualified: false,
                score: 0,
                problems_solved: 0,
                updated_at: new Date().toISOString()
            })
            .eq('id', teamId);
        if (error) throw error;
        res.json({ message: `Team ${teamId} reset successfully.` });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all disqualified teams
exports.getDisqualifiedTeams = async (req, res) => {
    const { data: teams, error } = await supabase
        .from('teams')
        .select('id, team_id, tab_switches, score, problems_solved, updated_at')
        .eq('is_disqualified', true)
        .order('updated_at', { ascending: false });
    if (error) return res.status(500).json({ message: error.message });
    res.json(teams || []);
};

// Get active teams (last activity within 15 minutes)
exports.getActiveTeams = async (req, res) => {
    const since = new Date(Date.now() - 15 * 60 * 1000).toISOString();
    const { data: teams, error } = await supabase
        .from('teams')
        .select('id, team_id, score, problems_solved, tab_switches, is_disqualified, updated_at')
        .eq('is_disqualified', false)
        .gte('updated_at', since)
        .order('updated_at', { ascending: false });
    if (error) return res.status(500).json({ message: error.message });
    res.json(teams || []);
};
