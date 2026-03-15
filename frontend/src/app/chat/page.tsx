'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api, auth } from '@/lib/api';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    isSafety?: boolean;
}

const QUICK_PROMPTS = [
    '💰 What salary can I expect as a fresher?',
    '🎯 How to prepare for TCS NQT?',
    '📝 Review my resume strategy',
    '🗺️ Give me a 6-month roadmap for SDE',
    '🏢 Best companies for freshers in Bangalore?',
    '💻 Should I learn React or Next.js?',
];

// Bible XF-09 — Mental health distress keywords
const DISTRESS_KEYWORDS = [
    'suicide', 'kill myself', 'end it', 'give up on life', 'no point',
    'hate myself', 'worthless', 'hopeless', 'can\'t take it', 'want to die',
    'self harm', 'cutting', 'depressed', 'depression', 'anxiety attack',
    'panic attack', 'no reason to live', 'not worth it',
];

const SAFETY_RESPONSE = `🫂 The pressure you're feeling is real and valid. You're not alone in this.

**Please reach out to someone who can help:**

📞 **iCall (Free Counseling):** 9152987821
📞 **Vandrevala Foundation Helpline:** 1860-2662-345
📞 **NIMHANS Helpline:** 080-46110007
💬 **Crisis Text Line India:** Text "HELLO" to 741741

Talking to a real person helps more than any AI can. These are free, confidential, and available for students.

Would you like me to connect you with a peer mentor who has been through similar pressure? Many placed alumni volunteer to support students going through tough times.`;

function isLateNight(): boolean {
    const hour = new Date().getHours();
    return hour >= 23 || hour < 5;
}

function isPlacementSeason(): boolean {
    const month = new Date().getMonth(); // 0-indexed
    return month >= 10 || month <= 2; // Nov–Mar
}

function containsDistress(text: string): boolean {
    const lower = text.toLowerCase();
    return DISTRESS_KEYWORDS.some(kw => lower.includes(kw));
}

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [showLateNightBanner, setShowLateNightBanner] = useState(false);
    const [moodCheckin, setMoodCheckin] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!auth.isLoggedIn()) window.location.href = '/login';

        // Bible XF-09 — Late night guardrail
        if (isLateNight()) {
            setShowLateNightBanner(true);
        }
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = async (text: string) => {
        if (!text.trim() || loading) return;

        // Bible XF-09 — Mental health resource integration
        if (containsDistress(text)) {
            const userMsg: Message = { role: 'user', content: text.trim() };
            setMessages(prev => [...prev, userMsg, { role: 'assistant', content: SAFETY_RESPONSE, isSafety: true }]);
            setInput('');
            return;
        }

        const userMsg: Message = { role: 'user', content: text.trim() };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const res = await api.chat({ message: text.trim(), session_id: sessionId || undefined });
            setSessionId(res.session_id);
            setMessages(prev => [...prev, { role: 'assistant', content: res.reply }]);
        } catch (e: any) {
            setMessages(prev => [...prev, { role: 'assistant', content: `Sorry, I encountered an error: ${e.message}` }]);
        } finally {
            setLoading(false);
        }
    };

    const handleMoodCheckin = (mood: string) => {
        setMoodCheckin(mood);
        if (mood === 'overwhelmed' || mood === 'need-help') {
            sendMessage(`I'm feeling ${mood === 'overwhelmed' ? 'completely overwhelmed' : 'like I need serious help'} about placement season. Can you help me feel calmer?`);
        } else {
            // Just acknowledge
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: mood === 'confident'
                    ? '💪 That\'s great energy! Let\'s channel that confidence into something productive. What would you like to work on?'
                    : mood === 'nervous'
                        ? '🌟 A little nervousness is completely normal — it means you care. Let\'s convert that energy into preparation. What\'s your biggest concern right now?'
                        : '👍 Good to check in. Remember, wherever you are right now is a valid place to be. How can I help today?'
            }]);
        }
    };

    return (
        <div className="flex min-h-screen bg-white">
            <div className="flex-1 flex flex-col h-screen">
                <TopBar />

                {/* Bible XF-09 — Late Night Banner */}
                <AnimatePresence>
                    {showLateNightBanner && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="bg-gradient-to-r from-violet-900 to-indigo-900 text-white px-4 py-3"
                        >
                            <div className="max-w-3xl mx-auto flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-xl">🌙</span>
                                    <div>
                                        <p className="text-sm font-medium">It&apos;s late — are you okay?</p>
                                        <p className="text-xs text-white/70">Your brain retains more with proper rest. Consider sleeping and continuing tomorrow.</p>
                                    </div>
                                </div>
                                <button onClick={() => setShowLateNightBanner(false)} className="text-white/60 hover:text-white text-xs">✕</button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Chat area */}
                <div className="flex-1 overflow-y-auto">
                    {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full px-6 py-12">
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                    <span className="text-3xl">💬</span>
                                </div>
                                <h2 className="text-xl font-bold text-slate-900 text-center mb-2">Mentixy AI Career Advisor</h2>
                                <p className="text-slate-500 text-sm text-center mb-8 max-w-sm">
                                    Ask anything about careers, salaries, interview prep, or skill development
                                </p>

                                {/* Bible XF-09 — Placement Season Mood Check-in */}
                                {isPlacementSeason() && !moodCheckin && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="mb-8 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5 max-w-md mx-auto"
                                    >
                                        <p className="text-sm font-medium text-slate-800 mb-3 text-center">How are you feeling about placement season today?</p>
                                        <div className="flex flex-wrap justify-center gap-2">
                                            {[
                                                { id: 'confident', emoji: '💪', label: 'Confident' },
                                                { id: 'nervous', emoji: '😬', label: 'Nervous' },
                                                { id: 'overwhelmed', emoji: '😰', label: 'Overwhelmed' },
                                                { id: 'okay', emoji: '😊', label: 'Okay' },
                                                { id: 'need-help', emoji: '🆘', label: 'Need help' },
                                            ].map(mood => (
                                                <button
                                                    key={mood.id}
                                                    onClick={() => handleMoodCheckin(mood.id)}
                                                    className="px-3 py-2 bg-white border border-amber-200 rounded-xl text-sm hover:bg-amber-100 hover:border-amber-300 transition-all flex items-center gap-1.5"
                                                >
                                                    <span>{mood.emoji}</span>
                                                    <span className="text-slate-700 font-medium">{mood.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-w-lg">
                                    {QUICK_PROMPTS.map((prompt) => (
                                        <button
                                            key={prompt}
                                            onClick={() => sendMessage(prompt)}
                                            className="text-left px-4 py-3 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 rounded-xl text-sm text-slate-700 hover:text-indigo-700 transition-all"
                                        >
                                            {prompt}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    ) : (
                        <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
                            {messages.map((msg, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[85%] md:max-w-[70%] px-4 py-3 rounded-2xl ${msg.role === 'user'
                                            ? 'bg-indigo-600 text-white rounded-br-md'
                                            : msg.isSafety
                                                ? 'bg-rose-50 border border-rose-200 text-slate-800 rounded-bl-md'
                                                : 'bg-slate-100 text-slate-800 rounded-bl-md'
                                        }`}>
                                        <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                                    </div>
                                </motion.div>
                            ))}
                            {loading && (
                                <div className="flex justify-start">
                                    <div className="bg-slate-100 px-4 py-3 rounded-2xl rounded-bl-md">
                                        <div className="flex gap-1.5">
                                            <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>

                {/* Input */}
                <div className="border-t border-slate-200 bg-white px-4 py-3 pb-safe mb-16 md:mb-0">
                    <div className="max-w-3xl mx-auto flex gap-3">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
                            placeholder={isLateNight() ? "It's late — take care of yourself first 🌙" : "Ask about careers, salaries, interview prep..."}
                            className="st-input flex-1"
                            disabled={loading}
                        />
                        <button
                            onClick={() => sendMessage(input)}
                            disabled={!input.trim() || loading}
                            className="st-btn-primary px-6 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Send
                        </button>
                    </div>
                </div>

                <BottomNav />
            </div>
        </div>
    );
}
