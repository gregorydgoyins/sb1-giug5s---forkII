import { ErrorHandler } from '../../../utils/errors';
import type { Quote, MarketMetrics, MarketMakerPosition } from './types';

export class QuoteGenerator {
  private errorHandler: ErrorHandler;
  private readonly TICK_SIZE = 0.01;
  private readonly MIN_SPREAD = 0.001;
  private readonly MAX_SPREAD = 0.05;

  constructor() {
    this.errorHandler = ErrorHandler.getInstance();
  }

  public generateQuote(
    symbol: string,
    position: MarketMakerPosition,
    marketMetrics: MarketMetrics,
    midPrice: number
  ): Quote {
    return this.errorHandler.withErrorHandling(() => {
      const spread = this.calculateSpread(marketMetrics);
      const skew = this.calculateSkew(position);
      const sizes = this.calculateSizes(position, marketMetrics);

      const halfSpread = spread / 2;
      const bid = this.roundPrice(midPrice * (1 - halfSpread + skew));
      const ask = this.roundPrice(midPrice * (1 + halfSpread + skew));

      return {
        symbol,
        bid,
        ask,
        bidSize: sizes.bid,
        askSize: sizes.ask,
        timestamp: Date.now(),
        spread,
        midpoint: midPrice
      };
    }, {
      context: 'QuoteGenerator',
      operation: 'generateQuote',
      symbol
    });
  }

  private calculateSpread(metrics: MarketMetrics): number {
    const baseSpread = this.MIN_SPREAD;
    const volatilityComponent = metrics.volatility * 0.5;
    const liquidityComponent = (1 - metrics.liquidity) * 0.3;
    const momentumComponent = Math.abs(metrics.momentum) * 0.2;

    const spread = baseSpread + volatilityComponent + liquidityComponent + momentumComponent;
    return Math.min(Math.max(spread, this.MIN_SPREAD), this.MAX_SPREAD);
  }

  private calculateSkew(position: MarketMakerPosition): number {
    const inventoryRatio = position.size / position.marketPrice;
    return -0.01 * Math.tanh(inventoryRatio); // Skew quotes based on inventory
  }

  private calculateSizes(
    position: MarketMakerPosition,
    metrics: MarketMetrics
  ): { bid: number; ask: number } {
    const baseSize = 1000;
    const inventoryFactor = Math.exp(-Math.abs(position.size) / 10000);
    const liquidityFactor = metrics.liquidity;

    return {
      bid: Math.round(baseSize * inventoryFactor * liquidityFactor),
      ask: Math.round(baseSize * inventoryFactor * liquidityFactor)
    };
  }

  private roundPrice(price: number): number {
    return Math.round(price / this.TICK_SIZE) * this.TICK_SIZE;
  }
}