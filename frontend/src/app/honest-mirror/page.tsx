'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth } from '@/lib/api';
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

const MOCK_PROFILE = {
    name: 'Arjun Kumar',
    college: 'SKCT, Coimbatore',
    branch: 'CSE',
    year: 2026,
    cgpa: 7.2,
    skilltenScore: 68,
    streak: 23,
    problemsSolved: 87,
    skills: { python: 74, java: 0, sql: 61, dsa: 55, aptitude: 71 },
    careerTarget: 'Data Analyst',
    dreamCompany: 'Product Company (Flipkart/Zomato)',
};

const READINESS: ReadinessData[] = [
    { company: 'TCS', probability: 78, strengths: ['Aptitude 71st %ile (cutoff: 65th) ✓', 'CGPA 7.2 (cutoff: 6.0) ✓', 'Python verified ✓'], gaps: ['Only 87 problems solved (target: 100+)', 'Java not verified (TCS tests Java)', 'No mock interview practice'], nextAction: 'Verify Java + solve 15 more TCS-pattern problems', timeline: '2 weeks to ready' },
    { company: 'Infosys', probability: 65, strengths: ['Python verified ✓', 'Aptitude above InfyTQ cutoff ✓'], gaps: ['DSA score 55 (need 65+ for InfyTQ)', 'SQL not strong enough for Infosys SP role', 'No DBMS fundamentals prep'], nextAction: 'Improve DSA to 65+ and verify SQL', timeline: '4 weeks to ready' },
    { company: 'Wipro', probability: 82, strengths: ['All basic criteria met ✓', 'Aptitude strong ✓', 'CGPA above cutoff ✓'], gaps: ['Communication skills not assessed', 'Essay writing section (Wipro specific)'], nextAction: 'Practice 3 essay topics + mock HR round', timeline: '1 week to ready' },
    { company: 'Amazon SDE-1', probability: 12, strengths: ['Python verified ✓', 'Problem-solving attitude ✓'], gaps: ['Need 300+ Medium/Hard problems (you have 87)', 'System Design knowledge missing', 'No Data Structures mastery', 'DSA at 55th %ile (need 90th for FAANG)'], nextAction: 'This is a 6-month goal, not 1-month. Start with LeetCode 150 plan.', timeline: '6+ months of dedicated prep' },
    { company: 'Zoho', probability: 45, strengths: ['Good logical thinking ✓', 'CGPA acceptable ✓'], gaps: ['Zoho requires C programming (you haven\'t practiced)', 'System design basics needed', 'Need puzzle/brain teaser prep'], nextAction: 'Learn C basics + solve 20 Zoho-pattern problems', timeline: '6 weeks to ready' },
];

export default function HonestMirrorPage() {
    const [profile] = useState(MOCK_PROFILE);
    const [readiness] = useState(READINESS);
    const [selectedCompany, setSelectedCompany] = useState<ReadinessData | null>(null);
    const [showOfferEval, setShowOfferEval] = useState(false);
    const [offerCtc, setOfferCtc] = useState('');
    const [offerCompany, setOfferCompany] = useState('');

    useEffect(() => {
        if (!auth.isLoggedIn()) { window.location.href = '/login'; return; }
    }, []);

    const getScoreColor = (score: number) => score >= 75 ? 'text-emerald-600' : score >= 50 ? 'text-amber-600' : 'text-red-600';
    const getProbColor = (prob: number) => prob >= 70 ? 'from-emerald-500 to-teal-500' : prob >= 40 ? 'from-amber-500 to-orange-500' : 'from-red-500 to-rose-500';
    const getProbBg = (prob: number) => prob >= 70 ? 'bg-emerald-50' : prob >= 40 ? 'bg-amber-50' : 'bg-red-50';

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
                                    <p className={`text-2xl font-bold ${getScoreColor(profile.skilltenScore)}`}>{profile.skilltenScore}</p>
                                    <p className="text-[10px] text-slate-400 uppercase font-semibold">SkillTen Score</p>
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
                                <p>📊 <strong>Coding:</strong> You solved 8 problems this week (last week: 12). Momentum is dropping.</p>
                                <p>🧠 <strong>Aptitude:</strong> Your accuracy is 71% — OK for TCS/Wipro, risky for Infosys.</p>
                                <p>✅ <strong>Skills:</strong> Python verified (74th %ile). Java NOT verified (critical for service companies).</p>
                                <p>📄 <strong>Resume:</strong> Last updated 34 days ago. Add your recent project.</p>
                                <p className="font-bold text-amber-800 mt-2">💡 At current pace: TCS-ready in 3 weeks. Infosys-ready in 6 weeks. Wipro-ready NOW.</p>
                            </div>
                        </div>

                        {/* Company Readiness Cards */}
                        <div>
                            <h3 className="font-bold text-sm text-slate-900 mb-3">🎯 Company Placement Probability</h3>
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
                                <strong className="text-white">Arjun</strong>, your SkillTen Score of <strong className="text-indigo-400">68</strong> puts you in the{' '}
                                <strong className="text-amber-400">service company zone</strong>. TCS and Wipro are realistic targets.
                                Infosys is achievable with 4 more weeks of focused prep. Product companies like Flipkart
                                need <strong className="text-red-400">6+ months</strong> of dedicated DSA practice.{' '}
                                <strong className="text-emerald-400">Your honest path</strong>: Secure a service company offer first,
                                then prepare for product companies while working. This is the realistic, proven strategy
                                for students from Tier-3 colleges.
                            </p>
                        </div>
                    </div>
                </main>
                <BottomNav />
            </div>
        </div>
    );
}
