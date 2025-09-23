import { Context } from 'hono'
import { CustomerService } from '../services/CustomerService'
import { HTTPException } from 'hono/http-exception'

export class CustomerController {
  private customerService: CustomerService

  constructor() {

    this.customerService = new CustomerService()
  }

  async createCustomer(c: Context) {
    try {
      console.log('👤 Creating customer...')
      const body = await c.req.json()

      const { clerkUserId, name, phone, address, language = 'ta' } = body

      if (!name || !phone) {
        throw new HTTPException(400, { message: 'Name and phone are required' })
      }

      const customer = await this.customerService.createCustomer({
        clerkUserId,
        name,
        phone,
        address,
        language
      })

      console.log('✅ Customer created successfully')
      return c.json({
        success: true,
        customer,
        message: 'Customer created successfully'
      }, 201)

    } catch (error) {
      console.error('❌ Create customer error:', error)
      if (error instanceof HTTPException) {
        throw error
      }
      throw new HTTPException(500, { message: 'Failed to create customer' })
    }
  }

  async getCustomerProfile(c: Context) {
    try {
      const customerId = c.req.query('customerId')
      const clerkUserId = c.req.query('clerkUserId')

      console.log(`👤 Getting customer profile...`)

      if (!customerId && !clerkUserId) {
        throw new HTTPException(400, { message: 'Customer ID or Clerk User ID required' })
      }

      const customer = await this.customerService.getCustomerProfile(customerId, clerkUserId)

      if (!customer) {
        throw new HTTPException(404, { message: 'Customer not found' })
      }

      console.log('✅ Customer profile retrieved')
      return c.json({
        success: true,
        customer
      })

    } catch (error) {
      console.error('❌ Get customer profile error:', error)
      if (error instanceof HTTPException) {
        throw error
      }
      throw new HTTPException(500, { message: 'Failed to retrieve customer profile' })
    }
  }

  async updateCustomerProfile(c: Context) {
    try {
      const customerId = c.req.query('customerId')
      const body = await c.req.json()

      console.log(`👤 Updating customer profile: ${customerId}`)

      if (!customerId) {
        throw new HTTPException(400, { message: 'Customer ID required' })
      }

      const customer = await this.customerService.updateCustomerProfile(customerId, body)

      console.log('✅ Customer profile updated')
      return c.json({
        success: true,
        customer,
        message: 'Profile updated successfully'
      })

    } catch (error) {
      console.error('❌ Update customer profile error:', error)
      if (error instanceof HTTPException) {
        throw error
      }
      throw new HTTPException(500, { message: 'Failed to update customer profile' })
    }
  }

  async getCustomerBookings(c: Context) {
    try {
      const customerId = c.req.param('id')
      const limit = Number(c.req.query('limit')) || 20
      const offset = Number(c.req.query('offset')) || 0

      console.log(`📋 Getting bookings for customer: ${customerId}`)

      const bookings = await this.customerService.getCustomerBookings(customerId, limit, offset)

      console.log(`✅ Retrieved ${bookings.length} customer bookings`)
      return c.json({
        success: true,
        bookings,
        customerId
      })

    } catch (error) {
      console.error('❌ Get customer bookings error:', error)
      throw new HTTPException(500, { message: 'Failed to retrieve customer bookings' })
    }
  }
}