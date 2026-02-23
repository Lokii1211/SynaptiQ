'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/lib/store/auth.store';
import { auth } from '@/lib/api';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, loading, error, clearError } = useAuthStore();

    useEffect(() => {
        if (auth.isLoggedIn()) window.location.href = '/dashboard';
        return () => clearError();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(email, password);
            window.location.href = '/dashboard';
        } catch { /* error handled by store */ }
    };

    return (
        <div className="min-h-screen bg-white flex">
            {/* Left panel — form */}
            <div className="flex-1 flex flex-col justify-center px-6 md:px-16 lg:px-24 max-w-lg mx-auto w-full">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 mb-10">
                        <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                            ST
                        </div>
                        <span className="text-xl font-bold text-slate-900">Skill<span className="text-indigo-600">Ten</span></span>
                    </Link>

                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Welcome back</h1>
                    <p className="text-slate-500 text-sm mb-8">Continue your career journey</p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                            <input
                                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                                placeholder="your@email.com" required
                                className="st-input"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                            <input
                                type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••" required minLength={6}
                                className="st-input"
                            />
                        </div>

                        {error && (
                            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg"
                            >{error}</motion.p>
                        )}

                        <button type="submit" disabled={loading}
                            className="w-full st-btn-primary text-base py-3.5 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Signing in...
                                </>
                            ) : 'Sign In'}
                        </button>
                    </form>

                    <p className="text-sm text-slate-500 mt-6 text-center">
                        Don&apos;t have an account?{' '}
                        <Link href="/signup" className="text-indigo-600 font-semibold hover:text-indigo-700">
                            Create one for free
                        </Link>
                    </p>
                </motion.div>
            </div>

            {/* Right panel — branding */}
            <div className="hidden lg:flex flex-1 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 items-center justify-center p-12">
                <div className="text-white max-w-md">
                    <h2 className="text-3xl font-bold mb-4">Your career DNA,<br />decoded by AI</h2>
                    <p className="text-white/70 text-lg leading-relaxed mb-8">
                        SkillTen helps Indian students discover their ideal career path through
                        AI-powered psychometric assessment, skill gap analysis, and personalized roadmaps.
                    </p>
                    <div className="space-y-3">
                        {['4D Career Profiling', 'AI-Powered Skill Gap Analysis', 'Real-time Job Matching', 'Coding Arena + AI Review'].map((f, i) => (
                            <div key={i} className="flex items-center gap-3 text-white/80">
                                <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center text-xs">✓</div>
                                <span className="text-sm font-medium">{f}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
