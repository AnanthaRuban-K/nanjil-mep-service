'use client'
import React, { useState } from 'react'
import { useAdminBookings, useUpdateBookingStatus } from '@/hooks/useAdmin'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { 
  Calendar, 
  Phone, 
  MapPin, 
  Eye, 
  RefreshCw,
  Filter,
  Search,
  Download
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminBookingsPage() {
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    serviceType: '',
    search: ''
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedBooking, setSelectedBooking] = useState<any>(null)

  const { 
    data: bookingsData, 
    isLoading, 
    error, 
    refetch 
  } = useAdminBookings({
    page: currentPage,
    limit: 20,
    ...filters
  })

  const updateStatusMutation = useUpdateBookingStatus()

  const handleStatusUpdate = async (bookingId: number, newStatus: string) => {
    try {
      await updateStatusMutation.mutateAsync({
        bookingId,
        status: newStatus
      })
      toast.success(`நிலை புதுப்பிக்கப்பட்டது • Status updated to ${newStatus}`)
      setSelectedBooking(null)
    } catch (error) {
      toast.error('நிலை புதுப்பிக்க முடியவில்லை • Failed to update status')
    }
  }

  const exportBookings = () => {
    toast.success('CSV export started • CSV ஏற்றுமதி தொடங்கியது')
    // Implement CSV export logic
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" text="Loading bookings..." />
      </div>
    )
  }

  if (error) {
    return <ErrorMessage error={error} onRetry={refetch} />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            பதிவுகள் நிர்வாகம் • Bookings Management
          </h1>
          <p className="text-gray-600">
            அனைத்து சேவை பதிவுகளை நிர்வகிக்கவும் • Manage all service bookings
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => refetch()}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <RefreshCw className="w-4 h-4" />
            <span>புதுப்பிக்க • Refresh</span>
          </button>
          <button
            onClick={exportBookings}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Download className="w-4 h-4" />
            <span>CSV Export</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              தேடல் • Search
            </label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Customer name, phone..."
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
                className="pl-10 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              நிலை • Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              முன்னுரிமை • Priority
            </label>
            <select
              value={filters.priority}
              onChange={(e) => setFilters({...filters, priority: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Priority</option>
              <option value="normal">Normal</option>
              <option value="urgent">Urgent</option>
              <option value="emergency">Emergency</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              சேவை வகை • Service Type
            </label>
            <select
              value={filters.serviceType}
              onChange={(e) => setFilters({...filters, serviceType: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Services</option>
              <option value="electrical">Electrical</option>
              <option value="plumbing">Plumbing</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => setFilters({ status: '', priority: '', serviceType: '', search: '' })}
              className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Bookings ({bookingsData?.total || 0})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Booking Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookingsData?.bookings.map((booking: any) => (
                <BookingRow
                  key={booking.id}
                  booking={booking}
                  onView={() => setSelectedBooking(booking)}
                  onStatusUpdate={handleStatusUpdate}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {((currentPage - 1) * 20) + 1} to {Math.min(currentPage * 20, bookingsData?.total || 0)} of {bookingsData?.total || 0} results
            </div>
            <div className="flex space-x-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-3 py-1">{currentPage}</span>
              <button
                disabled={currentPage * 20 >= (bookingsData?.total || 0)}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <BookingDetailModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onStatusUpdate={handleStatusUpdate}
          isUpdating={updateStatusMutation.isPending}
        />
      )}
    </div>
  )
}

// Booking Row Component
function BookingRow({ booking, onView, onStatusUpdate }: any) {
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

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div>
          <div className="text-sm font-medium text-gray-900">{booking.bookingNumber}</div>
          <div className="text-sm text-gray-500">{new Date(booking.createdAt).toLocaleDateString()}</div>
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(booking.priority)}`}>
            {booking.priority}
          </span>
        </div>
      </td>
      <td className="px-6 py-4">
        <div>
          <div className="text-sm font-medium text-gray-900">{booking.contactInfo.name}</div>
          <div className="text-sm text-gray-500 flex items-center">
            <Phone className="w-3 h-3 mr-1" />
            {booking.contactInfo.phone}
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div>
          <div className="text-sm font-medium text-gray-900 capitalize">{booking.serviceType}</div>
          <div className="text-sm text-gray-500">{booking.description.substring(0, 50)}...</div>
          <div className="text-sm font-medium text-gray-900">₹{booking.totalCost}</div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
          {booking.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button
          onClick={onView}
          className="text-blue-600 hover:text-blue-900 mr-3"
        >
          <Eye className="w-4 h-4" />
        </button>
        <select
          onChange={(e) => {
            if (e.target.value) {
              onStatusUpdate(booking.id, e.target.value)
              e.target.value = '' // Reset select
            }
          }}
          className="text-sm border border-gray-300 rounded px-2 py-1"
          defaultValue=""
        >
          <option value="">Update Status</option>
          <option value="confirmed">Confirm</option>
          <option value="in_progress">Start Work</option>
          <option value="completed">Complete</option>
          <option value="cancelled">Cancel</option>
        </select>
      </td>
    </tr>
  )
}

// Booking Detail Modal Component
function BookingDetailModal({ booking, onClose, onStatusUpdate, isUpdating }: any) {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-[700px] shadow-lg rounded-xl bg-white">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">
              Booking Details: {booking.bookingNumber}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Customer Information</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Name:</strong> {booking.contactInfo.name}</p>
                  <p><strong>Phone:</strong> {booking.contactInfo.phone}</p>
                  <p><strong>Address:</strong> {booking.contactInfo.address}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Service Details</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Type:</strong> {booking.serviceType}</p>
                  <p><strong>Priority:</strong> {booking.priority}</p>
                  <p><strong>Status:</strong> {booking.status}</p>
                  <p><strong>Cost:</strong> ₹{booking.totalCost}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Problem Description</h4>
                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                  {booking.description}
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Timing</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Created:</strong> {new Date(booking.createdAt).toLocaleString()}</p>
                  <p><strong>Scheduled:</strong> {new Date(booking.scheduledTime).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h4 className="font-semibold text-gray-900 mb-3">Update Status</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['confirmed', 'in_progress', 'completed', 'cancelled'].map((status) => (
                <button
                  key={status}
                  onClick={() => onStatusUpdate(booking.id, status)}
                  disabled={isUpdating || booking.status === status}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    booking.status === status
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400'
                  }`}
                >
                  {status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}