import { ErrorHandler } from '../../../utils/errors';
import type { MarketMakerPosition, InventoryMetrics } from './types';

export class InventoryManager {
  private errorHandler: ErrorHandler;
  private positions: Map<string, MarketMakerPosition>;
  private readonly TARGET_INVENTORY = 1000000; // 1M CC
  private readonly MAX_DEVIATION = 0.3; // 30%
  private readonly REBALANCE_THRESHOLD = 0.2; // 20%

  constructor() {
    this.errorHandler = ErrorHandler.getInstance();
    this.positions = new Map();
  }

  public updatePosition(
    symbol: string,
    size: number,
    price: number
  ): MarketMakerPosition {
    return this.errorHandler.withErrorHandling(() => {
      const position = this.positions.get(symbol) || {
        symbol,
        size: 0,
        averagePrice: 0,
        marketPrice: price,
        unrealizedPnL: 0,
        realizedPnL: 0,
        hedgeRatio: 0,
        lastUpdated: Date.now()
      };

      const newPosition = this.calculateNewPosition(position, size, price);
      this.positions.set(symbol, newPosition);
      return newPosition;
    }, {
      context: 'InventoryManager',
      operation: 'updatePosition',
      symbol
    });
  }

  private calculateNewPosition(
    position: MarketMakerPosition,
    sizeDelta: number,
    price: number
  ): MarketMakerPosition {
    const oldValue = position.size * position.averagePrice;
    const newValue = sizeDelta * price;
    const totalValue = oldValue + newValue;
    const totalSize = position.size + sizeDelta;

    const averagePrice = totalSize !== 0 ? totalValue / totalSize : position.averagePrice;
    const unrealizedPnL = totalSize * (price - averagePrice);

    return {
      ...position,
      size: totalSize,
      averagePrice,
      marketPrice: price,
      unrealizedPnL,
      lastUpdated: Date.now()
    };
  }

  public getInventoryMetrics(): InventoryMetrics {
    return this.errorHandler.withErrorHandling(() => {
      let totalValue = 0;
      let netExposure = 0;
      let turnover = 0;
      let profitLoss = 0;

      for (const position of this.positions.values()) {
        const positionValue = Math.abs(position.size * position.marketPrice);
        totalValue += positionValue;
        netExposure += position.size * position.marketPrice;
        profitLoss += position.unrealizedPnL + position.realizedPnL;
      }

      return {
        totalValue,
        netExposure,
        hedgeRatio: this.calculateHedgeRatio(),
        turnoverRate: this.calculateTurnoverRate(),
        profitLoss
      };
    }, {
      context: 'InventoryManager',
      operation: 'getInventoryMetrics'
    });
  }

  private calculateHedgeRatio(): number {
    let totalExposure = 0;
    let totalHedge = 0;

    for (const position of this.positions.values()) {
      totalExposure += Math.abs(position.size * position.marketPrice);
      totalHedge += Math.abs(position.size * position.marketPrice * position.hedgeRatio);
    }

    return totalExposure > 0 ? totalHedge / totalExposure : 0;
  }

  private calculateTurnoverRate(): number {
    // Implement turnover rate calculation
    return 0;
  }

  public needsRebalancing(symbol: string): boolean {
    const position = this.positions.get(symbol);
    if (!position) return false;

    const deviation = Math.abs(position.size / this.TARGET_INVENTORY - 1);
    return deviation > this.REBALANCE_THRESHOLD;
  }

  public getRebalanceSize(symbol: string): number {
    const position = this.positions.get(symbol);
    if (!position) return 0;

    const targetSize = this.TARGET_INVENTORY / position.marketPrice;
    return targetSize - position.size;
  }

  public getPosition(symbol: string): MarketMakerPosition | undefined {
    return this.positions.get(symbol);
  }

  public getAllPositions(): MarketMakerPosition[] {
    return Array.from(this.positions.values());
  }
}