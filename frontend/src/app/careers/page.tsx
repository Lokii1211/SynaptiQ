'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { api, auth } from '@/lib/api';
import { formatLPA } from '@/lib/utils/india';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';
import { SideNav } from '@/components/layout/SideNav';

export default function CareersPage() {
    const [careers, setCareers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.getCareers().then(data => {
            setCareers(data.careers || []);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    return (
        <div className="flex min-h-screen bg-slate-50">
            <SideNav />
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1 pb-24 md:pb-8">
                    <div className="bg-white border-b border-slate-200 px-6 py-6">
                        <h1 className="text-2xl font-bold text-slate-900 mb-2">🎯 Career Explorer</h1>
                        <p className="text-slate-500 text-sm">Discover career paths matched to your profile</p>
                    </div>

                    <div className="px-4 md:px-6 py-6 max-w-5xl mx-auto">
                        {loading ? (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {[1, 2, 3, 4, 5, 6].map(i => (
                                    <div key={i} className="st-card p-6 animate-pulse">
                                        <div className="h-6 bg-slate-200 rounded w-3/4 mb-3" />
                                        <div className="h-4 bg-slate-100 rounded w-full mb-2" />
                                        <div className="h-4 bg-slate-100 rounded w-2/3" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {careers.map((career, i) => (
                                    <motion.div key={career.slug || i}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.06 }}
                                    >
                                        <Link href={`/careers/${career.slug}`} className="block st-card p-6 hover:shadow-xl group h-full">
                                            <div className="flex items-start justify-between mb-3">
                                                <h3 className="font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors">
                                                    {career.title}
                                                </h3>
                                                {career.demand_score && (
                                                    <span className="text-xs font-semibold bg-green-50 text-green-700 px-2 py-1 rounded-md shrink-0">
                                                        {career.demand_score >= 80 ? '🔥 Hot' : '📈 Growing'}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-slate-500 line-clamp-2 mb-4">{career.description}</p>

                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {(career.required_skills || []).slice(0, 4).map((skill: string) => (
                                                    <span key={skill} className="text-[11px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md font-medium">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>

                                            <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
                                                <span>💰 {formatLPA(career.avg_salary_lpa || 8)} avg</span>
                                                <span className="text-indigo-600 font-medium group-hover:underline">Explore →</span>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </main>
                <BottomNav />
            </div>
        </div>
    );
}
