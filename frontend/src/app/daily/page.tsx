'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth } from '@/lib/api';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';
import Link from 'next/link';

export default function DailyPage() {
    const [completed, setCompleted] = useState<string[]>([]);
    const [countdown, setCountdown] = useState('');

    useEffect(() => {
        if (!auth.isLoggedIn()) { window.location.href = '/login'; return; }
        // Update countdown every second
        const tick = () => {
            const now = new Date();
            const midnight = new Date(now);
            midnight.setHours(24, 0, 0, 0);
            const diff = midnight.getTime() - now.getTime();
            const h = Math.floor(diff / 3600000);
            const m = Math.floor((diff % 3600000) / 60000);
            const s = Math.floor((diff % 60000) / 1000);
            setCountdown(`${h}h ${m}m ${s}s`);
        };
        tick();
        const interval = setInterval(tick, 1000);
        return () => clearInterval(interval);
    }, []);

    const dailyTasks = [
        { id: 'solve', icon: '💻', title: 'Solve 1 Coding Problem', xp: 50, link: '/practice', desc: 'Any difficulty counts', category: 'core' },
        { id: 'aptitude', icon: '🧠', title: 'Aptitude Quick Practice', xp: 40, link: '/aptitude', desc: '5 questions in Practice Mode', category: 'core' },
        { id: 'chat', icon: '💬', title: 'Ask AI Career Advisor', xp: 20, link: '/chat', desc: 'Ask about careers, interviews, or skills', category: 'explore' },
        { id: 'review', icon: '📄', title: 'Review Your Roadmap', xp: 15, link: '/roadmap', desc: 'Check progress on your learning path', category: 'explore' },
        { id: 'community', icon: '🗣️', title: 'Post or Reply in Community', xp: 25, link: '/community', desc: 'Help a fellow student', category: 'social' },
        { id: 'network', icon: '🤝', title: 'Connect with a Peer', xp: 25, link: '/network', desc: 'Expand your professional network', category: 'social' },
        { id: 'read', icon: '📰', title: 'Read Skill Market Trends', xp: 10, link: '/skill-market', desc: 'Stay updated with industry trends', category: 'explore' },
    ];

    const toggle = (id: string) => {
        setCompleted(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    const totalXP = dailyTasks.filter(t => completed.includes(t.id)).reduce((sum, t) => sum + t.xp, 0);
    const maxXP = dailyTasks.reduce((sum, t) => sum + t.xp, 0);
    const pct = Math.round((totalXP / maxXP) * 100);
    const allDone = completed.length === dailyTasks.length;

    const dailyChallenge = {
        title: 'Two Sum',
        difficulty: 'Easy',
        company: 'Amazon',
        topic: 'Arrays & Hashing',
        solvedCount: 8432,
        slug: 'two-sum',
    };

    const aptitudeQOTD = {
        question: 'A train travels 360 km in 4 hours. If its speed is increased by 20%, how long will it take?',
        topic: 'Time, Speed & Distance',
        difficulty: 'Medium',
    };

    // Streak milestones
    const streak = 23;
    const nextMilestone = streak < 7 ? 7 : streak < 30 ? 30 : streak < 60 ? 60 : streak < 100 ? 100 : 365;
    const streakProgress = Math.min(100, (streak / nextMilestone) * 100);

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1 pb-24 md:pb-8">
                    {/* Hero with countdown */}
                    <div className="bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 text-white px-6 py-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
                        <div className="max-w-3xl mx-auto relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full mb-2 inline-block">📅 DAILY QUESTS</span>
                                    <h1 className="text-2xl font-bold st-font-heading">Today&apos;s Missions</h1>
                                    <p className="text-white/70 text-sm mt-1">Complete daily tasks to boost your Mentixy Score</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-3xl font-bold">{streak}🔥</p>
                                    <p className="text-[10px] text-white/60 uppercase font-semibold">Day Streak</p>
                                </div>
                            </div>
                            {/* Progress bar */}
                            <div className="bg-white/20 rounded-full h-3 overflow-hidden">
                                <motion.div className="h-full bg-white rounded-full"
                                    animate={{ width: `${pct}%` }}
                                    transition={{ duration: 0.5 }} />
                            </div>
                            <div className="flex justify-between items-center mt-2">
                                <p className="text-white/70 text-xs">{totalXP}/{maxXP} XP · {completed.length}/{dailyTasks.length} tasks</p>
                                <p className="text-white/60 text-xs font-mono">Resets in {countdown}</p>
                            </div>
                        </div>
                    </div>

                    <div className="px-4 md:px-6 py-6 max-w-3xl mx-auto space-y-5">
                        {/* Success celebration */}
                        <AnimatePresence>
                            {allDone && (
                                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                                    className="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-2xl p-5 text-center">
                                    <span className="text-4xl block mb-2">🎉</span>
                                    <p className="font-bold text-amber-800 text-lg">All Quests Complete!</p>
                                    <p className="text-sm text-amber-600 mt-1">You earned {maxXP} XP today. Come back tomorrow!</p>
                                    <p className="text-xs text-amber-500 mt-2">🔥 Streak extended to {streak + 1} days</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Daily Coding Challenge (highlighted) */}
                        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
                            <Link href={`/practice/${dailyChallenge.slug}`} className="block">
                                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-lg transition-all group">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded font-bold uppercase">⚡ Daily Challenge</span>
                                            <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${dailyChallenge.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-600' :
                                                    dailyChallenge.difficulty === 'Medium' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
                                                }`}>{dailyChallenge.difficulty}</span>
                                        </div>
                                        <span className="text-xs text-slate-400">{dailyChallenge.solvedCount.toLocaleString()} solved</span>
                                    </div>
                                    <h3 className="font-bold text-slate-900 text-lg group-hover:text-indigo-600 transition-colors">{dailyChallenge.title}</h3>
                                    <div className="flex items-center gap-3 mt-2">
                                        <span className="text-xs text-slate-500">📂 {dailyChallenge.topic}</span>
                                        <span className="text-xs text-slate-500">🏢 {dailyChallenge.company}</span>
                                    </div>
                                    <div className="mt-3 flex items-center justify-between">
                                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg">+100 XP Bonus</span>
                                        <span className="text-sm font-semibold text-indigo-600 group-hover:translate-x-1 transition-transform">Solve Now →</span>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>

                        {/* Aptitude QOTD */}
                        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
                            <Link href="/aptitude" className="block">
                                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-lg transition-all group">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded font-bold uppercase">🧠 Question of the Day</span>
                                        <span className="text-[10px] bg-amber-50 text-amber-600 px-2 py-0.5 rounded font-bold">{aptitudeQOTD.difficulty}</span>
                                    </div>
                                    <p className="text-sm text-slate-700 line-clamp-2">{aptitudeQOTD.question}</p>
                                    <div className="flex items-center justify-between mt-3">
                                        <span className="text-xs text-slate-400">📐 {aptitudeQOTD.topic}</span>
                                        <span className="text-sm font-semibold text-indigo-600 group-hover:translate-x-1 transition-transform">Try Now →</span>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>

                        {/* Streak Milestone Progress */}
                        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                            className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-bold text-slate-900 text-sm">🏅 Next Streak Milestone</h3>
                                <span className="text-xs text-slate-400">{streak}/{nextMilestone} days</span>
                            </div>
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
                                <motion.div className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${streakProgress}%` }}
                                    transition={{ duration: 0.8, delay: 0.3 }} />
                            </div>
                            <div className="flex items-center justify-between text-xs text-slate-500">
                                <span>{nextMilestone - streak} days to go</span>
                                <span className="font-semibold text-amber-600">🏆 {nextMilestone}-Day Badge</span>
                            </div>
                        </motion.div>

                        {/* Task Categories */}
                        {['core', 'explore', 'social'].map(category => {
                            const catTasks = dailyTasks.filter(t => t.category === category);
                            const catLabel = category === 'core' ? '🎯 Core Tasks' : category === 'explore' ? '🔍 Explore' : '🤝 Social';
                            return (
                                <div key={category}>
                                    <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">{catLabel}</h2>
                                    <div className="space-y-2">
                                        {catTasks.map((task, i) => (
                                            <motion.div key={task.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.15 + i * 0.05 }}
                                                className={`bg-white rounded-xl p-4 flex items-center gap-4 cursor-pointer transition-all border ${completed.includes(task.id) ? 'border-green-200 bg-green-50/50' : 'border-slate-100 hover:shadow-md hover:border-indigo-100'
                                                    }`}
                                                onClick={() => toggle(task.id)}
                                            >
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all shrink-0 ${completed.includes(task.id) ? 'bg-green-100' : 'bg-slate-50'
                                                    }`}>
                                                    {completed.includes(task.id) ? '✅' : task.icon}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className={`font-semibold text-sm ${completed.includes(task.id) ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                                                        {task.title}
                                                    </p>
                                                    <p className="text-xs text-slate-500">{task.desc}</p>
                                                </div>
                                                <div className="flex items-center gap-2 shrink-0">
                                                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">+{task.xp}</span>
                                                    <Link href={task.link} onClick={e => e.stopPropagation()} className="text-xs text-indigo-500 hover:text-indigo-700 font-medium">Go →</Link>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}

                        {/* Weekly Bonus CTA */}
                        <div className="bg-gradient-to-r from-indigo-50 to-violet-50 rounded-2xl p-5 border border-indigo-100 text-center">
                            <p className="font-bold text-slate-900 mb-1 st-font-heading">🎁 Weekly Bonus</p>
                            <p className="text-sm text-slate-600 mb-3">Complete all daily quests 5 days this week to earn the <span className="font-semibold text-indigo-600">Weekly Champion</span> badge</p>
                            <div className="flex justify-center gap-1">
                                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => (
                                    <div key={d} className={`w-9 h-9 rounded-lg flex flex-col items-center justify-center text-[9px] font-semibold ${i < 4 ? 'bg-emerald-100 text-emerald-600' : i === 4 ? 'bg-indigo-100 text-indigo-600 ring-2 ring-indigo-300' : 'bg-slate-100 text-slate-400'
                                        }`}>
                                        {i < 4 ? '✓' : d.slice(0, 1)}
                                        <span className="text-[8px]">{d}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </main>
                <BottomNav />
            </div>
        </div>
    );
}
