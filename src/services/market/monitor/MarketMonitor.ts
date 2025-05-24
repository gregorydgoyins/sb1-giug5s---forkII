import { MarketMonitorConfig, MarketMonitorConfigType, DEFAULT_MONITOR_CONFIG } from './config';
import { ErrorHandler } from '../../../utils/errors';
import { MarketDataService } from '../MarketDataService';
import type { 
  MarketUpdate, 
  MarketEvent, 
  MarketCondition,
  MonitoringStats,
  VolatilityLevel 
} from './types';

export class MarketMonitor {
  private static instance: MarketMonitor;
  private config: MarketMonitorConfigType;
  private errorHandler: ErrorHandler;
  private marketData: MarketDataService;
  private conditions: Map<string, MarketCondition>;
  private updateIntervals: Map<string, NodeJS.Timeout>;
  private stats: MonitoringStats;
  private volatilityCheckInterval: NodeJS.Timeout | null = null;

  private constructor(config?: Partial<MarketMonitorConfigType>) {
    this.config = MarketMonitorConfig.parse({ ...DEFAULT_MONITOR_CONFIG, ...config });
    this.errorHandler = ErrorHandler.getInstance();
    this.marketData = MarketDataService.getInstance();
    this.conditions = new Map();
    this.updateIntervals = new Map();
    this.stats = this.initializeStats();
    this.startMonitoring();
    this.startVolatilityCheck();
  }

  // ... rest of the existing code ...

  private startVolatilityCheck(): void {
    if (this.volatilityCheckInterval) {
      clearInterval(this.volatilityCheckInterval);
    }

    // Check volatility every minute
    this.volatilityCheckInterval = setInterval(() => {
      this.checkVolatilityLevels();
    }, 60000);
  }

  private async checkVolatilityLevels(): Promise<void> {
    for (const [symbol, condition] of this.conditions) {
      const volatility = condition.volatility.value;
      let newInterval: number;

      if (volatility >= this.config.volatilityThresholds.high) {
        newInterval = this.config.updateIntervals.high;
      } else if (volatility >= this.config.volatilityThresholds.medium) {
        newInterval = this.config.updateIntervals.medium;
      } else {
        newInterval = this.config.updateIntervals.low;
      }

      if (newInterval !== condition.updateInterval) {
        condition.updateInterval = newInterval;
        this.scheduleUpdates(symbol, condition);
      }
    }
  }

  // ... rest of the existing code ...
}