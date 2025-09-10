import { db } from '../db/index.js'
import { bookings, type NewBooking } from '../db/schema.js'
import { eq, desc, and, gte, lt } from 'drizzle-orm'

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

  async updateBookingStatus(bookingId: string, status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled') {
    try {
      const isNumeric = !isNaN(Number(bookingId))
      const completedAt = status === 'completed' ? new Date() : undefined
      
      const updateData: any = {
        status,
        updatedAt: new Date(),
        ...(completedAt && { completedAt })
      }
      
      if (isNumeric) {
        await db.update(bookings).set(updateData).where(eq(bookings.id, Number(bookingId)))
      } else {
        await db.update(bookings).set(updateData).where(eq(bookings.bookingNumber, bookingId))
      }
      
      return true
    } catch (error) {
      console.error('updateBookingStatus error:', error)
      throw new Error(`Failed to update booking status`)
    }
  }

  async cancelBooking(bookingId: string, reason?: string) {
    try {
      return this.updateBookingStatus(bookingId, 'cancelled')
    } catch (error) {
      console.error('cancelBooking error:', error)
      throw new Error(`Failed to cancel booking`)
    }
  }

  async rateBooking(bookingId: string, rating: number, review: string) {
    try {
      const isNumeric = !isNaN(Number(bookingId))
      const updateData = { rating, review, updatedAt: new Date() }
      
      if (isNumeric) {
        await db.update(bookings).set(updateData).where(eq(bookings.id, Number(bookingId)))
      } else {
        await db.update(bookings).set(updateData).where(eq(bookings.bookingNumber, bookingId))
      }
      
      return true
    } catch (error) {
      console.error('rateBooking error:', error)
      throw new Error(`Failed to rate booking`)
    }
  }

  async getDashboardMetrics() {
    try {
      const allBookings = await db.select().from(bookings)
      
      const today = new Date()
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
      
      const todayBookings = allBookings.filter(b => {
        const bookingDate = new Date(b.createdAt || '')
        return bookingDate >= startOfDay && bookingDate < endOfDay
      })
      
      return {
        today: {
          bookings: todayBookings.length,
          completed: todayBookings.filter(b => b.status === 'completed').length,
          pending: todayBookings.filter(b => b.status === 'pending').length,
          inProgress: todayBookings.filter(b => b.status === 'in_progress').length,
          revenue: todayBookings
            .filter(b => b.status === 'completed')
            .reduce((sum, b) => sum + parseFloat(b.totalCost || '0'), 0)
        },
        overall: {
          totalBookings: allBookings.length,
          completedJobs: allBookings.filter(b => b.status === 'completed').length,
          pendingJobs: allBookings.filter(b => b.status === 'pending').length,
          emergencyJobs: allBookings.filter(b => b.priority === 'emergency').length,
          totalRevenue: allBookings
            .filter(b => b.status === 'completed')
            .reduce((sum, b) => sum + parseFloat(b.totalCost || '0'), 0)
        }
      }
    } catch (error) {
      console.error('getDashboardMetrics error:', error)
      throw new Error(`Failed to get dashboard metrics`)
    }
  }

  private generateBookingNumber(): string {
    const date = new Date()
    const year = date.getFullYear().toString().slice(-2)
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    
    return `NMS${year}${month}${day}${random}`
  }

  private calculateBasicCost(serviceType: 'electrical' | 'plumbing', priority: 'normal' | 'urgent' | 'emergency'): number {
    const baseCosts = {
      electrical: 300,
      plumbing: 350
    }
    
    const priorityMultipliers = {
      normal: 1,
      urgent: 1.2,
      emergency: 1.5
    }
    
    return Math.round(baseCosts[serviceType] * priorityMultipliers[priority])
  }
}