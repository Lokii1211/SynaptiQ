'use client';
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api, auth } from '@/lib/api';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';
import { SideNav } from '@/components/layout/SideNav';

type Phase = 'setup' | 'interview' | 'feedback';
type InterviewType = 'technical' | 'hr' | 'behavioral' | 'system-design';

interface Message {
    role: 'interviewer' | 'candidate';
    content: string;
    timestamp: string;
}

const INTERVIEW_TYPES = [
    { key: 'technical' as InterviewType, icon: '💻', title: 'Technical', desc: 'DSA, coding, problem solving', duration: '25 min', difficulty: 'Medium-Hard' },
    { key: 'hr' as InterviewType, icon: '🤝', title: 'HR Round', desc: 'Behavioral, situational, cultural fit', duration: '20 min', difficulty: 'Medium' },
    { key: 'behavioral' as InterviewType, icon: '🧠', title: 'Behavioral', desc: 'STAR method, past experiences', duration: '20 min', difficulty: 'Medium' },
    { key: 'system-design' as InterviewType, icon: '🏗️', title: 'System Design', desc: 'Architecture, scalability, trade-offs', duration: '30 min', difficulty: 'Hard' },
];

const COMPANIES = ['TCS', 'Infosys', 'Wipro', 'Amazon', 'Google', 'Flipkart', 'Microsoft', 'Swiggy', 'Razorpay', 'General'];

const TECHNICAL_QUESTIONS = [
    'Explain the difference between an array and a linked list. When would you use each?',
    'What is the time complexity of searching in a hash map? How do you handle collisions?',
    'Write a function to detect a cycle in a linked list. Explain your approach.',
    'What is the difference between BFS and DFS? When would you prefer one over the other?',
    'Explain how a binary search tree works and how you would implement insertion.',
    'What is dynamic programming? Can you walk me through a DP problem?',
    'Explain the concept of recursion with an example. What are memoization benefits?',
    'What sorting algorithm would you choose for nearly sorted data and why?',
];

const HR_QUESTIONS = [
    'Tell me about yourself and what makes you a good fit for this role.',
    'What is your biggest strength and how has it helped you in your academic journey?',
    'Describe a challenging situation you faced in a team project and how you handled it.',
    'Where do you see yourself in 5 years?',
    'Why do you want to work at our company specifically?',
    'Tell me about a time when you disagreed with a team member. How did you resolve it?',
    'What motivates you to work in the tech industry?',
    'How do you handle pressure and tight deadlines?',
];

const BEHAVIORAL_QUESTIONS = [
    'Tell me about a time you had to learn a new technology quickly. How did you approach it?',
    'Describe a project you\'re most proud of. What was your specific contribution?',
    'Give an example of when you received critical feedback. How did you respond?',
    'Tell me about a time you took initiative beyond your assigned work.',
    'Describe a situation where you had to prioritize multiple tasks. How did you manage?',
    'Share an experience where you mentored or helped a peer learn something new.',
];

const SYSTEM_DESIGN_QUESTIONS = [
    'Design a URL shortening service like bit.ly. What are the key components?',
    'How would you design a real-time chat application like WhatsApp?',
    'Design a food delivery system like Swiggy. Focus on order matching and delivery tracking.',
    'How would you design a notification system that handles millions of users?',
    'Design a simple e-commerce search feature. How would you handle autocomplete?',
];

export default function SimulatorPage() {
    const [phase, setPhase] = useState<Phase>('setup');
    const [interviewType, setInterviewType] = useState<InterviewType>('technical');
    const [company, setCompany] = useState('General');
    const [messages, setMessages] = useState<Message[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const [questionIndex, setQuestionIndex] = useState(0);
    const [timer, setTimer] = useState(0);
    const [scores, setScores] = useState<{ question: string; score: number; feedback: string }[]>([]);
    const chatRef = useRef<HTMLDivElement>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!auth.isLoggedIn()) { window.location.href = '/login'; return; }
    }, []);

    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [messages]);

    const getQuestions = () => {
        switch (interviewType) {
            case 'technical': return TECHNICAL_QUESTIONS;
            case 'hr': return HR_QUESTIONS;
            case 'behavioral': return BEHAVIORAL_QUESTIONS;
            case 'system-design': return SYSTEM_DESIGN_QUESTIONS;
        }
    };

    const startInterview = () => {
        const questions = getQuestions();
        setPhase('interview');
        setQuestionIndex(0);
        setScores([]);
        setTimer(0);

        // Start timer
        timerRef.current = setInterval(() => setTimer(t => t + 1), 1000);

        // First question
        const intro = `Welcome to your ${interviewType === 'technical' ? 'Technical' : interviewType === 'hr' ? 'HR' : interviewType === 'behavioral' ? 'Behavioral' : 'System Design'} interview${company !== 'General' ? ` for ${company}` : ''}. I'll ask you ${Math.min(questions.length, 5)} questions. Take your time and think aloud.\n\nLet's begin:\n\n**${questions[0]}**`;

        setMessages([{ role: 'interviewer', content: intro, timestamp: new Date().toLocaleTimeString() }]);
    };

    const sendAnswer = async () => {
        if (!userInput.trim()) return;

        const questions = getQuestions();
        const answer = userInput.trim();
        setUserInput('');

        // Add user message
        setMessages(prev => [...prev, {
            role: 'candidate', content: answer, timestamp: new Date().toLocaleTimeString()
        }]);

        setIsThinking(true);

        // Simulate AI feedback delay
        await new Promise(r => setTimeout(r, 1500 + Math.random() * 1500));

        // Score the answer (simple heuristic)
        const wordCount = answer.split(/\s+/).length;
        const hasExamples = /for example|for instance|like|such as/i.test(answer);
        const isStructured = answer.includes('\n') || answer.length > 100;
        let score = 40;
        if (wordCount > 30) score += 15;
        if (wordCount > 60) score += 10;
        if (hasExamples) score += 15;
        if (isStructured) score += 10;
        score = Math.min(score + Math.floor(Math.random() * 10), 95);

        const feedbacks = [
            score >= 80 ? 'Excellent structure and depth in your answer.' :
                score >= 60 ? 'Good answer, but consider adding more specific examples.' :
                    'Your answer needs more depth. Try the STAR method for behavioral questions.',
        ];

        setScores(prev => [...prev, { question: questions[questionIndex], score, feedback: feedbacks[0] }]);

        const nextIdx = questionIndex + 1;

        if (nextIdx >= Math.min(questions.length, 5)) {
            // End interview
            if (timerRef.current) clearInterval(timerRef.current);
            setMessages(prev => [...prev, {
                role: 'interviewer',
                content: `Thank you for your answers! That concludes our ${interviewType} interview. Click "View Feedback" to see your detailed evaluation.`,
                timestamp: new Date().toLocaleTimeString()
            }]);
            setIsThinking(false);
            setTimeout(() => setPhase('feedback'), 2000);
        } else {
            setQuestionIndex(nextIdx);
            setMessages(prev => [...prev, {
                role: 'interviewer',
                content: `${score >= 70 ? '👍 Good answer!' : '📝 Noted.'} Let me ask the next question:\n\n**${questions[nextIdx]}**`,
                timestamp: new Date().toLocaleTimeString()
            }]);
            setIsThinking(false);
        }
    };

    const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;
    const avgScore = scores.length ? Math.round(scores.reduce((a, s) => a + s.score, 0) / scores.length) : 0;

    return (
        <div className="flex min-h-screen bg-slate-50">
            <SideNav />
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1 pb-24 md:pb-8">

                    {/* SETUP PHASE */}
                    {phase === 'setup' && (
                        <>
                            <div className="bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 text-white px-6 py-10 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
                                <div className="max-w-3xl mx-auto relative z-10">
                                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                                        <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full mb-3 inline-block">🎭 MOCK INTERVIEW</span>
                                        <h1 className="text-3xl font-bold mb-2">AI Interview Simulator</h1>
                                        <p className="text-white/60 text-sm">Practice with an AI interviewer. Get instant feedback on your answers.</p>
                                    </motion.div>
                                </div>
                            </div>

                            <div className="px-4 md:px-6 py-6 max-w-3xl mx-auto space-y-6">
                                {/* Interview Type */}
                                <div>
                                    <h3 className="font-bold text-slate-900 mb-3">Choose Interview Type</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {INTERVIEW_TYPES.map(type => (
                                            <motion.button key={type.key}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => setInterviewType(type.key)}
                                                className={`st-card p-4 text-left transition-all ${interviewType === type.key
                                                    ? 'border-2 border-indigo-500 bg-indigo-50 shadow-lg' : 'hover:shadow-md'}`}
                                            >
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="text-2xl">{type.icon}</span>
                                                    <div className="flex-1">
                                                        <p className="font-bold text-sm text-slate-900">{type.title}</p>
                                                        <p className="text-xs text-slate-500">{type.desc}</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-3 text-xs text-slate-400">
                                                    <span>⏱ {type.duration}</span>
                                                    <span>📊 {type.difficulty}</span>
                                                </div>
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>

                                {/* Company */}
                                <div>
                                    <h3 className="font-bold text-slate-900 mb-3">Target Company</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {COMPANIES.map(c => (
                                            <button key={c} onClick={() => setCompany(c)}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${company === c
                                                    ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-200'
                                                    }`}>{c}</button>
                                        ))}
                                    </div>
                                </div>

                                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                    onClick={startInterview}
                                    className="st-btn-primary w-full py-4 text-base font-bold">
                                    Start Mock Interview →
                                </motion.button>
                            </div>
                        </>
                    )}

                    {/* INTERVIEW PHASE */}
                    {phase === 'interview' && (
                        <div className="flex flex-col h-[calc(100vh-64px)]">
                            {/* Interview header */}
                            <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-sm">🎭</div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">
                                            {interviewType === 'technical' ? 'Technical' : interviewType === 'hr' ? 'HR' : interviewType === 'behavioral' ? 'Behavioral' : 'System Design'} Interview
                                        </p>
                                        <p className="text-[10px] text-slate-400">{company} · Q{questionIndex + 1}/5</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-mono text-slate-500 bg-slate-50 px-3 py-1 rounded-lg">{formatTime(timer)}</span>
                                    <button onClick={() => { if (timerRef.current) clearInterval(timerRef.current); setPhase('feedback'); }}
                                        className="text-xs text-red-500 font-medium hover:text-red-600">End</button>
                                </div>
                            </div>

                            {/* Chat area */}
                            <div ref={chatRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-slate-50">
                                {messages.map((msg, i) => (
                                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                        className={`flex ${msg.role === 'candidate' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`max-w-[85%] rounded-2xl p-4 ${msg.role === 'candidate'
                                            ? 'bg-indigo-600 text-white rounded-br-sm'
                                            : 'bg-white text-slate-700 border border-slate-200 rounded-bl-sm'
                                            }`}>
                                            <p className="text-sm whitespace-pre-line leading-relaxed"
                                                dangerouslySetInnerHTML={{
                                                    __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
                                                }} />
                                            <p className={`text-[10px] mt-1 ${msg.role === 'candidate' ? 'text-indigo-200' : 'text-slate-300'}`}>
                                                {msg.timestamp}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                                {isThinking && (
                                    <div className="flex justify-start">
                                        <div className="bg-white text-slate-500 rounded-2xl rounded-bl-sm p-4 border border-slate-200">
                                            <div className="flex gap-1">
                                                <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                                <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                                <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Input */}
                            <div className="bg-white border-t border-slate-200 px-4 py-3">
                                <div className="flex gap-2 max-w-3xl mx-auto">
                                    <textarea value={userInput} onChange={e => setUserInput(e.target.value)}
                                        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendAnswer(); } }}
                                        placeholder="Type your answer... (Shift+Enter for new line)"
                                        className="st-input flex-1 resize-none h-12 py-3"
                                        disabled={isThinking} />
                                    <button onClick={sendAnswer} disabled={!userInput.trim() || isThinking}
                                        className="st-btn-primary px-4 shrink-0 disabled:opacity-50">Send</button>
                                </div>
                                <p className="text-[10px] text-slate-400 text-center mt-1">
                                    {userInput.split(/\s+/).filter(Boolean).length} words · Tip: Use STAR method (Situation, Task, Action, Result)
                                </p>
                            </div>
                        </div>
                    )}

                    {/* FEEDBACK PHASE */}
                    {phase === 'feedback' && (
                        <>
                            <div className={`bg-gradient-to-br ${avgScore >= 75 ? 'from-emerald-500 to-green-600' : avgScore >= 50 ? 'from-amber-500 to-orange-600' : 'from-red-500 to-rose-600'} text-white px-6 py-10`}>
                                <div className="max-w-3xl mx-auto text-center">
                                    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
                                        <span className="text-6xl block mb-4">{avgScore >= 75 ? '🎉' : avgScore >= 50 ? '💪' : '📚'}</span>
                                        <h1 className="text-3xl font-bold mb-2">Interview Complete!</h1>
                                        <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-8 py-4 inline-block mb-2">
                                            <p className="text-5xl font-bold">{avgScore}%</p>
                                            <p className="text-xs text-white/60">Overall Score</p>
                                        </div>
                                        <p className="text-sm text-white/60">Time: {formatTime(timer)} · {scores.length} questions answered</p>
                                    </motion.div>
                                </div>
                            </div>

                            <div className="px-4 md:px-6 py-6 max-w-3xl mx-auto space-y-4">
                                <h3 className="font-bold text-slate-900">Question-by-Question Feedback</h3>
                                {scores.map((s, i) => (
                                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                                        className="st-card p-5">
                                        <div className="flex items-start justify-between mb-2">
                                            <p className="font-semibold text-sm text-slate-900 flex-1">Q{i + 1}: {s.question}</p>
                                            <span className={`text-sm font-bold px-2 py-0.5 rounded-lg shrink-0 ml-3 ${s.score >= 75 ? 'bg-green-50 text-green-700' : s.score >= 50 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'}`}>
                                                {s.score}%
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500">{s.feedback}</p>
                                        <div className="mt-2 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                            <motion.div initial={{ width: 0 }} animate={{ width: `${s.score}%` }}
                                                transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }}
                                                className={`h-full rounded-full ${s.score >= 75 ? 'bg-green-500' : s.score >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} />
                                        </div>
                                    </motion.div>
                                ))}

                                <div className="flex gap-3 pt-4">
                                    <button onClick={() => { setPhase('setup'); setMessages([]); setScores([]); setTimer(0); }}
                                        className="st-btn-primary flex-1 py-3">Try Another Interview</button>
                                    <button onClick={() => { window.location.href = '/mock-drive'; }}
                                        className="st-btn-secondary flex-1 py-3">Try Mock Drive →</button>
                                </div>
                            </div>
                        </>
                    )}
                </main>
                <BottomNav />
            </div>
        </div>
    );
}
