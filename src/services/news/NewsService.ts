import { NewsAggregator } from './NewsAggregator';
import { ErrorHandler } from '../../utils/errors';
import { DatabaseService } from '../database/DatabaseService';
import { RateLimiter } from '../../utils/security/RateLimiter';
import type { NewsItem } from './types';
import NewsAPI from 'newsapi';

export class NewsService {
  private static instance: NewsService;
  private newsApi: NewsAPI;
  private newsAggregator: NewsAggregator;
  private db: DatabaseService;
  private errorHandler: ErrorHandler;
  private rateLimiter: RateLimiter;
  private updateInterval: NodeJS.Timeout | null = null;

  private constructor() {
    this.newsApi = new NewsAPI(process.env.NEWS_API_KEY || '');
    this.newsAggregator = NewsAggregator.getInstance();
    this.db = DatabaseService.getInstance();
    this.errorHandler = ErrorHandler.getInstance();
    this.rateLimiter = RateLimiter.getInstance();
    this.startNewsUpdates();
  }

  public static getInstance(): NewsService {
    if (!NewsService.instance) {
      NewsService.instance = new NewsService();
    }
    return NewsService.instance;
  }

  private startNewsUpdates(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }

    // Update news every 5 minutes
    this.updateInterval = setInterval(() => {
      this.fetchAndStoreNews().catch(error => {
        this.errorHandler.handleError(error, {
          context: 'NewsService',
          operation: 'fetchAndStoreNews'
        });
      });
    }, 5 * 60 * 1000);

    // Initial fetch
    this.fetchAndStoreNews();
  }

  private async fetchAndStoreNews(): Promise<void> {
    await this.rateLimiter.consume('news-api');

    try {
      const [apiNews, aggregatorNews] = await Promise.all([
        this.fetchFromNewsAPI(),
        this.newsAggregator.getLatestNews()
      ]);

      const combinedNews = [...apiNews, ...aggregatorNews];
      await this.storeNews(combinedNews);

    } catch (error) {
      this.errorHandler.handleError(error instanceof Error ? error : new Error(String(error)), {
        context: 'NewsService',
        operation: 'fetchAndStoreNews'
      });
    }
  }

  private async fetchFromNewsAPI(): Promise<NewsItem[]> {
    const response = await this.newsApi.v2.everything({
      q: 'comics OR "comic books" OR Marvel OR DC',
      language: 'en',
      sortBy: 'publishedAt',
      pageSize: 100
    });

    return response.articles.map(article => ({
      id: crypto.randomUUID(),
      title: article.title,
      content: article.description || '',
      url: article.url,
      source: article.source.name,
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

  private determineCategory(article: any): string {
    const title = article.title.toLowerCase();
    if (title.includes('marvel') || title.includes('dc')) return 'publisher';
    if (title.includes('movie') || title.includes('tv')) return 'media';
    if (title.includes('market') || title.includes('sales')) return 'market';
    return 'general';
  }

  private extractTags(article: any): string[] {
    const tags = new Set<string>();
    const content = `${article.title} ${article.description}`.toLowerCase();

    const keywords = ['marvel', 'dc', 'comic', 'superhero', 'movie', 'tv', 'series'];
    keywords.forEach(keyword => {
      if (content.includes(keyword)) tags.add(keyword);
    });

    return Array.from(tags);
  }

  private async storeNews(news: NewsItem[]): Promise<void> {
    await this.db.transaction(async (trx) => {
      for (const item of news) {
        await trx.query(
          `INSERT INTO news_items (
            id, title, content, url, source, author, category,
            published_at, language, images, tags, metadata
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
          ON CONFLICT (id) DO NOTHING`,
          [
            item.id,
            item.title,
            item.content,
            item.url,
            item.source,
            item.author,
            item.category,
            item.publishDate,
            item.language,
            JSON.stringify(item.images),
            JSON.stringify(item.tags),
            JSON.stringify(item.metadata)
          ]
        );
      }
    });
  }

  public async getLatestNews(limit: number = 50): Promise<NewsItem[]> {
    const result = await this.db.query<NewsItem>(
      `SELECT * FROM news_items 
       ORDER BY published_at DESC 
       LIMIT $1`,
      [limit]
    );
    return result.rows;
  }

  public async getNewsByCategory(category: string, limit: number = 50): Promise<NewsItem[]> {
    const result = await this.db.query<NewsItem>(
      `SELECT * FROM news_items 
       WHERE category = $1 
       ORDER BY published_at DESC 
       LIMIT $2`,
      [category, limit]
    );
    return result.rows;
  }
}