'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { api, auth } from '@/lib/api';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';

export default function PeopleLikeYouPage() {
    const [peers, setPeers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!auth.isLoggedIn()) { window.location.href = '/login'; return; }
        api.findPeers().then(data => {
            setPeers(data.peers || []);
            setLoading(false);
        }).catch(() => {
            // fallback mock data for demo
            setPeers([
                { display_name: 'Ananya K.', college: 'NIT Warangal', archetype: 'Analytical Builder', target_role: 'SDE', score: 720, match: 92 },
                { display_name: 'Rohit M.', college: 'VIT Vellore', archetype: 'Creative Thinker', target_role: 'Product Manager', score: 680, match: 87 },
                { display_name: 'Priyanka S.', college: 'BITS Pilani', archetype: 'Technical Lead', target_role: 'Data Scientist', score: 810, match: 85 },
                { display_name: 'Vikash T.', college: 'KIIT Bhubaneswar', archetype: 'Analytical Builder', target_role: 'Backend Dev', score: 620, match: 80 },
            ]);
            setLoading(false);
        });
    }, []);

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1 pb-24 md:pb-8">
                    <div className="bg-gradient-to-br from-purple-600 to-pink-600 text-white px-6 py-8">
                        <h1 className="text-2xl font-bold mb-2">👥 People Like You</h1>
                        <p className="text-white/80 text-sm">Students with similar career profiles and interests</p>
                    </div>

                    <div className="px-4 md:px-6 py-6 max-w-3xl mx-auto space-y-3">
                        {loading ? (
                            [1, 2, 3, 4].map(i => <div key={i} className="st-card p-5 animate-pulse h-24" />)
                        ) : peers.length === 0 ? (
                            <div className="text-center py-16 st-card">
                                <span className="text-5xl block mb-4">👥</span>
                                <p className="text-slate-500">Take the assessment first to find similar peers</p>
                            </div>
                        ) : (
                            peers.map((peer, i) => (
                                <motion.div key={i}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="st-card p-5 flex items-center gap-4"
                                >
                                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white text-lg font-bold">
                                        {peer.display_name?.[0]}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-slate-900 text-sm">{peer.display_name}</p>
                                        <p className="text-xs text-slate-500">{peer.college} • {peer.target_role}</p>
                                        {peer.archetype && <p className="text-xs text-indigo-500 mt-0.5">🧬 {peer.archetype}</p>}
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="text-sm font-bold text-indigo-600">{peer.match || peer.score}%</p>
                                        <p className="text-[10px] text-slate-400">match</p>
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
