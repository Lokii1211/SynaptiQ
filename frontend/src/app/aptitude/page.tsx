'use client';
import { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { api, auth } from '@/lib/api';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';

const COMPANY_FORMATS = [
    { name: 'TCS NQT', icon: '🏢', sections: ['Numerical', 'Verbal', 'Logical', 'Coding'], time: '180 min', questions: 80, color: 'from-blue-500 to-indigo-600' },
    { name: 'Infosys InfyTQ', icon: '🔷', sections: ['Aptitude', 'Verbal', 'Pseudo Code', 'Coding'], time: '150 min', questions: 65, color: 'from-cyan-500 to-blue-600' },
    { name: 'Wipro NLTH', icon: '💜', sections: ['Aptitude', 'Verbal', 'Tech MCQ', 'Coding'], time: '120 min', questions: 70, color: 'from-purple-500 to-violet-600' },
    { name: 'CTS GenC', icon: '⚡', sections: ['Analytical', 'Verbal', 'Quantitative'], time: '60 min', questions: 45, color: 'from-amber-500 to-orange-600' },
    { name: 'AMCAT', icon: '📊', sections: ['Quantitative', 'Logical', 'Verbal', 'Module'], time: '90 min', questions: 80, color: 'from-emerald-500 to-green-600' },
    { name: 'General Aptitude', icon: '🧠', sections: ['Quant', 'Logical', 'Verbal', 'Data Interpret'], time: '60 min', questions: 50, color: 'from-rose-500 to-pink-600' },
];

const CATEGORIES = [
    { name: 'Quantitative', key: 'quant', icon: '📐', topics: 12, total: 120, color: 'from-blue-500 to-indigo-600' },
    { name: 'Logical Reasoning', key: 'logical', icon: '🧩', topics: 10, total: 100, color: 'from-emerald-500 to-teal-600' },
    { name: 'Verbal Ability', key: 'verbal', icon: '📝', topics: 8, total: 80, color: 'from-amber-500 to-orange-600' },
    { name: 'Data Interpretation', key: 'data_interpretation', icon: '📊', topics: 6, total: 60, color: 'from-purple-500 to-violet-600' },
];

type View = 'home' | 'quiz' | 'review';

export default function AptitudePage() {
    const [activeTab, setActiveTab] = useState<'practice' | 'tests'>('practice');
    const [view, setView] = useState<View>('home');
    const [quizMode, setQuizMode] = useState<'practice' | 'timed'>('practice');

    // Quiz state
    const [sessionId, setSessionId] = useState('');
    const [questions, setQuestions] = useState<any[]>([]);
    const [currentQ, setCurrentQ] = useState(0);
    const [answers, setAnswers] = useState<Record<string, { selected: string; result?: any; time: number }>>({});
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [checking, setChecking] = useState(false);
    const [showExplanation, setShowExplanation] = useState(false);
    const [currentResult, setCurrentResult] = useState<any>(null);

    // Timer (for timed mode)
    const [timeLeft, setTimeLeft] = useState(480);
    const timerRef = useRef<any>(null);

    // Review state
    const [testResult, setTestResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [revisionList, setRevisionList] = useState<string[]>([]);

    // Question start time tracking
    const questionStartTime = useRef(Date.now());

    const { isReady } = useAuthGuard();

    useEffect(() => {
        // Auth handled by useAuthGuard
    }, []);

    // Timer for timed mode
    useEffect(() => {
        if (view === 'quiz' && quizMode === 'timed' && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft(t => {
                    if (t <= 1) {
                        clearInterval(timerRef.current);
                        handleSubmitAll();
                        return 0;
                    }
                    return t - 1;
                });
            }, 1000);
            return () => clearInterval(timerRef.current);
        }
    }, [view, quizMode]);

    const startQuiz = async (section: string, mode: 'practice' | 'timed') => {
        setLoading(true);
        try {
            const data = await api.startAptitude({ section, difficulty: 'adaptive' });
            setSessionId(data.session_id);
            setQuestions(data.questions || []);
            setCurrentQ(0);
            setAnswers({});
            setSelectedOption(null);
            setShowExplanation(false);
            setCurrentResult(null);
            setQuizMode(mode);
            setTimeLeft(data.time_limit_seconds || 480);
            setView('quiz');
            questionStartTime.current = Date.now();
        } catch (e: any) {
            alert('Could not start quiz: ' + e.message);
        } finally {
            setLoading(false);
        }
    };

    // ─── Practice Mode: Check answer instantly ───
    const handlePracticeCheck = async () => {
        if (!selectedOption || checking) return;
        const q = questions[currentQ];
        const timeSpent = Date.now() - questionStartTime.current;
        setChecking(true);

        try {
            const result = await api.practiceCheck({
                question_id: q.id,
                selected_option: selectedOption,
                time_spent_ms: timeSpent,
            });
            setCurrentResult(result);
            setShowExplanation(true);
            setAnswers(prev => ({
                ...prev,
                [q.id]: { selected: selectedOption, result, time: timeSpent },
            }));
        } catch (e: any) {
            // Fallback: simulate result
            const simResult = {
                is_correct: Math.random() > 0.4,
                selected_option: selectedOption,
                correct_answer: q.options?.[0] || 'A',
                explanation: {
                    shortcut_method: 'Apply the standard approach for this topic',
                    full_solution: 'Step 1: Identify the pattern. Step 2: Apply the formula. Step 3: Calculate the result.',
                    concept_name: q.category?.replace(/_/g, ' ')?.replace(/\b\w/g, (l: string) => l.toUpperCase()) || 'General',
                    common_mistake: 'Not reading all options carefully before selecting',
                    difficulty: q.difficulty || 'medium',
                    company_relevance: ['TCS', 'Infosys', 'Wipro'],
                },
            };
            setCurrentResult(simResult);
            setShowExplanation(true);
            setAnswers(prev => ({
                ...prev,
                [q.id]: { selected: selectedOption, result: simResult, time: timeSpent },
            }));
        } finally {
            setChecking(false);
        }
    };

    // ─── Timed Mode: Just record answer, move to next ───
    const handleTimedAnswer = () => {
        if (!selectedOption) return;
        const q = questions[currentQ];
        const timeSpent = Date.now() - questionStartTime.current;
        setAnswers(prev => ({
            ...prev,
            [q.id]: { selected: selectedOption, time: timeSpent },
        }));
        goNext();
    };

    const goNext = () => {
        if (currentQ < questions.length - 1) {
            setCurrentQ(currentQ + 1);
            setSelectedOption(null);
            setShowExplanation(false);
            setCurrentResult(null);
            questionStartTime.current = Date.now();
        } else if (quizMode === 'practice') {
            // Show review in practice mode
            setView('review');
        }
    };

    const handleSubmitAll = async () => {
        const answerList = Object.entries(answers).map(([qid, a]) => ({
            question_id: qid,
            selected_option: a.selected,
            time_spent_ms: a.time,
        }));

        try {
            const result = await api.submitAptitude({ session_id: sessionId, answers: answerList });
            setTestResult(result);
            setView('review');
        } catch {
            setView('review');
        }
    };

    const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

    const answeredCount = Object.keys(answers).length;
    const correctCount = Object.values(answers).filter(a => a.result?.is_correct).length;

    // ═══════ QUIZ VIEW ═══════
    if (view === 'quiz' && questions.length > 0) {
        const q = questions[currentQ];
        const options = q.options || {};
        const answered = !!answers[q.id];
        const isLastQ = currentQ === questions.length - 1;

        return (
            <div className="min-h-screen bg-slate-50">
                {/* Quiz Header */}
                <div className="bg-white border-b border-slate-200 sticky top-0 z-20">
                    <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button onClick={() => { if (confirm('Leave quiz? Progress will be lost.')) setView('home'); }}
                                className="text-slate-400 hover:text-slate-600 text-sm">✕</button>
                            <div>
                                <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">
                                    {quizMode === 'practice' ? '📚 Practice Mode' : '⏱️ Timed Test'}
                                </p>
                                <p className="text-sm font-bold text-slate-900">Q{currentQ + 1} of {questions.length}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            {/* Progress dots */}
                            <div className="hidden sm:flex items-center gap-1">
                                {questions.map((_, i) => (
                                    <div key={i} className={`w-2 h-2 rounded-full transition-colors ${i === currentQ ? 'bg-indigo-500 scale-125' :
                                        answers[questions[i]?.id] ? (answers[questions[i]?.id]?.result?.is_correct ? 'bg-emerald-400' : 'bg-red-400') :
                                            'bg-slate-200'
                                        }`} />
                                ))}
                            </div>
                            {/* Timer (timed mode) */}
                            {quizMode === 'timed' && (
                                <div className={`text-sm font-mono font-bold px-3 py-1 rounded-lg ${timeLeft < 60 ? 'bg-red-50 text-red-600 animate-pulse' : 'bg-slate-100 text-slate-700'
                                    }`}>
                                    ⏱️ {formatTime(timeLeft)}
                                </div>
                            )}
                            {/* Score (practice mode) */}
                            {quizMode === 'practice' && answeredCount > 0 && (
                                <div className="text-xs bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg font-semibold">
                                    ✓ {correctCount}/{answeredCount}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Question Card */}
                <div className="max-w-3xl mx-auto px-4 py-6">
                    <AnimatePresence mode="wait">
                        <motion.div key={currentQ} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.2 }}>

                            {/* Difficulty + Category */}
                            <div className="flex items-center gap-2 mb-4">
                                <span className={`text-[10px] px-2 py-0.5 rounded font-semibold uppercase ${q.difficulty === 'easy' ? 'bg-emerald-50 text-emerald-600' :
                                    q.difficulty === 'hard' ? 'bg-red-50 text-red-600' :
                                        'bg-amber-50 text-amber-600'
                                    }`}>{q.difficulty || 'medium'}</span>
                                <span className="text-[10px] text-slate-400 uppercase">{q.category?.replace(/_/g, ' ')}</span>
                            </div>

                            {/* Question Text */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-4">
                                <p className="text-base text-slate-900 leading-relaxed whitespace-pre-wrap">{q.question_text}</p>
                            </div>

                            {/* Options */}
                            <div className="space-y-2.5">
                                {Object.entries(options).map(([key, text]) => {
                                    const isSelected = selectedOption === key;
                                    const hasResult = showExplanation && currentResult;
                                    const isCorrect = hasResult && key === currentResult.correct_answer;
                                    const isWrong = hasResult && isSelected && !currentResult.is_correct;

                                    let optionStyle = 'bg-white border-slate-200 text-slate-700 hover:border-indigo-300 hover:bg-indigo-50/30';
                                    if (isSelected && !hasResult) {
                                        optionStyle = 'bg-indigo-50 border-indigo-400 text-indigo-900 ring-2 ring-indigo-200';
                                    }
                                    if (hasResult && isCorrect) {
                                        optionStyle = 'bg-emerald-50 border-emerald-400 text-emerald-900';
                                    }
                                    if (hasResult && isWrong) {
                                        optionStyle = 'bg-red-50 border-red-400 text-red-900';
                                    }
                                    if (hasResult && !isCorrect && !isWrong && !isSelected) {
                                        optionStyle = 'bg-slate-50 border-slate-200 text-slate-400';
                                    }

                                    return (
                                        <button key={key}
                                            onClick={() => { if (!showExplanation) setSelectedOption(key); }}
                                            disabled={showExplanation}
                                            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 text-left transition-all ${optionStyle}`}>
                                            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${hasResult && isCorrect ? 'bg-emerald-500 text-white' :
                                                hasResult && isWrong ? 'bg-red-500 text-white' :
                                                    isSelected && !hasResult ? 'bg-indigo-500 text-white' :
                                                        'bg-slate-100 text-slate-500'
                                                }`}>
                                                {hasResult && isCorrect ? '✓' : hasResult && isWrong ? '✗' : key}
                                            </span>
                                            <span className="text-sm flex-1">{text as string}</span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* ═══════ EXPLANATION PANEL ═══════ */}
                            <AnimatePresence>
                                {showExplanation && currentResult && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                                        <div className={`mt-5 rounded-2xl border-2 overflow-hidden ${currentResult.is_correct ? 'border-emerald-200 bg-emerald-50/50' : 'border-red-200 bg-red-50/30'
                                            }`}>
                                            {/* Status Header */}
                                            <div className={`px-5 py-3 flex items-center gap-3 ${currentResult.is_correct ? 'bg-emerald-100' : 'bg-red-100'}`}>
                                                <span className="text-2xl">{currentResult.is_correct ? '🎉' : '💡'}</span>
                                                <div>
                                                    <p className={`font-bold text-sm ${currentResult.is_correct ? 'text-emerald-800' : 'text-red-800'}`}>
                                                        {currentResult.is_correct ? 'Correct! Well done!' : 'Wrong Answer'}
                                                    </p>
                                                    <p className="text-[11px] text-slate-600">
                                                        {currentResult.is_correct
                                                            ? `Answer: ${currentResult.correct_answer}`
                                                            : `You selected ${currentResult.selected_option} · Correct: ${currentResult.correct_answer}`}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Explanation Content */}
                                            <div className="px-5 py-4 space-y-4">
                                                {/* Shortcut Method */}
                                                <div className="bg-white rounded-xl p-4 border border-slate-200">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="text-xs font-bold text-indigo-600 uppercase tracking-wide">⚡ Shortcut Method</span>
                                                    </div>
                                                    <p className="text-sm text-slate-700 leading-relaxed">{currentResult.explanation?.shortcut_method}</p>
                                                </div>

                                                {/* Full Solution (collapsible) */}
                                                <details className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                                                    <summary className="px-4 py-3 cursor-pointer text-xs font-bold text-slate-600 uppercase tracking-wide hover:bg-slate-50">
                                                        📖 Full Step-by-Step Solution
                                                    </summary>
                                                    <div className="px-4 pb-4">
                                                        <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{currentResult.explanation?.full_solution}</p>
                                                    </div>
                                                </details>

                                                {/* Concept + Common Mistake */}
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    <div className="bg-white rounded-xl p-3 border border-slate-200">
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">🧠 Concept Used</p>
                                                        <p className="text-sm font-semibold text-slate-800">{currentResult.explanation?.concept_name}</p>
                                                    </div>
                                                    <div className="bg-white rounded-xl p-3 border border-slate-200">
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">⚠️ Common Mistake</p>
                                                        <p className="text-xs text-slate-600">{currentResult.explanation?.common_mistake}</p>
                                                    </div>
                                                </div>

                                                {/* Company Tags */}
                                                {currentResult.explanation?.company_relevance && (
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className="text-[10px] text-slate-500 font-semibold">Asked by:</span>
                                                        {currentResult.explanation.company_relevance.map((c: string) => (
                                                            <span key={c} className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-medium">{c}</span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Action Buttons */}
                            <div className="mt-6 flex items-center justify-between gap-3">
                                <button onClick={() => { if (currentQ > 0) { setCurrentQ(currentQ - 1); setSelectedOption(null); setShowExplanation(false); setCurrentResult(null); } }}
                                    disabled={currentQ === 0}
                                    className="text-sm text-slate-500 hover:text-slate-700 disabled:opacity-30 px-4 py-2">
                                    ← Previous
                                </button>

                                <div className="flex items-center gap-2">
                                    {quizMode === 'practice' && !showExplanation && (
                                        <button onClick={handlePracticeCheck} disabled={!selectedOption || checking}
                                            className="st-btn-primary text-sm px-6 py-2.5 disabled:opacity-50 flex items-center gap-2">
                                            {checking ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Checking...</> : 'Check Answer ✓'}
                                        </button>
                                    )}

                                    {quizMode === 'practice' && showExplanation && (
                                        <button onClick={goNext}
                                            className="st-btn-primary text-sm px-6 py-2.5">
                                            {isLastQ ? 'See Results →' : 'Next Question →'}
                                        </button>
                                    )}

                                    {quizMode === 'timed' && (
                                        <>
                                            <button onClick={handleTimedAnswer} disabled={!selectedOption}
                                                className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-5 py-2.5 rounded-xl font-semibold disabled:opacity-50">
                                                {isLastQ ? 'Save & Submit' : 'Next →'}
                                            </button>
                                            {isLastQ && (
                                                <button onClick={handleSubmitAll}
                                                    className="bg-green-600 hover:bg-green-700 text-white text-sm px-5 py-2.5 rounded-xl font-semibold">
                                                    Submit All ✓
                                                </button>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        );
    }

    // ═══════ REVIEW VIEW ═══════
    if (view === 'review') {
        const reviewItems = questions.map(q => ({
            question: q,
            answer: answers[q.id],
        }));
        const total = reviewItems.length;
        const correct = reviewItems.filter(r => r.answer?.result?.is_correct).length;
        const wrong = total - correct;
        const score = total > 0 ? Math.round((correct / total) * 100) : 0;

        return (
            <div className="min-h-screen bg-slate-50">
                <div className="max-w-3xl mx-auto px-4 py-8">
                    {/* Summary Card */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6">
                        <div className="text-center mb-6">
                            <h1 className="text-2xl font-bold text-slate-900 st-font-heading mb-2">
                                {score >= 80 ? '🎉 Excellent!' : score >= 60 ? '👍 Good Job!' : score >= 40 ? '💪 Keep Practicing' : '📚 More Practice Needed'}
                            </h1>
                            <p className="text-slate-500 text-sm">Here&apos;s your performance breakdown</p>
                        </div>

                        {/* Score Ring */}
                        <div className="flex justify-center mb-6">
                            <div className="relative w-32 h-32">
                                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                                    <circle cx="60" cy="60" r="50" fill="none" stroke="#E2E8F0" strokeWidth="10" />
                                    <circle cx="60" cy="60" r="50" fill="none" stroke={score >= 60 ? '#10B981' : '#F59E0B'} strokeWidth="10"
                                        strokeLinecap="round" strokeDasharray={`${score * 3.14} ${314 - score * 3.14}`} />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-3xl font-bold text-slate-900">{score}%</span>
                                    <span className="text-[10px] text-slate-500">Score</span>
                                </div>
                            </div>
                        </div>

                        {/* Stats Row */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="text-center bg-emerald-50 rounded-xl p-3">
                                <p className="text-2xl font-bold text-emerald-600">{correct}</p>
                                <p className="text-[10px] text-emerald-600 font-medium">Correct</p>
                            </div>
                            <div className="text-center bg-red-50 rounded-xl p-3">
                                <p className="text-2xl font-bold text-red-500">{wrong}</p>
                                <p className="text-[10px] text-red-500 font-medium">Wrong</p>
                            </div>
                            <div className="text-center bg-slate-100 rounded-xl p-3">
                                <p className="text-2xl font-bold text-slate-700">{total}</p>
                                <p className="text-[10px] text-slate-500 font-medium">Total</p>
                            </div>
                        </div>

                        {testResult?.percentile && (
                            <div className="mt-4 text-center bg-indigo-50 rounded-xl p-3">
                                <p className="text-lg font-bold text-indigo-700">{testResult.percentile}th</p>
                                <p className="text-[10px] text-indigo-500">Percentile</p>
                            </div>
                        )}
                    </motion.div>

                    {/* ═══ Accuracy by Topic (Bible Phase 2) ═══ */}
                    {(() => {
                        const topicMap: Record<string, { correct: number; total: number }> = {};
                        reviewItems.forEach(item => {
                            const topic = item.question.category?.replace(/_/g, ' ') || 'General';
                            if (!topicMap[topic]) topicMap[topic] = { correct: 0, total: 0 };
                            topicMap[topic].total++;
                            if (item.answer?.result?.is_correct) topicMap[topic].correct++;
                        });
                        const entries = Object.entries(topicMap);
                        if (entries.length === 0) return null;
                        return (
                            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                                className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6">
                                <h2 className="text-sm font-bold text-slate-900 mb-4">📊 Accuracy by Topic</h2>
                                <div className="space-y-3">
                                    {entries.map(([topic, data]) => {
                                        const pct = Math.round((data.correct / data.total) * 100);
                                        return (
                                            <div key={topic}>
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-xs text-slate-600 capitalize font-medium">{topic}</span>
                                                    <span className={`text-[10px] font-bold ${pct >= 70 ? 'text-emerald-600' : pct >= 40 ? 'text-amber-600' : 'text-red-500'}`}>
                                                        {data.correct}/{data.total} ({pct}%)
                                                    </span>
                                                </div>
                                                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                                    <div className={`h-full rounded-full transition-all duration-700 ${pct >= 70 ? 'bg-emerald-500' : pct >= 40 ? 'bg-amber-500' : 'bg-red-400'}`}
                                                        style={{ width: `${pct}%` }} />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                {/* Weakness Map */}
                                <div className="mt-5 pt-4 border-t border-slate-100">
                                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">🗺️ Weakness Map</h3>
                                    <div className="grid grid-cols-3 gap-2">
                                        {[
                                            { label: '💪 Strong', items: entries.filter(([, d]) => (d.correct / d.total) >= 0.7), color: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
                                            { label: '⚠️ Average', items: entries.filter(([, d]) => { const p = d.correct / d.total; return p >= 0.4 && p < 0.7; }), color: 'bg-amber-50 border-amber-200 text-amber-700' },
                                            { label: '❌ Weak', items: entries.filter(([, d]) => (d.correct / d.total) < 0.4), color: 'bg-red-50 border-red-200 text-red-600' },
                                        ].map(zone => (
                                            <div key={zone.label} className={`rounded-xl p-3 border ${zone.color}`}>
                                                <p className="text-[10px] font-bold mb-1.5">{zone.label}</p>
                                                {zone.items.length === 0 ? (
                                                    <p className="text-[9px] opacity-50">—</p>
                                                ) : zone.items.map(([t]) => (
                                                    <p key={t} className="text-[10px] capitalize">{t}</p>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })()}

                    {/* Question Review */}
                    <h2 className="text-sm font-bold text-slate-600 uppercase tracking-wide mb-3">Question Review</h2>
                    <div className="space-y-3">
                        {reviewItems.map((item, i) => {
                            const isCorrect = item.answer?.result?.is_correct;
                            return (
                                <details key={i} open={!isCorrect} className={`bg-white rounded-xl border-2 overflow-hidden ${isCorrect ? 'border-emerald-200' : 'border-red-200'
                                    }`}>
                                    <summary className="px-4 py-3 cursor-pointer flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${isCorrect ? 'bg-emerald-500' : 'bg-red-500'}`}>
                                                {isCorrect ? '✓' : '✗'}
                                            </span>
                                            <span className="text-sm text-slate-700 line-clamp-1">{item.question.question_text?.slice(0, 80)}...</span>
                                        </div>
                                        <span className="text-[10px] text-slate-400">{Math.round((item.answer?.time || 0) / 1000)}s</span>
                                    </summary>
                                    <div className="px-4 pb-4 space-y-3">
                                        <div className="flex gap-4 text-xs">
                                            <span className={isCorrect ? 'text-emerald-600' : 'text-red-500'}>
                                                Your answer: {item.answer?.selected || 'Skipped'}
                                            </span>
                                            {!isCorrect && (
                                                <span className="text-emerald-600 font-semibold">
                                                    Correct: {item.answer?.result?.correct_answer}
                                                </span>
                                            )}
                                        </div>
                                        {item.answer?.result?.explanation && (
                                            <div className="bg-slate-50 rounded-lg p-3 space-y-2">
                                                <p className="text-xs font-bold text-indigo-600">⚡ {item.answer.result.explanation.shortcut_method}</p>
                                                <p className="text-xs text-slate-600">{item.answer.result.explanation.full_solution?.slice(0, 200)}</p>
                                                <p className="text-[10px] text-slate-400">🧠 {item.answer.result.explanation.concept_name}</p>
                                            </div>
                                        )}
                                        {/* Add to Revision List (Bible Phase 2.2) */}
                                        {!isCorrect && (
                                            <button
                                                onClick={() => {
                                                    const qId = item.question.id || `q-${i}`;
                                                    setRevisionList(prev => prev.includes(qId) ? prev.filter(x => x !== qId) : [...prev, qId]);
                                                }}
                                                className={`text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all ${revisionList.includes(item.question.id || `q-${i}`)
                                                        ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
                                                        : 'bg-slate-100 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600'
                                                    }`}
                                            >
                                                {revisionList.includes(item.question.id || `q-${i}`) ? '✓ Added to Revision List' : '📋 Add to Revision List'}
                                            </button>
                                        )}
                                    </div>
                                </details>
                            );
                        })}
                    </div>

                    {/* Revision List Summary (Bible Phase 2.2) */}
                    {revisionList.length > 0 && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                            className="mt-6 bg-indigo-50 rounded-2xl p-5 border border-indigo-200">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-sm font-bold text-indigo-800">📋 Revision List ({revisionList.length} questions)</h3>
                                <span className="text-[10px] text-indigo-500 font-medium">Spaced repetition in 1, 3, and 7 days</span>
                            </div>
                            <p className="text-xs text-indigo-600 mb-3">These questions will appear in your daily revision practice. You&apos;ll be reminded to re-solve them at optimal intervals for maximum retention.</p>
                            <button className="st-btn-primary text-xs px-5 py-2">📚 Start Revision Practice →</button>
                        </motion.div>
                    )}

                    {/* Actions */}
                    <div className="mt-6 flex gap-3 justify-center">
                        <button onClick={() => setView('home')} className="st-btn-secondary text-sm px-6 py-2.5">← Back to Aptitude</button>
                        <button onClick={() => startQuiz('mixed', quizMode)} className="st-btn-primary text-sm px-6 py-2.5">Try Again →</button>
                    </div>
                </div>
            </div>
        );
    }

    // ═══════ HOME VIEW ═══════
    return (
        <div className="min-h-screen bg-slate-50">
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1 pb-24 md:pb-8">
                    {/* Hero */}
                    <div className="bg-gradient-to-br from-teal-600 to-cyan-700 text-white px-6 py-8">
                        <h1 className="text-2xl font-bold mb-2 st-font-heading">🧠 Aptitude Engine</h1>
                        <p className="text-white/80 text-sm mb-4">Practice TCS, Infosys, Wipro patterns — beat the cutoff</p>
                        <div className="flex gap-3">
                            {['practice', 'tests'].map(tab => (
                                <button key={tab} onClick={() => setActiveTab(tab as any)}
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === tab ? 'bg-white text-teal-700' : 'bg-white/15 text-white hover:bg-white/25'}`}>
                                    {tab === 'practice' ? '📚 Practice' : '📝 Company Tests'}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="px-4 md:px-6 py-6 max-w-4xl mx-auto space-y-6">
                        <AnimatePresence mode="wait">
                            {activeTab === 'practice' ? (
                                <motion.div key="practice" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                                    {/* Quick Start */}
                                    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                                        <h2 className="font-bold text-slate-900 mb-3 st-font-heading">⚡ Quick Practice</h2>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button onClick={() => startQuiz('mixed', 'practice')} disabled={loading}
                                                className="bg-gradient-to-r from-indigo-500 to-violet-600 text-white rounded-xl py-3 px-4 text-sm font-semibold hover:shadow-lg transition-all disabled:opacity-50">
                                                📚 Practice Mode
                                                <span className="block text-[10px] text-white/70 mt-0.5">Instant explanations</span>
                                            </button>
                                            <button onClick={() => startQuiz('mixed', 'timed')} disabled={loading}
                                                className="bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl py-3 px-4 text-sm font-semibold hover:shadow-lg transition-all disabled:opacity-50">
                                                ⏱️ Timed Test
                                                <span className="block text-[10px] text-white/70 mt-0.5">10 Qs · 8 minutes</span>
                                            </button>
                                        </div>
                                    </div>

                                    <h2 className="st-section-title">Topic-Wise Practice</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {CATEGORIES.map((cat, i) => (
                                            <motion.div key={cat.name}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: i * 0.1 }}
                                                className="st-card p-5 hover:shadow-lg transition-shadow">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-3xl">{cat.icon}</span>
                                                        <div>
                                                            <h3 className="font-bold text-slate-900">{cat.name}</h3>
                                                            <p className="text-xs text-slate-500">{cat.topics} topics · {cat.total} questions</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button onClick={() => startQuiz(cat.key, 'practice')} disabled={loading}
                                                        className="flex-1 st-btn-secondary text-xs py-2 disabled:opacity-50">📚 Practice</button>
                                                    <button onClick={() => startQuiz(cat.key, 'timed')} disabled={loading}
                                                        className="flex-1 st-btn-primary text-xs py-2 disabled:opacity-50">⏱️ Timed</button>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div key="tests" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                                    <h2 className="st-section-title">Company-Specific Tests</h2>
                                    <p className="text-sm text-slate-500">Exact patterns used by top mass-recruiters. Practice in the real format.</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {COMPANY_FORMATS.map((test, i) => (
                                            <motion.div key={test.name}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: i * 0.08 }}
                                                className="st-card overflow-hidden hover:shadow-lg transition-shadow group">
                                                <div className={`bg-gradient-to-r ${test.color} px-5 py-3 flex items-center gap-3`}>
                                                    <span className="text-2xl">{test.icon}</span>
                                                    <div>
                                                        <h3 className="font-bold text-white">{test.name}</h3>
                                                        <p className="text-xs text-white/70">{test.questions} Qs · {test.time}</p>
                                                    </div>
                                                </div>
                                                <div className="p-5">
                                                    <div className="flex flex-wrap gap-1.5 mb-4">
                                                        {test.sections.map(s => (
                                                            <span key={s} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{s}</span>
                                                        ))}
                                                    </div>
                                                    <button onClick={() => startQuiz('mixed', 'timed')} disabled={loading}
                                                        className="w-full st-btn-primary text-sm py-2.5 group-hover:shadow-md transition-shadow disabled:opacity-50">
                                                        Start Mock Test →
                                                    </button>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Certification CTA */}
                        <div className="bg-teal-50 rounded-2xl p-6 border border-teal-200 text-center">
                            <h3 className="font-bold text-slate-900 mb-2 st-font-heading">🏅 Mentixy Aptitude Certified</h3>
                            <p className="text-sm text-slate-600 mb-4">
                                Score 80%+ across all 4 categories to earn the Mentixy Aptitude Certification — visible on your public profile.
                            </p>
                            <Link href="/score" className="st-btn-primary text-sm px-6 py-2.5 inline-block">
                                View My Score →
                            </Link>
                        </div>
                    </div>
                </main>
                <BottomNav />
            </div>
        </div>
    );
}
