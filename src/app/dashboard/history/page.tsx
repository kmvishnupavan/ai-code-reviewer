import { createClient } from '@/utils/supabase/server'
import { FileCode2, Clock, CheckCircle2, AlertTriangle, ChevronRight } from 'lucide-react'
import Link from 'next/link'

export default async function HistoryPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    const { data: reviews, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    if (error) {
        return (
            <div className="bg-[#15181e] border border-red-500/20 p-6 rounded-xl">
                <p className="text-red-400">Failed to load review history: {error.message}</p>
            </div>
        )
    }

    if (!reviews || reviews.length === 0) {
        return (
            <div className="bg-[#15181e] border border-[#262a33] p-12 rounded-xl text-center">
                <div className="w-16 h-16 bg-[#1c2028] rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileCode2 className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-medium text-white mb-2">No reviews yet</h3>
                <p className="text-gray-400 mb-6">You haven't submitted any code for review yet.</p>
                <Link
                    href="/dashboard/new"
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors"
                >
                    Start new review
                </Link>
            </div>
        )
    }

    return (
        <div className="space-y-6 flex flex-col h-[calc(100vh-[12rem])]">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-medium text-white/90">Review History</h2>
                <Link
                    href="/dashboard/new"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/20 text-blue-400 rounded-lg text-sm font-medium transition-colors"
                >
                    New Review
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 overflow-y-auto pb-8">
                {reviews.map((review) => {
                    const isGood = review.score >= 80
                    const isOk = review.score >= 50 && review.score < 80

                    return (
                        <Link href={`/dashboard/history/${review.id}`} key={review.id} className="bg-[#15181e] border border-[#262a33] hover:border-gray-600 rounded-xl p-6 transition-all group flex flex-col max-h-[400px] cursor-pointer block text-left">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border-2 ${isGood ? 'border-green-500/30 text-green-500 bg-green-500/10' :
                                        isOk ? 'border-yellow-500/30 text-yellow-500 bg-yellow-500/10' :
                                            'border-red-500/30 text-red-500 bg-red-500/10'
                                        }`}>
                                        {review.score}
                                    </div>
                                    <div>
                                        <h3 className="text-white font-medium capitalize">{review.language}</h3>
                                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                            <Clock className="w-3.5 h-3.5" />
                                            {new Date(review.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
                            </div>

                            <div className="flex-1 overflow-hidden relative mb-4">
                                {/* Fade out bottom of code snippet */}
                                <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#1c2028] to-transparent z-10" />
                                <pre className="p-4 bg-[#1c2028] rounded-lg text-xs text-gray-300 font-mono h-full overflow-hidden whitespace-pre-wrap break-words">
                                    {review.code_snippet}
                                </pre>
                            </div>

                            <div className="grid grid-cols-2 gap-2 mt-auto">
                                <div className="bg-[#1c2028] rounded-md px-3 py-2 flex items-center justify-between">
                                    <span className="text-xs text-gray-400">Issues</span>
                                    <span className="text-sm font-medium text-red-400 flex items-center gap-1">
                                        <AlertTriangle className="w-3.5 h-3.5" />
                                        {(review.syntax_errors?.length || 0) + (review.logic_flaws?.length || 0)}
                                    </span>
                                </div>
                                <div className="bg-[#1c2028] rounded-md px-3 py-2 flex items-center justify-between">
                                    <span className="text-xs text-gray-400">Tips</span>
                                    <span className="text-sm font-medium text-blue-400 flex items-center gap-1">
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        {review.optimization_tips?.length || 0}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    )
                })}
            </div>
        </div >
    )
}
