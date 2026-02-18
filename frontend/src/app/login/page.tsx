"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [checkingAuth, setCheckingAuth] = useState(true);

    // Check if already logged in (validate token first, don't blindly redirect)
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) { setCheckingAuth(false); return; }

        fetch("/api/auth/me", { headers: { Authorization: `Bearer ${token}` } })
            .then(r => r.json())
            .then(data => {
                if (data && data.id) {
                    router.replace("/dashboard");
                } else {
                    // Token is invalid — clean up
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    setCheckingAuth(false);
                }
            })
            .catch(() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                setCheckingAuth(false);
            });
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: form.email, password: form.password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.detail || "Login failed. Please check your credentials.");
                setLoading(false);
                return;
            }

            if (!data.token) {
                setError("Login failed — no token received");
                setLoading(false);
                return;
            }

            // Success!
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            router.push("/dashboard");
        } catch (err: any) {
            console.error("Login error:", err);
            setError(err.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Show loading while checking existing auth
    if (checkingAuth) {
        return (
            <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
                <div style={{ width: 40, height: 40, border: "3px solid #1e1e2e", borderTopColor: "#6366f1", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-6">
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-600/8 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 w-full max-w-md">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-xl font-bold">S</div>
                        <span className="text-2xl font-bold">Skill<span className="text-indigo-400">Sync</span> AI</span>
                    </Link>
                    <h1 className="text-2xl font-bold mb-2">Welcome back</h1>
                    <p className="text-gray-400 text-sm">Log in to continue your career journey</p>
                </div>

                <form onSubmit={handleSubmit} className="card space-y-4">
                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">{error}</div>
                    )}

                    <div>
                        <label className="block text-sm text-gray-400 mb-1.5">Email</label>
                        <input type="email" required className="input-field" placeholder="you@example.com"
                            value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-1.5">Password</label>
                        <input type="password" required className="input-field" placeholder="Your password"
                            value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary w-full !py-3.5 disabled:opacity-50">
                        {loading ? "Logging in..." : "Log In"}
                    </button>

                    <p className="text-center text-sm text-gray-400">
                        Don&apos;t have an account? <Link href="/signup" className="text-indigo-400 hover:underline">Sign up free</Link>
                    </p>

                    {/* Quick login helper for testing */}
                    <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "0.75rem", marginTop: "0.5rem" }}>
                        <p style={{ fontSize: "0.7rem", color: "#64748b", textAlign: "center", marginBottom: "0.5rem" }}>Quick login (demo)</p>
                        <button type="button" onClick={() => setForm({ email: "admin@skillsync.ai", password: "admin123" })}
                            style={{ width: "100%", padding: "0.4rem", borderRadius: 8, background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)", color: "#ef4444", fontSize: "0.75rem", cursor: "pointer", marginBottom: "0.35rem" }}>
                            🛡️ Admin: admin@skillsync.ai
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
