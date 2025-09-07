import { migrate } from 'drizzle-orm/postgres-js/migrator'
import { migrationDb } from './index'
import * as dotenv from 'dotenv'

dotenv.config()

async function runMigrations() {
  console.log('🚀 Running database migrations...')
  
  try {
    await migrate(migrationDb, { 
      migrationsFolder: './drizzle',
    })
    console.log('✅ Migrations completed successfully!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

runMigrations()