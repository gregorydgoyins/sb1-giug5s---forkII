import { useMarketStore } from '../../store/marketStore';
import { ErrorHandler } from '../../utils/errors';
import type { Order, Position } from '../../types';

export class OrderProcessor {
  private static instance: OrderProcessor;
  private positions: Map<string, Position>;
  private errorHandler: ErrorHandler;

  private constructor() {
    this.positions = new Map();
    this.errorHandler = ErrorHandler.getInstance();
  }

  public static getInstance(): OrderProcessor {
    if (!OrderProcessor.instance) {
      OrderProcessor.instance = new OrderProcessor();
    }
    return OrderProcessor.instance;
  }

  public async processOrder(order: Order): Promise<boolean> {
    return this.errorHandler.withErrorHandling(async () => {
      // Validate order
      if (!this.validateOrder(order)) {
        throw new Error('Invalid order');
      }

      // Process the order atomically
      await this.executeTransaction(order);

      // Update position
      this.updatePosition(order);

      return true;
    }, {
      context: 'OrderProcessor',
      operation: 'processOrder',
      order
    });
  }

  private validateOrder(order: Order): boolean {
    const { userBalance } = useMarketStore.getState();

    if (order.quantity <= 0) {
      throw new Error('Invalid quantity');
    }

    if (order.side === 'buy') {
      if (order.total > userBalance) {
        throw new Error('Insufficient funds');
      }
    } else {
      const position = this.positions.get(order.symbol);
      if (!position || position.quantity < order.quantity) {
        throw new Error('Insufficient position');
      }
    }

    return true;
  }

  private async executeTransaction(order: Order): Promise<void> {
    const { userBalance, setUserBalance } = useMarketStore.getState();
    
    try {
      if (order.side === 'buy') {
        setUserBalance(userBalance - order.total);
      } else {
        setUserBalance(userBalance + order.total);
      }
    } catch (error) {
      // Rollback on failure
      if (order.side === 'buy') {
        setUserBalance(userBalance);
      } else {
        setUserBalance(userBalance);
      }
      throw error;
    }
  }

  private updatePosition(order: Order): void {
    const currentPosition = this.positions.get(order.symbol) || {
      symbol: order.symbol,
      quantity: 0,
      averagePrice: 0,
      value: 0,
      lastUpdated: new Date()
    };

    if (order.side === 'buy') {
      const newQuantity = currentPosition.quantity + order.quantity;
      const newValue = currentPosition.value + order.total;
      
      this.positions.set(order.symbol, {
        ...currentPosition,
        quantity: newQuantity,
        averagePrice: newValue / newQuantity,
        value: newValue,
        lastUpdated: new Date()
      });
    } else {
      const newQuantity = currentPosition.quantity - order.quantity;
      const newValue = currentPosition.value - (order.quantity * currentPosition.averagePrice);
      
      if (newQuantity > 0) {
        this.positions.set(order.symbol, {
          ...currentPosition,
          quantity: newQuantity,
          averagePrice: newValue / newQuantity,
          value: newValue,
          lastUpdated: new Date()
        });
      } else {
        this.positions.delete(order.symbol);
      }
    }
  }

  public getPosition(symbol: string): Position | undefined {
    return this.positions.get(symbol);
  }

  public getAllPositions(): Position[] {
    return Array.from(this.positions.values());
  }
}