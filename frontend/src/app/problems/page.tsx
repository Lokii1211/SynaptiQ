'use client';
import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { auth } from '@/lib/api';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';
import Link from 'next/link';

interface Problem {
    id: number;
    title: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    topic: string;
    companies: string[];
    acceptance: number;
    solved: boolean;
    starred: boolean;
    frequency: 'High' | 'Medium' | 'Low';
}

const TOPICS = [
    'All', 'Arrays', 'Strings', 'Linked List', 'Stack & Queue', 'Trees', 'Graphs',
    'Dynamic Programming', 'Greedy', 'Binary Search', 'Hashing', 'Sorting',
    'Recursion', 'Backtracking', 'Bit Manipulation', 'Two Pointers', 'Sliding Window',
    'Heap', 'Trie', 'Math',
];

const COMPANIES_FILTER = ['All', 'Amazon', 'Google', 'Microsoft', 'TCS', 'Flipkart', 'Zoho', 'Infosys'];

const DEMO_PROBLEMS: Problem[] = [
    { id: 1, title: 'Two Sum', difficulty: 'Easy', topic: 'Arrays', companies: ['Amazon', 'Google', 'Microsoft'], acceptance: 49.2, solved: true, starred: true, frequency: 'High' },
    { id: 2, title: 'Reverse Linked List', difficulty: 'Easy', topic: 'Linked List', companies: ['Amazon', 'Microsoft'], acceptance: 72.5, solved: true, starred: false, frequency: 'High' },
    { id: 3, title: 'Valid Parentheses', difficulty: 'Easy', topic: 'Stack & Queue', companies: ['Amazon', 'Google', 'Flipkart'], acceptance: 40.8, solved: true, starred: false, frequency: 'High' },
    { id: 4, title: 'Maximum Subarray (Kadane\'s)', difficulty: 'Medium', topic: 'Arrays', companies: ['Amazon', 'Microsoft', 'TCS'], acceptance: 50.1, solved: true, starred: true, frequency: 'High' },
    { id: 5, title: 'Merge Two Sorted Lists', difficulty: 'Easy', topic: 'Linked List', companies: ['Amazon', 'Microsoft'], acceptance: 62.3, solved: false, starred: false, frequency: 'Medium' },
    { id: 6, title: 'Binary Tree Level Order Traversal', difficulty: 'Medium', topic: 'Trees', companies: ['Amazon', 'Flipkart', 'Microsoft'], acceptance: 63.7, solved: false, starred: true, frequency: 'High' },
    { id: 7, title: 'Longest Common Subsequence', difficulty: 'Medium', topic: 'Dynamic Programming', companies: ['Amazon', 'Google'], acceptance: 59.0, solved: false, starred: false, frequency: 'High' },
    { id: 8, title: 'Course Schedule (Topological Sort)', difficulty: 'Medium', topic: 'Graphs', companies: ['Google', 'Amazon', 'Microsoft'], acceptance: 45.8, solved: false, starred: false, frequency: 'Medium' },
    { id: 9, title: 'Trapping Rain Water', difficulty: 'Hard', topic: 'Two Pointers', companies: ['Amazon', 'Google', 'Microsoft'], acceptance: 58.7, solved: false, starred: true, frequency: 'High' },
    { id: 10, title: 'Merge Intervals', difficulty: 'Medium', topic: 'Sorting', companies: ['Amazon', 'Google', 'Flipkart'], acceptance: 46.1, solved: true, starred: false, frequency: 'High' },
    { id: 11, title: 'Climbing Stairs', difficulty: 'Easy', topic: 'Dynamic Programming', companies: ['Amazon', 'TCS', 'Infosys'], acceptance: 51.4, solved: true, starred: false, frequency: 'High' },
    { id: 12, title: 'Best Time to Buy and Sell Stock', difficulty: 'Easy', topic: 'Arrays', companies: ['Amazon', 'Flipkart', 'TCS'], acceptance: 54.3, solved: true, starred: false, frequency: 'High' },
    { id: 13, title: 'LRU Cache', difficulty: 'Medium', topic: 'Hashing', companies: ['Amazon', 'Google', 'Microsoft', 'Flipkart'], acceptance: 40.5, solved: false, starred: true, frequency: 'High' },
    { id: 14, title: 'Word Search', difficulty: 'Medium', topic: 'Backtracking', companies: ['Amazon', 'Microsoft'], acceptance: 40.8, solved: false, starred: false, frequency: 'Medium' },
    { id: 15, title: 'Median of Two Sorted Arrays', difficulty: 'Hard', topic: 'Binary Search', companies: ['Amazon', 'Google', 'Microsoft'], acceptance: 36.3, solved: false, starred: false, frequency: 'Medium' },
    { id: 16, title: 'Detect Cycle in Linked List', difficulty: 'Easy', topic: 'Linked List', companies: ['Amazon', 'TCS', 'Zoho'], acceptance: 46.7, solved: true, starred: false, frequency: 'High' },
    { id: 17, title: 'Longest Substring Without Repeating', difficulty: 'Medium', topic: 'Sliding Window', companies: ['Amazon', 'Google', 'Flipkart'], acceptance: 33.8, solved: false, starred: true, frequency: 'High' },
    { id: 18, title: 'N-Queens', difficulty: 'Hard', topic: 'Backtracking', companies: ['Google', 'Amazon'], acceptance: 62.4, solved: false, starred: false, frequency: 'Low' },
    { id: 19, title: 'Implement Trie', difficulty: 'Medium', topic: 'Trie', companies: ['Google', 'Amazon', 'Microsoft'], acceptance: 61.2, solved: false, starred: false, frequency: 'Medium' },
    { id: 20, title: 'Kth Largest Element', difficulty: 'Medium', topic: 'Heap', companies: ['Amazon', 'Google', 'Flipkart'], acceptance: 66.8, solved: false, starred: false, frequency: 'High' },
    { id: 21, title: 'Number of Islands', difficulty: 'Medium', topic: 'Graphs', companies: ['Amazon', 'Google', 'Microsoft'], acceptance: 56.4, solved: true, starred: false, frequency: 'High' },
    { id: 22, title: 'Rotate Array', difficulty: 'Medium', topic: 'Arrays', companies: ['Amazon', 'Microsoft', 'TCS'], acceptance: 39.2, solved: false, starred: false, frequency: 'Medium' },
    { id: 23, title: 'Coin Change', difficulty: 'Medium', topic: 'Dynamic Programming', companies: ['Amazon', 'Google'], acceptance: 42.1, solved: false, starred: false, frequency: 'High' },
    { id: 24, title: 'Serialize and Deserialize Binary Tree', difficulty: 'Hard', topic: 'Trees', companies: ['Amazon', 'Google', 'Microsoft'], acceptance: 55.3, solved: false, starred: false, frequency: 'Medium' },
    { id: 25, title: 'Palindrome Partitioning', difficulty: 'Medium', topic: 'Backtracking', companies: ['Google', 'Amazon'], acceptance: 62.0, solved: false, starred: false, frequency: 'Low' },
    { id: 26, title: 'Subsets', difficulty: 'Medium', topic: 'Recursion', companies: ['Amazon', 'Google', 'Microsoft'], acceptance: 74.1, solved: true, starred: false, frequency: 'High' },
    { id: 27, title: 'Count Bits', difficulty: 'Easy', topic: 'Bit Manipulation', companies: ['Amazon', 'Microsoft'], acceptance: 75.2, solved: false, starred: false, frequency: 'Medium' },
    { id: 28, title: 'Container With Most Water', difficulty: 'Medium', topic: 'Two Pointers', companies: ['Amazon', 'Google'], acceptance: 54.3, solved: false, starred: false, frequency: 'High' },
    { id: 29, title: 'Product of Array Except Self', difficulty: 'Medium', topic: 'Arrays', companies: ['Amazon', 'Google', 'Flipkart'], acceptance: 65.1, solved: false, starred: true, frequency: 'High' },
    { id: 30, title: 'Word Ladder', difficulty: 'Hard', topic: 'Graphs', companies: ['Amazon', 'Google'], acceptance: 37.0, solved: false, starred: false, frequency: 'Medium' },
    { id: 31, title: 'Minimum Window Substring', difficulty: 'Hard', topic: 'Sliding Window', companies: ['Amazon', 'Google', 'Microsoft'], acceptance: 40.8, solved: false, starred: false, frequency: 'High' },
    { id: 32, title: 'Search in Rotated Sorted Array', difficulty: 'Medium', topic: 'Binary Search', companies: ['Amazon', 'Google', 'Microsoft'], acceptance: 39.3, solved: false, starred: false, frequency: 'High' },
    { id: 33, title: 'Maximum Product Subarray', difficulty: 'Medium', topic: 'Dynamic Programming', companies: ['Amazon', 'Microsoft'], acceptance: 34.7, solved: false, starred: false, frequency: 'Medium' },
    { id: 34, title: 'Next Permutation', difficulty: 'Medium', topic: 'Arrays', companies: ['Google', 'Amazon', 'Flipkart'], acceptance: 37.6, solved: false, starred: false, frequency: 'Medium' },
    { id: 35, title: 'GCD of Two Numbers', difficulty: 'Easy', topic: 'Math', companies: ['TCS', 'Infosys', 'Zoho'], acceptance: 78.3, solved: true, starred: false, frequency: 'High' },
    { id: 36, title: 'Matrix Chain Multiplication', difficulty: 'Hard', topic: 'Dynamic Programming', companies: ['Amazon', 'Google'], acceptance: 45.6, solved: false, starred: false, frequency: 'Medium' },
    { id: 37, title: 'Dijkstra\'s Shortest Path', difficulty: 'Medium', topic: 'Graphs', companies: ['Amazon', 'Google', 'Microsoft'], acceptance: 55.1, solved: false, starred: false, frequency: 'High' },
    { id: 38, title: 'Sort Colors (Dutch Flag)', difficulty: 'Medium', topic: 'Sorting', companies: ['Amazon', 'Microsoft', 'TCS'], acceptance: 58.4, solved: true, starred: false, frequency: 'High' },
    { id: 39, title: 'Binary Tree Maximum Path Sum', difficulty: 'Hard', topic: 'Trees', companies: ['Google', 'Amazon', 'Microsoft'], acceptance: 39.0, solved: false, starred: false, frequency: 'Medium' },
    { id: 40, title: 'Group Anagrams', difficulty: 'Medium', topic: 'Hashing', companies: ['Amazon', 'Google', 'Flipkart'], acceptance: 66.2, solved: false, starred: false, frequency: 'High' },
];

export default function ProblemBankPage() {
    const [problems, setProblems] = useState<Problem[]>(DEMO_PROBLEMS);
    const [topicFilter, setTopicFilter] = useState('All');
    const [diffFilter, setDiffFilter] = useState('All');
    const [companyFilter, setCompanyFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState<'All' | 'Solved' | 'Unsolved' | 'Starred'>('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<'id' | 'difficulty' | 'acceptance'>('id');

    useEffect(() => {
        if (!auth.isLoggedIn()) { window.location.href = '/login'; return; }
    }, []);

    const filtered = useMemo(() => {
        let result = problems.filter(p => {
            if (topicFilter !== 'All' && p.topic !== topicFilter) return false;
            if (diffFilter !== 'All' && p.difficulty !== diffFilter) return false;
            if (companyFilter !== 'All' && !p.companies.includes(companyFilter)) return false;
            if (statusFilter === 'Solved' && !p.solved) return false;
            if (statusFilter === 'Unsolved' && p.solved) return false;
            if (statusFilter === 'Starred' && !p.starred) return false;
            if (searchQuery && !p.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
            return true;
        });
        if (sortBy === 'difficulty') {
            const order = { Easy: 0, Medium: 1, Hard: 2 };
            result.sort((a, b) => order[a.difficulty] - order[b.difficulty]);
        } else if (sortBy === 'acceptance') {
            result.sort((a, b) => b.acceptance - a.acceptance);
        }
        return result;
    }, [problems, topicFilter, diffFilter, companyFilter, statusFilter, searchQuery, sortBy]);

    const toggleStar = (id: number) => {
        setProblems(prev => prev.map(p => p.id === id ? { ...p, starred: !p.starred } : p));
    };

    const solvedCount = problems.filter(p => p.solved).length;
    const easyCount = problems.filter(p => p.difficulty === 'Easy').length;
    const medCount = problems.filter(p => p.difficulty === 'Medium').length;
    const hardCount = problems.filter(p => p.difficulty === 'Hard').length;
    const easySolved = problems.filter(p => p.difficulty === 'Easy' && p.solved).length;
    const medSolved = problems.filter(p => p.difficulty === 'Medium' && p.solved).length;
    const hardSolved = problems.filter(p => p.difficulty === 'Hard' && p.solved).length;

    const diffColor = (d: string) => d === 'Easy' ? 'text-emerald-600 bg-emerald-50' : d === 'Medium' ? 'text-amber-600 bg-amber-50' : 'text-rose-600 bg-rose-50';

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1 pb-24 md:pb-8">
                    {/* Hero */}
                    <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 text-white px-6 py-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
                        <div className="max-w-5xl mx-auto relative z-10">
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                                <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full mb-3 inline-block">💻 PROBLEM BANK</span>
                                <h1 className="text-2xl font-bold mb-2 st-font-heading">DSA Problem Bank</h1>
                                <p className="text-white/60 text-sm mb-4">Curated problems asked in top Indian & global companies — with difficulty tags, company frequency, and topic mapping</p>

                                {/* Progress Stats */}
                                <div className="flex flex-wrap gap-3">
                                    <div className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2 text-center">
                                        <p className="text-xl font-bold">{solvedCount}/{problems.length}</p>
                                        <p className="text-[10px] text-white/60 uppercase font-semibold">Solved</p>
                                    </div>
                                    <div className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2 text-center">
                                        <p className="text-xl font-bold text-emerald-300">{easySolved}/{easyCount}</p>
                                        <p className="text-[10px] text-white/60 uppercase font-semibold">Easy</p>
                                    </div>
                                    <div className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2 text-center">
                                        <p className="text-xl font-bold text-amber-300">{medSolved}/{medCount}</p>
                                        <p className="text-[10px] text-white/60 uppercase font-semibold">Medium</p>
                                    </div>
                                    <div className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2 text-center">
                                        <p className="text-xl font-bold text-rose-300">{hardSolved}/{hardCount}</p>
                                        <p className="text-[10px] text-white/60 uppercase font-semibold">Hard</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    <div className="px-4 md:px-6 py-6 max-w-5xl mx-auto">
                        {/* Filters Row */}
                        <div className="flex flex-col md:flex-row gap-3 mb-4">
                            <div className="relative flex-1">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
                                <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                                    placeholder="Search problems..." className="st-input pl-10 w-full" />
                            </div>
                            <select value={sortBy} onChange={e => setSortBy(e.target.value as any)}
                                className="st-input text-xs w-auto">
                                <option value="id">Sort: Default</option>
                                <option value="difficulty">Sort: Difficulty</option>
                                <option value="acceptance">Sort: Acceptance %</option>
                            </select>
                        </div>

                        {/* Topic pills */}
                        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-3 mb-2">
                            {TOPICS.map(t => (
                                <button key={t} onClick={() => setTopicFilter(t)}
                                    className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${topicFilter === t ? 'bg-teal-600 text-white shadow-md' : 'bg-white text-slate-500 border border-slate-200 hover:border-teal-300'
                                        }`}>{t}</button>
                            ))}
                        </div>

                        {/* Row 2 filters */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            {['All', 'Easy', 'Medium', 'Hard'].map(d => (
                                <button key={d} onClick={() => setDiffFilter(d)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${diffFilter === d ? 'bg-slate-800 text-white' : 'bg-white text-slate-500 border border-slate-200'
                                        }`}>{d}</button>
                            ))}
                            <span className="text-slate-300 self-center">|</span>
                            {(['All', 'Solved', 'Unsolved', 'Starred'] as const).map(s => (
                                <button key={s} onClick={() => setStatusFilter(s)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${statusFilter === s ? 'bg-slate-800 text-white' : 'bg-white text-slate-500 border border-slate-200'
                                        }`}>{s === 'Starred' ? '⭐ Starred' : s}</button>
                            ))}
                            <span className="text-slate-300 self-center">|</span>
                            <select value={companyFilter} onChange={e => setCompanyFilter(e.target.value)}
                                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white text-slate-500 border border-slate-200">
                                {COMPANIES_FILTER.map(c => <option key={c} value={c}>{c === 'All' ? '🏢 Company' : c}</option>)}
                            </select>
                        </div>

                        {/* Results count */}
                        <p className="text-xs text-slate-400 mb-3">{filtered.length} problem{filtered.length !== 1 && 's'} found</p>

                        {/* Problem Table */}
                        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                            {/* Header */}
                            <div className="hidden md:grid grid-cols-12 gap-2 px-4 py-3 bg-slate-50 border-b border-slate-100 text-[10px] text-slate-400 uppercase font-bold">
                                <div className="col-span-1 text-center">#</div>
                                <div className="col-span-5">Title</div>
                                <div className="col-span-2">Topic</div>
                                <div className="col-span-1 text-center">Diff</div>
                                <div className="col-span-1 text-center">Accept</div>
                                <div className="col-span-1 text-center">Freq</div>
                                <div className="col-span-1 text-center">⭐</div>
                            </div>

                            {/* Rows */}
                            {filtered.length === 0 ? (
                                <div className="text-center py-12">
                                    <span className="text-4xl block mb-3">🔍</span>
                                    <p className="text-sm text-slate-500">No problems match your filters</p>
                                </div>
                            ) : filtered.map((p, i) => (
                                <motion.div key={p.id}
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: Math.min(i * 0.02, 0.5) }}
                                    className="grid grid-cols-12 gap-2 px-4 py-3 border-b border-slate-50 hover:bg-slate-50/50 items-center transition-colors"
                                >
                                    <div className="col-span-1 text-center">
                                        {p.solved ? (
                                            <span className="text-emerald-500 text-sm">✓</span>
                                        ) : (
                                            <span className="text-xs text-slate-300">{p.id}</span>
                                        )}
                                    </div>
                                    <div className="col-span-7 md:col-span-5">
                                        <Link href={`/practice/${p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                                            className="text-sm font-medium text-slate-900 hover:text-indigo-600 transition-colors line-clamp-1">
                                            {p.title}
                                        </Link>
                                        <div className="flex flex-wrap gap-1 mt-0.5 md:hidden">
                                            <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${diffColor(p.difficulty)}`}>{p.difficulty}</span>
                                            <span className="text-[10px] text-slate-400">{p.topic}</span>
                                        </div>
                                    </div>
                                    <div className="hidden md:block col-span-2 text-xs text-slate-500">{p.topic}</div>
                                    <div className="hidden md:flex col-span-1 justify-center">
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${diffColor(p.difficulty)}`}>{p.difficulty}</span>
                                    </div>
                                    <div className="hidden md:block col-span-1 text-center text-xs text-slate-500">{p.acceptance}%</div>
                                    <div className="hidden md:flex col-span-1 justify-center">
                                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${p.frequency === 'High' ? 'bg-red-50 text-red-600' : p.frequency === 'Medium' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-400'
                                            }`}>{p.frequency}</span>
                                    </div>
                                    <div className="col-span-4 md:col-span-1 flex items-center justify-end md:justify-center gap-2">
                                        <div className="flex gap-0.5 md:hidden">
                                            {p.companies.slice(0, 2).map(c => (
                                                <span key={c} className="text-[8px] bg-slate-100 text-slate-500 px-1 py-0.5 rounded">{c}</span>
                                            ))}
                                        </div>
                                        <button onClick={() => toggleStar(p.id)} className="text-sm hover:scale-110 transition-transform">
                                            {p.starred ? '⭐' : '☆'}
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Bottom CTA */}
                        <div className="mt-6 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-2xl p-6 text-center border border-teal-100">
                            <h3 className="font-bold text-slate-900 mb-1 st-font-heading">📈 Your DSA Progress</h3>
                            <p className="text-sm text-slate-600 mb-3">
                                {solvedCount === 0 ? 'Start solving to track your progress here!' :
                                    `${solvedCount} solved out of ${problems.length} — ${Math.round((solvedCount / problems.length) * 100)}% complete`}
                            </p>
                            <div className="h-2 bg-white rounded-full overflow-hidden max-w-md mx-auto mb-3">
                                <motion.div className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(solvedCount / problems.length) * 100}%` }}
                                    transition={{ duration: 1 }} />
                            </div>
                            <Link href="/practice" className="text-sm text-teal-600 font-semibold hover:underline">Open Practice IDE →</Link>
                        </div>
                    </div>
                </main>
                <BottomNav />
            </div>
        </div>
    );
}
