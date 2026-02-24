'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';

interface CertificateData {
    valid: boolean;
    student_name?: string;
    certificate_type?: string;
    skill_area?: string;
    issued_at?: string;
    score?: number;
    archetype?: string;
    viya_score?: number;
}

export default function VerifyPage() {
    const params = useParams();
    const hash = params.hash as string;
    const [cert, setCert] = useState<CertificateData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate certificate verification — in production hits /api/verify/:hash
        const timer = setTimeout(() => {
            setCert({
                valid: true,
                student_name: 'Verified Student',
                certificate_type: 'Skill Verification',
                skill_area: 'Full Stack Development',
                issued_at: new Date().toISOString(),
                score: 87,
                archetype: 'The Quiet Systems Builder',
                viya_score: 742,
            });
            setLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, [hash]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md"
            >
                {loading ? (
                    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 text-center border border-white/10">
                        <div className="w-16 h-16 border-4 border-indigo-300 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-white/80 text-lg">Verifying certificate...</p>
                        <p className="text-white/40 text-sm mt-2 font-mono">{hash}</p>
                    </div>
                ) : cert?.valid ? (
                    <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-center">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', delay: 0.2 }}
                                className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-3"
                            >
                                <span className="text-4xl">✅</span>
                            </motion.div>
                            <h1 className="text-2xl font-bold text-white">Certificate Verified</h1>
                            <p className="text-green-100 text-sm mt-1">This is an authentic Viya certificate</p>
                        </div>

                        {/* Details */}
                        <div className="p-6 space-y-4">
                            <div>
                                <p className="text-xs text-white/40 uppercase tracking-wider">Issued To</p>
                                <p className="text-white font-semibold text-lg">{cert.student_name}</p>
                            </div>
                            <div>
                                <p className="text-xs text-white/40 uppercase tracking-wider">Certificate Type</p>
                                <p className="text-white font-medium">{cert.certificate_type}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-white/40 uppercase tracking-wider">Skill Area</p>
                                    <p className="text-white font-medium">{cert.skill_area}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-white/40 uppercase tracking-wider">Score</p>
                                    <p className="text-indigo-300 font-bold text-xl">{cert.score}/100</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-white/40 uppercase tracking-wider">Archetype</p>
                                    <p className="text-white font-medium text-sm">{cert.archetype}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-white/40 uppercase tracking-wider">Viya Score™</p>
                                    <p className="text-indigo-300 font-bold text-xl">{cert.viya_score}</p>
                                </div>
                            </div>
                            <div className="pt-3 border-t border-white/10">
                                <p className="text-xs text-white/40 uppercase tracking-wider">Issued On</p>
                                <p className="text-white/70 text-sm">
                                    {cert.issued_at ? new Date(cert.issued_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}
                                </p>
                            </div>
                            <div className="pt-3 border-t border-white/10">
                                <p className="text-xs text-white/40 uppercase tracking-wider">Verification Hash</p>
                                <p className="text-white/50 text-xs font-mono break-all">{hash}</p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="bg-white/5 p-4 text-center border-t border-white/10">
                            <p className="text-white/40 text-xs">
                                Verified by Viya Technologies — viya.ai
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 text-center border border-red-500/30">
                        <span className="text-5xl mb-4 block">❌</span>
                        <h1 className="text-2xl font-bold text-white mb-2">Invalid Certificate</h1>
                        <p className="text-white/60">This certificate hash could not be verified.</p>
                        <p className="text-white/30 text-xs font-mono mt-4">{hash}</p>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
