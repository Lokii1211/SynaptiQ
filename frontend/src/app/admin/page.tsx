'use client';
import { useEffect, useState } from 'react';
import { auth } from '@/lib/api';

export default function AdminPage() {
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        if (!auth.isLoggedIn()) { window.location.href = '/login'; return; }
        const user = auth.getUser();
        if (!user?.is_admin) { window.location.href = '/dashboard'; return; }
        setIsAdmin(true);
    }, []);

    if (!isAdmin) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    const stats = [
        { label: 'Total Users', value: '—', icon: '👤' },
        { label: 'Assessments Taken', value: '—', icon: '🧬' },
        { label: 'Problems Solved', value: '—', icon: '💻' },
        { label: 'Resumes Created', value: '—', icon: '📄' },
    ];

    return (
        <div className="min-h-screen bg-slate-100">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-lg flex items-center justify-center text-white font-bold text-[10px]">ST</div>
                    <span className="font-bold">SkillTen Admin</span>
                </div>
                <button onClick={() => { window.location.href = '/dashboard'; }}
                    className="text-sm text-slate-400 hover:text-white">← Back to App</button>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-8">
                <h1 className="text-2xl font-bold text-slate-900 mb-6">Dashboard Overview</h1>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {stats.map(s => (
                        <div key={s.label} className="bg-white rounded-xl p-5 shadow-sm">
                            <span className="text-2xl">{s.icon}</span>
                            <p className="text-3xl font-bold text-slate-900 mt-2">{s.value}</p>
                            <p className="text-xs text-slate-500">{s.label}</p>
                        </div>
                    ))}
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h2 className="font-semibold text-slate-900 mb-3">Admin Controls</h2>
                    <p className="text-sm text-slate-500">Admin panel is available via the backend API at <code className="bg-slate-100 px-2 py-0.5 rounded">/api/admin</code></p>
                </div>
            </div>
        </div>
    );
}
