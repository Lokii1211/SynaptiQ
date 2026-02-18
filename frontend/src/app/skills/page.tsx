"use client";

import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";

interface SkillGapResult {
    target_career: string;
    required_skills: { skill: string; importance: string; has: boolean }[];
    skill_match_percentage: number;
    missing_critical: string[];
    learning_path: { step: number; skill: string; resource: string; duration: string; type: string; free: boolean }[];
    timeline_months: number;
    estimated_readiness: string;
    quick_wins: string[];
}

function SkillGapContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [targetCareer, setTargetCareer] = useState(searchParams.get("career") || "");
    const [skillInput, setSkillInput] = useState("");
    const [currentSkills, setCurrentSkills] = useState<string[]>([]);
    const [result, setResult] = useState<SkillGapResult | null>(null);
    const [loading, setLoading] = useState(false);

    const addSkill = () => {
        const s = skillInput.trim();
        if (s && !currentSkills.includes(s)) {
            setCurrentSkills([...currentSkills, s]);
            setSkillInput("");
        }
    };

    const removeSkill = (s: string) => setCurrentSkills(currentSkills.filter((x) => x !== s));

    const analyze = async () => {
        if (!targetCareer.trim() || currentSkills.length === 0) return;
        const token = localStorage.getItem("token");
        if (!token) { router.push("/signup"); return; }

        setLoading(true);
        try {
            const data = await api.skillGapAnalysis({ current_skills: currentSkills, target_career: targetCareer });
            setResult(data);
        } catch (err: any) {
            if (err.message.includes("401")) router.push("/login");
            else alert("Error: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const importanceColor = (imp: string) => {
        if (imp === "critical") return "text-red-400 bg-red-500/10 border-red-500/20";
        if (imp === "important") return "text-amber-400 bg-amber-500/10 border-amber-500/20";
        return "text-gray-400 bg-gray-500/10 border-gray-500/20";
    };

    return (
        <div className="min-h-screen bg-[#0a0a0f]">
            <nav className="border-b border-white/5 sticky top-0 z-50 glass-strong">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2.5">
                        <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-lg font-bold">S</div>
                        <span className="text-xl font-bold">Skill<span className="text-indigo-400">Sync</span></span>
                    </Link>
                    <div className="hidden md:flex items-center gap-8">
                        <Link href="/careers" className="text-gray-400 hover:text-white transition text-sm">Careers</Link>
                        <Link href="/assessment" className="text-gray-400 hover:text-white transition text-sm">Assessment</Link>
                        <Link href="/skills" className="text-white font-medium text-sm">Skill Gap</Link>
                        <Link href="/chat" className="text-gray-400 hover:text-white transition text-sm">AI Chat</Link>
                    </div>
                    <Link href="/signup" className="btn-primary text-sm !py-2 !px-4">Get Started</Link>
                </div>
            </nav>

            <main className="max-w-5xl mx-auto px-6 py-12">
                <div className="mb-10 animate-fadeInUp">
                    <h1 className="text-4xl font-bold mb-3">Skill Gap Analyzer</h1>
                    <p className="text-gray-400 text-lg">Enter your current skills and target career — AI will create your personalized learning roadmap.</p>
                </div>

                {/* Input Form */}
                <div className="card mb-8 animate-fadeInUp">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Target Career</label>
                            <input type="text" className="input-field" placeholder="e.g. Data Scientist" value={targetCareer}
                                onChange={(e) => setTargetCareer(e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Add Your Skills</label>
                            <div className="flex gap-2">
                                <input type="text" className="input-field flex-1" placeholder="e.g. Python" value={skillInput}
                                    onChange={(e) => setSkillInput(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())} />
                                <button onClick={addSkill} className="btn-secondary !px-4">Add</button>
                            </div>
                        </div>
                    </div>

                    {currentSkills.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                            {currentSkills.map((s) => (
                                <span key={s} className="px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-sm text-indigo-300 flex items-center gap-2">
                                    {s}
                                    <button onClick={() => removeSkill(s)} className="text-indigo-400 hover:text-white">×</button>
                                </span>
                            ))}
                        </div>
                    )}

                    <button onClick={analyze} disabled={loading || !targetCareer.trim() || currentSkills.length === 0}
                        className="btn-primary mt-6 disabled:opacity-40">
                        {loading ? "Analyzing..." : "Analyze Skill Gap →"}
                    </button>
                </div>

                {/* Results */}
                {result && (
                    <div className="space-y-6 stagger-children">
                        {/* Match Score */}
                        <div className="card text-center">
                            <h2 className="text-lg text-gray-400 mb-2">Skill Match for <span className="text-white font-bold">{result.target_career}</span></h2>
                            <div className="text-6xl font-bold gradient-text mb-4">{result.skill_match_percentage}%</div>
                            <div className="progress-bar max-w-md mx-auto">
                                <div className="progress-bar-fill" style={{ width: `${result.skill_match_percentage}%` }} />
                            </div>
                            <p className="text-gray-400 text-sm mt-4">{result.estimated_readiness}</p>
                        </div>

                        {/* Skills breakdown */}
                        <div className="card">
                            <h2 className="text-xl font-bold mb-4">Skills Breakdown</h2>
                            <div className="space-y-3">
                                {result.required_skills.map((skill) => (
                                    <div key={skill.skill} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${skill.has ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}>
                                            {skill.has ? "✓" : "✗"}
                                        </span>
                                        <span className="flex-1 font-medium">{skill.skill}</span>
                                        <span className={`px-2 py-0.5 rounded text-xs border ${importanceColor(skill.importance)}`}>
                                            {skill.importance}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Learning Path */}
                        <div className="card">
                            <h2 className="text-xl font-bold mb-2">Your Learning Roadmap</h2>
                            <p className="text-gray-400 text-sm mb-6">Estimated timeline: <span className="text-indigo-400 font-bold">{result.timeline_months} months</span></p>
                            <div className="space-y-4">
                                {result.learning_path.map((step) => (
                                    <div key={step.step} className="flex gap-4">
                                        <div className="flex flex-col items-center">
                                            <div className="w-8 h-8 bg-indigo-500/20 border border-indigo-500/30 rounded-full flex items-center justify-center text-sm font-bold text-indigo-400">
                                                {step.step}
                                            </div>
                                            {step.step < result.learning_path.length && <div className="w-px flex-1 bg-white/10 mt-2" />}
                                        </div>
                                        <div className="flex-1 pb-6">
                                            <h4 className="font-bold mb-1">{step.skill}</h4>
                                            <p className="text-gray-400 text-sm mb-2">{step.resource}</p>
                                            <div className="flex gap-3 text-xs">
                                                <span className="text-gray-500">⏱️ {step.duration}</span>
                                                <span className="text-gray-500 capitalize">📖 {step.type}</span>
                                                <span className={step.free ? "text-emerald-400" : "text-amber-400"}>
                                                    {step.free ? "🆓 Free" : "💰 Paid"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Wins */}
                        {result.quick_wins && result.quick_wins.length > 0 && (
                            <div className="card bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-emerald-500/20">
                                <h2 className="text-xl font-bold mb-4">⚡ Quick Wins (Start Today!)</h2>
                                <ul className="space-y-2">
                                    {result.quick_wins.map((win, i) => (
                                        <li key={i} className="flex items-center gap-2 text-gray-300">
                                            <span className="w-5 h-5 bg-emerald-500/20 rounded-full flex items-center justify-center text-xs text-emerald-400">✓</span>
                                            {win}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}

export default function SkillsPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
                <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
        }>
            <SkillGapContent />
        </Suspense>
    );
}
