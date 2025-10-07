import { db } from '../db/index'
import { admins, customers } from '../db/schema'
import { eq, or } from 'drizzle-orm'

export class AuthService {
  
  async getUserProfile(clerkUserId: string) {
    try {
      // Check if user is admin
      const admin = await db.select()
        .from(admins)
        .where(eq(admins.clerkUserId, clerkUserId))
      
      if (admin.length > 0) {
        return {
          ...admin[0],
          userType: 'admin'
        }
      }

      // Check if user is customer
      const customer = await db.select()
        .from(customers)
        .where(eq(customers.clerkUserId, clerkUserId))
      
      if (customer.length > 0) {
        return {
          ...customer[0],
          userType: 'customer'
        }
      }

      return null
    } catch (error) {
      console.error('getUserProfile error:', error)
      return null
    }
  }

  async updateUserProfile(clerkUserId: string, updateData: any) {
    try {
      // Try to update admin first
      const admin = await db.select()
        .from(admins)
        .where(eq(admins.clerkUserId, clerkUserId))
      
      if (admin.length > 0) {
        await db.update(admins)
          .set({ ...updateData, updatedAt: new Date() })
          .where(eq(admins.clerkUserId, clerkUserId))
        return true
      }

      // Try to update customer
      await db.update(customers)
        .set({ ...updateData, updatedAt: new Date() })
        .where(eq(customers.clerkUserId, clerkUserId))
      
      return true
    } catch (error) {
      console.error('updateUserProfile error:', error)
      throw new Error('Failed to update profile')
    }
  }

  async logout(clerkUserId: string) {
    try {
      // Clear any cached tokens or sessions if needed
      // For now, just log the logout
      console.log('User logged out:', clerkUserId)
      return true
    } catch (error) {
      console.error('logout error:', error)
      throw new Error('Failed to logout')
    }
  }

  async isUserAdmin(clerkUserId: string): Promise<boolean> {
  try {
    console.log('Checking admin for userId:', clerkUserId)
    
    const result = await db.select()
      .from(admins)
      .where(eq(admins.clerkUserId, clerkUserId))  // Make sure this matches your schema
    
    console.log('Admin query result:', result)
    console.log('Records found:', result.length)
    
    if (result.length > 0) {
      console.log('Admin record:', {
        id: result[0].id,
        clerkUserId: result[0].clerkUserId,
        isActive: result[0].isActive
      })
    }
    
    return result.length > 0 && result[0].isActive === 'true'
  } catch (error) {
    console.error('isUserAdmin error:', error)
    return false
  }
}

  async createAdmin(adminData: {
    clerkUserId: string
    name: string
    email: string
    phone?: string
    role?: string
  }) {
    try {
      const newAdmin = await db.insert(admins)
        .values({
          clerkUserId: adminData.clerkUserId,
          name: adminData.name,
          email: adminData.email,
          phone: adminData.phone || null,
          role: adminData.role || 'admin',
          isActive: 'true'
        })
        .returning()
      
      return newAdmin[0]
    } catch (error) {
      console.error('createAdmin error:', error)
      throw new Error('Failed to create admin')
    }
  }

  async listUsers(params: {
    userType?: string
    limit: number
    offset: number
  }) {
    try {
      if (params.userType === 'admin') {
        return await db.select()
          .from(admins)
          .limit(params.limit)
          .offset(params.offset)
      } else if (params.userType === 'customer') {
        return await db.select()
          .from(customers)
          .limit(params.limit)
          .offset(params.offset)
      }

      // Return both if no type specified
      const [adminsList, customersList] = await Promise.all([
        db.select().from(admins).limit(params.limit).offset(params.offset),
        db.select().from(customers).limit(params.limit).offset(params.offset)
      ])

      return [...adminsList, ...customersList]
    } catch (error) {
      console.error('listUsers error:', error)
      return []
    }
  }

  async deactivateUser(clerkUserId: string) {
    try {
      // Try admin first
      const admin = await db.select()
        .from(admins)
        .where(eq(admins.clerkUserId, clerkUserId))
      
      if (admin.length > 0) {
        await db.update(admins)
          .set({ isActive: 'false', updatedAt: new Date() })
          .where(eq(admins.clerkUserId, clerkUserId))
        return true
      }

      // Try customer
      await db.update(customers)
        .set({ isActive: 'false', updatedAt: new Date() })
        .where(eq(customers.clerkUserId, clerkUserId))
      
      return true
    } catch (error) {
      console.error('deactivateUser error:', error)
      throw new Error('Failed to deactivate user')
    }
  }
}