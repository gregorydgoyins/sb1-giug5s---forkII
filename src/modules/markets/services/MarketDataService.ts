```typescript
import { io, Socket } from 'socket.io-client';
import { MarketData, TimeFrame } from '../types';
import { ErrorHandler } from '../../../utils/errors';

export class MarketDataService {
  private static instance: MarketDataService;
  private socket: Socket;
  private subscriptions: Map<string, Set<(data: MarketData) => void>>;
  private errorHandler: ErrorHandler;
  private cache: Map<string, MarketData[]>;

  private constructor() {
    this.socket = io(import.meta.env.VITE_WS_URL);
    this.subscriptions = new Map();
    this.errorHandler = ErrorHandler.getInstance();
    this.cache = new Map();
    this.setupSocketHandlers();
  }

  public static getInstance(): MarketDataService {
    if (!MarketDataService.instance) {
      MarketDataService.instance = new MarketDataService();
    }
    return MarketDataService.instance;
  }

  private setupSocketHandlers(): void {
    this.socket.on('connect', () => {
      console.log('Connected to market data service');
    });

    this.socket.on('marketData', (data: MarketData) => {
      this.handleMarketData(data);
    });

    this.socket.on('error', (error: Error) => {
      this.errorHandler.handleError(error, {
        context: 'MarketDataService',
        type: 'websocket_error'
      });
    });
  }

  private handleMarketData(data: MarketData): void {
    // Update cache
    const cachedData = this.cache.get(data.symbol) || [];
    cachedData.push(data);
    this.cache.set(data.symbol, cachedData.slice(-1000)); // Keep last 1000 data points

    // Notify subscribers
    const subscribers = this.subscriptions.get(data.symbol);
    if (subscribers) {
      subscribers.forEach(callback => callback(data));
    }
  }

  public subscribe(symbol: string, callback: (data: MarketData) => void): () => void {
    let subscribers = this.subscriptions.get(symbol);
    if (!subscribers) {
      subscribers = new Set();
      this.subscriptions.set(symbol, subscribers);
      this.socket.emit('subscribe', symbol);
    }
    subscribers.add(callback);

    return () => {
      const subs = this.subscriptions.get(symbol);
      if (subs) {
        subs.delete(callback);
        if (subs.size === 0) {
          this.subscriptions.delete(symbol);
          this.socket.emit('unsubscribe', symbol);
        }
      }
    };
  }

  public async getHistoricalData(
    symbol: string,
    timeFrame: TimeFrame,
    limit: number = 1000
  ): Promise<MarketData[]> {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/markets/historical?symbol=${symbol}&timeFrame=${timeFrame}&limit=${limit}`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch historical data: ${response.statusText}`);
      }

      const data: MarketData[] = await response.json();
      return data;
    } catch (error) {
      this.errorHandler.handleError(error instanceof Error ? error : new Error(String(error)), {
        context: 'MarketDataService',
        type: 'historical_data_error',
        symbol,
        timeFrame
      });
      return [];
    }
  }

  public getCachedData(symbol: string): MarketData[] {
    return this.cache.get(symbol) || [];
  }

  public clearCache(symbol?: string): void {
    if (symbol) {
      this.cache.delete(symbol);
    } else {
      this.cache.clear();
    }
  }
}
```