import { createClient } from '@/utils/supabase/server'
import { Activity, Code2, AlertTriangle, Lightbulb, TrendingUp, Trophy, BrainCircuit, Target, Sparkles } from 'lucide-react'
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
        const sumScore = reviews.reduce((sum, r) => sum + (r.overall_score || 0), 0)
        averageScore = Math.round(sumScore / reviews.length)

        totalIssues = reviews.reduce((sum, r) => {
            return sum + (r.issues?.length || 0)
        }, 0)

        totalTips = reviews.reduce((sum, r) => sum + (r.best_practices?.length || 0), 0)
    }

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            <div>
                <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">Mentor Dashboard</h1>
                <p className="text-gray-400 font-medium">Track your personal coding growth and review history.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-[#15181e] border border-[#262a33] p-6 rounded-[2rem] relative overflow-hidden group hover:border-gray-700 transition-all shadow-xl">
                    <div className="flex items-center justify-between relative z-10">
                        <div>
                            <p className="text-[10px] font-black text-gray-500 mb-1 uppercase tracking-widest">Audits Completed</p>
                            <h3 className="text-4xl font-black text-white tracking-tighter tabular-nums">{totalReviews}</h3>
                        </div>
                        <div className="w-14 h-14 bg-blue-500/5 rounded-2xl flex items-center justify-center border border-blue-500/10">
                            <Code2 className="w-7 h-7 text-blue-500/60" />
                        </div>
                    </div>
                </div>

                <div className="bg-[#15181e] border border-[#262a33] p-6 rounded-[2rem] relative overflow-hidden group hover:border-gray-700 transition-all shadow-xl">
                    <div className="flex items-center justify-between relative z-10">
                        <div>
                            <p className="text-[10px] font-black text-gray-500 mb-1 uppercase tracking-widest">Avg Quality Index</p>
                            <h3 className="text-4xl font-black text-white tracking-tighter tabular-nums">{averageScore}<span className="text-lg text-gray-600 ml-1 font-bold">/100</span></h3>
                        </div>
                        <div className="w-14 h-14 bg-emerald-500/5 rounded-2xl flex items-center justify-center border border-emerald-500/10">
                            <Activity className="w-7 h-7 text-emerald-500/60" />
                        </div>
                    </div>
                </div>

                <div className="bg-[#15181e] border border-[#262a33] p-6 rounded-[2rem] relative overflow-hidden group hover:border-gray-700 transition-all shadow-xl">
                    <div className="flex items-center justify-between relative z-10">
                        <div>
                            <p className="text-[10px] font-black text-gray-500 mb-1 uppercase tracking-widest">Bugs Prevented</p>
                            <h3 className="text-4xl font-black text-white tracking-tighter tabular-nums">{totalIssues}</h3>
                        </div>
                        <div className="w-14 h-14 bg-red-500/5 rounded-2xl flex items-center justify-center border border-red-500/10">
                            <AlertTriangle className="w-7 h-7 text-red-500/60" />
                        </div>
                    </div>
                </div>

                <div className="bg-[#15181e] border border-[#262a33] p-6 rounded-[2rem] relative overflow-hidden group hover:border-gray-700 transition-all shadow-xl">
                    <div className="flex items-center justify-between relative z-10">
                        <div>
                            <p className="text-[10px] font-black text-gray-500 mb-1 uppercase tracking-widest">Industry Tips</p>
                            <h3 className="text-4xl font-black text-white tracking-tighter tabular-nums">{totalTips}</h3>
                        </div>
                        <div className="w-14 h-14 bg-amber-500/5 rounded-2xl flex items-center justify-center border border-amber-500/10">
                            <Lightbulb className="w-7 h-7 text-amber-500/60" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-8 bg-blue-600/5 border border-blue-500/10 rounded-[2.5rem] flex flex-col md:flex-row items-center gap-8 justify-between">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-600/20 rotate-3">
                         <BrainCircuit className="w-8 h-8 text-white" />
                    </div>
                    <div className="space-y-1">
                         <h4 className="text-xl font-black text-white tracking-tight uppercase italic">Placement AI Assistant</h4>
                         <p className="text-sm text-gray-500 font-medium">Use the "Interview Mode" to simulate real-world technical assessments.</p>
                    </div>
                </div>
                <Link href="/dashboard/history" className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all">
                     Review Success Log
                </Link>
            </div>
        </div>
    )
}
