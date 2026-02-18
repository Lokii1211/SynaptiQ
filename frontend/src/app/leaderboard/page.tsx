"use client";
import { useState } from "react";
import Link from "next/link";

export default function LeaderboardPage() {
    // Mock leaderboard data (will come from API when users sign up)
    const [tab, setTab] = useState<"weekly" | "alltime">("weekly");
    const leaderboard = [
        { rank: 1, name: "Arjun K.", points: 2450, streak: 14, badge: "🏆", college: "IIT Madras", level: "Diamond" },
        { rank: 2, name: "Sneha R.", points: 2280, streak: 12, badge: "🥈", college: "NIT Trichy", level: "Diamond" },
        { rank: 3, name: "Karthik M.", points: 2150, streak: 11, badge: "🥉", college: "VIT Vellore", level: "Platinum" },
        { rank: 4, name: "Priya S.", points: 1980, streak: 9, badge: "⭐", college: "BITS Pilani", level: "Platinum" },
        { rank: 5, name: "Rahul D.", points: 1820, streak: 8, badge: "⭐", college: "IIIT Hyderabad", level: "Gold" },
        { rank: 6, name: "Ananya G.", points: 1670, streak: 7, badge: "⭐", college: "DTU Delhi", level: "Gold" },
        { rank: 7, name: "Vikram S.", points: 1540, streak: 6, badge: "⭐", college: "NSUT Delhi", level: "Gold" },
        { rank: 8, name: "Meera P.", points: 1420, streak: 5, badge: "⭐", college: "SRM Chennai", level: "Silver" },
        { rank: 9, name: "Aditya B.", points: 1310, streak: 4, badge: "⭐", college: "Manipal MIT", level: "Silver" },
        { rank: 10, name: "Riya T.", points: 1200, streak: 3, badge: "⭐", college: "COEP Pune", level: "Silver" },
    ];

    const levels = [
        { name: "Bronze", min: 0, max: 500, color: "#cd7f32", icon: "🟤" },
        { name: "Silver", min: 500, max: 1000, color: "#c0c0c0", icon: "⚪" },
        { name: "Gold", min: 1000, max: 1500, color: "#eab308", icon: "🟡" },
        { name: "Platinum", min: 1500, max: 2500, color: "#06b6d4", icon: "💠" },
        { name: "Diamond", min: 2500, max: Infinity, color: "#8b5cf6", icon: "💎" },
    ];

    const rankColors: Record<number, string> = { 1: "#eab308", 2: "#c0c0c0", 3: "#cd7f32" };
    const levelColors: Record<string, string> = { Diamond: "#8b5cf6", Platinum: "#06b6d4", Gold: "#eab308", Silver: "#c0c0c0", Bronze: "#cd7f32" };

    return (
        <div style={{ minHeight: "100vh", background: "var(--bg-primary)", color: "var(--text-primary)" }}>
            <nav style={{ padding: "0.65rem clamp(0.75rem, 3vw, 2rem)", borderBottom: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "rgba(10,10,15,0.95)", backdropFilter: "blur(20px)", zIndex: 100 }}>
                <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none", color: "var(--text-primary)" }}>
                    <span style={{ fontSize: "1.5rem" }}>🧠</span>
                    <span style={{ fontWeight: 800, fontSize: "1.25rem" }}>SkillSync <span style={{ color: "#eab308" }}>Leaderboard</span></span>
                </Link>
            </nav>

            <div style={{ maxWidth: 800, margin: "0 auto", padding: "clamp(1rem, 3vw, 2rem) clamp(0.5rem, 2vw, 1rem)" }}>
                {/* Hero */}
                <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                    <h1 style={{ fontSize: "clamp(1.4rem, 4vw, 2rem)", fontWeight: 800, marginBottom: "0.4rem" }}>🏆 Leaderboard</h1>
                    <p style={{ color: "var(--text-secondary)", fontSize: "clamp(0.8rem, 2.5vw, 1rem)" }}>Top learners across SkillSync — compete, learn, and grow together</p>
                </div>

                {/* Tab Switcher */}
                <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", marginBottom: "2rem" }}>
                    {(["weekly", "alltime"] as const).map(t => (
                        <button key={t} onClick={() => setTab(t)}
                            style={{ padding: "0.5rem 1.25rem", borderRadius: 999, border: "2px solid", borderColor: tab === t ? "#eab308" : "var(--border-color)", background: tab === t ? "rgba(234,179,8,0.1)" : "transparent", color: tab === t ? "#eab308" : "var(--text-secondary)", cursor: "pointer", fontWeight: 700, fontSize: "0.9rem" }}>
                            {t === "weekly" ? "📅 This Week" : "🏅 All Time"}
                        </button>
                    ))}
                </div>

                {/* Top 3 Podium */}
                <div className="podium" style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", gap: "clamp(0.5rem, 2vw, 1rem)", marginBottom: "2rem" }}>
                    {/* 2nd */}
                    <div className="glass-card" style={{ padding: "clamp(0.75rem, 2vw, 1.5rem) clamp(0.5rem, 1.5vw, 1rem)", borderRadius: 16, textAlign: "center", flex: 1, maxWidth: 160, borderTop: "3px solid #c0c0c0" }}>
                        <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🥈</div>
                        <h3 style={{ fontWeight: 700, fontSize: "0.95rem" }}>{leaderboard[1].name}</h3>
                        <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginBottom: "0.5rem" }}>{leaderboard[1].college}</p>
                        <p style={{ fontSize: "1.25rem", fontWeight: 800, color: "#c0c0c0" }}>{leaderboard[1].points}</p>
                        <p style={{ fontSize: "0.7rem", color: "var(--text-secondary)" }}>🔥 {leaderboard[1].streak}d streak</p>
                    </div>
                    {/* 1st */}
                    <div className="glass-card" style={{ padding: "clamp(1rem, 3vw, 2rem) clamp(0.5rem, 1.5vw, 1rem)", borderRadius: 20, textAlign: "center", flex: 1, maxWidth: 180, borderTop: "3px solid #eab308", transform: "translateY(-15px)" }}>
                        <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🏆</div>
                        <h3 style={{ fontWeight: 800, fontSize: "1.1rem" }}>{leaderboard[0].name}</h3>
                        <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginBottom: "0.5rem" }}>{leaderboard[0].college}</p>
                        <p style={{ fontSize: "1.75rem", fontWeight: 800, color: "#eab308" }}>{leaderboard[0].points}</p>
                        <p style={{ fontSize: "0.7rem", color: "var(--text-secondary)" }}>🔥 {leaderboard[0].streak}d streak</p>
                    </div>
                    {/* 3rd */}
                    <div className="glass-card" style={{ padding: "clamp(0.75rem, 2vw, 1.5rem) clamp(0.5rem, 1.5vw, 1rem)", borderRadius: 16, textAlign: "center", flex: 1, maxWidth: 160, borderTop: "3px solid #cd7f32" }}>
                        <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🥉</div>
                        <h3 style={{ fontWeight: 700, fontSize: "0.95rem" }}>{leaderboard[2].name}</h3>
                        <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginBottom: "0.5rem" }}>{leaderboard[2].college}</p>
                        <p style={{ fontSize: "1.25rem", fontWeight: 800, color: "#cd7f32" }}>{leaderboard[2].points}</p>
                        <p style={{ fontSize: "0.7rem", color: "var(--text-secondary)" }}>🔥 {leaderboard[2].streak}d streak</p>
                    </div>
                </div>

                {/* Level System */}
                <div className="glass-card" style={{ padding: "1.25rem", borderRadius: 14, marginBottom: "1.5rem" }}>
                    <h3 style={{ fontWeight: 700, marginBottom: "0.75rem", fontSize: "0.9rem" }}>📊 Level System</h3>
                    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                        {levels.map(l => (
                            <span key={l.name} style={{ padding: "0.3rem 0.75rem", borderRadius: 999, background: `${l.color}15`, color: l.color, fontSize: "0.75rem", fontWeight: 700 }}>
                                {l.icon} {l.name} ({l.max === Infinity ? `${l.min}+` : `${l.min}-${l.max}`} pts)
                            </span>
                        ))}
                    </div>
                </div>

                {/* Full Rankings */}
                <div style={{ display: "grid", gap: "0.5rem" }}>
                    {leaderboard.map(user => (
                        <div key={user.rank} className="glass-card" style={{ padding: "1rem 1.25rem", borderRadius: 12, display: "flex", justifyContent: "space-between", alignItems: "center", borderLeft: `3px solid ${rankColors[user.rank] || "var(--border-color)"}` }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                <span style={{ width: 32, height: 32, borderRadius: "50%", background: `${rankColors[user.rank] || "var(--bg-card)"}20`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.9rem", color: rankColors[user.rank] || "var(--text-secondary)" }}>
                                    {user.rank <= 3 ? user.badge : `#${user.rank}`}
                                </span>
                                <div>
                                    <h4 style={{ fontWeight: 700, fontSize: "0.95rem" }}>{user.name}</h4>
                                    <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{user.college}</p>
                                </div>
                            </div>
                            <div className="rank-meta" style={{ display: "flex", alignItems: "center", gap: "clamp(0.5rem, 2vw, 1.5rem)" }}>
                                <span style={{ padding: "0.2rem 0.6rem", borderRadius: 999, background: `${levelColors[user.level]}15`, color: levelColors[user.level], fontSize: "0.7rem", fontWeight: 700 }}>{user.level}</span>
                                <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>🔥 {user.streak}d</span>
                                <span style={{ fontWeight: 800, color: rankColors[user.rank] || "var(--text-primary)" }}>{user.points} pts</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* How to Earn */}
                <div className="glass-card" style={{ padding: "1.25rem", borderRadius: 16, marginTop: "1.5rem" }}>
                    <h3 style={{ fontWeight: 700, marginBottom: "0.75rem" }}>✨ How to Earn Points</h3>
                    <div className="earn-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(200px, 100%), 1fr))", gap: "0.75rem" }}>
                        {[
                            { action: "Complete Daily Quiz", pts: "+25 pts/day", icon: "📝" },
                            { action: "Solve Coding Challenge", pts: "+10-40 pts", icon: "💻" },
                            { action: "Community Post", pts: "+5 pts", icon: "✍️" },
                            { action: "Complete Assessment", pts: "+50 pts", icon: "🧬" },
                            { action: "7-Day Streak Bonus", pts: "+100 pts", icon: "🔥" },
                            { action: "Enroll in Course", pts: "+15 pts", icon: "🎓" },
                        ].map((item, i) => (
                            <div key={i} style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                                <span style={{ fontSize: "1.25rem" }}>{item.icon}</span>
                                <div>
                                    <p style={{ fontWeight: 600, fontSize: "0.85rem" }}>{item.action}</p>
                                    <p style={{ color: "#22c55e", fontSize: "0.8rem", fontWeight: 700 }}>{item.pts}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style jsx>{`
                @media (max-width: 520px) {
                    .podium > div { padding: 0.6rem 0.4rem !important; }
                    .podium > div h3 { font-size: 0.8rem !important; }
                    .podium > div p { font-size: 0.65rem !important; }
                    .rank-meta { gap: 0.5rem !important; flex-wrap: wrap; }
                    .rank-meta span { font-size: 0.7rem !important; }
                }
            `}</style>
        </div>
    );
}
