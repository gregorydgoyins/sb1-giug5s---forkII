export interface ScrapedData {
  url: string;
  title: string;
  content: string;
  metadata: Record<string, unknown>;
  timestamp: string;
}

export interface ScraperConfig {
  timeout: number;
  retries: number;
  concurrency: number;
  userAgent: string;
}

export interface ScraperError {
  url: string;
  error: string;
  code: string;
  timestamp: string;
}

export interface ScrapeResult {
  success: boolean;
  data?: ScrapedData;
  error?: ScraperError;
}

export interface Selector {
  name: string;
  query: string;
  type: 'text' | 'html' | 'attr';
  attribute?: string;
  multiple?: boolean;
}

export interface ComicData {
  title: string;
  price: number;
  description: string;
  creators: string[];
  images: string[];
  lastUpdated: string;
  source: string;
}