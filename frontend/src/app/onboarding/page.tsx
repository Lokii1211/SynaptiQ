"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const EDUCATION_OPTIONS = [
    { label: "Class 10-12 Student", value: "class_10_12", icon: "📚" },
    { label: "College Student", value: "college", icon: "🎓" },
    { label: "Recent Graduate", value: "graduate", icon: "🎯" },
    { label: "Working Professional", value: "working", icon: "💼" },
    { label: "Taking a Gap Year", value: "gap_year", icon: "🌱" },
    { label: "Parent (researching for child)", value: "parent", icon: "👨‍👩‍👧" },
];

const STREAM_OPTIONS = [
    { label: "Engineering / Tech", value: "CSE", icon: "💻" },
    { label: "Science", value: "Science", icon: "🔬" },
    { label: "Commerce / Finance", value: "Commerce", icon: "📊" },
    { label: "Arts / Humanities", value: "Arts", icon: "🎨" },
    { label: "Management", value: "Management", icon: "📈" },
    { label: "Medical", value: "Medical", icon: "🩺" },
    { label: "Other", value: "Other", icon: "🌐" },
];

const MOBILITY_OPTIONS = [
    { label: "Stay in my home state", value: "local", icon: "🏠" },
    { label: "Open to moving within India", value: "metro", icon: "🚆" },
    { label: "Want to go abroad eventually", value: "anywhere", icon: "✈️" },
    { label: "No preference yet", value: "anywhere", icon: "🤷" },
];

export default function OnboardingPage() {
    const router = useRouter();
    const [screen, setScreen] = useState(1);
    const [direction, setDirection] = useState<"left" | "right">("left");
    const [animating, setAnimating] = useState(false);
    const [userName, setUserName] = useState("");

    // Screen 1 data
    const [educationLevel, setEducationLevel] = useState("");
    const [collegeYear, setCollegeYear] = useState("");
    const [stream, setStream] = useState("");

    // Screen 2 data
    const [mobility, setMobility] = useState("");
    const [lifeGoal, setLifeGoal] = useState("");

    useEffect(() => {
        try {
            const userData = localStorage.getItem("user");
            if (userData) {
                const user = JSON.parse(userData);
                setUserName(user.name?.split(" ")[0] || "");
            }
        } catch { /* ignore */ }
    }, []);

    const showsStream = ["college", "graduate", "working"].includes(educationLevel);
    const showsYear = educationLevel === "college";

    const canProceedScreen1 = educationLevel && (!showsStream || stream);
    const canProceedScreen2 = mobility;

    const goNext = () => {
        if (animating) return;
        setAnimating(true);
        setDirection("left");
        setTimeout(() => {
            setScreen(s => s + 1);
            setAnimating(false);
        }, 300);
    };

    const goBack = () => {
        if (animating || screen === 1) return;
        setAnimating(true);
        setDirection("right");
        setTimeout(() => {
            setScreen(s => s - 1);
            setAnimating(false);
        }, 300);
    };

    const saveOnboarding = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;
            await fetch("/api/auth/onboarding", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                    education_level: educationLevel,
                    stream,
                    college_year: collegeYear ? parseInt(collegeYear) : undefined,
                    mobility_pref: mobility,
                    life_goal_text: lifeGoal || undefined,
                }),
            });
        } catch { /* fail silently, data saved next time */ }
    };

    const startAssessment = async () => {
        await saveOnboarding();
        router.push("/assessment");
    };

    const cardStyle = (isSelected: boolean): React.CSSProperties => ({
        display: "flex", alignItems: "center", gap: "0.75rem",
        padding: "0.85rem 1rem", borderRadius: 14,
        border: isSelected ? "2px solid var(--accent-primary)" : "2px solid var(--border-color)",
        background: isSelected ? "rgba(99,102,241,0.12)" : "rgba(255,255,255,0.03)",
        cursor: "pointer", transition: "all 0.2s ease",
        minHeight: 56,
    });

    const slideStyle: React.CSSProperties = {
        animation: animating
            ? `slide-${direction} 0.3s ease-out forwards`
            : "fade-in 0.4s ease-out",
    };

    return (
        <div style={{ minHeight: "100vh", background: "linear-gradient(180deg, #1E1B4B 0%, #0F172A 100%)", color: "var(--text-primary)", display: "flex", flexDirection: "column" }}>
            <style>{`
                @keyframes slide-left { from { opacity: 1; transform: translateX(0); } to { opacity: 0; transform: translateX(-50px); } }
                @keyframes slide-right { from { opacity: 1; transform: translateX(0); } to { opacity: 0; transform: translateX(50px); } }
                @keyframes fade-in { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
                @keyframes pulse-glow { 0%, 100% { box-shadow: 0 0 20px rgba(99,102,241,0.3); } 50% { box-shadow: 0 0 40px rgba(99,102,241,0.6); } }
                .onboard-card:hover { border-color: rgba(99,102,241,0.5) !important; transform: translateY(-1px); }
            `}</style>

            {/* Progress Dots */}
            <div style={{ display: "flex", justifyContent: "center", gap: "0.75rem", padding: "1.5rem", paddingTop: "2rem" }}>
                {[1, 2, 3].map(i => (
                    <div key={i} style={{
                        width: 10, height: 10, borderRadius: "50%", transition: "all 0.3s ease",
                        background: i === screen ? "var(--accent-primary)" : i < screen ? "#6366f1" : "rgba(255,255,255,0.2)",
                        transform: i === screen ? "scale(1.3)" : "scale(1)",
                        boxShadow: i === screen ? "0 0 12px rgba(99,102,241,0.6)" : "none",
                    }} />
                ))}
            </div>

            {/* Content */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", maxWidth: 480, margin: "0 auto", width: "100%", padding: "0 1.25rem" }}>

                {/* SCREEN 1 — Education Context */}
                {screen === 1 && (
                    <div style={slideStyle}>
                        <h1 style={{ fontSize: "1.6rem", fontWeight: 800, marginBottom: "0.25rem", lineHeight: 1.3 }}>
                            {userName ? `Hey ${userName}! 👋` : "Hey there! 👋"}
                        </h1>
                        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginBottom: "1.5rem", lineHeight: 1.6 }}>
                            Let me get to know you first. This helps me give you career advice that actually fits your life.
                        </p>

                        <p style={{ fontWeight: 600, marginBottom: "0.75rem", fontSize: "0.9rem" }}>What&apos;s your current situation?</p>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1.5rem" }}>
                            {EDUCATION_OPTIONS.map(opt => (
                                <div key={opt.value} className="onboard-card" style={cardStyle(educationLevel === opt.value)} onClick={() => setEducationLevel(opt.value)}>
                                    <span style={{ fontSize: "1.25rem" }}>{opt.icon}</span>
                                    <span style={{ fontWeight: 500, fontSize: "0.9rem" }}>{opt.label}</span>
                                    {educationLevel === opt.value && <span style={{ marginLeft: "auto", color: "var(--accent-primary)" }}>✓</span>}
                                </div>
                            ))}
                        </div>

                        {showsYear && (
                            <div style={{ marginBottom: "1.25rem", animation: "fade-in 0.3s ease-out" }}>
                                <p style={{ fontWeight: 600, marginBottom: "0.5rem", fontSize: "0.9rem" }}>Which year?</p>
                                <div style={{ display: "flex", gap: "0.5rem" }}>
                                    {["1", "2", "3", "4", "5+"].map(y => (
                                        <button key={y} onClick={() => setCollegeYear(y)} style={{
                                            flex: 1, padding: "0.6rem", borderRadius: 10, cursor: "pointer",
                                            border: collegeYear === y ? "2px solid var(--accent-primary)" : "2px solid var(--border-color)",
                                            background: collegeYear === y ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.03)",
                                            color: "var(--text-primary)", fontWeight: 600, fontSize: "0.85rem",
                                        }}>{y}</button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {showsStream && (
                            <div style={{ animation: "fade-in 0.3s ease-out" }}>
                                <p style={{ fontWeight: 600, marginBottom: "0.75rem", fontSize: "0.9rem" }}>What stream are you in?</p>
                                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                    {STREAM_OPTIONS.map(opt => (
                                        <div key={opt.value} className="onboard-card" style={cardStyle(stream === opt.value)} onClick={() => setStream(opt.value)}>
                                            <span style={{ fontSize: "1.1rem" }}>{opt.icon}</span>
                                            <span style={{ fontWeight: 500, fontSize: "0.9rem" }}>{opt.label}</span>
                                            {stream === opt.value && <span style={{ marginLeft: "auto", color: "var(--accent-primary)" }}>✓</span>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div style={{ marginTop: "auto", paddingTop: "1.5rem", paddingBottom: "2rem" }}>
                            <button onClick={goNext} disabled={!canProceedScreen1}
                                style={{
                                    width: "100%", padding: "0.9rem", borderRadius: 14, border: "none", cursor: canProceedScreen1 ? "pointer" : "not-allowed",
                                    background: canProceedScreen1 ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "rgba(255,255,255,0.1)",
                                    color: "white", fontWeight: 700, fontSize: "1rem",
                                    opacity: canProceedScreen1 ? 1 : 0.4, transition: "all 0.3s ease",
                                }}>
                                Continue →
                            </button>
                        </div>
                    </div>
                )}

                {/* SCREEN 2 — Life Context */}
                {screen === 2 && (
                    <div style={slideStyle}>
                        <h1 style={{ fontSize: "1.6rem", fontWeight: 800, marginBottom: "0.25rem", lineHeight: 1.3 }}>
                            Almost there ✨
                        </h1>
                        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginBottom: "1.5rem", lineHeight: 1.6 }}>
                            Two more questions. These help me understand what kind of career actually makes sense for your life — not just your resume.
                        </p>

                        <p style={{ fontWeight: 600, marginBottom: "0.75rem", fontSize: "0.9rem" }}>Where do you want to build your career?</p>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1.5rem" }}>
                            {MOBILITY_OPTIONS.map((opt, i) => (
                                <div key={i} className="onboard-card" style={cardStyle(mobility === opt.value && MOBILITY_OPTIONS.findIndex(o => o.value === mobility && o.label === opt.label) === i)} onClick={() => setMobility(opt.value)}>
                                    <span style={{ fontSize: "1.25rem" }}>{opt.icon}</span>
                                    <span style={{ fontWeight: 500, fontSize: "0.9rem" }}>{opt.label}</span>
                                </div>
                            ))}
                        </div>

                        <p style={{ fontWeight: 600, marginBottom: "0.5rem", fontSize: "0.9rem" }}>
                            One sentence — what does a good life look like for you at 30?
                        </p>
                        <p style={{ color: "var(--text-secondary)", fontSize: "0.8rem", marginBottom: "0.5rem" }}>Optional. 140 characters.</p>
                        <textarea
                            value={lifeGoal} onChange={e => setLifeGoal(e.target.value.slice(0, 140))}
                            placeholder="No pressure. Write whatever comes to mind first."
                            maxLength={140}
                            style={{
                                width: "100%", padding: "0.85rem", borderRadius: 12, border: "2px solid var(--border-color)",
                                background: "rgba(255,255,255,0.03)", color: "var(--text-primary)", fontSize: "0.9rem",
                                resize: "none", height: 80, fontFamily: "inherit", lineHeight: 1.5,
                                outline: "none", transition: "border-color 0.3s ease",
                            }}
                            onFocus={e => { e.target.style.borderColor = "rgba(99,102,241,0.5)"; }}
                            onBlur={e => { e.target.style.borderColor = "var(--border-color)"; }}
                        />
                        <p style={{ textAlign: "right", color: "var(--text-secondary)", fontSize: "0.75rem", marginTop: "0.25rem" }}>
                            {lifeGoal.length}/140
                        </p>

                        <div style={{ marginTop: "auto", paddingTop: "1.5rem", paddingBottom: "2rem", display: "flex", gap: "0.75rem" }}>
                            <button onClick={goBack}
                                style={{
                                    padding: "0.9rem 1.5rem", borderRadius: 14, cursor: "pointer",
                                    border: "2px solid var(--border-color)", background: "transparent",
                                    color: "var(--text-secondary)", fontWeight: 600, fontSize: "0.9rem",
                                }}>
                                ← Back
                            </button>
                            <button onClick={goNext} disabled={!canProceedScreen2}
                                style={{
                                    flex: 1, padding: "0.9rem", borderRadius: 14, border: "none", cursor: canProceedScreen2 ? "pointer" : "not-allowed",
                                    background: canProceedScreen2 ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "rgba(255,255,255,0.1)",
                                    color: "white", fontWeight: 700, fontSize: "1rem",
                                    opacity: canProceedScreen2 ? 1 : 0.4, transition: "all 0.3s ease",
                                }}>
                                Continue →
                            </button>
                        </div>
                    </div>
                )}

                {/* SCREEN 3 — The Bridge */}
                {screen === 3 && (
                    <div style={{ ...slideStyle, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, textAlign: "center", paddingBottom: "3rem" }}>
                        <div style={{
                            width: 80, height: 80, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                            background: "linear-gradient(135deg, #6366f1, #8b5cf6)", fontSize: "2rem", marginBottom: "1.5rem",
                            animation: "pulse-glow 2s ease-in-out infinite",
                        }}>
                            🧠
                        </div>

                        <h1 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: "0.75rem", lineHeight: 1.3 }}>
                            Perfect. Now let me actually understand you.
                        </h1>
                        <p style={{ color: "var(--text-secondary)", fontSize: "1rem", marginBottom: "0.5rem", lineHeight: 1.7, maxWidth: 380 }}>
                            The next <strong style={{ color: "var(--text-primary)" }}>12 minutes</strong> will be the most accurate career mirror you&apos;ve ever seen.
                        </p>
                        <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: "2rem", lineHeight: 1.6, maxWidth: 340 }}>
                            No right or wrong answers. Just honest scenarios that reveal how you actually think, work, and what drives you.
                        </p>

                        <div style={{ display: "flex", gap: "0.75rem", width: "100%", maxWidth: 380, flexDirection: "column" }}>
                            <button onClick={startAssessment}
                                style={{
                                    width: "100%", padding: "1rem", borderRadius: 14, border: "none", cursor: "pointer",
                                    background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "white",
                                    fontWeight: 700, fontSize: "1.05rem",
                                    boxShadow: "0 4px 24px rgba(99,102,241,0.4)",
                                    transition: "all 0.3s ease",
                                }}
                                onMouseEnter={e => { (e.target as HTMLElement).style.transform = "translateY(-2px)"; (e.target as HTMLElement).style.boxShadow = "0 8px 32px rgba(99,102,241,0.5)"; }}
                                onMouseLeave={e => { (e.target as HTMLElement).style.transform = "translateY(0)"; (e.target as HTMLElement).style.boxShadow = "0 4px 24px rgba(99,102,241,0.4)"; }}>
                                Begin my assessment →
                            </button>
                            <button onClick={goBack}
                                style={{
                                    padding: "0.75rem", borderRadius: 12, cursor: "pointer",
                                    border: "none", background: "transparent",
                                    color: "var(--text-secondary)", fontWeight: 500, fontSize: "0.85rem",
                                }}>
                                ← Go back
                            </button>
                        </div>

                        <div style={{ marginTop: "2rem", display: "flex", gap: "1.5rem", justifyContent: "center" }}>
                            {[
                                { icon: "🔒", label: "Private" },
                                { icon: "⚡", label: "12 minutes" },
                                { icon: "🎯", label: "AI-powered" },
                            ].map((item, i) => (
                                <div key={i} style={{ textAlign: "center" }}>
                                    <div style={{ fontSize: "1.2rem", marginBottom: "0.25rem" }}>{item.icon}</div>
                                    <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)", fontWeight: 500 }}>{item.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
