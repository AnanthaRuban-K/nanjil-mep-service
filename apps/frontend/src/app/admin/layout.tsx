// apps/frontend/src/app/admin/layout.tsx
'use client'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isSignedIn, user, isLoaded } = useUser()
  const router = useRouter()

  // For login page, always render without checks
  if (typeof window !== 'undefined' && window.location.pathname === '/admin/login') {
    return <>{children}</>
  }

  // Show loading while Clerk initializes
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl">Loading...</p>
        </div>
      </div>
    )
  }

  // If not signed in, redirect to login (but don't loop)
  if (!isSignedIn) {
    if (typeof window !== 'undefined' && window.location.pathname !== '/admin/login') {
      router.replace('/admin/login')
    }
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  // If signed in but not admin, redirect to login (but don't loop)
  if (user?.publicMetadata?.role !== 'admin') {
    if (typeof window !== 'undefined' && window.location.pathname !== '/admin/login') {
      router.replace('/admin/login')
    }
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl">Checking permissions...</p>
        </div>
      </div>
    )
  }

  // User is authenticated and admin, show content
  return <>{children}</>
}