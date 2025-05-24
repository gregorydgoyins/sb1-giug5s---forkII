import type { SpecListing, AnnouncementType, CreatorHype } from '../types';

class SpecBot {
  private readonly MAX_HYPE_SCORE = 100;
  private readonly MIN_PRICE = 10;
  private readonly MAX_LEVERAGE = 5;

  private calculateBasePrice(announcement: AnnouncementType): number {
    const weights = {
      movie: 1.5,
      tvShow: 1.2,
      event: 1.0,
      variant: 0.8,
      regular: 0.5
    };

    return this.MIN_PRICE * weights[announcement.type];
  }

  private calculateCreatorHype(creators: CreatorHype[]): number {
    return creators.reduce((total, creator) => {
      const recentSuccess = creator.recentSuccesses * 0.3;
      const socialMedia = creator.socialEngagement * 0.2;
      const pastPerformance = creator.pastPerformance * 0.5;
      
      return total + (recentSuccess + socialMedia + pastPerformance);
    }, 0) / creators.length;
  }

  private calculateVolatility(announcement: AnnouncementType): number {
    const timeToRelease = this.getMonthsToRelease(announcement.releaseDate);
    // Higher volatility for items further from release
    return Math.min(0.8, 0.2 + (timeToRelease / 24) * 0.6);
  }

  private getMonthsToRelease(releaseDate: Date): number {
    const now = new Date();
    return (releaseDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30);
  }

  public generateSpecListing(announcement: AnnouncementType): SpecListing {
    const basePrice = this.calculateBasePrice(announcement);
    const hypeScore = this.calculateCreatorHype(announcement.creators);
    const volatility = this.calculateVolatility(announcement);
    
    const priceMultiplier = 1 + (hypeScore / this.MAX_HYPE_SCORE);
    const finalPrice = basePrice * priceMultiplier;

    return {
      id: announcement.id,
      title: announcement.title,
      type: announcement.type,
      releaseDate: announcement.releaseDate,
      basePrice: finalPrice,
      currentPrice: finalPrice,
      volatility,
      hypeScore,
      tradingVolume: 0,
      riskLevel: this.calculateRiskLevel(volatility, hypeScore),
      leverageAvailable: this.calculateMaxLeverage(volatility),
      creators: announcement.creators.map(c => ({
        name: c.name,
        role: c.role,
        hypeScore: (c.recentSuccesses + c.socialEngagement + c.pastPerformance) / 3
      }))
    };
  }

  private calculateRiskLevel(volatility: number, hypeScore: number): 'low' | 'moderate' | 'high' | 'extreme' {
    const riskScore = (volatility * 0.7 + (1 - hypeScore / 100) * 0.3) * 100;
    
    if (riskScore < 30) return 'low';
    if (riskScore < 60) return 'moderate';
    if (riskScore < 85) return 'high';
    return 'extreme';
  }

  private calculateMaxLeverage(volatility: number): number {
    return Math.max(1, Math.round(this.MAX_LEVERAGE * (1 - volatility)));
  }

  public updatePrices(listings: SpecListing[]): SpecListing[] {
    return listings.map(listing => {
      const timeFactor = this.getMonthsToRelease(listing.releaseDate);
      const randomFactor = (Math.random() - 0.5) * 2 * listing.volatility;
      const hypeFactor = listing.hypeScore / this.MAX_HYPE_SCORE;
      
      const priceChange = listing.basePrice * (
        (randomFactor * 0.1) + 
        (hypeFactor * 0.05) - 
        (timeFactor * 0.01)
      );

      return {
        ...listing,
        currentPrice: Math.max(listing.currentPrice + priceChange, this.MIN_PRICE)
      };
    });
  }
}