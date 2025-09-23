import { Hono } from 'hono'
import { AdminController } from '../controllers/AdminController.js'
import { authMiddleware } from '../middleware/AuthMiddleware.js'
import { adminOnly } from '../middleware/AdminMiddleware.js'

const adminRoutes = new Hono()
const adminController = new AdminController()

// Apply auth middleware to all admin routes
adminRoutes.use('*', authMiddleware, adminOnly) // Uncomment for production

// Dashboard metrics
adminRoutes.get('/dashboard', async (c) => {
  return await adminController.getDashboardMetrics(c)
})

// Get all bookings for admin
adminRoutes.get('/bookings', async (c) => {
  return await adminController.getAdminBookings(c)
})

// Update booking status
adminRoutes.put('/bookings/:id/status', async (c) => {
  return await adminController.updateBookingStatus(c)
})

// Get booking details (admin view)
adminRoutes.get('/bookings/:id', async (c) => {
  return await adminController.getBookingDetails(c)
})

// ADDED: Get all customers for admin
adminRoutes.get('/customers', async (c) => {
  try {
    const search = c.req.query('search')
    const status = c.req.query('status')
    const sortBy = c.req.query('sortBy')
    const limit = Number(c.req.query('limit')) || 50
    const offset = Number(c.req.query('offset')) || 0

    console.log('Getting admin customers...', { search, status, sortBy, limit, offset })

    // Mock customer data - replace with real database queries
    let mockCustomers = [
      {
        id: 1,
        name: 'Raja Kumar',
        email: 'raja.kumar@email.com',
        phone: '+91 9876543210',
        address: 'No.123, Main Street, Nagercoil, Tamil Nadu',
        totalBookings: 5,
        completedBookings: 4,
        totalRevenue: 25000,
        status: 'active',
        createdAt: '2024-01-01T00:00:00Z',
        lastBooking: '2024-01-15T10:00:00Z'
      },
      {
        id: 2,
        name: 'Sundari Ammal',
        email: 'sundari@email.com',
        phone: '+91 9876543211',
        address: 'No.456, Gandhi Road, Kanyakumari, Tamil Nadu',
        totalBookings: 3,
        completedBookings: 3,
        totalRevenue: 15000,
        status: 'active',
        createdAt: '2024-01-15T00:00:00Z',
        lastBooking: '2024-02-01T14:00:00Z'
      },
      {
        id: 3,
        name: 'Murugan S',
        email: 'murugan@email.com',
        phone: '+91 9876543212',
        address: 'No.789, Beach Road, Tuticorin, Tamil Nadu',
        totalBookings: 8,
        completedBookings: 6,
        totalRevenue: 40000,
        status: 'active',
        createdAt: '2023-12-01T00:00:00Z',
        lastBooking: '2024-02-10T16:00:00Z'
      },
      {
        id: 4,
        name: 'Priya Devi',
        email: 'priya@email.com',
        phone: '+91 9876543213',
        address: 'No.321, Temple Street, Madurai, Tamil Nadu',
        totalBookings: 2,
        completedBookings: 1,
        totalRevenue: 8000,
        status: 'blocked',
        createdAt: '2024-02-01T00:00:00Z',
        lastBooking: '2024-02-05T09:00:00Z'
      }
    ]

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase()
      mockCustomers = mockCustomers.filter(customer => 
        customer.name.toLowerCase().includes(searchLower) ||
        customer.phone.includes(search) ||
        customer.email.toLowerCase().includes(searchLower)
      )
    }

    // Apply status filter
    if (status) {
      mockCustomers = mockCustomers.filter(customer => customer.status === status)
    }

    // Apply sorting
    switch (sortBy) {
      case 'name':
        mockCustomers.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'bookings':
        mockCustomers.sort((a, b) => b.totalBookings - a.totalBookings)
        break
      case 'oldest':
        mockCustomers.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        break
      case 'latest':
      default:
        mockCustomers.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
    }

    // Apply pagination
    const paginatedCustomers = mockCustomers.slice(offset, offset + limit)

    // Calculate stats
    const stats = {
      total: mockCustomers.length,
      active: mockCustomers.filter(c => c.status === 'active').length,
      blocked: mockCustomers.filter(c => c.status === 'blocked').length,
      thisMonth: mockCustomers.filter(c => {
        const customerDate = new Date(c.createdAt)
        const thisMonth = new Date()
        return customerDate.getMonth() === thisMonth.getMonth() && 
               customerDate.getFullYear() === thisMonth.getFullYear()
      }).length,
      vip: mockCustomers.filter(c => c.totalBookings >= 5).length
    }

    console.log('Customers retrieved successfully')
    return c.json({
      success: true,
      customers: paginatedCustomers,
      ...stats
    })

  } catch (error) {
    console.error('Get customers error:', error)
    return c.json({
      error: 'Failed to fetch customers',
      customers: [],
      total: 0,
      active: 0,
      blocked: 0,
      thisMonth: 0,
      vip: 0
    }, 500)
  }
})

// ADDED: Block/Unblock customer
adminRoutes.post('/customers/:id/block', async (c) => {
  try {
    const customerId = c.req.param('id')
    const { blocked } = await c.req.json()

    console.log(`${blocked ? 'Blocking' : 'Unblocking'} customer ${customerId}`)

    // Mock update - replace with real database update
    const action = blocked ? 'blocked' : 'unblocked'

    return c.json({
      success: true,
      message: `Customer ${action} successfully`,
      customerId,
      status: blocked ? 'blocked' : 'active'
    })

  } catch (error) {
    console.error('Block customer error:', error)
    return c.json({
      error: 'Failed to update customer status',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

// ADDED: Unblock customer endpoint
adminRoutes.post('/customers/:id/unblock', async (c) => {
  try {
    const customerId = c.req.param('id')
    
    console.log(`Unblocking customer ${customerId}`)

    return c.json({
      success: true,
      message: 'Customer unblocked successfully',
      customerId,
      status: 'active'
    })

  } catch (error) {
    console.error('Unblock customer error:', error)
    return c.json({
      error: 'Failed to unblock customer',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

// ADDED: Update customer details
adminRoutes.put('/customers/:id', async (c) => {
  try {
    const customerId = c.req.param('id')
    const updateData = await c.req.json()

    console.log(`Updating customer ${customerId}`, updateData)

    return c.json({
      success: true,
      message: 'Customer updated successfully',
      customerId,
      customer: {
        id: customerId,
        ...updateData,
        updatedAt: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Update customer error:', error)
    return c.json({
      error: 'Failed to update customer',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

// Get customer analytics
adminRoutes.get('/analytics/customers', async (c) => {
  return await adminController.getCustomerAnalytics(c)
})

// Get service analytics
adminRoutes.get('/analytics/services', async (c) => {
  return await adminController.getServiceAnalytics(c)
})

// Get revenue analytics
adminRoutes.get('/analytics/revenue', async (c) => {
  return await adminController.getRevenueAnalytics(c)
})

// Export bookings data
adminRoutes.get('/export/bookings', async (c) => {
  return await adminController.exportBookings(c)
})

// Bulk status update
adminRoutes.put('/bookings/bulk/status', async (c) => {
  return await adminController.bulkUpdateStatus(c)
})

export { adminRoutes }