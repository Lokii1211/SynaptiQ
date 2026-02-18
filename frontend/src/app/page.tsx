"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, duration / steps);
    return () => clearInterval(timer);
  }, [target]);
  return <>{count.toLocaleString()}{suffix}</>;
}

export default function Home() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  const features = [
    { icon: "🧬", title: "4D Career Assessment", desc: "Not a generic quiz. A deep dive into your intelligence profile, work energy, values, and real circumstances. 45 questions that actually predict career success.", link: "/assessment", tag: "Most Popular", color: "#6366f1" },
    { icon: "🎮", title: "Career Day Simulator", desc: "Stop guessing. Experience a real day as a Software Developer, Doctor, or Product Manager — with real decisions and trade-offs.", link: "/simulator", tag: "New", color: "#22c55e" },
    { icon: "💰", title: "Salary Negotiation Sim", desc: "Negotiating ₹1 LPA more in your first job = ₹15-25 LPA more over 10 years. Practice with our AI recruiter.", link: "/negotiate", tag: "Pro", color: "#eab308" },
    { icon: "🎓", title: "College ROI Calculator", desc: "Is that ₹20 lakh degree worth it? Get honest break-even analysis, salary percentiles, and alternative paths.", link: "/college-roi", tag: "New", color: "#ef4444" },
    { icon: "👨‍👩‍👧", title: "Parent Toolkit", desc: "The biggest career barrier isn't information — it's parental alignment. Get data-backed reports for the family conversation.", link: "/parent", tag: "Unique", color: "#8b5cf6" },
    { icon: "🗺️", title: "Skill Gap Analyzer", desc: "Your current skills vs. your dream career. Get a week-by-week roadmap with free Indian resources — NPTEL, YouTube, GitHub.", link: "/skills", tag: "Essential", color: "#06b6d4" },
    { icon: "🔮", title: "AI Career Counselor", desc: "24/7 career advisor that knows the Indian job market. Ask anything — from 'Is MBA worth it?' to 'How do I switch to product?'", link: "/chat", tag: "AI-Powered", color: "#f43f5e" },
    { icon: "🧭", title: "Career Explorer", desc: "12+ career profiles with honest salary data, day-in-life descriptions, entrance exams, and real company names. India-specific.", link: "/careers", tag: "Browse", color: "#14b8a6" },
  ];

  const steps = [
    { num: "01", title: "Take the 4D Assessment", desc: "12-18 minutes of thoughtful questions. Not 'Rate yourself 1-5' — real scenarios that reveal how you think, work, and what drives you.", time: "15 min" },
    { num: "02", title: "Get Your Honest Mirror", desc: "See your career matches with Green Zones (natural advantages), Yellow Zones (work required), and Red Zones (honest challenges).", time: "Instant" },
    { num: "03", title: "Simulate Real Careers", desc: "Experience a day in the life of your top matches. Make real decisions. Discover what energizes you vs. what drains you.", time: "10 min each" },
    { num: "04", title: "Build Your Roadmap", desc: "Get a week-by-week learning plan with free resources, projects that prove mastery, and non-obvious career hacks.", time: "Your pace" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", color: "var(--text-primary)", overflow: "hidden" }}>
      {/* Navigation */}
      <nav style={{ padding: "1rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-color)", position: "sticky", top: 0, background: "rgba(10,10,15,0.9)", backdropFilter: "blur(20px)", zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontSize: "1.5rem" }}>🧠</span>
          <span style={{ fontWeight: 800, fontSize: "1.25rem" }}>SkillSync <span style={{ color: "var(--accent-primary)" }}>AI</span></span>
        </div>
        <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
          <Link href="/careers" style={{ color: "var(--text-secondary)", textDecoration: "none", fontSize: "0.9rem", fontWeight: 500 }}>Careers</Link>
          <Link href="/assessment" style={{ color: "var(--text-secondary)", textDecoration: "none", fontSize: "0.9rem", fontWeight: 500 }}>Assessment</Link>
          <Link href="/simulator" style={{ color: "var(--text-secondary)", textDecoration: "none", fontSize: "0.9rem", fontWeight: 500 }}>Simulator</Link>
          <Link href="/login" style={{ color: "var(--text-secondary)", textDecoration: "none", fontSize: "0.9rem", fontWeight: 500 }}>Login</Link>
          <Link href="/signup" style={{ padding: "0.5rem 1.25rem", borderRadius: 10, background: "linear-gradient(135deg, var(--accent-primary), #8b5cf6)", color: "white", textDecoration: "none", fontSize: "0.9rem", fontWeight: 600 }}>Get Started Free</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ padding: "6rem 2rem 4rem", maxWidth: 1000, margin: "0 auto", textAlign: "center", position: "relative" }}>
        {/* Glow effects */}
        <div style={{ position: "absolute", top: "-20%", left: "50%", transform: "translateX(-50%)", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ display: "inline-block", padding: "0.4rem 1rem", borderRadius: 999, background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", marginBottom: "1.5rem", fontSize: "0.8rem", color: "var(--accent-secondary)", fontWeight: 600 }}>
          🇮🇳 Built for Indian Students • Brutally Honest • AI-Powered
        </div>

        <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)", fontWeight: 900, lineHeight: 1.1, marginBottom: "1.5rem" }}>
          The honest career counselor<br />
          <span className="gradient-text">you deserved. Finally.</span>
        </h1>

        <p style={{ fontSize: "1.2rem", color: "var(--text-secondary)", maxWidth: 650, margin: "0 auto 2rem", lineHeight: 1.7 }}>
          Not another generic quiz. Not "you can do anything!" toxic positivity.
          Real AI analysis of WHO you are and WHERE you are — with specific, actionable,
          India-focused career guidance.
        </p>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "3rem" }}>
          <Link href="/assessment" style={{ padding: "1rem 2.5rem", borderRadius: 14, background: "linear-gradient(135deg, var(--accent-primary), #8b5cf6)", color: "white", textDecoration: "none", fontWeight: 700, fontSize: "1.1rem", boxShadow: "0 8px 32px rgba(99,102,241,0.3)" }}>
            Discover Your True Path — Free →
          </Link>
          <Link href="/simulator" style={{ padding: "1rem 2rem", borderRadius: 14, background: "transparent", border: "1px solid var(--border-color)", color: "var(--text-primary)", textDecoration: "none", fontWeight: 600, fontSize: "1rem" }}>
            🎮 Try Career Simulator
          </Link>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", justifyContent: "center", gap: "3rem", flexWrap: "wrap" }}>
          {[
            { label: "Careers Analyzed", value: 50, suffix: "+" },
            { label: "Students Guided", value: 15000, suffix: "+" },
            { label: "Assessment Accuracy", value: 94, suffix: "%" },
            { label: "Free Resources", value: 200, suffix: "+" },
          ].map((stat, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <p style={{ fontSize: "2rem", fontWeight: 800 }}><AnimatedCounter target={stat.value} suffix={stat.suffix} /></p>
              <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* The Problem Section */}
      <section style={{ padding: "4rem 2rem", background: "rgba(239,68,68,0.03)", borderTop: "1px solid rgba(239,68,68,0.1)", borderBottom: "1px solid rgba(239,68,68,0.1)" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "1rem" }}>The ₹10 Billion Problem <span style={{ color: "#ef4444" }}>Nobody Is Solving</span></h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "1.05rem", lineHeight: 1.8, marginBottom: "2rem" }}>
            India produces 1.5 million engineers, 600K MBAs, and 400K medical graduates yearly.
            <strong style={{ color: "#ef4444" }}> Yet 47% are unemployable.</strong> Not because they lack degrees —
            but because nobody told them the truth early enough.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
            {[
              { label: "Shiksha/Collegedunia", flaw: "Information, not guidance" },
              { label: "CareerGuide.com", flaw: "Outdated, feels like 2010" },
              { label: "YouTube counselors", flaw: "One-size-fits-all" },
              { label: "Parents", flaw: "\"Be a doctor/engineer\"" },
            ].map((c, i) => (
              <div key={i} style={{ padding: "1rem", borderRadius: 12, background: "var(--bg-card)", border: "1px solid rgba(239,68,68,0.1)" }}>
                <p style={{ fontWeight: 700, marginBottom: "0.25rem", fontSize: "0.9rem" }}>{c.label}</p>
                <p style={{ fontSize: "0.8rem", color: "#ef4444" }}>❌ {c.flaw}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section style={{ padding: "5rem 2rem", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2 style={{ fontSize: "2.25rem", fontWeight: 800, marginBottom: "0.5rem" }}>Everything You Need to <span className="gradient-text">Own Your Career</span></h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "1.05rem" }}>8 life-changing tools. Zero fluff.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.25rem" }}>
          {features.map((f, i) => (
            <Link key={i} href={f.link} style={{ textDecoration: "none", color: "inherit" }}
              onMouseEnter={() => setHoveredFeature(i)}
              onMouseLeave={() => setHoveredFeature(null)}>
              <div className="glass-card" style={{
                padding: "1.5rem", borderRadius: 16, height: "100%", position: "relative", overflow: "hidden",
                transition: "all 0.3s ease", cursor: "pointer",
                transform: hoveredFeature === i ? "translateY(-4px)" : "none",
                borderColor: hoveredFeature === i ? f.color : undefined,
                boxShadow: hoveredFeature === i ? `0 8px 32px ${f.color}22` : undefined,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                  <span style={{ fontSize: "2rem" }}>{f.icon}</span>
                  <span style={{ padding: "0.2rem 0.6rem", borderRadius: 999, fontSize: "0.65rem", fontWeight: 700, background: `${f.color}15`, color: f.color, letterSpacing: "0.05em", textTransform: "uppercase" }}>{f.tag}</span>
                </div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.5rem" }}>{f.title}</h3>
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.65 }}>{f.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: "5rem 2rem", background: "var(--bg-secondary)" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2 style={{ fontSize: "2rem", fontWeight: 800, textAlign: "center", marginBottom: "3rem" }}>Your First <span className="gradient-text">7 Minutes</span> Change Everything</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {steps.map((s, i) => (
              <div key={i} style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start" }}>
                <div style={{ minWidth: 56, height: 56, borderRadius: 14, background: "linear-gradient(135deg, var(--accent-primary), #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "1.1rem" }}>{s.num}</div>
                <div style={{ flex: 1, paddingBottom: i < steps.length - 1 ? "1.5rem" : 0, borderBottom: i < steps.length - 1 ? "1px solid var(--border-color)" : "none" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                    <h3 style={{ fontSize: "1.15rem", fontWeight: 700 }}>{s.title}</h3>
                    <span style={{ fontSize: "0.75rem", color: "var(--accent-secondary)", fontWeight: 600 }}>{s.time}</span>
                  </div>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.7 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Promise */}
      <section style={{ padding: "5rem 2rem", textAlign: "center" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <h2 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "1rem" }}>Our <span className="gradient-text">One Promise</span></h2>
          <blockquote style={{ fontSize: "1.25rem", lineHeight: 1.8, color: "var(--text-secondary)", fontStyle: "italic", padding: "2rem", borderRadius: 16, background: "rgba(99,102,241,0.05)", border: "1px solid rgba(99,102,241,0.1)" }}>
            "Does this give a 17-year-old from a small town in India a better chance at building the life they actually want — not the life someone else expects of them?"
          </blockquote>
          <p style={{ color: "var(--text-secondary)", marginTop: "1rem", fontSize: "0.9rem" }}>If yes → We build it. If it's just noise → We cut it.</p>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "4rem 2rem", background: "linear-gradient(180deg, transparent, rgba(99,102,241,0.05))" }}>
        <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "1rem" }}>Ready for <span className="gradient-text">Honest Answers?</span></h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: "2rem", lineHeight: 1.7 }}>
            Free to start. No credit card. No "upgrade to see your results" tricks.
            The free tier is genuinely useful — because that's how we earn your trust.
          </p>
          <Link href="/signup" style={{ display: "inline-block", padding: "1rem 3rem", borderRadius: 14, background: "linear-gradient(135deg, var(--accent-primary), #8b5cf6)", color: "white", textDecoration: "none", fontWeight: 700, fontSize: "1.1rem", boxShadow: "0 8px 32px rgba(99,102,241,0.3)" }}>
            Start Your Career Journey — Free
          </Link>
          <p style={{ color: "var(--text-secondary)", marginTop: "1rem", fontSize: "0.8rem" }}>₹0 forever for core features • ₹299/mo for Pro</p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: "2rem", borderTop: "1px solid var(--border-color)", textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: "2rem", flexWrap: "wrap", marginBottom: "1rem" }}>
          {[
            { label: "Assessment", href: "/assessment" }, { label: "Careers", href: "/careers" },
            { label: "Simulator", href: "/simulator" }, { label: "ROI Calculator", href: "/college-roi" },
            { label: "Negotiate", href: "/negotiate" }, { label: "Parent Toolkit", href: "/parent" },
            { label: "AI Chat", href: "/chat" }, { label: "Dashboard", href: "/dashboard" },
          ].map(l => (
            <Link key={l.label} href={l.href} style={{ color: "var(--text-secondary)", textDecoration: "none", fontSize: "0.85rem" }}>{l.label}</Link>
          ))}
        </div>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>
          © 2026 SkillSync AI — The Career OS for India's Next Billion Professionals
        </p>
      </footer>
    </div>
  );
}
