import type { Fund, FundHolding, FundMetrics, FundType } from '../types';

export class FundManager {
  private readonly BLUE_CHIP_WEIGHTS = {
    actionComics1: 0.15,    // Action Comics #1 (15%)
    detectiveComics27: 0.12, // Detective Comics #27 (12%)
    marvelFamily15: 0.10,   // Marvel Family #15 (10%)
    amazingFantasy15: 0.08, // Amazing Fantasy #15 (8%)
    showcase4: 0.07,        // Showcase #4 (7%)
    // ... other blue chips
  };

  private readonly GRADE_MULTIPLIERS = {
    '9.8': 1.00,  // Base multiplier for 9.8
    '9.6': 0.85,  // 15% less for 9.6
    '9.4': 0.75,  // 25% less for 9.4
    '9.2': 0.65,  // 35% less for 9.2
    '9.0': 0.55   // 45% less for 9.0
  };

  public createBluechipFund(name: string, holdings: FundHolding[]): Fund {
    return {
      id: crypto.randomUUID(),
      name,
      type: 'bluechip',
      holdings: this.validateHoldings(holdings),
      nav: this.calculateNAV(holdings),
      minInvestment: 10000, // 10,000 CC minimum
      managementFee: 0.015, // 1.5% annual fee
      metrics: this.calculateMetrics(holdings)
    };
  }

  public createCustomFund(
    name: string, 
    holdings: FundHolding[], 
    type: FundType
  ): Fund {
    const validatedHoldings = this.validateCustomFund(holdings, type);
    
    return {
      id: crypto.randomUUID(),
      name,
      type,
      holdings: validatedHoldings,
      nav: this.calculateNAV(validatedHoldings),
      minInvestment: this.getMinInvestment(type),
      managementFee: this.getManagementFee(type),
      metrics: this.calculateMetrics(validatedHoldings)
    };
  }

  private validateHoldings(holdings: FundHolding[]): FundHolding[] {
    return holdings.map(holding => ({
      ...holding,
      weight: this.BLUE_CHIP_WEIGHTS[holding.asset] || 0.05,
      gradeMultiplier: this.GRADE_MULTIPLIERS[holding.grade] || 0.5
    }));
  }

  private calculateNAV(holdings: FundHolding[]): number {
    return holdings.reduce((total, holding) => {
      const baseValue = holding.marketPrice * holding.quantity;
      return total + (baseValue * holding.weight * holding.gradeMultiplier);
    }, 0);
  }

  private calculateMetrics(holdings: FundHolding[]): FundMetrics {
    const totalValue = this.calculateNAV(holdings);
    const ageDistribution = this.calculateAgeDistribution(holdings);
    const gradeDistribution = this.calculateGradeDistribution(holdings);
    
    return {
      volatility: this.calculateVolatility(holdings),
      liquidity: this.calculateLiquidity(holdings),
      concentration: this.calculateConcentration(holdings),
      ageDistribution,
      gradeDistribution,
      sharpeRatio: this.calculateSharpeRatio(holdings),
      historicalReturns: this.calculateHistoricalReturns(holdings)
    };
  }

  private calculateVolatility(holdings: FundHolding[]): number {
    // Implementation for volatility calculation
    return 0.15; // 15% annual volatility for blue chips
  }

  private calculateLiquidity(holdings: FundHolding[]): number {
    // Implementation for liquidity calculation
    return 0.7; // 70% liquidity score
  }

  private calculateConcentration(holdings: FundHolding[]): number {
    // Implementation for concentration calculation
    return Math.max(...holdings.map(h => h.weight));
  }

  private calculateSharpeRatio(holdings: FundHolding[]): number {
    const riskFreeRate = 0.02; // 2% risk-free rate
    const expectedReturn = this.calculateExpectedReturn(holdings);
    const volatility = this.calculateVolatility(holdings);
    
    return (expectedReturn - riskFreeRate) / volatility;
  }

  private calculateHistoricalReturns(holdings: FundHolding[]): {
    oneYear: number;
    threeYear: number;
    fiveYear: number;
  } {
    // Implementation for historical returns calculation
    return {
      oneYear: 0.12,   // 12% annual return
      threeYear: 0.35, // 35% three-year return
      fiveYear: 0.65   // 65% five-year return
    };
  }

  public createFractionalBond(
    comic: string,
    grade: string,
    totalShares: number
  ): Bond {
    const baseValue = this.getComicValue(comic, grade);
    const sharePrice = baseValue / totalShares;
    
    return {
      id: crypto.randomUUID(),
      comic,
      grade,
      totalShares,
      sharePrice,
      availableShares: totalShares,
      couponRate: this.calculateCouponRate(comic, grade),
      maturity: this.calculateMaturity(),
      rating: this.calculateRating(comic, grade)
    };
  }

  private calculateCouponRate(comic: string, grade: string): number {
    const baseRate = 0.04; // 4% base rate
    const gradeBonus = this.GRADE_MULTIPLIERS[grade] * 0.02; // Up to 2% grade bonus
    const rarity = this.calculateRarity(comic);
    
    return baseRate + gradeBonus + (rarity * 0.01);
  }

  private calculateMaturity(): Date {
    const maturity = new Date();
    maturity.setFullYear(maturity.getFullYear() + 5); // 5-year bonds
    return maturity;
  }

  private calculateRating(comic: string, grade: string): string {
    const score = this.calculateRatingScore(comic, grade);
    
    if (score >= 90) return 'AAA';
    if (score >= 80) return 'AA';
    if (score >= 70) return 'A';
    if (score >= 60) return 'BBB';
    return 'BB';
  }

  private calculateRatingScore(comic: string, grade: string): number {
    const rarity = this.calculateRarity(comic);
    const gradeScore = this.GRADE_MULTIPLIERS[grade] * 100;
    const marketScore = this.calculateMarketScore(comic);
    
    return (rarity * 0.4) + (gradeScore * 0.4) + (marketScore * 0.2);
  }

  private calculateRarity(comic: string): number {
    // Implementation for rarity calculation
    return 0.8; // 80% rarity score
  }

  private calculateMarketScore(comic: string): number {
    // Implementation for market score calculation
    return 0.75; // 75% market score
  }
}</content>