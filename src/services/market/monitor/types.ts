export interface MarketUpdate {
  symbol: string;
  timestamp: number;
  price: number;
  volume: number;
  volatility: number;
  source: string;
  significance: number;
}

export interface MarketEvent {
  id: string;
  type: 'price' | 'news' | 'trading' | 'regulatory';
  timestamp: number;
  symbol: string;
  description: string;
  impact: number;
  source: string;
  verified: boolean;
}

export interface VolatilityLevel {
  level: 'low' | 'medium' | 'high';
  value: number;
  timestamp: number;
}

export interface MarketCondition {
  symbol: string;
  volatility: VolatilityLevel;
  lastUpdate: number;
  updateInterval: number;
  significantEvents: MarketEvent[];
}

export interface MonitoringStats {
  updatesProcessed: number;
  eventsDetected: number;
  averageLatency: number;
  lastUpdate: number;
  activeSymbols: string[];
}