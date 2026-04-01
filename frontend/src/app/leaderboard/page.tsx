'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { ROUTES } from '@/lib/constants/routes';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { LoadingSkeleton, EmptyState, ErrorState } from '@/components/ui/StateComponents';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';
import Link from 'next/link';

interface LeaderboardEntry {
    rank: number;
    display_name: string;
    username: string;
    mentixy_score: number;
    college_name: string;
    streak_days: number;
    total_points: number;
    archetype_name?: string;
    avatar_url?: string;
}

export default function LeaderboardPage() {
    const { isReady, user } = useAuthGuard();
    const [tab, setTab] = useState<'overall' | 'coding' | 'streak' | 'campus'>('overall');
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [myCollege, setMyCollege] = useState<any>(null);
    const [campusWars, setCampusWars] = useState<any[]>([]);

    useEffect(() => {
        if (!isReady) return;
        loadData();
    }, [isReady, tab]);

    const loadData = async () => {
        setLoading(true);
        setError(false);
        try {
            if (tab === 'campus') {
                const [cw, mc] = await Promise.all([
                    api.getCampusWars().catch(() => ({ campus_wars: [] })),
                    api.getMyCollegeRank().catch(() => null),
                ]);
                setCampusWars(cw.campus_wars || []);
                setMyCollege(mc);
            } else {
                const metric = tab === 'coding' ? 'problems_solved' : tab === 'streak' ? 'streak' : 'mentixy_score';
                const data = await api.getLeaderboard(metric);
                setLeaderboard(data.leaderboard || []);
            }
        } catch {
            setError(true);
        }
        setLoading(false);
    };

    const getMedal = (r: number) => r === 1 ? '🥇' : r === 2 ? '🥈' : r === 3 ? '🥉' : `#${r}`;

    if (!isReady) return <div className="min-h-screen bg-slate-50"><TopBar /><main className="max-w-3xl mx-auto px-4 py-6"><LoadingSkeleton variant="card" count={5} /></main></div>;

    const top3 = leaderboard.slice(0, 3);
    const currentUsername = user?.username;

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1 pb-24 md:pb-8">
                    {/* Hero */}
                    <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 text-white px-6 py-10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
                        <div className="max-w-3xl mx-auto relative z-10">
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                                <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full mb-3 inline-block">🏆 LEADERBOARD</span>
                                <h1 className="text-3xl font-bold mb-2">Top Students</h1>
                                <p className="text-white/60 text-sm mb-4">See how you rank against students across India. Updated every 15 minutes.</p>
                            </motion.div>
                        </div>
                    </div>

                    <div className="px-4 md:px-6 py-6 max-w-3xl mx-auto">
                        {/* Tabs */}
                        <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
                            {([
                                { key: 'overall' as const, label: '🏅 Overall' },
                                { key: 'coding' as const, label: '💻 Coding' },
                                { key: 'streak' as const, label: '🔥 Streaks' },
                                { key: 'campus' as const, label: '🏫 Campus Wars' },
                            ]).map(t => (
                                <button key={t.key} onClick={() => setTab(t.key)}
                                    className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${tab === t.key
                                        ? 'bg-amber-500 text-white shadow-lg shadow-amber-200'
                                        : 'bg-white text-slate-600 border border-slate-200 hover:border-amber-200'
                                        }`}>{t.label}</button>
                            ))}
                        </div>

                        {error ? (
                            <ErrorState message="Could not load leaderboard. Please try again." onRetry={loadData} />
                        ) : loading ? (
                            <LoadingSkeleton variant="list" count={8} />
                        ) : tab === 'campus' ? (
                            /* ═══ Campus Wars View ═══ */
                            <div className="space-y-4">
                                {/* My College Card */}
                                {myCollege?.has_college && (
                                    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                                        className="st-card p-5 bg-gradient-to-br from-indigo-50 to-violet-50 border-indigo-200">
                                        <h3 className="font-bold text-slate-900 mb-2">🏫 Your College</h3>
                                        <p className="text-sm font-semibold text-indigo-700 mb-1">{myCollege.college_name}</p>
                                        <div className="grid grid-cols-3 gap-3 mt-3">
                                            <div className="text-center bg-white rounded-xl p-2">
                                                <p className="text-lg font-bold text-indigo-600">#{myCollege.my_rank_in_college || '—'}</p>
                                                <p className="text-[10px] text-slate-500">Your Rank</p>
                                            </div>
                                            <div className="text-center bg-white rounded-xl p-2">
                                                <p className="text-lg font-bold text-slate-700">{myCollege.total_students}</p>
                                                <p className="text-[10px] text-slate-500">Students</p>
                                            </div>
                                            <div className="text-center bg-white rounded-xl p-2">
                                                <p className="text-lg font-bold text-emerald-600">{myCollege.college_avg_score}</p>
                                                <p className="text-[10px] text-slate-500">Avg Score</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {campusWars.length === 0 ? (
                                    <EmptyState icon="🏫" title="No colleges yet" subtitle="Campus Wars data will populate as colleges join Mentixy." />
                                ) : (
                                    campusWars.map((c, i) => (
                                        <motion.div key={c.college_id} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                                            className="st-card p-4 flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold ${i < 3 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>
                                                {getMedal(i + 1)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-sm text-slate-900 truncate">{c.college_name}</p>
                                                <p className="text-xs text-slate-500">{c.city}, {c.state} · {c.active_students} students</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-bold text-indigo-600">{c.avg_mentixy_score}</p>
                                                <p className="text-[10px] text-slate-400">Avg Score</p>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </div>
                        ) : leaderboard.length === 0 ? (
                            <EmptyState icon="🏆" title="Leaderboard is empty" subtitle="Be the first to climb the ranks! Complete assessments and solve problems to appear here." cta="Start Solving" ctaHref={ROUTES.CODING} />
                        ) : (
                            /* ═══ Individual Leaderboard ═══ */
                            <div className="space-y-2">
                                {/* Podium (top 3) */}
                                {top3.length >= 3 && (
                                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                        className="flex items-end justify-center gap-3 mb-6">
                                        {/* 2nd place */}
                                        <div className="text-center flex-1">
                                            <div className="w-14 h-14 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full mx-auto flex items-center justify-center text-white font-bold text-lg mb-1">
                                                {top3[1].display_name?.[0] || '?'}
                                            </div>
                                            <p className="text-xs font-bold text-slate-900 truncate">{top3[1].display_name}</p>
                                            <p className="text-[10px] text-slate-400 truncate">{top3[1].college_name || '—'}</p>
                                            <div className="bg-gray-100 rounded-t-xl mt-1 h-16 flex items-center justify-center"><span className="text-lg">🥈</span></div>
                                            <p className="text-xs font-bold text-slate-700">{top3[1].mentixy_score}</p>
                                        </div>
                                        {/* 1st place */}
                                        <div className="text-center flex-1">
                                            <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full mx-auto flex items-center justify-center text-white font-bold text-xl mb-1 ring-4 ring-amber-200">
                                                {top3[0].display_name?.[0] || '?'}
                                            </div>
                                            <p className="text-xs font-bold text-slate-900 truncate">{top3[0].display_name}</p>
                                            <p className="text-[10px] text-slate-400 truncate">{top3[0].college_name || '—'}</p>
                                            <div className="bg-amber-50 rounded-t-xl mt-1 h-24 flex items-center justify-center"><span className="text-2xl">🥇</span></div>
                                            <p className="text-sm font-bold text-amber-600">{top3[0].mentixy_score}</p>
                                        </div>
                                        {/* 3rd place */}
                                        <div className="text-center flex-1">
                                            <div className="w-14 h-14 bg-gradient-to-br from-amber-600 to-orange-700 rounded-full mx-auto flex items-center justify-center text-white font-bold text-lg mb-1">
                                                {top3[2].display_name?.[0] || '?'}
                                            </div>
                                            <p className="text-xs font-bold text-slate-900 truncate">{top3[2].display_name}</p>
                                            <p className="text-[10px] text-slate-400 truncate">{top3[2].college_name || '—'}</p>
                                            <div className="bg-orange-50 rounded-t-xl mt-1 h-12 flex items-center justify-center"><span className="text-lg">🥉</span></div>
                                            <p className="text-xs font-bold text-slate-700">{top3[2].mentixy_score}</p>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Full list */}
                                {leaderboard.map((entry, i) => (
                                    <motion.div key={entry.username}
                                        initial={{ opacity: 0, x: -15 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.04 }}
                                        className={`st-card p-4 flex items-center gap-4 hover:shadow-md transition-all ${entry.username === currentUsername ? 'ring-2 ring-indigo-500 bg-indigo-50/50' : ''}`}
                                    >
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold ${entry.rank <= 3 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>
                                            {getMedal(entry.rank)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="font-semibold text-sm text-slate-900">{entry.display_name}</p>
                                                {entry.username === currentUsername && <span className="text-[9px] bg-indigo-600 text-white px-1.5 py-0.5 rounded-full font-bold">YOU</span>}
                                                {entry.streak_days >= 30 && <span className="text-[10px]">🔥</span>}
                                            </div>
                                            <p className="text-xs text-slate-500">{entry.college_name || 'Unknown'} · 🔥{entry.streak_days}d</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-indigo-600">{entry.mentixy_score}</p>
                                            <p className="text-[10px] text-slate-400">
                                                {tab === 'coding' ? 'points' : tab === 'streak' ? 'days' : 'score'}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        {/* CTA */}
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                            className="mt-8 st-card p-6 text-center bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100">
                            <span className="text-3xl block mb-2">🚀</span>
                            <h3 className="font-bold text-slate-900 mb-1">Climb the Ranks</h3>
                            <p className="text-sm text-slate-500 mb-3">Complete challenges, solve problems, and verify skills to boost your rank.</p>
                            <div className="flex gap-2 justify-center">
                                <Link href={ROUTES.CHALLENGES} className="st-btn-primary text-xs px-4 py-2">Daily Challenges</Link>
                                <Link href={ROUTES.CAMPUS} className="st-btn-secondary text-xs px-4 py-2">Campus Wars ⚔️</Link>
                            </div>
                        </motion.div>
                    </div>
                </main>
                <BottomNav />
            </div>
        </div>
    );
}
