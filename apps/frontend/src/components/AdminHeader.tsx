// apps/frontend/src/components/AdminHeader.tsx
'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useClerk, useUser } from '@clerk/nextjs'
import { 
  Shield, 
  LogOut, 
  User as UserIcon, 
  Home,
  Bell,
  Loader
} from 'lucide-react'
import NotificationBell from './NotificationBell'
interface AdminHeaderProps {
  title?: string
  subtitle?: string
}

export default function AdminHeader({ 
  title = "நாஞ்சில் MEP Admin Dashboard", 
  subtitle = "நிர்வாக பொரிவு" 
}: AdminHeaderProps) {
  const router = useRouter()
  const { signOut } = useClerk()
  const { user } = useUser()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      
      // Sign out from Clerk
      await signOut()
      
      // Immediate redirect to home - don't wait for auth state updates
      window.location.href = '/'
      
    } catch (error) {
      console.error('Logout failed:', error)
      setIsLoggingOut(false)
      
      // Fallback logout method
      window.location.href = '/api/auth/logout'
    }
  }

  const handleGoHome = () => {
    router.push('/')
  }

  return (
    <header className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Title */}
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-br from-blue-100 to-indigo-100 p-2 rounded-lg">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{title}</h1>
              <p className="text-sm text-gray-600">{subtitle}</p>
            </div>
          </div>

          {/* Right side - User info and actions */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <NotificationBell />

            {/* User info */}
            <div className="flex items-center space-x-3 bg-gray-50 rounded-lg px-3 py-2">
              <div className="bg-blue-100 p-1 rounded-full">
                <UserIcon className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-sm">
                <p className="font-medium text-gray-900">
                  {user?.firstName || user?.emailAddresses[0]?.emailAddress?.split('@')[0] || 'Admin'}
                </p>
                <p className="text-gray-500 text-xs">
                  {(user?.publicMetadata?.role as string) || 'admin'}
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handleGoHome}
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title="Go to Home"
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:block text-sm">Home</span>
              </button>

              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex items-center space-x-2 px-3 py-2 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Logout"
              >
                {isLoggingOut ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <LogOut className="w-4 h-4" />
                )}
                <span className="hidden sm:block text-sm">
                  {isLoggingOut ? 'Logging out...' : 'வெளியேறு / Logout'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}