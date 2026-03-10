import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import { Play, Send, ShieldAlert, Trophy, ArrowRight, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProblemPage = ({ team }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [problem, setProblem] = useState(null);
    const [language, setLanguage] = useState('python');
    const [code, setCode] = useState('// Write your solution here...');
    const [output, setOutput] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [nextProblemId, setNextProblemId] = useState(null);
    const [gameOver, setGameOver] = useState(false);
    const [showFullscreenWarning, setShowFullscreenWarning] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const editorRef = useRef(null);

    // ── Force & maintain Fullscreen ───────────────────────────────
    const enterFullscreen = () => {
        const el = document.documentElement;
        if (el.requestFullscreen) el.requestFullscreen();
        else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
        else if (el.mozRequestFullScreen) el.mozRequestFullScreen();
    };

    useEffect(() => {
        // Re-enter fullscreen the instant it exits (triggered by Esc or other)
        const onFullscreenChange = async () => {
            const isFullscreen = !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement);
            if (!isFullscreen && !gameOver) {
                // Show blocking overlay — user MUST click to get back in
                // (browsers require a user gesture to call requestFullscreen)
                setShowFullscreenWarning(true);
                // Log as suspicious activity
                try {
                    const res = await axios.post('/submission/suspicious');
                    if (res.data.isDisqualified) {
                        setAlertMessage('CRITICAL: 6th Violation. You are DISQUALIFIED.');
                        setShowAlert(true);
                        setTimeout(() => {
                            localStorage.clear();
                            window.location.href = '/login';
                        }, 3000);
                    }
                } catch (err) { console.error(err); }
            }
        };

        // Block keys at JS level where possible
        const blockKeys = (e) => {
            if (e.key === 'Escape' || e.keyCode === 27) { e.preventDefault(); e.stopPropagation(); }
            if (e.key === 'Meta' || e.keyCode === 91 || e.keyCode === 92) { e.preventDefault(); e.stopPropagation(); }
            if (e.key === 'F11' || e.keyCode === 122) { e.preventDefault(); }
        };

        enterFullscreen();
        document.addEventListener('fullscreenchange', onFullscreenChange);
        document.addEventListener('webkitfullscreenchange', onFullscreenChange);
        document.addEventListener('mozfullscreenchange', onFullscreenChange);
        document.addEventListener('keydown', blockKeys, true);
        return () => {
            document.removeEventListener('fullscreenchange', onFullscreenChange);
            document.removeEventListener('webkitfullscreenchange', onFullscreenChange);
            document.removeEventListener('mozfullscreenchange', onFullscreenChange);
            document.removeEventListener('keydown', blockKeys, true);
        };
    }, [gameOver]);

    // ── Block browser Back button ─────────────────────────────────
    useEffect(() => {
        window.history.pushState(null, '', window.location.href);
        const blockBack = () => {
            window.history.pushState(null, '', window.location.href);
        };
        window.addEventListener('popstate', blockBack);
        return () => window.removeEventListener('popstate', blockBack);
    }, []);

    // ── Fetch problem ─────────────────────────────────────────────
    useEffect(() => {
        axios.get(`/contest/problems/${id}`)
            .then(res => {
                setProblem(res.data);
                setLanguage('python');
                setCode(res.data.code_python || '# Write your solution here');
            })
            .catch(() => {
                // Don't navigate away — just show error
                setOutput('[!] Failed to load problem data.');
            });
    }, [id]);

    // ── Pre-fetch next problem ID ─────────────────────────────────
    useEffect(() => {
        if (!problem) return;
        axios.get('/contest/problems')
            .then(res => {
                const problems = res.data.sort((a, b) => a.order_index - b.order_index);
                const current = problems.find(p => String(p._id) === String(id));
                if (current) {
                    const next = problems.find(p => p.order_index === current.order_index + 1);
                    setNextProblemId(next ? next._id : null);
                }
            })
            .catch(() => { });
    }, [problem, id]);

    // ── Anti-Cheat: Stop Tab Switching ───────────────────────────
    useEffect(() => {
        const logViolation = async () => {
            try {
                const res = await axios.post('/submission/suspicious');
                if (res.data.isDisqualified) {
                    setAlertMessage('CRITICAL: 6th Violation. You are DISQUALIFIED from the BugBounty Battle.');
                    setShowAlert(true);
                    setTimeout(() => {
                        localStorage.clear();
                        window.location.href = '/login';
                    }, 3000);
                    return true; // disqualified
                }
                return false;
            } catch (err) {
                console.error(err);
                return false;
            }
        };

        // 1. window.blur — fires INSTANTLY when focus leaves window
        const handleBlur = async () => {
            if (gameOver || showConfirm || showAlert) return; // ignore if our modals are open
            setShowFullscreenWarning(true);
            await logViolation();
        };

        // 2. visibilitychange — backup for cases blur might miss
        const handleVisibilityChange = async () => {
            if (document.visibilityState === 'hidden' && !gameOver) {
                // Already handled by blur in most cases, but keep as safety net
                setShowFullscreenWarning(true);
            }
        };

        // 3. Block Ctrl+Tab, Ctrl+Shift+Tab, Ctrl+T, Ctrl+N, Ctrl+W, Alt+Tab (in-browser)
        const blockTabSwitchKeys = (e) => {
            const ctrl = e.ctrlKey || e.metaKey;
            // Ctrl+Tab / Ctrl+Shift+Tab — switch browser tabs (STOPPABLE!)
            if (ctrl && e.key === 'Tab') {
                e.preventDefault();
                e.stopPropagation();
            }
            // Ctrl+T — new tab
            if (ctrl && e.key === 't') { e.preventDefault(); e.stopPropagation(); }
            // Ctrl+N — new window
            if (ctrl && e.key === 'n') { e.preventDefault(); e.stopPropagation(); }
            // Ctrl+W — close tab
            if (ctrl && e.key === 'w') { e.preventDefault(); e.stopPropagation(); }
            // Ctrl+L — address bar focus (lets them navigate away)
            if (ctrl && e.key === 'l') { e.preventDefault(); e.stopPropagation(); }
            // Alt+Tab — OS level, can't truly stop, but prevent default where possible
            if (e.altKey && e.key === 'Tab') { e.preventDefault(); e.stopPropagation(); }
        };

        window.addEventListener('blur', handleBlur);
        document.addEventListener('visibilitychange', handleVisibilityChange);
        document.addEventListener('keydown', blockTabSwitchKeys, true);
        return () => {
            window.removeEventListener('blur', handleBlur);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            document.removeEventListener('keydown', blockTabSwitchKeys, true);
        };
    }, [gameOver]);

    // ── Parse locked lines ────────────────────────────────────────
    const getLockedLinesArray = (lockedLinesStr) => {
        if (!lockedLinesStr) return [];
        const lines = [];
        lockedLinesStr.split(',').forEach(part => {
            const p = part.trim();
            if (p.includes('-')) {
                const [s, e] = p.split('-').map(Number);
                if (!isNaN(s) && !isNaN(e)) for (let i = s; i <= e; i++) lines.push(i);
            } else {
                const num = Number(p);
                if (!isNaN(num)) lines.push(num);
            }
        });
        return lines;
    };

    const handleEditorDidMount = (editor, monaco) => {
        editorRef.current = editor;
        const lockedKey = `locked_lines_${language}`;
        const lockedArr = getLockedLinesArray(problem?.[lockedKey]);
        if (lockedArr.length > 0) {
            const decorations = lockedArr.map(line => ({
                range: new monaco.Range(line, 1, line, 1),
                options: {
                    isWholeLine: true,
                    className: 'bg-red-900/20 border-l-4 border-l-red-500 cursor-not-allowed',
                    marginClassName: 'bg-red-900/40'
                }
            }));
            editor.deltaDecorations([], decorations);

            editor.onKeyDown((e) => {
                const selections = editor.getSelections();
                const isModifyingKey = e.keyCode === monaco.KeyCode.Backspace || e.keyCode === monaco.KeyCode.Delete || e.keyCode === monaco.KeyCode.Enter || (e.keyCode >= 21 && e.keyCode <= 112);
                if (isModifyingKey) {
                    const isLocked = selections.some(sel => {
                        for (let line = sel.startLineNumber; line <= sel.endLineNumber; line++) {
                            if (lockedArr.includes(line)) return true;
                        }
                        if (e.keyCode === monaco.KeyCode.Backspace && sel.startColumn === 1 && lockedArr.includes(sel.startLineNumber - 1)) return true;
                        const model = editor.getModel();
                        if (e.keyCode === monaco.KeyCode.Delete && sel.endColumn === model.getLineMaxColumn(sel.endLineNumber) && lockedArr.includes(sel.endLineNumber + 1)) return true;
                        return false;
                    });
                    if (isLocked) { e.preventDefault(); e.stopPropagation(); }
                }
            });
        }
    };

    const handlePreventCheating = (e) => {
        e.preventDefault();
        setAlertMessage('[SECURITY] Action Denied');
        setShowAlert(true);
    };

    const handleRun = async () => {
        setLoading(true);
        setOutput('> Compiling and executing...');
        try {
            const res = await axios.post('/submission/run', {
                code,
                language,
                input: problem.sample_input
            });
            const data = res.data;
            setOutput(data.compile_output || data.stderr || data.stdout || data.description || 'No Output');
        } catch (err) {
            setOutput(`Error executing code: ${err.message}`);
        }
        setLoading(false);
    };

    const handleSubmit = async () => {
        setConfirmAction(() => async () => {
            setShowConfirm(false);
            setSubmitting(true);
            setOutput('> Transmitting payload to server for validation...');
            try {
                const res = await axios.post('/submission/submit', {
                    problemId: problem._id,
                    code,
                    language
                });
                const status = res.data.result;
                if (status === 'Accepted') {
                    setOutput('[+] TARGET COMPROMISED: Solution Accepted! +100 Points');
                    setShowSuccess(true);
                } else {
                    setOutput(`[-] VALIDATION FAILED: ${status}`);
                }
            } catch (err) {
                setOutput(`[!] Error: ${err.response?.data?.message || err.message}`);
            }
            setSubmitting(false);
        });
        setShowConfirm(true);
    };

    const handleNextStage = () => {
        setShowSuccess(false);
        if (nextProblemId) {
            navigate(`/problem/${nextProblemId}`);
        } else {
            // Last problem — exit fullscreen and show final message
            setGameOver(true);
            if (document.exitFullscreen) document.exitFullscreen();
            else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
            setOutput('[★] MISSION COMPLETE: All stages compromised! Await final debrief.');
        }
    };

    if (!problem) return <div className="text-neonviolet text-center mt-20 animate-pulse">Loading Target Data...</div>;

    return (
        <div className="flex flex-col lg:flex-row h-screen pt-4 pb-4 gap-4 max-w-full relative">

            {/* ── Fullscreen Warning Overlay ── */}
            {showFullscreenWarning && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md">
                    <div className="border-2 border-red-500 bg-deepblack p-10 max-w-sm w-full text-center shadow-[0_0_60px_rgba(239,68,68,0.5)]">
                        <div className="text-red-500 text-6xl mb-4">⚠</div>
                        <h2 className="text-2xl font-display uppercase text-red-400 mb-2 tracking-widest">Fullscreen Exited</h2>
                        <p className="text-gray-400 font-cyber text-sm mb-2">
                            This is a <span className="text-red-400">violation</span>. Exiting fullscreen is not permitted during the contest.
                        </p>
                        <p className="text-gray-600 text-xs mb-8 font-cyber">6 violations = disqualification</p>
                        <button
                            onClick={() => {
                                enterFullscreen();
                                setShowFullscreenWarning(false);
                            }}
                            className="w-full bg-red-600 hover:bg-red-500 text-white py-3 px-6 font-display text-lg uppercase tracking-widest transition-all hover:shadow-[0_0_20px_rgba(239,68,68,0.6)]"
                        >
                            Return to Fullscreen
                        </button>
                    </div>
                </div>
            )}

            {/* ── Congratulations Overlay ── */}
            <AnimatePresence>
                {showSuccess && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.6, opacity: 0, y: 40 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 200, damping: 18 }}
                            className="relative bg-deepblack border border-neonviolet p-10 max-w-md w-full text-center shadow-[0_0_60px_rgba(124,58,237,0.6)] rounded-sm"
                        >
                            {/* Glowing ring */}
                            <div className="absolute inset-0 rounded-sm pointer-events-none"
                                style={{ boxShadow: '0 0 80px 10px rgba(124,58,237,0.3)' }}
                            />

                            <motion.div
                                animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.15, 1] }}
                                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                                className="flex justify-center mb-6"
                            >
                                <Trophy size={64} className="text-yellow-400 drop-shadow-[0_0_16px_rgba(250,204,21,0.8)]" />
                            </motion.div>

                            <h2 className="text-3xl font-display uppercase text-white mb-2 tracking-widest drop-shadow-[0_0_10px_rgba(124,58,237,0.9)]">
                                Target Compromised
                            </h2>
                            <p className="text-neonviolet font-cyber text-lg mb-2">
                                [ Stage {problem.order_index} Complete ]
                            </p>
                            <p className="text-green-400 font-cyber text-sm mb-8">
                                +100 Points Awarded
                            </p>

                            {nextProblemId ? (
                                <motion.button
                                    whileHover={{ scale: 1.05, boxShadow: '0 0 24px rgba(124,58,237,0.8)' }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={handleNextStage}
                                    className="w-full bg-neonviolet text-white py-3 px-6 font-display text-lg uppercase tracking-widest flex items-center justify-center gap-3 shadow-neon"
                                >
                                    Next Stage <ArrowRight size={22} />
                                </motion.button>
                            ) : (
                                <div className="w-full bg-yellow-500/20 border border-yellow-500 text-yellow-400 py-3 px-6 font-display uppercase tracking-widest flex items-center justify-center gap-3">
                                    <Trophy size={20} /> Mission Complete!
                                </div>
                            )}

                            <div className="mt-4 flex items-center justify-center gap-2 text-gray-600 text-xs font-cyber">
                                <Lock size={12} /> Dashboard locked during contest
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Left Panel — Description ── */}
            <div className="lg:w-1/3 flex flex-col gap-4 overflow-y-auto pr-2">
                {/* No back button — replaced with locked indicator */}
                <div className="flex items-center gap-2 text-gray-600 text-xs font-cyber mb-1 select-none">
                    <Lock size={12} className="text-red-500" />
                    <span className="text-red-500/70">Navigation locked — complete stage to advance</span>
                </div>

                <div className="glass-panel p-6 flex-1 flex flex-col border-l-4 border-l-neonviolet">
                    <h2 className="text-2xl font-display text-white mb-2 uppercase break-words">[{problem.title}]</h2>
                    <div className="flex gap-4 mb-6 items-center">
                        <select
                            value={language}
                            onChange={(e) => {
                                const newLang = e.target.value;
                                setLanguage(newLang);
                                setCode(problem[`code_${newLang}`] || '// N/A');
                            }}
                            className="bg-black border border-cyberpurple text-white px-3 py-1 font-cyber focus:outline-none focus:border-neonviolet"
                        >
                            <option value="python">Python</option>
                            <option value="c">C</option>
                            <option value="cpp">C++</option>
                            <option value="java">Java</option>
                        </select>
                        <span className="text-xs border border-gray-600 px-2 py-1 rounded text-gray-400 font-cyber flex items-center"><ShieldAlert size={12} className="mr-1" /> secure</span>
                    </div>

                    <div className="prose prose-invert max-w-none text-sm font-sans flex-1 text-gray-300">
                        {problem.description.split('\n').map((line, i) => (
                            <p key={i} className="mb-2">{line}</p>
                        ))}
                    </div>

                    <div className="mt-8">
                        <h4 className="text-neonviolet border-b border-gray-800 pb-1 mb-2">Sample Input</h4>
                        <pre className="bg-deepblack p-3 border border-gray-800 text-xs text-gray-400 overflow-x-auto whitespace-pre-wrap">
                            {problem.sample_input || 'N/A'}
                        </pre>
                        <h4 className="text-neonviolet border-b border-gray-800 pb-1 mt-4 mb-2">Sample Output</h4>
                        <pre className="bg-deepblack p-3 border border-gray-800 text-xs text-gray-400 overflow-x-auto whitespace-pre-wrap">
                            {problem.sample_output || 'N/A'}
                        </pre>
                    </div>
                </div>
            </div>

            {/* ── Right Panel — Editor & Console ── */}
            <div className="lg:w-2/3 flex flex-col h-full gap-4">
                <div
                    className="flex-1 border border-neonviolet/50 relative animate-boxShadow"
                    onContextMenu={handlePreventCheating}
                    onCopy={handlePreventCheating}
                    onPaste={handlePreventCheating}
                    onCut={handlePreventCheating}
                >
                    <div className="absolute top-0 right-0 z-10 p-2 flex gap-2">
                        <button
                            onClick={handleRun} disabled={loading}
                            className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-1 flex items-center gap-2 text-sm border border-gray-700 transition"
                        >
                            <Play size={14} /> {loading ? 'Running...' : 'Run Code'}
                        </button>
                        <button
                            onClick={handleSubmit} disabled={submitting}
                            className="bg-neonviolet hover:bg-glow text-white px-4 py-1 flex items-center gap-2 text-sm font-bold shadow-neon transition"
                        >
                            <Send size={14} /> {submitting ? 'Sending...' : 'Submit'}
                        </button>
                    </div>
                    <Editor
                        key={language}
                        height="100%"
                        defaultLanguage={language === 'cpp' || language === 'c' ? 'cpp' : language === 'python' ? 'python' : 'java'}
                        theme="vs-dark"
                        value={code}
                        onChange={(value) => setCode(value)}
                        onMount={handleEditorDidMount}
                        options={{
                            minimap: { enabled: false },
                            fontSize: 14,
                            fontFamily: '"Courier New", monospace',
                            scrollBeyondLastLine: false,
                            contextmenu: false,
                        }}
                    />
                </div>

                <div className="h-48 bg-deepblack border border-gray-800 p-4 font-cyber overflow-y-auto">
                    <div className="text-gray-500 mb-2 border-b border-gray-800 pb-1 text-xs">TERMINAL OUTPUT</div>
                    <pre className={`whitespace-pre-wrap text-sm ${output.includes('COMPROMISED') ? 'text-green-400' : output.includes('FAILED') || output.includes('Error') || output.includes('[!]') ? 'text-red-500' : 'text-gray-300'}`}>
                        {output}
                    </pre>
                </div>
            </div>
            {/* ── Custom Alert Modal ── */}
            <AnimatePresence>
                {showAlert && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-deepblack border-2 border-neonviolet p-8 max-w-sm w-full text-center shadow-[0_0_50px_rgba(124,58,237,0.3)]"
                        >
                            <ShieldAlert className="text-neonviolet mx-auto mb-4" size={48} />
                            <h3 className="text-xl font-display text-white mb-4 uppercase tracking-widest">Security System</h3>
                            <p className="text-gray-300 font-cyber text-sm mb-6">{alertMessage}</p>
                            <button
                                onClick={() => setShowAlert(false)}
                                className="w-full bg-neonviolet hover:bg-violet-500 text-white py-2 px-4 font-display uppercase tracking-widest transition-all"
                            >
                                Acknowledge
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Custom Confirm Modal ── */}
            <AnimatePresence>
                {showConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-deepblack border-2 border-cyberpurple p-8 max-w-sm w-full text-center shadow-[0_0_50px_rgba(168,85,247,0.3)]"
                        >
                            <Send className="text-cyberpurple mx-auto mb-4" size={48} />
                            <h3 className="text-xl font-display text-white mb-4 uppercase tracking-widest">Execute Submission?</h3>
                            <p className="text-gray-300 font-cyber text-sm mb-8">Are you sure you want to transmit the payload for validation?</p>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setShowConfirm(false)}
                                    className="flex-1 border border-gray-700 hover:border-gray-500 text-gray-400 py-2 font-display uppercase tracking-widest transition-all"
                                >
                                    Abort
                                </button>
                                <button
                                    onClick={confirmAction}
                                    className="flex-1 bg-cyberpurple hover:bg-violet-500 text-white py-2 font-display uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                                >
                                    Confirm
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default ProblemPage;
