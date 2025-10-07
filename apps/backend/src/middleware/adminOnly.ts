import { Context, Next } from 'hono'
import { getAuth } from '@hono/clerk-auth'
import { HTTPException } from 'hono/http-exception'

export const adminOnly = async (c: Context, next: Next) => {
  try {
    console.log('========== ADMIN MIDDLEWARE DEBUG ==========')
    console.log('Request URL:', c.req.url)
    console.log('Authorization Header:', c.req.header('authorization')?.substring(0, 50) + '...')
    
    const auth = getAuth(c)
    console.log('Clerk Auth userId:', auth?.userId)
    
    if (!auth?.userId) {
      console.log('❌ No userId found')
      throw new HTTPException(401, { message: 'Authentication required' })
    }

    console.log('✅ Clerk userId found:', auth.userId)
    console.log('Checking if user is admin in database...')

    const { AuthService } = await import('../services/AuthService')
    const authService = new AuthService()
    const isAdmin = await authService.isUserAdmin(auth.userId)
    
    console.log('isAdmin result:', isAdmin)
    
    if (!isAdmin) {
      console.log('❌ User is not admin')
      throw new HTTPException(403, { message: 'Admin access required' })
    }

    console.log('✅ User is admin, proceeding')
    await next()
  } catch (error) {
    console.error('❌ Admin middleware error:', error)
    if (error instanceof HTTPException) throw error
    throw new HTTPException(403, { message: 'Admin access required' })
  }
}