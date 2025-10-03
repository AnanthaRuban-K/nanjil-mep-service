import { Context } from 'hono'
import { BookingService } from '../services/BookingService'
import { HTTPException } from 'hono/http-exception'

export class BookingController {
  private bookingService: BookingService

  constructor() {
    this.bookingService = new BookingService()
  }

  async getBookings(c: Context) {
    try {
      const params = {
        limit: Math.min(Number(c.req.query('limit')) || 50, 100),
        offset: Number(c.req.query('offset')) || 0,
        status: c.req.query('status'),
        serviceType: c.req.query('serviceType'),
        priority: c.req.query('priority'),
        dateFrom: c.req.query('dateFrom'),
        dateTo: c.req.query('dateTo'),
        sortBy: c.req.query('sortBy') || 'createdAt',
        sortOrder: c.req.query('sortOrder') || 'desc',
        search: c.req.query('search')
      }

      const result = await this.bookingService.getBookings(params)

      return c.json({
        success: true,
        ...result
      })
    } catch (error) {
      console.error('Get bookings error:', error)
      throw new HTTPException(500, { message: 'Failed to fetch bookings' })
    }
  }

  async getMyBookings(c: Context) {
    try {
      const userPhone = c.req.query('phone') || c.req.header('user-phone')
      const userEmail = c.req.query('email') || c.req.header('user-email')
      const userId = c.req.query('userId') || c.req.header('user-id')

      const bookings = await this.bookingService.getMyBookings({ userPhone, userEmail, userId })

      return c.json({
        success: true,
        bookings,
        count: bookings.length
      })
    } catch (error) {
      console.error('Get my bookings error:', error)
      throw new HTTPException(500, { message: 'Failed to fetch your bookings' })
    }
  }

  async createBooking(c: Context) {
    try {
      const bookingData = await c.req.json()
      const booking = await this.bookingService.createBooking(bookingData)

      return c.json({
        success: true,
        booking,
        message: 'Booking created successfully'
      }, 201)
    } catch (error) {
      console.error('Create booking error:', error)
      if (error instanceof HTTPException) throw error
      throw new HTTPException(500, { message: 'Failed to create booking' })
    }
  }

  async getBookingById(c: Context) {
    try {
      const id = c.req.param('id')
      const booking = await this.bookingService.getBookingById(id)

      if (!booking) {
        throw new HTTPException(404, { message: 'Booking not found' })
      }

      return c.json({
        success: true,
        booking
      })
    } catch (error) {
      console.error('Get booking error:', error)
      if (error instanceof HTTPException) throw error
      throw new HTTPException(500, { message: 'Failed to fetch booking' })
    }
  }

  async cancelBooking(c: Context) {
    try {
      const id = c.req.param('id')
      const { reason } = await c.req.json()

      const booking = await this.bookingService.cancelBooking(id, reason)

      return c.json({
        success: true,
        booking,
        message: 'Booking cancelled successfully'
      })
    } catch (error) {
      console.error('Cancel booking error:', error)
      if (error instanceof HTTPException) throw error
      throw new HTTPException(500, { message: 'Failed to cancel booking' })
    }
  }

  async submitFeedback(c: Context) {
    try {
      const id = c.req.param('id')
      const { rating, review } = await c.req.json()

      if (!rating || rating < 1 || rating > 5) {
        throw new HTTPException(400, { message: 'Valid rating (1-5) is required' })
      }

      const booking = await this.bookingService.submitFeedback(id, rating, review)

      return c.json({
        success: true,
        booking,
        message: 'Feedback submitted successfully'
      })
    } catch (error) {
      console.error('Submit feedback error:', error)
      if (error instanceof HTTPException) throw error
      throw new HTTPException(500, { message: 'Failed to submit feedback' })
    }
  }

  async getStats(c: Context) {
    try {
      const stats = await this.bookingService.getBookingStats()

      return c.json({
        success: true,
        stats
      })
    } catch (error) {
      console.error('Get stats error:', error)
      throw new HTTPException(500, { message: 'Failed to fetch statistics' })
    }
  }
}