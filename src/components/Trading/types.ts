export interface Order {
  id?: string;
  type: 'market' | 'limit';
  side: 'buy' | 'sell';
  asset: string;
  quantity: number;
  price?: number;
  total: number;
  status?: 'pending' | 'executed' | 'failed';
  timestamp?: Date;
}

export interface MarketData {
  currentPrice: number;
  priceChange: number;
  priceHistory: PricePoint[];
  orderBook: OrderBook;
  volumeMetrics: VolumeMetrics;
}

export interface PricePoint {
  timestamp: Date;
  price: number;
  volume: number;
}

export interface OrderBook {
  bids: Level[];
  asks: Level[];
}

export interface Level {
  price: number;
  quantity: number;
  total: number;
}

export interface VolumeMetrics {
  daily: number;
  weekly: number;
  monthly: number;
  avgTradeSize: number;
}

export interface Transaction {
  id: string;
  orderId: string;
  asset: string;
  type: 'market' | 'limit';
  side: 'buy' | 'sell';
  quantity: number;
  price: number;
  total: number;
  timestamp: Date;
}