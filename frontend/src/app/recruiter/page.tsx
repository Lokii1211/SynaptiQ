'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const MOCK_CANDIDATES = [
    { id: '1', name: 'Arjun Sharma', username: 'arjunsharma', college: 'VIT Vellore', tier: 2, stream: 'CSE', cgpa: 8.2, score: 812, archetype: 'Analytical Builder', skills: ['Python', 'React', 'ML', 'SQL'], streak: 45, problemsSolved: 128, match: 94, avatar: '👨‍💻', status: 'open', verified: ['Python', 'React'] },
    { id: '2', name: 'Priya Patel', username: 'priyap', college: 'BITS Pilani', tier: 1, stream: 'IT', cgpa: 8.7, score: 875, archetype: 'Creative Strategist', skills: ['Java', 'Spring Boot', 'AWS', 'Docker'], streak: 67, problemsSolved: 203, match: 91, avatar: '👩‍💻', status: 'open', verified: ['Java', 'AWS'] },
    { id: '3', name: 'Rahul Kumar', username: 'rahulk', college: 'NIT Trichy', tier: 1, stream: 'CSE', cgpa: 7.9, score: 756, archetype: 'Systematic Analyst', skills: ['C++', 'DSA', 'System Design', 'Go'], streak: 30, problemsSolved: 312, match: 88, avatar: '👨‍🎓', status: 'open', verified: ['C++', 'DSA'] },
    { id: '4', name: 'Sneha Reddy', username: 'snehar', college: 'IIIT Hyderabad', tier: 1, stream: 'CSE', cgpa: 9.1, score: 923, archetype: 'Innovation Driver', skills: ['Python', 'TensorFlow', 'NLP', 'Research'], streak: 89, problemsSolved: 89, match: 95, avatar: '👩‍🔬', status: 'open', verified: ['Python', 'TensorFlow', 'NLP'] },
    { id: '5', name: 'Karthik Iyer', username: 'karthiki', college: 'SRM Chennai', tier: 2, stream: 'ECE', cgpa: 7.5, score: 698, archetype: 'Practical Engineer', skills: ['Embedded C', 'IoT', 'Python', 'VHDL'], streak: 22, problemsSolved: 67, match: 79, avatar: '👨‍🔧', status: 'interviewing', verified: ['Embedded C'] },
    { id: '6', name: 'Ananya Gupta', username: 'ananyag', college: 'DTU Delhi', tier: 1, stream: 'IT', cgpa: 8.4, score: 841, archetype: 'Full-Stack Generalist', skills: ['React', 'Node.js', 'MongoDB', 'TypeScript'], streak: 55, problemsSolved: 176, match: 90, avatar: '👩‍💼', status: 'open', verified: ['React', 'Node.js', 'TypeScript'] },
    { id: '7', name: 'Vikram Singh', username: 'vikrams', college: 'LNMIIT Jaipur', tier: 2, stream: 'CSE', cgpa: 7.8, score: 729, archetype: 'Backend Specialist', skills: ['Java', 'Microservices', 'Kafka', 'PostgreSQL'], streak: 38, problemsSolved: 145, match: 85, avatar: '👨‍💻', status: 'open', verified: ['Java', 'PostgreSQL'] },
    { id: '8', name: 'Divya Nair', username: 'divyan', college: 'CBIT Hyderabad', tier: 3, stream: 'CSE', cgpa: 8.0, score: 781, archetype: 'Data Storyteller', skills: ['Python', 'Pandas', 'Tableau', 'SQL'], streak: 41, problemsSolved: 92, match: 87, avatar: '👩‍📊', status: 'open', verified: ['Python', 'SQL', 'Tableau'] },
];

const FILTER_SKILLS = ['Python', 'React', 'Java', 'ML', 'C++', 'Node.js', 'AWS', 'Docker', 'TypeScript', 'SQL', 'Go', 'TensorFlow'];

export default function RecruiterPortalPage() {
    const [search, setSearch] = useState('');
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const [minScore, setMinScore] = useState(0);
    const [tierFilter, setTierFilter] = useState<number | null>(null);
    const [selectedCandidate, setSelectedCandidate] = useState<typeof MOCK_CANDIDATES[0] | null>(null);
    const [shortlist, setShortlist] = useState<Set<string>>(new Set());
    const [activeTab, setActiveTab] = useState<'search' | 'shortlist' | 'analytics'>('search');

    const toggleSkill = (skill: string) =>
        setSelectedSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]);

    const toggleShortlist = (id: string) =>
        setShortlist(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

    const filtered = MOCK_CANDIDATES.filter(c => {
        if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.college.toLowerCase().includes(search.toLowerCase())) return false;
        if (selectedSkills.length && !selectedSkills.some(s => c.skills.includes(s))) return false;
        if (minScore && c.score < minScore) return false;
        if (tierFilter && c.tier !== tierFilter) return false;
        return true;
    });

    const shortlisted = MOCK_CANDIDATES.filter(c => shortlist.has(c.id));

    const scoreColor = (s: number) => s >= 850 ? 'text-emerald-600 bg-emerald-50' : s >= 700 ? 'text-indigo-600 bg-indigo-50' : s >= 500 ? 'text-amber-600 bg-amber-50' : 'text-slate-500 bg-slate-50';

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">ST</div>
                            <span className="text-xl font-bold text-slate-900">Skill<span className="text-indigo-600">Ten</span></span>
                        </Link>
                        <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full font-semibold">Recruiter Portal</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-500">{filtered.length} candidates</span>
                        <button className="text-xs bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
                            Post a Job
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-6">
                {/* Tabs */}
                <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm border border-slate-100 mb-6 w-fit">
                    {(['search', 'shortlist', 'analytics'] as const).map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)}
                            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all capitalize ${activeTab === tab ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}>
                            {tab === 'shortlist' ? `Shortlist (${shortlist.size})` : tab}
                        </button>
                    ))}
                </div>

                {activeTab === 'search' && (
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Filters sidebar */}
                        <div className="lg:col-span-1 space-y-4">
                            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                                <h3 className="font-bold text-slate-900 text-sm mb-3">🔍 Search</h3>
                                <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                                    placeholder="Name, college..." className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
                            </div>

                            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                                <h3 className="font-bold text-slate-900 text-sm mb-3">💻 Skills</h3>
                                <div className="flex flex-wrap gap-1.5">
                                    {FILTER_SKILLS.map(s => (
                                        <button key={s} onClick={() => toggleSkill(s)}
                                            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${selectedSkills.includes(s) ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                                <h3 className="font-bold text-slate-900 text-sm mb-3">📊 Min Score</h3>
                                <input type="range" min={0} max={1000} step={50} value={minScore}
                                    onChange={e => setMinScore(+e.target.value)}
                                    className="w-full accent-indigo-600" />
                                <p className="text-xs text-slate-500 mt-1">{minScore > 0 ? `Score ≥ ${minScore}` : 'No minimum'}</p>
                            </div>

                            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                                <h3 className="font-bold text-slate-900 text-sm mb-3">🏫 College Tier</h3>
                                <div className="flex gap-2">
                                    {[null, 1, 2, 3].map(t => (
                                        <button key={t ?? 'all'} onClick={() => setTierFilter(t)}
                                            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${tierFilter === t ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                                            {t ? `T${t}` : 'All'}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Results */}
                        <div className="lg:col-span-3 space-y-3">
                            {filtered.length === 0 ? (
                                <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-slate-100">
                                    <span className="text-4xl block mb-3">🔍</span>
                                    <p className="font-semibold text-slate-900">No candidates match</p>
                                    <p className="text-sm text-slate-500 mt-1">Try adjusting your filters</p>
                                </div>
                            ) : filtered.map((c, i) => (
                                <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-all cursor-pointer"
                                    onClick={() => setSelectedCandidate(c)}>
                                    <div className="flex items-start gap-4">
                                        <span className="text-3xl">{c.avatar}</span>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <h3 className="font-bold text-slate-900">{c.name}</h3>
                                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${scoreColor(c.score)}`}>{c.score}</span>
                                                {c.status === 'open' && <span className="text-[10px] bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded-full font-semibold">Open to work</span>}
                                            </div>
                                            <p className="text-xs text-slate-500">{c.college} · {c.stream} · CGPA {c.cgpa} · T{c.tier}</p>
                                            <p className="text-xs text-violet-600 font-medium mt-0.5">🧬 {c.archetype}</p>
                                            <div className="flex flex-wrap gap-1.5 mt-2">
                                                {c.skills.map(s => (
                                                    <span key={s} className={`px-2 py-0.5 rounded text-[10px] font-semibold ${c.verified.includes(s) ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'}`}>
                                                        {c.verified.includes(s) && '✓ '}{s}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <p className="text-2xl font-bold text-indigo-600">{c.match}%</p>
                                            <p className="text-[10px] text-slate-400">match</p>
                                            <div className="flex gap-1.5 mt-2">
                                                <button onClick={e => { e.stopPropagation(); toggleShortlist(c.id); }}
                                                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${shortlist.has(c.id) ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                                                    {shortlist.has(c.id) ? '⭐ Saved' : '☆ Save'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 mt-3 pt-3 border-t border-slate-50 text-xs text-slate-400">
                                        <span>🔥 {c.streak} day streak</span>
                                        <span>💻 {c.problemsSolved} problems solved</span>
                                        <span>✅ {c.verified.length} verified skills</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'shortlist' && (
                    <div className="space-y-3">
                        {shortlisted.length === 0 ? (
                            <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-slate-100">
                                <span className="text-4xl block mb-3">📋</span>
                                <p className="font-semibold text-slate-900">No candidates shortlisted</p>
                                <p className="text-sm text-slate-500 mt-1">Save candidates from the Search tab</p>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center justify-between mb-2">
                                    <h2 className="font-bold text-slate-900">{shortlisted.length} Shortlisted Candidates</h2>
                                    <button className="text-xs bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700">
                                        📧 Contact All
                                    </button>
                                </div>
                                {shortlisted.map(c => (
                                    <div key={c.id} className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 flex items-center gap-4">
                                        <span className="text-2xl">{c.avatar}</span>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-slate-900 text-sm">{c.name}</h3>
                                            <p className="text-xs text-slate-500">{c.college} · {c.stream} · Score {c.score}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg font-semibold">View Profile</button>
                                            <button className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg font-semibold">📧 Contact</button>
                                            <button onClick={() => toggleShortlist(c.id)} className="text-xs bg-red-50 text-red-600 px-3 py-1.5 rounded-lg font-semibold">Remove</button>
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                )}

                {activeTab === 'analytics' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[
                            { label: 'Total Candidates', value: '12,435', icon: '👥', change: '+340 this week', color: 'bg-indigo-50 text-indigo-600' },
                            { label: 'Avg Mentixy Score', value: '724', icon: '📊', change: '+12 vs last month', color: 'bg-emerald-50 text-emerald-600' },
                            { label: 'Verified Skills', value: '38,920', icon: '✅', change: '+2,100 this month', color: 'bg-violet-50 text-violet-600' },
                            { label: 'Colleges Covered', value: '450+', icon: '🏫', change: '22 states', color: 'bg-amber-50 text-amber-600' },
                            { label: 'Avg Response Rate', value: '78%', icon: '📧', change: '4x vs LinkedIn', color: 'bg-cyan-50 text-cyan-600' },
                            { label: 'Hires Made', value: '1,280', icon: '🎯', change: '92% placed within 30 days', color: 'bg-rose-50 text-rose-600' },
                        ].map((stat, i) => (
                            <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.08 }}
                                className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${stat.color}`}>{stat.icon}</span>
                                    <span className="text-xs font-semibold text-slate-500">{stat.label}</span>
                                </div>
                                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                                <p className="text-xs text-slate-400 mt-1">{stat.change}</p>
                            </motion.div>
                        ))}

                        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 md:col-span-2 lg:col-span-3">
                            <h3 className="font-bold text-slate-900 text-sm mb-4">🎯 Top Skills in Demand</h3>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                {[
                                    { skill: 'Python', demand: 94 },
                                    { skill: 'React', demand: 88 },
                                    { skill: 'Java', demand: 82 },
                                    { skill: 'AWS', demand: 76 },
                                    { skill: 'ML/AI', demand: 71 },
                                    { skill: 'SQL', demand: 69 },
                                    { skill: 'Docker', demand: 65 },
                                    { skill: 'TypeScript', demand: 61 },
                                    { skill: 'Go', demand: 55 },
                                    { skill: 'Kubernetes', demand: 48 },
                                ].map(s => (
                                    <div key={s.skill} className="text-center">
                                        <div className="relative w-full bg-slate-100 rounded-full h-2 mb-1.5">
                                            <div className="bg-indigo-500 rounded-full h-2" style={{ width: `${s.demand}%` }} />
                                        </div>
                                        <span className="text-xs font-semibold text-slate-700">{s.skill}</span>
                                        <span className="text-[10px] text-slate-400 ml-1">{s.demand}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 md:col-span-2 lg:col-span-3">
                            <h3 className="font-bold text-slate-900 text-sm mb-3">🏢 Why Mentixy for Recruiters?</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {[
                                    { icon: '✅', title: 'Verified Skills', desc: 'Every skill badge is verified through timed assessments with percentile rankings. Not self-reported.' },
                                    { icon: '🧬', title: 'CareerDNA™ Matching', desc: 'Our 256-dim vector embeddings match candidates based on deep behavioral + skills data, not just resumes.' },
                                    { icon: '📊', title: 'Process Data', desc: 'See how candidates learn, not just what they know. Activity heatmaps, streak data, and problem-solving patterns.' },
                                ].map(f => (
                                    <div key={f.title} className="bg-slate-50 rounded-xl p-4">
                                        <span className="text-2xl block mb-2">{f.icon}</span>
                                        <h4 className="font-bold text-slate-900 text-sm mb-1">{f.title}</h4>
                                        <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Candidate Detail Modal */}
            <AnimatePresence>
                {selectedCandidate && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                        onClick={() => setSelectedCandidate(null)}>
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                            className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl"
                            onClick={e => e.stopPropagation()}>
                            <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-6 rounded-t-2xl text-white">
                                <div className="flex items-center gap-4">
                                    <span className="text-4xl">{selectedCandidate.avatar}</span>
                                    <div>
                                        <h2 className="text-xl font-bold">{selectedCandidate.name}</h2>
                                        <p className="text-white/70 text-sm">{selectedCandidate.college} · {selectedCandidate.stream}</p>
                                        <p className="text-white/80 text-xs mt-1">🧬 {selectedCandidate.archetype}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 space-y-5">
                                <div className="grid grid-cols-4 gap-3 text-center">
                                    <div className="bg-indigo-50 rounded-xl p-3">
                                        <p className="text-lg font-bold text-indigo-600">{selectedCandidate.score}</p>
                                        <p className="text-[10px] text-indigo-500 font-semibold">SCORE</p>
                                    </div>
                                    <div className="bg-emerald-50 rounded-xl p-3">
                                        <p className="text-lg font-bold text-emerald-600">{selectedCandidate.cgpa}</p>
                                        <p className="text-[10px] text-emerald-500 font-semibold">CGPA</p>
                                    </div>
                                    <div className="bg-amber-50 rounded-xl p-3">
                                        <p className="text-lg font-bold text-amber-600">{selectedCandidate.streak}</p>
                                        <p className="text-[10px] text-amber-500 font-semibold">STREAK</p>
                                    </div>
                                    <div className="bg-violet-50 rounded-xl p-3">
                                        <p className="text-lg font-bold text-violet-600">{selectedCandidate.problemsSolved}</p>
                                        <p className="text-[10px] text-violet-500 font-semibold">SOLVED</p>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-slate-500 mb-2">VERIFIED SKILLS</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedCandidate.skills.map(s => (
                                            <span key={s} className={`px-3 py-1 rounded-lg text-xs font-semibold ${selectedCandidate.verified.includes(s) ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'}`}>
                                                {selectedCandidate.verified.includes(s) ? '✓ ' : ''}{s}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button onClick={() => toggleShortlist(selectedCandidate.id)}
                                        className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${shortlist.has(selectedCandidate.id)
                                            ? 'bg-amber-100 text-amber-700 border-2 border-amber-200' : 'bg-indigo-600 text-white'}`}>
                                        {shortlist.has(selectedCandidate.id) ? '⭐ Shortlisted' : '☆ Add to Shortlist'}
                                    </button>
                                    <Link href={`/u/${selectedCandidate.username}`}
                                        className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-slate-100 text-slate-700 text-center hover:bg-slate-200 transition-all">
                                        View Full Profile →
                                    </Link>
                                </div>
                            </div>
                            <button onClick={() => setSelectedCandidate(null)}
                                className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">✕</button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
