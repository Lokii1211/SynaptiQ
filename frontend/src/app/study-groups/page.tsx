'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';
import { auth } from '@/lib/api';
import Link from 'next/link';

/* ═══ Study Group Types ═══ */
interface GroupMember {
    name: string; avatar: string; streak: number; solved: number; active: boolean;
}
interface StudyGroup {
    id: string; name: string; icon: string; topic: string; privacy: 'open' | 'closed' | 'secret';
    members: GroupMember[]; maxMembers: number; jointStreak: number; dailyChallenge: string;
    leaderboard: { name: string; points: number }[]; description: string; createdBy: string;
    tags: string[]; lastActive: string;
}

const MOCK_GROUPS: StudyGroup[] = [
    {
        id: '1', name: 'DSA Warriors', icon: '⚔️', topic: 'Data Structures & Algorithms',
        privacy: 'open', maxMembers: 20, jointStreak: 23, dailyChallenge: 'Two Sum — Solve before 11 PM',
        description: 'Daily DSA practice for placement prep. We solve one problem together every day.',
        createdBy: 'Priya S.', tags: ['dsa', 'placement', 'daily'],
        lastActive: '2 min ago',
        members: [
            { name: 'Priya S.', avatar: '👩‍💻', streak: 45, solved: 234, active: true },
            { name: 'Rohit K.', avatar: '💻', streak: 31, solved: 187, active: true },
            { name: 'Ananya M.', avatar: '🧠', streak: 28, solved: 156, active: false },
            { name: 'Vikram R.', avatar: '🔥', streak: 19, solved: 142, active: true },
            { name: 'Deepa T.', avatar: '📊', streak: 23, solved: 98, active: true },
        ],
        leaderboard: [
            { name: 'Priya S.', points: 892 }, { name: 'Rohit K.', points: 734 },
            { name: 'Ananya M.', points: 612 }, { name: 'Vikram R.', points: 587 },
            { name: 'Deepa T.', points: 443 },
        ],
    },
    {
        id: '2', name: 'SQL Mastery Club', icon: '🗃️', topic: 'SQL & Databases',
        privacy: 'open', maxMembers: 15, jointStreak: 11, dailyChallenge: 'Write a JOIN query with 3 tables',
        description: 'Learning SQL from basics to advanced. Focus on interview-style queries.',
        createdBy: 'Arjun P.', tags: ['sql', 'databases', 'analytics'],
        lastActive: '15 min ago',
        members: [
            { name: 'Arjun P.', avatar: '🗃️', streak: 22, solved: 89, active: true },
            { name: 'Sneha R.', avatar: '📈', streak: 18, solved: 76, active: true },
            { name: 'Karthik V.', avatar: '💡', streak: 14, solved: 54, active: false },
        ],
        leaderboard: [
            { name: 'Arjun P.', points: 534 }, { name: 'Sneha R.', points: 478 },
            { name: 'Karthik V.', points: 321 },
        ],
    },
    {
        id: '3', name: 'TCS NQT Prep', icon: '🏢', topic: 'TCS National Qualifier Test',
        privacy: 'closed', maxMembers: 10, jointStreak: 7, dailyChallenge: 'Aptitude: Pipes & Cisterns set',
        description: 'Focused preparation for TCS NQT. Aptitude + Coding + Company-specific practice.',
        createdBy: 'Meera K.', tags: ['tcs', 'nqt', 'aptitude', 'service-company'],
        lastActive: '1 hour ago',
        members: [
            { name: 'Meera K.', avatar: '📚', streak: 15, solved: 67, active: true },
            { name: 'Ravi S.', avatar: '🎯', streak: 12, solved: 45, active: true },
            { name: 'Pooja L.', avatar: '✨', streak: 9, solved: 38, active: true },
            { name: 'Sanjay M.', avatar: '💪', streak: 7, solved: 29, active: false },
        ],
        leaderboard: [
            { name: 'Meera K.', points: 412 }, { name: 'Ravi S.', points: 356 },
            { name: 'Pooja L.', points: 298 }, { name: 'Sanjay M.', points: 187 },
        ],
    },
    {
        id: '4', name: 'Python Data Science', icon: '🐍', topic: 'Python for Data Analysis',
        privacy: 'open', maxMembers: 20, jointStreak: 16, dailyChallenge: 'Pandas: GroupBy + Aggregation exercise',
        description: 'Learn Python with pandas, numpy, and matplotlib. Practice with real datasets.',
        createdBy: 'Kavitha N.', tags: ['python', 'data-science', 'pandas', 'analytics'],
        lastActive: '30 min ago',
        members: [
            { name: 'Kavitha N.', avatar: '🐍', streak: 30, solved: 112, active: true },
            { name: 'Arun B.', avatar: '📊', streak: 25, solved: 98, active: true },
            { name: 'Divya S.', avatar: '🤖', streak: 20, solved: 87, active: true },
            { name: 'Mohan R.', avatar: '💻', streak: 16, solved: 65, active: false },
            { name: 'Preethi V.', avatar: '🎓', streak: 14, solved: 54, active: true },
            { name: 'Suresh K.', avatar: '🔬', streak: 11, solved: 43, active: false },
        ],
        leaderboard: [
            { name: 'Kavitha N.', points: 723 }, { name: 'Arun B.', points: 645 },
            { name: 'Divya S.', points: 578 }, { name: 'Preethi V.', points: 398 },
            { name: 'Mohan R.', points: 312 }, { name: 'Suresh K.', points: 267 },
        ],
    },
];

const LOOKING_FOR_TEAM = [
    { name: 'Aditya R.', skills: ['React', 'Node.js', 'MongoDB'], seeking: 'Frontend Dev', college: 'VIT Vellore' },
    { name: 'Sanya P.', skills: ['Python', 'TensorFlow', 'SQL'], seeking: 'ML Engineer', college: 'IIIT Hyderabad' },
    { name: 'Kiran T.', skills: ['Figma', 'HTML/CSS', 'React'], seeking: 'Backend Dev', college: 'SRM Chennai' },
    { name: 'Nisha G.', skills: ['Java', 'Spring Boot', 'AWS'], seeking: 'DevOps', college: 'BITS Pilani' },
];

export default function StudyGroupsPage() {
    const [tab, setTab] = useState<'discover' | 'my-groups' | 'create' | 'teammates'>('discover');
    const [selectedGroup, setSelectedGroup] = useState<StudyGroup | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [createForm, setCreateForm] = useState({ name: '', topic: '', description: '', privacy: 'open' as const, maxMembers: 10 });

    useEffect(() => {
        if (!auth.isLoggedIn()) { window.location.href = '/login'; return; }
    }, []);

    const filteredGroups = MOCK_GROUPS.filter(g =>
        g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.tags.some(t => t.includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="min-h-screen bg-slate-50">
            <TopBar />
            <main className="max-w-5xl mx-auto px-4 md:px-6 py-6 pb-24 md:pb-8">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
                    <h1 className="text-2xl font-bold text-slate-900 st-font-heading">📚 Study Groups</h1>
                    <p className="text-sm text-slate-500 mt-1">Learn together, solve together, get placed together</p>
                </motion.div>

                {/* Tabs */}
                <div className="flex gap-1 mb-6 bg-white rounded-xl p-1 border border-slate-200 overflow-x-auto">
                    {([
                        { id: 'discover', label: '🔍 Discover', count: MOCK_GROUPS.length },
                        { id: 'my-groups', label: '👥 My Groups', count: 2 },
                        { id: 'teammates', label: '🤝 Find Teammates' },
                        { id: 'create', label: '➕ Create Group' },
                    ] as const).map(t => (
                        <button key={t.id} onClick={() => setTab(t.id)}
                            className={`flex-shrink-0 px-4 py-2 rounded-lg text-xs font-medium transition-all ${tab === t.id
                                ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}>
                            {t.label} {'count' in t ? <span className="ml-1 opacity-70">({t.count})</span> : null}
                        </button>
                    ))}
                </div>

                {/* ═══ Detail View ═══ */}
                {selectedGroup ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                        <button onClick={() => setSelectedGroup(null)} className="text-sm text-indigo-600 font-medium hover:text-indigo-800">← Back to groups</button>

                        {/* Group Header */}
                        <div className="st-card p-6">
                            <div className="flex items-start gap-4">
                                <span className="text-4xl">{selectedGroup.icon}</span>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h2 className="text-xl font-bold text-slate-900">{selectedGroup.name}</h2>
                                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${selectedGroup.privacy === 'open' ? 'bg-emerald-50 text-emerald-600' : selectedGroup.privacy === 'closed' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-500'}`}>
                                            {selectedGroup.privacy.toUpperCase()}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-500 mb-2">{selectedGroup.description}</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {selectedGroup.tags.map(tag => (
                                            <span key={tag} className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">#{tag}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Stats Row */}
                            <div className="grid grid-cols-4 gap-3 mt-5">
                                {[
                                    { label: 'Members', value: `${selectedGroup.members.length}/${selectedGroup.maxMembers}`, icon: '👥' },
                                    { label: 'Joint Streak', value: `🔥 ${selectedGroup.jointStreak} days`, icon: '' },
                                    { label: 'Today\'s Challenge', value: '1 active', icon: '⚡' },
                                    { label: 'Last Active', value: selectedGroup.lastActive, icon: '🕐' },
                                ].map((s, i) => (
                                    <div key={i} className="text-center bg-slate-50 rounded-xl p-3">
                                        <p className="text-lg font-bold text-slate-900">{s.value}</p>
                                        <p className="text-[10px] text-slate-400 mt-0.5">{s.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Daily Challenge Card */}
                        <div className="st-card p-5 bg-gradient-to-r from-indigo-50 to-violet-50 border-indigo-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-indigo-500 font-bold mb-1">⚡ TODAY'S GROUP CHALLENGE</p>
                                    <p className="text-sm font-semibold text-slate-900">{selectedGroup.dailyChallenge}</p>
                                    <p className="text-[10px] text-slate-500 mt-1">{selectedGroup.members.filter(m => m.active).length}/{selectedGroup.members.length} members active today</p>
                                </div>
                                <Link href="/problems" className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-colors">
                                    Solve Now →
                                </Link>
                            </div>
                        </div>

                        {/* Two-Column: Members + Leaderboard */}
                        <div className="grid md:grid-cols-2 gap-4">
                            {/* Members */}
                            <div className="st-card p-5">
                                <h3 className="text-sm font-bold text-slate-900 mb-3">👥 Members</h3>
                                <div className="space-y-2">
                                    {selectedGroup.members.map((m, i) => (
                                        <div key={i} className="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0">
                                            <span className="text-lg">{m.avatar}</span>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <p className="text-xs font-semibold text-slate-900">{m.name}</p>
                                                    {m.active && <span className="w-2 h-2 bg-emerald-400 rounded-full" />}
                                                </div>
                                                <p className="text-[10px] text-slate-400">🔥 {m.streak} streak · {m.solved} solved</p>
                                            </div>
                                            {i === 0 && <span className="text-[9px] bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full font-bold">Creator</span>}
                                        </div>
                                    ))}
                                </div>
                                <button className="w-full mt-3 py-2 text-center text-xs text-indigo-600 font-semibold border border-indigo-200 rounded-xl hover:bg-indigo-50 transition-colors">
                                    + Invite Members
                                </button>
                            </div>

                            {/* Leaderboard */}
                            <div className="st-card p-5">
                                <h3 className="text-sm font-bold text-slate-900 mb-3">🏆 Group Leaderboard</h3>
                                <div className="space-y-2">
                                    {selectedGroup.leaderboard.map((l, i) => (
                                        <div key={i} className="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0">
                                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${i === 0 ? 'bg-amber-500' : i === 1 ? 'bg-slate-400' : i === 2 ? 'bg-amber-700' : 'bg-slate-200 text-slate-600'}`}>
                                                {i + 1}
                                            </span>
                                            <p className="text-xs font-medium text-slate-900 flex-1">{l.name}</p>
                                            <p className="text-xs font-bold text-indigo-600">{l.points} pts</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Group Chat Preview */}
                        <div className="st-card p-5">
                            <h3 className="text-sm font-bold text-slate-900 mb-3">💬 Group Chat</h3>
                            <div className="space-y-3 mb-4">
                                {[
                                    { from: selectedGroup.members[0]?.name || 'Member', msg: '@all Daily challenge is up! Solve before 11 PM 🔥', time: '9:15 AM' },
                                    { from: selectedGroup.members[1]?.name || 'Member', msg: 'Used HashMap approach. O(n) time, O(n) space. Clean!', time: '10:42 AM' },
                                    { from: selectedGroup.members[2]?.name || 'Member', msg: 'Can someone explain the two-pointer approach? 🤔', time: '11:05 AM' },
                                ].map((c, i) => (
                                    <div key={i} className="flex gap-2">
                                        <div className="w-7 h-7 bg-gradient-to-br from-indigo-400 to-violet-500 rounded-full flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0">
                                            {c.from[0]}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-bold text-slate-900">{c.from}</span>
                                                <span className="text-[9px] text-slate-400">{c.time}</span>
                                            </div>
                                            <p className="text-xs text-slate-600">{c.msg}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <input type="text" placeholder="Type a message..." className="flex-1 st-input !py-2 !text-xs" />
                                <button className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700">Send</button>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <AnimatePresence mode="wait">
                        {/* ═══ Discover Tab ═══ */}
                        {tab === 'discover' && (
                            <motion.div key="discover" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                                {/* Search */}
                                <div className="relative mb-4">
                                    <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                                        placeholder="Search groups by name, topic, or tag..." className="st-input !pl-10 !py-3" />
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
                                </div>

                                {/* Joint Streak Alert */}
                                <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-100 mb-5">
                                    <p className="text-xs font-bold text-orange-800">🔥 Joint Streak Challenge</p>
                                    <p className="text-[11px] text-orange-600 mt-1">If ANY member misses a day, the group streak breaks. Social accountability = better preparation!</p>
                                </div>

                                {/* Group Cards */}
                                <div className="grid md:grid-cols-2 gap-4">
                                    {filteredGroups.map((group, i) => (
                                        <motion.div key={group.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            onClick={() => setSelectedGroup(group)}
                                            className="st-card p-5 cursor-pointer hover:shadow-xl hover:border-indigo-200 transition-all">
                                            <div className="flex items-start gap-3 mb-3">
                                                <span className="text-2xl">{group.icon}</span>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="text-sm font-bold text-slate-900">{group.name}</h3>
                                                        <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-bold ${group.privacy === 'open' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                                            {group.privacy.toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-slate-400 mt-0.5">{group.topic}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4 mb-3 text-[10px] text-slate-500">
                                                <span>👥 {group.members.length}/{group.maxMembers}</span>
                                                <span>🔥 {group.jointStreak}-day streak</span>
                                                <span>🕐 {group.lastActive}</span>
                                            </div>

                                            {/* Today's challenge */}
                                            <div className="bg-indigo-50 rounded-lg p-2.5 mb-3">
                                                <p className="text-[9px] text-indigo-500 font-bold mb-0.5">TODAY'S CHALLENGE</p>
                                                <p className="text-[11px] text-slate-700 font-medium">{group.dailyChallenge}</p>
                                            </div>

                                            {/* Member avatars */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex -space-x-2">
                                                    {group.members.slice(0, 5).map((m, mi) => (
                                                        <span key={mi} className="w-7 h-7 bg-gradient-to-br from-indigo-400 to-violet-500 rounded-full flex items-center justify-center text-[10px] text-white border-2 border-white">
                                                            {m.avatar}
                                                        </span>
                                                    ))}
                                                    {group.members.length > 5 && (
                                                        <span className="w-7 h-7 bg-slate-200 rounded-full flex items-center justify-center text-[9px] text-slate-600 border-2 border-white font-bold">
                                                            +{group.members.length - 5}
                                                        </span>
                                                    )}
                                                </div>
                                                <button className="text-xs text-indigo-600 font-bold hover:text-indigo-800 transition-colors">
                                                    Join →
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* ═══ My Groups Tab ═══ */}
                        {tab === 'my-groups' && (
                            <motion.div key="my-groups" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {MOCK_GROUPS.slice(0, 2).map((group, i) => (
                                        <div key={group.id} onClick={() => setSelectedGroup(group)} className="st-card p-5 cursor-pointer hover:shadow-lg transition-all border-l-4 border-indigo-500">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="text-xl">{group.icon}</span>
                                                <div>
                                                    <h3 className="text-sm font-bold text-slate-900">{group.name}</h3>
                                                    <p className="text-[10px] text-slate-400">{group.members.length} members · 🔥 {group.jointStreak}-day streak</p>
                                                </div>
                                            </div>
                                            <div className="bg-emerald-50 rounded-lg p-2.5">
                                                <p className="text-[9px] text-emerald-600 font-bold">⚡ TODAY: {group.dailyChallenge}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="text-center mt-8">
                                    <p className="text-sm text-slate-400 mb-3">Want to form a study group?</p>
                                    <button onClick={() => setTab('create')} className="st-btn-primary text-sm">
                                        + Create New Group
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* ═══ Find Teammates Tab ═══ */}
                        {tab === 'teammates' && (
                            <motion.div key="teammates" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                                <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl p-4 border border-violet-100 mb-5">
                                    <p className="text-xs font-bold text-violet-800">🤝 Looking for Teammates?</p>
                                    <p className="text-[11px] text-violet-600 mt-1">Post your skills and what you&apos;re looking for. Browse others and send team invites via Mentixy messaging.</p>
                                </div>

                                <div className="space-y-3">
                                    {LOOKING_FOR_TEAM.map((person, i) => (
                                        <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                                            className="st-card p-4 flex items-center gap-4">
                                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-violet-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                                                {person.name[0]}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-slate-900">{person.name}</p>
                                                <p className="text-[10px] text-slate-400">{person.college}</p>
                                                <div className="flex flex-wrap gap-1 mt-1.5">
                                                    {person.skills.map(s => (
                                                        <span key={s} className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">{s}</span>
                                                    ))}
                                                </div>
                                                <p className="text-[10px] text-indigo-600 mt-1 font-medium">Looking for: {person.seeking}</p>
                                            </div>
                                            <button className="px-3 py-1.5 bg-indigo-600 text-white text-[10px] font-bold rounded-lg hover:bg-indigo-700 flex-shrink-0">
                                                Invite
                                            </button>
                                        </motion.div>
                                    ))}
                                </div>

                                <button className="w-full mt-4 st-card p-4 text-center text-sm text-indigo-600 font-semibold hover:bg-indigo-50 transition-colors">
                                    ➕ Post Your Profile — Looking for Teammates
                                </button>
                            </motion.div>
                        )}

                        {/* ═══ Create Group Tab ═══ */}
                        {tab === 'create' && (
                            <motion.div key="create" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                                <div className="st-card p-6 max-w-lg mx-auto">
                                    <h2 className="text-lg font-bold text-slate-900 mb-4">➕ Create a Study Group</h2>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-xs font-semibold text-slate-600 block mb-1">Group Name *</label>
                                            <input type="text" value={createForm.name} onChange={e => setCreateForm(f => ({ ...f, name: e.target.value }))}
                                                placeholder="e.g., DSA Warriors" className="st-input" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-slate-600 block mb-1">Topic *</label>
                                            <input type="text" value={createForm.topic} onChange={e => setCreateForm(f => ({ ...f, topic: e.target.value }))}
                                                placeholder="e.g., Data Structures & Algorithms" className="st-input" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-slate-600 block mb-1">Description</label>
                                            <textarea value={createForm.description} onChange={e => setCreateForm(f => ({ ...f, description: e.target.value }))}
                                                placeholder="What will this group focus on?" className="st-input !min-h-[80px] resize-none" />
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="flex-1">
                                                <label className="text-xs font-semibold text-slate-600 block mb-1">Privacy</label>
                                                <select value={createForm.privacy} onChange={e => setCreateForm(f => ({ ...f, privacy: e.target.value as any }))} className="st-input">
                                                    <option value="open">🔓 Open — Anyone can join</option>
                                                    <option value="closed">🔒 Closed — Approval required</option>
                                                    <option value="secret">👁️ Secret — Invite only</option>
                                                </select>
                                            </div>
                                            <div className="w-32">
                                                <label className="text-xs font-semibold text-slate-600 block mb-1">Max Members</label>
                                                <input type="number" value={createForm.maxMembers} onChange={e => setCreateForm(f => ({ ...f, maxMembers: parseInt(e.target.value) || 10 }))}
                                                    min={2} max={20} className="st-input" />
                                            </div>
                                        </div>
                                        <button className="w-full st-btn-primary">
                                            🚀 Create Group
                                        </button>
                                        <p className="text-[10px] text-slate-400 text-center">You can invite members after creating the group.</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}
            </main>
            <BottomNav />
        </div>
    );
}
