// Market Types
export type ComicAge = 'golden' | 'silver' | 'bronze' | 'copper' | 'modern';

export interface MarketState {
  marketIndex: number;
  volatility: number;
  distribution: Record<ComicAge, number>;
  userBalance: number;
  setMarketIndex: (index: number) => void;
  setVolatility: (volatility: number) => void;
  setDistribution: (distribution: Record<ComicAge, number>) => void;
  setUserBalance: (balance: number) => void;
}

export interface NewsItem {
  id: string;
  title: string;
  impact: 'positive' | 'negative' | 'neutral';
  timestamp: Date;
  relatedSecurity?: {
    type: 'comic' | 'creator' | 'publisher' | 'option';
    symbol: string;
    name: string;
  };
}

export interface IndexComponent {
  title: string;
  age: ComicAge;
  weight: number;
  significance: string;
  basePrice: number;
}

export interface MarketMetrics {
  volume: number;
  averageVolume: number;
  sentiment: number;
  momentum: number;
}

// Trading Types
export interface Option {
  strike: number;
  premium: number;
  volume: number;
  openInterest: number;
  impliedVolatility: number;
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
  expiry: string;
}

export interface OptionChain {
  underlying: string;
  currentPrice: number;
  expiryDates: string[];
  calls: Option[];
  puts: Option[];
}

export interface Fund {
  id: string;
  name: string;
  type: FundType;
  holdings: FundHolding[];
  nav: number;
  minInvestment: number;
  managementFee: number;
  metrics: FundMetrics;
}

export type FundType = 'bluechip' | 'superhero' | 'villain' | 'publisher' | 'custom';

export interface FundHolding {
  asset: string;
  quantity: number;
  weight: number;
  marketPrice: number;
  grade?: string;
  gradeMultiplier?: number;
}

export interface FundMetrics {
  volatility: number;
  liquidity: number;
  concentration: number;
  ageDistribution: Record<ComicAge, number>;
  gradeDistribution: Record<string, number>;
  sharpeRatio: number;
  historicalReturns: {
    oneYear: number;
    threeYear: number;
    fiveYear: number;
  };
}