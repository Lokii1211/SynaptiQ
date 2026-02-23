'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { formatLPA } from '@/lib/utils/india';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';
import { SideNav } from '@/components/layout/SideNav';

export default function CareerDetailPage() {
    const params = useParams();
    const slug = params?.slug as string;
    const [career, setCareer] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!slug) return;
        api.getCareerDetail(slug).then(data => {
            setCareer(data);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, [slug]);

    if (loading) return (
        <div className="flex min-h-screen bg-slate-50">
            <SideNav />
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1 flex items-center justify-center">
                    <div className="w-12 h-12 border-3 border-slate-200 border-t-indigo-600 rounded-full animate-spin" />
                </main>
            </div>
        </div>
    );

    if (!career) return (
        <div className="flex min-h-screen bg-slate-50">
            <SideNav />
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1 flex flex-col items-center justify-center">
                    <span className="text-5xl mb-4">🔍</span>
                    <p className="text-xl font-bold text-slate-900 mb-2">Career not found</p>
                    <Link href="/careers" className="st-btn-primary mt-4 px-6">Browse Careers</Link>
                </main>
            </div>
        </div>
    );

    return (
        <div className="flex min-h-screen bg-slate-50">
            <SideNav />
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1 pb-24 md:pb-8">
                    {/* Hero */}
                    <div className="bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 text-white px-6 py-10">
                        <Link href="/careers" className="text-white/60 text-sm hover:text-white transition-colors mb-3 inline-block">← All Careers</Link>
                        <h1 className="text-3xl font-bold mb-2">{career.title}</h1>
                        <p className="text-white/70 text-sm max-w-2xl">{career.description}</p>
                        <div className="flex gap-4 mt-4">
                            {career.avg_salary_lpa && <span className="text-sm bg-white/20 px-3 py-1 rounded-lg">💰 {formatLPA(career.avg_salary_lpa)} avg</span>}
                            {career.demand_score && <span className="text-sm bg-white/20 px-3 py-1 rounded-lg">📈 Demand: {career.demand_score}/100</span>}
                        </div>
                    </div>

                    <div className="px-4 md:px-6 py-6 max-w-4xl mx-auto space-y-6">
                        {/* Skills */}
                        {career.required_skills?.length > 0 && (
                            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="st-card p-6">
                                <h2 className="font-bold text-slate-900 mb-3">⚙️ Required Skills</h2>
                                <div className="flex flex-wrap gap-2">
                                    {career.required_skills.map((skill: string) => (
                                        <span key={skill} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium border border-indigo-200">{skill}</span>
                                    ))}
                                </div>
                            </motion.section>
                        )}

                        {/* Career path */}
                        {career.career_path?.length > 0 && (
                            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="st-card p-6">
                                <h2 className="font-bold text-slate-900 mb-4">🗺️ Career Path</h2>
                                <div className="space-y-3">
                                    {career.career_path.map((step: any, i: number) => (
                                        <div key={i} className="flex gap-4">
                                            <div className="flex flex-col items-center">
                                                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-sm font-bold text-indigo-600">{i + 1}</div>
                                                {i < career.career_path.length - 1 && <div className="w-px flex-1 bg-slate-200 mt-1" />}
                                            </div>
                                            <div className="flex-1 pb-4">
                                                <h4 className="font-semibold text-slate-900 text-sm">{step.title || step}</h4>
                                                {step.years && <p className="text-xs text-slate-500">~{step.years} years</p>}
                                                {step.salary && <p className="text-xs text-indigo-600">{formatLPA(step.salary)}</p>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.section>
                        )}

                        {/* Top companies */}
                        {career.top_companies?.length > 0 && (
                            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="st-card p-6">
                                <h2 className="font-bold text-slate-900 mb-3">🏢 Top Companies Hiring</h2>
                                <div className="flex flex-wrap gap-2">
                                    {career.top_companies.map((company: string) => (
                                        <span key={company} className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium">{company}</span>
                                    ))}
                                </div>
                            </motion.section>
                        )}

                        {/* CTA */}
                        <div className="bg-indigo-50 rounded-2xl p-8 text-center border border-indigo-100">
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Ready to pursue {career.title}?</h3>
                            <p className="text-sm text-slate-500 mb-4">Take the assessment to see if this career matches your profile</p>
                            <Link href="/assessment" className="st-btn-primary px-8 inline-block">Take Assessment</Link>
                        </div>
                    </div>
                </main>
                <BottomNav />
            </div>
        </div>
    );
}
