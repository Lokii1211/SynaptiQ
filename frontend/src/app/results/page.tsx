'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api, auth } from '@/lib/api';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';

interface AssessmentResult {
    archetype: { code: string; name: string; description: string; icon: string };
    scores: { analytical: number; interpersonal: number; creative: number; systematic: number };
    career_matches: { career: string; score: number; salary_p50: number; icon: string }[];
    first_week_plan: { days: string; action: string; resource: string; hours: number; free: boolean }[];
}

function TypewriterText({ text, onComplete }: { text: string; onComplete: () => void }) {
    const [displayed, setDisplayed] = useState('');
    useEffect(() => {
        let i = 0;
        const timer = setInterval(() => {
            setDisplayed(text.slice(0, i + 1));
            i++;
            if (i >= text.length) { clearInterval(timer); onComplete(); }
        }, 60);
        return () => clearInterval(timer);
    }, [text]);
    return <span>{displayed}<span className="animate-pulse">|</span></span>;
}

const ARCHETYPE_GRADIENTS: Record<string, string> = {
    'QSB': 'from-indigo-600 to-violet-700',
    'VIS': 'from-teal-500 to-cyan-600',
    'PEC': 'from-rose-500 to-pink-600',
    'ANA': 'from-blue-600 to-indigo-700',
    'CRE': 'from-orange-500 to-amber-600',
    'SYS': 'from-emerald-600 to-green-700',
    'STR': 'from-purple-600 to-fuchsia-700',
    'INV': 'from-sky-500 to-blue-600',
    'ORG': 'from-slate-600 to-zinc-700',
    'MEN': 'from-amber-500 to-orange-600',
    'BUI': 'from-lime-600 to-green-700',
    'CON': 'from-red-500 to-rose-600',
};

const MOCK_RESULT: AssessmentResult = {
    archetype: {
        code: 'QSB',
        name: 'The Quiet Systems Builder',
        description: 'You work best when given a complex problem and the space to solve it deeply. You get energy from untangling systems and making things work elegantly. Your natural environment is behind the scenes — building the infrastructure others rely on.',
        icon: '🧠',
    },
    scores: { analytical: 82, interpersonal: 45, creative: 68, systematic: 91 },
    career_matches: [
        { career: 'Software Engineer', score: 92, salary_p50: 12, icon: '💻' },
        { career: 'Data Scientist', score: 85, salary_p50: 15, icon: '📊' },
        { career: 'DevOps Engineer', score: 78, salary_p50: 14, icon: '⚙️' },
        { career: 'ML Engineer', score: 76, salary_p50: 18, icon: '🤖' },
        { career: 'Cybersecurity Analyst', score: 71, salary_p50: 10, icon: '🔒' },
    ],
    first_week_plan: [
        { days: 'Days 1-2', action: 'CS50 Week 1 on edX', resource: 'edx.org/cs50', hours: 4, free: true },
        { days: 'Days 3-5', action: 'Python Basics on Kaggle Learn', resource: 'kaggle.com/learn/python', hours: 3, free: true },
        { days: 'Days 6-7', action: 'Solve 5 Easy problems on LeetCode', resource: 'leetcode.com', hours: 2, free: true },
    ],
};

export default function ResultsPage() {
    const [result, setResult] = useState<AssessmentResult | null>(null);
    const [phase, setPhase] = useState<'loading' | 'intro' | 'archetype' | 'radar' | 'careers' | 'plan'>('loading');

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const data = await api.getResults();
                setResult(data);
            } catch {
                setResult(MOCK_RESULT);
            }
        };
        fetchResults();
    }, []);

    useEffect(() => {
        const sequence = [
            { delay: 1500, phase: 'intro' as const },
            { delay: 3000, phase: 'archetype' as const },
            { delay: 5500, phase: 'radar' as const },
            { delay: 7000, phase: 'careers' as const },
            { delay: 9500, phase: 'plan' as const },
        ];
        sequence.forEach(({ delay, phase: p }) => setTimeout(() => setPhase(p), delay));
    }, []);

    const r = result || MOCK_RESULT;
    const gradient = ARCHETYPE_GRADIENTS[r.archetype.code] || 'from-indigo-600 to-violet-700';

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Loading */}
            <AnimatePresence>
                {phase === 'loading' && (
                    <motion.div exit={{ opacity: 0, scale: 0.95 }}
                        className="flex-1 flex flex-col items-center justify-center p-8 min-h-screen">
                        <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-6" />
                        <p className="text-slate-600 text-lg text-center">Analysing your responses...</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Intro */}
            <AnimatePresence>
                {phase === 'intro' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="flex-1 flex flex-col items-center justify-center p-8 min-h-screen">
                        <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                            className="text-2xl text-slate-700 text-center font-medium max-w-md">
                            We&apos;ve been waiting for you to discover this...
                        </motion.p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Archetype Reveal + Everything Below */}
            {(phase === 'archetype' || phase === 'radar' || phase === 'careers' || phase === 'plan') && (
                <>
                    <div className={`bg-gradient-to-br ${gradient} px-6 py-10 text-white`}>
                        <div className="max-w-lg mx-auto">
                            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}
                                className="text-sm uppercase tracking-widest mb-2">
                                Your Career Archetype
                            </motion.p>
                            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                className="text-4xl font-bold mb-4">
                                {phase === 'archetype'
                                    ? <TypewriterText text={r.archetype.name} onComplete={() => { }} />
                                    : r.archetype.name
                                }
                            </motion.h1>
                            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }} className="text-white/80 text-lg leading-relaxed">
                                {r.archetype.description}
                            </motion.p>
                        </div>
                    </div>

                    {/* 4D Radar */}
                    {(phase === 'radar' || phase === 'careers' || phase === 'plan') && (
                        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }} className="px-6 py-8 max-w-lg mx-auto w-full">
                            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-6">Your 4D Profile</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {Object.entries(r.scores).map(([dim, val]) => (
                                    <div key={dim} className="text-center">
                                        <div className="relative w-20 h-20 mx-auto mb-2">
                                            <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                                                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                    fill="none" stroke="#e2e8f0" strokeWidth="3" />
                                                <motion.path
                                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                    fill="none" stroke="#6366f1" strokeWidth="3"
                                                    strokeDasharray={`${val}, 100`}
                                                    initial={{ strokeDasharray: '0, 100' }}
                                                    animate={{ strokeDasharray: `${val}, 100` }}
                                                    transition={{ duration: 1.5, ease: 'easeOut' }}
                                                />
                                            </svg>
                                            <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-slate-800">
                                                {val}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-600 capitalize">{dim}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Career matches */}
                    {(phase === 'careers' || phase === 'plan') && (
                        <div className="px-4 pb-8 max-w-lg mx-auto w-full">
                            <h3 className="text-lg font-bold text-slate-900 mb-4 px-2">Your Top Career Matches</h3>
                            <div className="space-y-3">
                                {r.career_matches.map((match, index) => (
                                    <motion.div key={match.career} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.2 }}
                                        className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center gap-4">
                                        <span className="text-3xl">{match.icon}</span>
                                        <div className="flex-1">
                                            <p className="font-semibold text-slate-900">{match.career}</p>
                                            <p className="text-xs text-slate-500">₹{match.salary_p50}L median salary</p>
                                        </div>
                                        <span className="bg-indigo-100 text-indigo-700 text-sm font-bold px-3 py-1 rounded-full">
                                            {match.score}%
                                        </span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* First Week Plan + CTA */}
                    {phase === 'plan' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="px-4 pb-8 max-w-lg mx-auto w-full">
                            <h3 className="text-lg font-bold text-slate-900 mb-4 px-2">Your First Week Plan</h3>
                            <div className="space-y-3 mb-6">
                                {r.first_week_plan.map((step, i) => (
                                    <div key={i} className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs font-bold text-indigo-600">{step.days}</span>
                                            <span className="text-xs text-slate-500">{step.hours}h · {step.free ? 'Free' : 'Paid'}</span>
                                        </div>
                                        <p className="text-sm font-medium text-slate-800">{step.action}</p>
                                        <p className="text-xs text-indigo-500 mt-1">{step.resource}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="sticky bottom-20 bg-white border-t border-slate-100 p-4 -mx-4">
                                <button className="w-full bg-indigo-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg shadow-indigo-500/25"
                                    onClick={() => window.location.href = '/learn'}>
                                    Get My Personalized Roadmap →
                                </button>
                            </div>
                        </motion.div>
                    )}
                </>
            )}
        </div>
    );
}
