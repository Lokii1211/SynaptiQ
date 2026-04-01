'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';

interface NotifRule {
    id: string;
    icon: string;
    title: string;
    description: string;
    urgency: 'high' | 'medium' | 'low';
    enabled: boolean;
    example: string;
}

const RULES: NotifRule[] = [
    {
        id: 'streak_risk', icon: '🔥', title: 'Streak at Risk', description: 'Alert when your coding streak is about to break (2 hours before midnight)',
        urgency: 'high', enabled: true, example: '⚠️ Your 47-day streak ends in 2 hours. Solve one problem.'
    },
    {
        id: 'skill_expiry', icon: '⏰', title: 'Skill Expiry', description: 'Reminders when verified skills are about to expire (7 days, 3 days, 1 day before)',
        urgency: 'high', enabled: true, example: 'Your Python skill expires in 7 days. Renew in 20 minutes.'
    },
    {
        id: 'peer_placement', icon: '🎉', title: 'Peer Milestones', description: 'When connections from your college get placed or achieve milestones',
        urgency: 'medium', enabled: true, example: 'Priya from your college just got placed at Amazon! See their journey.'
    },
    {
        id: 'contest', icon: '🏆', title: 'Contest Starting', description: 'Reminder 1 hour before contests you\'ve registered for',
        urgency: 'medium', enabled: true, example: 'Mentixy Weekly Contest starts in 1 hour. You\'re registered.'
    },
    {
        id: 'campus_wars', icon: '📈', title: 'Campus Wars Movement', description: 'When your college\'s rank changes by 2+ positions',
        urgency: 'medium', enabled: true, example: 'Your college moved from #7 to #5 in Campus Wars!'
    },
    {
        id: 'connection_activity', icon: '💡', title: 'Connection Activity', description: 'When a connection solves a problem you bookmarked or attempted',
        urgency: 'low', enabled: false, example: 'Arjun solved a problem you bookmarked. See their approach.'
    },
    {
        id: 'ai_checkin', icon: '🤖', title: 'AI Counselor Check-in', description: 'Re-engagement after 7 days of not using AI career counselor',
        urgency: 'low', enabled: true, example: 'Haven\'t chatted in a while. I have an update on Data Analyst market.'
    },
    {
        id: 'recruiter_view', icon: '👀', title: 'Recruiter View', description: 'Instant alert when a recruiter views your profile',
        urgency: 'high', enabled: true, example: 'A recruiter from Bangalore viewed your profile today.'
    },
];

export default function NotificationSettingsPage() {
    const [rules, setRules] = useState<NotifRule[]>(RULES);
    const [masterToggle, setMasterToggle] = useState(true);
    const [quietStart, setQuietStart] = useState('23:00');
    const [quietEnd, setQuietEnd] = useState('07:00');
    const [digest, setDigest] = useState<'realtime' | 'batched' | 'daily'>('realtime');
    const [maxPerDay, setMaxPerDay] = useState(5);

    useEffect(() => {
    }, []);

    const toggleRule = (id: string) => {
        setRules(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
    };

    const urgencyColor = (u: string) => u === 'high' ? 'bg-red-50 text-red-600 border-red-200' : u === 'medium' ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-slate-50 text-slate-500 border-slate-200';

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1 pb-24 md:pb-8">
                    <div className="bg-white border-b border-slate-200 px-6 py-6">
                        <div className="max-w-2xl mx-auto">
                            <h1 className="text-xl font-bold text-slate-900 mb-1 st-font-heading">🔔 Notification Intelligence</h1>
                            <p className="text-sm text-slate-500">Smart notifications that know when to alert and when to stay silent</p>
                        </div>
                    </div>

                    <div className="px-4 md:px-6 py-6 max-w-2xl mx-auto space-y-6">
                        {/* Master Toggle */}
                        <div className="st-card p-5 flex items-center justify-between">
                            <div>
                                <p className="font-semibold text-sm text-slate-900">Master Toggle</p>
                                <p className="text-xs text-slate-500">Enable or disable all notifications</p>
                            </div>
                            <button onClick={() => setMasterToggle(!masterToggle)}
                                className={`w-12 h-7 rounded-full transition-colors relative ${masterToggle ? 'bg-indigo-600' : 'bg-slate-300'}`}>
                                <span className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${masterToggle ? 'left-6' : 'left-1'}`} />
                            </button>
                        </div>

                        {/* Delivery Mode */}
                        <div className="st-card p-5">
                            <p className="font-semibold text-sm text-slate-900 mb-3">📬 Delivery Mode</p>
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { key: 'realtime' as const, label: 'Real-time', desc: 'Instant alerts' },
                                    { key: 'batched' as const, label: 'Batched', desc: 'Every 3 hours' },
                                    { key: 'daily' as const, label: 'Daily Digest', desc: 'One summary/day' },
                                ].map(d => (
                                    <button key={d.key} onClick={() => setDigest(d.key)}
                                        className={`p-3 rounded-xl text-center transition-all border ${digest === d.key ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-200 text-slate-600'}`}>
                                        <p className="text-xs font-semibold">{d.label}</p>
                                        <p className="text-[10px] mt-0.5 opacity-60">{d.desc}</p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Quiet Hours */}
                        <div className="st-card p-5">
                            <p className="font-semibold text-sm text-slate-900 mb-1">🌙 Quiet Hours</p>
                            <p className="text-xs text-slate-500 mb-3">No notifications during these hours (except streak-at-risk if enabled)</p>
                            <div className="flex items-center gap-3">
                                <input type="time" value={quietStart} onChange={e => setQuietStart(e.target.value)}
                                    className="st-input text-sm w-32" />
                                <span className="text-sm text-slate-400">to</span>
                                <input type="time" value={quietEnd} onChange={e => setQuietEnd(e.target.value)}
                                    className="st-input text-sm w-32" />
                            </div>
                        </div>

                        {/* Max per day */}
                        <div className="st-card p-5">
                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <p className="font-semibold text-sm text-slate-900">📊 Daily Limit</p>
                                    <p className="text-xs text-slate-500">Maximum notifications per day</p>
                                </div>
                                <span className="text-lg font-bold text-indigo-600">{maxPerDay}</span>
                            </div>
                            <input type="range" min={1} max={10} value={maxPerDay} onChange={e => setMaxPerDay(+e.target.value)}
                                className="w-full accent-indigo-600" />
                            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                                <span>1 (minimal)</span><span>5 (balanced)</span><span>10 (everything)</span>
                            </div>
                        </div>

                        {/* Notification Rules */}
                        <div>
                            <h3 className="font-bold text-sm text-slate-900 mb-3">⚡ Notification Rules</h3>
                            <div className="space-y-2">
                                {rules.map((rule, i) => (
                                    <motion.div key={rule.id}
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.04 }}
                                        className={`st-card p-4 transition-all ${!masterToggle ? 'opacity-40' : ''}`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <span className="text-xl mt-0.5">{rule.icon}</span>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-0.5">
                                                    <p className="font-semibold text-sm text-slate-900">{rule.title}</p>
                                                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold border ${urgencyColor(rule.urgency)}`}>
                                                        {rule.urgency === 'high' ? '🔴 High' : rule.urgency === 'medium' ? '🟡 Medium' : '⚪ Low'}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-slate-500 mb-2">{rule.description}</p>
                                                <div className="bg-slate-50 rounded-lg px-3 py-2 border border-slate-100">
                                                    <p className="text-[10px] text-slate-400 font-semibold mb-0.5">Preview:</p>
                                                    <p className="text-xs text-slate-600 italic">&ldquo;{rule.example}&rdquo;</p>
                                                </div>
                                            </div>
                                            <button onClick={() => toggleRule(rule.id)} disabled={!masterToggle}
                                                className={`shrink-0 w-10 h-6 rounded-full transition-colors relative ${rule.enabled && masterToggle ? 'bg-indigo-600' : 'bg-slate-300'}`}>
                                                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${rule.enabled && masterToggle ? 'left-4' : 'left-0.5'}`} />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Save */}
                        <button className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors">
                            Save Notification Preferences
                        </button>
                    </div>
                </main>
                <BottomNav />
            </div>
        </div>
    );
}
