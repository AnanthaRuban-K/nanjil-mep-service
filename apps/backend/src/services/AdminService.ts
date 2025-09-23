import { db } from '../db/index.js'
import { bookings, customers, services } from '../db/schema.js'
import { eq, desc, and, gte, lt, sql, count, sum } from 'drizzle-orm'

export class AdminService {
  async getDashboardMetrics() {
    try {
      const today = new Date()
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
      
      // Get all bookings for calculations
      const allBookings = await db.select().from(bookings)
      
      // Today's bookings
      const todayBookings = allBookings.filter(b => {
        const bookingDate = new Date(b.createdAt || '')
        return bookingDate >= startOfDay && bookingDate < endOfDay
      })
      
      // Calculate metrics
      const metrics = {
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
      
      return metrics
    } catch (error) {
      console.error('getDashboardMetrics error:', error)
      throw new Error(`Failed to get dashboard metrics`)
    }
  }

  async getAdminBookings(params: {
    status?: string
    limit?: number
    offset?: number
    priority?: string
  }) {
    try {
      // Build the conditions array
      const conditions = []
      if (params.status) {
        conditions.push(eq(bookings.status, params.status as any))
      }
      if (params.priority) {
        conditions.push(eq(bookings.priority, params.priority as any))
      }
      
      // Build and execute query directly based on conditions
      const baseQuery = db.select().from(bookings)
      
      let finalQuery
      if (conditions.length > 0) {
        finalQuery = baseQuery
          .where(and(...conditions))
          .orderBy(desc(bookings.createdAt))
      } else {
        finalQuery = baseQuery
          .orderBy(desc(bookings.createdAt))
      }
      
      // Apply pagination
      if (params.limit) {
        finalQuery = finalQuery.limit(params.limit)
      }
      if (params.offset) {
        finalQuery = finalQuery.offset(params.offset)
      }
      
      return await finalQuery
    } catch (error) {
      console.error('getAdminBookings error:', error)
      throw new Error(`Failed to get admin bookings`)
    }
  }

  async updateBookingStatus(bookingId: string, status: string, notes?: string) {
    try {
      const isNumeric = !isNaN(Number(bookingId))
      const completedAt = status === 'completed' ? new Date() : undefined
      
      const updateData: any = {
        status: status as any,
        updatedAt: new Date(),
        ...(completedAt && { completedAt })
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

  async getBookingDetails(bookingId: string) {
    try {
      const isNumeric = !isNaN(Number(bookingId))
      
      if (isNumeric) {
        const result = await db.select()
          .from(bookings)
          .where(eq(bookings.id, Number(bookingId)))
        return result[0] || null
      } else {
        const result = await db.select()
          .from(bookings)
          .where(eq(bookings.bookingNumber, bookingId))
        return result[0] || null
      }
    } catch (error) {
      console.error('getBookingDetails error:', error)
      throw new Error(`Failed to get booking details`)
    }
  }

  async getCustomerAnalytics() {
    try {
      const allCustomers = await db.select().from(customers)
      const allBookings = await db.select().from(bookings)
      
      // Calculate customer analytics
      const analytics = {
        totalCustomers: allCustomers.length,
        newCustomersThisMonth: allCustomers.filter(c => {
          const customerDate = new Date(c.createdAt || '')
          const now = new Date()
          return customerDate.getMonth() === now.getMonth() && customerDate.getFullYear() === now.getFullYear()
        }).length,
        averageBookingsPerCustomer: allCustomers.length > 0 ? allBookings.length / allCustomers.length : 0,
        topCustomers: allCustomers.slice(0, 10), // Simplified - would need proper sorting by booking count
        customersByLanguage: {
          tamil: allCustomers.filter(c => c.language === 'ta').length,
          english: allCustomers.filter(c => c.language === 'en').length
        }
      }
      
      return analytics
    } catch (error) {
      console.error('getCustomerAnalytics error:', error)
      throw new Error(`Failed to get customer analytics`)
    }
  }

  async getServiceAnalytics() {
    try {
      const allBookings = await db.select().from(bookings)
      
      // Calculate service analytics
      const electricalBookings = allBookings.filter(b => b.serviceType === 'electrical')
      const plumbingBookings = allBookings.filter(b => b.serviceType === 'plumbing')
      
      const analytics = {
        totalServices: allBookings.length,
        serviceBreakdown: {
          electrical: {
            count: electricalBookings.length,
            percentage: allBookings.length > 0 ? (electricalBookings.length / allBookings.length) * 100 : 0,
            revenue: electricalBookings
              .filter(b => b.status === 'completed')
              .reduce((sum, b) => sum + parseFloat(b.totalCost || '0'), 0)
          },
          plumbing: {
            count: plumbingBookings.length,
            percentage: allBookings.length > 0 ? (plumbingBookings.length / allBookings.length) * 100 : 0,
            revenue: plumbingBookings
              .filter(b => b.status === 'completed')
              .reduce((sum, b) => sum + parseFloat(b.totalCost || '0'), 0)
          }
        },
        priorityBreakdown: {
          normal: allBookings.filter(b => b.priority === 'normal').length,
          urgent: allBookings.filter(b => b.priority === 'urgent').length,
          emergency: allBookings.filter(b => b.priority === 'emergency').length
        },
        completionRate: allBookings.length > 0 
          ? (allBookings.filter(b => b.status === 'completed').length / allBookings.length) * 100 
          : 0
      }
      
      return analytics
    } catch (error) {
      console.error('getServiceAnalytics error:', error)
      throw new Error(`Failed to get service analytics`)
    }
  }

  async getRevenueAnalytics(period: string = 'month') {
    try {
      const allBookings = await db.select().from(bookings)
      const completedBookings = allBookings.filter(b => b.status === 'completed')
      
      const now = new Date()
      let startDate: Date
      
      switch (period) {
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          break
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1)
          break
        case 'year':
          startDate = new Date(now.getFullYear(), 0, 1)
          break
        default:
          startDate = new Date(now.getFullYear(), now.getMonth(), 1)
      }
      
      const periodBookings = completedBookings.filter(b => {
        const bookingDate = new Date(b.completedAt || b.createdAt || '')
        return bookingDate >= startDate
      })
      
      const analytics = {
        period,
        totalRevenue: periodBookings.reduce((sum, b) => sum + parseFloat(b.totalCost || '0'), 0),
        totalBookings: periodBookings.length,
        averageOrderValue: periodBookings.length > 0 
          ? periodBookings.reduce((sum, b) => sum + parseFloat(b.totalCost || '0'), 0) / periodBookings.length 
          : 0,
        revenueByService: {
          electrical: periodBookings
            .filter(b => b.serviceType === 'electrical')
            .reduce((sum, b) => sum + parseFloat(b.totalCost || '0'), 0),
          plumbing: periodBookings
            .filter(b => b.serviceType === 'plumbing')
            .reduce((sum, b) => sum + parseFloat(b.totalCost || '0'), 0)
        },
        dailyRevenue: this.calculateDailyRevenue(periodBookings, startDate, now)
      }
      
      return analytics
    } catch (error) {
      console.error('getRevenueAnalytics error:', error)
      throw new Error(`Failed to get revenue analytics`)
    }
  }

  async exportBookings(params: {
    format?: string
    startDate?: string
    endDate?: string
  }) {
    try {
      const bookingsData = await db.select()
        .from(bookings)
        .orderBy(desc(bookings.createdAt))
      
      // Apply date filters if provided (client-side filtering for simplicity)
      let filteredData = bookingsData
      if (params.startDate && params.endDate) {
        const start = new Date(params.startDate)
        const end = new Date(params.endDate)
        filteredData = bookingsData.filter(b => {
          const bookingDate = new Date(b.createdAt || '')
          return bookingDate >= start && bookingDate <= end
        })
      }
      
      if (params.format === 'csv') {
        return this.convertToCSV(filteredData)
      }
      
      return filteredData
    } catch (error) {
      console.error('exportBookings error:', error)
      throw new Error(`Failed to export bookings`)
    }
  }

  async bulkUpdateStatus(bookingIds: string[], status: string, notes?: string) {
    try {
      let updated = 0
      const errors = []
      
      for (const bookingId of bookingIds) {
        try {
          await this.updateBookingStatus(bookingId, status, notes)
          updated++
        } catch (error) {
          errors.push({ bookingId, error: error instanceof Error ? error.message : String(error) })
        }
      }
      
      return {
        updated,
        errors,
        total: bookingIds.length
      }
    } catch (error) {
      console.error('bulkUpdateStatus error:', error)
      throw new Error(`Failed to bulk update status`)
    }
  }

  private calculateDailyRevenue(bookings: any[], startDate: Date, endDate: Date) {
    const dailyRevenue = []
    const currentDate = new Date(startDate)
    
    while (currentDate <= endDate) {
      const dayStart = new Date(currentDate)
      const dayEnd = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000)
      
      const dayBookings = bookings.filter(b => {
        const bookingDate = new Date(b.completedAt || b.createdAt || '')
        return bookingDate >= dayStart && bookingDate < dayEnd
      })
      
      const dayRevenue = dayBookings.reduce((sum, b) => sum + parseFloat(b.totalCost || '0'), 0)
      
      dailyRevenue.push({
        date: currentDate.toISOString().split('T')[0],
        revenue: dayRevenue,
        bookings: dayBookings.length
      })
      
      currentDate.setDate(currentDate.getDate() + 1)
    }
    
    return dailyRevenue
  }

  private convertToCSV(data: any[]): string {
    if (data.length === 0) return ''
    
    const headers = Object.keys(data[0]).join(',')
    const rows = data.map(row => 
      Object.values(row).map(value => 
        typeof value === 'string' && value.includes(',') ? `"${value}"` : value
      ).join(',')
    )
    
    return [headers, ...rows].join('\n')
  }
}