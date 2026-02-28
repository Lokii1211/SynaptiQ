'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';
import Link from 'next/link';

const PLANS = [
    {
        id: 'free', name: 'Free', price: '₹0', period: 'forever', tagline: 'Get started, no card needed',
        badge: '', color: 'from-slate-500 to-slate-600', popular: false,
        features: [
            { text: 'Full psychometric assessment (once)', included: true },
            { text: 'Daily coding challenge (unlimited)', included: true },
            { text: '75 practice problems/month', included: true },
            { text: '4 aptitude mini-tests/month', included: true },
            { text: '3 skill verifications/month', included: true },
            { text: 'AI Co-Pilot: 15 messages/month', included: true },
            { text: 'Basic public profile', included: true },
            { text: 'Campus Wars participation', included: true },
            { text: '100 connections', included: true },
            { text: 'Feed: 3 posts/week', included: true },
            { text: 'Solutions in 2 languages (Python + C++)', included: true },
            { text: 'Last 10 submissions history', included: true },
            { text: 'Unlimited problems', included: false },
            { text: 'All 8 language solutions', included: false },
            { text: 'AI Resume Builder', included: false },
            { text: 'Mock placement drives', included: false },
            { text: '1v1 Peer Battle', included: false },
        ],
    },
    {
        id: 'pro', name: 'Pro', price: '₹299', period: '/month', tagline: 'For serious placement prep', altPrice: '₹1,999/year — save 44%',
        badge: 'MOST POPULAR', color: 'from-indigo-600 to-violet-600', popular: true,
        features: [
            { text: 'Everything in Free +', included: true, highlight: true },
            { text: 'Unlimited practice problems', included: true },
            { text: 'Unlimited aptitude tests', included: true },
            { text: 'Unlimited skill verifications', included: true },
            { text: 'Unlimited AI Co-Pilot messages', included: true },
            { text: 'Solutions in ALL 8 languages', included: true },
            { text: 'Unlimited custom test input', included: true },
            { text: 'Full submissions history', included: true },
            { text: 'Runtime/memory percentile stats', included: true },
            { text: 'All company tags + frequency data', included: true },
            { text: 'Mock placement drives (unlimited)', included: true },
            { text: 'All 6 study plans + personalized AI plan', included: true },
            { text: 'Interview preparation module', included: true },
            { text: 'AI Resume Builder (unlimited downloads)', included: true },
            { text: '1v1 Peer Battle', included: true },
            { text: 'Unlimited connections', included: true },
            { text: 'Profile verification badge ✓', included: true },
            { text: 'Smart job alerts (CareerDNA-matched)', included: true },
            { text: 'Unlimited posts', included: true },
            { text: '"Pro" badge on profile', included: true },
            { text: 'Weekly AI mock interview', included: false },
            { text: 'Priority recruiter visibility', included: false },
        ],
    },
    {
        id: 'pro-plus', name: 'Pro Plus', price: '₹599', period: '/month', tagline: 'For maximum competitive edge',
        badge: 'BEST VALUE', color: 'from-amber-500 to-orange-600', popular: false,
        features: [
            { text: 'Everything in Pro +', included: true, highlight: true },
            { text: 'Weekly AI mock interview (full simulation)', included: true },
            { text: 'Resume reviewed by AI with scorecard', included: true },
            { text: 'Priority recruiter visibility (appear higher)', included: true },
            { text: 'Placement probability per company (predictive)', included: true },
            { text: 'Exclusive Pro Plus contests (better prizes)', included: true },
            { text: 'Mentored learning cohort access', included: true },
            { text: 'Campus Ambassador tools', included: true },
            { text: '3 months job alerts post-graduation', included: true },
            { text: 'Salary negotiation coaching (AI-powered)', included: true },
            { text: 'Company-specific interview prep kit', included: true },
            { text: 'Honest Mirror: full company readiness', included: true },
        ],
    },
];

const B2B_PLANS = [
    { name: 'Campus Plan', price: '₹50', unit: '/student/month', min: 'Min 200 students', features: ['All Pro features for students', 'T&P Officer dashboard', 'Student readiness analytics', 'Placement drive management', 'Campus Wars tracking', 'Custom assessments', 'NIRF/NAAC report generation'] },
    { name: 'Corporate Plan', price: '₹5,000', unit: '/recruiter/month', min: 'Per recruiter seat', features: ['Verified talent pool search', 'Skill-filtered candidates', 'Job posting on SkillTen', 'Assessment hosting', 'Direct messaging to candidates', 'Candidate pipeline management', 'Analytics dashboard'] },
    { name: 'Enterprise', price: 'Custom', unit: '', min: 'For large institutions', features: ['Custom pricing & SLA', 'Dedicated account manager', 'Custom learning paths', 'White-label option', 'API access', 'Priority support', 'On-campus training'] },
];

const TESTIMONIALS = [
    { name: 'Sneha R.', college: 'SKCT, Coimbatore', text: 'I cracked TCS in my first attempt. The aptitude mock tests were exactly like the real NQT. Pro paid for itself 100x.', plan: 'Pro', outcome: 'Placed at TCS' },
    { name: 'Arjun K.', college: 'PSG Tech', text: 'The AI Career Counselor told me I wasn\'t ready for Infosys — but gave me a 4-week plan. I followed it and got selected.', plan: 'Pro', outcome: 'Placed at Infosys' },
    { name: 'Priya M.', college: 'CEG Anna University', text: 'Study plans + daily challenge + streak tracker = the combo that got me from 0 problems to 200 in 3 months.', plan: 'Pro Plus', outcome: 'Placed at Zoho' },
];

const FAQ = [
    { q: 'Can I try Pro for free?', a: 'Yes! Start with the Free tier—it has genuine value. When you hit the limits of 75 problems/month or 15 AI messages/month, you\'ll know it\'s time to upgrade. We also offer a 7-day Pro trial for new users.' },
    { q: 'What happens if I don\'t get placed?', a: 'SkillTen Pro Plus comes with a placement-readiness promise. Complete the path, follow the plan, and if your Skillten Score doesn\'t improve by at least 20 points, we refund your subscription month.' },
    { q: 'Is the Free tier actually useful?', a: 'Absolutely. Free includes the full psychometric assessment, daily challenges, 75 problems/month, basic aptitude tests, and Campus Wars. Many students stay on Free until placement season approaches.' },
    { q: 'Can my college buy Pro for all students?', a: 'Yes! Our Campus Plan is ₹50/student/month (min 200 students). The T&P Officer gets a full dashboard with student readiness analytics, placement drive management, and more.' },
    { q: 'How does pricing compare to competitors?', a: 'LeetCode Premium is ₹2,900/month ($35). Coursera courses cost ₹3,000–₹30,000 each. SkillTen Pro at ₹299/month gives you everything: coding, aptitude, AI, career intelligence, and more.' },
    { q: 'Can I pay yearly?', a: 'Yes! SkillTen Pro is ₹1,999/year (saves 44% vs monthly). Pro Plus yearly plans coming soon.' },
];

export default function PricingPage() {
    const [isYearly, setIsYearly] = useState(false);
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

    return (
        <div className="min-h-screen bg-slate-50">
            <TopBar />
            <main className="pb-24 md:pb-8">
                {/* Hero */}
                <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-violet-950 text-white px-6 py-16 relative overflow-hidden">
                    <div className="absolute top-0 left-1/2 w-[600px] h-[600px] bg-indigo-500/15 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-violet-500/10 rounded-full translate-y-1/3 translate-x-1/4 blur-3xl" />
                    <div className="max-w-5xl mx-auto relative z-10 text-center">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                            <span className="text-xs tracking-widest uppercase text-indigo-300 font-semibold mb-4 block">Pricing</span>
                            <h1 className="text-4xl md:text-5xl font-bold mb-4 st-font-heading leading-tight">
                                Invest in Your Career.<br />Not in Expensive Courses.
                            </h1>
                            <p className="text-white/50 text-lg max-w-2xl mx-auto mb-8">
                                SkillTen Pro costs less than one Coursera certificate — but gives you coding,
                                aptitude, AI career guidance, placement intelligence, and more. All in one platform.
                            </p>
                            {/* Billing Toggle */}
                            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur rounded-full p-1 px-4">
                                <span className={`text-sm font-semibold ${!isYearly ? 'text-white' : 'text-white/50'}`}>Monthly</span>
                                <button onClick={() => setIsYearly(!isYearly)}
                                    className="relative w-12 h-6 bg-white/20 rounded-full transition-colors">
                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isYearly ? 'left-7' : 'left-1'}`} />
                                </button>
                                <span className={`text-sm font-semibold ${isYearly ? 'text-white' : 'text-white/50'}`}>
                                    Yearly <span className="text-emerald-400 text-xs ml-1">Save 44%</span>
                                </span>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Pricing Cards */}
                <div className="px-4 md:px-6 -mt-8 max-w-5xl mx-auto relative z-20">
                    <div className="grid md:grid-cols-3 gap-4">
                        {PLANS.map((plan, i) => (
                            <motion.div key={plan.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className={`relative rounded-2xl overflow-hidden ${plan.popular ? 'ring-2 ring-indigo-500 shadow-2xl shadow-indigo-500/20 scale-[1.02]' : 'shadow-lg'}`}
                            >
                                {plan.badge && (
                                    <div className={`absolute top-0 left-0 right-0 bg-gradient-to-r ${plan.color} text-center py-1.5`}>
                                        <span className="text-[10px] font-bold text-white tracking-widest uppercase">{plan.badge}</span>
                                    </div>
                                )}
                                <div className={`bg-white ${plan.badge ? 'pt-10' : 'pt-6'} pb-6 px-5 h-full flex flex-col`}>
                                    <h3 className="font-bold text-slate-900 text-lg">{plan.name}</h3>
                                    <p className="text-xs text-slate-400 mb-3">{plan.tagline}</p>
                                    <div className="mb-1">
                                        <span className={`text-3xl font-bold bg-gradient-to-r ${plan.color} bg-clip-text text-transparent`}>
                                            {plan.id === 'free' ? '₹0' : isYearly && plan.id === 'pro' ? '₹1,999' : plan.price}
                                        </span>
                                        <span className="text-slate-400 text-sm ml-1">
                                            {plan.id === 'free' ? 'forever' : isYearly && plan.id === 'pro' ? '/year' : plan.period}
                                        </span>
                                    </div>
                                    {plan.altPrice && !isYearly && (
                                        <p className="text-[10px] text-emerald-600 font-semibold mb-3">{plan.altPrice}</p>
                                    )}
                                    {isYearly && plan.id === 'pro' && (
                                        <p className="text-[10px] text-emerald-600 font-semibold mb-3">That&apos;s just ₹167/month — less than a movie ticket 🎬</p>
                                    )}

                                    <button className={`w-full py-3 rounded-xl text-sm font-bold transition-all mt-2 mb-4 ${plan.popular
                                        ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:shadow-lg hover:shadow-indigo-500/30'
                                        : plan.id === 'pro-plus'
                                            ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:shadow-lg hover:shadow-amber-500/30'
                                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                                        {plan.id === 'free' ? 'Get Started Free' : plan.id === 'pro' ? 'Start 7-Day Free Trial' : 'Start Pro Plus'}
                                    </button>

                                    <div className="space-y-2 flex-1">
                                        {plan.features.map((f, fi) => (
                                            <div key={fi} className={`flex items-start gap-2 text-xs ${f.included ? 'text-slate-700' : 'text-slate-300'}`}>
                                                <span className={`mt-0.5 shrink-0 ${f.included ? 'text-emerald-500' : 'text-slate-300'}`}>
                                                    {f.included ? '✓' : '—'}
                                                </span>
                                                <span className={f.highlight ? 'font-bold text-indigo-600' : ''}>{f.text}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Competitor Comparison */}
                <div className="px-4 md:px-6 py-12 max-w-5xl mx-auto">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                        <h2 className="text-xl font-bold text-slate-900 text-center mb-6 st-font-heading">How SkillTen Compares</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs">
                                <thead>
                                    <tr className="border-b border-slate-200">
                                        <th className="text-left py-3 px-3 text-slate-400 font-semibold">Feature</th>
                                        <th className="text-center py-3 px-2 text-slate-400 font-semibold">LeetCode Premium<br /><span className="text-red-400">₹2,900/mo</span></th>
                                        <th className="text-center py-3 px-2 text-slate-400 font-semibold">Coursera Plus<br /><span className="text-red-400">₹4,000/mo</span></th>
                                        <th className="text-center py-3 px-2 text-slate-400 font-semibold">LinkedIn Premium<br /><span className="text-red-400">₹1,800/mo</span></th>
                                        <th className="text-center py-3 px-2 font-bold bg-indigo-50 text-indigo-700 rounded-t-xl">SkillTen Pro<br /><span className="text-emerald-600">₹299/mo</span></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        ['Coding Problems', '✅ 3000+', '❌', '❌', '✅ Unlimited'],
                                        ['Aptitude Practice', '❌', '❌', '❌', '✅ Unlimited'],
                                        ['Company Tags + Frequency', '✅ Premium only', '❌', '❌', '✅ Free for all'],
                                        ['Solution Editorials', '✅ Premium only', '❌', '❌', '✅ Free for all'],
                                        ['AI Career Counselor', '❌', '❌', '❌', '✅ Unlimited'],
                                        ['Skill Verification (IRT)', '❌', '❌', '❌', '✅ Unlimited'],
                                        ['Salary Truth Calculator', '❌', '❌', '✅ Basic', '✅ Full (in-hand + city)'],
                                        ['Resume Builder', '❌', '❌', '✅ Basic', '✅ AI-powered'],
                                        ['Mock Placement Drive', '❌', '❌', '❌', '✅ Unlimited'],
                                        ['Campus Wars', '❌', '❌', '❌', '✅ Exclusive'],
                                        ['Honest Mirror (Readiness)', '❌', '❌', '❌', '✅ Exclusive'],
                                        ['India-First Design', '❌ US-centric', '❌ US-centric', '❌ US-centric', '✅ 100% India'],
                                    ].map(([feature, ...vals], ri) => (
                                        <tr key={ri} className="border-b border-slate-100 hover:bg-slate-50">
                                            <td className="py-2.5 px-3 text-slate-700 font-medium">{feature}</td>
                                            {vals.map((v, vi) => (
                                                <td key={vi} className={`py-2.5 px-2 text-center ${vi === 3 ? 'bg-indigo-50/50 font-semibold' : ''} ${String(v).startsWith('✅') ? 'text-emerald-600' : 'text-red-400'}`}>{v}</td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                </div>

                {/* B2B Plans */}
                <div className="px-4 md:px-6 py-8 max-w-5xl mx-auto">
                    <h2 className="text-xl font-bold text-slate-900 text-center mb-2 st-font-heading">For Colleges & Companies</h2>
                    <p className="text-sm text-slate-400 text-center mb-6">Partner with SkillTen to power your campus placements or hire verified talent</p>
                    <div className="grid md:grid-cols-3 gap-4">
                        {B2B_PLANS.map((plan, i) => (
                            <motion.div key={plan.name}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 + i * 0.1 }}
                                className="st-card p-5 hover:shadow-lg transition-all"
                            >
                                <h3 className="font-bold text-sm text-slate-900 mb-1">{plan.name}</h3>
                                <div className="mb-1">
                                    <span className="text-2xl font-bold text-indigo-600">{plan.price}</span>
                                    <span className="text-xs text-slate-400 ml-1">{plan.unit}</span>
                                </div>
                                <p className="text-[10px] text-slate-400 mb-3">{plan.min}</p>
                                <div className="space-y-1.5">
                                    {plan.features.map((f, fi) => (
                                        <div key={fi} className="flex items-start gap-1.5 text-xs text-slate-600">
                                            <span className="text-emerald-500 mt-0.5 shrink-0">✓</span>
                                            <span>{f}</span>
                                        </div>
                                    ))}
                                </div>
                                <button className="w-full mt-4 py-2.5 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-200 transition-colors">
                                    {plan.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Testimonials */}
                <div className="px-4 md:px-6 py-8 max-w-5xl mx-auto">
                    <h2 className="text-xl font-bold text-slate-900 text-center mb-6 st-font-heading">Students Who Upgraded, Got Placed</h2>
                    <div className="grid md:grid-cols-3 gap-4">
                        {TESTIMONIALS.map((t, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.1 }}
                                className="st-card p-5 relative">
                                <span className="absolute top-4 right-4 text-[10px] px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-md font-bold">{t.plan}</span>
                                <p className="text-xs text-slate-600 leading-relaxed mb-3 italic">"{t.text}"</p>
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-violet-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                        {t.name[0]}
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-900">{t.name}</p>
                                        <p className="text-[10px] text-slate-400">{t.college} · <span className="text-emerald-600 font-semibold">{t.outcome}</span></p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* FAQ */}
                <div className="px-4 md:px-6 py-8 max-w-3xl mx-auto">
                    <h2 className="text-xl font-bold text-slate-900 text-center mb-6 st-font-heading">Frequently Asked Questions</h2>
                    <div className="space-y-2">
                        {FAQ.map((item, i) => (
                            <div key={i} className="st-card overflow-hidden">
                                <button onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                                    className="w-full p-4 flex items-center justify-between text-left">
                                    <span className="text-sm font-semibold text-slate-900">{item.q}</span>
                                    <span className="text-slate-400 shrink-0 ml-2">{expandedFaq === i ? '▲' : '▼'}</span>
                                </button>
                                {expandedFaq === i && (
                                    <div className="px-4 pb-4">
                                        <p className="text-xs text-slate-600 leading-relaxed">{item.a}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div className="px-4 md:px-6 py-8 max-w-4xl mx-auto">
                    <div className="bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 rounded-2xl p-8 text-center text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
                        <h2 className="text-2xl font-bold mb-2 st-font-heading relative z-10">Start Your Placement Journey Today</h2>
                        <p className="text-white/60 text-sm mb-6 relative z-10">No credit card required. Start with Free, upgrade when you're ready.</p>
                        <div className="flex justify-center gap-3 relative z-10">
                            <Link href="/signup" className="px-6 py-3 bg-white text-indigo-700 text-sm font-bold rounded-xl hover:bg-slate-100 transition-colors">
                                Start Free →
                            </Link>
                            <Link href="/chat" className="px-6 py-3 bg-white/15 text-white text-sm font-semibold rounded-xl hover:bg-white/25 transition-colors border border-white/20">
                                Talk to AI Counselor
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
            <BottomNav />
        </div>
    );
}
