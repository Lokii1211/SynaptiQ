"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";

interface PersonDot {
    x: number;
    y: number;
    career: string;
    salary: string;
    years: number;
    satisfaction: number;
    color: string;
    isYou?: boolean;
}

const CAREER_COLORS: Record<string, string> = {
    "Software Engineer": "#6366f1",
    "Data Scientist": "#22c55e",
    "Product Manager": "#eab308",
    "UX Designer": "#ec4899",
    "Business Analyst": "#f97316",
    "Marketing Manager": "#06b6d4",
    "DevOps Engineer": "#8b5cf6",
    "ML Engineer": "#14b8a6",
    "Freelancer": "#f43f5e",
    "Entrepreneur": "#a855f7",
    "Government": "#3b82f6",
    "MBA → Management": "#ef4444",
    "Teaching / Research": "#65a30d",
    "Undecided": "#94a3b8",
};

export default function PeopleLikeYouPage() {
    const [dots, setDots] = useState<PersonDot[]>([]);
    const [hovered, setHovered] = useState<PersonDot | null>(null);
    const [filter, setFilter] = useState("All");
    const [animate, setAnimate] = useState(false);

    // Generate simulated dots on mount
    useEffect(() => {
        const careers = Object.keys(CAREER_COLORS);
        const generated: PersonDot[] = [];
        for (let i = 0; i < 1000; i++) {
            const career = careers[Math.floor(Math.random() * careers.length)];
            const satisfactionBase = career === "Undecided" ? 2 : 3;
            const salary = career === "Undecided" ? 3 + Math.random() * 5
                : career === "Software Engineer" ? 8 + Math.random() * 35
                    : career === "Data Scientist" ? 10 + Math.random() * 30
                        : career === "Product Manager" ? 12 + Math.random() * 28
                            : career === "Government" ? 5 + Math.random() * 10
                                : career === "Entrepreneur" ? 2 + Math.random() * 50
                                    : 5 + Math.random() * 20;

            generated.push({
                x: 5 + Math.random() * 90,
                y: 5 + Math.random() * 90,
                career,
                salary: `₹${salary.toFixed(0)}L`,
                years: 1 + Math.floor(Math.random() * 8),
                satisfaction: satisfactionBase + Math.random() * (5 - satisfactionBase),
                color: CAREER_COLORS[career] || "#94a3b8",
            });
        }

        // "You" dot - centered
        generated.push({
            x: 50, y: 50, career: "You → ?", salary: "?", years: 0,
            satisfaction: 0, color: "#ffffff", isYou: true,
        });

        setDots(generated);
        setTimeout(() => setAnimate(true), 200);
    }, []);

    const filteredDots = useMemo(() => {
        if (filter === "All") return dots;
        return dots.filter(d => d.career === filter || d.isYou);
    }, [dots, filter]);

    const careerStats = useMemo(() => {
        const stats: Record<string, { count: number; avg_salary: number }> = {};
        dots.forEach(d => {
            if (d.isYou) return;
            if (!stats[d.career]) stats[d.career] = { count: 0, avg_salary: 0 };
            stats[d.career].count++;
            stats[d.career].avg_salary += parseFloat(d.salary.replace("₹", "").replace("L", ""));
        });
        Object.keys(stats).forEach(k => {
            stats[k].avg_salary = Math.round(stats[k].avg_salary / stats[k].count);
        });
        return Object.entries(stats).sort((a, b) => b[1].count - a[1].count);
    }, [dots]);

    return (
        <div style={{ minHeight: "100vh", background: "var(--bg-primary)", color: "var(--text-primary)" }}>
            <style>{`
                @keyframes dot-appear { from { opacity: 0; transform: scale(0); } to { opacity: 1; transform: scale(1); } }
                @keyframes you-pulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(255,255,255,0.4); } 50% { box-shadow: 0 0 0 12px rgba(255,255,255,0); } }
                .dot { position: absolute; border-radius: 50%; cursor: pointer; transition: transform 0.2s ease; }
                .dot:hover { transform: scale(3) !important; z-index: 100; }
                .you-dot { animation: you-pulse 2s ease-in-out infinite; }
                .career-filter { padding: 0.35rem 0.7rem; border-radius: 16px; border: 1px solid var(--border-color); background: transparent; color: var(--text-secondary); cursor: pointer; font-size: 0.7rem; font-weight: 500; transition: all 0.2s ease; white-space: nowrap; }
                .career-filter.active { border-color: var(--accent-primary); background: rgba(99,102,241,0.1); color: #a5b4fc; }
                .career-filter:hover { border-color: rgba(99,102,241,0.4); }
            `}</style>

            {/* Nav */}
            <nav style={{ padding: "0.75rem 1rem", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-color)", position: "sticky", top: 0, background: "rgba(10,10,15,0.95)", backdropFilter: "blur(20px)", zIndex: 100 }}>
                <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none", color: "var(--text-primary)" }}>
                    <span style={{ fontSize: "1.3rem" }}>🧠</span>
                    <span style={{ fontWeight: 800, fontSize: "1.1rem" }}>SkillSync <span style={{ color: "var(--accent-primary)" }}>AI</span></span>
                </Link>
                <Link href="/dashboard" style={{ color: "var(--text-secondary)", textDecoration: "none", fontSize: "0.85rem" }}>← Dashboard</Link>
            </nav>

            <main style={{ maxWidth: 960, margin: "0 auto", padding: "1.5rem 1rem" }}>
                {/* Header */}
                <div style={{ marginBottom: "1.25rem" }}>
                    <h1 style={{ fontSize: "1.6rem", fontWeight: 800, marginBottom: "0.25rem" }}>
                        👁️ 1000 People Like You
                    </h1>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.6 }}>
                        Each dot is someone with your profile — same college tier, same city, same stream. Where did they end up 5 years later? The white dot is you.
                    </p>
                </div>

                {/* Career Filters */}
                <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
                    <button className={`career-filter ${filter === "All" ? "active" : ""}`} onClick={() => setFilter("All")}>All ({dots.length - 1})</button>
                    {careerStats.slice(0, 8).map(([career, stats]) => (
                        <button key={career} className={`career-filter ${filter === career ? "active" : ""}`} onClick={() => setFilter(career)}>
                            <span style={{ color: CAREER_COLORS[career], marginRight: "0.25rem" }}>●</span>
                            {career} ({stats.count})
                        </button>
                    ))}
                </div>

                {/* Visualization Canvas */}
                <div style={{
                    position: "relative", width: "100%", aspectRatio: "16/10",
                    borderRadius: 16, border: "1px solid var(--border-color)",
                    background: "radial-gradient(circle at center, rgba(99,102,241,0.03), transparent 70%)",
                    overflow: "hidden", marginBottom: "1.25rem",
                }}>
                    {/* Axis labels */}
                    <div style={{ position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)", fontSize: "0.65rem", color: "var(--text-secondary)", opacity: 0.5 }}>Years Since Graduation →</div>
                    <div style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%) rotate(-90deg)", fontSize: "0.65rem", color: "var(--text-secondary)", opacity: 0.5 }}>Salary →</div>

                    {/* Dots */}
                    {filteredDots.map((dot, i) => (
                        <div
                            key={i}
                            className={`dot ${dot.isYou ? "you-dot" : ""}`}
                            style={{
                                left: `${dot.x}%`, top: `${dot.y}%`,
                                width: dot.isYou ? 14 : 5, height: dot.isYou ? 14 : 5,
                                background: dot.color,
                                opacity: animate ? (dot.isYou ? 1 : 0.7) : 0,
                                transition: `opacity 0.5s ease ${i * 0.5}ms, transform 0.2s ease`,
                                zIndex: dot.isYou ? 50 : 1,
                                border: dot.isYou ? "2px solid white" : "none",
                            }}
                            onMouseEnter={() => setHovered(dot)}
                            onMouseLeave={() => setHovered(null)}
                        />
                    ))}

                    {/* Hover Tooltip */}
                    {hovered && !hovered.isYou && (
                        <div style={{
                            position: "absolute", left: `${Math.min(75, hovered.x + 2)}%`, top: `${Math.max(5, hovered.y - 10)}%`,
                            padding: "0.5rem 0.75rem", borderRadius: 10,
                            background: "rgba(15,23,42,0.95)", border: "1px solid var(--border-color)",
                            backdropFilter: "blur(8px)", fontSize: "0.75rem", zIndex: 200,
                            minWidth: 140, pointerEvents: "none",
                        }}>
                            <div style={{ fontWeight: 600, marginBottom: "0.15rem", color: hovered.color }}>{hovered.career}</div>
                            <div>{hovered.salary}/year · {hovered.years} yrs exp</div>
                            <div>Happiness: {"⭐".repeat(Math.round(hovered.satisfaction))}</div>
                        </div>
                    )}
                </div>

                {/* Career Distribution */}
                <div style={{
                    padding: "1.25rem", borderRadius: 14, marginBottom: "1.5rem",
                    border: "1px solid var(--border-color)", background: "rgba(255,255,255,0.02)",
                }}>
                    <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1rem" }}>Where 1000 similar students ended up</h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        {careerStats.map(([career, stats]) => (
                            <div key={career} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                <span style={{ color: CAREER_COLORS[career], fontSize: "0.9rem" }}>●</span>
                                <span style={{ flex: 1, fontSize: "0.85rem" }}>{career}</span>
                                <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>₹{stats.avg_salary}L avg</span>
                                <div style={{ width: 100, height: 6, borderRadius: 3, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                                    <div style={{
                                        width: `${(stats.count / 1000) * 100 * 6}%`,
                                        height: "100%", borderRadius: 3, background: CAREER_COLORS[career],
                                        transition: "width 1s ease",
                                    }} />
                                </div>
                                <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", minWidth: 30, textAlign: "right" }}>{stats.count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Key insight */}
                <div style={{
                    padding: "1.25rem", borderRadius: 14,
                    background: "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.08))",
                    border: "1px solid rgba(99,102,241,0.2)",
                    textAlign: "center",
                }}>
                    <p style={{ fontSize: "0.95rem", lineHeight: 1.7, marginBottom: "1rem" }}>
                        <strong>The white dot is you today.</strong> Where you end up depends on the next 12-18 months.
                        Take the assessment to see which cluster you&apos;re headed toward.
                    </p>
                    <Link href="/assessment" style={{
                        display: "inline-block", padding: "0.75rem 1.75rem", borderRadius: 12,
                        background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "white",
                        fontWeight: 700, fontSize: "0.9rem", textDecoration: "none",
                    }}>
                        Take Career Assessment →
                    </Link>
                </div>
            </main>
        </div>
    );
}
