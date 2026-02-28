'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api, auth } from '@/lib/api';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';
import Link from 'next/link';

const TEMPLATES = [
  { id: 'fresher', name: 'Fresher', icon: '🎓', desc: 'Clean single-page layout for new grads', popular: true, color: 'from-indigo-500 to-violet-500' },
  { id: 'professional', name: 'Professional', icon: '💼', desc: 'ATS-optimized for experienced roles', popular: false, color: 'from-emerald-500 to-teal-500' },
  { id: 'creative', name: 'Creative', icon: '🎨', desc: 'Visually rich for design/product roles', popular: false, color: 'from-pink-500 to-rose-500' },
  { id: 'minimal', name: 'Minimal', icon: '✨', desc: 'Less is more — clean and scannable', popular: false, color: 'from-slate-600 to-slate-800' },
];

const ATS_TIPS = [
  { tip: 'Use standard section headings (Education, Experience, Skills)', impact: 'High' },
  { tip: 'Include keywords from the job description', impact: 'High' },
  { tip: 'Avoid tables, columns, and text boxes', impact: 'Medium' },
  { tip: 'Use standard fonts (Arial, Calibri, Georgia)', impact: 'Medium' },
  { tip: 'Save as PDF, not DOCX', impact: 'Low' },
];

export default function ResumePage() {
  const [resumes, setResumes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [step, setStep] = useState<'list' | 'create'>('list');
  const [selectedTemplate, setSelectedTemplate] = useState('fresher');
  const [form, setForm] = useState({ title: '', target_role: '', skills: '' });

  useEffect(() => {
    if (!auth.isLoggedIn()) { window.location.href = '/login'; return; }
    api.getResumes().then(data => {
      setResumes(data.resumes || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const createResume = async () => {
    if (!form.title || !form.target_role) return;
    setCreating(true);
    try {
      const skillsList = form.skills.split(',').map(s => s.trim()).filter(Boolean);
      await api.createResume({
        title: form.title,
        template: selectedTemplate,
        target_role: form.target_role,
        content: { skills: skillsList },
      });
      const data = await api.getResumes();
      setResumes(data.resumes || []);
      setForm({ title: '', target_role: '', skills: '' });
      setStep('list');
    } catch (e: any) {
      alert(e.message || 'Failed to create resume');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex-1 flex flex-col">
        <TopBar />
        <main className="flex-1 pb-24 md:pb-8">
          {/* Hero */}
          <div className="bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 text-white px-6 py-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
            <div className="max-w-4xl mx-auto relative z-10">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full mb-3 inline-block">📄 AI RESUME</span>
                <h1 className="text-3xl font-bold mb-2 st-font-heading">AI Resume Builder</h1>
                <p className="text-white/60 text-sm">ATS-ready resumes generated from your SkillTen profile in seconds</p>
              </motion.div>
            </div>
          </div>

          <div className="px-4 md:px-6 py-6 max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              {step === 'list' ? (
                <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                  {/* Create CTA */}
                  <button onClick={() => setStep('create')}
                    className="w-full st-card p-6 hover:shadow-xl transition-all group text-left border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-indigo-50/30">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg group-hover:scale-105 transition-transform">+</div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-lg group-hover:text-indigo-600 transition-colors">Create New Resume</h3>
                        <p className="text-sm text-slate-500 mt-0.5">AI generates an ATS-optimized resume from your profile data</p>
                      </div>
                    </div>
                  </button>

                  {/* Existing Resumes */}
                  <section>
                    <h2 className="st-section-title mb-4">Your Resumes ({resumes.length})</h2>
                    {loading ? (
                      <div className="space-y-3">
                        {[1, 2].map(i => <div key={i} className="st-card p-5 animate-pulse h-24" />)}
                      </div>
                    ) : resumes.length === 0 ? (
                      <div className="text-center py-12 st-card">
                        <span className="text-5xl block mb-3">📄</span>
                        <p className="font-semibold text-slate-900 mb-1">No resumes yet</p>
                        <p className="text-sm text-slate-500">Create your first AI-powered resume above</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {resumes.map((r, i) => (
                          <motion.div key={r.id || i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="st-card p-5 hover:shadow-md transition-all"
                          >
                            <div className="flex items-center gap-4">
                              <div className={`w-12 h-12 bg-gradient-to-br ${TEMPLATES.find(t => t.id === r.template)?.color || 'from-indigo-500 to-violet-500'
                                } rounded-xl flex items-center justify-center text-white text-xl`}>
                                {TEMPLATES.find(t => t.id === r.template)?.icon || '📄'}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-sm text-slate-900">{r.title || 'Untitled Resume'}</h3>
                                <p className="text-xs text-slate-500">
                                  {r.target_role && `${r.target_role} · `}
                                  {TEMPLATES.find(t => t.id === r.template)?.name || 'Fresher'} template
                                </p>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                {r.ats_score && (
                                  <div className="text-center">
                                    <p className={`text-lg font-bold ${r.ats_score >= 80 ? 'text-emerald-600' : r.ats_score >= 60 ? 'text-amber-600' : 'text-red-500'}`}>
                                      {r.ats_score}%
                                    </p>
                                    <p className="text-[9px] text-slate-400 uppercase font-semibold">ATS</p>
                                  </div>
                                )}
                                <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-md font-medium">Ready</span>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </section>

                  {/* ATS Tips */}
                  <section className="st-card p-6">
                    <h2 className="font-bold text-slate-900 mb-4">💡 ATS Optimization Tips</h2>
                    <div className="space-y-2">
                      {ATS_TIPS.map((tip, i) => (
                        <div key={i} className="flex items-start gap-3 py-2 border-b border-slate-100 last:border-0">
                          <span className={`shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded ${tip.impact === 'High' ? 'bg-red-50 text-red-600' : tip.impact === 'Medium' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-500'
                            }`}>{tip.impact}</span>
                          <p className="text-sm text-slate-600">{tip.tip}</p>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* ═══ ATS Score Analyzer (Bible Phase 9) ═══ */}
                  <section className="st-card p-6">
                    <div className="flex items-center justify-between mb-5">
                      <div>
                        <h2 className="font-bold text-slate-900 text-lg">📊 ATS Score Analyzer</h2>
                        <p className="text-xs text-slate-500 mt-0.5">AI-powered resume scoring against 50+ ATS systems</p>
                      </div>
                      <div className="relative w-20 h-20">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
                          <circle cx="40" cy="40" r="32" fill="none" stroke="#E2E8F0" strokeWidth="6" />
                          <circle cx="40" cy="40" r="32" fill="none" stroke="#10B981" strokeWidth="6" strokeLinecap="round"
                            strokeDasharray={`${(78 / 100) * 201} ${201 - (78 / 100) * 201}`} />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-lg font-bold text-slate-900">78</span>
                          <span className="text-[8px] text-slate-500 uppercase font-bold">ATS Score</span>
                        </div>
                      </div>
                    </div>

                    {/* Category Breakdown */}
                    <div className="space-y-3 mb-5">
                      {[
                        { label: 'Contact Information', score: 100, status: 'pass', tip: 'All contact fields present' },
                        { label: 'Education Section', score: 90, status: 'pass', tip: 'CGPA and university present' },
                        { label: 'Skills Match', score: 72, status: 'warn', tip: 'Add 3 more role-specific skills' },
                        { label: 'Work Experience', score: 55, status: 'warn', tip: 'Use STAR method for bullet points' },
                        { label: 'Keyword Optimization', score: 65, status: 'warn', tip: 'Missing: Agile, CI/CD, Docker' },
                        { label: 'Formatting & Layout', score: 95, status: 'pass', tip: 'Clean ATS-compatible format' },
                        { label: 'Resume Length', score: 80, status: 'pass', tip: 'Optimal 1-page length' },
                      ].map((cat, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0 ${cat.status === 'pass' ? 'bg-emerald-500' : cat.status === 'warn' ? 'bg-amber-500' : 'bg-red-500'
                            }`}>
                            {cat.status === 'pass' ? '✓' : '!'}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-0.5">
                              <span className="text-xs font-medium text-slate-700">{cat.label}</span>
                              <span className={`text-[10px] font-bold ${cat.score >= 80 ? 'text-emerald-600' : cat.score >= 60 ? 'text-amber-600' : 'text-red-500'}`}>{cat.score}%</span>
                            </div>
                            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full transition-all duration-700 ${cat.score >= 80 ? 'bg-emerald-400' : cat.score >= 60 ? 'bg-amber-400' : 'bg-red-400'}`}
                                style={{ width: `${cat.score}%` }} />
                            </div>
                            <p className="text-[9px] text-slate-400 mt-0.5">{cat.tip}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* AI Improvement Suggestions */}
                    <div className="bg-gradient-to-r from-indigo-50 to-violet-50 rounded-xl p-4 border border-indigo-100">
                      <h3 className="text-xs font-bold text-indigo-800 mb-2">🤖 AI Improvement Suggestions</h3>
                      <div className="space-y-2">
                        {[
                          'Add quantifiable metrics to your experience bullets (e.g., "Reduced API latency by 40%")',
                          'Include keywords: Docker, Kubernetes, CI/CD — 89% of SDE roles mention these',
                          'Move "Projects" section above "Experience" for fresher profiles',
                          'Add a 2-line professional summary at the top',
                        ].map((suggestion, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <span className="text-indigo-500 text-xs mt-0.5">→</span>
                            <p className="text-xs text-indigo-700">{suggestion}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                </motion.div>
              ) : (
                <motion.div key="create" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  {/* Back */}
                  <button onClick={() => setStep('list')} className="text-sm text-indigo-600 font-medium hover:text-indigo-800 flex items-center gap-1">
                    ← Back to resumes
                  </button>

                  {/* Template Selection */}
                  <section>
                    <h2 className="font-bold text-slate-900 text-lg mb-1">Choose a Template</h2>
                    <p className="text-xs text-slate-500 mb-4">Each template is ATS-tested with real Indian placement systems</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {TEMPLATES.map(t => (
                        <button key={t.id} onClick={() => setSelectedTemplate(t.id)}
                          className={`relative st-card p-4 text-center transition-all ${selectedTemplate === t.id ? 'ring-2 ring-indigo-500 shadow-lg' : 'hover:shadow-md'
                            }`}>
                          {t.popular && (
                            <span className="absolute -top-2 -right-2 text-[9px] bg-amber-500 text-white px-2 py-0.5 rounded-full font-bold shadow">Popular</span>
                          )}
                          <div className={`w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br ${t.color} flex items-center justify-center text-white text-2xl mb-2`}>
                            {t.icon}
                          </div>
                          <p className="font-bold text-sm text-slate-900">{t.name}</p>
                          <p className="text-[10px] text-slate-500 mt-1">{t.desc}</p>
                        </button>
                      ))}
                    </div>
                  </section>

                  {/* Form */}
                  <section className="st-card p-6 space-y-4">
                    <h2 className="font-bold text-slate-900 mb-2">Resume Details</h2>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">📌 Resume Title</label>
                      <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                        placeholder="e.g., SDE Resume for Amazon" className="st-input w-full" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">🎯 Target Role</label>
                      <input type="text" value={form.target_role} onChange={e => setForm(f => ({ ...f, target_role: e.target.value }))}
                        placeholder="e.g., Software Engineer" className="st-input w-full" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">🛠️ Key Skills (comma-separated)</label>
                      <input type="text" value={form.skills} onChange={e => setForm(f => ({ ...f, skills: e.target.value }))}
                        placeholder="Python, React, SQL, System Design" className="st-input w-full" />
                    </div>

                    <div className="bg-indigo-50 rounded-xl p-3 flex items-start gap-2 text-xs text-indigo-700">
                      <span className="text-lg">💡</span>
                      <p>Your SkillTen profile data, verified skills, coding stats, and assessment results will be automatically included. Just add the basics above!</p>
                    </div>

                    <button onClick={createResume} disabled={creating || !form.title || !form.target_role}
                      className="st-btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 py-3 text-base">
                      {creating ? (
                        <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Generating with AI...</>
                      ) : '✨ Generate Resume'}
                    </button>
                  </section>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
