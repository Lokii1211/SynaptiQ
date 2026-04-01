'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';
import Link from 'next/link';

type BattleState = 'lobby' | 'matching' | 'battle' | 'result';
type Difficulty = 'easy' | 'medium' | 'hard';

interface BattleHistory {
    opponent: string; oppAvatar: string; result: 'win' | 'loss' | 'draw';
    problem: string; difficulty: Difficulty; yourTime: string; oppTime: string;
    date: string;
}

export default function BattlePage() {
    const { isReady } = useAuthGuard();
    const [battleState, setBattleState] = useState<BattleState>('lobby');
    const [difficulty, setDifficulty] = useState<Difficulty>('medium');
    const [timeLimit, setTimeLimit] = useState(15);
    const [topic, setTopic] = useState('random');
    const [matchTimer, setMatchTimer] = useState(0);
    const [battleTime, setBattleTime] = useState(0);
    const [myProgress, setMyProgress] = useState(0);
    const [oppProgress, setOppProgress] = useState(0);
    const [winner, setWinner] = useState<'you' | 'opponent' | 'draw' | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const [battleHistory, setBattleHistory] = useState<BattleHistory[]>([]);
    const [friendsOnline, setFriendsOnline] = useState<{ name: string; avatar: string; score: number; status: string; wins: number; losses: number }[]>([]);
    const [stats, setStats] = useState({ wins: 0, losses: 0, draws: 0, winRate: 0, elo: 1000 });

    useEffect(() => {
        if (!isReady) return;
        Promise.all([
            api.getBattleStats().catch(() => null),
            api.getBattleHistory(5).catch(() => ({ history: [] })),
            api.getFriendsOnline().catch(() => ({ friends: [] })),
        ]).then(([s, h, f]) => {
            if (s) setStats(s);
            setBattleHistory(h?.history || []);
            setFriendsOnline(f?.friends || []);
        });
    }, [isReady]);

    const startMatch = (mode: 'random' | 'friend') => {
        setBattleState('matching');
        setMatchTimer(0);
        setMyProgress(0);
        setOppProgress(0);
        setWinner(null);

        const matchInterval = setInterval(() => setMatchTimer(t => t + 1), 1000);

        setTimeout(() => {
            clearInterval(matchInterval);
            setBattleState('battle');
            setBattleTime(timeLimit * 60);

            const battleInterval = setInterval(() => {
                setBattleTime(t => {
                    if (t <= 0) { clearInterval(battleInterval); setBattleState('result'); setWinner('draw'); return 0; }
                    return t - 1;
                });
                // Simulate opponent progress; detect if opp finishes first
                setOppProgress(p => {
                    const next = Math.min(100, p + Math.random() * 2.5);
                    if (next >= 100 && p < 100) {
                        clearInterval(battleInterval);
                        setBattleState('result');
                        setWinner('opponent');
                    }
                    return next;
                });
            }, 1000);

            intervalRef.current = battleInterval;
        }, 3000 + Math.random() * 2000);
    };

    // FIX: use functional setState to read current oppProgress atomically
    const submitSolution = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setMyProgress(100);
        setOppProgress(prev => {
            setWinner(prev >= 100 ? 'draw' : 'you');
            return prev;
        });
        setBattleState('result');
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <TopBar />
            <main className="pb-24 md:pb-8">
                {/* Hero */}
                <div className="bg-gradient-to-br from-rose-600 via-orange-500 to-amber-500 text-white px-6 py-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4 blur-2xl" />
                    <div className="max-w-4xl mx-auto relative z-10">
                        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
                            <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full inline-block mb-2">⚔️ 1v1 BATTLE</span>
                            <h1 className="text-3xl font-bold st-font-heading">Peer Battle Arena</h1>
                            <p className="text-white/60 text-sm mt-1">Challenge friends. Race to solve. Prove yourself.</p>
                            <div className="flex items-center gap-4 mt-4">
                                <div className="bg-white/15 backdrop-blur rounded-xl px-4 py-2 text-center">
                                    <p className="text-xl font-bold">{stats.wins}W/{stats.losses}L</p>
                                    <p className="text-[10px] text-white/60 uppercase">Record</p>
                                </div>
                                <div className="bg-white/15 backdrop-blur rounded-xl px-4 py-2 text-center">
                                    <p className="text-xl font-bold">{stats.winRate}%</p>
                                    <p className="text-[10px] text-white/60 uppercase">Win Rate</p>
                                </div>
                                <div className="bg-white/15 backdrop-blur rounded-xl px-4 py-2 text-center">
                                    <p className="text-xl font-bold">{stats.elo}</p>
                                    <p className="text-[10px] text-white/60 uppercase">Rating</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                <div className="px-4 md:px-6 py-6 max-w-4xl mx-auto">
                    <AnimatePresence mode="wait">
                        {/* LOBBY */}
                        {battleState === 'lobby' && (
                            <motion.div key="lobby" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
                                {/* Battle Config */}
                                <div className="st-card p-5">
                                    <h3 className="font-bold text-sm text-slate-900 mb-4">⚙️ Configure Battle</h3>
                                    <div className="grid md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="text-[10px] text-slate-400 uppercase font-bold mb-1.5 block">Difficulty</label>
                                            <div className="flex gap-1.5">
                                                {(['easy', 'medium', 'hard'] as Difficulty[]).map(d => (
                                                    <button key={d} onClick={() => setDifficulty(d)}
                                                        className={`flex-1 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${difficulty === d
                                                            ? d === 'easy' ? 'bg-emerald-500 text-white' : d === 'medium' ? 'bg-amber-500 text-white' : 'bg-red-500 text-white'
                                                            : 'bg-slate-100 text-slate-600'}`}>{d}</button>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-slate-400 uppercase font-bold mb-1.5 block">Time Limit</label>
                                            <div className="flex gap-1.5">
                                                {[15, 30, 45].map(t => (
                                                    <button key={t} onClick={() => setTimeLimit(t)}
                                                        className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${timeLimit === t ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>{t} min</button>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-slate-400 uppercase font-bold mb-1.5 block">Topic</label>
                                            <select value={topic} onChange={e => setTopic(e.target.value)} className="st-input text-xs w-full">
                                                <option value="random">🎲 Random</option>
                                                <option value="arrays">Arrays & Strings</option>
                                                <option value="trees">Trees & Graphs</option>
                                                <option value="dp">Dynamic Programming</option>
                                                <option value="sorting">Sorting & Searching</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 mt-5">
                                        <button onClick={() => startMatch('random')}
                                            className="flex-1 py-3 bg-gradient-to-r from-rose-500 to-orange-500 text-white text-sm font-bold rounded-xl hover:shadow-lg hover:shadow-rose-500/30 transition-all">
                                            🎲 Random Match
                                        </button>
                                    </div>
                                </div>

                                {/* Online Friends */}
                                <div className="st-card p-5">
                                    <h3 className="font-bold text-sm text-slate-900 mb-3">👥 Friends Online</h3>
                                    <div className="space-y-2">
                                        {friendsOnline.length === 0 ? (
                                            <div className="text-center py-6">
                                                <span className="text-3xl block mb-2">👥</span>
                                                <p className="text-xs text-slate-500">No friends online yet. Add connections to challenge them!</p>
                                            </div>
                                        ) : friendsOnline.map((f, i) => (
                                            <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                                                <span className="text-xl">{f.avatar}</span>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-xs font-bold text-slate-900">{f.name}</p>
                                                        <span className={`w-2 h-2 rounded-full ${f.status === 'online' ? 'bg-emerald-400' : f.status === 'idle' ? 'bg-amber-400' : 'bg-red-400'}`} />
                                                        <span className="text-[10px] text-slate-400 capitalize">{f.status === 'in-battle' ? '⚔️ In battle' : f.status}</span>
                                                    </div>
                                                    <p className="text-[10px] text-slate-400">Score: {f.score} · H2H: {f.wins}W/{f.losses}L</p>
                                                </div>
                                                <button
                                                    disabled={f.status === 'in-battle'}
                                                    onClick={() => startMatch('friend')}
                                                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${f.status !== 'in-battle' ? 'bg-rose-500 text-white hover:bg-rose-600' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}>
                                                    ⚔️ Challenge
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* History */}
                                <div className="st-card p-5">
                                    <h3 className="font-bold text-sm text-slate-900 mb-3">📜 Recent Battles</h3>
                                    <div className="space-y-2">
                                        {battleHistory.length === 0 ? (
                                            <div className="text-center py-6">
                                                <span className="text-3xl block mb-2">⚔️</span>
                                                <p className="text-xs text-slate-500">No battles yet. Start a match to see your history!</p>
                                            </div>
                                        ) : battleHistory.map((h, i) => (
                                            <div key={i} className={`flex items-center gap-3 p-3 rounded-xl ${h.result === 'win' ? 'bg-emerald-50' : h.result === 'loss' ? 'bg-red-50' : 'bg-slate-50'}`}>
                                                <span className="text-xl">{h.result === 'win' ? '🏆' : h.result === 'loss' ? '💔' : '🤝'}</span>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-bold text-slate-900">vs {h.opponent}</p>
                                                    <p className="text-[10px] text-slate-400">{h.problem} · <span className={h.difficulty === 'easy' ? 'text-emerald-600' : h.difficulty === 'medium' ? 'text-amber-600' : 'text-red-600'}>{h.difficulty}</span></p>
                                                </div>
                                                <div className="text-right text-[10px]">
                                                    <p className="font-semibold text-slate-700">You: {h.yourTime} · Them: {h.oppTime}</p>
                                                    <p className="text-slate-400">{h.date}</p>
                                                </div>
                                                <span className={`text-xs font-bold px-2 py-0.5 rounded ${h.result === 'win' ? 'bg-emerald-100 text-emerald-700' : h.result === 'loss' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'}`}>
                                                    {h.result.toUpperCase()}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* MATCHING */}
                        {battleState === 'matching' && (
                            <motion.div key="matching" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                                className="flex flex-col items-center justify-center py-20">
                                <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                    className="w-20 h-20 rounded-full border-4 border-rose-500 border-t-transparent mb-6" />
                                <h2 className="text-xl font-bold text-slate-900 mb-2">Finding Opponent...</h2>
                                <p className="text-sm text-slate-500 mb-4">Matching by skill level · {difficulty} · {timeLimit} min</p>
                                <p className="text-3xl font-bold text-rose-500">{matchTimer}s</p>
                                <button onClick={() => setBattleState('lobby')} className="mt-6 px-4 py-2 bg-slate-200 text-slate-600 text-xs font-semibold rounded-xl hover:bg-slate-300 transition-colors">
                                    Cancel
                                </button>
                            </motion.div>
                        )}

                        {/* BATTLE */}
                        {battleState === 'battle' && (
                            <motion.div key="battle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                                {/* Battle Header */}
                                <div className="st-card p-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-lg font-bold">Y</div>
                                            <div>
                                                <p className="text-xs font-bold">You</p>
                                                <div className="w-24 bg-white/20 rounded-full h-2 mt-1">
                                                    <div className="h-2 rounded-full bg-emerald-500 transition-all" style={{ width: `${myProgress}%` }} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-center">
                                            <p className="text-2xl font-bold text-rose-400">{Math.floor(battleTime / 60)}:{String(battleTime % 60).padStart(2, '0')}</p>
                                            <p className="text-[10px] text-white/40 uppercase">Time Left</p>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="text-right">
                                                <p className="text-xs font-bold">Opponent</p>
                                                <div className="w-24 bg-white/20 rounded-full h-2 mt-1">
                                                    <div className="h-2 rounded-full bg-rose-500 transition-all" style={{ width: `${oppProgress}%` }} />
                                                </div>
                                            </div>
                                            <div className="w-10 h-10 bg-rose-500 rounded-full flex items-center justify-center text-lg">🧑‍💻</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Problem + Editor area */}
                                <div className="st-card p-5">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${difficulty === 'easy' ? 'bg-emerald-50 text-emerald-600' : difficulty === 'medium' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'}`}>{difficulty}</span>
                                        <h3 className="font-bold text-sm text-slate-900">Two Sum</h3>
                                    </div>
                                    <p className="text-xs text-slate-600 leading-relaxed mb-3">
                                        Given an array of integers <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-600">nums</code> and an integer <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-600">target</code>,
                                        return indices of the two numbers such that they add up to <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-600">target</code>.
                                    </p>
                                    <div className="bg-slate-900 rounded-xl p-4 text-sm font-mono text-emerald-400 mb-4 min-h-[200px]">
                                        <p className="text-slate-500">{'# Write your solution here'}</p>
                                        <p>def twoSum(nums, target):</p>
                                        <p className="text-slate-600">{'    # Your code...'}</p>
                                        <p className="animate-pulse text-white">|</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Link href="/practice/two-sum" className="flex-1 py-3 bg-indigo-600 text-white text-sm font-bold rounded-xl text-center hover:bg-indigo-700 transition-colors">
                                            Open in Full IDE →
                                        </Link>
                                        <button onClick={submitSolution} className="px-6 py-3 bg-emerald-600 text-white text-sm font-bold rounded-xl hover:bg-emerald-700 transition-colors">
                                            ✓ Submit
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* RESULT */}
                        {battleState === 'result' && (
                            <motion.div key="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                                className="flex flex-col items-center py-12">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: [0, 1.3, 1] }}
                                    transition={{ duration: 0.6 }}
                                    className="text-6xl mb-4"
                                >
                                    {winner === 'you' ? '🏆' : winner === 'opponent' ? '💔' : '🤝'}
                                </motion.div>
                                <h2 className="text-2xl font-bold text-slate-900 mb-1">
                                    {winner === 'you' ? 'Victory!' : winner === 'opponent' ? 'Defeat' : 'Draw!'}
                                </h2>
                                <p className="text-sm text-slate-500 mb-6">
                                    {winner === 'you' ? 'You solved it first! 🎉' : winner === 'opponent' ? 'They were faster this time.' : 'Neither solved in time.'}
                                </p>

                                <div className="st-card p-5 w-full max-w-sm">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold">Y</div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-900">You</p>
                                                <p className={`text-[10px] font-bold ${winner === 'you' ? 'text-emerald-600' : 'text-red-500'}`}>{winner === 'you' ? 'WINNER' : winner === 'draw' ? 'DRAW' : 'LOST'}</p>
                                            </div>
                                        </div>
                                        <span className="text-2xl font-bold text-slate-300">VS</span>
                                        <div className="flex items-center gap-2">
                                            <div className="text-right">
                                                <p className="text-xs font-bold text-slate-900">Opponent</p>
                                                <p className={`text-[10px] font-bold ${winner === 'opponent' ? 'text-emerald-600' : 'text-red-500'}`}>{winner === 'opponent' ? 'WINNER' : winner === 'draw' ? 'DRAW' : 'LOST'}</p>
                                            </div>
                                            <div className="w-10 h-10 bg-rose-500 rounded-full flex items-center justify-center text-lg">🧑‍💻</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-3">
                                        <span>Rating: {winner === 'you' ? '+15' : winner === 'draw' ? '+0' : '-12'} Elo</span>
                                        <span>New: {winner === 'you' ? 1015 : winner === 'draw' ? 1000 : 988}</span>
                                    </div>
                                </div>

                                <div className="flex gap-3 mt-6">
                                    <button onClick={() => { setBattleState('matching'); startMatch('random'); }}
                                        className="px-6 py-3 bg-rose-500 text-white text-sm font-bold rounded-xl hover:bg-rose-600 transition-colors">
                                        🔄 Rematch
                                    </button>
                                    <button onClick={() => setBattleState('lobby')}
                                        className="px-6 py-3 bg-slate-100 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-200 transition-colors">
                                        Back to Lobby
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
            <BottomNav />
        </div>
    );
}
