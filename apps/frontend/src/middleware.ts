// File: middleware.ts - Fixed for Latest Clerk Version
import { authMiddleware } from "@clerk/nextjs"

export default authMiddleware({
  // Public routes (accessible without authentication)
  publicRoutes: [
    "/",
    "/services", 
    "/describe", 
    "/contact", 
    "/schedule", 
    "/summary", 
    "/success",
    "/sign-in(.*)", 
    "/sign-up(.*)",
    "/api/bookings",  // Allow public booking creation
    "/about",
    "/privacy",
    "/terms"
  ],
  
  // Ignored routes (no auth check at all)
  ignoredRoutes: [
    "/api/webhook(.*)",
    "/api/health",
    "/_next(.*)",
    "/favicon.ico",
    "/robots.txt",
    "/sitemap.xml"
  ],

  // Debug mode for development only
  debug: process.env.NODE_ENV === 'development'
})

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"]
}