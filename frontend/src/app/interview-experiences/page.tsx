'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';
import Link from 'next/link';

interface InterviewExp {
    id: string;
    company: string;
    role: string;
    city: string;
    date: string;
    collegeTier: string;
    cgpa: string;
    prepTime: string;
    outcome: 'selected' | 'rejected' | 'waitlisted';
    ctc?: string;
    mentixyScore?: number;
    rounds: { type: string; duration: string; questions: string[]; difficulty: string; performance: string }[];
    tips: string;
    author: { name: string; college: string; avatar: string };
    helpful: number;
    verified: boolean;
}


const COMPANIES = ['All', 'TCS', 'Infosys', 'Wipro', 'Amazon', 'Google', 'Flipkart', 'Zoho', 'Microsoft', 'Cognizant'];
const OUTCOMES = ['All Outcomes', 'Selected', 'Rejected'];

export default function InterviewExperiencesPage() {
    const [experiences] = useState<InterviewExp[]>([]); // TODO: Fetch from community API
    const [companyFilter, setCompanyFilter] = useState('All');
    const [outcomeFilter, setOutcomeFilter] = useState('All Outcomes');
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [showSubmitForm, setShowSubmitForm] = useState(false);

    const filtered = experiences.filter(e =>
        (companyFilter === 'All' || e.company === companyFilter) &&
        (outcomeFilter === 'All Outcomes' || e.outcome === outcomeFilter.toLowerCase())
    );

    const outcomeStyle = (o: string) => o === 'selected' ? { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', label: '✅ Selected' } :
        o === 'rejected' ? { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', label: '❌ Rejected' } :
            { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', label: '⏳ Waitlisted' };

    const perfIcon = (p: string) => p === 'confident' ? '💪' : p === 'struggled' ? '😰' : '😶';

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1 pb-24 md:pb-8">
                    {/* Hero */}
                    <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-700 text-white px-6 py-10 relative overflow-hidden">
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
                        <div className="max-w-4xl mx-auto relative z-10">
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                                <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full mb-3 inline-block">📝 INTERVIEW EXPERIENCES</span>
                                <h1 className="text-3xl font-bold mb-2 st-font-heading">Interview Experiences</h1>
                                <p className="text-white/60 text-sm mb-4">Verified accounts from real students. Round-by-round. Honest. Linked to practice.</p>
                                <div className="flex items-center gap-3">
                                    <div className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2 text-center">
                                        <p className="text-xl font-bold">{experiences.length}</p>
                                        <p className="text-[10px] text-white/60 uppercase font-semibold">Experiences</p>
                                    </div>
                                    <div className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2 text-center">
                                        <p className="text-xl font-bold">{experiences.filter(e => e.verified).length}</p>
                                        <p className="text-[10px] text-white/60 uppercase font-semibold">Verified</p>
                                    </div>
                                    <button onClick={() => setShowSubmitForm(!showSubmitForm)}
                                        className="ml-auto bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl text-xs font-semibold transition-colors backdrop-blur-sm">
                                        ✍️ Share Your Experience
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    <div className="px-4 md:px-6 py-6 max-w-4xl mx-auto">
                        {/* Filters */}
                        <div className="flex flex-wrap gap-2 mb-5">
                            <div className="flex gap-1 overflow-x-auto no-scrollbar flex-1">
                                {COMPANIES.map(c => (
                                    <button key={c} onClick={() => setCompanyFilter(c)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${companyFilter === c ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}>{c}
                                    </button>
                                ))}
                            </div>
                            <select value={outcomeFilter} onChange={e => setOutcomeFilter(e.target.value)}
                                className="st-input text-xs w-36">
                                {OUTCOMES.map(o => <option key={o} value={o}>{o}</option>)}
                            </select>
                        </div>

                        {/* Experience Cards */}
                        <div className="space-y-4">
                            {filtered.map((exp, i) => {
                                const os = outcomeStyle(exp.outcome);
                                const isExpanded = expandedId === exp.id;
                                return (
                                    <motion.div key={exp.id}
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="st-card overflow-hidden"
                                    >
                                        {/* Header */}
                                        <div className="p-5 cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : exp.id)}>
                                            <div className="flex items-start gap-3">
                                                <span className="text-2xl">{exp.author.avatar}</span>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 flex-wrap mb-1">
                                                        <h3 className="font-bold text-sm text-slate-900">{exp.company} — {exp.role}</h3>
                                                        <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold border ${os.bg} ${os.text} ${os.border}`}>{os.label}</span>
                                                        {exp.verified && <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-600 font-bold">✓ Verified</span>}
                                                    </div>
                                                    <div className="flex items-center gap-3 text-[10px] text-slate-400 flex-wrap">
                                                        <span>📍 {exp.city}</span>
                                                        <span>📅 {exp.date}</span>
                                                        <span>🎓 {exp.collegeTier}</span>
                                                        <span>📊 CGPA: {exp.cgpa}</span>
                                                        <span>⏱️ Prep: {exp.prepTime}</span>
                                                        {exp.ctc && <span className="font-bold text-emerald-600">💰 {exp.ctc}</span>}
                                                        {exp.mentixyScore && <span className="font-bold text-indigo-600">⭐ Mentixy: {exp.mentixyScore}</span>}
                                                    </div>
                                                    <p className="text-xs text-slate-500 mt-1">By {exp.author.name} · {exp.author.college}</p>
                                                </div>
                                                <div className="flex items-center gap-1 text-xs text-slate-400">
                                                    <span>👍 {exp.helpful}</span>
                                                    <span className="ml-2">{isExpanded ? '▲' : '▼'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Expanded Content */}
                                        <AnimatePresence>
                                            {isExpanded && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="px-5 pb-5 border-t border-slate-100 pt-4 space-y-3">
                                                        {/* Rounds */}
                                                        {exp.rounds.map((round, ri) => (
                                                            <div key={ri} className="bg-slate-50 rounded-xl p-4">
                                                                <div className="flex items-center justify-between mb-2">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold">{ri + 1}</span>
                                                                        <p className="font-semibold text-sm text-slate-900">{round.type}</p>
                                                                    </div>
                                                                    <div className="flex items-center gap-2 text-[10px]">
                                                                        <span className="text-slate-400">⏱️ {round.duration}</span>
                                                                        <span className={`px-1.5 py-0.5 rounded font-bold ${round.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-600' : round.difficulty === 'Medium' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'}`}>{round.difficulty}</span>
                                                                        <span>{perfIcon(round.performance)} {round.performance}</span>
                                                                    </div>
                                                                </div>
                                                                <ul className="space-y-1">
                                                                    {round.questions.map((q, qi) => (
                                                                        <li key={qi} className="text-xs text-slate-600 flex items-start gap-1.5">
                                                                            <span className="text-slate-400 mt-0.5">•</span>
                                                                            <span>{q}</span>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        ))}

                                                        {/* Tips */}
                                                        <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                                                            <p className="text-[10px] text-amber-700 font-bold uppercase mb-1">💡 Tips from {exp.author.name}</p>
                                                            <p className="text-xs text-amber-800 leading-relaxed">{exp.tips}</p>
                                                        </div>

                                                        {/* Actions */}
                                                        <div className="flex items-center gap-2 pt-2">
                                                            <button className="px-3 py-1.5 bg-indigo-50 text-indigo-600 text-xs font-semibold rounded-lg hover:bg-indigo-100 transition-colors">
                                                                👍 Helpful ({exp.helpful})
                                                            </button>
                                                            <button className="px-3 py-1.5 bg-slate-50 text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-100 transition-colors">
                                                                🔗 Share
                                                            </button>
                                                            <Link href="/problems" className="px-3 py-1.5 bg-violet-50 text-violet-600 text-xs font-semibold rounded-lg hover:bg-violet-100 transition-colors">
                                                                📚 Practice Similar Problems
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {filtered.length === 0 && (
                            <div className="text-center py-16">
                                <span className="text-4xl block mb-3">📝</span>
                                <p className="font-semibold text-slate-900 mb-1">No experiences found</p>
                                <p className="text-sm text-slate-500">Try a different filter or be the first to share!</p>
                            </div>
                        )}
                    </div>
                </main>
                <BottomNav />
            </div>
        </div>
    );
}
