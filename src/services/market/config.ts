import { z } from 'zod';

export const MarketDataConfig = z.object({
  updateInterval: z.number().min(1000),
  cacheTimeout: z.number().min(5000),
  maxCacheSize: z.number().min(1000),
  dataSources: z.array(z.object({
    name: z.string(),
    priority: z.number(),
    enabled: z.boolean(),
    rateLimit: z.object({
      requests: z.number(),
      window: z.number()
    })
  })),
  indicators: z.object({
    enabled: z.boolean(),
    updateFrequency: z.number(),
    types: z.array(z.string())
  })
});

export type MarketDataConfigType = z.infer<typeof MarketDataConfig>;

export const DEFAULT_MARKET_CONFIG: MarketDataConfigType = {
  updateInterval: 15000, // 15 seconds
  cacheTimeout: 300000, // 5 minutes
  maxCacheSize: 10000,  // 10k items
  dataSources: [
    {
      name: 'primary',
      priority: 1,
      enabled: true,
      rateLimit: {
        requests: 100,
        window: 60000 // 1 minute
      }
    },
    {
      name: 'secondary',
      priority: 2,
      enabled: true,
      rateLimit: {
        requests: 60,
        window: 60000
      }
    }
  ],
  indicators: {
    enabled: true,
    updateFrequency: 60000, // 1 minute
    types: ['SMA', 'EMA', 'RSI', 'MACD']
  }
};