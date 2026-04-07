"use client"

import { CheckCircle2, AlertTriangle, Lightbulb, Activity, Code2, Zap, Download } from 'lucide-react'
import type { ReviewResponse } from '@/app/actions/review'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function ReviewResults({ results, loading, onCopy }: { results: ReviewResponse | null, loading: boolean, onCopy?: (code: string) => void }) {
    if (loading) {
        return (
            <div className="h-full flex flex-col items-center justify-center space-y-4 animate-pulse duration-1000">
                <Activity className="w-16 h-16 text-blue-500/50 animate-bounce" />
                <h3 className="text-lg font-medium text-blue-400">Analyzing your code...</h3>
                <p className="text-sm text-gray-400">Our AI agent is reviewing your syntax and logic.</p>
            </div>
        )
    }

    if (!results) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-gray-400 opacity-60">
                <Code2 className="w-16 h-16 text-blue-500/50" />
                <div>
                    <h3 className="text-lg font-medium text-white mb-1">Waiting for code</h3>
                    <p className="max-w-xs text-sm">Submit your code using the &quot;Review Code&quot; button to receive instant AI feedback.</p>
                </div>
            </div>
        )
    }

    const { score, syntax_errors, logic_flaws, optimization_tips, complexity, optimized_code } = results
    const isGood = score >= 80
    const isOk = score >= 50 && score < 80
    const isAlreadyOptimized = score >= 95

    const circleColorClass = isGood ? 'text-green-500' : isOk ? 'text-yellow-500' : 'text-red-500'

    const handleExport = () => {
        const text = `# AI Code Review Report\n\n## Score: ${score}/100\n\n### Complexity\n- Time: ${complexity?.time}\n- Space: ${complexity?.space}\n\n### Syntax Errors\n${syntax_errors.map(e => `- ${e}`).join('\n')}\n\n### Logic Flaws\n${logic_flaws.map(e => `- ${e}`).join('\n')}\n\n### Optimization Tips\n${optimization_tips.map(e => `- ${e}`).join('\n')}\n\n### Optimized Code\n\`\`\`\n${optimized_code}\n\`\`\``
        const blob = new Blob([text], { type: 'text/markdown' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'code-review-report.md'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    const handleCopyCode = () => {
        navigator.clipboard.writeText(optimized_code)
    }

    const handleCopyToEditor = () => {
        if (onCopy) {
            onCopy(optimized_code)
        }
    }

    return (
        <div className="space-y-8 pb-10">
            {/* Action Bar */}
            <div className="flex items-center justify-end">
                <button
                    onClick={handleExport}
                    className="flex items-center gap-2 px-3 py-1.5 bg-[#1c2028] hover:bg-[#262a33] text-gray-300 hover:text-white rounded-md text-sm transition-colors border border-[#262a33]"
                >
                    <Download className="w-4 h-4" />
                    Export Report
                </button>
            </div>

            {/* Score Section */}
            <div className="flex items-center gap-6 bg-gradient-to-r from-[#1c2230] to-[#161a24] border border-[#262a33] p-6 rounded-2xl shadow-xl">
                <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
                    <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 36 36">
                        <path
                            className="text-[#262a33]"
                            strokeWidth="4"
                            stroke="currentColor"
                            fill="none"
                            d="M18 2 a 16 16 0 0 1 0 32 a 16 16 0 0 1 0 -32"
                        />
                        <path
                            className={circleColorClass}
                            strokeDasharray={score + ", 100"}
                            strokeWidth="4"
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="none"
                            d="M18 2 a 16 16 0 0 1 0 32 a 16 16 0 0 1 0 -32"
                        />
                    </svg>
                    <span className="absolute text-2xl font-bold text-white drop-shadow-md">{score}</span>
                </div>
                <div>
                    <h3 className="text-2xl font-semibold text-white tracking-tight">
                        {isAlreadyOptimized ? 'Perfectly Optimized' : isGood ? 'Excellent Quality' : isOk ? 'Needs Improvement' : 'Critical Issues'}
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">Score based on readability, efficiency, and best practices.</p>
                </div>
            </div>

            {/* Complexity Analysis */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#1c2230]/50 border border-[#262a33] p-4 rounded-xl flex items-center gap-4">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                        <Activity className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Time Complexity</p>
                        <p className="text-lg font-mono text-blue-300">{complexity?.time || "N/A"}</p>
                    </div>
                </div>
                <div className="bg-[#1c2230]/50 border border-[#262a33] p-4 rounded-xl flex items-center gap-4">
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                        <Layout className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Space Complexity</p>
                        <p className="text-lg font-mono text-purple-300">{complexity?.space || "N/A"}</p>
                    </div>
                </div>
            </div>

            {/* Syntax Errors */}
            {syntax_errors && syntax_errors.length > 0 && (
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-red-400">
                        <AlertTriangle className="w-5 h-5" />
                        <h4 className="text-sm font-semibold uppercase tracking-wider">Syntax Errors</h4>
                    </div>
                    <ul className="space-y-2">
                        {syntax_errors.map((error, idx) => (
                            <li key={idx} className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-sm text-red-200 flex items-start gap-3">
                                <span className="mt-0.5 shrink-0">•</span>
                                <div className="prose prose-invert prose-sm max-w-none">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{error}</ReactMarkdown>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Logic Flaws */}
            {logic_flaws && logic_flaws.length > 0 && (
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-yellow-500">
                        <Zap className="w-5 h-5" />
                        <h4 className="text-sm font-semibold uppercase tracking-wider">Logic Flaws</h4>
                    </div>
                    <ul className="space-y-2">
                        {logic_flaws.map((flaw, idx) => (
                            <li key={idx} className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 text-sm text-yellow-200 flex items-start gap-3">
                                <span className="mt-0.5 shrink-0">•</span>
                                <div className="prose prose-invert prose-sm max-w-none prose-yellow">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{flaw}</ReactMarkdown>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Optimization Tips */}
            {optimization_tips && optimization_tips.length > 0 && (
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-blue-400">
                        <Lightbulb className="w-5 h-5" />
                        <h4 className="text-sm font-semibold uppercase tracking-wider">Optimization Tips</h4>
                    </div>
                    <ul className="space-y-2">
                        {optimization_tips.map((tip, idx) => (
                            <li key={idx} className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-sm text-blue-200 flex items-start gap-3">
                                <CheckCircle2 className="w-4 h-4 mt-0.5 text-blue-500 shrink-0" />
                                <div className="prose prose-invert prose-sm max-w-none prose-blue">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{tip}</ReactMarkdown>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Optimized Code Section */}
            {optimized_code && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-emerald-400">
                            <Sparkles className="w-5 h-5" />
                            <h4 className="text-sm font-semibold uppercase tracking-wider">
                                {isAlreadyOptimized ? 'Optimized Code' : 'Optimized Code'}
                            </h4>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={handleCopyToEditor}
                                className="text-xs bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded border border-emerald-500/20 transition-colors flex items-center gap-2"
                            >
                                <Code2 className="w-3.5 h-3.5" />
                                Copy to Editor
                            </button>
                            <button
                                onClick={handleCopyCode}
                                className="text-xs bg-[#1c2028] hover:bg-[#262a33] text-gray-400 hover:text-white px-3 py-1.5 rounded border border-[#262a33] transition-colors"
                            >
                                Copy Clipboard
                            </button>
                        </div>
                    </div>
                    <div className="relative group">
                        <pre className="bg-[#0d1117] border border-[#262a33] rounded-xl p-6 overflow-x-auto text-base font-mono text-emerald-100/90 leading-relaxed shadow-xl min-h-[200px]">
                            <code>{optimized_code}</code>
                        </pre>
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                             <div className={`px-2 py-1 ${isAlreadyOptimized ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'} text-[10px] uppercase font-bold rounded border`}>
                                {isAlreadyOptimized ? 'Already Optimized' : 'AI Optimized'}
                             </div>
                        </div>
                    </div>
                </div>
            )}


            {/* All clear state */}
            {syntax_errors?.length === 0 && logic_flaws?.length === 0 && optimization_tips?.length === 0 && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-center">
                    <p className="text-green-400 text-sm font-medium">Your code looks perfect! No issues found.</p>
                </div>
            )}
        </div>
    )
}

function Layout(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <path d="M3 9h18" />
            <path d="M9 21V9" />
        </svg>
    )
}

function Sparkles(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
            <path d="M5 3v4" />
            <path d="M19 17v4" />
            <path d="M3 5h4" />
            <path d="M17 19h4" />
        </svg>
    )
}
