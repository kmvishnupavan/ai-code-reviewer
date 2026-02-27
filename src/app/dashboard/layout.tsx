import Sidebar from '@/components/Sidebar'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    return (
        <div className="flex h-[calc(100vh-4rem)]">
            <Sidebar />
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                <div className="max-w-[1600px] mx-auto h-full">
                    {/* Add a welcome greeting to the top of all dashboard pages */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-white tracking-tight">Welcome, {user.email?.split('@')[0]}</h1>
                            <p className="text-gray-400 text-sm mt-1">Here is your code review workspace.</p>
                        </div>

                        <div className="px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-medium">
                            Pro Plan
                        </div>
                    </div>

                    {children}
                </div>
            </div>
        </div>
    )
}
