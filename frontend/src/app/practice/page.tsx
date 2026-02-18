"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function PracticePage() {
    const [challenges, setChallenges] = useState<any[]>([]);
    const [selected, setSelected] = useState<any>(null);
    const [code, setCode] = useState("");
    const [results, setResults] = useState<any>(null);
    const [running, setRunning] = useState(false);
    const [filter, setFilter] = useState("All");
    const [tab, setTab] = useState<"challenges" | "editor">("challenges");

    useEffect(() => {
        fetch("/api/practice").then(r => r.json()).then(d => setChallenges(d.challenges || []));
    }, []);

    const selectChallenge = (c: any) => {
        setSelected(c);
        setCode(c.starterCode);
        setResults(null);
        setTab("editor");
    };

    const runCode = async () => {
        if (!selected) return;
        setRunning(true);
        try {
            const res = await fetch("/api/practice", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ challengeId: selected.id, code }),
            });
            setResults(await res.json());
        } catch { setResults({ error: "Execution error" }); }
        setRunning(false);
    };

    const filtered = filter === "All" ? challenges : challenges.filter(c => c.difficulty === filter);
    const diffColors: Record<string, string> = { Easy: "#22c55e", Medium: "#eab308", Hard: "#ef4444" };

    return (
        <div style={{ minHeight: "100vh", background: "var(--bg-primary)", color: "var(--text-primary)" }}>
            <nav style={{ padding: "1rem 2rem", borderBottom: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "rgba(10,10,15,0.9)", backdropFilter: "blur(20px)", zIndex: 100 }}>
                <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none", color: "var(--text-primary)" }}>
                    <span style={{ fontSize: "1.5rem" }}>🧠</span>
                    <span style={{ fontWeight: 800, fontSize: "1.25rem" }}>SkillSync <span style={{ color: "#22c55e" }}>Code</span></span>
                </Link>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button onClick={() => setTab("challenges")} style={{ padding: "0.4rem 1rem", borderRadius: 8, background: tab === "challenges" ? "rgba(34,197,94,0.15)" : "transparent", border: "1px solid", borderColor: tab === "challenges" ? "#22c55e" : "var(--border-color)", color: tab === "challenges" ? "#22c55e" : "var(--text-secondary)", cursor: "pointer", fontSize: "0.85rem", fontWeight: 600 }}>Problems</button>
                    <button onClick={() => setTab("editor")} style={{ padding: "0.4rem 1rem", borderRadius: 8, background: tab === "editor" ? "rgba(34,197,94,0.15)" : "transparent", border: "1px solid", borderColor: tab === "editor" ? "#22c55e" : "var(--border-color)", color: tab === "editor" ? "#22c55e" : "var(--text-secondary)", cursor: "pointer", fontSize: "0.85rem", fontWeight: 600 }}>Editor</button>
                </div>
            </nav>

            <div style={{ maxWidth: 1200, margin: "0 auto", padding: "1.5rem 1rem" }}>
                {tab === "challenges" ? (
                    <>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
                            <div>
                                <h1 style={{ fontSize: "1.75rem", fontWeight: 800 }}>💻 Coding Challenges</h1>
                                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Practice like HackerRank — level up your DSA skills</p>
                            </div>
                            <div style={{ display: "flex", gap: "0.4rem" }}>
                                {["All", "Easy", "Medium", "Hard"].map(d => (
                                    <button key={d} onClick={() => setFilter(d)} style={{ padding: "0.4rem 0.8rem", borderRadius: 8, background: filter === d ? "rgba(99,102,241,0.15)" : "transparent", border: "1px solid", borderColor: filter === d ? "var(--accent-primary)" : "var(--border-color)", color: filter === d ? "var(--accent-primary)" : "var(--text-secondary)", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600 }}>{d}</button>
                                ))}
                            </div>
                        </div>
                        <div style={{ display: "grid", gap: "0.75rem" }}>
                            {filtered.map(c => (
                                <div key={c.id} className="glass-card" style={{ padding: "1.25rem", borderRadius: 14, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}
                                    onClick={() => selectChallenge(c)}
                                    onMouseEnter={e => e.currentTarget.style.borderColor = diffColors[c.difficulty]}
                                    onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border-color)"}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                        <span style={{ width: 36, height: 36, borderRadius: 8, background: `${diffColors[c.difficulty]}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem" }}>
                                            {c.difficulty === "Easy" ? "🟢" : c.difficulty === "Medium" ? "🟡" : "🔴"}
                                        </span>
                                        <div>
                                            <h3 style={{ fontSize: "1rem", fontWeight: 700 }}>{c.title}</h3>
                                            <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{c.category} · {c.points} pts</p>
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                                        <span style={{ padding: "0.2rem 0.6rem", borderRadius: 999, background: `${diffColors[c.difficulty]}15`, color: diffColors[c.difficulty], fontSize: "0.75rem", fontWeight: 700 }}>{c.difficulty}</span>
                                        {c.tags.map((t: string) => <span key={t} style={{ padding: "0.2rem 0.5rem", borderRadius: 999, background: "rgba(99,102,241,0.1)", color: "var(--accent-primary)", fontSize: "0.7rem" }}>{t}</span>)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", minHeight: "calc(100vh - 120px)" }}>
                        {/* Problem Description */}
                        <div className="glass-card" style={{ padding: "1.5rem", borderRadius: 14, overflowY: "auto", maxHeight: "calc(100vh - 140px)" }}>
                            {selected ? (
                                <>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                                        <h2 style={{ fontSize: "1.25rem", fontWeight: 800 }}>{selected.title}</h2>
                                        <span style={{ padding: "0.25rem 0.75rem", borderRadius: 999, background: `${diffColors[selected.difficulty]}15`, color: diffColors[selected.difficulty], fontSize: "0.8rem", fontWeight: 700 }}>{selected.difficulty}</span>
                                    </div>
                                    <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: "1.5rem" }}>{selected.description}</p>
                                    <h4 style={{ fontWeight: 700, marginBottom: "0.5rem" }}>Examples:</h4>
                                    {selected.examples.map((ex: any, i: number) => (
                                        <div key={i} style={{ background: "var(--bg-primary)", padding: "0.75rem", borderRadius: 8, marginBottom: "0.75rem", fontFamily: "monospace", fontSize: "0.85rem" }}>
                                            <div><strong>Input:</strong> {ex.input}</div>
                                            <div><strong>Output:</strong> {ex.output}</div>
                                        </div>
                                    ))}
                                    {selected.hints.length > 0 && (
                                        <details style={{ marginTop: "1rem" }}>
                                            <summary style={{ cursor: "pointer", color: "var(--accent-primary)", fontWeight: 600 }}>💡 Hints</summary>
                                            <ul style={{ color: "var(--text-secondary)", marginTop: "0.5rem", paddingLeft: "1.5rem" }}>
                                                {selected.hints.map((h: string, i: number) => <li key={i} style={{ marginBottom: "0.25rem" }}>{h}</li>)}
                                            </ul>
                                        </details>
                                    )}
                                </>
                            ) : (
                                <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-secondary)" }}>
                                    <p style={{ fontSize: "3rem" }}>👈</p>
                                    <p>Select a problem from the list</p>
                                </div>
                            )}
                        </div>
                        {/* Code Editor */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                            <div className="glass-card" style={{ padding: "0", borderRadius: 14, flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                                <div style={{ padding: "0.75rem 1rem", borderBottom: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <span style={{ fontWeight: 700, fontSize: "0.85rem" }}>JavaScript</span>
                                    <button onClick={runCode} disabled={running || !selected}
                                        style={{ padding: "0.4rem 1.25rem", borderRadius: 8, background: running ? "var(--bg-card)" : "linear-gradient(135deg, #22c55e, #16a34a)", color: "white", border: "none", fontWeight: 700, cursor: running ? "default" : "pointer", fontSize: "0.85rem" }}>
                                        {running ? "Running..." : "▶ Run Code"}
                                    </button>
                                </div>
                                <textarea value={code} onChange={e => setCode(e.target.value)}
                                    style={{ flex: 1, padding: "1rem", background: "#0d1117", color: "#e6edf3", fontFamily: "'Fira Code', 'Courier New', monospace", fontSize: "0.9rem", border: "none", outline: "none", resize: "none", lineHeight: 1.6, minHeight: 250 }}
                                    spellCheck={false} />
                            </div>
                            {/* Results */}
                            {results && (
                                <div className="glass-card" style={{ padding: "1rem", borderRadius: 14 }}>
                                    <h4 style={{ fontWeight: 700, marginBottom: "0.75rem", color: results.allPassed ? "#22c55e" : "#ef4444" }}>
                                        {results.allPassed ? "✅ All Tests Passed!" : results.error ? "❌ Error" : `⚠️ ${results.passed}/${results.total} Tests Passed`}
                                    </h4>
                                    {results.results?.map((r: any, i: number) => (
                                        <div key={i} style={{ padding: "0.5rem", borderRadius: 6, marginBottom: "0.5rem", background: r.passed ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)", fontSize: "0.8rem", fontFamily: "monospace" }}>
                                            <span>{r.passed ? "✅" : "❌"}</span> Input: {r.input} → Expected: {r.expected}, Got: {r.got}
                                        </div>
                                    ))}
                                    {results.allPassed && <p style={{ color: "#22c55e", fontWeight: 700, marginTop: "0.5rem" }}>+{results.points} points earned! 🎉</p>}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                @media (max-width: 768px) {
                    div[style*="gridTemplateColumns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </div>
    );
}
