'use client'
import React from 'react'
import { useAuth } from '@/hooks/useAuth'
import { LogIn, User, LogOut } from 'lucide-react'

interface LoginButtonProps {
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  showUser?: boolean
}

export function LoginButton({ 
  variant = 'default', 
  size = 'md',
  showUser = true 
}: LoginButtonProps) {
  const { user, isSignedIn, login, logout, isLoggingOut } = useAuth()

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  }

  const variantClasses = {
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    outline: 'border border-blue-600 text-blue-600 hover:bg-blue-50',
    ghost: 'text-blue-600 hover:bg-blue-50'
  }

  if (isSignedIn && user) {
    return (
      <div className="flex items-center space-x-2">
        {showUser && (
          <div className="flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-1">
            <User className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-700">{user.name}</span>
          </div>
        )}
        <button
          onClick={() => logout()}
          disabled={isLoggingOut}
          className={`flex items-center space-x-2 ${sizeClasses[size]} bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50`}
        >
          <LogOut className="w-4 h-4" />
          <span>{isLoggingOut ? 'Logging out...' : 'வெளியேறு'}</span>
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => login()}
      className={`flex items-center space-x-2 ${sizeClasses[size]} ${variantClasses[variant]} rounded-lg transition-colors`}
    >
      <LogIn className="w-4 h-4" />
      <span>உள்நுழை • Login</span>
    </button>
  )
}