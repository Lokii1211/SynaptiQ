'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { api, auth } from '@/lib/api';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';
import { SideNav } from '@/components/layout/SideNav';

export default function ChallengesPage() {
    const [challenges, setChallenges] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!auth.isLoggedIn()) { window.location.href = '/login'; return; }
        api.getChallenges().then(data => {
            setChallenges(data.challenges || []);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    return (
        <div className="flex min-h-screen bg-slate-50">
            <SideNav />
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1 pb-24 md:pb-8">
                    <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white px-6 py-8">
                        <h1 className="text-2xl font-bold mb-2">🏆 Challenges</h1>
                        <p className="text-white/80 text-sm">Company-sponsored coding contests and skill challenges</p>
                    </div>

                    <div className="px-4 md:px-6 py-6 max-w-4xl mx-auto space-y-4">
                        {loading ? (
                            [1, 2, 3].map(i => <div key={i} className="st-card p-6 animate-pulse h-32" />)
                        ) : challenges.length === 0 ? (
                            <div className="text-center py-12 st-card">
                                <span className="text-4xl block mb-3">🏆</span>
                                <p className="text-slate-500 mb-2">No active challenges right now</p>
                                <p className="text-xs text-slate-400">Check back soon for new contests!</p>
                            </div>
                        ) : (
                            challenges.map((ch, i) => (
                                <motion.div key={ch.id || i}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.08 }}
                                    className="st-card p-6 hover:shadow-lg"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h3 className="font-bold text-lg text-slate-900">{ch.title}</h3>
                                            <p className="text-sm text-slate-500 mt-1">{ch.description}</p>
                                        </div>
                                        <span className={`text-xs font-semibold px-2 py-1 rounded-md shrink-0 ${ch.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-500'
                                            }`}>{ch.status || 'Active'}</span>
                                    </div>
                                    <div className="flex gap-4 text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100">
                                        {ch.prize_pool && <span>🏅 Prize: {ch.prize_pool}</span>}
                                        {ch.difficulty && <span>📊 {ch.difficulty}</span>}
                                        {ch.participants_count !== undefined && <span>👥 {ch.participants_count} participants</span>}
                                    </div>
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
