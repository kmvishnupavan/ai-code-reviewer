"use client"

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { ArrowLeft, Clock, CheckCircle2, AlertTriangle, Code2 } from 'lucide-react'
import {
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function HistoryDetailsPage() {
    const params = useParams()
    const router = useRouter()
    const [review, setReview] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchReview = async () => {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                router.push('/login')
                return
            }

            const { data, error } = await supabase
                .from('reviews')
                .select('*')
                .eq('id', params.id)
                .single()

            if (error || !data || data.user_id !== user.id) {
                router.push('/dashboard/history')
                return
            }

            setReview(data)
            setLoading(false)
        }

        fetchReview()
    }, [params.id, router])

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        )
    }

    // Prepare data for Radar Chart (Overview of Quality)
    const syntaxScore = Math.max(0, 100 - (review.syntax_errors?.length || 0) * 15)
    const logicScore = Math.max(0, 100 - (review.logic_flaws?.length || 0) * 20)
    const optimizationScore = Math.min(100, 50 + (review.optimization_tips?.length || 0) * 10)

    const radarData = [
        { subject: 'Overall Score', A: review.score, fullMark: 100 },
        { subject: 'Syntax Health', A: syntaxScore, fullMark: 100 },
        { subject: 'Logical Soundness', A: logicScore, fullMark: 100 },
        { subject: 'Optimization Level', A: optimizationScore, fullMark: 100 },
        { subject: 'Best Practices', A: review.score > 80 ? 95 : 60, fullMark: 100 },
    ]

    // Prepare data for Bar Chart (Heatmap of Issues vs Tips)
    const barData = [
        {
            name: 'Metrics',
            Errors: review.syntax_errors?.length || 0,
            Flaws: review.logic_flaws?.length || 0,
            Tips: review.optimization_tips?.length || 0,
        }
    ]

    const isGood = review.score >= 80

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-12">
            <button
                onClick={() => router.push('/dashboard/history')}
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors group"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to History
            </button>

            <div className="bg-[#15181e] border border-[#262a33] rounded-2xl p-6 sm:p-8 relative overflow-hidden">
                {/* Score Background Glow */}
                <div className={`absolute -top-24 -right-24 w-64 h-64 rounded-full blur-[100px] opacity-20 pointer-events-none ${isGood ? 'bg-green-500' : 'bg-blue-500'}`} />

                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-bold text-white tracking-tight">Review Analytics</h1>
                            <span className="px-3 py-1 bg-[#1c2028] text-gray-300 text-xs font-medium rounded-full border border-[#333a45] capitalize">
                                {review.language}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Clock className="w-4 h-4" />
                            {new Date(review.created_at).toLocaleString()}
                        </div>
                    </div>

                    <div className="flex items-center gap-4 bg-[#1c2028] p-4 rounded-xl border border-[#333a45]">
                        <div className="text-center px-4 border-r border-[#333a45]">
                            <div className={`text-3xl font-black ${isGood ? 'text-green-500' : 'text-blue-500'}`}>
                                {review.score}
                            </div>
                            <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mt-1">Score</div>
                        </div>
                        <div className="text-center px-4">
                            <div className="text-2xl font-bold text-red-400">
                                {(review.syntax_errors?.length || 0) + (review.logic_flaws?.length || 0)}
                            </div>
                            <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mt-1">Issues</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Radar Chart */}
                <div className="bg-[#15181e] border border-[#262a33] rounded-2xl p-6">
                    <h3 className="text-lg font-medium text-white mb-6">Code Quality Matrix</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                                <PolarGrid stroke="#333a45" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                <Radar
                                    name="Quality"
                                    dataKey="A"
                                    stroke={isGood ? "#10b981" : "#3b82f6"}
                                    fill={isGood ? "#10b981" : "#3b82f6"}
                                    fillOpacity={0.3}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1c2028', borderColor: '#333a45', color: '#fff', borderRadius: '8px' }}
                                    itemStyle={{ color: isGood ? "#10b981" : "#3b82f6" }}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Heatmap Bar Chart */}
                <div className="bg-[#15181e] border border-[#262a33] rounded-2xl p-6">
                    <h3 className="text-lg font-medium text-white mb-6">Distribution Map</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={barData}
                                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                                maxBarSize={60}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#333a45" vertical={false} />
                                <XAxis dataKey="name" stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
                                <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    contentStyle={{ backgroundColor: '#1c2028', borderColor: '#333a45', color: '#fff', borderRadius: '8px' }}
                                />
                                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                <Bar dataKey="Errors" stackId="a" fill="#ef4444" radius={[0, 0, 4, 4]} />
                                <Bar dataKey="Flaws" stackId="a" fill="#f59e0b" />
                                <Bar dataKey="Tips" stackId="a" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Original Code Review Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-[#15181e] border border-[#262a33] rounded-2xl p-6 flex flex-col">
                    <div className="flex items-center gap-2 mb-4">
                        <Code2 className="w-5 h-5 text-gray-400" />
                        <h3 className="text-lg font-medium text-white">Submitted Code</h3>
                    </div>
                    <div className="flex-1 bg-[#0f1115] border border-[#262a33] rounded-xl overflow-hidden">
                        <pre className="p-4 text-sm text-gray-300 font-mono overflow-auto h-full max-h-[500px]">
                            {review.code_snippet}
                        </pre>
                    </div>
                </div>

                <div className="bg-[#15181e] border border-[#262a33] rounded-2xl p-6 overflow-hidden flex flex-col">
                    <h3 className="text-lg font-medium text-white mb-4">AI Feedback</h3>
                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6 max-h-[500px]">

                        {review.syntax_errors && review.syntax_errors.length > 0 && (
                            <div className="space-y-3">
                                <h4 className="flex items-center gap-2 text-sm font-semibold text-red-500 uppercase tracking-wider">
                                    <AlertTriangle className="w-4 h-4" /> Syntax Errors
                                </h4>
                                <ul className="space-y-2">
                                    {review.syntax_errors.map((err: string, i: number) => (
                                        <li key={i} className="text-sm text-gray-300 bg-red-500/10 border border-red-500/20 p-3 rounded-lg leading-relaxed">
                                            {err}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {review.optimization_tips && review.optimization_tips.length > 0 && (
                            <div className="space-y-3">
                                <h4 className="flex items-center gap-2 text-sm font-semibold text-blue-500 uppercase tracking-wider">
                                    <CheckCircle2 className="w-4 h-4" /> Recommended Tips
                                </h4>
                                <div className="space-y-3">
                                    {review.optimization_tips.map((tip: string, i: number) => (
                                        <div key={i} className="text-sm text-gray-300 bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg leading-relaxed prose prose-invert prose-p:my-1 prose-pre:bg-[#0f1115] prose-pre:border prose-pre:border-[#262a33] max-w-none">
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{tip}</ReactMarkdown>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    )
}
