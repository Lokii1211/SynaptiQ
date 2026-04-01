'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { api, auth } from '@/lib/api';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import Link from 'next/link';

type AdminTab = 'overview' | 'users' | 'content' | 'analytics' | 'system';

export default function AdminPage() {
    const [isAdmin, setIsAdmin] = useState(false);
    const [tab, setTab] = useState<AdminTab>('overview');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const user = auth.getUser();
        if (!user?.is_admin) { window.location.href = '/dashboard'; return; }
        setIsAdmin(true);
    }, []);

    if (!isAdmin) return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
            <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    // TODO: Fetch from /api/admin/stats
    const overviewStats: { label: string; value: string; change: string; icon: string; color: string }[] = [];

    // TODO: Fetch from /api/admin/users
    const recentUsers: { name: string; email: string; college: string; score: number; joined: string; status: string }[] = [];

    // TODO: Fetch from /api/admin/system-health
    const systemHealth: { label: string; value: string; status: string }[] = [];

    // TODO: Fetch from /api/admin/content-stats
    const contentStats: { label: string; value: number; active: number }[] = [];

    const TABS: { key: AdminTab; label: string; icon: string }[] = [
        { key: 'overview', label: 'Overview', icon: '📊' },
        { key: 'users', label: 'Users', icon: '👤' },
        { key: 'content', label: 'Content', icon: '📝' },
        { key: 'analytics', label: 'Analytics', icon: '📈' },
        { key: 'system', label: 'System', icon: '⚙️' },
    ];

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            {/* Top Bar */}
            <div className="bg-slate-900 border-b border-slate-800 px-6 py-3 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-lg flex items-center justify-center text-white font-bold text-xs">M</div>
                    <span className="font-bold text-lg">Mentixy <span className="text-indigo-400">Admin</span></span>
                    <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full font-semibold">ADMIN PANEL</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                            placeholder="Search users, content..."
                            className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-1.5 text-sm text-white placeholder:text-slate-500 w-64 focus:outline-none focus:border-indigo-500 transition-colors" />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">⌘K</span>
                    </div>
                    <Link href="/dashboard" className="text-sm text-slate-400 hover:text-white transition-colors bg-slate-800 px-3 py-1.5 rounded-lg">
                        ← Back to App
                    </Link>
                </div>
            </div>

            <div className="flex">
                {/* Sidebar */}
                <div className="w-56 bg-slate-900 border-r border-slate-800 min-h-[calc(100vh-52px)] p-4 hidden md:block">
                    <nav className="space-y-1">
                        {TABS.map(t => (
                            <button key={t.key} onClick={() => setTab(t.key)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${tab === t.key
                                    ? 'bg-indigo-500/20 text-indigo-400'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                    }`}>
                                <span>{t.icon}</span>
                                {t.label}
                            </button>
                        ))}
                    </nav>

                    <div className="mt-8 p-3 bg-slate-800 rounded-xl">
                        <p className="text-[10px] text-slate-500 uppercase font-semibold mb-2">Quick Actions</p>
                        <div className="space-y-1">
                            {[
                                { label: 'Add Job Opening', icon: '➕' },
                                { label: 'Send Broadcast', icon: '📢' },
                                { label: 'Export Data', icon: '📥' },
                                { label: 'View Logs', icon: '📋' },
                            ].map(a => (
                                <button key={a.label} className="w-full text-left text-xs text-slate-400 hover:text-white py-1.5 px-2 rounded-lg hover:bg-slate-700 transition-all flex items-center gap-2">
                                    <span>{a.icon}</span> {a.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-6 max-w-6xl">
                    {/* Mobile tabs */}
                    <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar md:hidden">
                        {TABS.map(t => (
                            <button key={t.key} onClick={() => setTab(t.key)}
                                className={`shrink-0 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${tab === t.key
                                    ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400'
                                    }`}>{t.icon} {t.label}</button>
                        ))}
                    </div>

                    {/* OVERVIEW TAB */}
                    {tab === 'overview' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                            <div>
                                <h1 className="text-2xl font-bold mb-1">Dashboard Overview</h1>
                                <p className="text-slate-500 text-sm">Real-time platform metrics</p>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {overviewStats.map((s, i) => (
                                    <motion.div key={s.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.06 }}
                                        className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-colors">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-lg">{s.icon}</span>
                                            <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${s.color}`} />
                                        </div>
                                        <p className="text-2xl font-bold">{s.value}</p>
                                        <p className="text-[10px] text-slate-500 uppercase font-semibold mt-0.5">{s.label}</p>
                                        <p className="text-[10px] text-emerald-400 mt-1">{s.change}</p>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Recent Activity */}
                            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                                <h2 className="font-bold mb-3">📋 Recent Registrations</h2>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="text-slate-500 text-[10px] uppercase border-b border-slate-800">
                                                <th className="text-left pb-2 font-semibold">User</th>
                                                <th className="text-left pb-2 font-semibold">College</th>
                                                <th className="text-left pb-2 font-semibold">Score</th>
                                                <th className="text-left pb-2 font-semibold">Joined</th>
                                                <th className="text-left pb-2 font-semibold">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {recentUsers.slice(0, 5).map((u, i) => (
                                                <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                                                    <td className="py-2.5">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-7 h-7 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400 text-xs font-bold">{u.name[0]}</div>
                                                            <div>
                                                                <p className="font-medium text-xs">{u.name}</p>
                                                                <p className="text-[10px] text-slate-500">{u.email}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="text-xs text-slate-400">{u.college}</td>
                                                    <td className="text-xs font-bold text-indigo-400">{u.score}</td>
                                                    <td className="text-xs text-slate-500">{u.joined}</td>
                                                    <td>
                                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${u.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'}`}>
                                                            {u.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Engagement funnel */}
                            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                                <h2 className="font-bold mb-4">📊 Engagement Funnel</h2>
                                <div className="text-center py-8">
                                    <p className="text-slate-500 text-sm">Engagement data will populate when connected to analytics API</p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* USERS TAB */}
                    {tab === 'users' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-2xl font-bold">User Management</h1>
                                    <p className="text-slate-500 text-sm">{recentUsers.length} users total</p>
                                </div>
                                <button className="bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-600 transition-colors">
                                    + Invite User
                                </button>
                            </div>
                            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="text-slate-500 text-[10px] uppercase bg-slate-800/50">
                                            <th className="text-left p-3 font-semibold">User</th>
                                            <th className="text-left p-3 font-semibold">College</th>
                                            <th className="text-left p-3 font-semibold">Score</th>
                                            <th className="text-left p-3 font-semibold">Joined</th>
                                            <th className="text-left p-3 font-semibold">Status</th>
                                            <th className="text-left p-3 font-semibold">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentUsers.map((u, i) => (
                                            <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                                                <td className="p-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400 text-xs font-bold">{u.name[0]}</div>
                                                        <div>
                                                            <p className="font-medium text-xs">{u.name}</p>
                                                            <p className="text-[10px] text-slate-500">{u.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="text-xs text-slate-400 p-3">{u.college}</td>
                                                <td className="text-xs font-bold text-indigo-400 p-3">{u.score}</td>
                                                <td className="text-xs text-slate-500 p-3">{u.joined}</td>
                                                <td className="p-3">
                                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${u.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'}`}>
                                                        {u.status}
                                                    </span>
                                                </td>
                                                <td className="p-3">
                                                    <button className="text-xs text-indigo-400 hover:text-indigo-300">View</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    )}

                    {/* CONTENT TAB */}
                    {tab === 'content' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                            <h1 className="text-2xl font-bold">Content Management</h1>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {contentStats.map(c => (
                                    <div key={c.label} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                                        <p className="text-2xl font-bold">{c.value}</p>
                                        <p className="text-[10px] text-slate-500 uppercase font-semibold">{c.label}</p>
                                        <p className="text-[10px] text-emerald-400 mt-1">{c.active} active</p>
                                    </div>
                                ))}
                            </div>
                            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                                <h2 className="font-bold mb-3">Quick Content Actions</h2>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                    {[
                                        { label: 'Add Job Opening', icon: '💼' },
                                        { label: 'Add Coding Problem', icon: '💻' },
                                        { label: 'Add Career Path', icon: '🗺️' },
                                        { label: 'Add Course', icon: '📚' },
                                        { label: 'Edit Community Rules', icon: '📋' },
                                        { label: 'Update Skill Market', icon: '📊' },
                                        { label: 'Manage Badges', icon: '🏅' },
                                        { label: 'Export Content', icon: '📥' },
                                    ].map(a => (
                                        <button key={a.label} className="bg-slate-800 hover:bg-slate-700 rounded-xl p-3 text-left transition-colors">
                                            <span className="text-lg block mb-1">{a.icon}</span>
                                            <p className="text-xs font-medium">{a.label}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* ANALYTICS TAB */}
                    {tab === 'analytics' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                            <h1 className="text-2xl font-bold">Platform Analytics</h1>
                            <div className="grid md:grid-cols-2 gap-4">
                                {/* Feature Usage */}
                                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                                    <h2 className="font-bold mb-4">Feature Usage (7 days)</h2>
                                    <div className="text-center py-8">
                                        <p className="text-slate-500 text-sm">Feature usage data will populate from analytics API</p>
                                    </div>
                                </div>

                                {/* College Distribution */}
                                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                                    <h2 className="font-bold mb-4">Top Colleges</h2>
                                    <div className="text-center py-8">
                                        <p className="text-slate-500 text-sm">College distribution will populate from user data</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* SYSTEM TAB */}
                    {tab === 'system' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                            <h1 className="text-2xl font-bold">System Health</h1>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {systemHealth.map(s => (
                                    <div key={s.label} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={`w-2 h-2 rounded-full ${s.status === 'green' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                                            <span className="text-[10px] text-slate-500 uppercase font-semibold">{s.label}</span>
                                        </div>
                                        <p className="text-xl font-bold">{s.value}</p>
                                    </div>
                                ))}
                            </div>

                            {/* DB Schema */}
                            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                                <h2 className="font-bold mb-3">Database Schema</h2>
                                <div className="grid grid-cols-3 md:grid-cols-7 gap-2">
                                    {['users', 'assessments', 'profiles_4d', 'career_matches', 'roadmaps', 'placements', 'behavior_events',
                                        'openings', 'chat_sessions', 'community', 'comments', 'quiz_history', 'scores', 'skill_market',
                                        'achievements', 'streak_freezes', 'referrals', 'notifications', 'connections', 'mock_interviews', 'submissions'
                                    ].map(t => (
                                        <div key={t} className="bg-slate-800 rounded-lg px-2 py-1.5 text-center">
                                            <p className="text-[9px] text-slate-400 font-mono">{t}</p>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-[10px] text-slate-500 mt-3">21 tables · 40+ indexes · RLS enabled on all</p>
                            </div>

                            {/* API Routes */}
                            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                                <h2 className="font-bold mb-3">API Routes ({27} endpoints)</h2>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                                    {['/auth', '/profile', '/assessment', '/careers', '/practice', '/chat', '/ai/roadmap',
                                        '/ai/reroute', '/ai/parent-report', '/ai/salary-truth', '/ai/negotiate', '/ai/career-day',
                                        '/ai/wellbeing', '/jobs', '/internships', '/community', '/skills', '/leaderboard',
                                        '/notifications', '/admin', '/resume', '/mock-drive', '/achievements', '/tracker',
                                        '/referral', '/learning', '/verify'
                                    ].map(r => (
                                        <div key={r} className="bg-slate-800 rounded-lg px-3 py-1.5 font-mono text-slate-400">
                                            {r}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
