const jwt = require('jsonwebtoken');
const supabase = require('../config/db');

const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');

            const { data: team, error } = await supabase
                .from('teams')
                .select('*')
                .eq('id', decoded.id)
                .single();

            if (error || !team) throw new Error('Not authorized');

            req.team = {
                _id: team.id,
                teamId: team.team_id,
                score: team.score,
                problemsSolved: team.problems_solved
            };
            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const adminProtect = (req, res, next) => {
    const adminSecret = req.headers['x-admin-secret'];
    if (adminSecret === (process.env.ADMIN_SECRET || 'admin123')) {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as admin' });
    }
};

module.exports = { protect, adminProtect };
