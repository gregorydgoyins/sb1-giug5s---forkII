import { DatabaseService } from '../DatabaseService';
import { ErrorHandler } from '../../../utils/errors';
import { Client } from 'pg';
import { Database } from 'sqlite3';
import { promisify } from 'util';

export class PostgresMigrator {
  private errorHandler: ErrorHandler;
  private sourceDb: Database;
  private targetDb: Client;

  constructor() {
    this.errorHandler = ErrorHandler.getInstance();
  }

  public async migrate(
    sqliteDbPath: string,
    postgresConfig: {
      host: string;
      port: number;
      database: string;
      user: string;
      password: string;
    }
  ): Promise<void> {
    return this.errorHandler.withErrorHandling(async () => {
      // Connect to databases
      await this.connectDatabases(sqliteDbPath, postgresConfig);

      // Migrate schema
      await this.migrateSchema();

      // Migrate data
      await this.migrateData();

      // Verify migration
      await this.verifyMigration();

      // Close connections
      await this.cleanup();
    }, {
      context: 'PostgresMigrator',
      operation: 'migrate'
    });
  }

  private async connectDatabases(
    sqliteDbPath: string,
    postgresConfig: any
  ): Promise<void> {
    // Connect to SQLite
    this.sourceDb = new Database(sqliteDbPath);

    // Connect to PostgreSQL
    this.targetDb = new Client(postgresConfig);
    await this.targetDb.connect();
  }

  private async migrateSchema(): Promise<void> {
    const tables = [
      'users',
      'portfolios',
      'assets',
      'positions',
      'trades'
    ];

    for (const table of tables) {
      // Get SQLite schema
      const schema = await this.getSqliteSchema(table);
      
      // Convert and create PostgreSQL schema
      const pgSchema = this.convertSqliteSchema(schema);
      await this.targetDb.query(pgSchema);
    }
  }

  private async migrateData(): Promise<void> {
    const tables = [
      'users',
      'portfolios',
      'assets',
      'positions',
      'trades'
    ];

    for (const table of tables) {
      await this.migrateTableData(table);
    }
  }

  private async migrateTableData(table: string): Promise<void> {
    const get = promisify(this.sourceDb.all).bind(this.sourceDb);
    const rows = await get(`SELECT * FROM ${table}`);

    if (rows.length === 0) return;

    const columns = Object.keys(rows[0]);
    const values = rows.map(row => 
      columns.map(col => this.convertValue(row[col]))
    );

    const query = `
      INSERT INTO ${table} (${columns.join(', ')})
      VALUES ${values.map(v => `(${v.join(', ')})`).join(', ')}
    `;

    await this.targetDb.query(query);
  }

  private convertValue(value: any): string {
    if (value === null) return 'NULL';
    if (typeof value === 'number') return value.toString();
    if (typeof value === 'boolean') return value ? 'TRUE' : 'FALSE';
    if (value instanceof Date) return `'${value.toISOString()}'`;
    return `'${value.toString().replace(/'/g, "''")}'`;
  }

  private async verifyMigration(): Promise<void> {
    const tables = [
      'users',
      'portfolios',
      'assets',
      'positions',
      'trades'
    ];

    for (const table of tables) {
      const sqliteCount = await this.getTableCount(this.sourceDb, table);
      const pgCount = await this.getTableCount(this.targetDb, table);

      if (sqliteCount !== pgCount) {
        throw new Error(`Migration verification failed for table ${table}`);
      }
    }
  }

  private async getTableCount(db: any, table: string): Promise<number> {
    if (db instanceof Database) {
      const get = promisify(db.get).bind(db);
      const result = await get(`SELECT COUNT(*) as count FROM ${table}`);
      return result.count;
    } else {
      const result = await db.query(`SELECT COUNT(*) as count FROM ${table}`);
      return parseInt(result.rows[0].count);
    }
  }

  private async cleanup(): Promise<void> {
    await this.targetDb.end();
    await promisify(this.sourceDb.close).bind(this.sourceDb)();
  }

  private async getSqliteSchema(table: string): Promise<string> {
    const get = promisify(this.sourceDb.get).bind(this.sourceDb);
    const result = await get(`SELECT sql FROM sqlite_master WHERE type='table' AND name=?`, [table]);
    return result.sql;
  }

  private convertSqliteSchema(sqliteSchema: string): string {
    // Convert SQLite data types to PostgreSQL
    return sqliteSchema
      .replace(/INTEGER PRIMARY KEY AUTOINCREMENT/gi, 'SERIAL PRIMARY KEY')
      .replace(/DATETIME/gi, 'TIMESTAMP')
      .replace(/INTEGER/gi, 'INTEGER')
      .replace(/REAL/gi, 'DECIMAL(15,2)')
      .replace(/TEXT/gi, 'TEXT')
      .replace(/BLOB/gi, 'BYTEA');
  }
}