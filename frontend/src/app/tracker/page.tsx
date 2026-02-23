'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { auth } from '@/lib/api';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';
import { SideNav } from '@/components/layout/SideNav';

export default function TrackerPage() {
    const [streak, setStreak] = useState(0);
    const [weekData, setWeekData] = useState<{ day: string; active: boolean }[]>([]);

    useEffect(() => {
        if (!auth.isLoggedIn()) { window.location.href = '/login'; return; }
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const today = new Date().getDay();
        setWeekData(days.map((d, i) => ({ day: d, active: i < (today === 0 ? 7 : today) })));
        setStreak(today === 0 ? 7 : today);
    }, []);

    const milestones = [
        { days: 7, label: '1 Week', icon: '🌱', reward: '+50 XP' },
        { days: 30, label: '1 Month', icon: '🔥', reward: '+200 XP' },
        { days: 90, label: '3 Months', icon: '⭐', reward: '+500 XP' },
        { days: 180, label: '6 Months', icon: '💎', reward: '+1000 XP' },
        { days: 365, label: '1 Year', icon: '👑', reward: '+2500 XP' },
    ];

    const activities = [
        { time: 'Today', action: 'Solved 2 coding problems', type: 'coding', icon: '💻' },
        { time: 'Today', action: 'Asked AI about ML careers', type: 'chat', icon: '💬' },
        { time: 'Yesterday', action: 'Completed Python roadmap step', type: 'learning', icon: '📚' },
        { time: '2 days ago', action: 'Applied to 3 internships', type: 'jobs', icon: '💼' },
    ];

    return (
        <div className="flex min-h-screen bg-slate-50">
            <SideNav />
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1 pb-24 md:pb-8">
                    <div className="bg-gradient-to-br from-orange-500 to-red-600 text-white px-6 py-8 text-center">
                        <p className="text-white/70 text-sm mb-1">Current Streak</p>
                        <motion.p initial={{ scale: 0 }} animate={{ scale: 1 }}
                            className="text-6xl font-black mb-1">{streak}</motion.p>
                        <p className="text-white/60 text-sm">days active 🔥</p>
                    </div>

                    <div className="px-4 md:px-6 py-6 max-w-3xl mx-auto space-y-6">
                        {/* Week view */}
                        <section className="st-card p-5">
                            <h2 className="font-semibold text-slate-900 mb-3">This Week</h2>
                            <div className="flex justify-between">
                                {weekData.map((d) => (
                                    <div key={d.day} className="flex flex-col items-center gap-1.5">
                                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold transition-colors ${d.active ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-400'
                                            }`}>{d.active ? '✓' : '·'}</div>
                                        <span className="text-[10px] text-slate-500">{d.day}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Milestones */}
                        <section>
                            <h2 className="st-section-title mb-3">Milestones</h2>
                            <div className="space-y-2">
                                {milestones.map(m => (
                                    <div key={m.days} className={`st-card p-4 flex items-center gap-4 ${streak >= m.days ? 'bg-amber-50 border-amber-200' : ''}`}>
                                        <span className="text-2xl">{m.icon}</span>
                                        <div className="flex-1">
                                            <p className="font-semibold text-slate-900 text-sm">{m.label}</p>
                                            <p className="text-xs text-slate-500">{m.days} consecutive days</p>
                                        </div>
                                        <span className={`text-xs font-bold px-2 py-1 rounded-md ${streak >= m.days ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-400'
                                            }`}>{streak >= m.days ? '✅ Earned' : m.reward}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Activity log */}
                        <section>
                            <h2 className="st-section-title mb-3">Recent Activity</h2>
                            <div className="space-y-2">
                                {activities.map((a, i) => (
                                    <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="st-card p-3 flex items-center gap-3"
                                    >
                                        <span className="text-lg">{a.icon}</span>
                                        <div className="flex-1">
                                            <p className="text-sm text-slate-800">{a.action}</p>
                                            <p className="text-[10px] text-slate-400">{a.time}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </section>
                    </div>
                </main>
                <BottomNav />
            </div>
        </div>
    );
}
