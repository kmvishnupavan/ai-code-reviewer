"use client"

import { resetPassword } from '@/app/actions/auth'
import { useState, useTransition } from 'react'
import Link from 'next/link'
import { CheckCircle2, Loader2, ArrowLeft } from 'lucide-react'

export default function ResetPasswordPage() {
    const [isPending, startTransition] = useTransition()
    const [message, setMessage] = useState<{ success?: string, error?: string } | null>(null)

    const handleSubmit = (formData: FormData) => {
        startTransition(async () => {
            const result = await resetPassword(formData)
            if (result) setMessage(result)
        })
    }

    return (
        <div className="flex h-[calc(100vh-4rem)] items-center justify-center p-4">
            <div className="w-full max-w-md bg-[#15181e] border border-[#262a33] rounded-2xl p-8 shadow-2xl relative overflow-hidden">

                <div className="relative">
                    <Link href="/login" className="inline-flex items-center text-sm text-gray-400 hover:text-white mb-6 group transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                        Back to login
                    </Link>

                    <div className="mb-8">
                        <h1 className="text-2xl font-bold tracking-tight text-white mb-2">Reset Password</h1>
                        <p className="text-gray-400 text-sm">Enter your email address and we'll send you a link to reset your password.</p>
                    </div>

                    {message?.success ? (
                        <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-lg flex items-start gap-3 mb-6">
                            <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                            <p className="text-sm text-green-400">{message.success}</p>
                        </div>
                    ) : (
                        <form action={handleSubmit} className="space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-gray-300" htmlFor="email">Email</label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    placeholder="you@example.com"
                                    className="w-full px-4 py-2.5 bg-[#1c2028] border border-[#333a45] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-white placeholder-gray-500 transition-all"
                                />
                            </div>

                            {message?.error && (
                                <div className="text-sm text-red-400 mt-2">{message.error}</div>
                            )}

                            <button
                                disabled={isPending}
                                className="w-full bg-[#262a33] hover:bg-[#333a45] text-white font-medium py-2.5 rounded-lg transition-colors mt-4 flex items-center justify-center disabled:opacity-50"
                            >
                                {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send Reset Link"}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}
