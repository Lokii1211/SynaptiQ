'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { api, auth } from '@/lib/api';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';
import { SideNav } from '@/components/layout/SideNav';
import Link from 'next/link';

export default function AnalyticsPage() {
    const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('week');

    useEffect(() => {
        if (!auth.isLoggedIn()) { window.location.href = '/login'; return; }
    }, []);

    const metrics = [
        { label: 'Profile Views', value: 42, change: '+12%', up: true, icon: '👀', color: 'from-blue-500 to-cyan-500' },
        { label: 'Recruiter Views', value: 8, change: '+3', up: true, icon: '🏢', color: 'from-purple-500 to-pink-500' },
        { label: 'Job Match Rate', value: '78%', change: '+5%', up: true, icon: '🎯', color: 'from-emerald-500 to-teal-500' },
        { label: 'Global Rank', value: '#245', change: '↑32', up: true, icon: '📊', color: 'from-amber-500 to-orange-500' },
    ];

    const weeklyActivity = [
        { day: 'Mon', problems: 3, hours: 2.5, aptitude: 2 },
        { day: 'Tue', problems: 5, hours: 3, aptitude: 1 },
        { day: 'Wed', problems: 2, hours: 1.5, aptitude: 3 },
        { day: 'Thu', problems: 4, hours: 2, aptitude: 0 },
        { day: 'Fri', problems: 6, hours: 3.5, aptitude: 2 },
        { day: 'Sat', problems: 1, hours: 1, aptitude: 1 },
        { day: 'Sun', problems: 3, hours: 2, aptitude: 0 },
    ];

    const skillBreakdown = [
        { skill: 'Python', level: 85, problems: 45, color: 'bg-blue-500' },
        { skill: 'Data Structures', level: 72, problems: 30, color: 'bg-green-500' },
        { skill: 'SQL', level: 68, problems: 18, color: 'bg-amber-500' },
        { skill: 'System Design', level: 45, problems: 8, color: 'bg-purple-500' },
        { skill: 'JavaScript', level: 60, problems: 22, color: 'bg-rose-500' },
    ];

    const scoreHistory = [
        { week: 'W1', score: 32 },
        { week: 'W2', score: 38 },
        { week: 'W3', score: 41 },
        { week: 'W4', score: 48 },
        { week: 'W5', score: 52 },
        { week: 'W6', score: 55 },
        { week: 'W7', score: 61 },
        { week: 'W8', score: 64 },
    ];

    const maxProblems = Math.max(...weeklyActivity.map(d => d.problems));
    const maxScore = Math.max(...scoreHistory.map(d => d.score));

    return (
        <div className="flex min-h-screen bg-slate-50">
            <SideNav />
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1 pb-24 md:pb-8">
                    {/* Header */}
                    <div className="bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 text-white px-6 py-10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
                        <div className="max-w-4xl mx-auto relative z-10">
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                                <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full mb-3 inline-block">📊 ANALYTICS</span>
                                <h1 className="text-3xl font-bold mb-2">Your Growth Dashboard</h1>
                                <p className="text-white/60 text-sm">Track your career readiness progress over time</p>
                            </motion.div>
                        </div>
                    </div>

                    <div className="px-4 md:px-6 py-6 max-w-4xl mx-auto space-y-6">
                        {/* Time Range */}
                        <div className="flex gap-2">
                            {(['week', 'month', 'all'] as const).map(t => (
                                <button key={t} onClick={() => setTimeRange(t)}
                                    className={`px-4 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${timeRange === t
                                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200'
                                        : 'bg-white text-slate-600 border border-slate-200 hover:border-emerald-200'
                                        }`}>{t === 'all' ? 'All Time' : `This ${t}`}</button>
                            ))}
                        </div>

                        {/* Key metrics */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {metrics.map((m, i) => (
                                <motion.div key={m.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.08 }}
                                    className="st-card p-4"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-lg">{m.icon}</span>
                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${m.up ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>{m.change}</span>
                                    </div>
                                    <p className="text-2xl font-bold text-slate-900">{m.value}</p>
                                    <p className="text-[10px] text-slate-500 uppercase mt-0.5 font-semibold">{m.label}</p>
                                </motion.div>
                            ))}
                        </div>

                        {/* Viya Score Trend */}
                        <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                            className="st-card p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h2 className="font-bold text-slate-900">Viya Score™ Trend</h2>
                                    <p className="text-xs text-slate-500">Your career readiness over 8 weeks</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-emerald-600">64</p>
                                    <p className="text-[10px] text-green-600 font-semibold">+32 pts in 8 weeks</p>
                                </div>
                            </div>
                            <div className="flex items-end gap-1 h-32">
                                {scoreHistory.map((d, i) => (
                                    <div key={d.week} className="flex-1 flex flex-col items-center gap-1">
                                        <span className="text-[9px] text-slate-400">{d.score}</span>
                                        <motion.div
                                            className="w-full bg-gradient-to-t from-emerald-500 to-teal-400 rounded-t-md min-h-[4px]"
                                            initial={{ height: 0 }}
                                            animate={{ height: `${(d.score / maxScore) * 100}%` }}
                                            transition={{ delay: 0.2 + i * 0.08, duration: 0.4 }}
                                        />
                                        <span className="text-[10px] text-slate-500 mt-1">{d.week}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.section>

                        {/* Weekly Activity & Skill Breakdown side by side */}
                        <div className="grid md:grid-cols-2 gap-4">
                            {/* Weekly chart */}
                            <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                                className="st-card p-6">
                                <h2 className="font-bold text-slate-900 mb-1">Weekly Coding Activity</h2>
                                <p className="text-xs text-slate-500 mb-4">Problems solved per day</p>
                                <div className="flex items-end justify-between h-32 gap-1">
                                    {weeklyActivity.map((d, i) => (
                                        <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                                            <span className="text-[9px] text-slate-400">{d.problems}</span>
                                            <motion.div
                                                className="w-full bg-gradient-to-t from-indigo-500 to-violet-400 rounded-t-md min-h-[4px]"
                                                initial={{ height: 0 }}
                                                animate={{ height: `${(d.problems / maxProblems) * 100}%` }}
                                                transition={{ delay: 0.2 + i * 0.08, duration: 0.4 }}
                                            />
                                            <span className="text-[10px] text-slate-500 mt-1">{d.day}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between text-xs text-slate-500">
                                    <span>Total: <strong className="text-slate-900">{weeklyActivity.reduce((s, d) => s + d.problems, 0)} problems</strong></span>
                                    <span>Avg: <strong className="text-slate-900">{(weeklyActivity.reduce((s, d) => s + d.hours, 0) / 7).toFixed(1)}h/day</strong></span>
                                </div>
                            </motion.section>

                            {/* Skill breakdown */}
                            <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                                className="st-card p-6">
                                <h2 className="font-bold text-slate-900 mb-1">Skill Breakdown</h2>
                                <p className="text-xs text-slate-500 mb-4">Proficiency by topic</p>
                                <div className="space-y-3">
                                    {skillBreakdown.map((s, i) => (
                                        <div key={s.skill}>
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-xs font-semibold text-slate-700">{s.skill}</span>
                                                <span className="text-[10px] text-slate-400">{s.problems} problems · {s.level}%</span>
                                            </div>
                                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                                <motion.div
                                                    className={`h-full ${s.color} rounded-full`}
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${s.level}%` }}
                                                    transition={{ delay: 0.3 + i * 0.08, duration: 0.5 }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.section>
                        </div>

                        {/* Summary Stats */}
                        <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                            className="st-card p-6">
                            <h2 className="font-bold text-slate-900 mb-4">📋 Career Readiness Summary</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { label: 'Problems Solved', value: '123', sublabel: 'Lifetime', icon: '💻' },
                                    { label: 'Current Streak', value: '12', sublabel: 'days', icon: '🔥' },
                                    { label: 'Skills Verified', value: '4', sublabel: 'of 8 target', icon: '✅' },
                                    { label: 'Badges Earned', value: '7', sublabel: 'of 24 total', icon: '🏅' },
                                    { label: 'AI Sessions', value: '34', sublabel: 'conversations', icon: '💬' },
                                    { label: 'Aptitude Tests', value: '12', sublabel: 'completed', icon: '🧠' },
                                    { label: 'Hours Invested', value: '48', sublabel: 'this month', icon: '⏱️' },
                                    { label: 'Community Posts', value: '6', sublabel: 'and 15 replies', icon: '🗣️' },
                                ].map((stat, i) => (
                                    <div key={stat.label} className="text-center p-3 bg-slate-50 rounded-xl">
                                        <span className="text-lg block mb-1">{stat.icon}</span>
                                        <p className="text-xl font-bold text-slate-900">{stat.value}</p>
                                        <p className="text-[10px] text-slate-500 uppercase font-semibold">{stat.label}</p>
                                        <p className="text-[9px] text-slate-400">{stat.sublabel}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.section>

                        {/* AI Insights */}
                        <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                            className="st-card p-6">
                            <h2 className="font-bold text-slate-900 mb-4">💡 AI Growth Insights</h2>
                            <div className="space-y-3">
                                {[
                                    { insight: "You're most productive on Fridays — try to schedule tough problems then for maximum effectiveness.", type: 'tip' },
                                    { insight: 'Your Python solving speed increased 15% this week. At this rate, you\'ll hit Expert level by March.', type: 'positive' },
                                    { insight: 'Recruiters from Flipkart, Infosys, and TCS viewed your profile this month. Keep your skills verified!', type: 'opportunity' },
                                    { insight: 'System Design is your weakest area (45%). Consider spending 30 mins/day on HLD concepts to reach 70%+ by placement season.', type: 'action' },
                                    { insight: 'Your consistency is better than 82% of students on SkillTen. Maintaining this pace puts you in the top 15% by graduation.', type: 'positive' },
                                ].map((item, i) => {
                                    const colors = item.type === 'positive' ? 'bg-green-50 border-green-200' :
                                        item.type === 'opportunity' ? 'bg-blue-50 border-blue-200' :
                                            item.type === 'action' ? 'bg-amber-50 border-amber-200' : 'bg-indigo-50 border-indigo-200';
                                    const icon = item.type === 'positive' ? '✅' : item.type === 'opportunity' ? '🎯' : item.type === 'action' ? '⚡' : '💡';
                                    return (
                                        <div key={i} className={`flex items-start gap-3 p-3.5 rounded-xl border ${colors}`}>
                                            <span className="text-sm mt-0.5">{icon}</span>
                                            <p className="text-sm text-slate-700 leading-relaxed">{item.insight}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.section>

                        {/* CTA */}
                        <div className="flex gap-3 justify-center">
                            <Link href="/practice" className="st-btn-primary text-sm px-5 py-2.5">💻 Solve Problems</Link>
                            <Link href="/score" className="st-btn-secondary text-sm px-5 py-2.5">📊 View Full Score</Link>
                        </div>
                    </div>
                </main>
                <BottomNav />
            </div>
        </div>
    );
}
