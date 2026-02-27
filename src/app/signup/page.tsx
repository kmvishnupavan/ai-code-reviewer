"use client"

import { signup } from '@/app/actions/auth'
import Link from 'next/link'
import { useFormStatus } from 'react-dom'
import { useActionState } from 'react'

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg shadow-lg shadow-purple-500/25 transition-all mt-4"
        >
            {pending ? "Signing up..." : "Sign Up"}
        </button>
    )
}

export default function SignupPage() {
    const [state, formAction] = useActionState<{ error?: string }>(signup as any, {})

    return (
        <div className="flex h-[calc(100vh-4rem)] items-center justify-center p-4">
            <div className="w-full max-w-md bg-[#15181e] border border-[#262a33] rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                {/* Decorative background blur */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-purple-500/10 blur-3xl rounded-full pointer-events-none" />

                <div className="relative">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Create an account</h1>
                        <p className="text-gray-400 text-sm">Join to get instant AI-powered code reviews</p>
                    </div>

                    <form action={formAction} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-300" htmlFor="email">Email</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                placeholder="you@example.com"
                                className="w-full px-4 py-2.5 bg-[#1c2028] border border-[#333a45] rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 text-white placeholder-gray-500 transition-all"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-300" htmlFor="password">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="w-full px-4 py-2.5 bg-[#1c2028] border border-[#333a45] rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 text-white transition-all"
                            />
                        </div>

                        {state?.error && (
                            <p className="text-sm text-red-500 mt-2">{state.error}</p>
                        )}

                        <SubmitButton />
                    </form>

                    <p className="mt-8 text-center text-sm text-gray-400">
                        Already have an account?{' '}
                        <Link href="/login" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
