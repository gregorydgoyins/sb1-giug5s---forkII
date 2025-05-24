import { ErrorHandler, logInfo } from '../../../utils/errors';
import { MarketDataService } from '../MarketDataService';
import type { VolatilityLevel } from './types';

export class MarketRefreshManager {
  private static instance: MarketRefreshManager;
  private errorHandler: ErrorHandler;
  private marketData: MarketDataService;
  private refreshInterval: NodeJS.Timeout | null = null;
  private currentInterval: number = 15 * 60 * 1000; // Default 15 minutes

  private readonly INTERVALS = {
    low: 15 * 60 * 1000,    // 15 minutes
    medium: 5 * 60 * 1000,  // 5 minutes
    high: 60 * 1000         // 1 minute
  };

  private readonly VOLATILITY_THRESHOLDS = {
    low: 0.15,    // 15%
    medium: 0.25, // 25%
    high: 0.35    // 35%
  };

  private constructor() {
    this.errorHandler = ErrorHandler.getInstance();
    this.marketData = MarketDataService.getInstance();
    this.startMonitoring();
  }

  public static getInstance(): MarketRefreshManager {
    if (!MarketRefreshManager.instance) {
      MarketRefreshManager.instance = new MarketRefreshManager();
    }
    return MarketRefreshManager.instance;
  }

  private startMonitoring(): void {
    this.updateRefreshInterval();
  }

  private updateRefreshInterval(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }

    this.refreshInterval = setInterval(() => {
      this.checkVolatility();
    }, this.currentInterval);
  }

  private async checkVolatility(): Promise<void> {
    try {
      const volatilityLevel = await this.calculateVolatilityLevel();
      const newInterval = this.INTERVALS[volatilityLevel.level];

      if (newInterval !== this.currentInterval) {
        this.currentInterval = newInterval;
        this.updateRefreshInterval();

        logInfo('Refresh rate updated', {
          previousInterval: this.currentInterval,
          newInterval,
          volatilityLevel: volatilityLevel.level,
          volatilityValue: volatilityLevel.value
        });
      }

      // Trigger the refresh
      window.location.reload();

    } catch (error) {
      this.errorHandler.handleError(error instanceof Error ? error : new Error(String(error)), {
        context: 'MarketRefreshManager',
        operation: 'checkVolatility'
      });
    }
  }

  private async calculateVolatilityLevel(): Promise<VolatilityLevel> {
    const marketData = await this.marketData.getMarketData('CMI'); // Comic Market Index
    if (!marketData) {
      return { level: 'low', value: 0, timestamp: Date.now() };
    }

    const volatility = this.calculateVolatility(marketData.data);

    let level: 'low' | 'medium' | 'high';
    if (volatility >= this.VOLATILITY_THRESHOLDS.high) {
      level = 'high';
    } else if (volatility >= this.VOLATILITY_THRESHOLDS.medium) {
      level = 'medium';
    } else {
      level = 'low';
    }

    return {
      level,
      value: volatility,
      timestamp: Date.now()
    };
  }

  private calculateVolatility(data: any[]): number {
    // Implement volatility calculation
    // This is a simplified example
    const prices = data.map(d => d.price);
    const returns = prices.slice(1).map((price, i) => 
      (price - prices[i]) / prices[i]
    );

    const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / returns.length;
    
    return Math.sqrt(variance);
  }

  public getCurrentInterval(): number {
    return this.currentInterval;
  }

  public forceRefresh(): void {
    window.location.reload();
  }

  public setManualInterval(interval: number): void {
    if (interval < 1000) {
      throw new Error('Interval cannot be less than 1 second');
    }

    this.currentInterval = interval;
    this.updateRefreshInterval();
  }
}