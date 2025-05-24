export interface NewsItem {
  id: string;
  title: string;
  impact: 'positive' | 'negative' | 'neutral';
  timestamp: Date;
  summary: string;
  source: string;
  url?: string;
  relatedSecurity?: {
    type: 'comic' | 'creator' | 'publisher' | 'option';
    symbol: string;
    name: string;
  };
  content: string;
  category: 'market' | 'publisher' | 'creator' | 'events';
  author: string;
  tags: string[];
  marketInfluence?: {
    assetTypes: string[];
    volatilityImpact: number;
    tradingVolume: number;
  };
}

export interface NewsSource {
  id: string;
  name: string;
  url: string;
  priority: number;
  category: string[];
  reliability: number;
}

export interface NewsCache {
  data: NewsItem[];
  timestamp: number;
}