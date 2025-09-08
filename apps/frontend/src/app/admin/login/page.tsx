// apps/frontend/src/app/admin/login/page.tsx
'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser, SignIn } from '@clerk/nextjs'
import { Shield, ArrowLeft, Loader, AlertTriangle } from 'lucide-react'

export default function AdminLogin() {
  const router = useRouter()
  const { isSignedIn, user, isLoaded } = useUser()
  const [isClientMounted, setIsClientMounted] = useState(false)
  const [authState, setAuthState] = useState<'loading' | 'login' | 'checking' | 'denied' | 'redirecting'>('loading')

  // Ensure hydration safety - only run client logic after mount
  useEffect(() => {
    setIsClientMounted(true)
  }, [])

  // Handle authentication logic only after client mount
  useEffect(() => {
    if (!isClientMounted || !isLoaded) return

    if (!isSignedIn) {
      setAuthState('login')
      return
    }

    if (isSignedIn && user) {
      setAuthState('checking')
      
      // Check admin role
      const userRole = user.publicMetadata?.role as string
      
      if (userRole === 'admin') {
        setAuthState('redirecting')
        router.replace('/admin/dashboard')
      } else {
        setAuthState('denied')
      }
    }
  }, [isClientMounted, isLoaded, isSignedIn, user, router])

  // Always render the same loading state during SSR and initial hydration
  if (!isClientMounted || !isLoaded || authState === 'loading' || authState === 'checking') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
          <div className="bg-blue-100 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <Loader className="w-10 h-10 text-blue-600 animate-spin" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Loading Admin Portal
          </h2>
          <p className="text-gray-600">
            நிர்வாக போர்ட்டல் ஏற்றுகிறது...
          </p>
        </div>
      </div>
    )
  }

  // Redirecting state
  if (authState === 'redirecting') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
          <div className="bg-green-100 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <Shield className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Access Granted
          </h2>
          <p className="text-gray-600">
            Redirecting to dashboard...
          </p>
        </div>
      </div>
    )
  }

  // Access denied state
  if (authState === 'denied') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
          <div className="bg-red-100 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <AlertTriangle className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-6">
            நிர்வாக அணுகல் தேவை / Admin access required
          </p>
          <div className="space-y-3">
            <button
              onClick={() => router.push('/')}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
            >
              முகப்பு செல்ல / Go to Home
            </button>
            <button
              onClick={() => window.location.href = '/api/auth/logout'}
              className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
            >
              வேறு கணக்கில் உள்நுழை / Try Different Account
            </button>
          </div>
          
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-xs text-yellow-800">
                <strong>Dev Mode:</strong> Current role: {(user?.publicMetadata?.role as string) || 'none'}<br/>
                Set role to 'admin' in Clerk dashboard under public metadata
              </p>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Login form state
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-blue-100 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <Shield className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            நிர்வாக உள்நுழைவு
          </h1>
          <p className="text-gray-600">Admin Portal</p>
          <p className="text-sm text-gray-500 mt-2">
            நாஞ்சில் MEP சேவை நிர்வாக அணுகல்
          </p>
        </div>

        {/* Clerk Sign In Component */}
        <div className="mb-6">
          <SignIn
            routing="hash"
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "shadow-none border-0 p-0",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton: "bg-gray-50 border border-gray-300 hover:bg-gray-100 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors",
                formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors w-full",
                formFieldInput: "border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full",
                formFieldLabel: "text-sm font-medium text-gray-700 mb-2 block",
                footerActionLink: "text-blue-600 hover:text-blue-800 font-medium",
              }
            }}
            afterSignInUrl="/admin/login"
            signUpUrl="/sign-up"
          />
        </div>

        {/* Back Button */}
        <div className="text-center">
          <button
            onClick={() => router.push('/')}
            className="text-gray-500 hover:text-gray-700 text-sm flex items-center justify-center space-x-2 mx-auto transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>முகப்பு செல்ல / Back to Home</span>
          </button>
        </div>

        {/* Development Note */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs text-yellow-800">
              <strong>Dev Mode:</strong><br/>
              1. Sign in with any account<br/>
              2. Go to Clerk dashboard<br/>
              3. Add to public metadata: {`{"role": "admin"}`}<br/>
              4. Refresh this page
            </p>
          </div>
        )}
      </div>
    </div>
  )
}