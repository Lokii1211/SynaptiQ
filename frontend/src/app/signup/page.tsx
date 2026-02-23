'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/lib/store/auth.store';
import { auth } from '@/lib/api';

export default function SignupPage() {
    const [form, setForm] = useState({ email: '', password: '', display_name: '', username: '' });
    const { signup, loading, error, clearError } = useAuthStore();

    useEffect(() => {
        if (auth.isLoggedIn()) window.location.href = '/dashboard';
        return () => clearError();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await signup(form);
            window.location.href = '/assessment';
        } catch { /* error handled by store */ }
    };

    const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm(prev => ({ ...prev, [field]: e.target.value }));

    return (
        <div className="min-h-screen bg-white flex">
            {/* Left panel — branding */}
            <div className="hidden lg:flex flex-1 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 items-center justify-center p-12">
                <div className="text-white max-w-md">
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
                            <div key={i} className="bg-white/10 rounded-xl p-4 text-center backdrop-blur-sm">
                                <p className="text-2xl font-bold text-white">{s.num}</p>
                                <p className="text-xs text-white/60 mt-1">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right panel — form */}
            <div className="flex-1 flex flex-col justify-center px-6 md:px-16 lg:px-24 max-w-lg mx-auto w-full">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <Link href="/" className="flex items-center gap-2 mb-10">
                        <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">ST</div>
                        <span className="text-xl font-bold text-slate-900">Skill<span className="text-indigo-600">Ten</span></span>
                    </Link>

                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Create your account</h1>
                    <p className="text-slate-500 text-sm mb-8">Takes 30 seconds. No credit card needed.</p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                            <input type="text" value={form.display_name} onChange={update('display_name')}
                                placeholder="Your full name" required className="st-input" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Username</label>
                            <input type="text" value={form.username} onChange={update('username')}
                                placeholder="Choose a unique username" required className="st-input" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                            <input type="email" value={form.email} onChange={update('email')}
                                placeholder="your@email.com" required className="st-input" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                            <input type="password" value={form.password} onChange={update('password')}
                                placeholder="Min 6 characters" required minLength={6} className="st-input" />
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
                                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating account...</>
                            ) : 'Create Account →'}
                        </button>
                    </form>

                    <p className="text-xs text-slate-400 mt-4 text-center leading-relaxed">
                        By creating an account, you agree to our Terms of Service and Privacy Policy
                    </p>

                    <p className="text-sm text-slate-500 mt-6 text-center">
                        Already have an account?{' '}
                        <Link href="/login" className="text-indigo-600 font-semibold hover:text-indigo-700">Sign in</Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
