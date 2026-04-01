'use client';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';

export default function CollegeROIPage() {
    useEffect(() => {
    }, []);

    const colleges = [
        { name: 'IIT Bombay', tier: 1, avgPackage: 28, medianPackage: 22, topPackage: 80, roi: 95, placements: 98 },
        { name: 'NIT Trichy', tier: 1, avgPackage: 14, medianPackage: 11, topPackage: 45, roi: 88, placements: 95 },
        { name: 'BITS Pilani', tier: 1, avgPackage: 18, medianPackage: 15, topPackage: 55, roi: 85, placements: 96 },
        { name: 'VIT Vellore', tier: 2, avgPackage: 7, medianPackage: 5.5, topPackage: 25, roi: 72, placements: 85 },
        { name: 'SRM Chennai', tier: 2, avgPackage: 6, medianPackage: 4.5, topPackage: 20, roi: 65, placements: 80 },
        { name: 'KIIT Bhubaneswar', tier: 2, avgPackage: 5.5, medianPackage: 4, topPackage: 18, roi: 68, placements: 78 },
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1 pb-24 md:pb-8">
                    <div className="bg-white border-b border-slate-200 px-6 py-6">
                        <h1 className="text-2xl font-bold text-slate-900 mb-2">🎓 College ROI Calculator</h1>
                        <p className="text-slate-500 text-sm">Honest placement data + real ROI analysis for Indian colleges</p>
                    </div>

                    <div className="px-4 md:px-6 py-6 max-w-5xl mx-auto">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left text-xs text-slate-500 uppercase border-b border-slate-200">
                                        <th className="pb-3 pr-4">College</th>
                                        <th className="pb-3 pr-4">Tier</th>
                                        <th className="pb-3 pr-4">Avg Package</th>
                                        <th className="pb-3 pr-4">Median</th>
                                        <th className="pb-3 pr-4">Top</th>
                                        <th className="pb-3 pr-4">Placement %</th>
                                        <th className="pb-3">ROI Score</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {colleges.map((c, i) => (
                                        <motion.tr key={c.name}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.08 }}
                                            className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                                        >
                                            <td className="py-3 pr-4">
                                                <p className="font-semibold text-slate-900 text-sm">{c.name}</p>
                                            </td>
                                            <td className="py-3 pr-4">
                                                <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${c.tier === 1 ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-600'
                                                    }`}>Tier {c.tier}</span>
                                            </td>
                                            <td className="py-3 pr-4 text-sm text-slate-700">₹{c.avgPackage} LPA</td>
                                            <td className="py-3 pr-4 text-sm text-slate-500">₹{c.medianPackage} LPA</td>
                                            <td className="py-3 pr-4 text-sm text-emerald-600 font-medium">₹{c.topPackage} LPA</td>
                                            <td className="py-3 pr-4 text-sm text-slate-700">{c.placements}%</td>
                                            <td className="py-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-16 bg-slate-100 rounded-full h-2 overflow-hidden">
                                                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${c.roi}%` }} />
                                                    </div>
                                                    <span className="text-xs font-bold text-indigo-600">{c.roi}</span>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-6 bg-amber-50 rounded-2xl p-6 border border-amber-200">
                            <p className="text-sm text-slate-700">
                                <strong>💡 Note:</strong> ROI considers fees, placement rates, median salary (not average — that&apos;s inflated by top offers),
                                and career growth trajectory. A Tier-2 college with consistent placements can have better ROI than a Tier-1 with high fees.
                            </p>
                        </div>
                    </div>
                </main>
                <BottomNav />
            </div>
        </div>
    );
}
