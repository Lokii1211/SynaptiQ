'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { api, auth } from '@/lib/api';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';

export default function SkillMarketPage() {
    const [insights, setInsights] = useState<any>(null);
    const [trending, setTrending] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!auth.isLoggedIn()) { window.location.href = '/login'; return; }
        Promise.all([
            api.getMarketInsights().catch(() => null),
            api.getTrendingSkills().catch(() => ({ skills: [] })),
        ]).then(([ins, ts]) => {
            setInsights(ins);
            setTrending(ts?.skills || []);
            setLoading(false);
        });
    }, []);

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1 pb-24 md:pb-8">
                    <div className="bg-white border-b border-slate-200 px-6 py-6">
                        <h1 className="text-2xl font-bold text-slate-900 mb-2">📊 Skill Market</h1>
                        <p className="text-slate-500 text-sm">Real-time market trends and skill demand data</p>
                    </div>

                    <div className="px-4 md:px-6 py-6 max-w-4xl mx-auto space-y-6">
                        {/* Trending */}
                        <section>
                            <h2 className="st-section-title mb-4">🔥 Trending Skills</h2>
                            <div className="flex flex-wrap gap-2">
                                {loading ? (
                                    [1, 2, 3, 4, 5].map(i => <div key={i} className="h-8 w-24 bg-slate-200 rounded-lg animate-pulse" />)
                                ) : trending.length === 0 ? (
                                    <p className="text-slate-400 text-sm">No trending skills data available</p>
                                ) : (
                                    trending.map((skill: any, i: number) => (
                                        <motion.span key={i}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 cursor-pointer transition-all"
                                        >
                                            {skill.name || skill} {skill.growth && <span className="text-green-600 text-xs ml-1">↑{skill.growth}%</span>}
                                        </motion.span>
                                    ))
                                )}
                            </div>
                        </section>

                        {/* Market insights */}
                        {insights && (
                            <section>
                                <h2 className="st-section-title mb-4">Market Overview</h2>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {Object.entries(insights.summary || {}).map(([key, val]: [string, any], i) => (
                                        <div key={key} className="st-card p-5">
                                            <p className="text-xs text-slate-500 uppercase">{key.replace(/_/g, ' ')}</p>
                                            <p className="text-xl font-bold text-slate-900 mt-1">{typeof val === 'number' ? val.toLocaleString() : String(val)}</p>
                                        </div>
                                    ))}
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
