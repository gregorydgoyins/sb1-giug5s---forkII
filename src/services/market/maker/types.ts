export interface Quote {
  symbol: string;
  bid: number;
  ask: number;
  bidSize: number;
  askSize: number;
  timestamp: number;
  spread: number;
  midpoint: number;
}

export interface MarketMakerPosition {
  symbol: string;
  size: number;
  averagePrice: number;
  marketPrice: number;
  unrealizedPnL: number;
  realizedPnL: number;
  hedgeRatio: number;
  lastUpdated: number;
}

export interface InventoryMetrics {
  totalValue: number;
  netExposure: number;
  hedgeRatio: number;
  turnoverRate: number;
  profitLoss: number;
}

export interface SpreadMetrics {
  current: number;
  average: number;
  minimum: number;
  maximum: number;
  volatility: number;
}

export interface MarketMetrics {
  liquidity: number;
  volatility: number;
  momentum: number;
  imbalance: number;
}

export interface HedgePosition {
  instrument: string;
  size: number;
  price: number;
  delta: number;
  cost: number;
  timestamp: number;
}

export interface MarketMakerMetrics {
  inventory: InventoryMetrics;
  spreads: SpreadMetrics;
  market: MarketMetrics;
  hedging: {
    ratio: number;
    cost: number;
    effectiveness: number;
  };
}