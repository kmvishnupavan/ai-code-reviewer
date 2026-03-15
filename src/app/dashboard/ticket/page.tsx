"use client"

import { useState } from 'react'
import { LifeBuoy, Send, CheckCircle2, Paperclip } from 'lucide-react'

export default function TicketPage() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [ticketId, setTicketId] = useState('')
    const [fileName, setFileName] = useState('')

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)

        // Mock backend submission
        await new Promise(resolve => setTimeout(resolve, 1500))

        const mockTicketId = `TIC-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`
        setTicketId(mockTicketId)
        setIsSubmitting(false)
        setIsSubmitted(true)
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFileName(e.target.files[0].name)
        } else {
            setFileName('')
        }
    }

    if (isSubmitted) {
        return (
            <div className="max-w-2xl mx-auto space-y-6">
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight drop-shadow-sm">Support Center</h2>

                <div className="glass-panel p-12 rounded-3xl text-center shadow-[0_8px_30px_rgba(0,0,0,0.04)] animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="w-20 h-20 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner border border-emerald-100/50">
                        <CheckCircle2 className="w-10 h-10 text-emerald-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Ticket Submitted Successfully</h3>
                    <p className="text-slate-500 mb-6 font-medium text-lg">Thank you for reaching out. Our team will review your request shortly.</p>

                    <div className="bg-white/60 border border-slate-200 rounded-xl p-4 inline-block shadow-sm">
                        <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">Your Ticket ID</p>
                        <p className="text-2xl font-black text-blue-600 tracking-widest">{ticketId}</p>
                    </div>

                    <div className="mt-8">
                        <button
                            onClick={() => setIsSubmitted(false)}
                            className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
                        >
                            Submit another ticket
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6 pb-12">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight drop-shadow-sm">Raise a Ticket</h2>

            <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100 shrink-0 shadow-sm">
                        <LifeBuoy className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 drop-shadow-sm">How can we help?</h3>
                        <p className="text-sm text-slate-500 font-medium">Please provide details about the issue you are facing.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700" htmlFor="title">Issue Title</label>
                        <input
                            id="title"
                            name="title"
                            type="text"
                            required
                            placeholder="Briefly describe the issue"
                            className="w-full px-4 py-3 bg-white/60 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-slate-900 placeholder-slate-400 transition-all font-medium shadow-sm backdrop-blur-sm"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700" htmlFor="category">Issue Category</label>
                        <div className="relative">
                            <select
                                id="category"
                                name="category"
                                required
                                className="w-full px-4 py-3 bg-white/60 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-slate-900 appearance-none transition-all font-medium shadow-sm backdrop-blur-sm cursor-pointer"
                            >
                                <option value="" disabled selected>Select a category</option>
                                <option value="Chatbot Error">Chatbot Error</option>
                                <option value="Incorrect Review">Incorrect Review</option>
                                <option value="Performance Issue">Performance Issue</option>
                                <option value="Other">Other</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                                <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700" htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            required
                            rows={5}
                            placeholder="Provide as much detail as possible..."
                            className="w-full px-4 py-3 bg-white/60 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-slate-900 placeholder-slate-400 transition-all font-medium custom-scrollbar shadow-sm backdrop-blur-sm resize-none"
                        ></textarea>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Upload Screenshot (Optional)</label>
                        <div className="relative">
                            <input
                                type="file"
                                id="screenshot"
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                            <label
                                htmlFor="screenshot"
                                className="flex items-center gap-2 w-full px-4 py-3 bg-white/40 hover:bg-white/60 border border-dashed border-slate-300 rounded-xl cursor-pointer transition-colors shadow-inner"
                            >
                                <Paperclip className="w-5 h-5 text-slate-400" />
                                <span className="text-slate-500 font-medium truncate">
                                    {fileName ? fileName : 'Click to upload a file...'}
                                </span>
                            </label>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-200/50">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="glow-btn w-full sm:w-auto bg-gradient-to-r from-blue-600 via-indigo-500 to-violet-600 hover:scale-[1.02] text-white font-bold py-3 px-8 rounded-xl transition-transform flex items-center justify-center gap-2 disabled:opacity-50 ml-auto shadow-[0_0_15px_rgba(59,130,246,0.4)]"
                        >
                            {isSubmitting ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Send className="w-4 h-4" />
                                    Submit Ticket
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
