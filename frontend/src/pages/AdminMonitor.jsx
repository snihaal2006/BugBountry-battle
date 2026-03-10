import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Activity, RefreshCw, RotateCcw, ShieldAlert } from 'lucide-react';

const ADMIN_SECRET = 'admin123';

const AdminMonitor = () => {
    const [teams, setTeams] = useState([]);
    const [allTeams, setAllTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [resetting, setResetting] = useState(null);
    const [message, setMessage] = useState('');
    const [tab, setTab] = useState('active'); // 'active' | 'all'

    const fetchTeams = async () => {
        setLoading(true);
        try {
            const [activeRes, allRes] = await Promise.all([
                axios.get('/admin/teams/active', { headers: { 'x-admin-secret': ADMIN_SECRET } }),
                axios.get('/admin/teams', { headers: { 'x-admin-secret': ADMIN_SECRET } })
            ]);
            setTeams(activeRes.data);
            setAllTeams(allRes.data);
        } catch (err) {
            setMessage('Failed to load team data.');
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchTeams();
        // Auto-refresh every 15s
        const interval = setInterval(fetchTeams, 15000);
        return () => clearInterval(interval);
    }, []);

    const handleReset = async (team) => {
        if (!window.confirm(`Reset team "${team.team_id}"? Clears violations, disqualification, score, and progress.`)) return;
        setResetting(team.id);
        try {
            await axios.post(`/admin/teams/${team.id}/reset`, {}, {
                headers: { 'x-admin-secret': ADMIN_SECRET }
            });
            setMessage(`✅ Team "${team.team_id}" reset.`);
            fetchTeams();
        } catch (err) {
            setMessage(`❌ ${err.response?.data?.message || err.message}`);
        }
        setResetting(null);
    };

    const displayTeams = tab === 'active' ? teams : allTeams;

    const ViolationBar = ({ count }) => {
        const pct = Math.min((count / 6) * 100, 100);
        const color = count >= 5 ? 'bg-red-500' : count >= 3 ? 'bg-yellow-500' : 'bg-green-500';
        return (
            <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div className={`h-full ${color} transition-all`} style={{ width: `${pct}%` }} />
                </div>
                <span className="text-xs font-cyber text-gray-400">{count}/6</span>
            </div>
        );
    };

    return (
        <div className="max-w-5xl mx-auto p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Activity className="text-neonviolet" size={32} />
                    <h1 className="text-3xl font-display uppercase text-white tracking-widest">Team Monitor</h1>
                </div>
                <button onClick={fetchTeams} className="flex items-center gap-2 text-gray-400 hover:text-white border border-gray-700 px-3 py-2 text-sm transition">
                    <RefreshCw size={14} /> Refresh
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-6 border-b border-gray-800">
                <button onClick={() => setTab('active')} className={`px-5 py-2 font-cyber text-sm uppercase transition ${tab === 'active' ? 'border-b-2 border-neonviolet text-neonviolet' : 'text-gray-500 hover:text-white'}`}>
                    🟢 Active ({teams.length})
                </button>
                <button onClick={() => setTab('all')} className={`px-5 py-2 font-cyber text-sm uppercase transition ${tab === 'all' ? 'border-b-2 border-neonviolet text-neonviolet' : 'text-gray-500 hover:text-white'}`}>
                    All Teams ({allTeams.length})
                </button>
            </div>

            {message && (
                <div className="mb-4 p-3 border border-yellow-700 bg-yellow-900/20 text-yellow-400 font-cyber text-sm">
                    {message}
                </div>
            )}

            {loading ? (
                <div className="text-neonviolet animate-pulse text-center py-20">Loading...</div>
            ) : displayTeams.length === 0 ? (
                <div className="text-center py-20 text-gray-500 font-cyber">
                    {tab === 'active' ? 'No active teams in the last 15 minutes.' : 'No teams found.'}
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm font-cyber">
                        <thead>
                            <tr className="text-gray-500 border-b border-gray-800 text-left">
                                <th className="pb-3 pr-4">Team ID</th>
                                <th className="pb-3 pr-4">Stage</th>
                                <th className="pb-3 pr-4">Score</th>
                                <th className="pb-3 pr-4">Violations</th>
                                <th className="pb-3 pr-4">Status</th>
                                <th className="pb-3 pr-4">Last Active</th>
                                <th className="pb-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayTeams.map(team => (
                                <tr key={team.id} className={`border-b border-gray-900 ${team.is_disqualified ? 'opacity-50' : ''}`}>
                                    <td className="py-3 pr-4 text-white font-bold">{team.team_id}</td>
                                    <td className="py-3 pr-4 text-cyberpurple">{team.problems_solved}/5</td>
                                    <td className="py-3 pr-4 text-yellow-400">{team.score}</td>
                                    <td className="py-3 pr-4">
                                        <ViolationBar count={team.tab_switches} />
                                    </td>
                                    <td className="py-3 pr-4">
                                        {team.is_disqualified ? (
                                            <span className="text-xs text-red-400 border border-red-700 px-2 py-0.5 bg-red-900/20">DISQUALIFIED</span>
                                        ) : (
                                            <span className="text-xs text-green-400 border border-green-900 px-2 py-0.5 bg-green-900/10">ACTIVE</span>
                                        )}
                                    </td>
                                    <td className="py-3 pr-4 text-gray-500 text-xs">
                                        {new Date(team.updated_at).toLocaleTimeString()}
                                    </td>
                                    <td className="py-3">
                                        <button
                                            onClick={() => handleReset(team)}
                                            disabled={resetting === team.id}
                                            className="flex items-center gap-1 text-xs border border-gray-700 hover:border-yellow-600 text-gray-400 hover:text-yellow-400 px-3 py-1 transition disabled:opacity-30"
                                        >
                                            <RotateCcw size={12} />
                                            {resetting === team.id ? '...' : 'Reset'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <p className="text-gray-700 text-xs font-cyber mt-6 text-center">Auto-refreshes every 15 seconds</p>
        </div>
    );
};

export default AdminMonitor;
