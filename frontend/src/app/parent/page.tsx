"use client";
import { useState } from "react";
import Link from "next/link";

export default function ParentPage() {
    const [report, setReport] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [childName, setChildName] = useState("");
    const [activeTab, setActiveTab] = useState<"report" | "concerns" | "faqs" | "conversation">("report");

    const generateReport = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/parent-report", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${typeof window !== "undefined" ? localStorage.getItem("token") : ""}` },
                body: JSON.stringify({ child_name: childName || "Your Child" }),
            });
            setReport(await res.json());
        } catch { /* handled */ }
        setLoading(false);
    };

    const tabs = [
        { key: "report", label: "📊 Career Report", icon: "📊" },
        { key: "concerns", label: "💬 Concerns Addressed", icon: "💬" },
        { key: "faqs", label: "❓ Parent FAQs", icon: "❓" },
        { key: "conversation", label: "🗣️ Conversation Guide", icon: "🗣️" },
    ];

    return (
        <div style={{ minHeight: "100vh", background: "var(--bg-primary)", color: "var(--text-primary)" }}>
            <nav style={{ padding: "0.65rem clamp(0.75rem, 3vw, 2rem)", borderBottom: "1px solid var(--border-color)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem", position: "sticky", top: 0, background: "rgba(10,10,15,0.95)", backdropFilter: "blur(20px)", zIndex: 100 }}>
                <Link href="/dashboard" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>← Back</Link>
                <h1 style={{ fontSize: "1.25rem", fontWeight: 700 }}>👨‍👩‍👧 Parent Conversation Toolkit</h1>
                <div />
            </nav>

            <div style={{ maxWidth: 800, margin: "0 auto", padding: "clamp(1rem, 3vw, 2rem) clamp(0.5rem, 2vw, 1rem)" }}>
                {!report ? (
                    <div style={{ animation: "fadeInUp 0.6s ease" }}>
                        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
                            <h2 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "0.5rem" }}>Bridge the <span className="gradient-text">Career Conversation</span> Gap</h2>
                            <p style={{ color: "var(--text-secondary)", maxWidth: 550, margin: "0 auto", lineHeight: 1.7 }}>
                                The biggest career barrier for Indian students isn't information — it's parental alignment. This toolkit helps you and your parents get on the same page with data, not arguments.
                            </p>
                        </div>

                        <div className="glass-card" style={{ padding: "2rem", borderRadius: 16, maxWidth: 500, margin: "0 auto" }}>
                            <h3 style={{ marginBottom: "1.5rem", fontSize: "1.1rem" }}>Generate Your Parent Report</h3>
                            <div style={{ marginBottom: "1.25rem" }}>
                                <label style={{ display: "block", marginBottom: "0.4rem", fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)" }}>Your Name</label>
                                <input value={childName} onChange={e => setChildName(e.target.value)} placeholder="e.g., Priya, Rahul"
                                    style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: 10, background: "var(--bg-secondary)", border: "1px solid var(--border-color)", color: "var(--text-primary)", fontSize: "0.95rem" }} />
                            </div>
                            <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "1.25rem", padding: "0.75rem", borderRadius: 8, background: "rgba(99,102,241,0.05)" }}>
                                💡 Take the Career Assessment first for the most detailed parent report. Without assessment data, we'll use our standard insights.
                            </p>
                            <button onClick={generateReport} disabled={loading}
                                style={{ width: "100%", padding: "1rem", background: "linear-gradient(135deg, var(--accent-primary), #8b5cf6)", color: "white", border: "none", borderRadius: 12, fontSize: "1.05rem", fontWeight: 700, cursor: "pointer", opacity: loading ? 0.6 : 1 }}>
                                {loading ? "Generating Report..." : "📄 Generate Parent Report"}
                            </button>
                        </div>

                        {/* Why This Matters */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "2rem" }}>
                            {[
                                { icon: "📊", title: "Data, Not Arguments", desc: "Show your parents real market data, salary ranges, and company names — not just opinions." },
                                { icon: "🤝", title: "Respectful Framing", desc: "Every insight is framed to acknowledge that your parents want the best for you." },
                                { icon: "📈", title: "Job Security Evidence", desc: "Address the #1 parental concern with real employment statistics and company hiring data." },
                                { icon: "💬", title: "Conversation Scripts", desc: "Ready-to-use talking points for that difficult 'I want to pursue X' conversation." },
                            ].map((item, i) => (
                                <div key={i} className="glass-card" style={{ padding: "1.25rem", borderRadius: 12 }}>
                                    <span style={{ fontSize: "1.5rem" }}>{item.icon}</span>
                                    <h4 style={{ margin: "0.75rem 0 0.25rem", fontSize: "0.95rem" }}>{item.title}</h4>
                                    <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div style={{ animation: "fadeInUp 0.5s ease" }}>
                        {/* Greeting */}
                        <div className="glass-card" style={{ padding: "1.5rem", borderRadius: 16, marginBottom: "1.5rem", background: "rgba(99,102,241,0.05)", border: "1px solid rgba(99,102,241,0.15)" }}>
                            <p style={{ fontSize: "1.05rem", lineHeight: 1.7, fontStyle: "italic" }}>{report.greeting}</p>
                        </div>

                        {/* Tabs */}
                        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", overflowX: "auto" }}>
                            {tabs.map(tab => (
                                <button key={tab.key} onClick={() => setActiveTab(tab.key as any)}
                                    style={{
                                        padding: "0.6rem 1rem", borderRadius: 10, fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap",
                                        background: activeTab === tab.key ? "linear-gradient(135deg, var(--accent-primary), #8b5cf6)" : "var(--bg-card)",
                                        color: activeTab === tab.key ? "white" : "var(--text-secondary)", border: activeTab === tab.key ? "none" : "1px solid var(--border-color)"
                                    }}>
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        {activeTab === "report" && (
                            <div>
                                <div className="glass-card" style={{ padding: "1.5rem", borderRadius: 16, marginBottom: "1.25rem" }}>
                                    <h3 style={{ marginBottom: "1rem" }}>🌟 {childName || "Your Child"}'s Key Strengths</h3>
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                                        {report.child_strengths?.map((s: string, i: number) => (
                                            <span key={i} style={{ padding: "0.5rem 1rem", borderRadius: 999, background: "rgba(34,197,94,0.1)", color: "#22c55e", fontSize: "0.85rem", fontWeight: 500 }}>{s}</span>
                                        ))}
                                    </div>
                                </div>
                                {report.recommended_careers?.map((c: any, i: number) => (
                                    <div key={i} className="glass-card" style={{ padding: "1.5rem", borderRadius: 16, marginBottom: "1rem" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                                            <h4 style={{ fontSize: "1.1rem" }}>{c.career}</h4>
                                            <span style={{ padding: "0.3rem 0.75rem", borderRadius: 999, background: c.job_security === "Very High" || c.job_security === "High" ? "rgba(34,197,94,0.1)" : "rgba(234,179,8,0.1)", color: c.job_security === "Very High" || c.job_security === "High" ? "#22c55e" : "#eab308", fontSize: "0.75rem", fontWeight: 700 }}>
                                                Job Security: {c.job_security}
                                            </span>
                                        </div>
                                        <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "0.75rem" }}>{c.why_good_fit}</p>
                                        <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#22c55e" }}>💰 Salary potential: {c.salary_potential}</p>
                                        <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>🏢 Companies hiring: {c.companies_hiring?.join(", ")}</p>
                                        {c.success_stories && <p style={{ fontSize: "0.8rem", color: "var(--accent-secondary)", marginTop: "0.5rem", padding: "0.5rem 0.75rem", borderRadius: 8, background: "rgba(99,102,241,0.05)" }}>📖 {c.success_stories}</p>}
                                    </div>
                                ))}
                                {report.next_steps_for_parents && (
                                    <div className="glass-card" style={{ padding: "1.5rem", borderRadius: 16, background: "rgba(34,197,94,0.05)", border: "1px solid rgba(34,197,94,0.15)" }}>
                                        <h4 style={{ color: "#22c55e", marginBottom: "0.75rem" }}>✅ How Parents Can Help</h4>
                                        <ul style={{ paddingLeft: "1.2rem", fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 2 }}>
                                            {report.next_steps_for_parents.map((s: string, i: number) => <li key={i}>{s}</li>)}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === "concerns" && (
                            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                                {report.common_concerns_addressed?.map((c: any, i: number) => (
                                    <div key={i} className="glass-card" style={{ padding: "1.5rem", borderRadius: 16 }}>
                                        <h4 style={{ color: "#eab308", marginBottom: "0.5rem", fontSize: "0.95rem" }}>🤔 "{c.concern}"</h4>
                                        <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.7 }}>{c.answer}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === "faqs" && (
                            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                                {report.faqs?.map((faq: any, i: number) => (
                                    <div key={i} className="glass-card" style={{ padding: "1.5rem", borderRadius: 16 }}>
                                        <h4 style={{ marginBottom: "0.5rem", fontSize: "0.95rem" }}>❓ {faq.q}</h4>
                                        <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.7 }}>{faq.a}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === "conversation" && (
                            <div>
                                <div className="glass-card" style={{ padding: "1.5rem", borderRadius: 16, marginBottom: "1rem", background: "rgba(99,102,241,0.05)", border: "1px solid rgba(99,102,241,0.15)" }}>
                                    <h3 style={{ marginBottom: "1rem", fontSize: "1.1rem" }}>🗣️ How to Start the Conversation</h3>
                                    <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1rem", lineHeight: 1.6 }}>
                                        These are research-backed conversation starters that open dialogue without creating conflict:
                                    </p>
                                    {report.conversation_starters?.map((s: string, i: number) => (
                                        <div key={i} style={{ padding: "1rem", borderRadius: 10, background: "var(--bg-secondary)", marginBottom: "0.75rem", fontSize: "0.95rem", fontStyle: "italic", lineHeight: 1.7 }}>
                                            "{s}"
                                        </div>
                                    ))}
                                </div>
                                <div className="glass-card" style={{ padding: "1.5rem", borderRadius: 16, background: "rgba(234,179,8,0.05)", border: "1px solid rgba(234,179,8,0.2)" }}>
                                    <h4 style={{ color: "#eab308", marginBottom: "0.75rem" }}>💡 Pro Tips for the Conversation</h4>
                                    <ul style={{ paddingLeft: "1.2rem", fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 2 }}>
                                        <li>Choose a calm moment — not during exam stress or results day</li>
                                        <li>Lead with data, not emotion — "Here's what the job market says"</li>
                                        <li>Acknowledge their concerns first before presenting alternatives</li>
                                        <li>Show this report on your phone — visual data builds trust</li>
                                        <li>Suggest a trial period: "Let me try this for 6 months and we can review"</li>
                                    </ul>
                                </div>
                            </div>
                        )}

                        <button onClick={() => setReport(null)} style={{ width: "100%", padding: "0.875rem", borderRadius: 12, background: "var(--bg-card)", border: "1px solid var(--border-color)", color: "var(--text-primary)", fontWeight: 600, cursor: "pointer", marginTop: "1.5rem" }}>
                            ← Generate New Report
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
