'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { auth } from '@/lib/api';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';
import { SideNav } from '@/components/layout/SideNav';

export default function AnalyticsPage() {
    useEffect(() => {
        if (!auth.isLoggedIn()) { window.location.href = '/login'; return; }
    }, []);

    const metrics = [
        { label: 'Profile Views', value: 42, change: '+12%', icon: '👀', color: 'from-blue-500 to-cyan-500' },
        { label: 'Recruiter Looks', value: 8, change: '+3', icon: '🏢', color: 'from-purple-500 to-pink-500' },
        { label: 'Job Match Rate', value: '78%', change: '+5%', icon: '🎯', color: 'from-emerald-500 to-teal-500' },
        { label: 'Skill Rank', value: '#245', change: '↑32', icon: '📊', color: 'from-amber-500 to-orange-500' },
    ];

    const weeklyActivity = [
        { day: 'Mon', problems: 3, hours: 2.5 },
        { day: 'Tue', problems: 5, hours: 3 },
        { day: 'Wed', problems: 2, hours: 1.5 },
        { day: 'Thu', problems: 4, hours: 2 },
        { day: 'Fri', problems: 6, hours: 3.5 },
        { day: 'Sat', problems: 1, hours: 1 },
        { day: 'Sun', problems: 3, hours: 2 },
    ];

    const maxProblems = Math.max(...weeklyActivity.map(d => d.problems));

    return (
        <div className="flex min-h-screen bg-slate-50">
            <SideNav />
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1 pb-24 md:pb-8">
                    <div className="bg-white border-b border-slate-200 px-6 py-6">
                        <h1 className="text-2xl font-bold text-slate-900 mb-2">📈 Analytics</h1>
                        <p className="text-slate-500 text-sm">Track your growth, visibility, and career progress</p>
                    </div>

                    <div className="px-4 md:px-6 py-6 max-w-4xl mx-auto space-y-6">
                        {/* Key metrics */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {metrics.map((m, i) => (
                                <motion.div key={m.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="st-card p-4 text-center"
                                >
                                    <span className="text-xl block mb-2">{m.icon}</span>
                                    <p className="text-2xl font-bold text-slate-900">{m.value}</p>
                                    <p className="text-[10px] text-slate-500 uppercase mt-0.5">{m.label}</p>
                                    <span className="text-xs text-green-600 font-medium">{m.change}</span>
                                </motion.div>
                            ))}
                        </div>

                        {/* Weekly chart */}
                        <section className="st-card p-6">
                            <h2 className="font-bold text-slate-900 mb-4">Weekly Coding Activity</h2>
                            <div className="flex items-end justify-between h-40 gap-2">
                                {weeklyActivity.map((d, i) => (
                                    <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                                        <motion.div
                                            className="w-full bg-gradient-to-t from-indigo-500 to-violet-400 rounded-t-lg min-h-[4px]"
                                            initial={{ height: 0 }}
                                            animate={{ height: `${(d.problems / maxProblems) * 100}%` }}
                                            transition={{ delay: i * 0.1, duration: 0.5 }}
                                        />
                                        <span className="text-[10px] text-slate-500 mt-1">{d.day}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Insights */}
                        <section className="st-card p-6">
                            <h2 className="font-bold text-slate-900 mb-4">💡 AI Insights</h2>
                            <div className="space-y-3">
                                {[
                                    'You\'re most productive on Fridays — try to schedule tough problems then',
                                    'Your Python problem-solving speed increased 15% this week',
                                    'Recruiters from 3 companies viewed your profile this month',
                                ].map((insight, i) => (
                                    <div key={i} className="flex items-start gap-3 p-3 bg-indigo-50 rounded-xl">
                                        <span className="text-indigo-500 text-sm mt-0.5">💡</span>
                                        <p className="text-sm text-slate-700">{insight}</p>
                                    </div>
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
