// apps/frontend/src/app/admin/bookings/page.tsx
'use client'
import React, { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  MapPin, 
  Zap, 
  Wrench, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Eye,
  ArrowLeft,
  Filter,
  Search
} from 'lucide-react'

// Mock data for testing - replace with real API calls later
const mockBookings = [
  {
    id: 1,
    bookingNumber: 'NMS240901001',
    serviceType: 'electrical',
    priority: 'emergency',
    description: 'மின்சாரம் போகுது, ஃபான் ஓடவில்லை - Power cut, fan not working',
    contactInfo: {
      name: 'ராஜேஷ் குமார்',
      phone: '9876543210',
      address: 'No.15, காமராஜ் தெரு, நாகர்கோவில்'
    },
    scheduledTime: '2024-09-01T10:00:00Z',
    status: 'pending',
    createdAt: '2024-09-01T08:30:00Z',
    totalCost: '450'
  },
  {
    id: 2,
    bookingNumber: 'NMS240901002',
    serviceType: 'plumbing',
    priority: 'normal',
    description: 'குழாய் நீர் கசிவு - Pipe water leakage in bathroom',
    contactInfo: {
      name: 'சுமித்ரா தேவி',
      phone: '9876543211',
      address: 'No.28, விவேகானந்த தெரு, நாகர்கோவில்'
    },
    scheduledTime: '2024-09-01T14:00:00Z',
    status: 'confirmed',
    createdAt: '2024-09-01T09:15:00Z',
    totalCost: '350'
  },
  {
    id: 3,
    bookingNumber: 'NMS240901003',
    serviceType: 'electrical',
    priority: 'urgent',
    description: 'சுவிட்ச் போர்ட் பிரச்சினை - Switch board sparking issue',
    contactInfo: {
      name: 'முருகன் பிள்ளை',
      phone: '9876543212',
      address: 'No.42, தியாகராஜர் தெரு, நாகர்கோவில்'
    },
    scheduledTime: '2024-09-01T16:30:00Z',
    status: 'in_progress',
    createdAt: '2024-09-01T10:00:00Z',
    totalCost: '500'
  }
]

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800', 
  in_progress: 'bg-green-100 text-green-800',
  completed: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800'
}

const priorityColors = {
  normal: 'bg-gray-100 text-gray-800',
  urgent: 'bg-orange-100 text-orange-800',
  emergency: 'bg-red-100 text-red-800'
}

const serviceIcons = {
  electrical: Zap,
  plumbing: Wrench
}

export default function AdminBookings() {
  const { user, isLoaded, isSignedIn } = useUser()
  const router = useRouter()
  const [bookings, setBookings] = useState(mockBookings)
  const [filteredBookings, setFilteredBookings] = useState(mockBookings)
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedService, setSelectedService] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBooking, setSelectedBooking] = useState<any>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)

  // Filter bookings based on selected filters
  useEffect(() => {
    let filtered = bookings

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(booking => booking.status === selectedStatus)
    }

    if (selectedService !== 'all') {
      filtered = filtered.filter(booking => booking.serviceType === selectedService)
    }

    if (searchTerm) {
      filtered = filtered.filter(booking => 
        booking.contactInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.bookingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.contactInfo.phone.includes(searchTerm)
      )
    }

    setFilteredBookings(filtered)
  }, [selectedStatus, selectedService, searchTerm, bookings])

  // Handle status update
  const updateBookingStatus = (bookingId: number, newStatus: string) => {
    setBookings(prev => prev.map(booking => 
      booking.id === bookingId 
        ? { ...booking, status: newStatus }
        : booking
    ))
  }

  // Format date and time
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString('en-IN'),
      time: date.toLocaleTimeString('en-IN', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      })
    }
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl">Loading bookings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/admin/dashboard')}
                className="mr-4 p-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Bookings Management
                </h1>
                <p className="text-sm text-gray-600">
                  பதிவுகள் நிர்வாகம் / Manage service bookings
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                Total Bookings: {filteredBookings.length}
              </p>
              <p className="text-xs text-gray-500">
                {new Date().toLocaleDateString('en-IN')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            {/* Search */}
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search by name, booking number, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Service Filter */}
            <div>
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Services</option>
                <option value="electrical">Electrical / மின்சாரம்</option>
                <option value="plumbing">Plumbing / பிளம்பிங்</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booking Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service & Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Schedule
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
                {filteredBookings.map((booking) => {
                  const ServiceIcon = serviceIcons[booking.serviceType as keyof typeof serviceIcons]
                  const scheduledDateTime = formatDateTime(booking.scheduledTime)
                  
                  return (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {booking.bookingNumber}
                          </div>
                          <div className="text-sm text-gray-500">
                            ₹{booking.totalCost}
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {booking.contactInfo.name}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Phone className="h-3 w-3 mr-1" />
                            {booking.contactInfo.phone}
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <ServiceIcon className="h-5 w-5 mr-2 text-gray-400" />
                          <div>
                            <div className="text-sm font-medium text-gray-900 capitalize">
                              {booking.serviceType}
                            </div>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityColors[booking.priority as keyof typeof priorityColors]}`}>
                              {booking.priority}
                            </span>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {scheduledDateTime.date}
                        </div>
                        <div className="text-sm text-gray-500">
                          {scheduledDateTime.time}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={booking.status}
                          onChange={(e) => updateBookingStatus(booking.id, e.target.value)}
                          className={`text-sm rounded-full px-3 py-1 font-medium border-0 ${statusColors[booking.status as keyof typeof statusColors]}`}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => {
                            setSelectedBooking(booking)
                            setShowDetailsModal(true)
                          }}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          
          {filteredBookings.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No bookings found
              </h3>
              <p className="text-gray-500">
                No bookings match your current filters.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Booking Details Modal */}
      {showDetailsModal && selectedBooking && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Booking Details
                </h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900">Booking Number</h4>
                  <p className="text-gray-600">{selectedBooking.bookingNumber}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900">Customer</h4>
                  <p className="text-gray-600">{selectedBooking.contactInfo.name}</p>
                  <p className="text-gray-600">{selectedBooking.contactInfo.phone}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900">Address</h4>
                  <p className="text-gray-600">{selectedBooking.contactInfo.address}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900">Problem Description</h4>
                  <p className="text-gray-600">{selectedBooking.description}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900">Cost</h4>
                  <p className="text-gray-600">₹{selectedBooking.totalCost}</p>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}