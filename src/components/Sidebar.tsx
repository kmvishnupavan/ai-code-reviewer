"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, History, Code2, LogOut, User, BrainCircuit } from 'lucide-react'
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
    <aside className="w-64 h-full bg-[#15181e] border-r border-[#262a33] flex flex-col shadow-2xl">
      <div className="p-6 border-b border-[#262a33]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tighter text-white uppercase italic leading-none">CritiqueAI</h1>
            <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mt-1">Mentor Edition</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 py-6 px-4 space-y-2">
        {navLinks.map((link) => {
          const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== '/dashboard' && link.href !== '/dashboard/new')
          return (
            <Link
              key={link.title}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 ${isActive
                ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/10'
                : 'text-gray-500 hover:text-white hover:bg-white/5'
                }`}
            >
              <link.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-white'}`} />
              {link.title}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-[#262a33]">
        <form action={logout}>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all font-bold">
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </form>
      </div>
    </aside >
  )
}
