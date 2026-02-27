"use client"

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { User, Mail, Lock, CheckCircle2, AlertTriangle, Loader2, Code2 } from 'lucide-react'
import { updateProfile } from '@/app/actions/auth'

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<'overview' | 'security'>('overview')
    const [stats, setStats] = useState({ total: 0, avgScore: 0 })

    // Form states
    const [isPending, setIsPending] = useState(false)
    const [message, setMessage] = useState<{ success?: string, error?: string } | null>(null)

    useEffect(() => {
        const fetchUserData = async () => {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()

            if (user) {
                setUser(user)
                // Fetch stats
                const { data } = await supabase
                    .from('reviews')
                    .select('score')
                    .eq('user_id', user.id)

                if (data && data.length > 0) {
                    const totalScore = data.reduce((sum, r) => sum + r.score, 0)
                    setStats({
                        total: data.length,
                        avgScore: Math.round(totalScore / data.length)
                    })
                }
            }
            setLoading(false)
        }
        fetchUserData()
    }, [])

    const handleUpdateCredentials = async (formData: FormData) => {
        setIsPending(true)
        setMessage(null)

        try {
            const result = await updateProfile(formData)
            setMessage(result)
        } catch (error) {
            setMessage({ error: "Failed to update profile." })
        } finally {
            setIsPending(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold text-white tracking-tight">Account Settings</h2>

            <div className="flex gap-4 border-b border-[#262a33]">
                <button
                    onClick={() => setActiveTab('overview')}
                    className={`pb-4 px-2 text-sm font-medium transition-colors relative ${activeTab === 'overview' ? 'text-blue-400' : 'text-gray-400 hover:text-white'}`}
                >
                    Overview
                    {activeTab === 'overview' && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 rounded-t-full" />
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('security')}
                    className={`pb-4 px-2 text-sm font-medium transition-colors relative ${activeTab === 'security' ? 'text-blue-400' : 'text-gray-400 hover:text-white'}`}
                >
                    Security
                    {activeTab === 'security' && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 rounded-t-full" />
                    )}
                </button>
            </div>

            {activeTab === 'overview' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-[#15181e] border border-[#262a33] p-8 rounded-2xl flex items-center gap-6">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl text-white font-bold shrink-0">
                            {user?.email?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-white">{user?.email?.split('@')[0]}</h3>
                            <div className="flex items-center gap-2 text-gray-400 text-sm mt-1">
                                <Mail className="w-4 h-4" />
                                {user?.email}
                            </div>
                            <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-green-500/10 text-green-400 text-xs font-medium border border-green-500/20">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Active Account
                            </div>
                        </div>
                    </div>

                    <h3 className="text-lg font-medium text-white mb-4">Your Progress</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-[#15181e] border border-[#262a33] p-6 rounded-2xl flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm font-medium">Total Code Reviews</p>
                                <p className="text-3xl font-bold text-white mt-1">{stats.total}</p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                                <Code2 className="w-6 h-6 text-blue-400" />
                            </div>
                        </div>
                        <div className="bg-[#15181e] border border-[#262a33] p-6 rounded-2xl flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm font-medium">Average Authored Quality</p>
                                <p className="text-3xl font-bold text-white mt-1">{stats.avgScore}</p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20">
                                <AlertTriangle className="w-6 h-6 text-green-400" />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'security' && (
                <div className="bg-[#15181e] border border-[#262a33] rounded-2xl p-6 sm:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center border border-red-500/20 shrink-0">
                            <Lock className="w-5 h-5 text-red-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-medium text-white">Security Settings</h3>
                            <p className="text-sm text-gray-400">Update your email or password.</p>
                        </div>
                    </div>

                    {message?.success && (
                        <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-lg flex items-start gap-3 mb-6">
                            <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                            <p className="text-sm text-green-400">{message.success}</p>
                        </div>
                    )}

                    {message?.error && (
                        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg flex items-start gap-3 mb-6">
                            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                            <p className="text-sm text-red-400">{message.error}</p>
                        </div>
                    )}

                    <form action={handleUpdateCredentials} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-300" htmlFor="email">New Email Address</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder={user?.email}
                                className="w-full px-4 py-2.5 bg-[#1c2028] border border-[#333a45] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-white placeholder-gray-500 transition-all"
                            />
                            <p className="text-xs text-gray-500">Leave blank if you don't want to change it.</p>
                        </div>

                        <div className="space-y-1.5 pt-2">
                            <label className="text-sm font-medium text-gray-300" htmlFor="password">New Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                autoComplete="new-password"
                                className="w-full px-4 py-2.5 bg-[#1c2028] border border-[#333a45] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-white placeholder-gray-500 transition-all"
                            />
                        </div>

                        <div className="pt-4 border-t border-[#262a33]">
                            <button
                                disabled={isPending}
                                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 ml-auto"
                            >
                                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    )
}
