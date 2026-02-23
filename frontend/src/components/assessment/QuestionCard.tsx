'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ANSWER_COLORS = [
    { bg: 'bg-indigo-50', border: 'border-indigo-200', hover: 'hover:bg-indigo-100', selected: 'bg-indigo-600 border-indigo-600 text-white' },
    { bg: 'bg-violet-50', border: 'border-violet-200', hover: 'hover:bg-violet-100', selected: 'bg-violet-600 border-violet-600 text-white' },
    { bg: 'bg-teal-50', border: 'border-teal-200', hover: 'hover:bg-teal-100', selected: 'bg-teal-600 border-teal-600 text-white' },
    { bg: 'bg-cyan-50', border: 'border-cyan-200', hover: 'hover:bg-cyan-100', selected: 'bg-cyan-600 border-cyan-600 text-white' },
];

interface QuestionCardProps {
    question: { id: string; question_text: string; options: any };
    questionNumber: number;
    onAnswer: (optionId: string, timeMs: number) => void;
    previousQuestion?: { question_text: string };
}

export function QuestionCard({ question, questionNumber, onAnswer, previousQuestion }: QuestionCardProps) {
    const [selected, setSelected] = useState<string | null>(null);
    const [startTime] = useState(Date.now());
    const [showHesitation, setShowHesitation] = useState(false);
    const timerRef = useRef<NodeJS.Timeout>();

    useEffect(() => {
        setSelected(null);
        setShowHesitation(false);
        timerRef.current = setTimeout(() => {
            setShowHesitation(true);
        }, 8000);
        return () => clearTimeout(timerRef.current);
    }, [question.id]);

    const handleSelect = (optionId: string) => {
        if (selected) return;
        setSelected(optionId);
        clearTimeout(timerRef.current);
        setShowHesitation(false);
        setTimeout(() => {
            onAnswer(optionId, Date.now() - startTime);
        }, 400);
    };

    // Parse options — handle both array and object formats
    const options = Array.isArray(question.options)
        ? question.options
        : Object.entries(question.options || {}).map(([key, val]) => ({
            id: key,
            text: typeof val === 'string' ? val : String(val),
        }));

    return (
        <div className="min-h-[70vh] flex flex-col px-4 py-6 max-w-lg mx-auto">
            {/* Previous question context */}
            {previousQuestion && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 0.4, y: 0 }}
                    className="mb-6 p-3 bg-slate-50 rounded-lg border border-slate-100"
                >
                    <p className="text-xs text-slate-400 mb-1">Previous</p>
                    <p className="text-sm text-slate-500 line-clamp-2">{previousQuestion.question_text}</p>
                </motion.div>
            )}

            {/* Question number */}
            <div className="flex items-center justify-between mb-6">
                <span className="text-xs text-slate-400 font-medium">Question {questionNumber}</span>
                {questionNumber > 3 && (
                    <div className="flex gap-1">
                        {Array.from({ length: Math.min(questionNumber, 20) }).map((_, i) => (
                            <div key={i} className={`w-2 h-2 rounded-full transition-colors duration-300 ${i < questionNumber - 1 ? 'bg-indigo-500' : 'bg-slate-200'}`} />
                        ))}
                    </div>
                )}
            </div>

            {/* Question */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={question.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex-1"
                >
                    <h2 className="text-xl font-semibold text-slate-900 mb-8 leading-relaxed">
                        {question.question_text}
                    </h2>

                    {/* Hesitation */}
                    <AnimatePresence>
                        {showHesitation && (
                            <motion.p
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="text-sm text-slate-500 italic mb-4 text-center"
                            >
                                Take your time. Go with your gut feeling. ✨
                            </motion.p>
                        )}
                    </AnimatePresence>

                    {/* Answer cards */}
                    <div className="space-y-3">
                        {options.map((option: any, index: number) => {
                            const colors = ANSWER_COLORS[index % ANSWER_COLORS.length];
                            const optionId = option.id || option.key || String.fromCharCode(65 + index);
                            const optionText = option.text || option.label || option;
                            const isSelected = selected === optionId;
                            return (
                                <motion.button
                                    key={optionId}
                                    onClick={() => handleSelect(optionId)}
                                    whileTap={{ scale: 0.98 }}
                                    className={`
                    w-full text-left p-4 rounded-xl border-2 transition-all duration-200
                    min-h-[56px] font-medium text-base
                    ${isSelected ? colors.selected : `${colors.bg} ${colors.border} ${colors.hover} text-slate-800`}
                    ${selected && !isSelected ? 'opacity-40' : ''}
                  `}
                                    disabled={!!selected}
                                >
                                    <span className="block">{optionText}</span>
                                </motion.button>
                            );
                        })}
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
