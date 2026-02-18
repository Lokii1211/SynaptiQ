"use client";
import { useState } from "react";
import Link from "next/link";

const CAREER_OPTIONS = [
    "Software Developer", "Data Scientist", "Product Manager", "UX Designer",
    "AI/ML Engineer", "Cybersecurity Analyst", "Digital Marketer", "Chartered Accountant",
    "Doctor", "Mechanical Engineer", "Civil Services Officer", "Graphic Designer"
];

interface SimStep {
    time: string; scenario: string; feeling_check: string;
    choices: { text: string; trait: string }[];
    reality_note: string; is_last_step: boolean;
    day_summary?: string;
    fit_indicators?: { energized_by: string[]; drained_by: string[]; surprised_by: string[] };
}

export default function SimulatorPage() {
    const [career, setCareer] = useState("");
    const [step, setStep] = useState(0);
    const [data, setData] = useState<SimStep | null>(null);
    const [loading, setLoading] = useState(false);
    const [energyLog, setEnergyLog] = useState<{ time: string; energy: number }[]>([]);
    const [started, setStarted] = useState(false);

    const loadStep = async (stepNum: number, choice?: string) => {
        setLoading(true);
        try {
            const res = await fetch("/api/simulate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ career, step: stepNum, choice }),
            });
            const result = await res.json();
            setData(result);
            setStep(stepNum);
        } catch { /* handled */ }
        setLoading(false);
    };

    const start = () => {
        if (!career) return;
        setStarted(true);
        setEnergyLog([]);
        loadStep(1);
    };

    const makeChoice = (choice: string, energy: number) => {
        setEnergyLog(prev => [...prev, { time: data?.time || "", energy }]);
        if (data?.is_last_step) return;
        loadStep(step + 1, choice);
    };

    return (
        <div style={{ minHeight: "100vh", background: "var(--bg-primary)", color: "var(--text-primary)" }}>
            <nav style={{ padding: "1rem 2rem", borderBottom: "1px solid var(--border-color)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Link href="/dashboard" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>← Back</Link>
                <h1 style={{ fontSize: "1.25rem", fontWeight: 700 }}>🎮 Career Day Simulator</h1>
                {started && <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Step {step}/6</span>}
            </nav>

            <div style={{ maxWidth: 700, margin: "0 auto", padding: "2rem" }}>
                {!started ? (
                    <div style={{ animation: "fadeInUp 0.6s ease" }}>
                        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                            <h2 style={{ fontSize: "2rem", fontWeight: 800 }}>Experience a <span className="gradient-text">Day in the Life</span></h2>
                            <p style={{ color: "var(--text-secondary)", maxWidth: 500, margin: "0 auto" }}>
                                Stop guessing. Experience what a career actually feels like — the real decisions, trade-offs, and daily rhythm.
                            </p>
                        </div>

                        <div className="glass-card" style={{ padding: "2rem", borderRadius: 16 }}>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)" }}>Choose a career to simulate</label>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "0.75rem", marginBottom: "1.5rem" }}>
                                {CAREER_OPTIONS.map(c => (
                                    <button key={c} onClick={() => setCareer(c)}
                                        style={{
                                            padding: "0.75rem 1rem", borderRadius: 10, fontSize: "0.875rem", fontWeight: 600, cursor: "pointer",
                                            background: career === c ? "linear-gradient(135deg, var(--accent-primary), #8b5cf6)" : "var(--bg-secondary)",
                                            color: career === c ? "white" : "var(--text-primary)",
                                            border: career === c ? "none" : "1px solid var(--border-color)",
                                            transition: "all 0.2s",
                                        }}>
                                        {c}
                                    </button>
                                ))}
                            </div>
                            <button onClick={start} disabled={!career}
                                style={{ width: "100%", padding: "1rem", background: career ? "linear-gradient(135deg, var(--accent-primary), #8b5cf6)" : "var(--bg-secondary)", color: career ? "white" : "var(--text-secondary)", border: "none", borderRadius: 12, fontSize: "1.1rem", fontWeight: 700, cursor: career ? "pointer" : "default" }}>
                                🚀 Start Your Day as a {career || "..."}
                            </button>
                        </div>
                    </div>
                ) : loading ? (
                    <div style={{ textAlign: "center", padding: "4rem 0" }}>
                        <div style={{ width: 48, height: 48, border: "3px solid var(--border-color)", borderTopColor: "var(--accent-primary)", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 1rem" }} />
                        <p style={{ color: "var(--text-secondary)" }}>Setting up the next scenario...</p>
                    </div>
                ) : data && (
                    <div style={{ animation: "fadeInUp 0.5s ease" }}>
                        {/* Time Badge */}
                        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                            <span style={{ display: "inline-block", padding: "0.5rem 1.5rem", borderRadius: 999, background: "linear-gradient(135deg, var(--accent-primary), #8b5cf6)", fontSize: "1.25rem", fontWeight: 800 }}>
                                🕐 {data.time}
                            </span>
                        </div>

                        {/* Scenario */}
                        <div className="glass-card" style={{ padding: "1.5rem", borderRadius: 16, marginBottom: "1.5rem" }}>
                            <p style={{ fontSize: "1.1rem", lineHeight: 1.8, marginBottom: "1rem" }}>{data.scenario}</p>
                            <p style={{ fontSize: "0.8rem", color: "var(--accent-secondary)", fontStyle: "italic" }}>Typical energy: {data.feeling_check}</p>
                        </div>

                        {/* Choices */}
                        {!data.is_last_step ? (
                            <div>
                                <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1rem" }}>What do you do?</h3>
                                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
                                    {data.choices?.map((choice, i) => (
                                        <button key={i} onClick={() => makeChoice(choice.text, 3 + i)}
                                            style={{ padding: "1rem 1.25rem", borderRadius: 12, background: "var(--bg-card)", border: "1px solid var(--border-color)", color: "var(--text-primary)", textAlign: "left", cursor: "pointer", fontSize: "0.95rem", lineHeight: 1.5, transition: "all 0.2s" }}
                                            onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent-primary)"; e.currentTarget.style.background = "rgba(99,102,241,0.05)"; }}
                                            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border-color)"; e.currentTarget.style.background = "var(--bg-card)"; }}>
                                            <span style={{ fontWeight: 700, color: "var(--accent-secondary)", marginRight: "0.5rem" }}>{String.fromCharCode(65 + i)}.</span>
                                            {choice.text}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            /* Final Summary */
                            <div style={{ animation: "fadeInUp 0.5s ease" }}>
                                <div className="glass-card" style={{ padding: "1.5rem", borderRadius: 16, marginBottom: "1.25rem", background: "rgba(34,197,94,0.05)", border: "1px solid rgba(34,197,94,0.2)" }}>
                                    <h3 style={{ color: "#22c55e", marginBottom: "0.75rem" }}>📊 Day Complete — Your Fit Analysis</h3>
                                    <p style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}>{data.day_summary}</p>
                                </div>

                                {data.fit_indicators && (
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
                                        <div className="glass-card" style={{ padding: "1rem", borderRadius: 12 }}>
                                            <h4 style={{ color: "#22c55e", fontSize: "0.85rem", marginBottom: "0.5rem" }}>⚡ Energized By</h4>
                                            <ul style={{ paddingLeft: "1rem", fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.8 }}>
                                                {data.fit_indicators.energized_by?.map((e, i) => <li key={i}>{e}</li>)}
                                            </ul>
                                        </div>
                                        <div className="glass-card" style={{ padding: "1rem", borderRadius: 12 }}>
                                            <h4 style={{ color: "#ef4444", fontSize: "0.85rem", marginBottom: "0.5rem" }}>😓 Drained By</h4>
                                            <ul style={{ paddingLeft: "1rem", fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.8 }}>
                                                {data.fit_indicators.drained_by?.map((d, i) => <li key={i}>{d}</li>)}
                                            </ul>
                                        </div>
                                        <div className="glass-card" style={{ padding: "1rem", borderRadius: 12 }}>
                                            <h4 style={{ color: "#eab308", fontSize: "0.85rem", marginBottom: "0.5rem" }}>🤔 Surprised By</h4>
                                            <ul style={{ paddingLeft: "1rem", fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.8 }}>
                                                {data.fit_indicators.surprised_by?.map((s, i) => <li key={i}>{s}</li>)}
                                            </ul>
                                        </div>
                                    </div>
                                )}

                                <div style={{ display: "flex", gap: "1rem" }}>
                                    <button onClick={() => { setStarted(false); setStep(0); setData(null); }}
                                        style={{ flex: 1, padding: "0.875rem", borderRadius: 12, background: "var(--bg-card)", border: "1px solid var(--border-color)", color: "var(--text-primary)", fontWeight: 600, cursor: "pointer" }}>
                                        Try Another Career
                                    </button>
                                    <Link href="/assessment" style={{ flex: 1, padding: "0.875rem", borderRadius: 12, background: "linear-gradient(135deg, var(--accent-primary), #8b5cf6)", color: "white", fontWeight: 600, textAlign: "center", textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        Take Full Assessment →
                                    </Link>
                                </div>
                            </div>
                        )}

                        {/* Reality Note */}
                        <div style={{ padding: "1rem", borderRadius: 10, background: "rgba(234,179,8,0.05)", border: "1px solid rgba(234,179,8,0.15)", marginTop: "1rem" }}>
                            <p style={{ fontSize: "0.8rem", color: "#eab308" }}>💡 <strong>Reality Check:</strong> {data.reality_note}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
