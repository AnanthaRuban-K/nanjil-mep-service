// src/main.ts - Main Application Entry Point
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { prettyJSON } from 'hono/pretty-json'
import { secureHeaders } from 'hono/secure-headers'
import { timing } from 'hono/timing'
import { clerkMiddleware } from '@hono/clerk-auth'
import './types/hono-env'

// Routes
import { bookingRoutes } from './routes/BookingRoutes'
import { adminRoutes } from './routes/AdminRoutes'
import { serviceRoutes } from './routes/ServiceRoutes'
import { customerRoutes } from './routes/CustomerRoutes'

// Middleware
import { errorHandler } from './middleware/ErrorHandler'
import { rateLimiter } from './middleware/RateLimiter'

// Utils
import { validateEnv } from './utils/env.js'
import { notificationRoutes } from './routes/NotificationRoutes'
const app = new Hono()

// Validate environment variables
validateEnv()

// Global Middleware
app.use('*', timing())
app.use('*', logger())
app.use('*', secureHeaders())
app.use('*', prettyJSON())

// CORS Configuration (BEFORE Clerk middleware)
app.use('*', cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [
        'https://nanjilmepservice.com',
        'https://www.nanjilmepservice.com',
        'http://nanjilmepservice.com',
        'http://api.nanjilmepservice.com'
      ]
    : [
        'http://localhost:3100',
      ],
  allowHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'Accept',
    'Origin'
  ],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  credentials: true,
  maxAge: 86400,
}))

// CRITICAL: Clerk Middleware MUST be applied before auth routes
app.use('*', clerkMiddleware({
  publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!,
  secretKey: process.env.CLERK_SECRET_KEY!,
}))

// Rate Limiting
app.use('/api/*', rateLimiter)

// Health Check Endpoint
app.get('/health', (c) => {
  return c.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    service: 'Nanjil MEP Service API',
    database: 'connected',
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100,
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024 * 100) / 100
    }
  })
})
app.route('/api/notifications', notificationRoutes)
// API Routes

app.route('/api/bookings', bookingRoutes)
app.route('/api/admin', adminRoutes)
app.route('/api/services', serviceRoutes)
app.route('/api/customers', customerRoutes)

// Root Endpoint
app.get('/', (c) => {
  return c.json({ 
    message: 'Nanjil MEP Service API',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    documentation: '/api/docs',
    health: '/health',
    features: [
      'Customer booking management',
      'Admin dashboard with real-time metrics',
      'Service scheduling and tracking',
      'Tamil/English bilingual support',
      'Mobile-optimized responses',
      'Real-time notifications',
      'Secure authentication with Clerk',
      'Rate limiting protection'
    ],
    endpoints: {
      auth: '/api/auth',
      bookings: '/api/bookings',
      admin: '/api/admin',
      services: '/api/services',
      customers: '/api/customers'
    }
  })
})

// API Documentation
app.get('/api/docs', (c) => {
  return c.json({
    title: 'Nanjil MEP Service API Documentation',
    version: '1.0.0',
    baseUrl: process.env.API_BASE_URL || 'http://localhost:3101',
    authentication: 'Bearer token (Clerk JWT)',
    endpoints: {
      'GET /api/auth/me': 'Get current user profile',
      'PUT /api/auth/profile': 'Update user profile',
      'POST /api/auth/logout': 'Logout user',
      'POST /api/auth/admin': 'Create admin user (admin only)',
      'GET /api/auth/users': 'List all users (admin only)',
      'PUT /api/auth/users/:id/deactivate': 'Deactivate user (admin only)',
      'POST /api/bookings': 'Create a new service booking',
      'GET /api/bookings/:id': 'Get booking details',
      'PUT /api/bookings/:id/cancel': 'Cancel a booking',
      'POST /api/bookings/:id/feedback': 'Submit booking feedback',
      'GET /api/admin/dashboard': 'Get admin dashboard metrics',
      'GET /api/admin/bookings': 'Get all bookings (admin)',
      'PUT /api/admin/bookings/:id/status': 'Update booking status',
      'GET /api/services': 'Get available services',
      'POST /api/customers': 'Create customer profile',
      'GET /api/customers/profile': 'Get customer profile'
    }
  })
})

// 404 Handler
app.notFound((c) => {
  return c.json({ 
    error: 'Endpoint not found',
    message: 'The requested API endpoint does not exist'
  }, 404)
})

// Global Error Handler
app.onError(errorHandler)

// Start Server
const port = Number(process.env.PORT) || 3101
const hostname = process.env.HOST || "0.0.0.0"

serve({
  fetch: app.fetch,
  hostname,
  port,
}, (info) => {
  console.log('Server Started')
  console.log(`URL: http://${hostname}:${port}`)
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`Health Check: http://${hostname}:${port}/health`)
  console.log(`Documentation: http://${hostname}:${port}/api/docs`)
  console.log('Ready to handle requests')
})