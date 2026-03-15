"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { createClient } from '@/utils/supabase/client'

export interface UserDetails {
    email?: string;
    username?: string;
    id?: string;
}

interface UserContextType {
    user: UserDetails | null;
    updateUser: (user: UserDetails) => void;
    refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType>({ user: null, updateUser: () => { }, refreshUser: async () => { } })

export function UserProvider({ children, initialUser }: { children: ReactNode, initialUser: any }) {
    const defaultDetails = initialUser ? {
        email: initialUser.email,
        username: initialUser.user_metadata?.username || initialUser.email?.split('@')[0],
        id: initialUser.id
    } : null;

    const [user, setUser] = useState<UserDetails | null>(defaultDetails)
    const supabase = createClient()

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                if (session?.user) {
                    setUser({
                        email: session.user.email,
                        username: session.user.user_metadata?.username || session.user.email?.split('@')[0],
                        id: session.user.id
                    })
                } else {
                    setUser(null)
                }
            }
        )

        return () => subscription.unsubscribe()
    }, [supabase.auth])

    const updateUser = (newUser: UserDetails) => {
        setUser(newUser)
    }

    const refreshUser = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            setUser({
                email: user.email,
                username: user.user_metadata?.username || user.email?.split('@')[0],
                id: user.id
            })
        }
    }

    return (
        <UserContext.Provider value={{ user, updateUser, refreshUser }}>
            {children}
        </UserContext.Provider>
    )
}

export function useUser() {
    return useContext(UserContext)
}
