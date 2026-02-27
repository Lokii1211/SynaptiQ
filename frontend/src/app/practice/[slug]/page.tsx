'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { api, auth } from '@/lib/api';
import { difficultyColor } from '@/lib/utils/india';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

const LANGUAGES = [
    { id: 'python', label: 'Python', default: '# Write your solution here\n\ndef solution():\n    pass\n' },
    { id: 'javascript', label: 'JavaScript', default: '// Write your solution here\n\nfunction solution() {\n  \n}\n' },
    { id: 'java', label: 'Java', default: '// Write your solution here\n\nclass Solution {\n    public static void main(String[] args) {\n      \n    }\n}\n' },
    { id: 'cpp', label: 'C++', default: '// Write your solution here\n#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    \n    return 0;\n}\n' },
];

export default function CodingProblemPage() {
    const params = useParams();
    const slug = params?.slug as string;
    const [problem, setProblem] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [language, setLanguage] = useState('python');
    const [code, setCode] = useState(LANGUAGES[0].default);
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [aiReview, setAiReview] = useState<any>(null);
    const [showDescription, setShowDescription] = useState(true);

    useEffect(() => {
        if (!auth.isLoggedIn()) { window.location.href = '/login'; return; }
        if (!slug) return;
        api.getCodingProblem(slug).then(p => {
            setProblem(p);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, [slug]);

    const handleLanguageChange = (newLang: string) => {
        setLanguage(newLang);
        const langDef = LANGUAGES.find(l => l.id === newLang);
        setCode(langDef?.default || '');
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        setResult(null);
        setAiReview(null);
        try {
            const res = await api.submitCode(slug, { language, code });
            setResult(res);
        } catch (e: any) {
            setResult({ status: 'error', message: e.message });
        } finally {
            setSubmitting(false);
        }
    };

    const handleAiReview = async () => {
        try {
            const review = await api.aiCodeReview({ code, language, problem_title: problem?.title });
            setAiReview(review);
        } catch (e: any) {
            setAiReview({ error: e.message });
        }
    };

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

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col md:flex-row">
            {/* Left: Problem description */}
            <div className={`${showDescription ? 'block' : 'hidden'} md:block md:w-[45%] lg:w-[40%] bg-slate-900 border-r border-slate-700 overflow-y-auto h-screen`}>
                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-4">
                        <button onClick={() => window.history.back()} className="text-slate-400 hover:text-white transition-colors">
                            ← Back
                        </button>
                    </div>

                    <h1 className="text-xl font-bold text-white mb-3">{problem.title}</h1>

                    <div className="flex gap-2 mb-6">
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
                        <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{problem.description}</p>
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
                </div>
            </div>

            {/* Right: Editor */}
            <div className="flex-1 flex flex-col h-screen">
                {/* Toolbar */}
                <div className="bg-slate-800 border-b border-slate-700 px-4 py-2 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <select value={language} onChange={(e) => handleLanguageChange(e.target.value)}
                            className="bg-slate-700 text-white text-sm px-3 py-1.5 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            {LANGUAGES.map(l => <option key={l.id} value={l.id}>{l.label}</option>)}
                        </select>
                        {/* Mobile toggle */}
                        <button onClick={() => setShowDescription(!showDescription)}
                            className="md:hidden text-sm text-slate-400 hover:text-white"
                        >
                            {showDescription ? '📝 Editor' : '📖 Problem'}
                        </button>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={handleAiReview}
                            className="text-xs bg-violet-600 hover:bg-violet-700 text-white px-3 py-1.5 rounded-lg transition-colors"
                        >
                            🤖 AI Review
                        </button>
                        <button onClick={handleSubmit} disabled={submitting}
                            className="text-sm bg-green-600 hover:bg-green-700 text-white px-5 py-1.5 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            {submitting ? (
                                <><span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />Running...</>
                            ) : '▶ Submit'}
                        </button>
                    </div>
                </div>

                {/* Monaco Editor */}
                <div className="flex-1">
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
                        }}
                    />
                </div>

                {/* Results panel */}
                {(result || aiReview) && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }}
                        className="bg-slate-800 border-t border-slate-700 overflow-y-auto max-h-[40vh]"
                    >
                        <div className="p-4">
                            {result && (
                                <div className="mb-4">
                                    {/* Status header */}
                                    <div className={`flex items-center gap-3 mb-3 px-4 py-3 rounded-xl ${result.status === 'accepted' ? 'bg-emerald-500/10 border border-emerald-500/20' :
                                            result.status === 'wrong_answer' ? 'bg-amber-500/10 border border-amber-500/20' :
                                                result.status === 'error' ? 'bg-red-500/10 border border-red-500/20' :
                                                    'bg-slate-700/50 border border-slate-600'
                                        }`}>
                                        <span className="text-2xl">
                                            {result.status === 'accepted' ? '✅' : result.status === 'wrong_answer' ? '⚠️' : result.status === 'error' ? '❌' : '⏱️'}
                                        </span>
                                        <div>
                                            <p className={`font-bold text-sm ${result.status === 'accepted' ? 'text-emerald-400' :
                                                    result.status === 'wrong_answer' ? 'text-amber-400' :
                                                        result.status === 'error' ? 'text-red-400' : 'text-slate-300'
                                                }`}>
                                                {result.status === 'accepted' ? 'Accepted!' :
                                                    result.status === 'wrong_answer' ? 'Wrong Answer' :
                                                        result.status === 'error' ? 'Error' :
                                                            result.status?.replace(/_/g, ' ')?.replace(/\b\w/g, (l: string) => l.toUpperCase()) || 'Unknown'}
                                            </p>
                                            <p className="text-[11px] text-slate-500">
                                                {result.status === 'accepted' ? 'All test cases passed! Nice work 🎉' :
                                                    result.status === 'wrong_answer' ? 'Some test cases failed. Review your logic.' :
                                                        result.message || 'Check your code and try again.'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Stats grid */}
                                    {(result.test_cases_total || result.runtime_ms !== undefined) && (
                                        <div className="grid grid-cols-3 gap-3 mb-3">
                                            {/* Test cases */}
                                            {result.test_cases_total > 0 && (
                                                <div className="bg-slate-900 rounded-xl p-3 text-center">
                                                    <p className="text-lg font-bold text-white tabular-nums">
                                                        {result.test_cases_passed}<span className="text-slate-500 text-sm">/{result.test_cases_total}</span>
                                                    </p>
                                                    <p className="text-[10px] text-slate-500 mt-0.5">Test Cases</p>
                                                    {/* Progress bar */}
                                                    <div className="h-1.5 bg-slate-700 rounded-full mt-2 overflow-hidden">
                                                        <div className={`h-full rounded-full transition-all duration-500 ${result.test_cases_passed === result.test_cases_total ? 'bg-emerald-400' : 'bg-amber-400'
                                                            }`} style={{ width: `${(result.test_cases_passed / result.test_cases_total) * 100}%` }} />
                                                    </div>
                                                </div>
                                            )}
                                            {/* Runtime */}
                                            {result.runtime_ms !== undefined && (
                                                <div className="bg-slate-900 rounded-xl p-3 text-center">
                                                    <p className="text-lg font-bold text-white tabular-nums">
                                                        {result.runtime_ms}<span className="text-slate-500 text-sm">ms</span>
                                                    </p>
                                                    <p className="text-[10px] text-slate-500 mt-0.5">Runtime</p>
                                                    <div className="h-1.5 bg-slate-700 rounded-full mt-2 overflow-hidden">
                                                        <div className="h-full bg-indigo-400 rounded-full" style={{ width: `${Math.min((result.runtime_ms / 1000) * 100, 100)}%` }} />
                                                    </div>
                                                </div>
                                            )}
                                            {/* Memory */}
                                            {result.memory_mb !== undefined && (
                                                <div className="bg-slate-900 rounded-xl p-3 text-center">
                                                    <p className="text-lg font-bold text-white tabular-nums">
                                                        {result.memory_mb}<span className="text-slate-500 text-sm">MB</span>
                                                    </p>
                                                    <p className="text-[10px] text-slate-500 mt-0.5">Memory</p>
                                                    <div className="h-1.5 bg-slate-700 rounded-full mt-2 overflow-hidden">
                                                        <div className="h-full bg-violet-400 rounded-full" style={{ width: `${Math.min((result.memory_mb / 50) * 100, 100)}%` }} />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Error message */}
                                    {result.message && result.status === 'error' && (
                                        <pre className="text-xs text-red-300 font-mono whitespace-pre-wrap bg-red-900/20 rounded-lg p-3 border border-red-900/30">
                                            {result.message}
                                        </pre>
                                    )}

                                    {/* Submission ID */}
                                    {result.submission_id && (
                                        <p className="text-[10px] text-slate-600 mt-2">ID: {result.submission_id}</p>
                                    )}
                                </div>
                            )}
                            {aiReview && !aiReview.error && (
                                <div>
                                    <h4 className="text-sm font-semibold text-violet-400 mb-2">🤖 AI Code Review</h4>
                                    <div className="text-sm text-slate-300 whitespace-pre-wrap bg-slate-900 rounded-lg p-3">
                                        {aiReview.review || aiReview.feedback || JSON.stringify(aiReview, null, 2)}
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
