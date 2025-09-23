// ===== apps/backend/src/db/index.ts =====
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as dotenv from 'dotenv'
import * as schema from './schema'

// Load environment variables
dotenv.config()

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is required')
}

console.log('🔗 Connecting to Neon PostgreSQL...')

// Create postgres client for Neon
const queryClient = postgres(databaseUrl, {
  ssl: 'require', // Required for Neon
  max: 20, // Connection pool size
})

// Create drizzle database instance
export const db = drizzle(queryClient, { schema })

// For migrations (separate client)
const migrationClient = postgres(databaseUrl, { 
  max: 1,
  ssl: 'require' 
})
export const migrationDb = drizzle(migrationClient, { schema })

console.log('✅ Database connection established')