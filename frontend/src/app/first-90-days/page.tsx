"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

interface Phase {
    name: string;
    weeks: string;
    icon: string;
    color: string;
    tasks: { title: string; description: string; type: "learn" | "build" | "network" | "apply"; done: boolean }[];
}

const CAREER_PLANS: Record<string, Phase[]> = {
    "Software Engineer": [
        {
            name: "Foundation", weeks: "Week 1-3", icon: "🏗️", color: "#6366f1",
            tasks: [
                { title: "Set up GitHub + VS Code", description: "Create a professional GitHub profile with a clean README. Install VS Code with essential extensions.", type: "build", done: false },
                { title: "Complete DSA basics (Arrays, Strings, Hash Maps)", description: "Use NeetCode's free roadmap. Solve 15 Easy problems on LeetCode.", type: "learn", done: false },
                { title: "Join 2 tech Discord/Telegram communities", description: "Find active Indian tech communities. Introduce yourself. Help answer 1 question/day.", type: "network", done: false },
                { title: "Pick a stack: MERN or Next.js", description: "Watch a 2-hour crash course. Build 'Hello World'. Understand the ecosystem.", type: "learn", done: false },
            ],
        },
        {
            name: "Build & Ship", weeks: "Week 4-8", icon: "🚀", color: "#22c55e",
            tasks: [
                { title: "Build Project #1: Full-stack CRUD app", description: "Build a todo app with auth, database, and deployment. Ship it to Vercel.", type: "build", done: false },
                { title: "Solve 30 Medium DSA problems", description: "Focus on Trees, Graphs, and Dynamic Programming patterns. Time yourself.", type: "learn", done: false },
                { title: "Contribute to 1 open-source project", description: "Find a beginner-friendly ('good first issue') repo. Submit a PR. Document the process.", type: "build", done: false },
                { title: "Start a blog or Twitter thread series", description: "Write 3 posts about what you're learning. Share on LinkedIn with #100DaysOfCode.", type: "network", done: false },
                { title: "Build Project #2: API project (e.g. Weather/Finance)", description: "Use external APIs. Add caching. Write proper README with screenshots.", type: "build", done: false },
            ],
        },
        {
            name: "Apply & Interview", weeks: "Week 9-12", icon: "🎯", color: "#f59e0b",
            tasks: [
                { title: "Polish resume (1 page, ATS-friendly)", description: "Use Jake's Resume template. Quantify achievements. STAR format for projects.", type: "apply", done: false },
                { title: "Apply to 5 companies/day for 2 weeks", description: "Target mix: 2 dream companies, 2 realistic, 1 stretch. Track in spreadsheet.", type: "apply", done: false },
                { title: "Do 5 mock interviews", description: "Use Pramp.com (free). Focus on System Design + DSA. Record yourself.", type: "apply", done: false },
                { title: "Build Project #3: Portfolio-worthy showpiece", description: "Build something that solves a real problem. Add AI/real-time features. Deploy with CI/CD.", type: "build", done: false },
                { title: "Cold message 10 engineers at target companies", description: "Ask for 15-min career chats. Not for referral — for advice. On LinkedIn.", type: "network", done: false },
            ],
        },
    ],
    "Data Scientist": [
        {
            name: "Foundation", weeks: "Week 1-3", icon: "📊", color: "#6366f1",
            tasks: [
                { title: "Master Python fundamentals + NumPy/Pandas", description: "Complete Kaggle's free Python + Pandas micro-courses (6 hours total).", type: "learn", done: false },
                { title: "Statistics refresher", description: "Probability, distributions, hypothesis testing. Khan Academy is free.", type: "learn", done: false },
                { title: "Set up Jupyter + Kaggle account", description: "Create a Kaggle profile. Fork 3 beginner notebooks. Understand the formats.", type: "build", done: false },
                { title: "Complete 1 Kaggle Getting Started competition", description: "Titanic or House Prices. Submit at least 3 iterations with improving scores.", type: "build", done: false },
            ],
        },
        {
            name: "Build & Ship", weeks: "Week 4-8", icon: "🚀", color: "#22c55e",
            tasks: [
                { title: "Learn ML fundamentals (Scikit-learn)", description: "Regression, Classification, Clustering. Build models on 3 real datasets.", type: "learn", done: false },
                { title: "SQL for Data Science", description: "Complete Mode Analytics SQL tutorial. Practice on StrataScratch.", type: "learn", done: false },
                { title: "Build Project #1: End-to-end ML pipeline", description: "Data cleaning → EDA → Modeling → Evaluation → Deployment. Use Streamlit for frontend.", type: "build", done: false },
                { title: "Learn basic Deep Learning (PyTorch/TensorFlow)", description: "Neural networks, CNNs, Transfer Learning. Build an image classifier.", type: "learn", done: false },
                { title: "Share 3 data analysis insights on LinkedIn", description: "Analyze public Indian datasets (Census, NITI Aayog). Create visualizations. Post findings.", type: "network", done: false },
            ],
        },
        {
            name: "Apply & Interview", weeks: "Week 9-12", icon: "🎯", color: "#f59e0b",
            tasks: [
                { title: "Build Project #2: NLP or GenAI project", description: "Sentiment analysis, text summarization, or RAG chatbot. Deploy on HuggingFace Spaces.", type: "build", done: false },
                { title: "Master case studies + guesstimates", description: "Practice 10 product/analytics cases. Understand A/B testing deeply.", type: "apply", done: false },
                { title: "Apply to 5 data roles/day", description: "Data Analyst, Junior DS, ML Engineer, Analytics. Track applications in a spreadsheet.", type: "apply", done: false },
                { title: "Kaggle: Reach Contributor/Expert tier", description: "2 more competition submissions + 2 notebook upvotes. Real differentiator.", type: "build", done: false },
                { title: "Mock interviews with case studies", description: "Practice on InterviewBit. Cover SQL, Python coding, case studies, ML theory.", type: "apply", done: false },
            ],
        },
    ],
};

// Add a generic plan for unmapped careers
const GENERIC_PLAN: Phase[] = [
    {
        name: "Foundation", weeks: "Week 1-3", icon: "🏗️", color: "#6366f1",
        tasks: [
            { title: "Research your target role deeply", description: "Find 5 job postings for your dream role. List every skill mentioned. Prioritize the top 5.", type: "learn", done: false },
            { title: "Find 3 free learning resources", description: "YouTube, Coursera, NPTEL. Start the highest-rated course for your #1 skill.", type: "learn", done: false },
            { title: "Join 3 relevant communities", description: "Find Discord, Reddit, or LinkedIn groups in your field. Introduce yourself.", type: "network", done: false },
            { title: "Set up your professional profiles", description: "LinkedIn, GitHub/Behance/Portfolio site. Complete 100%. Add a professional photo.", type: "build", done: false },
        ],
    },
    {
        name: "Build & Ship", weeks: "Week 4-8", icon: "🚀", color: "#22c55e",
        tasks: [
            { title: "Complete a certification or mini-project", description: "Finish a recognized certificate in your field. Add it to LinkedIn the same day.", type: "learn", done: false },
            { title: "Build 2 portfolio projects", description: "Create real-world projects that demonstrate your skills. Document the process.", type: "build", done: false },
            { title: "Start creating content", description: "Write 3 blog posts or LinkedIn articles about your learnings. Tag industry keywords.", type: "network", done: false },
            { title: "Get 1 freelance or volunteer project", description: "Use Internshala, LinkedIn, or local contacts. Real experience > certificates.", type: "build", done: false },
        ],
    },
    {
        name: "Apply & Interview", weeks: "Week 9-12", icon: "🎯", color: "#f59e0b",
        tasks: [
            { title: "Tailor your resume", description: "1-page, ATS-friendly, quantified achievements. Different version for each role type.", type: "apply", done: false },
            { title: "Apply to 5 roles daily", description: "Mix of dream + realistic companies. Track in spreadsheet. Follow up after 1 week.", type: "apply", done: false },
            { title: "Do 5+ mock interviews", description: "Practice with peers, use Pramp or InterviewBit. Record yourself and review.", type: "apply", done: false },
            { title: "Cold outreach to 10 professionals", description: "Ask for 15-min career chats. Show genuine interest. Not 'please refer me'.", type: "network", done: false },
        ],
    },
];

function First90DaysContent() {
    const searchParams = useSearchParams();
    const careerParam = searchParams.get("career") || "Software Engineer";
    const [career, setCareer] = useState(careerParam);
    const [completed, setCompleted] = useState<Record<string, boolean>>({});
    const [expandedPhase, setExpandedPhase] = useState(0);

    const plan = CAREER_PLANS[career] || GENERIC_PLAN;
    const totalTasks = plan.reduce((acc, p) => acc + p.tasks.length, 0);
    const completedCount = Object.values(completed).filter(Boolean).length;
    const progressPct = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

    const toggleTask = (key: string) => {
        setCompleted(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const typeIcons: Record<string, { icon: string; label: string; color: string }> = {
        learn: { icon: "📚", label: "Learn", color: "#6366f1" },
        build: { icon: "🛠️", label: "Build", color: "#22c55e" },
        network: { icon: "🤝", label: "Network", color: "#eab308" },
        apply: { icon: "🎯", label: "Apply", color: "#f43f5e" },
    };

    return (
        <div style={{ minHeight: "100vh", background: "var(--bg-primary)", color: "var(--text-primary)" }}>
            <style>{`
                .task-card { transition: all 0.2s ease; }
                .task-card:hover { transform: translateX(4px); }
                .phase-header { cursor: pointer; transition: all 0.2s ease; }
                .phase-header:hover { background: rgba(255,255,255,0.04) !important; }
            `}</style>

            {/* Nav */}
            <nav style={{ padding: "0.75rem 1rem", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-color)", position: "sticky", top: 0, background: "rgba(10,10,15,0.95)", backdropFilter: "blur(20px)", zIndex: 100 }}>
                <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none", color: "var(--text-primary)" }}>
                    <span style={{ fontSize: "1.3rem" }}>🧠</span>
                    <span style={{ fontWeight: 800, fontSize: "1.1rem" }}>SkillSync <span style={{ color: "var(--accent-primary)" }}>AI</span></span>
                </Link>
                <Link href="/dashboard" style={{ color: "var(--text-secondary)", textDecoration: "none", fontSize: "0.85rem" }}>← Dashboard</Link>
            </nav>

            <main style={{ maxWidth: 680, margin: "0 auto", padding: "1.5rem 1rem" }}>
                {/* Header */}
                <div style={{ marginBottom: "1.5rem" }}>
                    <h1 style={{ fontSize: "1.6rem", fontWeight: 800, marginBottom: "0.25rem" }}>⏱️ First 90 Days™</h1>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.6 }}>
                        You got the result. Now what? Here&apos;s your week-by-week action plan for the next 90 days.
                    </p>
                </div>

                {/* Career Selector */}
                <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
                    {Object.keys(CAREER_PLANS).map(c => (
                        <button key={c} onClick={() => { setCareer(c); setCompleted({}); setExpandedPhase(0); }}
                            style={{
                                padding: "0.4rem 0.85rem", borderRadius: 20, cursor: "pointer", fontSize: "0.8rem", fontWeight: 500,
                                border: career === c ? "1px solid var(--accent-primary)" : "1px solid var(--border-color)",
                                background: career === c ? "rgba(99,102,241,0.12)" : "transparent",
                                color: career === c ? "#a5b4fc" : "var(--text-secondary)",
                                transition: "all 0.2s ease",
                            }}>
                            {c}
                        </button>
                    ))}
                </div>

                {/* Progress Bar */}
                <div style={{
                    padding: "1rem 1.25rem", borderRadius: 14, marginBottom: "1.5rem",
                    background: "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(34,197,94,0.05))",
                    border: "1px solid rgba(99,102,241,0.15)",
                }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                        <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>Overall Progress</span>
                        <span style={{ fontSize: "0.85rem", color: "#22c55e", fontWeight: 700 }}>{progressPct}%</span>
                    </div>
                    <div style={{ height: 8, borderRadius: 4, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                        <div style={{ height: "100%", borderRadius: 4, width: `${progressPct}%`, background: "linear-gradient(90deg, #6366f1, #22c55e)", transition: "width 0.5s ease" }} />
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0.35rem" }}>
                        {completedCount} of {totalTasks} tasks completed
                    </div>
                </div>

                {/* Phases */}
                {plan.map((phase, pi) => {
                    const phaseTasks = phase.tasks;
                    const phaseCompleted = phaseTasks.filter((_, ti) => completed[`${pi}-${ti}`]).length;
                    const isExpanded = expandedPhase === pi;

                    return (
                        <div key={pi} style={{ marginBottom: "0.75rem" }}>
                            <div className="phase-header" onClick={() => setExpandedPhase(isExpanded ? -1 : pi)}
                                style={{
                                    padding: "1rem 1.25rem", borderRadius: isExpanded ? "14px 14px 0 0" : 14,
                                    border: `1px solid ${isExpanded ? phase.color + "33" : "var(--border-color)"}`,
                                    background: isExpanded ? `${phase.color}0D` : "rgba(255,255,255,0.02)",
                                    display: "flex", alignItems: "center", gap: "0.75rem",
                                }}>
                                <span style={{ fontSize: "1.3rem" }}>{phase.icon}</span>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>{phase.name}</div>
                                    <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                                        {phase.weeks} · {phaseCompleted}/{phaseTasks.length} done
                                    </div>
                                </div>
                                <span style={{ color: "var(--text-secondary)", transition: "transform 0.2s ease", transform: isExpanded ? "rotate(180deg)" : "rotate(0)" }}>▼</span>
                            </div>

                            {isExpanded && (
                                <div style={{
                                    padding: "0.5rem 0.75rem", borderRadius: "0 0 14px 14px",
                                    border: `1px solid ${phase.color}33`, borderTop: "none",
                                    background: "rgba(255,255,255,0.01)",
                                }}>
                                    {phaseTasks.map((task, ti) => {
                                        const key = `${pi}-${ti}`;
                                        const isDone = completed[key];
                                        const t = typeIcons[task.type];

                                        return (
                                            <div key={ti} className="task-card" onClick={() => toggleTask(key)}
                                                style={{
                                                    display: "flex", gap: "0.75rem", padding: "0.85rem",
                                                    borderRadius: 10, cursor: "pointer", margin: "0.25rem 0",
                                                    background: isDone ? "rgba(34,197,94,0.06)" : "transparent",
                                                    opacity: isDone ? 0.7 : 1,
                                                }}>
                                                <div style={{
                                                    width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                                                    border: isDone ? "2px solid #22c55e" : "2px solid var(--border-color)",
                                                    background: isDone ? "#22c55e" : "transparent",
                                                    display: "flex", alignItems: "center", justifyContent: "center",
                                                    fontSize: "0.7rem", color: "white", marginTop: 2,
                                                }}>
                                                    {isDone ? "✓" : ""}
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontWeight: 600, fontSize: "0.88rem", textDecoration: isDone ? "line-through" : "none", marginBottom: "0.2rem" }}>
                                                        {task.title}
                                                    </div>
                                                    <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                                                        {task.description}
                                                    </div>
                                                    <span style={{
                                                        display: "inline-block", marginTop: "0.35rem",
                                                        padding: "0.15rem 0.5rem", borderRadius: 8,
                                                        fontSize: "0.65rem", fontWeight: 600,
                                                        background: `${t.color}15`, color: t.color,
                                                        border: `1px solid ${t.color}25`,
                                                    }}>
                                                        {t.icon} {t.label}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}

                {/* CTA: Generate personalized plan */}
                <div style={{
                    padding: "1.25rem", borderRadius: 14, textAlign: "center", marginTop: "1rem",
                    background: "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.08))",
                    border: "1px solid rgba(99,102,241,0.2)",
                }}>
                    <p style={{ fontSize: "0.9rem", marginBottom: "0.75rem", color: "var(--text-secondary)" }}>
                        Want a plan personalized to your exact college, city, and skills?
                    </p>
                    <Link href="/assessment" style={{
                        display: "inline-block", padding: "0.7rem 1.5rem", borderRadius: 12,
                        background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "white",
                        fontWeight: 700, fontSize: "0.9rem", textDecoration: "none",
                    }}>
                        Take Assessment → Get AI-Personalized Plan
                    </Link>
                </div>
            </main>
        </div>
    );
}

export default function First90DaysPage() {
    return (
        <Suspense fallback={<div style={{ minHeight: "100vh", background: "var(--bg-primary)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)" }}>Loading...</div>}>
            <First90DaysContent />
        </Suspense>
    );
}
