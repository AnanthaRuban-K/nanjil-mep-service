// apps/backend/src/db/schema.ts - SIMPLIFIED VERSION
import { pgTable, serial, varchar, text, timestamp, jsonb, decimal, integer } from 'drizzle-orm/pg-core'

// SIMPLIFIED BOOKINGS TABLE - Remove complex features
export const bookings = pgTable('bookings', {
  id: serial('id').primaryKey(),
  bookingNumber: varchar('booking_number', { length: 20 }).notNull().unique(),
  
  // Basic service info
  serviceType: varchar('service_type', { length: 50 }).notNull(), // 'electrical' | 'plumbing'
  priority: varchar('priority', { length: 20 }).notNull().default('normal'), // 'normal' | 'urgent' | 'emergency'
  description: text('description').notNull(),
  
  // Contact info (simplified)
  contactInfo: jsonb('contact_info').notNull(), // { name, phone, address }
  
  // Time scheduling (simplified)
  scheduledTime: timestamp('scheduled_time').notNull(),
  
  // Status tracking (simplified)
  status: varchar('status', { length: 20 }).notNull().default('pending'), // 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
  
  // Cash payment mention (no tracking)
  totalCost: decimal('total_cost', { precision: 10, scale: 2 }),
  
  // Rating system (simplified)
  rating: integer('rating'), // 1-5 stars
  review: text('review'),
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  completedAt: timestamp('completed_at')
})

// SIMPLIFIED SERVICES TABLE - Just for reference
export const services = pgTable('services', {
  id: serial('id').primaryKey(),
  name_en: varchar('name_en', { length: 100 }).notNull(),
  name_ta: varchar('name_ta', { length: 100 }).notNull(),
  category: varchar('category', { length: 50 }).notNull(), // 'electrical' | 'plumbing'
  description_en: text('description_en'),
  description_ta: text('description_ta'),
  baseCost: decimal('base_cost', { precision: 10, scale: 2 }).notNull(),
  isActive: varchar('is_active', { length: 10 }).notNull().default('true')
})

// CUSTOMERS TABLE - Simple user info
export const customers = pgTable('customers', {
  id: serial('id').primaryKey(),
  clerkUserId: varchar('clerk_user_id', { length: 100 }).unique(),
  name: varchar('name', { length: 100 }).notNull(),
  phone: varchar('phone', { length: 15 }).notNull(),
  address: text('address'),
  language: varchar('language', { length: 5 }).default('ta'), // 'ta' | 'en'
  createdAt: timestamp('created_at').defaultNow()
})

// ADMINS TABLE - Simple admin management
export const admins = pgTable('admins', {
  id: serial('id').primaryKey(),
  clerkUserId: varchar('clerk_user_id', { length: 100 }).unique(),
  name: varchar('name', { length: 100 }).notNull(),
  email: varchar('email', { length: 100 }).notNull(),
  phone: varchar('phone', { length: 15 }),
  role: varchar('role', { length: 20 }).default('admin'),
  isActive: varchar('is_active', { length: 10 }).notNull().default('true'),
  createdAt: timestamp('created_at').defaultNow()
})

// Type exports
export type Booking = typeof bookings.$inferSelect
export type NewBooking = typeof bookings.$inferInsert
export type Service = typeof services.$inferSelect
export type Customer = typeof customers.$inferSelect
export type Admin = typeof admins.$inferSelect

// REMOVED COMPLEX TABLES:
// - teams (no team assignment)
// - products (no inventory)
// - service_areas (simplified location)
// - booking_events (no complex tracking)
// - inventory_items (no inventory management)
// - performance_metrics (no analytics)