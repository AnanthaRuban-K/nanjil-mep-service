import { Context } from 'hono'
import { AuthService } from '../services/AuthService'
import { HTTPException } from 'hono/http-exception'

export class AuthController {
  private authService: AuthService

  constructor() {
    this.authService = new AuthService()
  }

  async me(c: Context) {
    try {
      const userId = c.get('userId')
      
      console.log('Getting user profile:', userId)
      
      const user = await this.authService.getUserProfile(userId)
      
      if (!user) {
        throw new HTTPException(404, { message: 'User not found' })
      }

      return c.json({
        success: true,
        user
      })
    } catch (error) {
      console.error('Get user profile error:', error)
      if (error instanceof HTTPException) throw error
      throw new HTTPException(500, { message: 'Failed to get user profile' })
    }
  }

  async updateProfile(c: Context) {
    try {
      const userId = c.get('userId')
      const updateData = await c.req.json()

      console.log('Updating user profile:', userId)

      await this.authService.updateUserProfile(userId, updateData)

      return c.json({
        success: true,
        message: 'Profile updated successfully'
      })
    } catch (error) {
      console.error('Update profile error:', error)
      throw new HTTPException(500, { message: 'Failed to update profile' })
    }
  }

  async logout(c: Context) {
    try {
      const userId = c.get('userId')
      
      console.log('Logging out user:', userId)
      
      await this.authService.logout(userId)

      return c.json({
        success: true,
        message: 'Logged out successfully'
      })
    } catch (error) {
      console.error('Logout error:', error)
      throw new HTTPException(500, { message: 'Failed to logout' })
    }
  }

  async createAdmin(c: Context) {
    try {
      const adminData = await c.req.json()
      
      console.log('Creating new admin')

      const admin = await this.authService.createAdmin(adminData)

      return c.json({
        success: true,
        message: 'Admin created successfully',
        admin
      })
    } catch (error) {
      console.error('Create admin error:', error)
      throw new HTTPException(500, { message: 'Failed to create admin' })
    }
  }

  async listUsers(c: Context) {
    try {
      const userType = c.req.query('type') // 'admin' | 'customer'
      const limit = Number(c.req.query('limit')) || 50
      const offset = Number(c.req.query('offset')) || 0

      console.log('Listing users:', { userType, limit, offset })

      const users = await this.authService.listUsers({ userType, limit, offset })

      return c.json({
        success: true,
        users,
        count: users.length
      })
    } catch (error) {
      console.error('List users error:', error)
      throw new HTTPException(500, { message: 'Failed to list users' })
    }
  }

  async deactivateUser(c: Context) {
    try {
      const targetUserId = c.req.param('userId')
      
      console.log('Deactivating user:', targetUserId)

      await this.authService.deactivateUser(targetUserId)

      return c.json({
        success: true,
        message: 'User deactivated successfully'
      })
    } catch (error) {
      console.error('Deactivate user error:', error)
      throw new HTTPException(500, { message: 'Failed to deactivate user' })
    }
  }
}