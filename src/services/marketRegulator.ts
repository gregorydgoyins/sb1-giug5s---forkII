import type { Trade, Account, Investigation, Violation, MarketActivity } from '../types';

export class MarketRegulator {
  private readonly AUDIT_THRESHOLD = 1000000; // 1M CC triggers audit
  private readonly SUCCESS_RATE_THRESHOLD = 0.80; // 80% success rate triggers investigation
  private readonly VOLATILITY_LIMIT = 0.30; // 30% max daily price movement
  private readonly MANIPULATION_DETECTION_WINDOW = 7; // 7 days
  
  private investigations: Map<string, Investigation> = new Map();
  private violations: Map<string, Violation[]> = new Map();
  private accountActivities: Map<string, MarketActivity[]> = new Map();

  public async auditAccount(accountId: string): Promise<Investigation> {
    const activities = await this.getAccountActivities(accountId);
    const patterns = this.detectSuspiciousPatterns(activities);
    
    if (patterns.length > 0) {
      const investigation = this.openInvestigation(accountId, patterns);
      await this.notifyUser(accountId, 'audit_initiated');
      return investigation;
    }

    return null;
  }

  private detectSuspiciousPatterns(activities: MarketActivity[]): string[] {
    const patterns: string[] = [];

    // Check for impossible success rates
    if (this.calculateSuccessRate(activities) > this.SUCCESS_RATE_THRESHOLD) {
      patterns.push('unusual_success_rate');
    }

    // Check for perfect timing on news events
    if (this.detectPerfectTiming(activities)) {
      patterns.push('suspicious_timing');
    }

    // Check for price manipulation
    if (this.detectPriceManipulation(activities)) {
      patterns.push('price_manipulation');
    }

    // Check for wash trading
    if (this.detectWashTrading(activities)) {
      patterns.push('wash_trading');
    }

    return patterns;
  }

  private calculateSuccessRate(activities: MarketActivity[]): number {
    const trades = activities.filter(a => a.type === 'trade');
    const profitable = trades.filter(t => t.profit > 0);
    return profitable.length / trades.length;
  }

  private detectPerfectTiming(activities: MarketActivity[]): boolean {
    let suspiciousTrades = 0;
    
    activities.forEach(activity => {
      if (activity.type === 'trade') {
        const newsEvents = this.findRelatedNews(activity.timestamp, activity.asset);
        if (newsEvents.length > 0 && this.isWithinMinutes(activity.timestamp, newsEvents[0].timestamp, 5)) {
          suspiciousTrades++;
        }
      }
    });

    return suspiciousTrades > 3; // More than 3 perfectly timed trades
  }

  private detectPriceManipulation(activities: MarketActivity[]): boolean {
    const groupedActivities = this.groupActivitiesByAsset(activities);
    
    for (const [asset, assetActivities] of groupedActivities) {
      const priceImpact = this.calculatePriceImpact(assetActivities);
      if (priceImpact > this.VOLATILITY_LIMIT) {
        return true;
      }
    }

    return false;
  }

  private detectWashTrading(activities: MarketActivity[]): boolean {
    const trades = activities.filter(a => a.type === 'trade');
    const roundTrips = this.findRoundTripTrades(trades);
    
    return roundTrips.length > 0;
  }

  private findRoundTripTrades(trades: Trade[]): Trade[][] {
    const roundTrips: Trade[][] = [];
    const positions = new Map<string, number>();

    trades.forEach(trade => {
      const currentPosition = positions.get(trade.asset) || 0;
      positions.set(trade.asset, currentPosition + trade.quantity * (trade.side === 'buy' ? 1 : -1));

      if (positions.get(trade.asset) === 0) {
        roundTrips.push(this.getRelatedTrades(trades, trade));
      }
    });

    return roundTrips;
  }

  public enforcePositionLimits(account: Account): void {
    const positions = account.positions;
    const totalValue = this.calculateTotalValue(positions);

    positions.forEach(position => {
      const concentration = position.value / totalValue;
      if (concentration > 0.25) { // 25% max position size
        this.forceLiquidation(position, concentration - 0.25);
      }
    });
  }

  public monitorVolatility(asset: string, price: number): void {
    const priceHistory = this.getPriceHistory(asset);
    const dailyChange = this.calculateDailyChange(price, priceHistory);

    if (Math.abs(dailyChange) > this.VOLATILITY_LIMIT) {
      this.haltTrading(asset);
      this.investigateVolatility(asset);
    }
  }

  private async haltTrading(asset: string): Promise<void> {
    await this.notifyAllUsers('trading_halt', {
      asset,
      reason: 'excessive_volatility',
      duration: '1h'
    });
  }

  public penalizeViolation(accountId: string, violation: Violation): void {
    const penalties = {
      wash_trading: () => this.applyTradingBan(accountId, 7), // 7-day ban
      price_manipulation: () => this.applyFine(accountId, 500000), // 500K CC fine
      insider_trading: () => this.liquidateAccount(accountId), // Full liquidation
      excessive_concentration: () => this.forceDiversification(accountId)
    };

    penalties[violation.type]();
    this.recordViolation(accountId, violation);
  }

  private applyTradingBan(accountId: string, days: number): void {
    // Implement trading ban
  }

  private applyFine(accountId: string, amount: number): void {
    // Implement fine collection
  }

  private liquidateAccount(accountId: string): void {
    // Implement account liquidation
  }

  private forceDiversification(accountId: string): void {
    // Implement forced position reduction
  }

  public injectVolatility(asset: string): void {
    const baseVolatility = this.calculateBaseVolatility(asset);
    const marketSentiment = this.getMarketSentiment();
    const newsImpact = this.calculateNewsImpact(asset);

    const adjustedVolatility = baseVolatility * (
      1 + marketSentiment * 0.3 + newsImpact * 0.5
    );

    this.applyVolatility(asset, adjustedVolatility);
  }

  private calculateBaseVolatility(asset: string): number {
    const historicalVol = this.getHistoricalVolatility(asset);
    const assetType = this.getAssetType(asset);
    
    const typeMultipliers = {
      comic: 1.0,
      bond: 0.8,
      option: 1.5,
      future: 1.2,
      index: 0.9
    };

    return historicalVol * typeMultipliers[assetType];
  }

  private getMarketSentiment(): number {
    // Returns -1 to 1 representing market sentiment
    return Math.random() * 2 - 1;
  }

  private calculateNewsImpact(asset: string): number {
    const recentNews = this.getRecentNews(asset);
    return recentNews.reduce((impact, news) => {
      return impact + news.sentiment * news.significance;
    }, 0);
  }

  private applyVolatility(asset: string, volatility: number): void {
    const currentPrice = this.getCurrentPrice(asset);
    const movement = (Math.random() * 2 - 1) * volatility;
    const newPrice = currentPrice * (1 + movement);

    this.updatePrice(asset, newPrice);
  }
}