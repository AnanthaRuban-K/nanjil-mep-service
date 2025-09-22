// File: app/admin/layout.tsx - Production Admin Layout
'use client'
import React from 'react'
import { RoleGuard } from '@/components/RoleGuard'
import AdminHeader from '@/components/AdminHeader'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'

// Create a client for admin-specific data
const adminQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000, // 30 seconds
      refetchInterval: 30000, // Auto-refresh every 30 seconds
      retry: 3,
      refetchOnWindowFocus: true,
    },
    mutations: {
      retry: 1,
    },
  },
})

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <RoleGuard 
      allowedRoles={['admin']}
      fallback={<AdminAccessDenied />}
    >
      <QueryClientProvider client={adminQueryClient}>
        <div className="min-h-screen bg-gray-50">
          <AdminHeader />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </div>
      </QueryClientProvider>
    </RoleGuard>
  )
}

// Access Denied Component
function AdminAccessDenied() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-red-600 mb-4">
          அணுகல் மறுக்கப்பட்டது • Access Denied
        </h2>
        <p className="text-gray-600 mb-6">
          நிர்வாக பேனலை அணுக உங்களுக்கு அனுமति இல்லை<br />
          You don't have permission to access the admin panel
        </p>
        <div className="space-y-3">
          <button
            onClick={() => window.location.href = '/'}
            className="w-full bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            முகப்புக்கு செல் • Go Home
          </button>
          <button
            onClick={() => window.location.href = '/sign-in'}
            className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            நிர்வாகியாக உள்நுழை • Login as Admin
          </button>
        </div>
      </div>
    </div>
  )
}