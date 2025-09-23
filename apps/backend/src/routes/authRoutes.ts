// src/routes/authRoutes.ts
import { Hono } from 'hono'
import { AuthController } from '../controllers/AuthController'
import { authMiddleware, requireAdmin } from '../middleware/AuthMiddleware'

export const authRoutes = new Hono()
const authController = new AuthController()

// Protected routes - require authentication
authRoutes.get('/me', authMiddleware, (c) => authController.me(c))
authRoutes.put('/profile', authMiddleware, (c) => authController.updateProfile(c))
authRoutes.post('/logout', authMiddleware, (c) => authController.logout(c))

// Admin-only routes
authRoutes.post('/admin/create', authMiddleware, requireAdmin, (c) => authController.createAdmin(c))
authRoutes.get('/admin/users', authMiddleware, requireAdmin, (c) => authController.listUsers(c))
authRoutes.put('/admin/users/:userId/deactivate', authMiddleware, requireAdmin, (c) => authController.deactivateUser(c))