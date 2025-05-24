import { TradingConfig, TradingConfigType, DEFAULT_TRADING_CONFIG } from './config';
import { ErrorHandler } from '../../utils/errors';
import { RateLimiter } from '../../utils/security/RateLimiter';
import { MarketDataService } from '../market/MarketDataService';
import type { Order, Trade, OrderValidationResult, Orderbook } from './types';

export class TradingService {
  private static instance: TradingService;
  private config: TradingConfigType;
  private errorHandler: ErrorHandler;
  private rateLimiter: RateLimiter;
  private marketData: MarketDataService;
  private orders: Map<string, Order>;
  private orderbooks: Map<string, Orderbook>;

  private constructor(config?: Partial<TradingConfigType>) {
    this.config = TradingConfig.parse({ ...DEFAULT_TRADING_CONFIG, ...config });
    this.errorHandler = ErrorHandler.getInstance();
    this.rateLimiter = RateLimiter.getInstance();
    this.marketData = MarketDataService.getInstance();
    this.orders = new Map();
    this.orderbooks = new Map();
  }

  public static getInstance(config?: Partial<TradingConfigType>): TradingService {
    if (!TradingService.instance) {
      TradingService.instance = new TradingService(config);
    }
    return TradingService.instance;
  }

  public async placeOrder(orderRequest: Omit<Order, 'id' | 'status' | 'filled' | 'remainingQuantity' | 'fees' | 'timestamp'>): Promise<Order> {
    return this.errorHandler.withErrorHandling(async () => {
      // Validate order
      const validation = await this.validateOrder(orderRequest);
      if (!validation.valid) {
        throw new Error(`Invalid order: ${validation.errors.join(', ')}`);
      }

      // Create order
      const order: Order = {
        ...orderRequest,
        id: crypto.randomUUID(),
        status: 'pending',
        filled: 0,
        remainingQuantity: orderRequest.quantity,
        fees: 0,
        timestamp: Date.now()
      };

      // Store order
      this.orders.set(order.id, order);

      // Process order
      await this.processOrder(order);

      return order;
    }, {
      context: 'TradingService',
      operation: 'placeOrder',
      symbol: orderRequest.symbol
    });
  }

  private async validateOrder(order: Omit<Order, 'id' | 'status' | 'filled' | 'remainingQuantity' | 'fees' | 'timestamp'>): Promise<OrderValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check order size
    if (order.quantity > this.config.maxOrderSize) {
      errors.push(`Order size exceeds maximum of ${this.config.maxOrderSize}`);
    }
    if (order.quantity < this.config.minOrderSize) {
      errors.push(`Order size below minimum of ${this.config.minOrderSize}`);
    }

    // Check price for limit orders
    if (order.type === 'limit' && !order.price) {
      errors.push('Limit orders require a price');
    }

    // Check stop price for stop orders
    if ((order.type === 'stop' || order.type === 'stop_limit') && !order.stopPrice) {
      errors.push('Stop orders require a stop price');
    }

    // Check market data
    const marketSnapshot = this.marketData.getMarketData(order.symbol);
    if (!marketSnapshot) {
      errors.push('No market data available for symbol');
    } else {
      // Price deviation check
      const lastPrice = marketSnapshot.data[marketSnapshot.data.length - 1].price;
      if (order.price && Math.abs(order.price - lastPrice) / lastPrice > this.config.validation.priceThreshold) {
        warnings.push('Large price deviation from market');
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  private async processOrder(order: Order): Promise<void> {
    // Update order status
    order.status = 'open';
    this.orders.set(order.id, order);

    // Match order if possible
    if (order.type === 'market' || (order.type === 'limit' && this.canMatchOrder(order))) {
      await this.matchOrder(order);
    } else {
      // Add to orderbook
      await this.addToOrderbook(order);
    }
  }

  private canMatchOrder(order: Order): boolean {
    const orderbook = this.orderbooks.get(order.symbol);
    if (!orderbook) return false;

    if (order.side === 'buy') {
      return orderbook.asks.some(ask => order.price! >= ask.price);
    } else {
      return orderbook.bids.some(bid => order.price! <= bid.price);
    }
  }

  private async matchOrder(order: Order): Promise<void> {
    // Implement order matching logic
  }

  private async addToOrderbook(order: Order): Promise<void> {
    const orderbook = this.orderbooks.get(order.symbol) || {
      symbol: order.symbol,
      bids: [],
      asks: [],
      timestamp: Date.now()
    };

    if (order.side === 'buy') {
      orderbook.bids.push({
        price: order.price!,
        quantity: order.remainingQuantity,
        orderCount: 1
      });
      orderbook.bids.sort((a, b) => b.price - a.price);
    } else {
      orderbook.asks.push({
        price: order.price!,
        quantity: order.remainingQuantity,
        orderCount: 1
      });
      orderbook.asks.sort((a, b) => a.price - b.price);
    }

    this.orderbooks.set(order.symbol, orderbook);
  }

  public getOrder(orderId: string): Order | undefined {
    return this.orders.get(orderId);
  }

  public getOrderbook(symbol: string): Orderbook | undefined {
    return this.orderbooks.get(symbol);
  }

  public cancelOrder(orderId: string): boolean {
    const order = this.orders.get(orderId);
    if (!order || order.status !== 'open') {
      return false;
    }

    order.status = 'cancelled';
    this.orders.set(orderId, order);
    return true;
  }
}