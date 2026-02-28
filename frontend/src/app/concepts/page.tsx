'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';
import { auth } from '@/lib/api';
import Link from 'next/link';

/* ═══ Concepts Library Data ═══ */
interface Concept {
    id: string; title: string; category: string; subcategory: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    description: string; realWorldExample: string; companies: string[];
    interviewDifficulty: number; relatedConcepts: string[];
    practiceProblems: number; mastered: boolean;
}

const CATEGORIES = [
    { id: 'ds', name: 'Data Structures', icon: '🏗️', count: 12, color: 'indigo' },
    { id: 'algo', name: 'Algorithms', icon: '⚡', count: 15, color: 'violet' },
    { id: 'math', name: 'Mathematics', icon: '🔢', count: 8, color: 'amber' },
    { id: 'os', name: 'Operating Systems', icon: '🖥️', count: 15, color: 'emerald' },
    { id: 'dbms', name: 'DBMS', icon: '🗃️', count: 12, color: 'blue' },
    { id: 'cn', name: 'Computer Networks', icon: '🌐', count: 10, color: 'pink' },
    { id: 'oop', name: 'OOP Concepts', icon: '📦', count: 8, color: 'orange' },
    { id: 'sql', name: 'SQL', icon: '🔍', count: 15, color: 'teal' },
    { id: 'sd', name: 'System Design', icon: '🏛️', count: 10, color: 'purple' },
];

const CONCEPTS: Concept[] = [
    {
        id: 'array', title: 'Arrays', category: 'ds', subcategory: 'Linear',
        difficulty: 'beginner', description: 'A contiguous block of memory storing elements of the same type. The most fundamental data structure — the backbone of almost every problem you\'ll encounter.',
        realWorldExample: 'Think of a row of seats in a movie theater — each seat has a number (index), and you can go directly to seat #5 without checking seats 1-4.',
        companies: ['TCS', 'Infosys', 'Wipro', 'Amazon', 'Google'], interviewDifficulty: 3,
        relatedConcepts: ['Strings', 'Two Pointer', 'Sliding Window'], practiceProblems: 25, mastered: true,
    },
    {
        id: 'linked-list', title: 'Linked List', category: 'ds', subcategory: 'Linear',
        difficulty: 'beginner', description: 'A chain of nodes where each node contains data and a pointer to the next node. Unlike arrays, elements are not stored contiguously.',
        realWorldExample: 'Like a train — each coach (node) is connected to the next. To reach coach #5, you must walk through coaches 1-4. But adding a new coach is easy!',
        companies: ['TCS', 'Infosys', 'Amazon', 'Microsoft'], interviewDifficulty: 4,
        relatedConcepts: ['Arrays', 'Stack', 'Queue'], practiceProblems: 18, mastered: false,
    },
    {
        id: 'stack', title: 'Stack', category: 'ds', subcategory: 'Linear',
        difficulty: 'beginner', description: 'Last-In-First-Out (LIFO) data structure. Push and pop operations happen at the top only.',
        realWorldExample: 'Like a stack of plates at a restaurant buffet — you always take from the top and add to the top.',
        companies: ['Amazon', 'Facebook', 'Google', 'TCS'], interviewDifficulty: 3,
        relatedConcepts: ['Queue', 'Monotonic Stack', 'Recursion'], practiceProblems: 15, mastered: false,
    },
    {
        id: 'binary-tree', title: 'Binary Tree', category: 'ds', subcategory: 'Non-Linear',
        difficulty: 'intermediate', description: 'A hierarchical data structure where each node has at most two children (left and right). Foundation for BST, heaps, and many algorithms.',
        realWorldExample: 'Like a family tree — each person (node) has at most two children. The entire tree starts from one ancestor (root).',
        companies: ['Amazon', 'Google', 'Microsoft', 'Flipkart'], interviewDifficulty: 6,
        relatedConcepts: ['BST', 'Heap', 'DFS', 'BFS'], practiceProblems: 22, mastered: false,
    },
    {
        id: 'dp', title: 'Dynamic Programming', category: 'algo', subcategory: 'Optimization',
        difficulty: 'advanced', description: 'Breaking a complex problem into simpler overlapping subproblems and storing their results (memoization/tabulation) to avoid recomputation.',
        realWorldExample: 'Like studying for exams — if you already solved Problem X for math, and it appears in physics too, you don\'t re-derive the solution. You reuse it.',
        companies: ['Google', 'Amazon', 'Microsoft', 'Flipkart', 'Goldman Sachs'], interviewDifficulty: 9,
        relatedConcepts: ['Recursion', 'Combinatorics', 'Greedy'], practiceProblems: 35, mastered: false,
    },
    {
        id: 'sorting', title: 'Sorting Algorithms', category: 'algo', subcategory: 'Sorting',
        difficulty: 'beginner', description: 'Arranging elements in a specific order. Key algorithms: Bubble, Selection, Insertion, Merge, Quick, Heap, Counting, Radix.',
        realWorldExample: 'Arranging your playlist by song duration — different strategies (algorithms) exist, some faster than others.',
        companies: ['TCS', 'Infosys', 'Wipro', 'HCL', 'Amazon'], interviewDifficulty: 4,
        relatedConcepts: ['Arrays', 'Divide & Conquer', 'Binary Search'], practiceProblems: 12, mastered: true,
    },
    {
        id: 'normalization', title: 'Database Normalization', category: 'dbms', subcategory: 'Design',
        difficulty: 'intermediate', description: 'Organizing database tables to reduce redundancy and improve data integrity. Forms: 1NF, 2NF, 3NF, BCNF.',
        realWorldExample: 'Instead of storing a student\'s college name in every row of the attendance table, store college info separately and link via ID. Less repetition, less errors.',
        companies: ['TCS', 'Infosys', 'Wipro', 'Oracle', 'Amazon'], interviewDifficulty: 5,
        relatedConcepts: ['SQL Joins', 'ER Diagrams', 'Transactions'], practiceProblems: 10, mastered: false,
    },
    {
        id: 'process-thread', title: 'Processes vs Threads', category: 'os', subcategory: 'Process Management',
        difficulty: 'beginner', description: 'A process is an independent program execution. A thread is a lightweight unit within a process sharing the same memory space.',
        realWorldExample: 'Opening Chrome = a process. Each tab inside Chrome = a thread. If one tab crashes (thread), Chrome (process) may still run.',
        companies: ['TCS', 'Infosys', 'Amazon', 'Microsoft', 'Flipkart'], interviewDifficulty: 5,
        relatedConcepts: ['Concurrency', 'Deadlock', 'Scheduling'], practiceProblems: 8, mastered: false,
    },
];

const PREP_SHEETS = [
    { name: 'Service Company Ready', icon: '🏢', problems: 100, weeks: 3, difficulty: 'Easy-Medium', companies: 'TCS · Infosys · Wipro · HCL · Cognizant', progress: 34 },
    { name: 'Product Company Foundation', icon: '🚀', problems: 200, weeks: 8, difficulty: 'Medium-Hard', companies: 'Flipkart · Swiggy · Paytm · Razorpay', progress: 12 },
    { name: 'Data Science Path', icon: '📊', problems: 120, weeks: 6, difficulty: 'Mixed', companies: 'Amazon · Google · Microsoft · TCS Digital', progress: 8 },
    { name: 'Quick Prep (2 Weeks)', icon: '⚡', problems: 50, weeks: 2, difficulty: 'Easy-Medium', companies: 'Emergency placement drive preparation', progress: 0 },
];

export default function ConceptsPage() {
    const [activeCategory, setActiveCategory] = useState<string>('all');
    const [selectedConcept, setSelectedConcept] = useState<Concept | null>(null);
    const [viewTab, setViewTab] = useState<'concepts' | 'sheets' | 'micro'>('concepts');
    const [quizMode, setQuizMode] = useState(false);

    useEffect(() => { if (!auth.isLoggedIn()) window.location.href = '/login'; }, []);

    const filteredConcepts = activeCategory === 'all' ? CONCEPTS : CONCEPTS.filter(c => c.category === activeCategory);

    return (
        <div className="min-h-screen bg-slate-50">
            <TopBar />
            <main className="max-w-5xl mx-auto px-4 md:px-6 py-6 pb-24 md:pb-8">
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
                    <h1 className="text-2xl font-bold text-slate-900 st-font-heading">📖 Knowledge Hub</h1>
                    <p className="text-sm text-slate-500 mt-1">CS concepts explained simply + practice + test yourself</p>
                </motion.div>

                {/* View Tabs */}
                <div className="flex gap-1 mb-5 bg-white rounded-xl p-1 border border-slate-200">
                    {([
                        { id: 'concepts', label: '📖 Concepts Library' },
                        { id: 'sheets', label: '📋 Placement Sheets' },
                        { id: 'micro', label: '⚡ Micro-Learning' },
                    ] as const).map(t => (
                        <button key={t.id} onClick={() => { setViewTab(t.id); setSelectedConcept(null); }}
                            className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${viewTab === t.id ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-900'}`}>
                            {t.label}
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {/* ═══ Concepts Library ═══ */}
                    {viewTab === 'concepts' && !selectedConcept && (
                        <motion.div key="concepts" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                            {/* Category Grid */}
                            <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mb-5">
                                <button onClick={() => setActiveCategory('all')}
                                    className={`p-3 rounded-xl text-xs font-medium transition-all ${activeCategory === 'all' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-200'}`}>
                                    📚 All
                                </button>
                                {CATEGORIES.map(cat => (
                                    <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                                        className={`p-3 rounded-xl text-xs font-medium transition-all ${activeCategory === cat.id ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-200'}`}>
                                        {cat.icon} {cat.name}
                                    </button>
                                ))}
                            </div>

                            {/* Knowledge Map Progress */}
                            <div className="st-card p-4 mb-5">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-xs font-bold text-slate-900">🗺️ Knowledge Map</p>
                                    <p className="text-[10px] text-slate-400">{CONCEPTS.filter(c => c.mastered).length}/{CONCEPTS.length} mastered</p>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2.5">
                                    <div className="bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full h-2.5 transition-all" style={{ width: `${(CONCEPTS.filter(c => c.mastered).length / CONCEPTS.length) * 100}%` }} />
                                </div>
                            </div>

                            {/* Concept Cards */}
                            <div className="grid md:grid-cols-2 gap-3">
                                {filteredConcepts.map((concept, i) => (
                                    <motion.div key={concept.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.03 }}
                                        onClick={() => setSelectedConcept(concept)}
                                        className={`st-card p-4 cursor-pointer hover:shadow-lg transition-all ${concept.mastered ? 'border-l-4 border-emerald-400' : ''}`}>
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <h3 className="text-sm font-bold text-slate-900">{concept.title}</h3>
                                                <p className="text-[10px] text-slate-400">{CATEGORIES.find(c => c.id === concept.category)?.name} · {concept.subcategory}</p>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-bold ${concept.difficulty === 'beginner' ? 'bg-emerald-50 text-emerald-600' :
                                                        concept.difficulty === 'intermediate' ? 'bg-amber-50 text-amber-600' :
                                                            'bg-red-50 text-red-600'
                                                    }`}>{concept.difficulty.toUpperCase()}</span>
                                                {concept.mastered && <span className="text-[9px]">✅</span>}
                                            </div>
                                        </div>
                                        <p className="text-xs text-slate-500 line-clamp-2 mb-2">{concept.description}</p>
                                        <div className="flex items-center gap-3 text-[9px] text-slate-400">
                                            <span>🏢 {concept.companies.slice(0, 3).join(', ')}</span>
                                            <span>📝 {concept.practiceProblems} problems</span>
                                            <span>🎯 Interview: {'⭐'.repeat(Math.min(concept.interviewDifficulty, 5))}</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* ═══ Concept Detail View ═══ */}
                    {viewTab === 'concepts' && selectedConcept && (
                        <motion.div key="detail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                            <button onClick={() => setSelectedConcept(null)} className="text-sm text-indigo-600 font-medium hover:text-indigo-800">← Back to concepts</button>

                            <div className="st-card p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-900">{selectedConcept.title}</h2>
                                        <p className="text-xs text-slate-400 mt-1">{CATEGORIES.find(c => c.id === selectedConcept.category)?.name} · {selectedConcept.subcategory}</p>
                                    </div>
                                    <span className={`text-[9px] px-2 py-1 rounded-full font-bold ${selectedConcept.difficulty === 'beginner' ? 'bg-emerald-50 text-emerald-600' :
                                            selectedConcept.difficulty === 'intermediate' ? 'bg-amber-50 text-amber-600' :
                                                'bg-red-50 text-red-600'
                                        }`}>{selectedConcept.difficulty.toUpperCase()}</span>
                                </div>

                                {/* Explanation */}
                                <div className="mb-5">
                                    <h3 className="text-xs font-bold text-slate-700 mb-2">📖 What is it?</h3>
                                    <p className="text-sm text-slate-600 leading-relaxed">{selectedConcept.description}</p>
                                </div>

                                {/* Real World Example */}
                                <div className="bg-indigo-50 rounded-xl p-4 mb-5">
                                    <h3 className="text-xs font-bold text-indigo-700 mb-2">🌍 Real-World Example</h3>
                                    <p className="text-sm text-indigo-600">{selectedConcept.realWorldExample}</p>
                                </div>

                                {/* Code Example */}
                                <div className="mb-5">
                                    <h3 className="text-xs font-bold text-slate-700 mb-2">💻 Code Example (Python)</h3>
                                    <div className="bg-slate-900 rounded-xl p-4 text-sm font-mono text-green-400 overflow-x-auto">
                                        <pre>{selectedConcept.id === 'array'
                                            ? `# Arrays in Python\narr = [10, 20, 30, 40, 50]\n\n# Access by index: O(1)\nprint(arr[2])  # Output: 30\n\n# Insert at end: O(1) amortized\narr.append(60)\n\n# Search: O(n)\nif 30 in arr:\n    print("Found!")`
                                            : selectedConcept.id === 'dp'
                                                ? `# Dynamic Programming — Fibonacci\n# Without DP: O(2^n) — terrible!\n# With DP: O(n) — fast!\n\ndef fib(n):\n    dp = [0] * (n + 1)\n    dp[1] = 1\n    for i in range(2, n + 1):\n        dp[i] = dp[i-1] + dp[i-2]\n    return dp[n]\n\nprint(fib(10))  # Output: 55`
                                                : `# ${selectedConcept.title} Example\n# Implementation varies by concept\n# Visit practice section for hands-on\nprint("Learn by doing!")`
                                        }</pre>
                                    </div>
                                </div>

                                {/* Companies that ask */}
                                <div className="mb-5">
                                    <h3 className="text-xs font-bold text-slate-700 mb-2">🏢 Companies That Ask About This</h3>
                                    <div className="flex flex-wrap gap-1.5">
                                        {selectedConcept.companies.map(c => (
                                            <span key={c} className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">{c}</span>
                                        ))}
                                    </div>
                                </div>

                                {/* Related Concepts */}
                                <div className="mb-5">
                                    <h3 className="text-xs font-bold text-slate-700 mb-2">🔗 Related Concepts</h3>
                                    <div className="flex flex-wrap gap-1.5">
                                        {selectedConcept.relatedConcepts.map(r => (
                                            <span key={r} className="text-[10px] bg-violet-50 text-violet-600 px-2 py-0.5 rounded-full">{r}</span>
                                        ))}
                                    </div>
                                </div>

                                {/* CTAs */}
                                <div className="grid grid-cols-2 gap-3">
                                    <Link href="/problems" className="py-3 bg-indigo-600 text-white text-sm font-bold rounded-xl text-center hover:bg-indigo-700">
                                        📝 Practice ({selectedConcept.practiceProblems} problems)
                                    </Link>
                                    <button onClick={() => setQuizMode(true)} className="py-3 bg-violet-100 text-violet-700 text-sm font-bold rounded-xl hover:bg-violet-200">
                                        🧪 Test Yourself (5 Q)
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* ═══ Placement Sheets ═══ */}
                    {viewTab === 'sheets' && (
                        <motion.div key="sheets" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
                            {PREP_SHEETS.map((sheet, i) => (
                                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="st-card p-5 hover:shadow-lg transition-all">
                                    <div className="flex items-start gap-4">
                                        <span className="text-3xl">{sheet.icon}</span>
                                        <div className="flex-1">
                                            <h3 className="text-sm font-bold text-slate-900 mb-1">{sheet.name}</h3>
                                            <p className="text-[10px] text-slate-400 mb-2">{sheet.companies}</p>
                                            <div className="flex items-center gap-3 text-[10px] text-slate-500 mb-3">
                                                <span>📝 {sheet.problems} problems</span>
                                                <span>⏱️ {sheet.weeks} weeks</span>
                                                <span>📊 {sheet.difficulty}</span>
                                            </div>
                                            {/* Progress */}
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 bg-slate-100 rounded-full h-2">
                                                    <div className="bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full h-2 transition-all"
                                                        style={{ width: `${(sheet.progress / sheet.problems) * 100}%` }} />
                                                </div>
                                                <span className="text-[10px] font-bold text-slate-600">{sheet.progress}/{sheet.problems}</span>
                                            </div>
                                            {sheet.progress > 0 && (
                                                <p className="text-[9px] text-slate-400 mt-1">At this pace, you&apos;ll finish in {Math.ceil((sheet.problems - sheet.progress) / 3)} days</p>
                                            )}
                                        </div>
                                        <Link href="/problems" className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 flex-shrink-0">
                                            {sheet.progress > 0 ? 'Continue →' : 'Start →'}
                                        </Link>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                    {/* ═══ Micro-Learning ═══ */}
                    {viewTab === 'micro' && (
                        <motion.div key="micro" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-100 mb-5">
                                <p className="text-xs font-bold text-emerald-800">⚡ Learn in 10 Minutes</p>
                                <p className="text-[11px] text-emerald-600 mt-1">One concept + one example + one practice question. Delivered daily. Opt in for notification reminders.</p>
                            </div>

                            <h3 className="text-sm font-bold text-slate-900 mb-3">Today&apos;s Capsule</h3>
                            <div className="st-card p-5 border-l-4 border-emerald-400 mb-5">
                                <span className="text-[9px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">TODAY</span>
                                <h4 className="text-sm font-bold text-slate-900 mt-2 mb-1">Binary Search — O(log n) vs O(n)</h4>
                                <p className="text-xs text-slate-500 mb-3">Binary search eliminates half the search space every step. Instead of checking 1,000 elements, you check ~10.</p>
                                <div className="bg-slate-900 rounded-lg p-3 text-xs font-mono text-green-400 mb-3">
                                    <pre>{`def binary_search(arr, target):\n    lo, hi = 0, len(arr) - 1\n    while lo <= hi:\n        mid = (lo + hi) // 2\n        if arr[mid] == target: return mid\n        elif arr[mid] < target: lo = mid + 1\n        else: hi = mid - 1\n    return -1`}</pre>
                                </div>
                                <p className="text-xs text-slate-700 font-medium mb-2">🧪 Quick Question:</p>
                                <p className="text-xs text-slate-600 mb-3">What is the time complexity of binary search on a sorted array of 1 million elements?</p>
                                <div className="grid grid-cols-2 gap-2">
                                    {['O(n)', 'O(log n)', 'O(n²)', 'O(1)'].map((opt, i) => (
                                        <button key={i} className="py-2 text-xs font-medium rounded-lg border border-slate-200 hover:bg-indigo-50 hover:border-indigo-200 transition-all">
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <h3 className="text-sm font-bold text-slate-900 mb-3">Recent Capsules</h3>
                            <div className="space-y-2">
                                {['HashMap — O(1) Lookup Magic', 'Recursion — Think Backwards', 'Two Pointer — Meet in the Middle', 'Stack — LIFO Made Simple', 'SQL JOINs — Connect the Tables'].map((title, i) => (
                                    <div key={i} className="st-card p-3 flex items-center justify-between">
                                        <div>
                                            <p className="text-xs font-medium text-slate-900">{title}</p>
                                            <p className="text-[9px] text-slate-400">{i + 1} day{i > 0 ? 's' : ''} ago · 10 min read</p>
                                        </div>
                                        <span className="text-[9px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-bold">Completed ✓</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
            <BottomNav />
        </div>
    );
}
