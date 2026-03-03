'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { Logo } from '@/components/brand/Logo';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await api.forgotPassword(email);
            setSent(true);
        } catch (err: any) {
            setError(err.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center px-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="mb-8">
                    <Logo size="md" href="/" />
                </div>

                {sent ? (
                    // ─── Success State ───
                    <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 mb-2">Check your email</h1>
                        <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                            If <strong>{email}</strong> is registered with SkillTen,
                            you&apos;ll receive a password reset link shortly.
                        </p>
                        <p className="text-xs text-slate-400 mb-6">
                            Didn&apos;t get it? Check your spam folder, or{' '}
                            <button
                                onClick={() => { setSent(false); setEmail(''); }}
                                className="text-indigo-600 font-medium hover:text-indigo-700"
                            >
                                try again
                            </button>
                        </p>
                        <Link href="/login" className="st-btn-primary text-sm py-3 w-full inline-block text-center">
                            Back to Sign In
                        </Link>
                    </div>
                ) : (
                    // ─── Form State ───
                    <>
                        <h1 className="text-2xl font-bold text-slate-900 mb-1">Forgot your password?</h1>
                        <p className="text-slate-500 text-sm mb-6">
                            Enter your email and we&apos;ll send you a reset link.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1">Email address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    required
                                    className="st-input text-sm"
                                    autoFocus
                                />
                            </div>

                            {error && (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-red-500 text-xs bg-red-50 px-3 py-2 rounded-lg"
                                >
                                    {error}
                                </motion.p>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full st-btn-primary text-sm py-3 flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Sending...
                                    </>
                                ) : 'Send Reset Link →'}
                            </button>
                        </form>

                        <p className="text-sm text-slate-500 mt-6 text-center">
                            Remember your password?{' '}
                            <Link href="/login" className="text-indigo-600 font-semibold hover:text-indigo-700">
                                Sign in
                            </Link>
                        </p>
                    </>
                )}
            </motion.div>
        </div>
    );
}
