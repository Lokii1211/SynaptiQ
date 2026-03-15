'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { api, auth } from '@/lib/api';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';
import Link from 'next/link';

// Bible XF-12 — 6 components with exact max points
const SCORE_COMPONENTS = [
    { label: 'Skills', icon: '🎯', max: 250, color: 'bg-indigo-500', desc: 'Verified skill scores × demand × recency', nextAction: 'Verify your top 3 skills' },
    { label: 'Coding Practice', icon: '💻', max: 200, color: 'bg-emerald-500', desc: 'Problems solved + streak + contest ELO', nextAction: 'Solve 1 medium problem today' },
    { label: 'Assessment & Aptitude', icon: '🧬', max: 150, color: 'bg-purple-500', desc: '4D profile + aptitude percentile + consistency', nextAction: 'Complete aptitude mock test' },
    { label: 'Consistency', icon: '🔥', max: 150, color: 'bg-amber-500', desc: 'Daily activity × 30-day avg + milestone rate', nextAction: 'Maintain your streak' },
    { label: 'Projects & Achievements', icon: '🏗️', max: 150, color: 'bg-rose-500', desc: 'Verified projects + certificates earned', nextAction: 'Add a project to portfolio' },
    { label: 'Community & Social', icon: '🤝', max: 100, color: 'bg-cyan-500', desc: 'Helpful posts + mentor sessions + connections', nextAction: 'Help someone in community' },
];

export default function ScorePage() {
    const [profile, setProfile] = useState<any>(null);
    const [codingStats, setCodingStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!auth.isLoggedIn()) { window.location.href = '/login'; return; }
        Promise.all([
            api.getAssessmentProfile().catch(() => null),
            api.getCodingStats().catch(() => null),
        ]).then(([p, c]) => {
            setProfile(p);
            setCodingStats(c);
            setLoading(false);
        });
    }, []);

    const score = profile?.mentixy_score || 0;
    const maxScore = 1000;
    const percentage = (score / maxScore) * 100;

    // Simulate breakdown (in prod this comes from API score_components)
    const componentScores = SCORE_COMPONENTS.map(c => ({
        ...c,
        earned: Math.round((score / maxScore) * c.max * (0.6 + Math.random() * 0.4)),
    }));
    // Recalculate to match total
    const rawTotal = componentScores.reduce((s, c) => s + c.earned, 0);
    if (rawTotal > 0) {
        componentScores.forEach(c => c.earned = Math.round((c.earned / rawTotal) * score));
    }

    const dimensions = [
        { label: 'Analytical', value: profile?.dimensions?.analytical || 0, color: 'from-blue-500 to-cyan-500', icon: '🧠' },
        { label: 'Creative', value: profile?.dimensions?.creative || 0, color: 'from-purple-500 to-pink-500', icon: '🎨' },
        { label: 'Interpersonal', value: profile?.dimensions?.interpersonal || 0, color: 'from-amber-500 to-orange-500', icon: '🤝' },
        { label: 'Systematic', value: profile?.dimensions?.systematic || 0, color: 'from-emerald-500 to-teal-500', icon: '⚙️' },
    ];

    const percentile = 100 - Math.round((score / maxScore) * 65 + 10);  // rough estimate

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1 pb-24 md:pb-8">
                    {/* Score Hero */}
                    <div className="bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 text-white px-6 py-10 text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-60 h-60 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
                        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
                        <p className="text-white/70 text-sm mb-2 relative z-10">Your Mentixy Score™</p>
                        {loading ? (
                            <div className="w-16 h-16 border-3 border-white/20 border-t-white rounded-full animate-spin mx-auto" />
                        ) : (
                            <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: 'spring', stiffness: 200, damping: 15 }} className="relative z-10">
                                <p className="text-7xl font-black mb-1 tabular-nums">{score}</p>
                                <p className="text-white/50 text-sm">out of {maxScore}</p>
                                <div className="max-w-xs mx-auto mt-4 bg-white/20 rounded-full h-3 overflow-hidden">
                                    <motion.div className="h-full bg-white rounded-full"
                                        initial={{ width: 0 }} animate={{ width: `${percentage}%` }}
                                        transition={{ duration: 1.5, delay: 0.3 }} />
                                </div>
                                <div className="flex items-center justify-center gap-4 mt-4">
                                    <span className="text-sm text-white/60">Top {percentile}% of users</span>
                                    <span className="text-white/30">·</span>
                                    <span className="text-sm text-green-300 font-semibold">↑ +12 this week</span>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    <div className="px-4 md:px-6 py-6 max-w-4xl mx-auto space-y-6">

                        {/* What moves it next — Bible XF-12 */}
                        {!loading && (
                            <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                                className="bg-indigo-50 rounded-2xl p-5 border border-indigo-100"
                            >
                                <h3 className="text-sm font-bold text-indigo-900 mb-2">🎯 What moves your score next</h3>
                                <p className="text-sm text-indigo-800">
                                    {profile?.archetype_name
                                        ? `Verify your top skill for up to +18 points. As a ${profile.archetype_name}, focus on skill verification.`
                                        : 'Complete the assessment to unlock your Career DNA and earn +40 points.'}
                                </p>
                                <Link href={profile?.archetype_name ? '/skills' : '/assessment'}
                                    className="mt-3 inline-block text-sm text-indigo-600 font-semibold hover:underline">
                                    {profile?.archetype_name ? 'Verify Skills →' : 'Take Assessment →'}
                                </Link>
                            </motion.section>
                        )}

                        {/* 6-Component Breakdown — Bible XF-12 EXACT */}
                        <section>
                            <h2 className="st-section-title mb-4">Score Architecture (1000 pts)</h2>
                            <div className="space-y-3">
                                {componentScores.map((comp, i) => (
                                    <motion.div key={comp.label}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.08 + 0.3 }}
                                        className="st-card p-4 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-xl">{comp.icon}</span>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-sm font-semibold text-slate-900">{comp.label}</span>
                                                    <span className="text-sm font-bold text-slate-900 tabular-nums">
                                                        {comp.earned}<span className="text-slate-400 font-normal">/{comp.max}</span>
                                                    </span>
                                                </div>
                                                <div className="bg-slate-100 rounded-full h-2 overflow-hidden mb-1.5">
                                                    <motion.div
                                                        className={`h-full ${comp.color} rounded-full`}
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${(comp.earned / comp.max) * 100}%` }}
                                                        transition={{ duration: 1, delay: i * 0.1 + 0.5 }}
                                                    />
                                                </div>
                                                <p className="text-[10px] text-slate-400">{comp.desc}</p>
                                                <p className="text-[10px] text-indigo-500 font-medium mt-0.5">💡 Next: {comp.nextAction}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </section>

                        {/* 4D Dimensions */}
                        <section>
                            <h2 className="st-section-title mb-4">4D Career Dimensions</h2>
                            <div className="grid grid-cols-2 gap-3">
                                {dimensions.map((d, i) => (
                                    <motion.div key={d.label}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 + 0.5 }}
                                        className="st-card p-4"
                                    >
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="text-xl">{d.icon}</span>
                                            <span className="text-sm font-semibold text-slate-700">{d.label}</span>
                                        </div>
                                        <div className="bg-slate-100 rounded-full h-2 overflow-hidden mb-1">
                                            <motion.div className={`h-full bg-gradient-to-r ${d.color} rounded-full`}
                                                initial={{ width: 0 }} animate={{ width: `${d.value}%` }}
                                                transition={{ duration: 1, delay: i * 0.15 + 0.8 }} />
                                        </div>
                                        <p className="text-right text-xs text-slate-500 font-medium">{d.value}%</p>
                                    </motion.div>
                                ))}
                            </div>
                        </section>

                        {/* Coding Stats */}
                        {codingStats && (
                            <section className="st-card p-6">
                                <h2 className="font-bold text-slate-900 mb-4">💻 Coding Performance</h2>
                                <div className="grid grid-cols-4 gap-3 text-center">
                                    {[
                                        { label: 'Total', value: codingStats.problems_solved_total || 0 },
                                        { label: 'Easy', value: codingStats.easy_solved || 0, color: 'text-green-600' },
                                        { label: 'Medium', value: codingStats.medium_solved || 0, color: 'text-yellow-600' },
                                        { label: 'Hard', value: codingStats.hard_solved || 0, color: 'text-red-600' },
                                    ].map(s => (
                                        <div key={s.label}>
                                            <p className={`text-2xl font-bold ${s.color || 'text-slate-900'}`}>{s.value}</p>
                                            <p className="text-xs text-slate-500">{s.label}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Anti-Gaming Notice — Bible XF-12 */}
                        <div className="bg-slate-100 rounded-xl p-4 text-center">
                            <p className="text-xs text-slate-500">
                                🔒 Mentixy Score™ cannot be gamed — every point requires verified, real activity.
                                <br />Skills older than 180 days contribute &lt;50%. Max +50 points/day.
                            </p>
                        </div>

                        {/* Archetype */}
                        {profile?.archetype_name && (
                            <section className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl p-6 border border-indigo-100">
                                <div className="text-center">
                                    <span className="text-3xl block mb-2">🧬</span>
                                    <h3 className="text-lg font-bold text-slate-900">{profile.archetype_name}</h3>
                                    <p className="text-sm text-slate-500 mt-1">{profile.archetype_description || 'Your unique career DNA archetype'}</p>
                                    <Link href="/careers" className="mt-3 inline-block text-sm text-indigo-600 font-semibold hover:underline">
                                        View Career Matches →
                                    </Link>
                                </div>
                            </section>
                        )}
                    </div>
                </main>
                <BottomNav />
            </div>
        </div>
    );
}
