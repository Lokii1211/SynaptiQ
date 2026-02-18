"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

interface Message {
    role: "user" | "assistant";
    content: string;
}

const SUGGESTIONS = [
    "What career suits someone who loves math and problem-solving?",
    "How do I prepare for a product manager role?",
    "What's the salary range for AI engineers in India?",
    "Which skills are trending in 2026?",
    "Should I do an MBA after B.Tech?",
    "How to transition from mechanical engineering to tech?",
];

export default function ChatPage() {
    const router = useRouter();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }, [messages]);

    const sendMessage = async (text?: string) => {
        const msg = text || input.trim();
        if (!msg || loading) return;

        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/signup");
            return;
        }

        setInput("");
        setMessages((prev) => [...prev, { role: "user", content: msg }]);
        setLoading(true);

        try {
            const data = await api.chat({ message: msg, session_id: sessionId || undefined });
            setSessionId(data.session_id);
            setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
        } catch (err: any) {
            if (err.message.includes("401") || err.message.includes("Authentication")) {
                router.push("/login");
                return;
            }
            setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, I'm having trouble right now. Please try again." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen bg-[#0a0a0f] flex flex-col">
            {/* Nav */}
            <nav className="border-b border-white/5 glass-strong z-50">
                <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-sm font-bold">S</div>
                        <span className="text-lg font-bold">Skill<span className="text-indigo-400">Sync</span></span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 hidden sm:block">AI Career Counselor</span>
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    </div>
                </div>
            </nav>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto">
                <div className="max-w-3xl mx-auto px-6 py-8">
                    {messages.length === 0 ? (
                        <div className="text-center py-20 animate-fadeInUp">
                            <div className="text-6xl mb-6">💬</div>
                            <h2 className="text-2xl font-bold mb-3">AI Career Counselor</h2>
                            <p className="text-gray-400 max-w-md mx-auto mb-10">
                                Ask me anything about careers, skills, education, salaries, or job market trends.
                                I&apos;m here to help you make better career decisions.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
                                {SUGGESTIONS.map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => sendMessage(s)}
                                        className="text-left p-3 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-indigo-500/30 rounded-xl text-sm text-gray-400 transition"
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fadeInUp`}>
                                    <div className={`max-w-[80%] ${msg.role === "user" ? "order-1" : ""}`}>
                                        <div className={`rounded-2xl px-5 py-3 ${msg.role === "user"
                                                ? "bg-indigo-600 text-white rounded-br-md"
                                                : "bg-white/5 border border-white/10 text-gray-200 rounded-bl-md"
                                            }`}>
                                            <div className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</div>
                                        </div>
                                        <div className={`text-xs text-gray-600 mt-1 ${msg.role === "user" ? "text-right" : ""}`}>
                                            {msg.role === "user" ? "You" : "SkillSync AI"}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="flex justify-start animate-fadeInUp">
                                    <div className="bg-white/5 border border-white/10 rounded-2xl rounded-bl-md px-5 py-4">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Input */}
            <div className="border-t border-white/5 glass-strong">
                <div className="max-w-3xl mx-auto px-6 py-4">
                    <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex items-center gap-3">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about any career, skill, or education path..."
                            className="input-field flex-1 !rounded-full !py-3"
                            disabled={loading}
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || loading}
                            className="w-12 h-12 bg-indigo-600 hover:bg-indigo-500 rounded-full flex items-center justify-center transition disabled:opacity-30"
                        >
                            <span className="text-xl">↑</span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
