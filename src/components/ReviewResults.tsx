"use client"

import { CheckCircle2, AlertTriangle, Lightbulb, Activity, Code2, Zap, Download } from 'lucide-react'
import type { ReviewResponse } from '@/app/actions/review'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function ReviewResults({ results, loading }: { results: ReviewResponse | null, loading: boolean }) {
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

    const { score, syntax_errors, logic_flaws, optimization_tips } = results
    const isGood = score >= 80
    const isOk = score >= 50 && score < 80

    const circleColorClass = isGood ? 'text-green-500' : isOk ? 'text-yellow-500' : 'text-red-500'

    const handleExport = () => {
        const text = `# AI Code Review Report\n\n## Score: ${score}/100\n\n### Syntax Errors\n${syntax_errors.map(e => `- ${e}`).join('\n')}\n\n### Logic Flaws\n${logic_flaws.map(e => `- ${e}`).join('\n')}\n\n### Optimization Tips\n${optimization_tips.map(e => `- ${e}`).join('\n')}`
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

    return (
        <div className="space-y-6">
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
            <div className="flex items-center gap-6 bg-gradient-to-r from-[#1c2230] to-[#161a24] border border-[#262a33] p-5 rounded-2xl shadow-inner">
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
                        {isGood ? 'Excellent Quality' : isOk ? 'Needs Improvement' : 'Critical Issues'}
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">Score based on readability, efficiency, and best practices.</p>
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

            {/* All clear state */}
            {syntax_errors?.length === 0 && logic_flaws?.length === 0 && optimization_tips?.length === 0 && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-center">
                    <p className="text-green-400 text-sm font-medium">Your code looks perfect! No issues found.</p>
                </div>
            )}
        </div>
    )
}
