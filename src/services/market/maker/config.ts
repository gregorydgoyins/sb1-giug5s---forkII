import { z } from 'zod';

export const MarketMakerConfig = z.object({
  spreads: z.object({
    min: z.number().min(0.001),
    max: z.number().max(0.1),
    default: z.number()
  }),
  inventory: z.object({
    targetLevel: z.number().min(0),
    maxDeviation: z.number().min(0),
    rebalanceThreshold: z.number().min(0)
  }),
  riskLimits: z.object({
    maxPosition: z.number().min(0),
    maxExposure: z.number().min(0),
    maxDrawdown: z.number().min(0)
  }),
  quoting: z.object({
    minSize: z.number().min(0),
    maxSize: z.number().min(0),
    sizeIncrement: z.number().min(0),
    priceIncrement: z.number().min(0)
  }),
  hedging: z.object({
    enabled: z.boolean(),
    threshold: z.number().min(0),
    instruments: z.array(z.string())
  })
});

export type MarketMakerConfigType = z.infer<typeof MarketMakerConfig>;

export const DEFAULT_MARKET_MAKER_CONFIG: MarketMakerConfigType = {
  spreads: {
    min: 0.002,   // Increased from 0.001 to 0.002
    max: 0.08,    // Increased from 0.05 to 0.08
    default: 0.03 // Increased from 0.02 to 0.03
  },
  inventory: {
    targetLevel: 1000000,  // 1M CC target inventory
    maxDeviation: 0.4,     // Increased from 0.3 to 0.4
    rebalanceThreshold: 0.25 // Increased from 0.2 to 0.25
  },
  riskLimits: {
    maxPosition: 2500000,  // Increased from 2M to 2.5M CC
    maxExposure: 6000000,  // Increased from 5M to 6M CC
    maxDrawdown: 0.20      // Increased from 0.15 to 0.20
  },
  quoting: {
    minSize: 100,
    maxSize: 150000,      // Increased from 100k to 150k
    sizeIncrement: 100,
    priceIncrement: 0.01
  },
  hedging: {
    enabled: true,
    threshold: 0.4,       // Decreased from 0.5 to 0.4 for more frequent hedging
    instruments: ['futures', 'options']
  }
};