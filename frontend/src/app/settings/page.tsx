'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { api, auth } from '@/lib/api';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';
import { SideNav } from '@/components/layout/SideNav';

export default function SettingsPage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saved, setSaved] = useState(false);
    const [form, setForm] = useState({
        display_name: '',
        target_role: '',
        college_name: '',
        city: '',
        mobile: '',
    });
    const [notifications, setNotifications] = useState({
        push_achievements: true,
        push_opportunities: true,
        push_learning: false,
        push_social: true,
        email_weekly: true,
        quiet_hours: true,
    });

    useEffect(() => {
        if (!auth.isLoggedIn()) { window.location.href = '/login'; return; }
        api.getMe().then(u => {
            setUser(u);
            setForm({
                display_name: u?.profile?.display_name || u?.display_name || '',
                target_role: u?.profile?.target_role || '',
                college_name: u?.profile?.college_name || '',
                city: u?.profile?.city || '',
                mobile: u?.profile?.mobile || '',
            });
            setLoading(false);
        }).catch(() => { auth.clearToken(); window.location.href = '/login'; });
    }, []);

    const handleSave = async () => {
        setSaved(false);
        try {
            await api.updateProfile(form);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch { /* ignore */ }
    };

    const handleLogout = () => {
        auth.clearToken();
        window.location.href = '/login';
    };

    if (loading) return (
        <div className="flex min-h-screen bg-slate-50">
            <SideNav />
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1 flex items-center justify-center">
                    <div className="w-12 h-12 border-3 border-slate-200 border-t-indigo-600 rounded-full animate-spin" />
                </main>
                <BottomNav />
            </div>
        </div>
    );

    return (
        <div className="flex min-h-screen bg-slate-50">
            <SideNav />
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1 pb-24 md:pb-8">
                    <div className="bg-white border-b border-slate-200 px-6 py-6">
                        <h1 className="text-2xl font-bold text-slate-900">⚙️ Settings</h1>
                        <p className="text-sm text-slate-500 mt-1">Manage your profile and preferences</p>
                    </div>

                    <div className="px-4 md:px-6 py-6 max-w-2xl mx-auto space-y-6">

                        {/* Profile Section */}
                        <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                            className="st-card p-6"
                        >
                            <h2 className="font-bold text-slate-900 mb-4">👤 Profile</h2>
                            <div className="space-y-4">
                                {[
                                    { key: 'display_name', label: 'Display Name', placeholder: 'Your name' },
                                    { key: 'target_role', label: 'Target Role', placeholder: 'e.g. Software Engineer' },
                                    { key: 'college_name', label: 'College', placeholder: 'e.g. VIT Vellore' },
                                    { key: 'city', label: 'City', placeholder: 'e.g. Bangalore' },
                                    { key: 'mobile', label: 'Mobile (optional)', placeholder: '+91 ...' },
                                ].map(field => (
                                    <div key={field.key}>
                                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">{field.label}</label>
                                        <input
                                            type="text"
                                            value={(form as any)[field.key]}
                                            onChange={e => setForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                                            placeholder={field.placeholder}
                                            className="w-full st-input"
                                        />
                                    </div>
                                ))}
                            </div>
                            <button onClick={handleSave} className="mt-6 st-btn-primary w-full">
                                {saved ? '✓ Saved!' : 'Save Changes'}
                            </button>
                        </motion.section>

                        {/* Notifications */}
                        <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                            className="st-card p-6"
                        >
                            <h2 className="font-bold text-slate-900 mb-4">🔔 Notifications</h2>
                            <p className="text-xs text-slate-500 mb-4">Control what you receive. We respect your attention.</p>
                            <div className="space-y-3">
                                {[
                                    { key: 'push_achievements', label: 'Achievement & Badge alerts', desc: 'When you earn badges or reach milestones' },
                                    { key: 'push_opportunities', label: 'Job & Internship matches', desc: 'When a high-match opportunity appears' },
                                    { key: 'push_learning', label: 'Learning reminders', desc: 'Daily quiz and streak reminders' },
                                    { key: 'push_social', label: 'Social activity', desc: 'Connection requests and messages' },
                                    { key: 'email_weekly', label: 'Weekly email digest', desc: 'Summary of your week every Monday' },
                                    { key: 'quiet_hours', label: 'Quiet hours (10PM–8AM)', desc: 'No push notifications during sleep time' },
                                ].map(item => (
                                    <div key={item.key} className="flex items-center justify-between py-2">
                                        <div>
                                            <p className="text-sm font-medium text-slate-900">{item.label}</p>
                                            <p className="text-xs text-slate-500">{item.desc}</p>
                                        </div>
                                        <button
                                            onClick={() => setNotifications(prev => ({ ...prev, [item.key]: !(prev as any)[item.key] }))}
                                            className={`w-11 h-6 rounded-full transition-colors relative ${(notifications as any)[item.key] ? 'bg-indigo-600' : 'bg-slate-300'}`}
                                        >
                                            <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${(notifications as any)[item.key] ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </motion.section>

                        {/* Privacy */}
                        <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                            className="st-card p-6"
                        >
                            <h2 className="font-bold text-slate-900 mb-4">🔒 Privacy</h2>
                            <div className="space-y-3">
                                {[
                                    { label: 'Public Profile', desc: 'Allow anyone with your link to see your profile' },
                                    { label: 'Recruiter Visibility', desc: 'Let recruiters find you in search results' },
                                    { label: 'Show Activity Heatmap', desc: 'Display your coding activity on your public profile' },
                                    { label: 'Show Coding Stats', desc: 'Display problem-solving stats publicly' },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between py-2">
                                        <div>
                                            <p className="text-sm font-medium text-slate-900">{item.label}</p>
                                            <p className="text-xs text-slate-500">{item.desc}</p>
                                        </div>
                                        <div className="w-11 h-6 bg-indigo-600 rounded-full relative cursor-pointer">
                                            <span className="absolute top-0.5 translate-x-[22px] w-5 h-5 bg-white rounded-full shadow" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.section>

                        {/* Family (Bible XF-10) */}
                        <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                            className="st-card p-6"
                        >
                            <h2 className="font-bold text-slate-900 mb-4">👨‍👩‍👧 Family</h2>
                            <p className="text-sm text-slate-600 mb-4">
                                Invite your parents to see your progress. They&apos;ll see a simplified view — no jargon, just clear progress.
                            </p>
                            <button className="st-btn-secondary text-sm">
                                📤 Generate Parent Invite Link
                            </button>
                        </motion.section>

                        {/* Account Actions */}
                        <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                            className="space-y-3"
                        >
                            <button onClick={handleLogout}
                                className="w-full py-3 bg-white border border-red-200 text-red-600 rounded-xl font-semibold text-sm hover:bg-red-50 transition-colors">
                                Log Out
                            </button>
                            <p className="text-center text-xs text-slate-400">
                                SkillTen v1.0 · <a href="/parent" className="text-indigo-500">Privacy Policy</a> · Made in India 🇮🇳
                            </p>
                        </motion.section>

                    </div>
                </main>
                <BottomNav />
            </div>
        </div>
    );
}
