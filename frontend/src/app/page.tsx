"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const FEATURES = [
  {
    icon: "🧠",
    title: "AI Career Assessment",
    desc: "15-question psychometric test powered by AI. Discover your top 5 career matches with detailed reasoning.",
    color: "from-indigo-500/20 to-purple-500/20",
    border: "border-indigo-500/30",
  },
  {
    icon: "🔍",
    title: "Career Explorer",
    desc: "200+ career profiles with real salary data, skills required, companies hiring, and day-in-life descriptions.",
    color: "from-cyan-500/20 to-blue-500/20",
    border: "border-cyan-500/30",
  },
  {
    icon: "📊",
    title: "Skill Gap Analyzer",
    desc: "Know exactly what skills you need. Get a personalized learning path with free and paid resources.",
    color: "from-emerald-500/20 to-teal-500/20",
    border: "border-emerald-500/30",
  },
  {
    icon: "📝",
    title: "AI Resume Builder",
    desc: "Create ATS-optimized resumes in minutes. AI suggests improvements and scores your resume.",
    color: "from-amber-500/20 to-orange-500/20",
    border: "border-amber-500/30",
  },
  {
    icon: "💬",
    title: "AI Career Chat",
    desc: "Ask any career question. Our AI counselor gives personalized, context-aware guidance 24/7.",
    color: "from-pink-500/20 to-rose-500/20",
    border: "border-pink-500/30",
  },
  {
    icon: "📈",
    title: "Market Intelligence",
    desc: "Real-time trending skills, salary benchmarks, and job market insights across India.",
    color: "from-violet-500/20 to-fuchsia-500/20",
    border: "border-violet-500/30",
  },
];

const STATS = [
  { value: "200+", label: "Career Profiles" },
  { value: "12", label: "Industries" },
  { value: "15", label: "Assessment Questions" },
  { value: "24/7", label: "AI Guidance" },
];

const STEPS = [
  { step: "01", title: "Take Assessment", desc: "Answer 15 quick questions about your interests, personality, and work style.", icon: "📋" },
  { step: "02", title: "Get Matches", desc: "AI analyzes your profile and recommends your top 5 ideal careers.", icon: "🎯" },
  { step: "03", title: "Plan Your Path", desc: "See skill gaps, learning resources, and a step-by-step roadmap.", icon: "🗺️" },
  { step: "04", title: "Build & Apply", desc: "Create an ATS-optimized resume and prepare with AI-powered tools.", icon: "🚀" },
];

function AnimatedCounter({ target, suffix = "" }: { target: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const numericTarget = parseInt(target.replace(/\D/g, "")) || 0;

  useEffect(() => {
    if (!numericTarget) return;
    const duration = 1500;
    const increment = numericTarget / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= numericTarget) {
        setCount(numericTarget);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [numericTarget]);

  if (!numericTarget) return <span>{target}</span>;
  return <span>{count}{suffix}+</span>;
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]" />
      </div>

      {/* Navbar */}
      <nav className="relative z-50 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-lg font-bold">S</div>
            <span className="text-xl font-bold">Skill<span className="text-indigo-400">Sync</span> AI</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/careers" className="text-gray-400 hover:text-white transition text-sm">Careers</Link>
            <Link href="/assessment" className="text-gray-400 hover:text-white transition text-sm">Assessment</Link>
            <Link href="/skills" className="text-gray-400 hover:text-white transition text-sm">Skill Gap</Link>
            <Link href="/chat" className="text-gray-400 hover:text-white transition text-sm">AI Chat</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="btn-secondary text-sm !py-2 !px-4">Log In</Link>
            <Link href="/signup" className="btn-primary text-sm !py-2 !px-4">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-24">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm mb-8 animate-fadeInUp">
            <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
            AI-Powered Career Guidance for Students
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 animate-fadeInUp" style={{ animationDelay: "0.1s" }}>
            Discover Your
            <br />
            <span className="gradient-text">Perfect Career</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-fadeInUp" style={{ animationDelay: "0.2s" }}>
            Take a 5-minute AI assessment, explore 200+ careers with real salary data,
            and get a personalized roadmap to your dream job.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fadeInUp" style={{ animationDelay: "0.3s" }}>
            <Link href="/assessment" className="btn-primary text-lg !py-4 !px-8 flex items-center gap-2">
              Take Free Assessment <span>→</span>
            </Link>
            <Link href="/careers" className="btn-secondary text-lg !py-4 !px-8">
              Explore Careers
            </Link>
          </div>

          <p className="text-gray-500 text-sm mt-4 animate-fadeInUp" style={{ animationDelay: "0.4s" }}>
            Free forever • No credit card needed • 2 minutes to start
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 max-w-3xl mx-auto stagger-children">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center p-4">
              <div className="text-3xl md:text-4xl font-bold gradient-text mb-1">
                <AnimatedCounter target={stat.value} />
              </div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="relative z-10 py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-400 max-w-xl mx-auto">Four simple steps to career clarity</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 stagger-children">
            {STEPS.map((step) => (
              <div key={step.step} className="relative text-center p-6">
                <div className="text-4xl mb-4">{step.icon}</div>
                <div className="text-xs font-bold text-indigo-400 mb-2">STEP {step.step}</div>
                <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                <p className="text-gray-400 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need</h2>
            <p className="text-gray-400 max-w-xl mx-auto">From discovery to your dream job — we&apos;ve got every step covered</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className={`card bg-gradient-to-br ${f.color} border ${f.border} hover:scale-[1.02]`}
              >
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 py-24 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Your career journey
            <br />
            <span className="gradient-text">starts here</span>
          </h2>
          <p className="text-gray-400 text-lg mb-10">
            Join thousands of students who discovered their ideal career path with SkillSync AI.
          </p>
          <Link href="/signup" className="btn-primary text-lg !py-4 !px-10 inline-flex items-center gap-2">
            Create Free Account <span>→</span>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-sm">S</div>
              <span className="font-bold">SkillSync AI</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <Link href="/careers" className="hover:text-white transition">Careers</Link>
              <Link href="/assessment" className="hover:text-white transition">Assessment</Link>
              <Link href="/chat" className="hover:text-white transition">AI Chat</Link>
              <Link href="/skills" className="hover:text-white transition">Skills</Link>
            </div>
            <p className="text-sm text-gray-600">© 2026 SkillSync AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
