'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth, api } from '@/lib/api';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';
import Link from 'next/link';

interface ReadinessData {
    company: string;
    probability: number;
    strengths: string[];
    gaps: string[];
    nextAction: string;
    timeline: string;
}

interface UserProfile {
    name: string;
    college: string;
    branch: string;
    year: number;
    cgpa: number;
    mentixyScore: number;
    streak: number;
    problemsSolved: number;
    skills: Record<string, number>;
    careerTarget: string;
    dreamCompany: string;
}

export default function HonestMirrorPage() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [readiness, setReadiness] = useState<ReadinessData[]>([]); // TODO: compute from user profile via API
    const [selectedCompany, setSelectedCompany] = useState<ReadinessData | null>(null);
    const [showOfferEval, setShowOfferEval] = useState(false);
    const [offerCtc, setOfferCtc] = useState('');
    const [offerCompany, setOfferCompany] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const user = auth.getUser();
            let streakData: any = {};
            let codingStats: any = {};
            try { streakData = await api.getStreak(); } catch {}
            try { codingStats = await api.getCodingStats(); } catch {}
            
            setProfile({
                name: user?.profile?.display_name || user?.display_name || 'Student',
                college: user?.profile?.college_name || 'Not set',
                branch: user?.profile?.stream || 'CSE',
                year: user?.profile?.graduation_year || 2026,
                cgpa: user?.profile?.cgpa || 0,
                mentixyScore: user?.profile?.mentixy_score ?? 0,
                streak: streakData?.current_streak ?? 0,
                problemsSolved: codingStats?.total_solved ?? 0,
                skills: {},
                careerTarget: user?.profile?.target_role || 'Not set',
                dreamCompany: 'Product Company',
            });
        } catch (err) {
            // Still show page with basic data from local storage
            const user = auth.getUser();
            if (user) {
                setProfile({
                    name: user?.profile?.display_name || user?.display_name || 'Student',
                    college: user?.profile?.college_name || 'Not set',
                    branch: user?.profile?.stream || 'CSE',
                    year: user?.profile?.graduation_year || 2026,
                    cgpa: user?.profile?.cgpa || 0,
                    mentixyScore: user?.profile?.mentixy_score ?? 0,
                    streak: 0, problemsSolved: 0, skills: {},
                    careerTarget: user?.profile?.target_role || 'Not set',
                    dreamCompany: 'Product Company',
                });
            } else {
                setError('Failed to load profile. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const getScoreColor = (score: number) => score >= 75 ? 'text-emerald-600' : score >= 50 ? 'text-amber-600' : 'text-red-600';
    const getProbColor = (prob: number) => prob >= 70 ? 'from-emerald-500 to-teal-500' : prob >= 40 ? 'from-amber-500 to-orange-500' : 'from-red-500 to-rose-500';
    const getProbBg = (prob: number) => prob >= 70 ? 'bg-emerald-50' : prob >= 40 ? 'bg-amber-50' : 'bg-red-50';

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50">
                <TopBar />
                <div className="px-4 py-12 max-w-4xl mx-auto space-y-4">
                    {[1,2,3].map(i => (
                        <div key={i} className="bg-white rounded-2xl p-6 shadow-sm animate-pulse">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-slate-200 rounded-2xl" />
                                <div className="flex-1 space-y-2"><div className="h-4 bg-slate-200 rounded w-1/3" /><div className="h-3 bg-slate-100 rounded w-1/2" /></div>
                            </div>
                            <div className="space-y-2">{[1,2,3].map(j => <div key={j} className="h-3 bg-slate-100 rounded w-full" />)}</div>
                        </div>
                    ))}
                </div>
                <BottomNav />
            </div>
        );
    }

    if (error && !profile) {
        return (
            <div className="min-h-screen bg-slate-50">
                <TopBar />
                <div className="px-4 py-20 max-w-lg mx-auto text-center">
                    <div className="text-5xl mb-4">⚠️</div>
                    <h2 className="text-lg font-bold text-slate-900 mb-2">Something went wrong</h2>
                    <p className="text-sm text-slate-500 mb-6">{error}</p>
                    <button onClick={fetchProfile} className="px-6 py-3 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors">Try Again</button>
                </div>
                <BottomNav />
            </div>
        );
    }

    if (!profile) return null;

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1 pb-24 md:pb-8">
                    {/* Hero */}
                    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white px-6 py-10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-600/20 to-violet-600/20 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl" />
                        <div className="max-w-4xl mx-auto relative z-10">
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                                <span className="text-xs font-semibold bg-white/10 px-3 py-1 rounded-full mb-3 inline-block border border-white/10">🪞 HONEST MIRROR</span>
                                <h1 className="text-3xl font-bold mb-2 st-font-heading">Your Honest Career Mirror</h1>
                                <p className="text-white/50 text-sm mb-4">No sugar-coating. Real probabilities. Actionable truth. Your placement reality check.</p>
                            </motion.div>
                        </div>
                    </div>

                    <div className="px-4 md:px-6 py-6 max-w-4xl mx-auto space-y-6">
                        {/* Current Profile Summary */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            className="st-card p-5 bg-gradient-to-br from-slate-50 to-slate-100">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg">
                                    {profile.name[0]}
                                </div>
                                <div>
                                    <h2 className="font-bold text-slate-900">{profile.name}</h2>
                                    <p className="text-xs text-slate-500">{profile.branch} · {profile.college} · Class of {profile.year}</p>
                                </div>
                                <div className="ml-auto text-right">
                                    <p className={`text-2xl font-bold ${getScoreColor(profile.mentixyScore)}`}>{profile.mentixyScore}</p>
                                    <p className="text-[10px] text-slate-400 uppercase font-semibold">Mentixy Score</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-4 gap-2">
                                {[
                                    { label: 'CGPA', value: profile.cgpa.toString(), color: profile.cgpa >= 7 ? 'text-emerald-600' : 'text-amber-600' },
                                    { label: 'Streak', value: `${profile.streak}d`, color: 'text-orange-500' },
                                    { label: 'Problems', value: profile.problemsSolved.toString(), color: 'text-indigo-600' },
                                    { label: 'Target', value: profile.careerTarget, color: 'text-violet-600' },
                                ].map(s => (
                                    <div key={s.label} className="bg-white rounded-xl p-2 text-center">
                                        <p className={`text-sm font-bold ${s.color}`}>{s.value}</p>
                                        <p className="text-[9px] text-slate-400 uppercase">{s.label}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Skill bars */}
                            <div className="mt-4 space-y-1.5">
                                {Object.entries(profile.skills).map(([skill, score]) => (
                                    <div key={skill} className="flex items-center gap-2">
                                        <span className="text-[10px] text-slate-500 w-16 capitalize">{skill}</span>
                                        <div className="flex-1 bg-slate-200 rounded-full h-2">
                                            <div className={`h-2 rounded-full transition-all ${score >= 70 ? 'bg-emerald-500' : score >= 40 ? 'bg-amber-500' : score > 0 ? 'bg-red-400' : 'bg-slate-300'}`}
                                                style={{ width: `${score}%` }} />
                                        </div>
                                        <span className={`text-[10px] font-bold w-8 text-right ${score > 0 ? getScoreColor(score) : 'text-slate-300'}`}>
                                            {score > 0 ? `${score}%` : '—'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Honest Preparation Status */}
                        <div className="st-card p-5 border-l-4 border-amber-400 bg-amber-50/50">
                            <p className="text-xs font-bold text-amber-700 uppercase mb-2">⚠️ Honest Weekly Check-In</p>
                            <div className="space-y-2 text-xs text-slate-700 leading-relaxed">
                                <p>📊 <strong>Coding:</strong> {profile.problemsSolved} problems solved total. {profile.problemsSolved < 100 ? 'Target: 100+ for service companies.' : 'Good progress!'}</p>
                                <p>🔥 <strong>Streak:</strong> {profile.streak > 0 ? `${profile.streak}-day streak active.` : 'No active streak. Start solving daily!'}</p>
                                <p>🎯 <strong>Target:</strong> {profile.careerTarget !== 'Not set' ? profile.careerTarget : 'Set your career target in Settings.'}</p>
                                <p>📈 <strong>Score:</strong> Mentixy Score is {profile.mentixyScore}. {profile.mentixyScore >= 70 ? 'Good range for service companies.' : profile.mentixyScore > 0 ? 'Keep improving through daily practice.' : 'Complete your assessment to get scored.'}</p>
                            </div>
                        </div>

                        {/* Company Readiness Cards */}
                        <div>
                            <h3 className="font-bold text-sm text-slate-900 mb-3">🎯 Company Placement Probability</h3>
                            {readiness.length > 0 ? (
                                <div className="grid md:grid-cols-2 gap-3">
                                    {readiness.map((r, i) => (
                                        <motion.div key={r.company}
                                            initial={{ opacity: 0, y: 15 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.08 }}
                                            className={`st-card p-4 cursor-pointer hover:shadow-lg transition-all ${getProbBg(r.probability)}`}
                                            onClick={() => setSelectedCompany(r)}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="font-bold text-sm text-slate-900">{r.company}</h4>
                                                <span className={`text-lg font-bold bg-gradient-to-r ${getProbColor(r.probability)} bg-clip-text text-transparent`}>
                                                    {r.probability}%
                                                </span>
                                            </div>
                                            <div className="w-full bg-white/60 rounded-full h-2 mb-2">
                                                <div className={`h-2 rounded-full bg-gradient-to-r ${getProbColor(r.probability)}`}
                                                    style={{ width: `${r.probability}%` }} />
                                            </div>
                                            <p className="text-[10px] text-slate-500">{r.timeline} · {r.gaps.length} gaps to close</p>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="st-card p-8 text-center">
                                    <p className="text-3xl mb-3">🎯</p>
                                    <p className="text-sm font-semibold text-slate-900 mb-1">Your readiness analysis is being prepared</p>
                                    <p className="text-xs text-slate-500 mb-4">Complete your assessment and solve problems to see company-specific placement probabilities</p>
                                    <Link href="/assessment" className="text-xs font-semibold text-indigo-600 hover:underline">Take Assessment →</Link>
                                </div>
                            )}
                        </div>

                        {/* Company Detail Modal */}
                        <AnimatePresence>
                            {selectedCompany && (
                                <>
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={() => setSelectedCompany(null)} />
                                    <motion.div
                                        initial={{ opacity: 0, y: 40, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 30, scale: 0.95 }}
                                        className="fixed inset-x-4 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 top-[10%] max-w-lg w-full bg-white rounded-2xl shadow-2xl z-50 overflow-hidden max-h-[80vh] overflow-y-auto"
                                    >
                                        <div className={`h-2 bg-gradient-to-r ${getProbColor(selectedCompany.probability)}`} />
                                        <div className="p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <div>
                                                    <h2 className="text-lg font-bold text-slate-900">{selectedCompany.company}</h2>
                                                    <p className="text-xs text-slate-500">{selectedCompany.timeline}</p>
                                                </div>
                                                <div className="text-center">
                                                    <p className={`text-3xl font-bold bg-gradient-to-r ${getProbColor(selectedCompany.probability)} bg-clip-text text-transparent`}>
                                                        {selectedCompany.probability}%
                                                    </p>
                                                    <p className="text-[10px] text-slate-400">Probability</p>
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <div className="bg-emerald-50 rounded-xl p-3">
                                                    <p className="text-[10px] text-emerald-700 font-bold uppercase mb-1.5">✅ Your Strengths</p>
                                                    {selectedCompany.strengths.map((s, i) => (
                                                        <p key={i} className="text-xs text-emerald-800 py-0.5">• {s}</p>
                                                    ))}
                                                </div>

                                                <div className="bg-red-50 rounded-xl p-3">
                                                    <p className="text-[10px] text-red-700 font-bold uppercase mb-1.5">❌ Gaps to Close</p>
                                                    {selectedCompany.gaps.map((g, i) => (
                                                        <p key={i} className="text-xs text-red-800 py-0.5">• {g}</p>
                                                    ))}
                                                </div>

                                                <div className="bg-indigo-50 rounded-xl p-3">
                                                    <p className="text-[10px] text-indigo-700 font-bold uppercase mb-1.5">🎯 Next Action</p>
                                                    <p className="text-xs text-indigo-800 font-medium">{selectedCompany.nextAction}</p>
                                                </div>
                                            </div>

                                            <div className="flex gap-2 mt-4">
                                                <Link href="/problems" className="flex-1 py-2.5 bg-indigo-600 text-white text-xs font-semibold rounded-xl text-center hover:bg-indigo-700 transition-colors">
                                                    Start {selectedCompany.company} Prep →
                                                </Link>
                                                <Link href="/interview-experiences" className="px-4 py-2.5 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-200 transition-colors">
                                                    📝 Read Experiences
                                                </Link>
                                                <button onClick={() => setSelectedCompany(null)} className="px-3 py-2.5 bg-slate-100 text-slate-600 text-xs font-semibold rounded-xl">✕</button>
                                            </div>
                                        </div>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>

                        {/* Offer Evaluation */}
                        <div className="st-card p-5">
                            <button onClick={() => setShowOfferEval(!showOfferEval)}
                                className="w-full flex items-center justify-between">
                                <h3 className="font-bold text-sm text-slate-900">💼 Offer Evaluation Tool</h3>
                                <span className="text-slate-400">{showOfferEval ? '▲' : '▼'}</span>
                            </button>
                            <AnimatePresence>
                                {showOfferEval && (
                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden mt-4 space-y-3">
                                        <p className="text-xs text-slate-500">Enter an offer to get an honest evaluation based on your profile.</p>
                                        <div className="grid grid-cols-2 gap-3">
                                            <input type="text" placeholder="Company Name" value={offerCompany} onChange={e => setOfferCompany(e.target.value)} className="st-input text-sm" />
                                            <input type="text" placeholder="CTC (e.g. 4.5 LPA)" value={offerCtc} onChange={e => setOfferCtc(e.target.value)} className="st-input text-sm" />
                                        </div>
                                        <Link href="/salary-truth" className="block w-full py-2.5 bg-emerald-600 text-white text-xs font-semibold rounded-xl text-center hover:bg-emerald-700 transition-colors">
                                            Calculate Real In-Hand → Salary Truth
                                        </Link>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Bottom Truth */}
                        <div className="bg-slate-900 text-white rounded-2xl p-5">
                            <p className="text-xs text-slate-400 font-semibold uppercase mb-2">🪞 The Mirror Speaks</p>
                            <p className="text-sm leading-relaxed text-slate-300">
                                <strong className="text-white">{profile.name.split(' ')[0]}</strong>, your Mentixy Score of <strong className="text-indigo-400">{profile.mentixyScore}</strong>{' '}
                                {profile.mentixyScore >= 80 ? (
                                    <>puts you in a <strong className="text-emerald-400">strong position</strong>. Product companies are within reach with continued effort.</>
                                ) : profile.mentixyScore >= 50 ? (
                                    <>puts you in the <strong className="text-amber-400">service company zone</strong>. TCS and Wipro are realistic targets. Keep building your score for product companies.</>
                                ) : (
                                    <>is just the starting point. <strong className="text-amber-400">Focus on daily practice</strong> — aptitude, coding, and skill verification will boost your score rapidly.</>
                                )}
                            </p>
                        </div>
                    </div>
                </main>
                <BottomNav />
            </div>
        </div>
    );
}
