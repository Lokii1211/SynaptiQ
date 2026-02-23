'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { api, auth } from '@/lib/api';
import { formatSalaryRange } from '@/lib/utils/india';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';
import { SideNav } from '@/components/layout/SideNav';

export default function InternshipsPage() {
    const [internships, setInternships] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!auth.isLoggedIn()) { window.location.href = '/login'; return; }
        api.getInternships().then(data => {
            setInternships(data.internships || []);
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
                        <h1 className="text-2xl font-bold text-slate-900 mb-2">🎯 Internships</h1>
                        <p className="text-slate-500 text-sm">Curated internships with PPO conversion rates</p>
                    </div>
                    <div className="px-4 md:px-6 py-6 max-w-4xl mx-auto space-y-3">
                        {loading ? (
                            [1, 2, 3].map(i => <div key={i} className="st-card p-5 animate-pulse h-24" />)
                        ) : internships.length === 0 ? (
                            <div className="text-center py-12 st-card">
                                <span className="text-4xl block mb-3">🎯</span>
                                <p className="text-slate-500">No internships available right now</p>
                            </div>
                        ) : (
                            internships.map((intern: any, i: number) => (
                                <motion.div key={intern.id || i}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="st-card p-5 hover:shadow-lg"
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <h3 className="font-semibold text-slate-900">{intern.title}</h3>
                                            <p className="text-sm text-slate-500">{intern.company_name}</p>
                                        </div>
                                        {intern.ppo_rate !== undefined && (
                                            <span className="text-xs font-semibold bg-green-50 text-green-700 px-2 py-1 rounded-md">
                                                PPO: {intern.ppo_rate}%
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                                        <span>📍 {intern.location || 'Remote'}</span>
                                        <span>⏰ {intern.duration || '2-6 months'}</span>
                                        {intern.stipend && <span>💰 ₹{intern.stipend}/mo</span>}
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
