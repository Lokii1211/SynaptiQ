'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { api, auth } from '@/lib/api';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';
import { SideNav } from '@/components/layout/SideNav';

export default function OnboardingPage() {
    const [step, setStep] = useState(0);
    const [form, setForm] = useState({
        college_name: '', year: '', branch: '', target_role: '', city: ''
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!auth.isLoggedIn()) { window.location.href = '/login'; return; }
    }, []);

    const steps = [
        {
            title: 'Welcome to SkillTen! 🎉',
            desc: 'Let\'s set up your profile in 30 seconds',
            fields: ['college_name', 'year'],
        },
        {
            title: 'What are you studying?',
            desc: 'This helps us personalize your career recommendations',
            fields: ['branch', 'city'],
        },
        {
            title: 'Dream Role',
            desc: 'What career are you most interested in?',
            fields: ['target_role'],
        },
    ];

    const handleFinish = async () => {
        setSaving(true);
        try {
            await api.updateProfile(form);
            window.location.href = '/assessment';
        } catch {
            window.location.href = '/dashboard';
        }
    };

    const currentStep = steps[step];

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
                {/* Progress */}
                <div className="flex gap-1.5 mb-6">
                    {steps.map((_, i) => (
                        <div key={i} className="flex-1 h-1.5 rounded-full overflow-hidden bg-slate-100">
                            <div className={`h-full rounded-full transition-all duration-500 ${i <= step ? 'bg-indigo-600' : ''}`}
                                style={{ width: i <= step ? '100%' : '0%' }} />
                        </div>
                    ))}
                </div>

                <h2 className="text-xl font-bold text-slate-900 mb-1">{currentStep.title}</h2>
                <p className="text-sm text-slate-500 mb-6">{currentStep.desc}</p>

                <div className="space-y-4 mb-6">
                    {currentStep.fields.includes('college_name') && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">College</label>
                            <input type="text" className="st-input" placeholder="e.g., VIT Vellore"
                                value={form.college_name} onChange={e => setForm(f => ({ ...f, college_name: e.target.value }))} />
                        </div>
                    )}
                    {currentStep.fields.includes('year') && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Year</label>
                            <select className="st-input" value={form.year}
                                onChange={e => setForm(f => ({ ...f, year: e.target.value }))}>
                                <option value="">Select year</option>
                                <option value="1st">1st Year</option>
                                <option value="2nd">2nd Year</option>
                                <option value="3rd">3rd Year</option>
                                <option value="4th">4th Year</option>
                                <option value="passout">Passout</option>
                            </select>
                        </div>
                    )}
                    {currentStep.fields.includes('branch') && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Branch / Major</label>
                            <input type="text" className="st-input" placeholder="e.g., Computer Science"
                                value={form.branch} onChange={e => setForm(f => ({ ...f, branch: e.target.value }))} />
                        </div>
                    )}
                    {currentStep.fields.includes('city') && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">City</label>
                            <input type="text" className="st-input" placeholder="e.g., Bangalore"
                                value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} />
                        </div>
                    )}
                    {currentStep.fields.includes('target_role') && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Dream Role</label>
                            <div className="grid grid-cols-2 gap-2">
                                {['Software Engineer', 'Data Scientist', 'Product Manager', 'UI/UX Designer', 'DevOps Engineer', 'Other'].map(role => (
                                    <button key={role} onClick={() => setForm(f => ({ ...f, target_role: role }))}
                                        className={`p-3 rounded-xl text-sm font-medium border transition-all ${form.target_role === role
                                                ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                                                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                            }`}>{role}</button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex gap-3">
                    {step > 0 && (
                        <button onClick={() => setStep(s => s - 1)} className="st-btn-secondary flex-1">Back</button>
                    )}
                    {step < steps.length - 1 ? (
                        <button onClick={() => setStep(s => s + 1)} className="st-btn-primary flex-1">Continue →</button>
                    ) : (
                        <button onClick={handleFinish} disabled={saving} className="st-btn-primary flex-1 flex items-center justify-center gap-2">
                            {saving ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</> : 'Let\'s Go! 🚀'}
                        </button>
                    )}
                </div>

                <button onClick={() => { window.location.href = '/dashboard'; }}
                    className="text-xs text-slate-400 hover:text-slate-600 mt-4 block text-center w-full">
                    Skip for now
                </button>
            </motion.div>
        </div>
    );
}
