'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { api, auth } from '@/lib/api';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';
import { SideNav } from '@/components/layout/SideNav';

interface CompanyDetail {
    slug: string;
    name: string;
    logo: string;
    industry: string;
    size: string;
    hq: string;
    founded: number;
    description: string;
    glassdoor_rating: number;
    interview_difficulty: string;
    hiring_for: string[];
    salary_range: { role: string; min: number; max: number }[];
    interview_rounds: string[];
    red_flags: string[];
    green_flags: string[];
    culture_tags: string[];
    work_life_balance: number;
    growth_opportunities: number;
    reviews_count: number;
}

const COMPANY_DATA: Record<string, CompanyDetail> = {
    'default': {
        slug: 'company',
        name: 'Tech Company',
        logo: '🏢',
        industry: 'Technology',
        size: '10,000+ employees',
        hq: 'Bangalore, India',
        founded: 2010,
        description: 'A leading technology company focused on building products for millions of Indian users.',
        glassdoor_rating: 3.8,
        interview_difficulty: 'Medium-Hard',
        hiring_for: ['SWE', 'Data Analyst', 'Product Manager', 'QA Engineer', 'DevOps'],
        salary_range: [
            { role: 'SWE (Fresher)', min: 8, max: 18 },
            { role: 'SWE (2yr)', min: 14, max: 28 },
            { role: 'Data Analyst', min: 6, max: 14 },
            { role: 'Product Manager', min: 15, max: 30 },
        ],
        interview_rounds: [
            'Online assessment (DSA + aptitude) — 90 min',
            'Technical Round 1 — DSA + problem solving',
            'Technical Round 2 — System Design',
            'HR + Culture Fit Round',
        ],
        red_flags: ['Long working hours during product launches', 'Some teams have stack ranking performance reviews'],
        green_flags: ['Strong learning culture', 'Internal mobility encouraged', 'ESOP grants for early engineers'],
        culture_tags: ['Fast-paced', 'Startup culture', 'Data-driven', 'Competitive'],
        work_life_balance: 3.2,
        growth_opportunities: 4.1,
        reviews_count: 247,
    },
};

export default function CompanyDetailPage() {
    const params = useParams();
    const slug = params.slug as string;
    const [company, setCompany] = useState<CompanyDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                const data = await api.getCompanyDetail(slug);
                setCompany(data);
            } catch {
                setCompany({ ...COMPANY_DATA['default'], slug, name: slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') });
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [slug]);

    if (loading) return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-indigo-300 border-t-indigo-600 rounded-full animate-spin" />
        </div>
    );

    if (!company) return null;

    const renderStars = (rating: number) => {
        return '★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating));
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <TopBar />
            <SideNav />
            <main className="md:ml-56 pb-24 md:pb-8">
                {/* Hero */}
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 px-6 py-10 border-b border-slate-700">
                    <div className="max-w-3xl mx-auto flex items-start gap-4">
                        <span className="text-5xl">{company.logo}</span>
                        <div>
                            <h1 className="text-3xl font-bold">{company.name}</h1>
                            <p className="text-slate-400 mt-1">{company.industry} · {company.size} · HQ: {company.hq}</p>
                            <div className="flex items-center gap-4 mt-3">
                                <span className="text-yellow-400 text-lg">{renderStars(company.glassdoor_rating)}</span>
                                <span className="text-slate-500 text-sm">{company.glassdoor_rating}/5 ({company.reviews_count} reviews)</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
                    {/* About */}
                    <div className="bg-slate-800/60 rounded-2xl p-6">
                        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">About</h2>
                        <p className="text-slate-300 text-sm leading-relaxed">{company.description}</p>
                        <div className="flex flex-wrap gap-2 mt-4">
                            {company.culture_tags.map(t => (
                                <span key={t} className="bg-indigo-500/20 text-indigo-300 text-xs px-3 py-1 rounded-full">{t}</span>
                            ))}
                        </div>
                    </div>

                    {/* Salary Intel */}
                    <div className="bg-slate-800/60 rounded-2xl p-6">
                        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">💰 Salary Intelligence (LPA)</h2>
                        <div className="space-y-3">
                            {company.salary_range.map(s => (
                                <div key={s.role} className="flex items-center justify-between">
                                    <span className="text-slate-300 text-sm">{s.role}</span>
                                    <span className="text-green-400 font-medium text-sm">₹{s.min}L — ₹{s.max}L</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Interview Process */}
                    <div className="bg-slate-800/60 rounded-2xl p-6">
                        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">🎯 Interview Process</h2>
                        <p className="text-xs text-slate-500 mb-3">Difficulty: {company.interview_difficulty}</p>
                        <div className="space-y-3">
                            {company.interview_rounds.map((round, i) => (
                                <div key={i} className="flex gap-3 items-start">
                                    <span className="bg-indigo-600 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                                    <p className="text-slate-300 text-sm">{round}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Honest Flags */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-5">
                            <p className="text-xs font-bold text-green-400 uppercase mb-3">🟢 Green Flags</p>
                            {company.green_flags.map((f, i) => (
                                <p key={i} className="text-green-200 text-sm mb-1">• {f}</p>
                            ))}
                        </div>
                        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5">
                            <p className="text-xs font-bold text-red-400 uppercase mb-3">🔴 Red Flags</p>
                            {company.red_flags.map((f, i) => (
                                <p key={i} className="text-red-200 text-sm mb-1">• {f}</p>
                            ))}
                        </div>
                    </div>

                    {/* Ratings */}
                    <div className="bg-slate-800/60 rounded-2xl p-6">
                        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Ratings</h2>
                        <div className="space-y-3">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-slate-400">Work-Life Balance</span>
                                    <span className="text-white">{company.work_life_balance}/5</span>
                                </div>
                                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                    <motion.div initial={{ width: 0 }} animate={{ width: `${(company.work_life_balance / 5) * 100}%` }}
                                        transition={{ duration: 1 }} className="h-full bg-indigo-500 rounded-full" />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-slate-400">Growth Opportunities</span>
                                    <span className="text-white">{company.growth_opportunities}/5</span>
                                </div>
                                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                    <motion.div initial={{ width: 0 }} animate={{ width: `${(company.growth_opportunities / 5) * 100}%` }}
                                        transition={{ duration: 1 }} className="h-full bg-green-500 rounded-full" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Active Roles */}
                    <div className="bg-slate-800/60 rounded-2xl p-6">
                        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Currently Hiring For</h2>
                        <div className="flex flex-wrap gap-2">
                            {company.hiring_for.map(role => (
                                <span key={role} className="bg-green-500/20 text-green-300 text-xs px-3 py-1.5 rounded-full">{role}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
            <BottomNav />
        </div>
    );
}
