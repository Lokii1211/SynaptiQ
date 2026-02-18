"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function JobsPage() {
    const [jobs, setJobs] = useState<any[]>([]);
    const [category, setCategory] = useState("");
    const [type, setType] = useState("");
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());
    const [showPremium, setShowPremium] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams();
        if (category) params.set("category", category);
        if (type) params.set("type", type);
        if (search) params.set("search", search);
        fetch(`/api/jobs?${params.toString()}`)
            .then(r => r.json()).then(d => { setJobs(d.jobs || []); setLoading(false); });
    }, [category, type, search]);

    const toggleSave = (id: string) => {
        const next = new Set(savedJobs);
        if (next.has(id)) { next.delete(id); } else { next.add(id); }
        setSavedJobs(next);
    };

    return (
        <div style={{ minHeight: "100vh", background: "var(--bg-primary)", color: "var(--text-primary)" }}>
            <nav style={{ padding: "1rem 2rem", borderBottom: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "rgba(10,10,15,0.9)", backdropFilter: "blur(20px)", zIndex: 100 }}>
                <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none", color: "var(--text-primary)" }}>
                    <span style={{ fontSize: "1.5rem" }}>🧠</span>
                    <span style={{ fontWeight: 800, fontSize: "1.25rem" }}>SkillSync <span style={{ color: "#f43f5e" }}>Jobs</span></span>
                </Link>
                <button onClick={() => setShowPremium(true)} style={{ padding: "0.5rem 1.25rem", borderRadius: 10, background: "linear-gradient(135deg, #eab308, #f59e0b)", color: "#000", border: "none", fontWeight: 700, cursor: "pointer", fontSize: "0.85rem" }}>
                    ⭐ Go Premium
                </button>
            </nav>

            <div style={{ maxWidth: 1000, margin: "0 auto", padding: "2rem 1rem" }}>
                {/* Free Trial Banner */}
                <div className="glass-card" style={{ padding: "1.25rem 1.5rem", borderRadius: 14, marginBottom: "1.5rem", background: "linear-gradient(135deg, rgba(234,179,8,0.08), rgba(249,115,22,0.05))", border: "1px solid rgba(234,179,8,0.2)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
                    <div>
                        <h3 style={{ fontWeight: 700, marginBottom: "0.25rem" }}>🎁 7-Day Free Premium Trial</h3>
                        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Get daily job alerts, priority applications, and salary insights — free for 7 days!</p>
                    </div>
                    <button onClick={() => setShowPremium(true)} style={{ padding: "0.6rem 1.5rem", borderRadius: 10, background: "linear-gradient(135deg, #eab308, #f59e0b)", color: "#000", border: "none", fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
                        Start Free Trial →
                    </button>
                </div>

                {/* Premium Modal */}
                {showPremium && (
                    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }} onClick={() => setShowPremium(false)}>
                        <div className="glass-card" style={{ padding: "2.5rem", borderRadius: 24, maxWidth: 500, width: "100%", textAlign: "center" }} onClick={e => e.stopPropagation()}>
                            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⭐</div>
                            <h2 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "0.5rem" }}>SkillSync Premium</h2>
                            <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>Unlock the full power of your career journey</p>
                            <div style={{ textAlign: "left", marginBottom: "2rem" }}>
                                {["Daily job alerts matching your career choice", "Priority application badge on your profile", "Unlimited AI career chat sessions", "Advanced salary negotiation insights", "Exclusive community badges", "Resume review by AI", "Mock interview simulator"].map((f, i) => (
                                    <div key={i} style={{ padding: "0.5rem 0", display: "flex", gap: "0.75rem", alignItems: "center", borderBottom: "1px solid var(--border-color)" }}>
                                        <span style={{ color: "#22c55e" }}>✓</span>
                                        <span style={{ fontSize: "0.9rem" }}>{f}</span>
                                    </div>
                                ))}
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
                                <div style={{ padding: "1rem", borderRadius: 14, border: "2px solid #eab308", background: "rgba(234,179,8,0.05)" }}>
                                    <p style={{ fontWeight: 800, fontSize: "1.5rem", color: "#eab308" }}>₹0</p>
                                    <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>7-Day Free Trial</p>
                                </div>
                                <div style={{ padding: "1rem", borderRadius: 14, border: "1px solid var(--border-color)" }}>
                                    <p style={{ fontWeight: 800, fontSize: "1.5rem" }}>₹199<span style={{ fontSize: "0.8rem", fontWeight: 400 }}>/mo</span></p>
                                    <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>After trial</p>
                                </div>
                            </div>
                            <button onClick={() => { setShowPremium(false); alert("🎉 Premium trial activated! (Demo mode)"); }}
                                style={{ width: "100%", padding: "0.85rem", borderRadius: 12, background: "linear-gradient(135deg, #eab308, #f59e0b)", color: "#000", border: "none", fontWeight: 800, cursor: "pointer", fontSize: "1rem" }}>
                                Start 7-Day Free Trial →
                            </button>
                            <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0.75rem" }}>Cancel anytime. No credit card required for trial.</p>
                        </div>
                    </div>
                )}

                {/* Search and Filters */}
                <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
                    <input placeholder="Search jobs, companies, skills..." value={search} onChange={e => setSearch(e.target.value)}
                        style={{ flex: 2, minWidth: 200, padding: "0.75rem 1rem", borderRadius: 12, border: "1px solid var(--border-color)", background: "var(--bg-card)", color: "var(--text-primary)", fontSize: "0.9rem", outline: "none" }} />
                    <select value={category} onChange={e => setCategory(e.target.value)}
                        style={{ padding: "0.75rem 1rem", borderRadius: 12, border: "1px solid var(--border-color)", background: "var(--bg-card)", color: "var(--text-primary)", fontSize: "0.85rem", minWidth: 140 }}>
                        <option value="">All Categories</option>
                        <option value="technology">Technology</option>
                        <option value="business">Business</option>
                        <option value="design">Design</option>
                    </select>
                    <select value={type} onChange={e => setType(e.target.value)}
                        style={{ padding: "0.75rem 1rem", borderRadius: 12, border: "1px solid var(--border-color)", background: "var(--bg-card)", color: "var(--text-primary)", fontSize: "0.85rem", minWidth: 140 }}>
                        <option value="">All Types</option>
                        <option value="Full-time">Full-time</option>
                        <option value="Internship">Internship</option>
                    </select>
                </div>

                {/* Results Count */}
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1rem" }}>
                    Showing <strong style={{ color: "var(--text-primary)" }}>{jobs.length}</strong> opportunities
                </p>

                {/* Job Listings */}
                {loading ? (
                    <div style={{ textAlign: "center", padding: "3rem" }}>
                        <div style={{ width: 48, height: 48, border: "3px solid var(--border-color)", borderTopColor: "#f43f5e", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto" }} />
                    </div>
                ) : (
                    <div style={{ display: "grid", gap: "0.75rem" }}>
                        {jobs.map(job => (
                            <div key={job.id} className="glass-card" style={{ padding: "1.25rem 1.5rem", borderRadius: 14, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", transition: "all 0.2s" }}
                                onMouseEnter={e => { e.currentTarget.style.transform = "translateX(4px)"; e.currentTarget.style.borderColor = job.isHot ? "#f43f5e" : "var(--accent-primary)"; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.borderColor = "var(--border-color)"; }}>
                                <div style={{ flex: 1, minWidth: 200 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
                                        <h3 style={{ fontSize: "1rem", fontWeight: 700 }}>{job.title}</h3>
                                        {job.isHot && <span style={{ padding: "0.15rem 0.5rem", borderRadius: 999, background: "rgba(239,68,68,0.15)", color: "#ef4444", fontSize: "0.65rem", fontWeight: 700 }}>🔥 HOT</span>}
                                        <span style={{ padding: "0.15rem 0.5rem", borderRadius: 999, background: job.type === "Internship" ? "rgba(99,102,241,0.1)" : "rgba(34,197,94,0.1)", color: job.type === "Internship" ? "var(--accent-primary)" : "#22c55e", fontSize: "0.65rem", fontWeight: 700 }}>{job.type}</span>
                                    </div>
                                    <div style={{ display: "flex", gap: "1rem", fontSize: "0.8rem", color: "var(--text-secondary)", flexWrap: "wrap", marginBottom: "0.5rem" }}>
                                        <span>🏢 {job.company}</span>
                                        <span>📍 {job.location}</span>
                                        <span>💰 {job.salary}</span>
                                        <span>📅 {job.experience}</span>
                                    </div>
                                    <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                                        {job.skills.map((s: string) => (
                                            <span key={s} style={{ padding: "0.15rem 0.5rem", borderRadius: 999, background: "rgba(99,102,241,0.08)", color: "var(--accent-primary)", fontSize: "0.7rem" }}>{s}</span>
                                        ))}
                                    </div>
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.5rem", minWidth: 120 }}>
                                    <div style={{ display: "flex", gap: "0.4rem", fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                                        <span>⏰ {job.deadline}</span>
                                        <span>· {job.applicants} applied</span>
                                    </div>
                                    <div style={{ display: "flex", gap: "0.5rem" }}>
                                        <button onClick={() => toggleSave(job.id)}
                                            style={{ padding: "0.4rem 0.75rem", borderRadius: 8, background: "transparent", border: "1px solid var(--border-color)", color: savedJobs.has(job.id) ? "#eab308" : "var(--text-secondary)", cursor: "pointer", fontSize: "0.85rem" }}>
                                            {savedJobs.has(job.id) ? "★" : "☆"}
                                        </button>
                                        <button style={{ padding: "0.4rem 1rem", borderRadius: 8, background: "linear-gradient(135deg, var(--accent-primary), #8b5cf6)", color: "white", border: "none", fontWeight: 700, cursor: "pointer", fontSize: "0.8rem" }}>
                                            Apply →
                                        </button>
                                    </div>
                                    <span style={{ fontSize: "0.7rem", color: "var(--text-secondary)" }}>{job.posted}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
