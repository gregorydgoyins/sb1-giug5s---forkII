import { z } from 'zod';

export const MarketMonitorConfig = z.object({
  updateIntervals: z.object({
    low: z.number().min(1000),    // Low volatility interval
    medium: z.number().min(1000), // Medium volatility interval
    high: z.number().min(1000)    // High volatility interval
  }),
  volatilityThresholds: z.object({
    low: z.number().min(0),       // Low volatility threshold
    medium: z.number().min(0),    // Medium volatility threshold
    high: z.number().min(0)       // High volatility threshold
  }),
  sources: z.array(z.object({
    name: z.string(),
    priority: z.number().min(1),
    enabled: z.boolean()
  }))
});

export type MarketMonitorConfigType = z.infer<typeof MarketMonitorConfig>;

export const DEFAULT_MONITOR_CONFIG: MarketMonitorConfigType = {
  updateIntervals: {
    low: 60 * 1000,     // 1 minute (increased frequency)
    medium: 60 * 1000,  // 1 minute
    high: 60 * 1000     // 1 minute
  },
  volatilityThresholds: {
    low: 0.25,    // Increased from 0.15 to 0.25
    medium: 0.35, // Increased from 0.25 to 0.35
    high: 0.45    // Increased from 0.35 to 0.45
  },
  sources: [
    {
      name: 'financial-news',
      priority: 1,
      enabled: true
    },
    {
      name: 'market-data',
      priority: 2,
      enabled: true
    },
    {
      name: 'exchange-feeds',
      priority: 3,
      enabled: true
    }
  ]
};