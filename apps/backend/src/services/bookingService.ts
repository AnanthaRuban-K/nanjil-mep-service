import { db } from '../db/index'
import { bookings, customers, type NewBooking } from '../db/schema.js'
import { eq, desc, and, gte, lt, sql } from 'drizzle-orm'

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
      const totalCost = this.calculateCost(data.serviceType, data.priority)
      
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
      
      // Create customer if doesn't exist
      await this.createOrUpdateCustomer(data.contactInfo)
      
      return booking
      
    } catch (error) {
      console.error('BookingService.createBooking error:', error)
      throw new Error(`Failed to create booking: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  async getBooking(id: string) {
    try {
      const isNumeric = !isNaN(Number(id))
      
      if (isNumeric) {
        const result = await db.select().from(bookings).where(eq(bookings.id, Number(id)))
        return result[0] || null
      } else {
        const result = await db.select().from(bookings).where(eq(bookings.bookingNumber, id))
        return result[0] || null
      }
      
    } catch (error) {
      console.error('getBooking error:', error)
      throw new Error(`Failed to get booking`)
    }
  }

  async getAllBookings(limit = 50, offset = 0, status?: string) {
    try {
      if (status) {
        return await db
          .select()
          .from(bookings)
          .where(eq(bookings.status, status as any))
          .orderBy(desc(bookings.createdAt))
          .limit(limit)
          .offset(offset)
      } else {
        return await db
          .select()
          .from(bookings)
          .orderBy(desc(bookings.createdAt))
          .limit(limit)
          .offset(offset)
      }
    } catch (error) {
      console.error('getAllBookings error:', error)
      throw new Error(`Failed to get bookings`)
    }
  }

  async cancelBooking(bookingId: string, reason?: string) {
    try {
      const isNumeric = !isNaN(Number(bookingId))
      const completedAt = new Date()
      
      const updateData = {
        status: 'cancelled' as const,
        updatedAt: new Date(),
        completedAt
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
      console.error('cancelBooking error:', error)
      throw new Error(`Failed to cancel booking`)
    }
  }

  async submitFeedback(bookingId: string, rating: number, review: string) {
    try {
      const isNumeric = !isNaN(Number(bookingId))
      const updateData = { 
        rating, 
        review, 
        updatedAt: new Date() 
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
      console.error('submitFeedback error:', error)
      throw new Error(`Failed to submit feedback`)
    }
  }

  async getUserBookings(userId: string) {
    try {
      // Since we don't have user authentication fully implemented,
      // return recent bookings for now
      return await db.select()
        .from(bookings)
        .orderBy(desc(bookings.createdAt))
        .limit(20)
    } catch (error) {
      console.error('getUserBookings error:', error)
      throw new Error(`Failed to get user bookings`)
    }
  }

  async getBookingHistory(customerId: string, limit = 20, offset = 0) {
    try {
      return await db.select()
        .from(bookings)
        .orderBy(desc(bookings.createdAt))
        .limit(limit)
        .offset(offset)
    } catch (error) {
      console.error('getBookingHistory error:', error)
      throw new Error(`Failed to get booking history`)
    }
  }

  private generateBookingNumber(): string {
    const date = new Date()
    const year = date.getFullYear().toString().slice(-2)
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
    
    return `NMS${year}${month}${day}${random}`
  }

  private calculateCost(serviceType: 'electrical' | 'plumbing', priority: 'normal' | 'urgent' | 'emergency'): number {
    const baseCosts = {
      electrical: 300,
      plumbing: 350
    }
    
    const priorityMultipliers = {
      normal: 1,
      urgent: 1.2,
      emergency: 1.5
    }
    
    const travelCharge = 50
    const baseCost = baseCosts[serviceType] * priorityMultipliers[priority]
    
    return Math.round(baseCost + travelCharge)
  }

  private async createOrUpdateCustomer(contactInfo: { name: string; phone: string; address: string }) {
    try {
      // Check if customer exists
      const existingCustomer = await db.select()
        .from(customers)
        .where(eq(customers.phone, contactInfo.phone))
        .limit(1)

      if (existingCustomer.length === 0) {
        // Create new customer
        await db.insert(customers).values({
          name: contactInfo.name,
          phone: contactInfo.phone,
          address: contactInfo.address,
          language: 'ta'
        })
      }
    } catch (error) {
      console.error('createOrUpdateCustomer error:', error)
      // Don't throw error as this is secondary functionality
    }
  }
}