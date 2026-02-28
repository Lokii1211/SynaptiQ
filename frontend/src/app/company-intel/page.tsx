'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api, auth } from '@/lib/api';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';
import Link from 'next/link';

interface Company {
    slug: string;
    name: string;
    logo: string;
    industry: string;
    rating: number;
    reviews: number;
    hq: string;
    size: string;
    fresherCTC: string;
    interviewRounds: string[];
    topSkills: string[];
    difficulty: 'Easy' | 'Medium' | 'Hard';
    placementTrend: 'up' | 'stable' | 'down';
    description: string;
    hiresFrom: string[];
}

const DEMO_COMPANIES: Company[] = [
    {
        slug: 'tcs', name: 'Tata Consultancy Services', logo: 'T', industry: 'IT Services & Consulting',
        rating: 3.8, reviews: 12400, hq: 'Mumbai', size: '6,00,000+', fresherCTC: '₹3.36 – 7 LPA',
        interviewRounds: ['Online Test (NQT)', 'Technical Interview', 'Managerial', 'HR Round'],
        topSkills: ['Java', 'SQL', 'Python', 'DSA'], difficulty: 'Medium',
        placementTrend: 'stable', description: 'India\'s largest IT services company. Mass recruiter with strong training program.',
        hiresFrom: ['VIT', 'SRM', 'BITS', 'NITs', 'Anna Univ'],
    },
    {
        slug: 'infosys', name: 'Infosys', logo: 'I', industry: 'IT Services & Consulting',
        rating: 3.6, reviews: 9800, hq: 'Bengaluru', size: '3,50,000+', fresherCTC: '₹3.6 – 9.5 LPA',
        interviewRounds: ['InfyTQ / Online Test', 'Coding Round', 'Technical', 'HR'],
        topSkills: ['Python', 'Java', 'Problem Solving', 'Communication'], difficulty: 'Medium',
        placementTrend: 'up', description: 'Global leader in technology services. Strong DSE & PP tracks for freshers.',
        hiresFrom: ['NITs', 'IIITs', 'VIT', 'Manipal', 'KIIT'],
    },
    {
        slug: 'wipro', name: 'Wipro', logo: 'W', industry: 'IT Services',
        rating: 3.5, reviews: 7600, hq: 'Bengaluru', size: '2,50,000+', fresherCTC: '₹3.5 – 6.5 LPA',
        interviewRounds: ['Written Test', 'Coding', 'Technical Interview', 'HR'],
        topSkills: ['Java', 'C++', 'SQL', 'Aptitude'], difficulty: 'Easy',
        placementTrend: 'stable', description: 'Major IT services firm with Project Engineer and WILP programs.',
        hiresFrom: ['SRM', 'VIT', 'Amrita', 'LNMIIT', 'PESIT'],
    },
    {
        slug: 'amazon', name: 'Amazon', logo: 'A', industry: 'E-Commerce & Cloud',
        rating: 4.2, reviews: 5200, hq: 'Bengaluru / Hyderabad', size: '1,00,000+ (India)', fresherCTC: '₹26 – 45 LPA',
        interviewRounds: ['Online Assessment', 'Phone Screen', 'Virtual Onsite (4-5 rounds)', 'Bar Raiser'],
        topSkills: ['DSA', 'System Design', 'Leadership Principles', 'Problem Solving'], difficulty: 'Hard',
        placementTrend: 'up', description: 'FAANG tier company. Strong focus on Leadership Principles in interviews.',
        hiresFrom: ['IITs', 'NITs', 'BITS', 'IIIT-H', 'DAIICT'],
    },
    {
        slug: 'google', name: 'Google', logo: 'G', industry: 'Technology',
        rating: 4.5, reviews: 3200, hq: 'Bengaluru / Hyderabad', size: '40,000+ (India)', fresherCTC: '₹30 – 55 LPA',
        interviewRounds: ['Online Test', 'Phone Screen (2)', 'Onsite (4-5 rounds)', 'Team Matching'],
        topSkills: ['DSA', 'Algorithms', 'System Design', 'Googleyness'], difficulty: 'Hard',
        placementTrend: 'stable', description: 'World\'s most desired employer. Heavy focus on algorithmic problem solving.',
        hiresFrom: ['IITs', 'BITS', 'IIIT-H', 'NIT Top 5'],
    },
    {
        slug: 'flipkart', name: 'Flipkart', logo: 'F', industry: 'E-Commerce',
        rating: 4.0, reviews: 2800, hq: 'Bengaluru', size: '45,000+', fresherCTC: '₹18 – 32 LPA',
        interviewRounds: ['Online Coding', 'Machine Coding', 'Problem Solving', 'System Design', 'HR'],
        topSkills: ['DSA', 'LLD', 'HLD', 'Java/Python'], difficulty: 'Hard',
        placementTrend: 'up', description: 'India\'s leading e-commerce. Great engineering culture, Walmart-backed.',
        hiresFrom: ['IITs', 'NITs', 'BITS', 'IIIT-H'],
    },
    {
        slug: 'zoho', name: 'Zoho Corporation', logo: 'Z', industry: 'SaaS / Software',
        rating: 4.1, reviews: 4100, hq: 'Chennai', size: '15,000+', fresherCTC: '₹5 – 8 LPA',
        interviewRounds: ['Aptitude Test', 'Programming Round', 'Advanced Programming', 'Technical', 'HR'],
        topSkills: ['C/C++', 'Data Structures', 'Problem Solving', 'Logic'], difficulty: 'Medium',
        placementTrend: 'up', description: 'Bootstrapped SaaS giant. No CGPA filter — skills matter most.',
        hiresFrom: ['Anna Univ', 'VIT', 'SRM', 'PSG', 'Tier 2-3'],
    },
    {
        slug: 'microsoft', name: 'Microsoft', logo: 'M', industry: 'Technology',
        rating: 4.4, reviews: 4500, hq: 'Hyderabad / Bengaluru', size: '20,000+ (India)', fresherCTC: '₹28 – 48 LPA',
        interviewRounds: ['Online Test', 'Group Fly Round', 'Technical (3 rounds)', 'HR / AA Round'],
        topSkills: ['DSA', 'System Design', 'OS', 'DBMS'], difficulty: 'Hard',
        placementTrend: 'stable', description: 'Top tech employer. Strong mentorship and growth for new grads.',
        hiresFrom: ['IITs', 'NITs', 'BITS', 'IIIT-H', 'DTU'],
    },
    {
        slug: 'cognizant', name: 'Cognizant', logo: 'C', industry: 'IT Services',
        rating: 3.4, reviews: 8900, hq: 'Chennai', size: '3,50,000+', fresherCTC: '₹4 – 6.75 LPA',
        interviewRounds: ['AMCAT / Online Test', 'Coding', 'Technical', 'HR'],
        topSkills: ['Java', 'SQL', 'Aptitude', 'Communication'], difficulty: 'Easy',
        placementTrend: 'stable', description: 'Large IT services firm. GenC and GenC Elevate programs for freshers.',
        hiresFrom: ['VIT', 'SRM', 'Amrita', 'KIIT', 'Most Tier 2'],
    },
];

const FILTERS = ['All', 'FAANG', 'Mass Recruiters', 'Startups', 'Product'];

export default function CompanyIntelPage() {
    const [companies, setCompanies] = useState<Company[]>(DEMO_COMPANIES);
    const [filter, setFilter] = useState('All');
    const [search, setSearch] = useState('');
    const [expanded, setExpanded] = useState<string | null>(null);

    useEffect(() => {
        if (!auth.isLoggedIn()) { window.location.href = '/login'; return; }
        // Try real API, fallback to demo
        api.getCompanies().then(data => {
            if (data.companies?.length > 0) setCompanies(data.companies);
        }).catch(() => { });
    }, []);

    const filtered = companies.filter(c => {
        if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.industry.toLowerCase().includes(search.toLowerCase())) return false;
        if (filter === 'FAANG') return ['amazon', 'google', 'microsoft', 'flipkart'].includes(c.slug);
        if (filter === 'Mass Recruiters') return ['tcs', 'infosys', 'wipro', 'cognizant'].includes(c.slug);
        if (filter === 'Product') return ['zoho', 'flipkart', 'google', 'amazon', 'microsoft'].includes(c.slug);
        return true;
    });

    const diffColor = (d: string) => d === 'Easy' ? 'bg-emerald-50 text-emerald-700' : d === 'Medium' ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700';
    const trendIcon = (t: string) => t === 'up' ? '📈 Hiring More' : t === 'down' ? '📉 Fewer Openings' : '➡️ Stable';

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1 pb-24 md:pb-8">
                    {/* Hero */}
                    <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 text-white px-6 py-10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full -translate-y-1/2 translate-x-1/4" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-violet-500/10 rounded-full translate-y-1/2 -translate-x-1/4" />
                        <div className="max-w-5xl mx-auto relative z-10">
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                                <span className="text-xs font-semibold bg-white/10 px-3 py-1 rounded-full mb-3 inline-block">🏢 COMPANY INTEL</span>
                                <h1 className="text-3xl font-bold mb-2 st-font-heading">Company Intelligence</h1>
                                <p className="text-white/50 text-sm mb-5">Honest salary data, interview processes, and placement trends from real students</p>
                                <div className="flex items-center gap-3 text-sm">
                                    <span className="bg-white/10 px-3 py-1.5 rounded-lg">{companies.length} companies</span>
                                    <span className="bg-white/10 px-3 py-1.5 rounded-lg">Updated Feb 2026</span>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    <div className="px-4 md:px-6 py-6 max-w-5xl mx-auto">
                        {/* Search + Filters */}
                        <div className="flex flex-col sm:flex-row gap-3 mb-5">
                            <div className="relative flex-1">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
                                <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                                    placeholder="Search companies..." className="st-input pl-10 w-full" />
                            </div>
                            <div className="flex gap-2 overflow-x-auto no-scrollbar">
                                {FILTERS.map(f => (
                                    <button key={f} onClick={() => setFilter(f)}
                                        className={`shrink-0 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${filter === f
                                            ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-400'
                                            }`}>{f}</button>
                                ))}
                            </div>
                        </div>

                        {/* Company Grid */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filtered.map((company, i) => (
                                <motion.div key={company.slug}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.04 }}
                                    className="st-card overflow-hidden hover:shadow-xl transition-all group cursor-pointer"
                                    onClick={() => setExpanded(expanded === company.slug ? null : company.slug)}
                                >
                                    <div className="p-5">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-12 h-12 bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl flex items-center justify-center text-white font-bold text-lg">
                                                {company.logo}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors truncate">{company.name}</h3>
                                                <p className="text-[10px] text-slate-400">{company.industry}</p>
                                            </div>
                                        </div>

                                        {/* Rating + Difficulty */}
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="flex items-center gap-1">
                                                <span className="text-yellow-400 text-xs">★</span>
                                                <span className="text-xs font-bold text-slate-700">{company.rating}</span>
                                                <span className="text-[10px] text-slate-400">({company.reviews.toLocaleString()})</span>
                                            </div>
                                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${diffColor(company.difficulty)}`}>{company.difficulty}</span>
                                        </div>

                                        {/* Fresher CTC */}
                                        <div className="bg-emerald-50 rounded-xl px-3 py-2 mb-3">
                                            <p className="text-[10px] text-emerald-600 uppercase font-bold">Fresher CTC</p>
                                            <p className="text-sm font-bold text-emerald-700">{company.fresherCTC}</p>
                                        </div>

                                        {/* Top Skills */}
                                        <div className="flex flex-wrap gap-1 mb-3">
                                            {company.topSkills.map(skill => (
                                                <span key={skill} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">{skill}</span>
                                            ))}
                                        </div>

                                        {/* Trend */}
                                        <p className="text-[10px] text-slate-400">{trendIcon(company.placementTrend)}</p>
                                    </div>

                                    {/* Expanded Details */}
                                    <AnimatePresence>
                                        {expanded === company.slug && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="border-t border-slate-100 overflow-hidden"
                                            >
                                                <div className="p-5 space-y-3 bg-slate-50/50">
                                                    <p className="text-xs text-slate-600 leading-relaxed">{company.description}</p>

                                                    <div>
                                                        <p className="text-[10px] text-slate-400 uppercase font-bold mb-1.5">📋 Interview Process</p>
                                                        <div className="flex flex-wrap gap-1">
                                                            {company.interviewRounds.map((round, ri) => (
                                                                <span key={ri} className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md font-medium flex items-center gap-1">
                                                                    <span className="text-indigo-400">{ri + 1}.</span> {round}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">🏫 Hires From</p>
                                                        <p className="text-xs text-slate-600">{company.hiresFrom.join(' · ')}</p>
                                                    </div>

                                                    <div className="flex items-center gap-2 pt-1">
                                                        <span className="text-[10px] text-slate-400">📍 {company.hq}</span>
                                                        <span className="text-[10px] text-slate-400">👥 {company.size}</span>
                                                    </div>

                                                    <Link href={`/practice?company=${company.slug}`}
                                                        className="block w-full text-center py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl hover:bg-indigo-700 transition-colors mt-2">
                                                        Practice {company.name} Questions →
                                                    </Link>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))}
                        </div>

                        {filtered.length === 0 && (
                            <div className="text-center py-12">
                                <span className="text-4xl block mb-3">🏢</span>
                                <p className="text-slate-500 font-medium">No companies match your search</p>
                                <p className="text-sm text-slate-400 mt-1">Try a different filter or search term</p>
                            </div>
                        )}
                    </div>
                </main>
                <BottomNav />
            </div>
        </div>
    );
}
