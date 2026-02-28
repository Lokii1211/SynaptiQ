'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

/* ─── Paywall Triggers (Bible Phase 8) ───
 * Shows at 5 specific moments:
 * 1. Solution reveal (3rd problem)
 * 2. 4th aptitude test in a day
 * 3. AI Code Review (after 2 free uses)
 * 4. Downloading resume PDF
 * 5. Viewing detailed company prep guide
 */

interface PaywallTriggerProps {
    trigger: 'solution' | 'aptitude' | 'ai-review' | 'resume-pdf' | 'company-prep';
    onClose: () => void;
    onContinueFree?: () => void;
}

const TRIGGER_CONFIG: Record<string, { title: string; subtitle: string; freeLimit: string; proFeature: string; icon: string; gradient: string }> = {
    solution: {
        title: 'Unlock Full Solutions',
        subtitle: 'You\'ve used 3 free solution reveals today',
        freeLimit: '3 solutions/day',
        proFeature: 'Unlimited solutions in 8 languages with step-by-step explanations',
        icon: '💡',
        gradient: 'from-indigo-600 to-violet-700',
    },
    aptitude: {
        title: 'More Practice Awaits',
        subtitle: 'Free users get 3 aptitude tests per day',
        freeLimit: '3 tests/day',
        proFeature: 'Unlimited tests, adaptive difficulty, and spaced repetition scheduling',
        icon: '🧠',
        gradient: 'from-teal-600 to-cyan-700',
    },
    'ai-review': {
        title: 'AI Code Review Pro',
        subtitle: 'You\'ve used 2 free AI reviews today',
        freeLimit: '2 reviews/day',
        proFeature: 'Unlimited AI reviews with optimization suggestions and complexity analysis',
        icon: '🤖',
        gradient: 'from-emerald-600 to-green-700',
    },
    'resume-pdf': {
        title: 'Download Resume PDF',
        subtitle: 'PDF downloads require Pro',
        freeLimit: 'Online preview only',
        proFeature: 'ATS-optimized PDF export with 4 premium templates and custom branding',
        icon: '📄',
        gradient: 'from-pink-600 to-rose-700',
    },
    'company-prep': {
        title: 'Complete Company Intel',
        subtitle: 'Deep company guides are Pro-only',
        freeLimit: 'Basic company info',
        proFeature: 'Full interview patterns, salary data, past questions, and hiring timeline',
        icon: '🏢',
        gradient: 'from-amber-600 to-orange-700',
    },
};

export function PaywallTrigger({ trigger, onClose, onContinueFree }: PaywallTriggerProps) {
    const config = TRIGGER_CONFIG[trigger];
    if (!config) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center p-0 md:p-4"
                onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
            >
                <motion.div
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="bg-white rounded-t-3xl md:rounded-2xl w-full md:max-w-md shadow-2xl overflow-hidden"
                >
                    {/* Gradient Header */}
                    <div className={`bg-gradient-to-br ${config.gradient} px-6 py-8 text-white text-center relative overflow-hidden`}>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
                        <span className="text-4xl block mb-3">{config.icon}</span>
                        <h2 className="text-xl font-bold mb-1">{config.title}</h2>
                        <p className="text-sm text-white/70">{config.subtitle}</p>
                    </div>

                    <div className="px-6 py-6 space-y-5">
                        {/* Comparison */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-slate-50 rounded-xl p-4 text-center">
                                <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Free Plan</p>
                                <p className="text-xs text-slate-600 font-medium">{config.freeLimit}</p>
                            </div>
                            <div className="bg-indigo-50 rounded-xl p-4 text-center border border-indigo-200">
                                <p className="text-[10px] text-indigo-500 uppercase font-bold mb-1">Pro Plan</p>
                                <p className="text-xs text-indigo-700 font-medium">Unlimited</p>
                            </div>
                        </div>

                        {/* Pro Feature */}
                        <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-indigo-50 to-violet-50 rounded-xl border border-indigo-100">
                            <span className="text-lg mt-0.5">✨</span>
                            <p className="text-xs text-indigo-700 leading-relaxed">{config.proFeature}</p>
                        </div>

                        {/* Pro Benefits */}
                        <div className="space-y-2">
                            {[
                                '💻 Unlimited AI Code Reviews',
                                '🧠 Unlimited Aptitude Tests',
                                '💡 All Solutions in 8 Languages',
                                '📄 ATS Resume PDF Export',
                                '🏢 Full Company Intel Access',
                                '🔴 Priority Support',
                            ].map((b, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <span className="text-emerald-500 text-xs">✓</span>
                                    <span className="text-xs text-slate-600">{b}</span>
                                </div>
                            ))}
                        </div>

                        {/* CTA */}
                        <div className="space-y-2">
                            <Link href="/pricing"
                                className="block w-full text-center bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-sm py-3.5 rounded-xl transition-all shadow-lg hover:shadow-xl">
                                Upgrade to Pro — ₹149/month →
                            </Link>
                            {onContinueFree && (
                                <button onClick={onContinueFree}
                                    className="block w-full text-center text-xs text-slate-400 hover:text-slate-600 py-2 font-medium">
                                    Continue with Free (limited)
                                </button>
                            )}
                            <button onClick={onClose}
                                className="block w-full text-center text-xs text-slate-300 hover:text-slate-500 py-1">
                                Maybe later
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

/* ─── Notification Intelligence Rules (Bible Phase 8) ───
 * Smart notification system that learns from user behavior
 */
export const NOTIFICATION_RULES = {
    streakRisk: {
        // Trigger streak risk notification 2 hours before midnight if user hasn't practiced
        condition: (lastActivity: Date) => {
            const now = new Date();
            const hoursTillMidnight = 24 - now.getHours();
            const hoursSinceActivity = (now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60);
            return hoursTillMidnight <= 2 && hoursSinceActivity > 12;
        },
        title: '🔥 Streak at Risk!',
        body: 'You haven\'t practiced today. Solve 1 problem to maintain your streak.',
        priority: 'high',
    },
    weeklyDigest: {
        // Weekly performance summary every Sunday at 6pm
        condition: () => {
            const now = new Date();
            return now.getDay() === 0 && now.getHours() === 18;
        },
        title: '📊 Weekly Progress Report',
        body: 'See your performance summary and improvement areas.',
        priority: 'medium',
    },
    skillExpiry: {
        // Notify when skill verification expires in 7 days
        condition: (expiryDate: Date) => {
            const daysUntilExpiry = (expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
            return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
        },
        title: '⚠️ Skill Expiring Soon',
        body: 'Your Python verification expires in 5 days. Re-verify to maintain your score.',
        priority: 'high',
    },
    campusDrive: {
        // Notify 3 days before campus drive registration deadline
        condition: (deadlineDate: Date) => {
            const daysUntilDeadline = (deadlineDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
            return daysUntilDeadline <= 3 && daysUntilDeadline > 0;
        },
        title: '📅 Drive Registration Closing',
        body: 'TCS NQT registration closes in 3 days. Register now!',
        priority: 'high',
    },
    optimalTiming: {
        // Learn user's peak activity hours and send notifications then
        getOptimalHour: (activityHistory: number[]) => {
            // Find most active hour from history
            const hourCounts = new Array(24).fill(0);
            activityHistory.forEach(h => hourCounts[h]++);
            return hourCounts.indexOf(Math.max(...hourCounts));
        },
    },
};

/* ─── Error Type Classification (Bible Phase 1) ───
 * Categorize compiler errors into actionable types
 */
export function classifyError(error: string): { type: string; badge: string; badgeColor: string; aiTip: string } {
    const e = error.toLowerCase();

    if (e.includes('time limit') || e.includes('tle') || e.includes('timed out')) {
        return {
            type: 'TLE',
            badge: '⏱ Time Limit Exceeded',
            badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
            aiTip: 'Your solution is too slow. Consider using a more efficient algorithm (HashMap, Binary Search, or Two Pointers). Check for unnecessary nested loops.',
        };
    }
    if (e.includes('memory limit') || e.includes('mle')) {
        return {
            type: 'MLE',
            badge: '💾 Memory Limit Exceeded',
            badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
            aiTip: 'You\'re using too much memory. Reduce array sizes, use generators instead of lists, or try an in-place algorithm.',
        };
    }
    if (e.includes('runtime') || e.includes('exception') || e.includes('error at line') || e.includes('traceback')) {
        return {
            type: 'RE',
            badge: '💥 Runtime Error',
            badgeColor: 'bg-red-50 text-red-600 border-red-200',
            aiTip: 'Your code crashed during execution. Check for: array index out of bounds, null pointer access, division by zero, or stack overflow in recursion.',
        };
    }
    if (e.includes('syntax') || e.includes('compilation') || e.includes('compile') || e.includes('parse error') || e.includes('unexpected token')) {
        return {
            type: 'CE',
            badge: '🔴 Compilation Error',
            badgeColor: 'bg-rose-50 text-rose-600 border-rose-200',
            aiTip: 'Your code has a syntax error and won\'t compile. Check for missing brackets, semicolons, or typos in variable names.',
        };
    }
    if (e.includes('wrong answer') || e.includes('wa') || e.includes('expected') || e.includes('does not match')) {
        return {
            type: 'WA',
            badge: '❌ Wrong Answer',
            badgeColor: 'bg-orange-50 text-orange-600 border-orange-200',
            aiTip: 'Your code runs but gives incorrect output. Re-read the problem constraints, check edge cases (empty input, single element, large numbers).',
        };
    }

    return {
        type: 'ERROR',
        badge: '⚠️ Error',
        badgeColor: 'bg-slate-100 text-slate-600 border-slate-200',
        aiTip: 'Check your code for logical errors. Verify input parsing and output format.',
    };
}
