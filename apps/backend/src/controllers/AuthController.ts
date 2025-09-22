import { Context } from 'hono'
import { AuthService } from '../services/AuthService.js'
import { HTTPException } from 'hono/http-exception'

export class AuthController {
  private authService: AuthService

  constructor() {
    this.authService = new AuthService()
  }

  async login(c: Context) {
    try {
      console.log('🔐 User login attempt...')
      const { email, password } = await c.req.json()

      if (!email || !password) {
        throw new HTTPException(400, { message: 'Email and password are required' })
      }

      const result = await this.authService.login(email, password)

      console.log('✅ User logged in successfully')
      return c.json({
        success: true,
        ...result,
        message: 'Login successful'
      })

    } catch (error) {
      console.error('❌ Login error:', error)
      if (error instanceof HTTPException) {
        throw error
      }
      throw new HTTPException(401, { message: 'Invalid credentials' })
    }
  }

  async register(c: Context) {
    try {
      console.log('📝 User registration attempt...')
      const { email, password, name, phone } = await c.req.json()

      if (!email || !password || !name) {
        throw new HTTPException(400, { message: 'Email, password, and name are required' })
      }

      const result = await this.authService.register({ email, password, name, phone })

      console.log('✅ User registered successfully')
      return c.json({
        success: true,
        ...result,
        message: 'Registration successful'
      }, 201)

    } catch (error) {
      console.error('❌ Registration error:', error)
      if (error instanceof HTTPException) {
        throw error
      }
      throw new HTTPException(500, { message: 'Failed to register user' })
    }
  }

  async verifyToken(c: Context) {
    try {
      const { token } = await c.req.json()

      if (!token) {
        throw new HTTPException(400, { message: 'Token is required' })
      }

      const result = await this.authService.verifyToken(token)

      return c.json({
        success: true,
        ...result
      })

    } catch (error) {
      console.error('❌ Token verification error:', error)
      throw new HTTPException(401, { message: 'Invalid token' })
    }
  }

  async refreshToken(c: Context) {
    try {
      const { refreshToken } = await c.req.json()

      if (!refreshToken) {
        throw new HTTPException(400, { message: 'Refresh token is required' })
      }

      const result = await this.authService.refreshToken(refreshToken)

      return c.json({
        success: true,
        ...result
      })

    } catch (error) {
      console.error('❌ Token refresh error:', error)
      throw new HTTPException(401, { message: 'Invalid refresh token' })
    }
  }

  async logout(c: Context) {
    try {
      const { token } = await c.req.json()

      if (token) {
        await this.authService.logout(token)
      }

      return c.json({
        success: true,
        message: 'Logged out successfully'
      })

    } catch (error) {
      console.error('❌ Logout error:', error)
      return c.json({
        success: true,
        message: 'Logged out successfully'
      })
    }
  }
}