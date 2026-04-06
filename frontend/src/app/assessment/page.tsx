'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { QuestionCard } from '@/components/assessment/QuestionCard';
import { ResultsReveal } from '@/components/assessment/ResultsReveal';
import { useAssessmentStore } from '@/lib/store/assessment.store';

type AssessmentPhase = 'intro' | 'questions' | 'submitting' | 'results';

export default function AssessmentPage() {
    const { isReady } = useAuthGuard();
    const [phase, setPhase] = useState<AssessmentPhase>('intro');
    const { sessionId, questions, answers, currentIndex, setSession, addAnswer, nextQuestion, setResults, results } = useAssessmentStore();
    const [error, setError] = useState('');

    const startAssessment = async () => {
        try {
            setError('');
            const data = await api.startAssessment('web');
            setSession(data.session_id, data.questions);
            setPhase('questions');
        } catch (e: any) {
            setError(e.message || 'Failed to start assessment');
        }
    };

    const handleAnswer = async (selectedOption: string, timeMs: number) => {
        if (!sessionId) return;

        const q = questions[currentIndex];
        const newAnswer = {
            question_id: q.id,
            selected_option: selectedOption,
            time_spent_ms: timeMs,
            question_order: currentIndex + 1,
        };
        addAnswer(newAnswer);

        if (currentIndex + 1 >= questions.length) {
            setPhase('submitting');
            try {
                const allAnswers = [...answers, newAnswer];
                const result = await api.submitAssessment(sessionId, allAnswers);
                setResults(result);
                setPhase('results');
            } catch (e: any) {
                setError(e.message || 'Submission failed. Please try again.');
                setPhase('submitting'); // stay on submitting screen with error, not loop back
            }
        } else {
            nextQuestion();
        }
    };

    if (!isReady) return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="w-10 h-10 border-3 border-slate-200 border-t-indigo-600 rounded-full animate-spin" />
        </div>
    );

    // Intro screen
    if (phase === 'intro') {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-md"
                >
                    <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-3xl flex items-center justify-center mx-auto mb-8">
                        <span className="text-4xl">🧬</span>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-3">
                        Ready? Let&apos;s find your<br />
                        <span className="st-gradient-text">Career DNA</span>
                    </h1>
                    <p className="text-slate-500 text-base mb-8 leading-relaxed">
                        Answer honestly. There are no right or wrong answers — only YOUR answers.
                        This takes about 5-7 minutes.
                    </p>

                    <div className="space-y-4 mb-10 text-left">
                        {[
                            { icon: '🎯', text: 'Discover your unique career archetype' },
                            { icon: '📊', text: 'Get matched to 5 ideal careers' },
                            { icon: '🗺️', text: 'Receive a personalized roadmap' },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + i * 0.15 }}
                                className="flex items-center gap-3 text-sm text-slate-600"
                            >
                                <span className="text-lg">{item.icon}</span>
                                <span>{item.text}</span>
                            </motion.div>
                        ))}
                    </div>

                    {error && (
                        <p className="text-red-500 text-sm mb-4">{error}</p>
                    )}

                    <motion.button
                        onClick={startAssessment}
                        whileTap={{ scale: 0.97 }}
                        className="w-full st-btn-primary text-lg py-4"
                    >
                        Start Assessment →
                    </motion.button>

                    <p className="text-xs text-slate-400 mt-4">
                        Your answers are private. Only you see the results.
                    </p>
                </motion.div>
            </div>
        );
    }

    // Questions
    if (phase === 'questions' && questions.length > 0) {
        const currentQ = questions[currentIndex];
        const prevQ = currentIndex > 0 ? questions[currentIndex - 1] : undefined;

        return (
            <div className="min-h-screen bg-white">
                <QuestionCard
                    question={currentQ}
                    questionNumber={currentIndex + 1}
                    onAnswer={handleAnswer}
                    previousQuestion={prevQ}
                />
            </div>
        );
    }

    // Submitting
    if (phase === 'submitting') {
        const retrySubmit = async () => {
            setError('');
            try {
                const result = await api.submitAssessment(sessionId!, answers);
                setResults(result);
                setPhase('results');
            } catch (e: any) {
                setError(e.message || 'Submission failed. Please try again.');
            }
        };

        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 flex flex-col items-center justify-center p-8">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center"
                >
                    {error ? (
                        <>
                            <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="text-4xl">⚠️</span>
                            </div>
                            <p className="text-white text-xl font-semibold mb-2">Submission Issue</p>
                            <p className="text-white/60 text-sm mb-6 max-w-sm">{error}</p>
                            <button
                                onClick={retrySubmit}
                                className="px-8 py-3 bg-white text-indigo-700 rounded-xl font-semibold hover:bg-white/90 transition-colors"
                            >
                                Retry Submission →
                            </button>
                        </>
                    ) : (
                        <>
                            <div className="w-20 h-20 border-4 border-white/20 border-t-white rounded-full animate-spin mb-8 mx-auto" />
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-white text-xl font-semibold mb-2"
                            >
                                Building your career profile...
                            </motion.p>
                            <div className="space-y-2 mt-6">
                                {[
                                    { text: '🧬 Analyzing response patterns', delay: 0.5 },
                                    { text: '📊 Mapping your 4D dimensions', delay: 1.5 },
                                    { text: '🎯 Finding career matches', delay: 2.5 },
                                    { text: '🗺️ Generating your roadmap', delay: 3.5 },
                                ].map((item) => (
                                    <motion.p key={item.text}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 0.7, x: 0 }}
                                        transition={{ delay: item.delay }}
                                        className="text-white/60 text-sm"
                                    >
                                        {item.text}
                                    </motion.p>
                                ))}
                            </div>
                        </>
                    )}
                </motion.div>
            </div>
        );
    }

    // Results
    if (phase === 'results' && results) {
        const profile = results.profile || {};
        return (
            <ResultsReveal
                archetype={profile.archetype || { code: 'AN', name: 'The Architect' }}
                dimensions={profile.dimensions || { analytical: 70, interpersonal: 60, creative: 55, systematic: 65 }}
                matches={results.matches || []}
                advice={results.advice}
                personalitySummary={results.personality_summary}
            />
        );
    }

    // Fallback
    return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <p className="text-slate-500">Loading assessment...</p>
        </div>
    );
}
