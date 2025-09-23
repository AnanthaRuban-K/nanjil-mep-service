import { clerkClient } from '@clerk/clerk-sdk-node'
import { db } from '../db'
import { customers, admins } from '../db/schema.js'
import { eq } from 'drizzle-orm'

interface User {
  id: string
  clerkUserId: string
  email: string
  name: string
  role: 'admin' | 'customer'
  phone?: string
  isActive: boolean
}

export class AuthService {
  
  // Get user from Clerk ID and sync with local database
  async getUserFromClerkId(clerkUserId: string): Promise<User | null> {
    try {
      // Get user details from Clerk
      const clerkUser = await clerkClient.users.getUser(clerkUserId)
      
      if (!clerkUser) {
        return null
      }

      // Check if user exists in admins table first
      const adminResult = await db
        .select({
          id: admins.id,
          clerkUserId: admins.clerkUserId,
          name: admins.name,
          email: admins.email,
          phone: admins.phone,
          role: admins.role,
          isActive: admins.isActive
        })
        .from(admins)
        .where(eq(admins.clerkUserId, clerkUserId))
        .limit(1)

      if (adminResult.length > 0) {
        const admin = adminResult[0]
        return {
          id: admin.id.toString(),
          clerkUserId: admin.clerkUserId!,
          email: admin.email,
          name: admin.name,
          phone: admin.phone || undefined,
          role: 'admin',
          isActive: admin.isActive === 'true'
        }
      }

      // Check customers table
      const customerResult = await db
        .select({
          id: customers.id,
          clerkUserId: customers.clerkUserId,
          name: customers.name,
          phone: customers.phone,
          isActive: customers.isActive
        })
        .from(customers)
        .where(eq(customers.clerkUserId, clerkUserId))
        .limit(1)

      if (customerResult.length > 0) {
        const customer = customerResult[0]
        return {
          id: customer.id.toString(),
          clerkUserId: customer.clerkUserId!,
          email: clerkUser.emailAddresses[0]?.emailAddress || '',
          name: customer.name,
          phone: customer.phone || undefined,
          role: 'customer',
          isActive: customer.isActive === 'true'
        }
      }

      // User doesn't exist in local database, create as customer
      return await this.createCustomerFromClerk(clerkUser)

    } catch (error) {
      console.error('Error getting user from Clerk ID:', error)
      return null
    }
  }

  // Create customer record from Clerk user
  private async createCustomerFromClerk(clerkUser: any): Promise<User> {
    try {
      const email = clerkUser.emailAddresses[0]?.emailAddress || ''
      const phone = clerkUser.phoneNumbers[0]?.phoneNumber || ''
      const name = clerkUser.firstName || clerkUser.username || email.split('@')[0]

      const customerResult = await db
        .insert(customers)
        .values({
          clerkUserId: clerkUser.id,
          name,
          phone,
          language: 'ta'
        })
        .returning({
          id: customers.id,
          clerkUserId: customers.clerkUserId,
          name: customers.name,
          phone: customers.phone
        })

      const newCustomer = customerResult[0]
      
      console.log(`Created new customer from Clerk: ${email}`)

      return {
        id: newCustomer.id.toString(),
        clerkUserId: newCustomer.clerkUserId!,
        email,
        name: newCustomer.name,
        phone: newCustomer.phone || undefined,
        role: 'customer',
        isActive: true
      }

    } catch (error) {
      console.error('Error creating customer from Clerk:', error)
      throw new Error('Failed to create user account')
    }
  }

  // Create admin user (manual process)
  async createAdmin(data: {
    clerkUserId: string
    name: string
    email: string
    phone?: string
    role?: string
  }): Promise<User> {
    try {
      // Verify Clerk user exists
      const clerkUser = await clerkClient.users.getUser(data.clerkUserId)
      if (!clerkUser) {
        throw new Error('Clerk user not found')
      }

      // Check if admin already exists
      const existingAdmin = await db
        .select({ id: admins.id })
        .from(admins)
        .where(eq(admins.clerkUserId, data.clerkUserId))
        .limit(1)

      if (existingAdmin.length > 0) {
        throw new Error('Admin already exists')
      }

      const adminResult = await db
        .insert(admins)
        .values({
          clerkUserId: data.clerkUserId,
          name: data.name,
          email: data.email,
          phone: data.phone,
          role: data.role || 'admin'
        })
        .returning({
          id: admins.id,
          clerkUserId: admins.clerkUserId,
          name: admins.name,
          email: admins.email,
          phone: admins.phone,
          role: admins.role
        })

      const newAdmin = adminResult[0]
      
      console.log(`Created new admin: ${data.email}`)

      return {
        id: newAdmin.id.toString(),
        clerkUserId: newAdmin.clerkUserId!,
        email: newAdmin.email,
        name: newAdmin.name,
        phone: newAdmin.phone || undefined,
        role: 'admin',
        isActive: true
      }

    } catch (error) {
      console.error('Error creating admin:', error)
      throw new Error(error instanceof Error ? error.message : 'Failed to create admin')
    }
  }

  // Update user profile
  async updateProfile(userId: string, updates: {
    name?: string
    phone?: string
    address?: string
  }): Promise<boolean> {
    try {
      // Determine if user is admin or customer
      const adminResult = await db
        .select({ id: admins.id })
        .from(admins)
        .where(eq(admins.id, parseInt(userId)))
        .limit(1)

      if (adminResult.length > 0) {
        // Update admin
        await db
          .update(admins)
          .set({
            name: updates.name,
            phone: updates.phone,
            updatedAt: new Date()
          })
          .where(eq(admins.id, parseInt(userId)))
      } else {
        // Update customer
        await db
          .update(customers)
          .set({
            name: updates.name,
            phone: updates.phone,
            address: updates.address,
            updatedAt: new Date()
          })
          .where(eq(customers.id, parseInt(userId)))
      }

      return true

    } catch (error) {
      console.error('Error updating profile:', error)
      return false
    }
  }

  // Deactivate user account
  async deactivateUser(userId: string): Promise<boolean> {
    try {
      // Check if user is admin first
      const adminCheck = await db
        .select({ id: admins.id })
        .from(admins)
        .where(eq(admins.id, parseInt(userId)))
        .limit(1)

      if (adminCheck.length > 0) {
        // Update admin
        await db
          .update(admins)
          .set({ isActive: 'false', updatedAt: new Date() })
          .where(eq(admins.id, parseInt(userId)))
      } else {
        // Update customer
        await db
          .update(customers)
          .set({ isActive: 'false', updatedAt: new Date() })
          .where(eq(customers.id, parseInt(userId)))
      }

      return true

    } catch (error) {
      console.error('Error deactivating user:', error)
      return false
    }
  }

  // Get user role for authorization
  async getUserRole(clerkUserId: string): Promise<'admin' | 'customer' | null> {
    try {
      // Check admin first
      const adminResult = await db
        .select({ role: admins.role })
        .from(admins)
        .where(eq(admins.clerkUserId, clerkUserId))
        .limit(1)

      if (adminResult.length > 0) {
        return 'admin'
      }

      // Check customer
      const customerResult = await db
        .select({ id: customers.id })
        .from(customers)
        .where(eq(customers.clerkUserId, clerkUserId))
        .limit(1)

      if (customerResult.length > 0) {
        return 'customer'
      }

      return null

    } catch (error) {
      console.error('Error getting user role:', error)
      return null
    }
  }

  // Validate user is active
  async isUserActive(clerkUserId: string): Promise<boolean> {
    try {
      // Check admin
      const adminResult = await db
        .select({ isActive: admins.isActive })
        .from(admins)
        .where(eq(admins.clerkUserId, clerkUserId))
        .limit(1)

      if (adminResult.length > 0) {
        return adminResult[0].isActive === 'true'
      }

      // Check customer
      const customerResult = await db
        .select({ isActive: customers.isActive })
        .from(customers)
        .where(eq(customers.clerkUserId, clerkUserId))
        .limit(1)

      if (customerResult.length > 0) {
        return customerResult[0].isActive === 'true'
      }

      return false

    } catch (error) {
      console.error('Error checking user active status:', error)
      return false
    }
  }
}

// Updated Auth Middleware for Clerk
import { Context, Next } from 'hono'
import { HTTPException } from 'hono/http-exception'

export async function clerkAuthMiddleware(c: Context, next: Next) {
  try {
    const authHeader = c.req.header('Authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new HTTPException(401, { message: 'Authorization header required' })
    }
    
    const token = authHeader.substring(7)

    // Development mode - mock tokens
    if (process.env.NODE_ENV === 'development') {
      if (token === 'mock-jwt-token') {
        c.set('user', {
          id: '1',
          clerkUserId: 'user_mock123',
          email: 'customer@test.com',
          name: 'Test Customer',
          role: 'customer',
          isActive: true
        })
        await next()
        return
      }
      
      if (token === 'mock-admin-token') {
        c.set('user', {
          id: 'admin-1',
          clerkUserId: 'user_admin123',
          email: 'admin@nanjilmep.com',
          name: 'Test Admin',
          role: 'admin',
          isActive: true
        })
        await next()
        return
      }
    }

    // Production - verify Clerk JWT
    try {
      const clerkUser = await clerkClient.verifyToken(token)
      
      if (!clerkUser || !clerkUser.sub) {
        throw new HTTPException(401, { message: 'Invalid token' })
      }

      const authService = new AuthService()
      const user = await authService.getUserFromClerkId(clerkUser.sub)

      if (!user) {
        throw new HTTPException(401, { message: 'User not found' })
      }

      if (!user.isActive) {
        throw new HTTPException(401, { message: 'Account is deactivated' })
      }

      c.set('user', user)
      await next()

    } catch (clerkError) {
      console.error('Clerk token verification failed:', clerkError)
      throw new HTTPException(401, { message: 'Token verification failed' })
    }
    
  } catch (error) {
    console.error('Auth middleware error:', error)
    if (error instanceof HTTPException) {
      throw error
    }
    throw new HTTPException(401, { message: 'Authentication failed' })
  }
}

// Helper functions for role-based access
export function requireAdmin(c: Context, next: Next) {
  const user = c.get('user') as User
  
  if (!user || user.role !== 'admin') {
    throw new HTTPException(403, { message: 'Admin access required' })
  }
  
  return next()
}

export function requireCustomer(c: Context, next: Next) {
  const user = c.get('user') as User
  
  if (!user || user.role !== 'customer') {
    throw new HTTPException(403, { message: 'Customer access required' })
  }
  
  return next()
}

// Get authenticated user helper
export function getAuthenticatedUser(c: Context): User {
  const user = c.get('user') as User
  
  if (!user) {
    throw new HTTPException(401, { message: 'User not authenticated' })
  }
  
  return user
}