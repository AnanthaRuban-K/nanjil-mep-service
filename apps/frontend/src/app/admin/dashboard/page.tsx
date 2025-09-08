"use client"

import { useEffect, useState, useCallback } from "react"
import { Users, CheckCircle, XCircle, Calendar, AlertTriangle, Phone, MapPin, Eye, RefreshCw } from "lucide-react"

// Match your backend interface
export interface Booking {
  id: number
  bookingNumber: string
  serviceType: 'electrical' | 'plumbing'
  priority: 'normal' | 'urgent' | 'emergency'
  description: string
  contactInfo: {
    name: string
    phone: string
    address: string
  }
  scheduledTime: string
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
  createdAt: string
  updatedAt?: string
  totalCost: string
  actualCost?: string
  rating?: number
}

interface DashboardStats {
  today: {
    bookings: number
    completed: number
    pending: number
    inProgress: number
    revenue: number
  }
  overall: {
    totalBookings: number
    completedJobs: number
    pendingJobs: number
    emergencyJobs: number
    totalRevenue: number
  }
}

export default function ProductionAdminDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    today: { bookings: 0, completed: 0, pending: 0, inProgress: 0, revenue: 0 },
    overall: { totalBookings: 0, completedJobs: 0, pendingJobs: 0, emergencyJobs: 0, totalRevenue: 0 }
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  // API base URL
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

  // Fetch dashboard metrics
  const fetchDashboardStats = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/api/admin/dashboard`)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      
      const data = await response.json()
      console.log("Dashboard stats:", data)
      
      if (data.success && data.metrics) {
        setStats(data.metrics)
      }
    } catch (err) {
      console.error("Error fetching dashboard stats:", err)
      setError("Failed to load dashboard statistics")
    }
  }, [API_BASE])

  // Fetch real bookings from correct endpoint
  const fetchBookings = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/api/admin/bookings?limit=20`)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      
      const data = await response.json()
      console.log("API bookings response:", data)

      if (data.success && Array.isArray(data.bookings)) {
        setBookings(data.bookings)
        setError(null)
      } else if (Array.isArray(data)) {
        setBookings(data)
        setError(null)
      } else {
        console.error("Unexpected API format:", data)
        setError("Invalid response format")
      }
    } catch (err) {
      console.error("Error fetching bookings:", err)
      setError("Failed to load bookings")
    } finally {
      setLoading(false)
    }
  }, [API_BASE])

  // Update booking status
  const updateBookingStatus = async (bookingId: number, newStatus: string) => {
    try {
      const response = await fetch(`${API_BASE}/api/admin/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      if (!response.ok) throw new Error('Failed to update booking')

      // Update local state immediately
      setBookings(prev => prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: newStatus as any, updatedAt: new Date().toISOString() }
          : booking
      ))

      // Refresh stats
      await fetchDashboardStats()
      
      console.log(`Booking ${bookingId} updated to ${newStatus}`)
    } catch (err) {
      console.error("Error updating booking:", err)
      alert("Failed to update booking status")
    }
  }

  // Initial data fetch
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await Promise.all([
        fetchBookings(),
        fetchDashboardStats()
      ])
      setLastUpdate(new Date())
    }
    
    loadData()
  }, [fetchBookings, fetchDashboardStats])

  // Set up real-time updates every 30 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      await Promise.all([
        fetchBookings(),
        fetchDashboardStats()
      ])
      setLastUpdate(new Date())
      console.log("Dashboard refreshed:", new Date().toLocaleTimeString())
    }, 30000) // 30 seconds

    return () => clearInterval(interval)
  }, [fetchBookings, fetchDashboardStats])

  // Manual refresh
  const handleRefresh = async () => {
    setLoading(true)
    await Promise.all([
      fetchBookings(),
      fetchDashboardStats()
    ])
    setLastUpdate(new Date())
    setLoading(false)
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
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getPriorityColor = (priority: string) => {
    const colors = {
      normal: 'bg-gray-100 text-gray-800',
      urgent: 'bg-orange-100 text-orange-800',
      emergency: 'bg-red-100 text-red-800'
    }
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  if (loading && bookings.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-lg">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">நாஞ்சில் MEP Admin Dashboard</h1>
            <p className="text-gray-600">Production Environment - Real Data</p>
            <p className="text-sm text-gray-500">API: {API_BASE}</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            {lastUpdate && (
              <p className="text-sm text-gray-500">
                Last updated: {lastUpdate.toLocaleTimeString()}
              </p>
            )}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <Users className="w-8 h-8 text-blue-500 mb-2" />
            <p className="text-sm text-gray-500">Total Bookings</p>
            <p className="text-2xl font-bold">{stats.overall?.totalBookings ?? 0}</p>

          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <Calendar className="w-8 h-8 text-green-500 mb-2" />
            <p className="text-sm text-gray-500">Today's Bookings</p>
            <p className="text-2xl font-bold">{stats.today?.bookings ?? 0}</p>

          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <CheckCircle className="w-8 h-8 text-green-500 mb-2" />
            <p className="text-sm text-gray-500">Completed</p>
            <p className="text-2xl font-bold">{stats.overall?.completedJobs ?? 0}</p>

          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <XCircle className="w-8 h-8 text-yellow-500 mb-2" />
            <p className="text-sm text-gray-500">Pending</p>
            <p className="text-2xl font-bold">{stats.overall?.pendingJobs ?? 0}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <AlertTriangle className="w-8 h-8 text-red-500 mb-2" />
            <p className="text-sm text-gray-500">Emergency</p>
            <p className="text-2xl font-bold">{stats.overall?.emergencyJobs ?? 0}</p>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recent Bookings ({bookings.length})</h2>
          </div>
          
          {loading ? (
            <div className="p-8 text-center">
              <RefreshCw className="h-6 w-6 animate-spin text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Loading bookings...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="p-8 text-center">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No bookings found</p>
              <p className="text-sm text-gray-400">Check your API connection and try refreshing</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {bookings.slice(0, 10).map((booking) => (
                <div key={booking.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="font-semibold text-gray-900">{booking.bookingNumber}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(booking.priority)}`}>
                          {booking.priority}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </div>
                      
                      <h3 className="font-medium text-gray-900 mb-1">{booking.contactInfo.name}</h3>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div className="flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          <span>{booking.contactInfo.phone}</span>
                        </div>
                        <div className="flex items-start">
                          <MapPin className="h-3 w-3 mr-1 mt-0.5" />
                          <span className="text-xs">{booking.contactInfo.address}</span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-800 mt-2">{booking.description}</p>
                      
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs text-gray-500">{formatTime(booking.createdAt)}</span>
                        <span className="text-sm font-medium">₹{booking.actualCost || booking.totalCost}</span>
                      </div>
                    </div>
                    
                    <div className="ml-4 flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedBooking(booking)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
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
            <div className="relative top-20 mx-auto p-5 border w-[500px] shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Update Booking: {selectedBooking.bookingNumber}
                  </h3>
                  <button
                    onClick={() => setSelectedBooking(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="mb-4 p-3 bg-gray-50 rounded">
                  <h4 className="font-medium text-gray-900 mb-2">Customer Details</h4>
                  <p className="text-sm text-gray-600">{selectedBooking.contactInfo.name}</p>
                  <p className="text-sm text-gray-600">{selectedBooking.contactInfo.phone}</p>
                  <p className="text-sm text-gray-600">{selectedBooking.description}</p>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Status: {selectedBooking.status}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        updateBookingStatus(selectedBooking.id, 'confirmed')
                        setSelectedBooking({ ...selectedBooking, status: 'confirmed' })
                      }}
                      className="px-3 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => {
                        updateBookingStatus(selectedBooking.id, 'in_progress')
                        setSelectedBooking({ ...selectedBooking, status: 'in_progress' })
                      }}
                      className="px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                    >
                      Start Work
                    </button>
                    <button
                      onClick={() => {
                        updateBookingStatus(selectedBooking.id, 'completed')
                        setSelectedBooking({ ...selectedBooking, status: 'completed' })
                      }}
                      className="px-3 py-2 bg-purple-600 text-white rounded text-sm hover:bg-purple-700"
                    >
                      Complete
                    </button>
                    <button
                      onClick={() => {
                        updateBookingStatus(selectedBooking.id, 'cancelled')
                        setSelectedBooking({ ...selectedBooking, status: 'cancelled' })
                      }}
                      className="px-3 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                    >
                      Cancel
                    </button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => setSelectedBooking(null)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                  >
                    Close
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