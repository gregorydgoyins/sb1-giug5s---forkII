import { MarketDataConfig, MarketDataConfigType, DEFAULT_MARKET_CONFIG } from './config';
import { ErrorHandler } from '../../utils/errors';
import { RateLimiter } from '../../utils/security/RateLimiter';
import type { MarketDataPoint, MarketSnapshot, DataSourceStatus } from './types';

export class MarketDataService {
  private static instance: MarketDataService;
  private config: MarketDataConfigType;
  private errorHandler: ErrorHandler;
  private rateLimiter: RateLimiter;
  private cache: Map<string, MarketSnapshot>;
  private updateInterval: NodeJS.Timeout | null;
  private sourceStatus: Map<string, DataSourceStatus>;

  private constructor(config?: Partial<MarketDataConfigType>) {
    this.config = MarketDataConfig.parse({ ...DEFAULT_MARKET_CONFIG, ...config });
    this.errorHandler = ErrorHandler.getInstance();
    this.rateLimiter = RateLimiter.getInstance();
    this.cache = new Map();
    this.sourceStatus = new Map();
    this.updateInterval = null;
    this.initializeService();
  }

  public static getInstance(config?: Partial<MarketDataConfigType>): MarketDataService {
    if (!MarketDataService.instance) {
      MarketDataService.instance = new MarketDataService(config);
    }
    return MarketDataService.instance;
  }

  private async initializeService(): Promise<void> {
    // Initialize rate limiters for each data source
    this.config.dataSources.forEach(source => {
      this.rateLimiter.createLimiter(
        `market-data-${source.name}`,
        source.rateLimit.requests,
        source.rateLimit.window
      );
    });

    // Start update cycle
    this.startUpdateCycle();
  }

  private startUpdateCycle(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }

    this.updateInterval = setInterval(
      () => this.updateMarketData(),
      this.config.updateInterval
    );
  }

  private async updateMarketData(): Promise<void> {
    for (const source of this.config.dataSources) {
      if (!source.enabled) continue;

      try {
        await this.rateLimiter.consume(`market-data-${source.name}`);
        const startTime = Date.now();
        
        // Update market data from source
        const data = await this.fetchFromSource(source.name);
        
        // Update source status
        this.sourceStatus.set(source.name, {
          name: source.name,
          healthy: true,
          latency: Date.now() - startTime,
          errorRate: 0,
          lastUpdate: Date.now()
        });

        // Update cache
        this.updateCache(data);

      } catch (error) {
        this.handleSourceError(source.name, error);
      }
    }
  }

  private async fetchFromSource(source: string): Promise<MarketDataPoint[]> {
    // Implement source-specific data fetching
    return [];
  }

  private updateCache(data: MarketDataPoint[]): void {
    data.forEach(point => {
      const snapshot = this.cache.get(point.symbol) || {
        symbol: point.symbol,
        data: [],
        indicators: [],
        lastUpdate: 0
      };

      snapshot.data.push(point);
      snapshot.lastUpdate = Date.now();

      // Maintain cache size limit
      if (snapshot.data.length > this.config.maxCacheSize) {
        snapshot.data = snapshot.data.slice(-this.config.maxCacheSize);
      }

      this.cache.set(point.symbol, snapshot);
    });
  }

  private handleSourceError(source: string, error: unknown): void {
    const currentStatus = this.sourceStatus.get(source);
    const errorRate = currentStatus 
      ? (currentStatus.errorRate * 0.9) + 0.1 
      : 0.1;

    this.sourceStatus.set(source, {
      name: source,
      healthy: errorRate < 0.5,
      latency: -1,
      errorRate,
      lastUpdate: Date.now()
    });

    this.errorHandler.handleError(
      error instanceof Error ? error : new Error(String(error)),
      {
        context: 'MarketDataService',
        source,
        errorRate
      }
    );
  }

  public getMarketData(symbol: string): MarketSnapshot | null {
    return this.cache.get(symbol) || null;
  }

  public getSourceStatus(): DataSourceStatus[] {
    return Array.from(this.sourceStatus.values());
  }

  public updateConfig(config: Partial<MarketDataConfigType>): void {
    this.config = MarketDataConfig.parse({ ...this.config, ...config });
    this.startUpdateCycle();
  }
}