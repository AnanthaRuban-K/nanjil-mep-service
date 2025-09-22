'use client'
import { AdminDashboard } from '@/components/admin/AdminDashboard'
import { RoleGuard } from '@/components/RoleGuard'
import AdminHeader from '@/components/AdminHeader'

export default function AdminDashboardPage() {
  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="min-h-screen bg-gray-50">
        
        <AdminDashboard />
      </div>
    </RoleGuard>
  )
}
