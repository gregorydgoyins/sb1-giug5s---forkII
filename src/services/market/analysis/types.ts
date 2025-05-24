export interface MarketAnalysis {
  timestamp: Date;
  sentiment: SentimentScore;
  volatility: number;
  momentum: number;
  trends: string[];
  recommendations: string[];
}

export interface SentimentScore {
  overall: number;
  components: {
    news: number;
    social: number;
    technical: number;
    fundamental: number;
  };
  timestamp: Date;
}

export interface AssetAnalysis {
  symbol: string;
  marketContext: MarketAnalysis;
  metrics: {
    price: number;
    volume: number;
    volatility: number;
    momentum: number;
  };
  correlations: Record<string, number>;
  recommendations: string[];
}

export interface MarketTrend {
  type: 'bullish' | 'bearish' | 'neutral';
  strength: number;
  duration: number;
  supportingFactors: string[];
}

export interface CorrelationMatrix {
  assets: string[];
  values: number[][];
  timestamp: Date;
}