import { ErrorHandler, logInfo } from '../../utils/errors';
import { RateLimiter } from '../../utils/security/RateLimiter';
import { NEWS_SOURCES } from './sources';
import { MarketRefreshManager } from '../market/monitor/MarketRefreshManager';
import type { NewsItem, NewsCache, NewsCategory } from './types';

export class NewsAggregator {
  private static instance: NewsAggregator;
  private errorHandler: ErrorHandler;
  private rateLimiter: RateLimiter;
  private refreshManager: MarketRefreshManager;
  private cache: NewsCache;
  private updateIntervals: Map<string, NodeJS.Timeout>;

  private constructor() {
    this.errorHandler = ErrorHandler.getInstance();
    this.rateLimiter = RateLimiter.getInstance();
    this.refreshManager = MarketRefreshManager.getInstance();
    this.cache = {
      items: new Map(),
      lastUpdate: new Date()
    };
    this.updateIntervals = new Map();

    this.initializeRateLimiters();
    this.startUpdateCycles();
  }

  public static getInstance(): NewsAggregator {
    if (!NewsAggregator.instance) {
      NewsAggregator.instance = new NewsAggregator();
    }
    return NewsAggregator.instance;
  }

  private initializeRateLimiters(): void {
    NEWS_SOURCES.forEach(source => {
      this.rateLimiter.createLimiter(source.id, 4, 60); // 4 requests per minute
    });
  }

  private startUpdateCycles(): void {
    NEWS_SOURCES.forEach(source => {
      // Initial update
      this.updateSource(source);

      // Set up regular updates based on market volatility
      const interval = setInterval(
        () => this.updateSource(source),
        this.refreshManager.getCurrentInterval()
      );
      this.updateIntervals.set(source.id, interval);
    });
  }

  private async updateSource(source: { id: string; name: string; mockData: any }): Promise<void> {
    await this.errorHandler.withErrorHandling(async () => {
      // Check rate limit
      await this.rateLimiter.consume(source.id);

      // Use mock data in development
      const data = source.mockData;
      const newsItems = this.transformNewsData(data, source);

      // Update cache
      newsItems.forEach(item => {
        this.cache.items.set(item.id, item);
      });

      this.cache.lastUpdate = new Date();

      // Clean old items
      this.cleanCache();

      logInfo(`Updated news from ${source.name}`, {
        itemCount: newsItems.length,
        timestamp: new Date()
      });
    }, {
      context: 'NewsAggregator',
      operation: 'updateSource',
      source: source.name
    });
  }

  private transformNewsData(data: any, source: { name: string }): NewsItem[] {
    return data.articles.map((article: any) => ({
      id: crypto.randomUUID(),
      title: article.title,
      description: article.description,
      content: article.content,
      url: article.url || '#',
      source: source.name,
      author: article.author,
      category: this.determineCategory(article),
      publishDate: new Date(article.publishedAt),
      language: 'en',
      images: article.urlToImage ? [article.urlToImage] : [],
      tags: this.extractTags(article),
      metadata: {
        wordCount: article.content?.split(/\s+/).length || 0,
        readingTime: Math.ceil((article.content?.split(/\s+/).length || 0) / 200),
        hasVideo: false,
        isSponsored: false
      }
    }));
  }

  private determineCategory(article: any): NewsCategory {
    return 'market';
  }

  private extractTags(article: any): string[] {
    return [];
  }

  private cleanCache(): void {
    const MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days
    const now = Date.now();

    for (const [id, item] of this.cache.items) {
      if (now - item.publishDate.getTime() > MAX_AGE) {
        this.cache.items.delete(id);
      }
    }
  }

  public getLatestNews(category?: NewsCategory, limit: number = 50): NewsItem[] {
    const items = Array.from(this.cache.items.values());

    return items
      .filter(item => !category || item.category === category)
      .sort((a, b) => b.publishDate.getTime() - a.publishDate.getTime())
      .slice(0, limit);
  }

  public searchNews(query: string, category?: NewsCategory, limit: number = 50): NewsItem[] {
    const searchTerms = query.toLowerCase().split(/\s+/);
    const items = Array.from(this.cache.items.values());

    return items
      .filter(item => {
        if (category && item.category !== category) return false;
        const content = `${item.title} ${item.description}`.toLowerCase();
        return searchTerms.every(term => content.includes(term));
      })
      .sort((a, b) => b.publishDate.getTime() - a.publishDate.getTime())
      .slice(0, limit);
  }
}