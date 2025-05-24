import type { MarketMetrics, MarketEvent, ComicAge } from '../types';

export class VolatilityManager {
  private readonly BASE_VOLATILITY: Record<ComicAge, number> = {
    golden: 0.10,  // 10% base volatility
    silver: 0.15,  // 15% base volatility
    bronze: 0.20,  // 20% base volatility
    copper: 0.25,  // 25% base volatility
    modern: 0.30   // 30% base volatility
  };

  private readonly EVENT_IMPACT: Record<string, number> = {
    movie_release: 0.15,
    tv_show: 0.10,
    convention: 0.05,
    creator_change: 0.08,
    publisher_news: 0.12,
    market_crash: 0.25,
    scandal: 0.20
  };

  private readonly VOLUME_THRESHOLD = 100000; // Volume threshold for volatility impact
  private readonly SENTIMENT_IMPACT = 0.10;   // Maximum sentiment impact
  private readonly MAX_DAILY_VOLATILITY = 0.30; // 30% maximum daily volatility

  public calculateVolatility(
    age: ComicAge,
    metrics: MarketMetrics,
    events: MarketEvent[]
  ): number {
    const baseVol = this.BASE_VOLATILITY[age];
    const eventVol = this.calculateEventVolatility(events);
    const marketVol = this.calculateMarketVolatility(metrics);
    
    // Combine different volatility sources
    let totalVol = baseVol + eventVol + marketVol;

    // Apply age-based dampening for older comics
    const ageDampener = this.getAgeDampener(age);
    totalVol *= ageDampener;

    // Ensure volatility stays within reasonable bounds
    return Math.min(this.MAX_DAILY_VOLATILITY, Math.max(0.05, totalVol));
  }

  private calculateEventVolatility(events: MarketEvent[]): number {
    return events.reduce((total, event) => {
      const impact = this.EVENT_IMPACT[event.type] || 0;
      const recency = this.calculateRecencyFactor(event.timestamp);
      return total + (impact * recency);
    }, 0);
  }

  private calculateMarketVolatility(metrics: MarketMetrics): number {
    const volumeImpact = Math.min(0.15, 
      (metrics.volume - metrics.averageVolume) / metrics.averageVolume
    );
    
    const sentimentImpact = Math.min(
      this.SENTIMENT_IMPACT,
      Math.abs(metrics.sentiment) * 0.2
    );
    
    const momentumImpact = Math.min(0.10, Math.abs(metrics.momentum) * 0.15);

    return (volumeImpact * 0.5) + (sentimentImpact * 0.3) + (momentumImpact * 0.2);
  }

  private calculateRecencyFactor(timestamp: Date): number {
    const now = new Date();
    const daysDiff = (now.getTime() - timestamp.getTime()) / (1000 * 60 * 60 * 24);
    return Math.max(0, 1 - (daysDiff / 30)); // Impact decays over 30 days
  }

  private getAgeDampener(age: ComicAge): number {
    const dampeners = {
      golden: 0.7,  // 30% reduction in volatility
      silver: 0.8,  // 20% reduction
      bronze: 0.9,  // 10% reduction
      copper: 0.95, // 5% reduction
      modern: 1.0   // No reduction
    };
    return dampeners[age];
  }

  public injectVolatility(currentVol: number, events: MarketEvent[]): number {
    const eventImpact = this.calculateEventVolatility(events);
    const randomFactor = (Math.random() * 2 - 1) * 0.05; // ±5% random noise
    
    return Math.min(
      this.MAX_DAILY_VOLATILITY,
      currentVol * (1 + eventImpact + randomFactor)
    );
  }
}