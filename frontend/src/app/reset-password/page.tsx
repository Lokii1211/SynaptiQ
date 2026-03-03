'use client';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { Logo } from '@/components/brand/Logo';

function ResetPasswordContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token') || '';

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            await api.resetPassword(token, password);
            setSuccess(true);
        } catch (err: any) {
            setError(err.message || 'Failed to reset password. The link may have expired.');
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">⚠️</span>
                </div>
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Invalid Reset Link</h1>
                <p className="text-slate-500 text-sm mb-6">
                    This password reset link is invalid or has expired.
                </p>
                <Link href="/forgot-password" className="st-btn-primary text-sm py-3 w-full inline-block text-center">
                    Request New Link
                </Link>
            </div>
        );
    }

    return (
        <>
            {success ? (
                <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Password Reset!</h1>
                    <p className="text-slate-500 text-sm mb-6">
                        Your password has been updated successfully.
                    </p>
                    <Link href="/login" className="st-btn-primary text-sm py-3 w-full inline-block text-center">
                        Sign In with New Password →
                    </Link>
                </div>
            ) : (
                <>
                    <h1 className="text-2xl font-bold text-slate-900 mb-1">Set new password</h1>
                    <p className="text-slate-500 text-sm mb-6">
                        Choose a strong password with at least 6 characters.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">New Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                    className="st-input text-sm pr-10"
                                    autoFocus
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                                >
                                    {showPassword ? '🙈' : '👁️'}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">Confirm Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                minLength={6}
                                className="st-input text-sm"
                            />
                        </div>

                        {/* Password strength indicator */}
                        <div className="flex gap-1">
                            {[1, 2, 3, 4].map((i) => (
                                <div
                                    key={i}
                                    className={`h-1 flex-1 rounded-full transition-all ${password.length >= i * 3
                                            ? password.length >= 12 ? 'bg-green-500' : password.length >= 8 ? 'bg-yellow-500' : 'bg-red-400'
                                            : 'bg-slate-200'
                                        }`}
                                />
                            ))}
                        </div>
                        <p className="text-xs text-slate-400">
                            {password.length === 0
                                ? 'Enter a password'
                                : password.length < 6
                                    ? 'Too short'
                                    : password.length < 8
                                        ? 'Fair'
                                        : password.length < 12
                                            ? 'Good'
                                            : 'Strong! 💪'}
                        </p>

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
                                    Resetting...
                                </>
                            ) : 'Reset Password →'}
                        </button>
                    </form>
                </>
            )}
        </>
    );
}


export default function ResetPasswordPage() {
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
                <Suspense fallback={
                    <div className="text-center py-12">
                        <span className="w-8 h-8 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin inline-block" />
                    </div>
                }>
                    <ResetPasswordContent />
                </Suspense>
            </motion.div>
        </div>
    );
}
