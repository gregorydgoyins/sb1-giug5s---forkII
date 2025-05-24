import { z } from 'zod';

export const DatabaseConfig = z.object({
  client: z.enum(['postgres', 'mysql', 'sqlite']),
  connection: z.object({
    host: z.string().optional(),
    port: z.number().optional(),
    database: z.string(),
    user: z.string().optional(),
    password: z.string().optional(),
    filename: z.string().optional() // For SQLite
  }),
  pool: z.object({
    min: z.number(),
    max: z.number()
  }),
  migrations: z.object({
    directory: z.string(),
    tableName: z.string()
  }),
  backup: z.object({
    enabled: z.boolean(),
    schedule: z.string(), // cron format
    retention: z.number(), // days
    location: z.string()
  }),
  logging: z.object({
    enabled: z.boolean(),
    level: z.enum(['error', 'warn', 'info', 'debug'])
  })
});

export type DatabaseConfigType = z.infer<typeof DatabaseConfig>;

export const DEFAULT_DATABASE_CONFIG: DatabaseConfigType = {
  client: 'sqlite', // Using SQLite for development
  connection: {
    database: 'panel_profits',
    filename: './data/panel_profits.db'
  },
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    directory: './migrations',
    tableName: 'migrations'
  },
  backup: {
    enabled: true,
    schedule: '0 0 * * *', // Daily at midnight
    retention: 7, // Keep backups for 7 days
    location: './backups'
  },
  logging: {
    enabled: true,
    level: 'info'
  }
};