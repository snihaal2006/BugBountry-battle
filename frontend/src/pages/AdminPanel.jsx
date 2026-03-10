import React, { useState } from 'react';
import axios from 'axios';
import { Database, Users, ShieldAlert, Activity, ShieldX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
    const [adminSecret, setAdminSecret] = useState('');
    const [authenticated, setAuthenticated] = useState(false);
    const [activeTab, setActiveTab] = useState('teams');
    const navigate = useNavigate();

    // Form states
    const [teamForm, setTeamForm] = useState({ teamId: '', plainPassword: '' });
    const [probForm, setProbForm] = useState({ title: '', description: '', buggyCode: '', language: 'javascript', sampleInput: '', sampleOutput: '', lockedLines: '' });
    const [tcForm, setTcForm] = useState({ problem: '', input: '', expectedOutput: '' });

    const [msg, setMsg] = useState('');

    const handleAuth = (e) => {
        e.preventDefault();
        if (adminSecret) {
            axios.defaults.headers.common['x-admin-secret'] = adminSecret;
            setAuthenticated(true);
        }
    };

    const handleCreateTeam = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/admin/teams', teamForm);
            setMsg(`Team created: ${res.data.teamId} / ${res.data.plainPassword}`);
            setTeamForm({ teamId: '', plainPassword: '' });
        } catch (err) { setMsg('Error: ' + err.response?.data?.message); }
    };

    const handleCreateProblem = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/admin/problems', probForm);
            setMsg(`Problem added: ${res.data._id}`);
            setProbForm({ title: '', description: '', buggyCode: '', language: 'javascript', sampleInput: '', sampleOutput: '', lockedLines: '' });
        } catch (err) { setMsg('Error: ' + err.response?.data?.message); }
    };

    const handleAddTestCase = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/admin/testcases', tcForm);
            setMsg(`TestCase added: ${res.data._id}`);
            setTcForm({ problem: '', input: '', expectedOutput: '' });
        } catch (err) { setMsg('Error: ' + err.response?.data?.message); }
    };

    const handleContestAction = async (status) => {
        try {
            const res = await axios.put('/admin/contest', { status });
            setMsg(`Contest status updated to: ${res.data.status}`);
        } catch (err) { setMsg('Error: ' + err.response?.data?.message); }
    };

    if (!authenticated) {
        return (
            <div className="flex items-center justify-center min-h-[80vh]">
                <div className="glass-panel p-8">
                    <h2 className="text-2xl mb-4 text-red-500 font-display">ADMIN OVERRIDE</h2>
                    <form onSubmit={handleAuth} className="flex gap-2">
                        <input type="password" value={adminSecret} onChange={e => setAdminSecret(e.target.value)} className="bg-black text-white p-2 border border-red-500" placeholder="Admin Secret" />
                        <button type="submit" className="bg-red-500 text-white px-4 border border-red-500 hover:bg-black hover:text-red-500 transition">AUTH</button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto w-full pt-8">
            <h1 className="text-3xl font-display text-white mb-4 border-b-2 border-red-500 pb-2 flex items-center gap-3">
                <Database size={32} className="text-red-500" /> SYSTEM ADMINISTRATION
            </h1>

            {/* Quick Links to other admin pages */}
            <div className="flex gap-3 mb-6">
                <button onClick={() => navigate('/admin/monitor')} className="flex items-center gap-2 border border-neonviolet text-neonviolet hover:bg-neonviolet/20 px-4 py-2 text-sm font-cyber transition">
                    <Activity size={15} /> Live Monitor
                </button>
                <button onClick={() => navigate('/admin/disqualified')} className="flex items-center gap-2 border border-red-600 text-red-400 hover:bg-red-900/20 px-4 py-2 text-sm font-cyber transition">
                    <ShieldX size={15} /> Disqualified Teams
                </button>
            </div>

            {msg && <div className="bg-blue-900/20 text-blue-300 p-3 mb-6 border border-blue-500 text-sm font-cyber">{msg}</div>}

            <div className="flex gap-4 mb-8 text-sm font-cyber uppercase">
                <button onClick={() => setActiveTab('teams')} className={`p-2 border ${activeTab === 'teams' ? 'bg-red-500 text-white border-red-500' : 'border-gray-600 text-gray-400'}`}>Teams</button>
                <button onClick={() => setActiveTab('problems')} className={`p-2 border ${activeTab === 'problems' ? 'bg-red-500 text-white border-red-500' : 'border-gray-600 text-gray-400'}`}>Problems & Code</button>
                <button onClick={() => setActiveTab('contest')} className={`p-2 border ${activeTab === 'contest' ? 'bg-red-500 text-white border-red-500' : 'border-gray-600 text-gray-400'}`}>Contest Engine</button>
            </div>

            <div className="glass-panel p-6 border-red-500/30">

                {activeTab === 'teams' && (
                    <form onSubmit={handleCreateTeam} className="flex flex-col gap-4">
                        <h3 className="text-xl text-red-400 border-b border-gray-800 pb-2 mb-2 flex items-center gap-2"><Users size={20} /> Provision Team</h3>
                        <input type="text" placeholder="Team ID" className="bg-black border border-gray-800 p-2 text-white" required value={teamForm.teamId} onChange={e => setTeamForm({ ...teamForm, teamId: e.target.value })} />
                        <input type="text" placeholder="Password" className="bg-black border border-gray-800 p-2 text-white" required value={teamForm.plainPassword} onChange={e => setTeamForm({ ...teamForm, plainPassword: e.target.value })} />
                        <button className="bg-red-500 hover:bg-red-600 text-white p-2 w-32 border border-red-400">CREATE</button>
                    </form>
                )}

                {activeTab === 'problems' && (
                    <div className="grid grid-cols-2 gap-8">
                        <form onSubmit={handleCreateProblem} className="flex flex-col gap-4">
                            <h3 className="text-xl text-red-400 border-b border-gray-800 pb-2 mb-2 flex items-center gap-2"><ShieldAlert size={20} /> Deploy Target</h3>
                            <input type="text" placeholder="Title" className="bg-black border border-gray-800 p-2 text-white" required value={probForm.title} onChange={e => setProbForm({ ...probForm, title: e.target.value })} />
                            <select className="bg-black border border-gray-800 p-2 text-white" value={probForm.language} onChange={e => setProbForm({ ...probForm, language: e.target.value })}>
                                <option value="javascript">JavaScript</option>
                                <option value="python">Python</option>
                                <option value="cpp">C++</option>
                                <option value="java">Java</option>
                            </select>
                            <textarea placeholder="Description" rows="3" className="bg-black border border-gray-800 p-2 text-white" required value={probForm.description} onChange={e => setProbForm({ ...probForm, description: e.target.value })} />
                            <textarea placeholder="Buggy Source Code" rows="5" className="bg-black border border-gray-800 p-2 text-white font-cyber text-xs" required value={probForm.buggyCode} onChange={e => setProbForm({ ...probForm, buggyCode: e.target.value })} />
                            <input type="text" placeholder="Locked Lines (e.g. 1,2,5-10)" className="bg-black border border-gray-800 p-2 text-white" value={probForm.lockedLines} onChange={e => setProbForm({ ...probForm, lockedLines: e.target.value })} />
                            <input type="text" placeholder="Sample Input" className="bg-black border border-gray-800 p-2 text-white" value={probForm.sampleInput} onChange={e => setProbForm({ ...probForm, sampleInput: e.target.value })} />
                            <input type="text" placeholder="Sample Output" className="bg-black border border-gray-800 p-2 text-white" value={probForm.sampleOutput} onChange={e => setProbForm({ ...probForm, sampleOutput: e.target.value })} />
                            <button className="bg-red-500 hover:bg-red-600 text-white p-2 border border-red-400">INJECT PROBLEM</button>
                        </form>

                        <form onSubmit={handleAddTestCase} className="flex flex-col gap-4">
                            <h3 className="text-xl text-red-400 border-b border-gray-800 pb-2 mb-2">Hidden Test Cases</h3>
                            <input type="text" placeholder="Problem Object ID" className="bg-black border border-gray-800 p-2 text-white" required value={tcForm.problem} onChange={e => setTcForm({ ...tcForm, problem: e.target.value })} />
                            <textarea placeholder="Hidden Input" rows="3" className="bg-black border border-gray-800 p-2 text-white font-cyber text-xs" required value={tcForm.input} onChange={e => setTcForm({ ...tcForm, input: e.target.value })} />
                            <textarea placeholder="Expected Output" rows="3" className="bg-black border border-gray-800 p-2 text-white font-cyber text-xs" required value={tcForm.expectedOutput} onChange={e => setTcForm({ ...tcForm, expectedOutput: e.target.value })} />
                            <button className="bg-red-500 text-white p-2 border border-red-400 hover:bg-black hover:text-red-500 transition">ATTACH TESTCASE</button>
                        </form>
                    </div>
                )}

                {activeTab === 'contest' && (
                    <div className="flex gap-4">
                        <button onClick={() => handleContestAction('running')} className="bg-green-600 px-6 py-2 text-white">START CONTEST</button>
                        <button onClick={() => handleContestAction('ended')} className="bg-red-600 px-6 py-2 text-white">STOP CONTEST</button>
                        <button onClick={() => handleContestAction('upcoming')} className="bg-yellow-600 px-6 py-2 text-white">RESET</button>
                    </div>
                )}

            </div>
        </div>
    );
};

export default AdminPanel;
