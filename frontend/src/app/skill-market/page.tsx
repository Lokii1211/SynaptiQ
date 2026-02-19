"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface SkillTrend {
    skill_name: string;
    posting_count: number;
    avg_salary_lpa: number;
    delta_pct: number;
    top_hiring_companies: string[];
    city: string;
}

const CITIES = ["All Cities", "Bangalore", "Mumbai", "Delhi", "Hyderabad", "Pune", "Chennai"];
const CAREER_FILTERS = ["All Paths", "Tech", "Data", "Design", "Finance", "Marketing"];

export default function SkillMarketPage() {
    const [skills, setSkills] = useState<SkillTrend[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCity, setSelectedCity] = useState("All Cities");
    const [selectedCareer, setSelectedCareer] = useState("All Paths");
    const [lastUpdated] = useState("Feb 17, 2026");

    useEffect(() => {
        fetch("/api/market/trending-skills")
            .then(r => r.json())
            .then(data => {
                setSkills(data.skills || []);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const filteredSkills = skills.filter(s => {
        if (selectedCity !== "All Cities" && s.city !== selectedCity) return false;
        return true;
    });

    const sortedSkills = [...filteredSkills].sort((a, b) => Math.abs(b.delta_pct) - Math.abs(a.delta_pct));
    const biggestMover = sortedSkills[0];
    const topGainers = sortedSkills.filter(s => s.delta_pct > 0).slice(0, 5);
    const topDecliners = sortedSkills.filter(s => s.delta_pct < 0).slice(0, 3);

    const shareToWhatsApp = () => {
        const top3 = topGainers.slice(0, 3);
        const text = `📈 India Skill Market — This Week's Movers\n\n${top3.map((s, i) => `${i + 1}. ${s.skill_name}: +${s.delta_pct.toFixed(1)}% postings`).join("\n")}\n\nCheck your career readiness → skillsync.ai`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
    };

    return (
        <div style={{ minHeight: "100vh", background: "var(--bg-primary)", color: "var(--text-primary)" }}>
            <style>{`
                @keyframes ticker-slide { from { transform: translateX(100%); } to { transform: translateX(-100%); } }
                @keyframes count-up { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .skill-card { transition: all 0.3s ease; }
                .skill-card:hover { transform: translateY(-3px); box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
                .trend-up { color: #22c55e; }
                .trend-down { color: #ef4444; }
                .trend-neutral { color: #94a3b8; }
                .ticker-bar { overflow: hidden; white-space: nowrap; }
                .ticker-content { display: inline-block; animation: ticker-slide 30s linear infinite; }
                .filter-btn { padding: 0.4rem 0.85rem; border-radius: 20px; border: 1px solid var(--border-color); background: transparent; color: var(--text-secondary); cursor: pointer; font-size: 0.8rem; font-weight: 500; transition: all 0.2s ease; }
                .filter-btn.active { background: rgba(99,102,241,0.15); border-color: #6366f1; color: #a5b4fc; }
                .filter-btn:hover { border-color: rgba(99,102,241,0.4); }
            `}</style>

            {/* Nav */}
            <nav style={{ padding: "0.75rem 1rem", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-color)", position: "sticky", top: 0, background: "rgba(10,10,15,0.95)", backdropFilter: "blur(20px)", zIndex: 100 }}>
                <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none", color: "var(--text-primary)" }}>
                    <span style={{ fontSize: "1.3rem" }}>🧠</span>
                    <span style={{ fontWeight: 800, fontSize: "1.1rem" }}>SkillSync <span style={{ color: "var(--accent-primary)" }}>AI</span></span>
                </Link>
                <Link href="/dashboard" style={{ color: "var(--text-secondary)", textDecoration: "none", fontSize: "0.85rem" }}>← Dashboard</Link>
            </nav>

            {/* Live Ticker Bar */}
            {topGainers.length > 0 && (
                <div className="ticker-bar" style={{ background: "rgba(99,102,241,0.08)", borderBottom: "1px solid var(--border-color)", padding: "0.5rem 0" }}>
                    <div className="ticker-content" style={{ fontSize: "0.8rem" }}>
                        {sortedSkills.map((s, i) => (
                            <span key={i} style={{ marginRight: "2rem" }}>
                                <strong>{s.skill_name}</strong>{" "}
                                <span className={s.delta_pct >= 0 ? "trend-up" : "trend-down"}>
                                    {s.delta_pct >= 0 ? "▲" : "▼"} {Math.abs(s.delta_pct).toFixed(1)}%
                                </span>
                                <span style={{ color: "var(--text-secondary)", marginLeft: "0.3rem" }}>₹{s.avg_salary_lpa}L avg</span>
                            </span>
                        ))}
                    </div>
                </div>
            )}

            <main style={{ maxWidth: 900, margin: "0 auto", padding: "1.5rem 1rem" }}>
                {/* Header */}
                <div style={{ marginBottom: "1.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                        <span style={{ fontSize: "1.5rem" }}>📊</span>
                        <h1 style={{ fontSize: "1.8rem", fontWeight: 800 }}>Skill Stock Market™</h1>
                    </div>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.6 }}>
                        India&apos;s job market as a live ticker. Which skills are trending up, which are cooling down — updated every Monday.
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginTop: "0.75rem" }}>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", padding: "0.3rem 0.6rem", borderRadius: 8, background: "rgba(255,255,255,0.05)" }}>
                            📅 Last updated: {lastUpdated}
                        </span>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", padding: "0.3rem 0.6rem", borderRadius: 8, background: "rgba(255,255,255,0.05)" }}>
                            📰 Source: Public job market data
                        </span>
                    </div>
                </div>

                {/* Biggest Mover Hero Card */}
                {biggestMover && (
                    <div style={{
                        padding: "1.25rem 1.5rem", borderRadius: 16, marginBottom: "1.5rem",
                        background: biggestMover.delta_pct >= 0
                            ? "linear-gradient(135deg, rgba(34,197,94,0.12), rgba(99,102,241,0.08))"
                            : "linear-gradient(135deg, rgba(239,68,68,0.12), rgba(99,102,241,0.08))",
                        border: `1px solid ${biggestMover.delta_pct >= 0 ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`,
                    }}>
                        <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.4rem" }}>This Week&apos;s Biggest Mover</div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                            <span style={{ fontSize: "2rem", fontWeight: 800 }}>{biggestMover.skill_name}</span>
                            <span className={biggestMover.delta_pct >= 0 ? "trend-up" : "trend-down"} style={{ fontSize: "1.4rem", fontWeight: 700 }}>
                                {biggestMover.delta_pct >= 0 ? "+" : ""}{biggestMover.delta_pct.toFixed(1)}%
                            </span>
                            <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>postings this week</span>
                        </div>
                        <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "0.4rem" }}>
                            {biggestMover.posting_count.toLocaleString()} active job postings · ₹{biggestMover.avg_salary_lpa}L avg salary · Top hirers: {biggestMover.top_hiring_companies.slice(0, 3).join(", ")}
                        </div>
                    </div>
                )}

                {/* Filters */}
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
                    <div style={{ display: "flex", gap: "0.35rem", overflowX: "auto", paddingBottom: "0.25rem" }}>
                        {CITIES.map(city => (
                            <button key={city} className={`filter-btn ${selectedCity === city ? "active" : ""}`} onClick={() => setSelectedCity(city)}>
                                {city}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div style={{ textAlign: "center", padding: "3rem" }}>
                        <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📊</div>
                        <p style={{ color: "var(--text-secondary)" }}>Loading market data...</p>
                    </div>
                ) : (
                    <>
                        {/* Skill Tiles Grid */}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "0.75rem", marginBottom: "2rem" }}>
                            {sortedSkills.map((skill, i) => (
                                <div key={i} className="skill-card" style={{
                                    padding: "1rem 1.25rem", borderRadius: 14,
                                    border: "1px solid var(--border-color)",
                                    background: "rgba(255,255,255,0.02)",
                                }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                                        <span style={{ fontWeight: 700, fontSize: "1rem" }}>{skill.skill_name}</span>
                                        <span className={skill.delta_pct >= 0 ? "trend-up" : skill.delta_pct < 0 ? "trend-down" : "trend-neutral"}
                                            style={{ fontWeight: 700, fontSize: "0.95rem" }}>
                                            {skill.delta_pct >= 0 ? "▲" : "▼"} {Math.abs(skill.delta_pct).toFixed(1)}%
                                        </span>
                                    </div>
                                    <div style={{ display: "flex", gap: "1rem", fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.5rem" }}>
                                        <span>₹{skill.avg_salary_lpa}L avg</span>
                                        <span>{skill.posting_count.toLocaleString()} jobs</span>
                                    </div>
                                    <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                                        Top: {skill.top_hiring_companies.slice(0, 2).join(", ")}
                                    </div>
                                    {skill.city && (
                                        <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)", marginTop: "0.25rem", opacity: 0.7 }}>
                                            📍 {skill.city}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Personal Highlight (when logged in) */}
                        <div style={{
                            padding: "1.25rem", borderRadius: 14, marginBottom: "1.5rem",
                            background: "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.08))",
                            border: "1px solid rgba(99,102,241,0.2)",
                        }}>
                            <div style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--accent-primary)", marginBottom: "0.4rem", fontWeight: 600 }}>Your Personal Insight</div>
                            <p style={{ fontSize: "0.95rem", lineHeight: 1.6 }}>
                                Take the <Link href="/assessment" style={{ color: "var(--accent-primary)", textDecoration: "underline" }}>career assessment</Link> first, and we&apos;ll show you exactly which trending skills matter most for <em>your</em> specific career path.
                            </p>
                        </div>

                        {/* Share Card */}
                        <div style={{
                            padding: "1.25rem", borderRadius: 14, textAlign: "center",
                            border: "1px solid var(--border-color)", background: "rgba(255,255,255,0.02)",
                        }}>
                            <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "0.75rem" }}>
                                Share this week&apos;s skill report with your friends 📱
                            </p>
                            <button onClick={shareToWhatsApp} style={{
                                padding: "0.7rem 1.5rem", borderRadius: 12, border: "none", cursor: "pointer",
                                background: "#25D366", color: "white", fontWeight: 600, fontSize: "0.9rem",
                                display: "inline-flex", alignItems: "center", gap: "0.5rem",
                            }}>
                                📤 Share on WhatsApp
                            </button>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
