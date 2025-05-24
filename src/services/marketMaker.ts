export class MarketMaker {
  private readonly MAX_SPREAD = 0.05;     // 5% max spread
  private readonly MIN_SPREAD = 0.001;    // 0.1% min spread
  private readonly TICK_SIZE = 0.01;      // 1 cent minimum price increment
  
  private calculateSpread(price: number): number {
    // Higher prices get tighter spreads, logarithmic scale
    const spread = Math.max(
      this.MIN_SPREAD,
      Math.min(
        this.MAX_SPREAD,
        0.05 * Math.exp(-price / 10000)
      )
    );
    
    // Round to nearest tick
    return Math.round(spread / this.TICK_SIZE) * this.TICK_SIZE;
  }
  
  // ... rest of the class implementation remains the same
}