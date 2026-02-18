"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function DailyQuizPage() {
    const [questions, setQuestions] = useState<any[]>([]);
    const [category, setCategory] = useState("technology");
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [submitted, setSubmitted] = useState(false);
    const [results, setResults] = useState<any>(null);
    const [current, setCurrent] = useState(0);
    const [loading, setLoading] = useState(true);
    const [streak, setStreak] = useState(Math.floor(Math.random() * 7) + 1);

    useEffect(() => {
        setLoading(true);
        setSubmitted(false);
        setAnswers({});
        setCurrent(0);
        setResults(null);
        fetch(`/api/daily-quiz?category=${category}`)
            .then(r => r.json()).then(d => { setQuestions(d.questions || []); setLoading(false); });
    }, [category]);

    const selectAnswer = (qId: string, idx: number) => {
        if (submitted) return;
        setAnswers({ ...answers, [qId]: idx });
    };

    const submitQuiz = async () => {
        const res = await fetch("/api/daily-quiz", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ answers, category }),
        });
        const data = await res.json();
        setResults(data);
        setSubmitted(true);
        setStreak(s => s + 1);
    };

    const q = questions[current];
    const progress = Object.keys(answers).length;

    return (
        <div style={{ minHeight: "100vh", background: "var(--bg-primary)", color: "var(--text-primary)" }}>
            <nav style={{ padding: "1rem 2rem", borderBottom: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "rgba(10,10,15,0.9)", backdropFilter: "blur(20px)", zIndex: 100 }}>
                <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none", color: "var(--text-primary)" }}>
                    <span style={{ fontSize: "1.5rem" }}>🧠</span>
                    <span style={{ fontWeight: 800, fontSize: "1.25rem" }}>SkillSync <span style={{ color: "#eab308" }}>Daily</span></span>
                </Link>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>🔥 {streak} day streak</span>
                </div>
            </nav>

            <div style={{ maxWidth: 700, margin: "0 auto", padding: "2rem 1rem" }}>
                {/* Category Selector */}
                <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2rem", justifyContent: "center", flexWrap: "wrap" }}>
                    {[{ id: "technology", label: "💻 Tech", color: "#6366f1" }, { id: "business", label: "📊 Business", color: "#22c55e" }, { id: "design", label: "🎨 Design", color: "#f43f5e" }].map(c => (
                        <button key={c.id} onClick={() => setCategory(c.id)}
                            style={{ padding: "0.5rem 1.25rem", borderRadius: 999, border: "2px solid", borderColor: category === c.id ? c.color : "var(--border-color)", background: category === c.id ? `${c.color}20` : "transparent", color: category === c.id ? c.color : "var(--text-secondary)", cursor: "pointer", fontWeight: 700, fontSize: "0.9rem" }}>
                            {c.label}
                        </button>
                    ))}
                </div>

                {/* Header */}
                <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                    <h1 style={{ fontSize: "2rem", fontWeight: 800 }}>📝 Daily Quiz</h1>
                    <p style={{ color: "var(--text-secondary)" }}>5 questions · 5 minutes · Earn up to 25 points</p>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginTop: "0.5rem" }}>
                        {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                    </p>
                </div>

                {loading ? (
                    <div style={{ textAlign: "center", padding: "3rem" }}><div style={{ width: 48, height: 48, border: "3px solid var(--border-color)", borderTopColor: "#eab308", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto" }} /></div>
                ) : !submitted ? (
                    <>
                        {/* Progress Bar */}
                        <div style={{ marginBottom: "1.5rem" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.5rem" }}>
                                <span>Question {current + 1} of {questions.length}</span>
                                <span>{progress} answered</span>
                            </div>
                            <div style={{ height: 6, background: "var(--bg-card)", borderRadius: 999 }}>
                                <div style={{ height: "100%", width: `${((current + 1) / questions.length) * 100}%`, background: "linear-gradient(135deg, #eab308, #f59e0b)", borderRadius: 999, transition: "width 0.3s" }} />
                            </div>
                        </div>

                        {/* Question Card */}
                        {q && (
                            <div className="glass-card" style={{ padding: "2rem", borderRadius: 20, marginBottom: "1.5rem" }}>
                                <h2 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "1.5rem", lineHeight: 1.6 }}>{q.question}</h2>
                                <div style={{ display: "grid", gap: "0.75rem" }}>
                                    {q.options.map((opt: string, i: number) => (
                                        <button key={i} onClick={() => selectAnswer(q.id, i)}
                                            style={{ padding: "1rem 1.25rem", borderRadius: 12, border: "2px solid", borderColor: answers[q.id] === i ? "#eab308" : "var(--border-color)", background: answers[q.id] === i ? "rgba(234,179,8,0.1)" : "var(--bg-primary)", color: "var(--text-primary)", cursor: "pointer", textAlign: "left", fontSize: "0.95rem", transition: "all 0.2s", fontWeight: answers[q.id] === i ? 600 : 400 }}>
                                            <span style={{ display: "inline-flex", width: 28, height: 28, borderRadius: "50%", background: answers[q.id] === i ? "#eab308" : "var(--bg-card)", color: answers[q.id] === i ? "#000" : "var(--text-secondary)", alignItems: "center", justifyContent: "center", marginRight: "0.75rem", fontWeight: 700, fontSize: "0.8rem" }}>
                                                {String.fromCharCode(65 + i)}
                                            </span>
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Navigation */}
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <button onClick={() => setCurrent(Math.max(0, current - 1))} disabled={current === 0}
                                style={{ padding: "0.6rem 1.5rem", borderRadius: 10, background: "var(--bg-card)", border: "1px solid var(--border-color)", color: current === 0 ? "var(--border-color)" : "var(--text-secondary)", cursor: current === 0 ? "default" : "pointer" }}>
                                ← Previous
                            </button>
                            {current < questions.length - 1 ? (
                                <button onClick={() => setCurrent(current + 1)}
                                    style={{ padding: "0.6rem 1.5rem", borderRadius: 10, background: "linear-gradient(135deg, #eab308, #f59e0b)", color: "#000", border: "none", fontWeight: 700, cursor: "pointer" }}>
                                    Next →
                                </button>
                            ) : (
                                <button onClick={submitQuiz} disabled={progress < questions.length}
                                    style={{ padding: "0.6rem 1.5rem", borderRadius: 10, background: progress < questions.length ? "var(--bg-card)" : "linear-gradient(135deg, #22c55e, #16a34a)", color: progress < questions.length ? "var(--text-secondary)" : "white", border: progress < questions.length ? "1px solid var(--border-color)" : "none", fontWeight: 700, cursor: progress < questions.length ? "default" : "pointer" }}>
                                    Submit Quiz ✓
                                </button>
                            )}
                        </div>
                    </>
                ) : (
                    /* Results */
                    <div>
                        <div className="glass-card" style={{ padding: "2rem", borderRadius: 20, textAlign: "center", marginBottom: "1.5rem", background: "linear-gradient(135deg, rgba(34,197,94,0.08), rgba(234,179,8,0.05))" }}>
                            <div style={{ fontSize: "3.5rem", marginBottom: "0.75rem" }}>{results.score >= 20 ? "🏆" : results.score >= 10 ? "⭐" : "📝"}</div>
                            <h2 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "0.5rem" }}>{results.score} / {results.total * 5} Points</h2>
                            <p style={{ color: "var(--text-secondary)", fontSize: "1rem" }}>
                                {results.score >= 20 ? "Outstanding! You nailed it! 🎉" : results.score >= 10 ? "Good job! Keep practicing!" : "Keep learning, you got this! 💪"}
                            </p>
                            <p style={{ color: "#eab308", fontWeight: 700, marginTop: "0.5rem" }}>🔥 {streak} day streak!</p>
                        </div>

                        {/* Detailed Results */}
                        {results.results?.map((r: any, i: number) => {
                            const q = questions.find((q: any) => q.id === r.questionId);
                            return (
                                <div key={i} className="glass-card" style={{ padding: "1.25rem", borderRadius: 14, marginBottom: "0.75rem", borderLeft: `3px solid ${r.correct ? "#22c55e" : "#ef4444"}` }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                                        <h4 style={{ fontWeight: 700, fontSize: "0.9rem" }}>{q?.question}</h4>
                                        <span>{r.correct ? "✅" : "❌"}</span>
                                    </div>
                                    <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>💡 {r.explanation}</p>
                                </div>
                            );
                        })}

                        <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
                            <Link href="/dashboard" style={{ padding: "0.75rem 2rem", borderRadius: 12, background: "linear-gradient(135deg, var(--accent-primary), #8b5cf6)", color: "white", textDecoration: "none", fontWeight: 700 }}>
                                Back to Dashboard →
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
