"use client"

import { useState } from 'react'
import CodeEditor from '@/components/CodeEditor'
import ReviewResults from '@/components/ReviewResults'
import { reviewCode, type ReviewResponse } from '@/app/actions/review'
import { Loader2, LayoutPanelLeft, Code2, Sparkles } from 'lucide-react'

const LANGUAGE_TEMPLATES: Record<string, string> = {
  javascript: `// Write some code here to get ai feedback!
function calculateFibonacci(n) {
  if (n <= 1) return n;
  return calculateFibonacci(n-1) + calculateFibonacci(n-2);
}

console.log(calculateFibonacci(10));`,
  typescript: `// Write some code here to get ai feedback!
function calculateFibonacci(n: number): number {
  if (n <= 1) return n;
  return calculateFibonacci(n-1) + calculateFibonacci(n-2);
}

console.log(calculateFibonacci(10));`,
  python: `# Write some code here to get ai feedback!
def calculate_fibonacci(n):
    if n <= 1:
        return n
    return calculate_fibonacci(n-1) + calculate_fibonacci(n-2)

print(calculate_fibonacci(10))`,
  java: `// Write some code here to get ai feedback!
public class Main {
    public static int calculateFibonacci(int n) {
        if (n <= 1) return n;
        return calculateFibonacci(n-1) + calculateFibonacci(n-2);
    }

    public static void main(String[] args) {
        System.out.println(calculateFibonacci(10));
    }
}`,
  cpp: `// Write some code here to get ai feedback!
#include <iostream>

int calculateFibonacci(int n) {
    if (n <= 1) return n;
    return calculateFibonacci(n-1) + calculateFibonacci(n-2);
}

int main() {
    std::cout << calculateFibonacci(10) << std::endl;
    return 0;
}`,
  go: `// Write some code here to get ai feedback!
package main

import "fmt"

func calculateFibonacci(n int) int {
    if n <= 1 {
        return n
    }
    return calculateFibonacci(n-1) + calculateFibonacci(n-2)
}

func main() {
    fmt.Println(calculateFibonacci(10))
}`,
  rust: `// Write some code here to get ai feedback!
fn calculate_fibonacci(n: u32) -> u32 {
    if n <= 1 {
        return n;
    }
    calculate_fibonacci(n-1) + calculate_fibonacci(n-2)
}

fn main() {
    println!("{}", calculate_fibonacci(10));
}`
};

export default function NewReviewPage() {
  const [language, setLanguage] = useState("javascript")
  const [code, setCode] = useState(LANGUAGE_TEMPLATES["javascript"])
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<ReviewResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Tab state for mobile/smaller screens
  const [activeTab, setActiveTab] = useState<'editor' | 'results'>('editor')

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    setCode(LANGUAGE_TEMPLATES[newLang] || "");
  }

  const handleReview = async () => {
    if (!code.trim()) return;

    setLoading(true)
    setError(null)
    setActiveTab('results') // Switch to results tab automatically when analyzing

    try {
      const reviewData = await reviewCode(code, language)
      setResults(reviewData)
    } catch (err: any) {
      console.error(err)
      setError(err.message || "Something went wrong during the review.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-[12rem])]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-medium text-white/90">New Code Review</h2>

        <div className="flex flex-wrap gap-3">
          <select
            value={language}
            onChange={handleLanguageChange}
            className="bg-[#15181e] border border-[#262a33] text-sm rounded-lg px-4 py-2 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-shadow"
          >
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
            <option value="go">Go</option>
            <option value="rust">Rust</option>
          </select>
          <button
            onClick={handleReview}
            disabled={loading}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium px-5 py-2 rounded-lg shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Review Code
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg text-sm mb-6">
          {error}
        </div>
      )}

      {/* Tabs for mobile, Hidden on Desktop */}
      <div className="flex lg:hidden bg-[#15181e] border border-[#262a33] rounded-t-xl p-1 mb-2">
        <button
          onClick={() => setActiveTab('editor')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-all ${activeTab === 'editor' ? 'bg-[#262a33] text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
        >
          <Code2 className="w-4 h-4" />
          Editor
        </button>
        <button
          onClick={() => setActiveTab('results')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-all ${activeTab === 'results' ? 'bg-[#262a33] text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
        >
          <LayoutPanelLeft className="w-4 h-4" />
          Results
        </button>
      </div>

      {/* Split Pane Layout */}
      <div className="grid lg:grid-cols-2 gap-6 flex-1 min-h-0">

        {/* Editor Pane */}
        <div className={`flex flex-col h-full rounded-b-xl lg:rounded-xl overflow-hidden border border-[#262a33] drop-shadow-xl bg-[#1e1e1e] ${activeTab === 'editor' ? 'flex' : 'hidden lg:flex'}`}>
          <div className="flex-1 min-h-[400px]">
            <CodeEditor
              code={code}
              onChange={(val) => setCode(val || "")}
              language={language}
            />
          </div>
        </div>

        {/* Results Pane */}
        <div className={`flex flex-col h-full ${activeTab === 'results' ? 'flex' : 'hidden lg:flex'}`}>
          <div className="flex-1 bg-[#15181e] border border-[#262a33] rounded-xl p-6 overflow-y-auto">
            <ReviewResults results={results} loading={loading} />
          </div>
        </div>

      </div>
    </div>
  )
}
