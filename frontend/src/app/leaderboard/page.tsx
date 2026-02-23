'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { api, auth } from '@/lib/api';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';
import { SideNav } from '@/components/layout/SideNav';

export default function LeaderboardPage() {
    const [leaderboard, setLeaderboard] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState<'overall' | 'coding' | 'college'>('overall');

    useEffect(() => {
        if (!auth.isLoggedIn()) { window.location.href = '/login'; return; }
        fetchLeaderboard();
    }, [tab]);

    const fetchLeaderboard = async () => {
        setLoading(true);
        try {
            const data = await api.getMe();
            // Mock leaderboard until backend endpoint exists
            setLeaderboard([
                { rank: 1, display_name: 'Priya Sharma', username: 'priya_dev', score: 920, college: 'IIT Bombay', problems_solved: 180 },
                { rank: 2, display_name: 'Arjun Patel', username: 'arjun_p', score: 885, college: 'NIT Trichy', problems_solved: 165 },
                { rank: 3, display_name: 'Sneha Roy', username: 'sneha_codes', score: 860, college: 'BITS Pilani', problems_solved: 155 },
                { rank: 4, display_name: data?.display_name || 'You', username: data?.username || 'you', score: data?.skillten_score || 750, college: data?.college_name || 'Your College', problems_solved: 0, isYou: true },
                { rank: 5, display_name: 'Rahul Kumar', username: 'rahul_k', score: 720, college: 'VIT Vellore', problems_solved: 120 },
            ]);
        } catch {
            setLeaderboard([]);
        }
        setLoading(false);
    };

    const getMedalEmoji = (rank: number) => {
        if (rank === 1) return '🥇';
        if (rank === 2) return '🥈';
        if (rank === 3) return '🥉';
        return `#${rank}`;
    };

    return (
        <div className="flex min-h-screen bg-slate-50">
            <SideNav />
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1 pb-24 md:pb-8">
                    <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white px-6 py-8">
                        <h1 className="text-2xl font-bold mb-2">🏆 Leaderboard</h1>
                        <p className="text-white/80 text-sm">See how you rank against students across India</p>
                        <div className="flex gap-2 mt-4">
                            {(['overall', 'coding', 'college'] as const).map(t => (
                                <button key={t} onClick={() => setTab(t)}
                                    className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${tab === t ? 'bg-white text-amber-700' : 'bg-white/20 text-white'
                                        }`}
                                >{t}</button>
                            ))}
                        </div>
                    </div>

                    <div className="px-4 md:px-6 py-6 max-w-3xl mx-auto">
                        {loading ? (
                            <div className="space-y-3">
                                {[1, 2, 3, 4, 5].map(i => <div key={i} className="st-card p-4 animate-pulse h-16" />)}
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {leaderboard.map((user, i) => (
                                    <motion.div key={user.username}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.08 }}
                                        className={`st-card p-4 flex items-center gap-4 ${user.isYou ? 'ring-2 ring-indigo-500 bg-indigo-50' : ''}`}
                                    >
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold ${user.rank <= 3 ? 'bg-amber-100' : 'bg-slate-100'
                                            }`}>
                                            {getMedalEmoji(user.rank)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="font-semibold text-slate-900 text-sm">{user.display_name}</p>
                                                {user.isYou && <span className="text-[10px] bg-indigo-600 text-white px-1.5 py-0.5 rounded-full font-medium">YOU</span>}
                                            </div>
                                            <p className="text-xs text-slate-500">{user.college}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-indigo-600">{user.score}</p>
                                            <p className="text-[10px] text-slate-400">score</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </main>
                <BottomNav />
            </div>
        </div>
    );
}
