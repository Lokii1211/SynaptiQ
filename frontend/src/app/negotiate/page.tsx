"use client";
import { useState } from "react";
import Link from "next/link";

interface Message { role: "user" | "recruiter" | "coach"; content: string; score?: number; tip?: string }

export default function NegotiatePage() {
    const [phase, setPhase] = useState<"setup" | "negotiation" | "complete">("setup");
    const [setup, setSetup] = useState({ role: "Software Developer", company_type: "Product Startup", offer: "₹6 LPA", experience: "Fresher" });
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [score, setScore] = useState(50);

    const startNegotiation = () => {
        setPhase("negotiation");
        setMessages([{
            role: "recruiter",
            content: `Welcome! We're excited to extend an offer for the ${setup.role} position. We're offering a CTC of ${setup.offer}. This includes base salary, variable pay, and benefits. How does that sound to you?`
        }]);
    };

    const sendMessage = async () => {
        if (!input.trim() || loading) return;
        const userMsg = input.trim();
        setInput("");
        setMessages(prev => [...prev, { role: "user", content: userMsg }]);
        setLoading(true);

        try {
            const res = await fetch("/api/negotiate", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
                body: JSON.stringify({ ...setup, message: userMsg, history: messages.map(m => ({ role: m.role, content: m.content })) }),
            });
            const data = await res.json();
            setMessages(prev => [
                ...prev,
                { role: "recruiter", content: data.recruiter_response },
                { role: "coach", content: data.coaching_feedback, tip: data.tip, score: data.negotiation_score },
            ]);
            setScore(data.negotiation_score || score);
            if (data.is_final_offer) setPhase("complete");
        } catch {
            setMessages(prev => [...prev, { role: "coach", content: "Something went wrong. Try rephrasing your response." }]);
        }
        setLoading(false);
    };

    return (
        <div style={{ minHeight: "100vh", background: "var(--bg-primary)", color: "var(--text-primary)" }}>
            {/* Header */}
            <nav style={{ padding: "1rem 2rem", borderBottom: "1px solid var(--border-color)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Link href="/dashboard" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>← Back to Dashboard</Link>
                <h1 style={{ fontSize: "1.25rem", fontWeight: 700 }}>💰 Salary Negotiation Simulator</h1>
                <div style={{ padding: "0.5rem 1rem", borderRadius: "999px", background: score > 70 ? "rgba(34,197,94,0.15)" : score > 40 ? "rgba(234,179,8,0.15)" : "rgba(239,68,68,0.15)", color: score > 70 ? "#22c55e" : score > 40 ? "#eab308" : "#ef4444", fontWeight: 700, fontSize: "0.875rem" }}>
                    Score: {score}/100
                </div>
            </nav>

            <div style={{ maxWidth: 800, margin: "0 auto", padding: "2rem" }}>
                {phase === "setup" && (
                    <div style={{ animation: "fadeInUp 0.6s ease" }}>
                        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                            <h2 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "0.5rem" }}>Practice Your <span className="gradient-text">Salary Negotiation</span></h2>
                            <p style={{ color: "var(--text-secondary)", maxWidth: 500, margin: "0 auto" }}>
                                Negotiating ₹1 LPA more in your first job = ₹15-25 LPA more over your career. Let's practice.
                            </p>
                        </div>

                        <div className="glass-card" style={{ padding: "2rem", borderRadius: 16 }}>
                            <div style={{ display: "grid", gap: "1.5rem" }}>
                                {[
                                    { label: "Target Role", key: "role", options: ["Software Developer", "Data Scientist", "Product Manager", "UX Designer", "AI/ML Engineer", "DevOps Engineer", "Cybersecurity Analyst"] },
                                    { label: "Company Type", key: "company_type", options: ["Product Startup", "FAANG/Big Tech", "Service Company (TCS/Infosys)", "Mid-size Product Company", "Fintech Startup", "E-commerce Company"] },
                                    { label: "Initial Offer", key: "offer", options: ["₹3.5 LPA", "₹5 LPA", "₹6 LPA", "₹8 LPA", "₹10 LPA", "₹12 LPA", "₹15 LPA", "₹20 LPA"] },
                                    { label: "Your Experience", key: "experience", options: ["Fresher", "1 Internship", "2+ Internships", "1 Year Experience", "2-3 Years Experience"] },
                                ].map(field => (
                                    <div key={field.key}>
                                        <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-secondary)", fontSize: "0.875rem", fontWeight: 600 }}>{field.label}</label>
                                        <select
                                            value={(setup as any)[field.key]}
                                            onChange={e => setSetup(p => ({ ...p, [field.key]: e.target.value }))}
                                            style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: 10, background: "var(--bg-secondary)", border: "1px solid var(--border-color)", color: "var(--text-primary)", fontSize: "1rem" }}
                                        >
                                            {field.options.map(o => <option key={o} value={o}>{o}</option>)}
                                        </select>
                                    </div>
                                ))}
                            </div>

                            <button onClick={startNegotiation} style={{ width: "100%", marginTop: "1.5rem", padding: "1rem", background: "linear-gradient(135deg, var(--accent-primary), #8b5cf6)", color: "white", border: "none", borderRadius: 12, fontSize: "1.1rem", fontWeight: 700, cursor: "pointer" }}>
                                🎯 Start Negotiation Simulation
                            </button>
                        </div>

                        <div className="glass-card" style={{ padding: "1.5rem", borderRadius: 12, marginTop: "1.5rem", background: "rgba(234,179,8,0.05)", border: "1px solid rgba(234,179,8,0.2)" }}>
                            <h3 style={{ color: "#eab308", marginBottom: "0.75rem", fontSize: "1rem" }}>💡 Key Negotiation Facts for India</h3>
                            <ul style={{ color: "var(--text-secondary)", fontSize: "0.875rem", lineHeight: 1.8, paddingLeft: "1.2rem" }}>
                                <li>The first salary anchors your entire career trajectory — negotiate well</li>
                                <li>Always ask about the complete compensation structure (base + variable + benefits + ESOPs)</li>
                                <li>"What's your current CTC?" — you're not obligated to answer. Redirect to expected CTC</li>
                                <li>Variable pay in most Indian companies is 10-20% — ask if it's guaranteed in Year 1</li>
                                <li>Competing offers are your strongest leverage — always have alternatives</li>
                            </ul>
                        </div>
                    </div>
                )}

                {(phase === "negotiation" || phase === "complete") && (
                    <div style={{ animation: "fadeInUp 0.4s ease" }}>
                        <div style={{ marginBottom: "1rem", padding: "0.75rem 1rem", borderRadius: 10, background: "var(--bg-secondary)", display: "flex", gap: "1.5rem", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                            <span>🎯 {setup.role}</span>
                            <span>🏢 {setup.company_type}</span>
                            <span>💰 Offer: {setup.offer}</span>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem", maxHeight: "60vh", overflowY: "auto", paddingRight: "0.5rem" }}>
                            {messages.map((msg, i) => (
                                <div key={i} style={{
                                    padding: "1rem 1.25rem", borderRadius: 16,
                                    background: msg.role === "user" ? "linear-gradient(135deg, var(--accent-primary), #8b5cf6)" : msg.role === "coach" ? "rgba(234,179,8,0.08)" : "var(--bg-card)",
                                    border: msg.role === "coach" ? "1px solid rgba(234,179,8,0.2)" : "1px solid var(--border-color)",
                                    alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                                    maxWidth: "85%",
                                }}>
                                    <div style={{ fontSize: "0.7rem", fontWeight: 700, marginBottom: "0.4rem", color: msg.role === "user" ? "rgba(255,255,255,0.7)" : msg.role === "coach" ? "#eab308" : "var(--accent-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                        {msg.role === "user" ? "You" : msg.role === "coach" ? "🎓 AI Coach" : "👔 HR Recruiter"}
                                    </div>
                                    <p style={{ margin: 0, lineHeight: 1.6, fontSize: "0.95rem" }}>{msg.content}</p>
                                    {msg.tip && <p style={{ marginTop: "0.75rem", padding: "0.5rem 0.75rem", borderRadius: 8, background: "rgba(234,179,8,0.1)", fontSize: "0.8rem", color: "#eab308" }}>💡 Tip: {msg.tip}</p>}
                                </div>
                            ))}
                            {loading && (
                                <div style={{ padding: "1rem", borderRadius: 12, background: "var(--bg-card)", border: "1px solid var(--border-color)", alignSelf: "flex-start" }}>
                                    <div className="typing-indicator"><span></span><span></span><span></span></div>
                                </div>
                            )}
                        </div>

                        {phase !== "complete" && (
                            <div style={{ display: "flex", gap: "0.75rem" }}>
                                <input
                                    value={input} onChange={e => setInput(e.target.value)}
                                    onKeyDown={e => e.key === "Enter" && sendMessage()}
                                    placeholder="Type your negotiation response..."
                                    style={{ flex: 1, padding: "0.875rem 1.25rem", borderRadius: 12, background: "var(--bg-card)", border: "1px solid var(--border-color)", color: "var(--text-primary)", fontSize: "0.95rem" }}
                                />
                                <button onClick={sendMessage} disabled={loading} style={{ padding: "0.875rem 1.5rem", borderRadius: 12, background: "linear-gradient(135deg, var(--accent-primary), #8b5cf6)", color: "white", border: "none", fontWeight: 700, cursor: "pointer", opacity: loading ? 0.6 : 1 }}>
                                    Send
                                </button>
                            </div>
                        )}

                        {phase === "complete" && (
                            <div className="glass-card" style={{ padding: "1.5rem", borderRadius: 12, textAlign: "center", background: "rgba(34,197,94,0.05)", border: "1px solid rgba(34,197,94,0.2)" }}>
                                <h3 style={{ color: "#22c55e", marginBottom: "0.5rem" }}>🎉 Negotiation Complete!</h3>
                                <p style={{ color: "var(--text-secondary)", marginBottom: "1rem" }}>Final Score: <strong style={{ color: "var(--text-primary)", fontSize: "1.5rem" }}>{score}/100</strong></p>
                                <button onClick={() => { setPhase("setup"); setMessages([]); setScore(50); }} style={{ padding: "0.75rem 2rem", borderRadius: 10, background: "var(--accent-primary)", color: "white", border: "none", fontWeight: 600, cursor: "pointer" }}>Practice Again</button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
