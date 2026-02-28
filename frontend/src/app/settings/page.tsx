'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api, auth } from '@/lib/api';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';
import { useLanguage } from '@/lib/language-context';
import { Locale } from '@/lib/i18n';

type Tab = 'profile' | 'notifications' | 'privacy' | 'appearance' | 'account';

export default function SettingsPage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saved, setSaved] = useState(false);
    const [activeTab, setActiveTab] = useState<Tab>('profile');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteText, setDeleteText] = useState('');
    const [exportLoading, setExportLoading] = useState(false);
    const [parentLink, setParentLink] = useState('');
    const { locale, setLocale } = useLanguage();

    const [form, setForm] = useState({
        display_name: '',
        username: '',
        target_role: '',
        college_name: '',
        city: '',
        mobile: '',
        bio: '',
        linkedin_url: '',
        github_url: '',
        graduation_year: '',
        stream: '',
        open_to_work: false,
    });

    const [notifications, setNotifications] = useState({
        push_achievements: true,
        push_opportunities: true,
        push_learning: false,
        push_social: true,
        email_weekly: true,
        quiet_hours: true,
    });

    const [privacy, setPrivacy] = useState({
        public_profile: true,
        recruiter_visible: true,
        show_heatmap: true,
        show_coding_stats: true,
        show_score: true,
        show_college: true,
    });

    const [appearance, setAppearance] = useState({
        theme: 'light' as 'light' | 'dark' | 'system',
        language: 'en',
        compact_mode: false,
    });

    useEffect(() => {
        if (!auth.isLoggedIn()) { window.location.href = '/login'; return; }
        api.getMe().then(u => {
            setUser(u);
            setForm({
                display_name: u?.profile?.display_name || u?.display_name || '',
                username: u?.username || '',
                target_role: u?.profile?.target_role || '',
                college_name: u?.profile?.college_name || '',
                city: u?.profile?.city || '',
                mobile: u?.profile?.mobile || '',
                bio: u?.profile?.bio || '',
                linkedin_url: u?.profile?.linkedin_url || '',
                github_url: u?.profile?.github_url || '',
                graduation_year: u?.profile?.graduation_year || '',
                stream: u?.profile?.stream || '',
                open_to_work: u?.profile?.open_to_work || false,
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

    const handleExportData = async () => {
        setExportLoading(true);
        try {
            const data = await api.getMe();
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `skillten-data-${form.username || 'export'}.json`;
            a.click();
            URL.revokeObjectURL(url);
        } catch { /* ignore */ }
        setExportLoading(false);
    };

    const handleGenerateParentLink = () => {
        const link = `${window.location.origin}/parent?child=${form.username || user?.id}`;
        setParentLink(link);
        navigator.clipboard?.writeText(link);
    };

    const handleLogout = () => {
        auth.clearToken();
        window.location.href = '/login';
    };

    const tabs: { key: Tab; icon: string; label: string }[] = [
        { key: 'profile', icon: '👤', label: 'Profile' },
        { key: 'notifications', icon: '🔔', label: 'Alerts' },
        { key: 'privacy', icon: '🔒', label: 'Privacy' },
        { key: 'appearance', icon: '🎨', label: 'Theme' },
        { key: 'account', icon: '⚙️', label: 'Account' },
    ];

    const Toggle = ({ value, onChange, disabled }: { value: boolean; onChange: () => void; disabled?: boolean }) => (
        <button onClick={onChange} disabled={disabled}
            className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${value ? 'bg-indigo-600' : 'bg-slate-300'} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
            <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${value ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
        </button>
    );

    if (loading) return (
        <div className="min-h-screen bg-slate-50">
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1 flex items-center justify-center">
                    <div className="w-12 h-12 border-3 border-slate-200 border-t-indigo-600 rounded-full animate-spin" />
                </main>
                <BottomNav />
            </div>
        </div>
    );

    const initial = (form.display_name || 'U')[0].toUpperCase();

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1 pb-24 md:pb-8">
                    {/* Header */}
                    <div className="bg-white border-b border-slate-200 px-6 py-6">
                        <div className="max-w-2xl mx-auto flex items-center gap-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg">
                                {initial}
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
                                <p className="text-sm text-slate-500">{form.display_name || 'User'} · @{form.username || 'username'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Tab Nav */}
                    <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
                        <div className="max-w-2xl mx-auto px-4">
                            <div className="flex gap-1 overflow-x-auto no-scrollbar py-2">
                                {tabs.map(t => (
                                    <button key={t.key}
                                        onClick={() => setActiveTab(t.key)}
                                        className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === t.key
                                            ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                                            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                                            }`}
                                    >
                                        <span>{t.icon}</span>{t.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="px-4 md:px-6 py-6 max-w-2xl mx-auto">
                        <AnimatePresence mode="wait">
                            {/* ═══════ PROFILE TAB ═══════ */}
                            {activeTab === 'profile' && (
                                <motion.div key="profile" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-6">
                                    <section className="st-card p-6">
                                        <h2 className="font-bold text-slate-900 mb-1">Basic Information</h2>
                                        <p className="text-xs text-slate-500 mb-5">This appears on your public profile and resume</p>
                                        <div className="space-y-4">
                                            {[
                                                { key: 'display_name', label: 'Full Name', placeholder: 'Lokesh Kumar D', icon: '👤' },
                                                { key: 'username', label: 'Username', placeholder: 'lokesh_kumar', icon: '@' },
                                                { key: 'bio', label: 'Bio', placeholder: 'Final year CSE student passionate about AI...', icon: '📝' },
                                                { key: 'target_role', label: 'Dream Role', placeholder: 'e.g. Software Engineer at Google', icon: '🎯' },
                                                { key: 'college_name', label: 'College', placeholder: 'e.g. VIT Vellore', icon: '🎓' },
                                                { key: 'graduation_year', label: 'Graduation Year', placeholder: 'e.g. 2026', icon: '📅' },
                                                { key: 'stream', label: 'Stream / Branch', placeholder: 'e.g. CSE, ECE, IT', icon: '📚' },
                                                { key: 'city', label: 'City', placeholder: 'e.g. Bangalore', icon: '📍' },
                                                { key: 'mobile', label: 'Mobile (optional)', placeholder: '+91 98765 43210', icon: '📱' },
                                            ].map(field => (
                                                <div key={field.key}>
                                                    <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase mb-1.5">
                                                        <span>{field.icon}</span>{field.label}
                                                    </label>
                                                    {field.key === 'bio' ? (
                                                        <textarea
                                                            value={(form as any)[field.key]}
                                                            onChange={e => setForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                                                            placeholder={field.placeholder}
                                                            rows={3}
                                                            className="w-full st-input resize-none"
                                                        />
                                                    ) : (
                                                        <input type="text"
                                                            value={(form as any)[field.key]}
                                                            onChange={e => setForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                                                            placeholder={field.placeholder}
                                                            className="w-full st-input"
                                                        />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </section>

                                    <section className="st-card p-6">
                                        <h2 className="font-bold text-slate-900 mb-1">Social Links</h2>
                                        <p className="text-xs text-slate-500 mb-5">Show on your public profile</p>
                                        <div className="space-y-4">
                                            {[
                                                { key: 'linkedin_url', label: 'LinkedIn', placeholder: 'https://linkedin.com/in/yourname', icon: '🔗' },
                                                { key: 'github_url', label: 'GitHub', placeholder: 'https://github.com/yourname', icon: '💻' },
                                            ].map(field => (
                                                <div key={field.key}>
                                                    <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase mb-1.5">
                                                        <span>{field.icon}</span>{field.label}
                                                    </label>
                                                    <input type="url"
                                                        value={(form as any)[field.key]}
                                                        onChange={e => setForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                                                        placeholder={field.placeholder}
                                                        className="w-full st-input"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </section>

                                    {/* Open to Work + View as Recruiter (PRO Bible 3.1) */}
                                    <section className="st-card p-6">
                                        <h2 className="font-bold text-slate-900 mb-1">Job Search Status</h2>
                                        <p className="text-xs text-slate-500 mb-4">Let recruiters know you&apos;re actively looking</p>
                                        <div className="flex items-center justify-between py-3 border-b border-slate-100">
                                            <div>
                                                <p className="text-sm font-medium text-slate-900">🟢 Open to Work</p>
                                                <p className="text-xs text-slate-500">Shows a green badge on your profile</p>
                                            </div>
                                            <Toggle
                                                value={form.open_to_work}
                                                onChange={() => setForm(prev => ({ ...prev, open_to_work: !prev.open_to_work }))}
                                            />
                                        </div>
                                        {form.username && (
                                            <a href={`/u/${form.username}`} target="_blank" rel="noopener noreferrer"
                                                className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-sm transition-colors">
                                                👁️ View as Recruiter
                                            </a>
                                        )}
                                    </section>

                                    <button onClick={handleSave} className="st-btn-primary w-full">
                                        {saved ? '✓ Changes Saved!' : 'Save Profile'}
                                    </button>
                                </motion.div>
                            )}

                            {/* ═══════ NOTIFICATIONS TAB ═══════ */}
                            {activeTab === 'notifications' && (
                                <motion.div key="notifications" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                                    <section className="st-card p-6">
                                        <h2 className="font-bold text-slate-900 mb-1">Notification Preferences</h2>
                                        <p className="text-xs text-slate-500 mb-5">We respect your attention. Only get what matters.</p>
                                        <div className="space-y-1">
                                            {[
                                                { key: 'push_achievements', label: '🏆 Achievements & Badges', desc: 'When you earn badges or reach milestones' },
                                                { key: 'push_opportunities', label: '💼 Job & Internship Matches', desc: 'When a high-match opportunity appears' },
                                                { key: 'push_learning', label: '📚 Learning Reminders', desc: 'Daily quiz and streak reminders' },
                                                { key: 'push_social', label: '🤝 Social Activity', desc: 'Connection requests and messages' },
                                                { key: 'email_weekly', label: '📧 Weekly Email Digest', desc: 'Summary of your week every Monday' },
                                                { key: 'quiet_hours', label: '🌙 Quiet Hours (10PM–8AM)', desc: 'No push notifications during sleep time' },
                                            ].map(item => (
                                                <div key={item.key} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-900">{item.label}</p>
                                                        <p className="text-xs text-slate-500">{item.desc}</p>
                                                    </div>
                                                    <Toggle
                                                        value={(notifications as any)[item.key]}
                                                        onChange={() => setNotifications(prev => ({ ...prev, [item.key]: !(prev as any)[item.key] }))}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                </motion.div>
                            )}

                            {/* ═══════ PRIVACY TAB ═══════ */}
                            {activeTab === 'privacy' && (
                                <motion.div key="privacy" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-6">
                                    <section className="st-card p-6">
                                        <h2 className="font-bold text-slate-900 mb-1">Visibility & Privacy</h2>
                                        <p className="text-xs text-slate-500 mb-5">Control what others can see on your profile</p>
                                        <div className="space-y-1">
                                            {[
                                                { key: 'public_profile', label: '🌐 Public Profile', desc: 'Allow anyone with your link to see your profile' },
                                                { key: 'recruiter_visible', label: '🔍 Recruiter Visibility', desc: 'Let recruiters find you in search results' },
                                                { key: 'show_heatmap', label: '📊 Activity Heatmap', desc: 'Display your coding activity publicly' },
                                                { key: 'show_coding_stats', label: '💻 Coding Stats', desc: 'Show problem-solving statistics' },
                                                { key: 'show_score', label: '🏅 SkillTen Score', desc: 'Display your verified score publicly' },
                                                { key: 'show_college', label: '🎓 College Name', desc: 'Show your college on public profile' },
                                            ].map(item => (
                                                <div key={item.key} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-900">{item.label}</p>
                                                        <p className="text-xs text-slate-500">{item.desc}</p>
                                                    </div>
                                                    <Toggle
                                                        value={(privacy as any)[item.key]}
                                                        onChange={() => setPrivacy(prev => ({ ...prev, [item.key]: !(prev as any)[item.key] }))}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </section>

                                    <section className="st-card p-6">
                                        <h2 className="font-bold text-slate-900 mb-4">👨‍👩‍👧 Family Access</h2>
                                        <p className="text-sm text-slate-600 mb-4">
                                            Invite your parents to see your simplified progress — no jargon, just clear milestones.
                                        </p>
                                        <button onClick={handleGenerateParentLink} className="st-btn-secondary text-sm">
                                            📤 Generate Parent Invite Link
                                        </button>
                                        {parentLink && (
                                            <div className="mt-3 bg-green-50 border border-green-200 rounded-xl p-3">
                                                <p className="text-xs text-green-700 font-medium mb-1">✓ Link copied to clipboard!</p>
                                                <p className="text-xs text-green-600 break-all font-mono">{parentLink}</p>
                                            </div>
                                        )}
                                    </section>
                                </motion.div>
                            )}

                            {/* ═══════ APPEARANCE TAB ═══════ */}
                            {activeTab === 'appearance' && (
                                <motion.div key="appearance" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-6">
                                    <section className="st-card p-6">
                                        <h2 className="font-bold text-slate-900 mb-1">Theme</h2>
                                        <p className="text-xs text-slate-500 mb-5">Customize how SkillTen looks for you</p>
                                        <div className="grid grid-cols-3 gap-3">
                                            {[
                                                { key: 'light', icon: '☀️', label: 'Light', bg: 'bg-white border-2', active: 'border-indigo-500' },
                                                { key: 'dark', icon: '🌙', label: 'Dark', bg: 'bg-slate-900 text-white border-2', active: 'border-indigo-500' },
                                                { key: 'system', icon: '💻', label: 'System', bg: 'bg-gradient-to-r from-white to-slate-900 border-2', active: 'border-indigo-500' },
                                            ].map(t => (
                                                <button key={t.key}
                                                    onClick={() => setAppearance(prev => ({ ...prev, theme: t.key as any }))}
                                                    className={`${t.bg} rounded-xl p-4 text-center transition-all ${appearance.theme === t.key ? t.active + ' shadow-md' : 'border-slate-200'}`}
                                                >
                                                    <span className="text-2xl block mb-2">{t.icon}</span>
                                                    <span className="text-xs font-semibold">{t.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </section>

                                    <section className="st-card p-6">
                                        <h2 className="font-bold text-slate-900 mb-1">Language</h2>
                                        <p className="text-xs text-slate-500 mb-4">Choose your preferred language</p>
                                        <div className="grid grid-cols-2 gap-2">
                                            {[
                                                { code: 'en', label: 'English', flag: '🇬🇧' },
                                                { code: 'hi', label: 'हिंदी', flag: '🇮🇳' },
                                                { code: 'ta', label: 'தமிழ்', flag: '🇮🇳' },
                                                { code: 'te', label: 'తెలుగు', flag: '🇮🇳' },
                                            ].map(l => (
                                                <button key={l.code}
                                                    onClick={() => { setAppearance(prev => ({ ...prev, language: l.code })); setLocale(l.code as Locale); }}
                                                    className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${appearance.language === l.code
                                                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                                                        }`}
                                                >
                                                    <span>{l.flag}</span>{l.label}
                                                </button>
                                            ))}
                                        </div>
                                    </section>

                                    <section className="st-card p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-slate-900">Compact Mode</p>
                                                <p className="text-xs text-slate-500">Reduce spacing for power users</p>
                                            </div>
                                            <Toggle
                                                value={appearance.compact_mode}
                                                onChange={() => setAppearance(prev => ({ ...prev, compact_mode: !prev.compact_mode }))}
                                            />
                                        </div>
                                    </section>
                                </motion.div>
                            )}

                            {/* ═══════ ACCOUNT TAB ═══════ */}
                            {activeTab === 'account' && (
                                <motion.div key="account" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-6">
                                    <section className="st-card p-6">
                                        <h2 className="font-bold text-slate-900 mb-1">Export Data</h2>
                                        <p className="text-xs text-slate-500 mb-4">Download all your SkillTen data as JSON. GDPR compliant.</p>
                                        <button onClick={handleExportData} disabled={exportLoading} className="st-btn-secondary text-sm">
                                            {exportLoading ? '⏳ Preparing...' : '📥 Download My Data'}
                                        </button>
                                    </section>

                                    <section className="st-card p-6">
                                        <h2 className="font-bold text-slate-900 mb-4">Session</h2>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between bg-slate-50 rounded-xl p-3">
                                                <div>
                                                    <p className="text-sm font-medium text-slate-700">Current Device</p>
                                                    <p className="text-xs text-slate-500">Web · Active now</p>
                                                </div>
                                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                            </div>
                                        </div>
                                        <button onClick={handleLogout}
                                            className="mt-4 w-full py-3 bg-white border border-red-200 text-red-600 rounded-xl font-semibold text-sm hover:bg-red-50 transition-colors">
                                            Log Out
                                        </button>
                                    </section>

                                    {/* Danger zone */}
                                    <section className="border-2 border-red-200 rounded-2xl p-6 bg-red-50/50">
                                        <h2 className="font-bold text-red-700 mb-1">⚠️ Danger Zone</h2>
                                        <p className="text-xs text-red-600/80 mb-4">This action is permanent and cannot be undone.</p>

                                        {!showDeleteConfirm ? (
                                            <button onClick={() => setShowDeleteConfirm(true)}
                                                className="text-sm font-semibold text-red-600 hover:text-red-700 underline underline-offset-2">
                                                Delete my account and all data
                                            </button>
                                        ) : (
                                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-3">
                                                <p className="text-sm text-red-700">
                                                    Type <strong>DELETE</strong> to confirm permanent deletion of your account, assessment data, coding history, and all profile information.
                                                </p>
                                                <input
                                                    type="text" value={deleteText}
                                                    onChange={e => setDeleteText(e.target.value)}
                                                    placeholder="Type DELETE"
                                                    className="w-full px-4 py-3 border-2 border-red-300 rounded-xl text-red-700 font-mono text-center focus:outline-none focus:ring-2 focus:ring-red-400"
                                                />
                                                <div className="flex gap-3">
                                                    <button onClick={() => { setShowDeleteConfirm(false); setDeleteText(''); }}
                                                        className="flex-1 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-medium text-slate-600">
                                                        Cancel
                                                    </button>
                                                    <button disabled={deleteText !== 'DELETE'}
                                                        className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${deleteText === 'DELETE'
                                                            ? 'bg-red-600 text-white hover:bg-red-700'
                                                            : 'bg-red-200 text-red-400 cursor-not-allowed'
                                                            }`}>
                                                        Delete Forever
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </section>

                                    <p className="text-center text-xs text-slate-400 pb-4">
                                        SkillTen v1.0 · <a href="/parent" className="text-indigo-500">Privacy Policy</a> · Made in India 🇮🇳
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </main>
                <BottomNav />
            </div>
        </div>
    );
}
