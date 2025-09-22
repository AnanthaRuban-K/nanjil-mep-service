'use client'
import DescribeService from '@/components/booking/DescribeService'
import { RoleGuard } from '@/components/RoleGuard'


export default function DescribePage() {
  return (
    <RoleGuard 
      allowedRoles={['customer', 'admin']}
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              உள்நுழைவு தேவை • Login Required
            </h2>
            <p className="text-gray-600 mb-6">
              சேவை விவரம் கொடுக்க உள்நுழைய வேண்டும்
            </p>
            <button
              onClick={() => window.location.href = '/sign-in'}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              உள்நுழை • Login
            </button>
          </div>
        </div>
      }
    >
      <DescribeService />
    </RoleGuard>
  )
}