// apps/frontend/src/app/admin/dashboard/page.tsx
'use client'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AdminDashboard() {
  const { user, isLoaded } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/admin/login')
    }
  }, [isLoaded, user, router])

  if (!isLoaded) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <div>Redirecting...</div>
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <p>Welcome, {user.firstName || user.emailAddresses[0]?.emailAddress}</p>
    </div>
  )
}