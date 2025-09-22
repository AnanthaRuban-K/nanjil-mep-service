import { migrate } from 'drizzle-orm/postgres-js/migrator'
import { migrationDb } from './index.js'

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

if (import.meta.url === `file://${process.argv[1]}`) {
  runMigrations()
}

export { runMigrations }