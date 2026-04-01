'use client';
import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api, auth } from '@/lib/api';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';
import Link from 'next/link';

const BACKEND_URL = (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') ? 'https://mentixy-api.vercel.app' : 'http://localhost:8000';

type Phase = 'setup' | 'lobby' | 'round' | 'round-result' | 'final';

interface RoundData {
    round_number: number;
    name: string;
    type: string;
    time_limit_minutes: number;
    total_questions: number;
    questions?: any[];
    problems?: any[];
}

const COMPANIES = [
    { name: 'TCS', icon: '🏛️', tier: 'Mass', color: 'from-blue-500 to-blue-700' },
    { name: 'Infosys', icon: '🔷', tier: 'Mass', color: 'from-blue-400 to-cyan-600' },
    { name: 'Wipro', icon: '🌐', tier: 'Mass', color: 'from-violet-500 to-purple-700' },
    { name: 'Cognizant', icon: '⚡', tier: 'Mass', color: 'from-indigo-500 to-blue-600' },
    { name: 'Accenture', icon: '🚀', tier: 'Tier 1', color: 'from-purple-600 to-violet-800' },
    { name: 'Deloitte', icon: '📊', tier: 'Tier 1', color: 'from-emerald-600 to-green-700' },
    { name: 'Amazon', icon: '📦', tier: 'Product', color: 'from-orange-500 to-amber-600' },
    { name: 'Google', icon: '🔍', tier: 'Product', color: 'from-red-500 to-pink-600' },
    { name: 'Microsoft', icon: '🪟', tier: 'Product', color: 'from-sky-500 to-blue-700' },
    { name: 'Flipkart', icon: '🛒', tier: 'Product', color: 'from-yellow-500 to-amber-600' },
    { name: 'Zoho', icon: '💼', tier: 'Indian', color: 'from-red-600 to-rose-700' },
    { name: 'Razorpay', icon: '💳', tier: 'Startup', color: 'from-blue-600 to-indigo-700' },
];

const ROUND_META: Record<number, { icon: string; accentColor: string; bgGradient: string }> = {
    1: { icon: '🧮', accentColor: 'text-blue-600', bgGradient: 'from-blue-600 to-indigo-700' },
    2: { icon: '💻', accentColor: 'text-emerald-600', bgGradient: 'from-emerald-600 to-teal-700' },
    3: { icon: '🧠', accentColor: 'text-violet-600', bgGradient: 'from-violet-600 to-purple-700' },
    4: { icon: '🗣️', accentColor: 'text-amber-600', bgGradient: 'from-amber-600 to-orange-700' },
};

export default function MockDrivePage() {
    const [phase, setPhase] = useState<Phase>('setup');
    const [selectedCompany, setSelectedCompany] = useState('TCS');
    const [targetRole, setTargetRole] = useState('Software Engineer');
    const [driveData, setDriveData] = useState<any>(null);
    const [currentRound, setCurrentRound] = useState(0);
    const [answers, setAnswers] = useState<any[]>([]);
    const [currentQ, setCurrentQ] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [roundScores, setRoundScores] = useState<any[]>([]);
    const [roundResult, setRoundResult] = useState<any>(null);
    const [finalResult, setFinalResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [lobbyCountdown, setLobbyCountdown] = useState(5);
    const [hrText, setHrText] = useState('');
    const [codeText, setCodeText] = useState('');
    const [codeProblemIdx, setCodeProblemIdx] = useState(0);
    const timerRef = useRef<any>(null);

    useEffect(() => {
    }, []);

    // Timer
    useEffect(() => {
        if (phase !== 'round' || timeLeft <= 0) return;
        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    handleTimeUp();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timerRef.current);
    }, [phase, currentRound]);

    // Lobby countdown
    useEffect(() => {
        if (phase !== 'lobby') return;
        if (lobbyCountdown <= 0) {
            startRound(currentRound);
            return;
        }
        const t = setTimeout(() => setLobbyCountdown(prev => prev - 1), 1000);
        return () => clearTimeout(t);
    }, [phase, lobbyCountdown]);

    const handleTimeUp = useCallback(() => {
        submitCurrentRound();
    }, [answers, currentRound, driveData]);

    const startDrive = async () => {
        setLoading(true);
        try {
            const token = auth.getToken();
            const res = await fetch(`${BACKEND_URL}/api/mock-drive/start`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ target_company: selectedCompany, target_role: targetRole }),
            });
            if (!res.ok) throw new Error('Failed to start');
            const data = await res.json();
            setDriveData(data);
            setCurrentRound(1);
            setRoundScores([]);
            setPhase('lobby');
            setLobbyCountdown(5);
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    const startRound = (roundNum: number) => {
        const round = driveData?.rounds?.find((r: any) => r.round_number === roundNum);
        if (!round) return;

        const totalQs = round.questions?.length || round.problems?.length || 0;
        setAnswers(new Array(totalQs).fill(null));
        setCurrentQ(0);
        setTimeLeft(round.time_limit_minutes * 60);
        setCodeText('');
        setHrText('');
        setCodeProblemIdx(0);
        setPhase('round');
    };

    const selectAnswer = (questionIdx: number, answer: any) => {
        setAnswers(prev => {
            const next = [...prev];
            next[questionIdx] = answer;
            return next;
        });
    };

    const submitCurrentRound = async () => {
        clearInterval(timerRef.current);
        setLoading(true);
        const round = driveData?.rounds?.find((r: any) => r.round_number === currentRound);
        if (!round) return;

        let formattedAnswers: any[] = [];
        if (round.type === 'aptitude' || round.type === 'technical') {
            formattedAnswers = (round.questions || []).map((q: any, i: number) => ({
                question_id: q.id,
                selected_option: answers[i] || '',
            }));
        } else if (round.type === 'coding') {
            formattedAnswers = (round.problems || []).map((p: any, i: number) => ({
                problem_id: p.id,
                code: answers[i] || '',
            }));
        } else if (round.type === 'hr') {
            formattedAnswers = (round.questions || []).map((q: any, i: number) => ({
                question: q.question,
                answer: answers[i] || '',
            }));
        }

        try {
            const token = auth.getToken();
            const res = await fetch(`${BACKEND_URL}/api/mock-drive/submit-round`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({
                    drive_id: driveData.drive_id,
                    round_number: currentRound,
                    answers: formattedAnswers,
                }),
            });
            const result = await res.json();
            setRoundResult(result);
            setRoundScores(prev => [...prev, { round: currentRound, score: result.score }]);
            setPhase('round-result');
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    const proceedNextRound = () => {
        if (currentRound >= 4) {
            calculateFinal();
            return;
        }
        setCurrentRound(prev => prev + 1);
        setPhase('lobby');
        setLobbyCountdown(5);
    };

    const calculateFinal = () => {
        const allPassed = roundScores.every(r => r.score >= 50);
        const avgScore = roundScores.reduce((sum, r) => sum + r.score, 0) / roundScores.length;
        const probability = allPassed
            ? Math.min(95, Math.round(avgScore * 0.9 + 10))
            : Math.min(40, Math.round(avgScore * 0.4));

        setFinalResult({
            overall_score: Math.round(avgScore),
            placement_probability: probability,
            all_rounds_cleared: allPassed,
            round_results: roundScores,
            verdict: probability >= 70
                ? '🎉 Likely to get placed!'
                : probability >= 40
                    ? '📈 Needs improvement'
                    : '📚 Significant preparation needed',
        });
        setPhase('final');
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const round = driveData?.rounds?.find((r: any) => r.round_number === currentRound);
    const meta = ROUND_META[currentRound] || ROUND_META[1];

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1 pb-24 md:pb-8">

                    {/* ═══ SETUP PHASE ═══ */}
                    {phase === 'setup' && (
                        <>
                            <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-violet-950 text-white px-6 py-10 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full -translate-y-1/2 translate-x-1/4" />
                                <div className="absolute bottom-0 left-0 w-32 h-32 bg-violet-500/10 rounded-full translate-y-1/3 -translate-x-1/4" />
                                <div className="max-w-3xl mx-auto relative z-10">
                                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                                        <span className="inline-block text-xs font-semibold bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full mb-4">
                                            🏢 MOCK PLACEMENT DRIVE
                                        </span>
                                        <h1 className="text-3xl md:text-4xl font-bold mb-3">Experience Placement Day</h1>
                                        <p className="text-white/60 text-sm max-w-lg leading-relaxed">
                                            Simulate a real campus drive — aptitude, coding, technical, and HR rounds.
                                            Know if you&apos;d get placed before the actual day arrives.
                                        </p>
                                    </motion.div>
                                </div>
                            </div>

                            <div className="px-4 md:px-6 py-8 max-w-3xl mx-auto space-y-8">
                                {/* How it works */}
                                <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                                    <h2 className="st-section-title mb-4">How it works</h2>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {[
                                            { round: 1, icon: '🧮', name: 'Aptitude', time: '30 min', qs: '30 MCQs' },
                                            { round: 2, icon: '💻', name: 'Coding', time: '45 min', qs: '2 Problems' },
                                            { round: 3, icon: '🧠', name: 'Technical', time: '20 min', qs: '20 MCQs' },
                                            { round: 4, icon: '🗣️', name: 'HR Interview', time: '15 min', qs: '5 Questions' },
                                        ].map((r, i) => (
                                            <motion.div key={r.round} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.08 }}
                                                className="st-card p-4 text-center"
                                            >
                                                <span className="text-3xl block mb-2">{r.icon}</span>
                                                <p className="font-semibold text-slate-900 text-sm">{r.name}</p>
                                                <p className="text-xs text-slate-500 mt-1">{r.qs} · {r.time}</p>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.section>

                                {/* Company Selection */}
                                <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                                    <h2 className="st-section-title mb-4">Select Target Company</h2>
                                    <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                                        {COMPANIES.map(c => (
                                            <button key={c.name}
                                                onClick={() => setSelectedCompany(c.name)}
                                                className={`st-card p-3 text-center transition-all ${selectedCompany === c.name
                                                    ? 'ring-2 ring-indigo-500 shadow-lg bg-indigo-50'
                                                    : 'hover:shadow-md'
                                                    }`}
                                            >
                                                <span className="text-2xl block mb-1">{c.icon}</span>
                                                <p className="font-semibold text-sm text-slate-900">{c.name}</p>
                                                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${c.tier === 'Product' ? 'bg-amber-100 text-amber-700'
                                                    : c.tier === 'Tier 1' ? 'bg-blue-100 text-blue-700'
                                                        : c.tier === 'Startup' ? 'bg-purple-100 text-purple-700'
                                                            : c.tier === 'Indian' ? 'bg-red-100 text-red-700'
                                                                : 'bg-slate-100 text-slate-600'
                                                    }`}>{c.tier}</span>
                                            </button>
                                        ))}
                                    </div>
                                </motion.section>

                                {/* Role */}
                                <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                                    <h2 className="st-section-title mb-3">Target Role</h2>
                                    <input type="text" value={targetRole} onChange={e => setTargetRole(e.target.value)}
                                        placeholder="e.g. Software Engineer"
                                        className="st-input w-full"
                                    />
                                </motion.section>

                                {/* Start */}
                                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                                    <button onClick={startDrive} disabled={loading}
                                        className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold py-4 px-8 rounded-2xl text-lg transition-all active:scale-[0.98] shadow-lg hover:shadow-xl disabled:opacity-50"
                                    >
                                        {loading ? '⏳ Setting up campus...' : `🏁 Start ${selectedCompany} Placement Drive`}
                                    </button>
                                    <p className="text-xs text-slate-400 text-center mt-3">
                                        Total time: ~110 minutes · 4 rounds · AI-scored
                                    </p>
                                </motion.div>
                            </div>
                        </>
                    )}

                    {/* ═══ LOBBY PHASE ═══ */}
                    {phase === 'lobby' && (
                        <div className="flex-1 flex items-center justify-center min-h-[70vh]">
                            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                                className="text-center px-6"
                            >
                                <div className={`w-24 h-24 bg-gradient-to-br ${meta.bgGradient} rounded-3xl flex items-center justify-center text-5xl mx-auto mb-6 shadow-xl`}>
                                    {meta.icon}
                                </div>
                                <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">
                                    Round {currentRound} of 4
                                </h2>
                                <h1 className="text-3xl font-bold text-slate-900 mb-2">{round?.name}</h1>
                                <p className="text-slate-500 text-sm mb-2">
                                    {round?.total_questions} questions · {round?.time_limit_minutes} minutes
                                </p>
                                <p className="text-sm text-slate-400 mb-8">@ {driveData?.target_company}</p>
                                <div className="relative w-20 h-20 mx-auto mb-4">
                                    <svg width="80" height="80" className="st-progress-ring">
                                        <circle cx="40" cy="40" r="34" fill="none" stroke="#e2e8f0" strokeWidth="5" />
                                        <motion.circle cx="40" cy="40" r="34" fill="none" stroke="#6366f1"
                                            strokeWidth="5" strokeLinecap="round"
                                            strokeDasharray={2 * Math.PI * 34}
                                            initial={{ strokeDashoffset: 0 }}
                                            animate={{ strokeDashoffset: 2 * Math.PI * 34 }}
                                            transition={{ duration: 5, ease: 'linear' }}
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-indigo-600">
                                        {lobbyCountdown}
                                    </div>
                                </div>
                                <p className="text-xs text-slate-400 animate-pulse">Starting in {lobbyCountdown}s...</p>
                            </motion.div>
                        </div>
                    )}

                    {/* ═══ ROUND PHASE ═══ */}
                    {phase === 'round' && round && (
                        <>
                            {/* Timer header */}
                            <div className={`bg-gradient-to-r ${meta.bgGradient} text-white px-6 py-4 sticky top-0 z-30`}>
                                <div className="max-w-3xl mx-auto flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-white/60 font-medium">Round {currentRound} · {round.name}</p>
                                        <p className="text-sm font-semibold">
                                            {round.type === 'coding' ? `Problem ${codeProblemIdx + 1}/${round.problems?.length || 0}` :
                                                round.type === 'hr' ? `Q${currentQ + 1}/${round.questions?.length || 0}` :
                                                    `Q${currentQ + 1}/${round.questions?.length || 0}`}
                                        </p>
                                    </div>
                                    <div className={`text-right font-mono text-xl font-bold ${timeLeft < 60 ? 'text-red-300 animate-pulse' : ''}`}>
                                        ⏱ {formatTime(timeLeft)}
                                    </div>
                                </div>
                                {/* Progress bar */}
                                <div className="max-w-3xl mx-auto mt-2">
                                    <div className="w-full bg-white/20 rounded-full h-1.5">
                                        <motion.div className="bg-white h-full rounded-full"
                                            animate={{
                                                width: `${round.type === 'coding'
                                                    ? ((codeProblemIdx + 1) / (round.problems?.length || 1)) * 100
                                                    : ((currentQ + 1) / (round.questions?.length || 1)) * 100
                                                    }%`
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="px-4 md:px-6 py-6 max-w-3xl mx-auto">
                                {/* ── MCQ Round (Aptitude/Technical) ── */}
                                {(round.type === 'aptitude' || round.type === 'technical') && round.questions && (
                                    <AnimatePresence mode="wait">
                                        <motion.div key={currentQ} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                            <div className="st-card p-6 mb-4">
                                                {round.questions[currentQ]?.category && (
                                                    <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded mb-3 inline-block">
                                                        {round.questions[currentQ].category}
                                                    </span>
                                                )}
                                                <h3 className="text-lg font-semibold text-slate-900 mb-6 leading-relaxed">
                                                    {round.questions[currentQ]?.question_text || 'Loading question...'}
                                                </h3>
                                                <div className="space-y-3">
                                                    {(round.questions[currentQ]?.options || []).map((opt: string, oi: number) => {
                                                        const optLabel = String.fromCharCode(65 + oi);
                                                        const isSelected = answers[currentQ] === opt;
                                                        return (
                                                            <button key={oi} onClick={() => selectAnswer(currentQ, opt)}
                                                                className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${isSelected
                                                                    ? 'border-indigo-500 bg-indigo-50 shadow-sm'
                                                                    : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                                                                    }`}
                                                            >
                                                                <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                                                    {optLabel}
                                                                </span>
                                                                <span className="text-sm text-slate-700">{opt}</span>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            {/* Navigation */}
                                            <div className="flex justify-between gap-3">
                                                <button onClick={() => setCurrentQ(prev => Math.max(0, prev - 1))}
                                                    disabled={currentQ === 0}
                                                    className="st-btn-secondary text-sm px-6 disabled:opacity-40"
                                                >← Prev</button>
                                                {currentQ < (round.questions?.length || 1) - 1 ? (
                                                    <button onClick={() => setCurrentQ(prev => prev + 1)}
                                                        className="st-btn-primary text-sm px-6"
                                                    >Next →</button>
                                                ) : (
                                                    <button onClick={submitCurrentRound} disabled={loading}
                                                        className="bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold py-3 px-6 rounded-xl text-sm hover:shadow-lg transition-all"
                                                    >{loading ? 'Submitting...' : '✓ Submit Round'}</button>
                                                )}
                                            </div>

                                            {/* Question dots */}
                                            <div className="flex flex-wrap gap-1.5 mt-6 justify-center">
                                                {(round.questions || []).map((_: any, i: number) => (
                                                    <button key={i} onClick={() => setCurrentQ(i)}
                                                        className={`w-7 h-7 rounded-md text-[10px] font-semibold transition-all ${i === currentQ
                                                            ? 'bg-indigo-600 text-white shadow-sm'
                                                            : answers[i] != null
                                                                ? 'bg-indigo-100 text-indigo-700'
                                                                : 'bg-slate-100 text-slate-400'
                                                            }`}
                                                    >{i + 1}</button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    </AnimatePresence>
                                )}

                                {/* ── Coding Round ── */}
                                {round.type === 'coding' && round.problems && (
                                    <div>
                                        <div className="st-card p-6 mb-4">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-lg font-bold text-slate-900">{round.problems[codeProblemIdx]?.title}</h3>
                                                <span className={`text-xs font-medium px-2 py-0.5 rounded border ${round.problems[codeProblemIdx]?.difficulty === 'easy'
                                                    ? 'bg-green-50 text-green-700 border-green-200'
                                                    : round.problems[codeProblemIdx]?.difficulty === 'medium'
                                                        ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                                        : 'bg-red-50 text-red-700 border-red-200'
                                                    }`}>{round.problems[codeProblemIdx]?.difficulty}</span>
                                            </div>
                                            <p className="text-sm text-slate-700 mb-4 leading-relaxed">{round.problems[codeProblemIdx]?.statement}</p>
                                            {round.problems[codeProblemIdx]?.examples?.map((ex: any, i: number) => (
                                                <div key={i} className="bg-slate-50 rounded-xl p-4 mb-3 font-mono text-xs">
                                                    <p className="text-slate-500 mb-1">Input: <span className="text-slate-900">{ex.input}</span></p>
                                                    <p className="text-slate-500">Output: <span className="text-emerald-700 font-semibold">{ex.output}</span></p>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="st-card overflow-hidden mb-4">
                                            <div className="flex items-center justify-between px-4 py-2 bg-slate-800">
                                                <span className="text-xs text-slate-400 font-mono">solution.py</span>
                                                <span className="text-xs text-slate-500">Python 3</span>
                                            </div>
                                            <textarea
                                                value={answers[codeProblemIdx] || ''}
                                                onChange={e => selectAnswer(codeProblemIdx, e.target.value)}
                                                placeholder="# Write your solution here..."
                                                rows={16}
                                                className="w-full bg-slate-900 text-green-400 font-mono text-sm p-4 focus:outline-none resize-none"
                                                spellCheck={false}
                                            />
                                        </div>
                                        <div className="flex justify-between">
                                            {codeProblemIdx > 0 && (
                                                <button onClick={() => setCodeProblemIdx(prev => prev - 1)} className="st-btn-secondary text-sm px-6">← Prev Problem</button>
                                            )}
                                            <div className="ml-auto">
                                                {codeProblemIdx < (round.problems?.length || 1) - 1 ? (
                                                    <button onClick={() => setCodeProblemIdx(prev => prev + 1)} className="st-btn-primary text-sm px-6">Next Problem →</button>
                                                ) : (
                                                    <button onClick={submitCurrentRound} disabled={loading}
                                                        className="bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold py-3 px-6 rounded-xl text-sm"
                                                    >{loading ? 'Submitting...' : '✓ Submit Round'}</button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* ── HR Round ── */}
                                {round.type === 'hr' && round.questions && (
                                    <AnimatePresence mode="wait">
                                        <motion.div key={currentQ} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                            <div className="st-card p-6 mb-4">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-xl">👔</div>
                                                    <div>
                                                        <p className="text-xs text-slate-500 font-medium">HR Interviewer</p>
                                                        <p className="text-xs text-slate-400">{driveData?.target_company}</p>
                                                    </div>
                                                </div>
                                                <p className="text-lg font-semibold text-slate-900 leading-relaxed mb-6">
                                                    &ldquo;{round.questions[currentQ]?.question}&rdquo;
                                                </p>
                                                <textarea
                                                    value={answers[currentQ] || ''}
                                                    onChange={e => selectAnswer(currentQ, e.target.value)}
                                                    placeholder="Type your answer here... Be specific, use STAR format where applicable."
                                                    rows={8}
                                                    className="w-full st-input resize-none"
                                                />
                                                <p className="text-right text-xs text-slate-400 mt-1">
                                                    {(answers[currentQ] || '').split(' ').filter(Boolean).length} words
                                                </p>
                                            </div>
                                            <div className="flex justify-between gap-3">
                                                <button onClick={() => setCurrentQ(prev => Math.max(0, prev - 1))}
                                                    disabled={currentQ === 0}
                                                    className="st-btn-secondary text-sm px-6 disabled:opacity-40"
                                                >← Prev</button>
                                                {currentQ < (round.questions?.length || 1) - 1 ? (
                                                    <button onClick={() => setCurrentQ(prev => prev + 1)} className="st-btn-primary text-sm px-6">Next →</button>
                                                ) : (
                                                    <button onClick={submitCurrentRound} disabled={loading}
                                                        className="bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold py-3 px-6 rounded-xl text-sm"
                                                    >{loading ? 'Submitting...' : '✓ Submit Round'}</button>
                                                )}
                                            </div>
                                        </motion.div>
                                    </AnimatePresence>
                                )}
                            </div>
                        </>
                    )}

                    {/* ═══ ROUND RESULT PHASE ═══ */}
                    {phase === 'round-result' && roundResult && (
                        <div className="flex-1 flex items-center justify-center min-h-[70vh] px-4">
                            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full">
                                <div className={`text-center rounded-3xl p-8 shadow-xl ${roundResult.passed
                                    ? 'bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200'
                                    : 'bg-gradient-to-br from-red-50 to-rose-50 border border-red-200'
                                    }`}>
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }}
                                        className="text-6xl mb-4 block"
                                    >
                                        {roundResult.passed ? '✅' : '❌'}
                                    </motion.div>
                                    <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">
                                        Round {currentRound} — {roundResult.round_name}
                                    </h2>
                                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                                        className="text-5xl font-bold text-slate-900 mb-2">
                                        {roundResult.score}%
                                    </motion.p>
                                    <p className={`text-sm font-semibold mb-4 ${roundResult.passed ? 'text-green-700' : 'text-red-700'}`}>
                                        {roundResult.passed ? 'QUALIFIED ✓' : `Below Cutoff (${roundResult.cutoff}%)`}
                                    </p>
                                    {roundResult.correct != null && (
                                        <p className="text-xs text-slate-500 mb-4">{roundResult.correct}/{roundResult.total} correct answers</p>
                                    )}
                                    <p className="text-sm text-slate-600 mb-6 leading-relaxed">{roundResult.feedback}</p>

                                    <button onClick={proceedNextRound}
                                        className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold py-3.5 rounded-xl text-sm hover:shadow-lg transition-all active:scale-[0.98]"
                                    >
                                        {currentRound >= 4 ? '📊 View Final Results' : `➡️ Continue to Round ${currentRound + 1}`}
                                    </button>
                                </div>

                                {/* Progress dots */}
                                <div className="flex justify-center gap-3 mt-6">
                                    {[1, 2, 3, 4].map(r => {
                                        const scored = roundScores.find(s => s.round === r);
                                        return (
                                            <div key={r} className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${scored
                                                ? scored.score >= 50
                                                    ? 'bg-green-100 text-green-700 border border-green-200'
                                                    : 'bg-red-100 text-red-700 border border-red-200'
                                                : r === currentRound + 1
                                                    ? 'bg-indigo-100 text-indigo-600 border border-indigo-200'
                                                    : 'bg-slate-100 text-slate-400'
                                                }`}>
                                                {scored ? scored.score >= 50 ? '✓' : '✗' : r}
                                            </div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        </div>
                    )}

                    {/* ═══ FINAL RESULTS PHASE ═══ */}
                    {phase === 'final' && finalResult && (
                        <div className="pb-8">
                            {/* Hero result */}
                            <div className={`${finalResult.all_rounds_cleared
                                ? 'bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700'
                                : 'bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800'
                                } text-white px-6 py-12 text-center relative overflow-hidden`}>
                                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDE4YzEuNjU3IDAgMy0xLjM0MyAzLTNzLTEuMzQzLTMtMy0zLTMgMS4zNDMtMyAzIDEuMzQzIDMgMyAzeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
                                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="relative z-10">
                                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }}
                                        className="text-7xl block mb-4"
                                    >
                                        {finalResult.placement_probability >= 70 ? '🎉' : finalResult.placement_probability >= 40 ? '💪' : '📚'}
                                    </motion.span>
                                    <h1 className="text-3xl font-bold mb-2">{finalResult.verdict}</h1>
                                    <p className="text-white/70 text-sm mb-6">{driveData?.target_company} — {driveData?.target_role}</p>
                                    <div className="flex justify-center gap-8">
                                        <div>
                                            <p className="text-4xl font-bold">{finalResult.overall_score}%</p>
                                            <p className="text-xs text-white/60 uppercase font-semibold mt-1">Overall Score</p>
                                        </div>
                                        <div className="w-px bg-white/20" />
                                        <div>
                                            <p className="text-4xl font-bold">{finalResult.placement_probability}%</p>
                                            <p className="text-xs text-white/60 uppercase font-semibold mt-1">Placement Chance</p>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>

                            <div className="px-4 md:px-6 py-6 max-w-2xl mx-auto space-y-5">
                                {/* Per-round breakdown */}
                                <section className="st-card p-6">
                                    <h2 className="font-bold text-slate-900 mb-4">Round-by-Round Breakdown</h2>
                                    <div className="space-y-3">
                                        {roundScores.map(rs => {
                                            const roundNames = { 1: 'Aptitude', 2: 'Coding', 3: 'Technical', 4: 'HR Interview' } as Record<number, string>;
                                            const passed = rs.score >= 50;
                                            return (
                                                <motion.div key={rs.round} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: rs.round * 0.1 }}
                                                    className={`flex items-center gap-4 p-4 rounded-xl border ${passed ? 'bg-green-50/50 border-green-200' : 'bg-red-50/50 border-red-200'}`}
                                                >
                                                    <span className="text-2xl">{ROUND_META[rs.round]?.icon}</span>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-semibold text-slate-900">Round {rs.round}: {roundNames[rs.round]}</p>
                                                        <div className="w-full bg-slate-200 rounded-full h-2 mt-1.5">
                                                            <motion.div initial={{ width: 0 }} animate={{ width: `${rs.score}%` }}
                                                                transition={{ duration: 0.8, delay: rs.round * 0.15 }}
                                                                className={`h-full rounded-full ${passed ? 'bg-green-500' : 'bg-red-500'}`}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className={`text-lg font-bold ${passed ? 'text-green-700' : 'text-red-700'}`}>{rs.score}%</p>
                                                        <p className={`text-[10px] font-semibold uppercase ${passed ? 'text-green-600' : 'text-red-600'}`}>
                                                            {passed ? 'PASS' : 'FAIL'}
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </section>

                                {/* Actions */}
                                <div className="grid grid-cols-2 gap-3">
                                    <button onClick={() => { setPhase('setup'); setDriveData(null); setRoundScores([]); setCurrentRound(0); }}
                                        className="st-btn-secondary text-sm py-3"
                                    >🔄 Try Again</button>
                                    <Link href="/dashboard" className="st-btn-primary text-sm py-3 text-center">
                                        📊 Dashboard
                                    </Link>
                                </div>

                                <p className="text-xs text-slate-400 text-center">
                                    Mock placement results are for practice only. Keep building your skills! 💪
                                </p>
                            </div>
                        </div>
                    )}

                </main>
                <BottomNav />
            </div>
        </div>
    );
}
