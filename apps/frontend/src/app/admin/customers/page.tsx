'use client'
import React, { useState } from 'react'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { useAdminCustomers, useCustomerOperations } from '@/hooks/useAdmin' // FIXED: Added import
import { 
  Users, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Ban
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminCustomersPage() {
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    sortBy: 'latest'
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null)

  const { 
    data: customersData, 
    isLoading, 
    error, 
    refetch 
  } = useAdminCustomers({
    page: currentPage,
    limit: 20,
    ...filters
  })

  const { blockCustomer, unblockCustomer } = useCustomerOperations()

  const exportCustomers = () => {
    toast.success('வாடிக்கையாளர் CSV ஏற்றுமதி • Customer CSV export started')
    // Implement CSV export logic
  }

  // Handle block/unblock customer
  const handleBlockCustomer = async (customerId: number, isBlocked: boolean) => {
    try {
      if (isBlocked) {
        await unblockCustomer.mutateAsync(customerId)
        toast.success('வாடிக்கையாளர் தடை நீக்கப்பட்டது • Customer unblocked')
      } else {
        await blockCustomer.mutateAsync(customerId)
        toast.success('வாடிக்கையாளர் தடுக்கப்பட்டார் • Customer blocked')
      }
    } catch (error) {
      toast.error('செயல்பாடு தோல்வியுற்றது • Operation failed')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" text="Loading customers..." />
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
            வாடிக்கையாளர் நிர்வாகம் • Customer Management
          </h1>
          <p className="text-gray-600">
            அனைத்து வாடிக்கையாளர்களை நிர்வகிக்கவும் • Manage all customers
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => refetch()}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Users className="w-4 h-4" />
            <span>புதுப்பிக்க • Refresh</span>
          </button>
          <button
            onClick={exportCustomers}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-lg p-3">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">மொத்த வாடிக்கையாளர்கள்</p>
              <p className="text-2xl font-bold text-gray-900">{customersData?.total || 0}</p>
              <p className="text-xs text-gray-400">Total Customers</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg p-3">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">செயல்பாட்டில்</p>
              <p className="text-2xl font-bold text-gray-900">{customersData?.active || 0}</p>
              <p className="text-xs text-gray-400">Active</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center">
            <div className="bg-yellow-100 rounded-lg p-3">
              <Calendar className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">இந்த மாதம்</p>
              <p className="text-2xl font-bold text-gray-900">{customersData?.thisMonth || 0}</p>
              <p className="text-xs text-gray-400">This Month</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center">
            <div className="bg-purple-100 rounded-lg p-3">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">VIP வாடிக்கையாளர்கள்</p>
              <p className="text-2xl font-bold text-gray-900">{customersData?.vip || 0}</p>
              <p className="text-xs text-gray-400">VIP Customers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              தேடல் • Search
            </label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Name, phone, email..."
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
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              வரிசை • Sort By
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="latest">Latest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name">Name A-Z</option>
              <option value="bookings">Most Bookings</option>
            </select>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Customers ({customersData?.customers?.length || 0})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bookings
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
              {customersData?.customers?.map((customer: any) => (
                <CustomerRow
                  key={customer.id}
                  customer={customer}
                  onView={() => setSelectedCustomer(customer)}
                  onBlock={(isBlocked) => handleBlockCustomer(customer.id, isBlocked)}
                />
              )) || (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No customers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <CustomerDetailModal
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
        />
      )}
    </div>
  )
}

// Customer Row Component
interface CustomerRowProps {
  customer: any
  onView: () => void
  onBlock: (isBlocked: boolean) => void
}

function CustomerRow({ customer, onView, onBlock }: CustomerRowProps) {
  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      blocked: 'bg-red-100 text-red-800'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const isBlocked = customer.status === 'blocked'

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-sm font-medium text-blue-600">
                {customer.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{customer.name}</div>
            <div className="text-sm text-gray-500">Customer ID: {customer.id}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-900">
          <div className="flex items-center mb-1">
            <Phone className="w-3 h-3 mr-1" />
            {customer.phone}
          </div>
          <div className="flex items-center mb-1">
            <Mail className="w-3 h-3 mr-1" />
            {customer.email}
          </div>
          <div className="flex items-start">
            <MapPin className="w-3 h-3 mr-1 mt-0.5" />
            <span className="text-xs">{customer.address?.substring(0, 30)}...</span>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          <div>Total: {customer.totalBookings || 0}</div>
          <div className="text-gray-500">Completed: {customer.completedBookings || 0}</div>
          <div className="text-green-600">Revenue: ₹{customer.totalRevenue || 0}</div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(customer.status || 'active')}`}>
          {customer.status || 'active'}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button
          onClick={onView}
          className="text-blue-600 hover:text-blue-900 mr-3"
          title="View Details"
        >
          <Eye className="w-4 h-4" />
        </button>
        <button className="text-green-600 hover:text-green-900 mr-3" title="Edit">
          <Edit className="w-4 h-4" />
        </button>
        <button 
          onClick={() => onBlock(isBlocked)}
          className={`${isBlocked ? 'text-green-600 hover:text-green-900' : 'text-red-600 hover:text-red-900'}`}
          title={isBlocked ? "Unblock" : "Block"}
        >
          <Ban className="w-4 h-4" />
        </button>
      </td>
    </tr>
  )
}

// Customer Detail Modal
function CustomerDetailModal({ customer, onClose }: any) {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-[800px] shadow-lg rounded-xl bg-white">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">
              Customer Details: {customer.name}
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Contact Information</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Name:</strong> {customer.name}</p>
                  <p><strong>Phone:</strong> {customer.phone}</p>
                  <p><strong>Email:</strong> {customer.email}</p>
                  <p><strong>Address:</strong> {customer.address}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Booking Statistics</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Total Bookings:</strong> {customer.totalBookings || 0}</p>
                  <p><strong>Completed:</strong> {customer.completedBookings || 0}</p>
                  <p><strong>Total Revenue:</strong> ₹{customer.totalRevenue || 0}</p>
                  <p><strong>Member Since:</strong> {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6 space-x-3">
            <button onClick={onClose} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
              Close
            </button>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Edit Customer
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}