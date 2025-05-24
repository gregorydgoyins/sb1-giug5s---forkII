export interface Portfolio {
  id: string;
  userId: string;
  balance: number;
  positions: Position[];
  transactions: Transaction[];
  lastUpdated: Date;
}

export interface Position {
  id: string;
  symbol: string;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
  value: number;
  unrealizedPnL: number;
  lastUpdated: Date;
}

export interface Transaction {
  id: string;
  portfolioId: string;
  symbol: string;
  type: 'market' | 'limit';
  side: 'buy' | 'sell';
  quantity: number;
  price: number;
  total: number;
  fees: number;
  timestamp: Date;
}

export interface PortfolioSummary {
  portfolioId: string;
  userId: string;
  balance: number;
  totalValue: number;
  totalUnrealizedPnL: number;
  totalRealizedPnL: number;
  assetAllocation: Record<string, number>;
  positionCount: number;
  lastUpdated: Date;
}