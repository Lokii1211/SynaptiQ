'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { api, auth } from '@/lib/api';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { difficultyColor } from '@/lib/utils/india';
import { classifyError } from '@/components/PaywallTrigger';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

const LANGUAGES = [
    { id: 'python', label: 'Python', default: '# Write your solution here\n\ndef solution():\n    pass\n' },
    { id: 'javascript', label: 'JavaScript', default: '// Write your solution here\n\nfunction solution() {\n  \n}\n' },
    { id: 'java', label: 'Java', default: '// Write your solution here\n\nclass Solution {\n    public static void main(String[] args) {\n      \n    }\n}\n' },
    { id: 'cpp', label: 'C++', default: '// Write your solution here\n#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    \n    return 0;\n}\n' },
];

type ResultTab = 'testcase' | 'output' | 'submissions';
type PanelTab = 'problem' | 'code' | 'results'; // mobile

export default function CodingProblemPage() {
    const params = useParams();
    const slug = params?.slug as string;
    const [problem, setProblem] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [language, setLanguage] = useState('python');
    const [code, setCode] = useState(LANGUAGES[0].default);
    const [submitting, setSubmitting] = useState(false);
    const [running, setRunning] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [runResult, setRunResult] = useState<any>(null);
    const [aiReview, setAiReview] = useState<any>(null);
    const [showDescription, setShowDescription] = useState(true);
    const [resultTab, setResultTab] = useState<ResultTab>('testcase');
    const [customInput, setCustomInput] = useState('');
    const [showCustomInput, setShowCustomInput] = useState(false);
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [loadingSubmissions, setLoadingSubmissions] = useState(false);
    const [mobilePanel, setMobilePanel] = useState<PanelTab>('problem');
    const [leftTab, setLeftTab] = useState<'desc' | 'solution' | 'discuss' | 'notes'>('desc');
    const [userNotes, setUserNotes] = useState('');

    const { isReady } = useAuthGuard();

    useEffect(() => {
        if (!isReady || !slug) return;
        api.getCodingProblem(slug).then(p => {
            setProblem(p);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, [slug, isReady]);

    const handleLanguageChange = (newLang: string) => {
        setLanguage(newLang);
        const langDef = LANGUAGES.find(l => l.id === newLang);
        setCode(langDef?.default || '');
    };

    // ─── RUN (test, no save) ───
    const handleRun = async () => {
        setRunning(true);
        setRunResult(null);
        setResult(null);
        setResultTab('testcase');
        try {
            const data: any = { language, code };
            if (showCustomInput && customInput.trim()) {
                data.custom_input = customInput;
            }
            const res = await api.runCode(slug, data);
            setRunResult(res);
        } catch (e: any) {
            setRunResult({ mode: 'error', error: e.message });
        } finally {
            setRunning(false);
        }
    };

    // ─── SUBMIT (graded, saved) ───
    const handleSubmit = async () => {
        setSubmitting(true);
        setResult(null);
        setRunResult(null);
        setAiReview(null);
        setResultTab('testcase');
        try {
            const res = await api.submitCode(slug, { language, code });
            setResult(res);
        } catch (e: any) {
            setResult({ status: 'error', message: e.message });
        } finally {
            setSubmitting(false);
        }
    };

    // ─── AI Review ───
    const handleAiReview = async () => {
        try {
            const review = await api.aiCodeReview({ code, language, problem_title: problem?.title });
            setAiReview(review);
        } catch (e: any) {
            setAiReview({ error: e.message });
        }
    };

    // ─── Load submissions ───
    const loadSubmissions = async () => {
        setLoadingSubmissions(true);
        try {
            const data = await api.getSubmissions(slug);
            setSubmissions(data.submissions || []);
        } catch { setSubmissions([]); }
        finally { setLoadingSubmissions(false); }
    };

    useEffect(() => {
        if (resultTab === 'submissions' && submissions.length === 0) {
            loadSubmissions();
        }
    }, [resultTab]);

    if (loading) return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
            <div className="w-12 h-12 border-3 border-slate-600 border-t-indigo-500 rounded-full animate-spin" />
        </div>
    );

    if (!problem) return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
            Problem not found
        </div>
    );

    const hasResult = result || runResult;

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col md:flex-row">

            {/* ═══════ MOBILE TAB BAR ═══════ */}
            <div className="md:hidden flex bg-slate-800 border-b border-slate-700">
                {(['problem', 'code', 'results'] as PanelTab[]).map(tab => (
                    <button key={tab} onClick={() => setMobilePanel(tab)}
                        className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider transition-colors ${mobilePanel === tab ? 'text-indigo-400 border-b-2 border-indigo-400 bg-slate-800' : 'text-slate-500'
                            }`}>
                        {tab === 'problem' ? '📄 Problem' : tab === 'code' ? '💻 Code' : '▶ Results'}
                    </button>
                ))}
            </div>

            {/* ═══════ LEFT: Problem Description ═══════ */}
            <div className={`${mobilePanel === 'problem' ? 'block' : 'hidden'} md:block md:w-[45%] lg:w-[40%] bg-slate-900 border-r border-slate-700 overflow-y-auto h-[calc(100vh-48px)] md:h-screen`}>
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <button onClick={() => window.history.back()} className="text-slate-400 hover:text-white transition-colors text-sm">
                            ← Back
                        </button>
                    </div>

                    <h1 className="text-xl font-bold text-white mb-3 st-font-heading">{problem.title}</h1>

                    <div className="flex flex-wrap gap-2 mb-6">
                        <span className={`text-xs px-2.5 py-1 rounded-md font-medium border ${difficultyColor(problem.difficulty)}`}>
                            {problem.difficulty}
                        </span>
                        {problem.category && (
                            <span className="text-xs px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                                {problem.category}
                            </span>
                        )}
                    </div>

                    {/* Description */}
                    <div className="prose prose-invert prose-sm max-w-none mb-6">
                        <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{problem.problem_statement || problem.description}</p>
                    </div>

                    {/* Examples */}
                    {problem.examples && problem.examples.length > 0 && (
                        <div className="space-y-4 mb-6">
                            <h3 className="text-sm font-semibold text-slate-400 uppercase">Examples</h3>
                            {problem.examples.map((ex: any, i: number) => (
                                <div key={i} className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                                    <p className="text-xs text-slate-500 mb-2">Example {i + 1}</p>
                                    <pre className="text-sm text-slate-300 font-mono whitespace-pre-wrap">
                                        <span className="text-indigo-400">Input:</span> {ex.input}{'\n'}
                                        <span className="text-green-400">Output:</span> {ex.output}
                                        {ex.explanation && <>{'\n'}<span className="text-yellow-400">Explanation:</span> {ex.explanation}</>}
                                    </pre>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Constraints */}
                    {problem.constraints && (
                        <div className="mb-6">
                            <h3 className="text-sm font-semibold text-slate-400 uppercase mb-2">Constraints</h3>
                            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                                <p className="text-sm text-slate-300 font-mono whitespace-pre-wrap">{problem.constraints}</p>
                            </div>
                        </div>
                    )}

                    {/* Company tags */}
                    {problem.company_tags?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                            {problem.company_tags.map((tag: string) => (
                                <span key={tag} className="text-xs bg-indigo-900/50 text-indigo-300 px-2 py-0.5 rounded-md">{tag}</span>
                            ))}
                        </div>
                    )}

                    {/* Hints */}
                    {problem.hints && problem.hints.length > 0 && (
                        <div className="mt-6">
                            <h3 className="text-sm font-semibold text-slate-400 uppercase mb-2">Hints</h3>
                            {problem.hints.map((hint: string, i: number) => (
                                <details key={i} className="mb-2">
                                    <summary className="text-sm text-indigo-400 cursor-pointer hover:text-indigo-300">💡 Hint {i + 1}</summary>
                                    <p className="text-sm text-slate-400 mt-1 ml-4">{hint}</p>
                                </details>
                            ))}
                        </div>
                    )}
                </div>

                {/* ═══ Solution / Discuss / Notes tabs (Bible Phase 6) ═══ */}
                <div className="border-t border-slate-700">
                    <div className="flex border-b border-slate-700/50 px-4">
                        {(['desc', 'solution', 'discuss', 'notes'] as const).map(tab => (
                            <button key={tab} onClick={() => setLeftTab(tab)}
                                className={`px-3 py-2 text-xs font-medium transition-colors capitalize ${leftTab === tab ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}>
                                {tab === 'desc' ? '📄 Description' : tab === 'solution' ? '💡 Solution' : tab === 'discuss' ? '💬 Discuss' : '📝 Notes'}
                            </button>
                        ))}
                    </div>

                    {leftTab === 'solution' && (
                        <div className="p-4 space-y-4">
                            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-sm font-bold text-white">💡 Approach: Optimal</h3>
                                    <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-mono">O(n)</span>
                                </div>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-xs text-indigo-400 font-semibold mb-1">Step 1: Understand the Pattern</p>
                                        <p className="text-xs text-slate-400">Identify the core algorithm needed based on input size and constraints.</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-indigo-400 font-semibold mb-1">Step 2: Choose Data Structure</p>
                                        <p className="text-xs text-slate-400">Pick the optimal data structure (HashMap, Stack, Two Pointers, etc.).</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-indigo-400 font-semibold mb-1">Step 3: Edge Cases</p>
                                        <p className="text-xs text-slate-400">Handle empty input, single element, and large values.</p>
                                    </div>
                                </div>
                                <div className="mt-4 pt-3 border-t border-slate-700">
                                    <p className="text-[10px] text-slate-500 mb-1">Complexity</p>
                                    <div className="flex gap-4">
                                        <span className="text-xs text-emerald-400 font-mono">⏱ Time: O(n)</span>
                                        <span className="text-xs text-cyan-400 font-mono">💾 Space: O(1)</span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-center">
                                <p className="text-[10px] text-slate-500">🔒 Full solution with code available after attempting the problem</p>
                            </div>
                        </div>
                    )}

                    {leftTab === 'discuss' && (
                        <div className="p-4 space-y-3">
                            <div className="text-center py-8">
                                <span className="text-3xl block mb-2">💬</span>
                                <p className="text-xs text-slate-500 mb-3">No discussions yet. Be the first to share your approach!</p>
                            </div>
                            <button className="w-full text-center text-xs text-indigo-400 hover:text-indigo-300 py-2">💬 Add a comment...</button>
                        </div>
                    )}

                    {leftTab === 'notes' && (
                        <div className="p-4">
                            <textarea
                                value={userNotes}
                                onChange={(e) => setUserNotes(e.target.value)}
                                placeholder="Write your notes, approach ideas, or key observations here...\n\nThese notes are saved per-problem."
                                className="w-full h-48 bg-slate-800 text-slate-300 text-xs font-mono p-3 rounded-lg border border-slate-700 resize-none focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder:text-slate-600"
                            />
                            <p className="text-[9px] text-slate-500 mt-2">💾 Auto-saved locally</p>
                        </div>
                    )}
                </div>
            </div>

            {/* ═══════ RIGHT: Editor + Results ═══════ */}
            <div className={`${mobilePanel === 'problem' ? 'hidden md:flex' : 'flex'} flex-1 flex-col h-[calc(100vh-48px)] md:h-screen`}>

                {/* ─── Toolbar ─── */}
                <div className="bg-slate-800 border-b border-slate-700 px-4 py-2 flex items-center justify-between flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <select value={language} onChange={(e) => handleLanguageChange(e.target.value)}
                            className="bg-slate-700 text-white text-sm px-3 py-1.5 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            {LANGUAGES.map(l => <option key={l.id} value={l.id}>{l.label}</option>)}
                        </select>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={handleAiReview}
                            className="text-xs bg-violet-600 hover:bg-violet-700 text-white px-3 py-1.5 rounded-lg transition-colors hidden sm:block">
                            🤖 AI Review
                        </button>
                        <button onClick={handleRun} disabled={running || submitting}
                            className="text-sm bg-slate-600 hover:bg-slate-500 text-white px-4 py-1.5 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-1.5">
                            {running ? (
                                <><span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />Running...</>
                            ) : '▶ Run'}
                        </button>
                        <button onClick={handleSubmit} disabled={submitting || running}
                            className="text-sm bg-green-600 hover:bg-green-700 text-white px-5 py-1.5 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-1.5">
                            {submitting ? (
                                <><span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />Submitting...</>
                            ) : '✓ Submit'}
                        </button>
                    </div>
                </div>

                {/* ─── Code Editor (shows always on desktop, only on 'code'/'results' tab on mobile) ─── */}
                <div className={`${mobilePanel === 'results' ? 'hidden md:block' : ''} flex-1 min-h-0`}>
                    <MonacoEditor
                        height="100%"
                        language={language}
                        theme="vs-dark"
                        value={code}
                        onChange={(val) => setCode(val || '')}
                        options={{
                            fontSize: 14,
                            fontFamily: "'JetBrains Mono', monospace",
                            minimap: { enabled: false },
                            scrollBeyondLastLine: false,
                            padding: { top: 16 },
                            lineNumbers: 'on',
                            tabSize: 4,
                            wordWrap: 'on',
                            suggestOnTriggerCharacters: true,
                            quickSuggestions: true,
                            folding: true,
                            autoClosingBrackets: 'always',
                            autoClosingQuotes: 'always',
                            formatOnPaste: true,
                        }}
                    />
                </div>

                {/* ─── Custom Input Toggle ─── */}
                <div className="bg-slate-800 border-t border-slate-700 px-4 py-1.5 flex items-center gap-3 flex-shrink-0">
                    <button onClick={() => setShowCustomInput(!showCustomInput)}
                        className={`text-xs px-3 py-1 rounded-md transition-colors ${showCustomInput ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-400 hover:text-white'}`}>
                        {showCustomInput ? '✓ Custom Input' : '+ Custom Input'}
                    </button>
                    {showCustomInput && (
                        <span className="text-[10px] text-slate-500">Enter your test input below → click Run</span>
                    )}
                </div>

                {/* ─── Custom Input Area ─── */}
                <AnimatePresence>
                    {showCustomInput && (
                        <motion.div initial={{ height: 0 }} animate={{ height: 100 }} exit={{ height: 0 }} className="overflow-hidden flex-shrink-0">
                            <textarea
                                value={customInput}
                                onChange={(e) => setCustomInput(e.target.value)}
                                placeholder="Enter your custom test input here..."
                                className="w-full h-full bg-slate-900 text-slate-300 text-sm font-mono p-3 resize-none border-t border-slate-700 focus:outline-none placeholder:text-slate-600"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ═══════ RESULTS PANEL ═══════ */}
                {(hasResult || aiReview || mobilePanel === 'results') && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }}
                        className="bg-slate-800 border-t border-slate-700 overflow-y-auto max-h-[45vh] md:max-h-[40vh] flex-shrink-0">

                        {/* Result Tabs */}
                        <div className="flex border-b border-slate-700 px-2 sticky top-0 bg-slate-800 z-10">
                            {[
                                { key: 'testcase' as ResultTab, label: 'Test Cases', icon: '📋' },
                                { key: 'output' as ResultTab, label: 'Output', icon: '📤' },
                                { key: 'submissions' as ResultTab, label: 'Submissions', icon: '📜' },
                            ].map(tab => (
                                <button key={tab.key} onClick={() => setResultTab(tab.key)}
                                    className={`px-4 py-2 text-xs font-medium transition-colors ${resultTab === tab.key ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-slate-500 hover:text-slate-300'
                                        }`}>
                                    {tab.icon} {tab.label}
                                </button>
                            ))}
                        </div>

                        <div className="p-4">
                            {/* ─── TEST CASES TAB ─── */}
                            {resultTab === 'testcase' && (
                                <>
                                    {/* Submit result header */}
                                    {result && (
                                        <div className={`flex items-center gap-3 mb-4 px-4 py-3 rounded-xl ${result.status === 'accepted' ? 'bg-emerald-500/10 border border-emerald-500/20' :
                                            result.status === 'wrong_answer' ? 'bg-amber-500/10 border border-amber-500/20' :
                                                result.status === 'error' ? 'bg-red-500/10 border border-red-500/20' :
                                                    'bg-slate-700/50 border border-slate-600'
                                            }`}>
                                            <span className="text-2xl">
                                                {result.status === 'accepted' ? '✅' : result.status === 'wrong_answer' ? '⚠️' : '❌'}
                                            </span>
                                            <div className="flex-1">
                                                <p className={`font-bold text-sm ${result.status === 'accepted' ? 'text-emerald-400' :
                                                    result.status === 'wrong_answer' ? 'text-amber-400' : 'text-red-400'
                                                    }`}>
                                                    {result.status === 'accepted' ? 'Accepted!' :
                                                        result.status === 'wrong_answer' ? 'Wrong Answer' : (() => {
                                                            const errInfo = classifyError(result.message || result.status || 'error');
                                                            return errInfo.badge;
                                                        })()}
                                                </p>
                                                <p className="text-[11px] text-slate-500">
                                                    {result.test_cases_passed}/{result.test_cases_total} test cases passed
                                                    {result.runtime_percentile ? ` · Faster than ${result.runtime_percentile}% of ${language} submissions` : ''}
                                                </p>
                                                {/* Error type badge + AI fix (Bible Phase 1) */}
                                                {result.status !== 'accepted' && result.status !== 'wrong_answer' && (
                                                    <div className="mt-2">
                                                        {(() => {
                                                            const errInfo = classifyError(result.message || result.status || 'error');
                                                            return (
                                                                <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg border text-[10px] font-bold ${errInfo.badgeColor}`}>
                                                                    {errInfo.badge}
                                                                </div>
                                                            );
                                                        })()}
                                                    </div>
                                                )}
                                            </div>
                                            {/* Stats chips */}
                                            <div className="hidden sm:flex items-center gap-3">
                                                {result.runtime_ms != null && (
                                                    <div className="text-center">
                                                        <p className="text-sm font-bold text-white tabular-nums">{result.runtime_ms}<span className="text-slate-500 text-[10px]">ms</span></p>
                                                        <p className="text-[9px] text-slate-500">Runtime</p>
                                                    </div>
                                                )}
                                                {result.memory_mb != null && (
                                                    <div className="text-center">
                                                        <p className="text-sm font-bold text-white tabular-nums">{result.memory_mb}<span className="text-slate-500 text-[10px]">MB</span></p>
                                                        <p className="text-[9px] text-slate-500">Memory</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Per-test-case results */}
                                    {(result?.case_results || runResult?.test_cases) && (
                                        <div className="space-y-2">
                                            {(result?.case_results || runResult?.test_cases || []).map((tc: any, i: number) => (
                                                <details key={i} open={tc.status === 'failed'}>
                                                    <summary className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer text-sm ${tc.status === 'passed' ? 'bg-emerald-500/5 border border-emerald-500/10 text-emerald-400' :
                                                        'bg-red-500/5 border border-red-500/10 text-red-400'
                                                        }`}>
                                                        <span>{tc.status === 'passed' ? '✓' : '✗'} Test Case {tc.case_number} {tc.is_hidden ? '(Hidden)' : ''}</span>
                                                        <span className="text-[10px] text-slate-500">{tc.runtime_ms}ms</span>
                                                    </summary>
                                                    <div className="mt-2 ml-2 grid grid-cols-3 gap-2 text-xs">
                                                        <div className="bg-slate-900 rounded-lg p-2.5">
                                                            <p className="text-[10px] text-slate-500 mb-1 uppercase font-semibold">Input</p>
                                                            <pre className="text-slate-300 font-mono whitespace-pre-wrap">{tc.input || '—'}</pre>
                                                        </div>
                                                        <div className="bg-slate-900 rounded-lg p-2.5">
                                                            <p className="text-[10px] text-slate-500 mb-1 uppercase font-semibold">Expected</p>
                                                            <pre className="text-green-300 font-mono whitespace-pre-wrap">{tc.expected_output || '—'}</pre>
                                                        </div>
                                                        <div className="bg-slate-900 rounded-lg p-2.5">
                                                            <p className="text-[10px] text-slate-500 mb-1 uppercase font-semibold">Your Output</p>
                                                            <pre className={`font-mono whitespace-pre-wrap ${tc.status === 'passed' ? 'text-green-300' : 'text-red-300'}`}>{tc.your_output || '—'}</pre>
                                                        </div>
                                                    </div>
                                                    {tc.diff && (
                                                        <p className="text-[10px] text-amber-400 mt-1.5 ml-2">💡 {tc.diff}</p>
                                                    )}
                                                </details>
                                            ))}
                                        </div>
                                    )}

                                    {/* Custom input result */}
                                    {runResult?.mode === 'custom_input' && (
                                        <div className="bg-slate-900 rounded-xl p-4">
                                            <h4 className="text-xs font-semibold text-slate-400 uppercase mb-2">Custom Input Result</h4>
                                            <div className="grid grid-cols-2 gap-3 text-xs">
                                                <div>
                                                    <p className="text-[10px] text-slate-500 mb-1">INPUT</p>
                                                    <pre className="text-slate-300 font-mono bg-slate-800 rounded p-2">{runResult.input}</pre>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-slate-500 mb-1">OUTPUT</p>
                                                    <pre className="text-green-300 font-mono bg-slate-800 rounded p-2">{runResult.output}</pre>
                                                </div>
                                            </div>
                                            <p className="text-[10px] text-slate-500 mt-2">{runResult.runtime_ms}ms · {runResult.memory_mb}MB</p>
                                        </div>
                                    )}

                                    {/* Error */}
                                    {runResult?.mode === 'error' && (
                                        <div className="bg-red-900/20 border border-red-900/30 rounded-xl p-4">
                                            <p className="text-red-400 text-sm font-semibold mb-1">❌ Error</p>
                                            <pre className="text-red-300 text-xs font-mono">{runResult.error}</pre>
                                        </div>
                                    )}

                                    {/* Submission stats row */}
                                    {result && (result.runtime_percentile || result.memory_percentile) && (
                                        <div className="grid grid-cols-2 gap-3 mt-4">
                                            <div className="bg-slate-900 rounded-xl p-3">
                                                <p className="text-[10px] text-slate-500 uppercase mb-1">Runtime</p>
                                                <p className="text-lg font-bold text-white tabular-nums">{result.runtime_ms}<span className="text-slate-500 text-xs">ms</span></p>
                                                <div className="h-1.5 bg-slate-700 rounded-full mt-2 overflow-hidden">
                                                    <div className="h-full bg-indigo-400 rounded-full transition-all duration-700" style={{ width: `${result.runtime_percentile}%` }} />
                                                </div>
                                                <p className="text-[10px] text-indigo-400 mt-1">Faster than {result.runtime_percentile}%</p>
                                            </div>
                                            <div className="bg-slate-900 rounded-xl p-3">
                                                <p className="text-[10px] text-slate-500 uppercase mb-1">Memory</p>
                                                <p className="text-lg font-bold text-white tabular-nums">{result.memory_mb}<span className="text-slate-500 text-xs">MB</span></p>
                                                <div className="h-1.5 bg-slate-700 rounded-full mt-2 overflow-hidden">
                                                    <div className="h-full bg-violet-400 rounded-full transition-all duration-700" style={{ width: `${result.memory_percentile}%` }} />
                                                </div>
                                                <p className="text-[10px] text-violet-400 mt-1">Less than {result.memory_percentile}%</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Submission ID */}
                                    {result?.submission_id && (
                                        <p className="text-[10px] text-slate-600 mt-3">Attempt #{result.attempt_number} · ID: {result.submission_id}</p>
                                    )}
                                </>
                            )}

                            {/* ─── OUTPUT / AI REVIEW TAB ─── */}
                            {resultTab === 'output' && (
                                <div className="space-y-4">
                                    {aiReview && !aiReview.error && (
                                        <div>
                                            <h4 className="text-sm font-semibold text-violet-400 mb-2">🤖 AI Code Review</h4>
                                            <div className="text-sm text-slate-300 whitespace-pre-wrap bg-slate-900 rounded-lg p-3 leading-relaxed">
                                                {aiReview.review || aiReview.feedback || JSON.stringify(aiReview, null, 2)}
                                            </div>
                                        </div>
                                    )}
                                    {aiReview?.error && (
                                        <div className="bg-red-900/20 border border-red-900/30 rounded-lg p-3">
                                            <p className="text-red-400 text-xs">{aiReview.error}</p>
                                        </div>
                                    )}
                                    {!aiReview && (
                                        <div className="text-center py-8">
                                            <p className="text-slate-500 text-sm">Click 🤖 AI Review to get feedback on your code</p>
                                            <button onClick={handleAiReview}
                                                className="mt-3 text-xs bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg transition-colors">
                                                🤖 Get AI Review
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* ─── SUBMISSIONS HISTORY TAB ─── */}
                            {resultTab === 'submissions' && (
                                <div>
                                    {loadingSubmissions ? (
                                        <div className="flex justify-center py-8">
                                            <div className="w-6 h-6 border-2 border-slate-600 border-t-indigo-400 rounded-full animate-spin" />
                                        </div>
                                    ) : submissions.length === 0 ? (
                                        <p className="text-slate-500 text-sm text-center py-8">No submissions yet. Submit your solution to see history.</p>
                                    ) : (
                                        <div className="space-y-1.5">
                                            {submissions.map((s: any) => (
                                                <div key={s.id} className={`flex items-center justify-between px-3 py-2.5 rounded-lg border text-xs ${s.status === 'accepted' ? 'bg-emerald-500/5 border-emerald-500/10' : 'bg-red-500/5 border-red-500/10'
                                                    }`}>
                                                    <div className="flex items-center gap-3">
                                                        <span className={`font-semibold ${s.status === 'accepted' ? 'text-emerald-400' : 'text-red-400'}`}>
                                                            {s.status === 'accepted' ? '✓ Accepted' : '✗ Wrong'}
                                                        </span>
                                                        <span className="text-slate-400">{s.language}</span>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-slate-500">
                                                        <span>{s.test_cases_passed}/{s.test_cases_total}</span>
                                                        <span>{s.runtime_ms}ms</span>
                                                        <span>{s.memory_mb}MB</span>
                                                        <span className="text-slate-600">{s.submitted_at ? new Date(s.submitted_at).toLocaleDateString() : ''}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
