import { PostgresMigrator } from './migrate-to-postgres';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

async function runMigration() {
  const migrator = new PostgresMigrator();

  try {
    console.log('Starting database migration...');

    await migrator.migrate(
      './data/panel_profits.db',
      {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        database: process.env.DB_NAME || 'panel_profits',
        user: process.env.DB_USER || 'panel_profits_user',
        password: process.env.DB_PASSWORD
      }
    );

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigration();