import { ErrorHandler } from '../../../../utils/errors';
import type { MarketMakerPosition, InventoryMetrics } from '../types';

export class InventoryAnalyzer {
  private errorHandler: ErrorHandler;
  private readonly TARGET_INVENTORY = 1000000; // 1M CC
  private readonly MAX_DEVIATION = 0.3; // 30%

  constructor() {
    this.errorHandler = ErrorHandler.getInstance();
  }

  public analyzeInventory(positions: Map<string, MarketMakerPosition>): InventoryMetrics {
    return this.errorHandler.withErrorHandling(() => {
      let totalValue = 0;
      let netExposure = 0;
      let turnover = 0;
      let profitLoss = 0;

      for (const position of positions.values()) {
        const positionValue = Math.abs(position.size * position.marketPrice);
        totalValue += positionValue;
        netExposure += position.size * position.marketPrice;
        profitLoss += position.unrealizedPnL + position.realizedPnL;
      }

      return {
        totalValue,
        netExposure,
        hedgeRatio: this.calculateHedgeRatio(positions),
        turnoverRate: this.calculateTurnoverRate(positions),
        profitLoss
      };
    }, {
      context: 'InventoryAnalyzer',
      operation: 'analyzeInventory'
    });
  }

  private calculateHedgeRatio(positions: Map<string, MarketMakerPosition>): number {
    let totalExposure = 0;
    let totalHedge = 0;

    for (const position of positions.values()) {
      const exposure = Math.abs(position.size * position.marketPrice);
      totalExposure += exposure;
      totalHedge += exposure * position.hedgeRatio;
    }

    return totalExposure > 0 ? totalHedge / totalExposure : 0;
  }

  private calculateTurnoverRate(positions: Map<string, MarketMakerPosition>): number {
    let totalValue = 0;
    let totalTurnover = 0;

    for (const position of positions.values()) {
      const value = Math.abs(position.size * position.marketPrice);
      totalValue += value;
      // Calculate turnover based on position changes
      // This is a simplified calculation
      totalTurnover += value * 0.1; // Assume 10% daily turnover
    }

    return totalValue > 0 ? totalTurnover / totalValue : 0;
  }

  public calculateRebalanceSize(position: MarketMakerPosition): number {
    const targetSize = this.TARGET_INVENTORY / position.marketPrice;
    const currentSize = position.size;
    const deviation = Math.abs(currentSize / targetSize - 1);

    if (deviation <= this.MAX_DEVIATION) {
      return 0;
    }

    return targetSize - currentSize;
  }
}