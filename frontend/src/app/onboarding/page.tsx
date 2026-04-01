'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api, auth } from '@/lib/api';
import { useAuthGuard } from '@/hooks/useAuthGuard';

interface StepConfig {
    title: string;
    subtitle: string;
    emoji: string;
}

const STEPS: StepConfig[] = [
    { title: 'Welcome to Mentixy! 🎉', subtitle: 'Let\'s personalize your career journey in 60 seconds', emoji: '👋' },
    { title: 'About You', subtitle: 'Tell us about your academic background', emoji: '🎓' },
    { title: 'Your Interests', subtitle: 'What excites you? This helps our AI match careers.', emoji: '💡' },
    { title: 'Dream Career', subtitle: 'Where do you see yourself?', emoji: '🚀' },
    { title: 'Almost Ready!', subtitle: 'One last thing...', emoji: '✨' },
];

const BRANCHES = [
    'Computer Science', 'Information Technology', 'Electronics & Comm.', 'Electrical',
    'Mechanical', 'Civil', 'Chemical', 'Biotechnology', 'AI & Data Science', 'Other',
];

const INTERESTS = [
    { label: 'Coding & Building', icon: '💻', value: 'coding' },
    { label: 'Data & Analytics', icon: '📊', value: 'data' },
    { label: 'Design & UX', icon: '🎨', value: 'design' },
    { label: 'AI & Machine Learning', icon: '🤖', value: 'ai_ml' },
    { label: 'Business & Strategy', icon: '📈', value: 'business' },
    { label: 'Cloud & DevOps', icon: '☁️', value: 'devops' },
    { label: 'Cybersecurity', icon: '🔐', value: 'security' },
    { label: 'Product Management', icon: '🎯', value: 'product' },
];

const TARGET_ROLES = [
    'Software Engineer', 'Data Scientist', 'Product Manager', 'UI/UX Designer',
    'DevOps Engineer', 'Full Stack Developer', 'AI/ML Engineer', 'Backend Developer',
    'System Analyst', 'Business Analyst', 'Cybersecurity Analyst', 'Not Sure Yet',
];

const EXPERIENCE_LEVELS = [
    { label: 'Complete Beginner', icon: '🌱', desc: 'Just starting out' },
    { label: 'Some Projects', icon: '🌿', desc: 'Built a few things' },
    { label: 'Intermediate', icon: '🌳', desc: 'Regular practice' },
    { label: 'Advanced', icon: '🏔️', desc: 'Ready for placements' },
];

export default function OnboardingPage() {
    const [step, setStep] = useState(0);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        college_name: '',
        year: '',
        branch: '',
        city: '',
        target_role: '',
        interests: [] as string[],
        experience_level: '',
    });

    useEffect(() => {
    }, []);

    const toggleInterest = (val: string) => {
        setForm(f => ({
            ...f,
            interests: f.interests.includes(val)
                ? f.interests.filter(i => i !== val)
                : [...f.interests, val].slice(0, 4),
        }));
    };

    const handleFinish = async () => {
        setSaving(true);
        try {
            await api.updateProfile({
                college_name: form.college_name,
                stream: form.branch,
                target_role: form.target_role,
                city: form.city,
            });
            window.location.href = '/assessment';
        } catch {
            window.location.href = '/dashboard';
        }
    };

    const canAdvance = () => {
        if (step === 1) return form.college_name && form.year;
        if (step === 2) return form.interests.length >= 1;
        if (step === 3) return form.target_role;
        if (step === 4) return form.experience_level;
        return true;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
            >
                {/* Progress bar */}
                <div className="h-1.5 bg-slate-100">
                    <motion.div
                        className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
                        animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>

                <div className="p-8">
                    {/* Step indicator */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex gap-1.5">
                            {STEPS.map((_, i) => (
                                <div key={i} className={`w-2.5 h-2.5 rounded-full transition-all ${i <= step ? 'bg-indigo-600 scale-100' : 'bg-slate-200 scale-75'}`} />
                            ))}
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium">{step + 1} of {STEPS.length}</span>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                        >
                            <span className="text-3xl block mb-3">{STEPS[step].emoji}</span>
                            <h2 className="text-xl font-bold text-slate-900 mb-1">{STEPS[step].title}</h2>
                            <p className="text-sm text-slate-500 mb-6">{STEPS[step].subtitle}</p>

                            {/* Step 0: Welcome */}
                            {step === 0 && (
                                <div className="space-y-4">
                                    <div className="bg-indigo-50 rounded-2xl p-5 text-center">
                                        <p className="text-sm text-indigo-700 leading-relaxed">
                                            Mentixy uses AI to discover your <strong>Career DNA</strong> — your unique strengths,
                                            perfect career matches, and a personalized roadmap to get there.
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 text-center">
                                        {[
                                            { num: '25 min', label: 'Assessment' },
                                            { num: 'AI', label: 'Powered' },
                                            { num: 'Free', label: 'Forever' },
                                        ].map(s => (
                                            <div key={s.label} className="bg-slate-50 rounded-xl p-3">
                                                <p className="text-sm font-bold text-slate-900">{s.num}</p>
                                                <p className="text-[10px] text-slate-500">{s.label}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Step 1: Academic Info */}
                            {step === 1 && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">College</label>
                                        <input type="text" className="st-input" placeholder="e.g., VIT Vellore"
                                            value={form.college_name} onChange={e => setForm(f => ({ ...f, college_name: e.target.value }))} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Year of Study</label>
                                        <div className="grid grid-cols-5 gap-1.5">
                                            {['1st', '2nd', '3rd', '4th', 'Pass'].map(y => (
                                                <button key={y} onClick={() => setForm(f => ({ ...f, year: y }))}
                                                    className={`py-2.5 rounded-xl text-xs font-semibold transition-all ${form.year === y
                                                        ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                                        }`}>{y}</button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Branch</label>
                                        <div className="grid grid-cols-2 gap-1.5 max-h-40 overflow-y-auto">
                                            {BRANCHES.map(b => (
                                                <button key={b} onClick={() => setForm(f => ({ ...f, branch: b }))}
                                                    className={`py-2 px-3 rounded-xl text-xs font-medium text-left transition-all ${form.branch === b
                                                        ? 'bg-indigo-50 border-2 border-indigo-500 text-indigo-700' : 'bg-white border-2 border-slate-100 text-slate-600 hover:border-slate-200'
                                                        }`}>{b}</button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Interests */}
                            {step === 2 && (
                                <div>
                                    <p className="text-[10px] text-slate-400 mb-3 uppercase font-semibold">Select up to 4</p>
                                    <div className="grid grid-cols-2 gap-2">
                                        {INTERESTS.map(interest => (
                                            <button key={interest.value}
                                                onClick={() => toggleInterest(interest.value)}
                                                className={`flex items-center gap-2 px-3 py-3 rounded-xl text-sm font-medium transition-all ${form.interests.includes(interest.value)
                                                    ? 'bg-indigo-50 border-2 border-indigo-500 text-indigo-700'
                                                    : 'bg-white border-2 border-slate-100 text-slate-600 hover:border-slate-200'
                                                    }`}>
                                                <span>{interest.icon}</span>
                                                <span className="text-xs">{interest.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Target Role */}
                            {step === 3 && (
                                <div className="grid grid-cols-2 gap-2">
                                    {TARGET_ROLES.map(role => (
                                        <button key={role}
                                            onClick={() => setForm(f => ({ ...f, target_role: role }))}
                                            className={`p-3 rounded-xl text-xs font-medium transition-all text-left ${form.target_role === role
                                                ? 'bg-indigo-50 border-2 border-indigo-500 text-indigo-700'
                                                : 'bg-white border-2 border-slate-100 text-slate-600 hover:border-slate-200'
                                                }`}>{role}</button>
                                    ))}
                                </div>
                            )}

                            {/* Step 4: Experience Level */}
                            {step === 4 && (
                                <div className="space-y-2">
                                    {EXPERIENCE_LEVELS.map(level => (
                                        <button key={level.label}
                                            onClick={() => setForm(f => ({ ...f, experience_level: level.label }))}
                                            className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all text-left ${form.experience_level === level.label
                                                ? 'bg-indigo-50 border-2 border-indigo-500'
                                                : 'bg-white border-2 border-slate-100 hover:border-slate-200'
                                                }`}>
                                            <span className="text-2xl">{level.icon}</span>
                                            <div>
                                                <p className={`text-sm font-semibold ${form.experience_level === level.label ? 'text-indigo-700' : 'text-slate-900'}`}>{level.label}</p>
                                                <p className="text-xs text-slate-500">{level.desc}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation */}
                    <div className="flex gap-3 mt-6">
                        {step > 0 && (
                            <button onClick={() => setStep(s => s - 1)}
                                className="flex-1 st-btn-secondary text-sm py-3">← Back</button>
                        )}
                        {step < STEPS.length - 1 ? (
                            <button onClick={() => setStep(s => s + 1)}
                                disabled={!canAdvance()}
                                className="flex-1 st-btn-primary text-sm py-3 disabled:opacity-50 disabled:cursor-not-allowed">
                                Continue →
                            </button>
                        ) : (
                            <button onClick={handleFinish} disabled={saving || !canAdvance()}
                                className="flex-1 st-btn-primary text-sm py-3 flex items-center justify-center gap-2 disabled:opacity-50">
                                {saving ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Setting up...</> : 'Start My Journey 🚀'}
                            </button>
                        )}
                    </div>

                    <button onClick={() => { window.location.href = '/dashboard'; }}
                        className="text-[10px] text-slate-400 hover:text-slate-600 mt-4 block text-center w-full transition-colors">
                        Skip for now
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
