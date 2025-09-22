// File: components/admin/AdminDashboard.tsx - Fixed TypeScript Errors
'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs' // FIXED: Added proper auth import
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  Calendar, 
  AlertTriangle, 
  RefreshCw, 
  Eye,
  Phone,
  MapPin,
  Zap,
  Wrench,
  Clock,
  TrendingUp,
  IndianRupee
} from 'lucide-react'

import { useAdminBookings, useAdminDashboardStats, useUpdateBookingStatus } from '@/hooks/useAdmin'

// FIXED: Added proper TypeScript interfaces
interface ContactInfo {
  name: string
  phone: string
  address: string
  email?: string
}

interface Booking {
  id: number
  bookingNumber: string
  serviceType: 'electrical' | 'plumbing'
  priority: 'normal' | 'urgent' | 'emergency'
  description: string
  contactInfo: ContactInfo
  scheduledTime: string
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
  totalCost?: string
  actualCost?: string
  createdAt?: string
  updatedAt?: string
}

interface Stats {
  overall: {
    totalBookings: number
    completedJobs: number
    pendingJobs: number
    emergencyJobs: number
    totalRevenue: number
  }
  today: {
    bookings: number
    revenue: number
  }
}

// FIXED: Create useUserContext hook using Clerk
function useUserContext() {
  const { user, isSignedIn, isLoaded } = useUser()
  
  const userInfo = isSignedIn && user ? {
    id: user.id,
    name: user.firstName || user.fullName || 'User',
    email: user.emailAddresses[0]?.emailAddress,
    phone: user.phoneNumbers[0]?.phoneNumber,
    isAdmin: user.publicMetadata?.role === 'admin'
  } : null

  return {
    user: userInfo,
    isLoaded,
    isSignedIn,
    isAdmin: userInfo?.isAdmin || false
  }
}

export function AdminDashboard() {
  const router = useRouter()
  const { user, isAdmin, isLoaded } = useUserContext()
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  // Real data hooks - FIXED: Removed sortOrder parameter that doesn't exist
  const { data: statsData, isLoading: statsLoading, error: statsError, refetch: refetchStats } = useAdminDashboardStats()
  const { data: bookingsResponse, isLoading: bookingsLoading, error: bookingsError, refetch: refetchBookings } = useAdminBookings({ 
    limit: 10
    // Removed sortBy and sortOrder as they don't exist in the hook interface
  })
  const updateBookingStatusMutation = useUpdateBookingStatus()

  // Redirect if not admin
  useEffect(() => {
    if (isLoaded && user && !isAdmin) {
      router.push('/')
    }
  }, [user, isAdmin, isLoaded, router])

  const handleRefresh = async () => {
    try {
      await Promise.all([refetchStats(), refetchBookings()])
      setLastUpdate(new Date())
    } catch (error) {
      console.error('Failed to refresh data:', error)
    }
  }

  const handleStatusUpdate = async (bookingId: number, newStatus: string) => {
    try {
      // FIXED: Removed 'data' parameter that doesn't exist in the interface
      await updateBookingStatusMutation.mutateAsync({
        bookingId: bookingId.toString(),
        status: newStatus
        // Removed 'data' parameter
      })
      
      // Update local state for immediate UI feedback
      if (selectedBooking) {
        setSelectedBooking({ ...selectedBooking, status: newStatus as any })
      }
      
      // Refresh data to get latest state
      await refetchBookings()
      await refetchStats()
      
    } catch (error) {
      console.error('Failed to update status:', error)
      alert('பிழை: ஸ்டேட்டசை புதுப்பிக்க முடியவில்லை / Error: Failed to update status')
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} min ago`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`
    return date.toLocaleDateString()
  }

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
      in_progress: 'bg-green-100 text-green-800 border-green-200',
      completed: 'bg-gray-100 text-gray-800 border-gray-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const getPriorityColor = (priority: string) => {
    const colors = {
      normal: 'bg-gray-100 text-gray-800 border-gray-200',
      urgent: 'bg-orange-100 text-orange-800 border-orange-200',
      emergency: 'bg-red-100 text-red-800 border-red-200'
    }
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const getServiceIcon = (serviceType: string) => {
    return serviceType === 'electrical' ? 
      <Zap className="w-5 h-5 text-yellow-600" /> : 
      <Wrench className="w-5 h-5 text-blue-600" />
  }

  const getStatusIcon = (status: string) => {
    const icons = {
      pending: <Clock className="w-4 h-4" />,
      confirmed: <CheckCircle className="w-4 h-4" />,
      in_progress: <RefreshCw className="w-4 h-4" />,
      completed: <CheckCircle className="w-4 h-4" />,
      cancelled: <XCircle className="w-4 h-4" />
    }
    return icons[status as keyof typeof icons] || <Clock className="w-4 h-4" />
  }

  // FIXED: Added proper TypeScript types for parameters
  const calculateStats = (): Stats => {
    const bookings: Booking[] = bookingsResponse?.bookings || []
    
    const totalBookings = bookings.length
    const completedJobs = bookings.filter((b: Booking) => b.status === 'completed').length
    const pendingJobs = bookings.filter((b: Booking) => b.status === 'pending').length
    const emergencyJobs = bookings.filter((b: Booking) => b.priority === 'emergency').length
    
    const totalRevenue = bookings
      .filter((b: Booking) => b.status === 'completed' && b.actualCost)
      .reduce((sum: number, b: Booking) => sum + parseFloat(b.actualCost || '0'), 0)
    
    const today = new Date().toDateString()
    const todayBookings = bookings.filter((b: Booking) => 
      new Date(b.createdAt || '').toDateString() === today
    ).length
    
    const todayRevenue = bookings
      .filter((b: Booking) => 
        b.status === 'completed' && 
        b.actualCost &&
        new Date(b.createdAt || '').toDateString() === today
      )
      .reduce((sum: number, b: Booking) => sum + parseFloat(b.actualCost || '0'), 0)

    return {
      overall: {
        totalBookings,
        completedJobs,
        pendingJobs,
        emergencyJobs,
        totalRevenue
      },
      today: {
        bookings: todayBookings,
        revenue: todayRevenue
      }
    }
  }

  const isLoading = statsLoading || bookingsLoading || !isLoaded
  const hasError = statsError || bookingsError

  // Use stats from API if available, otherwise calculate from bookings
  const stats = statsData?.stats || calculateStats()
  const bookings: Booking[] = bookingsResponse?.bookings || []

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">நிர்வாக டாஷ்போர்டை ஏற்றுகிறோம் • Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            உள்நுழைவு தேவை • Login Required
          </h2>
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

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            அனுமதி தேவை • Access Denied
          </h2>
          <p className="text-gray-600 mb-4">நீங்கள் நிர்வாகி அல்ல • You are not an admin</p>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            முகப்புக்கு செல்ல • Go Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                வணக்கம் {user.name}! • Welcome Admin!
              </h1>
              <p className="text-gray-600 mt-1">நிர்வாக கட்டுப்பாட்டு பலகை • Admin Control Panel</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span>புதுப்பிக்க • Refresh</span>
              </button>
              {lastUpdate && (
                <p className="text-sm text-gray-500">
                  Last updated: {lastUpdate.toLocaleTimeString()}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Error Display */}
        {hasError && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
              <p className="text-red-800">Error loading data. Please try refreshing.</p>
            </div>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="bg-blue-100 rounded-lg p-3">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">மொத்த பதிவுகள்</p>
                <p className="text-2xl font-bold text-gray-900">{stats.overall.totalBookings}</p>
                <p className="text-xs text-gray-400">Total Bookings</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="bg-green-100 rounded-lg p-3">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">இன்றைய பதிவுகள்</p>
                <p className="text-2xl font-bold text-gray-900">{stats.today.bookings}</p>
                <p className="text-xs text-gray-400">Today's Bookings</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="bg-emerald-100 rounded-lg p-3">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">முடிந்த வேலைகள்</p>
                <p className="text-2xl font-bold text-gray-900">{stats.overall.completedJobs}</p>
                <p className="text-xs text-gray-400">Completed Jobs</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="bg-yellow-100 rounded-lg p-3">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">நிலுவையில்</p>
                <p className="text-2xl font-bold text-gray-900">{stats.overall.pendingJobs}</p>
                <p className="text-xs text-gray-400">Pending Jobs</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="bg-red-100 rounded-lg p-3">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">அவசரம்</p>
                <p className="text-2xl font-bold text-gray-900">{stats.overall.emergencyJobs}</p>
                <p className="text-xs text-gray-400">Emergency Jobs</p>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">மொத்த வருமானம் • Total Revenue</h3>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex items-center">
              <IndianRupee className="w-8 h-8 text-green-600 mr-2" />
              <span className="text-3xl font-bold text-gray-900">
                {Math.round(stats.overall.totalRevenue || 0).toLocaleString()}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-2">Overall earnings</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">இன்றைய வருமானம் • Today's Revenue</h3>
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex items-center">
              <IndianRupee className="w-8 h-8 text-blue-600 mr-2" />
              <span className="text-3xl font-bold text-gray-900">
                {Math.round(stats.today.revenue || 0).toLocaleString()}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-2">Today's earnings</p>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                சமீபத்திய பதிவுகள் • Recent Bookings ({bookings.length})
              </h2>
              <button
                onClick={() => router.push('/admin/bookings')}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                அனைத்தையும் பார்க்க • View All →
              </button>
            </div>
          </div>
          
          {bookings.length === 0 ? (
            <div className="p-8 text-center">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">பதிவுகள் எதுவும் இல்லை • No bookings found</p>
              <p className="text-sm text-gray-400">புதிய பதிவுகளுக்கு காத்திருக்கிறோம் • Waiting for new bookings</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {bookings.map((booking: Booking) => (
                <div key={booking.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="font-semibold text-gray-900">{booking.bookingNumber}</span>
                        <div className="flex items-center space-x-1">
                          {getServiceIcon(booking.serviceType)}
                          <span className="text-sm text-gray-600 capitalize">{booking.serviceType}</span>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(booking.priority)}`}>
                          {booking.priority}
                        </span>
                        <span className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                          {getStatusIcon(booking.status)}
                          <span>{booking.status}</span>
                        </span>
                      </div>
                      
                      <h3 className="font-medium text-gray-900 mb-2">{booking.contactInfo.name}</h3>
                      <div className="text-sm text-gray-600 space-y-1 mb-3">
                        <div className="flex items-center">
                          <Phone className="h-3 w-3 mr-2" />
                          <span>{booking.contactInfo.phone}</span>
                        </div>
                        <div className="flex items-start">
                          <MapPin className="h-3 w-3 mr-2 mt-0.5" />
                          <span className="text-xs">{booking.contactInfo.address}</span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-800 mb-3">{booking.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{formatTime(booking.createdAt || '')}</span>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm font-medium flex items-center">
                            <IndianRupee className="w-4 h-4 mr-1" />
                            {booking.totalCost || booking.actualCost || 'TBD'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="ml-4 flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedBooking(booking)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
                        title="View Details • விவரங்களை பார்க்க"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Booking Update Modal */}
        {selectedBooking && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-[600px] shadow-lg rounded-xl bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    பதிவை புதுப்பிக்க • Update Booking: {selectedBooking.bookingNumber}
                  </h3>
                  <button
                    onClick={() => setSelectedBooking(null)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ×
                  </button>
                </div>
                
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3">வாடிக்கையாளர் விவரங்கள் • Customer Details</h4>
                  <div className="space-y-2">
                    <p className="text-sm"><strong>பெயர் • Name:</strong> {selectedBooking.contactInfo.name}</p>
                    <p className="text-sm"><strong>Phone:</strong> {selectedBooking.contactInfo.phone}</p>
                    <p className="text-sm"><strong>Address:</strong> {selectedBooking.contactInfo.address}</p>
                    <p className="text-sm"><strong>பிரச்சனை • Problem:</strong> {selectedBooking.description}</p>
                    <p className="text-sm"><strong>செலவு • Cost:</strong> ₹{selectedBooking.totalCost || selectedBooking.actualCost || 'TBD'}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    தற்போதைய நிலை • Current Status: <span className="font-semibold capitalize">{selectedBooking.status}</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleStatusUpdate(selectedBooking.id, 'confirmed')}
                      disabled={updateBookingStatusMutation.isPending}
                      className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>உறுதிப்படுத்து • Confirm</span>
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(selectedBooking.id, 'in_progress')}
                      disabled={updateBookingStatusMutation.isPending}
                      className="flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 disabled:bg-gray-400 transition-colors"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>வேலை தொடங்கு • Start Work</span>
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(selectedBooking.id, 'completed')}
                      disabled={updateBookingStatusMutation.isPending}
                      className="flex items-center justify-center space-x-2 px-4 py-3 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 disabled:bg-gray-400 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>முடிக்க • Complete</span>
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(selectedBooking.id, 'cancelled')}
                      disabled={updateBookingStatusMutation.isPending}
                      className="flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 disabled:bg-gray-400 transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>ரத்து செய் • Cancel</span>
                    </button>
                  </div>
                  
                  {updateBookingStatusMutation.isPending && (
                    <div className="mt-3 text-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 inline-block mr-2"></div>
                      <span className="text-sm text-gray-600">Updating status...</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setSelectedBooking(null)}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    மூடு • Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}