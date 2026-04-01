'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { api, auth } from '@/lib/api';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { formatSalaryRange } from '@/lib/utils/india';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';

export default function JobsPage() {
    const { isReady } = useAuthGuard();
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({ type: '', location: '' });

    useEffect(() => {
        if (!isReady) return;
        api.getJobs().then((data) => {
            setJobs(data.jobs || []);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, [isReady]);

    const filteredJobs = jobs.filter(j => {
        if (filter.type && j.job_type !== filter.type) return false;
        if (filter.location && !j.location?.toLowerCase().includes(filter.location.toLowerCase())) return false;
        return true;
    });

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1 pb-24 md:pb-8">
                    <div className="bg-white border-b border-slate-200 px-6 py-6">
                        <h1 className="text-2xl font-bold text-slate-900 mb-2">💼 Jobs Board</h1>
                        <p className="text-slate-500 text-sm">Fresh openings curated for Indian freshers</p>

                        {/* Filters */}
                        <div className="flex gap-3 mt-4 overflow-x-auto no-scrollbar">
                            {['All', 'Full-time', 'Internship', 'Contract'].map(type => (
                                <button key={type}
                                    onClick={() => setFilter(f => ({ ...f, type: type === 'All' ? '' : type.toLowerCase() }))}
                                    className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${(type === 'All' && !filter.type) || filter.type === type.toLowerCase()
                                            ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                        }`}
                                >{type}</button>
                            ))}
                        </div>
                    </div>

                    <div className="px-4 md:px-6 py-6 max-w-4xl mx-auto space-y-3">
                        {loading ? (
                            <div className="space-y-3">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="st-card p-5 animate-pulse">
                                        <div className="h-5 bg-slate-200 rounded w-3/4 mb-3" />
                                        <div className="h-4 bg-slate-100 rounded w-1/2 mb-2" />
                                        <div className="h-4 bg-slate-100 rounded w-1/3" />
                                    </div>
                                ))}
                            </div>
                        ) : filteredJobs.length === 0 ? (
                            <div className="text-center py-12">
                                <span className="text-4xl mb-4 block">🔍</span>
                                <p className="text-slate-500">No jobs found. Try adjusting your filters.</p>
                            </div>
                        ) : (
                            filteredJobs.map((job, i) => (
                                <motion.div key={job.id || i}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                >
                                    <div className="st-card p-5 hover:shadow-lg cursor-pointer group">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <h3 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">{job.title}</h3>
                                                <p className="text-sm text-slate-500">{job.company_name}</p>
                                            </div>
                                            {job.match_score && (
                                                <span className={`text-sm font-bold px-2 py-1 rounded-lg ${job.match_score >= 80 ? 'bg-green-50 text-green-700' : 'bg-indigo-50 text-indigo-700'
                                                    }`}>{job.match_score}% match</span>
                                            )}
                                        </div>
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md">📍 {job.location || 'Remote'}</span>
                                            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md">💰 {formatSalaryRange(job.ctc_min, job.ctc_max)}</span>
                                            {job.job_type && <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md">{job.job_type}</span>}
                                        </div>
                                        {job.required_skills && (
                                            <div className="flex flex-wrap gap-1.5">
                                                {(Array.isArray(job.required_skills) ? job.required_skills : []).slice(0, 5).map((skill: string) => (
                                                    <span key={skill} className="text-[11px] bg-violet-50 text-violet-700 px-2 py-0.5 rounded-md font-medium">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
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
