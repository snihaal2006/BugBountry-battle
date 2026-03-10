import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProblemPage from './pages/ProblemPage';
import Leaderboard from './pages/Leaderboard';
import AdminPanel from './pages/AdminPanel';
import AdminDisqualified from './pages/AdminDisqualified';
import AdminMonitor from './pages/AdminMonitor';

// Set up axios base URL
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ProtectedRoute MUST be defined OUTSIDE App so React never treats it as a new component type on re-renders
const ProtectedRoute = ({ team, children }) => {
  if (!team) return <Navigate to="/login" />;
  return children;
};

const App = () => {
  const [team, setTeam] = useState(JSON.parse(localStorage.getItem('teamInfo')));

  useEffect(() => {
    const savedTeam = localStorage.getItem('teamInfo');
    if (savedTeam) setTeam(JSON.parse(savedTeam));
  }, []);

  return (
    <Router>
      <div className="min-h-screen relative overflow-hidden bg-deepblack text-gray-200">

        {/* Animated Cyber Grid Background */}
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{
          backgroundImage: `linear-gradient(rgba(124, 58, 237, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(124, 58, 237, 0.4) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          backgroundPosition: 'center center'
        }}></div>

        <div className="relative z-10 p-6 flex flex-col h-full min-h-screen">
          <Routes>
            <Route path="/login" element={<Login setTeam={setTeam} />} />
            <Route path="/" element={<ProtectedRoute team={team}><Dashboard team={team} setTeam={setTeam} /></ProtectedRoute>} />
            <Route path="/problem/:id" element={<ProtectedRoute team={team}><ProblemPage team={team} /></ProtectedRoute>} />
            <Route path="/leaderboard" element={<ProtectedRoute team={team}><Leaderboard team={team} /></ProtectedRoute>} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/admin/disqualified" element={<AdminDisqualified />} />
            <Route path="/admin/monitor" element={<AdminMonitor />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
