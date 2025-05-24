export type OrderType = 'market' | 'limit' | 'stop' | 'stop_limit';
export type TimeInForce = 'day' | 'gtc' | 'ioc' | 'fok';
export type OrderStatus = 'pending' | 'open' | 'filled' | 'cancelled' | 'rejected';
export type OrderSide = 'buy' | 'sell';

export interface Order {
  id: string;
  symbol: string;
  type: OrderType;
  side: OrderSide;
  quantity: number;
  price?: number;
  stopPrice?: number;
  timeInForce: TimeInForce;
  status: OrderStatus;
  filled: number;
  remainingQuantity: number;
  averagePrice?: number;
  fees: number;
  timestamp: number;
  expirationTime?: number;
  userId: string;
}

export interface Trade {
  id: string;
  orderId: string;
  symbol: string;
  price: number;
  quantity: number;
  side: OrderSide;
  timestamp: number;
  makerOrderId: string;
  takerOrderId: string;
  makerFee: number;
  takerFee: number;
}

export interface OrderValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export interface OrderbookEntry {
  price: number;
  quantity: number;
  orderCount: number;
}

export interface Orderbook {
  symbol: string;
  bids: OrderbookEntry[];
  asks: OrderbookEntry[];
  timestamp: number;
}