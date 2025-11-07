'use client'

import { useState } from 'react'
import { useAuth } from '@/components/providers/auth-provider'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  User,
  Settings,
  LogOut,
  CreditCard,
  Bell,
  HelpCircle,
  Shield
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface UserMenuProps {
  onOpenSettings?: () => void
}

export function UserMenu({ onOpenSettings }: UserMenuProps) {
  const { user, signOut, isSupabaseEnabled } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  if (!user) return null

  const getInitials = () => {
    const name = user.user_metadata?.name || user.email || 'U'
    return name
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getAvatarUrl = () => {
    return user.user_metadata?.avatar_url
  }

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full p-0 hover:ring-2 hover:ring-purple-500 hover:ring-offset-2 transition-all"
        >
          {getAvatarUrl() ? (
            <img
              src={getAvatarUrl()}
              alt={user.user_metadata?.name || 'User'}
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            <div className="h-full w-full rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-sm">
              {getInitials()}
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-64" align="end">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user.user_metadata?.name || 'User'}
            </p>
            <p className="text-xs leading-none text-slate-500">
              {user.email}
            </p>
            {!isSupabaseEnabled && (
              <span className="inline-flex items-center px-2 py-0.5 mt-1 rounded text-xs font-medium bg-amber-100 text-amber-800">
                Local Mode
              </span>
            )}
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={onOpenSettings}>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={onOpenSettings}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>

        {isSupabaseEnabled && (
          <>
            <DropdownMenuItem>
              <Bell className="mr-2 h-4 w-4" />
              <span>Notifications</span>
            </DropdownMenuItem>

            <DropdownMenuItem>
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Billing</span>
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <HelpCircle className="mr-2 h-4 w-4" />
          <span>Help & Support</span>
        </DropdownMenuItem>

        <DropdownMenuItem>
          <Shield className="mr-2 h-4 w-4" />
          <span>Privacy</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleSignOut}
          className="text-red-600 focus:text-red-600 focus:bg-red-50"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Account Settings Component
export function AccountSettings() {
  const { user, updateProfile, isSupabaseEnabled } = useAuth()
  const [name, setName] = useState(user?.user_metadata?.name || '')
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    try {
      await updateProfile({ name })
    } catch (error) {
      console.error('Profile update error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Account Settings</h2>
        <p className="text-slate-600 mt-1">Manage your account information and preferences</p>
      </div>

      <div className="space-y-6">
        {/* Profile Picture */}
        <div className="flex items-center gap-6 p-6 bg-white rounded-lg border">
          <div className="relative">
            {user.user_metadata?.avatar_url ? (
              <img
                src={user.user_metadata.avatar_url}
                alt={name}
                className="h-20 w-20 rounded-full object-cover"
              />
            ) : (
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-2xl">
                {name
                  .split(' ')
                  .map((n: string) => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2)}
              </div>
            )}
          </div>

          <div className="flex-1">
            <h3 className="font-semibold text-slate-900">Profile Picture</h3>
            <p className="text-sm text-slate-600 mt-1">
              Update your profile picture to personalize your account
            </p>
            <Button variant="outline" size="sm" className="mt-3">
              Change Photo
            </Button>
          </div>
        </div>

        {/* Personal Information */}
        <div className="p-6 bg-white rounded-lg border space-y-4">
          <h3 className="font-semibold text-slate-900">Personal Information</h3>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Your name"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full px-3 py-2 border rounded-lg bg-slate-50 text-slate-600 cursor-not-allowed"
            />
            <p className="text-xs text-slate-500">
              Email cannot be changed
            </p>
          </div>

          <Button
            onClick={handleSave}
            disabled={loading}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>

        {/* Account Status */}
        <div className="p-6 bg-white rounded-lg border space-y-4">
          <h3 className="font-semibold text-slate-900">Account Status</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-600">Account Type</p>
              <p className="font-medium">
                {isSupabaseEnabled ? 'Cloud Account' : 'Local Account'}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-600">Member Since</p>
              <p className="font-medium">
                {new Date(user.created_at || '').toLocaleDateString()}
              </p>
            </div>
          </div>

          {!isSupabaseEnabled && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">
                <strong>Local Mode:</strong> Your data is stored locally on this device.
                Configure Supabase to sync across devices.
              </p>
            </div>
          )}
        </div>

        {/* Danger Zone */}
        <div className="p-6 bg-white rounded-lg border border-red-200 space-y-4">
          <h3 className="font-semibold text-red-900">Danger Zone</h3>
          <p className="text-sm text-slate-600">
            Irreversible and destructive actions
          </p>

          <Button variant="outline" className="text-red-600 border-red-300 hover:bg-red-50">
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  )
}
