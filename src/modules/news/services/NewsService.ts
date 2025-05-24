import { ErrorHandler } from '@/utils/errors';
import { RateLimiter } from '@/utils/security/RateLimiter';
import { MockNewsService } from './MockNewsService';
import type { NewsItem } from '../types';

export class NewsService {
  private static instance: NewsService;
  private errorHandler: ErrorHandler;
  private rateLimiter: RateLimiter;
  private mockService: MockNewsService;
  private cache: Map<string, { data: NewsItem[]; timestamp: number }>;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private readonly UPDATE_INTERVAL = 60 * 1000; // 1 minute
  private updateTimeout: NodeJS.Timeout | null = null;

  private constructor() {
    this.errorHandler = ErrorHandler.getInstance();
    this.rateLimiter = RateLimiter.getInstance();
    this.mockService = MockNewsService.getInstance();
    this.cache = new Map();
    this.rateLimiter.createLimiter('news-api', 100, 60000); // 100 requests per minute
    this.startUpdateCycle();
  }

  public static getInstance(): NewsService {
    if (!NewsService.instance) {
      NewsService.instance = new NewsService();
    }
    return NewsService.instance;
  }

  private startUpdateCycle(): void {
    if (this.updateTimeout) {
      clearInterval(this.updateTimeout);
    }

    const updateNews = async () => {
      try {
        await this.fetchLatestNews();
      } catch (error) {
        this.errorHandler.handleError(error instanceof Error ? error : new Error(String(error)), {
          context: 'NewsService',
          operation: 'updateCycle'
        });
      }
    };

    // Initial fetch
    updateNews();

    // Set up interval
    this.updateTimeout = setInterval(updateNews, this.UPDATE_INTERVAL);
  }

  public async getLatestNews(): Promise<NewsItem[]> {
    return this.errorHandler.withErrorHandling(async () => {
      // Check cache first
      const cached = this.cache.get('latest');
      if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
        return cached.data;
      }

      return this.fetchLatestNews();
    }, {
      context: 'NewsService',
      operation: 'getLatestNews'
    });
  }

  private async fetchLatestNews(): Promise<NewsItem[]> {
    await this.rateLimiter.consume('news-api');

    // Use mock service in development
    if (process.env.NODE_ENV === 'development') {
      const news = await this.mockService.getLatestNews();
      this.cache.set('latest', {
        data: news,
        timestamp: Date.now()
      });
      return news;
    }

    const response = await fetch('/api/news');
    if (!response.ok) {
      throw new Error(`Failed to fetch news: ${response.statusText}`);
    }

    const news = await response.json();
    
    // Update cache
    this.cache.set('latest', {
      data: news,
      timestamp: Date.now()
    });

    return news;
  }

  public clearCache(): void {
    this.cache.clear();
  }

  public stopUpdateCycle(): void {
    if (this.updateTimeout) {
      clearInterval(this.updateTimeout);
      this.updateTimeout = null;
    }
  }
}