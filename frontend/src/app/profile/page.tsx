'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { auth } from '@/lib/api';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';
import Link from 'next/link';

// Generate 365-day heatmap data
function generateYearHeatmap() {
    const data: { date: string; count: number }[] = [];
    const today = new Date();
    for (let i = 364; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const rand = Math.random();
        let count = 0;
        if (rand > 0.35) count = Math.floor(Math.random() * 4) + 1;
        if (rand > 0.85) count = Math.floor(Math.random() * 3) + 4;
        data.push({ date: dateStr, count });
    }
    return data;
}

const YEAR_HEATMAP = generateYearHeatmap();
const HEAT_COLORS_PROFILE = ['bg-slate-100', 'bg-emerald-200', 'bg-emerald-300', 'bg-emerald-400', 'bg-emerald-500', 'bg-emerald-600', 'bg-emerald-700'];
const HEAT_COLOR = (c: number) => c >= 6 ? HEAT_COLORS_PROFILE[6] : c >= 4 ? HEAT_COLORS_PROFILE[5] : c >= 3 ? HEAT_COLORS_PROFILE[4] : c >= 2 ? HEAT_COLORS_PROFILE[3] : c >= 1 ? HEAT_COLORS_PROFILE[2] : HEAT_COLORS_PROFILE[0];

const MOCK_PROFILE = {
    name: 'Arjun Kumar',
    username: 'arjunk26',
    headline: 'Aspiring Data Analyst | Python & SQL Verified | Mentixy Score 68',
    headlineStrength: 72,
    about: 'Final-year CSE student at SKCT, Coimbatore. Passionate about data analysis and problem-solving. Verified in Python (74th %ile) and SQL (61st %ile). Currently targeting Data Analyst roles at mid-tier and product companies.',
    college: 'Sri Krishna College of Technology, Coimbatore',
    degree: 'B.E. Computer Science',
    year: 2026,
    cgpa: 7.2,
    tenthPct: 89.4,
    twelfthPct: 82.1,
    city: 'Coimbatore',
    relocate: true,
    careerTarget: ['Data Analyst', 'Backend Developer'],
    archetype: 'The Analytical Builder',
    archetypeEmoji: '🔬',
    openToWork: true,
    openTags: ['Full-time', 'Internship'],
    availability: 'June 2026',
    profilePhoto: null,
    coverStyle: 'data-science',
    mentixyScore: 68,
    scoreBreakdown: { skills: 74, coding: 62, aptitude: 71, assessment: 75, community: 55, consistency: 68 },
    scorePercentile: 72,
    collegePeerPercentile: 81,
    streak: 23,
    longestStreak: 47,
    totalSolved: { easy: 45, medium: 35, hard: 7 },
    languages: { Python: 62, SQL: 18, 'C++': 7 },
    topicCoverage: { Arrays: 85, Strings: 78, 'Linked Lists': 42, Trees: 30, DP: 15, Graphs: 8, Sorting: 90, Math: 65 },
    verifiedSkills: [
        { name: 'Python', score: 74, percentile: 74, badge: 'Proficient', expiry: '2026-05-15' },
        { name: 'SQL', score: 61, percentile: 61, badge: 'Emerging', expiry: '2026-04-20' },
        { name: 'Aptitude', score: 71, percentile: 71, badge: 'Proficient', expiry: '2026-06-01' },
    ],
    selfReportedSkills: ['Java', 'HTML/CSS', 'Excel', 'Power BI'],
    achievements: [
        { icon: '🔥', title: '30-Day Streak', desc: 'Maintained 30+ day coding streak' },
        { icon: '🏆', title: 'Campus Wars Top 10', desc: 'College ranked in top 10 nationally' },
        { icon: '⚡', title: 'First Hard Solve', desc: 'Solved first Hard problem' },
        { icon: '📚', title: '100 Problems Club', desc: 'Solved 100+ coding problems' },
    ],
    experience: [
        { role: 'Data Analyst Intern', company: 'TechSoft Solutions', duration: 'May–Jul 2025', bullets: ['Analyzed 50K+ rows of sales data using Python & Pandas, reducing report generation time by 60%', 'Built 3 interactive dashboards in Power BI for sales team KPI tracking'] },
    ],
    projects: [
        { name: 'Student Placement Predictor', tech: 'Python, Scikit-Learn, Flask', github: 'github.com/arjunk26/placement-predictor', desc: 'ML model predicting placement probability based on CGPA, skills, and aptitude scores. 84% accuracy.' },
        { name: 'E-Commerce Sales Dashboard', tech: 'SQL, Power BI', desc: 'Interactive dashboard analyzing 3 years of e-commerce sales data. Used CTEs, window functions, and DAX measures.' },
    ],
    certifications: [
        { name: 'Python Verified (Mentixy)', issuer: 'Mentixy', verified: true, date: 'Feb 2026' },
        { name: 'SQL Verified (Mentixy)', issuer: 'Mentixy', verified: true, date: 'Jan 2026' },
        { name: 'NPTEL — Data Science Basics', issuer: 'NPTEL/IIT Madras', verified: false, date: 'Nov 2025' },
    ],
    connections: 47,
    followers: 12,
    endorsements: 8,
    profileCompletion: 84,
    nextAction: 'Verify Java skill to reach 90% completion',
    privacy: {
        score: 'public',
        aptitude: 'connections',
        coding: 'public',
        cgpa: 'recruiters',
        connectionList: 'connections',
        assessment: 'connections',
    } as Record<string, string>,
};

export default function ProfilePage() {
    const [profile, setProfile] = useState(MOCK_PROFILE);
    const [activeSection, setActiveSection] = useState('about');
    const [viewAsRecruiter, setViewAsRecruiter] = useState(false);
    const [privacy, setPrivacy] = useState(MOCK_PROFILE.privacy);

    const updatePrivacy = (key: string, val: string) => {
        setPrivacy(prev => ({ ...prev, [key]: val }));
    };

    useEffect(() => { if (!auth.isLoggedIn()) { window.location.href = '/login'; } }, []);

    const badgeColor = (badge: string) => badge === 'Master' ? 'bg-violet-50 text-violet-700' : badge === 'Expert' ? 'bg-indigo-50 text-indigo-700' :
        badge === 'Proficient' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700';

    const sectionNav = [
        { key: 'about', label: 'About' },
        { key: 'skills', label: 'Skills' },
        { key: 'coding', label: 'Coding Activity' },
        { key: 'experience', label: 'Experience' },
        { key: 'achievements', label: 'Achievements' },
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            <TopBar />
            <main className="pb-24 md:pb-8">
                {/* Cover */}
                <div className="relative h-36 md:h-48 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 overflow-hidden">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L3N2Zz4=')] opacity-30" />
                    {viewAsRecruiter && (
                        <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full z-20">
                            👁 Viewing as Recruiter
                        </div>
                    )}
                </div>

                {/* Profile Header */}
                <div className="max-w-4xl mx-auto px-4 md:px-6 -mt-14 relative z-10">
                    <div className="flex items-end gap-4 mb-4">
                        <div className="w-24 h-24 md:w-28 md:h-28 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl border-4 border-white shadow-xl flex items-center justify-center text-white text-3xl font-bold">
                            {profile.name[0]}
                        </div>
                        <div className="flex-1 min-w-0 pb-1">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h1 className="text-xl font-bold text-slate-900">{profile.name}</h1>
                                {profile.openToWork && (
                                    <span className="text-[10px] px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full font-bold border border-emerald-200">
                                        🟢 Open to Work
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-slate-500">@{profile.username} · {profile.city} · {profile.degree} '{String(profile.year).slice(-2)}</p>
                        </div>
                        <div className="flex gap-2 pb-1">
                            <button onClick={() => setViewAsRecruiter(!viewAsRecruiter)}
                                className="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-200 transition-colors">
                                {viewAsRecruiter ? '👤 Normal View' : '👁 Recruiter View'}
                            </button>
                            <Link href="/settings" className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 transition-colors">
                                ✏️ Edit Profile
                            </Link>
                        </div>
                    </div>

                    {/* Headline */}
                    <div className="st-card p-4 mb-4">
                        <p className="text-sm text-slate-700 font-medium">{profile.headline}</p>
                        <div className="flex items-center gap-2 mt-2">
                            <div className="flex-1 bg-slate-100 rounded-full h-1.5">
                                <div className="h-1.5 rounded-full bg-indigo-500" style={{ width: `${profile.headlineStrength}%` }} />
                            </div>
                            <span className="text-[10px] text-slate-400">Headline strength: {profile.headlineStrength}/100</span>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                        {/* Left Column - Score + Quick Stats */}
                        <div className="space-y-4">
                            {/* Mentixy Score™ */}
                            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                                className="st-card p-5 bg-gradient-to-br from-indigo-50 to-violet-50">
                                <div className="text-center mb-3">
                                    <p className="text-4xl font-bold text-indigo-600">{profile.mentixyScore}</p>
                                    <p className="text-xs font-bold text-slate-700 mt-1">Mentixy Score™</p>
                                    <p className="text-[10px] text-slate-400">Top {100 - profile.scorePercentile}% overall · Top {100 - profile.collegePeerPercentile}% at college</p>
                                </div>
                                <div className="space-y-1.5">
                                    {Object.entries(profile.scoreBreakdown).map(([key, val]) => (
                                        <div key={key} className="flex items-center gap-2">
                                            <span className="text-[10px] text-slate-500 w-20 capitalize">{key}</span>
                                            <div className="flex-1 bg-white rounded-full h-2">
                                                <div className={`h-2 rounded-full ${val >= 70 ? 'bg-emerald-500' : val >= 50 ? 'bg-amber-500' : 'bg-red-400'}`} style={{ width: `${val}%` }} />
                                            </div>
                                            <span className="text-[10px] font-bold text-slate-600 w-6 text-right">{val}</span>
                                        </div>
                                    ))}
                                </div>
                                <Link href="/score" className="block text-center text-xs text-indigo-600 font-semibold mt-3 hover:underline">View Full Score →</Link>
                            </motion.div>

                            {/* Career Target */}
                            <div className="st-card p-4">
                                <p className="text-[10px] text-slate-400 uppercase font-bold mb-2">🎯 Career Target</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {profile.careerTarget.map(t => (
                                        <span key={t} className="text-xs px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-lg font-semibold">{t}</span>
                                    ))}
                                </div>
                                <div className="mt-3 flex items-center gap-2 p-2 bg-violet-50 rounded-lg">
                                    <span className="text-lg">{profile.archetypeEmoji}</span>
                                    <div>
                                        <p className="text-[10px] text-violet-600 font-bold uppercase">Career Archetype</p>
                                        <p className="text-xs font-semibold text-violet-800">{profile.archetype}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="st-card p-4">
                                <p className="text-[10px] text-slate-400 uppercase font-bold mb-2">📊 Quick Stats</p>
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        { label: 'Connections', value: profile.connections },
                                        { label: 'Followers', value: profile.followers },
                                        { label: 'Endorsements', value: profile.endorsements },
                                        { label: 'Profile Views', value: '34 this week' },
                                    ].map(s => (
                                        <div key={s.label} className="bg-slate-50 rounded-lg p-2 text-center">
                                            <p className="text-sm font-bold text-slate-900">{s.value}</p>
                                            <p className="text-[9px] text-slate-400">{s.label}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Profile Completion */}
                            <div className="st-card p-4">
                                <div className="flex items-center justify-between mb-1.5">
                                    <p className="text-[10px] text-slate-400 uppercase font-bold">Profile Completion</p>
                                    <span className="text-xs font-bold text-indigo-600">{profile.profileCompletion}%</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2 mb-2">
                                    <div className="h-2 rounded-full bg-indigo-500" style={{ width: `${profile.profileCompletion}%` }} />
                                </div>
                                <p className="text-[10px] text-slate-500">Next: {profile.nextAction}</p>
                            </div>
                        </div>

                        {/* Right Column - Main Content */}
                        <div className="md:col-span-2 space-y-4">
                            {/* Section Nav */}
                            <div className="flex gap-1 overflow-x-auto no-scrollbar">
                                {sectionNav.map(s => (
                                    <button key={s.key} onClick={() => setActiveSection(s.key)}
                                        className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${activeSection === s.key ? 'bg-indigo-600 text-white' : 'bg-white text-slate-500 border border-slate-200'}`}>{s.label}</button>
                                ))}
                            </div>

                            {/* About */}
                            {activeSection === 'about' && (
                                <div className="space-y-4">
                                    <div className="st-card p-5">
                                        <h3 className="font-bold text-sm text-slate-900 mb-2">About</h3>
                                        <p className="text-xs text-slate-600 leading-relaxed">{profile.about}</p>
                                    </div>
                                    <div className="st-card p-5">
                                        <h3 className="font-bold text-sm text-slate-900 mb-3">🎓 Education</h3>
                                        <div className="space-y-2">
                                            <div><p className="text-xs font-semibold text-slate-900">{profile.college}</p><p className="text-[10px] text-slate-400">{profile.degree} · Class of {profile.year} · CGPA: {profile.cgpa}</p></div>
                                            <div className="flex gap-4 text-[10px] text-slate-400">
                                                <span>12th: {profile.twelfthPct}%</span>
                                                <span>10th: {profile.tenthPct}%</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="st-card p-5">
                                        <h3 className="font-bold text-sm text-slate-900 mb-3">🗂️ Projects</h3>
                                        {profile.projects.map((p, i) => (
                                            <div key={i} className="p-3 bg-slate-50 rounded-xl mb-2 last:mb-0">
                                                <p className="text-xs font-bold text-slate-900">{p.name}</p>
                                                <p className="text-[10px] text-indigo-500 font-semibold mb-1">{p.tech}</p>
                                                <p className="text-[10px] text-slate-500">{p.desc}</p>
                                                {p.github && <p className="text-[10px] text-indigo-600 mt-1">🔗 {p.github}</p>}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="st-card p-5">
                                        <h3 className="font-bold text-sm text-slate-900 mb-3">📜 Certifications</h3>
                                        {profile.certifications.map((c, i) => (
                                            <div key={i} className="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0">
                                                <span className="text-lg">{c.verified ? '✅' : '📄'}</span>
                                                <div className="flex-1">
                                                    <p className="text-xs font-semibold text-slate-900">{c.name}</p>
                                                    <p className="text-[10px] text-slate-400">{c.issuer} · {c.date}</p>
                                                </div>
                                                {c.verified && <span className="text-[10px] px-1.5 py-0.5 bg-indigo-50 text-indigo-600 rounded font-bold">Verified</span>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Skills */}
                            {activeSection === 'skills' && (
                                <div className="space-y-4">
                                    <div className="st-card p-5">
                                        <h3 className="font-bold text-sm text-slate-900 mb-3">✅ Verified Skills</h3>
                                        {profile.verifiedSkills.map((s, i) => (
                                            <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl mb-2 last:mb-0">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-xs font-bold text-slate-900">{s.name}</p>
                                                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${badgeColor(s.badge)}`}>{s.badge}</span>
                                                    </div>
                                                    <p className="text-[10px] text-slate-400 mt-0.5">Score: {s.score} · {s.percentile}th percentile · Expires: {new Date(s.expiry).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</p>
                                                </div>
                                                <div className="w-16 bg-slate-200 rounded-full h-2">
                                                    <div className="h-2 rounded-full bg-indigo-500" style={{ width: `${s.score}%` }} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="st-card p-5">
                                        <h3 className="font-bold text-sm text-slate-900 mb-3">📝 Self-Reported Skills <span className="text-[10px] text-slate-400 font-normal">(unverified)</span></h3>
                                        <div className="flex flex-wrap gap-1.5">
                                            {profile.selfReportedSkills.map(s => (
                                                <span key={s} className="text-xs px-2.5 py-1 bg-slate-100 text-slate-500 rounded-lg">{s} <Link href="/skills" className="text-indigo-500 font-semibold ml-1">Verify →</Link></span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Coding Activity */}
                            {activeSection === 'coding' && (
                                <div className="space-y-4">
                                    {/* 365-Day Contribution Heatmap (Bible Phase 3 — GitHub-style) */}
                                    <div className="st-card p-5">
                                        <div className="flex items-center justify-between mb-3">
                                            <h3 className="font-bold text-sm text-slate-900">📅 365-Day Contribution Heatmap</h3>
                                            <span className="text-xs text-emerald-600 font-semibold">🔥 {profile.streak} day streak</span>
                                        </div>
                                        <div className="overflow-x-auto">
                                            <div className="grid gap-[2px]" style={{ gridTemplateRows: 'repeat(7, 1fr)', gridAutoFlow: 'column', gridAutoColumns: 'minmax(0, 1fr)', minWidth: 720 }}>
                                                {YEAR_HEATMAP.map((d, i) => (
                                                    <div key={i} className={`w-[11px] h-[11px] rounded-[2px] ${HEAT_COLOR(d.count)} transition-colors cursor-pointer`}
                                                        title={`${d.date}: ${d.count} contributions`} />
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between mt-2">
                                            <span className="text-[9px] text-slate-400">{YEAR_HEATMAP.filter(d => d.count > 0).length} active days out of 365</span>
                                            <div className="flex items-center gap-1">
                                                <span className="text-[9px] text-slate-400">Less</span>
                                                {[0, 1, 2, 3, 5, 7].map((c, i) => <div key={i} className={`w-[10px] h-[10px] rounded-[2px] ${HEAT_COLOR(c)}`} />)}
                                                <span className="text-[9px] text-slate-400">More</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="st-card p-5">
                                        <h3 className="font-bold text-sm text-slate-900 mb-3">📊 Coding Stats</h3>
                                        <div className="grid grid-cols-3 gap-3 mb-4">
                                            <div className="bg-emerald-50 rounded-xl p-3 text-center"><p className="text-xl font-bold text-emerald-600">{profile.totalSolved.easy}</p><p className="text-[10px] text-slate-400">Easy</p></div>
                                            <div className="bg-amber-50 rounded-xl p-3 text-center"><p className="text-xl font-bold text-amber-600">{profile.totalSolved.medium}</p><p className="text-[10px] text-slate-400">Medium</p></div>
                                            <div className="bg-red-50 rounded-xl p-3 text-center"><p className="text-xl font-bold text-red-600">{profile.totalSolved.hard}</p><p className="text-[10px] text-slate-400">Hard</p></div>
                                        </div>
                                        <div className="flex items-center gap-4 mb-4">
                                            <div><p className="text-lg font-bold text-orange-500">🔥 {profile.streak}</p><p className="text-[10px] text-slate-400">Current Streak</p></div>
                                            <div><p className="text-lg font-bold text-violet-600">⭐ {profile.longestStreak}</p><p className="text-[10px] text-slate-400">Longest Streak</p></div>
                                            <div><p className="text-lg font-bold text-indigo-600">💻 {profile.totalSolved.easy + profile.totalSolved.medium + profile.totalSolved.hard}</p><p className="text-[10px] text-slate-400">Total Solved</p></div>
                                        </div>
                                    </div>
                                    <div className="st-card p-5">
                                        <h3 className="font-bold text-sm text-slate-900 mb-3">🔤 Language Breakdown</h3>
                                        {Object.entries(profile.languages).map(([lang, count]) => (
                                            <div key={lang} className="flex items-center gap-2 py-1">
                                                <span className="text-xs text-slate-600 w-16">{lang}</span>
                                                <div className="flex-1 bg-slate-100 rounded-full h-3">
                                                    <div className="h-3 rounded-full bg-indigo-500" style={{ width: `${(count / (profile.totalSolved.easy + profile.totalSolved.medium + profile.totalSolved.hard)) * 100}%` }} />
                                                </div>
                                                <span className="text-xs font-bold text-slate-600 w-8 text-right">{count}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="st-card p-5">
                                        <h3 className="font-bold text-sm text-slate-900 mb-3">🕸️ Topic Coverage</h3>
                                        <div className="grid grid-cols-2 gap-2">
                                            {Object.entries(profile.topicCoverage).map(([topic, pct]) => (
                                                <div key={topic} className="flex items-center gap-2">
                                                    <span className="text-[10px] text-slate-500 w-20">{topic}</span>
                                                    <div className="flex-1 bg-slate-100 rounded-full h-2">
                                                        <div className={`h-2 rounded-full ${pct >= 70 ? 'bg-emerald-500' : pct >= 40 ? 'bg-amber-500' : 'bg-red-400'}`} style={{ width: `${pct}%` }} />
                                                    </div>
                                                    <span className="text-[10px] font-bold text-slate-500 w-7 text-right">{pct}%</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Experience */}
                            {activeSection === 'experience' && (
                                <div className="st-card p-5">
                                    <h3 className="font-bold text-sm text-slate-900 mb-3">💼 Experience</h3>
                                    {profile.experience.map((exp, i) => (
                                        <div key={i} className="p-3 bg-slate-50 rounded-xl">
                                            <p className="text-xs font-bold text-slate-900">{exp.role}</p>
                                            <p className="text-[10px] text-slate-500 mb-2">{exp.company} · {exp.duration}</p>
                                            {exp.bullets.map((b, bi) => (
                                                <p key={bi} className="text-[10px] text-slate-600 py-0.5 flex items-start gap-1.5">
                                                    <span className="text-indigo-400 mt-0.5">•</span> {b}
                                                </p>
                                            ))}
                                        </div>
                                    ))}
                                    {profile.experience.length === 0 && (
                                        <p className="text-xs text-slate-400 text-center py-4">No experience yet. Add your internship!</p>
                                    )}
                                </div>
                            )}

                            {/* Achievements */}
                            {activeSection === 'achievements' && (
                                <div className="st-card p-5">
                                    <h3 className="font-bold text-sm text-slate-900 mb-3">🏅 Achievements</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        {profile.achievements.map((a, i) => (
                                            <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
                                                className="p-3 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl text-center border border-amber-100">
                                                <span className="text-2xl block mb-1">{a.icon}</span>
                                                <p className="text-xs font-bold text-slate-900">{a.title}</p>
                                                <p className="text-[10px] text-slate-400">{a.desc}</p>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Privacy Controls (Bible Phase 3) */}
                    <div className="mt-6 st-card p-5">
                        <h3 className="font-bold text-sm text-slate-900 mb-1">🔒 Profile Privacy Controls</h3>
                        <p className="text-[10px] text-slate-400 mb-4">Choose who can see each section of your profile</p>
                        <div className="space-y-3">
                            {[
                                { key: 'score', label: 'Mentixy Score™', icon: '📊' },
                                { key: 'aptitude', label: 'Aptitude Scores', icon: '🧠' },
                                { key: 'coding', label: 'Coding Activity', icon: '💻' },
                                { key: 'cgpa', label: 'CGPA / Grades', icon: '🎓' },
                                { key: 'connectionList', label: 'Connection List', icon: '👥' },
                                { key: 'assessment', label: 'Assessment Result', icon: '🧬' },
                            ].map(field => (
                                <div key={field.key} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm">{field.icon}</span>
                                        <span className="text-xs text-slate-700 font-medium">{field.label}</span>
                                    </div>
                                    <select
                                        value={privacy[field.key]}
                                        onChange={(e) => updatePrivacy(field.key, e.target.value)}
                                        className="text-[10px] bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                                    >
                                        <option value="public">🌐 Public</option>
                                        <option value="connections">👥 Connections Only</option>
                                        <option value="recruiters">💼 Recruiters Only</option>
                                        <option value="private">🔒 Only Me</option>
                                    </select>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Public Profile URL */}
                    <div className="mt-4 st-card p-4 flex items-center gap-3">
                        <span className="text-xs text-slate-400">🔗 Public Profile:</span>
                        <code className="text-xs text-indigo-600 font-semibold bg-indigo-50 px-2 py-0.5 rounded">mentixy.in/u/{profile.username}</code>
                        <button className="text-xs text-slate-500 hover:text-slate-700">📋 Copy</button>
                        <button className="text-xs text-slate-500 hover:text-slate-700">📲 QR Code</button>
                    </div>
                </div>
            </main>
            <BottomNav />
        </div>
    );
}
