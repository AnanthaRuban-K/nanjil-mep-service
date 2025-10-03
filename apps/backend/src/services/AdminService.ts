import { db } from '../db/index'
import { bookings, customers } from '../db/schema'
import { eq, desc, and, or, like } from 'drizzle-orm'

export class AdminService {
  
  // ==================== DASHBOARD ====================
  
  async getDashboardMetrics() {
    try {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
      
      const allBookings = await db.select().from(bookings)
      
      const todayBookings = allBookings.filter(b => {
        if (!b.createdAt) return false
        const bookingDate = new Date(b.createdAt)
        return bookingDate >= today && bookingDate < tomorrow
      })
      
      const safeParseFloat = (value: string | null | undefined): number => {
        if (!value) return 0
        const parsed = parseFloat(String(value))
        return isNaN(parsed) ? 0 : parsed
      }
      
      return {
        today: {
          bookings: todayBookings.length,
          completed: todayBookings.filter(b => b.status === 'completed').length,
          pending: todayBookings.filter(b => b.status === 'pending').length,
          inProgress: todayBookings.filter(b => b.status === 'in_progress').length,
          revenue: todayBookings
            .filter(b => b.status === 'completed')
            .reduce((sum, b) => sum + safeParseFloat(b.totalCost), 0)
        },
        overall: {
          totalBookings: allBookings.length,
          completedJobs: allBookings.filter(b => b.status === 'completed').length,
          pendingJobs: allBookings.filter(b => b.status === 'pending').length,
          emergencyJobs: allBookings.filter(b => b.priority === 'emergency').length,
          totalRevenue: allBookings
            .filter(b => b.status === 'completed')
            .reduce((sum, b) => sum + safeParseFloat(b.totalCost), 0)
        }
      }
    } catch (error) {
      console.error('getDashboardMetrics error:', error)
      return {
        today: { bookings: 0, completed: 0, pending: 0, inProgress: 0, revenue: 0 },
        overall: { totalBookings: 0, completedJobs: 0, pendingJobs: 0, emergencyJobs: 0, totalRevenue: 0 }
      }
    }
  }

  // ==================== BOOKINGS ====================

  async getAdminBookings(params: {
    status?: string
    limit?: number
    offset?: number
    priority?: string
  }) {
    try {
      const conditions = []
      
      if (params.status) {
        conditions.push(eq(bookings.status, params.status as any))
      }
      if (params.priority) {
        conditions.push(eq(bookings.priority, params.priority as any))
      }
      
      let query = db.select().from(bookings)
      
      if (conditions.length > 0) {
        query = query.where(and(...conditions)) as any
      }
      
      query = query.orderBy(desc(bookings.createdAt)) as any
      
      if (params.limit) {
        query = query.limit(params.limit) as any
      }
      if (params.offset) {
        query = query.offset(params.offset) as any
      }
      
      return await query
    } catch (error) {
      console.error('getAdminBookings error:', error)
      return []
    }
  }

  async getBookingDetails(bookingId: string) {
    try {
      const isNumeric = !isNaN(Number(bookingId))
      
      const result = isNumeric
        ? await db.select().from(bookings).where(eq(bookings.id, Number(bookingId)))
        : await db.select().from(bookings).where(eq(bookings.bookingNumber, bookingId))
      
      return result[0] || null
    } catch (error) {
      console.error('getBookingDetails error:', error)
      return null
    }
  }

  async updateBookingStatus(bookingId: string, status: string, notes?: string) {
    try {
      const isNumeric = !isNaN(Number(bookingId))
      const now = new Date()
      
      const updateData: any = {
        status: status as any,
        updatedAt: now,
      }
      
      if (status === 'completed') {
        updateData.completedAt = now
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
      throw new Error('Failed to update booking status')
    }
  }

  async bulkUpdateStatus(bookingIds: string[], status: string, notes?: string) {
    const results: { 
      updated: number
      errors: Array<{ bookingId: string; error: string }>
      total: number 
    } = {
      updated: 0,
      errors: [],
      total: bookingIds.length
    }
    
    for (const id of bookingIds) {
      try {
        await this.updateBookingStatus(id, status, notes)
        results.updated++
      } catch (error) {
        results.errors.push({ 
          bookingId: id, 
          error: error instanceof Error ? error.message : String(error) 
        })
      }
    }
    
    return results
  }

  async exportBookings(params: { 
    format?: string
    startDate?: string
    endDate?: string 
  }) {
    try {
      let bookingsData = await db.select()
        .from(bookings)
        .orderBy(desc(bookings.createdAt))
      
      if (params.startDate && params.endDate) {
        const start = new Date(params.startDate)
        const end = new Date(params.endDate)
        bookingsData = bookingsData.filter(b => {
          const date = new Date(b.createdAt || '')
          return date >= start && date <= end
        })
      }
      
      if (params.format === 'csv') {
        return this.convertToCSV(bookingsData)
      }
      
      return bookingsData
    } catch (error) {
      console.error('exportBookings error:', error)
      return []
    }
  }

  // ==================== CUSTOMERS ====================

  async getAdminCustomers(params: {
    search?: string
    status?: string
    sortBy?: string
    limit: number
    offset: number
  }) {
    try {
      // Get all customers (no status filter since schema doesn't have status field)
      let allCustomers = await db.select().from(customers)
      
      // Filter by isActive instead of status
      if (params.status) {
        if (params.status === 'active') {
          allCustomers = allCustomers.filter(c => c.isActive === 'true')
        } else if (params.status === 'blocked') {
          allCustomers = allCustomers.filter(c => c.isActive === 'false')
        }
      }
      
      // Apply search filter
      if (params.search) {
        const searchLower = params.search.toLowerCase()
        allCustomers = allCustomers.filter(c => 
          c.name?.toLowerCase().includes(searchLower) ||
          c.phone?.includes(params.search!)
        )
      }
      
      // Apply sorting
      switch (params.sortBy) {
        case 'name':
          allCustomers.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
          break
        case 'oldest':
          allCustomers.sort((a, b) => 
            new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
          )
          break
        case 'latest':
        default:
          allCustomers.sort((a, b) => 
            new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
          )
      }
      
      // Apply pagination
      const paginatedCustomers = allCustomers.slice(params.offset, params.offset + params.limit)
      
      // Calculate stats
      const now = new Date()
      return {
        customers: paginatedCustomers,
        total: allCustomers.length,
        active: allCustomers.filter(c => c.isActive === 'true').length,
        blocked: allCustomers.filter(c => c.isActive === 'false').length,
        thisMonth: allCustomers.filter(c => {
          const date = new Date(c.createdAt || '')
          return date.getMonth() === now.getMonth() && 
                 date.getFullYear() === now.getFullYear()
        }).length
      }
    } catch (error) {
      console.error('getAdminCustomers error:', error)
      return { 
        customers: [], 
        total: 0, 
        active: 0, 
        blocked: 0, 
        thisMonth: 0 
      }
    }
  }

  async getCustomerDetails(customerId: string) {
    try {
      const result = await db.select()
        .from(customers)
        .where(eq(customers.id, Number(customerId)))
      
      return result[0] || null
    } catch (error) {
      console.error('getCustomerDetails error:', error)
      return null
    }
  }

  async updateCustomer(customerId: string, data: any) {
    try {
      await db.update(customers)
        .set({ 
          ...data, 
          updatedAt: new Date() 
        })
        .where(eq(customers.id, Number(customerId)))
      
      return true
    } catch (error) {
      console.error('updateCustomer error:', error)
      throw new Error('Failed to update customer')
    }
  }

  async blockCustomer(customerId: string, blocked: boolean) {
    try {
      await db.update(customers)
        .set({ 
          isActive: blocked ? 'false' : 'true', // Use isActive instead of status
          updatedAt: new Date()
        })
        .where(eq(customers.id, Number(customerId)))
      
      return true
    } catch (error) {
      console.error('blockCustomer error:', error)
      throw new Error('Failed to update customer status')
    }
  }

  // ==================== ANALYTICS ====================

  async getCustomerAnalytics() {
    try {
      const allCustomers = await db.select().from(customers)
      const allBookings = await db.select().from(bookings)
      
      const now = new Date()
      const thisMonth = allCustomers.filter(c => {
        if (!c.createdAt) return false
        const customerDate = new Date(c.createdAt)
        return customerDate.getMonth() === now.getMonth() && 
               customerDate.getFullYear() === now.getFullYear()
      }).length
      
      return {
        totalCustomers: allCustomers.length,
        newCustomersThisMonth: thisMonth,
        averageBookingsPerCustomer: allCustomers.length > 0 
          ? (allBookings.length / allCustomers.length).toFixed(2)
          : 0,
        topCustomers: allCustomers.slice(0, 10),
        customersByLanguage: {
          tamil: allCustomers.filter(c => c.language === 'ta').length,
          english: allCustomers.filter(c => c.language === 'en').length
        }
      }
    } catch (error) {
      console.error('getCustomerAnalytics error:', error)
      return {
        totalCustomers: 0,
        newCustomersThisMonth: 0,
        averageBookingsPerCustomer: 0,
        topCustomers: [],
        customersByLanguage: { tamil: 0, english: 0 }
      }
    }
  }

  async getServiceAnalytics() {
    try {
      const allBookings = await db.select().from(bookings)
      
      const electrical = allBookings.filter(b => b.serviceType === 'electrical')
      const plumbing = allBookings.filter(b => b.serviceType === 'plumbing')
      
      const safeParseFloat = (value: string | null | undefined): number => {
        if (!value) return 0
        const parsed = parseFloat(String(value))
        return isNaN(parsed) ? 0 : parsed
      }
      
      return {
        totalServices: allBookings.length,
        serviceBreakdown: {
          electrical: {
            count: electrical.length,
            percentage: allBookings.length > 0 
              ? (electrical.length / allBookings.length) * 100 
              : 0,
            revenue: electrical
              .filter(b => b.status === 'completed')
              .reduce((sum, b) => sum + safeParseFloat(b.totalCost), 0)
          },
          plumbing: {
            count: plumbing.length,
            percentage: allBookings.length > 0 
              ? (plumbing.length / allBookings.length) * 100 
              : 0,
            revenue: plumbing
              .filter(b => b.status === 'completed')
              .reduce((sum, b) => sum + safeParseFloat(b.totalCost), 0)
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
    } catch (error) {
      console.error('getServiceAnalytics error:', error)
      return {
        totalServices: 0,
        serviceBreakdown: {
          electrical: { count: 0, percentage: 0, revenue: 0 },
          plumbing: { count: 0, percentage: 0, revenue: 0 }
        },
        priorityBreakdown: { normal: 0, urgent: 0, emergency: 0 },
        completionRate: 0
      }
    }
  }

  async getRevenueAnalytics(period: string = 'month') {
    try {
      const allBookings = await db.select().from(bookings)
      const completed = allBookings.filter(b => b.status === 'completed')
      
      const now = new Date()
      let startDate: Date
      
      switch (period) {
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          break
        case 'year':
          startDate = new Date(now.getFullYear(), 0, 1)
          break
        case 'month':
        default:
          startDate = new Date(now.getFullYear(), now.getMonth(), 1)
      }
      
      const periodBookings = completed.filter(b => {
        const date = new Date(b.completedAt || b.createdAt || '')
        return date >= startDate
      })
      
      const safeParseFloat = (value: string | null | undefined): number => {
        if (!value) return 0
        const parsed = parseFloat(String(value))
        return isNaN(parsed) ? 0 : parsed
      }
      
      const totalRevenue = periodBookings.reduce((sum, b) => 
        sum + safeParseFloat(b.totalCost), 0
      )
      
      return {
        period,
        totalRevenue,
        totalBookings: periodBookings.length,
        averageOrderValue: periodBookings.length > 0 
          ? totalRevenue / periodBookings.length 
          : 0,
        revenueByService: {
          electrical: periodBookings
            .filter(b => b.serviceType === 'electrical')
            .reduce((sum, b) => sum + safeParseFloat(b.totalCost), 0),
          plumbing: periodBookings
            .filter(b => b.serviceType === 'plumbing')
            .reduce((sum, b) => sum + safeParseFloat(b.totalCost), 0)
        }
      }
    } catch (error) {
      console.error('getRevenueAnalytics error:', error)
      return {
        period,
        totalRevenue: 0,
        totalBookings: 0,
        averageOrderValue: 0,
        revenueByService: { electrical: 0, plumbing: 0 }
      }
    }
  }

  // ==================== HELPERS ====================

  private convertToCSV(data: any[]): string {
    if (data.length === 0) return 'No data available'
    
    const headers = Object.keys(data[0]).join(',')
    const rows = data.map(row => 
      Object.values(row).map(v => 
        typeof v === 'string' && v.includes(',') ? `"${v}"` : v
      ).join(',')
    )
    
    return [headers, ...rows].join('\n')
  }
}