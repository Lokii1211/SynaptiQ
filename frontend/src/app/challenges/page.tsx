'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api, auth } from '@/lib/api';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';
import { SideNav } from '@/components/layout/SideNav';
import Link from 'next/link';

interface Challenge {
    id: string;
    title: string;
    description: string;
    icon: string;
    category: string;
    difficulty: 'easy' | 'medium' | 'hard';
    xp: number;
    participants: number;
    timeLeft: string;
    type: 'daily' | 'weekly' | 'special';
    progress?: number;
    maxProgress?: number;
    completed?: boolean;
}

const CHALLENGES: Challenge[] = [
    // Daily
    { id: 'd1', title: 'Morning Coder', description: 'Solve any coding problem before 10 AM', icon: '🌅', category: 'Coding', difficulty: 'easy', xp: 30, participants: 156, timeLeft: '14h left', type: 'daily' },
    { id: 'd2', title: 'Aptitude Sprint', description: 'Score 80%+ on a 10Q aptitude mini-test', icon: '🧮', category: 'Aptitude', difficulty: 'medium', xp: 40, participants: 89, timeLeft: '14h left', type: 'daily' },
    { id: 'd3', title: 'Career Explorer', description: 'Ask 3 questions to AI Career Advisor', icon: '💬', category: 'Career', difficulty: 'easy', xp: 20, participants: 234, timeLeft: '14h left', type: 'daily', progress: 1, maxProgress: 3 },

    // Weekly
    { id: 'w1', title: 'Code Marathon', description: 'Solve 15 coding problems this week', icon: '🏃', category: 'Coding', difficulty: 'hard', xp: 200, participants: 432, timeLeft: '4d left', type: 'weekly', progress: 7, maxProgress: 15 },
    { id: 'w2', title: 'Skill Collector', description: 'Verify 2 new skills via quiz', icon: '🏅', category: 'Skills', difficulty: 'medium', xp: 150, participants: 178, timeLeft: '4d left', type: 'weekly', progress: 0, maxProgress: 2 },
    { id: 'w3', title: 'Community Star', description: 'Help 5 peers with answers in community', icon: '⭐', category: 'Social', difficulty: 'medium', xp: 120, participants: 67, timeLeft: '4d left', type: 'weekly', progress: 2, maxProgress: 5 },
    { id: 'w4', title: 'Polyglot Week', description: 'Solve problems in 3 different languages', icon: '🌍', category: 'Coding', difficulty: 'hard', xp: 250, participants: 95, timeLeft: '4d left', type: 'weekly', progress: 1, maxProgress: 3 },

    // Special
    { id: 's1', title: 'TCS NQT Prep Sprint', description: 'Complete all TCS-pattern aptitude + coding modules', icon: '🏢', category: 'Placement', difficulty: 'hard', xp: 500, participants: 1200, timeLeft: '12d left', type: 'special' },
    { id: 's2', title: 'Mock Drive Conqueror', description: 'Clear all 4 rounds in any Mock Drive with 70%+', icon: '🎯', category: 'Placement', difficulty: 'hard', xp: 400, participants: 340, timeLeft: '8d left', type: 'special' },
    { id: 's3', title: 'Resume Perfection', description: 'Build a resume that scores 85+ on our AI checker', icon: '📄', category: 'Career', difficulty: 'medium', xp: 150, participants: 560, timeLeft: 'Ongoing', type: 'special' },
];

const DIFFICULTY_STYLES = {
    easy: { bg: 'bg-green-50', text: 'text-green-700', label: 'Easy' },
    medium: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'Medium' },
    hard: { bg: 'bg-red-50', text: 'text-red-700', label: 'Hard' },
};

export default function ChallengesPage() {
    const [tab, setTab] = useState<'daily' | 'weekly' | 'special'>('daily');
    const [challenges, setChallenges] = useState<Challenge[]>(CHALLENGES);

    useEffect(() => {
        if (!auth.isLoggedIn()) { window.location.href = '/login'; return; }
    }, []);

    const filtered = challenges.filter(c => c.type === tab);
    const completedToday = challenges.filter(c => c.type === 'daily' && c.completed).length;
    const totalDaily = challenges.filter(c => c.type === 'daily').length;
    const totalXP = challenges.filter(c => c.completed).reduce((sum, c) => sum + c.xp, 0);

    return (
        <div className="flex min-h-screen bg-slate-50">
            <SideNav />
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1 pb-24 md:pb-8">
                    {/* Hero */}
                    <div className="bg-gradient-to-br from-yellow-500 via-amber-500 to-orange-600 text-white px-6 py-10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
                        <div className="max-w-3xl mx-auto relative z-10">
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                                <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full mb-3 inline-block">🏆 CHALLENGES</span>
                                <h1 className="text-3xl font-bold mb-2">Daily & Weekly Challenges</h1>
                                <p className="text-white/60 text-sm mb-4">Complete challenges to earn XP, badges, and climb the leaderboard.</p>
                                <div className="flex items-center gap-4">
                                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-5 py-3 text-center">
                                        <p className="text-2xl font-bold">{completedToday}/{totalDaily}</p>
                                        <p className="text-[10px] text-white/60 uppercase font-semibold">Today</p>
                                    </div>
                                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-5 py-3 text-center">
                                        <p className="text-2xl font-bold">{totalXP}</p>
                                        <p className="text-[10px] text-white/60 uppercase font-semibold">XP Earned</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    <div className="px-4 md:px-6 py-6 max-w-3xl mx-auto">
                        {/* Tabs */}
                        <div className="flex gap-2 mb-5">
                            {([
                                { key: 'daily' as const, label: '📅 Daily', count: challenges.filter(c => c.type === 'daily').length },
                                { key: 'weekly' as const, label: '📆 Weekly', count: challenges.filter(c => c.type === 'weekly').length },
                                { key: 'special' as const, label: '⭐ Special', count: challenges.filter(c => c.type === 'special').length },
                            ]).map(t => (
                                <button key={t.key} onClick={() => setTab(t.key)}
                                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 ${tab === t.key
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                                        : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-200'
                                        }`}>
                                    {t.label} <span className={`text-xs ${tab === t.key ? 'text-indigo-200' : 'text-slate-400'}`}>({t.count})</span>
                                </button>
                            ))}
                        </div>

                        {/* Challenge Cards */}
                        <div className="space-y-3">
                            {filtered.map((challenge, i) => {
                                const diff = DIFFICULTY_STYLES[challenge.difficulty];
                                return (
                                    <motion.div key={challenge.id}
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className={`st-card p-5 hover:shadow-md transition-all ${challenge.completed ? 'bg-green-50 border-green-200 opacity-75' : ''}`}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${challenge.completed ? 'bg-green-100' : 'bg-slate-50'}`}>
                                                {challenge.completed ? '✅' : challenge.icon}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${diff.bg} ${diff.text}`}>{diff.label}</span>
                                                    <span className="text-[10px] text-slate-400">{challenge.category}</span>
                                                </div>
                                                <h3 className={`font-bold text-sm mb-0.5 ${challenge.completed ? 'text-green-700 line-through' : 'text-slate-900'}`}>
                                                    {challenge.title}
                                                </h3>
                                                <p className="text-xs text-slate-500 mb-2">{challenge.description}</p>

                                                {/* Progress bar */}
                                                {challenge.maxProgress && !challenge.completed && (
                                                    <div className="mb-2">
                                                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                                            <div className="h-full bg-indigo-500 rounded-full transition-all"
                                                                style={{ width: `${((challenge.progress || 0) / challenge.maxProgress) * 100}%` }} />
                                                        </div>
                                                        <p className="text-[10px] text-slate-400 mt-0.5">{challenge.progress || 0}/{challenge.maxProgress} progress</p>
                                                    </div>
                                                )}

                                                <div className="flex items-center gap-3 text-xs text-slate-400">
                                                    <span>⏰ {challenge.timeLeft}</span>
                                                    <span>👥 {challenge.participants}</span>
                                                </div>
                                            </div>

                                            <div className="text-right shrink-0">
                                                <span className="text-sm font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">+{challenge.xp} XP</span>
                                            </div>
                                        </div>

                                        {!challenge.completed && (
                                            <div className="mt-4 pt-3 border-t border-slate-100">
                                                <Link href={
                                                    challenge.category === 'Coding' ? '/practice' :
                                                        challenge.category === 'Aptitude' ? '/aptitude' :
                                                            challenge.category === 'Career' ? '/chat' :
                                                                challenge.category === 'Skills' ? '/skills' :
                                                                    challenge.category === 'Placement' ? '/mock-drive' :
                                                                        challenge.category === 'Social' ? '/community' : '/dashboard'
                                                } className="st-btn-primary w-full text-xs py-2 text-center block">
                                                    Start Challenge →
                                                </Link>
                                            </div>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Leaderboard CTA */}
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                            className="mt-8 st-card p-6 text-center bg-gradient-to-br from-indigo-50 to-violet-50 border-indigo-100">
                            <span className="text-3xl block mb-2">🏅</span>
                            <h3 className="font-bold text-slate-900 mb-1">Climb the Leaderboard</h3>
                            <p className="text-sm text-slate-500 mb-3">Complete challenges to earn XP and move up in your campus ranking.</p>
                            <div className="flex gap-2 justify-center">
                                <Link href="/leaderboard" className="st-btn-primary text-xs px-4 py-2">View Leaderboard</Link>
                                <Link href="/achievements" className="st-btn-secondary text-xs px-4 py-2">My Badges</Link>
                            </div>
                        </motion.div>
                    </div>
                </main>
                <BottomNav />
            </div>
        </div>
    );
}
