'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';
import { auth } from '@/lib/api';
import Link from 'next/link';

/* ═══ Creator Analytics Data ═══ */
const ANALYTICS = {
    totalImpressions: 12847,
    uniqueReach: 8923,
    engagementRate: 6.8,
    followers: 342,
    followerGrowthWeek: 23,
    followerGrowthMonth: 89,
    posts30Days: 14,
    bestDay: 'Wednesday',
    bestTime: '10:00 AM - 12:00 PM',
    audienceBreakdown: {
        colleges: [
            { name: 'VIT Vellore', pct: 18 }, { name: 'SRM Chennai', pct: 12 },
            { name: 'BITS Pilani', pct: 8 }, { name: 'NIT Trichy', pct: 7 }, { name: 'Others', pct: 55 },
        ],
        careerTargets: [
            { name: 'Software Dev', pct: 42 }, { name: 'Data Analyst', pct: 23 },
            { name: 'ML Engineer', pct: 15 }, { name: 'Full Stack', pct: 12 }, { name: 'Others', pct: 8 },
        ],
        branches: [
            { name: 'CSE/IT', pct: 68 }, { name: 'ECE', pct: 14 },
            { name: 'EEE', pct: 8 }, { name: 'Mechanical', pct: 5 }, { name: 'Others', pct: 5 },
        ],
    },
    topPosts: [
        { title: 'How I Cracked TCS NQT in 2 Weeks', type: 'text', impressions: 3421, engagement: 8.2, reactions: 234, comments: 45, date: 'Feb 20' },
        { title: 'My LinkedIn-style profile guide for freshers', type: 'text', impressions: 2187, engagement: 7.1, reactions: 156, comments: 32, date: 'Feb 15' },
        { title: 'Two Sum — HashMap approach in 5 min', type: 'code', impressions: 1892, engagement: 9.4, reactions: 178, comments: 28, date: 'Feb 18' },
        { title: 'Poll: Which company is your dream?', type: 'poll', impressions: 1654, engagement: 12.3, reactions: 89, comments: 67, date: 'Feb 22' },
    ],
    contentTypePerformance: [
        { type: 'Code Posts', avgEngagement: 9.2, count: 5, icon: '💻' },
        { type: 'Text Posts', avgEngagement: 6.8, count: 6, icon: '📝' },
        { type: 'Placement Cards', avgEngagement: 11.4, count: 1, icon: '🏆' },
        { type: 'Polls', avgEngagement: 12.3, count: 2, icon: '📊' },
    ],
};

const STUDY_SERIES = [
    { title: '30-Day SQL Journey', episodes: 18, totalEpisodes: 30, subscribers: 234, status: 'active', icon: '🗃️' },
    { title: 'DSA for Placement — Daily', episodes: 45, totalEpisodes: 90, subscribers: 567, status: 'active', icon: '⚡' },
    { title: 'Python Tricks Weekly', episodes: 8, totalEpisodes: 0, subscribers: 123, status: 'active', icon: '🐍' },
];

export default function CreatorPage() {
    const [tab, setTab] = useState<'overview' | 'analytics' | 'series' | 'mentor'>('overview');
    const [period, setPeriod] = useState<'7d' | '30d' | '90d' | '365d'>('30d');

    useEffect(() => { if (!auth.isLoggedIn()) window.location.href = '/login'; }, []);

    return (
        <div className="min-h-screen bg-slate-50">
            <TopBar />
            <main className="max-w-5xl mx-auto px-4 md:px-6 py-6 pb-24 md:pb-8">
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
                    <div className="flex items-center gap-2 mb-1">
                        <h1 className="text-2xl font-bold text-slate-900 st-font-heading">✨ Creator Studio</h1>
                        <span className="text-[9px] bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-2 py-0.5 rounded-full font-bold">MENTOR MODE</span>
                    </div>
                    <p className="text-sm text-slate-500">Your content analytics, study series, and mentor tools — all free</p>
                </motion.div>

                {/* Tabs */}
                <div className="flex gap-1 mb-5 bg-white rounded-xl p-1 border border-slate-200 overflow-x-auto">
                    {([
                        { id: 'overview', label: '📊 Overview' },
                        { id: 'analytics', label: '📈 Deep Analytics' },
                        { id: 'series', label: '📚 Study Series' },
                        { id: 'mentor', label: '🎓 Mentor Profile' },
                    ] as const).map(t => (
                        <button key={t.id} onClick={() => setTab(t.id)}
                            className={`flex-shrink-0 flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${tab === t.id ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-900'}`}>
                            {t.label}
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {/* ═══ Overview ═══ */}
                    {tab === 'overview' && (
                        <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                            {/* Free Badge */}
                            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-3 border border-emerald-100">
                                <p className="text-xs text-emerald-700 font-medium">💚 Content analytics are <strong>FREE</strong> on SkillTen — not paywalled like LinkedIn Premium</p>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {[
                                    { label: 'Total Impressions', value: ANALYTICS.totalImpressions.toLocaleString(), change: '+34%', icon: '👁️' },
                                    { label: 'Followers', value: ANALYTICS.followers, change: `+${ANALYTICS.followerGrowthWeek} this week`, icon: '👥' },
                                    { label: 'Engagement Rate', value: `${ANALYTICS.engagementRate}%`, change: 'Above average', icon: '🔥' },
                                    { label: 'Posts (30 days)', value: ANALYTICS.posts30Days, change: 'Consistent ✓', icon: '📝' },
                                ].map((stat, i) => (
                                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="st-card p-4">
                                        <span className="text-xl">{stat.icon}</span>
                                        <p className="text-xl font-bold text-slate-900 mt-2">{stat.value}</p>
                                        <p className="text-[10px] text-slate-400 mt-0.5">{stat.label}</p>
                                        <p className="text-[9px] text-emerald-600 font-medium mt-1">{stat.change}</p>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Top Posts */}
                            <div className="st-card p-5">
                                <h3 className="text-sm font-bold text-slate-900 mb-3">🏆 Best Performing Posts</h3>
                                <div className="space-y-2">
                                    {ANALYTICS.topPosts.map((post, i) => (
                                        <div key={i} className="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0">
                                            <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${post.type === 'code' ? 'bg-emerald-50' : post.type === 'poll' ? 'bg-violet-50' : 'bg-indigo-50'
                                                }`}>{post.type === 'code' ? '💻' : post.type === 'poll' ? '📊' : '📝'}</span>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-medium text-slate-900 truncate">{post.title}</p>
                                                <p className="text-[9px] text-slate-400">{post.date} · {post.impressions.toLocaleString()} impressions</p>
                                            </div>
                                            <div className="text-right flex-shrink-0">
                                                <p className="text-xs font-bold text-indigo-600">{post.engagement}%</p>
                                                <p className="text-[8px] text-slate-400">engagement</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Best Day/Time */}
                            <div className="grid md:grid-cols-2 gap-3">
                                <div className="st-card p-4">
                                    <p className="text-xs font-bold text-slate-600 mb-1">📅 Best Day to Post</p>
                                    <p className="text-lg font-bold text-slate-900">{ANALYTICS.bestDay}</p>
                                    <p className="text-[10px] text-slate-400">Based on your audience activity</p>
                                </div>
                                <div className="st-card p-4">
                                    <p className="text-xs font-bold text-slate-600 mb-1">⏰ Best Time to Post</p>
                                    <p className="text-lg font-bold text-slate-900">{ANALYTICS.bestTime}</p>
                                    <p className="text-[10px] text-slate-400">When your followers are most active</p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* ═══ Deep Analytics ═══ */}
                    {tab === 'analytics' && (
                        <motion.div key="analytics" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                            {/* Period Selector */}
                            <div className="flex gap-2">
                                {(['7d', '30d', '90d', '365d'] as const).map(p => (
                                    <button key={p} onClick={() => setPeriod(p)}
                                        className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${period === p ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                        {p === '7d' ? '7 Days' : p === '30d' ? '30 Days' : p === '90d' ? '90 Days' : '1 Year'}
                                    </button>
                                ))}
                            </div>

                            {/* Follower Growth Chart */}
                            <div className="st-card p-5">
                                <h3 className="text-sm font-bold text-slate-900 mb-3">📈 Follower Growth</h3>
                                <div className="flex items-end gap-1 h-28">
                                    {[245, 252, 261, 269, 278, 285, 293, 301, 308, 315, 324, 342].map((val, i) => (
                                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                            <div className="w-full bg-gradient-to-t from-indigo-500 to-violet-400 rounded-t"
                                                style={{ height: `${((val - 240) / 110) * 100}%` }} />
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-between mt-2 text-[8px] text-slate-400">
                                    <span>Feb 1</span><span>Today</span>
                                </div>
                            </div>

                            {/* Content Type Performance */}
                            <div className="st-card p-5">
                                <h3 className="text-sm font-bold text-slate-900 mb-3">📊 Content Type Performance</h3>
                                <div className="space-y-3">
                                    {ANALYTICS.contentTypePerformance.map((ct, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <span className="text-lg">{ct.icon}</span>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-xs font-medium text-slate-900">{ct.type}</span>
                                                    <span className="text-xs font-bold text-indigo-600">{ct.avgEngagement}% avg</span>
                                                </div>
                                                <div className="w-full bg-slate-100 rounded-full h-2">
                                                    <div className="bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full h-2"
                                                        style={{ width: `${(ct.avgEngagement / 15) * 100}%` }} />
                                                </div>
                                            </div>
                                            <span className="text-[10px] text-slate-400 w-12 text-right">{ct.count} posts</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Audience Demographics */}
                            <div className="grid md:grid-cols-3 gap-3">
                                {[
                                    { title: '🎓 Top Colleges', data: ANALYTICS.audienceBreakdown.colleges },
                                    { title: '🎯 Career Targets', data: ANALYTICS.audienceBreakdown.careerTargets },
                                    { title: '📐 Branches', data: ANALYTICS.audienceBreakdown.branches },
                                ].map((section, si) => (
                                    <div key={si} className="st-card p-4">
                                        <h4 className="text-xs font-bold text-slate-900 mb-2">{section.title}</h4>
                                        <div className="space-y-1.5">
                                            {section.data.map((item, i) => (
                                                <div key={i} className="flex items-center gap-2">
                                                    <div className="flex-1 bg-slate-100 rounded-full h-1.5">
                                                        <div className="bg-indigo-400 rounded-full h-1.5" style={{ width: `${item.pct}%` }} />
                                                    </div>
                                                    <span className="text-[9px] text-slate-500 w-20 truncate">{item.name}</span>
                                                    <span className="text-[9px] text-slate-400 font-mono w-8 text-right">{item.pct}%</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
                                <p className="text-xs text-indigo-700 font-medium">💡 Insight: Your audience is <strong>68% CSE students targeting Software Dev roles</strong>. Code posts and placement cards perform best with this audience.</p>
                            </div>
                        </motion.div>
                    )}

                    {/* ═══ Study Series ═══ */}
                    {tab === 'series' && (
                        <motion.div key="series" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                            <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl p-4 border border-violet-100 mb-5">
                                <p className="text-xs font-bold text-violet-800">📚 Study Series</p>
                                <p className="text-[11px] text-violet-600 mt-1">Create structured content series — like Medium publications. Subscribers get notified for each new episode. Shows on your profile as curated content.</p>
                            </div>

                            <div className="space-y-3 mb-5">
                                {STUDY_SERIES.map((series, i) => (
                                    <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="st-card p-5 hover:shadow-lg transition-all">
                                        <div className="flex items-start gap-4">
                                            <span className="text-3xl">{series.icon}</span>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="text-sm font-bold text-slate-900">{series.title}</h3>
                                                    <span className="text-[8px] bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded-full font-bold uppercase">{series.status}</span>
                                                </div>
                                                <div className="flex items-center gap-3 text-[10px] text-slate-400 mb-2">
                                                    <span>📖 {series.episodes} episodes{series.totalEpisodes > 0 ? ` / ${series.totalEpisodes}` : ''}</span>
                                                    <span>👥 {series.subscribers} subscribers</span>
                                                </div>
                                                {series.totalEpisodes > 0 && (
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex-1 bg-slate-100 rounded-full h-1.5">
                                                            <div className="bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full h-1.5"
                                                                style={{ width: `${(series.episodes / series.totalEpisodes) * 100}%` }} />
                                                        </div>
                                                        <span className="text-[9px] text-slate-400">{Math.round((series.episodes / series.totalEpisodes) * 100)}%</span>
                                                    </div>
                                                )}
                                            </div>
                                            <button className="px-3 py-2 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl hover:bg-indigo-200 flex-shrink-0">
                                                + Add Episode
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <button className="w-full st-card p-4 text-center text-sm text-indigo-600 font-bold hover:bg-indigo-50 transition-colors">
                                ➕ Create New Study Series
                            </button>
                        </motion.div>
                    )}

                    {/* ═══ Mentor Profile ═══ */}
                    {tab === 'mentor' && (
                        <motion.div key="mentor" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                            <div className="st-card p-6">
                                <div className="flex items-center gap-4 mb-5">
                                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center text-2xl text-white font-bold">
                                        A
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h2 className="text-lg font-bold text-slate-900">Arjun Kumar</h2>
                                            <span className="text-[9px] bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-2 py-0.5 rounded-full font-bold">⚡ MENTOR</span>
                                        </div>
                                        <p className="text-xs text-slate-500">SDE @ Amazon · SkillTen Score: 89</p>
                                        <p className="text-xs text-slate-400">342 followers · 67 connections</p>
                                    </div>
                                </div>

                                {/* Talks About */}
                                <div className="mb-5">
                                    <h3 className="text-xs font-bold text-slate-600 mb-2">💬 Talks About</h3>
                                    <div className="flex flex-wrap gap-1.5">
                                        {['DSA', 'System Design', 'Placement Tips', 'Python', 'Career Growth'].map(topic => (
                                            <span key={topic} className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full font-medium">{topic}</span>
                                        ))}
                                    </div>
                                </div>

                                {/* Mentor Features */}
                                <div className="grid grid-cols-2 gap-3">
                                    <button className="py-3 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-colors">
                                        ❓ Ask Me Anything
                                    </button>
                                    <button className="py-3 bg-violet-100 text-violet-700 text-sm font-bold rounded-xl hover:bg-violet-200 transition-colors">
                                        📅 Book Mock Interview
                                    </button>
                                </div>
                            </div>

                            {/* Mentor Stats */}
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { label: 'Questions Answered', value: '234', icon: '💬' },
                                    { label: 'Students Helped', value: '89', icon: '🎓' },
                                    { label: 'Avg Response Time', value: '4h', icon: '⏱️' },
                                ].map((stat, i) => (
                                    <div key={i} className="st-card p-3 text-center">
                                        <span className="text-xl">{stat.icon}</span>
                                        <p className="text-lg font-bold text-slate-900 mt-1">{stat.value}</p>
                                        <p className="text-[9px] text-slate-400">{stat.label}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Unlock Requirements */}
                            <div className="st-card p-5 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-100">
                                <h3 className="text-xs font-bold text-amber-800 mb-2">🏅 Mentor Mode Requirements</h3>
                                <div className="space-y-2">
                                    {[
                                        { req: '30+ connections', met: true },
                                        { req: 'Placed or senior status', met: true },
                                        { req: '10+ quality posts', met: true },
                                        { req: 'SkillTen Score ≥ 75', met: true },
                                    ].map((r, i) => (
                                        <div key={i} className="flex items-center gap-2 text-xs">
                                            <span>{r.met ? '✅' : '❌'}</span>
                                            <span className={r.met ? 'text-emerald-700' : 'text-slate-500'}>{r.req}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
            <BottomNav />
        </div>
    );
}
