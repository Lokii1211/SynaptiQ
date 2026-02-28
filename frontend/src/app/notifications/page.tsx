'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api, auth } from '@/lib/api';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';
import Link from 'next/link';

interface Notification {
    id: string;
    type: 'achievement' | 'streak' | 'job' | 'community' | 'system' | 'challenge';
    title: string;
    message: string;
    time: string;
    read: boolean;
    action_url?: string;
    icon: string;
}

const MOCK_NOTIFICATIONS: Notification[] = [
    { id: '1', type: 'streak', title: '🔥 Streak at Risk!', message: "You haven't logged in today. Complete any task to keep your 12-day streak alive!", time: '2 hours ago', read: false, action_url: '/tracker', icon: '🔥' },
    { id: '2', type: 'achievement', title: '🏅 Badge Unlocked!', message: 'You earned "Problem Crusher" — solve 10 coding problems. +75 XP!', time: '5 hours ago', read: false, action_url: '/achievements', icon: '🏅' },
    { id: '3', type: 'job', title: '💼 New Match: Flipkart', message: 'SDE-1 at Flipkart matches your profile (92% fit). ₹18-24 LPA. Apply before March 5.', time: '1 day ago', read: false, action_url: '/jobs', icon: '💼' },
    { id: '4', type: 'challenge', title: '🏆 Weekly Challenge Available', message: 'This week: Solve 5 Dynamic Programming problems. +200 XP bonus!', time: '1 day ago', read: true, action_url: '/challenges', icon: '🏆' },
    { id: '5', type: 'community', title: '🗣️ New Reply to Your Post', message: 'Sneha Roy replied to "How to prepare for TCS NQT?" in the Community Forum.', time: '2 days ago', read: true, action_url: '/community', icon: '🗣️' },
    { id: '6', type: 'system', title: '📊 Weekly Progress Report', message: 'You solved 12 problems, improved your Viya Score by 5 points, and maintained a 12-day streak. Great week!', time: '3 days ago', read: true, icon: '📊' },
    { id: '7', type: 'achievement', title: '⭐ Score Milestone', message: 'Your Viya Score™ crossed 50! You earned the "Rising Star" badge.', time: '4 days ago', read: true, action_url: '/score', icon: '⭐' },
    { id: '8', type: 'job', title: '🎯 Internship Alert', message: 'Google STEP Internship 2026 applications are now open. Recommended based on your coding score.', time: '5 days ago', read: true, action_url: '/internships', icon: '🎯' },
    { id: '9', type: 'streak', title: '🎉 30-Day Streak!', message: "Incredible! You've maintained a 30-day streak. You earned +200 XP and the Monthly Machine badge!", time: '1 week ago', read: true, action_url: '/tracker', icon: '🎉' },
    { id: '10', type: 'system', title: '🆕 New Feature: Mock Interview', message: 'Practice with our AI-powered Mock Interview Simulator. Choose from 10 companies and 4 interview types.', time: '1 week ago', read: true, action_url: '/simulator', icon: '🆕' },
];

const TYPE_COLORS: Record<string, { bg: string; border: string }> = {
    streak: { bg: 'bg-orange-50', border: 'border-l-orange-500' },
    achievement: { bg: 'bg-amber-50', border: 'border-l-amber-500' },
    job: { bg: 'bg-blue-50', border: 'border-l-blue-500' },
    community: { bg: 'bg-green-50', border: 'border-l-green-500' },
    challenge: { bg: 'bg-purple-50', border: 'border-l-purple-500' },
    system: { bg: 'bg-slate-50', border: 'border-l-slate-400' },
};

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>('all');

    useEffect(() => {
        if (!auth.isLoggedIn()) { window.location.href = '/login'; return; }
        // Try real API first, then fallback to mock
        api.getNotifications().then(data => {
            const real = data.notifications || [];
            setNotifications(real.length > 0 ? real : MOCK_NOTIFICATIONS);
            setLoading(false);
        }).catch(() => {
            setNotifications(MOCK_NOTIFICATIONS);
            setLoading(false);
        });
    }, []);

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        api.markAllRead().catch(() => { /* ignore */ });
    };

    const markRead = (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const clearAll = () => {
        setNotifications([]);
    };

    const filtered = filter === 'all'
        ? notifications
        : filter === 'unread'
            ? notifications.filter(n => !n.read)
            : notifications.filter(n => n.type === filter);

    const FILTERS = [
        { key: 'all', label: 'All', count: notifications.length },
        { key: 'unread', label: 'Unread', count: unreadCount },
        { key: 'streak', label: '🔥 Streaks', count: notifications.filter(n => n.type === 'streak').length },
        { key: 'achievement', label: '🏅 Badges', count: notifications.filter(n => n.type === 'achievement').length },
        { key: 'job', label: '💼 Jobs', count: notifications.filter(n => n.type === 'job').length },
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1 pb-24 md:pb-8">
                    {/* Header */}
                    <div className="bg-white border-b border-slate-200 px-6 py-6">
                        <div className="max-w-3xl mx-auto flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900 mb-1">🔔 Notifications</h1>
                                <p className="text-slate-500 text-sm">
                                    {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'} · {notifications.length} total
                                </p>
                            </div>
                            <div className="flex gap-2">
                                {unreadCount > 0 && (
                                    <button onClick={markAllRead}
                                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors">
                                        ✓ Mark all read
                                    </button>
                                )}
                                {notifications.length > 0 && (
                                    <button onClick={clearAll}
                                        className="text-xs font-semibold text-slate-500 hover:text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg transition-colors">
                                        🗑️ Clear
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white border-b border-slate-100 px-6 sticky top-0 z-20">
                        <div className="max-w-3xl mx-auto">
                            <div className="flex gap-1.5 py-2 overflow-x-auto no-scrollbar">
                                {FILTERS.map(f => (
                                    <button key={f.key} onClick={() => setFilter(f.key)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${filter === f.key
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                                            }`}>
                                        {f.label}
                                        {f.count > 0 && <span className={`text-[10px] px-1 py-0.5 rounded ${filter === f.key ? 'bg-white/20' : 'bg-slate-200'}`}>{f.count}</span>}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="px-4 md:px-6 py-4 max-w-3xl mx-auto space-y-2">
                        {loading ? (
                            [1, 2, 3, 4, 5].map(i => <div key={i} className="st-card p-4 animate-pulse h-20" />)
                        ) : filtered.length === 0 ? (
                            <div className="text-center py-16">
                                <span className="text-5xl block mb-4">{filter === 'unread' ? '✅' : '🔔'}</span>
                                <p className="text-slate-900 font-semibold mb-1">
                                    {filter === 'unread' ? 'All caught up!' : 'No notifications'}
                                </p>
                                <p className="text-slate-500 text-sm">
                                    {filter === 'unread' ? "You've read all your notifications" : 'Nothing here yet'}
                                </p>
                            </div>
                        ) : (
                            <AnimatePresence>
                                {filtered.map((n, i) => {
                                    const colors = TYPE_COLORS[n.type] || TYPE_COLORS.system;
                                    return (
                                        <motion.div key={n.id}
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, x: -50 }}
                                            transition={{ delay: i * 0.03 }}
                                        >
                                            {n.action_url ? (
                                                <Link href={n.action_url} onClick={() => markRead(n.id)}
                                                    className={`block st-card p-4 border-l-4 ${colors.border} hover:shadow-md transition-all ${!n.read ? colors.bg : ''}`}>
                                                    <div className="flex items-start gap-3">
                                                        <span className="text-xl mt-0.5">{n.icon}</span>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 mb-0.5">
                                                                <p className={`text-sm font-semibold ${!n.read ? 'text-slate-900' : 'text-slate-600'}`}>{n.title}</p>
                                                                {!n.read && <span className="w-2 h-2 bg-indigo-500 rounded-full shrink-0" />}
                                                            </div>
                                                            <p className="text-xs text-slate-500 leading-relaxed">{n.message}</p>
                                                            <p className="text-[10px] text-slate-400 mt-1.5">{n.time}</p>
                                                        </div>
                                                        <span className="text-slate-300 text-xs mt-1">→</span>
                                                    </div>
                                                </Link>
                                            ) : (
                                                <div className={`st-card p-4 border-l-4 ${colors.border} ${!n.read ? colors.bg : ''}`}
                                                    onClick={() => markRead(n.id)} role="button" tabIndex={0}>
                                                    <div className="flex items-start gap-3">
                                                        <span className="text-xl mt-0.5">{n.icon}</span>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 mb-0.5">
                                                                <p className={`text-sm font-semibold ${!n.read ? 'text-slate-900' : 'text-slate-600'}`}>{n.title}</p>
                                                                {!n.read && <span className="w-2 h-2 bg-indigo-500 rounded-full shrink-0" />}
                                                            </div>
                                                            <p className="text-xs text-slate-500 leading-relaxed">{n.message}</p>
                                                            <p className="text-[10px] text-slate-400 mt-1.5">{n.time}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        )}

                        {/* Notification Preferences CTA */}
                        {notifications.length > 0 && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                                className="mt-6 text-center">
                                <Link href="/notifications/settings" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">
                                    ⚙️ Manage notification intelligence rules
                                </Link>
                            </motion.div>
                        )}
                    </div>
                </main>
                <BottomNav />
            </div>
        </div>
    );
}
