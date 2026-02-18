"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

interface Question {
    id: number;
    question: string;
    category: string;
    options: { text: string; trait: string; score: number }[];
}

interface AssessmentResult {
    personality_summary: string;
    strengths: string[];
    work_style: string;
    top_careers: {
        title: string;
        match_score: number;
        why: string;
        avg_salary: string;
        growth: string;
        education_path: string;
        top_skills: string[];
    }[];
    personality_traits: Record<string, number>;
    advice: string;
}

export default function AssessmentPage() {
    const router = useRouter();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQ, setCurrentQ] = useState(0);
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [results, setResults] = useState<AssessmentResult | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [phase, setPhase] = useState<"intro" | "quiz" | "analyzing" | "results">("intro");

    useEffect(() => {
        api.getQuestions()
            .then((data) => setQuestions(data.questions))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const selectAnswer = (optionIndex: number) => {
        const qId = questions[currentQ].id;
        setAnswers({ ...answers, [qId.toString()]: optionIndex });

        if (currentQ < questions.length - 1) {
            setTimeout(() => setCurrentQ(currentQ + 1), 300);
        }
    };

    const handleSubmit = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/signup");
            return;
        }

        setPhase("analyzing");
        setSubmitting(true);
        try {
            const data = await api.submitAssessment(answers);
            setResults(data);
            setPhase("results");
        } catch (err: any) {
            if (err.message.includes("401") || err.message.includes("Authentication")) {
                router.push("/login");
            } else {
                alert("Error: " + err.message);
                setPhase("quiz");
            }
        } finally {
            setSubmitting(false);
        }
    };

    const progress = questions.length ? ((Object.keys(answers).length) / questions.length) * 100 : 0;
    const allAnswered = questions.length > 0 && Object.keys(answers).length === questions.length;

    // INTRO
    if (phase === "intro") {
        return (
            <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-6">
                <div className="fixed inset-0 pointer-events-none">
                    <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/8 rounded-full blur-[120px]" />
                </div>
                <div className="relative z-10 max-w-lg text-center animate-fadeInUp">
                    <div className="text-7xl mb-6">🧠</div>
                    <h1 className="text-3xl font-bold mb-4">AI Career Assessment</h1>
                    <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                        Answer 15 quick questions about your interests, work style, and values.
                        Our AI will analyze your responses and recommend your top 5 ideal careers.
                    </p>
                    <div className="flex items-center justify-center gap-6 text-sm text-gray-400 mb-8">
                        <span className="flex items-center gap-1.5">⏱️ 5 minutes</span>
                        <span className="flex items-center gap-1.5">📊 15 questions</span>
                        <span className="flex items-center gap-1.5">🤖 AI-powered</span>
                    </div>
                    <button onClick={() => setPhase("quiz")} className="btn-primary text-lg !py-4 !px-10">
                        Start Assessment →
                    </button>
                    <div className="mt-4">
                        <Link href="/" className="text-gray-500 text-sm hover:text-gray-300 transition">← Back to home</Link>
                    </div>
                </div>
            </div>
        );
    }

    // ANALYZING
    if (phase === "analyzing") {
        return (
            <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-6">
                <div className="text-center animate-fadeInUp">
                    <div className="w-16 h-16 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
                    <h2 className="text-2xl font-bold mb-3">Analyzing Your Profile</h2>
                    <p className="text-gray-400 max-w-md">Our AI is matching your personality, interests, and work style against 200+ career profiles...</p>
                </div>
            </div>
        );
    }

    // RESULTS
    if (phase === "results" && results) {
        const traitLabels: Record<string, string> = {
            analytical: "🔬 Analytical",
            creative: "🎨 Creative",
            social: "🤝 Social",
            enterprising: "🚀 Enterprising",
            conventional: "📊 Conventional",
            realistic: "🔧 Realistic",
        };
        const maxTrait = Math.max(...Object.values(results.personality_traits));

        return (
            <div className="min-h-screen bg-[#0a0a0f]">
                <nav className="border-b border-white/5 sticky top-0 z-50 glass-strong">
                    <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-2.5">
                            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-lg font-bold">S</div>
                            <span className="text-xl font-bold">Skill<span className="text-indigo-400">Sync</span></span>
                        </Link>
                        <Link href="/dashboard" className="btn-secondary text-sm !py-2">View Dashboard →</Link>
                    </div>
                </nav>

                <main className="max-w-5xl mx-auto px-6 py-12">
                    <div className="text-center mb-12 animate-fadeInUp">
                        <div className="text-5xl mb-4">🎉</div>
                        <h1 className="text-3xl font-bold mb-3">Your Career Matches</h1>
                        <p className="text-gray-400 max-w-xl mx-auto">{results.personality_summary}</p>
                    </div>

                    {/* Personality Traits */}
                    <div className="card mb-8 animate-fadeInUp">
                        <h2 className="text-xl font-bold mb-6">Your Personality Profile</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.entries(results.personality_traits).map(([trait, score]) => (
                                <div key={trait} className="flex items-center gap-3">
                                    <span className="w-32 text-sm">{traitLabels[trait] || trait}</span>
                                    <div className="flex-1 progress-bar">
                                        <div className="progress-bar-fill" style={{ width: `${(score / maxTrait) * 100}%` }} />
                                    </div>
                                    <span className="text-sm text-gray-400 w-8 text-right">{score}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top 5 Careers */}
                    <h2 className="text-2xl font-bold mb-6">Your Top 5 Career Matches</h2>
                    <div className="space-y-4 stagger-children mb-10">
                        {results.top_careers.map((career, i) => (
                            <div key={career.title} className="card hover:scale-[1.01]">
                                <div className="flex items-start gap-4">
                                    <div className="w-14 h-14 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center text-2xl font-bold text-indigo-400">
                                        #{i + 1}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="text-xl font-bold">{career.title}</h3>
                                            <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-lg text-sm font-semibold">
                                                {career.match_score}% match
                                            </span>
                                        </div>
                                        <p className="text-gray-400 text-sm mb-3">{career.why}</p>
                                        <div className="flex flex-wrap gap-4 text-sm">
                                            <span className="text-emerald-400">💰 {career.avg_salary}</span>
                                            <span className="text-indigo-300">📈 {career.growth} growth</span>
                                            <span className="text-gray-400">🎓 {career.education_path}</span>
                                        </div>
                                        {career.top_skills && (
                                            <div className="flex flex-wrap gap-1.5 mt-3">
                                                {career.top_skills.map((skill) => (
                                                    <span key={skill} className="px-2 py-0.5 bg-white/5 rounded text-xs text-gray-400">{skill}</span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Advice */}
                    <div className="card bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-indigo-500/20 mb-8 animate-fadeInUp">
                        <h2 className="text-xl font-bold mb-3 flex items-center gap-2">💡 Personalized Advice</h2>
                        <p className="text-gray-300 leading-relaxed">{results.advice}</p>
                    </div>

                    {/* Next Steps */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 stagger-children">
                        <Link href="/careers" className="card text-center hover:border-indigo-500/30">
                            <div className="text-3xl mb-3">🔍</div>
                            <h3 className="font-bold mb-1">Explore Careers</h3>
                            <p className="text-gray-400 text-sm">Dive deeper into your matched careers</p>
                        </Link>
                        <Link href="/skills" className="card text-center hover:border-emerald-500/30">
                            <div className="text-3xl mb-3">📊</div>
                            <h3 className="font-bold mb-1">Analyze Skill Gap</h3>
                            <p className="text-gray-400 text-sm">Find what skills you need to develop</p>
                        </Link>
                        <Link href="/chat" className="card text-center hover:border-pink-500/30">
                            <div className="text-3xl mb-3">💬</div>
                            <h3 className="font-bold mb-1">Chat with AI</h3>
                            <p className="text-gray-400 text-sm">Get personalized career advice</p>
                        </Link>
                    </div>
                </main>
            </div>
        );
    }

    // QUIZ
    if (loading || questions.length === 0) {
        return (
            <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
                <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const q = questions[currentQ];
    const selectedAnswer = answers[q.id.toString()];

    return (
        <div className="min-h-screen bg-[#0a0a0f] flex flex-col">
            {/* Progress bar */}
            <div className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-3xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between mb-2">
                        <Link href="/" className="text-gray-400 hover:text-white text-sm transition">← Exit</Link>
                        <span className="text-sm text-gray-400">{Object.keys(answers).length}/{questions.length} answered</span>
                    </div>
                    <div className="progress-bar">
                        <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
                    </div>
                </div>
            </div>

            {/* Question */}
            <div className="flex-1 flex items-center justify-center p-6">
                <div className="max-w-2xl w-full animate-fadeInUp" key={currentQ}>
                    <div className="text-center mb-10">
                        <span className="text-xs text-indigo-400 font-medium uppercase tracking-wide mb-2 block">
                            Question {currentQ + 1} of {questions.length}
                        </span>
                        <h2 className="text-2xl md:text-3xl font-bold">{q.question}</h2>
                    </div>

                    <div className="space-y-3">
                        {q.options.map((opt, i) => (
                            <button
                                key={i}
                                onClick={() => selectAnswer(i)}
                                className={`w-full text-left p-5 rounded-2xl transition-all duration-300 border ${selectedAnswer === i
                                        ? "bg-indigo-500/20 border-indigo-500/50 text-white"
                                        : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20"
                                    }`}
                            >
                                <span className="text-sm">{opt.text}</span>
                            </button>
                        ))}
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center justify-between mt-8">
                        <button
                            onClick={() => setCurrentQ(Math.max(0, currentQ - 1))}
                            disabled={currentQ === 0}
                            className="text-gray-400 hover:text-white transition disabled:opacity-30"
                        >
                            ← Previous
                        </button>

                        {allAnswered ? (
                            <button onClick={handleSubmit} disabled={submitting} className="btn-primary !py-3 !px-8">
                                {submitting ? "Analyzing..." : "Get My Results →"}
                            </button>
                        ) : currentQ < questions.length - 1 ? (
                            <button
                                onClick={() => setCurrentQ(currentQ + 1)}
                                disabled={selectedAnswer === undefined}
                                className="text-indigo-400 hover:text-white transition disabled:opacity-30"
                            >
                                Next →
                            </button>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
}
