"use client"

import { useUser } from '@/context/UserContext'

export default function DashboardHeader() {
    const { user } = useUser()

    return (
        <div className="flex items-center justify-between mb-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                    Welcome, <span className="text-gradient hover:drop-shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all cursor-default">{user?.username || 'User'}</span>
                </h1>
                <p className="text-slate-500 text-sm mt-1">Here is your code review workspace.</p>
            </div>

            <div className="px-4 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-full text-blue-700 text-sm font-semibold shadow-[0_0_15px_rgba(59,130,246,0.15)] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                Free Trial
            </div>
        </div>
    )
}
