'use client';
import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { api, auth } from '@/lib/api';
import { ROUTES } from '@/lib/constants/routes';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';

/* ─── Heatmap helpers ─── */
function generateHeatmapData() {
    // TODO: Replace with real activity data from API
    const data: number[] = [];
    for (let i = 0; i < 91; i++) data.push(0);
    return data;
}

const EMPTY_HEATMAP = new Array(91).fill(0);

const HEAT_COLORS = ['bg-[#1f2a3d]', 'bg-emerald-800', 'bg-emerald-600', 'bg-emerald-400', 'bg-emerald-300'];

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
                <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" className="text-[#1f2a3d]" strokeWidth={10} />
                <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="url(#scoreGrad)" strokeWidth={10} strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset} />
                <defs><linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#ffb955" /><stop offset="100%" stopColor="#e09a30" /></linearGradient></defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-[#d7e3fc] tabular-nums">{score}</span>
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
    const [heatmap, setHeatmap] = useState<number[]>(EMPTY_HEATMAP);
    const [dailyChallenge, setDailyChallenge] = useState<{ title: string; difficulty: string; company: string; topic: string; solvedToday: boolean; solvedCount: number; timeLeft: string } | null>(null); // TODO: fetch from /api/daily-challenge
    const [campusRank, setCampusRank] = useState<{ rank: number; total: number; change: number; points: number } | null>(null); // TODO: fetch from /api/campus/rank
    const [recommendedProblems, setRecommendedProblems] = useState<{ title: string; diff: string; company: string; topic: string }[]>([]); // TODO: fetch from /api/recommended-problems

    useEffect(() => {
        setHeatmap(generateHeatmapData());
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const googleToken = params.get('token');
            if (googleToken && params.get('google')) {
                auth.setToken(googleToken);
                window.history.replaceState({}, '', '/dashboard');
            }
        }
        if (!auth.isLoggedIn()) { window.location.href = ROUTES.LOGIN; return; }
        Promise.all([
            api.getMe().catch(() => null),
            api.getAssessmentProfile().catch(() => null),
            api.getTrendingSkills().catch(() => ({ skills: [] })),
        ]).then(([u, p, t]) => {
            if (!u) { auth.clearToken(); window.location.href = ROUTES.LOGIN; return; }
            setUser(u); setProfile(p); setTrending(t?.skills || []); auth.setUser(u); setLoading(false);
        });
    }, []);

    if (loading) return (
        <div className="min-h-screen bg-[#071325]">
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
    const score = user?.profile?.mentixy_score || 0;
    const streak = user?.profile?.streak_days || 0;
    const hasProfile = profile?.has_profile;
    const archetype = user?.profile?.archetype_name || profile?.archetype_name;

    // TODO: Fetch from /api/daily-challenge → setDailyChallenge()
    // TODO: Fetch from /api/campus/rank → setCampusRank()

    const skills: { name: string; score: number; expiry: string | null }[] = user?.profile?.verified_skills || [];

    // TODO: Fetch from /api/recommended-problems → setRecommendedProblems()

    const diffColor = (d: string) => d === 'Easy' ? 'bg-emerald-900/50 text-emerald-400' : d === 'Medium' ? 'bg-amber-900/50 text-amber-400' : 'bg-rose-900/50 text-rose-400';

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
        <div className="min-h-screen bg-[#071325]">
            <TopBar />

            <main className="max-w-6xl mx-auto px-4 lg:px-6 py-5 pb-28 lg:pb-8">
                {/* Smart Greeting (PRO Bible 5.1) */}
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-5">
                    <p className="text-sm text-[#8e909d]">{greeting}</p>
                    <h1 className="text-xl font-bold text-[#d7e3fc] st-font-heading">{displayName} 👋</h1>
                    {archetype && <p className="text-xs text-indigo-500 mt-0.5">🧬 {archetype}</p>}
                    <p className="text-xs text-[#8e909d] mt-1">{smartMessage}</p>
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
                            {/* Mentixy Score Hero */}
                            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                                <Link href="/score" className="block st-card p-5 hover:shadow-xl group h-full">
                                    <div className="flex items-center justify-between mb-3">
                                        <div>
                                            <p className="text-xs font-semibold text-[#8e909d] uppercase tracking-wider">Mentixy Score™</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-xs font-semibold text-emerald-400 bg-emerald-900/30 px-2 py-0.5 rounded-full">+12 ↑</span>
                                                <span className="text-[10px] text-[#8e909d]">vs yesterday</span>
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
                                                <div className="h-1.5 bg-[#1f2a3d] rounded-full overflow-hidden">
                                                    <div className={`h-full ${c.color} rounded-full transition-all`} style={{ width: `${c.w}%` }} />
                                                </div>
                                                <p className="text-[9px] text-[#8e909d] mt-0.5 text-center">{c.label}</p>
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
                                            <p className="text-xs font-semibold text-[#8e909d] uppercase tracking-wider">Daily Challenge</p>
                                            {dailyChallenge && <span className="text-xs text-slate-400">⏱ {dailyChallenge.timeLeft} left</span>}
                                        </div>
                                        {dailyChallenge ? (
                                            <>
                                                <h3 className="font-bold text-[#d7e3fc] mb-1 group-hover:text-[#ffb955] transition-colors">{dailyChallenge.title}</h3>
                                                <div className="flex items-center gap-2 mb-3">
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${diffColor(dailyChallenge.difficulty)}`}>{dailyChallenge.difficulty}</span>
                                                    <span className="text-[10px] text-[#8e909d] bg-[#1f2a3d] px-2 py-0.5 rounded-full">{dailyChallenge.company}</span>
                                                    <span className="text-[10px] text-[#8e909d] bg-[#1f2a3d] px-2 py-0.5 rounded-full">{dailyChallenge.topic}</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-semibold text-indigo-600 group-hover:translate-x-1 transition-transform inline-block">Solve Now →</span>
                                                    <span className="flex items-center gap-1 text-xs text-slate-400">🔥 {streak} day streak</span>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="text-center py-4">
                                                <p className="text-2xl mb-2">⚡</p>
                                                <p className="text-sm font-semibold text-[#d7e3fc] mb-1">Solve Today&apos;s Problem</p>
                                                <p className="text-xs text-[#8e909d] mb-2">Practice one problem daily to build consistency</p>
                                                <span className="text-xs font-semibold text-[#ffb955] group-hover:underline">Start practicing →</span>
                                                <p className="text-xs text-[#8e909d] mt-2">🔥 {streak} day streak</p>
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            </motion.div>
                        </div>

                        {/* Your Roadmap — Next Step */}
                        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                            <div className="st-card p-5">
                                <div className="flex items-center justify-between mb-3">
                                    <p className="text-xs font-semibold text-[#8e909d] uppercase tracking-wider">Next in Your Roadmap</p>
                                    <Link href="/roadmap" className="text-xs text-[#ffb955] font-medium hover:underline">View all →</Link>
                                </div>
                                <div className="flex items-center gap-4 bg-[#ffb955]/5 rounded-xl p-4 border border-[#ffb955]/15">
                                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-xl flex items-center justify-center text-white text-lg shrink-0">✅</div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-sm text-[#d7e3fc]">Take SQL Verification Quiz</p>
                                        <p className="text-xs text-[#8e909d] mt-0.5">Closes your SQL gap — appears in 94% of Data Analyst jobs</p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="text-[10px] text-[#8e909d]">~20 min</p>
                                        <Link href="/skills" className="text-xs font-semibold text-[#ffb955] hover:underline mt-1 inline-block">Start →</Link>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Recommended Practice */}
                        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                            <div className="st-card p-5">
                                <div className="flex items-center justify-between mb-4">
                                    <p className="text-xs font-semibold text-[#8e909d] uppercase tracking-wider">Recommended For You</p>
                                    <Link href="/practice" className="text-xs text-[#ffb955] font-medium hover:underline">All problems →</Link>
                                </div>
                                <div className="space-y-2">
                                    {recommendedProblems.length > 0 ? recommendedProblems.map((p, i) => (
                                        <Link key={i} href="/practice" className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#1f2a3d] transition-colors group">
                                            <div className="w-7 h-7 bg-[#1f2a3d] rounded-lg flex items-center justify-center text-xs font-bold text-[#8e909d] group-hover:bg-[#ffb955]/10 group-hover:text-[#ffb955] transition-colors">{i + 1}</div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-[#d7e3fc] group-hover:text-[#ffb955] transition-colors">{p.title}</p>
                                                <p className="text-[10px] text-[#8e909d]">{p.topic}</p>
                                            </div>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${diffColor(p.diff)}`}>{p.diff}</span>
                                            <span className="text-[10px] text-[#8e909d] bg-[#1f2a3d] px-2 py-0.5 rounded-full hidden sm:block">{p.company}</span>
                                        </Link>
                                    )) : (
                                        <div className="text-center py-6">
                                            <p className="text-2xl mb-2">💡</p>
                                            <p className="text-xs text-[#8e909d]">Complete your assessment to get personalized recommendations</p>
                                            <Link href="/practice" className="text-xs text-[#ffb955] font-semibold hover:underline mt-2 inline-block">Browse all problems →</Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>

                        {/* Activity Heatmap */}
                        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                            <div className="st-card p-5">
                                <div className="flex items-center justify-between mb-4">
                                    <p className="text-xs font-semibold text-[#8e909d] uppercase tracking-wider">Activity — Last 90 Days</p>
                                    <span className="text-xs text-emerald-400 font-semibold">🔥 {streak} day streak</span>
                                </div>
                                <div className="grid grid-cols-13 gap-[3px]">
                                    {heatmap.map((v, i) => (
                                        <div key={i} className={`w-full aspect-square rounded-[3px] ${HEAT_COLORS[v]} transition-colors`} title={`${v} activities`} />
                                    ))}
                                </div>
                                <div className="flex items-center justify-end gap-1 mt-2">
                                    <span className="text-[9px] text-[#8e909d]">Less</span>
                                    {HEAT_COLORS.map((c, i) => <div key={i} className={`w-2.5 h-2.5 rounded-sm ${c}`} />)}
                                    <span className="text-[9px] text-[#8e909d]">More</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* ─── RIGHT COLUMN (1/3) ─── */}
                    <div className="space-y-5">
                        {/* Campus Wars Widget */}
                        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                            <Link href="/leaderboard" className="block st-card p-5 hover:shadow-xl group">
                                <p className="text-xs font-semibold text-[#8e909d] uppercase tracking-wider mb-3">Campus Wars</p>
                                {campusRank ? (
                                    <>
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center text-2xl shadow-sm">⚔️</div>
                                            <div>
                                                <p className="text-2xl font-bold text-[#d7e3fc]">#{campusRank.rank}</p>
                                                <p className="text-xs text-[#8e909d]">out of {campusRank.total} colleges</p>
                                            </div>
                                            <span className="ml-auto text-xs font-bold text-emerald-400 bg-emerald-900/30 px-2 py-1 rounded-full">▲{campusRank.change}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs text-[#8e909d] border-t border-[#1f2a3d] pt-3">
                                            <span>Your contribution today</span>
                                            <span className="font-bold text-[#ffb955]">+{campusRank.points} pts</span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center text-2xl shadow-sm">⚔️</div>
                                        <div>
                                            <p className="text-sm font-semibold text-[#d7e3fc]">Join Campus Wars</p>
                                            <p className="text-xs text-[#8e909d]">Help your college climb the ranks →</p>
                                        </div>
                                    </div>
                                )}
                            </Link>
                        </motion.div>

                        {/* Skill Health Check */}
                        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                            <div className="st-card p-5">
                                <div className="flex items-center justify-between mb-3">
                                    <p className="text-xs font-semibold text-[#8e909d] uppercase tracking-wider">Skill Health</p>
                                    <Link href="/skills" className="text-xs text-[#ffb955] font-medium hover:underline">All skills →</Link>
                                </div>
                                {skills.length > 0 ? (
                                    <div className="space-y-3">
                                        {skills.map((s, i) => (
                                            <div key={i} className="flex items-center gap-3">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="text-sm font-medium text-[#d7e3fc]">{s.name}</span>
                                                        {s.score > 0 ? (
                                                            <span className="text-xs font-bold text-[#ffb955]">{s.score}%</span>
                                                        ) : (
                                                            <span className="text-[10px] text-amber-400 bg-amber-900/30 px-1.5 py-0.5 rounded-full font-medium">Verify</span>
                                                        )}
                                                    </div>
                                                    <div className="h-1.5 bg-[#1f2a3d] rounded-full overflow-hidden">
                                                        <div className={`h-full rounded-full transition-all duration-700 ${s.score >= 70 ? 'bg-emerald-400' : s.score >= 40 ? 'bg-amber-400' : 'bg-[#2a3548]'}`}
                                                            style={{ width: `${s.score}%` }} />
                                                    </div>
                                                    {s.expiry && (
                                                        <p className="text-[10px] text-rose-500 mt-0.5">⚠ Expires in {s.expiry}</p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-4">
                                        <p className="text-3xl mb-2">🎯</p>
                                        <p className="text-xs text-slate-500 mb-2">No verified skills yet</p>
                                        <Link href="/skills" className="text-xs font-semibold text-indigo-600 hover:underline">Add your first skill →</Link>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* Peer Activity */}
                        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                            <Link href="/community" className="block st-card p-5 hover:shadow-xl group">
                                <p className="text-xs font-semibold text-[#8e909d] uppercase tracking-wider mb-3">Community</p>
                                <div className="text-center py-4">
                                    <p className="text-2xl mb-2">👥</p>
                                    <p className="text-xs text-[#8e909d] mb-1">Join the community to see peer activity</p>
                                    <span className="text-xs font-semibold text-[#ffb955] group-hover:underline">Explore community →</span>
                                </div>
                            </Link>
                        </motion.div>

                        {/* Profile Views (Bible Phase 5) */}
                        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32 }}>
                            <Link href="/profile" className="block st-card p-5 hover:shadow-xl group">
                                <div className="flex items-center justify-between mb-3">
                                    <p className="text-xs font-semibold text-[#8e909d] uppercase tracking-wider">Profile Views</p>
                                </div>
                                <div className="text-center py-4">
                                    <p className="text-2xl mb-2">👁️</p>
                                    <p className="text-xs text-[#8e909d] mb-1">Complete your profile to attract recruiters</p>
                                    <span className="text-xs font-semibold text-[#ffb955] group-hover:underline">Complete profile →</span>
                                </div>
                            </Link>
                        </motion.div>

                        {/* Quick Tools */}
                        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                            <div className="st-card p-5">
                                <p className="text-xs font-semibold text-[#8e909d] uppercase tracking-wider mb-3">Quick Access</p>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { icon: '💬', label: 'AI Chat', href: '/chat' },
                                        { icon: '📄', label: 'Resume', href: '/resume' },
                                        { icon: '💼', label: 'Jobs', href: '/jobs' },
                                        { icon: '🎯', label: 'Internships', href: '/internships' },
                                        { icon: '🎭', label: 'Interview', href: '/simulator' },
                                        { icon: '👨‍👩‍👧', label: 'Parents', href: '/parent' },
                                    ].map(t => (
                                        <Link key={t.href} href={t.href} className="flex flex-col items-center gap-1 p-2.5 rounded-xl hover:bg-[#1f2a3d] transition-colors group">
                                            <span className="text-lg group-hover:scale-110 transition-transform">{t.icon}</span>
                                            <span className="text-[10px] font-medium text-[#8e909d]">{t.label}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* Trending Skills */}
                        {trending.length > 0 && (
                            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                                <div className="st-card p-5">
                                    <p className="text-xs font-semibold text-[#8e909d] uppercase tracking-wider mb-3">🔥 Trending Skills</p>
                                    <div className="flex flex-wrap gap-2">
                                        {trending.slice(0, 8).map((s: any, i: number) => (
                                            <Link key={i} href={`/skills?career=${encodeURIComponent(s.name || s)}`}
                                                className="text-xs px-2.5 py-1 bg-[#1f2a3d] border border-[#2a3548] rounded-lg text-[#b4c5e0] hover:border-[#ffb955]/40 hover:text-[#ffb955] transition-all font-medium">
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
