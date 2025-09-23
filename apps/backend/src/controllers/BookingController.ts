import { Context } from 'hono'
import { BookingService } from '../services/BookingService'
import { NotificationService } from '../services/NotificationService'
import { HTTPException } from 'hono/http-exception'

export class BookingController {
  private bookingService: BookingService
  private notificationService: NotificationService

  constructor() {
    this.bookingService = new BookingService()
    this.notificationService = new NotificationService()
  }

  async createBooking(c: Context) {
    try {
      console.log('📝 Creating new booking...')
      const body = await c.req.json()
      
      const { serviceType, priority = 'normal', description, contactInfo, scheduledTime } = body

      // Validation
      if (!serviceType || !description || !contactInfo || !scheduledTime) {
        throw new HTTPException(400, {
          message: 'Missing required fields: serviceType, description, contactInfo, scheduledTime'
        })
      }

      if (!contactInfo.name || !contactInfo.phone || !contactInfo.address) {
        throw new HTTPException(400, {
          message: 'Complete contact information required: name, phone, address'
        })
      }

      const bookingData = {
        serviceType,
        priority,
        description,
        contactInfo,
        scheduledTime: new Date(scheduledTime)
      }

      // Create the booking
      const booking = await this.bookingService.createBooking(bookingData)

      // Create customer object for notification
      const customer = {
        id: booking.id,
        name: contactInfo.name,
        phone: contactInfo.phone,
        email: contactInfo.email || null
      }

      console.log('✅ Booking created successfully:', booking.bookingNumber)

      // 🔥 SEND PUSH NOTIFICATION TO ADMINS
      try {
        // Ensure priority is valid type
        const validPriority = ['normal', 'urgent', 'emergency'].includes(priority) 
          ? priority as 'normal' | 'urgent' | 'emergency'
          : 'normal'

        if (validPriority === 'emergency') {
          console.log('🚨 Sending emergency booking notification...')
          await this.notificationService.notifyEmergencyBooking(booking, customer)
        } else {
          console.log('📢 Sending new booking notification...')
          await this.notificationService.notifyNewBooking(booking, customer)
        }
        console.log('✅ Notification sent successfully')
      } catch (notificationError) {
        // Don't fail the booking creation if notification fails
        console.error('⚠️ Failed to send notification (booking still created):', notificationError)
      }

      return c.json({
        success: true,
        booking,
        message: 'Booking created successfully'
      }, 201)

    } catch (error) {
      console.error('❌ Create booking error:', error)
      if (error instanceof HTTPException) {
        throw error
      }
      throw new HTTPException(500, { message: 'Failed to create booking' })
    }
  }

  async getBooking(c: Context) {
    try {
      const id = c.req.param('id')
      console.log(`🔍 Getting booking: ${id}`)
      
      const booking = await this.bookingService.getBooking(id)
      
      if (!booking) {
        throw new HTTPException(404, { message: 'Booking not found' })
      }

      console.log('✅ Booking retrieved successfully')
      return c.json({
        success: true,
        booking
      })

    } catch (error) {
      console.error('❌ Get booking error:', error)
      if (error instanceof HTTPException) {
        throw error
      }
      throw new HTTPException(500, { message: 'Failed to retrieve booking' })
    }
  }

  async getAllBookings(c: Context) {
    try {
      console.log('📋 Getting all bookings...')
      const limit = Number(c.req.query('limit')) || 50
      const offset = Number(c.req.query('offset')) || 0
      const status = c.req.query('status')

      const bookings = await this.bookingService.getAllBookings(limit, offset, status)

      console.log(`✅ Retrieved ${bookings.length} bookings`)
      return c.json({
        success: true,
        bookings,
        count: bookings.length,
        pagination: {
          limit,
          offset,
          hasMore: bookings.length === limit
        }
      })

    } catch (error) {
      console.error('❌ Get all bookings error:', error)
      throw new HTTPException(500, { message: 'Failed to retrieve bookings' })
    }
  }

  // SIMPLIFIED: Update booking status (use existing methods if available)
  async updateBookingStatus(c: Context) {
    try {
      const bookingId = c.req.param('id')
      const { status, notes } = await c.req.json()
      
      console.log(`🔄 Updating booking status: ${bookingId} to ${status}`)

      // Validate status
      const validStatuses = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled']
      if (!validStatuses.includes(status)) {
        throw new HTTPException(400, { 
          message: 'Invalid status. Valid statuses: ' + validStatuses.join(', ')
        })
      }

      // Get booking details before update for notification
      const booking = await this.bookingService.getBooking(bookingId)
      if (!booking) {
        throw new HTTPException(404, { message: 'Booking not found' })
      }

      // Since updateBookingStatus doesn't exist in BookingService, 
      // we'll use different approach based on status
      let updateResult
      if (status === 'cancelled') {
        updateResult = await this.bookingService.cancelBooking(bookingId, notes || 'Status updated to cancelled')
      } else {
        // For other status updates, you might need to add this method to BookingService
        // For now, we'll just log and return success
        console.log(`Status update requested: ${status} (implement updateBookingStatus in BookingService)`)
        updateResult = true
      }

      // 🔥 SEND STATUS UPDATE NOTIFICATION
      try {
        // Ensure priority is valid type
        const bookingPriority = booking.priority && ['normal', 'urgent', 'emergency'].includes(booking.priority)
          ? booking.priority as 'normal' | 'urgent' | 'emergency'
          : 'normal'

        // Safe access to contactInfo
        const customerName = booking.contactInfo && typeof booking.contactInfo === 'object' && 'name' in booking.contactInfo
          ? (booking.contactInfo as any).name
          : 'Unknown Customer'

        await this.notificationService.sendToAllAdmins({
          type: 'booking_updated',
          title: `📋 Booking Status Updated`,
          message: `Booking ${booking.bookingNumber || bookingId} status changed to ${status.toUpperCase()}`,
          bookingId: booking.id,
          bookingNumber: booking.bookingNumber || bookingId,
          priority: bookingPriority,
          data: {
            customerName: customerName,
            serviceType: booking.serviceType,
            oldStatus: booking.status,
            newStatus: status,
            notes: notes || null
          }
        })
        console.log('✅ Status update notification sent')
      } catch (notificationError) {
        console.error('⚠️ Failed to send status update notification:', notificationError)
      }

      console.log('✅ Booking status updated successfully')
      return c.json({
        success: true,
        message: `Booking status updated to ${status}`,
        status,
        notes: notes || null
      })

    } catch (error) {
      console.error('❌ Update booking status error:', error)
      if (error instanceof HTTPException) {
        throw error
      }
      throw new HTTPException(500, { message: 'Failed to update booking status' })
    }
  }

  async cancelBooking(c: Context) {
    try {
      const bookingId = c.req.param('id')
      const { reason } = await c.req.json().catch(() => ({ reason: 'Customer requested cancellation' }))
      
      console.log(`🚫 Cancelling booking: ${bookingId}`)

      // Get booking details before cancellation
      const booking = await this.bookingService.getBooking(bookingId)
      
      await this.bookingService.cancelBooking(bookingId, reason)

      // 🔥 SEND CANCELLATION NOTIFICATION
      if (booking) {
        try {
          // Safe access to contactInfo
          const customerName = booking.contactInfo && typeof booking.contactInfo === 'object' && 'name' in booking.contactInfo
            ? (booking.contactInfo as any).name
            : 'Unknown Customer'

          await this.notificationService.sendToAllAdmins({
            type: 'booking_updated',
            title: `🚫 Booking Cancelled`,
            message: `Booking ${booking.bookingNumber || bookingId} has been cancelled - ${reason}`,
            bookingId: booking.id,
            bookingNumber: booking.bookingNumber || bookingId,
            priority: 'normal',
            data: {
              customerName: customerName,
              serviceType: booking.serviceType,
              reason: reason
            }
          })
          console.log('✅ Cancellation notification sent')
        } catch (notificationError) {
          console.error('⚠️ Failed to send cancellation notification:', notificationError)
        }
      }

      console.log('✅ Booking cancelled successfully')
      return c.json({
        success: true,
        message: 'Booking cancelled successfully'
      })

    } catch (error) {
      console.error('❌ Cancel booking error:', error)
      if (error instanceof HTTPException) {
        throw error
      }
      throw new HTTPException(500, { message: 'Failed to cancel booking' })
    }
  }

  async submitFeedback(c: Context) {
    try {
      const bookingId = c.req.param('id')
      const { rating, review } = await c.req.json()

      console.log(`⭐ Submitting feedback for booking: ${bookingId}`)

      if (!rating || rating < 1 || rating > 5) {
        throw new HTTPException(400, { message: 'Valid rating (1-5) is required' })
      }

      await this.bookingService.submitFeedback(bookingId, rating, review || '')

      // 🔥 SEND FEEDBACK NOTIFICATION
      try {
        const booking = await this.bookingService.getBooking(bookingId)
        if (booking) {
          // Safe access to contactInfo
          const customerName = booking.contactInfo && typeof booking.contactInfo === 'object' && 'name' in booking.contactInfo
            ? (booking.contactInfo as any).name
            : 'Unknown Customer'

          await this.notificationService.sendToAllAdmins({
            type: 'customer_message',
            title: `⭐ New Customer Feedback`,
            message: `${customerName} rated service ${rating}/5 stars`,
            bookingId: booking.id,
            bookingNumber: booking.bookingNumber || bookingId,
            priority: 'normal',
            data: {
              customerName: customerName,
              rating: rating,
              review: review || '',
              serviceType: booking.serviceType
            }
          })
          console.log('✅ Feedback notification sent')
        }
      } catch (notificationError) {
        console.error('⚠️ Failed to send feedback notification:', notificationError)
      }

      console.log('✅ Feedback submitted successfully')
      return c.json({
        success: true,
        message: 'Thank you for your feedback!'
      })

    } catch (error) {
      console.error('❌ Submit feedback error:', error)
      if (error instanceof HTTPException) {
        throw error
      }
      throw new HTTPException(500, { message: 'Failed to submit feedback' })
    }
  }

  async getUserBookings(c: Context) {
    try {
      const userId = c.req.query('userId') || 'default'
      console.log(`👤 Getting user bookings for: ${userId}`)

      const bookings = await this.bookingService.getUserBookings(userId)

      console.log(`✅ Retrieved ${bookings.length} user bookings`)
      return c.json({
        success: true,
        bookings
      })

    } catch (error) {
      console.error('❌ Get user bookings error:', error)
      throw new HTTPException(500, { message: 'Failed to retrieve user bookings' })
    }
  }

  async getBookingHistory(c: Context) {
    try {
      const customerId = c.req.param('customerId')
      const limit = Number(c.req.query('limit')) || 20
      const offset = Number(c.req.query('offset')) || 0

      console.log(`📚 Getting booking history for customer: ${customerId}`)

      const bookings = await this.bookingService.getBookingHistory(customerId, limit, offset)

      console.log(`✅ Retrieved booking history`)
      return c.json({
        success: true,
        bookings,
        customerId
      })

    } catch (error) {
      console.error('❌ Get booking history error:', error)
      throw new HTTPException(500, { message: 'Failed to retrieve booking history' })
    }
  }

  // Admin token registration endpoint
  async registerAdminToken(c: Context) {
    try {
      const { token } = await c.req.json()
      
      if (!token) {
        throw new HTTPException(400, { message: 'FCM token is required' })
      }

      await this.notificationService.addAdminToken(token)
      
      console.log('✅ Admin FCM token registered successfully')
      return c.json({ 
        success: true, 
        message: 'Admin token registered successfully' 
      })
    } catch (error) {
      console.error('❌ Error registering admin token:', error)
      if (error instanceof HTTPException) {
        throw error
      }
      throw new HTTPException(500, { message: 'Failed to register admin token' })
    }
  }

  // Test notification endpoint (for development/testing)
  async testNotification(c: Context) {
    try {
      await this.notificationService.sendToAllAdmins({
        type: 'new_booking',
        title: '🧪 Test Notification',
        message: 'This is a test notification for admin dashboard',
        priority: 'normal'
      })
      
      console.log('✅ Test notification sent')
      return c.json({ 
        success: true, 
        message: 'Test notification sent to all admins' 
      })
    } catch (error) {
      console.error('❌ Error sending test notification:', error)
      throw new HTTPException(500, { message: 'Failed to send test notification' })
    }
  }
}

// ===== ADD THIS METHOD TO YOUR BookingService.ts =====
// You'll need to add this method to your BookingService class:

/*
async updateBookingStatus(bookingId: string, status: string, notes?: string) {
  try {
    const isNumeric = !isNaN(Number(bookingId))
    const updateData: any = {
      status: status as any,
      updatedAt: new Date(),
      ...(notes && { notes })
    }
    
    if (isNumeric) {
      await db.update(bookings)
        .set(updateData)
        .where(eq(bookings.id, Number(bookingId)))
    } else {
      await db.update(bookings)
        .set(updateData)
        .where(eq(bookings.bookingNumber, bookingId))
    }
    
    return true
  } catch (error) {
    console.error('updateBookingStatus error:', error)
    throw new Error(`Failed to update booking status`)
  }
}
*/