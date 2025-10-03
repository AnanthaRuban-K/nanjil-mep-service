import { db } from '../db/index'
import { bookings, services, type NewBooking } from '../db/schema'
import { eq, desc, asc, and, or, gte, lte, count, sql } from 'drizzle-orm'
import { HTTPException } from 'hono/http-exception'
import { NotificationService } from './NotificationService'
export class BookingService {

    private notificationService: NotificationService

  constructor() {
    this.notificationService = new NotificationService()
  }

  private generateBookingNumber(): string {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const timestamp = Date.now().toString().slice(-6)
    return `NMP-${year}${month}${day}-${timestamp}`
  }

  private async calculateEstimatedCost(serviceType: string, priority: string): Promise<number> {
    try {
      const service = await db.select({ baseCost: services.baseCost })
        .from(services)
        .where(and(eq(services.category, serviceType), eq(services.isActive, 'true')))
        .limit(1)

      let basePrice = service.length > 0 ? Number(service[0].baseCost) : (serviceType === 'electrical' ? 300 : 350)
      
      if (priority === 'urgent') basePrice *= 1.3
      if (priority === 'emergency') basePrice *= 1.5
      
      return Math.round(basePrice)
    } catch (error) {
      let basePrice = serviceType === 'electrical' ? 300 : 350
      if (priority === 'urgent') basePrice *= 1.3
      if (priority === 'emergency') basePrice *= 1.5
      return Math.round(basePrice)
    }
  }

  private validateContactInfo(contactInfo: any) {
    if (!contactInfo || typeof contactInfo !== 'object') {
      throw new HTTPException(400, { message: 'Contact information is required' })
    }
    
    if (!contactInfo.name || !contactInfo.phone || !contactInfo.address) {
      throw new HTTPException(400, { message: 'Complete contact information required: name, phone, address' })
    }
    
    const phoneRegex = /^(\+91|91)?[6-9]\d{9}$/
    if (!phoneRegex.test(contactInfo.phone.replace(/\s|-/g, ''))) {
      throw new HTTPException(400, { message: 'Please provide a valid Indian phone number' })
    }
  }

  async getBookings(params: any) {
    try {
      const whereConditions = []
      
      if (params.status) whereConditions.push(eq(bookings.status, params.status))
      if (params.serviceType) whereConditions.push(eq(bookings.serviceType, params.serviceType))
      if (params.priority) whereConditions.push(eq(bookings.priority, params.priority))
      if (params.dateFrom) whereConditions.push(gte(bookings.createdAt, new Date(params.dateFrom)))
      if (params.dateTo) whereConditions.push(lte(bookings.createdAt, new Date(params.dateTo)))
      
      const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined
      const orderByColumn = params.sortBy === 'scheduledTime' ? bookings.scheduledTime : bookings.createdAt
      const orderDirection = params.sortOrder === 'asc' ? asc(orderByColumn) : desc(orderByColumn)
      
      const bookingsList = await db.select()
        .from(bookings)
        .where(whereClause)
        .orderBy(orderDirection)
        .limit(params.limit)
        .offset(params.offset)
      
      const totalCountResult = await db.select({ count: count() })
        .from(bookings)
        .where(whereClause)
      
      const totalCount = totalCountResult[0]?.count || 0
      
      let filteredBookings = bookingsList
      if (params.search) {
        const searchLower = params.search.toLowerCase()
        filteredBookings = bookingsList.filter(booking => 
          booking.bookingNumber.toLowerCase().includes(searchLower) ||
          (booking.contactInfo as any)?.name?.toLowerCase().includes(searchLower)
        )
      }
      
      return {
        bookings: filteredBookings,
        count: filteredBookings.length,
        total: totalCount,
        pagination: {
          limit: params.limit,
          offset: params.offset,
          hasMore: params.offset + params.limit < totalCount
        }
      }
    } catch (error) {
      console.error('getBookings error:', error)
      return { bookings: [], count: 0, total: 0, pagination: { limit: 0, offset: 0, hasMore: false } }
    }
  }

  async getMyBookings(params: { userPhone?: string; userEmail?: string; userId?: string }) {
    try {
      if (!params.userPhone && !params.userEmail && !params.userId) {
        return []
      }
      
      if (params.userPhone) {
        return await db.select()
          .from(bookings)
          .where(sql`${bookings.contactInfo}->>'phone' = ${params.userPhone}`)
          .orderBy(desc(bookings.createdAt))
      } else if (params.userEmail) {
        return await db.select()
          .from(bookings)
          .where(sql`${bookings.contactInfo}->>'email' = ${params.userEmail}`)
          .orderBy(desc(bookings.createdAt))
      }
      
      return []
    } catch (error) {
      console.error('getMyBookings error:', error)
      return []
    }
  }

  async createBooking(data: any) {
    const { serviceType, priority = 'normal', description, contactInfo, scheduledTime } = data
    
    if (!serviceType || !description || !contactInfo || !scheduledTime) {
      throw new HTTPException(400, { message: 'Missing required fields' })
    }
    
    this.validateContactInfo(contactInfo)
    
    const serviceExists = await db.select({ id: services.id })
      .from(services)
      .where(and(eq(services.category, serviceType), eq(services.isActive, 'true')))
      .limit(1)
    
    if (serviceExists.length === 0) {
      throw new HTTPException(400, { message: 'Invalid service type' })
    }
    
    const scheduledDate = new Date(scheduledTime)
    if (scheduledDate <= new Date()) {
      throw new HTTPException(400, { message: 'Scheduled time must be in the future' })
    }
    
    const estimatedCost = await this.calculateEstimatedCost(serviceType, priority)
    
    const newBookingData: NewBooking = {
      bookingNumber: this.generateBookingNumber(),
      serviceType,
      priority,
      description,
      contactInfo,
      scheduledTime: scheduledDate,
      status: 'pending',
      totalCost: estimatedCost.toString()
    }
    
    const [createdBooking] = await db.insert(bookings).values(newBookingData).returning()
    
    // Send notification to admins
    if (createdBooking.priority === 'emergency') {
      await this.notificationService.notifyEmergencyBooking(createdBooking.id, createdBooking)
    } else {
      await this.notificationService.notifyNewBooking(createdBooking.id, createdBooking)
    }
    
    return createdBooking
  }

  async getBookingById(id: string) {
    try {
      const booking = await db.select()
        .from(bookings)
        .where(or(eq(bookings.id, parseInt(id) || 0), eq(bookings.bookingNumber, id)))
        .limit(1)
      
      return booking[0] || null
    } catch (error) {
      console.error('getBookingById error:', error)
      return null
    }
  }

  async cancelBooking(id: string, reason?: string) {
    const booking = await this.getBookingById(id)
    
    if (!booking) {
      throw new HTTPException(404, { message: 'Booking not found' })
    }
    
    if (booking.status === 'completed' || booking.status === 'cancelled') {
      throw new HTTPException(400, { message: `Cannot cancel booking with status: ${booking.status}` })
    }
    
    const [updatedBooking] = await db.update(bookings)
      .set({ status: 'cancelled', updatedAt: new Date() })
      .where(eq(bookings.id, booking.id))
      .returning()
    
    return updatedBooking
  }

  async submitFeedback(id: string, rating: number, review?: string) {
    const booking = await this.getBookingById(id)
    
    if (!booking) {
      throw new HTTPException(404, { message: 'Booking not found' })
    }
    
    if (booking.status !== 'completed') {
      throw new HTTPException(400, { message: 'Feedback can only be submitted for completed bookings' })
    }
    
    const [updatedBooking] = await db.update(bookings)
      .set({ rating, review: review || null, updatedAt: new Date() })
      .where(eq(bookings.id, booking.id))
      .returning()
    
    return updatedBooking
  }

  async getBookingStats() {
    try {
      const statusCounts = await db.select({ status: bookings.status, count: count() })
        .from(bookings)
        .groupBy(bookings.status)
      
      const serviceCounts = await db.select({ serviceType: bookings.serviceType, count: count() })
        .from(bookings)
        .groupBy(bookings.serviceType)
      
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
      
      const todayBookings = await db.select({ count: count() })
        .from(bookings)
        .where(and(gte(bookings.createdAt, today), lte(bookings.createdAt, tomorrow)))
      
      return {
        statusCounts: statusCounts.reduce((acc, { status, count }) => {
          acc[status] = count
          return acc
        }, {} as Record<string, number>),
        serviceCounts: serviceCounts.reduce((acc, { serviceType, count }) => {
          acc[serviceType] = count
          return acc
        }, {} as Record<string, number>),
        todayBookings: todayBookings[0]?.count || 0
      }
    } catch (error) {
      console.error('getBookingStats error:', error)
      return { statusCounts: {}, serviceCounts: {}, todayBookings: 0 }
    }
  }
}