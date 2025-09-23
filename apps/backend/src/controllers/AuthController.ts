// src/controllers/AuthController.ts
import { Context } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { getAuthenticatedUser } from '../middleware/authMiddleware'
import { db } from '../db'
import { customers, admins } from '../db/schema.js'
import { eq } from 'drizzle-orm'

export class AuthController {
  
  // Get current user profile
  async me(c: Context) {
    try {
      const user = getAuthenticatedUser(c)
      
      return c.json({
        success: true,
        user
      })
    } catch (error) {
      throw new HTTPException(401, { message: 'User not authenticated' })
    }
  }

  // Update user profile
  async updateProfile(c: Context) {
    try {
      const user = getAuthenticatedUser(c)
      const { name, phone, address } = await c.req.json()

      if (!name || name.trim().length < 2) {
        throw new HTTPException(400, { message: 'Valid name is required' })
      }

      if (user.role === 'admin') {
        await db
          .update(admins)
          .set({
            name: name.trim(),
            phone: phone?.trim(),
            updatedAt: new Date()
          })
          .where(eq(admins.id, parseInt(user.id)))
      } else {
        await db
          .update(customers)
          .set({
            name: name.trim(),
            phone: phone?.trim(),
            address: address?.trim(),
            updatedAt: new Date()
          })
          .where(eq(customers.id, parseInt(user.id)))
      }

      return c.json({
        success: true,
        message: 'Profile updated successfully'
      })

    } catch (error) {
      console.error('Update profile error:', error)
      if (error instanceof HTTPException) {
        throw error
      }
      throw new HTTPException(500, { message: 'Failed to update profile' })
    }
  }

  // Admin: Create admin user
  async createAdmin(c: Context) {
    try {
      const currentUser = getAuthenticatedUser(c)
      
      if (currentUser.role !== 'admin') {
        throw new HTTPException(403, { message: 'Admin access required' })
      }

      const { clerkUserId, name, email, phone, role = 'admin' } = await c.req.json()

      if (!clerkUserId || !name || !email) {
        throw new HTTPException(400, { message: 'Clerk User ID, name, and email are required' })
      }

      const existingAdmin = await db
        .select({ id: admins.id })
        .from(admins)
        .where(eq(admins.clerkUserId, clerkUserId))
        .limit(1)

      if (existingAdmin.length > 0) {
        throw new HTTPException(400, { message: 'Admin already exists' })
      }

      const newAdmin = await db
        .insert(admins)
        .values({
          clerkUserId,
          name: name.trim(),
          email: email.toLowerCase().trim(),
          phone: phone?.trim(),
          role
        })
        .returning({
          id: admins.id,
          name: admins.name,
          email: admins.email,
          role: admins.role
        })

      console.log(`Admin created: ${email}`)

      return c.json({
        success: true,
        message: 'Admin created successfully',
        admin: newAdmin[0]
      }, 201)

    } catch (error) {
      console.error('Create admin error:', error)
      if (error instanceof HTTPException) {
        throw error
      }
      throw new HTTPException(500, { message: 'Failed to create admin' })
    }
  }

  // Admin: List all users
  async listUsers(c: Context) {
    try {
      const currentUser = getAuthenticatedUser(c)
      
      if (currentUser.role !== 'admin') {
        throw new HTTPException(403, { message: 'Admin access required' })
      }

      const page = parseInt(c.req.query('page') || '1')
      const limit = parseInt(c.req.query('limit') || '20')
      const offset = (page - 1) * limit

      const customersList = await db
        .select({
          id: customers.id,
          clerkUserId: customers.clerkUserId,
          name: customers.name,
          phone: customers.phone,
          isActive: customers.isActive,
          createdAt: customers.createdAt
        })
        .from(customers)
        .limit(limit)
        .offset(offset)

      const adminsList = await db
        .select({
          id: admins.id,
          clerkUserId: admins.clerkUserId,
          name: admins.name,
          email: admins.email,
          phone: admins.phone,
          role: admins.role,
          isActive: admins.isActive,
          createdAt: admins.createdAt
        })
        .from(admins)
        .limit(limit)
        .offset(offset)

      return c.json({
        success: true,
        data: {
          customers: customersList,
          admins: adminsList,
          pagination: {
            page,
            limit,
            hasMore: customersList.length === limit || adminsList.length === limit
          }
        }
      })

    } catch (error) {
      console.error('List users error:', error)
      if (error instanceof HTTPException) {
        throw error
      }
      throw new HTTPException(500, { message: 'Failed to list users' })
    }
  }

  // Admin: Deactivate user
  async deactivateUser(c: Context) {
    try {
      const currentUser = getAuthenticatedUser(c)
      
      if (currentUser.role !== 'admin') {
        throw new HTTPException(403, { message: 'Admin access required' })
      }

      const userId = c.req.param('userId')
      const { userType } = await c.req.json()

      if (!userId || !userType) {
        throw new HTTPException(400, { message: 'User ID and user type are required' })
      }

      if (userType === 'admin') {
        await db
          .update(admins)
          .set({ isActive: 'false', updatedAt: new Date() })
          .where(eq(admins.id, parseInt(userId)))
      } else {
        await db
          .update(customers)
          .set({ isActive: 'false', updatedAt: new Date() })
          .where(eq(customers.id, parseInt(userId)))
      }

      return c.json({
        success: true,
        message: 'User deactivated successfully'
      })

    } catch (error) {
      console.error('Deactivate user error:', error)
      if (error instanceof HTTPException) {
        throw error
      }
      throw new HTTPException(500, { message: 'Failed to deactivate user' })
    }
  }

  // Simple logout
  async logout(c: Context) {
    try {
      const user = getAuthenticatedUser(c)
      console.log(`User logged out: ${user.email}`)
      
      return c.json({
        success: true,
        message: 'Logged out successfully'
      })
    } catch (error) {
      return c.json({
        success: true,
        message: 'Logged out successfully'
      })
    }
  }
}