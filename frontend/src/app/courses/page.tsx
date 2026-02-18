"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function CoursesPage() {
    const [courses, setCourses] = useState<any[]>([]);
    const [filter, setFilter] = useState("all");
    const [freeOnly, setFreeOnly] = useState(false);
    const [loading, setLoading] = useState(true);
    const [enrolled, setEnrolled] = useState<Set<string>>(new Set());

    useEffect(() => {
        const params = new URLSearchParams();
        if (filter !== "all") params.set("category", filter);
        if (freeOnly) params.set("free", "true");
        fetch(`/api/courses?${params.toString()}`)
            .then(r => r.json()).then(d => { setCourses(d.courses || []); setLoading(false); });
    }, [filter, freeOnly]);

    const handleEnroll = (id: string) => {
        const next = new Set(Array.from(enrolled));
        next.add(id);
        setEnrolled(next);
    };

    const categories = [
        { id: "all", label: "All Courses", icon: "📚" },
        { id: "technology", label: "Technology", icon: "💻" },
        { id: "design", label: "Design", icon: "🎨" },
        { id: "business", label: "Business", icon: "📊" },
    ];

    return (
        <div style={{ minHeight: "100vh", background: "var(--bg-primary)", color: "var(--text-primary)" }}>
            <nav style={{ padding: "0.65rem clamp(0.75rem, 3vw, 2rem)", borderBottom: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "rgba(10,10,15,0.95)", backdropFilter: "blur(20px)", zIndex: 100, flexWrap: "wrap", gap: "0.5rem" }}>
                <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none", color: "var(--text-primary)" }}>
                    <span style={{ fontSize: "1.5rem" }}>🧠</span>
                    <span style={{ fontWeight: 800, fontSize: "1.25rem" }}>SkillSync <span style={{ color: "#8b5cf6" }}>Learn</span></span>
                </Link>
            </nav>

            <div style={{ maxWidth: 1100, margin: "0 auto", padding: "clamp(1rem, 3vw, 2rem) clamp(0.5rem, 2vw, 1rem)" }}>
                {/* Header */}
                <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                    <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "0.5rem" }}>🎓 Learning Paths</h1>
                    <p style={{ color: "var(--text-secondary)", fontSize: "1rem", maxWidth: 600, margin: "0 auto" }}>
                        Industry-aligned courses designed for Indian students. Practice-heavy, no fluff — built to get you hired.
                    </p>
                </div>

                {/* Filters */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
                    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                        {categories.map(c => (
                            <button key={c.id} onClick={() => setFilter(c.id)}
                                style={{ padding: "0.5rem 1rem", borderRadius: 999, border: "1px solid", borderColor: filter === c.id ? "#8b5cf6" : "var(--border-color)", background: filter === c.id ? "rgba(139,92,246,0.15)" : "transparent", color: filter === c.id ? "#8b5cf6" : "var(--text-secondary)", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem" }}>
                                {c.icon} {c.label}
                            </button>
                        ))}
                    </div>
                    <button onClick={() => setFreeOnly(!freeOnly)}
                        style={{ padding: "0.5rem 1rem", borderRadius: 999, border: "1px solid", borderColor: freeOnly ? "#22c55e" : "var(--border-color)", background: freeOnly ? "rgba(34,197,94,0.15)" : "transparent", color: freeOnly ? "#22c55e" : "var(--text-secondary)", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem" }}>
                        {freeOnly ? "✅ Free Only" : "Show Free Only"}
                    </button>
                </div>

                {/* Stats Bar */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(200px, 100%), 1fr))", gap: "0.75rem", marginBottom: "1.5rem" }}>
                    {[
                        { label: "Total Courses", value: "8+", icon: "📚", color: "#8b5cf6" },
                        { label: "Students Enrolled", value: "92K+", icon: "👥", color: "#22c55e" },
                        { label: "Avg Rating", value: "4.7 ★", icon: "⭐", color: "#eab308" },
                        { label: "Free Courses", value: "7", icon: "🆓", color: "#06b6d4" },
                    ].map((s, i) => (
                        <div key={i} className="glass-card" style={{ padding: "1rem", borderRadius: 12, textAlign: "center" }}>
                            <span style={{ fontSize: "1.5rem" }}>{s.icon}</span>
                            <p style={{ fontSize: "1.5rem", fontWeight: 800, color: s.color, marginTop: "0.25rem" }}>{s.value}</p>
                            <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{s.label}</p>
                        </div>
                    ))}
                </div>

                {/* Course Grid */}
                {loading ? (
                    <div style={{ textAlign: "center", padding: "3rem" }}>
                        <div style={{ width: 48, height: 48, border: "3px solid var(--border-color)", borderTopColor: "#8b5cf6", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto" }} />
                    </div>
                ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(300px, 100%), 1fr))", gap: "1rem" }}>
                        {courses.map(course => (
                            <div key={course.id} className="glass-card" style={{ borderRadius: 16, overflow: "hidden", transition: "transform 0.2s" }}
                                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
                                onMouseLeave={e => e.currentTarget.style.transform = "none"}>
                                {/* Course Header */}
                                <div style={{ padding: "1.5rem", background: "linear-gradient(135deg, rgba(139,92,246,0.08), rgba(99,102,241,0.05))", borderBottom: "1px solid var(--border-color)", position: "relative" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                        <span style={{ fontSize: "2.5rem" }}>{course.image}</span>
                                        <div style={{ display: "flex", gap: "0.4rem" }}>
                                            {course.free ? (
                                                <span style={{ padding: "0.2rem 0.6rem", borderRadius: 999, background: "rgba(34,197,94,0.15)", color: "#22c55e", fontSize: "0.7rem", fontWeight: 700 }}>FREE</span>
                                            ) : (
                                                <span style={{ padding: "0.2rem 0.6rem", borderRadius: 999, background: "rgba(234,179,8,0.15)", color: "#eab308", fontSize: "0.7rem", fontWeight: 700 }}>PREMIUM</span>
                                            )}
                                        </div>
                                    </div>
                                    <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginTop: "0.75rem" }}>{course.title}</h3>
                                </div>
                                {/* Course Body */}
                                <div style={{ padding: "1.25rem" }}>
                                    <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "1rem", minHeight: 60 }}>
                                        {course.description.length > 120 ? course.description.slice(0, 120) + "..." : course.description}
                                    </p>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginBottom: "1rem", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                                        <span>📅 {course.duration}</span>
                                        <span>📖 {course.modules} modules</span>
                                        <span>⭐ {course.rating}/5</span>
                                        <span>👥 {(course.enrolled / 1000).toFixed(1)}K enrolled</span>
                                    </div>
                                    <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                                        {course.tags.map((tag: string) => (
                                            <span key={tag} style={{ padding: "0.15rem 0.5rem", borderRadius: 999, background: "rgba(99,102,241,0.1)", color: "var(--accent-primary)", fontSize: "0.7rem" }}>{tag}</span>
                                        ))}
                                    </div>
                                    <button onClick={() => handleEnroll(course.id)}
                                        style={{ width: "100%", padding: "0.65rem", borderRadius: 10, background: enrolled.has(course.id) ? "rgba(34,197,94,0.15)" : "linear-gradient(135deg, #8b5cf6, var(--accent-primary))", color: enrolled.has(course.id) ? "#22c55e" : "white", border: enrolled.has(course.id) ? "1px solid #22c55e" : "none", fontWeight: 700, cursor: "pointer", fontSize: "0.9rem" }}>
                                        {enrolled.has(course.id) ? "✅ Enrolled" : "Enroll Now →"}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
