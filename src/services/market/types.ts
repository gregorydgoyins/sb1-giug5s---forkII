export interface MarketAsset {
  id: string;
  symbol: string;
  name: string;
  type: 'character' | 'creator' | 'team';
  metadata: Record<string, any>;
}

export interface AssetPrice {
  value: number;
  volume: number;
  change: number;
}

export interface MarketMetrics {
  popularity: number;
  volatility: number;
  momentum: number;
  sentiment: number;
}

export interface MarketSnapshot {
  timestamp: Date;
  totalValue: number;
  totalVolume: number;
  topGainers: Array<{
    symbol: string;
    change: number;
  }>;
  topLosers: Array<{
    symbol: string;
    change: number;
  }>;
}