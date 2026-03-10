import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ShieldX, RotateCcw, RefreshCw } from 'lucide-react';

const ADMIN_SECRET = 'admin123';

const AdminDisqualified = () => {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [resetting, setResetting] = useState(null);
    const [message, setMessage] = useState('');

    const fetchDisqualified = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/admin/teams/disqualified', {
                headers: { 'x-admin-secret': ADMIN_SECRET }
            });
            setTeams(res.data);
        } catch (err) {
            setMessage('Failed to load disqualified teams.');
        }
        setLoading(false);
    };

    useEffect(() => { fetchDisqualified(); }, []);

    const handleReset = async (team) => {
        if (!window.confirm(`Reset team "${team.team_id}"? This will clear their disqualification, violations, score, and progress.`)) return;
        setResetting(team.id);
        try {
            await axios.post(`/admin/teams/${team.id}/reset`, {}, {
                headers: { 'x-admin-secret': ADMIN_SECRET }
            });
            setMessage(`✅ Team "${team.team_id}" has been reset.`);
            fetchDisqualified();
        } catch (err) {
            setMessage(`❌ Failed to reset: ${err.response?.data?.message || err.message}`);
        }
        setResetting(null);
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <ShieldX className="text-red-500" size={32} />
                    <h1 className="text-3xl font-display uppercase text-white tracking-widest">Disqualified Teams</h1>
                </div>
                <button onClick={fetchDisqualified} className="flex items-center gap-2 text-gray-400 hover:text-white border border-gray-700 px-3 py-2 text-sm transition">
                    <RefreshCw size={14} /> Refresh
                </button>
            </div>

            {message && (
                <div className="mb-4 p-3 border border-yellow-700 bg-yellow-900/20 text-yellow-400 font-cyber text-sm">
                    {message}
                </div>
            )}

            {loading ? (
                <div className="text-neonviolet animate-pulse text-center py-20">Loading...</div>
            ) : teams.length === 0 ? (
                <div className="text-center py-20 text-gray-500 font-cyber">No disqualified teams.</div>
            ) : (
                <div className="space-y-3">
                    {teams.map(team => (
                        <div key={team.id} className="flex items-center justify-between glass-panel p-4 border border-red-900/50 bg-red-900/10">
                            <div>
                                <div className="flex items-center gap-3">
                                    <span className="text-lg font-display text-white">{team.team_id}</span>
                                    <span className="text-xs bg-red-600/30 text-red-400 border border-red-700 px-2 py-0.5 font-cyber">DISQUALIFIED</span>
                                </div>
                                <div className="text-xs text-gray-500 font-cyber mt-1">
                                    Violations: {team.tab_switches}/6 &nbsp;|&nbsp;
                                    Score: {team.score} &nbsp;|&nbsp;
                                    Stages solved: {team.problems_solved} &nbsp;|&nbsp;
                                    Last activity: {new Date(team.updated_at).toLocaleTimeString()}
                                </div>
                            </div>
                            <button
                                onClick={() => handleReset(team)}
                                disabled={resetting === team.id}
                                className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-500 disabled:opacity-50 text-black font-bold px-4 py-2 text-sm transition"
                            >
                                <RotateCcw size={14} />
                                {resetting === team.id ? 'Resetting...' : 'Reset'}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminDisqualified;
