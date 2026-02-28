'use client';
import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { api, auth } from '@/lib/api';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';

/* ─── Heatmap helpers ─── */
function generateHeatmapData() {
    const data: number[] = [];
    for (let i = 0; i < 91; i++) data.push(Math.random() > 0.4 ? Math.floor(Math.random() * 4) + 1 : 0);
    return data;
}

const HEAT_COLORS = ['bg-slate-100', 'bg-emerald-200', 'bg-emerald-300', 'bg-emerald-400', 'bg-emerald-600'];

/* ─── Score Ring ─── */
function ScoreRing({ score, size = 120 }: { score: number; size?: number }) {
    const r = (size - 12) / 2;
    const circ = 2 * Math.PI * r;
    const offset = circ - (score / 1000) * circ;
    const grade = score >= 800 ? 'Excellent' : score >= 600 ? 'Strong' : score >= 400 ? 'Building' : 'Getting Started';
    const gradeColor = score >= 800 ? 'text-emerald-500' : score >= 600 ? 'text-indigo-500' : score >= 400 ? 'text-amber-500' : 'text-slate-400';
    return (
        <div className="relative" style={{ width: size, height: size }}>
            <svg className="st-progress-ring" width={size} height={size}>
                <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" className="text-slate-100" strokeWidth={10} />
                <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="url(#scoreGrad)" strokeWidth={10} strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset} />
                <defs><linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#6366F1" /><stop offset="100%" stopColor="#A855F7" /></linearGradient></defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-slate-900 tabular-nums">{score}</span>
                <span className={`text-[11px] font-semibold ${gradeColor}`}>{grade}</span>
            </div>
        </div>
    );
}

export default function DashboardPage() {
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [trending, setTrending] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const heatmap = useMemo(() => generateHeatmapData(), []);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const googleToken = params.get('token');
            if (googleToken && params.get('google')) {
                auth.setToken(googleToken);
                window.history.replaceState({}, '', '/dashboard');
            }
        }
        if (!auth.isLoggedIn()) { window.location.href = '/login'; return; }
        Promise.all([
            api.getMe().catch(() => null),
            api.getAssessmentProfile().catch(() => null),
            api.getTrendingSkills().catch(() => ({ skills: [] })),
        ]).then(([u, p, t]) => {
            if (!u) { auth.clearToken(); window.location.href = '/login'; return; }
            setUser(u); setProfile(p); setTrending(t?.skills || []); auth.setUser(u); setLoading(false);
        });
    }, []);

    if (loading) return (
        <div className="min-h-screen bg-slate-50">
            <TopBar />
            <main className="max-w-6xl mx-auto px-4 lg:px-6 py-6 pb-24 lg:pb-8">
                <div className="grid lg:grid-cols-3 gap-5">
                    <div className="lg:col-span-2 space-y-5">
                        <div className="st-skeleton h-56 rounded-2xl" />
                        <div className="st-skeleton h-40 rounded-2xl" />
                    </div>
                    <div className="space-y-5">
                        <div className="st-skeleton h-44 rounded-2xl" />
                        <div className="st-skeleton h-44 rounded-2xl" />
                    </div>
                </div>
            </main>
            <BottomNav />
        </div>
    );

    const displayName = user?.profile?.display_name || user?.display_name || user?.email?.split('@')[0] || 'User';
    const score = user?.profile?.skillten_score || 742;
    const streak = user?.profile?.streak_days || 23;
    const hasProfile = profile?.has_profile;
    const archetype = user?.profile?.archetype_name || profile?.archetype_name;

    const dailyChallenge = {
        title: 'Two Sum',
        difficulty: 'Easy',
        company: 'Amazon',
        topic: 'Arrays',
        solvedToday: false,
        solvedCount: 8432,
        timeLeft: '11h 43m',
    };

    const campusRank = { rank: 7, total: 243, change: 3, points: 12 };

    const skills = [
        { name: 'Python', score: 82, expiry: null },
        { name: 'SQL', score: 65, expiry: '5 days' },
        { name: 'JavaScript', score: 0, expiry: null },
    ];

    const recommendedProblems = [
        { title: 'Valid Parentheses', diff: 'Easy', company: 'Google', topic: 'Stacks' },
        { title: 'Merge Intervals', diff: 'Medium', company: 'Microsoft', topic: 'Arrays' },
        { title: 'LRU Cache', diff: 'Hard', company: 'Amazon', topic: 'Design' },
    ];

    const diffColor = (d: string) => d === 'Easy' ? 'bg-emerald-50 text-emerald-700' : d === 'Medium' ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700';

    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : hour < 21 ? 'Good evening' : 'Night owl mode';
    const smartMessage = hour < 12
        ? "Today's daily challenge is waiting."
        : hour < 17
            ? (streak > 5 ? `Your ${streak}-day streak is going strong 🔥` : "Keep building momentum today.")
            : hour < 21
                ? "Evening study time — complete one more task before bed."
                : `Last chance to maintain your ${streak}-day streak!`;

    return (
        <div className="min-h-screen bg-slate-50">
            <TopBar />

            <main className="max-w-6xl mx-auto px-4 lg:px-6 py-5 pb-28 lg:pb-8">
                {/* Smart Greeting (PRO Bible 5.1) */}
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-5">
                    <p className="text-sm text-slate-500">{greeting}</p>
                    <h1 className="text-xl font-bold text-slate-900 st-font-heading">{displayName} 👋</h1>
                    {archetype && <p className="text-xs text-indigo-500 mt-0.5">🧬 {archetype}</p>}
                    <p className="text-xs text-slate-400 mt-1">{smartMessage}</p>
                </motion.div>

                {/* Assessment CTA (if no assessment yet) */}
                {!hasProfile && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                        <Link href="/assessment" className="block mb-5">
                            <div className="relative bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 rounded-2xl p-5 text-white overflow-hidden group hover:shadow-xl transition-shadow">
                                <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
                                <div className="absolute bottom-0 left-0 w-28 h-28 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/4" />
                                <div className="relative z-10">
                                    <p className="text-xs text-white/60 font-medium mb-1">Your profile is 10% complete</p>
                                    <h3 className="text-lg font-bold mb-2">Take Your Career Assessment</h3>
                                    <p className="text-sm text-white/70 mb-3">25 minutes · 45 questions · Get your career archetype + top 3 matches</p>
                                    <span className="inline-flex items-center gap-1 bg-white text-indigo-700 px-5 py-2.5 rounded-xl font-semibold text-sm group-hover:shadow-lg transition-shadow">
                                        Start Assessment →
                                    </span>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                )}

                <div className="grid lg:grid-cols-3 gap-5">
                    {/* ─── LEFT COLUMN (2/3) ─── */}
                    <div className="lg:col-span-2 space-y-5">
                        {/* Top row: Score + Daily Challenge */}
                        <div className="grid sm:grid-cols-2 gap-4">
                            {/* Viya Score Hero */}
                            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                                <Link href="/score" className="block st-card p-5 hover:shadow-xl group h-full">
                                    <div className="flex items-center justify-between mb-3">
                                        <div>
                                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Viya Score™</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">+12 ↑</span>
                                                <span className="text-[10px] text-slate-400">vs yesterday</span>
                                            </div>
                                        </div>
                                        <ScoreRing score={score} size={100} />
                                    </div>
                                    {/* Score components mini-bar */}
                                    <div className="flex gap-1.5 mt-2">
                                        {[
                                            { label: 'Assessment', w: 85, color: 'bg-indigo-400' },
                                            { label: 'Coding', w: 60, color: 'bg-emerald-400' },
                                            { label: 'Aptitude', w: 45, color: 'bg-amber-400' },
                                            { label: 'Skills', w: 70, color: 'bg-violet-400' },
                                        ].map(c => (
                                            <div key={c.label} className="flex-1">
                                                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                    <div className={`h-full ${c.color} rounded-full transition-all`} style={{ width: `${c.w}%` }} />
                                                </div>
                                                <p className="text-[9px] text-slate-400 mt-0.5 text-center">{c.label}</p>
                                            </div>
                                        ))}
                                    </div>
                                </Link>
                            </motion.div>

                            {/* Daily Challenge Widget */}
                            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                                <Link href="/daily" className="block st-card p-5 hover:shadow-xl group h-full relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-amber-50 to-orange-50 rounded-bl-[60px] -translate-y-2 translate-x-2" />
                                    <div className="relative z-10">
                                        <div className="flex items-center justify-between mb-3">
                                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Daily Challenge</p>
                                            <span className="text-xs text-slate-400">⏱ {dailyChallenge.timeLeft} left</span>
                                        </div>
                                        <h3 className="font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">{dailyChallenge.title}</h3>
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${diffColor(dailyChallenge.difficulty)}`}>{dailyChallenge.difficulty}</span>
                                            <span className="text-[10px] text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">{dailyChallenge.company}</span>
                                            <span className="text-[10px] text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">{dailyChallenge.topic}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-semibold text-indigo-600 group-hover:translate-x-1 transition-transform inline-block">
                                                Solve Now →
                                            </span>
                                            <span className="flex items-center gap-1 text-xs text-slate-400">
                                                🔥 {streak} day streak
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        </div>

                        {/* Your Roadmap — Next Step */}
                        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                            <div className="st-card p-5">
                                <div className="flex items-center justify-between mb-3">
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Next in Your Roadmap</p>
                                    <Link href="/roadmap" className="text-xs text-indigo-600 font-medium hover:underline">View all →</Link>
                                </div>
                                <div className="flex items-center gap-4 bg-gradient-to-r from-indigo-50 to-violet-50 rounded-xl p-4 border border-indigo-100">
                                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-xl flex items-center justify-center text-white text-lg shrink-0">✅</div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-sm text-slate-900">Take SQL Verification Quiz</p>
                                        <p className="text-xs text-slate-500 mt-0.5">Closes your SQL gap — appears in 94% of Data Analyst jobs</p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="text-[10px] text-slate-400">~20 min</p>
                                        <Link href="/skills" className="text-xs font-semibold text-indigo-600 hover:underline mt-1 inline-block">Start →</Link>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Recommended Practice */}
                        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                            <div className="st-card p-5">
                                <div className="flex items-center justify-between mb-4">
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Recommended For You</p>
                                    <Link href="/practice" className="text-xs text-indigo-600 font-medium hover:underline">All problems →</Link>
                                </div>
                                <div className="space-y-2">
                                    {recommendedProblems.map((p, i) => (
                                        <Link key={i} href="/practice" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group">
                                            <div className="w-7 h-7 bg-slate-100 rounded-lg flex items-center justify-center text-xs font-bold text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">{i + 1}</div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-slate-900 group-hover:text-indigo-600 transition-colors">{p.title}</p>
                                                <p className="text-[10px] text-slate-400">{p.topic}</p>
                                            </div>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${diffColor(p.diff)}`}>{p.diff}</span>
                                            <span className="text-[10px] text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full hidden sm:block">{p.company}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* Activity Heatmap */}
                        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                            <div className="st-card p-5">
                                <div className="flex items-center justify-between mb-4">
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Activity — Last 90 Days</p>
                                    <span className="text-xs text-emerald-600 font-semibold">🔥 {streak} day streak</span>
                                </div>
                                <div className="grid grid-cols-13 gap-[3px]">
                                    {heatmap.map((v, i) => (
                                        <div key={i} className={`w-full aspect-square rounded-[3px] ${HEAT_COLORS[v]} transition-colors`} title={`${v} activities`} />
                                    ))}
                                </div>
                                <div className="flex items-center justify-end gap-1 mt-2">
                                    <span className="text-[9px] text-slate-400">Less</span>
                                    {HEAT_COLORS.map((c, i) => <div key={i} className={`w-2.5 h-2.5 rounded-sm ${c}`} />)}
                                    <span className="text-[9px] text-slate-400">More</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* ─── RIGHT COLUMN (1/3) ─── */}
                    <div className="space-y-5">
                        {/* Campus Wars Widget */}
                        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                            <Link href="/leaderboard" className="block st-card p-5 hover:shadow-xl group">
                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Campus Wars</p>
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center text-2xl shadow-sm">⚔️</div>
                                    <div>
                                        <p className="text-2xl font-bold text-slate-900">#{campusRank.rank}</p>
                                        <p className="text-xs text-slate-500">out of {campusRank.total} colleges</p>
                                    </div>
                                    <span className="ml-auto text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">▲{campusRank.change}</span>
                                </div>
                                <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-3">
                                    <span>Your contribution today</span>
                                    <span className="font-bold text-indigo-600">+{campusRank.points} pts</span>
                                </div>
                            </Link>
                        </motion.div>

                        {/* Skill Health Check */}
                        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                            <div className="st-card p-5">
                                <div className="flex items-center justify-between mb-3">
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Skill Health</p>
                                    <Link href="/skills" className="text-xs text-indigo-600 font-medium hover:underline">All skills →</Link>
                                </div>
                                <div className="space-y-3">
                                    {skills.map((s, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-sm font-medium text-slate-900">{s.name}</span>
                                                    {s.score > 0 ? (
                                                        <span className="text-xs font-bold text-indigo-600">{s.score}%</span>
                                                    ) : (
                                                        <span className="text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full font-medium">Verify</span>
                                                    )}
                                                </div>
                                                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                    <div className={`h-full rounded-full transition-all duration-700 ${s.score >= 70 ? 'bg-emerald-400' : s.score >= 40 ? 'bg-amber-400' : 'bg-slate-200'}`}
                                                        style={{ width: `${s.score}%` }} />
                                                </div>
                                                {s.expiry && (
                                                    <p className="text-[10px] text-rose-500 mt-0.5">⚠ Expires in {s.expiry}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* Peer Activity */}
                        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                            <div className="st-card p-5">
                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Community</p>
                                <div className="space-y-3">
                                    {[
                                        { icon: '👥', text: '3 friends solved the daily challenge' },
                                        { icon: '⚔️', text: 'Your college moved to #5 in Campus Wars' },
                                        { icon: '🏆', text: 'New contest starts in 2 days' },
                                        { icon: '🎖️', text: 'Rahul earned "50 Streak" badge' },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-start gap-2.5">
                                            <span className="text-base mt-0.5 shrink-0">{item.icon}</span>
                                            <p className="text-xs text-slate-600 leading-relaxed">{item.text}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* Quick Tools */}
                        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                            <div className="st-card p-5">
                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Quick Access</p>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { icon: '💬', label: 'AI Chat', href: '/chat' },
                                        { icon: '📄', label: 'Resume', href: '/resume' },
                                        { icon: '💼', label: 'Jobs', href: '/jobs' },
                                        { icon: '🎯', label: 'Internships', href: '/internships' },
                                        { icon: '🎭', label: 'Interview', href: '/simulator' },
                                        { icon: '👨‍👩‍👧', label: 'Parents', href: '/parent' },
                                    ].map(t => (
                                        <Link key={t.href} href={t.href} className="flex flex-col items-center gap-1 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group">
                                            <span className="text-lg group-hover:scale-110 transition-transform">{t.icon}</span>
                                            <span className="text-[10px] font-medium text-slate-500">{t.label}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* Trending Skills */}
                        {trending.length > 0 && (
                            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                                <div className="st-card p-5">
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">🔥 Trending Skills</p>
                                    <div className="flex flex-wrap gap-2">
                                        {trending.slice(0, 8).map((s: any, i: number) => (
                                            <Link key={i} href={`/skills?career=${encodeURIComponent(s.name || s)}`}
                                                className="text-xs px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition-all font-medium">
                                                {s.name || s}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </main>

            <BottomNav />
        </div>
    );
}
