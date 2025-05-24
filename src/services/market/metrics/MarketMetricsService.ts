```typescript
import { ErrorHandler } from '../../../utils/errors';
import { DatabaseService } from '../../database/DatabaseService';
import { RateLimiter } from '../../../utils/security/RateLimiter';
import { NewsService } from '../../news/NewsService';
import type { MarketMetrics, AssetMetrics, MarketSnapshot } from '../types';

export class MarketMetricsService {
  private static instance: MarketMetricsService;
  private errorHandler: ErrorHandler;
  private db: DatabaseService;
  private rateLimiter: RateLimiter;
  private newsService: NewsService;
  private updateInterval: NodeJS.Timeout | null = null;

  private readonly NEWS_WEIGHTS = {
    publisher: 0.35,
    creator: 0.25,
    market: 0.25,
    general: 0.15
  };

  private constructor() {
    this.errorHandler = ErrorHandler.getInstance();
    this.db = DatabaseService.getInstance();
    this.rateLimiter = RateLimiter.getInstance();
    this.newsService = NewsService.getInstance();
    this.startMetricsTracking();
  }

  public static getInstance(): MarketMetricsService {
    if (!MarketMetricsService.instance) {
      MarketMetricsService.instance = new MarketMetricsService();
    }
    return MarketMetricsService.instance;
  }

  private startMetricsTracking(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }

    // Update metrics every minute
    this.updateInterval = setInterval(() => {
      this.updateMarketMetrics();
    }, 60000);

    // Initial update
    this.updateMarketMetrics();
  }

  private async updateMarketMetrics(): Promise<void> {
    try {
      await this.rateLimiter.consume('market-metrics');

      const [snapshot, news] = await Promise.all([
        this.calculateMarketSnapshot(),
        this.newsService.getLatestNews()
      ]);

      const metrics = this.calculateMetrics(snapshot, news);
      await this.storeMetrics(metrics);

    } catch (error) {
      this.errorHandler.handleError(error instanceof Error ? error : new Error(String(error)), {
        context: 'MarketMetricsService',
        operation: 'updateMarketMetrics'
      });
    }
  }

  private async calculateMarketSnapshot(): Promise<MarketSnapshot> {
    const result = await this.db.query(
      `SELECT 
        SUM(price * volume) as total_value,
        SUM(volume) as total_volume,
        json_agg(
          json_build_object('symbol', symbol, 'change', 
            (price - lag(price) over (partition by symbol order by timestamp)) / 
            lag(price) over (partition by symbol order by timestamp) * 100
          ) order by change desc limit 5
        ) as gainers,
        json_agg(
          json_build_object('symbol', symbol, 'change',
            (price - lag(price) over (partition by symbol order by timestamp)) / 
            lag(price) over (partition by symbol order by timestamp) * 100
          ) order by change asc limit 5
        ) as losers
      FROM asset_prices
      WHERE timestamp >= NOW() - INTERVAL '24 hours'`
    );

    return {
      timestamp: new Date(),
      totalValue: result.rows[0].total_value || 0,
      totalVolume: result.rows[0].total_volume || 0,
      topGainers: result.rows[0].gainers || [],
      topLosers: result.rows[0].losers || []
    };
  }

  private calculateMetrics(snapshot: MarketSnapshot, news: any[]): MarketMetrics {
    return {
      timestamp: new Date(),
      snapshot,
      sentiment: this.calculateMarketSentiment(news),
      volatility: this.calculateVolatility(),
      momentum: this.calculateMomentum(),
      trends: this.identifyTrends()
    };
  }

  private calculateMarketSentiment(news: any[]): number {
    let weightedSentiment = 0;
    let totalWeight = 0;

    news.forEach(item => {
      const weight = this.NEWS_WEIGHTS[item.category as keyof typeof this.NEWS_WEIGHTS] || 0;
      const sentiment = item.sentiment || 0;
      weightedSentiment += weight * sentiment;
      totalWeight += weight;
    });

    return totalWeight > 0 ? weightedSentiment / totalWeight : 0;
  }

  private calculateVolatility(): number {
    // Implement volatility calculation
    return 0.15; // 15% volatility
  }

  private calculateMomentum(): number {
    // Implement momentum calculation
    return 0.5; // Neutral momentum
  }

  private identifyTrends(): string[] {
    // Implement trend identification
    return ['Increasing interest in Silver Age comics'];
  }

  private async storeMetrics(metrics: MarketMetrics): Promise<void> {
    await this.db.query(
      `INSERT INTO market_metrics (
        timestamp,
        snapshot,
        sentiment,
        volatility,
        momentum,
        trends
      ) VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        metrics.timestamp,
        JSON.stringify(metrics.snapshot),
        metrics.sentiment,
        metrics.volatility,
        metrics.momentum,
        JSON.stringify(metrics.trends)
      ]
    );
  }

  public async getLatestMetrics(): Promise<MarketMetrics> {
    const result = await this.db.query(
      `SELECT * FROM market_metrics 
       ORDER BY timestamp DESC 
       LIMIT 1`
    );
    return result.rows[0];
  }

  public async getHistoricalMetrics(
    startDate: Date,
    endDate: Date
  ): Promise<MarketMetrics[]> {
    const result = await this.db.query(
      `SELECT * FROM market_metrics 
       WHERE timestamp BETWEEN $1 AND $2 
       ORDER BY timestamp ASC`,
      [startDate, endDate]
    );
    return result.rows;
  }
}
```