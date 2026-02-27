import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import LiveBackground from '@/components/LiveBackground'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Code Reviewer',
  description: 'An industry-grade AI-powered code reviewer built for students.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen pt-16`}>
        <LiveBackground />
        <header className="fixed top-0 w-full h-16 border-b border-[#262a33] bg-[#0f1115]/80 backdrop-blur-md z-50 flex items-center px-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
              AI
            </div>
            <h1 className="text-xl font-semibold tracking-tight text-white drop-shadow-sm">Code Reviewer</h1>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              GitHub
            </a>
          </div>
        </header>
        <main className="max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8 h-[calc(100vh-4rem)]">
          {children}
        </main>
      </body>
    </html>
  )
}
