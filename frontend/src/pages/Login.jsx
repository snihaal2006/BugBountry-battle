import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Terminal, Lock, Key } from 'lucide-react';
import axios from 'axios';

const Login = ({ setTeam }) => {
    const [teamId, setTeamId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { data } = await axios.post('/auth/login', { teamId, password });
            localStorage.setItem('teamInfo', JSON.stringify(data));
            localStorage.setItem('token', data.token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
            setTeam(data);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Authentication Failed. Access Denied.');
        }
        setLoading(false);
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh] font-cyber relative z-10">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="glass-panel p-10 max-w-sm w-full border-t-4 border-t-neonviolet mx-4 relative"
            >
                <div className="absolute -top-4 -right-4 text-neonviolet opacity-50">
                    <Terminal size={48} />
                </div>

                <h2 className="text-3xl mb-2 font-display uppercase tracking-widest text-center text-neonviolet font-bold drop-shadow-[0_0_10px_rgba(124,58,237,0.8)]">
                    System Login
                </h2>
                <p className="text-gray-400 text-center text-sm mb-6 pb-4 border-b border-gray-800">
                    BugBounty Battle Arena
                </p>

                {error && (
                    <motion.p
                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                        className="text-red-500 mb-4 text-center border border-red-500 p-2 bg-red-900/20 animate-pulse"
                    >
                        [ ERROR ]: {error}
                    </motion.p>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 text-gray-500" size={20} />
                        <input
                            type="text"
                            className="w-full bg-deepblack border border-gray-700 text-white p-3 pl-10 focus:outline-none focus:border-neonviolet focus:shadow-neon transition-all"
                            placeholder="Team ID : e.g. TEAM-001"
                            value={teamId}
                            onChange={(e) => setTeamId(e.target.value)}
                            required
                        />
                    </div>
                    <div className="relative">
                        <Key className="absolute left-3 top-3 text-gray-500" size={20} />
                        <input
                            type="password"
                            className="w-full bg-deepblack border border-gray-700 text-white p-3 pl-10 focus:outline-none focus:border-neonviolet focus:shadow-neon transition-all"
                            placeholder="Authorization Key"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full cyber-button mt-4"
                    >
                        {loading ? 'Authenticating...' : 'Initiate Override'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default Login;
