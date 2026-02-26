'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { auth } from '@/lib/api';

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const steps = 60; const inc = target / steps;
    let cur = 0;
    const t = setInterval(() => {
      cur += inc;
      if (cur >= target) { setCount(target); clearInterval(t); }
      else setCount(Math.floor(cur));
    }, 2000 / steps);
    return () => clearInterval(t);
  }, [target]);
  return <>{count.toLocaleString()}{suffix}</>;
}

export default function Home() {
  useEffect(() => {
    if (auth.isLoggedIn()) window.location.href = '/dashboard';
  }, []);

  const features = [
    { icon: '🧬', title: '4D Career Profiling', desc: 'AI-powered psychometric assessment that maps your strengths across 4 dimensions', color: 'from-indigo-500 to-violet-600' },
    { icon: '💻', title: 'Coding Arena', desc: 'LeetCode-style problems with AI code review — practice where it matters', color: 'from-emerald-500 to-teal-600' },
    { icon: '📊', title: 'SkillTen Score™', desc: 'One number that proves your readiness. Verified skills, not self-claims.', color: 'from-amber-500 to-orange-600' },
    { icon: '💼', title: 'Smart Job Match', desc: 'AI matches you to openings based on your profile, not keywords', color: 'from-rose-500 to-pink-600' },
    { icon: '🗺️', title: 'AI Roadmaps', desc: 'Personalized learning paths with free resources from the internet', color: 'from-cyan-500 to-blue-600' },
    { icon: '💬', title: 'AI Career Advisor', desc: 'Ask anything about careers, salaries, interview prep — gets context from your profile', color: 'from-purple-500 to-violet-600' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">ST</div>
            <span className="text-lg font-bold text-slate-900">Skill<span className="text-indigo-600">Ten</span></span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Sign In</Link>
            <Link href="/signup" className="st-btn-primary text-sm py-2 px-5">Get Started Free</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-16 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="inline-block text-xs font-semibold bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full mb-6">
              🇮🇳 Built for Indian Students
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 leading-tight mb-6">
              Your Career DNA,<br />
              <span className="st-gradient-text">Decoded by AI</span>
            </h1>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
              SkillTen is the AI career intelligence platform that tells you the truth about your career —
              assessment, skill gaps, job matching, coding arena — all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup" className="st-btn-primary text-base py-4 px-8">
                Take the Assessment — Free →
              </Link>
              <Link href="#features" className="st-btn-secondary text-base py-4 px-8">
                See How It Works
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-slate-50 py-12 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: 10000, label: 'Students assessed', suffix: '+' },
            { value: 50, label: 'Career paths', suffix: '+' },
            { value: 94, label: 'Accuracy rate', suffix: '%' },
            { value: 200, label: 'Coding problems', suffix: '+' },
          ].map((stat) => (
            <motion.div key={stat.label}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-3xl md:text-4xl font-bold st-gradient-text">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Everything you need for your career</h2>
            <p className="text-slate-500 text-lg">One platform, zero BS. Built by people who understand Indian placements.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div key={f.title}
                initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="st-card p-6 hover:shadow-xl group"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${f.color} rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}>
                  {f.icon}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 py-20 px-6 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">How SkillTen Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Take the Assessment', desc: 'Answer our 4D career profiling questions. 5-7 minutes. No right or wrong answers.' },
              { step: '02', title: 'Get Your Career DNA', desc: 'AI reveals your career archetype, strengths, and top 5 career matches.' },
              { step: '03', title: 'Build Your Profile', desc: 'Practice coding, build skills, apply to jobs — all from your SkillTen profile.' },
            ].map((item) => (
              <div key={item.step}>
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-4">{item.step}</div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-white/70 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* India-first callout */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-8 md:p-12 border border-amber-200">
          <div className="text-center">
            <span className="text-4xl mb-4 block">🇮🇳</span>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Built India-First</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              A student from Nagpur whose parents want them to do UPSC, on ₹0 budget, using 3G data
              — IS our target user. Every feature is designed for them first.
            </p>
            <p className="text-sm text-slate-500 italic">
              &quot;If it works for them, it works for the IIT student too. The reverse is not true.&quot;
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-6 text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Ready to discover your career DNA?</h2>
        <p className="text-slate-500 mb-8 max-w-md mx-auto">Free forever. No credit card. Takes 5 minutes.</p>
        <Link href="/signup" className="st-btn-primary text-lg py-4 px-10 inline-block">
          Start Now — Free →
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-10 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-lg flex items-center justify-center text-white font-bold text-[10px]">ST</div>
            <span className="text-sm font-bold text-white">Skill<span className="text-indigo-400">Ten</span></span>
          </div>
          <p className="text-xs text-slate-500">© 2026 SkillTen. Built with ❤️ for Indian students.</p>
          <div className="flex gap-6 text-xs">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/help" className="hover:text-white transition-colors">Help</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
