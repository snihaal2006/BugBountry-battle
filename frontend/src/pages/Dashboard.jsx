import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ShieldAlert, TerminalSquare, AlertTriangle, LogOut, Award } from 'lucide-react';

const Dashboard = ({ team, setTeam }) => {
    const [contest, setContest] = useState(null);
    const [problems, setProblems] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Configure axios token on reload
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;

        // Always refresh team data from server to get latest problems_solved / score
        axios.get('/auth/me')
            .then(res => {
                if (res.data && setTeam) {
                    setTeam(prev => ({ ...prev, ...res.data }));
                }
            })
            .catch(err => console.error('Failed to refresh team data', err));

        axios.get('/contest')
            .then(res => setContest(res.data))
            .catch(err => console.error(err));

        axios.get('/contest/problems')
            .then(res => setProblems(res.data))
            .catch(err => setError(err.response?.data?.message || 'Failed to retrieve problems.'));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('teamInfo');
        localStorage.removeItem('token');
        setTeam(null);
        navigate('/login');
    };

    if (!contest) return <div className="text-neonviolet text-center mt-20 text-2xl animate-pulse">Establishing Connection...</div>;

    return (
        <div className="max-w-6xl mx-auto w-full relative z-10 flex flex-col h-full">
            {/* Header */}
            <header className="flex justify-between items-center bg-black/60 border-b border-neonviolet p-4 mb-8 glass-panel shadow-neon">
                <div className="flex items-center space-x-4">
                    <TerminalSquare className="text-neonviolet" size={32} />
                    <div>
                        <h1 className="text-2xl font-display uppercase font-bold text-white drop-shadow-[0_0_8px_rgba(124,58,237,0.8)]">
                            {contest.title}
                        </h1>
                        <p className="text-xs text-cyberpurple uppercase tracking-widest px-1">Status: {contest.status}</p>
                    </div>
                </div>

                <div className="flex items-center space-x-6">
                    <div className="text-right">
                        <p className="text-gray-400 text-sm">Target Acquired: {team.teamId}</p>
                        <p className="text-neonviolet font-bold font-display">
                            SCORE: <span className="text-white">{team.score}</span>
                            <span className="text-gray-500 mx-2">|</span>
                            SOLVED: <span className="text-white">{team.problemsSolved}</span>
                        </p>
                    </div>
                    <button onClick={() => navigate('/leaderboard')} className="border border-neonviolet text-neonviolet p-2 hover:bg-neonviolet hover:text-white transition-colors">
                        <Award size={20} />
                    </button>
                    <button onClick={handleLogout} className="border border-red-500 text-red-500 p-2 hover:bg-red-500 hover:text-white transition-colors">
                        <LogOut size={20} />
                    </button>
                </div>
            </header>

            {/* Rules Banner */}
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="mb-8 border-l-4 border-yellow-500 bg-yellow-900/20 p-4 text-yellow-200 text-sm flex items-start space-x-3"
            >
                <AlertTriangle className="mt-1 flex-shrink-0" size={20} />
                <div>
                    <h3 className="font-bold uppercase mb-1 drop-shadow-[0_0_5px_rgba(234,179,8,0.8)]">Protocol Rules</h3>
                    <p>{contest.rules}</p>
                </div>
            </motion.div>

            {/* Main Content */}
            <div className="flex-1">
                <h2 className="text-xl font-display text-cyberpurple uppercase tracking-wider mb-6 pb-2 border-b border-gray-800 flex items-center">
                    <ShieldAlert className="mr-2" size={24} /> Available Targets
                </h2>

                {error ? (
                    <div className="text-red-500 p-8 text-center border-t border-b border-red-900 bg-red-900/10">
                        [ACCESS DENIED]: {error}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {problems.map((prob, idx) => {
                            // If problems_solved is 0, they can open index 1.
                            // General rule: unlock if prob.order_index <= team.problemsSolved + 1
                            const isUnlocked = prob.order_index <= team.problemsSolved + 1;
                            const isCompleted = prob.order_index <= team.problemsSolved;

                            return (
                                <motion.div
                                    key={prob._id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.1 }}
                                    onClick={() => isUnlocked && navigate(`/problem/${prob._id}`)}
                                    className={`group p-6 glass-panel border ${isUnlocked ? 'border-gray-800 hover:border-neonviolet cursor-pointer hover:shadow-neon hover:-translate-y-1' : 'border-red-900/50 cursor-not-allowed opacity-50 relative'} transition-all bg-gradient-to-br from-deepblack to-gray-900 relative overflow-hidden`}
                                >
                                    {/* Hover Glow Effect */}
                                    {isUnlocked && <div className="absolute inset-0 bg-neonviolet opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>}
                                    {!isUnlocked && <div className="absolute inset-0 bg-red-900/10 flex items-center justify-center z-10 backdrop-blur-[2px]">
                                        <span className="text-red-500 font-display text-xl tracking-widest border border-red-500 bg-black/80 px-4 py-2 rotate-[-10deg]">LOCKED</span>
                                    </div>}

                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className={`text-lg font-bold transition-colors ${isCompleted ? 'text-green-400' : isUnlocked ? 'text-white group-hover:text-neonviolet' : 'text-gray-500'}`}>
                                            [ {isCompleted ? 'COMPROMISED' : `STAGE ${prob.order_index}`} ]
                                        </h3>
                                        <span className="text-xs uppercase bg-gray-800 text-gray-400 px-2 py-1 rounded">
                                            Multi-Language
                                        </span>
                                    </div>

                                    <h4 className={`text-md font-bold mb-2 ${isUnlocked ? 'text-white' : 'text-gray-600'}`}>{prob.title}</h4>

                                    <p className="text-sm text-gray-400 line-clamp-3 mb-6">
                                        {isUnlocked ? prob.description : 'CLASSIFIED INFORMATION'}
                                    </p>

                                    <div className="flex justify-end relative z-20">
                                        {isCompleted ? (
                                            <span className="text-green-500 text-sm font-bold">SOLVED [+]</span>
                                        ) : isUnlocked ? (
                                            <span className="text-neonviolet text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-4 group-hover:translate-x-0 duration-300">
                                                INFILTRATE &gt;&gt;
                                            </span>
                                        ) : (
                                            <span className="text-red-500 text-sm font-bold flex items-center gap-1"><ShieldAlert size={14} /> RESTRICTED</span>
                                        )}
                                    </div>
                                </motion.div>
                            )
                        })}
                        {problems.length === 0 && !error && (
                            <p className="text-gray-500 col-span-full text-center mt-10">No vulnerability targets detected currently.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
