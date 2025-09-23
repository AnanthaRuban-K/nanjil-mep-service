// Fixed migration file for CommonJS
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import { migrationDb } from './index'
import * as path from 'path'
import { fileURLToPath } from 'url'

async function runMigrations() {
  console.log('🔄 Running database migrations...')
  
  try {
    await migrate(migrationDb, { migrationsFolder: './drizzle' })
    console.log('✅ Migrations completed successfully!')
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

// CommonJS-compatible way to check if file is being run directly
const isMainModule = require.main === module

if (isMainModule) {
  runMigrations()
}

export { runMigrations }