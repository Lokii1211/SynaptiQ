'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { api, auth } from '@/lib/api';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';
import Link from 'next/link';

interface Internship {
    id: string;
    title: string;
    company: string;
    logo: string;
    location: string;
    stipend: string;
    duration: string;
    type: 'remote' | 'onsite' | 'hybrid';
    skills: string[];
    deadline: string;
    applicants: number;
    match: number; // AI match %
    featured?: boolean;
}

const MOCK_INTERNSHIPS: Internship[] = [
    {
        id: '1', title: 'Software Development Intern', company: 'Flipkart', logo: '🛒',
        location: 'Bangalore', stipend: '₹40,000/mo', duration: '6 months', type: 'onsite',
        skills: ['Java', 'Spring Boot', 'MySQL'], deadline: '5 days left', applicants: 342, match: 92, featured: true
    },
    {
        id: '2', title: 'Data Science Intern', company: 'Zomato', logo: '🍕',
        location: 'Gurgaon', stipend: '₹35,000/mo', duration: '3 months', type: 'hybrid',
        skills: ['Python', 'Pandas', 'SQL', 'ML'], deadline: '12 days left', applicants: 567, match: 85
    },
    {
        id: '3', title: 'Frontend Developer Intern', company: 'Razorpay', logo: '💳',
        location: 'Remote', stipend: '₹25,000/mo', duration: '3 months', type: 'remote',
        skills: ['React', 'TypeScript', 'CSS'], deadline: '8 days left', applicants: 423, match: 88
    },
    {
        id: '4', title: 'Backend Engineering Intern', company: 'Swiggy', logo: '🍔',
        location: 'Bangalore', stipend: '₹30,000/mo', duration: '6 months', type: 'onsite',
        skills: ['Go', 'Microservices', 'Redis'], deadline: '3 days left', applicants: 189, match: 78
    },
    {
        id: '5', title: 'ML/AI Research Intern', company: 'Google India', logo: '🔍',
        location: 'Hyderabad', stipend: '₹80,000/mo', duration: '4 months', type: 'onsite',
        skills: ['Python', 'TensorFlow', 'NLP', 'Research'], deadline: '20 days left', applicants: 1200, match: 72, featured: true
    },
    {
        id: '6', title: 'Product Management Intern', company: 'PhonePe', logo: '📱',
        location: 'Bangalore', stipend: '₹45,000/mo', duration: '3 months', type: 'hybrid',
        skills: ['Analytics', 'SQL', 'Communication'], deadline: '15 days left', applicants: 278, match: 65
    },
    {
        id: '7', title: 'DevOps Intern', company: 'Freshworks', logo: '🔧',
        location: 'Chennai', stipend: '₹28,000/mo', duration: '6 months', type: 'onsite',
        skills: ['Docker', 'AWS', 'Linux', 'CI/CD'], deadline: '10 days left', applicants: 145, match: 71
    },
    {
        id: '8', title: 'Full Stack Developer Intern', company: 'Meesho', logo: '🛍️',
        location: 'Remote', stipend: '₹20,000/mo', duration: '3 months', type: 'remote',
        skills: ['React', 'Node.js', 'MongoDB'], deadline: '7 days left', applicants: 890, match: 82
    },
];

const TYPE_STYLES = {
    remote: { bg: 'bg-green-50', text: 'text-green-700', label: '🏠 Remote' },
    onsite: { bg: 'bg-blue-50', text: 'text-blue-700', label: '🏢 Onsite' },
    hybrid: { bg: 'bg-purple-50', text: 'text-purple-700', label: '🔀 Hybrid' },
};

export default function InternshipsPage() {
    const [internships] = useState<Internship[]>(MOCK_INTERNSHIPS);
    const [filter, setFilter] = useState<'all' | 'remote' | 'onsite' | 'hybrid'>('all');
    const [sortBy, setSortBy] = useState<'match' | 'stipend' | 'deadline'>('match');
    const [saved, setSaved] = useState<Set<string>>(new Set());

    useEffect(() => {
        if (!auth.isLoggedIn()) { window.location.href = '/login'; return; }
    }, []);

    const toggleSave = (id: string) => {
        setSaved(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const filtered = internships
        .filter(i => filter === 'all' || i.type === filter)
        .sort((a, b) => {
            if (sortBy === 'match') return b.match - a.match;
            if (sortBy === 'stipend') return parseInt(b.stipend.replace(/\D/g, '')) - parseInt(a.stipend.replace(/\D/g, ''));
            return 0;
        });

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1 pb-24 md:pb-8">
                    {/* Hero */}
                    <div className="bg-gradient-to-br from-teal-500 via-cyan-600 to-blue-600 text-white px-6 py-10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
                        <div className="max-w-3xl mx-auto relative z-10">
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                                <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full mb-3 inline-block">🎯 INTERNSHIPS</span>
                                <h1 className="text-3xl font-bold mb-2">Find Your Internship</h1>
                                <p className="text-white/60 text-sm mb-4">AI-matched internships from top Indian companies. Sorted by how well they fit your profile.</p>
                                <div className="flex items-center gap-4 text-sm">
                                    <span className="bg-white/15 px-3 py-1 rounded-full">{internships.length} active listings</span>
                                    <span className="bg-white/15 px-3 py-1 rounded-full">Updated daily</span>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    <div className="px-4 md:px-6 py-6 max-w-3xl mx-auto">
                        {/* Filters */}
                        <div className="flex flex-col sm:flex-row gap-3 mb-5">
                            <div className="flex gap-2 flex-1">
                                {(['all', 'remote', 'onsite', 'hybrid'] as const).map(f => (
                                    <button key={f} onClick={() => setFilter(f)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${filter === f
                                            ? 'bg-indigo-600 text-white' : 'bg-white text-slate-500 border border-slate-200 hover:border-indigo-200'
                                            }`}>{f}</button>
                                ))}
                            </div>
                            <select value={sortBy} onChange={e => setSortBy(e.target.value as any)}
                                className="st-input text-xs py-1.5 w-auto">
                                <option value="match">Sort: Best Match</option>
                                <option value="stipend">Sort: Highest Stipend</option>
                                <option value="deadline">Sort: Deadline</option>
                            </select>
                        </div>

                        {/* Cards */}
                        <div className="space-y-3">
                            {filtered.map((intern, i) => {
                                const typeStyle = TYPE_STYLES[intern.type];
                                return (
                                    <motion.div key={intern.id}
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className={`st-card p-5 hover:shadow-lg transition-all ${intern.featured ? 'border-l-4 border-l-amber-400' : ''}`}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-2xl shrink-0">
                                                {intern.logo}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    {intern.featured && (
                                                        <span className="text-[9px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-bold">⭐ FEATURED</span>
                                                    )}
                                                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${typeStyle.bg} ${typeStyle.text}`}>
                                                        {typeStyle.label}
                                                    </span>
                                                </div>
                                                <h3 className="font-bold text-slate-900 text-sm mb-0.5">{intern.title}</h3>
                                                <p className="text-xs text-slate-500">{intern.company} · {intern.location}</p>

                                                {/* Skills */}
                                                <div className="flex flex-wrap gap-1.5 mt-2">
                                                    {intern.skills.map(skill => (
                                                        <span key={skill} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{skill}</span>
                                                    ))}
                                                </div>

                                                {/* Meta row */}
                                                <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                                                    <span className="font-semibold text-emerald-600">{intern.stipend}</span>
                                                    <span>📅 {intern.duration}</span>
                                                    <span>⏰ {intern.deadline}</span>
                                                    <span className="text-slate-400">{intern.applicants} applied</span>
                                                </div>
                                            </div>

                                            {/* Match + Actions */}
                                            <div className="text-right shrink-0 flex flex-col items-end gap-2">
                                                {/* Match Score */}
                                                <div className={`px-2.5 py-1 rounded-lg text-xs font-bold ${intern.match >= 85 ? 'bg-green-50 text-green-700'
                                                    : intern.match >= 70 ? 'bg-blue-50 text-blue-700'
                                                        : 'bg-slate-50 text-slate-600'
                                                    }`}>
                                                    {intern.match}% match
                                                </div>
                                                <button onClick={() => toggleSave(intern.id)}
                                                    className={`text-lg transition-all ${saved.has(intern.id) ? 'text-red-500' : 'text-slate-300 hover:text-red-400'}`}>
                                                    {saved.has(intern.id) ? '❤️' : '🤍'}
                                                </button>
                                            </div>
                                        </div>

                                        {/* CTA */}
                                        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100">
                                            <button className="st-btn-primary text-xs px-4 py-2 flex-1">Apply Now →</button>
                                            <button className="st-btn-secondary text-xs px-4 py-2">View Details</button>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {filtered.length === 0 && (
                            <div className="text-center py-16">
                                <span className="text-5xl block mb-4">🔍</span>
                                <p className="text-slate-500 text-lg">No internships match your filter</p>
                                <p className="text-slate-400 text-sm">Try a different filter or check back tomorrow</p>
                            </div>
                        )}

                        {/* Bottom CTA */}
                        <div className="mt-8 st-card p-6 text-center bg-gradient-to-br from-indigo-50 to-violet-50 border-indigo-100">
                            <span className="text-3xl block mb-2">💡</span>
                            <h3 className="font-bold text-slate-900 mb-1">Want better matches?</h3>
                            <p className="text-sm text-slate-500 mb-3">Complete your assessment and verify skills to get more accurate AI matching.</p>
                            <div className="flex gap-2 justify-center">
                                <Link href="/assessment" className="st-btn-primary text-xs px-4 py-2">Take Assessment</Link>
                                <Link href="/skills" className="st-btn-secondary text-xs px-4 py-2">Verify Skills</Link>
                            </div>
                        </div>
                    </div>
                </main>
                <BottomNav />
            </div>
        </div>
    );
}
