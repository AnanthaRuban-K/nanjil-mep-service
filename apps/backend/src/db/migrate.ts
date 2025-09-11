import { migrate } from 'drizzle-orm/postgres-js/migrator'
import { migrationDb } from './index.js'
import * as dotenv from 'dotenv'

dotenv.config()

async function runMigration() {
  console.log('⏳ Running migrations...')
  
  try {
    await migrate(migrationDb, { 
      migrationsFolder: './drizzle',
      migrationsTable: 'drizzle_migrations'
    })
    console.log('✅ Migrations completed successfully!')
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
  
  process.exit(0)
}

runMigration()