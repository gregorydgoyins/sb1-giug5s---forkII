import { ErrorHandler } from '../../../../utils/errors';
import type { MarketMetrics, SpreadMetrics } from '../types';

export class SpreadAnalyzer {
  private errorHandler: ErrorHandler;
  private spreadHistory: Map<string, number[]>;
  private readonly HISTORY_LENGTH = 100;

  constructor() {
    this.errorHandler = ErrorHandler.getInstance();
    this.spreadHistory = new Map();
  }

  public analyzeSpread(
    symbol: string,
    marketMetrics: MarketMetrics
  ): SpreadMetrics {
    return this.errorHandler.withErrorHandling(() => {
      const history = this.getSpreadHistory(symbol);
      const current = this.calculateCurrentSpread(marketMetrics);
      
      this.updateHistory(symbol, current);

      return {
        current,
        average: this.calculateAverage(history),
        minimum: Math.min(...history),
        maximum: Math.max(...history),
        volatility: this.calculateVolatility(history)
      };
    }, {
      context: 'SpreadAnalyzer',
      operation: 'analyzeSpread',
      symbol
    });
  }

  private calculateCurrentSpread(metrics: MarketMetrics): number {
    const baseSpread = 0.002; // 0.2% base spread
    const volatilityComponent = metrics.volatility * 0.5;
    const liquidityComponent = (1 - metrics.liquidity) * 0.3;
    const momentumComponent = Math.abs(metrics.momentum) * 0.2;

    return baseSpread + volatilityComponent + liquidityComponent + momentumComponent;
  }

  private getSpreadHistory(symbol: string): number[] {
    return this.spreadHistory.get(symbol) || [];
  }

  private updateHistory(symbol: string, spread: number): void {
    const history = this.getSpreadHistory(symbol);
    history.push(spread);
    
    if (history.length > this.HISTORY_LENGTH) {
      history.shift();
    }

    this.spreadHistory.set(symbol, history);
  }

  private calculateAverage(history: number[]): number {
    if (history.length === 0) return 0;
    return history.reduce((sum, spread) => sum + spread, 0) / history.length;
  }

  private calculateVolatility(history: number[]): number {
    if (history.length < 2) return 0;
    
    const avg = this.calculateAverage(history);
    const variance = history.reduce((sum, spread) => {
      const diff = spread - avg;
      return sum + (diff * diff);
    }, 0) / (history.length - 1);

    return Math.sqrt(variance);
  }
}