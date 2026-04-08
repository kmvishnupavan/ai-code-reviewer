"use client"

import { CheckCircle2, AlertTriangle, Lightbulb, Activity, Code2, Zap, Download, Sparkles, BrainCircuit, Target, GraduationCap, ArrowRight, Save, Copy, FileText, BarChart3, HelpCircle, ShieldCheck, Gauge, TrendingUp, Layers, Minimize2, Maximize2, Split, Hash } from 'lucide-react'
import type { ReviewResponse, ReviewIssue } from '@/app/actions/review'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip } from 'recharts'
import { useState } from 'react'

export default function ReviewResults({ results, loading, onCopy }: { results: ReviewResponse | null, loading: boolean, onCopy?: (code: string) => void }) {
    const [activeSection, setActiveSection] = useState<'overview' | 'comparison' | 'issues' | 'mentor'>('overview')
    const [viewMode, setViewMode] = useState<'split' | 'single'>('split')

    if (loading) {
        return (
            <div className="h-full flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-700">
                <div className="relative">
                    <div className="w-24 h-24 rounded-full border-4 border-blue-500/10 border-t-blue-500 animate-spin" />
                    <BrainCircuit className="w-10 h-10 text-blue-400 absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 animate-pulse" />
                </div>
                <div className="text-center space-y-2">
                    <h3 className="text-xl font-bold text-white tracking-tight italic">Hybrid Analysis Engine Engaged...</h3>
                    <div className="flex gap-2 justify-center">
                         <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-[10px] font-bold rounded border border-blue-500/20 uppercase tracking-widest animate-pulse">Static Audit</span>
                         <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 text-[10px] font-bold rounded border border-purple-500/20 uppercase tracking-widest animate-pulse delay-75">AI Mentorship</span>
                    </div>
                </div>
            </div>
        )
    }

    if (!results) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 text-gray-400 p-8 animate-in zoom-in-95 duration-500">
                <div className="relative group">
                    <div className="absolute inset-0 bg-blue-500/20 blur-[40px] rounded-full group-hover:bg-blue-500/30 transition-all" />
                    <div className="w-20 h-20 bg-[#15181e] rounded-3xl flex items-center justify-center border border-[#262a33] shadow-inner relative z-10">
                        <Gauge className="w-10 h-10 text-blue-500/40 group-hover:scale-110 transition-transform" />
                    </div>
                </div>
                <div className="space-y-2">
                    <h3 className="text-xl font-black text-white tracking-tight uppercase">Analyze & Level Up</h3>
                    <p className="max-w-xs text-xs leading-relaxed text-gray-500 font-medium">Submit your code to trigger the <span className="text-blue-400">Hybrid Analysis Engine</span>. Get deep insights across 8 architectural metrics.</p>
                </div>
                <div className="flex flex-wrap gap-2 justify-center pt-2">
                    {['Static Audit', 'Logic Optimization', 'Interview Simulation', 'Beginner Mentorship'].map(m => (
                        <div key={m} className="px-3 py-1 bg-[#15181e] border border-[#262a33] rounded-full text-[10px] uppercase font-bold tracking-widest text-gray-600">
                            {m}
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    const { 
        overall_score, readability_score, performance_score, quality_score, bug_risk_score,
        maintainability_score, scalability_score, interview_readiness_score, code_level,
        issues, explanation, suggested_fixes, optimized_code, complexity, 
        comparison_metrics, best_practices, interview_insights, beginner_notes 
    } = results

    const scoreData = [
        { subject: 'Readability', A: readability_score, fullMark: 100 },
        { subject: 'Performance', A: performance_score, fullMark: 100 },
        { subject: 'Scalability', A: scalability_score || 50, fullMark: 100 },
        { subject: 'Maintainability', A: maintainability_score || 50, fullMark: 100 },
        { subject: 'Quality', A: quality_score, fullMark: 100 },
        { subject: 'Risk', A: 100 - bug_risk_score, fullMark: 100 },
    ]

    const getBadge = (score: number) => {
        if (score >= 85) return { text: "Industry Ready", icon: <ShieldCheck className="w-3.5 h-3.5" />, color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30", status: "Clean Code" }
        if (score >= 60) return { text: "Needs Polish", icon: <Layers className="w-3.5 h-3.5" />, color: "bg-amber-500/20 text-amber-400 border-amber-500/30", status: "Average" }
        return { text: "Critical Risk", icon: <AlertTriangle className="w-3.5 h-3.5" />, color: "bg-red-500/20 text-red-400 border-red-500/30", status: "Needs Work" }
    }

    const badge = getBadge(overall_score)

    const handleExport = () => {
        const text = `# CritiqueAI Review Report\n\n## Overall Score: ${overall_score}/100\n\n### Metrics\n- Readability: ${readability_score}\n- Performance: ${performance_score}\n- Interview Readiness: ${interview_readiness_score}\n\n### Complexity\n- Time: ${complexity?.time}\n- Space: ${complexity?.space}\n\n### Issues\n${issues.map(i => `- [${i.type}] ${i.description}\n  WHY: ${i.why_it_matters}\n  FIX: ${i.fix}`).join('\n')}`
        const blob = new Blob([text], { type: 'text/markdown' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'CritiqueAI-Mentor-Report.md'
        a.click()
        URL.revokeObjectURL(url)
    }

    return (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
            {/* Header / Badges */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className={`px-4 py-1.5 rounded-full border flex items-center gap-2 text-xs font-black uppercase tracking-widest ${badge.color} shadow-lg shadow-black/20`}>
                        {badge.icon}
                        {badge.status}: {badge.text}
                    </div>
                    <div className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-500">
                        {code_level} Level
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-tighter text-gray-600 mr-2">Powered by Hybrid Analysis (Static + AI)</span>
                    <button onClick={handleExport} className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5 text-gray-500 hover:text-white" title="Export Premium Report">
                        <Download className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-1 p-1 bg-[#161a24] border border-[#262a33] rounded-2xl w-fit">
                {[
                    { id: 'overview', label: 'Dashboard', icon: <BarChart3 className="w-4 h-4" />, title: 'High-level quality metrics' },
                    { id: 'comparison', label: 'Before vs After', icon: <Split className="w-4 h-4" />, title: 'See the optimized logic' },
                    { id: 'issues', label: 'Audit Log', icon: <Hash className="w-4 h-4" />, title: 'Security & Logic deep-dive' },
                    { id: 'mentor', label: 'Mentor Lab', icon: <GraduationCap className="w-4 h-4" />, title: 'Interview & Beginner guidance' },
                ].map((tab) => (
                    <button 
                      key={tab.id}
                      onClick={() => setActiveSection(tab.id as any)}
                      title={tab.title}
                      className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 ${activeSection === tab.id ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Sections */}
            {activeSection === 'overview' && (
                <div className="space-y-6 animate-in fade-in duration-500">
                    <div className="grid lg:grid-cols-2 gap-8 bg-[#161a24] border border-[#262a33] p-8 rounded-3xl shadow-2xl relative group overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] group-hover:bg-blue-500/10 transition-all rounded-full" />
                        
                        <div className="space-y-6 relative z-10">
                            <div className="space-y-1">
                                <div className="flex items-baseline gap-3">
                                    <h1 className="text-7xl font-black text-white tracking-tighter tabular-nums">{overall_score}</h1>
                                    <div className="space-y-1">
                                         <p className="text-gray-500 font-black uppercase tracking-[0.2em] text-[10px]">Quality Index</p>
                                         <div className="flex gap-1">
                                            {[1,2,3,4,5].map(i => <div key={i} className={`w-3 h-1 rounded-full ${overall_score >= i*20 ? 'bg-blue-500' : 'bg-white/10'}`} />)}
                                         </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-blue-500/10 to-transparent border-l-4 border-blue-500 p-4 rounded-r-xl">
                                <p className="text-sm font-medium text-blue-100 leading-relaxed italic">“{explanation}”</p>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                                        <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Performance</p>
                                    </div>
                                    <p className="text-2xl font-black font-mono text-emerald-400">{performance_score}%</p>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <BrainCircuit className="w-4 h-4 text-purple-400" />
                                        <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Interview Ready</p>
                                    </div>
                                    <p className="text-2xl font-black font-mono text-purple-400">{(interview_readiness_score || 0)}%</p>
                                </div>
                            </div>
                        </div>

                        <div className="h-[280px] flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={scoreData}>
                                    <PolarGrid stroke="#262a33" strokeDasharray="3 3" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 10, fontWeight: '900', letterSpacing: '0.1em' }} />
                                    <PolarRadiusAxis angle={30} domain={[0, 100]} axisLine={false} tick={false} />
                                    <Radar
                                        name="Score"
                                        dataKey="A"
                                        stroke="#3b82f6"
                                        fill="#3b82f6"
                                        fillOpacity={0.4}
                                        strokeWidth={3}
                                    />
                                    <Tooltip contentStyle={{ backgroundColor: '#1c2028', border: '1px solid #333a45', borderRadius: '12px' }} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { label: 'Maintainability', val: maintainability_score || 50, color: 'text-cyan-400' },
                            { label: 'Scalability', val: scalability_score || 50, color: 'text-indigo-400' },
                            { label: 'Readability', val: readability_score, color: 'text-emerald-400' },
                            { label: 'Risk Factor', val: bug_risk_score, color: 'text-red-400', inverse: true },
                        ].map(stat => (
                            <div key={stat.label} className="bg-[#15181e] border border-[#262a33] p-5 rounded-2xl space-y-3 shadow-xl">
                                <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">{stat.label}</p>
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className={`h-full ${stat.color.replace('text', 'bg')} transition-all duration-1000`} style={{ width: `${stat.inverse ? 100 - stat.val : stat.val}%` }} />
                                </div>
                                <div className="flex items-center justify-between">
                                     <p className={`text-xl font-black ${stat.color}`}>{stat.val}%</p>
                                     {stat.val > 70 ? <Zap className={`w-4 h-4 ${stat.color}`} /> : <Minimize2 className="w-4 h-4 text-gray-700" />}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeSection === 'comparison' && (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                    <div className="flex flex-wrap gap-4">
                        <div className="flex-1 bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-3xl flex items-center gap-6">
                            <div className="p-4 bg-emerald-500/20 rounded-2xl">
                                <TrendingUp className="w-8 h-8 text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase text-emerald-500 tracking-widest mb-1">Performance Gain</p>
                                <h4 className="text-4xl font-black text-emerald-200">+{comparison_metrics?.performance_improvement || 0}%</h4>
                            </div>
                        </div>
                        <div className="flex-1 bg-blue-500/10 border border-blue-500/20 p-6 rounded-3xl flex items-center gap-6">
                            <div className="p-4 bg-blue-500/20 rounded-2xl">
                                <Minimize2 className="w-8 h-8 text-blue-400" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase text-blue-500 tracking-widest mb-1">Code Reduction</p>
                                <h4 className="text-4xl font-black text-blue-200">{comparison_metrics?.lines_reduced || 0} Lines</h4>
                            </div>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-4 h-[600px]">
                         <div className="flex flex-col rounded-3xl border border-white/5 bg-[#0d1117] overflow-hidden">
                             <div className="px-5 py-3 bg-white/5 border-b border-white/5 flex items-center justify-between">
                                 <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Original Logic</span>
                                 <div className="w-2 h-2 rounded-full bg-red-500/50" />
                             </div>
                             <div className="flex-1 p-6 font-mono text-sm text-gray-500 overflow-auto scrollbar-hide grayscale opacity-60">
                                 {/* Original Snippet will be handled via Prop in Parent, but for Results we show original vs optimized */}
                                 <p className="italic text-xs mb-4">// Your submitted variant</p>
                                 <pre className="whitespace-pre-wrap">Code hidden for focus. Click optimized to see changes.</pre>
                             </div>
                         </div>
                         <div className="flex flex-col rounded-3xl border border-emerald-500/20 bg-[#0d1117] overflow-hidden shadow-2xl shadow-emerald-500/5">
                             <div className="px-5 py-3 bg-emerald-500/5 border-b border-emerald-500/10 flex items-center justify-between">
                                 <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Mentored Refactor</span>
                                 <div className="flex items-center gap-2">
                                     <Sparkles className="w-3 h-3 text-emerald-400" />
                                     <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                 </div>
                             </div>
                             <div className="flex-1 p-6 font-mono text-sm text-emerald-100/90 overflow-auto custom-scrollbar relative group">
                                 <button onClick={() => onCopy && onCopy(optimized_code)} className="absolute top-4 right-4 p-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/20 opacity-0 group-hover:opacity-100 transition-all">
                                     <ArrowRight className="w-4 h-4" />
                                 </button>
                                 <pre className="whitespace-pre-wrap">{optimized_code}</pre>
                             </div>
                         </div>
                    </div>

                    <div className="p-6 bg-[#15181e] border border-[#262a33] rounded-3xl space-y-4">
                         <div className="flex items-center gap-3">
                             <Target className="w-5 h-5 text-blue-400" />
                             <h4 className="text-xs font-black uppercase tracking-widest text-white">Rational for Optimization</h4>
                         </div>
                         <div className="prose prose-invert prose-sm max-w-none text-gray-300">
                              <ReactMarkdown remarkPlugins={[remarkGfm]}>{suggested_fixes}</ReactMarkdown>
                         </div>
                    </div>
                </div>
            )}

            {activeSection === 'issues' && (
                <div className="space-y-4 animate-in slide-in-from-right-4 duration-500">
                    <div className="flex items-center justify-between px-2">
                        <div className="space-y-1">
                            <h3 className="text-sm font-black uppercase tracking-widest text-white flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                Intelligent Hybrid Audit Log
                            </h3>
                            <p className="text-[10px] text-gray-500 font-bold uppercase max-w-lg leading-relaxed">
                                A comprehensive log of detected bugs, security vulnerabilities, and static analysis violations. 
                                We cross-match industrial static rules with LLM reasoning to ensure zero false positives.
                            </p>
                        </div>
                    </div>
                    
                    <div className="space-y-3">
                        {issues.map((issue, idx) => (
                            <div key={idx} className="bg-[#15181e] border border-[#262a33] rounded-3xl p-6 hover:border-gray-700 transition-all group relative overflow-hidden">
                                {issue.type === 'static_analysis' && (
                                    <div className="absolute top-0 right-0 px-3 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase border-b border-l border-[#262a33] tracking-tighter">
                                        Static Rule
                                    </div>
                                )}
                                <div className="flex items-start gap-6">
                                    <div className={`p-4 rounded-2xl ${issue.type === 'bug' ? 'bg-red-500/10 text-red-400' : issue.type === 'security' ? 'bg-orange-500/10 text-orange-400' : 'bg-blue-500/10 text-blue-400'}`}>
                                        <AlertTriangle className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1 space-y-4">
                                        <div>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 px-2 py-1 bg-white/5 rounded border border-white/5 mb-2 inline-block">
                                                {issue.type} {issue.line && `• Line ${issue.line}`}
                                            </span>
                                            <h4 className="text-xl font-bold text-white tracking-tight">{issue.description}</h4>
                                        </div>
                                        
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Why it matters</p>
                                                <p className="text-sm text-gray-400 leading-relaxed">{issue.why_it_matters}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Mentored Solution</p>
                                                <p className="text-sm text-emerald-100/70 leading-relaxed font-mono">{issue.fix}</p>
                                            </div>
                                        </div>

                                        <div className="pt-2">
                                             <div className="flex items-center gap-2 text-[10px] font-black uppercase text-blue-400 tracking-[0.2em] bg-blue-500/5 px-4 py-2 rounded-xl w-fit border border-blue-500/10">
                                                 <Target className="w-3 h-3" />
                                                 Impact: {issue.impact}
                                             </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeSection === 'mentor' && (
                <div className="space-y-8 animate-in zoom-in-95 duration-500">
                    {interview_insights && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-purple-500/10 rounded-xl border border-purple-500/20 shadow-lg shadow-purple-500/5">
                                    <BrainCircuit className="w-6 h-6 text-purple-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black uppercase tracking-tight text-white mb-0.5">Interview & Mentorship Lab</h3>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest max-w-lg leading-relaxed">
                                        Your personal space for interview preparation and beginner-friendly architectural guidance. 
                                        Understand the "Why" behind the logic and prepare for high-stakes technical rounds.
                                    </p>
                                </div>
                            </div>

                            <div className="grid gap-6">
                                <div className="bg-[#15181e] border border-[#262a33] p-8 rounded-3xl space-y-6 relative overflow-hidden group">
                                     <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:rotate-12 transition-transform">
                                          <Code2 className="w-32 h-32 text-purple-500" />
                                     </div>
                                     <div className="space-y-2 relative z-10">
                                         <h4 className="text-xs font-black text-purple-400 uppercase tracking-widest flex items-center gap-2">
                                             <Layers className="w-4 h-4" />
                                             Approach Comparison
                                         </h4>
                                         <div className="prose prose-invert prose-sm max-w-none text-gray-300 leading-loose">
                                              <ReactMarkdown remarkPlugins={[remarkGfm]}>{interview_insights.brute_force_vs_optimized}</ReactMarkdown>
                                         </div>
                                     </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                     <div className="bg-white/5 border border-white/10 p-6 rounded-3xl space-y-4">
                                          <h4 className="text-[10px] font-black text-white uppercase tracking-widest opacity-60">Expected Industry Approach</h4>
                                          <p className="text-sm text-gray-300 leading-relaxed font-semibold italic">“{interview_insights.expected_approach}”</p>
                                     </div>
                                     <div className="bg-purple-500/5 border border-purple-500/20 p-6 rounded-3xl space-y-4">
                                          <h4 className="text-[10px] font-black text-purple-400 uppercase tracking-widest transition-all">Interviewer Logic</h4>
                                          <p className="text-sm text-purple-100/80 leading-relaxed bg-purple-500/10 p-3 rounded-xl border border-purple-500/10">“{interview_insights.interviewer_feedback}”</p>
                                     </div>
                                </div>

                                <div className="bg-[#101217] border border-[#262a33] p-8 rounded-3xl">
                                    <div className="flex items-center justify-between mb-8">
                                         <h4 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                                             <HelpCircle className="w-5 h-5 text-blue-400" />
                                             Behavioral & Technical Follow-ups
                                         </h4>
                                         <span className="text-[10px] text-gray-600 font-bold uppercase tracking-tighter italic">Simulated Chat context active</span>
                                    </div>
                                    <div className="grid gap-3">
                                        {interview_insights.follow_up_questions.map((q, i) => (
                                            <div key={i} className="flex items-center gap-4 text-sm text-gray-300 p-4 bg-white/[0.02] rounded-2xl border border-white/5 group hover:bg-blue-600/5 hover:border-blue-500/20 transition-all cursor-help">
                                                <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-xs font-black text-blue-400 shrink-0 group-hover:scale-110 transition-transform">{i+1}</div>
                                                <p className="font-semibold">{q}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {beginner_notes && (
                        <div className="space-y-8">
                            <div className="flex items-center gap-4 p-8 bg-emerald-500/5 border border-emerald-500/10 rounded-[2rem]">
                                 <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20 shadow-2xl shadow-emerald-500/10">
                                      <GraduationCap className="w-10 h-10 text-emerald-400" />
                                 </div>
                                 <div className="space-y-1">
                                      <h3 className="text-2xl font-black text-white tracking-tight">Mentorship Pathway</h3>
                                      <p className="text-sm text-emerald-500/60 font-bold uppercase tracking-widest leading-none mt-1">First-Year Mastery Program</p>
                                 </div>
                            </div>

                            <div className="grid lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2 bg-[#15181e] border border-[#262a33] rounded-3xl p-8 space-y-6">
                                     <div className="space-y-2">
                                          <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest underline underline-offset-8">Mentor's Simplification</h4>
                                          <div className="prose prose-invert prose-sm max-w-none text-gray-300 leading-loose">
                                               <ReactMarkdown remarkPlugins={[remarkGfm]}>{beginner_notes.simple_explanation}</ReactMarkdown>
                                          </div>
                                     </div>
                                     <div className="p-6 bg-red-400/5 border border-red-400/10 rounded-2xl">
                                          <h4 className="text-xs font-bold text-red-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                              <AlertTriangle className="w-4 h-4" />
                                              Common Student Trap
                                          </h4>
                                          <p className="text-sm text-red-200/70 leading-relaxed font-medium italic">“{beginner_notes.common_mistakes}”</p>
                                     </div>
                                </div>

                                <div className="space-y-6">
                                     <div className="bg-blue-500/5 border border-blue-500/20 p-8 rounded-3xl space-y-4">
                                          <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Mastery Tip</h4>
                                          <p className="text-lg font-bold text-white leading-snug">“{beginner_notes.learning_tip}”</p>
                                     </div>
                                     <div className="bg-[#15181e] border border-[#262a33] p-8 rounded-3xl space-y-6">
                                          <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Foundation Concepts</h4>
                                          <div className="flex flex-wrap gap-2">
                                               {beginner_notes.key_concepts.map(c => (
                                                   <span key={c} className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-gray-400 tracking-wider shadow-inner">
                                                       {c}
                                                   </span>
                                               ))}
                                          </div>
                                     </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
