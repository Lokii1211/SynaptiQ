"use client";
import { useState, useMemo } from "react";
import Link from "next/link";

// Simulated analytics data (in production, this would come from API)
const WEEKLY_DATA = [
    { day: "Mon", problems: 3, quizScore: 80, timeSpent: 45 },
    { day: "Tue", problems: 5, quizScore: 100, timeSpent: 62 },
    { day: "Wed", problems: 2, quizScore: 60, timeSpent: 30 },
    { day: "Thu", problems: 4, quizScore: 80, timeSpent: 55 },
    { day: "Fri", problems: 6, quizScore: 100, timeSpent: 78 },
    { day: "Sat", problems: 1, quizScore: 40, timeSpent: 20 },
    { day: "Sun", problems: 3, quizScore: 80, timeSpent: 35 },
];

const MONTHLY_PROGRESS = [
    { week: "Week 1", points: 120, problems: 12, streak: 5 },
    { week: "Week 2", points: 185, problems: 18, streak: 7 },
    { week: "Week 3", points: 230, problems: 22, streak: 6 },
    { week: "Week 4", points: 310, problems: 28, streak: 7 },
];

const SKILL_BREAKDOWN = [
    { skill: "Arrays", solved: 8, total: 12, level: "Strong" },
    { skill: "Strings", solved: 5, total: 8, level: "Good" },
    { skill: "Dynamic Programming", solved: 3, total: 10, level: "Needs Work" },
    { skill: "Trees", solved: 2, total: 7, level: "Beginner" },
    { skill: "Graphs", solved: 1, total: 6, level: "Beginner" },
    { skill: "Searching", solved: 4, total: 5, level: "Strong" },
    { skill: "Stacks", solved: 3, total: 4, level: "Good" },
    { skill: "Design", solved: 1, total: 3, level: "Needs Work" },
];

const LEADERBOARD_PREVIEW = [
    { rank: 1, name: "Priya S.", college: "IIT Madras", points: 2450, streak: 15, level: "Diamond" },
    { rank: 2, name: "Rahul K.", college: "NIT Trichy", points: 2180, streak: 12, level: "Platinum" },
    { rank: 3, name: "Ananya M.", college: "VIT Vellore", points: 1890, streak: 10, level: "Platinum" },
    { rank: 4, name: "Karthik R.", college: "BITS Pilani", points: 1720, streak: 8, level: "Gold" },
    { rank: 5, name: "Deepa V.", college: "Anna University", points: 1560, streak: 7, level: "Gold" },
];

type TimePeriod = "daily" | "weekly" | "monthly";

export default function AnalyticsPage() {
    const [period, setPeriod] = useState<TimePeriod>("weekly");

    const weeklyTotals = useMemo(() => ({
        problems: WEEKLY_DATA.reduce((a, d) => a + d.problems, 0),
        avgQuiz: Math.round(WEEKLY_DATA.reduce((a, d) => a + d.quizScore, 0) / WEEKLY_DATA.length),
        totalTime: WEEKLY_DATA.reduce((a, d) => a + d.timeSpent, 0),
        maxStreak: 7,
    }), []);

    const monthlyTotals = useMemo(() => ({
        points: MONTHLY_PROGRESS.reduce((a, w) => a + w.points, 0),
        problems: MONTHLY_PROGRESS.reduce((a, w) => a + w.problems, 0),
        bestStreak: Math.max(...MONTHLY_PROGRESS.map(w => w.streak)),
    }), []);

    const levelColors: Record<string, string> = { "Strong": "#22c55e", "Good": "#3b82f6", "Needs Work": "#eab308", "Beginner": "#94a3b8" };
    const rankColors = ["#fbbf24", "#94a3b8", "#cd7f32", "#818cf8", "#818cf8"];

    return (
        <div style={{ minHeight: "100vh", background: "var(--bg-primary)", color: "var(--text-primary)" }}>
            {/* Navbar */}
            <nav style={{ padding: "0.65rem clamp(0.5rem, 2vw, 1.5rem)", borderBottom: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "rgba(10,10,15,0.95)", backdropFilter: "blur(20px)", zIndex: 100, flexWrap: "wrap", gap: "0.5rem" }}>
                <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none", color: "var(--text-primary)" }}>
                    <span style={{ fontSize: "1.3rem" }}>🧠</span>
                    <span style={{ fontWeight: 800, fontSize: "1.15rem" }}>SkillSync <span style={{ color: "#f59e0b" }}>Analytics</span></span>
                </Link>
                <div style={{ display: "flex", gap: "0.35rem" }}>
                    {(["daily", "weekly", "monthly"] as TimePeriod[]).map(p => (
                        <button key={p} onClick={() => setPeriod(p)}
                            style={{ padding: "0.35rem 0.8rem", borderRadius: 8, background: period === p ? "rgba(245,158,11,0.15)" : "transparent", border: "1px solid", borderColor: period === p ? "#f59e0b" : "var(--border-color)", color: period === p ? "#f59e0b" : "var(--text-secondary)", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600, textTransform: "capitalize" }}>{p}</button>
                    ))}
                </div>
            </nav>

            <div style={{ maxWidth: 1100, margin: "0 auto", padding: "clamp(0.75rem, 3vw, 1.5rem) clamp(0.5rem, 2vw, 1rem)" }}>
                {/* Main Stats Cards */}
                <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.6rem", marginBottom: "1.25rem" }}>
                    <div style={{ padding: "1.25rem", borderRadius: 16, background: "linear-gradient(135deg, rgba(34,197,94,0.08), rgba(34,197,94,0.02))", border: "1px solid rgba(34,197,94,0.2)", textAlign: "center" }}>
                        <div style={{ fontSize: "2rem", fontWeight: 800, color: "#22c55e" }}>{period === "monthly" ? monthlyTotals.problems : weeklyTotals.problems}</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600 }}>Problems Solved</div>
                        <div style={{ fontSize: "0.65rem", color: "#22c55e", marginTop: "0.25rem" }}>↑ 12% vs last {period}</div>
                    </div>
                    <div style={{ padding: "1.25rem", borderRadius: 16, background: "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(99,102,241,0.02))", border: "1px solid rgba(99,102,241,0.2)", textAlign: "center" }}>
                        <div style={{ fontSize: "2rem", fontWeight: 800, color: "#818cf8" }}>{period === "monthly" ? monthlyTotals.points : weeklyTotals.avgQuiz}%</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600 }}>{period === "monthly" ? "Total Points" : "Quiz Accuracy"}</div>
                        <div style={{ fontSize: "0.65rem", color: "#818cf8", marginTop: "0.25rem" }}>↑ 5% improvement</div>
                    </div>
                    <div style={{ padding: "1.25rem", borderRadius: 16, background: "linear-gradient(135deg, rgba(245,158,11,0.08), rgba(245,158,11,0.02))", border: "1px solid rgba(245,158,11,0.2)", textAlign: "center" }}>
                        <div style={{ fontSize: "2rem", fontWeight: 800, color: "#f59e0b" }}>{period === "monthly" ? monthlyTotals.bestStreak : weeklyTotals.maxStreak}</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600 }}>Best Streak 🔥</div>
                        <div style={{ fontSize: "0.65rem", color: "#f59e0b", marginTop: "0.25rem" }}>Keep it going!</div>
                    </div>
                    <div style={{ padding: "1.25rem", borderRadius: 16, background: "linear-gradient(135deg, rgba(236,72,153,0.08), rgba(236,72,153,0.02))", border: "1px solid rgba(236,72,153,0.2)", textAlign: "center" }}>
                        <div style={{ fontSize: "2rem", fontWeight: 800, color: "#ec4899" }}>{Math.round(weeklyTotals.totalTime / 60)}h</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600 }}>Time Invested</div>
                        <div style={{ fontSize: "0.65rem", color: "#ec4899", marginTop: "0.25rem" }}>{Math.round(weeklyTotals.totalTime / 7)} min/day avg</div>
                    </div>
                </div>

                <div className="chart-skill-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "0.75rem", marginBottom: "1.25rem" }}>
                    {/* Weekly Activity Chart */}
                    <div style={{ padding: "1.25rem", borderRadius: 16, background: "rgba(26,26,46,0.6)", border: "1px solid var(--border-color)" }}>
                        <h3 style={{ fontWeight: 800, fontSize: "1rem", marginBottom: "1rem" }}>📊 {period === "monthly" ? "Monthly Progress" : "Weekly Activity"}</h3>
                        {period !== "monthly" ? (
                            <div style={{ display: "flex", gap: "0.5rem", alignItems: "flex-end", height: 180 }}>
                                {WEEKLY_DATA.map((d, i) => (
                                    <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "0.3rem" }}>
                                        <div style={{ width: "100%", borderRadius: 6, background: `linear-gradient(to top, rgba(99,102,241,0.3), rgba(99,102,241,${0.2 + d.problems * 0.1}))`, height: `${d.problems * 22}px`, transition: "height 0.5s ease", position: "relative" }}>
                                            <span style={{ position: "absolute", top: -18, left: "50%", transform: "translateX(-50%)", fontSize: "0.7rem", fontWeight: 700, color: "var(--accent-primary)" }}>{d.problems}</span>
                                        </div>
                                        <span style={{ fontSize: "0.7rem", color: "var(--text-secondary)", fontWeight: 600 }}>{d.day}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                                {MONTHLY_PROGRESS.map((w, i) => (
                                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                        <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", fontWeight: 600, width: 55 }}>{w.week}</span>
                                        <div style={{ flex: 1, height: 20, borderRadius: 10, background: "rgba(255,255,255,0.04)", overflow: "hidden" }}>
                                            <div style={{ height: "100%", width: `${(w.points / 350) * 100}%`, borderRadius: 10, background: "linear-gradient(90deg, #6366f1, #a855f7)", transition: "width 0.8s ease" }}></div>
                                        </div>
                                        <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--accent-primary)", width: 45, textAlign: "right" }}>{w.points} pts</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Skill Radar */}
                    <div style={{ padding: "1.25rem", borderRadius: 16, background: "rgba(26,26,46,0.6)", border: "1px solid var(--border-color)" }}>
                        <h3 style={{ fontWeight: 800, fontSize: "1rem", marginBottom: "1rem" }}>🎯 Skill Breakdown</h3>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            {SKILL_BREAKDOWN.map((s, i) => (
                                <div key={i}>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.2rem" }}>
                                        <span style={{ fontSize: "0.75rem", fontWeight: 600 }}>{s.skill}</span>
                                        <span style={{ fontSize: "0.65rem", color: levelColors[s.level], fontWeight: 600 }}>{s.solved}/{s.total} · {s.level}</span>
                                    </div>
                                    <div style={{ height: 6, borderRadius: 3, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                                        <div style={{ height: "100%", width: `${(s.solved / s.total) * 100}%`, borderRadius: 3, background: levelColors[s.level], transition: "width 0.5s" }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bottom-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                    {/* Leaderboard Preview */}
                    <div style={{ padding: "1.25rem", borderRadius: 16, background: "rgba(26,26,46,0.6)", border: "1px solid var(--border-color)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                            <h3 style={{ fontWeight: 800, fontSize: "1rem" }}>🏆 Leaderboard</h3>
                            <Link href="/leaderboard" style={{ fontSize: "0.75rem", color: "var(--accent-primary)", textDecoration: "none", fontWeight: 600 }}>View All →</Link>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            {LEADERBOARD_PREVIEW.map((u, i) => (
                                <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.5rem 0.75rem", borderRadius: 10, background: i < 3 ? `${rankColors[i]}08` : "transparent", border: i < 3 ? `1px solid ${rankColors[i]}25` : "none" }}>
                                    <span style={{ fontWeight: 800, fontSize: "0.85rem", color: rankColors[i], width: 24 }}>#{u.rank}</span>
                                    <div style={{ flex: 1 }}>
                                        <span style={{ fontWeight: 700, fontSize: "0.85rem" }}>{u.name}</span>
                                        <span style={{ fontSize: "0.65rem", color: "var(--text-secondary)", display: "block" }}>{u.college}</span>
                                    </div>
                                    <span style={{ fontWeight: 700, fontSize: "0.8rem", color: "var(--accent-primary)" }}>{u.points}</span>
                                    <span style={{ fontSize: "0.7rem" }}>🔥{u.streak}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recommendations & Milestones */}
                    <div style={{ padding: "1.25rem", borderRadius: 16, background: "rgba(26,26,46,0.6)", border: "1px solid var(--border-color)" }}>
                        <h3 style={{ fontWeight: 800, fontSize: "1rem", marginBottom: "1rem" }}>🚀 Recommended Actions</h3>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                            <Link href="/practice" style={{ textDecoration: "none" }}>
                                <div style={{ padding: "0.75rem", borderRadius: 10, background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.15)", cursor: "pointer" }}>
                                    <p style={{ fontWeight: 700, fontSize: "0.85rem", color: "#22c55e", marginBottom: "0.15rem" }}>💪 Improve DP Skills</p>
                                    <p style={{ fontSize: "0.7rem", color: "var(--text-secondary)" }}>You{"'"}ve solved only 3/10 DP problems. Try &quot;Coin Change&quot; next.</p>
                                </div>
                            </Link>
                            <Link href="/daily" style={{ textDecoration: "none" }}>
                                <div style={{ padding: "0.75rem", borderRadius: 10, background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.15)", cursor: "pointer" }}>
                                    <p style={{ fontWeight: 700, fontSize: "0.85rem", color: "#f59e0b", marginBottom: "0.15rem" }}>🔥 Maintain Your Streak</p>
                                    <p style={{ fontSize: "0.7rem", color: "var(--text-secondary)" }}>Complete today{"'"}s daily quiz to keep your 7-day streak alive!</p>
                                </div>
                            </Link>
                            <Link href="/courses" style={{ textDecoration: "none" }}>
                                <div style={{ padding: "0.75rem", borderRadius: 10, background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.15)", cursor: "pointer" }}>
                                    <p style={{ fontWeight: 700, fontSize: "0.85rem", color: "#818cf8", marginBottom: "0.15rem" }}>📚 Start System Design Course</p>
                                    <p style={{ fontSize: "0.7rem", color: "var(--text-secondary)" }}>Essential for senior-level interviews at Google & Amazon.</p>
                                </div>
                            </Link>
                            <div style={{ padding: "0.75rem", borderRadius: 10, background: "rgba(236,72,153,0.06)", border: "1px solid rgba(236,72,153,0.15)" }}>
                                <p style={{ fontWeight: 700, fontSize: "0.85rem", color: "#ec4899", marginBottom: "0.15rem" }}>🎯 Milestone: 50 Problems</p>
                                <p style={{ fontSize: "0.7rem", color: "var(--text-secondary)" }}>You{"'"}re 26 problems away from the &quot;Problem Crusher&quot; badge!</p>
                                <div style={{ marginTop: "0.35rem", height: 6, borderRadius: 3, background: "rgba(255,255,255,0.06)" }}>
                                    <div style={{ height: "100%", width: "48%", borderRadius: 3, background: "linear-gradient(90deg, #ec4899, #f43f5e)" }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @media (max-width: 768px) {
                    .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
                    .chart-skill-grid { grid-template-columns: 1fr !important; }
                    .bottom-grid { grid-template-columns: 1fr !important; }
                }
                @media (max-width: 480px) {
                    .stats-grid { gap: 0.4rem !important; }
                    .stats-grid > div { padding: 0.85rem 0.5rem !important; }
                    .stats-grid > div > div:first-child { font-size: 1.5rem !important; }
                }
            `}</style>
        </div>
    );
}
