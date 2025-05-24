import { MarvelApiClient } from '../marvel/MarvelApiClient';
import { ErrorHandler } from '../../utils/errors';
import { DatabaseService } from '../database/DatabaseService';
import { RateLimiter } from '../../utils/security/RateLimiter';
import type { MarketAsset, AssetPrice, MarketMetrics } from './types';

export class SuperheroMarketService {
  private static instance: SuperheroMarketService;
  private marvelClient: MarvelApiClient;
  private db: DatabaseService;
  private errorHandler: ErrorHandler;
  private rateLimiter: RateLimiter;
  private updateInterval: NodeJS.Timeout | null = null;

  private readonly TRADING_HOURS = {
    start: 9.5, // 9:30 AM
    end: 15.5   // 3:30 PM
  };

  private constructor() {
    this.marvelClient = MarvelApiClient.getInstance();
    this.db = DatabaseService.getInstance();
    this.errorHandler = ErrorHandler.getInstance();
    this.rateLimiter = RateLimiter.getInstance();
    this.startMarketUpdates();
  }

  public static getInstance(): SuperheroMarketService {
    if (!SuperheroMarketService.instance) {
      SuperheroMarketService.instance = new SuperheroMarketService();
    }
    return SuperheroMarketService.instance;
  }

  private startMarketUpdates(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }

    // Update market data every minute during trading hours
    this.updateInterval = setInterval(() => {
      if (this.isMarketOpen()) {
        this.updateMarketData();
      }
    }, 60000);
  }

  private isMarketOpen(): boolean {
    const now = new Date();
    const hour = now.getHours() + now.getMinutes() / 60;
    const day = now.getDay();

    // Check if weekend
    if (day === 0 || day === 6) return false;

    // Check if within trading hours
    return hour >= this.TRADING_HOURS.start && hour < this.TRADING_HOURS.end;
  }

  private async updateMarketData(): Promise<void> {
    await this.rateLimiter.consume('marvel-api');

    try {
      const [characters, creators] = await Promise.all([
        this.marvelClient.searchCharacters({}),
        this.marvelClient.searchCreators({})
      ]);

      const assets = [
        ...this.transformCharactersToAssets(characters),
        ...this.transformCreatorsToAssets(creators)
      ];

      await this.updateAssetPrices(assets);
    } catch (error) {
      this.errorHandler.handleError(error instanceof Error ? error : new Error(String(error)), {
        context: 'SuperheroMarketService',
        operation: 'updateMarketData'
      });
    }
  }

  private transformCharactersToAssets(characters: any[]): MarketAsset[] {
    return characters.map(char => ({
      id: char.id.toString(),
      symbol: this.generateSymbol(char.name),
      name: char.name,
      type: 'character',
      metadata: {
        appearances: char.comics.available,
        series: char.series.available,
        events: char.events.available
      }
    }));
  }

  private transformCreatorsToAssets(creators: any[]): MarketAsset[] {
    return creators.map(creator => ({
      id: creator.id.toString(),
      symbol: this.generateSymbol(creator.fullName),
      name: creator.fullName,
      type: 'creator',
      metadata: {
        comics: creator.comics.available,
        series: creator.series.available
      }
    }));
  }

  private generateSymbol(name: string): string {
    return name
      .replace(/[^A-Z]/gi, '')
      .slice(0, 4)
      .toUpperCase();
  }

  private async updateAssetPrices(assets: MarketAsset[]): Promise<void> {
    await this.db.transaction(async (trx) => {
      for (const asset of assets) {
        const metrics = await this.calculateAssetMetrics(asset);
        const price = this.calculateAssetPrice(asset, metrics);

        await trx.query(
          `INSERT INTO asset_prices (
            asset_id,
            price,
            volume,
            timestamp,
            metrics
          ) VALUES ($1, $2, $3, $4, $5)`,
          [
            asset.id,
            price.value,
            price.volume,
            new Date(),
            JSON.stringify(metrics)
          ]
        );
      }
    });
  }

  private async calculateAssetMetrics(asset: MarketAsset): Promise<MarketMetrics> {
    // Implement market metrics calculation
    return {
      popularity: 0,
      volatility: 0,
      momentum: 0,
      sentiment: 0
    };
  }

  private calculateAssetPrice(asset: MarketAsset, metrics: MarketMetrics): AssetPrice {
    // Implement price calculation logic
    return {
      value: 1000,
      volume: 0,
      change: 0
    };
  }

  public async getAssetPrice(symbol: string): Promise<AssetPrice | null> {
    const result = await this.db.query(
      `SELECT price, volume, timestamp 
       FROM asset_prices 
       WHERE asset_id = (
         SELECT id FROM assets WHERE symbol = $1
       )
       ORDER BY timestamp DESC 
       LIMIT 1`,
      [symbol]
    );

    return result.rows[0] || null;
  }

  public async getMarketStatus(): Promise<{
    isOpen: boolean;
    nextOpenTime?: Date;
    nextCloseTime?: Date;
  }> {
    const isOpen = this.isMarketOpen();
    const now = new Date();

    if (isOpen) {
      const closeTime = new Date(now);
      closeTime.setHours(Math.floor(this.TRADING_HOURS.end));
      closeTime.setMinutes((this.TRADING_HOURS.end % 1) * 60);
      return { isOpen, nextCloseTime: closeTime };
    } else {
      const nextOpen = this.calculateNextOpenTime(now);
      return { isOpen, nextOpenTime: nextOpen };
    }
  }

  private calculateNextOpenTime(now: Date): Date {
    const nextOpen = new Date(now);
    nextOpen.setHours(Math.floor(this.TRADING_HOURS.start));
    nextOpen.setMinutes((this.TRADING_HOURS.start % 1) * 60);

    // If past today's open time, move to next business day
    if (now.getHours() >= Math.floor(this.TRADING_HOURS.end)) {
      nextOpen.setDate(nextOpen.getDate() + 1);
    }

    // Skip weekends
    while (nextOpen.getDay() === 0 || nextOpen.getDay() === 6) {
      nextOpen.setDate(nextOpen.getDate() + 1);
    }

    return nextOpen;
  }
}