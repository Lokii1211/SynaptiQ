"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Opening {
    id: string; title: string; company: string; location: string; type: string;
    salary: string; experience: string; skills: string[]; description: string;
    applyUrl: string; category: string; isActive: boolean; isUrgent: boolean;
    postedAt: string; deadline: string; applicants: number;
}

interface UserInfo {
    id: string; email: string; name: string; role: string; points: number;
}

export default function AdminDashboard() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [authorized, setAuthorized] = useState(false);
    const [tab, setTab] = useState<"overview" | "openings" | "users" | "create">("overview");
    const [openings, setOpenings] = useState<Opening[]>([]);
    const [users, setUsers] = useState<UserInfo[]>([]);
    const [stats, setStats] = useState<any>({});
    const [toast, setToast] = useState("");

    // New opening form
    const [form, setForm] = useState({
        title: "", company: "", location: "", type: "Full-time", salary: "",
        experience: "", skills: "", description: "", applyUrl: "", category: "technology",
        isUrgent: false, deadline: "",
    });

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) { router.push("/login"); return; }

        // Check if user is admin
        fetch("/api/admin/openings", { headers: { Authorization: `Bearer ${token}` } })
            .then(r => r.json())
            .then(data => {
                if (data.error) { router.push("/dashboard"); return; }
                setOpenings(data.openings || []);
                setUsers(data.users || []);
                setStats(data.stats || {});
                setAuthorized(true);
                setLoading(false);
            })
            .catch(() => router.push("/dashboard"));
    }, [router]);

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(""), 3000);
    };

    const createOpening = async () => {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/admin/openings", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ ...form, skills: form.skills.split(",").map(s => s.trim()).filter(Boolean) }),
        });
        const data = await res.json();
        if (data.error) { showToast("❌ " + data.error); return; }
        setOpenings(prev => [data.opening, ...prev]);
        setForm({ title: "", company: "", location: "", type: "Full-time", salary: "", experience: "", skills: "", description: "", applyUrl: "", category: "technology", isUrgent: false, deadline: "" });
        setTab("openings");
        showToast("✅ Opening created successfully!");
    };

    const toggleOpening = async (id: string, isActive: boolean) => {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/admin/openings", {
            method: "PUT",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ id, isActive: !isActive }),
        });
        const data = await res.json();
        if (!data.error) {
            setOpenings(prev => prev.map(o => o.id === id ? { ...o, isActive: !isActive } : o));
            showToast(`✅ Opening ${!isActive ? "activated" : "deactivated"}`);
        }
    };

    const deleteOpening = async (id: string) => {
        if (!confirm("Are you sure you want to delete this opening?")) return;
        const token = localStorage.getItem("token");
        await fetch(`/api/admin/openings?id=${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
        setOpenings(prev => prev.filter(o => o.id !== id));
        showToast("✅ Opening deleted");
    };

    const updateRole = async (userId: string, role: string) => {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/admin/users", {
            method: "PUT",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ userId, role }),
        });
        const data = await res.json();
        if (!data.error) {
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u));
            showToast(`✅ Role updated to ${role}`);
        }
    };

    if (loading) return (
        <div style={{ minHeight: "100vh", background: "var(--bg-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 48, height: 48, border: "3px solid var(--border-color)", borderTopColor: "#ef4444", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
        </div>
    );

    if (!authorized) return null;

    const inputStyle: React.CSSProperties = { width: "100%", padding: "0.65rem 0.85rem", borderRadius: 10, background: "var(--bg-card)", border: "1px solid var(--border-color)", color: "var(--text-primary)", fontSize: "0.85rem", outline: "none" };
    const labelStyle: React.CSSProperties = { display: "block", fontSize: "0.78rem", color: "var(--text-secondary)", marginBottom: "0.3rem", fontWeight: 600 };

    return (
        <div style={{ minHeight: "100vh", background: "var(--bg-primary)", color: "var(--text-primary)" }}>
            {/* Toast */}
            {toast && (
                <div style={{ position: "fixed", top: 20, right: 20, padding: "0.75rem 1.25rem", borderRadius: 12, background: toast.includes("❌") ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", border: `1px solid ${toast.includes("❌") ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}`, color: toast.includes("❌") ? "#ef4444" : "#22c55e", fontSize: "0.85rem", fontWeight: 600, zIndex: 1000, backdropFilter: "blur(10px)", animation: "slideInRight 0.3s ease" }}>
                    {toast}
                </div>
            )}

            {/* Header */}
            <nav style={{ padding: "0.65rem clamp(0.75rem, 3vw, 2rem)", borderBottom: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "rgba(10,10,15,0.95)", backdropFilter: "blur(20px)", zIndex: 100, flexWrap: "wrap", gap: "0.5rem" }}>
                <Link href="/admin" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none", color: "var(--text-primary)" }}>
                    <span style={{ fontSize: "1.5rem" }}>🛡️</span>
                    <span style={{ fontWeight: 800, fontSize: "1.2rem" }}>SkillSync <span style={{ color: "#ef4444" }}>Admin</span></span>
                </Link>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <Link href="/dashboard" style={{ padding: "0.35rem 0.75rem", borderRadius: 8, background: "rgba(99,102,241,0.1)", color: "var(--accent-primary)", textDecoration: "none", fontSize: "0.8rem", fontWeight: 600 }}>
                        📊 Student View
                    </Link>
                    <button onClick={() => { localStorage.removeItem("token"); localStorage.removeItem("user"); router.push("/login"); }}
                        style={{ padding: "0.35rem 0.75rem", borderRadius: 8, background: "var(--bg-card)", border: "1px solid var(--border-color)", color: "var(--text-secondary)", fontSize: "0.75rem", cursor: "pointer" }}>Logout</button>
                </div>
            </nav>

            <div style={{ maxWidth: 1200, margin: "0 auto", padding: "1.5rem clamp(0.75rem, 3vw, 1.5rem)" }}>
                {/* Tabs */}
                <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
                    {([
                        { key: "overview", icon: "📊", label: "Overview" },
                        { key: "openings", icon: "💼", label: "Openings" },
                        { key: "users", icon: "👥", label: "Users" },
                        { key: "create", icon: "➕", label: "Post Opening" },
                    ] as const).map(t => (
                        <button key={t.key} onClick={() => setTab(t.key)}
                            style={{ padding: "0.5rem 1.2rem", borderRadius: 10, border: tab === t.key ? "1px solid var(--accent-primary)" : "1px solid var(--border-color)", background: tab === t.key ? "rgba(99,102,241,0.12)" : "var(--bg-card)", color: tab === t.key ? "var(--accent-primary)" : "var(--text-secondary)", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}>
                            {t.icon} {t.label}
                        </button>
                    ))}
                </div>

                {/* Overview Tab */}
                {tab === "overview" && (
                    <div>
                        <h1 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "1.25rem" }}>📊 Admin Dashboard</h1>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(200px, 100%), 1fr))", gap: "1rem", marginBottom: "2rem" }}>
                            {[
                                { label: "Total Users", value: stats.totalUsers || 0, icon: "👥", color: "#6366f1" },
                                { label: "Students", value: stats.students || 0, icon: "🎓", color: "#22c55e" },
                                { label: "Mentors", value: stats.mentors || 0, icon: "👨‍🏫", color: "#f59e0b" },
                                { label: "Active Openings", value: stats.activeOpenings || 0, icon: "💼", color: "#ef4444" },
                                { label: "Total Openings", value: stats.totalOpenings || 0, icon: "📋", color: "#06b6d4" },
                            ].map((s, i) => (
                                <div key={i} className="glass-card" style={{ padding: "1.25rem", borderRadius: 14, textAlign: "center" }}>
                                    <span style={{ fontSize: "2rem" }}>{s.icon}</span>
                                    <p style={{ fontSize: "1.75rem", fontWeight: 800, color: s.color, marginTop: "0.5rem" }}>{s.value}</p>
                                    <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>{s.label}</p>
                                </div>
                            ))}
                        </div>

                        <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.75rem" }}>⚡ Quick Actions</h2>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(250px, 100%), 1fr))", gap: "0.75rem" }}>
                            <button onClick={() => setTab("create")} className="glass-card" style={{ padding: "1rem", borderRadius: 12, cursor: "pointer", border: "1px solid rgba(34,197,94,0.2)", textAlign: "left", background: "rgba(34,197,94,0.05)" }}>
                                <span style={{ fontSize: "1.25rem" }}>➕</span>
                                <p style={{ fontWeight: 700, fontSize: "0.9rem", marginTop: "0.25rem", color: "var(--text-primary)" }}>Post New Opening</p>
                                <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Create a new job/internship listing</p>
                            </button>
                            <button onClick={() => setTab("users")} className="glass-card" style={{ padding: "1rem", borderRadius: 12, cursor: "pointer", border: "1px solid rgba(99,102,241,0.2)", textAlign: "left", background: "rgba(99,102,241,0.05)" }}>
                                <span style={{ fontSize: "1.25rem" }}>👥</span>
                                <p style={{ fontWeight: 700, fontSize: "0.9rem", marginTop: "0.25rem", color: "var(--text-primary)" }}>Manage Users</p>
                                <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Change roles, view students</p>
                            </button>
                            <button onClick={() => setTab("openings")} className="glass-card" style={{ padding: "1rem", borderRadius: 12, cursor: "pointer", border: "1px solid rgba(239,68,68,0.2)", textAlign: "left", background: "rgba(239,68,68,0.05)" }}>
                                <span style={{ fontSize: "1.25rem" }}>💼</span>
                                <p style={{ fontWeight: 700, fontSize: "0.9rem", marginTop: "0.25rem", color: "var(--text-primary)" }}>Manage Openings</p>
                                <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Activate, deactivate, delete listings</p>
                            </button>
                        </div>
                    </div>
                )}

                {/* Openings Tab */}
                {tab === "openings" && (
                    <div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
                            <h1 style={{ fontSize: "1.3rem", fontWeight: 800 }}>💼 Manage Openings ({openings.length})</h1>
                            <button onClick={() => setTab("create")} style={{ padding: "0.5rem 1rem", borderRadius: 10, background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "white", border: "none", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer" }}>
                                ➕ New Opening
                            </button>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                            {openings.map(o => (
                                <div key={o.id} className="glass-card" style={{ padding: "1rem 1.25rem", borderRadius: 14, borderLeft: `4px solid ${o.isActive ? "#22c55e" : "#64748b"}` }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.5rem" }}>
                                        <div style={{ flex: 1, minWidth: 200 }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                                                <h3 style={{ fontSize: "0.95rem", fontWeight: 700 }}>{o.title}</h3>
                                                {o.isUrgent && <span style={{ padding: "0.1rem 0.4rem", borderRadius: 999, background: "rgba(239,68,68,0.15)", color: "#ef4444", fontSize: "0.6rem", fontWeight: 800 }}>URGENT</span>}
                                                <span style={{ padding: "0.1rem 0.4rem", borderRadius: 999, background: o.isActive ? "rgba(34,197,94,0.15)" : "rgba(100,116,139,0.15)", color: o.isActive ? "#22c55e" : "#64748b", fontSize: "0.6rem", fontWeight: 800 }}>
                                                    {o.isActive ? "ACTIVE" : "INACTIVE"}
                                                </span>
                                            </div>
                                            <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
                                                {o.company} • {o.location} • {o.type} • {o.salary}
                                            </p>
                                            <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0.15rem" }}>
                                                👤 {o.applicants} applicants • 📅 Deadline: {o.deadline}
                                            </p>
                                        </div>
                                        <div style={{ display: "flex", gap: "0.4rem" }}>
                                            <button onClick={() => toggleOpening(o.id, o.isActive)}
                                                style={{ padding: "0.35rem 0.7rem", borderRadius: 8, background: o.isActive ? "rgba(100,116,139,0.1)" : "rgba(34,197,94,0.1)", border: "1px solid var(--border-color)", color: o.isActive ? "#64748b" : "#22c55e", fontSize: "0.75rem", cursor: "pointer", fontWeight: 600 }}>
                                                {o.isActive ? "Deactivate" : "Activate"}
                                            </button>
                                            <button onClick={() => deleteOpening(o.id)}
                                                style={{ padding: "0.35rem 0.7rem", borderRadius: 8, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444", fontSize: "0.75rem", cursor: "pointer", fontWeight: 600 }}>
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Users Tab */}
                {tab === "users" && (
                    <div>
                        <h1 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: "1rem" }}>👥 Manage Users ({users.length})</h1>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            {users.map(u => (
                                <div key={u.id} className="glass-card" style={{ padding: "0.85rem 1.25rem", borderRadius: 12, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
                                    <div>
                                        <p style={{ fontWeight: 700, fontSize: "0.9rem" }}>{u.name}</p>
                                        <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{u.email} • ⭐ {u.points} pts</p>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                        <select value={u.role} onChange={(e) => updateRole(u.id, e.target.value)}
                                            style={{ padding: "0.35rem 0.6rem", borderRadius: 8, background: "var(--bg-card)", border: "1px solid var(--border-color)", color: u.role === "admin" ? "#ef4444" : u.role === "mentor" ? "#f59e0b" : "#22c55e", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer" }}>
                                            <option value="student">Student</option>
                                            <option value="mentor">Mentor</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Create Opening Tab */}
                {tab === "create" && (
                    <div>
                        <h1 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: "1.25rem" }}>➕ Post New Opening</h1>
                        <div className="glass-card" style={{ padding: "1.5rem", borderRadius: 18, maxWidth: 700 }}>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                                <div style={{ gridColumn: "1 / -1" }}>
                                    <label style={labelStyle}>Job Title *</label>
                                    <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Full Stack Developer Intern" style={inputStyle} />
                                </div>
                                <div>
                                    <label style={labelStyle}>Company *</label>
                                    <input value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} placeholder="e.g. Google India" style={inputStyle} />
                                </div>
                                <div>
                                    <label style={labelStyle}>Location</label>
                                    <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="e.g. Bangalore (Remote)" style={inputStyle} />
                                </div>
                                <div>
                                    <label style={labelStyle}>Type</label>
                                    <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={inputStyle}>
                                        <option>Full-time</option>
                                        <option>Part-time</option>
                                        <option>Internship</option>
                                        <option>Contract</option>
                                        <option>Freelance</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={labelStyle}>Category *</label>
                                    <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={inputStyle}>
                                        <option value="technology">Technology</option>
                                        <option value="business">Business</option>
                                        <option value="design">Design</option>
                                        <option value="finance">Finance</option>
                                        <option value="marketing">Marketing</option>
                                        <option value="healthcare">Healthcare</option>
                                        <option value="engineering">Engineering</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={labelStyle}>Salary</label>
                                    <input value={form.salary} onChange={e => setForm({ ...form, salary: e.target.value })} placeholder="e.g. ₹15-25 LPA" style={inputStyle} />
                                </div>
                                <div>
                                    <label style={labelStyle}>Experience</label>
                                    <input value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })} placeholder="e.g. 0-2 years" style={inputStyle} />
                                </div>
                                <div style={{ gridColumn: "1 / -1" }}>
                                    <label style={labelStyle}>Skills (comma separated)</label>
                                    <input value={form.skills} onChange={e => setForm({ ...form, skills: e.target.value })} placeholder="e.g. React, Node.js, Python" style={inputStyle} />
                                </div>
                                <div style={{ gridColumn: "1 / -1" }}>
                                    <label style={labelStyle}>Description</label>
                                    <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Detailed job description..." rows={4} style={{ ...inputStyle, resize: "vertical" }} />
                                </div>
                                <div>
                                    <label style={labelStyle}>Apply URL</label>
                                    <input value={form.applyUrl} onChange={e => setForm({ ...form, applyUrl: e.target.value })} placeholder="https://..." style={inputStyle} />
                                </div>
                                <div>
                                    <label style={labelStyle}>Deadline</label>
                                    <input type="date" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} style={inputStyle} />
                                </div>
                                <div style={{ gridColumn: "1 / -1", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                    <input type="checkbox" id="urgent" checked={form.isUrgent} onChange={e => setForm({ ...form, isUrgent: e.target.checked })} style={{ accentColor: "#ef4444" }} />
                                    <label htmlFor="urgent" style={{ fontSize: "0.85rem", color: "var(--text-secondary)", cursor: "pointer" }}>🔥 Mark as Urgent (highlighted in listings)</label>
                                </div>
                            </div>
                            <button onClick={createOpening} disabled={!form.title || !form.company}
                                style={{ marginTop: "1.25rem", width: "100%", padding: "0.75rem", borderRadius: 12, background: (!form.title || !form.company) ? "var(--bg-card)" : "linear-gradient(135deg, #22c55e, #16a34a)", color: (!form.title || !form.company) ? "var(--text-secondary)" : "white", border: "none", fontWeight: 700, fontSize: "0.95rem", cursor: (!form.title || !form.company) ? "not-allowed" : "pointer", transition: "all 0.3s" }}>
                                🚀 Publish Opening
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @media (max-width: 640px) {
                    div[style*="grid-template-columns: 1fr 1fr"] {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </div>
    );
}
