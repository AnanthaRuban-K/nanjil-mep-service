// apps/backend/src/routes/bookingRoutes.ts - SIMPLIFIED BOOKING ROUTES
import { Hono } from 'hono'
import { BookingService } from '../services/bookingService.js'

const bookingRoutes = new Hono()
const bookingService = new BookingService()

// Public routes (no auth required for simplicity)
bookingRoutes.post('/', async (c) => {
  try {
    const body = await c.req.json()
    console.log('Create booking request:', body)

    const { serviceType, priority = 'normal', description, contactInfo, scheduledTime } = body

    // Basic validation
    if (!serviceType || !description || !contactInfo || !scheduledTime) {
      return c.json({
        error: 'Missing required fields',
        required: ['serviceType', 'description', 'contactInfo', 'scheduledTime']
      }, 400)
    }

    // Validate contact info structure
    if (!contactInfo.name || !contactInfo.phone || !contactInfo.address) {
      return c.json({
        error: 'Complete contact information required',
        required: ['name', 'phone', 'address']
      }, 400)
    }

    // Create booking
    const bookingData = {
      serviceType,
      priority,
      description,
      contactInfo,
      scheduledTime: new Date(scheduledTime)
    }

    const booking = await bookingService.createBooking(bookingData)

    return c.json({
      success: true,
      booking,
      message: 'Booking created successfully'
    }, 201)

  } catch (error) {
    console.error('Create booking error:', error)
    return c.json({
      error: 'Failed to create booking',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

// Get booking by ID or booking number
bookingRoutes.get('/:id', async (c) => {
  try {
    const param = c.req.param('id')
    let booking

    if (isNaN(Number(param))) {
      // It's a booking number
      booking = await bookingService.getBookingByNumber(param)
    } else {
      // It's a numeric ID
      booking = await bookingService.getBookingById(Number(param))
    }

    if (!booking) {
      return c.json({ error: 'Booking not found' }, 404)
    }

    return c.json({ booking })
  } catch (error) {
    console.error('Get booking error:', error)
    return c.json({
      error: 'Failed to fetch booking',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

// Get all bookings (simplified - no auth)
bookingRoutes.get('/', async (c) => {
  try {
    const limit = Number(c.req.query('limit')) || 50
    const offset = Number(c.req.query('offset')) || 0

    const bookings = await bookingService.getAllBookings(limit, offset)

    return c.json({
      bookings,
      count: bookings.length
    })
  } catch (error) {
    console.error('Get all bookings error:', error)
    return c.json({
      error: 'Failed to fetch bookings',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

// Cancel booking
bookingRoutes.put('/:id/cancel', async (c) => {
  try {
    const bookingId = c.req.param('id')
    const { reason } = await c.req.json().catch(() => ({ reason: 'No reason provided' }))

    await bookingService.cancelBooking(bookingId, reason)

    return c.json({
      success: true,
      message: 'Booking cancelled successfully'
    })
  } catch (error) {
    console.error('Cancel booking error:', error)
    return c.json({
      error: 'Failed to cancel booking',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

// Rate booking
bookingRoutes.post('/:id/feedback', async (c) => {
  try {
    const bookingId = c.req.param('id')
    const { rating, review } = await c.req.json()

    if (!rating || rating < 1 || rating > 5) {
      return c.json({
        error: 'Valid rating (1-5) is required'
      }, 400)
    }

    await bookingService.rateBooking(bookingId, rating, review || '')

    return c.json({
      success: true,
      message: 'Thank you for your feedback!'
    })
  } catch (error) {
    console.error('Rate booking error:', error)
    return c.json({
      error: 'Failed to submit feedback',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

export { bookingRoutes }