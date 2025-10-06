import { Context, Next } from 'hono'
import { getAuth } from '@hono/clerk-auth'
import { HTTPException } from 'hono/http-exception'

export const adminOnly = async (c: Context, next: Next) => {
  try {
    const auth = getAuth(c)
    
    if (!auth?.userId) {
      console.log('Admin middleware: No userId found')
      throw new HTTPException(401, { message: 'Authentication required' })
    }

    console.log('Admin middleware: Checking admin status for user:', auth.userId)

    // Check if user is admin in database
    const { AuthService } = await import('../services/AuthService')
    const authService = new AuthService()
    const isAdmin = await authService.isUserAdmin(auth.userId)
    
    if (!isAdmin) {
      console.log('Admin middleware: User is not admin')
      throw new HTTPException(403, { message: 'Admin access required' })
    }

    console.log('Admin middleware: User is admin, proceeding')
    await next()
  } catch (error) {
    console.error('Admin middleware error:', error)
    if (error instanceof HTTPException) throw error
    throw new HTTPException(403, { message: 'Admin access required' })
  }
}