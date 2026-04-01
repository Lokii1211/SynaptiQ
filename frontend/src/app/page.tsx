'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { api, auth } from '@/lib/api';
import { Logo } from '@/components/brand/Logo';

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const steps = 60; const inc = target / steps; let cur = 0;
    const t = setInterval(() => { cur += inc; if (cur >= target) { setCount(target); clearInterval(t); } else setCount(Math.floor(cur)); }, 2000 / steps);
    return () => clearInterval(t);
  }, [target]);
  return <>{count.toLocaleString()}{suffix}</>;
}

export default function Home() {
  useEffect(() => { if (auth.isLoggedIn()) window.location.href = '/dashboard'; }, []);

  const features = [
    { icon: '🧬', title: 'Honest Mirror', desc: 'The truth about your career, not what you want to hear', color: 'from-indigo-500 to-violet-600' },
    { icon: '⚡', title: 'Daily Challenge', desc: 'Code every day. Build the habit that gets you hired.', color: 'from-amber-500 to-orange-600' },
    { icon: '📊', title: 'Mentixy Score™', desc: 'One number that shows where you stand — verified, not self-claimed', color: 'from-emerald-500 to-teal-600' },
    { icon: '⚔️', title: 'Campus Wars', desc: 'Your college needs you. Compete together. Rise together.', color: 'from-rose-500 to-pink-600' },
    { icon: '✅', title: 'Verified Skills', desc: 'Prove what you know. Beyond your resume. With percentile ranking.', color: 'from-cyan-500 to-blue-600' },
    { icon: '💬', title: 'AI Counselor', desc: 'Career advice that knows your actual profile, not generic tips', color: 'from-purple-500 to-violet-600' },
  ];

  const testimonials = [
    { name: 'Arjun M.', college: 'PICT Pune', result: 'Placed as Data Analyst · 5.8 LPA', quote: "I thought I wanted to be a developer. Mentixy showed me I'm better suited for data. The Honest Mirror saved me 2 years.", photo: '👨‍🎓' },
    { name: 'Priya S.', college: 'JNTU Hyderabad', result: 'Placed at Infosys · 4.5 LPA', quote: "The aptitude section is best I've used. Step-by-step explanations with shortcut tricks — better than any coaching class.", photo: '👩‍🎓' },
    { name: 'Rahul K.', college: 'VIT Bhopal', result: 'Placed as SDE · 8 LPA', quote: 'Campus Wars got our whole college hooked. 47 students from our batch got placed. Mentixy deserves credit for 30 of them.', photo: '🧑‍💻' },
  ];

  const comparison = [
    { feature: 'Career Assessment (4D)', mentixy: true, linkedin: false, leetcode: false, gfg: false },
    { feature: 'Daily Coding Challenge', mentixy: true, linkedin: false, leetcode: true, gfg: true },
    { feature: 'Aptitude Practice', mentixy: true, linkedin: false, leetcode: false, gfg: true },
    { feature: 'AI Career Counselor', mentixy: true, linkedin: false, leetcode: false, gfg: false },
    { feature: 'Campus Wars', mentixy: true, linkedin: false, leetcode: false, gfg: false },
    { feature: 'Verified Skills', mentixy: true, linkedin: true, leetcode: false, gfg: false },
    { feature: 'India Salary Data', mentixy: true, linkedin: true, leetcode: false, gfg: false },
    { feature: 'Solution After 3 Fails', mentixy: true, linkedin: false, leetcode: false, gfg: true },
    { feature: 'Parent Portal', mentixy: true, linkedin: false, leetcode: false, gfg: false },
    { feature: 'Mock Placement Drive', mentixy: true, linkedin: false, leetcode: false, gfg: false },
  ];

  const Check = () => <span className="text-emerald-500 font-bold">✓</span>;
  const Cross = () => <span className="text-slate-300">—</span>;

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-slate-100 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-5 py-3">
          <Logo size="md" href="/" />
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors hidden sm:block">Sign In</Link>
            <Link href="/signup" className="st-btn-primary text-sm py-2.5 px-5">Start Free Assessment</Link>
          </div>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section className="relative pt-16 pb-20 px-5 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 -left-20 w-72 h-72 bg-indigo-50 rounded-full blur-3xl opacity-60" />
          <div className="absolute top-40 -right-20 w-96 h-96 bg-violet-50 rounded-full blur-3xl opacity-60" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-indigo-50 text-indigo-700 px-3.5 py-1.5 rounded-full mb-6 border border-indigo-100">
              🇮🇳 Built for Indian Students
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-[1.1] mb-6 tracking-tight st-font-heading">
              Find your career.<br />
              <span className="st-gradient-text">Build it. Get placed.</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
              The AI career intelligence platform that tells you the truth —
              assessment, skill gaps, coding arena, aptitude practice — all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup" className="st-btn-primary text-base py-4 px-8 shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 transition-all">
                Start My Career Assessment →
              </Link>
              <Link href="#how" className="st-btn-secondary text-base py-4 px-8">
                See How It Works
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ SOCIAL PROOF BAR ═══ */}
      <section className="bg-slate-50 py-10 px-5 border-y border-slate-100">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: 10000, label: 'Students assessed', suffix: '+' },
            { value: 120, label: 'Colleges', suffix: '+' },
            { value: 87, label: 'Assessment completion', suffix: '%' },
            { value: 200, label: 'Coding problems', suffix: '+' },
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <p className="text-3xl md:text-4xl font-extrabold st-gradient-text tabular-nums">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══ THE PROBLEM ═══ */}
      <section className="py-20 px-5">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              You&apos;re working hard.<br />
              <span className="text-slate-400">But in the wrong direction?</span>
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '📊', stat: '1.2M', text: 'graduates every year. Only 20% get placed in matching roles.' },
              { icon: '🎯', stat: '0%', text: 'of generic advice is relevant to you. Your career needs YOUR data.' },
              { icon: '📝', stat: '89%', text: 'of resumes have unverified skills. Recruiters trust verified profiles.' },
            ].map((p, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}>
                <div className="st-card p-6 h-full border-l-4 border-l-indigo-500">
                  <span className="text-3xl mb-3 block">{p.icon}</span>
                  <p className="text-2xl font-extrabold text-indigo-600 mb-2">{p.stat}</p>
                  <p className="text-sm text-slate-600 leading-relaxed">{p.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section id="how" className="bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 py-20 px-5 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/4" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl font-bold mb-4">How Mentixy Works</h2>
          <p className="text-white/60 mb-12">Three steps. 25 minutes to your career DNA.</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Take the Assessment', desc: '45 questions in 25 minutes. No right or wrong answers. Pure self-discovery.' },
              { step: '02', title: 'Get Your Honest Mirror', desc: 'AI reveals your career archetype, top 3 matches, and what to work on — honestly.' },
              { step: '03', title: 'Build & Get Placed', desc: 'Practice daily. Verify skills. Apply to jobs — all from your Mentixy profile.' },
            ].map((item, i) => (
              <motion.div key={item.step} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.2 }}>
                <div className="relative">
                  <div className="w-14 h-14 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center text-xl font-bold mx-auto mb-4 border border-white/20">{item.step}</div>
                  {i < 2 && <div className="hidden md:block absolute top-7 left-[calc(50%+40px)] w-[calc(100%-80px)] h-px bg-white/20" />}
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-white/60 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section className="py-20 px-5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Why students switch to Mentixy</h2>
            <p className="text-slate-500 text-lg">Not features. Solutions. Built by people who understand Indian placements.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div className="st-card p-6 hover:shadow-xl group h-full">
                  <div className={`w-12 h-12 bg-gradient-to-br ${f.color} rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform shadow-sm`}>
                    {f.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{f.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ COMPARISON TABLE ═══ */}
      <section className="py-16 px-5 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">How Mentixy compares</h2>
            <p className="text-sm text-slate-500">Honest comparison. We don&apos;t claim to win everything.</p>
          </div>
          <div className="st-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left px-4 py-3 font-semibold text-slate-600">Feature</th>
                    <th className="px-4 py-3 font-bold text-indigo-600 text-center">Mentixy</th>
                    <th className="px-4 py-3 font-semibold text-slate-500 text-center">LinkedIn</th>
                    <th className="px-4 py-3 font-semibold text-slate-500 text-center">LeetCode</th>
                    <th className="px-4 py-3 font-semibold text-slate-500 text-center">GFG</th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.map((row, i) => (
                    <tr key={i} className={`border-b border-slate-100 ${i % 2 === 0 ? '' : 'bg-slate-50/50'}`}>
                      <td className="px-4 py-3 font-medium text-slate-700">{row.feature}</td>
                      <td className="px-4 py-3 text-center">{row.mentixy ? <Check /> : <Cross />}</td>
                      <td className="px-4 py-3 text-center">{row.linkedin ? <Check /> : <Cross />}</td>
                      <td className="px-4 py-3 text-center">{row.leetcode ? <Check /> : <Cross />}</td>
                      <td className="px-4 py-3 text-center">{row.gfg ? <Check /> : <Cross />}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section className="py-20 px-5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Real students. Real results.</h2>
            <p className="text-slate-500">Not testimonials. Placement stories.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}>
                <div className="st-card p-6 h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-violet-100 rounded-full flex items-center justify-center text-2xl">{t.photo}</div>
                    <div>
                      <p className="font-semibold text-sm text-slate-900">{t.name}</p>
                      <p className="text-xs text-slate-400">{t.college}</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed italic flex-1">&ldquo;{t.quote}&rdquo;</p>
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <p className="text-xs font-semibold text-emerald-600">✓ {t.result}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ INDIA-FIRST ═══ */}
      <section className="py-16 px-5">
        <div className="max-w-3xl mx-auto bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-8 md:p-12 border border-amber-200">
          <div className="text-center">
            <span className="text-4xl mb-4 block">🇮🇳</span>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Built India-First</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              A student from Nagpur whose parents want them to do UPSC, on ₹0 budget, using 3G data
              — IS our target user. Every feature is designed for them first.
            </p>
            <p className="text-sm text-slate-500 italic">
              &ldquo;If it works for them, it works for the IIT student too. The reverse is not true.&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="py-20 px-5 text-center bg-gradient-to-b from-white to-indigo-50">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Start with the assessment.<br />
            <span className="text-slate-400">It takes 25 minutes.</span>
          </h2>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">
            The assessment is where it begins. Everything after that — career matches, coding practice,
            skill verification — is personalized to YOUR result.
          </p>
          <Link href="/signup" className="st-btn-primary text-lg py-4 px-10 inline-block shadow-lg shadow-indigo-200 hover:shadow-xl transition-all">
            Start My Career Assessment →
          </Link>
          <p className="text-xs text-slate-400 mt-4">Free · No credit card · 10,000+ assessments taken</p>
        </motion.div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-5">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="mb-4">
                <Logo size="sm" />
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">AI Career Intelligence Platform built for Indian students. Discover · Plan · Achieve.</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Product</p>
              <div className="space-y-2">
                {['Assessment', 'Coding Arena', 'Aptitude', 'AI Counselor', 'Campus Wars'].map(l => (
                  <Link key={l} href="/signup" className="block text-xs text-slate-500 hover:text-white transition-colors">{l}</Link>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Resources</p>
              <div className="space-y-2">
                {[{ l: 'Help Center', h: '/help' }, { l: 'Privacy Policy', h: '/privacy' }, { l: 'Terms of Service', h: '/terms' }].map(({ l, h }) => (
                  <Link key={l} href={h} className="block text-xs text-slate-500 hover:text-white transition-colors">{l}</Link>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-white uppercase tracking-wider mb-3">For Institutions</p>
              <div className="space-y-2">
                {[{ l: 'Campus Command', h: '/campus-command' }, { l: 'Recruiter Portal', h: '/recruiter' }, { l: 'Parent Portal', h: '/parent' }].map(({ l, h }) => (
                  <Link key={l} href={h} className="block text-xs text-slate-500 hover:text-white transition-colors">{l}</Link>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-slate-500">© 2026 Mentixy. Built with ❤️ for Indian students.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
