"use client";

import Link from "next/link";
import { useState, useEffect, use } from "react";
import { api } from "@/lib/api";

interface CareerDetail {
    id: string;
    title: string;
    slug: string;
    category: string;
    icon: string;
    description: string;
    day_in_life: string;
    required_skills: string[];
    required_education: { degree: string; field: string; duration: string }[];
    salary_range: { min: number; max: number; formatted: string };
    growth_outlook: string;
    demand_score: number;
    top_companies: string[];
    entrance_exams: string[];
    related_courses: string[];
}

export default function CareerDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const [career, setCareer] = useState<CareerDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.getCareerDetail(slug).then(setCareer).catch(console.error).finally(() => setLoading(false));
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-400">Loading career details...</p>
                </div>
            </div>
        );
    }

    if (!career) {
        return (
            <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
                <div className="text-center">
                    <div className="text-5xl mb-4">😔</div>
                    <h2 className="text-xl font-bold mb-2">Career not found</h2>
                    <Link href="/careers" className="text-indigo-400 hover:underline">← Back to Career Explorer</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0f]">
            {/* Nav */}
            <nav className="border-b border-white/5 sticky top-0 z-50 glass-strong">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2.5">
                        <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-lg font-bold">S</div>
                        <span className="text-xl font-bold">Skill<span className="text-indigo-400">Sync</span></span>
                    </Link>
                    <Link href="/careers" className="text-gray-400 hover:text-white transition text-sm flex items-center gap-1">← Back to Careers</Link>
                </div>
            </nav>

            <main className="max-w-5xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="flex items-start gap-6 mb-10 animate-fadeInUp">
                    <div className="text-6xl">{career.icon}</div>
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 rounded-lg text-indigo-400 text-xs font-medium capitalize">{career.category}</span>
                            <span className={`px-3 py-1 rounded-lg text-xs font-medium ${career.growth_outlook === 'high' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                                {career.growth_outlook === 'high' ? '🔥 High Growth' : '📊 Moderate Growth'}
                            </span>
                        </div>
                        <h1 className="text-4xl font-bold mb-3">{career.title}</h1>
                        <p className="text-gray-400 text-lg leading-relaxed">{career.description}</p>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10 stagger-children">
                    <div className="card text-center">
                        <div className="text-xs text-gray-500 mb-1">Salary Range</div>
                        <div className="text-2xl font-bold text-emerald-400">{career.salary_range.formatted}</div>
                    </div>
                    <div className="card text-center">
                        <div className="text-xs text-gray-500 mb-1">Market Demand</div>
                        <div className="text-2xl font-bold text-indigo-400">{career.demand_score}/100</div>
                        <div className="progress-bar mt-2">
                            <div className="progress-bar-fill" style={{ width: `${career.demand_score}%` }} />
                        </div>
                    </div>
                    <div className="card text-center col-span-2 md:col-span-1">
                        <div className="text-xs text-gray-500 mb-1">Growth Outlook</div>
                        <div className="text-2xl font-bold capitalize">{career.growth_outlook}</div>
                    </div>
                </div>

                {/* Day in Life */}
                {career.day_in_life && (
                    <div className="card mb-6 animate-fadeInUp">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">🌅 A Day in the Life</h2>
                        <p className="text-gray-400 leading-relaxed">{career.day_in_life}</p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Required Skills */}
                    <div className="card animate-fadeInUp">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">🛠️ Required Skills</h2>
                        <div className="flex flex-wrap gap-2">
                            {career.required_skills?.map((skill) => (
                                <span key={skill} className="px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-sm text-indigo-300">{skill}</span>
                            ))}
                        </div>
                    </div>

                    {/* Top Companies */}
                    <div className="card animate-fadeInUp">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">🏢 Top Companies</h2>
                        <div className="flex flex-wrap gap-2">
                            {career.top_companies?.map((company) => (
                                <span key={company} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300">{company}</span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                    {/* Education Paths */}
                    <div className="card animate-fadeInUp">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">🎓 Education Paths</h2>
                        <div className="space-y-3">
                            {career.required_education?.map((edu, i) => (
                                <div key={i} className="p-3 bg-white/5 rounded-lg">
                                    <div className="font-medium">{edu.degree}</div>
                                    <div className="text-sm text-gray-400">{edu.field} • {edu.duration}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Entrance Exams & Courses */}
                    <div className="card animate-fadeInUp">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">📚 Exams & Courses</h2>
                        {career.entrance_exams?.length > 0 && (
                            <div className="mb-4">
                                <div className="text-xs text-gray-500 mb-2 uppercase tracking-wide">Entrance Exams</div>
                                <div className="flex flex-wrap gap-2">
                                    {career.entrance_exams.map((exam) => (
                                        <span key={exam} className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-lg text-sm text-amber-300">{exam}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                        {career.related_courses?.length > 0 && (
                            <div>
                                <div className="text-xs text-gray-500 mb-2 uppercase tracking-wide">Related Courses</div>
                                <div className="flex flex-wrap gap-2">
                                    {career.related_courses.map((course) => (
                                        <span key={course} className="px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-lg text-sm text-cyan-300">{course}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* CTA */}
                <div className="card bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-indigo-500/20 text-center">
                    <h3 className="text-2xl font-bold mb-3">Interested in becoming a {career.title}?</h3>
                    <p className="text-gray-400 mb-6">Take our AI assessment to see how well this career matches your personality and skills.</p>
                    <div className="flex items-center justify-center gap-4">
                        <Link href="/assessment" className="btn-primary">Take Assessment →</Link>
                        <Link href={`/skills?career=${encodeURIComponent(career.title)}`} className="btn-secondary">Analyze Skill Gap</Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
