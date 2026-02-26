'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { api, auth } from '@/lib/api';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';
import { SideNav } from '@/components/layout/SideNav';
import Link from 'next/link';

interface Peer {
    id: string;
    display_name: string;
    username: string;
    college: string;
    target_role: string;
    score: number;
    streak: number;
    match_pct: number;
    connected: boolean;
}

const SUGGESTED_PEERS: Peer[] = [
    { id: '1', display_name: 'Priya Sharma', username: 'priya_dev', college: 'IIT Bombay', target_role: 'SDE at Google', score: 920, streak: 45, match_pct: 94, connected: false },
    { id: '2', display_name: 'Arjun Patel', username: 'arjun_p', college: 'NIT Trichy', target_role: 'Data Scientist', score: 885, streak: 32, match_pct: 87, connected: false },
    { id: '3', display_name: 'Sneha Roy', username: 'sneha_codes', college: 'BITS Pilani', target_role: 'Product Manager', score: 860, streak: 28, match_pct: 82, connected: true },
    { id: '4', display_name: 'Vikram Desai', username: 'vikram_d', college: 'NIT Warangal', target_role: 'SDE at Microsoft', score: 830, streak: 21, match_pct: 79, connected: false },
    { id: '5', display_name: 'Anjali Gupta', username: 'anjali_g', college: 'VIT Vellore', target_role: 'Frontend Developer', score: 810, streak: 19, match_pct: 76, connected: true },
    { id: '6', display_name: 'Rahul Kumar', username: 'rahul_k', college: 'SRM Chennai', target_role: 'DevOps Engineer', score: 790, streak: 15, match_pct: 71, connected: false },
    { id: '7', display_name: 'Deepika Nair', username: 'deepika_n', college: 'IIIT Hyderabad', target_role: 'AI/ML Engineer', score: 775, streak: 25, match_pct: 68, connected: false },
    { id: '8', display_name: 'Karthik Iyer', username: 'karthik_i', college: 'NIT Karnataka', target_role: 'Backend Developer', score: 760, streak: 14, match_pct: 65, connected: true },
];

export default function NetworkPage() {
    const [tab, setTab] = useState<'suggested' | 'connected' | 'college'>('suggested');
    const [peers, setPeers] = useState<Peer[]>(SUGGESTED_PEERS);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (!auth.isLoggedIn()) { window.location.href = '/login'; return; }
        // Try real API, fallback to mock
        Promise.all([
            api.findPeers().catch(() => ({ peers: [] })),
            api.getConnections().catch(() => ({ connections: [] })),
        ]).then(([p, c]) => {
            const real = (p.peers || []).length > 0 ? p.peers : SUGGESTED_PEERS;
            setPeers(real);
            setLoading(false);
        });
    }, []);

    const toggleConnect = (id: string) => {
        setPeers(prev => prev.map(p => p.id === id ? { ...p, connected: !p.connected } : p));
    };

    const connectedCount = peers.filter(p => p.connected).length;

    const filtered = peers.filter(p => {
        const matchesTab = tab === 'suggested' ? !p.connected :
            tab === 'connected' ? p.connected :
                true; // college tab shows all
        const matchesSearch = !searchQuery ||
            p.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.college.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.target_role.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

    return (
        <div className="flex min-h-screen bg-slate-50">
            <SideNav />
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1 pb-24 md:pb-8">
                    {/* Hero */}
                    <div className="bg-gradient-to-br from-blue-500 via-indigo-500 to-violet-600 text-white px-6 py-10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
                        <div className="max-w-3xl mx-auto relative z-10">
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                                <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full mb-3 inline-block">🤝 NETWORK</span>
                                <h1 className="text-3xl font-bold mb-2">Your Career Network</h1>
                                <p className="text-white/60 text-sm mb-4">Connect with students sharing similar career goals and interests</p>
                                <div className="flex items-center gap-4">
                                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-5 py-3 text-center">
                                        <p className="text-2xl font-bold">{connectedCount}</p>
                                        <p className="text-[10px] text-white/60 uppercase font-semibold">Connected</p>
                                    </div>
                                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-5 py-3 text-center">
                                        <p className="text-2xl font-bold">{peers.filter(p => !p.connected).length}</p>
                                        <p className="text-[10px] text-white/60 uppercase font-semibold">Suggested</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    <div className="px-4 md:px-6 py-6 max-w-3xl mx-auto">
                        {/* Search */}
                        <div className="relative mb-4">
                            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                                placeholder="Search by name, college, or role..."
                                className="st-input pl-10" />
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
                        </div>

                        {/* Tabs */}
                        <div className="flex gap-2 mb-5">
                            {([
                                { key: 'suggested' as const, label: '✨ Suggested', count: peers.filter(p => !p.connected).length },
                                { key: 'connected' as const, label: '🤝 Connected', count: connectedCount },
                                { key: 'college' as const, label: '🏫 My College', count: peers.length },
                            ]).map(t => (
                                <button key={t.key} onClick={() => setTab(t.key)}
                                    className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${tab === t.key
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                                        : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-200'
                                        }`}>
                                    {t.label}
                                    <span className={`text-[10px] px-1 py-0.5 rounded ${tab === t.key ? 'bg-white/20' : 'bg-slate-100'}`}>{t.count}</span>
                                </button>
                            ))}
                        </div>

                        {/* Peer cards */}
                        {loading ? (
                            <div className="space-y-3">
                                {[1, 2, 3, 4].map(i => <div key={i} className="st-card p-5 animate-pulse h-24" />)}
                            </div>
                        ) : filtered.length === 0 ? (
                            <div className="text-center py-12">
                                <span className="text-5xl block mb-4">🤝</span>
                                <p className="text-slate-900 font-semibold mb-1">
                                    {tab === 'connected' ? 'No connections yet' : 'No peers found'}
                                </p>
                                <p className="text-sm text-slate-500">
                                    {tab === 'connected' ? 'Connect with suggested peers to grow your network' : 'Try a different search'}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {filtered.map((peer, i) => (
                                    <motion.div key={peer.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.04 }}
                                        className="st-card p-5 hover:shadow-md transition-all"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg shrink-0">
                                                {peer.display_name[0]}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-0.5">
                                                    <Link href={`/u/${peer.username}`} className="font-bold text-sm text-slate-900 hover:text-indigo-600 transition-colors">
                                                        {peer.display_name}
                                                    </Link>
                                                    {peer.streak >= 30 && <span className="text-xs" title={`${peer.streak}-day streak`}>🔥</span>}
                                                    <span className="text-[9px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded font-bold">{peer.match_pct}% match</span>
                                                </div>
                                                <p className="text-xs text-slate-500">{peer.college} · {peer.target_role}</p>
                                                <div className="flex items-center gap-3 mt-1.5">
                                                    <span className="text-[10px] text-slate-400">Score: <strong className="text-indigo-600">{peer.score}</strong></span>
                                                    <span className="text-[10px] text-slate-400">Streak: <strong className="text-orange-500">{peer.streak}d</strong></span>
                                                </div>
                                            </div>
                                            <button onClick={() => toggleConnect(peer.id)}
                                                className={`shrink-0 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${peer.connected
                                                    ? 'bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-600'
                                                    : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-200'
                                                    }`}>
                                                {peer.connected ? '✓ Connected' : '+ Connect'}
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        {/* CTA */}
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                            className="mt-8 st-card p-6 text-center bg-gradient-to-br from-indigo-50 to-violet-50 border-indigo-100">
                            <span className="text-3xl block mb-2">👥</span>
                            <h3 className="font-bold text-slate-900 mb-1">Find Similar Peers</h3>
                            <p className="text-sm text-slate-500 mb-3">Our AI matches you with students with similar profiles and goals</p>
                            <Link href="/people-like-you" className="st-btn-primary text-xs px-5 py-2">Find More Peers →</Link>
                        </motion.div>
                    </div>
                </main>
                <BottomNav />
            </div>
        </div>
    );
}
