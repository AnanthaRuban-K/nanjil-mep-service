'use client'
import React from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'

interface RoleGuardProps {
  children: React.ReactNode
  allowedRoles: ('admin' | 'customer' | 'technician')[]
  fallback?: React.ReactNode
  redirectTo?: string
}

export function RoleGuard({ 
  children, 
  allowedRoles, 
  fallback,
  redirectTo 
}: RoleGuardProps) {
  const { user, isLoaded, role } = useAuth()
  const router = useRouter()

  // Show loading state
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">அனுமதிகளை சரிபார்க்கிறோம் • Checking permissions...</p>
        </div>
      </div>
    )
  }

  // User not logged in
  if (!user) {
    if (redirectTo) {
      router.push(redirectTo)
      return null
    }
    
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            உள்நுழைவு தேவை • Login Required
          </h2>
          <p className="text-gray-600 mb-6">
            இந்த பக்கத்தை அணுக நீங்கள் உள்நுழைய வேண்டும் • You need to login to access this page
          </p>
          <button
            onClick={() => router.push('/sign-in')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            உள்நுழை • Login
          </button>
        </div>
      </div>
    )
  }

  // User doesn't have required role
  if (role && !allowedRoles.includes(role)) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-red-600 mb-4">
            அணுகல் மறுக்கப்பட்டது • Access Denied
          </h2>
          <p className="text-gray-600 mb-6">
            இந்த பக்கத்தை அணுக உங்களுக்கு அனுமति இல்லை • You don't have permission to access this page
          </p>
          <button
            onClick={() => router.push('/')}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
          >
            முகப்புக்கு செல் • Go Home
          </button>
        </div>
      </div>
    )
  }

  // User has access
  return <>{children}</>
}