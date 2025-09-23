// File: backend/src/routes/bookingRoutes.ts - Complete Booking API Routes with Real Database
import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { eq, desc, asc, and, or, gte, lte, count, sql } from 'drizzle-orm'
import { db } from '../db/index.js'
import { bookings, services, customers, type NewBooking, type Booking } from '../db/schema.js'

const app = new Hono()

// Helper function to generate booking number
function generateBookingNumber() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const timestamp = Date.now().toString().slice(-6) // Last 6 digits for uniqueness
  return `NMP-${year}${month}${day}-${timestamp}`
}

// Helper function to calculate estimated cost
async function calculateEstimatedCost(serviceType: string, priority: string): Promise<number> {
  try {
    // Get base cost from services table
    const service = await db
      .select({ baseCost: services.baseCost })
      .from(services)
      .where(and(
        eq(services.category, serviceType),
        eq(services.isActive, 'true')
      ))
      .limit(1)

    let basePrice = service.length > 0 ? Number(service[0].baseCost) : (serviceType === 'electrical' ? 300 : 350)
    
    // Apply priority multipliers
    if (priority === 'urgent') basePrice *= 1.3
    if (priority === 'emergency') basePrice *= 1.5
    
    return Math.round(basePrice)
  } catch (error) {
    console.error('Error calculating cost:', error)
    // Fallback to default calculation
    let basePrice = serviceType === 'electrical' ? 300 : 350
    if (priority === 'urgent') basePrice *= 1.3
    if (priority === 'emergency') basePrice *= 1.5
    return Math.round(basePrice)
  }
}

// Helper function to validate contact info
function validateContactInfo(contactInfo: any) {
  if (!contactInfo || typeof contactInfo !== 'object') {
    return { isValid: false, message: 'Contact information is required' }
  }
  
  if (!contactInfo.name || !contactInfo.phone || !contactInfo.address) {
    return { 
      isValid: false, 
      message: 'Complete contact information required: name, phone, address' 
    }
  }
  
  // Basic phone validation for Indian numbers
  const phoneRegex = /^(\+91|91)?[6-9]\d{9}$/
  if (!phoneRegex.test(contactInfo.phone.replace(/\s|-/g, ''))) {
    return { 
      isValid: false, 
      message: 'Please provide a valid Indian phone number' 
    }
  }
  
  return { isValid: true }
}

// GET /api/bookings - Get all bookings with advanced filtering
app.get('/', async (c) => {
  try {
    console.log('📋 GET /api/bookings - Fetching all bookings')
    
    // Parse query parameters
    const limit = Math.min(Number(c.req.query('limit')) || 50, 100) // Max 100 per request
    const offset = Number(c.req.query('offset')) || 0
    const status = c.req.query('status')
    const serviceType = c.req.query('serviceType')
    const priority = c.req.query('priority')
    const dateFrom = c.req.query('dateFrom')
    const dateTo = c.req.query('dateTo')
    const sortBy = c.req.query('sortBy') || 'createdAt'
    const sortOrder = c.req.query('sortOrder') || 'desc'
    const search = c.req.query('search') // Search in customer name or booking number
    
    // Build where conditions
    const whereConditions = []
    
    if (status) {
      whereConditions.push(eq(bookings.status, status))
    }
    
    if (serviceType) {
      whereConditions.push(eq(bookings.serviceType, serviceType))
    }
    
    if (priority) {
      whereConditions.push(eq(bookings.priority, priority))
    }
    
    if (dateFrom) {
      whereConditions.push(gte(bookings.createdAt, new Date(dateFrom)))
    }
    
    if (dateTo) {
      whereConditions.push(lte(bookings.createdAt, new Date(dateTo)))
    }
    
    // Build order by
    const orderByColumn = sortBy === 'scheduledTime' ? bookings.scheduledTime : bookings.createdAt
    const orderDirection = sortOrder === 'asc' ? asc(orderByColumn) : desc(orderByColumn)
    
    // Execute query with conditions
    const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined
    
    let query = db
      .select()
      .from(bookings)
      .where(whereClause)
      .orderBy(orderDirection)
      .limit(limit)
      .offset(offset)
    
    const bookingsList = await query
    
    // Get total count for pagination
    const totalCountResult = await db
      .select({ count: count() })
      .from(bookings)
      .where(whereClause)
    
    const totalCount = totalCountResult[0]?.count || 0
    
    // Apply search filter in memory if needed (for better performance, consider full-text search)
    let filteredBookings = bookingsList
    if (search) {
      const searchLower = search.toLowerCase()
      filteredBookings = bookingsList.filter(booking => 
        booking.bookingNumber.toLowerCase().includes(searchLower) ||
        (booking.contactInfo as any)?.name?.toLowerCase().includes(searchLower)
      )
    }
    
    console.log(`✅ Returning ${filteredBookings.length} bookings (${totalCount} total)`)
    
    return c.json({
      success: true,
      bookings: filteredBookings,
      count: filteredBookings.length,
      total: totalCount,
      pagination: {
        limit,
        offset,
        hasMore: offset + limit < totalCount
      }
    })
  } catch (error) {
    console.error('❌ Error fetching bookings:', error)
    throw new HTTPException(500, { message: 'Failed to fetch bookings' })
  }
})

// GET /api/bookings/my - Get current user's bookings
app.get('/my', async (c) => {
  try {
    console.log('👤 GET /api/bookings/my - Fetching user bookings')
    
    // Get user identification from various sources
    const userPhone = c.req.query('phone') || c.req.header('user-phone')
    const userEmail = c.req.query('email') || c.req.header('user-email')
    const userId = c.req.query('userId') || c.req.header('user-id') || c.req.header('x-user-id')
    
    console.log('🔍 User identification:', { userPhone, userEmail, userId })
    
    // For demo purposes, if no specific user info is provided, return sample bookings
    // In production, you would enforce authentication
    if (!userPhone && !userEmail && !userId) {
      console.log('⚠️ No user identification provided, returning sample bookings for demo')
      
      // Return sample bookings for demo (you can also return empty array)
      const sampleBookings = [
        {
          id: 1,
          bookingNumber: 'NMP-DEMO-001',
          serviceType: 'electrical',
          priority: 'normal',
          status: 'pending',
          description: 'Demo booking - Fan repair needed',
          contactInfo: {
            name: 'Demo User',
            phone: '+91 9876543210',
            address: 'Demo Address, Tamil Nadu'
          },
          scheduledTime: new Date().toISOString(),
          totalCost: '300',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
      
      return c.json({
        success: true,
        bookings: sampleBookings,
        count: sampleBookings.length,
        message: 'Demo mode: showing sample bookings. Sign in to see your actual bookings.'
      })
    }
    
    // Build query based on available user identification
    let userBookings: Booking[] = []
    
    if (userPhone) {
      // Search by phone number in contact info (JSONB query)
      userBookings = await db
        .select()
        .from(bookings)
        .where(sql`${bookings.contactInfo}->>'phone' = ${userPhone}`)
        .orderBy(desc(bookings.createdAt))
    } else if (userEmail) {
      // Search by email in contact info (JSONB query)
      userBookings = await db
        .select()
        .from(bookings)
        .where(sql`${bookings.contactInfo}->>'email' = ${userEmail}`)
        .orderBy(desc(bookings.createdAt))
    } else if (userId) {
      // In a full implementation, you'd have a user_id field in bookings table
      // For now, we'll return empty results
      console.log('⚠️ User ID provided but no direct mapping to bookings table')
      userBookings = []
    }
    
    console.log(`✅ Returning ${userBookings.length} user bookings`)
    
    return c.json({
      success: true,
      bookings: userBookings,
      count: userBookings.length
    })
    
  } catch (error) {
    console.error('❌ Error fetching user bookings:', error)
    if (error instanceof HTTPException) {
      throw error
    }
    throw new HTTPException(500, { message: 'Failed to fetch your bookings' })
  }
})

// POST /api/bookings - Create new booking
app.post('/', async (c) => {
  try {
    console.log('📝 POST /api/bookings - Creating new booking')
    
    const body = await c.req.json()
    const { serviceType, priority = 'normal', description, contactInfo, scheduledTime } = body
    
    // Enhanced validation
    if (!serviceType || !description || !contactInfo || !scheduledTime) {
      throw new HTTPException(400, {
        message: 'Missing required fields: serviceType, description, contactInfo, scheduledTime'
      })
    }
    
    // Validate contact info
    const contactValidation = validateContactInfo(contactInfo)
    if (!contactValidation.isValid) {
      throw new HTTPException(400, { message: contactValidation.message })
    }
    
    // Validate service type exists
    const serviceExists = await db
      .select({ id: services.id })
      .from(services)
      .where(and(
        eq(services.category, serviceType),
        eq(services.isActive, 'true')
      ))
      .limit(1)
    
    if (serviceExists.length === 0) {
      throw new HTTPException(400, { message: 'Invalid service type' })
    }
    
    // Validate scheduled time is in the future
    const scheduledDate = new Date(scheduledTime)
    if (scheduledDate <= new Date()) {
      throw new HTTPException(400, { message: 'Scheduled time must be in the future' })
    }
    
    // Calculate estimated cost
    const estimatedCost = await calculateEstimatedCost(serviceType, priority)
    
    // Create new booking
    const newBookingData: NewBooking = {
      bookingNumber: generateBookingNumber(),
      serviceType,
      priority,
      description,
      contactInfo,
      scheduledTime: scheduledDate,
      status: 'pending',
      totalCost: estimatedCost.toString()
    }
    
    const [createdBooking] = await db
      .insert(bookings)
      .values(newBookingData)
      .returning()
    
    console.log(`✅ Booking created: ${createdBooking.bookingNumber}`)
    
    // TODO: Send notification to customer and admin
    // await sendBookingNotification(createdBooking)
    
    return c.json({
      success: true,
      booking: createdBooking,
      message: 'Booking created successfully'
    }, 201)
    
  } catch (error) {
    console.error('❌ Error creating booking:', error)
    if (error instanceof HTTPException) {
      throw error
    }
    throw new HTTPException(500, { message: 'Failed to create booking' })
  }
})

// GET /api/bookings/:id - Get specific booking
app.get('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    console.log(`🔍 GET /api/bookings/${id} - Fetching booking`)
    
    // Try to find by ID or booking number
    const booking = await db
      .select()
      .from(bookings)
      .where(or(
        eq(bookings.id, parseInt(id) || 0),
        eq(bookings.bookingNumber, id)
      ))
      .limit(1)
    
    if (booking.length === 0) {
      throw new HTTPException(404, { message: 'Booking not found' })
    }
    
    console.log(`✅ Booking found: ${booking[0].bookingNumber}`)
    
    return c.json({
      success: true,
      booking: booking[0]
    })
    
  } catch (error) {
    console.error('❌ Error fetching booking:', error)
    if (error instanceof HTTPException) {
      throw error
    }
    throw new HTTPException(500, { message: 'Failed to fetch booking' })
  }
})

// PUT /api/bookings/:id/cancel - Cancel booking
app.put('/:id/cancel', async (c) => {
  try {
    const id = c.req.param('id')
    const body = await c.req.json()
    const { reason } = body
    
    console.log(`❌ PUT /api/bookings/${id}/cancel - Cancelling booking`)
    
    // Find the booking
    const existingBooking = await db
      .select()
      .from(bookings)
      .where(or(
        eq(bookings.id, parseInt(id) || 0),
        eq(bookings.bookingNumber, id)
      ))
      .limit(1)
    
    if (existingBooking.length === 0) {
      throw new HTTPException(404, { message: 'Booking not found' })
    }
    
    const booking = existingBooking[0]
    
    // Check if booking can be cancelled
    if (booking.status === 'completed' || booking.status === 'cancelled') {
      throw new HTTPException(400, { 
        message: `Cannot cancel booking with status: ${booking.status}` 
      })
    }
    
    // Update booking status to cancelled
    const [updatedBooking] = await db
      .update(bookings)
      .set({
        status: 'cancelled',
        updatedAt: new Date(),
        // Store cancellation reason in a notes field if it exists
        // notes: reason
      })
      .where(eq(bookings.id, booking.id))
      .returning()
    
    console.log(`✅ Booking cancelled: ${updatedBooking.bookingNumber}`)
    
    // TODO: Send cancellation notification
    // await sendCancellationNotification(updatedBooking, reason)
    
    return c.json({
      success: true,
      booking: updatedBooking,
      message: 'Booking cancelled successfully'
    })
    
  } catch (error) {
    console.error('❌ Error cancelling booking:', error)
    if (error instanceof HTTPException) {
      throw error
    }
    throw new HTTPException(500, { message: 'Failed to cancel booking' })
  }
})

// POST /api/bookings/:id/feedback - Submit feedback
app.post('/:id/feedback', async (c) => {
  try {
    const id = c.req.param('id')
    const body = await c.req.json()
    const { rating, review } = body
    
    console.log(`⭐ POST /api/bookings/${id}/feedback - Submitting feedback`)
    
    // Validation
    if (!rating || rating < 1 || rating > 5) {
      throw new HTTPException(400, { message: 'Valid rating (1-5) is required' })
    }
    
    // Find the booking
    const existingBooking = await db
      .select()
      .from(bookings)
      .where(or(
        eq(bookings.id, parseInt(id) || 0),
        eq(bookings.bookingNumber, id)
      ))
      .limit(1)
    
    if (existingBooking.length === 0) {
      throw new HTTPException(404, { message: 'Booking not found' })
    }
    
    const booking = existingBooking[0]
    
    // Check if booking is completed
    if (booking.status !== 'completed') {
      throw new HTTPException(400, { 
        message: 'Feedback can only be submitted for completed bookings' 
      })
    }
    
    // Update booking with feedback
    const [updatedBooking] = await db
      .update(bookings)
      .set({
        rating,
        review: review || null,
        updatedAt: new Date()
      })
      .where(eq(bookings.id, booking.id))
      .returning()
    
    console.log(`✅ Feedback submitted for booking: ${updatedBooking.bookingNumber}`)
    
    return c.json({
      success: true,
      booking: updatedBooking,
      message: 'Feedback submitted successfully'
    })
    
  } catch (error) {
    console.error('❌ Error submitting feedback:', error)
    if (error instanceof HTTPException) {
      throw error
    }
    throw new HTTPException(500, { message: 'Failed to submit feedback' })
  }
})

// PUT /api/bookings/:id/status - Update booking status (admin only)
app.put('/:id/status', async (c) => {
  try {
    const id = c.req.param('id')
    const body = await c.req.json()
    const { status, technicianName, technicianPhone, actualCost, notes } = body
    
    console.log(`🔄 PUT /api/bookings/${id}/status - Updating status to ${status}`)
    
    // Validate status
    const validStatuses = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled']
    if (!validStatuses.includes(status)) {
      throw new HTTPException(400, { message: 'Invalid status value' })
    }
    
    // Find the booking
    const existingBooking = await db
      .select()
      .from(bookings)
      .where(or(
        eq(bookings.id, parseInt(id) || 0),
        eq(bookings.bookingNumber, id)
      ))
      .limit(1)
    
    if (existingBooking.length === 0) {
      throw new HTTPException(404, { message: 'Booking not found' })
    }
    
    const booking = existingBooking[0]
    
    // Prepare update data
    const updateData: any = {
      status,
      updatedAt: new Date()
    }
    
    // Add completion timestamp if completing
    if (status === 'completed') {
      updateData.completedAt = new Date()
    }
    
    // Add actual cost if provided
    if (actualCost) {
      updateData.actualCost = actualCost.toString()
    }
    
    // TODO: Handle technician info and notes when schema supports them
    // if (technicianName) updateData.technicianName = technicianName
    // if (technicianPhone) updateData.technicianPhone = technicianPhone
    // if (notes) updateData.notes = notes
    
    // Update booking
    const [updatedBooking] = await db
      .update(bookings)
      .set(updateData)
      .where(eq(bookings.id, booking.id))
      .returning()
    
    console.log(`✅ Booking status updated: ${updatedBooking.bookingNumber}`)
    
    // TODO: Send status update notification
    // await sendStatusUpdateNotification(updatedBooking, status)
    
    return c.json({
      success: true,
      booking: updatedBooking,
      message: 'Booking status updated successfully'
    })
    
  } catch (error) {
    console.error('❌ Error updating booking status:', error)
    if (error instanceof HTTPException) {
      throw error
    }
    throw new HTTPException(500, { message: 'Failed to update booking status' })
  }
})

// GET /api/bookings/stats/summary - Get booking statistics (admin)
app.get('/stats/summary', async (c) => {
  try {
    console.log('📊 GET /api/bookings/stats/summary - Fetching booking statistics')
    
    // Get counts by status
    const statusCounts = await db
      .select({
        status: bookings.status,
        count: count()
      })
      .from(bookings)
      .groupBy(bookings.status)
    
    // Get counts by service type
    const serviceCounts = await db
      .select({
        serviceType: bookings.serviceType,
        count: count()
      })
      .from(bookings)
      .groupBy(bookings.serviceType)
    
    // Get today's bookings
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    const todayBookings = await db
      .select({ count: count() })
      .from(bookings)
      .where(and(
        gte(bookings.createdAt, today),
        lte(bookings.createdAt, tomorrow)
      ))
    
    return c.json({
      success: true,
      stats: {
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
    })
    
  } catch (error) {
    console.error('❌ Error fetching booking statistics:', error)
    throw new HTTPException(500, { message: 'Failed to fetch booking statistics' })
  }
})

export { app as bookingRoutes }