'use client';
import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api, auth } from '@/lib/api';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';
import { SideNav } from '@/components/layout/SideNav';
import Link from 'next/link';

const MILESTONES = [
    { days: 7, name: 'Week Warrior', icon: '🔥', reward: '+50 XP', color: 'text-orange-600' },
    { days: 14, name: 'Fortnight Force', icon: '⚡', reward: '+100 XP', color: 'text-yellow-600' },
    { days: 30, name: 'Monthly Machine', icon: '💪', reward: '+200 XP + Badge', color: 'text-blue-600' },
    { days: 60, name: 'Unstoppable', icon: '🚀', reward: '+500 XP + Badge', color: 'text-violet-600' },
    { days: 100, name: 'Century Legend', icon: '💎', reward: '+1000 XP + Legendary Badge', color: 'text-amber-600' },
    { days: 365, name: 'Year Champion', icon: '👑', reward: '+5000 XP + Title', color: 'text-red-600' },
];

export default function TrackerPage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [streakDays, setStreakDays] = useState(0);
    const [longestStreak, setLongestStreak] = useState(0);
    const [streakFreezes, setStreakFreezes] = useState(2);
    const [lastActive, setLastActive] = useState<string | null>(null);
    const [todayDone, setTodayDone] = useState(false);
    const [showCelebration, setShowCelebration] = useState(false);
    const [celebrationMilestone, setCelebrationMilestone] = useState<typeof MILESTONES[0] | null>(null);

    // Generate heatmap data (last 365 days)
    const heatmapData = useMemo(() => {
        const data: { date: string; count: number; level: number }[] = [];
        const today = new Date();
        for (let i = 364; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            const key = d.toISOString().split('T')[0];
            // Simulate: recent days more likely to have activity
            const isRecent = i < streakDays;
            const count = isRecent ? Math.floor(Math.random() * 4) + 1 : Math.random() > 0.7 ? Math.floor(Math.random() * 3) : 0;
            data.push({ date: key, count, level: count === 0 ? 0 : count <= 1 ? 1 : count <= 2 ? 2 : count <= 3 ? 3 : 4 });
        }
        return data;
    }, [streakDays]);

    useEffect(() => {
        if (!auth.isLoggedIn()) { window.location.href = '/login'; return; }
        api.getMe().then(u => {
            setUser(u);
            const streak = u?.profile?.streak_days || 0;
            setStreakDays(streak);
            setLongestStreak(Math.max(streak, u?.profile?.longest_streak || streak));
            setLastActive(u?.profile?.last_active_date || null);
            // Check if today already done
            const today = new Date().toISOString().split('T')[0];
            setTodayDone(u?.profile?.last_active_date === today);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    const handleFreeze = () => {
        if (streakFreezes <= 0) return;
        setStreakFreezes(prev => prev - 1);
    };

    const nextMilestone = MILESTONES.find(m => m.days > streakDays);
    const daysToNext = nextMilestone ? nextMilestone.days - streakDays : 0;
    const achievedMilestones = MILESTONES.filter(m => m.days <= streakDays);

    const LEVEL_COLORS = ['bg-slate-100', 'bg-emerald-200', 'bg-emerald-400', 'bg-emerald-500', 'bg-emerald-700'];
    const WEEKDAYS = ['Mon', '', 'Wed', '', 'Fri', '', ''];

    // Calculate weeks for heatmap
    const weeks = useMemo(() => {
        const result: { date: string; count: number; level: number }[][] = [];
        for (let i = 0; i < heatmapData.length; i += 7) {
            result.push(heatmapData.slice(i, i + 7));
        }
        return result;
    }, [heatmapData]);

    if (loading) return (
        <div className="flex min-h-screen bg-slate-50">
            <SideNav />
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1 flex items-center justify-center">
                    <div className="w-12 h-12 border-3 border-slate-200 border-t-indigo-600 rounded-full animate-spin" />
                </main>
                <BottomNav />
            </div>
        </div>
    );

    return (
        <div className="flex min-h-screen bg-slate-50">
            <SideNav />
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1 pb-24 md:pb-8">
                    {/* Hero */}
                    <div className="bg-gradient-to-br from-orange-500 via-red-500 to-rose-600 text-white px-6 py-10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
                        <div className="max-w-3xl mx-auto relative z-10">
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
                                <div>
                                    <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full mb-3 inline-block">🔥 STREAK TRACKER</span>
                                    <h1 className="text-4xl font-bold mb-1 flex items-center gap-3">
                                        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }} className="text-5xl">
                                            🔥
                                        </motion.span>
                                        {streakDays} Days
                                    </h1>
                                    <p className="text-white/60 text-sm">
                                        {todayDone ? '✓ Today\'s activity complete' : '⚠️ Complete an activity to maintain streak'}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-white/50 text-[10px] uppercase font-semibold">Best Streak</p>
                                    <p className="text-2xl font-bold">{longestStreak}d</p>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    <div className="px-4 md:px-6 py-6 max-w-3xl mx-auto space-y-5">

                        {/* Today's Status */}
                        <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                            className={`st-card p-6 ${todayDone ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'} border`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-3xl">{todayDone ? '✅' : '⏰'}</span>
                                    <div>
                                        <p className="font-bold text-slate-900">{todayDone ? 'Streak Secured!' : 'Streak at Risk!'}</p>
                                        <p className="text-xs text-slate-500">
                                            {todayDone ? 'Come back tomorrow to continue' : 'Complete any activity to keep your streak'}
                                        </p>
                                    </div>
                                </div>
                                {!todayDone && (
                                    <Link href="/practice" className="st-btn-primary text-xs px-4 py-2">
                                        Solve a Problem →
                                    </Link>
                                )}
                            </div>
                        </motion.section>

                        {/* Streak Freeze */}
                        <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                            className="st-card p-6"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                        🧊 Streak Freeze
                                    </h3>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        Protects your streak for one missed day. Earn more by reaching milestones.
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {[...Array(3)].map((_, i) => (
                                        <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 + i * 0.1 }}
                                            className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${i < streakFreezes
                                                ? 'bg-cyan-100 text-cyan-600 border border-cyan-200'
                                                : 'bg-slate-100 text-slate-300'
                                                }`}
                                        >🧊</motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.section>

                        {/* Next Milestone */}
                        {nextMilestone && (
                            <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                                className="st-card p-6"
                            >
                                <h3 className="font-bold text-slate-900 mb-3">🎯 Next Milestone</h3>
                                <div className="flex items-center gap-4">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl bg-slate-50`}>
                                        {nextMilestone.icon}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-slate-900">{nextMilestone.name}</p>
                                        <p className="text-xs text-slate-500">{daysToNext} days to go · Reward: {nextMilestone.reward}</p>
                                        <div className="w-full bg-slate-100 rounded-full h-2 mt-2 overflow-hidden">
                                            <motion.div className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(streakDays / nextMilestone.days) * 100}%` }}
                                                transition={{ duration: 1, delay: 0.3 }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </motion.section>
                        )}

                        {/* Activity Heatmap */}
                        <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                            className="st-card p-6"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-slate-900">📊 365-day Activity</h3>
                                <span className="text-xs text-slate-400">
                                    {heatmapData.filter(d => d.count > 0).length} active days
                                </span>
                            </div>
                            <div className="overflow-x-auto">
                                <div className="flex gap-[3px] min-w-[720px]">
                                    {/* Weekday labels */}
                                    <div className="flex flex-col gap-[3px] mr-1">
                                        {WEEKDAYS.map((day, i) => (
                                            <div key={i} className="h-[11px] text-[9px] text-slate-400 flex items-center">{day}</div>
                                        ))}
                                    </div>
                                    {weeks.map((week, wi) => (
                                        <div key={wi} className="flex flex-col gap-[3px]">
                                            {week.map((day, di) => (
                                                <motion.div key={di}
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{ delay: 0.3 + wi * 0.005 }}
                                                    className={`w-[11px] h-[11px] rounded-[2px] ${LEVEL_COLORS[day.level]} border border-transparent hover:border-slate-300 cursor-pointer`}
                                                    title={`${day.date}: ${day.count} activities`}
                                                />
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center gap-1 mt-3 justify-end text-[10px] text-slate-400">
                                Less
                                {LEVEL_COLORS.map((c, i) => (
                                    <div key={i} className={`w-[10px] h-[10px] rounded-[2px] ${c}`} />
                                ))}
                                More
                            </div>
                        </motion.section>

                        {/* Milestones Timeline */}
                        <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                            className="st-card p-6"
                        >
                            <h3 className="font-bold text-slate-900 mb-4">🏅 Streak Milestones</h3>
                            <div className="space-y-4 relative">
                                <div className="absolute left-5 top-2 bottom-2 w-0.5 bg-slate-100" />
                                {MILESTONES.map((m, i) => {
                                    const achieved = streakDays >= m.days;
                                    return (
                                        <motion.div key={m.days}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.35 + i * 0.05 }}
                                            className="flex items-center gap-4 relative"
                                        >
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0 z-10 ${achieved
                                                ? 'bg-gradient-to-br from-green-400 to-emerald-500 shadow-md'
                                                : 'bg-slate-100'
                                                }`}>
                                                {achieved ? '✓' : m.icon}
                                            </div>
                                            <div className={`flex-1 ${!achieved ? 'opacity-50' : ''}`}>
                                                <div className="flex items-center justify-between">
                                                    <p className="font-semibold text-sm text-slate-900">{m.name}</p>
                                                    <span className="text-xs font-medium text-slate-400">{m.days} days</span>
                                                </div>
                                                <p className="text-xs text-slate-500">{m.reward}</p>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </motion.section>

                        {/* Quick Actions */}
                        <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                            <h3 className="font-bold text-slate-900 mb-3">⚡ Quick Activity (any one maintains streak)</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { icon: '💻', label: 'Solve a Problem', href: '/practice' },
                                    { icon: '🧮', label: 'Aptitude Test', href: '/aptitude' },
                                    { icon: '💬', label: 'Ask AI Advisor', href: '/chat' },
                                    { icon: '📚', label: 'Learn Something', href: '/learn' },
                                ].map(action => (
                                    <Link key={action.href} href={action.href}
                                        className="st-card p-4 flex items-center gap-3 hover:shadow-md transition-all"
                                    >
                                        <span className="text-xl">{action.icon}</span>
                                        <span className="text-sm font-medium text-slate-700">{action.label}</span>
                                    </Link>
                                ))}
                            </div>
                        </motion.section>

                        <p className="text-xs text-slate-400 text-center pt-4">
                            Consistency beats intensity. Show up every day. 💪
                        </p>
                    </div>
                </main>
                <BottomNav />
            </div>
        </div>
    );
}
