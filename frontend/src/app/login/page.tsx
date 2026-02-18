"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function LoginPage() {
    const router = useRouter();
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const data = await api.login(form);
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            router.push("/dashboard");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

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
                </form>
            </div>
        </div>
    );
}
