"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [assessmentData, setAssessmentData] = useState<any>(null);
    const [trendingSkills, setTrendingSkills] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) { router.push("/login"); return; }

        const savedUser = localStorage.getItem("user");
        if (savedUser) setUser(JSON.parse(savedUser));

        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            const [me, assessment, skills] = await Promise.all([
                api.getMe().catch(() => null),
                api.getResults().catch(() => ({ has_results: false })),
                api.getTrendingSkills().catch(() => ({ skills: [] })),
            ]);
            if (me) setUser(me);
            setAssessmentData(assessment);
            setTrendingSkills(skills.skills || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/");
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
                <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
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
                    <div className="hidden md:flex items-center gap-8">
                        <Link href="/careers" className="text-gray-400 hover:text-white transition text-sm">Careers</Link>
                        <Link href="/assessment" className="text-gray-400 hover:text-white transition text-sm">Assessment</Link>
                        <Link href="/skills" className="text-gray-400 hover:text-white transition text-sm">Skill Gap</Link>
                        <Link href="/chat" className="text-gray-400 hover:text-white transition text-sm">AI Chat</Link>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <div className="text-sm font-medium">{user?.name || "User"}</div>
                            <div className="text-xs text-gray-500">{user?.email}</div>
                        </div>
                        <button onClick={logout} className="text-gray-400 hover:text-white text-sm transition">Logout</button>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-10">
                {/* Welcome */}
                <div className="mb-10 animate-fadeInUp">
                    <h1 className="text-3xl font-bold mb-2">Welcome back, <span className="gradient-text">{user?.name?.split(" ")[0] || "there"}</span> 👋</h1>
                    <p className="text-gray-400">Here&apos;s your career guidance dashboard</p>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 stagger-children">
                    <Link href="/assessment" className="card text-center hover:border-indigo-500/30 group">
                        <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">🧠</div>
                        <h3 className="font-bold text-sm">Career Assessment</h3>
                        <p className="text-xs text-gray-500 mt-1">{assessmentData?.has_results ? "Retake" : "Take now"}</p>
                    </Link>
                    <Link href="/careers" className="card text-center hover:border-cyan-500/30 group">
                        <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">🔍</div>
                        <h3 className="font-bold text-sm">Explore Careers</h3>
                        <p className="text-xs text-gray-500 mt-1">200+ profiles</p>
                    </Link>
                    <Link href="/skills" className="card text-center hover:border-emerald-500/30 group">
                        <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">📊</div>
                        <h3 className="font-bold text-sm">Skill Gap Analysis</h3>
                        <p className="text-xs text-gray-500 mt-1">Find your path</p>
                    </Link>
                    <Link href="/chat" className="card text-center hover:border-pink-500/30 group">
                        <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">💬</div>
                        <h3 className="font-bold text-sm">AI Chat</h3>
                        <p className="text-xs text-gray-500 mt-1">Ask anything</p>
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Assessment Results */}
                    <div className="lg:col-span-2">
                        {assessmentData?.has_results ? (
                            <div className="card animate-fadeInUp">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold">Your Career Matches</h2>
                                    <Link href="/assessment" className="text-indigo-400 text-sm hover:underline">Retake →</Link>
                                </div>
                                <div className="space-y-3">
                                    {assessmentData.top_careers?.slice(0, 5).map((career: any, i: number) => (
                                        <div key={i} className="flex items-center gap-4 p-3 bg-white/5 rounded-xl">
                                            <div className="w-10 h-10 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center text-lg font-bold text-indigo-400">
                                                {i + 1}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold">{career.title}</h4>
                                                <p className="text-sm text-gray-400">{career.avg_salary || ""}</p>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-lg font-bold text-emerald-400">{career.match_score}%</div>
                                                <div className="text-xs text-gray-500">match</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Personality chart */}
                                {assessmentData.personality_traits && (
                                    <div className="mt-6 pt-6 border-t border-white/5">
                                        <h3 className="font-bold mb-4">Personality Profile</h3>
                                        <div className="space-y-2">
                                            {Object.entries(assessmentData.personality_traits).map(([trait, score]: [string, any]) => (
                                                <div key={trait} className="flex items-center gap-3">
                                                    <span className="w-28 text-sm text-gray-400 capitalize">{trait}</span>
                                                    <div className="flex-1 progress-bar">
                                                        <div className="progress-bar-fill" style={{ width: `${score}%` }} />
                                                    </div>
                                                    <span className="text-xs text-gray-500 w-8 text-right">{score}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="card text-center py-16 animate-fadeInUp">
                                <div className="text-5xl mb-4">🧠</div>
                                <h2 className="text-xl font-bold mb-3">No Assessment Yet</h2>
                                <p className="text-gray-400 mb-6 max-w-md mx-auto">Take a 5-minute AI-powered assessment to discover your ideal career matches.</p>
                                <Link href="/assessment" className="btn-primary">Start Assessment →</Link>
                            </div>
                        )}
                    </div>

                    {/* Trending Skills Sidebar */}
                    <div className="space-y-6">
                        <div className="card animate-fadeInUp">
                            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">🔥 Trending Skills</h2>
                            <div className="space-y-3">
                                {trendingSkills.slice(0, 6).map((skill: any, i: number) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <span className="text-xs text-gray-600 w-4">{i + 1}</span>
                                        <div className="flex-1">
                                            <div className="text-sm font-medium">{skill.name}</div>
                                            <div className="text-xs text-gray-500">{skill.avg_salary}</div>
                                        </div>
                                        <span className="text-xs text-emerald-400 font-medium">{skill.growth}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="card bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/20 animate-fadeInUp">
                            <h3 className="font-bold mb-2">💡 Pro Tip</h3>
                            <p className="text-sm text-gray-400 leading-relaxed">
                                Combine your assessment results with skill gap analysis to build a personalized learning plan. Students who follow a structured path are 3x more likely to land their dream role.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
