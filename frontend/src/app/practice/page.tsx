"use client";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";

const LANGUAGES = [
    { id: "javascript", label: "JavaScript", icon: "🟨" },
    { id: "python", label: "Python", icon: "🐍" },
    { id: "java", label: "Java", icon: "☕" },
    { id: "cpp", label: "C++", icon: "⚙️" },
    { id: "c", label: "C", icon: "🔧" },
];

const COMPANIES = ["All", "Google", "Amazon", "Microsoft", "Meta", "Apple", "Flipkart", "Razorpay", "Goldman Sachs", "TCS", "Infosys", "Uber"];

export default function PracticePage() {
    const [challenges, setChallenges] = useState<any[]>([]);
    const [meta, setMeta] = useState<any>({});
    const [selected, setSelected] = useState<any>(null);
    const [code, setCode] = useState("");
    const [results, setResults] = useState<any>(null);
    const [running, setRunning] = useState(false);
    const [diffFilter, setDiffFilter] = useState("All");
    const [companyFilter, setCompanyFilter] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [language, setLanguage] = useState("javascript");
    const [tab, setTab] = useState<"challenges" | "editor">("challenges");
    const [showCompanyPrep, setShowCompanyPrep] = useState(false);
    const [targetCompany, setTargetCompany] = useState("");

    useEffect(() => {
        fetch("/api/practice").then(r => r.json()).then(d => {
            setChallenges(d.challenges || []);
            setMeta(d.meta || {});
        });
    }, []);

    const selectChallenge = (c: any) => {
        setSelected(c);
        const starterCode = typeof c.starterCode === "object" ? c.starterCode[language] || c.starterCode.javascript : c.starterCode;
        setCode(starterCode);
        setResults(null);
        setTab("editor");
    };

    const onLanguageChange = (lang: string) => {
        setLanguage(lang);
        if (selected) {
            const starterCode = typeof selected.starterCode === "object" ? selected.starterCode[lang] || selected.starterCode.javascript : selected.starterCode;
            setCode(starterCode);
            setResults(null);
        }
    };

    const runCode = async () => {
        if (!selected) return;
        setRunning(true);
        try {
            const res = await fetch("/api/practice", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ challengeId: selected.id, code, language }),
            });
            setResults(await res.json());
        } catch { setResults({ error: "Execution error" }); }
        setRunning(false);
    };

    const filtered = useMemo(() => {
        let list = challenges;
        if (diffFilter !== "All") list = list.filter(c => c.difficulty === diffFilter);
        if (companyFilter !== "All") list = list.filter(c => c.company?.includes(companyFilter));
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            list = list.filter(c => c.title.toLowerCase().includes(q) || c.tags?.some((t: string) => t.toLowerCase().includes(q)));
        }
        return list;
    }, [challenges, diffFilter, companyFilter, searchQuery]);

    const companyProblems = useMemo(() => {
        if (!targetCompany) return [];
        return challenges.filter(c => c.company?.includes(targetCompany));
    }, [challenges, targetCompany]);

    const diffColors: Record<string, string> = { Easy: "#22c55e", Medium: "#eab308", Hard: "#ef4444" };
    const stats = useMemo(() => ({
        easy: challenges.filter(c => c.difficulty === "Easy").length,
        medium: challenges.filter(c => c.difficulty === "Medium").length,
        hard: challenges.filter(c => c.difficulty === "Hard").length,
        total: challenges.length,
    }), [challenges]);

    return (
        <div style={{ minHeight: "100vh", background: "var(--bg-primary)", color: "var(--text-primary)" }}>
            {/* Navbar */}
            <nav style={{ padding: "0.65rem clamp(0.5rem, 2vw, 1.5rem)", borderBottom: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "rgba(10,10,15,0.95)", backdropFilter: "blur(20px)", zIndex: 100, flexWrap: "wrap", gap: "0.5rem" }}>
                <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none", color: "var(--text-primary)" }}>
                    <span style={{ fontSize: "1.3rem" }}>🧠</span>
                    <span style={{ fontWeight: 800, fontSize: "1.15rem" }}>SkillSync <span style={{ color: "#22c55e" }}>Code</span></span>
                </Link>
                <div className="practice-tabs scroll-x" style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
                    <button onClick={() => setTab("challenges")} style={{ padding: "0.35rem 0.9rem", borderRadius: 8, background: tab === "challenges" ? "rgba(34,197,94,0.15)" : "transparent", border: "1px solid", borderColor: tab === "challenges" ? "#22c55e" : "var(--border-color)", color: tab === "challenges" ? "#22c55e" : "var(--text-secondary)", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600 }}>📋 Problems</button>
                    <button onClick={() => setTab("editor")} style={{ padding: "0.35rem 0.9rem", borderRadius: 8, background: tab === "editor" ? "rgba(34,197,94,0.15)" : "transparent", border: "1px solid", borderColor: tab === "editor" ? "#22c55e" : "var(--border-color)", color: tab === "editor" ? "#22c55e" : "var(--text-secondary)", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600 }}>⌨️ Editor</button>
                    <button onClick={() => setShowCompanyPrep(!showCompanyPrep)} style={{ padding: "0.35rem 0.9rem", borderRadius: 8, background: showCompanyPrep ? "rgba(99,102,241,0.15)" : "transparent", border: "1px solid", borderColor: showCompanyPrep ? "var(--accent-primary)" : "var(--border-color)", color: showCompanyPrep ? "var(--accent-primary)" : "var(--text-secondary)", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600 }}>🏢 Company Prep</button>
                </div>
            </nav>

            <div style={{ maxWidth: 1400, margin: "0 auto", padding: "clamp(0.5rem, 2vw, 1rem)" }}>
                {/* Company Prep Panel */}
                {showCompanyPrep && (
                    <div style={{ marginBottom: "1.25rem", padding: "1.25rem", borderRadius: 16, background: "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.08))", border: "1px solid rgba(99,102,241,0.2)" }}>
                        <h3 style={{ fontWeight: 800, fontSize: "1.1rem", marginBottom: "0.75rem" }}>🎯 Target Company Preparation</h3>
                        <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "1rem" }}>Select your target company — we{"'"}ll curate problems frequently asked in their interviews.</p>
                        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                            {(meta.allCompanies || []).map((co: string) => (
                                <button key={co} onClick={() => setTargetCompany(targetCompany === co ? "" : co)}
                                    style={{ padding: "0.35rem 0.7rem", borderRadius: 999, background: targetCompany === co ? "rgba(99,102,241,0.2)" : "var(--bg-card)", border: "1px solid", borderColor: targetCompany === co ? "var(--accent-primary)" : "var(--border-color)", color: targetCompany === co ? "var(--accent-primary)" : "var(--text-secondary)", cursor: "pointer", fontSize: "0.75rem", fontWeight: 600 }}>{co}</button>
                            ))}
                        </div>
                        {targetCompany && (
                            <div>
                                <p style={{ fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.5rem", color: "#818cf8" }}>📊 {targetCompany} — {companyProblems.length} problems available</p>
                                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                                    {companyProblems.slice(0, 6).map(cp => (
                                        <button key={cp.id} onClick={() => selectChallenge(cp)}
                                            style={{ padding: "0.5rem 0.75rem", borderRadius: 10, background: "var(--bg-card)", border: "1px solid var(--border-color)", color: "var(--text-primary)", cursor: "pointer", fontSize: "0.8rem", textAlign: "left", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                            <span style={{ color: diffColors[cp.difficulty], fontWeight: 700 }}>{cp.difficulty === "Easy" ? "🟢" : cp.difficulty === "Medium" ? "🟡" : "🔴"}</span>
                                            {cp.title}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {tab === "challenges" ? (
                    <>
                        {/* Stats Bar */}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(80px, 1fr))", gap: "0.5rem", marginBottom: "1rem" }}>
                            <div style={{ padding: "0.75rem 1.25rem", borderRadius: 12, background: "var(--bg-card)", border: "1px solid var(--border-color)", flex: 1, minWidth: 120, textAlign: "center" }}>
                                <div style={{ fontSize: "1.5rem", fontWeight: 800 }}>{stats.total}</div>
                                <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)", fontWeight: 600 }}>Total Problems</div>
                            </div>
                            <div style={{ padding: "0.75rem 1.25rem", borderRadius: 12, background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", flex: 1, minWidth: 100, textAlign: "center" }}>
                                <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#22c55e" }}>{stats.easy}</div>
                                <div style={{ fontSize: "0.7rem", color: "#22c55e", fontWeight: 600 }}>Easy</div>
                            </div>
                            <div style={{ padding: "0.75rem 1.25rem", borderRadius: 12, background: "rgba(234,179,8,0.08)", border: "1px solid rgba(234,179,8,0.2)", flex: 1, minWidth: 100, textAlign: "center" }}>
                                <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#eab308" }}>{stats.medium}</div>
                                <div style={{ fontSize: "0.7rem", color: "#eab308", fontWeight: 600 }}>Medium</div>
                            </div>
                            <div style={{ padding: "0.75rem 1.25rem", borderRadius: 12, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", flex: 1, minWidth: 100, textAlign: "center" }}>
                                <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#ef4444" }}>{stats.hard}</div>
                                <div style={{ fontSize: "0.7rem", color: "#ef4444", fontWeight: 600 }}>Hard</div>
                            </div>
                        </div>

                        {/* Filters */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.75rem" }}>
                            <div>
                                <h1 style={{ fontSize: "clamp(1.1rem, 3vw, 1.5rem)", fontWeight: 800 }}>💻 Coding Challenges</h1>
                                <p style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>From top MNCs → Google, Amazon, Microsoft, TCS & more</p>
                            </div>
                            <input placeholder="🔍 Search problems, tags..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                                style={{ padding: "0.5rem 1rem", borderRadius: 10, background: "rgba(255,255,255,0.05)", border: "1px solid var(--border-color)", color: "var(--text-primary)", fontSize: "0.85rem", outline: "none", width: "100%", maxWidth: 280, boxSizing: "border-box" }} />
                        </div>

                        <div className="scroll-x" style={{ display: "flex", gap: "0.4rem", marginBottom: "0.75rem", flexWrap: "wrap" }}>
                            {["All", "Easy", "Medium", "Hard"].map(d => (
                                <button key={d} onClick={() => setDiffFilter(d)} style={{ padding: "0.3rem 0.7rem", borderRadius: 8, background: diffFilter === d ? "rgba(99,102,241,0.15)" : "transparent", border: "1px solid", borderColor: diffFilter === d ? "var(--accent-primary)" : "var(--border-color)", color: diffFilter === d ? "var(--accent-primary)" : "var(--text-secondary)", cursor: "pointer", fontSize: "0.75rem", fontWeight: 600 }}>{d}</button>
                            ))}
                            <span style={{ width: 1, background: "var(--border-color)", margin: "0 0.25rem" }} />
                            <select value={companyFilter} onChange={e => setCompanyFilter(e.target.value)}
                                style={{ padding: "0.3rem 0.6rem", borderRadius: 8, background: "#1a1a2e", border: "1px solid var(--border-color)", color: "var(--text-secondary)", fontSize: "0.75rem", cursor: "pointer" }}>
                                {COMPANIES.map(c => <option key={c} value={c} style={{ background: "#1a1a2e", color: "#f1f5f9" }}>{c === "All" ? "🏢 All Companies" : c}</option>)}
                            </select>
                        </div>

                        {/* Problem List */}
                        <div style={{ display: "grid", gap: "0.6rem" }}>
                            {filtered.length === 0 ? (
                                <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-secondary)" }}>
                                    <p style={{ fontSize: "2.5rem" }}>🔍</p>
                                    <p>No problems found. Try different filters.</p>
                                </div>
                            ) : filtered.map((c, i) => (
                                <div key={c.id} style={{ padding: "1rem 1.25rem", borderRadius: 12, background: "rgba(26,26,46,0.6)", border: "1px solid var(--border-color)", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem", transition: "all 0.2s" }}
                                    onClick={() => selectChallenge(c)}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = diffColors[c.difficulty]; e.currentTarget.style.transform = "translateY(-1px)"; }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border-color)"; e.currentTarget.style.transform = "none"; }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                        <span style={{ width: 32, height: 32, borderRadius: 8, background: `${diffColors[c.difficulty]}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.85rem", fontWeight: 700, color: "var(--text-secondary)" }}>{i + 1}</span>
                                        <div>
                                            <h3 style={{ fontSize: "0.95rem", fontWeight: 700 }}>{c.title}</h3>
                                            <p style={{ fontSize: "0.7rem", color: "var(--text-secondary)" }}>{c.category} · {c.points} pts · {(c.company || []).slice(0, 3).join(", ")}</p>
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", gap: "0.4rem", alignItems: "center", flexWrap: "wrap" }}>
                                        <span style={{ padding: "0.15rem 0.5rem", borderRadius: 999, background: `${diffColors[c.difficulty]}12`, color: diffColors[c.difficulty], fontSize: "0.7rem", fontWeight: 700 }}>{c.difficulty}</span>
                                        {c.tags?.slice(0, 2).map((t: string) => <span key={t} style={{ padding: "0.15rem 0.4rem", borderRadius: 999, background: "rgba(99,102,241,0.08)", color: "var(--accent-secondary)", fontSize: "0.65rem" }}>{t}</span>)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="editor-layout" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", minHeight: "calc(100vh - 100px)" }}>
                        {/* Problem Description */}
                        <div style={{ padding: "1.25rem", borderRadius: 14, background: "rgba(26,26,46,0.6)", border: "1px solid var(--border-color)", overflowY: "auto", maxHeight: "calc(100vh - 120px)" }}>
                            {selected ? (
                                <>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                                        <h2 style={{ fontSize: "1.2rem", fontWeight: 800 }}>{selected.title}</h2>
                                        <span style={{ padding: "0.2rem 0.6rem", borderRadius: 999, background: `${diffColors[selected.difficulty]}12`, color: diffColors[selected.difficulty], fontSize: "0.75rem", fontWeight: 700 }}>{selected.difficulty}</span>
                                    </div>
                                    {/* Company Tags */}
                                    {selected.company && (
                                        <div style={{ display: "flex", gap: "0.3rem", marginBottom: "0.75rem", flexWrap: "wrap" }}>
                                            <span style={{ fontSize: "0.7rem", color: "var(--text-secondary)", fontWeight: 600 }}>Asked at:</span>
                                            {selected.company.map((co: string) => (
                                                <span key={co} style={{ padding: "0.15rem 0.45rem", borderRadius: 999, background: "rgba(139,92,246,0.1)", color: "#a78bfa", fontSize: "0.7rem", fontWeight: 600 }}>{co}</span>
                                            ))}
                                        </div>
                                    )}
                                    <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: "1.25rem", fontSize: "0.9rem", whiteSpace: "pre-line" }}>{selected.description}</p>
                                    <h4 style={{ fontWeight: 700, marginBottom: "0.4rem", fontSize: "0.85rem" }}>Examples:</h4>
                                    {selected.examples.map((ex: any, i: number) => (
                                        <div key={i} style={{ background: "var(--bg-primary)", padding: "0.65rem", borderRadius: 8, marginBottom: "0.5rem", fontFamily: "monospace", fontSize: "0.8rem" }}>
                                            <div><strong>Input:</strong> {ex.input}</div>
                                            <div><strong>Output:</strong> {ex.output}</div>
                                        </div>
                                    ))}
                                    {selected.hints?.length > 0 && (
                                        <details style={{ marginTop: "1rem" }}>
                                            <summary style={{ cursor: "pointer", color: "var(--accent-primary)", fontWeight: 600, fontSize: "0.85rem" }}>💡 Hints ({selected.hints.length})</summary>
                                            <ul style={{ color: "var(--text-secondary)", marginTop: "0.4rem", paddingLeft: "1.5rem", fontSize: "0.85rem" }}>
                                                {selected.hints.map((h: string, i: number) => <li key={i} style={{ marginBottom: "0.2rem" }}>{h}</li>)}
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
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            <div style={{ borderRadius: 14, overflow: "hidden", border: "1px solid var(--border-color)", flex: 1, display: "flex", flexDirection: "column", background: "rgba(26,26,46,0.6)" }}>
                                {/* Editor Header */}
                                <div style={{ padding: "0.5rem 0.75rem", borderBottom: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.35rem" }}>
                                    <div className="scroll-x" style={{ display: "flex", gap: "0.25rem", alignItems: "center" }}>
                                        {LANGUAGES.map(l => (
                                            <button key={l.id} onClick={() => onLanguageChange(l.id)}
                                                style={{ padding: "0.25rem 0.55rem", borderRadius: 6, background: language === l.id ? "rgba(34,197,94,0.15)" : "transparent", border: "1px solid", borderColor: language === l.id ? "#22c55e" : "transparent", color: language === l.id ? "#22c55e" : "var(--text-secondary)", cursor: "pointer", fontSize: "0.7rem", fontWeight: 600 }}>
                                                {l.icon} {l.label}
                                            </button>
                                        ))}
                                    </div>
                                    <button onClick={runCode} disabled={running || !selected}
                                        style={{ padding: "0.35rem 1rem", borderRadius: 8, background: running ? "var(--bg-card)" : "linear-gradient(135deg, #22c55e, #16a34a)", color: "white", border: "none", fontWeight: 700, cursor: running ? "default" : "pointer", fontSize: "0.8rem" }}>
                                        {running ? "⏳ Running..." : "▶ Run Code"}
                                    </button>
                                </div>
                                <textarea value={code} onChange={e => setCode(e.target.value)}
                                    style={{ flex: 1, padding: "1rem", background: "#0d1117", color: "#e6edf3", fontFamily: "'Fira Code', 'Courier New', monospace", fontSize: "0.85rem", border: "none", outline: "none", resize: "none", lineHeight: 1.6, minHeight: 280 }}
                                    spellCheck={false} />
                            </div>

                            {/* Results */}
                            {results && (
                                <div style={{ padding: "0.75rem", borderRadius: 12, background: "rgba(26,26,46,0.6)", border: "1px solid var(--border-color)" }}>
                                    <h4 style={{ fontWeight: 700, marginBottom: "0.5rem", fontSize: "0.85rem", color: results.allPassed ? "#22c55e" : results.error ? "#ef4444" : "#eab308" }}>
                                        {results.allPassed ? "✅ All Tests Passed!" : results.error ? "❌ Error" : results.message ? `ℹ️ ${results.message}` : `⚠️ ${results.passed}/${results.total} Tests Passed`}
                                    </h4>
                                    {results.results?.map((r: any, i: number) => (
                                        <div key={i} style={{ padding: "0.4rem 0.5rem", borderRadius: 6, marginBottom: "0.3rem", background: r.passed ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)", fontSize: "0.75rem", fontFamily: "monospace" }}>
                                            {r.passed ? "✅" : "❌"} Input: {r.input} → Expected: {r.expected}, Got: {r.got}
                                        </div>
                                    ))}
                                    {results.allPassed && <p style={{ color: "#22c55e", fontWeight: 700, marginTop: "0.4rem", fontSize: "0.85rem" }}>+{results.points} points earned! 🎉</p>}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                @media (max-width: 768px) {
                    .editor-layout { grid-template-columns: 1fr !important; }
                    .editor-layout > div:first-child { max-height: 40vh !important; }
                }
                @media (max-width: 480px) {
                    .practice-tabs { overflow-x: auto; -webkit-overflow-scrolling: touch; flex-wrap: nowrap !important; }
                    .practice-tabs button { white-space: nowrap; font-size: 0.72rem !important; }
                }
            `}</style>
        </div>
    );
}
