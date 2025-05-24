import { z } from 'zod';

export const RiskConfig = z.object({
  limits: z.object({
    maxPositionSize: z.number().min(0).max(1),
    maxConcentration: z.number().min(0).max(1),
    maxLeverage: z.number().min(1),
    maxDrawdown: z.number().min(0).max(1)
  }),
  monitoring: z.object({
    updateInterval: z.number().min(1000),
    alertThresholds: z.object({
      volatility: z.number().min(0),
      drawdown: z.number().min(0),
      leverage: z.number().min(0)
    })
  }),
  stress: z.object({
    scenarios: z.array(z.string()),
    confidenceLevel: z.number().min(0.9).max(1),
    lookbackPeriod: z.number().min(1)
  }),
  correlation: z.object({
    minSamples: z.number().min(30),
    significance: z.number().min(0).max(1)
  })
});

export type RiskConfigType = z.infer<typeof RiskConfig>;

export const DEFAULT_RISK_CONFIG: RiskConfigType = {
  limits: {
    maxPositionSize: 0.25,    // 25% max single position
    maxConcentration: 0.40,   // 40% max sector concentration
    maxLeverage: 2.0,         // 2x max leverage
    maxDrawdown: 0.20         // 20% max drawdown
  },
  monitoring: {
    updateInterval: 15000,    // 15 seconds
    alertThresholds: {
      volatility: 0.30,       // 30% volatility threshold
      drawdown: 0.15,         // 15% drawdown threshold
      leverage: 1.8           // Alert at 1.8x leverage
    }
  },
  stress: {
    scenarios: [
      'market_crash',
      'liquidity_crisis',
      'correlation_breakdown',
      'volatility_spike'
    ],
    confidenceLevel: 0.99,    // 99% confidence level
    lookbackPeriod: 252       // 1 year of trading days
  },
  correlation: {
    minSamples: 60,          // Minimum 60 data points
    significance: 0.95        // 95% significance level
  }
};