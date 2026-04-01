'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { api, auth } from '@/lib/api';
import { ROUTES } from '@/lib/constants/routes';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { LoadingSkeleton, EmptyState, ErrorState } from '@/components/ui/StateComponents';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';
import Link from 'next/link';

export default function AnalyticsPage() {
    const { isReady, user } = useAuthGuard();
    const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('week');
    const [profile, setProfile] = useState<any>(null);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!isReady) return;
        loadAnalytics();
    }, [isReady]);

    const loadAnalytics = async () => {
        setLoading(true);
        setError(false);
        try {
            const [profileData, codingStats] = await Promise.all([
                api.getAssessmentProfile().catch(() => null),
                api.getCodingStats().catch(() => null),
            ]);
            setProfile(profileData);
            setStats(codingStats);
        } catch {
            setError(true);
        }
        setLoading(false);
    };

    if (!isReady) return <div className="min-h-screen bg-slate-50"><TopBar /><main className="max-w-4xl mx-auto px-4 py-6"><LoadingSkeleton variant="card" count={4} /></main></div>;

    // Derive real metrics from API data
    const mentixyScore = profile?.mentixy_score || 0;
    const problemsSolved = stats?.problems_solved_total || 0;
    const easySolved = stats?.easy_solved || 0;
    const mediumSolved = stats?.medium_solved || 0;
    const hardSolved = stats?.hard_solved || 0;
    const streak = stats?.current_streak || 0;
    const aptitudeAccuracy = profile?.aptitude_accuracy || 0;

    const metrics = [
        { label: 'Mentixy Score', value: mentixyScore, icon: '🎯', color: 'from-indigo-500 to-violet-500' },
        { label: 'Problems Solved', value: problemsSolved, icon: '💻', color: 'from-emerald-500 to-teal-500' },
        { label: 'Current Streak', value: `${streak}d`, icon: '🔥', color: 'from-amber-500 to-orange-500' },
        { label: 'Aptitude Accuracy', value: aptitudeAccuracy > 0 ? `${aptitudeAccuracy}%` : '—', icon: '🧠', color: 'from-purple-500 to-pink-500' },
    ];

    const skillBreakdown = [
        { skill: 'Easy Problems', level: problemsSolved > 0 ? Math.round((easySolved / Math.max(problemsSolved, 1)) * 100) : 0, count: easySolved, color: 'bg-green-500' },
        { skill: 'Medium Problems', level: problemsSolved > 0 ? Math.round((mediumSolved / Math.max(problemsSolved, 1)) * 100) : 0, count: mediumSolved, color: 'bg-amber-500' },
        { skill: 'Hard Problems', level: problemsSolved > 0 ? Math.round((hardSolved / Math.max(problemsSolved, 1)) * 100) : 0, count: hardSolved, color: 'bg-red-500' },
    ];

    return (
        <div className="min-h-screen bg-slate-50">
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
                        {error ? (
                            <ErrorState message="Could not load analytics. Please try again." onRetry={loadAnalytics} />
                        ) : loading ? (
                            <LoadingSkeleton variant="card" count={4} />
                        ) : (
                            <>
                                {/* Key metrics from real data */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {metrics.map((m, i) => (
                                        <motion.div key={m.label}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.08 }}
                                            className="st-card p-4"
                                        >
                                            <span className="text-lg block mb-2">{m.icon}</span>
                                            <p className="text-2xl font-bold text-slate-900">{m.value}</p>
                                            <p className="text-[10px] text-slate-500 uppercase mt-0.5 font-semibold">{m.label}</p>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Problem Breakdown */}
                                <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                                    className="st-card p-6">
                                    <h2 className="font-bold text-slate-900 mb-1">Problem Difficulty Breakdown</h2>
                                    <p className="text-xs text-slate-500 mb-4">Your solving distribution</p>
                                    {problemsSolved === 0 ? (
                                        <EmptyState icon="💻" title="No problems solved yet" subtitle="Start solving coding problems to see your breakdown here." cta="Start Solving" ctaHref={ROUTES.CODING} />
                                    ) : (
                                        <div className="space-y-3">
                                            {skillBreakdown.map((s, i) => (
                                                <div key={s.skill}>
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="text-xs font-semibold text-slate-700">{s.skill}</span>
                                                        <span className="text-[10px] text-slate-400">{s.count} solved · {s.level}%</span>
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
                                    )}
                                </motion.section>

                                {/* Mentixy Score Card */}
                                <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                                    className="st-card p-6">
                                    <h2 className="font-bold text-slate-900 mb-1">Mentixy Score™ Overview</h2>
                                    <p className="text-xs text-slate-500 mb-4">Your composite placement readiness score</p>
                                    {mentixyScore === 0 ? (
                                        <EmptyState icon="🎯" title="Score not yet calculated" subtitle="Complete your assessment to get your Mentixy Score™" cta="Take Assessment" ctaHref={ROUTES.ASSESSMENT} />
                                    ) : (
                                        <div className="flex items-center gap-6">
                                            <div className="relative w-28 h-28">
                                                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                                                    <circle cx="60" cy="60" r="50" fill="none" stroke="#E2E8F0" strokeWidth="10" />
                                                    <circle cx="60" cy="60" r="50" fill="none"
                                                        stroke={mentixyScore >= 750 ? '#10B981' : mentixyScore >= 500 ? '#6366F1' : '#F59E0B'}
                                                        strokeWidth="10" strokeLinecap="round"
                                                        strokeDasharray={`${(mentixyScore / 1000) * 314} ${314 - (mentixyScore / 1000) * 314}`} />
                                                </svg>
                                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                    <span className="text-2xl font-bold text-slate-900">{mentixyScore}</span>
                                                    <span className="text-[9px] text-slate-500">/1000</span>
                                                </div>
                                            </div>
                                            <div className="flex-1 space-y-2">
                                                <p className={`text-sm font-bold ${mentixyScore >= 750 ? 'text-emerald-600' : mentixyScore >= 500 ? 'text-indigo-600' : 'text-amber-600'}`}>
                                                    {mentixyScore >= 750 ? '🎉 Placement Ready' : mentixyScore >= 500 ? '📈 On Track' : '💪 Needs Improvement'}
                                                </p>
                                                <p className="text-xs text-slate-500">Keep practicing to improve your score. Focus on your weaker areas.</p>
                                            </div>
                                        </div>
                                    )}
                                </motion.section>

                                {/* Quick Actions */}
                                <div className="flex gap-3 justify-center">
                                    <Link href={ROUTES.CODING} className="st-btn-primary text-sm px-5 py-2.5">💻 Solve Problems</Link>
                                    <Link href={ROUTES.APTITUDE} className="st-btn-secondary text-sm px-5 py-2.5">🧠 Practice Aptitude</Link>
                                </div>
                            </>
                        )}
                    </div>
                </main>
                <BottomNav />
            </div>
        </div>
    );
}
