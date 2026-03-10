const supabase = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });
};

const loginTeam = async (req, res) => {
    const { teamId, password } = req.body;

    try {
        const { data: team, error } = await supabase
            .from('teams')
            .select('*')
            .eq('team_id', teamId)
            .single();

        if (error || !team) {
            return res.status(401).json({ message: 'Invalid team ID or password' });
        }

        if (await bcrypt.compare(password, team.password)) {
            // Block disqualified teams from logging in
            if (team.is_disqualified) {
                return res.status(403).json({ message: 'ACCESS DENIED: Your team has been disqualified. Contact an administrator.' });
            }
            res.json({
                _id: team.id,
                teamId: team.team_id,
                score: team.score,
                problemsSolved: team.problems_solved,
                token: generateToken(team.id)
            });
        } else {
            res.status(401).json({ message: 'Invalid team ID or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMe = async (req, res) => {
    res.json(req.team);
};

module.exports = { loginTeam, getMe };
