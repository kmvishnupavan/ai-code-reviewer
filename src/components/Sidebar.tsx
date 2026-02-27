"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, History, Code2, LogOut, User } from 'lucide-react'
import { logout } from '@/app/actions/auth'

export default function Sidebar() {
  const pathname = usePathname()

  const navLinks = [
    { title: 'Dashboard', href: '/dashboard', icon: Home },
    { title: 'New Review', href: '/dashboard/new', icon: Code2 },
    { title: 'History', href: '/dashboard/history', icon: History },
    { title: 'Profile', href: '/dashboard/profile', icon: User },
  ]

  return (
    <aside className="w-64 h-full bg-[#15181e] border-r border-[#262a33] flex flex-col">
      <div className="p-6 border-b border-[#262a33]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shrink-0">
            AI
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-white drop-shadow-sm">Reviewer</h1>
        </div>
      </div>

      <nav className="flex-1 py-6 px-4 space-y-2">
        {navLinks.map((link) => {
          const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== '/dashboard' && link.href !== '/dashboard/new')
          return (
            <Link
              key={link.title}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive
                ? 'bg-blue-500/10 text-blue-400 font-medium'
                : 'text-gray-400 hover:text-white hover:bg-[#1c2028]'
                }`}
            >
              <link.icon className="w-5 h-5" />
              {link.title}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-[#262a33] space-y-2">
        <form action={logout}>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors">
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </form>
      </div>
    </aside >
  )
}
