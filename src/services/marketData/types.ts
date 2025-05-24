export interface MarketDataSource {
  name: string;
  baseUrl: string;
  priority: number;
  endpoints: Record<string, string>;
  headers?: Record<string, string>;
  rateLimit: {
    requests: number;
    window: number;
  };
}

export interface ComicData {
  id: string;
  title: string;
  issueNumber?: string;
  series?: string;
  publisher: string;
  releaseDate?: Date;
  coverPrice?: number;
  marketPrice: number;
  grade?: string;
  census?: {
    total: number;
    byGrade: Record<string, number>;
  };
  creators?: Array<{
    name: string;
    role: string;
  }>;
  coverImage?: string;
  description?: string;
  lastUpdated: Date;
  source: string;
}

export interface MarketTrend {
  symbol: string;
  currentPrice: number;
  priceChange: number;
  percentageChange: number;
  volume: number;
  timestamp: Date;
}

export interface SearchParams {
  query?: string;
  publisher?: string;
  series?: string;
  issueNumber?: string;
  creator?: string;
  grade?: string;
  yearStart?: number;
  yearEnd?: number;
  limit?: number;
  offset?: number;
}