import Parser from 'rss-parser';
import { ErrorHandler } from '@/utils/errors';
import type { NewsItem } from '../types';

export class RssFeedService {
  private static instance: RssFeedService;
  private parser: Parser;
  private errorHandler: ErrorHandler;
  private cache: Map<string, { data: NewsItem[]; timestamp: number }>;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  private constructor() {
    this.parser = new Parser({
      customFields: {
        item: [
          ['media:content', 'media'],
          ['dc:creator', 'creator'],
          ['category', 'categories', { keepArray: true }]
        ]
      }
    });
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
      const items = feed.items.map(item => this.transformFeedItem(item, feed.title || 'Unknown Source'));

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

  private transformFeedItem(item: Parser.Item, sourceName: string): NewsItem {
    const content = item.content || item.contentSnippet || '';
    const sentiment = this.analyzeSentiment(content);

    return {
      id: item.guid || crypto.randomUUID(),
      title: item.title || 'Untitled',
      content,
      summary: this.generateSummary(content),
      impact: sentiment > 0.2 ? 'positive' : sentiment < -0.2 ? 'negative' : 'neutral',
      timestamp: new Date(item.pubDate || Date.now()),
      source: sourceName,
      url: item.link || '',
      relatedSecurity: this.extractRelatedSecurity(item),
      metadata: {
        wordCount: content.split(/\s+/).length,
        readingTime: Math.ceil(content.split(/\s+/).length / 200),
        hasVideo: this.hasVideo(content),
        isSponsored: this.isSponsored(content)
      }
    };
  }

  private analyzeSentiment(content: string): number {
    // Simple sentiment analysis based on keyword matching
    const positiveWords = ['surge', 'gain', 'rise', 'growth', 'positive', 'success'];
    const negativeWords = ['drop', 'fall', 'decline', 'loss', 'negative', 'fail'];

    const words = content.toLowerCase().split(/\s+/);
    let sentiment = 0;

    words.forEach(word => {
      if (positiveWords.includes(word)) sentiment += 0.1;
      if (negativeWords.includes(word)) sentiment -= 0.1;
    });

    return Math.max(-1, Math.min(1, sentiment));
  }

  private generateSummary(content: string): string {
    const sentences = content.split(/[.!?]+/);
    return sentences[0].trim();
  }

  private extractRelatedSecurity(item: Parser.Item): NewsItem['relatedSecurity'] | undefined {
    const titleWords = item.title?.toLowerCase().split(' ') || [];
    
    // Check for comic references
    if (titleWords.includes('spider-man') || titleWords.includes('spiderman')) {
      return {
        type: 'comic',
        symbol: 'ASM300',
        name: 'Amazing Spider-Man #300'
      };
    }

    // Check for creator references
    if (titleWords.includes('mcfarlane')) {
      return {
        type: 'creator',
        symbol: 'TMFS',
        name: 'Todd McFarlane'
      };
    }

    // Check for publisher references
    if (titleWords.includes('marvel')) {
      return {
        type: 'publisher',
        symbol: 'MRVL',
        name: 'Marvel Entertainment'
      };
    }

    return undefined;
  }

  private hasVideo(content: string): boolean {
    return content.includes('<video') || 
           content.includes('youtube.com') || 
           content.includes('vimeo.com');
  }

  private isSponsored(content: string): boolean {
    return content.toLowerCase().includes('sponsored') || 
           content.toLowerCase().includes('advertisement') ||
           content.toLowerCase().includes('promoted');
  }

  public clearCache(): void {
    this.cache.clear();
  }

  public getCacheSize(): number {
    return this.cache.size;
  }

  public getCacheStats(): {
    size: number;
    oldestEntry: Date;
    newestEntry: Date;
  } {
    const entries = Array.from(this.cache.values());
    return {
      size: entries.length,
      oldestEntry: new Date(Math.min(...entries.map(e => e.timestamp))),
      newestEntry: new Date(Math.max(...entries.map(e => e.timestamp)))
    };
  }
}