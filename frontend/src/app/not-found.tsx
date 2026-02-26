'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center text-white max-w-md"
            >
                <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                    className="text-8xl mb-4"
                >
                    🤔
                </motion.div>
                <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-white to-white/50 bg-clip-text text-transparent">
                    404
                </h1>
                <h2 className="text-2xl font-bold mb-3">Page Not Found</h2>
                <p className="text-white/60 text-sm mb-8 leading-relaxed">
                    Looks like this page took a different career path.
                    <br />Let&apos;s get you back on track.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link href="/dashboard"
                        className="bg-white text-indigo-700 px-6 py-3 rounded-xl text-sm font-bold hover:bg-white/90 transition-all shadow-lg">
                        🏠 Go to Dashboard
                    </Link>
                    <Link href="/help"
                        className="bg-white/15 backdrop-blur-sm text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-white/25 transition-all border border-white/20">
                        ❓ Help Center
                    </Link>
                </div>

                <div className="mt-12 flex justify-center gap-6 text-xs text-white/30">
                    <Link href="/" className="hover:text-white/60 transition-colors">Home</Link>
                    <Link href="/chat" className="hover:text-white/60 transition-colors">AI Counselor</Link>
                    <Link href="/practice" className="hover:text-white/60 transition-colors">Coding Arena</Link>
                </div>
            </motion.div>
        </div>
    );
}
