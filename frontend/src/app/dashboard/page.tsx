'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { api, auth } from '@/lib/api';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';
import { SideNav } from '@/components/layout/SideNav';

export default function DashboardPage() {
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [trending, setTrending] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!auth.isLoggedIn()) { window.location.href = '/login'; return; }
        Promise.all([
            api.getMe().catch(() => null),
            api.getAssessmentProfile().catch(() => null),
            api.getTrendingSkills().catch(() => ({ skills: [] })),
        ]).then(([u, p, t]) => {
            if (!u) { auth.clearToken(); window.location.href = '/login'; return; }
            setUser(u);
            setProfile(p);
            setTrending(t?.skills || []);
            auth.setUser(u);
            setLoading(false);
        });
    }, []);

    if (loading) return (
        <div className="flex min-h-screen bg-slate-50">
            <SideNav />
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1 pb-24 md:pb-8">
                    {/* Skeleton hero */}
                    <div className="bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 px-6 py-8">
                        <div className="st-skeleton h-4 w-24 mb-3 opacity-30" />
                        <div className="st-skeleton h-8 w-48 mb-5 opacity-30" />
                        <div className="flex gap-4">
                            <div className="bg-white/15 rounded-xl px-5 py-3 flex-1">
                                <div className="st-skeleton h-3 w-16 mb-2 opacity-30" />
                                <div className="st-skeleton h-6 w-12 opacity-30" />
                            </div>
                            <div className="bg-white/15 rounded-xl px-5 py-3 flex-1">
                                <div className="st-skeleton h-3 w-16 mb-2 opacity-30" />
                                <div className="st-skeleton h-6 w-12 opacity-30" />
                            </div>
                        </div>
                    </div>
                    {/* Skeleton cards */}
                    <div className="px-4 md:px-6 py-6 max-w-4xl mx-auto space-y-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {[1, 2, 3, 4].map(i => <div key={i} className="st-skeleton h-28 rounded-2xl" />)}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {[1, 2, 3, 4].map(i => <div key={i} className="st-skeleton h-28 rounded-2xl" />)}
                        </div>
                    </div>
                </main>
                <BottomNav />
            </div>
        </div>
    );

    const displayName = user?.profile?.display_name || user?.display_name || user?.email?.split('@')[0] || 'User';
    const score = user?.profile?.skillten_score || 0;
    const streak = user?.profile?.streak_days || 0;
    const hasProfile = profile?.has_profile;
    const archetype = user?.profile?.archetype_name || profile?.archetype_name;

    const primaryTools = [
        { icon: '🧬', title: '4D Assessment', desc: hasProfile ? 'View results' : 'Deep career profiling', href: '/assessment', color: 'from-indigo-500 to-violet-600', badge: !hasProfile ? 'START' : '' },
        { icon: '💻', title: 'Coding Arena', desc: 'Practice DSA problems', href: '/practice', color: 'from-emerald-500 to-teal-600' },
        { icon: '📚', title: 'Learning Hub', desc: 'AI-powered roadmaps', href: '/learn', color: 'from-cyan-500 to-blue-600' },
        { icon: '🎯', title: 'Skill Analyzer', desc: 'Find your gaps', href: '/skills', color: 'from-amber-500 to-orange-500' },
    ];

    const jobTools = [
        { icon: '💼', title: 'Jobs Board', desc: 'Fresh openings daily', href: '/jobs', color: 'from-rose-500 to-pink-600', badge: 'HOT' },
        { icon: '🎯', title: 'Internships', desc: 'Curated with PPO rates', href: '/internships', color: 'from-green-500 to-emerald-600' },
        { icon: '📄', title: 'AI Resume', desc: 'ATS-ready templates', href: '/resume', color: 'from-violet-500 to-purple-600' },
        { icon: '🏢', title: 'Company Intel', desc: 'Honest salary data', href: '/company-intel', color: 'from-sky-500 to-blue-600' },
    ];

    const quickActions = [
        { icon: '📅', label: 'Daily Quests', href: '/daily' },
        { icon: '🏆', label: 'Leaderboard', href: '/leaderboard' },
        { icon: '🔥', label: 'Streak', href: '/tracker' },
        { icon: '📊', label: 'Analytics', href: '/analytics' },
        { icon: '💬', label: 'AI Chat', href: '/chat' },
        { icon: '🎭', label: 'Mock Interview', href: '/simulator' },
        { icon: '🧮', label: 'Aptitude', href: '/aptitude' },
        { icon: '⚔️', label: 'Campus Wars', href: '/campus' },
    ];

    const moreTools = [
        { icon: '🏆', title: 'Challenges', href: '/challenges' },
        { icon: '🤝', title: 'Network', href: '/network' },
        { icon: '📊', title: 'Skill Market', href: '/skill-market' },
        { icon: '⚔️', title: 'Campus Wars', href: '/campus' },
        { icon: '💰', title: 'Negotiate', href: '/negotiate' },
        { icon: '📚', title: 'Courses', href: '/courses' },
        { icon: '🎓', title: 'College ROI', href: '/college-roi' },
        { icon: '📅', title: 'First 90 Days', href: '/first-90-days' },
        { icon: '👥', title: 'Similar Peers', href: '/people-like-you' },
        { icon: '🗺️', title: 'Careers', href: '/careers' },
        { icon: '📈', title: 'Score', href: '/score' },
        { icon: '🔔', title: 'Notifications', href: '/notifications' },
        { icon: '🧮', title: 'Aptitude', href: '/aptitude' },
        { icon: '👨‍👩‍👧', title: 'For Parents', href: '/parent' },
        { icon: '⚙️', title: 'Settings', href: '/settings' },
    ];

    return (
        <div className="flex min-h-screen bg-slate-50">
            <SideNav />
            <div className="flex-1 flex flex-col min-h-screen">
                <TopBar />

                <main className="flex-1 pb-24 md:pb-8 overflow-y-auto">
                    {/* Hero greeting */}
                    <div className="bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 px-6 py-8 text-white relative overflow-hidden">
                        {/* Decorative circles */}
                        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/4" />

                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative z-10">
                            <p className="text-white/70 text-sm mb-1">
                                {new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 17 ? 'Good afternoon' : 'Good evening'}
                            </p>
                            <h1 className="text-2xl font-bold mb-1">{displayName} 👋</h1>
                            {archetype && (
                                <p className="text-white/50 text-xs mb-4">🧬 {archetype}</p>
                            )}

                            {/* Score + Streak */}
                            <div className="flex gap-3">
                                <Link href="/score" className="bg-white/15 backdrop-blur-sm rounded-xl px-5 py-3 flex-1 hover:bg-white/20 transition-colors group">
                                    <p className="text-xs text-white/60 mb-0.5">SkillTen Score</p>
                                    <p className="text-2xl font-bold tabular-nums group-hover:scale-105 transition-transform inline-block">{score}</p>
                                </Link>
                                <Link href="/tracker" className="bg-white/15 backdrop-blur-sm rounded-xl px-5 py-3 flex-1 hover:bg-white/20 transition-colors group">
                                    <p className="text-xs text-white/60 mb-0.5">Streak</p>
                                    <p className="text-2xl font-bold group-hover:scale-105 transition-transform inline-block">{streak} 🔥</p>
                                </Link>
                            </div>

                            {/* CTA if no assessment */}
                            {!hasProfile && (
                                <Link href="/assessment" className="mt-4 block bg-white text-indigo-700 px-6 py-3 rounded-xl font-semibold text-center hover:bg-white/90 transition-all hover:shadow-lg active:scale-[0.98]">
                                    🧬 Take Your Career Assessment →
                                </Link>
                            )}
                        </motion.div>
                    </div>

                    <div className="px-4 md:px-6 py-6 max-w-4xl mx-auto w-full space-y-8">

                        {/* Quick actions (horizontal scroll) */}
                        <section>
                            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                                {quickActions.map((a, i) => (
                                    <motion.div key={a.href}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                    >
                                        <Link href={a.href} className="shrink-0 flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:border-indigo-300 hover:text-indigo-600 hover:shadow-sm transition-all whitespace-nowrap">
                                            <span>{a.icon}</span>{a.label}
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        </section>

                        {/* Primary tools */}
                        <section>
                            <h2 className="st-section-title mb-4">Career Tools</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {primaryTools.map((tool, i) => (
                                    <motion.div key={tool.href}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 + i * 0.08 }}
                                    >
                                        <Link href={tool.href} className="block st-card p-4 hover:shadow-lg group relative overflow-hidden h-full">
                                            {tool.badge && (
                                                <span className="absolute top-2 right-2 text-[10px] font-bold px-1.5 py-0.5 bg-indigo-100 text-indigo-700 rounded-md st-pulse-glow">
                                                    {tool.badge}
                                                </span>
                                            )}
                                            <div className={`w-10 h-10 bg-gradient-to-br ${tool.color} rounded-xl flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform`}>
                                                {tool.icon}
                                            </div>
                                            <p className="font-semibold text-sm text-slate-900 mb-0.5">{tool.title}</p>
                                            <p className="text-xs text-slate-500">{tool.desc}</p>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        </section>

                        {/* Job tools */}
                        <section>
                            <h2 className="st-section-title mb-4">Opportunities</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {jobTools.map((tool, i) => (
                                    <motion.div key={tool.href}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 + i * 0.08 }}
                                    >
                                        <Link href={tool.href} className="block st-card p-4 hover:shadow-lg group relative overflow-hidden h-full">
                                            {tool.badge && (
                                                <span className="absolute top-2 right-2 text-[10px] font-bold px-1.5 py-0.5 bg-rose-100 text-rose-700 rounded-md">
                                                    {tool.badge}
                                                </span>
                                            )}
                                            <div className={`w-10 h-10 bg-gradient-to-br ${tool.color} rounded-xl flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform`}>
                                                {tool.icon}
                                            </div>
                                            <p className="font-semibold text-sm text-slate-900 mb-0.5">{tool.title}</p>
                                            <p className="text-xs text-slate-500">{tool.desc}</p>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        </section>

                        {/* Trending skills marquee */}
                        {trending.length > 0 && (
                            <section>
                                <h2 className="st-section-title mb-4">🔥 Trending Skills</h2>
                                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                                    {trending.map((skill: any, i: number) => (
                                        <Link key={i} href={`/skills?career=${encodeURIComponent(skill.name || skill)}`}
                                            className="shrink-0 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:border-indigo-300 hover:text-indigo-600 transition-all hover:shadow-sm">
                                            {skill.name || skill}
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* More tools grid */}
                        <section>
                            <h2 className="st-section-title mb-4">Explore Everything</h2>
                            <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                                {moreTools.map((tool) => (
                                    <Link key={tool.href} href={tool.href} className="st-card p-3 text-center hover:shadow-md group">
                                        <span className="text-xl block mb-1 group-hover:scale-110 transition-transform">{tool.icon}</span>
                                        <p className="text-[11px] font-medium text-slate-600 line-clamp-1">{tool.title}</p>
                                    </Link>
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
