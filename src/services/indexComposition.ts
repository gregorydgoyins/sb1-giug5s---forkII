import type { IndexComponent, ComicAge } from '../types';

export class ComicMarketIndex {
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
    { title: "Amazing Spider-Man #129", age: "bronze", weight: 0.05, significance: "First Punisher", basePrice: 24000 },
    
    // Copper Age (15%)
    { title: "Teenage Mutant Ninja Turtles #1", age: "copper", weight: 0.04, significance: "First TMNT", basePrice: 18000 },
    { title: "Batman: The Dark Knight Returns #1", age: "copper", weight: 0.04, significance: "Miller's Dark Knight", basePrice: 15000 },
    { title: "Watchmen #1", age: "copper", weight: 0.04, significance: "Start of Watchmen", basePrice: 12000 },
    { title: "Crisis on Infinite Earths #1", age: "copper", weight: 0.03, significance: "DC Universe Reboot", basePrice: 10000 },
    
    // Modern Age (10%)
    { title: "Walking Dead #1", age: "modern", weight: 0.03, significance: "First Walking Dead", basePrice: 8000 },
    { title: "New Mutants #98", age: "modern", weight: 0.02, significance: "First Deadpool", basePrice: 6000 },
    { title: "Ultimate Spider-Man #1", age: "modern", weight: 0.03, significance: "Ultimate Universe Begins", basePrice: 5000 },
    { title: "Batman Adventures #12", age: "modern", weight: 0.02, significance: "First Harley in Comics", basePrice: 7000 }
  ];

  public getComponents(): IndexComponent[] {
    return this.INDEX_COMPONENTS;
  }

  public calculateIndexValue(): number {
    // Each component's basePrice is multiplied by its weight and 100 to get a reasonable index value
    return this.INDEX_COMPONENTS.reduce((total, component) => {
      return total + (component.basePrice * component.weight * 100);
    }, 0);
  }

  public getHistoricalPerformance(startDate: Date, endDate: Date): number {
    // Implement actual historical tracking
    // For now, return a realistic YTD of 2.8%
    return 2.8;
  }

  public getAgeDistribution(): Record<ComicAge, number> {
    const distribution: Record<ComicAge, number> = {
      golden: 0,
      silver: 0,
      bronze: 0,
      copper: 0,
      modern: 0
    };

    this.INDEX_COMPONENTS.forEach(component => {
      distribution[component.age] += component.weight;
    });

    return distribution;
  }
}