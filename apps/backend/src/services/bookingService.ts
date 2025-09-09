// apps/backend/src/services/bookingService.ts - SIMPLIFIED VERSION
import { db } from '../db/index.js'
import { bookings, type NewBooking } from '../db/schema'
import { eq, desc, and,gte,lt } from 'drizzle-orm'

export class BookingService {
  async createBooking(data: {
    serviceType: 'electrical' | 'plumbing'
    priority: 'normal' | 'urgent' | 'emergency'
    description: string
    contactInfo: {
      name: string
      phone: string
      address: string
    }
    scheduledTime: Date
  }) {
    try {
      const bookingNumber = this.generateBookingNumber()
      const totalCost = this.calculateBasicCost(data.serviceType, data.priority)
      
      const newBooking: NewBooking = {
        bookingNumber,
        serviceType: data.serviceType,
        priority: data.priority,
        description: data.description,
        contactInfo: data.contactInfo,
        scheduledTime: data.scheduledTime,
        totalCost: totalCost.toString(),
        status: 'pending'
      }
      
      const [booking] = await db.insert(bookings).values(newBooking).returning()
      return booking
      
    } catch (error) {
      console.error('BookingService.createBooking error:', error)
      throw new Error(`Failed to create booking: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  async getBookingById(id: number) {
    try {
      const [booking] = await db.select().from(bookings).where(eq(bookings.id, id))
      return booking || null
    } catch (error) {
      console.error('getBookingById error:', error)
      throw new Error(`Failed to get booking`)
    }
  }

  async getBookingByNumber(bookingNumber: string) {
    try {
      const [booking] = await db.select().from(bookings).where(eq(bookings.bookingNumber, bookingNumber))
      return booking || null
    } catch (error) {
      console.error('getBookingByNumber error:', error)
      throw new Error(`Failed to get booking`)
    }
  }

  async getAllBookings(limit = 50, offset = 0) {
    try {
      return await db
        .select()
        .from(bookings)
        .orderBy(desc(bookings.createdAt))
        .limit(limit)
        .offset(offset)
    } catch (error) {
      console.error('getAllBookings error:', error)
      throw new Error(`Failed to get bookings`)
    }
  }

  // SIMPLIFIED status updates
  async updateBookingStatus(bookingId: string, status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled') {
    try {
      const isNumeric = !isNaN(Number(bookingId))
      const completedAt = status === 'completed' ? new Date() : null
      
      if (isNumeric) {
        await db
          .update(bookings)
          .set({ 
            status, 
            updatedAt: new Date(),
            completedAt
          })
          .where(eq(bookings.id, Number(bookingId)))
      } else {
        await db
          .update(bookings)
          .set({ 
            status, 
            updatedAt: new Date(),
            completedAt
          })
          .where(eq(bookings.bookingNumber, bookingId))
      }
    } catch (error) {
      console.error('updateBookingStatus error:', error)
      throw new Error(`Failed to update booking status`)
    }
  }

  // SIMPLIFIED rating system
  async rateBooking(bookingId: string, rating: number, review: string) {
    try {
      const isNumeric = !isNaN(Number(bookingId))
      
      if (isNumeric) {
        await db
          .update(bookings)
          .set({ rating, review, updatedAt: new Date() })
          .where(eq(bookings.id, Number(bookingId)))
      } else {
        await db
          .update(bookings)
          .set({ rating, review, updatedAt: new Date() })
          .where(eq(bookings.bookingNumber, bookingId))
      }
    } catch (error) {
      console.error('rateBooking error:', error)
      throw new Error(`Failed to rate booking`)
    }
  }

  async cancelBooking(bookingId: string, reason?: string) {
    try {
      await this.updateBookingStatus(bookingId, 'cancelled')
      console.log(`Booking ${bookingId} cancelled. Reason: ${reason || 'No reason provided'}`)
    } catch (error) {
      throw new Error(`Failed to cancel booking`)
    }
  }

  // SIMPLIFIED admin dashboard metrics
  async getDashboardMetrics() {
    try {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)

      // Get today's bookings
      const todayBookings = await db
  .select()
  .from(bookings)
  .where(
    and(
      gte(bookings.createdAt, today),
      lt(bookings.createdAt, tomorrow)
    )
  )

      // Get all bookings for status counts
      const allBookings = await db.select().from(bookings)
      
      const metrics = {
        todayBookings: todayBookings.length,
        completedJobs: allBookings.filter(b => b.status === 'completed').length,
        pendingJobs: allBookings.filter(b => b.status === 'pending').length,
        emergencyJobs: allBookings.filter(b => b.priority === 'emergency' && b.status !== 'completed').length,
        totalBookings: allBookings.length
      }

      return metrics
    } catch (error) {
      console.error('getDashboardMetrics error:', error)
      return {
        todayBookings: 0,
        completedJobs: 0,
        pendingJobs: 0,
        emergencyJobs: 0,
        totalBookings: 0
      }
    }
  }

  private generateBookingNumber(): string {
    const timestamp = Date.now().toString()
    const random = Math.floor(Math.random() * 999).toString().padStart(3, '0')
    return `NMS${timestamp.slice(-6)}${random}`
  }

  // SIMPLIFIED cost calculation
  private calculateBasicCost(serviceType: string, priority: string): number {
    const serviceFees = {
      electrical: 300,
      plumbing: 350
    }
    
    const baseCost = serviceFees[serviceType as keyof typeof serviceFees] || 300
    const emergencyMultiplier = priority === 'emergency' ? 1.5 : priority === 'urgent' ? 1.2 : 1
    const travelCharge = 50
    
    return Math.round((baseCost * emergencyMultiplier) + travelCharge)
  }
}

// REMOVED COMPLEX METHODS:
// - assignTeam()
// - updateLocation()
// - uploadPhotos()
// - calculateDistance()
// - sendNotifications()
// - getPerformanceMetrics()
// - manageInventory()