'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { auth } from '@/lib/api';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';

export default function DailyPage() {
    const [completed, setCompleted] = useState<string[]>([]);

    useEffect(() => {
        if (!auth.isLoggedIn()) { window.location.href = '/login'; return; }
    }, []);

    const dailyTasks = [
        { id: 'solve', icon: '💻', title: 'Solve 1 Coding Problem', xp: 50, link: '/practice', desc: 'Any difficulty counts' },
        { id: 'chat', icon: '💬', title: 'Ask AI Career Advisor', xp: 20, link: '/chat', desc: 'Ask about careers, interviews, or skills' },
        { id: 'review', icon: '📄', title: 'Review Your Roadmap', xp: 15, link: '/learn', desc: 'Check progress on your learning path' },
        { id: 'network', icon: '🤝', title: 'Connect with a Peer', xp: 25, link: '/network', desc: 'Expand your professional network' },
        { id: 'read', icon: '📰', title: 'Read Skill Market Trends', xp: 10, link: '/skill-market', desc: 'Stay updated with industry trends' },
    ];

    const toggle = (id: string) => {
        setCompleted(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    const totalXP = dailyTasks.filter(t => completed.includes(t.id)).reduce((sum, t) => sum + t.xp, 0);
    const maxXP = dailyTasks.reduce((sum, t) => sum + t.xp, 0);

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1 pb-24 md:pb-8">
                    <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white px-6 py-8">
                        <h1 className="text-2xl font-bold mb-2">📅 Daily Quests</h1>
                        <p className="text-white/80 text-sm mb-4">Complete daily tasks to boost your SkillTen Score</p>
                        <div className="bg-white/20 rounded-full h-3 overflow-hidden max-w-xs">
                            <motion.div className="h-full bg-white rounded-full"
                                animate={{ width: `${(totalXP / maxXP) * 100}%` }}
                                transition={{ duration: 0.5 }} />
                        </div>
                        <p className="text-white/70 text-xs mt-2">{totalXP}/{maxXP} XP earned today</p>
                    </div>

                    <div className="px-4 md:px-6 py-6 max-w-3xl mx-auto space-y-3">
                        {dailyTasks.map((task, i) => (
                            <motion.div key={task.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.08 }}
                                className={`st-card p-4 flex items-center gap-4 cursor-pointer transition-all ${completed.includes(task.id) ? 'opacity-60 bg-green-50' : 'hover:shadow-lg'
                                    }`}
                                onClick={() => toggle(task.id)}
                            >
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all ${completed.includes(task.id) ? 'bg-green-100' : 'bg-slate-100'
                                    }`}>
                                    {completed.includes(task.id) ? '✅' : task.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className={`font-semibold text-sm ${completed.includes(task.id) ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                                        {task.title}
                                    </p>
                                    <p className="text-xs text-slate-500">{task.desc}</p>
                                </div>
                                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md shrink-0">+{task.xp} XP</span>
                            </motion.div>
                        ))}
                    </div>
                </main>
                <BottomNav />
            </div>
        </div>
    );
}
