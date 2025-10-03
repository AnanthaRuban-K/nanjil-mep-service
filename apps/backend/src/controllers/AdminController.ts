import { Context } from 'hono'
import { AdminService } from '../services/AdminService'
import { HTTPException } from 'hono/http-exception'

export class AdminController {
  private adminService: AdminService

  constructor() {
    this.adminService = new AdminService()
  }

  // ==================== DASHBOARD ====================
  
  async getDashboardMetrics(c: Context) {
    try {
      console.log('Getting dashboard metrics...')
      
      const metrics = await this.adminService.getDashboardMetrics()

      console.log('Dashboard metrics retrieved')
      return c.json({
        success: true,
        metrics
      })
    } catch (error) {
      console.error('Get dashboard metrics error:', error)
      console.error('Error stack:', (error as Error).stack)
      throw new HTTPException(500, { message: 'Failed to retrieve dashboard metrics' })
    }
  }

  // ==================== BOOKINGS ====================

  async getAdminBookings(c: Context) {
    try {
      console.log('Getting admin bookings...')
      
      const status = c.req.query('status')
      const limit = Number(c.req.query('limit')) || 100
      const offset = Number(c.req.query('offset')) || 0
      const priority = c.req.query('priority')

      const bookings = await this.adminService.getAdminBookings({
        status,
        limit,
        offset,
        priority
      })

      console.log(`Retrieved ${bookings.length} admin bookings`)
      return c.json({
        success: true,
        bookings,
        count: bookings.length
      })
    } catch (error) {
      console.error('Get admin bookings error:', error)
      console.error('Error stack:', (error as Error).stack)
      throw new HTTPException(500, { message: 'Failed to retrieve bookings' })
    }
  }

  async getBookingDetails(c: Context) {
    try {
      const bookingId = c.req.param('id')
      console.log(`Getting booking details: ${bookingId}`)

      const booking = await this.adminService.getBookingDetails(bookingId)

      if (!booking) {
        throw new HTTPException(404, { message: 'Booking not found' })
      }

      console.log('Booking details retrieved')
      return c.json({
        success: true,
        booking
      })
    } catch (error) {
      console.error('Get booking details error:', error)
      if (error instanceof HTTPException) throw error
      throw new HTTPException(500, { message: 'Failed to retrieve booking details' })
    }
  }

  async updateBookingStatus(c: Context) {
    try {
      const bookingId = c.req.param('id')
      const { status, notes } = await c.req.json()

      console.log(`Updating booking ${bookingId} status to ${status}`)

      const validStatuses = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled']
      if (!status || !validStatuses.includes(status)) {
        throw new HTTPException(400, {
          message: 'Invalid status. Valid statuses: ' + validStatuses.join(', ')
        })
      }

      await this.adminService.updateBookingStatus(bookingId, status, notes)

      console.log('Booking status updated successfully')
      return c.json({
        success: true,
        message: `Booking status updated to ${status}`,
        status,
        notes: notes || null
      })
    } catch (error) {
      console.error('Update booking status error:', error)
      if (error instanceof HTTPException) throw error
      throw new HTTPException(500, { message: 'Failed to update booking status' })
    }
  }

  async bulkUpdateStatus(c: Context) {
    try {
      console.log('Bulk updating booking statuses...')
      
      const { bookingIds, status, notes } = await c.req.json()

      if (!Array.isArray(bookingIds) || bookingIds.length === 0) {
        throw new HTTPException(400, { message: 'Invalid booking IDs array' })
      }

      const validStatuses = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled']
      if (!status || !validStatuses.includes(status)) {
        throw new HTTPException(400, {
          message: 'Invalid status. Valid statuses: ' + validStatuses.join(', ')
        })
      }

      const result = await this.adminService.bulkUpdateStatus(bookingIds, status, notes)

      console.log('Bulk status update completed')
      return c.json({
        success: true,
        message: `Updated ${result.updated} bookings`,
        result
      })
    } catch (error) {
      console.error('Bulk update status error:', error)
      if (error instanceof HTTPException) throw error
      throw new HTTPException(500, { message: 'Failed to bulk update status' })
    }
  }

  async exportBookings(c: Context) {
    try {
      console.log('Exporting bookings...')
      
      const format = c.req.query('format') || 'json'
      const startDate = c.req.query('startDate')
      const endDate = c.req.query('endDate')

      const data = await this.adminService.exportBookings({
        format,
        startDate,
        endDate
      })

      console.log('Bookings exported successfully')
      
      if (format === 'csv') {
        const csvData = data as string
        return c.text(csvData, 200, {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="bookings-export.csv"'
        })
      }

      return c.json({
        success: true,
        data,
        format
      })
    } catch (error) {
      console.error('Export bookings error:', error)
      throw new HTTPException(500, { message: 'Failed to export bookings' })
    }
  }

  // ==================== CUSTOMERS ====================

  async getAdminCustomers(c: Context) {
    try {
      console.log('Getting admin customers...')
      
      const search = c.req.query('search')
      const status = c.req.query('status')
      const sortBy = c.req.query('sortBy')
      const limit = Number(c.req.query('limit')) || 50
      const offset = Number(c.req.query('offset')) || 0

      const result = await this.adminService.getAdminCustomers({
        search,
        status,
        sortBy,
        limit,
        offset
      })

      console.log(`Retrieved ${result.customers.length} customers`)
      return c.json({
        success: true,
        ...result
      })
    } catch (error) {
      console.error('Get customers error:', error)
      throw new HTTPException(500, { message: 'Failed to retrieve customers' })
    }
  }

  async getCustomerDetails(c: Context) {
    try {
      const customerId = c.req.param('id')
      console.log(`Getting customer details: ${customerId}`)

      const customer = await this.adminService.getCustomerDetails(customerId)
      
      if (!customer) {
        throw new HTTPException(404, { message: 'Customer not found' })
      }

      console.log('Customer details retrieved')
      return c.json({ 
        success: true, 
        customer 
      })
    } catch (error) {
      console.error('Get customer details error:', error)
      if (error instanceof HTTPException) throw error
      throw new HTTPException(500, { message: 'Failed to retrieve customer details' })
    }
  }

  async updateCustomer(c: Context) {
    try {
      const customerId = c.req.param('id')
      const updateData = await c.req.json()

      console.log(`Updating customer ${customerId}`)

      await this.adminService.updateCustomer(customerId, updateData)

      console.log('Customer updated successfully')
      return c.json({
        success: true,
        message: 'Customer updated successfully'
      })
    } catch (error) {
      console.error('Update customer error:', error)
      throw new HTTPException(500, { message: 'Failed to update customer' })
    }
  }

  async blockCustomer(c: Context) {
    try {
      const customerId = c.req.param('id')
      
      console.log(`Blocking customer ${customerId}`)
      
      await this.adminService.blockCustomer(customerId, true)

      console.log('Customer blocked successfully')
      return c.json({
        success: true,
        message: 'Customer blocked successfully'
      })
    } catch (error) {
      console.error('Block customer error:', error)
      throw new HTTPException(500, { message: 'Failed to block customer' })
    }
  }

  async unblockCustomer(c: Context) {
    try {
      const customerId = c.req.param('id')
      
      console.log(`Unblocking customer ${customerId}`)
      
      await this.adminService.blockCustomer(customerId, false)

      console.log('Customer unblocked successfully')
      return c.json({
        success: true,
        message: 'Customer unblocked successfully'
      })
    } catch (error) {
      console.error('Unblock customer error:', error)
      throw new HTTPException(500, { message: 'Failed to unblock customer' })
    }
  }

  // ==================== ANALYTICS ====================

  async getCustomerAnalytics(c: Context) {
    try {
      console.log('Getting customer analytics...')
      
      const analytics = await this.adminService.getCustomerAnalytics()

      console.log('Customer analytics retrieved')
      return c.json({
        success: true,
        analytics
      })
    } catch (error) {
      console.error('Get customer analytics error:', error)
      throw new HTTPException(500, { message: 'Failed to retrieve customer analytics' })
    }
  }

  async getServiceAnalytics(c: Context) {
    try {
      console.log('Getting service analytics...')
      
      const analytics = await this.adminService.getServiceAnalytics()

      console.log('Service analytics retrieved')
      return c.json({
        success: true,
        analytics
      })
    } catch (error) {
      console.error('Get service analytics error:', error)
      throw new HTTPException(500, { message: 'Failed to retrieve service analytics' })
    }
  }

  async getRevenueAnalytics(c: Context) {
    try {
      console.log('Getting revenue analytics...')
      
      const period = c.req.query('period') || 'month'
      const analytics = await this.adminService.getRevenueAnalytics(period)

      console.log('Revenue analytics retrieved')
      return c.json({
        success: true,
        analytics,
        period
      })
    } catch (error) {
      console.error('Get revenue analytics error:', error)
      throw new HTTPException(500, { message: 'Failed to retrieve revenue analytics' })
    }
  }
}