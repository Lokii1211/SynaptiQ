'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { api, auth } from '@/lib/api';

export default function ParentPage() {
    const [report, setReport] = useState<any>(null);
    const [salaryResult, setSalaryResult] = useState<any>(null);
    const [salaryForm, setSalaryForm] = useState({ ctc_lpa: '', role: '', city: '' });
    const [loadingReport, setLoadingReport] = useState(false);
    const [loadingSalary, setLoadingSalary] = useState(false);
    const [activeTab, setActiveTab] = useState<'overview' | 'report' | 'salary'>('overview');

    const fetchReport = async () => {
        if (!auth.isLoggedIn()) return;
        setLoadingReport(true);
        try {
            const r = await api.aiParentReport();
            setReport(r);
        } catch { }
        setLoadingReport(false);
    };

    const checkSalary = async () => {
        if (!salaryForm.ctc_lpa || !salaryForm.role || !salaryForm.city) return;
        setLoadingSalary(true);
        try {
            const r = await api.aiSalaryTruth({
                ctc_lpa: parseFloat(salaryForm.ctc_lpa),
                role: salaryForm.role,
                city: salaryForm.city,
            });
            setSalaryResult(r);
        } catch { }
        setLoadingSalary(false);
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Nav */}
            <nav className="bg-white border-b border-slate-100 px-6 py-3">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-lg flex items-center justify-center text-white font-bold text-[10px]">ST</div>
                        <span className="text-base font-bold text-slate-900">Skill<span className="text-indigo-600">Ten</span></span>
                    </Link>
                    {auth.isLoggedIn() && (
                        <Link href="/dashboard" className="text-sm text-indigo-600 font-medium hover:underline">Dashboard</Link>
                    )}
                </div>
            </nav>

            {/* Hero */}
            <section className="bg-gradient-to-br from-amber-50 to-orange-50 px-6 py-16 text-center">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <span className="text-5xl block mb-4">👨‍👩‍👧‍👦</span>
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">For Parents</h1>
                    <p className="text-slate-500 text-lg max-w-xl mx-auto">
                        Understand what your child is doing on SkillTen and why it matters for their career
                    </p>
                </motion.div>
            </section>

            {/* Tabs */}
            <div className="max-w-3xl mx-auto px-6 pt-6">
                <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
                    {[
                        { id: 'overview' as const, label: '📋 Overview' },
                        { id: 'report' as const, label: '📊 Weekly Report' },
                        { id: 'salary' as const, label: '💰 Salary Truth' },
                    ].map(t => (
                        <button key={t.id} onClick={() => setActiveTab(t.id)}
                            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${activeTab === t.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >{t.label}</button>
                    ))}
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-6 py-8 space-y-8">
                <AnimatePresence mode="wait">
                    {activeTab === 'overview' && (
                        <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                            {/* What is SkillTen */}
                            <section>
                                <h2 className="text-2xl font-bold text-slate-900 mb-4">What is SkillTen?</h2>
                                <p className="text-slate-600 leading-relaxed mb-4">
                                    SkillTen is an AI-powered career guidance platform designed for Indian students. Unlike traditional
                                    career counseling (which can cost ₹5,000-50,000), SkillTen provides the same quality of career
                                    assessment and guidance for free.
                                </p>
                                <div className="grid md:grid-cols-3 gap-4">
                                    {[
                                        { icon: '🧬', title: 'Career Assessment', desc: 'Scientific psychometric test that identifies your child\'s natural strengths and ideal career paths' },
                                        { icon: '💻', title: 'Skill Building', desc: 'Coding practice, interview prep, and learning roadmaps — all using free resources' },
                                        { icon: '📊', title: 'SkillTen Score', desc: 'A verified score that proves their skills to recruiters — like a CIBIL score for careers' },
                                    ].map((item) => (
                                        <div key={item.title} className="st-card p-5">
                                            <span className="text-2xl block mb-2">{item.icon}</span>
                                            <h3 className="font-semibold text-slate-900 text-sm mb-1">{item.title}</h3>
                                            <p className="text-xs text-slate-500">{item.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* How it helps */}
                            <section>
                                <h2 className="text-2xl font-bold text-slate-900 mb-4">How This Helps Your Child</h2>
                                <div className="space-y-3">
                                    {[
                                        { emoji: '🎯', title: 'Career Clarity', text: 'Instead of guessing, your child discovers careers that match their actual strengths — backed by AI analysis, not opinions.' },
                                        { emoji: '📈', title: 'Measurable Progress', text: 'Every action (solving problems, learning skills, building projects) contributes to their SkillTen Score — visible to recruiters.' },
                                        { emoji: '🏢', title: 'Placement Readiness', text: 'Company-specific preparation for TCS, Infosys, Wipro, and product companies. Real patterns, real questions.' },
                                        { emoji: '💪', title: 'Confidence', text: 'When they know their strengths and have data to prove it, interviews become much less stressful.' },
                                    ].map(item => (
                                        <div key={item.title} className="st-card p-5 flex gap-4">
                                            <span className="text-2xl">{item.emoji}</span>
                                            <div>
                                                <h3 className="font-semibold text-slate-900 text-sm mb-1">{item.title}</h3>
                                                <p className="text-xs text-slate-500">{item.text}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* FAQs */}
                            <section>
                                <h2 className="text-2xl font-bold text-slate-900 mb-4">Common Questions</h2>
                                <div className="space-y-3">
                                    {[
                                        { q: 'Is it really free?', a: 'Yes. SkillTen is completely free for students. We don\'t sell courses or charge for assessments. Our mission is to make career guidance accessible to every Indian student.' },
                                        { q: 'Is my child\'s data safe?', a: 'Absolutely. We follow strict data privacy practices. Your child\'s assessment results and personal information are never shared without their explicit consent.' },
                                        { q: 'How is this different from Naukri/LinkedIn?', a: 'Those platforms are for experienced professionals. SkillTen is built specifically for students and freshers — with features like career assessment, coding arena, and college-specific guidance.' },
                                        { q: 'Will this replace their college placement cell?', a: 'No. SkillTen complements college placements by helping students prepare better, discover careers they might not have considered, and build verifiable skills.' },
                                        { q: 'My child wants to do engineering but I think they should do MBA/UPSC...', a: 'Our career assessment is unbiased and based on your child\'s actual strengths and interests. It often reveals career paths that neither parents nor students had considered — and that\'s where the best outcomes happen.' },
                                    ].map((faq, i) => (
                                        <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }}
                                            className="st-card p-5">
                                            <h3 className="font-semibold text-slate-900 text-sm mb-2">❓ {faq.q}</h3>
                                            <p className="text-sm text-slate-600 leading-relaxed">{faq.a}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            </section>
                        </motion.div>
                    )}

                    {activeTab === 'report' && (
                        <motion.div key="report" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                            <div className="text-center">
                                <h2 className="text-2xl font-bold text-slate-900 mb-2">Weekly Progress Report</h2>
                                <p className="text-slate-500 text-sm mb-6">See how your child is progressing — in plain language, no tech jargon</p>
                                {!auth.isLoggedIn() ? (
                                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                                        <p className="text-amber-800 text-sm mb-3">Your child needs to share their login or use the Family Invite feature for you to see their report.</p>
                                        <Link href="/login" className="st-btn-primary px-6 inline-block">Login</Link>
                                    </div>
                                ) : (
                                    <button onClick={fetchReport} disabled={loadingReport}
                                        className="st-btn-primary px-8 py-3 disabled:opacity-50">
                                        {loadingReport ? 'Generating Report...' : '📊 Generate Weekly Report'}
                                    </button>
                                )}
                            </div>

                            {report && (
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                                    {/* Summary card */}
                                    <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl p-6 border border-indigo-100">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="font-bold text-slate-900">{report.student_name}&apos;s Week</h3>
                                            <span className={`text-xs font-medium px-3 py-1 rounded-full ${report.is_on_track === 'YES' ? 'bg-green-100 text-green-700' :
                                                    report.is_on_track === 'PARTIALLY' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-red-100 text-red-700'
                                                }`}>
                                                {report.is_on_track === 'YES' ? '✅ On Track' :
                                                    report.is_on_track === 'PARTIALLY' ? '⚠️ Partially On Track' :
                                                        '🔴 Needs Attention'}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            <div className="bg-white rounded-xl p-3 text-center">
                                                <p className="text-2xl font-bold text-indigo-600">{report.weekly_summary?.problems_solved || 0}</p>
                                                <p className="text-[10px] text-slate-500">Problems Solved</p>
                                            </div>
                                            <div className="bg-white rounded-xl p-3 text-center">
                                                <p className="text-2xl font-bold text-violet-600">{report.weekly_summary?.modules_completed || 0}</p>
                                                <p className="text-[10px] text-slate-500">Modules Done</p>
                                            </div>
                                            <div className="bg-white rounded-xl p-3 text-center">
                                                <p className="text-2xl font-bold text-orange-600">{report.weekly_summary?.streak_days || 0}🔥</p>
                                                <p className="text-[10px] text-slate-500">Day Streak</p>
                                            </div>
                                            <div className="bg-white rounded-xl p-3 text-center">
                                                <p className="text-2xl font-bold text-teal-600">{report.weekly_summary?.hours_spent || 0}h</p>
                                                <p className="text-[10px] text-slate-500">Hours Spent</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Readiness */}
                                    {report.placement_readiness && (
                                        <div className="st-card p-5">
                                            <h4 className="font-semibold text-slate-900 text-sm mb-3">Placement Readiness</h4>
                                            <div className="flex items-center gap-4">
                                                <div className="flex-1">
                                                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${report.placement_readiness.percentage}%` }}
                                                            transition={{ duration: 1 }}
                                                            className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
                                                        />
                                                    </div>
                                                </div>
                                                <span className="text-lg font-bold text-indigo-600">{report.placement_readiness.percentage}%</span>
                                            </div>
                                            {report.placement_readiness.change_from_last_week > 0 && (
                                                <p className="text-xs text-green-600 mt-2">↑ +{report.placement_readiness.change_from_last_week}% from last week</p>
                                            )}
                                        </div>
                                    )}

                                    {/* What they worked on */}
                                    {report.this_weeks_focus && (
                                        <div className="st-card p-5">
                                            <h4 className="font-semibold text-slate-900 text-sm mb-2">📚 What They Worked On</h4>
                                            <p className="text-sm text-slate-600 leading-relaxed">{report.this_weeks_focus}</p>
                                        </div>
                                    )}

                                    {/* Career brief */}
                                    {report.career_brief && (
                                        <div className="st-card p-5 bg-amber-50 border-amber-200">
                                            <h4 className="font-semibold text-slate-900 text-sm mb-3">💼 Career: {report.career_brief.career_name}</h4>
                                            <div className="space-y-2 text-sm text-slate-600">
                                                <p><strong>What they&apos;ll do:</strong> {report.career_brief.what_they_do}</p>
                                                <p><strong>Salary reality:</strong> {report.career_brief.salary_reality}</p>
                                                <p><strong>Job security:</strong> {report.career_brief.job_security}</p>
                                                <p><strong>Typical cities:</strong> {report.career_brief.typical_locations}</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Positive highlight */}
                                    {report.positive_highlight && (
                                        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                                            <p className="text-sm text-green-800">🌟 {report.positive_highlight}</p>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </motion.div>
                    )}

                    {activeTab === 'salary' && (
                        <motion.div key="salary" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                            <div className="text-center">
                                <h2 className="text-2xl font-bold text-slate-900 mb-2">Salary Truth Checker</h2>
                                <p className="text-slate-500 text-sm mb-6">
                                    Companies quote CTC (Cost To Company). Here&apos;s what your child actually takes home.
                                </p>
                            </div>

                            {/* Input */}
                            <div className="st-card p-6 space-y-4">
                                <div>
                                    <label className="text-xs font-medium text-slate-600 mb-1 block">CTC offered (LPA)</label>
                                    <input type="number" step="0.5" placeholder="e.g. 8.5"
                                        value={salaryForm.ctc_lpa}
                                        onChange={e => setSalaryForm(p => ({ ...p, ctc_lpa: e.target.value }))}
                                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-medium text-slate-600 mb-1 block">Role</label>
                                        <input type="text" placeholder="e.g. Software Engineer"
                                            value={salaryForm.role}
                                            onChange={e => setSalaryForm(p => ({ ...p, role: e.target.value }))}
                                            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-slate-600 mb-1 block">City</label>
                                        <input type="text" placeholder="e.g. Bangalore"
                                            value={salaryForm.city}
                                            onChange={e => setSalaryForm(p => ({ ...p, city: e.target.value }))}
                                            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                </div>
                                <button onClick={checkSalary} disabled={loadingSalary || !salaryForm.ctc_lpa || !salaryForm.role || !salaryForm.city}
                                    className="w-full st-btn-primary py-3 disabled:opacity-50">
                                    {loadingSalary ? 'Calculating...' : '💰 Show Me The Truth'}
                                </button>
                            </div>

                            {salaryResult && (
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                                    {/* Key figure */}
                                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 text-center border border-green-200">
                                        <p className="text-xs text-slate-500 mb-1">Monthly In-Hand (After Tax + PF)</p>
                                        <p className="text-4xl font-bold text-green-700">{salaryResult.monthly_inhand}</p>
                                        <p className="text-xs text-slate-500 mt-2">{salaryResult.percentile_vs_similar}</p>
                                    </div>

                                    {/* Breakdown */}
                                    {salaryResult.monthly_breakdown && (
                                        <div className="st-card p-5">
                                            <h4 className="font-semibold text-slate-900 text-sm mb-3">Monthly Salary Breakdown</h4>
                                            <div className="space-y-2 text-sm">
                                                {Object.entries(salaryResult.monthly_breakdown).map(([k, v]) => (
                                                    <div key={k} className="flex justify-between">
                                                        <span className="text-slate-500 capitalize">{k.replace(/_/g, ' ')}</span>
                                                        <span className={`font-medium ${k.includes('deduction') || k.includes('tax') ? 'text-red-600' : 'text-slate-900'}`}>
                                                            {k.includes('deduction') || k.includes('tax') ? '-' : ''}{v as string}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Cost of living */}
                                    {salaryResult.cost_of_living && (
                                        <div className="st-card p-5">
                                            <h4 className="font-semibold text-slate-900 text-sm mb-3">Cost of Living in {salaryForm.city}</h4>
                                            <div className="space-y-2 text-sm">
                                                {Object.entries(salaryResult.cost_of_living).map(([k, v]) => (
                                                    <div key={k} className="flex justify-between">
                                                        <span className="text-slate-500 capitalize">{k.replace(/_/g, ' ')}</span>
                                                        <span className="font-medium text-slate-900">{v as string}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Growth */}
                                    {salaryResult.growth_trajectory && (
                                        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
                                            <p className="text-sm text-indigo-800">📈 {salaryResult.growth_trajectory}</p>
                                        </div>
                                    )}

                                    {/* Verdict */}
                                    {salaryResult.honest_verdict && (
                                        <div className="bg-slate-900 text-white rounded-xl p-5">
                                            <h4 className="font-semibold text-sm mb-2">🎯 Honest Verdict</h4>
                                            <p className="text-sm text-slate-300 leading-relaxed">{salaryResult.honest_verdict}</p>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* CTA */}
                <div className="bg-indigo-50 rounded-2xl p-8 text-center border border-indigo-100">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Want to try it yourself?</h3>
                    <p className="text-sm text-slate-500 mb-4">Create a free account and take the assessment — it takes 5 minutes</p>
                    <Link href="/signup" className="st-btn-primary px-8 inline-block">Try SkillTen Free →</Link>
                </div>
            </div>
        </div>
    );
}
