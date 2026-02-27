import { createClient } from '@/utils/supabase/server'
import { Activity, Code2, AlertTriangle, Lightbulb, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default async function DashboardRoot() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    const { data: reviews } = await supabase
        .from('reviews')
        .select('*')
        .eq('user_id', user.id)

    const totalReviews = reviews?.length || 0

    let averageScore = 0
    let totalIssues = 0
    let totalTips = 0

    if (reviews && reviews.length > 0) {
        const sumScore = reviews.reduce((sum, r) => sum + r.score, 0)
        averageScore = Math.round(sumScore / reviews.length)

        totalIssues = reviews.reduce((sum, r) => {
            return sum + (r.syntax_errors?.length || 0) + (r.logic_flaws?.length || 0)
        }, 0)

        totalTips = reviews.reduce((sum, r) => sum + (r.optimization_tips?.length || 0), 0)
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Welcome to your Dashboard</h2>
                <p className="text-gray-400">Here's an overview of your code review activity.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-[#15181e] border border-[#262a33] p-6 rounded-xl relative overflow-hidden group hover:border-[#333a45] transition-colors shadow-sm">
                    <div className="flex items-center justify-between relative z-10">
                        <div>
                            <p className="text-sm font-medium text-gray-400 mb-1">Total Reviews</p>
                            <h3 className="text-3xl font-bold text-white">{totalReviews}</h3>
                        </div>
                        <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center">
                            <Code2 className="w-6 h-6 text-blue-500" />
                        </div>
                    </div>
                </div>

                <div className="bg-[#15181e] border border-[#262a33] p-6 rounded-xl relative overflow-hidden group hover:border-[#333a45] transition-colors shadow-sm">
                    <div className="flex items-center justify-between relative z-10">
                        <div>
                            <p className="text-sm font-medium text-gray-400 mb-1">Average Score</p>
                            <h3 className="text-3xl font-bold text-white tracking-tight">{averageScore}<span className="text-xl text-gray-500 font-normal">/100</span></h3>
                        </div>
                        <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center">
                            <Activity className="w-6 h-6 text-green-500" />
                        </div>
                    </div>
                </div>

                <div className="bg-[#15181e] border border-[#262a33] p-6 rounded-xl relative overflow-hidden group hover:border-[#333a45] transition-colors shadow-sm">
                    <div className="flex items-center justify-between relative z-10">
                        <div>
                            <p className="text-sm font-medium text-gray-400 mb-1">Issues Found</p>
                            <h3 className="text-3xl font-bold text-white">{totalIssues}</h3>
                        </div>
                        <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center">
                            <AlertTriangle className="w-6 h-6 text-red-500" />
                        </div>
                    </div>
                </div>

                <div className="bg-[#15181e] border border-[#262a33] p-6 rounded-xl relative overflow-hidden group hover:border-[#333a45] transition-colors shadow-sm">
                    <div className="flex items-center justify-between relative z-10">
                        <div>
                            <p className="text-sm font-medium text-gray-400 mb-1">Optimization Tips</p>
                            <h3 className="text-3xl font-bold text-white">{totalTips}</h3>
                        </div>
                        <div className="w-12 h-12 bg-yellow-500/10 rounded-full flex items-center justify-center">
                            <Lightbulb className="w-6 h-6 text-yellow-500" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <Link
                    href="/dashboard/new"
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium p-6 rounded-xl flex items-center gap-4 transition-all shadow-lg shadow-blue-500/20 group"
                >
                    <div className="bg-white/10 p-3 rounded-lg group-hover:bg-white/20 transition-colors">
                        <Code2 className="w-6 h-6" />
                    </div>
                    <div className="text-left flex-1">
                        <h4 className="text-lg font-bold">Start a New Review</h4>
                        <p className="text-blue-100/70 text-sm mt-0.5">Submit code to the AI for instant feedback.</p>
                    </div>
                </Link>

                <Link
                    href="/dashboard/history"
                    className="bg-[#15181e] hover:bg-[#1c2028] border border-[#262a33] text-white font-medium p-6 rounded-xl flex items-center gap-4 transition-all group"
                >
                    <div className="bg-gray-800 p-3 rounded-lg group-hover:bg-gray-700 transition-colors border border-gray-700">
                        <TrendingUp className="w-6 h-6 text-gray-300" />
                    </div>
                    <div className="text-left flex-1">
                        <h4 className="text-lg font-bold">View Review History</h4>
                        <p className="text-gray-400 text-sm mt-0.5">Check out your past optimizations and scores.</p>
                    </div>
                </Link>
            </div>
        </div>
    )
}
