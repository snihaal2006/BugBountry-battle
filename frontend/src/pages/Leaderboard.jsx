import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Trophy, ChevronLeft, Target } from 'lucide-react';
import { motion } from 'framer-motion';

const Leaderboard = () => {
    const [teams, setTeams] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Poll leaderboard every 10 seconds
        const fetchBoard = () => {
            axios.get('/contest/leaderboard')
                .then(res => setTeams(res.data))
                .catch(err => console.error(err));
        };
        fetchBoard();
        const interval = setInterval(fetchBoard, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="max-w-4xl mx-auto w-full pt-8 relative z-10 flex flex-col h-full">
            <header className="flex items-center justify-between mb-8 border-b border-gray-800 pb-4">
                <button onClick={() => navigate('/')} className="text-gray-400 hover:text-white flex items-center">
                    <ChevronLeft size={20} /> Dashboard
                </button>
                <h1 className="text-3xl font-display uppercase tracking-widest text-neonviolet font-bold drop-shadow-[0_0_8px_rgba(124,58,237,0.8)] flex items-center gap-3">
                    <Trophy size={32} className="text-yellow-500" /> Leaderboard
                </h1>
                <div className="w-24"></div> {/* spacer */}
            </header>

            <div className="glass-panel overflow-hidden border-t-4 border-t-neonviolet flex-1">
                <table className="w-full text-left font-cyber text-sm">
                    <thead className="bg-black/80 text-gray-400 text-xs uppercase border-b border-gray-800">
                        <tr>
                            <th className="p-4 w-16 text-center">Rank</th>
                            <th className="p-4">Team Identifier</th>
                            <th className="p-4 text-center">Score</th>
                            <th className="p-4 text-center">Targets Compromised</th>
                            <th className="p-4 text-right">Last Update</th>
                        </tr>
                    </thead>
                    <tbody>
                        {teams.map((t, idx) => (
                            <motion.tr
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                key={t._id}
                                className={`border-b border-gray-800 hover:bg-gray-900 transition-colors ${idx === 0 ? 'bg-yellow-900/10 text-yellow-100' : 'text-gray-300'}`}
                            >
                                <td className={`p-4 text-center font-bold ${idx === 0 ? 'text-yellow-500 text-lg' : idx === 1 ? 'text-gray-300 text-lg' : idx === 2 ? 'text-amber-600 text-lg' : ''}`}>
                                    #{idx + 1}
                                </td>
                                <td className="p-4 font-bold flex items-center gap-2">
                                    <Target size={14} className={idx === 0 ? 'text-yellow-500' : 'text-neonviolet'} />
                                    {t.teamId}
                                </td>
                                <td className="p-4 text-center text-neonviolet font-bold text-base">{t.score}</td>
                                <td className="p-4 text-center">{t.problemsSolved}</td>
                                <td className="p-4 text-right text-xs text-gray-500">
                                    {new Date(t.updatedAt).toLocaleTimeString()}
                                </td>
                            </motion.tr>
                        ))}
                        {teams.length === 0 && (
                            <tr>
                                <td colSpan="5" className="p-8 text-center text-gray-500">
                                    No tracking data available.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Leaderboard;
