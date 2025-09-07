// apps/frontend/src/app/admin/dashboard/page.tsx - FIXED TYPE CONFLICTS
'use client'
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAdminStore } from '../../../stores/adminStore'
import { useAuthStore } from '../../../stores/authStore'
import { 
  Calendar, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  TrendingUp,
  Users,
  Phone,
  MapPin
} from 'lucide-react'

// Use 'any' type temporarily to avoid conflicts, or match your store's exact type
type BookingFromStore = any

export default function AdminDashboard() {
  const router = useRouter()
  const { allBookings, metrics, isLoading, fetchBookings, fetchMetrics, updateBookingStatus } = useAdminStore()
  const { user, isAdmin } = useAuthStore()

  useEffect(() => {
    // Check if user is admin
    if (!user || !isAdmin) {
      router.push('/admin/login')
      return
    }

    // Fetch initial data
    fetchMetrics()
    fetchBookings()
  }, [user, isAdmin, router, fetchMetrics, fetchBookings])

  const handleStatusUpdate = async (bookingId: string, newStatus: string) => {
    try {
      await updateBookingStatus(bookingId, newStatus)
    } catch (error) {
      alert('Failed to update status: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  const handleViewAllBookings = () => {
    router.push('/admin/bookings')
  }

  if (isLoading && !metrics) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-gray-200 h-24 rounded-lg"></div>
            ))}
          </div>
          <div className="bg-gray-200 h-64 rounded-lg"></div>
        </div>
      </div>
    )
  }

  // Get recent urgent bookings with safe property access
  const urgentBookings = allBookings
    ?.filter((booking: BookingFromStore) => 
      booking?.priority === 'emergency' || 
      (booking?.priority === 'urgent' && booking?.status !== 'completed')
    )
    ?.slice(0, 5) || []

  const statusColors = {
    pending: 'text-yellow-600 bg-yellow-100',
    confirmed: 'text-blue-600 bg-blue-100',
    in_progress: 'text-purple-600 bg-purple-100',
    completed: 'text-green-600 bg-green-100',
    cancelled: 'text-red-600 bg-red-100'
  }

  const priorityColors = {
    emergency: 'text-red-600 bg-red-100 border-red-300',
    urgent: 'text-orange-600 bg-orange-100 border-orange-300',
    normal: 'text-gray-600 bg-gray-100 border-gray-300'
  }

  // Helper function to safely get status color
  const getStatusColor = (status: string) => {
    return statusColors[status as keyof typeof statusColors] || 'text-gray-600 bg-gray-100'
  }

  // Helper function to safely get priority color
  const getPriorityColor = (priority: string) => {
    return priorityColors[priority as keyof typeof priorityColors] || 'text-gray-600 bg-gray-100'
  }

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              நல்வரவு, நிர்வாகி!
            </h1>
            <p className="text-gray-600">Welcome to the Admin Dashboard</p>
            <p className="text-sm text-gray-500">
              {new Date().toLocaleDateString('en-IN', {
                weekday: 'long',
                year: 'numeric', 
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">
              {metrics?.totalBookings || 0}
            </div>
            <div className="text-sm text-gray-600">Total Bookings</div>
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Today's Bookings</p>
              <p className="text-2xl font-bold text-blue-800">{metrics?.todayBookings || 0}</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Completed Jobs</p>
              <p className="text-2xl font-bold text-green-800">{metrics?.completedJobs || 0}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-600 text-sm font-medium">Pending Jobs</p>
              <p className="text-2xl font-bold text-yellow-800">{metrics?.pendingJobs || 0}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 text-sm font-medium">Emergency Jobs</p>
              <p className="text-2xl font-bold text-red-800">{metrics?.emergencyJobs || 0}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Recent Urgent Bookings */}
      <div className="bg-white rounded-2xl shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                🚨 Urgent Bookings
              </h2>
              <p className="text-gray-600 text-sm">
                Emergency and urgent jobs requiring immediate attention
              </p>
            </div>
            <button
              onClick={handleViewAllBookings}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              View All →
            </button>
          </div>
        </div>

        <div className="p-6">
          {urgentBookings.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                No Urgent Bookings!
              </h3>
              <p className="text-gray-600">All emergency and urgent jobs are handled.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {urgentBookings.map((booking: BookingFromStore) => (
                <div
                  key={booking?.bookingNumber || booking?.id}
                  className={`border-2 rounded-xl p-4 ${getPriorityColor(booking?.priority)}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="font-bold text-lg">
                          #{booking?.bookingNumber || booking?.id || 'N/A'}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          booking?.priority === 'emergency' ? 'bg-red-500 text-white animate-pulse' : 'bg-orange-500 text-white'
                        }`}>
                          {booking?.priority === 'emergency' ? '🚨 EMERGENCY' : '⚡ URGENT'}
                        </span>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4 mb-3">
                        <div>
                          <div className="flex items-center space-x-2 text-sm text-gray-700 mb-1">
                            <Users className="w-4 h-4" />
                            <span>
                              {booking?.contactInfo?.name || 'Unknown Customer'}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-700 mb-1">
                            <Phone className="w-4 h-4" />
                            <span>{booking?.contactInfo?.phone || 'No phone'}</span>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex items-center space-x-2 text-sm text-gray-700 mb-1">
                            <MapPin className="w-4 h-4" />
                            <span className="truncate">
                              {booking?.contactInfo?.address || 'No address'}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-700">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {booking?.scheduledTime ? 
                                new Date(booking.scheduledTime).toLocaleString('en-IN') : 
                                'No schedule'
                              }
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mb-3">
                        <p className="text-sm text-gray-700">
                          <strong>Service:</strong> {booking?.serviceType === 'electrical' ? 'மின்சாரம் (Electrical)' : 'குழாய் (Plumbing)'}
                        </p>
                        <p className="text-sm text-gray-700 mt-1">
                          <strong>Issue:</strong> {booking?.description || 'No description'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Status:</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(booking?.status)}`}>
                        {booking?.status?.charAt(0).toUpperCase() + booking?.status?.slice(1).replace('_', ' ') || 'Unknown'}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {booking?.status === 'pending' && (
                        <button
                          onClick={() => handleStatusUpdate(booking?.bookingNumber || booking?.id, 'confirmed')}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                        >
                          Confirm
                        </button>
                      )}
                      {booking?.status === 'confirmed' && (
                        <button
                          onClick={() => handleStatusUpdate(booking?.bookingNumber || booking?.id, 'in_progress')}
                          className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                        >
                          Start Work
                        </button>
                      )}
                      {booking?.status === 'in_progress' && (
                        <button
                          onClick={() => handleStatusUpdate(booking?.bookingNumber || booking?.id, 'completed')}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                        >
                          Complete
                        </button>
                      )}
                      <button
                        onClick={() => window.location.href = `tel:${booking?.contactInfo?.phone}`}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                      >
                        📞 Call
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        <button
          onClick={handleViewAllBookings}
          className="bg-white hover:bg-gray-50 border border-gray-200 rounded-2xl p-6 text-left transition-colors group"
        >
          <Calendar className="w-8 h-8 text-blue-600 mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="font-semibold text-gray-800 mb-1">All Bookings</h3>
          <p className="text-sm text-gray-600">View and manage all service bookings</p>
        </button>

        <button
          onClick={() => fetchMetrics()}
          className="bg-white hover:bg-gray-50 border border-gray-200 rounded-2xl p-6 text-left transition-colors group"
        >
          <TrendingUp className="w-8 h-8 text-green-600 mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="font-semibold text-gray-800 mb-1">Refresh Data</h3>
          <p className="text-sm text-gray-600">Update dashboard metrics</p>
        </button>

        <button
          onClick={() => window.location.href = 'tel:1800-NANJIL'}
          className="bg-white hover:bg-gray-50 border border-gray-200 rounded-2xl p-6 text-left transition-colors group"
        >
          <Phone className="w-8 h-8 text-purple-600 mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="font-semibold text-gray-800 mb-1">Emergency Line</h3>
          <p className="text-sm text-gray-600">Direct customer service line</p>
        </button>
      </div>

      {/* Simple Stats */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Quick Overview
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Service Distribution</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">⚡ Electrical</span>
                <span className="text-sm font-medium">
                  {allBookings?.filter((b: BookingFromStore) => b?.serviceType === 'electrical').length || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">🚰 Plumbing</span>
                <span className="text-sm font-medium">
                  {allBookings?.filter((b: BookingFromStore) => b?.serviceType === 'plumbing').length || 0}
                </span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Recent Activity</h4>
            <div className="space-y-2">
              <div className="text-sm text-gray-600">
                Last booking: {allBookings?.length > 0 ? 
                  new Date((allBookings[0] as any)?.createdAt || (allBookings[0] as any)?.created_at || Date.now()).toLocaleString('en-IN') : 
                  'No bookings yet'
                }
              </div>
              <div className="text-sm text-gray-600">
                Total active: {allBookings?.filter((b: BookingFromStore) => ['pending', 'confirmed', 'in_progress'].includes(b?.status)).length || 0}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}