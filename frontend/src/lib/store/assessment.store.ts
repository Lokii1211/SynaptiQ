/**
 * SkillTen — Assessment Store (Zustand)
 */
import { create } from 'zustand';

interface Question {
    id: string;
    question_text: string;
    options: any;
    category: string;
    question_type: string;
}

interface Answer {
    question_id: string;
    selected_option: string;
    time_spent_ms: number;
    question_order: number;
}

interface AssessmentState {
    sessionId: string | null;
    questions: Question[];
    answers: Answer[];
    currentIndex: number;
    isComplete: boolean;
    results: any | null;

    setSession: (sessionId: string, questions: Question[]) => void;
    addAnswer: (answer: Answer) => void;
    nextQuestion: () => void;
    setResults: (results: any) => void;
    reset: () => void;
}

export const useAssessmentStore = create<AssessmentState>((set) => ({
    sessionId: null,
    questions: [],
    answers: [],
    currentIndex: 0,
    isComplete: false,
    results: null,

    setSession: (sessionId, questions) => set({ sessionId, questions, answers: [], currentIndex: 0, isComplete: false, results: null }),

    addAnswer: (answer) => set((state) => ({
        answers: [...state.answers, answer],
    })),

    nextQuestion: () => set((state) => {
        const next = state.currentIndex + 1;
        return { currentIndex: next, isComplete: next >= state.questions.length };
    }),

    setResults: (results) => set({ results, isComplete: true }),

    reset: () => set({ sessionId: null, questions: [], answers: [], currentIndex: 0, isComplete: false, results: null }),
}));
