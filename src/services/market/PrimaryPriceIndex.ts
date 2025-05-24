import { ErrorHandler } from '../../utils/errors';
import { MarketDataService } from './MarketDataService';
import type { ComicAge, IndexComponent } from '../../types';

export class PrimaryPriceIndex {
  private static instance: PrimaryPriceIndex;
  private errorHandler: ErrorHandler;
  private marketData: MarketDataService;
  private readonly AGE_WEIGHTS: Record<ComicAge, number> = {
    golden: 0.30,  // 30% - Blue chip stability
    silver: 0.25,  // 25% - Established value
    bronze: 0.20,  // 20% - Growing maturity
    copper: 0.15,  // 15% - Recent history
    modern: 0.10   // 10% - Current market
  };

  private readonly INDEX_COMPONENTS: IndexComponent[] = [
    // Golden Age (30%)
    { title: "Action Comics #242", age: "golden", weight: 0.08, significance: "First Brainiac", basePrice: 45000 },
    { title: "Detective Comics #168", age: "golden", weight: 0.07, significance: "Origin of Red Hood", basePrice: 42000 },
    { title: "Captain America Comics #1", age: "golden", weight: 0.08, significance: "First Captain America", basePrice: 48000 },
    { title: "All Star Comics #8", age: "golden", weight: 0.07, significance: "First Wonder Woman", basePrice: 43000 },
    
    // Silver Age (25%)
    { title: "Amazing Fantasy #15", age: "silver", weight: 0.07, significance: "First Spider-Man", basePrice: 55000 },
    { title: "Fantastic Four #1", age: "silver", weight: 0.06, significance: "First FF", basePrice: 38000 },
    { title: "Showcase #4", age: "silver", weight: 0.06, significance: "First Silver Age Flash", basePrice: 35000 },
    { title: "X-Men #1", age: "silver", weight: 0.06, significance: "First X-Men", basePrice: 32000 },
    
    // Bronze Age (20%)
    { title: "Giant-Size X-Men #1", age: "bronze", weight: 0.05, significance: "New X-Men Team", basePrice: 28000 },
    { title: "House of Secrets #92", age: "bronze", weight: 0.05, significance: "First Swamp Thing", basePrice: 25000 },
    { title: "Green Lantern #76", age: "bronze", weight: 0.05, significance: "Start of O'Neil/Adams", basePrice: 22000 },
    { title: "Amazing Spider-Man #129", age: "bronze", weight: 0.05, significance: "First Punisher", basePrice: 24000 }
  ];

  private constructor() {
    this.errorHandler = ErrorHandler.getInstance();
    this.marketData = MarketDataService.getInstance();
  }

  public static getInstance(): PrimaryPriceIndex {
    if (!PrimaryPriceIndex.instance) {
      PrimaryPriceIndex.instance = new PrimaryPriceIndex();
    }
    return PrimaryPriceIndex.instance;
  }

  public calculateIndex(): number {
    return this.errorHandler.withErrorHandling(() => {
      let indexValue = 0;

      for (const component of this.INDEX_COMPONENTS) {
        const ageWeight = this.AGE_WEIGHTS[component.age];
        const componentValue = component.basePrice * component.weight * ageWeight;
        indexValue += componentValue;
      }

      return Math.round(indexValue);
    }, {
      context: 'PrimaryPriceIndex',
      operation: 'calculateIndex'
    });
  }

  public getAgeDistribution(): Record<ComicAge, number> {
    return this.AGE_WEIGHTS;
  }

  public getComponents(): IndexComponent[] {
    return this.INDEX_COMPONENTS;
  }

  public getHistoricalPerformance(startDate: Date, endDate: Date): number {
    // Implement actual historical tracking
    // For now, return a realistic YTD of 2.8%
    return 2.8;
  }
}