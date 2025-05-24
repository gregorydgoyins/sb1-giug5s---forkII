import pg from 'pg';
import { config } from 'dotenv';
import { readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const { Client } = pg;

// Get current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
config({ path: '.env.local' });

async function setupDatabase() {
  // Connect to PostgreSQL with superuser privileges to create database and user
  const adminClient = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: 'postgres',
    user: 'postgres'
  });

  try {
    await adminClient.connect();
    
    // Create database and user
    await adminClient.query(`
      CREATE DATABASE panel_profits;
      CREATE USER panel_profits_user WITH ENCRYPTED PASSWORD '${process.env.DB_PASSWORD}';
      GRANT ALL PRIVILEGES ON DATABASE panel_profits TO panel_profits_user;
    `);

    // Connect to the new database
    const client = new Client({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      database: 'panel_profits',
      user: process.env.DB_USER || 'panel_profits_user',
      password: process.env.DB_PASSWORD
    });

    await client.connect();

    // Read and execute migration files
    const migrations = [
      '001_initial_schema.sql',
      '002_news_schema.sql',
      '003_monitoring_schema.sql'
    ];

    for (const migration of migrations) {
      const sql = readFileSync(
        join(__dirname, '..', 'migrations', migration),
        'utf8'
      );
      await client.query(sql);
      console.log(`Executed migration: ${migration}`);
    }

    console.log('Database setup completed successfully!');
    
    await client.end();
    await adminClient.end();
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  }
}

setupDatabase();