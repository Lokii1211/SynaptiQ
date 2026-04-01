'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { api, auth } from '@/lib/api';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';

export default function NegotiatePage() {
    const [step, setStep] = useState(0);
    const [form, setForm] = useState({ company: '', role: '', offered_ctc: '', city: '' });
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
    }, []);

    const negotiate = async () => {
        setLoading(true);
        try {
            const data = await api.getSalaryInsights(form.role);
            setResult({
                market_avg: data.avg_salary || 8,
                your_offer: parseFloat(form.offered_ctc) || 6,
                recommendation: parseFloat(form.offered_ctc) < (data.avg_salary || 8)
                    ? `Your offer of ₹${form.offered_ctc} LPA is below market average of ₹${data.avg_salary || 8} LPA for ${form.role} in ${form.city}. You can negotiate for 15-25% more.`
                    : `Your offer of ₹${form.offered_ctc} LPA is competitive for ${form.role} in ${form.city}. Consider negotiating other benefits like joining bonus, RSUs, or remote work.`,
                tips: [
                    'Always get the offer in writing before negotiating',
                    'Research Glassdoor and Levels.fyi for salary data',
                    'Negotiate joining bonus if base salary is fixed',
                    'Ask about stock options / RSUs for startups',
                    `Mention competing offers if you have them`,
                ],
            });
        } catch {
            setResult({
                recommendation: `Based on market data, a ${form.role} in ${form.city} typically earns ₹6-12 LPA for freshers. Your offer of ₹${form.offered_ctc || 'N/A'} LPA should be evaluated accordingly.`,
                tips: ['Research market rates', 'Get competing offers', 'Negotiate beyond salary'],
            });
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1 pb-24 md:pb-8">
                    <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white px-6 py-8">
                        <h1 className="text-2xl font-bold mb-2">💰 Salary Negotiator</h1>
                        <p className="text-white/80 text-sm">AI-powered negotiation advice based on real market data</p>
                    </div>

                    <div className="px-4 md:px-6 py-6 max-w-3xl mx-auto space-y-6">
                        <section className="st-card p-6">
                            <h2 className="font-semibold text-slate-900 mb-4">Enter Your Offer</h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Company</label>
                                    <input type="text" className="st-input" placeholder="e.g., TCS" value={form.company}
                                        onChange={e => setForm(f => ({ ...f, company: e.target.value }))} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Role</label>
                                    <input type="text" className="st-input" placeholder="e.g., SDE" value={form.role}
                                        onChange={e => setForm(f => ({ ...f, role: e.target.value }))} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Offered CTC (LPA)</label>
                                    <input type="number" className="st-input" placeholder="e.g., 6" value={form.offered_ctc}
                                        onChange={e => setForm(f => ({ ...f, offered_ctc: e.target.value }))} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">City</label>
                                    <input type="text" className="st-input" placeholder="e.g., Bangalore" value={form.city}
                                        onChange={e => setForm(f => ({ ...f, city: e.target.value }))} />
                                </div>
                            </div>
                            <button onClick={negotiate} disabled={loading || !form.role}
                                className="st-btn-primary mt-4 disabled:opacity-50 flex items-center gap-2">
                                {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Analyzing...</> : '💡 Get Negotiation Advice'}
                            </button>
                        </section>

                        {result && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                                <div className="st-card p-6">
                                    <h2 className="font-bold text-slate-900 mb-3">🎯 AI Recommendation</h2>
                                    <p className="text-sm text-slate-700 leading-relaxed">{result.recommendation}</p>
                                </div>
                                <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
                                    <h2 className="font-bold text-slate-900 mb-3">💡 Negotiation Tips</h2>
                                    <ul className="space-y-2">
                                        {result.tips.map((tip: string, i: number) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                                                <span className="text-amber-600 mt-0.5">•</span>{tip}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </main>
                <BottomNav />
            </div>
        </div>
    );
}
