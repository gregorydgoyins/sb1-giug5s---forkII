export interface NewsItem {
  id: string;
  title: string;
  content?: string;
  summary?: string;
  impact: 'positive' | 'negative' | 'neutral';
  timestamp: Date;
  source: string;
  url?: string;
  relatedSecurity?: {
    type: 'comic' | 'creator' | 'publisher' | 'option';
    symbol: string;
    name: string;
  };
}

export interface NewsSource {
  id: string;
  name: string;
  verified: boolean;
}

export interface RssFeed {
  id: string;
  name: string;
  url: string;
  priority: number;
}