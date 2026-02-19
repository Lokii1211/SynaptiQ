"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface ScoreData {
    score: number;
    delta_7d: number;
    breakdown: {
        assessment_quality: number;
        knowledge_score: number;
        practice_consistency: number;
        skill_verification: number;
        project_completion: number;
        community_contribution: number;
    };
    next_boost: string;
    next_boost_points: number;
}

function AnimatedScore({ value, max = 1000 }: { value: number; max?: number }) {
    const [displayed, setDisplayed] = useState(0);
    useEffect(() => {
        const duration = 1800;
        const steps = 60;
        const increment = value / steps;
        let current = 0;
        const timer = setInterval(() => {
            current += increment;
            if (current >= value) { setDisplayed(value); clearInterval(timer); }
            else setDisplayed(Math.floor(current));
        }, duration / steps);
        return () => clearInterval(timer);
    }, [value]);
    return <>{displayed}</>;
}

function CircularProgress({ value, max, size = 200, strokeWidth = 12 }: { value: number; max: number; size?: number; strokeWidth?: number }) {
    const [animatedValue, setAnimatedValue] = useState(0);
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    useEffect(() => {
        const timer = setTimeout(() => setAnimatedValue(value), 200);
        return () => clearTimeout(timer);
    }, [value]);

    const offset = circumference - (animatedValue / max) * circumference;

    const getColor = (score: number) => {
        if (score >= 800) return "#22c55e";
        if (score >= 600) return "#6366f1";
        if (score >= 400) return "#eab308";
        return "#ef4444";
    };

    return (
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
            <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={strokeWidth} />
            <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={getColor(value)} strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 1.8s ease-out, stroke 0.5s ease" }} />
        </svg>
    );
}

export default function ScorePage() {
    const [scoreData, setScoreData] = useState<ScoreData | null>(null);
    const [loading, setLoading] = useState(true);
    const [showCompanies, setShowCompanies] = useState(false);

    useEffect(() => {
        // Simulate score data (would normally come from API)
        const timer = setTimeout(() => {
            const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
            if (token) {
                fetch("/api/auth/me", { headers: { Authorization: `Bearer ${token}` } })
                    .then(r => r.json())
                    .then(user => {
                        // Calculate score from user activity
                        const base = user.points || 0;
                        const score = Math.min(1000, Math.max(0, 280 + Math.floor(base * 2.5)));
                        setScoreData({
                            score,
                            delta_7d: 12,
                            breakdown: {
                                assessment_quality: Math.min(100, 40 + Math.random() * 35),
                                knowledge_score: Math.min(100, 20 + Math.random() * 40),
                                practice_consistency: Math.min(100, 15 + Math.random() * 30),
                                skill_verification: Math.min(100, 10 + Math.random() * 35),
                                project_completion: Math.min(100, 5 + Math.random() * 25),
                                community_contribution: Math.min(100, 10 + Math.random() * 20),
                            },
                            next_boost: "Complete 3 more daily quizzes this week",
                            next_boost_points: 12,
                        });
                    })
                    .catch(() => {
                        setScoreData({
                            score: 0, delta_7d: 0,
                            breakdown: { assessment_quality: 0, knowledge_score: 0, practice_consistency: 0, skill_verification: 0, project_completion: 0, community_contribution: 0 },
                            next_boost: "Take the career assessment to start building your score",
                            next_boost_points: 50,
                        });
                    })
                    .finally(() => setLoading(false));
            } else {
                setScoreData({
                    score: 0, delta_7d: 0,
                    breakdown: { assessment_quality: 0, knowledge_score: 0, practice_consistency: 0, skill_verification: 0, project_completion: 0, community_contribution: 0 },
                    next_boost: "Sign up and take the career assessment",
                    next_boost_points: 50,
                });
                setLoading(false);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    const COMPANY_THRESHOLDS = [
        { score: 850, company: "Google India", icon: "🟢", unlocked: false },
        { score: 800, company: "Razorpay", icon: "🔵", unlocked: false },
        { score: 750, company: "Swiggy", icon: "🟠", unlocked: false },
        { score: 700, company: "Flipkart", icon: "🟡", unlocked: false },
        { score: 600, company: "TCS Digital", icon: "⚪", unlocked: false },
        { score: 500, company: "Infosys InStep", icon: "🔷", unlocked: false },
    ].map(c => ({ ...c, unlocked: (scoreData?.score || 0) >= c.score }));

    const BREAKDOWN_LABELS: { key: keyof ScoreData["breakdown"]; label: string; weight: string; icon: string }[] = [
        { key: "assessment_quality", label: "Assessment Depth", weight: "25%", icon: "🧬" },
        { key: "knowledge_score", label: "Verified Knowledge", weight: "20%", icon: "📝" },
        { key: "skill_verification", label: "Skill Verification", weight: "20%", icon: "✅" },
        { key: "practice_consistency", label: "Practice Consistency", weight: "15%", icon: "🔥" },
        { key: "project_completion", label: "Project Completion", weight: "15%", icon: "🛠️" },
        { key: "community_contribution", label: "Community", weight: "5%", icon: "🌐" },
    ];

    const getScoreLabel = (s: number) => {
        if (s >= 800) return { label: "Outstanding", color: "#22c55e" };
        if (s >= 600) return { label: "Strong", color: "#6366f1" };
        if (s >= 400) return { label: "Building", color: "#eab308" };
        if (s >= 200) return { label: "Getting Started", color: "#f97316" };
        return { label: "Begin Your Journey", color: "#94a3b8" };
    };

    if (loading) {
        return (
            <div style={{ minHeight: "100vh", background: "var(--bg-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>📊</div>
                    <p style={{ color: "var(--text-secondary)" }}>Calculating your SkillSync Score...</p>
                </div>
            </div>
        );
    }

    const score = scoreData?.score || 0;
    const { label: scoreLabel, color: scoreColor } = getScoreLabel(score);

    return (
        <div style={{ minHeight: "100vh", background: "var(--bg-primary)", color: "var(--text-primary)" }}>
            <style>{`
                @keyframes score-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.02); } }
                .breakdown-bar { height: 6px; border-radius: 3px; background: rgba(255,255,255,0.06); overflow: hidden; }
                .breakdown-fill { height: 100%; border-radius: 3px; transition: width 1.5s ease-out; }
                .company-card { transition: all 0.3s ease; }
                .company-card:hover { transform: translateY(-2px); }
            `}</style>

            {/* Nav */}
            <nav style={{ padding: "0.75rem 1rem", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-color)", position: "sticky", top: 0, background: "rgba(10,10,15,0.95)", backdropFilter: "blur(20px)", zIndex: 100 }}>
                <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none", color: "var(--text-primary)" }}>
                    <span style={{ fontSize: "1.3rem" }}>🧠</span>
                    <span style={{ fontWeight: 800, fontSize: "1.1rem" }}>SkillSync <span style={{ color: "var(--accent-primary)" }}>AI</span></span>
                </Link>
                <Link href="/dashboard" style={{ color: "var(--text-secondary)", textDecoration: "none", fontSize: "0.85rem" }}>← Dashboard</Link>
            </nav>

            <main style={{ maxWidth: 640, margin: "0 auto", padding: "1.5rem 1rem" }}>
                {/* Score Hero */}
                <div style={{ textAlign: "center", marginBottom: "2rem", position: "relative" }}>
                    <div style={{ position: "relative", display: "inline-block", animation: "score-pulse 3s ease-in-out infinite" }}>
                        <CircularProgress value={score} max={1000} size={200} strokeWidth={12} />
                        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center" }}>
                            <div style={{ fontSize: "2.5rem", fontWeight: 800, color: scoreColor }}>
                                <AnimatedScore value={score} />
                            </div>
                            <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.1em" }}>/ 1000</div>
                        </div>
                    </div>
                    <div style={{ marginTop: "1rem" }}>
                        <h1 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "0.25rem" }}>SkillSync Score™</h1>
                        <p style={{ color: scoreColor, fontWeight: 600, marginBottom: "0.25rem" }}>{scoreLabel}</p>
                        {scoreData && scoreData.delta_7d !== 0 && (
                            <p style={{ fontSize: "0.85rem", color: scoreData.delta_7d > 0 ? "#22c55e" : "#ef4444" }}>
                                {scoreData.delta_7d > 0 ? "↑" : "↓"} {Math.abs(scoreData.delta_7d)} pts this week
                            </p>
                        )}
                    </div>
                </div>

                {/* What would boost score */}
                {scoreData && (
                    <div style={{
                        padding: "1rem 1.25rem", borderRadius: 14, marginBottom: "1.5rem",
                        background: "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.08))",
                        border: "1px solid rgba(99,102,241,0.2)",
                    }}>
                        <div style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--accent-primary)", marginBottom: "0.35rem", fontWeight: 600 }}>
                            What would move your score most right now
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <p style={{ fontSize: "0.9rem", fontWeight: 500 }}>{scoreData.next_boost}</p>
                            <span style={{ color: "#22c55e", fontWeight: 700, fontSize: "0.85rem", whiteSpace: "nowrap" }}>+{scoreData.next_boost_points} pts</span>
                        </div>
                    </div>
                )}

                {/* Score Breakdown */}
                <div style={{
                    padding: "1.25rem", borderRadius: 14, marginBottom: "1.5rem",
                    border: "1px solid var(--border-color)", background: "rgba(255,255,255,0.02)",
                }}>
                    <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1rem" }}>Score Breakdown</h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                        {BREAKDOWN_LABELS.map(item => {
                            const val = scoreData?.breakdown[item.key] || 0;
                            return (
                                <div key={item.key}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem" }}>
                                        <span style={{ fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                                            <span>{item.icon}</span> {item.label}
                                        </span>
                                        <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{item.weight} · {Math.round(val)}/100</span>
                                    </div>
                                    <div className="breakdown-bar">
                                        <div className="breakdown-fill" style={{
                                            width: `${val}%`,
                                            background: val >= 70 ? "#22c55e" : val >= 40 ? "#6366f1" : val >= 20 ? "#eab308" : "rgba(255,255,255,0.15)",
                                        }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Company Unlock Thresholds */}
                <div style={{
                    padding: "1.25rem", borderRadius: 14, marginBottom: "1.5rem",
                    border: "1px solid var(--border-color)", background: "rgba(255,255,255,0.02)",
                }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", cursor: "pointer" }} onClick={() => setShowCompanies(!showCompanies)}>
                        <h2 style={{ fontSize: "1rem", fontWeight: 700 }}>🏢 Company Challenges Unlock</h2>
                        <span style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>{showCompanies ? "Hide" : "Show"} ▾</span>
                    </div>
                    {showCompanies && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            {COMPANY_THRESHOLDS.map((c, i) => (
                                <div key={i} className="company-card" style={{
                                    display: "flex", alignItems: "center", gap: "0.75rem",
                                    padding: "0.7rem 0.85rem", borderRadius: 10,
                                    background: c.unlocked ? "rgba(34,197,94,0.08)" : "rgba(255,255,255,0.02)",
                                    border: c.unlocked ? "1px solid rgba(34,197,94,0.2)" : "1px solid var(--border-color)",
                                    opacity: c.unlocked ? 1 : 0.6,
                                }}>
                                    <span style={{ fontSize: "1.1rem" }}>{c.icon}</span>
                                    <span style={{ flex: 1, fontWeight: 500, fontSize: "0.9rem" }}>{c.company}</span>
                                    <span style={{ fontSize: "0.8rem", color: c.unlocked ? "#22c55e" : "var(--text-secondary)", fontWeight: 600 }}>
                                        {c.unlocked ? "✓ Unlocked" : `${c.score}+ pts`}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* How to improve */}
                <div style={{
                    padding: "1.25rem", borderRadius: 14,
                    border: "1px solid var(--border-color)", background: "rgba(255,255,255,0.02)",
                }}>
                    <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1rem" }}>🚀 Quick Ways to Boost Your Score</h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                        {[
                            { action: "Complete career assessment", pts: "+50", link: "/assessment", icon: "🧬" },
                            { action: "Take today's daily quiz", pts: "+5", link: "/daily", icon: "📝" },
                            { action: "Solve a coding challenge", pts: "+10", link: "/practice", icon: "💻" },
                            { action: "Analyze your skill gap", pts: "+8", link: "/skills", icon: "🗺️" },
                            { action: "Help someone in community", pts: "+3", link: "/community", icon: "🌐" },
                        ].map((item, i) => (
                            <Link key={i} href={item.link} style={{
                                display: "flex", alignItems: "center", gap: "0.75rem", textDecoration: "none",
                                padding: "0.65rem 0.85rem", borderRadius: 10,
                                background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-color)",
                                color: "var(--text-primary)", transition: "all 0.2s ease",
                            }}>
                                <span>{item.icon}</span>
                                <span style={{ flex: 1, fontSize: "0.85rem" }}>{item.action}</span>
                                <span style={{ color: "#22c55e", fontWeight: 600, fontSize: "0.8rem" }}>{item.pts}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
