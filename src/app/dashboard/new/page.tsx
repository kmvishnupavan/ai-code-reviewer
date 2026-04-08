"use client"

import { useState, useRef, useEffect, useCallback } from 'react'
import CodeEditor from '@/components/CodeEditor'
import ReviewResults from '@/components/ReviewResults'
import { reviewCode, type ReviewResponse, type ReviewMode } from '@/app/actions/review'
import { askMentor } from '@/app/actions/chat'
import { Loader2, LayoutPanelLeft, Code2, Sparkles, BrainCircuit, Target, Zap, GraduationCap, ChevronDown, MessageSquare, Send, X, ShieldCheck, Trophy, Sparkle } from 'lucide-react'

// ... templates ...
const LANGUAGE_TEMPLATES: Record<string, string> = {
  javascript: `function calculateFibonacci(n) {\n  if (n <= 1) return n;\n  return calculateFibonacci(n-1) + calculateFibonacci(n-2);\n}`,
  typescript: `function calculateFibonacci(n: number): number {\n  if (n <= 1) return n;\n  return calculateFibonacci(n-1) + calculateFibonacci(n-2);\n}`,
  python: `def calculate_fibonacci(n):\n    if n <= 1:\n        return n\n    return calculate_fibonacci(n-1) + calculate_fibonacci(n-2)`,
  java: `public class Main {\n    public static int calculateFibonacci(int n) {\n        if (n <= 1) return n;\n        return calculateFibonacci(n-1) + calculateFibonacci(n-2);\n    }\n}`,
  cpp: `#include <iostream>\nint calculateFibonacci(int n) {\n    if (n <= 1) return n;\n    return calculateFibonacci(n-1) + calculateFibonacci(n-2);\n}`,
  go: `func calculateFibonacci(n int) int {\n    if n <= 1 { return n }\n    return calculateFibonacci(n-1) + calculateFibonacci(n-2)\n}`,
  rust: `fn calculate_fibonacci(n: u32) -> u32 {\n    if n <= 1 { return n }\n    calculate_fibonacci(n-1) + calculate_fibonacci(n-2)\n}`
};

export default function NewReviewPage() {
  const [language, setLanguage] = useState("javascript")
  const [mode, setMode] = useState<ReviewMode>("bug_detection")
  const [code, setCode] = useState(LANGUAGE_TEMPLATES["javascript"])
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<ReviewResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'editor' | 'results'>('editor')

  // Chat State
  const [showChat, setShowChat] = useState(false)
  const [chatInput, setChatInput] = useState('')
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'model', parts: { text: string }[] }[]>([])
  const [chatLoading, setChatLoading] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  const isFirstMount = useRef(true)

  const handleReview = useCallback(async () => {
    if (!code.trim()) return;
    setLoading(true)
    setError(null)
    setActiveTab('results') 
    setShowChat(false) // Reset chat for new review
    try {
      const reviewData = await reviewCode(code, language, mode)
      setResults(reviewData)
    } catch (err: any) {
      console.error(err)
      setError(err.message || "Something went wrong during the review.")
    } finally {
      setLoading(false)
    }
  }, [code, language, mode])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatHistory])

  const handleSendChat = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const userMsg = chatInput;
    setChatInput('')
    setChatHistory(prev => [...prev, { role: 'user', parts: [{ text: userMsg }] }])
    setChatLoading(true)
    try {
      const response = await askMentor(code, userMsg, chatHistory)
      setChatHistory(prev => [...prev, { role: 'model', parts: [{ text: response }] }])
    } catch (err) {
      setChatHistory(prev => [...prev, { role: 'model', parts: [{ text: 'Sorry, I am having trouble connecting to the mentor brain.' }] }])
    } finally {
      setChatLoading(false)
    }
  }

  const MODES = [
    { id: 'bug_detection', name: 'Bug Detection', icon: <Zap className="w-4 h-4" />, color: 'text-red-400' },
    { id: 'optimization', name: 'Optimization', icon: <Target className="w-4 h-4" />, color: 'text-blue-400' },
    { id: 'interview', name: 'Interview Prep', icon: <BrainCircuit className="w-4 h-4" />, color: 'text-purple-400' },
    { id: 'beginner', name: 'Beginner Helpful', icon: <GraduationCap className="w-4 h-4" />, color: 'text-green-400' },
  ] as const

  return (
    <div className="flex flex-col h-[calc(100vh-[12rem])] relative">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-4">
            <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic">CritiqueAI Mentor</h2>
            <div className="flex items-center gap-2 text-[10px] bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-full border border-emerald-500/20 font-black transition-all hover:bg-emerald-500/20">
                <ShieldCheck className="w-3 h-3" />
                Hybrid Analysis Engine Active
            </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="relative group">
            <select
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value)
                setCode(LANGUAGE_TEMPLATES[e.target.value])
              }}
              className="appearance-none bg-[#15181e] border border-[#262a33] text-sm rounded-xl pl-4 pr-10 py-2.5 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all cursor-pointer hover:border-gray-600 min-w-[140px] shadow-xl uppercase font-bold tracking-widest"
            >
              {Object.keys(LANGUAGE_TEMPLATES).map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>

          <div className="relative group">
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as ReviewMode)}
              className="appearance-none bg-[#15181e] border border-[#262a33] text-sm rounded-xl pl-10 pr-10 py-2.5 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all cursor-pointer hover:border-gray-600 min-w-[200px] shadow-xl"
            >
              {MODES.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none group-hover:scale-110 transition-transform">
               {MODES.find(m => m.id === mode)?.icon}
            </div>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>

          <button
            onClick={handleReview}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-black uppercase tracking-widest px-8 py-2.5 rounded-xl shadow-2xl shadow-blue-500/20 transition-all flex items-center gap-3 active:scale-95 group overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkle className="w-4 h-4" />}
            {loading ? 'Analyzing...' : 'Mentorship Run'}
          </button>
        </div>
      </div>

      {/* Split Layout */}
      <div className="grid lg:grid-cols-2 gap-6 flex-1 min-h-0">
        <div className={`flex flex-col h-full rounded-3xl overflow-hidden border border-[#262a33] bg-[#1e1e1e] shadow-2xl relative ${activeTab === 'editor' ? 'flex' : 'hidden lg:flex'}`}>
           <div className="border-b border-[#262a33] px-6 py-4 flex items-center justify-between bg-[#15181e]/80">
              <div className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/30" />
                 <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/30" />
                 <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/30" />
                 <span className="ml-2 text-[10px] font-black tracking-widest text-gray-500 uppercase">Interactive Terminal</span>
              </div>
           </div>
           <div className="flex-1">
            <CodeEditor code={code} onChange={(val) => setCode(val || "")} language={language} />
           </div>
        </div>

        {/* Results / Feedback */}
        <div className={`flex flex-col h-full ${activeTab === 'results' ? 'flex' : 'hidden lg:flex'}`}>
          <div className="flex-1 bg-[#101217] border border-[#262a33] rounded-[2rem] overflow-hidden shadow-2xl relative flex flex-col">
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <ReviewResults results={results} loading={loading} onCopy={(newCode) => setCode(newCode)} />
            </div>
            
            {/* AI Chat Button floating inside results */}
            {results && !loading && (
                 <button 
                   onClick={() => setShowChat(true)}
                   className="absolute bottom-8 right-8 w-14 h-14 bg-blue-600 rounded-2xl shadow-2xl shadow-blue-500/30 flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all z-20 group"
                 >
                    <MessageSquare className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                 </button>
            )}
          </div>
        </div>
      </div>

      {/* AI Mentor Side Chat Panel */}
      {showChat && (
          <div className="absolute inset-y-0 right-0 w-full sm:w-[400px] bg-[#161a24] border-l border-[#262a33] z-50 shadow-[-20px_0_60px_rgba(0,0,0,0.5)] animate-in slide-in-from-right duration-500 flex flex-col">
              <div className="p-6 border-b border-[#262a33] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 border border-blue-500/20">
                          <BrainCircuit className="w-5 h-5" />
                      </div>
                      <div>
                          <h4 className="text-sm font-black text-white uppercase tracking-tight">AI Mentor Chat</h4>
                          <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Context: Current Snippet</p>
                      </div>
                  </div>
                  <button onClick={() => setShowChat(false)} className="p-2 hover:bg-white/5 rounded-lg transition-colors text-gray-500 hover:text-white">
                      <X className="w-5 h-5" />
                  </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                  <div className="bg-blue-500/5 border border-blue-500/10 p-4 rounded-2xl text-[11px] text-blue-400/80 leading-relaxed italic">
                      "I'm analyze your current {language} code. Ask me anything about logic, complexity, or how to improve it!"
                  </div>
                  {chatHistory.map((chat, i) => (
                      <div key={i} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[85%] p-4 rounded-2xl text-xs leading-relaxed ${chat.role === 'user' ? 'bg-blue-600 text-white border-none shadow-lg' : 'bg-white/5 border border-white/5 text-gray-300'}`}>
                              {chat.parts[0].text}
                          </div>
                      </div>
                  ))}
                  {chatLoading && (
                      <div className="flex justify-start">
                          <div className="bg-white/5 border border-white/5 p-4 rounded-2xl flex gap-2">
                              <span className="w-1.5 h-1.5 bg-blue-500/50 rounded-full animate-bounce" />
                              <span className="w-1.5 h-1.5 bg-blue-500/50 rounded-full animate-bounce [animation-delay:0.2s]" />
                              <span className="w-1.5 h-1.5 bg-blue-500/50 rounded-full animate-bounce [animation-delay:0.4s]" />
                          </div>
                      </div>
                  )}
                  <div ref={chatEndRef} />
              </div>

              <div className="p-6 border-t border-[#262a33]">
                  <div className="relative group">
                      <input 
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                        placeholder="Ask your mentor..."
                        className="w-full bg-[#0d1117] border border-[#262a33] rounded-xl px-5 py-3.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all pr-12"
                      />
                      <button 
                        onClick={handleSendChat}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-blue-500 hover:text-blue-400 transition-colors"
                      >
                          <Send className="w-5 h-5" />
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  )
}
