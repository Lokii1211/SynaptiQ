'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface FAQ {
    q: string;
    a: string;
    category: string;
}

const FAQS: FAQ[] = [
    // Getting Started
    { category: 'Getting Started', q: 'What is SkillTen (SkillTen)?', a: 'SkillTen is an AI-powered Career Intelligence Platform built for Indian engineering students. It helps you discover your career strengths through a psychometric assessment, verify your skills, practice coding, prepare for placements, and get honest AI career guidance.' },
    { category: 'Getting Started', q: 'Is SkillTen free?', a: 'Yes! The core features are completely free — assessment, daily coding challenges, skills dashboard, SkillTen Score™, and basic AI counseling. Pro plan (₹299/month) unlocks unlimited AI sessions, detailed analytics, and priority support.' },
    { category: 'Getting Started', q: 'Who is SkillTen for?', a: 'SkillTen is designed specifically for engineering students at Indian colleges (Tier 1, 2, and 3). Whether you\'re in CS, IT, ECE, Mechanical, or any branch, our career assessment and guidance are tailored for you.' },
    { category: 'Getting Started', q: 'How do I get started?', a: 'Create an account with your email, then take the 4D Career Assessment (25 minutes). This generates your CareerDNA™ profile, career matches, and honest feedback. After that, explore coding challenges, skill verification, and more.' },

    // Assessment
    { category: 'Assessment', q: 'How long is the assessment?', a: 'The 4D Psychometric Assessment has 45 questions and takes about 25 minutes. It measures 4 dimensions: Analytical, Interpersonal, Creative, and Systematic thinking.' },
    { category: 'Assessment', q: 'Can I retake the assessment?', a: 'Your primary assessment can be taken once to ensure accuracy. After 6 months, you can retake it to see how your profile has evolved.' },
    { category: 'Assessment', q: 'What is the "Honest Mirror"?', a: 'Unlike other platforms that only show positives, our Honest Mirror shows you your career challenges too — areas where you might struggle. This honest feedback helps you prepare better.' },
    { category: 'Assessment', q: 'What if my assessment results feel wrong?', a: 'The assessment reflects your current tendencies, not your permanent identity. If something feels off, talk to our AI Counselor about it. People grow and change — your next assessment in 6 months may look very different.' },

    // SkillTen Score™
    { category: 'SkillTen Score™', q: 'What is the SkillTen Score™?', a: 'SkillTen Score™ is your composite career readiness metric: Skills (30%) + Coding (20%) + Aptitude (20%) + Assessment (15%) + Community (10%) + Roadmap Progress (5%). It updates in real-time as you complete activities.' },
    { category: 'SkillTen Score™', q: 'How do I improve my SkillTen Score™?', a: 'Practice daily coding challenges, take aptitude tests, verify your skills through quizzes, complete your assessment, participate in the community, and follow your career roadmap. The score rewards consistent effort.' },
    { category: 'SkillTen Score™', q: 'Can recruiters see my SkillTen Score™?', a: 'Yes — if you make your profile public, recruiters can see your SkillTen Score™ and verified skills. They cannot see your raw assessment data, AI chat history, or detailed analytics.' },

    // Coding & Skills
    { category: 'Coding & Skills', q: 'What programming languages are supported?', a: 'Our compiler supports 8 languages: Python, Java, C, C++, JavaScript, TypeScript, Go, and Rust. Solutions are shown in ALL languages after 3 failed attempts.' },
    { category: 'Coding & Skills', q: 'What happens after 3 failed attempts?', a: 'After 3 wrong submissions, we reveal the complete solution in ALL 8 supported languages with step-by-step AI-generated explanation. This ensures you always learn, not just get stuck.' },
    { category: 'Coding & Skills', q: 'Do skill verification badges expire?', a: 'Yes — verified skill badges expire after 90 days. This ensures your verified skills are current and trustworthy. You\'ll get a reminder 7 days before expiry to re-verify.' },

    // AI Counselor
    { category: 'AI Counselor', q: 'Is the AI Counselor giving real salary data?', a: 'Our AI uses real Indian salary data (LPA ranges) from multiple sources including placement reports and industry surveys. However, all figures are estimates — actual offers vary by company, location, and individual negotiation.' },
    { category: 'AI Counselor', q: 'Can I chat in Hindi?', a: 'Yes! Our AI Counselor understands Hindi, Hinglish (mixed Hindi-English), and responds naturally. We\'re adding more Indian language support soon.' },
    { category: 'AI Counselor', q: 'Is my chat history private?', a: 'Your AI conversations are completely private. No other user, recruiter, parent, or T&P officer can ever see your chat history. It\'s auto-deleted after 6 months.' },

    // Privacy & Security
    { category: 'Privacy', q: 'Is my data safe?', a: 'Yes — all data is encrypted in transit and at rest. We follow PDPB 2023 compliance. We never sell your personal data. See our Privacy Policy for complete details.' },
    { category: 'Privacy', q: 'Can I delete my account and data?', a: 'Yes — go to Settings → Account → Delete Account. All your personal data is permanently purged within 30 days. This action cannot be undone.' },
    { category: 'Privacy', q: 'What can my parents see on the Parent Portal?', a: 'Only weekly summaries that you explicitly consent to share. Parents see aggregate progress — they cannot see your AI chat history, raw assessment data, or individual quiz responses.' },
];

export default function HelpPage() {
    const [activeCategory, setActiveCategory] = useState('Getting Started');
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const [searchQuery, setSearchQuery] = useState('');

    const categories = Array.from(new Set(FAQS.map(f => f.category)));

    const filtered = FAQS.filter(f => {
        const matchesCategory = !searchQuery && f.category === activeCategory;
        const matchesSearch = searchQuery && (
            f.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
            f.a.toLowerCase().includes(searchQuery.toLowerCase())
        );
        return matchesCategory || matchesSearch;
    });

    return (
        <div className="min-h-screen bg-white">
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 text-white px-6 py-12">
                <div className="max-w-3xl mx-auto">
                    <Link href="/" className="flex items-center gap-2 mb-8">
                        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-white font-bold text-xs">ST</div>
                        <span className="text-lg font-bold">SkillTen</span>
                    </Link>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="text-3xl font-bold mb-2">Help Center</h1>
                        <p className="text-white/60 text-sm mb-6">Find answers to common questions about SkillTen.</p>
                        <div className="relative">
                            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                                placeholder="Search for help..."
                                className="w-full bg-white/15 backdrop-blur-sm border border-white/20 rounded-2xl px-5 py-3.5 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40">🔍</span>
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-6 py-8">
                {/* Categories */}
                {!searchQuery && (
                    <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                        {categories.map(cat => (
                            <button key={cat} onClick={() => { setActiveCategory(cat); setOpenIndex(0); }}
                                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${activeCategory === cat
                                    ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}>{cat}</button>
                        ))}
                    </div>
                )}

                {searchQuery && (
                    <p className="text-sm text-slate-500 mb-4">Found {filtered.length} result{filtered.length !== 1 ? 's' : ''} for &quot;{searchQuery}&quot;</p>
                )}

                {/* FAQ Accordion */}
                <div className="space-y-2">
                    {filtered.map((faq, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                            className="border border-slate-200 rounded-xl overflow-hidden">
                            <button onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                className="w-full text-left px-5 py-4 flex items-center gap-3 hover:bg-slate-50 transition-all">
                                <span className={`text-xs transition-transform duration-200 ${openIndex === i ? 'rotate-90' : ''}`}>▶</span>
                                <span className="font-semibold text-sm text-slate-900 flex-1">{faq.q}</span>
                                {searchQuery && <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded">{faq.category}</span>}
                            </button>
                            <AnimatePresence>
                                {openIndex === i && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <div className="px-5 pb-4 pl-11 text-sm text-slate-600 leading-relaxed">{faq.a}</div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>

                {filtered.length === 0 && (
                    <div className="text-center py-16">
                        <span className="text-5xl block mb-4">🤔</span>
                        <p className="text-slate-900 font-semibold mb-1">No results found</p>
                        <p className="text-slate-500 text-sm">Try a different search term or browse categories above.</p>
                    </div>
                )}

                {/* Contact */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                    className="mt-10 bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 rounded-2xl p-6 text-center">
                    <span className="text-3xl block mb-2">💬</span>
                    <h3 className="font-bold text-slate-900 mb-1">Still need help?</h3>
                    <p className="text-sm text-slate-500 mb-4">Our team responds within 24 hours.</p>
                    <div className="flex gap-3 justify-center">
                        <a href="mailto:support@skillten.in" className="st-btn-primary text-xs px-5 py-2.5">📧 Email Support</a>
                        <Link href="/chat" className="st-btn-secondary text-xs px-5 py-2.5">💬 Ask AI Counselor</Link>
                    </div>
                </motion.div>

                <div className="mt-8 flex items-center justify-center gap-4 text-sm text-slate-400">
                    <Link href="/privacy" className="hover:text-slate-600">Privacy Policy</Link>
                    <span>·</span>
                    <Link href="/terms" className="hover:text-slate-600">Terms of Service</Link>
                    <span>·</span>
                    <Link href="/" className="hover:text-slate-600">Home</Link>
                </div>
            </div>
        </div>
    );
}
