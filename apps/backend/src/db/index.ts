// ===== apps/backend/src/db/index.ts =====
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as dotenv from 'dotenv'
import * as schema from './schema'

dotenv.config()

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is required')
}

console.log('Connecting to Neon PostgreSQL...')

// Create postgres client for Neon
const queryClient = postgres(databaseUrl, {
  ssl: 'require',
  max: 20,
  idle_timeout: 20,
  connect_timeout: 10,
})

// Create drizzle database instance
export const db = drizzle(queryClient, { schema })

// For migrations
const migrationClient = postgres(databaseUrl, { 
  max: 1,
  ssl: 'require' 
})
export const migrationDb = drizzle(migrationClient, { schema })

// Test connection on startup
;(async () => {
  try {
    await queryClient`SELECT 1`
    console.log('Database connection successful')
  } catch (error) {
    console.error('Database connection failed:', error)
    process.exit(1)
  }
})()