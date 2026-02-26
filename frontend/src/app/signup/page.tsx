'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/lib/store/auth.store';
import { auth } from '@/lib/api';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

export default function SignupPage() {
    const [form, setForm] = useState({ email: '', password: '', display_name: '', username: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const { signup, loading, error, clearError } = useAuthStore();

    useEffect(() => {
        if (auth.isLoggedIn()) window.location.href = '/dashboard';
        return () => clearError();
    }, []);

    // Password strength calculation
    useEffect(() => {
        const p = form.password;
        let score = 0;
        if (p.length >= 6) score++;
        if (p.length >= 8) score++;
        if (/[A-Z]/.test(p)) score++;
        if (/[0-9]/.test(p)) score++;
        if (/[^A-Za-z0-9]/.test(p)) score++;
        setPasswordStrength(score);
    }, [form.password]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await signup(form);
            window.location.href = '/assessment';
        } catch { /* error handled by store */ }
    };

    const handleGoogleSignup = () => {
        // Redirect to backend Google OAuth flow
        window.location.href = `${BACKEND_URL}/api/auth/google`;
    };

    const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm(prev => ({ ...prev, [field]: e.target.value }));

    const strengthColors = ['bg-slate-200', 'bg-red-400', 'bg-orange-400', 'bg-amber-400', 'bg-green-400', 'bg-emerald-500'];
    const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Excellent'];

    return (
        <div className="min-h-screen bg-white flex">
            {/* Left panel — branding */}
            <div className="hidden lg:flex flex-1 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 items-center justify-center p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/3" />
                <div className="text-white max-w-md relative z-10">
                    <h2 className="text-3xl font-bold mb-4">Start your career<br />journey today</h2>
                    <p className="text-white/70 text-lg leading-relaxed mb-8">
                        Join thousands of Indian students who discovered their career DNA with SkillTen&apos;s AI-powered platform.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { num: '10K+', label: 'Students assessed' },
                            { num: '50+', label: 'Career paths' },
                            { num: '200+', label: 'Coding problems' },
                            { num: '94%', label: 'Accuracy rate' },
                        ].map((s, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + i * 0.1 }}
                                className="bg-white/10 rounded-xl p-4 text-center backdrop-blur-sm">
                                <p className="text-2xl font-bold text-white">{s.num}</p>
                                <p className="text-xs text-white/60 mt-1">{s.label}</p>
                            </motion.div>
                        ))}
                    </div>
                    <div className="mt-8 space-y-2">
                        {['Trusted by 100+ colleges', 'PDPB 2023 compliant', 'Free forever for students'].map((t, i) => (
                            <div key={i} className="flex items-center gap-2 text-white/60 text-xs">
                                <span className="w-4 h-4 bg-emerald-400/30 rounded-full flex items-center justify-center text-[8px]">✓</span>
                                {t}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right panel — form */}
            <div className="flex-1 flex flex-col justify-center px-6 md:px-16 lg:px-24 max-w-lg mx-auto w-full">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <Link href="/" className="flex items-center gap-2 mb-8">
                        <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">ST</div>
                        <span className="text-xl font-bold text-slate-900">Skill<span className="text-indigo-600">Ten</span></span>
                    </Link>

                    <h1 className="text-2xl font-bold text-slate-900 mb-1">Create your account</h1>
                    <p className="text-slate-500 text-sm mb-6">Takes 30 seconds. No credit card needed.</p>

                    {/* Google Sign-up Button */}
                    <button onClick={handleGoogleSignup}
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
                        <span className="text-xs text-slate-400 font-medium">or sign up with email</span>
                        <div className="flex-1 h-px bg-slate-200" />
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-3.5">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1">Full Name</label>
                                <input type="text" value={form.display_name} onChange={update('display_name')}
                                    placeholder="Your full name" required className="st-input text-sm" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1">Username</label>
                                <input type="text" value={form.username} onChange={update('username')}
                                    placeholder="Choose username" required className="st-input text-sm" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">Email</label>
                            <input type="email" value={form.email} onChange={update('email')}
                                placeholder="your@email.com" required className="st-input text-sm" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">Password</label>
                            <div className="relative">
                                <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={update('password')}
                                    placeholder="Min 6 characters" required minLength={6} className="st-input text-sm pr-10" />
                                <button type="button" onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs">
                                    {showPassword ? '🙈' : '👁️'}
                                </button>
                            </div>
                            {/* Password strength indicator */}
                            {form.password && (
                                <div className="mt-1.5">
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map(i => (
                                            <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= passwordStrength ? strengthColors[passwordStrength] : 'bg-slate-100'}`} />
                                        ))}
                                    </div>
                                    <p className="text-[10px] text-slate-400 mt-0.5">{strengthLabels[passwordStrength]}</p>
                                </div>
                            )}
                        </div>

                        {error && (
                            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="text-red-500 text-xs bg-red-50 px-3 py-2 rounded-lg"
                            >{error}</motion.p>
                        )}

                        <button type="submit" disabled={loading}
                            className="w-full st-btn-primary text-sm py-3 flex items-center justify-center gap-2 mt-1"
                        >
                            {loading ? (
                                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating account...</>
                            ) : 'Create Account →'}
                        </button>
                    </form>

                    <p className="text-[10px] text-slate-400 mt-3 text-center leading-relaxed">
                        By creating an account, you agree to our{' '}
                        <Link href="/terms" className="text-indigo-500 hover:underline">Terms</Link> and{' '}
                        <Link href="/privacy" className="text-indigo-500 hover:underline">Privacy Policy</Link>
                    </p>

                    <p className="text-sm text-slate-500 mt-5 text-center">
                        Already have an account?{' '}
                        <Link href="/login" className="text-indigo-600 font-semibold hover:text-indigo-700">Sign in</Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
