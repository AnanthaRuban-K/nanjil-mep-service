// src/db/schema.ts - Updated Database Schema
import { pgTable, serial, varchar, text, timestamp, jsonb, decimal, integer, boolean } from 'drizzle-orm/pg-core'

// BOOKINGS TABLE
export const bookings = pgTable('bookings', {
  id: serial('id').primaryKey(),
  bookingNumber: varchar('booking_number', { length: 20 }).notNull().unique(),
  
  // Service information
  serviceType: varchar('service_type', { length: 50 }).notNull(), // 'electrical' | 'plumbing'
  priority: varchar('priority', { length: 20 }).notNull().default('normal'), // 'normal' | 'urgent' | 'emergency'
  description: text('description').notNull(),
  
  // Contact information
  contactInfo: jsonb('contact_info').notNull(), // { name, phone, address }
  
  // Scheduling
  scheduledTime: timestamp('scheduled_time').notNull(),
  
  // Status tracking
  status: varchar('status', { length: 20 }).notNull().default('pending'), // 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
  
  // Pricing
  totalCost: decimal('total_cost', { precision: 10, scale: 2 }),
  actualCost: decimal('actual_cost', { precision: 10, scale: 2 }),
  
  // Feedback
  rating: integer('rating'), // 1-5 stars
  review: text('review'),
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  completedAt: timestamp('completed_at')
})

// SERVICES TABLE
export const services = pgTable('services', {
  id: serial('id').primaryKey(),
  name_en: varchar('name_en', { length: 100 }).notNull(),
  name_ta: varchar('name_ta', { length: 100 }).notNull(),
  category: varchar('category', { length: 50 }).notNull(), // 'electrical' | 'plumbing'
  description_en: text('description_en'),
  description_ta: text('description_ta'),
  baseCost: decimal('base_cost', { precision: 10, scale: 2 }).notNull(),
  isActive: varchar('is_active', { length: 10 }).notNull().default('true'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
})

// CUSTOMERS TABLE
export const customers = pgTable('customers', {
  id: serial('id').primaryKey(),
  clerkUserId: varchar('clerk_user_id', { length: 100 }).unique(),
  name: varchar('name', { length: 100 }).notNull(),
  phone: varchar('phone', { length: 15 }).notNull().unique(),
  address: text('address'),
  language: varchar('language', { length: 5 }).notNull().default('ta'),
  isActive: varchar('is_active', { length: 10 }).notNull().default('true'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
})

// ADMINS TABLE
export const admins = pgTable('admins', {
  id: serial('id').primaryKey(),
  clerkUserId: varchar('clerk_user_id', { length: 100 }).unique(),
  name: varchar('name', { length: 100 }).notNull(),
  email: varchar('email', { length: 100 }).notNull().unique(),
  phone: varchar('phone', { length: 15 }),
  role: varchar('role', { length: 20 }).notNull().default('admin'),
  isActive: varchar('is_active', { length: 10 }).notNull().default('true'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
})



// Update your existing notifications table to match the service
export const notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),
  bookingId: integer('booking_id').references(() => bookings.id),
  customerId: integer('customer_id').references(() => customers.id),
  adminId: integer('admin_id').references(() => admins.id),
  type: varchar('type', { length: 50 }).notNull(), // 'new_booking', 'emergency_booking', 'booking_updated', etc.
  title: varchar('title', { length: 200 }).notNull(),
  message: text('message').notNull(),
  priority: varchar('priority', { length: 20 }).notNull().default('normal'), // 'normal', 'urgent', 'emergency'
  isRead: varchar('is_read', { length: 10 }).notNull().default('false'), // Using varchar to match your pattern
  createdAt: timestamp('created_at').defaultNow()
})

// AUDIT LOG TABLE (Optional - for tracking changes)
export const auditLog = pgTable('audit_log', {
  id: serial('id').primaryKey(),
  tableName: varchar('table_name', { length: 50 }).notNull(),
  recordId: integer('record_id').notNull(),
  action: varchar('action', { length: 20 }).notNull(), // 'CREATE', 'UPDATE', 'DELETE'
  oldValues: jsonb('old_values'),
  newValues: jsonb('new_values'),
  userId: varchar('user_id', { length: 100 }),
  userType: varchar('user_type', { length: 20 }), // 'admin', 'customer', 'system'
  createdAt: timestamp('created_at').defaultNow()
})

export const adminTokens = pgTable('admin_tokens', {
  id: serial('id').primaryKey(),
  token: varchar('token', { length: 500 }).notNull().unique(),
  adminId: integer('admin_id').references(() => admins.id),
  deviceType: varchar('device_type', { length: 50 }), // 'web', 'android', 'ios'
  isActive: boolean('is_active').notNull().default(true),
  lastUsed: timestamp('last_used').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
})



// Type exports
export type Booking = typeof bookings.$inferSelect
export type NewBooking = typeof bookings.$inferInsert
export type Service = typeof services.$inferSelect
export type NewService = typeof services.$inferInsert
export type Customer = typeof customers.$inferSelect
export type NewCustomer = typeof customers.$inferInsert
export type Admin = typeof admins.$inferSelect
export type NewAdmin = typeof admins.$inferInsert
export type Notification = typeof notifications.$inferSelect
export type AuditLog = typeof auditLog.$inferSelect