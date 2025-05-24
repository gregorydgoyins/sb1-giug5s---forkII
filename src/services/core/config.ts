import { z } from 'zod';

export const ServiceConfig = z.object({
  environment: z.enum(['development', 'staging', 'production']),
  version: z.string(),
  logLevel: z.enum(['debug', 'info', 'warn', 'error']),
  maintenance: z.object({
    enabled: z.boolean(),
    window: z.object({
      start: z.string(),
      end: z.string()
    }).optional()
  }),
  backup: z.object({
    enabled: z.boolean(),
    location: z.string(),
    retention: z.number()
  }),
  security: z.object({
    rateLimiting: z.boolean(),
    maxRequestsPerMinute: z.number(),
    requireAuthentication: z.boolean()
  })
});

export type ServiceConfigType = z.infer<typeof ServiceConfig>;

export const DEFAULT_CONFIG: ServiceConfigType = {
  environment: 'development',
  version: '1.0.0',
  logLevel: 'info',
  maintenance: {
    enabled: false
  },
  backup: {
    enabled: true,
    location: '/backups',
    retention: 7 // days
  },
  security: {
    rateLimiting: true,
    maxRequestsPerMinute: 100,
    requireAuthentication: true
  }
};