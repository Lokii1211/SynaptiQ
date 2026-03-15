'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth } from '@/lib/api';
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

const MOCK_EXPERIENCES: InterviewExp[] = [
    {
        id: '1', company: 'TCS', role: 'System Engineer', city: 'Chennai', date: 'Jan 2026',
        collegeTier: 'Tier-3', cgpa: '7.2 – 8.0', prepTime: '4 weeks',
        outcome: 'selected', ctc: '3.6 LPA', mentixyScore: 68,
        rounds: [
            { type: 'Online Test (NQT)', duration: '180 min', questions: ['Aptitude (Quant, LR, VA) — 60 questions', 'Coding — 1 Easy problem (Two Sum variant)', 'Email Writing section'], difficulty: 'Easy-Medium', performance: 'confident' },
            { type: 'Technical Interview', duration: '25 min', questions: ['Tell me about yourself', 'What is OOP? Explain 4 pillars with examples', 'Difference between ArrayList and LinkedList', 'Write a program to reverse a string'], difficulty: 'Easy', performance: 'confident' },
            { type: 'HR Interview', duration: '15 min', questions: ['Why TCS?', 'Are you willing to relocate?', 'Where do you see yourself in 5 years?', 'Expected salary?'], difficulty: 'Easy', performance: 'confident' },
        ],
        tips: 'Focus on NQT aptitude — it is the main filter. Coding was basic, just know arrays and strings. For HR, research TCS values and mention them.',
        author: { name: 'Sneha R.', college: 'SKCT, Coimbatore', avatar: '👩‍💻' }, helpful: 234, verified: true,
    },
    {
        id: '2', company: 'Infosys', role: 'Systems Engineer', city: 'Mysore', date: 'Dec 2025',
        collegeTier: 'Tier-2', cgpa: '8.0 – 9.0', prepTime: '3 weeks',
        outcome: 'selected', ctc: '3.6 LPA', mentixyScore: 72,
        rounds: [
            { type: 'Online Test (InfyTQ)', duration: '120 min', questions: ['MCQ on Java/Python basics — 20 questions', 'Hands-on coding — 2 problems (String manipulation, Array sorting)', 'Pseudo-code reading — 5 questions'], difficulty: 'Medium', performance: 'struggled' },
            { type: 'Technical + HR', duration: '30 min', questions: ['Explain your final year project', 'What is normalization in DBMS?', 'Difference between TCP and UDP', 'Why Infosys over TCS?'], difficulty: 'Medium', performance: 'confident' },
        ],
        tips: 'InfyTQ coding is harder than TCS NQT. Practice Medium-level problems. They ask DBMS and Networks theory — don\'t skip CS fundamentals.',
        author: { name: 'Arjun K.', college: 'PSG Tech, Coimbatore', avatar: '👨‍💻' }, helpful: 189, verified: true,
    },
    {
        id: '3', company: 'Wipro', role: 'Project Engineer', city: 'Bangalore', date: 'Nov 2025',
        collegeTier: 'Tier-3', cgpa: '6.0 – 7.0', prepTime: '2 weeks',
        outcome: 'selected', ctc: '3.5 LPA',
        rounds: [
            { type: 'Online Assessment', duration: '90 min', questions: ['Aptitude — 20 MCQs (Time & Work, Percentages, Probability)', 'Written Communication — Essay on "AI in Education"', 'Coding — 2 Easy problems'], difficulty: 'Easy', performance: 'confident' },
            { type: 'Technical Interview', duration: '20 min', questions: ['What are data types in Java?', 'Explain inheritance with example', 'What is SQL join?', 'What project did you do?'], difficulty: 'Easy', performance: 'confident' },
            { type: 'HR Interview', duration: '10 min', questions: ['Bond period — are you okay with 1 year?', 'Relocation preference', 'Any backlogs?'], difficulty: 'Easy', performance: 'confident' },
        ],
        tips: 'Wipro is the easiest service company to crack. Focus on aptitude basics and know your project well. Bond period is 1 year, ₹75K penalty.',
        author: { name: 'Priya M.', college: 'KCT, Coimbatore', avatar: '👩' }, helpful: 312, verified: true,
    },
    {
        id: '4', company: 'Amazon', role: 'SDE-1', city: 'Hyderabad', date: 'Oct 2025',
        collegeTier: 'Tier-1 (NIT)', cgpa: '8.0 – 9.0', prepTime: '3 months',
        outcome: 'rejected', mentixyScore: 81,
        rounds: [
            { type: 'Online Assessment', duration: '120 min', questions: ['2 Medium-Hard coding problems (Graph BFS, Dynamic Programming)', 'Work simulation assessment — 7 scenarios'], difficulty: 'Hard', performance: 'confident' },
            { type: 'Technical Round 1', duration: '60 min', questions: ['Design a LRU Cache', 'Merge K Sorted Lists (optimal solution required)', 'Time and space complexity analysis'], difficulty: 'Hard', performance: 'struggled' },
            { type: 'Technical Round 2', duration: '60 min', questions: ['System Design: Design URL Shortener', 'Behavioral: Tell me about a time you disagreed with a team member (LP: Have Backbone)', 'Implement Trie from scratch'], difficulty: 'Hard', performance: 'blanked' },
        ],
        tips: 'Amazon expects OPTIMAL solutions, not just correct ones. I got stuck on System Design — start preparing early. Leadership Principles are real — prepare 5 STAR stories.',
        author: { name: 'Vikram S.', college: 'NIT Trichy', avatar: '🧑‍💻' }, helpful: 456, verified: true,
    },
    {
        id: '5', company: 'Zoho', role: 'Member Technical Staff', city: 'Chennai', date: 'Sep 2025',
        collegeTier: 'Tier-2', cgpa: '7.2 – 8.0', prepTime: '6 weeks',
        outcome: 'selected', ctc: '6.0 LPA',
        rounds: [
            { type: 'Round 1 - C Programming', duration: '90 min', questions: ['10 C output prediction questions', '5 pointer-based problems', '2 coding problems (string reversal, matrix rotation)'], difficulty: 'Medium', performance: 'confident' },
            { type: 'Round 2 - Advanced Programming', duration: '120 min', questions: ['Implement a simple file system in C', 'Design a library management system (class design)', 'Database schema design for e-commerce'], difficulty: 'Hard', performance: 'struggled' },
            { type: 'Round 3 - HR + Technical', duration: '45 min', questions: ['Deep dive into projects', 'Why not higher studies?', 'Design a parking lot system (OOP)', 'Puzzle: 8 balls problem'], difficulty: 'Medium', performance: 'confident' },
        ],
        tips: 'Zoho loves C programming. If you only know Python/Java, you\'ll struggle. They test system design thinking even for freshers. Prepare puzzles — they ask 1-2 brain teasers.',
        author: { name: 'Rahul D.', college: 'CEG Anna University', avatar: '👨‍🎓' }, helpful: 278, verified: true,
    },
];

const COMPANIES = ['All', 'TCS', 'Infosys', 'Wipro', 'Amazon', 'Google', 'Flipkart', 'Zoho', 'Microsoft', 'Cognizant'];
const OUTCOMES = ['All Outcomes', 'Selected', 'Rejected'];

export default function InterviewExperiencesPage() {
    const [experiences] = useState<InterviewExp[]>(MOCK_EXPERIENCES);
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
