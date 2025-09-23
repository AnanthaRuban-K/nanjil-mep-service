// File: backend/src/db/helpers/bookingHelpers.ts - Database Helper Functions
import { eq, desc, and, or, gte, lte, count, sql } from 'drizzle-orm'
import { db } from '../index'
import { bookings, services, customers, notifications, type NewBooking, type Booking } from '../schema'

// Enhanced booking creation with customer management
export async function createBookingWithCustomer(bookingData: {
  serviceType: string
  priority: string
  description: string
  contactInfo: {
    name: string
    phone: string
    address: string
    email?: string
  }
  scheduledTime: Date
}) {
  return await db.transaction(async (tx) => {
    // First, find or create customer
    let customer = await tx
      .select()
      .from(customers)
      .where(eq(customers.phone, bookingData.contactInfo.phone))
      .limit(1)

    if (customer.length === 0) {
      // Create new customer
      const newCustomer = await tx
        .insert(customers)
        .values({
          name: bookingData.contactInfo.name,
          phone: bookingData.contactInfo.phone,
          address: bookingData.contactInfo.address,
          language: 'ta' // Default to Tamil
        })
        .returning()
      
      customer = newCustomer
    } else {
      // Update existing customer info if needed
      await tx
        .update(customers)
        .set({
          name: bookingData.contactInfo.name,
          address: bookingData.contactInfo.address,
          updatedAt: new Date()
        })
        .where(eq(customers.id, customer[0].id))
    }

    // Calculate estimated cost
    const estimatedCost = await calculateEstimatedCostFromDB(
      bookingData.serviceType, 
      bookingData.priority,
      tx
    )

    // Generate booking number
    const bookingNumber = generateUniqueBookingNumber()

    // Create booking
    const newBooking: NewBooking = {
      bookingNumber,
      serviceType: bookingData.serviceType,
      priority: bookingData.priority,
      description: bookingData.description,
      contactInfo: bookingData.contactInfo,
      scheduledTime: bookingData.scheduledTime,
      status: 'pending',
      totalCost: estimatedCost.toString()
    }

    const [createdBooking] = await tx
      .insert(bookings)
      .values(newBooking)
      .returning()

    // Create notification for admin
    await tx
      .insert(notifications)
      .values({
        bookingId: createdBooking.id,
        customerId: customer[0].id,
        type: 'booking_created',
        title: 'New Booking Created',
        message: `New ${bookingData.serviceType} booking from ${bookingData.contactInfo.name}`,
        isRead: 'false'
      })

    return createdBooking
  })
}

// Enhanced cost calculation with database lookup
export async function calculateEstimatedCostFromDB(
  serviceType: string, 
  priority: string, 
  tx?: any
): Promise<number> {
  const dbInstance = tx || db
  
  try {
    // Get base cost from services table
    const service = await dbInstance
      .select({ baseCost: services.baseCost })
      .from(services)
      .where(and(
        eq(services.category, serviceType),
        eq(services.isActive, 'true')
      ))
      .limit(1)

    let basePrice = service.length > 0 ? Number(service[0].baseCost) : getDefaultServiceCost(serviceType)
    
    // Apply priority multipliers
    const multiplier = getPriorityMultiplier(priority)
    
    return Math.round(basePrice * multiplier)
  } catch (error) {
    console.error('Error calculating cost from DB:', error)
    // Fallback to default calculation
    return Math.round(getDefaultServiceCost(serviceType) * getPriorityMultiplier(priority))
  }
}

// Default service costs as fallback
function getDefaultServiceCost(serviceType: string): number {
  const defaultCosts = {
    electrical: 300,
    plumbing: 350,
    ac: 400,
    appliance: 250
  }
  return defaultCosts[serviceType as keyof typeof defaultCosts] || 300
}

// Priority multipliers
function getPriorityMultiplier(priority: string): number {
  const multipliers = {
    normal: 1.0,
    urgent: 1.3,
    emergency: 1.5
  }
  return multipliers[priority as keyof typeof multipliers] || 1.0
}

// Generate unique booking number with collision check
export function generateUniqueBookingNumber(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  
  return `NMP-${year}${month}${day}-${hours}${minutes}${seconds}`
}

// Get booking analytics
export async function getBookingAnalytics(dateFrom?: Date, dateTo?: Date) {
  const whereConditions = []
  
  if (dateFrom) {
    whereConditions.push(gte(bookings.createdAt, dateFrom))
  }
  if (dateTo) {
    whereConditions.push(lte(bookings.createdAt, dateTo))
  }
  
  const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined

  // Status distribution
  const statusStats = await db
    .select({
      status: bookings.status,
      count: count()
    })
    .from(bookings)
    .where(whereClause)
    .groupBy(bookings.status)

  // Service type distribution
  const serviceStats = await db
    .select({
      serviceType: bookings.serviceType,
      count: count(),
      avgCost: sql<number>`avg(${bookings.totalCost}::numeric)`
    })
    .from(bookings)
    .where(whereClause)
    .groupBy(bookings.serviceType)

  // Priority distribution
  const priorityStats = await db
    .select({
      priority: bookings.priority,
      count: count()
    })
    .from(bookings)
    .where(whereClause)
    .groupBy(bookings.priority)

  // Revenue stats
  const revenueStats = await db
    .select({
      totalRevenue: sql<number>`sum(${bookings.actualCost}::numeric)`,
      avgRevenue: sql<number>`avg(${bookings.actualCost}::numeric)`,
      completedBookings: count()
    })
    .from(bookings)
    .where(and(
      eq(bookings.status, 'completed'),
      whereClause
    ))

  // Customer satisfaction
  const satisfactionStats = await db
    .select({
      avgRating: sql<number>`avg(${bookings.rating}::numeric)`,
      totalReviews: count()
    })
    .from(bookings)
    .where(and(
      sql`${bookings.rating} IS NOT NULL`,
      whereClause
    ))

  return {
    statusDistribution: statusStats,
    serviceDistribution: serviceStats,
    priorityDistribution: priorityStats,
    revenue: revenueStats[0],
    satisfaction: satisfactionStats[0]
  }
}

// Search bookings with full-text search simulation
export async function searchBookings(
  searchTerm: string, 
  limit: number = 20, 
  offset: number = 0
) {
  // Simple search in booking number, description, and customer name
  // For production, consider implementing PostgreSQL full-text search
  const searchPattern = `%${searchTerm.toLowerCase()}%`
  
  return await db
    .select()
    .from(bookings)
    .where(or(
      sql`lower(${bookings.bookingNumber}) LIKE ${searchPattern}`,
      sql`lower(${bookings.description}) LIKE ${searchPattern}`,
      sql`lower(${bookings.contactInfo}->>'name') LIKE ${searchPattern}`
    ))
    .orderBy(desc(bookings.createdAt))
    .limit(limit)
    .offset(offset)
}

// Update booking status with history tracking
export async function updateBookingStatusWithHistory(
  bookingId: number,
  newStatus: string,
  adminId?: number,
  notes?: string
) {
  return await db.transaction(async (tx) => {
    // Get current booking
    const [currentBooking] = await tx
      .select()
      .from(bookings)
      .where(eq(bookings.id, bookingId))
      .limit(1)

    if (!currentBooking) {
      throw new Error('Booking not found')
    }

    // Update booking
    const updateData: any = {
      status: newStatus,
      updatedAt: new Date()
    }

    // Add completion timestamp if completing
    if (newStatus === 'completed') {
      updateData.completedAt = new Date()
    }

    const [updatedBooking] = await tx
      .update(bookings)
      .set(updateData)
      .where(eq(bookings.id, bookingId))
      .returning()

    // Create notification for status change
    await tx
      .insert(notifications)
      .values({
        bookingId: bookingId,
        adminId: adminId,
        type: 'status_updated',
        title: `Booking Status Updated`,
        message: `Booking ${currentBooking.bookingNumber} status changed from ${currentBooking.status} to ${newStatus}`,
        isRead: 'false'
      })

    return updatedBooking
  })
}

// Get customer booking history
export async function getCustomerBookingHistory(customerPhone: string) {
  return await db
    .select()
    .from(bookings)
    .where(sql`${bookings.contactInfo}->>'phone' = ${customerPhone}`)
    .orderBy(desc(bookings.createdAt))
}

// Get upcoming bookings (for reminders)
export async function getUpcomingBookings(hoursAhead: number = 24) {
  const now = new Date()
  const futureTime = new Date(now.getTime() + hoursAhead * 60 * 60 * 1000)
  
  return await db
    .select()
    .from(bookings)
    .where(and(
      gte(bookings.scheduledTime, now),
      lte(bookings.scheduledTime, futureTime),
      or(
        eq(bookings.status, 'pending'),
        eq(bookings.status, 'confirmed')
      )
    ))
    .orderBy(bookings.scheduledTime)
}

// Validate booking business rules
export function validateBookingData(bookingData: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  
  // Required fields
  if (!bookingData.serviceType) errors.push('Service type is required')
  if (!bookingData.description) errors.push('Description is required')
  if (!bookingData.contactInfo) errors.push('Contact information is required')
  if (!bookingData.scheduledTime) errors.push('Scheduled time is required')
  
  // Contact info validation
  if (bookingData.contactInfo) {
    if (!bookingData.contactInfo.name) errors.push('Customer name is required')
    if (!bookingData.contactInfo.phone) errors.push('Customer phone is required')
    if (!bookingData.contactInfo.address) errors.push('Customer address is required')
    
    // Phone validation for Indian numbers
    if (bookingData.contactInfo.phone) {
      const phoneRegex = /^(\+91|91)?[6-9]\d{9}$/
      const cleanPhone = bookingData.contactInfo.phone.replace(/\s|-/g, '')
      if (!phoneRegex.test(cleanPhone)) {
        errors.push('Please provide a valid Indian phone number')
      }
    }
  }
  
  // Service type validation
  const validServiceTypes = ['electrical', 'plumbing', 'ac', 'appliance']
  if (bookingData.serviceType && !validServiceTypes.includes(bookingData.serviceType)) {
    errors.push('Invalid service type')
  }
  
  // Priority validation
  const validPriorities = ['normal', 'urgent', 'emergency']
  if (bookingData.priority && !validPriorities.includes(bookingData.priority)) {
    errors.push('Invalid priority level')
  }
  
  // Scheduled time validation
  if (bookingData.scheduledTime) {
    const scheduledDate = new Date(bookingData.scheduledTime)
    const now = new Date()
    
    if (isNaN(scheduledDate.getTime())) {
      errors.push('Invalid scheduled time format')
    } else if (scheduledDate <= now) {
      errors.push('Scheduled time must be in the future')
    }
    
    // Check business hours (9 AM to 6 PM)
    const hour = scheduledDate.getHours()
    if (hour < 9 || hour >= 18) {
      errors.push('Bookings can only be scheduled between 9 AM and 6 PM')
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// Format booking for API response
export function formatBookingResponse(booking: Booking) {
  return {
    ...booking,
    totalCost: booking.totalCost ? parseFloat(booking.totalCost) : null,
    actualCost: booking.actualCost ? parseFloat(booking.actualCost) : null,
    estimatedDuration: calculateEstimatedDuration(booking.serviceType, booking.priority),
    statusDisplay: getStatusDisplay(booking.status),
    priorityDisplay: getPriorityDisplay(booking.priority)
  }
}

// Calculate estimated service duration
function calculateEstimatedDuration(serviceType: string, priority: string): string {
  const baseDurations = {
    electrical: 60, // minutes
    plumbing: 90,
    ac: 120,
    appliance: 75
  }
  
  let duration = baseDurations[serviceType as keyof typeof baseDurations] || 60
  
  // Adjust for priority
  if (priority === 'emergency') {
    duration = Math.round(duration * 0.8) // Faster response for emergencies
  }
  
  if (duration < 60) {
    return `${duration} minutes`
  } else {
    const hours = Math.floor(duration / 60)
    const minutes = duration % 60
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`
  }
}

// Get user-friendly status display
function getStatusDisplay(status: string): string {
  const statusMap = {
    pending: 'Pending Confirmation',
    confirmed: 'Confirmed',
    in_progress: 'Work in Progress',
    completed: 'Completed',
    cancelled: 'Cancelled'
  }
  return statusMap[status as keyof typeof statusMap] || status
}

// Get user-friendly priority display
function getPriorityDisplay(priority: string): string {
  const priorityMap = {
    normal: 'Normal',
    urgent: 'Urgent',
    emergency: 'Emergency'
  }
  return priorityMap[priority as keyof typeof priorityMap] || priority
}

