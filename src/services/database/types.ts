export interface QueryResult<T> {
  rows: T[];
  rowCount: number;
  fields: Array<{
    name: string;
    dataType: string;
  }>;
}

export interface Transaction {
  query<T>(sql: string, params?: unknown[]): Promise<QueryResult<T>>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
}

export interface DatabaseStats {
  connectionCount: number;
  activeQueries: number;
  queryCount: number;
  errorCount: number;
  avgResponseTime: number;
  lastBackup?: Date;
}

export interface MigrationConfig {
  version: number;
  name: string;
  up: string;
  down: string;
}

export interface BackupConfig {
  timestamp: Date;
  filename: string;
  size: number;
  status: 'success' | 'failed';
  error?: string;
}