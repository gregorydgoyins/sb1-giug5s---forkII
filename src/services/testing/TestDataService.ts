import { MarketDataService } from '../market/MarketDataService';
import { ErrorHandler } from '../../utils/errors';
import type { MarketDataPoint, MarketSnapshot } from '../market/types';

export class TestDataService {
  private static instance: TestDataService;
  private errorHandler: ErrorHandler;
  private marketData: MarketDataService;
  private readonly SAMPLE_SIZE = 1000;
  private readonly VOLATILITY_LEVELS = {
    low: 0.15,    // 15% annual volatility
    medium: 0.25, // 25% annual volatility
    high: 0.35    // 35% annual volatility
  };

  private constructor() {
    this.errorHandler = ErrorHandler.getInstance();
    this.marketData = MarketDataService.getInstance();
  }

  public static getInstance(): TestDataService {
    if (!TestDataService.instance) {
      TestDataService.instance = new TestDataService();
    }
    return TestDataService.instance;
  }

  public generateTestData(symbol: string, volatility: 'low' | 'medium' | 'high'): MarketSnapshot {
    return this.errorHandler.withErrorHandling(() => {
      const basePrice = this.getBasePrice(symbol);
      const annualVol = this.VOLATILITY_LEVELS[volatility];
      const dailyVol = annualVol / Math.sqrt(252);
      
      const data: MarketDataPoint[] = [];
      let currentPrice = basePrice;

      for (let i = 0; i < this.SAMPLE_SIZE; i++) {
        const returns = this.generateRandomReturns(dailyVol);
        currentPrice *= Math.exp(returns);

        data.push({
          symbol,
          timestamp: Date.now() - (this.SAMPLE_SIZE - i) * 60000,
          price: currentPrice,
          volume: this.generateVolume(currentPrice),
          high: currentPrice * (1 + Math.random() * 0.01),
          low: currentPrice * (1 - Math.random() * 0.01),
          open: currentPrice * (1 + (Math.random() - 0.5) * 0.005),
          close: currentPrice
        });
      }

      return {
        symbol,
        data,
        indicators: [],
        lastUpdate: Date.now()
      };
    }, {
      context: 'TestDataService',
      operation: 'generateTestData',
      symbol,
      volatility
    });
  }

  private getBasePrice(symbol: string): number {
    // Base prices for different asset types
    const basePrices: Record<string, number> = {
      'ASM300': 2500,  // Amazing Spider-Man #300
      'BAT457': 1800,  // Batman #457
      'TMFS': 2200,    // Todd McFarlane Stock
      'DCCP': 3500,    // DC Comics Publisher Bond
      'MRVL': 4200     // Marvel Entertainment Bond
    };

    return basePrices[symbol] || 1000;
  }

  private generateRandomReturns(volatility: number): number {
    // Box-Muller transform for normal distribution
    const u1 = Math.random();
    const u2 = Math.random();
    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return (volatility * z) - (volatility * volatility / 2);
  }

  private generateVolume(price: number): number {
    // Generate realistic trading volume based on price
    const baseVolume = 1000;
    const priceImpact = Math.log10(price);
    const randomFactor = 0.5 + Math.random();
    return Math.round(baseVolume * priceImpact * randomFactor);
  }

  public async populateTestData(): Promise<void> {
    const testCases = [
      { symbol: 'ASM300', volatility: 'medium' as const },
      { symbol: 'BAT457', volatility: 'low' as const },
      { symbol: 'TMFS', volatility: 'high' as const },
      { symbol: 'DCCP', volatility: 'low' as const },
      { symbol: 'MRVL', volatility: 'medium' as const }
    ];

    for (const testCase of testCases) {
      const data = this.generateTestData(testCase.symbol, testCase.volatility);
      await this.marketData.updateMarketData(testCase.symbol, data);
    }
  }

  public generateEdgeCases(): MarketSnapshot[] {
    return [
      this.generateHighVolatilityCase(),
      this.generateLowLiquidityCase(),
      this.generateGapCase(),
      this.generateTrendReversalCase()
    ];
  }

  private generateHighVolatilityCase(): MarketSnapshot {
    return this.generateTestData('HIGH_VOL', 'high');
  }

  private generateLowLiquidityCase(): MarketSnapshot {
    const baseData = this.generateTestData('LOW_LIQ', 'low');
    baseData.data = baseData.data.map(point => ({
      ...point,
      volume: point.volume * 0.1 // 90% volume reduction
    }));
    return baseData;
  }

  private generateGapCase(): MarketSnapshot {
    const baseData = this.generateTestData('GAP', 'medium');
    // Insert price gap at random point
    const gapIndex = Math.floor(this.SAMPLE_SIZE * 0.7);
    const gapSize = 0.15; // 15% gap
    
    for (let i = gapIndex; i < baseData.data.length; i++) {
      baseData.data[i].price *= (1 + gapSize);
      baseData.data[i].high *= (1 + gapSize);
      baseData.data[i].low *= (1 + gapSize);
      baseData.data[i].open *= (1 + gapSize);
      baseData.data[i].close *= (1 + gapSize);
    }
    
    return baseData;
  }

  private generateTrendReversalCase(): MarketSnapshot {
    const baseData = this.generateTestData('REVERSAL', 'medium');
    const reversalIndex = Math.floor(this.SAMPLE_SIZE * 0.5);
    
    // Create uptrend followed by downtrend
    for (let i = 0; i < baseData.data.length; i++) {
      const trendFactor = i < reversalIndex ? 1.001 : 0.999;
      baseData.data[i].price *= Math.pow(trendFactor, i);
    }
    
    return baseData;
  }
}