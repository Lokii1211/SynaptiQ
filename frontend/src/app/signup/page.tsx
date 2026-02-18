"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function SignupPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [form, setForm] = useState({
        name: "", email: "", password: "", age: "",
        education_level: "", city: "", institution: "", careerInterest: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPwd, setShowPwd] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const data = await api.signup({
                ...form,
                age: form.age ? parseInt(form.age) : undefined,
                education_level: form.education_level || undefined,
                city: form.city || undefined,
                institution: form.institution || undefined,
                careerInterest: form.careerInterest || undefined,
            });
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            router.push("/dashboard");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const canProceed = step === 1 ? (form.name.trim() && form.email.trim()) : true;

    return (
        <div style={{ minHeight: "100vh", background: "#0a0a0f", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem" }}>
            {/* Background glow */}
            <div style={{ position: "fixed", inset: 0, pointerEvents: "none" }}>
                <div style={{ position: "absolute", top: "-20%", left: "-10%", width: 500, height: 500, background: "rgba(99,102,241,0.06)", borderRadius: "50%", filter: "blur(120px)" }} />
                <div style={{ position: "absolute", bottom: "-20%", right: "-10%", width: 400, height: 400, background: "rgba(139,92,246,0.05)", borderRadius: "50%", filter: "blur(100px)" }} />
            </div>

            <div style={{ position: "relative", zIndex: 10, width: "100%", maxWidth: 480 }}>
                {/* Logo */}
                <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                    <Link href="/" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.5rem" }}>
                        <div style={{ width: 44, height: 44, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem", fontWeight: 800, color: "white" }}>S</div>
                        <span style={{ fontSize: "1.5rem", fontWeight: 800, color: "#f1f5f9" }}>Skill<span style={{ color: "#818cf8" }}>Sync</span> AI</span>
                    </Link>
                    <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#f1f5f9", marginBottom: "0.35rem" }}>Create your account</h1>
                    <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>Start your career discovery journey — takes 60 seconds</p>
                </div>

                {/* Step Indicator */}
                <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", justifyContent: "center" }}>
                    {[1, 2].map(s => (
                        <div key={s} style={{ height: 4, width: 80, borderRadius: 999, background: step >= s ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "rgba(255,255,255,0.08)", transition: "all 0.3s" }} />
                    ))}
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ background: "rgba(26,26,46,0.6)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 18, padding: "1.75rem" }}>
                        {error && (
                            <div style={{ padding: "0.75rem 1rem", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10, color: "#f87171", fontSize: "0.85rem", marginBottom: "1rem" }}>{error}</div>
                        )}

                        {step === 1 ? (
                            <>
                                <h3 style={{ fontWeight: 700, fontSize: "1rem", color: "#f1f5f9", marginBottom: "1rem" }}>👋 Basic Information</h3>

                                {/* Name */}
                                <div style={{ marginBottom: "1rem" }}>
                                    <label style={{ display: "block", fontSize: "0.8rem", color: "#94a3b8", marginBottom: "0.4rem", fontWeight: 500 }}>Full Name *</label>
                                    <input type="text" required placeholder="Arjun Kumar"
                                        value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        style={{ width: "100%", padding: "0.75rem 1rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "#f1f5f9", fontSize: "0.95rem", outline: "none", boxSizing: "border-box" }} />
                                </div>

                                {/* Email */}
                                <div style={{ marginBottom: "1rem" }}>
                                    <label style={{ display: "block", fontSize: "0.8rem", color: "#94a3b8", marginBottom: "0.4rem", fontWeight: 500 }}>Email *</label>
                                    <input type="email" required placeholder="arjun@example.com"
                                        value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                                        style={{ width: "100%", padding: "0.75rem 1rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "#f1f5f9", fontSize: "0.95rem", outline: "none", boxSizing: "border-box" }} />
                                </div>

                                {/* Password */}
                                <div style={{ marginBottom: "1.25rem" }}>
                                    <label style={{ display: "block", fontSize: "0.8rem", color: "#94a3b8", marginBottom: "0.4rem", fontWeight: 500 }}>Password * <span style={{ fontSize: "0.7rem", color: "#64748b" }}>(min 6 chars)</span></label>
                                    <div style={{ position: "relative" }}>
                                        <input type={showPwd ? "text" : "password"} required minLength={6} placeholder="••••••••"
                                            value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                                            style={{ width: "100%", padding: "0.75rem 1rem", paddingRight: "3rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "#f1f5f9", fontSize: "0.95rem", outline: "none", boxSizing: "border-box" }} />
                                        <button type="button" onClick={() => setShowPwd(!showPwd)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: "1rem" }}>
                                            {showPwd ? "🙈" : "👁️"}
                                        </button>
                                    </div>
                                    {form.password.length > 0 && form.password.length < 6 && (
                                        <p style={{ fontSize: "0.7rem", color: "#f87171", marginTop: "0.3rem" }}>Password must be at least 6 characters</p>
                                    )}
                                </div>

                                <button type="button" onClick={() => { if (form.name && form.email && form.password.length >= 6) setStep(2); else setError("Please fill all required fields"); }}
                                    disabled={!canProceed || form.password.length < 6}
                                    style={{ width: "100%", padding: "0.85rem", borderRadius: 12, background: canProceed && form.password.length >= 6 ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "rgba(99,102,241,0.3)", color: "white", border: "none", fontWeight: 700, cursor: canProceed && form.password.length >= 6 ? "pointer" : "default", fontSize: "1rem", opacity: canProceed && form.password.length >= 6 ? 1 : 0.5 }}>
                                    Continue →
                                </button>
                            </>
                        ) : (
                            <>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                                    <h3 style={{ fontWeight: 700, fontSize: "1rem", color: "#f1f5f9" }}>🎓 Tell us about yourself</h3>
                                    <button type="button" onClick={() => setStep(1)} style={{ background: "none", border: "none", color: "#818cf8", fontSize: "0.8rem", cursor: "pointer", fontWeight: 600 }}>← Back</button>
                                </div>
                                <p style={{ fontSize: "0.8rem", color: "#64748b", marginBottom: "1rem" }}>Optional but helps personalize your experience</p>

                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "0.75rem" }}>
                                    {/* Age */}
                                    <div>
                                        <label style={{ display: "block", fontSize: "0.75rem", color: "#94a3b8", marginBottom: "0.35rem", fontWeight: 500 }}>Age</label>
                                        <input type="number" placeholder="18" min={10} max={60}
                                            value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })}
                                            style={{ width: "100%", padding: "0.65rem 0.75rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#f1f5f9", fontSize: "0.9rem", outline: "none", boxSizing: "border-box" }} />
                                    </div>
                                    {/* City */}
                                    <div>
                                        <label style={{ display: "block", fontSize: "0.75rem", color: "#94a3b8", marginBottom: "0.35rem", fontWeight: 500 }}>City</label>
                                        <input type="text" placeholder="Bangalore"
                                            value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}
                                            style={{ width: "100%", padding: "0.65rem 0.75rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#f1f5f9", fontSize: "0.9rem", outline: "none", boxSizing: "border-box" }} />
                                    </div>
                                </div>

                                {/* Education - FIXED: dark dropdown with visible text */}
                                <div style={{ marginBottom: "0.75rem" }}>
                                    <label style={{ display: "block", fontSize: "0.75rem", color: "#94a3b8", marginBottom: "0.35rem", fontWeight: 500 }}>Education Level</label>
                                    <select value={form.education_level} onChange={(e) => setForm({ ...form, education_level: e.target.value })}
                                        style={{ width: "100%", padding: "0.65rem 0.75rem", background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: form.education_level ? "#f1f5f9" : "#64748b", fontSize: "0.9rem", outline: "none", appearance: "auto", boxSizing: "border-box" }}>
                                        <option value="" style={{ background: "#1a1a2e", color: "#94a3b8" }}>Select Education</option>
                                        <option value="10th" style={{ background: "#1a1a2e", color: "#f1f5f9" }}>Class 10th / SSC</option>
                                        <option value="12th" style={{ background: "#1a1a2e", color: "#f1f5f9" }}>Class 12th / HSC</option>
                                        <option value="undergraduate" style={{ background: "#1a1a2e", color: "#f1f5f9" }}>Undergraduate (B.Tech/BCA/B.Com etc.)</option>
                                        <option value="graduate" style={{ background: "#1a1a2e", color: "#f1f5f9" }}>Graduate</option>
                                        <option value="postgraduate" style={{ background: "#1a1a2e", color: "#f1f5f9" }}>Postgraduate (M.Tech/MBA etc.)</option>
                                        <option value="working" style={{ background: "#1a1a2e", color: "#f1f5f9" }}>Working Professional</option>
                                    </select>
                                </div>

                                {/* Institution — College/School/Company */}
                                <div style={{ marginBottom: "0.75rem" }}>
                                    <label style={{ display: "block", fontSize: "0.75rem", color: "#94a3b8", marginBottom: "0.35rem", fontWeight: 500 }}>
                                        {form.education_level === "working" ? "Company Name" : "College / School Name"}
                                    </label>
                                    <input type="text" placeholder={form.education_level === "working" ? "e.g. TCS, Infosys, Flipkart" : "e.g. VIT Vellore, IIT Madras, DPS"}
                                        value={form.institution} onChange={(e) => setForm({ ...form, institution: e.target.value })}
                                        style={{ width: "100%", padding: "0.65rem 0.75rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#f1f5f9", fontSize: "0.9rem", outline: "none", boxSizing: "border-box" }} />
                                </div>

                                {/* Career Interest */}
                                <div style={{ marginBottom: "1.25rem" }}>
                                    <label style={{ display: "block", fontSize: "0.75rem", color: "#94a3b8", marginBottom: "0.35rem", fontWeight: 500 }}>Career Interest</label>
                                    <select value={form.careerInterest} onChange={(e) => setForm({ ...form, careerInterest: e.target.value })}
                                        style={{ width: "100%", padding: "0.65rem 0.75rem", background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: form.careerInterest ? "#f1f5f9" : "#64748b", fontSize: "0.9rem", outline: "none", appearance: "auto", boxSizing: "border-box" }}>
                                        <option value="" style={{ background: "#1a1a2e", color: "#94a3b8" }}>Select Career Path</option>
                                        <option value="technology" style={{ background: "#1a1a2e", color: "#f1f5f9" }}>💻 Technology / Engineering</option>
                                        <option value="business" style={{ background: "#1a1a2e", color: "#f1f5f9" }}>📊 Business / Management</option>
                                        <option value="design" style={{ background: "#1a1a2e", color: "#f1f5f9" }}>🎨 Design / Creative</option>
                                        <option value="finance" style={{ background: "#1a1a2e", color: "#f1f5f9" }}>📈 Finance / CA</option>
                                        <option value="marketing" style={{ background: "#1a1a2e", color: "#f1f5f9" }}>📱 Marketing</option>
                                        <option value="medical" style={{ background: "#1a1a2e", color: "#f1f5f9" }}>🩺 Medical / Healthcare</option>
                                        <option value="not-sure" style={{ background: "#1a1a2e", color: "#f1f5f9" }}>🤷 Not sure yet</option>
                                    </select>
                                </div>

                                <button type="submit" disabled={loading}
                                    style={{ width: "100%", padding: "0.85rem", borderRadius: 12, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "white", border: "none", fontWeight: 700, cursor: loading ? "default" : "pointer", fontSize: "1rem", opacity: loading ? 0.6 : 1, boxShadow: "0 4px 20px rgba(99,102,241,0.3)" }}>
                                    {loading ? "Creating account..." : "🚀 Create Account & Start"}
                                </button>

                                <button type="button" onClick={() => { setStep(1); }}
                                    style={{ width: "100%", padding: "0.65rem", borderRadius: 10, background: "transparent", border: "1px solid rgba(255,255,255,0.08)", color: "#94a3b8", cursor: "pointer", fontSize: "0.85rem", marginTop: "0.5rem" }}>
                                    Skip for now →
                                </button>
                            </>
                        )}
                    </div>

                    {step === 1 && (
                        <p style={{ textAlign: "center", fontSize: "0.85rem", color: "#94a3b8", marginTop: "1rem" }}>
                            Already have an account? <Link href="/login" style={{ color: "#818cf8", textDecoration: "none" }}>Log in</Link>
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
}
