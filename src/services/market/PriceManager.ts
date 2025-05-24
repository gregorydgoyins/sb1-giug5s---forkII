import { MARKET_PRICES, PRICE_MULTIPLIERS } from './config/marketPrices';
import { ErrorHandler } from '@/utils/errors';
import type { ComicAge } from '@/types';

export class PriceManager {
  private static instance: PriceManager;
  private errorHandler: ErrorHandler;
  private priceCache: Map<string, number>;
  private lastUpdate: Date;

  private constructor() {
    this.errorHandler = ErrorHandler.getInstance();
    this.priceCache = new Map();
    this.lastUpdate = new Date();
    this.initializePrices();
  }

  public static getInstance(): PriceManager {
    if (!PriceManager.instance) {
      PriceManager.instance = new PriceManager();
    }
    return PriceManager.instance;
  }

  private initializePrices(): void {
    // Initialize price cache with base prices
    Object.entries(MARKET_PRICES.comics).forEach(([symbol, price]) => {
      this.priceCache.set(symbol, price);
    });

    Object.entries(MARKET_PRICES.creators).forEach(([symbol, price]) => {
      this.priceCache.set(symbol, price);
    });

    Object.entries(MARKET_PRICES.publishers).forEach(([symbol, price]) => {
      this.priceCache.set(symbol, price);
    });

    Object.entries(MARKET_PRICES.options).forEach(([symbol, price]) => {
      this.priceCache.set(symbol, price);
    });

    Object.entries(MARKET_PRICES.funds).forEach(([symbol, price]) => {
      this.priceCache.set(symbol, price);
    });
  }

  public getPrice(symbol: string): number {
    return this.errorHandler.withErrorHandling(() => {
      const price = this.priceCache.get(symbol);
      if (!price) {
        throw new Error(`Price not found for symbol: ${symbol}`);
      }
      return price;
    }, {
      context: 'PriceManager',
      operation: 'getPrice',
      symbol
    });
  }

  public calculateAdjustedPrice(
    basePrice: number,
    grade: string,
    age: ComicAge,
    signatures?: Array<keyof typeof PRICE_MULTIPLIERS.signatures>
  ): number {
    return this.errorHandler.withErrorHandling(() => {
      let adjustedPrice = basePrice;

      // Apply grade multiplier
      const gradeMultiplier = PRICE_MULTIPLIERS.grades[grade] || PRICE_MULTIPLIERS.grades.RAW;
      adjustedPrice *= gradeMultiplier;

      // Apply age multiplier
      const ageMultiplier = PRICE_MULTIPLIERS.age[age];
      adjustedPrice *= ageMultiplier;

      // Apply signature multipliers
      if (signatures && signatures.length > 0) {
        const signatureMultiplier = signatures.reduce((total, sig) => {
          return total * (PRICE_MULTIPLIERS.signatures[sig] || 1);
        }, 1);
        adjustedPrice *= signatureMultiplier;
      }

      return adjustedPrice;
    }, {
      context: 'PriceManager',
      operation: 'calculateAdjustedPrice',
      basePrice,
      grade,
      age
    });
  }

  public updatePrice(symbol: string, newPrice: number): void {
    this.errorHandler.withErrorHandling(() => {
      if (newPrice <= 0) {
        throw new Error('Price must be greater than zero');
      }
      this.priceCache.set(symbol, newPrice);
      this.lastUpdate = new Date();
    }, {
      context: 'PriceManager',
      operation: 'updatePrice',
      symbol,
      newPrice
    });
  }

  public getLastUpdate(): Date {
    return this.lastUpdate;
  }

  public getAllPrices(): Map<string, number> {
    return new Map(this.priceCache);
  }
}