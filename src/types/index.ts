export type ComicAge = 'golden' | 'silver' | 'bronze' | 'copper' | 'modern';

export type FundType = 'bluechip' | 'superhero' | 'villain' | 'publisher' | 'custom';

export interface MutualFund {
  id: string;
  name: string;
  symbol: string;
  type: FundType;
  nav: number;
  holdings: Array<{
    asset: string;
    weight: number;
    marketPrice: number;
    quantity: number;
  }>;
  metrics: {
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
  };
  minInvestment: number;
  managementFee: number;
}