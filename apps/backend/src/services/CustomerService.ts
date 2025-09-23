import { db } from '../db/index'
import { customers, bookings } from '../db/schema'
import { eq, desc } from 'drizzle-orm'

export class CustomerService {
  async createCustomer(data: {
    clerkUserId?: string
    name: string
    phone: string
    address?: string
    language?: string
  }) {
    try {
      // Check if customer with this phone already exists
      const existingCustomer = await db.select().from(customers)
        .where(eq(customers.phone, data.phone))
        .limit(1)

      if (existingCustomer.length > 0) {
        throw new Error('Customer with this phone number already exists')
      }

      const [customer] = await db.insert(customers).values({
        clerkUserId: data.clerkUserId,
        name: data.name,
        phone: data.phone,
        address: data.address,
        language: data.language || 'ta'
      }).returning()

      return customer
    } catch (error) {
      console.error('createCustomer error:', error)
      throw new Error(`Failed to create customer: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  async getCustomerProfile(customerId?: string, clerkUserId?: string) {
    try {
      if (customerId) {
        const [customer] = await db.select().from(customers).where(eq(customers.id, Number(customerId)))
        return customer || null
      }

      if (clerkUserId) {
        const [customer] = await db.select().from(customers).where(eq(customers.clerkUserId, clerkUserId))
        return customer || null
      }

      return null
    } catch (error) {
      console.error('getCustomerProfile error:', error)
      throw new Error(`Failed to get customer profile`)
    }
  }

  async updateCustomerProfile(customerId: string, data: {
    name?: string
    phone?: string
    address?: string
    language?: string
  }) {
    try {
      const [customer] = await db.update(customers)
        .set({
          ...data,
          // updatedAt would need to be added to schema
        })
        .where(eq(customers.id, Number(customerId)))
        .returning()

      return customer
    } catch (error) {
      console.error('updateCustomerProfile error:', error)
      throw new Error(`Failed to update customer profile`)
    }
  }

  async getCustomerBookings(customerId: string, limit = 20, offset = 0) {
    try {
      // Since we don't have a direct relationship, we'll need to match by phone or other identifier
      // For now, return recent bookings
      return await db.select().from(bookings)
        .orderBy(desc(bookings.createdAt))
        .limit(limit)
        .offset(offset)
    } catch (error) {
      console.error('getCustomerBookings error:', error)
      throw new Error(`Failed to get customer bookings`)
    }
  }
}