'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { api, auth } from '@/lib/api';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';
import { SideNav } from '@/components/layout/SideNav';

export default function NetworkPage() {
    const [connections, setConnections] = useState<any[]>([]);
    const [peers, setPeers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState<'peers' | 'connections'>('peers');

    useEffect(() => {
        if (!auth.isLoggedIn()) { window.location.href = '/login'; return; }
        Promise.all([
            api.findPeers().catch(() => ({ peers: [] })),
            api.getConnections().catch(() => ({ connections: [] })),
        ]).then(([p, c]) => {
            setPeers(p.peers || []);
            setConnections(c.connections || []);
            setLoading(false);
        });
    }, []);

    return (
        <div className="flex min-h-screen bg-slate-50">
            <SideNav />
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1 pb-24 md:pb-8">
                    <div className="bg-white border-b border-slate-200 px-6 py-6">
                        <h1 className="text-2xl font-bold text-slate-900 mb-2">🤝 Network</h1>
                        <p className="text-slate-500 text-sm">Connect with peers sharing similar career goals</p>
                        <div className="flex gap-2 mt-4">
                            {(['peers', 'connections'] as const).map(t => (
                                <button key={t} onClick={() => setTab(t)}
                                    className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${tab === t ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                                        }`}
                                >{t}</button>
                            ))}
                        </div>
                    </div>
                    <div className="px-4 md:px-6 py-6 max-w-4xl mx-auto space-y-3">
                        {loading ? (
                            [1, 2, 3].map(i => <div key={i} className="st-card p-5 animate-pulse h-20" />)
                        ) : (
                            (tab === 'peers' ? peers : connections).length === 0 ? (
                                <div className="text-center py-12 st-card">
                                    <span className="text-4xl block mb-3">🤝</span>
                                    <p className="text-slate-500">{tab === 'peers' ? 'No peers found yet' : 'No connections yet'}</p>
                                </div>
                            ) : (
                                (tab === 'peers' ? peers : connections).map((p: any, i: number) => (
                                    <motion.div key={p.user_id || i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="st-card p-4 flex items-center gap-4"
                                    >
                                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                            {(p.display_name || p.username || '?')[0].toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-slate-900 text-sm">{p.display_name || p.username}</p>
                                            <p className="text-xs text-slate-500 truncate">
                                                {p.college_name && `${p.college_name} • `}{p.target_role || 'Student'}
                                            </p>
                                        </div>
                                        {p.skillten_score > 0 && (
                                            <span className="text-sm font-bold text-indigo-600">{p.skillten_score}</span>
                                        )}
                                    </motion.div>
                                ))
                            )
                        )}
                    </div>
                </main>
                <BottomNav />
            </div>
        </div>
    );
}
