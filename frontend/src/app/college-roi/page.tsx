"use client";
import { useState } from "react";
import Link from "next/link";

export default function CollegeROIPage() {
    const [form, setForm] = useState({ college: "", course: "", annual_fee: "", duration_years: "4", city: "" });
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const calculate = async () => {
        if (!form.college || !form.course || !form.annual_fee) return;
        setLoading(true);
        try {
            const res = await fetch("/api/college-roi", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, annual_fee: Number(form.annual_fee) }),
            });
            setResult(await res.json());
        } catch { /* fallback handled by API */ }
        setLoading(false);
    };

    return (
        <div style={{ minHeight: "100vh", background: "var(--bg-primary)", color: "var(--text-primary)" }}>
            <nav style={{ padding: "0.65rem clamp(0.75rem, 3vw, 2rem)", borderBottom: "1px solid var(--border-color)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem", position: "sticky", top: 0, background: "rgba(10,10,15,0.95)", backdropFilter: "blur(20px)", zIndex: 100 }}>
                <Link href="/dashboard" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>← Back</Link>
                <h1 style={{ fontSize: "1.25rem", fontWeight: 700 }}>🎓 College ROI Calculator</h1>
                <div />
            </nav>

            <div style={{ maxWidth: 900, margin: "0 auto", padding: "clamp(1rem, 3vw, 2rem) clamp(0.5rem, 2vw, 1rem)" }}>
                <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                    <h2 style={{ fontSize: "2rem", fontWeight: 800 }}>Is This College <span className="gradient-text">Worth It?</span></h2>
                    <p style={{ color: "var(--text-secondary)" }}>The most important financial decision of your life, analyzed with data.</p>
                </div>

                {!result ? (
                    <div className="glass-card" style={{ padding: "2rem", borderRadius: 16, maxWidth: 550, margin: "0 auto" }}>
                        {[
                            { label: "College Name", key: "college", placeholder: "e.g., VIT Vellore, NIT Trichy, BITS Pilani" },
                            { label: "Course", key: "course", placeholder: "e.g., B.Tech Computer Science" },
                            { label: "Annual Fee (₹)", key: "annual_fee", placeholder: "e.g., 200000", type: "number" },
                            { label: "Duration (Years)", key: "duration_years", placeholder: "4" },
                            { label: "City", key: "city", placeholder: "e.g., Chennai, Pune, Bangalore" },
                        ].map(f => (
                            <div key={f.key} style={{ marginBottom: "1.25rem" }}>
                                <label style={{ display: "block", marginBottom: "0.4rem", fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)" }}>{f.label}</label>
                                <input
                                    value={(form as any)[f.key]}
                                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                                    placeholder={f.placeholder}
                                    type={f.type || "text"}
                                    style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: 10, background: "var(--bg-secondary)", border: "1px solid var(--border-color)", color: "var(--text-primary)", fontSize: "0.95rem" }}
                                />
                            </div>
                        ))}
                        <button onClick={calculate} disabled={loading || !form.college || !form.course || !form.annual_fee}
                            style={{ width: "100%", padding: "1rem", background: "linear-gradient(135deg, var(--accent-primary), #8b5cf6)", color: "white", border: "none", borderRadius: 12, fontSize: "1.1rem", fontWeight: 700, cursor: "pointer", opacity: loading ? 0.6 : 1 }}>
                            {loading ? "Analyzing..." : "📊 Calculate ROI"}
                        </button>
                    </div>
                ) : (
                    <div style={{ animation: "fadeInUp 0.5s ease" }}>
                        {/* Verdict Banner */}
                        <div className="glass-card" style={{ padding: "1.5rem", borderRadius: 16, marginBottom: "1.5rem", background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)", textAlign: "center" }}>
                            <h3 style={{ color: "var(--accent-secondary)", marginBottom: "0.5rem" }}>📝 Verdict</h3>
                            <p style={{ fontSize: "1.1rem", lineHeight: 1.7 }}>{result.verdict}</p>
                        </div>

                        {/* Key Stats Grid */}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
                            {[
                                { label: "Total Investment", value: result.total_investment, icon: "💰", color: "#ef4444" },
                                { label: "Break-even", value: `${result.break_even_months} months`, icon: "⏱️", color: "#eab308" },
                                { label: "5-Year ROI", value: result.roi_5_year, icon: "📈", color: "#22c55e" },
                                { label: "Placement Rate", value: result.placement_rate_estimate, icon: "🎯", color: "#6366f1" },
                            ].map((s, i) => (
                                <div key={i} className="glass-card" style={{ padding: "1.25rem", borderRadius: 12, textAlign: "center" }}>
                                    <span style={{ fontSize: "1.5rem" }}>{s.icon}</span>
                                    <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0.5rem" }}>{s.label}</p>
                                    <p style={{ fontSize: "1.1rem", fontWeight: 700, color: s.color, marginTop: "0.25rem" }}>{typeof s.value === 'string' ? s.value.substring(0, 40) : s.value}</p>
                                </div>
                            ))}
                        </div>

                        {/* Salary Expectations */}
                        <div className="glass-card" style={{ padding: "1.5rem", borderRadius: 16, marginBottom: "1.5rem" }}>
                            <h3 style={{ marginBottom: "1rem", fontSize: "1.1rem" }}>💼 Expected Salary (Year 1)</h3>
                            <div style={{ display: "flex", justifyContent: "space-around", textAlign: "center" }}>
                                {[
                                    { label: "Bottom 25%", value: result.expected_salary_year1?.bottom_25, color: "#ef4444" },
                                    { label: "Median", value: result.expected_salary_year1?.median, color: "#eab308" },
                                    { label: "Top 25%", value: result.expected_salary_year1?.top_25, color: "#22c55e" },
                                ].map((s, i) => (
                                    <div key={i}>
                                        <p style={{ fontSize: "1.5rem", fontWeight: 800, color: s.color }}>{s.value}</p>
                                        <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{s.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Loan Simulation */}
                        {result.loan_simulation && (
                            <div className="glass-card" style={{ padding: "1.5rem", borderRadius: 16, marginBottom: "1.5rem", background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.15)" }}>
                                <h3 style={{ marginBottom: "1rem", fontSize: "1.1rem", color: "#ef4444" }}>🏦 Education Loan Simulation</h3>
                                <div style={{ display: "flex", justifyContent: "space-around", textAlign: "center" }}>
                                    <div><p style={{ fontSize: "1.2rem", fontWeight: 700 }}>{result.loan_simulation.monthly_emi}</p><p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Monthly EMI</p></div>
                                    <div><p style={{ fontSize: "1.2rem", fontWeight: 700 }}>{result.loan_simulation.loan_duration_years} years</p><p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Loan Duration</p></div>
                                    <div><p style={{ fontSize: "1.2rem", fontWeight: 700 }}>{result.loan_simulation.total_interest}</p><p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Total Interest</p></div>
                                </div>
                            </div>
                        )}

                        {/* Alternatives */}
                        {result.alternatives?.length > 0 && (
                            <div className="glass-card" style={{ padding: "1.5rem", borderRadius: 16, marginBottom: "1.5rem" }}>
                                <h3 style={{ marginBottom: "1rem", fontSize: "1.1rem" }}>🔄 Alternative Paths</h3>
                                {result.alternatives.map((alt: any, i: number) => (
                                    <div key={i} style={{ padding: "1rem", borderRadius: 10, background: "var(--bg-secondary)", marginBottom: "0.75rem" }}>
                                        <p style={{ fontWeight: 700, marginBottom: "0.25rem" }}>{alt.option}</p>
                                        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Cost: {alt.cost} • Time: {alt.time}</p>
                                        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>{alt.expected_outcome}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Hidden Costs + Tips */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
                            <div className="glass-card" style={{ padding: "1.25rem", borderRadius: 12 }}>
                                <h4 style={{ color: "#ef4444", marginBottom: "0.75rem", fontSize: "0.95rem" }}>⚠️ Hidden Costs</h4>
                                <ul style={{ paddingLeft: "1.2rem", fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.8 }}>
                                    {result.hidden_costs?.map((c: string, i: number) => <li key={i}>{c}</li>)}
                                </ul>
                            </div>
                            <div className="glass-card" style={{ padding: "1.25rem", borderRadius: 12 }}>
                                <h4 style={{ color: "#22c55e", marginBottom: "0.75rem", fontSize: "0.95rem" }}>💡 Money-Saving Tips</h4>
                                <ul style={{ paddingLeft: "1.2rem", fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.8 }}>
                                    {result.tips?.map((t: string, i: number) => <li key={i}>{t}</li>)}
                                </ul>
                            </div>
                        </div>

                        <button onClick={() => setResult(null)} style={{ width: "100%", padding: "0.875rem", borderRadius: 12, background: "var(--bg-card)", border: "1px solid var(--border-color)", color: "var(--text-primary)", fontWeight: 600, cursor: "pointer" }}>
                            ← Calculate for Another College
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
