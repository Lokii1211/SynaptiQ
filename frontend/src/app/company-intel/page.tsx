'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { api, auth } from '@/lib/api';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';

export default function CompanyIntelPage() {
    const [companies, setCompanies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!auth.isLoggedIn()) { window.location.href = '/login'; return; }
        api.getCompanies().then(data => {
            setCompanies(data.companies || []);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1 pb-24 md:pb-8">
                    <div className="bg-white border-b border-slate-200 px-6 py-6">
                        <h1 className="text-2xl font-bold text-slate-900 mb-2">🏢 Company Intel</h1>
                        <p className="text-slate-500 text-sm">Honest salary data, culture reviews, and interview processes</p>
                    </div>

                    <div className="px-4 md:px-6 py-6 max-w-5xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {loading ? (
                            [1, 2, 3, 4, 5, 6].map(i => <div key={i} className="st-card p-6 animate-pulse h-40" />)
                        ) : companies.length === 0 ? (
                            <div className="col-span-full text-center py-12">
                                <span className="text-4xl block mb-3">🏢</span>
                                <p className="text-slate-500">Company data coming soon!</p>
                            </div>
                        ) : (
                            companies.map((company, i) => (
                                <motion.div key={company.slug || i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.06 }}
                                    className="st-card p-6 hover:shadow-xl group cursor-pointer"
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center text-lg font-bold text-slate-600">
                                            {company.name?.[0]}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">{company.name}</h3>
                                            <p className="text-xs text-slate-500">{company.industry || 'Technology'}</p>
                                        </div>
                                    </div>
                                    {company.avg_rating && (
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="flex gap-0.5">
                                                {[1, 2, 3, 4, 5].map(s => (
                                                    <span key={s} className={`text-sm ${s <= Math.round(company.avg_rating) ? 'text-yellow-400' : 'text-slate-200'}`}>★</span>
                                                ))}
                                            </div>
                                            <span className="text-xs text-slate-500">{company.avg_rating.toFixed(1)}</span>
                                        </div>
                                    )}
                                    <div className="flex flex-wrap gap-2">
                                        {company.headquarters && <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">📍 {company.headquarters}</span>}
                                        {company.employee_count && <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">👥 {company.employee_count}</span>}
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </main>
                <BottomNav />
            </div>
        </div>
    );
}
