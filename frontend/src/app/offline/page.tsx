'use client';
import Link from 'next/link';

export default function OfflinePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-6">
            <div className="text-center max-w-md">
                <div className="text-7xl mb-4 animate-pulse">📡</div>
                <h1 className="text-2xl font-bold text-slate-900 mb-2">You&apos;re Offline</h1>
                <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                    It looks like your internet connection is down. Don&apos;t worry — some features are
                    available offline while you wait.
                </p>
                <div className="grid grid-cols-2 gap-3 mb-6">
                    {[
                        { icon: '📚', label: 'Cached Courses', desc: 'View downloaded content' },
                        { icon: '💻', label: 'Saved Problems', desc: 'Practice offline' },
                        { icon: '📊', label: 'Your Stats', desc: 'View cached scores' },
                        { icon: '📋', label: 'Saved Notes', desc: 'Review your notes' },
                    ].map(item => (
                        <div key={item.label} className="bg-white rounded-xl p-4 shadow-sm text-center">
                            <span className="text-2xl block mb-1">{item.icon}</span>
                            <p className="text-xs font-semibold text-slate-900">{item.label}</p>
                            <p className="text-[10px] text-slate-400">{item.desc}</p>
                        </div>
                    ))}
                </div>
                <button onClick={() => window.location.reload()}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-all active:scale-95 w-full mb-3">
                    🔄 Try Again
                </button>
                <Link href="/dashboard" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">
                    Go to Dashboard
                </Link>
            </div>
        </div>
    );
}
