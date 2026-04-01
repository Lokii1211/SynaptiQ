'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/lib/store/auth.store';
import { api, auth, BACKEND_URL } from '@/lib/api';
import { Logo } from '@/components/brand/Logo';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const { login, loading, error, clearError } = useAuthStore();

    useEffect(() => {
        if (auth.isLoggedIn()) router.replace('/dashboard');
        return () => clearError();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(email, password);
            router.push('/dashboard');
        } catch { /* error handled by store */ }
    };

    const handleGoogleLogin = () => {
        // Google OAuth must go directly to the backend (not through the rewrite proxy)
        const backendBase = (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'))
            ? 'http://localhost:8000'
            : 'https://mentixy-api.vercel.app';
        window.location.href = `${backendBase}/api/auth/google`;
    };

    return (
        <div className="min-h-screen bg-white flex">
            {/* Left panel — form */}
            <div className="flex-1 flex flex-col justify-center px-6 md:px-16 lg:px-24 max-w-lg mx-auto w-full">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    {/* Logo */}
                    <div className="mb-8">
                        <Logo size="md" href="/" />
                    </div>

                    <h1 className="text-2xl font-bold text-slate-900 mb-1 st-font-heading">Welcome back</h1>
                    <p className="text-slate-500 text-sm mb-6">Continue your career journey</p>

                    {/* Google Sign-in Button */}
                    <button onClick={handleGoogleLogin}
                        className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all mb-5 active:scale-[0.98]">
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Continue with Google
                    </button>

                    {/* Divider */}
                    <div className="flex items-center gap-3 mb-5">
                        <div className="flex-1 h-px bg-slate-200" />
                        <span className="text-xs text-slate-400 font-medium">or sign in with email</span>
                        <div className="flex-1 h-px bg-slate-200" />
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">Email</label>
                            <input
                                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                                placeholder="your@email.com" required
                                className="st-input text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••" required minLength={6}
                                    className="st-input text-sm pr-10"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs">
                                    {showPassword ? '🙈' : '👁️'}
                                </button>
                            </div>
                        </div>

                        {/* Remember me + Forgot */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)}
                                    className="w-3.5 h-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                                <span className="text-xs text-slate-500">Remember me</span>
                            </label>
                            <Link href="/forgot-password" className="text-xs text-indigo-600 font-medium hover:text-indigo-700">
                                Forgot password?
                            </Link>
                        </div>

                        {error && (
                            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="text-red-500 text-xs bg-red-50 px-3 py-2 rounded-lg"
                            >{error}</motion.p>
                        )}

                        <button type="submit" disabled={loading}
                            className="w-full st-btn-primary text-sm py-3 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Signing in...
                                </>
                            ) : 'Sign In →'}
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
            <div className="hidden lg:flex flex-1 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 items-center justify-center p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/3" />
                <div className="text-white max-w-md relative z-10">
                    <h2 className="text-3xl font-bold mb-4">Your career DNA,<br />decoded by AI</h2>
                    <p className="text-white/70 text-lg leading-relaxed mb-8">
                        Mentixy helps Indian students discover their ideal career path through
                        AI-powered psychometric assessment, skill gap analysis, and personalized roadmaps.
                    </p>
                    <div className="space-y-3">
                        {[
                            { icon: '🧬', label: '4D Career DNA Profiling' },
                            { icon: '🤖', label: 'AI Career Counselor (Hindi + English)' },
                            { icon: '💻', label: 'Coding Arena + AI Code Review' },
                            { icon: '📊', label: 'Real-time Job Matching & Salary Truth' },
                        ].map((f, i) => (
                            <motion.div key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + i * 0.1 }}
                                className="flex items-center gap-3 text-white/80">
                                <span className="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center text-sm">{f.icon}</span>
                                <span className="text-sm font-medium">{f.label}</span>
                            </motion.div>
                        ))}
                    </div>

                    {/* Social proof */}
                    <div className="mt-8 bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                        <p className="text-white/90 text-sm italic">&ldquo;Mentixy showed me career paths I never knew existed. Got placed at ₹8.5 LPA from a Tier-3 college!&rdquo;</p>
                        <p className="text-white/50 text-xs mt-2">— Priya S., VIT Vellore, 2025 Batch</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
