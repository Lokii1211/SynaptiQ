'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';

interface SalaryBreakdown {
    basic: number;
    hra: number;
    special: number;
    pf_employer: number;
    pf_employee: number;
    professional_tax: number;
    income_tax: number;
    in_hand_monthly: number;
    in_hand_annual: number;
    effective_ctc: number;
}

const TAX_SLABS_NEW = [
    { min: 0, max: 300000, rate: 0 },
    { min: 300000, max: 700000, rate: 0.05 },
    { min: 700000, max: 1000000, rate: 0.10 },
    { min: 1000000, max: 1200000, rate: 0.15 },
    { min: 1200000, max: 1500000, rate: 0.20 },
    { min: 1500000, max: Infinity, rate: 0.30 },
];

function calculateTax(taxableIncome: number): number {
    let tax = 0;
    for (const slab of TAX_SLABS_NEW) {
        if (taxableIncome <= slab.min) break;
        const taxable = Math.min(taxableIncome, slab.max) - slab.min;
        tax += taxable * slab.rate;
    }
    // Standard deduction ₹75,000
    const adjusted = Math.max(0, taxableIncome - 75000);
    tax = 0;
    for (const slab of TAX_SLABS_NEW) {
        if (adjusted <= slab.min) break;
        const taxable = Math.min(adjusted, slab.max) - slab.min;
        tax += taxable * slab.rate;
    }
    // Rebate u/s 87A: if taxable income <= 7L, tax = 0
    if (adjusted <= 700000) tax = 0;
    // 4% cess
    tax = tax * 1.04;
    return Math.round(tax);
}

function calculateBreakdown(ctcLPA: number): SalaryBreakdown {
    const ctc = ctcLPA * 100000;
    const basic = Math.round(ctc * 0.40);
    const hra = Math.round(basic * 0.50);
    const pf_employer = Math.min(Math.round(basic * 0.12), 21600 * 12);
    const pf_employee = Math.min(Math.round(basic * 0.12), 21600 * 12);
    const special = ctc - basic - hra - pf_employer;
    const gross = basic + hra + special;
    const professional_tax = 2400; // ₹200/month
    const taxableIncome = gross - pf_employee;
    const income_tax = calculateTax(taxableIncome);
    const total_deductions = pf_employee + professional_tax + income_tax;
    const in_hand_annual = gross - total_deductions;
    const in_hand_monthly = Math.round(in_hand_annual / 12);

    return {
        basic, hra, special, pf_employer, pf_employee,
        professional_tax, income_tax,
        in_hand_monthly, in_hand_annual,
        effective_ctc: ctc,
    };
}

const CITY_COST_INDEX: Record<string, { rent: number; food: number; transport: number; index: number }> = {
    'Bangalore': { rent: 15000, food: 6000, transport: 3000, index: 1.00 },
    'Mumbai': { rent: 18000, food: 5500, transport: 2500, index: 1.08 },
    'Delhi NCR': { rent: 14000, food: 5000, transport: 2800, index: 0.91 },
    'Hyderabad': { rent: 12000, food: 4500, transport: 2200, index: 0.78 },
    'Pune': { rent: 11000, food: 4500, transport: 2000, index: 0.73 },
    'Chennai': { rent: 10000, food: 4000, transport: 2000, index: 0.67 },
    'Coimbatore': { rent: 6000, food: 3500, transport: 1500, index: 0.46 },
    'Kolkata': { rent: 8000, food: 3500, transport: 1800, index: 0.55 },
    'Ahmedabad': { rent: 7000, food: 3500, transport: 1500, index: 0.50 },
    'Jaipur': { rent: 6500, food: 3000, transport: 1200, index: 0.45 },
    'Chandigarh': { rent: 8000, food: 3500, transport: 1500, index: 0.54 },
    'Lucknow': { rent: 5500, food: 3000, transport: 1000, index: 0.40 },
};

const COMPANY_BENCHMARKS = [
    { company: 'TCS', avg: 3.6, range: '3.36 – 4.0' },
    { company: 'Infosys', avg: 3.6, range: '3.25 – 4.25' },
    { company: 'Wipro', avg: 3.5, range: '3.5 – 4.0' },
    { company: 'Cognizant', avg: 4.0, range: '3.6 – 4.5' },
    { company: 'Accenture', avg: 4.5, range: '4.0 – 6.5' },
    { company: 'Capgemini', avg: 4.0, range: '3.8 – 5.0' },
    { company: 'Amazon', avg: 14.0, range: '12 – 26' },
    { company: 'Google', avg: 18.0, range: '15 – 30' },
    { company: 'Microsoft', avg: 16.0, range: '14 – 22' },
    { company: 'Flipkart', avg: 14.0, range: '12 – 20' },
    { company: 'Zoho', avg: 5.5, range: '4.0 – 8.0' },
    { company: 'Deloitte', avg: 6.5, range: '4.5 – 8.0' },
];

const fmt = (n: number) => '₹' + n.toLocaleString('en-IN');

export default function SalaryTruthPage() {
    const [ctc, setCtc] = useState<string>('');
    const [city, setCity] = useState('Bangalore');
    const [breakdown, setBreakdown] = useState<SalaryBreakdown | null>(null);
    const [showBenchmarks, setShowBenchmarks] = useState(false);

    const calculate = () => {
        const val = parseFloat(ctc);
        if (isNaN(val) || val <= 0) return;
        setBreakdown(calculateBreakdown(val));
    };

    const cityData = CITY_COST_INDEX[city];
    const purchasingPower = breakdown && cityData
        ? Math.round(breakdown.in_hand_monthly - (cityData.rent + cityData.food + cityData.transport))
        : 0;

    const verdict = breakdown ? (
        breakdown.effective_ctc < 400000 ? { text: 'Below market for CS freshers. Keep looking or negotiate.', color: 'text-red-600', bg: 'bg-red-50' } :
            breakdown.effective_ctc < 500000 ? { text: 'Average for service companies. Acceptable as first job.', color: 'text-amber-600', bg: 'bg-amber-50' } :
                breakdown.effective_ctc < 800000 ? { text: 'Good for freshers. Above service company average.', color: 'text-emerald-600', bg: 'bg-emerald-50' } :
                    breakdown.effective_ctc < 1500000 ? { text: 'Excellent! Product company level. Well above median.', color: 'text-blue-600', bg: 'bg-blue-50' } :
                        { text: 'Outstanding! Top-tier offer. Congratulations! 🎉', color: 'text-violet-600', bg: 'bg-violet-50' }
    ) : null;

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1 pb-24 md:pb-8">
                    {/* Hero */}
                    <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 text-white px-6 py-10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
                        <div className="max-w-3xl mx-auto relative z-10">
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                                <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full mb-3 inline-block">💰 SALARY TRUTH</span>
                                <h1 className="text-3xl font-bold mb-2 st-font-heading">Salary Truth Calculator</h1>
                                <p className="text-white/60 text-sm">Stop guessing. Know your REAL in-hand salary, city purchasing power, and honest market verdict.</p>
                            </motion.div>
                        </div>
                    </div>

                    <div className="px-4 md:px-6 py-6 max-w-3xl mx-auto space-y-6">
                        {/* Input Card */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            className="st-card p-6">
                            <h3 className="font-bold text-sm text-slate-900 mb-4">📋 Enter Your Offer Details</h3>
                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="text-xs text-slate-500 font-semibold block mb-1.5">CTC (in LPA)</label>
                                    <input
                                        type="number" placeholder="e.g. 4.5"
                                        value={ctc} onChange={e => setCtc(e.target.value)}
                                        className="st-input w-full text-lg font-bold"
                                        step="0.1" min="0"
                                    />
                                    <p className="text-[10px] text-slate-400 mt-1">Enter annual CTC as mentioned in offer letter</p>
                                </div>
                                <div>
                                    <label className="text-xs text-slate-500 font-semibold block mb-1.5">Work City</label>
                                    <select value={city} onChange={e => setCity(e.target.value)}
                                        className="st-input w-full text-sm">
                                        {Object.keys(CITY_COST_INDEX).map(c => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <button onClick={calculate}
                                className="w-full py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors text-sm">
                                Calculate Real Salary →
                            </button>
                        </motion.div>

                        {/* Results */}
                        <AnimatePresence>
                            {breakdown && (
                                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                    className="space-y-4">

                                    {/* Headline Numbers */}
                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="st-card p-4 text-center bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
                                            <p className="text-2xl font-bold text-emerald-700">{fmt(breakdown.in_hand_monthly)}</p>
                                            <p className="text-[10px] text-emerald-600 font-semibold uppercase mt-1">Monthly In-Hand</p>
                                        </div>
                                        <div className="st-card p-4 text-center">
                                            <p className="text-2xl font-bold text-slate-900">{fmt(breakdown.in_hand_annual)}</p>
                                            <p className="text-[10px] text-slate-500 font-semibold uppercase mt-1">Annual In-Hand</p>
                                        </div>
                                        <div className="st-card p-4 text-center">
                                            <p className="text-2xl font-bold text-slate-600">{fmt(breakdown.effective_ctc)}</p>
                                            <p className="text-[10px] text-slate-400 font-semibold uppercase mt-1">Stated CTC</p>
                                        </div>
                                    </div>

                                    {/* Verdict */}
                                    {verdict && (
                                        <div className={`st-card p-4 ${verdict.bg} border-l-4 ${verdict.color.replace('text-', 'border-')}`}>
                                            <p className="text-xs font-bold text-slate-500 uppercase mb-1">🎯 Honest Verdict</p>
                                            <p className={`text-sm font-semibold ${verdict.color}`}>{verdict.text}</p>
                                        </div>
                                    )}

                                    {/* Full Breakdown */}
                                    <div className="st-card p-5">
                                        <h3 className="font-bold text-sm text-slate-900 mb-3">📊 Salary Breakdown</h3>
                                        <div className="space-y-2">
                                            <div className="bg-emerald-50 rounded-xl p-3">
                                                <p className="text-[10px] text-emerald-600 font-bold uppercase mb-2">💰 Earnings</p>
                                                {[
                                                    { label: 'Basic Salary (40%)', value: breakdown.basic },
                                                    { label: 'HRA (50% of Basic)', value: breakdown.hra },
                                                    { label: 'Special Allowance', value: breakdown.special },
                                                ].map(item => (
                                                    <div key={item.label} className="flex justify-between text-xs py-1">
                                                        <span className="text-slate-600">{item.label}</span>
                                                        <span className="font-semibold text-slate-900">{fmt(item.value)}/yr</span>
                                                    </div>
                                                ))}
                                                <div className="border-t border-emerald-200 mt-2 pt-2 flex justify-between text-xs font-bold">
                                                    <span className="text-emerald-700">Gross Annual</span>
                                                    <span className="text-emerald-700">{fmt(breakdown.basic + breakdown.hra + breakdown.special)}</span>
                                                </div>
                                            </div>

                                            <div className="bg-red-50 rounded-xl p-3">
                                                <p className="text-[10px] text-red-600 font-bold uppercase mb-2">📉 Deductions</p>
                                                {[
                                                    { label: 'EPF Employee (12% of Basic)', value: breakdown.pf_employee },
                                                    { label: 'Professional Tax', value: breakdown.professional_tax },
                                                    { label: 'Income Tax (New Regime)', value: breakdown.income_tax },
                                                ].map(item => (
                                                    <div key={item.label} className="flex justify-between text-xs py-1">
                                                        <span className="text-slate-600">{item.label}</span>
                                                        <span className="font-semibold text-red-600">-{fmt(item.value)}/yr</span>
                                                    </div>
                                                ))}
                                                <div className="border-t border-red-200 mt-2 pt-2 flex justify-between text-xs font-bold">
                                                    <span className="text-red-700">Total Deductions</span>
                                                    <span className="text-red-700">-{fmt(breakdown.pf_employee + breakdown.professional_tax + breakdown.income_tax)}</span>
                                                </div>
                                            </div>

                                            <div className="bg-slate-50 rounded-xl p-3">
                                                <p className="text-[10px] text-slate-500 font-bold uppercase mb-2">ℹ️ Hidden in CTC (Employer pays, not yours)</p>
                                                <div className="flex justify-between text-xs py-1">
                                                    <span className="text-slate-500">EPF Employer Contribution (12%)</span>
                                                    <span className="font-semibold text-slate-400">{fmt(breakdown.pf_employer)}/yr</span>
                                                </div>
                                                <p className="text-[10px] text-slate-400 mt-1 italic">This is part of your CTC but you never see it in your bank account</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* City Purchasing Power */}
                                    <div className="st-card p-5">
                                        <h3 className="font-bold text-sm text-slate-900 mb-3">🏙️ City Cost of Living — {city}</h3>
                                        <div className="space-y-2 mb-4">
                                            {[
                                                { label: '🏠 Shared Room / 1BHK Rent', value: cityData.rent },
                                                { label: '🍽️ Food & Groceries', value: cityData.food },
                                                { label: '🚌 Transport / Metro', value: cityData.transport },
                                            ].map(item => (
                                                <div key={item.label} className="flex justify-between text-xs">
                                                    <span className="text-slate-600">{item.label}</span>
                                                    <span className="font-semibold text-slate-900">{fmt(item.value)}/mo</span>
                                                </div>
                                            ))}
                                            <div className="border-t pt-2 flex justify-between text-xs font-bold">
                                                <span>Basic Living Cost</span>
                                                <span>{fmt(cityData.rent + cityData.food + cityData.transport)}/mo</span>
                                            </div>
                                        </div>
                                        <div className={`rounded-xl p-3 ${purchasingPower > 10000 ? 'bg-emerald-50' : purchasingPower > 0 ? 'bg-amber-50' : 'bg-red-50'}`}>
                                            <p className="text-xs text-slate-500 font-semibold mb-1">💵 Monthly Savings Potential</p>
                                            <p className={`text-xl font-bold ${purchasingPower > 10000 ? 'text-emerald-700' : purchasingPower > 0 ? 'text-amber-700' : 'text-red-700'}`}>
                                                {fmt(purchasingPower)}/month
                                            </p>
                                            <p className="text-[10px] text-slate-500 mt-1">
                                                {purchasingPower > 15000 ? 'Comfortable savings. You can invest ₹5K+ monthly.' :
                                                    purchasingPower > 5000 ? 'Tight but manageable. Consider shared accommodation.' :
                                                        purchasingPower > 0 ? 'Very tight. Minimize eating out. Share room with 2+ people.' :
                                                            'Warning: Your salary may not cover basic living costs in this city.'}
                                            </p>
                                        </div>

                                        {/* City Comparison */}
                                        <div className="mt-4">
                                            <p className="text-xs text-slate-500 font-semibold mb-2">🔄 Same salary in other cities:</p>
                                            <div className="grid grid-cols-2 gap-2">
                                                {Object.entries(CITY_COST_INDEX)
                                                    .filter(([c]) => c !== city)
                                                    .slice(0, 4)
                                                    .map(([c, data]) => {
                                                        const savings = breakdown.in_hand_monthly - (data.rent + data.food + data.transport);
                                                        return (
                                                            <div key={c} className="bg-slate-50 rounded-lg p-2 text-xs">
                                                                <p className="font-semibold text-slate-700">{c}</p>
                                                                <p className={`font-bold ${savings > purchasingPower ? 'text-emerald-600' : 'text-slate-500'}`}>
                                                                    Saves {fmt(savings)}/mo
                                                                </p>
                                                            </div>
                                                        );
                                                    })}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Growth Projection */}
                                    <div className="st-card p-5">
                                        <h3 className="font-bold text-sm text-slate-900 mb-3">📈 5-Year Salary Projection</h3>
                                        <div className="space-y-2">
                                            {[
                                                { year: 'Year 1', hike: 0, label: 'Current Offer' },
                                                { year: 'Year 2', hike: 0.10, label: '+10% avg hike' },
                                                { year: 'Year 3', hike: 0.22, label: '+12% (promotion year)' },
                                                { year: 'Year 5', hike: 0.50, label: 'With 1 company switch' },
                                                { year: 'Year 10', hike: 1.50, label: 'With 2 switches + growth' },
                                            ].map(proj => {
                                                const projCtc = breakdown.effective_ctc * (1 + proj.hike);
                                                const projBreakdown = calculateBreakdown(projCtc / 100000);
                                                return (
                                                    <div key={proj.year} className="flex items-center gap-3 bg-slate-50 rounded-lg p-2.5">
                                                        <span className="text-xs font-bold text-slate-500 w-16">{proj.year}</span>
                                                        <div className="flex-1">
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-xs text-slate-600">{proj.label}</span>
                                                                <span className="text-sm font-bold text-slate-900">{fmt(projBreakdown.in_hand_monthly)}/mo</span>
                                                            </div>
                                                            <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1">
                                                                <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${Math.min(100, (projCtc / (breakdown.effective_ctc * 3)) * 100)}%` }} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <p className="text-[10px] text-slate-400 mt-2 italic">* Projections based on typical Indian IT industry hike patterns. Actual results vary by performance and company.</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Market Benchmarks */}
                        <div className="st-card p-5">
                            <button onClick={() => setShowBenchmarks(!showBenchmarks)}
                                className="w-full flex items-center justify-between">
                                <h3 className="font-bold text-sm text-slate-900">📊 Fresher Salary Benchmarks 2025-26</h3>
                                <span className="text-slate-400">{showBenchmarks ? '▲' : '▼'}</span>
                            </button>
                            <AnimatePresence>
                                {showBenchmarks && (
                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden mt-3">
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                            {COMPANY_BENCHMARKS.map(b => (
                                                <div key={b.company} className="bg-slate-50 rounded-lg p-3">
                                                    <p className="font-semibold text-sm text-slate-900">{b.company}</p>
                                                    <p className="text-lg font-bold text-indigo-600">{b.avg} LPA</p>
                                                    <p className="text-[10px] text-slate-400">Range: {b.range} LPA</p>
                                                    <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">
                                                        In-hand: ~{fmt(Math.round(calculateBreakdown(b.avg).in_hand_monthly))}/mo
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Disclaimer */}
                        <div className="text-center text-[10px] text-slate-400 py-2">
                            <p>⚠️ This is an estimate. Actual salary structure varies by company. Tax calculated under New Regime FY 2025-26.</p>
                            <p>City cost estimates are approximate monthly averages for a single fresher.</p>
                        </div>
                    </div>
                </main>
                <BottomNav />
            </div>
        </div>
    );
}
