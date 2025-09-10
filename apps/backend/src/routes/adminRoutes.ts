import { Hono } from 'hono'
import { BookingService } from '../services/bookingService'

const adminRoutes = new Hono()
const bookingService = new BookingService()

// Get dashboard metrics
adminRoutes.get('/dashboard', async (c) => {
  try {
    const metrics = await bookingService.getDashboardMetrics()
    
    return c.json({
      success: true,
      metrics
    })
  } catch (error) {
    console.error('Get dashboard metrics error:', error)
    return c.json({
      error: 'Failed to fetch dashboard metrics',
      metrics: {
        todayBookings: 0,
        completedJobs: 0,
        pendingJobs: 0,
        emergencyJobs: 0,
        totalBookings: 0
      }
    }, 500)
  }
})

// Get all bookings for admin
adminRoutes.get('/bookings', async (c) => {
  try {
    const status = c.req.query('status')
    const limit = Number(c.req.query('limit')) || 100
    const offset = Number(c.req.query('offset')) || 0

    let bookings = await bookingService.getAllBookings(limit, offset)

    // Filter by status if provided
    if (status) {
      bookings = bookings.filter(booking => booking.status === status)
    }

    // Sort by priority and creation date
    bookings.sort((a, b) => {
      // Emergency first
      if (a.priority === 'emergency' && b.priority !== 'emergency') return -1
      if (b.priority === 'emergency' && a.priority !== 'emergency') return 1
      
      // Then urgent
      if (a.priority === 'urgent' && b.priority === 'normal') return -1
      if (b.priority === 'urgent' && a.priority === 'normal') return 1
      
      // Then by creation date (newest first)
      return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()
    })

    return c.json({
      success: true,
      bookings,
      count: bookings.length
    })
  } catch (error) {
    console.error('Get admin bookings error:', error)
    return c.json({
      error: 'Failed to fetch bookings',
      bookings: []
    }, 500)
  }
})

// Update booking status
adminRoutes.put('/bookings/:id/status', async (c) => {
  try {
    const bookingId = c.req.param('id')
    const { status, notes } = await c.req.json()

    const validStatuses = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled']
    if (!status || !validStatuses.includes(status)) {
      return c.json({
        error: 'Invalid status',
        validStatuses
      }, 400)
    }

    await bookingService.updateBookingStatus(bookingId, status)

    return c.json({
      success: true,
      message: `Booking status updated to ${status}`,
      status,
      notes: notes || null
    })
  } catch (error) {
    console.error('Update booking status error:', error)
    return c.json({
      error: 'Failed to update booking status',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

export { adminRoutes }