'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { api, auth } from '@/lib/api';
import { difficultyColor } from '@/lib/utils/india';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';
import { SideNav } from '@/components/layout/SideNav';

export default function CodingArenaPage() {
    const [problems, setProblems] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        if (!auth.isLoggedIn()) { window.location.href = '/login'; return; }
        Promise.all([
            api.getCodingProblems().catch(() => ({ problems: [], total: 0 })),
            api.getCodingStats().catch(() => null),
        ]).then(([p, s]) => {
            setProblems(p.problems || []);
            setStats(s);
            setLoading(false);
        });
    }, []);

    const filtered = problems.filter(p =>
        filter === 'all' || p.difficulty === filter
    );

    return (
        <div className="flex min-h-screen bg-slate-50">
            <SideNav />
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1 pb-24 md:pb-8">
                    {/* Header */}
                    <div className="bg-slate-900 text-white px-6 py-8">
                        <h1 className="text-2xl font-bold mb-2">💻 Coding Arena</h1>
                        <p className="text-slate-400 text-sm mb-6">Practice DSA problems — as good as LeetCode, built for Indian interviews</p>

                        {/* Stats */}
                        {stats && (
                            <div className="grid grid-cols-4 gap-3">
                                {[
                                    { label: 'Solved', value: stats.problems_solved_total || 0 },
                                    { label: 'Easy', value: stats.easy_solved || 0, color: 'text-green-400' },
                                    { label: 'Medium', value: stats.medium_solved || 0, color: 'text-yellow-400' },
                                    { label: 'Hard', value: stats.hard_solved || 0, color: 'text-red-400' },
                                ].map((s) => (
                                    <div key={s.label} className="bg-white/10 rounded-xl p-3 text-center backdrop-blur-sm">
                                        <p className={`text-xl font-bold ${s.color || 'text-white'}`}>{s.value}</p>
                                        <p className="text-[10px] text-slate-400 mt-0.5">{s.label}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Filters */}
                    <div className="px-6 py-4 bg-white border-b border-slate-200">
                        <div className="flex gap-2">
                            {['all', 'easy', 'medium', 'hard'].map(f => (
                                <button key={f} onClick={() => setFilter(f)}
                                    className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${filter === f ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                        }`}
                                >{f}</button>
                            ))}
                        </div>
                    </div>

                    {/* Problems list */}
                    <div className="px-4 md:px-6 py-6 max-w-4xl mx-auto space-y-2">
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="st-card p-4 animate-pulse">
                                    <div className="h-5 bg-slate-200 rounded w-2/3 mb-2" />
                                    <div className="h-4 bg-slate-100 rounded w-1/3" />
                                </div>
                            ))
                        ) : filtered.length === 0 ? (
                            <div className="text-center py-12">
                                <span className="text-4xl block mb-4">🏗️</span>
                                <p className="text-slate-500">No problems found. Try a different filter.</p>
                            </div>
                        ) : (
                            filtered.map((problem, i) => (
                                <motion.div key={problem.id || problem.slug || i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.04 }}
                                >
                                    <Link href={`/practice/${problem.slug}`} className="block st-card p-4 hover:shadow-lg group">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors text-sm truncate">
                                                        {problem.title}
                                                    </h3>
                                                    <span className={`text-[11px] px-2 py-0.5 rounded-md font-medium border ${difficultyColor(problem.difficulty)}`}>
                                                        {problem.difficulty}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3 text-xs text-slate-500">
                                                    {problem.category && <span>{problem.category}</span>}
                                                    {problem.company_tags?.length > 0 && (
                                                        <span className="text-indigo-500">{problem.company_tags.slice(0, 2).join(', ')}</span>
                                                    )}
                                                    {problem.acceptance_rate && <span>{problem.acceptance_rate}% acceptance</span>}
                                                </div>
                                            </div>
                                            <div className="text-slate-400 group-hover:text-indigo-500 transition-colors ml-3">→</div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))
                        )}
                    </div>
                </main>
                <BottomNav />
            </div>
        </div>
    );
}
