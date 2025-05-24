import { ErrorHandler } from '../../utils/errors';
import type { Order, Trade, Orderbook } from './types';

export class OrderMatchingEngine {
  private static instance: OrderMatchingEngine;
  private errorHandler: ErrorHandler;
  private orderbooks: Map<string, Orderbook>;
  private trades: Trade[];

  private constructor() {
    this.errorHandler = ErrorHandler.getInstance();
    this.orderbooks = new Map();
    this.trades = [];
  }

  public static getInstance(): OrderMatchingEngine {
    if (!OrderMatchingEngine.instance) {
      OrderMatchingEngine.instance = new OrderMatchingEngine();
    }
    return OrderMatchingEngine.instance;
  }

  public matchOrder(order: Order): Trade[] {
    return this.errorHandler.withErrorHandling(() => {
      const trades: Trade[] = [];
      const orderbook = this.getOrderbook(order.symbol);

      if (order.type === 'market') {
        trades.push(...this.matchMarketOrder(order, orderbook));
      } else if (order.type === 'limit') {
        trades.push(...this.matchLimitOrder(order, orderbook));
      }

      // Store trades
      this.trades.push(...trades);

      // Update orderbook
      this.updateOrderbook(order.symbol, orderbook, trades);

      return trades;
    }, {
      context: 'OrderMatchingEngine',
      operation: 'matchOrder',
      orderId: order.id
    });
  }

  private matchMarketOrder(order: Order, orderbook: Orderbook): Trade[] {
    const trades: Trade[] = [];
    const entries = order.side === 'buy' ? orderbook.asks : orderbook.bids;
    let remainingQuantity = order.quantity;

    for (const entry of entries) {
      if (remainingQuantity <= 0) break;

      const matchQuantity = Math.min(remainingQuantity, entry.quantity);
      trades.push({
        id: crypto.randomUUID(),
        orderId: order.id,
        symbol: order.symbol,
        price: entry.price,
        quantity: matchQuantity,
        side: order.side,
        timestamp: Date.now(),
        makerOrderId: entry.orderId,
        takerOrderId: order.id,
        makerFee: this.calculateMakerFee(matchQuantity, entry.price),
        takerFee: this.calculateTakerFee(matchQuantity, entry.price)
      });

      remainingQuantity -= matchQuantity;
    }

    return trades;
  }

  private matchLimitOrder(order: Order, orderbook: Orderbook): Trade[] {
    const trades: Trade[] = [];
    const entries = order.side === 'buy' ? orderbook.asks : orderbook.bids;
    let remainingQuantity = order.quantity;

    for (const entry of entries) {
      if (remainingQuantity <= 0) break;

      // Check if price matches
      if ((order.side === 'buy' && entry.price > order.price!) ||
          (order.side === 'sell' && entry.price < order.price!)) {
        break;
      }

      const matchQuantity = Math.min(remainingQuantity, entry.quantity);
      trades.push({
        id: crypto.randomUUID(),
        orderId: order.id,
        symbol: order.symbol,
        price: entry.price,
        quantity: matchQuantity,
        side: order.side,
        timestamp: Date.now(),
        makerOrderId: entry.orderId,
        takerOrderId: order.id,
        makerFee: this.calculateMakerFee(matchQuantity, entry.price),
        takerFee: this.calculateTakerFee(matchQuantity, entry.price)
      });

      remainingQuantity -= matchQuantity;
    }

    return trades;
  }

  private calculateMakerFee(quantity: number, price: number): number {
    return quantity * price * 0.001; // 0.1% maker fee
  }

  private calculateTakerFee(quantity: number, price: number): number {
    return quantity * price * 0.002; // 0.2% taker fee
  }

  private getOrderbook(symbol: string): Orderbook {
    return this.orderbooks.get(symbol) || {
      symbol,
      bids: [],
      asks: [],
      timestamp: Date.now()
    };
  }

  private updateOrderbook(symbol: string, orderbook: Orderbook, trades: Trade[]): void {
    // Update orderbook based on executed trades
    trades.forEach(trade => {
      const side = trade.side === 'buy' ? 'asks' : 'bids';
      const entries = orderbook[side];

      // Find and update matched entry
      const entryIndex = entries.findIndex(e => e.price === trade.price);
      if (entryIndex >= 0) {
        const entry = entries[entryIndex];
        entry.quantity -= trade.quantity;
        if (entry.quantity <= 0) {
          entries.splice(entryIndex, 1);
        }
      }
    });

    orderbook.timestamp = Date.now();
    this.orderbooks.set(symbol, orderbook);
  }

  public getTradeHistory(symbol: string): Trade[] {
    return this.trades.filter(trade => trade.symbol === symbol);
  }
}