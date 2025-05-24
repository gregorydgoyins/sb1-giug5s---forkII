import { DatabaseService } from '../database/DatabaseService';
import { ErrorHandler } from '../../utils/errors';
import { RateLimiter } from '../../utils/security/RateLimiter';
import { load } from 'cheerio';
import axios from 'axios';
import type { NewsItem, NewsSource } from './types';

export class NewsScraper {
  private static instance: NewsScraper;
  private db: DatabaseService;
  private errorHandler: ErrorHandler;
  private rateLimiter: RateLimiter;
  private readonly UPDATE_INTERVAL = 5 * 60 * 1000; // 5 minutes
  private updateInterval: NodeJS.Timeout | null = null;

  private constructor() {
    this.db = DatabaseService.getInstance();
    this.errorHandler = ErrorHandler.getInstance();
    this.rateLimiter = RateLimiter.getInstance();
    this.startScraping();
  }

  public static getInstance(): NewsScraper {
    if (!NewsScraper.instance) {
      NewsScraper.instance = new NewsScraper();
    }
    return NewsScraper.instance;
  }

  private startScraping(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }

    this.updateInterval = setInterval(() => {
      this.scrapeAllSources();
    }, this.UPDATE_INTERVAL);

    // Initial scrape
    this.scrapeAllSources();
  }

  private async scrapeAllSources(): Promise<void> {
    const sources = await this.getActiveSources();
    
    for (const source of sources) {
      try {
        await this.rateLimiter.consume(`news-scraper-${source.id}`);
        const newsItems = await this.scrapeSource(source);
        await this.saveNewsItems(newsItems);
        await this.updateSourceStatus(source.id, 'success');
      } catch (error) {
        await this.updateSourceStatus(source.id, 'error');
        this.errorHandler.handleError(error instanceof Error ? error : new Error(String(error)), {
          context: 'NewsScraper',
          source: source.name
        });
      }
    }
  }

  private async getActiveSources(): Promise<NewsSource[]> {
    const result = await this.db.query<NewsSource>(
      'SELECT * FROM news_sources WHERE status = $1',
      ['active']
    );
    return result.rows;
  }

  private async scrapeSource(source: NewsSource): Promise<NewsItem[]> {
    const response = await axios.get(source.url, {
      headers: {
        'User-Agent': 'Panel Profits News Aggregator/1.0'
      }
    });

    const $ = load(response.data);
    const newsItems: NewsItem[] = [];

    // Customize selectors based on source structure
    $('.article, .news-item, .story').each((_, element) => {
      const $element = $(element);
      
      const newsItem: NewsItem = {
        id: crypto.randomUUID(),
        sourceId: source.id,
        title: $element.find('.title, h2, h3').first().text().trim(),
        content: $element.find('.content, .body, .text').first().text().trim(),
        url: $element.find('a').first().attr('href') || '',
        publishedAt: new Date(),
        impact: this.analyzeImpact($element.text()),
        sentiment: this.analyzeSentiment($element.text()),
        category: this.determineCategory($element.text()),
        relatedSymbols: this.extractSymbols($element.text()),
        tags: this.extractTags($element.text())
      };

      if (newsItem.title && newsItem.content) {
        newsItems.push(newsItem);
      }
    });

    return newsItems;
  }

  private async saveNewsItems(items: NewsItem[]): Promise<void> {
    if (!items.length) return;

    await this.db.transaction(async (trx) => {
      for (const item of items) {
        // Check if news item already exists
        const existing = await trx.query(
          'SELECT id FROM news_items WHERE title = $1 AND source_id = $2',
          [item.title, item.sourceId]
        );

        if (existing.rowCount === 0) {
          await trx.query(
            `INSERT INTO news_items (
              id, source_id, title, content, url, published_at, impact,
              sentiment, category, related_symbols, tags, metadata
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
            [
              item.id,
              item.sourceId,
              item.title,
              item.content,
              item.url,
              item.publishedAt,
              item.impact,
              item.sentiment,
              item.category,
              item.relatedSymbols,
              item.tags,
              JSON.stringify(item.metadata || {})
            ]
          );

          // Create market impact records
          if (item.relatedSymbols.length > 0) {
            await this.createMarketImpacts(trx, item);
          }
        }
      }
    });
  }

  private async createMarketImpacts(trx: any, item: NewsItem): Promise<void> {
    for (const symbol of item.relatedSymbols) {
      await trx.query(
        `INSERT INTO market_impacts (
          id, news_id, symbol, impact_score, price_change, volume_change
        ) VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          crypto.randomUUID(),
          item.id,
          symbol,
          item.sentiment,
          0, // Initial price change
          0  // Initial volume change
        ]
      );
    }
  }

  private async updateSourceStatus(
    sourceId: string,
    status: 'success' | 'error'
  ): Promise<void> {
    await this.db.query(
      'UPDATE news_sources SET last_fetch = CURRENT_TIMESTAMP, status = $1 WHERE id = $2',
      [status, sourceId]
    );
  }

  private analyzeImpact(text: string): string {
    // Implement impact analysis logic
    return 'neutral';
  }

  private analyzeSentiment(text: string): number {
    // Implement sentiment analysis logic
    return 0;
  }

  private determineCategory(text: string): string {
    // Implement category determination logic
    return 'general';
  }

  private extractSymbols(text: string): string[] {
    // Implement symbol extraction logic
    return [];
  }

  private extractTags(text: string): string[] {
    // Implement tag extraction logic
    return [];
  }

  public async getLatestNews(
    limit: number = 50,
    category?: string
  ): Promise<NewsItem[]> {
    const query = category
      ? `SELECT * FROM news_items 
         WHERE category = $1 
         ORDER BY published_at DESC 
         LIMIT $2`
      : `SELECT * FROM news_items 
         ORDER BY published_at DESC 
         LIMIT $1`;

    const params = category ? [category, limit] : [limit];
    const result = await this.db.query<NewsItem>(query, params);
    return result.rows;
  }

  public async getNewsWithImpact(
    symbol: string,
    days: number = 7
  ): Promise<Array<NewsItem & { impact_score: number }>> {
    const result = await this.db.query(
      `SELECT n.*, mi.impact_score 
       FROM news_items n
       JOIN market_impacts mi ON n.id = mi.news_id
       WHERE mi.symbol = $1 
       AND n.published_at >= CURRENT_TIMESTAMP - INTERVAL '${days} days'
       ORDER BY n.published_at DESC`,
      [symbol]
    );
    return result.rows;
  }
}