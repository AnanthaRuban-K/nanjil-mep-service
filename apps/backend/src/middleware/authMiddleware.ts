import { Context, Next } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { clerkClient } from '@clerk/clerk-sdk-node'
import { db } from '../db'
import { customers, admins } from '../db/schema'
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

export async function authMiddleware(c: Context, next: Next) {
  try {
    const authHeader = c.req.header('Authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new HTTPException(401, { message: 'Authorization header required' })
    }
    
    const token = authHeader.substring(7)

    // Development mode - keep mock tokens for testing
    if (process.env.NODE_ENV === 'development') {
      if (token === 'mock-jwt-token') {
        c.set('user', {
          id: '1',
          clerkUserId: 'user_mock_customer',
          email: 'rforruban@gmail.com',
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
          clerkUserId: 'user_mock_admin',
          email: 'aswinima29@gmail.com',
          name: 'Test Admin',
          role: 'admin',
          isActive: true
        })
        await next()
        return
      }
    }

    // Production - verify with Clerk
    let clerkUser
    try {
      clerkUser = await clerkClient.verifyToken(token)
    } catch (clerkError) {
      throw new HTTPException(401, { message: 'Invalid or expired token' })
    }

    if (!clerkUser || !clerkUser.sub) {
      throw new HTTPException(401, { message: 'Invalid token payload' })
    }

    // Get user from local database
    const user = await getUserFromDatabase(clerkUser.sub)
    
    if (!user) {
      // Auto-create customer if doesn't exist
      const newUser = await createCustomerFromClerk(clerkUser)
      c.set('user', newUser)
    } else {
      if (!user.isActive) {
        throw new HTTPException(401, { message: 'Account is deactivated' })
      }
      c.set('user', user)
    }

    await next()
    
  } catch (error) {
    if (error instanceof HTTPException) {
      throw error
    }
    console.error('Auth middleware error:', error)
    throw new HTTPException(401, { message: 'Authentication failed' })
  }
}

// Helper function to get user from database
async function getUserFromDatabase(clerkUserId: string): Promise<User | null> {
  try {
    // Check admin first
    const adminResult = await db
      .select({
        id: admins.id,
        clerkUserId: admins.clerkUserId,
        name: admins.name,
        email: admins.email,
        phone: admins.phone,
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

    // Check customer
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
      // Get email from Clerk since customers table doesn't have email
      const clerkUser = await clerkClient.users.getUser(clerkUserId)
      
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

    return null
  } catch (error) {
    console.error('Error getting user from database:', error)
    return null
  }
}

// Helper function to create customer from Clerk user
async function createCustomerFromClerk(clerkUser: any): Promise<User> {
  try {
    const email = clerkUser.emailAddresses?.[0]?.emailAddress || ''
    const phone = clerkUser.phoneNumbers?.[0]?.phoneNumber || ''
    const name = clerkUser.firstName || clerkUser.username || email.split('@')[0] || 'User'

    const customerResult = await db
      .insert(customers)
      .values({
        clerkUserId: clerkUser.sub,
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
    console.log(`Auto-created customer: ${email}`)

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
    throw new HTTPException(500, { message: 'Failed to create user account' })
  }
}

// Role-based middleware
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

// Environment variables needed:
/*
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key_here
NODE_ENV=production
*/

// Package.json dependency:
/*
npm install @clerk/clerk-sdk-node
*/