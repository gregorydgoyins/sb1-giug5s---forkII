import Parser from 'rss-parser';
import { ErrorHandler } from '@/utils/errors';
import type { NewsItem } from './types';

export class RssFeedService {
  private static instance: RssFeedService;
  private parser: Parser;
  private errorHandler: ErrorHandler;
  private cache: Map<string, { data: NewsItem[]; timestamp: number }>;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  private constructor() {
    this.parser = new Parser();
    this.errorHandler = ErrorHandler.getInstance();
    this.cache = new Map();
  }

  public static getInstance(): RssFeedService {
    if (!RssFeedService.instance) {
      RssFeedService.instance = new RssFeedService();
    }
    return RssFeedService.instance;
  }

  public async fetchFeed(url: string): Promise<NewsItem[]> {
    return this.errorHandler.withErrorHandling(async () => {
      // Check cache
      const cached = this.cache.get(url);
      if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
        return cached.data;
      }

      const feed = await this.parser.parseURL(url);
      const items = feed.items.map(item => ({
        id: item.guid || crypto.randomUUID(),
        title: item.title || 'Untitled',
        content: item.content || item.contentSnippet || '',
        url: item.link || '',
        source: feed.title || 'Unknown Source',
        author: item.creator || 'Unknown Author',
        category: this.determineCategory(item),
        publishDate: new Date(item.pubDate || Date.now()),
        language: 'en',
        images: this.extractImages(item),
        tags: this.extractTags(item),
        metadata: {
          wordCount: item.content?.split(/\s+/).length || 0,
          readingTime: Math.ceil((item.content?.split(/\s+/).length || 0) / 200),
          hasVideo: this.hasVideo(item),
          isSponsored: this.isSponsored(item)
        }
      }));

      // Update cache
      this.cache.set(url, {
        data: items,
        timestamp: Date.now()
      });

      return items;
    }, {
      context: 'RssFeedService',
      operation: 'fetchFeed',
      url
    });
  }

  private determineCategory(item: Parser.Item): string {
    // Implement category determination logic
    return 'market';
  }

  private extractImages(item: Parser.Item): string[] {
    const images: string[] = [];
    // Extract images from content
    return images;
  }

  private extractTags(item: Parser.Item): string[] {
    return item.categories || [];
  }

  private hasVideo(item: Parser.Item): boolean {
    return item.content?.includes('<video') || false;
  }

  private isSponsored(item: Parser.Item): boolean {
    return item.content?.toLowerCase().includes('sponsored') || false;
  }
}