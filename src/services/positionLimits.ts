import type { Position, AssetClass, PositionLimit, RiskLevel } from '../types';

export class PositionLimitManager {
  private readonly BASE_LIMITS: Record<AssetClass, number> = {
    comic: 1000000,      // 1M CC for physical comics
    bond: 2000000,       // 2M CC for creator/publisher bonds
    option: 500000,      // 500K CC for options
    future: 750000,      // 750K CC for futures
    index: 1500000,      // 1.5M CC for indices
    spec: 250000         // 250K CC for speculative assets
  };

  private readonly RISK_MULTIPLIERS: Record<RiskLevel, number> = {
    low: 1.2,            // 20% more for low-risk assets
    moderate: 1.0,       // Base limit for moderate risk
    high: 0.7,           // 30% less for high-risk assets
    extreme: 0.4         // 60% less for extreme-risk assets
  };

  private readonly CONCENTRATION_LIMITS: Record<AssetClass, number> = {
    comic: 0.25,         // 25% max portfolio concentration
    bond: 0.30,          // 30% max for bonds
    option: 0.15,        // 15% max for options
    future: 0.20,        // 20% max for futures
    index: 0.35,         // 35% max for indices
    spec: 0.10          // 10% max for speculative assets
  };

  public calculatePositionLimit(
    assetClass: AssetClass,
    riskLevel: RiskLevel,
    portfolioValue: number
  ): PositionLimit {
    const baseLimit = this.BASE_LIMITS[assetClass];
    const riskMultiplier = this.RISK_MULTIPLIERS[riskLevel];
    const concentrationLimit = this.CONCENTRATION_LIMITS[assetClass];

    const absoluteLimit = baseLimit * riskMultiplier;
    const portfolioLimit = portfolioValue * concentrationLimit;

    return {
      absoluteLimit,
      portfolioLimit: Math.min(absoluteLimit, portfolioLimit),
      concentrationLimit,
      riskAdjustedLimit: this.calculateRiskAdjustedLimit(
        absoluteLimit,
        portfolioLimit,
        riskLevel
      )
    };
  }

  private calculateRiskAdjustedLimit(
    absoluteLimit: number,
    portfolioLimit: number,
    riskLevel: RiskLevel
  ): number {
    const volatilityAdjustment = this.calculateVolatilityAdjustment(riskLevel);
    const liquidityAdjustment = this.calculateLiquidityAdjustment(riskLevel);
    
    return Math.min(
      absoluteLimit,
      portfolioLimit
    ) * volatilityAdjustment * liquidityAdjustment;
  }

  private calculateVolatilityAdjustment(riskLevel: RiskLevel): number {
    const volatilityFactors = {
      low: 1.0,
      moderate: 0.9,
      high: 0.7,
      extreme: 0.5
    };
    return volatilityFactors[riskLevel];
  }

  private calculateLiquidityAdjustment(riskLevel: RiskLevel): number {
    const liquidityFactors = {
      low: 1.0,
      moderate: 0.95,
      high: 0.8,
      extreme: 0.6
    };
    return liquidityFactors[riskLevel];
  }

  public validatePosition(position: Position): {
    isValid: boolean;
    violations: string[];
  } {
    const violations: string[] = [];
    const limit = this.calculatePositionLimit(
      position.assetClass,
      position.riskLevel,
      position.portfolioValue
    );

    if (position.value > limit.absoluteLimit) {
      violations.push(`Position exceeds absolute limit of ${limit.absoluteLimit} CC`);
    }

    if (position.value > limit.portfolioLimit) {
      violations.push(`Position exceeds portfolio concentration limit of ${limit.concentrationLimit * 100}%`);
    }

    if (position.value > limit.riskAdjustedLimit) {
      violations.push(`Position exceeds risk-adjusted limit of ${limit.riskAdjustedLimit} CC`);
    }

    return {
      isValid: violations.length === 0,
      violations
    };
  }

  public calculateAvailableMargin(
    position: Position,
    portfolioValue: number
  ): number {
    const limit = this.calculatePositionLimit(
      position.assetClass,
      position.riskLevel,
      portfolioValue
    );

    return Math.max(0, limit.riskAdjustedLimit - position.value);
  }
}