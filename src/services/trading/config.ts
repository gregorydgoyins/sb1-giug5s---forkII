import { z } from 'zod';

export const TradingConfig = z.object({
  orderTypes: z.array(z.enum(['market', 'limit', 'stop', 'stop_limit'])),
  timeInForce: z.array(z.enum(['day', 'gtc', 'ioc', 'fok'])),
  maxOrderSize: z.number().positive(),
  minOrderSize: z.number().positive(),
  maxLeverage: z.number().positive(),
  settlementDelay: z.number().positive(),
  fees: z.object({
    maker: z.number(),
    taker: z.number(),
    settlement: z.number()
  }),
  validation: z.object({
    priceThreshold: z.number(),
    volumeThreshold: z.number(),
    riskChecks: z.boolean()
  })
});

export type TradingConfigType = z.infer<typeof TradingConfig>;

export const DEFAULT_TRADING_CONFIG: TradingConfigType = {
  orderTypes: ['market', 'limit', 'stop', 'stop_limit'],
  timeInForce: ['day', 'gtc', 'ioc', 'fok'],
  maxOrderSize: 1000000, // 1M CC
  minOrderSize: 100,     // 100 CC
  maxLeverage: 5,        // 5x leverage
  settlementDelay: 2,    // T+2 settlement
  fees: {
    maker: 0.001,        // 0.1% maker fee
    taker: 0.002,        // 0.2% taker fee
    settlement: 0.0005   // 0.05% settlement fee
  },
  validation: {
    priceThreshold: 0.1, // 10% price deviation threshold
    volumeThreshold: 0.3, // 30% volume threshold
    riskChecks: true
  }
};