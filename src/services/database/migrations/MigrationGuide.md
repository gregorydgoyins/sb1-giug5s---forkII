# PostgreSQL Migration Guide

## 1. Install Dependencies

First, update package.json to include PostgreSQL dependencies:

```json
{
  "dependencies": {
    "pg": "^8.11.3",
    "pg-copy-streams": "^6.0.6"
  }
}
```

Run `npm install` to install the new dependencies.

## 2. Backup SQLite Database

Before migration, create a backup of your SQLite database:

```bash
# Create backups directory
mkdir -p backups

# Backup SQLite database
sqlite3 ./data/panel_profits.db ".backup './backups/panel_profits_backup.db'"
```

## 3. Install PostgreSQL

### Ubuntu/Debian:
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

### macOS (using Homebrew):
```bash
brew install postgresql
brew services start postgresql
```

## 4. Create PostgreSQL Database

```bash
# Connect to PostgreSQL
sudo -u postgres psql

# Create database and user
CREATE DATABASE panel_profits;
CREATE USER panel_profits_user WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE panel_profits TO panel_profits_user;
```

## 5. Update Configuration

Update the database configuration to use PostgreSQL instead of SQLite. The configuration will be automatically loaded from environment variables.

## 6. Run Migration Script

Use the provided migration script to transfer data:

```bash
npm run migrate:postgres
```

## 7. Verify Migration

```bash
# Connect to PostgreSQL database
psql -U panel_profits_user -d panel_profits

# Verify tables and data
\dt
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM portfolios;
SELECT COUNT(*) FROM assets;
```

## 8. Troubleshooting

Common issues and solutions:

1. Connection Issues:
   - Verify PostgreSQL is running: `sudo systemctl status postgresql`
   - Check connection settings in .env file
   - Ensure firewall allows PostgreSQL port (default 5432)

2. Permission Issues:
   - Verify user permissions: `\du` in psql
   - Check database ownership: `\l` in psql
   - Update pg_hba.conf if needed

3. Data Type Mismatches:
   - Review schema conversion in migration script
   - Check for SQLite-specific data types
   - Verify decimal precision and scale

4. Performance Issues:
   - Analyze query performance: `EXPLAIN ANALYZE`
   - Update PostgreSQL configuration
   - Review and update indexes

## Support

For additional assistance:
- Check PostgreSQL logs: `tail -f /var/log/postgresql/postgresql-*.log`
- Review application logs
- Contact database administrator