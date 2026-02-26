'use client';
import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('SkillTen Error:', error);
    }, [error]);

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <div className="text-center max-w-md">
                <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl">⚠️</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">Something went wrong</h2>
                <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                    Don&apos;t worry — your data is safe. This is likely a temporary issue.
                    Try refreshing, or go back to the dashboard.
                </p>

                {error.message && (
                    <div className="bg-red-50 text-red-700 text-xs font-mono p-3 rounded-xl mb-6 text-left overflow-x-auto">
                        {error.message}
                    </div>
                )}

                <div className="flex gap-3 justify-center">
                    <button onClick={reset}
                        className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-all">
                        🔄 Try Again
                    </button>
                    <Link href="/dashboard"
                        className="bg-slate-100 text-slate-700 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-200 transition-all">
                        🏠 Dashboard
                    </Link>
                </div>

                <p className="text-xs text-slate-400 mt-8">
                    If this keeps happening, contact{' '}
                    <a href="mailto:support@skillten.in" className="text-indigo-500 hover:underline">support@skillten.in</a>
                </p>
            </div>
        </div>
    );
}
