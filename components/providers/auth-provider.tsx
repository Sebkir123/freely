'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name?: string) => Promise<void>
  signOut: () => Promise<void>
  signInWithProvider: (provider: 'google' | 'github') => Promise<void>
  updateProfile: (data: { name?: string; avatar_url?: string }) => Promise<void>
  isAuthenticated: boolean
  isSupabaseEnabled: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const isSupabaseEnabled = isSupabaseConfigured()

  useEffect(() => {
    if (!isSupabaseEnabled) {
      // Local mode - use mock user
      const localUser = localStorage.getItem('freely-local-user')
      if (localUser) {
        try {
          setUser(JSON.parse(localUser))
        } catch (e) {
          console.error('Failed to parse local user:', e)
        }
      }
      setLoading(false)
      return
    }

    // Supabase mode
    const supabase = createClient()

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)

      // Refresh the page to update server-side session
      if (_event === 'SIGNED_IN' || _event === 'SIGNED_OUT') {
        router.refresh()
      }
    })

    return () => subscription.unsubscribe()
  }, [router, isSupabaseEnabled])

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseEnabled) {
      // Local mode - mock sign in
      const mockUser = {
        id: 'local-user',
        email,
        user_metadata: { name: email.split('@')[0] },
        app_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString()
      } as User

      setUser(mockUser)
      localStorage.setItem('freely-local-user', JSON.stringify(mockUser))
      toast.success('Signed in (Local Mode)')
      router.push('/workspace')
      return
    }

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      toast.error('Sign in failed', {
        description: error.message
      })
      throw error
    }

    toast.success('Signed in successfully!')
    router.push('/workspace')
  }

  const signUp = async (email: string, password: string, name?: string) => {
    if (!isSupabaseEnabled) {
      // Local mode - mock sign up
      const mockUser = {
        id: 'local-user',
        email,
        user_metadata: { name: name || email.split('@')[0] },
        app_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString()
      } as User

      setUser(mockUser)
      localStorage.setItem('freely-local-user', JSON.stringify(mockUser))
      toast.success('Account created (Local Mode)')
      router.push('/workspace')
      return
    }

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name || email.split('@')[0]
        }
      }
    })

    if (error) {
      toast.error('Sign up failed', {
        description: error.message
      })
      throw error
    }

    toast.success('Account created!', {
      description: 'Please check your email to verify your account'
    })
    router.push('/workspace')
  }

  const signOut = async () => {
    if (!isSupabaseEnabled) {
      // Local mode - clear local storage
      localStorage.removeItem('freely-local-user')
      setUser(null)
      toast.success('Signed out (Local Mode)')
      router.push('/')
      return
    }

    const supabase = createClient()
    const { error } = await supabase.auth.signOut()

    if (error) {
      toast.error('Sign out failed', {
        description: error.message
      })
      throw error
    }

    toast.success('Signed out successfully')
    router.push('/')
  }

  const signInWithProvider = async (provider: 'google' | 'github') => {
    if (!isSupabaseEnabled) {
      toast.error('Social sign-in not available in local mode', {
        description: 'Please configure Supabase to use social authentication'
      })
      return
    }

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })

    if (error) {
      toast.error('Social sign-in failed', {
        description: error.message
      })
      throw error
    }
  }

  const updateProfile = async (data: { name?: string; avatar_url?: string }) => {
    if (!isSupabaseEnabled) {
      // Local mode - update local storage
      if (user) {
        const updatedUser = {
          ...user,
          user_metadata: {
            ...user.user_metadata,
            ...data
          }
        }
        setUser(updatedUser)
        localStorage.setItem('freely-local-user', JSON.stringify(updatedUser))
        toast.success('Profile updated (Local Mode)')
      }
      return
    }

    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({
      data
    })

    if (error) {
      toast.error('Profile update failed', {
        description: error.message
      })
      throw error
    }

    toast.success('Profile updated successfully!')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        signInWithProvider,
        updateProfile,
        isAuthenticated: !!user,
        isSupabaseEnabled
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Protected route wrapper component
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return <>{children}</>
}
