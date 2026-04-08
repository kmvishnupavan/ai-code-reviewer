"use client"

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import ReviewResults from '@/components/ReviewResults'
import { ArrowLeft, Clock, Calendar, Hash, Tag } from 'lucide-react'

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
            <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
                <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                <p className="text-gray-500 font-medium animate-pulse">Loading Review Data...</p>
            </div>
        )
    }

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-20">
            {/* Navigation Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <button
                    onClick={() => router.push('/dashboard/history')}
                    className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-white transition-all group w-fit"
                >
                    <div className="p-2 bg-white/5 rounded-lg group-hover:bg-blue-500/10 group-hover:text-blue-400 transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                    </div>
                    Back to History
                </button>

                <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-gray-500 bg-[#15181e] border border-[#262a33] px-4 py-2 rounded-xl">
                    <div className="flex items-center gap-1.5 border-r border-[#262a33] pr-4">
                        <Calendar className="w-3 h-3" />
                        {new Date(review.created_at).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1.5 border-r border-[#262a33] pr-4">
                        <Clock className="w-3 h-3" />
                        {new Date(review.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Tag className="w-3 h-3" />
                        {review.language}
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-2 gap-8 items-start">
                
                {/* Left side: Original Code Snippet */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                         <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                            <h3 className="text-sm font-black uppercase tracking-widest text-white">Submitted Code</h3>
                         </div>
                         <div className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[10px] text-gray-500 font-bold uppercase">
                            {review.id.slice(0, 8)}
                         </div>
                    </div>
                    <div className="bg-[#1e1e1e] border border-[#262a33] rounded-2xl overflow-hidden shadow-2xl">
                         <div className="border-b border-[#262a33] px-4 py-2 bg-[#15181e]/50 flex items-center justify-between">
                             <div className="flex gap-1.5">
                                 <div className="w-3 h-3 rounded-full bg-red-500/20" />
                                 <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                                 <div className="w-3 h-3 rounded-full bg-green-500/20" />
                             </div>
                             <span className="text-[10px] font-bold text-gray-600 uppercase tracking-tighter">Source Archive</span>
                         </div>
                         <pre className="p-6 text-sm font-mono text-gray-300 leading-relaxed overflow-auto max-h-[700px] custom-scrollbar selection:bg-blue-500/30">
                            <code>{review.code_snippet}</code>
                         </pre>
                    </div>
                </div>

                {/* Right side: Reusable Review results */}
                <div className="bg-[#101217] border border-[#262a33] rounded-2xl shadow-2xl p-6 min-h-[600px]">
                    <ReviewResults 
                        results={review} 
                        loading={false} 
                    />
                </div>

            </div>
        </div>
    )
}
