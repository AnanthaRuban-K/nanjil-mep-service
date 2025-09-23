// File: middleware.ts - Updated for Latest Clerk Version
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  '/',
  '/services', 
  '/describe', 
  '/contact', 
  '/schedule', 
  '/summary', 
  '/success',
  '/sign-in(.*)', 
  '/sign-up(.*)',
  '/api/bookings',
  '/about',
  '/privacy',
  '/terms',
  '/api/webhook(.*)',
  '/api/health'
])

export default clerkMiddleware((auth, req) => {
  // Allow public routes without authentication
  if (isPublicRoute(req)) {
    return
  }
  
  // Protect all other routes
  auth().protect()
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}