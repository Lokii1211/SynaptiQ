'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { api, auth } from '@/lib/api';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';

export default function ResumePage() {
  const [resumes, setResumes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ title: '', target_role: '', template: 'fresher', skills: '' });

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
        template: form.template,
        target_role: form.target_role,
        content: { skills: skillsList },
      });
      const data = await api.getResumes();
      setResumes(data.resumes || []);
      setForm({ title: '', target_role: '', template: 'fresher', skills: '' });
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
          <div className="bg-white border-b border-slate-200 px-6 py-6">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">📄 AI Resume Builder</h1>
            <p className="text-slate-500 text-sm">ATS-ready resumes generated from your SkillTen profile</p>
          </div>

          <div className="px-4 md:px-6 py-6 max-w-4xl mx-auto space-y-6">
            {/* Create new */}
            <section className="st-card p-6">
              <h2 className="font-semibold text-slate-900 mb-4">Create New Resume</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Title</label>
                  <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    placeholder="e.g., SDE Resume" className="st-input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Target Role</label>
                  <input type="text" value={form.target_role} onChange={e => setForm(f => ({ ...f, target_role: e.target.value }))}
                    placeholder="e.g., Software Engineer" className="st-input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Template</label>
                  <select value={form.template} onChange={e => setForm(f => ({ ...f, template: e.target.value }))}
                    className="st-input">
                    <option value="fresher">Fresher</option>
                    <option value="experienced">Experienced</option>
                    <option value="creative">Creative</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Key Skills (comma-separated)</label>
                  <input type="text" value={form.skills} onChange={e => setForm(f => ({ ...f, skills: e.target.value }))}
                    placeholder="Python, React, SQL" className="st-input" />
                </div>
              </div>
              <button onClick={createResume} disabled={creating || !form.title || !form.target_role}
                className="st-btn-primary mt-4 flex items-center gap-2 disabled:opacity-50">
                {creating ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Generating...</>
                ) : '✨ Generate Resume'}
              </button>
            </section>

            {/* Existing resumes */}
            <section>
              <h2 className="st-section-title mb-4">Your Resumes</h2>
              {loading ? (
                <div className="space-y-3">
                  {[1, 2].map(i => <div key={i} className="st-card p-5 animate-pulse h-20" />)}
                </div>
              ) : resumes.length === 0 ? (
                <div className="text-center py-12 st-card">
                  <span className="text-4xl block mb-3">📄</span>
                  <p className="text-slate-500">No resumes yet. Create your first one above!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {resumes.map((r, i) => (
                    <motion.div key={r.id || i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="st-card p-5 flex items-center justify-between"
                    >
                      <div>
                        <h3 className="font-semibold text-slate-900">{r.title || 'Untitled Resume'}</h3>
                        <p className="text-xs text-slate-500">
                          {r.target_role && `${r.target_role} • `}
                          {r.template || 'fresher'} template
                        </p>
                      </div>
                      <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-md font-medium">
                        {r.ats_score ? `ATS: ${r.ats_score}%` : 'Ready'}
                      </span>
                    </motion.div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
