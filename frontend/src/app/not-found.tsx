import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-violet-100 rounded-3xl flex items-center justify-center mb-8 mx-auto">
                <span className="text-5xl">🗺️</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-3">
                Page not found
            </h1>
            <p className="text-slate-500 text-lg mb-8 max-w-md leading-relaxed">
                The career path you&apos;re looking for doesn&apos;t exist here.
                But your career path definitely does — let&apos;s find it.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/dashboard" className="st-btn-primary px-8 py-3">
                    Go to Dashboard
                </Link>
                <Link href="/" className="st-btn-secondary px-8 py-3">
                    Back to Home
                </Link>
            </div>
        </div>
    );
}
