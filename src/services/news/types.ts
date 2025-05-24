export interface NewsSource {
  id: string;
  name: string;
  url: string;
  language: string;
  category: NewsCategory;
  updateInterval: number;
  reliability: number;
  parser: 'rss' | 'atom' | 'json';
}

export type NewsCategory = 'comics' | 'movies' | 'tv' | 'games' | 'industry' | 'general';

export interface NewsItem {
  id: string;
  title: string;
  description: string;
  content?: string;
  url: string;
  source: string;
  author?: string;
  category: NewsCategory;
  publishDate: Date;
  language: string;
  images: string[];
  tags: string[];
  metadata: {
    wordCount?: number;
    readingTime?: number;
    hasVideo?: boolean;
    isSponsored?: boolean;
  };
}

export interface FeedParserResult {
  items: NewsItem[];
  lastUpdate: Date;
  error?: string;
}

export interface NewsCache {
  items: Map<string, NewsItem>;
  lastUpdate: Date;
}