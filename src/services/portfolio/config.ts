import { z } from 'zod';

export const PortfolioConfig = z.object({
  rebalancing: z.object({
    thresholds: z.object({
      minor: z.number().min(0).max(1),
      major: z.number().min(0).max(1)
    }),
    schedule: z.object({
      enabled: z.boolean(),
      interval: z.number().min(1)
    })
  }),
  riskLimits: z.object({
    maxPositionSize: z.number().min(0).max(1),
    maxSectorExposure: z.number().min(0).max(1),
    maxLeverage: z.number().min(1)
  }),
  performance: z.object({
    benchmarks: z.array(z.string()),
    metrics: z.array(z.enum(['sharpe', 'sortino', 'alpha', 'beta', 'drawdown'])),
    trackingPeriod: z.number().min(1)
  }),
  taxEfficiency: z.object({
    harvestingEnabled: z.boolean(),
    minHarvestAmount: z.number().min(0),
    washSaleWindow: z.number().min(0)
  })
});

export type PortfolioConfigType = z.infer<typeof PortfolioConfig>;

export const DEFAULT_PORTFOLIO_CONFIG: PortfolioConfigType = {
  rebalancing: {
    thresholds: {
      minor: 0.05,  // 5% deviation triggers minor rebalance
      major: 0.10   // 10% deviation triggers major rebalance
    },
    schedule: {
      enabled: true,
      interval: 7   // Days between scheduled rebalances
    }
  },
  riskLimits: {
    maxPositionSize: 0.25,    // 25% max single position
    maxSectorExposure: 0.40,  // 40% max sector exposure
    maxLeverage: 2.0          // 2x max leverage
  },
  performance: {
    benchmarks: ['CMI'],      // Comic Market Index
    metrics: ['sharpe', 'sortino', 'alpha', 'beta', 'drawdown'],
    trackingPeriod: 365       // 1 year performance tracking
  },
  taxEfficiency: {
    harvestingEnabled: true,
    minHarvestAmount: 1000,   // Minimum loss to harvest
    washSaleWindow: 30        // 30 day wash sale window
  }
};