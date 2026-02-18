"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

export default function DashboardPage() {
    const [user, setUser] = useState<any>(null);
    const [results, setResults] = useState<any>(null);
    const [trending, setTrending] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [streak] = useState(Math.floor(Math.random() * 7) + 1);
    const [points] = useState(Math.floor(Math.random() * 500) + 100);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) { window.location.href = "/login"; return; }
        Promise.all([
            api.getMe().catch(() => null),
            api.getResults().catch(() => null),
            api.getTrendingSkills().catch(() => ({ skills: [] })),
        ]).then(([u, r, t]) => {
            if (!u) { window.location.href = "/login"; return; }
            setUser(u); setResults(r); setTrending(t?.skills || []); setLoading(false);
        });
    }, []);

    if (loading) return (
        <div style={{ minHeight: "100vh", background: "var(--bg-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 48, height: 48, border: "3px solid var(--border-color)", borderTopColor: "var(--accent-primary)", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
        </div>
    );

    const primaryTools = [
        { icon: "🧬", title: "4D Assessment", desc: "Deep career profiling", href: "/assessment", color: "#6366f1" },
        { icon: "📝", title: "Daily Quiz", desc: "5 questions daily", href: "/daily", color: "#eab308", badge: "NEW" },
        { icon: "💻", title: "Code Practice", desc: "HackerRank-style DSA", href: "/practice", color: "#22c55e", badge: "NEW" },
        { icon: "🎓", title: "Courses", desc: "Industry-aligned learning", href: "/courses", color: "#8b5cf6", badge: "NEW" },
    ];

    const secondaryTools = [
        { icon: "🎮", title: "Career Simulator", desc: "Day-in-the-life experience", href: "/simulator", color: "#06b6d4" },
        { icon: "💰", title: "Salary Negotiation", desc: "Practice with AI recruiter", href: "/negotiate", color: "#f59e0b" },
        { icon: "🎯", title: "College ROI", desc: "Is your degree worth it?", href: "/college-roi", color: "#ef4444" },
        { icon: "👨‍👩‍👧", title: "Parent Toolkit", desc: "Bridge the family gap", href: "/parent", color: "#a855f7" },
    ];

    const socialTools = [
        { icon: "🌐", title: "Community", desc: "Share & learn together", href: "/community", color: "#3b82f6", badge: "NEW" },
        { icon: "💼", title: "Jobs & Internships", desc: "Fresh openings daily", href: "/jobs", color: "#f43f5e", badge: "HOT" },
        { icon: "🏆", title: "Leaderboard", desc: "Top learners rankings", href: "/leaderboard", color: "#eab308", badge: "NEW" },
        { icon: "🔮", title: "AI Career Chat", desc: "Ask anything career", href: "/chat", color: "#14b8a6" },
        { icon: "🗺️", title: "Skill Gap Finder", desc: "Your learning roadmap", href: "/skills", color: "#64748b" },
        { icon: "🧭", title: "Explore Careers", desc: "Browse 12+ paths", href: "/careers", color: "#0ea5e9" },
    ];

    return (
        <div style={{ minHeight: "100vh", background: "var(--bg-primary)", color: "var(--text-primary)" }}>
            {/* Header */}
            <nav style={{ padding: "0.75rem 2rem", borderBottom: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "rgba(10,10,15,0.9)", backdropFilter: "blur(20px)", zIndex: 100 }}>
                <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none", color: "var(--text-primary)" }}>
                    <span style={{ fontSize: "1.5rem" }}>🧠</span>
                    <span style={{ fontWeight: 800, fontSize: "1.2rem" }}>SkillSync <span style={{ color: "var(--accent-primary)" }}>AI</span></span>
                </Link>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <Link href="/daily" style={{ textDecoration: "none", padding: "0.3rem 0.7rem", borderRadius: 999, background: "rgba(234,179,8,0.1)", color: "#eab308", fontSize: "0.8rem", fontWeight: 700 }}>
                        🔥 {streak}d streak
                    </Link>
                    <Link href="/leaderboard" style={{ textDecoration: "none", padding: "0.3rem 0.7rem", borderRadius: 999, background: "rgba(99,102,241,0.1)", color: "var(--accent-primary)", fontSize: "0.8rem", fontWeight: 700 }}>
                        ⭐ {points} pts
                    </Link>
                    <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Hi, <strong style={{ color: "var(--text-primary)" }}>{user?.name?.split(" ")[0]}</strong></span>
                    <button onClick={() => { localStorage.removeItem("token"); window.location.href = "/login"; }}
                        style={{ padding: "0.35rem 0.75rem", borderRadius: 8, background: "var(--bg-card)", border: "1px solid var(--border-color)", color: "var(--text-secondary)", fontSize: "0.75rem", cursor: "pointer" }}>Logout</button>
                </div>
            </nav>

            <div style={{ maxWidth: 1100, margin: "0 auto", padding: "1.5rem 1rem" }}>
                {/* Welcome + Daily Action */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "1rem", marginBottom: "1.5rem", alignItems: "stretch" }}>
                    <div className="glass-card" style={{ padding: "1.5rem", borderRadius: 18, background: "linear-gradient(135deg, rgba(99,102,241,0.06), rgba(139,92,246,0.04))", border: "1px solid rgba(99,102,241,0.12)" }}>
                        <h1 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "0.35rem" }}>
                            {results?.has_results ? `${results.profile_type || "Career Explorer"}` : `Welcome back, ${user?.name?.split(" ")[0]} 👋`}
                        </h1>
                        <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.6 }}>
                            {results?.has_results ? (results.personality_summary || "Your career assessment reveals unique strengths.").slice(0, 150) : "Start your journey with the 4D Assessment — the most impactful 15 minutes."}
                        </p>
                        {!results?.has_results && (
                            <Link href="/assessment" style={{ display: "inline-block", marginTop: "0.75rem", padding: "0.6rem 1.5rem", borderRadius: 10, background: "linear-gradient(135deg, var(--accent-primary), #8b5cf6)", color: "white", textDecoration: "none", fontWeight: 600, fontSize: "0.9rem" }}>
                                Take Assessment →
                            </Link>
                        )}
                    </div>
                    <div className="glass-card" style={{ padding: "1.25rem", borderRadius: 18, minWidth: 180, textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center", background: "linear-gradient(135deg, rgba(234,179,8,0.06), rgba(249,115,22,0.04))", border: "1px solid rgba(234,179,8,0.12)" }}>
                        <span style={{ fontSize: "2rem" }}>📝</span>
                        <p style={{ fontWeight: 700, fontSize: "0.9rem", marginTop: "0.5rem" }}>Daily Quiz</p>
                        <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginBottom: "0.5rem" }}>Earn 25 pts today</p>
                        <Link href="/daily" style={{ padding: "0.4rem 1rem", borderRadius: 8, background: "linear-gradient(135deg, #eab308, #f59e0b)", color: "#000", textDecoration: "none", fontWeight: 700, fontSize: "0.8rem" }}>
                            Play Now →
                        </Link>
                    </div>
                </div>

                {/* Career Matches */}
                {results?.has_results && results.top_careers && (
                    <div style={{ marginBottom: "1.5rem" }}>
                        <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.75rem" }}>🎯 Your Top Career Matches</h2>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "0.75rem" }}>
                            {results.top_careers.slice(0, 3).map((career: any, i: number) => (
                                <div key={i} className="glass-card" style={{ padding: "1rem", borderRadius: 12 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                                        <h3 style={{ fontSize: "0.9rem", fontWeight: 700 }}>{career.title}</h3>
                                        <span style={{ padding: "0.2rem 0.5rem", borderRadius: 999, background: "rgba(34,197,94,0.1)", color: "#22c55e", fontSize: "0.75rem", fontWeight: 700 }}>{career.match_score}%</span>
                                    </div>
                                    <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>{career.why?.slice(0, 80)}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Primary Tools */}
                <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.75rem" }}>⚡ Daily Actions</h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "0.75rem", marginBottom: "1.5rem" }}>
                    {primaryTools.map((t, i) => (
                        <Link key={i} href={t.href} style={{ textDecoration: "none", color: "inherit" }}>
                            <div className="glass-card" style={{ padding: "1.1rem", borderRadius: 12, cursor: "pointer", transition: "all 0.2s", display: "flex", gap: "0.75rem", alignItems: "center", position: "relative" }}
                                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.borderColor = t.color; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.borderColor = "var(--border-color)"; }}>
                                <span style={{ fontSize: "1.75rem", minWidth: 40 }}>{t.icon}</span>
                                <div>
                                    <h3 style={{ fontSize: "0.9rem", fontWeight: 700 }}>{t.title}</h3>
                                    <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{t.desc}</p>
                                </div>
                                {t.badge && <span style={{ position: "absolute", top: 8, right: 8, padding: "0.1rem 0.4rem", borderRadius: 999, background: t.badge === "HOT" ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: t.badge === "HOT" ? "#ef4444" : "#22c55e", fontSize: "0.6rem", fontWeight: 800 }}>{t.badge}</span>}
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Career Tools */}
                <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.75rem" }}>🧰 Career Intelligence</h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "0.75rem", marginBottom: "1.5rem" }}>
                    {secondaryTools.map((t, i) => (
                        <Link key={i} href={t.href} style={{ textDecoration: "none", color: "inherit" }}>
                            <div className="glass-card" style={{ padding: "1.1rem", borderRadius: 12, cursor: "pointer", transition: "all 0.2s", display: "flex", gap: "0.75rem", alignItems: "center" }}
                                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.borderColor = t.color; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.borderColor = "var(--border-color)"; }}>
                                <span style={{ fontSize: "1.75rem", minWidth: 40 }}>{t.icon}</span>
                                <div>
                                    <h3 style={{ fontSize: "0.9rem", fontWeight: 700 }}>{t.title}</h3>
                                    <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{t.desc}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Social & More */}
                <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.75rem" }}>🌐 Community & Growth</h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "0.75rem", marginBottom: "1.5rem" }}>
                    {socialTools.map((t, i) => (
                        <Link key={i} href={t.href} style={{ textDecoration: "none", color: "inherit" }}>
                            <div className="glass-card" style={{ padding: "1rem", borderRadius: 12, cursor: "pointer", transition: "all 0.2s", textAlign: "center", position: "relative" }}
                                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.borderColor = t.color; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.borderColor = "var(--border-color)"; }}>
                                <span style={{ fontSize: "1.5rem" }}>{t.icon}</span>
                                <h3 style={{ fontSize: "0.85rem", fontWeight: 700, marginTop: "0.35rem" }}>{t.title}</h3>
                                <p style={{ fontSize: "0.7rem", color: "var(--text-secondary)" }}>{t.desc}</p>
                                {t.badge && <span style={{ position: "absolute", top: 6, right: 6, padding: "0.1rem 0.35rem", borderRadius: 999, background: t.badge === "HOT" ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: t.badge === "HOT" ? "#ef4444" : "#22c55e", fontSize: "0.55rem", fontWeight: 800 }}>{t.badge}</span>}
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Trending Skills */}
                {trending.length > 0 && (
                    <div>
                        <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.75rem" }}>🔥 Trending Skills in India</h2>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "0.6rem" }}>
                            {trending.slice(0, 6).map((skill: any, i: number) => (
                                <div key={i} className="glass-card" style={{ padding: "0.75rem 1rem", borderRadius: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <div>
                                        <p style={{ fontWeight: 600, fontSize: "0.85rem" }}>{skill.name}</p>
                                        <p style={{ fontSize: "0.7rem", color: "var(--text-secondary)" }}>{skill.avg_salary}</p>
                                    </div>
                                    <span style={{ padding: "0.2rem 0.5rem", borderRadius: 999, background: "rgba(34,197,94,0.1)", color: "#22c55e", fontSize: "0.7rem", fontWeight: 700 }}>{skill.growth}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
