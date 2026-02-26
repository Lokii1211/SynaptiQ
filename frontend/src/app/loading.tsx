export default function Loading() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="text-center">
                <div className="relative w-16 h-16 mx-auto mb-4">
                    <div className="absolute inset-0 border-4 border-indigo-100 rounded-full" />
                    <div className="absolute inset-0 border-4 border-transparent border-t-indigo-600 rounded-full animate-spin" />
                    <div className="absolute inset-2 border-4 border-transparent border-t-violet-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} />
                </div>
                <p className="text-sm font-medium text-slate-500 animate-pulse">Loading...</p>
            </div>
        </div>
    );
}
