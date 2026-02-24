'use client';
import { useEffect, useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import { motion } from 'framer-motion';
import { api, auth } from '@/lib/api';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';
import { SideNav } from '@/components/layout/SideNav';

interface CareerDetail {
    slug: string;
    title: string;
    icon: string;
    match_score: number;
    category: string;
    description: string;
    hook_line: string;
    salary_p10: number;
    salary_p50: number;
    salary_p90: number;
    tags: string[];
    entry_paths: { tier1: string; tier2: string; tier3: string };
    green_zone: string[];
    yellow_zone: string[];
    red_zone: string[];
    day_in_life: string;
    top_companies: { name: string; ctc_range: string }[];
    skills_required: string[];
    timeline_months: number;
    ai_automation_risk: 'Low' | 'Medium' | 'High';
    remote_friendly: boolean;
}

const CAREER_DATA: Record<string, CareerDetail> = {
    'software-engineer': {
        slug: 'software-engineer',
        title: 'Software Engineer',
        icon: '💻',
        match_score: 92,
        category: 'Technology',
        description: 'Design, develop, and maintain software applications that solve real problems.',
        hook_line: 'You\'ll spend 40% of your time reading other people\'s code — and that\'s actually the fun part.',
        salary_p10: 5,
        salary_p50: 12,
        salary_p90: 35,
        tags: ['Remote-friendly', 'High-growth', 'AI-safe'],
        entry_paths: {
            tier1: 'Direct campus placement at FAANG/unicorns → ₹18-45 LPA starting',
            tier2: 'Strong DSA + projects → service companies → product companies in 2 years',
            tier3: 'AMCAT/eLitmus → service companies → upskill → product switch in 3 years',
        },
        green_zone: ['Strong logical thinking from assessment', 'High systematic score indicates debugging aptitude'],
        yellow_zone: ['System design knowledge — 8-12 weeks of focused study', 'DSA practice — solve 150+ problems across difficulty'],
        red_zone: ['Competition is intense: 1.5M engineering graduates compete for ~200K quality tech roles annually'],
        day_in_life: 'It\'s Monday 9:15am. Slack has 18 unread messages. Your first standup is at 10am — you have 45 minutes to review a pull request from yesterday that touches the payment service. The code works but the error handling is brittle. Do you approve it because the sprint ends tomorrow, or flag it knowing it\'ll delay release? Your tech lead pings: "Can we ship this today?" Welcome to software engineering.',
        top_companies: [
            { name: 'TCS', ctc_range: '₹3.5-7 LPA' },
            { name: 'Infosys', ctc_range: '₹3.6-8 LPA' },
            { name: 'Flipkart', ctc_range: '₹18-35 LPA' },
            { name: 'Razorpay', ctc_range: '₹15-28 LPA' },
            { name: 'Google India', ctc_range: '₹25-50 LPA' },
            { name: 'Microsoft India', ctc_range: '₹20-45 LPA' },
            { name: 'Swiggy', ctc_range: '₹14-25 LPA' },
            { name: 'PhonePe', ctc_range: '₹16-30 LPA' },
            { name: 'Zerodha', ctc_range: '₹18-35 LPA' },
            { name: 'Postman', ctc_range: '₹20-40 LPA' },
        ],
        skills_required: ['DSA', 'System Design', 'Git', 'SQL', 'Python/Java/JS', 'APIs', 'Testing'],
        timeline_months: 14,
        ai_automation_risk: 'Medium',
        remote_friendly: true,
    },
    'data-scientist': {
        slug: 'data-scientist',
        title: 'Data Scientist',
        icon: '📊',
        match_score: 85,
        category: 'AI & ML',
        description: 'Transform raw data into actionable insights using statistics, ML, and domain expertise.',
        hook_line: '80% of your time is cleaning data. The other 20% is explaining your results to people who wanted a different answer.',
        salary_p10: 6,
        salary_p50: 15,
        salary_p90: 40,
        tags: ['High-growth', 'AI-safe', 'Remote-friendly'],
        entry_paths: {
            tier1: 'ML internships at research labs → direct DS roles at startups/MNCs',
            tier2: 'Kaggle competitions + NPTEL ML courses → analytics roles → DS transition',
            tier3: 'Excel → SQL → Python → analytics → ML → DS in 18-24 months',
        },
        green_zone: ['Strong analytical dimension from assessment', 'Natural pattern recognition ability'],
        yellow_zone: ['Statistics foundation — Khan Academy + NPTEL (6 weeks)', 'Python for ML — Kaggle Learn path (4 weeks)'],
        red_zone: ['True DS roles (not analyst relabeled) are limited to ~50K openings/year in India — most "DS" job postings are actually analyst roles'],
        day_in_life: 'It\'s 9:30am. The VP of Product slacks you: "Can you prove our new feature actually reduced churn?" You open your notebook from last week — the data pipeline broke over the weekend. You spend 2 hours fixing a Date format issue before you can even start the analysis. By 3pm you have results that show the feature had zero impact. The VP won\'t like this. Do you soften the findings or present them straight?',
        top_companies: [
            { name: 'Flipkart', ctc_range: '₹18-35 LPA' },
            { name: 'Swiggy', ctc_range: '₹15-28 LPA' },
            { name: 'Amazon India', ctc_range: '₹20-45 LPA' },
            { name: 'Tiger Analytics', ctc_range: '₹8-18 LPA' },
            { name: 'Mu Sigma', ctc_range: '₹5-12 LPA' },
        ],
        skills_required: ['Python', 'SQL', 'Statistics', 'ML Algorithms', 'Pandas/NumPy', 'Data Visualization', 'Communication'],
        timeline_months: 18,
        ai_automation_risk: 'Low',
        remote_friendly: true,
    },
};

export default function CareerDetailPage() {
    const params = useParams();
    const slug = params.slug as string;
    const [career, setCareer] = useState<CareerDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Try API first, fallback to static data
        const fetchCareer = async () => {
            try {
                const data = await api.getCareerDetail(slug);
                setCareer(data);
            } catch {
                setCareer(CAREER_DATA[slug] || CAREER_DATA['software-engineer']);
            } finally {
                setLoading(false);
            }
        };
        fetchCareer();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-indigo-300 border-t-indigo-600 rounded-full animate-spin" />
            </div>
        );
    }

    if (!career) return null;

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <TopBar />
            <SideNav />
            <main className="md:ml-56 pb-24 md:pb-8">
                {/* Hero Header */}
                <div className="bg-gradient-to-br from-indigo-600 to-violet-700 px-6 py-10">
                    <div className="max-w-3xl mx-auto">
                        <div className="flex items-start gap-4">
                            <span className="text-5xl">{career.icon}</span>
                            <div>
                                <h1 className="text-3xl font-bold">{career.title}</h1>
                                <p className="text-white/80 mt-1">{career.category}</p>
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {career.tags.map(tag => (
                                        <span key={tag} className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <p className="mt-6 text-white/90 text-lg italic">&ldquo;{career.hook_line}&rdquo;</p>
                    </div>
                </div>

                <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
                    {/* Match Score */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="bg-indigo-500/10 border border-indigo-500/30 rounded-2xl p-6 text-center">
                        <p className="text-sm text-indigo-300 uppercase tracking-wider">Your Match Score</p>
                        <p className="text-6xl font-bold text-indigo-400 mt-2">{career.match_score}%</p>
                    </motion.div>

                    {/* Salary Range */}
                    <div className="bg-slate-800/60 rounded-2xl p-6">
                        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Salary Range (LPA)</h2>
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                                <p className="text-xs text-slate-500">P10 (Entry)</p>
                                <p className="text-2xl font-bold text-red-400">₹{career.salary_p10}L</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500">P50 (Median)</p>
                                <p className="text-2xl font-bold text-yellow-400">₹{career.salary_p50}L</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500">P90 (Top)</p>
                                <p className="text-2xl font-bold text-green-400">₹{career.salary_p90}L</p>
                            </div>
                        </div>
                        <div className="mt-4 h-2 bg-slate-700 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full" style={{ width: '100%' }} />
                        </div>
                    </div>

                    {/* Honest Mirror — Green/Yellow/Red */}
                    <div className="space-y-4">
                        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">The Honest Mirror</h2>
                        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-5">
                            <p className="text-xs font-bold text-green-400 uppercase mb-2">🟢 Natural Advantages</p>
                            {career.green_zone.map((g, i) => (
                                <p key={i} className="text-green-200 text-sm mb-1">• {g}</p>
                            ))}
                        </div>
                        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-5">
                            <p className="text-xs font-bold text-yellow-400 uppercase mb-2">🟡 Skills to Build</p>
                            {career.yellow_zone.map((y, i) => (
                                <p key={i} className="text-yellow-200 text-sm mb-1">• {y}</p>
                            ))}
                        </div>
                        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5">
                            <p className="text-xs font-bold text-red-400 uppercase mb-2">🔴 Honest Challenge</p>
                            {career.red_zone.map((r, i) => (
                                <p key={i} className="text-red-200 text-sm mb-1">• {r}</p>
                            ))}
                        </div>
                    </div>

                    {/* Entry Paths by Tier */}
                    <div className="bg-slate-800/60 rounded-2xl p-6">
                        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Entry Paths by College Tier</h2>
                        <div className="space-y-3">
                            {Object.entries(career.entry_paths).map(([tier, path]) => (
                                <div key={tier} className="flex gap-3">
                                    <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded font-mono shrink-0 h-fit">
                                        {tier.toUpperCase()}
                                    </span>
                                    <p className="text-slate-300 text-sm">{path}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* A Real Monday */}
                    <div className="bg-slate-800/60 rounded-2xl p-6">
                        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
                            📄 A Real Monday at 9am
                        </h2>
                        <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">{career.day_in_life}</p>
                    </div>

                    {/* Top Companies */}
                    <div className="bg-slate-800/60 rounded-2xl p-6">
                        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
                            Top 10 Indian Companies Hiring
                        </h2>
                        <div className="grid grid-cols-2 gap-3">
                            {career.top_companies.map(c => (
                                <div key={c.name} className="bg-slate-700/50 rounded-lg p-3">
                                    <p className="text-white font-medium text-sm">{c.name}</p>
                                    <p className="text-slate-400 text-xs">{c.ctc_range}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Skills & Timeline */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-slate-800/60 rounded-2xl p-6">
                            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Skills Required</h2>
                            <div className="flex flex-wrap gap-2">
                                {career.skills_required.map(s => (
                                    <span key={s} className="bg-indigo-500/20 text-indigo-300 text-xs px-3 py-1.5 rounded-full">{s}</span>
                                ))}
                            </div>
                        </div>
                        <div className="bg-slate-800/60 rounded-2xl p-6">
                            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Quick Facts</h2>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Timeline to first hire</span>
                                    <span className="text-white font-medium">{career.timeline_months} months</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">AI Automation Risk</span>
                                    <span className={`font-medium ${career.ai_automation_risk === 'Low' ? 'text-green-400' : career.ai_automation_risk === 'Medium' ? 'text-yellow-400' : 'text-red-400'}`}>
                                        {career.ai_automation_risk}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Remote Friendly</span>
                                    <span className="text-white font-medium">{career.remote_friendly ? '✅ Yes' : '❌ No'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CTA */}
                    <motion.button
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg shadow-indigo-500/25"
                        onClick={() => window.location.href = '/learn'}
                    >
                        Start My Roadmap for {career.title} →
                    </motion.button>
                </div>
            </main>
            <BottomNav />
        </div>
    );
}
