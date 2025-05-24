import type { MarketSentiment, AssetRating } from '../types';

export class MarketSentimentAnalyzer {
  private readonly RATING_THRESHOLDS = {
    STRONG_BUY: 0.8,
    BUY: 0.6,
    HOLD: 0.4,
    SELL: 0.2
  };

  public analyzeStockSentiment(metrics: {
    volatility: number;
    newsImpact: number;
    volume: number;
    technicalScore: number;
    analystConsensus: number;
  }): AssetRating {
    const score = (
      metrics.volatility * 0.2 +
      metrics.newsImpact * 0.2 +
      metrics.volume * 0.2 +
      metrics.technicalScore * 0.2 +
      metrics.analystConsensus * 0.2
    );

    return this.getRating(score);
  }

  public analyzeBondSentiment(metrics: {
    yield: number;
    rateSensitivity: number;
    creditRating: number;
    liquidity: number;
    economicIndicators: number;
  }): AssetRating {
    const score = (
      metrics.yield * 0.2 +
      metrics.rateSensitivity * 0.2 +
      metrics.creditRating * 0.2 +
      metrics.liquidity * 0.2 +
      metrics.economicIndicators * 0.2
    );

    return this.getRating(score);
  }

  public analyzeOptionSentiment(metrics: {
    impliedVolatility: number;
    greeksScore: number;
    timeDecay: number;
    strikePosition: number;
    underlyingTrend: number;
  }): AssetRating {
    const score = (
      metrics.impliedVolatility * 0.2 +
      metrics.greeksScore * 0.2 +
      metrics.timeDecay * 0.2 +
      metrics.strikePosition * 0.2 +
      metrics.underlyingTrend * 0.2
    );

    return this.getRating(score);
  }

  private getRating(score: number): AssetRating {
    if (score >= this.RATING_THRESHOLDS.STRONG_BUY) return 'Strong Buy';
    if (score >= this.RATING_THRESHOLDS.BUY) return 'Buy';
    if (score >= this.RATING_THRESHOLDS.HOLD) return 'Hold';
    if (score >= this.RATING_THRESHOLDS.SELL) return 'Sell';
    return 'Strong Sell';
  }
}