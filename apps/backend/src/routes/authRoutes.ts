import { Hono } from 'hono'
import { AuthController } from '../controllers/AuthController.js'

const authRoutes = new Hono()
const authController = new AuthController()

// Login
authRoutes.post('/login', async (c) => {
  return await authController.login(c)
})

// Register
authRoutes.post('/register', async (c) => {
  return await authController.register(c)
})

// Verify token
authRoutes.post('/verify', async (c) => {
  return await authController.verifyToken(c)
})

// Refresh token
authRoutes.post('/refresh', async (c) => {
  return await authController.refreshToken(c)
})

// Logout
authRoutes.post('/logout', async (c) => {
  return await authController.logout(c)
})

export { authRoutes }