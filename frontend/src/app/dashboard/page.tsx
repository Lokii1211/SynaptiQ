"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

export default function DashboardPage() {
    const [user, setUser] = useState<any>(null);
    const [results, setResults] = useState<any>(null);
    const [trending, setTrending] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) { window.location.href = "/login"; return; }

        Promise.all([
            api.getMe().catch(() => null),
            api.getResults().catch(() => null),
            api.getTrendingSkills().catch(() => ({ skills: [] })),
        ]).then(([u, r, t]) => {
            if (!u) { window.location.href = "/login"; return; }
            setUser(u);
            setResults(r);
            setTrending(t?.skills || []);
            setLoading(false);
        });
    }, []);

    if (loading) return (
        <div style={{ minHeight: "100vh", background: "var(--bg-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 48, height: 48, border: "3px solid var(--border-color)", borderTopColor: "var(--accent-primary)", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
        </div>
    );

    const quickActions = [
        { icon: "🧬", title: "4D Assessment", desc: "Deep career profiling", href: "/assessment", color: "#6366f1" },
        { icon: "🎮", title: "Career Simulator", desc: "Experience a day in the life", href: "/simulator", color: "#22c55e" },
        { icon: "💰", title: "Negotiate Salary", desc: "Practice with AI recruiter", href: "/negotiate", color: "#eab308" },
        { icon: "🎓", title: "College ROI", desc: "Is your degree worth it?", href: "/college-roi", color: "#ef4444" },
        { icon: "👨‍👩‍👧", title: "Parent Toolkit", desc: "Bridge the family gap", href: "/parent", color: "#8b5cf6" },
        { icon: "🗺️", title: "Skill Gap", desc: "Your learning roadmap", href: "/skills", color: "#06b6d4" },
        { icon: "🔮", title: "AI Chat", desc: "Ask anything career", href: "/chat", color: "#f43f5e" },
        { icon: "🧭", title: "Explore Careers", desc: "Browse 12+ paths", href: "/careers", color: "#14b8a6" },
    ];

    return (
        <div style={{ minHeight: "100vh", background: "var(--bg-primary)", color: "var(--text-primary)" }}>
            {/* Header */}
            <nav style={{ padding: "1rem 2rem", borderBottom: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "rgba(10,10,15,0.9)", backdropFilter: "blur(20px)", zIndex: 100 }}>
                <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none", color: "var(--text-primary)" }}>
                    <span style={{ fontSize: "1.5rem" }}>🧠</span>
                    <span style={{ fontWeight: 800, fontSize: "1.25rem" }}>SkillSync <span style={{ color: "var(--accent-primary)" }}>AI</span></span>
                </Link>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <span style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>Welcome, <strong style={{ color: "var(--text-primary)" }}>{user?.name?.split(" ")[0]}</strong></span>
                    <button onClick={() => { localStorage.removeItem("token"); window.location.href = "/login"; }}
                        style={{ padding: "0.4rem 1rem", borderRadius: 8, background: "var(--bg-card)", border: "1px solid var(--border-color)", color: "var(--text-secondary)", fontSize: "0.8rem", cursor: "pointer" }}>
                        Logout
                    </button>
                </div>
            </nav>

            <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem" }}>
                {/* Welcome Banner */}
                <div className="glass-card" style={{ padding: "2rem", borderRadius: 20, marginBottom: "2rem", background: "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.05))", border: "1px solid rgba(99,102,241,0.15)" }}>
                    <h1 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "0.5rem" }}>
                        {results?.has_results ? `Your Profile: ${results.profile_type || "Analytical Thinker"}` : `Hey ${user?.name?.split(" ")[0]} 👋`}
                    </h1>
                    <p style={{ color: "var(--text-secondary)", fontSize: "1rem", lineHeight: 1.7 }}>
                        {results?.has_results
                            ? results.personality_summary || "Your career assessment reveals unique strengths. Explore your dashboard for personalized insights."
                            : "Ready to discover your true career path? Start with the 4D Assessment — it's the most impactful 15 minutes of your career journey."
                        }
                    </p>
                    {!results?.has_results && (
                        <Link href="/assessment" style={{ display: "inline-block", marginTop: "1rem", padding: "0.75rem 1.75rem", borderRadius: 12, background: "linear-gradient(135deg, var(--accent-primary), #8b5cf6)", color: "white", textDecoration: "none", fontWeight: 600 }}>
                            Take the 4D Assessment →
                        </Link>
                    )}
                </div>

                {/* Assessment Results Preview */}
                {results?.has_results && results.top_careers && (
                    <div style={{ marginBottom: "2rem" }}>
                        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1rem" }}>🎯 Your Top Career Matches</h2>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
                            {results.top_careers.slice(0, 3).map((career: any, i: number) => (
                                <div key={i} className="glass-card" style={{ padding: "1.25rem", borderRadius: 14 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                                        <h3 style={{ fontSize: "1rem", fontWeight: 700 }}>{career.title}</h3>
                                        <span style={{ padding: "0.3rem 0.75rem", borderRadius: 999, background: "rgba(34,197,94,0.1)", color: "#22c55e", fontSize: "0.8rem", fontWeight: 700 }}>{career.match_score}%</span>
                                    </div>
                                    <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "0.5rem" }}>{career.why}</p>
                                    <div style={{ display: "flex", gap: "0.75rem", fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                                        <span>💰 {career.avg_salary}</span>
                                        <span>📈 {career.growth}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Quick Actions */}
                <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1rem" }}>⚡ Your Career Toolkit</h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
                    {quickActions.map((action, i) => (
                        <Link key={i} href={action.href} style={{ textDecoration: "none", color: "inherit" }}>
                            <div className="glass-card" style={{ padding: "1.25rem", borderRadius: 14, cursor: "pointer", transition: "all 0.2s", display: "flex", gap: "1rem", alignItems: "center" }}
                                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.borderColor = action.color; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.borderColor = "var(--border-color)"; }}>
                                <span style={{ fontSize: "2rem", minWidth: 44 }}>{action.icon}</span>
                                <div>
                                    <h3 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: "0.15rem" }}>{action.title}</h3>
                                    <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{action.desc}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Trending Skills */}
                {trending.length > 0 && (
                    <div>
                        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1rem" }}>🔥 Trending Skills in India</h2>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "0.75rem" }}>
                            {trending.slice(0, 6).map((skill: any, i: number) => (
                                <div key={i} className="glass-card" style={{ padding: "1rem", borderRadius: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <div>
                                        <p style={{ fontWeight: 600, fontSize: "0.9rem", marginBottom: "0.15rem" }}>{skill.name}</p>
                                        <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{skill.avg_salary}</p>
                                    </div>
                                    <span style={{ padding: "0.25rem 0.6rem", borderRadius: 999, background: "rgba(34,197,94,0.1)", color: "#22c55e", fontSize: "0.75rem", fontWeight: 700 }}>{skill.growth}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
