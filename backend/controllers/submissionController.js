const axios = require('axios');
const supabase = require('../config/db');

// Using the free public Judge0 CE instance - no API key required
const JUDGE0_URL = process.env.JUDGE0_URL || 'https://judge0-ce.p.rapidapi.com';
const USE_RAPIDAPI = !!process.env.JUDGE0_API_KEY;

const getHeaders = () => {
    if (USE_RAPIDAPI) {
        return {
            'Content-Type': 'application/json',
            'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
            'x-rapidapi-key': process.env.JUDGE0_API_KEY
        };
    }
    // Free public Judge0 CE - no auth needed
    return { 'Content-Type': 'application/json' };
};

const FREE_JUDGE0_URL = 'https://ce.judge0.com';

const getLanguageId = (language) => {
    const map = {
        'javascript': 63,
        'python': 71,
        'java': 62,
        'cpp': 54,
        'c': 50
    };
    return map[language.toLowerCase()] || 71;
};

exports.runCode = async (req, res) => {
    const { code, language, input } = req.body;

    try {
        const apiUrl = USE_RAPIDAPI ? JUDGE0_URL : FREE_JUDGE0_URL;
        const response = await axios.post(`${apiUrl}/submissions?base64_encoded=false&wait=true`, {
            source_code: code,
            language_id: getLanguageId(language),
            stdin: input || ''
        }, { headers: getHeaders() });

        res.json({
            stdout: response.data.stdout,
            stderr: response.data.stderr,
            compile_output: response.data.compile_output,
            time: response.data.time,
            memory: response.data.memory,
            description: response.data.status?.description
        });
    } catch (err) {
        res.status(500).json({ message: 'Error communicating with Judge0 API', error: err.message });
    }
};

exports.submitCode = async (req, res) => {
    const { problemId, code, language } = req.body;
    const teamId = req.team._id;

    try {
        const { data: testCases, error: tcError } = await supabase
            .from('test_cases')
            .select('*')
            .eq('problem_id', problemId);

        if (tcError) throw tcError;

        if (!testCases || testCases.length === 0) {
            return res.status(400).json({ message: 'No test cases found for this problem.' });
        }

        let allPassed = true;
        let failedTestCase = null;

        for (let testCase of testCases) {
            const apiUrl = USE_RAPIDAPI ? JUDGE0_URL : FREE_JUDGE0_URL;
            const response = await axios.post(`${apiUrl}/submissions?base64_encoded=false&wait=true`, {
                source_code: code,
                language_id: getLanguageId(language),
                stdin: testCase.input,
                expected_output: testCase.expected_output
            }, { headers: getHeaders() });

            const status = response.data.status.id;
            // 3 = "Accepted"
            if (status !== 3) {
                allPassed = false;
                failedTestCase = response.data.status.description;
                break;
            }
        }

        const finalResult = allPassed ? 'Accepted' : failedTestCase;

        const { data: submission } = await supabase
            .from('submissions')
            .insert([{
                team_id: teamId,
                problem_id: problemId,
                code,
                language,
                result: finalResult
            }])
            .select()
            .single();

        if (allPassed) {
            const { data: team } = await supabase.from('teams').select('score, problems_solved').eq('id', teamId).single();
            const { data: probInfo } = await supabase.from('problems').select('order_index').eq('id', problemId).single();

            // Only increment score and problems_solved if this is the EXACT NEXT sequence problem they needed to solve
            if (probInfo.order_index === team.problems_solved + 1) {
                await supabase
                    .from('teams')
                    .update({
                        score: team.score + 100,
                        problems_solved: team.problems_solved + 1,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', teamId);
            }
        }

        res.json(submission);
    } catch (err) {
        res.status(500).json({ message: 'Error during submission', error: err.message });
    }
};

exports.reportSuspiciousActivity = async (req, res) => {
    const teamId = req.team._id;
    try {
        const { data: team, error } = await supabase.from('teams').select('tab_switches').eq('id', teamId).single();
        if (error) throw error;

        let newSwitches = team.tab_switches + 1;
        let disqualified = newSwitches >= 6;

        await supabase.from('teams')
            .update({ tab_switches: newSwitches, is_disqualified: disqualified })
            .eq('id', teamId);

        res.json({
            message: 'Suspicious activity logged',
            tabSwitches: newSwitches,
            isDisqualified: disqualified
        });
    } catch (err) {
        res.status(500).json({ message: 'Error reporting activity', error: err.message });
    }
};
